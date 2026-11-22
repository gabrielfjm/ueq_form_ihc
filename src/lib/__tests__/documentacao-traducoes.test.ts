import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { DOCUMENTOS, DOWNLOADS_PUBLICADOS, documentoPeloSlug, documentoPronto } from "../documentacao/catalogo";
import { problemasDaTraducao } from "../documentacao/conferencia";
import { blocosMermaid } from "../documentacao/diagramas";
import { IDIOMAS_TRADUZIDOS, IDIOMA_SUBSTITUTO, arquivoTraduzido, idiomaDaDocumentacao } from "../documentacao/idiomas";
import { destinoDoLink } from "../documentacao/markdown";
import { aberturaDoDocumento, estruturaDe, lerPagina } from "../documentacao/paginas";
import { comAncorasDoOriginal, versaoDoDocumento } from "../documentacao/versoes";

const ler = (arquivo: string) => readFileSync(arquivo, "utf8");
const PRONTOS = DOCUMENTOS.filter(documentoPronto);

describe("traduções da documentação", () => {
  // As fontes .mmd dos diagramas não têm versão traduzida: os diagramas já são em inglês no original
  it("a versão em inglês tem todos os documentos publicados e os arquivos para baixar, menos as fontes dos diagramas", () => {
    for (const { arquivo } of [...PRONTOS, ...DOWNLOADS_PUBLICADOS.filter((download) => !download.arquivo.endsWith(".mmd"))]) {
      const traduzido = arquivoTraduzido(arquivo, IDIOMA_SUBSTITUTO);
      expect(existsSync(traduzido), traduzido).toBe(true);
    }
  });

  // O mesmo que o pnpm docs:conferir: sem isso, a ferramenta não consegue pôr as âncoras do original na tradução
  it("cada tradução tem o esqueleto do original e os mesmos diagramas, sem tradução", () => {
    for (const idioma of IDIOMAS_TRADUZIDOS) {
      for (const { arquivo } of PRONTOS) {
        const traduzido = arquivoTraduzido(arquivo, idioma);
        if (!existsSync(traduzido)) continue;
        expect(problemasDaTraducao(ler(arquivo), ler(traduzido)), traduzido).toEqual([]);
      }
    }
  });

  // Os diagramas são em inglês em todos os idiomas, inclusive no original em português. Os nomes que vêm do
  // código (classes, campos, tabelas, valores como RASCUNHO) continuam como estão no código
  it("nenhum rótulo dos diagramas do original está em português", () => {
    const portugues = /[ãõç]|\b(não|para|pelo|pela|com|uma|dos|das)\b/i;
    for (const { arquivo } of PRONTOS) {
      for (const codigo of blocosMermaid(ler(arquivo))) {
        const semImagens = codigo.replace(/data:[^"]+/g, "");
        const rotulos = [...semImagens.matchAll(/"([^"]*)"/g)].map((encontro) => encontro[1] ?? "");
        // nome próprio fica como é: a região da Neon em São Paulo
        expect(rotulos.filter((rotulo) => portugues.test(rotulo.replace("São Paulo", ""))), arquivo).toEqual([]);
      }
    }
  });
});

describe("comAncorasDoOriginal", () => {
  const original = ["# Casos de uso", "", "## Atores", "", "### Fluxo principal", "", "## UC01", "", "### Fluxo principal", ""].join("\n");

  it("dá a cada título da tradução a âncora do título na mesma posição do original, inclusive as repetidas", () => {
    const traducao = ["# Use cases", "", "## Actors", "", "### Main flow", "", "## UC01", "", "### Main flow", ""].join("\n");
    const marcada = comAncorasDoOriginal(original, traducao) ?? "";
    expect(marcada).toContain("# Use cases\n");
    expect(marcada).toContain("## Actors <!-- ancora:atores -->");
    expect(marcada).toContain("### Main flow <!-- ancora:fluxo-principal -->");
    expect(marcada).toContain("### Main flow <!-- ancora:fluxo-principal-1 -->");
  });

  it("recusa a tradução com outro esqueleto", () => {
    expect(comAncorasDoOriginal(original, "# Use cases\n\n## Actors\n")).toBeNull();
    expect(comAncorasDoOriginal(original, original.replace("### Fluxo principal", "## Fluxo principal"))).toBeNull();
  });
});

describe("versão do documento", () => {
  const requisitos = documentoPeloSlug("requisitos");
  if (!requisitos) throw new Error("requisitos sumiu do catálogo");

  it("o português lê o original; o inglês, a tradução; os outros, o inglês com aviso", () => {
    expect(versaoDoDocumento(requisitos, "pt")).toMatchObject({ idioma: "pt", arquivo: requisitos.arquivo, substituta: false });
    expect(versaoDoDocumento(requisitos, "en")).toMatchObject({ idioma: "en", substituta: false });
    expect(versaoDoDocumento(requisitos, "ko")).toMatchObject({ idioma: "en", arquivo: "docs/traducoes/en/documentacao/requisitos.md", substituta: true });
    expect(idiomaDaDocumentacao("ko")).toBe("en");
    expect(idiomaDaDocumentacao("ja")).toBe("en");
    expect(versaoDoDocumento(requisitos, "es")).toMatchObject({ idioma: "en", substituta: true });
  });

  it("os endereços das páginas e as âncoras são os mesmos em todos os idiomas", () => {
    for (const documento of PRONTOS) {
      const original = estruturaDe(documento);
      const emIngles = estruturaDe(documento, "en");
      expect(emIngles?.inteiro, documento.arquivo).toBe(original?.inteiro);
      expect(emIngles?.secoes.map((secao) => [secao.slug, secao.partes.map((parte) => parte.slug)]), documento.arquivo).toEqual(
        original?.secoes.map((secao) => [secao.slug, secao.partes.map((parte) => parte.slug)]),
      );
      expect([...(emIngles?.ancoras.keys() ?? [])].sort(), documento.arquivo).toEqual([...(original?.ancoras.keys() ?? [])].sort());
    }
  });

  it("a página traduzida mostra o texto da tradução com as âncoras do original e baixa os arquivos em inglês", () => {
    const primeira = estruturaDe(requisitos)?.secoes[0];
    const pagina = lerPagina(requisitos, primeira?.slug ?? "", undefined, { idioma: "en" });
    expect(pagina?.versao.idioma).toBe("en");
    expect(pagina?.pagina.titulo).not.toBe(primeira?.titulo);
    const abertura = aberturaDoDocumento(requisitos, { idioma: "ko", t: (texto) => `«${texto}»` });
    expect(abertura?.versao.substituta).toBe(true);
    expect(destinoDoLink("planilha-requisitos.xlsx", requisitos.arquivo, { arquivosEmIngles: true })).toBe("/api/documentacao/en/planilha-requisitos.xlsx");
  });
});
