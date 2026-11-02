import type { Metadata } from "next";
import Link from "next/link";
import { exigirPesquisador } from "@/lib/sessao";
import { FaixaCabecalho } from "../../FaixaCabecalho";
import estilos from "../../pesquisador.module.css";
import { FormularioSenha } from "../FormularioSenha";
import { tradutor } from "@/traducao/servidor";

export async function generateMetadata(): Promise<Metadata> {
  const t = await tradutor();
  return { title: t("Senha · Minha conta · Ferramenta UEQ") };
}

export default async function PaginaSenha() {
  const t = await tradutor();
  const pesquisador = await exigirPesquisador();
  return (
    <>
      <FaixaCabecalho titulo={t("Senha")} ajuda="conta" migalha={<Link href="/conta">{t("Minha conta")}</Link>} />
      <div className={estilos.conteudo}>
        <FormularioSenha email={pesquisador.email} />
      </div>
    </>
  );
}
