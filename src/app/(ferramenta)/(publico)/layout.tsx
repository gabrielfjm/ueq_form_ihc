import type { ReactNode } from "react";
import { Tutorial } from "@/componentes/tutorial/Tutorial";
import { banco } from "@/lib/banco";
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
    const naoLidas = await banco.notificacao.count({ where: { pesquisadorId: pesquisador.id, lidaEm: null } });
    return (
      <>
        <BarraSuperior naoLidas={naoLidas} administrador={pesquisador.administrador} />
        {principal}
        {/* A página inicial é onde o login termina: as boas-vindas do tour aparecem já aqui */}
        <Tutorial primeiroAcesso={!pesquisador.tutorialVistoEm} pesquisadorId={pesquisador.id} />
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
