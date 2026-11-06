import type { Metadata } from "next";
import { headers } from "next/headers";
import { Avisos } from "@/componentes/Avisos";
import { contagemDeRespostas, estudoDoPesquisador } from "@/lib/estudos";
import { hojeEmBrasilia } from "@/lib/periodo";
import { exigirPesquisador } from "@/lib/sessao";
import estilos from "./estudo.module.css";
import { FaixaEstudo, resumoDoEstudo } from "./FaixaEstudo";
import { FichaEstudo } from "./FichaEstudo";
import { VisaoColeta } from "./VisaoColeta";
import { VisaoRascunho } from "./VisaoRascunho";
import { tradutor } from "@/traducao/servidor";
import type { Traduzir } from "@/traducao/nucleo";
import { m } from "@/traducao/nucleo";

type Propriedades = {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const AVISOS = {
  criado: m("Estudo criado com sucesso. Ele está em rascunho: confira os dados e abra a coleta quando estiver pronto."),
  salvo: m("Alterações salvas com sucesso."),
  "convite-aceito": m("Convite aceito. O estudo agora aparece em Seus estudos, na seção Compartilhados com você."),
} as const;

export async function generateMetadata({ params }: Propriedades): Promise<Metadata> {
  const t = await tradutor();
  const pesquisador = await exigirPesquisador();
  const estudo = await estudoDoPesquisador((await params).id, pesquisador);
  return { title: t("{titulo} · Ferramenta UEQ", { titulo: estudo.titulo }) };
}

// O link vai para fora da ferramenta (e-mail, mensagem), então precisa do endereço completo
async function enderecoPublico(slug: string): Promise<string> {
  const cabecalhos = await headers();
  const host = cabecalhos.get("x-forwarded-host") ?? cabecalhos.get("host") ?? "localhost:3000";
  const protocolo = cabecalhos.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${protocolo}://${host}/r/${slug}`;
}

// "Excluir apaga o estudo, as 2 versões e as 34 respostas." (protótipo r5)
function avisoDeExclusao(t: Traduzir, versoes: number, respostas: number, status: string) {
  const dasVersoes = versoes === 1 ? t("a versão") : t("as {n} versões", { n: versoes });
  const dasRespostas = respostas === 1 ? t("a resposta") : t("as {n} respostas", { n: respostas });
  return {
    destaque:
      respostas > 0
        ? t("Excluir apaga o estudo, {versoes} e {respostas}.", { versoes: dasVersoes, respostas: dasRespostas })
        : t("Excluir apaga o estudo e {versoes}.", { versoes: dasVersoes }),
    complemento:
      status === "ABERTO"
        ? t("Não dá para desfazer. Se quiser só parar a coleta, use “Encerrar coleta”, que pode ser reaberta.")
        : t("Não dá para desfazer."),
  };
}

export default async function PaginaEstudo({ params, searchParams }: Propriedades) {
  const t = await tradutor();
  const pesquisador = await exigirPesquisador();
  const estudo = await estudoDoPesquisador((await params).id, pesquisador);
  const { aviso } = await searchParams;
  const respostas = await contagemDeRespostas(estudo.id);
  const endereco = await enderecoPublico(estudo.slugPublico);
  const rascunho = estudo.status === "RASCUNHO";
  const fora = respostas.total - respostas.naAnalise;

  const resumo = resumoDoEstudo(t, estudo.status, estudo.versoes.length, respostas);

  const ficha = (
    <FichaEstudo
      status={estudo.status}
      respostas={respostas.total}
      detalheRespostas={
        rascunho
          ? t("a coleta ainda não foi aberta")
          : respostas.total === 0
            ? t("nenhuma ainda")
            : fora > 0
              ? t("{naAnalise} na análise · {fora} fora da análise", { naAnalise: respostas.naAnalise, fora: fora })
              : t("todas na análise")
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
  const exclusao = avisoDeExclusao(t, estudo.versoes.length, respostas.total, estudo.status);

  return (
    <>
      <FaixaEstudo estudo={estudo} ajuda="estudo" resumo={resumo} />
      <div className={estilos.conteudo}>
        <Avisos inicial={aviso === "criado" || aviso === "salvo" || aviso === "convite-aceito" ? AVISOS[aviso] : null} className={estilos.regiaoStatus}>
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
