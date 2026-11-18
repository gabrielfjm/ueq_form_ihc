import "server-only";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ehIdioma, IDIOMA_PADRAO, infoIdioma, type CodigoIdioma } from "@/idiomas";
import { banco } from "./banco";
import { slugDoTitulo } from "./csv";
import { decifrarJson } from "./cripto";
import type { Demografia } from "./demografia";
import { exportarBrutas, exportarRecodificadas, exportarResultados, linhasDaPlanilhaOficial, type ParticipacaoExportada } from "./exportacoes";
import { itensDoQuestionario } from "./itens-ueq";
import { hojeEmBrasilia } from "./periodo";
import { ARQUIVO_MODELO, preencherPlanilhaOficial } from "./planilha-oficial";
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

async function participacoesExportadas(estudoId: string, versaoId?: string): Promise<ParticipacaoExportada[]> {
  const [itens, participacoes] = await Promise.all([
    itensDoQuestionario(),
    banco.participacao.findMany({
      where: { versao: { estudoId, ...(versaoId ? { id: versaoId } : {}) }, concluidaEm: { not: null } },
      // Da mais antiga para a mais recente, como numa planilha que vai sendo preenchida
      orderBy: { concluidaEm: "asc" },
      select: {
        id: true,
        concluidaEm: true,
        incluidaNaAnalise: true,
        suspeita: true,
        idioma: true,
        origem: true,
        menorDeIdade: true,
        demografia: true,
        versao: { select: { nome: true } },
        respostas: { select: { valor: true, item: { select: { numero: true } } } },
      },
    }),
  ]);
  return participacoes.map((participacao) => {
    const valores = Array<number>(itens.length).fill(0);
    for (const resposta of participacao.respostas) valores[resposta.item.numero - 1] = resposta.valor;
    const importada = participacao.origem === "IMPORTADA";
    const idioma = importada ? null : infoIdioma(ehIdioma(participacao.idioma) ? participacao.idioma : IDIOMA_PADRAO);
    return {
      id: participacao.id,
      versao: participacao.versao.nome,
      concluidaEm: participacao.concluidaEm ? DATA_HORA.format(participacao.concluidaEm) : "",
      incluidaNaAnalise: participacao.incluidaNaAnalise,
      suspeita: participacao.suspeita,
      origem: importada ? "importada" : "link",
      idioma: idioma?.codigo ?? null,
      traducaoAprovada: idioma?.traducaoAprovada ?? null,
      menorDeIdade: importada ? null : participacao.menorDeIdade,
      demografia: decifrarJson<Demografia>(participacao.demografia),
      valores,
    };
  });
}

// docs/ihc.md §4.4: nome legível e datado, ueq_[slug-do-titulo]_[tipo]_[aaaa-mm-dd].csv. A planilha oficial
// de uma versão só leva o nome da versão depois do tipo
export function nomeDoArquivo(titulo: string, tipo: TipoExportacao | "painel", versao?: string): string {
  const extensao = tipo === "painel" ? "pdf" : tipo === "planilha-oficial" ? "xlsx" : "csv";
  const daVersao = versao ? `_${slugDoTitulo(versao)}` : "";
  return `ueq_${slugDoTitulo(titulo)}_${tipo}${daVersao}_${hojeEmBrasilia().toISOString().slice(0, 10)}.${extensao}`;
}

// Lido uma vez por servidor: preencherPlanilhaOficial reaproveita a preparação do mesmo arquivo
let modeloDaPlanilha: Promise<Uint8Array> | undefined;
function lerModeloDaPlanilha(): Promise<Uint8Array> {
  modeloDaPlanilha ??= readFile(join(process.cwd(), ARQUIVO_MODELO)).catch((erro: unknown) => {
    modeloDaPlanilha = undefined;
    throw erro;
  });
  return modeloDaPlanilha;
}

export const TIPO_DE_CONTEUDO: Record<TipoExportacao, string> = {
  brutas: "text/csv; charset=utf-8",
  recodificadas: "text/csv; charset=utf-8",
  resultados: "text/csv; charset=utf-8",
  "planilha-oficial": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
};

export async function gerarExportacao(
  estudo: { id: string; versoes: { id: string; nome: string }[] },
  tipo: TipoExportacao,
  opcoes: { versaoId?: string; idioma?: CodigoIdioma } = {},
): Promise<string | Uint8Array> {
  if (tipo === "resultados") {
    const resultados = await analisarResultados(estudo.id, estudo.versoes);
    return exportarResultados([
      ...(estudo.versoes.length > 1 ? [{ versao: "Todas as versões", analise: resultados.todas }] : []),
      ...resultados.porVersao.map((versao) => ({ versao: versao.nome, analise: versao.analise })),
    ]);
  }
  if (tipo === "planilha-oficial") {
    const [modelo, participacoes] = await Promise.all([
      lerModeloDaPlanilha(),
      participacoesExportadas(estudo.id, opcoes.versaoId),
    ]);
    return preencherPlanilhaOficial(modelo, linhasDaPlanilhaOficial(participacoes), opcoes.idioma ?? IDIOMA_PADRAO);
  }
  const participacoes = await participacoesExportadas(estudo.id);
  if (tipo === "brutas") return exportarBrutas(participacoes);
  return exportarRecodificadas(participacoes, await itensDoQuestionario());
}
