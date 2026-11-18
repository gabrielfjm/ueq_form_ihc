import { Download } from "lucide-react";
import { nomeDoArquivo, type TipoExportacao } from "@/lib/exportar-estudo";
import { MAXIMO_PARTICIPANTES } from "@/lib/planilha-oficial";
import { plural } from "@/lib/texto";
import { TituloSecao } from "./partes";
import estilos from "./resultados.module.css";
import { tradutor } from "@/traducao/servidor";
import { m } from "@/traducao/nucleo";

// docs/ihc.md §4.4: cada link diz o formato, o conteúdo e para que serve (protótipo r6, seção 04)
const EXPORTACOES: readonly { tipo: Exclude<TipoExportacao, "planilha-oficial">; nome: string; uso: string }[] = [
  {
    tipo: "brutas",
    nome: m("Respostas brutas (CSV)"),
    uso: m("Uma linha por participação, valores de 1 a 7, com colunas de inclusão na análise e suspeita. Para arquivar ou analisar em outro programa."),
  },
  {
    tipo: "recodificadas",
    nome: m("Respostas recodificadas (CSV)"),
    uso: m("Mesmo formato, com valores de -3 a +3 e a polaridade já corrigida."),
  },
  {
    tipo: "resultados",
    nome: m("Resultados por escala (CSV)"),
    uso: m("n, média, DP, IC95, alfa e faixas de cada escala e versão, só com as participações na análise. Para as tabelas do relatório."),
  },
];

type Propriedades = {
  estudoId: string;
  titulo: string;
  numero: number;
  // A mesma seleção da tela (?versao=…), para o PDF sair igual ao que a pessoa está vendo
  consulta: string;
  // A planilha oficial analisa um grupo só: vai a versão escolhida, ou o estudo inteiro em "Todas as versões"
  versao?: { id: string; nome: string };
  naPlanilha: number;
};

export async function SecaoExportar({ estudoId, titulo, numero, consulta, versao, naPlanilha }: Propriedades) {
  const t = await tradutor();
  const participacoes = plural(naPlanilha, t("participação"), t("participações"));
  return (
    <section aria-labelledby="titulo-exportar" className={estilos.secao} data-tutorial="exportar">
      <TituloSecao id="titulo-exportar" numero={numero}>{t("Exportar")}</TituloSecao>
      <ul className={estilos.exportar}>
        <li>
          <a href={`/api/estudos/${estudoId}/painel-pdf${consulta}`} download={nomeDoArquivo(titulo, "painel")} className={estilos.linkExportar}>
            <Download size={18} strokeWidth={1.5} aria-hidden="true" />
            <span>{t("Painel em PDF")}</span>
          </a>
          <p>{t("Este painel, com a versão escolhida, em A4 e com os gráficos em vetor. Para anexar ao relatório ou imprimir.")}</p>
        </li>
        {EXPORTACOES.map(({ tipo, nome, uso }) => (
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
                <span>{t("Planilha oficial do UEQ (XLSX)")}</span>
              </span>
              <p>
                {t("A planilha oficial calcula até {maximo} participantes, e esta seleção tem {quantidade}. Escolha uma versão no topo do painel ou use as respostas brutas.", { maximo: MAXIMO_PARTICIPANTES, quantidade: participacoes })}
              </p>
            </>
          ) : (
            <>
              <a
                href={`/api/estudos/${estudoId}/exportar/planilha-oficial${versao ? `?versao=${versao.id}` : ""}`}
                download={nomeDoArquivo(titulo, "planilha-oficial", versao?.nome)}
                className={estilos.linkExportar}
              >
                <Download size={18} strokeWidth={1.5} aria-hidden="true" />
                <span>{t("Planilha oficial do UEQ (XLSX)")}</span>
              </a>
              <p>
                {versao
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
