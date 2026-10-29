import type { TextosParticipante } from "../tipos";

export const nb: TextosParticipante = {
  pularConteudo: "Gå til innholdet",
  idioma: {
    rotulo: "Språk",
    aplicar: "Bruk",
    naoAprovada: "Oversettelsen av spørreskjemaet til dette språket er ennå ikke endelig godkjent av UEQ-forfatterne.",
  },
  etapas: {
    nomes: ["Samtykke", "Spørreskjema", "Valgfrie opplysninger"],
    rotulo: "Trinn i deltakelsen",
    rotuloConcluidas: "Trinn i deltakelsen, alle fullført",
    etapaDeTotal: "Trinn {n} av {total} · {nome}",
  },
  titulos: {
    consentimento: "Samtykke",
    indisponivel: "Studien er ikke tilgjengelig",
    jaRespondeu: "Du har allerede svart",
    questionario: "Spørreskjema",
    dadosOpcionais: "Valgfrie opplysninger",
    registradas: "Svarene er registrert",
    encerrada: "Deltakelsen er avsluttet",
  },
  consentimento: {
    subtitulo: "Undersøkelse om brukeropplevelse · PPGIa PUCPR",
    termoTitulo: "Samtykkeerklæring",
    termoTexto: "Du skal angi inntrykket ditt av produktet på 26 par motsatte ord.",
    condicoes: [
      ["Tid", "3 til 5 minutter."],
      ["Deltakelse", "Frivillig. Du kan avbryte når som helst uten å oppgi grunn, og ingenting av det du har merket, blir lagret."],
      ["Anonymitet", "Vi samler ikke inn navn, e-post, IP-adresse eller andre opplysninger som identifiserer deg."],
      ["Bruk av data", "Svarene analyseres samlet og bare for denne undersøkelsen."],
    ],
    concordo: "Jeg samtykker og vil delta",
    naoQuero: "Jeg vil ikke delta",
  },
  fechado: {
    rascunho: {
      etapa: "Utkast",
      titulo: "Denne studien er ikke åpnet ennå",
      texto: "Innsamlingen av svar har ikke startet ennå. Prøv igjen senere, eller kontakt den som sendte deg lenken.",
    },
    encerrado: {
      etapa: "Lukket",
      titulo: "Innsamlingen for denne studien er avsluttet",
      texto: "Studien tar ikke imot flere svar. Takk for interessen.",
    },
  },
  jaRespondeu: {
    titulo: "Du har allerede svart på denne studien",
    texto: "Svarene dine er registrert. Takk for at du deltok. Du kan lukke denne siden nå.",
  },
  questionario: {
    recuperadas: "Vi har gjenopprettet svarene du allerede hadde merket.",
    naoDeuEnviar: "Svarene kunne ikke sendes",
    faltam: { one: "{n} linje gjenstår", other: "{n} linjer gjenstår" },
    marqueCadaUm: "Merk av én runding på hver av dem for å sende. De andre svarene dine er fortsatt merket.",
    irParaItem: "Gå til linje {n}",
    enviar: "Send svarene",
    todosRespondidos: "Alle {total} linjene er besvart. Du kan sende nå.",
    parcial: "{n} av {total} besvart.",
    erroEncerrada: "Innsamlingen for studien ble avsluttet mens du svarte. Svarene dine ble ikke lagret.",
    erroSemParticipacao: "Vi fant ikke deltakelsen din. Åpne lenken til studien på nytt for å begynne på nytt.",
    legenda: "Linje {n} av {total}: {esquerdo} eller {direito}",
    naoRespondido: "Denne linjen er ikke besvart",
    posicao: "{p} av 7, nærmere {termo}",
    centro: "4 av 7, midten",
    contagem: "{n} av {total} besvart",
    sair: "Avslutt uten å sende",
    perguntaSair: "Avslutte uten å sende? Ingenting av det du har merket, blir lagret.",
    continuar: "Fortsett å svare",
  },
  sobreVoce: {
    titulo: "Om deg",
    descricao:
      "Disse spørsmålene er valgfrie og hjelper oss å beskrive gruppen av deltakere. Alle har alternativet «Vil ikke svare».",
    faixaEtaria: {
      titulo: "Aldersgruppe",
      opcoes: ["18–24 år", "25–34 år", "35–44 år", "45–59 år", "60 år eller eldre"],
    },
    genero: { titulo: "Kjønn", opcoes: ["Kvinne", "Mann", "Annet"] },
    escolaridade: {
      titulo: "Utdanning",
      opcoes: ["Grunnskole", "Videregående skole", "Høyere utdanning", "Doktorgrad eller tilsvarende"],
    },
    familiaridadeComProduto: {
      titulo: "Hadde du brukt dette produktet før?",
      opcoes: ["Aldri", "Noen ganger", "Ofte"],
    },
    prefiroNao: "Vil ikke svare",
    continuar: "Fortsett",
    pular: "Hopp over dette trinnet",
  },
  fim: {
    titulo: "Svarene er registrert",
    texto: "Takk for at du deltok. Svarene dine er lagret anonymt.",
    nota: "Du kan lukke denne siden nå. Det blir ikke spurt om noe mer.",
  },
  saiu: {
    titulo: "Du har forlatt studien",
    texto: "Ingen av svarene dine ble lagret. Takk for oppmerksomheten. Du kan lukke denne siden nå.",
  },
};
