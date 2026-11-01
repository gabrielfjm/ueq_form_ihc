"use server";

import type { Route } from "next";
import { redirect } from "next/navigation";
import { z } from "zod";
import { Prisma } from "@/generated/prisma/client";
import { banco } from "@/lib/banco";
import { errosPorCampo, textoDoCampo, type EstadoFormulario } from "@/lib/formulario";
import { conferirSenha, gerarHash, precisaNovoHash } from "@/lib/senhas";
import { criarSessao } from "@/lib/sessao";
import { bloqueado, JANELA_MINUTOS, limparFalhas, registrarFalha } from "@/lib/tentativas";
import { destinoInterno, email, nome, senhaDigitada, senhaNova } from "@/lib/validacao-conta";

export type CampoEntrar = "email" | "senha";
export type CampoCadastro = "nome" | "email" | "senha";

const dadosEntrar = z.object({ email, senha: senhaDigitada("Informe sua senha.") });
const dadosCadastro = z.object({ nome, email, senha: senhaNova });

export async function entrar(
  anterior: EstadoFormulario<CampoEntrar>,
  dados: FormData,
): Promise<EstadoFormulario<CampoEntrar>> {
  const envio = anterior.envio + 1;
  const validacao = dadosEntrar.safeParse({ email: textoDoCampo(dados, "email"), senha: textoDoCampo(dados, "senha") });
  if (!validacao.success) return { envio, erros: errosPorCampo(validacao.error) };

  // Depois de 5 erros em 15 minutos, o e-mail espera: adivinhar senha fica inviável
  if (await bloqueado(validacao.data.email)) {
    return {
      envio,
      erroGeral: `Muitas tentativas com este e-mail. Por segurança, espere ${JANELA_MINUTOS} minutos e tente de novo.`,
    };
  }
  const pesquisador = await banco.pesquisador.findUnique({ where: { email: validacao.data.email } });
  const senhaConfere = await conferirSenha(validacao.data.senha, pesquisador?.senhaHash);
  if (!pesquisador || !senhaConfere) {
    await registrarFalha(validacao.data.email);
    return { envio, erroGeral: "E-mail ou senha não conferem. Confira os dois e tente de novo." };
  }
  await limparFalhas(validacao.data.email);
  if (precisaNovoHash(pesquisador.senhaHash)) {
    await banco.pesquisador.update({ where: { id: pesquisador.id }, data: { senhaHash: await gerarHash(validacao.data.senha) } });
  }

  await criarSessao(pesquisador.id);
  redirect(destinoInterno(textoDoCampo(dados, "voltar")) as Route);
}

const EMAIL_JA_TEM_CONTA = {
  mensagem: "Esse e-mail já tem conta.",
  link: { href: "/entrar", texto: "Entre por aqui." },
} as const;

export async function cadastrar(
  anterior: EstadoFormulario<CampoCadastro>,
  dados: FormData,
): Promise<EstadoFormulario<CampoCadastro>> {
  const envio = anterior.envio + 1;
  const validacao = dadosCadastro.safeParse({
    nome: textoDoCampo(dados, "nome"),
    email: textoDoCampo(dados, "email"),
    senha: textoDoCampo(dados, "senha"),
  });
  if (!validacao.success) return { envio, erros: errosPorCampo(validacao.error) };

  const existente = await banco.pesquisador.findUnique({ where: { email: validacao.data.email }, select: { id: true } });
  if (existente) return { envio, erros: { email: EMAIL_JA_TEM_CONTA } };

  let pesquisadorId: string;
  try {
    const criado = await banco.pesquisador.create({
      data: {
        nome: validacao.data.nome,
        email: validacao.data.email,
        senhaHash: await gerarHash(validacao.data.senha),
      },
      select: { id: true },
    });
    pesquisadorId = criado.id;
  } catch (erro) {
    // Dois cadastros com o mesmo e-mail ao mesmo tempo: o segundo bate no índice único
    if (erro instanceof Prisma.PrismaClientKnownRequestError && erro.code === "P2002") {
      return { envio, erros: { email: EMAIL_JA_TEM_CONTA } };
    }
    throw erro;
  }

  await criarSessao(pesquisadorId);
  redirect("/estudos");
}
