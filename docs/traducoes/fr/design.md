# Identité visuelle

## L'idée

L'outil a l'allure d'un **instrument de laboratoire**, pas d'un SaaS. Pensez à un formulaire technique, à un rapport bien mis en page, à une règle de mesure. Fond blanc, encre sombre, traits fins, tableaux, nombres alignés. La seule « décoration » est l'instrument lui-même : la rangée de 7 marques du différentiel sémantique apparaît comme motif visuel (dans le logo, dans l'indicateur de progression, dans les états vides).

Test pour n'importe quel écran : **si une capture de cet écran pouvait venir de n'importe quel modèle de tableau de bord, refaites-le.**

## Interdit

C'est ce qui trahit immédiatement le « fait par une IA ». À ne jamais utiliser sur aucun écran :

- Les polices Inter, Geist, Poppins, Montserrat, Roboto ou la police système par défaut comme police principale
- Les dégradés de toute sorte, surtout violet/bleu/rose
- Le glassmorphism, `backdrop-filter: blur`, la brillance, le néon, l'ombre colorée
- Les ombres sur les cartes (`box-shadow` grande et diffuse). La séparation se fait par une ligne de 1px ou un changement de fond
- Un `border-radius` supérieur à 4px. Pas de pilule, pas de `rounded-2xl`
- Une grille de cartes avec icône + titre + nombre (« cartes KPI ») en ouverture du tableau de bord
- L'icône décorative : à côté d'un titre de section, dans les éléments de liste, dans un état vide. L'icône n'apparaît que dans les actions (voir « Icônes »)
- Le fond crème, les titres à empattements et l'accent terracotta : c'est devenu le visage des interfaces générées par IA (décision de l'équipe du 22/10/2026)
- La police à chasse fixe pour les nombres et les dates et les libellés en petites capitales ou en majuscules espacées : même raison. La seule exception est le bloc de code à l'intérieur d'un document de l'onglet Documentation (commandes, arborescence de dossiers), qui est du contenu et a besoin de colonnes alignées
- Les émojis dans l'interface, dans les messages, dans les toasts, dans les commits
- Le hero centré avec un titre énorme, un sous-titre gris et deux boutons
- Le texte en dégradé, le texte « brillant », l'animation d'entrée sur tout (fade-up dans une liste)
- Le skeleton avec shimmer. Le chargement est un texte simple (« Chargement des réponses… ») ou rien si c'est rapide
- Le mode sombre par défaut
- La palette feu tricolore (vert/jaune/rouge) pour les tranches du benchmark
- Le microcopy de startup : « Oops! », « Tudo pronto! 🎉 », « Vamos começar? », « Desbloqueie insights », « de forma simples e intuitiva », « potencialize » (en français : « Oups ! », « Tout est prêt ! 🎉 », « On commence ? », « Débloquez des insights », « de manière simple et intuitive », « boostez »)

## Couleurs

Définies dans `src/styles/tokens.css`. Aucune couleur hexadécimale isolée dans un composant.

```css
:root {
  --fundo:          #FFFFFF;  /* fundo geral, campos de formulário */
  --fundo-faixa:    #F3F5F7;  /* faixa de cabeçalho, áreas recuadas */
  --fundo-painel:   #F8FAFB;  /* ficha lateral, painel do gráfico */
  --tinta:          #0F1720;  /* texto principal, botões primários */
  --tinta-suave:    #46525E;  /* texto secundário */
  --tinta-fraca:    #5B6672;  /* legendas, rótulos de eixo. 5.4:1 na faixa */
  --linha:          #D5DBE1;  /* réguas e divisórias de tabela. NUNCA borda de campo */
  --borda-campo:    #7A8691;  /* borda de input, select, textarea. 3.4:1 na faixa (WCAG 1.4.11) */
  --linha-forte:    #0F1720;

  --destaque:       #0B6A78;  /* azul-petróleo. Foco, link, item ativo, numeração de seção. Usar pouco */
  --destaque-fundo: #E6F2F4;  /* hover de controles, mensagem de status */

  --alerta:         #B42318;  /* erro, ação destrutiva, alfa baixo, resposta suspeita. Sempre com texto */
  --alerta-fundo:   #FEF3F2;

  /* escalas UEQ, agrupadas pelo construto */
  --atratividade:   #0F1720;  /* impressão geral, na cor da tinta */
  --pragmatica:     #1D4E89;  /* perspicuidade, eficiência, confiabilidade */
  --hedonica:       #9A5B00;  /* estimulação, novidade. ≥ 3:1 inclusive sobre a faixa mais escura do benchmark */

  /* faixas de benchmark: cinza-azulado, do mais escuro (excelente) ao mais claro (ruim) */
  --bench-excelente: #C7D0D9;
  --bench-bom:       #D5DCE3;
  --bench-acima:     #E1E6EB;
  --bench-abaixo:    #EBEFF2;
  --bench-ruim:      #F4F6F8;
}
```

Contrastes vérifiés (WCAG 2.2) : encre 18:1, encre douce 8:1, encre faible 5,9:1, accent 6,3:1 et alerte 6,6:1 sur fond blanc. Sur les tranches du benchmark, le texte n'utilise que `--tinta` ou `--tinta-suave` (≥ 5,1:1). Un test automatisé (`src/styles/__tests__/contraste.test.ts`) recalcule ces paires à partir de tokens.css et échoue si l'une tombe sous le minimum.

L'accent et l'alerte ont des rôles séparés : le bleu pétrole indique où se trouve l'utilisateur et ce qui est cliquable ; le rouge indique un problème ou une action qui efface des données. Ne jamais échanger l'un pour l'autre.

Prise en charge aussi de `@media (forced-colors: active)` : les cercles, le focus et les marqueurs du graphique utilisent `CanvasText`/`Highlight` pour ne pas disparaître en contraste élevé de Windows.

Tout ce qui figure dans ce fichier est subordonné à `docs/ihc.md`. Si un choix esthétique entre en conflit avec l'accessibilité ou l'utilisabilité, celui de l'IHM l'emporte.

Le statut de l'étude est un texte en gras précédé d'un point de 10px, pas un badge coloré : point plein en `--destaque` pour ouverte, évidé en `--tinta-fraca` pour brouillon, plein en `--tinta` pour clôturée. Le texte dit toujours l'état ; le point ne fait que le renforcer.

## Typographie

Google Fonts via `next/font` :

- **Atkinson Hyperlegible Next** partout : titres (graisse 700), texte de l'interface et questionnaire (graisse 400). Elle a été dessinée par le Braille Institute pour la lisibilité, ce qui est en soi un argument d'IHM (à citer dans la présentation). Une seule famille renforce aussi la cohérence (Nielsen 4)
- **Source Sans 3** pour les nombres (tableaux, moyennes, IC, alpha, n, dates, comptages), via `var(--fonte-numero)`, avec `font-variant-numeric: tabular-nums` et alignés à droite dans les tableaux. L'Atkinson a un zéro barré et des chiffres tabulaires larges, qui donnent un air de code ; la Source Sans a des chiffres ordinaires et compacts. Pour que les nombres isolés au milieu du texte (« 60 anos ou mais ») sortent aussi en Source Sans, déclarer un `@font-face` avec `unicode-range: U+0030-0039` qui pointe vers elle avant l'Atkinson dans la pile de polices. Pas de police à chasse fixe dans l'interface

Échelle (rem) : 0.8125 · 0.9375 · 1.0625 · 1.25 · 1.625 · 2.25. Corps à 1.0625rem, interligne 1.5. Titres avec `letter-spacing: -0.015em`. Libellés de section et de groupe en gras, en plus petite taille et en `--tinta-suave`, en casse normale (ni petites capitales ni majuscules espacées).

## Mise en page

- Contenu aligné à gauche, largeur de lecture maximale ~72ch, panneaux de données jusqu'à 1120px
- Grille de 8px. Espace vertical généreux entre les sections (48 à 64px), serré dans les tableaux
- Navigation du chercheur : barre supérieure fine avec le nom de l'outil à gauche et des liens avec icône et texte : Études, Créer une étude, Documentation, Administration (seulement pour les administrateurs), Mon compte, la cloche de notifications, le sélecteur de langue et Se déconnecter. Pas de barre latérale. La personne qui ne s'est pas connectée (page d'accueil et documentation) voit la même barre avec seulement Documentation, le sélecteur de langue et Se connecter (`log-in`) ; Créer un compte (`user-plus`) se trouve sur la page d'accueil et dans la fenêtre Se connecter. Le lien du participant n'a aucune barre
- La barre reste fixe en haut pendant tout le défilement, sur ordinateur et sur mobile. Jusqu'à 56rem de largeur, les liens se trouvent derrière un bouton Menu (`menu`, et `x` quand il est ouvert, toujours avec le texte « Menu »), pour que la barre fixe n'occupe qu'une ligne ; le menu ouvre les liens en colonne juste en dessous et se ferme avec Échap ou en changeant de page. À 320 px, la rangée de marques du logo quitte la barre pour que le nom et le Menu tiennent
- Les tableaux sont des citoyens de première classe : en-tête en gras, lignes séparées par une règle de 1px, nombres alignés à droite
- Bouton principal : fond `--tinta`, texte `--fundo`, rayon 2px, hauteur 40px. Secondaire : bordure 1px `--tinta`, fond transparent. Action destructive : texte `--alerta` souligné, qui ouvre une fenêtre de confirmation (voir « Fenêtres »)
- Focus toujours visible : `outline: 2px solid var(--destaque); outline-offset: 2px`
- Bandeau d'en-tête en `--fundo-faixa` en haut des pages de l'étude, avec titre, statut, résumé et onglets
- Les écrans larges du chercheur utilisent deux colonnes (contenu + fiche latérale) au lieu d'une colonne étroite avec la droite vide
- Page d'accueil (`/`) : présente l'outil et est l'écran après la connexion. Texte aligné à gauche avec l'item du questionnaire et un aperçu du résultat comme figure, sommaire « Sur cette page » et sections numérotées : Qu'est-ce que l'UEQ, Comment lire les résultats, Comment ça marche, Études sur la méthode et Crédits. Pas de hero centré
- Panneaux d'options (Administration et Mon compte, prototypes r24 et r9) : une grille où chaque option mène à sa propre page ou ouvre une fenêtre, avec titre, description et situation sur une ligne, au lieu de tout empiler sur un seul écran. La carte entière répond au clic, mais reste une liste avec des titres pour le lecteur d'écran
- Documentation en pages (prototypes r36 à r38) : un document long s'ouvre comme un sommaire, « Dans ce document », avec le titre et la première phrase de chaque section, et la longue introduction reste repliée. Chaque section s'ouvre sur sa propre page : bandeau court avec Retour, le fil d'Ariane, le titre et « 7 sur 8 », une seule colonne, le diagramme mis en avant et tenant dans l'écran, et Précédente et Suivante à la fin. Une section avec 3 sous-sections ou plus devient un sommaire, sur deux colonnes quand elle dépasse 12 éléments. Un document de 4 000 caractères au plus reste entier
- Politique de confidentialité (`/privacidade`, prototype r33) : bandeau avec « Retour » en haut et l'encadré « En résumé » à côté ; en dessous, des sections numérotées en lignes de libellé et d'explication avec une règle entre elles, comme les conditions du consentement, et la fiche latérale fixe « Sur cette page ». Le « Retour » indique où il mène et apparaît aussi en bas de la page. Quand la politique s'est ouverte dans un autre onglet, depuis les fenêtres Se connecter et Créer un compte, il devient « Fermer cet onglet et revenir », pour ne pas perdre ce que la personne a saisi
- Politique dans le lien du participant (`/r/<slug>/privacidade`, prototype p9) : le même contenu, ouvert par un lien à la fin du formulaire de consentement, sans barre, sans icônes et sans lien vers le reste de l'outil. Le « Retour » mène au formulaire. Tant que le texte n'est pas traduit dans la langue de la personne, un encadré avertit, dans sa langue, que la politique apparaît en portugais

## Fenêtres

- Se connecter et Créer un compte s'ouvrent dans une fenêtre au-dessus de la page où se trouve la personne, avec le formulaire à gauche et le panneau de l'instrument à droite (les écrans r1 et r2 dans la fenêtre). Créer un compte et Se connecter échangent le formulaire dans la même fenêtre. `/entrar` et `/cadastrar` affichent la page d'accueil avec la fenêtre ouverte
- La fenêtre d'accès tient entièrement dans l'écran, sans défilement : les dimensions se réduisent avec la hauteur (portable de 768 px) et, jusqu'à 40rem de largeur, elle occupe tout l'écran, sans le panneau (qui revient, avec seulement le titre, quand l'écran est haut)
- Se déconnecter et toute suppression (étude, compte, version de l'étude) demandent une confirmation dans une fenêtre étroite : titre sous forme de question (« Supprimer cette étude ? »), ce qui va se passer, Annuler et le bouton de l'action. Pour les suppressions, l'avertissement est en `--alerta-fundo` avec une bordure `--alerta`, le champ de confirmation (titre ou adresse e-mail saisie) reste et le bouton est `--alerta`. Se déconnecter utilise le bouton principal, car rien n'est effacé. Sur mobile, les boutons sont en colonne, avec l'action en haut
- `<dialog>` natif avec `showModal()` : focus retenu à l'intérieur, page derrière inerte et sans défilement, Échap et le `x` (Fermer) ferment, et le focus revient à l'élément qui a ouvert. Fond de la page assombri avec `--tinta` à 62 %, bordure de 1px `--linha-forte`, rayon 2px. Sans ombre ni flou
- Focus initial : sur le premier champ (Se connecter, Créer un compte, suppressions) ou sur le bouton de l'action quand il n'y a pas de champ (Se déconnecter, Retirer la version)
- « Quitter sans envoyer », dans le questionnaire du participant, confirme aussi dans une fenêtre (prototype p8) : la question est le titre, « Continuer à répondre » est le bouton principal et reçoit le focus au départ, et Échap continue aussi. Sans icône et sans le `x`, comme tous les écrans du participant ; les textes viennent de la langue choisie
- Document en préparation (prototype r23) : tant que le fichier n'entre pas dans la liste `PRONTOS` de `src/lib/documentacao/catalogo.ts`, l'onglet Documentation affiche les mêmes onglets et sous-onglets, la rangée de marques vide, « En préparation » avec le point évidé du brouillon et la fiche avec ce que le document va apporter, sans fichier, téléchargements ni sommaire. La vue d'ensemble liste la situation de chaque document
- Icône du site (`src/app/icon.svg` et `apple-icon.tsx`) : trois marques du différentiel sémantique, la dernière remplie, en blanc sur `--destaque`
- Aide de la page (prototype r30) : bouton rond (?) dans l'en-tête de chaque page du chercheur, avec `aria-label`, qui ouvre la fenêtre moyenne. Elle explique à quoi sert la page et ce qu'on peut y faire, mène à la Politique de confidentialité et propose de revoir la visite guidée
- Partager (prototype r25) : fenêtre moyenne avec les personnes qui ont accès et l'invitation par e-mail, en choisissant Éditeur ou Lecteur

## Actions en cours et confirmations

- Toute action qui va au serveur utilise `BotaoEnvio` (prototype r39). Pendant qu'elle s'exécute, le bouton dit ce qui se passe (« Création de l'étude… »), avec l'indicateur qui tourne, reçoit `aria-busy` et `aria-disabled` et ignore les nouveaux clics, et le reste du formulaire cesse de répondre au clic. Rien n'est envoyé deux fois
- L'indicateur est la seule animation continue de l'outil et s'arrête avec `prefers-reduced-motion`. Sur les écrans du participant, il n'y a ni indicateur ni icône : seulement le texte « Veuillez patienter… », dans la langue de la personne
- Toute action terminée est confirmée à l'écran (prototype r40) : encadré en `--destaque-fundo` avec une bordure `--destaque`, en `role="status"`, de préférence en disant le résultat (« Étude créée avec succès. »). Il suit le défilement, juste sous la barre, et reste jusqu'à ce que la personne le ferme. L'erreur d'une action utilise `--alerta-fundo`, une bordure `--alerta` et une autre icône, pour ne pas ressembler à une confirmation
- L'avis venu par l'adresse (`?aviso=`) en est retiré après avoir été affiché : recharger ne confirme pas à nouveau

## Cloche, langue et visite guidée

- Cloche (prototype r26) : se trouve entre Mon compte et le sélecteur de langue. Les non lus apparaissent dans un compteur `--alerta` avec le nombre en texte. Elle ouvre les avis les plus récents et mène à la page Notifications (r27), où les invitations ont Accepter et Refuser directement
- Sélecteur de langue (prototype r41) : raccourci vers Mon compte › Langue, entre la cloche et Se déconnecter (sans connexion, entre Documentation et Se connecter). Sur ordinateur, il affiche l'icône `languages` et le sigle de la langue actuelle (« PT »), et le nom complet reste pour le lecteur d'écran ; dans le menu mobile apparaît « Idioma: Português ». Il s'ouvre vers le bas comme la cloche, sans être modal, avec les 37 langues par leur propre nom sur trois colonnes et la langue actuelle marquée par `check`. Seul le clic change la langue (WCAG 3.2.2), et la page reste la même, déjà dans la nouvelle langue
- Visite guidée (prototypes r28 et r29) : commence par une fenêtre de bienvenue au premier accès. Chaque étape met en évidence un vrai élément de l'écran et une carte à côté l'explique. Dans une partie des étapes, la personne réalise elle-même l'action pour avancer. On peut la passer ou la fermer à tout moment, et la revoir depuis l'aide

## E-mails

L'invitation et les avis sortent avec la même identité : fond blanc, bandeau `--fundo-faixa`, encre sombre, la rangée de 7 marques et le bleu pétrole seulement sur ce qui est cliquable. Ils sont faits en tableaux avec du style inline, sans images, et incluent la version en texte brut. Ils sortent dans la langue du destinataire (`src/lib/modelo-email.ts`).

## Icônes

Lucide (`lucide-react`), contour de 1,5 px, 18 px, dans la couleur du texte voisin.

- L'icône n'accompagne le texte que dans les **actions** : boutons, liens d'action, navigation principale et onglets. Le texte reste toujours visible ; l'icône a `aria-hidden="true"`
- Icône seule uniquement pour fermer et pour le menu, avec `aria-label`. Exception : sur mobile, les boutons de zoom du diagramme en plein écran (`zoom-out`, `zoom-in`, `maximize`) n'affichent que l'icône pour que Retour et le zoom tiennent sur une ligne ; le texte (Réduire, Agrandir, Ajuster à l'écran) reste comme nom accessible et apparaît sur ordinateur
- L'action destructive utilise l'icône en couleur `--alerta`, avec le texte
- **Aucune icône sur les écrans du participant à l'intérieur du questionnaire** (ihc.md, section 3 : tout élément en plus peut influencer la réponse)
- Correspondance utilisée dans les écrans : Études `folder`, Créer une étude `plus`, Mon compte `user`, Enregistrer les modifications `save`, Changer le mot de passe `lock`, Se déconnecter `log-out`, Se connecter `log-in`, Créer un compte `user-plus`, Vue d'ensemble `layout-dashboard`, Résultats `bar-chart-3`, Réponses `list`, Copier le lien `copy`, Ouvrir la collecte `play`, Fermer la collecte `square`, Rouvrir `rotate-ccw`, Modifier `pencil`, Supprimer `trash-2`, Exporter `download`, Afficher le mot de passe `eye`, Ajouter une version `plus`, Retirer `x`, Retirer de l'analyse `minus-circle`, message de statut `check-circle`, Documentation `book-open`, Voir sur GitHub et Ouvrir en taille réelle `external-link`, Télécharger `download`, Retour `arrow-left`, Administration et Politique de confidentialité `shield-check`, Notifications `bell`, Aide `circle-help`, Revoir la visite guidée `compass`, Langue `languages`. Onglets de la documentation : Vue d'ensemble `layout-dashboard`, Exigences `list-checks`, Utilisateurs `users`, Modélisation `shapes`, Architecture `layers`, Tests `flask-conical`, Spécification `file-text`
- Mouvement : seulement une transition de 120ms sur la couleur/la bordure et l'indicateur d'action en cours. Respecter `prefers-reduced-motion`

## Écrans clés

### Questionnaire du participant (`/r/[slug]`)
L'écran le plus important. C'est là que l'équipe montre qu'elle maîtrise l'IHM.

- En-tête minimal : nom du produit évalué et une phrase d'instruction dans le style de l'UEQ officiel
- Formulaire de consentement avant, sur sa propre page, avec le texte complet, un lien vers la politique de confidentialité et le bouton « J’accepte et je veux participer ». Pas de case à cocher cachée
- Le formulaire (prototype p1) liste, numérotés : durée, données facultatives (quand il y en a), participation, après l'envoi, anonymat, utilisation des données, risques, bénéfices, responsable et comité d'éthique (quand il y en a). Le sous-titre porte l'institution de l'étude. En dessous, « Politique de confidentialité » et « Garder une copie de ce formulaire » (prototype p10), la question « Quel âge avez-vous ? » et, pour « Moins de 18 ans », la confirmation de l'autorisation du responsable légal
- Items en lignes, un par item, avec une règle fine entre eux. Terme de gauche aligné à droite, 7 cercles au centre, terme de droite aligné à gauche. Aucun nombre visible
- Cercles avec une zone tactile de 44×44px, contour 1.5px `--tinta`, remplis en `--tinta` quand ils sont cochés
- Clavier : comportement natif des boutons radio (Tab entre les items, flèches dans l'item). Pas de raccourci à touche unique, qui entre en conflit avec le lecteur d'écran (WCAG 2.1.4). Chaque item est un `<fieldset>` avec `<legend>`, détails dans `docs/ihc.md` section 4.1
- Lien discret « Quitter sans envoyer » en bas de page, qui demande une confirmation dans une fenêtre (voir « Fenêtres »)
- Mobile (< 640px) : les deux termes sont sur une ligne au-dessus des 7 cercles, un à chaque extrémité
- Progression : texte « 14 sur 26 » fixe en bas de page + la rangée de 7 marques comme icône. Pas de barre de progression colorée
- À l'envoi avec un item manquant : résumé des erreurs en haut avec un lien vers chaque item (« Il reste 2 éléments : 7 et 19 »), le focus va au résumé, et chaque item manquant reçoit une bordure gauche `--alerta` + le texte « Cet élément n'a pas de réponse »
- `scroll-padding-bottom` égal à la hauteur du pied de page fixe, pour que le focus ne soit jamais caché
- Fin : page simple de remerciement, dans un encadré avec fond `--fundo-painel` et une barre de 3px `--destaque` à gauche. Pas de confettis. Les avis d'un seul écran (lien fermé, déjà répondu, parti) utilisent le même encadré
- Toutes les étapes s'ouvrent avec le même bandeau `--fundo-faixa` que le consentement : étape (« Étape 2 sur 3 · Questionnaire ») et titre. Dans le consentement et le questionnaire, le bandeau a le sélecteur de langue ; changer de langue dans le questionnaire y ramène, avec les choix conservés dans le brouillon
- Instruction officielle de l'UEQ dans un encadré (`--fundo-painel`, bordure de 1px `--linha`) au-dessus des items, avec le texte entier et dans l'ordre du paquet de langues
- Chaque item affiche le numéro en `--tinta-fraca` à gauche, pour trouver l'item que pointe le résumé des erreurs ; le numéro est aussi dans la légende. Un item répondu reçoit une barre de 3px `--destaque` à gauche, identique quelle que soit la position cochée ; un item manquant, la même barre en `--alerta` avec un fond `--alerta-fundo`. Sur ordinateur, la ligne s'éclaircit (`--fundo-painel`) au survol de la souris, pour que l'œil ne se perde pas entre le terme et les cercles
- Cercles de 30px ; le cercle coché est un anneau avec le centre en `--tinta`, comme les boutons d'option des données facultatives
- Données facultatives : chaque option est une ligne entière cliquable, avec une bordure `--borda-campo` ; l'option choisie a une bordure `--tinta` et un fond `--destaque-fundo`. Continuer et Passer cette étape gardent le même poids

### Tableau de bord de l'étude
Il s'ouvre par une **ligne de résumé en texte**, pas par des cartes : « 34 réponses · 3 suspectes · 31 dans l'analyse · collecte ouverte depuis le 04/11 ».

Graphique principal (SVG propre, `src/graficos/EscalasComBenchmark.tsx`) :
- Une ligne horizontale par échelle, axe de -3 à +3
- Derrière chaque ligne, les 5 tranches du benchmark de cette échelle en tons gris-bleu, avec le libellé de la tranche
- Tranche neutre (-0,8 à +0,8) marquée par deux lignes verticales pointillées et le libellé « neutre » en haut
- La moyenne est un point (cercle de 8px dans la couleur du construit), l'IC95 est un trait horizontal avec des terminaisons
- À droite du graphique, la moyenne en chiffres tabulaires et la tranche du benchmark en texte
- Échelles regroupées avec un libellé en gras : Attractivité / Qualité pragmatique / Qualité hédonique

En dessous, le tableau complet (n, moyenne, ET, IC95, alpha, tranche). Un alpha < 0,7 apparaît avec la valeur en `--alerta` et une note de bas de page.

Graphique par item : liste des 26 items avec les deux termes et un point à la position de la moyenne (-3 à +3), dans l'ordre officiel ou regroupés par échelle (alternable).

Comparaison entre versions : même graphique d'échelles, avec un marqueur par version (cercle plein et cercle évidé, ou carré), légende en texte au-dessus.

### États vides
Sans illustration. Une phrase directe et l'action. Ex. : « Aucune réponse pour l'instant. Partagez le lien de l'étude pour commencer la collecte. » + lien copiable dans un champ avec fond `--fundo-painel` et bouton « Copier le lien ».

## Exceptions

La page d'accueil échappe à deux règles de la section « Interdit » : le bandeau du haut a un léger dégradé radial, et les figures et les cartes ont un rayon de 6 à 8 px (`inicio.module.css`). L'exception est volontaire et se limite à elle : la page d'accueil présente l'UEQ à qui ne connaît pas encore l'outil, et les écrans de travail suivent la règle. Le compteur de la cloche a un rayon de 10 px, qui est la forme du nombre.

## Ton

Portugais du Brésil dans l'original, phrase courte, verbe en tête des boutons (« Criar estudo », « Encerrar coleta », « Exportar respostas » ; en français, « Créer une étude », « Fermer la collecte », « Exporter les réponses »). On parle comme un chercheur parle à un chercheur. Termes de l'UEQ avec leur nom officiel (Perspicuidade, pas « Clareza »). Dates en jj/mm/aaaa, nombres avec virgule décimale.
