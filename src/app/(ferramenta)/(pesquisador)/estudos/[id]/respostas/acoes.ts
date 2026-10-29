"use server";

import { revalidatePath } from "next/cache";
import { banco } from "@/lib/banco";
import { estudoDoPesquisador } from "@/lib/estudos";
import { exigirPesquisador } from "@/lib/sessao";
import { formatarDiaHora, plural } from "@/lib/texto";

type Retorno = { sucesso?: string; erro?: string };

function atualizarPaginas(estudoId: string) {
  // docs/ihc.md §4.3: a mudança de inclusão aparece no painel, na visão geral e nas exportações
  revalidatePath(`/estudos/${estudoId}`, "layout");
}

// docs/ueq-protocolo.md, seção 7: excluir da análise só muda incluidaNaAnalise; nada é apagado
export async function alterarInclusao(estudoId: string, participacaoId: string, incluida: boolean): Promise<Retorno> {
  const pesquisador = await exigirPesquisador();
  await estudoDoPesquisador(estudoId, pesquisador.id);

  // O filtro pelo estudo impede alterar a participação de outro estudo trocando o id na chamada
  const participacao = await banco.participacao.findFirst({
    where: { id: participacaoId, versao: { estudoId }, concluidaEm: { not: null } },
    select: { concluidaEm: true },
  });
  if (!participacao?.concluidaEm) return { erro: "Essa participação não está neste estudo. Recarregue a página." };

  await banco.participacao.update({ where: { id: participacaoId }, data: { incluidaNaAnalise: incluida } });
  atualizarPaginas(estudoId);
  const quando = formatarDiaHora(participacao.concluidaEm);
  return {
    sucesso: incluida
      ? `Participação de ${quando} voltou para a análise.`
      : `Participação de ${quando} saiu da análise. Nada foi apagado: marque “Na análise” para incluir de novo.`,
  };
}

export async function tirarSuspeitasDaAnalise(estudoId: string): Promise<Retorno> {
  const pesquisador = await exigirPesquisador();
  await estudoDoPesquisador(estudoId, pesquisador.id);

  const { count } = await banco.participacao.updateMany({
    where: { versao: { estudoId }, concluidaEm: { not: null }, suspeita: true, incluidaNaAnalise: true },
    data: { incluidaNaAnalise: false },
  });
  atualizarPaginas(estudoId);
  if (count === 0) return { sucesso: "Nenhuma participação suspeita estava na análise. Nada mudou." };
  return {
    sucesso: `${plural(count, "participação suspeita saiu", "participações suspeitas saíram")} da análise. Nada foi apagado: marque “Na análise” para incluir de novo.`,
  };
}
