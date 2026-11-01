import type { ReactNode } from "react";
import { Tutorial } from "@/componentes/tutorial/Tutorial";
import { banco } from "@/lib/banco";
import { pesquisadorDaSessao } from "@/lib/sessao";
import { BarraSuperior } from "./BarraSuperior";

// A sessão é conferida em cada página e ação (exigirPesquisador), não aqui: o layout não
// renderiza de novo a cada navegação, então a checagem nele não protegeria as rotas filhas.
// Aqui ela só decide o que a barra mostra (o número do sino, Administração) e se o tour abre sozinho
export default async function LayoutPesquisador({ children }: { children: ReactNode }) {
  const pesquisador = await pesquisadorDaSessao();
  const naoLidas = pesquisador
    ? await banco.notificacao.count({ where: { pesquisadorId: pesquisador.id, lidaEm: null } })
    : 0;
  return (
    <>
      <BarraSuperior naoLidas={naoLidas} administrador={pesquisador?.administrador ?? false} />
      <main id="conteudo" tabIndex={-1}>
        {children}
      </main>
      {pesquisador && <Tutorial primeiroAcesso={!pesquisador.tutorialVistoEm} pesquisadorId={pesquisador.id} />}
    </>
  );
}
