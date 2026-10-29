import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { pesquisadorDaSessao } from "@/lib/sessao";
import { LayoutAcesso } from "../LayoutAcesso";
import { PainelPercurso } from "../Paineis";
import { FormularioCadastro } from "./FormularioCadastro";

export const metadata: Metadata = { title: "Criar conta · Ferramenta UEQ" };

export default async function PaginaCadastrar() {
  if (await pesquisadorDaSessao()) redirect("/estudos");

  return (
    <LayoutAcesso painel={<PainelPercurso />}>
      <FormularioCadastro />
    </LayoutAcesso>
  );
}
