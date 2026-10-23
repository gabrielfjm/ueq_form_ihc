"use server";

import type { Route } from "next";
import { redirect } from "next/navigation";
import protocolo from "../../../../data/protocolo.json";
import { versaoComMenosRespostas } from "@/lib/balanceamento";
import { banco } from "@/lib/banco";
import { lerDemografia } from "@/lib/demografia";
import { itensDoQuestionario } from "@/lib/itens-ueq";
import {
  esquecerParticipacao,
  estudoPublico,
  guardarParticipacao,
  marcarRespondido,
  participacaoAtual,
} from "@/lib/participacao";
import { avaliarSuspeita } from "@/ueq";

const rota = (slug: string, etapa = "") => `/r/${slug}${etapa}` as Route;

// Só aqui nasce a Participacao: antes de concordar, nada sobre a pessoa é gravado (docs/ihc.md §3.7)
export async function consentir(slug: string): Promise<void> {
  const estudo = await estudoPublico(slug);
  if (estudo.status !== "ABERTO") redirect(rota(slug));

  const atual = await participacaoAtual(estudo.id);
  if (atual && !atual.concluidaEm) redirect(rota(slug, "/questionario"));

  const versao = versaoComMenosRespostas(
    estudo.versoes.map((v) => ({ id: v.id, ordem: v.ordem, respostas: v._count.participacoes })),
  );
  if (!versao) redirect(rota(slug));

  const participacao = await banco.participacao.create({
    data: { versaoId: versao.id, consentiuEm: new Date() },
    select: { id: true },
  });
  await guardarParticipacao(slug, participacao.id);
  redirect(rota(slug, "/questionario"));
}

export type ResultadoEnvio = { faltando?: number[]; erro?: string };

export async function enviarRespostas(slug: string, valores: Record<number, number>): Promise<ResultadoEnvio> {
  const estudo = await estudoPublico(slug);
  if (estudo.status !== "ABERTO") {
    return { erro: "A coleta deste estudo foi encerrada enquanto você respondia. Suas respostas não foram gravadas." };
  }
  const participacao = await participacaoAtual(estudo.id);
  if (!participacao) return { erro: "Não encontramos sua participação. Abra o link do estudo de novo para recomeçar." };
  if (participacao.concluidaEm) redirect(rota(slug, "/sobre-voce"));

  const itens = await itensDoQuestionario();
  const valorValido = (numero: number) => {
    const valor = valores[numero];
    return typeof valor === "number" && Number.isInteger(valor) && valor >= 1 && valor <= 7;
  };
  // A validação do navegador é conforto; a regra vale aqui (docs/ihc.md §4.1)
  const faltando = itens.filter((item) => !valorValido(item.numero)).map((item) => item.numero);
  if (faltando.length > 0) return { faltando };

  const respostas = itens.map((item) => valores[item.numero] ?? 0);
  const { suspeita } = avaliarSuspeita(respostas, itens, protocolo.inconsistencia);

  // As 26 respostas e a conclusão entram juntas; se algo falhar, nada fica pela metade
  await banco.$transaction([
    banco.resposta.createMany({
      data: itens.map((item) => ({ participacaoId: participacao.id, itemId: item.id, valor: valores[item.numero] ?? 0 })),
    }),
    banco.participacao.update({ where: { id: participacao.id }, data: { concluidaEm: new Date(), suspeita } }),
  ]);
  await marcarRespondido(slug);
  redirect(rota(slug, "/sobre-voce"));
}

export async function salvarDemografia(slug: string, dados: FormData): Promise<void> {
  const estudo = await estudoPublico(slug);
  const participacao = await participacaoAtual(estudo.id);
  if (participacao?.concluidaEm && dados.get("acao") === "continuar") {
    const demografia = lerDemografia(dados);
    if (Object.keys(demografia).length > 0) {
      await banco.participacao.update({ where: { id: participacao.id }, data: { demografia } });
    }
  }
  await esquecerParticipacao(slug);
  redirect(rota(slug, "/fim"));
}

// Desistir apaga a participação incompleta: nenhuma resposta tinha sido gravada (docs/ihc.md §3.7)
export async function desistir(slug: string): Promise<void> {
  const estudo = await estudoPublico(slug);
  const participacao = await participacaoAtual(estudo.id);
  if (participacao && !participacao.concluidaEm) {
    await banco.participacao.delete({ where: { id: participacao.id } });
  }
  await esquecerParticipacao(slug);
  redirect(rota(slug, "/saiu"));
}
