import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { documentoPeloSlug } from "@/lib/documentacao/catalogo";
import { aberturaDoDocumento } from "@/lib/documentacao/paginas";
import { PaginaDocumento } from "../PaginaDocumento";
import { tradutor } from "@/traducao/servidor";

type Propriedades = { params: Promise<{ documento: string }> };

// Só os documentos do catálogo existem: o endereço nunca vira caminho de arquivo
async function documentoDaRota(params: Propriedades["params"]) {
  const documento = documentoPeloSlug((await params).documento);
  if (!documento) notFound();
  return documento;
}

export async function generateMetadata({ params }: Propriedades): Promise<Metadata> {
  const t = await tradutor();
  const documento = await documentoDaRota(params);
  // Documento em produção não é lido: a página mostra só o aviso, com o nome do catálogo
  const titulo = aberturaDoDocumento(documento)?.renderizado.titulo || documento.rotulo;
  return { title: t("{titulo} · Documentação · Ferramenta UEQ", { titulo: titulo }) };
}

export default async function PaginaDocumentoDaRota({ params }: Propriedades) {
  const documento = await documentoDaRota(params);
  return <PaginaDocumento documento={documento} abertura={aberturaDoDocumento(documento)} />;
}
