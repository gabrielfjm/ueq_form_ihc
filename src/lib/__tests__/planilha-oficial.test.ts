import { readFileSync } from "node:fs";
import { join } from "node:path";
import { strFromU8, unzipSync } from "fflate";
import { describe, expect, it } from "vitest";
import { lerRespostas } from "@/ueq/__tests__/carregar";
import { ARQUIVO_MODELO, IDIOMA_NA_PLANILHA, MAXIMO_PARTICIPANTES, preencherPlanilhaOficial } from "../planilha-oficial";

const modelo = readFileSync(join(__dirname, "..", "..", "..", ARQUIVO_MODELO));
const original = unzipSync(modelo);
const texto = (arquivos: Record<string, Uint8Array>, caminho: string) => strFromU8(arquivos[caminho]!);

// No modelo V15, a aba Data é sheet2.xml e a Read_First é sheet1.xml (xl/workbook.xml e o .rels)
const DATA = "xl/worksheets/sheet2.xml";
const READ_FIRST = "xl/worksheets/sheet1.xml";

function linhasDaAbaData(arquivos: Record<string, Uint8Array>): Map<number, number[]> {
  const linhas = new Map<number, number[]>();
  for (const [, numero, corpo] of texto(arquivos, DATA).matchAll(/<row r="(\d+)"[^>]*>(.*?)<\/row>/gs)) {
    if (Number(numero) < 4) continue;
    linhas.set(Number(numero), [...corpo!.matchAll(/<v>(\d+)<\/v>/g)].map((v) => Number(v[1])));
  }
  return linhas;
}

function textoCompartilhado(arquivos: Record<string, Uint8Array>, indice: number): string | undefined {
  return [...texto(arquivos, "xl/sharedStrings.xml").matchAll(/<si>(.*?)<\/si>/gs)][indice]?.[1];
}

