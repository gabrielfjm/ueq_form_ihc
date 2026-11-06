import type { Metadata, Route } from "next";
import Link from "next/link";
import { Politica } from "@/app/(ferramenta)/(publico)/privacidade/Politica";
import estilos from "@/app/(ferramenta)/(publico)/privacidade/privacidade.module.css";
import { infoIdioma, textosDoIdioma } from "@/idiomas";
import { estudoPublico, idiomaDoParticipante, textosDoEstudo } from "@/lib/participacao";
import { tradutorDoIdioma } from "@/traducao/servidor";

type Propriedades = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Propriedades): Promise<Metadata> {
  const { slug } = await params;
  const doEstudo = await textosDoEstudo(slug);
  const { consentimento } = textosDoIdioma(await idiomaDoParticipante(slug));
  return { title: `${consentimento.privacidade} · ${doEstudo.titulo}` };
}

// A mesma política da ferramenta, dentro do link do participante: sem barra e sem caminho para o resto da
// ferramenta, e sem ícone, como as outras telas dele. O voltar leva ao termo, de onde a pessoa veio.
// O texto vem da tradução automática; enquanto ela não existe, sai em português, marcado com o lang certo
export default async function PaginaPrivacidadeParticipante({ params }: Propriedades) {
  const { slug } = await params;
  await estudoPublico(slug);
  const idioma = infoIdioma(await idiomaDoParticipante(slug));
  const textos = textosDoIdioma(idioma.codigo);
  const t = await tradutorDoIdioma(idioma.codigo);
  const semTraducao = t.lang !== idioma.lang;

  return (
    <main id="conteudo" tabIndex={-1} lang={t.lang} dir={semTraducao ? "ltr" : undefined}>
      <Politica
        t={t}
        comLinkDaConta={false}
        voltar={
          <Link href={`/r/${slug}` as Route} className={estilos.voltar} lang={idioma.lang} dir={idioma.direcao}>
            {textos.politica.voltar}
          </Link>
        }
        aviso={
          semTraducao && (
            <p className={estilos.aviso} lang={idioma.lang} dir={idioma.direcao}>
              {textos.politica.semTraducao}
            </p>
          )
        }
      />
    </main>
  );
}
