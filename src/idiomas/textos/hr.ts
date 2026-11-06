import type { TextosParticipante } from "../tipos";

export const hr: TextosParticipante = {
  pularConteudo: "Preskoči na sadržaj",
  aguarde: "Pričekajte…",
  idioma: {
    rotulo: "Jezik",
    aplicar: "Primijeni",
    naoAprovada: "Autori UEQ-a još nisu konačno odobrili prijevod upitnika na ovaj jezik.",
  },
  etapas: {
    nomes: ["Pristanak", "Upitnik", "Neobavezni podaci"],
    rotulo: "Koraci sudjelovanja",
    rotuloConcluidas: "Koraci sudjelovanja, svi završeni",
    etapaDeTotal: "Korak {n} od {total} · {nome}",
  },
  titulos: {
    consentimento: "Pristanak",
    indisponivel: "Istraživanje nije dostupno",
    jaRespondeu: "Već ste odgovorili",
    questionario: "Upitnik",
    dadosOpcionais: "Neobavezni podaci",
    registradas: "Odgovori su spremljeni",
    encerrada: "Sudjelovanje je završeno",
  },
  consentimento: {
    subtitulo: "Istraživanje korisničkog iskustva · PPGIa PUCPR",
    termoTitulo: "Obrazac pristanka",
    termoTexto: "Svoj dojam o proizvodu iznijet ćete kroz 26 parova suprotnih riječi.",
    condicoes: [
      ["Vrijeme", "Od 3 do 5 minuta."],
      ["Sudjelovanje", "Dobrovoljno. Možete odustati u bilo kojem trenutku, bez obrazloženja, i ništa od onoga što ste označili neće biti spremljeno."],
      ["Anonimnost", "Ne prikupljamo ime, e-poštu, IP adresu ni druge podatke koji vas mogu identificirati."],
      ["Korištenje podataka", "Odgovori se analiziraju zajedno i samo za ovo istraživanje."],
    ],
    concordo: "Pristajem i želim sudjelovati",
    naoQuero: "Ne želim sudjelovati",
    privacidade: "Politika privatnosti",
  },
  politica: {
    voltar: "Natrag",
    semTraducao: "Ova politika još nije prevedena na vaš jezik i prikazana je na portugalskom.",
  },
  fechado: {
    rascunho: {
      etapa: "Skica",
      titulo: "Ovo istraživanje još nije otvoreno",
      texto: "Prikupljanje odgovora još nije počelo. Pokušajte ponovno kasnije ili se obratite osobi koja vam je poslala poveznicu.",
    },
    encerrado: {
      etapa: "Završeno",
      titulo: "Prikupljanje odgovora za ovo istraživanje je završeno",
      texto: "Istraživanje više ne prima odgovore. Hvala na interesu.",
    },
  },
  jaRespondeu: {
    titulo: "Na ovo istraživanje već ste odgovorili",
    texto: "Vaši odgovori su spremljeni. Hvala na sudjelovanju. Sada možete zatvoriti ovu stranicu.",
  },
  questionario: {
    recuperadas: "Vratili smo odgovore koje ste već označili.",
    naoDeuEnviar: "Odgovore nije bilo moguće poslati",
    faltam: { other: "Bez odgovora: {n}" },
    marqueCadaUm: "Za slanje označite jedan kružić u svakom od njih. Ostali odgovori ostaju označeni.",
    irParaItem: "Idi na stavku {n}",
    enviar: "Pošalji odgovore",
    todosRespondidos: "Sve stavke ({total}) imaju odgovor. Sada možete poslati.",
    parcial: "Odgovoreno: {n} od {total}.",
    erroEncerrada: "Prikupljanje odgovora završilo je dok ste odgovarali. Vaši odgovori nisu spremljeni.",
    erroSemParticipacao: "Nismo pronašli vaše sudjelovanje. Ponovno otvorite poveznicu istraživanja i počnite iznova.",
    legenda: "Stavka {n} od {total}: {esquerdo} ili {direito}",
    naoRespondido: "Ova stavka nema odgovor",
    posicao: "{p} od 7, bliže: {termo}",
    centro: "4 od 7, sredina",
    contagem: "Odgovoreno: {n} od {total}",
    sair: "Izađi bez slanja",
    perguntaSair: "Izaći bez slanja? Ništa od onoga što ste označili neće biti spremljeno.",
    continuar: "Nastavi odgovarati",
  },
  sobreVoce: {
    titulo: "O vama",
    descricao:
      "Ova su pitanja neobavezna i pomažu opisati skupinu sudionika. Sva imaju mogućnost „Ne želim odgovoriti”.",
    faixaEtaria: {
      titulo: "Dobna skupina",
      opcoes: ["18 – 24 godine", "25 – 34 godine", "35 – 44 godine", "45 – 59 godina", "60 godina ili više"],
    },
    genero: { titulo: "Spol", opcoes: ["Žena", "Muškarac", "Drugo"] },
    escolaridade: {
      titulo: "Obrazovanje",
      opcoes: ["Osnovna škola", "Srednja škola", "Visoko obrazovanje", "Poslijediplomski studij"],
    },
    familiaridadeComProduto: {
      titulo: "Jeste li već prije koristili ovaj proizvod?",
      opcoes: ["Nikad", "Nekoliko puta", "Često"],
    },
    prefiroNao: "Ne želim odgovoriti",
    continuar: "Nastavi",
    pular: "Preskoči ovaj korak",
  },
  fim: {
    titulo: "Odgovori su spremljeni",
    texto: "Hvala na sudjelovanju. Vaši odgovori spremljeni su anonimno.",
    nota: "Sada možete zatvoriti ovu stranicu. Ništa se više neće tražiti.",
  },
  saiu: {
    titulo: "Izašli ste iz istraživanja",
    texto: "Nijedan vaš odgovor nije spremljen. Hvala na pažnji. Sada možete zatvoriti ovu stranicu.",
  },
};
