import "server-only";
import { notFound } from "next/navigation";
import { exigirPesquisador, type PesquisadorLogado } from "./sessao";

// A página e as ações de administração respondem 404 para quem não é superusuário: não revelam que existem
export async function exigirAdministrador(): Promise<PesquisadorLogado> {
  const pesquisador = await exigirPesquisador();
  if (!pesquisador.administrador) notFound();
  return pesquisador;
}
