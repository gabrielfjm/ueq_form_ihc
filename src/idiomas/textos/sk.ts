import type { TextosParticipante } from "../tipos";

export const sk: TextosParticipante = {
  pularConteudo: "Prejsť na obsah",
  idioma: {
    rotulo: "Jazyk",
    aplicar: "Použiť",
    naoAprovada: "Preklad dotazníka do tohto jazyka autori UEQ zatiaľ definitívne neschválili.",
  },
  etapas: {
    nomes: ["Súhlas", "Dotazník", "Nepovinné údaje"],
    rotulo: "Kroky účasti",
    rotuloConcluidas: "Kroky účasti, všetky dokončené",
    etapaDeTotal: "Krok {n} z {total} · {nome}",
  },
  titulos: {
    consentimento: "Súhlas",
    indisponivel: "Štúdia nie je dostupná",
    jaRespondeu: "Už ste odpovedali",
    questionario: "Dotazník",
    dadosOpcionais: "Nepovinné údaje",
    registradas: "Odpovede uložené",
    encerrada: "Účasť ukončená",
  },
  consentimento: {
    subtitulo: "Výskum používateľskej skúsenosti · PPGIa PUCPR",
    termoTitulo: "Informovaný súhlas",
    termoTexto: "Svoj dojem z produktu vyjadríte pri 26 dvojiciach protikladných slov.",
    condicoes: [
      ["Čas", "3 až 5 minút."],
      ["Účasť", "Dobrovoľná. Môžete kedykoľvek bez udania dôvodu skončiť a nič z toho, čo ste označili, sa neuloží."],
      ["Anonymita", "Nezbierame meno, e-mail, IP adresu ani iné údaje, ktoré by vás identifikovali."],
      ["Použitie údajov", "Odpovede sa vyhodnocujú spoločne a iba pre tento výskum."],
    ],
    concordo: "Súhlasím a chcem sa zúčastniť",
    naoQuero: "Nechcem sa zúčastniť",
  },
  fechado: {
    rascunho: {
      etapa: "Koncept",
      titulo: "Táto štúdia ešte nie je otvorená",
      texto: "Zber odpovedí sa ešte nezačal. Skúste to neskôr alebo sa obráťte na toho, kto vám poslal odkaz.",
    },
    encerrado: {
      etapa: "Ukončené",
      titulo: "Zber odpovedí pre túto štúdiu sa skončil",
      texto: "Štúdia už neprijíma odpovede. Ďakujeme za váš záujem.",
    },
  },
  jaRespondeu: {
    titulo: "Na túto štúdiu ste už odpovedali",
    texto: "Vaše odpovede boli uložené. Ďakujeme za účasť. Túto stránku teraz môžete zavrieť.",
  },
  questionario: {
    recuperadas: "Obnovili sme odpovede, ktoré ste už označili.",
    naoDeuEnviar: "Odpovede sa nepodarilo odoslať",
    faltam: { other: "Bez odpovede: {n}" },
    marqueCadaUm: "Na odoslanie označte pri každej z nich jeden krúžok. Ostatné odpovede zostávajú označené.",
    irParaItem: "Prejsť na položku {n}",
    enviar: "Odoslať odpovede",
    todosRespondidos: "Všetky položky ({total}) sú zodpovedané. Môžete odoslať.",
    parcial: "Zodpovedané {n} z {total}.",
    erroEncerrada: "Zber odpovedí sa skončil, kým ste odpovedali. Vaše odpovede neboli uložené.",
    erroSemParticipacao: "Vašu účasť sme nenašli. Otvorte odkaz na štúdiu znova a začnite od začiatku.",
    legenda: "Položka {n} z {total}: {esquerdo} alebo {direito}",
    naoRespondido: "Táto položka nie je zodpovedaná",
    posicao: "{p} zo 7, bližšie k: {termo}",
    centro: "4 zo 7, stred",
    contagem: "Zodpovedané {n} z {total}",
    sair: "Odísť bez odoslania",
    perguntaSair: "Odísť bez odoslania? Nič z toho, čo ste označili, sa neuloží.",
    continuar: "Pokračovať v odpovedaní",
  },
  sobreVoce: {
    titulo: "O vás",
    descricao:
      "Tieto otázky sú nepovinné a pomáhajú opísať skupinu účastníkov. Všetky majú možnosť „Nechcem odpovedať“.",
    faixaEtaria: {
      titulo: "Veková skupina",
      opcoes: ["18 – 24 rokov", "25 – 34 rokov", "35 – 44 rokov", "45 – 59 rokov", "60 rokov a viac"],
    },
    genero: { titulo: "Pohlavie", opcoes: ["Žena", "Muž", "Iné"] },
    escolaridade: {
      titulo: "Vzdelanie",
      opcoes: ["Základné", "Stredné", "Vysokoškolské", "Postgraduálne"],
    },
    familiaridadeComProduto: {
      titulo: "Používali ste tento produkt už predtým?",
      opcoes: ["Nikdy", "Niekoľkokrát", "Často"],
    },
    prefiroNao: "Nechcem odpovedať",
    continuar: "Pokračovať",
    pular: "Preskočiť tento krok",
  },
  fim: {
    titulo: "Odpovede uložené",
    texto: "Ďakujeme za účasť. Vaše odpovede boli uložené anonymne.",
    nota: "Túto stránku teraz môžete zavrieť. Nič ďalšie nebudeme potrebovať.",
  },
  saiu: {
    titulo: "Odišli ste zo štúdie",
    texto: "Žiadna vaša odpoveď nebola uložená. Ďakujeme za pozornosť. Túto stránku teraz môžete zavrieť.",
  },
};
