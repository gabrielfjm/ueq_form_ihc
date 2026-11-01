import type { Metadata, Route } from "next";
import { redirect } from "next/navigation";
import { formatar } from "@/idiomas/formatar";
import { textosDoIdioma } from "@/idiomas";
import { PERGUNTAS_DEMOGRAFIA, PREFIRO_NAO_RESPONDER } from "@/lib/demografia";
import { estudoPublico, idiomaDoParticipante, participacaoAtual } from "@/lib/participacao";
import { salvarDemografia } from "../acoes";
import estilos from "./sobre-voce.module.css";

type Propriedades = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Propriedades): Promise<Metadata> {
  const estudo = await estudoPublico((await params).slug);
  const { titulos } = textosDoIdioma(await idiomaDoParticipante());
  return { title: `${titulos.dadosOpcionais} · ${estudo.titulo}` };
}

// Protótipo p4. Nada vem marcado e "Pular esta etapa" tem o mesmo peso de "Continuar":
// responder é escolha da pessoa, sem empurrão da interface (docs/ihc.md §3.8)
export default async function PaginaSobreVoce({ params }: Propriedades) {
  const { slug } = await params;
  const estudo = await estudoPublico(slug);
  const participacao = await participacaoAtual(estudo.id);
  if (!participacao?.concluidaEm) redirect(`/r/${slug}` as Route);
  // Estudo sem coleta de dados demográficos não tem esta etapa
  if (!estudo.coletarDemografia) redirect(`/r/${slug}/fim` as Route);
  const textos = textosDoIdioma(await idiomaDoParticipante());
  const { sobreVoce } = textos;

  return (
    <main id="conteudo" tabIndex={-1} className={estilos.pagina}>
      <p className={estilos.etapa}>
        {formatar(textos.etapas.etapaDeTotal, { n: 3, total: 3, nome: textos.etapas.nomes[2] })}
      </p>
      <header className={estilos.cabecalho}>
        <h1 className={estilos.titulo}>{sobreVoce.titulo}</h1>
        <p className={estilos.descricao}>{sobreVoce.descricao}</p>
      </header>
      <form action={salvarDemografia.bind(null, slug)} className={estilos.formulario}>
        {PERGUNTAS_DEMOGRAFIA.map((pergunta) => {
          const traducao = sobreVoce[pergunta.campo];
          // O valor gravado é sempre a opção em português, em qualquer idioma: a análise e as exportações
          // continuam com as mesmas categorias. Só o texto mostrado muda
          const opcoes = [
            ...pergunta.opcoes.map((valor, posicao) => ({ valor, texto: traducao.opcoes[posicao] })),
            { valor: PREFIRO_NAO_RESPONDER, texto: sobreVoce.prefiroNao },
          ];
          return (
            <fieldset key={pergunta.campo} className={estilos.grupo}>
              <legend className={estilos.legenda}>{traducao.titulo}</legend>
              <div className={estilos.opcoes}>
                {opcoes.map((opcao) => (
                  <label key={opcao.valor} className={estilos.opcao}>
                    <input type="radio" name={pergunta.campo} value={opcao.valor} className={estilos.circulo} />
                    {opcao.texto}
                  </label>
                ))}
              </div>
            </fieldset>
          );
        })}
        <div className={estilos.botoes}>
          <button type="submit" name="acao" value="continuar" className={estilos.botao}>
            {sobreVoce.continuar}
          </button>
          <button type="submit" name="acao" value="pular" className={estilos.botao}>
            {sobreVoce.pular}
          </button>
        </div>
      </form>
    </main>
  );
}
