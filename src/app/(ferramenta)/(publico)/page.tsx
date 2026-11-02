import type { Metadata } from "next";
import { pesquisadorDaSessao } from "@/lib/sessao";
import { PaginaInicial, avisoDaPaginaInicial } from "./PaginaInicial";
import { tradutor } from "@/traducao/servidor";

export async function generateMetadata(): Promise<Metadata> {
  const t = await tradutor();
  return { title: t("Ferramenta UEQ · Estudos de experiência do usuário") };
}

type Propriedades = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Inicio({ searchParams }: Propriedades) {
  const { aviso } = await searchParams;
  return <PaginaInicial logado={Boolean(await pesquisadorDaSessao())} aviso={avisoDaPaginaInicial(aviso)} />;
}
