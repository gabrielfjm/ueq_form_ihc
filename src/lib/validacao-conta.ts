import { z } from "zod";
import { m } from "@/traducao/nucleo";

// Formato mínimo: algo@algo.algo. A confirmação de que o e-mail existe está fora do escopo
const FORMATO_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// bcrypt só considera os primeiros 72 bytes; acima disso duas senhas diferentes dariam o mesmo hash
const BYTES_MAXIMOS_SENHA = 72;

export const MINIMO_SENHA = 8;

export const nome = z.string().trim().min(1, m("Informe seu nome.")).max(120, m("Use no máximo 120 caracteres no nome."));

export const email = z
  .string()
  .trim()
  .toLowerCase()
  .min(1, m("Informe seu e-mail."))
  .regex(FORMATO_EMAIL, m("Escreva o e-mail no formato nome@exemplo.com."));

export const senhaNova = z
  .string()
  .min(1, m("Informe uma senha."))
  // O número vai escrito no texto para o catálogo de tradução; muda junto com MINIMO_SENHA
  .min(MINIMO_SENHA, m("A senha precisa ter pelo menos 8 caracteres."))
  .refine(
    (senha) => new TextEncoder().encode(senha).length <= BYTES_MAXIMOS_SENHA,
    m("A senha ficou longa demais. Use no máximo 72 caracteres."),
  );

export const senhaDigitada = (mensagemVazia: string) => z.string().min(1, mensagemVazia);

// Só aceita caminho interno ("/conta"), para o ?voltar= não virar redirecionamento para outro site.
// Sem destino, o login termina na página inicial, que explica o UEQ e leva aos estudos
export function destinoInterno(valor: string): string {
  return valor.startsWith("/") && !valor.startsWith("//") && !valor.startsWith("/\\") ? valor : "/";
}
