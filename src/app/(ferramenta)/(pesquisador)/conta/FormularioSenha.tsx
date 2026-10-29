"use client";

import { Lock } from "lucide-react";
import { CampoSenha } from "@/componentes/formulario/Campo";
import formulario from "@/componentes/formulario/formulario.module.css";
import { ResumoErros } from "@/componentes/formulario/ResumoErros";
import { useEnvioFormulario } from "@/componentes/formulario/useEnvioFormulario";
import { MINIMO_SENHA } from "@/lib/validacao-conta";
import { trocarSenha } from "./acoes";
import estilos from "./conta.module.css";

const CAMPOS = [
  { nome: "senhaAtual", rotulo: "Senha atual", id: "senha-atual" },
  { nome: "senhaNova", rotulo: "Nova senha", id: "senha-nova" },
] as const;

export function FormularioSenha({ email, aoTrocar }: { email: string; aoTrocar: (mensagem: string) => void }) {
  const { estado, aoEnviar } = useEnvioFormulario(trocarSenha, (mensagem, form) => {
    form.reset();
    aoTrocar(mensagem);
  });

  return (
    <form className={estilos.secao} aria-labelledby="secao-senha" noValidate onSubmit={aoEnviar}>
      <div className={estilos.secaoTitulo}>
        <span className={estilos.secaoNumero}>02</span>
        <h2 id="secao-senha" className={estilos.secaoNome}>
          Senha
        </h2>
      </div>
      {/* O gerenciador de senhas precisa saber de qual conta é a senha nova (autocomplete="username") */}
      <input type="email" name="usuario" autoComplete="username" value={email} readOnly hidden />
      <ResumoErros envio={estado.envio} erros={estado.erros} campos={CAMPOS} />
      <CampoSenha
        id="senha-atual"
        name="senhaAtual"
        rotulo="Senha atual"
        textoMostrar="Mostrar"
        autoComplete="current-password"
        erro={estado.erros?.senhaAtual}
      />
      <CampoSenha
        id="senha-nova"
        name="senhaNova"
        rotulo="Nova senha"
        textoMostrar="Mostrar"
        ajuda={`Use pelo menos ${MINIMO_SENHA} caracteres. Pode colar de um gerenciador de senhas.`}
        autoComplete="new-password"
        erro={estado.erros?.senhaNova}
      />
      <p className={formulario.ajuda}>Depois de trocar, as outras sessões abertas com a senha antiga são encerradas.</p>
      <button type="submit" className={`${formulario.botao} ${formulario.secundario} ${estilos.alinharInicio}`}>
        <Lock size={18} strokeWidth={1.5} aria-hidden="true" className={formulario.icone} />
        <span>Trocar senha</span>
      </button>
    </form>
  );
}
