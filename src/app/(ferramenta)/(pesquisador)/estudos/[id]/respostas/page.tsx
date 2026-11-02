import { Upload } from "lucide-react";
import type { Metadata, Route } from "next";
import Link from "next/link";
import { Avisos } from "@/componentes/Avisos";
import { contagemDeRespostas, estudoDoPesquisador } from "@/lib/estudos";
import { NOME_ESCALA } from "@/lib/nomes-ueq";
import { juntarComE } from "@/lib/texto";
import { PARAMETROS_SUSPEITA, participacoesAvaliadas } from "@/lib/participacoes";
import { exigirPesquisador } from "@/lib/sessao";
import { formatarDiaHora, plural } from "@/lib/texto";
import { ESCALAS, type MotivoSuspeita } from "@/ueq";
import { FaixaEstudo, resumoDoEstudo } from "../FaixaEstudo";
import estilos from "./respostas.module.css";
import { TabelaParticipacoes } from "./TabelaParticipacoes";
import { tradutor } from "@/traducao/servidor";
import { m } from "@/traducao/nucleo";

type Propriedades = {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params }: Propriedades): Promise<Metadata> {
  const t = await tradutor();
  const pesquisador = await exigirPesquisador();
  const estudo = await estudoDoPesquisador((await params).id, pesquisador);
  return { title: t("Respostas · {titulo} · Ferramenta UEQ", { titulo: estudo.titulo }) };
}

const MOTIVO: Record<MotivoSuspeita, string> = { amplitude: m("amplitude"), respostasIguais: m("respostas iguais") };

export default async function PaginaRespostas({ params, searchParams }: Propriedades) {
  const t = await tradutor();
  const pesquisador = await exigirPesquisador();
  const estudo = await estudoDoPesquisador((await params).id, pesquisador);
  const { suspeitas, importadas } = await searchParams;
  const soSuspeitas = suspeitas === "1";
  // Volta da importação (respostas/importar): o resultado é anunciado no topo, como nas outras ações
  const quantasImportadas = Number(importadas);
  const aviso =
    Number.isInteger(quantasImportadas) && quantasImportadas > 0
      ? t("{quantidade}. Elas aparecem na lista com a marca “importada de CSV”.", { quantidade: plural(quantasImportadas, t("resposta importada"), t("respostas importadas")) })
      : null;
  const linkImportar = `/estudos/${estudo.id}/respostas/importar` as Route;
  const [respostas, participacoes] = await Promise.all([contagemDeRespostas(estudo.id), participacoesAvaliadas(estudo.id)]);
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
      motivo: participacao.avaliacao.motivos.length > 0 ? juntarComE(participacao.avaliacao.motivos.map((motivo) => t(MOTIVO[motivo])), t.lang) : null,
      incluidaNaAnalise: participacao.incluidaNaAnalise,
      escalas: ESCALAS.map((escala) => ({
        nome: t(NOME_ESCALA[escala]),
        amplitude: participacao.avaliacao.amplitudes[escala],
        inconsistente: participacao.avaliacao.escalasInconsistentes.includes(escala),
      })),
    }));

  return (
    <>
      <FaixaEstudo estudo={estudo} ajuda="respostas" resumo={resumoDoEstudo(t, estudo.status, estudo.versoes.length, respostas)} />
      <div className={estilos.conteudo}>
        <Avisos className={estilos.regiaoStatus} inicial={aviso}>
          {participacoes.length === 0 ? (
            <section aria-labelledby="titulo-vazio" className={estilos.vazio}>
              <h2 id="titulo-vazio">{t("Nenhuma resposta ainda.")}</h2>
              <p>
                {t("Cada participação concluída aparece aqui, com as respostas suspeitas marcadas para você decidir se ficam na análise.")}
              </p>
              {estudo.permissoes.editar && (
                <p>
                  {t("Já tem respostas coletadas fora da ferramenta?")}{" "}<Link href={linkImportar}>{t("Importar respostas de um CSV")}</Link>
                </p>
              )}
            </section>
          ) : (
            <div className={estilos.secoes}>
              <section aria-labelledby="titulo-panorama" className={estilos.panorama}>
                <h2 id="titulo-panorama" className={estilos.rotulo}>
                  {t("Panorama das {quantidade}", { quantidade: plural(participacoes.length, t("participação"), t("participações")) })}
                </h2>
                {/* Nielsen 1: de relance, quantas estão dentro e fora da análise */}
                <div
                  role="img"
                  aria-label={t("{quantidade}: {v} na análise e {fora} fora da análise.", { quantidade: plural(participacoes.length, t("participação"), t("participações")), v: participacoes.length - fora, fora: fora })}
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
                    <span className={estilos.numero}>{participacoes.length - fora}</span>{" "}{t("na análise")}
                  </span>
                  <span>
                    <span aria-hidden="true" className={`${estilos.ponto} ${estilos.pontoFora} ${estilos.amostra}`} />
                    <span className={estilos.numero}>{fora}</span>{" "}{t("fora da análise")}
                  </span>
                </p>
              </section>

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
                    {t("Como uma resposta vira suspeita")}
                  </h2>
                  <p className={estilos.regraTexto}>
                    {t("Em cada escala, a ferramenta compara os itens da mesma pessoa. Muita diferença entre eles, ou a mesma posição marcada em quase tudo, sugere resposta sem atenção.")}
                  </p>
                  <dl className={estilos.regraLista}>
                    <div>
                      <dt>{t("Escala inconsistente")}</dt>
                      <dd>
                        {t("Amplitude acima de")}{" "}<span className={estilos.numero}>{PARAMETROS_SUSPEITA.amplitudeMaxima}</span>
                      </dd>
                    </div>
                    <div>
                      <dt>{t("Participação suspeita")}</dt>
                      <dd>
                        <span className={estilos.numero}>{PARAMETROS_SUSPEITA.escalasParaSuspeita}</span>{" "}{t("ou mais escalas inconsistentes, ou a mesma posição em mais de")}{" "}
                        <span className={estilos.numero}>{PARAMETROS_SUSPEITA.respostasIguaisMaximas}</span>{" "}{t("dos 26 itens")}
                      </dd>
                    </div>
                    <div>
                      <dt>{t("Fonte dos limiares")}</dt>
                      <dd className={estilos.numero}>{t("Handbook UEQ e data/protocolo.json")}</dd>
                    </div>
                    <div>
                      <dt>{t("Excluir da análise")}</dt>
                      <dd className={estilos.regraTexto}>
                        {t("Não apaga nada. A resposta continua na exportação de respostas brutas, com a coluna de inclusão.")}
                      </dd>
                    </div>
                  </dl>
                  <h2 className={`${estilos.regraTitulo} ${estilos.regraSecao}`}>{t("Respostas de fora da ferramenta")}</h2>
                  <p className={estilos.regraTexto}>
                    {t("Coletadas em papel ou em outro formulário, entram por um CSV no formato da planilha oficial.")}
                  </p>
                  {estudo.permissoes.editar && (
                    <Link href={linkImportar} className={estilos.importar}>
                      <Upload size={18} strokeWidth={1.5} aria-hidden="true" />
                      <span>{t("Importar respostas de um CSV")}</span>
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
