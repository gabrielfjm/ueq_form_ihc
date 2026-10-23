import { describe, expect, it } from "vitest";
import { recodificar, recodificarParticipante } from "../recodificar";
import { carregarItens } from "./carregar";

const itens = carregarItens();

describe("recodificar", () => {
  it("com positivo à direita, 1 vira -3, 4 vira 0 e 7 vira 3", () => {
    expect([1, 4, 7].map((valor) => recodificar(valor, "+"))).toEqual([-3, 0, 3]);
  });

  it("com positivo à esquerda, 1 vira 3, 4 vira 0 e 7 vira -3", () => {
    expect([1, 4, 7].map((valor) => recodificar(valor, "-"))).toEqual([3, 0, -3]);
  });

  it.each([0, 8, 3.5, Number.NaN])("recusa a resposta %s, que não existe na escala de 1 a 7", (valor) => {
    expect(() => recodificar(valor, "+")).toThrow(RangeError);
  });
});

describe("recodificarParticipante", () => {
  it("transforma o ponto do meio em 0 nos 26 itens", () => {
    expect(recodificarParticipante(Array(26).fill(4), itens)).toEqual(Array(26).fill(0));
  });

  it("aplica a polaridade de cada item: 7 em tudo dá +3 nos itens '+' e -3 nos itens '-'", () => {
    const recodificados = recodificarParticipante(Array(26).fill(7), itens);
    for (const item of itens) {
      expect(recodificados[item.numero - 1]).toBe(item.polaridade === "+" ? 3 : -3);
    }
  });

  it("recusa participante sem as 26 respostas", () => {
    expect(() => recodificarParticipante(Array(25).fill(4), itens)).toThrow(/25 respostas/);
  });
});
