// As datas do estudo são só dia (coluna date): ficam em meia-noite UTC e são lidas em UTC,
// senão o fuso de Brasília mostraria o dia anterior
const DIA_MS = 24 * 60 * 60 * 1000;

const FORMATO_DIA = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "UTC" });
const FORMATO_DIA_MES = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", timeZone: "UTC" });

export function formatarDia(dia: Date): string {
  return FORMATO_DIA.format(dia);
}

// "2026-10-26" vindo do <input type="date">
export function diaDoCampo(valor: string): Date {
  return new Date(`${valor}T00:00:00Z`);
}

export function diaParaCampo(dia: Date): string {
  return dia.toISOString().slice(0, 10);
}

export function hojeEmBrasilia(agora = new Date()): Date {
  const [ano, mes, dia] = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Sao_Paulo" }).format(agora).split("-");
  return diaDoCampo(`${ano}-${mes}-${dia}`);
}

export function diasEntre(inicio: Date, fim: Date): number {
  return Math.round((fim.getTime() - inicio.getTime()) / DIA_MS);
}

// "05/10 a 20/11/2026", repetindo o ano só quando muda
export function intervalo(inicio: Date, fim: Date): string {
  const mesmoAno = inicio.getUTCFullYear() === fim.getUTCFullYear();
  return `${mesmoAno ? FORMATO_DIA_MES.format(inicio) : formatarDia(inicio)} a ${formatarDia(fim)}`;
}

export type SituacaoPeriodo = {
  // fração do período já passada, de 0 a 1, para a régua
  progresso: number;
  diaAtual: number;
  totalDias: number;
  antesDoInicio: boolean;
  depoisDoFim: boolean;
};

export function situacaoDoPeriodo(inicio: Date, fim: Date, hoje: Date): SituacaoPeriodo {
  const totalDias = diasEntre(inicio, fim) + 1;
  const passados = diasEntre(inicio, hoje) + 1;
  return {
    progresso: Math.min(1, Math.max(0, (passados - 1) / Math.max(1, totalDias - 1))),
    diaAtual: Math.min(totalDias, Math.max(1, passados)),
    totalDias,
    antesDoInicio: hoje < inicio,
    depoisDoFim: hoje > fim,
  };
}
