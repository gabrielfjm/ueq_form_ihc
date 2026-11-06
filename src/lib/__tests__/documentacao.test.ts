import { existsSync, readFileSync, readdirSync } from "node:fs";
import { posix } from "node:path";
import { describe, expect, it } from "vitest";
import { DOCUMENTOS, DOWNLOADS, REPOSITORIO, SECOES, caminhoDaFonte, documentoPeloSlug, documentoPronto } from "../documentacao/catalogo";
import { NOME_DIAGRAMA, PASTA_DIAGRAMAS, blocosMermaid, nomeDoDiagrama } from "../documentacao/diagramas";
import { destinoDoLink, renderizarMarkdown, slugDoTitulo } from "../documentacao/markdown";
import { dividirDocumento } from "../documentacao/estrutura";
import { estruturaDe, lerPagina, rotaDaAncora } from "../documentacao/paginas";

const ler = (arquivo: string) => readFileSync(arquivo, "utf8");

// Documentos em produção podem ainda não ter arquivo; os que existem entram em todas as conferências
const EXISTENTES = DOCUMENTOS.filter(({ arquivo }) => existsSync(arquivo));
const CAMINHOS_DO_CATALOGO = new Set([...DOCUMENTOS, ...DOWNLOADS].map(({ arquivo }) => arquivo));

describe("catálogo da documentação", () => {
  it("todo documento publicado e seus downloads existem no repositório", () => {
    for (const documento of DOCUMENTOS.filter(documentoPronto)) {
      for (const { arquivo } of [documento, ...(documento.downloads ?? [])]) expect(existsSync(arquivo), arquivo).toBe(true);
    }
  });

  it("cada documento tem um endereço só e toda seção tem documento", () => {
    const slugs = DOCUMENTOS.map((documento) => documento.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const secao of SECOES) expect(secao.documentos.length, secao.titulo).toBeGreaterThan(0);
    expect(documentoPeloSlug("casos-de-uso")?.arquivo).toBe("docs/documentacao/casos-de-uso.md");
    expect(documentoPeloSlug("")).toBeUndefined();
    expect(documentoPeloSlug("../../.env")).toBeUndefined();
  });

  it("todo documento de docs/documentacao está no catálogo", () => {
    const noCatalogo = new Set(DOCUMENTOS.map((documento) => documento.arquivo));
    for (const arquivo of readdirSync("docs/documentacao").filter((nome) => nome.endsWith(".md"))) {
      expect(noCatalogo.has(`docs/documentacao/${arquivo}`), arquivo).toBe(true);
    }
  });
});

describe("diagramas", () => {
  const usados = new Set(EXISTENTES.flatMap((documento) => blocosMermaid(ler(documento.arquivo)).map(nomeDoDiagrama)));

  it("cada diagrama dos documentos tem o SVG gerado (senão: pnpm docs:diagramas)", () => {
    for (const nome of usados) expect(existsSync(posix.join(PASTA_DIAGRAMAS, nome)), `${nome}: rode pnpm docs:diagramas`).toBe(true);
  });

  it("cada diagrama tem o arquivo-fonte igual ao do documento (senão: pnpm docs:diagramas)", () => {
    for (const documento of EXISTENTES) {
      blocosMermaid(ler(documento.arquivo)).forEach((codigo, posicao) => {
        const fonte = caminhoDaFonte(documento, posicao);
        expect(existsSync(fonte), `${fonte}: rode pnpm docs:diagramas`).toBe(true);
        expect(ler(fonte).trim(), `${fonte}: rode pnpm docs:diagramas`).toBe(codigo.replace(/\r\n/g, "\n").trim());
      });
    }
  });

  it("não sobra SVG de diagrama que nenhum documento usa", () => {
    const sobrando = readdirSync(PASTA_DIAGRAMAS).filter((nome) => NOME_DIAGRAMA.test(nome) && !usados.has(nome));
    expect(sobrando, "rode pnpm docs:diagramas para apagar").toEqual([]);
  });
});

