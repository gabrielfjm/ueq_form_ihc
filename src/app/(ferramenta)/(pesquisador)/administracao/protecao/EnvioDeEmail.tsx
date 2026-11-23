"use client";

import { Megaphone, Send } from "lucide-react";
import { useState } from "react";
import { BotaoEnvio } from "@/componentes/formulario/BotaoEnvio";
import formulario from "@/componentes/formulario/formulario.module.css";
import { MensagemStatus } from "@/componentes/formulario/MensagemStatus";
import { useEnvioFormulario } from "@/componentes/formulario/useEnvioFormulario";
import { Confirmacao } from "@/componentes/janela/Confirmacao";
import { avisarNovaVersao, enviarEmailDeTeste } from "../acoes";
import estilos from "../administracao.module.css";
import janela from "@/componentes/janela/janela.module.css";
import { plural } from "@/lib/texto";
import { useT } from "@/traducao/cliente";

// O teste vai para o e-mail do próprio administrador e mostra a resposta do servidor quando falha. O aviso de
// nova versão vai para todas as contas com os avisos por e-mail ligados, cada uma no idioma dela, e confirma
// antes, porque e-mail enviado não volta
export function EnvioDeEmail({ contasComEmail }: { contasComEmail: number }) {
  const t = useT();
  const teste = useEnvioFormulario(enviarEmailDeTeste);
  const [confirmando, setConfirmando] = useState(false);
  const aviso = useEnvioFormulario(avisarNovaVersao, () => setConfirmando(false));

  return (
    <div className={estilos.envioEmail}>
      <form onSubmit={teste.aoEnviar} noValidate>
        <BotaoEnvio
          enviando={teste.enviando}
          textoEnviando={t("Enviando…")}
          icone={<Send size={18} strokeWidth={1.5} aria-hidden="true" className={formulario.icone} />}
          className={`${formulario.botao} ${formulario.secundario}`}
        >
          {t("Enviar e-mail de teste")}
        </BotaoEnvio>
      </form>
      <MensagemStatus
        mensagem={teste.estado.sucesso ?? teste.estado.erroGeral}
        vez={teste.estado.envio}
        erro={Boolean(teste.estado.erroGeral)}
      />

      <button type="button" className={`${formulario.botao} ${formulario.secundario}`} onClick={() => setConfirmando(true)}>
        <Megaphone size={18} strokeWidth={1.5} aria-hidden="true" className={formulario.icone} />
        <span>{t("Avisar todas as contas da nova versão")}</span>
      </button>
      <MensagemStatus mensagem={aviso.estado.sucesso} vez={aviso.estado.envio} />

      <Confirmacao
        aberta={confirmando}
        aoFechar={() => setConfirmando(false)}
        titulo={t("Avisar todas as contas da nova versão?")}
        textoConfirmar={t("Enviar o aviso")}
        Icone={Megaphone}
        onSubmit={aviso.aoEnviar}
        enviando={aviso.enviando}
        textoEnviando={t("Enviando…")}
        focarConfirmar
      >
        <p className={janela.texto}>
          {t("{contas} recebem o e-mail “A Ferramenta UEQ tem uma nova versão no ar”, cada uma no idioma escolhido em Minha conta. E-mail enviado não volta.", {
            contas: plural(contasComEmail, t("conta"), t("contas")),
          })}
        </p>
        {aviso.estado.erroGeral && <p className={janela.aviso}>{aviso.estado.erroGeral}</p>}
      </Confirmacao>
    </div>
  );
}
