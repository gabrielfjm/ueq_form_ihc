import type { TextosParticipante } from "../tipos";

export const sv: TextosParticipante = {
  pularConteudo: "Hoppa till innehållet",
  aguarde: "Vänta…",
  idioma: {
    rotulo: "Språk",
    aplicar: "Använd",
    naoAprovada: "Översättningen av frågeformuläret till det här språket är ännu inte slutgiltigt godkänd av UEQ:s upphovspersoner.",
  },
  etapas: {
    nomes: ["Samtycke", "Frågeformulär", "Frivilliga uppgifter"],
    rotulo: "Steg i deltagandet",
    rotuloConcluidas: "Steg i deltagandet, alla klara",
    etapaDeTotal: "Steg {n} av {total} · {nome}",
  },
  titulos: {
    consentimento: "Samtycke",
    indisponivel: "Studien är inte tillgänglig",
    jaRespondeu: "Du har redan svarat",
    questionario: "Frågeformulär",
    dadosOpcionais: "Frivilliga uppgifter",
    registradas: "Svaren är registrerade",
    encerrada: "Deltagandet avslutat",
  },
  consentimento: {
    subtitulo: "Studie om användarupplevelse · PPGIa PUCPR",
    termoTitulo: "Samtyckesformulär",
    termoTexto: "Du anger ditt intryck av produkten på 26 par motsatta ord.",
    condicoes: [
      ["Tid", "3 till 5 minuter."],
      ["Deltagande", "Frivilligt. Du kan avbryta när som helst utan att ange skäl, och inget av det du har markerat sparas."],
      ["Anonymitet", "Vi samlar inte in namn, e-post, IP-adress eller andra uppgifter som kan identifiera dig."],
      ["Användning av data", "Svaren analyseras tillsammans och bara för den här studien."],
    ],
    concordo: "Jag godkänner och vill delta",
    naoQuero: "Jag vill inte delta",
    privacidade: "Integritetspolicy",
  },
  politica: {
    voltar: "Tillbaka",
    semTraducao: "Den här policyn är ännu inte översatt till ditt språk och visas på portugisiska.",
  },
  fechado: {
    rascunho: {
      etapa: "Utkast",
      titulo: "Studien är inte öppen ännu",
      texto: "Insamlingen av svar har inte börjat ännu. Försök igen senare eller kontakta den som skickade länken.",
    },
    encerrado: {
      etapa: "Stängd",
      titulo: "Insamlingen för den här studien är avslutad",
      texto: "Studien tar inte emot fler svar. Tack för ditt intresse.",
    },
  },
  jaRespondeu: {
    titulo: "Du har redan svarat på den här studien",
    texto: "Dina svar är registrerade. Tack för att du deltog. Du kan stänga sidan nu.",
  },
  questionario: {
    recuperadas: "Vi har återställt svaren som du redan hade markerat.",
    naoDeuEnviar: "Svaren kunde inte skickas",
    faltam: { one: "{n} rad kvar", other: "{n} rader kvar" },
    marqueCadaUm: "Kryssa i en cirkel på var och en för att skicka. Dina andra svar är fortfarande markerade.",
    irParaItem: "Gå till rad {n}",
    enviar: "Skicka svar",
    todosRespondidos: "Alla {total} rader är besvarade. Du kan skicka nu.",
    parcial: "{n} av {total} besvarade.",
    erroEncerrada: "Insamlingen för studien avslutades medan du svarade. Dina svar sparades inte.",
    erroSemParticipacao: "Vi hittade inte ditt deltagande. Öppna länken till studien igen för att börja om.",
    legenda: "Rad {n} av {total}: {esquerdo} eller {direito}",
    naoRespondido: "Den här raden är inte besvarad",
    posicao: "{p} av 7, närmare {termo}",
    centro: "4 av 7, mitten",
    contagem: "{n} av {total} besvarade",
    sair: "Avsluta utan att skicka",
    perguntaSair: "Avsluta utan att skicka? Inget av det du har markerat sparas.",
    continuar: "Fortsätt svara",
  },
  sobreVoce: {
    titulo: "Om dig",
    descricao:
      "Frågorna är frivilliga och hjälper till att beskriva gruppen av deltagare. Alla har alternativet ”Vill inte svara”.",
    faixaEtaria: {
      titulo: "Åldersgrupp",
      opcoes: ["18–24 år", "25–34 år", "35–44 år", "45–59 år", "60 år eller äldre"],
    },
    genero: { titulo: "Kön", opcoes: ["Kvinna", "Man", "Annat"] },
    escolaridade: {
      titulo: "Utbildning",
      opcoes: ["Grundskola", "Gymnasium", "Högskola eller universitet", "Forskarutbildning"],
    },
    familiaridadeComProduto: {
      titulo: "Hade du använt produkten tidigare?",
      opcoes: ["Aldrig", "Några gånger", "Ofta"],
    },
    prefiroNao: "Vill inte svara",
    continuar: "Fortsätt",
    pular: "Hoppa över det här steget",
  },
  fim: {
    titulo: "Svaren är registrerade",
    texto: "Tack för att du deltog. Dina svar har sparats anonymt.",
    nota: "Du kan stänga sidan nu. Inget mer kommer att efterfrågas.",
  },
  saiu: {
    titulo: "Du har lämnat studien",
    texto: "Inga av dina svar har sparats. Tack för din uppmärksamhet. Du kan stänga sidan nu.",
  },
};
