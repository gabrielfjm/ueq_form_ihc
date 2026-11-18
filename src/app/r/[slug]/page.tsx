import type { Metadata, Route } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import formulario from "@/componentes/formulario/formulario.module.css";
import { infoIdioma, textosDoIdioma } from "@/idiomas";
import { estudoPublico, textosDoEstudo, idiomaDoParticipante, jaRespondeu, participacaoAtual } from "@/lib/participacao";
import { condicoesDoTermo } from "@/lib/termo";
import { Termo } from "./Termo";
import { consentir } from "./acoes";
import { Etapas, Marcacoes } from "./Etapas";
import estilos from "./participante.module.css";
import { SeletorIdioma } from "./SeletorIdioma";
import { BotaoEnvio } from "@/componentes/formulario/BotaoEnvio";

type Propriedades = { params: Promise<{ slug: string }>; searchParams: Promise<{ erro?: string; idade?: string }> };

export async function generateMetadata({ params }: Propriedades): Promise<Metadata> {
  const { slug } = await params;
  const estudo = await estudoPublico(slug);
  const doEstudo = await textosDoEstudo(slug);
  const { titulos } = textosDoIdioma(await idiomaDoParticipante(slug));
  if (estudo.status !== "ABERTO") return { title: `${titulos.indisponivel} · ${doEstudo.titulo}` };
  if (await jaRespondeu()) return { title: `${titulos.jaRespondeu} · ${doEstudo.titulo}` };
  return { title: `${titulos.consentimento} · ${doEstudo.titulo}` };
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

export default async function PaginaConsentimento({ params, searchParams }: Propriedades) {
  const { slug } = await params;
  const { erro, idade } = await searchParams;
  const estudo = await estudoPublico(slug);
  const doEstudo = await textosDoEstudo(slug);
  const idioma = infoIdioma(await idiomaDoParticipante(slug));
  const textos = textosDoIdioma(idioma.codigo);

  // Protótipo p6: link de estudo em rascunho ou com a coleta encerrada
  if (estudo.status === "RASCUNHO") return <Aviso {...textos.fechado.rascunho} />;
  if (estudo.status === "ENCERRADO") return <Aviso {...textos.fechado.encerrado} />;
  // Cookie de "já respondeu": evita um segundo envio sem querer pelo mesmo navegador (prompts/05, item 11)
  if (await jaRespondeu()) return <Aviso etapa={doEstudo.titulo} {...textos.jaRespondeu} />;
  const atual = await participacaoAtual(estudo.id);
  if (atual && !atual.concluidaEm) redirect(`/r/${slug}/questionario` as Route);

  const { consentimento } = textos;
  const erroIdade = erro === "idade" ? consentimento.idade.erroIdade : erro === "autorizacao" ? consentimento.idade.erroAutorizacao : null;
  const marcada = erro === "autorizacao" || idade === "menor" ? "menor" : undefined;
  return (
    <>
      <header className={estilos.faixa}>
        <div className={estilos.faixaInterna}>
          <SeletorIdioma slug={slug} idioma={idioma} textos={textos.idioma} aguarde={textos.aguarde} />
          <Etapas atual={0} textos={textos.etapas} comDadosOpcionais={estudo.coletarDemografia} />
          <Marcacoes />
          <div className={estilos.nomeEstudo}>
            {/* Título e objetivo são escritos pelo pesquisador e traduzidos para o idioma do participante */}
            <h1 className={estilos.tituloGrande} lang={doEstudo.lang}>
              {doEstudo.titulo}
            </h1>
            <p className={estilos.subtitulo}>
              {consentimento.subtitulo} · {estudo.instituicao}
            </p>
          </div>
        </div>
      </header>
      <main id="conteudo" tabIndex={-1} className={estilos.corpo}>
        <Termo
          textos={consentimento}
          objetivo={doEstudo.objetivo}
          langDoEstudo={doEstudo.lang}
          instrumento={estudo.instrumento}
          condicoes={condicoesDoTermo(textos, { ...estudo, ...doEstudo })}
        >
          {/* LGPD, art. 9º: quem vai consentir precisa poder ler o que acontece com os dados. As duas páginas
              ficam dentro do link do participante: nenhum caminho leva ao resto da ferramenta */}
          <p className={estilos.linksTermo}>
            <Link href={`/r/${slug}/privacidade` as Route}>{consentimento.privacidade}</Link>
            <Link href={`/r/${slug}/termo` as Route}>{consentimento.via}</Link>
          </p>
        </Termo>
        {/* Uma ação principal só (Hick, Nielsen 8); recusar é um link igualmente visível (§3.7) */}
        <form action={consentir.bind(null, slug)} className={estilos.decisao} noValidate>
          {/* LGPD, art. 14: menores de 18 anos só com a autorização do responsável. A confirmação aparece ao
              escolher "Menos de 18 anos" (sem JavaScript, ela fica sempre à vista) e é conferida no servidor */}
          <fieldset className={estilos.idade} aria-describedby={erroIdade ? "erro-idade" : undefined}>
            <legend className={estilos.idadeLegenda}>{consentimento.idade.legenda}</legend>
            {erroIdade && (
              <p id="erro-idade" role="alert" className={formulario.erro}>
                {erroIdade}
              </p>
            )}
            <label className={formulario.opcao}>
              <input type="radio" name="idade" value="maior" autoFocus={erro === "idade"} />
              <span>{consentimento.idade.maior}</span>
            </label>
            <label className={formulario.opcao}>
              <input type="radio" name="idade" value="menor" defaultChecked={marcada === "menor"} />
              <span>{consentimento.idade.menor}</span>
            </label>
            <div className={estilos.autorizacao}>
              <label className={formulario.opcao}>
                <input type="checkbox" name="autorizacao" value="sim" autoFocus={erro === "autorizacao"} />
                <span>{consentimento.idade.autorizacao}</span>
              </label>
              <p className={formulario.ajuda}>{consentimento.idade.ajudaMenor}</p>
            </div>
          </fieldset>
          <BotaoEnvio semIndicador textoEnviando={textos.aguarde} className={`${formulario.botao} ${formulario.primario} ${estilos.concordo}`}>
            {consentimento.concordo}
          </BotaoEnvio>
          <Link href={`/r/${slug}/saiu` as Route} className={estilos.naoQuero}>
            {consentimento.naoQuero}
          </Link>
        </form>
      </main>
    </>
  );
}
