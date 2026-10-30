import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { documentoPeloSlug } from "@/lib/documentacao/catalogo";
import { lerDocumento } from "@/lib/documentacao/ler";
import { PaginaDocumento } from "../PaginaDocumento";

type Propriedades = { params: Promise<{ documento: string }> };

// Só os documentos do catálogo existem: o endereço nunca vira caminho de arquivo
async function documentoDaRota(params: Propriedades["params"]) {
  const documento = documentoPeloSlug((await params).documento);
  if (!documento) notFound();
  return documento;
}

export async function generateMetadata({ params }: Propriedades): Promise<Metadata> {
  const documento = await documentoDaRota(params);
  const { titulo } = await lerDocumento(documento);
  return { title: `${titulo} · Documentação · Ferramenta UEQ` };
}

export default async function PaginaDocumentoDaRota({ params }: Propriedades) {
  const documento = await documentoDaRota(params);
  return <PaginaDocumento documento={documento} renderizado={await lerDocumento(documento)} />;
}
