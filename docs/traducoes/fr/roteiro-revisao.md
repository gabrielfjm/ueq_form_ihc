# Feuille de route de la revue

Pour les personnes qui vont revoir l'outil avant la livraison. Elle indique quoi ouvrir, quoi faire sur chaque écran, quoi évaluer et comment consigner.

## Ce qu'est l'outil

L'outil applique le User Experience Questionnaire (UEQ) et analyse les réponses. Il y a deux publics :

- **Chercheur :** crée une étude avec une ou plusieurs versions d'un produit, partage un lien et suit le tableau de bord des résultats.
- **Participant :** ouvre le lien, sans compte, et répond aux 26 paires de mots en 3 à 5 minutes, dans l'une des 37 langues de l'UEQ.

Les chercheurs travaillent aussi en équipe, reçoivent des avis dans une cloche et peuvent utiliser l'outil dans n'importe laquelle des 37 langues.

## Comment l'ouvrir

**En production :** https://ferramenta-ueq.vercel.app. Créez votre compte avec « Créer un compte ». Sans l'étude d'exemple, créez votre propre étude ou utilisez les scénarios de démonstration de l'Administration, si votre compte est administrateur.

**Sur votre propre machine :** sur un ordinateur doté de Docker, Node et pnpm, dans le dossier du dépôt :

```
docker compose up -d
pnpm install
cp .env.example .env
pnpm db:migrate
pnpm db:seed
pnpm dev
```

Ensuite, ouvrez http://localhost:3000.

