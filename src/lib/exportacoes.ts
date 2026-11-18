import { recodificar, recodificarParticipante, valoresDoUeqS, type AnaliseEstudo, type AnaliseUeqS, type ItemUEQ, type ItemUeqS } from "@/ueq";
import { decimalCsv, documentoCsv, type ValorCsv } from "./csv";
import type { Demografia } from "./demografia";
import { NOME_BENCHMARK, NOME_ESCALA, NOME_ESCALA_UEQ_S } from "./nomes-ueq";

// Funções puras: recebem os dados já lidos e devolvem o texto do arquivo (prompts/08-exportacao.md)

export type ParticipacaoExportada = {
  id: string;
  versao: string;
  concluidaEm: string;
  incluidaNaAnalise: boolean;
  suspeita: boolean;
  origem: "link" | "importada";
  // Código do idioma em que a pessoa respondeu (data/ueq-idiomas.json); null nas importadas, que não dizem
  idioma: string | null;
  traducaoAprovada: boolean | null;
  // Declarou ter menos de 18 anos, com a autorização do responsável; null nas importadas
  menorDeIdade: boolean | null;
  demografia: Demografia | null;
  // os valores de 1 a 7 do questionário que a pessoa respondeu: os 26 do UEQ na ordem oficial, ou os 8 do
  // UEQ-S na ordem e nos lados dele
  valores: number[];
};

const colunasItens = (total: number) => Array.from({ length: total }, (_, posicao) => `item${String(posicao + 1).padStart(2, "0")}`);

const simNao = (valor: boolean) => (valor ? "sim" : "não");

function cabecalhoRespostas(totalItens: number): string[] {
  return [
    "id_participacao",
    "versao",
    "concluida_em",
    "incluida_na_analise",
    "suspeita",
    "origem",
    "idioma",
    "traducao_aprovada",
    "menor_de_idade",
    "faixa_etaria",
    "genero",
    "escolaridade",
    "familiaridade_com_produto",
    ...colunasItens(totalItens),
  ];
}

function linhaRespostas(participacao: ParticipacaoExportada, valores: readonly number[]): ValorCsv[] {
  const { demografia } = participacao;
  return [
    participacao.id,
    participacao.versao,
    participacao.concluidaEm,
    simNao(participacao.incluidaNaAnalise),
    simNao(participacao.suspeita),
    participacao.origem,
    participacao.idioma,
    participacao.traducaoAprovada === null ? null : simNao(participacao.traducaoAprovada),
    participacao.menorDeIdade === null ? null : simNao(participacao.menorDeIdade),
    demografia?.faixaEtaria,
    demografia?.genero,
    demografia?.escolaridade,
    demografia?.familiaridadeComProduto,
    ...valores,
  ];
}

// docs/ueq-protocolo.md, seção 9.1: todas as participações, com a coluna de inclusão na análise.
// item01 a item26 no UEQ; item01 a item08 no UEQ-S, na numeração dele
export function exportarBrutas(participacoes: readonly ParticipacaoExportada[], totalItens = 26): string {
  return documentoCsv([cabecalhoRespostas(totalItens), ...participacoes.map((p) => linhaRespostas(p, p.valores))]);
}

// Seção 9.2: mesmo formato, de -3 a +3 com a polaridade já corrigida
export function exportarRecodificadas(participacoes: readonly ParticipacaoExportada[], itens: readonly ItemUEQ[]): string {
  return documentoCsv([
    cabecalhoRespostas(26),
    ...participacoes.map((p) => linhaRespostas(p, recodificarParticipante(p.valores, itens))),
  ]);
}

// O mesmo para o UEQ-S: no UEQ-S o termo positivo está sempre à direita, então é x - 4 em todos os itens
export function exportarRecodificadasUeqS(participacoes: readonly ParticipacaoExportada[], itens: readonly ItemUeqS[]): string {
  return documentoCsv([
    cabecalhoRespostas(itens.length),
    ...participacoes.map((p) => linhaRespostas(p, p.valores.map((valor, posicao) => recodificar(valor, itens[posicao]!.polaridade)))),
  ]);
}

// Seção 9.3: uma linha por escala e versão, mais o estudo inteiro, só com quem está na análise
export function exportarResultados(analises: readonly { versao: string; analise: AnaliseEstudo }[]): string {
  const cabecalho = [
    "versao",
    "escala",
    "n",
    "media",
    "dp",
    "ic95_inferior",
    "ic95_superior",
    "alfa",
    "faixa_interpretacao",
    "faixa_benchmark",
  ];
  const linhas = analises.flatMap(({ versao, analise }) =>
    analise.escalas.map((escala) => [
      versao,
      NOME_ESCALA[escala.escala],
      escala.n,
      decimalCsv(escala.media),
      decimalCsv(escala.dp),
      decimalCsv(escala.ic?.inferior),
      decimalCsv(escala.ic?.superior),
      decimalCsv(escala.alfa),
      escala.faixaInterpretacao ?? "",
      escala.benchmark ? NOME_BENCHMARK[escala.benchmark] : "",
    ]),
  );
  return documentoCsv([cabecalho, ...linhas]);
}

// Seção 9.3 para o UEQ-S: pragmática, hedônica e geral, na ordem da planilha oficial dele. A geral não tem alfa
export function exportarResultadosUeqS(analises: readonly { versao: string; analise: AnaliseUeqS }[]): string {
  const cabecalho = ["versao", "escala", "n", "media", "dp", "ic95_inferior", "ic95_superior", "alfa", "faixa_interpretacao", "faixa_benchmark"];
  const linhas = analises.flatMap(({ versao, analise }) =>
    analise.escalas.map((escala) => [
      versao,
      NOME_ESCALA_UEQ_S[escala.escala],
      escala.n,
      decimalCsv(escala.media),
      decimalCsv(escala.dp),
      decimalCsv(escala.ic?.inferior),
      decimalCsv(escala.ic?.superior),
      decimalCsv(escala.alfa),
      escala.faixaInterpretacao ?? "",
      escala.benchmark ? NOME_BENCHMARK[escala.benchmark] : "",
    ]),
  );
  return documentoCsv([cabecalho, ...linhas]);
}

// Seção 9.4 para o UEQ-S de um estudo do UEQ completo: os 8 itens equivalentes de cada participação na análise,
// já na ordem e nos lados do UEQ-S, para Data!A4 da planilha oficial dele
export function linhasDaPlanilhaUeqS(participacoes: readonly ParticipacaoExportada[], itens: readonly ItemUeqS[]): number[][] {
  return participacoes.filter((p) => p.incluidaNaAnalise).map((p) => valoresDoUeqS(p.valores, itens));
}

// Seção 9.4: os 26 valores de cada participação na análise, na ordem em que vão para Data!A4 da
// UEQ Data Analysis Tool (src/lib/planilha-oficial.ts)
export function linhasDaPlanilhaOficial(participacoes: readonly ParticipacaoExportada[]): number[][] {
  return participacoes.filter((p) => p.incluidaNaAnalise).map((p) => [...p.valores]);
}
