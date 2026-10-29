import type { TextosParticipante } from "../tipos";

export const pl: TextosParticipante = {
  pularConteudo: "Przejdź do treści",
  idioma: {
    rotulo: "Język",
    aplicar: "Zastosuj",
    naoAprovada: "Tłumaczenie kwestionariusza na ten język nie zostało jeszcze ostatecznie zatwierdzone przez autorów UEQ.",
  },
  etapas: {
    nomes: ["Zgoda", "Kwestionariusz", "Dane opcjonalne"],
    rotulo: "Etapy udziału",
    rotuloConcluidas: "Etapy udziału, wszystkie ukończone",
    etapaDeTotal: "Etap {n} z {total} · {nome}",
  },
  titulos: {
    consentimento: "Zgoda",
    indisponivel: "Badanie niedostępne",
    jaRespondeu: "Odpowiedzi zostały już udzielone",
    questionario: "Kwestionariusz",
    dadosOpcionais: "Dane opcjonalne",
    registradas: "Odpowiedzi zapisane",
    encerrada: "Udział zakończony",
  },
  consentimento: {
    subtitulo: "Badanie doświadczeń użytkowników · PPGIa PUCPR",
    termoTitulo: "Formularz zgody",
    termoTexto: "Ocenisz swoje wrażenie z produktu za pomocą 26 par przeciwstawnych słów.",
    condicoes: [
      ["Czas", "Od 3 do 5 minut."],
      ["Udział", "Dobrowolny. Możesz zrezygnować w dowolnej chwili bez podawania powodu, a nic z tego, co zaznaczysz, nie zostanie zapisane."],
      ["Anonimowość", "Nie zbieramy imienia i nazwiska, adresu e-mail, adresu IP ani innych danych, które pozwalają cię zidentyfikować."],
      ["Wykorzystanie danych", "Odpowiedzi są analizowane łącznie i wyłącznie na potrzeby tego badania."],
    ],
    concordo: "Zgadzam się i chcę wziąć udział",
    naoQuero: "Nie chcę brać udziału",
  },
  fechado: {
    rascunho: {
      etapa: "Wersja robocza",
      titulo: "To badanie nie jest jeszcze otwarte",
      texto: "Zbieranie odpowiedzi jeszcze się nie rozpoczęło. Spróbuj ponownie później lub skontaktuj się z osobą, która wysłała ci link.",
    },
    encerrado: {
      etapa: "Zakończone",
      titulo: "Zbieranie odpowiedzi w tym badaniu zostało zakończone",
      texto: "Badanie nie przyjmuje już odpowiedzi. Dziękujemy za zainteresowanie.",
    },
  },
  jaRespondeu: {
    titulo: "W tym badaniu odpowiedzi zostały już udzielone",
    texto: "Twoje odpowiedzi zostały zapisane. Dziękujemy za udział. Możesz już zamknąć tę stronę.",
  },
  questionario: {
    recuperadas: "Przywróciliśmy odpowiedzi, które były już zaznaczone.",
    naoDeuEnviar: "Nie udało się wysłać odpowiedzi",
    faltam: { other: "Bez odpowiedzi: {n}" },
    marqueCadaUm: "Zaznacz jedno kółko w każdej z nich, aby wysłać. Pozostałe odpowiedzi są nadal zaznaczone.",
    irParaItem: "Przejdź do pozycji {n}",
    enviar: "Wyślij odpowiedzi",
    todosRespondidos: "Wszystkie pozycje ({total}) mają odpowiedź. Możesz już wysłać.",
    parcial: "Odpowiedzi: {n} z {total}.",
    erroEncerrada: "Zbieranie odpowiedzi zakończyło się w trakcie wypełniania. Twoje odpowiedzi nie zostały zapisane.",
    erroSemParticipacao: "Nie znaleźliśmy twojego udziału. Otwórz ponownie link do badania, aby zacząć od nowa.",
    legenda: "Pozycja {n} z {total}: {esquerdo} czy {direito}",
    naoRespondido: "Ta pozycja nie ma odpowiedzi",
    posicao: "{p} z 7, bliżej: {termo}",
    centro: "4 z 7, środek",
    contagem: "Odpowiedzi: {n} z {total}",
    sair: "Wyjdź bez wysyłania",
    perguntaSair: "Wyjść bez wysyłania? Nic z tego, co zaznaczysz, nie zostanie zapisane.",
    continuar: "Odpowiadaj dalej",
  },
  sobreVoce: {
    titulo: "O tobie",
    descricao:
      "Te pytania są opcjonalne i pomagają opisać grupę uczestników. Każde ma odpowiedź „Wolę nie odpowiadać”.",
    faixaEtaria: {
      titulo: "Grupa wiekowa",
      opcoes: ["18–24 lata", "25–34 lata", "35–44 lata", "45–59 lat", "60 lat lub więcej"],
    },
    genero: { titulo: "Płeć", opcoes: ["Kobieta", "Mężczyzna", "Inna"] },
    escolaridade: {
      titulo: "Wykształcenie",
      opcoes: ["Podstawowe", "Średnie", "Wyższe", "Podyplomowe"],
    },
    familiaridadeComProduto: {
      titulo: "Czy korzystałeś(-aś) już wcześniej z tego produktu?",
      opcoes: ["Nigdy", "Kilka razy", "Często"],
    },
    prefiroNao: "Wolę nie odpowiadać",
    continuar: "Dalej",
    pular: "Pomiń ten etap",
  },
  fim: {
    titulo: "Odpowiedzi zapisane",
    texto: "Dziękujemy za udział. Twoje odpowiedzi zostały zapisane anonimowo.",
    nota: "Możesz już zamknąć tę stronę. O nic więcej nie poprosimy.",
  },
  saiu: {
    titulo: "Opuszczono badanie",
    texto: "Żadna z twoich odpowiedzi nie została zapisana. Dziękujemy za uwagę. Możesz już zamknąć tę stronę.",
  },
};
