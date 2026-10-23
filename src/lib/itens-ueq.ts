import "server-only";
import type { Escala as EscalaBanco, Polaridade as PolaridadeBanco } from "@/generated/prisma/enums";
import type { Escala, ItemUEQ } from "@/ueq";
import { banco } from "./banco";

// O módulo src/ueq não conhece o Prisma: aqui o formato do banco vira o formato do cálculo
const ESCALA: Record<EscalaBanco, Escala> = {
  ATRATIVIDADE: "atratividade",
  PERSPICUIDADE: "perspicuidade",
  EFICIENCIA: "eficiencia",
  CONFIABILIDADE: "confiabilidade",
  ESTIMULACAO: "estimulacao",
  NOVIDADE: "novidade",
};

const POLARIDADE: Record<PolaridadeBanco, ItemUEQ["polaridade"]> = {
  POSITIVA_DIREITA: "+",
  POSITIVA_ESQUERDA: "-",
};

export async function itensDoQuestionario() {
  const itens = await banco.item.findMany({ orderBy: { numero: "asc" } });
  return itens.map((item) => ({
    id: item.id,
    numero: item.numero,
    termoEsquerdo: item.termoEsquerdo,
    termoDireito: item.termoDireito,
    escala: ESCALA[item.escala],
    polaridade: POLARIDADE[item.polaridade],
  }));
}
