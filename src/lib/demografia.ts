import { m } from "@/traducao/nucleo";
// Faixas fechadas e sempre com "Prefiro não responder" (docs/ihc.md §3.8): nada que identifique a pessoa
export const PREFIRO_NAO_RESPONDER = m("Prefiro não responder");

export const PERGUNTAS_DEMOGRAFIA = [
  {
    campo: "faixaEtaria",
    titulo: m("Faixa etária"),
    opcoes: [m("18 a 24 anos"), m("25 a 34 anos"), m("35 a 44 anos"), m("45 a 59 anos"), m("60 anos ou mais")],
  },
  { campo: "genero", titulo: m("Gênero"), opcoes: [m("Mulher"), m("Homem"), m("Outro")] },
  {
    campo: "escolaridade",
    titulo: m("Escolaridade"),
    opcoes: [m("Ensino fundamental"), m("Ensino médio"), m("Ensino superior"), m("Pós-graduação")],
  },
  {
    campo: "familiaridadeComProduto",
    titulo: m("Você já usava este produto?"),
    opcoes: [m("Nunca tinha usado"), m("Algumas vezes"), m("Com frequência")],
  },
] as const;

export type Demografia = Partial<Record<(typeof PERGUNTAS_DEMOGRAFIA)[number]["campo"], string>>;

// Só aceita as opções oferecidas; qualquer outro valor vindo do formulário é descartado
export function lerDemografia(dados: FormData): Demografia {
  const demografia: Demografia = {};
  for (const pergunta of PERGUNTAS_DEMOGRAFIA) {
    const valor = dados.get(pergunta.campo);
    if (typeof valor === "string" && ([...pergunta.opcoes, PREFIRO_NAO_RESPONDER] as readonly string[]).includes(valor)) {
      demografia[pergunta.campo] = valor;
    }
  }
  return demografia;
}
