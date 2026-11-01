import type { Route } from "next";
import Link from "next/link";
import { EscalasComBenchmark, FORMA_UNICA, type LinhaEscala } from "@/graficos/EscalasComBenchmark";
import graficos from "@/graficos/graficos.module.css";
import { MediasPorItem } from "@/graficos/MediasPorItem";
import { leituraDeUmaVersao } from "@/lib/leitura-rapida";
import { CONSTRUTO, NOME_BENCHMARK, NOME_CONSTRUTO, NOME_ESCALA } from "@/lib/nomes-ueq";
import { formatarDecimal, juntarComE, plural } from "@/lib/texto";
import { ESCALAS, numerosPorEscala, type AnaliseEstudo, type ItemUEQ, type TabelaBenchmark } from "@/ueq";
import { Explicacoes } from "./Explicacoes";
import { LegendaConstrutos, TituloSecao } from "./partes";
import estilos from "./resultados.module.css";

type Item = ItemUEQ & { termoEsquerdo: string; termoDireito: string };

type Propriedades = {
  analise: AnaliseEstudo;
  itens: Item[];
  benchmark: TabelaBenchmark;
  faixaNeutra: { inferior: number; superior: number };
  rotuloSelecao: string;
  ordemPorEscala: boolean;
  enderecoOrdem: (porEscala: boolean) => Route;
};

// Handbook UEQ, p. 10: o alfa oscila muito em amostras pequenas
const AMOSTRA_PEQUENA_ALFA = 50;

