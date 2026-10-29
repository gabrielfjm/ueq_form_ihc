import { Download } from "lucide-react";
import { nomeDoArquivo, type TipoExportacao } from "@/lib/exportar-estudo";
import { TituloSecao } from "./partes";
import estilos from "./resultados.module.css";

// docs/ihc.md §4.4: cada link diz o formato, o conteúdo e para que serve (protótipo r6, seção 04)
const EXPORTACOES: readonly { tipo: TipoExportacao; nome: string; uso: string }[] = [
  {
    tipo: "brutas",
    nome: "Respostas brutas (CSV)",
    uso: "Uma linha por participação, valores de 1 a 7, com colunas de inclusão na análise e suspeita. Para arquivar ou analisar em outro programa.",
  },
  {
    tipo: "recodificadas",
    nome: "Respostas recodificadas (CSV)",
    uso: "Mesmo formato, com valores de -3 a +3 e a polaridade já corrigida.",
  },
  {
    tipo: "resultados",
    nome: "Resultados por escala (CSV)",
    uso: "n, média, DP, IC95, alfa e faixas de cada escala e versão, só com as participações na análise. Para as tabelas do relatório.",
  },
  {
    tipo: "planilha-oficial",
    nome: "Formato da planilha oficial (CSV)",
    uso: "Só os 26 valores por linha, das participações na análise. Cole na aba de dados da UEQ Data Analysis Tool para conferir os cálculos.",
  },
];

export function SecaoExportar({ estudoId, titulo, numero }: { estudoId: string; titulo: string; numero: number }) {
  return (
    <section aria-labelledby="titulo-exportar" className={estilos.secao}>
      <TituloSecao id="titulo-exportar" numero={numero}>Exportar</TituloSecao>
      <ul className={estilos.exportar}>
        {EXPORTACOES.map(({ tipo, nome, uso }) => (
          <li key={tipo}>
            {/* Download direto, sem abrir aba nova; o servidor manda o arquivo como anexo */}
            <a href={`/api/estudos/${estudoId}/exportar/${tipo}`} download={nomeDoArquivo(titulo, tipo)} className={estilos.linkExportar}>
              <Download size={18} strokeWidth={1.5} aria-hidden="true" />
              <span>{nome}</span>
            </a>
            <p>{uso}</p>
          </li>
        ))}
      </ul>
      <p className={estilos.nomeArquivos}>
        Nome dos arquivos: {nomeDoArquivo(titulo, "brutas").replace("_brutas_", "_[tipo]_")}. Os arquivos trazem todas as
        versões do estudo.
      </p>
    </section>
  );
}
