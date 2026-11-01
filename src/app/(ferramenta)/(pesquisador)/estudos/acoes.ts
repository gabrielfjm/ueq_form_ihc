"use server";

import type { Route } from "next";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { banco } from "@/lib/banco";
import { estudoDoPesquisador, gerarSlugPublico } from "@/lib/estudos";
import { errosPorCampo, textoDoCampo, type EstadoFormulario } from "@/lib/formulario";
import { diaDoCampo } from "@/lib/periodo";
import { exigirPesquisador } from "@/lib/sessao";
import { AVISOS_DE_STATUS } from "@/lib/status-estudo";
import { lerFormularioEstudo, type CampoEstudo } from "@/lib/validacao-estudo";
import { equipeDoEstudo, notificar, notificarAlteracao } from "@/lib/notificacoes";

export async function criarEstudo(
  anterior: EstadoFormulario<CampoEstudo>,
  dados: FormData,
): Promise<EstadoFormulario<CampoEstudo>> {
  const pesquisador = await exigirPesquisador();
  const envio = anterior.envio + 1;
  const validacao = lerFormularioEstudo(dados);
  if (!validacao.success) return { envio, erros: errosPorCampo(validacao.error) };

  const { versoes, dataInicio, dataFim, ...estudo } = validacao.data;
  const criado = await banco.estudo.create({
    data: {
      ...estudo,
      pesquisadorId: pesquisador.id,
      dataInicio: diaDoCampo(dataInicio),
      dataFim: diaDoCampo(dataFim),
      slugPublico: await gerarSlugPublico(),
      versoes: { create: versoes.map((versao, posicao) => ({ nome: versao.nome, ordem: posicao + 1 })) },
    },
    select: { id: true },
  });
  redirect(`/estudos/${criado.id}?aviso=criado` as Route);
}

export async function salvarEstudo(
  estudoId: string,
  anterior: EstadoFormulario<CampoEstudo>,
  dados: FormData,
): Promise<EstadoFormulario<CampoEstudo>> {
  const pesquisador = await exigirPesquisador();
  const atual = await estudoDoPesquisador(estudoId, pesquisador, "editar");
  const envio = anterior.envio + 1;
  const validacao = lerFormularioEstudo(dados);
  if (!validacao.success) return { envio, erros: errosPorCampo(validacao.error) };

  const { versoes, dataInicio, dataFim, ...estudo } = validacao.data;
  const mantidas = new Set(versoes.map((versao) => versao.id).filter(Boolean));
  const removidas = atual.versoes.filter((versao) => !mantidas.has(versao.id));

  // prompts/04-estudos.md: versão que já tem respostas não pode sair (o formulário já esconde o botão)
  const comRespostas = removidas.find((versao) => versao._count.participacoes > 0);
  if (comRespostas) {
    return { envio, erroGeral: `A versão "${comRespostas.nome}" já tem respostas e não pode ser removida.` };
  }
  const idsDoEstudo = new Set(atual.versoes.map((versao) => versao.id));
  if ([...mantidas].some((id) => !idsDoEstudo.has(id))) {
    return { envio, erroGeral: "Uma das versões não é deste estudo. Recarregue a página e tente de novo." };
  }

  await banco.$transaction([
    banco.versao.deleteMany({ where: { id: { in: removidas.map((versao) => versao.id) } } }),
    // ordem é única por estudo: move tudo para negativo antes de renumerar, para não colidir no meio
    banco.versao.updateMany({ where: { estudoId }, data: { ordem: { multiply: -1 } } }),
    ...versoes.map((versao, posicao) =>
      versao.id
        ? banco.versao.update({ where: { id: versao.id }, data: { nome: versao.nome, ordem: posicao + 1 } })
        : banco.versao.create({ data: { estudoId, nome: versao.nome, ordem: posicao + 1 } }),
    ),
    banco.estudo.update({
      where: { id: estudoId },
      data: { ...estudo, dataInicio: diaDoCampo(dataInicio), dataFim: diaDoCampo(dataFim) },
    }),
  ]);
  await notificarAlteracao(estudoId, pesquisador, (titulo) => `editou os dados de “${titulo}”.`);
  redirect(`/estudos/${estudoId}?aviso=salvo` as Route);
}

const TRANSICOES = {
  abrir: { de: ["RASCUNHO"], para: "ABERTO", aviso: AVISOS_DE_STATUS.ABERTO, verbo: "abriu" },
  encerrar: { de: ["ABERTO"], para: "ENCERRADO", aviso: AVISOS_DE_STATUS.ENCERRADO, verbo: "encerrou" },
  reabrir: { de: ["ENCERRADO"], para: "ABERTO", aviso: AVISOS_DE_STATUS.REABERTO, verbo: "reabriu" },
} as const;

export async function alterarColeta(
  estudoId: string,
  acao: keyof typeof TRANSICOES,
): Promise<{ sucesso?: string; erro?: string }> {
  const pesquisador = await exigirPesquisador();
  const estudo = await estudoDoPesquisador(estudoId, pesquisador, "editar");
  const transicao = TRANSICOES[acao];
  if (!(transicao.de as readonly string[]).includes(estudo.status)) {
    return { erro: "O estado do estudo mudou em outra aba. Recarregue a página para ver o atual." };
  }
  await banco.estudo.update({ where: { id: estudoId }, data: { status: transicao.para } });
  await notificarAlteracao(estudoId, pesquisador, (titulo) => `${transicao.verbo} a coleta de “${titulo}”.`);
  revalidatePath(`/estudos/${estudoId}`);
  return { sucesso: transicao.aviso };
}

export async function excluirEstudo(
  estudoId: string,
  anterior: EstadoFormulario<"confirmacao">,
  dados: FormData,
): Promise<EstadoFormulario<"confirmacao">> {
  const pesquisador = await exigirPesquisador();
  const estudo = await estudoDoPesquisador(estudoId, pesquisador, "gerenciar");
  const envio = anterior.envio + 1;
  const confirmacao = textoDoCampo(dados, "confirmacao").trim().toLowerCase();

  if (!confirmacao) return { envio, erros: { confirmacao: { mensagem: "Digite o título do estudo para confirmar." } } };
  if (confirmacao !== estudo.titulo.trim().toLowerCase()) {
    return { envio, erros: { confirmacao: { mensagem: "O texto não é igual ao título do estudo. Nada foi excluído." } } };
  }

  // Avisa a equipe antes de apagar: depois a notificação fica sem estudo, só com o texto
  const equipe = await equipeDoEstudo(estudoId);
  if (equipe) {
    await notificar(equipe.ids, pesquisador.id, {
      tipo: "ALTERACAO",
      texto: `${pesquisador.nome} excluiu o estudo “${equipe.titulo}”, com as versões e as respostas.`,
      link: "/estudos",
    });
  }
  // Cascata do schema: versões, participações e respostas vão junto
  await banco.estudo.delete({ where: { id: estudoId } });
  redirect("/estudos?aviso=excluido");
}
