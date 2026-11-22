// Tira os prints do manual da ferramenta (docs/manual/). Roda contra a ferramenta local, com o banco de
// desenvolvimento: cria duas contas fictícias (@manual.exemplo.com), os estudos de demonstração e uma
// participação, e percorre as telas na ordem do manual. Uso: pnpm start (ou pnpm dev) e depois pnpm manual:prints
import "dotenv/config";
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { PrismaPg } from "@prisma/adapter-pg";
import { chromium, devices, type Browser, type BrowserContext, type Page } from "@playwright/test";
import { PrismaClient } from "../../src/generated/prisma/client";

const BASE = process.env.MANUAL_URL ?? "http://localhost:3000";
const PASTA = join("docs", "manual", "prints");
const DOMINIO = "manual.exemplo.com";
const SENHA = "senha-do-manual-2026";
const ANA = { nome: "Ana Ribeiro", email: `ana@${DOMINIO}` };
const BRUNO = { nome: "Bruno Costa", email: `bruno@${DOMINIO}` };
const ESTUDO_AB = "Agendamento de consultas: fluxo atual × redesenho";
const pedidos = new Set(process.argv.slice(2));

const banco = new PrismaClient({ adapter: new PrismaPg(process.env.DATABASE_URL ?? "") });
const falhas: string[] = [];

async function foto(page: Page, nome: string, opcoes: { inteira?: boolean; alvo?: string } = {}) {
  await page.waitForLoadState("networkidle").catch(() => {});
  await page.waitForTimeout(400);
  const caminho = join(PASTA, `${nome}.jpg`);
  if (opcoes.alvo) await page.locator(opcoes.alvo).first().screenshot({ path: caminho, type: "jpeg", quality: 85 });
  else await page.screenshot({ path: caminho, type: "jpeg", quality: 85, fullPage: opcoes.inteira ?? false });
  console.log("✓", nome);
}

// Rola até o elemento ficar logo abaixo da barra do topo: o cabeçalho do estudo é alto e esconderia o conteúdo
async function rolarAte(page: Page, alvo: ReturnType<Page["locator"]>) {
  await alvo.first().evaluate((elemento) => {
    elemento.scrollIntoView({ block: "start" });
    window.scrollBy(0, -110);
  });
}

async function passo(nome: string, acao: () => Promise<void>) {
  if (pedidos.size > 0 && ![...pedidos].some((pedido) => nome.startsWith(pedido))) return;
  try {
    await acao();
  } catch (erro) {
    falhas.push(nome);
    console.log("✗", nome, String((erro as Error)?.stack ?? erro).slice(0, 600));
  }
}

async function cadastrar(contexto: BrowserContext, pessoa: { nome: string; email: string }, prints = false) {
  const page = await contexto.newPage();
  await page.goto(`${BASE}/cadastrar`);
  const janela = page.getByRole("dialog", { name: "Criar conta" });
  await janela.getByLabel("Nome").fill(pessoa.nome);
  await janela.getByLabel("E-mail").fill(pessoa.email);
  await janela.getByLabel("Senha", { exact: true }).fill(SENHA);
  if (prints) await foto(page, "03-criar-conta");
  await janela.getByLabel("Senha", { exact: true }).press("Enter");
  const boasVindas = page.getByRole("dialog", { name: "Boas-vindas à Ferramenta UEQ" });
  await boasVindas.waitFor();
  if (prints) await foto(page, "04-boas-vindas");
  await boasVindas.getByRole("button", { name: "Pular tutorial" }).click();
  return page;
}

async function entrar(contexto: BrowserContext, pessoa: { email: string }) {
  const page = await contexto.newPage();
  await page.goto(`${BASE}/entrar`);
  const janela = page.getByRole("dialog", { name: "Entrar" });
  await janela.getByLabel("E-mail").fill(pessoa.email);
  await janela.getByLabel("Senha", { exact: true }).fill(SENHA);
  await janela.getByLabel("Senha", { exact: true }).press("Enter");
  await page.waitForURL((url) => !url.pathname.startsWith("/entrar"));
  return page;
}

async function idDoEstudo(titulo: string) {
  const estudo = await banco.estudo.findFirstOrThrow({ where: { titulo, pesquisador: { email: ANA.email } }, select: { id: true, slugPublico: true } });
  return estudo;
}

