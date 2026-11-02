import { m } from "@/traducao/nucleo";
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
    titulo: m("Seus estudos"),
    resumo: m("A lista de todos os estudos que você pode abrir: os seus e os que outras pessoas compartilharam com você."),
    secoes: [
      {
        titulo: m("O que tem na tabela"),
        texto:
          m("Cada linha é um estudo, do atualizado mais recentemente ao mais antigo. Status diz se a coleta está em rascunho, aberta ou encerrada; a régua mostra onde hoje cai no período da coleta; Respostas conta só quem terminou o questionário."),
      },
      {
        titulo: m("Criar um estudo"),
        texto:
          m("Use “Criar estudo” para começar: título, produto avaliado, objetivo, período e as versões que vão ser comparadas. O estudo nasce em rascunho e só recebe respostas depois de você abrir a coleta."),
      },
      {
        titulo: m("Compartilhados com você"),
        texto:
          m("Quando alguém da equipe convida você e você aceita, o estudo aparece na seção “Compartilhados com você”, com o nome de quem é o dono e o seu papel: Editor pode mexer no estudo; Leitor só vê e exporta."),
      },
      {
        titulo: m("Sino de notificações"),
        texto:
          m("O sino na barra do topo, entre Minha conta e Sair, mostra quantas novidades você ainda não viu: convites (que você aceita ou recusa ali mesmo), respostas que chegaram e mudanças que outras pessoas fizeram nos seus estudos."),
      },
    ],
  },
  "novo-estudo": {
    titulo: m("Criar estudo"),
    resumo: m("O formulário que define o que vai ser avaliado e quem vai responder o quê."),
    secoes: [
      {
        titulo: m("Dados do estudo"),
        texto:
          m("Título e produto aparecem para você; o objetivo também aparece para o participante, na tela de consentimento. Escreva em linguagem simples."),
      },
      {
        titulo: m("Idioma do questionário"),
        texto:
          m("O link abre no idioma escolhido, e o participante pode trocar para qualquer um dos 37 idiomas do UEQ. Os 26 pares de palavras usam a tradução oficial; título, produto e objetivo são traduzidos automaticamente."),
      },
      {
        titulo: m("Período"),
        texto: m("As datas de início e fim são só referência para a equipe: quem decide se o link aceita respostas é o botão de abrir e encerrar a coleta."),
      },
      {
        titulo: m("Versões"),
        texto:
          m("Para comparar duas ou mais versões do produto (teste A/B), adicione uma versão para cada. O link é um só: a ferramenta distribui cada participante para a versão com menos respostas, para os grupos ficarem equilibrados."),
      },
      {
        titulo: m("Dados do participante (LGPD)"),
        texto:
          m("Desligado por padrão. Ligue só se o estudo precisar de faixa etária, gênero, escolaridade e familiaridade com o produto. Ligado, o participante vê no fim uma etapa opcional e pode responder ou pular direto para o agradecimento; nada identifica a pessoa."),
      },
      {
        titulo: m("Prévia"),
        texto: m("Ao lado do formulário você vê como o participante vai receber o convite, antes de criar."),
      },
    ],
  },
  "editar-estudo": {
    titulo: m("Editar estudo"),
    resumo: m("Mude os dados, o período ou as versões do estudo."),
    secoes: [
      {
        titulo: m("O que dá para mudar"),
        texto:
          m("Tudo pode ser mudado a qualquer momento, inclusive ligar ou desligar a coleta de dados demográficos (vale para as próximas respostas). Só não dá para remover uma versão que já tem respostas, para não perder dados."),
      },
      {
        titulo: m("Salvar ou descartar"),
        texto: m("Nada muda até você salvar. Para desistir, volte para o estudo sem salvar."),
      },
    ],
  },
  estudo: {
    titulo: m("Visão geral do estudo"),
    resumo: m("O resumo do estudo, o link da coleta e as ações que mudam o estado dele."),
    secoes: [
      {
        titulo: m("Link da coleta"),
        texto:
          m("É o endereço que você manda para os participantes. Ele funciona nos 37 idiomas oficiais do UEQ e só aceita respostas enquanto a coleta está aberta."),
      },
      {
        titulo: m("Abrir, encerrar e reabrir"),
        texto:
          m("Em rascunho, o link mostra que o questionário está em preparação. Abrir a coleta começa a aceitar respostas; encerrar para de aceitar, e dá para reabrir depois sem perder nada."),
      },
      {
        titulo: m("Compartilhar"),
        texto:
          m("O botão “Compartilhar” convida outra pessoa com conta na ferramenta para trabalhar no estudo, como Editor ou Leitor. Ela recebe o convite no sino de notificações e por e-mail."),
      },
      {
        titulo: m("Abas"),
        texto: m("Resultados mostra o painel com as seis escalas e o benchmark; Respostas lista cada participação e as suspeitas."),
      },
    ],
  },
  resultados: {
    titulo: m("Resultados"),
    resumo: m("O painel do UEQ: médias das seis escalas, comparação com o benchmark, itens e exportações."),
    secoes: [
      {
        titulo: m("Escalas e benchmark"),
        texto:
          m("Cada barra é a média de uma escala, de −3 a +3, com o intervalo de confiança de 95%. O fundo em faixas mostra o benchmark do UEQ: onde o produto cai em relação a centenas de outros produtos avaliados."),
      },
      {
        titulo: m("Leitura rápida"),
        texto:
          m("Acima de +0,8 é avaliação positiva, abaixo de −0,8 é negativa e no meio é neutra. Com poucas respostas o intervalo fica largo: a ferramenta avisa quando ainda é cedo para concluir."),
      },
      {
        titulo: m("Comparar versões"),
        texto:
          m("Em estudos com mais de uma versão, o modo de comparação põe as médias das versões lado a lado, escala por escala, com a diferença entre elas. Olhe os intervalos de confiança antes de concluir que uma versão é melhor."),
      },
      {
        titulo: m("Exportar"),
        texto:
          m("No fim da página você baixa os dados em CSV (no formato da planilha oficial do UEQ) e o painel em PDF, para o relatório."),
      },
      {
        titulo: m("Dados demográficos"),
        texto:
          m("Quando o estudo coleta dados demográficos, a sub-aba “Dados demográficos” mostra cada pergunta no gráfico que combina com ela: faixa etária em colunas, gênero e escolaridade em barras e familiaridade numa barra dividida. “Ver os números” abre a tabela de cada gráfico."),
      },
    ],
  },
  respostas: {
    titulo: m("Respostas"),
    resumo: m("Cada participação concluída, com as marcadas como suspeitas e as que estão fora da análise."),
    secoes: [
      {
        titulo: m("Respostas suspeitas"),
        texto:
          m("A ferramenta marca como suspeita quem respondeu de forma inconsistente em 3 ou mais escalas, ou marcou mais de 15 itens na mesma posição (regras do Handbook do UEQ). Suspeita é só um alerta: quem decide é você."),
      },
      {
        titulo: m("Tirar ou devolver à análise"),
        texto:
          m("A coluna “Na análise” tira ou devolve cada resposta ao cálculo, e “Tirar suspeitas da análise” faz isso com todas as suspeitas de uma vez. O painel de Resultados recalcula na hora. Nada é apagado."),
      },
      {
        titulo: m("Importar respostas"),
        texto:
          m("Se você aplicou o questionário fora da ferramenta (papel, outro formulário), importe um CSV no formato da planilha oficial. As importadas aparecem marcadas na tabela."),
      },
    ],
  },
  importar: {
    titulo: m("Importar respostas"),
    resumo: m("Traga para o estudo respostas coletadas fora da ferramenta."),
    secoes: [
      {
        titulo: m("Formato do arquivo"),
        texto:
          m("Um CSV com 26 colunas (uma por item, na ordem oficial) e uma linha por participante, com valores de 1 a 7, como na aba Data da planilha do UEQ."),
      },
      {
        titulo: m("Conferência antes de gravar"),
        texto: m("A ferramenta mostra quantas linhas leu e os problemas que achou antes de importar. Nada é gravado até você confirmar."),
      },
    ],
  },
  conta: {
    titulo: m("Minha conta"),
    resumo: m("Seus dados de acesso e a exclusão da conta."),
    secoes: [
      {
        titulo: m("Nome e e-mail"),
        texto:
          m("O e-mail é o que você usa para entrar e também como as outras pessoas da equipe convidam você para um estudo."),
      },
      {
        titulo: m("Notificações por e-mail"),
        texto: m("Ligado, cada aviso do sino também chega no seu e-mail. Desligado, os avisos ficam só no sino."),
      },
      {
        titulo: m("Senha"),
        texto: m("Ao trocar a senha, as outras sessões abertas (em outro computador, por exemplo) são encerradas."),
      },
      {
        titulo: m("Idioma"),
        texto:
          m("O idioma da ferramenta inteira, dos avisos e dos e-mails que você recebe. Também é o idioma em que seus estudos novos nascem; cada estudo pode ter outro, no formulário."),
      },
      {
        titulo: m("Seus dados (LGPD)"),
        texto:
          m("No resumo ao lado, “Baixar meus dados” gera um arquivo com tudo o que a ferramenta guarda sobre a sua conta, e “Política de privacidade” explica o que é guardado, para quê e como é protegido."),
      },
      {
        titulo: m("Excluir conta"),
        texto:
          m("Apaga a conta, os estudos de que você é dono e todas as respostas deles. Estudos de outras pessoas compartilhados com você continuam com os donos."),
      },
    ],
  },
  notificacoes: {
    titulo: m("Notificações"),
    resumo: m("Tudo o que aconteceu nos estudos que você acompanha, do mais recente ao mais antigo."),
    secoes: [
      {
        titulo: m("O que avisa"),
        texto:
          m("Convites para estudos, respostas novas (agrupadas: dez respostas numa manhã viram um aviso só) e mudanças feitas por outras pessoas da equipe, como editar o estudo, abrir ou encerrar a coleta, importar respostas ou tirar respostas da análise. O que você mesmo faz não gera aviso."),
      },
      {
        titulo: m("Aceitar ou recusar convites"),
        texto:
          m("Ao aceitar, o estudo passa a aparecer em “Seus estudos”, na seção “Compartilhados com você”. Ao recusar, quem convidou é avisado e pode convidar de novo depois."),
      },
      {
        titulo: m("Por e-mail"),
        texto:
          m("Cada aviso também vai para o seu e-mail. Se preferir só o sino, desligue em Minha conta, na seção Notificações."),
      },
      {
        titulo: m("Papéis"),
        texto:
          m("Editor pode editar o estudo, abrir e encerrar a coleta, importar respostas e tirar respostas da análise. Leitor vê o painel e as respostas e exporta, sem mudar nada. Excluir o estudo e convidar pessoas é só com o dono."),
      },
    ],
  },
  administracao: {
    titulo: m("Administração"),
    resumo: m("O painel do superusuário. Cada cartão abre a página da ação."),
    secoes: [
      {
        titulo: m("Contas e Criar conta para alguém"),
        texto:
          m("Veja quem tem conta, torne alguém administrador e crie a conta de quem vai testar ou avaliar a ferramenta. No primeiro acesso a pessoa faz o tour e pode trocar a senha em Minha conta."),
      },
      {
        titulo: m("Cenários de demonstração"),
        texto:
          m("Cria três estudos com dados inventados (A/B com coleta aberta, encerrado com respostas importadas e um rascunho), com o dono e as pessoas que você escolher."),
      },
      {
        titulo: m("Proteção de dados"),
        texto:
          m("Mostra se a criptografia e o envio de e-mails estão configurados em produção. O administrador não vê os estudos nem as respostas de ninguém: só a quantidade de estudos de cada conta."),
      },
      {
        titulo: m("Idiomas"),
        texto:
          m("A ferramenta é traduzida para os 37 idiomas do UEQ pela API do Claude. Cada idioma é traduzido sozinho na primeira visita de quem o usa; “Traduzir agora” adianta isso. Sem a chave ANTHROPIC_API_KEY, tudo fica em português."),
      },
    ],
  },
} as const satisfies Record<string, AjudaPagina>;

export type ChaveAjuda = keyof typeof AJUDA;
