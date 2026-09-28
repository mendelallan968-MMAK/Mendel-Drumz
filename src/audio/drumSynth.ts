/**
 * MENDEL DRUMZ - High Fidelity Web Audio Drum Synthesizer & Metronome Engine
 * Fully synthesized acoustic drum models with zero external audio asset dependencies.
 */

class DrumAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private openHiHatGain: GainNode | null = null;
  private openHiHatSource: { stop: () => void } | null = null;

  public isMuted: boolean = false;
  public volume: number = 0.85;

  private init() {
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtxClass();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(muted ? 0 : this.volume, this.ctx.currentTime);
    }
  }

  // --- KICK DRUM ---
  public playKick(velocity = 1, time?: number) {
    this.init();
    if (!this.ctx || !this.masterGain) return;
    const t = time ?? this.ctx.currentTime;
    const vel = Math.max(0.2, Math.min(1.2, velocity));

    // Pitch sweep oscillator (punch & sub bass)
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(160, t);
    osc.frequency.exponentialRampToValueAtTime(54, t + 0.06);
    osc.frequency.exponentialRampToValueAtTime(32, t + 0.32);

    oscGain.gain.setValueAtTime(1.3 * vel, t);
    oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.42);

    // Beater click (high-frequency snap)
    const clickOsc = this.ctx.createOscillator();
    const clickGain = this.ctx.createGain();
    clickOsc.type = 'triangle';
    clickOsc.frequency.setValueAtTime(800, t);
    clickOsc.frequency.exponentialRampToValueAtTime(80, t + 0.025);
    clickGain.gain.setValueAtTime(0.7 * vel, t);
    clickGain.gain.exponentialRampToValueAtTime(0.001, t + 0.03);

    clickOsc.connect(clickGain);
    clickGain.connect(this.masterGain);
    osc.connect(oscGain);
    oscGain.connect(this.masterGain);

    osc.start(t);
    clickOsc.start(t);
    osc.stop(t + 0.45);
    clickOsc.stop(t + 0.04);
  }

  // --- SNARE DRUM ---
  public playSnare(velocity = 1, isRimshot = false, time?: number) {
    this.init();
    if (!this.ctx || !this.masterGain) return;
    const t = time ?? this.ctx.currentTime;
    const vel = Math.max(0.2, Math.min(1.2, velocity));

    // Body tone
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = isRimshot ? 'triangle' : 'sine';
    const startFreq = isRimshot ? 280 : 210;
    osc.frequency.setValueAtTime(startFreq, t);
    osc.frequency.exponentialRampToValueAtTime(135, t + 0.09);

    oscGain.gain.setValueAtTime((isRimshot ? 1.1 : 0.8) * vel, t);
    oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.16);

    // Snare wires (filtered noise)
    const bufferSize = this.ctx.sampleRate * 0.3;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = 'highpass';
    noiseFilter.frequency.setValueAtTime(isRimshot ? 1600 : 1000, t);

    const noiseBand = this.ctx.createBiquadFilter();
    noiseBand.type = 'bandpass';
    noiseBand.frequency.setValueAtTime(isRimshot ? 4500 : 3200, t);
    noiseBand.Q.setValueAtTime(1.2, t);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.9 * vel, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, t + (isRimshot ? 0.22 : 0.28));

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseBand);
    noiseBand.connect(noiseGain);
    noiseGain.connect(this.masterGain);

    osc.connect(oscGain);
    oscGain.connect(this.masterGain);

    osc.start(t);
    noise.start(t);
    osc.stop(t + 0.2);
    noise.stop(t + 0.3);
  }

  // --- CROSS STICK ---
  public playCrossStick(velocity = 1, time?: number) {
    this.init();
    if (!this.ctx || !this.masterGain) return;
    const t = time ?? this.ctx.currentTime;
    const vel = Math.max(0.2, Math.min(1.2, velocity));

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(540, t);
    osc.frequency.exponentialRampToValueAtTime(320, t + 0.05);

    gain.gain.setValueAtTime(0.9 * vel, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.07);
  }

  // Helper: Metallic noise generation for cymbals
  private createMetallicSource(t: number, duration: number, vel: number, highCut = 12000, lowCut = 6500) {
    if (!this.ctx || !this.masterGain) return null;
    const ratios = [215, 305, 412, 543, 679, 891];
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(vel, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);

    const highpass = this.ctx.createBiquadFilter();
    highpass.type = 'highpass';
    highpass.frequency.setValueAtTime(lowCut, t);

    const lowpass = this.ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.setValueAtTime(highCut, t);

    ratios.forEach(freq => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, t);
      osc.connect(highpass);
      osc.start(t);
      osc.stop(t + duration);
    });

    // Layer subtle white noise for air
    const bufferSize = Math.floor(this.ctx.sampleRate * duration);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.4;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.connect(highpass);
    noise.start(t);
    noise.stop(t + duration);

    highpass.connect(lowpass);
    lowpass.connect(gain);
    gain.connect(this.masterGain);

    return { gain, stop: () => gain.gain.setValueAtTime(0.0001, this.ctx!.currentTime) };
  }

  // --- HI-HAT CLOSED ---
  public playHiHatClosed(velocity = 1, time?: number) {
    this.init();
    if (!this.ctx) return;
    const t = time ?? this.ctx.currentTime;
    // Choke open hi-hat if ringing
    if (this.openHiHatSource) {
      try {
        this.openHiHatSource.stop();
        this.openHiHatSource = null;
      } catch {
        // ignore
      }
    }
    this.createMetallicSource(t, 0.055, 0.75 * velocity, 14000, 7000);
  }

  // --- HI-HAT OPEN ---
  public playHiHatOpen(velocity = 1, time?: number) {
    this.init();
    if (!this.ctx) return;
    const t = time ?? this.ctx.currentTime;
    if (this.openHiHatSource) {
      try {
        this.openHiHatSource.stop();
      } catch {
        // ignore
      }
    }
    this.openHiHatSource = this.createMetallicSource(t, 0.55, 0.85 * velocity, 15000, 5500);
  }

  // --- HI-HAT PEDAL ---
  public playHiHatPedal(velocity = 1, time?: number) {
    this.init();
    if (!this.ctx) return;
    const t = time ?? this.ctx.currentTime;
    if (this.openHiHatSource) {
      try {
        this.openHiHatSource.stop();
        this.openHiHatSource = null;
      } catch {
        // ignore
      }
    }
    this.createMetallicSource(t, 0.075, 0.5 * velocity, 10000, 6000);
  }

  // --- TOM TOMS ---
  public playTom(pitch: 'high' | 'mid' | 'floor', velocity = 1, time?: number) {
    this.init();
    if (!this.ctx || !this.masterGain) return;
    const t = time ?? this.ctx.currentTime;
    const vel = Math.max(0.2, Math.min(1.2, velocity));

    let startFreq = 190;
    let endFreq = 120;
    let duration = 0.35;

    if (pitch === 'high') {
      startFreq = 220;
      endFreq = 140;
      duration = 0.32;
    } else if (pitch === 'mid') {
      startFreq = 165;
      endFreq = 95;
      duration = 0.38;
    } else {
      // floor
      startFreq = 110;
      endFreq = 62;
      duration = 0.48;
    }

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(startFreq, t);
    osc.frequency.exponentialRampToValueAtTime(endFreq, t + duration * 0.7);

    gain.gain.setValueAtTime(1.1 * vel, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

    // Initial click for drumstick hit
    const click = this.ctx.createOscillator();
    const clickGain = this.ctx.createGain();
    click.type = 'triangle';
    click.frequency.setValueAtTime(600, t);
    click.frequency.exponentialRampToValueAtTime(120, t + 0.02);
    clickGain.gain.setValueAtTime(0.4 * vel, t);
    clickGain.gain.exponentialRampToValueAtTime(0.001, t + 0.025);

    click.connect(clickGain);
    clickGain.connect(this.masterGain);
    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    click.start(t);
    osc.stop(t + duration + 0.05);
    click.stop(t + 0.03);
  }

  // --- CRASH CYMBAL ---
  public playCrash(velocity = 1, time?: number) {
    this.init();
    if (!this.ctx || !this.masterGain) return;
    const t = time ?? this.ctx.currentTime;
    const vel = Math.max(0.2, Math.min(1.2, velocity));

    // Metallic body + long decaying noise wash
    const bufferSize = Math.floor(this.ctx.sampleRate * 2.2);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(5200, t);
    filter.Q.setValueAtTime(0.8, t);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.95 * vel, t);
    gain.gain.exponentialRampToValueAtTime(0.0005, t + 2.0);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start(t);
    noise.stop(t + 2.2);

    // Also metallic ring
    this.createMetallicSource(t, 1.4, 0.4 * vel, 12000, 3500);
  }

  // --- RIDE CYMBAL ---
  public playRide(isBell = false, velocity = 1, time?: number) {
    this.init();
    if (!this.ctx || !this.masterGain) return;
    const t = time ?? this.ctx.currentTime;
    const vel = Math.max(0.2, Math.min(1.2, velocity));

    if (isBell) {
      // Clear bright bell ping
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'sine';
      osc1.frequency.setValueAtTime(840, t);
      osc2.frequency.setValueAtTime(1420, t);

      gain.gain.setValueAtTime(0.85 * vel, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.85);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.masterGain);

      osc1.start(t);
      osc2.start(t);
      osc1.stop(t + 0.9);
      osc2.stop(t + 0.9);
    } else {
      // Clear stick tip ping + subtle shimmer
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, t);
      oscGain.gain.setValueAtTime(0.7 * vel, t);
      oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.6);

      osc.connect(oscGain);
      oscGain.connect(this.masterGain);
      osc.start(t);
      osc.stop(t + 0.65);

      this.createMetallicSource(t, 1.2, 0.35 * vel, 9500, 4800);
    }
  }

  // --- COWBELL ---
  public playCowbell(velocity = 1, time?: number) {
    this.init();
    if (!this.ctx || !this.masterGain) return;
    const t = time ?? this.ctx.currentTime;
    const vel = Math.max(0.2, Math.min(1.2, velocity));

    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc1.type = 'square';
    osc2.type = 'square';
    osc1.frequency.setValueAtTime(560, t);
    osc2.frequency.setValueAtTime(845, t);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1000, t);
    filter.Q.setValueAtTime(2.5, t);

    gain.gain.setValueAtTime(0.75 * vel, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc1.start(t);
    osc2.start(t);
    osc1.stop(t + 0.45);
    osc2.stop(t + 0.45);
  }

  // --- METRONOME CLICKS ---
  public playMetronomeClick(type: 'accent' | 'regular' | 'subdivision', sound: 'wood' | 'studio' | 'bell' = 'studio', time?: number) {
    this.init();
    if (!this.ctx || !this.masterGain) return;
    const t = time ?? this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    if (sound === 'wood') {
      osc.type = 'sine';
      const freq = type === 'accent' ? 1200 : type === 'regular' ? 820 : 640;
      osc.frequency.setValueAtTime(freq, t);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.5, t + 0.035);
      gain.gain.setValueAtTime(type === 'accent' ? 0.95 : type === 'regular' ? 0.7 : 0.4, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.04);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(t);
      osc.stop(t + 0.05);
    } else if (sound === 'bell') {
      osc.type = 'triangle';
      const freq = type === 'accent' ? 1760 : type === 'regular' ? 1320 : 980;
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(type === 'accent' ? 0.8 : type === 'regular' ? 0.55 : 0.3, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + (type === 'accent' ? 0.12 : 0.07));
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(t);
      osc.stop(t + 0.14);
    } else {
      // Studio precision click
      osc.type = 'square';
      const freq = type === 'accent' ? 2200 : type === 'regular' ? 1400 : 900;
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(type === 'accent' ? 0.85 : type === 'regular' ? 0.6 : 0.35, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.025);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(t);
      osc.stop(t + 0.03);
    }
  }

  // Get current AudioContext timestamp
  public getCurrentTime(): number {
    this.init();
    return this.ctx ? this.ctx.currentTime : 0;
  }
}

export const drumAudio = new DrumAudioEngine();
