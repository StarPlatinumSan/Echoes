import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import OpenSeadragon from "openseadragon";
import { locations, type Location } from "../data/locations";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { calculateMapDistanceKm, type MapPoint } from "../lib/mapDistance";
import { DistanceTool } from "./DistanceTool";
import { MapControls } from "./MapControls";
import { PlacementTool, type PlacementPoint } from "./PlacementTool";
import { PortalNode } from "./PortalNode";

interface WorldMapProps {
  interactive: boolean;
  selectedLocation: Location | null;
  onOpenLocation: (location: Location, origin: HTMLButtonElement) => void;
}

interface PortalOverlay {
  container: HTMLDivElement;
  location: Location;
  tracker: OpenSeadragon.MouseTracker;
}

type AdaptiveViewport = OpenSeadragon.Viewport & { visibilityRatio: number };
type PortalTrackerClickEvent = OpenSeadragon.MouseTrackerEvent<PointerEvent> & {
  quick: boolean;
  originalTarget?: EventTarget | null;
};
interface ScreenPoint {
  x: number;
  y: number;
}

const tileSource = import.meta.env.VITE_MAP_TILE_SOURCE || "/map/world-map.dzi";
const minZoom = Number(import.meta.env.VITE_MAP_MIN_ZOOM || 0.9);
const maxZoom = Number(import.meta.env.VITE_MAP_MAX_ZOOM || 6);
const placementEnabled =
  import.meta.env.DEV && import.meta.env.VITE_ENABLE_PLACEMENT_MODE === "true";

