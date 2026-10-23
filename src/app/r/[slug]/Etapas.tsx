import estilos from "./participante.module.css";

const ETAPAS = ["Consentimento", "Questionário", "Dados opcionais"] as const;

const CENTROS = [24, 73, 122, 172, 221, 270, 320];

// Shneiderman 4 (diálogos com fechamento): a pessoa sabe em que etapa está e quantas faltam
export function Etapas({ atual }: { atual: (typeof ETAPAS)[number] | "concluidas" }) {
  return (
    <ol
      className={estilos.etapas}
      aria-label={atual === "concluidas" ? "Etapas da participação, todas concluídas" : "Etapas da participação"}
    >
      {ETAPAS.map((etapa, posicao) => (
        <li
          key={etapa}
          aria-current={etapa === atual ? "step" : undefined}
          className={atual === "concluidas" ? estilos.concluida : undefined}
        >
          {posicao + 1} · {etapa}
        </li>
      ))}
    </ol>
  );
}

export function Marcacoes({ cheias = false }: { cheias?: boolean }) {
  return (
    <svg
      viewBox="0 0 344 48"
      className={cheias ? `${estilos.marcacoes} ${estilos.marcacoesCheias}` : estilos.marcacoes}
      aria-hidden="true"
    >
      <line x1="0" y1="24" x2="344" y2="24" />
      {CENTROS.map((cx) => (
        <circle key={cx} cx={cx} cy="24" r="16" />
      ))}
    </svg>
  );
}
