"use client";

import { UserPlus } from "lucide-react";
import { useState } from "react";
import { Campo, CampoSenha } from "@/componentes/formulario/Campo";
import formulario from "@/componentes/formulario/formulario.module.css";
import { MensagemStatus } from "@/componentes/formulario/MensagemStatus";
import { ResumoErros } from "@/componentes/formulario/ResumoErros";
import { useEnvioFormulario } from "@/componentes/formulario/useEnvioFormulario";
import { criarConta } from "../../acoes";
import estilos from "../../administracao.module.css";
import { useT } from "@/traducao/cliente";
import { m } from "@/traducao/nucleo";


const CAMPOS = [
  { nome: "nome", rotulo: m("Nome"), id: "nova-conta-nome" },
  { nome: "email", rotulo: m("E-mail"), id: "nova-conta-email" },
  { nome: "senha", rotulo: m("Senha"), id: "nova-conta-senha" },
] as const;

export function NovaConta() {
  const t = useT();
  const [status, setStatus] = useState({ mensagem: "", vez: 0 });
  const { estado, aoEnviar } = useEnvioFormulario(criarConta, (mensagem, formularioConta) => {
    setStatus((atual) => ({ mensagem, vez: atual.vez + 1 }));
    formularioConta.reset();
  });

  return (
    <form className={estilos.formularioPagina} aria-label={t("Criar conta para alguém")} noValidate onSubmit={aoEnviar}>
      <MensagemStatus mensagem={status.mensagem} vez={status.vez} />
      <ResumoErros envio={estado.envio} erros={estado.erros} campos={CAMPOS} />
      <Campo id="nova-conta-nome" name="nome" rotulo={t("Nome")} autoComplete="off" erro={estado.erros?.nome} />
      <Campo id="nova-conta-email" name="email" type="email" rotulo={t("E-mail")} autoComplete="off" erro={estado.erros?.email} />
      <CampoSenha
        id="nova-conta-senha"
        name="senha"
        rotulo={t("Senha")}
        ajuda={t("Pelo menos 8 caracteres. A pessoa pode trocar depois, em Minha conta.")}
        autoComplete="new-password"
        textoMostrar={t("Mostrar")}
        erro={estado.erros?.senha}
      />
      <button type="submit" className={`${formulario.botao} ${formulario.primario} ${estilos.alinharInicio}`}>
        <UserPlus size={18} strokeWidth={1.5} aria-hidden="true" className={formulario.icone} />
        <span>{t("Criar conta")}</span>
      </button>
    </form>
  );
}
