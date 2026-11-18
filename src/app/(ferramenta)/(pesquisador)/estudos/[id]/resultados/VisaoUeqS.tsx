import { EscalasComBenchmark, FORMA_UNICA, type LinhaEscala } from "@/graficos/EscalasComBenchmark";
import graficos from "@/graficos/graficos.module.css";
import { MediasPorItem } from "@/graficos/MediasPorItem";
import { ehIdioma } from "@/idiomas";
import { termosDoUeqS } from "@/lib/instrumento";
import { leituraDeUmaVersao } from "@/lib/leitura-rapida";
import { GRUPOS_UEQ_S, NOME_BENCHMARK, NOME_ESCALA_UEQ_S } from "@/lib/nomes-ueq";
import { formatarDecimal, juntarComE, plural } from "@/lib/texto";
import type { AnaliseUeqS, EscalaUeqS, LimitesBenchmark } from "@/ueq";
import { Explicacoes } from "./Explicacoes";
import { CONSTRUTOS_UEQ_S, FonteDoMetodo, LegendaConstrutos, TituloSecao } from "./partes";
import estilos from "./resultados.module.css";
import { tradutor } from "@/traducao/servidor";

type Propriedades = {
  analise: AnaliseUeqS;
  benchmark: Record<EscalaUeqS, LimitesBenchmark>;
  faixaNeutra: { inferior: number; superior: number };
  rotuloSelecao: string;
};

// Handbook UEQ, p. 10: o alfa oscila muito em amostras pequenas
const AMOSTRA_PEQUENA_ALFA = 50;

