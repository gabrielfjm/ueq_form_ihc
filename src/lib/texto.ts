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

// docs/design.md, Tom de voz: vírgula decimal. Sempre 2 casas, como na planilha oficial
const FORMATO_DECIMAL = new Intl.NumberFormat("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export function formatarDecimal(valor: number | null | undefined): string {
  return valor === null || valor === undefined ? "—" : FORMATO_DECIMAL.format(valor);
}

// "a, b e c"
export function juntarComE(partes: readonly string[]): string {
  if (partes.length <= 1) return partes.join("");
  return `${partes.slice(0, -1).join(", ")} e ${partes.at(-1)}`;
}
