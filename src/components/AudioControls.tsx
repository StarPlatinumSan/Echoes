import type { InterfaceCopy } from "../data/i18n";

interface AudioControlsProps {
  muted: boolean;
  volume: number;
  copy: InterfaceCopy["audio"];
  onToggleMute: () => void;
  onDecreaseVolume: () => void;
  onIncreaseVolume: () => void;
}

export function AudioControls({
  muted,
  volume,
  copy,
  onToggleMute,
  onDecreaseVolume,
  onIncreaseVolume,
}: AudioControlsProps) {
  const percentage = Math.round(volume * 100);

  return (
    <nav className="audio-controls" aria-label={copy.controls}>
      <button
        type="button"
        onClick={onDecreaseVolume}
        disabled={volume <= 0}
        aria-label={copy.decrease}
        title={copy.decreaseTitle}
      >
        −
      </button>
      <button
        className={`audio-controls__toggle ${muted ? "audio-controls__toggle--muted" : ""}`}
        type="button"
        onClick={onToggleMute}
        aria-label={muted ? copy.unmute : copy.mute}
        aria-pressed={muted}
        title={muted ? copy.unmuteTitle : copy.muteTitle}
      >
        <span aria-hidden="true">♪</span>
      </button>
      <button
        type="button"
        onClick={onIncreaseVolume}
        disabled={volume >= 1}
        aria-label={copy.increase}
        title={copy.increaseTitle}
      >
        +
      </button>
      <output
        className="audio-controls__level"
        aria-label={`${copy.volume} ${percentage}%`}
      >
        {percentage}
      </output>
    </nav>
  );
}
