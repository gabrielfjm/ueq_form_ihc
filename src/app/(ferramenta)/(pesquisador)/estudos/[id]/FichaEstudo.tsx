import type { StatusEstudo } from "@/generated/prisma/enums";
import { IDIOMAS } from "@/idiomas";
import { formatarDia, situacaoDoPeriodo } from "@/lib/periodo";
import { formatarData } from "@/lib/texto";
import { textoDoPeriodo } from "../ReguaPeriodo";
import estilos from "./pagina-estudo.module.css";
import { tradutor } from "@/traducao/servidor";

type Propriedades = {
  status: StatusEstudo;
  respostas: number;
  detalheRespostas: string;
  inicio: Date;
  fim: Date;
  hoje: Date;
  produto: string;
  objetivo?: string;
  criadoEm: Date;
  atualizadoEm: Date;
};

function ReguaFicha({ status, inicio, fim, hoje }: Pick<Propriedades, "status" | "inicio" | "fim" | "hoje">) {
  const x = 4 + Math.round(situacaoDoPeriodo(inicio, fim, hoje).progresso * 252);
  return (
    <svg viewBox="0 0 260 24" className={estilos.reguaFicha} aria-hidden="true">
      <line x1="4" y1="12" x2="256" y2="12" className={status === "RASCUNHO" ? estilos.prevista : undefined} />
      {status === "ABERTO" && <line x1="4" y1="12" x2={x} y2="12" className={estilos.passada} />}
      {status === "ENCERRADO" && <line x1="4" y1="12" x2="256" y2="12" className={estilos.passada} />}
      <circle cx="4" cy="12" r="4" className={status === "RASCUNHO" ? estilos.marcoVazio : estilos.marco} />
      <circle cx="256" cy="12" r="4" className={status === "ENCERRADO" ? estilos.marco : estilos.marcoVazio} />
      {status === "ABERTO" && <circle cx={x} cy="12" r="6" className={estilos.hoje} />}
    </svg>
  );
}

// Ficha lateral dos protótipos r4b e r5
export async function FichaEstudo(propriedades: Propriedades) {
  const t = await tradutor();
  const { status, respostas, detalheRespostas, inicio, fim, hoje, produto, objetivo, criadoEm, atualizadoEm } = propriedades;
  return (
    <aside aria-labelledby="titulo-ficha" className={estilos.ficha}>
      <h2 id="titulo-ficha" className={estilos.fichaTitulo}>
        {t("Ficha do estudo")}
      </h2>
      <dl className={estilos.fichaLista}>
        <div>
          <dt>{t("Respostas")}</dt>
          <dd>
            <span className={estilos.numeroGrande}>{respostas}</span>
            <span className={estilos.detalhe}>{t(detalheRespostas)}</span>
          </dd>
        </div>
        <div>
          <dt>{t("Período da coleta")}</dt>
          <dd>
            <ReguaFicha status={status} inicio={inicio} fim={fim} hoje={hoje} />
            <span className={estilos.datasRegua}>
              <span>{t(formatarDia(inicio))}</span>
              <span>{t(formatarDia(fim))}</span>
            </span>
            <span className={estilos.situacaoRegua}>{t(textoDoPeriodo(t, { status, inicio, fim, hoje }, false))}</span>
          </dd>
        </div>
        <div>
          <dt>{t("Produto avaliado")}</dt>
          <dd>{t(produto)}</dd>
        </div>
        {objetivo && (
          <div>
            <dt>{t("Objetivo")}</dt>
            <dd className={estilos.detalhe}>{t(objetivo)}</dd>
          </div>
        )}
        <div>
          <dt>{t("Instrumento")}</dt>
          <dd>{t("UEQ completo · 26 itens · {length} idiomas", { length: IDIOMAS.length })}</dd>
        </div>
        <div>
          <dt>{t("Criado em")}</dt>
          <dd className={estilos.numeroPequeno}>
            {t("{data} · atualizado em {data2}", { data: formatarData(criadoEm), data2: formatarData(atualizadoEm) })}
          </dd>
        </div>
      </dl>
    </aside>
  );
}
