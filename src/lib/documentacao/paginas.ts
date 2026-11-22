import { VISAO_GERAL, enderecoDoDocumento, type Documento } from "./catalogo";
import { dividirDocumento, type Estrutura, type Pagina, type SecaoDocumento } from "./estrutura";
import { IDIOMA_ORIGINAL } from "./idiomas";
import { renderizarMarkdown, type DocumentoRenderizado, type OpcoesRenderizacao } from "./markdown";
import { versaoDoDocumento, type Versao } from "./versoes";

const cache = new Map<string, { texto: string; estrutura: Estrutura }>();

// Em que idioma a pessoa lê e como os rótulos do HTML saem (o t() da página)
export type Leitura = { idioma?: string; t?: OpcoesRenderizacao["t"] };

function estruturaDaVersao(documento: Documento, versao: Versao): Estrutura {
  const chave = `${documento.arquivo}:${versao.idioma}`;
  const guardada = cache.get(chave);
  if (guardada?.texto === versao.texto) return guardada.estrutura;
  const dividida = dividirDocumento(versao.texto);
  // A visão geral fica em /documentacao, sem o nome do documento no endereço: é o índice e fica inteira.
  // Numa tradução, ler inteiro ou em páginas segue o original: o japonês tem menos caracteres que o português,
  // e os endereços das páginas têm de ser os mesmos em todos os idiomas
  const inteiro =
    documento === VISAO_GERAL || (versao.idioma === IDIOMA_ORIGINAL ? dividida.inteiro : (estruturaDe(documento)?.inteiro ?? dividida.inteiro));
  const estrutura = { ...dividida, inteiro };
  cache.set(chave, { texto: versao.texto, estrutura });
  return estrutura;
}

// Cada link de uma página pergunta a estrutura do documento de destino: ela só é refeita se o arquivo mudou.
// Os endereços e as âncoras são os mesmos em todos os idiomas, então quem só quer saber onde fica uma âncora
// pergunta a do original
export function estruturaDe(documento: Documento, idioma: string = IDIOMA_ORIGINAL): Estrutura | null {
  const versao = versaoDoDocumento(documento, idioma);
  return versao ? estruturaDaVersao(documento, versao) : null;
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
  versao: Versao;
};

function opcoesDaVersao(documento: Documento, versao: Versao, enderecoAtual: string, leitura: Leitura): OpcoesRenderizacao {
  return { rota: rotaDaAncora, enderecoAtual, documento, t: leitura.t, arquivosEmIngles: versao.idioma !== IDIOMA_ORIGINAL };
}

// O que a página do documento mostra: inteiro, ou só a abertura, com as seções como índice
export function aberturaDoDocumento(documento: Documento, leitura: Leitura = {}): AberturaDocumento | null {
  const versao = versaoDoDocumento(documento, leitura.idioma);
  if (!versao) return null;
  const estrutura = estruturaDaVersao(documento, versao);
  const opcoes = opcoesDaVersao(documento, versao, enderecoDoDocumento(documento), leitura);
  // Os links relativos da tradução são os do original: resolvem a partir do caminho do original
  if (estrutura.inteiro) return { estrutura, versao, renderizado: renderizarMarkdown(versao.texto, documento.arquivo, opcoes) };
  const renderizado = renderizarMarkdown(estrutura.abertura, documento.arquivo, { ...opcoes, semTitulo: true });
  return { estrutura, versao, renderizado: { ...renderizado, titulo: estrutura.titulo } };
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
  versao: Versao;
};

export function lerPagina(documento: Documento, slugSecao: string, slugParte?: string, leitura: Leitura = {}): PaginaLida | null {
  const versao = versaoDoDocumento(documento, leitura.idioma);
  if (!versao) return null;
  const estrutura = estruturaDaVersao(documento, versao);
  if (estrutura.inteiro) return null;
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
    ...opcoesDaVersao(documento, versao, enderecoAtual, leitura),
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
    versao,
  };
}

// Links antigos e externos com só o fragmento (/documentacao/casos-de-teste#ct-e01) acham a página nova
export function mapaDeAncoras(documento: Documento): Record<string, string> {
  const estrutura = estruturaDe(documento);
  if (!estrutura || estrutura.inteiro) return {};
  return Object.fromEntries([...estrutura.ancoras.keys()].map((ancora) => [ancora, rotaDaAncora(documento, ancora)]));
}
