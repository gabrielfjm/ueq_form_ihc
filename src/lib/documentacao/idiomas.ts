// Em que idiomas a documentação existe. O original é o português, em docs/; cada tradução espelha a mesma
// árvore em docs/traducoes/<idioma>/ (docs/documentacao/requisitos.md → docs/traducoes/en/documentacao/requisitos.md).
// Os diagramas e os arquivos para baixar das traduções ficam em inglês. Um idioma da interface sem tradução
// da documentação lê a versão em inglês, com um aviso
export const IDIOMA_ORIGINAL = "pt";
export const IDIOMA_SUBSTITUTO = "en";
export const IDIOMAS_TRADUZIDOS = ["en", "es", "fr", "de", "it", "zh", "ja"] as const;
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
