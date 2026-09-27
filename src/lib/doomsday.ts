export type Difficulty = "beginner" | "intermediate" | "master";

export interface QuizDate {
  day: number;
  month: number; // 1-12
  year: number;
}

export const DIFFICULTIES: {
  id: Difficulty;
  label: string;
  range: string;
  min: number;
  max: number;
}[] = [
  { id: "beginner", label: "Iniciante", range: "2000 – 2099", min: 2000, max: 2099 },
  { id: "intermediate", label: "Intermediário", range: "1800 – 2099", min: 1800, max: 2099 },
  { id: "master", label: "Mestre", range: "1582 – 2400", min: 1582, max: 2400 },
];

export const WEEKDAYS = [
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
] as const;

export const WEEKDAYS_SHORT = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"] as const;

export const MONTHS = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
] as const;

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function daysInMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate();
}

/** A uniformly random, always-valid date inside a difficulty's range. */
export function randomDate(difficulty: Difficulty): QuizDate {
  const config = DIFFICULTIES.find((d) => d.id === difficulty) ?? DIFFICULTIES[0];
  const year = randInt(config.min, config.max);
  const month = randInt(1, 12);
  const day = randInt(1, daysInMonth(year, month));
  return { day, month, year };
}

/** Real weekday (0 = Domingo) using the native Date API. */
export function weekdayOf({ day, month, year }: QuizDate): number {
  return new Date(year, month - 1, day).getDay();
}

export function formatDate({ day, month, year }: QuizDate): string {
  return `${day} de ${MONTHS[month - 1]} de ${year}`;
}
