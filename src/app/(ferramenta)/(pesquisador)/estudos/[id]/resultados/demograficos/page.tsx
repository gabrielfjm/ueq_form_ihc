import type { Metadata, Route } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Demografia } from "@/graficos/Demografia";
import { demografiasNaAnalise } from "@/lib/demografias";
import { contagemDeRespostas, estudoDoPesquisador } from "@/lib/estudos";
import { perfilDemografico } from "@/lib/perfil-demografico";
import { exigirPesquisador } from "@/lib/sessao";
import { plural } from "@/lib/texto";
import { FaixaEstudo, resumoDoEstudo } from "../../FaixaEstudo";
import { AbasResultados } from "../AbasResultados";
import estilos from "../resultados.module.css";
import { tradutor } from "@/traducao/servidor";

type Propriedades = {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params }: Propriedades): Promise<Metadata> {
  const t = await tradutor();
  const pesquisador = await exigirPesquisador();
  const estudo = await estudoDoPesquisador((await params).id, pesquisador);
  return { title: t("Dados demográficos · {titulo} · Ferramenta UEQ", { titulo: estudo.titulo }) };
}

// Resultados › Dados demográficos: só existe quando o estudo coleta (ou já coletou) esses dados
export default async function PaginaDemograficos({ params, searchParams }: Propriedades) {
  const t = await tradutor();
  const pesquisador = await exigirPesquisador();
  const estudo = await estudoDoPesquisador((await params).id, pesquisador);
  const { versao } = await searchParams;
  const versaoEscolhida = estudo.versoes.find((item) => item.id === versao);
  const [respostas, demografias, todas] = await Promise.all([
    contagemDeRespostas(estudo.id),
    demografiasNaAnalise(estudo.id, versaoEscolhida?.id),
    versaoEscolhida ? demografiasNaAnalise(estudo.id) : Promise.resolve(null),
  ]);
  const temDados = (todas ?? demografias).some((demografia) => demografia !== null);
  if (!estudo.coletarDemografia && !temDados) notFound();

  const link = (versaoId?: string) =>
    `/estudos/${estudo.id}/resultados/demograficos${versaoId ? `?versao=${versaoId}` : ""}` as Route;

  return (
    <>
      <FaixaEstudo estudo={estudo} ajuda="resultados" resumo={resumoDoEstudo(t, estudo.status, estudo.versoes.length, respostas)} />
      <div className={estilos.conteudo}>
        <div className={estilos.blocoDemografia}>
          <div className={estilos.topo}>
            <AbasResultados estudoId={estudo.id} atual="demografia" />
            <div className={estilos.cabecalhoDemografia}>
              <p className={estilos.textoDemografia}>
                {versaoEscolhida
                  ? t("Respostas da etapa opcional “Dados opcionais”, das {quantidade} na análise que vieram pelo link da versão “{versao}”. As importadas de CSV não têm essa etapa.", {
                      quantidade: plural(demografias.length, t("participação"), t("participações")),
                      versao: versaoEscolhida.nome,
                    })
                  : t("Respostas da etapa opcional “Dados opcionais”, das {quantidade} na análise que vieram pelo link. As importadas de CSV não têm essa etapa.", {
                      quantidade: plural(demografias.length, t("participação"), t("participações")),
                    })}
              </p>
              {estudo.versoes.length > 1 && (
                <nav aria-label={t("Versão")} className={estilos.filtroVersao}>
                  <Link href={link()} aria-current={versaoEscolhida ? undefined : "page"} scroll={false}>
                    {t("Todas as versões")}
                  </Link>
                  {estudo.versoes.map((item) => (
                    <Link key={item.id} href={link(item.id)} aria-current={versaoEscolhida?.id === item.id ? "page" : undefined} scroll={false}>
                      {t(item.nome)}
                    </Link>
                  ))}
                </nav>
              )}
            </div>
          </div>
          {demografias.length === 0 ? (
            <p className={estilos.textoDemografia}>{t("Nenhuma participação na análise para mostrar os dados demográficos ainda.")}</p>
          ) : (
            <section aria-label={t("Gráficos dos dados demográficos")}>
              <Demografia perguntas={perfilDemografico(demografias)} />
            </section>
          )}
        </div>
      </div>
    </>
  );
}
