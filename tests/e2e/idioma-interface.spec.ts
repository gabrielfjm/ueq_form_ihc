import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { expect, test } from "@playwright/test";
import { PrismaClient } from "../../src/generated/prisma/client";
import { chaveDoTexto } from "../../src/traducao/nucleo";
import { verificarAcessibilidade } from "./acessibilidade";
import { emailDeTeste, janelaDeAcesso, pularTutorial, SENHA } from "./contas";

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
