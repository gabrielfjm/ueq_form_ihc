"use client";

import { CircleAlert, CircleCheckBig, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useT } from "@/traducao/cliente";
import estilos from "./formulario.module.css";

type Propriedades = {
  mensagem?: string | null;
  className?: string;
  // muda a cada ação concluída: a mesma mensagem duas vezes seguidas também é anunciada
  vez?: number;
  // deu errado: outra cor e outro ícone, para não parecer confirmação
  erro?: boolean;
};

// A região role="status" fica sempre no DOM e visível para a árvore de acessibilidade:
// leitor de tela só anuncia mudança em região que já existia (WCAG 4.1.3). Ela acompanha a rolagem, logo
// abaixo da barra, para a confirmação aparecer mesmo quando a ação foi lá embaixo numa página longa,
// e fica até a pessoa fechar (WCAG 2.2.1: nada some antes de dar tempo de ler)
export function MensagemStatus({ mensagem, className, vez, erro = false }: Propriedades) {
  const t = useT();
  const chave = `${vez ?? 0}:${mensagem ?? ""}`;
  const [fechada, setFechada] = useState<string | null>(null);

  // O aviso que veio pelo endereço some dele depois de mostrado: recarregar não confirma de novo
  useEffect(() => {
    if (!mensagem) return;
    const url = new URL(window.location.href);
    if (!url.searchParams.has("aviso")) return;
    url.searchParams.delete("aviso");
    window.history.replaceState(window.history.state, "", url);
  }, [mensagem]);

  const Icone = erro ? CircleAlert : CircleCheckBig;
  return (
    <div role="status" className={`${estilos.regiaoStatus} ${className ?? ""}`}>
      {mensagem && fechada !== chave && (
        <p key={vez} className={erro ? `${estilos.status} ${estilos.statusErro}` : estilos.status}>
          <Icone size={18} strokeWidth={1.5} aria-hidden="true" className={estilos.icone} />
          <span className={estilos.statusTexto}>{t(mensagem)}</span>
          <button type="button" className={estilos.statusFechar} aria-label={t("Fechar")} onClick={() => setFechada(chave)}>
            <X size={18} strokeWidth={1.5} aria-hidden="true" />
          </button>
        </p>
      )}
    </div>
  );
}
