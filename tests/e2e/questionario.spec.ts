import { expect, test, type Page } from "@playwright/test";
import { verificarAcessibilidade } from "./acessibilidade";
import { estudoAberto } from "./preparacao";

// Cada teste cria pesquisador, estudo e respostas antes de começar: com a suíte inteira no servidor de
// desenvolvimento, 60 s não bastam
test.describe.configure({ timeout: 120_000 });

// Marca uma posição em cada item, pulando os números pedidos
async function responder(page: Page, pular: number[] = []) {
  for (let numero = 1; numero <= 26; numero++) {
    if (pular.includes(numero)) continue;
    await page.locator(`input[name="item-${numero}"]`).nth((numero * 3) % 7).check();
  }
}

async function concordar(page: Page, link: string) {
  await page.goto(link);
  await page.getByRole("button", { name: "Concordo e quero participar" }).click();
  await expect(page).toHaveURL(/\/questionario$/);
}

// O elemento com foco está na tela e acima do rodapé fixo (WCAG 2.4.7 e 2.4.11)
async function focoVisivelSemCobrir(page: Page) {
  const situacao = await page.evaluate(() => {
    const foco = document.activeElement?.getBoundingClientRect();
    const rodape = document.querySelector("footer")?.getBoundingClientRect();
    if (!foco) return "sem foco";
    if (foco.bottom <= 0 || foco.top >= window.innerHeight) return "fora da tela";
    if (rodape && foco.bottom > rodape.top && document.activeElement?.closest("footer") === null) return "coberto pelo rodapé";
    return "ok";
  });
  expect(situacao).toBe("ok");
}

test("fluxo completo do participante, com axe em todas as etapas", async ({ page, browser }, info) => {
  // cria o estudo, passa pelas 4 etapas e roda o axe em cada uma: mais lento que os outros testes
  test.slow();
  if (info.project.name === "celular") await page.setViewportSize({ width: 390, height: 844 });
  const estudo = await estudoAberto(browser, info);

  await page.goto(estudo.link);
  await expect(page).toHaveTitle(/^Consentimento · /);
  await expect(page.getByRole("list", { name: "Etapas da participação" }).getByText("1 · Consentimento")).toHaveAttribute(
    "aria-current",
    "step",
  );
  await verificarAcessibilidade(page);

  await page.getByRole("button", { name: "Concordo e quero participar" }).click();
  await expect(page).toHaveTitle(/^Questionário · /);
  await expect(page.getByText("Etapa 2 de 3 · Questionário")).toBeVisible();
  await expect(page.getByRole("radio", { checked: true })).toHaveCount(0);
  await verificarAcessibilidade(page);

  await responder(page);
  await expect(page.getByText("26 de 26 respondidos")).toBeVisible();
  await page.getByRole("button", { name: "Enviar respostas" }).click();

  await expect(page).toHaveTitle(/^Dados opcionais · /);
  await verificarAcessibilidade(page);
  await page.getByLabel("25 a 34 anos").check();
  await page.getByRole("button", { name: "Continuar" }).click();

  await expect(page).toHaveTitle(/^Respostas registradas · /);
  await expect(page.getByRole("heading", { name: "Respostas registradas" })).toBeVisible();
  await verificarAcessibilidade(page);

  // As respostas de responder() mudam de lado a cada item: a participação sai marcada como suspeita na conclusão
  await estudo.pesquisador.reload();
  await expect(estudo.pesquisador.getByText("1 resposta · 1 suspeita · 1 na análise")).toBeVisible();
  await estudo.fechar();
});

test("sem coleta de dados demográficos, o envio leva direto ao agradecimento", async ({ page, browser }, info) => {
  const estudo = await estudoAberto(browser, info, { demografia: false });
  await page.goto(estudo.link);
  await expect(page.getByRole("list", { name: "Etapas da participação" }).getByRole("listitem")).toHaveCount(2);
  await page.getByRole("button", { name: "Concordo e quero participar" }).click();
  await expect(page.getByText("Etapa 2 de 2 · Questionário")).toBeVisible();
  await responder(page);
  await page.getByRole("button", { name: "Enviar respostas" }).click();
  await expect(page).toHaveTitle(/^Respostas registradas · /);
  // a etapa não existe nem pelo endereço
  await page.goto(`${estudo.link}/sobre-voce`);
  await expect(page).not.toHaveTitle(/^Dados opcionais/);
  await estudo.fechar();
});

