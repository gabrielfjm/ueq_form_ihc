import "server-only";
import protocoloUeqS from "../../data/protocolo-ueq-s.json";
import protocolo from "../../data/protocolo.json";
import { ehIdioma, IDIOMA_PADRAO, infoIdioma, type InfoIdioma } from "@/idiomas";
import {
  avaliarSuspeita,
  avaliarSuspeitaUeqS,
  valoresDoUeqS,
  type AvaliacaoSuspeita,
  type AvaliacaoSuspeitaUeqS,
} from "@/ueq";
import { banco } from "./banco";
import { ITENS_UEQ_S, type Instrumento } from "./instrumento";
import { itensDoQuestionario } from "./itens-ueq";

export const PARAMETROS_SUSPEITA = protocolo.inconsistencia;
export const PARAMETROS_SUSPEITA_UEQ_S = protocoloUeqS.inconsistencia;

export type ParticipacaoAvaliada = {
  id: string;
  concluidaEm: Date;
  versao: string;
  // null nas importadas de CSV, que não dizem em que idioma o questionário foi aplicado
  idioma: InfoIdioma | null;
  importada: boolean;
  suspeita: boolean;
  incluidaNaAnalise: boolean;
} & ({ instrumento: "UEQ"; avaliacao: AvaliacaoSuspeita } | { instrumento: "UEQ_S"; avaliacao: AvaliacaoSuspeitaUeqS });

async function participacoesConcluidas(estudoId: string) {
  return banco.participacao.findMany({
    where: { versao: { estudoId }, concluidaEm: { not: null } },
    orderBy: { concluidaEm: "desc" },
    select: {
      id: true,
      concluidaEm: true,
      idioma: true,
      origem: true,
      suspeita: true,
      incluidaNaAnalise: true,
      versao: { select: { nome: true } },
      respostas: { select: { valor: true, item: { select: { numero: true } } } },
    },
  });
}

// As amplitudes e o motivo vêm de src/ueq a cada leitura; a marca de suspeita fica gravada
// (calculada na conclusão e no script de recálculo), para não mudar sozinha se o protocolo mudar.
// Cada instrumento com as regras da planilha dele: o UEQ-S tem 2 escalas e 8 itens
export async function participacoesAvaliadas(estudoId: string, instrumento: Instrumento): Promise<ParticipacaoAvaliada[]> {
  const [itens, participacoes] = await Promise.all([itensDoQuestionario(), participacoesConcluidas(estudoId)]);
  return participacoes.map((participacao): ParticipacaoAvaliada => {
    const valores = Array<number>(itens.length).fill(0);
    for (const resposta of participacao.respostas) valores[resposta.item.numero - 1] = resposta.valor;
    const avaliacao =
      instrumento === "UEQ_S"
        ? ({ instrumento, avaliacao: avaliarSuspeitaUeqS(valoresDoUeqS(valores, ITENS_UEQ_S), ITENS_UEQ_S, PARAMETROS_SUSPEITA_UEQ_S) } as const)
        : ({ instrumento, avaliacao: avaliarSuspeita(valores, itens, PARAMETROS_SUSPEITA) } as const);
    return {
      ...avaliacao,
      id: participacao.id,
      concluidaEm: participacao.concluidaEm ?? new Date(0),
      versao: participacao.versao.nome,
      idioma:
        participacao.origem === "IMPORTADA"
          ? null
          : infoIdioma(ehIdioma(participacao.idioma) ? participacao.idioma : IDIOMA_PADRAO),
      importada: participacao.origem === "IMPORTADA",
      suspeita: participacao.suspeita,
      incluidaNaAnalise: participacao.incluidaNaAnalise,
    };
  });
}
