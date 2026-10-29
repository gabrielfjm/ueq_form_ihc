import type { Metadata, Route } from "next";
import { redirect } from "next/navigation";
import { pesquisadorDaSessao } from "@/lib/sessao";
import { destinoInterno } from "@/lib/validacao-conta";
import { LayoutAcesso } from "../LayoutAcesso";
import { PainelInstrumento } from "../Paineis";
import { FormularioEntrar } from "./FormularioEntrar";

export const metadata: Metadata = { title: "Entrar · Ferramenta UEQ" };

type Propriedades = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

// Retorno de ações que terminam aqui, depois que a sessão já acabou
const MENSAGENS = {
  saiu: "Você saiu da sua conta.",
  excluida: "Conta excluída. Os estudos e as respostas foram apagados.",
} as const;

export default async function PaginaEntrar({ searchParams }: Propriedades) {
  const { voltar, aviso } = await searchParams;
  const destino = destinoInterno(typeof voltar === "string" ? voltar : "");

  if (await pesquisadorDaSessao()) redirect(destino as Route);

  const status = aviso === "saiu" || aviso === "excluida" ? MENSAGENS[aviso] : null;

  return (
    <LayoutAcesso painel={<PainelInstrumento />} comRodape>
      <FormularioEntrar voltar={destino} status={status} />
    </LayoutAcesso>
  );
}
