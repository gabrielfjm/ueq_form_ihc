"use client";

import { BookOpen, LogIn } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logotipo } from "@/componentes/Logotipo";
import { BarraFixa } from "../(pesquisador)/BarraFixa";
import estilos from "../(pesquisador)/pesquisador.module.css";
import { BotaoAcesso } from "./_acesso/Acesso";
import { useT } from "@/traducao/cliente";

// Protótipos r13 e r16 (sem login): a mesma barra do pesquisador, só com a documentação e Entrar.
// Entrar abre a janela por cima da página; Criar conta fica dentro dela e na página inicial
export function BarraPublica() {
  const t = useT();
  const caminho = usePathname();
  const naDocumentacao = caminho === "/documentacao" || caminho.startsWith("/documentacao/");
  return (
    <BarraFixa
      inicio={
        <Link href="/" className={estilos.inicio}>
          <Logotipo />
        </Link>
      }
    >
      <Link href="/documentacao" className={estilos.linkNavegacao} aria-current={naDocumentacao ? "page" : undefined}>
        <BookOpen size={18} strokeWidth={1.5} aria-hidden="true" />
        <span>{t("Documentação")}</span>
      </Link>
      <BotaoAcesso modo="entrar" className={estilos.linkNavegacao}>
        <LogIn size={18} strokeWidth={1.5} aria-hidden="true" />
        <span>{t("Entrar")}</span>
      </BotaoAcesso>
    </BarraFixa>
  );
}
