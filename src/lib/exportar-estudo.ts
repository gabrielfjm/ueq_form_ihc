import "server-only";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ehIdioma, IDIOMA_PADRAO, infoIdioma, type CodigoIdioma } from "@/idiomas";
import { valoresDoUeqS } from "@/ueq";
import { banco } from "./banco";
import { slugDoTitulo } from "./csv";
import { decifrarJson } from "./cripto";
import type { Demografia } from "./demografia";
import {
  exportarBrutas,
  exportarRecodificadas,
  exportarRecodificadasUeqS,
  exportarResultados,
  exportarResultadosUeqS,
  linhasDaPlanilhaOficial,
  linhasDaPlanilhaUeqS,
  type ParticipacaoExportada,
} from "./exportacoes";
import { ITENS_UEQ_S, type Instrumento } from "./instrumento";
import { itensDoQuestionario } from "./itens-ueq";
import { hojeEmBrasilia } from "./periodo";
import { PLANILHA_UEQ, PLANILHA_UEQ_S, preencherPlanilhaOficial, type ModeloPlanilha } from "./planilha-oficial";
import { analisarResultados, analisarResultadosUeqS } from "./resultados";

// Os dois últimos são do UEQ-S: num estudo do UEQ completo, vêm dos 8 itens equivalentes (aba UEQ-S dos resultados)
export const TIPOS_EXPORTACAO = [
  "brutas",
  "recodificadas",
  "resultados",
  "planilha-oficial",
  "resultados-ueq-s",
  "planilha-oficial-ueq-s",
] as const;
export type TipoExportacao = (typeof TIPOS_EXPORTACAO)[number];

// Num estudo do UEQ-S não existe a planilha do UEQ completo: os 18 itens que faltam não foram perguntados
export function exportacaoDisponivel(tipo: TipoExportacao, instrumento: Instrumento): boolean {
  return !(instrumento === "UEQ_S" && tipo === "planilha-oficial");
}

const DATA_HORA = new Intl.DateTimeFormat("sv-SE", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "America/Sao_Paulo",
});

// valores: os 26 do UEQ na ordem oficial; com ueqS, os 8 do UEQ-S na ordem e nos lados dele
async function participacoesExportadas(estudoId: string, opcoes: { versaoId?: string; ueqS?: boolean } = {}): Promise<ParticipacaoExportada[]> {
  const [itens, participacoes] = await Promise.all([
    itensDoQuestionario(),
    banco.participacao.findMany({
      where: { versao: { estudoId, ...(opcoes.versaoId ? { id: opcoes.versaoId } : {}) }, concluidaEm: { not: null } },
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
    const valoresUeq = Array<number>(itens.length).fill(0);
    for (const resposta of participacao.respostas) valoresUeq[resposta.item.numero - 1] = resposta.valor;
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
      valores: opcoes.ueqS ? valoresDoUeqS(valoresUeq, ITENS_UEQ_S) : valoresUeq,
    };
  });
}

const ehPlanilha = (tipo: TipoExportacao | "painel") => tipo === "planilha-oficial" || tipo === "planilha-oficial-ueq-s";

// docs/ihc.md §4.4: nome legível e datado, ueq_[slug-do-titulo]_[tipo]_[aaaa-mm-dd].csv. A planilha oficial
// de uma versão só leva o nome da versão depois do tipo
export function nomeDoArquivo(titulo: string, tipo: TipoExportacao | "painel" | "painel-ueq-s", versao?: string): string {
  const extensao = tipo === "painel" || tipo === "painel-ueq-s" ? "pdf" : ehPlanilha(tipo) ? "xlsx" : "csv";
  const daVersao = versao ? `_${slugDoTitulo(versao)}` : "";
  return `ueq_${slugDoTitulo(titulo)}_${tipo}${daVersao}_${hojeEmBrasilia().toISOString().slice(0, 10)}.${extensao}`;
}

// Lido uma vez por servidor: preencherPlanilhaOficial reaproveita a preparação do mesmo arquivo
const modelos = new Map<string, Promise<Uint8Array>>();
function lerModelo(formato: ModeloPlanilha): Promise<Uint8Array> {
  let modelo = modelos.get(formato.arquivo);
  if (!modelo) {
    modelo = readFile(join(process.cwd(), formato.arquivo)).catch((erro: unknown) => {
      modelos.delete(formato.arquivo);
      throw erro;
    });
    modelos.set(formato.arquivo, modelo);
  }
  return modelo;
}

const XLSX = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
export const TIPO_DE_CONTEUDO: Record<TipoExportacao, string> = {
  brutas: "text/csv; charset=utf-8",
  recodificadas: "text/csv; charset=utf-8",
  resultados: "text/csv; charset=utf-8",
  "planilha-oficial": XLSX,
  "resultados-ueq-s": "text/csv; charset=utf-8",
  "planilha-oficial-ueq-s": XLSX,
};

export async function gerarExportacao(
  estudo: { id: string; instrumento: Instrumento; versoes: { id: string; nome: string }[] },
  tipo: TipoExportacao,
  opcoes: { versaoId?: string; idioma?: CodigoIdioma } = {},
): Promise<string | Uint8Array> {
  if (!exportacaoDisponivel(tipo, estudo.instrumento)) throw new Error(`A exportação ${tipo} não existe para o UEQ-S.`);
  const ueqS = estudo.instrumento === "UEQ_S";
  const variasVersoes = estudo.versoes.length > 1;

  if (tipo === "resultados-ueq-s" || (tipo === "resultados" && ueqS)) {
    const resultados = await analisarResultadosUeqS(estudo.id, estudo.versoes);
    return exportarResultadosUeqS([
      ...(variasVersoes ? [{ versao: "Todas as versões", analise: resultados.todas }] : []),
      ...resultados.porVersao.map((versao) => ({ versao: versao.nome, analise: versao.analise })),
    ]);
  }
  if (tipo === "resultados") {
    const resultados = await analisarResultados(estudo.id, estudo.versoes);
    return exportarResultados([
      ...(variasVersoes ? [{ versao: "Todas as versões", analise: resultados.todas }] : []),
      ...resultados.porVersao.map((versao) => ({ versao: versao.nome, analise: versao.analise })),
    ]);
  }
  if (tipo === "planilha-oficial" || tipo === "planilha-oficial-ueq-s") {
    const formato = tipo === "planilha-oficial" ? PLANILHA_UEQ : PLANILHA_UEQ_S;
    const [modelo, participacoes] = await Promise.all([
      lerModelo(formato),
      participacoesExportadas(estudo.id, { versaoId: opcoes.versaoId }),
    ]);
    const linhas = tipo === "planilha-oficial" ? linhasDaPlanilhaOficial(participacoes) : linhasDaPlanilhaUeqS(participacoes, ITENS_UEQ_S);
    return preencherPlanilhaOficial(modelo, linhas, opcoes.idioma ?? IDIOMA_PADRAO, formato);
  }
  const participacoes = await participacoesExportadas(estudo.id, { ueqS });
  if (tipo === "brutas") return exportarBrutas(participacoes, ueqS ? ITENS_UEQ_S.length : 26);
  if (ueqS) return exportarRecodificadasUeqS(participacoes, ITENS_UEQ_S);
  return exportarRecodificadas(participacoes, await itensDoQuestionario());
}
