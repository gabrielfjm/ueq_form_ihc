// A aba Documentação mostra os mesmos .md do repositório: um arquivo, duas leituras (GitHub e ferramenta).
// Aqui fica só o que o .md não diz: em que seção o documento entra e a explicação da ficha lateral

export type Download = { arquivo: string; rotulo: string };

export type Documento = {
  slug: string;
  // caminho a partir da raiz do repositório
  arquivo: string;
  rotulo: string;
  descricao: string;
  oQueE: string;
  paraQueServe: string;
  quemDeveLer: string;
  downloads?: readonly Download[];
};

export type Secao = { slug: string; titulo: string; documentos: readonly Documento[] };

const PLANILHA: Download = { arquivo: "docs/documentacao/planilha-requisitos.xlsx", rotulo: "Planilha de requisitos (XLSX)" };

export const VISAO_GERAL: Documento = {
  slug: "",
  arquivo: "docs/documentacao/README.md",
  rotulo: "Visão geral",
  descricao:
    "Como a Ferramenta UEQ foi construída: requisitos, usuários, modelagem, arquitetura e testes. São os mesmos arquivos do repositório, em docs/documentacao, sob a licença MIT.",
  oQueE: "O índice da documentação: o que existe, por onde começar e como os documentos se ligam.",
  paraQueServe: "Achar o documento certo para a sua pergunta sem abrir todos.",
  quemDeveLer: "Todo mundo, antes dos outros documentos.",
  downloads: [PLANILHA],
};

