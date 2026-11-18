import { Download } from "lucide-react";
import { nomeDoArquivo, type TipoExportacao } from "@/lib/exportar-estudo";
import { MAXIMO_PARTICIPANTES } from "@/lib/planilha-oficial";
import { plural } from "@/lib/texto";
import { TituloSecao } from "./partes";
import estilos from "./resultados.module.css";
import { tradutor } from "@/traducao/servidor";
import { m } from "@/traducao/nucleo";

type Csv = { tipo: Exclude<TipoExportacao, "planilha-oficial" | "planilha-oficial-ueq-s">; nome: string; uso: string };

const BRUTAS: Csv = {
  tipo: "brutas",
  nome: m("Respostas brutas (CSV)"),
  uso: m("Uma linha por participação, valores de 1 a 7, com colunas de inclusão na análise e suspeita. Para arquivar ou analisar em outro programa."),
};
const RECODIFICADAS: Csv = {
  tipo: "recodificadas",
  nome: m("Respostas recodificadas (CSV)"),
  uso: m("Mesmo formato, com valores de -3 a +3 e a polaridade já corrigida."),
};
const RESULTADOS: Csv = {
  tipo: "resultados",
  nome: m("Resultados por escala (CSV)"),
  uso: m("n, média, DP, IC95, alfa e faixas de cada escala e versão, só com as participações na análise. Para as tabelas do relatório."),
};

// "ueq": aba do UEQ num estudo do UEQ completo. "ueq-s-do-ueq": aba do UEQ-S num estudo do UEQ completo, que
// exporta só o que é do UEQ-S (as respostas já saem na aba do UEQ). "ueq-s": estudo do UEQ-S
export type ModoExportar = "ueq" | "ueq-s-do-ueq" | "ueq-s";

// docs/ihc.md §4.4: cada link diz o formato, o conteúdo e para que serve (protótipo r6, seção 04)
const CSV_POR_MODO: Record<ModoExportar, readonly Csv[]> = {
  ueq: [BRUTAS, RECODIFICADAS, RESULTADOS],
  "ueq-s-do-ueq": [
    {
      tipo: "resultados-ueq-s",
      nome: m("Resultados do UEQ-S por escala (CSV)"),
      uso: m("n, média, DP, IC95, alfa e faixas da qualidade pragmática, da hedônica e da geral, por versão. As respostas brutas saem na aba do UEQ."),
    },
  ],
  "ueq-s": [
    { ...BRUTAS, uso: m("Uma linha por participação, os 8 valores de 1 a 7 na ordem do UEQ-S, com colunas de inclusão na análise e suspeita.") },
    { ...RECODIFICADAS, uso: m("Mesmo formato, com valores de -3 a +3. No UEQ-S o termo positivo está sempre à direita.") },
    { ...RESULTADOS, uso: m("n, média, DP, IC95, alfa e faixas da qualidade pragmática, da hedônica e da geral, por versão, só com as participações na análise.") },
  ],
};

type Propriedades = {
  estudoId: string;
  titulo: string;
  numero: number;
  // A mesma seleção da tela (?versao=…), para o PDF sair igual ao que a pessoa está vendo
  consulta: string;
  // A planilha oficial analisa um grupo só: vai a versão escolhida, ou o estudo inteiro em "Todas as versões"
  versao?: { id: string; nome: string };
  naPlanilha: number;
  modo?: ModoExportar;
};

