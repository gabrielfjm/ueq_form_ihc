import type { Metadata, Route } from "next";
import Link from "next/link";
import { infoIdioma, textosDoIdioma } from "@/idiomas";
import { estudoPublico, idiomaDoParticipante, textosDoEstudo } from "@/lib/participacao";
import { condicoesDoTermo } from "@/lib/termo";
import estilos from "../participante.module.css";
import { Termo } from "../Termo";
import { BotaoImprimir } from "./BotaoImprimir";

type Propriedades = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Propriedades): Promise<Metadata> {
  const { slug } = await params;
  const doEstudo = await textosDoEstudo(slug);
  const { consentimento } = textosDoIdioma(await idiomaDoParticipante(slug));
  return { title: `${consentimento.termoTitulo} · ${doEstudo.titulo}` };
}

// Uma via do termo para a pessoa guardar (Resolução CNS 510/2016): o termo inteiro, com o título do estudo,
// para imprimir ou salvar em PDF. Como as outras telas do participante, não leva a nenhum lugar fora do link
export default async function PaginaViaDoTermo({ params }: Propriedades) {
  const { slug } = await params;
  const estudo = await estudoPublico(slug);
  const doEstudo = await textosDoEstudo(slug);
  const textos = textosDoIdioma(infoIdioma(await idiomaDoParticipante(slug)).codigo);

  return (
    <>
      <header className={estilos.faixa}>
        <div className={estilos.faixaInterna}>
          <div className={estilos.nomeEstudo}>
            <h1 className={estilos.tituloGrande} lang={doEstudo.lang}>
              {doEstudo.titulo}
            </h1>
            <p className={estilos.subtitulo}>
              {textos.consentimento.subtitulo} · {estudo.instituicao}
            </p>
          </div>
        </div>
      </header>
      <main id="conteudo" tabIndex={-1} className={estilos.corpo}>
        <Termo
          textos={textos.consentimento}
          objetivo={doEstudo.objetivo}
          langDoEstudo={doEstudo.lang}
          condicoes={condicoesDoTermo(textos, { ...estudo, ...doEstudo })}
        />
        <div className={estilos.acoesVia}>
          <BotaoImprimir texto={textos.consentimento.imprimir} />
          <Link href={`/r/${slug}` as Route}>{textos.politica.voltar}</Link>
        </div>
      </main>
    </>
  );
}
