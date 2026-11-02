import { expect, test, type Page } from "@playwright/test";
import { verificarAcessibilidade } from "./acessibilidade";
import { estudoAberto, inserirRespostas } from "./preparacao";

// Cada teste cria pesquisador, estudo e respostas antes de começar: com a suíte inteira no servidor de
// desenvolvimento, 60 s não bastam
test.describe.configure({ timeout: 120_000 });

async function abrirResultados(pesquisador: Page) {
  await pesquisador.getByRole("navigation", { name: "Seções do estudo" }).getByRole("link", { name: "Resultados" }).click();
  await expect(pesquisador.getByRole("heading", { name: "Leitura rápida" })).toBeVisible();
}

test("mostra os números do módulo UEQ e guarda versão e modo na URL", async ({ browser }, info) => {
  test.slow();
  const estudo = await estudoAberto(browser, info);
  await inserirRespostas(estudo.link, [
    { versao: 1, pasta: "basico" },
    { versao: 2, pasta: "inconsistente" },
  ]);
  const pagina = estudo.pesquisador;
  await abrirResultados(pagina);
  await verificarAcessibilidade(pagina);

  // Versão 1 = fixture basico: os mesmos números que analisarEstudo devolveu no prompt 02
  await pagina.getByLabel("Versão").focus();
  await pagina.getByLabel("Versão").selectOption({ label: "Checkout da loja virtual (20)" });
  await expect(pagina).toHaveURL(/versao=/);
  await expect(pagina.getByLabel("Versão")).toBeFocused();
  const atratividade = pagina.getByRole("row", { name: /^Atratividade/ });
  await expect(atratividade).toContainText("0,73");
  await expect(atratividade).toContainText("0,33 a 1,14");
  await expect(atratividade).toContainText("0,92");
  await expect(pagina.getByRole("img", { name: /Atratividade: média 0,73, IC de 0,33 a 1,14, neutra/ })).toBeVisible();

  await pagina.reload();
  await expect(pagina.getByLabel("Versão")).toHaveValue(/.+/);
  await expect(atratividade).toContainText("0,73");

  await pagina.getByRole("link", { name: "Agrupado por escala" }).click();
  await expect(pagina).toHaveURL(/itens=escala/);
  await expect(pagina.getByRole("heading", { level: 3, name: "Perspicuidade" })).toBeVisible();

  await pagina.getByRole("link", { name: "Comparar versões" }).click();
  await expect(pagina).toHaveURL(/modo=comparar/);
  await expect(pagina.getByRole("list", { name: "Legenda das versões" })).toContainText("círculo vazado · n = 15");
  await expect(pagina.getByRole("heading", { name: "Médias por versão" })).toBeVisible();
  // A troca de modo mantém a rolagem; lá embaixo, as abas do estudo ficam atrás da barra fixa e o axe
  // as conta como alvos encobertos. A checagem vale para a página do topo
  await pagina.evaluate(() => window.scrollTo(0, 0));
  await verificarAcessibilidade(pagina);

  await pagina.goBack();
  await expect(pagina).not.toHaveURL(/modo=comparar/);
  await estudo.fechar();
});

test("com uma resposta só avisa que não há intervalo de confiança", async ({ browser }, info) => {
  const estudo = await estudoAberto(browser, info);
  await inserirRespostas(estudo.link, [{ versao: 1, pasta: "basico", limite: 1 }]);
  await abrirResultados(estudo.pesquisador);
  await expect(estudo.pesquisador.getByText("Amostra insuficiente para intervalo de confiança.")).toBeVisible();
  await expect(estudo.pesquisador.getByRole("img", { name: /Atratividade: média .*, sem intervalo de confiança/ })).toBeVisible();
  await estudo.fechar();
});

test("em 320 px o painel não rola na horizontal, nos dois modos", async ({ browser }, info) => {
  const estudo = await estudoAberto(browser, info);
  await inserirRespostas(estudo.link, [
    { versao: 1, pasta: "basico", limite: 5 },
    { versao: 2, pasta: "basico", limite: 5 },
  ]);
  const pagina = estudo.pesquisador;
  await pagina.setViewportSize({ width: 320, height: 640 });
  await abrirResultados(pagina);
  const semRolagem = async () =>
    expect(await pagina.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
  await semRolagem();
  await pagina.getByRole("link", { name: "Comparar versões" }).click();
  await expect(pagina.getByRole("heading", { name: "Escalas por versão" })).toBeVisible();
  await semRolagem();
  await estudo.fechar();
});

test("gráficos com daltonismo simulado e alto contraste", async ({ browser }, info) => {
  test.slow();
  const estudo = await estudoAberto(browser, info);
  await inserirRespostas(estudo.link, [
    { versao: 1, pasta: "basico", limite: 8 },
    { versao: 2, pasta: "inconsistente", limite: 8 },
  ]);
  const pagina = estudo.pesquisador;
  await abrirResultados(pagina);
  await pagina.getByRole("link", { name: "Comparar versões" }).click();
  const grafico = pagina.getByRole("img", { name: /^Médias por escala/ });
  await expect(grafico).toBeVisible();

  // docs/ihc.md §4.3: as versões se distinguem pela forma; as capturas ficam no relatório do teste para conferência
  const cdp = await pagina.context().newCDPSession(pagina);
  for (const tipo of ["protanopia", "deuteranopia", "achromatopsia"] as const) {
    await cdp.send("Emulation.setEmulatedVisionDeficiency", { type: tipo });
    await info.attach(`comparacao-${tipo}`, { body: await grafico.screenshot(), contentType: "image/png" });
  }
  await cdp.send("Emulation.setEmulatedVisionDeficiency", { type: "none" });
  await expect(pagina.getByRole("list", { name: "Legenda das versões" })).toContainText("círculo cheio");

  await pagina.emulateMedia({ forcedColors: "active" });
  await info.attach("comparacao-alto-contraste", { body: await grafico.screenshot(), contentType: "image/png" });
  await verificarAcessibilidade(pagina);
  await estudo.fechar();
});
