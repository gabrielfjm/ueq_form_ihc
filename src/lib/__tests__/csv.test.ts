import { describe, expect, it } from "vitest";
import { BOM, campoCsv, decimalCsv, documentoCsv, slugDoTitulo } from "../csv";

describe("campoCsv", () => {
  it("deixa como está o texto sem caracteres especiais", () => {
    expect(campoCsv("Checkout atual")).toBe("Checkout atual");
  });

  it("põe entre aspas o campo com ponto e vírgula", () => {
    expect(campoCsv("Versão A; com desconto")).toBe('"Versão A; com desconto"');
  });

  it("dobra as aspas internas", () => {
    expect(campoCsv('Checkout "novo"')).toBe('"Checkout ""novo"""');
  });

  it("põe entre aspas o campo com quebra de linha", () => {
    expect(campoCsv("primeira\nsegunda")).toBe('"primeira\nsegunda"');
    expect(campoCsv("primeira\r\nsegunda")).toBe('"primeira\r\nsegunda"');
  });

  it("deixa vazio o que não tem valor", () => {
    expect(campoCsv(null)).toBe("");
    expect(campoCsv(undefined)).toBe("");
  });
});

describe("documentoCsv", () => {
  it("começa com o BOM, usa ; e termina cada linha com CRLF", () => {
    const texto = documentoCsv([
      ["a", "b"],
      [1, 2],
    ]);
    expect(texto.startsWith(BOM)).toBe(true);
    expect(texto).toBe(`${BOM}a;b\r\n1;2\r\n`);
  });

  it("sai sem BOM quando pedido", () => {
    expect(documentoCsv([[1, 2]], { comBom: false })).toBe("1;2\r\n");
  });
});

describe("decimalCsv", () => {
  it("usa vírgula e deixa vazio o que não existe", () => {
    expect(decimalCsv(0.7333333)).toBe("0,7333");
    expect(decimalCsv(-1.5, 2)).toBe("-1,50");
    expect(decimalCsv(null)).toBe("");
  });
});

describe("slugDoTitulo", () => {
  it("tira acentos, espaços e símbolos", () => {
    expect(slugDoTitulo("Avaliação do checkout: versão 2!")).toBe("avaliacao-do-checkout-versao-2");
  });

  it("não fica vazio", () => {
    expect(slugDoTitulo("???")).toBe("estudo");
  });
});
