import "server-only";
import { ehIdioma, IDIOMA_PADRAO, infoIdioma } from "@/idiomas";
import { banco } from "./banco";
import { slugDoTitulo } from "./csv";
import type { Demografia } from "./demografia";
import { exportarBrutas, exportarPlanilhaOficial, exportarRecodificadas, exportarResultados, type ParticipacaoExportada } from "./exportacoes";
import { itensDoQuestionario } from "./itens-ueq";
import { hojeEmBrasilia } from "./periodo";
import { analisarResultados } from "./resultados";

export const TIPOS_EXPORTACAO = ["brutas", "recodificadas", "resultados", "planilha-oficial"] as const;
export type TipoExportacao = (typeof TIPOS_EXPORTACAO)[number];

const DATA_HORA = new Intl.DateTimeFormat("sv-SE", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "America/Sao_Paulo",
});

async function participacoesExportadas(estudoId: string): Promise<ParticipacaoExportada[]> {
  const [itens, participacoes] = await Promise.all([
    itensDoQuestionario(),
    banco.participacao.findMany({
      where: { versao: { estudoId }, concluidaEm: { not: null } },
      // Da mais antiga para a mais recente, como numa planilha que vai sendo preenchida
      orderBy: { concluidaEm: "asc" },
      select: {
        id: true,
        concluidaEm: true,
        incluidaNaAnalise: true,
        suspeita: true,
        idioma: true,
        demografia: true,
        versao: { select: { nome: true } },
        respostas: { select: { valor: true, item: { select: { numero: true } } } },
      },
    }),
  ]);
  return participacoes.map((participacao) => {
    const valores = Array<number>(itens.length).fill(0);
    for (const resposta of participacao.respostas) valores[resposta.item.numero - 1] = resposta.valor;
    const idioma = infoIdioma(ehIdioma(participacao.idioma) ? participacao.idioma : IDIOMA_PADRAO);
    return {
      id: participacao.id,
      versao: participacao.versao.nome,
      concluidaEm: participacao.concluidaEm ? DATA_HORA.format(participacao.concluidaEm) : "",
      incluidaNaAnalise: participacao.incluidaNaAnalise,
      suspeita: participacao.suspeita,
      idioma: idioma.codigo,
      traducaoAprovada: idioma.traducaoAprovada,
      demografia: (participacao.demografia ?? null) as Demografia | null,
      valores,
    };
  });
}

// docs/ihc.md §4.4: nome legível e datado, ueq_[slug-do-titulo]_[tipo]_[aaaa-mm-dd].csv
export function nomeDoArquivo(titulo: string, tipo: TipoExportacao): string {
  return `ueq_${slugDoTitulo(titulo)}_${tipo}_${hojeEmBrasilia().toISOString().slice(0, 10)}.csv`;
}

export async function gerarExportacao(
  estudo: { id: string; versoes: { id: string; nome: string }[] },
  tipo: TipoExportacao,
): Promise<string> {
  if (tipo === "resultados") {
    const resultados = await analisarResultados(estudo.id, estudo.versoes);
    return exportarResultados([
      ...(estudo.versoes.length > 1 ? [{ versao: "Todas as versões", analise: resultados.todas }] : []),
      ...resultados.porVersao.map((versao) => ({ versao: versao.nome, analise: versao.analise })),
    ]);
  }
  const participacoes = await participacoesExportadas(estudo.id);
  if (tipo === "brutas") return exportarBrutas(participacoes);
  if (tipo === "planilha-oficial") return exportarPlanilhaOficial(participacoes);
  return exportarRecodificadas(participacoes, await itensDoQuestionario());
}
