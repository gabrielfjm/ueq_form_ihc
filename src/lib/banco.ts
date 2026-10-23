import "server-only";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

function conectar(): PrismaClient {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL não está definida. Copie .env.example para .env.");
  return new PrismaClient({ adapter: new PrismaPg(url) });
}

// Em desenvolvimento o Next recarrega os módulos a cada alteração; sem guardar a instância
// no globalThis, cada recarga abriria um pool novo de conexões com o Postgres
const global = globalThis as typeof globalThis & { banco?: PrismaClient };

export const banco = global.banco ?? conectar();

if (process.env.NODE_ENV !== "production") global.banco = banco;
