import type { Metadata, Route } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import formulario from "@/componentes/formulario/formulario.module.css";
import { estudoPublico, jaRespondeu, participacaoAtual } from "@/lib/participacao";
import { consentir } from "./acoes";
import { Etapas, Marcacoes } from "./Etapas";
import estilos from "./participante.module.css";

type Propriedades = { params: Promise<{ slug: string }> };

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
  if (estudo.status !== "ABERTO") return { title: `Estudo indisponível · ${estudo.titulo}` };
  if (await jaRespondeu()) return { title: `Você já respondeu · ${estudo.titulo}` };
  return { title: `Consentimento · ${estudo.titulo}` };
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

  if (estudo.status !== "ABERTO") return <Aviso {...FECHADO[estudo.status]} />;
  // Cookie de "já respondeu": evita um segundo envio sem querer pelo mesmo navegador (prompts/05, item 11)
  if (await jaRespondeu()) {
    return (
      <Aviso
        etapa={estudo.titulo}
        titulo="Você já respondeu este estudo"
        texto="Suas respostas foram registradas. Obrigado por participar. Você já pode fechar esta página."
      />
    );
  }
  const atual = await participacaoAtual(estudo.id);
  if (atual && !atual.concluidaEm) redirect(`/r/${slug}/questionario` as Route);

  return (
    <>
      <header className={estilos.faixa}>
        <div className={estilos.faixaInterna}>
          <Etapas atual="Consentimento" />
          <Marcacoes />
          <div className={estilos.nomeEstudo}>
            <h1 className={estilos.tituloGrande}>{estudo.titulo}</h1>
            <p className={estilos.subtitulo}>Pesquisa de experiência do usuário · PPGIa PUCPR</p>
          </div>
        </div>
      </header>
      <main id="conteudo" tabIndex={-1} className={estilos.corpo}>
        <section aria-labelledby="titulo-termo" className={estilos.termo}>
          <h2 id="titulo-termo" className={estilos.termoTitulo}>
            Termo de consentimento
          </h2>
          <p className={estilos.texto}>
            {estudo.objetivo} Você vai indicar sua impressão sobre o produto em 26 pares de palavras opostas.
          </p>
          <dl className={estilos.condicoes}>
            {[
              ["Tempo", "De 3 a 5 minutos."],
              ["Participação", "Voluntária. Você pode desistir a qualquer momento, sem dar motivo, e nada do que marcou será gravado."],
              ["Anonimato", "Não coletamos nome, e-mail, endereço IP nem outro dado que identifique você."],
              ["Uso dos dados", "As respostas são analisadas em conjunto, apenas para esta pesquisa."],
            ].map(([condicao, explicacao], posicao) => (
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
            Concordo e quero participar
          </button>
          <Link href={`/r/${slug}/saiu` as Route} className={estilos.naoQuero}>
            Não quero participar
          </Link>
        </form>
      </main>
    </>
  );
}
