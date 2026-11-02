import type { Metadata, Route } from "next";
import Link from "next/link";
import { estudoDoPesquisador } from "@/lib/estudos";
import { analisarResultados } from "@/lib/resultados";
import { exigirPesquisador } from "@/lib/sessao";
import { plural } from "@/lib/texto";
import estilos from "../resultados.module.css";
import { LegendaVersoes, VisaoComparacao } from "../VisaoComparacao";
import { VisaoUmaVersao } from "../VisaoUmaVersao";
import impressao from "./impressao.module.css";
import { tradutor } from "@/traducao/servidor";

type Propriedades = {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params }: Propriedades): Promise<Metadata> {
  const t = await tradutor();
  const pesquisador = await exigirPesquisador();
  const estudo = await estudoDoPesquisador((await params).id, pesquisador);
  return { title: t("Painel para impressão · {titulo} · Ferramenta UEQ", { titulo: estudo.titulo }) };
}

const texto = (valor: string | string[] | undefined) => (typeof valor === "string" ? valor : undefined);

// Com o ano: o PDF vai para o relatório e é guardado. Hora de Brasília, como o resto da ferramenta
const DATA_GERACAO = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "America/Sao_Paulo",
});
const dataDeGeracao = (data: Date, lang: string) =>
  lang === "pt-BR"
    ? DATA_GERACAO.format(data).replace(", ", " às ")
    : new Intl.DateTimeFormat(lang, { dateStyle: "short", timeStyle: "short", timeZone: "America/Sao_Paulo" }).format(data);

// prompts/10-extensoes.md: a versão impressa do painel, que /api/estudos/[id]/painel-pdf transforma em PDF.
// Os mesmos componentes da tela, com a mesma versão e o mesmo modo da URL; o CSS de impressão tira a navegação
// e os controles. Os gráficos são SVG, então saem em vetor
export default async function PaginaImpressao({ params, searchParams }: Propriedades) {
  const t = await tradutor();
  const pesquisador = await exigirPesquisador();
  const estudo = await estudoDoPesquisador((await params).id, pesquisador);
  const busca = await searchParams;
  const resultados = await analisarResultados(estudo.id, estudo.versoes);

  const variasVersoes = estudo.versoes.length > 1;
  const comparando = variasVersoes && texto(busca.modo) === "comparar";
  const versaoEscolhida = resultados.porVersao.find((versao) => versao.versaoId === texto(busca.versao));
  const analise = versaoEscolhida?.analise ?? resultados.todas;
  const ordemPorEscala = texto(busca.itens) === "escala";
  const selecao = comparando
    ? t("Comparação entre as versões")
    : versaoEscolhida
      ? t("Versão {nome}", { nome: versaoEscolhida.nome })
      : variasVersoes
        ? t("Todas as versões")
        : t("Estudo completo");
  const n = comparando ? resultados.todas.n : analise.n;
  // Na impressão não há o que alternar; o endereço só precisa existir para o componente
  const enderecoOrdem = (): Route => `/estudos/${estudo.id}/resultados` as Route;

  return (
    <div className={`${estilos.conteudo} ${impressao.pagina}`}>
      <p className={impressao.voltar}>
        <Link href={`/estudos/${estudo.id}/resultados` as Route}>{t("Voltar para os resultados")}</Link>
      </p>
      <header className={impressao.cabecalho}>
        <p className={impressao.ferramenta}>{t("Ferramenta UEQ · Painel de resultados")}</p>
        <h1 className={impressao.titulo}>{t(estudo.titulo)}</h1>
        <dl className={impressao.dados}>
          <div>
            <dt>{t("Produto avaliado")}</dt>
            <dd>{t(estudo.produtoAvaliado)}</dd>
          </div>
          <div>
            <dt>{t("Seleção")}</dt>
            <dd>{t(selecao)}</dd>
          </div>
          <div>
            <dt>{t("n na análise")}</dt>
            <dd className={estilos.numero}>{t(plural(n, t("participação"), t("participações")))}</dd>
          </div>
          <div>
            <dt>{t("Gerado em")}</dt>
            <dd className={estilos.numero}>{dataDeGeracao(new Date(), t.lang)}</dd>
          </div>
        </dl>
        {comparando && (
          <LegendaVersoes versoes={resultados.porVersao.map((versao) => ({ nome: versao.nome, n: versao.analise.n }))} />
        )}
      </header>

      {resultados.todas.n === 0 ? (
        <p>{t("Nenhuma resposta na análise ainda.")}</p>
      ) : comparando ? (
        <VisaoComparacao versoes={resultados.porVersao} benchmark={resultados.benchmark} faixaNeutra={resultados.faixaNeutra} />
      ) : (
        <VisaoUmaVersao
          analise={analise}
          itens={resultados.itens}
          benchmark={resultados.benchmark}
          faixaNeutra={resultados.faixaNeutra}
          rotuloSelecao={selecao}
          ordemPorEscala={ordemPorEscala}
          enderecoOrdem={enderecoOrdem}
        />
      )}
    </div>
  );
}
