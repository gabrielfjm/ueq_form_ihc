import { describe, expect, it } from "vitest";
import idiomasUeqS from "../../../data/ueq-s-idiomas.json";
import definicaoUeqS from "../../../data/ueq-s-itens-ptbr.json";
import { IDIOMAS, termosDoIdioma } from "@/idiomas";
import { ITENS_UEQ_S, termosDoUeqS } from "../instrumento";

// data/ueq-s-idiomas.json: os 8 pares do UEQ-S de cada idioma, da lista oficial UEQS_Items.pdf
describe("termos do UEQ-S nos 37 idiomas", () => {
  it("tem os 37 idiomas da ferramenta, cada um com 8 pares de termos diferentes entre si", () => {
    expect(idiomasUeqS.idiomas.map((idioma) => idioma.codigo).sort()).toEqual(IDIOMAS.map((idioma) => idioma.codigo).sort());
    for (const { codigo } of IDIOMAS) {
      const pares = termosDoUeqS(codigo);
      expect(pares.map((par) => par.numero), codigo).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
      for (const par of pares) {
        expect(par.termoEsquerdo.trim(), `${codigo} item ${par.numero}`).not.toBe("");
        expect(par.termoEsquerdo, `${codigo} item ${par.numero}: os dois lados iguais`).not.toBe(par.termoDireito);
      }
    }
  });

  it("em português são os pares de data/ueq-s-itens-ptbr.json, e em inglês os do handbook (p. 13)", () => {
    expect(termosDoUeqS("pt").map(({ termoEsquerdo, termoDireito }) => [termoEsquerdo, termoDireito])).toEqual(
      definicaoUeqS.itens.map(({ termoEsquerdo, termoDireito }) => [termoEsquerdo, termoDireito]),
    );
    expect(termosDoUeqS("en").map(({ termoEsquerdo, termoDireito }) => `${termoEsquerdo}/${termoDireito}`)).toEqual([
      "obstructive/supportive",
      "complicated/easy",
      "inefficient/efficient",
      "confusing/clear",
      "boring/exciting",
      "not interesting/interesting",
      "conventional/inventive",
      "usual/leading edge",
    ]);
  });

  it("fora dos pares marcados em diferentesDoUeq, cada par é o do UEQ completo do idioma, com o negativo à esquerda", () => {
    for (const idioma of idiomasUeqS.idiomas) {
      const diferentes = new Set((idioma as { diferentesDoUeq?: number[] }).diferentesDoUeq ?? []);
      const doUeq = new Map(termosDoIdioma(idioma.codigo as Parameters<typeof termosDoIdioma>[0]).map((par) => [par.numero, par]));
      for (const item of ITENS_UEQ_S) {
        if (diferentes.has(item.ordem)) continue;
        const par = doUeq.get(item.numeroNoUeq)!;
        const esperado = item.ladoTrocado ? [par.termoDireito, par.termoEsquerdo] : [par.termoEsquerdo, par.termoDireito];
        const atual = termosDoUeqS(idioma.codigo).find((p) => p.numero === item.ordem)!;
        expect([atual.termoEsquerdo, atual.termoDireito], `${idioma.codigo} item ${item.ordem}`).toEqual(esperado);
      }
    }
  });

  it("os 6 idiomas em que a lista do UEQ-S muda palavras são os conferidos no PDF oficial", () => {
    const mudam = idiomasUeqS.idiomas.filter((idioma) => "diferentesDoUeq" in idioma).map((idioma) => idioma.codigo);
    expect(mudam.sort()).toEqual(["el", "fa", "hr", "it", "tr", "zh"]);
    expect(termosDoUeqS("hr")[6]).toEqual({ numero: 7, termoEsquerdo: "konvencionalna", termoDireito: "inventivna" });
  });
});
