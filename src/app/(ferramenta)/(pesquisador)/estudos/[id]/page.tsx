import type { Metadata } from "next";
import { headers } from "next/headers";
import { Avisos } from "@/componentes/Avisos";
import { contagemDeRespostas, estudoDoPesquisador } from "@/lib/estudos";
import { hojeEmBrasilia } from "@/lib/periodo";
import { exigirPesquisador } from "@/lib/sessao";
import { juntarComE } from "@/lib/texto";
import estilos from "./estudo.module.css";
import { FaixaEstudo, resumoDoEstudo } from "./FaixaEstudo";
import { FichaEstudo } from "./FichaEstudo";
import { VisaoColeta } from "./VisaoColeta";
import { VisaoRascunho } from "./VisaoRascunho";

type Propriedades = {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const AVISOS = {
  criado: "Estudo criado em rascunho. Confira os dados e abra a coleta quando estiver pronto.",
  salvo: "Alterações salvas.",
} as const;

export async function generateMetadata({ params }: Propriedades): Promise<Metadata> {
  const pesquisador = await exigirPesquisador();
  const estudo = await estudoDoPesquisador((await params).id, pesquisador.id);
  return { title: `${estudo.titulo} · Ferramenta UEQ` };
}

// O link vai para fora da ferramenta (e-mail, mensagem), então precisa do endereço completo
async function enderecoPublico(slug: string): Promise<string> {
  const cabecalhos = await headers();
  const host = cabecalhos.get("x-forwarded-host") ?? cabecalhos.get("host") ?? "localhost:3000";
  const protocolo = cabecalhos.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${protocolo}://${host}/r/${slug}`;
}

// "Excluir apaga o estudo, as 2 versões e as 34 respostas." (protótipo r5)
function avisoDeExclusao(versoes: number, respostas: number, status: string) {
  const partes = ["o estudo", versoes === 1 ? "a versão" : `as ${versoes} versões`];
  if (respostas > 0) partes.push(respostas === 1 ? "a resposta" : `as ${respostas} respostas`);
  return {
    destaque: `Excluir apaga ${juntarComE(partes)}.`,
    complemento:
      status === "ABERTO"
        ? "Não dá para desfazer. Se quiser só parar a coleta, use “Encerrar coleta”, que pode ser reaberta."
        : "Não dá para desfazer.",
  };
}

export default async function PaginaEstudo({ params, searchParams }: Propriedades) {
  const pesquisador = await exigirPesquisador();
  const estudo = await estudoDoPesquisador((await params).id, pesquisador.id);
  const { aviso } = await searchParams;
  const respostas = await contagemDeRespostas(estudo.id);
  const endereco = await enderecoPublico(estudo.slugPublico);
  const rascunho = estudo.status === "RASCUNHO";
  const fora = respostas.total - respostas.naAnalise;

  const resumo = resumoDoEstudo(estudo.status, estudo.versoes.length, respostas);

  const ficha = (
    <FichaEstudo
      status={estudo.status}
      respostas={respostas.total}
      detalheRespostas={
        rascunho
          ? "a coleta ainda não foi aberta"
          : respostas.total === 0
            ? "nenhuma ainda"
            : fora > 0
              ? `${respostas.naAnalise} na análise · ${fora} fora da análise`
              : "todas na análise"
      }
      inicio={estudo.dataInicio}
      fim={estudo.dataFim}
      hoje={hojeEmBrasilia()}
      produto={estudo.produtoAvaliado}
      objetivo={rascunho ? undefined : estudo.objetivo}
      criadoEm={estudo.criadoEm}
      atualizadoEm={estudo.atualizadoEm}
    />
  );
  const exclusao = avisoDeExclusao(estudo.versoes.length, respostas.total, estudo.status);

  return (
    <>
      <FaixaEstudo estudoId={estudo.id} titulo={estudo.titulo} status={estudo.status} resumo={resumo} />
      <div className={estilos.conteudo}>
        <Avisos inicial={aviso === "criado" || aviso === "salvo" ? AVISOS[aviso] : null} className={estilos.regiaoStatus}>
          <div className={estilos.colunas}>
            <div className={estilos.secoes}>
              {rascunho ? (
                <VisaoRascunho estudo={estudo} endereco={endereco} avisoExclusao={exclusao} />
              ) : (
                <VisaoColeta estudo={estudo} endereco={endereco} respostas={respostas} avisoExclusao={exclusao} />
              )}
            </div>
            {ficha}
          </div>
        </Avisos>
      </div>
    </>
  );
}
