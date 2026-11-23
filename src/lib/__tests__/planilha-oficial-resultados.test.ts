import { readFileSync } from "node:fs";
import { join } from "node:path";
import { strFromU8, unzipSync } from "fflate";
import { beforeAll, describe, expect, it } from "vitest";
import { lerRespostas, pastasDeFixture } from "@/ueq/__tests__/carregar";
import { PLANILHA_UEQ, PLANILHA_UEQ_S, preencherPlanilhaOficial, type ModeloPlanilha } from "../planilha-oficial";

// A exportação grava os resultados que o Excel calcularia (planilha-calculo.ts). Aqui eles são lidos do XML do
// arquivo exportado e comparados com o esperado.json de cada fixture, que o Microsoft Excel gerou recalculando a
// planilha oficial (scripts/planilha-oficial.ps1). Erro do Excel e texto vazio contam como null, como no script

const raiz = join(__dirname, "..", "..", "..");
type Arquivos = Record<string, Uint8Array>;
type Lido = number | string | null;

function lerPlanilha(arquivos: Arquivos) {
  const texto = (caminho: string) => strFromU8(arquivos[caminho]!);
  const compartilhados = [...texto("xl/sharedStrings.xml").matchAll(/<si>(.*?)<\/si>/gs)].map((si) =>
    [...si[1]!.matchAll(/<t(?:\s[^>]*)?>(.*?)<\/t>/gs)].map((t) => t[1]).join(""),
  );
  const livro = texto("xl/workbook.xml");
  const relacoes = texto("xl/_rels/workbook.xml.rels");
  const abas = new Map<string, Map<string, Lido>>();
  return (aba: string, endereco: string): Lido => {
    if (!abas.has(aba)) {
      const rid = new RegExp(`<sheet [^>]*name="${aba}"[^>]*r:id="([^"]+)"`).exec(livro)![1];
      const alvo = new RegExp(`Id="${rid}"[^>]*Target="([^"]+)"|Target="([^"]+)"[^>]*Id="${rid}"`).exec(relacoes)!;
      const celulas = new Map<string, Lido>();
      for (const [, ref, atributos, corpo] of texto(`xl/${(alvo[1] ?? alvo[2])!.replace(/^\/?xl\//, "")}`).matchAll(
        /<c r="([A-Z]+\d+)"([^>]*?)(?:\/>|>(.*?)<\/c>)/gs,
      )) {
        const v = corpo ? /<v>([^<]*)<\/v>/.exec(corpo)?.[1] : undefined;
        const tipo = /\st="([^"]*)"/.exec(atributos!)?.[1];
        let valor: Lido = null;
        if (v !== undefined && tipo !== "e") valor = tipo === "s" ? compartilhados[Number(v)]! : tipo === "str" ? v : Number(v);
        celulas.set(ref!, valor === "" ? null : valor);
      }
      abas.set(aba, celulas);
    }
    return abas.get(aba)!.get(endereco) ?? null;
  };
}

const coluna = (celula: (aba: string, endereco: string) => Lido, aba: string, letra: string, de: number, ate: number) =>
  Array.from({ length: ate - de + 1 }, (_, i) => celula(aba, `${letra}${de + i}`));

function conferir(obtido: unknown, esperado: unknown, caminho: string) {
  if (Array.isArray(esperado)) {
    expect(Array.isArray(obtido), caminho).toBe(true);
    expect((obtido as unknown[]).length, caminho).toBe(esperado.length);
    esperado.forEach((valor, i) => conferir((obtido as unknown[])[i], valor, `${caminho}[${i}]`));
  } else if (esperado !== null && typeof esperado === "object") {
    for (const [campo, valor] of Object.entries(esperado)) conferir((obtido as Record<string, unknown>)[campo], valor, `${caminho}.${campo}`);
  } else if (typeof esperado === "number" && typeof obtido === "number") {
    expect(Math.abs(obtido - esperado), `${caminho}: ${obtido} ≠ ${esperado}`).toBeLessThanOrEqual(1e-12 * Math.max(1, Math.abs(esperado)));
  } else {
    expect(obtido, caminho).toEqual(esperado);
  }
}

// Como no servidor, cada modelo é lido uma vez e a preparação dele é reaproveitada
const modelos = new Map<ModeloPlanilha, Uint8Array>();

function exportar(formato: ModeloPlanilha, respostas: number[][]) {
  if (!modelos.has(formato)) modelos.set(formato, readFileSync(join(raiz, formato.arquivo)));
  const modelo = modelos.get(formato)!;
  return lerPlanilha(unzipSync(preencherPlanilhaOficial(modelo, respostas, "en", formato)));
}

// Preparar cada modelo (ler as 75 mil fórmulas) leva uns segundos e cada exportação perto de 1 s
const PRAZO = 30_000;
beforeAll(() => {
  exportar(PLANILHA_UEQ, []);
  exportar(PLANILHA_UEQ_S, []);
}, 60_000);

