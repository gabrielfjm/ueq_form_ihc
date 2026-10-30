import { expect, test } from "@playwright/test";
import { verificarAcessibilidade } from "./acessibilidade";
import { abrirMenu, cadastrarComTeclado, emailDeTeste } from "./contas";
import { documentoPeloSlug, documentoPronto } from "../../src/lib/documentacao/catalogo";

// A equipe está escrevendo a documentação: os testes do conteúdo de um documento só rodam quando ele
// entra na lista PRONTOS do catálogo, e voltam sozinhos quando isso acontecer
function publicado(slug: string): boolean {
  const documento = documentoPeloSlug(slug);
  return documento !== undefined && documentoPronto(documento);
}

test("sem conta, a documentação abre com a barra pública, as seções e as sub-abas, e passa no axe", async ({ page }) => {
  await page.goto("/documentacao");
  await expect(page).toHaveURL(/\/documentacao$/);
  const principal = page.getByRole("navigation", { name: "Principal" });
  await abrirMenu(page);
  await expect(principal.getByRole("link", { name: "Documentação" })).toHaveAttribute("aria-current", "page");
  await expect(principal.getByRole("button", { name: "Entrar" })).toBeVisible();
  await expect(principal.getByRole("link", { name: "Criar conta" })).toHaveCount(0);
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

  if (publicado("casos-de-uso")) {
    // O diagrama é uma imagem com texto alternativo, que carrega de verdade, também sem sessão
    const diagrama = page.getByRole("img", { name: /^Diagrama: / }).first();
    await diagrama.scrollIntoViewIfNeeded();
    await expect.poll(() => diagrama.evaluate((imagem: HTMLImageElement) => imagem.naturalWidth)).toBeGreaterThan(0);
  } else {
    await expect(page.getByRole("heading", { level: 2, name: "Casos de uso: em produção." })).toBeVisible();
  }
  await verificarAcessibilidade(page);

  await documentos.getByRole("link", { name: "Diagrama de classes" }).click();
  await expect(page.getByRole("heading", { level: 1, name: "Diagrama de classes" })).toBeVisible();
});

test("quem entrou chega à documentação pela barra do pesquisador e continua com ela", async ({ page }, info) => {
  await cadastrarComTeclado(page, emailDeTeste(info));
  const principal = page.getByRole("navigation", { name: "Principal" });
  await abrirMenu(page);
  await principal.getByRole("link", { name: "Documentação" }).click();
  await expect(page).toHaveURL(/\/documentacao$/);
  await abrirMenu(page);
  await expect(principal.getByRole("link", { name: "Documentação" })).toHaveAttribute("aria-current", "page");
  await expect(principal.getByRole("link", { name: "Estudos" })).toBeVisible();
  await expect(principal.getByRole("button", { name: "Sair" })).toBeVisible();
  await expect(principal.getByRole("button", { name: "Entrar" })).toHaveCount(0);
  await verificarAcessibilidade(page);
});

test("documento em produção mostra o aviso e a ficha, sem texto, arquivo nem downloads", async ({ page, request }) => {
  test.skip(publicado("requisitos"), "Requisitos já foi publicado");
  await page.goto("/documentacao");
  await expect(page.getByRole("heading", { level: 2, name: "A documentação está sendo escrita pela equipe." })).toBeVisible();
  const situacao = page.getByRole("table", { name: "Situação dos documentos" });
  await expect(situacao.getByRole("row", { name: /Requisitos Requisitos Em produção/ })).toBeVisible();
  await verificarAcessibilidade(page);

  await situacao.getByRole("link", { name: "Requisitos", exact: true }).click();
  await expect(page).toHaveURL(/\/documentacao\/requisitos$/);
  await expect(page.getByRole("heading", { level: 1, name: "Requisitos" })).toBeVisible();
  await expect(page.getByRole("heading", { level: 2, name: "Requisitos: em produção." })).toBeVisible();
  const ficha = page.getByRole("complementary", { name: "Sobre este documento" });
  await expect(ficha).toContainText("Em produção");
  await expect(ficha.getByRole("link", { name: "Ver no GitHub" })).toHaveCount(0);
  await expect(ficha.getByRole("link", { name: "Planilha de requisitos (XLSX)" })).toHaveCount(0);
  await expect(page.locator("article")).toHaveCount(0);
  await verificarAcessibilidade(page);

  // Os arquivos de documento em produção também não saem pela rota de download
  expect((await request.get("/api/documentacao/requisitos.csv", { maxRedirects: 0 })).status()).toBe(404);
  expect((await request.get("/api/documentacao/planilha-requisitos.xlsx", { maxRedirects: 0 })).status()).toBe(404);
});

