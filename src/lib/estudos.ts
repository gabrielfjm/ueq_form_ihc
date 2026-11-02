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

export type AcessoEstudo = "dono" | "editor" | "leitor";
// ver: abrir o estudo, o painel, as respostas e exportar. editar: dados, coleta, respostas e importação.
// gerenciar: excluir o estudo e convidar ou remover pessoas
export type ExigenciaEstudo = "ver" | "editar" | "gerenciar";

export const PERMISSOES: Record<AcessoEstudo, Record<ExigenciaEstudo, boolean>> = {
  dono: { ver: true, editar: true, gerenciar: true },
  editor: { ver: true, editar: true, gerenciar: false },
  leitor: { ver: true, editar: false, gerenciar: false },
};

type QuemAcessa = { id: string };

// Estudos que a pessoa vê: os dela e os compartilhados com ela (convite aceito). Nem o administrador
// vê estudos de outras pessoas: as respostas são dados de pesquisa de quem conduz o estudo (LGPD)
export function filtroDeAcesso(quem: QuemAcessa) {
  return {
    OR: [
      { pesquisadorId: quem.id },
      { colaboracoes: { some: { pesquisadorId: quem.id, status: "ACEITO" as const } } },
    ],
  };
}

// Toda leitura e alteração de estudo passa por aqui: o filtro de acesso é o que impede um pesquisador
// de ver ou mexer no estudo de outro só trocando o id na URL. Sem a permissão pedida, a resposta é a
// mesma de um estudo que não existe (404), para não revelar que ele existe
export async function estudoDoPesquisador(estudoId: string, quem: QuemAcessa, exigencia: ExigenciaEstudo = "ver") {
  const estudo = await banco.estudo.findFirst({
    where: { id: estudoId, ...filtroDeAcesso(quem) },
    include: {
      versoes: {
        orderBy: { ordem: "asc" },
        include: { _count: { select: { participacoes: { where: { concluidaEm: { not: null } } } } } },
      },
      pesquisador: { select: { nome: true, email: true } },
      colaboracoes: { where: { pesquisadorId: quem.id, status: "ACEITO" }, select: { papel: true } },
    },
  });
  if (!estudo) notFound();
  const { colaboracoes, ...dados } = estudo;
  const papel = colaboracoes[0]?.papel;
  const acesso: AcessoEstudo = estudo.pesquisadorId === quem.id ? "dono" : papel === "EDITOR" ? "editor" : "leitor";
  if (!PERMISSOES[acesso][exigencia]) notFound();
  return { ...dados, acesso, permissoes: PERMISSOES[acesso] };
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
