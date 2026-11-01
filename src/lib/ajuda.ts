// Ajuda de cada página da área do pesquisador: o botão (?) no cabeçalho abre este conteúdo numa janela.
// Texto curto, no vocabulário da tela (Nielsen 10: ajuda e documentação focadas na tarefa)

export type SecaoAjuda = { titulo: string; texto: string };

export type AjudaPagina = {
  titulo: string;
  resumo: string;
  secoes: readonly SecaoAjuda[];
};

export const AJUDA = {
  estudos: {
    titulo: "Seus estudos",
    resumo: "A lista de todos os estudos que você pode abrir: os seus e os que outras pessoas compartilharam com você.",
    secoes: [
      {
        titulo: "O que tem na tabela",
        texto:
          "Cada linha é um estudo, do atualizado mais recentemente ao mais antigo. Status diz se a coleta está em rascunho, aberta ou encerrada; a régua mostra onde hoje cai no período da coleta; Respostas conta só quem terminou o questionário.",
      },
      {
        titulo: "Criar um estudo",
        texto:
          "Use “Criar estudo” para começar: título, produto avaliado, objetivo, período e as versões que vão ser comparadas. O estudo nasce em rascunho e só recebe respostas depois de você abrir a coleta.",
      },
      {
        titulo: "Compartilhados com você",
        texto:
          "Quando alguém da equipe convida você e você aceita, o estudo aparece na seção “Compartilhados com você”, com o nome de quem é o dono e o seu papel: Editor pode mexer no estudo; Leitor só vê e exporta.",
      },
      {
        titulo: "Sino de notificações",
        texto:
          "O sino na barra do topo, entre Minha conta e Sair, mostra quantas novidades você ainda não viu: convites (que você aceita ou recusa ali mesmo), respostas que chegaram e mudanças que outras pessoas fizeram nos seus estudos.",
      },
    ],
  },
  "novo-estudo": {
    titulo: "Criar estudo",
    resumo: "O formulário que define o que vai ser avaliado e quem vai responder o quê.",
    secoes: [
      {
        titulo: "Dados do estudo",
        texto:
          "Título e produto aparecem para você; o objetivo também aparece para o participante, na tela de consentimento. Escreva em linguagem simples.",
      },
      {
        titulo: "Período",
        texto: "As datas de início e fim são só referência para a equipe: quem decide se o link aceita respostas é o botão de abrir e encerrar a coleta.",
      },
      {
        titulo: "Versões",
        texto:
          "Para comparar duas ou mais versões do produto (teste A/B), adicione uma versão para cada. O link é um só: a ferramenta distribui cada participante para a versão com menos respostas, para os grupos ficarem equilibrados.",
      },
      {
        titulo: "Dados do participante (LGPD)",
        texto:
          "Desligado por padrão. Ligue só se o estudo precisar de faixa etária, gênero, escolaridade e familiaridade com o produto. Ligado, o participante vê no fim uma etapa opcional e pode responder ou pular direto para o agradecimento; nada identifica a pessoa.",
      },
      {
        titulo: "Prévia",
        texto: "Ao lado do formulário você vê como o participante vai receber o convite, antes de criar.",
      },
    ],
  },
  "editar-estudo": {
    titulo: "Editar estudo",
    resumo: "Mude os dados, o período ou as versões do estudo.",
    secoes: [
      {
        titulo: "O que dá para mudar",
        texto:
          "Tudo pode ser mudado a qualquer momento, inclusive ligar ou desligar a coleta de dados demográficos (vale para as próximas respostas). Só não dá para remover uma versão que já tem respostas, para não perder dados.",
      },
      {
        titulo: "Salvar ou descartar",
        texto: "Nada muda até você salvar. Para desistir, volte para o estudo sem salvar.",
      },
    ],
  },
  estudo: {
    titulo: "Visão geral do estudo",
    resumo: "O resumo do estudo, o link da coleta e as ações que mudam o estado dele.",
    secoes: [
      {
        titulo: "Link da coleta",
        texto:
          "É o endereço que você manda para os participantes. Ele funciona nos 37 idiomas oficiais do UEQ e só aceita respostas enquanto a coleta está aberta.",
      },
      {
        titulo: "Abrir, encerrar e reabrir",
        texto:
          "Em rascunho, o link mostra que o questionário está em preparação. Abrir a coleta começa a aceitar respostas; encerrar para de aceitar, e dá para reabrir depois sem perder nada.",
      },
      {
        titulo: "Compartilhar",
        texto:
          "O botão “Compartilhar” convida outra pessoa com conta na ferramenta para trabalhar no estudo, como Editor ou Leitor. Ela recebe o convite no sino de notificações e por e-mail.",
      },
      {
        titulo: "Abas",
        texto: "Resultados mostra o painel com as seis escalas e o benchmark; Respostas lista cada participação e as suspeitas.",
      },
    ],
  },
  resultados: {
    titulo: "Resultados",
    resumo: "O painel do UEQ: médias das seis escalas, comparação com o benchmark, itens e exportações.",
    secoes: [
      {
        titulo: "Escalas e benchmark",
        texto:
          "Cada barra é a média de uma escala, de −3 a +3, com o intervalo de confiança de 95%. O fundo em faixas mostra o benchmark do UEQ: onde o produto cai em relação a centenas de outros produtos avaliados.",
      },
      {
        titulo: "Leitura rápida",
        texto:
          "Acima de +0,8 é avaliação positiva, abaixo de −0,8 é negativa e no meio é neutra. Com poucas respostas o intervalo fica largo: a ferramenta avisa quando ainda é cedo para concluir.",
      },
      {
        titulo: "Comparar versões",
        texto:
          "Em estudos com mais de uma versão, o modo de comparação põe as médias das versões lado a lado, escala por escala, com a diferença entre elas. Olhe os intervalos de confiança antes de concluir que uma versão é melhor.",
      },
      {
        titulo: "Exportar",
        texto:
          "No fim da página você baixa os dados em CSV (no formato da planilha oficial do UEQ) e o painel em PDF, para o relatório.",
      },
    ],
  },
  respostas: {
    titulo: "Respostas",
    resumo: "Cada participação concluída, com as marcadas como suspeitas e as que estão fora da análise.",
    secoes: [
      {
        titulo: "Respostas suspeitas",
        texto:
          "A ferramenta marca como suspeita quem respondeu de forma inconsistente em 3 ou mais escalas, ou marcou mais de 15 itens na mesma posição (regras do Handbook do UEQ). Suspeita é só um alerta: quem decide é você.",
      },
      {
        titulo: "Tirar ou devolver à análise",
        texto:
          "A coluna “Na análise” tira ou devolve cada resposta ao cálculo, e “Tirar suspeitas da análise” faz isso com todas as suspeitas de uma vez. O painel de Resultados recalcula na hora. Nada é apagado.",
      },
      {
        titulo: "Importar respostas",
        texto:
          "Se você aplicou o questionário fora da ferramenta (papel, outro formulário), importe um CSV no formato da planilha oficial. As importadas aparecem marcadas na tabela.",
      },
    ],
  },
  importar: {
    titulo: "Importar respostas",
    resumo: "Traga para o estudo respostas coletadas fora da ferramenta.",
    secoes: [
      {
        titulo: "Formato do arquivo",
        texto:
          "Um CSV com 26 colunas (uma por item, na ordem oficial) e uma linha por participante, com valores de 1 a 7, como na aba Data da planilha do UEQ.",
      },
      {
        titulo: "Conferência antes de gravar",
        texto: "A ferramenta mostra quantas linhas leu e os problemas que achou antes de importar. Nada é gravado até você confirmar.",
      },
    ],
  },
  conta: {
    titulo: "Minha conta",
    resumo: "Seus dados de acesso e a exclusão da conta.",
    secoes: [
      {
        titulo: "Nome e e-mail",
        texto:
          "O e-mail é o que você usa para entrar e também como as outras pessoas da equipe convidam você para um estudo.",
      },
      {
        titulo: "Notificações por e-mail",
        texto: "Ligado, cada aviso do sino também chega no seu e-mail. Desligado, os avisos ficam só no sino.",
      },
      {
        titulo: "Senha",
        texto: "Ao trocar a senha, as outras sessões abertas (em outro computador, por exemplo) são encerradas.",
      },
      {
        titulo: "Seus dados (LGPD)",
        texto:
          "No resumo ao lado, “Baixar meus dados” gera um arquivo com tudo o que a ferramenta guarda sobre a sua conta, e “Política de privacidade” explica o que é guardado, para quê e como é protegido.",
      },
      {
        titulo: "Excluir conta",
        texto:
          "Apaga a conta, os estudos de que você é dono e todas as respostas deles. Estudos de outras pessoas compartilhados com você continuam com os donos.",
      },
    ],
  },
  notificacoes: {
    titulo: "Notificações",
    resumo: "Tudo o que aconteceu nos estudos que você acompanha, do mais recente ao mais antigo.",
    secoes: [
      {
        titulo: "O que avisa",
        texto:
          "Convites para estudos, respostas novas (agrupadas: dez respostas numa manhã viram um aviso só) e mudanças feitas por outras pessoas da equipe, como editar o estudo, abrir ou encerrar a coleta, importar respostas ou tirar respostas da análise. O que você mesmo faz não gera aviso.",
      },
      {
        titulo: "Aceitar ou recusar convites",
        texto:
          "Ao aceitar, o estudo passa a aparecer em “Seus estudos”, na seção “Compartilhados com você”. Ao recusar, quem convidou é avisado e pode convidar de novo depois.",
      },
      {
        titulo: "Por e-mail",
        texto:
          "Cada aviso também vai para o seu e-mail. Se preferir só o sino, desligue em Minha conta, na seção Notificações.",
      },
      {
        titulo: "Papéis",
        texto:
          "Editor pode editar o estudo, abrir e encerrar a coleta, importar respostas e tirar respostas da análise. Leitor vê o painel e as respostas e exporta, sem mudar nada. Excluir o estudo e convidar pessoas é só com o dono.",
      },
    ],
  },
  administracao: {
    titulo: "Administração",
    resumo: "Ferramentas do superusuário: contas, estudos de demonstração e todos os estudos da ferramenta.",
    secoes: [
      {
        titulo: "Criar conta",
        texto:
          "Crie a conta de quem vai testar ou avaliar a ferramenta e passe o e-mail e a senha para a pessoa. No primeiro acesso ela vê o tour guiado e pode trocar a senha em Minha conta.",
      },
      {
        titulo: "Cenários de demonstração",
        texto:
          "Cria três estudos com dados inventados: uma comparação A/B com a coleta aberta e respostas suspeitas, um estudo encerrado com respostas importadas e um rascunho. Escolha o dono e com quem compartilhar.",
      },
      {
        titulo: "Todos os estudos",
        texto:
          "O administrador abre qualquer estudo da ferramenta, com acesso total. Use com cuidado: as respostas são de participantes reais.",
      },
    ],
  },
} as const satisfies Record<string, AjudaPagina>;

export type ChaveAjuda = keyof typeof AJUDA;
