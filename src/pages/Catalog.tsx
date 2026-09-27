import { SiteHeader } from "@/components/SiteHeader";
import {
  CATALOG,
  TRACK_FILTERS,
  TRACK_LABELS,
  type Track,
} from "@/lib/catalog";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router";

/** Lowercases and strips accents so "tritono" matches "trítono". */
function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

export default function Catalog() {
  const [query, setQuery] = useState("");
  const [track, setTrack] = useState<Track | "todos">("todos");

  const results = useMemo(() => {
    const q = normalize(query.trim());
    return CATALOG.filter((module) => {
      if (track !== "todos" && module.track !== track) return false;
      if (!q) return true;
      const haystack = normalize(
        [module.title, module.summary, module.difficulty, ...module.tags].join(" "),
      );
      return haystack.includes(q);
    });
  }, [query, track]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <main className="mx-auto w-full max-w-5xl px-6 py-12">
        <p className="font-mono text-xs text-[color:var(--brand)]">// catálogo</p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight">
          Módulos de treino
        </h1>
        <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
          Escolha uma trilha e comece a treinar. Busque por nome, nível ou tag.
        </p>

        {/* Controls */}
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar módulos..."
              className="h-10 w-full rounded-md border bg-transparent pr-3 pl-9 font-mono text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
            />
          </div>

          <div className="inline-flex rounded-md border p-1">
            {TRACK_FILTERS.map((filter) => (
              <button
                key={filter.id}
                type="button"
                onClick={() => setTrack(filter.id)}
                className={
                  "rounded px-3 py-1.5 font-mono text-xs transition-colors " +
                  (filter.id === track
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground")
                }
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        <p className="mt-6 font-mono text-xs text-muted-foreground">
          {results.length} módulo{results.length === 1 ? "" : "s"}
        </p>

        {/* Results */}
        {results.length > 0 ? (
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {results.map((module) => (
              <Link
                key={module.id}
                to={module.href}
                className="group flex flex-col rounded-lg border bg-card p-6 transition-colors hover:border-foreground/30"
              >
                <div className="flex items-center justify-between font-mono text-[11px] text-muted-foreground">
                  <span>{TRACK_LABELS[module.track]}</span>
                  <span>{module.difficulty}</span>
                </div>
                <h2 className="mt-4 text-base font-medium">{module.title}</h2>
                <p className="mt-2 flex-1 text-sm leading-6 text-muted-foreground">
                  {module.summary}
                </p>
                <div className="mt-5 flex flex-wrap gap-1.5">
                  {module.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded border px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-lg border border-dashed p-12 text-center">
            <p className="font-mono text-sm text-muted-foreground">
              Nenhum módulo encontrado.
            </p>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setTrack("todos");
              }}
              className="mt-4 font-mono text-xs text-[color:var(--brand)] hover:underline"
            >
              Limpar filtros
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
