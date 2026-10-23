import type { Metadata, Route } from "next";
import { redirect } from "next/navigation";
import { PERGUNTAS_DEMOGRAFIA, PREFIRO_NAO_RESPONDER } from "@/lib/demografia";
import { estudoPublico, participacaoAtual } from "@/lib/participacao";
import { salvarDemografia } from "../acoes";
import estilos from "./sobre-voce.module.css";

type Propriedades = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Propriedades): Promise<Metadata> {
  const estudo = await estudoPublico((await params).slug);
  return { title: `Dados opcionais · ${estudo.titulo}` };
}

// Protótipo p4. Nada vem marcado e "Pular esta etapa" tem o mesmo peso de "Continuar":
// responder é escolha da pessoa, sem empurrão da interface (docs/ihc.md §3.8)
export default async function PaginaSobreVoce({ params }: Propriedades) {
  const { slug } = await params;
  const estudo = await estudoPublico(slug);
  const participacao = await participacaoAtual(estudo.id);
  if (!participacao?.concluidaEm) redirect(`/r/${slug}` as Route);

  return (
    <main id="conteudo" tabIndex={-1} className={estilos.pagina}>
      <p className={estilos.etapa}>Etapa 3 de 3 · Dados opcionais</p>
      <header className={estilos.cabecalho}>
        <h1 className={estilos.titulo}>Sobre você</h1>
        <p className={estilos.descricao}>
          Estas perguntas são opcionais e ajudam a descrever o grupo de participantes. Todas têm a opção “Prefiro não
          responder”.
        </p>
      </header>
      <form action={salvarDemografia.bind(null, slug)} className={estilos.formulario}>
        {PERGUNTAS_DEMOGRAFIA.map((pergunta) => (
          <fieldset key={pergunta.campo} className={estilos.grupo}>
            <legend className={estilos.legenda}>{pergunta.titulo}</legend>
            <div className={estilos.opcoes}>
              {[...pergunta.opcoes, PREFIRO_NAO_RESPONDER].map((opcao) => (
                <label key={opcao} className={estilos.opcao}>
                  <input type="radio" name={pergunta.campo} value={opcao} className={estilos.circulo} />
                  {opcao}
                </label>
              ))}
            </div>
          </fieldset>
        ))}
        <div className={estilos.botoes}>
          <button type="submit" name="acao" value="continuar" className={estilos.botao}>
            Continuar
          </button>
          <button type="submit" name="acao" value="pular" className={estilos.botao}>
            Pular esta etapa
          </button>
        </div>
      </form>
    </main>
  );
}
