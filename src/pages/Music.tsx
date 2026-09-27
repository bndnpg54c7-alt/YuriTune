import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/SiteHeader";
import {
  INTERVAL_SETS,
  intervalBySemitones,
  playInterval,
  randomRoot,
} from "@/lib/music";
import { motion } from "framer-motion";
import { Volume2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";

interface Stats {
  score: number;
  streak: number;
  bestStreak: number;
  answered: number;
  correct: number;
}

const ZERO_STATS: Stats = { score: 0, streak: 0, bestStreak: 0, answered: 0, correct: 0 };
const STORAGE_KEY = "yuritune:music:stats";

function loadStats(): Stats {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...ZERO_STATS, ...(JSON.parse(raw) as Partial<Stats>) };
  } catch {
    /* ignore unreadable storage */
  }
  return { ...ZERO_STATS };
}

function initialSetId(param: string | null): string {
  return INTERVAL_SETS.some((set) => set.id === param) ? (param as string) : "major";
}

function pickSemitone(setId: string): number {
  const set = INTERVAL_SETS.find((entry) => entry.id === setId) ?? INTERVAL_SETS[0];
  return set.semitones[Math.floor(Math.random() * set.semitones.length)];
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="px-2 py-6 text-center">
      <p className="text-3xl font-semibold tabular-nums">{value}</p>
      <p className="mt-1 font-mono text-[11px] tracking-[0.15em] text-muted-foreground uppercase">
        {label}
      </p>
    </div>
  );
}

