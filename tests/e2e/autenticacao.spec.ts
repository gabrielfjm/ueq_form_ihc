import { expect, test } from "@playwright/test";
import { verificarAcessibilidade } from "./acessibilidade";
import { abrirMenu, abrirMenuComTeclado, cadastrarComTeclado, emailDeTeste, entrarComTeclado, janelaDeAcesso, pularTutorial, SENHA, tabAte } from "./contas";

test("cadastra, sai e entra de novo usando só o teclado", async ({ page }, info) => {
  const email = emailDeTeste(info);
  await cadastrarComTeclado(page, email);
  await expect(page.getByRole("heading", { level: 1, name: "Seus estudos" })).toBeVisible();

  await abrirMenuComTeclado(page);
  await tabAte(page, page.getByRole("button", { name: "Sair" }));
  await page.keyboard.press("Enter");
  // Sair pede confirmação numa janela, com o foco já no botão de confirmar
  const confirmacao = page.getByRole("alertdialog", { name: "Sair da conta?" });
  await expect(confirmacao.getByRole("button", { name: "Sair" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/:\d+\/$/);
  await expect(page.getByRole("status")).toHaveText("Você saiu da sua conta.");

  // A página inicial abre a janela de Entrar pela barra
  await abrirMenuComTeclado(page);
  await tabAte(page, page.getByRole("navigation", { name: "Principal" }).getByRole("button", { name: "Entrar" }));
  await page.keyboard.press("Enter");
  await expect(janelaDeAcesso(page, "Entrar")).toBeVisible();
  await expect(page.getByLabel("E-mail")).toBeFocused();
  await entrarComTeclado(page, email);
  // Sem destino pedido, o login termina na página inicial
  await expect(page).toHaveURL(/:\d+\/$/);
});

test("rota protegida sem sessão vai para Entrar e volta para ela depois do login", async ({ page, context }, info) => {
  const email = emailDeTeste(info);
  await cadastrarComTeclado(page, email);
  await context.clearCookies();

  await page.goto("/conta");
  await expect(page).toHaveURL(/\/entrar\?voltar=%2Fconta$/);

  await entrarComTeclado(page, email);
  await expect(page).toHaveURL(/\/conta$/);
  await expect(page.getByRole("heading", { level: 1, name: "Minha conta" })).toBeVisible();
});

test("participante nunca precisa de sessão", async ({ page }) => {
  const resposta = await page.goto("/r/qualquer-estudo");
  expect(page.url()).toContain("/r/qualquer-estudo");
  expect(resposta?.status()).not.toBe(307);
});

test("Entrar e Criar conta passam no axe, inclusive com erro", async ({ page }) => {
  await page.goto("/entrar");
  const entrar = janelaDeAcesso(page, "Entrar");
  await expect(entrar).toBeVisible();
  await verificarAcessibilidade(page);

  await page.getByLabel("E-mail").fill("ninguem@exemplo.com");
  await page.getByLabel("Senha", { exact: true }).fill("senha-que-nao-existe");
  await entrar.getByRole("button", { name: "Entrar" }).click();
  await expect(page.getByRole("heading", { name: "Não foi possível entrar" })).toBeVisible();
  await verificarAcessibilidade(page);

  await page.goto("/cadastrar");
  const cadastrar = janelaDeAcesso(page, "Criar conta");
  await expect(cadastrar).toBeVisible();
  await verificarAcessibilidade(page);

  await cadastrar.getByRole("button", { name: "Criar conta" }).click();
  const resumo = page.getByRole("alert").filter({ hasText: "Corrija 3 campos para continuar" });
  await expect(resumo).toBeFocused();
  await expect(page.getByLabel("Nome")).toHaveAttribute("aria-invalid", "true");
  await expect(page.getByText("Informe seu nome.")).toBeVisible();
  await verificarAcessibilidade(page);
});

test("o link do resumo de erros leva ao campo", async ({ page }) => {
  await page.goto("/cadastrar");
  await page.getByLabel("Nome").fill("Alguém");
  await page.getByLabel("E-mail").fill("alguem@exemplo.com");
  await page.getByLabel("Senha", { exact: true }).fill("curta");
  await janelaDeAcesso(page, "Criar conta").getByRole("button", { name: "Criar conta" }).click();

  await page.getByRole("link", { name: "Senha: a senha precisa ter pelo menos 8 caracteres" }).click();
  await expect(page.getByLabel("Senha", { exact: true })).toBeFocused();
  // A senha que a pessoa digitou continua no campo depois do erro
  await expect(page.getByLabel("Senha", { exact: true })).toHaveValue("curta");
});

test("Mostrar senha alterna a visibilidade e anuncia o estado", async ({ page }) => {
  await page.goto("/entrar");
  const senha = page.getByLabel("Senha", { exact: true });
  const mostrar = page.getByRole("button", { name: "Mostrar senha" });
  await expect(mostrar).toHaveAttribute("aria-pressed", "false");
  await mostrar.click();
  await expect(senha).toHaveAttribute("type", "text");
  await expect(mostrar).toHaveAttribute("aria-pressed", "true");
});

test("criar a conta e entrar confirmam na tela", async ({ page }, info) => {
  const email = `confirma-${emailDeTeste(info)}`;
  await page.goto("/cadastrar");
  await page.getByLabel("Nome").fill("Pessoa da confirmação");
  await page.getByLabel("E-mail").fill(email);
  await page.getByLabel("Senha", { exact: true }).fill(SENHA);
  await page.getByRole("dialog").getByRole("button", { name: "Criar conta" }).click();
  await pularTutorial(page);
  await expect(page.getByRole("status").getByText("Conta criada com sucesso.")).toBeVisible();

  await abrirMenu(page);
  await page.getByRole("button", { name: "Sair" }).click();
  await page.getByRole("alertdialog").getByRole("button", { name: "Sair" }).click();
  await expect(page.getByRole("status").getByText("Você saiu da sua conta.")).toBeVisible();

  await page.goto("/entrar");
  await page.getByLabel("E-mail").fill(email);
  await page.getByLabel("Senha", { exact: true }).fill(SENHA);
  await page.getByRole("dialog").getByRole("button", { name: "Entrar" }).click();
  await expect(page.getByRole("status").getByText("Você entrou na sua conta.")).toBeVisible();
  await expect(page).toHaveURL(/:\d+\/$/);
});
