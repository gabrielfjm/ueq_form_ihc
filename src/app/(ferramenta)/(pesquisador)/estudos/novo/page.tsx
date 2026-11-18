import type { Metadata } from "next";
import Link from "next/link";
import { IDIOMAS } from "@/idiomas";
import { diaParaCampo, hojeEmBrasilia } from "@/lib/periodo";
import { banco } from "@/lib/banco";
import { exigirPesquisador } from "@/lib/sessao";
import { BENEFICIOS_SUGERIDOS, RISCOS_SUGERIDOS } from "@/lib/validacao-estudo";
import { FaixaCabecalho } from "../../FaixaCabecalho";
import { FormularioEstudo } from "../formulario/FormularioEstudo";
import { tradutor } from "@/traducao/servidor";

export async function generateMetadata(): Promise<Metadata> {
  const t = await tradutor();
  return { title: t("Criar estudo · Ferramenta UEQ") };
}

const QUATRO_SEMANAS_MS = 27 * 24 * 60 * 60 * 1000;

export default async function PaginaCriarEstudo() {
  const t = await tradutor();
  const pesquisador = await exigirPesquisador();
  const hoje = hojeEmBrasilia();
  // A instituição costuma ser a mesma de um estudo para o outro
  const anterior = await banco.estudo.findFirst({
    where: { pesquisadorId: pesquisador.id },
    orderBy: { criadoEm: "desc" },
    select: { instituicao: true },
  });

  return (
    <>
      <FaixaCabecalho
        migalha={<Link href="/estudos">{t("Estudos")}</Link>}
        titulo={t("Criar estudo")}
        ajuda="novo-estudo"
        descricao={t("O estudo começa em rascunho. Nada vai para os participantes até você abrir a coleta.")}
      />
      <FormularioEstudo
        modo="criar"
        idiomas={IDIOMAS.map(({ codigo, nome, lang, direcao }) => ({ codigo, nome, lang, direcao }))}
        valores={{
          coletarDemografia: false,
          // O completo é o recomendado pelo handbook; o pesquisador escolhe o UEQ-S quando ele não cabe
          instrumento: "UEQ",
          // O questionário nasce no idioma da conta; o pesquisador troca no formulário
          idioma: pesquisador.idioma,
          titulo: "",
          produtoAvaliado: "",
          objetivo: "",
          // Quem cria o estudo é o responsável, até dizer outro nome ou outro contato
          responsavelNome: pesquisador.nome,
          responsavelEmail: pesquisador.email,
          instituicao: anterior?.instituicao ?? "",
          riscos: t(RISCOS_SUGERIDOS),
          beneficios: t(BENEFICIOS_SUGERIDOS),
          comiteEtica: "",
          // Sugestão de quatro semanas a partir de hoje; o pesquisador troca se quiser
          dataInicio: diaParaCampo(hoje),
          dataFim: diaParaCampo(new Date(hoje.getTime() + QUATRO_SEMANAS_MS)),
          versoes: [],
        }}
      />
    </>
  );
}
