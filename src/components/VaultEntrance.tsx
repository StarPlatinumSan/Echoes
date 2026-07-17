import type { InterfaceCopy } from "../data/i18n";

interface VaultEntranceProps {
	onEnter: () => void;
	leaving: boolean;
	copy: InterfaceCopy["vault"];
}

export function VaultEntrance({ onEnter, leaving, copy }: VaultEntranceProps) {
	return (
		<section className={`entrance ${leaving ? "entrance--leaving" : ""}`} aria-labelledby="vault-title">
			<div className="entrance__rule" aria-hidden="true" />
			<p className="eyebrow">{copy.eyebrow}</p>
			<h1 id="vault-title">
				<span>{copy.titleFirst}</span>
				<span>{copy.titleSecond}</span>
			</h1>
			<p className="entrance__credit">{copy.credit}</p>
			<button className="entrance__button" type="button" onClick={onEnter}>
				<span>{copy.enter}</span>
				<span className="entrance__button-mark" aria-hidden="true">
					<span aria-hidden="true"> → </span>
				</span>
			</button>
			<p className="entrance__hint">{copy.hint}</p>
		</section>
	);
}
