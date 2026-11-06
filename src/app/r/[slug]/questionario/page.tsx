import type { Metadata, Route } from "next";
import { redirect } from "next/navigation";
import { formatar } from "@/idiomas/formatar";
import { infoIdioma, instrucaoDoIdioma, termosDoIdioma, textosDoIdioma } from "@/idiomas";
import { itensDoQuestionario } from "@/lib/itens-ueq";
import { estudoPublico, textosDoEstudo, idiomaDoParticipante, participacaoAtual } from "@/lib/participacao";
import participante from "../participante.module.css";
import { SeletorIdioma } from "../SeletorIdioma";
import { FormularioQuestionario } from "./FormularioQuestionario";
import estilos from "./questionario.module.css";

type Propriedades = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Propriedades): Promise<Metadata> {
  const { slug } = await params;
  const doEstudo = await textosDoEstudo(slug);
  const { titulos } = textosDoIdioma(await idiomaDoParticipante(slug));
  return { title: `${titulos.questionario} · ${doEstudo.titulo}` };
}

export default async function PaginaQuestionario({ params }: Propriedades) {
  const { slug } = await params;
  const estudo = await estudoPublico(slug);
  const doEstudo = await textosDoEstudo(slug);
  const participacao = estudo.status === "ABERTO" ? await participacaoAtual(estudo.id) : null;
  // Sem consentimento registrado (ou com a coleta fechada) não há questionário: volta ao começo do link
  if (!participacao) redirect(`/r/${slug}` as Route);
  if (participacao.concluidaEm) redirect(`/r/${slug}/sobre-voce` as Route);

  const idioma = infoIdioma(await idiomaDoParticipante(slug));
  const textos = textosDoIdioma(idioma.codigo);
  const instrucao = instrucaoDoIdioma(idioma.codigo);
  // docs/ihc.md §3.3: ordem e polaridade oficiais, nunca reorganizadas pela interface. Os números vêm do banco
  // (é contra eles que o envio é validado) e os termos, do pacote oficial de idiomas (data/ueq-idiomas.json)
  const termos = new Map(termosDoIdioma(idioma.codigo).map((par) => [par.numero, par]));
  const itens = (await itensDoQuestionario()).map(({ numero }) => termos.get(numero)!);

  return (
    <div className={estilos.pagina}>
      {/* A mesma faixa do consentimento: a pessoa sente que continua no mesmo lugar. O idioma pode ser trocado
          aqui também, e as marcações já feitas voltam do rascunho */}
      <header className={participante.faixa}>
        <div className={`${participante.faixaInterna} ${participante.faixaLarga}`}>
          <SeletorIdioma slug={slug} idioma={idioma} textos={textos.idioma} aguarde={textos.aguarde} voltar="questionario" />
          <div className={participante.nomeEstudo}>
            <p className={participante.etapaFaixa}>
              {formatar(textos.etapas.etapaDeTotal, { n: 2, total: estudo.coletarDemografia ? 3 : 2, nome: textos.etapas.nomes[1] })}
            </p>
            <h1 className={participante.tituloGrande} lang={doEstudo.lang}>
              {doEstudo.produtoAvaliado}
            </h1>
          </div>
        </div>
      </header>
      <FormularioQuestionario
        slug={slug}
        participacaoId={participacao.id}
        tituloDocumento={`${textos.titulos.questionario} · ${doEstudo.titulo}`}
        itens={itens}
        textos={textos.questionario}
        aguarde={textos.aguarde}
        lang={idioma.lang}
        direcao={idioma.direcao}
      >
        {/* docs/ihc.md §3.4: instrução oficial do UEQ, do pacote de idiomas (data/ueq-instrucoes.json), num quadro
            à parte para não virar um bloco de texto solto antes dos itens */}
        <section aria-labelledby="titulo-instrucao" className={estilos.instrucao}>
          <h2 id="titulo-instrucao" className={estilos.instrucaoTitulo}>
            {instrucao.titulo}
          </h2>
          {instrucao.paragrafos.map((paragrafo) => (
            <p key={paragrafo}>{paragrafo}</p>
          ))}
        </section>
      </FormularioQuestionario>
    </div>
  );
}
