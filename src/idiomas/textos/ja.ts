import type { TextosParticipante } from "../tipos";

export const ja: TextosParticipante = {
  pularConteudo: "本文へスキップ",
  idioma: {
    rotulo: "言語",
    aplicar: "適用",
    naoAprovada: "この言語のアンケート翻訳は、UEQ の作成者による最終承認をまだ受けていません。",
  },
  etapas: {
    nomes: ["同意", "アンケート", "任意の情報"],
    rotulo: "参加の手順",
    rotuloConcluidas: "参加の手順、すべて完了",
    etapaDeTotal: "手順 {n}/{total} · {nome}",
  },
  titulos: {
    consentimento: "同意",
    indisponivel: "調査は利用できません",
    jaRespondeu: "回答済みです",
    questionario: "アンケート",
    dadosOpcionais: "任意の情報",
    registradas: "回答を記録しました",
    encerrada: "参加を終了しました",
  },
  consentimento: {
    subtitulo: "ユーザーエクスペリエンス調査 · PPGIa PUCPR",
    termoTitulo: "同意書",
    termoTexto: "26 組の反対の意味をもつ言葉で、製品の印象を答えていただきます。",
    condicoes: [
      ["所要時間", "3〜5 分。"],
      ["参加", "任意です。理由を述べずにいつでも中止でき、選んだ内容は保存されません。"],
      ["匿名性", "氏名、メールアドレス、IP アドレスなど、あなたを特定できる情報は収集しません。"],
      ["データの利用", "回答はまとめて分析し、この調査にのみ使用します。"],
    ],
    concordo: "同意して参加する",
    naoQuero: "参加しない",
  },
  fechado: {
    rascunho: {
      etapa: "下書き",
      titulo: "この調査はまだ公開されていません",
      texto: "回答の受付はまだ始まっていません。後でもう一度お試しいただくか、リンクを送った人にお問い合わせください。",
    },
    encerrado: {
      etapa: "終了",
      titulo: "この調査の回答受付は終了しました",
      texto: "この調査は回答を受け付けていません。ご関心をお寄せいただきありがとうございました。",
    },
  },
  jaRespondeu: {
    titulo: "この調査には回答済みです",
    texto: "回答は記録されています。ご参加ありがとうございました。このページを閉じてかまいません。",
  },
  questionario: {
    recuperadas: "すでに選んでいた回答を復元しました。",
    naoDeuEnviar: "送信できませんでした",
    faltam: { other: "未回答が {n} 件あります" },
    marqueCadaUm: "送信するには、それぞれで 1 つずつ選んでください。ほかの回答は選んだままです。",
    irParaItem: "項目 {n} へ移動",
    enviar: "回答を送信",
    todosRespondidos: "{total} 項目すべてに回答しました。送信できます。",
    parcial: "{total} 項目中 {n} 項目に回答しました。",
    erroEncerrada: "回答中にこの調査の受付が終了しました。回答は保存されていません。",
    erroSemParticipacao: "参加情報が見つかりませんでした。調査のリンクを開き直して、最初からやり直してください。",
    legenda: "項目 {n}/{total}：{esquerdo} か {direito} か",
    naoRespondido: "この項目は未回答です",
    posicao: "{p}/7、「{termo}」寄り",
    centro: "4/7、中央",
    contagem: "{n}/{total} 回答済み",
    sair: "送信せずに終了",
    perguntaSair: "送信せずに終了しますか？ 選んだ内容は保存されません。",
    continuar: "回答を続ける",
  },
  sobreVoce: {
    titulo: "あなたについて",
    descricao: "以下の質問は任意で、参加者の集団を説明するために使います。すべてに「回答しない」の選択肢があります。",
    faixaEtaria: {
      titulo: "年齢層",
      opcoes: ["18〜24 歳", "25〜34 歳", "35〜44 歳", "45〜59 歳", "60 歳以上"],
    },
    genero: { titulo: "性別", opcoes: ["女性", "男性", "その他"] },
    escolaridade: {
      titulo: "最終学歴",
      opcoes: ["小学校", "中学校・高校", "大学", "大学院"],
    },
    familiaridadeComProduto: {
      titulo: "この製品を以前に使ったことがありますか？",
      opcoes: ["使ったことがない", "何度か使った", "よく使う"],
    },
    prefiroNao: "回答しない",
    continuar: "次へ",
    pular: "この手順をスキップ",
  },
  fim: {
    titulo: "回答を記録しました",
    texto: "ご参加ありがとうございました。回答は匿名で保存されました。",
    nota: "このページを閉じてかまいません。これ以上お願いすることはありません。",
  },
  saiu: {
    titulo: "調査を終了しました",
    texto: "回答は一切保存されていません。お時間をいただきありがとうございました。このページを閉じてかまいません。",
  },
};
