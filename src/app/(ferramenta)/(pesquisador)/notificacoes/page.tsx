import { Bell, Check, X } from "lucide-react";
import type { Metadata, Route } from "next";
import Link from "next/link";
import { after } from "next/server";
import { Avisos } from "@/componentes/Avisos";
import formulario from "@/componentes/formulario/formulario.module.css";
import { banco } from "@/lib/banco";
import { exigirPesquisador } from "@/lib/sessao";
import { formatarData, formatarDiaHora, plural } from "@/lib/texto";
import { FaixaCabecalho } from "../FaixaCabecalho";
import { responderConvite } from "./acoes";
import estilos from "./notificacoes.module.css";
import { tradutor } from "@/traducao/servidor";
import { m } from "@/traducao/nucleo";

export async function generateMetadata(): Promise<Metadata> {
  const t = await tradutor();
  return { title: t("Notificações · Ferramenta UEQ") };
}

type Propriedades = { searchParams: Promise<Record<string, string | string[] | undefined>> };

const AVISOS = {
  recusado: m("Convite recusado. Quem convidou pode chamar você de novo depois."),
  indisponivel: m("Esse convite não está mais disponível: foi cancelado ou já foi respondido."),
} as const;

const PAPEL = {
  EDITOR: m("Editor: pode editar o estudo, mudar a coleta e revisar as respostas"),
  LEITOR: m("Leitor: pode ver o painel e as respostas e exportar"),
} as const;

export default async function PaginaNotificacoes({ searchParams }: Propriedades) {
  const t = await tradutor();
  const pesquisador = await exigirPesquisador();
  const { aviso } = await searchParams;
  const convites = await banco.colaboracao.findMany({
    where: { pesquisadorId: pesquisador.id },
    orderBy: { criadoEm: "desc" },
    include: {
      estudo: { select: { id: true, titulo: true, produtoAvaliado: true, pesquisador: { select: { nome: true } } } },
      convidadoPor: { select: { nome: true, email: true } },
    },
  });
  const pendentes = convites.filter((convite) => convite.status === "PENDENTE");
  const respondidos = convites.filter((convite) => convite.status !== "PENDENTE");
  const notificacoes = await banco.notificacao.findMany({
    where: { pesquisadorId: pesquisador.id },
    orderBy: { criadaEm: "desc" },
    take: 100,
  });
  const naoLidas = notificacoes.filter((notificacao) => !notificacao.lidaEm).length;
  // Quem abriu a página viu tudo: as novas aparecem destacadas agora e ficam lidas para a próxima visita
  after(() =>
    banco.notificacao.updateMany({ where: { pesquisadorId: pesquisador.id, lidaEm: null }, data: { lidaEm: new Date() } }),
  );

  return (
    <>
      <FaixaCabecalho
        titulo={t("Notificações")}
        ajuda="notificacoes"
        descricao={t("Convites, respostas que chegaram e o que a equipe mudou nos estudos que você acompanha.")}
        resumo={[
          naoLidas > 0 ? plural(naoLidas, t("nova"), t("novas")) : t("Nenhuma nova"),
          pendentes.length > 0 ? plural(pendentes.length, t("convite pendente"), t("convites pendentes")) : null,
        ]
          .filter(Boolean)
          .join(" · ")}
      />
      <div className={estilos.conteudo}>
        <Avisos inicial={aviso === "recusado" || aviso === "indisponivel" ? AVISOS[aviso] : null} className={estilos.regiaoStatus}>
          {pendentes.length > 0 && <h2 className={estilos.subtitulo}>{t("Convites esperando resposta")}</h2>}
          {pendentes.length > 0 && (
            <ul className={estilos.lista} aria-label={t("Convites pendentes")}>
              {pendentes.map((convite) => (
                <li key={convite.id} className={estilos.convite}>
                  <div className={estilos.textos}>
                    <h2 className={estilos.titulo}>{t(convite.estudo.titulo)}</h2>
                    <p className={estilos.produto}>{t(convite.estudo.produtoAvaliado)}</p>
                    <p>
                      {convite.convidadoPor ? (
                        <>
                          <strong>{t(convite.convidadoPor.nome)}</strong>{" "}{t("({email}) convidou você em {data}.", { email: convite.convidadoPor.email, data: formatarData(convite.criadoEm) })}
                        </>
                      ) : (
                        <>{t("Convite de {data} para o estudo de {nome}.", { data: formatarData(convite.criadoEm), nome: convite.estudo.pesquisador.nome })}</>
                      )}
                    </p>
                    <p className={estilos.papel}>{t(PAPEL[convite.papel])}</p>
                  </div>
                  <div className={estilos.acoes}>
                    <form action={responderConvite.bind(null, convite.id, true)}>
                      <button type="submit" className={`${formulario.botao} ${formulario.primario}`} data-tutorial="aceitar-convite">
                        <Check size={18} strokeWidth={1.5} aria-hidden="true" className={formulario.icone} />
                        <span>{t("Aceitar")}</span>
                      </button>
                    </form>
                    <form action={responderConvite.bind(null, convite.id, false)}>
                      <button type="submit" className={`${formulario.botao} ${formulario.secundario}`}>
                        <X size={18} strokeWidth={1.5} aria-hidden="true" className={formulario.icone} />
                        <span>{t("Recusar")}</span>
                      </button>
                    </form>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <section aria-labelledby="todas" className={pendentes.length > 0 ? estilos.historico : undefined}>
            <h2 id="todas" className={estilos.subtitulo}>
              {t("Todas as notificações")}
            </h2>
            {notificacoes.length === 0 ? (
              <div className={estilos.vazio}>
                <p>
                  {t("Nada por aqui ainda. Quando alguém convidar você, quando chegarem respostas nos seus estudos ou quando um parceiro mudar algo, o aviso aparece aqui, no sino do topo e no seu e-mail. Para ser convidado, a pessoa usa o e-mail da sua conta:")}{" "}<strong>{t(pesquisador.email)}</strong>.
                </p>
              </div>
            ) : (
              <ul className={estilos.listaSimples}>
                {notificacoes.map((notificacao) => (
                  <li key={notificacao.id} className={notificacao.lidaEm ? undefined : estilos.nova}>
                    <span className={estilos.textoNotificacao}>
                      {!notificacao.lidaEm && (
                        <span className={estilos.marcaNova}>
                          <Bell size={14} strokeWidth={2} aria-hidden="true" />{" "}{t("Nova")}
                        </span>
                      )}
                      <Link href={notificacao.link as Route}>{t(notificacao.texto)}</Link>
                    </span>
                    <span className={estilos.produto}>{t(formatarDiaHora(notificacao.criadaEm))}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {respondidos.length > 0 && (
            <section aria-labelledby="respondidos" className={estilos.historico}>
              <h2 id="respondidos" className={estilos.subtitulo}>
                {t("Convites já respondidos")}
              </h2>
              <ul className={estilos.listaSimples}>
                {respondidos.map((convite) => (
                  <li key={convite.id}>
                    {convite.status === "ACEITO" ? (
                      <Link href={`/estudos/${convite.estudo.id}` as Route}>{t(convite.estudo.titulo)}</Link>
                    ) : (
                      <span>{t(convite.estudo.titulo)}</span>
                    )}
                    <span className={estilos.produto}>
                      {convite.status === "ACEITO" ? t("Aceito") : t("Recusado")}
                      {convite.respondidoEm ? ` ${t("em {data}", { data: formatarData(convite.respondidoEm) })}` : ""}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </Avisos>
      </div>
    </>
  );
}
