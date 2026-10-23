import type { Metadata } from "next";
import { SemRespostas } from "../SemRespostas";

export const metadata: Metadata = { title: "Respostas · Ferramenta UEQ" };

export default async function PaginaRespostas({ params }: { params: Promise<{ id: string }> }) {
  return (
    <SemRespostas
      id={(await params).id}
      texto="Cada participação concluída aparece aqui, com as respostas suspeitas marcadas para você decidir se ficam na análise."
    />
  );
}
