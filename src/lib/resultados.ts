import "server-only";
import benchmark from "../../data/benchmark.json";
import protocolo from "../../data/protocolo.json";
import { analisarEstudo, type AnaliseEstudo, type ConfigAnalise } from "@/ueq";
import { banco } from "./banco";
import { itensDoQuestionario } from "./itens-ueq";

const CONFIG: ConfigAnalise = { protocolo, benchmark: benchmark.escalas };

export type AnalisePorVersao = { versaoId: string; nome: string; analise: AnaliseEstudo };

// Monta a entrada do módulo src/ueq a partir do banco. Todo cálculo estatístico fica lá:
// aqui só se busca, se ordena pelos 26 itens e se separa por versão (prompts/06-painel-resultados.md)
export async function analisarResultados(estudoId: string, versoes: readonly { id: string; nome: string }[]) {
  const [itens, participacoes] = await Promise.all([
    itensDoQuestionario(),
    banco.participacao.findMany({
      where: { versao: { estudoId }, concluidaEm: { not: null } },
      select: {
        versaoId: true,
        incluidaNaAnalise: true,
        respostas: { select: { valor: true, item: { select: { numero: true } } } },
      },
    }),
  ]);

  const entradas = participacoes.map((participacao) => {
    const valores = Array<number>(itens.length).fill(0);
    for (const resposta of participacao.respostas) valores[resposta.item.numero - 1] = resposta.valor;
    return { versaoId: participacao.versaoId, valores, incluidaNaAnalise: participacao.incluidaNaAnalise };
  });

  return {
    itens,
    todas: analisarEstudo(entradas, itens, CONFIG),
    porVersao: versoes.map(
      (versao): AnalisePorVersao => ({
        versaoId: versao.id,
        nome: versao.nome,
        analise: analisarEstudo(
          entradas.filter((entrada) => entrada.versaoId === versao.id),
          itens,
          CONFIG,
        ),
      }),
    ),
    benchmark: CONFIG.benchmark,
    faixaNeutra: protocolo.faixaNeutra,
  };
}
