"use client";

import { Copy } from "lucide-react";
import { useState } from "react";
import formulario from "@/componentes/formulario/formulario.module.css";
import estilos from "./pagina-estudo.module.css";

export function LinkPublico({ endereco }: { endereco: string }) {
  const [aviso, setAviso] = useState("");

  async function copiar() {
    try {
      await navigator.clipboard.writeText(endereco);
      setAviso("Link copiado.");
    } catch {
      // Sem permissão de área de transferência (ex.: página fora de https): o link segue visível para copiar à mão
      setAviso("Não deu para copiar automaticamente. Selecione o link acima e copie.");
    }
  }

  return (
    <>
      <div className={estilos.link}>
        <code className={estilos.endereco}>{endereco}</code>
        <button type="button" className={`${formulario.botao} ${formulario.primario} ${estilos.copiar}`} onClick={copiar}>
          <Copy size={18} strokeWidth={1.5} aria-hidden="true" />
          <span>Copiar link</span>
        </button>
      </div>
      <p role="status" className={estilos.avisoCopia}>
        {aviso}
      </p>
    </>
  );
}
