"use client";

import { Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Campo } from "@/componentes/formulario/Campo";
import formulario from "@/componentes/formulario/formulario.module.css";
import { useEnvioFormulario } from "@/componentes/formulario/useEnvioFormulario";
import { excluirConta } from "./acoes";
import estilos from "./conta.module.css";

// docs/ihc.md, 4.2: confirmação em linha digitando o dado, dizendo o que vai junto (Nielsen 5, WCAG 3.3.4)
export function ExcluirConta({ aviso }: { aviso: { destaque: string; complemento: string } }) {
  const [aberta, setAberta] = useState(false);
  const { estado, aoEnviar, limpar } = useEnvioFormulario(excluirConta);
  const botaoAbrir = useRef<HTMLButtonElement>(null);
  const campo = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (aberta || estado.erros?.confirmacao) campo.current?.focus();
  }, [aberta, estado]);

  function cancelar() {
    setAberta(false);
    limpar();
    botaoAbrir.current?.focus();
  }

  return (
    <section className={estilos.secao} aria-labelledby="secao-excluir">
      <div className={estilos.secaoTitulo}>
        <span className={estilos.secaoNumero}>03</span>
        <h2 id="secao-excluir" className={estilos.secaoNome}>
          Excluir conta
        </h2>
      </div>
      <p className={estilos.texto}>
        Apaga sua conta e tudo o que está nela. Se quiser guardar os dados, exporte as respostas de cada estudo antes.
      </p>
      <button
        ref={botaoAbrir}
        type="button"
        className={`${formulario.destrutivo} ${estilos.alinharInicio}`}
        aria-expanded={aberta}
        aria-controls="confirmar-exclusao-conta"
        onClick={() => setAberta(true)}
      >
        <Trash2 size={18} strokeWidth={1.5} aria-hidden="true" className={formulario.icone} />
        <span>Excluir minha conta</span>
      </button>
      <form
        id="confirmar-exclusao-conta"
        className={estilos.confirmacao}
        hidden={!aberta}
        noValidate
        onSubmit={aoEnviar}
      >
        <p>
          <strong>{aviso.destaque}</strong> {aviso.complemento}
        </p>
        <Campo
          ref={campo}
          id="confirmar-email"
          name="confirmacao"
          type="email"
          rotulo="Digite seu e-mail para confirmar"
          autoComplete="off"
          erro={estado.erros?.confirmacao}
        />
        <div className={estilos.acoesConfirmacao}>
          <button type="submit" className={`${formulario.botao} ${formulario.perigo}`}>
            <Trash2 size={18} strokeWidth={1.5} aria-hidden="true" className={formulario.icone} />
            <span>Excluir conta definitivamente</span>
          </button>
          <button type="button" className={`${formulario.botao} ${formulario.secundario}`} onClick={cancelar}>
            <span>Cancelar</span>
          </button>
        </div>
      </form>
    </section>
  );
}
