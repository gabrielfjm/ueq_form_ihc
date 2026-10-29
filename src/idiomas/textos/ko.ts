import type { TextosParticipante } from "../tipos";

export const ko: TextosParticipante = {
  pularConteudo: "본문으로 건너뛰기",
  idioma: {
    rotulo: "언어",
    aplicar: "적용",
    naoAprovada: "이 언어의 설문 번역은 아직 UEQ 저자들의 최종 승인을 받지 않았습니다.",
  },
  etapas: {
    nomes: ["동의", "설문", "선택 정보"],
    rotulo: "참여 단계",
    rotuloConcluidas: "참여 단계, 모두 완료",
    etapaDeTotal: "{total}단계 중 {n}단계 · {nome}",
  },
  titulos: {
    consentimento: "동의",
    indisponivel: "연구를 이용할 수 없음",
    jaRespondeu: "이미 응답했습니다",
    questionario: "설문",
    dadosOpcionais: "선택 정보",
    registradas: "응답이 기록되었습니다",
    encerrada: "참여 종료",
  },
  consentimento: {
    subtitulo: "사용자 경험 연구 · PPGIa PUCPR",
    termoTitulo: "연구 참여 동의서",
    termoTexto: "서로 반대되는 단어 26쌍으로 제품에 대한 인상을 평가하게 됩니다.",
    condicoes: [
      ["소요 시간", "3~5분."],
      ["참여", "자발적입니다. 이유를 밝히지 않고 언제든지 그만둘 수 있으며, 표시한 내용은 저장되지 않습니다."],
      ["익명성", "이름, 이메일, IP 주소 등 귀하를 식별할 수 있는 정보는 수집하지 않습니다."],
      ["데이터 사용", "응답은 함께 분석되며 이 연구에만 사용됩니다."],
    ],
    concordo: "동의하며 참여하겠습니다",
    naoQuero: "참여하지 않겠습니다",
  },
  fechado: {
    rascunho: {
      etapa: "초안",
      titulo: "이 연구는 아직 열리지 않았습니다",
      texto: "아직 응답 수집이 시작되지 않았습니다. 나중에 다시 시도하거나 링크를 보낸 사람에게 문의하세요.",
    },
    encerrado: {
      etapa: "종료",
      titulo: "이 연구의 응답 수집이 끝났습니다",
      texto: "이 연구는 더 이상 응답을 받지 않습니다. 관심을 가져 주셔서 감사합니다.",
    },
  },
  jaRespondeu: {
    titulo: "이 연구에 이미 응답했습니다",
    texto: "응답이 기록되었습니다. 참여해 주셔서 감사합니다. 이제 이 페이지를 닫아도 됩니다.",
  },
  questionario: {
    recuperadas: "이미 표시했던 응답을 복원했습니다.",
    naoDeuEnviar: "응답을 보낼 수 없습니다",
    faltam: { other: "{n}개 항목이 남았습니다" },
    marqueCadaUm: "보내려면 각 항목에서 하나씩 선택하세요. 다른 응답은 그대로 표시되어 있습니다.",
    irParaItem: "{n}번 항목으로 이동",
    enviar: "응답 보내기",
    todosRespondidos: "{total}개 항목에 모두 응답했습니다. 이제 보낼 수 있습니다.",
    parcial: "{total}개 중 {n}개 응답.",
    erroEncerrada: "응답하는 동안 이 연구의 응답 수집이 끝났습니다. 응답은 저장되지 않았습니다.",
    erroSemParticipacao: "참여 기록을 찾을 수 없습니다. 연구 링크를 다시 열어 처음부터 시작하세요.",
    legenda: "{total}개 중 {n}번 항목: {esquerdo} 또는 {direito}",
    naoRespondido: "이 항목에 응답하지 않았습니다",
    posicao: "7 중 {p}, {termo} 쪽",
    centro: "7 중 4, 가운데",
    contagem: "{total}개 중 {n}개 응답",
    sair: "보내지 않고 나가기",
    perguntaSair: "보내지 않고 나가시겠습니까? 표시한 내용은 저장되지 않습니다.",
    continuar: "계속 응답하기",
  },
  sobreVoce: {
    titulo: "귀하에 대하여",
    descricao: "다음 질문은 선택 사항이며 참여자 집단을 설명하는 데 도움이 됩니다. 모든 질문에 “응답하지 않음” 선택지가 있습니다.",
    faixaEtaria: {
      titulo: "연령대",
      opcoes: ["18~24세", "25~34세", "35~44세", "45~59세", "60세 이상"],
    },
    genero: { titulo: "성별", opcoes: ["여성", "남성", "기타"] },
    escolaridade: {
      titulo: "최종 학력",
      opcoes: ["초등학교", "중·고등학교", "대학교", "대학원"],
    },
    familiaridadeComProduto: {
      titulo: "이 제품을 전에 사용해 본 적이 있습니까?",
      opcoes: ["사용한 적 없음", "몇 번 사용함", "자주 사용함"],
    },
    prefiroNao: "응답하지 않음",
    continuar: "계속",
    pular: "이 단계 건너뛰기",
  },
  fim: {
    titulo: "응답이 기록되었습니다",
    texto: "참여해 주셔서 감사합니다. 응답은 익명으로 저장되었습니다.",
    nota: "이제 이 페이지를 닫아도 됩니다. 더 이상 요청하는 것은 없습니다.",
  },
  saiu: {
    titulo: "연구에서 나갔습니다",
    texto: "응답은 하나도 저장되지 않았습니다. 시간을 내 주셔서 감사합니다. 이제 이 페이지를 닫아도 됩니다.",
  },
};
