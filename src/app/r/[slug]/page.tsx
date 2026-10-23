import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { banco } from "@/lib/banco";
import estilos from "./participante.module.css";

type Propriedades = { params: Promise<{ slug: string }> };

// Só o necessário para o participante: nada do pesquisador sai daqui
const estudoPublico = cache(async (slug: string) => {
  const estudo = await banco.estudo.findUnique({
    where: { slugPublico: slug },
    select: { titulo: true, status: true },
  });
  if (!estudo) notFound();
  return estudo;
});

// Protótipo p6: link de estudo em rascunho ou com a coleta encerrada
const FECHADO = {
  RASCUNHO: {
    etapa: "Rascunho",
    titulo: "Este estudo ainda não está aberto",
    texto: "A coleta de respostas ainda não começou. Tente de novo mais tarde ou fale com quem enviou o link.",
  },
  ENCERRADO: {
    etapa: "Encerrado",
    titulo: "A coleta deste estudo foi encerrada",
    texto: "O estudo não aceita mais respostas. Obrigado pelo interesse em participar.",
  },
} as const;

export async function generateMetadata({ params }: Propriedades): Promise<Metadata> {
  const estudo = await estudoPublico((await params).slug);
  return { title: estudo.status === "ABERTO" ? estudo.titulo : `Estudo indisponível · ${estudo.titulo}` };
}

export default async function PaginaParticipante({ params }: Propriedades) {
  const estudo = await estudoPublico((await params).slug);

  // O questionário em si (consentimento, itens, dados opcionais) entra em prompts/05-questionario.md
  const conteudo =
    estudo.status === "ABERTO"
      ? { etapa: estudo.titulo, titulo: "Questionário em preparação", texto: "Volte a este link em breve." }
      : FECHADO[estudo.status];

  return (
    <main id="conteudo" tabIndex={-1} className={estilos.pagina}>
      <p className={estilos.etapa}>{conteudo.etapa}</p>
      <h1 className={estilos.titulo}>{conteudo.titulo}</h1>
      <p className={estilos.texto}>{conteudo.texto}</p>
    </main>
  );
}
