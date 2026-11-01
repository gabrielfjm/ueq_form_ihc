import { expect, test, type Page } from "@playwright/test";
import { verificarAcessibilidade } from "./acessibilidade";
import { abrirMenu, cadastrarComTeclado, emailDeTeste, janelaDeAcesso, SENHA, tabAte } from "./contas";
import { criarEstudo, TITULO_ESTUDO } from "./preparacao";

async function abrirSino(page: Page) {
  await abrirMenu(page);
  await page.getByRole("button", { name: /^Notificações/ }).click();
  return page.locator("#lista-notificacoes");
}

test("toda página do pesquisador tem o (?) com a ajuda dela", async ({ page }, info) => {
  await cadastrarComTeclado(page, emailDeTeste(info));
  for (const [caminho, titulo] of [
    ["/estudos", "Seus estudos"],
    ["/estudos/novo", "Criar estudo"],
    ["/conta", "Minha conta"],
    ["/notificacoes", "Notificações"],
  ] as const) {
    await page.goto(caminho);
    await page.getByRole("button", { name: "Ajuda desta página" }).click();
    const ajuda = page.getByRole("dialog", { name: titulo });
    await expect(ajuda).toBeVisible();
    await verificarAcessibilidade(page);
    await page.keyboard.press("Escape");
    await expect(ajuda).toBeHidden();
  }
});

test("o tour abre só no primeiro acesso, avança pelo clique na ação e pode ser pulado", async ({ page }, info) => {
  const email = emailDeTeste(info);
  await page.goto("/cadastrar");
  const cadastro = janelaDeAcesso(page, "Criar conta");
  await page.getByLabel("Nome").fill("Pessoa do tour");
  await page.getByLabel("E-mail").fill(email);
  await page.getByLabel("Senha", { exact: true }).fill(SENHA);
  await cadastro.getByRole("button", { name: "Criar conta" }).click();

  const boasVindas = page.getByRole("dialog", { name: "Boas-vindas à Ferramenta UEQ" });
  await expect(boasVindas).toBeVisible();
  await verificarAcessibilidade(page);
  await boasVindas.getByRole("button", { name: "Começar o tour" }).click();

  // Sem estudos, o tour cria o estudo de exemplo e pede o clique nele
  await expect(page.getByText("Passo 1 de 10")).toBeVisible({ timeout: 30_000 });
  await page.getByRole("link", { name: "Exemplo do tour: app de delivery" }).click();
  await expect(page.getByText("Passo 2 de 10")).toBeVisible();
  await expect(page).toHaveURL(/\/estudos\/[^/]+$/);

  await page.getByRole("button", { name: "Pular tutorial" }).click();
  await expect(page.getByText(/Passo \d+ de 10/)).toBeHidden();
  await page.reload();
  await expect(page.getByRole("heading", { name: "Exemplo do tour: app de delivery" })).toBeVisible();
  await expect(boasVindas).toBeHidden();
});

test("convite por e-mail chega no sino, o leitor só vê e o dono é avisado", async ({ browser }, info) => {
  const contextoDono = await browser.newContext();
  const contextoLeitor = await browser.newContext();
  const dono = await contextoDono.newPage();
  const leitor = await contextoLeitor.newPage();
  const emailLeitor = `leitor-${emailDeTeste(info)}`;
  await cadastrarComTeclado(dono, emailDeTeste(info));
  await cadastrarComTeclado(leitor, emailLeitor);
  await criarEstudo(dono);

  await dono.getByRole("button", { name: "Compartilhar" }).click();
  const janela = dono.getByRole("dialog", { name: `Compartilhar “${TITULO_ESTUDO}”` });
  await janela.getByLabel("E-mail de quem vai participar").fill("ninguem-cadastrado@exemplo.com");
  await janela.getByRole("button", { name: "Convidar" }).click();
  await expect(janela.getByText(/Não há conta com esse e-mail/)).toBeVisible();

  await janela.getByLabel("E-mail de quem vai participar").fill(emailLeitor);
  await janela.getByLabel("Papel").selectOption("LEITOR");
  await janela.getByRole("button", { name: "Convidar" }).click();
  await expect(janela.getByRole("status")).toContainText("Convite enviado");
  await expect(janela.getByText("Convite pendente")).toBeVisible();
  await verificarAcessibilidade(dono);
  await janela.getByRole("button", { name: "Concluído" }).click();

  await leitor.goto("/estudos");
  await expect(leitor.getByText("Você tem 1 convite pendente")).toBeVisible();
  const sino = await abrirSino(leitor);
  await expect(sino.getByText(/convidou você para o estudo .* como leitor/)).toBeVisible();
  await sino.getByRole("button", { name: "Aceitar" }).click();
  await expect(leitor.getByText(/^Convite aceito./)).toBeVisible();
  await expect(leitor.getByText(/você é leitor/)).toBeVisible();
  await expect(leitor.getByRole("link", { name: "Editar estudo" })).toHaveCount(0);
  await expect(leitor.getByRole("button", { name: "Abrir coleta" })).toHaveCount(0);

  await dono.goto("/notificacoes");
  await expect(dono.getByRole("link", { name: /aceitou o convite para o estudo/ })).toBeVisible();
  await verificarAcessibilidade(dono);

  await contextoDono.close();
  await contextoLeitor.close();
});

test("o sino também funciona pelo teclado", async ({ page }, info) => {
  await cadastrarComTeclado(page, emailDeTeste(info));
  await abrirMenu(page);
  const sino = page.getByRole("button", { name: /^Notificações/ });
  await tabAte(page, sino);
  await page.keyboard.press("Enter");
  await expect(sino).toHaveAttribute("aria-expanded", "true");
  await expect(page.locator("#lista-notificacoes").getByText(/Nada novo/)).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(sino).toHaveAttribute("aria-expanded", "false");
  await expect(sino).toBeFocused();
});
