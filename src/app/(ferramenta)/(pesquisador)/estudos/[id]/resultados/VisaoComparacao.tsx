import { Fragment } from "react";
import { EscalasComBenchmark, FiguraMarcador, FORMA_UNICA, FORMAS, type LinhaEscala } from "@/graficos/EscalasComBenchmark";
import graficos from "@/graficos/graficos.module.css";
import { leituraDaComparacao } from "@/lib/leitura-rapida";
import type { Instrumento } from "@/lib/instrumento";
import { CONSTRUTO, GRUPOS_UEQ_S, NOME_CONSTRUTO, NOME_ESCALA, NOME_ESCALA_UEQ_S, type Construto } from "@/lib/nomes-ueq";
import { formatarDecimal } from "@/lib/texto";
import { ESCALAS, ESCALAS_UEQ_S, type Intervalo, type LimitesBenchmark } from "@/ueq";
import { CONSTRUTOS_UEQ_S, LegendaConstrutos, TituloSecao } from "./partes";
import estilos from "./resultados.module.css";
import { tradutor } from "@/traducao/servidor";
import { m } from "@/traducao/nucleo";

// Serve às duas análises: as escalas vêm na ordem da planilha de cada instrumento
type VersaoComparada = { versaoId: string; nome: string; analise: { escalas: { media: number | null; ic: Intervalo | null }[] } };

type Propriedades = {
  versoes: VersaoComparada[];
  benchmark: Record<string, LimitesBenchmark>;
  faixaNeutra: { inferior: number; superior: number };
  instrumento?: Instrumento;
};

const ESCALAS_DA_COMPARACAO: Record<Instrumento, { chave: string; nome: string; construto: Construto }[]> = {
  UEQ: ESCALAS.map((escala) => ({ chave: escala, nome: NOME_ESCALA[escala], construto: CONSTRUTO[escala] })),
  UEQ_S: ESCALAS_UEQ_S.map((escala) => ({ chave: escala, nome: NOME_ESCALA_UEQ_S[escala], construto: escala })),
};

const formaDa = (indice: number) => FORMAS[indice % FORMAS.length] ?? { ...FORMA_UNICA, nome: m("círculo cheio") };

export async function LegendaVersoes({ versoes }: { versoes: { nome: string; n: number }[] }) {
  const t = await tradutor();
  return (
    <ul aria-label={t("Legenda das versões")} className={estilos.legendaVersoes}>
      {versoes.map((versao, indice) => {
        const forma = formaDa(indice);
        return (
          <li key={versao.nome} className={graficos.atratividade}>
            <svg width="14" height="14" aria-hidden="true">
              <FiguraMarcador x={7} y={7} forma={forma} />
            </svg>
            {t(versao.nome)} <span className={estilos.detalheLegenda}>{t("{nome} · n = {n}", { nome: forma.nome, n: versao.n })}</span>
          </li>
        );
      })}
    </ul>
  );
}

