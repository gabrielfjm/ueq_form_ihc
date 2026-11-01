import { Upload } from "lucide-react";
import type { Metadata, Route } from "next";
import Link from "next/link";
import { Avisos } from "@/componentes/Avisos";
import { PerfilDemografico } from "@/graficos/PerfilDemografico";
import { demografiasNaAnalise } from "@/lib/demografias";
import { contagemDeRespostas, estudoDoPesquisador } from "@/lib/estudos";
import { NOME_ESCALA } from "@/lib/nomes-ueq";
import { perfilDemografico } from "@/lib/perfil-demografico";
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
  const estudo = await estudoDoPesquisador((await params).id, pesquisador);
  return { title: `Respostas · ${estudo.titulo} · Ferramenta UEQ` };
}

const MOTIVO: Record<MotivoSuspeita, string> = { amplitude: "amplitude", respostasIguais: "respostas iguais" };

export default async function PaginaRespostas({ params, searchParams }: Propriedades) {
  const pesquisador = await exigirPesquisador();
  const estudo = await estudoDoPesquisador((await params).id, pesquisador);
  const { suspeitas, importadas, perfil } = await searchParams;
  // Filtro de versão do perfil dos participantes, na URL como os outros filtros (Nielsen 3)
  const versaoDoPerfil = estudo.versoes.find((versao) => versao.id === perfil);
  const soSuspeitas = suspeitas === "1";
  // Volta da importação (respostas/importar): o resultado é anunciado no topo, como nas outras ações
  const quantasImportadas = Number(importadas);
  const aviso =
    Number.isInteger(quantasImportadas) && quantasImportadas > 0
      ? `${plural(quantasImportadas, "resposta importada", "respostas importadas")}. Elas aparecem na lista com a marca “importada de CSV”.`
      : null;
  const linkImportar = `/estudos/${estudo.id}/respostas/importar` as Route;
  const [respostas, participacoes, demografias] = await Promise.all([
    contagemDeRespostas(estudo.id),
    participacoesAvaliadas(estudo.id),
    demografiasNaAnalise(estudo.id, versaoDoPerfil?.id),
  ]);
  // O perfil aparece quando o estudo coleta dados demográficos ou já coletou alguma vez
  const mostrarPerfil = estudo.coletarDemografia || demografias.some((demografia) => demografia !== null);
  const linkPerfil = (versaoId?: string) => {
    const busca = new URLSearchParams();
    if (soSuspeitas) busca.set("suspeitas", "1");
    if (versaoId) busca.set("perfil", versaoId);
    const texto = busca.toString();
    return `/estudos/${estudo.id}/respostas${texto ? `?${texto}` : ""}#titulo-perfil` as Route;
  };
  const fora = participacoes.filter((participacao) => !participacao.incluidaNaAnalise).length;

  const linhas = participacoes
    .filter((participacao) => !soSuspeitas || participacao.suspeita)
    .map((participacao) => ({
      id: participacao.id,
      quando: formatarDiaHora(participacao.concluidaEm),
      versao: participacao.versao,
      idioma: participacao.idioma?.nomeEmPortugues ?? null,
      traducaoAprovada: participacao.idioma?.traducaoAprovada ?? true,
      importada: participacao.importada,
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
      <FaixaEstudo estudo={estudo} ajuda="respostas" resumo={resumoDoEstudo(estudo.status, estudo.versoes.length, respostas)} />
      <div className={estilos.conteudo}>
        <Avisos className={estilos.regiaoStatus} inicial={aviso}>
          {participacoes.length === 0 ? (
            <section aria-labelledby="titulo-vazio" className={estilos.vazio}>
              <h2 id="titulo-vazio">Nenhuma resposta ainda.</h2>
              <p>
                Cada participação concluída aparece aqui, com as respostas suspeitas marcadas para você decidir se ficam na
                análise.
              </p>
              {estudo.permissoes.editar && (
                <p>
                  Já tem respostas coletadas fora da ferramenta? <Link href={linkImportar}>Importar respostas de um CSV</Link>
                </p>
              )}
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

              {mostrarPerfil && (
                <section aria-labelledby="titulo-perfil" className={estilos.perfil} data-tutorial="perfil">
                  <div className={estilos.cabecalhoPerfil}>
                    <div>
                      <h2 id="titulo-perfil" className={estilos.titulo}>
                        Perfil dos participantes
                      </h2>
                      <p className={estilos.textoPerfil}>
                        Respostas da etapa opcional “Dados opcionais”, só das{" "}
                        {plural(demografias.length, "participação", "participações")} na análise que vieram pelo link
                        {versaoDoPerfil ? ` da versão “${versaoDoPerfil.nome}”` : ""}. As importadas de CSV não têm essa
                        etapa.
                      </p>
                    </div>
                    {estudo.versoes.length > 1 && (
                      <nav aria-label="Versão do perfil" className={estilos.filtroVersao}>
                        <Link href={linkPerfil()} aria-current={versaoDoPerfil ? undefined : "page"} scroll={false}>
                          Todas as versões
                        </Link>
                        {estudo.versoes.map((versao) => (
                          <Link
                            key={versao.id}
                            href={linkPerfil(versao.id)}
                            aria-current={versaoDoPerfil?.id === versao.id ? "page" : undefined}
                            scroll={false}
                          >
                            {versao.nome}
                          </Link>
                        ))}
                      </nav>
                    )}
                  </div>
                  {demografias.length === 0 ? (
                    <p className={estilos.textoPerfil}>Nenhuma participação na análise para montar o perfil ainda.</p>
                  ) : (
                    <PerfilDemografico perguntas={perfilDemografico(demografias)} />
                  )}
                </section>
              )}

              <div className={estilos.colunas}>
                <section aria-labelledby="titulo-lista" className={estilos.lista}>
                  <TabelaParticipacoes
                    somenteLeitura={!estudo.permissoes.editar}
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
                  <h2 className={`${estilos.regraTitulo} ${estilos.regraSecao}`}>Respostas de fora da ferramenta</h2>
                  <p className={estilos.regraTexto}>
                    Coletadas em papel ou em outro formulário, entram por um CSV no formato da planilha oficial.
                  </p>
                  {estudo.permissoes.editar && (
                    <Link href={linkImportar} className={estilos.importar}>
                      <Upload size={18} strokeWidth={1.5} aria-hidden="true" />
                      <span>Importar respostas de um CSV</span>
                    </Link>
                  )}
                </aside>
              </div>
            </div>
          )}
        </Avisos>
      </div>
    </>
  );
}
