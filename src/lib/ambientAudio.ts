class AmbientAudioController {
  private audio: HTMLAudioElement | null = null;

  async startAfterEntry(sourceUrl: string): Promise<void> {
    if (!sourceUrl) return;

    this.audio ??= new Audio(sourceUrl);
    this.audio.loop = true;
    this.audio.volume = 0.24;
    await this.audio.play();
  }

  stop(): void {
    if (!this.audio) return;
    this.audio.pause();
    this.audio.currentTime = 0;
  }
}

export const ambientAudio = new AmbientAudioController();
