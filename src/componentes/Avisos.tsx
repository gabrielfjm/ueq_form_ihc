"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { MensagemStatus } from "./formulario/MensagemStatus";

const Anunciar = createContext<(mensagem: string, erro?: boolean) => void>(() => {});

// Uma região role="status" no topo da página, que qualquer ação dentro dela pode usar
// para confirmar o resultado (docs/ihc.md 4.2, WCAG 4.1.3)
export function Avisos({ inicial, className, children }: { inicial?: string | null; className?: string; children: ReactNode }) {
  const [aviso, setAviso] = useState({ mensagem: inicial ?? "", erro: false, vez: 0 });

  function anunciar(mensagem: string, erro = false) {
    setAviso((atual) => ({ mensagem, erro, vez: atual.vez + 1 }));
  }

  return (
    <Anunciar.Provider value={anunciar}>
      <MensagemStatus mensagem={aviso.mensagem} erro={aviso.erro} vez={aviso.vez} className={className} />
      {children}
    </Anunciar.Provider>
  );
}

export function useAnunciar() {
  return useContext(Anunciar);
}
