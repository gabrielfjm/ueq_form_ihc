import { expect, test } from "@playwright/test";
import { verificarAcessibilidade } from "./acessibilidade";
import { cadastrarComTeclado, emailDeTeste, janelaDeAcesso } from "./contas";
import { estudoAberto } from "./preparacao";

test("toda resposta sai com os cabeçalhos de segurança", async ({ request }) => {
  const resposta = await request.get("/");
  const cabecalhos = resposta.headers();
  expect(cabecalhos["content-security-policy"]).toContain("frame-ancestors 'none'");
  expect(cabecalhos["strict-transport-security"]).toContain("max-age=63072000");
  expect(cabecalhos["x-content-type-options"]).toBe("nosniff");
  expect(cabecalhos["x-frame-options"]).toBe("DENY");
  expect(cabecalhos["referrer-policy"]).toBe("same-origin");
  expect(cabecalhos["x-powered-by"]).toBeUndefined();
});

test("a política de privacidade é pública e acessível", async ({ page }) => {
  await page.goto("/privacidade");
  await expect(page.getByRole("heading", { level: 1, name: "Política de privacidade" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Seus direitos (LGPD, art. 18)" })).toBeVisible();
  await verificarAcessibilidade(page);
});

test("depois de 5 senhas erradas o e-mail espera", async ({ page }, info) => {
  const email = `bloqueio-${emailDeTeste(info)}`;
  await page.goto("/entrar");
  const entrar = janelaDeAcesso(page, "Entrar");
  // Cada tentativa espera a resposta do servidor antes da próxima, como uma pessoa faria
  async function tentar(senha: string) {
    await page.getByLabel("E-mail").fill(email);
    await page.getByLabel("Senha", { exact: true }).fill(senha);
    await Promise.all([
      page.waitForResponse((resposta) => resposta.request().method() === "POST"),
      entrar.getByRole("button", { name: "Entrar" }).click(),
    ]);
    // O resumo de erros recebe o foco quando a tela termina de atualizar; o envio seguinte só vale
    // depois disso (o formulário ignora clique enquanto o anterior está em andamento)
    await expect(entrar.getByRole("alert")).toBeFocused();
    await page.getByLabel("Senha", { exact: true }).focus();
  }
  for (let tentativa = 1; tentativa <= 5; tentativa++) {
    await tentar(`errada-${tentativa}`);
    await expect(entrar.getByText(/senha não conferem/i).first()).toBeVisible();
  }
  await tentar("mais-uma");
  await expect(entrar.getByText(/muitas tentativas com este e-mail/i).first()).toBeVisible();
});

test("Baixar meus dados entrega um JSON com a conta e sem a senha", async ({ page }, info) => {
  const email = emailDeTeste(info);
  await cadastrarComTeclado(page, email);
  await page.goto("/conta");
  const download = page.waitForEvent("download");
  await page.getByRole("link", { name: "Baixar meus dados" }).click();
  const arquivo = await download;
  expect(arquivo.suggestedFilename()).toMatch(/^meus-dados-ferramenta-ueq-\d{4}-\d{2}-\d{2}\.json$/);
  const conteudo = await (await arquivo.createReadStream()).toArray();
  const texto = Buffer.concat(conteudo).toString("utf8");
  const dados = JSON.parse(texto) as { conta: { email: string } };
  expect(dados.conta.email).toBe(email);
  expect(texto).not.toContain("senhaHash");
});

test("os dados demográficos aparecem em Resultados, numa sub-aba própria", async ({ page, browser }, info) => {
  test.slow();
  const estudo = await estudoAberto(browser, info);
  await page.goto(estudo.link);
  await page.getByRole("button", { name: "Concordo e quero participar" }).click();
  for (let numero = 1; numero <= 26; numero++) await page.locator(`input[name="item-${numero}"]`).nth(3).check();
  await page.getByRole("button", { name: "Enviar respostas" }).click();
  await page.getByLabel("25 a 34 anos").check();
  await page.getByRole("button", { name: "Continuar" }).click();
  await expect(page).toHaveTitle(/^Respostas registradas · /);

  const pesquisador = estudo.pesquisador;
  await pesquisador.getByRole("navigation", { name: "Seções do estudo" }).getByRole("link", { name: "Resultados" }).click();
  await pesquisador.getByRole("navigation", { name: "Partes dos resultados" }).getByRole("link", { name: "Dados demográficos" }).click();
  const idade = pesquisador.getByRole("region", { name: "Faixa etária" });
  await expect(idade.getByRole("img")).toHaveAttribute("aria-label", /25 a 34 anos, 1 \(100%\)/);
  await idade.getByText("Ver os números").click();
  await expect(idade.getByRole("row", { name: /25 a 34 anos/ })).toContainText("100%");
  await verificarAcessibilidade(pesquisador);
  await estudo.fechar();
});
