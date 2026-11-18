import type { LimitesBenchmark, FaixaBenchmark } from "./benchmark";
import { faixaInterpretacao, type FaixaInterpretacao } from "./escalas";
import { alfaCronbach, desvioPadraoAmostral, intervaloConfianca95, media, type Intervalo } from "./estatistica";
import { respostasIguais } from "./inconsistencia";
import type { ItemUEQ, Polaridade } from "./itens";
import { recodificar } from "./recodificar";

// UEQ-S, a versão curta (Handbook UEQ, "Short version for special application scenarios", p. 12-13):
// 8 itens do próprio UEQ, 4 de qualidade pragmática e 4 de hedônica, mais a escala geral (média dos 8).
// O cálculo segue a Short_UEQ_Data_Analysis_Tool_V15.xlsx; as funções estatísticas são as do UEQ completo

// Ordem da planilha (abas Results, Confidence_Intervals e Benchmark)
export const ESCALAS_UEQ_S = ["pragmatica", "hedonica", "geral"] as const;
export type EscalaUeqS = (typeof ESCALAS_UEQ_S)[number];
export type GrupoUeqS = Exclude<EscalaUeqS, "geral">;

export type ItemUeqS = {
  // posição no UEQ-S, de 1 a 8
  ordem: number;
  // o mesmo par no UEQ completo (data/ueq-itens-ptbr.json)
  numeroNoUeq: number;
  escala: GrupoUeqS;
  // no UEQ-S o termo positivo está sempre à direita (p. 12)
  polaridade: Polaridade;
  // true quando o UEQ-S mostra o par com os lados trocados em relação ao UEQ (itens 4 e 7)
  ladoTrocado: boolean;
};

export type DefinicaoItemUeqS = Omit<ItemUeqS, "ladoTrocado">;

// Os lados trocam quando a polaridade do UEQ-S difere da do mesmo par no UEQ
export function montarItensUeqS(definicao: readonly DefinicaoItemUeqS[], itensUeq: readonly ItemUEQ[]): ItemUeqS[] {
  const doUeq = new Map(itensUeq.map((item) => [item.numero, item]));
  return [...definicao]
    .sort((a, b) => a.ordem - b.ordem)
    .map((item) => {
      const original = doUeq.get(item.numeroNoUeq);
      if (!original) throw new RangeError(`O item ${item.numeroNoUeq} do UEQ não está na lista de itens.`);
      return { ...item, ladoTrocado: original.polaridade !== item.polaridade };
    });
}

// Respostas de 1 a 7: a posição marcada no par como o UEQ-S mostra vira a posição no par como o UEQ mostra
// (e vice-versa). Trocar os lados é ler a régua ao contrário: 1 vira 7, 2 vira 6
const espelhar = (valor: number, trocado: boolean) => (trocado ? 8 - valor : valor);

// Valores no formato do UEQ completo, o item n na posição n - 1 (0 onde não há resposta), para os 8 do UEQ-S
export function valoresDoUeqS(valoresUeq: readonly number[], itens: readonly ItemUeqS[]): number[] {
  return itens.map((item) => {
    const valor = valoresUeq[item.numeroNoUeq - 1];
    if (valor === undefined || valor === 0) {
      throw new RangeError(`Falta a resposta do item ${item.numeroNoUeq} do UEQ, que é o item ${item.ordem} do UEQ-S.`);
    }
    return espelhar(valor, item.ladoTrocado);
  });
}

// O contrário: os 8 valores do UEQ-S gravados nos itens equivalentes do UEQ, na orientação de cada um
export function valoresParaOUeq(valoresUeqS: readonly number[], itens: readonly ItemUeqS[]): { numeroNoUeq: number; valor: number }[] {
  if (valoresUeqS.length !== itens.length) {
    throw new RangeError(`O participante tem ${valoresUeqS.length} respostas, mas o UEQ-S tem ${itens.length} itens.`);
  }
  return itens.map((item, posicao) => ({ numeroNoUeq: item.numeroNoUeq, valor: espelhar(valoresUeqS[posicao]!, item.ladoTrocado) }));
}

