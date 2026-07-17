interface AudioControlsProps {
  muted: boolean;
  volume: number;
  onToggleMute: () => void;
  onDecreaseVolume: () => void;
  onIncreaseVolume: () => void;
}

export function AudioControls({
  muted,
  volume,
  onToggleMute,
  onDecreaseVolume,
  onIncreaseVolume,
}: AudioControlsProps) {
  const percentage = Math.round(volume * 100);

  return (
    <nav className="audio-controls" aria-label="Ambient music controls">
      <button
        type="button"
        onClick={onDecreaseVolume}
        disabled={volume <= 0}
        aria-label="Decrease music volume"
        title="Decrease volume"
      >
        −
      </button>
      <button
        className={`audio-controls__toggle ${muted ? "audio-controls__toggle--muted" : ""}`}
        type="button"
        onClick={onToggleMute}
        aria-label={muted ? "Unmute ambient music" : "Mute ambient music"}
        aria-pressed={muted}
        title={muted ? "Unmute music" : "Mute music"}
      >
        <span aria-hidden="true">♪</span>
      </button>
      <button
        type="button"
        onClick={onIncreaseVolume}
        disabled={volume >= 1}
        aria-label="Increase music volume"
        title="Increase volume"
      >
        +
      </button>
      <output className="audio-controls__level" aria-label={`Music volume ${percentage} percent`}>
        {percentage}
      </output>
    </nav>
  );
}

