import { beforeEach, describe, expect, it, vi } from "vitest";

const { parse } = vi.hoisted(() => ({ parse: vi.fn() }));

vi.mock("server-only", () => ({}));
vi.mock("@anthropic-ai/sdk", () => ({
  default: class {
    beta = { messages: { parse } };
  },
}));

import { traduzirLote } from "../claude";

const primeiraLeitura = (...textos: string[]) => ({
  stop_reason: "end_turn",
  parsed_output: { traducoes: textos.map((texto, indice) => ({ id: String(indice), texto })) },
});
const revisao = (correcoes: Record<string, string> = {}) => ({
  stop_reason: "end_turn",
  parsed_output: { correcoes: Object.entries(correcoes).map(([id, texto]) => ({ id, texto })) },
});

describe("traduzirLote", () => {
  beforeEach(() => {
    parse.mockReset();
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("fica com a correção da revisão, e manda a tela de cada texto e o par original e tradução", async () => {
    parse.mockResolvedValueOnce(primeiraLeitura("Dar de baja", "Salir")).mockResolvedValueOnce(revisao({ 0: "Descargar" }));

    const saida = await traduzirLote(["Baixar", "Sair"], "pt", "es", "interface", { telas: ["a/conta.tsx", "b/barra.tsx"] });

    expect(saida).toEqual(["Descargar", "Salir"]);
    expect(parse.mock.calls[0]![0].messages[0].content).toContain('"tela":"a/conta.tsx"');
    expect(parse.mock.calls[1]![0].messages[0].content).toContain('"original":"Baixar","traducao":"Dar de baja"');
  });

  it("se a revisão falhar, fica a primeira tradução", async () => {
    parse.mockResolvedValueOnce(primeiraLeitura("Descargar")).mockRejectedValueOnce(new Error("sem conexão"));
    await expect(traduzirLote(["Baixar"], "pt", "es", "interface")).resolves.toEqual(["Descargar"]);
  });

  it("recusa tradução com marcadores diferentes: uma correção errada cai na primeira e, sem nenhuma certa, fica null", async () => {
    parse
      .mockResolvedValueOnce(primeiraLeitura("{n} respuestas", "{name} salió"))
      .mockResolvedValueOnce(revisao({ 0: "Respuestas", 1: "{nombre} salió" }));

    const saida = await traduzirLote(["{n} respostas", "{nome} saiu"], "pt", "es", "interface");

    expect(saida).toEqual(["{n} respuestas", null]);
  });

  it("devolve os pedaços de frase com os espaços das pontas do original", async () => {
    parse.mockResolvedValueOnce(primeiraLeitura("de la versión")).mockResolvedValueOnce(revisao());
    await expect(traduzirLote([" da versão "], "pt", "es", "interface")).resolves.toEqual([" de la versión "]);
  });

  it("sem resposta da API, o lote inteiro fica sem tradução e a revisão nem roda", async () => {
    parse.mockResolvedValueOnce({ stop_reason: "refusal", parsed_output: null });
    await expect(traduzirLote(["Baixar", "Sair"], "pt", "es", "interface")).resolves.toEqual([null, null]);
    expect(parse).toHaveBeenCalledTimes(1);
  });

  it("o nome da ferramenta viaja como marcador e sai igual, sem o modelo poder traduzi-lo", async () => {
    parse.mockResolvedValueOnce(primeiraLeitura("Le damos la bienvenida a {ferramenta_ueq}")).mockResolvedValueOnce(revisao());

    await expect(traduzirLote(["Boas-vindas à Ferramenta UEQ"], "pt", "es", "interface")).resolves.toEqual(["Le damos la bienvenida a Ferramenta UEQ"]);
    expect(parse.mock.calls[0]![0].messages[0].content).toContain("{ferramenta_ueq}");
    expect(parse.mock.calls[0]![0].messages[0].content).not.toContain("Ferramenta UEQ");
  });

  it("recusa a tradução que troca o nome da ferramenta", async () => {
    parse.mockResolvedValueOnce(primeiraLeitura("Bienvenido a la Herramienta UEQ")).mockResolvedValueOnce(revisao());
    await expect(traduzirLote(["Boas-vindas à Ferramenta UEQ"], "pt", "es", "interface")).resolves.toEqual([null]);
  });

  it("os termos do idioma e os rótulos citados vão para a tradução e para a revisão", async () => {
    parse.mockResolvedValueOnce(primeiraLeitura("Haga clic en Cerrar sesión.")).mockResolvedValueOnce(revisao());

    await traduzirLote(["Clique em Sair."], "pt", "es", "interface", { termos: { coleta: "recopilación" }, rotulos: [{ Sair: "Cerrar sesión" }] });

    for (const [chamada] of parse.mock.calls) {
      expect(chamada.messages[0].content).toContain('{"coleta":"recopilación"}');
      expect(chamada.messages[0].content).toContain('"rotulos":{"Sair":"Cerrar sesión"}');
    }
  });

  it("pedaço de frase sem ponto final não ganha um, e frase com ponto continua com ele", async () => {
    parse.mockResolvedValueOnce(primeiraLeitura("el enlace ya no acepta respuestas.", "Enlace copiado.")).mockResolvedValueOnce(revisao());
    await expect(traduzirLote(["o link não aceita mais respostas", "Link copiado."], "pt", "es", "interface")).resolves.toEqual([
      "el enlace ya no acepta respuestas",
      "Enlace copiado.",
    ]);
  });
});
