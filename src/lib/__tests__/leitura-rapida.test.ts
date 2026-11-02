import { describe, expect, it } from "vitest";
import { criarTradutor } from "@/traducao/nucleo";
import { leituraDaComparacao, leituraDeUmaVersao } from "../leitura-rapida";

import { formatarDecimal } from "../texto";

const t = criarTradutor("pt", {});

const escala = (nome: string, media: number | null, faixa: "positiva" | "neutra" | "negativa" | null) => ({
  nome,
  media,
  faixaInterpretacao: faixa,
});

describe("leituraDeUmaVersao", () => {
  it("reproduz a frase do protótipo r6", () => {
    expect(
      leituraDeUmaVersao(t, [
        escala("Atratividade", 1.42, "positiva"),
        escala("Perspicuidade", 1.68, "positiva"),
        escala("Eficiência", 1.21, "positiva"),
        escala("Confiabilidade", 0.96, "positiva"),
        escala("Estimulação", 1.05, "positiva"),
        escala("Novidade", 0.48, "neutra"),
      ]),
    ).toBe(
      "A experiência foi avaliada como positiva em cinco das seis escalas. Perspicuidade é o ponto mais forte; Novidade fica na faixa neutra.",
    );
  });

  it("junta várias escalas da mesma faixa e cita as negativas", () => {
    expect(
      leituraDeUmaVersao(t, [
        escala("Atratividade", 0.2, "neutra"),
        escala("Eficiência", 0.5, "neutra"),
        escala("Novidade", -1.2, "negativa"),
      ]),
    ).toBe("Nenhuma escala ficou na faixa positiva. Atratividade e Eficiência ficam na faixa neutra; Novidade fica na faixa negativa.");
  });

  it("devolve null sem nenhuma média", () => {
    expect(leituraDeUmaVersao(t, [escala("Atratividade", null, null)])).toBeNull();
  });
});

describe("leituraDaComparacao", () => {
  const escalas = ["Atratividade", "Perspicuidade", "Eficiência", "Confiabilidade", "Estimulação", "Novidade"];

  it("aponta as duas maiores diferenças e a quem favorecem", () => {
    expect(
      leituraDaComparacao(t, escalas, [
        { nome: "Checkout atual", medias: [1.55, 1.8, 1.05, 0.98, 0.92, 0.21] },
        { nome: "Checkout em uma página", medias: [1.26, 1.54, 1.4, 0.94, 1.21, 0.81] },
      ]),
    ).toBe(
      "As maiores diferenças estão em Novidade (0,60 a favor de Checkout em uma página) e Eficiência (0,35 a favor de Checkout em uma página). Nas outras escalas as versões ficam próximas.",
    );
  });

  it("diz quando as versões ficam próximas em tudo", () => {
    expect(leituraDaComparacao(t, ["Atratividade"], [{ nome: "A", medias: [1] }, { nome: "B", medias: [1.1] }])).toBe(
      "As versões ficam próximas em todas as escalas: nenhuma diferença chega a 0,30.",
    );
  });

  it("com três versões conta em quantas escalas cada uma tem a maior média", () => {
    expect(
      leituraDaComparacao(t, ["Atratividade", "Novidade", "Eficiência"], [
        { nome: "A", medias: [1, 2, 0] },
        { nome: "B", medias: [2, 1, 3] },
        { nome: "C", medias: [0, 0, 0] },
      ]),
    ).toBe("A maior média por escala fica com B em duas e A em uma.");
  });
});

describe("formatarDecimal", () => {
  it("usa vírgula, duas casas e traço para ausente", () => {
    expect(formatarDecimal(1.4)).toBe("1,40");
    expect(formatarDecimal(-0.6)).toBe("-0,60");
    expect(formatarDecimal(null)).toBe("—");
  });
});
