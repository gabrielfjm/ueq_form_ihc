"use client";

import { Lock } from "lucide-react";
import { useState } from "react";
import { CampoSenha } from "@/componentes/formulario/Campo";
import formulario from "@/componentes/formulario/formulario.module.css";
import { MensagemStatus } from "@/componentes/formulario/MensagemStatus";
import { ResumoErros } from "@/componentes/formulario/ResumoErros";
import { useEnvioFormulario } from "@/componentes/formulario/useEnvioFormulario";
import { MINIMO_SENHA } from "@/lib/validacao-conta";
import { trocarSenha } from "./acoes";
import estilos from "./conta.module.css";
import { useT } from "@/traducao/cliente";
import { m } from "@/traducao/nucleo";

const CAMPOS = [
  { nome: "senhaAtual", rotulo: m("Senha atual"), id: "senha-atual" },
  { nome: "senhaNova", rotulo: m("Nova senha"), id: "senha-nova" },
] as const;

export function FormularioSenha({ email }: { email: string }) {
  const t = useT();
  const [status, setStatus] = useState({ mensagem: "", vez: 0 });
  const { estado, aoEnviar } = useEnvioFormulario(trocarSenha, (mensagem, form) => {
    form.reset();
    setStatus((atual) => ({ mensagem, vez: atual.vez + 1 }));
  });

  return (
    <form className={estilos.formularioPagina} aria-label={t("Trocar senha")} noValidate onSubmit={aoEnviar}>
      <MensagemStatus mensagem={status.mensagem} vez={status.vez} />
      {/* O gerenciador de senhas precisa saber de qual conta é a senha nova (autocomplete="username") */}
      <input type="email" name="usuario" autoComplete="username" value={email} readOnly hidden />
      <ResumoErros envio={estado.envio} erros={estado.erros} campos={CAMPOS} />
      <CampoSenha
        id="senha-atual"
        name="senhaAtual"
        rotulo={t("Senha atual")}
        textoMostrar={t("Mostrar")}
        autoComplete="current-password"
        erro={estado.erros?.senhaAtual}
      />
      <CampoSenha
        id="senha-nova"
        name="senhaNova"
        rotulo={t("Nova senha")}
        textoMostrar={t("Mostrar")}
        ajuda={t("Use pelo menos {MINIMO_SENHA} caracteres. Pode colar de um gerenciador de senhas.", { MINIMO_SENHA: MINIMO_SENHA })}
        autoComplete="new-password"
        erro={estado.erros?.senhaNova}
      />
      <p className={formulario.ajuda}>{t("Depois de trocar, as outras sessões abertas com a senha antiga são encerradas.")}</p>
      <button type="submit" className={`${formulario.botao} ${formulario.primario} ${estilos.alinharInicio}`}>
        <Lock size={18} strokeWidth={1.5} aria-hidden="true" className={formulario.icone} />
        <span>{t("Trocar senha")}</span>
      </button>
    </form>
  );
}
