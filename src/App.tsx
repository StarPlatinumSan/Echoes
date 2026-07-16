import { useCallback, useEffect, useRef, useState } from "react";
import { LocationPanel } from "./components/LocationPanel";
import { VaultEntrance } from "./components/VaultEntrance";
import { WorldMap } from "./components/WorldMap";
import { locations, type Location } from "./data/locations";
import { useReducedMotion } from "./hooks/useReducedMotion";
import { ambientAudio } from "./lib/ambientAudio";

export default function App() {
  const reducedMotion = useReducedMotion();
  const [entered, setEntered] = useState(false);
  const [entranceVisible, setEntranceVisible] = useState(true);
  const [entranceLeaving, setEntranceLeaving] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const originRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => () => ambientAudio.stop(), []);

  const enterVault = () => {
    setEntranceLeaving(true);
    setEntered(true);
    const ambientSource = import.meta.env.VITE_AMBIENT_AUDIO_URL || "";
    void ambientAudio.startAfterEntry(ambientSource).catch(() => undefined);

    if (reducedMotion) {
      setEntranceVisible(false);
    } else {
      window.setTimeout(() => setEntranceVisible(false), 900);
    }
  };

  const openLocation = useCallback(
    (location: Location, origin: HTMLButtonElement) => {
      originRef.current = origin;
      setSelectedLocation(location);
    },
    [],
  );

  const closeLocation = useCallback(() => {
    setSelectedLocation(null);
    window.requestAnimationFrame(() => originRef.current?.focus());
  }, []);

  return (
    <main className={`app ${entered ? "app--entered" : ""}`}>
      <div className="map-stage" aria-hidden={selectedLocation ? "true" : undefined}>
        <WorldMap
          interactive={entered && !selectedLocation}
          selectedLocation={selectedLocation}
          onOpenLocation={openLocation}
        />
      </div>

      <div className="archive-vignette" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />

      {entered && (
        <header className="archive-header">
          <div className="archive-header__brand">
            <span className="archive-header__monogram" aria-hidden="true">
              VE
            </span>
            <div>
              <strong>The Vault of Echoes</strong>
              <span>Andrei Bituleanu // Cartographic index</span>
            </div>
          </div>
          <div className="archive-header__count" aria-label={`${locations.length} indexed locations`}>
            <span>{String(locations.length).padStart(2, "0")}</span>
            <small>sites indexed</small>
          </div>
        </header>
      )}

      {entered && (
        <div className="map-instructions" aria-hidden="true">
          <span>Drag to traverse</span>
          <span>Scroll to examine</span>
        </div>
      )}

      {entranceVisible && <VaultEntrance onEnter={enterVault} leaving={entranceLeaving} />}

      {selectedLocation && (
        <>
          <button
            className="panel-backdrop"
            type="button"
            aria-label="Close location details"
            onClick={closeLocation}
          />
          <LocationPanel location={selectedLocation} onClose={closeLocation} />
        </>
      )}
    </main>
  );
}
