import { readFileSync } from "node:fs";
import { expect, test, type Page } from "@playwright/test";
import { strFromU8, unzipSync } from "fflate";
import { verificarAcessibilidade } from "./acessibilidade";
import { estudoAberto, inserirRespostas } from "./preparacao";

// UEQ-S (RF62): o estudo escolhe a versão curta na criação; o participante responde 8 pares; os resultados ficam na
// aba UEQ-S, com os números da planilha oficial do UEQ-S (data/fixtures-ueq-s/LEIA-ME.md). Num estudo do UEQ
// completo, a mesma aba mostra o UEQ-S calculado com os 8 pares equivalentes
test.describe.configure({ timeout: 180_000 });

const VERSAO = "Checkout da loja virtual";
const DECIMAL = new Intl.NumberFormat("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const decimal = (valor: number | null) => (valor === null ? "—" : DECIMAL.format(valor));
const ESCALAS = ["Qualidade pragmática", "Qualidade hedônica", "Geral"];
const BENCHMARK: Record<string, string> = {
  Excellent: "Excelente",
  Good: "Bom",
  "Above average": "Acima da média",
  "Below average": "Abaixo da média",
  Bad: "Ruim",
};

type Esperado = {
  escalas: {
    media: (number | null)[];
    dp: (number | null)[];
    n: number;
    icInferior: (number | null)[];
    icSuperior: (number | null)[];
    alfa: (number | null)[];
    benchmark: string[];
  };
};

const lerCsv = (caminho: string) =>
  readFileSync(caminho, "utf8")
    .split(/\r?\n/)
    .filter(Boolean)
    .map((linha) => linha.split(";").map(Number));

// A tabela "Resultados por escala" da aba UEQ-S contra o esperado.json da planilha oficial do UEQ-S
async function conferirTabela(pagina: Page, esperado: Esperado) {
  for (const [posicao, escala] of ESCALAS.entries()) {
    const celulas = pagina.getByRole("row", { name: new RegExp(`^${escala}`) }).getByRole("cell");
    const { media, dp, n, icInferior, icSuperior, alfa, benchmark } = esperado.escalas;
    await expect(celulas.nth(0)).toHaveText(String(n));
    await expect(celulas.nth(1)).toHaveText(decimal(media[posicao]!));
    await expect(celulas.nth(2)).toHaveText(decimal(dp[posicao]!));
    const ic = icInferior[posicao] === null ? "—" : `${decimal(icInferior[posicao]!)} a ${decimal(icSuperior[posicao]!)}`;
    await expect(celulas.nth(3)).toHaveText(ic);
    await expect(celulas.nth(4)).toHaveText(new RegExp(`^${decimal(alfa[posicao]!).replace(/[-]/g, "\\-")}\\*?$`));
    await expect(celulas.nth(6)).toHaveText(BENCHMARK[benchmark[posicao]!]!);
  }
}

async function linhasDaPlanilhaBaixada(pagina: Page, nome: string) {
  const [download] = await Promise.all([pagina.waitForEvent("download"), pagina.getByRole("link", { name: nome }).click()]);
  const arquivos = unzipSync(readFileSync(await download.path()));
  const linhas = [...strFromU8(arquivos["xl/worksheets/sheet2.xml"]!).matchAll(/<row r="(\d+)"[^>]*>(.*?)<\/row>/gs)]
    .filter(([, numero]) => Number(numero) >= 4)
    .map(([, , corpo]) => [...corpo!.matchAll(/<v>(\d+)<\/v>/g)].map((valor) => Number(valor[1])));
  return { linhas, nome: download.suggestedFilename(), livro: strFromU8(arquivos["xl/workbook.xml"]!) };
}

test("o formulário explica a diferença e o participante responde os 8 pares do UEQ-S", async ({ page, browser }, info) => {
  test.slow();
  const estudo = await estudoAberto(browser, info, { demografia: false, instrumento: "UEQ_S" });
  const pesquisador = estudo.pesquisador;
  await expect(pesquisador.getByText("UEQ-S, versão curta · 8 itens · 37 idiomas")).toBeVisible();

  // Termo: 8 pares e o tempo da versão curta
  await page.goto(estudo.link);
  await expect(page.getByText("em 8 pares de palavras opostas")).toBeVisible();
  await expect(page.getByText("De 1 a 2 minutos, sem limite de tempo.")).toBeVisible();
  await page.getByLabel("18 anos ou mais").check();
  await page.getByRole("button", { name: "Concordo e quero participar" }).click();

  // Os pares do UEQ-S, na ordem dele, com o termo negativo à esquerda: o 4 é Confuso → Evidente (o 21 do UEQ ao contrário)
  await expect(page.getByRole("group", { name: /^Item \d+ de 8:/ })).toHaveCount(8);
  await expect(page.locator("#item-1")).toMatchAriaSnapshot(`- 'group "Item 1 de 8: Obstrutivo ou Condutor"'`);
  await expect(page.locator("#item-4")).toMatchAriaSnapshot(`- 'group "Item 4 de 8: Confuso ou Evidente"'`);
  await expect(page.locator("#item-7")).toMatchAriaSnapshot(`- 'group "Item 7 de 8: Convencional ou Original"'`);
  await verificarAcessibilidade(page);
  // Todos no 6: pragmática e hedônica +2, sem nenhuma suspeita
  for (let numero = 1; numero <= 8; numero++) await page.locator(`input[name="item-${numero}"]`).nth(5).check();
  await expect(page.getByText("8 de 8 respondidos")).toBeVisible();
  await page.getByRole("button", { name: "Enviar respostas" }).click();
  await expect(page).toHaveTitle(/^Respostas registradas · /);

  // O link Resultados de um estudo do UEQ-S leva à aba dele
  await pesquisador.reload();
  await pesquisador.getByRole("navigation", { name: "Seções do estudo" }).getByRole("link", { name: "Resultados" }).click();
  await expect(pesquisador).toHaveURL(/\/resultados\/ueq-s$/);
  const pragmatica = pesquisador.getByRole("row", { name: /^Qualidade pragmática/ }).getByRole("cell");
  await expect(pragmatica.nth(0)).toHaveText("1");
  await expect(pragmatica.nth(1)).toHaveText("2,00");
  await expect(pesquisador.getByRole("row", { name: /^Geral/ }).getByRole("cell").nth(4)).toHaveText("—");
  await expect(pesquisador.getByRole("link", { name: "Planilha oficial do UEQ (XLSX)" })).toHaveCount(0);
  await verificarAcessibilidade(pesquisador);

  // A escolha trava depois da primeira resposta
  await pesquisador.getByRole("link", { name: "Visão geral" }).click();
  await pesquisador.getByRole("link", { name: "Editar estudo" }).first().click();
  await expect(pesquisador.getByRole("radio", { name: /^UEQ-S, versão curta/ })).toBeChecked();
  await expect(pesquisador.getByRole("radio", { name: /^UEQ completo/ })).toBeDisabled();
  await expect(pesquisador.getByText("O estudo já tem respostas, então o questionário não pode mais mudar.", { exact: false })).toBeVisible();
  await estudo.fechar();
});

// Cenários da planilha oficial do UEQ-S importados por Respostas → Importar, como no teste do UEQ completo
const CENARIOS = ["oficial-exemplo", "bordas", "variancia-zero", "negativo", "n2"];

for (const pasta of CENARIOS) {
  test(`UEQ-S, cenário ${pasta}: o painel e a planilha exportada batem com a planilha oficial do UEQ-S`, async ({ browser }, info) => {
    test.slow();
    const respostas = lerCsv(`data/fixtures-ueq-s/${pasta}/respostas.csv`);
    const esperado = JSON.parse(readFileSync(`data/fixtures-ueq-s/${pasta}/esperado.json`, "utf8")) as Esperado;
    const estudo = await estudoAberto(browser, info, { instrumento: "UEQ_S" });
    const pagina = estudo.pesquisador;

    await pagina.getByRole("navigation", { name: "Seções do estudo" }).getByRole("link", { name: "Respostas" }).click();
    await pagina.getByRole("link", { name: "Importar respostas de um CSV" }).click();
    await expect(pagina.getByText("com os 8 valores de 1 a 7 na ordem do UEQ-S", { exact: false })).toBeVisible();
    await pagina.getByLabel("Versão").selectOption({ label: VERSAO });
    await pagina.getByLabel("Arquivo CSV").setInputFiles(`data/fixtures-ueq-s/${pasta}/respostas.csv`);
    await pagina.getByRole("button", { name: "Ver prévia" }).click();
    const quantas = respostas.length === 1 ? "1 resposta" : `${respostas.length} respostas`;
    await pagina.getByRole("button", { name: `Importar ${quantas}` }).click();
    await expect(pagina.getByRole("status")).toContainText(`${quantas} importadas.`, { timeout: 60_000 });

    await pagina.getByRole("navigation", { name: "Seções do estudo" }).getByRole("link", { name: "Resultados" }).click();
    await pagina.getByLabel("Versão").selectOption({ label: `${VERSAO} (${respostas.length})` });
    await expect(pagina).toHaveURL(/ueq-s\?versao=/);
    await conferirTabela(pagina, esperado);

    const planilha = await linhasDaPlanilhaBaixada(pagina, "Planilha oficial do UEQ-S (XLSX)");
    expect(planilha.nome).toMatch(/_planilha-oficial-ueq-s_checkout-da-loja-virtual_\d{4}-\d{2}-\d{2}\.xlsx$/);
    expect(planilha.linhas).toEqual(respostas);
    expect(planilha.livro).toContain('fullCalcOnLoad="1"');
    await estudo.fechar();
  });
}

test("num estudo do UEQ completo, a aba UEQ-S usa os 8 pares equivalentes e bate com a planilha do UEQ-S", async ({ browser }, info) => {
  test.slow();
  const estudo = await estudoAberto(browser, info);
  await inserirRespostas(estudo.link, [{ versao: 1, pasta: "basico" }]);
  const pagina = estudo.pesquisador;
  await pagina.getByRole("navigation", { name: "Seções do estudo" }).getByRole("link", { name: "Resultados" }).click();
  await pagina.getByRole("navigation", { name: "Partes dos resultados" }).getByRole("link", { name: "UEQ-S" }).click();
  await expect(pagina).toHaveURL(/\/resultados\/ueq-s$/);
  await expect(pagina.getByText("O UEQ-S a partir do UEQ completo.")).toBeVisible();

  await pagina.getByLabel("Versão").selectOption({ label: `${VERSAO} (20)` });
  await conferirTabela(pagina, JSON.parse(readFileSync("data/fixtures-ueq-s/do-ueq-basico/esperado.json", "utf8")) as Esperado);
  const planilha = await linhasDaPlanilhaBaixada(pagina, "Planilha oficial do UEQ-S (XLSX)");
  expect(planilha.linhas).toEqual(lerCsv("data/fixtures-ueq-s/do-ueq-basico/respostas.csv"));
  // As respostas brutas ficam na aba do UEQ: aqui só o que é do UEQ-S
  await expect(pagina.getByRole("link", { name: "Respostas brutas (CSV)" })).toHaveCount(0);
  await expect(pagina.getByRole("link", { name: "Resultados do UEQ-S por escala (CSV)" })).toBeVisible();
  await verificarAcessibilidade(pagina);
  await estudo.fechar();
});

test("a página inicial compara o UEQ e o UEQ-S", async ({ page }) => {
  await page.goto("/#ueq-e-ueq-s");
  const secao = page.getByRole("region", { name: "UEQ ou UEQ-S" });
  await expect(secao.getByRole("row", { name: /^Pares de palavras/ })).toContainText("8, tirados dos 26");
  await expect(secao.getByRole("row", { name: /^Tempo para responder/ })).toContainText("De 1 a 2 minutos");
  await expect(secao.getByRole("listitem")).toHaveCount(8);
  await expect(secao.getByText("Item 4: de Confuso a Evidente")).toBeAttached();
  await verificarAcessibilidade(page);
});

// WCAG 2.2 AA nas telas novas: reflow em 320 px (1.4.10), escolha só com teclado (2.1.1) com o foco visível
// (2.4.7), alto contraste e o axe em cada estado
test("AA: em 320 px nada rola na horizontal, e a escolha do questionário funciona só com o teclado", async ({ browser }, info) => {
  test.slow();
  const estudo = await estudoAberto(browser, info, { instrumento: "UEQ_S" });
  const pagina = estudo.pesquisador;
  const semRolagem = async () =>
    expect(await pagina.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);

  // Teclado: as setas trocam a opção dentro do grupo de rádios, e o foco fica visível no cartão
  await pagina.goto("/estudos/novo");
  const completo = pagina.getByRole("radio", { name: /^UEQ completo/ });
  await completo.focus();
  await pagina.keyboard.press("ArrowDown");
  const curto = pagina.getByRole("radio", { name: /^UEQ-S, versão curta/ });
  await expect(curto).toBeChecked();
  await expect(curto).toBeFocused();
  const contorno = await pagina.evaluate(() => getComputedStyle(document.activeElement!.closest("label")!).outlineStyle);
  expect(contorno).not.toBe("none");
  // Leitor de tela: o rádio se chama só pelo nome do questionário, e o resto do cartão é a descrição
  await expect(curto).toHaveAccessibleName("UEQ-S, versão curta");
  await expect(curto).toHaveAccessibleDescription(/^8 pares de palavras · de 1 a 2 minutos Mede só a qualidade pragmática/);
  await expect(pagina.getByRole("group", { name: "Questionário do estudo" })).toBeVisible();

  await pagina.setViewportSize({ width: 320, height: 640 });
  await semRolagem();
  await pagina.emulateMedia({ forcedColors: "active" });
  await verificarAcessibilidade(pagina);
  await pagina.emulateMedia({ forcedColors: "none" });

  await inserirRespostasUeqS(estudo.link);
  await pagina.goto(`${new URL(pagina.url()).origin}/estudos`);
  await pagina.getByRole("link", { name: "Avaliação do checkout da loja virtual" }).first().click();
  await pagina.getByRole("navigation", { name: "Seções do estudo" }).getByRole("link", { name: "Resultados" }).click();
  await expect(pagina).toHaveURL(/\/resultados\/ueq-s$/);
  await semRolagem();
  await pagina.getByRole("link", { name: "Comparar versões" }).click();
  await expect(pagina.getByRole("heading", { name: "Escalas por versão" })).toBeVisible();
  await semRolagem();
  await verificarAcessibilidade(pagina);

  // Editar com respostas: o grupo fica desligado, e o motivo está escrito ao lado
  await pagina.getByRole("navigation", { name: "Seções do estudo" }).getByRole("link", { name: "Visão geral" }).click();
  await pagina.getByRole("link", { name: "Editar estudo" }).first().click();
  await expect(pagina.getByRole("radio", { name: /^UEQ completo/ })).toBeDisabled();
  await expect(pagina.getByRole("radio", { name: /^UEQ-S, versão curta/ })).toBeDisabled();
  await semRolagem();
  await verificarAcessibilidade(pagina);

  await pagina.goto("/#ueq-e-ueq-s");
  await semRolagem();
  await estudo.fechar();
});

// Algumas respostas do UEQ-S gravadas direto no banco, nas duas versões, como o envio pelo link grava
async function inserirRespostasUeqS(link: string) {
  const respostas = lerCsv("data/fixtures-ueq-s/oficial-exemplo/respostas.csv").slice(0, 6);
  const slug = link.split("/r/")[1] ?? "";
  const { PrismaPg } = await import("@prisma/adapter-pg");
  const { PrismaClient } = await import("../../src/generated/prisma/client");
  const banco = new PrismaClient({ adapter: new PrismaPg(process.env.DATABASE_URL ?? "") });
  const estudo = await banco.estudo.findUniqueOrThrow({ where: { slugPublico: slug }, include: { versoes: { orderBy: { ordem: "asc" } } } });
  const itens = await banco.item.findMany();
  const id = new Map(itens.map((item) => [item.numero, item.id]));
  // Ordem do UEQ-S → item do UEQ; os itens 4 e 7 têm os lados trocados (data/fixtures-ueq-s/LEIA-ME.md)
  const NO_UEQ = [11, 13, 20, 21, 6, 7, 10, 15];
  for (const [posicao, valores] of respostas.entries()) {
    await banco.participacao.create({
      data: {
        versaoId: estudo.versoes[posicao % 2]!.id,
        consentiuEm: new Date(),
        concluidaEm: new Date(),
        respostas: {
          create: valores.map((valor, i) => ({ itemId: id.get(NO_UEQ[i]!)!, valor: i === 3 || i === 6 ? 8 - valor : valor })),
        },
      },
    });
  }
  await banco.$disconnect();
}

// data/ueq-s-idiomas.json: em croata a lista oficial do UEQ-S (UEQS_Items.pdf) usa outras palavras que o UEQ completo
test("em croata, o questionário do UEQ-S mostra os pares da lista oficial do UEQ-S", async ({ page, browser }, info) => {
  const estudo = await estudoAberto(browser, info, { demografia: false, instrumento: "UEQ_S", idioma: "hr" });
  await page.goto(estudo.link);
  await page.locator('input[name="idade"][value="maior"]').check();
  await page.locator('form:has(input[name="idade"]) button[type="submit"]').click();
  await expect(page).toHaveURL(/\/questionario$/);
  await expect(page.locator("#item-7")).toContainText("konvencionalna");
  await expect(page.locator("#item-7")).toContainText("inventivna");
  await expect(page.locator("#item-8")).toContainText("predvodnička");
  await expect(page.getByRole("group", { name: /konvencionalna/ })).toHaveCount(1);
  await verificarAcessibilidade(page);
  await estudo.fechar();
});
