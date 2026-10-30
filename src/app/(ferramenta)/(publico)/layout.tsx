import type { ReactNode } from "react";
import { pesquisadorDaSessao } from "@/lib/sessao";
import { BarraSuperior } from "../(pesquisador)/BarraSuperior";
import { BarraPublica } from "./BarraPublica";

// Páginas abertas a qualquer pessoa (a documentação). Quem já entrou continua com a barra do
// pesquisador, para não perder o caminho de volta aos estudos; quem não entrou vê Entrar e Criar conta.
// O link do participante (/r/...) tem layout raiz próprio e nunca chega aqui
export default async function LayoutPublico({ children }: { children: ReactNode }) {
  const pesquisador = await pesquisadorDaSessao();
  return (
    <>
      {pesquisador ? <BarraSuperior /> : <BarraPublica />}
      <main id="conteudo" tabIndex={-1}>
        {children}
      </main>
    </>
  );
}
