import type { TextosParticipante } from "../tipos";

export const hu: TextosParticipante = {
  pularConteudo: "Ugrás a tartalomra",
  idioma: {
    rotulo: "Nyelv",
    aplicar: "Alkalmaz",
    naoAprovada: "A kérdőív erre a nyelvre készült fordítását az UEQ szerzői még nem hagyták jóvá véglegesen.",
  },
  etapas: {
    nomes: ["Beleegyezés", "Kérdőív", "Nem kötelező adatok"],
    rotulo: "A részvétel lépései",
    rotuloConcluidas: "A részvétel lépései, mind befejezve",
    etapaDeTotal: "{n}/{total}. lépés · {nome}",
  },
  titulos: {
    consentimento: "Beleegyezés",
    indisponivel: "A kutatás nem érhető el",
    jaRespondeu: "Ön már válaszolt",
    questionario: "Kérdőív",
    dadosOpcionais: "Nem kötelező adatok",
    registradas: "Válaszok rögzítve",
    encerrada: "A részvétel véget ért",
  },
  consentimento: {
    subtitulo: "Felhasználói élmény kutatás · PPGIa PUCPR",
    termoTitulo: "Beleegyező nyilatkozat",
    termoTexto: "A termékről alkotott benyomását 26 ellentétes szópáron fogja értékelni.",
    condicoes: [
      ["Időtartam", "3–5 perc."],
      ["Részvétel", "Önkéntes. Bármikor, indoklás nélkül abbahagyhatja, és semmi sem kerül mentésre abból, amit bejelölt."],
      ["Névtelenség", "Nem gyűjtünk nevet, e-mail-címet, IP-címet vagy más, Önt azonosító adatot."],
      ["Az adatok felhasználása", "A válaszokat összesítve, kizárólag ehhez a kutatáshoz elemezzük."],
    ],
    concordo: "Elfogadom, és részt szeretnék venni",
    naoQuero: "Nem szeretnék részt venni",
    privacidade: "Adatvédelmi szabályzat",
  },
  politica: {
    voltar: "Vissza",
    semTraducao: "Ezt a szabályzatot még nem fordították le az Ön nyelvére, ezért portugálul jelenik meg.",
  },
  fechado: {
    rascunho: {
      etapa: "Piszkozat",
      titulo: "Ez a kutatás még nincs megnyitva",
      texto: "A válaszok gyűjtése még nem kezdődött el. Próbálja újra később, vagy forduljon ahhoz, aki a linket küldte.",
    },
    encerrado: {
      etapa: "Lezárva",
      titulo: "A kutatás adatgyűjtése lezárult",
      texto: "A kutatás már nem fogad válaszokat. Köszönjük az érdeklődését.",
    },
  },
  jaRespondeu: {
    titulo: "Ön már kitöltötte ezt a kutatást",
    texto: "A válaszait rögzítettük. Köszönjük a részvételt. Most már bezárhatja ezt az oldalt.",
  },
  questionario: {
    recuperadas: "Visszaállítottuk a már bejelölt válaszait.",
    naoDeuEnviar: "A válaszokat nem sikerült elküldeni",
    faltam: { other: "Még {n} tétel hiányzik" },
    marqueCadaUm: "A küldéshez mindegyiknél jelöljön be egy karikát. A többi válasza továbbra is be van jelölve.",
    irParaItem: "Ugrás a(z) {n}. tételhez",
    enviar: "Válaszok elküldése",
    todosRespondidos: "Mind a(z) {total} tételre válaszolt. Most már elküldheti.",
    parcial: "{n}/{total} megválaszolva.",
    erroEncerrada: "A kutatás adatgyűjtése lezárult, miközben válaszolt. A válaszait nem mentettük.",
    erroSemParticipacao: "Nem találtuk a részvételét. Nyissa meg újra a kutatás linkjét az újrakezdéshez.",
    legenda: "{n}/{total}. tétel: {esquerdo} vagy {direito}",
    naoRespondido: "Erre a tételre nem válaszolt",
    posicao: "{p}/7, közelebb ehhez: {termo}",
    centro: "4/7, közép",
    contagem: "{n}/{total} megválaszolva",
    sair: "Kilépés küldés nélkül",
    perguntaSair: "Kilép küldés nélkül? Semmi sem kerül mentésre abból, amit bejelölt.",
    continuar: "Válaszadás folytatása",
  },
  sobreVoce: {
    titulo: "Önről",
    descricao:
      "Ezek a kérdések nem kötelezőek, és a résztvevők csoportjának leírását segítik. Mindegyiknél választható a „Nem kívánok válaszolni” lehetőség.",
    faixaEtaria: {
      titulo: "Korcsoport",
      opcoes: ["18–24 év", "25–34 év", "35–44 év", "45–59 év", "60 év vagy több"],
    },
    genero: { titulo: "Nem", opcoes: ["Nő", "Férfi", "Egyéb"] },
    escolaridade: {
      titulo: "Iskolai végzettség",
      opcoes: ["Általános iskola", "Középiskola", "Felsőfokú végzettség", "Posztgraduális képzés"],
    },
    familiaridadeComProduto: {
      titulo: "Használta már korábban ezt a terméket?",
      opcoes: ["Soha", "Néhányszor", "Gyakran"],
    },
    prefiroNao: "Nem kívánok válaszolni",
    continuar: "Tovább",
    pular: "Lépés kihagyása",
  },
  fim: {
    titulo: "Válaszok rögzítve",
    texto: "Köszönjük a részvételt. A válaszait névtelenül mentettük.",
    nota: "Most már bezárhatja ezt az oldalt. Mást nem kérünk.",
  },
  saiu: {
    titulo: "Kilépett a kutatásból",
    texto: "Egyetlen válaszát sem mentettük. Köszönjük a figyelmét. Most már bezárhatja ezt az oldalt.",
  },
};
