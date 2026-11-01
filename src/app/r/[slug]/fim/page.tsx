import type { Metadata } from "next";
import { textosDoIdioma } from "@/idiomas";
import { estudoPublico, idiomaDoParticipante } from "@/lib/participacao";
import { Etapas, Marcacoes } from "../Etapas";
import estilos from "../participante.module.css";

type Propriedades = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Propriedades): Promise<Metadata> {
  const estudo = await estudoPublico((await params).slug);
  const { titulos } = textosDoIdioma(await idiomaDoParticipante());
  return { title: `${titulos.registradas} · ${estudo.titulo}` };
}

// Protótipo p5: fechamento curto e sem animação (docs/design.md, Fim)
export default async function PaginaFim({ params }: Propriedades) {
  const estudo = await estudoPublico((await params).slug);
  const textos = textosDoIdioma(await idiomaDoParticipante());
  return (
    <>
      <header className={estilos.faixa}>
        <div className={`${estilos.faixaInterna} ${estilos.faixaFim}`}>
          <Etapas atual="concluidas" textos={textos.etapas} comDadosOpcionais={estudo.coletarDemografia} />
          <Marcacoes cheias />
        </div>
      </header>
      <main id="conteudo" tabIndex={-1} className={estilos.corpo}>
        <h1 className={estilos.fimTitulo}>{textos.fim.titulo}</h1>
        <p className={estilos.fimTexto}>{textos.fim.texto}</p>
        <p className={estilos.fimNota}>{textos.fim.nota}</p>
      </main>
    </>
  );
}
