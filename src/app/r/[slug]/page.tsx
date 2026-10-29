import type { Metadata, Route } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import formulario from "@/componentes/formulario/formulario.module.css";
import { infoIdioma, textosDoIdioma } from "@/idiomas";
import { estudoPublico, idiomaDoParticipante, jaRespondeu, participacaoAtual } from "@/lib/participacao";
import { consentir } from "./acoes";
import { Etapas, Marcacoes } from "./Etapas";
import estilos from "./participante.module.css";
import { SeletorIdioma } from "./SeletorIdioma";

type Propriedades = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Propriedades): Promise<Metadata> {
  const estudo = await estudoPublico((await params).slug);
  const { titulos } = textosDoIdioma(await idiomaDoParticipante());
  if (estudo.status !== "ABERTO") return { title: `${titulos.indisponivel} · ${estudo.titulo}` };
  if (await jaRespondeu()) return { title: `${titulos.jaRespondeu} · ${estudo.titulo}` };
  return { title: `${titulos.consentimento} · ${estudo.titulo}` };
}

function Aviso({ etapa, titulo, texto }: { etapa: string; titulo: string; texto: string }) {
  return (
    <main id="conteudo" tabIndex={-1} className={estilos.pagina}>
      <p className={estilos.etapa}>{etapa}</p>
      <h1 className={estilos.titulo}>{titulo}</h1>
      <p className={estilos.texto}>{texto}</p>
    </main>
  );
}

export default async function PaginaConsentimento({ params }: Propriedades) {
  const { slug } = await params;
  const estudo = await estudoPublico(slug);
  const idioma = infoIdioma(await idiomaDoParticipante());
  const textos = textosDoIdioma(idioma.codigo);

  // Protótipo p6: link de estudo em rascunho ou com a coleta encerrada
  if (estudo.status === "RASCUNHO") return <Aviso {...textos.fechado.rascunho} />;
  if (estudo.status === "ENCERRADO") return <Aviso {...textos.fechado.encerrado} />;
  // Cookie de "já respondeu": evita um segundo envio sem querer pelo mesmo navegador (prompts/05, item 11)
  if (await jaRespondeu()) return <Aviso etapa={estudo.titulo} {...textos.jaRespondeu} />;
  const atual = await participacaoAtual(estudo.id);
  if (atual && !atual.concluidaEm) redirect(`/r/${slug}/questionario` as Route);

  const { consentimento } = textos;
  return (
    <>
      <header className={estilos.faixa}>
        <div className={estilos.faixaInterna}>
          <SeletorIdioma slug={slug} idioma={idioma} textos={textos.idioma} />
          <Etapas atual={0} textos={textos.etapas} />
          <Marcacoes />
          <div className={estilos.nomeEstudo}>
            {/* Título e objetivo são escritos pelo pesquisador, em português */}
            <h1 className={estilos.tituloGrande} lang="pt-BR">
              {estudo.titulo}
            </h1>
            <p className={estilos.subtitulo}>{consentimento.subtitulo}</p>
          </div>
        </div>
      </header>
      <main id="conteudo" tabIndex={-1} className={estilos.corpo}>
        <section aria-labelledby="titulo-termo" className={estilos.termo}>
          <h2 id="titulo-termo" className={estilos.termoTitulo}>
            {consentimento.termoTitulo}
          </h2>
          <p className={estilos.texto}>
            <span lang="pt-BR">{estudo.objetivo}</span> {consentimento.termoTexto}
          </p>
          <dl className={estilos.condicoes}>
            {consentimento.condicoes.map(([condicao, explicacao], posicao) => (
              <div key={condicao}>
                <span className={estilos.condicaoNumero} aria-hidden="true">
                  {String(posicao + 1).padStart(2, "0")}
                </span>
                <dt>{condicao}</dt>
                <dd>{explicacao}</dd>
              </div>
            ))}
          </dl>
        </section>
        {/* Uma ação principal só (Hick, Nielsen 8); recusar é um link igualmente visível (§3.7) */}
        <form action={consentir.bind(null, slug)} className={estilos.decisao}>
          <button type="submit" className={`${formulario.botao} ${formulario.primario} ${estilos.concordo}`}>
            {consentimento.concordo}
          </button>
          <Link href={`/r/${slug}/saiu` as Route} className={estilos.naoQuero}>
            {consentimento.naoQuero}
          </Link>
        </form>
      </main>
    </>
  );
}
