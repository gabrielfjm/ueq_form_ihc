"use server";

import bcrypt from "bcryptjs";
import type { Route } from "next";
import { redirect } from "next/navigation";
import { z } from "zod";
import { Prisma } from "@/generated/prisma/client";
import { banco } from "@/lib/banco";
import { errosPorCampo, textoDoCampo, type EstadoFormulario } from "@/lib/formulario";
import { criarSessao } from "@/lib/sessao";
import { destinoInterno, email, nome, senhaDigitada, senhaNova } from "@/lib/validacao-conta";

export type CampoEntrar = "email" | "senha";
export type CampoCadastro = "nome" | "email" | "senha";

const CUSTO_BCRYPT = 10;

const dadosEntrar = z.object({ email, senha: senhaDigitada("Informe sua senha.") });
const dadosCadastro = z.object({ nome, email, senha: senhaNova });

export async function entrar(
  anterior: EstadoFormulario<CampoEntrar>,
  dados: FormData,
): Promise<EstadoFormulario<CampoEntrar>> {
  const envio = anterior.envio + 1;
  const validacao = dadosEntrar.safeParse({ email: textoDoCampo(dados, "email"), senha: textoDoCampo(dados, "senha") });
  if (!validacao.success) return { envio, erros: errosPorCampo(validacao.error) };

  const pesquisador = await banco.pesquisador.findUnique({ where: { email: validacao.data.email } });
  const senhaConfere = pesquisador ? await bcrypt.compare(validacao.data.senha, pesquisador.senhaHash) : false;
  if (!pesquisador || !senhaConfere) {
    return { envio, erroGeral: "E-mail ou senha não conferem. Confira os dois e tente de novo." };
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
        senhaHash: await bcrypt.hash(validacao.data.senha, CUSTO_BCRYPT),
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
