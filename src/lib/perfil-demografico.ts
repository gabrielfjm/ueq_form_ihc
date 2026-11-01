import { PERGUNTAS_DEMOGRAFIA, PREFIRO_NAO_RESPONDER, type Demografia } from "./demografia";

// Perfil dos participantes para a aba Respostas: quantas pessoas marcaram cada opção de cada pergunta.
// "Prefiro não responder" e quem pulou a etapa ficam à parte, para não se misturarem com as opções

export type BarraPerfil = { rotulo: string; quantidade: number; parcela: number };

export type PerguntaPerfil = {
  campo: (typeof PERGUNTAS_DEMOGRAFIA)[number]["campo"];
  titulo: string;
  // escala ordenada (idade, escolaridade, familiaridade) fica na ordem da escala; categorias sem ordem
  // (gênero) vão da maior para a menor
  ordenada: boolean;
  opcoes: BarraPerfil[];
  prefiroNao: BarraPerfil;
  semResposta: BarraPerfil;
  // quem escolheu alguma opção (sem contar "Prefiro não responder")
  responderam: number;
  total: number;
};

// Gênero não tem ordem natural; as outras três perguntas são escalas
const SEM_ORDEM = new Set(["genero"]);

const barra = (rotulo: string, quantidade: number, total: number): BarraPerfil => ({
  rotulo,
  quantidade,
  parcela: total > 0 ? quantidade / total : 0,
});

export function perfilDemografico(demografias: readonly (Demografia | null)[]): PerguntaPerfil[] {
  const total = demografias.length;
  return PERGUNTAS_DEMOGRAFIA.map((pergunta) => {
    const respostas = demografias.map((demografia) => demografia?.[pergunta.campo]);
    const contar = (valor: string) => respostas.filter((resposta) => resposta === valor).length;
    const ordenada = !SEM_ORDEM.has(pergunta.campo);
    const opcoes = pergunta.opcoes.map((opcao) => barra(opcao, contar(opcao), total));
    if (!ordenada) opcoes.sort((a, b) => b.quantidade - a.quantidade);
    const prefiroNao = contar(PREFIRO_NAO_RESPONDER);
    const responderam = opcoes.reduce((soma, opcao) => soma + opcao.quantidade, 0);
    return {
      campo: pergunta.campo,
      titulo: pergunta.titulo,
      ordenada,
      opcoes,
      prefiroNao: barra(PREFIRO_NAO_RESPONDER, prefiroNao, total),
      semResposta: barra("Não respondeu", total - responderam - prefiroNao, total),
      responderam,
      total,
    };
  });
}