export async function SecaoExportar({ estudoId, titulo, numero, consulta, versao, naPlanilha, modo = "ueq" }: Propriedades) {
  const t = await tradutor();
  const participacoes = plural(naPlanilha, t("participação"), t("participações"));
  const ueqS = modo !== "ueq";
  const planilha = ueqS ? "planilha-oficial-ueq-s" : "planilha-oficial";
  const nomePlanilha = ueqS ? t("Planilha oficial do UEQ-S (XLSX)") : t("Planilha oficial do UEQ (XLSX)");
  // O PDF da aba do UEQ-S num estudo do UEQ completo pede a página de impressão do UEQ-S
  const consultaPdf = modo === "ueq-s-do-ueq" ? `${consulta ? `${consulta}&` : "?"}instrumento=ueq-s` : consulta;

  return (
    <section aria-labelledby="titulo-exportar" className={estilos.secao} data-tutorial="exportar">
      <TituloSecao id="titulo-exportar" numero={numero}>{t("Exportar")}</TituloSecao>
      <ul className={estilos.exportar}>
        <li>
          <a
            href={`/api/estudos/${estudoId}/painel-pdf${consultaPdf}`}
            download={nomeDoArquivo(titulo, ueqS ? "painel-ueq-s" : "painel")}
            className={estilos.linkExportar}
          >
            <Download size={18} strokeWidth={1.5} aria-hidden="true" />
            <span>{t("Painel em PDF")}</span>
          </a>
          <p>{t("Este painel, com a versão escolhida, em A4 e com os gráficos em vetor. Para anexar ao relatório ou imprimir.")}</p>
        </li>
        {CSV_POR_MODO[modo].map(({ tipo, nome, uso }) => (
          <li key={tipo}>
            {/* Download direto, sem abrir aba nova; o servidor manda o arquivo como anexo */}
            <a href={`/api/estudos/${estudoId}/exportar/${tipo}`} download={nomeDoArquivo(titulo, tipo)} className={estilos.linkExportar}>
              <Download size={18} strokeWidth={1.5} aria-hidden="true" />
              <span>{t(nome)}</span>
            </a>
            <p>{t(uso)}</p>
          </li>
        ))}
        <li>
          {naPlanilha > MAXIMO_PARTICIPANTES ? (
            <>
              <span className={estilos.linkExportar}>
                <Download size={18} strokeWidth={1.5} aria-hidden="true" />
                <span>{nomePlanilha}</span>
              </span>
              <p>
                {t("A planilha oficial calcula até {maximo} participantes, e esta seleção tem {quantidade}. Escolha uma versão no topo do painel ou use as respostas brutas.", { maximo: MAXIMO_PARTICIPANTES, quantidade: participacoes })}
              </p>
            </>
          ) : (
            <>
              <a
                href={`/api/estudos/${estudoId}/exportar/${planilha}${versao ? `?versao=${versao.id}` : ""}`}
                download={nomeDoArquivo(titulo, planilha, versao?.nome)}
                className={estilos.linkExportar}
              >
                <Download size={18} strokeWidth={1.5} aria-hidden="true" />
                <span>{nomePlanilha}</span>
              </a>
              <p>
                {ueqS
                  ? versao
                    ? t("A UEQ-S Data Analysis Tool V15 já preenchida com {quantidade} da versão {nome} que estão na análise. Abra no Excel e clique em Habilitar edição: a planilha recalcula sozinha, com os gráficos, o benchmark e as suspeitas dela.", { quantidade: participacoes, nome: versao.nome })
                    : t("A UEQ-S Data Analysis Tool V15 já preenchida com {quantidade} que estão na análise. Abra no Excel e clique em Habilitar edição: a planilha recalcula sozinha, com os gráficos, o benchmark e as suspeitas dela.", { quantidade: participacoes })
                  : versao
                    ? t("A UEQ Data Analysis Tool V15 já preenchida com {quantidade} da versão {nome} que estão na análise. Abra no Excel e clique em Habilitar edição: a planilha recalcula sozinha, com os gráficos, o benchmark e as suspeitas dela.", { quantidade: participacoes, nome: versao.nome })
                    : t("A UEQ Data Analysis Tool V15 já preenchida com {quantidade} que estão na análise. Abra no Excel e clique em Habilitar edição: a planilha recalcula sozinha, com os gráficos, o benchmark e as suspeitas dela.", { quantidade: participacoes })}
              </p>
            </>
          )}
        </li>
      </ul>
      <p className={estilos.nomeArquivos}>
        {t("Nome dos arquivos: {v}. Os CSV trazem todas as versões do estudo; a planilha oficial traz a seleção do painel.", { v: nomeDoArquivo(titulo, "brutas").replace("_brutas_", "_[tipo]_") })}
      </p>
    </section>
  );
}
