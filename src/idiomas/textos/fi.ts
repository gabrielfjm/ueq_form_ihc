import type { TextosParticipante } from "../tipos";

export const fi: TextosParticipante = {
  pularConteudo: "Siirry sisältöön",
  aguarde: "Odota…",
  idioma: {
    rotulo: "Kieli",
    aplicar: "Käytä",
    naoAprovada: "UEQ:n tekijät eivät ole vielä lopullisesti hyväksyneet kyselyn käännöstä tälle kielelle.",
  },
  etapas: {
    nomes: ["Suostumus", "Kysely", "Vapaaehtoiset tiedot"],
    rotulo: "Osallistumisen vaiheet",
    rotuloConcluidas: "Osallistumisen vaiheet, kaikki valmiina",
    etapaDeTotal: "Vaihe {n}/{total} · {nome}",
  },
  titulos: {
    consentimento: "Suostumus",
    indisponivel: "Tutkimus ei ole saatavilla",
    jaRespondeu: "Olet jo vastannut",
    questionario: "Kysely",
    dadosOpcionais: "Vapaaehtoiset tiedot",
    registradas: "Vastaukset tallennettu",
    encerrada: "Osallistuminen päättyi",
  },
  consentimento: {
    subtitulo: "Käyttäjäkokemustutkimus · PPGIa PUCPR",
    termoTitulo: "Suostumuslomake",
    termoTexto: "Arvioit vaikutelmaasi tuotteesta 26 vastakohtaparin avulla.",
    condicoes: [
      ["Aika", "3–5 minuuttia."],
      ["Osallistuminen", "Vapaaehtoista. Voit keskeyttää milloin tahansa syytä kertomatta, eikä mitään valitsemaasi tallenneta."],
      ["Nimettömyys", "Emme kerää nimeä, sähköpostia, IP-osoitetta tai muita sinut tunnistavia tietoja."],
      ["Tietojen käyttö", "Vastaukset analysoidaan yhdessä ja vain tätä tutkimusta varten."],
    ],
    concordo: "Hyväksyn ja haluan osallistua",
    naoQuero: "En halua osallistua",
    privacidade: "Tietosuojakäytäntö",
  },
  politica: {
    voltar: "Takaisin",
    semTraducao: "Tätä käytäntöä ei ole vielä käännetty kielellesi, joten se näytetään portugaliksi.",
  },
  fechado: {
    rascunho: {
      etapa: "Luonnos",
      titulo: "Tämä tutkimus ei ole vielä avoinna",
      texto: "Vastausten keruu ei ole vielä alkanut. Yritä myöhemmin uudelleen tai ota yhteyttä linkin lähettäjään.",
    },
    encerrado: {
      etapa: "Suljettu",
      titulo: "Tämän tutkimuksen vastausten keruu on päättynyt",
      texto: "Tutkimus ei enää ota vastaan vastauksia. Kiitos kiinnostuksestasi.",
    },
  },
  jaRespondeu: {
    titulo: "Olet jo vastannut tähän tutkimukseen",
    texto: "Vastauksesi on tallennettu. Kiitos osallistumisesta. Voit nyt sulkea tämän sivun.",
  },
  questionario: {
    recuperadas: "Palautimme vastaukset, jotka olit jo valinnut.",
    naoDeuEnviar: "Vastauksia ei voitu lähettää",
    faltam: { one: "{n} kohta puuttuu", other: "{n} kohtaa puuttuu" },
    marqueCadaUm: "Valitse jokaisesta yksi vaihtoehto lähettääksesi. Muut vastauksesi ovat yhä valittuina.",
    irParaItem: "Siirry kohtaan {n}",
    enviar: "Lähetä vastaukset",
    todosRespondidos: "Kaikkiin {total} kohtaan on vastattu. Voit nyt lähettää.",
    parcial: "{n}/{total} vastattu.",
    erroEncerrada: "Tutkimuksen vastausten keruu päättyi vastaamisesi aikana. Vastauksiasi ei tallennettu.",
    erroSemParticipacao: "Emme löytäneet osallistumistasi. Avaa tutkimuksen linkki uudelleen aloittaaksesi alusta.",
    legenda: "Kohta {n}/{total}: {esquerdo} tai {direito}",
    naoRespondido: "Tähän kohtaan ei ole vastattu",
    posicao: "{p}/7, lähempänä: {termo}",
    centro: "4/7, keskikohta",
    contagem: "{n}/{total} vastattu",
    sair: "Poistu lähettämättä",
    perguntaSair: "Poistutaanko lähettämättä? Mitään valitsemaasi ei tallenneta.",
    continuar: "Jatka vastaamista",
  },
  sobreVoce: {
    titulo: "Tietoja sinusta",
    descricao:
      "Nämä kysymykset ovat vapaaehtoisia ja auttavat kuvaamaan osallistujien ryhmää. Kaikissa on vaihtoehto ”En halua vastata”.",
    faixaEtaria: {
      titulo: "Ikäryhmä",
      opcoes: ["18–24 vuotta", "25–34 vuotta", "35–44 vuotta", "45–59 vuotta", "60 vuotta tai yli"],
    },
    genero: { titulo: "Sukupuoli", opcoes: ["Nainen", "Mies", "Muu"] },
    escolaridade: {
      titulo: "Koulutus",
      opcoes: ["Perusaste", "Toinen aste", "Korkea-aste", "Jatko-opinnot"],
    },
    familiaridadeComProduto: {
      titulo: "Olitko käyttänyt tätä tuotetta aiemmin?",
      opcoes: ["En koskaan", "Muutaman kerran", "Usein"],
    },
    prefiroNao: "En halua vastata",
    continuar: "Jatka",
    pular: "Ohita tämä vaihe",
  },
  fim: {
    titulo: "Vastaukset tallennettu",
    texto: "Kiitos osallistumisesta. Vastauksesi tallennettiin nimettöminä.",
    nota: "Voit nyt sulkea tämän sivun. Muuta ei kysytä.",
  },
  saiu: {
    titulo: "Poistuit tutkimuksesta",
    texto: "Yhtään vastaustasi ei tallennettu. Kiitos ajastasi. Voit nyt sulkea tämän sivun.",
  },
};
