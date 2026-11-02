import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { extrairCatalogo } from "../extrair";
import { chaveDoTexto, criarTradutor, interpolar } from "../nucleo";

describe("catálogo da interface", () => {
  it("está em dia com os t() e m() do código (pnpm i18n:catalogo)", () => {
    const salvo = JSON.parse(fs.readFileSync(path.resolve("src/traducao/catalogo.json"), "utf8"));
    expect(salvo.textos).toEqual(extrairCatalogo(path.resolve("src")));
  });

  it("nenhum texto do catálogo é vazio", () => {
    const { textos } = JSON.parse(fs.readFileSync(path.resolve("src/traducao/catalogo.json"), "utf8"));
    for (const { texto } of textos as { texto: string }[]) {
      expect(texto.trim(), `texto vazio ou só com espaços: "${texto}"`).not.toBe("");
    }
  });
});

describe("tradutor", () => {
  it("devolve o original sem tradução e interpola os marcadores", () => {
    const t = criarTradutor("en", { [chaveDoTexto("{n} respostas")]: "{n} responses" });
    expect(t("{n} respostas", { n: 3 })).toBe("3 responses");
    expect(t("Sem tradução")).toBe("Sem tradução");
    expect(t.idioma).toBe("en");
  });

  it("a chave muda com o idioma de origem, menos no português", () => {
    expect(chaveDoTexto("Checkout")).toBe(chaveDoTexto("Checkout", "pt"));
    expect(chaveDoTexto("Checkout", "en")).not.toBe(chaveDoTexto("Checkout"));
  });

  it("deixa marcadores desconhecidos como estão", () => {
    expect(interpolar("{a} e {b}", { a: 1 })).toBe("1 e {b}");
  });
});
