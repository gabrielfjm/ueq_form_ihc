import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

// Criptografia de campo (LGPD, art. 46): dados sobre os participantes são gravados cifrados com
// AES-256-GCM, que também detecta qualquer alteração no texto cifrado. A chave fica fora do banco,
// na variável CHAVE_CRIPTOGRAFIA (32 bytes em base64): quem copiar o banco não lê esses dados.
// Formato gravado: "cifra:v1:<iv>:<tag>:<texto cifrado>", tudo em base64url

const PREFIXO = "cifra:v1:";
const ALGORITMO = "aes-256-gcm";

function chave(): Buffer | null {
  const texto = process.env.CHAVE_CRIPTOGRAFIA?.trim();
  if (!texto) return null;
  const bytes = Buffer.from(texto, "base64");
  if (bytes.length !== 32) {
    throw new Error("CHAVE_CRIPTOGRAFIA precisa ter 32 bytes em base64. Gere com: openssl rand -base64 32");
  }
  return bytes;
}

export function criptografiaAtiva(): boolean {
  return chave() !== null;
}

export function estaCifrado(valor: unknown): valor is string {
  return typeof valor === "string" && valor.startsWith(PREFIXO);
}

// Sem chave configurada (desenvolvimento) o valor segue como veio; com chave, sempre cifrado
export function cifrar(texto: string): string {
  const segredo = chave();
  if (!segredo) return texto;
  const iv = randomBytes(12);
  const cifra = createCipheriv(ALGORITMO, segredo, iv);
  const cifrado = Buffer.concat([cifra.update(texto, "utf8"), cifra.final()]);
  return `${PREFIXO}${iv.toString("base64url")}:${cifra.getAuthTag().toString("base64url")}:${cifrado.toString("base64url")}`;
}

export function decifrar(valor: string): string {
  if (!estaCifrado(valor)) return valor;
  const segredo = chave();
  if (!segredo) throw new Error("Há dados cifrados no banco, mas CHAVE_CRIPTOGRAFIA não está configurada.");
  const [iv, tag, cifrado] = valor.slice(PREFIXO.length).split(":");
  const decifra = createDecipheriv(ALGORITMO, segredo, Buffer.from(iv ?? "", "base64url"));
  decifra.setAuthTag(Buffer.from(tag ?? "", "base64url"));
  return Buffer.concat([decifra.update(Buffer.from(cifrado ?? "", "base64url")), decifra.final()]).toString("utf8");
}

// Para colunas Json: o objeto vira uma string cifrada (ou fica como está, sem chave)
export function cifrarJson(objeto: object): string | object {
  return criptografiaAtiva() ? cifrar(JSON.stringify(objeto)) : objeto;
}

// Lê tanto o formato cifrado quanto o antigo, em texto aberto, que o script de migração ainda não cifrou
export function decifrarJson<T>(valor: unknown): T | null {
  if (valor === null || valor === undefined) return null;
  if (estaCifrado(valor)) return JSON.parse(decifrar(valor)) as T;
  return valor as T;
}