test("os links entre documentos levam à âncora dentro da ferramenta e a planilha baixa sem conta", async ({ page }) => {
  test.skip(!publicado("matriz-de-rastreabilidade") || !publicado("requisitos"), "documentos ainda em produção");
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
  // Sem conta, os arquivos da lista saem, como a documentação, quando o documento está publicado
  const semSessao = await request.get("/api/documentacao/requisitos.csv", { maxRedirects: 0 });
  expect(semSessao.status()).toBe(publicado("requisitos") ? 200 : 404);
  // A área do pesquisador continua fechada
  const estudos = await request.get("/estudos", { maxRedirects: 0 });
  expect(estudos.status()).toBe(307);
});

test("clicar no diagrama abre em tela cheia, com zoom, arrasto, Voltar e Esc", async ({ page }) => {
  test.skip(!publicado("casos-de-uso"), "Casos de uso ainda em produção");
  await page.goto("/documentacao/casos-de-uso");
  const ampliar = page.getByRole("button", { name: /^Ampliar em tela cheia: / }).first();
  const titulo = ((await ampliar.getAttribute("aria-label")) ?? "").replace("Ampliar em tela cheia: ", "");
  await ampliar.scrollIntoViewIfNeeded();
  await ampliar.click();

  const janela = page.getByRole("dialog", { name: titulo });
  await expect(janela).toBeVisible();
  await expect(janela.getByRole("button", { name: "Voltar" })).toBeFocused();
  // A tela cheia cobre a janela do navegador
  const tela = page.viewportSize();
  const caixa = await janela.boundingBox();
  expect(Math.round(caixa?.width ?? 0)).toBe(tela?.width);
  const imagem = janela.getByRole("img", { name: /^Diagrama: / });
  await expect.poll(() => imagem.evaluate((elemento: HTMLImageElement) => elemento.naturalWidth)).toBeGreaterThan(0);
  await verificarAcessibilidade(page);

  // Zoom pelos botões e pelo teclado
  const nivel = janela.getByRole("status");
  await expect(nivel).toHaveText("100%");
  await janela.getByRole("button", { name: "Aumentar" }).click();
  await janela.getByRole("button", { name: "Aumentar" }).click();
  await expect(nivel).toHaveText("150%");
  const area = janela.getByRole("region", { name: /^Diagrama ampliado/ });
  expect(await area.evaluate((elemento) => elemento.scrollWidth > elemento.clientWidth)).toBe(true);

  // Arrastar move o diagrama, e a barra com Voltar continua parada no topo
  const antes = await area.evaluate((elemento) => [elemento.scrollLeft, elemento.scrollTop]);
  const centro = await area.boundingBox();
  const x = (centro?.x ?? 0) + (centro?.width ?? 0) / 2;
  const y = (centro?.y ?? 0) + (centro?.height ?? 0) / 2;
  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.mouse.move(x - 150, y - 150, { steps: 5 });
  await page.mouse.up();
  const depois = await area.evaluate((elemento) => [elemento.scrollLeft, elemento.scrollTop]);
  expect(depois).not.toEqual(antes);
  const voltar = janela.getByRole("button", { name: "Voltar" });
  await expect(voltar).toBeInViewport();
  expect((await voltar.boundingBox())?.y ?? 999).toBeLessThan(80);

  await page.keyboard.press("-");
  await expect(nivel).toHaveText("125%");
  await page.keyboard.press("0");
  await expect(nivel).toHaveText("100%");

  // Voltar fecha e devolve o foco ao diagrama
  await voltar.click();
  await expect(janela).toBeHidden();
  await expect(ampliar).toBeFocused();

  // Pelo teclado: Enter abre, Esc fecha
  await page.keyboard.press("Enter");
  await expect(janela).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(janela).toBeHidden();
  await expect(ampliar).toBeFocused();
});
