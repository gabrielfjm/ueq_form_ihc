import type { Metadata } from "next";
import { textosDoIdioma } from "@/idiomas";
import { estudoPublico, textosDoEstudo, idiomaDoParticipante } from "@/lib/participacao";
import { Etapas, Marcacoes } from "../Etapas";
import estilos from "../participante.module.css";

type Propriedades = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Propriedades): Promise<Metadata> {
  const { slug } = await params;
  const doEstudo = await textosDoEstudo(slug);
  const { titulos } = textosDoIdioma(await idiomaDoParticipante(slug));
  return { title: `${titulos.registradas} · ${doEstudo.titulo}` };
}

// Protótipo p5: fechamento curto e sem animação (docs/design.md, Fim)
export default async function PaginaFim({ params }: Propriedades) {
  const { slug } = await params;
  const estudo = await estudoPublico(slug);
  const textos = textosDoIdioma(await idiomaDoParticipante(slug));
  return (
    <>
      <header className={estilos.faixa}>
        <div className={`${estilos.faixaInterna} ${estilos.faixaFim}`}>
          <Etapas atual="concluidas" textos={textos.etapas} comDadosOpcionais={estudo.coletarDemografia} />
          <Marcacoes cheias />
        </div>
      </header>
      <main id="conteudo" tabIndex={-1} className={estilos.corpo}>
        <div className={estilos.fimCaixa}>
          <h1 className={estilos.fimTitulo}>{textos.fim.titulo}</h1>
          <p className={estilos.fimTexto}>{textos.fim.texto}</p>
          <p className={estilos.fimNota}>{textos.fim.nota}</p>
        </div>
      </main>
    </>
  );
}
