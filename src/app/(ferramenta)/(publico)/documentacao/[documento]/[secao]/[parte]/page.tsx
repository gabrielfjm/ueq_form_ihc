import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { documentoPeloSlug } from "@/lib/documentacao/catalogo";
import { lerPagina } from "@/lib/documentacao/paginas";
import { tradutor } from "@/traducao/servidor";
import { PaginaSecao } from "../../../PaginaSecao";

type Propriedades = { params: Promise<{ documento: string; secao: string; parte: string }> };

async function lerDaRota(params: Propriedades["params"]) {
  const { documento: slug, secao, parte } = await params;
  const documento = documentoPeloSlug(slug);
  const lida = documento ? lerPagina(documento, secao, parte) : null;
  if (!documento || !lida) notFound();
  return { documento, lida };
}

export async function generateMetadata({ params }: Propriedades): Promise<Metadata> {
  const t = await tradutor();
  const { lida } = await lerDaRota(params);
  return { title: t("{titulo} · Documentação · Ferramenta UEQ", { titulo: `${lida.pagina.titulo} · ${lida.tituloDocumento}` }) };
}

export default async function PaginaParteDaRota({ params }: Propriedades) {
  const { documento, lida } = await lerDaRota(params);
  return <PaginaSecao documento={documento} lida={lida} />;
}
