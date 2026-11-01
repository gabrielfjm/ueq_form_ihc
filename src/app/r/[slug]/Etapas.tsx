import type { TextosParticipante } from "@/idiomas";
import estilos from "./participante.module.css";

const CENTROS = [24, 73, 122, 172, 221, 270, 320];

type Propriedades = {
  // Posição da etapa atual (0 = consentimento) ou todas concluídas
  atual: 0 | 1 | 2 | "concluidas";
  textos: TextosParticipante["etapas"];
  // a terceira etapa (dados opcionais) só existe quando o estudo coleta dados demográficos
  comDadosOpcionais: boolean;
};

// Shneiderman 4 (diálogos com fechamento): a pessoa sabe em que etapa está e quantas faltam
export function Etapas({ atual, textos, comDadosOpcionais }: Propriedades) {
  const nomes = comDadosOpcionais ? textos.nomes : textos.nomes.slice(0, 2);
  return (
    <ol className={estilos.etapas} aria-label={atual === "concluidas" ? textos.rotuloConcluidas : textos.rotulo}>
      {nomes.map((etapa, posicao) => (
        <li
          key={etapa}
          aria-current={posicao === atual ? "step" : undefined}
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
