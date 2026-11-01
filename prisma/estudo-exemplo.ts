import { readFileSync } from "node:fs";
import protocolo from "../data/protocolo.json";
import type { PrismaClient } from "../src/generated/prisma/client";
import { avaliarSuspeita, type ItemUEQ } from "../src/ueq";

// Estudo de desenvolvimento para ver o painel com dados de verdade: as fixtures de validação
// (data/fixtures) viram as respostas das duas versões. Não vai para produção
const SLUG_EXEMPLO = "exemplo";

function lerFixture(pasta: string): number[][] {
  return readFileSync(new URL(`../data/fixtures/${pasta}/respostas.csv`, import.meta.url), "utf8")
    .split(/\r?\n/)
    .filter((linha) => linha.trim() !== "")
    .map((linha) => linha.split(";").map(Number));
}

export async function criarEstudoExemplo(prisma: PrismaClient, pesquisadorId: string) {
  const itens = await prisma.item.findMany({ orderBy: { numero: "asc" } });
  const itensUeq: ItemUEQ[] = itens.map((item) => ({
    numero: item.numero,
    escala: item.escala.toLowerCase() as ItemUEQ["escala"],
    polaridade: item.polaridade === "POSITIVA_DIREITA" ? "+" : "-",
  }));

  // Recria do zero a cada seed: a cascata apaga versões, participações e respostas antigas
  await prisma.estudo.deleteMany({ where: { slugPublico: SLUG_EXEMPLO } });
  const estudo = await prisma.estudo.create({
    data: {
      pesquisadorId,
      titulo: "Estudo de exemplo",
      produtoAvaliado: "Checkout da loja virtual",
      objetivo: "Queremos entender como as pessoas percebem o checkout da loja.",
      status: "ABERTO",
      coletarDemografia: true,
      dataInicio: new Date("2026-10-05T00:00:00Z"),
      dataFim: new Date("2026-11-20T00:00:00Z"),
      slugPublico: SLUG_EXEMPLO,
      versoes: {
        create: [
          { nome: "Checkout atual", ordem: 1 },
          { nome: "Checkout em uma página", ordem: 2 },
        ],
      },
    },
    include: { versoes: { orderBy: { ordem: "asc" } } },
  });

  const conjuntos = [
    { versao: estudo.versoes[0], respostas: lerFixture("basico") },
    { versao: estudo.versoes[1], respostas: lerFixture("inconsistente") },
  ];
  for (const { versao, respostas } of conjuntos) {
    if (!versao) continue;
    for (const valores of respostas) {
      await prisma.participacao.create({
        data: {
          versaoId: versao.id,
          consentiuEm: new Date(),
          concluidaEm: new Date(),
          suspeita: avaliarSuspeita(valores, itensUeq, protocolo.inconsistencia).suspeita,
          respostas: {
            create: itens.map((item) => ({ itemId: item.id, valor: valores[item.numero - 1] ?? 4 })),
          },
        },
      });
    }
  }
  return conjuntos.reduce((soma, conjunto) => soma + conjunto.respostas.length, 0);
}
