import "server-only";
import protocoloUeqS from "../../data/protocolo-ueq-s.json";
import protocolo from "../../data/protocolo.json";
import { avaliarSuspeita, avaliarSuspeitaUeqS, valoresParaOUeq } from "@/ueq";
import { ITENS_UEQ_S, type Instrumento } from "./instrumento";
import { itensDoQuestionario } from "./itens-ueq";

export type Gravacao = { respostas: { itemId: number; valor: number }[]; suspeita: boolean };

// Das respostas como o participante marcou (26 no UEQ, 8 no UEQ-S, na ordem do questionário dele) para o que o
// banco guarda: um valor por item do UEQ. As do UEQ-S vão para os itens equivalentes, na orientação de cada um
// (src/ueq/ueq-s.ts), e a marca de suspeita segue a regra da planilha do instrumento. Usado pelo envio do
// questionário, pela importação de CSV e pelo recálculo de suspeitas
export async function gravacaoDoInstrumento(instrumento: Instrumento): Promise<(valores: readonly number[]) => Gravacao> {
  const itens = await itensDoQuestionario();
  if (instrumento === "UEQ_S") {
    const idPorNumero = new Map(itens.map((item) => [item.numero, item.id]));
    return (valores) => ({
      respostas: valoresParaOUeq(valores, ITENS_UEQ_S).map(({ numeroNoUeq, valor }) => {
        const itemId = idPorNumero.get(numeroNoUeq);
        if (itemId === undefined) throw new Error(`O item ${numeroNoUeq} do UEQ não está no banco.`);
        return { itemId, valor };
      }),
      suspeita: avaliarSuspeitaUeqS(valores, ITENS_UEQ_S, protocoloUeqS.inconsistencia).suspeita,
    });
  }
  return (valores) => ({
    respostas: itens.map((item) => ({ itemId: item.id, valor: valores[item.numero - 1] ?? 0 })),
    suspeita: avaliarSuspeita(valores, itens, protocolo.inconsistencia).suspeita,
  });
}
