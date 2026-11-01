import "server-only";
import { randomUUID } from "node:crypto";
import type { OrigemParticipacao, StatusEstudo } from "@/generated/prisma/enums";
import { banco } from "../banco";
import { cifrarJson } from "../cripto";
import { PERGUNTAS_DEMOGRAFIA, PREFIRO_NAO_RESPONDER, type Demografia } from "../demografia";
import { gerarSlugPublico } from "../estudos";
import { itensDoQuestionario } from "../itens-ueq";
import { PARAMETROS_SUSPEITA } from "../participacoes";
import { hojeEmBrasilia } from "../periodo";
import { gerarValores, sorteador, type PerfilVersao, type Sorteador, type TipoParticipante } from "./respostas-sinteticas";

type GrupoParticipantes = {
  tipo: TipoParticipante;
  quantidade: number;
  origem?: OrigemParticipacao;
  // quantas destas o pesquisador já tirou da análise (só faz sentido nas suspeitas)
  foraDaAnalise?: number;
};

type DefinicaoVersao = { nome: string; perfil: PerfilVersao; grupos: GrupoParticipantes[] };

export type DefinicaoCenario = {
  titulo: string;
  produtoAvaliado: string;
  objetivo: string;
  status: StatusEstudo;
  coletarDemografia: boolean;
  // dias a partir de hoje (negativo = no passado)
  inicio: number;
  fim: number;
  versoes: DefinicaoVersao[];
  semente: number;
};

// Três situações que a equipe e os avaliadores encontram na ferramenta: comparação A/B com a coleta
// aberta, um estudo encerrado com respostas importadas e um rascunho ainda sem link
export const CENARIOS_DEMONSTRACAO: readonly DefinicaoCenario[] = [
  {
    titulo: "Agendamento de consultas: fluxo atual × redesenho",
    produtoAvaliado: "App Clínica Vida (agendamento de consultas)",
    objetivo:
      "Comparar a experiência do fluxo atual de agendamento com o fluxo redesenhado em uma tela só, antes de decidir qual vai para as lojas.",
    status: "ABERTO",
    coletarDemografia: true,
    inicio: -21,
    fim: 14,
    semente: 2026_11,
    versoes: [
      {
        nome: "Fluxo atual",
        perfil: { atratividade: 0.6, perspicuidade: 0.3, eficiencia: 0.1, confiabilidade: 0.9, estimulacao: 0.4, novidade: -0.3 },
        grupos: [
          { tipo: "normal", quantidade: 24 },
          { tipo: "aleatoria", quantidade: 2, foraDaAnalise: 1 },
          { tipo: "iguais", quantidade: 1 },
        ],
      },
      {
        nome: "Fluxo redesenhado",
        perfil: { atratividade: 1.7, perspicuidade: 1.9, eficiencia: 1.8, confiabilidade: 1.3, estimulacao: 1.3, novidade: 1.2 },
        grupos: [
          { tipo: "normal", quantidade: 23 },
          { tipo: "aleatoria", quantidade: 1 },
          { tipo: "iguais", quantidade: 1, foraDaAnalise: 1 },
        ],
      },
    ],
  },
  {
    titulo: "Portal do aluno: avaliação do semestre",
    produtoAvaliado: "Portal acadêmico da universidade",
    objetivo:
      "Medir como os estudantes percebem o portal acadêmico no fim do semestre, para priorizar o que entra na próxima reforma.",
    status: "ENCERRADO",
    coletarDemografia: true,
    inicio: -60,
    fim: -8,
    semente: 2026_22,
    versoes: [
      {
        nome: "Portal atual",
        perfil: { atratividade: -0.2, perspicuidade: -0.9, eficiencia: -0.6, confiabilidade: 0.2, estimulacao: -0.5, novidade: -1.1 },
        grupos: [
          { tipo: "normal", quantidade: 22 },
          { tipo: "normal", quantidade: 8, origem: "IMPORTADA" },
          { tipo: "aleatoria", quantidade: 2, foraDaAnalise: 2 },
          { tipo: "iguais", quantidade: 1 },
        ],
      },
    ],
  },
  {
    titulo: "Totem de autoatendimento do restaurante universitário",
    produtoAvaliado: "Totem de pedidos do RU",
    objetivo: "Escolher entre três protótipos de totem antes do piloto no restaurante universitário.",
    status: "RASCUNHO",
    coletarDemografia: false,
    inicio: 7,
    fim: 37,
    semente: 2026_33,
    versoes: [
      { nome: "Protótipo A: cardápio em grade", perfil: perfilNeutro(), grupos: [] },
      { nome: "Protótipo B: lista com fotos", perfil: perfilNeutro(), grupos: [] },
      { nome: "Protótipo C: pedido por voz", perfil: perfilNeutro(), grupos: [] },
    ],
  },
];

