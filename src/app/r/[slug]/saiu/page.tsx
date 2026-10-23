import type { Metadata } from "next";
import { estudoPublico } from "@/lib/participacao";
import estilos from "../participante.module.css";

type Propriedades = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Propriedades): Promise<Metadata> {
  const estudo = await estudoPublico((await params).slug);
  return { title: `Participação encerrada · ${estudo.titulo}` };
}

// Destino de "Não quero participar" e de "Sair sem enviar": desistir é fácil e não deixa rastro (docs/ihc.md §3.7)
export default async function PaginaSaiu({ params }: Propriedades) {
  const estudo = await estudoPublico((await params).slug);
  return (
    <main id="conteudo" tabIndex={-1} className={estilos.pagina}>
      <p className={estilos.etapa}>{estudo.titulo}</p>
      <h1 className={estilos.titulo}>Você saiu do estudo</h1>
      <p className={estilos.texto}>Nenhuma resposta sua foi gravada. Obrigado pela atenção. Você já pode fechar esta página.</p>
    </main>
  );
}
