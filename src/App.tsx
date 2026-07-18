import { useCallback, useEffect, useRef, useState } from "react";
import { AudioControls } from "./components/AudioControls";
import { LocationPanel } from "./components/LocationPanel";
import { VaultEntrance } from "./components/VaultEntrance";
import { WorldMap } from "./components/WorldMap";
import {
	interfaceCopy,
	type Language,
} from "./data/i18n";
import { locations, type Location } from "./data/locations";
import { locationsFr } from "./data/locations.fr";
import { useReducedMotion } from "./hooks/useReducedMotion";
import { ambientAudio, DEFAULT_AMBIENT_VOLUME } from "./lib/ambientAudio";

const PANEL_EXIT_DURATION_MS = 420;
const AMBIENT_AUDIO_SOURCE =
	import.meta.env.VITE_AMBIENT_AUDIO_URL || "/audio/002_Synthwave_15k.mp3";
const AUDIO_VOLUME_STEP = 0.1;

export default function App() {
	const reducedMotion = useReducedMotion();
	const [language, setLanguage] = useState<Language>("en");
	const [entered, setEntered] = useState(false);
	const [entranceVisible, setEntranceVisible] = useState(true);
	const [entranceLeaving, setEntranceLeaving] = useState(false);
	const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
	const [panelClosing, setPanelClosing] = useState(false);
	const [audioMuted, setAudioMuted] = useState(false);
	const [audioVolume, setAudioVolume] = useState(DEFAULT_AMBIENT_VOLUME);
	const originRef = useRef<HTMLButtonElement | null>(null);
	const closeTimerRef = useRef<number | null>(null);
	const backdropPressStartedAtRef = useRef<number | null>(null);
	const copy = interfaceCopy[language];
	const activeLocations = language === "fr" ? locationsFr : locations;

	useEffect(
		() => () => {
			ambientAudio.stop();
			if (closeTimerRef.current !== null) {
				window.clearTimeout(closeTimerRef.current);
			}
		},
		[],
	);

	useEffect(() => {
		document.documentElement.lang = language;
		document.title = interfaceCopy[language].app.brandTitle;
	}, [language]);

	const toggleLanguage = () => {
		const nextLanguage: Language = language === "en" ? "fr" : "en";
		const nextLocations = nextLanguage === "fr" ? locationsFr : locations;

		setLanguage(nextLanguage);
		setSelectedLocation((current) =>
			current
				? nextLocations.find((location) => location.id === current.id) ?? null
				: null,
		);
	};

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

	const closeFromBackdrop = useCallback(
		(event: React.MouseEvent<HTMLButtonElement>) => {
			const pressStartedAt = backdropPressStartedAtRef.current;
			backdropPressStartedAtRef.current = null;

			// A touch release can create a click after this backdrop mounts even
			// though the press began on a portal. Only accept pointer clicks that
			// actually began on the backdrop; detail === 0 retains keyboard use.
			if (
				event.detail !== 0 &&
				(pressStartedAt === null || event.timeStamp - pressStartedAt > 1000)
			) {
				return;
			}

			closeLocation();
		},
		[closeLocation],
	);

	return (
		<main className={`app ${entered ? "app--entered" : ""}`}>
			<div className="map-stage" aria-hidden={selectedLocation ? "true" : undefined}>
				<WorldMap
					interactive={entered && !selectedLocation}
					locations={activeLocations}
					selectedLocation={selectedLocation}
					copy={copy}
					onOpenLocation={openLocation}
				/>
			</div>

			<div className="grain" aria-hidden="true" />

			<button
				className="language-toggle"
				type="button"
				onClick={toggleLanguage}
				aria-label={copy.app.switchLanguage}
				title={copy.app.switchLanguage}
			>
				{language === "en" ? "FR" : "EN"}
			</button>

			{entered && (
				<header className="archive-header">
					<div className="archive-header__brand">
						<span className="archive-header__monogram" aria-hidden="true">
							<svg viewBox="0 0 24 24" fill="none">
								<path d="M3 6 9 3l6 3 6-3v15l-6 3-6-3-6 3V6Z" />
								<path d="M9 3v15M15 6v15" />
							</svg>
						</span>
						<div>
							<strong>{copy.app.brandTitle}</strong>
							<span>{copy.app.brandSubtitle}</span>
						</div>
					</div>
					<div
						className="archive-header__count"
						aria-label={`${activeLocations.length} ${copy.app.indexedLocations}`}
					>
						<span>{String(activeLocations.length).padStart(2, "0")}</span>
						<small>{copy.app.sitesIndexed}</small>
					</div>
				</header>
			)}

			{entered && (
				<AudioControls
					muted={audioMuted}
					volume={audioVolume}
					copy={copy.audio}
					onToggleMute={toggleAudioMuted}
					onDecreaseVolume={() => changeAudioVolume(-AUDIO_VOLUME_STEP)}
					onIncreaseVolume={() => changeAudioVolume(AUDIO_VOLUME_STEP)}
				/>
			)}

			{entered && (
				<div className="map-instructions" aria-hidden="true">
					<span>{copy.app.dragToTraverse}</span>
					<span>{copy.app.scrollToExamine}</span>
				</div>
			)}

			{entranceVisible && (
				<VaultEntrance
					onEnter={enterVault}
					leaving={entranceLeaving}
					copy={copy.vault}
				/>
			)}

			{selectedLocation && (
				<>
					<button
						className={`panel-backdrop ${panelClosing ? "panel-backdrop--closing" : ""}`}
						type="button"
						aria-label={copy.app.closeLocationDetails}
						onPointerDown={(event) => {
							backdropPressStartedAtRef.current = event.timeStamp;
						}}
						onPointerCancel={() => {
							backdropPressStartedAtRef.current = null;
						}}
						onClick={closeFromBackdrop}
					/>
					<LocationPanel
						location={selectedLocation}
						closing={panelClosing}
						copy={copy.location}
						onClose={closeLocation}
					/>
				</>
			)}
		</main>
	);
}
