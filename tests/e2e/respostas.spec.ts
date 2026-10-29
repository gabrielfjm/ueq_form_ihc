import { expect, test, type Page } from "@playwright/test";
import { verificarAcessibilidade } from "./acessibilidade";
import { estudoAberto, inserirRespostas } from "./preparacao";

// Cada teste cria pesquisador, estudo e respostas antes de começar
test.describe.configure({ timeout: 120_000 });

async function abrirAba(pagina: Page, aba: "Respostas" | "Resultados") {
  await pagina.getByRole("navigation", { name: "Seções do estudo" }).getByRole("link", { name: aba }).click();
  await expect(pagina).toHaveTitle(new RegExp(`^${aba} · `));
}

test("a fixture inconsistente sai com as 4 suspeitas da equipe e dá para tirá-las da análise", async ({ browser }, info) => {
  const estudo = await estudoAberto(browser, info);
  await inserirRespostas(estudo.link, [{ versao: 1, pasta: "inconsistente" }]);
  const pagina = estudo.pesquisador;
  await abrirAba(pagina, "Respostas");
  await verificarAcessibilidade(pagina);

  // data/fixtures/inconsistente/LEIA-ME.md: linhas 1, 6, 9 e 13 são suspeitas, por amplitude
  await pagina.getByLabel("Mostrar só suspeitas").check();
  await expect(pagina).toHaveURL(/suspeitas=1/);
  await expect(pagina.getByText("Mostrando 4 de 15.")).toBeVisible();
  await expect(pagina.locator("tbody td", { hasText: /^Suspeita/ })).toHaveCount(4);
  await expect(pagina.locator("tbody").getByText("amplitude", { exact: true })).toHaveCount(4);

  await pagina.getByRole("button", { name: "Tirar suspeitas da análise" }).click();
  await expect(pagina.getByRole("status").first()).toHaveText(
    "4 participações suspeitas saíram da análise. Nada foi apagado: marque “Na análise” para incluir de novo.",
  );
  await expect(pagina.getByRole("img", { name: "15 participações: 11 na análise e 4 fora da análise." })).toBeVisible();

  // docs/ihc.md §4.3: o painel mostra quantas estão fora e leva de volta para cá
  await abrirAba(pagina, "Resultados");
  await expect(pagina.getByText("4 participações fora da análise.")).toBeVisible();
  await expect(pagina.getByText(/11 participações na análise/)).toBeVisible();
  await pagina.getByRole("link", { name: "Ver respostas" }).click();
  await expect(pagina).toHaveTitle(/^Respostas · /);
  await estudo.fechar();
});

test("incluir e excluir uma participação avisa e nunca apaga", async ({ browser }, info) => {
  const estudo = await estudoAberto(browser, info);
  await inserirRespostas(estudo.link, [{ versao: 1, pasta: "basico", limite: 3 }]);
  const pagina = estudo.pesquisador;
  await abrirAba(pagina, "Respostas");

  const caixa = pagina.getByRole("checkbox", { name: /^Participação de .* na análise$/ }).first();
  await expect(caixa).toBeChecked();
  await caixa.uncheck();
  await expect(pagina.getByRole("status").first()).toContainText("saiu da análise. Nada foi apagado");
  await expect(pagina.getByText("3 respostas · 2 na análise")).toBeVisible();

  await caixa.check();
  await expect(pagina.getByRole("status").first()).toContainText("voltou para a análise.");
  await expect(pagina.getByText("3 respostas · 3 na análise")).toBeVisible();
  await estudo.fechar();
});

test("ver escalas mostra a amplitude de cada escala e destaca as inconsistentes", async ({ browser }, info) => {
  const estudo = await estudoAberto(browser, info);
  await inserirRespostas(estudo.link, [{ versao: 1, pasta: "inconsistente", limite: 1 }]);
  const pagina = estudo.pesquisador;
  await abrirAba(pagina, "Respostas");

  const ver = pagina.getByRole("button", { name: /^Ver escalas da participação/ });
  await expect(ver).toHaveAttribute("aria-expanded", "false");
  await ver.click();
  const ocultar = pagina.getByRole("button", { name: /^Ocultar escalas da participação/ });
  await expect(ocultar).toHaveAttribute("aria-expanded", "true");
  const escalas = pagina.getByRole("list", { name: /^Amplitude por escala/ });
  await expect(escalas.getByRole("listitem")).toHaveCount(6);
  // linha 1 da fixture: inconsistente nas 6 escalas
  await expect(escalas.getByText("inconsistente", { exact: true })).toHaveCount(6);
  await verificarAcessibilidade(pagina);
  await estudo.fechar();
});

test("em 320 px a página de respostas não rola na horizontal", async ({ browser }, info) => {
  const estudo = await estudoAberto(browser, info);
  await inserirRespostas(estudo.link, [{ versao: 1, pasta: "inconsistente", limite: 3 }]);
  const pagina = estudo.pesquisador;
  await pagina.setViewportSize({ width: 320, height: 640 });
  await abrirAba(pagina, "Respostas");
  expect(await pagina.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
  await estudo.fechar();
});
