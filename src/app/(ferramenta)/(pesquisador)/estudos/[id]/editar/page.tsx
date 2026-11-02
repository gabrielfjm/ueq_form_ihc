import { IDIOMAS } from "@/idiomas";
import type { Metadata, Route } from "next";
import Link from "next/link";
import { estudoDoPesquisador } from "@/lib/estudos";
import { diaParaCampo } from "@/lib/periodo";
import { exigirPesquisador } from "@/lib/sessao";
import { FaixaCabecalho } from "../../../FaixaCabecalho";
import { FormularioEstudo } from "../../formulario/FormularioEstudo";
import { tradutor } from "@/traducao/servidor";

type Propriedades = { params: Promise<{ id: string }> };

export async function generateMetadata(): Promise<Metadata> {
  const t = await tradutor();
  return { title: t("Editar estudo · Ferramenta UEQ") };
}

export default async function PaginaEditarEstudo({ params }: Propriedades) {
  const t = await tradutor();
  const pesquisador = await exigirPesquisador();
  const { id } = await params;
  const estudo = await estudoDoPesquisador(id, pesquisador, "editar");

  return (
    <>
      <FaixaCabecalho
        migalha={<Link href={`/estudos/${estudo.id}` as Route}>{t(estudo.titulo)}</Link>}
        titulo={t("Editar estudo")}
        ajuda="editar-estudo"
        descricao={
          estudo.status === "RASCUNHO"
            ? t("O estudo continua em rascunho. Nada vai para os participantes até você abrir a coleta.")
            : t("As mudanças valem para quem abrir o link depois de salvar. Versões que já têm respostas não podem ser removidas.")
        }
      />
      <FormularioEstudo
        idiomas={IDIOMAS.map(({ codigo, nome, lang, direcao }) => ({ codigo, nome, lang, direcao }))}
        modo="editar"
        estudoId={estudo.id}
        valores={{
          coletarDemografia: estudo.coletarDemografia,
          idioma: estudo.idioma,
          titulo: estudo.titulo,
          produtoAvaliado: estudo.produtoAvaliado,
          objetivo: estudo.objetivo,
          dataInicio: diaParaCampo(estudo.dataInicio),
          dataFim: diaParaCampo(estudo.dataFim),
          versoes: estudo.versoes.map((versao) => ({
            id: versao.id,
            nome: versao.nome,
            respostas: versao._count.participacoes,
          })),
        }}
      />
    </>
  );
}