export type ParametrosInconsistenciaUeqS = {
  amplitudeMaxima: number;
  escalasParaSuspeita: number;
  categoriaDoMeio: number;
};

export type ConfigAnaliseUeqS = {
  protocolo: {
    faixaNeutra: { inferior: number; superior: number };
    alfaMinimo: number;
    inconsistencia: ParametrosInconsistenciaUeqS;
    ic: { z: number };
  };
  benchmark: Record<EscalaUeqS, LimitesBenchmark>;
};

export type MotivoSuspeitaUeqS = "amplitude" | "todasNoMeio";

export type AvaliacaoSuspeitaUeqS = {
  amplitudes: Record<GrupoUeqS, number>;
  escalasInconsistentes: GrupoUeqS[];
  // maior quantidade de itens com a mesma posição marcada (coluna "Same answer for")
  respostasIguais: number;
  motivos: MotivoSuspeitaUeqS[];
  suspeita: boolean;
};

export type ResultadoEscalaUeqS = {
  escala: EscalaUeqS;
  n: number;
  media: number | null;
  dp: number | null;
  ic: Intervalo | null;
  // a planilha não calcula alfa da escala geral
  alfa: number | null;
  faixaInterpretacao: FaixaInterpretacao | null;
  benchmark: FaixaBenchmark | null;
  alfaAbaixoDoMinimo: boolean;
};

export type ResultadoItemUeqS = {
  ordem: number;
  numeroNoUeq: number;
  escala: GrupoUeqS;
  n: number;
  media: number | null;
  dp: number | null;
  ic: Intervalo | null;
  // quantas pessoas marcaram cada posição, de 1 (polo esquerdo do UEQ-S) a 7 (polo direito)
  distribuicao: number[];
};

export type AnaliseUeqS = {
  n: number;
  nExcluidas: number;
  escalas: ResultadoEscalaUeqS[];
  itens: ResultadoItemUeqS[];
  // mesma ordem das participações recebidas, inclusive as que estão fora da análise
  participantes: (AvaliacaoSuspeitaUeqS & { incluidaNaAnalise: boolean })[];
};

export type ParticipacaoUeqS = {
  // as 8 respostas de 1 a 7, na ordem e nos lados do UEQ-S
  valores: readonly number[];
  incluidaNaAnalise: boolean;
};

function recodificarUeqS(valores: readonly number[], itens: readonly ItemUeqS[]): number[] {
  if (valores.length !== itens.length) {
    throw new RangeError(`O participante tem ${valores.length} respostas, mas o UEQ-S tem ${itens.length} itens.`);
  }
  return valores.map((valor, posicao) => recodificar(valor, itens[posicao]!.polaridade));
}

const posicoesDoGrupo = (itens: readonly ItemUeqS[], grupo: GrupoUeqS) =>
  itens.flatMap((item, posicao) => (item.escala === grupo ? [posicao] : []));

// Planilha, aba DT (colunas K, L e M): escore de cada pessoa = média dos itens recodificados da escala
export function escoresUeqS(valores: readonly number[], itens: readonly ItemUeqS[]): Record<EscalaUeqS, number> {
  const recodificados = recodificarUeqS(valores, itens);
  const doGrupo = (grupo: GrupoUeqS) => media(posicoesDoGrupo(itens, grupo).map((posicao) => recodificados[posicao]!)) ?? 0;
  return { pragmatica: doGrupo("pragmatica"), hedonica: doGrupo("hedonica"), geral: media(recodificados) ?? 0 };
}

