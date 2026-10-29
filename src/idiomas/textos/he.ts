import type { TextosParticipante } from "../tipos";

export const he: TextosParticipante = {
  pularConteudo: "דילוג לתוכן",
  idioma: {
    rotulo: "שפה",
    aplicar: "החלה",
    naoAprovada: "תרגום השאלון לשפה זו עדיין לא אושר סופית על ידי מחברי ה-UEQ.",
  },
  etapas: {
    nomes: ["הסכמה", "שאלון", "פרטים רשות"],
    rotulo: "שלבי ההשתתפות",
    rotuloConcluidas: "שלבי ההשתתפות, כולם הושלמו",
    etapaDeTotal: "שלב {n} מתוך {total} · {nome}",
  },
  titulos: {
    consentimento: "הסכמה",
    indisponivel: "המחקר אינו זמין",
    jaRespondeu: "כבר השבת",
    questionario: "שאלון",
    dadosOpcionais: "פרטים רשות",
    registradas: "התשובות נרשמו",
    encerrada: "ההשתתפות הסתיימה",
  },
  consentimento: {
    subtitulo: "מחקר חוויית משתמש · PPGIa PUCPR",
    termoTitulo: "טופס הסכמה",
    termoTexto: "תציין את הרושם שלך מהמוצר ב-26 זוגות של מילים מנוגדות.",
    condicoes: [
      ["זמן", "3 עד 5 דקות."],
      ["השתתפות", "מרצון. אפשר להפסיק בכל רגע בלי לתת סיבה, ושום דבר ממה שסימנת לא יישמר."],
      ["אנונימיות", "איננו אוספים שם, דוא״ל, כתובת IP או כל מידע אחר שמזהה אותך."],
      ["שימוש בנתונים", "התשובות מנותחות יחד ורק לצורך מחקר זה."],
    ],
    concordo: "אני מסכים/ה ורוצה להשתתף",
    naoQuero: "איני רוצה להשתתף",
  },
  fechado: {
    rascunho: {
      etapa: "טיוטה",
      titulo: "המחקר עדיין לא נפתח",
      texto: "איסוף התשובות עוד לא התחיל. נסה שוב מאוחר יותר או פנה למי ששלח לך את הקישור.",
    },
    encerrado: {
      etapa: "נסגר",
      titulo: "איסוף התשובות למחקר זה הסתיים",
      texto: "המחקר כבר אינו מקבל תשובות. תודה על ההתעניינות.",
    },
  },
  jaRespondeu: {
    titulo: "כבר השבת על מחקר זה",
    texto: "התשובות שלך נרשמו. תודה על ההשתתפות. אפשר לסגור את הדף.",
  },
  questionario: {
    recuperadas: "שחזרנו את התשובות שכבר סימנת.",
    naoDeuEnviar: "לא ניתן היה לשלוח את התשובות",
    faltam: { one: "חסר פריט {n}", other: "חסרים {n} פריטים" },
    marqueCadaUm: "כדי לשלוח, סמן עיגול אחד בכל אחד מהם. שאר התשובות שלך נשארות מסומנות.",
    irParaItem: "מעבר לפריט {n}",
    enviar: "שליחת התשובות",
    todosRespondidos: "כל {total} הפריטים נענו. אפשר לשלוח.",
    parcial: "נענו {n} מתוך {total}.",
    erroEncerrada: "איסוף התשובות הסתיים בזמן שענית. התשובות שלך לא נשמרו.",
    erroSemParticipacao: "לא מצאנו את ההשתתפות שלך. פתח שוב את קישור המחקר כדי להתחיל מחדש.",
    legenda: "פריט {n} מתוך {total}: {esquerdo} או {direito}",
    naoRespondido: "פריט זה לא נענה",
    posicao: "{p} מתוך 7, קרוב יותר ל{termo}",
    centro: "4 מתוך 7, אמצע",
    contagem: "נענו {n} מתוך {total}",
    sair: "יציאה בלי לשלוח",
    perguntaSair: "לצאת בלי לשלוח? שום דבר ממה שסימנת לא יישמר.",
    continuar: "להמשיך לענות",
  },
  sobreVoce: {
    titulo: "עליך",
    descricao: "השאלות האלה הן רשות ועוזרות לתאר את קבוצת המשתתפים. בכולן יש אפשרות „מעדיף/ה לא לענות”.",
    faixaEtaria: {
      titulo: "קבוצת גיל",
      opcoes: ["18–24", "25–34", "35–44", "45–59", "60 ומעלה"],
    },
    genero: { titulo: "מגדר", opcoes: ["אישה", "גבר", "אחר"] },
    escolaridade: {
      titulo: "השכלה",
      opcoes: ["יסודית", "תיכונית", "אקדמית", "תואר מתקדם"],
    },
    familiaridadeComProduto: {
      titulo: "השתמשת במוצר הזה בעבר?",
      opcoes: ["אף פעם", "כמה פעמים", "לעיתים קרובות"],
    },
    prefiroNao: "מעדיף/ה לא לענות",
    continuar: "המשך",
    pular: "דילוג על שלב זה",
  },
  fim: {
    titulo: "התשובות נרשמו",
    texto: "תודה על ההשתתפות. התשובות שלך נשמרו באופן אנונימי.",
    nota: "אפשר לסגור את הדף. לא יתבקש ממך שום דבר נוסף.",
  },
  saiu: {
    titulo: "יצאת מהמחקר",
    texto: "אף אחת מהתשובות שלך לא נשמרה. תודה על תשומת הלב. אפשר לסגור את הדף.",
  },
};
