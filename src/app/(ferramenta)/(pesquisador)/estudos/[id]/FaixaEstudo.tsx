import Link from "next/link";
import type { StatusEstudo as Status } from "@/generated/prisma/enums";
import { plural } from "@/lib/texto";
import { StatusEstudo } from "../StatusEstudo";
import { AbasEstudo } from "./AbasEstudo";
import estilos from "./estudo.module.css";

type Propriedades = {
  estudoId: string;
  titulo: string;
  status: Status;
  resumo: string;
};

// "34 respostas · 3 suspeitas · 31 na análise" (r5) ou "0 respostas · 3 versões" (r4b)
export function resumoDoEstudo(
  status: Status,
  versoes: number,
  respostas: { total: number; suspeitas: number; naAnalise: number },
): string {
  if (status === "RASCUNHO") {
    return `${plural(respostas.total, "resposta", "respostas")} · ${plural(versoes, "versão", "versões")}`;
  }
  return [
    plural(respostas.total, "resposta", "respostas"),
    respostas.suspeitas > 0 ? plural(respostas.suspeitas, "suspeita", "suspeitas") : null,
    `${respostas.naAnalise} na análise`,
  ]
    .filter(Boolean)
    .join(" · ");
}

// Faixa de cabeçalho das páginas de um estudo: título, status com a consequência e as abas
export function FaixaEstudo({ estudoId, titulo, status, resumo }: Propriedades) {
  return (
    <div className={estilos.faixa}>
      <div className={estilos.faixaInterna}>
        <Link href="/estudos" className={estilos.migalha}>
          Estudos
        </Link>
        <h1 className={estilos.titulo}>{titulo}</h1>
        <p className={estilos.linhaStatus}>
          <StatusEstudo status={status} comConsequencia />
          <span className={estilos.resumo}>{resumo}</span>
        </p>
        <AbasEstudo estudoId={estudoId} />
      </div>
    </div>
  );
}
