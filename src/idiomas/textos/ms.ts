import type { TextosParticipante } from "../tipos";

export const ms: TextosParticipante = {
  pularConteudo: "Langkau ke kandungan",
  aguarde: "Sila tunggu…",
  idioma: {
    rotulo: "Bahasa",
    aplicar: "Guna",
    naoAprovada: "Terjemahan soal selidik ke bahasa ini belum diluluskan secara muktamad oleh pengarang UEQ.",
  },
  etapas: {
    nomes: ["Persetujuan", "Soal selidik", "Maklumat pilihan"],
    rotulo: "Langkah penyertaan",
    rotuloConcluidas: "Langkah penyertaan, semuanya selesai",
    etapaDeTotal: "Langkah {n} daripada {total} · {nome}",
  },
  titulos: {
    consentimento: "Persetujuan",
    indisponivel: "Kajian tidak tersedia",
    jaRespondeu: "Anda sudah menjawab",
    questionario: "Soal selidik",
    dadosOpcionais: "Maklumat pilihan",
    registradas: "Jawapan direkodkan",
    encerrada: "Penyertaan tamat",
  },
  consentimento: {
    subtitulo: "Kajian pengalaman pengguna · PPGIa PUCPR",
    termoTitulo: "Borang persetujuan",
    termoTexto: "Anda akan menyatakan tanggapan anda tentang produk melalui 26 pasangan perkataan yang bertentangan.",
    condicoes: [
      ["Masa", "3 hingga 5 minit."],
      ["Penyertaan", "Sukarela. Anda boleh berhenti pada bila-bila masa tanpa memberi sebab, dan apa yang telah anda tandakan tidak akan disimpan."],
      ["Tanpa nama", "Kami tidak mengumpul nama, e-mel, alamat IP atau data lain yang boleh mengenal pasti anda."],
      ["Penggunaan data", "Jawapan dianalisis secara bersama dan hanya untuk kajian ini."],
    ],
    concordo: "Saya setuju dan mahu menyertai",
    naoQuero: "Saya tidak mahu menyertai",
    privacidade: "Dasar privasi",
  },
  politica: {
    voltar: "Kembali",
    semTraducao: "Dasar ini belum diterjemahkan ke dalam bahasa anda, jadi ia dipaparkan dalam bahasa Portugis.",
  },
  fechado: {
    rascunho: {
      etapa: "Draf",
      titulo: "Kajian ini belum dibuka",
      texto: "Pengumpulan jawapan belum bermula. Cuba lagi nanti atau hubungi orang yang menghantar pautan ini.",
    },
    encerrado: {
      etapa: "Ditutup",
      titulo: "Pengumpulan jawapan untuk kajian ini telah tamat",
      texto: "Kajian ini tidak lagi menerima jawapan. Terima kasih atas minat anda.",
    },
  },
  jaRespondeu: {
    titulo: "Anda sudah menjawab kajian ini",
    texto: "Jawapan anda telah direkodkan. Terima kasih kerana menyertai. Anda boleh menutup halaman ini sekarang.",
  },
  questionario: {
    recuperadas: "Kami telah memulihkan jawapan yang sudah anda tandakan.",
    naoDeuEnviar: "Jawapan tidak dapat dihantar",
    faltam: { other: "{n} item lagi" },
    marqueCadaUm: "Tandakan satu bulatan pada setiap satu untuk menghantar. Jawapan anda yang lain masih ditandakan.",
    irParaItem: "Pergi ke item {n}",
    enviar: "Hantar jawapan",
    todosRespondidos: "Kesemua {total} item telah dijawab. Anda boleh menghantar sekarang.",
    parcial: "{n} daripada {total} dijawab.",
    erroEncerrada: "Pengumpulan jawapan untuk kajian ini tamat semasa anda menjawab. Jawapan anda tidak disimpan.",
    erroSemParticipacao: "Kami tidak menemui penyertaan anda. Buka semula pautan kajian untuk bermula semula.",
    legenda: "Item {n} daripada {total}: {esquerdo} atau {direito}",
    naoRespondido: "Item ini belum dijawab",
    posicao: "{p} daripada 7, lebih dekat dengan {termo}",
    centro: "4 daripada 7, tengah",
    contagem: "{n} daripada {total} dijawab",
    sair: "Keluar tanpa menghantar",
    perguntaSair: "Keluar tanpa menghantar? Apa yang telah anda tandakan tidak akan disimpan.",
    continuar: "Teruskan menjawab",
  },
  sobreVoce: {
    titulo: "Tentang anda",
    descricao:
      "Soalan ini adalah pilihan dan membantu menggambarkan kumpulan peserta. Semuanya ada pilihan “Saya memilih untuk tidak menjawab”.",
    faixaEtaria: {
      titulo: "Kumpulan umur",
      opcoes: ["18 hingga 24 tahun", "25 hingga 34 tahun", "35 hingga 44 tahun", "45 hingga 59 tahun", "60 tahun ke atas"],
    },
    genero: { titulo: "Jantina", opcoes: ["Perempuan", "Lelaki", "Lain-lain"] },
    escolaridade: {
      titulo: "Tahap pendidikan",
      opcoes: ["Sekolah rendah", "Sekolah menengah", "Pengajian tinggi", "Pascasiswazah"],
    },
    familiaridadeComProduto: {
      titulo: "Adakah anda pernah menggunakan produk ini sebelum ini?",
      opcoes: ["Tidak pernah", "Beberapa kali", "Kerap"],
    },
    prefiroNao: "Saya memilih untuk tidak menjawab",
    continuar: "Teruskan",
    pular: "Langkau langkah ini",
  },
  fim: {
    titulo: "Jawapan direkodkan",
    texto: "Terima kasih kerana menyertai. Jawapan anda telah disimpan tanpa nama.",
    nota: "Anda boleh menutup halaman ini sekarang. Tiada apa-apa lagi yang akan diminta.",
  },
  saiu: {
    titulo: "Anda telah keluar daripada kajian",
    texto: "Tiada jawapan anda yang disimpan. Terima kasih atas perhatian anda. Anda boleh menutup halaman ini sekarang.",
  },
};
