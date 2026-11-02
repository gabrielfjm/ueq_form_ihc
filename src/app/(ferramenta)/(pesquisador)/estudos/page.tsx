import { Mail, Plus } from "lucide-react";
import type { Metadata, Route } from "next";
import Link from "next/link";
import { Avisos } from "@/componentes/Avisos";
import formulario from "@/componentes/formulario/formulario.module.css";
import { banco } from "@/lib/banco";
import type { Prisma } from "@/generated/prisma/client";
import { hojeEmBrasilia } from "@/lib/periodo";
import { exigirPesquisador } from "@/lib/sessao";
import { formatarData, plural } from "@/lib/texto";
import { FaixaCabecalho } from "../FaixaCabecalho";
import estilos from "./estudos.module.css";
import { ReguaPeriodo } from "./ReguaPeriodo";
import { StatusEstudo } from "./StatusEstudo";
import { tradutor } from "@/traducao/servidor";
import { m } from "@/traducao/nucleo";

export async function generateMetadata(): Promise<Metadata> {
  const t = await tradutor();
  return { title: t("Estudos · Ferramenta UEQ") };
}

const CENTROS = [24, 73, 122, 172, 221, 270, 320];

const AVISOS = {
  excluido: m("Estudo excluído."),
  "saiu-do-estudo": m("Você saiu do estudo. Ele continua com o dono e com o resto da equipe."),
} as const;

type Propriedades = { searchParams: Promise<Record<string, string | string[] | undefined>> };

async function estudosComRespostas(onde: Prisma.EstudoWhereInput, pesquisadorId: string) {
  const [estudos, porVersao] = await Promise.all([
    banco.estudo.findMany({
      where: onde,
      orderBy: { atualizadoEm: "desc" },
      include: {
        versoes: { select: { id: true } },
        pesquisador: { select: { nome: true } },
        colaboracoes: { where: { pesquisadorId }, select: { papel: true } },
      },
    }),
    banco.participacao.groupBy({
      by: ["versaoId"],
      where: { concluidaEm: { not: null }, versao: { estudo: onde } },
      _count: { _all: true },
      _max: { concluidaEm: true },
    }),
  ]);
  return estudos.map((estudo) => {
    const daqui = porVersao.filter((grupo) => estudo.versoes.some((versao) => versao.id === grupo.versaoId));
    const ultimas = daqui.map((grupo) => grupo._max.concluidaEm).filter((data) => data !== null);
    return {
      ...estudo,
      papel: estudo.colaboracoes[0]?.papel ?? null,
      respostas: daqui.reduce((soma, grupo) => soma + grupo._count._all, 0),
      ultimaResposta: ultimas.length > 0 ? new Date(Math.max(...ultimas.map((data) => data.getTime()))) : null,
    };
  });
}

type EstudoDaLista = Awaited<ReturnType<typeof estudosComRespostas>>[number];

