"use server";

import { revalidatePath } from "next/cache";
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

export type CampoNovaConta = "nome" | "email" | "senha";

const dadosNovaConta = z.object({ nome, email, senha: senhaNova });

// O administrador cria a conta de quem vai testar a ferramenta e passa a senha para a pessoa,
// que pode trocá-la depois em Minha conta
export async function criarConta(
  anterior: EstadoFormulario<CampoNovaConta>,
  dados: FormData,
): Promise<EstadoFormulario<CampoNovaConta>> {
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
      return { envio, erros: { email: { mensagem: "Esse e-mail já tem conta." } } };
    }
    throw erro;
  }
  revalidatePath("/administracao");
  return { envio, sucesso: `Conta de ${validacao.data.nome} criada. Passe o e-mail e a senha para a pessoa.` };
}

export async function alternarAdministrador(pesquisadorId: string): Promise<{ sucesso?: string; erro?: string }> {
  const quem = await exigirAdministrador();
  // Sem isto o último administrador poderia se rebaixar e ninguém mais entraria aqui
  if (pesquisadorId === quem.id) return { erro: "Você não pode tirar o seu próprio acesso de administrador." };
  const alvo = await banco.pesquisador.findUnique({ where: { id: pesquisadorId }, select: { nome: true, administrador: true } });
  if (!alvo) return { erro: "Essa conta não existe mais. Recarregue a página." };
  await banco.pesquisador.update({ where: { id: pesquisadorId }, data: { administrador: !alvo.administrador } });
  revalidatePath("/administracao");
  return { sucesso: alvo.administrador ? `${alvo.nome} não é mais administrador.` : `${alvo.nome} agora é administrador.` };
}

export type CampoCenarios = "dono" | "colaboradores";

// Cria os três estudos de demonstração com o dono escolhido e os compartilha com as contas marcadas
export async function criarCenarios(
  anterior: EstadoFormulario<CampoCenarios>,
  dados: FormData,
): Promise<EstadoFormulario<CampoCenarios>> {
  await exigirAdministrador();
  const envio = anterior.envio + 1;
  const donoId = textoDoCampo(dados, "dono");
  const colaboradores = dados.getAll("colaboradores").filter((id): id is string => typeof id === "string" && id !== donoId);
  const papel = textoDoCampo(dados, "papel") === "LEITOR" ? "LEITOR" : "EDITOR";
  const pendentes = textoDoCampo(dados, "convites") === "PENDENTE";

  const contas = await banco.pesquisador.findMany({ where: { id: { in: [donoId, ...colaboradores] } }, select: { id: true } });
  if (!contas.some((conta) => conta.id === donoId)) {
    return { envio, erros: { dono: { mensagem: "Escolha a conta que vai ser dona dos estudos." } } };
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
          texto: `${colaboracao.convidadoPor?.nome ?? "A equipe"} convidou você para o estudo “${colaboracao.estudo.titulo}” como ${papel === "EDITOR" ? "editor" : "leitor"}.`,
          link: "/notificacoes",
          estudoId: colaboracao.estudoId,
          colaboracaoId: colaboracao.id,
        });
      }
    }
  }
  revalidatePath("/administracao");
  return {
    envio,
    sucesso: `${plural(estudos.length, "estudo de demonstração criado", "estudos de demonstração criados")}${
      validos.length > 0 ? `, compartilhados com ${plural(validos.length, "conta", "contas")}` : ""
    }.`,
  };
}
