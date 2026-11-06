import type { TextosParticipante } from "../tipos";

export const bs: TextosParticipante = {
  pularConteudo: "Preskoči na sadržaj",
  idioma: {
    rotulo: "Jezik",
    aplicar: "Primijeni",
    naoAprovada: "Autori UEQ-a još nisu konačno odobrili prijevod upitnika na ovaj jezik.",
  },
  etapas: {
    nomes: ["Saglasnost", "Upitnik", "Neobavezni podaci"],
    rotulo: "Koraci učešća",
    rotuloConcluidas: "Koraci učešća, svi završeni",
    etapaDeTotal: "Korak {n} od {total} · {nome}",
  },
  titulos: {
    consentimento: "Saglasnost",
    indisponivel: "Istraživanje nije dostupno",
    jaRespondeu: "Već ste odgovorili",
    questionario: "Upitnik",
    dadosOpcionais: "Neobavezni podaci",
    registradas: "Odgovori su sačuvani",
    encerrada: "Učešće je završeno",
  },
  consentimento: {
    subtitulo: "Istraživanje korisničkog iskustva · PPGIa PUCPR",
    termoTitulo: "Izjava o saglasnosti",
    termoTexto: "Svoj utisak o proizvodu iznijet ćete kroz 26 parova suprotnih riječi.",
    condicoes: [
      ["Vrijeme", "Od 3 do 5 minuta."],
      ["Učešće", "Dobrovoljno. Možete odustati u bilo kojem trenutku, bez obrazloženja, i ništa od onoga što ste označili neće biti sačuvano."],
      ["Anonimnost", "Ne prikupljamo ime, e-mail, IP adresu niti druge podatke koji vas mogu identifikovati."],
      ["Korištenje podataka", "Odgovori se analiziraju zajedno i samo za ovo istraživanje."],
    ],
    concordo: "Saglasan/saglasna sam i želim učestvovati",
    naoQuero: "Ne želim učestvovati",
    privacidade: "Politika privatnosti",
  },
  politica: {
    voltar: "Nazad",
    semTraducao: "Ova politika još nije prevedena na vaš jezik i prikazana je na portugalskom.",
  },
  fechado: {
    rascunho: {
      etapa: "Nacrt",
      titulo: "Ovo istraživanje još nije otvoreno",
      texto: "Prikupljanje odgovora još nije počelo. Pokušajte ponovo kasnije ili se obratite osobi koja vam je poslala link.",
    },
    encerrado: {
      etapa: "Završeno",
      titulo: "Prikupljanje odgovora za ovo istraživanje je završeno",
      texto: "Istraživanje više ne prima odgovore. Hvala na interesovanju.",
    },
  },
  jaRespondeu: {
    titulo: "Na ovo istraživanje već ste odgovorili",
    texto: "Vaši odgovori su sačuvani. Hvala na učešću. Sada možete zatvoriti ovu stranicu.",
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
    erroEncerrada: "Prikupljanje odgovora završilo je dok ste odgovarali. Vaši odgovori nisu sačuvani.",
    erroSemParticipacao: "Nismo pronašli vaše učešće. Ponovo otvorite link istraživanja i počnite iznova.",
    legenda: "Stavka {n} od {total}: {esquerdo} ili {direito}",
    naoRespondido: "Ova stavka nema odgovor",
    posicao: "{p} od 7, bliže: {termo}",
    centro: "4 od 7, sredina",
    contagem: "Odgovoreno: {n} od {total}",
    sair: "Izađi bez slanja",
    perguntaSair: "Izaći bez slanja? Ništa od onoga što ste označili neće biti sačuvano.",
    continuar: "Nastavi odgovarati",
  },
  sobreVoce: {
    titulo: "O vama",
    descricao:
      "Ova pitanja su neobavezna i pomažu da se opiše grupa učesnika. Sva imaju opciju „Ne želim odgovoriti”.",
    faixaEtaria: {
      titulo: "Starosna grupa",
      opcoes: ["18 – 24 godine", "25 – 34 godine", "35 – 44 godine", "45 – 59 godina", "60 godina ili više"],
    },
    genero: { titulo: "Spol", opcoes: ["Žena", "Muškarac", "Drugo"] },
    escolaridade: {
      titulo: "Obrazovanje",
      opcoes: ["Osnovna škola", "Srednja škola", "Visoko obrazovanje", "Postdiplomski studij"],
    },
    familiaridadeComProduto: {
      titulo: "Jeste li ranije koristili ovaj proizvod?",
      opcoes: ["Nikad", "Nekoliko puta", "Često"],
    },
    prefiroNao: "Ne želim odgovoriti",
    continuar: "Nastavi",
    pular: "Preskoči ovaj korak",
  },
  fim: {
    titulo: "Odgovori su sačuvani",
    texto: "Hvala na učešću. Vaši odgovori su sačuvani anonimno.",
    nota: "Sada možete zatvoriti ovu stranicu. Ništa se više neće tražiti.",
  },
  saiu: {
    titulo: "Izašli ste iz istraživanja",
    texto: "Nijedan vaš odgovor nije sačuvan. Hvala na pažnji. Sada možete zatvoriti ovu stranicu.",
  },
};
