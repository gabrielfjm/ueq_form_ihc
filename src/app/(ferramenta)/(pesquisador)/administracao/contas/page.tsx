import { UserPlus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import formulario from "@/componentes/formulario/formulario.module.css";
import { exigirAdministrador } from "@/lib/administracao";
import { banco } from "@/lib/banco";
import { formatarData, plural } from "@/lib/texto";
import { FaixaCabecalho } from "../../FaixaCabecalho";
import estilos from "../administracao.module.css";
import { ContasAdmin } from "./ContasAdmin";
import { tradutor } from "@/traducao/servidor";

export async function generateMetadata(): Promise<Metadata> {
  const t = await tradutor();
  return { title: t("Contas · Administração · Ferramenta UEQ") };
}

export default async function PaginaContas() {
  const t = await tradutor();
  const administrador = await exigirAdministrador();
  const contas = await banco.pesquisador.findMany({
    orderBy: { criadoEm: "asc" },
    select: {
      id: true,
      nome: true,
      email: true,
      criadoEm: true,
      administrador: true,
      tutorialVistoEm: true,
      _count: { select: { estudos: true } },
    },
  });

  return (
    <>
      <FaixaCabecalho
        titulo={t("Contas")}
        ajuda="administracao"
        migalha={<Link href="/administracao">{t("Administração")}</Link>}
        resumo={plural(contas.length, t("conta"), t("contas"))}
        acao={
          <Link href="/administracao/contas/nova" className={`${formulario.botao} ${formulario.primario}`}>
            <UserPlus size={18} strokeWidth={1.5} aria-hidden="true" className={formulario.icone} />
            <span>{t("Criar conta para alguém")}</span>
          </Link>
        }
      />
      <div className={estilos.conteudo}>
        <ContasAdmin
          idAtual={administrador.id}
          contas={contas.map((conta) => ({
            id: conta.id,
            nome: conta.nome,
            email: conta.email,
            criadaEm: formatarData(conta.criadoEm),
            administrador: conta.administrador,
            estudos: conta._count.estudos,
            jaEntrou: conta.tutorialVistoEm !== null,
          }))}
        />
      </div>
    </>
  );
}
