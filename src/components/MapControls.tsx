interface MapControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  disabled: boolean;
}

export function MapControls({
  onZoomIn,
  onZoomOut,
  onReset,
  disabled,
}: MapControlsProps) {
  return (
    <nav className="map-controls" aria-label="Map controls">
      <button type="button" onClick={onZoomIn} disabled={disabled} aria-label="Zoom in">
        +
      </button>
      <button type="button" onClick={onZoomOut} disabled={disabled} aria-label="Zoom out">
        −
      </button>
      <button
        className="map-controls__reset"
        type="button"
        onClick={onReset}
        disabled={disabled}
        aria-label="Reset map to world view"
      >
        ↺
      </button>
    </nav>
  );
}
