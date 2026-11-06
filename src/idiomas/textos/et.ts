import type { TextosParticipante } from "../tipos";

export const et: TextosParticipante = {
  pularConteudo: "Mine sisu juurde",
  idioma: {
    rotulo: "Keel",
    aplicar: "Rakenda",
    naoAprovada: "UEQ autorid ei ole küsimustiku tõlget sellesse keelde veel lõplikult heaks kiitnud.",
  },
  etapas: {
    nomes: ["Nõusolek", "Küsimustik", "Vabatahtlikud andmed"],
    rotulo: "Osalemise etapid",
    rotuloConcluidas: "Osalemise etapid, kõik lõpetatud",
    etapaDeTotal: "Etapp {n}/{total} · {nome}",
  },
  titulos: {
    consentimento: "Nõusolek",
    indisponivel: "Uuring pole saadaval",
    jaRespondeu: "Oled juba vastanud",
    questionario: "Küsimustik",
    dadosOpcionais: "Vabatahtlikud andmed",
    registradas: "Vastused salvestatud",
    encerrada: "Osalemine lõpetatud",
  },
  consentimento: {
    subtitulo: "Kasutajakogemuse uuring · PPGIa PUCPR",
    termoTitulo: "Nõusolekuvorm",
    termoTexto: "Hindad oma muljet tootest 26 vastandsõnapaari abil.",
    condicoes: [
      ["Aeg", "3–5 minutit."],
      ["Osalemine", "Vabatahtlik. Võid igal ajal ilma põhjenduseta loobuda ja midagi sinu märgitust ei salvestata."],
      ["Anonüümsus", "Me ei kogu nime, e-posti, IP-aadressi ega muid andmeid, mis sind tuvastaksid."],
      ["Andmete kasutamine", "Vastuseid analüüsitakse koos ja ainult selle uuringu jaoks."],
    ],
    concordo: "Nõustun ja soovin osaleda",
    naoQuero: "Ma ei soovi osaleda",
    privacidade: "Privaatsuspoliitika",
  },
  politica: {
    voltar: "Tagasi",
    semTraducao: "Seda poliitikat ei ole veel teie keelde tõlgitud, seetõttu kuvatakse see portugali keeles.",
  },
  fechado: {
    rascunho: {
      etapa: "Mustand",
      titulo: "See uuring pole veel avatud",
      texto: "Vastuste kogumine pole veel alanud. Proovi hiljem uuesti või võta ühendust lingi saatjaga.",
    },
    encerrado: {
      etapa: "Suletud",
      titulo: "Selle uuringu vastuste kogumine on lõppenud",
      texto: "Uuring ei võta enam vastuseid vastu. Aitäh huvi eest.",
    },
  },
  jaRespondeu: {
    titulo: "Oled sellele uuringule juba vastanud",
    texto: "Sinu vastused on salvestatud. Aitäh osalemast. Võid selle lehe nüüd sulgeda.",
  },
  questionario: {
    recuperadas: "Taastasime vastused, mille olid juba märkinud.",
    naoDeuEnviar: "Vastuseid ei õnnestunud saata",
    faltam: { one: "Puudu {n} rida", other: "Puudu {n} rida" },
    marqueCadaUm: "Saatmiseks märgi igas neist üks vastus. Sinu teised vastused on endiselt märgitud.",
    irParaItem: "Mine reale {n}",
    enviar: "Saada vastused",
    todosRespondidos: "Kõik {total} rida on vastatud. Võid nüüd saata.",
    parcial: "{n}/{total} vastatud.",
    erroEncerrada: "Uuringu vastuste kogumine lõppes sinu vastamise ajal. Sinu vastuseid ei salvestatud.",
    erroSemParticipacao: "Me ei leidnud sinu osalemist. Ava uuringu link uuesti, et otsast alustada.",
    legenda: "Rida {n}/{total}: {esquerdo} või {direito}",
    naoRespondido: "Sellele reale pole vastatud",
    posicao: "{p}/7, lähemal: {termo}",
    centro: "4/7, keskel",
    contagem: "{n}/{total} vastatud",
    sair: "Lahku saatmata",
    perguntaSair: "Kas lahkuda saatmata? Midagi sinu märgitust ei salvestata.",
    continuar: "Jätka vastamist",
  },
  sobreVoce: {
    titulo: "Sinust",
    descricao:
      "Need küsimused on vabatahtlikud ja aitavad osalejate rühma kirjeldada. Kõigil on valik „Ei soovi vastata“.",
    faixaEtaria: {
      titulo: "Vanuserühm",
      opcoes: ["18–24 aastat", "25–34 aastat", "35–44 aastat", "45–59 aastat", "60 aastat või rohkem"],
    },
    genero: { titulo: "Sugu", opcoes: ["Naine", "Mees", "Muu"] },
    escolaridade: {
      titulo: "Haridus",
      opcoes: ["Põhiharidus", "Keskharidus", "Kõrgharidus", "Magistri- või doktoriõpe"],
    },
    familiaridadeComProduto: {
      titulo: "Kas oled seda toodet varem kasutanud?",
      opcoes: ["Mitte kunagi", "Mõned korrad", "Sageli"],
    },
    prefiroNao: "Ei soovi vastata",
    continuar: "Jätka",
    pular: "Jäta see etapp vahele",
  },
  fim: {
    titulo: "Vastused salvestatud",
    texto: "Aitäh osalemast. Sinu vastused salvestati anonüümselt.",
    nota: "Võid selle lehe nüüd sulgeda. Rohkem midagi ei küsita.",
  },
  saiu: {
    titulo: "Lahkusid uuringust",
    texto: "Ühtegi sinu vastust ei salvestatud. Aitäh tähelepanu eest. Võid selle lehe nüüd sulgeda.",
  },
};
