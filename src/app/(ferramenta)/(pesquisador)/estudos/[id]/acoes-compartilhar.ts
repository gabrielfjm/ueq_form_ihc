"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import type { PapelColaborador } from "@/generated/prisma/enums";
import { banco } from "@/lib/banco";
import { emailConfigurado, emailDeConvite, linkMailto } from "@/lib/email";
import { origemDoSite } from "@/lib/endereco";
import { estudoDoPesquisador } from "@/lib/estudos";
import { textoDoCampo, type EstadoFormulario } from "@/lib/formulario";
import { notificar } from "@/lib/notificacoes";
import { exigirPesquisador } from "@/lib/sessao";
import { email as validarEmail } from "@/lib/validacao-conta";

export type PessoaComAcesso = {
  id: string;
  nome: string;
  email: string;
  papel: PapelColaborador;
  status: "PENDENTE" | "ACEITO" | "RECUSADO";
  voce: boolean;
};

export type AcessosDoEstudo = {
  dono: { nome: string; email: string; voce: boolean };
  pessoas: PessoaComAcesso[];
  podeGerenciar: boolean;
  emailConfigurado: boolean;
};

// Quem tem acesso ao estudo, para a janela Compartilhar. Qualquer pessoa com acesso vê a lista;
// só o dono (e o administrador) convida, muda papel e remove
export async function listarAcessos(estudoId: string): Promise<AcessosDoEstudo> {
  const pesquisador = await exigirPesquisador();
  const estudo = await estudoDoPesquisador(estudoId, pesquisador);
  const colaboracoes = await banco.colaboracao.findMany({
    where: { estudoId },
    orderBy: { criadoEm: "asc" },
    include: { pesquisador: { select: { nome: true, email: true } } },
  });
  return {
    dono: { nome: estudo.pesquisador.nome, email: estudo.pesquisador.email, voce: estudo.pesquisadorId === pesquisador.id },
    pessoas: colaboracoes.map((colaboracao) => ({
      id: colaboracao.id,
      nome: colaboracao.pesquisador.nome,
      email: colaboracao.pesquisador.email,
      papel: colaboracao.papel,
      status: colaboracao.status,
      voce: colaboracao.pesquisadorId === pesquisador.id,
    })),
    podeGerenciar: estudo.permissoes.gerenciar,
    emailConfigurado: emailConfigurado(),
  };
}

export type ResultadoConvite = EstadoFormulario<"email"> & {
  // sem SMTP configurado: o e-mail pronto para quem convidou mandar do próprio programa de e-mail
  mailto?: string;
};

const papelValido = (valor: string): PapelColaborador => (valor === "LEITOR" ? "LEITOR" : "EDITOR");

export async function convidar(estudoId: string, anterior: ResultadoConvite, dados: FormData): Promise<ResultadoConvite> {
  const pesquisador = await exigirPesquisador();
  const estudo = await estudoDoPesquisador(estudoId, pesquisador, "gerenciar");
  const envio = anterior.envio + 1;
  const validacao = z.object({ email: validarEmail }).safeParse({ email: textoDoCampo(dados, "email") });
  if (!validacao.success) return { envio, erros: { email: { mensagem: validacao.error.issues[0]?.message ?? "" } } };
  const papel = papelValido(textoDoCampo(dados, "papel"));

  const convidado = await banco.pesquisador.findUnique({
    where: { email: validacao.data.email },
    select: { id: true, nome: true, email: true },
  });
  if (!convidado) {
    return {
      envio,
      erros: {
        email: {
          mensagem:
            "Não há conta com esse e-mail na ferramenta. Peça para a pessoa criar uma conta e convide de novo com o mesmo e-mail.",
        },
      },
    };
  }
  if (convidado.id === estudo.pesquisadorId) {
    return { envio, erros: { email: { mensagem: "Esse e-mail é do dono do estudo, que já tem acesso total." } } };
  }

  const existente = await banco.colaboracao.findUnique({
    where: { estudoId_pesquisadorId: { estudoId, pesquisadorId: convidado.id } },
  });
  if (existente?.status === "ACEITO") {
    return { envio, erros: { email: { mensagem: `${convidado.nome} já tem acesso a este estudo.` } } };
  }
  // Convite recusado ou ainda pendente: vale o novo, com o papel escolhido agora
  const colaboracao = await banco.colaboracao.upsert({
    where: { estudoId_pesquisadorId: { estudoId, pesquisadorId: convidado.id } },
    create: { estudoId, pesquisadorId: convidado.id, convidadoPorId: pesquisador.id, papel },
    update: { papel, status: "PENDENTE", convidadoPorId: pesquisador.id, criadoEm: new Date(), respondidoEm: null },
  });

  const dadosEmail = {
    quemConvidou: { nome: pesquisador.nome, email: pesquisador.email },
    para: convidado.email,
    estudo: estudo.titulo,
    papel,
  };
  // Convite antigo ainda não lido sai do sino: vale só o novo, com o papel de agora
  await banco.notificacao.deleteMany({ where: { colaboracaoId: colaboracao.id, tipo: "CONVITE" } });
  await notificar([convidado.id], pesquisador.id, {
    tipo: "CONVITE",
    texto: `${pesquisador.nome} convidou você para o estudo “${estudo.titulo}” como ${papel === "EDITOR" ? "editor" : "leitor"}.`,
    link: "/notificacoes",
    estudoId,
    colaboracaoId: colaboracao.id,
    email: (_destinatario, origem) => emailDeConvite({ ...dadosEmail, link: `${origem}/notificacoes` }),
  });
  const enviado = emailConfigurado();
  const email = emailDeConvite({ ...dadosEmail, link: `${await origemDoSite()}/notificacoes` });
  revalidatePath(`/estudos/${estudoId}`, "layout");
  return {
    envio,
    sucesso: enviado
      ? `Convite enviado para ${convidado.nome}, na ferramenta e por e-mail.`
      : `Convite enviado para ${convidado.nome}. Ele já aparece no sino de notificações da pessoa, na ferramenta.`,
    mailto: enviado ? undefined : linkMailto(email),
  };
}

