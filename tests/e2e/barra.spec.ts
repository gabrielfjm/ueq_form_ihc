import { expect, test, type Page } from "@playwright/test";
import { verificarAcessibilidade } from "./acessibilidade";
import { cadastrarComTeclado, emailDeTeste } from "./contas";

// Uma página longa, que rola bastante, com links ao longo do texto
const PAGINA_LONGA = "/documentacao/requisitos";

async function fundoDaBarra(page: Page) {
  return page.locator("header[data-barra-fixa]").evaluate((barra) => barra.getBoundingClientRect().bottom);
}

async function barraNoTopo(page: Page) {
  const barra = page.locator("header[data-barra-fixa]");
  await expect(barra).toBeInViewport();
  expect(await barra.evaluate((elemento) => Math.round(elemento.getBoundingClientRect().top))).toBe(0);
}

test("a barra fica fixa no topo ao rolar, com e sem conta", async ({ page }, info) => {
  await page.goto(PAGINA_LONGA);
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(1000);
  await barraNoTopo(page);

  await cadastrarComTeclado(page, emailDeTeste(info));
  await page.goto(PAGINA_LONGA);
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(1000);
  await barraNoTopo(page);
});

test("o foco e as âncoras nunca ficam embaixo da barra fixa", async ({ page }) => {
  await page.goto(`${PAGINA_LONGA}#rf52`);
  await barraNoTopo(page);
  const fundo = await fundoDaBarra(page);
  await expect.poll(() => page.locator("#rf52").evaluate((ancora) => ancora.getBoundingClientRect().top)).toBeGreaterThanOrEqual(fundo);

  // Subindo com Shift+Tab, o navegador traz cada elemento pela borda de cima, onde está a barra:
  // o elemento com foco tem de parar abaixo dela (WCAG 2.4.11)
  await page.goto("/documentacao/matriz-de-rastreabilidade");
  await page.locator("article a[href]").last().focus();
  for (let i = 0; i < 40; i++) {
    await page.keyboard.press("Shift+Tab");
    const posicao = await page.evaluate(() => {
      const foco = document.activeElement;
      if (!foco || foco.closest("header")) return null;
      return foco.getBoundingClientRect().top;
    });
    if (posicao !== null) expect(posicao).toBeGreaterThanOrEqual(fundo - 1);
  }
});

test("no celular os links ficam no menu, que fecha com Esc e devolve o foco", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/documentacao");
  const menu = page.getByRole("button", { name: "Menu" });
  const principal = page.getByRole("navigation", { name: "Principal" });

  // Fechado, a barra fica numa linha só
  await expect(menu).toHaveAttribute("aria-expanded", "false");
  await expect(principal.getByRole("link", { name: "Entrar" })).toBeHidden();
  expect(await page.locator("header[data-barra-fixa]").evaluate((barra) => barra.getBoundingClientRect().height)).toBeLessThan(80);

  await menu.click();
  await expect(menu).toHaveAttribute("aria-expanded", "true");
  await expect(principal.getByRole("link", { name: "Entrar" })).toBeVisible();
  await verificarAcessibilidade(page);

  await principal.getByRole("link", { name: "Entrar" }).focus();
  await page.keyboard.press("Escape");
  await expect(menu).toHaveAttribute("aria-expanded", "false");
  await expect(menu).toBeFocused();

  // Ao trocar de página, o menu fecha sozinho
  await menu.click();
  await principal.getByRole("link", { name: "Criar conta" }).click();
  await expect(page).toHaveURL(/\/cadastrar$/);
  await page.goBack();
  await expect(menu).toHaveAttribute("aria-expanded", "false");
});

test("no computador o botão Menu não aparece e os links ficam na barra", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/documentacao");
  await expect(page.getByRole("button", { name: "Menu" })).toBeHidden();
  await expect(page.getByRole("navigation", { name: "Principal" }).getByRole("link", { name: "Entrar" })).toBeVisible();
});
