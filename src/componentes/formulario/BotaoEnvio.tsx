"use client";

import { LoaderCircle } from "lucide-react";
import type { ButtonHTMLAttributes, MouseEvent, ReactNode } from "react";
import { useFormStatus } from "react-dom";
import estilos from "./formulario.module.css";

type Propriedades = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "aria-busy" | "aria-disabled"> & {
  // Quem envia pelo useEnvioFormulario ou por uma transição diz aqui; num <form action>, o React já sabe
  enviando?: boolean;
  // O que o botão diz enquanto a ação roda ("Criando o estudo…")
  textoEnviando: string;
  icone?: ReactNode;
  // Nas telas do participante não há ícone nenhum (docs/design.md): o aviso é só o texto
  semIndicador?: boolean;
};

// Botão de toda ação que vai ao servidor. Enquanto ela roda, o botão diz o que está acontecendo e ignora novos
// cliques, para nada ser enviado duas vezes, e o CSS global bloqueia o resto do formulário. Fica com
// aria-disabled, e não disabled, para o foco não se perder no meio do envio (WCAG 2.4.3 e 4.1.3)
export function BotaoEnvio({
  enviando,
  textoEnviando,
  icone,
  semIndicador = false,
  type = "submit",
  onClick,
  children,
  ...botao
}: Propriedades) {
  const status = useFormStatus();
  const ocupado = enviando ?? status.pending;
  // Dois botões no mesmo formulário: só o que foi apertado muda de texto
  const foiEste = enviando !== undefined || !botao.name || status.data?.get(botao.name) === botao.value;
  const mostrar = ocupado && foiEste;

  function aoClicar(evento: MouseEvent<HTMLButtonElement>) {
    if (ocupado) {
      evento.preventDefault();
      return;
    }
    onClick?.(evento);
  }

  return (
    <button {...botao} type={type} aria-disabled={ocupado || undefined} aria-busy={ocupado || undefined} onClick={aoClicar}>
      {mostrar && !semIndicador ? <LoaderCircle size={18} strokeWidth={1.5} aria-hidden="true" className={estilos.girando} /> : !mostrar && icone}
      <span>{mostrar ? textoEnviando : children}</span>
    </button>
  );
}
