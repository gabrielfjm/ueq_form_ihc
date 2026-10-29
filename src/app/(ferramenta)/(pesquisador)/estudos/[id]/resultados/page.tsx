import type { Metadata, Route } from "next";
import { contagemDeRespostas, estudoDoPesquisador } from "@/lib/estudos";
import { analisarResultados } from "@/lib/resultados";
import { exigirPesquisador } from "@/lib/sessao";
import { FaixaEstudo, resumoDoEstudo } from "../FaixaEstudo";
import { ControlesResultados } from "./ControlesResultados";
import estilos from "./resultados.module.css";
import { SecaoExportar } from "./SecaoExportar";
import { LegendaVersoes, VisaoComparacao } from "./VisaoComparacao";
import { VisaoUmaVersao } from "./VisaoUmaVersao";

type Propriedades = {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params }: Propriedades): Promise<Metadata> {
  const pesquisador = await exigirPesquisador();
  const estudo = await estudoDoPesquisador((await params).id, pesquisador.id);
  return { title: `Resultados · ${estudo.titulo} · Ferramenta UEQ` };
}

const texto = (valor: string | string[] | undefined) => (typeof valor === "string" ? valor : undefined);

export default async function PaginaResultados({ params, searchParams }: Propriedades) {
  const pesquisador = await exigirPesquisador();
  const estudo = await estudoDoPesquisador((await params).id, pesquisador.id);
  const busca = await searchParams;
  const [respostas, resultados] = await Promise.all([
    contagemDeRespostas(estudo.id),
    analisarResultados(estudo.id, estudo.versoes),
  ]);

  // prompts/04: com uma versão só não existe comparação nem seletor de versão
  const variasVersoes = estudo.versoes.length > 1;
  const comparando = variasVersoes && texto(busca.modo) === "comparar";
  const versaoEscolhida = resultados.porVersao.find((versao) => versao.versaoId === texto(busca.versao));
  const analise = versaoEscolhida?.analise ?? resultados.todas;
  const ordemPorEscala = texto(busca.itens) === "escala";

  // Monta o endereço da alternância de ordem dos itens preservando versão e modo
  const enderecoOrdem = (porEscala: boolean): Route => {
    const proximos = new URLSearchParams();
    for (const [chave, valor] of Object.entries(busca)) if (typeof valor === "string") proximos.set(chave, valor);
    if (porEscala) proximos.set("itens", "escala");
    else proximos.delete("itens");
    const consulta = proximos.toString();
    return `/estudos/${estudo.id}/resultados${consulta ? `?${consulta}` : ""}` as Route;
  };

  return (
    <>
      <FaixaEstudo
        estudoId={estudo.id}
        titulo={estudo.titulo}
        status={estudo.status}
        resumo={resumoDoEstudo(estudo.status, estudo.versoes.length, respostas)}
      />
      <div className={estilos.conteudo}>
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

        {resultados.todas.n === 0 ? (
          <section aria-labelledby="titulo-vazio" className={estilos.vazio}>
            <h2 id="titulo-vazio">Nenhuma resposta na análise ainda.</h2>
            <p>
              {respostas.total > 0
                ? "Todas as respostas coletadas estão fora da análise. Inclua de volta pela aba Respostas para ver os resultados."
                : "As médias, os intervalos de confiança, o alfa e o benchmark das 6 escalas aparecem aqui assim que chegar a primeira resposta."}
            </p>
          </section>
        ) : comparando ? (
          <VisaoComparacao versoes={resultados.porVersao} benchmark={resultados.benchmark} faixaNeutra={resultados.faixaNeutra} />
        ) : (
          <VisaoUmaVersao
            analise={analise}
            itens={resultados.itens}
            benchmark={resultados.benchmark}
            faixaNeutra={resultados.faixaNeutra}
            rotuloSelecao={versaoEscolhida ? `Versão ${versaoEscolhida.nome}` : variasVersoes ? "Todas as versões" : "Estudo completo"}
            ordemPorEscala={ordemPorEscala}
            enderecoOrdem={enderecoOrdem}
          />
        )}
        {/* As exportações saem do estudo inteiro; ficam no fim do modo "Uma versão", como no protótipo r6 */}
        {respostas.total > 0 && !comparando && <SecaoExportar estudoId={estudo.id} titulo={estudo.titulo} numero={resultados.todas.n === 0 ? 1 : 4} />}
      </div>
    </>
  );
}
