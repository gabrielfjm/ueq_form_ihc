import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { extrairCatalogo } from "../extrair";
import { chaveDoTexto, criarTradutor, interpolar, mesmosMarcadores } from "../nucleo";

describe("catálogo da interface", () => {
  it("está em dia com os t() e m() do código (pnpm i18n:catalogo)", () => {
    const salvo = JSON.parse(fs.readFileSync(path.resolve("src/traducao/catalogo.json"), "utf8"));
    expect(salvo.textos).toEqual(extrairCatalogo(path.resolve("src")));
  });

  it("só tem texto de tela: nada de seletor ou nome de evento, que quebraria traduzido", () => {
    const { textos } = JSON.parse(fs.readFileSync(path.resolve("src/traducao/catalogo.json"), "utf8"));
    for (const { texto } of textos as { texto: string }[]) {
      expect(texto, texto).not.toMatch(/^\[data-|^ueq:/);
    }
  });

  it("cada texto sabe de que tela vem, para a tradução entender o sentido", () => {
    const { textos } = JSON.parse(fs.readFileSync(path.resolve("src/traducao/catalogo.json"), "utf8"));
    for (const { texto, origem } of textos as { texto: string; origem: string }[]) {
      expect(fs.existsSync(path.resolve("src", origem)), texto).toBe(true);
    }
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

describe("mesmosMarcadores", () => {
  it("aceita outra ordem e recusa marcador traduzido, sumido ou a mais", () => {
    expect(mesmosMarcadores("{a} de {b}", "{b}: {a}")).toBe(true);
    expect(mesmosMarcadores("Sem marcador", "No marker")).toBe(true);
    expect(mesmosMarcadores("{nome} saiu", "{name} left")).toBe(false);
    expect(mesmosMarcadores("{n} itens", "items")).toBe(false);
    expect(mesmosMarcadores("itens", "{n} items")).toBe(false);
  });
});
