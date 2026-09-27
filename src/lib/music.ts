export interface Interval {
  semitones: number;
  short: string;
  name: string;
}

export const INTERVALS: Interval[] = [
  { semitones: 0, short: "U", name: "Uníssono" },
  { semitones: 1, short: "2m", name: "2ª menor" },
  { semitones: 2, short: "2M", name: "2ª maior" },
  { semitones: 3, short: "3m", name: "3ª menor" },
  { semitones: 4, short: "3M", name: "3ª maior" },
  { semitones: 5, short: "4J", name: "4ª justa" },
  { semitones: 6, short: "TT", name: "Trítono" },
  { semitones: 7, short: "5J", name: "5ª justa" },
  { semitones: 8, short: "6m", name: "6ª menor" },
  { semitones: 9, short: "6M", name: "6ª maior" },
  { semitones: 10, short: "7m", name: "7ª menor" },
  { semitones: 11, short: "7M", name: "7ª maior" },
  { semitones: 12, short: "8", name: "Oitava" },
];

export function intervalBySemitones(semitones: number): Interval {
  return INTERVALS.find((interval) => interval.semitones === semitones) ?? INTERVALS[0];
}

export interface IntervalSet {
  id: string;
  label: string;
  hint: string;
  semitones: number[];
}

export const INTERVAL_SETS: IntervalSet[] = [
  {
    id: "perfect",
    label: "Perfeitos",
    hint: "Uníssono, 4ª, 5ª e oitava",
    semitones: [0, 5, 7, 12],
  },
  {
    id: "major",
    label: "Maiores",
    hint: "Maiores somados às perfeitas",
    semitones: [0, 2, 4, 5, 7, 9, 12],
  },
  {
    id: "minor",
    label: "Menores",
    hint: "Menores, trítono e oitava",
    semitones: [1, 3, 5, 6, 8, 10, 12],
  },
  {
    id: "all",
    label: "Todos",
    hint: "Os doze intervalos",
    semitones: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  },
];

/** Roots kept inside a comfortable listening range (A3–G4). */
const ROOTS = [220, 246.94, 261.63, 293.66, 329.63, 349.23, 392];

export function randomRoot(): number {
  return ROOTS[Math.floor(Math.random() * ROOTS.length)];
}

let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioContext) audioContext = new AudioContext();
  return audioContext;
}

function playTone(
  ctx: AudioContext,
  frequency: number,
  start: number,
  duration: number,
) {
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();

  oscillator.type = "triangle";
  oscillator.frequency.setValueAtTime(frequency, start);

  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(0.22, start + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

  oscillator.connect(gain).connect(ctx.destination);
  oscillator.start(start);
  oscillator.stop(start + duration + 0.03);
}

/** Plays the root note, then the interval above it. */
export function playInterval(rootHz: number, semitones: number) {
  const ctx = getAudioContext();
  if (ctx.state === "suspended") void ctx.resume();

  const start = ctx.currentTime + 0.06;
  const noteDuration = 0.6;
  const gap = 0.06;

  playTone(ctx, rootHz, start, noteDuration);
  playTone(
    ctx,
    rootHz * Math.pow(2, semitones / 12),
    start + noteDuration + gap,
    noteDuration,
  );
}
