import { Marked, type Token } from "marked";
import { slugDoTitulo } from "./markdown";

// Documento longo não é lido de uma vez: a abertura vira um índice e cada seção abre em página própria.
// A divisão usa os tokens do marked, para um "## " dentro de um bloco de código não virar seção

export type Pagina = {
  // o que aparece no endereço: só letras sem acento, números e hífen
  slug: string;
  // a âncora do título, a mesma do GitHub, para os links antigos continuarem achando a página
  ancora: string;
  titulo: string;
  resumo: string;
  // o conteúdo sem o título da própria página
  markdown: string;
  diagramas: number;
};

export type SecaoDocumento = Pagina & { partes: readonly Pagina[] };

export type LocalDaAncora = { secao: string; parte?: string; ehTitulo: boolean };

export type Estrutura = {
  titulo: string;
  abertura: string;
  secoes: readonly SecaoDocumento[];
  ancoras: ReadonlyMap<string, LocalDaAncora>;
  // Documento curto ou sem seções é lido inteiro, na mesma página: dividir só daria mais cliques
  inteiro: boolean;
};

const TAMANHO_DOCUMENTO_CURTO = 4000;
const SUBSECOES_PARA_DIVIDIR = 3;
const TAMANHO_RESUMO = 170;

export function slugParaEndereco(ancora: string): string {
  return ancora.normalize("NFD").replace(/\p{M}/gu, "").replace(/[^a-z0-9-]/g, "");
}

function textoSimples(markdown: string): string {
  return markdown
    .replace(/<[^>]+>/g, "")
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[*_`]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// A primeira frase ou o começo do primeiro parágrafo, para o índice dizer o que há na página sem abri-la
function resumoDe(tokens: readonly Token[]): string {
  const paragrafo = tokens.find((token) => token.type === "paragraph");
  if (!paragrafo) return "";
  const texto = textoSimples(paragrafo.raw);
  if (texto.length <= TAMANHO_RESUMO) return texto;
  const corte = texto.lastIndexOf(" ", TAMANHO_RESUMO);
  return `${texto.slice(0, corte > 0 ? corte : TAMANHO_RESUMO)}…`;
}

const contaDiagramas = (tokens: readonly Token[]) =>
  tokens.filter((token) => token.type === "code" && (token as { lang?: string }).lang === "mermaid").length;

const ancorasDoHtml = (markdown: string) => [...markdown.matchAll(/<a id="([^"]+)"/g)].map((encontro) => encontro[1] ?? "");

type Bloco = { titulo: string; ancora: string; tokens: Token[] };

export function dividirDocumento(markdown: string, tamanhoMinimo = TAMANHO_DOCUMENTO_CURTO): Estrutura {
  const tokens = new Marked({ gfm: true }).lexer(markdown);
  const usadas = new Map<string, number>();
  const ancoraDoTitulo = (texto: string) => {
    const base = slugDoTitulo(texto);
    const vezes = usadas.get(base) ?? 0;
    usadas.set(base, vezes + 1);
    return vezes === 0 ? base : `${base}-${vezes}`;
  };

  let titulo = "";
  const abertura: Token[] = [];
  const blocos: (Bloco & { subblocos: Bloco[]; introducao: Token[] })[] = [];
  const titulosInternos = new Map<Token, string>();

  for (const token of tokens) {
    if (token.type === "heading") {
      const { depth, text } = token as Token & { depth: number; text: string };
      if (depth === 1 && !titulo) {
        titulo = textoSimples(text);
        continue;
      }
      const ancora = ancoraDoTitulo(text);
      if (depth === 2) {
        blocos.push({ titulo: textoSimples(text), ancora, tokens: [], subblocos: [], introducao: [] });
        continue;
      }
      titulosInternos.set(token, ancora);
      const atual = blocos.at(-1);
      if (depth === 3 && atual) {
        atual.subblocos.push({ titulo: textoSimples(text), ancora, tokens: [] });
        atual.tokens.push(token);
        continue;
      }
    }
    const atual = blocos.at(-1);
    if (!atual) {
      abertura.push(token);
      continue;
    }
    atual.tokens.push(token);
    const parte = atual.subblocos.at(-1);
    if (parte) parte.tokens.push(token);
    else atual.introducao.push(token);
  }

  const enderecos = new Set<string>();
  const enderecoUnico = (ancora: string) => {
    const base = slugParaEndereco(ancora) || "secao";
    let endereco = base;
    for (let vez = 2; enderecos.has(endereco); vez++) endereco = `${base}-${vez}`;
    enderecos.add(endereco);
    return endereco;
  };
  const juntar = (lista: readonly Token[]) => lista.map((token) => token.raw).join("").trim();

  const ancoras = new Map<string, LocalDaAncora>();
  const secoes: SecaoDocumento[] = blocos.map((bloco) => {
    const dividir = bloco.subblocos.length >= SUBSECOES_PARA_DIVIDIR;
    const slug = enderecoUnico(bloco.ancora);
    const conteudo = dividir ? bloco.introducao : bloco.tokens;
    ancoras.set(bloco.ancora, { secao: slug, ehTitulo: true });
    const registrar = (lista: readonly Token[], parte?: string) => {
      for (const token of lista) {
        const interna = titulosInternos.get(token);
        if (interna && !ancoras.has(interna)) ancoras.set(interna, { secao: slug, parte, ehTitulo: false });
        for (const ancora of ancorasDoHtml(token.raw)) {
          if (ancora && !ancoras.has(ancora)) ancoras.set(ancora, { secao: slug, parte, ehTitulo: false });
        }
      }
    };
    const partes: Pagina[] = dividir
      ? bloco.subblocos.map((sub) => {
          const slugParte = enderecoUnico(sub.ancora);
          ancoras.set(sub.ancora, { secao: slug, parte: slugParte, ehTitulo: true });
          registrar(sub.tokens, slugParte);
          return {
            slug: slugParte,
            ancora: sub.ancora,
            titulo: sub.titulo,
            resumo: resumoDe(sub.tokens),
            markdown: juntar(sub.tokens),
            diagramas: contaDiagramas(sub.tokens),
          };
        })
      : [];
    registrar(conteudo);
    return {
      slug,
      ancora: bloco.ancora,
      titulo: bloco.titulo,
      resumo: resumoDe(bloco.introducao.length > 0 ? bloco.introducao : bloco.tokens),
      markdown: juntar(conteudo),
      diagramas: contaDiagramas(bloco.tokens),
      partes,
    };
  });

  return {
    titulo,
    abertura: juntar(abertura),
    secoes,
    ancoras,
    inteiro: secoes.length < 2 || markdown.length <= tamanhoMinimo,
  };
}