- **Compte de chercheur prêt à l'emploi :** `pesquisador@exemplo.com`, mot de passe `senha-de-teste`. Il contient déjà l'« Estudo de exemplo » (étude d'exemple), avec 35 réponses réparties en 2 versions, dont 4 suspectes.
- **Lien du participant de cette étude :** http://localhost:3000/r/exemplo. Chaque navigateur ne répond qu'une fois. Pour répondre de nouveau, utilisez une fenêtre de navigation privée.
- **Pour voir le questionnaire dans une autre langue :** changez dans le sélecteur « Langue » du consentement.
- **Pour voir l'outil dans une autre langue :** le sélecteur de langue de la barre (« PT »), ou Mon compte › Langue. Sans `ANTHROPIC_API_KEY`, l'interface reste en portugais.

## Les écrans, dans l'ordre d'utilisation

Pour chaque écran, effectuez la tâche et comparez avec le prototype dans `docs/prototipos/alta-fidelidade/`.

| # | Écran | Comment y accéder | Prototype | Tâche |
|---|---|---|---|---|
| 1 | Page d'accueil | http://localhost:3000 | r16, r16b avec connexion | Expliquez, rien qu'en lisant, ce qu'est l'UEQ et ce que fait l'outil |
| 2 | Se connecter | bouton « Se connecter » dans la barre, ouvre une fenêtre | r17, r18 sur téléphone | Connectez-vous avec le compte prêt à l'emploi, en vous trompant d'abord de mot de passe |
| 3 | Créer un compte | « Créer un compte » dans la fenêtre Se connecter | r19, r2 avec erreur | Créez un compte en laissant un champ vide, puis corrigez |
| 3a | Politique de confidentialité | lien dans les fenêtres d'accès, dans le pied de la page d'accueil, dans Mon compte et dans l'aide | r33 | Ouvrez-la par deux chemins différents et utilisez « Retour ». Dites ce qui arrive à vos réponses |
| 3b | Visite guidée | première connexion d'un compte neuf | r28, r29 | Suivez une partie de la visite, puis passez-la |
| 3c | Liste des études | menu « Études » | r3 | Trouvez l'Estudo de exemplo (étude d'exemple) |
| 4 | Créer une étude | « Créer une étude » | r4, r39 pendant l'envoi, r40 à la confirmation | Créez une étude avec 2 versions et cliquez deux fois sur Créer une étude |
| 5 | Étude en brouillon | après la création | r4b | Ouvrez la collecte et copiez le lien |
| 6 | Page de l'étude | titre de l'étude dans la liste | r5 | Clôturez et rouvrez la collecte |
| 7 | Consentement | le lien de l'étude | p1 | Lisez le formulaire et changez la langue |
| 7a | Politique, dans le lien du participant | « Politique de confidentialité », à la fin du formulaire | p9 | Dites ce qui arrive à vos réponses et revenez au formulaire |
| 8 | Questionnaire | « Je suis d'accord et je souhaite participer » | p7 (ordinateur), p2 (téléphone), p8 (quitter sans envoyer) | Répondez à tout, en laissant 2 items vides à la première tentative |
| 9 | Item manquant | envoyer un questionnaire incomplet | p3 | Utilisez le résumé pour atteindre les items manquants |
| 10 | Données facultatives | après l'envoi, seulement si l'étude en recueille | p4 | Répondez à une question et passez les autres |
| 11 | Fin | « Continuer » | p5 | — |
| 12 | Lien fermé | le lien d'une étude clôturée ou en brouillon | p6 | — |
| 13 | Résultats, une version | onglet « Résultats » | r6 | Dites, rien qu'en regardant, quelle échelle est la meilleure et si elle dépasse le benchmark |
| 14 | Résultats, comparaison | « Comparer les versions » | r7 | Dites quelle version est la meilleure en Stimulation |
| 15 | Réponses et suspectes | onglet « Réponses » | r8 | Affichez seulement les suspectes, retirez-en une de l'analyse et remettez-la |
| 15a | Données démographiques | sous-onglet de « Résultats », dans une étude dont la collecte est activée | r31, r32 pour activer la collecte | Dites quelle tranche d'âge est la plus fréquente |
| 15b | Partager | « Partager » sur la page de l'étude | r25 | Invitez un autre compte comme Lecteur et, dans ce compte, acceptez |
| 15c | Cloche et notifications | cloche dans la barre, puis « Voir toutes les notifications » | r26, r27 | Trouvez l'invitation et l'avis de nouvelles réponses |
| 15d | Aide de la page | bouton (?) dans l'en-tête de chaque page | r30 | Ouvrez-la sur deux pages et dites si l'explication aide |
| 16 | Mon compte | menu « Mon compte » | r9, r35 pour la langue | Changez le nom et téléchargez vos données |
| 16d | Langue par la barre | sélecteur « PT » dans la barre, avec et sans connexion | r41 | Passez dans une autre langue et revenez au portugais sans quitter la page |
| 16a | Administration | menu « Administration », uniquement pour un compte administrateur | r24, r24b, r24c, r34 | Créez un compte et regardez la couverture des langues |
| 16b | Documentation | menu « Documentation », avec et sans connexion | r10 à r15, r23, r36 à r38 | Ouvrez un document, entrez dans une section, agrandissez un diagramme, suivez un lien vers un autre document et utilisez Retour |
| 16c | Déconnexion et suppressions | « Déconnexion » ; supprimer une étude ; supprimer un compte | r20, r21, r22 | Annulez et confirmez, en utilisant aussi Échap |
| 17 | Exporter | fin de l'onglet « Résultats » | r6, section 04 | Téléchargez le tableur officiel de l'UEQ (XLSX), ouvrez-le dans Excel et comparez avec le tableau de bord ; téléchargez le tableau de bord en PDF |
| 18 | Importer des réponses | onglet « Réponses », « Importer les réponses depuis un CSV » | sans prototype | Importez `data/fixtures/basico/respostas.csv` dans une version |
| 19 | Tableau de bord en PDF | « Tableau de bord en PDF » | sans prototype | Ouvrez le PDF et vérifiez s'il est utilisable dans le rapport |
| 20 | Sélecteur de langue | haut du consentement | sans prototype | Choisissez l'arabe ou le japonais et répondez au questionnaire |

