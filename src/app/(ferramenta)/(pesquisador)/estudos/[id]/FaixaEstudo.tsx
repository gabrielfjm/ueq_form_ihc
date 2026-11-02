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
import { tradutor } from "@/traducao/servidor";
import { m } from "@/traducao/nucleo";
import type { Traduzir } from "@/traducao/nucleo";

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
  editor: m("você é editor"),
  leitor: m("você é leitor: pode ver e exportar, sem alterar"),
};

// "34 respostas · 3 suspeitas · 31 na análise" (r5) ou "0 respostas · 3 versões" (r4b)
export function resumoDoEstudo(
  t: Traduzir,
  status: Status,
  versoes: number,
  respostas: { total: number; suspeitas: number; naAnalise: number },
): string {
  if (status === "RASCUNHO") {
    return `${plural(respostas.total, t("resposta"), t("respostas"))} · ${plural(versoes, t("versão"), t("versões"))}`;
  }
  return [
    plural(respostas.total, t("resposta"), t("respostas")),
    respostas.suspeitas > 0 ? plural(respostas.suspeitas, t("suspeita"), t("suspeitas")) : null,
    t("{n} na análise", { n: respostas.naAnalise }),
  ]
    .filter(Boolean)
    .join(" · ");
}

// Faixa de cabeçalho das páginas de um estudo: título, ajuda, Compartilhar, status e as abas
export async function FaixaEstudo({ estudo, resumo, ajuda }: Propriedades) {
  const t = await tradutor();
  return (
    <div className={estilos.faixa}>
      <div className={estilos.faixaInterna}>
        <Link href="/estudos" className={estilos.migalha}>
          {t("Estudos")}
        </Link>
        <div className={estilos.linhaTitulo}>
          <div className={estilos.tituloComAjuda}>
            <h1 className={estilos.titulo}>{t(estudo.titulo)}</h1>
            <BotaoAjuda pagina={ajuda} />
          </div>
          <span className={estilos.compartilhar}>
            <Compartilhar estudoId={estudo.id} titulo={estudo.titulo} />
          </span>
        </div>
        {estudo.acesso !== "dono" && (
          <p className={estilos.compartilhado}>
            {t("Estudo de {nome} · {v}", { nome: estudo.pesquisador.nome, v: t(PAPEL[estudo.acesso]) })}
          </p>
        )}
        <p className={estilos.linhaStatus}>
          <StatusEstudo status={estudo.status} comConsequencia />
          <span className={estilos.resumo}>{t(resumo)}</span>
        </p>
        <AbasEstudo estudoId={estudo.id} />
      </div>
    </div>
  );
}
