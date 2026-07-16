import { useState } from "react";
import type { Location } from "../data/locations";

interface PortalNodeProps {
  location: Location;
  active: boolean;
  disabled: boolean;
  onOpen: (location: Location, origin: HTMLButtonElement) => void;
}

export function PortalNode({ location, active, disabled, onOpen }: PortalNodeProps) {
  const [inspected, setInspected] = useState(false);

  const handleActivate = (event: React.MouseEvent<HTMLButtonElement>) => {
    const coarsePointer = window.matchMedia("(hover: none), (pointer: coarse)").matches;
    if (coarsePointer && !inspected) {
      setInspected(true);
      return;
    }
    onOpen(location, event.currentTarget);
  };

  return (
    <button
      type="button"
      disabled={disabled}
      className={`portal ${inspected ? "portal--inspected" : ""} ${active ? "portal--active" : ""}`}
      aria-label={`${location.name}. ${inspected ? "Tap again to open." : "Inspect location."}`}
      aria-pressed={active}
      onClick={handleActivate}
      onBlur={() => setInspected(false)}
    >
      <span className="portal__distortion" aria-hidden="true" />
      <span className="portal__ring" aria-hidden="true" />
      <span className="portal__core" aria-hidden="true" />
      <span className="portal__label">
        <span>{location.name}</span>
        <small>{inspected ? "Tap again to open" : location.category}</small>
      </span>
    </button>
  );
}
