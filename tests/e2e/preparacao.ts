import "dotenv/config";
import { readFileSync } from "node:fs";
import { PrismaPg } from "@prisma/adapter-pg";
import { expect, type Browser, type Page, type TestInfo } from "@playwright/test";
import { PrismaClient } from "../../src/generated/prisma/client";
import { avaliarSuspeita, type ItemUEQ } from "../../src/ueq";
import { cadastrarComTeclado, emailDeTeste } from "./contas";

// Lido do disco: o Playwright carrega os testes como ESM, que não importa JSON sem atributo de tipo
const protocolo = JSON.parse(readFileSync("data/protocolo.json", "utf8")) as { inconsistencia: Parameters<typeof avaliarSuspeita>[2] };

export const TITULO_ESTUDO = "Avaliação do checkout da loja virtual";

export async function criarEstudo(page: Page, titulo = TITULO_ESTUDO, { demografia = true } = {}) {
  await page.goto("/estudos/novo");
  await page.getByLabel("Título do estudo").fill(titulo);
  await page.getByLabel("Produto avaliado").fill("Checkout da loja virtual");
  await page.getByLabel("Objetivo").fill("Queremos entender como as pessoas percebem o novo checkout da loja.");
  await page.getByRole("button", { name: "Adicionar versão" }).click();
  await page.getByLabel("Versão 2").fill("Checkout em uma página");
  // Os fluxos do participante passam pela etapa "Dados opcionais", que nasce desligada
  if (demografia) await page.getByLabel("Coletar dados demográficos no fim do questionário").check();
  await page.getByRole("main").getByRole("button", { name: "Criar estudo" }).click();
  await expect(page.getByRole("status")).toHaveText(
    "Estudo criado em rascunho. Confira os dados e abra a coleta quando estiver pronto.",
  );
}

// Um pesquisador em outro contexto do navegador cria e abre um estudo; devolve o link público
// e a página do pesquisador, para os testes do participante conferirem o resultado do outro lado
export async function estudoAberto(browser: Browser, info: TestInfo, { demografia = true } = {}) {
  const contexto = await browser.newContext();
  const pesquisador = await contexto.newPage();
  await cadastrarComTeclado(pesquisador, emailDeTeste(info));
  await criarEstudo(pesquisador, TITULO_ESTUDO, { demografia });
  await pesquisador.getByRole("button", { name: "Abrir coleta" }).click();
  await expect(pesquisador.getByText("Aberto · aceitando respostas")).toBeVisible();
  const link = (await pesquisador.locator("code").textContent()) ?? "";
  return { link, pesquisador, fechar: () => contexto.close() };
}

// Grava respostas direto no banco, sem passar pelo questionário: os testes do painel precisam de
// dezenas de participações, e o fluxo do participante já tem os próprios testes
export async function inserirRespostas(link: string, conjuntos: { versao: number; pasta: string; limite?: number }[]) {
  const slug = link.split("/r/")[1] ?? "";
  const banco = new PrismaClient({ adapter: new PrismaPg(process.env.DATABASE_URL ?? "") });
  const estudo = await banco.estudo.findUniqueOrThrow({
    where: { slugPublico: slug },
    include: { versoes: { orderBy: { ordem: "asc" } } },
  });
  const itens = await banco.item.findMany({ orderBy: { numero: "asc" } });
  const itensUeq: ItemUEQ[] = itens.map((item) => ({
    numero: item.numero,
    escala: item.escala.toLowerCase() as ItemUEQ["escala"],
    polaridade: item.polaridade === "POSITIVA_DIREITA" ? "+" : "-",
  }));
  for (const { versao, pasta, limite } of conjuntos) {
    const versaoId = estudo.versoes[versao - 1]?.id ?? "";
    const linhas = readFileSync(`data/fixtures/${pasta}/respostas.csv`, "utf8")
      .split(/\r?\n/)
      .filter((linha) => linha.trim() !== "")
      .slice(0, limite);
    for (const linha of linhas) {
      const valores = linha.split(";").map(Number);
      await banco.participacao.create({
        data: {
          versaoId,
          consentiuEm: new Date(),
          concluidaEm: new Date(),
          // a mesma marca que a conclusão de verdade grava (src/app/r/[slug]/acoes.ts)
          suspeita: avaliarSuspeita(valores, itensUeq, protocolo.inconsistencia).suspeita,
          respostas: { create: itens.map((item) => ({ itemId: item.id, valor: valores[item.numero - 1] ?? 4 })) },
        },
      });
    }
  }
  await banco.$disconnect();
}
