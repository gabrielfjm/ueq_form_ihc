"use server";

import { revalidatePath } from "next/cache";
import type { Route } from "next";
import { redirect } from "next/navigation";
import { z } from "zod";
import { Prisma } from "@/generated/prisma/client";
import { exigirAdministrador } from "@/lib/administracao";
import { banco } from "@/lib/banco";
import { CENARIOS_DEMONSTRACAO, criarCenario } from "@/lib/cenarios/cenarios";
import { errosPorCampo, textoDoCampo, type EstadoFormulario } from "@/lib/formulario";
import { notificar } from "@/lib/notificacoes";
import { plural } from "@/lib/texto";
import { gerarHash } from "@/lib/senhas";
import { email, nome, senhaNova } from "@/lib/validacao-conta";
import { ehIdioma } from "@/idiomas";
import { completarCatalogo, tradutor } from "@/traducao/servidor";

export type CampoNovaConta = "nome" | "email" | "senha";

const dadosNovaConta = z.object({ nome, email, senha: senhaNova });

// O administrador cria a conta de quem vai testar a ferramenta e passa a senha para a pessoa,
// que pode trocá-la depois em Minha conta
export async function criarConta(
  anterior: EstadoFormulario<CampoNovaConta>,
  dados: FormData,
): Promise<EstadoFormulario<CampoNovaConta>> {
  const t = await tradutor();
  await exigirAdministrador();
  const envio = anterior.envio + 1;
  const validacao = dadosNovaConta.safeParse({
    nome: textoDoCampo(dados, "nome"),
    email: textoDoCampo(dados, "email"),
    senha: textoDoCampo(dados, "senha"),
  });
  if (!validacao.success) return { envio, erros: errosPorCampo(validacao.error) };

  try {
    await banco.pesquisador.create({
      data: {
        nome: validacao.data.nome,
        email: validacao.data.email,
        senhaHash: await gerarHash(validacao.data.senha),
      },
    });
  } catch (erro) {
    if (erro instanceof Prisma.PrismaClientKnownRequestError && erro.code === "P2002") {
      return { envio, erros: { email: { mensagem: t("Esse e-mail já tem conta.") } } };
    }
    throw erro;
  }
  revalidatePath("/administracao", "layout");
  return { envio, sucesso: t("Conta de {nome} criada. Passe o e-mail e a senha para a pessoa.", { nome: validacao.data.nome }) };
}

export async function alternarAdministrador(pesquisadorId: string): Promise<{ sucesso?: string; erro?: string }> {
  const t = await tradutor();
  const quem = await exigirAdministrador();
  // Sem isto o último administrador poderia se rebaixar e ninguém mais entraria aqui
  if (pesquisadorId === quem.id) return { erro: t("Você não pode tirar o seu próprio acesso de administrador.") };
  const alvo = await banco.pesquisador.findUnique({ where: { id: pesquisadorId }, select: { nome: true, administrador: true } });
  if (!alvo) return { erro: t("Essa conta não existe mais. Recarregue a página.") };
  await banco.pesquisador.update({ where: { id: pesquisadorId }, data: { administrador: !alvo.administrador } });
  revalidatePath("/administracao", "layout");
  return { sucesso: alvo.administrador ? t("{nome} não é mais administrador.", { nome: alvo.nome }) : t("{nome} agora é administrador.", { nome: alvo.nome }) };
}

export type CampoCenarios = "dono" | "colaboradores";

// Cria os três estudos de demonstração com o dono escolhido e os compartilha com as contas marcadas
export async function criarCenarios(
  anterior: EstadoFormulario<CampoCenarios>,
  dados: FormData,
): Promise<EstadoFormulario<CampoCenarios>> {
  const t = await tradutor();
  await exigirAdministrador();
  const envio = anterior.envio + 1;
  const donoId = textoDoCampo(dados, "dono");
  const colaboradores = dados.getAll("colaboradores").filter((id): id is string => typeof id === "string" && id !== donoId);
  const papel = textoDoCampo(dados, "papel") === "LEITOR" ? "LEITOR" : "EDITOR";
  const pendentes = textoDoCampo(dados, "convites") === "PENDENTE";

  const contas = await banco.pesquisador.findMany({ where: { id: { in: [donoId, ...colaboradores] } }, select: { id: true } });
  if (!contas.some((conta) => conta.id === donoId)) {
    return { envio, erros: { dono: { mensagem: t("Escolha a conta que vai ser dona dos estudos.") } } };
  }
  const validos = colaboradores.filter((id) => contas.some((conta) => conta.id === id));

  const estudos: string[] = [];
  for (const cenario of CENARIOS_DEMONSTRACAO) estudos.push(await criarCenario(cenario, donoId));
  if (validos.length > 0) {
    const colaboracoes = await banco.colaboracao.createManyAndReturn({
      data: estudos.flatMap((estudoId) =>
        validos.map((pesquisadorId) => ({
          estudoId,
          pesquisadorId,
          convidadoPorId: donoId,
          papel,
          status: pendentes ? ("PENDENTE" as const) : ("ACEITO" as const),
          respondidoEm: pendentes ? null : new Date(),
        })),
      ),
      include: { estudo: { select: { titulo: true } }, convidadoPor: { select: { nome: true } } },
    });
    // Convites pendentes chegam como chegariam pelo Compartilhar: no sino, com Aceitar e Recusar
    if (pendentes) {
      for (const colaboracao of colaboracoes) {
        await notificar([colaboracao.pesquisadorId], donoId, {
          tipo: "CONVITE",
          texto: (t) => {
            const valores = { nome: colaboracao.convidadoPor?.nome ?? t("A equipe"), titulo: colaboracao.estudo.titulo };
            return papel === "EDITOR"
              ? t("{nome} convidou você para o estudo “{titulo}” como editor.", valores)
              : t("{nome} convidou você para o estudo “{titulo}” como leitor.", valores);
          },
          link: "/notificacoes",
          estudoId: colaboracao.estudoId,
          colaboracaoId: colaboracao.id,
        });
      }
    }
  }
  revalidatePath("/administracao", "layout");
  return {
    envio,
    sucesso: `${plural(estudos.length, t("estudo de demonstração criado"), t("estudos de demonstração criados"))}${
      validos.length > 0 ? t(", compartilhados com {quantidade}", { quantidade: plural(validos.length, "conta", "contas") }) : ""
    }.`,
  };
}

// Adianta a tradução da interface para um idioma (Administração › Idiomas); sem o botão, ela acontece na
// primeira visita de quem usa o idioma. O que não couber no tempo da função fica para a próxima vez
export async function traduzirInterface(idioma: string): Promise<void> {
  await exigirAdministrador();
  if (!ehIdioma(idioma)) redirect("/administracao/idiomas");
  await completarCatalogo(idioma, 270_000);
  revalidatePath("/", "layout");
  redirect(`/administracao/idiomas?traduzido=${idioma}` as Route);
}
