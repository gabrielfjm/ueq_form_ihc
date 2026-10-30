import type { Metadata } from "next";
import { pesquisadorDaSessao } from "@/lib/sessao";
import { PaginaInicial, avisoDaPaginaInicial } from "./PaginaInicial";

export const metadata: Metadata = { title: "Ferramenta UEQ · Estudos de experiência do usuário" };

type Propriedades = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Inicio({ searchParams }: Propriedades) {
  const { aviso } = await searchParams;
  return <PaginaInicial logado={Boolean(await pesquisadorDaSessao())} aviso={avisoDaPaginaInicial(aviso)} />;
}
