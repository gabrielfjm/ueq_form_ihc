"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { banco } from "@/lib/banco";
import { errosPorCampo, textoDoCampo, type EstadoFormulario } from "@/lib/formulario";
import { encerrarOutrasSessoes, encerrarSessao, exigirPesquisador } from "@/lib/sessao";
import { email, nome, senhaDigitada, senhaNova } from "@/lib/validacao-conta";

export type CampoDados = "nome" | "email";
export type CampoSenha = "senhaAtual" | "senhaNova";
export type CampoExclusao = "confirmacao";

const CUSTO_BCRYPT = 10;

const dadosCadastrais = z.object({ nome, email });
const trocaDeSenha = z.object({ senhaAtual: senhaDigitada("Informe sua senha atual."), senhaNova });

export async function salvarDados(
  anterior: EstadoFormulario<CampoDados>,
  dados: FormData,
): Promise<EstadoFormulario<CampoDados>> {
  const pesquisador = await exigirPesquisador();
  const envio = anterior.envio + 1;
  const validacao = dadosCadastrais.safeParse({ nome: textoDoCampo(dados, "nome"), email: textoDoCampo(dados, "email") });
  if (!validacao.success) return { envio, erros: errosPorCampo(validacao.error) };

  const emailMudou = validacao.data.email !== pesquisador.email;
  if (emailMudou) {
    const outro = await banco.pesquisador.findUnique({ where: { email: validacao.data.email }, select: { id: true } });
    if (outro) return { envio, erros: { email: { mensagem: "Esse e-mail já é de outra conta." } } };
  }

  await banco.pesquisador.update({ where: { id: pesquisador.id }, data: validacao.data });
  revalidatePath("/conta");
  return {
    envio,
    sucesso: emailMudou ? "Dados salvos. O novo e-mail já vale para o próximo login." : "Dados salvos.",
  };
}

export async function trocarSenha(
  anterior: EstadoFormulario<CampoSenha>,
  dados: FormData,
): Promise<EstadoFormulario<CampoSenha>> {
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
  if (!(await bcrypt.compare(validacao.data.senhaAtual, senhaHash))) {
    return { envio, erros: { senhaAtual: { mensagem: "A senha atual não confere. Confira e tente de novo." } } };
  }

  await banco.pesquisador.update({
    where: { id: pesquisador.id },
    data: { senhaHash: await bcrypt.hash(validacao.data.senhaNova, CUSTO_BCRYPT) },
  });
  // Quem tinha a senha antiga e entrou em outro aparelho perde o acesso (prompts/03-autenticacao.md)
  await encerrarOutrasSessoes(pesquisador.id);
  return { envio, sucesso: "Senha trocada. As outras sessões abertas foram encerradas." };
}

export async function excluirConta(
  anterior: EstadoFormulario<CampoExclusao>,
  dados: FormData,
): Promise<EstadoFormulario<CampoExclusao>> {
  const pesquisador = await exigirPesquisador();
  const envio = anterior.envio + 1;
  const confirmacao = textoDoCampo(dados, "confirmacao").trim().toLowerCase();

  if (!confirmacao) return { envio, erros: { confirmacao: { mensagem: "Digite o e-mail da sua conta para confirmar." } } };
  if (confirmacao !== pesquisador.email) {
    return { envio, erros: { confirmacao: { mensagem: "Esse não é o e-mail da sua conta. Nada foi excluído." } } };
  }

  await encerrarSessao();
  // Cascata do schema: estudos, versões, participações, respostas e sessões vão junto
  await banco.pesquisador.delete({ where: { id: pesquisador.id } });
  redirect("/entrar?aviso=excluida");
}
