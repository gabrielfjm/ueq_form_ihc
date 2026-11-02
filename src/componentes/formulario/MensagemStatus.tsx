"use client";

import { CircleCheckBig } from "lucide-react";
import { useT } from "@/traducao/cliente";
import estilos from "./formulario.module.css";

// A região role="status" fica sempre no DOM e visível para a árvore de acessibilidade:
// leitor de tela só anuncia mudança em região que já existia (WCAG 4.1.3)
type Propriedades = {
  mensagem?: string | null;
  className?: string;
  // muda a cada ação concluída: a mesma mensagem duas vezes seguidas também é anunciada
  vez?: number;
};

export function MensagemStatus({ mensagem, className, vez }: Propriedades) {
  const t = useT();
  return (
    <div role="status" className={className}>
      {mensagem && (
        <p key={vez} className={estilos.status}>
          <CircleCheckBig size={18} strokeWidth={1.5} aria-hidden="true" className={estilos.icone} />
          <span>{t(mensagem)}</span>
        </p>
      )}
    </div>
  );
}
