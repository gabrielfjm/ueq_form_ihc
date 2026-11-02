import type { Metadata } from "next";
import Link from "next/link";
import { exigirPesquisador } from "@/lib/sessao";
import { FaixaCabecalho } from "../../FaixaCabecalho";
import estilos from "../../pesquisador.module.css";
import { FormularioDados } from "../FormularioDados";
import { tradutor } from "@/traducao/servidor";

export async function generateMetadata(): Promise<Metadata> {
  const t = await tradutor();
  return { title: t("Dados cadastrais · Minha conta · Ferramenta UEQ") };
}

export default async function PaginaDados() {
  const t = await tradutor();
  const pesquisador = await exigirPesquisador();
  return (
    <>
      <FaixaCabecalho
        titulo={t("Dados cadastrais")}
        ajuda="conta"
        migalha={<Link href="/conta">{t("Minha conta")}</Link>}
        descricao={t("O e-mail é o que você usa para entrar e como a equipe convida você para um estudo.")}
      />
      <div className={estilos.conteudo}>
        <FormularioDados nome={pesquisador.nome} email={pesquisador.email} />
      </div>
    </>
  );
}
