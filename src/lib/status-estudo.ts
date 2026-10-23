import type { StatusEstudo } from "@/generated/prisma/enums";

// docs/ihc.md 4.2: o status vem escrito e com a consequência, sempre no mesmo lugar (Nielsen 1)
export const STATUS = {
  RASCUNHO: { nome: "Rascunho", consequencia: "o link ainda não aceita respostas" },
  ABERTO: { nome: "Aberto", consequencia: "aceitando respostas" },
  ENCERRADO: { nome: "Encerrado", consequencia: "o link não aceita mais respostas" },
} as const satisfies Record<StatusEstudo, { nome: string; consequencia: string }>;

export const AVISOS_DE_STATUS = {
  ABERTO: "Coleta aberta. O link já aceita respostas.",
  ENCERRADO: "Coleta encerrada. O link não aceita mais respostas. Dá para reabrir quando quiser.",
  REABERTO: "Coleta reaberta. O link voltou a aceitar respostas.",
} as const;
