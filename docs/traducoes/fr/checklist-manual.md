# Liste de contrôle manuelle d'utilisabilité et d'accessibilité

Ce que l'automatisation n'atteint pas, à vérifier de ses propres mains avant chaque livraison. Chaque bloc correspond aux [cas de test manuels](documentacao/casos-de-teste.md#casos-manuais). À chaque tour, cochez l'élément dans une copie de cette liste, notez le problème et qui le corrige.

## Lecteur d'écran
NVDA + Firefox sous Windows, VoiceOver + Safari sur iPhone (ou TalkBack + Chrome sous Android).

- [ ] Questionnaire complet, du début à la fin, uniquement à l'oreille, sans regarder l'écran
- [ ] À l'entrée dans un item, le lecteur annonce le numéro de l'item, les deux termes et la position
- [ ] La progression est annoncée sans interrompre à chaque clic
- [ ] À l'envoi d'un questionnaire incomplet, le lecteur annonce le résumé des erreurs et l'on peut aller jusqu'à l'item manquant
- [ ] Dans le tableau de bord, le graphique est annoncé avec sa description et le tableau est navigable cellule par cellule, avec l'en-tête lu
- [ ] Les messages de réussite (« Collecte ouverte ») sont annoncés, ainsi que le texte « Création de l'étude… » du bouton
- [ ] Les fenêtres (Se connecter, Créer un compte, Déconnexion, suppression, Partager, aide) annoncent le titre à l'ouverture, retiennent le focus et le rendent à l'élément qui les a ouvertes
- [ ] Le nombre d'avis de la cloche est annoncé, et l'on peut accepter une invitation uniquement à l'oreille
- [ ] La visite guidée se comprend uniquement à l'oreille, et l'on peut la passer
- [ ] Dans la politique de confidentialité, le « Retour » dit où il mène, et le lien des fenêtres d'accès signale qu'il s'ouvre dans un nouvel onglet. Dans Chrome, Firefox et Safari réels, « Fermer cet onglet et revenir » ferme l'onglet et rend la fenêtre d'inscription avec ce qui a été saisi

## Clavier
- [ ] Créer une étude, ouvrir la collecte, répondre au questionnaire, voir les résultats et exporter sans toucher à la souris
- [ ] Focus toujours visible et jamais caché derrière le pied de page fixe
- [ ] L'ordre du focus est cohérent sur tous les écrans
- [ ] La visite guidée, la cloche, l'aide (?) et Partager fonctionnent sans souris ; Échap ferme les fenêtres
- [ ] Dans la documentation, l'index, la section, Retour, Précédent et Suivant fonctionnent sans souris, et le diagramme apparaît sans défilement

## Vision
- [ ] Zoom à 200 % et à 400 % dans le navigateur : rien n'est coupé, rien ne se chevauche
- [ ] Largeur de 320 px : pas de défilement horizontal
- [ ] Simulation du daltonisme (Chrome DevTools > Rendering > Emulate vision deficiencies) : protanopie, deutéranopie, tritanopie, achromatopsie. Le graphique reste lisible
- [ ] Contraste élevé de Windows : cercles du questionnaire et focus visibles
- [ ] Le bookmarklet d'espacement du texte (WCAG 1.4.12) ne casse pas la mise en page

## Téléphone réel
- [ ] Ouvrir le lien par WhatsApp et tout répondre avec le pouce, debout
- [ ] Aucun toucher accidentel sur le cercle voisin
- [ ] Le clavier virtuel ne couvre pas le champ ayant le focus dans les données démographiques
- [ ] Lien du participant ouvert dans une étude dans une autre langue, et dans une langue écrite de droite à gauche (arabe, hébreu ou persan)
- [ ] Politique de confidentialité ouverte depuis le formulaire de consentement, sur téléphone, et le « Retour » ramène au formulaire

## Évaluation heuristique (chacun seul, puis consolidation)
Pour chaque problème : écran, heuristique violée (Nielsen 1 à 10), gravité (0 à 4), suggestion.

## Test avec des utilisateurs
- [ ] 5 participants répondant à une étude réelle, en pensant à voix haute
- [ ] 2 à 3 chercheurs réalisant : créer une étude avec 2 versions, ouvrir la collecte, interpréter le tableau de bord, supprimer une réponse suspecte, exporter vers le tableur officiel
- [ ] Consigner le succès, le temps, les erreurs et les commentaires
- [ ] Les chercheurs répondent à l'UEQ sur l'outil, par l'outil lui-même
