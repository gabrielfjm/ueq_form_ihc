"use client";

import { DatabaseZap } from "lucide-react";
import { useState } from "react";
import formulario from "@/componentes/formulario/formulario.module.css";
import { MensagemStatus } from "@/componentes/formulario/MensagemStatus";
import { useEnvioFormulario } from "@/componentes/formulario/useEnvioFormulario";
import { criarCenarios } from "../acoes";
import estilos from "../administracao.module.css";
import { useT } from "@/traducao/cliente";

type Conta = { id: string; nome: string; email: string };

export function Cenarios({ idAtual, contas }: { idAtual: string; contas: Conta[] }) {
  const t = useT();
  const [status, setStatus] = useState({ mensagem: "", vez: 0 });
  const { estado, enviando, aoEnviar } = useEnvioFormulario(criarCenarios, (mensagem) =>
    setStatus((atual) => ({ mensagem, vez: atual.vez + 1 })),
  );

  return (
    <form className={estilos.formularioPagina} aria-label={t("Criar os estudos de demonstração")} noValidate onSubmit={aoEnviar}>
      <MensagemStatus mensagem={status.mensagem} vez={status.vez} />
      {estado.erroGeral && <p className={formulario.erro}>{t(estado.erroGeral)}</p>}
      <div className={formulario.grupo}>
        <label htmlFor="cenario-dono" className={formulario.rotulo}>
          {t("Dono dos estudos")}
        </label>
        <select id="cenario-dono" name="dono" className={formulario.campo} defaultValue={idAtual}>
          {contas.map((conta) => (
            <option key={conta.id} value={conta.id}>
              {t(conta.nome)} ({t(conta.email)})
            </option>
          ))}
        </select>
        {estado.erros?.dono && <p className={formulario.erro}>{t(estado.erros.dono.mensagem)}</p>}
      </div>
      <fieldset className={formulario.grupoOpcoes}>
        <legend>{t("Compartilhar com")}</legend>
        {contas
          .filter((conta) => conta.id !== idAtual)
          .map((conta) => (
            <label key={conta.id} className={formulario.opcao}>
              <input type="checkbox" name="colaboradores" value={conta.id} />
              <span>
                {t(conta.nome)} <span className={formulario.opcaoDetalhe}>{t(conta.email)}</span>
              </span>
            </label>
          ))}
        {contas.length < 2 && <p className={estilos.texto}>{t("Crie outra conta para poder compartilhar.")}</p>}
      </fieldset>
      <div className={formulario.grupo}>
        <label htmlFor="cenario-papel" className={formulario.rotulo}>
          {t("Papel de quem recebe")}
        </label>
        <select id="cenario-papel" name="papel" className={formulario.campo} defaultValue="EDITOR">
          <option value="EDITOR">{t("Editor")}</option>
          <option value="LEITOR">{t("Leitor")}</option>
        </select>
      </div>
      <div className={formulario.grupo}>
        <label htmlFor="cenario-convites" className={formulario.rotulo}>
          {t("Convites")}
        </label>
        <select id="cenario-convites" name="convites" className={formulario.campo} defaultValue="ACEITO">
          <option value="ACEITO">{t("Já aceitos: os estudos aparecem direto")}</option>
          <option value="PENDENTE">{t("Pendentes: a pessoa aceita pelo sino")}</option>
        </select>
      </div>
      <button
        type="submit"
        className={`${formulario.botao} ${formulario.primario} ${estilos.alinharInicio}`}
        disabled={enviando}
      >
        <DatabaseZap size={18} strokeWidth={1.5} aria-hidden="true" className={formulario.icone} />
        <span>{enviando ? t("Criando os estudos…") : t("Criar os três estudos")}</span>
      </button>
    </form>
  );
}
