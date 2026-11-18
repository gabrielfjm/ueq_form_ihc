import "server-only";
import benchmarkUeqS from "../../data/benchmark-ueq-s.json";
import benchmark from "../../data/benchmark.json";
import protocoloUeqS from "../../data/protocolo-ueq-s.json";
import protocolo from "../../data/protocolo.json";
import {
  analisarEstudo,
  analisarUeqS,
  valoresDoUeqS,
  type AnaliseEstudo,
  type AnaliseUeqS,
  type ConfigAnalise,
  type ConfigAnaliseUeqS,
} from "@/ueq";
import { banco } from "./banco";
import { ITENS_UEQ_S } from "./instrumento";
import { itensDoQuestionario } from "./itens-ueq";

const CONFIG: ConfigAnalise = { protocolo, benchmark: benchmark.escalas };

// UEQ-S: faixa neutra, z e alfa mínimo do UEQ; regras de suspeita da planilha do UEQ-S (data/protocolo-ueq-s.json)
export const CONFIG_UEQ_S: ConfigAnaliseUeqS = {
  protocolo: { ...protocolo, inconsistencia: protocoloUeqS.inconsistencia },
  benchmark: benchmarkUeqS.escalas,
};

export type AnalisePorVersao = { versaoId: string; nome: string; analise: AnaliseEstudo };
export type AnaliseUeqSPorVersao = { versaoId: string; nome: string; analise: AnaliseUeqS };

// As respostas de cada participação concluída como 26 valores na ordem do UEQ (0 onde não há resposta: num
// estudo do UEQ-S só os 8 itens equivalentes têm valor)
async function respostasNoFormatoDoUeq(estudoId: string) {
  const participacoes = await banco.participacao.findMany({
    where: { versao: { estudoId }, concluidaEm: { not: null } },
    select: {
      versaoId: true,
      incluidaNaAnalise: true,
      respostas: { select: { valor: true, item: { select: { numero: true } } } },
    },
  });
  return participacoes.map((participacao) => {
    const valores = Array<number>(26).fill(0);
    for (const resposta of participacao.respostas) valores[resposta.item.numero - 1] = resposta.valor;
    return { versaoId: participacao.versaoId, valores, incluidaNaAnalise: participacao.incluidaNaAnalise };
  });
}

// Monta a entrada do módulo src/ueq a partir do banco. Todo cálculo estatístico fica lá:
// aqui só se busca, se ordena pelos 26 itens e se separa por versão (prompts/06-painel-resultados.md)
export async function analisarResultados(estudoId: string, versoes: readonly { id: string; nome: string }[]) {
  const [itens, entradas] = await Promise.all([itensDoQuestionario(), respostasNoFormatoDoUeq(estudoId)]);

  return {
    itens,
    todas: analisarEstudo(entradas, itens, CONFIG),
    porVersao: versoes.map(
      (versao): AnalisePorVersao => ({
        versaoId: versao.id,
        nome: versao.nome,
        analise: analisarEstudo(
          entradas.filter((entrada) => entrada.versaoId === versao.id),
          itens,
          CONFIG,
        ),
      }),
    ),
    benchmark: CONFIG.benchmark,
    faixaNeutra: protocolo.faixaNeutra,
  };
}

// O mesmo para o UEQ-S. Serve aos dois tipos de estudo: no do UEQ-S são as respostas dele; no do UEQ completo,
// os 8 itens equivalentes, como Schrepp, Hinderks e Thomaschewski (2017) fizeram para montar o UEQ-S
export async function analisarResultadosUeqS(estudoId: string, versoes: readonly { id: string; nome: string }[]) {
  const entradas = (await respostasNoFormatoDoUeq(estudoId)).map((entrada) => ({
    ...entrada,
    valores: valoresDoUeqS(entrada.valores, ITENS_UEQ_S),
  }));

  return {
    itens: ITENS_UEQ_S,
    todas: analisarUeqS(entradas, ITENS_UEQ_S, CONFIG_UEQ_S),
    porVersao: versoes.map(
      (versao): AnaliseUeqSPorVersao => ({
        versaoId: versao.id,
        nome: versao.nome,
        analise: analisarUeqS(
          entradas.filter((entrada) => entrada.versaoId === versao.id),
          ITENS_UEQ_S,
          CONFIG_UEQ_S,
        ),
      }),
    ),
    benchmark: CONFIG_UEQ_S.benchmark,
    faixaNeutra: protocolo.faixaNeutra,
  };
}
