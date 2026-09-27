import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/SiteHeader";
import { api } from "@/convex/_generated/api";
import {
  DIFFICULTIES,
  WEEKDAYS,
  WEEKDAYS_SHORT,
  formatDate,
  randomDate,
  weekdayOf,
  type Difficulty,
  type QuizDate,
} from "@/lib/doomsday";
import { useMutation, useQuery } from "convex/react";
import { motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router";

interface Stats {
  score: number;
  streak: number;
  bestStreak: number;
  answered: number;
  correct: number;
}

const ZERO_STATS: Stats = { score: 0, streak: 0, bestStreak: 0, answered: 0, correct: 0 };

function initialDifficulty(param: string | null): Difficulty {
  return DIFFICULTIES.some((entry) => entry.id === param)
    ? (param as Difficulty)
    : "beginner";
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

export default function Train() {
  const [searchParams] = useSearchParams();

  const serverStats = useQuery(api.quiz.getStats);
  const recordAnswer = useMutation(api.quiz.recordAnswer);

  const [difficulty, setDifficulty] = useState<Difficulty>(() =>
    initialDifficulty(searchParams.get("level")),
  );
  const [current, setCurrent] = useState<QuizDate>(() =>
    randomDate(initialDifficulty(searchParams.get("level"))),
  );
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [questionId, setQuestionId] = useState(0);

  // Local mirror of the server stats, seeded once so answers feel instant.
  const [stats, setStats] = useState<Stats>(ZERO_STATS);
  const seeded = useRef(false);
  useEffect(() => {
    if (!seeded.current && serverStats !== undefined) {
      seeded.current = true;
      if (serverStats) {
        setStats({
          score: serverStats.score,
          streak: serverStats.streak,
          bestStreak: serverStats.bestStreak,
          answered: serverStats.answered,
          correct: serverStats.correct,
        });
      }
    }
  }, [serverStats]);

  const correct = weekdayOf(current);
  const isCorrect = selected === correct;

  const nextQuestion = useCallback((target: Difficulty) => {
    setCurrent(randomDate(target));
    setSelected(null);
    setAnswered(false);
    setQuestionId((n) => n + 1);
  }, []);

  const answer = useCallback(
    (index: number) => {
      if (answered) return;
      setSelected(index);
      setAnswered(true);

      const gotItRight = index === weekdayOf(current);
      setStats((prev) => {
        const streak = gotItRight ? prev.streak + 1 : 0;
        return {
          score: prev.score + (gotItRight ? 1 : 0),
          streak,
          bestStreak: Math.max(prev.bestStreak, streak),
          answered: prev.answered + 1,
          correct: prev.correct + (gotItRight ? 1 : 0),
        };
      });
      recordAnswer({ correct: gotItRight }).catch(() => {
        /* keep local stats; a retry is not critical for training */
      });
    },
    [answered, current, recordAnswer],
  );

  function changeDifficulty(id: Difficulty) {
    if (id === difficulty) return;
    setDifficulty(id);
    nextQuestion(id);
  }

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (!answered) {
        const digit = Number.parseInt(event.key, 10);
        if (digit >= 1 && digit <= 7) answer(digit - 1);
      } else if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        nextQuestion(difficulty);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [answered, answer, nextQuestion, difficulty]);

  function weekdayClass(index: number) {
    const base =
      "flex h-14 items-center justify-center rounded-md border font-mono text-sm font-medium transition-colors duration-150";
    if (!answered) {
      return `${base} border-border hover:border-foreground hover:bg-muted`;
    }
    if (index === correct) {
      return `${base} border-foreground bg-foreground text-background`;
    }
    if (index === selected) {
      return `${base} border-destructive/50 text-destructive`;
    }
    return `${base} border-border text-muted-foreground opacity-40`;
  }

  const active = DIFFICULTIES.find((entry) => entry.id === difficulty) ?? DIFFICULTIES[0];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <main className="mx-auto w-full max-w-2xl px-6 py-10">
        <p className="font-mono text-xs text-[color:var(--brand)]">// doomsday</p>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight">
          Dia da semana de qualquer data
        </h1>

        {/* Difficulty */}
        <div className="mt-8 flex justify-center">
          <div className="inline-flex flex-wrap justify-center rounded-md border p-1">
            {DIFFICULTIES.map((entry) => (
              <button
                key={entry.id}
                type="button"
                onClick={() => changeDifficulty(entry.id)}
                className={
                  "rounded px-4 py-2 font-mono text-xs transition-colors " +
                  (entry.id === difficulty
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground")
                }
              >
                {entry.label}
              </button>
            ))}
          </div>
        </div>
        <p className="mt-3 text-center font-mono text-xs text-muted-foreground">
          {active.range}
        </p>

        {/* Stats */}
        <div className="mt-10 grid grid-cols-3 divide-x border-y">
          <Stat label="Placar" value={stats.score} />
          <Stat label="Sequência" value={stats.streak} />
          <Stat label="Melhor" value={stats.bestStreak} />
        </div>

        {/* Date card */}
        <div className="mt-12 rounded-xl border bg-card px-6 py-16 text-center">
          <p className="font-mono text-xs tracking-[0.25em] text-muted-foreground uppercase">
            Qual o dia da semana?
          </p>
          <motion.p
            key={questionId}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-6 font-serif text-3xl leading-tight tracking-tight text-balance sm:text-4xl"
          >
            {formatDate(current)}
          </motion.p>
        </div>

        {/* Weekday choices */}
        <div className="mt-8 grid grid-cols-4 gap-2 sm:grid-cols-7">
          {WEEKDAYS_SHORT.map((day, index) => (
            <motion.button
              key={day}
              type="button"
              whileTap={answered ? undefined : { scale: 0.97 }}
              onClick={() => answer(index)}
              disabled={answered}
              className={weekdayClass(index)}
            >
              {day}
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
                    Era <span className="text-foreground">{WEEKDAYS[correct]}</span>.
                  </span>
                )}
              </p>
              <Button onClick={() => nextQuestion(difficulty)} className="gap-2">
                Próxima data
              </Button>
            </div>
          ) : (
            <p className="font-mono text-xs text-muted-foreground">
              Atalhos: teclas <span className="text-foreground">1–7</span> respondem ·{" "}
              <span className="text-foreground">Enter</span> avança
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
