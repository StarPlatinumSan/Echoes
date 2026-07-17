interface DistanceToolProps {
	active: boolean;
	disabled: boolean;
	pointCount: number;
	distanceKm: number | null;
	onOpen: () => void;
	onClose: () => void;
	onReset: () => void;
}

interface TravelMode {
	label: string;
	speedKmh: number;
}

const TRAVEL_MODES: TravelMode[] = [
	{ label: "Walk", speedKmh: 5 },
	{ label: "Horse", speedKmh: 12 },
	{ label: "Train", speedKmh: 80 },
	{ label: "Wyvern", speedKmh: 120 },
];

function formatTravelTime(distanceKm: number, mode: TravelMode) {
	const totalMinutes = Math.round((distanceKm / mode.speedKmh) * 60);
	const days = Math.floor(totalMinutes / (24 * 60));
	const remainingMinutes = totalMinutes - days * 24 * 60;
	const hours = Math.floor(remainingMinutes / 60);
	const minutes = remainingMinutes % 60;
	const parts: string[] = [];
	if (days > 0) parts.push(`${days}d`);
	if (hours > 0) parts.push(`${hours}h`);
	if (minutes > 0 && days === 0) parts.push(`${minutes}m`);
	return parts.join(" ") || "< 1m";
}

export function DistanceTool({ active, disabled, pointCount, distanceKm, onOpen, onClose, onReset }: DistanceToolProps) {
	if (!active) {
		return (
			<button className="distance-tool-launcher" type="button" disabled={disabled} onClick={onOpen}>
				<span className="distance-tool-launcher__mark" aria-hidden="true" />
				Measure route
			</button>
		);
	}

	const instruction = pointCount === 0 ? "Select the starting point" : pointCount === 1 ? "Select the destination" : "Route calculated";

	return (
		<aside className="distance-tool" aria-label="Map distance measurement" aria-live="polite">
			<header className="distance-tool__header">
				<div>
					<span className="distance-tool__eyebrow">Cartographic measure</span>
					<strong>{instruction}</strong>
				</div>
				<button type="button" onClick={onClose} aria-label="Close distance tool">
					×
				</button>
			</header>

			{distanceKm !== null ? (
				<>
					<div className="distance-tool__distance">
						<span>Direct distance</span>
						<strong>{Math.round(distanceKm).toLocaleString()} km</strong>
					</div>
					<dl className="distance-tool__times">
						{TRAVEL_MODES.map((mode) => (
							<div key={mode.label}>
								<dt>{mode.label}</dt>
								<dd>{formatTravelTime(distanceKm, mode)}</dd>
								<small>{mode.speedKmh} km/h</small>
							</div>
						))}
					</dl>
					<p className="distance-tool__note">Estimates assume uninterrupted travel at the listed speeds.</p>
				</>
			) : (
				<p className="distance-tool__prompt">Click any two points or two location markers to measure its distance.</p>
			)}

			<button className="distance-tool__reset" type="button" disabled={pointCount === 0} onClick={onReset}>
				Clear route
			</button>
		</aside>
	);
}