test("fluxo completo só com teclado, com o foco sempre visível", async ({ page, browser }, info) => {
  test.slow();
  const estudo = await estudoAberto(browser, info);
  await page.goto(estudo.link);

  const concordo = page.getByRole("button", { name: "Concordo e quero participar" });
  for (let i = 0; i < 10 && !(await concordo.evaluate((el) => el === document.activeElement)); i++) {
    await page.keyboard.press("Tab");
  }
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/questionario$/);

  for (let numero = 1; numero <= 26; numero++) {
    // Tab entra no grupo do item; Espaço marca a primeira posição e as setas mudam (comportamento nativo do rádio)
    do {
      await page.keyboard.press("Tab");
    } while (!(await page.evaluate((n) => document.activeElement?.getAttribute("name") === `item-${n}`, numero)));
    await focoVisivelSemCobrir(page);
    await page.keyboard.press("Space");
    await page.keyboard.press("ArrowRight");
    await expect(page.locator(`input[name="item-${numero}"]`).nth(1)).toBeChecked();
  }
  await page.keyboard.press("Tab");
  await expect(page.getByRole("button", { name: "Enviar respostas" })).toBeFocused();
  await focoVisivelSemCobrir(page);
  await page.keyboard.press("Enter");

  await expect(page).toHaveURL(/\/sobre-voce$/);
  const pular = page.getByRole("button", { name: "Pular esta etapa" });
  for (let i = 0; i < 40 && !(await pular.evaluate((el) => el === document.activeElement)); i++) {
    await page.keyboard.press("Tab");
  }
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/fim$/);
  await estudo.fechar();
});

test("envio incompleto leva o foco ao resumo e os links levam aos itens", async ({ page, browser }, info) => {
  const estudo = await estudoAberto(browser, info);
  await concordar(page, estudo.link);
  await responder(page, [7, 19]);
  await page.getByRole("button", { name: "Enviar respostas" }).click();

  const resumo = page.getByRole("alert").filter({ hasText: "Faltam 2 itens: 7 e 19" });
  await expect(resumo).toBeFocused();
  await expect(page).toHaveTitle(/^Faltam 2 itens · Questionário · /);
  await expect(page.locator("#item-7")).toHaveAccessibleDescription("Este item não foi respondido");
  await verificarAcessibilidade(page);

  await page.getByRole("link", { name: "Ir para o item 19" }).click();
  await expect(page.locator('input[name="item-19"]').first()).toBeFocused();
  await focoVisivelSemCobrir(page);
  await estudo.fechar();
});

test("cada item é um grupo com legenda e 7 rádios com posição e polo", async ({ page, browser }, info) => {
  const estudo = await estudoAberto(browser, info);
  await concordar(page, estudo.link);
  await expect(page.locator("#item-4")).toMatchAriaSnapshot(`
    - 'group "Item 4 de 26: De Fácil aprendizagem ou De difícil aprendizagem"':
      - radio "1 de 7, mais perto de De Fácil aprendizagem"
      - radio "2 de 7, mais perto de De Fácil aprendizagem"
      - radio "3 de 7, mais perto de De Fácil aprendizagem"
      - radio "4 de 7, centro"
      - radio "5 de 7, mais perto de De difícil aprendizagem"
      - radio "6 de 7, mais perto de De difícil aprendizagem"
      - radio "7 de 7, mais perto de De difícil aprendizagem"
  `);
  await estudo.fechar();
});

test("em 320 px (zoom de 400%) nenhuma etapa rola na horizontal", async ({ page, browser }, info) => {
  const estudo = await estudoAberto(browser, info);
  await page.setViewportSize({ width: 320, height: 640 });
  const semRolagem = async () =>
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);

  await page.goto(estudo.link);
  await semRolagem();
  await page.getByRole("button", { name: "Concordo e quero participar" }).click();
  await expect(page).toHaveURL(/\/questionario$/);
  await semRolagem();
  await page.getByRole("button", { name: "Sair sem enviar" }).click();
  await semRolagem();
  await page.getByRole("button", { name: "Continuar respondendo" }).click();
  await responder(page);
  await page.getByRole("button", { name: "Enviar respostas" }).click();
  await expect(page).toHaveURL(/\/sobre-voce$/);
  await semRolagem();
  await estudo.fechar();
});

