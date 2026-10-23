import { describe, expect, it } from "vitest";
import { alfaCronbach, correlacao, desvioPadraoAmostral, intervaloConfianca95, media } from "../estatistica";

describe("media", () => {
  it("devolve null sem valores", () => {
    expect(media([])).toBeNull();
  });

  it("calcula a média simples", () => {
    expect(media([1, 2, 3, 6])).toBe(3);
  });
});

describe("desvioPadraoAmostral", () => {
  it("devolve null com n = 0 e com n = 1", () => {
    expect(desvioPadraoAmostral([])).toBeNull();
    expect(desvioPadraoAmostral([2])).toBeNull();
  });

  it("divide por n - 1", () => {
    // soma dos quadrados dos desvios = 32, n - 1 = 7
    expect(desvioPadraoAmostral([2, 4, 4, 4, 5, 5, 7, 9])).toBeCloseTo(Math.sqrt(32 / 7), 12);
  });

  it("dá zero quando todos os valores são iguais", () => {
    expect(desvioPadraoAmostral([1.5, 1.5, 1.5])).toBe(0);
  });
});

describe("intervaloConfianca95", () => {
  it("soma e subtrai z · dp / √n da média", () => {
    const ic = intervaloConfianca95(1, 2, 16, 1.96);
    expect(ic?.inferior).toBeCloseTo(0.02, 12);
    expect(ic?.superior).toBeCloseTo(1.98, 12);
  });

  it("devolve null sem dp, como acontece com n = 1", () => {
    expect(intervaloConfianca95(1, null, 1, 1.96)).toBeNull();
  });

  it("devolve null com dp = 0, como o #NUM! da planilha", () => {
    expect(intervaloConfianca95(2, 0, 5, 1.96)).toBeNull();
  });
});

describe("correlacao", () => {
  it("calcula a correlação de Pearson", () => {
    expect(correlacao([1, 2, 3], [1, 3, 2])).toBeCloseTo(0.5, 12);
    expect(correlacao([1, 2, 3], [3, 2, 1])).toBeCloseTo(-1, 12);
  });

  it("devolve null quando uma das séries não varia", () => {
    expect(correlacao([1, 2, 3], [2, 2, 2])).toBeNull();
  });

  it("devolve null com menos de 2 pares", () => {
    expect(correlacao([1], [2])).toBeNull();
  });

  it("recusa séries de tamanhos diferentes", () => {
    expect(() => correlacao([1, 2], [1, 2, 3])).toThrow(RangeError);
  });
});

describe("alfaCronbach", () => {
  it("usa k · r̄ / (1 + (k - 1) · r̄) com a média das correlações", () => {
    // um par só, r = 0,5: alfa = 2 · 0,5 / 1,5
    expect(alfaCronbach([[1, 2, 3], [1, 3, 2]])).toBeCloseTo(2 / 3, 12);
  });

  it("dá 1 quando os itens andam juntos", () => {
    expect(alfaCronbach([[1, 2, 3], [2, 3, 4], [0, 1, 2]])).toBeCloseTo(1, 12);
  });

  it("devolve null com menos de 2 itens", () => {
    expect(alfaCronbach([[1, 2, 3]])).toBeNull();
  });

  it("devolve null quando um item não varia, como o #DIV/0! da planilha", () => {
    expect(alfaCronbach([[1, 2, 3], [2, 2, 2]])).toBeNull();
  });

  it("devolve null quando o denominador zera (r̄ = -1 com 2 itens)", () => {
    expect(alfaCronbach([[1, 2], [2, 1]])).toBeNull();
  });

  it("devolve null com um participante só", () => {
    expect(alfaCronbach([[1], [2]])).toBeNull();
  });
});
