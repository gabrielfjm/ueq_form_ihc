import { describe, expect, it } from "vitest";
import { IDIOMAS, textosDoIdioma } from "@/idiomas";
import { condicoesDoTermo, lerIdade, type DadosDoTermo } from "../termo";

const estudo: DadosDoTermo = {
  coletarDemografia: false,
  riscos: "Riscos mínimos.",
  beneficios: "Nenhum benefício direto.",
  comiteEtica: null,
  responsavelNome: "Ana Souza",
  responsavelEmail: "ana@exemplo.com",
  instituicao: "PPGIa · PUCPR",
};

const formulario = (campos: Record<string, string>) => {
  const dados = new FormData();
  for (const [nome, valor] of Object.entries(campos)) dados.set(nome, valor);
  return dados;
};

describe("condicoesDoTermo", () => {
  it("diz o tempo, como desistir, o que acontece depois de enviar, a guarda dos dados, riscos, benefícios e quem responde", () => {
    const condicoes = condicoesDoTermo(textosDoIdioma("pt"), estudo);
    expect(condicoes.map((condicao) => condicao.rotulo)).toEqual([
      "Tempo",
      "Participação",
      "Depois de enviar",
      "Anonimato",
      "Uso dos dados",
      "Riscos",
      "Benefícios",
      "Responsável",
    ]);
    expect(condicoes[0]?.linhas).toEqual(["De 3 a 5 minutos, sem limite de tempo."]);
    expect(condicoes[1]?.linhas[0]).toContain("“Sair sem enviar”");
    expect(condicoes.at(-1)?.linhas).toEqual(["Ana Souza", "PPGIa · PUCPR", "Contato: ana@exemplo.com"]);
  });

  it("com dados opcionais, avisa da etapa e aumenta o tempo; com comitê de ética, mostra o comitê", () => {
    const condicoes = condicoesDoTermo(textosDoIdioma("pt"), { ...estudo, coletarDemografia: true, comiteEtica: "CEP PUCPR, CAAE 123" });
    expect(condicoes[0]?.linhas).toEqual(["De 4 a 6 minutos, sem limite de tempo."]);
    expect(condicoes[1]?.rotulo).toBe("Dados opcionais");
    expect(condicoes.at(-1)).toEqual({ rotulo: "Comitê de ética", linhas: ["CEP PUCPR, CAAE 123"], doEstudo: true });
  });

  it.each(IDIOMAS.map((idioma) => idioma.codigo))("em %s, cita o botão de sair com o nome que ele tem na tela", (codigo) => {
    const textos = textosDoIdioma(codigo);
    const [, participacao] = condicoesDoTermo(textos, estudo);
    expect(participacao?.linhas[0]).toContain(textos.questionario.sair);
    expect(condicoesDoTermo(textos, estudo).at(-1)?.linhas.at(-1)).toContain("ana@exemplo.com");
  });
});

describe("lerIdade", () => {
  it("maior de idade segue; menor só segue com a autorização do responsável", () => {
    expect(lerIdade(formulario({ idade: "maior" }))).toEqual({ menorDeIdade: false });
    expect(lerIdade(formulario({ idade: "maior", autorizacao: "sim" }))).toEqual({ menorDeIdade: false });
    expect(lerIdade(formulario({ idade: "menor", autorizacao: "sim" }))).toEqual({ menorDeIdade: true });
    expect(lerIdade(formulario({ idade: "menor" }))).toEqual({ erro: "autorizacao" });
    expect(lerIdade(formulario({}))).toEqual({ erro: "idade" });
    expect(lerIdade(formulario({ idade: "outra" }))).toEqual({ erro: "idade" });
  });
});
