import type { StatusEstudo } from "@/generated/prisma/enums";
import { m } from "@/traducao/nucleo";

// docs/ihc.md 4.2: o status vem escrito e com a consequência, sempre no mesmo lugar (Nielsen 1)
export const STATUS = {
  RASCUNHO: { nome: m("Rascunho"), consequencia: m("o link ainda não aceita respostas") },
  ABERTO: { nome: m("Aberto"), consequencia: m("aceitando respostas") },
  ENCERRADO: { nome: m("Encerrado"), consequencia: m("o link não aceita mais respostas") },
} as const satisfies Record<StatusEstudo, { nome: string; consequencia: string }>;

export const AVISOS_DE_STATUS = {
  ABERTO: m("Coleta aberta. O link já aceita respostas."),
  ENCERRADO: m("Coleta encerrada. O link não aceita mais respostas. Dá para reabrir quando quiser."),
  REABERTO: m("Coleta reaberta. O link voltou a aceitar respostas."),
} as const;
