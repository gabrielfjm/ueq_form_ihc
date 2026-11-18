import { describe, expect, it } from "vitest";
import { IDIOMAS } from "@/idiomas";
import { chaveDoTexto, criarTradutor, NOME_DA_FERRAMENTA } from "../nucleo";

// O nome "Ferramenta UEQ" acompanha o idioma da interface; as traduções guardam o nome em português
describe("nome da ferramenta em cada idioma", () => {
  it("tem um nome para cada um dos 37 idiomas, todos com a sigla UEQ", () => {
    expect(Object.keys(NOME_DA_FERRAMENTA).sort()).toEqual(IDIOMAS.map((idioma) => idioma.codigo).sort());
    for (const nome of Object.values(NOME_DA_FERRAMENTA)) expect(nome).toContain("UEQ");
  });

  it("troca o nome nas frases traduzidas e no próprio nome, e deixa o português como está", () => {
    const titulo = "Resultados · {titulo} · Ferramenta UEQ";
    const ingles = criarTradutor("en", { [chaveDoTexto(titulo)]: "Results · {titulo} · Ferramenta UEQ" });
    expect(ingles(titulo, { titulo: "Checkout" })).toBe("Results · Checkout · UEQ Tool");
    expect(ingles("Ferramenta UEQ")).toBe("UEQ Tool");
    expect(criarTradutor("ja", {})("Ferramenta UEQ")).toBe("UEQ ツール");
    expect(criarTradutor("pt", {})(titulo, { titulo: "Checkout" })).toBe("Resultados · Checkout · Ferramenta UEQ");
  });

  it("frase sem tradução continua inteira em português, sem misturar o nome de outro idioma", () => {
    expect(criarTradutor("de", {})("Boas-vindas à Ferramenta UEQ")).toBe("Boas-vindas à Ferramenta UEQ");
  });
});
