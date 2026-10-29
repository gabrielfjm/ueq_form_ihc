import "server-only";
import { cookies, headers } from "next/headers";
import { notFound } from "next/navigation";
import { cache } from "react";
import { ehIdioma, negociarIdioma, type CodigoIdioma } from "@/idiomas";
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

// O idioma escolhido no seletor; antes de escolher, o primeiro dos 37 que o navegador pede (Accept-Language)
export const idiomaDoParticipante = cache(async (): Promise<CodigoIdioma> => {
  const escolhido = (await cookies()).get(COOKIE_IDIOMA)?.value;
  if (ehIdioma(escolhido)) return escolhido;
  return negociarIdioma((await headers()).get("accept-language"));
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
