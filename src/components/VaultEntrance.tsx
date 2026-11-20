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
				<span className="entrance__title-prefix">{copy.titleFirst}</span>
				<span className="entrance__title-echoes" data-text={copy.titleSecond}>
					{copy.titleSecond}
				</span>
			</h1>
			<p className="entrance__credit">{copy.credit}</p>
			<button className="entrance__button" type="button" onClick={onEnter}>
				<span>{copy.enter}</span>
			</button>
		</section>
	);
}
