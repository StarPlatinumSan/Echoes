import type { InterfaceCopy } from "../data/i18n";

interface DistanceToolProps {
	active: boolean;
	disabled: boolean;
	pointCount: number;
	distanceKm: number | null;
	onOpen: () => void;
	onClose: () => void;
	onReset: () => void;
	copy: InterfaceCopy["distance"];
}

interface TravelMode {
	id: "walk" | "horse" | "train" | "wyvern";
	speedKmh: number;
}

const TRAVEL_MODES: TravelMode[] = [
	{ id: "walk", speedKmh: 5 },
	{ id: "horse", speedKmh: 12 },
	{ id: "train", speedKmh: 80 },
	{ id: "wyvern", speedKmh: 120 },
];

function formatTravelTime(
	distanceKm: number,
	mode: TravelMode,
	copy: InterfaceCopy["distance"],
) {
	const totalMinutes = Math.round((distanceKm / mode.speedKmh) * 60);
	const days = Math.floor(totalMinutes / (24 * 60));
	const remainingMinutes = totalMinutes - days * 24 * 60;
	const hours = Math.floor(remainingMinutes / 60);
	const minutes = remainingMinutes % 60;
	const parts: string[] = [];
	if (days > 0) parts.push(`${days}${copy.day}`);
	if (hours > 0) parts.push(`${hours}${copy.hour}`);
	if (minutes > 0 && days === 0) parts.push(`${minutes}${copy.minute}`);
	return parts.join(" ") || `< 1${copy.minute}`;
}

export function DistanceTool({
	active,
	disabled,
	pointCount,
	distanceKm,
	onOpen,
	onClose,
	onReset,
	copy,
}: DistanceToolProps) {
	if (!active) {
		return (
			<button className="distance-tool-launcher" type="button" disabled={disabled} onClick={onOpen}>
				<span className="distance-tool-launcher__mark" aria-hidden="true" />
				{copy.launcher}
			</button>
		);
	}

	const instruction =
		pointCount === 0
			? copy.startingPoint
			: pointCount === 1
				? copy.destination
				: copy.calculated;

	return (
		<aside className="distance-tool" aria-label={copy.ariaLabel} aria-live="polite">
			<header className="distance-tool__header">
				<div>
					<span className="distance-tool__eyebrow">{copy.eyebrow}</span>
					<strong>{instruction}</strong>
				</div>
				<button type="button" onClick={onClose} aria-label={copy.close}>
					×
				</button>
			</header>

			{distanceKm !== null ? (
				<>
					<div className="distance-tool__distance">
						<span>{copy.directDistance}</span>
						<strong>{Math.round(distanceKm).toLocaleString(copy.locale)} km</strong>
					</div>
					<dl className="distance-tool__times">
						{TRAVEL_MODES.map((mode) => (
							<div key={mode.id}>
								<dt>{copy[mode.id]}</dt>
								<dd>{formatTravelTime(distanceKm, mode, copy)}</dd>
								<small>{mode.speedKmh} km/h</small>
							</div>
						))}
					</dl>
					<p className="distance-tool__note">{copy.note}</p>
				</>
			) : (
				<p className="distance-tool__prompt">{copy.prompt}</p>
			)}

			<button className="distance-tool__reset" type="button" disabled={pointCount === 0} onClick={onReset}>
				{copy.clear}
			</button>
		</aside>
	);
}