async function TabelaEstudos({ estudos, hoje, legenda, compartilhados = false }: { estudos: EstudoDaLista[]; hoje: Date; legenda: string; compartilhados?: boolean }) {
  const t = await tradutor();
  return (
    <div className={estilos.rolagemTabela}>
      <table className={estilos.tabela}>
        <caption>{t(legenda)}</caption>
        <thead>
          <tr>
            <th scope="col">{t("Estudo")}</th>
            <th scope="col">{t("Status")}</th>
            <th scope="col">{t("Período da coleta")}</th>
            <th scope="col" className={estilos.direita}>{t("Versões")}</th>
            <th scope="col" className={estilos.direita}>{t("Respostas")}</th>
            <th scope="col" className={estilos.direita}>{t("Última resposta")}</th>
          </tr>
        </thead>
        <tbody>
          {estudos.map((estudo) => (
            <tr key={estudo.id}>
              <th scope="row">
                <Link href={`/estudos/${estudo.id}` as Route} className={estilos.tituloEstudo} data-estudo={estudo.id}>
                  {t(estudo.titulo)}
                </Link>
                <span className={estilos.produto}>{t(estudo.produtoAvaliado)}</span>
                {compartilhados && (
                  <span className={estilos.produto}>
                    {t("De {nome} · você é {v}", { nome: estudo.pesquisador.nome, v: estudo.papel === "LEITOR" ? "leitor" : "editor" })}
                  </span>
                )}
              </th>
              <td>
                <StatusEstudo status={estudo.status} />
              </td>
              <td>
                <ReguaPeriodo status={estudo.status} inicio={estudo.dataInicio} fim={estudo.dataFim} hoje={hoje} />
              </td>
              <td className={`${estilos.numero} ${estilos.direita}`}>{estudo.versoes.length}</td>
              <td className={`${estilos.numero} ${estilos.direita}`}>{estudo.respostas}</td>
              <td className={`${estilos.numero} ${estilos.direita}`}>
                {estudo.ultimaResposta ? formatarData(estudo.ultimaResposta) : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

async function BotaoCriar({ className = "" }: { className?: string }) {
  const t = await tradutor();
  return (
    <Link href="/estudos/novo" className={`${formulario.botao} ${formulario.primario} ${className}`}>
      <Plus size={18} strokeWidth={1.5} aria-hidden="true" />
      <span>{t("Criar estudo")}</span>
    </Link>
  );
}

export default async function PaginaEstudos({ searchParams }: Propriedades) {
  const t = await tradutor();
  const pesquisador = await exigirPesquisador();
  const { aviso } = await searchParams;
  const [estudos, compartilhados, convites] = await Promise.all([
    estudosComRespostas({ pesquisadorId: pesquisador.id }, pesquisador.id),
    estudosComRespostas({ colaboracoes: { some: { pesquisadorId: pesquisador.id, status: "ACEITO" } } }, pesquisador.id),
    banco.colaboracao.count({ where: { pesquisadorId: pesquisador.id, status: "PENDENTE" } }),
  ]);
  const hoje = hojeEmBrasilia();
  const abertos = estudos.filter((estudo) => estudo.status === "ABERTO").length;
  const respostas = estudos.reduce((soma, estudo) => soma + estudo.respostas, 0);

  return (
    <>
      <FaixaCabecalho
        titulo={t("Seus estudos")}
        ajuda="estudos"
        resumo={
          estudos.length > 0
            ? t("{quantidade} · {abertos} com coleta aberta · {quantidade2} no total", { quantidade: plural(estudos.length, t("estudo"), t("estudos")), abertos: abertos, quantidade2: plural(respostas, t("resposta"), t("respostas")) })
            : undefined
        }
        acao={<BotaoCriar />}
      />
      <div className={estilos.conteudo}>
        <Avisos inicial={aviso === "excluido" || aviso === "saiu-do-estudo" ? AVISOS[aviso] : null} className={estilos.regiaoStatus}>
          {convites > 0 && (
            <p className={estilos.convites}>
              <Mail size={18} strokeWidth={1.5} aria-hidden="true" />
              <span>
                {t("Você tem {quantidade} para trabalhar em estudos da equipe.", { quantidade: plural(convites, t("convite pendente"), t("convites pendentes")) })}
              </span>
              <Link href="/notificacoes">{t("Ver convites")}</Link>
            </p>
          )}
          {estudos.length === 0 ? (
            <section aria-labelledby="sem-estudos" className={estilos.vazio}>
              <div className={estilos.vazioTextos}>
                <h2 id="sem-estudos" className={estilos.vazioTitulo}>
                  {t("Você ainda não tem estudos.")}
                </h2>
                <p className={estilos.vazioTexto}>
                  {t("Crie o primeiro para gerar o link de coleta: título, objetivo, período e versões.")}
                </p>
                <BotaoCriar className={estilos.vazioAcao} />
              </div>
              <svg viewBox="0 0 344 48" className={estilos.marcacoes} aria-hidden="true">
                <line x1="0" y1="24" x2="344" y2="24" />
                {CENTROS.map((cx) => (
                  <circle key={cx} cx={cx} cy="24" r="17" />
                ))}
              </svg>
            </section>
          ) : (
            <TabelaEstudos estudos={estudos} hoje={hoje} legenda={t("Do atualizado mais recentemente ao mais antigo")} />
          )}
          {compartilhados.length > 0 && (
            <section aria-labelledby="compartilhados" className={estilos.compartilhados}>
              <h2 id="compartilhados" className={estilos.tituloSecao}>
                {t("Compartilhados com você")}
              </h2>
              <TabelaEstudos
                estudos={compartilhados}
                hoje={hoje}
                legenda={t("Estudos de outras pessoas da equipe em que você foi convidado")}
                compartilhados
              />
            </section>
          )}
        </Avisos>
      </div>
    </>
  );
}
