import type { Metadata, Route } from "next";
import { redirect } from "next/navigation";
import { formatar } from "@/idiomas/formatar";
import { infoIdioma, instrucaoDoIdioma, termosDoIdioma, textosDoIdioma } from "@/idiomas";
import { itensDoQuestionario } from "@/lib/itens-ueq";
import { estudoPublico, idiomaDoParticipante, participacaoAtual } from "@/lib/participacao";
import { FormularioQuestionario } from "./FormularioQuestionario";
import estilos from "./questionario.module.css";

type Propriedades = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Propriedades): Promise<Metadata> {
  const estudo = await estudoPublico((await params).slug);
  const { titulos } = textosDoIdioma(await idiomaDoParticipante());
  return { title: `${titulos.questionario} · ${estudo.titulo}` };
}

export default async function PaginaQuestionario({ params }: Propriedades) {
  const { slug } = await params;
  const estudo = await estudoPublico(slug);
  const participacao = estudo.status === "ABERTO" ? await participacaoAtual(estudo.id) : null;
  // Sem consentimento registrado (ou com a coleta fechada) não há questionário: volta ao começo do link
  if (!participacao) redirect(`/r/${slug}` as Route);
  if (participacao.concluidaEm) redirect(`/r/${slug}/sobre-voce` as Route);

  const idioma = infoIdioma(await idiomaDoParticipante());
  const textos = textosDoIdioma(idioma.codigo);
  const instrucao = instrucaoDoIdioma(idioma.codigo);
  // docs/ihc.md §3.3: ordem e polaridade oficiais, nunca reorganizadas pela interface. Os números vêm do banco
  // (é contra eles que o envio é validado) e os termos, do pacote oficial de idiomas (data/ueq-idiomas.json)
  const termos = new Map(termosDoIdioma(idioma.codigo).map((par) => [par.numero, par]));
  const itens = (await itensDoQuestionario()).map(({ numero }) => termos.get(numero)!);

  return (
    <div className={estilos.pagina}>
      <FormularioQuestionario
        slug={slug}
        participacaoId={participacao.id}
        tituloDocumento={`${textos.titulos.questionario} · ${estudo.titulo}`}
        etapa={formatar(textos.etapas.etapaDeTotal, { n: 2, total: estudo.coletarDemografia ? 3 : 2, nome: textos.etapas.nomes[1] })}
        itens={itens}
        textos={textos.questionario}
        lang={idioma.lang}
        direcao={idioma.direcao}
      >
        {/* docs/ihc.md §3.4: instrução oficial do UEQ, do pacote de idiomas (data/ueq-instrucoes.json) */}
        <header className={estilos.cabecalho}>
          <h1 className={estilos.titulo} lang="pt-BR">
            {estudo.produtoAvaliado}
          </h1>
          <div className={estilos.instrucao}>
            <p className={estilos.instrucaoTitulo}>{instrucao.titulo}</p>
            {instrucao.paragrafos.map((paragrafo) => (
              <p key={paragrafo}>{paragrafo}</p>
            ))}
          </div>
        </header>
      </FormularioQuestionario>
    </div>
  );
}
