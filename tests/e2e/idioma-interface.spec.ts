import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { expect, test } from "@playwright/test";
import { PrismaClient } from "../../src/generated/prisma/client";
import { chaveDoTexto } from "../../src/traducao/nucleo";
import { verificarAcessibilidade } from "./acessibilidade";
import { abrirMenu, cadastrarComTeclado, emailDeTeste, janelaDeAcesso, pularTutorial, SENHA } from "./contas";

// Sem ANTHROPIC_API_KEY nos testes: uma tradução é gravada direto no banco, como a API gravaria
const banco = new PrismaClient({ adapter: new PrismaPg(process.env.DATABASE_URL ?? "") });
const MINHA_CONTA = { idioma: "de", hashOrigem: chaveDoTexto("Minha conta"), texto: "Mein Konto" };

test.beforeAll(async () => {
  await banco.traducao.upsert({
    where: { idioma_hashOrigem: { idioma: MINHA_CONTA.idioma, hashOrigem: MINHA_CONTA.hashOrigem } },
    create: MINHA_CONTA,
    update: { texto: MINHA_CONTA.texto },
  });
});

// A tradução fica no banco: é a mesma que a API gravaria, e o outro projeto (celular) roda em paralelo
test.afterAll(async () => {
  await banco.$disconnect();
});

test("o idioma escolhido ao criar a conta vale para a ferramenta e pode ser trocado em Minha conta", async ({ page }, info) => {
  // No celular os links da barra ficam atrás do botão Menu; o fluxo é o mesmo
  test.skip(info.project.name === "celular", "barra recolhida no celular");
  const email = emailDeTeste(info);
  await page.goto("/cadastrar");
  const janela = janelaDeAcesso(page, "Criar conta");
  await expect(janela).toBeVisible();
  await janela.getByLabel("Nome").fill("Pesquisadora E2E");
  await janela.getByLabel("E-mail").fill(email);
  await janela.getByLabel("Senha", { exact: true }).fill(SENHA);
  await verificarAcessibilidade(page);
  // Escolher o idioma já troca a página (o aviso está no texto de ajuda do campo, WCAG 3.2.2)
  await janela.getByLabel("Idioma da ferramenta").selectOption("de");
  await expect(janela.getByLabel("E-mail")).toHaveValue(email);
  await janela.getByRole("button", { name: "Criar conta" }).click();
  await expect(page).toHaveURL(/:\d+\/$/);
  await pularTutorial(page);

  const principal = page.getByRole("navigation", { name: "Principal" });
  await expect(principal.getByRole("link", { name: "Mein Konto" })).toBeVisible();
  // Quase nada traduzido ainda: a página continua marcada como português (WCAG 3.1.1)
  await expect(page.locator("html")).toHaveAttribute("lang", "pt-BR");

  await page.goto("/conta/idioma");
  await expect(page.getByRole("radio", { name: /Deutsch/ })).toBeChecked();
  await page.getByRole("radio", { name: /^Português/ }).check();
  await page.getByRole("button", { name: "Salvar idioma" }).click();
  await expect(page.getByRole("status").filter({ hasText: "Idioma da ferramenta trocado." })).toBeVisible();
  await expect(principal.getByRole("link", { name: "Minha conta" })).toBeVisible();
});

test("o seletor de idioma da barra troca a ferramenta e a conta sem sair da página", async ({ page }, info) => {
  await cadastrarComTeclado(page, emailDeTeste(info));
  await abrirMenu(page);
  const seletor = page.getByRole("button", { name: /Idioma: Português/ });
  await seletor.click();
  const lista = page.getByRole("region", { name: "Idioma da ferramenta" });
  await expect(lista).toBeVisible();
  await expect(lista.getByRole("button", { name: "Português" })).toHaveAttribute("aria-current", "true");
  await verificarAcessibilidade(page);

  // Não é modal: Esc fecha e devolve o foco ao seletor
  await page.keyboard.press("Escape");
  await expect(lista).toBeHidden();
  await expect(seletor).toBeFocused();

  // Só o clique troca; a página continua a mesma, já no idioma novo, com o foco de volta no seletor
  await seletor.click();
  await lista.getByRole("button", { name: "Deutsch" }).click();
  const alemao = page.getByRole("button", { name: /Sprache: Deutsch/ });
  await expect(alemao).toBeFocused();
  await expect(page.getByRole("region", { name: "Idioma da ferramenta" })).toBeHidden();
  await expect(page).toHaveURL(/\/estudos$/);
  await expect(page.getByRole("navigation", { name: "Principal" }).getByRole("link", { name: "Mein Konto" })).toBeAttached();

  // É o mesmo que Minha conta › Idioma: a conta passa a ser em alemão
  await page.goto("/conta/idioma");
  await expect(page.getByRole("radio", { name: /^Deutsch/ })).toBeChecked();
});

test("sem login, o seletor de idioma da barra fica guardado neste navegador", async ({ page }) => {
  await page.goto("/documentacao");
  await abrirMenu(page);
  await page.getByRole("button", { name: /Idioma: Português/ }).click();
  await page.getByRole("region", { name: "Idioma da ferramenta" }).getByRole("button", { name: "English" }).click();
  await expect(page.getByRole("button", { name: /^EN Language: English$|^Language: English$/ })).toBeFocused();
  await page.reload();
  await abrirMenu(page);
  await expect(page.getByRole("button", { name: /^EN Language: English$|^Language: English$/ })).toBeVisible();
});