async function main() {
  mkdirSync(PASTA, { recursive: true });
  const navegador: Browser = await chromium.launch();
  const desktop = { viewport: { width: 1440, height: 960 }, deviceScaleFactor: 2, locale: "pt-BR" };
  const anonimo = await navegador.newContext(desktop);
  const contextoAna = await navegador.newContext(desktop);
  let ana: Page | undefined;

  // Contas do zero a cada rodada, para os prints saírem sempre iguais
  if (pedidos.size === 0) {
    await banco.pesquisador.deleteMany({ where: { email: { endsWith: `@${DOMINIO}` } } });
  }

  await passo("01-inicio", async () => {
    const page = await anonimo.newPage();
    await page.goto(BASE);
    await foto(page, "01-inicio");
    const creditos = page.getByRole("region", { name: "Créditos" });
    await creditos.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await creditos.screenshot({ path: join(PASTA, "02-creditos.jpg"), type: "jpeg", quality: 85 });
    console.log("✓ 02-creditos");
  });

  await passo("03-cadastro", async () => {
    const contextoBruno = await navegador.newContext(desktop);
    await cadastrar(contextoBruno, BRUNO);
    await contextoBruno.close();
    ana = await cadastrar(contextoAna, ANA, true);
    await banco.pesquisador.update({ where: { email: ANA.email }, data: { administrador: true } });
  });

  if (!ana) ana = await entrar(contextoAna, ANA);
  const page = ana;

  await passo("05-administracao", async () => {
    await page.goto(`${BASE}/administracao`);
    await page.goto(`${BASE}/administracao/cenarios`);
    await page.getByLabel(BRUNO.nome, { exact: false }).check();
    await foto(page, "06-cenarios");
    if ((await banco.estudo.count({ where: { titulo: ESTUDO_AB, pesquisador: { email: ANA.email } } })) === 0) {
      await page.getByRole("button", { name: "Criar os três estudos" }).click();
      await page.getByText("estudos de demonstração criados", { exact: false }).waitFor({ timeout: 90_000 });
    }
    // O resto do manual é a visão de quem pesquisa, sem o item Administração na barra
    await banco.pesquisador.update({ where: { email: ANA.email }, data: { administrador: false } });
  });

  await passo("07-estudos", async () => {
    await page.goto(`${BASE}/estudos`);
    await foto(page, "07-estudos");
  });

  await passo("08-criar-estudo", async () => {
    await page.goto(`${BASE}/estudos/novo`);
    await page.getByLabel("Título do estudo").fill("Avaliação do checkout da loja virtual");
    await page.getByLabel("Produto avaliado").fill("Checkout da loja virtual");
    await page.getByLabel("Objetivo").fill("Entender como as pessoas percebem o novo checkout da loja.");
    await page.getByLabel("Instituição").fill("PPGIa · PUCPR");
    await page.getByRole("button", { name: "Adicionar versão" }).click();
    await page.getByLabel("Versão 1").fill("Checkout atual");
    await page.getByLabel("Versão 2").fill("Checkout em uma página");
    await page.getByLabel("Coletar dados demográficos no fim do questionário").check();
    await page.evaluate(() => window.scrollTo(0, 0));
    await foto(page, "08a-criar-estudo-topo");
    await rolarAte(page, page.getByLabel("Versão 1"));
    await foto(page, "08-criar-estudo");
    await page.getByRole("main").getByRole("button", { name: "Criar estudo" }).click();
    await page.getByText("Estudo criado com sucesso", { exact: false }).waitFor();
    await foto(page, "09-estudo-rascunho");
    await page.getByRole("button", { name: "Abrir coleta" }).click();
    await page.getByText("Aberto · aceitando respostas").waitFor();
    await foto(page, "10-estudo-aberto");
    await page.getByRole("button", { name: "Compartilhar" }).click();
    const janela = page.getByRole("dialog");
    await janela.waitFor();
    await janela.getByLabel("E-mail", { exact: false }).first().fill(BRUNO.email);
    await foto(page, "11-compartilhar");
    await page.keyboard.press("Escape");
  });

  await passo("12-participante", async () => {
    const estudo = await banco.estudo.findFirstOrThrow({
      where: { titulo: "Avaliação do checkout da loja virtual", pesquisador: { email: ANA.email } },
      select: { slugPublico: true },
    });
    const participante = await anonimo.newPage();
    await participante.goto(`${BASE}/r/${estudo.slugPublico}`);
    await foto(participante, "12-termo");
    await participante.getByLabel("18 anos ou mais").check();
    await participante.getByRole("button", { name: "Concordo e quero participar" }).click();
    await participante.locator('input[name="item-1"]').first().waitFor();
    for (let numero = 1; numero <= 26; numero++) {
      await participante.locator(`input[name="item-${numero}"]`).nth((numero * 3) % 7).check();
      if (numero === 5) await foto(participante, "13-questionario");
    }
    await participante.getByRole("button", { name: "Enviar respostas" }).click();
    await participante.getByLabel("25 a 34 anos").waitFor();
    await participante.getByLabel("25 a 34 anos").check();
    await foto(participante, "14-dados-opcionais");
    await participante.getByRole("button", { name: "Continuar" }).click();
    await participante.getByRole("heading", { name: "Respostas registradas" }).waitFor();
    await foto(participante, "15-fim");

    // O mesmo questionário no celular
    const celular = await navegador.newContext({ ...devices["Pixel 7"], locale: "pt-BR" });
    const tela = await celular.newPage();
    await tela.goto(`${BASE}/r/${estudo.slugPublico}`);
    await tela.getByLabel("18 anos ou mais").check();
    await tela.getByRole("button", { name: "Concordo e quero participar" }).click();
    await tela.locator('input[name="item-1"]').first().waitFor();
    await foto(tela, "16-questionario-celular");
    await celular.close();
  });

  await passo("17-resultados", async () => {
    const { id } = await idDoEstudo(ESTUDO_AB);
    await page.goto(`${BASE}/estudos/${id}`);
    await foto(page, "17-visao-geral");
    await page.goto(`${BASE}/estudos/${id}/resultados`);
    await rolarAte(page, page.getByRole("link", { name: "Escalas do UEQ" }).or(page.getByRole("tab", { name: "Escalas do UEQ" })));
    await foto(page, "18-resultados");
    await page.locator('[data-tutorial="escalas"]').scrollIntoViewIfNeeded();
    await foto(page, "19-escalas");
    for (const [aba, nome] of [
      ["UEQ-S", "20-ueq-s"],
      ["Dados demográficos", "21-demografia"],
    ] as const) {
      const link = page.getByRole("link", { name: aba }).or(page.getByRole("tab", { name: aba })).first();
      if (await link.count()) {
        await link.click();
        await page.waitForURL(/\?|resultados\//).catch(() => {});
        await page.waitForLoadState("networkidle");
        await page.waitForTimeout(1200);
        await rolarAte(page, page.getByRole("link", { name: aba }).or(page.getByRole("tab", { name: aba })));
        await foto(page, nome);
      }
    }
    await page.goto(`${BASE}/estudos/${id}/resultados`);
    await page.locator('[data-tutorial="exportar"]').scrollIntoViewIfNeeded();
    await foto(page, "22-exportar", { alvo: '[data-tutorial="exportar"]' });
  });

  await passo("23-respostas", async () => {
    const { id } = await idDoEstudo(ESTUDO_AB);
    await page.goto(`${BASE}/estudos/${id}/respostas`);
    await rolarAte(page, page.getByText("Panorama", { exact: false }));
    await foto(page, "23-respostas");
    await page.goto(`${BASE}/estudos/${id}/respostas/importar`);
    await rolarAte(page, page.getByRole("heading", { name: "Importar respostas de um CSV" }));
    await foto(page, "24-importar");
  });

  await passo("25-notificacoes", async () => {
    await page.goto(`${BASE}/estudos`);
    await page.locator('[data-tutorial="notificacoes"]').click();
    await page.waitForTimeout(600);
    await foto(page, "25-sino");
    await page.keyboard.press("Escape");
    await page.goto(`${BASE}/notificacoes`);
    await foto(page, "26-notificacoes");
  });

  await passo("27-conta", async () => {
    await page.goto(`${BASE}/conta`);
    await foto(page, "27-conta");
    await page.getByRole("button", { name: /PT/ }).first().click();
    await page.waitForTimeout(400);
    await foto(page, "28-idioma");
    await page.keyboard.press("Escape");
  });

  await passo("29-documentacao", async () => {
    await page.goto(`${BASE}/documentacao`);
    await foto(page, "29-documentacao");
    await page.goto(`${BASE}/documentacao/requisitos`);
    await foto(page, "30-documento");
  });

  await passo("31-ajuda", async () => {
    const { id } = await idDoEstudo(ESTUDO_AB);
    await page.goto(`${BASE}/estudos/${id}/resultados`);
    await page.locator('[data-tutorial="ajuda"]').click();
    await page.getByRole("dialog").waitFor();
    await foto(page, "31-ajuda");
    await page.getByRole("dialog").getByRole("button", { name: "Rever o tour guiado" }).click();
    const boasVindas = page.getByRole("dialog", { name: "Boas-vindas à Ferramenta UEQ" });
    await boasVindas.getByRole("button", { name: "Começar o tour" }).click();
    await page.waitForURL(/\/estudos$/);
    await page.waitForTimeout(2500);
    await foto(page, "32-tour");
    await page.getByRole("button", { name: /Pular|Fechar o tutorial/ }).first().click().catch(() => {});
  });

  await navegador.close();
  await banco.$disconnect();
  if (falhas.length) {
    console.log("Falharam:", falhas.join(", "));
    process.exitCode = 1;
  }
}

void main();
