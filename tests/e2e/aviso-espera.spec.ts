import { expect, test, type Page, type Request } from "@playwright/test";
import { estudoAberto, inserirRespostas } from "./preparacao";

// Cada teste cria pesquisador e estudo antes de começar
test.describe.configure({ timeout: 120_000 });

// Segura as requisições escolhidas por um tempo, para a espera passar do atraso do aviso (300 ms)
async function atrasar(pagina: Page, escolher: (pedido: Request) => boolean, ms = 2_000) {
  await pagina.route("**/*", async (rota) => {
    if (escolher(rota.request())) await new Promise((fim) => setTimeout(fim, ms));
    await rota.fallback();
  });
}

test("download demorado mostra o aviso até o arquivo chegar, com o mesmo nome", async ({ browser }, info) => {
  const estudo = await estudoAberto(browser, info);
  await inserirRespostas(estudo.link, [{ versao: 1, pasta: "basico" }]);
  const pagina = estudo.pesquisador;
  await pagina.getByRole("navigation", { name: "Seções do estudo" }).getByRole("link", { name: "Resultados" }).click();
  await expect(pagina.getByRole("heading", { name: "Exportar" })).toBeVisible();

  await atrasar(pagina, (pedido) => pedido.url().includes("/exportar/"));
  const aviso = pagina.locator("[data-aviso-espera]").filter({ hasText: "Preparando o arquivo…" });
  const [download] = await Promise.all([
    pagina.waitForEvent("download"),
    (async () => {
      await pagina.getByRole("link", { name: "Planilha oficial do UEQ (XLSX)" }).click();
      await expect(aviso).toBeVisible();
      await expect(aviso).toContainText("O download começa sozinho assim que o arquivo ficar pronto.");
    })(),
  ]);
  expect(download.suggestedFilename()).toMatch(/^ueq_avaliacao-do-checkout-da-loja-virtual_planilha-oficial_\d{4}-\d{2}-\d{2}\.xlsx$/);
  await expect(aviso).toBeHidden();
  await estudo.fechar();
});

test("download que falha avisa numa janela que fecha", async ({ browser }, info) => {
  const estudo = await estudoAberto(browser, info);
  await inserirRespostas(estudo.link, [{ versao: 1, pasta: "basico" }]);
  const pagina = estudo.pesquisador;
  await pagina.getByRole("navigation", { name: "Seções do estudo" }).getByRole("link", { name: "Resultados" }).click();
  await expect(pagina.getByRole("heading", { name: "Exportar" })).toBeVisible();

  await pagina.route("**/exportar/brutas", (rota) => rota.fulfill({ status: 500, body: "erro" }));
  await pagina.getByRole("link", { name: "Respostas brutas (CSV)" }).click();
  const erro = pagina.getByRole("alertdialog", { name: "Não foi possível baixar o arquivo." });
  await expect(erro).toBeVisible();
  await expect(erro).toContainText("Verifique a conexão e tente de novo.");
  await erro.getByRole("button", { name: "Fechar" }).click();
  await expect(erro).toBeHidden();
  await estudo.fechar();
});

test("página que demora a carregar mostra o aviso até abrir", async ({ browser }, info) => {
  const estudo = await estudoAberto(browser, info);
  const pagina = estudo.pesquisador;
  // As requisições do Next para montar a próxima página levam o cabeçalho RSC
  await atrasar(pagina, (pedido) => pedido.headers()["rsc"] === "1");
  await pagina.getByRole("navigation", { name: "Seções do estudo" }).getByRole("link", { name: "Respostas" }).click();
  const aviso = pagina.locator("[data-aviso-espera]").filter({ hasText: "Carregando a página…" });
  await expect(aviso).toBeVisible();
  await expect(pagina).toHaveURL(/\/respostas$/, { timeout: 30_000 });
  await expect(aviso).toBeHidden();
  await estudo.fechar();
});

test("formulário que demora repete no aviso o que o botão diz", async ({ browser }, info) => {
  const estudo = await estudoAberto(browser, info);
  const pagina = estudo.pesquisador;
  await pagina.goto(new URL("/conta/dados", pagina.url()).toString());
  await expect(pagina.getByRole("button", { name: "Salvar alterações" })).toBeVisible();

  // A ação do servidor vai num POST com o cabeçalho Next-Action
  await atrasar(pagina, (pedido) => pedido.method() === "POST" && "next-action" in pedido.headers());
  await pagina.getByRole("button", { name: "Salvar alterações" }).click();
  const aviso = pagina.locator("[data-aviso-espera]").filter({ hasText: "Salvando…" });
  await expect(aviso).toBeVisible();
  await expect(aviso).toContainText("Aguarde um instante. Não feche nem atualize a página.");
  await expect(aviso).toBeHidden({ timeout: 30_000 });
  await estudo.fechar();
});
