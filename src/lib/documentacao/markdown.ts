import { existsSync } from "node:fs";
import { join, posix } from "node:path";
import { Marked, Renderer, type Tokens } from "marked";
import { DOCUMENTOS, DOWNLOADS, REPOSITORIO, enderecoDoDocumento, type Documento } from "./catalogo";
import { PASTA_DIAGRAMAS, nomeDoDiagrama } from "./diagramas";
import { IDIOMA_SUBSTITUTO, arquivoTraduzido } from "./idiomas";

export type Titulo = { id: string; texto: string };
export type DocumentoRenderizado = { titulo: string; html: string; secoes: Titulo[] };

// Em que página fica uma âncora de um documento: quem sabe disso é src/lib/documentacao/paginas.ts
export type RotaDaAncora = (documento: Documento, ancora?: string) => string;

export type OpcoesRenderizacao = {
  rota?: RotaDaAncora;
  // O documento e o endereço da página que está sendo montada: âncora na própria página fica só como #
  documento?: Documento;
  enderecoAtual?: string;
  // Trecho de um documento, sem o # do título
  semTitulo?: boolean;
  // Na página de uma seção, o título dela é o h1: os níveis de dentro sobem, sem pular nenhum
  deslocamento?: number;
  // Legenda do diagrama que vem antes de qualquer título do trecho
  tituloInicial?: string;
  // Os rótulos que o HTML acrescenta (legenda, botões, nome da tabela) no idioma da interface
  t?: (texto: string, valores?: Record<string, string | number>) => string;
  // Tradução da documentação: os arquivos para baixar saem na versão em inglês (src/lib/documentacao/idiomas.ts)
  arquivosEmIngles?: boolean;
};

// A tradução de um documento carrega no título a âncora do original (src/lib/documentacao/versoes.ts): os
// endereços e os links ficam os mesmos em todos os idiomas
export const MARCA_DA_ANCORA = /\s*<!-- ancora:(\S+) -->/;

export function ancoraMarcada(texto: string): string | undefined {
  return MARCA_DA_ANCORA.exec(texto)?.[1];
}

const semTraducao = (texto: string, valores?: Record<string, string | number>) =>
  valores ? texto.replace(/\{(\w+)\}/g, (inteiro, nome: string) => (nome in valores ? String(valores[nome]) : inteiro)) : texto;

export function enderecoDoDownload(arquivo: string, emIngles = false): string {
  return `/api/documentacao/${emIngles ? `${IDIOMA_SUBSTITUTO}/` : ""}${posix.basename(arquivo)}`;
}

const ICONE_LINK =
  '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>';

