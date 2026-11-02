"use client";

import { Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Campo } from "@/componentes/formulario/Campo";
import formulario from "@/componentes/formulario/formulario.module.css";
import { useEnvioFormulario } from "@/componentes/formulario/useEnvioFormulario";
import { Confirmacao } from "@/componentes/janela/Confirmacao";
import janela from "@/componentes/janela/janela.module.css";
import { excluirConta } from "./acoes";
import { useT } from "@/traducao/cliente";

// docs/ihc.md, 4.2: confirmação numa janela, digitando o dado e dizendo o que vai junto (Nielsen 5, WCAG 3.3.4)
export function ExcluirConta({ aviso }: { aviso: { destaque: string; complemento: string } }) {
  const t = useT();
  const [aberta, setAberta] = useState(false);
  const { estado, aoEnviar, limpar } = useEnvioFormulario(excluirConta);
  const campo = useRef<HTMLInputElement>(null);

  // Com o e-mail errado, o foco volta para o campo, junto da mensagem de erro
  useEffect(() => {
    if (estado.erros?.confirmacao) campo.current?.focus();
  }, [estado]);

  function fechar() {
    setAberta(false);
    limpar();
  }

  return (
    <>
      <button
        type="button"
        className={`${formulario.destrutivo}`}
        aria-haspopup="dialog"
        onClick={() => setAberta(true)}
      >
        <Trash2 size={18} strokeWidth={1.5} aria-hidden="true" className={formulario.icone} />
        <span>{t("Excluir minha conta")}</span>
      </button>
      <Confirmacao
        aberta={aberta}
        aoFechar={fechar}
        titulo={t("Excluir sua conta?")}
        textoConfirmar={t("Excluir conta definitivamente")}
        Icone={Trash2}
        perigo
        onSubmit={aoEnviar}
      >
        <p className={janela.aviso}>
          <strong>{t(aviso.destaque)}</strong> {t(aviso.complemento)}
        </p>
        <Campo
          ref={campo}
          id="confirmar-email"
          name="confirmacao"
          type="email"
          rotulo={t("Digite seu e-mail para confirmar")}
          autoComplete="off"
          erro={estado.erros?.confirmacao}
          data-foco-inicial=""
        />
      </Confirmacao>
    </>
  );
}
