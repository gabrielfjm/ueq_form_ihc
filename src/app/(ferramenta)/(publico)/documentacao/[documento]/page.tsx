import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { documentoPeloSlug, documentoPronto, type Documento } from "@/lib/documentacao/catalogo";
import { lerDocumento } from "@/lib/documentacao/ler";
import { PaginaDocumento } from "../PaginaDocumento";
import { tradutor } from "@/traducao/servidor";

type Propriedades = { params: Promise<{ documento: string }> };

// Só os documentos do catálogo existem: o endereço nunca vira caminho de arquivo
async function documentoDaRota(params: Propriedades["params"]) {
  const documento = documentoPeloSlug((await params).documento);
  if (!documento) notFound();
  return documento;
}

// Documento em produção não é lido: a página mostra só o aviso, com o nome do catálogo
async function renderizar(documento: Documento) {
  return documentoPronto(documento) ? lerDocumento(documento) : null;
}

export async function generateMetadata({ params }: Propriedades): Promise<Metadata> {
  const t = await tradutor();
  const documento = await documentoDaRota(params);
  const titulo = (await renderizar(documento))?.titulo ?? documento.rotulo;
  return { title: t("{titulo} · Documentação · Ferramenta UEQ", { titulo: titulo }) };
}

export default async function PaginaDocumentoDaRota({ params }: Propriedades) {
  const documento = await documentoDaRota(params);
  return <PaginaDocumento documento={documento} renderizado={await renderizar(documento)} />;
}