Les écrans 18 à 20 n'ont pas de prototype. Évaluez s'ils suivent le même modèle que les autres : boutons, champs, tableaux, messages et ton.

## Ce qu'il faut évaluer

Menez les trois volets. Les deux premiers, chaque personne les fait seule ; la consolidation se fait en groupe.

1. **Évaluation heuristique.** Sur chaque écran, cherchez des problèmes selon les 10 heuristiques de Nielsen. Attribuez la gravité de 0 à 4 (tableau ci-dessous).
2. **Liste de contrôle manuelle d'accessibilité.** Utilisez `docs/checklist-manual.md` : lecteur d'écran, clavier seul, zoom, daltonisme et téléphone réel. Les tests automatiques ne remplacent aucun de ces points.
3. **Vérification des décisions.** Dans `docs/rastreabilidade-ihc.md`, chaque ligne énonce une décision et indique où elle apparaît. Vérifiez à l'écran que c'est exact. La section « O que nenhum teste automático cobre » (ce qu'aucun test automatique ne couvre) liste ce qui a le plus besoin d'un regard humain.

**Échelle de gravité (Nielsen) :**

| Note | Signification |
|---|---|
| 0 | Ce n'est pas un problème d'utilisabilité |
| 1 | Cosmétique : à corriger s'il reste du temps |
| 2 | Mineur : basse priorité |
| 3 | Majeur : important à corriger |
| 4 | Catastrophe : à corriger avant la livraison |

## Comment consigner

Une ligne par problème, dans un tableur partagé de l'équipe :

| Écran (#) | Heuristique ou critère WCAG | Ce qui s'est passé | Gravité | Suggestion | Trouvé par |
|---|---|---|---|---|---|
| 8 | Nielsen 9 | Exemple : à l'envoi d'un questionnaire incomplet, il n'était pas clair combien d'items manquaient | 3 | Afficher le nombre en haut | Nom |

Notez ce qui s'est passé, pas la solution. Si vous n'êtes pas sûr qu'il s'agisse d'un problème, notez-le quand même, avec la gravité 1.

## Ce qui a déjà été testé automatiquement

Inutile d'y consacrer du temps :

- vérifier si chaque écran passe axe-core ;
- vérifier qu'aucun écran ne défile horizontalement à 320 px ;
- vérifier que le parcours entier fonctionne au clavier seul.

Les tests de bout en bout le font déjà sur tous les écrans, sur ordinateur et sur téléphone. Les calculs de l'UEQ sont aussi testés. La vérification par rapport au tableur officiel est elle aussi automatique : 11 scénarios dans `data/fixtures/` avec les chiffres de l'UEQ Data Analysis Tool (`data/fixtures/LEIA-ME.md`).

Ce qui vous reste, c'est ce que seule une personne peut évaluer :

- si l'écran se comprend ;
- si le texte est clair ;
- si le lecteur d'écran sonne bien ;
- si le pouce atteint le bon cercle ;
- si le tableau de bord mène à la bonne conclusion.

## Points d'attention

- **Tableau de bord (écrans 13 et 14) :** quelqu'un qui ne connaît pas l'UEQ parvient-il à tirer la bonne conclusion ?
- **Questionnaire sur téléphone (écrans 8 et 9) :** répondez debout, d'une seule main.
- **Langues (écran 20) :** si quelqu'un de l'équipe parle une autre langue que le portugais, qu'il révise les textes de cette langue. Les traductions des écrans du participant ont été faites par l'équipe, et celles de l'outil par l'API de Claude (`docs/idiomas.md`).
- **Visite guidée (écran 3b) :** quelqu'un qui n'a jamais vu l'outil parvient-il à la suivre ?
- **Politique de confidentialité (écran 3a) :** un participant comprend-il ce qui arrive à ses réponses ?
- **Écrans sans prototype (18 à 20) :** ce sont les moins vus jusqu'ici.
