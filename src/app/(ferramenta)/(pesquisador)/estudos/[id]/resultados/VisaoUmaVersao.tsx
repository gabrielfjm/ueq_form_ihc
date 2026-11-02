import type { Route } from "next";
import Link from "next/link";
import { EscalasComBenchmark, FORMA_UNICA, type LinhaEscala } from "@/graficos/EscalasComBenchmark";
import graficos from "@/graficos/graficos.module.css";
import { MediasPorItem } from "@/graficos/MediasPorItem";
import { ehIdioma, termosDoIdioma } from "@/idiomas";
import { leituraDeUmaVersao } from "@/lib/leitura-rapida";
import { CONSTRUTO, NOME_BENCHMARK, NOME_CONSTRUTO, NOME_ESCALA } from "@/lib/nomes-ueq";
import { formatarDecimal, juntarComE, plural } from "@/lib/texto";
import { ESCALAS, numerosPorEscala, type AnaliseEstudo, type ItemUEQ, type TabelaBenchmark } from "@/ueq";
import { Explicacoes } from "./Explicacoes";
import { LegendaConstrutos, TituloSecao } from "./partes";
import estilos from "./resultados.module.css";
import { tradutor } from "@/traducao/servidor";

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

export async function VisaoUmaVersao({ analise, itens: itensDoBanco, benchmark, faixaNeutra, rotuloSelecao, ordemPorEscala, enderecoOrdem }: Propriedades) {
  const t = await tradutor();
  // Os 26 pares aparecem na tradução oficial do UEQ no idioma da ferramenta (data/ueq-idiomas.json)
  const termos = ehIdioma(t.idioma) ? new Map(termosDoIdioma(t.idioma).map((par) => [par.numero, par])) : null;
  const itens = itensDoBanco.map((item) => {
    const par = termos?.get(item.numero);
    return par ? { ...item, termoEsquerdo: par.termoEsquerdo, termoDireito: par.termoDireito } : item;
  });
  const escalas = analise.escalas.map((resultado) => ({ ...resultado, nome: t(NOME_ESCALA[resultado.escala]) }));
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
        {t(formatarDecimal(escala.media))}
        <span className={graficos.leitura}>
          {escala.faixaInterpretacao ? t(escala.faixaInterpretacao) : t("sem média")}
          {escala.benchmark ? ` · ${t(NOME_BENCHMARK[escala.benchmark])}` : ""}
        </span>
      </>
    ),
  }));

  const descricao = [
    t("Médias das seis escalas do UEQ com intervalo de confiança de 95% e faixas do benchmark."),
    ...escalas.map((escala) =>
      t("{nome}: média {media}, {ic}, {leitura}{benchmark}.", {
        nome: escala.nome,
        media: formatarDecimal(escala.media),
        ic: escala.ic
          ? t("IC de {inferior} a {superior}", { inferior: formatarDecimal(escala.ic.inferior), superior: formatarDecimal(escala.ic.superior) })
          : t("sem intervalo de confiança"),
        leitura: escala.faixaInterpretacao ? t(escala.faixaInterpretacao) : t("sem leitura"),
        benchmark: escala.benchmark ? t(", {faixa} no benchmark", { faixa: t(NOME_BENCHMARK[escala.benchmark]) }) : "",
      }),
    ),
  ].join(" ");

  const porNumero = new Map(analise.itens.map((item) => [item.numero, item.media]));
  const comMedia = (item: Item) => ({ ...item, media: porNumero.get(item.numero) ?? null });
  const gruposItens = ordemPorEscala
    ? ESCALAS.map((escala) => ({
        titulo: t(NOME_ESCALA[escala]),
        itens: itens.filter((item) => item.escala === escala).map(comMedia),
      }))
    : [{ itens: itens.map(comMedia) }];

  return (
    <>
      <section aria-labelledby="titulo-leitura" className={estilos.leitura}>
        <div className={estilos.leituraTexto}>
          <h2 id="titulo-leitura" className={estilos.rotuloLeitura}>
            {t("Leitura rápida")}
          </h2>
          <p className={estilos.frase}>{leituraDeUmaVersao(t, escalas)}</p>
          <p className={estilos.notaLeitura}>
            {t("Texto gerado a partir das médias e das faixas de interpretação. Os números estão no gráfico e na tabela logo abaixo.")}
          </p>
        </div>
        <dl className={estilos.ficha}>
          <div>
            <dt>{t("Atratividade")}</dt>
            <dd>
              <span className={estilos.fichaNumero}>{t(formatarDecimal(atratividade?.media))}</span>
              <span className={estilos.fichaDetalhe}>
                {atratividade?.faixaInterpretacao && t(atratividade.faixaInterpretacao)}
                {atratividade?.benchmark ? ` · ${t(NOME_BENCHMARK[atratividade.benchmark])}` : ""}
              </span>
            </dd>
          </div>
          <div>
            <dt>{t("Qualidade pragmática")}</dt>
            <dd>
              <span className={estilos.fichaNumero}>{t(formatarDecimal(analise.grupos.pragmatica))}</span>
              <span className={estilos.fichaDetalhe}>{t("perspicuidade, eficiência e confiabilidade")}</span>
            </dd>
          </div>
          <div>
            <dt>{t("Qualidade hedônica")}</dt>
            <dd>
              <span className={estilos.fichaNumero}>{t(formatarDecimal(analise.grupos.hedonica))}</span>
              <span className={estilos.fichaDetalhe}>{t("estimulação e novidade")}</span>
            </dd>
          </div>
        </dl>
      </section>

      <section aria-labelledby="titulo-escalas" className={estilos.secao} data-tutorial="escalas">
        <TituloSecao id="titulo-escalas" numero={1}>{t("Escalas")}</TituloSecao>
        {analise.n < 2 && (
          <p className={estilos.aviso}>
            <strong>{t("Amostra insuficiente para intervalo de confiança.")}</strong>{" "}{t("Com menos de 2 respostas na análise não há desvio-padrão nem IC95, e o gráfico mostra só a média. Espere mais respostas antes de interpretar.")}
          </p>
        )}
        <EscalasComBenchmark linhas={linhas} descricao={descricao} nomesGrupos={NOME_CONSTRUTO} legenda={<LegendaConstrutos />} />
        <Explicacoes />
      </section>

      <section aria-labelledby="titulo-tabela" className={estilos.secao}>
        <TituloSecao id="titulo-tabela" numero={2}>{t("Resultados por escala")}</TituloSecao>
        {/* Em tela estreita a tabela rola dentro da caixa; tabIndex deixa rolar pelo teclado (WCAG 2.1.1) */}
        <div className={estilos.rolagem} tabIndex={0} role="region" aria-labelledby="titulo-tabela">
          <table className={estilos.tabela}>
            <caption>
              {t("{rotuloSelecao}, {quantidade} na análise", { rotuloSelecao: rotuloSelecao, quantidade: plural(analise.n, t("participação"), t("participações")) })}
            </caption>
            <thead>
              <tr>
                <th scope="col">{t("Escala")}</th>
                <th scope="col" className={estilos.numero}>{t("n")}</th>
                <th scope="col" className={estilos.numero}>{t("Média")}</th>
                <th scope="col" className={estilos.numero}>{t("DP")}</th>
                <th scope="col" className={estilos.numero}>{t("IC95")}</th>
                <th scope="col" className={estilos.numero}>{t("Alfa")}</th>
                <th scope="col">{t("Leitura")}</th>
                <th scope="col">{t("Benchmark")}</th>
              </tr>
            </thead>
            <tbody>
              {escalas.map((escala) => (
                <tr key={escala.escala}>
                  <th scope="row">{t(escala.nome)}</th>
                  <td className={estilos.numero}>{escala.n}</td>
                  <td className={estilos.numero}>{t(formatarDecimal(escala.media))}</td>
                  <td className={estilos.numero}>{t(formatarDecimal(escala.dp))}</td>
                  <td className={estilos.numero}>
                    {escala.ic ? `${formatarDecimal(escala.ic.inferior)} a ${formatarDecimal(escala.ic.superior)}` : "—"}
                  </td>
                  <td className={`${estilos.numero} ${escala.alfaAbaixoDoMinimo ? estilos.alfaBaixo : ""}`}>
                    {t(formatarDecimal(escala.alfa))}
                    {escala.alfaAbaixoDoMinimo && <span aria-label={t(", abaixo de 0,7")}>*</span>}
                  </td>
                  <td>{escala.faixaInterpretacao ? t(escala.faixaInterpretacao) : "—"}</td>
                  <td>{escala.benchmark ? t(NOME_BENCHMARK[escala.benchmark]) : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {alfaBaixo.length > 0 && (
          // docs/ihc.md §4.3 (Nielsen 9): o aviso diz o que significa e o que fazer
          <p className={`${estilos.aviso} ${estilos.avisoAlerta}`}>
            <strong>{t("* Alfa abaixo de 0,7.")}</strong>{" "}
            {alfaBaixo.length === 1
              ? t("Os itens de {escalas} não andaram juntos neste grupo: a escala pode ter sido entendida de jeitos diferentes. Confira os itens {itens} em “Médias por item” antes de tirar conclusões sobre essa escala.", {
                  escalas: juntarComE(alfaBaixo.map((escala) => escala.nome), t.lang),
                  itens: juntarComE((numeros[alfaBaixo[0]!.escala] ?? []).map(String), t.lang),
                })
              : t("Os itens de {escalas} não andaram juntos neste grupo: as escalas podem ter sido entendidas de jeitos diferentes. Confira os itens {itens} em “Médias por item” antes de tirar conclusões sobre essas escalas.", {
                  escalas: juntarComE(alfaBaixo.map((escala) => escala.nome), t.lang),
                  itens: juntarComE(
                    alfaBaixo.map((escala) => `${juntarComE(numeros[escala.escala].map(String), t.lang)} (${escala.nome})`),
                    t.lang,
                  ),
                })}
            {analise.n < AMOSTRA_PEQUENA_ALFA && t(" Com menos de 50 respostas o alfa oscila bastante; trate como indício, não como conclusão.")}
          </p>
        )}
      </section>

      <section aria-labelledby="titulo-itens" className={estilos.secao}>
        <div className={estilos.secaoCabecalho}>
          <TituloSecao id="titulo-itens" numero={3}>{t("Médias por item")}</TituloSecao>
          <nav aria-label={t("Ordem dos itens")} className={estilos.alternar}>
            <Link href={enderecoOrdem(false)} aria-current={ordemPorEscala ? undefined : "page"} scroll={false}>
              {t("Ordem oficial")}
            </Link>
            <Link href={enderecoOrdem(true)} aria-current={ordemPorEscala ? "page" : undefined} scroll={false}>
              {t("Agrupado por escala")}
            </Link>
          </nav>
        </div>
        <p className={estilos.texto}>
          {t("Cada ponto é a média das respostas no par, do termo da esquerda (-3) ao da direita (+3). A ordem e os lados são os do questionário.")}
        </p>
        <MediasPorItem grupos={gruposItens} />
      </section>
    </>
  );
}