describe("destinoDoLink", () => {
  const atual = "docs/documentacao/casos-de-uso.md";

  it("leva outro documento do catálogo para a aba Documentação, com a âncora", () => {
    expect(destinoDoLink("requisitos.md#rf19", atual)).toBe("/documentacao/requisitos#rf19");
    expect(destinoDoLink("README.md", atual)).toBe("/documentacao");
    expect(destinoDoLink("../ihc.md#6-como-verificar", atual)).toBe("/documentacao/fundamentos-de-ihc#6-como-verificar");
  });

  it("baixa os arquivos da documentação pela rota de download", () => {
    expect(destinoDoLink("planilha-requisitos.xlsx", atual)).toBe("/api/documentacao/planilha-requisitos.xlsx");
  });

  it("abre no GitHub o resto do repositório e mantém âncora e endereço externo", () => {
    expect(destinoDoLink("../../src/ueq/", atual)).toBe(`${REPOSITORIO}/blob/main/src/ueq`);
    expect(destinoDoLink("../../README.md#licença", atual)).toBe(`${REPOSITORIO}/blob/main/README.md#licença`);
    expect(destinoDoLink("#atores", atual)).toBe("#atores");
    expect(destinoDoLink("https://c4model.com", atual)).toBe("https://c4model.com");
  });

  // Link para outro documento do catálogo vale mesmo antes de ele ser escrito: na ferramenta abre o aviso
  // "Em produção" e, quando o arquivo chegar, o próprio documento
  it("nenhum link relativo dos documentos aponta para arquivo que não existe", () => {
    for (const documento of EXISTENTES) {
      const semCodigo = ler(documento.arquivo).replace(/```[\s\S]*?```/g, "");
      for (const [, href = ""] of semCodigo.matchAll(/\]\(([^)\s]+)\)/g)) {
        if (/^[a-z]+:/i.test(href) || href.startsWith("#")) continue;
        const caminho = posix.normalize(posix.join(posix.dirname(documento.arquivo), decodeURIComponent(href.split("#")[0] ?? "")));
        expect(existsSync(caminho) || CAMINHOS_DO_CATALOGO.has(caminho), `${documento.arquivo} → ${href}`).toBe(true);
      }
    }
  });
});

describe("renderizarMarkdown", () => {
  const markdown = [
    "# Título do documento",
    "",
    "## Requisitos funcionais × casos de uso",
    "",
    "| A | B |",
    "|---|---|",
    "| 1 | 2 |",
    "",
    "## Resumo",
    "",
    "## Resumo",
    "",
    "Veja [RF19](requisitos.md#rf19).",
  ].join("\n");
  const resultado = renderizarMarkdown(markdown, "docs/documentacao/matriz-rastreabilidade.md");

  it("separa o título e gera as âncoras como o GitHub, inclusive repetidas", () => {
    expect(resultado.titulo).toBe("Título do documento");
    expect(resultado.html).not.toContain("<h1");
    expect(resultado.secoes.map((secao) => secao.id)).toEqual(["requisitos-funcionais--casos-de-uso", "resumo", "resumo-1"]);
    expect(slugDoTitulo("Execução de 30/10/2026")).toBe("execução-de-30102026");
  });

  it("põe a tabela numa região rolável com nome e reescreve os links", () => {
    expect(resultado.html).toContain('<div class="rolagem" role="region" aria-label="Tabela: Requisitos funcionais × casos de uso" tabindex="0"><table>');
    expect(resultado.html).toContain('href="/documentacao/requisitos#rf19"');
  });

  it("troca o diagrama Mermaid por imagem com texto alternativo e deixa o código à vista", () => {
    const documento = DOCUMENTOS.find((candidato) => candidato.slug === "arquitetura");
    const { html } = renderizarMarkdown(ler(documento?.arquivo ?? ""), documento?.arquivo ?? "");
    expect(html).toMatch(/<img src="\/api\/documentacao\/diagramas\/[0-9a-f]{12}\.svg" alt="Diagrama: [^"]+"/);
    expect(html).toContain("<summary>Ver o código do diagrama</summary>");
    expect(html).toMatch(/<button type="button" class="ampliar" data-ampliar="\/api\/documentacao\/diagramas\/[0-9a-f]{12}\.svg"/);
    expect(html).not.toContain('class="language-mermaid"');
  });
});

