import type { Route } from "next";
import type { z } from "zod";

export type ErroCampo = {
  mensagem: string;
  // ex.: "Esse e-mail já tem conta." seguido de "Entre por aqui."
  link?: { href: Route; texto: string };
};

export type EstadoFormulario<Campo extends string> = {
  // conta os envios para o cliente saber que chegou resposta nova, mesmo com o mesmo erro
  envio: number;
  erros?: Partial<Record<Campo, ErroCampo>>;
  erroGeral?: string;
  sucesso?: string;
};

export function estadoInicial<Campo extends string>(): EstadoFormulario<Campo> {
  return { envio: 0 };
}

export function textoDoCampo(dados: FormData, campo: string): string {
  const valor = dados.get(campo);
  return typeof valor === "string" ? valor : "";
}

// Mostra só o primeiro problema de cada campo: "Informe seu e-mail." antes de "formato inválido"
export function errosPorCampo<Campo extends string>(erro: z.ZodError): Partial<Record<Campo, ErroCampo>> {
  const erros: Partial<Record<string, ErroCampo>> = {};
  for (const problema of erro.issues) {
    const campo = problema.path[0];
    if (typeof campo === "string" && !erros[campo]) erros[campo] = { mensagem: problema.message };
  }
  return erros;
}