export function VisaoUmaVersao({ analise, itens, benchmark, faixaNeutra, rotuloSelecao, ordemPorEscala, enderecoOrdem }: Propriedades) {
  const escalas = analise.escalas.map((resultado) => ({ ...resultado, nome: NOME_ESCALA[resultado.escala] }));
  const numeros = numerosPorEscala(itens);
  const alfaBaixo = escalas.filter((escala) => escala.alfaAbaixoDoMinimo);
  const atratividade = escalas.find((escala) => escala.escala === "atratividade");

  const linhas: LinhaEscala[] = escalas.map((escala) => ({
    chave: escala.escala,
    nome: escala.nome,
    construto: CONSTRUTO[escala.escala],
    limites: benchmark[escala.escala],
    faixaNeutra,
    marcadores: [{ media: escala.media, ic: escala.ic, forma: FORMA_UNICA }],
    valor: (
      <>
        {formatarDecimal(escala.media)}
        <span className={graficos.leitura}>
          {escala.faixaInterpretacao ?? "sem média"}
          {escala.benchmark ? ` · ${NOME_BENCHMARK[escala.benchmark]}` : ""}
        </span>
      </>
    ),
  }));

  const descricao = `Médias das seis escalas do UEQ com intervalo de confiança de 95% e faixas do benchmark. ${escalas
    .map(
      (escala) =>
        `${escala.nome}: média ${formatarDecimal(escala.media)}, ${
          escala.ic ? `IC de ${formatarDecimal(escala.ic.inferior)} a ${formatarDecimal(escala.ic.superior)}` : "sem intervalo de confiança"
        }, ${escala.faixaInterpretacao ?? "sem leitura"}${escala.benchmark ? `, ${NOME_BENCHMARK[escala.benchmark]} no benchmark` : ""}.`,
    )
    .join(" ")}`;

  const porNumero = new Map(analise.itens.map((item) => [item.numero, item.media]));
  const comMedia = (item: Item) => ({ ...item, media: porNumero.get(item.numero) ?? null });
  const gruposItens = ordemPorEscala
    ? ESCALAS.map((escala) => ({
        titulo: NOME_ESCALA[escala],
        itens: itens.filter((item) => item.escala === escala).map(comMedia),
      }))
    : [{ itens: itens.map(comMedia) }];

  return (
    <>
      <section aria-labelledby="titulo-leitura" className={estilos.leitura}>
        <div className={estilos.leituraTexto}>
          <h2 id="titulo-leitura" className={estilos.rotuloLeitura}>
            Leitura rápida
          </h2>
          <p className={estilos.frase}>{leituraDeUmaVersao(escalas)}</p>
          <p className={estilos.notaLeitura}>
            Texto gerado a partir das médias e das faixas de interpretação. Os números estão no gráfico e na tabela logo abaixo.
          </p>
        </div>
        <dl className={estilos.ficha}>
          <div>
            <dt>Atratividade</dt>
            <dd>
              <span className={estilos.fichaNumero}>{formatarDecimal(atratividade?.media)}</span>
              <span className={estilos.fichaDetalhe}>
                {atratividade?.faixaInterpretacao}
                {atratividade?.benchmark ? ` · ${NOME_BENCHMARK[atratividade.benchmark]}` : ""}
              </span>
            </dd>
          </div>
          <div>
            <dt>Qualidade pragmática</dt>
            <dd>
              <span className={estilos.fichaNumero}>{formatarDecimal(analise.grupos.pragmatica)}</span>
              <span className={estilos.fichaDetalhe}>perspicuidade, eficiência e confiabilidade</span>
            </dd>
          </div>
          <div>
            <dt>Qualidade hedônica</dt>
            <dd>
              <span className={estilos.fichaNumero}>{formatarDecimal(analise.grupos.hedonica)}</span>
              <span className={estilos.fichaDetalhe}>estimulação e novidade</span>
            </dd>
          </div>
        </dl>
      </section>

      <section aria-labelledby="titulo-escalas" className={estilos.secao} data-tutorial="escalas">
        <TituloSecao id="titulo-escalas" numero={1}>Escalas</TituloSecao>
        {analise.n < 2 && (
          <p className={estilos.aviso}>
            <strong>Amostra insuficiente para intervalo de confiança.</strong> Com menos de 2 respostas na análise não há
            desvio-padrão nem IC95, e o gráfico mostra só a média. Espere mais respostas antes de interpretar.
          </p>
        )}
        <EscalasComBenchmark linhas={linhas} descricao={descricao} nomesGrupos={NOME_CONSTRUTO} legenda={<LegendaConstrutos />} />
        <Explicacoes />
      </section>

      <section aria-labelledby="titulo-tabela" className={estilos.secao}>
        <TituloSecao id="titulo-tabela" numero={2}>Resultados por escala</TituloSecao>
        {/* Em tela estreita a tabela rola dentro da caixa; tabIndex deixa rolar pelo teclado (WCAG 2.1.1) */}
        <div className={estilos.rolagem} tabIndex={0} role="region" aria-labelledby="titulo-tabela">
          <table className={estilos.tabela}>
            <caption>
              {rotuloSelecao}, {plural(analise.n, "participação", "participações")} na análise
            </caption>
            <thead>
              <tr>
                <th scope="col">Escala</th>
                <th scope="col" className={estilos.numero}>n</th>
                <th scope="col" className={estilos.numero}>Média</th>
                <th scope="col" className={estilos.numero}>DP</th>
                <th scope="col" className={estilos.numero}>IC95</th>
                <th scope="col" className={estilos.numero}>Alfa</th>
                <th scope="col">Leitura</th>
                <th scope="col">Benchmark</th>
              </tr>
            </thead>
            <tbody>
              {escalas.map((escala) => (
                <tr key={escala.escala}>
                  <th scope="row">{escala.nome}</th>
                  <td className={estilos.numero}>{escala.n}</td>
                  <td className={estilos.numero}>{formatarDecimal(escala.media)}</td>
                  <td className={estilos.numero}>{formatarDecimal(escala.dp)}</td>
                  <td className={estilos.numero}>
                    {escala.ic ? `${formatarDecimal(escala.ic.inferior)} a ${formatarDecimal(escala.ic.superior)}` : "—"}
                  </td>
                  <td className={`${estilos.numero} ${escala.alfaAbaixoDoMinimo ? estilos.alfaBaixo : ""}`}>
                    {formatarDecimal(escala.alfa)}
                    {escala.alfaAbaixoDoMinimo && <span aria-label=", abaixo de 0,7">*</span>}
                  </td>
                  <td>{escala.faixaInterpretacao ?? "—"}</td>
                  <td>{escala.benchmark ? NOME_BENCHMARK[escala.benchmark] : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {alfaBaixo.length > 0 && (
          // docs/ihc.md §4.3 (Nielsen 9): o aviso diz o que significa e o que fazer
          <p className={`${estilos.aviso} ${estilos.avisoAlerta}`}>
            <strong>* Alfa abaixo de 0,7.</strong> Os itens de {juntarComE(alfaBaixo.map((escala) => escala.nome))} não andaram
            juntos neste grupo: {alfaBaixo.length === 1 ? "a escala pode ter sido entendida" : "as escalas podem ter sido entendidas"}{" "}
            de jeitos diferentes. Confira os itens{" "}
            {juntarComE(
              alfaBaixo.map(
                (escala) => `${juntarComE(numeros[escala.escala].map(String))}${alfaBaixo.length > 1 ? ` (${escala.nome})` : ""}`,
              ),
            )}{" "}
            em “Médias por item” antes de tirar conclusões sobre {alfaBaixo.length === 1 ? "essa escala" : "essas escalas"}.
            {analise.n < AMOSTRA_PEQUENA_ALFA && " Com menos de 50 respostas o alfa oscila bastante; trate como indício, não como conclusão."}
          </p>
        )}
      </section>

      <section aria-labelledby="titulo-itens" className={estilos.secao}>
        <div className={estilos.secaoCabecalho}>
          <TituloSecao id="titulo-itens" numero={3}>Médias por item</TituloSecao>
          <nav aria-label="Ordem dos itens" className={estilos.alternar}>
            <Link href={enderecoOrdem(false)} aria-current={ordemPorEscala ? undefined : "page"} scroll={false}>
              Ordem oficial
            </Link>
            <Link href={enderecoOrdem(true)} aria-current={ordemPorEscala ? "page" : undefined} scroll={false}>
              Agrupado por escala
            </Link>
          </nav>
        </div>
        <p className={estilos.texto}>
          Cada ponto é a média das respostas no par, do termo da esquerda (-3) ao da direita (+3). A ordem e os lados são os
          do questionário.
        </p>
        <MediasPorItem grupos={gruposItens} />
      </section>
    </>
  );
}
