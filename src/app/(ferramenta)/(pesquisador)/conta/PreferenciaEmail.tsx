"use client";

import { useState, useTransition } from "react";
import formulario from "@/componentes/formulario/formulario.module.css";
import { salvarPreferenciaEmail } from "./acoes";
import estilos from "./conta.module.css";

type Propriedades = {
  receber: boolean;
  aoSalvar: (mensagem: string) => void;
};

// Salva ao marcar ou desmarcar: é uma escolha só, sem outro campo para conferir antes
export function PreferenciaEmail({ receber, aoSalvar }: Propriedades) {
  const [marcado, setMarcado] = useState(receber);
  const [, iniciar] = useTransition();

  return (
    <section className={estilos.secao} aria-labelledby="secao-notificacoes">
      <div className={estilos.secaoTitulo}>
        <span className={estilos.secaoNumero}>03</span>
        <h2 id="secao-notificacoes" className={estilos.secaoNome}>
          Notificações
        </h2>
      </div>
      <p className={estilos.texto}>
        O sino no topo avisa sobre convites, respostas novas e mudanças que a equipe faz nos seus estudos.
      </p>
      <label className={formulario.opcao}>
        <input
          type="checkbox"
          checked={marcado}
          onChange={(evento) => {
            const valor = evento.target.checked;
            setMarcado(valor);
            iniciar(async () => aoSalvar(await salvarPreferenciaEmail(valor)));
          }}
        />
        <span>Receber os avisos também por e-mail</span>
      </label>
    </section>
  );
}
