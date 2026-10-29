import { recodificarParticipante, type AnaliseEstudo, type ItemUEQ } from "@/ueq";
import { decimalCsv, documentoCsv, type ValorCsv } from "./csv";
import type { Demografia } from "./demografia";
import { NOME_BENCHMARK, NOME_ESCALA } from "./nomes-ueq";

// Funções puras: recebem os dados já lidos e devolvem o texto do arquivo (prompts/08-exportacao.md)

export type ParticipacaoExportada = {
  id: string;
  versao: string;
  concluidaEm: string;
  incluidaNaAnalise: boolean;
  suspeita: boolean;
  demografia: Demografia | null;
  // os 26 valores de 1 a 7, na ordem oficial
  valores: number[];
};

const COLUNAS_ITENS = Array.from({ length: 26 }, (_, posicao) => `item${String(posicao + 1).padStart(2, "0")}`);

const simNao = (valor: boolean) => (valor ? "sim" : "não");

function cabecalhoRespostas(): string[] {
  return [
    "id_participacao",
    "versao",
    "concluida_em",
    "incluida_na_analise",
    "suspeita",
    "faixa_etaria",
    "genero",
    "escolaridade",
    "familiaridade_com_produto",
    ...COLUNAS_ITENS,
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
    demografia?.faixaEtaria,
    demografia?.genero,
    demografia?.escolaridade,
    demografia?.familiaridadeComProduto,
    ...valores,
  ];
}

// docs/ueq-protocolo.md, seção 9.1: todas as participações, com a coluna de inclusão na análise
export function exportarBrutas(participacoes: readonly ParticipacaoExportada[]): string {
  return documentoCsv([cabecalhoRespostas(), ...participacoes.map((p) => linhaRespostas(p, p.valores))]);
}

// Seção 9.2: mesmo formato, de -3 a +3 com a polaridade já corrigida
export function exportarRecodificadas(participacoes: readonly ParticipacaoExportada[], itens: readonly ItemUEQ[]): string {
  return documentoCsv([
    cabecalhoRespostas(),
    ...participacoes.map((p) => linhaRespostas(p, recodificarParticipante(p.valores, itens))),
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

// Seção 9.4: só os 26 valores por linha, sem cabeçalho e sem BOM, no mesmo formato de data/fixtures.
// Abre em colunas no Excel pt-BR; as linhas vão coladas em Data!A4 da UEQ Data Analysis Tool
export function exportarPlanilhaOficial(participacoes: readonly ParticipacaoExportada[]): string {
  return documentoCsv(
    participacoes.filter((p) => p.incluidaNaAnalise).map((p) => p.valores),
    { comBom: false },
  );
}
