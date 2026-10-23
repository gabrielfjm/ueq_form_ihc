import type { Metadata, Route } from "next";
import { redirect } from "next/navigation";
import instrucao from "../../../../../data/ueq-instrucao-ptbr.json";
import { itensDoQuestionario } from "@/lib/itens-ueq";
import { estudoPublico, participacaoAtual } from "@/lib/participacao";
import { FormularioQuestionario } from "./FormularioQuestionario";
import estilos from "./questionario.module.css";

type Propriedades = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Propriedades): Promise<Metadata> {
  const estudo = await estudoPublico((await params).slug);
  return { title: `Questionário · ${estudo.titulo}` };
}

export default async function PaginaQuestionario({ params }: Propriedades) {
  const { slug } = await params;
  const estudo = await estudoPublico(slug);
  const participacao = estudo.status === "ABERTO" ? await participacaoAtual(estudo.id) : null;
  // Sem consentimento registrado (ou com a coleta fechada) não há questionário: volta ao começo do link
  if (!participacao) redirect(`/r/${slug}` as Route);
  if (participacao.concluidaEm) redirect(`/r/${slug}/sobre-voce` as Route);

  // docs/ihc.md §3.3: ordem e polaridade oficiais, lidas do banco, nunca reorganizadas pela interface
  const itens = (await itensDoQuestionario()).map(({ numero, termoEsquerdo, termoDireito }) => ({
    numero,
    termoEsquerdo,
    termoDireito,
  }));

  return (
    <div className={estilos.pagina}>
      <FormularioQuestionario
        slug={slug}
        participacaoId={participacao.id}
        tituloDocumento={`Questionário · ${estudo.titulo}`}
        itens={itens}
      >
        {/* docs/ihc.md §3.4: instrução oficial do UEQ, do pacote de idiomas (data/ueq-instrucao-ptbr.json) */}
        <header className={estilos.cabecalho}>
          <h1 className={estilos.titulo}>{estudo.produtoAvaliado}</h1>
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
