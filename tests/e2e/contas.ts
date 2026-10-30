import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { expect, type Locator, type Page, type TestInfo } from "@playwright/test";
import { PrismaClient } from "../../src/generated/prisma/client";

export const SENHA = "senha-boa-de-teste";

// Domínio próprio dos testes: o afterAll apaga só o que os testes criaram, nunca a conta de desenvolvimento
const DOMINIO_TESTE = "e2e.exemplo.com";

export function emailDeTeste(info: TestInfo): string {
  return `${info.project.name}-${Date.now()}-${info.workerIndex}@${DOMINIO_TESTE}`;
}

export async function apagarContasDeTeste() {
  const banco = new PrismaClient({ adapter: new PrismaPg(process.env.DATABASE_URL ?? "") });
  await banco.pesquisador.deleteMany({ where: { email: { endsWith: `@${DOMINIO_TESTE}` } } });
  await banco.$disconnect();
}

// Só teclado: Tab até o elemento ficar com foco, sem clicar (WCAG 2.1.1)
export async function tabAte(page: Page, alvo: Locator, limite = 30) {
  for (let i = 0; i < limite; i++) {
    if (await alvo.evaluate((elemento) => elemento === document.activeElement)) return;
    await page.keyboard.press("Tab");
  }
  throw new Error(`O Tab não chegou em ${alvo} depois de ${limite} tentativas`);
}

// No celular os links da barra ficam atrás do botão Menu; no computador o botão não aparece
export async function abrirMenu(page: Page) {
  const menu = page.getByRole("button", { name: "Menu" });
  if ((await menu.isVisible()) && (await menu.getAttribute("aria-expanded")) === "false") await menu.click();
}

export async function abrirMenuComTeclado(page: Page) {
  const menu = page.getByRole("button", { name: "Menu" });
  if (!(await menu.isVisible()) || (await menu.getAttribute("aria-expanded")) === "true") return;
  await tabAte(page, menu);
  await page.keyboard.press("Enter");
}

export async function cadastrarComTeclado(page: Page, email: string) {
  await page.goto("/cadastrar");
  await tabAte(page, page.getByLabel("Nome"));
  await page.keyboard.type("Pesquisadora E2E");
  await tabAte(page, page.getByLabel("E-mail"));
  await page.keyboard.type(email);
  await tabAte(page, page.getByLabel("Senha", { exact: true }));
  await page.keyboard.type(SENHA);
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/estudos$/);
}

export async function entrarComTeclado(page: Page, email: string, senha = SENHA) {
  await tabAte(page, page.getByLabel("E-mail"));
  await page.keyboard.type(email);
  await tabAte(page, page.getByLabel("Senha", { exact: true }));
  await page.keyboard.type(senha);
  await page.keyboard.press("Enter");
}