// Protótipo r7: médias lado a lado, um marcador por versão. Sem teste estatístico (fora do escopo)
export async function VisaoComparacao({ versoes, benchmark, faixaNeutra, instrumento = "UEQ" }: Propriedades) {
  const t = await tradutor();
  const media = (versao: VersaoComparada, posicao: number) => versao.analise.escalas[posicao]?.media ?? null;
  const duas = versoes.length === 2;
  const escalas = ESCALAS_DA_COMPARACAO[instrumento];
  const ueqS = instrumento === "UEQ_S";

  const linhas: LinhaEscala[] = escalas.map(({ chave: escala, nome, construto }, posicao) => {
    const primeira = versoes[0] ? media(versoes[0], posicao) : null;
    const segunda = versoes[1] ? media(versoes[1], posicao) : null;
    return {
      chave: escala,
      nome: t(nome),
      construto,
      limites: benchmark[escala]!,
      faixaNeutra,
      marcadores: versoes.map((versao, indice) => ({ media: media(versao, posicao), ic: null, forma: formaDa(indice) })),
      valor: (
        <>
          {versoes.map((versao, indice) => (
            <Fragment key={versao.versaoId}>
              <svg width="12" height="12" aria-hidden="true" className={graficos.marcaValor}>
                <FiguraMarcador x={6} y={6} forma={formaDa(indice)} />
              </svg>
              {t(formatarDecimal(media(versao, posicao)))}
            </Fragment>
          ))}
          {duas && primeira !== null && segunda !== null && (
            <span className={graficos.leitura}>{t("diferença {decimal}", { decimal: formatarDecimal(primeira - segunda) })}</span>
          )}
        </>
      ),
    };
  });

  const descricao = [
    duas ? t("Médias por escala nas duas versões.") : t("Médias por escala nas {n} versões.", { n: versoes.length }),
    ...escalas.map(
      ({ nome }, posicao) =>
        `${t(nome)}: ${versoes.map((versao) => `${versao.nome} ${formatarDecimal(media(versao, posicao))}`).join(", ")}.`,
    ),
  ].join(" ");

  const leitura = leituraDaComparacao(
    t,
    escalas.map(({ nome }) => t(nome)),
    versoes.map((versao) => ({ nome: versao.nome, medias: escalas.map((_, posicao) => media(versao, posicao)) })),
  );

  return (
    <>
      {leitura && (
        <section aria-labelledby="titulo-leitura" className={estilos.leituraComparacao}>
          <h2 id="titulo-leitura" className={estilos.rotuloLeitura}>
            {t("Leitura rápida")}
          </h2>
          <p className={estilos.frase}>{t(leitura)}</p>
        </section>
      )}

      <section aria-labelledby="titulo-comparacao" className={estilos.secao} data-tutorial="escalas">
        <TituloSecao id="titulo-comparacao" numero={1}>{t("Escalas por versão")}</TituloSecao>
        <EscalasComBenchmark
          linhas={linhas}
          descricao={descricao}
          nomesGrupos={ueqS ? GRUPOS_UEQ_S : NOME_CONSTRUTO}
          legenda={<LegendaConstrutos comIntervalo={false} construtos={ueqS ? CONSTRUTOS_UEQ_S : undefined} />}
        />
        <p className={estilos.aviso}>
          {t("A comparação mostra as médias lado a lado, sem teste estatístico. Para afirmar que uma versão é melhor, rode um teste adequado sobre os dados exportados.")}
        </p>
      </section>

      <section aria-labelledby="titulo-tabela-comparacao" className={estilos.secao}>
        <TituloSecao id="titulo-tabela-comparacao" numero={2}>{t("Médias por versão")}</TituloSecao>
        {/* Em tela estreita a tabela rola dentro da caixa; tabIndex deixa rolar pelo teclado (WCAG 2.1.1) */}
        <div className={estilos.rolagem} tabIndex={0} role="region" aria-labelledby="titulo-tabela-comparacao">
          <table className={estilos.tabela}>
            <caption className="visualmente-oculto">{t("Média e IC95 de cada escala, por versão")}</caption>
            <thead>
              <tr>
                <th scope="col">{t("Escala")}</th>
                {versoes.map((versao) => (
                  <Fragment key={versao.versaoId}>
                    <th scope="col" className={estilos.numero}>{t(versao.nome)}</th>
                    <th scope="col" className={estilos.numero}>{t("IC95")}</th>
                  </Fragment>
                ))}
                {duas && <th scope="col" className={estilos.numero}>{t("Diferença")}</th>}
              </tr>
            </thead>
            <tbody>
              {escalas.map(({ chave: escala, nome }, posicao) => {
                const [a, b] = versoes.map((versao) => media(versao, posicao));
                return (
                  <tr key={escala}>
                    <th scope="row">{t(nome)}</th>
                    {versoes.map((versao) => {
                      const ic = versao.analise.escalas[posicao]?.ic;
                      return (
                        <Fragment key={versao.versaoId}>
                          <td className={estilos.numero}>{t(formatarDecimal(media(versao, posicao)))}</td>
                          <td className={estilos.numero}>{ic ? `${formatarDecimal(ic.inferior)} a ${formatarDecimal(ic.superior)}` : "—"}</td>
                        </Fragment>
                      );
                    })}
                    {duas && (
                      <td className={estilos.numero}>
                        {a !== null && a !== undefined && b !== null && b !== undefined ? formatarDecimal(a - b) : "—"}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {duas && (
          <p className={estilos.texto}>
            {t("Diferença =")}{" "}{versoes[0]?.nome}{" "}{t("menos")}{" "}{versoes[1]?.nome}.
          </p>
        )}
      </section>
    </>
  );
}
