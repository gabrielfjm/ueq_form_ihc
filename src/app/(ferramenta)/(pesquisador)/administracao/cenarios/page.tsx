import type { Metadata } from "next";
import Link from "next/link";
import { exigirAdministrador } from "@/lib/administracao";
import { banco } from "@/lib/banco";
import { FaixaCabecalho } from "../../FaixaCabecalho";
import estilos from "../administracao.module.css";
import { Cenarios } from "./Cenarios";
import { tradutor } from "@/traducao/servidor";

export async function generateMetadata(): Promise<Metadata> {
  const t = await tradutor();
  return { title: t("Cenários de demonstração · Administração · Ferramenta UEQ") };
}

export default async function PaginaCenarios() {
  const t = await tradutor();
  const administrador = await exigirAdministrador();
  const contas = await banco.pesquisador.findMany({ orderBy: { criadoEm: "asc" }, select: { id: true, nome: true, email: true } });
  return (
    <>
      <FaixaCabecalho
        titulo={t("Cenários de demonstração")}
        ajuda="administracao"
        migalha={<Link href="/administracao">{t("Administração")}</Link>}
        descricao={t("Cria três estudos com dados inventados: uma comparação A/B com a coleta aberta e respostas suspeitas, um estudo encerrado com respostas importadas e um rascunho com 3 versões.")}
      />
      <div className={estilos.conteudo}>
        <Cenarios idAtual={administrador.id} contas={contas} />
      </div>
    </>
  );
}
