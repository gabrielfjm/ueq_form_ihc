import "server-only";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { cache } from "react";
import { ehIdioma, IDIOMA_PADRAO, infoIdioma, type CodigoIdioma } from "@/idiomas";
import { traduzirTextosLivres } from "@/traducao/servidor";
import { banco } from "./banco";

// Os cookies valem só dentro do link do estudo (/r/<slug>) e não guardam nada sobre a pessoa:
// um é o id aleatório da participação em andamento, outro só marca que o link já foi respondido
// e o terceiro guarda o idioma escolhido
const COOKIE_PARTICIPACAO = "ueq_participacao";
const COOKIE_RESPONDIDO = "ueq_respondido";
const COOKIE_IDIOMA = "ueq_idioma";
const TRINTA_DIAS_S = 30 * 24 * 60 * 60;

const opcoes = (slug: string) => ({
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: `/r/${slug}`,
});

// Só o que o participante pode ver: título, produto e objetivo. Nada do pesquisador sai daqui
export const estudoPublico = cache(async (slug: string) => {
  const estudo = await banco.estudo.findUnique({
    where: { slugPublico: slug },
    select: {
      id: true,
      titulo: true,
      produtoAvaliado: true,
      objetivo: true,
      status: true,
      coletarDemografia: true,
      idioma: true,
      versoes: {
        select: {
          id: true,
          ordem: true,
          _count: { select: { participacoes: { where: { concluidaEm: { not: null } } } } },
        },
      },
    },
  });
  if (!estudo) notFound();
  return estudo;
});

export async function guardarParticipacao(slug: string, participacaoId: string) {
  (await cookies()).set(COOKIE_PARTICIPACAO, participacaoId, opcoes(slug));
}

export async function esquecerParticipacao(slug: string) {
  (await cookies()).set(COOKIE_PARTICIPACAO, "", { ...opcoes(slug), maxAge: 0 });
}

export async function marcarRespondido(slug: string) {
  (await cookies()).set(COOKIE_RESPONDIDO, "1", { ...opcoes(slug), maxAge: TRINTA_DIAS_S });
}

// O idioma escolhido no seletor; antes de escolher, o idioma em que o estudo foi escrito (o pesquisador
// define ao criar). Quem responde troca a qualquer momento pelo seletor do topo
export const idiomaDoParticipante = cache(async (slug: string): Promise<CodigoIdioma> => {
  const escolhido = (await cookies()).get(COOKIE_IDIOMA)?.value;
  if (ehIdioma(escolhido)) return escolhido;
  const { idioma } = await estudoPublico(slug);
  return ehIdioma(idioma) ? idioma : IDIOMA_PADRAO;
});

// Título, produto e objetivo no idioma de quem responde, traduzidos pela API do Claude e guardados.
// Sem tradução (API desligada ou fora do ar), ficam no idioma do estudo, marcados com o lang dele
export const textosDoEstudo = cache(async (slug: string) => {
  const estudo = await estudoPublico(slug);
  const idioma = await idiomaDoParticipante(slug);
  const origem = ehIdioma(estudo.idioma) ? estudo.idioma : IDIOMA_PADRAO;
  const originais = [estudo.titulo, estudo.produtoAvaliado, estudo.objetivo];
  const [titulo = estudo.titulo, produtoAvaliado = estudo.produtoAvaliado, objetivo = estudo.objetivo] = await traduzirTextosLivres(
    originais,
    origem,
    idioma,
  );
  const traduzido = idioma !== origem && [titulo, produtoAvaliado, objetivo].some((texto, indice) => texto !== originais[indice]);
  return { titulo, produtoAvaliado, objetivo, lang: infoIdioma(traduzido ? idioma : origem).lang };
});

export async function guardarIdioma(slug: string, codigo: CodigoIdioma) {
  (await cookies()).set(COOKIE_IDIOMA, codigo, { ...opcoes(slug), maxAge: TRINTA_DIAS_S });
}

export async function jaRespondeu(): Promise<boolean> {
  return (await cookies()).get(COOKIE_RESPONDIDO)?.value === "1";
}

// A participação do cookie, desde que seja deste estudo; quem trocar o cookie não alcança outro estudo
export async function participacaoAtual(estudoId: string) {
  const id = (await cookies()).get(COOKIE_PARTICIPACAO)?.value;
  if (!id) return null;
  return banco.participacao.findFirst({
    where: { id, versao: { estudoId } },
    select: { id: true, versaoId: true, concluidaEm: true, demografia: true },
  });
}
