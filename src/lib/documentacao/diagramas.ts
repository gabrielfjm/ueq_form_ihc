import { createHash } from "node:crypto";

// Os diagramas Mermaid dos .md viram SVG no pnpm docs:diagramas, e não no navegador: a ferramenta não
// carrega a biblioteca e cada diagrama vira uma imagem com texto alternativo. O nome do arquivo é o hash
// do código do diagrama, então mudar o diagrama no .md exige gerar de novo (um teste confere)
export const PASTA_DIAGRAMAS = "docs/documentacao/diagramas";
export const NOME_DIAGRAMA = /^[0-9a-f]{12}\.svg$/;

// A quebra de linha não entra no hash: o mesmo .md salvo com CRLF no Windows aponta para o mesmo SVG
export function nomeDoDiagrama(codigo: string): string {
  return `${createHash("sha256").update(codigo.replace(/\r\n/g, "\n").trim()).digest("hex").slice(0, 12)}.svg`;
}

export function blocosMermaid(markdown: string): string[] {
  return [...markdown.matchAll(/^```mermaid\r?\n([\s\S]*?)^```/gm)].map((bloco) => bloco[1] ?? "");
}