export default function Music() {
  const [searchParams] = useSearchParams();
  const startingSet = initialSetId(searchParams.get("set"));

  const [setId, setSetId] = useState(startingSet);
  const [current, setCurrent] = useState(() => pickSemitone(startingSet));
  const [root, setRoot] = useState(() => randomRoot());
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [questionId, setQuestionId] = useState(0);
  const [audioReady, setAudioReady] = useState(false);
  const [stats, setStats] = useState<Stats>(loadStats);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
    } catch {
      /* ignore unwritable storage */
    }
  }, [stats]);

  const activeSet = INTERVAL_SETS.find((set) => set.id === setId) ?? INTERVAL_SETS[0];
  const options = useMemo(
    () =>
      activeSet.semitones
        .slice()
        .sort((a, b) => a - b)
        .map(intervalBySemitones),
    [activeSet],
  );

  const isCorrect = selected === current;

  const listen = useCallback(() => {
    setAudioReady(true);
    playInterval(root, current);
  }, [root, current]);

  const answer = useCallback(
    (semitones: number) => {
      if (answered) return;
      setSelected(semitones);
      setAnswered(true);

      const hit = semitones === current;
      setStats((prev) => {
        const streak = hit ? prev.streak + 1 : 0;
        return {
          score: prev.score + (hit ? 1 : 0),
          streak,
          bestStreak: Math.max(prev.bestStreak, streak),
          answered: prev.answered + 1,
          correct: prev.correct + (hit ? 1 : 0),
        };
      });
    },
    [answered, current],
  );

  const next = useCallback(() => {
    const nextSemitone = pickSemitone(setId);
    const nextRoot = randomRoot();
    setCurrent(nextSemitone);
    setRoot(nextRoot);
    setSelected(null);
    setAnswered(false);
    setQuestionId((n) => n + 1);
    if (audioReady) playInterval(nextRoot, nextSemitone);
  }, [setId, audioReady]);

  function changeSet(id: string) {
    if (id === setId) return;
    setSetId(id);
    const nextSemitone = pickSemitone(id);
    const nextRoot = randomRoot();
    setCurrent(nextSemitone);
    setRoot(nextRoot);
    setSelected(null);
    setAnswered(false);
    setQuestionId((n) => n + 1);
    if (audioReady) playInterval(nextRoot, nextSemitone);
  }

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (!answered) {
        const digit = Number.parseInt(event.key, 10);
        if (digit >= 1 && digit <= options.length) {
          answer(options[digit - 1].semitones);
        } else if (event.key.toLowerCase() === "r") {
          listen();
        }
      } else if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        next();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [answered, options, answer, listen, next]);

  function optionClass(semitones: number) {
    const base =
      "flex h-16 flex-col items-center justify-center gap-0.5 rounded-md border px-2 transition-colors duration-150";
    if (!answered) {
      return `${base} border-border hover:border-foreground hover:bg-muted`;
    }
    if (semitones === current) {
      return `${base} border-foreground bg-foreground text-background`;
    }
    if (semitones === selected) {
      return `${base} border-destructive/50 text-destructive`;
    }
    return `${base} border-border text-muted-foreground opacity-40`;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <main className="mx-auto w-full max-w-2xl px-6 py-10">
        <p className="font-mono text-xs text-[color:var(--brand)]">// ouvido musical</p>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight">
          Reconhecimento de intervalos
        </h1>

        {/* Set selector */}
        <div className="mt-8 flex justify-center">
          <div className="inline-flex flex-wrap justify-center rounded-md border p-1">
            {INTERVAL_SETS.map((set) => (
              <button
                key={set.id}
                type="button"
                onClick={() => changeSet(set.id)}
                className={
                  "rounded px-4 py-2 font-mono text-xs transition-colors " +
                  (set.id === setId
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground")
                }
              >
                {set.label}
              </button>
            ))}
          </div>
        </div>
        <p className="mt-3 text-center font-mono text-xs text-muted-foreground">
          {activeSet.hint}
        </p>

        {/* Stats */}
        <div className="mt-10 grid grid-cols-3 divide-x border-y">
          <Stat label="Placar" value={stats.score} />
          <Stat label="Sequência" value={stats.streak} />
          <Stat label="Melhor" value={stats.bestStreak} />
        </div>

        {/* Play card */}
        <div className="mt-12 rounded-xl border bg-card px-6 py-14 text-center">
          <p className="font-mono text-xs tracking-[0.25em] text-muted-foreground uppercase">
            Qual o intervalo?
          </p>
          <motion.button
            key={questionId}
            type="button"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            onClick={listen}
            className="mt-8 inline-flex h-12 items-center gap-3 rounded-md border px-6 font-mono text-sm transition-colors hover:bg-muted"
          >
            <Volume2 className="size-4 text-[color:var(--brand)]" />
            {audioReady ? "Ouvir novamente" : "Tocar intervalo"}
          </motion.button>
          <p className="mt-4 font-mono text-[11px] text-muted-foreground">
            pressione R para repetir
          </p>
        </div>

        {/* Options */}
        <div className="mt-8 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
          {options.map((option) => (
            <motion.button
              key={option.semitones}
              type="button"
              whileTap={answered ? undefined : { scale: 0.98 }}
              onClick={() => answer(option.semitones)}
              disabled={answered}
              className={optionClass(option.semitones)}
            >
              <span className="font-mono text-sm font-medium">{option.short}</span>
              <span className="text-[11px] opacity-80">{option.name}</span>
            </motion.button>
          ))}
        </div>

        {/* Feedback */}
        <div className="mt-8 flex min-h-11 items-center justify-center">
          {answered ? (
            <div className="flex w-full flex-col items-center gap-4 sm:flex-row sm:justify-between">
              <p className="text-sm">
                {isCorrect ? (
                  <span className="font-medium">Correto.</span>
                ) : (
                  <span className="text-muted-foreground">
                    Era{" "}
                    <span className="text-foreground">
                      {intervalBySemitones(current).name}
                    </span>
                    .
                  </span>
                )}
              </p>
              <Button onClick={next} className="gap-2">
                Próximo intervalo
              </Button>
            </div>
          ) : (
            <p className="font-mono text-xs text-muted-foreground">
              Use as teclas 1–{options.length} para responder
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
