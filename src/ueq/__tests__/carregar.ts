import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { z } from "zod";
import benchmarkUeqS from "../../../data/benchmark-ueq-s.json";
import benchmark from "../../../data/benchmark.json";
import protocoloUeqS from "../../../data/protocolo-ueq-s.json";
import protocolo from "../../../data/protocolo.json";
import type { ConfigAnalise } from "..";
import { ESCALAS, type ItemUEQ } from "../itens";
import { montarItensUeqS, type ConfigAnaliseUeqS, type ItemUeqS } from "../ueq-s";

const raizDados = join(__dirname, "..", "..", "..", "data");
export const raizFixtures = join(raizDados, "fixtures");

export const configOficial: ConfigAnalise = { protocolo, benchmark: benchmark.escalas };

const arquivoItens = z.object({
  itens: z.array(
    z.object({
      numero: z.int(),
      escala: z.enum(ESCALAS),
      polaridade: z.enum(["+", "-"]),
    }),
  ),
});

export function carregarItens(): ItemUEQ[] {
  return arquivoItens.parse(JSON.parse(readFileSync(join(raizDados, "ueq-itens-ptbr.json"), "utf8"))).itens;
}

const arquivoItensUeqS = z.object({
  itens: z.array(
    z.object({
      ordem: z.int(),
      numeroNoUeq: z.int(),
      escala: z.enum(["pragmatica", "hedonica"]),
      polaridade: z.enum(["+", "-"]),
    }),
  ),
});

export function carregarItensUeqS(): ItemUeqS[] {
  const { itens } = arquivoItensUeqS.parse(JSON.parse(readFileSync(join(raizDados, "ueq-s-itens-ptbr.json"), "utf8")));
  return montarItensUeqS(itens, carregarItens());
}

export const configOficialUeqS: ConfigAnaliseUeqS = {
  protocolo: { ...protocolo, inconsistencia: protocoloUeqS.inconsistencia },
  benchmark: benchmarkUeqS.escalas,
};

export const raizFixturesUeqS = join(raizDados, "fixtures-ueq-s");

// Monta as 26 respostas de 1 a 7 a partir do valor recodificado (-3 a 3) que cada item deve ter
export function montarRespostas(itens: readonly ItemUEQ[], recodificado: (item: ItemUEQ) => number): number[] {
  return [...itens]
    .sort((a, b) => a.numero - b.numero)
    .map((item) => (item.polaridade === "+" ? recodificado(item) + 4 : 4 - recodificado(item)));
}

// Formato de colar na planilha: uma linha por participante, 26 valores separados por ponto e vírgula
export function lerRespostas(pastaFixture: string): number[][] {
  return readFileSync(join(raizFixtures, pastaFixture, "respostas.csv"), "utf8")
    .split(/\r?\n/)
    .filter((linha) => linha.trim() !== "")
    .map((linha) => linha.split(";").map(Number));
}

// Caminhos relativos ("basico", "extremos/n1") de toda pasta que tem respostas.csv
export function pastasDeFixture(pasta = raizFixtures): string[] {
  const encontradas = existsSync(join(pasta, "respostas.csv")) ? [relative(raizFixtures, pasta).split(sep).join("/")] : [];
  for (const entrada of readdirSync(pasta, { withFileTypes: true })) {
    if (entrada.isDirectory()) encontradas.push(...pastasDeFixture(join(pasta, entrada.name)));
  }
  return encontradas.sort();
}
