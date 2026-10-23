// Ordem da planilha oficial (abas Results e Confidence_Intervals); exportações e painel seguem a mesma
export const ESCALAS = [
  "atratividade",
  "perspicuidade",
  "eficiencia",
  "confiabilidade",
  "estimulacao",
  "novidade",
] as const;

export type Escala = (typeof ESCALAS)[number];

// '+' = termo positivo à direita, '-' = à esquerda (docs/ueq-protocolo.md, seção 1)
export type Polaridade = "+" | "-";

export type ItemUEQ = {
  numero: number;
  escala: Escala;
  polaridade: Polaridade;
};

// Handbook UEQ, "Scale structure" (p. 2): Perspicuidade, Eficiência e Confiabilidade são
// pragmáticas; Estimulação e Novidade, hedônicas; Atratividade fica sozinha
export const GRUPOS = {
  pragmatica: ["perspicuidade", "eficiencia", "confiabilidade"],
  hedonica: ["estimulacao", "novidade"],
} as const satisfies Record<string, readonly Escala[]>;

export function paraCadaEscala<T>(calcular: (escala: Escala) => T): Record<Escala, T> {
  return {
    atratividade: calcular("atratividade"),
    perspicuidade: calcular("perspicuidade"),
    eficiencia: calcular("eficiencia"),
    confiabilidade: calcular("confiabilidade"),
    estimulacao: calcular("estimulacao"),
    novidade: calcular("novidade"),
  };
}

export function numerosPorEscala(itens: readonly ItemUEQ[]): Record<Escala, number[]> {
  return paraCadaEscala((escala) =>
    itens
      .filter((item) => item.escala === escala)
      .map((item) => item.numero)
      .sort((a, b) => a - b),
  );
}

// Respostas chegam sempre como 26 valores na ordem oficial: o item n fica na posição n - 1
export function valorDoItem(valores: readonly number[], numero: number): number {
  const valor = valores[numero - 1];
  if (valor === undefined) {
    throw new RangeError(`Falta a resposta do item ${numero}: o participante tem ${valores.length} valores.`);
  }
  return valor;
}
