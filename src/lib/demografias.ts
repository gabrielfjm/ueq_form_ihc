import "server-only";
import { banco } from "./banco";
import { decifrarJson } from "./cripto";
import type { Demografia } from "./demografia";

// Dados demográficos (já decifrados) das participações que estão na análise, pelo link: as importadas de
// CSV nunca passaram pela etapa "Dados opcionais". Com versaoId, só as daquela versão
export async function demografiasNaAnalise(estudoId: string, versaoId?: string): Promise<(Demografia | null)[]> {
  const participacoes = await banco.participacao.findMany({
    where: {
      versao: versaoId ? { estudoId, id: versaoId } : { estudoId },
      concluidaEm: { not: null },
      incluidaNaAnalise: true,
      origem: "LINK",
    },
    select: { demografia: true },
  });
  return participacoes.map((participacao) => decifrarJson<Demografia>(participacao.demografia));
}
