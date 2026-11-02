import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { banco } from "./banco";
import { COOKIE_SESSAO } from "./cookie-sessao";

const DURACAO_SESSAO_MS = 7 * 24 * 60 * 60 * 1000;

export type PesquisadorLogado = {
  id: string;
  nome: string;
  email: string;
  criadoEm: Date;
  administrador: boolean;
  tutorialVistoEm: Date | null;
  notificacoesPorEmail: boolean;
  idioma: string;
};

function idDaSessao(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

async function idDaSessaoAtual(): Promise<string | null> {
  const token = (await cookies()).get(COOKIE_SESSAO)?.value;
  return token ? idDaSessao(token) : null;
}

export async function criarSessao(pesquisadorId: string): Promise<void> {
  const token = randomBytes(32).toString("base64url");
  const expiraEm = new Date(Date.now() + DURACAO_SESSAO_MS);

  await banco.sessao.deleteMany({ where: { pesquisadorId, expiraEm: { lte: new Date() } } });
  await banco.sessao.create({ data: { id: idDaSessao(token), pesquisadorId, expiraEm } });

  (await cookies()).set(COOKIE_SESSAO, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    expires: expiraEm,
    path: "/",
  });
}

// O proxy só confere se o cookie existe; quem garante que a sessão vale é esta consulta ao banco
export const pesquisadorDaSessao = cache(async (): Promise<PesquisadorLogado | null> => {
  const id = await idDaSessaoAtual();
  if (!id) return null;

  const sessao = await banco.sessao.findUnique({
    where: { id },
    select: {
      expiraEm: true,
      pesquisador: {
        select: { id: true, nome: true, email: true, criadoEm: true, administrador: true, tutorialVistoEm: true, notificacoesPorEmail: true, idioma: true },
      },
    },
  });
  if (!sessao || sessao.expiraEm <= new Date()) return null;
  return sessao.pesquisador;
});

export async function exigirPesquisador(): Promise<PesquisadorLogado> {
  const pesquisador = await pesquisadorDaSessao();
  if (!pesquisador) redirect("/entrar");
  return pesquisador;
}

export async function encerrarSessao(): Promise<void> {
  const id = await idDaSessaoAtual();
  if (id) await banco.sessao.deleteMany({ where: { id } });
  (await cookies()).delete(COOKIE_SESSAO);
}

export async function encerrarOutrasSessoes(pesquisadorId: string): Promise<void> {
  const atual = await idDaSessaoAtual();
  await banco.sessao.deleteMany({ where: { pesquisadorId, ...(atual ? { NOT: { id: atual } } : {}) } });
}
