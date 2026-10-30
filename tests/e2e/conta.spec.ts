import { expect, test } from "@playwright/test";
import { verificarAcessibilidade } from "./acessibilidade";
import { SENHA, abrirMenu, cadastrarComTeclado, emailDeTeste, entrarComTeclado } from "./contas";

test("Minha conta salva os dados, anuncia o resultado e passa no axe", async ({ page }, info) => {
  await cadastrarComTeclado(page, emailDeTeste(info));
  await abrirMenu(page);
  await page.getByRole("link", { name: "Minha conta" }).click();
  await expect(page).toHaveURL(/\/conta$/);
  await abrirMenu(page);
  await expect(page.getByRole("link", { name: "Minha conta" })).toHaveAttribute("aria-current", "page");
  await verificarAcessibilidade(page);

  await page.getByLabel("Nome").fill("Nome trocado");
  await page.getByRole("button", { name: "Salvar alterações" }).click();
  await expect(page.getByRole("status")).toHaveText("Dados salvos.");

  await page.getByLabel("Nome").fill("");
  await page.getByRole("button", { name: "Salvar alterações" }).click();
  await expect(page.getByRole("alert").filter({ hasText: "Corrija 1 campo" })).toBeFocused();
  await verificarAcessibilidade(page);
});

test("trocar a senha encerra a sessão aberta em outro navegador", async ({ page, browser }, info) => {
  const email = emailDeTeste(info);
  await cadastrarComTeclado(page, email);

  const outroNavegador = await browser.newContext();
  const outraPagina = await outroNavegador.newPage();
  await outraPagina.goto("/entrar");
  await entrarComTeclado(outraPagina, email);
  await expect(outraPagina).toHaveURL(/\/estudos$/);

  await page.goto("/conta");
  await page.getByLabel("Senha atual").fill("senha-errada");
  await page.getByLabel("Nova senha").fill("outra-senha-boa");
  await page.getByRole("button", { name: "Trocar senha" }).click();
  await expect(page.getByText("A senha atual não confere. Confira e tente de novo.")).toBeVisible();

  await page.getByLabel("Senha atual").fill(SENHA);
  await page.getByRole("button", { name: "Trocar senha" }).click();
  await expect(page.getByRole("status")).toHaveText("Senha trocada. As outras sessões abertas foram encerradas.");
  await expect(page.getByLabel("Senha atual")).toHaveValue("");

  await outraPagina.goto("/conta");
  await expect(outraPagina).toHaveURL(/\/entrar/);
  await entrarComTeclado(outraPagina, email, "outra-senha-boa");
  await expect(outraPagina).toHaveURL(/\/estudos$/);
  await outroNavegador.close();
});

test("excluir a conta exige digitar o e-mail e apaga o acesso", async ({ page }, info) => {
  const email = emailDeTeste(info);
  await cadastrarComTeclado(page, email);
  await page.goto("/conta");

  const abrir = page.getByRole("button", { name: "Excluir minha conta" });
  await expect(abrir).toHaveAttribute("aria-haspopup", "dialog");
  await abrir.click();
  const janela = page.getByRole("alertdialog", { name: "Excluir sua conta?" });
  await expect(janela).toBeVisible();
  await expect(page.getByLabel("Digite seu e-mail para confirmar")).toBeFocused();
  await expect(janela.getByText("Excluir apaga sua conta.")).toBeVisible();
  await verificarAcessibilidade(page);

  // Cancelar e Esc fecham sem excluir, e o foco volta para o botão que abriu a janela
  await janela.getByRole("button", { name: "Cancelar" }).click();
  await expect(janela).toBeHidden();
  await expect(abrir).toBeFocused();
  await abrir.click();
  await page.keyboard.press("Escape");
  await expect(janela).toBeHidden();
  await expect(abrir).toBeFocused();
  await abrir.click();

  await page.getByLabel("Digite seu e-mail para confirmar").fill("outro@exemplo.com");
  await page.getByRole("button", { name: "Excluir conta definitivamente" }).click();
  await expect(page.getByText("Esse não é o e-mail da sua conta. Nada foi excluído.")).toBeVisible();

  await page.getByLabel("Digite seu e-mail para confirmar").fill(email);
  await page.getByRole("button", { name: "Excluir conta definitivamente" }).click();
  await expect(page).toHaveURL(/\/\?aviso=excluida$/);
  await expect(page.getByRole("status")).toHaveText("Conta excluída. Os estudos e as respostas foram apagados.");

  await page.goto("/entrar");
  await entrarComTeclado(page, email);
  await expect(page.getByRole("heading", { name: "Não foi possível entrar" })).toBeVisible();
});
