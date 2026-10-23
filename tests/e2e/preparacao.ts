import { expect, type Browser, type Page, type TestInfo } from "@playwright/test";
import { cadastrarComTeclado, emailDeTeste } from "./contas";

export const TITULO_ESTUDO = "Avaliação do checkout da loja virtual";

export async function criarEstudo(page: Page, titulo = TITULO_ESTUDO) {
  await page.goto("/estudos/novo");
  await page.getByLabel("Título do estudo").fill(titulo);
  await page.getByLabel("Produto avaliado").fill("Checkout da loja virtual");
  await page.getByLabel("Objetivo").fill("Queremos entender como as pessoas percebem o novo checkout da loja.");
  await page.getByRole("button", { name: "Adicionar versão" }).click();
  await page.getByLabel("Versão 2").fill("Checkout em uma página");
  await page.getByRole("main").getByRole("button", { name: "Criar estudo" }).click();
  await expect(page.getByRole("status")).toHaveText(
    "Estudo criado em rascunho. Confira os dados e abra a coleta quando estiver pronto.",
  );
}

// Um pesquisador em outro contexto do navegador cria e abre um estudo; devolve o link público
// e a página do pesquisador, para os testes do participante conferirem o resultado do outro lado
export async function estudoAberto(browser: Browser, info: TestInfo) {
  const contexto = await browser.newContext();
  const pesquisador = await contexto.newPage();
  await cadastrarComTeclado(pesquisador, emailDeTeste(info));
  await criarEstudo(pesquisador);
  await pesquisador.getByRole("button", { name: "Abrir coleta" }).click();
  await expect(pesquisador.getByText("Aberto · aceitando respostas")).toBeVisible();
  const link = (await pesquisador.locator("code").textContent()) ?? "";
  return { link, pesquisador, fechar: () => contexto.close() };
}