async function colaboracaoParaGerenciar(colaboracaoId: string) {
  const pesquisador = await exigirPesquisador();
  const colaboracao = await banco.colaboracao.findUnique({
    where: { id: colaboracaoId },
    include: { pesquisador: { select: { nome: true } } },
  });
  if (!colaboracao) return null;
  const estudo = await estudoDoPesquisador(colaboracao.estudoId, pesquisador, "gerenciar");
  return { ...colaboracao, quem: pesquisador, tituloEstudo: estudo.titulo };
}

export async function mudarPapel(colaboracaoId: string, papel: string): Promise<{ sucesso?: string; erro?: string }> {
  const colaboracao = await colaboracaoParaGerenciar(colaboracaoId);
  if (!colaboracao) return { erro: "Essa pessoa não está mais no estudo. Feche a janela e abra de novo." };
  const novo = papelValido(papel);
  await banco.colaboracao.update({ where: { id: colaboracaoId }, data: { papel: novo } });
  if (colaboracao.status === "ACEITO") {
    await notificar([colaboracao.pesquisadorId], colaboracao.quem.id, {
      tipo: "ALTERACAO",
      texto: `${colaboracao.quem.nome} mudou seu papel em “${colaboracao.tituloEstudo}” para ${novo === "EDITOR" ? "editor" : "leitor"}.`,
      link: `/estudos/${colaboracao.estudoId}`,
      estudoId: colaboracao.estudoId,
    });
  }
  revalidatePath(`/estudos/${colaboracao.estudoId}`, "layout");
  return { sucesso: `${colaboracao.pesquisador.nome} agora é ${novo === "EDITOR" ? "editor" : "leitor"}.` };
}

export async function removerAcesso(colaboracaoId: string): Promise<{ sucesso?: string; erro?: string }> {
  const colaboracao = await colaboracaoParaGerenciar(colaboracaoId);
  if (!colaboracao) return { erro: "Essa pessoa não está mais no estudo. Feche a janela e abra de novo." };
  await banco.colaboracao.delete({ where: { id: colaboracaoId } });
  // Convite cancelado some do sino de quem foi convidado: não sobra botão de aceitar sem convite
  await banco.notificacao.deleteMany({ where: { colaboracaoId, tipo: "CONVITE" } });
  if (colaboracao.status === "ACEITO") {
    await notificar([colaboracao.pesquisadorId], colaboracao.quem.id, {
      tipo: "ALTERACAO",
      texto: `${colaboracao.quem.nome} removeu seu acesso ao estudo “${colaboracao.tituloEstudo}”.`,
      link: "/estudos",
    });
  }
  revalidatePath(`/estudos/${colaboracao.estudoId}`, "layout");
  return {
    sucesso:
      colaboracao.status === "ACEITO"
        ? `${colaboracao.pesquisador.nome} não tem mais acesso ao estudo.`
        : `Convite para ${colaboracao.pesquisador.nome} cancelado.`,
  };
}

// Quem foi convidado pode sair do estudo quando quiser; o estudo continua com o dono
export async function sairDoEstudo(estudoId: string): Promise<void> {
  const pesquisador = await exigirPesquisador();
  const estudo = await banco.estudo.findUnique({ where: { id: estudoId }, select: { titulo: true, pesquisadorId: true } });
  const { count } = await banco.colaboracao.deleteMany({ where: { estudoId, pesquisadorId: pesquisador.id } });
  if (estudo && count > 0) {
    await notificar([estudo.pesquisadorId], pesquisador.id, {
      tipo: "ALTERACAO",
      texto: `${pesquisador.nome} saiu do estudo “${estudo.titulo}”.`,
      link: `/estudos/${estudoId}`,
      estudoId,
    });
  }
  revalidatePath("/estudos");
  redirect("/estudos?aviso=saiu-do-estudo");
}
