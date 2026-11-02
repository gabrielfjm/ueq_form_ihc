import type { Metadata } from "next";
import Link from "next/link";
import { exigirAdministrador } from "@/lib/administracao";
import { FaixaCabecalho } from "../../../FaixaCabecalho";
import estilos from "../../administracao.module.css";
import { NovaConta } from "./NovaConta";
import { tradutor } from "@/traducao/servidor";

export async function generateMetadata(): Promise<Metadata> {
  const t = await tradutor();
  return { title: t("Criar conta para alguém · Administração · Ferramenta UEQ") };
}

export default async function PaginaNovaConta() {
  const t = await tradutor();
  await exigirAdministrador();
  return (
    <>
      <FaixaCabecalho
        titulo={t("Criar conta para alguém")}
        ajuda="administracao"
        migalha={<Link href="/administracao">{t("Administração")}</Link>}
        descricao={t("Para quem vai testar ou avaliar a ferramenta. Passe o e-mail e a senha para a pessoa.")}
      />
      <div className={estilos.conteudo}>
        <NovaConta />
      </div>
    </>
  );
}
