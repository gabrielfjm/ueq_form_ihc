import { readFileSync } from "node:fs";
import { expect, test } from "@playwright/test";
import { verificarAcessibilidade } from "./acessibilidade";
import { estudoAberto, inserirRespostas, TITULO_ESTUDO } from "./preparacao";

// Cria pesquisador, estudo e respostas, e o servidor ainda abre um navegador para gerar o PDF
test.describe.configure({ timeout: 120_000 });

test("baixa o painel em PDF com nome datado, da versão escolhida", async ({ browser }, info) => {
  test.slow();
  const estudo = await estudoAberto(browser, info);
  await inserirRespostas(estudo.link, [
    { versao: 1, pasta: "basico" },
    { versao: 2, pasta: "inconsistente" },
  ]);
  const pagina = estudo.pesquisador;
  await pagina.getByRole("navigation", { name: "Seções do estudo" }).getByRole("link", { name: "Resultados" }).click();
  const link = pagina.getByRole("link", { name: "Painel em PDF" });
  await expect(link).toBeVisible();

  const [download] = await Promise.all([pagina.waitForEvent("download"), link.click()]);
  expect(download.suggestedFilename()).toMatch(/^ueq_avaliacao-do-checkout-da-loja-virtual_painel_\d{4}-\d{2}-\d{2}\.pdf$/);
  const pdf = readFileSync(await download.path());
  expect(pdf.subarray(0, 5).toString()).toBe("%PDF-");
  expect(pdf.length).toBeGreaterThan(20_000);
  await estudo.fechar();
});

test("a página de impressão tem cabeçalho com título, n e data, e no papel some a navegação", async ({ browser }, info) => {
  const estudo = await estudoAberto(browser, info);
  await inserirRespostas(estudo.link, [{ versao: 1, pasta: "basico" }]);
  const pagina = estudo.pesquisador;
  const endereco = pagina.url().replace(/\?.*$/, "") + "/resultados/impressao";

  await pagina.goto(endereco);
  await expect(pagina.getByRole("heading", { level: 1, name: TITULO_ESTUDO })).toBeVisible();
  // O cabeçalho do PDF: n na análise e data de geração, cada um no seu campo
  const campo = (rotulo: string) => pagina.locator("dl div").filter({ has: pagina.locator("dt", { hasText: rotulo }) }).locator("dd");
  await expect(campo("n na análise")).toHaveText("20 participações");
  await expect(campo("Gerado em")).toHaveText(/^\d{2}\/\d{2}\/\d{4} às \d{2}:\d{2}$/);
  await verificarAcessibilidade(pagina);

  await pagina.emulateMedia({ media: "print" });
  await expect(pagina.getByRole("navigation", { name: "Principal" })).toBeHidden();
  await expect(pagina.getByRole("link", { name: "Voltar para os resultados" })).toBeHidden();
  await expect(pagina.getByRole("navigation", { name: "Ordem dos itens" })).toBeHidden();
  await expect(pagina.getByRole("heading", { level: 1, name: TITULO_ESTUDO })).toBeVisible();
  await estudo.fechar();
});

test("sem sessão o PDF não sai", async ({ browser, request }, info) => {
  const estudo = await estudoAberto(browser, info);
  const endereco = estudo.pesquisador.url().replace(/\?.*$/, "").replace(/\/estudos\//, "/api/estudos/") + "/painel-pdf";
  const resposta = await request.get(endereco, { maxRedirects: 0 });
  expect(resposta.status()).toBe(307);
  expect(resposta.headers().location).toContain("/entrar");
  await estudo.fechar();
});
