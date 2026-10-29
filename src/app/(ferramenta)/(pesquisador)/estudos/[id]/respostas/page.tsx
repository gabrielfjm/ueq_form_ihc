import type { Metadata } from "next";
import { Avisos } from "@/componentes/Avisos";
import { contagemDeRespostas, estudoDoPesquisador } from "@/lib/estudos";
import { NOME_ESCALA } from "@/lib/nomes-ueq";
import { PARAMETROS_SUSPEITA, participacoesAvaliadas } from "@/lib/participacoes";
import { exigirPesquisador } from "@/lib/sessao";
import { formatarDiaHora, plural } from "@/lib/texto";
import { ESCALAS, type MotivoSuspeita } from "@/ueq";
import { FaixaEstudo, resumoDoEstudo } from "../FaixaEstudo";
import estilos from "./respostas.module.css";
import { TabelaParticipacoes } from "./TabelaParticipacoes";

type Propriedades = {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params }: Propriedades): Promise<Metadata> {
  const pesquisador = await exigirPesquisador();
  const estudo = await estudoDoPesquisador((await params).id, pesquisador.id);
  return { title: `Respostas · ${estudo.titulo} · Ferramenta UEQ` };
}

const MOTIVO: Record<MotivoSuspeita, string> = { amplitude: "amplitude", respostasIguais: "respostas iguais" };

export default async function PaginaRespostas({ params, searchParams }: Propriedades) {
  const pesquisador = await exigirPesquisador();
  const estudo = await estudoDoPesquisador((await params).id, pesquisador.id);
  const soSuspeitas = (await searchParams).suspeitas === "1";
  const [respostas, participacoes] = await Promise.all([contagemDeRespostas(estudo.id), participacoesAvaliadas(estudo.id)]);
  const fora = participacoes.filter((participacao) => !participacao.incluidaNaAnalise).length;

  const linhas = participacoes
    .filter((participacao) => !soSuspeitas || participacao.suspeita)
    .map((participacao) => ({
      id: participacao.id,
      quando: formatarDiaHora(participacao.concluidaEm),
      versao: participacao.versao,
      idioma: participacao.idioma.nomeEmPortugues,
      traducaoAprovada: participacao.idioma.traducaoAprovada,
      inconsistentes: participacao.avaliacao.escalasInconsistentes.length,
      iguais: participacao.avaliacao.respostasIguais,
      suspeita: participacao.suspeita,
      motivo: participacao.avaliacao.motivos.length > 0 ? participacao.avaliacao.motivos.map((m) => MOTIVO[m]).join(" e ") : null,
      incluidaNaAnalise: participacao.incluidaNaAnalise,
      escalas: ESCALAS.map((escala) => ({
        nome: NOME_ESCALA[escala],
        amplitude: participacao.avaliacao.amplitudes[escala],
        inconsistente: participacao.avaliacao.escalasInconsistentes.includes(escala),
      })),
    }));

  return (
    <>
      <FaixaEstudo
        estudoId={estudo.id}
        titulo={estudo.titulo}
        status={estudo.status}
        resumo={resumoDoEstudo(estudo.status, estudo.versoes.length, respostas)}
      />
      <div className={estilos.conteudo}>
        <Avisos className={estilos.regiaoStatus}>
          {participacoes.length === 0 ? (
            <section aria-labelledby="titulo-vazio" className={estilos.vazio}>
              <h2 id="titulo-vazio">Nenhuma resposta ainda.</h2>
              <p>
                Cada participação concluída aparece aqui, com as respostas suspeitas marcadas para você decidir se ficam na
                análise.
              </p>
            </section>
          ) : (
            <div className={estilos.secoes}>
              <section aria-labelledby="titulo-panorama" className={estilos.panorama}>
                <h2 id="titulo-panorama" className={estilos.rotulo}>
                  Panorama das {plural(participacoes.length, "participação", "participações")}
                </h2>
                {/* Nielsen 1: de relance, quantas estão dentro e fora da análise */}
                <div
                  role="img"
                  aria-label={`${plural(participacoes.length, "participação", "participações")}: ${participacoes.length - fora} na análise e ${fora} fora da análise.`}
                  className={estilos.pontos}
                >
                  {participacoes.map((participacao) => (
                    <span
                      key={participacao.id}
                      aria-hidden="true"
                      className={participacao.incluidaNaAnalise ? estilos.ponto : `${estilos.ponto} ${estilos.pontoFora}`}
                    />
                  ))}
                </div>
                <p className={estilos.legenda}>
                  <span>
                    <span aria-hidden="true" className={`${estilos.ponto} ${estilos.amostra}`} />
                    <span className={estilos.numero}>{participacoes.length - fora}</span> na análise
                  </span>
                  <span>
                    <span aria-hidden="true" className={`${estilos.ponto} ${estilos.pontoFora} ${estilos.amostra}`} />
                    <span className={estilos.numero}>{fora}</span> fora da análise
                  </span>
                </p>
              </section>

              <div className={estilos.colunas}>
                <section aria-labelledby="titulo-lista" className={estilos.lista}>
                  <TabelaParticipacoes
                    estudoId={estudo.id}
                    linhas={linhas}
                    total={participacoes.length}
                    soSuspeitas={soSuspeitas}
                    limiteIguais={PARAMETROS_SUSPEITA.respostasIguaisMaximas}
                  />
                </section>
                <aside aria-labelledby="titulo-regra" className={estilos.regra}>
                  <h2 id="titulo-regra" className={estilos.regraTitulo}>
                    Como uma resposta vira suspeita
                  </h2>
                  <p className={estilos.regraTexto}>
                    Em cada escala, a ferramenta compara os itens da mesma pessoa. Muita diferença entre eles, ou a mesma
                    posição marcada em quase tudo, sugere resposta sem atenção.
                  </p>
                  <dl className={estilos.regraLista}>
                    <div>
                      <dt>Escala inconsistente</dt>
                      <dd>
                        Amplitude acima de <span className={estilos.numero}>{PARAMETROS_SUSPEITA.amplitudeMaxima}</span>
                      </dd>
                    </div>
                    <div>
                      <dt>Participação suspeita</dt>
                      <dd>
                        <span className={estilos.numero}>{PARAMETROS_SUSPEITA.escalasParaSuspeita}</span> ou mais escalas
                        inconsistentes, ou a mesma posição em mais de{" "}
                        <span className={estilos.numero}>{PARAMETROS_SUSPEITA.respostasIguaisMaximas}</span> dos 26 itens
                      </dd>
                    </div>
                    <div>
                      <dt>Fonte dos limiares</dt>
                      <dd className={estilos.numero}>Handbook UEQ e data/protocolo.json</dd>
                    </div>
                    <div>
                      <dt>Excluir da análise</dt>
                      <dd className={estilos.regraTexto}>
                        Não apaga nada. A resposta continua na exportação de respostas brutas, com a coluna de inclusão.
                      </dd>
                    </div>
                  </dl>
                </aside>
              </div>
            </div>
          )}
        </Avisos>
      </div>
    </>
  );
}
