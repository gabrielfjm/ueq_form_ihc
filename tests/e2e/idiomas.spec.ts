import { readFileSync } from "node:fs";
import { expect, test, type Page } from "@playwright/test";
import { verificarAcessibilidade } from "./acessibilidade";
import { estudoAberto } from "./preparacao";

// Cada teste cria pesquisador, estudo e uma participação inteira antes de conferir
test.describe.configure({ timeout: 120_000 });

async function responderTudo(page: Page) {
  for (let numero = 1; numero <= 26; numero++) {
    await page.locator(`input[name="item-${numero}"]`).nth((numero * 3) % 7).check();
  }
}

test("em espanhol pelo navegador: o link inteiro sai no idioma e o pesquisador vê o idioma", async ({ browser }, info) => {
  test.slow();
  const estudo = await estudoAberto(browser, info);
  const contexto = await browser.newContext({ locale: "es-ES" });
  const page = await contexto.newPage();

  await page.goto(estudo.link);
  await expect(page.locator("html")).toHaveAttribute("lang", "es");
  await expect(page).toHaveTitle(/^Consentimiento · /);
  await expect(page.getByLabel("Idioma")).toHaveValue("es");
  await expect(page.getByRole("heading", { name: "Consentimiento informado" })).toBeVisible();
  await verificarAcessibilidade(page);

  await page.getByRole("button", { name: "Acepto y quiero participar" }).click();
  await expect(page).toHaveTitle(/^Cuestionario · /);
  await expect(page.getByText("Etapa 2 de 3 · Cuestionario")).toBeVisible();
  // Instrução e termos oficiais em espanhol (data/ueq-instrucoes.json e data/ueq-idiomas.json)
  await expect(page.getByText("Por favor realice su evaluación ahora.")).toBeVisible();
  await expect(page.getByRole("group", { name: "Ítem 1 de 26: desagradable o agradable" })).toBeVisible();
  await expect(page.getByRole("radio", { name: "1 de 7, más cerca de desagradable" })).toHaveCount(1);
  await verificarAcessibilidade(page);

  // Envio incompleto: o resumo e o plural também vêm em espanhol
  await page.getByRole("button", { name: "Enviar respuestas" }).click();
  await expect(page.getByRole("heading", { name: /^Faltan 26 ítems: 1, 2, 3/ })).toBeVisible();
  await responderTudo(page);
  await expect(page.getByText("26 de 26 respondidos")).toBeVisible();
  await page.getByRole("button", { name: "Enviar respuestas" }).click();

  await expect(page).toHaveTitle(/^Datos opcionales · /);
  await page.getByRole("group", { name: "Edad" }).getByLabel("De 25 a 34 años").check();
  await page.getByRole("button", { name: "Continuar" }).click();
  await expect(page.getByRole("heading", { name: "Respuestas registradas" })).toBeVisible();
  await contexto.close();

  const pesquisador = estudo.pesquisador;
  const secoes = pesquisador.getByRole("navigation", { name: "Seções do estudo" });
  await secoes.getByRole("link", { name: "Respostas" }).click();
  const linha = pesquisador.getByRole("row").filter({ hasText: "Espanhol" });
  await expect(linha).toHaveCount(1);
  await expect(linha).not.toContainText("tradução não aprovada");

  // A exportação guarda o código do idioma e a demografia na categoria em português, como antes
  await secoes.getByRole("link", { name: "Resultados" }).click();
  const [download] = await Promise.all([
    pesquisador.waitForEvent("download"),
    pesquisador.getByRole("link", { name: "Respostas brutas (CSV)" }).click(),
  ]);
  const [cabecalho, primeira] = readFileSync(await download.path(), "utf8").slice(1).split("\r\n");
  expect(cabecalho).toContain(";suspeita;origem;idioma;traducao_aprovada;faixa_etaria;");
  expect(primeira).toMatch(/;link;es;sim;25 a 34 anos;/);
  await estudo.fechar();
});

test("em árabe pelo seletor: página da direita para a esquerda, escala na ordem oficial", async ({ page, browser }, info) => {
  test.slow();
  const estudo = await estudoAberto(browser, info);

  await page.goto(estudo.link);
  await expect(page.locator("html")).toHaveAttribute("lang", "pt-BR");
  // Escolher no seletor não muda nada sozinho (WCAG 3.2.2): só o botão aplica
  await page.getByLabel("Idioma").selectOption("ar");
  await expect(page.locator("html")).toHaveAttribute("lang", "pt-BR");
  await page.getByRole("button", { name: "Aplicar" }).click();
  await expect(page.locator("html")).toHaveAttribute("lang", "ar");
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await expect(page.getByText("لم يعتمد مؤلفو UEQ بعدُ ترجمة الاستبيان")).toBeVisible();
  await verificarAcessibilidade(page);

  await page.getByRole("button", { name: "أوافق وأرغب في المشاركة" }).click();
  await expect(page).toHaveURL(/\/questionario$/);
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await expect(page.getByRole("group", { name: "البند 1 من 26: مزعج أو ممتع" })).toBeVisible();

  // Como no PDF oficial em árabe: o termo da esquerda continua à esquerda, e o 1 vem antes do 7.
  // No celular os termos ficam acima dos círculos, então compara-se o centro de cada um
  const item = page.locator("#item-1");
  const centro = async (alvo: ReturnType<Page["locator"]>) => {
    const caixa = (await alvo.boundingBox())!;
    return caixa.x + caixa.width / 2;
  };
  const esquerda = await centro(item.getByText("مزعج", { exact: true }));
  const um = await centro(item.locator('input[value="1"]'));
  const sete = await centro(item.locator('input[value="7"]'));
  const direita = await centro(item.getByText("ممتع", { exact: true }));
  expect(esquerda).toBeLessThan(direita);
  expect(um).toBeLessThan(sete);
  expect(esquerda).toBeLessThan(sete);
  expect(um).toBeLessThan(direita);
  // E o termo da esquerda começa colado à esquerda, não no meio da linha (alinhamento físico, não "start")
  // Mede o texto, não o span: o span ocupa a célula inteira da grade, qualquer que seja o alinhamento
  const inicioEsquerda = await item.getByText("مزعج", { exact: true }).evaluate((elemento) => {
    const trecho = document.createRange();
    trecho.selectNodeContents(elemento);
    return trecho.getBoundingClientRect().x;
  });
  expect(inicioEsquerda).toBeLessThanOrEqual((await item.locator('input[value="1"]').boundingBox())!.x);
  await verificarAcessibilidade(page);

  await responderTudo(page);
  await page.getByRole("button", { name: "إرسال الإجابات" }).click();
  await page.getByRole("button", { name: "تخطي هذه المرحلة" }).click();
  await expect(page.getByRole("heading", { name: "تم تسجيل الإجابات" })).toBeVisible();

  const pesquisador = estudo.pesquisador;
  await pesquisador.getByRole("navigation", { name: "Seções do estudo" }).getByRole("link", { name: "Respostas" }).click();
  await expect(pesquisador.getByRole("row").filter({ hasText: "Árabe" })).toContainText("tradução não aprovada");
  await estudo.fechar();
});
