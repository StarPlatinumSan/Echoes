export const DEFAULT_AMBIENT_VOLUME = 0.24;

class AmbientAudioController {
  private audio: HTMLAudioElement | null = null;
  private sourceUrl = "";
  private volume = DEFAULT_AMBIENT_VOLUME;
  private muted = false;

  async startAfterEntry(sourceUrl: string): Promise<void> {
    if (!sourceUrl) return;

    if (!this.audio || this.sourceUrl !== sourceUrl) {
      this.audio?.pause();
      this.audio = new Audio(sourceUrl);
      this.sourceUrl = sourceUrl;
    }
    this.audio.loop = true;
    this.audio.volume = this.volume;
    this.audio.muted = this.muted;
    await this.audio.play();
  }

  setVolume(volume: number): number {
    this.volume = Math.min(1, Math.max(0, volume));
    if (this.audio) this.audio.volume = this.volume;
    return this.volume;
  }

  setMuted(muted: boolean): void {
    this.muted = muted;
    if (this.audio) this.audio.muted = muted;
  }

  async resume(): Promise<void> {
    if (!this.audio || !this.audio.paused) return;
    await this.audio.play();
  }

  stop(): void {
    if (!this.audio) return;
    this.audio.pause();
    this.audio.currentTime = 0;
  }
}

export const ambientAudio = new AmbientAudioController();
