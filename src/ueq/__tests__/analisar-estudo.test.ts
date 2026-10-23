import { describe, expect, it } from "vitest";
import { analisarEstudo } from "..";
import { carregarItens, configOficial, montarRespostas } from "./carregar";

const itens = carregarItens();
const tudoPositivo = montarRespostas(itens, () => 3);
const umPontoPositivo = montarRespostas(itens, () => 1);
const tudoNo1 = Array<number>(26).fill(1);

describe("analisarEstudo", () => {
  it("calcula as estatísticas só com as participações incluídas na análise", () => {
    const analise = analisarEstudo(
      [
        { valores: tudoPositivo, incluidaNaAnalise: true },
        { valores: umPontoPositivo, incluidaNaAnalise: true },
        { valores: tudoNo1, incluidaNaAnalise: false },
      ],
      itens,
      configOficial,
    );
    expect(analise.n).toBe(2);
    expect(analise.nExcluidas).toBe(1);
    for (const escala of analise.escalas) expect(escala.media).toBe(2);
    expect(analise.itens[0]?.distribuicao).toEqual([0, 0, 0, 0, 1, 0, 1]);
  });

  it("avalia a suspeita de todas as participações, inclusive as excluídas", () => {
    const analise = analisarEstudo(
      [
        { valores: tudoPositivo, incluidaNaAnalise: true },
        { valores: tudoNo1, incluidaNaAnalise: false },
      ],
      itens,
      configOficial,
    );
    expect(analise.participantes.map((participante) => [participante.suspeita, participante.incluidaNaAnalise])).toEqual([
      [false, true],
      [true, false],
    ]);
  });

  it("classifica no benchmark e calcula pragmática e hedônica pela média das escalas", () => {
    const analise = analisarEstudo(
      [
        { valores: tudoPositivo, incluidaNaAnalise: true },
        { valores: umPontoPositivo, incluidaNaAnalise: true },
      ],
      itens,
      configOficial,
    );
    // média 2 em todas as escalas: acima do limite de Excelente em todas, menos perspicuidade (2)
    expect(analise.escalas.map((escala) => escala.benchmark)).toEqual([
      "excelente",
      "bom",
      "excelente",
      "excelente",
      "excelente",
      "excelente",
    ]);
    expect(analise.grupos).toEqual({ pragmatica: 2, hedonica: 2 });
  });

  it("sinaliza alfa abaixo do mínimo do protocolo", () => {
    // estimulação: os itens 5, 6 e 7 sobem e o 18 desce de um participante para o outro,
    // então há 3 correlações +1 e 3 correlações -1, r̄ = 0 e alfa = 0
    const sobe = montarRespostas(itens, (item) => ([5, 6, 7].includes(item.numero) ? 2 : 1));
    const desce = montarRespostas(itens, (item) => (item.numero === 18 ? 2 : 1));
    const analise = analisarEstudo(
      [
        { valores: sobe, incluidaNaAnalise: true },
        { valores: desce, incluidaNaAnalise: true },
      ],
      itens,
      configOficial,
    );
    const estimulacao = analise.escalas.find((escala) => escala.escala === "estimulacao");
    expect(estimulacao?.alfa).toBeCloseTo(0, 12);
    expect(estimulacao?.alfaAbaixoDoMinimo).toBe(true);
  });

  it("sem ninguém na análise devolve números null, sem quebrar", () => {
    const analise = analisarEstudo([{ valores: tudoNo1, incluidaNaAnalise: false }], itens, configOficial);
    expect(analise.n).toBe(0);
    expect(analise.escalas.every((escala) => escala.media === null && escala.benchmark === null)).toBe(true);
    expect(analise.grupos).toEqual({ pragmatica: null, hedonica: null });
  });
});
