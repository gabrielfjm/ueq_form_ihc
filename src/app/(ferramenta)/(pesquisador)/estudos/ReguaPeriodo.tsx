import type { StatusEstudo } from "@/generated/prisma/enums";
import { diasEntre, formatarDia, intervalo, situacaoDoPeriodo } from "@/lib/periodo";
import { plural } from "@/lib/texto";
import estilos from "./estudos.module.css";

export type Periodo = {
  status: StatusEstudo;
  inicio: Date;
  fim: Date;
  hoje: Date;
};

// O texto é que leva a informação; a régua ao lado é decorativa (aria-hidden)
export function textoDoPeriodo({ status, inicio, fim, hoje }: Periodo, curto: boolean): string {
  const situacao = situacaoDoPeriodo(inicio, fim, hoje);
  const datas = intervalo(inicio, fim);
  if (status === "ENCERRADO") return curto ? `${datas} · concluída` : "Coleta encerrada.";
  if (situacao.antesDoInicio) {
    return curto ? `começa em ${formatarDia(inicio)}` : `Começa em ${plural(diasEntre(hoje, inicio), "dia", "dias")}.`;
  }
  if (status === "RASCUNHO") return curto ? `previsto de ${datas}` : "A data de início já chegou. Abra a coleta quando estiver pronto.";
  if (situacao.depoisDoFim) return curto ? `${datas} · passou do fim` : "A data de fim prevista já passou.";
  return curto
    ? `${datas} · dia ${situacao.diaAtual} de ${situacao.totalDias}`
    : `Hoje é o dia ${situacao.diaAtual} de ${situacao.totalDias}.`;
}

// Régua pequena da tabela de estudos (protótipo r3)
export function ReguaPeriodo(periodo: Periodo) {
  const { status, inicio, fim, hoje } = periodo;
  const ate = status === "ENCERRADO" ? 140 : Math.round(situacaoDoPeriodo(inicio, fim, hoje).progresso * 140);
  return (
    <>
      <svg width="140" height="10" viewBox="0 0 140 10" aria-hidden="true" className={estilos.regua}>
        <line x1="0" y1="5" x2="140" y2="5" className={status === "RASCUNHO" ? estilos.reguaPrevista : estilos.reguaFundo} />
        {status !== "RASCUNHO" && <line x1="0" y1="5" x2={ate} y2="5" className={estilos.reguaPassada} />}
        {status === "ABERTO" && <circle cx={ate} cy="5" r="4" className={estilos.reguaHoje} />}
        {status === "ENCERRADO" && <circle cx="140" cy="5" r="4" className={estilos.reguaFim} />}
      </svg>
      <span className={estilos.reguaTexto}>{textoDoPeriodo(periodo, true)}</span>
    </>
  );
}
