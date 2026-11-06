import type { TextosParticipante } from "../tipos";

export const tr: TextosParticipante = {
  pularConteudo: "İçeriğe geç",
  aguarde: "Lütfen bekleyin…",
  idioma: {
    rotulo: "Dil",
    aplicar: "Uygula",
    naoAprovada: "Anketin bu dile çevirisi UEQ yazarları tarafından henüz kesin olarak onaylanmadı.",
  },
  etapas: {
    nomes: ["Onay", "Anket", "İsteğe bağlı bilgiler"],
    rotulo: "Katılım adımları",
    rotuloConcluidas: "Katılım adımları, tümü tamamlandı",
    etapaDeTotal: "Adım {n}/{total} · {nome}",
  },
  titulos: {
    consentimento: "Onay",
    indisponivel: "Araştırma kullanılamıyor",
    jaRespondeu: "Zaten yanıt verdiniz",
    questionario: "Anket",
    dadosOpcionais: "İsteğe bağlı bilgiler",
    registradas: "Yanıtlar kaydedildi",
    encerrada: "Katılım sona erdi",
  },
  consentimento: {
    subtitulo: "Kullanıcı deneyimi araştırması · PPGIa PUCPR",
    termoTitulo: "Bilgilendirilmiş onay",
    termoTexto: "Ürüne dair izleniminizi 26 zıt kelime çifti üzerinden belirteceksiniz.",
    condicoes: [
      ["Süre", "3 ila 5 dakika."],
      ["Katılım", "Gönüllüdür. İstediğiniz an, gerekçe göstermeden bırakabilirsiniz; işaretlediğiniz hiçbir şey kaydedilmez."],
      ["Gizlilik", "Adınızı, e-postanızı, IP adresinizi veya sizi tanımlayan başka bir bilgiyi toplamıyoruz."],
      ["Verilerin kullanımı", "Yanıtlar toplu olarak ve yalnızca bu araştırma için analiz edilir."],
    ],
    concordo: "Kabul ediyorum ve katılmak istiyorum",
    naoQuero: "Katılmak istemiyorum",
    privacidade: "Gizlilik politikası",
  },
  politica: {
    voltar: "Geri dön",
    semTraducao: "Bu politika henüz dilinize çevrilmedi, bu nedenle Portekizce gösteriliyor.",
  },
  fechado: {
    rascunho: {
      etapa: "Taslak",
      titulo: "Bu araştırma henüz açılmadı",
      texto: "Yanıt toplama henüz başlamadı. Daha sonra tekrar deneyin veya bağlantıyı gönderen kişiyle iletişime geçin.",
    },
    encerrado: {
      etapa: "Kapandı",
      titulo: "Bu araştırmanın yanıt toplama süreci sona erdi",
      texto: "Araştırma artık yanıt kabul etmiyor. İlginiz için teşekkür ederiz.",
    },
  },
  jaRespondeu: {
    titulo: "Bu araştırmaya zaten yanıt verdiniz",
    texto: "Yanıtlarınız kaydedildi. Katıldığınız için teşekkür ederiz. Artık bu sayfayı kapatabilirsiniz.",
  },
  questionario: {
    recuperadas: "Daha önce işaretlediğiniz yanıtları geri getirdik.",
    naoDeuEnviar: "Yanıtlar gönderilemedi",
    faltam: { other: "{n} madde eksik" },
    marqueCadaUm: "Göndermek için her birinde bir seçenek işaretleyin. Diğer yanıtlarınız işaretli kalır.",
    irParaItem: "{n}. maddeye git",
    enviar: "Yanıtları gönder",
    todosRespondidos: "{total} maddenin tümü yanıtlandı. Artık gönderebilirsiniz.",
    parcial: "{n}/{total} yanıtlandı.",
    erroEncerrada: "Siz yanıtlarken bu araştırmanın yanıt toplama süreci sona erdi. Yanıtlarınız kaydedilmedi.",
    erroSemParticipacao: "Katılımınızı bulamadık. Baştan başlamak için araştırma bağlantısını yeniden açın.",
    legenda: "Madde {n}/{total}: {esquerdo} mi {direito} mi",
    naoRespondido: "Bu madde yanıtlanmadı",
    posicao: "{p}/7, şuna daha yakın: {termo}",
    centro: "4/7, orta",
    contagem: "{n}/{total} yanıtlandı",
    sair: "Göndermeden çık",
    perguntaSair: "Göndermeden çıkılsın mı? İşaretlediğiniz hiçbir şey kaydedilmez.",
    continuar: "Yanıtlamaya devam et",
  },
  sobreVoce: {
    titulo: "Sizin hakkınızda",
    descricao:
      "Bu sorular isteğe bağlıdır ve katılımcı grubunu tanımlamaya yardımcı olur. Hepsinde “Yanıt vermek istemiyorum” seçeneği vardır.",
    faixaEtaria: {
      titulo: "Yaş grubu",
      opcoes: ["18–24 yaş", "25–34 yaş", "35–44 yaş", "45–59 yaş", "60 yaş ve üzeri"],
    },
    genero: { titulo: "Cinsiyet", opcoes: ["Kadın", "Erkek", "Diğer"] },
    escolaridade: {
      titulo: "Eğitim durumu",
      opcoes: ["İlkokul", "Ortaöğretim", "Üniversite", "Lisansüstü"],
    },
    familiaridadeComProduto: {
      titulo: "Bu ürünü daha önce kullandınız mı?",
      opcoes: ["Hiç kullanmadım", "Birkaç kez", "Sık sık"],
    },
    prefiroNao: "Yanıt vermek istemiyorum",
    continuar: "Devam et",
    pular: "Bu adımı atla",
  },
  fim: {
    titulo: "Yanıtlar kaydedildi",
    texto: "Katıldığınız için teşekkür ederiz. Yanıtlarınız anonim olarak kaydedildi.",
    nota: "Artık bu sayfayı kapatabilirsiniz. Başka bir şey istenmeyecek.",
  },
  saiu: {
    titulo: "Araştırmadan çıktınız",
    texto: "Yanıtlarınızdan hiçbiri kaydedilmedi. İlginiz için teşekkür ederiz. Artık bu sayfayı kapatabilirsiniz.",
  },
};
