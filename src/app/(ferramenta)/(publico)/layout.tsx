import type { ReactNode } from "react";
import { pesquisadorDaSessao } from "@/lib/sessao";
import { BarraSuperior } from "../(pesquisador)/BarraSuperior";
import { ProvedorAcesso } from "./_acesso/Acesso";
import { BarraPublica } from "./BarraPublica";

// Páginas abertas a qualquer pessoa: a página inicial, a documentação e /entrar e /cadastrar (que são a
// página inicial com a janela de acesso aberta). Quem já entrou continua com a barra do pesquisador, para
// não perder o caminho de volta aos estudos; quem não entrou vê Documentação e Entrar.
// O link do participante (/r/...) tem layout raiz próprio e nunca chega aqui
export default async function LayoutPublico({ children }: { children: ReactNode }) {
  const pesquisador = await pesquisadorDaSessao();
  const principal = (
    <main id="conteudo" tabIndex={-1}>
      {children}
    </main>
  );
  if (pesquisador) {
    return (
      <>
        <BarraSuperior />
        {principal}
      </>
    );
  }
  return (
    <ProvedorAcesso>
      <BarraPublica />
      {principal}
    </ProvedorAcesso>
  );
}
