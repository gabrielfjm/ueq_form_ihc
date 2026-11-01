import { avaliarSuspeita, type Escala, type ItemUEQ, type ParametrosInconsistencia } from "@/ueq";

// Respostas inventadas para os cenários de demonstração e o estudo do tour guiado. Nada aqui vai para
// a análise de um estudo de verdade: só existe para a equipe e os avaliadores verem o painel cheio

// Sorteio com semente: o mesmo cenário sai igual toda vez, o que facilita conferir o painel e testar
export function sorteador(semente: number) {
  let estado = semente >>> 0;
  const proximo = () => {
    // mulberry32
    estado = (estado + 0x6d2b79f5) >>> 0;
    let t = estado;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  return {
    numero: proximo,
    inteiro: (minimo: number, maximo: number) => minimo + Math.floor(proximo() * (maximo - minimo + 1)),
    // Box-Muller: desvio em torno da média do perfil
    normal: (desvio: number) => Math.sqrt(-2 * Math.log(1 - proximo())) * Math.cos(2 * Math.PI * proximo()) * desvio,
    escolher: <T>(opcoes: readonly T[]): T => opcoes[Math.floor(proximo() * opcoes.length)] as T,
  };
}

export type Sorteador = ReturnType<typeof sorteador>;

// Média esperada de cada escala, de -3 a +3, como no painel
export type PerfilVersao = Record<Escala, number>;

// normal: quem respondeu com atenção. aleatoria: marcou ao acaso (cai na regra da amplitude).
// iguais: marcou quase tudo na mesma posição (cai na regra das mais de 15 respostas iguais)
export type TipoParticipante = "normal" | "aleatoria" | "iguais";

const limitar = (valor: number) => Math.min(7, Math.max(1, Math.round(valor)));

function tentarGerar(sorteio: Sorteador, perfil: PerfilVersao, itens: readonly ItemUEQ[], tipo: TipoParticipante) {
  if (tipo === "aleatoria") return itens.map(() => sorteio.inteiro(1, 7));
  if (tipo === "iguais") {
    const posicao = sorteio.escolher([4, 4, 7, 1, 6]);
    return itens.map(() => (sorteio.numero() < 0.12 ? limitar(posicao + sorteio.escolher([-1, 1])) : posicao));
  }
  // Cada pessoa tem o próprio nível em cada escala; cada item varia um pouco em torno dele
  const nivel = Object.fromEntries(
    Object.entries(perfil).map(([escala, media]) => [escala, media + sorteio.normal(0.75)]),
  ) as PerfilVersao;
  return itens.map((item) => {
    const escore = Math.max(-3, Math.min(3, nivel[item.escala] + sorteio.normal(0.55)));
    // '+' = termo positivo à direita: 7 é o melhor. '-' = à esquerda: 1 é o melhor
    return item.polaridade === "+" ? limitar(4 + escore) : limitar(4 - escore);
  });
}

// Gera de novo até a marca de suspeita bater com o tipo: quem é "normal" nunca sai suspeito por acaso,
// e quem é "aleatoria" ou "iguais" sempre sai, pelas mesmas regras que a ferramenta aplica
export function gerarValores(
  sorteio: Sorteador,
  perfil: PerfilVersao,
  itens: readonly ItemUEQ[],
  tipo: TipoParticipante,
  parametros: ParametrosInconsistencia,
): { valores: number[]; suspeita: boolean } {
  const ordenados = [...itens].sort((a, b) => a.numero - b.numero);
  for (let tentativa = 0; tentativa < 200; tentativa++) {
    const valores = tentarGerar(sorteio, perfil, ordenados, tipo);
    const { suspeita } = avaliarSuspeita(valores, ordenados, parametros);
    if (suspeita === (tipo !== "normal")) return { valores, suspeita };
  }
  throw new Error(`Não deu para gerar uma participação do tipo "${tipo}" em 200 tentativas.`);
}
