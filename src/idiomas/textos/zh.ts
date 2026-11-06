import type { TextosParticipante } from "../tipos";

export const zh: TextosParticipante = {
  pularConteudo: "跳到主要内容",
  aguarde: "请稍候…",
  idioma: {
    rotulo: "语言",
    aplicar: "应用",
    naoAprovada: "该语言的问卷译本尚未获得 UEQ 作者的最终批准。",
  },
  etapas: {
    nomes: ["知情同意", "问卷", "选填信息"],
    rotulo: "参与步骤",
    rotuloConcluidas: "参与步骤，已全部完成",
    etapaDeTotal: "第 {n} 步，共 {total} 步 · {nome}",
  },
  titulos: {
    consentimento: "知情同意",
    indisponivel: "研究暂不可用",
    jaRespondeu: "你已经作答",
    questionario: "问卷",
    dadosOpcionais: "选填信息",
    registradas: "回答已记录",
    encerrada: "参与已结束",
  },
  consentimento: {
    subtitulo: "用户体验研究 · PPGIa PUCPR",
    termoTitulo: "知情同意书",
    termoTexto: "你将通过 26 对意义相反的词语，表达你对该产品的印象。",
    condicoes: [
      ["用时", "3 至 5 分钟。"],
      ["参与方式", "自愿参与。你可以随时退出，无需说明理由，已勾选的内容都不会被保存。"],
      ["匿名", "我们不收集姓名、电子邮箱、IP 地址或其他能识别你身份的信息。"],
      ["数据用途", "所有回答将合并分析，仅用于本研究。"],
    ],
    concordo: "我同意并愿意参与",
    naoQuero: "我不想参与",
    privacidade: "隐私政策",
  },
  politica: {
    voltar: "返回",
    semTraducao: "本政策尚未翻译成您的语言，因此以葡萄牙语显示。",
  },
  fechado: {
    rascunho: {
      etapa: "草稿",
      titulo: "本研究尚未开放",
      texto: "尚未开始收集回答。请稍后再试，或联系向你发送链接的人。",
    },
    encerrado: {
      etapa: "已结束",
      titulo: "本研究已停止收集回答",
      texto: "本研究不再接受回答。感谢你的关注。",
    },
  },
  jaRespondeu: {
    titulo: "你已经回答过本研究",
    texto: "你的回答已记录。感谢参与。现在可以关闭此页面。",
  },
  questionario: {
    recuperadas: "我们已恢复你之前勾选的回答。",
    naoDeuEnviar: "无法提交回答",
    faltam: { other: "还有 {n} 项未答" },
    marqueCadaUm: "请在每一项中各选择一个圆圈后再提交。你的其他回答仍保持勾选。",
    irParaItem: "前往第 {n} 项",
    enviar: "提交回答",
    todosRespondidos: "全部 {total} 项均已作答，现在可以提交。",
    parcial: "已答 {n} 项，共 {total} 项。",
    erroEncerrada: "在你作答期间，本研究已停止收集回答。你的回答未被保存。",
    erroSemParticipacao: "未找到你的参与记录。请重新打开研究链接，从头开始。",
    legenda: "第 {n} 项，共 {total} 项：{esquerdo} 还是 {direito}",
    naoRespondido: "此项尚未作答",
    posicao: "{p}/7，更接近“{termo}”",
    centro: "4/7，中间",
    contagem: "已答 {n}/{total}",
    sair: "不提交并退出",
    perguntaSair: "不提交就退出吗？已勾选的内容都不会被保存。",
    continuar: "继续作答",
  },
  sobreVoce: {
    titulo: "关于你",
    descricao: "以下问题为选填，用于描述参与者群体。每个问题都有“不愿回答”选项。",
    faixaEtaria: {
      titulo: "年龄段",
      opcoes: ["18–24 岁", "25–34 岁", "35–44 岁", "45–59 岁", "60 岁及以上"],
    },
    genero: { titulo: "性别", opcoes: ["女", "男", "其他"] },
    escolaridade: {
      titulo: "受教育程度",
      opcoes: ["小学", "中学", "大学", "研究生"],
    },
    familiaridadeComProduto: {
      titulo: "你以前用过这个产品吗？",
      opcoes: ["从未用过", "用过几次", "经常使用"],
    },
    prefiroNao: "不愿回答",
    continuar: "继续",
    pular: "跳过此步",
  },
  fim: {
    titulo: "回答已记录",
    texto: "感谢参与。你的回答已匿名保存。",
    nota: "现在可以关闭此页面，不会再要求你填写其他内容。",
  },
  saiu: {
    titulo: "你已退出本研究",
    texto: "你的回答均未保存。感谢你的关注。现在可以关闭此页面。",
  },
};
