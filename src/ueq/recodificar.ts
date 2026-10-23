import type { ItemUEQ, Polaridade } from "./itens";

// Handbook UEQ, "Scale structure" (p. 2): de -3 (mais negativo) a +3 (mais positivo),
// com x - 4 quando o positivo está à direita e 4 - x quando está à esquerda (planilha, aba DT)
export function recodificar(valor: number, polaridade: Polaridade): number {
  if (!Number.isInteger(valor) || valor < 1 || valor > 7) {
    throw new RangeError(`Resposta ${valor} fora da escala do UEQ, que vai de 1 a 7.`);
  }
  return polaridade === "+" ? valor - 4 : 4 - valor;
}

export function recodificarParticipante(valores: readonly number[], itens: readonly ItemUEQ[]): number[] {
  if (valores.length !== itens.length) {
    throw new RangeError(`O participante tem ${valores.length} respostas, mas o questionário tem ${itens.length} itens.`);
  }
  const polaridadePorNumero = new Map(itens.map((item) => [item.numero, item.polaridade]));
  return valores.map((valor, posicao) => {
    const polaridade = polaridadePorNumero.get(posicao + 1);
    if (polaridade === undefined) {
      throw new RangeError(`O item ${posicao + 1} não está na lista de itens do questionário.`);
    }
    return recodificar(valor, polaridade);
  });
}
