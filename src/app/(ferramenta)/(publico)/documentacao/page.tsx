import type { Metadata } from "next";
import { VISAO_GERAL } from "@/lib/documentacao/catalogo";
import { aberturaDoDocumento } from "@/lib/documentacao/paginas";
import { PaginaDocumento } from "./PaginaDocumento";
import { tradutor } from "@/traducao/servidor";

export async function generateMetadata(): Promise<Metadata> {
  const t = await tradutor();
  return { title: t("Documentação · Ferramenta UEQ") };
}

// Pública: a ferramenta é de código aberto e a documentação não tem nada de estudo ou de pessoa
export default async function PaginaDocumentacao() {
  return <PaginaDocumento documento={VISAO_GERAL} abertura={aberturaDoDocumento(VISAO_GERAL)} />;
}
