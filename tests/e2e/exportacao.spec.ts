import { readFileSync } from "node:fs";
import { expect, test, type Page } from "@playwright/test";
import { cadastrarComTeclado, emailDeTeste } from "./contas";
import { estudoAberto, inserirRespostas } from "./preparacao";

// Cada teste cria pesquisador, estudo e respostas antes de começar
test.describe.configure({ timeout: 120_000 });

const BOM = "﻿";

async function baixar(pagina: Page, nome: string) {
  const [download] = await Promise.all([pagina.waitForEvent("download"), pagina.getByRole("link", { name: nome }).click()]);
  return { nome: download.suggestedFilename(), conteudo: readFileSync(await download.path(), "utf8") };
}

test("baixa as 4 exportações com nome datado, BOM e o formato de cada uma", async ({ browser }, info) => {
  const estudo = await estudoAberto(browser, info);
  await inserirRespostas(estudo.link, [
    { versao: 1, pasta: "basico" },
    { versao: 2, pasta: "inconsistente" },
  ]);
  const pagina = estudo.pesquisador;
  await pagina.getByRole("navigation", { name: "Seções do estudo" }).getByRole("link", { name: "Resultados" }).click();
  await expect(pagina.getByRole("heading", { name: "Exportar" })).toBeVisible();

  const brutas = await baixar(pagina, "Respostas brutas (CSV)");
  expect(brutas.nome).toMatch(/^ueq_avaliacao-do-checkout-da-loja-virtual_brutas_\d{4}-\d{2}-\d{2}\.csv$/);
  expect(brutas.conteudo.startsWith(`${BOM}id_participacao;versao;concluida_em;incluida_na_analise;suspeita;`)).toBe(true);
  expect(brutas.conteudo.trimEnd().split("\r\n")).toHaveLength(1 + 35);

  const recodificadas = await baixar(pagina, "Respostas recodificadas (CSV)");
  expect(recodificadas.nome).toContain("_recodificadas_");
  expect(recodificadas.conteudo.startsWith(BOM)).toBe(true);

  const resultados = await baixar(pagina, "Resultados por escala (CSV)");
  // Todas as versões + 2 versões, 6 escalas cada, mais o cabeçalho
  expect(resultados.conteudo.trimEnd().split("\r\n")).toHaveLength(1 + 18);
  expect(resultados.conteudo).toContain("Checkout da loja virtual;Atratividade;20;0,7333;");

  // A versão 1 é a fixture basico: as 20 primeiras linhas da planilha oficial são o respostas.csv original
  const planilha = await baixar(pagina, "Formato da planilha oficial (CSV)");
  expect(planilha.conteudo.startsWith(BOM)).toBe(false);
  const basico = readFileSync("data/fixtures/basico/respostas.csv", "utf8");
  expect(planilha.conteudo.startsWith(basico)).toBe(true);
  await estudo.fechar();
});

test("sem sessão ou de outro pesquisador, a exportação não sai", async ({ browser, request }, info) => {
  const estudo = await estudoAberto(browser, info);
  await inserirRespostas(estudo.link, [{ versao: 1, pasta: "basico", limite: 2 }]);
  const endereco = estudo.pesquisador.url().replace(/\?.*$/, "").replace(/\/estudos\//, "/api/estudos/") + "/exportar/brutas";

  // Sem cookie, o proxy manda para Entrar antes de chegar na rota
  const semSessao = await request.get(endereco, { maxRedirects: 0 });
  expect(semSessao.status()).toBe(307);
  expect(semSessao.headers().location).toContain("/entrar");

  const outro = await browser.newContext();
  const outraPagina = await outro.newPage();
  await cadastrarComTeclado(outraPagina, `outro-${emailDeTeste(info)}`);
  const resposta = await outraPagina.request.get(endereco);
  expect(resposta.status()).toBe(404);

  const tipoInvalido = await estudo.pesquisador.request.get(endereco.replace("/brutas", "/xlsx"));
  expect(tipoInvalido.status()).toBe(404);
  await outro.close();
  await estudo.fechar();
});
