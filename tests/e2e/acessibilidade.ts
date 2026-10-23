import AxeBuilder from "@axe-core/playwright";
import { expect, type Page } from "@playwright/test";

const CRITERIOS_WCAG_22_AA = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

export async function verificarAcessibilidade(page: Page) {
  // Com generateMetadata o Next envia o <title> logo depois do HTML inicial; o axe só roda quando ele chegou
  await expect(page).toHaveTitle(/.+/);
  const resultado = await new AxeBuilder({ page }).withTags(CRITERIOS_WCAG_22_AA).analyze();

  const violacoes = resultado.violations.map(
    (violacao) =>
      `${violacao.id} (${violacao.impact ?? "sem impacto"}): ${violacao.help}\n` +
      violacao.nodes.map((no) => `  ${no.target.join(" ")}`).join("\n"),
  );

  expect(violacoes, "Violações WCAG 2.2 A/AA encontradas pelo axe-core").toEqual([]);
}
