"use server";

import { banco } from "@/lib/banco";
import { CENARIO_TUTORIAL, criarCenario } from "@/lib/cenarios/cenarios";
import { filtroDeAcesso } from "@/lib/estudos";
import { exigirPesquisador } from "@/lib/sessao";

const MINIMO_RESPOSTAS = 5;

// O tour precisa de um estudo com respostas para mostrar o painel e as suspeitas. Usa o da própria pessoa
// (ou um compartilhado com ela) que tem mais respostas; se nenhum tiver, cria o estudo de exemplo do tour
export async function prepararTour(): Promise<string> {
  const pesquisador = await exigirPesquisador();
  const estudos = await banco.estudo.findMany({
    where: { ...filtroDeAcesso(pesquisador), status: { not: "RASCUNHO" } },
    select: {
      id: true,
      versoes: { select: { _count: { select: { participacoes: { where: { concluidaEm: { not: null } } } } } } },
    },
  });
  const comRespostas = estudos
    .map((estudo) => ({ id: estudo.id, respostas: estudo.versoes.reduce((soma, v) => soma + v._count.participacoes, 0) }))
    .filter((estudo) => estudo.respostas >= MINIMO_RESPOSTAS)
    .sort((a, b) => b.respostas - a.respostas);
  return comRespostas[0]?.id ?? (await criarCenario(CENARIO_TUTORIAL, pesquisador.id));
}

// Terminar, pular ou fechar o tour: ele não abre mais sozinho (dá para rever pela ajuda de qualquer página)
export async function marcarTutorialVisto(): Promise<void> {
  const pesquisador = await exigirPesquisador();
  if (pesquisador.tutorialVistoEm) return;
  await banco.pesquisador.update({ where: { id: pesquisador.id }, data: { tutorialVistoEm: new Date() } });
}
