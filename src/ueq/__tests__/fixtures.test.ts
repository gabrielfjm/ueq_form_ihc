import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { z } from "zod";
import { analisarEstudo, ESCALAS, type FaixaBenchmark } from "..";
import { carregarItens, configOficial, lerRespostas, pastasDeFixture, raizFixtures } from "./carregar";

// docs/ueq-protocolo.md, seção 10: números copiados da planilha oficial
const TOLERANCIA = 1e-6;

const numeroOuErro = z.number().nullable();
const porEscala = z.array(numeroOuErro).length(ESCALAS.length);
const porItem = z.array(numeroOuErro).length(26);
const esperadoDaPlanilha = z.object({
  fonte: z.string(),
  escalas: z.object({
    media: porEscala,
    dp: porEscala,
    n: z.int(),
    icInferior: porEscala,
    icSuperior: porEscala,
    alfa: porEscala,
    benchmark: z.array(z.enum(["Excellent", "Good", "Above average", "Below average", "Bad"])).length(ESCALAS.length),
  }),
  grupos: z.object({ pragmatica: numeroOuErro, hedonica: numeroOuErro }),
  itens: z.object({ media: porItem, dp: porItem, n: z.array(z.int()).length(26), icInferior: porItem, icSuperior: porItem }),
  participantes: z.object({
    escalasInconsistentes: z.array(z.int()),
    respostasIguais: z.array(z.int()),
  }),
  // Answer_Distributions!C3:I28: quantas pessoas deram -3, -2, ..., 3 (já recodificado) em cada item
  distribuicao: z.array(z.array(z.int()).length(7)).length(26),
});

const faixaDaPlanilha: Record<z.infer<typeof esperadoDaPlanilha>["escalas"]["benchmark"][number], FaixaBenchmark> = {
  Excellent: "excelente",
  Good: "bom",
  "Above average": "acimaDaMedia",
  "Below average": "abaixoDaMedia",
  Bad: "ruim",
};

function compararNumeros(rotulo: string, calculado: readonly (number | null | undefined)[], planilha: readonly (number | null)[]) {
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

const itens = carregarItens();

describe.each(pastasDeFixture())("fixture %s contra a planilha oficial", (pasta) => {
  const caminhoEsperado = join(raizFixtures, pasta, "esperado.json");
  if (!existsSync(caminhoEsperado)) {
    it.skip(`${pasta}: preencha esperado.json a partir da planilha oficial`, () => {});
    return;
  }

  const esperado = esperadoDaPlanilha.parse(JSON.parse(readFileSync(caminhoEsperado, "utf8")));
  const respostas = lerRespostas(pasta);
  const analise = analisarEstudo(
    respostas.map((valores) => ({ valores, incluidaNaAnalise: true })),
    itens,
    configOficial,
  );

  it("bate média, dp, n e IC95 por escala", () => {
    expect(analise.n).toBe(esperado.escalas.n);
    compararNumeros("media", analise.escalas.map((escala) => escala.media), esperado.escalas.media);
    compararNumeros("dp", analise.escalas.map((escala) => escala.dp), esperado.escalas.dp);
    compararNumeros("icInferior", analise.escalas.map((escala) => escala.ic?.inferior), esperado.escalas.icInferior);
    compararNumeros("icSuperior", analise.escalas.map((escala) => escala.ic?.superior), esperado.escalas.icSuperior);
  });

  it("bate o alfa de Cronbach por escala", () => {
    compararNumeros("alfa", analise.escalas.map((escala) => escala.alfa), esperado.escalas.alfa);
  });

  it("bate a faixa do benchmark", () => {
    expect(analise.escalas.map((escala) => escala.benchmark)).toEqual(
      esperado.escalas.benchmark.map((faixa) => faixaDaPlanilha[faixa]),
    );
  });

  it("bate qualidade pragmática e hedônica", () => {
    compararNumeros("grupos", [analise.grupos.pragmatica, analise.grupos.hedonica], [
      esperado.grupos.pragmatica,
      esperado.grupos.hedonica,
    ]);
  });

  it("bate média, dp, n e IC95 por item", () => {
    compararNumeros("itens.media", analise.itens.map((item) => item.media), esperado.itens.media);
    compararNumeros("itens.dp", analise.itens.map((item) => item.dp), esperado.itens.dp);
    expect(analise.itens.map((item) => item.n)).toEqual(esperado.itens.n);
    compararNumeros("itens.icInferior", analise.itens.map((item) => item.ic?.inferior), esperado.itens.icInferior);
    compararNumeros("itens.icSuperior", analise.itens.map((item) => item.ic?.superior), esperado.itens.icSuperior);
  });

  it("bate a distribuição das respostas por item", () => {
    // A ferramenta conta da esquerda (1) para a direita (7); a planilha conta do -3 ao 3 depois de recodificar,
    // então nos itens de polaridade negativa a ordem se inverte
    const recodificada = analise.itens.map((item) => {
      const polaridade = itens.find((i) => i.numero === item.numero)?.polaridade;
      return polaridade === "-" ? [...item.distribuicao].reverse() : item.distribuicao;
    });
    expect(recodificada).toEqual(esperado.distribuicao);
  });

  it("bate escalas inconsistentes e respostas iguais por participante", () => {
    expect(analise.participantes.map((participante) => participante.escalasInconsistentes.length)).toEqual(
      esperado.participantes.escalasInconsistentes,
    );
    expect(analise.participantes.map((participante) => participante.respostasIguais)).toEqual(
      esperado.participantes.respostasIguais,
    );
  });
});

// Não depende da planilha: confere as fixtures contra o que o LEIA-ME de cada uma promete
describe("fixtures conforme os LEIA-ME", () => {
  const suspeitasEm = (pasta: string) =>
    analisarEstudo(
      lerRespostas(pasta).map((valores) => ({ valores, incluidaNaAnalise: true })),
      itens,
      configOficial,
    )
      .participantes.map((participante, posicao) => (participante.suspeita ? posicao + 1 : null))
      .filter((linha) => linha !== null);

  it("basico não tem nenhum suspeito", () => {
    expect(suspeitasEm("basico")).toEqual([]);
  });

  it("inconsistente marca exatamente as linhas 1, 6, 9 e 13", () => {
    expect(suspeitasEm("inconsistente")).toEqual([1, 6, 9, 13]);
  });

  it("todos-1 e todos-7 caem na regra das respostas iguais", () => {
    expect(suspeitasEm("extremos/todos-1")).toEqual([1, 2, 3]);
    expect(suspeitasEm("extremos/todos-7")).toEqual([1, 2, 3]);
  });
});