describe("planilha oficial do UEQ exportada com os resultados gravados", () => {
  for (const pasta of pastasDeFixture()) {
    it(`grava os mesmos resultados que o Excel na fixture ${pasta}`, () => {
      const esperado = JSON.parse(readFileSync(join(raiz, "data", "fixtures", pasta, "esperado.json"), "utf8"));
      const respostas = lerRespostas(pasta);
      const celula = exportar(PLANILHA_UEQ, respostas);
      const n = respostas.length;
      const obtido = {
        escalas: {
          media: coluna(celula, "Confidence_Intervals", "J", 5, 10),
          dp: coluna(celula, "Confidence_Intervals", "K", 5, 10),
          n: celula("Confidence_Intervals", "L5"),
          icInferior: coluna(celula, "Confidence_Intervals", "N", 5, 10),
          icSuperior: coluna(celula, "Confidence_Intervals", "O", 5, 10),
          alfa: ["B23", "E14", "H14", "K14", "N14", "Q14"].map((e) => celula("Scale_Consistency", e)),
          benchmark: coluna(celula, "Benchmark", "C", 3, 8),
          variancia: coluna(celula, "Results", "M", 3, 8),
        },
        grupos: { pragmatica: celula("Results", "L41"), hedonica: celula("Results", "L42") },
        itens: {
          media: coluna(celula, "Results", "B", 3, 28),
          dp: coluna(celula, "Results", "D", 3, 28),
          n: coluna(celula, "Results", "E", 3, 28),
          icInferior: coluna(celula, "Confidence_Intervals", "F", 5, 30),
          icSuperior: coluna(celula, "Confidence_Intervals", "G", 5, 30),
        },
        participantes: {
          escalasInconsistentes: n > 0 ? coluna(celula, "Inconsistencies", "AI", 4, n + 3) : [],
          respostasIguais: n > 0 ? coluna(celula, "Inconsistencies", "AK", 4, n + 3) : [],
        },
        distribuicao: Array.from({ length: 26 }, (_, i) => ["C", "D", "E", "F", "G", "H", "I"].map((l) => celula("Answer_Distributions", `${l}${3 + i}`))),
      };
      for (const chave of Object.keys(obtido) as (keyof typeof obtido)[]) conferir(obtido[chave], esperado[chave], chave);
    }, PRAZO);
  }
});

describe("planilha oficial do UEQ-S exportada com os resultados gravados", () => {
  for (const pasta of pastasDeFixture(join(raiz, "data", "fixtures-ueq-s"))) {
    it(`grava os mesmos resultados que o Excel na fixture ${pasta}`, () => {
      const esperado = JSON.parse(readFileSync(join(raiz, "data", "fixtures-ueq-s", pasta, "esperado.json"), "utf8"));
      const respostas = lerRespostas(`../fixtures-ueq-s/${pasta}`);
      const celula = exportar(PLANILHA_UEQ_S, respostas);
      const n = respostas.length;
      const obtido = {
        escalas: {
          media: coluna(celula, "Confidence_Intervals", "J", 5, 7),
          dp: coluna(celula, "Confidence_Intervals", "K", 5, 7),
          n: celula("Confidence_Intervals", "L5"),
          icInferior: coluna(celula, "Confidence_Intervals", "N", 5, 7),
          icSuperior: coluna(celula, "Confidence_Intervals", "O", 5, 7),
          benchmark: coluna(celula, "Benchmark", "C", 4, 6),
          variancia: coluna(celula, "Results", "M", 4, 6),
        },
        itens: {
          media: coluna(celula, "Results", "B", 4, 11),
          variancia: coluna(celula, "Results", "C", 4, 11),
          dp: coluna(celula, "Results", "D", 4, 11),
          n: coluna(celula, "Results", "E", 4, 11),
          icInferior: coluna(celula, "Confidence_Intervals", "F", 5, 12),
          icSuperior: coluna(celula, "Confidence_Intervals", "G", 5, 12),
        },
        participantes: {
          escalasInconsistentes: n > 0 ? coluna(celula, "Inconsistencies", "M", 4, n + 3) : [],
          respostasIguais: n > 0 ? coluna(celula, "Inconsistencies", "O", 4, n + 3) : [],
        },
      };
      for (const chave of Object.keys(obtido) as (keyof typeof obtido)[]) {
        for (const campo of Object.keys(obtido[chave])) {
          conferir((obtido[chave] as Record<string, unknown>)[campo], esperado[chave][campo], `${chave}.${campo}`);
        }
      }
      // A planilha do UEQ-S não tem alfa para a escala Geral (o script grava null)
      conferir([celula("Scale_Consistency", "E12"), celula("Scale_Consistency", "H12")], esperado.escalas.alfa.slice(0, 2), "escalas.alfa");
    }, PRAZO);
  }
});
