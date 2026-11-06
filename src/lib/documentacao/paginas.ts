import { existsSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { VISAO_GERAL, documentoPronto, enderecoDoDocumento, type Documento } from "./catalogo";
import { dividirDocumento, type Estrutura, type Pagina, type SecaoDocumento } from "./estrutura";
import { renderizarMarkdown, type DocumentoRenderizado } from "./markdown";

const cache = new Map<string, { modificado: number; estrutura: Estrutura }>();

// Cada link de uma página pergunta a estrutura do documento de destino: ela só é refeita se o arquivo mudou
export function estruturaDe(documento: Documento): Estrutura | null {
  if (!documentoPronto(documento)) return null;
  const caminho = join(process.cwd(), documento.arquivo);
  if (!existsSync(caminho)) return null;
  const modificado = statSync(caminho).mtimeMs;
  const guardada = cache.get(documento.arquivo);
  if (guardada?.modificado === modificado) return guardada.estrutura;
  const dividida = dividirDocumento(readFileSync(caminho, "utf8"));
  // A visão geral fica em /documentacao, sem o nome do documento no endereço: é o índice e fica inteira
  const estrutura = documento === VISAO_GERAL ? { ...dividida, inteiro: true } : dividida;
  cache.set(documento.arquivo, { modificado, estrutura });
  return estrutura;
}

export function enderecoDaPagina(documento: Documento, secao: string, parte?: string): string {
  return `${enderecoDoDocumento(documento)}/${secao}${parte ? `/${parte}` : ""}`;
}

// O endereço de uma âncora de um documento: a página em que ela está, com o fragmento só quando ela fica
// no meio da página. Documento em produção ou lido inteiro continua no endereço dele
export function rotaDaAncora(documento: Documento, ancora?: string): string {
  const base = enderecoDoDocumento(documento);
  const fragmento = ancora ? `#${ancora}` : "";
  if (!ancora) return base;
  const estrutura = estruturaDe(documento);
  const local = estrutura && !estrutura.inteiro ? estrutura.ancoras.get(ancora) : undefined;
  if (!local) return base + fragmento;
  return enderecoDaPagina(documento, local.secao, local.parte) + (local.ehTitulo ? "" : fragmento);
}

export type AberturaDocumento = {
  estrutura: Estrutura;
  renderizado: DocumentoRenderizado;
};

// O que a página do documento mostra: inteiro, ou só a abertura, com as seções como índice
export function aberturaDoDocumento(documento: Documento): AberturaDocumento | null {
  const estrutura = estruturaDe(documento);
  if (!estrutura) return null;
  const endereco = enderecoDoDocumento(documento);
  const opcoes = { rota: rotaDaAncora, enderecoAtual: endereco, documento };
  if (estrutura.inteiro) {
    const inteiro = readFileSync(join(process.cwd(), documento.arquivo), "utf8");
    return { estrutura, renderizado: renderizarMarkdown(inteiro, documento.arquivo, opcoes) };
  }
  const renderizado = renderizarMarkdown(estrutura.abertura, documento.arquivo, { ...opcoes, semTitulo: true });
  return { estrutura, renderizado: { ...renderizado, titulo: estrutura.titulo } };
}

export type Vizinha = { titulo: string; endereco: string };

export type PaginaLida = {
  pagina: Pagina;
  secao: SecaoDocumento;
  parte: Pagina | null;
  // Seção com subseções abre como índice delas
  partes: readonly Pagina[];
  html: string;
  posicao: number;
  total: number;
  anterior: Vizinha | null;
  proxima: Vizinha | null;
  // Para onde o Voltar leva quando não há histórico: a seção da parte, ou a abertura do documento
  pai: Vizinha;
  tituloDocumento: string;
};

export function lerPagina(documento: Documento, slugSecao: string, slugParte?: string): PaginaLida | null {
  const estrutura = estruturaDe(documento);
  if (!estrutura || estrutura.inteiro) return null;
  const indiceSecao = estrutura.secoes.findIndex((candidata) => candidata.slug === slugSecao);
  const secao = estrutura.secoes[indiceSecao];
  if (!secao) return null;

  const irmas: readonly Pagina[] = slugParte ? secao.partes : estrutura.secoes;
  const indice = slugParte ? secao.partes.findIndex((candidata) => candidata.slug === slugParte) : indiceSecao;
  const pagina = irmas[indice];
  if (!pagina) return null;
  const parte = slugParte ? pagina : null;

  const endereco = (alvo: Pagina) => (slugParte ? enderecoDaPagina(documento, secao.slug, alvo.slug) : enderecoDaPagina(documento, alvo.slug));
  const vizinha = (alvo: Pagina | undefined): Vizinha | null => (alvo ? { titulo: alvo.titulo, endereco: endereco(alvo) } : null);
  const enderecoAtual = endereco(pagina);

  const { html } = renderizarMarkdown(pagina.markdown, documento.arquivo, {
    rota: rotaDaAncora,
    enderecoAtual,
    documento,
    semTitulo: true,
    deslocamento: slugParte ? 2 : 1,
    tituloInicial: pagina.titulo,
  });

  return {
    pagina,
    secao,
    parte,
    partes: slugParte ? [] : secao.partes,
    html,
    posicao: indice + 1,
    total: irmas.length,
    anterior: vizinha(irmas[indice - 1]),
    proxima: vizinha(irmas[indice + 1]),
    pai: slugParte
      ? { titulo: secao.titulo, endereco: enderecoDaPagina(documento, secao.slug) }
      : { titulo: estrutura.titulo || documento.rotulo, endereco: enderecoDoDocumento(documento) },
    tituloDocumento: estrutura.titulo || documento.rotulo,
  };
}

// Links antigos e externos com só o fragmento (/documentacao/casos-de-teste#ct-e01) acham a página nova
export function mapaDeAncoras(documento: Documento): Record<string, string> {
  const estrutura = estruturaDe(documento);
  if (!estrutura || estrutura.inteiro) return {};
  return Object.fromEntries([...estrutura.ancoras.keys()].map((ancora) => [ancora, rotaDaAncora(documento, ancora)]));
}
