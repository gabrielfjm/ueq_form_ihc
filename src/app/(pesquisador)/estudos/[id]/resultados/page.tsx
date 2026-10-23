import type { Metadata } from "next";
import { SemRespostas } from "../SemRespostas";

export const metadata: Metadata = { title: "Resultados · Ferramenta UEQ" };

export default async function PaginaResultados({ params }: { params: Promise<{ id: string }> }) {
  return (
    <SemRespostas
      id={(await params).id}
      texto="As médias, os intervalos de confiança, o alfa e o benchmark das 6 escalas aparecem aqui assim que chegar a primeira resposta."
    />
  );
}
