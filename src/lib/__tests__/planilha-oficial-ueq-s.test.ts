import { readFileSync } from "node:fs";
import { join } from "node:path";
import { strFromU8, unzipSync } from "fflate";
import { describe, expect, it } from "vitest";
import { lerRespostas } from "@/ueq/__tests__/carregar";
import { IDIOMA_NA_PLANILHA, PLANILHA_UEQ_S, preencherPlanilhaOficial } from "../planilha-oficial";

// A planilha oficial do UEQ-S (Short_UEQ_Data_Analysis_Tool_V15.xlsx), preenchida como a do UEQ completo:
// 8 valores por participante em Data!A4:H e o idioma em Read_First!B4
const modelo = readFileSync(join(__dirname, "..", "..", "..", PLANILHA_UEQ_S.arquivo));
const original = unzipSync(modelo);
const texto = (arquivos: Record<string, Uint8Array>, caminho: string) => strFromU8(arquivos[caminho]!);

// No modelo V15 do UEQ-S, Read_First é sheet1.xml, Data é sheet2.xml e Items é sheet9.xml
const READ_FIRST = "xl/worksheets/sheet1.xml";
const DATA = "xl/worksheets/sheet2.xml";
const ITEMS = "xl/worksheets/sheet9.xml";

function linhasDaAbaData(arquivos: Record<string, Uint8Array>): number[][] {
  return [...texto(arquivos, DATA).matchAll(/<row r="(\d+)"[^>]*>(.*?)<\/row>/gs)]
    .filter(([, numero]) => Number(numero) >= 4)
    .map(([, , corpo]) => [...corpo!.matchAll(/<v>(\d+)<\/v>/g)].map((v) => Number(v[1])))
    .filter((valores) => valores.length > 0);
}

const textoCompartilhado = (arquivos: Record<string, Uint8Array>, indice: number) =>
  [...texto(arquivos, "xl/sharedStrings.xml").matchAll(/<si>(.*?)<\/si>/gs)][indice]?.[1];

describe("preencherPlanilhaOficial com o modelo do UEQ-S", () => {
  const respostas = lerRespostas("../fixtures-ueq-s/bordas");
  const preenchida = unzipSync(preencherPlanilhaOficial(modelo, respostas, "pt", PLANILHA_UEQ_S));

  it("o modelo é o da planilha oficial: abas Data e Read_First onde o teste espera, com os 13 participantes de exemplo", () => {
    const livro = texto(original, "xl/workbook.xml");
    expect(livro).toMatch(/<sheet name="Read_First"[^>]*r:id="rId1"/);
    expect(livro).toMatch(/<sheet name="Data"[^>]*r:id="rId2"/);
    expect(linhasDaAbaData(original)).toHaveLength(13);
  });

  it("põe as 8 respostas de cada participante em Data!A4 e tira o exemplo", () => {
    expect(linhasDaAbaData(preenchida)).toEqual(respostas);
    expect(texto(preenchida, DATA)).toContain(`<dimension ref="A1:H${3 + respostas.length}"/>`);
    expect(texto(preenchida, DATA)).toMatch(/<row r="4" spans="1:8">/);
  });

  it("escolhe o idioma em Read_First!B4", () => {
    const indice = Number(/<c r="B4"[^>]*t="s"[^>]*><v>(\d+)<\/v><\/c>/.exec(texto(preenchida, READ_FIRST))?.[1]);
    expect(textoCompartilhado(preenchida, indice)).toBe("<t>Portuguese</t>");
  });

  it("tem na aba Items um nome para cada um dos 37 idiomas da ferramenta", () => {
    const nomes = [...texto(original, ITEMS).matchAll(/<c r="A(\d+)"[^>]*t="s"[^>]*><v>(\d+)<\/v><\/c>/g)]
      .filter(([, linha]) => Number(linha) >= 2)
      .map(([, , indice]) => textoCompartilhado(original, Number(indice))?.replace(/<\/?t>/g, ""));
    expect(new Set(nomes)).toEqual(new Set(Object.values(IDIOMA_NA_PLANILHA)));
  });

  it("grava o resultado de toda fórmula e ainda pede ao Excel para recalcular ao abrir", () => {
    expect(texto(preenchida, "xl/workbook.xml")).toMatch(/<calcPr [^>]*fullCalcOnLoad="1"/);
    for (const caminho of Object.keys(preenchida).filter((c) => /^xl\/worksheets\/sheet\d+\.xml$/.test(c))) {
      const formulas = (texto(preenchida, caminho).match(/<f[ >/]/g) ?? []).length;
      expect((texto(preenchida, caminho).match(/(<f[^>]*\/>|<f[^>]*>[^<]*<\/f>)<v>[^<]*<\/v><\/c>/g) ?? []).length, caminho).toBe(formulas);
    }
    expect(Object.keys(preenchida).sort()).toEqual(Object.keys(original).sort());
  });

  it("recusa participante sem os 8 valores", () => {
    expect(() => preencherPlanilhaOficial(modelo, [[4, 4, 4, 4, 4, 4, 4]], "pt", PLANILHA_UEQ_S)).toThrow(/8 valores/);
  });
});
