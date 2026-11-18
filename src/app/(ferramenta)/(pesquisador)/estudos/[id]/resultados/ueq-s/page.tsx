import { Download } from "lucide-react";
import type { Metadata } from "next";
import { nomeDoArquivo } from "@/lib/exportar-estudo";
import { contagemDeRespostas, estudoDoPesquisador } from "@/lib/estudos";
import { analisarResultadosUeqS } from "@/lib/resultados";
import { exigirPesquisador } from "@/lib/sessao";
import { FaixaEstudo, resumoDoEstudo } from "../../FaixaEstudo";
import { AbasResultados } from "../AbasResultados";
import { ControlesResultados } from "../ControlesResultados";
import estilos from "../resultados.module.css";
import { SecaoExportar } from "../SecaoExportar";
import { LegendaVersoes, VisaoComparacao } from "../VisaoComparacao";
import { VisaoUeqS } from "../VisaoUeqS";
import { tradutor } from "@/traducao/servidor";

type Propriedades = {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params }: Propriedades): Promise<Metadata> {
  const t = await tradutor();
  const pesquisador = await exigirPesquisador();
  const estudo = await estudoDoPesquisador((await params).id, pesquisador);
  return { title: t("UEQ-S · {titulo} · Ferramenta UEQ", { titulo: estudo.titulo }) };
}

const texto = (valor: string | string[] | undefined) => (typeof valor === "string" ? valor : undefined);

// Resultados › UEQ-S (RF62): a avaliação da versão curta numa aba própria, porque as escalas mudam (qualidade
// pragmática, hedônica e geral, sem as 6 do UEQ). Num estudo do UEQ-S é o painel inteiro; num do UEQ completo,
// o UEQ-S calculado com os 8 itens dele que o participante também respondeu
export default async function PaginaResultadosUeqS({ params, searchParams }: Propriedades) {
  const t = await tradutor();
  const pesquisador = await exigirPesquisador();
  const estudo = await estudoDoPesquisador((await params).id, pesquisador);
  const busca = await searchParams;
  const [respostas, resultados] = await Promise.all([
    contagemDeRespostas(estudo.id),
    analisarResultadosUeqS(estudo.id, estudo.versoes),
  ]);
  const doUeqCompleto = estudo.instrumento === "UEQ";

  const variasVersoes = estudo.versoes.length > 1;
  const comparando = variasVersoes && texto(busca.modo) === "comparar";
  const versaoEscolhida = resultados.porVersao.find((versao) => versao.versaoId === texto(busca.versao));
  const analise = versaoEscolhida?.analise ?? resultados.todas;

  const selecao = new URLSearchParams();
  for (const chave of ["versao", "modo"]) {
    const valor = texto(busca[chave]);
    if (valor) selecao.set(chave, valor);
  }
  const consultaPainel = selecao.size > 0 ? `?${selecao.toString()}` : "";
  const consultaPdf = doUeqCompleto ? `${consultaPainel ? `${consultaPainel}&` : "?"}instrumento=ueq-s` : consultaPainel;

  return (
    <>
      <FaixaEstudo estudo={estudo} ajuda="resultados" resumo={resumoDoEstudo(t, estudo.status, estudo.versoes.length, respostas)} />
      <div className={estilos.conteudo}>
        <div className={estilos.topo}>
          <AbasResultados estudoId={estudo.id} atual="ueq-s" instrumento={estudo.instrumento} demografia={estudo.coletarDemografia} />
          <ControlesResultados
            estudoId={estudo.id}
            versoes={resultados.porVersao.map((versao) => ({ id: versao.versaoId, nome: versao.nome, naAnalise: versao.analise.n }))}
            naAnaliseTotal={resultados.todas.n}
            foraDaAnalise={resultados.todas.nExcluidas}
            comparando={comparando}
          >
            {comparando && (
              <LegendaVersoes versoes={resultados.porVersao.map((versao) => ({ nome: versao.nome, n: versao.analise.n }))} />
            )}
          </ControlesResultados>
        </div>

        {/* Nielsen 10: num estudo do UEQ completo, diz de onde vêm estes números antes de qualquer gráfico */}
        {doUeqCompleto && (
          <p className={`${estilos.aviso} ${estilos.avisoUeqS}`}>
            <strong>{t("O UEQ-S a partir do UEQ completo.")}</strong>{" "}
            {t("O UEQ-S são 8 dos 26 pares: 11, 13, 20 e 21 (qualidade pragmática) e 6, 7, 10 e 15 (qualidade hedônica). Esta aba usa as respostas que os participantes deram a esses pares, do mesmo jeito que os autores montaram o UEQ-S e o benchmark dele. Para as 6 escalas, volte à aba Escalas do UEQ.")}
          </p>
        )}

        {resultados.todas.n === 0 ? (
          <section aria-labelledby="titulo-vazio" className={estilos.vazio}>
            <h2 id="titulo-vazio">{t("Nenhuma resposta na análise ainda.")}</h2>
            <p>
              {respostas.total > 0
                ? t("Todas as respostas coletadas estão fora da análise. Inclua de volta pela aba Respostas para ver os resultados.")
                : t("As médias, os intervalos de confiança, o alfa e o benchmark da qualidade pragmática, da hedônica e da geral aparecem aqui assim que chegar a primeira resposta.")}
            </p>
          </section>
        ) : comparando ? (
          <>
            <VisaoComparacao versoes={resultados.porVersao} benchmark={resultados.benchmark} faixaNeutra={resultados.faixaNeutra} instrumento="UEQ_S" />
            <p className={estilos.pdfComparacao}>
              <a
                href={`/api/estudos/${estudo.id}/painel-pdf${consultaPdf}`}
                download={nomeDoArquivo(estudo.titulo, "painel-ueq-s")}
                className={estilos.linkExportar}
              >
                <Download size={18} strokeWidth={1.5} aria-hidden="true" />
                <span>{t("Painel em PDF")}</span>
              </a>
              <span>{t("Esta comparação em A4, com os gráficos em vetor.")}</span>
            </p>
          </>
        ) : (
          <VisaoUeqS
            analise={analise}
            benchmark={resultados.benchmark}
            faixaNeutra={resultados.faixaNeutra}
            rotuloSelecao={versaoEscolhida ? t("Versão {nome}", { nome: versaoEscolhida.nome }) : variasVersoes ? t("Todas as versões") : t("Estudo completo")}
          />
        )}
        {respostas.total > 0 && !comparando && (
          <SecaoExportar
            estudoId={estudo.id}
            titulo={estudo.titulo}
            numero={resultados.todas.n === 0 ? 1 : 4}
            consulta={consultaPainel}
            versao={versaoEscolhida ? { id: versaoEscolhida.versaoId, nome: versaoEscolhida.nome } : undefined}
            naPlanilha={analise.n}
            modo={doUeqCompleto ? "ueq-s-do-ueq" : "ueq-s"}
          />
        )}
      </div>
    </>
  );
}
