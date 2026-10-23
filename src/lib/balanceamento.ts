export type VersaoParaSorteio = {
  id: string;
  ordem: number;
  respostas: number;
};

// Cada participante vai para a versão com menos respostas concluídas; no empate, a de menor ordem
export function versaoComMenosRespostas(versoes: readonly VersaoParaSorteio[]): VersaoParaSorteio | null {
  return versoes.reduce<VersaoParaSorteio | null>(
    (escolhida, versao) =>
      !escolhida ||
      versao.respostas < escolhida.respostas ||
      (versao.respostas === escolhida.respostas && versao.ordem < escolhida.ordem)
        ? versao
        : escolhida,
    null,
  );
}
