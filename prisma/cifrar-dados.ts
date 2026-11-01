import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { cifrarJson, criptografiaAtiva, estaCifrado } from "../src/lib/cripto";

// Roda no vercel-build, depois das migrations: cifra os dados demográficos gravados antes da criptografia
// de campo (ou antes de a chave ser configurada). Idempotente: o que já está cifrado fica como está
if (!criptografiaAtiva()) {
  console.log("Sem CHAVE_CRIPTOGRAFIA: dados demográficos seguem sem criptografia de campo.");
  process.exit(0);
}

const urlBanco = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;
if (!urlBanco) {
  console.error("Sem DATABASE_URL: nada a cifrar.");
  process.exit(1);
}

const prisma = new PrismaClient({ adapter: new PrismaPg(urlBanco) });
const comDemografia = await prisma.participacao.findMany({
  where: { concluidaEm: { not: null } },
  select: { id: true, demografia: true },
});
const abertas = comDemografia.filter((participacao) => participacao.demografia !== null && !estaCifrado(participacao.demografia));
for (const participacao of abertas) {
  await prisma.participacao.update({
    where: { id: participacao.id },
    data: { demografia: cifrarJson(participacao.demografia as object) },
  });
}
console.log(`${abertas.length} participações com dados demográficos cifradas agora.`);
await prisma.$disconnect();
