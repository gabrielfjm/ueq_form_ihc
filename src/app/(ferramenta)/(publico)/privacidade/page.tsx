import { Download, User } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import formulario from "@/componentes/formulario/formulario.module.css";
import { pesquisadorDaSessao } from "@/lib/sessao";
import { tradutor } from "@/traducao/servidor";
import { voltaDaPrivacidade } from "./origem";
import { Politica } from "./Politica";
import estilos from "./privacidade.module.css";
import { Voltar } from "./Voltar";

export async function generateMetadata(): Promise<Metadata> {
  const t = await tradutor();
  return { title: t("Política de privacidade · Ferramenta UEQ") };
}

type Propriedades = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function PaginaPrivacidade({ searchParams }: Propriedades) {
  const { de } = await searchParams;
  const [t, pesquisador] = await Promise.all([tradutor(), pesquisadorDaSessao()]);
  return (
    <Politica
      t={t}
      comLinkDaConta
      voltar={<Voltar volta={voltaDaPrivacidade(de)} />}
      ficha={
        pesquisador && (
          <div className={estilos.fichaAcoes}>
            <h2 className={estilos.fichaTitulo}>{t("Seus dados")}</h2>
            <a href="/api/conta/dados" download className={formulario.linkAcao}>
              <Download size={18} strokeWidth={1.5} aria-hidden="true" />
              <span>{t("Baixar meus dados")}</span>
            </a>
            <Link href="/conta" className={formulario.linkAcao}>
              <User size={18} strokeWidth={1.5} aria-hidden="true" />
              <span>{t("Minha conta")}</span>
            </Link>
          </div>
        )
      }
    />
  );
}
