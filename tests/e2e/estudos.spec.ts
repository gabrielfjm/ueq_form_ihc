import { expect, test, type Page } from "@playwright/test";
import { verificarAcessibilidade } from "./acessibilidade";
import { cadastrarComTeclado, emailDeTeste } from "./contas";

const TITULO = "Avaliação do checkout da loja virtual";

async function criarEstudo(page: Page, titulo = TITULO) {
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

test.beforeEach(async ({ page }, info) => {
  await cadastrarComTeclado(page, emailDeTeste(info));
});

test("lista vazia mostra o estado vazio e passa no axe", async ({ page }) => {
  await expect(page.getByRole("heading", { name: "Você ainda não tem estudos." })).toBeVisible();
  await verificarAcessibilidade(page);
});

test("o produto sugere o nome da primeira versão e o foco acompanha adicionar e remover", async ({ page }) => {
  await page.goto("/estudos/novo");
  await page.getByLabel("Produto avaliado").fill("Portal do aluno");
  await expect(page.getByLabel("Versão 1")).toHaveValue("Portal do aluno");
  await expect(page.getByText("Sugerido a partir do produto avaliado. Pode trocar.")).toBeVisible();

  await page.getByRole("button", { name: "Adicionar versão" }).click();
  await expect(page.getByLabel("Versão 2")).toBeFocused();
  await page.getByRole("button", { name: "Remover versão 2" }).click();
  await expect(page.getByRole("button", { name: "Adicionar versão" })).toBeFocused();
  await expect(page.getByLabel("Versão 2")).toHaveCount(0);
});

test("criar estudo com campos faltando mostra o resumo e passa no axe", async ({ page }) => {
  await page.goto("/estudos/novo");
  await verificarAcessibilidade(page);
  await page.getByRole("main").getByRole("button", { name: "Criar estudo" }).click();
  await expect(page.getByRole("alert").filter({ hasText: "Corrija 4 campos para continuar" })).toBeFocused();
  await expect(page.getByText("Dê um título ao estudo.")).toBeVisible();
  await expect(page.getByLabel("Versão 1")).toHaveAttribute("aria-invalid", "true");
  await verificarAcessibilidade(page);
});

test("abre, encerra e reabre a coleta, e o link público acompanha", async ({ page, context }) => {
  await criarEstudo(page);
  await verificarAcessibilidade(page);
  const link = (await page.locator("code").textContent()) ?? "";
  const participante = await context.newPage();

  await participante.goto(link);
  await expect(participante.getByRole("heading", { name: "Este estudo ainda não está aberto" })).toBeVisible();

  await page.getByRole("button", { name: "Abrir coleta" }).click();
  await expect(page.getByRole("status").first()).toHaveText("Coleta aberta. O link já aceita respostas.");
  await expect(page.getByText("Aberto · aceitando respostas")).toBeVisible();
  await verificarAcessibilidade(page);

  await page.getByRole("button", { name: "Encerrar coleta" }).click();
  await expect(page.getByRole("status").first()).toContainText("Coleta encerrada.");
  await participante.reload();
  await expect(participante.getByRole("heading", { name: "A coleta deste estudo foi encerrada" })).toBeVisible();

  await page.getByRole("button", { name: "Reabrir coleta" }).click();
  await expect(page.getByRole("status").first()).toHaveText("Coleta reaberta. O link voltou a aceitar respostas.");
});

test("Copiar link anuncia o resultado e funciona pelo teclado", async ({ page, context, browserName }) => {
  test.skip(browserName !== "chromium", "permissão de área de transferência só no Chromium");
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await criarEstudo(page);
  await page.getByRole("button", { name: "Abrir coleta" }).click();
  await page.getByRole("button", { name: "Copiar link" }).focus();
  await page.keyboard.press("Enter");
  await expect(page.getByText("Link copiado.")).toBeVisible();
  const copiado = await page.evaluate(() => navigator.clipboard.readText());
  expect(copiado).toMatch(/\/r\/[a-z2-9]{6}$/);
});

test("a lista mostra o estudo numa tabela com o título como link", async ({ page }) => {
  await criarEstudo(page);
  await page.goto("/estudos");
  const tabela = page.getByRole("table", { name: "Do atualizado mais recentemente ao mais antigo" });
  await expect(tabela.getByRole("columnheader", { name: "Respostas" })).toBeVisible();
  await expect(tabela.getByRole("rowheader").getByRole("link", { name: TITULO })).toBeVisible();
  await expect(tabela.getByText("Rascunho")).toBeVisible();
  await verificarAcessibilidade(page);
});

test("editar salva as mudanças e avisa", async ({ page }) => {
  await criarEstudo(page);
  await page.getByRole("link", { name: "Editar estudo" }).click();
  await expect(page.getByRole("heading", { level: 1, name: "Editar estudo" })).toBeVisible();
  await page.getByLabel("Título do estudo").fill("Checkout, segunda rodada");
  await page.getByRole("button", { name: "Salvar alterações" }).click();
  await expect(page.getByRole("status")).toHaveText("Alterações salvas.");
  await expect(page.getByRole("heading", { level: 1, name: "Checkout, segunda rodada" })).toBeVisible();
});

test("excluir pede o título e apaga o estudo", async ({ page }) => {
  await criarEstudo(page);
  await page.getByRole("button", { name: "Excluir estudo" }).click();
  await expect(page.getByLabel("Digite o título do estudo para confirmar")).toBeFocused();
  await expect(page.getByText("Excluir apaga o estudo e as 2 versões.")).toBeVisible();

  await page.getByLabel("Digite o título do estudo para confirmar").fill("outro título");
  await page.getByRole("button", { name: "Excluir definitivamente" }).click();
  await expect(page.getByText("O texto não é igual ao título do estudo. Nada foi excluído.")).toBeVisible();

  await page.getByLabel("Digite o título do estudo para confirmar").fill(TITULO);
  await page.getByRole("button", { name: "Excluir definitivamente" }).click();
  await expect(page).toHaveURL(/\/estudos\?aviso=excluido$/);
  await expect(page.getByRole("status")).toHaveText("Estudo excluído.");
  await expect(page.getByRole("heading", { name: "Você ainda não tem estudos." })).toBeVisible();
});

test("outro pesquisador não vê o estudo pelo endereço", async ({ page, browser }, info) => {
  await criarEstudo(page);
  const endereco = page.url().replace(/\?.*$/, "");

  const outro = await browser.newContext();
  const outraPagina = await outro.newPage();
  await cadastrarComTeclado(outraPagina, `outro-${emailDeTeste(info)}`);
  const resposta = await outraPagina.goto(endereco);
  expect(resposta?.status()).toBe(404);
  await outro.close();
});
