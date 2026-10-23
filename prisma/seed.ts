import "dotenv/config";
import { readFileSync } from "node:fs";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { Escala, Polaridade, PrismaClient } from "../src/generated/prisma/client";
import { MINIMO_SENHA } from "../src/lib/validacao-conta";

const escalaPorNome = {
  atratividade: Escala.ATRATIVIDADE,
  perspicuidade: Escala.PERSPICUIDADE,
  eficiencia: Escala.EFICIENCIA,
  confiabilidade: Escala.CONFIABILIDADE,
  estimulacao: Escala.ESTIMULACAO,
  novidade: Escala.NOVIDADE,
} as const;

// docs/ueq-protocolo.md, seção 1: '+' = termo positivo à direita, '-' = à esquerda
const polaridadePorSinal = {
  "+": Polaridade.POSITIVA_DIREITA,
  "-": Polaridade.POSITIVA_ESQUERDA,
} as const;

// docs/ueq-protocolo.md, seção 1: atratividade tem 6 itens, as outras escalas 4
const itensPorEscala = {
  atratividade: 6,
  perspicuidade: 4,
  eficiencia: 4,
  confiabilidade: 4,
  estimulacao: 4,
  novidade: 4,
} as const satisfies Record<keyof typeof escalaPorNome, number>;

const itemUeq = z.object({
  numero: z.int(),
  termoEsquerdo: z.string(),
  termoDireito: z.string(),
  escala: z.enum(["atratividade", "perspicuidade", "eficiencia", "confiabilidade", "estimulacao", "novidade"]),
  polaridade: z.enum(["+", "-"]),
});

const arquivoItens = z
  .object({ itens: z.array(itemUeq) })
  .superRefine(({ itens }, ctx) => {
    const erro = (message: string) => ctx.addIssue({ code: "custom", message });

    if (itens.length !== 26) erro(`O arquivo tem ${itens.length} itens, o UEQ tem 26.`);

    const vistos = new Set<number>();
    for (const item of itens) {
      if (item.numero < 1 || item.numero > 26) erro(`Item ${item.numero}: número fora de 1 a 26.`);
      if (vistos.has(item.numero)) erro(`Item ${item.numero}: número repetido.`);
      vistos.add(item.numero);
      if (!item.termoEsquerdo.trim()) erro(`Item ${item.numero}: termoEsquerdo está vazio.`);
      if (!item.termoDireito.trim()) erro(`Item ${item.numero}: termoDireito está vazio.`);
    }
    for (let numero = 1; numero <= 26; numero++) {
      if (!vistos.has(numero)) erro(`Item ${numero}: não está no arquivo.`);
    }

    for (const [escala, esperado] of Object.entries(itensPorEscala)) {
      const numeros = itens.filter((item) => item.escala === escala).map((item) => item.numero);
      if (numeros.length !== esperado) {
        erro(`Escala ${escala}: tem ${numeros.length} itens (${numeros.join(", ")}), deveria ter ${esperado}.`);
      }
    }
  });

const caminhoItens = new URL("../data/ueq-itens-ptbr.json", import.meta.url);
const validacao = arquivoItens.safeParse(JSON.parse(readFileSync(caminhoItens, "utf8")));
if (!validacao.success) {
  console.error(`Seed interrompido: data/ueq-itens-ptbr.json tem problemas.\n${z.prettifyError(validacao.error)}`);
  process.exit(1);
}

const urlBanco = process.env.DATABASE_URL;
if (!urlBanco) {
  console.error("Seed interrompido: DATABASE_URL não está definida. Copie .env.example para .env.");
  process.exit(1);
}

const prisma = new PrismaClient({ adapter: new PrismaPg(urlBanco) });

await prisma.$transaction(
  validacao.data.itens.map(({ numero, termoEsquerdo, termoDireito, escala, polaridade }) => {
    const campos = {
      termoEsquerdo: termoEsquerdo.trim(),
      termoDireito: termoDireito.trim(),
      escala: escalaPorNome[escala],
      polaridade: polaridadePorSinal[polaridade],
    };
    return prisma.item.upsert({ where: { numero }, create: { numero, ...campos }, update: campos });
  }),
);
console.log(`${validacao.data.itens.length} itens do UEQ gravados.`);

// Pesquisador para testar a área logada em desenvolvimento. Sem as duas variáveis no .env, o seed pula esta parte
const emailTeste = process.env.PESQUISADOR_TESTE_EMAIL?.trim().toLowerCase();
const senhaTeste = process.env.PESQUISADOR_TESTE_SENHA;
if (emailTeste && senhaTeste) {
  if (senhaTeste.length < MINIMO_SENHA) {
    console.error(`Seed interrompido: PESQUISADOR_TESTE_SENHA precisa ter pelo menos ${MINIMO_SENHA} caracteres.`);
    process.exit(1);
  }
  const senhaHash = await bcrypt.hash(senhaTeste, 10);
  await prisma.pesquisador.upsert({
    where: { email: emailTeste },
    create: { nome: "Pesquisador de teste", email: emailTeste, senhaHash },
    update: { senhaHash },
  });
  console.log(`Pesquisador de teste pronto: ${emailTeste}.`);
} else {
  console.log("Sem PESQUISADOR_TESTE_EMAIL e PESQUISADOR_TESTE_SENHA no .env: pesquisador de teste não criado.");
}

await prisma.$disconnect();
