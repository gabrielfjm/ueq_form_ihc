import idiomasUeqS from "../../data/ueq-s-idiomas.json";
import definicaoUeqS from "../../data/ueq-s-itens-ptbr.json";
import itensUeq from "../../data/ueq-itens-ptbr.json";
import { m } from "@/traducao/nucleo";
import { montarItensUeqS, type DefinicaoItemUeqS, type ItemUEQ, type ItemUeqS } from "@/ueq";

// Mesmo nome do enum Instrumento do banco (prisma/schema.prisma). Leve: também vai para o navegador
export type Instrumento = "UEQ" | "UEQ_S";

export const ITENS_UEQ_S: readonly ItemUeqS[] = montarItensUeqS(
  definicaoUeqS.itens as DefinicaoItemUeqS[],
  itensUeq.itens as ItemUEQ[],
);

export const QUANTIDADE_DE_ITENS: Record<Instrumento, number> = { UEQ: 26, UEQ_S: ITENS_UEQ_S.length };

export const NOME_INSTRUMENTO: Record<Instrumento, string> = {
  UEQ: m("UEQ completo"),
  UEQ_S: m("UEQ-S, versão curta"),
};

export const ehUeqS = (instrumento: Instrumento) => instrumento === "UEQ_S";

export type ParUeqS = { numero: number; termoEsquerdo: string; termoDireito: string };

// Os 8 pares do UEQ-S em cada idioma, da lista oficial UEQS_Items.pdf (data/ueq-s-idiomas.json). Em 31 idiomas são
// os mesmos do UEQ completo, com o negativo à esquerda; em 6 a lista do UEQ-S usa outras palavras em alguns pares
const PARES_UEQ_S = new Map(
  idiomasUeqS.idiomas.map((idioma) => [
    idioma.codigo,
    idioma.itens.map((item): ParUeqS => ({ numero: item.ordem, termoEsquerdo: item.termoEsquerdo, termoDireito: item.termoDireito })),
  ]),
);

export function termosDoUeqS(codigo: string): ParUeqS[] {
  const pares = PARES_UEQ_S.get(codigo) ?? PARES_UEQ_S.get("pt");
  if (!pares) throw new RangeError(`data/ueq-s-idiomas.json não tem o idioma ${codigo}.`);
  return pares;
}
