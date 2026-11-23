import { describe, expect, it } from "vitest";
import { Calculo, chave, lerFormula, normalInversa, type Aba, type Valor } from "../planilha-calculo";

// Uma aba "Plan" com constantes e fórmulas escritas em A1 notation, para conferir as regras do Excel que as
// planilhas oficiais do UEQ dependem (a comparação célula a célula com o Excel está nos testes das fixtures)
function calcular(constantes: Record<string, Valor>, formulas: Record<string, string>) {
  const endereco = (ref: string) => {
    const [, letras, numero] = /^([A-Z]+)(\d+)$/.exec(ref)!;
    return chave(Number(numero), letras!.charCodeAt(0) - 64);
  };
  const aba: Aba = {
    constantes: new Map(Object.entries(constantes).map(([ref, v]) => [endereco(ref), v])),
    formulas: new Map(Object.entries(formulas).map(([ref, f]) => [endereco(ref), { no: lerFormula(f, "Plan"), dl: 0, dc: 0 }])),
  };
  const calculo = new Calculo(new Map([["Plan", aba]]));
  return (ref: string) => {
    const k = endereco(ref);
    return calculo.valor("Plan", Math.floor(k / 16384), k % 16384);
  };
}

describe("cálculo das fórmulas da planilha oficial", () => {
  it("respeita a precedência e a associatividade do Excel", () => {
    const v = calcular({}, { A1: "2+3*4", A2: "2^3^2", A3: "-2^2", A4: "(1+2)/4", A5: '"a"&1+1' });
    expect([v("A1"), v("A2"), v("A3"), v("A4"), v("A5")]).toEqual([14, 64, 4, 0.75, "a2"]);
  });

  it("compara vazio como 0 ou texto vazio, e texto sempre acima de número", () => {
    const v = calcular({ B1: 5 }, { A1: "IF(C1>3,1,0)", A2: 'IF(A3>0,"sim","não")', A3: 'IF(B1>9,1,"")', A4: 'C1=""', A5: "C1=0" });
    // A3 vira "" e "" > 0 é verdadeiro no Excel
    expect([v("A1"), v("A3"), v("A2"), v("A4"), v("A5")]).toEqual([0, "", "sim", true, true]);
  });

  it("propaga erros e devolve os mesmos que o Excel", () => {
    const v = calcular({ B1: 1 }, { A1: "1/0", A2: "A1+1", A3: 'IF(B1>0,"",1)*2', A4: "STDEV(B1)", A5: "AVERAGE(C1:C3)", A6: "SQRT(-1)" });
    expect([v("A1"), v("A2"), v("A3"), v("A4"), v("A5"), v("A6")]).toEqual([
      { erro: "#DIV/0!" }, { erro: "#DIV/0!" }, { erro: "#VALUE!" }, { erro: "#DIV/0!" }, { erro: "#DIV/0!" }, { erro: "#NUM!" },
    ]);
  });

  it("nas funções de intervalo, ignora texto e vazio, mas COUNTA conta o texto vazio de fórmula", () => {
    const v = calcular({ B1: 1, B2: 3 }, { B3: 'IF(B1>5,1,"")', A1: "AVERAGE(B1:B4)", A2: "COUNT(B1:B4)", A3: "COUNTA(B1:B4)", A4: "MAX(C1:C3)", A5: 'COUNTIF(B1:B4,"3")' });
    expect([v("A1"), v("A2"), v("A3"), v("A4"), v("A5")]).toEqual([2, 2, 3, 0, 1]);
  });

  it("calcula VAR, STDEV, CORREL e CONFIDENCE como o Excel", () => {
    const v = calcular(
      { B1: 1, B2: 2, B3: 4, C1: 2, C2: 3, C3: 7 },
      { A1: "VAR(B1:B3)", A2: "CORREL(B1:B3,C1:C3)", A3: "CONFIDENCE(0.05,1,4)", A4: "_xlfn.COVARIANCE.S(B1:B3,C1:C3)" },
    );
    expect(v("A1")).toBeCloseTo(7 / 3, 14);
    // desvios de x: -4/3, -1/3, 5/3; de y: -2, -1, 3. Soma dos produtos 8, dos quadrados 14/3 e 14
    expect(v("A2")).toBeCloseTo((4 * Math.sqrt(3)) / 7, 14);
    expect(v("A3")).toBeCloseTo(1.959963984540054 / 2, 14);
    expect(v("A4")).toBeCloseTo(4, 14);
  });

  it("acha o texto no VLOOKUP sem diferenciar maiúsculas e devolve #N/A quando não acha", () => {
    const v = calcular({ B1: "English", C1: "Attractiveness", B2: "Portuguese", C2: "Atractividade" }, { A1: 'VLOOKUP("portuguese",B1:C2,2,FALSE)', A2: 'VLOOKUP("Klingon",B1:C2,2,FALSE)' });
    expect([v("A1"), v("A2")]).toEqual(["Atractividade", { erro: "#N/A" }]);
  });

  it("inverte a normal padrão com a precisão do NORM.S.INV", () => {
    expect(normalInversa(0.975)).toBeCloseTo(1.959963984540054, 14);
    expect(normalInversa(0.5)).toBeCloseTo(0, 14);
    expect(normalInversa(0.01)).toBeCloseTo(-2.326347874040841, 13);
  });
});
