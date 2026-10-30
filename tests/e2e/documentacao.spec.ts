import { expect, test } from "@playwright/test";
import { verificarAcessibilidade } from "./acessibilidade";
import { cadastrarComTeclado, emailDeTeste } from "./contas";

test("sem conta, a documentação abre com a barra pública, as seções e as sub-abas, e passa no axe", async ({ page }) => {
  await page.goto("/documentacao");
  await expect(page).toHaveURL(/\/documentacao$/);
  const principal = page.getByRole("navigation", { name: "Principal" });
  await expect(principal.getByRole("link", { name: "Documentação" })).toHaveAttribute("aria-current", "page");
  await expect(principal.getByRole("link", { name: "Entrar" })).toBeVisible();
  await expect(principal.getByRole("link", { name: "Criar conta" })).toBeVisible();
  // Quem não entrou não vê nada da área do pesquisador
  await expect(principal.getByRole("link", { name: "Estudos" })).toHaveCount(0);
  await expect(principal.getByRole("button", { name: "Sair" })).toHaveCount(0);

  await expect(page.getByRole("heading", { level: 1, name: "Documentação" })).toBeVisible();
  const secoes = page.getByRole("navigation", { name: "Seções da documentação" });
  await expect(secoes.getByRole("link", { name: "Visão geral" })).toHaveAttribute("aria-current", "page");
  await expect(page.getByRole("complementary", { name: "Sobre este documento" })).toContainText("O índice da documentação");
  await verificarAcessibilidade(page);

  await secoes.getByRole("link", { name: "Modelagem" }).click();
  await expect(page).toHaveURL(/\/documentacao\/casos-de-uso$/);
  await expect(page).toHaveTitle(/^Casos de uso · Documentação · /);
  await expect(secoes.getByRole("link", { name: "Modelagem" })).toHaveAttribute("aria-current", "page");
  const documentos = page.getByRole("navigation", { name: "Documentos de Modelagem" });
  await expect(documentos.getByRole("link", { name: "Casos de uso" })).toHaveAttribute("aria-current", "page");

  // O diagrama é uma imagem com texto alternativo, que carrega de verdade, também sem sessão
  const diagrama = page.getByRole("img", { name: /^Diagrama: Diagrama 1 · Área do pesquisador/ });
  await diagrama.scrollIntoViewIfNeeded();
  await expect.poll(() => diagrama.evaluate((imagem: HTMLImageElement) => imagem.naturalWidth)).toBeGreaterThan(0);
  await verificarAcessibilidade(page);

  await documentos.getByRole("link", { name: "Diagrama de classes" }).click();
  await expect(page.getByRole("heading", { level: 1, name: "Diagrama de classes" })).toBeVisible();
});

test("quem entrou chega à documentação pela barra do pesquisador e continua com ela", async ({ page }, info) => {
  await cadastrarComTeclado(page, emailDeTeste(info));
  const principal = page.getByRole("navigation", { name: "Principal" });
  await principal.getByRole("link", { name: "Documentação" }).click();
  await expect(page).toHaveURL(/\/documentacao$/);
  await expect(principal.getByRole("link", { name: "Documentação" })).toHaveAttribute("aria-current", "page");
  await expect(principal.getByRole("link", { name: "Estudos" })).toBeVisible();
  await expect(principal.getByRole("button", { name: "Sair" })).toBeVisible();
  await expect(principal.getByRole("link", { name: "Entrar" })).toHaveCount(0);
  await verificarAcessibilidade(page);
});

test("os links entre documentos levam à âncora dentro da ferramenta e a planilha baixa sem conta", async ({ page }) => {
  await page.goto("/documentacao/matriz-de-rastreabilidade");
  await page.getByRole("link", { name: "RF01", exact: true }).first().click();
  await expect(page).toHaveURL(/\/documentacao\/requisitos#rf01$/);
  await expect(page.locator("#rf01")).toBeInViewport();

  const ficha = page.getByRole("complementary", { name: "Sobre este documento" });
  await expect(ficha.getByRole("link", { name: "Ver no GitHub" })).toHaveAttribute(
    "href",
    "https://github.com/gabrielfjm/ueq_form_ihc/blob/main/docs/documentacao/requisitos.md",
  );
  const [download] = await Promise.all([page.waitForEvent("download"), ficha.getByRole("link", { name: "Planilha de requisitos (XLSX)" }).click()]);
  expect(download.suggestedFilename()).toBe("planilha-requisitos.xlsx");
});

test("em 320 px a documentação não rola na horizontal", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 640 });
  for (const endereco of ["/documentacao", "/documentacao/requisitos", "/documentacao/arquitetura"]) {
    await page.goto(endereco);
    const rola = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
    expect(rola, endereco).toBe(false);
  }
});

test("endereço fora do catálogo dá 404 e os arquivos só saem da lista", async ({ page, request }) => {
  expect((await page.goto("/documentacao/nao-existe"))?.status()).toBe(404);
  expect((await request.get("/api/documentacao/package.json")).status()).toBe(404);
  expect((await request.get("/api/documentacao/..%2F..%2F.env")).status()).toBe(404);
  expect((await request.get("/api/documentacao/diagramas/nao-e-um-hash.svg")).status()).toBe(404);
  // Sem conta, os arquivos da lista saem, como a documentação
  const semSessao = await request.get("/api/documentacao/requisitos.csv", { maxRedirects: 0 });
  expect(semSessao.status()).toBe(200);
  // A área do pesquisador continua fechada
  const estudos = await request.get("/estudos", { maxRedirects: 0 });
  expect(estudos.status()).toBe(307);
});
