import type { ReactNode } from "react";
import { BarraSuperior } from "./BarraSuperior";

// A sessão é conferida em cada página e ação (exigirPesquisador), não aqui: o layout não
// renderiza de novo a cada navegação, então a checagem nele não protegeria as rotas filhas
export default function LayoutPesquisador({ children }: { children: ReactNode }) {
  return (
    <>
      <BarraSuperior />
      <main id="conteudo" tabIndex={-1}>
        {children}
      </main>
    </>
  );
}
