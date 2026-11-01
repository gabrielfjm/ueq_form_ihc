import type { Metadata, Route } from "next";
import Link from "next/link";
import { estudoDoPesquisador } from "@/lib/estudos";
import { diaParaCampo } from "@/lib/periodo";
import { exigirPesquisador } from "@/lib/sessao";
import { FaixaCabecalho } from "../../../FaixaCabecalho";
import { FormularioEstudo } from "../../formulario/FormularioEstudo";

type Propriedades = { params: Promise<{ id: string }> };

export const metadata: Metadata = { title: "Editar estudo · Ferramenta UEQ" };

export default async function PaginaEditarEstudo({ params }: Propriedades) {
  const pesquisador = await exigirPesquisador();
  const { id } = await params;
  const estudo = await estudoDoPesquisador(id, pesquisador, "editar");

  return (
    <>
      <FaixaCabecalho
        migalha={<Link href={`/estudos/${estudo.id}` as Route}>{estudo.titulo}</Link>}
        titulo="Editar estudo"
        ajuda="editar-estudo"
        descricao={
          estudo.status === "RASCUNHO"
            ? "O estudo continua em rascunho. Nada vai para os participantes até você abrir a coleta."
            : "As mudanças valem para quem abrir o link depois de salvar. Versões que já têm respostas não podem ser removidas."
        }
      />
      <FormularioEstudo
        modo="editar"
        estudoId={estudo.id}
        valores={{
          coletarDemografia: estudo.coletarDemografia,
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
