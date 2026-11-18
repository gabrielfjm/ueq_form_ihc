import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import definicaoUeqS from "../data/ueq-s-itens-ptbr.json";
import protocoloUeqS from "../data/protocolo-ueq-s.json";
import protocolo from "../data/protocolo.json";
import { PrismaClient } from "../src/generated/prisma/client";
import { avaliarSuspeita, avaliarSuspeitaUeqS, montarItensUeqS, valoresDoUeqS, type DefinicaoItemUeqS, type ItemUEQ } from "../src/ueq";

// prompts/07-suspeitos.md: quando a equipe ajusta os limiares em data/protocolo.json (ou data/protocolo-ueq-s.json
// para os estudos do UEQ-S), este script
// refaz a marca de suspeita de todas as participações concluídas. Não mexe em "Na análise":
// quem decide quem sai da análise continua sendo o pesquisador
const urlBanco = process.env.DATABASE_URL;
if (!urlBanco) {
  console.error("Recálculo interrompido: DATABASE_URL não está definida. Copie .env.example para .env.");
  process.exit(1);
}

const prisma = new PrismaClient({ adapter: new PrismaPg(urlBanco) });
const itens = await prisma.item.findMany({ orderBy: { numero: "asc" } });
const itensUeq: ItemUEQ[] = itens.map((item) => ({
  numero: item.numero,
  escala: item.escala.toLowerCase() as ItemUEQ["escala"],
  polaridade: item.polaridade === "POSITIVA_DIREITA" ? "+" : "-",
}));
const itensUeqS = montarItensUeqS(definicaoUeqS.itens as DefinicaoItemUeqS[], itensUeq);

const participacoes = await prisma.participacao.findMany({
  where: { concluidaEm: { not: null } },
  select: {
    id: true,
    suspeita: true,
    versao: { select: { estudo: { select: { instrumento: true } } } },
    respostas: { select: { valor: true, item: { select: { numero: true } } } },
  },
});

let mudaram = 0;
for (const participacao of participacoes) {
  const valores = Array<number>(itens.length).fill(0);
  for (const resposta of participacao.respostas) valores[resposta.item.numero - 1] = resposta.valor;
  // Cada estudo com a regra da planilha do questionário dele
  const { suspeita } =
    participacao.versao.estudo.instrumento === "UEQ_S"
      ? avaliarSuspeitaUeqS(valoresDoUeqS(valores, itensUeqS), itensUeqS, protocoloUeqS.inconsistencia)
      : avaliarSuspeita(valores, itensUeq, protocolo.inconsistencia);
  if (suspeita !== participacao.suspeita) {
    await prisma.participacao.update({ where: { id: participacao.id }, data: { suspeita } });
    mudaram++;
  }
}

console.log(
  `${participacoes.length} participações concluídas conferidas com os limiares atuais de data/protocolo.json; ${mudaram} mudaram de marca.`,
);
await prisma.$disconnect();
