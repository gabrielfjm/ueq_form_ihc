import type { TextosParticipante } from "../tipos";

export const it: TextosParticipante = {
  pularConteudo: "Vai al contenuto",
  idioma: {
    rotulo: "Lingua",
    aplicar: "Applica",
    naoAprovada: "La traduzione del questionario in questa lingua non è ancora stata approvata in via definitiva dagli autori dell’UEQ.",
  },
  etapas: {
    nomes: ["Consenso", "Questionario", "Dati facoltativi"],
    rotulo: "Fasi della partecipazione",
    rotuloConcluidas: "Fasi della partecipazione, tutte completate",
    etapaDeTotal: "Fase {n} di {total} · {nome}",
  },
  titulos: {
    consentimento: "Consenso",
    indisponivel: "Studio non disponibile",
    jaRespondeu: "Hai già risposto",
    questionario: "Questionario",
    dadosOpcionais: "Dati facoltativi",
    registradas: "Risposte registrate",
    encerrada: "Partecipazione terminata",
  },
  consentimento: {
    subtitulo: "Ricerca sull’esperienza utente · PPGIa PUCPR",
    termoTitulo: "Modulo di consenso",
    termoTexto: "Indicherai la tua impressione sul prodotto con 26 coppie di parole opposte.",
    condicoes: [
      ["Durata", "Da 3 a 5 minuti."],
      ["Partecipazione", "Volontaria. Puoi rinunciare in qualsiasi momento, senza dare spiegazioni, e nulla di ciò che hai segnato verrà salvato."],
      ["Anonimato", "Non raccogliamo nome, e-mail, indirizzo IP né altri dati che ti identifichino."],
      ["Uso dei dati", "Le risposte vengono analizzate insieme, solo per questa ricerca."],
    ],
    concordo: "Accetto e voglio partecipare",
    naoQuero: "Non voglio partecipare",
    privacidade: "Informativa sulla privacy",
  },
  politica: {
    voltar: "Indietro",
    semTraducao: "Questa informativa non è ancora tradotta nella tua lingua e appare in portoghese.",
  },
  fechado: {
    rascunho: {
      etapa: "Bozza",
      titulo: "Questo studio non è ancora aperto",
      texto: "La raccolta delle risposte non è ancora iniziata. Riprova più tardi o contatta chi ti ha inviato il link.",
    },
    encerrado: {
      etapa: "Chiuso",
      titulo: "La raccolta di questo studio è terminata",
      texto: "Lo studio non accetta più risposte. Grazie per l’interesse a partecipare.",
    },
  },
  jaRespondeu: {
    titulo: "Hai già risposto a questo studio",
    texto: "Le tue risposte sono state registrate. Grazie per aver partecipato. Ora puoi chiudere questa pagina.",
  },
  questionario: {
    recuperadas: "Abbiamo recuperato le risposte che avevi già segnato.",
    naoDeuEnviar: "Non è stato possibile inviare le risposte",
    faltam: { one: "Manca {n} voce", other: "Mancano {n} voci" },
    marqueCadaUm: "Segna un’opzione in ciascuna per inviare. Le altre risposte restano segnate.",
    irParaItem: "Vai alla voce {n}",
    enviar: "Invia le risposte",
    todosRespondidos: "Tutte le {total} voci hanno una risposta. Ora puoi inviare.",
    parcial: "{n} di {total} con risposta.",
    erroEncerrada: "La raccolta di questo studio è terminata mentre rispondevi. Le tue risposte non sono state salvate.",
    erroSemParticipacao: "Non abbiamo trovato la tua partecipazione. Apri di nuovo il link dello studio per ricominciare.",
    legenda: "Voce {n} di {total}: {esquerdo} o {direito}",
    naoRespondido: "Questa voce non ha una risposta",
    posicao: "{p} di 7, più vicino a {termo}",
    centro: "4 di 7, centro",
    contagem: "{n} di {total} con risposta",
    sair: "Esci senza inviare",
    perguntaSair: "Uscire senza inviare? Nulla di ciò che hai segnato verrà salvato.",
    continuar: "Continua a rispondere",
  },
  sobreVoce: {
    titulo: "Su di te",
    descricao:
      "Queste domande sono facoltative e aiutano a descrivere il gruppo di partecipanti. Tutte hanno l’opzione «Preferisco non rispondere».",
    faixaEtaria: {
      titulo: "Fascia d’età",
      opcoes: ["Da 18 a 24 anni", "Da 25 a 34 anni", "Da 35 a 44 anni", "Da 45 a 59 anni", "60 anni o più"],
    },
    genero: { titulo: "Genere", opcoes: ["Donna", "Uomo", "Altro"] },
    escolaridade: {
      titulo: "Titolo di studio",
      opcoes: ["Scuola primaria", "Scuola secondaria", "Laurea", "Post-laurea"],
    },
    familiaridadeComProduto: {
      titulo: "Avevi già usato questo prodotto?",
      opcoes: ["Mai", "Qualche volta", "Spesso"],
    },
    prefiroNao: "Preferisco non rispondere",
    continuar: "Continua",
    pular: "Salta questa fase",
  },
  fim: {
    titulo: "Risposte registrate",
    texto: "Grazie per aver partecipato. Le tue risposte sono state salvate in forma anonima.",
    nota: "Ora puoi chiudere questa pagina. Non ti verrà chiesto altro.",
  },
  saiu: {
    titulo: "Sei uscito dallo studio",
    texto: "Nessuna tua risposta è stata salvata. Grazie per l’attenzione. Ora puoi chiudere questa pagina.",
  },
};
