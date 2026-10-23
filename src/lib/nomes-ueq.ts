import type { Escala, FaixaBenchmark } from "@/ueq";

// Nomes oficiais das escalas em português (docs/design.md, Tom de voz: Perspicuidade, não "Clareza")
export const NOME_ESCALA: Record<Escala, string> = {
  atratividade: "Atratividade",
  perspicuidade: "Perspicuidade",
  eficiencia: "Eficiência",
  confiabilidade: "Confiabilidade",
  estimulacao: "Estimulação",
  novidade: "Novidade",
};

export type Construto = "atratividade" | "pragmatica" | "hedonica";

// Handbook UEQ, "Scale structure": a cor do gráfico segue o construto, não a escala
export const CONSTRUTO: Record<Escala, Construto> = {
  atratividade: "atratividade",
  perspicuidade: "pragmatica",
  eficiencia: "pragmatica",
  confiabilidade: "pragmatica",
  estimulacao: "hedonica",
  novidade: "hedonica",
};

export const NOME_CONSTRUTO: Record<Construto, string> = {
  atratividade: "Atratividade",
  pragmatica: "Qualidade pragmática",
  hedonica: "Qualidade hedônica",
};

export const NOME_BENCHMARK: Record<FaixaBenchmark, string> = {
  excelente: "Excelente",
  bom: "Bom",
  acimaDaMedia: "Acima da média",
  abaixoDaMedia: "Abaixo da média",
  ruim: "Ruim",
};
