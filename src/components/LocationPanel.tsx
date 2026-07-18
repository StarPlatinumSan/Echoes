import { useEffect, useRef, useState } from "react";
import type { InterfaceCopy } from "../data/i18n";
import type { Location } from "../data/locations";
import { StoryCard } from "./StoryCard";

interface LocationPanelProps {
  location: Location;
  closing: boolean;
  copy: InterfaceCopy["location"];
  onClose: () => void;
}

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

export function LocationPanel({
  location,
  closing,
  copy,
  onClose,
}: LocationPanelProps) {
  const panelRef = useRef<HTMLElement>(null);
  const archivePanelRef = useRef<HTMLElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const archiveTriggerRef = useRef<HTMLButtonElement>(null);
  const archiveCloseRef = useRef<HTMLButtonElement>(null);
  const image = location.image?.trim();
  const fallbackImage = location.fallbackImage?.trim();
  const [imageSource, setImageSource] = useState(image);
  const [archiveOpen, setArchiveOpen] = useState(false);
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const sections = location.sections ?? [];
  const activeSection = sections[activeSectionIndex];
  const population = location.population?.trim();
  const description = location.description?.trim();
  const linkUrl = location.link?.url?.trim();
  const linkLabel = location.link?.label?.trim() || copy.openLink;
  const hasLongTitleWord = location.name
    .split(/\s+/)
    .some((word) => word.length >= 10);

  useEffect(() => setImageSource(image), [image, location.id]);

  useEffect(() => {
    setArchiveOpen(false);
    setActiveSectionIndex(0);
  }, [location.id]);

  useEffect(() => closeRef.current?.focus(), [location.id]);

  useEffect(() => {
    if (archiveOpen) archiveCloseRef.current?.focus();
  }, [archiveOpen]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        if (archiveOpen) {
          setArchiveOpen(false);
          window.requestAnimationFrame(() => archiveTriggerRef.current?.focus());
          return;
        }
        onClose();
        return;
      }

      const activePanel = archiveOpen
        ? archivePanelRef.current
        : panelRef.current;
      if (event.key !== "Tab" || !activePanel) return;
      const focusable = Array.from(
        activePanel.querySelectorAll<HTMLElement>(FOCUSABLE),
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
  }, [archiveOpen, onClose, location.id]);

  const titleId = `location-${location.id}-title`;
  const descriptionId = `location-${location.id}-description`;
  const archiveTitleId = `archive-${location.id}-title`;

  const openArchive = () => {
    archiveTriggerRef.current?.blur();
    setArchiveOpen(true);
  };

  const closeArchive = () => {
    setArchiveOpen(false);
    window.requestAnimationFrame(() => archiveTriggerRef.current?.focus());
  };

  return (
    <>
      <aside
        ref={panelRef}
        className={[
          "location-panel",
          closing ? "location-panel--closing" : "",
          archiveOpen ? "location-panel--archive-open" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        role="dialog"
        aria-modal={!archiveOpen}
        aria-hidden={archiveOpen || undefined}
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
      >
      <div className="location-panel__rail" aria-hidden="true">
        <span>{String(Math.round(location.x * 100)).padStart(3, "0")}</span>
        <span>{String(Math.round(location.y * 100)).padStart(3, "0")}</span>
      </div>
      <div className="location-panel__scroll">
        <header className="location-panel__header">
          <p className="eyebrow">{copy.archiveLocation}</p>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label={copy.closeDetails}
          >
            <span>{copy.close}</span>
            <span aria-hidden="true">×</span>
          </button>
        </header>

        {imageSource && (
          <div className="location-panel__hero">
            <img
              src={imageSource}
              alt={`${copy.archivalView} ${location.name}`}
              loading="lazy"
              decoding="async"
              sizes="(max-width: 720px) 100vw, 460px"
              onError={() => {
                if (fallbackImage && imageSource !== fallbackImage) {
                  setImageSource(fallbackImage);
                } else {
                  setImageSource(undefined);
                }
              }}
            />
            <span className="location-panel__image-index" aria-hidden="true">
              VE / {location.id.slice(0, 2).toUpperCase()}
            </span>
          </div>
        )}

        <div className="location-panel__content">
          <p className="location-panel__category">{location.category}</p>
          <h2
            id={titleId}
            className={hasLongTitleWord ? "location-panel__title--long" : undefined}
          >
            {location.name}
          </h2>
          {population && (
            <p className="location-panel__population">
              <span>{copy.population}</span>
              <strong>{population}</strong>
            </p>
          )}
          {description && (
            <p id={descriptionId} className="location-panel__summary">
              {description}
            </p>
          )}

          {location.link &&
            (linkUrl ? (
              <a
                className="location-panel__external-link"
                href={linkUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {linkLabel}
                <span aria-hidden="true">↗</span>
              </a>
            ) : (
              <button
                className="location-panel__external-link"
                type="button"
                disabled
              >
                {linkLabel}
                <span aria-hidden="true">—</span>
              </button>
            ))}

          {sections.length > 0 && (
            <button
              ref={archiveTriggerRef}
              className="location-panel__archive-trigger"
              type="button"
              aria-controls={`archive-${location.id}`}
              aria-expanded={archiveOpen}
              aria-label={copy.openArchive}
              onClick={openArchive}
            >
              <span
                className="location-panel__archive-trigger-index"
                aria-hidden="true"
              >
                {String(sections.length).padStart(2, "0")}
              </span>
              <span className="location-panel__archive-trigger-copy">
                <small>{copy.archiveEntries}</small>
                <strong>{copy.openArchive}</strong>
              </span>
              <span
                className="location-panel__archive-trigger-arrow"
                aria-hidden="true"
              >
                ←
              </span>
            </button>
          )}

          {location.stories && location.stories.length > 0 && (
            <section className="related-stories" aria-labelledby={`stories-${location.id}`}>
              <div className="related-stories__heading">
                <p className="eyebrow">{copy.relatedTransmissions}</p>
                <span>{String(location.stories.length).padStart(2, "0")}</span>
              </div>
              <h3 id={`stories-${location.id}`}>{copy.storiesFromPlace}</h3>
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

      {archiveOpen && activeSection && (
        <aside
          ref={archivePanelRef}
          id={`archive-${location.id}`}
          className={`archive-drawer ${
            closing ? "archive-drawer--closing" : ""
          }`}
          role="dialog"
          aria-modal="true"
          aria-labelledby={archiveTitleId}
        >
          <div className="archive-drawer__surface">
            <header className="archive-drawer__header">
              <div>
                <p className="eyebrow">{copy.archiveEntries}</p>
                <h2 id={archiveTitleId}>{location.name}</h2>
              </div>
              <button
                ref={archiveCloseRef}
                type="button"
                onClick={closeArchive}
                aria-label={copy.closeArchive}
              >
                <span>{copy.close}</span>
                <span aria-hidden="true">×</span>
              </button>
            </header>

            <div className="archive-drawer__body">
              <div className="archive-entries__heading">
                <p className="eyebrow">
                  AR / {location.id.toUpperCase()}
                </p>
                <span>
                  {String(activeSectionIndex + 1).padStart(2, "0")} /{" "}
                  {String(sections.length).padStart(2, "0")}
                </span>
              </div>

              <div className="archive-entries__viewport" aria-live="polite">
                <article
                  className="lore-section"
                  key={`${location.id}-${activeSectionIndex}`}
                >
                  <p className="lore-section__index" aria-hidden="true">
                    {String(activeSectionIndex + 1).padStart(2, "0")}
                  </p>
                  <div>
                    <h3>{activeSection.title}</h3>
                    <p>{activeSection.body}</p>
                  </div>
                </article>
              </div>

              <nav
                className="archive-entries__controls"
                aria-label={copy.archiveEntries}
              >
                <button
                  type="button"
                  disabled={activeSectionIndex === 0}
                  onClick={() =>
                    setActiveSectionIndex((index) => Math.max(0, index - 1))
                  }
                >
                  <span aria-hidden="true">←</span>
                  {copy.previousEntry}
                </button>
                <button
                  type="button"
                  disabled={activeSectionIndex === sections.length - 1}
                  onClick={() =>
                    setActiveSectionIndex((index) =>
                      Math.min(sections.length - 1, index + 1),
                    )
                  }
                >
                  {copy.nextEntry}
                  <span aria-hidden="true">→</span>
                </button>
              </nav>
            </div>
          </div>
          <div className="archive-drawer__rail" aria-hidden="true">
            <span>{String(Math.round(location.y * 100)).padStart(3, "0")}</span>
            <span>REC / {String(sections.length).padStart(2, "0")}</span>
          </div>
        </aside>
      )}
    </>
  );
}