// Planilha, aba Inconsistencies: escala inconsistente quando a distância entre o melhor e o pior item passa
// de 3 (colunas K e L); suspeita quando isso vale para as 2 escalas (coluna M). A segunda regra só recomenda
// remover quem marcou a categoria do meio nos 8 itens (coluna P, "Remove")
export function avaliarSuspeitaUeqS(
  valores: readonly number[],
  itens: readonly ItemUeqS[],
  parametros: ParametrosInconsistenciaUeqS,
): AvaliacaoSuspeitaUeqS {
  const recodificados = recodificarUeqS(valores, itens);
  const amplitude = (grupo: GrupoUeqS) => {
    const doGrupo = posicoesDoGrupo(itens, grupo).map((posicao) => recodificados[posicao]!);
    return Math.max(...doGrupo) - Math.min(...doGrupo);
  };
  const amplitudes = { pragmatica: amplitude("pragmatica"), hedonica: amplitude("hedonica") };
  const escalasInconsistentes = (["pragmatica", "hedonica"] as const).filter((grupo) => amplitudes[grupo] > parametros.amplitudeMaxima);

  const motivos: MotivoSuspeitaUeqS[] = [];
  if (escalasInconsistentes.length >= parametros.escalasParaSuspeita) motivos.push("amplitude");
  if (valores.every((valor) => valor === parametros.categoriaDoMeio)) motivos.push("todasNoMeio");

  return { amplitudes, escalasInconsistentes, respostasIguais: respostasIguais(valores), motivos, suspeita: motivos.length > 0 };
}

// Planilha, aba Benchmark (colunas C e D): maior estrito, como no UEQ completo
function classificar(media: number | null, limites: LimitesBenchmark): FaixaBenchmark | null {
  if (media === null) return null;
  if (media > limites.excelente) return "excelente";
  if (media > limites.bom) return "bom";
  if (media > limites.acimaDaMedia) return "acimaDaMedia";
  if (media > limites.abaixoDaMedia) return "abaixoDaMedia";
  return "ruim";
}

export function analisarUeqS(
  participacoes: readonly ParticipacaoUeqS[],
  itens: readonly ItemUeqS[],
  config: ConfigAnaliseUeqS,
): AnaliseUeqS {
  const { protocolo } = config;
  const z = protocolo.ic.z;
  // Como no UEQ completo (docs/ueq-protocolo.md, seção 7): estatísticas só com quem está na análise
  const incluidas = participacoes.filter((participacao) => participacao.incluidaNaAnalise).map((participacao) => participacao.valores);
  const n = incluidas.length;
  const recodificados = incluidas.map((valores) => recodificarUeqS(valores, itens));
  const escores = incluidas.map((valores) => escoresUeqS(valores, itens));

  // Abas Confidence_Intervals (J a O) e Scale_Consistency (alfa = 4·r̄ / (1 + 3·r̄), o mesmo do UEQ)
  const escalas = ESCALAS_UEQ_S.map((escala): ResultadoEscalaUeqS => {
    const valores = escores.map((escore) => escore[escala]);
    const m = media(valores);
    const dp = desvioPadraoAmostral(valores);
    const alfa =
      escala === "geral"
        ? null
        : alfaCronbach(posicoesDoGrupo(itens, escala).map((posicao) => recodificados.map((participante) => participante[posicao]!)));
    return {
      escala,
      n,
      media: m,
      dp,
      ic: intervaloConfianca95(m, dp, n, z),
      alfa,
      faixaInterpretacao: m === null ? null : faixaInterpretacao(m, protocolo.faixaNeutra),
      benchmark: classificar(m, config.benchmark[escala]),
      alfaAbaixoDoMinimo: alfa !== null && alfa < protocolo.alfaMinimo,
    };
  });

  // Abas Results (B a E) e Confidence_Intervals (A a G)
  const resultadoItens = itens.map((item, posicao): ResultadoItemUeqS => {
    const valores = recodificados.map((participante) => participante[posicao]!);
    const brutos = incluidas.map((participante) => participante[posicao]!);
    const m = media(valores);
    const dp = desvioPadraoAmostral(valores);
    return {
      ordem: item.ordem,
      numeroNoUeq: item.numeroNoUeq,
      escala: item.escala,
      n,
      media: m,
      dp,
      ic: intervaloConfianca95(m, dp, n, z),
      distribuicao: [1, 2, 3, 4, 5, 6, 7].map((categoria) => brutos.filter((valor) => valor === categoria).length),
    };
  });

  return {
    n,
    nExcluidas: participacoes.length - n,
    escalas,
    itens: resultadoItens,
    participantes: participacoes.map((participacao) => ({
      ...avaliarSuspeitaUeqS(participacao.valores, itens, protocolo.inconsistencia),
      incluidaNaAnalise: participacao.incluidaNaAnalise,
    })),
  };
}
