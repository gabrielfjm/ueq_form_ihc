// docs/ueq-protocolo.md, seção 9: separador ";" e vírgula decimal, que é como o Excel em pt-BR
// abre um CSV direto em colunas. O BOM avisa o Excel de que o arquivo é UTF-8 (sem ele os acentos quebram)
export const SEPARADOR = ";";
export const QUEBRA = "\r\n";
export const BOM = "﻿";

export type ValorCsv = string | number | null | undefined;

// Campo com separador, aspas ou quebra de linha vai entre aspas, com as aspas internas dobradas (RFC 4180)
export function campoCsv(valor: ValorCsv): string {
  if (valor === null || valor === undefined) return "";
  const texto = String(valor);
  return /[;"\r\n]/.test(texto) ? `"${texto.replace(/"/g, '""')}"` : texto;
}

export function linhaCsv(campos: readonly ValorCsv[]): string {
  return campos.map(campoCsv).join(SEPARADOR);
}

export function documentoCsv(linhas: readonly (readonly ValorCsv[])[], { comBom = true } = {}): string {
  return `${comBom ? BOM : ""}${linhas.map(linhaCsv).join(QUEBRA)}${QUEBRA}`;
}

// Sem separador de milhar e com vírgula; null vira campo vazio, não "—", para o arquivo continuar numérico
export function decimalCsv(valor: number | null | undefined, casas = 4): string {
  return valor === null || valor === undefined ? "" : valor.toFixed(casas).replace(".", ",");
}

// "Avaliação do checkout" → "avaliacao-do-checkout", para o nome do arquivo
export function slugDoTitulo(titulo: string): string {
  return (
    titulo
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "estudo"
  );
}
