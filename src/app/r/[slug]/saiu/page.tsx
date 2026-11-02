import type { Metadata } from "next";
import { textosDoIdioma } from "@/idiomas";
import { idiomaDoParticipante, textosDoEstudo } from "@/lib/participacao";
import estilos from "../participante.module.css";

type Propriedades = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Propriedades): Promise<Metadata> {
  const { slug } = await params;
  const doEstudo = await textosDoEstudo(slug);
  const { titulos } = textosDoIdioma(await idiomaDoParticipante(slug));
  return { title: `${titulos.encerrada} · ${doEstudo.titulo}` };
}

// Destino de "Não quero participar" e de "Sair sem enviar": desistir é fácil e não deixa rastro (docs/ihc.md §3.7)
export default async function PaginaSaiu({ params }: Propriedades) {
  const { slug } = await params;
  const doEstudo = await textosDoEstudo(slug);
  const { saiu } = textosDoIdioma(await idiomaDoParticipante(slug));
  return (
    <main id="conteudo" tabIndex={-1} className={estilos.pagina}>
      <p className={estilos.etapa} lang={doEstudo.lang}>
        {doEstudo.titulo}
      </p>
      <h1 className={estilos.titulo}>{saiu.titulo}</h1>
      <p className={estilos.texto}>{saiu.texto}</p>
    </main>
  );
}
