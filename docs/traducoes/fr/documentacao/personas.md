# Personas

Huit personas représentent les personnes qui utilisent l'Outil UEQ : trois du côté du chercheur, quatre du côté du participant et une du côté de la personne qui maintient l'installation.

Elles sont fictives. Elles ont été construites à partir du profil des utilisateurs et du contexte d'utilisation décrits dans [Fondements de l'IHM §2](../ihc.md#2-usuários-e-contexto-de-uso-iso-9241-11), qui suit la norme ISO 9241-11, et elles couvrent les cas extrêmes qui changent le plus la conception d'un écran : la personne qui n'a jamais fait de statistiques, celle qui ne se fie qu'au tableur officiel, celle qui ne lit pas le portugais, celle qui répond sur son téléphone avec une police agrandie, celle qui utilise un lecteur d'écran, celle qui lit de droite à gauche, celle qui a moins de 18 ans et celle qui doit intervenir dans le code.

Chaque persona renvoie aux [récits utilisateur](historias-de-usuario.md) rédigés à partir d'elle. La [matrice de traçabilité](matriz-rastreabilidade.md) relie chaque exigence aux personas qui la demandent.

| ID | Persona | Rôle | Usage principal |
|---|---|---|---|
| [PE01](#pe01) | Marina | Chercheuse, étudiante en master d'IHM | Monte l'étude, suit la collecte et interprète le tableau de bord |
| [PE02](#pe02) | Ricardo | Professeur et directeur de recherche | Suit l'étude de ses étudiants, compare des versions et vérifie les chiffres dans le tableur officiel |
| [PE03](#pe03) | Kenji | Chercheur invité, lit en japonais | Utilise l'outil et mène l'étude dans sa propre langue |
| [PE04](#pe04) | Célia | Participante sur téléphone | Répond via le lien reçu sur WhatsApp |
| [PE05](#pe05) | Tiago | Participant avec lecteur d'écran | Répond uniquement au clavier avec NVDA |
| [PE06](#pe06) | Amira | Participante qui lit en arabe | Répond dans sa propre langue, de droite à gauche |
| [PE07](#pe07) | Bruna | Participante mineure | Participe à une étude à l'école, avec l'autorisation de ses parents |
| [PE08](#pe08) | Lucas | Développeur et administrateur de l'installation | Installe l'outil, ajuste le protocole, administre les comptes et prouve que rien n'est cassé |

## Chercheurs

### PE01

**Marina, 26 ans, étudiante en master d'IHM.** Persona principale.

- **Contexte.** Elle est en première année de master et va évaluer avec l'UEQ deux versions de l'application de prise de rendez-vous de la clinique universitaire. Elle connaît l'UX et a déjà répondu à des questionnaires, mais n'a jamais calculé d'alpha de Cronbach. Elle travaille sur son ordinateur portable, par courtes sessions entre les cours, et ouvre le tableau de bord plusieurs fois par jour pendant la collecte.
- **Objectifs.** Créer l'étude sans erreur, envoyer le lien dans le groupe WhatsApp des patients, savoir combien de personnes ont déjà répondu, comprendre le résultat et reprendre des tableaux et des graphiques dans son mémoire.
- **Frustrations.** Les tableurs dans lesquels un copier-coller erroné gâche tout. Les formulaires génériques qui ne respectent pas l'ordre et la polarité de l'UEQ. Les statistiques présentées sans explication. Devoir rédiger le formulaire de consentement à partir de zéro.
- **Ce qu'elle attend de l'outil.** Une interprétation écrite à côté de chaque chiffre, une courte explication des termes techniques, des avertissements qui disent quoi faire, un formulaire de consentement qui demande déjà ce que l'éthique exige et des exports qui s'ouvrent directement dans Excel.

> « Je veux savoir si la nouvelle version est meilleure, pas devenir spécialiste en statistiques. »

Récits : [HU01](historias-de-usuario.md#hu01), [HU02](historias-de-usuario.md#hu02), [HU03](historias-de-usuario.md#hu03), [HU04](historias-de-usuario.md#hu04), [HU05](historias-de-usuario.md#hu05), [HU06](historias-de-usuario.md#hu06), [HU07](historias-de-usuario.md#hu07), [HU08](historias-de-usuario.md#hu08), [HU09](historias-de-usuario.md#hu09), [HU10](historias-de-usuario.md#hu10), [HU11](historias-de-usuario.md#hu11), [HU12](historias-de-usuario.md#hu12), [HU13](historias-de-usuario.md#hu13), [HU14](historias-de-usuario.md#hu14), [HU15](historias-de-usuario.md#hu15), [HU16](historias-de-usuario.md#hu16), [HU17](historias-de-usuario.md#hu17).

### PE02

**Ricardo, 48 ans, professeur et directeur de recherche.**

- **Contexte.** Il encadre quatre étudiants qui utilisent l'UEQ, dont Marina. Il connaît le handbook et l'UEQ Data Analysis Tool et leur fait confiance. Il travaille sur les ordinateurs partagés du laboratoire. Il dispose parfois de réponses recueillies sur papier, lors d'événements où chaque personne a peu de temps.
- **Objectifs.** Suivre l'étude de chaque étudiant sans demander de captures d'écran, comparer des versions d'un produit, vérifier que les chiffres concordent avec le tableur officiel avant de signer un article et ajouter les réponses papier à celles du lien.
- **Frustrations.** Les outils qui calculent « à leur façon » sans indiquer la règle. Devoir refaire les filtres pour discuter d'un résultat. Laisser la session ouverte sur un ordinateur partagé.
- **Ce qu'il attend de l'outil.** Un accès en lecture à l'étude de l'étudiant, un export au format exact du tableur officiel, des règles de suspicion et de calcul visibles, une adresse qui conserve la vue du tableau de bord, une importation avec aperçu et un changement de mot de passe qui ferme les autres sessions.

> « Si cela ne concorde pas avec le tableur officiel, cela n'entre pas dans l'article. »

Récits : [HU18](historias-de-usuario.md#hu18), [HU19](historias-de-usuario.md#hu19), [HU20](historias-de-usuario.md#hu20), [HU21](historias-de-usuario.md#hu21), [HU22](historias-de-usuario.md#hu22), [HU23](historias-de-usuario.md#hu23), [HU24](historias-de-usuario.md#hu24), [HU25](historias-de-usuario.md#hu25).

### PE03

**Kenji, 35 ans, chercheur invité d'une université japonaise.**

- **Contexte.** Il passe un semestre dans le laboratoire de Ricardo. Il lit le portugais lentement et travaille mieux en japonais. Il va mener avec l'UEQ une étude auprès de participants au Japon, sur une application de transport.
- **Objectifs.** Utiliser l'outil dans sa propre langue et monter une étude dont le lien s'ouvre en japonais, avec les termes officiels de l'UEQ.
- **Frustrations.** Une interface qui n'existe qu'en anglais ou en portugais. Une traduction qui change le nom des boutons d'un écran à l'autre.
- **Ce qu'il attend de l'outil.** Un sélecteur de langue toujours visible, une traduction cohérente de l'interface, une étude rédigée dans sa langue et le titre traduit pour les personnes qui répondent dans une autre langue.

> « Je comprends les statistiques. J'ai seulement besoin de lire l'écran. »

Récits : [HU26](historias-de-usuario.md#hu26), [HU27](historias-de-usuario.md#hu27).

## Participants

### PE04

**Célia, 63 ans, retraitée, patiente de la clinique universitaire.**

- **Contexte.** Elle reçoit le lien sur WhatsApp et l'ouvre sur son téléphone, avec la police du système agrandie. Elle utilise son téléphone pour les messages et la banque, mais se méfie des formulaires. Elle n'a pas de compte dans l'outil et aucune obligation de répondre.
- **Objectifs.** Comprendre rapidement de quoi il s'agit et qui le demande, répondre en quelques minutes et retourner à ce qu'elle faisait.
- **Frustrations.** Les petits boutons, les questions qui disparaissent quand la page se recharge, un formulaire qui n'indique pas ce qui manque, la demande de données personnelles.
- **Ce qu'elle attend de l'outil.** Un formulaire de consentement court et clair, qui indique le responsable de la recherche ; de grandes zones tactiles ; une progression visible ; un avertissement en cas d'item oublié avec un lien direct ; la possibilité d'abandonner et de passer les questions qui la concernent.

> « Si je ne comprends pas en une minute, je ferme. »

Récits : [HU28](historias-de-usuario.md#hu28), [HU29](historias-de-usuario.md#hu29), [HU30](historias-de-usuario.md#hu30), [HU31](historias-de-usuario.md#hu31), [HU32](historias-de-usuario.md#hu32), [HU33](historias-de-usuario.md#hu33), [HU34](historias-de-usuario.md#hu34).

### PE05

**Tiago, 29 ans, analyste informatique, aveugle.**

- **Contexte.** Il utilise Windows avec NVDA et navigue uniquement au clavier. Il répond souvent à des enquêtes UX et en a déjà abandonné beaucoup parce que les boutons étaient des `div` sans nom.
- **Objectifs.** Répondre avec la même précision qu'une personne voyante, en connaissant pour chaque cercle sa position et le pôle dont il est le plus proche.
- **Frustrations.** Une échelle sans libellé (« bouton, bouton, bouton »), une annonce de la progression à chaque clic, un focus qui saute tout seul, une erreur signalée uniquement en rouge.
- **Ce qu'il attend de l'outil.** Un item présenté comme un groupe avec une légende, des boutons radio natifs avec un nom accessible (« 3 sur 7, plus proche de facile »), une progression annoncée sans interruption, un résumé des erreurs qui reçoit le focus.

> « Si le lecteur d'écran dit seulement "bouton radio, 3 sur 7", je ne sais pas à quoi je réponds. »

Récits : [HU35](historias-de-usuario.md#hu35).

### PE06

**Amira, 34 ans, étudiante en échange, lit en arabe.**

- **Contexte.** Elle passe un semestre au Brésil et parle peu le portugais. Le navigateur de son téléphone est en arabe. Elle participe à l'étude d'un collègue de laboratoire.
- **Objectifs.** Répondre dans sa propre langue, avec les termes que l'UEQ a validés en arabe.
- **Frustrations.** Une traduction automatique qui change le sens du terme. Une page en arabe avec l'échelle inversée.
- **Ce qu'elle attend de l'outil.** Une langue choisie d'après le navigateur, un texte de droite à gauche avec l'échelle dans l'ordre officiel, un avertissement honnête indiquant que la traduction arabe n'a pas été approuvée par les auteurs de l'UEQ.

> « Je réponds mieux quand je lis dans ma langue. »

Récits : [HU36](historias-de-usuario.md#hu36).

### PE07

**Bruna, 16 ans, lycéenne.**

- **Contexte.** Son école participe à une étude sur la plateforme de devoirs qu'utilisent les élèves. Elle répond sur son téléphone, pendant la récréation, avec le lien envoyé par sa professeure.
- **Objectifs.** Participer comme ses camarades, sans complication.
- **Frustrations.** Un formulaire qui bloque sans expliquer pourquoi.
- **Ce qu'elle attend de l'outil.** Un formulaire de consentement qui demande l'âge avant de commencer et qui indique clairement que les personnes de moins de 18 ans ont besoin de l'autorisation de leur responsable légal, sans rien enregistrer avant.

> « Mes parents ont déjà signé l'autorisation de l'école. Où est-ce que je le confirme ? »

Récits : [HU37](historias-de-usuario.md#hu37).

## Personne qui maintient l'outil

### PE08

**Lucas, 31 ans, développeur et chercheur en génie logiciel.**

- **Contexte.** Il a trouvé le dépôt parce que son groupe utilise aussi l'UEQ. Il connaît TypeScript et Next.js. Il a installé l'outil pour le laboratoire et il est l'administrateur de l'installation : il crée les comptes des étudiants et présente l'outil en cours.
- **Objectifs.** Lancer l'outil en local en quelques minutes, comprendre l'architecture, modifier un seuil sans chercher un nombre dans le code, prouver qu'il n'a pas cassé le calcul et savoir si l'installation est prête pour une étude réelle.
- **Frustrations.** Un projet académique sans instructions d'installation, des règles métier dispersées dans l'interface, des tests inexistants, une documentation qui ne dit pas quel code implémente quoi.
- **Ce qu'il attend de l'outil.** Un README avec la procédure pas à pas, les paramètres du protocole en JSON avec leur source, le calcul isolé dans des fonctions pures avec des tests, une page d'administration qui montre l'état de l'installation sans donner accès aux études des autres, et une documentation qui relie les exigences au code.

> « Avant d'y toucher, j'ai besoin de savoir ce que garantit cette ligne. »

Récits : [HU38](historias-de-usuario.md#hu38), [HU39](historias-de-usuario.md#hu39), [HU40](historias-de-usuario.md#hu40), [HU41](historias-de-usuario.md#hu41), [HU42](historias-de-usuario.md#hu42), [HU43](historias-de-usuario.md#hu43), [HU44](historias-de-usuario.md#hu44).
