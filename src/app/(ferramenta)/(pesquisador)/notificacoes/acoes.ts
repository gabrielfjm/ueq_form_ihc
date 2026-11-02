"use server";

import type { Route } from "next";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { TipoNotificacao } from "@/generated/prisma/enums";
import { banco } from "@/lib/banco";
import { notificar } from "@/lib/notificacoes";
import { exigirPesquisador, pesquisadorDaSessao } from "@/lib/sessao";

export type NotificacaoDoSino = {
  id: string;
  tipo: TipoNotificacao;
  texto: string;
  link: string;
  criadaEm: string;
  lida: boolean;
  // convite ainda esperando resposta: o sino mostra Aceitar e Recusar
  convitePendente: string | null;
};

// Lista do sino e da página Notificações: as mais recentes primeiro
export async function listarNotificacoes(limite = 15): Promise<NotificacaoDoSino[]> {
  const pesquisador = await exigirPesquisador();
  const notificacoes = await banco.notificacao.findMany({
    where: { pesquisadorId: pesquisador.id },
    orderBy: { criadaEm: "desc" },
    take: limite,
  });
  const convites = notificacoes.flatMap((notificacao) => (notificacao.colaboracaoId ? [notificacao.colaboracaoId] : []));
  const pendentes = new Set(
    (
      await banco.colaboracao.findMany({
        where: { id: { in: convites }, pesquisadorId: pesquisador.id, status: "PENDENTE" },
        select: { id: true },
      })
    ).map((colaboracao) => colaboracao.id),
  );
  return notificacoes.map((notificacao) => ({
    id: notificacao.id,
    tipo: notificacao.tipo,
    texto: notificacao.texto,
    link: notificacao.link,
    criadaEm: notificacao.criadaEm.toISOString(),
    lida: notificacao.lidaEm !== null,
    convitePendente:
      notificacao.tipo === "CONVITE" && notificacao.colaboracaoId && pendentes.has(notificacao.colaboracaoId)
        ? notificacao.colaboracaoId
        : null,
  }));
}

// O número do sino. Sem sessão (a página acabou de sair da conta) responde 0 em vez de redirecionar
export async function contarNaoLidas(): Promise<number> {
  const pesquisador = await pesquisadorDaSessao();
  if (!pesquisador) return 0;
  return banco.notificacao.count({ where: { pesquisadorId: pesquisador.id, lidaEm: null } });
}

export async function marcarLida(notificacaoId: string): Promise<void> {
  const pesquisador = await exigirPesquisador();
  await banco.notificacao.updateMany({
    where: { id: notificacaoId, pesquisadorId: pesquisador.id, lidaEm: null },
    data: { lidaEm: new Date() },
  });
}

export async function marcarTodasLidas(): Promise<void> {
  const pesquisador = await exigirPesquisador();
  await banco.notificacao.updateMany({ where: { pesquisadorId: pesquisador.id, lidaEm: null }, data: { lidaEm: new Date() } });
  revalidatePath("/notificacoes");
}

// Só a pessoa convidada responde, e só enquanto o convite está pendente. Quem convidou é avisado
export async function responderConvite(colaboracaoId: string, aceitar: boolean): Promise<void> {
  const pesquisador = await exigirPesquisador();
  const colaboracao = await banco.colaboracao.findFirst({
    where: { id: colaboracaoId, pesquisadorId: pesquisador.id, status: "PENDENTE" },
    select: { estudoId: true, convidadoPorId: true, estudo: { select: { titulo: true, pesquisadorId: true } } },
  });
  if (!colaboracao) redirect("/notificacoes?aviso=indisponivel");

  await banco.colaboracao.update({
    where: { id: colaboracaoId },
    data: { status: aceitar ? "ACEITO" : "RECUSADO", respondidoEm: new Date() },
  });
  await banco.notificacao.updateMany({ where: { colaboracaoId, pesquisadorId: pesquisador.id, lidaEm: null }, data: { lidaEm: new Date() } });
  await notificar([colaboracao.convidadoPorId ?? colaboracao.estudo.pesquisadorId], pesquisador.id, {
    tipo: "ALTERACAO",
    texto: (t) =>
      aceitar
        ? t("{nome} aceitou o convite para o estudo “{titulo}”.", { nome: pesquisador.nome, titulo: colaboracao.estudo.titulo })
        : t("{nome} recusou o convite para o estudo “{titulo}”.", { nome: pesquisador.nome, titulo: colaboracao.estudo.titulo }),
    link: `/estudos/${colaboracao.estudoId}`,
    estudoId: colaboracao.estudoId,
  });
  revalidatePath("/", "layout");
  redirect((aceitar ? `/estudos/${colaboracao.estudoId}?aviso=convite-aceito` : "/notificacoes?aviso=recusado") as Route);
}
