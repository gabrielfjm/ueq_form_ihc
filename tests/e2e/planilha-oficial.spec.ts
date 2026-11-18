import { readFileSync } from "node:fs";
import { expect, test, type Page } from "@playwright/test";
import { strFromU8, unzipSync } from "fflate";
import { estudoAberto } from "./preparacao";

// Cenários de validação contra a UEQ Data Analysis Tool V15 (data/fixtures/LEIA-ME.md). Cada um passa pelo
// caminho de quem usa a ferramenta: importa o respostas.csv por Respostas → Importar, abre o painel da versão e
// confere a tabela com o esperado.json, que saiu da planilha oficial recalculada no Excel. Depois baixa a
// planilha oficial preenchida e confere que ela leva as mesmas respostas, na mesma ordem, em Data!A4
test.describe.configure({ timeout: 180_000 });

const VERSAO = "Checkout da loja virtual";
const DECIMAL = new Intl.NumberFormat("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const decimal = (valor: number | null) => (valor === null ? "—" : DECIMAL.format(valor));
const ESCALAS = ["Atratividade", "Perspicuidade", "Eficiência", "Confiabilidade", "Estimulação", "Novidade"];
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

async function importar(pagina: Page, pasta: string, quantas: number) {
  await pagina.getByRole("navigation", { name: "Seções do estudo" }).getByRole("link", { name: "Respostas" }).click();
  await pagina.getByRole("link", { name: "Importar respostas de um CSV" }).click();
  await pagina.getByLabel("Versão").selectOption({ label: VERSAO });
  await pagina.getByLabel("Arquivo CSV").setInputFiles(`data/fixtures/${pasta}/respostas.csv`);
  await pagina.getByRole("button", { name: "Ver prévia" }).click();
  const respostas = quantas === 1 ? "1 resposta" : `${quantas} respostas`;
  await pagina.getByRole("button", { name: `Importar ${respostas}` }).click();
  // As 1000 linhas do cenário grande passam dos 15 s padrão com a suíte inteira no servidor de desenvolvimento
  await expect(pagina.getByRole("status")).toContainText(`${respostas} ${quantas === 1 ? "importada" : "importadas"}.`, {
    timeout: 60_000,
  });
}

const CENARIOS = ["oficial-exemplo", "grande", "inconsistente", "bordas", "variancia-zero", "negativo", "extremos/n2"];

for (const pasta of CENARIOS) {
  test(`cenário ${pasta}: o painel e a planilha exportada batem com a planilha oficial`, async ({ browser }, info) => {
    test.slow();
    const respostas = readFileSync(`data/fixtures/${pasta}/respostas.csv`, "utf8")
      .split(/\r?\n/)
      .filter(Boolean)
      .map((linha) => linha.split(";").map(Number));
    const esperado = JSON.parse(readFileSync(`data/fixtures/${pasta}/esperado.json`, "utf8")) as Esperado;
    const estudo = await estudoAberto(browser, info);
    const pagina = estudo.pesquisador;
    await importar(pagina, pasta, respostas.length);

    // Todas as importadas ficam na análise, como na planilha, que não exclui ninguém sozinha
    await pagina.getByRole("navigation", { name: "Seções do estudo" }).getByRole("link", { name: "Resultados" }).click();
    await pagina.getByLabel("Versão").selectOption({ label: `${VERSAO} (${respostas.length})` });
    await expect(pagina).toHaveURL(/versao=/);

    for (const [posicao, escala] of ESCALAS.entries()) {
      const celulas = pagina.getByRole("row", { name: new RegExp(`^${escala}`) }).getByRole("cell");
      const { media, dp, n, icInferior, icSuperior, alfa, benchmark } = esperado.escalas;
      await expect(celulas.nth(0)).toHaveText(String(n));
      await expect(celulas.nth(1)).toHaveText(decimal(media[posicao]!));
      await expect(celulas.nth(2)).toHaveText(decimal(dp[posicao]!));
      const ic = icInferior[posicao] === null ? "—" : `${decimal(icInferior[posicao]!)} a ${decimal(icSuperior[posicao]!)}`;
      await expect(celulas.nth(3)).toHaveText(ic);
      // O asterisco marca alfa abaixo de 0,7
      await expect(celulas.nth(4)).toHaveText(new RegExp(`^${decimal(alfa[posicao]!).replace(/[-]/g, "\\-")}\\*?$`));
      await expect(celulas.nth(6)).toHaveText(BENCHMARK[benchmark[posicao]!]!);
    }

    const [download] = await Promise.all([
      pagina.waitForEvent("download"),
      pagina.getByRole("link", { name: "Planilha oficial do UEQ (XLSX)" }).click(),
    ]);
    expect(download.suggestedFilename()).toMatch(/^ueq_avaliacao-do-checkout-da-loja-virtual_planilha-oficial_checkout-da-loja-virtual_\d{4}-\d{2}-\d{2}\.xlsx$/);
    const arquivos = unzipSync(readFileSync(await download.path()));
    const dados = strFromU8(arquivos["xl/worksheets/sheet2.xml"]!);
    const linhas = [...dados.matchAll(/<row r="(\d+)"[^>]*>(.*?)<\/row>/gs)]
      .filter(([, numero]) => Number(numero) >= 4)
      .map(([, , corpo]) => [...corpo!.matchAll(/<v>(\d+)<\/v>/g)].map((valor) => Number(valor[1])));
    expect(linhas).toEqual(respostas);
    expect(strFromU8(arquivos["xl/workbook.xml"]!)).toContain('fullCalcOnLoad="1"');
    await estudo.fechar();
  });
}
