import "server-only";
import protocolo from "../../data/protocolo.json";
import { ehIdioma, IDIOMA_PADRAO, infoIdioma, type InfoIdioma } from "@/idiomas";
import { avaliarSuspeita, type AvaliacaoSuspeita } from "@/ueq";
import { banco } from "./banco";
import { itensDoQuestionario } from "./itens-ueq";

export const PARAMETROS_SUSPEITA = protocolo.inconsistencia;

export type ParticipacaoAvaliada = {
  id: string;
  concluidaEm: Date;
  versao: string;
  // null nas importadas de CSV, que não dizem em que idioma o questionário foi aplicado
  idioma: InfoIdioma | null;
  importada: boolean;
  suspeita: boolean;
  incluidaNaAnalise: boolean;
  avaliacao: AvaliacaoSuspeita;
};

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
// (calculada na conclusão e no script de recálculo), para não mudar sozinha se o protocolo mudar
export async function participacoesAvaliadas(estudoId: string): Promise<ParticipacaoAvaliada[]> {
  const [itens, participacoes] = await Promise.all([itensDoQuestionario(), participacoesConcluidas(estudoId)]);
  return participacoes.map((participacao) => {
    const valores = Array<number>(itens.length).fill(0);
    for (const resposta of participacao.respostas) valores[resposta.item.numero - 1] = resposta.valor;
    return {
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
      avaliacao: avaliarSuspeita(valores, itens, PARAMETROS_SUSPEITA),
    };
  });
}
