import type { TextosParticipante } from "../tipos";

export const nl: TextosParticipante = {
  pularConteudo: "Naar de inhoud",
  idioma: {
    rotulo: "Taal",
    aplicar: "Toepassen",
    naoAprovada: "De vertaling van de vragenlijst in deze taal is nog niet definitief goedgekeurd door de auteurs van de UEQ.",
  },
  etapas: {
    nomes: ["Toestemming", "Vragenlijst", "Optionele gegevens"],
    rotulo: "Stappen van de deelname",
    rotuloConcluidas: "Stappen van de deelname, allemaal afgerond",
    etapaDeTotal: "Stap {n} van {total} · {nome}",
  },
  titulos: {
    consentimento: "Toestemming",
    indisponivel: "Onderzoek niet beschikbaar",
    jaRespondeu: "U hebt al gereageerd",
    questionario: "Vragenlijst",
    dadosOpcionais: "Optionele gegevens",
    registradas: "Antwoorden opgeslagen",
    encerrada: "Deelname beëindigd",
  },
  consentimento: {
    subtitulo: "Onderzoek naar gebruikerservaring · PPGIa PUCPR",
    termoTitulo: "Toestemmingsverklaring",
    termoTexto: "U geeft uw indruk van het product aan met 26 paren tegengestelde woorden.",
    condicoes: [
      ["Tijd", "3 tot 5 minuten."],
      ["Deelname", "Vrijwillig. U kunt op elk moment stoppen, zonder opgaaf van reden, en niets van wat u hebt aangevinkt wordt opgeslagen."],
      ["Anonimiteit", "Wij verzamelen geen naam, e-mailadres, IP-adres of andere gegevens die u identificeren."],
      ["Gebruik van de gegevens", "De antwoorden worden samen geanalyseerd, alleen voor dit onderzoek."],
    ],
    concordo: "Ik ga akkoord en wil deelnemen",
    naoQuero: "Ik wil niet deelnemen",
    privacidade: "Privacybeleid",
  },
  politica: {
    voltar: "Terug",
    semTraducao: "Dit beleid is nog niet in uw taal vertaald en wordt in het Portugees getoond.",
  },
  fechado: {
    rascunho: {
      etapa: "Concept",
      titulo: "Dit onderzoek is nog niet geopend",
      texto: "Het verzamelen van antwoorden is nog niet begonnen. Probeer het later opnieuw of neem contact op met degene die u de link stuurde.",
    },
    encerrado: {
      etapa: "Gesloten",
      titulo: "Het verzamelen voor dit onderzoek is beëindigd",
      texto: "Het onderzoek neemt geen antwoorden meer aan. Bedankt voor uw interesse.",
    },
  },
  jaRespondeu: {
    titulo: "U hebt dit onderzoek al ingevuld",
    texto: "Uw antwoorden zijn opgeslagen. Bedankt voor uw deelname. U kunt deze pagina nu sluiten.",
  },
  questionario: {
    recuperadas: "We hebben de antwoorden hersteld die u al had aangevinkt.",
    naoDeuEnviar: "De antwoorden konden niet worden verzonden",
    faltam: { one: "Nog {n} item open", other: "Nog {n} items open" },
    marqueCadaUm: "Vink bij elk ervan een rondje aan om te verzenden. Uw andere antwoorden blijven aangevinkt.",
    irParaItem: "Naar item {n}",
    enviar: "Antwoorden verzenden",
    todosRespondidos: "Alle {total} items zijn beantwoord. U kunt nu verzenden.",
    parcial: "{n} van {total} beantwoord.",
    erroEncerrada: "Het verzamelen voor dit onderzoek is beëindigd terwijl u antwoordde. Uw antwoorden zijn niet opgeslagen.",
    erroSemParticipacao: "We konden uw deelname niet vinden. Open de link van het onderzoek opnieuw om opnieuw te beginnen.",
    legenda: "Item {n} van {total}: {esquerdo} of {direito}",
    naoRespondido: "Dit item is niet beantwoord",
    posicao: "{p} van 7, dichter bij {termo}",
    centro: "4 van 7, midden",
    contagem: "{n} van {total} beantwoord",
    sair: "Stoppen zonder verzenden",
    perguntaSair: "Stoppen zonder verzenden? Niets van wat u hebt aangevinkt wordt opgeslagen.",
    continuar: "Verder invullen",
  },
  sobreVoce: {
    titulo: "Over u",
    descricao:
      "Deze vragen zijn optioneel en helpen de groep deelnemers te beschrijven. Bij alle vragen kunt u kiezen voor ‘Zeg ik liever niet’.",
    faixaEtaria: {
      titulo: "Leeftijdsgroep",
      opcoes: ["18 tot 24 jaar", "25 tot 34 jaar", "35 tot 44 jaar", "45 tot 59 jaar", "60 jaar of ouder"],
    },
    genero: { titulo: "Gender", opcoes: ["Vrouw", "Man", "Anders"] },
    escolaridade: {
      titulo: "Opleidingsniveau",
      opcoes: ["Basisonderwijs", "Voortgezet onderwijs", "Hoger onderwijs", "Postdoctoraal"],
    },
    familiaridadeComProduto: {
      titulo: "Had u dit product al eerder gebruikt?",
      opcoes: ["Nooit", "Een paar keer", "Vaak"],
    },
    prefiroNao: "Zeg ik liever niet",
    continuar: "Doorgaan",
    pular: "Deze stap overslaan",
  },
  fim: {
    titulo: "Antwoorden opgeslagen",
    texto: "Bedankt voor uw deelname. Uw antwoorden zijn anoniem opgeslagen.",
    nota: "U kunt deze pagina nu sluiten. Er wordt niets meer gevraagd.",
  },
  saiu: {
    titulo: "U hebt het onderzoek verlaten",
    texto: "Er is geen antwoord van u opgeslagen. Bedankt voor uw aandacht. U kunt deze pagina nu sluiten.",
  },
};
