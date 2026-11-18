"use server";

import type { Route } from "next";
import { redirect } from "next/navigation";
import { versaoComMenosRespostas } from "@/lib/balanceamento";
import { banco } from "@/lib/banco";
import { cifrarJson } from "@/lib/cripto";
import { lerDemografia } from "@/lib/demografia";
import { gravacaoDoInstrumento } from "@/lib/gravacao";
import { QUANTIDADE_DE_ITENS } from "@/lib/instrumento";
import { ehIdioma } from "@/idiomas";
import {
  esquecerParticipacao,
  estudoPublico,
  guardarIdioma,
  guardarParticipacao,
  idiomaDoParticipante,
  marcarRespondido,
  participacaoAtual,
} from "@/lib/participacao";
import { notificarResposta } from "@/lib/notificacoes";
import { lerIdade } from "@/lib/termo";

const rota = (slug: string, etapa = "") => `/r/${slug}${etapa}` as Route;

// Seletor de idioma do consentimento: só muda com o botão "Aplicar", nunca ao escolher (WCAG 3.2.2)
// Também no questionário: quem troca o idioma no meio volta para lá, com as marcações guardadas no rascunho
export async function escolherIdioma(slug: string, dados: FormData): Promise<void> {
  await estudoPublico(slug);
  const codigo = dados.get("idioma");
  if (ehIdioma(codigo)) await guardarIdioma(slug, codigo);
  redirect(rota(slug, dados.get("voltar") === "questionario" ? "/questionario" : ""));
}

// Só aqui nasce a Participacao: antes de concordar, nada sobre a pessoa é gravado (docs/ihc.md §3.7)
export async function consentir(slug: string, dados: FormData): Promise<void> {
  const estudo = await estudoPublico(slug);
  if (estudo.status !== "ABERTO") redirect(rota(slug));

  // LGPD, art. 14: sem a idade, ou com menos de 18 anos sem a autorização do responsável, nada é gravado
  const idade = lerIdade(dados);
  if ("erro" in idade) redirect(rota(slug, idade.erro === "autorizacao" ? "?erro=autorizacao&idade=menor" : "?erro=idade"));

  const atual = await participacaoAtual(estudo.id);
  if (atual && !atual.concluidaEm) redirect(rota(slug, "/questionario"));

  const versao = versaoComMenosRespostas(
    estudo.versoes.map((v) => ({ id: v.id, ordem: v.ordem, respostas: v._count.participacoes })),
  );
  if (!versao) redirect(rota(slug));

  // LGPD, art. 15 e 16: participação que ninguém terminou não fica guardada. Quem consentiu e
  // abandonou há mais de 2 dias não tem resposta gravada; a linha sai junto com a próxima que chega
  await banco.participacao.deleteMany({
    where: { concluidaEm: null, criadaEm: { lt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) } },
  });
  const participacao = await banco.participacao.create({
    data: { versaoId: versao.id, consentiuEm: new Date(), idioma: await idiomaDoParticipante(slug), menorDeIdade: idade.menorDeIdade },
    select: { id: true },
  });
  await guardarParticipacao(slug, participacao.id);
  redirect(rota(slug, "/questionario"));
}

// O erro vai como código: quem mostra a mensagem é a tela, no idioma da pessoa
export type ResultadoEnvio = { faltando?: number[]; erro?: "encerrada" | "sem-participacao" };

export async function enviarRespostas(slug: string, valores: Record<number, number>): Promise<ResultadoEnvio> {
  const estudo = await estudoPublico(slug);
  if (estudo.status !== "ABERTO") return { erro: "encerrada" };
  const participacao = await participacaoAtual(estudo.id);
  if (!participacao) return { erro: "sem-participacao" };
  if (participacao.concluidaEm) redirect(rota(slug, estudo.coletarDemografia ? "/sobre-voce" : "/fim"));

  // Os números vêm do questionário: 1 a 26 no UEQ, 1 a 8 no UEQ-S (na ordem dele)
  const numeros = Array.from({ length: QUANTIDADE_DE_ITENS[estudo.instrumento] }, (_, posicao) => posicao + 1);
  const valorValido = (numero: number) => {
    const valor = valores[numero];
    return typeof valor === "number" && Number.isInteger(valor) && valor >= 1 && valor <= 7;
  };
  // A validação do navegador é conforto; a regra vale aqui (docs/ihc.md §4.1)
  const faltando = numeros.filter((numero) => !valorValido(numero));
  if (faltando.length > 0) return { faltando };

  const { respostas, suspeita } = (await gravacaoDoInstrumento(estudo.instrumento))(numeros.map((numero) => valores[numero] ?? 0));

  // As respostas e a conclusão entram juntas; se algo falhar, nada fica pela metade
  await banco.$transaction([
    banco.resposta.createMany({
      data: respostas.map((resposta) => ({ participacaoId: participacao.id, ...resposta })),
    }),
    banco.participacao.update({ where: { id: participacao.id }, data: { concluidaEm: new Date(), suspeita } }),
  ]);
  await marcarRespondido(slug);
  await notificarResposta(estudo.id);
  // Sem coleta de dados demográficos no estudo, a participação termina aqui, direto no agradecimento
  if (!estudo.coletarDemografia) {
    await esquecerParticipacao(slug);
    redirect(rota(slug, "/fim"));
  }
  redirect(rota(slug, "/sobre-voce"));
}

export async function salvarDemografia(slug: string, dados: FormData): Promise<void> {
  const estudo = await estudoPublico(slug);
  const participacao = await participacaoAtual(estudo.id);
  if (participacao?.concluidaEm && dados.get("acao") === "continuar") {
    const demografia = lerDemografia(dados);
    if (Object.keys(demografia).length > 0) {
      // Gravada cifrada (src/lib/cripto.ts): quem copiar o banco não lê o perfil de ninguém
      await banco.participacao.update({ where: { id: participacao.id }, data: { demografia: cifrarJson(demografia) } });
    }
  }
  await esquecerParticipacao(slug);
  redirect(rota(slug, "/fim"));
}

// Desistir apaga a participação incompleta: nenhuma resposta tinha sido gravada (docs/ihc.md §3.7)
export async function desistir(slug: string): Promise<void> {
  const estudo = await estudoPublico(slug);
  const participacao = await participacaoAtual(estudo.id);
  if (participacao && !participacao.concluidaEm) {
    await banco.participacao.delete({ where: { id: participacao.id } });
  }
  await esquecerParticipacao(slug);
  redirect(rota(slug, "/saiu"));
}
