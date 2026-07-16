import { useEffect, useRef } from "react";
import type { Location } from "../data/locations";
import { StoryCard } from "./StoryCard";

interface LocationPanelProps {
  location: Location;
  onClose: () => void;
}

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

export function LocationPanel({ location, onClose }: LocationPanelProps) {
  const panelRef = useRef<HTMLElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab" || !panelRef.current) return;
      const focusable = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE),
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose, location.id]);

  const titleId = `location-${location.id}-title`;

  return (
    <aside
      ref={panelRef}
      className="location-panel"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <div className="location-panel__rail" aria-hidden="true">
        <span>{String(Math.round(location.x * 100)).padStart(3, "0")}</span>
        <span>{String(Math.round(location.y * 100)).padStart(3, "0")}</span>
      </div>
      <div className="location-panel__scroll">
        <header className="location-panel__header">
          <p className="eyebrow">Archive location</p>
          <button ref={closeRef} type="button" onClick={onClose} aria-label="Close location details">
            <span>Close</span>
            <span aria-hidden="true">×</span>
          </button>
        </header>

        <div className="location-panel__hero">
          <img
            src={location.image}
            alt={`Archival view of ${location.name}`}
            loading="lazy"
            decoding="async"
            sizes="(max-width: 720px) 100vw, 460px"
          />
          <span className="location-panel__image-index" aria-hidden="true">
            VE / {location.id.slice(0, 2).toUpperCase()}
          </span>
        </div>

        <div className="location-panel__content">
          <p className="location-panel__category">{location.category}</p>
          <h2 id={titleId}>{location.name}</h2>
          <p className="location-panel__summary">{location.summary}</p>

          {location.sections?.map((section, index) => (
            <section className="lore-section" key={section.title}>
              <p className="lore-section__index" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </p>
              <div>
                <h3>{section.title}</h3>
                <p>{section.body}</p>
              </div>
            </section>
          ))}

          {location.stories && location.stories.length > 0 && (
            <section className="related-stories" aria-labelledby={`stories-${location.id}`}>
              <div className="related-stories__heading">
                <p className="eyebrow">Related transmissions</p>
                <span>{String(location.stories.length).padStart(2, "0")}</span>
              </div>
              <h3 id={`stories-${location.id}`}>Stories from this place</h3>
              <div className="related-stories__grid">
                {location.stories.map((story) => (
                  <StoryCard key={story.id} story={story} />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </aside>
  );
}
