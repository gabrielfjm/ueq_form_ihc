import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { z } from "zod";
import { carregarItens } from "./carregar";

// prompts/10-extensoes.md, UEQ-S: a equipe preenche os itens e o benchmark; enquanto estiverem vazios,
// estes testes ficam pulados, como os das fixtures sem esperado.json
const raizDados = join(__dirname, "..", "..", "..", "data");
const lerJson = (arquivo: string) => JSON.parse(readFileSync(join(raizDados, arquivo), "utf8")) as unknown;

const arquivoItens = z.object({
  fonte: z.string(),
  itens: z.array(
    z.object({
      ordem: z.number().int(),
      numeroNoUeq: z.number().int().min(1).max(26),
      termoEsquerdo: z.string().min(1),
      termoDireito: z.string().min(1),
      escala: z.enum(["pragmatica", "hedonica"]),
      polaridade: z.enum(["+", "-"]),
    }),
  ),
});

const limites = z.object({
  excelente: z.number().nullable(),
  bom: z.number().nullable(),
  acimaDaMedia: z.number().nullable(),
  abaixoDaMedia: z.number().nullable(),
});
const arquivoBenchmark = z.object({
  fonte: z.string(),
  escalas: z.object({ pragmatica: limites, hedonica: limites, geral: limites }),
});

const PRAGMATICAS = new Set(["perspicuidade", "eficiencia", "confiabilidade"]);
const HEDONICAS = new Set(["estimulacao", "novidade"]);

describe("UEQ-S: data/ueq-s-itens-ptbr.json", () => {
  const { fonte, itens } = arquivoItens.parse(lerJson("ueq-s-itens-ptbr.json"));

  if (itens.length === 0) {
    it.skip("a equipe ainda não preencheu os 8 itens do UEQ-S (data/LEIA-ME.md, passo 5)", () => {});
    return;
  }

  it("tem fonte e 8 itens na ordem 1 a 8, 4 pragmáticos e 4 hedônicos, sem repetir par do UEQ", () => {
    expect(fonte.trim()).not.toBe("");
    expect(itens.map((item) => item.ordem)).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
    expect(itens.filter((item) => item.escala === "pragmatica")).toHaveLength(4);
    expect(itens.filter((item) => item.escala === "hedonica")).toHaveLength(4);
    expect(new Set(itens.map((item) => item.numeroNoUeq)).size).toBe(8);
  });

  it("cada item é um par do UEQ, da escala certa, com a polaridade coerente com o lado dos termos", () => {
    const ueq = new Map(carregarItens().map((item) => [item.numero, item]));
    const textos = JSON.parse(readFileSync(join(raizDados, "ueq-itens-ptbr.json"), "utf8")) as {
      itens: { numero: number; termoEsquerdo: string; termoDireito: string; escala: string }[];
    };
    const termos = new Map(textos.itens.map((item) => [item.numero, item]));
    for (const item of itens) {
      const original = termos.get(item.numeroNoUeq)!;
      const onde = `UEQ-S item ${item.ordem} (UEQ ${item.numeroNoUeq})`;
      const mesmoLado = original.termoEsquerdo === item.termoEsquerdo && original.termoDireito === item.termoDireito;
      const ladoTrocado = original.termoEsquerdo === item.termoDireito && original.termoDireito === item.termoEsquerdo;
      expect(mesmoLado || ladoTrocado, `${onde}: os termos não são os do par do UEQ`).toBe(true);
      const polaridadeUeq = ueq.get(item.numeroNoUeq)!.polaridade;
      const esperada = mesmoLado ? polaridadeUeq : polaridadeUeq === "+" ? "-" : "+";
      expect(item.polaridade, `${onde}: polaridade`).toBe(esperada);
      const grupo = item.escala === "pragmatica" ? PRAGMATICAS : HEDONICAS;
      expect(grupo.has(original.escala), `${onde}: ${original.escala} não é ${item.escala}`).toBe(true);
    }
  });
});

describe("UEQ-S: data/benchmark-ueq-s.json", () => {
  const { fonte, escalas } = arquivoBenchmark.parse(lerJson("benchmark-ueq-s.json"));
  const valores = Object.values(escalas).flatMap((escala) => Object.values(escala));

  if (valores.every((valor) => valor === null)) {
    it.skip("a equipe ainda não preencheu o benchmark do UEQ-S (data/LEIA-ME.md, passo 5)", () => {});
    return;
  }

  it("tem fonte e, em cada escala, os 4 limites do maior para o menor", () => {
    expect(fonte.trim()).not.toBe("");
    for (const [nome, escala] of Object.entries(escalas)) {
      const { excelente, bom, acimaDaMedia, abaixoDaMedia } = escala;
      expect([excelente, bom, acimaDaMedia, abaixoDaMedia], nome).not.toContain(null);
      expect(excelente!, nome).toBeGreaterThan(bom!);
      expect(bom!, nome).toBeGreaterThan(acimaDaMedia!);
      expect(acimaDaMedia!, nome).toBeGreaterThan(abaixoDaMedia!);
    }
  });
});
