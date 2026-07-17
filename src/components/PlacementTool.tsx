import type { InterfaceCopy } from "../data/i18n";

export interface PlacementPoint {
  x: number;
  y: number;
}

interface PlacementToolProps {
  point: PlacementPoint | null;
  onCopyCoordinates: () => void;
  onCopyObject: () => void;
  copied: "coordinates" | "object" | null;
  copy: InterfaceCopy["placement"];
}

export function PlacementTool({
  point,
  onCopyCoordinates,
  onCopyObject,
  copied,
  copy,
}: PlacementToolProps) {
  return (
    <aside className="placement-tool" aria-label={copy.ariaLabel}>
      <div className="placement-tool__heading">
        <span className="placement-tool__status" aria-hidden="true" />
        <div>
          <strong>{copy.mode}</strong>
          <small>{copy.developmentOnly}</small>
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
              {copied === "coordinates" ? copy.copied : copy.copyCoordinates}
            </button>
            <button type="button" onClick={onCopyObject}>
              {copied === "object" ? copy.copied : copy.copyObject}
            </button>
          </div>
        </>
      ) : (
        <p>{copy.instruction}</p>
      )}
    </aside>
  );
}
