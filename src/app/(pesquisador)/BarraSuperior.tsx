"use client";

import { Folder, LogOut, Plus, User, type LucideIcon } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logotipo } from "@/componentes/Logotipo";
import { sair } from "./acoes";
import estilos from "./pesquisador.module.css";

type ItemNavegacao = {
  href: Route;
  texto: string;
  Icone: LucideIcon;
  atual: (caminho: string) => boolean;
};

// docs/design.md, Layout: barra fina com 4 links de ícone e texto, sem sidebar
const ITENS: readonly ItemNavegacao[] = [
  {
    href: "/estudos",
    texto: "Estudos",
    Icone: Folder,
    atual: (caminho) => caminho.startsWith("/estudos") && caminho !== "/estudos/novo",
  },
  { href: "/estudos/novo", texto: "Criar estudo", Icone: Plus, atual: (caminho) => caminho === "/estudos/novo" },
  { href: "/conta", texto: "Minha conta", Icone: User, atual: (caminho) => caminho === "/conta" },
];

export function BarraSuperior() {
  const caminho = usePathname();
  return (
    <header className={estilos.barra}>
      <div className={estilos.barraInterna}>
        <Link href="/estudos" className={estilos.inicio}>
          <Logotipo />
        </Link>
        <nav aria-label="Principal" className={estilos.navegacao}>
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
          {/* Sair muda estado no servidor, por isso é botão de formulário e não link */}
          <form action={sair}>
            <button type="submit" className={estilos.linkNavegacao}>
              <LogOut size={18} strokeWidth={1.5} aria-hidden="true" />
              <span>Sair</span>
            </button>
          </form>
        </nav>
      </div>
    </header>
  );
}
