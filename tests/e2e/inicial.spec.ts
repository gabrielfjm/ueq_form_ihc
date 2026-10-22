import { expect, test } from "@playwright/test";
import { verificarAcessibilidade } from "./acessibilidade";

test("página inicial carrega sem violações de acessibilidade", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: "Ferramenta UEQ" })).toBeVisible();
  await verificarAcessibilidade(page);
});

test("o primeiro Tab leva ao link de pular para o conteúdo", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  const pular = page.getByRole("link", { name: "Pular para o conteúdo" });
  await expect(pular).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("main#conteudo")).toBeFocused();
});
