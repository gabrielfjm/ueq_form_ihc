import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { z } from "zod";
import { analisarUeqS, escoresUeqS, valoresDoUeqS, valoresParaOUeq, type FaixaBenchmark } from "..";
import { carregarItensUeqS, configOficialUeqS, lerRespostas, raizFixturesUeqS } from "./carregar";

// data/fixtures-ueq-s/LEIA-ME.md: números da Short_UEQ_Data_Analysis_Tool_V15.xlsx recalculada no Excel
const TOLERANCIA = 1e-6;

const numeroOuErro = z.number().nullable();
const porEscala = z.array(numeroOuErro).length(3);
const porItem = z.array(numeroOuErro).length(8);
const esperadoDaPlanilha = z.object({
  fonte: z.string(),
  escalas: z.object({
    media: porEscala,
    dp: porEscala,
    n: z.int(),
    icInferior: porEscala,
    icSuperior: porEscala,
    alfa: porEscala,
    benchmark: z.array(z.enum(["Excellent", "Good", "Above average", "Below average", "Bad"])).length(3),
  }),
  itens: z.object({ media: porItem, dp: porItem, n: z.array(z.int()).length(8), icInferior: porItem, icSuperior: porItem }),
  participantes: z.object({
    escores: z.array(z.array(z.number()).length(3)),
    escalasInconsistentes: z.array(z.int()),
    respostasIguais: z.array(z.int()),
    todasNoMeio: z.array(z.boolean()),
  }),
});

const faixaDaPlanilha: Record<z.infer<typeof esperadoDaPlanilha>["escalas"]["benchmark"][number], FaixaBenchmark> = {
  Excellent: "excelente",
  Good: "bom",
  "Above average": "acimaDaMedia",
  "Below average": "abaixoDaMedia",
  Bad: "ruim",
};

function compararNumeros(rotulo: string, calculado: readonly (number | null | undefined)[], planilha: readonly (number | null)[]) {
  expect(calculado, rotulo).toHaveLength(planilha.length);
  planilha.forEach((esperado, posicao) => {
    const valor = calculado[posicao];
    const onde = `${rotulo}[${posicao}]`;
    if (esperado === null) {
      expect(valor ?? null, `${onde}: a planilha deu erro, o cálculo deveria dar null`).toBeNull();
      return;
    }
    expect(valor, `${onde}: a planilha tem ${esperado}`).not.toBeNull();
    expect(Math.abs((valor ?? Number.NaN) - esperado), `${onde}: calculado ${valor}, planilha ${esperado}`).toBeLessThanOrEqual(
      TOLERANCIA,
    );
  });
}

const itens = carregarItensUeqS();
const pastas = readdirSync(raizFixturesUeqS, { withFileTypes: true })
  .filter((entrada) => entrada.isDirectory())
  .map((entrada) => entrada.name)
  .sort();
const lerRespostasUeqS = (pasta: string) => lerRespostas(join("..", "fixtures-ueq-s", pasta));

describe("UEQ-S: itens montados a partir de data/ueq-s-itens-ptbr.json", () => {
  it("são os pares 11, 13, 20, 21, 6, 7, 10 e 15 do UEQ, com os lados trocados só nos itens 4 e 7", () => {
    expect(itens.map((item) => item.numeroNoUeq)).toEqual([11, 13, 20, 21, 6, 7, 10, 15]);
    expect(itens.filter((item) => item.ladoTrocado).map((item) => item.ordem)).toEqual([4, 7]);
    expect(itens.every((item) => item.polaridade === "+")).toBe(true);
  });

  it("ida e volta entre o UEQ-S e os itens do UEQ não muda nenhuma resposta", () => {
    const valoresUeqS = [1, 2, 3, 4, 5, 6, 7, 1];
    const valoresUeq = Array<number>(26).fill(0);
    for (const { numeroNoUeq, valor } of valoresParaOUeq(valoresUeqS, itens)) valoresUeq[numeroNoUeq - 1] = valor;
    // Item 4 do UEQ-S (Confuso → Evidente) é o 21 do UEQ (Evidente → Confuso): 4 continua 4; item 7 (7) vira 1
    expect(valoresUeq[20]).toBe(4);
    expect(valoresUeq[9]).toBe(1);
    expect(valoresDoUeqS(valoresUeq, itens)).toEqual(valoresUeqS);
  });
});

