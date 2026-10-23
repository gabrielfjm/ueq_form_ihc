import "server-only";
import { randomInt } from "node:crypto";
import { notFound } from "next/navigation";
import { banco } from "./banco";

// Sem 0/o, 1/l/i: o link pode ser ditado ou copiado à mão
const ALFABETO_SLUG = "abcdefghjkmnpqrstuvwxyz23456789";
const TAMANHO_SLUG = 6;

// Curto e não sequencial: quem tem um link não adivinha o de outro estudo
export async function gerarSlugPublico(): Promise<string> {
  for (let tentativa = 0; tentativa < 10; tentativa++) {
    const slug = Array.from({ length: TAMANHO_SLUG }, () => ALFABETO_SLUG[randomInt(ALFABETO_SLUG.length)]).join("");
    const existente = await banco.estudo.findUnique({ where: { slugPublico: slug }, select: { id: true } });
    if (!existente) return slug;
  }
  throw new Error("Não foi possível gerar um link público livre depois de 10 tentativas.");
}

// Toda leitura e alteração de estudo passa por aqui: o filtro por pesquisadorId é o que
// impede um pesquisador de ver ou mexer no estudo de outro só trocando o id na URL
export async function estudoDoPesquisador(estudoId: string, pesquisadorId: string) {
  const estudo = await banco.estudo.findFirst({
    where: { id: estudoId, pesquisadorId },
    include: {
      versoes: {
        orderBy: { ordem: "asc" },
        include: { _count: { select: { participacoes: { where: { concluidaEm: { not: null } } } } } },
      },
    },
  });
  if (!estudo) notFound();
  return estudo;
}

export async function contagemDeRespostas(estudoId: string) {
  const concluidas = { versao: { estudoId }, concluidaEm: { not: null } };
  const [total, suspeitas, foraDaAnalise, ultima] = await Promise.all([
    banco.participacao.count({ where: concluidas }),
    banco.participacao.count({ where: { ...concluidas, suspeita: true } }),
    banco.participacao.count({ where: { ...concluidas, incluidaNaAnalise: false } }),
    banco.participacao.findFirst({ where: concluidas, orderBy: { concluidaEm: "desc" }, select: { concluidaEm: true } }),
  ]);
  return { total, suspeitas, naAnalise: total - foraDaAnalise, ultima: ultima?.concluidaEm ?? null };
}
