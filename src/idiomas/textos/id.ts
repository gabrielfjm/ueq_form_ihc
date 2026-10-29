import type { TextosParticipante } from "../tipos";

export const id: TextosParticipante = {
  pularConteudo: "Lewati ke konten",
  idioma: {
    rotulo: "Bahasa",
    aplicar: "Terapkan",
    naoAprovada: "Terjemahan kuesioner ke bahasa ini belum disetujui secara final oleh penyusun UEQ.",
  },
  etapas: {
    nomes: ["Persetujuan", "Kuesioner", "Data opsional"],
    rotulo: "Tahap partisipasi",
    rotuloConcluidas: "Tahap partisipasi, semuanya selesai",
    etapaDeTotal: "Tahap {n} dari {total} · {nome}",
  },
  titulos: {
    consentimento: "Persetujuan",
    indisponivel: "Studi tidak tersedia",
    jaRespondeu: "Anda sudah menjawab",
    questionario: "Kuesioner",
    dadosOpcionais: "Data opsional",
    registradas: "Jawaban tercatat",
    encerrada: "Partisipasi berakhir",
  },
  consentimento: {
    subtitulo: "Penelitian pengalaman pengguna · PPGIa PUCPR",
    termoTitulo: "Formulir persetujuan",
    termoTexto: "Anda akan menyampaikan kesan Anda tentang produk melalui 26 pasang kata yang berlawanan.",
    condicoes: [
      ["Waktu", "3 sampai 5 menit."],
      ["Partisipasi", "Sukarela. Anda dapat berhenti kapan saja tanpa memberi alasan, dan tidak ada yang Anda tandai yang akan disimpan."],
      ["Anonimitas", "Kami tidak mengumpulkan nama, email, alamat IP, atau data lain yang dapat mengidentifikasi Anda."],
      ["Penggunaan data", "Jawaban dianalisis secara bersama-sama dan hanya untuk penelitian ini."],
    ],
    concordo: "Saya setuju dan ingin berpartisipasi",
    naoQuero: "Saya tidak ingin berpartisipasi",
  },
  fechado: {
    rascunho: {
      etapa: "Draf",
      titulo: "Studi ini belum dibuka",
      texto: "Pengumpulan jawaban belum dimulai. Coba lagi nanti atau hubungi orang yang mengirimkan tautan ini.",
    },
    encerrado: {
      etapa: "Ditutup",
      titulo: "Pengumpulan jawaban untuk studi ini telah berakhir",
      texto: "Studi ini tidak lagi menerima jawaban. Terima kasih atas minat Anda.",
    },
  },
  jaRespondeu: {
    titulo: "Anda sudah menjawab studi ini",
    texto: "Jawaban Anda sudah tercatat. Terima kasih telah berpartisipasi. Anda sekarang dapat menutup halaman ini.",
  },
  questionario: {
    recuperadas: "Kami memulihkan jawaban yang sudah Anda tandai.",
    naoDeuEnviar: "Jawaban tidak dapat dikirim",
    faltam: { other: "{n} item lagi" },
    marqueCadaUm: "Tandai satu lingkaran pada masing-masing untuk mengirim. Jawaban Anda yang lain tetap tertandai.",
    irParaItem: "Ke item {n}",
    enviar: "Kirim jawaban",
    todosRespondidos: "Semua {total} item sudah dijawab. Anda dapat mengirim sekarang.",
    parcial: "{n} dari {total} dijawab.",
    erroEncerrada: "Pengumpulan jawaban untuk studi ini berakhir saat Anda menjawab. Jawaban Anda tidak disimpan.",
    erroSemParticipacao: "Kami tidak menemukan partisipasi Anda. Buka kembali tautan studi untuk memulai dari awal.",
    legenda: "Item {n} dari {total}: {esquerdo} atau {direito}",
    naoRespondido: "Item ini belum dijawab",
    posicao: "{p} dari 7, lebih dekat ke {termo}",
    centro: "4 dari 7, tengah",
    contagem: "{n} dari {total} dijawab",
    sair: "Keluar tanpa mengirim",
    perguntaSair: "Keluar tanpa mengirim? Tidak ada yang Anda tandai yang akan disimpan.",
    continuar: "Lanjut menjawab",
  },
  sobreVoce: {
    titulo: "Tentang Anda",
    descricao:
      "Pertanyaan ini opsional dan membantu menggambarkan kelompok peserta. Semuanya memiliki pilihan “Memilih tidak menjawab”.",
    faixaEtaria: {
      titulo: "Kelompok usia",
      opcoes: ["18–24 tahun", "25–34 tahun", "35–44 tahun", "45–59 tahun", "60 tahun ke atas"],
    },
    genero: { titulo: "Gender", opcoes: ["Perempuan", "Laki-laki", "Lainnya"] },
    escolaridade: {
      titulo: "Pendidikan",
      opcoes: ["Sekolah dasar", "Sekolah menengah", "Perguruan tinggi", "Pascasarjana"],
    },
    familiaridadeComProduto: {
      titulo: "Apakah Anda pernah memakai produk ini sebelumnya?",
      opcoes: ["Belum pernah", "Beberapa kali", "Sering"],
    },
    prefiroNao: "Memilih tidak menjawab",
    continuar: "Lanjut",
    pular: "Lewati tahap ini",
  },
  fim: {
    titulo: "Jawaban tercatat",
    texto: "Terima kasih telah berpartisipasi. Jawaban Anda disimpan secara anonim.",
    nota: "Anda sekarang dapat menutup halaman ini. Tidak ada lagi yang akan diminta.",
  },
  saiu: {
    titulo: "Anda keluar dari studi",
    texto: "Tidak ada jawaban Anda yang disimpan. Terima kasih atas perhatian Anda. Anda sekarang dapat menutup halaman ini.",
  },
};
