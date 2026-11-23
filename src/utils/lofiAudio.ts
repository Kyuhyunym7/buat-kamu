export const LOFI_TEMPO_BPM = 85;
export const TRACK_TITLE = 'Nanti Kita Seperti Ini';
export const TRACK_ARTIST = 'Batas Senja (Instrumental)';
export const TOTAL_PATTERN_STEPS = 96; // 12 bars of 8 eighth-notes (Verse 4 bars + Chorus 8 bars)

export interface LofiStepEvent {
  chordName: string;
  chordBassFreq: number | null;
  pluckFreq: number | null;
  padChordFreqs: number[] | null;
  melodyFreq: number | null;
  hasKick: boolean;
  hasBrushSnare: boolean;
  hasShaker: boolean;
}

interface ChordSegment {
  name: string;
  startStep: number;
  lengthSteps: number;
  bassMidi: number;
  arpeggioMidi: number[]; // 4-note guitar fingerpicking voicing
  padMidi: number[];
}

// Key: C Major (~85 BPM) following "Nanti Kita Seperti Ini" (Batas Senja)
// Verse (Steps 0-31): C -> F -> Dm -> G
// Chorus (Steps 32-95): F -> G -> Am - G/B -> C -> F -> G -> C - G/B -> Am - G
const CHORD_SEGMENTS: ChordSegment[] = [
  // Verse
  { name: 'C', startStep: 0, lengthSteps: 8, bassMidi: 48, arpeggioMidi: [48, 55, 60, 64], padMidi: [60, 64, 67, 71] },
  { name: 'F', startStep: 8, lengthSteps: 8, bassMidi: 41, arpeggioMidi: [53, 57, 60, 64], padMidi: [53, 57, 60, 64] },
  { name: 'Dm', startStep: 16, lengthSteps: 8, bassMidi: 50, arpeggioMidi: [50, 57, 60, 65], padMidi: [50, 57, 60, 65] },
  { name: 'G', startStep: 24, lengthSteps: 8, bassMidi: 43, arpeggioMidi: [43, 55, 59, 62], padMidi: [55, 59, 62, 67] },

  // Chorus Part 1 ("Ingin punya rumah 'tuk tempat bermesra...")
  { name: 'F', startStep: 32, lengthSteps: 8, bassMidi: 41, arpeggioMidi: [53, 57, 60, 65], padMidi: [53, 57, 60, 64] },
  { name: 'G', startStep: 40, lengthSteps: 8, bassMidi: 43, arpeggioMidi: [43, 55, 59, 62], padMidi: [55, 59, 62, 67] },
  { name: 'Am', startStep: 48, lengthSteps: 4, bassMidi: 45, arpeggioMidi: [45, 52, 57, 60], padMidi: [57, 60, 64] },
  { name: 'G/B', startStep: 52, lengthSteps: 4, bassMidi: 47, arpeggioMidi: [47, 55, 59, 62], padMidi: [55, 59, 62] },
  { name: 'C', startStep: 56, lengthSteps: 8, bassMidi: 48, arpeggioMidi: [48, 55, 60, 64], padMidi: [60, 64, 67, 71] },

  // Chorus Part 2 ("Sederhana bahagia ini lengkap sudah...")
  { name: 'F', startStep: 64, lengthSteps: 8, bassMidi: 41, arpeggioMidi: [53, 57, 60, 65], padMidi: [53, 57, 60, 64] },
  { name: 'G', startStep: 72, lengthSteps: 8, bassMidi: 43, arpeggioMidi: [43, 55, 59, 62], padMidi: [55, 59, 62, 67] },
  { name: 'C', startStep: 80, lengthSteps: 4, bassMidi: 48, arpeggioMidi: [48, 55, 60, 64], padMidi: [60, 64, 67] },
  { name: 'G/B', startStep: 84, lengthSteps: 4, bassMidi: 47, arpeggioMidi: [47, 55, 59, 62], padMidi: [55, 59, 62] },
  { name: 'Am-G', startStep: 88, lengthSteps: 8, bassMidi: 45, arpeggioMidi: [45, 52, 57, 60], padMidi: [57, 60, 64] },
];

// Gentle fingerpicking arpeggio pattern index across 8 eighth-notes
const ARPEGGIO_ORDER = [0, 1, 2, 3, 1, 2, 3, 2];

