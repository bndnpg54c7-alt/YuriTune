import { SiteHeader } from "@/components/SiteHeader";
import { TRACK_LABELS } from "@/lib/catalog";
import { useAuth } from "@/hooks/use-auth";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router";

const fade = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

const tracks = [
  {
    id: "musica" as const,
    title: "Ouvido musical",
    body: "Reconheça intervalos, do uníssono à oitava, tocados direto no navegador.",
    to: "/music",
    tags: ["intervalos", "áudio"],
  },
  {
    id: "doomsday" as const,
    title: "Algoritmo do Doomsday",
    body: "Calcule mentalmente o dia da semana de qualquer data entre 1582 e 2400.",
    to: "/train",
    tags: ["calendário", "cálculo mental"],
  },
];

export default function Landing() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden border-b">
        <div className="tech-grid pointer-events-none absolute inset-0 opacity-70" />
        <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-transparent via-background/50 to-background" />
        <div className="relative mx-auto grid w-full max-w-5xl gap-14 px-6 py-20 md:grid-cols-[1.1fr_0.9fr] md:items-center md:py-28">
          <motion.div
            variants={fade}
            initial="hidden"
            animate="show"
            transition={{ duration: 0.5 }}
          >
            <p className="font-mono text-xs text-[color:var(--brand)]">
              // estação de treino pessoal
            </p>
            <h1 className="mt-6 text-4xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-5xl md:text-6xl">
              Mantenha o ouvido e o cálculo mental afiados.
            </h1>
            <p className="mt-6 max-w-md text-base leading-7 text-muted-foreground">
              YuriTune reúne os meus dois treinos de sempre: reconhecimento de
              intervalos musicais e o algoritmo do Doomsday. Placar, sequência e
              histórico ficam salvos entre as sessões.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Link
                to="/catalog"
                className="inline-flex h-11 items-center gap-2 rounded-md bg-foreground px-6 text-sm font-medium text-background transition-opacity hover:opacity-90"
              >
                Explorar catálogo
                <ArrowRight className="size-4" />
              </Link>
              <Link
                to={isAuthenticated ? "/train" : "/auth"}
                className="inline-flex h-11 items-center rounded-md border px-6 text-sm font-medium transition-colors hover:bg-muted"
              >
                {isAuthenticated ? "Continuar treinando" : "Começar agora"}
              </Link>
            </div>
          </motion.div>

          {/* Terminal preview */}
          <motion.div
            variants={fade}
            initial="hidden"
            animate="show"
            transition={{ duration: 0.5, delay: 0.1 }}
            className="overflow-hidden rounded-lg border bg-card/70 font-mono text-xs"
          >
            <div className="flex items-center gap-1.5 border-b px-4 py-3">
              <span className="size-2.5 rounded-full bg-muted-foreground/30" />
              <span className="size-2.5 rounded-full bg-muted-foreground/30" />
              <span className="size-2.5 rounded-full bg-muted-foreground/30" />
              <span className="ml-2 text-muted-foreground">~/yuritune</span>
            </div>
            <div className="space-y-2 p-5 leading-relaxed">
              <p>
                <span className="text-[color:var(--brand)]">$</span> yuritune treinar
                doomsday
              </p>
              <p className="text-muted-foreground">
                &gt; Qual o dia da semana?
              </p>
              <p>&gt; 14 de Julho de 1789</p>
              <p>
                <span className="text-[color:var(--brand)]">✓</span> Terça-feira{" "}
                <span className="text-muted-foreground">— sequência 12</span>
              </p>
              <p className="text-muted-foreground">
                score 128 · precisão 94%
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Tracks */}
      <section className="mx-auto w-full max-w-5xl px-6 py-20">
        <h2 className="font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase">
          Duas trilhas
        </h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {tracks.map((track) => (
            <Link
              key={track.id}
              to={isAuthenticated ? track.to : "/auth"}
              className="group flex flex-col rounded-lg border bg-card p-6 transition-colors hover:border-foreground/30"
            >
              <span className="font-mono text-[11px] text-muted-foreground">
                {TRACK_LABELS[track.id]}
              </span>
              <h3 className="mt-4 text-lg font-medium">{track.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {track.body}
              </p>
              <span className="mt-6 flex items-center gap-1.5 font-mono text-xs text-muted-foreground transition-colors group-hover:text-foreground">
                {track.tags.map((tag) => `#${tag}`).join("  ")}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Catalog teaser */}
      <section className="border-t">
        <div className="mx-auto flex w-full max-w-5xl flex-col items-start justify-between gap-8 px-6 py-20 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Catálogo</h2>
            <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
              Todos os módulos de treino em um só lugar. Busque por nome, trilha
              ou tag e comece pelo nível que fizer sentido agora.
            </p>
          </div>
          <Link
            to="/catalog"
            className="inline-flex h-11 shrink-0 items-center gap-2 rounded-md border px-6 text-sm font-medium transition-colors hover:bg-muted"
          >
            Abrir catálogo
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      <footer className="border-t">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-8 font-mono text-xs text-muted-foreground">
          <span>YuriTune · treino diário</span>
          <span>música + doomsday</span>
        </div>
      </footer>
    </div>
  );
}