describe("preencherPlanilhaOficial", () => {
  const respostas = lerRespostas("basico");
  const preenchida = unzipSync(preencherPlanilhaOficial(modelo, respostas, "pt"));

  it("põe as respostas em Data!A4 e tira os 255 participantes de exemplo", () => {
    expect(linhasDaAbaData(original).size).toBe(255);
    const linhas = linhasDaAbaData(preenchida);
    expect([...linhas.keys()]).toEqual(respostas.map((_, posicao) => 4 + posicao));
    expect([...linhas.values()]).toEqual(respostas);
    expect(texto(preenchida, DATA)).toContain('<dimension ref="A1:Z23"/>');
  });

  it("mantém o aviso e os números dos itens nas linhas 1 a 3", () => {
    const cabecalho = (arquivos: Record<string, Uint8Array>) =>
      [...texto(arquivos, DATA).matchAll(/<row r="([123])"[^>]*>.*?<\/row>/gs)].map((linha) => linha[0]);
    expect(cabecalho(preenchida)).toEqual(cabecalho(original));
  });

  it("escolhe o idioma da planilha em Read_First!B5", () => {
    const indice = Number(/<c r="B5"[^>]*t="s"[^>]*><v>(\d+)<\/v><\/c>/.exec(texto(preenchida, READ_FIRST))?.[1]);
    expect(textoCompartilhado(preenchida, indice)).toBe("<t>Portuguese</t>");
    const japones = unzipSync(preencherPlanilhaOficial(modelo, respostas, "ja"));
    const indiceJapones = Number(/<c r="B5"[^>]*><v>(\d+)<\/v><\/c>/.exec(texto(japones, READ_FIRST))?.[1]);
    expect(textoCompartilhado(japones, indiceJapones)).toBe("<t>Japanese</t>");
  });

  it("tem um nome da lista de idiomas da aba Items para cada um dos 37 idiomas da ferramenta", () => {
    // Items!A2:A38 (sheet12.xml): a coluna A de cada linha aponta para o nome do idioma
    const itens = texto(original, "xl/worksheets/sheet12.xml");
    const nomes = [...itens.matchAll(/<c r="A(\d+)"[^>]*t="s"[^>]*><v>(\d+)<\/v><\/c>/g)]
      .filter(([, linha]) => Number(linha) >= 2)
      .map(([, , indice]) => textoCompartilhado(original, Number(indice))?.replace(/<\/?t>/g, ""));
    expect(new Set(nomes)).toEqual(new Set(Object.values(IDIOMA_NA_PLANILHA)));
  });

  it("grava o resultado de toda fórmula e ainda pede ao Excel para recalcular ao abrir", () => {
    // Sem o valor gravado, o Modo de Exibição Protegido e o LibreOffice mostram as abas vazias
    expect(texto(preenchida, "xl/workbook.xml")).toMatch(/<calcPr [^>]*fullCalcOnLoad="1"/);
    const contar = (arquivos: Record<string, Uint8Array>, caminho: string, padrao: RegExp) => (texto(arquivos, caminho).match(padrao) ?? []).length;
    for (const caminho of Object.keys(preenchida).filter((c) => /^xl\/worksheets\/sheet\d+\.xml$/.test(c))) {
      const formulas = contar(preenchida, caminho, /<f[ >/]/g);
      expect(contar(preenchida, caminho, /(<f[^>]*\/>|<f[^>]*>[^<]*<\/f>)<v>[^<]*<\/v><\/c>/g), caminho).toBe(formulas);
      // As fórmulas continuam as do modelo
      expect(formulas, caminho).toBe(contar(original, caminho, /<f[ >/]/g));
    }
    // Results!L3 (média da Atratividade) não é mais a do exemplo dos autores
    const atratividade = (arquivos: Record<string, Uint8Array>) => /<c r="L3"[^>]*><f>[^<]*<\/f><v>([^<]*)<\/v>/.exec(texto(arquivos, "xl/worksheets/sheet4.xml"))?.[1];
    expect(atratividade(preenchida)).not.toBe(atratividade(original));
  });

  it("atualiza os números que os gráficos guardam e não mexe em estilos, imagens nem nas outras partes", () => {
    // chart3 mostra as médias das escalas, Results!L3:L8
    const grafico = texto(preenchida, "xl/charts/chart3.xml");
    const pontos = [.../<c:f>Results!\$L\$3:\$L\$8<\/c:f><c:numCache>(.*?)<\/c:numCache>/s.exec(grafico)![1]!.matchAll(/<c:v>([^<]*)<\/c:v>/g)].map((v) => Number(v[1]));
    const medias = [3, 4, 5, 6, 7, 8].map((linha) => Number(new RegExp(`<c r="L${linha}"[^>]*>.*?<v>([^<]*)</v>`).exec(texto(preenchida, "xl/worksheets/sheet4.xml"))![1]));
    expect(pontos).toEqual(medias);
    const mudam = new Set(["xl/workbook.xml", "xl/sharedStrings.xml"]);
    for (const [caminho, conteudo] of Object.entries(original)) {
      if (mudam.has(caminho) || /^xl\/(worksheets\/sheet|charts\/chart)\d+\.xml$/.test(caminho)) continue;
      expect(Buffer.from(preenchida[caminho]!).equals(Buffer.from(conteudo)), caminho).toBe(true);
    }
    expect(Object.keys(preenchida).sort()).toEqual(Object.keys(original).sort());
  });

  it("tira as importâncias de exemplo da aba KPI_Calculation, que a ferramenta não pergunta", () => {
    // KPI_Calculation é sheet11.xml; A4:F1004 são as notas de importância das escalas
    const entradas = (arquivos: Record<string, Uint8Array>) =>
      [...texto(arquivos, "xl/worksheets/sheet11.xml").matchAll(/<c r="([A-F])(\d+)"[^>]*(?<!\/)>(?:(?!<\/c>).)*?<v>[^<]*<\/v><\/c>/gs)]
        .filter(([celula, , linha]) => Number(linha) >= 4 && !celula.includes("<f"));
    expect(entradas(original).length).toBeGreaterThan(0);
    expect(entradas(preenchida)).toEqual([]);
  });

  it("sem participantes, sai a planilha vazia", () => {
    const vazia = unzipSync(preencherPlanilhaOficial(modelo, [], "en"));
    expect(linhasDaAbaData(vazia).size).toBe(0);
    expect(texto(vazia, DATA)).toContain('<dimension ref="A1:Z3"/>');
  });

  it("recusa mais participantes do que a planilha calcula e valores fora de 1 a 7", () => {
    const demais = Array.from({ length: MAXIMO_PARTICIPANTES + 1 }, () => respostas[0]!);
    expect(() => preencherPlanilhaOficial(modelo, demais, "pt")).toThrow(/até 1000 participantes/);
    expect(() => preencherPlanilhaOficial(modelo, [[...respostas[0]!.slice(0, 25), 8]], "pt")).toThrow(/de 1 a 7/);
    expect(() => preencherPlanilhaOficial(modelo, [respostas[0]!.slice(0, 25)], "pt")).toThrow(/26 valores/);
  });
});
