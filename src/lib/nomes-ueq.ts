import type { Escala, EscalaUeqS, FaixaBenchmark, FaixaInterpretacao } from "@/ueq";
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

// "geral" só existe no UEQ-S: a média dos 8 itens
export type Construto = "atratividade" | "pragmatica" | "hedonica" | "geral";

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
  geral: m("Geral"),
};

// No gráfico do UEQ-S cada escala é o próprio grupo; o rótulo do grupo diz que itens ela junta
export const GRUPOS_UEQ_S: Record<Construto, string> = {
  atratividade: m("Atratividade"),
  pragmatica: m("Itens 1 a 4"),
  hedonica: m("Itens 5 a 8"),
  geral: m("Os 8 itens"),
};

// As 3 escalas do UEQ-S, na ordem da planilha oficial dele (Handbook UEQ, p. 12: "overall scale")
export const NOME_ESCALA_UEQ_S: Record<EscalaUeqS, string> = {
  pragmatica: m("Qualidade pragmática"),
  hedonica: m("Qualidade hedônica"),
  geral: m("Geral"),
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
