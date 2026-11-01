import { describe, expect, it } from "vitest";
import { PREFIRO_NAO_RESPONDER } from "../demografia";
import { perfilDemografico } from "../perfil-demografico";

describe("perfilDemografico", () => {
  const perfil = perfilDemografico([
    { faixaEtaria: "25 a 34 anos", genero: "Mulher" },
    { faixaEtaria: "25 a 34 anos", genero: "Mulher" },
    { faixaEtaria: "60 anos ou mais", genero: "Homem" },
    { faixaEtaria: PREFIRO_NAO_RESPONDER, genero: PREFIRO_NAO_RESPONDER },
    null,
  ]);
  const idade = perfil.find((pergunta) => pergunta.campo === "faixaEtaria")!;
  const genero = perfil.find((pergunta) => pergunta.campo === "genero")!;

  it("conta cada opção, quem preferiu não responder e quem pulou", () => {
    expect(idade.total).toBe(5);
    expect(idade.responderam).toBe(3);
    expect(idade.opcoes.find((opcao) => opcao.rotulo === "25 a 34 anos")).toMatchObject({ quantidade: 2, parcela: 0.4 });
    expect(idade.prefiroNao.quantidade).toBe(1);
    expect(idade.semResposta.quantidade).toBe(1);
  });

  it("escala ordenada fica na ordem da escala, mesmo com opções zeradas", () => {
    expect(idade.opcoes.map((opcao) => opcao.rotulo)).toEqual([
      "18 a 24 anos",
      "25 a 34 anos",
      "35 a 44 anos",
      "45 a 59 anos",
      "60 anos ou mais",
    ]);
  });

  it("gênero, sem ordem natural, vai da maior para a menor", () => {
    expect(genero.ordenada).toBe(false);
    expect(genero.opcoes.map((opcao) => opcao.rotulo)).toEqual(["Mulher", "Homem", "Outro"]);
  });

  it("sem participações, as parcelas ficam em zero", () => {
    expect(perfilDemografico([])[0]?.opcoes.every((opcao) => opcao.parcela === 0)).toBe(true);
  });
});
