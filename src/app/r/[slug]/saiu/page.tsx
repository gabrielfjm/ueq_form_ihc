import type { Metadata } from "next";
import { textosDoIdioma } from "@/idiomas";
import { estudoPublico, idiomaDoParticipante } from "@/lib/participacao";
import estilos from "../participante.module.css";

type Propriedades = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Propriedades): Promise<Metadata> {
  const estudo = await estudoPublico((await params).slug);
  const { titulos } = textosDoIdioma(await idiomaDoParticipante());
  return { title: `${titulos.encerrada} · ${estudo.titulo}` };
}

// Destino de "Não quero participar" e de "Sair sem enviar": desistir é fácil e não deixa rastro (docs/ihc.md §3.7)
export default async function PaginaSaiu({ params }: Propriedades) {
  const estudo = await estudoPublico((await params).slug);
  const { saiu } = textosDoIdioma(await idiomaDoParticipante());
  return (
    <main id="conteudo" tabIndex={-1} className={estilos.pagina}>
      <p className={estilos.etapa} lang="pt-BR">
        {estudo.titulo}
      </p>
      <h1 className={estilos.titulo}>{saiu.titulo}</h1>
      <p className={estilos.texto}>{saiu.texto}</p>
    </main>
  );
}
