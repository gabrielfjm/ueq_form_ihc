import type { Escala, FaixaBenchmark, FaixaInterpretacao } from "@/ueq";
import { m } from "@/traducao/nucleo";

// Nomes oficiais das escalas em português (docs/design.md, Tom de voz: Perspicuidade, não "Clareza")
export const NOME_ESCALA: Record<Escala, string> = {
  atratividade: m("Atratividade"),
  perspicuidade: m("Perspicuidade"),
  eficiencia: m("Eficiência"),
  confiabilidade: m("Confiabilidade"),
  estimulacao: m("Estimulação"),
  novidade: m("Novidade"),
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
  atratividade: m("Atratividade"),
  pragmatica: m("Qualidade pragmática"),
  hedonica: m("Qualidade hedônica"),
};

export const NOME_BENCHMARK: Record<FaixaBenchmark, string> = {
  excelente: m("Excelente"),
  bom: m("Bom"),
  acimaDaMedia: m("Acima da média"),
  abaixoDaMedia: m("Abaixo da média"),
  ruim: m("Ruim"),
};

// A leitura da média (-0,8 / +0,8) já vem em português do cálculo; mostrada com t(faixa)
export const NOME_FAIXA: Record<FaixaInterpretacao, string> = {
  positiva: m("positiva"),
  neutra: m("neutra"),
  negativa: m("negativa"),
};
