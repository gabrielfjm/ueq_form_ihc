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
import { ehIdioma, IDIOMA_PADRAO } from "@/idiomas";
import { lembrarIdioma, tradutor } from "@/traducao/servidor";
import { m } from "@/traducao/nucleo";

export type CampoEntrar = "email" | "senha";
export type CampoCadastro = "nome" | "email" | "senha";

const dadosEntrar = z.object({ email, senha: senhaDigitada(m("Informe sua senha.")) });
const dadosCadastro = z.object({ nome, email, senha: senhaNova });

export async function entrar(
  anterior: EstadoFormulario<CampoEntrar>,
  dados: FormData,
): Promise<EstadoFormulario<CampoEntrar>> {
  const t = await tradutor();
  const envio = anterior.envio + 1;
  const validacao = dadosEntrar.safeParse({ email: textoDoCampo(dados, "email"), senha: textoDoCampo(dados, "senha") });
  if (!validacao.success) return { envio, erros: errosPorCampo(validacao.error) };

  // Depois de 5 erros em 15 minutos, o e-mail espera: adivinhar senha fica inviável
  if (await bloqueado(validacao.data.email)) {
    return {
      envio,
      erroGeral: t("Muitas tentativas com este e-mail. Por segurança, espere {JANELA_MINUTOS} minutos e tente de novo.", { JANELA_MINUTOS: JANELA_MINUTOS }),
    };
  }
  const pesquisador = await banco.pesquisador.findUnique({ where: { email: validacao.data.email } });
  const senhaConfere = await conferirSenha(validacao.data.senha, pesquisador?.senhaHash);
  if (!pesquisador || !senhaConfere) {
    await registrarFalha(validacao.data.email);
    return { envio, erroGeral: t("E-mail ou senha não conferem. Confira os dois e tente de novo.") };
  }
  await limparFalhas(validacao.data.email);
  if (precisaNovoHash(pesquisador.senhaHash)) {
    await banco.pesquisador.update({ where: { id: pesquisador.id }, data: { senhaHash: await gerarHash(validacao.data.senha) } });
  }

  await criarSessao(pesquisador.id);
  await lembrarIdioma(pesquisador.idioma);
  redirect(destinoInterno(textoDoCampo(dados, "voltar")) as Route);
}

// O seletor de idioma de Criar conta já troca a página, antes de a conta existir
export async function trocarIdiomaDaInterface(idioma: string) {
  if (ehIdioma(idioma)) await lembrarIdioma(idioma);
}

const EMAIL_JA_TEM_CONTA = {
  mensagem: m("Esse e-mail já tem conta."),
  link: { href: "/entrar", texto: m("Entre por aqui.") },
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
  const escolhido = textoDoCampo(dados, "idioma");
  const idioma = ehIdioma(escolhido) ? escolhido : IDIOMA_PADRAO;

  const existente = await banco.pesquisador.findUnique({ where: { email: validacao.data.email }, select: { id: true } });
  if (existente) return { envio, erros: { email: EMAIL_JA_TEM_CONTA } };

  let pesquisadorId: string;
  try {
    const criado = await banco.pesquisador.create({
      data: {
        nome: validacao.data.nome,
        email: validacao.data.email,
        senhaHash: await gerarHash(validacao.data.senha),
        idioma,
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
  await lembrarIdioma(idioma);
  redirect("/");
}
