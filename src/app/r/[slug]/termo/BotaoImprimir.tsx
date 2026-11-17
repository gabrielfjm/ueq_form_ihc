"use client";

import formulario from "@/componentes/formulario/formulario.module.css";
import estilos from "../participante.module.css";

// O navegador imprime ou salva em PDF; quem prefere pode usar o atalho de impressão
export function BotaoImprimir({ texto }: { texto: string }) {
  return (
    <button type="button" className={`${formulario.botao} ${formulario.secundario} ${estilos.imprimir}`} onClick={() => window.print()}>
      {texto}
    </button>
  );
}