function escapar(texto: string): string {
  return texto.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// Mesmo algoritmo do GitHub, para requisitos.md#rf19 funcionar igual nos dois lugares
export function slugDoTitulo(texto: string): string {
  return texto
    .replace(/<[^>]+>/g, "")
    .trim()
    .toLowerCase()
    .replace(/[`*_]/g, "")
    .replace(/[^\p{L}\p{N} -]/gu, "")
    .replace(/ /g, "-");
}

// Link relativo do .md: outro documento do catálogo abre na ferramenta, arquivo para baixar sai pela rota
// de download, e o resto do repositório (código, dados) abre no GitHub
export function destinoDoLink(href: string, arquivoAtual: string, opcoes: OpcoesRenderizacao = {}): string {
  const { rota, documento: atual, enderecoAtual } = opcoes;
  // Link para um documento dividido em páginas leva à página da âncora; se ela é esta, fica só o fragmento
  const naPagina = (destino: string) => {
    const [semFragmento = "", fragmento] = destino.split("#");
    return fragmento && semFragmento === enderecoAtual ? `#${fragmento}` : destino;
  };
  if (/^[a-z]+:/i.test(href)) return href;
  if (href.startsWith("#")) return rota && atual ? naPagina(rota(atual, href.slice(1))) : href;
  const [caminho = "", ancora] = href.split("#");
  const alvo = posix.normalize(posix.join(posix.dirname(arquivoAtual), decodeURIComponent(caminho)));
  const sufixo = ancora ? `#${ancora}` : "";
  const documento = DOCUMENTOS.find((candidato) => candidato.arquivo === alvo);
  if (documento) return rota ? naPagina(rota(documento, ancora)) : enderecoDoDocumento(documento) + sufixo;
  if (DOWNLOADS.some((download) => download.arquivo === alvo)) {
    const emIngles = opcoes.arquivosEmIngles === true && existsSync(join(process.cwd(), arquivoTraduzido(alvo, IDIOMA_SUBSTITUTO)));
    return enderecoDoDownload(alvo, emIngles);
  }
  return `${REPOSITORIO}/blob/main/${alvo.replace(/\/$/, "")}${sufixo}`;
}

class RenderizadorDocumento extends Renderer {
  readonly secoes: Titulo[] = [];
  private readonly usados = new Map<string, number>();
  private tituloAtual: string;

  constructor(
    private readonly arquivo: string,
    private readonly opcoes: OpcoesRenderizacao = {},
  ) {
    super();
    this.tituloAtual = opcoes.tituloInicial ?? "";
  }

  override heading({ tokens, depth, text }: Tokens.Heading): string {
    const base = slugDoTitulo(text);
    const vezes = this.usados.get(base) ?? 0;
    this.usados.set(base, vezes + 1);
    const id = ancoraMarcada(text) ?? (vezes === 0 ? base : `${base}-${vezes}`);
    const conteudo = this.parser.parseInline(tokens).replace(MARCA_DA_ANCORA, "").trim();
    const texto = conteudo.replace(/<[^>]+>/g, "");
    this.tituloAtual = texto;
    if (depth === 2) this.secoes.push({ id, texto });
    const nivel = Math.max(2, depth - (this.opcoes.deslocamento ?? 0));
    return `<h${nivel} id="${id}">${conteudo}</h${nivel}>\n`;
  }

  override link({ href, title, tokens }: Tokens.Link): string {
    const destino = escapar(destinoDoLink(href, this.arquivo, this.opcoes));
    const externo = destino.startsWith("http") ? ' rel="noreferrer"' : "";
    return `<a href="${destino}"${title ? ` title="${escapar(title)}"` : ""}${externo}>${this.parser.parseInline(tokens)}</a>`;
  }

  override code(token: Tokens.Code): string {
    if (token.lang !== "mermaid") return super.code(token);
    const t = this.opcoes.t ?? semTraducao;
    const nome = nomeDoDiagrama(token.text);
    const bruta = this.tituloAtual || t("Diagrama");
    const legenda = escapar(bruta);
    const codigo = `<details class="codigo-diagrama"><summary>${escapar(t("Ver o código do diagrama"))}</summary><pre><code>${escapar(token.text)}</code></pre></details>\n`;
    if (!existsSync(join(process.cwd(), PASTA_DIAGRAMAS, nome))) {
      return `<p class="aviso-diagrama">Este diagrama ainda não foi gerado. Rode <code>pnpm docs:diagramas</code>.</p>\n${codigo}`;
    }
    const endereco = `/api/documentacao/diagramas/${nome}`;
    // O diagrama é uma imagem: o texto da seção e o código logo abaixo são a alternativa em texto (WCAG 1.1.1).
    // Clicar nele ou em "Abrir em tamanho real" abre a tela cheia (ArtigoDocumento); sem JavaScript, o link
    // ainda abre o SVG
    const ampliar = `data-ampliar="${endereco}" data-legenda="${legenda}"`;
    return (
      `<figure class="figura"><div class="figura-imagem"><button type="button" class="ampliar" ${ampliar} aria-label="${escapar(t("Ampliar em tela cheia: {legenda}", { legenda: bruta }))}">` +
      `<img src="${endereco}" alt="${escapar(t("Diagrama: {legenda}. A descrição está no texto da seção.", { legenda: bruta }))}" loading="lazy"></button></div>` +
      `<figcaption><span>${legenda}</span><a class="acao" href="${endereco}" ${ampliar}>${ICONE_LINK}<span>${escapar(t("Abrir em tamanho real"))}</span></a></figcaption></figure>\n${codigo}`
    );
  }

  // Tabela larga rola dentro de uma região focável, e a página não rola na horizontal (WCAG 1.4.10 e 2.1.1)
  override table(token: Tokens.Table): string {
    const t = this.opcoes.t ?? semTraducao;
    const rotulo = escapar(this.tituloAtual ? t("Tabela: {titulo}", { titulo: this.tituloAtual }) : t("Tabela"));
    return `<div class="rolagem" role="region" aria-label="${rotulo}" tabindex="0">${super.table(token)}</div>\n`;
  }
}

// O conteúdo vem só dos .md do próprio repositório (o catálogo diz quais), por isso o HTML não é sanitizado
export function renderizarMarkdown(markdown: string, arquivo: string, opcoes: OpcoesRenderizacao = {}): DocumentoRenderizado {
  const titulo = opcoes.semTitulo ? "" : (/^# (.+)$/m.exec(markdown)?.[1]?.trim() ?? "");
  const semTitulo = opcoes.semTitulo ? markdown : markdown.replace(/^# .+\r?\n/m, "");
  const renderizador = new RenderizadorDocumento(arquivo, opcoes);
  // A instância vai no parse, não no construtor: o use() do marked só copia métodos enumeráveis,
  // e os métodos sobrescritos de uma classe não são
  const html = new Marked({ gfm: true }).parse(semTitulo, { async: false, renderer: renderizador });
  return { titulo, html, secoes: renderizador.secoes };
}
