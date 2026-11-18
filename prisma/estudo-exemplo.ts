import { readFileSync } from "node:fs";
import definicaoUeqS from "../data/ueq-s-itens-ptbr.json";
import protocoloUeqS from "../data/protocolo-ueq-s.json";
import protocolo from "../data/protocolo.json";
import type { PrismaClient } from "../src/generated/prisma/client";
import { avaliarSuspeita, avaliarSuspeitaUeqS, montarItensUeqS, valoresParaOUeq, type DefinicaoItemUeqS, type ItemUEQ } from "../src/ueq";

// Estudo de desenvolvimento para ver o painel com dados de verdade: as fixtures de validação
// (data/fixtures) viram as respostas das duas versões. Não vai para produção
const SLUG_EXEMPLO = "exemplo";

function lerFixture(pasta: string, raiz = "fixtures"): number[][] {
  return readFileSync(new URL(`../data/${raiz}/${pasta}/respostas.csv`, import.meta.url), "utf8")
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
      responsavelNome: "Equipe da Ferramenta UEQ",
      responsavelEmail: "contato@exemplo.com",
      instituicao: "PPGIa · PUCPR",
      riscos: "Os riscos são mínimos: responder pode cansar um pouco ou causar algum desconforto. Você pode parar a qualquer momento.",
      beneficios: "Não há benefício direto para você. As respostas ajudam a melhorar o produto avaliado.",
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

// O mesmo para o UEQ-S (link /r/exemplo-curto): os dados de exemplo da planilha oficial do UEQ-S numa versão e o
// cenário bordas na outra. As respostas ficam nos itens equivalentes do UEQ, como as que chegam pelo link
const SLUG_EXEMPLO_UEQ_S = "exemplo-curto";

export async function criarEstudoExemploUeqS(prisma: PrismaClient, pesquisadorId: string) {
  const itens = await prisma.item.findMany({ orderBy: { numero: "asc" } });
  const itensUeq: ItemUEQ[] = itens.map((item) => ({
    numero: item.numero,
    escala: item.escala.toLowerCase() as ItemUEQ["escala"],
    polaridade: item.polaridade === "POSITIVA_DIREITA" ? "+" : "-",
  }));
  const itensUeqS = montarItensUeqS(definicaoUeqS.itens as DefinicaoItemUeqS[], itensUeq);
  const idPorNumero = new Map(itens.map((item) => [item.numero, item.id]));

  await prisma.estudo.deleteMany({ where: { slugPublico: SLUG_EXEMPLO_UEQ_S } });
  const estudo = await prisma.estudo.create({
    data: {
      pesquisadorId,
      titulo: "Estudo de exemplo do UEQ-S",
      produtoAvaliado: "Aplicativo de agendamento",
      objetivo: "Queremos uma leitura rápida de como as pessoas percebem o aplicativo de agendamento.",
      responsavelNome: "Equipe da Ferramenta UEQ",
      responsavelEmail: "contato@exemplo.com",
      instituicao: "PPGIa · PUCPR",
      riscos: "Os riscos são mínimos: responder pode cansar um pouco ou causar algum desconforto. Você pode parar a qualquer momento.",
      beneficios: "Não há benefício direto para você. As respostas ajudam a melhorar o produto avaliado.",
      status: "ABERTO",
      instrumento: "UEQ_S",
      coletarDemografia: false,
      dataInicio: new Date("2026-11-10T00:00:00Z"),
      dataFim: new Date("2026-12-10T00:00:00Z"),
      slugPublico: SLUG_EXEMPLO_UEQ_S,
      versoes: { create: [{ nome: "Aplicativo atual", ordem: 1 }, { nome: "Aplicativo novo", ordem: 2 }] },
    },
    include: { versoes: { orderBy: { ordem: "asc" } } },
  });

  const conjuntos = [
    { versao: estudo.versoes[0], respostas: lerFixture("oficial-exemplo", "fixtures-ueq-s") },
    { versao: estudo.versoes[1], respostas: lerFixture("bordas", "fixtures-ueq-s") },
  ];
  for (const { versao, respostas } of conjuntos) {
    if (!versao) continue;
    for (const valores of respostas) {
      await prisma.participacao.create({
        data: {
          versaoId: versao.id,
          consentiuEm: new Date(),
          concluidaEm: new Date(),
          suspeita: avaliarSuspeitaUeqS(valores, itensUeqS, protocoloUeqS.inconsistencia).suspeita,
          respostas: {
            create: valoresParaOUeq(valores, itensUeqS).map(({ numeroNoUeq, valor }) => ({ itemId: idPorNumero.get(numeroNoUeq)!, valor })),
          },
        },
      });
    }
  }
  return conjuntos.reduce((soma, conjunto) => soma + conjunto.respostas.length, 0);
}
