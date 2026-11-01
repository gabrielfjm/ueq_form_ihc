import "server-only";
import { headers } from "next/headers";

// Links que vão para fora da ferramenta (e-mail, mensagem) precisam do endereço completo
export async function origemDoSite(): Promise<string> {
  const cabecalhos = await headers();
  const host = cabecalhos.get("x-forwarded-host") ?? cabecalhos.get("host") ?? "localhost:3000";
  const protocolo = cabecalhos.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${protocolo}://${host}`;
}
