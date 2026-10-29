import type { Plural } from "./tipos";

// Funções puras e leves: vão também para o navegador, sem carregar os 37 idiomas

// "Item {n} de {total}" + { n: 3, total: 26 } → "Item 3 de 26"
export function formatar(modelo: string, valores: Record<string, string | number>): string {
  return modelo.replace(/\{(\w+)\}/g, (marcador, nome: string) => (nome in valores ? String(valores[nome]) : marcador));
}

// A forma certa para o número no idioma (one, few, many…), com "other" quando o idioma não tem a forma
export function plural(formas: Plural, n: number, lang: string): string {
  const forma = new Intl.PluralRules(lang).select(n);
  return formatar((forma === "other" ? undefined : formas[forma]) ?? formas.other, { n });
}

// [3, 7, 12] → "3, 7 e 12" em português, "3, 7, and 12" em inglês
export function listaDeNumeros(numeros: readonly number[], lang: string): string {
  return new Intl.ListFormat(lang, { type: "conjunction" }).format(numeros.map(String));
}
