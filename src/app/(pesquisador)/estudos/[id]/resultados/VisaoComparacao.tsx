import { Fragment } from "react";
import { EscalasComBenchmark, FiguraMarcador, FORMA_UNICA, FORMAS, type LinhaEscala } from "@/graficos/EscalasComBenchmark";
import graficos from "@/graficos/graficos.module.css";
import { leituraDaComparacao } from "@/lib/leitura-rapida";
import { CONSTRUTO, NOME_CONSTRUTO, NOME_ESCALA } from "@/lib/nomes-ueq";
import type { AnalisePorVersao } from "@/lib/resultados";
import { formatarDecimal } from "@/lib/texto";
import { ESCALAS, type TabelaBenchmark } from "@/ueq";
import { LegendaConstrutos, TituloSecao } from "./partes";
import estilos from "./resultados.module.css";

type Propriedades = {
  versoes: AnalisePorVersao[];
  benchmark: TabelaBenchmark;
  faixaNeutra: { inferior: number; superior: number };
};

const formaDa = (indice: number) => FORMAS[indice % FORMAS.length] ?? { ...FORMA_UNICA, nome: "círculo cheio" };

export function LegendaVersoes({ versoes }: { versoes: { nome: string; n: number }[] }) {
  return (
    <ul aria-label="Legenda das versões" className={estilos.legendaVersoes}>
      {versoes.map((versao, indice) => {
        const forma = formaDa(indice);
        return (
          <li key={versao.nome} className={graficos.atratividade}>
            <svg width="14" height="14" aria-hidden="true">
              <FiguraMarcador x={7} y={7} forma={forma} />
            </svg>
            {versao.nome} <span className={estilos.detalheLegenda}>{forma.nome} · n = {versao.n}</span>
          </li>
        );
      })}
    </ul>
  );
}

// Protótipo r7: médias lado a lado, um marcador por versão. Sem teste estatístico (fora do escopo)
export function VisaoComparacao({ versoes, benchmark, faixaNeutra }: Propriedades) {
  const media = (versao: AnalisePorVersao, posicao: number) => versao.analise.escalas[posicao]?.media ?? null;
  const duas = versoes.length === 2;

  const linhas: LinhaEscala[] = ESCALAS.map((escala, posicao) => {
    const primeira = versoes[0] ? media(versoes[0], posicao) : null;
    const segunda = versoes[1] ? media(versoes[1], posicao) : null;
    return {
      chave: escala,
      nome: NOME_ESCALA[escala],
      construto: CONSTRUTO[escala],
      limites: benchmark[escala],
      faixaNeutra,
      marcadores: versoes.map((versao, indice) => ({ media: media(versao, posicao), ic: null, forma: formaDa(indice) })),
      valor: (
        <>
          {versoes.map((versao, indice) => (
            <Fragment key={versao.versaoId}>
              <svg width="12" height="12" aria-hidden="true" className={graficos.marcaValor}>
                <FiguraMarcador x={6} y={6} forma={formaDa(indice)} />
              </svg>
              {formatarDecimal(media(versao, posicao))}
            </Fragment>
          ))}
          {duas && primeira !== null && segunda !== null && (
            <span className={graficos.leitura}>diferença {formatarDecimal(primeira - segunda)}</span>
          )}
        </>
      ),
    };
  });

  const descricao = `Médias por escala ${duas ? "nas duas versões" : `nas ${versoes.length} versões`}. ${ESCALAS.map(
    (escala, posicao) =>
      `${NOME_ESCALA[escala]}: ${versoes.map((versao) => `${versao.nome} ${formatarDecimal(media(versao, posicao))}`).join(", ")}.`,
  ).join(" ")}`;

  const leitura = leituraDaComparacao(
    ESCALAS.map((escala) => NOME_ESCALA[escala]),
    versoes.map((versao) => ({ nome: versao.nome, medias: ESCALAS.map((_, posicao) => media(versao, posicao)) })),
  );

  return (
    <>
      {leitura && (
        <section aria-labelledby="titulo-leitura" className={estilos.leituraComparacao}>
          <h2 id="titulo-leitura" className={estilos.rotuloLeitura}>
            Leitura rápida
          </h2>
          <p className={estilos.frase}>{leitura}</p>
        </section>
      )}

      <section aria-labelledby="titulo-comparacao" className={estilos.secao}>
        <TituloSecao id="titulo-comparacao" numero={1}>Escalas por versão</TituloSecao>
        <EscalasComBenchmark
          linhas={linhas}
          descricao={descricao}
          nomesGrupos={NOME_CONSTRUTO}
          legenda={<LegendaConstrutos comIntervalo={false} />}
        />
        <p className={estilos.aviso}>
          A comparação mostra as médias lado a lado, sem teste estatístico. Para afirmar que uma versão é melhor, rode um teste
          adequado sobre os dados exportados.
        </p>
      </section>

      <section aria-labelledby="titulo-tabela-comparacao" className={estilos.secao}>
        <TituloSecao id="titulo-tabela-comparacao" numero={2}>Médias por versão</TituloSecao>
        {/* Em tela estreita a tabela rola dentro da caixa; tabIndex deixa rolar pelo teclado (WCAG 2.1.1) */}
        <div className={estilos.rolagem} tabIndex={0} role="region" aria-labelledby="titulo-tabela-comparacao">
          <table className={estilos.tabela}>
            <caption className="visualmente-oculto">Média e IC95 de cada escala, por versão</caption>
            <thead>
              <tr>
                <th scope="col">Escala</th>
                {versoes.map((versao) => (
                  <Fragment key={versao.versaoId}>
                    <th scope="col" className={estilos.numero}>{versao.nome}</th>
                    <th scope="col" className={estilos.numero}>IC95</th>
                  </Fragment>
                ))}
                {duas && <th scope="col" className={estilos.numero}>Diferença</th>}
              </tr>
            </thead>
            <tbody>
              {ESCALAS.map((escala, posicao) => {
                const [a, b] = versoes.map((versao) => media(versao, posicao));
                return (
                  <tr key={escala}>
                    <th scope="row">{NOME_ESCALA[escala]}</th>
                    {versoes.map((versao) => {
                      const ic = versao.analise.escalas[posicao]?.ic;
                      return (
                        <Fragment key={versao.versaoId}>
                          <td className={estilos.numero}>{formatarDecimal(media(versao, posicao))}</td>
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
            Diferença = {versoes[0]?.nome} menos {versoes[1]?.nome}.
          </p>
        )}
      </section>
    </>
  );
}
