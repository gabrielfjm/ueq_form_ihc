# Fondements de l'IHM appliqués à l'outil

Ce fichier transforme la littérature sur l'IHM en exigences vérifiables. Toute décision d'interface doit pouvoir être rattachée à un principe présenté ici. La personne qui met en œuvre un écran consulte la section « Exigences par écran » et la « Liste de contrôle WCAG » avant de considérer la tâche comme terminée. Le lien entre chaque décision, le code et les tests se trouve dans les [décisions d'interface](rastreabilidade-ihc.md).

Objectif de conformité : **WCAG 2.2 niveau AA** (W3C, 2023), qui est aussi la base de la norme **ABNT NBR 17225:2025** (accessibilité des contenus et des applications web). La loi brésilienne d'inclusion (Lei Brasileira de Inclusão, loi 13.146/2015, art. 63) rend l'accessibilité des sites obligatoire au Brésil.

## 1. Base théorique utilisée

| Référence | Ce que nous en retenons |
|---|---|
| ISO 9241-11:2018 | Définition de l'utilisabilité : efficacité, efficience et satisfaction pour des utilisateurs spécifiques, avec des objectifs spécifiques, dans un contexte d'utilisation spécifique. C'est pourquoi la section 2 définit les utilisateurs et les contextes avant tout écran |
| ISO 9241-110:2020 | 7 principes d'interaction : aptitude à la tâche, autodescriptivité, conformité aux attentes de l'utilisateur, apprentissabilité, contrôlabilité, robustesse face aux erreurs d'utilisation, engagement de l'utilisateur |
| Nielsen (1994), 10 heuristiques | Liste de contrôle de l'évaluation heuristique réalisée par l'équipe |
| Shneiderman et al., 8 règles d'or | Viser la cohérence, viser l'utilisabilité universelle, offrir un retour d'information informatif, concevoir des dialogues qui conduisent à une clôture, prévenir les erreurs, permettre l'annulation facile des actions, laisser l'utilisateur maître de la situation, réduire la charge de la mémoire à court terme |
| Norman (2013) | Affordances et signifiants, correspondance naturelle, retour d'information, contraintes, modèle conceptuel |
| Loi de Fitts | Les cibles importantes sont grandes et proches de l'endroit où le regard et le curseur se trouvent déjà |
| Loi de Hick-Hyman | Peu d'options par décision. Une seule action principale par écran |
| Gestalt (proximité, similarité, région commune) | Regroupement visuel des échelles de l'UEQ par construit, étiquette proche du champ |
| WCAG 2.2 / NBR 17225 / eMAG | Exigences d'accessibilité testables (section 5) |
| Laugwitz, Held et Schrepp (2008) et UEQ Handbook | Format du différentiel sémantique, consigne officielle, ordre fixe des items |

## 2. Utilisateurs et contexte d'utilisation (ISO 9241-11)

**Participant**
- Toute personne adulte. Elle peut avoir une faible aisance numérique, une basse vision, un daltonisme, utiliser un lecteur d'écran (NVDA, VoiceOver, TalkBack), naviguer uniquement au clavier, utiliser un zoom de 200 % ou plus
- Elle accède souvent à l'outil depuis un téléphone mobile (lien reçu par WhatsApp ou par e-mail)
- Elle n'a pas de compte et n'a pas de motivation intrinsèque : toute friction devient un abandon
- Objectif : répondre rapidement (3 à 5 minutes) et partir
- Mesure de réussite : taux d'achèvement élevé, aucun item oublié, durée proche de celle prévue par le manuel

**Chercheur**
- Étudiant de troisième cycle ou chercheur, connaît l'UX mais pas nécessairement la statistique en profondeur. Peut travailler en équipe et lire l'outil dans l'une des 37 langues
- Utilise un ordinateur de bureau, en sessions courtes et répétées (ouvre le tableau de bord plusieurs fois pendant la collecte)
- Objectif : monter l'étude sans erreur, suivre la collecte, comprendre le résultat et l'exporter pour le rapport
- Mesure de réussite : crée une étude complète sans aide, interprète correctement le tableau de bord, vérifie les chiffres avec le tableur officiel

## 3. Le questionnaire comme instrument de mesure

C'est ici que l'IHM rencontre la méthodologie de recherche. Tout biais d'interface contamine la donnée.

1. **Aucune option présélectionnée.** Une valeur par défaut crée un effet d'ancrage et des réponses non intentionnelles
2. **Les 7 positions ont un poids visuel identique.** Même taille, même couleur, même espacement. Pas de couleur dégradée (rouge → vert), pas de numéro, pas d'étiquette intermédiaire, pas de position centrale mise en évidence. Cela préserve le format validé du différentiel sémantique
3. **Ordre et polarité officiels, toujours.** L'alternance des pôles est voulue dans l'UEQ afin de réduire l'acquiescement. L'interface ne « range » jamais les pôles
4. **Consigne officielle de l'UEQ** en haut, dans le langage du pack de langue
5. **Mise en page identique pour les 26 items.** Un changement de mise en page entre les items change la réponse
6. **Le participant ne voit jamais les résultats** ni la moyenne des autres participants
7. **Renoncer est facile et explicite** (éthique de la recherche avec des êtres humains). Le lien « Quitter sans envoyer » est toujours disponible, avec une confirmation dans une fenêtre, et rien n'est enregistré dans Resposta (Réponse) avant l'envoi
8. **Véritable anonymat.** Ne pas collecter l'adresse IP, le nom ni l'e-mail. Données démographiques uniquement par tranches, toujours avec « Je préfère ne pas répondre », et l'étape entière n'existe que si le chercheur active la collecte dans l'étude

## 4. Exigences par écran, avec le principe qui les justifie

Format : exigence → principe (source).

### 4.1 Questionnaire du participant

| Exigence | Principe |
|---|---|
| Chaque item est un `<fieldset>` avec un `<legend>` contenant les deux termes (« Item 4 sur 26 : facile à apprendre ou difficile à apprendre »). Les 7 options sont des `<input type="radio">` natifs stylisés, et non des `div` avec onClick | Nom, rôle et valeur (WCAG 4.1.2), information et relations (1.3.1), signifiants (Norman) |
| Chaque bouton radio a un nom accessible avec la position et le pôle le plus proche (« 3 sur 7, plus proche de facile à apprendre »). Position 4 : « 4 sur 7, centre » | Étiquettes ou instructions (3.3.2), autodescriptivité (ISO 9241-110) |
| Zone cliquable de chaque cercle ≥ 44×44 px, même si le cercle dessiné est plus petit. Distance entre les cibles qui évite de toucher la voisine | Taille de la cible (WCAG 2.5.8 demande 24 px, nous utilisons les 44 px de l'Apple HIG et du WCAG AAA 2.5.5), loi de Fitts |
| Termes cliquables également : cliquer sur le terme de gauche ne coche rien (évite une réponse accidentelle), mais les termes restent près des extrémités | Correspondance naturelle (Norman), prévention des erreurs (Nielsen 5) |
| Cocher une option ne déplace pas le focus et ne fait pas défiler la page toute seule | Lors de la saisie (WCAG 3.2.2), laisser l'utilisateur maître de la situation (Shneiderman 7) |
| Clavier : Tab entre dans le groupe, les flèches changent l'option (comportement natif du bouton radio), Tab sort vers l'item suivant. Aucun raccourci à touche unique qui entre en conflit avec le lecteur d'écran | Clavier (2.1.1), pas de piège au clavier (2.1.2), conformité aux attentes de l'utilisateur (ISO 9241-110) |
| Progression « 14 sur 26 répondus » mise à jour à chaque sélection et annoncée avec `aria-live="polite"` seulement tous les 5 items et à la fin (pour ne pas encombrer le lecteur d'écran) | Visibilité de l'état du système (Nielsen 1), messages d'état (4.1.3) |
| Le pied de page fixe de progression ne recouvre jamais l'item ayant le focus : `scroll-padding-bottom` égal à la hauteur du pied de page | Focus non masqué (WCAG 2.4.11) |
| Validation seulement à l'envoi, pas à chaque item. Erreur : résumé en haut avec un lien vers chaque item manquant (« Il reste 2 éléments : 7 et 19 »), le focus va au résumé, chaque item manquant reçoit une bordure et le texte « Cet élément n'a pas de réponse » (pas seulement la couleur) | Identification des erreurs (3.3.1), suggestion après une erreur (3.3.3), utilisation de la couleur (1.4.1), Nielsen 9 |
| Réponses enregistrées dans le sessionStorage pendant que la personne répond | Robustesse face aux erreurs d'utilisation (ISO 9241-110), Shneiderman 6 |
| Pas de limite de temps | Délai réglable (2.2.1) |
| À 320 px de largeur et avec un zoom de 400 %, rien n'est coupé ni n'exige de défilement horizontal. Sur mobile, les termes passent au-dessus des cercles | Redistribution du contenu (1.4.10), redimensionnement du texte (1.4.4) |
| Page avec le `lang` et le `dir` de la langue choisie, `<title>` par étape (« Consentement · Étude X », « Questionnaire · Étude X ») | Langue de la page (3.1.1), titre de page (2.4.2) |
| Une seule action principale par page (J'accepte / Envoyer les réponses) | Loi de Hick, design esthétique et minimaliste (Nielsen 8) |
| Le formulaire de consentement contient un lien vers la politique de confidentialité, sur une page à l'intérieur du lien du participant, sans chemin vers le reste de l'outil. Le questionnaire lui-même n'a pas ce lien, pour ne rien ajouter à l'instrument | Transparence (LGPD, art. 9), éthique de la recherche, §3 |
| Étapes claires : Consentement → Questionnaire → Données facultatives → Fin, avec une indication textuelle de l'étape en cours | Dialogues avec clôture (Shneiderman 4) |
| Le formulaire indique la durée et l'absence de limite, comment renoncer, ce qui se passe après l'envoi, combien de temps les données sont conservées, les risques, les bénéfices et qui est responsable de la recherche. Le questionnaire répète la durée au-dessus de la consigne | Visibilité de l'état du système (Nielsen 1), LGPD art. 9 |
| Les personnes de moins de 18 ans ne participent qu'en confirmant l'autorisation de leur représentant légal | LGPD art. 14 |

### 4.2 Écrans du chercheur

| Exigence | Principe |
|---|---|
| Lien « Aller au contenu » comme premier élément pouvant recevoir le focus | Contourner des blocs (2.4.1) |
| Une vraie hiérarchie de titres (un `h1` par page, un `h2` par section) | En-têtes et étiquettes (2.4.6), 1.3.1 |
| Formulaires : étiquette visible au-dessus du champ, reliée par `for`/`id`, `autocomplete` correct (`email`, `current-password`, `new-password`, `name`) | 1.3.5, 3.3.2 |
| La connexion accepte le collage du mot de passe et les gestionnaires de mots de passe. Bouton « Afficher le mot de passe » | Authentification accessible (3.3.8) |
| À la création d'une étude, ne pas redemander ce qui a déjà été dit (le nom du produit devient une suggestion de nom de la première version) | Saisie redondante (3.3.7) |
| Supprimer une étude : confirmation en saisissant le titre, en indiquant combien de réponses seront perdues. Clôturer la collecte est réversible (Rouvrir) | Prévention des erreurs (Nielsen 5, WCAG 3.3.4), annulation facile (Shneiderman 6) |
| Se déconnecter et toute suppression se confirment dans une fenêtre (`<dialog>` natif) qui dit ce qui va se passer, avec Annuler à côté. Focus piégé à l'intérieur, Échap ferme sans rien faire et le focus revient à l'élément qui l'a ouverte | Prévention des erreurs (Nielsen 5), contrôle et liberté de l'utilisateur (Nielsen 3), 2.1.2, 2.4.3, 3.3.4 |
| Se connecter et Créer un compte s'ouvrent dans une fenêtre au-dessus de la page actuelle, sans perdre sa place, et tiennent à l'écran sans défilement | Contrôle et liberté de l'utilisateur (Nielsen 3), charge de la mémoire (Shneiderman 8), 1.4.10 |
| Toute action donne un retour visible et annoncé : « Collecte ouverte. Le lien accepte déjà les réponses. » dans une région `role="status"`, qui suit le défilement et reste jusqu'à ce que la personne la ferme | Retour d'information (Norman, Shneiderman 3), 4.1.3, 2.2.1 |
| Pendant que l'action s'exécute, le bouton dit ce qui se passe et bloque les nouveaux clics, pour que rien ne soit envoyé deux fois | Visibilité de l'état du système (Nielsen 1), prévention des erreurs (Nielsen 5), 4.1.3 |
| Statut de l'étude écrit, toujours au même endroit, avec la conséquence (« Ouvert · accepte les réponses ») | Visibilité de l'état du système (Nielsen 1) |
| Termes de l'UEQ avec leur nom officiel et une courte explication accessible par `<details>` (« Qu'est-ce que la Clarté ? ») | Correspondance entre le système et le monde réel (Nielsen 2), aide et documentation (Nielsen 10), divulgation progressive |
| Le même modèle de bouton, de tableau et de message sur tous les écrans | Cohérence et standards (Nielsen 4, Shneiderman 1) |
| Aucune information ne dépend du survol. S'il y a une infobulle, elle s'ouvre aussi au focus, peut être fermée avec Échap et ne disparaît pas quand la souris passe dessus | Contenu au survol ou au focus (1.4.13), reconnaissance plutôt que rappel (Nielsen 6) |

| Aide (?) sur chaque page du chercheur : à quoi sert la page et ce qu'il est possible d'y faire | Aide et documentation (Nielsen 10), autodescriptivité (ISO 9241-110) |
| Visite à la première connexion, réalisée sur les écrans réels, qui peut être ignorée, fermée et revue | Apprentissabilité (ISO 9241-110), contrôle et liberté de l'utilisateur (Nielsen 3), Nielsen 10 |
| Cloche avec les notifications non lues en nombre et en texte, regroupant les réponses tant que l'avis n'est pas lu. L'avis peut aussi être envoyé par e-mail, et cela se désactive dans Mon compte | Visibilité de l'état du système (Nielsen 1), charge de la mémoire (Shneiderman 8), laisser l'utilisateur maître de la situation (Shneiderman 7) |
| Partager indique ce que chaque rôle peut faire (Éditeur, Lecteur) avant l'invitation. Qui ne peut pas effectuer une action ne voit pas son bouton | Prévention des erreurs (Nielsen 5), design esthétique et minimaliste (Nielsen 8) |
| Administration et Mon compte sous forme de panneaux : chaque option indique la situation actuelle et mène à une page dédiée | Reconnaissance plutôt que rappel (Nielsen 6), loi de Hick, divulgation progressive |
| Politique de confidentialité à un clic : dans les fenêtres d'accès, sur la page d'accueil, dans Mon compte et dans l'aide. Le « Retour » dit où il mène et la politique s'ouvre dans un autre onglet quand un formulaire est rempli | Contrôle et liberté de l'utilisateur (Nielsen 3), Shneiderman 7, transparence (LGPD, art. 9) |
| Interface dans la langue du compte, choisie à la création du compte et modifiée dans Mon compte. `lang` et `dir` suivent la langue dans laquelle l'écran s'affiche réellement | Utilisabilité universelle (Shneiderman 2), 3.1.1 |

La documentation suit le même principe de charge : un long document s'ouvre comme un sommaire, chaque section dans sa propre page avec Retour et Précédent/Suivant, et le diagramme tenant à l'écran (divulgation progressive, Nielsen 3 et 8, WCAG 2.4.5 et 2.4.8).

### 4.3 Tableau de bord des résultats et graphiques

| Exigence | Principe |
|---|---|
| Tout graphique a `role="img"`, `<title>` et `<desc>` avec la lecture en texte (« Attractivité : moyenne 1,42, IC de 1,10 à 1,74, tranche Bon ») et un tableau équivalent visible juste en dessous | Contenu non textuel (1.1.1), 1.3.1 |
| Échelles distinguées par la forme et la position, pas seulement par la couleur. Versions dans la comparaison : cercle plein, cercle évidé, carré, en plus de la couleur | Utilisation de la couleur (1.4.1), testé avec une simulation de daltonisme |
| Marqueurs et lignes du graphique avec un contraste ≥ 3:1 par rapport au fond et aux tranches de la référence | Contraste des éléments non textuels (1.4.11) |
| Tranches de la référence avec une étiquette en texte, pas seulement une teinte de fond | 1.4.1 |
| Échelles regroupées en Attractivité / Pragmatique / Hédonique avec un espace et une étiquette de groupe | Gestalt (proximité, région commune), modèle conceptuel de l'UEQ |
| L'interprétation est écrite à côté du chiffre (« positive », « Bon dans la référence »). Le chercheur n'a pas besoin de se souvenir des seuils | Reconnaissance plutôt que rappel (Nielsen 6), Shneiderman 8 |
| Les alertes d'alpha faible et de petit échantillon expliquent ce que cela signifie et ce qu'il faut faire | Nielsen 9 et 10 |
| Filtres et mode de comparaison reflétés dans l'URL (on peut revenir en arrière, recharger et partager) | Contrôle et liberté de l'utilisateur (Nielsen 3) |
| Exclure des réponses de l'analyse est annulable et le tableau de bord indique combien sont exclues | Shneiderman 6, Nielsen 1 |
| Données démographiques dans un sous-onglet propre de Résultats, chaque question avec le graphique qui lui convient, et le tableau de chiffres sous « Voir les chiffres » | Gestalt, 1.1.1, divulgation progressive |

### 4.4 Exportation
- Chaque lien d'exportation indique le format, le contenu et à quoi il sert. Le téléchargement ne s'ouvre pas dans un nouvel onglet sans avertir
- Nom de fichier lisible et daté

## 5. Liste de contrôle WCAG 2.2 AA (critères les plus pertinents ici)

Le tableau indique comment l'outil satisfait chaque critère et ce qui le prouve. axe-core s'exécute sur chaque écran et dans chaque état d'erreur des tests de bout en bout ; ce qu'il ne couvre pas se trouve dans les cas manuels ([liste de contrôle manuelle](checklist-manual.md)).

### Perceptible

| Critère | Comment l'outil le satisfait | Preuve |
|---|---|---|
| 1.1.1 Graphiques et icônes avec alternative textuelle | Tout graphique a une description et un tableau visible avec les mêmes chiffres ; les icônes décoratives sont exclues de l'arbre d'accessibilité | [CT-E29](documentacao/casos-de-teste.md#ct-e29), [CT-M05](documentacao/casos-de-teste.md#ct-m05) |
| 1.3.1 Structure sémantique | Chaque item du questionnaire est un `fieldset` avec un `legend` ; tableaux avec `th` et `scope` ; titres dans l'ordre | [CT-E24](documentacao/casos-de-teste.md#ct-e24), [CT-E21](documentacao/casos-de-teste.md#ct-e21) et axe-core sur chaque écran |
| 1.3.2 Ordre de lecture identique à l'ordre visuel | Le DOM suit l'ordre de l'écran, y compris de droite à gauche | [CT-E22](documentacao/casos-de-teste.md#ct-e22), [CT-E46](documentacao/casos-de-teste.md#ct-e46), [CT-M07](documentacao/casos-de-teste.md#ct-m07) |
| 1.3.5 `autocomplete` sur les données personnelles | Le nom, l'e-mail et le mot de passe ont `autocomplete` dans Créer un compte, Se connecter, Mon compte et dans le formulaire de l'étude | axe-core dans [CT-E06](documentacao/casos-de-teste.md#ct-e06), [CT-E09](documentacao/casos-de-teste.md#ct-e09) |
| 1.4.1 Rien n'est communiqué par la seule couleur | Statuts, tranches et versions ont du texte, une forme ou un motif en plus de la couleur | [CT-E32](documentacao/casos-de-teste.md#ct-e32), [CT-M09](documentacao/casos-de-teste.md#ct-m09) |
| 1.4.3 Contraste du texte ≥ 4,5:1 | Chaque paire de couleurs de texte du thème est mesurée | [CT-U51](documentacao/casos-de-teste.md#ct-u51) |
| 1.4.4 Zoom de 200 % sans perte | Les écrans utilisent des unités relatives et se réorganisent | [CT-M08](documentacao/casos-de-teste.md#ct-m08) |
| 1.4.10 Redistribution du contenu à 320 px | Aucun écran ne défile horizontalement à 320 px | [CT-E25](documentacao/casos-de-teste.md#ct-e25), [CT-E31](documentacao/casos-de-teste.md#ct-e31), [CT-E36](documentacao/casos-de-teste.md#ct-e36), [CT-E44](documentacao/casos-de-teste.md#ct-e44), [CT-E50](documentacao/casos-de-teste.md#ct-e50), [CT-E75](documentacao/casos-de-teste.md#ct-e75) |
| 1.4.11 Contraste des éléments ≥ 3:1 | Les bordures de champ, les cercles, le focus et les marqueurs de graphique sont mesurés par rapport aux fonds | [CT-U52](documentacao/casos-de-teste.md#ct-u52) |
| 1.4.12 Espacement du texte | La mise en page supporte line-height 1,5 et letter-spacing 0,12em | [CT-M11](documentacao/casos-de-teste.md#ct-m11) |
| 1.4.13 Contenu au survol ou au focus | Les explications des termes s'ouvrent par clic (`details`), pas au survol | [CT-M07](documentacao/casos-de-teste.md#ct-m07) |

### Utilisable

| Critère | Comment l'outil le satisfait | Preuve |
|---|---|---|
| 2.1.1 et 2.1.2 Clavier, pas de piège au clavier | Tout le parcours fonctionne au clavier seul ; les fenêtres piègent le focus et le rendent à la fermeture | [CT-E03](documentacao/casos-de-teste.md#ct-e03), [CT-E22](documentacao/casos-de-teste.md#ct-e22), [CT-E55](documentacao/casos-de-teste.md#ct-e55), [CT-E58](documentacao/casos-de-teste.md#ct-e58), [CT-E64](documentacao/casos-de-teste.md#ct-e64), [CT-M07](documentacao/casos-de-teste.md#ct-m07) |
| 2.2.1 Pas de limite de temps | Aucun écran n'est chronométré ; le questionnaire conserve ce qui a été coché si la page se recharge | [CT-E26](documentacao/casos-de-teste.md#ct-e26) |
| 2.4.1 Contourner des blocs | « Aller au contenu » est le premier élément pouvant recevoir le focus | [CT-E02](documentacao/casos-de-teste.md#ct-e02) |
| 2.4.2 Titre de page | Chaque page a son propre titre, du particulier au général | [CT-E47](documentacao/casos-de-teste.md#ct-e47), [CT-E84](documentacao/casos-de-teste.md#ct-e84) |
| 2.4.3 Parcours du focus | Après une erreur, le focus va au résumé, et chaque lien du résumé mène au champ | [CT-E07](documentacao/casos-de-teste.md#ct-e07), [CT-E23](documentacao/casos-de-teste.md#ct-e23) |
| 2.4.6 En-têtes et étiquettes descriptifs | Les étiquettes disent ce qu'elles demandent ; les titres disent ce que la section contient | axe-core sur chaque écran et [CT-M13](documentacao/casos-de-teste.md#ct-m13) |
| 2.4.7 Focus visible | Anneau de focus avec un contraste de 3:1 sur chaque élément | [CT-E22](documentacao/casos-de-teste.md#ct-e22), [CT-U52](documentacao/casos-de-teste.md#ct-u52) |
| 2.4.11 Focus non masqué | La barre supérieure et le pied de page fixes ne cachent jamais le focus ni les ancres | [CT-E54](documentacao/casos-de-teste.md#ct-e54) |
| 2.5.3 Étiquette dans le nom | Le nom accessible de chaque bouton commence par le texte qui y est affiché | axe-core sur chaque écran |
| 2.5.8 Cibles ≥ 24 × 24 px | Chaque cercle du questionnaire mesure 44 × 44 px | [CT-M12](documentacao/casos-de-teste.md#ct-m12) |

### Compréhensible

| Critère | Comment l'outil le satisfait | Preuve |
|---|---|---|
| 3.1.1 Langue de la page | `lang` et `dir` suivent la langue choisie, y compris dans les textes de l'étude sans traduction | [CT-E45](documentacao/casos-de-teste.md#ct-e45), [CT-E46](documentacao/casos-de-teste.md#ct-e46), [CT-U48](documentacao/casos-de-teste.md#ct-u48) |
| 3.2.1 et 3.2.2 Pas de changement de contexte spontané | Changer la langue ne prend effet qu'après « Appliquer » ; aucun champ n'envoie au changement | [CT-E46](documentacao/casos-de-teste.md#ct-e46), [CT-E68](documentacao/casos-de-teste.md#ct-e68) |
| 3.2.3 et 3.2.4 Navigation cohérente | La même barre et les mêmes composants sur tous les écrans | [CT-E53](documentacao/casos-de-teste.md#ct-e53), [CT-M18](documentacao/casos-de-teste.md#ct-m18) |
| 3.3.1 et 3.3.3 Erreur en texte, avec suggestion | Chaque erreur dit ce qui s'est passé et ce qu'il faut faire, dans le résumé et dans le champ | [CT-E06](documentacao/casos-de-teste.md#ct-e06), [CT-E14](documentacao/casos-de-teste.md#ct-e14), [CT-E23](documentacao/casos-de-teste.md#ct-e23), [CT-E43](documentacao/casos-de-teste.md#ct-e43) |
| 3.3.2 Étiquettes visibles | Tout champ a une étiquette visible au-dessus | axe-core sur chaque écran |
| 3.3.4 Actions destructrices confirmées ou réversibles | Se déconnecter et supprimer demandent une confirmation ; retirer de l'analyse est réversible | [CT-E11](documentacao/casos-de-teste.md#ct-e11), [CT-E19](documentacao/casos-de-teste.md#ct-e19), [CT-E27](documentacao/casos-de-teste.md#ct-e27), [CT-E34](documentacao/casos-de-teste.md#ct-e34) |
| 3.3.7 Ne pas demander deux fois la même information | La nouvelle étude arrive avec le responsable du compte et de la dernière étude | [CT-E93](documentacao/casos-de-teste.md#ct-e93) |
| 3.3.8 Connexion sans test cognitif | Pas de captcha ; le collage du mot de passe fonctionne et Afficher le mot de passe bascule la visibilité | [CT-E08](documentacao/casos-de-teste.md#ct-e08) |

### Robuste

| Critère | Comment l'outil le satisfait | Preuve |
|---|---|---|
| 4.1.2 Composants natifs | Boutons radio, boutons, `details` et `dialog` natifs ; ARIA seulement là où le HTML ne suffit pas | [CT-E24](documentacao/casos-de-teste.md#ct-e24), [CT-E57](documentacao/casos-de-teste.md#ct-e57) |
| 4.1.3 Messages d'état | Confirmations dans `role="status"`, annoncées sans déplacer le focus | [CT-E09](documentacao/casos-de-teste.md#ct-e09), [CT-E16](documentacao/casos-de-teste.md#ct-e16), [CT-M06](documentacao/casos-de-teste.md#ct-m06) |

### Au-delà du AA

| Critère | Comment l'outil le satisfait | Preuve |
|---|---|---|
| `prefers-reduced-motion` | Les transitions disparaissent quand le système demande moins de mouvement | `src/app/globals.css` |
| `forced-colors` (contraste élevé de Windows) | Les cercles, le focus et les graphiques restent visibles | [CT-E32](documentacao/casos-de-teste.md#ct-e32), [CT-M10](documentacao/casos-de-teste.md#ct-m10) |
| Thème sombre | Il n'y en a pas : l'identité visuelle est celle d'un instrument de laboratoire, sur fond clair ([Identité visuelle](design.md)) | — |
| Langage simple dans le questionnaire | Phrases courtes, voix active, sans jargon | [CT-M13](documentacao/casos-de-teste.md#ct-m13), [CT-M14](documentacao/casos-de-teste.md#ct-m14) |

## 6. Comment vérifier (l'automatisation ne suffit pas)

Les outils automatiques ne détectent qu'une partie des problèmes d'accessibilité. C'est pourquoi :

1. **Automatique :** axe-core dans Playwright sur tous les écrans et états d'erreur, test de contraste des jetons, tests e2e au clavier seul, à 320 px, avec daltonisme simulé et avec contraste élevé
2. **Manuel (équipe) :** `docs/checklist-manual.md`, avec lecteur d'écran, zoom, téléphone mobile réel et simulation de daltonisme
3. **Évaluation heuristique (équipe) :** les trois évaluent séparément avec les 10 heuristiques de Nielsen, puis consolident avec une gravité de 0 à 4
4. **Test avec des utilisateurs :** 5 participants extérieurs au trio répondent à une étude réelle dans l'outil (tâche du participant) et 2 à 3 collègues jouent le rôle de chercheur (créer une étude, interpréter le tableau de bord, exporter). Pensée à voix haute, taux de réussite, temps et erreurs. À la fin, les chercheurs évaluent l'outil lui-même **avec l'UEQ, administré par l'outil**. Cela boucle le cycle et donne la meilleure diapositive de la présentation

## 7. Références

- ABNT. NBR 17225:2025. Acessibilidade em conteúdo e aplicações web: requisitos (Accessibilité des contenus et des applications web : exigences). 2025.
- BRASIL. Lei nº 13.146, de 6 de julho de 2015 (Lei Brasileira de Inclusão, loi brésilienne d'inclusion). Art. 63.
- BRASIL. eMAG: Modelo de Acessibilidade em Governo Eletrônico (Modèle d'accessibilité pour le gouvernement électronique), version 3.1.
- BRASIL. Lei nº 13.709, de 14 de agosto de 2018 (Lei Geral de Proteção de Dados Pessoais, loi générale sur la protection des données personnelles).
- ISO 9241-11:2018. Ergonomics of human-system interaction: Usability: Definitions and concepts.
- ISO 9241-110:2020. Ergonomics of human-system interaction: Interaction principles.
- NIELSEN, J. Enhancing the explanatory power of usability heuristics. CHI 1994.
- NORMAN, D. The Design of Everyday Things. Revised and expanded edition. Basic Books, 2013.
- SHNEIDERMAN, B. et al. Designing the User Interface. 6th ed. Pearson, 2016.
- W3C. Web Content Accessibility Guidelines (WCAG) 2.2. 2023.
- LAUGWITZ, B.; HELD, T.; SCHREPP, M. Construction and evaluation of a user experience questionnaire. USAB 2008.
- SCHREPP, M. User Experience Questionnaire Handbook. ueq-online.org.