export const SECOES: readonly Secao[] = [
  { slug: "visao-geral", titulo: "Visão geral", documentos: [VISAO_GERAL] },
  {
    slug: "requisitos",
    titulo: "Requisitos",
    documentos: [
      {
        slug: "requisitos",
        arquivo: "docs/documentacao/requisitos.md",
        rotulo: "Requisitos",
        descricao: "O que a ferramenta faz e como ela tem de ser, com a sprint em que cada requisito foi entregue.",
        oQueE: "A lista de tudo o que a ferramenta faz e de como ela tem de ser, com prioridade, sprint de entrega e status.",
        paraQueServe: "Saber o que já está pronto, em que sprint entrou e como conferir que funciona.",
        quemDeveLer: "Quem avalia o projeto e quem planeja a próxima sprint.",
        downloads: [PLANILHA, { arquivo: "docs/documentacao/requisitos.csv", rotulo: "requisitos.csv" }],
      },
      {
        slug: "matriz-de-rastreabilidade",
        arquivo: "docs/documentacao/matriz-rastreabilidade.md",
        rotulo: "Matriz de rastreabilidade",
        descricao: "Cada requisito ligado a histórias, casos de uso, personas, casos de teste, sprint e código.",
        oQueE: "A ligação de cada requisito com quem pediu, onde está no código e que teste prova que funciona.",
        paraQueServe: "Antes de mudar um comportamento, ver o que depende dele; antes de avaliar, ver a cobertura.",
        quemDeveLer: "Quem vai mudar o código e quem avalia a rastreabilidade do projeto.",
        downloads: [PLANILHA, { arquivo: "docs/documentacao/matriz-rastreabilidade.csv", rotulo: "matriz-rastreabilidade.csv" }],
      },
    ],
  },
  {
    slug: "usuarios",
    titulo: "Usuários",
    documentos: [
      {
        slug: "personas",
        arquivo: "docs/documentacao/personas.md",
        rotulo: "Personas",
        descricao: "Quem usa a ferramenta: dois pesquisadores, três participantes e quem mantém o código.",
        oQueE: "Seis pessoas fictícias que representam quem usa a ferramenta, construídas a partir do perfil de usuários de IHC.",
        paraQueServe: "Decidir uma tela pensando em alguém concreto: a participante no celular, o pesquisador que confere a planilha.",
        quemDeveLer: "Quem desenha ou muda uma tela.",
      },
      {
        slug: "historias-de-usuario",
        arquivo: "docs/documentacao/historias-de-usuario.md",
        rotulo: "Histórias de usuário",
        descricao: "O que cada persona quer fazer e como saber que deu certo.",
        oQueE: "As necessidades das personas no formato Como… quero… para…, com critérios de aceitação.",
        paraQueServe: "Conferir se uma entrega atende a quem pediu, critério por critério.",
        quemDeveLer: "Quem planeja, implementa ou testa uma funcionalidade.",
        downloads: [PLANILHA, { arquivo: "docs/documentacao/historias-de-usuario.csv", rotulo: "historias-de-usuario.csv" }],
      },
    ],
  },
  {
    slug: "modelagem",
    titulo: "Modelagem",
    documentos: [
      {
        slug: "casos-de-uso",
        arquivo: "docs/documentacao/casos-de-uso.md",
        rotulo: "Casos de uso",
        descricao: "O que cada ator faz com a ferramenta, em diagrama e por escrito.",
        oQueE: "Os 24 casos de uso da ferramenta em diagramas UML, com a especificação dos principais.",
        paraQueServe: "Ver quem faz o quê na ferramenta e quais requisitos cada caso de uso exerce.",
        quemDeveLer: "Quem avalia o projeto e quem vai mudar um fluxo.",
      },
      {
        slug: "diagrama-de-classes",
        arquivo: "docs/documentacao/diagrama-de-classes.md",
        rotulo: "Diagrama de classes",
        descricao: "As entidades do banco e o módulo de cálculo do UEQ.",
        oQueE: "A estrutura dos dados (Prisma) e dos tipos e funções do cálculo (src/ueq), em UML.",
        paraQueServe: "Entender o que é guardado, como as entidades se ligam e o que apagar um estudo leva junto.",
        quemDeveLer: "Quem mexe no banco ou no cálculo.",
      },
      {
        slug: "diagramas-de-sequencia",
        arquivo: "docs/documentacao/diagramas-de-sequencia.md",
        rotulo: "Diagramas de sequência",
        descricao: "Como as partes da ferramenta conversam nos seis fluxos mais importantes.",
        oQueE: "Seis fluxos passo a passo: entrar, responder, ver resultados, tirar da análise, exportar PDF e importar CSV.",
        paraQueServe: "Seguir uma requisição do clique até o banco e de volta, inclusive os desvios de erro.",
        quemDeveLer: "Quem vai depurar ou mudar um desses fluxos.",
      },
    ],
  },
  {
    slug: "arquitetura",
    titulo: "Arquitetura",
    documentos: [
      {
        slug: "arquitetura",
        arquivo: "docs/documentacao/arquitetura.md",
        rotulo: "Arquitetura",
        descricao: "Contexto, containers e componentes no modelo C4, as decisões e a implantação.",
        oQueE: "A arquitetura em três níveis de zoom (C4), as regras de dependência e as decisões tomadas, com o porquê.",
        paraQueServe: "Saber onde cada coisa mora antes de mexer e o que é preciso para publicar num servidor.",
        quemDeveLer: "Quem vai contribuir com código ou instalar a ferramenta.",
      },
    ],
  },
  {
    slug: "testes",
    titulo: "Testes",
    documentos: [
      {
        slug: "casos-de-teste",
        arquivo: "docs/documentacao/casos-de-teste.md",
        rotulo: "Casos de teste",
        descricao: "A estratégia de teste, os cenários e cada caso, com o resultado da última execução.",
        oQueE: "Os testes que já existem, de ponta a ponta, de unidade e manuais, com passos e resultado esperado.",
        paraQueServe: "Saber o que está provado, como rodar os testes e o que ainda falta verificar.",
        quemDeveLer: "Quem avalia a qualidade do projeto e quem escreve um teste novo.",
        downloads: [PLANILHA, { arquivo: "docs/documentacao/casos-de-teste.csv", rotulo: "casos-de-teste.csv" }],
      },
      {
        slug: "checklist-manual",
        arquivo: "docs/checklist-manual.md",
        rotulo: "Checklist manual",
        descricao: "O que a equipe confere à mão: leitor de tela, teclado, zoom, celular real e daltonismo.",
        oQueE: "A lista de verificações de acessibilidade e usabilidade que nenhuma automação substitui.",
        paraQueServe: "Rodar a verificação manual antes da entrega e anotar o que corrigir.",
        quemDeveLer: "A equipe, antes de cada entrega.",
      },
      {
        slug: "roteiro-da-revisao",
        arquivo: "docs/roteiro-revisao.md",
        rotulo: "Roteiro da revisão",
        descricao: "O que abrir, o que fazer em cada tela e como anotar os problemas.",
        oQueE: "O passo a passo para quem revisa a ferramenta: como abrir, as telas na ordem de uso e o que avaliar.",
        paraQueServe: "Fazer uma revisão completa sem esquecer nenhuma tela.",
        quemDeveLer: "Quem vai revisar a ferramenta.",
      },
    ],
  },
  {
    slug: "especificacao",
    titulo: "Especificação",
    documentos: [
      {
        slug: "protocolo-ueq",
        arquivo: "docs/ueq-protocolo.md",
        rotulo: "Protocolo UEQ",
        descricao: "Itens, escalas, polaridade e todas as fórmulas do cálculo, conferidas na planilha oficial.",
        oQueE: "A especificação do cálculo do UEQ, regra por regra, com a fonte de cada uma no handbook ou na planilha.",
        paraQueServe: "Conferir como cada número do painel é calculado e por que.",
        quemDeveLer: "Quem interpreta os resultados ou mexe no módulo de cálculo.",
      },
      {
        slug: "fundamentos-de-ihc",
        arquivo: "docs/ihc.md",
        rotulo: "Fundamentos de IHC",
        descricao: "Requisitos de usabilidade e acessibilidade, cada um ligado ao princípio que o justifica.",
        oQueE: "A literatura de IHC transformada em requisitos verificáveis, com a meta WCAG 2.2 AA.",
        paraQueServe: "Saber que princípio sustenta cada decisão de interface antes de mudar uma tela.",
        quemDeveLer: "Quem desenha, implementa ou avalia uma tela.",
      },
      {
        slug: "decisoes-de-interface",
        arquivo: "docs/rastreabilidade-ihc.md",
        rotulo: "Decisões de interface",
        descricao: "Cada decisão de interface, o princípio, onde está no código e o que prova que funciona.",
        oQueE: "A rastreabilidade das decisões de interface até a literatura, o código e os testes.",
        paraQueServe: "Não desfazer uma decisão sem saber por que ela existe.",
        quemDeveLer: "Quem muda uma tela e quem avalia o projeto.",
      },
      {
        slug: "idiomas",
        arquivo: "docs/idiomas.md",
        rotulo: "Idiomas",
        descricao: "Os 37 idiomas do questionário, de onde vem cada texto e as correções nos termos oficiais.",
        oQueE: "Como o link do participante funciona em 37 idiomas e o que a equipe corrigiu nos PDFs oficiais.",
        paraQueServe: "Decidir se um idioma pode ir para um estudo real e o que um falante nativo deve revisar.",
        quemDeveLer: "Quem vai aplicar o questionário fora do português.",
      },
      {
        slug: "identidade-visual",
        arquivo: "docs/design.md",
        rotulo: "Identidade visual",
        descricao: "Cores, tipografia, layout, ícones e tom de voz da ferramenta.",
        oQueE: "As regras visuais da ferramenta e o que é proibido usar.",
        paraQueServe: "Fazer uma tela nova que pareça parte da mesma ferramenta.",
        quemDeveLer: "Quem desenha ou implementa uma tela.",
      },
      {
        slug: "convencoes-de-codigo",
        arquivo: "docs/codigo.md",
        rotulo: "Convenções de código",
        descricao: "Nomes, comentários, estrutura, testes e commits.",
        oQueE: "Como a equipe escreve código, testes e mensagens de commit.",
        paraQueServe: "Escrever código que pareça escrito pela mesma equipe.",
        quemDeveLer: "Quem vai contribuir com código.",
      },
    ],
  },
];

export const DOCUMENTOS: readonly Documento[] = SECOES.flatMap((secao) => secao.documentos);

export function secaoDoDocumento(documento: Documento): Secao {
  const secao = SECOES.find((candidata) => candidata.documentos.includes(documento));
  if (!secao) throw new Error(`O documento ${documento.arquivo} não está em nenhuma seção`);
  return secao;
}

export function documentoPeloSlug(slug: string): Documento | undefined {
  return DOCUMENTOS.find((documento) => documento.slug === slug && slug !== "");
}

export function enderecoDoDocumento(documento: Documento): string {
  return documento.slug ? `/documentacao/${documento.slug}` : "/documentacao";
}

// Só o que está no catálogo sai pela rota de download: nenhum caminho vem do pedido
export const DOWNLOADS: readonly Download[] = [
  ...new Map(DOCUMENTOS.flatMap((documento) => documento.downloads ?? []).map((download) => [download.arquivo, download])).values(),
];

export const REPOSITORIO = "https://github.com/gabrielfjm/ueq_form_ihc";
