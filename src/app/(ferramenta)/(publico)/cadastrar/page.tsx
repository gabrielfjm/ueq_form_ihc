import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { pesquisadorDaSessao } from "@/lib/sessao";
import { AbrirAcesso } from "../_acesso/Acesso";
import { PaginaInicial } from "../PaginaInicial";
import { tradutor } from "@/traducao/servidor";

export async function generateMetadata(): Promise<Metadata> {
  const t = await tradutor();
  return { title: t("Criar conta · Ferramenta UEQ") };
}

// A página inicial com a janela de Criar conta já aberta
export default async function PaginaCadastrar() {
  if (await pesquisadorDaSessao()) redirect("/");

  return (
    <>
      <PaginaInicial logado={false} />
      <AbrirAcesso modo="cadastrar" />
    </>
  );
}
