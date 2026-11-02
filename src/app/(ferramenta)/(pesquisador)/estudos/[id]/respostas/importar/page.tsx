import type { Metadata } from "next";
import { contagemDeRespostas, estudoDoPesquisador } from "@/lib/estudos";
import { exigirPesquisador } from "@/lib/sessao";
import { FaixaEstudo, resumoDoEstudo } from "../../FaixaEstudo";
import { FormularioImportacao } from "./FormularioImportacao";
import estilos from "./importar.module.css";
import { tradutor } from "@/traducao/servidor";

type Propriedades = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Propriedades): Promise<Metadata> {
  const t = await tradutor();
  const pesquisador = await exigirPesquisador();
  const estudo = await estudoDoPesquisador((await params).id, pesquisador, "editar");
  return { title: t("Importar respostas · {titulo} · Ferramenta UEQ", { titulo: estudo.titulo }) };
}

// prompts/10-extensoes.md: respostas coletadas fora da ferramenta (papel, outro formulário, a planilha
// oficial) entram no mesmo estudo, marcadas como importadas, e passam pela mesma análise
export default async function PaginaImportar({ params }: Propriedades) {
  const t = await tradutor();
  const pesquisador = await exigirPesquisador();
  const estudo = await estudoDoPesquisador((await params).id, pesquisador, "editar");
  const respostas = await contagemDeRespostas(estudo.id);

  return (
    <>
      <FaixaEstudo estudo={estudo} ajuda="importar" resumo={resumoDoEstudo(t, estudo.status, estudo.versoes.length, respostas)} />
      <div className={estilos.conteudo}>
        <header className={estilos.cabecalho}>
          <h2 className={estilos.titulo}>{t("Importar respostas de um CSV")}</h2>
          <p>
            {t("Para trazer respostas coletadas fora da ferramenta, em papel ou em outro formulário. O formato é o da aba Data da planilha oficial, o mesmo da exportação “Formato da planilha oficial”.")}
          </p>
        </header>
        <FormularioImportacao estudoId={estudo.id} versoes={estudo.versoes.map(({ id, nome }) => ({ id, nome }))} />
      </div>
    </>
  );
}
