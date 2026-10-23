import type { Metadata } from "next";
import Link from "next/link";
import { diaParaCampo, hojeEmBrasilia } from "@/lib/periodo";
import { exigirPesquisador } from "@/lib/sessao";
import { FaixaCabecalho } from "../../FaixaCabecalho";
import { FormularioEstudo } from "../formulario/FormularioEstudo";

export const metadata: Metadata = { title: "Criar estudo · Ferramenta UEQ" };

const QUATRO_SEMANAS_MS = 27 * 24 * 60 * 60 * 1000;

export default async function PaginaCriarEstudo() {
  await exigirPesquisador();
  const hoje = hojeEmBrasilia();

  return (
    <>
      <FaixaCabecalho
        migalha={<Link href="/estudos">Estudos</Link>}
        titulo="Criar estudo"
        descricao="O estudo começa em rascunho. Nada vai para os participantes até você abrir a coleta."
      />
      <FormularioEstudo
        modo="criar"
        valores={{
          titulo: "",
          produtoAvaliado: "",
          objetivo: "",
          // Sugestão de quatro semanas a partir de hoje; o pesquisador troca se quiser
          dataInicio: diaParaCampo(hoje),
          dataFim: diaParaCampo(new Date(hoje.getTime() + QUATRO_SEMANAS_MS)),
          versoes: [],
        }}
      />
    </>
  );
}
