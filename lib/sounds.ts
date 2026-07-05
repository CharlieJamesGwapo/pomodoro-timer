export const AMBIENT_SOUNDS = {
  none: { name: 'None', url: '' },
  rain: {
    name: 'Rain',
    url: 'https://cdn.freesound.org/previews/342/342722_5121236-lq.mp3',
  },
  cafe: {
    name: 'Cafe',
    url: 'https://cdn.freesound.org/previews/377/377996_3940168-lq.mp3',
  },
  forest: {
    name: 'Forest',
    url: 'https://cdn.freesound.org/previews/15/15649_20816-lq.mp3',
  },
  ocean: {
    name: 'Ocean',
    url: 'https://cdn.freesound.org/previews/465/465775_8670896-lq.mp3',
  },
};

class AmbientSoundManager {
  private audio: HTMLAudioElement | null = null;
  private currentSound: string = 'none';

  init(): void {
    if (typeof window === 'undefined') return;
    if (!this.audio) {
      this.audio = new Audio();
      this.audio.loop = true;
      this.audio.volume = 0.3;
    }
  }

  play(soundKey: string): void {
    this.init();
    if (!this.audio) return;

    const sound = AMBIENT_SOUNDS[soundKey as keyof typeof AMBIENT_SOUNDS];
    if (!sound || !sound.url) {
      this.stop();
      return;
    }

    if (this.currentSound !== soundKey) {
      this.audio.src = sound.url;
      this.currentSound = soundKey;
      this.audio.load();
    }

    this.audio.play().catch((e) => {
      console.error('Failed to play ambient sound:', e);
    });
  }

  stop(): void {
    if (!this.audio) return;
    this.audio.pause();
    this.audio.currentTime = 0;
    this.currentSound = 'none';
  }

  setVolume(volume: number): void {
    this.init();
    if (this.audio) {
      this.audio.volume = Math.max(0, Math.min(1, volume));
    }
  }

  getCurrentSound(): string {
    return this.currentSound;
  }

  isPlaying(): boolean {
    return this.audio ? !this.audio.paused : false;
  }
}

export const ambientSoundManager = new AmbientSoundManager();
