// Faixas fechadas e sempre com "Prefiro não responder" (docs/ihc.md §3.8): nada que identifique a pessoa
export const PREFIRO_NAO_RESPONDER = "Prefiro não responder";

export const PERGUNTAS_DEMOGRAFIA = [
  {
    campo: "faixaEtaria",
    titulo: "Faixa etária",
    opcoes: ["18 a 24 anos", "25 a 34 anos", "35 a 44 anos", "45 a 59 anos", "60 anos ou mais"],
  },
  { campo: "genero", titulo: "Gênero", opcoes: ["Mulher", "Homem", "Outro"] },
  {
    campo: "escolaridade",
    titulo: "Escolaridade",
    opcoes: ["Ensino fundamental", "Ensino médio", "Ensino superior", "Pós-graduação"],
  },
  {
    campo: "familiaridadeComProduto",
    titulo: "Você já usava este produto?",
    opcoes: ["Nunca tinha usado", "Algumas vezes", "Com frequência"],
  },
] as const;

export type Demografia = Partial<Record<(typeof PERGUNTAS_DEMOGRAFIA)[number]["campo"], string>>;

// Só aceita as opções oferecidas; qualquer outro valor vindo do formulário é descartado
export function lerDemografia(dados: FormData): Demografia {
  const demografia: Demografia = {};
  for (const pergunta of PERGUNTAS_DEMOGRAFIA) {
    const valor = dados.get(pergunta.campo);
    if (typeof valor === "string" && [...pergunta.opcoes, PREFIRO_NAO_RESPONDER].includes(valor)) {
      demografia[pergunta.campo] = valor;
    }
  }
  return demografia;
}