// A avaliação do UEQ-S (RF62), separada da do UEQ completo porque as escalas são outras: qualidade pragmática
// (itens 1 a 4), hedônica (5 a 8) e geral (os 8). Mesma ordem de seções do painel do UEQ (protótipo r6)
export async function VisaoUeqS({ analise, benchmark, faixaNeutra, rotuloSelecao }: Propriedades) {
  const t = await tradutor();
  // Os 8 pares na tradução oficial do UEQ no idioma da ferramenta, como no questionário do UEQ-S
  const termos = termosDoUeqS(ehIdioma(t.idioma) ? t.idioma : "pt");
  const escalas = analise.escalas.map((resultado) => ({ ...resultado, nome: t(NOME_ESCALA_UEQ_S[resultado.escala]) }));
  const alfaBaixo = escalas.filter((escala) => escala.alfaAbaixoDoMinimo);
  const itensDaEscala = (escala: EscalaUeqS) => analise.itens.filter((item) => item.escala === escala).map((item) => item.ordem);

  const linhas: LinhaEscala[] = escalas.map((escala) => ({
    chave: escala.escala,
    nome: escala.nome,
    construto: escala.escala,
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
    t("Médias das três escalas do UEQ-S com intervalo de confiança de 95% e faixas do benchmark."),
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

  const porOrdem = new Map(analise.itens.map((item) => [item.ordem, item.media]));
  const grupos = (["pragmatica", "hedonica"] as const).map((grupo) => ({
    titulo: t("{escala} · {itens}", { escala: t(NOME_ESCALA_UEQ_S[grupo]), itens: t(GRUPOS_UEQ_S[grupo]) }),
    itens: termos
      .filter((par) => analise.itens.find((item) => item.ordem === par.numero)?.escala === grupo)
      .map((par) => ({ ...par, media: porOrdem.get(par.numero) ?? null })),
  }));

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
          {escalas.map((escala) => (
            <div key={escala.escala}>
              <dt>{escala.nome}</dt>
              <dd>
                <span className={estilos.fichaNumero}>{t(formatarDecimal(escala.media))}</span>
                <span className={estilos.fichaDetalhe}>
                  {escala.faixaInterpretacao && t(escala.faixaInterpretacao)}
                  {escala.benchmark ? ` · ${t(NOME_BENCHMARK[escala.benchmark])}` : ""}
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="titulo-escalas" className={estilos.secao} data-tutorial="escalas">
        <TituloSecao id="titulo-escalas" numero={1}>{t("Escalas")}</TituloSecao>
        {analise.n < 2 && (
          <p className={estilos.aviso}>
            <strong>{t("Amostra insuficiente para intervalo de confiança.")}</strong>{" "}{t("Com menos de 2 respostas na análise não há desvio-padrão nem IC95, e o gráfico mostra só a média. Espere mais respostas antes de interpretar.")}
          </p>
        )}
        <EscalasComBenchmark
          linhas={linhas}
          descricao={descricao}
          nomesGrupos={GRUPOS_UEQ_S}
          legenda={<LegendaConstrutos construtos={CONSTRUTOS_UEQ_S} />}
        />
        {/* A planilha oficial do UEQ-S (aba Benchmark) avisa que os limites ainda vêm do UEQ completo */}
        <p className={estilos.aviso}>
          <strong>{t("Benchmark aproximado.")}</strong>{" "}{t("Ainda não há dados suficientes da versão curta: os limites do UEQ-S vêm dos mesmos 8 itens dentro do UEQ completo. Use as faixas como uma primeira estimativa.")}
        </p>
        <Explicacoes instrumento="UEQ_S" />
      </section>

      <section aria-labelledby="titulo-tabela" className={estilos.secao}>
        <TituloSecao id="titulo-tabela" numero={2}>{t("Resultados por escala")}</TituloSecao>
        <div className={estilos.rolagem} tabIndex={0} role="region" aria-labelledby="titulo-tabela">
          <table className={estilos.tabela}>
            <caption>
              {t("{rotuloSelecao}, {quantidade} na análise", { rotuloSelecao, quantidade: plural(analise.n, t("participação"), t("participações")) })}
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
                  <th scope="row">{escala.nome}</th>
                  <td className={estilos.numero}>{escala.n}</td>
                  <td className={estilos.numero}>{t(formatarDecimal(escala.media))}</td>
                  <td className={estilos.numero}>{t(formatarDecimal(escala.dp))}</td>
                  <td className={estilos.numero}>
                    {escala.ic ? `${formatarDecimal(escala.ic.inferior)} a ${formatarDecimal(escala.ic.superior)}` : "—"}
                  </td>
                  <td className={`${estilos.numero} ${escala.alfaAbaixoDoMinimo ? estilos.alfaBaixo : ""}`}>
                    {/* A planilha não calcula alfa da escala geral, que junta duas escalas diferentes */}
                    {escala.escala === "geral" ? "—" : t(formatarDecimal(escala.alfa))}
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
          <p className={`${estilos.aviso} ${estilos.avisoAlerta}`}>
            <strong>{t("* Alfa abaixo de 0,7.")}</strong>{" "}
            {alfaBaixo.length === 1
              ? t("Os itens de {escalas} não andaram juntos neste grupo: a escala pode ter sido entendida de jeitos diferentes. Confira os itens {itens} em “Médias por item” antes de tirar conclusões sobre essa escala.", {
                  escalas: juntarComE(alfaBaixo.map((escala) => escala.nome), t.lang),
                  itens: juntarComE(itensDaEscala(alfaBaixo[0]!.escala).map(String), t.lang),
                })
              : t("Os itens de {escalas} não andaram juntos neste grupo: as escalas podem ter sido entendidas de jeitos diferentes. Confira os itens {itens} em “Médias por item” antes de tirar conclusões sobre essas escalas.", {
                  escalas: juntarComE(alfaBaixo.map((escala) => escala.nome), t.lang),
                  itens: juntarComE(
                    alfaBaixo.map((escala) => `${juntarComE(itensDaEscala(escala.escala).map(String), t.lang)} (${escala.nome})`),
                    t.lang,
                  ),
                })}
            {analise.n < AMOSTRA_PEQUENA_ALFA && t(" Com menos de 50 respostas o alfa oscila bastante; trate como indício, não como conclusão.")}
          </p>
        )}
      </section>

      <section aria-labelledby="titulo-itens" className={estilos.secao}>
        <TituloSecao id="titulo-itens" numero={3}>{t("Médias por item")}</TituloSecao>
        <p className={estilos.texto}>
          {t("Cada ponto é a média das respostas no par, do termo da esquerda (-3) ao da direita (+3). No UEQ-S o termo negativo fica sempre à esquerda.")}
        </p>
        <MediasPorItem grupos={grupos} />
        <FonteDoMetodo instrumento="UEQ_S" />
      </section>
    </>
  );
}
