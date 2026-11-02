"use client";

import { Save } from "lucide-react";
import { useState } from "react";
import { Campo } from "@/componentes/formulario/Campo";
import formulario from "@/componentes/formulario/formulario.module.css";
import { MensagemStatus } from "@/componentes/formulario/MensagemStatus";
import { ResumoErros } from "@/componentes/formulario/ResumoErros";
import { useEnvioFormulario } from "@/componentes/formulario/useEnvioFormulario";
import { salvarDados } from "./acoes";
import estilos from "./conta.module.css";
import { useT } from "@/traducao/cliente";
import { m } from "@/traducao/nucleo";


const CAMPOS = [
  { nome: "nome", rotulo: m("Nome"), id: "conta-nome" },
  { nome: "email", rotulo: m("E-mail"), id: "conta-email" },
] as const;

type Propriedades = {
  nome: string;
  email: string;
};

export function FormularioDados({ nome, email }: Propriedades) {
  const t = useT();
  const [status, setStatus] = useState({ mensagem: "", vez: 0 });
  const { estado, aoEnviar, limpar } = useEnvioFormulario(salvarDados, (mensagem) =>
    setStatus((atual) => ({ mensagem, vez: atual.vez + 1 })),
  );

  return (
    <form className={estilos.formularioPagina} aria-label={t("Dados cadastrais")} noValidate onSubmit={aoEnviar} onReset={limpar}>
      <MensagemStatus mensagem={status.mensagem} vez={status.vez} />
      <ResumoErros envio={estado.envio} erros={estado.erros} campos={CAMPOS} />
      <Campo
        id="conta-nome"
        name="nome"
        type="text"
        rotulo={t("Nome")}
        ajuda={t("Aparece só para você, no topo do painel.")}
        autoComplete="name"
        defaultValue={nome}
        erro={estado.erros?.nome}
      />
      <Campo
        id="conta-email"
        name="email"
        type="email"
        rotulo={t("E-mail")}
        ajuda={t("É o que você usa para entrar.")}
        autoComplete="email"
        defaultValue={email}
        erro={estado.erros?.email}
      />
      <div className={estilos.botoes}>
        <button type="submit" className={`${formulario.botao} ${formulario.primario}`}>
          <Save size={18} strokeWidth={1.5} aria-hidden="true" className={formulario.icone} />
          <span>{t("Salvar alterações")}</span>
        </button>
        <button type="reset" className={`${formulario.botao} ${formulario.secundario}`}>
          <span>{t("Descartar alterações")}</span>
        </button>
      </div>
    </form>
  );
}
