"use client";

import { useState, useTransition } from "react";
import formulario from "@/componentes/formulario/formulario.module.css";
import { MensagemStatus } from "@/componentes/formulario/MensagemStatus";
import { salvarPreferenciaEmail } from "./acoes";
import { useT } from "@/traducao/cliente";

// Salva ao marcar ou desmarcar: é uma escolha só, sem outro campo para conferir antes
export function PreferenciaEmail({ receber }: { receber: boolean }) {
  const t = useT();
  const [marcado, setMarcado] = useState(receber);
  const [status, setStatus] = useState({ mensagem: "", vez: 0 });
  const [, iniciar] = useTransition();

  return (
    <div>
      <label className={formulario.opcao}>
        <input
          type="checkbox"
          checked={marcado}
          onChange={(evento) => {
            const valor = evento.target.checked;
            setMarcado(valor);
            iniciar(async () => {
              const mensagem = await salvarPreferenciaEmail(valor);
              setStatus((atual) => ({ mensagem, vez: atual.vez + 1 }));
            });
          }}
        />
        <span>{t("Receber os avisos também por e-mail")}</span>
      </label>
      <MensagemStatus mensagem={status.mensagem} vez={status.vez} />
    </div>
  );
}
