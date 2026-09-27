import { useAuth } from "@/hooks/use-auth";
import { WEEKDAYS_SHORT } from "@/lib/doomsday";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router";

const fade = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

const steps = [
  {
    n: "01",
    title: "Uma data aparece",
    body: "O app sorteia um dia, mês e ano — de 1582 até 2400, no nível Mestre.",
  },
  {
    n: "02",
    title: "Você calcula de cabeça",
    body: "Use a âncora do século, os anos bissextos e o Doomsday do mês.",
  },
  {
    n: "03",
    title: "Confirme o dia",
    body: "Escolha o dia da semana e veja na hora se acertou. A sequência cresce.",
  },
];

export default function Landing() {
  const { isAuthenticated } = useAuth();
  const primaryTo = "/train";
  const primaryLabel = isAuthenticated ? "Continuar treinando" : "Começar a treinar";

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <header className="border-b">
        <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-6">
          <Link to="/" className="text-sm font-semibold tracking-[0.35em] uppercase">
            Doomsday
          </Link>
          <nav className="flex items-center gap-6 text-sm">
            <Link
              to={isAuthenticated ? primaryTo : "/auth"}
              className="font-medium transition-colors hover:text-muted-foreground"
            >
              {isAuthenticated ? "Treinar" : "Entrar"}
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl px-6">
        {/* Hero */}
        <section className="grid gap-14 py-20 md:grid-cols-[1.1fr_0.9fr] md:items-center md:py-28">
          <motion.div
            variants={fade}
            initial="hidden"
            animate="show"
            transition={{ duration: 0.5 }}
          >
            <p className="text-xs font-medium tracking-[0.3em] text-muted-foreground uppercase">
              Algoritmo do Doomsday
            </p>
            <h1 className="mt-6 text-4xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-5xl md:text-6xl">
              Descubra o dia da semana de qualquer data.
            </h1>
            <p className="mt-6 max-w-md text-base leading-7 text-muted-foreground">
              Um treino de cálculo mental baseado na Regra do Dia do Juízo Final
              de John Conway. Sem calendário, sem consulta — só a sua cabeça.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                to={primaryTo}
                className="inline-flex h-11 items-center gap-2 rounded-md bg-foreground px-6 text-sm font-medium text-background transition-opacity hover:opacity-90"
              >
                {primaryLabel}
                <ArrowRight className="size-4" />
              </Link>
              {!isAuthenticated && (
                <Link
                  to="/auth"
                  className="inline-flex h-11 items-center rounded-md border px-6 text-sm font-medium transition-colors hover:bg-muted"
                >
                  Entrar
                </Link>
              )}
            </div>
          </motion.div>

          {/* Product preview */}
          <motion.div
            variants={fade}
            initial="hidden"
            animate="show"
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-xl border bg-card p-8"
          >
            <p className="text-xs tracking-[0.3em] text-muted-foreground uppercase">
              Qual o dia da semana?
            </p>
            <p className="mt-8 font-serif text-3xl leading-tight tracking-tight sm:text-4xl">
              14 de Julho de 1789
            </p>
            <div className="mt-10 grid grid-cols-7 gap-1.5">
              {WEEKDAYS_SHORT.map((d) => {
                const selected = d === "Ter";
                return (
                  <div
                    key={d}
                    className={
                      "flex h-12 items-center justify-center rounded-md border text-[11px] font-medium " +
                      (selected
                        ? "border-foreground bg-foreground text-background"
                        : "text-muted-foreground")
                    }
                  >
                    {d}
                  </div>
                );
              })}
            </div>
          </motion.div>
        </section>

        {/* Steps */}
        <section className="border-t py-20">
          <h2 className="text-xs font-medium tracking-[0.3em] text-muted-foreground uppercase">
            Como funciona
          </h2>
          <div className="mt-12 grid gap-10 sm:grid-cols-3">
            {steps.map((s) => (
              <div key={s.n}>
                <span className="font-serif text-2xl text-muted-foreground">{s.n}</span>
                <h3 className="mt-4 text-base font-medium">{s.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{s.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="border-t py-20">
          <div className="flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">
                Pronto para começar?
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Três níveis de dificuldade. Placar e sequência salvos na sua conta.
              </p>
            </div>
            <Link
              to={primaryTo}
              className="inline-flex h-11 shrink-0 items-center gap-2 rounded-md bg-foreground px-6 text-sm font-medium text-background transition-opacity hover:opacity-90"
            >
              {primaryLabel}
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-8 text-xs text-muted-foreground">
          <span>Doomsday · treino de cálculo mental</span>
          <span>Regra de John Conway</span>
        </div>
      </footer>
    </div>
  );
}
