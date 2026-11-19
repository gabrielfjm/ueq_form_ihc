# Exigences

L'Outil UEQ comporte **68 exigences fonctionnelles** (RF), ce qu'il fait, et **26 exigences non fonctionnelles** (RNF), la manière dont il doit être. Les 94 sont toutes livrées. La même liste se trouve dans [requisitos.csv](requisitos.csv) et dans le [tableur des exigences](planilha-requisitos.xlsx).

Mis à jour le 17/11/2026.

## Comment lire

Chaque exigence a un ID fixe. Une fois créé, l'ID ne change pas : si une exigence est retirée, elle garde le statut Supprimée, car les cas d'utilisation et les cas de test citent les exigences par leur numéro.

**Priorité**

- **Essentielle :** sans elle, l'outil ne remplit pas les cinq exigences du cours (créer et gérer des études, appliquer l'instrument, calculer selon le protocole, analyser et visualiser, exporter) ou n'est pas accessible.
- **Importante :** elle améliore la qualité d'usage, la sécurité ou la confiance dans les résultats, mais l'outil fonctionne sans elle.
- **Souhaitable :** extension au-delà du périmètre obligatoire de la proposition.

**Statut**

- **Livrée :** elle est sur `main` et peut être vérifiée dans l'outil.
- **En attente :** une partie manque encore.
- **Supprimée :** elle est sortie du périmètre. L'ID reste réservé.

**Sprint** est le sprint au cours duquel l'exigence a été livrée (tableau ci-dessous). Chaque sprint correspond à une ou plusieurs pull requests intégrées dans `main`.

**Comment vérifier** cite les [cas de test](casos-de-teste.md) qui prouvent l'exigence, lorsqu'ils existent, et indique ce qu'il faut faire dans l'outil pour la vérifier. Pour utiliser l'outil, servez-vous du compte de test `pesquisador@exemplo.com` (mot de passe `senha-de-teste`) et de l'étude d'exemple.

### Sprints

| Sprint | PR | Date | Ce qu'il a livré |
|---|---|---|---|
| Sprint 00 · Mise en place | #1 | 22/10/2026 | Squelette du projet avec Next, Prisma et les tests |
| Sprint 01 · Base de données et seed | #5 | 23/10/2026 | Modèle de la base de données et les 26 items de l'UEQ dans le seed |
| Sprint 02 · Calcul | #6 | 23/10/2026 | Module de calcul de l'UEQ |
| Sprint 03 · Authentification | #7 | 23/10/2026 | Inscription, connexion et Mon compte |
| Sprint 04 · Études | #8 | 23/10/2026 | Liste, création et page de l'étude |
| Sprint 05 · Questionnaire | #9 | 23/10/2026 | Questionnaire du participant |
| Sprint 06 · Résultats | #10 | 23/10/2026 | Tableau de bord des résultats et comparaison entre versions |
| Sprint 07 · Réponses suspectes | #11 | 29/10/2026 | Page des réponses et contrôle des réponses suspectes |
| Sprint 08 · Exportation | #12 | 29/10/2026 | Exportations en CSV |
| Sprint des langues | #13 | 29/10/2026 | Questionnaire dans les 37 langues de l'UEQ |
| Sprint 10 · Extensions | #14 | 30/10/2026 | Importation par CSV, tableau de bord en PDF, structure de l'UEQ-S |
| Sprint de documentation | #15, #16 | 30/10/2026 | Onglet Documentation, licence MIT, barre fixe, diagrammes en plein écran |
| Page d'accueil et fenêtres | #17 | 30/10/2026 | Page d'accueil, Se connecter dans une fenêtre, confirmation de la déconnexion et de la suppression, icône |
| Déploiement | #18, #19, #20 | 30/10 et 31/10/2026 | Cas de test mis à jour et publication sur Vercel, avec migrations et seed dans le build |
| Équipe et aide | #21 | 01/11/2026 | Études en équipe, notifications, visite guidée, aide sur chaque page, collecte démographique facultative et Administration |
| LGPD | #22, #23 | 01/11/2026 | Chiffrement, politique de confidentialité, Télécharger mes données, limite de tentatives, en-têtes de sécurité et profil des participants |
| Langues de l'outil | #24 à #27 | 02/11/2026 | Outil dans les 37 langues, langue de l'étude, traduction des textes de l'étude et nouvelle page d'accueil |
| Participant et e-mails | #28, #29 | 03/11/2026 | Écrans du participant plus accueillants et e-mails à l'identité visuelle de l'outil |
| Confidentialité et documentation en pages | #30 à #34 | 06/11/2026 | Politique conforme au style de l'outil, documents d'architecture et de tests, documentation en pages et confirmation de chaque action |
| Qualité de la traduction | #35 à #39 | 06/11 et 07/11/2026 | Traduction de l'interface avec glossaire, contexte de l'écran et revue automatique |
| Formulaire de consentement | #40, #41 | 17/11/2026 | Formulaire complet, mineurs de moins de 18 ans, sélecteur de langue dans la barre et Next.js 16.4.6 |
| Documentation finale | #42, #43 | 17/11/2026 | Exigences, matrice de traçabilité, personas, récits, cas d'utilisation, diagramme de classes et vérification du calcul |
| Sprint 09 · Revue finale | #44 | 17/11/2026 | Vérification avec le tableur officiel dans 11 scénarios et exportation dans la UEQ Data Analysis Tool elle-même |
| UEQ-S | #45 | 18/11/2026 | L'UEQ-S comme questionnaire de l'étude, l'onglet UEQ-S dans les résultats, la comparaison UEQ ou UEQ-S sur la page d'accueil et la vérification avec le tableur officiel de l'UEQ-S dans 9 scénarios |

## Exigences fonctionnelles

### Accès et compte

