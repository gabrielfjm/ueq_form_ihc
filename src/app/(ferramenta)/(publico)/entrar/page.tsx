import type { Metadata, Route } from "next";
import { redirect } from "next/navigation";
import { pesquisadorDaSessao } from "@/lib/sessao";
import { destinoInterno } from "@/lib/validacao-conta";
import { AbrirAcesso } from "../_acesso/Acesso";
import { PaginaInicial } from "../PaginaInicial";

export const metadata: Metadata = { title: "Entrar · Ferramenta UEQ" };

type Propriedades = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

// A página inicial com a janela de Entrar já aberta. É para cá que o proxy manda quem chega numa rota
// protegida sem sessão; "voltar" leva de volta a ela depois do login
export default async function PaginaEntrar({ searchParams }: Propriedades) {
  const { voltar } = await searchParams;
  const destino = destinoInterno(typeof voltar === "string" ? voltar : "");

  if (await pesquisadorDaSessao()) redirect(destino as Route);

  return (
    <>
      <PaginaInicial logado={false} />
      <AbrirAcesso modo="entrar" voltar={destino} />
    </>
  );
}
