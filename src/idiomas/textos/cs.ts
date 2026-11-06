import type { TextosParticipante } from "../tipos";

export const cs: TextosParticipante = {
  pularConteudo: "Přejít na obsah",
  idioma: {
    rotulo: "Jazyk",
    aplicar: "Použít",
    naoAprovada: "Překlad dotazníku do tohoto jazyka zatím autoři UEQ definitivně neschválili.",
  },
  etapas: {
    nomes: ["Souhlas", "Dotazník", "Nepovinné údaje"],
    rotulo: "Kroky účasti",
    rotuloConcluidas: "Kroky účasti, všechny dokončené",
    etapaDeTotal: "Krok {n} z {total} · {nome}",
  },
  titulos: {
    consentimento: "Souhlas",
    indisponivel: "Studie není dostupná",
    jaRespondeu: "Již jste odpověděli",
    questionario: "Dotazník",
    dadosOpcionais: "Nepovinné údaje",
    registradas: "Odpovědi uloženy",
    encerrada: "Účast ukončena",
  },
  consentimento: {
    subtitulo: "Výzkum uživatelského zážitku · PPGIa PUCPR",
    termoTitulo: "Informovaný souhlas",
    termoTexto: "Svůj dojem z produktu vyjádříte u 26 dvojic protikladných slov.",
    condicoes: [
      ["Čas", "3 až 5 minut."],
      ["Účast", "Dobrovolná. Můžete kdykoli bez udání důvodu skončit a nic z toho, co jste označili, se neuloží."],
      ["Anonymita", "Nesbíráme jméno, e-mail, IP adresu ani jiné údaje, které by vás identifikovaly."],
      ["Použití dat", "Odpovědi se vyhodnocují společně a pouze pro tento výzkum."],
    ],
    concordo: "Souhlasím a chci se zúčastnit",
    naoQuero: "Nechci se zúčastnit",
    privacidade: "Zásady ochrany osobních údajů",
  },
  politica: {
    voltar: "Zpět",
    semTraducao: "Tyto zásady zatím nejsou přeloženy do vašeho jazyka, proto se zobrazují v portugalštině.",
  },
  fechado: {
    rascunho: {
      etapa: "Koncept",
      titulo: "Tato studie zatím není otevřená",
      texto: "Sběr odpovědí ještě nezačal. Zkuste to později nebo se obraťte na toho, kdo vám poslal odkaz.",
    },
    encerrado: {
      etapa: "Ukončeno",
      titulo: "Sběr odpovědí pro tuto studii skončil",
      texto: "Studie už nepřijímá odpovědi. Děkujeme za váš zájem.",
    },
  },
  jaRespondeu: {
    titulo: "Na tuto studii jste již odpověděli",
    texto: "Vaše odpovědi byly uloženy. Děkujeme za účast. Tuto stránku teď můžete zavřít.",
  },
  questionario: {
    recuperadas: "Obnovili jsme odpovědi, které jste už označili.",
    naoDeuEnviar: "Odpovědi se nepodařilo odeslat",
    faltam: { other: "Bez odpovědi: {n}" },
    marqueCadaUm: "Pro odeslání označte u každé z nich jeden kroužek. Ostatní odpovědi zůstávají označené.",
    irParaItem: "Přejít na položku {n}",
    enviar: "Odeslat odpovědi",
    todosRespondidos: "Všechny položky ({total}) jsou zodpovězené. Můžete odeslat.",
    parcial: "Zodpovězeno {n} z {total}.",
    erroEncerrada: "Sběr odpovědí skončil, zatímco jste odpovídali. Vaše odpovědi nebyly uloženy.",
    erroSemParticipacao: "Vaši účast jsme nenašli. Otevřete odkaz na studii znovu a začněte od začátku.",
    legenda: "Položka {n} z {total}: {esquerdo}, nebo {direito}",
    naoRespondido: "Tato položka není zodpovězená",
    posicao: "{p} ze 7, blíže k: {termo}",
    centro: "4 ze 7, střed",
    contagem: "Zodpovězeno {n} z {total}",
    sair: "Odejít bez odeslání",
    perguntaSair: "Odejít bez odeslání? Nic z toho, co jste označili, se neuloží.",
    continuar: "Pokračovat v odpovídání",
  },
  sobreVoce: {
    titulo: "O vás",
    descricao:
      "Tyto otázky jsou nepovinné a pomáhají popsat skupinu účastníků. Všechny mají možnost „Nechci odpovídat“.",
    faixaEtaria: {
      titulo: "Věková skupina",
      opcoes: ["18–24 let", "25–34 let", "35–44 let", "45–59 let", "60 let a více"],
    },
    genero: { titulo: "Pohlaví", opcoes: ["Žena", "Muž", "Jiné"] },
    escolaridade: {
      titulo: "Vzdělání",
      opcoes: ["Základní", "Střední", "Vysokoškolské", "Postgraduální"],
    },
    familiaridadeComProduto: {
      titulo: "Používali jste tento produkt už dříve?",
      opcoes: ["Nikdy", "Několikrát", "Často"],
    },
    prefiroNao: "Nechci odpovídat",
    continuar: "Pokračovat",
    pular: "Přeskočit tento krok",
  },
  fim: {
    titulo: "Odpovědi uloženy",
    texto: "Děkujeme za účast. Vaše odpovědi byly uloženy anonymně.",
    nota: "Tuto stránku teď můžete zavřít. Nic dalšího nebudeme chtít.",
  },
  saiu: {
    titulo: "Odešli jste ze studie",
    texto: "Žádná vaše odpověď nebyla uložena. Děkujeme za pozornost. Tuto stránku teď můžete zavřít.",
  },
};
