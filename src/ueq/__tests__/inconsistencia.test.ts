import { describe, expect, it } from "vitest";
import { amplitudePorEscala, avaliarSuspeita, marcarSuspeitos, respostasIguais } from "../inconsistencia";
import { ESCALAS, type Escala } from "../itens";
import { carregarItens, configOficial, montarRespostas } from "./carregar";

const itens = carregarItens();
const parametros = configOficial.protocolo.inconsistencia;

// Polo positivo em tudo: amplitude 0 e só 13 respostas iguais (13 vezes 7 e 13 vezes 1)
const consistente = () => 3;

// Deixa a escala com amplitude 4: um item da escala cai de +3 para -1
function comInconsistenciaEm(escalas: readonly Escala[]): number[] {
  const primeiroDe = new Map(ESCALAS.map((escala) => [escala, itens.find((item) => item.escala === escala)?.numero]));
  return montarRespostas(itens, (item) =>
    escalas.includes(item.escala) && primeiroDe.get(item.escala) === item.numero ? -1 : consistente(),
  );
}

// quantidadeDe4 itens no ponto do meio; o resto alterna entre 3 e 5, sem passar de amplitude 2
function comRespostasIguais(quantidadeDe4: number): number[] {
  return Array.from({ length: 26 }, (_, posicao) => (posicao < quantidadeDe4 ? 4 : posicao % 2 === 0 ? 3 : 5));
}

describe("amplitudePorEscala", () => {
  it("dá zero em todas as escalas para respostas consistentes", () => {
    const amplitudes = amplitudePorEscala(montarRespostas(itens, consistente), itens);
    for (const escala of ESCALAS) expect(amplitudes[escala]).toBe(0);
  });

  it("reproduz o exemplo de perspicuidade do handbook: distância 5", () => {
    // Handbook UEQ, p. 7: itens 2, 4, 13 e 21 marcados em 6, 7, 5 e 6
    const valores = Array<number>(26).fill(4);
    valores[1] = 6;
    valores[3] = 7;
    valores[12] = 5;
    valores[20] = 6;
    expect(amplitudePorEscala(valores, itens).perspicuidade).toBe(5);
  });
});

describe("respostasIguais", () => {
  it("conta a posição mais repetida", () => {
    expect(respostasIguais(Array(26).fill(4))).toBe(26);
    expect(respostasIguais(comRespostasIguais(16))).toBe(16);
  });
});

describe("marcarSuspeitos", () => {
  it("marca como suspeito quem é inconsistente em 3 escalas", () => {
    const [avaliacao] = marcarSuspeitos([comInconsistenciaEm(["atratividade", "eficiencia", "novidade"])], itens, parametros);
    expect(avaliacao).toMatchObject({
      escalasInconsistentes: ["atratividade", "eficiencia", "novidade"],
      motivos: ["amplitude"],
      suspeita: true,
    });
  });

  it("não marca quem é inconsistente em só 2 escalas", () => {
    const avaliacao = avaliarSuspeita(comInconsistenciaEm(["perspicuidade", "confiabilidade"]), itens, parametros);
    expect(avaliacao.escalasInconsistentes).toHaveLength(2);
    expect(avaliacao.suspeita).toBe(false);
  });

  it("não conta amplitude igual a 3 como inconsistência", () => {
    const valores = montarRespostas(itens, (item) => (item.numero === 1 ? 0 : 3));
    expect(avaliarSuspeita(valores, itens, parametros).amplitudes.atratividade).toBe(3);
    expect(avaliarSuspeita(valores, itens, parametros).escalasInconsistentes).toEqual([]);
  });

  it("marca como suspeito quem dá a mesma resposta em mais de 15 itens", () => {
    expect(avaliarSuspeita(comRespostasIguais(16), itens, parametros)).toMatchObject({
      respostasIguais: 16,
      motivos: ["respostasIguais"],
      suspeita: true,
    });
  });

  it("não marca quem repete a mesma resposta em exatamente 15 itens", () => {
    expect(avaliarSuspeita(comRespostasIguais(15), itens, parametros).suspeita).toBe(false);
  });

  it("aponta os dois motivos quando as duas regras valem", () => {
    // tudo no 1: 26 iguais e, nos itens '+' e '-' da mesma escala, -3 e +3
    expect(avaliarSuspeita(Array(26).fill(1), itens, parametros).motivos).toEqual(["amplitude", "respostasIguais"]);
  });

  it("lê os limiares da configuração recebida", () => {
    const rigoroso = { ...parametros, escalasParaSuspeita: 2 };
    expect(avaliarSuspeita(comInconsistenciaEm(["perspicuidade", "confiabilidade"]), itens, rigoroso).suspeita).toBe(true);
  });
});
