import { expect, test, type Page } from "@playwright/test";
import { verificarAcessibilidade } from "./acessibilidade";
import { estudoAberto } from "./preparacao";

// Cada teste cria pesquisador e estudo antes de começar
test.describe.configure({ timeout: 120_000 });

async function abrirImportacao(pagina: Page) {
  await pagina.getByRole("navigation", { name: "Seções do estudo" }).getByRole("link", { name: "Respostas" }).click();
  await pagina.getByRole("link", { name: "Importar respostas de um CSV" }).click();
  await expect(pagina).toHaveTitle(/^Importar respostas · /);
  // A subpágina mantém a aba Respostas marcada
  await expect(
    pagina.getByRole("navigation", { name: "Seções do estudo" }).getByRole("link", { name: "Respostas" }),
  ).toHaveAttribute("aria-current", "page");
}

const linha = (valor: string | number, quantos = 26) => Array(quantos).fill(valor).join(";");

test("importa a fixture basico numa versão, com prévia, e as respostas aparecem como importadas", async ({ browser }, info) => {
  test.slow();
  const estudo = await estudoAberto(browser, info);
  const pagina = estudo.pesquisador;
  await abrirImportacao(pagina);
  await verificarAcessibilidade(pagina);

  await pagina.getByLabel("Versão").selectOption({ label: "Checkout em uma página" });
  await pagina.getByLabel("Arquivo CSV").setInputFiles("data/fixtures/basico/respostas.csv");
  await pagina.getByRole("button", { name: "Ver prévia" }).click();

  const titulo = pagina.getByRole("heading", { name: "20 respostas prontas para importar" });
  await expect(titulo).toBeFocused();
  // Cabeçalho mais as 5 primeiras linhas do arquivo
  await expect(pagina.getByRole("table", { name: "Primeiras linhas do arquivo" }).getByRole("row")).toHaveCount(6);
  await verificarAcessibilidade(pagina);

  await pagina.getByRole("button", { name: "Importar 20 respostas" }).click();
  await expect(pagina).toHaveURL(/\/respostas\?importadas=20$/);
  await expect(pagina.getByRole("status")).toContainText("20 respostas importadas.");
  const importadas = pagina.getByRole("row").filter({ hasText: "importada de CSV" });
  await expect(importadas).toHaveCount(20);
  await expect(importadas.first()).toContainText("Checkout em uma página");
  await estudo.fechar();
});

test("arquivo com erro mostra o problema de cada linha e não importa nada", async ({ browser }, info) => {
  const estudo = await estudoAberto(browser, info);
  const pagina = estudo.pesquisador;
  await abrirImportacao(pagina);

  // Sem versão e sem arquivo: o resumo de erros recebe o foco e leva aos campos
  await pagina.getByRole("button", { name: "Ver prévia" }).click();
  const resumo = pagina.getByRole("alert").filter({ hasText: "Corrija 1 campo para continuar" });
  await expect(resumo).toBeFocused();
  await expect(resumo.getByRole("link", { name: /^Versão:/ })).toBeVisible();

  const conteudo = [linha(4), linha(4, 25), `${linha(4, 25)};9`, ""].join("\r\n");
  await pagina.getByLabel("Versão").selectOption({ label: "Checkout da loja virtual" });
  await pagina.getByLabel("Arquivo CSV").setInputFiles({ name: "com-erros.csv", mimeType: "text/csv", buffer: Buffer.from(conteudo) });
  await pagina.getByRole("button", { name: "Ver prévia" }).click();

  await expect(pagina.getByRole("heading", { name: "2 linhas com problema em com-erros.csv" })).toBeFocused();
  await expect(pagina.getByRole("row", { name: /^2 Tem 25 valores/ })).toBeVisible();
  await expect(pagina.getByRole("row", { name: /^3 Valores fora de 1 a 7: item 26 \("9"\)/ })).toBeVisible();
  await expect(pagina.getByRole("button", { name: /^Importar/ })).toHaveCount(0);
  await verificarAcessibilidade(pagina);

  await pagina.getByRole("button", { name: "Escolher outro arquivo" }).click();
  await expect(pagina.getByLabel("Arquivo CSV")).toBeVisible();
  await pagina.getByRole("link", { name: "Voltar para Respostas" }).click();
  await expect(pagina.getByRole("heading", { name: "Nenhuma resposta ainda." })).toBeVisible();
  await estudo.fechar();
});

test("em 320 px a prévia da importação não rola na horizontal", async ({ browser }, info) => {
  const estudo = await estudoAberto(browser, info);
  const pagina = estudo.pesquisador;
  await pagina.setViewportSize({ width: 320, height: 800 });
  await abrirImportacao(pagina);
  await pagina.getByLabel("Versão").selectOption({ label: "Checkout da loja virtual" });
  await pagina.getByLabel("Arquivo CSV").setInputFiles("data/fixtures/basico/respostas.csv");
  await pagina.getByRole("button", { name: "Ver prévia" }).click();
  await expect(pagina.getByRole("heading", { name: "20 respostas prontas para importar" })).toBeVisible();
  const rola = await pagina.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  expect(rola).toBe(false);
  await estudo.fechar();
});