describe.each(pastas)("UEQ-S: fixture %s contra a planilha oficial do UEQ-S", (pasta) => {
  const caminhoEsperado = join(raizFixturesUeqS, pasta, "esperado.json");
  if (!existsSync(caminhoEsperado)) {
    it.skip(`${pasta}: gere o esperado.json com scripts/planilha-oficial-ueq-s.ps1`, () => {});
    return;
  }

  const esperado = esperadoDaPlanilha.parse(JSON.parse(readFileSync(caminhoEsperado, "utf8")));
  const respostas = lerRespostasUeqS(pasta);
  const analise = analisarUeqS(
    respostas.map((valores) => ({ valores, incluidaNaAnalise: true })),
    itens,
    configOficialUeqS,
  );

  it("bate média, dp, n e IC95 por escala (pragmática, hedônica e geral)", () => {
    expect(analise.n).toBe(esperado.escalas.n);
    compararNumeros("media", analise.escalas.map((escala) => escala.media), esperado.escalas.media);
    compararNumeros("dp", analise.escalas.map((escala) => escala.dp), esperado.escalas.dp);
    compararNumeros("icInferior", analise.escalas.map((escala) => escala.ic?.inferior), esperado.escalas.icInferior);
    compararNumeros("icSuperior", analise.escalas.map((escala) => escala.ic?.superior), esperado.escalas.icSuperior);
  });

  it("bate o alfa de Cronbach (a planilha não calcula o da geral)", () => {
    compararNumeros("alfa", analise.escalas.map((escala) => escala.alfa), esperado.escalas.alfa);
  });

  it("bate a faixa do benchmark", () => {
    expect(analise.escalas.map((escala) => escala.benchmark)).toEqual(esperado.escalas.benchmark.map((faixa) => faixaDaPlanilha[faixa]));
  });

  it("bate média, dp, n e IC95 por item", () => {
    compararNumeros("itens.media", analise.itens.map((item) => item.media), esperado.itens.media);
    compararNumeros("itens.dp", analise.itens.map((item) => item.dp), esperado.itens.dp);
    expect(analise.itens.map((item) => item.n)).toEqual(esperado.itens.n);
    compararNumeros("itens.icInferior", analise.itens.map((item) => item.ic?.inferior), esperado.itens.icInferior);
    compararNumeros("itens.icSuperior", analise.itens.map((item) => item.ic?.superior), esperado.itens.icSuperior);
  });

  it("bate os escores de cada participante (aba DT)", () => {
    const escores = respostas.map((valores) => escoresUeqS(valores, itens));
    esperado.participantes.escores.forEach((linha, posicao) => {
      const calculado = escores[posicao]!;
      compararNumeros(`escores[${posicao}]`, [calculado.pragmatica, calculado.hedonica, calculado.geral], linha);
    });
  });

  it("bate escalas inconsistentes, respostas iguais e categoria do meio por participante (aba Inconsistencies)", () => {
    expect(analise.participantes.map((participante) => participante.escalasInconsistentes.length)).toEqual(
      esperado.participantes.escalasInconsistentes,
    );
    expect(analise.participantes.map((participante) => participante.respostasIguais)).toEqual(esperado.participantes.respostasIguais);
    expect(analise.participantes.map((participante) => participante.motivos.includes("todasNoMeio"))).toEqual(
      esperado.participantes.todasNoMeio,
    );
  });
});

// Não depende da planilha: confere o cenário bordas contra o que o LEIA-ME promete
describe("UEQ-S: fixture bordas conforme o LEIA-ME", () => {
  it("só as linhas 3, 4 e 7 são suspeitas", () => {
    const analise = analisarUeqS(
      lerRespostasUeqS("bordas").map((valores) => ({ valores, incluidaNaAnalise: true })),
      itens,
      configOficialUeqS,
    );
    const suspeitas = analise.participantes.flatMap((participante, posicao) => (participante.suspeita ? [posicao + 1] : []));
    expect(suspeitas).toEqual([3, 4, 7]);
    expect(analise.participantes[3]!.motivos).toEqual(["todasNoMeio"]);
    expect(analise.participantes[4]!.suspeita).toBe(false);
  });
});
