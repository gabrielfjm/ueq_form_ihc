import { formatar } from "@/idiomas/formatar";
import type { TextosParticipante } from "@/idiomas/tipos";

// O que o termo de consentimento informa, na ordem da tela. LGPD, art. 9º (finalidade, duração, quem é o
// controlador e como falar com ele) e Resolução CNS 510/2016 (riscos, benefícios, liberdade de desistir)

export type DadosDoTermo = {
  coletarDemografia: boolean;
  // O UEQ-S tem 8 pares e leva menos tempo
  instrumento: "UEQ" | "UEQ_S";
  riscos: string;
  beneficios: string;
  comiteEtica: string | null;
  responsavelNome: string;
  responsavelEmail: string;
  instituicao: string;
};

// doEstudo: o texto foi escrito pelo pesquisador e leva o lang do estudo
export type CondicaoDoTermo = { rotulo: string; linhas: string[]; doEstudo?: boolean };

// Também no topo do questionário
export function tempoDoQuestionario(textos: TextosParticipante, dados: Pick<DadosDoTermo, "coletarDemografia" | "instrumento">): string {
  const termo = textos.consentimento;
  if (dados.instrumento === "UEQ_S") return dados.coletarDemografia ? termo.tempoCurtoComDados : termo.tempoCurto;
  return dados.coletarDemografia ? termo.tempoComDados : termo.tempo;
}

export function condicoesDoTermo(textos: TextosParticipante, dados: DadosDoTermo): CondicaoDoTermo[] {
  const termo = textos.consentimento;
  const { rotulos } = termo;
  return [
    { rotulo: rotulos.tempo, linhas: [tempoDoQuestionario(textos, dados)] },
    ...(dados.coletarDemografia ? [{ rotulo: rotulos.dadosOpcionais, linhas: [termo.dadosOpcionais] }] : []),
    { rotulo: rotulos.participacao, linhas: [formatar(termo.participacao, { sair: textos.questionario.sair })] },
    { rotulo: rotulos.depoisDeEnviar, linhas: [termo.depoisDeEnviar] },
    { rotulo: rotulos.anonimato, linhas: [termo.anonimato] },
    { rotulo: rotulos.usoDosDados, linhas: [termo.usoDosDados] },
    { rotulo: rotulos.riscos, linhas: [dados.riscos], doEstudo: true },
    { rotulo: rotulos.beneficios, linhas: [dados.beneficios], doEstudo: true },
    {
      rotulo: rotulos.responsavel,
      linhas: [dados.responsavelNome, dados.instituicao, formatar(termo.contato, { email: dados.responsavelEmail })],
    },
    ...(dados.comiteEtica ? [{ rotulo: rotulos.comite, linhas: [dados.comiteEtica], doEstudo: true }] : []),
  ];
}

export type LeituraDaIdade = { menorDeIdade: boolean } | { erro: "idade" | "autorizacao" };

// LGPD, art. 14: quem tem menos de 18 anos só segue com a autorização do responsável confirmada
export function lerIdade(dados: FormData): LeituraDaIdade {
  const idade = dados.get("idade");
  if (idade === "maior") return { menorDeIdade: false };
  if (idade !== "menor") return { erro: "idade" };
  return dados.get("autorizacao") === "sim" ? { menorDeIdade: true } : { erro: "autorizacao" };
}
