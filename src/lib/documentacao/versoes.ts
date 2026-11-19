import { existsSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { Marked, type Tokens } from "marked";
import { documentoPronto, type Documento } from "./catalogo";
import { IDIOMA_ORIGINAL, IDIOMA_SUBSTITUTO, arquivoTraduzido, idiomaDaDocumentacao } from "./idiomas";
import { slugDoTitulo } from "./markdown";

// A versão de um documento que a pessoa lê: o original em português, a tradução do idioma da interface ou,
// sem tradução, a versão em inglês (substituta). O texto de uma tradução sai com a âncora do original em cada
// título (<!-- ancora:… -->), então os endereços das páginas, os links e as âncoras são os mesmos em todos os
// idiomas, e o link que alguém copiou em português abre a mesma página em japonês
export type Versao = {
  // o idioma em que o texto de fato está
  idioma: string;
  arquivo: string;
  texto: string;
  // o idioma da interface não tem tradução da documentação, e a pessoa lê a versão em inglês
  substituta: boolean;
};

const lidos = new Map<string, { modificado: number; texto: string }>();

// dependeDe: outro arquivo que entra na montagem (o original, para as âncoras da tradução)
function lerComCache(caminho: string, montar: (texto: string) => string, dependeDe?: string): string {
  const modificado = statSync(caminho).mtimeMs + (dependeDe ? statSync(dependeDe).mtimeMs : 0);
  const guardado = lidos.get(caminho);
  if (guardado?.modificado === modificado) return guardado.texto;
  const texto = montar(readFileSync(caminho, "utf8"));
  lidos.set(caminho, { modificado, texto });
  return texto;
}

const titulosDe = (markdown: string) => new Marked({ gfm: true }).lexer(markdown).filter((token): token is Tokens.Heading => token.type === "heading");

// Põe em cada título da tradução a âncora do título na mesma posição do original. As âncoras do original
// seguem a mesma regra de src/lib/documentacao/estrutura.ts: o primeiro # é o título do documento e não conta,
// e um título repetido ganha -1, -2. Devolve null quando os esqueletos não batem (a tradução está quebrada)
export function comAncorasDoOriginal(original: string, traducao: string): string | null {
  const doOriginal = titulosDe(original);
  const tokens = new Marked({ gfm: true }).lexer(traducao);
  const daTraducao = tokens.filter((token): token is Tokens.Heading => token.type === "heading");
  if (doOriginal.length !== daTraducao.length || doOriginal.some((titulo, posicao) => titulo.depth !== daTraducao[posicao]?.depth)) return null;

  const usadas = new Map<string, number>();
  const ancoras = doOriginal.map((titulo, posicao) => {
    if (posicao === 0 && titulo.depth === 1) return null;
    const base = slugDoTitulo(titulo.text);
    const vezes = usadas.get(base) ?? 0;
    usadas.set(base, vezes + 1);
    return vezes === 0 ? base : `${base}-${vezes}`;
  });

  let posicao = 0;
  return tokens
    .map((token) => {
      if (token.type !== "heading") return token.raw;
      const ancora = ancoras[posicao++];
      if (!ancora) return token.raw;
      const { depth, text } = token as Tokens.Heading;
      const quebras = /\n*$/.exec(token.raw)?.[0] ?? "";
      return `${"#".repeat(depth)} ${text} <!-- ancora:${ancora} -->${quebras}`;
    })
    .join("");
}

function versaoNoIdioma(documento: Documento, idioma: string): Omit<Versao, "substituta"> | null {
  const arquivo = arquivoTraduzido(documento.arquivo, idioma);
  const caminho = join(process.cwd(), arquivo);
  if (!existsSync(caminho)) return null;
  const doOriginal = join(process.cwd(), documento.arquivo);
  const texto = lerComCache(caminho, (traducao) => comAncorasDoOriginal(readFileSync(doOriginal, "utf8"), traducao) ?? "", doOriginal);
  // Tradução fora do esqueleto do original não é mostrada: os testes e o pnpm docs:conferir apontam o problema
  return texto ? { idioma, arquivo, texto } : null;
}

export function versaoDoDocumento(documento: Documento, idiomaDaInterface: string = IDIOMA_ORIGINAL): Versao | null {
  if (!documentoPronto(documento)) return null;
  const caminho = join(process.cwd(), documento.arquivo);
  if (!existsSync(caminho)) return null;
  const desejado = idiomaDaDocumentacao(idiomaDaInterface);
  if (desejado !== IDIOMA_ORIGINAL) {
    const traduzida = versaoNoIdioma(documento, desejado) ?? (desejado !== IDIOMA_SUBSTITUTO ? versaoNoIdioma(documento, IDIOMA_SUBSTITUTO) : null);
    if (traduzida) return { ...traduzida, substituta: traduzida.idioma !== idiomaDaInterface };
  }
  const texto = lerComCache(caminho, (original) => original);
  return { idioma: IDIOMA_ORIGINAL, arquivo: documento.arquivo, texto, substituta: false };
}
