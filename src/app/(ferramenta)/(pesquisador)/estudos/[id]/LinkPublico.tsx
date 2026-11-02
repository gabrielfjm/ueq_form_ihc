"use client";

import { Copy } from "lucide-react";
import { useState } from "react";
import formulario from "@/componentes/formulario/formulario.module.css";
import estilos from "./pagina-estudo.module.css";
import { useT } from "@/traducao/cliente";

export function LinkPublico({ endereco }: { endereco: string }) {
  const t = useT();
  const [aviso, setAviso] = useState("");

  async function copiar() {
    try {
      await navigator.clipboard.writeText(endereco);
      setAviso(t("Link copiado."));
    } catch {
      // Sem permissão de área de transferência (ex.: página fora de https): o link segue visível para copiar à mão
      setAviso(t("Não deu para copiar automaticamente. Selecione o link acima e copie."));
    }
  }

  return (
    <>
      <div className={estilos.link}>
        <code className={estilos.endereco}>{t(endereco)}</code>
        <button type="button" className={`${formulario.botao} ${formulario.primario} ${estilos.copiar}`} onClick={copiar}>
          <Copy size={18} strokeWidth={1.5} aria-hidden="true" />
          <span>{t("Copiar link")}</span>
        </button>
      </div>
      <p role="status" className={estilos.avisoCopia}>
        {t(aviso)}
      </p>
    </>
  );
}
