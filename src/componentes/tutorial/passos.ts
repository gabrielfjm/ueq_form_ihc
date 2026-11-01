// Passos do tour guiado do primeiro acesso. Em "clique" a pessoa faz a própria ação destacada para seguir
// (como no tutorial de um jogo); em "proximo" o destaque só explica e o botão Próximo avança

export type ModoPasso = "clique" | "proximo";

export type Passo = {
  // a página em que o passo acontece; fora dela o cartão oferece "Ir para lá"
  pagina: (estudoId: string) => string;
  // seletor do elemento destacado
  alvo: (estudoId: string) => string;
  titulo: string;
  texto: string;
  modo: ModoPasso;
};

const estudo = (id: string) => `/estudos/${id}`;

export const PASSOS: readonly Passo[] = [
  {
    pagina: () => "/estudos",
    alvo: (id) => `[data-estudo="${id}"]`,
    titulo: "Seus estudos",
    texto:
      "Aqui ficam os seus estudos e os que a equipe compartilhou com você. Separamos um estudo com respostas para o tour. Clique no título dele para abrir.",
    modo: "clique",
  },
  {
    pagina: estudo,
    alvo: () => '[data-tutorial="link-coleta"]',
    titulo: "O link da coleta",
    texto:
      "Este é o endereço que você manda para os participantes. Ele abre o termo de consentimento e o questionário, em 37 idiomas, enquanto a coleta estiver aberta.",
    modo: "proximo",
  },
  {
    pagina: estudo,
    alvo: () => '[data-tutorial="compartilhar"]',
    titulo: "Trabalhe em equipe",
    texto:
      "Em Compartilhar você convida outras pessoas pelo e-mail da conta delas, como Editor ou Leitor, no estilo do Google Docs. O convite chega no sino e por e-mail.",
    modo: "proximo",
  },
  {
    pagina: estudo,
    alvo: () => '[data-tutorial="aba-resultados"]',
    titulo: "Vamos ver os resultados",
    texto: "Clique na aba Resultados para abrir o painel do estudo.",
    modo: "clique",
  },
  {
    pagina: (id) => `${estudo(id)}/resultados`,
    alvo: () => '[data-tutorial="escalas"]',
    titulo: "As seis escalas do UEQ",
    texto:
      "Cada barra é a média de uma escala, de −3 a +3, com o intervalo de confiança. As faixas ao fundo comparam o produto com o benchmark do UEQ.",
    modo: "proximo",
  },
  {
    pagina: (id) => `${estudo(id)}/resultados`,
    alvo: () => '[data-tutorial="exportar"]',
    titulo: "Leve os dados para o relatório",
    texto: "Aqui você baixa os dados em CSV, no formato da planilha oficial do UEQ, e o painel em PDF.",
    modo: "proximo",
  },
  {
    pagina: (id) => `${estudo(id)}/resultados`,
    alvo: () => '[data-tutorial="aba-respostas"]',
    titulo: "Agora as respostas",
    texto: "Clique na aba Respostas para ver cada participação.",
    modo: "clique",
  },
  {
    pagina: (id) => `${estudo(id)}/respostas`,
    alvo: () => '[data-tutorial="participacoes"]',
    titulo: "Respostas suspeitas",
    texto:
      "Quem respondeu de forma contraditória ou marcou quase tudo igual aparece como suspeito. Você decide, na coluna “Na análise”, se a resposta entra no cálculo. Nada é apagado.",
    modo: "proximo",
  },
  {
    pagina: (id) => `${estudo(id)}/respostas`,
    alvo: () => '[data-tutorial="notificacoes"]',
    titulo: "O sino de notificações",
    texto:
      "Convites, respostas novas e mudanças que a equipe faz nos seus estudos aparecem aqui, e também no seu e-mail.",
    modo: "proximo",
  },
  {
    pagina: (id) => `${estudo(id)}/respostas`,
    alvo: () => '[data-tutorial="ajuda"]',
    titulo: "Ajuda em toda página",
    texto: "Ficou com dúvida? Toda página tem este botão (?) que explica o que dá para fazer nela. Clique nele para terminar o tour.",
    modo: "clique",
  },
];
