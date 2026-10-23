import { classificarBenchmark, type FaixaBenchmark, type TabelaBenchmark } from "./benchmark";
import { resultadoPorEscala, resultadoPorItem, type ParametrosEscala, type ResultadoEscala, type ResultadoItem } from "./escalas";
import { media } from "./estatistica";
import { avaliarSuspeita, type AvaliacaoSuspeita, type ParametrosInconsistencia } from "./inconsistencia";
import { GRUPOS, type Escala, type ItemUEQ } from "./itens";

export type ConfigAnalise = {
  protocolo: ParametrosEscala & {
    alfaMinimo: number;
    inconsistencia: ParametrosInconsistencia;
  };
  benchmark: TabelaBenchmark;
};

export type ParticipacaoParaAnalise = {
  valores: readonly number[];
  incluidaNaAnalise: boolean;
};

export type ResultadoEscalaAnalisada = ResultadoEscala & {
  benchmark: FaixaBenchmark | null;
  alfaAbaixoDoMinimo: boolean;
};

export type AnaliseEstudo = {
  n: number;
  nExcluidas: number;
  escalas: ResultadoEscalaAnalisada[];
  grupos: { pragmatica: number | null; hedonica: number | null };
  itens: ResultadoItem[];
  // mesma ordem das participações recebidas, inclusive as que estão fora da análise
  participantes: (AvaliacaoSuspeita & { incluidaNaAnalise: boolean })[];
};

// Planilha, aba Results (L41 e L42): pragmática e hedônica são médias simples das médias das escalas
function mediaDoGrupo(escalas: readonly ResultadoEscala[], grupo: readonly Escala[]): number | null {
  const medias: number[] = [];
  for (const resultado of escalas) {
    if (!grupo.includes(resultado.escala)) continue;
    if (resultado.media === null) return null;
    medias.push(resultado.media);
  }
  return media(medias);
}

export function analisarEstudo(
  participacoes: readonly ParticipacaoParaAnalise[],
  itens: readonly ItemUEQ[],
  config: ConfigAnalise,
): AnaliseEstudo {
  const { protocolo } = config;
  // docs/ueq-protocolo.md, seção 7: estatísticas só com quem está na análise; suspeita vale para todos
  const incluidas = participacoes
    .filter((participacao) => participacao.incluidaNaAnalise)
    .map((participacao) => participacao.valores);

  const escalas = resultadoPorEscala(incluidas, itens, protocolo).map((resultado) => ({
    ...resultado,
    benchmark: classificarBenchmark(resultado.escala, resultado.media, config.benchmark),
    alfaAbaixoDoMinimo: resultado.alfa !== null && resultado.alfa < protocolo.alfaMinimo,
  }));

  return {
    n: incluidas.length,
    nExcluidas: participacoes.length - incluidas.length,
    escalas,
    grupos: {
      pragmatica: mediaDoGrupo(escalas, GRUPOS.pragmatica),
      hedonica: mediaDoGrupo(escalas, GRUPOS.hedonica),
    },
    itens: resultadoPorItem(incluidas, itens, protocolo.z),
    participantes: participacoes.map((participacao) => ({
      ...avaliarSuspeita(participacao.valores, itens, protocolo.inconsistencia),
      incluidaNaAnalise: participacao.incluidaNaAnalise,
    })),
  };
}

export { classificarBenchmark } from "./benchmark";
export type { FaixaBenchmark, LimitesBenchmark, TabelaBenchmark } from "./benchmark";
export { escoresPorParticipante, faixaInterpretacao, resultadoPorEscala, resultadoPorItem } from "./escalas";
export type { FaixaInterpretacao, ResultadoEscala, ResultadoItem } from "./escalas";
export { alfaCronbach, correlacao, desvioPadraoAmostral, intervaloConfianca95, media } from "./estatistica";
export type { Intervalo } from "./estatistica";
export { amplitudePorEscala, avaliarSuspeita, marcarSuspeitos, respostasIguais } from "./inconsistencia";
export type { AvaliacaoSuspeita, MotivoSuspeita, ParametrosInconsistencia } from "./inconsistencia";
export { ESCALAS, GRUPOS, numerosPorEscala } from "./itens";
export type { Escala, ItemUEQ, Polaridade } from "./itens";
export { recodificar, recodificarParticipante } from "./recodificar";
