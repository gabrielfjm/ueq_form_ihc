"use client";

import { BookOpen, Folder, LogOut, Plus, ShieldCheck, User, type LucideIcon } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { BarraFixa } from "./BarraFixa";
import { Confirmacao } from "@/componentes/janela/Confirmacao";
import { Logotipo } from "@/componentes/Logotipo";
import { sair } from "./acoes";
import { SinoNotificacoes } from "./SinoNotificacoes";
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

type Propriedades = {
  // notificações não lidas quando a página carregou; o sino atualiza sozinho depois
  naoLidas: number;
  administrador: boolean;
};

export function BarraSuperior({ naoLidas, administrador }: Propriedades) {
  const caminho = usePathname();
  // Administração (só para o superusuário) entra antes de Minha conta; o sino vem logo depois dela
  const itens: ItemNavegacao[] = [
    ...ITENS.slice(0, 3),
    ...(administrador
      ? [
          {
            href: "/administracao" as Route,
            texto: "Administração",
            Icone: ShieldCheck,
            atual: (atual: string) => atual === "/administracao",
          },
        ]
      : []),
    ...ITENS.slice(3),
  ];
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
        {itens.map(({ href, texto, Icone, atual }) => (
          <Link
            key={href}
            href={href}
            className={estilos.linkNavegacao}
            aria-current={atual(caminho) ? "page" : undefined}
            data-tutorial={`navegacao-${href.slice(1).replace("/", "-")}`}
          >
            <Icone size={18} strokeWidth={1.5} aria-hidden="true" />
            <span>{texto}</span>
          </Link>
        ))}
        <SinoNotificacoes naoLidasIniciais={naoLidas} />
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
