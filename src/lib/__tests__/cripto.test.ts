import { randomBytes } from "node:crypto";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { cifrar, cifrarJson, decifrar, decifrarJson, estaCifrado } from "../cripto";

describe("criptografia de campo", () => {
  const anterior = process.env.CHAVE_CRIPTOGRAFIA;
  beforeEach(() => {
    process.env.CHAVE_CRIPTOGRAFIA = randomBytes(32).toString("base64");
  });
  afterEach(() => {
    process.env.CHAVE_CRIPTOGRAFIA = anterior;
  });

  it("cifra e decifra, com IV novo a cada vez", () => {
    const a = cifrar("25 a 34 anos");
    const b = cifrar("25 a 34 anos");
    expect(estaCifrado(a)).toBe(true);
    expect(a).not.toBe(b);
    expect(a).not.toContain("25 a 34");
    expect(decifrar(a)).toBe("25 a 34 anos");
  });

  it("texto cifrado alterado não decifra (GCM autentica)", () => {
    const cifrado = cifrar("Mulher");
    const adulterado = cifrado.slice(0, -2) + (cifrado.endsWith("A") ? "BB" : "AA");
    expect(() => decifrar(adulterado)).toThrow();
  });

  it("outra chave não decifra", () => {
    const cifrado = cifrar("Pós-graduação");
    process.env.CHAVE_CRIPTOGRAFIA = randomBytes(32).toString("base64");
    expect(() => decifrar(cifrado)).toThrow();
  });

  it("Json cifrado volta igual, e o formato antigo em texto aberto continua legível", () => {
    const demografia = { faixaEtaria: "25 a 34 anos", genero: "Outro" };
    expect(decifrarJson(cifrarJson(demografia))).toEqual(demografia);
    expect(decifrarJson(demografia)).toEqual(demografia);
    expect(decifrarJson(null)).toBeNull();
  });

  it("chave com tamanho errado é recusada", () => {
    process.env.CHAVE_CRIPTOGRAFIA = Buffer.from("curta").toString("base64");
    expect(() => cifrar("x")).toThrow(/32 bytes/);
  });

  it("sem chave, guarda como veio (desenvolvimento)", () => {
    delete process.env.CHAVE_CRIPTOGRAFIA;
    expect(cifrar("x")).toBe("x");
    expect(cifrarJson({ a: 1 })).toEqual({ a: 1 });
  });
});
