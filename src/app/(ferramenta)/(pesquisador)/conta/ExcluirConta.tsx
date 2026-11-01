"use client";

import { Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Campo } from "@/componentes/formulario/Campo";
import formulario from "@/componentes/formulario/formulario.module.css";
import { useEnvioFormulario } from "@/componentes/formulario/useEnvioFormulario";
import { Confirmacao } from "@/componentes/janela/Confirmacao";
import janela from "@/componentes/janela/janela.module.css";
import { excluirConta } from "./acoes";
import estilos from "./conta.module.css";

// docs/ihc.md, 4.2: confirmação numa janela, digitando o dado e dizendo o que vai junto (Nielsen 5, WCAG 3.3.4)
export function ExcluirConta({ aviso }: { aviso: { destaque: string; complemento: string } }) {
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
    <section className={estilos.secao} aria-labelledby="secao-excluir">
      <div className={estilos.secaoTitulo}>
        <span className={estilos.secaoNumero}>04</span>
        <h2 id="secao-excluir" className={estilos.secaoNome}>
          Excluir conta
        </h2>
      </div>
      <p className={estilos.texto}>
        Apaga sua conta e tudo o que está nela. Se quiser guardar os dados, exporte as respostas de cada estudo antes.
      </p>
      <button
        type="button"
        className={`${formulario.destrutivo} ${estilos.alinharInicio}`}
        aria-haspopup="dialog"
        onClick={() => setAberta(true)}
      >
        <Trash2 size={18} strokeWidth={1.5} aria-hidden="true" className={formulario.icone} />
        <span>Excluir minha conta</span>
      </button>
      <Confirmacao
        aberta={aberta}
        aoFechar={fechar}
        titulo="Excluir sua conta?"
        textoConfirmar="Excluir conta definitivamente"
        Icone={Trash2}
        perigo
        onSubmit={aoEnviar}
      >
        <p className={janela.aviso}>
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
          data-foco-inicial=""
        />
      </Confirmacao>
    </section>
  );
}