// Tender vocal-like instrumental lead melody in C major across 96 steps
const MELODY_NOTES_MIDI: Record<number, number> = {
  // Verse ("Ini... gambaran kita suatu hari nanti")
  0: 76, // E5
  4: 72, // C5
  8: 69, // A4
  10: 72, // C5
  12: 74, // D5
  14: 76, // E5
  16: 74, // D5
  18: 72, // C5
  20: 69, // A4
  24: 71, // B4
  26: 72, // C5
  28: 74, // D5

  // Chorus 1 ("Ingin punya rumah 'tuk tempat bermesra")
  32: 72, // C5
  34: 74, // D5
  36: 76, // E5
  38: 77, // F5
  40: 76, // E5
  42: 74, // D5
  44: 72, // C5
  46: 74, // D5
  48: 76, // E5
  52: 74, // D5
  56: 72, // C5

  // Chorus 2 ("Sederhana bahagia ini lengkap sudah")
  64: 69, // A4
  66: 72, // C5
  68: 74, // D5
  70: 76, // E5
  72: 74, // D5
  74: 72, // C5
  76: 74, // D5
  78: 76, // E5
  80: 79, // G5
  84: 76, // E5
  88: 72, // C5
  92: 74, // D5
};

export function midiToFreq(midi: number): number {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

export function getEighthNoteDurationSec(bpm: number = LOFI_TEMPO_BPM): number {
  return 60 / bpm / 2;
}

export function findChordSegment(stepIndex: number): ChordSegment {
  const normalized = ((stepIndex % TOTAL_PATTERN_STEPS) + TOTAL_PATTERN_STEPS) % TOTAL_PATTERN_STEPS;
  for (const seg of CHORD_SEGMENTS) {
    if (normalized >= seg.startStep && normalized < seg.startStep + seg.lengthSteps) {
      return seg;
    }
  }
  return CHORD_SEGMENTS[0];
}

export function getStepSchedule(stepIndex: number): LofiStepEvent {
  const normalized = ((stepIndex % TOTAL_PATTERN_STEPS) + TOTAL_PATTERN_STEPS) % TOTAL_PATTERN_STEPS;
  const stepInBar = normalized % 8;
  const segment = findChordSegment(normalized);
  const isSegmentStart = normalized === segment.startStep;

  const arpIdx = ARPEGGIO_ORDER[stepInBar] % segment.arpeggioMidi.length;
  const pluckMidi = segment.arpeggioMidi[arpIdx];
  const melodyMidi = MELODY_NOTES_MIDI[normalized] ?? null;

  return {
    chordName: segment.name,
    chordBassFreq: isSegmentStart ? midiToFreq(segment.bassMidi) : null,
    pluckFreq: midiToFreq(pluckMidi),
    padChordFreqs: isSegmentStart ? segment.padMidi.map(midiToFreq) : null,
    melodyFreq: melodyMidi !== null ? midiToFreq(melodyMidi) : null,
    hasKick: stepInBar === 0 || stepInBar === 5,
    hasBrushSnare: stepInBar === 4,
    hasShaker: stepInBar % 2 === 1,
  };
}

export class LofiAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private warmthFilter: BiquadFilterNode | null = null;
  private vinylSource: AudioBufferSourceNode | null = null;
  private timerId: number | null = null;
  private stepIndex = 0;
  private running = false;

  public isRunning(): boolean {
    return this.running;
  }

  public async start(): Promise<boolean> {
    if (this.running) return true;
    if (typeof window === 'undefined') return false;

    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

    if (!AudioCtx) {
      this.running = true;
      return false;
    }

    try {
      if (!this.ctx) {
        this.ctx = new AudioCtx();
        this.warmthFilter = this.ctx.createBiquadFilter();
        this.warmthFilter.type = 'lowpass';
        this.warmthFilter.frequency.value = 2100;
        this.warmthFilter.Q.value = 0.5;

        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.value = 0.0001;

        this.warmthFilter.connect(this.masterGain);
        this.masterGain.connect(this.ctx.destination);
      }

      if (this.ctx.state === 'suspended') {
        await this.ctx.resume();
      }

      const now = this.ctx.currentTime;
      this.masterGain?.gain.cancelScheduledValues(now);
      this.masterGain?.gain.setValueAtTime(0.0001, now);
      this.masterGain?.gain.linearRampToValueAtTime(0.3, now + 0.55);

      this.startVinylTexture();
      this.running = true;
      this.scheduleNextTick();
      return true;
    } catch {
      this.running = true;
      return false;
    }
  }

  public stop(): void {
    this.running = false;
    if (this.timerId !== null && typeof window !== 'undefined') {
      window.clearInterval(this.timerId);
      this.timerId = null;
    }

    if (this.vinylSource) {
      try {
        this.vinylSource.stop();
        this.vinylSource.disconnect();
      } catch {
        // Ignore already stopped source
      }
      this.vinylSource = null;
    }

    if (this.ctx && this.masterGain) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
      this.masterGain.gain.linearRampToValueAtTime(0.0001, now + 0.25);
    }
  }

  public dispose(): void {
    this.stop();
    if (this.ctx) {
      void this.ctx.close().catch(() => undefined);
      this.ctx = null;
      this.masterGain = null;
      this.warmthFilter = null;
    }
  }

  private startVinylTexture(): void {
    if (!this.ctx || !this.warmthFilter || this.vinylSource) return;

    const length = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, length, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < length; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.008;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.value = 0.06;

    noise.connect(noiseGain);
    noiseGain.connect(this.warmthFilter);
    noise.start();
    this.vinylSource = noise;
  }

  private scheduleNextTick(): void {
    const stepDurationMs = getEighthNoteDurationSec() * 1000;
    this.playStep(this.stepIndex);
    this.stepIndex = (this.stepIndex + 1) % TOTAL_PATTERN_STEPS;

    if (typeof window !== 'undefined') {
      this.timerId = window.setInterval(() => {
        if (!this.running) return;
        this.playStep(this.stepIndex);
        this.stepIndex = (this.stepIndex + 1) % TOTAL_PATTERN_STEPS;
      }, stepDurationMs);
    }
  }

  private playStep(index: number): void {
    if (!this.ctx || !this.warmthFilter) return;
    const now = this.ctx.currentTime;
    const event = getStepSchedule(index);
    const stepSec = getEighthNoteDurationSec();

    if (event.padChordFreqs) {
      const padDuration = stepSec * 7.5;
      event.padChordFreqs.forEach((freq) => {
        this.triggerWarmPadNote(freq, now, padDuration, 0.032);
      });
    }

    if (event.chordBassFreq) {
      this.triggerAcousticBass(event.chordBassFreq, now, stepSec * 4);
    }

    if (event.pluckFreq) {
      this.triggerGuitarPluck(event.pluckFreq, now, stepSec * 1.9);
    }

    if (event.melodyFreq) {
      this.triggerLeadMelody(event.melodyFreq, now, stepSec * 2.2);
    }

    if (event.hasKick) {
      this.triggerSoftKick(now);
    }

    if (event.hasBrushSnare) {
      this.triggerBrushSnare(now);
    }

    if (event.hasShaker) {
      this.triggerSoftShaker(now);
    }
  }

  private triggerGuitarPluck(freq: number, time: number, duration: number): void {
    if (!this.ctx || !this.warmthFilter) return;

    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, time);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2200, time);
    filter.frequency.exponentialRampToValueAtTime(520, time + duration);

    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.linearRampToValueAtTime(0.095, time + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.warmthFilter);

    osc.start(time);
    osc.stop(time + duration + 0.03);
  }

  private triggerWarmPadNote(freq: number, time: number, duration: number, peak: number): void {
    if (!this.ctx || !this.warmthFilter) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, time);

    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.linearRampToValueAtTime(peak, time + 0.25);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    osc.connect(gain);
    gain.connect(this.warmthFilter);

    osc.start(time);
    osc.stop(time + duration + 0.05);
  }

  private triggerAcousticBass(freq: number, time: number, duration: number): void {
    if (!this.ctx || !this.warmthFilter) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, time);

    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.linearRampToValueAtTime(0.14, time + 0.025);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    osc.connect(gain);
    gain.connect(this.warmthFilter);

    osc.start(time);
    osc.stop(time + duration + 0.04);
  }

  private triggerLeadMelody(freq: number, time: number, duration: number): void {
    if (!this.ctx || !this.warmthFilter) return;

    const osc = this.ctx.createOscillator();
    const harmonic = this.ctx.createOscillator();
    const harmonicGain = this.ctx.createGain();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, time);

    harmonic.type = 'triangle';
    harmonic.frequency.setValueAtTime(freq * 2, time);
    harmonicGain.gain.setValueAtTime(0.14, time);
    harmonicGain.gain.exponentialRampToValueAtTime(0.01, time + 0.25);

    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.linearRampToValueAtTime(0.08, time + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    osc.connect(gain);
    harmonic.connect(harmonicGain);
    harmonicGain.connect(gain);
    gain.connect(this.warmthFilter);

    osc.start(time);
    harmonic.start(time);
    osc.stop(time + duration + 0.04);
    harmonic.stop(time + duration + 0.04);
  }

  private triggerSoftKick(time: number): void {
    if (!this.ctx || !this.warmthFilter) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(98, time);
    osc.frequency.exponentialRampToValueAtTime(42, time + 0.12);

    gain.gain.setValueAtTime(0.13, time);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.18);

    osc.connect(gain);
    gain.connect(this.warmthFilter);

    osc.start(time);
    osc.stop(time + 0.2);
  }

  private triggerBrushSnare(time: number): void {
    if (!this.ctx || !this.warmthFilter) return;

    const length = Math.floor(this.ctx.sampleRate * 0.08);
    const buffer = this.ctx.createBuffer(1, length, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < length; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / length);
    }

    const source = this.ctx.createBufferSource();
    source.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1200;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.035, time);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.08);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.warmthFilter);
    source.start(time);
  }

  private triggerSoftShaker(time: number): void {
    if (!this.ctx || !this.warmthFilter) return;

    const length = Math.floor(this.ctx.sampleRate * 0.03);
    const buffer = this.ctx.createBuffer(1, length, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < length; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / length);
    }

    const source = this.ctx.createBufferSource();
    source.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 4600;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.015, time);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.03);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.warmthFilter);
    source.start(time);
  }
}
