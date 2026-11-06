import type { TextosParticipante } from "../tipos";

export const es: TextosParticipante = {
  pularConteudo: "Saltar al contenido",
  idioma: {
    rotulo: "Idioma",
    aplicar: "Aplicar",
    naoAprovada: "Los autores del UEQ todavía no han aprobado de forma definitiva la traducción del cuestionario a este idioma.",
  },
  etapas: {
    nomes: ["Consentimiento", "Cuestionario", "Datos opcionales"],
    rotulo: "Etapas de la participación",
    rotuloConcluidas: "Etapas de la participación, todas completadas",
    etapaDeTotal: "Etapa {n} de {total} · {nome}",
  },
  titulos: {
    consentimento: "Consentimiento",
    indisponivel: "Estudio no disponible",
    jaRespondeu: "Ya has respondido",
    questionario: "Cuestionario",
    dadosOpcionais: "Datos opcionales",
    registradas: "Respuestas registradas",
    encerrada: "Participación terminada",
  },
  consentimento: {
    subtitulo: "Investigación sobre experiencia de usuario · PPGIa PUCPR",
    termoTitulo: "Consentimiento informado",
    termoTexto: "Vas a indicar tu impresión sobre el producto en 26 pares de palabras opuestas.",
    condicoes: [
      ["Tiempo", "De 3 a 5 minutos."],
      ["Participación", "Voluntaria. Puedes abandonar en cualquier momento, sin dar motivos, y no se guardará nada de lo que hayas marcado."],
      ["Anonimato", "No recogemos tu nombre, correo electrónico, dirección IP ni ningún otro dato que te identifique."],
      ["Uso de los datos", "Las respuestas se analizan en conjunto, solo para esta investigación."],
    ],
    concordo: "Acepto y quiero participar",
    naoQuero: "No quiero participar",
    privacidade: "Política de privacidad",
  },
  politica: {
    voltar: "Volver",
    semTraducao: "Esta política aún no está traducida a su idioma y aparece en portugués.",
  },
  fechado: {
    rascunho: {
      etapa: "Borrador",
      titulo: "Este estudio todavía no está abierto",
      texto: "La recogida de respuestas aún no ha empezado. Inténtalo más tarde o habla con quien te envió el enlace.",
    },
    encerrado: {
      etapa: "Cerrado",
      titulo: "La recogida de respuestas de este estudio ha terminado",
      texto: "El estudio ya no acepta respuestas. Gracias por tu interés en participar.",
    },
  },
  jaRespondeu: {
    titulo: "Ya has respondido este estudio",
    texto: "Tus respuestas se han registrado. Gracias por participar. Ya puedes cerrar esta página.",
  },
  questionario: {
    recuperadas: "Hemos recuperado las respuestas que ya habías marcado.",
    naoDeuEnviar: "No se han podido enviar las respuestas",
    faltam: { one: "Falta {n} ítem", other: "Faltan {n} ítems" },
    marqueCadaUm: "Marca una opción en cada uno para enviar. Tus demás respuestas siguen marcadas.",
    irParaItem: "Ir al ítem {n}",
    enviar: "Enviar respuestas",
    todosRespondidos: "Los {total} ítems están respondidos. Ya puedes enviar.",
    parcial: "{n} de {total} respondidos.",
    erroEncerrada: "La recogida de respuestas de este estudio terminó mientras respondías. Tus respuestas no se han guardado.",
    erroSemParticipacao: "No hemos encontrado tu participación. Abre de nuevo el enlace del estudio para empezar otra vez.",
    legenda: "Ítem {n} de {total}: {esquerdo} o {direito}",
    naoRespondido: "Este ítem no se ha respondido",
    posicao: "{p} de 7, más cerca de {termo}",
    centro: "4 de 7, centro",
    contagem: "{n} de {total} respondidos",
    sair: "Salir sin enviar",
    perguntaSair: "¿Salir sin enviar? No se guardará nada de lo que hayas marcado.",
    continuar: "Seguir respondiendo",
  },
  sobreVoce: {
    titulo: "Sobre ti",
    descricao:
      "Estas preguntas son opcionales y ayudan a describir al grupo de participantes. Todas tienen la opción «Prefiero no responder».",
    faixaEtaria: {
      titulo: "Edad",
      opcoes: ["De 18 a 24 años", "De 25 a 34 años", "De 35 a 44 años", "De 45 a 59 años", "60 años o más"],
    },
    genero: { titulo: "Género", opcoes: ["Mujer", "Hombre", "Otro"] },
    escolaridade: {
      titulo: "Nivel de estudios",
      opcoes: ["Educación primaria", "Educación secundaria", "Estudios universitarios", "Posgrado"],
    },
    familiaridadeComProduto: {
      titulo: "¿Ya habías usado este producto?",
      opcoes: ["Nunca lo había usado", "Algunas veces", "Con frecuencia"],
    },
    prefiroNao: "Prefiero no responder",
    continuar: "Continuar",
    pular: "Saltar esta etapa",
  },
  fim: {
    titulo: "Respuestas registradas",
    texto: "Gracias por participar. Tus respuestas se han guardado de forma anónima.",
    nota: "Ya puedes cerrar esta página. No se te pedirá nada más.",
  },
  saiu: {
    titulo: "Has salido del estudio",
    texto: "No se ha guardado ninguna de tus respuestas. Gracias por tu atención. Ya puedes cerrar esta página.",
  },
};
