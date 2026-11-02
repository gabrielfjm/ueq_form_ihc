"use server";

import type { Route } from "next";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { banco } from "@/lib/banco";
import { estudoDoPesquisador } from "@/lib/estudos";
import { notificarAlteracao } from "@/lib/notificacoes";
import { plural } from "@/lib/texto";
import { LIMITE_BYTES, lerCsvDeRespostas, type ErroImportacao } from "@/lib/importacao";
import { itensDoQuestionario } from "@/lib/itens-ueq";
import { PARAMETROS_SUSPEITA } from "@/lib/participacoes";
import { exigirPesquisador } from "@/lib/sessao";
import { avaliarSuspeita } from "@/ueq";
import { tradutor } from "@/traducao/servidor";

export type Previa = {
  versaoId: string;
  versaoNome: string;
  arquivo: string;
  // O conteúdo volta na confirmação e é lido de novo no servidor: nada da prévia é confiado
  texto: string;
  total: number;
  primeiras: { linha: number; valores: number[] }[];
  erros: ErroImportacao[];
};

// O erro vem com o campo a que se refere, para o resumo de erros levar até ele
export type ResultadoPrevia = { previa?: Previa; erro?: { campo: "versao" | "arquivo"; mensagem: string } };

async function versaoDoEstudo(estudoId: string, versaoId: unknown) {
  const pesquisador = await exigirPesquisador();
  const estudo = await estudoDoPesquisador(estudoId, pesquisador, "editar");
  // Com uma versão só não há o que escolher; com várias, a versão tem que ser deste estudo
  const versao = estudo.versoes.length === 1 ? estudo.versoes[0] : estudo.versoes.find((v) => v.id === versaoId);
  return versao ?? null;
}

// Passo 1: lê o arquivo e devolve a prévia das 5 primeiras linhas e os erros, sem gravar nada
export async function previsualizarImportacao(estudoId: string, dados: FormData): Promise<ResultadoPrevia> {
  const t = await tradutor();
  const versao = await versaoDoEstudo(estudoId, dados.get("versao"));
  if (!versao) return { erro: { campo: "versao", mensagem: t("Escolha a versão que essas respostas avaliaram.") } };

  const arquivo = dados.get("arquivo");
  if (!(arquivo instanceof File) || arquivo.size === 0) return { erro: { campo: "arquivo", mensagem: t("Escolha um arquivo CSV com as respostas.") } };
  if (!/\.(csv|txt)$/i.test(arquivo.name)) {
    return { erro: { campo: "arquivo", mensagem: t("“{name}” não é um CSV. Salve a planilha como CSV e envie de novo.", { name: arquivo.name }) } };
  }
  if (arquivo.size > LIMITE_BYTES) {
    return { erro: { campo: "arquivo", mensagem: t("O arquivo tem mais de {v} KB. Divida em arquivos menores.", { v: LIMITE_BYTES / 1000 }) } };
  }

  const texto = await arquivo.text();
  const { linhas, erros } = lerCsvDeRespostas(texto);
  if (linhas.length === 0 && erros.length === 0) return { erro: { campo: "arquivo", mensagem: t("O arquivo não tem nenhuma linha de respostas.") } };
  return {
    previa: {
      versaoId: versao.id,
      versaoNome: versao.nome,
      arquivo: arquivo.name,
      texto,
      total: linhas.length,
      primeiras: linhas.slice(0, 5),
      erros,
    },
  };
}

// Passo 2: grava. Só com o arquivo inteiro válido: importar parte esconderia linhas da análise sem a pessoa ver
export async function confirmarImportacao(estudoId: string, versaoId: string, texto: string): Promise<{ erro?: string }> {
  const t = await tradutor();
  const versao = await versaoDoEstudo(estudoId, versaoId);
  if (!versao) return { erro: t("Essa versão não está neste estudo. Recarregue a página.") };
  const { linhas, erros } = lerCsvDeRespostas(texto);
  if (erros.length > 0 || linhas.length === 0) return { erro: t("O arquivo tem erros. Corrija e envie de novo.") };

  const itens = await itensDoQuestionario();
  const agora = new Date();
  // Tudo numa transação: ou entram todas as linhas, ou nenhuma
  await banco.$transaction(
    linhas.map(({ valores }) =>
      banco.participacao.create({
        data: {
          versaoId: versao.id,
          consentiuEm: agora,
          concluidaEm: agora,
          origem: "IMPORTADA",
          idioma: null,
          // A mesma regra de suspeita das respostas pelo link (docs/ueq-protocolo.md, seção 7)
          suspeita: avaliarSuspeita(valores, itens, PARAMETROS_SUSPEITA).suspeita,
          respostas: {
            createMany: { data: itens.map((item) => ({ itemId: item.id, valor: valores[item.numero - 1] ?? 0 })) },
          },
        },
        select: { id: true },
      }),
    ),
  );
  await notificarAlteracao(
    estudoId,
    await exigirPesquisador(),
    (titulo, t) =>
      t("importou {quantidade} de um CSV em “{titulo}”.", { quantidade: plural(linhas.length, t("resposta"), t("respostas")), titulo }),
    `/estudos/${estudoId}/respostas`,
  );
  revalidatePath(`/estudos/${estudoId}`, "layout");
  redirect(`/estudos/${estudoId}/respostas?importadas=${linhas.length}` as Route);
}
