import type { Metadata } from "next";
import { VISAO_GERAL } from "@/lib/documentacao/catalogo";
import { lerDocumento } from "@/lib/documentacao/ler";
import { PaginaDocumento } from "./PaginaDocumento";

export const metadata: Metadata = { title: "Documentação · Ferramenta UEQ" };

// Pública: a ferramenta é de código aberto e a documentação não tem nada de estudo ou de pessoa
export default async function PaginaDocumentacao() {
  return <PaginaDocumento documento={VISAO_GERAL} renderizado={await lerDocumento(VISAO_GERAL)} />;
}
