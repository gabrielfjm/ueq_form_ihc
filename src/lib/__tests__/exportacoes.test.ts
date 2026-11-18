import { describe, expect, it } from "vitest";
import { analisarEstudo, analisarUeqS } from "@/ueq";
import { carregarItens, carregarItensUeqS, configOficial, configOficialUeqS, lerRespostas } from "@/ueq/__tests__/carregar";
import { BOM } from "../csv";
import {
  exportarBrutas,
  exportarRecodificadas,
  exportarRecodificadasUeqS,
  exportarResultados,
  exportarResultadosUeqS,
  linhasDaPlanilhaOficial,
  linhasDaPlanilhaUeqS,
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
    origem: "link",
    idioma: "pt",
    traducaoAprovada: true,
    menorDeIdade: false,
    demografia: null,
    valores,
  }));
}

describe("linhasDaPlanilhaOficial", () => {
  it("da fixture basico sai com as mesmas linhas do respostas.csv original", () => {
    expect(linhasDaPlanilhaOficial(participacoes("basico"))).toEqual(lerRespostas("basico"));
  });

  it("deixa de fora quem está fora da análise", () => {
    const [primeira, ...outras] = participacoes("basico");
    expect(linhasDaPlanilhaOficial([{ ...primeira!, incluidaNaAnalise: false }, ...outras])).toHaveLength(19);
  });
});

describe("exportarBrutas", () => {
  it("tem BOM, cabeçalho e as 26 colunas de itens", () => {
    const texto = exportarBrutas(participacoes("basico"));
    expect(texto.startsWith(BOM)).toBe(true);
    const [cabecalho] = texto.slice(1).split("\r\n");
    expect(cabecalho?.split(";")).toHaveLength(13 + 26);
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
    expect(texto).toContain(";sim;não;link;pt;sim;não;25 a 34 anos;");
  });
});

describe("idioma nas exportações", () => {
  it("diz em que idioma a pessoa respondeu e se a tradução é aprovada", () => {
    const [primeira] = participacoes("basico");
    const [, linha] = exportarBrutas([{ ...primeira!, idioma: "kn", traducaoAprovada: false }]).split("\r\n");
    expect(linha?.split(";").slice(5, 8)).toEqual(["link", "kn", "não"]);
  });

  it("importada sai com a origem e sem idioma, que o CSV não informa", () => {
    const [primeira] = participacoes("basico");
    const [, linha] = exportarBrutas([{ ...primeira!, origem: "importada", idioma: null, traducaoAprovada: null }]).split("\r\n");
    expect(linha?.split(";").slice(5, 8)).toEqual(["importada", "", ""]);
  });
});

describe("exportarRecodificadas", () => {
  it("troca os valores de 1 a 7 por -3 a +3 com a polaridade corrigida", () => {
    const texto = exportarRecodificadas([{ ...participacoes("basico")[0]!, valores: Array(26).fill(7) }], itens);
    const linha = texto.split("\r\n")[1]?.split(";") ?? [];
    // item 1 tem positivo à direita (+3), item 3 à esquerda (-3)
    expect(linha[13]).toBe("3");
    expect(linha[15]).toBe("-3");
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

// UEQ-S (RF62): as mesmas exportações com os 8 itens e as 3 escalas dele
describe("exportações do UEQ-S", () => {
  const itensUeqS = carregarItensUeqS();
  const doUeqS = (pasta: string) =>
    participacoes(`../fixtures-ueq-s/${pasta}`).map((participacao) => ({ ...participacao, versao: "Aplicativo atual" }));

  it("respostas brutas têm 8 colunas de itens, item01 a item08", () => {
    const [cabecalho, linha] = exportarBrutas(doUeqS("bordas"), 8).slice(1).split("\r\n");
    expect(cabecalho?.split(";").slice(13)).toEqual(["item01", "item02", "item03", "item04", "item05", "item06", "item07", "item08"]);
    expect(linha?.split(";").slice(13).map(Number)).toEqual(lerRespostas("../fixtures-ueq-s/bordas")[0]);
  });

  it("recodificadas são x - 4 em todos os itens, porque no UEQ-S o positivo está sempre à direita", () => {
    const linha = exportarRecodificadasUeqS(doUeqS("bordas"), itensUeqS).split("\r\n")[1]?.split(";") ?? [];
    expect(linha.slice(13).map(Number)).toEqual(lerRespostas("../fixtures-ueq-s/bordas")[0]!.map((valor) => valor - 4));
  });

  it("resultados têm pragmática, hedônica e geral, e a geral sai sem alfa", () => {
    const analise = analisarUeqS(
      lerRespostas("../fixtures-ueq-s/oficial-exemplo").map((valores) => ({ valores, incluidaNaAnalise: true })),
      itensUeqS,
      configOficialUeqS,
    );
    const linhas = exportarResultadosUeqS([{ versao: "Aplicativo atual", analise }]).split("\r\n");
    expect(linhas).toHaveLength(1 + 3 + 1);
    // Os números da planilha oficial do UEQ-S com os 13 participantes de exemplo dela (esperado.json)
    expect(linhas[1]).toBe("Aplicativo atual;Qualidade pragmática;13;0,9038;0,7537;0,4941;1,3136;0,0252;positiva;Abaixo da média");
    expect(linhas[3]?.split(";").slice(1, 3)).toEqual(["Geral", "13"]);
    expect(linhas[3]?.split(";")[7]).toBe("");
  });

  it("de um estudo do UEQ completo, a planilha do UEQ-S recebe os 8 itens equivalentes, nos lados do UEQ-S", () => {
    expect(linhasDaPlanilhaUeqS(participacoes("basico"), itensUeqS)).toEqual(lerRespostas("../fixtures-ueq-s/do-ueq-basico"));
  });
});
