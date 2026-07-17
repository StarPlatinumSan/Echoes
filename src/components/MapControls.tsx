import type { InterfaceCopy } from "../data/i18n";

interface MapControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  disabled: boolean;
  copy: InterfaceCopy["mapControls"];
}

export function MapControls({
  onZoomIn,
  onZoomOut,
  onReset,
  disabled,
  copy,
}: MapControlsProps) {
  return (
    <nav className="map-controls" aria-label={copy.controls}>
      <button type="button" onClick={onZoomIn} disabled={disabled} aria-label={copy.zoomIn}>
        +
      </button>
      <button type="button" onClick={onZoomOut} disabled={disabled} aria-label={copy.zoomOut}>
        −
      </button>
      <button
        className="map-controls__reset"
        type="button"
        onClick={onReset}
        disabled={disabled}
        aria-label={copy.reset}
      >
        ↺
      </button>
    </nav>
  );
}
