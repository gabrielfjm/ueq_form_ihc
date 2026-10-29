import type { TextosParticipante } from "../tipos";

// Textos originais das telas (protótipo de alta fidelidade, p1 a p7)
export const pt: TextosParticipante = {
  pularConteudo: "Pular para o conteúdo",
  idioma: {
    rotulo: "Idioma",
    aplicar: "Aplicar",
    naoAprovada: "A tradução do questionário para este idioma ainda não foi aprovada em definitivo pelos autores do UEQ.",
  },
  etapas: {
    nomes: ["Consentimento", "Questionário", "Dados opcionais"],
    rotulo: "Etapas da participação",
    rotuloConcluidas: "Etapas da participação, todas concluídas",
    etapaDeTotal: "Etapa {n} de {total} · {nome}",
  },
  titulos: {
    consentimento: "Consentimento",
    indisponivel: "Estudo indisponível",
    jaRespondeu: "Você já respondeu",
    questionario: "Questionário",
    dadosOpcionais: "Dados opcionais",
    registradas: "Respostas registradas",
    encerrada: "Participação encerrada",
  },
  consentimento: {
    subtitulo: "Pesquisa de experiência do usuário · PPGIa PUCPR",
    termoTitulo: "Termo de consentimento",
    termoTexto: "Você vai indicar sua impressão sobre o produto em 26 pares de palavras opostas.",
    condicoes: [
      ["Tempo", "De 3 a 5 minutos."],
      ["Participação", "Voluntária. Você pode desistir a qualquer momento, sem dar motivo, e nada do que marcou será gravado."],
      ["Anonimato", "Não coletamos nome, e-mail, endereço IP nem outro dado que identifique você."],
      ["Uso dos dados", "As respostas são analisadas em conjunto, apenas para esta pesquisa."],
    ],
    concordo: "Concordo e quero participar",
    naoQuero: "Não quero participar",
  },
  fechado: {
    rascunho: {
      etapa: "Rascunho",
      titulo: "Este estudo ainda não está aberto",
      texto: "A coleta de respostas ainda não começou. Tente de novo mais tarde ou fale com quem enviou o link.",
    },
    encerrado: {
      etapa: "Encerrado",
      titulo: "A coleta deste estudo foi encerrada",
      texto: "O estudo não aceita mais respostas. Obrigado pelo interesse em participar.",
    },
  },
  jaRespondeu: {
    titulo: "Você já respondeu este estudo",
    texto: "Suas respostas foram registradas. Obrigado por participar. Você já pode fechar esta página.",
  },
  questionario: {
    recuperadas: "Recuperamos as respostas que você já tinha marcado.",
    naoDeuEnviar: "Não deu para enviar",
    faltam: { one: "Falta {n} item", other: "Faltam {n} itens" },
    marqueCadaUm: "Marque uma opção em cada um para enviar. Suas outras respostas continuam marcadas.",
    irParaItem: "Ir para o item {n}",
    enviar: "Enviar respostas",
    todosRespondidos: "Todos os {total} itens respondidos. Você já pode enviar.",
    parcial: "{n} de {total} respondidos.",
    erroEncerrada: "A coleta deste estudo foi encerrada enquanto você respondia. Suas respostas não foram gravadas.",
    erroSemParticipacao: "Não encontramos sua participação. Abra o link do estudo de novo para recomeçar.",
    legenda: "Item {n} de {total}: {esquerdo} ou {direito}",
    naoRespondido: "Este item não foi respondido",
    posicao: "{p} de 7, mais perto de {termo}",
    centro: "4 de 7, centro",
    contagem: "{n} de {total} respondidos",
    sair: "Sair sem enviar",
    perguntaSair: "Sair sem enviar? Nada do que você marcou será gravado.",
    continuar: "Continuar respondendo",
  },
  sobreVoce: {
    titulo: "Sobre você",
    descricao:
      "Estas perguntas são opcionais e ajudam a descrever o grupo de participantes. Todas têm a opção “Prefiro não responder”.",
    faixaEtaria: {
      titulo: "Faixa etária",
      opcoes: ["18 a 24 anos", "25 a 34 anos", "35 a 44 anos", "45 a 59 anos", "60 anos ou mais"],
    },
    genero: { titulo: "Gênero", opcoes: ["Mulher", "Homem", "Outro"] },
    escolaridade: {
      titulo: "Escolaridade",
      opcoes: ["Ensino fundamental", "Ensino médio", "Ensino superior", "Pós-graduação"],
    },
    familiaridadeComProduto: {
      titulo: "Você já usava este produto?",
      opcoes: ["Nunca tinha usado", "Algumas vezes", "Com frequência"],
    },
    prefiroNao: "Prefiro não responder",
    continuar: "Continuar",
    pular: "Pular esta etapa",
  },
  fim: {
    titulo: "Respostas registradas",
    texto: "Obrigado por participar. Suas respostas foram gravadas de forma anônima.",
    nota: "Você já pode fechar esta página. Nada mais será pedido.",
  },
  saiu: {
    titulo: "Você saiu do estudo",
    texto: "Nenhuma resposta sua foi gravada. Obrigado pela atenção. Você já pode fechar esta página.",
  },
};
