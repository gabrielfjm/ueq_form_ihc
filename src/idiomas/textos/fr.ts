import type { TextosParticipante } from "../tipos";

export const fr: TextosParticipante = {
  pularConteudo: "Aller au contenu",
  idioma: {
    rotulo: "Langue",
    aplicar: "Appliquer",
    naoAprovada: "La traduction du questionnaire dans cette langue n’a pas encore été approuvée définitivement par les auteurs de l’UEQ.",
  },
  etapas: {
    nomes: ["Consentement", "Questionnaire", "Données facultatives"],
    rotulo: "Étapes de la participation",
    rotuloConcluidas: "Étapes de la participation, toutes terminées",
    etapaDeTotal: "Étape {n} sur {total} · {nome}",
  },
  titulos: {
    consentimento: "Consentement",
    indisponivel: "Étude indisponible",
    jaRespondeu: "Vous avez déjà répondu",
    questionario: "Questionnaire",
    dadosOpcionais: "Données facultatives",
    registradas: "Réponses enregistrées",
    encerrada: "Participation terminée",
  },
  consentimento: {
    subtitulo: "Recherche sur l’expérience utilisateur · PPGIa PUCPR",
    termoTitulo: "Formulaire de consentement",
    termoTexto: "Vous allez indiquer votre impression du produit sur 26 paires de mots opposés.",
    condicoes: [
      ["Durée", "De 3 à 5 minutes."],
      ["Participation", "Volontaire. Vous pouvez abandonner à tout moment, sans donner de raison, et rien de ce que vous avez coché ne sera enregistré."],
      ["Anonymat", "Nous ne collectons ni nom, ni e-mail, ni adresse IP, ni aucune autre donnée qui vous identifie."],
      ["Utilisation des données", "Les réponses sont analysées ensemble, uniquement pour cette recherche."],
    ],
    concordo: "J’accepte et je veux participer",
    naoQuero: "Je ne veux pas participer",
  },
  fechado: {
    rascunho: {
      etapa: "Brouillon",
      titulo: "Cette étude n’est pas encore ouverte",
      texto: "La collecte des réponses n’a pas encore commencé. Réessayez plus tard ou contactez la personne qui vous a envoyé le lien.",
    },
    encerrado: {
      etapa: "Terminée",
      titulo: "La collecte de cette étude est terminée",
      texto: "L’étude n’accepte plus de réponses. Merci de votre intérêt.",
    },
  },
  jaRespondeu: {
    titulo: "Vous avez déjà répondu à cette étude",
    texto: "Vos réponses ont été enregistrées. Merci de votre participation. Vous pouvez maintenant fermer cette page.",
  },
  questionario: {
    recuperadas: "Nous avons récupéré les réponses que vous aviez déjà cochées.",
    naoDeuEnviar: "Impossible d’envoyer les réponses",
    faltam: { one: "Il reste {n} élément", other: "Il reste {n} éléments" },
    marqueCadaUm: "Cochez une option pour chacun afin d’envoyer. Vos autres réponses restent cochées.",
    irParaItem: "Aller à l’élément {n}",
    enviar: "Envoyer les réponses",
    todosRespondidos: "Les {total} éléments ont une réponse. Vous pouvez envoyer.",
    parcial: "{n} sur {total} répondus.",
    erroEncerrada: "La collecte de cette étude s’est terminée pendant que vous répondiez. Vos réponses n’ont pas été enregistrées.",
    erroSemParticipacao: "Nous n’avons pas trouvé votre participation. Ouvrez à nouveau le lien de l’étude pour recommencer.",
    legenda: "Élément {n} sur {total} : {esquerdo} ou {direito}",
    naoRespondido: "Cet élément n’a pas de réponse",
    posicao: "{p} sur 7, plus près de {termo}",
    centro: "4 sur 7, centre",
    contagem: "{n} sur {total} répondus",
    sair: "Quitter sans envoyer",
    perguntaSair: "Quitter sans envoyer ? Rien de ce que vous avez coché ne sera enregistré.",
    continuar: "Continuer à répondre",
  },
  sobreVoce: {
    titulo: "À propos de vous",
    descricao:
      "Ces questions sont facultatives et aident à décrire le groupe de participants. Toutes proposent l’option « Je préfère ne pas répondre ».",
    faixaEtaria: {
      titulo: "Tranche d’âge",
      opcoes: ["18 à 24 ans", "25 à 34 ans", "35 à 44 ans", "45 à 59 ans", "60 ans ou plus"],
    },
    genero: { titulo: "Genre", opcoes: ["Femme", "Homme", "Autre"] },
    escolaridade: {
      titulo: "Niveau d’études",
      opcoes: ["École primaire", "Enseignement secondaire", "Enseignement supérieur", "Troisième cycle"],
    },
    familiaridadeComProduto: {
      titulo: "Aviez-vous déjà utilisé ce produit ?",
      opcoes: ["Jamais", "Quelques fois", "Souvent"],
    },
    prefiroNao: "Je préfère ne pas répondre",
    continuar: "Continuer",
    pular: "Passer cette étape",
  },
  fim: {
    titulo: "Réponses enregistrées",
    texto: "Merci de votre participation. Vos réponses ont été enregistrées de façon anonyme.",
    nota: "Vous pouvez maintenant fermer cette page. Rien d’autre ne vous sera demandé.",
  },
  saiu: {
    titulo: "Vous avez quitté l’étude",
    texto: "Aucune de vos réponses n’a été enregistrée. Merci de votre attention. Vous pouvez maintenant fermer cette page.",
  },
};
