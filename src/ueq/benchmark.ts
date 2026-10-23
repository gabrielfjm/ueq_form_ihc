import type { Escala } from "./itens";

export type LimitesBenchmark = {
  excelente: number;
  bom: number;
  acimaDaMedia: number;
  abaixoDaMedia: number;
};

export type TabelaBenchmark = Record<Escala, LimitesBenchmark>;

export type FaixaBenchmark = "excelente" | "bom" | "acimaDaMedia" | "abaixoDaMedia" | "ruim";

// Handbook UEQ, "Test if a product has sufficient user experience" (p. 5): cinco faixas por escala.
// A planilha (aba Benchmark) compara com maior estrito: média igual ao limite fica na faixa de baixo
export function classificarBenchmark(
  escala: Escala,
  media: number | null,
  tabela: TabelaBenchmark,
): FaixaBenchmark | null {
  if (media === null) return null;
  const limites = tabela[escala];
  if (media > limites.excelente) return "excelente";
  if (media > limites.bom) return "bom";
  if (media > limites.acimaDaMedia) return "acimaDaMedia";
  if (media > limites.abaixoDaMedia) return "abaixoDaMedia";
  return "ruim";
}
