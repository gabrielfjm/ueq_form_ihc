import { alfaCronbach, desvioPadraoAmostral, intervaloConfianca95, media, type Intervalo } from "./estatistica";
import { ESCALAS, numerosPorEscala, paraCadaEscala, valorDoItem, type Escala, type ItemUEQ } from "./itens";
import { recodificarParticipante } from "./recodificar";

export type FaixaInterpretacao = "positiva" | "neutra" | "negativa";

export type ParametrosEscala = {
  z: number;
  faixaNeutra: { inferior: number; superior: number };
};

export type ResultadoEscala = {
  escala: Escala;
  n: number;
  media: number | null;
  dp: number | null;
  ic: Intervalo | null;
  alfa: number | null;
  faixaInterpretacao: FaixaInterpretacao | null;
};

export type ResultadoItem = {
  numero: number;
  escala: Escala;
  n: number;
  media: number | null;
  dp: number | null;
  ic: Intervalo | null;
  // quantas pessoas marcaram cada posição, de 1 (polo esquerdo) a 7 (polo direito)
  distribuicao: number[];
};

// Planilha, aba DT: escore da escala = média dos itens recodificados daquela escala
export function escoresPorParticipante(valores: readonly number[], itens: readonly ItemUEQ[]): Record<Escala, number> {
  const recodificados = recodificarParticipante(valores, itens);
  const numeros = numerosPorEscala(itens);
  return paraCadaEscala((escala) => {
    const escore = media(numeros[escala].map((numero) => valorDoItem(recodificados, numero)));
    if (escore === null) throw new RangeError(`A escala ${escala} não tem itens na lista recebida.`);
    return escore;
  });
}

// Handbook UEQ, "Test if a product has sufficient user experience" (p. 5): entre -0,8 e 0,8 é neutra,
// acima de 0,8 positiva e abaixo de -0,8 negativa; os próprios limites contam como neutra
export function faixaInterpretacao(
  mediaEscala: number,
  faixaNeutra: ParametrosEscala["faixaNeutra"],
): FaixaInterpretacao {
  if (mediaEscala > faixaNeutra.superior) return "positiva";
  if (mediaEscala < faixaNeutra.inferior) return "negativa";
  return "neutra";
}

export function resultadoPorEscala(
  respostas: readonly (readonly number[])[],
  itens: readonly ItemUEQ[],
  parametros: ParametrosEscala,
): ResultadoEscala[] {
  const escores = respostas.map((valores) => escoresPorParticipante(valores, itens));
  const recodificados = respostas.map((valores) => recodificarParticipante(valores, itens));
  const numeros = numerosPorEscala(itens);
  const n = respostas.length;

  return ESCALAS.map((escala) => {
    const escoresEscala = escores.map((escore) => escore[escala]);
    const m = media(escoresEscala);
    const dp = desvioPadraoAmostral(escoresEscala);
    const colunasDosItens = numeros[escala].map((numero) =>
      recodificados.map((participante) => valorDoItem(participante, numero)),
    );
    return {
      escala,
      n,
      media: m,
      dp,
      ic: intervaloConfianca95(m, dp, n, parametros.z),
      alfa: alfaCronbach(colunasDosItens),
      faixaInterpretacao: m === null ? null : faixaInterpretacao(m, parametros.faixaNeutra),
    };
  });
}

// Planilha, abas Results, Confidence_Intervals e Answer_Distributions
export function resultadoPorItem(
  respostas: readonly (readonly number[])[],
  itens: readonly ItemUEQ[],
  z: number,
): ResultadoItem[] {
  const recodificados = respostas.map((valores) => recodificarParticipante(valores, itens));
  const n = respostas.length;

  return [...itens]
    .sort((a, b) => a.numero - b.numero)
    .map((item) => {
      const valoresItem = recodificados.map((participante) => valorDoItem(participante, item.numero));
      const brutos = respostas.map((participante) => valorDoItem(participante, item.numero));
      const m = media(valoresItem);
      const dp = desvioPadraoAmostral(valoresItem);
      return {
        numero: item.numero,
        escala: item.escala,
        n,
        media: m,
        dp,
        ic: intervaloConfianca95(m, dp, n, z),
        distribuicao: [1, 2, 3, 4, 5, 6, 7].map((posicao) => brutos.filter((valor) => valor === posicao).length),
      };
    });
}
