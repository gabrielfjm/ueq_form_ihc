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

test("a política leva cada seção pelo índice e não rola na horizontal em 320 px", async ({ page }) => {
  await page.goto("/privacidade");
  const indice = page.getByRole("navigation", { name: "Nesta página" });
  await indice.getByRole("link", { name: "Dúvidas e pedidos" }).click();
  await expect(page).toHaveURL(/#contato$/);
  await expect(page.getByRole("heading", { name: "Dúvidas e pedidos" })).toBeInViewport();

  await page.setViewportSize({ width: 320, height: 700 });
  const larguras = await page.evaluate(() => [document.documentElement.scrollWidth, window.innerWidth]);
  expect(larguras[0]).toBeLessThanOrEqual(larguras[1] ?? 0);
  await verificarAcessibilidade(page);
});

test("da página inicial, a política volta ao rodapé de onde a pessoa saiu", async ({ page }) => {
  await page.goto("/");
  await page.locator("#rodape").getByRole("link", { name: "Política de privacidade" }).click();
  await expect(page.getByRole("heading", { level: 1, name: "Política de privacidade" })).toBeVisible();
  await page.getByRole("link", { name: "Voltar para a página inicial" }).first().click();
  await expect(page).toHaveURL(/\/#rodape$/);
  await expect(page.locator("#rodape")).toBeInViewport();
});

test("de Minha conta e da ajuda, a política volta para a mesma tela", async ({ page }, info) => {
  await cadastrarComTeclado(page, emailDeTeste(info));
  await page.goto("/conta");
  await page.getByRole("link", { name: "Política de privacidade" }).click();
  await expect(page.getByRole("heading", { level: 1, name: "Política de privacidade" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Baixar meus dados" })).toBeVisible();
  await page.getByRole("link", { name: "Voltar para Minha conta" }).first().click();
  await expect(page).toHaveURL(/\/conta$/);

  await page.goto("/estudos");
  await page.getByRole("button", { name: "Ajuda desta página" }).click();
  await page.getByRole("dialog").getByRole("link", { name: "Política de privacidade" }).click();
  await expect(page.getByRole("heading", { level: 1, name: "Política de privacidade" })).toBeVisible();
  await page.getByRole("link", { name: "Voltar para a página anterior" }).first().click();
  await expect(page).toHaveURL(/\/estudos$/);
});

test("das janelas de acesso, a política abre em outra aba, sem perder o que foi digitado, e voltar tenta fechar a aba", async ({ page, context }) => {
  await page.goto("/entrar");
  await expect(page.getByRole("dialog").getByRole("link", { name: /Política de privacidade/ })).toBeVisible();

  await page.goto("/cadastrar");
  await page.getByLabel("Nome").fill("Quem está lendo a política");
  const [aba] = await Promise.all([
    context.waitForEvent("page"),
    page.getByRole("dialog").getByRole("link", { name: /Política de privacidade/ }).click(),
  ]);
  await expect(aba.getByRole("heading", { level: 1, name: "Política de privacidade" })).toBeVisible();
  await expect(page.getByLabel("Nome")).toHaveValue("Quem está lendo a política");

  // window.close() de verdade trava o encerramento do Playwright no Chromium headless, então ele é trocado por
  // um registro. Assim o teste confere também o plano B: se o navegador recusar fechar, o link segue para o início
  // Antes de a página ficar interativa, o link é só um link: leva direto ao início, sem tentar fechar
  await aba.waitForLoadState("networkidle");
  await aba.evaluate(() => {
    window.close = () => sessionStorage.setItem("pediu-para-fechar", "sim");
  });
  await aba.getByRole("link", { name: "Fechar esta aba e voltar" }).first().click();
  await expect(aba).toHaveURL(/:\d+\/$/);
  expect(await aba.evaluate(() => sessionStorage.getItem("pediu-para-fechar"))).toBe("sim");
});

test("a política não aceita voltar para outro site", async ({ page }) => {
  for (const de of ["https://exemplo.com", "//exemplo.com", "/\\exemplo.com", "/\t/exemplo.com"]) {
    await page.goto(`/privacidade?de=${encodeURIComponent(de)}`);
    await expect(page.getByRole("link", { name: "Voltar para a página inicial" }).first()).toHaveAttribute("href", "/");
  }
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
