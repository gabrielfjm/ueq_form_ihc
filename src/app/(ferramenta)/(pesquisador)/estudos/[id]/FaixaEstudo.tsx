import Link from "next/link";
import { BotaoAjuda } from "@/componentes/ajuda/BotaoAjuda";
import type { StatusEstudo as Status } from "@/generated/prisma/enums";
import type { ChaveAjuda } from "@/lib/ajuda";
import type { AcessoEstudo } from "@/lib/estudos";
import { plural } from "@/lib/texto";
import { StatusEstudo } from "../StatusEstudo";
import { AbasEstudo } from "./AbasEstudo";
import { Compartilhar } from "./Compartilhar";
import estilos from "./estudo.module.css";

type Propriedades = {
  estudo: {
    id: string;
    titulo: string;
    status: Status;
    acesso: AcessoEstudo;
    pesquisador: { nome: string };
  };
  resumo: string;
  ajuda: ChaveAjuda;
};

const PAPEL: Record<Exclude<AcessoEstudo, "dono">, string> = {
  editor: "você é editor",
  leitor: "você é leitor: pode ver e exportar, sem alterar",
  administrador: "você está vendo como administrador",
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

// Faixa de cabeçalho das páginas de um estudo: título, ajuda, Compartilhar, status e as abas
export function FaixaEstudo({ estudo, resumo, ajuda }: Propriedades) {
  return (
    <div className={estilos.faixa}>
      <div className={estilos.faixaInterna}>
        <Link href="/estudos" className={estilos.migalha}>
          Estudos
        </Link>
        <div className={estilos.linhaTitulo}>
          <div className={estilos.tituloComAjuda}>
            <h1 className={estilos.titulo}>{estudo.titulo}</h1>
            <BotaoAjuda pagina={ajuda} />
          </div>
          <span className={estilos.compartilhar}>
            <Compartilhar estudoId={estudo.id} titulo={estudo.titulo} />
          </span>
        </div>
        {estudo.acesso !== "dono" && (
          <p className={estudo.acesso === "administrador" ? `${estilos.compartilhado} ${estilos.administrador}` : estilos.compartilhado}>
            Estudo de {estudo.pesquisador.nome} · {PAPEL[estudo.acesso]}
          </p>
        )}
        <p className={estilos.linhaStatus}>
          <StatusEstudo status={estudo.status} comConsequencia />
          <span className={estilos.resumo}>{resumo}</span>
        </p>
        <AbasEstudo estudoId={estudo.id} />
      </div>
    </div>
  );
}
