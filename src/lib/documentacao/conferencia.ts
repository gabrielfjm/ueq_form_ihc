import { Marked, type Token, type Tokens } from "marked";

// A tradução de um documento tem de ter o mesmo esqueleto do original: a ferramenta tira os endereços das
// páginas e as âncoras do português, pela posição de cada título, e os links e as âncoras HTML ficam iguais.
// Usado pelos testes e por scripts/conferir-traducoes.ts, que quem traduz roda antes de entregar

export type Esqueleto = {
  // nível de cada título de primeiro nível do documento, na ordem (# = 1)
  titulos: number[];
  ancorasHtml: string[];
  links: string[];
  diagramas: string[];
  // outros blocos de código (CSS, JSON) ficam iguais nos dois
  codigos: string[];
  // colunas × linhas de cada tabela
  tabelas: string[];
};

function percorrer(tokens: readonly Token[], visitar: (token: Token) => void) {
  for (const token of tokens) {
    visitar(token);
    const filhos = (token as { tokens?: Token[] }).tokens;
    if (filhos) percorrer(filhos, visitar);
    if (token.type === "list") for (const item of (token as Tokens.List).items) percorrer(item.tokens, visitar);
    if (token.type === "table") {
      const tabela = token as Tokens.Table;
      for (const celula of [...tabela.header, ...tabela.rows.flat()]) percorrer(celula.tokens, visitar);
    }
  }
}

export function esqueletoDe(markdown: string): Esqueleto {
  const tokens = new Marked({ gfm: true }).lexer(markdown.replace(/\r\n/g, "\n"));
  const esqueleto: Esqueleto = { titulos: [], ancorasHtml: [], links: [], diagramas: [], codigos: [], tabelas: [] };
  for (const token of tokens) if (token.type === "heading") esqueleto.titulos.push((token as Tokens.Heading).depth);
  percorrer(tokens, (token) => {
    if (token.type === "link") esqueleto.links.push((token as Tokens.Link).href);
    if (token.type === "html") esqueleto.ancorasHtml.push(...[...token.raw.matchAll(/<a id="([^"]+)"/g)].map((encontro) => encontro[1] ?? ""));
    if (token.type === "code") {
      const codigo = token as Tokens.Code;
      (codigo.lang === "mermaid" ? esqueleto.diagramas : esqueleto.codigos).push(codigo.text.trim());
    }
    if (token.type === "table") {
      const tabela = token as Tokens.Table;
      esqueleto.tabelas.push(`${tabela.header.length}×${tabela.rows.length}`);
    }
  });
  esqueleto.links.sort();
  esqueleto.ancorasHtml.sort();
  return esqueleto;
}

function diferenca(nome: string, original: readonly (string | number)[], traducao: readonly (string | number)[]): string[] {
  if (original.join("\u0000") === traducao.join("\u0000")) return [];
  const faltam = original.filter((item) => !traducao.includes(item));
  const sobram = traducao.filter((item) => !original.includes(item));
  const detalhe = [faltam.length ? `faltam ${faltam.slice(0, 8).join(", ")}` : "", sobram.length ? `sobram ${sobram.slice(0, 8).join(", ")}` : ""]
    .filter(Boolean)
    .join("; ");
  return [`${nome}: original tem ${original.length}, tradução tem ${traducao.length}${detalhe ? ` (${detalhe})` : " (mesmos itens em outra ordem ou quantidade)"}`];
}

// Os problemas da tradução, em português, um por linha; vazio quando está tudo certo. Os diagramas são em
// inglês em todos os idiomas, inclusive no original: a tradução os copia sem mudar nada
export function problemasDaTraducao(original: string, traducao: string): string[] {
  const a = esqueletoDe(original);
  const b = esqueletoDe(traducao);
  const problemas = [
    ...diferenca("títulos (níveis na ordem)", a.titulos, b.titulos),
    ...diferenca("âncoras <a id>", a.ancorasHtml, b.ancorasHtml),
    ...diferenca("links", a.links, b.links),
    ...diferenca("tabelas (colunas×linhas na ordem)", a.tabelas, b.tabelas),
    ...diferenca("blocos de código", a.codigos, b.codigos),
  ];
  if (a.diagramas.length !== b.diagramas.length) {
    problemas.push(`diagramas: original tem ${a.diagramas.length}, tradução tem ${b.diagramas.length}`);
  } else {
    b.diagramas.forEach((codigo, posicao) => {
      if (codigo !== a.diagramas[posicao]) problemas.push(`diagrama ${posicao + 1}: não é igual ao do original (os diagramas ficam em inglês, sem tradução)`);
    });
  }
  return problemas;
}
