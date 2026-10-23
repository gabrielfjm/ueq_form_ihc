import { ESCALAS, numerosPorEscala, paraCadaEscala, valorDoItem, type Escala, type ItemUEQ } from "./itens";
import { recodificarParticipante } from "./recodificar";

export type ParametrosInconsistencia = {
  amplitudeMaxima: number;
  escalasParaSuspeita: number;
  respostasIguaisMaximas: number;
};

export type MotivoSuspeita = "amplitude" | "respostasIguais";

export type AvaliacaoSuspeita = {
  amplitudes: Record<Escala, number>;
  escalasInconsistentes: Escala[];
  respostasIguais: number;
  motivos: MotivoSuspeita[];
  suspeita: boolean;
};

// Handbook UEQ, "Online application" (p. 7-8): distância entre a melhor e a pior resposta
// aos itens de uma escala, já recodificados (planilha, aba Inconsistencies, colunas AC a AH)
export function amplitudePorEscala(valores: readonly number[], itens: readonly ItemUEQ[]): Record<Escala, number> {
  const recodificados = recodificarParticipante(valores, itens);
  const numeros = numerosPorEscala(itens);
  return paraCadaEscala((escala) => {
    const daEscala = numeros[escala].map((numero) => valorDoItem(recodificados, numero));
    return Math.max(...daEscala) - Math.min(...daEscala);
  });
}

// Handbook UEQ, "Online application" (p. 8): maior quantidade de itens com a mesma posição marcada,
// contada nos valores originais de 1 a 7 (planilha, aba Inconsistencies, coluna "Critical length")
export function respostasIguais(valores: readonly number[]): number {
  const contagem = new Map<number, number>();
  for (const valor of valores) contagem.set(valor, (contagem.get(valor) ?? 0) + 1);
  return Math.max(0, ...contagem.values());
}

export function avaliarSuspeita(
  valores: readonly number[],
  itens: readonly ItemUEQ[],
  parametros: ParametrosInconsistencia,
): AvaliacaoSuspeita {
  const amplitudes = amplitudePorEscala(valores, itens);
  // Handbook UEQ, "Online application" (p. 7): amplitude maior que 3 marca a escala como inconsistente
  const escalasInconsistentes = ESCALAS.filter((escala) => amplitudes[escala] > parametros.amplitudeMaxima);
  const iguais = respostasIguais(valores);

  const motivos: MotivoSuspeita[] = [];
  // Planilha, aba Inconsistencies: sugere remover quem tem 3 ou mais escalas inconsistentes
  if (escalasInconsistentes.length >= parametros.escalasParaSuspeita) motivos.push("amplitude");
  // Handbook UEQ, "Online application" (p. 8): mais de 15 respostas iguais em 26 itens
  if (iguais > parametros.respostasIguaisMaximas) motivos.push("respostasIguais");

  return {
    amplitudes,
    escalasInconsistentes,
    respostasIguais: iguais,
    motivos,
    suspeita: motivos.length > 0,
  };
}

export function marcarSuspeitos(
  respostas: readonly (readonly number[])[],
  itens: readonly ItemUEQ[],
  parametros: ParametrosInconsistencia,
): AvaliacaoSuspeita[] {
  return respostas.map((valores) => avaliarSuspeita(valores, itens, parametros));
}
