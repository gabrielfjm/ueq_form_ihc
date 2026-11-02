import { expect, test } from "@playwright/test";
import { verificarAcessibilidade } from "./acessibilidade";
import { abrirMenu, cadastrarComTeclado, emailDeTeste, janelaDeAcesso } from "./contas";

test("a raiz apresenta a ferramenta para quem não tem sessão e passa no axe", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole("heading", { level: 1, name: "Estudos de experiência do usuário com o UEQ" })).toBeVisible();
  for (const secao of ["O que é o UEQ", "O questionário", "Como ler os resultados", "Como a ferramenta funciona", "Para o participante", "Para o pesquisador", "Estudos sobre o método", "Documentação", "Créditos"]) {
    await expect(page.getByRole("heading", { level: 2, name: secao })).toBeVisible();
  }
  await expect(page.getByRole("table", { name: "As seis escalas do UEQ" }).getByRole("row")).toHaveCount(7);
  // A barra de quem não entrou tem só a documentação e Entrar
  const principal = page.getByRole("navigation", { name: "Principal" });
  await abrirMenu(page);
  await expect(principal.getByRole("link", { name: "Documentação" })).not.toHaveAttribute("aria-current", "page");
  await expect(principal.getByRole("button", { name: "Entrar" })).toBeVisible();
  await expect(principal.getByRole("link", { name: "Estudos" })).toHaveCount(0);
  await verificarAcessibilidade(page);
});

test("Entrar abre a janela por cima da página, sem rolar, e Esc fecha devolvendo o foco", async ({ page }) => {
  await page.goto("/");
  const principal = page.getByRole("navigation", { name: "Principal" });
  await abrirMenu(page);
  const botao = principal.getByRole("button", { name: "Entrar" });
  await botao.click();
  const janela = janelaDeAcesso(page, "Entrar");
  await expect(janela).toBeVisible();
  await expect(page.getByLabel("E-mail")).toBeFocused();
  await expect(page).toHaveURL(/\/$/);
  // O formulário cabe inteiro na janela, sem barra de rolagem
  const [altura, visivel] = await janela.evaluate((dialogo) => {
    const caixa = dialogo.firstElementChild as HTMLElement;
    return [caixa.scrollHeight, caixa.clientHeight];
  });
  expect(altura).toBeLessThanOrEqual(visivel);
  await verificarAcessibilidade(page);

  // Criar conta troca o formulário dentro da mesma janela
  await janela.getByRole("link", { name: "Criar conta" }).click();
  await expect(janelaDeAcesso(page, "Criar conta")).toBeVisible();
  await expect(page.getByLabel("Nome")).toBeFocused();

  await page.keyboard.press("Escape");
  await expect(janelaDeAcesso(page, "Criar conta")).toBeHidden();
  await expect(botao).toBeFocused();
});

test("fechar a janela em /entrar volta para a página inicial", async ({ page }) => {
  await page.goto("/entrar");
  const janela = janelaDeAcesso(page, "Entrar");
  await janela.getByRole("button", { name: "Fechar" }).click();
  await expect(janela).toBeHidden();
  await expect(page).toHaveURL(/\/$/);
});

test("quem entrou vê a página inicial com a barra do pesquisador e o caminho para os estudos", async ({ page }, info) => {
  await cadastrarComTeclado(page, emailDeTeste(info));
  await page.goto("/");
  await abrirMenu(page);
  await expect(page.getByRole("navigation", { name: "Principal" }).getByRole("button", { name: "Sair" })).toBeVisible();
  await page.getByRole("main").getByRole("link", { name: "Ver seus estudos" }).click();
  await expect(page).toHaveURL(/\/estudos$/);
});

test("o primeiro Tab leva ao link de pular para o conteúdo", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  const pular = page.getByRole("link", { name: "Pular para o conteúdo" });
  await expect(pular).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("main#conteudo")).toBeFocused();
});

test("o navegador recebe o ícone do site", async ({ page, request }) => {
  await page.goto("/");
  const href = await page.locator('link[rel="icon"][type="image/svg+xml"]').getAttribute("href");
  expect(href).toContain("/icon.svg");
  const resposta = await request.get(href ?? "", { maxRedirects: 0 });
  expect(resposta.status()).toBe(200);
  expect(resposta.headers()["content-type"]).toContain("image/svg+xml");
  const apple = await page.locator('link[rel="apple-touch-icon"]').getAttribute("href");
  expect((await request.get(apple ?? "", { maxRedirects: 0 })).headers()["content-type"]).toContain("image/png");
});

test("a página inicial explica o UEQ, lista os estudos do método e dá os créditos", async ({ page }) => {
  await page.goto("/");
  const indice = page.getByRole("navigation", { name: "Nesta página" });
  await indice.getByRole("link", { name: "Estudos sobre o método" }).click();
  await expect(page).toHaveURL(/#inicio-estudos$/);
  await expect(page.getByText(/LAUGWITZ, B\.; HELD, T\.; SCHREPP, M\. Construction and evaluation/)).toBeVisible();
  const creditos = page.getByRole("region", { name: "Créditos" });
  await expect(creditos.getByText("Bettina Laugwitz, Theo Held e Martin Schrepp")).toBeVisible();
  await expect(creditos.getByText("Fundamentos da Interação Humano-Computador")).toBeVisible();
  for (const nome of ["Gabriel Meira", "Jean Weiss", "Luiza Pedralli"]) {
    await expect(creditos.getByText(nome, { exact: true })).toBeVisible();
  }
  await verificarAcessibilidade(page);
});

test("quem entrou volta à página inicial pelo logotipo", async ({ page }, info) => {
  await cadastrarComTeclado(page, emailDeTeste(info));
  await page.goto("/conta");
  await page.getByRole("banner").getByRole("link", { name: "Ferramenta UEQ" }).click();
  await expect(page).toHaveURL(/:\d+\/$/);
  await expect(page.getByRole("main").getByRole("link", { name: "Ver seus estudos" })).toBeVisible();
});
