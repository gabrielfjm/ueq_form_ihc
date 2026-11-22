// Em que idiomas a documentação existe. O original é o português, em docs/; cada tradução espelha a mesma
// árvore em docs/traducoes/<idioma>/ (docs/documentacao/requisitos.md → docs/traducoes/en/documentacao/requisitos.md).
// A única tradução é a inglesa (decisão do Gabriel em 22/11/2026): os outros idiomas da interface leem a
// versão em inglês, com um aviso que convida a traduzir por fork e pull request no GitHub. Os diagramas e os
// arquivos para baixar ficam em inglês. Uma tradução nova entra aqui quando a pasta dela estiver completa
export const IDIOMA_ORIGINAL = "pt";
export const IDIOMA_SUBSTITUTO = "en";
export const IDIOMAS_TRADUZIDOS = ["en"] as const;
export type IdiomaTraduzido = (typeof IDIOMAS_TRADUZIDOS)[number];

export const PASTA_TRADUCOES = "docs/traducoes";

export function ehIdiomaTraduzido(idioma: string): idioma is IdiomaTraduzido {
  return (IDIOMAS_TRADUZIDOS as readonly string[]).includes(idioma);
}

// O caminho da tradução de um arquivo de docs/ (documento, CSV, planilha ou fonte de diagrama)
export function arquivoTraduzido(arquivo: string, idioma: string): string {
  if (!arquivo.startsWith("docs/")) throw new Error(`${arquivo} não está em docs/`);
  return `${PASTA_TRADUCOES}/${idioma}/${arquivo.slice("docs/".length)}`;
}

// O idioma em que a documentação aparece para quem usa a interface em `idioma`
export function idiomaDaDocumentacao(idioma: string): string {
  if (idioma === IDIOMA_ORIGINAL || ehIdiomaTraduzido(idioma)) return idioma;
  return IDIOMA_SUBSTITUTO;
}
