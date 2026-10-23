import { describe, expect, it } from "vitest";
import { classificarBenchmark } from "../benchmark";
import { configOficial } from "./carregar";

const tabela = configOficial.benchmark;
// limites de atratividade na planilha V15: 0,69 · 1,18 · 1,58 · 1,84

describe("classificarBenchmark", () => {
  it.each([
    [2, "excelente"],
    [1.7, "bom"],
    [1.3, "acimaDaMedia"],
    [0.9, "abaixoDaMedia"],
    [0.2, "ruim"],
  ] as const)("média %s em atratividade fica em %s", (media, faixa) => {
    expect(classificarBenchmark("atratividade", media, tabela)).toBe(faixa);
  });

  it("média igual ao limite fica na faixa de baixo, como na planilha", () => {
    expect(classificarBenchmark("atratividade", 1.84, tabela)).toBe("bom");
    expect(classificarBenchmark("atratividade", 0.69, tabela)).toBe("ruim");
  });

  it("usa os limites da escala pedida", () => {
    // 1,7 é Bom em atratividade, mas em confiabilidade o limite de Excelente é 1,7
    expect(classificarBenchmark("confiabilidade", 1.71, tabela)).toBe("excelente");
  });

  it("devolve null sem média", () => {
    expect(classificarBenchmark("novidade", null, tabela)).toBeNull();
  });
});
