import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const MINIMO_TEXTO = 4.5; // WCAG 1.4.3
const MINIMO_NAO_TEXTUAL = 3; // WCAG 1.4.11

function lerTokens(): Map<string, string> {
  const css = readFileSync(join(__dirname, "..", "tokens.css"), "utf8");
  const tokens = new Map<string, string>();
  for (const [, nome, hex] of css.matchAll(/--([a-z-]+):\s*(#[0-9a-fA-F]{6})\b/g)) {
    if (nome && hex) tokens.set(nome, hex);
  }
  return tokens;
}

// Luminância relativa conforme a definição do WCAG 2.2
function luminancia(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((inicio) => {
    const canal = parseInt(hex.slice(inicio, inicio + 2), 16) / 255;
    return canal <= 0.04045 ? canal / 12.92 : ((canal + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * (r ?? 0) + 0.7152 * (g ?? 0) + 0.0722 * (b ?? 0);
}

function razaoContraste(a: string, b: string): number {
  const [clara, escura] = [luminancia(a), luminancia(b)].sort((x, y) => y - x);
  return ((clara ?? 0) + 0.05) / ((escura ?? 0) + 0.05);
}

const tokens = lerTokens();

function cor(nome: string): string {
  const hex = tokens.get(nome);
  if (!hex) throw new Error(`Token --${nome} não encontrado em tokens.css`);
  return hex;
}

const faixasBenchmark = ["bench-excelente", "bench-bom", "bench-acima", "bench-abaixo", "bench-ruim"];
const fundosDePapel = ["papel", "papel-fundo", "papel-claro"];

type Par = [frente: string, fundo: string];

const paresDeTexto: Par[] = [
  ...["tinta", "tinta-suave", "tinta-fraca", "acento", "alerta"].flatMap((frente) =>
    fundosDePapel.map((fundo): Par => [frente, fundo]),
  ),
  ["acento", "acento-fundo"],
  ["papel", "tinta"],
  // design.md: sobre as faixas do benchmark, texto usa só --tinta ou --tinta-suave
  ...["tinta", "tinta-suave"].flatMap((frente) =>
    faixasBenchmark.map((fundo): Par => [frente, fundo]),
  ),
];

const paresNaoTextuais: Par[] = [
  ...fundosDePapel.map((fundo): Par => ["borda-campo", fundo]),
  ...fundosDePapel.map((fundo): Par => ["acento", fundo]),
  ...["atratividade", "pragmatica", "hedonica"].flatMap((marcador) =>
    ["papel", ...faixasBenchmark].map((fundo): Par => [marcador, fundo]),
  ),
];

describe("contraste dos tokens de cor", () => {
  it.each(paresDeTexto)("texto --%s sobre --%s atinge 4,5:1", (frente, fundo) => {
    expect(razaoContraste(cor(frente), cor(fundo))).toBeGreaterThanOrEqual(MINIMO_TEXTO);
  });

  it.each(paresNaoTextuais)(
    "borda, foco ou marcador --%s sobre --%s atinge 3:1",
    (frente, fundo) => {
      expect(razaoContraste(cor(frente), cor(fundo))).toBeGreaterThanOrEqual(MINIMO_NAO_TEXTUAL);
    },
  );
});
