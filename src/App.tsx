import { useCallback, useEffect, useRef, useState } from "react";
import { AudioControls } from "./components/AudioControls";
import { LocationPanel } from "./components/LocationPanel";
import { VaultEntrance } from "./components/VaultEntrance";
import { WorldMap } from "./components/WorldMap";
import { locations, type Location } from "./data/locations";
import { useReducedMotion } from "./hooks/useReducedMotion";
import { ambientAudio, DEFAULT_AMBIENT_VOLUME } from "./lib/ambientAudio";

const PANEL_EXIT_DURATION_MS = 420;
const AMBIENT_AUDIO_SOURCE =
	import.meta.env.VITE_AMBIENT_AUDIO_URL || "/audio/002_Synthwave_15k.mp3";
const AUDIO_VOLUME_STEP = 0.1;

export default function App() {
	const reducedMotion = useReducedMotion();
	const [entered, setEntered] = useState(false);
	const [entranceVisible, setEntranceVisible] = useState(true);
	const [entranceLeaving, setEntranceLeaving] = useState(false);
	const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
	const [panelClosing, setPanelClosing] = useState(false);
	const [audioMuted, setAudioMuted] = useState(false);
	const [audioVolume, setAudioVolume] = useState(DEFAULT_AMBIENT_VOLUME);
	const originRef = useRef<HTMLButtonElement | null>(null);
	const closeTimerRef = useRef<number | null>(null);

	useEffect(
		() => () => {
			ambientAudio.stop();
			if (closeTimerRef.current !== null) {
				window.clearTimeout(closeTimerRef.current);
			}
		},
		[],
	);

	const enterVault = () => {
		setEntranceLeaving(true);
		setEntered(true);
		void ambientAudio.startAfterEntry(AMBIENT_AUDIO_SOURCE).catch(() => undefined);

		if (reducedMotion) {
			setEntranceVisible(false);
		} else {
			window.setTimeout(() => setEntranceVisible(false), 900);
		}
	};

	const toggleAudioMuted = () => {
		setAudioMuted((muted) => {
			const nextMuted = !muted;
			ambientAudio.setMuted(nextMuted);
			if (!nextMuted) void ambientAudio.resume().catch(() => undefined);
			return nextMuted;
		});
	};

	const changeAudioVolume = (change: number) => {
		setAudioVolume((volume) => {
			const nextVolume = Math.round(
				Math.min(1, Math.max(0, volume + change)) * 100,
			) / 100;
			ambientAudio.setVolume(nextVolume);
			return nextVolume;
		});
	};

	const openLocation = useCallback((location: Location, origin: HTMLButtonElement) => {
		if (closeTimerRef.current !== null) {
			window.clearTimeout(closeTimerRef.current);
			closeTimerRef.current = null;
		}
		originRef.current = origin;
		setPanelClosing(false);
		setSelectedLocation(location);
	}, []);

	const finishClosingLocation = useCallback(() => {
		setSelectedLocation(null);
		setPanelClosing(false);
		closeTimerRef.current = null;
		window.requestAnimationFrame(() => originRef.current?.focus());
	}, []);

	const closeLocation = useCallback(() => {
		if (closeTimerRef.current !== null) return;
		if (reducedMotion) {
			finishClosingLocation();
			return;
		}

		setPanelClosing(true);
		closeTimerRef.current = window.setTimeout(
			finishClosingLocation,
			PANEL_EXIT_DURATION_MS,
		);
	}, [finishClosingLocation, reducedMotion]);

	return (
		<main className={`app ${entered ? "app--entered" : ""}`}>
			<div className="map-stage" aria-hidden={selectedLocation ? "true" : undefined}>
				<WorldMap interactive={entered && !selectedLocation} selectedLocation={selectedLocation} onOpenLocation={openLocation} />
			</div>

			<div className="grain" aria-hidden="true" />

			{entered && (
				<header className="archive-header">
					<div className="archive-header__brand">
						<span className="archive-header__monogram" aria-hidden="true">
							VE
						</span>
						<div>
							<strong>The Vault of Echoes</strong>
							<span>My World, my Universe.</span>
						</div>
					</div>
					<div className="archive-header__count" aria-label={`${locations.length} indexed locations`}>
						<span>{String(locations.length).padStart(2, "0")}</span>
						<small>sites indexed</small>
					</div>
				</header>
			)}

			{entered && (
				<AudioControls
					muted={audioMuted}
					volume={audioVolume}
					onToggleMute={toggleAudioMuted}
					onDecreaseVolume={() => changeAudioVolume(-AUDIO_VOLUME_STEP)}
					onIncreaseVolume={() => changeAudioVolume(AUDIO_VOLUME_STEP)}
				/>
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
						className={`panel-backdrop ${panelClosing ? "panel-backdrop--closing" : ""}`}
						type="button"
						aria-label="Close location details"
						onClick={closeLocation}
					/>
					<LocationPanel
						location={selectedLocation}
						closing={panelClosing}
						onClose={closeLocation}
					/>
				</>
			)}
		</main>
	);
}