// Estudo que o tour guiado abre quando a pessoa ainda não tem nenhum com respostas
export const CENARIO_TUTORIAL: DefinicaoCenario = {
  titulo: "Exemplo do tour: app de delivery",
  produtoAvaliado: "App de delivery (exemplo)",
  objetivo: "Estudo de exemplo criado pelo tour guiado. Pode explorar, editar e excluir à vontade.",
  status: "ABERTO",
  coletarDemografia: true,
  inicio: -10,
  fim: 20,
  semente: 2026_44,
  versoes: [
    {
      nome: "Versão única",
      perfil: { atratividade: 1.2, perspicuidade: 1.5, eficiencia: 0.9, confiabilidade: 0.7, estimulacao: 0.8, novidade: 0.3 },
      grupos: [
        { tipo: "normal", quantidade: 20 },
        { tipo: "aleatoria", quantidade: 1 },
        { tipo: "iguais", quantidade: 1 },
      ],
    },
  ],
};

function cifrarOpcional(demografia: Demografia | null) {
  return demografia ? cifrarJson(demografia) : undefined;
}

function perfilNeutro(): PerfilVersao {
  return { atratividade: 0, perspicuidade: 0, eficiencia: 0, confiabilidade: 0, estimulacao: 0, novidade: 0 };
}

const DIA_MS = 24 * 60 * 60 * 1000;
// A maioria responde em português; algumas pessoas escolhem outro idioma no link
const IDIOMAS = ["pt", "pt", "pt", "pt", "pt", "pt", "pt", "en", "es"] as const;

function demografiaSorteada(sorteio: Sorteador): Demografia | null {
  // Uma em cada cinco pula a etapa "Sobre você"
  if (sorteio.numero() < 0.2) return null;
  const demografia: Demografia = {};
  for (const pergunta of PERGUNTAS_DEMOGRAFIA) {
    demografia[pergunta.campo] = sorteio.numero() < 0.08 ? PREFIRO_NAO_RESPONDER : sorteio.escolher(pergunta.opcoes);
  }
  return demografia;
}

// Grava o estudo do cenário com o dono informado. Devolve o id do estudo criado
export async function criarCenario(definicao: DefinicaoCenario, donoId: string): Promise<string> {
  const sorteio = sorteador(definicao.semente);
  const hoje = hojeEmBrasilia();
  const dia = (deslocamento: number) => new Date(hoje.getTime() + deslocamento * DIA_MS);
  const itens = await itensDoQuestionario();

  const estudo = await banco.estudo.create({
    data: {
      pesquisadorId: donoId,
      titulo: definicao.titulo,
      produtoAvaliado: definicao.produtoAvaliado,
      objetivo: definicao.objetivo,
      status: definicao.status,
      coletarDemografia: definicao.coletarDemografia,
      dataInicio: dia(definicao.inicio),
      dataFim: dia(definicao.fim),
      slugPublico: await gerarSlugPublico(),
      versoes: { create: definicao.versoes.map((versao, posicao) => ({ nome: versao.nome, ordem: posicao + 1 })) },
    },
    include: { versoes: { orderBy: { ordem: "asc" } } },
  });

  // As respostas se espalham entre o início da coleta e hoje (ou o fim, se já encerrou)
  const ultimoDia = Math.min(0, definicao.fim);
  const participacoes = definicao.versoes.flatMap((versao, posicao) =>
    versao.grupos.flatMap((grupo) =>
      Array.from({ length: grupo.quantidade }, (_, indice) => {
        const { valores, suspeita } = gerarValores(sorteio, versao.perfil, itens, grupo.tipo, PARAMETROS_SUSPEITA);
        const importada = grupo.origem === "IMPORTADA";
        const concluidaEm = new Date(
          dia(sorteio.inteiro(definicao.inicio, ultimoDia)).getTime() + sorteio.inteiro(8 * 60, 22 * 60) * 60 * 1000,
        );
        return {
          versaoId: estudo.versoes[posicao]?.id ?? "",
          consentiuEm: new Date(concluidaEm.getTime() - sorteio.inteiro(3, 9) * 60 * 1000),
          concluidaEm,
          suspeita,
          incluidaNaAnalise: indice >= (grupo.foraDaAnalise ?? 0),
          origem: grupo.origem ?? "LINK",
          idioma: importada ? null : sorteio.escolher(IDIOMAS),
          demografia: importada ? undefined : cifrarOpcional(demografiaSorteada(sorteio)),
          valores,
        };
      }),
    ),
  );

  // Duas inserções em lote em vez de uma por participação: em produção o banco fica longe da função
  const comId = participacoes.map(({ valores, ...participacao }) => ({ id: randomUUID(), valores, participacao }));
  await banco.participacao.createMany({ data: comId.map(({ id, participacao }) => ({ id, ...participacao })) });
  await banco.resposta.createMany({
    data: comId.flatMap(({ id, valores }) =>
      itens.map((item) => ({ participacaoId: id, itemId: item.id, valor: valores[item.numero - 1] ?? 4 })),
    ),
  });
  return estudo.id;
}
