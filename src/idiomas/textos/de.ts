import type { TextosParticipante } from "../tipos";

export const de: TextosParticipante = {
  pularConteudo: "Zum Inhalt springen",
  idioma: {
    rotulo: "Sprache",
    aplicar: "Übernehmen",
    naoAprovada: "Die Übersetzung des Fragebogens in diese Sprache ist von den Autoren des UEQ noch nicht endgültig freigegeben.",
  },
  etapas: {
    nomes: ["Einwilligung", "Fragebogen", "Optionale Angaben"],
    rotulo: "Schritte der Teilnahme",
    rotuloConcluidas: "Schritte der Teilnahme, alle abgeschlossen",
    etapaDeTotal: "Schritt {n} von {total} · {nome}",
  },
  titulos: {
    consentimento: "Einwilligung",
    indisponivel: "Studie nicht verfügbar",
    jaRespondeu: "Sie haben bereits teilgenommen",
    questionario: "Fragebogen",
    dadosOpcionais: "Optionale Angaben",
    registradas: "Antworten gespeichert",
    encerrada: "Teilnahme beendet",
  },
  consentimento: {
    subtitulo: "Studie zur User Experience · PPGIa PUCPR",
    termoTitulo: "Einwilligungserklärung",
    termoTexto: "Sie bewerten Ihren Eindruck vom Produkt anhand von 26 Paaren gegensätzlicher Begriffe.",
    condicoes: [
      ["Dauer", "3 bis 5 Minuten."],
      ["Teilnahme", "Freiwillig. Sie können jederzeit ohne Angabe von Gründen abbrechen, und nichts von dem, was Sie angekreuzt haben, wird gespeichert."],
      ["Anonymität", "Wir erfassen weder Namen noch E-Mail-Adresse, IP-Adresse oder andere Daten, die Sie identifizieren."],
      ["Verwendung der Daten", "Die Antworten werden gemeinsam ausgewertet, nur für diese Studie."],
    ],
    concordo: "Ich stimme zu und möchte teilnehmen",
    naoQuero: "Ich möchte nicht teilnehmen",
    privacidade: "Datenschutzerklärung",
  },
  politica: {
    voltar: "Zurück",
    semTraducao: "Diese Erklärung wurde noch nicht in Ihre Sprache übersetzt und wird auf Portugiesisch angezeigt.",
  },
  fechado: {
    rascunho: {
      etapa: "Entwurf",
      titulo: "Diese Studie ist noch nicht geöffnet",
      texto: "Die Erhebung hat noch nicht begonnen. Versuchen Sie es später noch einmal oder wenden Sie sich an die Person, die Ihnen den Link geschickt hat.",
    },
    encerrado: {
      etapa: "Beendet",
      titulo: "Die Erhebung dieser Studie ist beendet",
      texto: "Die Studie nimmt keine Antworten mehr an. Vielen Dank für Ihr Interesse an der Teilnahme.",
    },
  },
  jaRespondeu: {
    titulo: "Sie haben an dieser Studie bereits teilgenommen",
    texto: "Ihre Antworten wurden gespeichert. Vielen Dank für Ihre Teilnahme. Sie können diese Seite jetzt schließen.",
  },
  questionario: {
    recuperadas: "Wir haben die Antworten wiederhergestellt, die Sie bereits angekreuzt hatten.",
    naoDeuEnviar: "Die Antworten konnten nicht gesendet werden",
    faltam: { one: "Noch {n} Begriffspaar offen", other: "Noch {n} Begriffspaare offen" },
    marqueCadaUm: "Kreuzen Sie bei jedem eine Antwort an, um zu senden. Ihre übrigen Antworten bleiben angekreuzt.",
    irParaItem: "Zu Begriffspaar {n}",
    enviar: "Antworten senden",
    todosRespondidos: "Alle {total} Begriffspaare beantwortet. Sie können jetzt senden.",
    parcial: "{n} von {total} beantwortet.",
    erroEncerrada: "Die Erhebung dieser Studie wurde beendet, während Sie geantwortet haben. Ihre Antworten wurden nicht gespeichert.",
    erroSemParticipacao: "Wir haben Ihre Teilnahme nicht gefunden. Öffnen Sie den Link der Studie erneut, um neu zu beginnen.",
    legenda: "Begriffspaar {n} von {total}: {esquerdo} oder {direito}",
    naoRespondido: "Dieses Begriffspaar wurde nicht beantwortet",
    posicao: "{p} von 7, näher an {termo}",
    centro: "4 von 7, Mitte",
    contagem: "{n} von {total} beantwortet",
    sair: "Ohne Senden verlassen",
    perguntaSair: "Ohne Senden verlassen? Nichts von dem, was Sie angekreuzt haben, wird gespeichert.",
    continuar: "Weiter beantworten",
  },
  sobreVoce: {
    titulo: "Über Sie",
    descricao:
      "Diese Fragen sind freiwillig und helfen, die Gruppe der Teilnehmenden zu beschreiben. Alle haben die Option „Keine Angabe“.",
    faixaEtaria: {
      titulo: "Altersgruppe",
      opcoes: ["18 bis 24 Jahre", "25 bis 34 Jahre", "35 bis 44 Jahre", "45 bis 59 Jahre", "60 Jahre oder älter"],
    },
    genero: { titulo: "Geschlecht", opcoes: ["Frau", "Mann", "Divers"] },
    escolaridade: {
      titulo: "Bildungsabschluss",
      opcoes: ["Grundschule", "Weiterführende Schule", "Hochschulabschluss", "Postgraduales Studium"],
    },
    familiaridadeComProduto: {
      titulo: "Haben Sie dieses Produkt schon vorher benutzt?",
      opcoes: ["Noch nie", "Ein paar Mal", "Häufig"],
    },
    prefiroNao: "Keine Angabe",
    continuar: "Weiter",
    pular: "Diesen Schritt überspringen",
  },
  fim: {
    titulo: "Antworten gespeichert",
    texto: "Vielen Dank für Ihre Teilnahme. Ihre Antworten wurden anonym gespeichert.",
    nota: "Sie können diese Seite jetzt schließen. Es wird nichts mehr abgefragt.",
  },
  saiu: {
    titulo: "Sie haben die Studie verlassen",
    texto: "Keine Ihrer Antworten wurde gespeichert. Vielen Dank für Ihre Aufmerksamkeit. Sie können diese Seite jetzt schließen.",
  },
};
