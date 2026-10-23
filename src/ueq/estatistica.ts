export type Intervalo = {
  inferior: number;
  superior: number;
};

export function media(valores: readonly number[]): number | null {
  if (valores.length === 0) return null;
  return valores.reduce((soma, valor) => soma + valor, 0) / valores.length;
}

// Planilha, aba Confidence_Intervals: STDEV, divisor n - 1
export function desvioPadraoAmostral(valores: readonly number[]): number | null {
  const m = media(valores);
  if (m === null || valores.length < 2) return null;
  const somaQuadrados = valores.reduce((soma, valor) => soma + (valor - m) ** 2, 0);
  return Math.sqrt(somaQuadrados / (valores.length - 1));
}

// Handbook UEQ, "How to interpret the data" (p. 9): IC de 95% da média.
// A planilha usa CONFIDENCE(0.05; dp; n), que dá #NUM! quando dp = 0, por isso null nesse caso
export function intervaloConfianca95(
  mediaAmostra: number | null,
  dp: number | null,
  n: number,
  z: number,
): Intervalo | null {
  if (mediaAmostra === null || dp === null || dp <= 0 || n < 1) return null;
  const margem = (z * dp) / Math.sqrt(n);
  return { inferior: mediaAmostra - margem, superior: mediaAmostra + margem };
}

// Pearson, como CORREL da planilha: sem variância em uma das séries não há correlação (#DIV/0!)
export function correlacao(x: readonly number[], y: readonly number[]): number | null {
  if (x.length !== y.length) {
    throw new RangeError(`As séries têm tamanhos diferentes (${x.length} e ${y.length}).`);
  }
  const mediaX = media(x);
  const mediaY = media(y);
  if (mediaX === null || mediaY === null || x.length < 2) return null;

  let produtos = 0;
  let quadradosX = 0;
  let quadradosY = 0;
  for (const [i, valorX] of x.entries()) {
    const valorY = y[i];
    if (valorY === undefined) continue;
    const desvioX = valorX - mediaX;
    const desvioY = valorY - mediaY;
    produtos += desvioX * desvioY;
    quadradosX += desvioX ** 2;
    quadradosY += desvioY ** 2;
  }
  if (quadradosX === 0 || quadradosY === 0) return null;
  return produtos / Math.sqrt(quadradosX * quadradosY);
}

// Handbook UEQ, "What does the Cronbach-Alpha values mean?" (p. 10): alfa = k·r̄ / (1 + (k - 1)·r̄),
// com r̄ a média das correlações entre os pares de itens (planilha, aba Scale_Consistency).
// Cada coluna traz os valores de um item, um por participante
export function alfaCronbach(colunas: readonly (readonly number[])[]): number | null {
  const k = colunas.length;
  if (k < 2) return null;

  const correlacoes: number[] = [];
  for (let i = 0; i < k; i++) {
    for (let j = i + 1; j < k; j++) {
      const r = correlacao(colunas[i] ?? [], colunas[j] ?? []);
      if (r === null) return null;
      correlacoes.push(r);
    }
  }
  const rMedio = media(correlacoes);
  if (rMedio === null) return null;
  const denominador = 1 + (k - 1) * rMedio;
  if (denominador === 0) return null;
  return (k * rMedio) / denominador;
}
