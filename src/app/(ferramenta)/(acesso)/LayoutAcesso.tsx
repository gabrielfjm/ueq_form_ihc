import type { ReactNode } from "react";
import { Logotipo } from "@/componentes/Logotipo";
import estilos from "./acesso.module.css";

type Propriedades = {
  children: ReactNode;
  painel: ReactNode;
  comRodape?: boolean;
};

export function LayoutAcesso({ children, painel, comRodape = false }: Propriedades) {
  return (
    <div className={estilos.pagina}>
      <main
        id="conteudo"
        tabIndex={-1}
        className={comRodape ? `${estilos.principal} ${estilos.principalComRodape}` : estilos.principal}
      >
        <Logotipo />
        {children}
        {comRodape && <p className={estilos.rodape}>Fundamentos da IHC · PPGIa · PUCPR · 2026</p>}
      </main>
      {painel}
    </div>
  );
}
