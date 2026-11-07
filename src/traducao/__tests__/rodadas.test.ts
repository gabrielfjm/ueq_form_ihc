import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { ehRotulo, rotulosCitados } from "../rodadas";

describe("rodadas da tradução", () => {
  it("rótulo é texto curto sem pontuação de frase no fim", () => {
    expect(ehRotulo("Abrir coleta")).toBe(true);
    expect(ehRotulo(" da versão ")).toBe(true);
    expect(ehRotulo("Link copiado.")).toBe(false);
    expect(ehRotulo("Sair da conta?")).toBe(false);
    expect(ehRotulo("Um rótulo comprido demais para ser o nome de um botão")).toBe(false);
  });

  const rotulos = new Map([
    ["Sair", "Cerrar sesión"],
    ["Sair sem enviar", "Salir sin enviar"],
    ["Abrir coleta", "Abrir recopilación"],
    ["Minha conta", "Mi cuenta"],
    ["resposta", "respuesta"],
    ["Versão {v}", "Versión {v}"],
  ]);

  it("acha os botões citados no texto, com a tradução já escolhida", () => {
    expect(rotulosCitados("A coleta só começa quando você clicar em “Abrir coleta”.", rotulos)).toEqual({ "Abrir coleta": "Abrir recopilación" });
    expect(rotulosCitados("Fica entre Minha conta e Sair.", rotulos)).toEqual({ "Minha conta": "Mi cuenta", Sair: "Cerrar sesión" });
  });

  it("prefere o rótulo mais longo e não confunde pedaço de palavra, minúscula ou marcador", () => {
    expect(rotulosCitados("Use “Sair sem enviar”.", rotulos)).toEqual({ "Sair sem enviar": "Salir sin enviar" });
    expect(rotulosCitados("Saiba mais sobre a resposta da Versão {v}.", rotulos)).toEqual({});
    expect(rotulosCitados("Sair", rotulos)).toEqual({});
  });

  it("os botões citados entre aspas no catálogo existem como rótulos, ou a citação não tem como acompanhar o botão", () => {
    const { textos } = JSON.parse(fs.readFileSync(path.resolve("src/traducao/catalogo.json"), "utf8")) as { textos: { texto: string }[] };
    const rotulosDoCatalogo = new Set(textos.map(({ texto }) => texto).filter(ehRotulo));
    expect(rotulosDoCatalogo.has("Abrir coleta")).toBe(true);
    expect(rotulosDoCatalogo.has("Sair")).toBe(true);
    expect(rotulosDoCatalogo.has("Tirar suspeitas da análise")).toBe(true);
  });
});
