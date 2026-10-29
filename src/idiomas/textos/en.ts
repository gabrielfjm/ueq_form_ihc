import type { TextosParticipante } from "../tipos";

export const en: TextosParticipante = {
  pularConteudo: "Skip to content",
  idioma: {
    rotulo: "Language",
    aplicar: "Apply",
    naoAprovada: "The questionnaire translation for this language has not yet been finally approved by the UEQ authors.",
  },
  etapas: {
    nomes: ["Consent", "Questionnaire", "Optional data"],
    rotulo: "Participation steps",
    rotuloConcluidas: "Participation steps, all completed",
    etapaDeTotal: "Step {n} of {total} · {nome}",
  },
  titulos: {
    consentimento: "Consent",
    indisponivel: "Study unavailable",
    jaRespondeu: "You have already responded",
    questionario: "Questionnaire",
    dadosOpcionais: "Optional data",
    registradas: "Responses recorded",
    encerrada: "Participation ended",
  },
  consentimento: {
    subtitulo: "User experience research · PPGIa PUCPR",
    termoTitulo: "Consent form",
    termoTexto: "You will rate your impression of the product on 26 pairs of opposite words.",
    condicoes: [
      ["Time", "3 to 5 minutes."],
      ["Participation", "Voluntary. You can quit at any time, without giving a reason, and nothing you marked will be saved."],
      ["Anonymity", "We do not collect your name, email, IP address or any other data that identifies you."],
      ["Use of data", "Responses are analysed together, only for this research."],
    ],
    concordo: "I agree and want to take part",
    naoQuero: "I do not want to take part",
  },
  fechado: {
    rascunho: {
      etapa: "Draft",
      titulo: "This study is not open yet",
      texto: "Response collection has not started yet. Try again later or contact the person who sent you the link.",
    },
    encerrado: {
      etapa: "Closed",
      titulo: "Response collection for this study has ended",
      texto: "The study no longer accepts responses. Thank you for your interest in taking part.",
    },
  },
  jaRespondeu: {
    titulo: "You have already responded to this study",
    texto: "Your responses have been recorded. Thank you for taking part. You can now close this page.",
  },
  questionario: {
    recuperadas: "We recovered the answers you had already marked.",
    naoDeuEnviar: "Your answers could not be sent",
    faltam: { one: "{n} item left", other: "{n} items left" },
    marqueCadaUm: "Mark one option in each of them to send. Your other answers are still marked.",
    irParaItem: "Go to item {n}",
    enviar: "Send answers",
    todosRespondidos: "All {total} items answered. You can send now.",
    parcial: "{n} of {total} answered.",
    erroEncerrada: "Response collection for this study ended while you were answering. Your answers were not saved.",
    erroSemParticipacao: "We could not find your participation. Open the study link again to start over.",
    legenda: "Item {n} of {total}: {esquerdo} or {direito}",
    naoRespondido: "This item has not been answered",
    posicao: "{p} of 7, closer to {termo}",
    centro: "4 of 7, centre",
    contagem: "{n} of {total} answered",
    sair: "Leave without sending",
    perguntaSair: "Leave without sending? Nothing you marked will be saved.",
    continuar: "Keep answering",
  },
  sobreVoce: {
    titulo: "About you",
    descricao:
      "These questions are optional and help describe the group of participants. All of them have the option “Prefer not to say”.",
    faixaEtaria: {
      titulo: "Age group",
      opcoes: ["18 to 24 years", "25 to 34 years", "35 to 44 years", "45 to 59 years", "60 years or older"],
    },
    genero: { titulo: "Gender", opcoes: ["Woman", "Man", "Other"] },
    escolaridade: {
      titulo: "Education",
      opcoes: ["Primary school", "Secondary school", "University degree", "Postgraduate degree"],
    },
    familiaridadeComProduto: {
      titulo: "Had you used this product before?",
      opcoes: ["Never", "A few times", "Often"],
    },
    prefiroNao: "Prefer not to say",
    continuar: "Continue",
    pular: "Skip this step",
  },
  fim: {
    titulo: "Responses recorded",
    texto: "Thank you for taking part. Your responses were saved anonymously.",
    nota: "You can now close this page. Nothing else will be asked.",
  },
  saiu: {
    titulo: "You left the study",
    texto: "None of your answers were saved. Thank you for your time. You can now close this page.",
  },
};
