"use client";

import { BookOpen, Folder, LogOut, Plus, User, type LucideIcon } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { BarraFixa } from "./BarraFixa";
import { Confirmacao } from "@/componentes/janela/Confirmacao";
import { Logotipo } from "@/componentes/Logotipo";
import { sair } from "./acoes";
import estilos from "./pesquisador.module.css";

type ItemNavegacao = {
  href: Route;
  texto: string;
  Icone: LucideIcon;
  atual: (caminho: string) => boolean;
};

// docs/design.md, Layout: barra fina com links de ícone e texto, sem sidebar
const ITENS: readonly ItemNavegacao[] = [
  {
    href: "/estudos",
    texto: "Estudos",
    Icone: Folder,
    atual: (caminho) => caminho.startsWith("/estudos") && caminho !== "/estudos/novo",
  },
  { href: "/estudos/novo", texto: "Criar estudo", Icone: Plus, atual: (caminho) => caminho === "/estudos/novo" },
  {
    href: "/documentacao",
    texto: "Documentação",
    Icone: BookOpen,
    atual: (caminho) => caminho === "/documentacao" || caminho.startsWith("/documentacao/"),
  },
  { href: "/conta", texto: "Minha conta", Icone: User, atual: (caminho) => caminho === "/conta" },
];

export function BarraSuperior() {
  const caminho = usePathname();
  const [confirmandoSaida, setConfirmandoSaida] = useState(false);
  return (
    <>
      <BarraFixa
        inicio={
          <Link href="/estudos" className={estilos.inicio}>
            <Logotipo />
          </Link>
        }
      >
        {ITENS.map(({ href, texto, Icone, atual }) => (
          <Link
            key={href}
            href={href}
            className={estilos.linkNavegacao}
            aria-current={atual(caminho) ? "page" : undefined}
          >
            <Icone size={18} strokeWidth={1.5} aria-hidden="true" />
            <span>{texto}</span>
          </Link>
        ))}
        {/* Sair muda estado no servidor, por isso é botão e não link. Pede confirmação antes (protótipo r20):
            quem clica sem querer no celular, com o menu aberto, não perde a sessão */}
        <button
          type="button"
          className={estilos.linkNavegacao}
          aria-haspopup="dialog"
          onClick={() => setConfirmandoSaida(true)}
        >
          <LogOut size={18} strokeWidth={1.5} aria-hidden="true" />
          <span>Sair</span>
        </button>
      </BarraFixa>
      <Confirmacao
        aberta={confirmandoSaida}
        aoFechar={() => setConfirmandoSaida(false)}
        titulo="Sair da conta?"
        textoConfirmar="Sair"
        Icone={LogOut}
        action={sair}
        focarConfirmar
      >
        <p className={estilos.descricao}>
          Seus estudos continuam salvos e os links seguem aceitando respostas. Para voltar, entre de novo com seu
          e-mail e senha.
        </p>
      </Confirmacao>
    </>
  );
}
