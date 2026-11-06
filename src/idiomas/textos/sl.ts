import type { TextosParticipante } from "../tipos";

export const sl: TextosParticipante = {
  pularConteudo: "Skoči na vsebino",
  aguarde: "Počakajte…",
  idioma: {
    rotulo: "Jezik",
    aplicar: "Uporabi",
    naoAprovada: "Avtorji UEQ prevoda vprašalnika v ta jezik še niso dokončno potrdili.",
  },
  etapas: {
    nomes: ["Soglasje", "Vprašalnik", "Neobvezni podatki"],
    rotulo: "Koraki sodelovanja",
    rotuloConcluidas: "Koraki sodelovanja, vsi zaključeni",
    etapaDeTotal: "Korak {n} od {total} · {nome}",
  },
  titulos: {
    consentimento: "Soglasje",
    indisponivel: "Raziskava ni na voljo",
    jaRespondeu: "Ste že odgovorili",
    questionario: "Vprašalnik",
    dadosOpcionais: "Neobvezni podatki",
    registradas: "Odgovori shranjeni",
    encerrada: "Sodelovanje končano",
  },
  consentimento: {
    subtitulo: "Raziskava uporabniške izkušnje · PPGIa PUCPR",
    termoTitulo: "Izjava o soglasju",
    termoTexto: "Svoj vtis o izdelku boste podali pri 26 parih nasprotnih besed.",
    condicoes: [
      ["Čas", "Od 3 do 5 minut."],
      ["Sodelovanje", "Prostovoljno. Kadar koli lahko odnehate brez pojasnila in nič od tega, kar ste označili, ne bo shranjeno."],
      ["Anonimnost", "Ne zbiramo imena, e-pošte, naslova IP ali drugih podatkov, ki bi vas razkrili."],
      ["Uporaba podatkov", "Odgovore analiziramo skupaj in samo za to raziskavo."],
    ],
    concordo: "Strinjam se in želim sodelovati",
    naoQuero: "Ne želim sodelovati",
    privacidade: "Politika zasebnosti",
  },
  politica: {
    voltar: "Nazaj",
    semTraducao: "Ta politika še ni prevedena v vaš jezik, zato je prikazana v portugalščini.",
  },
  fechado: {
    rascunho: {
      etapa: "Osnutek",
      titulo: "Ta raziskava še ni odprta",
      texto: "Zbiranje odgovorov se še ni začelo. Poskusite znova pozneje ali se obrnite na osebo, ki vam je poslala povezavo.",
    },
    encerrado: {
      etapa: "Zaključeno",
      titulo: "Zbiranje odgovorov za to raziskavo je končano",
      texto: "Raziskava ne sprejema več odgovorov. Hvala za vaše zanimanje.",
    },
  },
  jaRespondeu: {
    titulo: "Na to raziskavo ste že odgovorili",
    texto: "Vaši odgovori so shranjeni. Hvala za sodelovanje. To stran lahko zdaj zaprete.",
  },
  questionario: {
    recuperadas: "Obnovili smo odgovore, ki ste jih že označili.",
    naoDeuEnviar: "Odgovorov ni bilo mogoče poslati",
    faltam: { other: "Brez odgovora: {n}" },
    marqueCadaUm: "Za pošiljanje pri vsaki od njih označite en krog. Drugi odgovori ostajajo označeni.",
    irParaItem: "Pojdi na postavko {n}",
    enviar: "Pošlji odgovore",
    todosRespondidos: "Vse postavke ({total}) imajo odgovor. Zdaj lahko pošljete.",
    parcial: "Odgovorjeno: {n} od {total}.",
    erroEncerrada: "Zbiranje odgovorov se je končalo med vašim odgovarjanjem. Vaši odgovori niso bili shranjeni.",
    erroSemParticipacao: "Vašega sodelovanja nismo našli. Znova odprite povezavo do raziskave in začnite od začetka.",
    legenda: "Postavka {n} od {total}: {esquerdo} ali {direito}",
    naoRespondido: "Ta postavka nima odgovora",
    posicao: "{p} od 7, bliže: {termo}",
    centro: "4 od 7, sredina",
    contagem: "Odgovorjeno: {n} od {total}",
    sair: "Zapusti brez pošiljanja",
    perguntaSair: "Želite zapustiti brez pošiljanja? Nič od tega, kar ste označili, ne bo shranjeno.",
    continuar: "Nadaljuj z odgovarjanjem",
  },
  sobreVoce: {
    titulo: "O vas",
    descricao:
      "Ta vprašanja so neobvezna in pomagajo opisati skupino udeležencev. Pri vseh je na voljo možnost »Ne želim odgovoriti«.",
    faixaEtaria: {
      titulo: "Starostna skupina",
      opcoes: ["18–24 let", "25–34 let", "35–44 let", "45–59 let", "60 let ali več"],
    },
    genero: { titulo: "Spol", opcoes: ["Ženska", "Moški", "Drugo"] },
    escolaridade: {
      titulo: "Izobrazba",
      opcoes: ["Osnovna šola", "Srednja šola", "Visokošolska izobrazba", "Podiplomski študij"],
    },
    familiaridadeComProduto: {
      titulo: "Ste ta izdelek že uporabljali?",
      opcoes: ["Nikoli", "Nekajkrat", "Pogosto"],
    },
    prefiroNao: "Ne želim odgovoriti",
    continuar: "Nadaljuj",
    pular: "Preskoči ta korak",
  },
  fim: {
    titulo: "Odgovori shranjeni",
    texto: "Hvala za sodelovanje. Vaši odgovori so bili shranjeni anonimno.",
    nota: "To stran lahko zdaj zaprete. Ničesar drugega ne bomo vprašali.",
  },
  saiu: {
    titulo: "Zapustili ste raziskavo",
    texto: "Noben vaš odgovor ni bil shranjen. Hvala za pozornost. To stran lahko zdaj zaprete.",
  },
};
