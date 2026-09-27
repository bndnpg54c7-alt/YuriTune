export type Track = "musica" | "doomsday";

export interface CatalogModule {
  id: string;
  track: Track;
  title: string;
  summary: string;
  tags: string[];
  difficulty: "Iniciante" | "Intermediário" | "Avançado";
  href: string;
}

export const TRACK_LABELS: Record<Track, string> = {
  musica: "Música",
  doomsday: "Doomsday",
};

export const TRACK_FILTERS: { id: Track | "todos"; label: string }[] = [
  { id: "todos", label: "Todos" },
  { id: "musica", label: "Música" },
  { id: "doomsday", label: "Doomsday" },
];

export const CATALOG: CatalogModule[] = [
  {
    id: "musica-perfeitos",
    track: "musica",
    title: "Intervalos perfeitos",
    summary:
      "Uníssono, quarta, quinta e oitava. O ponto de partida para separar as distâncias mais estáveis.",
    tags: ["intervalos", "ouvido", "fundamentos"],
    difficulty: "Iniciante",
    href: "/music?set=perfect",
  },
  {
    id: "musica-maiores",
    track: "musica",
    title: "Intervalos maiores",
    summary:
      "Segunda, terça e sexta maiores misturadas às perfeitas. Comece a reconhecer o som mais brilhante.",
    tags: ["intervalos", "ouvido", "maiores"],
    difficulty: "Iniciante",
    href: "/music?set=major",
  },
  {
    id: "musica-menores",
    track: "musica",
    title: "Menores e trítono",
    summary:
      "As terças menores, as sextas e o trítono instável — os intervalos que costumam enganar o ouvido.",
    tags: ["intervalos", "ouvido", "menores", "tritono"],
    difficulty: "Intermediário",
    href: "/music?set=minor",
  },
  {
    id: "musica-todos",
    track: "musica",
    title: "Os doze intervalos",
    summary:
      "Do uníssono à oitava, sem atalhos. O teste completo de reconhecimento melódico.",
    tags: ["intervalos", "ouvido", "completo"],
    difficulty: "Avançado",
    href: "/music?set=all",
  },
  {
    id: "doomsday-seculo",
    track: "doomsday",
    title: "Doomsday: século atual",
    summary:
      "Datas entre 2000 e 2099. A âncora do século é sempre a mesma — foco total no cálculo do ano.",
    tags: ["doomsday", "calendario", "calculo mental"],
    difficulty: "Iniciante",
    href: "/train?level=beginner",
  },
  {
    id: "doomsday-moderno",
    track: "doomsday",
    title: "Doomsday: era moderna",
    summary:
      "De 1800 a 2099. Duas âncoras de século em jogo para treinar a troca de contexto.",
    tags: ["doomsday", "calendario", "calculo mental"],
    difficulty: "Intermediário",
    href: "/train?level=intermediate",
  },
  {
    id: "doomsday-completo",
    track: "doomsday",
    title: "Doomsday: qualquer ano",
    summary:
      "Qualquer data do calendário gregoriano, de 1582 a 2400. O modo mestre do algoritmo de Conway.",
    tags: ["doomsday", "calendario", "completo"],
    difficulty: "Avançado",
    href: "/train?level=master",
  },
];
