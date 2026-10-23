import { describe, expect, it } from "vitest";
import { escoresPorParticipante, faixaInterpretacao, resultadoPorEscala, resultadoPorItem } from "../escalas";
import { ESCALAS } from "../itens";
import { carregarItens, configOficial, montarRespostas } from "./carregar";

const itens = carregarItens();
const parametros = { z: configOficial.protocolo.ic.z, faixaNeutra: configOficial.protocolo.faixaNeutra };
const tudoPositivo = montarRespostas(itens, () => 3);
const tudoNeutro = montarRespostas(itens, () => 0);

describe("escoresPorParticipante", () => {
  it("dá +3 em todas as escalas para quem marca sempre o polo positivo", () => {
    const escores = escoresPorParticipante(tudoPositivo, itens);
    for (const escala of ESCALAS) expect(escores[escala]).toBe(3);
  });

  it("faz a média só dos itens da escala", () => {
    // perspicuidade = itens 2, 4, 13 e 21; os outros itens não podem pesar
    const respostas = montarRespostas(itens, (item) => (item.escala === "perspicuidade" ? (item.numero === 2 ? 2 : 1) : -3));
    expect(escoresPorParticipante(respostas, itens).perspicuidade).toBe(1.25);
  });
});

describe("faixaInterpretacao", () => {
  const faixa = configOficial.protocolo.faixaNeutra;

  it("trata os próprios limites -0,8 e 0,8 como neutros", () => {
    expect(faixaInterpretacao(0.8, faixa)).toBe("neutra");
    expect(faixaInterpretacao(-0.8, faixa)).toBe("neutra");
  });

  it("classifica acima de 0,8 como positiva e abaixo de -0,8 como negativa", () => {
    expect(faixaInterpretacao(0.81, faixa)).toBe("positiva");
    expect(faixaInterpretacao(-0.81, faixa)).toBe("negativa");
  });
});

describe("resultadoPorEscala", () => {
  it("sem participantes devolve n = 0 e todos os números null", () => {
    const resultado = resultadoPorEscala([], itens, parametros);
    expect(resultado.map((escala) => escala.escala)).toEqual([...ESCALAS]);
    for (const escala of resultado) {
      expect(escala).toMatchObject({ n: 0, media: null, dp: null, ic: null, alfa: null, faixaInterpretacao: null });
    }
  });

  it("com um participante tem média, mas não tem dp, IC nem alfa", () => {
    const [atratividade] = resultadoPorEscala([tudoPositivo], itens, parametros);
    expect(atratividade).toMatchObject({ n: 1, media: 3, dp: null, ic: null, alfa: null, faixaInterpretacao: "positiva" });
  });

  it("com todos iguais o dp é zero e não há IC nem alfa", () => {
    const [atratividade] = resultadoPorEscala([tudoNeutro, tudoNeutro, tudoNeutro], itens, parametros);
    expect(atratividade).toMatchObject({ n: 3, media: 0, dp: 0, ic: null, alfa: null, faixaInterpretacao: "neutra" });
  });

  it("calcula média, dp, IC e alfa com dois participantes", () => {
    const [atratividade] = resultadoPorEscala([tudoPositivo, tudoNeutro], itens, parametros);
    const dp = Math.sqrt(4.5);
    const margem = (parametros.z * dp) / Math.sqrt(2);
    expect(atratividade?.media).toBe(1.5);
    expect(atratividade?.dp).toBeCloseTo(dp, 12);
    expect(atratividade?.ic?.inferior).toBeCloseTo(1.5 - margem, 12);
    expect(atratividade?.ic?.superior).toBeCloseTo(1.5 + margem, 12);
    // os itens sobem juntos de um participante para o outro: todas as correlações valem 1
    expect(atratividade?.alfa).toBeCloseTo(1, 12);
  });
});

describe("resultadoPorItem", () => {
  it("devolve os 26 itens em ordem com média recodificada e distribuição de 1 a 7", () => {
    const resultado = resultadoPorItem([tudoPositivo, tudoNeutro, tudoNeutro], itens, parametros.z);
    expect(resultado.map((item) => item.numero)).toEqual(Array.from({ length: 26 }, (_, i) => i + 1));

    const [item1, , item3] = resultado;
    // item 1 tem positivo à direita (7), item 3 à esquerda (1)
    expect(item1).toMatchObject({ n: 3, media: 1, distribuicao: [0, 0, 0, 2, 0, 0, 1] });
    expect(item3).toMatchObject({ n: 3, media: 1, distribuicao: [1, 0, 0, 2, 0, 0, 0] });
  });
});
