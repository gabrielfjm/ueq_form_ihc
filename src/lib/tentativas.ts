import "server-only";
import { createHash } from "node:crypto";
import { banco } from "./banco";

// Limite de tentativas de login por e-mail, contra adivinhação de senha. O e-mail não é guardado:
// só o hash SHA-256 dele, que basta para contar as tentativas
export const MAXIMO_TENTATIVAS = 5;
export const JANELA_MINUTOS = 15;

const chaveDo = (email: string) => createHash("sha256").update(`tentativa:${email.trim().toLowerCase()}`).digest("hex");
const inicioDaJanela = () => new Date(Date.now() - JANELA_MINUTOS * 60 * 1000);

export async function bloqueado(email: string): Promise<boolean> {
  const falhas = await banco.tentativaAcesso.count({ where: { chave: chaveDo(email), criadaEm: { gt: inicioDaJanela() } } });
  return falhas >= MAXIMO_TENTATIVAS;
}

export async function registrarFalha(email: string): Promise<void> {
  await banco.tentativaAcesso.create({ data: { chave: chaveDo(email) } });
  // Nada fica guardado além de um dia
  await banco.tentativaAcesso.deleteMany({ where: { criadaEm: { lt: new Date(Date.now() - 24 * 60 * 60 * 1000) } } });
}

export async function limparFalhas(email: string): Promise<void> {
  await banco.tentativaAcesso.deleteMany({ where: { chave: chaveDo(email) } });
}
