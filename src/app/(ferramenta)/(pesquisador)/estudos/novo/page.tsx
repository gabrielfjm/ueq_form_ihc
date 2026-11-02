import type { Metadata } from "next";
import Link from "next/link";
import { IDIOMAS } from "@/idiomas";
import { diaParaCampo, hojeEmBrasilia } from "@/lib/periodo";
import { exigirPesquisador } from "@/lib/sessao";
import { FaixaCabecalho } from "../../FaixaCabecalho";
import { FormularioEstudo } from "../formulario/FormularioEstudo";
import { tradutor } from "@/traducao/servidor";

export async function generateMetadata(): Promise<Metadata> {
  const t = await tradutor();
  return { title: t("Criar estudo · Ferramenta UEQ") };
}

const QUATRO_SEMANAS_MS = 27 * 24 * 60 * 60 * 1000;

export default async function PaginaCriarEstudo() {
  const t = await tradutor();
  const pesquisador = await exigirPesquisador();
  const hoje = hojeEmBrasilia();

  return (
    <>
      <FaixaCabecalho
        migalha={<Link href="/estudos">{t("Estudos")}</Link>}
        titulo={t("Criar estudo")}
        ajuda="novo-estudo"
        descricao={t("O estudo começa em rascunho. Nada vai para os participantes até você abrir a coleta.")}
      />
      <FormularioEstudo
        modo="criar"
        idiomas={IDIOMAS.map(({ codigo, nome, lang, direcao }) => ({ codigo, nome, lang, direcao }))}
        valores={{
          coletarDemografia: false,
          // O questionário nasce no idioma da conta; o pesquisador troca no formulário
          idioma: pesquisador.idioma,
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
