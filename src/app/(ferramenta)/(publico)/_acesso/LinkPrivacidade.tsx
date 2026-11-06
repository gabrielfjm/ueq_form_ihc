"use client";

import { useT } from "@/traducao/cliente";
import { enderecoDaPrivacidade, ORIGEM_OUTRA_ABA } from "../privacidade/origem";
import estilos from "./acesso.module.css";

// Em outra aba: a janela de acesso fica como está, com o que a pessoa já digitou
export function LinkPrivacidade() {
  const t = useT();
  return (
    <a href={enderecoDaPrivacidade(ORIGEM_OUTRA_ABA)} target="_blank" rel="noopener" className={estilos.privacidade}>
      {t("Política de privacidade")}<span className="visualmente-oculto">{" "}{t("(abre em nova aba)")}</span>
    </a>
  );
}
