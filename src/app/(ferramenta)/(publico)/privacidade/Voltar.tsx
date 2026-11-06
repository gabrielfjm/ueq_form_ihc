"use client";

import { ArrowLeft } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { useT } from "@/traducao/cliente";
import type { Volta } from "./origem";
import estilos from "./privacidade.module.css";

// Nielsen 3 (saída claramente marcada): a página é longa e pode ter vindo de outra aba, sem histórico para o
// botão do navegador. O navegador recusa fechar a aba em alguns casos; aí o link segue para o destino
export function Voltar({ volta }: { volta: Volta }) {
  const t = useT();
  const conteudo = (
    <>
      <ArrowLeft size={18} strokeWidth={1.5} aria-hidden="true" />
      <span>{t(volta.rotulo)}</span>
    </>
  );
  if (!volta.fechaAba) {
    return (
      <Link href={volta.destino as Route} className={estilos.voltar}>
        {conteudo}
      </Link>
    );
  }
  return (
    <a
      href={volta.destino}
      className={estilos.voltar}
      onClick={(evento) => {
        evento.preventDefault();
        window.close();
        window.setTimeout(() => window.location.assign(volta.destino), 200);
      }}
    >
      {conteudo}
    </a>
  );
}
