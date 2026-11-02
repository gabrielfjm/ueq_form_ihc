export function plural(quantidade: number, singular: string, plural: string): string {
  return `${quantidade} ${quantidade === 1 ? singular : plural}`;
}

// docs/design.md, Tom de voz: datas em dd/mm/aaaa
const FORMATO_DATA = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  timeZone: "America/Sao_Paulo",
});

export function formatarData(data: Date): string {
  return FORMATO_DATA.format(data);
}

// "21/10 14:32" (protótipo r8): o ano já está no período do estudo
const FORMATO_DIA_HORA = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "America/Sao_Paulo",
});

export function formatarDiaHora(data: Date): string {
  return FORMATO_DIA_HORA.format(data).replace(",", "");
}

// docs/design.md, Tom de voz: vírgula decimal. Sempre 2 casas, como na planilha oficial
const FORMATO_DECIMAL = new Intl.NumberFormat("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export function formatarDecimal(valor: number | null | undefined): string {
  return valor === null || valor === undefined ? "—" : FORMATO_DECIMAL.format(valor);
}

// "a, b e c" (ou "a, b and c": a conjunção segue o idioma da interface)
export function juntarComE(partes: readonly string[], lang = "pt-BR"): string {
  return new Intl.ListFormat(lang, { style: "long", type: "conjunction" }).format(partes);
}