test("recarregar a página recupera as respostas marcadas", async ({ page, browser }, info) => {
  const estudo = await estudoAberto(browser, info);
  await concordar(page, estudo.link);
  await page.locator('input[name="item-1"]').nth(5).check();
  await page.locator('input[name="item-2"]').nth(0).check();
  await page.reload();
  await expect(page.getByRole("status")).toHaveText("Recuperamos as respostas que você já tinha marcado.");
  await expect(page.locator('input[name="item-1"]').nth(5)).toBeChecked();
  await expect(page.getByText("2 de 26 respondidos")).toBeVisible();
  await estudo.fechar();
});

test("sair sem enviar confirma numa janela e não grava nada", async ({ page, browser }, info) => {
  const estudo = await estudoAberto(browser, info);
  await concordar(page, estudo.link);
  await page.locator('input[name="item-1"]').nth(2).check();

  const sair = page.getByRole("contentinfo").getByRole("button", { name: "Sair sem enviar" });
  const janela = page.getByRole("alertdialog", { name: "Sair sem enviar? Nada do que você marcou será gravado." });
  await sair.click();
  await expect(janela).toBeVisible();
  await expect(janela.getByRole("button", { name: "Continuar respondendo" })).toBeFocused();
  await verificarAcessibilidade(page);

  // Esc continua respondendo, com a resposta marcada e o foco de volta em Sair sem enviar
  await page.keyboard.press("Escape");
  await expect(janela).toBeHidden();
  await expect(sair).toBeFocused();
  await expect(page.locator('input[name="item-1"]').nth(2)).toBeChecked();

  await sair.click();
  await janela.getByRole("button", { name: "Sair sem enviar" }).click();

  await expect(page).toHaveURL(/\/saiu$/);
  await expect(page.getByRole("heading", { name: "Você saiu do estudo" })).toBeVisible();
  await verificarAcessibilidade(page);

  await page.goto(estudo.link);
  await expect(page.getByRole("heading", { name: "Termo de consentimento" })).toBeVisible();
  await estudo.pesquisador.reload();
  await expect(estudo.pesquisador.getByText("0 respostas · 0 na análise")).toBeVisible();
  await estudo.fechar();
});

// Quem responde só vê o formulário e o seletor de idioma: nenhum link sai do próprio estudo
async function soLinksDoFormulario(page: Page) {
  await expect(page.getByRole("navigation", { name: "Principal" })).toHaveCount(0);
  const destinos = await page.locator("a[href]").evaluateAll((links) => links.map((link) => link.getAttribute("href") ?? ""));
  for (const destino of destinos) expect(destino, destino).toMatch(/^(#|\/r\/)/);
}

test("o link do participante só mostra o formulário e o seletor de idioma, sem caminho para a ferramenta", async ({ page, browser }, info) => {
  const estudo = await estudoAberto(browser, info);
  await page.goto(estudo.link);
  await expect(page.getByLabel("Idioma")).toBeVisible();
  await soLinksDoFormulario(page);

  await page.getByRole("button", { name: "Concordo e quero participar" }).click();
  await expect(page).toHaveURL(/\/questionario$/);
  await soLinksDoFormulario(page);
  await responder(page);
  await page.getByRole("button", { name: "Enviar respostas" }).click();
  await expect(page).toHaveURL(/\/sobre-voce$/);
  await soLinksDoFormulario(page);
  await page.getByRole("button", { name: "Pular esta etapa" }).click();
  await expect(page).toHaveURL(/\/fim$/);
  await soLinksDoFormulario(page);
  await estudo.fechar();
});

test("não quero participar sai sem gravar e o link respondido não aceita outro envio", async ({ page, browser }, info) => {
  const estudo = await estudoAberto(browser, info);
  await page.goto(estudo.link);
  await page.getByRole("link", { name: "Não quero participar" }).click();
  await expect(page.getByRole("heading", { name: "Você saiu do estudo" })).toBeVisible();

  await concordar(page, estudo.link);
  await responder(page);
  await page.getByRole("button", { name: "Enviar respostas" }).click();
  await page.getByRole("button", { name: "Pular esta etapa" }).click();
  await expect(page).toHaveURL(/\/fim$/);

  await page.goto(estudo.link);
  await expect(page.getByRole("heading", { name: "Você já respondeu este estudo" })).toBeVisible();
  await estudo.fechar();
});
