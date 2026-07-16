import { useCallback, useEffect, useRef, useState } from "react";
import { createRoot, type Root } from "react-dom/client";
import OpenSeadragon from "openseadragon";
import { locations, type Location } from "../data/locations";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { MapControls } from "./MapControls";
import { PlacementTool, type PlacementPoint } from "./PlacementTool";
import { PortalNode } from "./PortalNode";

interface WorldMapProps {
  interactive: boolean;
  selectedLocation: Location | null;
  onOpenLocation: (location: Location, origin: HTMLButtonElement) => void;
}

interface PortalOverlay {
  root: Root;
  container: HTMLDivElement;
  location: Location;
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
  const interactiveRef = useRef(interactive);
  const selectedLocationRef = useRef(selectedLocation);
  const onOpenLocationRef = useRef(onOpenLocation);
  const reducedMotion = useReducedMotion();
  const [ready, setReady] = useState(false);
  const [fatalError, setFatalError] = useState<string | null>(null);
  const [tileWarning, setTileWarning] = useState<string | null>(null);
  const [placementPoint, setPlacementPoint] = useState<PlacementPoint | null>(null);
  const [copied, setCopied] = useState<"coordinates" | "object" | null>(null);

  interactiveRef.current = interactive;
  selectedLocationRef.current = selectedLocation;
  onOpenLocationRef.current = onOpenLocation;

  const renderPortal = useCallback(
    (overlay: PortalOverlay) => {
      overlay.root.render(
        <PortalNode
          location={overlay.location}
          active={selectedLocationRef.current?.id === overlay.location.id}
          disabled={!interactiveRef.current}
          onOpen={(location, origin) => onOpenLocationRef.current(location, origin)}
        />,
      );
    },
    [],
  );

  const clearPortalOverlays = useCallback(() => {
    const viewer = viewerRef.current;
    portalOverlaysRef.current.forEach(({ root }) => root.unmount());
    portalOverlaysRef.current.clear();
    viewer?.clearOverlays();
  }, []);

  const mountPortalOverlays = useCallback(
    (viewer: OpenSeadragon.Viewer) => {
      clearPortalOverlays();
      const item = viewer.world.getItemAt(0);
      if (!item) return;
      const contentSize = item.getContentSize();

      locations.forEach((location) => {
        const container = document.createElement("div");
        container.className = "portal-overlay";
        container.dataset.locationId = location.id;
        const root = createRoot(container);
        const overlay = { root, container, location };
        portalOverlaysRef.current.set(location.id, overlay);
        renderPortal(overlay);

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
    },
    [clearPortalOverlays, renderPortal],
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
      visibilityRatio: 1,
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

    viewer.addHandler("open", () => {
      setFatalError(null);
      setReady(true);
      mountPortalOverlays(viewer);
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

    if (placementEnabled) {
      viewer.addHandler("canvas-click", (event) => {
        if (!event.quick || event.originalTarget.closest(".portal")) return;
        const item = viewer.world.getItemAt(0);
        if (!item) return;

        const viewportPoint = viewer.viewport.pointFromPixel(event.position);
        const imagePoint = item.viewportToImageCoordinates(viewportPoint);
        const size = item.getContentSize();
        const point = {
          x: Math.min(1, Math.max(0, imagePoint.x / size.x)),
          y: Math.min(1, Math.max(0, imagePoint.y / size.y)),
        };
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
      });
    }

    return () => {
      portalOverlays.forEach(({ root }) => root.unmount());
      portalOverlays.clear();
      viewer.destroy();
      viewerRef.current = null;
    };
  }, [mountPortalOverlays, reducedMotion]);

  useEffect(() => {
    viewerRef.current?.setMouseNavEnabled(interactive);
    portalOverlaysRef.current.forEach(renderPortal);
  }, [interactive, renderPortal]);

  useEffect(() => {
    portalOverlaysRef.current.forEach(renderPortal);
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
  }, [ready, reducedMotion, renderPortal, selectedLocation]);

  const zoomBy = (factor: number) => {
    const viewport = viewerRef.current?.viewport;
    if (!viewport) return;
    viewport.zoomBy(factor);
    viewport.applyConstraints(reducedMotion);
  };

  const reset = () => viewerRef.current?.viewport.goHome(reducedMotion);

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
          image: "/assets/new-location.webp",
          summary: "Add a concise archival summary.",
        },
        null,
        2,
      )
    : "";

  return (
    <section className={`world-map ${interactive ? "world-map--interactive" : ""}`} aria-label="World map">
      <div
        ref={viewerElementRef}
        className="world-map__viewer"
        tabIndex={interactive ? 0 : -1}
        onKeyDown={handleKeyDown}
        aria-label="Interactive map. Drag to pan, scroll or use plus and minus to zoom, arrow keys to move, and Home to reset."
      />

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
