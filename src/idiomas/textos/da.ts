import type { TextosParticipante } from "../tipos";

export const da: TextosParticipante = {
  pularConteudo: "Gå til indholdet",
  aguarde: "Vent…",
  idioma: {
    rotulo: "Sprog",
    aplicar: "Anvend",
    naoAprovada: "Oversættelsen af spørgeskemaet til dette sprog er endnu ikke endeligt godkendt af UEQ’s forfattere.",
  },
  etapas: {
    nomes: ["Samtykke", "Spørgeskema", "Frivillige oplysninger"],
    rotulo: "Trin i deltagelsen",
    rotuloConcluidas: "Trin i deltagelsen, alle gennemført",
    etapaDeTotal: "Trin {n} af {total} · {nome}",
  },
  titulos: {
    consentimento: "Samtykke",
    indisponivel: "Undersøgelsen er ikke tilgængelig",
    jaRespondeu: "Du har allerede svaret",
    questionario: "Spørgeskema",
    dadosOpcionais: "Frivillige oplysninger",
    registradas: "Svar registreret",
    encerrada: "Deltagelse afsluttet",
  },
  consentimento: {
    subtitulo: "Undersøgelse af brugeroplevelse · PPGIa PUCPR",
    termoTitulo: "Samtykkeerklæring",
    termoTexto: "Du skal angive dit indtryk af produktet på 26 par modsatte ord.",
    condicoes: [
      ["Tid", "3 til 5 minutter."],
      ["Deltagelse", "Frivillig. Du kan stoppe når som helst uden at give en grund, og intet af det, du har markeret, bliver gemt."],
      ["Anonymitet", "Vi indsamler ikke navn, e-mail, IP-adresse eller andre oplysninger, der kan identificere dig."],
      ["Brug af data", "Svarene analyseres samlet og kun til denne undersøgelse."],
    ],
    concordo: "Jeg accepterer og vil gerne deltage",
    naoQuero: "Jeg vil ikke deltage",
    privacidade: "Privatlivspolitik",
  },
  politica: {
    voltar: "Tilbage",
    semTraducao: "Denne politik er endnu ikke oversat til dit sprog og vises på portugisisk.",
  },
  fechado: {
    rascunho: {
      etapa: "Kladde",
      titulo: "Undersøgelsen er ikke åben endnu",
      texto: "Indsamlingen af svar er ikke begyndt endnu. Prøv igen senere, eller kontakt den person, der sendte dig linket.",
    },
    encerrado: {
      etapa: "Lukket",
      titulo: "Indsamlingen til denne undersøgelse er afsluttet",
      texto: "Undersøgelsen modtager ikke flere svar. Tak for din interesse.",
    },
  },
  jaRespondeu: {
    titulo: "Du har allerede besvaret denne undersøgelse",
    texto: "Dine svar er registreret. Tak for din deltagelse. Du kan nu lukke denne side.",
  },
  questionario: {
    recuperadas: "Vi har genskabt de svar, du allerede havde markeret.",
    naoDeuEnviar: "Svarene kunne ikke sendes",
    faltam: { one: "{n} linje mangler", other: "{n} linjer mangler" },
    marqueCadaUm: "Sæt flueben ved én cirkel i hver af dem for at sende. Dine andre svar er stadig markeret.",
    irParaItem: "Gå til linje {n}",
    enviar: "Send svar",
    todosRespondidos: "Alle {total} linjer er besvaret. Du kan sende nu.",
    parcial: "{n} af {total} besvaret.",
    erroEncerrada: "Indsamlingen til denne undersøgelse blev afsluttet, mens du svarede. Dine svar blev ikke gemt.",
    erroSemParticipacao: "Vi kunne ikke finde din deltagelse. Åbn linket til undersøgelsen igen for at starte forfra.",
    legenda: "Linje {n} af {total}: {esquerdo} eller {direito}",
    naoRespondido: "Denne linje er ikke besvaret",
    posicao: "{p} af 7, tættere på {termo}",
    centro: "4 af 7, midten",
    contagem: "{n} af {total} besvaret",
    sair: "Forlad uden at sende",
    perguntaSair: "Forlad uden at sende? Intet af det, du har markeret, bliver gemt.",
    continuar: "Fortsæt med at svare",
  },
  sobreVoce: {
    titulo: "Om dig",
    descricao:
      "Disse spørgsmål er frivillige og hjælper med at beskrive gruppen af deltagere. Alle har muligheden “Vil ikke oplyse”.",
    faixaEtaria: {
      titulo: "Aldersgruppe",
      opcoes: ["18 til 24 år", "25 til 34 år", "35 til 44 år", "45 til 59 år", "60 år eller ældre"],
    },
    genero: { titulo: "Køn", opcoes: ["Kvinde", "Mand", "Andet"] },
    escolaridade: {
      titulo: "Uddannelse",
      opcoes: ["Grundskole", "Ungdomsuddannelse", "Videregående uddannelse", "Ph.d. eller tilsvarende"],
    },
    familiaridadeComProduto: {
      titulo: "Havde du brugt dette produkt før?",
      opcoes: ["Aldrig", "Et par gange", "Ofte"],
    },
    prefiroNao: "Vil ikke oplyse",
    continuar: "Fortsæt",
    pular: "Spring dette trin over",
  },
  fim: {
    titulo: "Svar registreret",
    texto: "Tak for din deltagelse. Dine svar er gemt anonymt.",
    nota: "Du kan nu lukke denne side. Der bliver ikke spurgt om mere.",
  },
  saiu: {
    titulo: "Du har forladt undersøgelsen",
    texto: "Ingen af dine svar er gemt. Tak for din opmærksomhed. Du kan nu lukke denne side.",
  },
};
