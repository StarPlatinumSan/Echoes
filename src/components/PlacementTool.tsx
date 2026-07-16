export interface PlacementPoint {
  x: number;
  y: number;
}

interface PlacementToolProps {
  point: PlacementPoint | null;
  onCopyCoordinates: () => void;
  onCopyObject: () => void;
  copied: "coordinates" | "object" | null;
}

export function PlacementTool({
  point,
  onCopyCoordinates,
  onCopyObject,
  copied,
}: PlacementToolProps) {
  return (
    <aside className="placement-tool" aria-label="Development node placement tool">
      <div className="placement-tool__heading">
        <span className="placement-tool__status" aria-hidden="true" />
        <div>
          <strong>Placement mode</strong>
          <small>Development only</small>
        </div>
      </div>
      {point ? (
        <>
          <dl>
            <div>
              <dt>x</dt>
              <dd>{point.x.toFixed(6)}</dd>
            </div>
            <div>
              <dt>y</dt>
              <dd>{point.y.toFixed(6)}</dd>
            </div>
          </dl>
          <div className="placement-tool__actions">
            <button type="button" onClick={onCopyCoordinates}>
              {copied === "coordinates" ? "Copied" : "Copy coordinates"}
            </button>
            <button type="button" onClick={onCopyObject}>
              {copied === "object" ? "Copied" : "Copy location object"}
            </button>
          </div>
        </>
      ) : (
        <p>Click an unmarked point on the map to capture normalized coordinates.</p>
      )}
    </aside>
  );
}