| ID | Exigence | Description | Priorité | Sprint | Statut | Comment vérifier |
|---|---|---|---|---|---|---|
| <a id="rf01"></a>RF01 | **Créer un compte** | Le chercheur crée un compte avec nom, e-mail et mot de passe, et voit les règles du mot de passe avant de le saisir. | Essentielle | Sprint 03 · Authentification | Livrée | [CT-E03](casos-de-teste.md#ct-e03), [CT-E06](casos-de-teste.md#ct-e06), [CT-E07](casos-de-teste.md#ct-e07). Sur la page d'accueil, cliquez sur Créer un compte et inscrivez-vous en laissant un champ vide lors de la première tentative. |
| <a id="rf02"></a>RF02 | **Se connecter et se déconnecter** | Le chercheur se connecte avec son e-mail et son mot de passe et quitte la session, ce qui demande une confirmation dans une fenêtre. | Essentielle | Sprint 03 · Authentification | Livrée | [CT-E03](casos-de-teste.md#ct-e03), [CT-E08](casos-de-teste.md#ct-e08), [CT-E58](casos-de-teste.md#ct-e58). Connectez-vous avec le compte de test, en vous trompant d'abord de mot de passe ; cliquez ensuite sur Déconnexion. |
| <a id="rf03"></a>RF03 | **Protéger l'espace du chercheur** | Quiconque ouvre une page du chercheur sans session est redirigé vers Se connecter et, après la connexion, revient à la page demandée. | Essentielle | Sprint 03 · Authentification | Livrée | [CT-E04](casos-de-teste.md#ct-e04). Sans être connecté, ouvrez http://localhost:3000/estudos. |
| <a id="rf04"></a>RF04 | **Modifier les données du compte** | Le chercheur modifie son nom et son e-mail dans Mon compte ; un e-mail qui appartient déjà à un autre compte est refusé. | Importante | Sprint 03 · Authentification | Livrée | [CT-E09](casos-de-teste.md#ct-e09). Mon compte › Données personnelles : modifiez le nom et enregistrez. |
| <a id="rf05"></a>RF05 | **Changer le mot de passe** | Le chercheur change son mot de passe en indiquant le mot de passe actuel, et le changement ferme les sessions ouvertes dans d'autres navigateurs. | Importante | Sprint 03 · Authentification | Livrée | [CT-E10](casos-de-teste.md#ct-e10). Mon compte › Mot de passe. |
| <a id="rf06"></a>RF06 | **Supprimer le compte** | Le chercheur supprime son compte en saisissant son e-mail, et la suppression efface aussi ses études et leurs réponses. | Importante | Sprint 03 · Authentification | Livrée | [CT-E11](casos-de-teste.md#ct-e11). Mon compte › Supprimer le compte, avec un compte créé uniquement pour le test. |
| <a id="rf07"></a>RF07 | **Télécharger mes données** | Le chercheur télécharge, dans Mon compte, un fichier JSON contenant tout ce que l'outil conserve sur son compte. | Importante | LGPD | Livrée | [CT-E81](casos-de-teste.md#ct-e81). Mon compte › Télécharger mes données : le fichier .json est téléchargé et contient les données du compte. |
| <a id="rf08"></a>RF08 | **Choisir la langue de l'outil** | Le chercheur choisit la langue de l'interface lors de la création du compte et la change dans Mon compte › Langue ou avec le sélecteur de langue de la barre, parmi les 37 langues de l'UEQ ; sans compte, le sélecteur de la barre change aussi la langue. | Souhaitable | Langues de l'outil | Livrée | [CT-E94](casos-de-teste.md#ct-e94), [CT-E95](casos-de-teste.md#ct-e95). Cliquez sur PT dans la barre, choisissez une autre langue et vérifiez que le menu est traduit ; il en va de même dans Mon compte › Langue. |
| <a id="rf09"></a>RF09 | **Visite guidée lors de la première connexion** | Quiconque se connecte pour la première fois suit une visite guidée à travers ses propres actions, et peut l'ignorer, la fermer ou la revoir plus tard depuis l'aide. | Souhaitable | Équipe et aide | Livrée | [CT-E66](casos-de-teste.md#ct-e66), [CT-M22](casos-de-teste.md#ct-m22). Créez un nouveau compte et connectez-vous : la visite démarre d'elle-même. |
| <a id="rf10"></a>RF10 | **Aide sur chaque page** | Chaque page du chercheur a un bouton d'aide (?) dans l'en-tête, qui explique la page elle-même. | Souhaitable | Équipe et aide | Livrée | [CT-E65](casos-de-teste.md#ct-e65). Sur n'importe quelle page du chercheur, cliquez sur (?). |
| <a id="rf11"></a>RF11 | **Page d'accueil** | La page d'accueil explique l'UEQ (échelles, lecture des résultats et benchmark) et indique les crédits ; Se connecter et Créer un compte s'ouvrent dans une fenêtre par-dessus. | Importante | Page d'accueil et fenêtres | Livrée | [CT-E01](casos-de-teste.md#ct-e01), [CT-E58](casos-de-teste.md#ct-e58), [CT-E59](casos-de-teste.md#ct-e59), [CT-E60](casos-de-teste.md#ct-e60). Ouvrez http://localhost:3000 sans être connecté et cliquez sur Se connecter. |

### Études

| ID | Exigence | Description | Priorité | Sprint | Statut | Comment vérifier |
|---|---|---|---|---|---|---|
| <a id="rf12"></a>RF12 | **Lister les études** | Le chercheur voit ses études dans un tableau avec titre, produit, statut, versions, réponses et dernière réponse, trié par date de mise à jour. | Essentielle | Sprint 04 · Études | Livrée | [CT-E12](casos-de-teste.md#ct-e12), [CT-E17](casos-de-teste.md#ct-e17). Menu Études. |
| <a id="rf13"></a>RF13 | **Créer une étude** | Le chercheur crée une étude avec titre, produit évalué, objectif, période de collecte et une ou plusieurs versions du produit, et indique qui répond de la recherche (nom, e-mail de contact et institution), les risques et les bénéfices pour le participant et, le cas échéant, le comité d'éthique ; le nom du produit suggère le nom de la première version. | Essentielle | Sprint 04 · Études | Livrée | [CT-E13](casos-de-teste.md#ct-e13), [CT-E14](casos-de-teste.md#ct-e14), [CT-E93](casos-de-teste.md#ct-e93). Créer une étude : créez une étude avec 2 versions. |
| <a id="rf14"></a>RF14 | **Modifier l'étude** | Le chercheur modifie les données et les versions de l'étude ; lorsque la collecte est ouverte, une version qui a déjà des réponses ne peut pas être supprimée. | Essentielle | Sprint 04 · Études | Livrée | [CT-E18](casos-de-teste.md#ct-e18). Page de l'étude › Modifier l'étude. |
| <a id="rf15"></a>RF15 | **Ouvrir, clôturer et rouvrir la collecte** | Le chercheur ouvre, clôture et rouvre la collecte ; le lien n'accepte de réponses que lorsque la collecte est ouverte et, dans les autres cas, affiche un avertissement. | Essentielle | Sprint 04 · Études | Livrée | [CT-E15](casos-de-teste.md#ct-e15). Page de l'étude : Ouvrir la collecte, Fermer la collecte et Rouvrir la collecte, en ouvrant le lien à chaque étape. |
| <a id="rf16"></a>RF16 | **Copier le lien public** | Chaque étude a un lien public court et non séquentiel, que le chercheur copie avec un bouton. | Essentielle | Sprint 04 · Études | Livrée | [CT-E16](casos-de-teste.md#ct-e16). Page de l'étude › Copier le lien. |
| <a id="rf17"></a>RF17 | **Supprimer l'étude** | Le chercheur supprime une étude en saisissant son titre ; l'avertissement indique combien de réponses seront supprimées avec elle, et les versions, participations et réponses sont effacées. | Essentielle | Sprint 04 · Études | Livrée | [CT-E19](casos-de-teste.md#ct-e19). Page de l'étude › Supprimer l'étude. |
| <a id="rf18"></a>RF18 | **Activer la collecte de données démographiques** | Le chercheur décide, pour chaque étude, si le lien affiche l'étape des données démographiques ; elle est désactivée par défaut. | Importante | Équipe et aide | Livrée | [CT-E71](casos-de-teste.md#ct-e71). Créer une étude : activez les données démographiques et ouvrez le lien : l'étape Données facultatives apparaît. |
| <a id="rf19"></a>RF19 | **Choisir la langue de l'étude** | Le chercheur choisit la langue dans laquelle l'étude est rédigée et dans laquelle le lien s'ouvre ; les nouvelles études sont créées dans la langue du compte. | Souhaitable | Langues de l'outil | Livrée | [CT-E45](casos-de-teste.md#ct-e45). Créer une étude : changez la langue et ouvrez le lien. |

### Équipe et notifications

| ID | Exigence | Description | Priorité | Sprint | Statut | Comment vérifier |
|---|---|---|---|---|---|---|
| <a id="rf20"></a>RF20 | **Partager l'étude** | Le propriétaire invite un compte inscrit, par son e-mail, en tant qu'Éditeur (modifie l'étude) ou Lecteur (consulte et exporte) ; seul le propriétaire invite et supprime l'étude. | Souhaitable | Équipe et aide | Livrée | [CT-E63](casos-de-teste.md#ct-e63). Page de l'étude › Partager : invitez le compte d'une autre personne de l'équipe en tant que Lecteur. |
| <a id="rf21"></a>RF21 | **Accepter ou refuser une invitation** | La personne invitée accepte ou refuse l'invitation, et l'étude n'apparaît dans sa liste qu'après acceptation. | Souhaitable | Équipe et aide | Livrée | [CT-E63](casos-de-teste.md#ct-e63). Avec le compte invité, ouvrez la cloche et acceptez l'invitation. |
| <a id="rf22"></a>RF22 | **Cloche de notifications** | La cloche signale les invitations, les nouvelles réponses (regroupées tant qu'elles ne sont pas lues) et les modifications faites par les partenaires. | Souhaitable | Équipe et aide | Livrée | [CT-E63](casos-de-teste.md#ct-e63), [CT-E64](casos-de-teste.md#ct-e64), [CT-M21](casos-de-teste.md#ct-m21). Répondez au lien de l'une de vos études et ouvrez la cloche. |
| <a id="rf23"></a>RF23 | **Notifications par e-mail** | Chaque notification est aussi envoyée par e-mail, dans la langue du destinataire, lorsque l'envoi est configuré ; le chercheur peut le désactiver dans Mon compte. | Souhaitable | Équipe et aide | Livrée | [CT-U59](casos-de-teste.md#ct-u59). Mon compte › Notifications par e-mail (l'envoi dépend des variables SMTP du .env). |

### Questionnaire du participant

| ID | Exigence | Description | Priorité | Sprint | Statut | Comment vérifier |
|---|---|---|---|---|---|---|
| <a id="rf24"></a>RF24 | **Répondre sans compte** | Le participant répond via le lien public, sans compte ni connexion, et ne trouve aucun chemin vers l'espace du chercheur. | Essentielle | Sprint 05 · Questionnaire | Livrée | [CT-E05](casos-de-teste.md#ct-e05), [CT-E52](casos-de-teste.md#ct-e52). Ouvrez http://localhost:3000/r/exemplo dans une fenêtre de navigation privée. |
| <a id="rf25"></a>RF25 | **Consentement** | Le participant lit le formulaire de consentement (objectif, durée estimée, ce qui se passe après l'envoi, risques, bénéfices, conservation des données et qui répond de la recherche), indique son âge et ne participe qu'après avoir cliqué sur Je suis d'accord ; une personne de moins de 18 ans confirme l'autorisation de son représentant légal, Je ne souhaite pas participer permet de partir sans rien enregistrer, et un exemplaire du formulaire peut être imprimé ou enregistré en PDF. | Essentielle | Sprint 05 · Questionnaire | Livrée | [CT-E21](casos-de-teste.md#ct-e21), [CT-E28](casos-de-teste.md#ct-e28), [CT-E91](casos-de-teste.md#ct-e91), [CT-E92](casos-de-teste.md#ct-e92). Ouvrez le lien de l'étude d'exemple. |
| <a id="rf26"></a>RF26 | **Répartir les participants entre les versions** | Lorsqu'il y a plus d'une version, chaque participant est dirigé vers la version qui a le moins de réponses terminées ; en cas d'égalité, vers celle de plus petit ordre. | Essentielle | Sprint 05 · Questionnaire | Livrée | [CT-U30](casos-de-teste.md#ct-u30). Répondez deux fois au lien (dans des fenêtres de navigation privée) d'une étude à 2 versions et vérifiez l'onglet Réponses. |
| <a id="rf27"></a>RF27 | **Répondre aux 26 items** | Le participant répond aux 26 items dans l'ordre et selon la polarité officiels, avec la consigne officielle et 7 positions par item, aucune n'étant cochée au départ. | Essentielle | Sprint 05 · Questionnaire | Livrée | [CT-E21](casos-de-teste.md#ct-e21), [CT-E24](casos-de-teste.md#ct-e24). Je suis d'accord et je souhaite participer : vérifiez les 26 items. |
| <a id="rf28"></a>RF28 | **Suivre la progression** | Un pied de page fixe indique combien d'items ont déjà reçu une réponse, sur 26. | Importante | Sprint 05 · Questionnaire | Livrée | [CT-E22](casos-de-teste.md#ct-e22), [CT-M03](casos-de-teste.md#ct-m03). Cochez quelques items et regardez le pied de page. |
| <a id="rf29"></a>RF29 | **Signaler les items manquants** | Lors d'un envoi avec des items sans réponse, un résumé en haut indique lesquels manquent, avec un lien vers chacun, et rien n'est enregistré. | Essentielle | Sprint 05 · Questionnaire | Livrée | [CT-E23](casos-de-teste.md#ct-e23). Envoyez en laissant 2 items sans réponse et utilisez les liens du résumé. |
| <a id="rf30"></a>RF30 | **Récupérer les réponses cochées** | Si la page est rechargée, les réponses déjà cochées reviennent et un avertissement l'indique. | Importante | Sprint 05 · Questionnaire | Livrée | [CT-E26](casos-de-teste.md#ct-e26). Cochez quelques items et rechargez la page. |
| <a id="rf31"></a>RF31 | **Quitter sans envoyer** | Le participant peut partir à tout moment avec Quitter sans envoyer, qui demande une confirmation dans une fenêtre et n'enregistre rien. | Essentielle | Sprint 05 · Questionnaire | Livrée | [CT-E27](casos-de-teste.md#ct-e27). Dans le questionnaire, cliquez sur Quitter sans envoyer. |
| <a id="rf32"></a>RF32 | **Données démographiques facultatives** | Lorsque l'étude les recueille, le participant indique sa tranche d'âge, son genre, son niveau de scolarité et sa familiarité dans des tranches fermées, toutes avec Je préfère ne pas répondre, et peut ignorer l'étape entière. | Importante | Sprint 05 · Questionnaire | Livrée | [CT-E21](casos-de-teste.md#ct-e21). Dans une étude avec les données démographiques activées, répondez à une question et ignorez les autres. |
| <a id="rf33"></a>RF33 | **Terminer et ne pas répondre à nouveau** | Après l'envoi, le participant voit le message de remerciement, et le même navigateur ne peut pas envoyer une autre réponse pour l'étude. | Essentielle | Sprint 05 · Questionnaire | Livrée | [CT-E21](casos-de-teste.md#ct-e21), [CT-E28](casos-de-teste.md#ct-e28). Terminez le questionnaire et ouvrez à nouveau le lien dans le même navigateur. |
| <a id="rf34"></a>RF34 | **Répondre en 37 langues** | Le lien s'ouvre dans la langue de l'étude ou du navigateur, le participant change de langue dans le sélecteur parmi les 37 langues officielles de l'UEQ, et les langues qui s'écrivent de droite à gauche inversent la page. | Importante | Sprint des langues | Livrée | [CT-E45](casos-de-teste.md#ct-e45), [CT-E46](casos-de-teste.md#ct-e46), [CT-U45](casos-de-teste.md#ct-u45), [CT-U50](casos-de-teste.md#ct-u50). Dans le consentement, passez à l'arabe ou au japonais et répondez. |
| <a id="rf35"></a>RF35 | **Traduire les textes de l'étude** | Le titre, le produit et l'objectif rédigés par le chercheur apparaissent traduits dans la langue du participant. | Souhaitable | Langues de l'outil | Livrée | [CT-U63](casos-de-teste.md#ct-u63). Ouvrez le lien dans une autre langue et vérifiez le titre et l'objectif (dépend de la ANTHROPIC_API_KEY dans le .env). |

### Calcul de l'UEQ

| ID | Exigence | Description | Priorité | Sprint | Statut | Comment vérifier |
|---|---|---|---|---|---|---|
| <a id="rf36"></a>RF36 | **Recoder les réponses** | L'outil convertit chaque réponse de 1 à 7 en une valeur de -3 à +3, selon la polarité de l'item. | Essentielle | Sprint 02 · Calcul | Livrée | [CT-U01](casos-de-teste.md#ct-u01), [CT-U02](casos-de-teste.md#ct-u02), [CT-U03](casos-de-teste.md#ct-u03), [CT-U04](casos-de-teste.md#ct-u04), [CT-U05](casos-de-teste.md#ct-u05). Résultats › Exporter › réponses recodées. |
| <a id="rf37"></a>RF37 | **Statistiques par échelle** | Pour chaque échelle et chaque version, l'outil calcule n, la moyenne, l'écart type de l'échantillon, l'intervalle de confiance à 95 % et l'alpha de Cronbach standardisé. | Essentielle | Sprint 02 · Calcul | Livrée | [CT-U07](casos-de-teste.md#ct-u07), [CT-U08](casos-de-teste.md#ct-u08), [CT-U09](casos-de-teste.md#ct-u09), [CT-U10](casos-de-teste.md#ct-u10), [CT-U11](casos-de-teste.md#ct-u11), [CT-U14](casos-de-teste.md#ct-u14). Onglet Résultats, tableau des échelles. |
| <a id="rf38"></a>RF38 | **Interpréter les moyennes** | Chaque moyenne est lue comme positive (au-dessus de +0,8), neutre (de -0,8 à +0,8) ou négative (en dessous de -0,8). | Essentielle | Sprint 02 · Calcul | Livrée | [CT-U13](casos-de-teste.md#ct-u13). Onglet Résultats, colonne Interprétation. |
| <a id="rf39"></a>RF39 | **Qualité pragmatique et hédonique** | L'outil calcule la qualité pragmatique (moyenne de Clarté, Efficacité et Fiabilité) et la qualité hédonique (moyenne de Stimulation et Nouveauté). | Essentielle | Sprint 02 · Calcul | Livrée | [CT-U20](casos-de-teste.md#ct-u20). Onglet Résultats, ligne sous le tableau des échelles. |
| <a id="rf40"></a>RF40 | **Classer selon le benchmark** | Chaque moyenne est classée dans les 5 tranches du benchmark officiel (excellent, bon, au-dessus de la moyenne, sous la moyenne, mauvais) ; une moyenne égale à la limite tombe dans la tranche inférieure. | Essentielle | Sprint 02 · Calcul | Livrée | [CT-U16](casos-de-teste.md#ct-u16), [CT-U17](casos-de-teste.md#ct-u17). Onglet Résultats, colonne Référence. |
| <a id="rf41"></a>RF41 | **Moyenne par item** | L'outil calcule la moyenne recodée et la distribution de 1 à 7 de chacun des 26 items. | Importante | Sprint 02 · Calcul | Livrée | [CT-U15](casos-de-teste.md#ct-u15). Onglet Résultats, graphique Moyennes par item. |
| <a id="rf42"></a>RF42 | **Calculer uniquement avec les participations dans l'analyse** | Les statistiques n'utilisent que les participations incluses dans l'analyse. | Essentielle | Sprint 02 · Calcul | Livrée | [CT-U18](casos-de-teste.md#ct-u18), [CT-U22](casos-de-teste.md#ct-u22). Retirez une réponse de l'analyse dans l'onglet Réponses et regardez n changer dans Résultats. |

### Résultats

| ID | Exigence | Description | Priorité | Sprint | Statut | Comment vérifier |
|---|---|---|---|---|---|---|
| <a id="rf43"></a>RF43 | **Tableau de bord des résultats** | Le chercheur voit un résumé de la collecte, le graphique des 6 échelles avec IC95 et tranches du benchmark, et le tableau avec les mêmes nombres. | Essentielle | Sprint 06 · Résultats | Livrée | [CT-E29](casos-de-teste.md#ct-e29). Étude d'exemple › onglet Résultats. |
| <a id="rf44"></a>RF44 | **Lecture rapide** | Une phrase en haut du tableau de bord résume le résultat : les échelles par tranche du benchmark et les échelles négatives. | Importante | Sprint 06 · Résultats | Livrée | [CT-U42](casos-de-teste.md#ct-u42). Onglet Résultats, phrase du haut. |
| <a id="rf45"></a>RF45 | **Avertissements d'alpha faible et de petit échantillon** | Le tableau de bord avertit lorsque l'alpha est inférieur à 0,7 et lorsque l'échantillon ne permet pas de calculer l'intervalle de confiance, en expliquant ce que cela signifie et ce qu'il faut faire. | Importante | Sprint 06 · Résultats | Livrée | [CT-U21](casos-de-teste.md#ct-u21), [CT-E30](casos-de-teste.md#ct-e30). Créez une étude avec une seule réponse et ouvrez Résultats. |
| <a id="rf46"></a>RF46 | **Graphique par item** | Le chercheur voit la moyenne de chaque item entre ses deux termes, dans l'ordre officiel ou regroupée par échelle. | Importante | Sprint 06 · Résultats | Livrée | [CT-E29](casos-de-teste.md#ct-e29). Onglet Résultats › Moyennes par item : changez l'ordre. |
| <a id="rf47"></a>RF47 | **Comparer les versions** | Lorsqu'il y a plus d'une version, le chercheur compare les versions côte à côte dans le même graphique, avec des marqueurs de formes différentes et une lecture des plus grandes différences. | Essentielle | Sprint 06 · Résultats | Livrée | [CT-E29](casos-de-teste.md#ct-e29), [CT-U43](casos-de-teste.md#ct-u43). Onglet Résultats › Comparer les versions. |
| <a id="rf48"></a>RF48 | **Conserver la vue dans l'adresse** | La version choisie et le mode (une version ou comparaison) restent dans l'adresse de la page, pour revenir, recharger et partager. | Importante | Sprint 06 · Résultats | Livrée | [CT-E29](casos-de-teste.md#ct-e29). Choisissez Comparer les versions et rechargez la page. |
| <a id="rf49"></a>RF49 | **Expliquer les termes** | Chaque terme technique (échelles, IC95, alpha de Cronbach, benchmark) a une courte explication qui s'ouvre près de l'endroit où il apparaît. | Importante | Sprint 06 · Résultats | Livrée | Onglet Résultats : ouvrez Qu'est-ce que la Clarté ? |
| <a id="rf50"></a>RF50 | **Voir les données démographiques** | Lorsque l'étude les recueille, un onglet montre chaque question démographique dans un graphique accompagné du tableau des nombres, avec un filtre par version. | Souhaitable | LGPD | Livrée | [CT-E72](casos-de-teste.md#ct-e72), [CT-U60](casos-de-teste.md#ct-u60). Dans une étude avec données démographiques, onglet Résultats › Données démographiques. |

### Réponses et réponses suspectes

| ID | Exigence | Description | Priorité | Sprint | Statut | Comment vérifier |
|---|---|---|---|---|---|---|
| <a id="rf51"></a>RF51 | **Marquer les réponses suspectes** | Chaque participation est marquée comme suspecte au moment où elle est terminée lorsqu'elle a 3 échelles ou plus avec une amplitude supérieure à 3 ou plus de 15 réponses identiques. | Essentielle | Sprint 07 · Réponses suspectes | Livrée | [CT-U23](casos-de-teste.md#ct-u23), [CT-U25](casos-de-teste.md#ct-u25), [CT-U26](casos-de-teste.md#ct-u26), [CT-U27](casos-de-teste.md#ct-u27), [CT-U28](casos-de-teste.md#ct-u28), [CT-E33](casos-de-teste.md#ct-e33). Étude d'exemple › onglet Réponses › Afficher seulement les suspectes. |
| <a id="rf52"></a>RF52 | **Tableau des participations** | Le chercheur voit toutes les participations avec la date, la version, la langue, l'origine, les échelles incohérentes, le plus grand nombre de réponses identiques, le motif de la suspicion et si elle est dans l'analyse, et peut filtrer uniquement les suspectes. | Essentielle | Sprint 07 · Réponses suspectes | Livrée | [CT-E33](casos-de-teste.md#ct-e33), [CT-E36](casos-de-teste.md#ct-e36). Onglet Réponses. |
| <a id="rf53"></a>RF53 | **Voir les échelles d'un participant** | En ouvrant une participation, le chercheur voit l'amplitude de chaque échelle, celles qui dépassent le seuil étant mises en évidence. | Importante | Sprint 07 · Réponses suspectes | Livrée | [CT-E35](casos-de-teste.md#ct-e35). Onglet Réponses : ouvrez Voir les échelles d'une réponse suspecte. |
| <a id="rf54"></a>RF54 | **Retirer des réponses de l'analyse et les y remettre** | Le chercheur retire chaque participation de l'analyse ou l'y remet, ou toutes les suspectes d'un coup, sans effacer aucune donnée, et le tableau de bord indique combien sont exclues. | Essentielle | Sprint 07 · Réponses suspectes | Livrée | [CT-E33](casos-de-teste.md#ct-e33), [CT-E34](casos-de-teste.md#ct-e34). Onglet Réponses : retirez une réponse suspecte de l'analyse et remettez-la. |
| <a id="rf55"></a>RF55 | **Recalculer les réponses suspectes** | Une commande recalcule la marque de suspicion de toutes les participations après que l'équipe a ajusté les seuils du protocole. | Souhaitable | Sprint 07 · Réponses suspectes | Livrée | [CT-M16](casos-de-teste.md#ct-m16). Terminal : pnpm suspeitas:recalcular. |

### Exportation et importation

| ID | Exigence | Description | Priorité | Sprint | Statut | Comment vérifier |
|---|---|---|---|---|---|---|
| <a id="rf56"></a>RF56 | **Exporter les réponses brutes** | Le chercheur télécharge un CSV avec les réponses de 1 à 7 de chaque participation, avec la version et les données démographiques. | Essentielle | Sprint 08 · Exportation | Livrée | [CT-U35](casos-de-teste.md#ct-u35), [CT-E37](casos-de-teste.md#ct-e37). Onglet Résultats › Exporter › réponses brutes. |
| <a id="rf57"></a>RF57 | **Exporter les réponses recodées** | Le chercheur télécharge un CSV avec les réponses déjà converties en valeurs de -3 à +3. | Essentielle | Sprint 08 · Exportation | Livrée | [CT-U37](casos-de-teste.md#ct-u37), [CT-E37](casos-de-teste.md#ct-e37). Onglet Résultats › Exporter › réponses recodées. |
| <a id="rf58"></a>RF58 | **Exporter les résultats par échelle** | Le chercheur télécharge un CSV avec une ligne par échelle et par version, contenant les statistiques du tableau de bord. | Essentielle | Sprint 08 · Exportation | Livrée | [CT-U38](casos-de-teste.md#ct-u38), [CT-E37](casos-de-teste.md#ct-e37). Onglet Résultats › Exporter › résultats par échelle. |
| <a id="rf59"></a>RF59 | **Exporter dans le tableur officiel de l'UEQ** | Le chercheur télécharge la UEQ Data Analysis Tool V15 elle-même, remplie avec les participations dans l'analyse (de la version choisie dans le tableau de bord ou de l'étude entière), qui se recalcule à l'ouverture dans Excel. | Essentielle | Sprint 09 · Revue finale | Livrée | [CT-U34](casos-de-teste.md#ct-u34), [CT-U70](casos-de-teste.md#ct-u70), [CT-E37](casos-de-teste.md#ct-e37), [CT-E96](casos-de-teste.md#ct-e96). Onglet Résultats › Exporter › Tableur officiel de l'UEQ (XLSX) ; ouvrir dans Excel et cliquer sur Activer la modification. |
| <a id="rf60"></a>RF60 | **Exporter le tableau de bord en PDF** | Le chercheur télécharge le tableau de bord de la version choisie en PDF, avec le titre de l'étude, n et la date dans l'en-tête. | Souhaitable | Sprint 10 · Extensions | Livrée | [CT-E39](casos-de-teste.md#ct-e39), [CT-E40](casos-de-teste.md#ct-e40). Onglet Résultats › Tableau de bord en PDF. |
| <a id="rf61"></a>RF61 | **Importer des réponses par CSV** | Le chercheur importe des réponses au format du tableur officiel dans une version, avec un aperçu et des erreurs signalées ligne par ligne, et les réponses importées restent marquées comme telles. | Souhaitable | Sprint 10 · Extensions | Livrée | [CT-U39](casos-de-teste.md#ct-u39), [CT-U40](casos-de-teste.md#ct-u40), [CT-U41](casos-de-teste.md#ct-u41), [CT-E42](casos-de-teste.md#ct-e42), [CT-E43](casos-de-teste.md#ct-e43). Onglet Réponses › Importer des réponses depuis un CSV, avec data/fixtures/basico/respostas.csv. |
| <a id="rf62"></a>RF62 | **Appliquer l'UEQ-S** | Le chercheur choisit, lors de la création de l'étude, entre l'UEQ complet et l'UEQ-S (version courte, 8 items, qualité pragmatique, hédonique et globale). Le choix est verrouillé dès la première réponse, et l'évaluation de l'UEQ-S se trouve dans un onglet propre des résultats, avec son benchmark et son tableur officiel. | Souhaitable | UEQ-S | Livrée | [CT-U53](casos-de-teste.md#ct-u53), [CT-U71](casos-de-teste.md#ct-u71), [CT-U72](casos-de-teste.md#ct-u72), [CT-U73](casos-de-teste.md#ct-u73), [CT-U74](casos-de-teste.md#ct-u74), [CT-U75](casos-de-teste.md#ct-u75), [CT-U76](casos-de-teste.md#ct-u76), [CT-E97](casos-de-teste.md#ct-e97), [CT-E98](casos-de-teste.md#ct-e98), [CT-E99](casos-de-teste.md#ct-e99), [CT-E100](casos-de-teste.md#ct-e100), [CT-E101](casos-de-teste.md#ct-e101), [CT-M26](casos-de-teste.md#ct-m26). Créez une étude et choisissez UEQ-S, version courte dans Questionnaire ; répondez via le lien et ouvrez Résultats › UEQ-S. L'étude d'exemple de l'UEQ-S (/r/exemplo-curto) a déjà des réponses. Les 9 scénarios de data/fixtures-ueq-s correspondent au tableur officiel de l'UEQ-S recalculé dans Excel. |

### Documentation

| ID | Exigence | Description | Priorité | Sprint | Statut | Comment vérifier |
|---|---|---|---|---|---|---|
| <a id="rf63"></a>RF63 | **Onglet Documentation** | Toute personne, avec ou sans compte, lit la documentation du projet dans un onglet public, en 7 sections ; un document pas encore publié apparaît comme En préparation. | Importante | Sprint de documentation | Livrée | [CT-E47](casos-de-teste.md#ct-e47), [CT-E48](casos-de-teste.md#ct-e48), [CT-E62](casos-de-teste.md#ct-e62), [CT-U54](casos-de-teste.md#ct-u54). Ouvrez http://localhost:3000/documentacao sans être connecté. |
| <a id="rf64"></a>RF64 | **Diagrammes en plein écran** | Chaque diagramme s'ouvre en plein écran, avec un zoom de 50 % à 400 % et un déplacement par glisser, et se ferme avec Retour ou Échap. | Importante | Sprint de documentation | Livrée | [CT-E57](casos-de-teste.md#ct-e57), [CT-U55](casos-de-teste.md#ct-u55). Ouvrez un document contenant un diagramme et cliquez dessus. |
| <a id="rf65"></a>RF65 | **Liens et téléchargements de la documentation** | Les liens entre documents mènent à la bonne ancre dans l'outil, et les fichiers de la fiche (CSV, tableur, sources) se téléchargent sans compte. | Importante | Sprint de documentation | Livrée | [CT-E49](casos-de-teste.md#ct-e49), [CT-E51](casos-de-teste.md#ct-e51), [CT-U56](casos-de-teste.md#ct-u56). Dans l'onglet Documentation, cliquez sur un lien vers un autre document et sur un téléchargement. |

### Administration

| ID | Exigence | Description | Priorité | Sprint | Statut | Comment vérifier |
|---|---|---|---|---|---|---|
| <a id="rf66"></a>RF66 | **Gérer les comptes** | Le superutilisateur ouvre la page Administration, voit les comptes et crée un compte pour une autre personne ; une personne qui n'est pas superutilisateur n'y a pas accès. | Souhaitable | Équipe et aide | Livrée | Avec un compte administrateur, menu Administration › Comptes. |
| <a id="rf67"></a>RF67 | **Scénarios de démonstration** | Le superutilisateur crée des études de démonstration avec des réponses fictives, pour présenter l'outil. | Souhaitable | Équipe et aide | Livrée | [CT-U61](casos-de-teste.md#ct-u61). Administration › Scénarios de démonstration. |
| <a id="rf68"></a>RF68 | **État de la protection des données et des traductions** | Le superutilisateur voit si le chiffrement des champs est activé et quelle part de chaque langue est déjà traduite. | Souhaitable | Langues de l'outil | Livrée | Administration › Protection des données et Administration › Langues. |

## Exigences non fonctionnelles

### Accessibilité

| ID | Exigence | Description | Priorité | Sprint | Statut | Comment vérifier |
|---|---|---|---|---|---|---|
| <a id="rnf01"></a>RNF01 | **WCAG 2.2 AA** | Chaque écran, y compris dans les états d'erreur, respecte la WCAG 2.2 niveau AA, base de la norme ABNT NBR 17225:2025, sans violation signalée par axe-core. | Essentielle | Sprint 00 · Mise en place | Livrée | [CT-E06](casos-de-teste.md#ct-e06), [CT-E14](casos-de-teste.md#ct-e14), [CT-E21](casos-de-teste.md#ct-e21), [CT-E47](casos-de-teste.md#ct-e47). Les tests de bout en bout exécutent axe-core sur chaque écran ; la checklist manuelle complète ce que l'automatisation ne voit pas. |
| <a id="rnf02"></a>RNF02 | **320 px et zoom à 400 %** | Aucun écran ne défile horizontalement à 320 px de largeur ou avec un zoom à 400 %, et rien n'est tronqué. | Essentielle | Sprint 05 · Questionnaire | Livrée | [CT-E25](casos-de-teste.md#ct-e25), [CT-E31](casos-de-teste.md#ct-e31), [CT-E36](casos-de-teste.md#ct-e36), [CT-E44](casos-de-teste.md#ct-e44), [CT-E50](casos-de-teste.md#ct-e50), [CT-M08](casos-de-teste.md#ct-m08). Dans le navigateur, zoom à 400 % sur chaque écran. |
| <a id="rnf03"></a>RNF03 | **Utilisation au clavier seul** | Chaque parcours fonctionne au clavier seul, avec le focus toujours visible, dans un ordre logique et jamais masqué par la barre ou le pied de page fixes. | Essentielle | Sprint 05 · Questionnaire | Livrée | [CT-E03](casos-de-teste.md#ct-e03), [CT-E22](casos-de-teste.md#ct-e22), [CT-E54](casos-de-teste.md#ct-e54), [CT-M07](casos-de-teste.md#ct-m07). Parcourez la création d'une étude, la réponse et l'exportation uniquement avec Tab, les flèches, Espace et Entrée. |
| <a id="rnf04"></a>RNF04 | **Lecteur d'écran** | Chaque item du questionnaire est annoncé avec son numéro, ses termes et sa position, et chaque message de résultat (« Collecte ouverte ») est annoncé par le lecteur d'écran. | Essentielle | Sprint 05 · Questionnaire | Livrée | [CT-E24](casos-de-teste.md#ct-e24), [CT-M01](casos-de-teste.md#ct-m01), [CT-M02](casos-de-teste.md#ct-m02), [CT-M04](casos-de-teste.md#ct-m04), [CT-M06](casos-de-teste.md#ct-m06). Répondez au questionnaire avec NVDA, VoiceOver ou TalkBack. |
| <a id="rnf05"></a>RNF05 | **Zone tactile** | Chaque cercle du questionnaire a une zone tactile d'au moins 44 × 44 px. | Importante | Sprint 05 · Questionnaire | Livrée | [CT-M12](casos-de-teste.md#ct-m12). Répondez sur un téléphone, avec le pouce. |
| <a id="rnf06"></a>RNF06 | **Contraste** | Tout texte a un contraste d'au moins 4,5:1, et les bordures de champ, le focus et les marqueurs de graphique, d'au moins 3:1. | Essentielle | Sprint 00 · Mise en place | Livrée | [CT-U51](casos-de-teste.md#ct-u51), [CT-U52](casos-de-teste.md#ct-u52). Test automatique de contraste des tokens de couleur. |
| <a id="rnf07"></a>RNF07 | **Information au-delà de la couleur** | Aucune information ne dépend uniquement de la couleur : les graphiques restent lisibles avec un daltonisme simulé et en contraste élevé. | Essentielle | Sprint 06 · Résultats | Livrée | [CT-E32](casos-de-teste.md#ct-e32), [CT-M09](casos-de-teste.md#ct-m09), [CT-M10](casos-de-teste.md#ct-m10). DevTools › Rendering › Emulate vision deficiencies, dans l'onglet Résultats. |
| <a id="rnf08"></a>RNF08 | **Graphiques avec équivalent textuel** | Chaque graphique a une description textuelle et un tableau visible avec les mêmes nombres. | Essentielle | Sprint 06 · Résultats | Livrée | [CT-E29](casos-de-teste.md#ct-e29), [CT-M05](casos-de-teste.md#ct-m05). Onglet Résultats : vérifiez le tableau sous chaque graphique. |

### Fidélité à l'instrument

| ID | Exigence | Description | Priorité | Sprint | Statut | Comment vérifier |
|---|---|---|---|---|---|---|
| <a id="rnf09"></a>RNF09 | **Questionnaire sans biais d'interface** | Les 7 positions ont le même poids visuel, sans numéro ni couleur graduée, aucune n'est cochée par défaut, et tous les items ont la même mise en page. | Essentielle | Sprint 05 · Questionnaire | Livrée | [CT-E24](casos-de-teste.md#ct-e24). Vérifiez les items sur ordinateur et sur téléphone. |
| <a id="rnf10"></a>RNF10 | **Termes officiels** | Les 26 paires de termes utilisent toujours la traduction officielle du pack de langues de l'UEQ, jamais une traduction automatique. | Essentielle | Sprint des langues | Livrée | [CT-U45](casos-de-teste.md#ct-u45), [CT-U46](casos-de-teste.md#ct-u46), [CT-U47](casos-de-teste.md#ct-u47). Comparez les termes du questionnaire avec le pack officiel de langues de l'UEQ. |
| <a id="rnf11"></a>RNF11 | **Calcul identique à celui du tableur officiel** | Tous les nombres de l'outil correspondent à ceux de la UEQ Data Analysis Tool, avec une tolérance de 1e-6. | Essentielle | Sprint 09 · Revue finale | Livrée | [CT-U29](casos-de-teste.md#ct-u29), [CT-E96](casos-de-teste.md#ct-e96), [CT-M15](casos-de-teste.md#ct-m15). Les 11 scénarios de data/fixtures correspondent au tableur officiel recalculé dans Excel ([vérification du calcul](verificacao-do-calculo.md#comparação-com-a-planilha-oficial)). |

### Sécurité et confidentialité

| ID | Exigence | Description | Priorité | Sprint | Statut | Comment vérifier |
|---|---|---|---|---|---|---|
| <a id="rnf12"></a>RNF12 | **Anonymat du participant** | L'outil ne recueille rien qui identifie le participant : nom, e-mail, IP, navigateur détaillé ou cookie de suivi. | Essentielle | Sprint 05 · Questionnaire | Livrée | [CT-E21](casos-de-teste.md#ct-e21). Vérifiez dans le modèle de la base que la participation n'a pas ces champs. |
| <a id="rnf13"></a>RNF13 | **Collecte minimale** | Les données démographiques sont désactivées par défaut dans chaque étude, et les participations commencées et non envoyées sont effacées sous 2 jours au plus. | Importante | LGPD | Livrée | Créez une étude et vérifiez que les données démographiques sont désactivées au départ. |
| <a id="rnf14"></a>RNF14 | **Chiffrement des données démographiques** | Les données démographiques sont enregistrées chiffrées avec AES-256-GCM, la clé étant conservée hors de la base. | Importante | LGPD | Livrée | [CT-U58](casos-de-teste.md#ct-u58). Administration › Protection des données indique si le chiffrement est activé. |
| <a id="rnf15"></a>RNF15 | **Mot de passe et session protégés** | Les mots de passe sont conservés avec bcrypt, la session utilise un cookie httpOnly, Secure et SameSite=Lax, et la base ne conserve que le hash de la session. | Essentielle | Sprint 03 · Authentification | Livrée | [CT-E10](casos-de-teste.md#ct-e10). Dans DevTools › Application › Cookies, vérifiez les attributs du cookie de session. |
| <a id="rnf16"></a>RNF16 | **Limite de tentatives de connexion** | Après 5 mots de passe erronés pour le même e-mail en 15 minutes, l'outil bloque les nouvelles tentatives pendant un certain temps. | Importante | LGPD | Livrée | [CT-E80](casos-de-teste.md#ct-e80). Saisissez un mauvais mot de passe 6 fois de suite avec le même compte. |
| <a id="rnf17"></a>RNF17 | **Accès uniquement à ses propres études** | Chaque chercheur ne voit, ne modifie et n'exporte que ses propres études et celles partagées avec lui ; même l'administrateur ne voit pas les études des autres. | Essentielle | Sprint 04 · Études | Livrée | [CT-E20](casos-de-teste.md#ct-e20), [CT-E38](casos-de-teste.md#ct-e38), [CT-E41](casos-de-teste.md#ct-e41). Avec un autre compte, ouvrez l'adresse d'une étude qui ne lui appartient pas. |
| <a id="rnf18"></a>RNF18 | **Protections du navigateur** | L'outil utilise HTTPS avec HSTS et envoie une Content Security Policy et les autres en-têtes de sécurité. | Importante | LGPD | Livrée | [CT-E73](casos-de-teste.md#ct-e73). Dans la version publiée, DevTools › Network › en-têtes de la réponse. |
| <a id="rnf19"></a>RNF19 | **Politique de confidentialité** | Une politique de confidentialité publique explique ce qui est conservé, à quelle fin et comment c'est protégé, conformément à la LGPD. | Importante | LGPD | Livrée | [CT-E74](casos-de-teste.md#ct-e74), [CT-E75](casos-de-teste.md#ct-e75), [CT-E76](casos-de-teste.md#ct-e76), [CT-E77](casos-de-teste.md#ct-e77), [CT-E78](casos-de-teste.md#ct-e78), [CT-E79](casos-de-teste.md#ct-e79), [CT-E82](casos-de-teste.md#ct-e82), [CT-E83](casos-de-teste.md#ct-e83), [CT-M23](casos-de-teste.md#ct-m23), [CT-M25](casos-de-teste.md#ct-m25). Ouvrez http://localhost:3000/privacidade. |

### Utilisabilité

| ID | Exigence | Description | Priorité | Sprint | Statut | Comment vérifier |
|---|---|---|---|---|---|---|
| <a id="rnf20"></a>RNF20 | **Retour sur chaque action** | Chaque action du chercheur confirme le résultat et sa conséquence dans un message annoncé (« Collecte ouverte. Le lien accepte déjà les réponses. »). | Importante | Sprint 04 · Études | Livrée | [CT-E09](casos-de-teste.md#ct-e09), [CT-E15](casos-de-teste.md#ct-e15), [CT-E16](casos-de-teste.md#ct-e16), [CT-M06](casos-de-teste.md#ct-m06). Ouvrez la collecte d'une étude et lisez le message. |
| <a id="rnf21"></a>RNF21 | **Confirmation avant toute perte de données** | La déconnexion et toute suppression demandent une confirmation en indiquant ce qui va se passer, et supprimer un compte ou une étude exige de saisir l'e-mail ou le titre. | Importante | Sprint 04 · Études | Livrée | [CT-E11](casos-de-teste.md#ct-e11), [CT-E19](casos-de-teste.md#ct-e19), [CT-E27](casos-de-teste.md#ct-e27). Essayez de supprimer une étude. |
| <a id="rnf22"></a>RNF22 | **Format brésilien des nombres et des dates** | En portugais, les nombres utilisent la virgule décimale et les dates le format jj/mm/aaaa, à l'écran et dans les exportations. | Importante | Sprint 06 · Résultats | Livrée | [CT-U33](casos-de-teste.md#ct-u33), [CT-U44](casos-de-teste.md#ct-u44). Onglet Résultats et CSV des résultats. |

### Plateforme et maintenance

| ID | Exigence | Description | Priorité | Sprint | Statut | Comment vérifier |
|---|---|---|---|---|---|---|
| <a id="rnf23"></a>RNF23 | **Ordinateur et téléphone** | L'outil fonctionne dans le navigateur de l'ordinateur et du téléphone ; chaque test de bout en bout s'exécute sur les deux. | Essentielle | Sprint 00 · Mise en place | Livrée | [CT-M12](casos-de-teste.md#ct-m12). Ouvrez le lien du participant sur un téléphone. |
| <a id="rnf24"></a>RNF24 | **Application web open source** | L'outil est une application web (Next.js et PostgreSQL), dont le code est sur GitHub sous licence MIT. | Essentielle | Sprint 00 · Mise en place | Livrée | [CT-M19](casos-de-teste.md#ct-m19). Dans un clone propre, suivez la section Como rodar (Comment l'exécuter) du README. |
| <a id="rnf25"></a>RNF25 | **Calcul isolé et testé** | Le calcul de l'UEQ se trouve dans un module de fonctions pures (src/ueq), sans base de données ni interface, couvert par des tests unitaires. | Importante | Sprint 02 · Calcul | Livrée | [CT-U01](casos-de-teste.md#ct-u01), [CT-U12](casos-de-teste.md#ct-u12), [CT-U14](casos-de-teste.md#ct-u14), [CT-U22](casos-de-teste.md#ct-u22). Terminal : pnpm test. |
| <a id="rnf26"></a>RNF26 | **Vérifications avant intégration** | Aucune pull request n'entre dans main sans que le lint, la vérification des types et les tests unitaires passent. | Importante | Sprint 00 · Mise en place | Livrée | Terminal : pnpm lint && pnpm typecheck && pnpm test. |

## Résumé

| Type | Essentielle | Importante | Souhaitable | Livrée | En attente | Supprimée | Total |
|---|---|---|---|---|---|---|---|
| Fonctionnelle | 31 | 20 | 17 | 68 | 0 | 0 | 68 |
| Non fonctionnelle | 15 | 11 | 0 | 26 | 0 | 0 | 26 |
| Total | 46 | 31 | 17 | 94 | 0 | 0 | 94 |
