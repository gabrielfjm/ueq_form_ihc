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

// Pares do UEQ-S num idioma a partir dos 26 pares do UEQ nesse idioma: o handbook (p. 12) diz que o UEQ-S
// existe em todos os idiomas do UEQ por ser um subconjunto dele, com o termo negativo sempre à esquerda
export function termosDoUeqS<T extends { numero: number; termoEsquerdo: string; termoDireito: string }>(
  termosUeq: readonly T[],
): { numero: number; termoEsquerdo: string; termoDireito: string }[] {
  const porNumero = new Map(termosUeq.map((par) => [par.numero, par]));
  return ITENS_UEQ_S.map((item) => {
    const par = porNumero.get(item.numeroNoUeq);
    if (!par) throw new RangeError(`Faltam os termos do item ${item.numeroNoUeq} do UEQ.`);
    return {
      numero: item.ordem,
      termoEsquerdo: item.ladoTrocado ? par.termoDireito : par.termoEsquerdo,
      termoDireito: item.ladoTrocado ? par.termoEsquerdo : par.termoDireito,
    };
  });
}
