interface VaultEntranceProps {
  onEnter: () => void;
  leaving: boolean;
}

export function VaultEntrance({ onEnter, leaving }: VaultEntranceProps) {
  return (
    <section
      className={`entrance ${leaving ? "entrance--leaving" : ""}`}
      aria-labelledby="vault-title"
    >
      <div className="entrance__rule" aria-hidden="true" />
      <p className="eyebrow">Archive // VE–01</p>
      <h1 id="vault-title">
        <span>The Vault</span>
        <span>of Echoes</span>
      </h1>
      <p className="entrance__credit">A universe by Andrei Bituleanu</p>
      <button className="entrance__button" type="button" onClick={onEnter}>
        <span>Enter the vault</span>
        <span className="entrance__button-mark" aria-hidden="true">
          01
        </span>
      </button>
      <p className="entrance__hint">Use headphones only if ambient audio is enabled</p>
    </section>
  );
}
