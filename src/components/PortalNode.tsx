import type { InterfaceCopy } from "../data/i18n";
import type { Location } from "../data/locations";

interface PortalNodeProps {
  location: Location;
  active: boolean;
  disabled: boolean;
  copy: InterfaceCopy["portal"];
  onOpen: (location: Location, origin: HTMLButtonElement) => void;
}

export function PortalNode({
  location,
  active,
  disabled,
  copy,
  onOpen,
}: PortalNodeProps) {
  const handleActivate = (event: React.MouseEvent<HTMLButtonElement>) => {
    // Pointer activation is handled by OpenSeadragon's MouseTracker. Native
    // detail === 0 clicks are retained for keyboard and assistive technology.
    if (event.detail !== 0) return;
    onOpen(location, event.currentTarget);
  };

  return (
    <button
      type="button"
      disabled={disabled}
      className={`portal ${active ? "portal--active" : ""}`}
      aria-label={`${copy.open} ${location.name}`}
      aria-pressed={active}
      onClick={handleActivate}
    >
      <span className="portal__distortion" aria-hidden="true" />
      <span className="portal__ring" aria-hidden="true" />
      <span className="portal__core" aria-hidden="true" />
      <span className="portal__label">
        <span>{location.name}</span>
        <small>{location.category}</small>
      </span>
    </button>
  );
}
