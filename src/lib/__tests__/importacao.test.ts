import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { lerRespostas, raizFixtures } from "@/ueq/__tests__/carregar";
import { exportarPlanilhaOficial } from "../exportacoes";
import { lerCsvDeRespostas, LIMITE_LINHAS } from "../importacao";

const linha = (valores: (string | number)[], separador = ";") => valores.join(separador);
const vinteESeis = (valor: number | string = 4) => Array<number | string>(26).fill(valor);

describe("lerCsvDeRespostas", () => {
  it("lê a fixture basico igual à leitura dos testes do módulo UEQ", () => {
    const texto = readFileSync(join(raizFixtures, "basico", "respostas.csv"), "utf8");
    const { linhas, erros } = lerCsvDeRespostas(texto);
    expect(erros).toEqual([]);
    expect(linhas.map((l) => l.valores)).toEqual(lerRespostas("basico"));
  });

  it("aceita de volta o que a exportação no formato da planilha oficial gera", () => {
    const participacoes = lerRespostas("basico").map((valores, posicao) => ({
      id: `p${posicao}`,
      versao: "A",
      concluidaEm: "",
      incluidaNaAnalise: true,
      suspeita: false,
      origem: "link" as const,
      idioma: "pt",
      traducaoAprovada: true,
      demografia: null,
      valores,
    }));
    const { linhas } = lerCsvDeRespostas(exportarPlanilhaOficial(participacoes));
    expect(linhas).toHaveLength(20);
  });

  it("aceita vírgula, tabulação, BOM, aspas e um separador sobrando no fim", () => {
    const texto = `﻿${linha(vinteESeis(1), ",")}\r\n${linha(vinteESeis(7), "\t")}\n${linha(vinteESeis('"3"'))};\n`;
    const { linhas, erros } = lerCsvDeRespostas(texto);
    expect(erros).toEqual([]);
    expect(linhas.map((l) => l.valores[0])).toEqual([1, 7, 3]);
  });

  it("ignora linhas em branco e só com separadores, mas mantém o número real de cada linha", () => {
    const texto = ["", linha(vinteESeis()), ";;;;", linha(vinteESeis(8))].join("\n");
    const { linhas, erros } = lerCsvDeRespostas(texto);
    expect(linhas.map((l) => l.linha)).toEqual([2]);
    expect(erros).toEqual([{ linha: 4, mensagem: expect.stringContaining("item 1 (\"8\")") }]);
  });

  it("aponta por linha o número errado de valores e os valores fora da escala", () => {
    const valores = vinteESeis();
    valores[2] = 0;
    valores[4] = "";
    valores[9] = "4,5";
    const texto = [linha(vinteESeis().slice(0, 25)), linha(valores), "item01;item02"].join("\n");
    const { linhas, erros } = lerCsvDeRespostas(texto);
    expect(linhas).toEqual([]);
    expect(erros).toEqual([
      { linha: 1, mensagem: "Tem 25 valores; são 26, um por item." },
      { linha: 2, mensagem: 'Valores fora de 1 a 7: item 3 ("0"), item 5 (vazio), item 10 ("4,5").' },
      { linha: 3, mensagem: "Tem 2 valores; são 26, um por item." },
    ]);
  });

  it("recusa arquivo com linhas demais", () => {
    const texto = Array(LIMITE_LINHAS + 1).fill(linha(vinteESeis())).join("\n");
    const { linhas, erros } = lerCsvDeRespostas(texto);
    expect(linhas).toEqual([]);
    expect(erros[0]?.mensagem).toContain(`mais de ${LIMITE_LINHAS} linhas`);
  });
});