describe("dividirDocumento", () => {
  const corpo = "texto ".repeat(40);
  const markdown = [
    "# Título",
    "",
    "Abertura do documento.",
    "",
    "## Primeira seção",
    "",
    `**Resumo** da primeira. ${corpo}`,
    "",
    "```mermaid",
    "flowchart LR",
    "```",
    "",
    "```",
    "## isto é código, não seção",
    "```",
    "",
    "## Seção é longa",
    "",
    "Introdução.",
    "",
    "### Um",
    "",
    "Primeiro.",
    "",
    '| <a id="ct-1"></a>CT-1 | x |',
    "|---|---|",
    "",
    "### Dois",
    "",
    "### Três",
  ].join("\n");
  const estrutura = dividirDocumento(markdown, 0);

  it("separa a abertura das seções e não confunde código com título", () => {
    expect(estrutura.titulo).toBe("Título");
    expect(estrutura.abertura).toBe("Abertura do documento.");
    expect(estrutura.secoes.map((secao) => secao.titulo)).toEqual(["Primeira seção", "Seção é longa"]);
    expect(estrutura.secoes[0]?.markdown).toContain("## isto é código");
    expect(estrutura.secoes[0]?.diagramas).toBe(1);
  });

  it("usa endereço sem acento e divide só a seção com 3 subseções ou mais", () => {
    expect(estrutura.secoes[1]?.slug).toBe("secao-e-longa");
    expect(estrutura.secoes[0]?.partes).toEqual([]);
    expect(estrutura.secoes[1]?.partes.map((parte) => parte.slug)).toEqual(["um", "dois", "tres"]);
    expect(estrutura.secoes[1]?.markdown).toBe("Introdução.");
  });

  it("acha a página de cada âncora, inclusive a de uma linha de tabela", () => {
    expect(estrutura.ancoras.get("primeira-seção")).toEqual({ secao: "primeira-secao", ehTitulo: true });
    expect(estrutura.ancoras.get("três")).toEqual({ secao: "secao-e-longa", parte: "tres", ehTitulo: true });
    expect(estrutura.ancoras.get("ct-1")).toEqual({ secao: "secao-e-longa", parte: "um", ehTitulo: false });
  });

  it("resume pelo primeiro parágrafo, sem marcação e com limite", () => {
    expect(estrutura.secoes[0]?.resumo.startsWith("Resumo da primeira.")).toBe(true);
    expect(estrutura.secoes[0]?.resumo.length).toBeLessThanOrEqual(171);
  });

  it("documento curto ou com uma seção só é lido inteiro", () => {
    expect(dividirDocumento(markdown).inteiro).toBe(true);
    expect(dividirDocumento("# T\n\n## Só uma\n\ntexto", 0).inteiro).toBe(true);
    expect(estrutura.inteiro).toBe(false);
  });
});

describe("rota das âncoras em documentos divididos", () => {
  const documento = (slug: string) => documentoPeloSlug(slug)!;

  it("leva à página da âncora, com fragmento só no meio da página", () => {
    expect(rotaDaAncora(documento("casos-de-teste"), "ct-e01")).toBe("/documentacao/casos-de-teste/casos-de-ponta-a-ponta/ct-e01");
    expect(rotaDaAncora(documento("casos-de-teste"), "cn01")).toBe("/documentacao/casos-de-teste/cenarios#cn01");
    expect(rotaDaAncora(documento("requisitos"), "rf19")).toBe("/documentacao/requisitos#rf19");
  });

  it("a página de uma seção reescreve o link e mantém só o fragmento dentro dela", () => {
    const casos = documento("casos-de-teste");
    const lida = lerPagina(casos, "cenarios");
    expect(lida?.html).toContain('href="/documentacao/casos-de-teste/casos-de-ponta-a-ponta/ct-e01"');
    expect(lida?.anterior?.endereco).toBe("/documentacao/casos-de-teste/estrategia");
    expect(lerPagina(casos, "nao-existe")).toBeNull();
    expect(lerPagina(casos, "cenarios", "nao-existe")).toBeNull();
  });

  it("toda página de todo documento publicado tem título, e os títulos internos não pulam nível", () => {
    for (const doc of DOCUMENTOS.filter(documentoPronto)) {
      const estruturaDoc = estruturaDe(doc);
      for (const secao of estruturaDoc?.inteiro ? [] : (estruturaDoc?.secoes ?? [])) {
        const lida = lerPagina(doc, secao.slug);
        expect(lida?.pagina.titulo, doc.arquivo).toBeTruthy();
        expect(lida?.html ?? "", `${doc.arquivo} ${secao.slug}`).not.toMatch(/<h1/);
        for (const parte of secao.partes) expect(lerPagina(doc, secao.slug, parte.slug)?.pagina.titulo).toBe(parte.titulo);
      }
    }
  });
});