export function WorldMap({
  interactive,
  selectedLocation,
  onOpenLocation,
}: WorldMapProps) {
  const viewerElementRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<OpenSeadragon.Viewer | null>(null);
  const portalOverlaysRef = useRef<Map<string, PortalOverlay>>(new Map());
  const [portalOverlays, setPortalOverlays] = useState<PortalOverlay[]>([]);
  const interactiveRef = useRef(interactive);
  const onOpenLocationRef = useRef(onOpenLocation);
  const measurementActiveRef = useRef(false);
  const measurementPointsRef = useRef<MapPoint[]>([]);
  const measurementOverlayUpdaterRef = useRef<(() => void) | null>(null);
  const reducedMotion = useReducedMotion();
  const [ready, setReady] = useState(false);
  const [fatalError, setFatalError] = useState<string | null>(null);
  const [tileWarning, setTileWarning] = useState<string | null>(null);
  const [placementPoint, setPlacementPoint] = useState<PlacementPoint | null>(null);
  const [copied, setCopied] = useState<"coordinates" | "object" | null>(null);
  const [measurementActive, setMeasurementActive] = useState(false);
  const [measurementPoints, setMeasurementPoints] = useState<MapPoint[]>([]);
  const [measurementScreenPoints, setMeasurementScreenPoints] = useState<ScreenPoint[]>([]);

  interactiveRef.current = interactive;
  onOpenLocationRef.current = onOpenLocation;
  measurementActiveRef.current = measurementActive;
  measurementPointsRef.current = measurementPoints;

  const addMeasurementPoint = useCallback((point: MapPoint) => {
    setMeasurementPoints((current) =>
      current.length >= 2 ? [point] : [...current, point],
    );
  }, []);

  const mountPortalOverlays = useCallback(
    (viewer: OpenSeadragon.Viewer) => {
      portalOverlaysRef.current.forEach(({ tracker }) => tracker.destroy());
      viewer.clearOverlays();
      portalOverlaysRef.current.clear();
      const item = viewer.world.getItemAt(0);
      if (!item) return;
      const contentSize = item.getContentSize();
      const nextPortalOverlays: PortalOverlay[] = [];

      locations.forEach((location) => {
        const container = document.createElement("div");
        container.className = "portal-overlay";
        container.dataset.locationId = location.id;
        const tracker = new OpenSeadragon.MouseTracker({
          element: container,
          preProcessEventHandler: (event) => {
            if (
              event.eventType === "pointerdown" ||
              event.eventType === "pointerup" ||
              event.eventType === "pointercancel" ||
              event.eventType === "click" ||
              event.eventType === "dblclick"
            ) {
              event.stopPropagation = true;
            }
          },
          clickHandler: (event) => {
            const clickEvent = event as PortalTrackerClickEvent;
            if (!clickEvent.quick || !interactiveRef.current) return;

            const target = clickEvent.originalTarget ?? clickEvent.originalEvent.target;
            const button =
              target instanceof Element
                ? target.closest<HTMLButtonElement>(".portal")
                : container.querySelector<HTMLButtonElement>(".portal");
            if (!button || button.disabled) return;

            clickEvent.originalEvent.preventDefault();
            clickEvent.originalEvent.stopPropagation();
            if (measurementActiveRef.current) {
              addMeasurementPoint({ x: location.x, y: location.y });
            } else {
              onOpenLocationRef.current(location, button);
            }
          },
        });
        const overlay = { container, location, tracker };
        portalOverlaysRef.current.set(location.id, overlay);
        nextPortalOverlays.push(overlay);

        const viewportPoint = item.imageToViewportCoordinates(
          location.x * contentSize.x,
          location.y * contentSize.y,
        );
        viewer.addOverlay({
          element: container,
          location: viewportPoint,
          placement: OpenSeadragon.Placement.CENTER,
          checkResize: false,
        });
      });

      setPortalOverlays(nextPortalOverlays);
    },
    [addMeasurementPoint],
  );

  useEffect(() => {
    if (!viewerElementRef.current) return;
    const portalOverlays = portalOverlaysRef.current;

    const viewer = OpenSeadragon({
      element: viewerElementRef.current,
      tileSources: tileSource,
      showNavigationControl: false,
      showNavigator: false,
      animationTime: reducedMotion ? 0 : 1.35,
      blendTime: reducedMotion ? 0 : 0.18,
      springStiffness: reducedMotion ? 100 : 7,
      minZoomImageRatio: Number.isFinite(minZoom) ? minZoom : 0.9,
      maxZoomPixelRatio: Number.isFinite(maxZoom) ? maxZoom : 6,
      visibilityRatio: 0.62,
      constrainDuringPan: true,
      wrapHorizontal: false,
      wrapVertical: false,
      preserveViewport: true,
      gestureSettingsMouse: {
        clickToZoom: false,
        dblClickToZoom: true,
        dragToPan: true,
        scrollToZoom: true,
        pinchToZoom: true,
      },
      gestureSettingsTouch: {
        clickToZoom: false,
        dblClickToZoom: true,
        dragToPan: true,
        scrollToZoom: false,
        pinchToZoom: true,
      },
    });
    viewerRef.current = viewer;
    viewer.setMouseNavEnabled(interactiveRef.current);
    const mapElement = viewer.element.closest(".world-map") as HTMLElement | null;
    let isStrictlyConstrained = false;
    let disposed = false;

    const updateMeasurementOverlay = () => {
      if (disposed) return;
      const item = viewer.world.getItemAt(0);
      if (!item || measurementPointsRef.current.length === 0) {
        setMeasurementScreenPoints([]);
        return;
      }

      const size = item.getContentSize();
      setMeasurementScreenPoints(
        measurementPointsRef.current.map((point) => {
          const viewportPoint = item.imageToViewportCoordinates(
            point.x * size.x,
            point.y * size.y,
          );
          const pixel = viewer.viewport.pixelFromPoint(viewportPoint, true);
          return { x: pixel.x, y: pixel.y };
        }),
      );
    };
    measurementOverlayUpdaterRef.current = updateMeasurementOverlay;

    const updateViewportPresentation = () => {
      if (viewer.world.getItemCount() === 0) return;
      const homeZoom = viewer.viewport.getHomeZoom();
      const currentZoom = viewer.viewport.getZoom();
      const relativeZoom = homeZoom > 0 ? currentZoom / homeZoom : 1;
      const scale = Math.min(1, 0.72 + Math.max(0, relativeZoom - 1) * 0.24);
      viewer.element.style.setProperty("--portal-zoom-scale", scale.toFixed(3));

      const ringReveal = Math.min(
        1,
        Math.max(0, (relativeZoom - 1) / 0.85),
      );
      viewer.element.style.setProperty(
        "--portal-ring-reveal",
        ringReveal.toFixed(3),
      );

      const visibleBounds = viewer.viewport.getBounds(true);
      const contentBounds = viewer.world.getHomeBounds();
      const coverageTolerance = 0.001;
      const imageCoversViewport =
        visibleBounds.width <= contentBounds.width + coverageTolerance &&
        visibleBounds.height <= contentBounds.height + coverageTolerance;

      if (imageCoversViewport !== isStrictlyConstrained) {
        isStrictlyConstrained = imageCoversViewport;
        (viewer.viewport as AdaptiveViewport).visibilityRatio = imageCoversViewport
          ? 1
          : 0.62;
        if (imageCoversViewport) viewer.viewport.applyConstraints(reducedMotion);
      }

      const fadeProgress = Math.min(
        1,
        Math.max(0, (relativeZoom - 1) / 3.5),
      );
      const vignetteOpacity = Math.pow(fadeProgress, 0.8);
      mapElement?.style.setProperty(
        "--map-vignette-opacity",
        vignetteOpacity.toFixed(3),
      );
    };

    viewer.addHandler("open", () => {
      if (disposed) return;
      setFatalError(null);
      setReady(true);
      mountPortalOverlays(viewer);
      updateViewportPresentation();
      updateMeasurementOverlay();
    });

    viewer.addHandler("zoom", () => {
      updateViewportPresentation();
      updateMeasurementOverlay();
    });
    viewer.addHandler("pan", updateMeasurementOverlay);
    viewer.addHandler("animation", updateMeasurementOverlay);
    viewer.addHandler("resize", () => {
      updateViewportPresentation();
      updateMeasurementOverlay();
    });

    viewer.addHandler("open-failed", () => {
      setReady(false);
      setFatalError(
        "The map archive could not be opened. Check the DZI descriptor and tile folder.",
      );
    });

    viewer.addHandler("tile-load-failed", () => {
      setTileWarning("One map tile was unavailable. Navigation remains active.");
    });

    viewer.addHandler("canvas-click", (event) => {
      if (!event.quick || event.originalTarget.closest(".portal")) return;
      const item = viewer.world.getItemAt(0);
      if (!item) return;

      const viewportPoint = viewer.viewport.pointFromPixel(event.position);
      const imagePoint = item.viewportToImageCoordinates(viewportPoint);
      const size = item.getContentSize();
      const point = {
        x: imagePoint.x / size.x,
        y: imagePoint.y / size.y,
      };
      const pointIsOnMap =
        point.x >= 0 && point.x <= 1 && point.y >= 0 && point.y <= 1;
      if (!pointIsOnMap) return;

      if (measurementActiveRef.current && interactiveRef.current) {
        addMeasurementPoint(point);
        event.preventDefaultAction = true;
        return;
      }

      if (placementEnabled) {
        setPlacementPoint(point);
        setCopied(null);

        const oldMarker = document.getElementById("placement-preview");
        if (oldMarker) viewer.removeOverlay(oldMarker);
        const marker = document.createElement("div");
        marker.id = "placement-preview";
        marker.className = "placement-preview";
        marker.setAttribute("aria-hidden", "true");
        viewer.addOverlay({
          element: marker,
          location: item.imageToViewportCoordinates(imagePoint),
          placement: OpenSeadragon.Placement.CENTER,
          checkResize: false,
        });
        event.preventDefaultAction = true;
      }
    });

    return () => {
      disposed = true;
      measurementOverlayUpdaterRef.current = null;
      portalOverlays.forEach(({ tracker }) => tracker.destroy());
      portalOverlays.clear();
      viewer.destroy();
      viewerRef.current = null;
    };
  }, [addMeasurementPoint, mountPortalOverlays, reducedMotion]);

  useEffect(() => {
    measurementOverlayUpdaterRef.current?.();
  }, [measurementPoints]);

  useEffect(() => {
    viewerRef.current?.setMouseNavEnabled(interactive);
  }, [interactive]);

  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer || !selectedLocation || !ready) return;
    const item = viewer.world.getItemAt(0);
    if (!item) return;
    const size = item.getContentSize();
    const point = item.imageToViewportCoordinates(
      selectedLocation.x * size.x,
      selectedLocation.y * size.y,
    );
    const targetZoom = Math.max(viewer.viewport.getHomeZoom() * 2.15, 1.35);
    viewer.viewport.panTo(point, reducedMotion);
    viewer.viewport.zoomTo(targetZoom, point, reducedMotion);
    viewer.viewport.applyConstraints(reducedMotion);
  }, [ready, reducedMotion, selectedLocation]);

  const zoomBy = (factor: number) => {
    const viewport = viewerRef.current?.viewport;
    if (!viewport) return;
    viewport.zoomBy(factor);
    viewport.applyConstraints(reducedMotion);
  };

  const reset = () => viewerRef.current?.viewport.goHome(reducedMotion);

  const openMeasurement = () => {
    setMeasurementPoints([]);
    setMeasurementActive(true);
  };

  const closeMeasurement = () => {
    setMeasurementActive(false);
    setMeasurementPoints([]);
    setMeasurementScreenPoints([]);
  };

  const resetMeasurement = () => setMeasurementPoints([]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!interactive || event.currentTarget !== event.target) return;
    const viewport = viewerRef.current?.viewport;
    if (!viewport) return;
    const bounds = viewport.getBounds();
    const stepX = bounds.width * 0.09;
    const stepY = bounds.height * 0.09;

    const moves: Record<string, OpenSeadragon.Point> = {
      ArrowLeft: new OpenSeadragon.Point(-stepX, 0),
      ArrowRight: new OpenSeadragon.Point(stepX, 0),
      ArrowUp: new OpenSeadragon.Point(0, -stepY),
      ArrowDown: new OpenSeadragon.Point(0, stepY),
    };

    if (moves[event.key]) {
      event.preventDefault();
      viewport.panBy(moves[event.key], reducedMotion);
      viewport.applyConstraints(reducedMotion);
    } else if (event.key === "+" || event.key === "=") {
      event.preventDefault();
      zoomBy(1.35);
    } else if (event.key === "-" || event.key === "_") {
      event.preventDefault();
      zoomBy(1 / 1.35);
    } else if (event.key === "Home" || event.key === "0") {
      event.preventDefault();
      reset();
    }
  };

  const copyText = async (value: string, kind: "coordinates" | "object") => {
    await navigator.clipboard.writeText(value);
    setCopied(kind);
    window.setTimeout(() => setCopied(null), 1600);
  };

  const coordinateText = placementPoint
    ? `x: ${placementPoint.x.toFixed(6)}, y: ${placementPoint.y.toFixed(6)}`
    : "";
  const starterObject = placementPoint
    ? JSON.stringify(
        {
          id: "new-location",
          name: "New Location",
          category: "Uncatalogued",
          x: Number(placementPoint.x.toFixed(6)),
          y: Number(placementPoint.y.toFixed(6)),
          image: "/images/locations/new-location.webp",
          population: "Population pending",
          description: "Add a concise archival description.",
        },
        null,
        2,
      )
    : "";
  const measuredDistanceKm =
    measurementPoints.length === 2
      ? calculateMapDistanceKm(measurementPoints[0], measurementPoints[1])
      : null;
  const measurementMidpoint =
    measurementScreenPoints.length === 2
      ? {
          x: (measurementScreenPoints[0].x + measurementScreenPoints[1].x) / 2,
          y: (measurementScreenPoints[0].y + measurementScreenPoints[1].y) / 2,
        }
      : null;

  return (
    <section
      className={`world-map ${interactive ? "world-map--interactive" : ""} ${measurementActive ? "world-map--measuring" : ""}`}
      aria-label="World map"
    >
      <div className="vault-backdrop" aria-hidden="true">
        <span className="vault-backdrop__door" />
        <span className="vault-backdrop__hub" />
        <span className="vault-backdrop__seal" />
      </div>
      <div
        ref={viewerElementRef}
        className="world-map__viewer"
        tabIndex={interactive ? 0 : -1}
        onKeyDown={handleKeyDown}
        aria-label="Interactive map. Drag to pan, scroll or use plus and minus to zoom, arrow keys to move, and Home to reset."
      />
      <div className="map-zoom-vignette" aria-hidden="true" />

      {measurementScreenPoints.length > 0 && (
        <svg className="distance-overlay" aria-hidden="true">
          {measurementScreenPoints.length === 2 && (
            <>
              <line
                className="distance-overlay__line distance-overlay__line--shadow"
                x1={measurementScreenPoints[0].x}
                y1={measurementScreenPoints[0].y}
                x2={measurementScreenPoints[1].x}
                y2={measurementScreenPoints[1].y}
              />
              <line
                className="distance-overlay__line"
                x1={measurementScreenPoints[0].x}
                y1={measurementScreenPoints[0].y}
                x2={measurementScreenPoints[1].x}
                y2={measurementScreenPoints[1].y}
              />
            </>
          )}
          {measurementScreenPoints.map((point, index) => (
            <g key={index}>
              <circle className="distance-overlay__point-halo" cx={point.x} cy={point.y} r="11" />
              <circle className="distance-overlay__point" cx={point.x} cy={point.y} r="4" />
            </g>
          ))}
          {measurementMidpoint && measuredDistanceKm !== null && (
            <g className="distance-overlay__label">
              <rect
                x={measurementMidpoint.x - 43}
                y={measurementMidpoint.y - 14}
                width="86"
                height="28"
                rx="2"
              />
              <text x={measurementMidpoint.x} y={measurementMidpoint.y + 4} textAnchor="middle">
                {Math.round(measuredDistanceKm).toLocaleString()} km
              </text>
            </g>
          )}
        </svg>
      )}

      {portalOverlays.map(({ container, location }) =>
        createPortal(
          <PortalNode
            location={location}
            active={selectedLocation?.id === location.id}
            disabled={!interactive}
            onOpen={(location, origin) => {
              if (measurementActive) {
                addMeasurementPoint({ x: location.x, y: location.y });
              } else {
                onOpenLocation(location, origin);
              }
            }}
          />,
          container,
          location.id,
        ),
      )}

      {!ready && !fatalError && (
        <div className="map-loading" role="status" aria-live="polite">
          <span className="map-loading__dial" aria-hidden="true" />
          <p>Opening the cartographic index</p>
        </div>
      )}

      {fatalError && (
        <div className="map-error" role="alert">
          <p className="eyebrow">Archive interruption</p>
          <h2>Map unavailable</h2>
          <p>{fatalError}</p>
          <button type="button" onClick={() => viewerRef.current?.open(tileSource)}>
            Retry map
          </button>
        </div>
      )}

      {tileWarning && interactive && (
        <button className="tile-warning" type="button" onClick={() => setTileWarning(null)}>
          {tileWarning} <span aria-hidden="true">×</span>
        </button>
      )}

      <MapControls
        onZoomIn={() => zoomBy(1.35)}
        onZoomOut={() => zoomBy(1 / 1.35)}
        onReset={reset}
        disabled={!interactive || !ready}
      />

      <DistanceTool
        active={measurementActive}
        disabled={!interactive || !ready}
        pointCount={measurementPoints.length}
        distanceKm={measuredDistanceKm}
        onOpen={openMeasurement}
        onClose={closeMeasurement}
        onReset={resetMeasurement}
      />

      {placementEnabled && interactive && (
        <PlacementTool
          point={placementPoint}
          copied={copied}
          onCopyCoordinates={() => void copyText(coordinateText, "coordinates")}
          onCopyObject={() => void copyText(starterObject, "object")}
        />
      )}
    </section>
  );
}
