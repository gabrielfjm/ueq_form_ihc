"use client";

import { useState, useTransition, type FormEvent } from "react";
import { estadoInicial, type EstadoFormulario } from "@/lib/formulario";

type Acao<Campo extends string> = (anterior: EstadoFormulario<Campo>, dados: FormData) => Promise<EstadoFormulario<Campo>>;

// Envia o formulário para a ação do servidor sem o reset automático do React (que apagaria
// o que a pessoa digitou quando há erro) e avisa quem chamou quando deu certo
export function useEnvioFormulario<Campo extends string>(
  acao: Acao<Campo>,
  aoConcluir?: (mensagem: string, formulario: HTMLFormElement) => void,
) {
  const [estado, setEstado] = useState<EstadoFormulario<Campo>>(estadoInicial);
  const [enviando, iniciarEnvio] = useTransition();

  function aoEnviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    if (enviando) return;
    const formulario = evento.currentTarget;
    const dados = new FormData(formulario);
    iniciarEnvio(async () => {
      const resultado = await acao(estado, dados);
      setEstado(resultado);
      if (resultado.sucesso) aoConcluir?.(resultado.sucesso, formulario);
    });
  }

  function limpar() {
    setEstado((atual) => ({ envio: atual.envio }));
  }

  return { estado, enviando, aoEnviar, limpar };
}
