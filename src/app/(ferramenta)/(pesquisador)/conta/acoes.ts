"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { ehIdioma } from "@/idiomas";
import { banco } from "@/lib/banco";
import { errosPorCampo, textoDoCampo, type EstadoFormulario } from "@/lib/formulario";
import { conferirSenha, gerarHash } from "@/lib/senhas";
import { encerrarOutrasSessoes, encerrarSessao, exigirPesquisador } from "@/lib/sessao";
import { email, nome, senhaDigitada, senhaNova } from "@/lib/validacao-conta";
import { lembrarIdioma, tradutor } from "@/traducao/servidor";
import { m } from "@/traducao/nucleo";

export type CampoDados = "nome" | "email";
export type CampoSenha = "senhaAtual" | "senhaNova";
export type CampoExclusao = "confirmacao";

const dadosCadastrais = z.object({ nome, email });
const trocaDeSenha = z.object({ senhaAtual: senhaDigitada(m("Informe sua senha atual.")), senhaNova });

export async function salvarDados(
  anterior: EstadoFormulario<CampoDados>,
  dados: FormData,
): Promise<EstadoFormulario<CampoDados>> {
  const t = await tradutor();
  const pesquisador = await exigirPesquisador();
  const envio = anterior.envio + 1;
  const validacao = dadosCadastrais.safeParse({ nome: textoDoCampo(dados, "nome"), email: textoDoCampo(dados, "email") });
  if (!validacao.success) return { envio, erros: errosPorCampo(validacao.error) };

  const emailMudou = validacao.data.email !== pesquisador.email;
  if (emailMudou) {
    const outro = await banco.pesquisador.findUnique({ where: { email: validacao.data.email }, select: { id: true } });
    if (outro) return { envio, erros: { email: { mensagem: t("Esse e-mail já é de outra conta.") } } };
  }

  await banco.pesquisador.update({ where: { id: pesquisador.id }, data: validacao.data });
  revalidatePath("/conta");
  return {
    envio,
    sucesso: emailMudou ? t("Dados salvos. O novo e-mail já vale para o próximo login.") : t("Dados salvos."),
  };
}

export async function trocarSenha(
  anterior: EstadoFormulario<CampoSenha>,
  dados: FormData,
): Promise<EstadoFormulario<CampoSenha>> {
  const t = await tradutor();
  const pesquisador = await exigirPesquisador();
  const envio = anterior.envio + 1;
  const validacao = trocaDeSenha.safeParse({
    senhaAtual: textoDoCampo(dados, "senhaAtual"),
    senhaNova: textoDoCampo(dados, "senhaNova"),
  });
  if (!validacao.success) return { envio, erros: errosPorCampo(validacao.error) };

  const { senhaHash } = await banco.pesquisador.findUniqueOrThrow({
    where: { id: pesquisador.id },
    select: { senhaHash: true },
  });
  if (!(await conferirSenha(validacao.data.senhaAtual, senhaHash))) {
    return { envio, erros: { senhaAtual: { mensagem: t("A senha atual não confere. Confira e tente de novo.") } } };
  }

  await banco.pesquisador.update({
    where: { id: pesquisador.id },
    data: { senhaHash: await gerarHash(validacao.data.senhaNova) },
  });
  // Quem tinha a senha antiga e entrou em outro aparelho perde o acesso (prompts/03-autenticacao.md)
  await encerrarOutrasSessoes(pesquisador.id);
  return { envio, sucesso: t("Senha trocada. As outras sessões abertas foram encerradas.") };
}

export async function excluirConta(
  anterior: EstadoFormulario<CampoExclusao>,
  dados: FormData,
): Promise<EstadoFormulario<CampoExclusao>> {
  const t = await tradutor();
  const pesquisador = await exigirPesquisador();
  const envio = anterior.envio + 1;
  const confirmacao = textoDoCampo(dados, "confirmacao").trim().toLowerCase();

  if (!confirmacao) return { envio, erros: { confirmacao: { mensagem: t("Digite o e-mail da sua conta para confirmar.") } } };
  if (confirmacao !== pesquisador.email) {
    return { envio, erros: { confirmacao: { mensagem: t("Esse não é o e-mail da sua conta. Nada foi excluído.") } } };
  }

  await encerrarSessao();
  // Cascata do schema: estudos, versões, participações, respostas e sessões vão junto
  await banco.pesquisador.delete({ where: { id: pesquisador.id } });
  redirect("/?aviso=excluida");
}

export async function salvarPreferenciaEmail(receber: boolean): Promise<string> {
  const t = await tradutor();
  const pesquisador = await exigirPesquisador();
  await banco.pesquisador.update({ where: { id: pesquisador.id }, data: { notificacoesPorEmail: receber } });
  return receber
    ? t("Pronto: os avisos do sino também vão chegar no seu e-mail.")
    : t("Pronto: os avisos ficam só no sino, sem e-mail.");
}

export async function salvarIdioma(dados: FormData): Promise<void> {
  const pesquisador = await exigirPesquisador();
  const idioma = dados.get("idioma");
  if (!ehIdioma(idioma)) redirect("/conta/idioma");
  await banco.pesquisador.update({ where: { id: pesquisador.id }, data: { idioma } });
  await lembrarIdioma(idioma);
  // A ferramenta inteira muda de idioma: a barra e as páginas são do layout
  revalidatePath("/", "layout");
  redirect("/conta?aviso=idioma");
}
