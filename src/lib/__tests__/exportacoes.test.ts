import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { analisarEstudo } from "@/ueq";
import { carregarItens, configOficial, lerRespostas, raizFixtures } from "@/ueq/__tests__/carregar";
import { BOM } from "../csv";
import {
  exportarBrutas,
  exportarPlanilhaOficial,
  exportarRecodificadas,
  exportarResultados,
  type ParticipacaoExportada,
} from "../exportacoes";

const itens = carregarItens();

function participacoes(pasta: string): ParticipacaoExportada[] {
  return lerRespostas(pasta).map((valores, posicao) => ({
    id: `p${posicao + 1}`,
    versao: "Checkout atual",
    concluidaEm: "2026-10-29 17:11",
    incluidaNaAnalise: true,
    suspeita: false,
    idioma: "pt",
    traducaoAprovada: true,
    demografia: null,
    valores,
  }));
}

describe("exportarPlanilhaOficial", () => {
  it("da fixture basico sai idêntica ao respostas.csv original", () => {
    const original = readFileSync(join(raizFixtures, "basico", "respostas.csv"), "utf8");
    expect(exportarPlanilhaOficial(participacoes("basico"))).toBe(original);
  });

  it("deixa de fora quem está fora da análise", () => {
    const [primeira, ...outras] = participacoes("basico");
    const texto = exportarPlanilhaOficial([{ ...primeira!, incluidaNaAnalise: false }, ...outras]);
    expect(texto.split("\r\n").filter(Boolean)).toHaveLength(19);
  });
});

describe("exportarBrutas", () => {
  it("tem BOM, cabeçalho e as 26 colunas de itens", () => {
    const texto = exportarBrutas(participacoes("basico"));
    expect(texto.startsWith(BOM)).toBe(true);
    const [cabecalho] = texto.slice(1).split("\r\n");
    expect(cabecalho?.split(";")).toHaveLength(11 + 26);
    expect(cabecalho).toContain("item01");
    expect(cabecalho).toContain("item26");
  });

  it("protege versão e demografia com ; aspas e quebra de linha", () => {
    const [primeira] = participacoes("basico");
    const texto = exportarBrutas([
      {
        ...primeira!,
        versao: 'Checkout "novo"; com cupom',
        demografia: { faixaEtaria: "25 a 34 anos", genero: "Outro\nnão listado" },
      },
    ]);
    expect(texto).toContain('"Checkout ""novo""; com cupom"');
    expect(texto).toContain('"Outro\nnão listado"');
    expect(texto).toContain(";sim;não;pt;sim;25 a 34 anos;");
  });
});

describe("idioma nas exportações", () => {
  it("diz em que idioma a pessoa respondeu e se a tradução é aprovada", () => {
    const [primeira] = participacoes("basico");
    const [, linha] = exportarBrutas([{ ...primeira!, idioma: "kn", traducaoAprovada: false }]).split("\r\n");
    expect(linha?.split(";").slice(5, 7)).toEqual(["kn", "não"]);
  });
});

describe("exportarRecodificadas", () => {
  it("troca os valores de 1 a 7 por -3 a +3 com a polaridade corrigida", () => {
    const texto = exportarRecodificadas([{ ...participacoes("basico")[0]!, valores: Array(26).fill(7) }], itens);
    const linha = texto.split("\r\n")[1]?.split(";") ?? [];
    // item 1 tem positivo à direita (+3), item 3 à esquerda (-3)
    expect(linha[11]).toBe("3");
    expect(linha[13]).toBe("-3");
  });
});

describe("exportarResultados", () => {
  it("escreve uma linha por escala com vírgula decimal", () => {
    const analise = analisarEstudo(
      lerRespostas("basico").map((valores) => ({ valores, incluidaNaAnalise: true })),
      itens,
      configOficial,
    );
    const linhas = exportarResultados([{ versao: "Todas as versões", analise }]).split("\r\n");
    expect(linhas).toHaveLength(1 + 6 + 1);
    // Os mesmos números que analisarEstudo devolveu para a fixture basico no prompt 02
    expect(linhas[1]).toBe("Todas as versões;Atratividade;20;0,7333;0,9167;0,3316;1,1351;0,9173;neutra;Abaixo da média");
  });
});
