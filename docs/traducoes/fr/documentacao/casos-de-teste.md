# Cas et scénarios de test

Les tests qui existent déjà dans l'Outil UEQ, organisés en **25 scénarios** et **206 cas de test** : 102 de bout en bout, 78 unitaires et 26 manuels. Chaque cas indique le fichier du test, les exigences qu'il vérifie et le résultat de la dernière exécution.

La même liste se trouve dans [casos-de-teste.csv](casos-de-teste.csv). Chaque scénario et chaque cas citent les [exigences](requisitos.md) qu'ils vérifient ; le chemin inverse, de chaque exigence vers les cas qui la prouvent, se trouve dans la [matrice de traçabilité](matriz-rastreabilidade.md).

## Exécution du 18/11/2026

| Niveau | Outil | Cas | Exécutions | Réussies | Ignorées | Échouées |
|---|---|---|---|---|---|---|
| De bout en bout | Playwright 1.64 + axe-core 4.14 | 102 | 224 | 221 | 3 | 0 |
| Unitaire | Vitest 5 | 78 | 538 | 538 | 0 | 0 |
| Manuel | Personnes et Excel | 26 | 2 | 2 | — | — |

- **De bout en bout :** chaque cas s'exécute deux fois, dans Chrome sur ordinateur et dans Chrome sur mobile (Pixel 7) ; le [CT-E96](#ct-e96) et le [CT-E98](#ct-e98) s'exécutent une fois par scénario dans chacun. La suite entière a réussi du premier coup (217 exécutions, aucun échec) ; le [CT-E101](#ct-e101), écrit ensuite pour les critères AA sur les écrans de l'UEQ-S, a réussi dans les deux projets avec les autres cas de l'UEQ-S. Après les termes officiels de l'UEQ-S par langue, la suite entière a été relancée avec le [CT-E102](#ct-e102) : 221 exécutions ont réussi, aucune n'a échoué. Les exécutions ignorées le sont volontairement : le [CT-E62](casos-de-teste.md#ct-e62) ne s'exécute que lorsqu'un document est en production, et aujourd'hui tous sont publiés ; le [CT-E67](casos-de-teste.md#ct-e67) ne s'exécute que sur ordinateur.
- **Unitaire :** certains cas sont paramétrés (un par langue, un par paire de couleurs, un par scénario du tableur officiel), d'où davantage d'exécutions que de cas. Aucun cas n'est ignoré : ceux de l'UEQ-S ([CT-U53](#ct-u53)) s'exécutent désormais avec les items et la référence officiels dans `data/`.
- **Manuel :** parmi les cas manuels, seuls le [CT-M15](#ct-m15) et le [CT-M26](#ct-m26) ont été exécutés, avec Excel automatisé par `scripts/planilha-oficial.ps1` et `scripts/planilha-oficial-ueq-s.ps1` ; les 24 autres n'ont pas été exécutés lors de cette session ([Limitations](#limitações)).
- **Environnement :** serveur de développement et PostgreSQL local. L'exécution ne sollicite ni la production sur Vercel, ni l'API de Claude, ni l'envoi d'e-mails.

## Stratégie

### Niveaux

| Niveau | Ce qu'il vérifie | Où il se trouve | Comment il s'exécute |
|---|---|---|---|
| Unitaire | Fonctions pures : calcul de l'UEQ, règles de suspicion, CSV, importation, lecture rapide, langues, contraste des couleurs, chiffrement, modèle d'e-mail, catalogue de textes, relecture de la traduction automatique (avec l'API simulée) et documentation | `src/**/__tests__/*.test.ts` | `pnpm test` (Vitest, environnement Node, sans base de données) |
| De bout en bout | L'outil entier dans le navigateur, tel que la personne l'utilise : écrans, base de données, cookies, téléchargements et accessibilité | `tests/e2e/*.spec.ts` | `pnpm test:e2e` (Playwright, avec base de données et serveur) |
| Accessibilité automatique | Violations WCAG 2.2 A et AA sur chaque écran et dans chaque état d'erreur | `tests/e2e/acessibilidade.ts` (`verificarAcessibilidade`) | Au sein des tests de bout en bout |
| Manuel | Ce que l'automatisation ne voit pas : lecteur d'écran réel, téléphone réel, zoom, espacement du texte, compréhension et opinion des utilisateurs | [docs/checklist-manual.md](../checklist-manual.md), [docs/roteiro-revisao.md](../roteiro-revisao.md) | Par l'équipe, avant la livraison |

### Environnement et données

- **Projets Playwright :** `desktop` (Desktop Chrome) et `celular` (Pixel 7). Tout cas de bout en bout s'exécute dans les deux.
- **Serveur :** Playwright lance `pnpm dev` sur http://localhost:3000 ou réutilise celui qui est déjà en cours d'exécution. La base de données est le PostgreSQL du `docker compose`.
- **Isolation :** chaque cas crée son propre chercheur, avec une adresse e-mail en `@e2e.exemplo.com`, et sa propre étude. Les cas s'exécutent donc en parallèle (4 workers) sans dépendre les uns des autres. À la fin, `tests/e2e/limpeza.ts` supprime uniquement les comptes de ce domaine, jamais le compte de développement.
- **Jeu de données :** les 11 scénarios de [data/fixtures/](../../data/fixtures/LEIA-ME.md), au format du tableur officiel et avec les résultats du tableur officiel dans `esperado.json` : `basico` (20 participants, aucun suspect), `inconsistente` (15, avec les lignes 1, 6, 9 et 13 suspectes), `extremos` (tous 1, tous 7, n = 1 et n = 2), `oficial-exemplo` (les 255 du tableur lui-même), `grande` (1000), `bordas` (les limites des règles de suspicion), `variancia-zero` et `negativo`. Les tests du tableau de bord écrivent les fixtures directement dans la base (`inserirRespostas` dans `tests/e2e/preparacao.ts`), car le parcours du participant a ses propres cas. Pour l'UEQ-S, les 9 scénarios de [data/fixtures-ueq-s/](../../data/fixtures-ueq-s/LEIA-ME.md), avec les résultats du tableur officiel de l'UEQ-S, dont deux tirés de scénarios de l'UEQ complet.
- **Délais :** 15 s d'attente par vérification et 60 s par test (120 s pour ceux qui créent une étude et des réponses), car le serveur de développement compile chaque route lors de la première visite.

### Critères

- Aucune pull request n'est intégrée sans que `pnpm lint && pnpm typecheck && pnpm test` réussisse.
- Un écran n'est prêt que lorsque axe-core ne trouve aucune violation WCAG 2.2 A ou AA, y compris dans les états d'erreur.
- Les chiffres du calcul doivent concorder avec le tableur officiel avec une tolérance de 1e-6.
- Le nom d'un test est la phrase du comportement attendu, en portugais ([docs/codigo.md](../codigo.md)). Le titre dans le code est donc aussi le résultat attendu de chaque cas unitaire.

### Comment l'exécuter

```
docker compose up -d        # banco
pnpm test                   # unidade
pnpm test:e2e               # ponta a ponta, desktop e celular
pnpm exec playwright test tests/e2e/questionario.spec.ts --project=celular   # um arquivo, um projeto
pnpm exec playwright show-report   # relatório com as capturas de daltonismo do CT-E32
```

## Scénarios

| ID | Scénario | Objectif | Exigences | Cas de test | Situation |
|---|---|---|---|---|---|
| <a id="cn01"></a>CN01 | **Accès et authentification** | S'inscrire, se connecter, se déconnecter et protéger l'espace du chercheur, au clavier seul et sans violation d'accessibilité | [RF01](requisitos.md#rf01), [RF02](requisitos.md#rf02), [RF03](requisitos.md#rf03), [RF11](requisitos.md#rf11), [RNF01](requisitos.md#rnf01), [RNF03](requisitos.md#rnf03), [RNF20](requisitos.md#rnf20) | [CT-E01](casos-de-teste.md#ct-e01), [CT-E02](casos-de-teste.md#ct-e02), [CT-E03](casos-de-teste.md#ct-e03), [CT-E04](casos-de-teste.md#ct-e04), [CT-E06](casos-de-teste.md#ct-e06), [CT-E07](casos-de-teste.md#ct-e07), [CT-E08](casos-de-teste.md#ct-e08), [CT-E90](casos-de-teste.md#ct-e90) | Réussi |
| <a id="cn02"></a>CN02 | **Mon compte** | Modifier les données, changer le mot de passe en fermant les autres sessions et supprimer le compte avec confirmation | [RF04](requisitos.md#rf04), [RF05](requisitos.md#rf05), [RF06](requisitos.md#rf06), [RNF15](requisitos.md#rnf15), [RNF20](requisitos.md#rnf20), [RNF21](requisitos.md#rnf21) | [CT-E09](casos-de-teste.md#ct-e09), [CT-E10](casos-de-teste.md#ct-e10), [CT-E11](casos-de-teste.md#ct-e11) | Réussi |
| <a id="cn03"></a>CN03 | **Gestion des études** | Créer, lister, modifier, ouvrir, clôturer, rouvrir, copier le lien et supprimer des études | [RF12](requisitos.md#rf12), [RF13](requisitos.md#rf13), [RF14](requisitos.md#rf14), [RF15](requisitos.md#rf15), [RF16](requisitos.md#rf16), [RF17](requisitos.md#rf17), [RNF01](requisitos.md#rnf01), [RNF20](requisitos.md#rnf20), [RNF21](requisitos.md#rnf21) | [CT-E12](casos-de-teste.md#ct-e12), [CT-E13](casos-de-teste.md#ct-e13), [CT-E14](casos-de-teste.md#ct-e14), [CT-E15](casos-de-teste.md#ct-e15), [CT-E16](casos-de-teste.md#ct-e16), [CT-E17](casos-de-teste.md#ct-e17), [CT-E18](casos-de-teste.md#ct-e18), [CT-E19](casos-de-teste.md#ct-e19), [CT-E88](casos-de-teste.md#ct-e88), [CT-E89](casos-de-teste.md#ct-e89), [CT-E93](casos-de-teste.md#ct-e93) | Réussi |
| <a id="cn04"></a>CN04 | **Isolation et protection des données** | Garantir qu'un chercheur ne voie ni n'exporte l'étude d'un autre et que le participant n'ait jamais besoin de session | [RF24](requisitos.md#rf24), [RF60](requisitos.md#rf60), [RNF17](requisitos.md#rnf17) | [CT-E05](casos-de-teste.md#ct-e05), [CT-E20](casos-de-teste.md#ct-e20), [CT-E38](casos-de-teste.md#ct-e38), [CT-E41](casos-de-teste.md#ct-e41) | Réussi |
| <a id="cn05"></a>CN05 | **Participation à l'étude** | Parcourir le lien du participant du consentement à la fin, y compris refuser, abandonner, recharger et tenter de répondre à nouveau | [RF18](requisitos.md#rf18), [RF24](requisitos.md#rf24), [RF25](requisitos.md#rf25), [RF26](requisitos.md#rf26), [RF27](requisitos.md#rf27), [RF29](requisitos.md#rf29), [RF30](requisitos.md#rf30), [RF31](requisitos.md#rf31), [RF32](requisitos.md#rf32), [RF33](requisitos.md#rf33), [RF34](requisitos.md#rf34), [RNF01](requisitos.md#rnf01), [RNF12](requisitos.md#rnf12), [RNF19](requisitos.md#rnf19), [RNF21](requisitos.md#rnf21) | [CT-U30](casos-de-teste.md#ct-u30), [CT-E21](casos-de-teste.md#ct-e21), [CT-E23](casos-de-teste.md#ct-e23), [CT-E26](casos-de-teste.md#ct-e26), [CT-E27](casos-de-teste.md#ct-e27), [CT-E28](casos-de-teste.md#ct-e28), [CT-E52](casos-de-teste.md#ct-e52), [CT-E71](casos-de-teste.md#ct-e71), [CT-E82](casos-de-teste.md#ct-e82), [CT-E83](casos-de-teste.md#ct-e83), [CT-E91](casos-de-teste.md#ct-e91) | Réussi |
| <a id="cn06"></a>CN06 | **Accessibilité du questionnaire** | Répondre au clavier seul et avec un lecteur d'écran, en 320 px, avec un focus toujours visible et l'instrument intact | [RF27](requisitos.md#rf27), [RF28](requisitos.md#rf28), [RNF02](requisitos.md#rnf02), [RNF03](requisitos.md#rnf03), [RNF04](requisitos.md#rnf04), [RNF09](requisitos.md#rnf09) | [CT-E22](casos-de-teste.md#ct-e22), [CT-E24](casos-de-teste.md#ct-e24), [CT-E25](casos-de-teste.md#ct-e25) | Réussi |
| <a id="cn07"></a>CN07 | **Langues** | Répondre dans une autre langue, par le navigateur ou par le sélecteur, y compris de droite à gauche, et le chercheur voit la langue | [RF19](requisitos.md#rf19), [RF30](requisitos.md#rf30), [RF34](requisitos.md#rf34), [RF52](requisitos.md#rf52), [RF61](requisitos.md#rf61), [RNF04](requisitos.md#rnf04), [RNF10](requisitos.md#rnf10) | [CT-U36](casos-de-teste.md#ct-u36), [CT-U45](casos-de-teste.md#ct-u45), [CT-U46](casos-de-teste.md#ct-u46), [CT-U47](casos-de-teste.md#ct-u47), [CT-U48](casos-de-teste.md#ct-u48), [CT-U49](casos-de-teste.md#ct-u49), [CT-U50](casos-de-teste.md#ct-u50), [CT-E45](casos-de-teste.md#ct-e45), [CT-E46](casos-de-teste.md#ct-e46), [CT-E68](casos-de-teste.md#ct-e68) | Réussi |
| <a id="cn08"></a>CN08 | **Calcul UEQ** | Vérifier le recodage, les statistiques, les échelles, l'alpha, la référence et les groupes dans des fonctions pures, avec les cas limites | [RF27](requisitos.md#rf27), [RF36](requisitos.md#rf36), [RF37](requisitos.md#rf37), [RF38](requisitos.md#rf38), [RF39](requisitos.md#rf39), [RF40](requisitos.md#rf40), [RF41](requisitos.md#rf41), [RF42](requisitos.md#rf42), [RF45](requisitos.md#rf45), [RNF10](requisitos.md#rnf10), [RNF25](requisitos.md#rnf25) | [CT-U01](casos-de-teste.md#ct-u01), [CT-U02](casos-de-teste.md#ct-u02), [CT-U03](casos-de-teste.md#ct-u03), [CT-U04](casos-de-teste.md#ct-u04), [CT-U05](casos-de-teste.md#ct-u05), [CT-U06](casos-de-teste.md#ct-u06), [CT-U07](casos-de-teste.md#ct-u07), [CT-U08](casos-de-teste.md#ct-u08), [CT-U09](casos-de-teste.md#ct-u09), [CT-U10](casos-de-teste.md#ct-u10), [CT-U11](casos-de-teste.md#ct-u11), [CT-U12](casos-de-teste.md#ct-u12), [CT-U13](casos-de-teste.md#ct-u13), [CT-U14](casos-de-teste.md#ct-u14), [CT-U15](casos-de-teste.md#ct-u15), [CT-U16](casos-de-teste.md#ct-u16), [CT-U17](casos-de-teste.md#ct-u17), [CT-U18](casos-de-teste.md#ct-u18), [CT-U20](casos-de-teste.md#ct-u20), [CT-U21](casos-de-teste.md#ct-u21), [CT-U22](casos-de-teste.md#ct-u22), [CT-M17](casos-de-teste.md#ct-m17) | Réussi, avec des points en attente |
| <a id="cn09"></a>CN09 | **Réponses suspectes** | Détecter les suspicions selon les deux règles, les examiner et les retirer de l'analyse sans les supprimer | [RF42](requisitos.md#rf42), [RF51](requisitos.md#rf51), [RF52](requisitos.md#rf52), [RF53](requisitos.md#rf53), [RF54](requisitos.md#rf54), [RF55](requisitos.md#rf55), [RNF02](requisitos.md#rnf02) | [CT-U19](casos-de-teste.md#ct-u19), [CT-U23](casos-de-teste.md#ct-u23), [CT-U24](casos-de-teste.md#ct-u24), [CT-U25](casos-de-teste.md#ct-u25), [CT-U26](casos-de-teste.md#ct-u26), [CT-U27](casos-de-teste.md#ct-u27), [CT-U28](casos-de-teste.md#ct-u28), [CT-E33](casos-de-teste.md#ct-e33), [CT-E34](casos-de-teste.md#ct-e34), [CT-E35](casos-de-teste.md#ct-e35), [CT-E36](casos-de-teste.md#ct-e36), [CT-M16](casos-de-teste.md#ct-m16) | Réussi, avec des points en attente |
| <a id="cn10"></a>CN10 | **Tableau de bord des résultats** | Afficher les chiffres du module UEQ, comparer les versions, conserver la vue dans l'URL et fonctionner avec le daltonisme, le contraste élevé et 320 px | [RF43](requisitos.md#rf43), [RF44](requisitos.md#rf44), [RF45](requisitos.md#rf45), [RF46](requisitos.md#rf46), [RF47](requisitos.md#rf47), [RF48](requisitos.md#rf48), [RF50](requisitos.md#rf50), [RNF02](requisitos.md#rnf02), [RNF07](requisitos.md#rnf07), [RNF08](requisitos.md#rnf08), [RNF22](requisitos.md#rnf22) | [CT-U42](casos-de-teste.md#ct-u42), [CT-U43](casos-de-teste.md#ct-u43), [CT-U44](casos-de-teste.md#ct-u44), [CT-E29](casos-de-teste.md#ct-e29), [CT-E30](casos-de-teste.md#ct-e30), [CT-E31](casos-de-teste.md#ct-e31), [CT-E32](casos-de-teste.md#ct-e32), [CT-E72](casos-de-teste.md#ct-e72), [CT-U60](casos-de-teste.md#ct-u60) | Réussi |
| <a id="cn11"></a>CN11 | **Exportation en CSV** | Télécharger les trois CSV avec un nom daté, le BOM et le format de chacun, ainsi que le tableur officiel en XLSX | [RF56](requisitos.md#rf56), [RF57](requisitos.md#rf57), [RF58](requisitos.md#rf58), [RF59](requisitos.md#rf59), [RNF22](requisitos.md#rnf22) | [CT-U31](casos-de-teste.md#ct-u31), [CT-U32](casos-de-teste.md#ct-u32), [CT-U33](casos-de-teste.md#ct-u33), [CT-U34](casos-de-teste.md#ct-u34), [CT-U35](casos-de-teste.md#ct-u35), [CT-U37](casos-de-teste.md#ct-u37), [CT-U38](casos-de-teste.md#ct-u38), [CT-E37](casos-de-teste.md#ct-e37) | Réussi |
| <a id="cn12"></a>CN12 | **Tableau de bord en PDF** | Télécharger le tableau de bord en PDF et vérifier la page d'impression | [RF60](requisitos.md#rf60) | [CT-E39](casos-de-teste.md#ct-e39), [CT-E40](casos-de-teste.md#ct-e40) | Réussi |
| <a id="cn13"></a>CN13 | **Importation par CSV** | Importer des réponses avec aperçu, refuser un fichier en erreur et marquer les réponses importées | [RF61](requisitos.md#rf61), [RNF02](requisitos.md#rnf02) | [CT-U39](casos-de-teste.md#ct-u39), [CT-U40](casos-de-teste.md#ct-u40), [CT-U41](casos-de-teste.md#ct-u41), [CT-E42](casos-de-teste.md#ct-e42), [CT-E43](casos-de-teste.md#ct-e43), [CT-E44](casos-de-teste.md#ct-e44) | Réussi |
| <a id="cn14"></a>CN14 | **Couleurs et contraste** | Garantir le contraste de toutes les paires de couleurs du thème | [RNF06](requisitos.md#rnf06), [RNF07](requisitos.md#rnf07) | [CT-U51](casos-de-teste.md#ct-u51), [CT-U52](casos-de-teste.md#ct-u52) | Réussi |
| <a id="cn15"></a>CN15 | **Validation par rapport au tableur officiel** | Comparer chaque chiffre de l'outil avec l'UEQ Data Analysis Tool, avec une tolérance de 1e-6, et vérifier que le tableur exporté par l'outil est bien le tableur officiel rempli | [RF59](requisitos.md#rf59), [RNF11](requisitos.md#rnf11) | [CT-U29](casos-de-teste.md#ct-u29), [CT-U70](casos-de-teste.md#ct-u70), [CT-E96](casos-de-teste.md#ct-e96), [CT-M15](casos-de-teste.md#ct-m15) | Réussi |
| <a id="cn16"></a>CN16 | **UEQ-S** | Choisir l'UEQ-S à la création de l'étude en sachant ce qui change, répondre aux 8 paires, voir l'évaluation dans l'onglet UEQ-S, exporter le tableur officiel de l'UEQ-S et comparer chaque chiffre avec lui, y compris à partir d'une étude de l'UEQ complet | [RF62](requisitos.md#rf62), [RNF01](requisitos.md#rnf01), [RNF02](requisitos.md#rnf02), [RNF03](requisitos.md#rnf03), [RNF11](requisitos.md#rnf11) | [CT-U53](casos-de-teste.md#ct-u53), [CT-U71](casos-de-teste.md#ct-u71), [CT-U72](casos-de-teste.md#ct-u72), [CT-U73](casos-de-teste.md#ct-u73), [CT-U74](casos-de-teste.md#ct-u74), [CT-U75](casos-de-teste.md#ct-u75), [CT-U76](casos-de-teste.md#ct-u76), [CT-U77](casos-de-teste.md#ct-u77), [CT-E97](casos-de-teste.md#ct-e97), [CT-E98](casos-de-teste.md#ct-e98), [CT-E99](casos-de-teste.md#ct-e99), [CT-E100](casos-de-teste.md#ct-e100), [CT-E101](casos-de-teste.md#ct-e101), [CT-E102](casos-de-teste.md#ct-e102), [CT-M26](casos-de-teste.md#ct-m26) | Réussi |
| <a id="cn18"></a>CN18 | **Documentation dans l'outil** | Naviguer dans les sections et les documents avec et sans compte, suivre les liens et les ancres, voir les diagrammes et télécharger les fichiers, sans violation d'accessibilité | [RF63](requisitos.md#rf63), [RF64](requisitos.md#rf64), [RF65](requisitos.md#rf65), [RNF01](requisitos.md#rnf01), [RNF02](requisitos.md#rnf02) | [CT-U54](casos-de-teste.md#ct-u54), [CT-U55](casos-de-teste.md#ct-u55), [CT-U56](casos-de-teste.md#ct-u56), [CT-U57](casos-de-teste.md#ct-u57), [CT-E47](casos-de-teste.md#ct-e47), [CT-E48](casos-de-teste.md#ct-e48), [CT-E49](casos-de-teste.md#ct-e49), [CT-E50](casos-de-teste.md#ct-e50), [CT-E51](casos-de-teste.md#ct-e51), [CT-E57](casos-de-teste.md#ct-e57), [CT-E62](casos-de-teste.md#ct-e62), [CT-E84](casos-de-teste.md#ct-e84), [CT-E85](casos-de-teste.md#ct-e85), [CT-E86](casos-de-teste.md#ct-e86), [CT-E87](casos-de-teste.md#ct-e87), [CT-U64](casos-de-teste.md#ct-u64), [CT-U65](casos-de-teste.md#ct-u65) | Réussi |
| <a id="cn19"></a>CN19 | **Navigation et barre fixe** | Garder la barre supérieure visible pendant le défilement, sans masquer le focus ni les ancres, avec un menu sur mobile | [RNF03](requisitos.md#rnf03), [RNF23](requisitos.md#rnf23) | [CT-E53](casos-de-teste.md#ct-e53), [CT-E54](casos-de-teste.md#ct-e54), [CT-E55](casos-de-teste.md#ct-e55), [CT-E56](casos-de-teste.md#ct-e56) | Réussi |
| <a id="cn20"></a>CN20 | **Page d'accueil et fenêtres** | Présenter l'outil à qui n'a pas de compte, ouvrir Se connecter et Créer un compte dans une fenêtre sans défilement, fermer en rendant le focus et fournir l'icône du site | [RF02](requisitos.md#rf02), [RF11](requisitos.md#rf11) | [CT-E58](casos-de-teste.md#ct-e58), [CT-E59](casos-de-teste.md#ct-e59), [CT-E60](casos-de-teste.md#ct-e60), [CT-E61](casos-de-teste.md#ct-e61), [CT-E69](casos-de-teste.md#ct-e69), [CT-E70](casos-de-teste.md#ct-e70) | Réussi |
| <a id="cn21"></a>CN21 | **Équipe et notifications** | Inviter par e-mail, accepter via la cloche, limiter ce que fait le lecteur et prévenir l'équipe | [RF20](requisitos.md#rf20), [RF21](requisitos.md#rf21), [RF22](requisitos.md#rf22), [RF23](requisitos.md#rf23), [RNF03](requisitos.md#rnf03) | [CT-U59](casos-de-teste.md#ct-u59), [CT-E63](casos-de-teste.md#ct-e63), [CT-E64](casos-de-teste.md#ct-e64) | Réussi |
| <a id="cn22"></a>CN22 | **Apprendre à utiliser** | Expliquer chaque page dans l'aide (?) et guider la première connexion avec une visite qui peut être ignorée | [RF09](requisitos.md#rf09), [RF10](requisitos.md#rf10) | [CT-E65](casos-de-teste.md#ct-e65), [CT-E66](casos-de-teste.md#ct-e66) | Réussi |
| <a id="cn23"></a>CN23 | **Protection des données** | Respecter la LGPD dans l'interface et sur le serveur : politique publique, en-têtes, chiffrement, limite de tentatives et téléchargement des données | [RF07](requisitos.md#rf07), [RF25](requisitos.md#rf25), [RNF01](requisitos.md#rnf01), [RNF02](requisitos.md#rnf02), [RNF14](requisitos.md#rnf14), [RNF16](requisitos.md#rnf16), [RNF18](requisitos.md#rnf18), [RNF19](requisitos.md#rnf19) | [CT-U58](casos-de-teste.md#ct-u58), [CT-E73](casos-de-teste.md#ct-e73), [CT-E74](casos-de-teste.md#ct-e74), [CT-E75](casos-de-teste.md#ct-e75), [CT-E76](casos-de-teste.md#ct-e76), [CT-E77](casos-de-teste.md#ct-e77), [CT-E78](casos-de-teste.md#ct-e78), [CT-E79](casos-de-teste.md#ct-e79), [CT-E80](casos-de-teste.md#ct-e80), [CT-E81](casos-de-teste.md#ct-e81), [CT-E92](casos-de-teste.md#ct-e92), [CT-U69](casos-de-teste.md#ct-u69) | Réussi |
| <a id="cn24"></a>CN24 | **Langue de l'outil** | Choisir la langue à la création du compte, la changer dans Mon compte et maintenir le catalogue de textes à jour | [RF08](requisitos.md#rf08), [RF35](requisitos.md#rf35) | [CT-U62](casos-de-teste.md#ct-u62), [CT-U63](casos-de-teste.md#ct-u63), [CT-U66](casos-de-teste.md#ct-u66), [CT-U67](casos-de-teste.md#ct-u67), [CT-U68](casos-de-teste.md#ct-u68), [CT-U78](casos-de-teste.md#ct-u78), [CT-E67](casos-de-teste.md#ct-e67), [CT-E94](casos-de-teste.md#ct-e94), [CT-E95](casos-de-teste.md#ct-e95) | Réussi |
| <a id="cn25"></a>CN25 | **Scénarios de démonstration** | Générer des réponses synthétiques cohérentes avec le profil de chaque scénario | [RF67](requisitos.md#rf67) | [CT-U61](casos-de-teste.md#ct-u61) | Réussi |
| <a id="cn17"></a>CN17 | **Vérification manuelle avec des personnes** | Ce que l'automatisation ne voit pas : lecteur d'écran réel, téléphone réel, zoom, espacement du texte, évaluation heuristique et test avec des utilisateurs | [RF09](requisitos.md#rf09), [RF13](requisitos.md#rf13), [RF22](requisitos.md#rf22), [RF24](requisitos.md#rf24), [RF25](requisitos.md#rf25), [RF27](requisitos.md#rf27), [RF28](requisitos.md#rf28), [RF29](requisitos.md#rf29), [RF34](requisitos.md#rf34), [RF43](requisitos.md#rf43), [RNF01](requisitos.md#rnf01), [RNF02](requisitos.md#rnf02), [RNF03](requisitos.md#rnf03), [RNF04](requisitos.md#rnf04), [RNF05](requisitos.md#rnf05), [RNF06](requisitos.md#rnf06), [RNF07](requisitos.md#rnf07), [RNF08](requisitos.md#rnf08), [RNF19](requisitos.md#rnf19), [RNF20](requisitos.md#rnf20), [RNF21](requisitos.md#rnf21), [RNF23](requisitos.md#rnf23), [RNF24](requisitos.md#rnf24) | [CT-M01](casos-de-teste.md#ct-m01), [CT-M02](casos-de-teste.md#ct-m02), [CT-M03](casos-de-teste.md#ct-m03), [CT-M04](casos-de-teste.md#ct-m04), [CT-M05](casos-de-teste.md#ct-m05), [CT-M06](casos-de-teste.md#ct-m06), [CT-M07](casos-de-teste.md#ct-m07), [CT-M08](casos-de-teste.md#ct-m08), [CT-M09](casos-de-teste.md#ct-m09), [CT-M10](casos-de-teste.md#ct-m10), [CT-M11](casos-de-teste.md#ct-m11), [CT-M12](casos-de-teste.md#ct-m12), [CT-M13](casos-de-teste.md#ct-m13), [CT-M14](casos-de-teste.md#ct-m14), [CT-M18](casos-de-teste.md#ct-m18), [CT-M19](casos-de-teste.md#ct-m19), [CT-M20](casos-de-teste.md#ct-m20), [CT-M21](casos-de-teste.md#ct-m21), [CT-M22](casos-de-teste.md#ct-m22), [CT-M23](casos-de-teste.md#ct-m23), [CT-M24](casos-de-teste.md#ct-m24), [CT-M25](casos-de-teste.md#ct-m25) | Manuel, non exécuté |

## Cas de bout en bout

Chaque cas est un `test(...)` de Playwright. Le titre dans le code est ce qui apparaît dans le rapport.

### CT-E01

**Une personne qui ouvre l'outil sans compte voit la page d'accueil, qui explique ce qu'il fait.**

| Champ | Valeur |
|---|---|
| Scénario | [CN01 · Accès et authentification](#cn01) |
| Test | `tests/e2e/inicial.spec.ts` › "a raiz apresenta a ferramenta para quem não tem sessão e passa no axe" |
| Préconditions | Navigateur sans cookie de session. |
| Exigences | [RF11](requisitos.md#rf11), [RNF01](requisitos.md#rnf01) |
| Résultat au 18/11/2026 | Réussi (mobile et ordinateur) |

Étapes :

1. Ouvrir /.
2. Ouvrir le menu, si l'écran est étroit.
3. Lancer axe.

Résultat attendu : L'URL reste /. Le h1 est « Estudos de experiência do usuário com o UEQ » (Études d'expérience utilisateur avec l'UEQ) et les sections Qu'est-ce que l'UEQ, Comment lire les résultats, Comment ça fonctionne, Études sur la méthode et Crédits apparaissent, avec les groupes Attractivité, Qualité pragmatique et Qualité hédonique. La barre contient Documentation (sans aria-current) et le bouton Se connecter, et aucun Études. Zéro violation.

### CT-E02

**Le lien pour passer les blocs est le premier élément pouvant recevoir le focus.**

| Champ | Valeur |
|---|---|
| Scénario | [CN01 · Accès et authentification](#cn01) |
| Test | `tests/e2e/inicial.spec.ts` › "o primeiro Tab leva ao link de pular para o conteúdo" |
| Préconditions | Page d'accueil (/) ouverte. |
| Exigences | [RNF03](requisitos.md#rnf03) |
| Résultat au 18/11/2026 | Réussi (mobile et ordinateur) |

Étapes :

1. Appuyer sur Tab.
2. Appuyer sur Entrée.

Résultat attendu : Le premier Tab place le focus sur « Aller au contenu » ; Entrée déplace le focus vers main#conteudo.

### CT-E03

**S'inscrire, se déconnecter et se reconnecter fonctionne au clavier seul.**

| Champ | Valeur |
|---|---|
| Scénario | [CN01 · Accès et authentification](#cn01) |
| Test | `tests/e2e/autenticacao.spec.ts` › "cadastra, sai e entra de novo usando só o teclado" |
| Préconditions | Nouvelle adresse e-mail de test. |
| Exigences | [RF01](requisitos.md#rf01), [RF02](requisitos.md#rf02), [RNF03](requisitos.md#rnf03) |
| Résultat au 18/11/2026 | Réussi (mobile et ordinateur) |

Étapes :

1. Sur /cadastrar, atteindre chaque champ de la fenêtre avec Tab et saisir le nom, l'e-mail et le mot de passe.
2. Appuyer sur Entrée.
3. Atteindre avec Tab le bouton Déconnexion et appuyer sur Entrée.
4. Dans la fenêtre de confirmation, appuyer sur Entrée.
5. Sur la page d'accueil, atteindre avec Tab le bouton Se connecter de la barre, appuyer sur Entrée et se connecter au clavier seul.

Résultat attendu : Après l'inscription, « Vos études » apparaît. Déconnexion ouvre la fenêtre « Se déconnecter du compte ? » avec le focus sur le bouton Déconnexion ; confirmer mène à /?aviso=saiu avec « Vous êtes déconnecté de votre compte. » dans role=status. Se connecter ouvre la fenêtre avec le focus sur E-mail, et la nouvelle connexion se termine sur la page d'accueil.

### CT-E04

**La page demandée sans session est reprise après la connexion.**

| Champ | Valeur |
|---|---|
| Scénario | [CN01 · Accès et authentification](#cn01) |
| Test | `tests/e2e/autenticacao.spec.ts` › "rota protegida sem sessão vai para Entrar e volta para ela depois do login" |
| Préconditions | Compte créé ; cookies supprimés. |
| Exigences | [RF03](requisitos.md#rf03) |
| Résultat au 18/11/2026 | Réussi (mobile et ordinateur) |

Étapes :

1. Ouvrir /conta.
2. Se connecter avec le compte.

Résultat attendu : L'URL devient d'abord /entrar?voltar=%2Fconta ; après la connexion, la personne se trouve sur /conta, avec le titre « Mon compte ».

### CT-E05

**Les routes du participant ne passent pas par la protection de session.**

| Champ | Valeur |
|---|---|
| Scénario | [CN04 · Isolation et protection des données](#cn04) |
| Test | `tests/e2e/autenticacao.spec.ts` › "participante nunca precisa de sessão" |
| Préconditions | Navigateur sans cookie. |
| Exigences | [RF24](requisitos.md#rf24) |
| Résultat au 18/11/2026 | Réussi (mobile et ordinateur) |

Étapes :

1. Ouvrir /r/qualquer-estudo.

Résultat attendu : L'URL reste /r/qualquer-estudo et la réponse n'est pas la redirection 307 vers Se connecter.

### CT-E06

**Les fenêtres d'accès n'ont aucune violation WCAG 2.2 A/AA, pas même dans l'état d'erreur.**

| Champ | Valeur |
|---|---|
| Scénario | [CN01 · Accès et authentification](#cn01) |
| Test | `tests/e2e/autenticacao.spec.ts` › "Entrar e Criar conta passam no axe, inclusive com erro" |
| Préconditions | Aucune. |
| Exigences | [RF01](requisitos.md#rf01), [RF02](requisitos.md#rf02), [RNF01](requisitos.md#rnf01) |
| Résultat au 18/11/2026 | Réussi (mobile et ordinateur) |

Étapes :

1. Ouvrir /entrar et lancer axe avec la fenêtre ouverte.
2. Se connecter avec des identifiants inexistants et lancer axe.
3. Ouvrir /cadastrar et lancer axe.
4. Envoyer l'inscription vide et lancer axe.

Résultat attendu : Zéro violation dans les quatre états. L'erreur de connexion affiche « Impossible de vous connecter ». L'inscription vide affiche le résumé « Corrigez 3 champs pour continuer » avec le focus, le champ Nom avec aria-invalid et « Veuillez indiquer votre nom. »

### CT-E07

**Chaque lien du résumé d'erreurs mène au champ concerné.**

| Champ | Valeur |
|---|---|
| Scénario | [CN01 · Accès et authentification](#cn01) |
| Test | `tests/e2e/autenticacao.spec.ts` › "o link do resumo de erros leva ao campo" |
| Préconditions | Aucune. |
| Exigences | [RF01](requisitos.md#rf01) |
| Résultat au 18/11/2026 | Réussi (mobile et ordinateur) |

Étapes :

1. S'inscrire avec le mot de passe « curta ».
2. Cliquer sur le lien « Mot de passe : le mot de passe doit comporter au moins 8 caractères ».

Résultat attendu : Le focus va au champ Mot de passe, qui conserve ce que la personne a saisi.

### CT-E08

**Le bouton Afficher le mot de passe fonctionne et indique l'état.**

| Champ | Valeur |
|---|---|
| Scénario | [CN01 · Accès et authentification](#cn01) |
| Test | `tests/e2e/autenticacao.spec.ts` › "Mostrar senha alterna a visibilidade e anuncia o estado" |
| Préconditions | Page /entrar ouverte. |
| Exigences | [RF01](requisitos.md#rf01), [RF02](requisitos.md#rf02) |
| Résultat au 18/11/2026 | Réussi (mobile et ordinateur) |

Étapes :

1. Cliquer sur « Afficher le mot de passe ».

Résultat attendu : Le champ passe à type=text et le bouton passe de aria-pressed=false à true.

### CT-E09

**Modifier les données personnelles confirme le résultat et valide.**

| Champ | Valeur |
|---|---|
| Scénario | [CN02 · Mon compte](#cn02) |
| Test | `tests/e2e/conta.spec.ts` › "Minha conta salva os dados, anuncia o resultado e passa no axe" |
| Préconditions | Chercheur connecté. |
| Exigences | [RF04](requisitos.md#rf04), [RNF20](requisitos.md#rnf20) |
| Résultat au 18/11/2026 | Réussi (mobile et ordinateur) |

Étapes :

1. Ouvrir Mon compte, lancer axe et passer à Données personnelles.
2. Changer le nom et enregistrer.
3. Effacer le nom et enregistrer.
4. Lancer axe.

Résultat attendu : Le lien Mon compte a aria-current=page, et le panneau mène à /conta/dados. Enregistrer affiche « Données enregistrées. ». Un nom vide place le focus sur le résumé « Corrigez 1 champ ». Zéro violation.

### CT-E10

**Changer le mot de passe exige le mot de passe actuel et ferme les autres sessions.**

| Champ | Valeur |
|---|---|
| Scénario | [CN02 · Mon compte](#cn02) |
| Test | `tests/e2e/conta.spec.ts` › "trocar a senha encerra a sessão aberta em outro navegador" |
| Préconditions | Le même compte connecté dans deux navigateurs. |
| Exigences | [RF05](requisitos.md#rf05), [RNF15](requisitos.md#rnf15) |
| Résultat au 18/11/2026 | Réussi (mobile et ordinateur) |

Étapes :

1. Sur /conta/senha, changer le mot de passe en indiquant un mot de passe actuel erroné.
2. Recommencer avec le bon mot de passe actuel.
3. Dans l'autre navigateur, ouvrir /conta.
4. Se connecter avec le nouveau mot de passe.

Résultat attendu : Un mot de passe actuel erroné affiche « Le mot de passe actuel ne correspond pas… ». Avec le bon : « Mot de passe modifié. Les autres sessions ouvertes ont été fermées. » et le champ est vidé. L'autre navigateur est redirigé vers Se connecter et ne peut entrer qu'avec le nouveau mot de passe.

### CT-E11

**Supprimer le compte demande une confirmation dans une fenêtre, avec l'e-mail saisi, et supprime l'accès.**

| Champ | Valeur |
|---|---|
| Scénario | [CN02 · Mon compte](#cn02) |
| Test | `tests/e2e/conta.spec.ts` › "excluir a conta exige digitar o e-mail e apaga o acesso" |
| Préconditions | Chercheur connecté. |
| Exigences | [RF06](requisitos.md#rf06), [RNF21](requisitos.md#rnf21) |
| Résultat au 18/11/2026 | Réussi (mobile et ordinateur) |

Étapes :

1. Cliquer sur « Supprimer mon compte ».
2. Annuler ; rouvrir et appuyer sur Échap.
3. Rouvrir et saisir un autre e-mail.
4. Saisir le bon e-mail et confirmer.
5. Tenter de se connecter.

Résultat attendu : La fenêtre « Supprimer votre compte ? » s'ouvre avec l'avertissement sur ce qui sera supprimé avec lui et le focus sur le champ ; zéro violation. Annuler et Échap ferment la fenêtre et rendent le focus au bouton. Mauvais e-mail : « Ce n'est pas l'adresse e-mail de votre compte. Rien n'a été supprimé. ». Bon e-mail : /?aviso=excluida avec « Compte supprimé… ». La connexion suivante échoue.

### CT-E12

**Un nouveau chercheur voit l'état vide accessible.**

| Champ | Valeur |
|---|---|
| Scénario | [CN03 · Gestion des études](#cn03) |
| Test | `tests/e2e/estudos.spec.ts` › "lista vazia mostra o estado vazio e passa no axe" |
| Préconditions | Chercheur tout juste inscrit. |
| Exigences | [RF12](requisitos.md#rf12), [RNF01](requisitos.md#rnf01) |
| Résultat au 18/11/2026 | Réussi (mobile et ordinateur) |

Étapes :

1. Ouvrir /estudos.

Résultat attendu : « Vous n'avez pas encore d'études. » apparaît et axe ne trouve aucune violation.

### CT-E13

**Le produit devient la suggestion de nom de la première version et le focus accompagne l'ajout et la suppression.**

| Champ | Valeur |
|---|---|
| Scénario | [CN03 · Gestion des études](#cn03) |
| Test | `tests/e2e/estudos.spec.ts` › "o produto sugere o nome da primeira versão e o foco acompanha adicionar e remover" |
| Préconditions | Chercheur connecté. |
| Exigences | [RF13](requisitos.md#rf13) |
| Résultat au 18/11/2026 | Réussi (mobile et ordinateur) |

Étapes :

1. Sur /estudos/novo, saisir le produit « Portal do aluno ».
2. Cliquer sur Ajouter une version.
3. Cliquer sur Supprimer la version 2 et annuler dans la fenêtre.
4. Cliquer à nouveau sur Supprimer la version 2 et confirmer avec Entrée.

Résultat attendu : La Version 1 reçoit « Portal do aluno » avec la note « Suggéré à partir du produit évalué. Vous pouvez le modifier. ». Ajouter place le focus sur la Version 2. Supprimer ouvre la fenêtre « Supprimer la version 2 ? » : Annuler conserve la version ; confirmer (le focus est déjà sur le bouton) supprime et rend le focus à Ajouter une version.

### CT-E14

**Le formulaire vide est refusé avec un résumé accessible.**

| Champ | Valeur |
|---|---|
| Scénario | [CN03 · Gestion des études](#cn03) |
| Test | `tests/e2e/estudos.spec.ts` › "criar estudo com campos faltando mostra o resumo e passa no axe" |
| Préconditions | Chercheur connecté. |
| Exigences | [RF13](requisitos.md#rf13), [RNF01](requisitos.md#rnf01) |
| Résultat au 18/11/2026 | Réussi (mobile et ordinateur) |

Étapes :

1. Lancer axe sur /estudos/novo.
2. Cliquer sur Créer une étude sans rien remplir.
3. Lancer axe.

Résultat attendu : Le résumé « Corrigez 4 champs pour continuer » reçoit le focus, « Donnez un titre à l'étude. » apparaît et la Version 1 a aria-invalid. Zéro violation.

### CT-E15

**Les transitions de statut modifient le comportement du lien.**

| Champ | Valeur |
|---|---|
| Scénario | [CN03 · Gestion des études](#cn03) |
| Test | `tests/e2e/estudos.spec.ts` › "abre, encerra e reabre a coleta, e o link público acompanha" |
| Préconditions | Étude créée en brouillon ; un onglet de participant. |
| Exigences | [RF15](requisitos.md#rf15), [RNF20](requisitos.md#rnf20) |
| Résultat au 18/11/2026 | Réussi (mobile et ordinateur) |

Étapes :

1. Ouvrir le lien en tant que participant.
2. Ouvrir la collecte.
3. Clôturer la collecte et recharger le lien.
4. Rouvrir la collecte.

Résultat attendu : Brouillon : « Cette étude n'est pas encore ouverte ». Ouvert : « Collecte ouverte. Le lien accepte déjà les réponses. » et « Ouvert · acceptant les réponses ». Clôturé : « La collecte de cette étude est terminée ». Rouvert : « Collecte rouverte… ». Axe sans violation.

### CT-E16

**Copier le lien fonctionne au clavier et l'annonce.**

| Champ | Valeur |
|---|---|
| Scénario | [CN03 · Gestion des études](#cn03) |
| Test | `tests/e2e/estudos.spec.ts` › "Copiar link anuncia o resultado e funciona pelo teclado" |
| Préconditions | Étude ouverte. Uniquement dans Chromium (autorisation du presse-papiers). |
| Exigences | [RF16](requisitos.md#rf16), [RNF20](requisitos.md#rnf20) |
| Résultat au 18/11/2026 | Réussi (mobile et ordinateur) |

Étapes :

1. Placer le focus sur « Copier le lien » et appuyer sur Entrée.
2. Lire le presse-papiers.

Résultat attendu : « Lien copié. » apparaît et le presse-papiers contient une adresse /r/ avec un slug de 6 caractères.

### CT-E17

**La liste est un tableau accessible.**

| Champ | Valeur |
|---|---|
| Scénario | [CN03 · Gestion des études](#cn03) |
| Test | `tests/e2e/estudos.spec.ts` › "a lista mostra o estudo numa tabela com o título como link" |
| Préconditions | Une étude créée. |
| Exigences | [RF12](requisitos.md#rf12) |
| Résultat au 18/11/2026 | Réussi (mobile et ordinateur) |

Étapes :

1. Ouvrir /estudos.

Résultat attendu : Le tableau a une caption, l'en-tête Réponses, le titre comme lien dans l'en-tête de ligne et le statut Brouillon. Zéro violation.

### CT-E18

**Modifier l'étude enregistre et confirme.**

| Champ | Valeur |
|---|---|
| Scénario | [CN03 · Gestion des études](#cn03) |
| Test | `tests/e2e/estudos.spec.ts` › "editar salva as mudanças e avisa" |
| Préconditions | Une étude créée. |
| Exigences | [RF14](requisitos.md#rf14) |
| Résultat au 18/11/2026 | Réussi (mobile et ordinateur) |

Étapes :

1. Cliquer sur Modifier l'étude.
2. Changer le titre et enregistrer.

Résultat attendu : « Modifications enregistrées. » apparaît et le nouveau titre est le h1 de la page de l'étude.

### CT-E19

**Supprimer l'étude exige de saisir le titre.**

| Champ | Valeur |
|---|---|
| Scénario | [CN03 · Gestion des études](#cn03) |
| Test | `tests/e2e/estudos.spec.ts` › "excluir pede o título e apaga o estudo" |
| Préconditions | Une étude avec 2 versions. |
| Exigences | [RF17](requisitos.md#rf17), [RNF21](requisitos.md#rnf21) |
| Résultat au 18/11/2026 | Réussi (mobile et ordinateur) |

Étapes :

1. Cliquer sur Supprimer l'étude.
2. Saisir un autre titre et confirmer.
3. Saisir le bon titre et confirmer.

Résultat attendu : Le champ reçoit le focus et l'écran indique « Supprimer efface l'étude et les 2 versions. ». Texte erroné : « …Rien n'a été supprimé. ». Bon titre : /estudos?aviso=excluido, « Étude supprimée. » et la liste vide.

### CT-E20

**L'adresse de l'étude ne sert pas à un autre compte.**

| Champ | Valeur |
|---|---|
| Scénario | [CN04 · Isolation et protection des données](#cn04) |
| Test | `tests/e2e/estudos.spec.ts` › "outro pesquisador não vê o estudo pelo endereço" |
| Préconditions | Étude créée par le compte A ; compte B connecté dans un autre navigateur. |
| Exigences | [RNF17](requisitos.md#rnf17) |
| Résultat au 18/11/2026 | Réussi (mobile et ordinateur) |

Étapes :

1. Avec le compte B, ouvrir l'adresse de l'étude du compte A.

Résultat attendu : La réponse est 404, identique à celle d'une étude inexistante.

### CT-E21

**Le participant va du consentement à la fin et le chercheur voit la réponse.**

| Champ | Valeur |
|---|---|
| Scénario | [CN05 · Participation à l'étude](#cn05) |
| Test | `tests/e2e/questionario.spec.ts` › "fluxo completo do participante, com axe em todas as etapas" |
| Préconditions | Étude ouverte. Dans le projet mobile, fenêtre de 390 px. |
| Exigences | [RF24](requisitos.md#rf24), [RF25](requisitos.md#rf25), [RF27](requisitos.md#rf27), [RF32](requisitos.md#rf32), [RF33](requisitos.md#rf33), [RNF01](requisitos.md#rnf01), [RNF12](requisitos.md#rnf12) |
| Résultat au 18/11/2026 | Réussi (mobile et ordinateur) |

Étapes :

1. Ouvrir le lien.
2. Accepter.
3. Cocher les 26 items et envoyer.
4. Cocher « 25 à 34 ans » et continuer.
5. Recharger la page du chercheur.

Résultat attendu : Chaque étape a son propre titre (Consentement, Questionnaire, Données facultatives, Réponses enregistrées) et l'étape en cours a aria-current=step. Aucun bouton radio n'est coché au départ. Le compteur atteint « 26 sur 26 répondus ». Zéro violation à toutes les étapes. Le chercheur voit « 1 réponse · 1 suspecte · 1 dans l'analyse ».

### CT-E22

**Le questionnaire entier fonctionne au clavier seul et le focus n'est jamais masqué.**

| Champ | Valeur |
|---|---|
| Scénario | [CN06 · Accessibilité du questionnaire](#cn06) |
| Test | `tests/e2e/questionario.spec.ts` › "fluxo completo só com teclado, com o foco sempre visível" |
| Préconditions | Étude ouverte. |
| Exigences | [RF28](requisitos.md#rf28), [RNF03](requisitos.md#rnf03) |
| Résultat au 18/11/2026 | Réussi (mobile et ordinateur) |

Étapes :

1. Atteindre J'accepte avec Tab et appuyer sur Entrée.
2. Pour chacun des 26 items : Tab jusqu'au groupe, Espace, flèche droite.
3. Tab jusqu'à Envoyer et Entrée.
4. Tab jusqu'à Passer cette étape et Entrée.

Résultat attendu : Pour chaque item, l'élément ayant le focus est à l'écran et au-dessus du pied de page fixe, et la deuxième position est cochée. La personne arrive sur /fim.

### CT-E23

**Envoyer avec des items manquants montre lesquels manquent et y conduit.**

| Champ | Valeur |
|---|---|
| Scénario | [CN05 · Participation à l'étude](#cn05) |
| Test | `tests/e2e/questionario.spec.ts` › "envio incompleto leva o foco ao resumo e os links levam aos itens" |
| Préconditions | Participation commencée. |
| Exigences | [RF29](requisitos.md#rf29) |
| Résultat au 18/11/2026 | Réussi (mobile et ordinateur) |

Étapes :

1. Cocher tous les items sauf les items 7 et 19 et envoyer.
2. Cliquer sur « Aller à l'élément 19 ».

Résultat attendu : Le résumé « Il reste 2 éléments : 7 et 19 » reçoit le focus, le titre de l'onglet commence par « Il reste 2 éléments » et l'item 7 a la description « Cet élément n'a pas de réponse ». Le lien place le focus sur le premier bouton radio de l'item 19, visible au-dessus du pied de page. Zéro violation.

### CT-E24

**L'arbre d'accessibilité de l'item est celui qui est spécifié.**

| Champ | Valeur |
|---|---|
| Scénario | [CN06 · Accessibilité du questionnaire](#cn06) |
| Test | `tests/e2e/questionario.spec.ts` › "cada item é um grupo com legenda e 7 rádios com posição e polo" |
| Préconditions | Participation commencée. |
| Exigences | [RF27](requisitos.md#rf27), [RNF04](requisitos.md#rnf04), [RNF09](requisitos.md#rnf09) |
| Résultat au 18/11/2026 | Réussi (mobile et ordinateur) |

Étapes :

1. Lire l'arbre d'accessibilité de l'item 4.

Résultat attendu : Groupe « Élément 4 sur 26 : De Fácil aprendizagem ou De difícil aprendizagem » (termes du questionnaire en portugais : facile à apprendre ou difficile à apprendre) avec 7 boutons radio : « 1 sur 7, plus près de De Fácil aprendizagem » … « 4 sur 7, centre » … « 7 sur 7, plus près de De difícil aprendizagem ».

### CT-E25

**Le lien du participant ne défile pas à l'horizontale en 320 px.**

| Champ | Valeur |
|---|---|
| Scénario | [CN06 · Accessibilité du questionnaire](#cn06) |
| Test | `tests/e2e/questionario.spec.ts` › "em 320 px (zoom de 400%) nenhuma etapa rola na horizontal" |
| Préconditions | Étude ouverte ; fenêtre de 320 × 640. |
| Exigences | [RNF02](requisitos.md#rnf02) |
| Résultat au 18/11/2026 | Réussi (mobile et ordinateur) |

Étapes :

1. Vérifier le consentement.
2. Accepter et vérifier le questionnaire.
3. Ouvrir Quitter sans envoyer et vérifier.
4. Continuer, répondre, envoyer et vérifier les données facultatives.

Résultat attendu : À toutes les étapes, la largeur du document ne dépasse pas la fenêtre.

### CT-E26

**Recharger ne fait pas perdre ce qui a été coché.**

| Champ | Valeur |
|---|---|
| Scénario | [CN05 · Participation à l'étude](#cn05) |
| Test | `tests/e2e/questionario.spec.ts` › "recarregar a página recupera as respostas marcadas" |
| Préconditions | Participation commencée. |
| Exigences | [RF30](requisitos.md#rf30) |
| Résultat au 18/11/2026 | Réussi (mobile et ordinateur) |

Étapes :

1. Cocher les items 1 et 2.
2. Recharger.

Résultat attendu : « Nous avons récupéré les réponses que vous aviez déjà cochées. » apparaît, l'item 1 reste coché et le compteur affiche « 2 sur 26 répondus ».

### CT-E27

**Abandonner demande une confirmation dans une fenêtre et n'enregistre rien.**

| Champ | Valeur |
|---|---|
| Scénario | [CN05 · Participation à l'étude](#cn05) |
| Test | `tests/e2e/questionario.spec.ts` › "sair sem enviar confirma numa janela e não grava nada" |
| Préconditions | Participation commencée avec un item coché. |
| Exigences | [RF31](requisitos.md#rf31), [RNF21](requisitos.md#rnf21) |
| Résultat au 18/11/2026 | Réussi (mobile et ordinateur) |

Étapes :

1. Cliquer sur Quitter sans envoyer dans le pied de page et lancer axe.
2. Appuyer sur Échap.
3. Cliquer à nouveau sur Quitter sans envoyer et confirmer dans la fenêtre.
4. Rouvrir le lien.
5. Recharger la page du chercheur.

Résultat attendu : La fenêtre « Quitter sans envoyer ? Rien de ce que vous avez coché ne sera enregistré. » s'ouvre avec le focus sur Continuer à répondre ; zéro violation. Échap ferme la fenêtre, la réponse reste cochée et le focus revient sur Quitter sans envoyer. Confirmer mène à /saiu (« Vous avez quitté l'étude », sans violation). Le lien revient au formulaire de consentement, et le chercheur voit « 0 réponse · 0 dans l'analyse ».

### CT-E28

**Refuser n'enregistre rien, et le même navigateur ne répond pas deux fois.**

| Champ | Valeur |
|---|---|
| Scénario | [CN05 · Participation à l'étude](#cn05) |
| Test | `tests/e2e/questionario.spec.ts` › "não quero participar sai sem gravar e o link respondido não aceita outro envio" |
| Préconditions | Étude ouverte. |
| Exigences | [RF25](requisitos.md#rf25), [RF33](requisitos.md#rf33) |
| Résultat au 18/11/2026 | Réussi (mobile et ordinateur) |

Étapes :

1. Cliquer sur Je ne veux pas participer.
2. Ouvrir le lien, accepter, répondre, envoyer et passer les données facultatives.
3. Rouvrir le lien.

Résultat attendu : Le refus affiche « Vous avez quitté l'étude ». Après avoir répondu, le lien affiche « Vous avez déjà répondu à cette étude ».

### CT-E29

**Le tableau de bord affiche les chiffres de analisarEstudo et la vue reste dans l'URL.**

| Champ | Valeur |
|---|---|
| Scénario | [CN10 · Tableau de bord des résultats](#cn10) |
| Test | `tests/e2e/resultados.spec.ts` › "mostra os números do módulo UEQ e guarda versão e modo na URL" |
| Préconditions | Étude avec la fixture basico dans la version 1 (20) et inconsistente dans la version 2 (15). |
| Exigences | [RF43](requisitos.md#rf43), [RF46](requisitos.md#rf46), [RF47](requisitos.md#rf47), [RF48](requisitos.md#rf48), [RNF08](requisitos.md#rnf08) |
| Résultat au 18/11/2026 | Réussi (mobile et ordinateur) |

Étapes :

1. Ouvrir Résultats et lancer axe.
2. Choisir la version 1 dans le sélecteur.
3. Recharger.
4. Cliquer sur Groupé par échelle.
5. Cliquer sur Comparer les versions et lancer axe.
6. Revenir en arrière dans le navigateur.

Résultat attendu : Attractivité de la version 1 : 0,73, IC de 0,33 à 1,14, alpha 0,92, et le graphique annonce « Atratividade : média 0,73, IC de 0,33 a 1,14, neutra » (Attractivité : moyenne 0,73, IC de 0,33 à 1,14, neutre). Le sélecteur conserve le focus et l'URL gagne versao=, itens=escala et modo=comparar. Recharger conserve la version. La légende indique « cercle vide · n = 15 ». Revenir en arrière quitte le mode comparer. Zéro violation.

### CT-E30

**Un échantillon de 1 produit l'avertissement et le graphique sans IC.**

| Champ | Valeur |
|---|---|
| Scénario | [CN10 · Tableau de bord des résultats](#cn10) |
| Test | `tests/e2e/resultados.spec.ts` › "com uma resposta só avisa que não há intervalo de confiança" |
| Préconditions | Étude avec 1 réponse. |
| Exigences | [RF45](requisitos.md#rf45) |
| Résultat au 18/11/2026 | Réussi (mobile et ordinateur) |

Étapes :

1. Ouvrir Résultats.

Résultat attendu : « Amostra insuficiente para intervalo de confiança. » (Échantillon insuffisant pour un intervalle de confiance.) apparaît et le graphique annonce « …sem intervalo de confiança » (…sans intervalle de confiance).

### CT-E31

**Le tableau de bord ne défile pas à l'horizontale en 320 px.**

| Champ | Valeur |
|---|---|
| Scénario | [CN10 · Tableau de bord des résultats](#cn10) |
| Test | `tests/e2e/resultados.spec.ts` › "em 320 px o painel não rola na horizontal, nos dois modos" |
| Préconditions | Étude avec 5 réponses dans chaque version ; fenêtre de 320 × 640. |
| Exigences | [RNF02](requisitos.md#rnf02) |
| Résultat au 18/11/2026 | Réussi (mobile et ordinateur) |

Étapes :

1. Ouvrir Résultats.
2. Ouvrir Comparer les versions.

Résultat attendu : Dans les deux modes, la largeur du document ne dépasse pas la fenêtre.

### CT-E32

**Le graphique de comparaison reste lisible avec des déficiences de la vision des couleurs et un contraste élevé.**

| Champ | Valeur |
|---|---|
| Scénario | [CN10 · Tableau de bord des résultats](#cn10) |
| Test | `tests/e2e/resultados.spec.ts` › "gráficos com daltonismo simulado e alto contraste" |
| Préconditions | Étude avec 8 réponses dans chaque version. |
| Exigences | [RNF07](requisitos.md#rnf07) |
| Résultat au 18/11/2026 | Réussi (mobile et ordinateur) |

Étapes :

1. Ouvrir Comparer les versions.
2. Émuler la protanopie, la deutéranopie et l'achromatopsie et capturer le graphique.
3. Émuler forced-colors et capturer.
4. Lancer axe.

Résultat attendu : Les quatre captures sont jointes au rapport pour vérification visuelle ; la légende indique la forme de chaque version (« cercle plein ») ; zéro violation.

### CT-E33

**Les suspicions de la fixture sont détectées et retirées de l'analyse en lot.**

| Champ | Valeur |
|---|---|
| Scénario | [CN09 · Réponses suspectes](#cn09) |
| Test | `tests/e2e/respostas.spec.ts` › "a fixture inconsistente sai com as 4 suspeitas da equipe e dá para tirá-las da análise" |
| Préconditions | Étude avec la fixture inconsistente (15). |
| Exigences | [RF51](requisitos.md#rf51), [RF52](requisitos.md#rf52), [RF54](requisitos.md#rf54) |
| Résultat au 18/11/2026 | Réussi (mobile et ordinateur) |

Étapes :

1. Ouvrir Réponses et lancer axe.
2. Cocher Afficher seulement les suspectes.
3. Cliquer sur Retirer les suspectes de l'analyse.
4. Ouvrir Résultats et cliquer sur Voir les réponses.

Résultat attendu : L'URL gagne suspeitas=1 et « Affichage de 4 sur 15. » apparaît, avec 4 suspicions par amplitude. Le lot annonce « 4 participations suspectes sont sorties de l'analyse. Rien n'a été supprimé… ». Le panorama indique « 11 dans l'analyse et 4 hors analyse ». Le tableau de bord affiche « 4 participations hors de l'analyse. » et le lien revient à Réponses.

### CT-E34

**Retirer et remettre une participation est annoncé et réversible.**

| Champ | Valeur |
|---|---|
| Scénario | [CN09 · Réponses suspectes](#cn09) |
| Test | `tests/e2e/respostas.spec.ts` › "incluir e excluir uma participação avisa e nunca apaga" |
| Préconditions | Étude avec 3 réponses. |
| Exigences | [RF54](requisitos.md#rf54) |
| Résultat au 18/11/2026 | Réussi (mobile et ordinateur) |

Étapes :

1. Décocher « dans l'analyse » pour la première participation.
2. Cocher à nouveau.

Résultat attendu : En décochant : « …est sortie de l'analyse. Rien n'a été supprimé » et « 3 réponses · 2 dans l'analyse ». En cochant : « …est revenue dans l'analyse. » et « 3 réponses · 3 dans l'analyse ».

### CT-E35

**Le détail de la participation montre l'amplitude des 6 échelles.**

| Champ | Valeur |
|---|---|
| Scénario | [CN09 · Réponses suspectes](#cn09) |
| Test | `tests/e2e/respostas.spec.ts` › "ver escalas mostra a amplitude de cada escala e destaca as inconsistentes" |
| Préconditions | Étude avec la ligne 1 de la fixture inconsistente. |
| Exigences | [RF53](requisitos.md#rf53) |
| Résultat au 18/11/2026 | Réussi (mobile et ordinateur) |

Étapes :

1. Cliquer sur Voir les échelles de la participation.

Résultat attendu : Le bouton passe de aria-expanded=false à true et devient Masquer ; la liste contient 6 échelles, les 6 marquées comme incohérentes. Zéro violation.

### CT-E36

**Réponses ne défile pas à l'horizontale en 320 px.**

| Champ | Valeur |
|---|---|
| Scénario | [CN09 · Réponses suspectes](#cn09) |
| Test | `tests/e2e/respostas.spec.ts` › "em 320 px a página de respostas não rola na horizontal" |
| Préconditions | Étude avec 3 réponses ; fenêtre de 320 × 640. |
| Exigences | [RF52](requisitos.md#rf52), [RNF02](requisitos.md#rnf02) |
| Résultat au 18/11/2026 | Réussi (mobile et ordinateur) |

Étapes :

1. Ouvrir Réponses.

Résultat attendu : La largeur du document ne dépasse pas la fenêtre.

### CT-E37

**Les trois CSV et le tableur officiel sortent avec le bon nom, le bon encodage et le bon contenu.**

| Champ | Valeur |
|---|---|
| Scénario | [CN11 · Exportation en CSV](#cn11) |
| Test | `tests/e2e/exportacao.spec.ts` › "baixa as 4 exportações com nome datado, BOM e o formato de cada uma, e a planilha oficial em .xlsx" |
| Préconditions | Étude avec basico (20) et inconsistente (15). |
| Exigences | [RF56](requisitos.md#rf56), [RF57](requisitos.md#rf57), [RF58](requisitos.md#rf58), [RF59](requisitos.md#rf59) |
| Résultat au 18/11/2026 | Réussi (mobile et ordinateur) |

Étapes :

1. Dans Résultats, télécharger Réponses brutes, Réponses recodées, Résultats par échelle et Feuille officielle exportée (XLSX), avec « Toutes les versions » sélectionné.

Résultat attendu : Noms ueq_avaliacao-do-checkout-da-loja-virtual_<type>_<aaaa-mm-jj>.csv. Brutes : BOM, en-tête id_participacao;versao;… et 35 lignes. Recodées avec BOM. Résultats : 18 lignes (toutes + 2 versions × 6 échelles) avec « Checkout da loja virtual;Atratividade;20;0,7333; ». Tableur officiel : ueq_avaliacao-do-checkout-da-loja-virtual_planilha-oficial_<aaaa-mm-jj>.xlsx, avec les 35 participations dans Data!A4 et les 20 premières identiques au respostas.csv de la fixture basico, dans l'ordre.

### CT-E38

**L'exportation respecte la session et le propriétaire.**

| Champ | Valeur |
|---|---|
| Scénario | [CN04 · Isolation et protection des données](#cn04) |
| Test | `tests/e2e/exportacao.spec.ts` › "sem sessão ou de outro pesquisador, a exportação não sai" |
| Préconditions | Étude avec 2 réponses ; un deuxième compte. |
| Exigences | [RNF17](requisitos.md#rnf17) |
| Résultat au 18/11/2026 | Réussi (mobile et ordinateur) |

Étapes :

1. Demander /api/estudos/<id>/exportar/brutas sans cookie.
2. Demander avec l'autre compte.
3. Demander le type inexistant xlsx avec le propriétaire.

Résultat attendu : Sans cookie : 307 vers /entrar. Autre compte : 404. Type inexistant : 404.

### CT-E39

**Le PDF du tableau de bord est généré et téléchargé.**

| Champ | Valeur |
|---|---|
| Scénario | [CN12 · Tableau de bord en PDF](#cn12) |
| Test | `tests/e2e/painel-pdf.spec.ts` › "baixa o painel em PDF com nome datado, da versão escolhida" |
| Préconditions | Étude avec basico et inconsistente. |
| Exigences | [RF60](requisitos.md#rf60) |
| Résultat au 18/11/2026 | Réussi (mobile et ordinateur) |

Étapes :

1. Dans Résultats, cliquer sur Tableau de bord en PDF.

Résultat attendu : Le fichier s'appelle ueq_avaliacao-do-checkout-da-loja-virtual_painel_<aaaa-mm-jj>.pdf, commence par %PDF- et pèse plus de 20 Ko.

### CT-E40

**La page qui devient PDF a l'en-tête et masque la navigation à l'impression.**

| Champ | Valeur |
|---|---|
| Scénario | [CN12 · Tableau de bord en PDF](#cn12) |
| Test | `tests/e2e/painel-pdf.spec.ts` › "a página de impressão tem cabeçalho com título, n e data, e no papel some a navegação" |
| Préconditions | Étude avec la fixture basico. |
| Exigences | [RF60](requisitos.md#rf60) |
| Résultat au 18/11/2026 | Réussi (mobile et ordinateur) |

Étapes :

1. Ouvrir /estudos/<id>/resultados/impressao et lancer axe.
2. Émuler le média print.

Résultat attendu : Le h1 est le titre de l'étude, « n dans l'analyse » est « 20 participations » et « Généré le » suit jj/mm/aaaa à hh:mm. À l'impression, la navigation principale, le lien de retour et l'ordre des items disparaissent. Zéro violation.

### CT-E41

**Le PDF exige une session.**

| Champ | Valeur |
|---|---|
| Scénario | [CN04 · Isolation et protection des données](#cn04) |
| Test | `tests/e2e/painel-pdf.spec.ts` › "sem sessão o PDF não sai" |
| Préconditions | Étude créée. |
| Exigences | [RF60](requisitos.md#rf60), [RNF17](requisitos.md#rnf17) |
| Résultat au 18/11/2026 | Réussi (mobile et ordinateur) |

Étapes :

1. Demander /api/estudos/<id>/painel-pdf sans cookie.

Résultat attendu : 307 vers /entrar.

### CT-E42

**Importer un CSV valide passe par l'aperçu et enregistre les lignes.**

| Champ | Valeur |
|---|---|
| Scénario | [CN13 · Importation par CSV](#cn13) |
| Test | `tests/e2e/importacao.spec.ts` › "importa a fixture basico numa versão, com prévia, e as respostas aparecem como importadas" |
| Préconditions | Étude ouverte avec 2 versions. |
| Exigences | [RF61](requisitos.md#rf61) |
| Résultat au 18/11/2026 | Réussi (mobile et ordinateur) |

Étapes :

1. Ouvrir Réponses › Importer et lancer axe.
2. Choisir la version 2 et le fichier de la fixture basico.
3. Cliquer sur Voir l'aperçu et lancer axe.
4. Cliquer sur Importer 20 réponses.

Résultat attendu : L'onglet Réponses conserve aria-current. Le titre « 20 réponses prêtes à importer » reçoit le focus et le tableau a l'en-tête et 5 lignes. Ensuite : /respostas?importadas=20, « 20 réponses importées. » et 20 lignes « importée depuis un CSV » dans la version choisie. Zéro violation.

### CT-E43

**Un fichier en erreur est expliqué ligne par ligne et rien n'est enregistré.**

| Champ | Valeur |
|---|---|
| Scénario | [CN13 · Importation par CSV](#cn13) |
| Test | `tests/e2e/importacao.spec.ts` › "arquivo com erro mostra o problema de cada linha e não importa nada" |
| Préconditions | Étude ouverte. |
| Exigences | [RF61](requisitos.md#rf61) |
| Résultat au 18/11/2026 | Réussi (mobile et ordinateur) |

Étapes :

1. Cliquer sur Voir l'aperçu sans version ni fichier.
2. Envoyer un CSV avec une ligne correcte, une avec 25 valeurs et une avec la valeur 9.
3. Cliquer sur Choisir un autre fichier.
4. Revenir à Réponses.

Résultat attendu : D'abord, le résumé « Corrigez 1 champ » reçoit le focus avec un lien vers Version. Ensuite, le titre « 2 lignes avec problème dans com-erros.csv » reçoit le focus, la ligne 2 indique « Tem 25 valores » (A 25 valeurs) et la ligne 3 « Valores fora de 1 a 7: item 26 ("9") » (Valeurs hors de 1 à 7 : item 26 (« 9 »)), sans bouton Importer. Réponses reste vide. Zéro violation.

### CT-E44

**L'aperçu de l'importation ne défile pas à l'horizontale en 320 px.**

| Champ | Valeur |
|---|---|
| Scénario | [CN13 · Importation par CSV](#cn13) |
| Test | `tests/e2e/importacao.spec.ts` › "em 320 px a prévia da importação não rola na horizontal" |
| Préconditions | Étude ouverte ; fenêtre de 320 × 800. |
| Exigences | [RF61](requisitos.md#rf61), [RNF02](requisitos.md#rnf02) |
| Résultat au 18/11/2026 | Réussi (mobile et ordinateur) |

Étapes :

1. Voir l'aperçu de la fixture basico.

Résultat attendu : La largeur du document ne dépasse pas la fenêtre.

### CT-E45

**La langue de l'étude définit tout le lien, même avec le navigateur dans une autre langue, et parvient au chercheur et à l'exportation.**

| Champ | Valeur |
|---|---|
| Scénario | [CN07 · Langues](#cn07) |
| Test | `tests/e2e/idiomas.spec.ts` › "estudo em espanhol: o link abre no idioma do estudo, mesmo com o navegador em português" |
| Préconditions | Étude ouverte, rédigée en espagnol ; navigateur du participant en pt-BR. |
| Exigences | [RF19](requisitos.md#rf19), [RF34](requisitos.md#rf34) |
| Résultat au 18/11/2026 | Réussi (mobile et ordinateur) |

Étapes :

1. Ouvrir le lien.
2. Accepter.
3. Envoyer à vide.
4. Tout répondre, envoyer et choisir « De 25 a 34 años ».
5. En tant que chercheur, ouvrir Réponses et télécharger les réponses brutes.

Résultat attendu : lang=es, titres et boutons en espagnol, consigne et termes officiels en espagnol, boutons radio « 1 de 7, más cerca de desagradable », résumé « Faltan 26 ítems… ». Le chercheur voit une ligne Espagnol sans « traduction non approuvée ». Le CSV a les colonnes origem;idioma;traducao_aprovada et la ligne ;link;es;sim;25 a 34 anos;. Zéro violation.

### CT-E46

**L'arabe via le sélecteur met la page en RTL sans inverser l'échelle.**

| Champ | Valeur |
|---|---|
| Scénario | [CN07 · Langues](#cn07) |
| Test | `tests/e2e/idiomas.spec.ts` › "em árabe pelo seletor: página da direita para a esquerda, escala na ordem oficial" |
| Préconditions | Étude ouverte ; navigateur en pt-BR. |
| Exigences | [RF34](requisitos.md#rf34) |
| Résultat au 18/11/2026 | Réussi (mobile et ordinateur) |

Étapes :

1. Choisir l'arabe dans le sélecteur sans appliquer.
2. Cliquer sur Appliquer.
3. Accepter.
4. Mesurer la position des termes et des boutons radio 1 et 7 dans l'item 1.
5. Répondre, envoyer et passer.
6. En tant que chercheur, ouvrir Réponses.

Résultat attendu : Choisir ne modifie pas la page (lang reste pt-BR) ; Appliquer passe à lang=ar et dir=rtl et affiche l'avertissement de traduction non approuvée. Dans l'item 1, le terme de gauche et le bouton radio 1 se trouvent à gauche du 7 et du terme de droite, le terme de gauche étant collé à gauche. Le chercheur voit la ligne Arabe avec « traduction non approuvée ». Zéro violation.

### CT-E47

**Une personne sans compte navigue dans la documentation par sections et sous-onglets et voit les diagrammes.**

| Champ | Valeur |
|---|---|
| Scénario | [CN18 · Documentation dans l'outil](#cn18) |
| Test | `tests/e2e/documentacao.spec.ts` › "sem conta, a documentação abre com a barra pública, as seções e as sub-abas, e passa no axe" |
| Préconditions | Navigateur sans cookie de session. |
| Exigences | [RF63](requisitos.md#rf63), [RNF01](requisitos.md#rnf01) |
| Résultat au 18/11/2026 | Réussi (mobile et ordinateur) |

Étapes :

1. Ouvrir /documentacao et lancer axe.
2. Cliquer sur l'onglet Modélisation.
3. Dans l'index de Cas d'utilisation, ouvrir Diagramme 1 et lancer axe.
4. Revenir à l'ouverture de Cas d'utilisation et cliquer sur le sous-onglet Diagramme de classes.

Résultat attendu : La barre affiche Documentation (avec aria-current) et Se connecter, et aucun Études ni Déconnexion. Le h1 est « Documentation », l'onglet Vue d'ensemble est coché et la fiche indique « L'index de la documentation ». Modélisation ouvre /documentacao/casos-de-uso avec le titre « Cas d'utilisation · Documentation », l'onglet et le sous-onglet cochés. La page du Diagramme 1 charge le diagramme sous forme d'image avec un texte alternatif. Le sous-onglet mène au h1 « Diagramme de classes ». Zéro violation.

### CT-E48

**Une personne connectée accède à la documentation par sa propre barre et ne perd pas le chemin de retour.**

| Champ | Valeur |
|---|---|
| Scénario | [CN18 · Documentation dans l'outil](#cn18) |
| Test | `tests/e2e/documentacao.spec.ts` › "quem entrou chega à documentação pela barra do pesquisador e continua com ela" |
| Préconditions | Chercheur connecté. |
| Exigences | [RF63](requisitos.md#rf63) |
| Résultat au 18/11/2026 | Réussi (mobile et ordinateur) |

Étapes :

1. Cliquer sur Documentation dans la barre supérieure et lancer axe.

Résultat attendu : L'URL devient /documentacao, le lien Documentation a aria-current, Études et Déconnexion restent dans la barre et Se connecter n'apparaît pas. Zéro violation.

### CT-E49

**Les liens entre documents et les téléchargements fonctionnent dans l'outil, sans compte.**

| Champ | Valeur |
|---|---|
| Scénario | [CN18 · Documentation dans l'outil](#cn18) |
| Test | `tests/e2e/documentacao.spec.ts` › "os links entre documentos levam à âncora dentro da ferramenta e a planilha baixa sem conta" |
| Préconditions | Navigateur sans cookie de session. |
| Exigences | [RF65](requisitos.md#rf65) |
| Résultat au 18/11/2026 | Réussi (mobile et ordinateur) |

Étapes :

1. Dans la matrice de traçabilité, ouvrir Exigences fonctionnelles › Accès et compte et cliquer sur RF01.
2. À l'ouverture d'Exigences, vérifier le lien Voir sur GitHub de la fiche.
3. Télécharger le tableur des exigences depuis la fiche.

Résultat attendu : L'URL mène à la page d'Exigences où se trouve le RF01 (/documentacao/requisitos/requisitos-funcionais/acesso-e-conta#rf01), et la ligne du RF01 est à l'écran. Le lien GitHub pointe vers docs/documentacao/requisitos.md. Le téléchargement sort sous le nom planilha-requisitos.xlsx.

### CT-E50

**La documentation ne défile pas à l'horizontale en 320 px.**

| Champ | Valeur |
|---|---|
| Scénario | [CN18 · Documentation dans l'outil](#cn18) |
| Test | `tests/e2e/documentacao.spec.ts` › "em 320 px a documentação não rola na horizontal" |
| Préconditions | Fenêtre de 320 × 640. |
| Exigences | [RF63](requisitos.md#rf63), [RNF02](requisitos.md#rnf02) |
| Résultat au 18/11/2026 | Réussi (mobile et ordinateur) |

Étapes :

1. Ouvrir la vue d'ensemble, Exigences et Architecture.

Résultat attendu : Sur les trois pages, la largeur du document ne dépasse pas la fenêtre : les tableaux et les diagrammes défilent dans leur propre région.

### CT-E51

**Ni la page ni la route de fichiers ne livrent ce qui ne figure pas dans le catalogue, et l'espace du chercheur reste fermé.**

| Champ | Valeur |
|---|---|
| Scénario | [CN18 · Documentation dans l'outil](#cn18) |
| Test | `tests/e2e/documentacao.spec.ts` › "endereço fora do catálogo dá 404 e os arquivos só saem da lista" |
| Préconditions | Navigateur sans cookie de session. |
| Exigences | [RF65](requisitos.md#rf65) |
| Résultat au 18/11/2026 | Réussi (mobile et ordinateur) |

Étapes :

1. Ouvrir /documentacao/nao-existe.
2. Demander /api/documentacao/package.json, ..%2F..%2F.env et un diagramme avec un nom invalide.
3. Demander requisitos.csv et /estudos sans cookie.

Résultat attendu : La page renvoie 404 ; les trois demandes de fichier renvoient 404 ; requisitos.csv sort (200) uniquement si Exigences est publié, sinon 404 ; /estudos continue de rediriger vers /entrar (307).

### CT-E52

**Une personne qui répond ne voit que le formulaire et le sélecteur de langue.**

| Champ | Valeur |
|---|---|
| Scénario | [CN05 · Participation à l'étude](#cn05) |
| Test | `tests/e2e/questionario.spec.ts` › "o link do participante só mostra o formulário e o seletor de idioma, sem caminho para a ferramenta" |
| Préconditions | Étude ouverte. |
| Exigences | [RF24](requisitos.md#rf24) |
| Résultat au 18/11/2026 | Réussi (mobile et ordinateur) |

Étapes :

1. Ouvrir le lien et vérifier le sélecteur de langue.
2. Accepter.
3. Répondre et envoyer.
4. Passer les données facultatives.

Résultat attendu : À chaque étape (consentement, questionnaire, données facultatives et fin), il n'y a pas de barre Principal et tout lien pointe vers le formulaire lui-même (/r/…) ou vers une ancre de la page. Aucun chemin ne mène à la documentation, aux études ou à Se connecter.

### CT-E53

**La barre supérieure reste en haut pendant le défilement, avec et sans compte.**

| Champ | Valeur |
|---|---|
| Scénario | [CN19 · Navigation et barre fixe](#cn19) |
| Test | `tests/e2e/barra.spec.ts` › "a barra fica fixa no topo ao rolar, com e sem conta" |
| Préconditions | Une longue page (la page d'accueil). |
| Exigences | [RNF03](requisitos.md#rnf03), [RNF23](requisitos.md#rnf23) |
| Résultat au 18/11/2026 | Réussi (mobile et ordinateur) |

Étapes :

1. Sans compte, ouvrir la page d'accueil et défiler jusqu'à la fin.
2. Créer un compte, ouvrir la page d'accueil et défiler jusqu'au milieu.

Résultat attendu : Dans les deux cas, la page a défilé de plus de 1000 px et la barre est à l'écran avec le haut à 0.

### CT-E54

**Ni la destination d'une ancre ni l'élément ayant le focus ne sont masqués par la barre.**

| Champ | Valeur |
|---|---|
| Scénario | [CN19 · Navigation et barre fixe](#cn19) |
| Test | `tests/e2e/barra.spec.ts` › "o foco e as âncoras nunca ficam embaixo da barra fixa" |
| Préconditions | Aucune. |
| Exigences | [RNF03](requisitos.md#rnf03) |
| Résultat au 18/11/2026 | Réussi (mobile et ordinateur) |

Étapes :

1. Ouvrir la page d'accueil sur #inicio-leitura.
2. Placer le focus sur le lien Politique de confidentialité et remonter 40 fois avec Maj+Tab.

Résultat attendu : L'ancre commence sous la barre, et chaque élément qui reçoit le focus en dehors de la barre aussi (WCAG 2.4.11).

### CT-E55

**Sur mobile, la barre fixe tient sur une seule ligne et le menu se comporte comme un contrôle d'ouverture et de fermeture.**

| Champ | Valeur |
|---|---|
| Scénario | [CN19 · Navigation et barre fixe](#cn19) |
| Test | `tests/e2e/barra.spec.ts` › "no celular os links ficam no menu, que fecha com Esc e devolve o foco" |
| Préconditions | Fenêtre de 390 × 844. |
| Exigences | [RNF03](requisitos.md#rnf03), [RNF23](requisitos.md#rnf23) |
| Résultat au 18/11/2026 | Réussi (mobile et ordinateur) |

Étapes :

1. Vérifier le bouton Menu fermé.
2. Ouvrir le menu et lancer axe.
3. Appuyer sur Échap avec le focus sur le bouton Se connecter.
4. Ouvrir le menu, cliquer sur le logo (mène à /) et revenir.

Résultat attendu : Fermé : aria-expanded=false, bouton Se connecter masqué et barre de moins de 80 px. Ouvert : aria-expanded=true, Se connecter visible et zéro violation. Échap ferme et rend le focus au bouton. En changeant de page, le menu se ferme, et au retour il reste fermé.

### CT-E56

**Sur ordinateur, les liens restent toujours visibles dans la barre.**

| Champ | Valeur |
|---|---|
| Scénario | [CN19 · Navigation et barre fixe](#cn19) |
| Test | `tests/e2e/barra.spec.ts` › "no computador o botão Menu não aparece e os links ficam na barra" |
| Préconditions | Fenêtre de 1280 × 800. |
| Exigences | [RNF23](requisitos.md#rnf23) |
| Résultat au 18/11/2026 | Réussi (mobile et ordinateur) |

Étapes :

1. Ouvrir la documentation.

Résultat attendu : Le bouton Menu n'apparaît pas et le bouton Se connecter est visible dans la barre.

### CT-E57

**Le diagramme s'ouvre en plein écran, avec zoom et glissement, et se ferme en rendant le focus.**

| Champ | Valeur |
|---|---|
| Scénario | [CN18 · Documentation dans l'outil](#cn18) |
| Test | `tests/e2e/documentacao.spec.ts` › "clicar no diagrama abre em tela cheia, com zoom, arrasto, Voltar e Esc" |
| Préconditions | Navigateur sans cookie de session. |
| Exigences | [RF64](requisitos.md#rf64) |
| Résultat au 18/11/2026 | Réussi (mobile et ordinateur) |

Étapes :

1. Dans un document publié, cliquer sur le premier diagramme et lancer axe.
2. Cliquer deux fois sur Agrandir.
3. Faire glisser le diagramme avec la souris.
4. Appuyer sur - puis sur 0.
5. Cliquer sur Retour.
6. Avec le focus sur le diagramme, appuyer sur Entrée puis sur Échap.

Résultat attendu : La fenêtre avec le titre du diagramme occupe toute la largeur, Retour reçoit le focus et l'image se charge ; zéro violation. Le zoom passe à 150 % et la zone se met à défiler ; le glissement change la position et Retour reste en haut. - ramène à 125 % et 0 revient à 100 %. Retour et Échap ferment, et le focus revient sur le diagramme.

### CT-E58

**Se connecter et Créer un compte s'ouvrent dans une fenêtre au-dessus de la page, tiennent sans défilement et se ferment en rendant le focus.**

| Champ | Valeur |
|---|---|
| Scénario | [CN20 · Page d'accueil et fenêtres](#cn20) |
| Test | `tests/e2e/inicial.spec.ts` › "Entrar abre a janela por cima da página, sem rolar, e Esc fecha devolvendo o foco" |
| Préconditions | Page d'accueil (/) sans session. |
| Exigences | [RF02](requisitos.md#rf02), [RF11](requisitos.md#rf11) |
| Résultat au 18/11/2026 | Réussi (mobile et ordinateur) |

Étapes :

1. Cliquer sur Se connecter dans la barre.
2. Mesurer la boîte de la fenêtre et lancer axe.
3. Cliquer sur Créer un compte dans la fenêtre.
4. Appuyer sur Échap.

Résultat attendu : La fenêtre « Se connecter » s'ouvre avec le focus sur E-mail, et l'URL reste /. Le contenu tient sans barre de défilement ; zéro violation. Créer un compte remplace le formulaire dans la même fenêtre, avec le focus sur Nom. Échap ferme et rend le focus au bouton Se connecter.

### CT-E59

**Fermer la fenêtre ouverte à l'adresse /entrar ramène à la page d'accueil.**

| Champ | Valeur |
|---|---|
| Scénario | [CN20 · Page d'accueil et fenêtres](#cn20) |
| Test | `tests/e2e/inicial.spec.ts` › "fechar a janela em /entrar volta para a página inicial" |
| Préconditions | Navigateur sans cookie de session. |
| Exigences | [RF11](requisitos.md#rf11) |
| Résultat au 18/11/2026 | Réussi (mobile et ordinateur) |

Étapes :

1. Ouvrir /entrar.
2. Cliquer sur Fermer (x).

Résultat attendu : La fenêtre disparaît et l'URL devient /.

### CT-E60

**Une personne déjà connectée voit la page d'accueil avec la barre du chercheur.**

| Champ | Valeur |
|---|---|
| Scénario | [CN20 · Page d'accueil et fenêtres](#cn20) |
| Test | `tests/e2e/inicial.spec.ts` › "quem entrou vê a página inicial com a barra do pesquisador e o caminho para os estudos" |
| Préconditions | Chercheur connecté. |
| Exigences | [RF11](requisitos.md#rf11) |
| Résultat au 18/11/2026 | Réussi (mobile et ordinateur) |

Étapes :

1. Ouvrir /.
2. Cliquer sur « Voir vos études ».

Résultat attendu : La barre contient le bouton Déconnexion. « Voir vos études » mène à /estudos.

### CT-E61

**Le navigateur reçoit l'icône du site, même sans session.**

| Champ | Valeur |
|---|---|
| Scénario | [CN20 · Page d'accueil et fenêtres](#cn20) |
| Test | `tests/e2e/inicial.spec.ts` › "o navegador recebe o ícone do site" |
| Préconditions | Navigateur sans cookie de session. |
| Exigences | [RF11](requisitos.md#rf11) |
| Résultat au 18/11/2026 | Réussi (mobile et ordinateur) |

Étapes :

1. Ouvrir / et lire le lien rel=icon.
2. Demander l'icône SVG et l'apple-touch-icon.

Résultat attendu : Le lien pointe vers /icon.svg ; le SVG est servi avec 200 et image/svg+xml, et l'apple-touch-icon est servi en image/png.

### CT-E62

**Un document en production n'affiche que l'avis et la fiche, et la route ne sert pas ses fichiers.**

| Champ | Valeur |
|---|---|
| Scénario | [CN18 · Documentation dans l'outil](#cn18) |
| Test | `tests/e2e/documentacao.spec.ts` › "documento em produção mostra o aviso e a ficha, sem texto, arquivo nem downloads" |
| Préconditions | Navigateur sans cookie de session ; Exigences encore en production. |
| Exigences | [RF63](requisitos.md#rf63) |
| Résultat au 18/11/2026 | Ignoré (mobile et ordinateur) : tous les documents du catalogue sont publiés, il n'y a donc aucun document en production à ouvrir |

Étapes :

1. Ouvrir /documentacao et lancer axe.
2. Dans le tableau Situation des documents, cliquer sur Exigences et lancer axe.
3. Demander requisitos.csv et planilha-requisitos.xlsx.

Résultat attendu : La vue d'ensemble affiche « La documentation est en cours de rédaction par l'équipe. » et le tableau avec Exigences « En cours de production ». Exigences affiche le h1, l'avis « Exigences : en cours de production. » et la fiche avec « En cours de production », sans Voir sur GitHub, sans téléchargements et sans article. Les deux fichiers renvoient 404. Zéro violation.

### CT-E63

**Le propriétaire invite par e-mail, la personne invitée accepte dans la cloche et, en tant que lectrice, ne peut que consulter.**

| Champ | Valeur |
|---|---|
| Scénario | [CN21 · Équipe et notifications](#cn21) |
| Test | `tests/e2e/equipe.spec.ts` › "convite por e-mail chega no sino, o leitor só vê e o dono é avisado" |
| Préconditions | Deux comptes, chacun dans son navigateur ; le propriétaire a une étude. |
| Exigences | [RF20](requisitos.md#rf20), [RF21](requisitos.md#rf21), [RF22](requisitos.md#rf22) |
| Résultat au 18/11/2026 | Réussi (mobile et ordinateur) |

Étapes :

1. Dans Partager, inviter un e-mail sans compte.
2. Inviter le second compte comme Lecteur et lancer axe.
3. Dans le second compte, ouvrir Études et la cloche, puis accepter.
4. Dans le compte du propriétaire, ouvrir Notifications et lancer axe.

Résultat attendu : Un e-mail sans compte affiche « Aucun compte n'utilise cet e-mail ». L'invitation apparaît comme « Invitation en attente » et le statut indique « Invitation envoyée ». Le second compte voit « Vous avez 1 invitation en attente » et « vous a invité… en tant que lecteur ». Après avoir accepté, il voit « vous êtes lecteur », sans Modifier l'étude ni Ouvrir la collecte. Le propriétaire reçoit « a accepté l'invitation à l'étude ». Zéro violation.

### CT-E64

**La cloche s'ouvre et se ferme au clavier seul, en rendant le focus.**

| Champ | Valeur |
|---|---|
| Scénario | [CN21 · Équipe et notifications](#cn21) |
| Test | `tests/e2e/equipe.spec.ts` › "o sino também funciona pelo teclado" |
| Préconditions | Chercheur connecté, sans notification. |
| Exigences | [RF22](requisitos.md#rf22), [RNF03](requisitos.md#rnf03) |
| Résultat au 18/11/2026 | Réussi (mobile et ordinateur) |

Étapes :

1. Atteindre la cloche avec Tab et appuyer sur Entrée.
2. Appuyer sur Échap.

Résultat attendu : Entrée met aria-expanded=true et affiche « Rien de nouveau ». Échap met aria-expanded=false et le focus revient sur la cloche.

### CT-E65

**Chaque page du chercheur s'explique elle-même dans une fenêtre.**

| Champ | Valeur |
|---|---|
| Scénario | [CN22 · Apprendre à utiliser](#cn22) |
| Test | `tests/e2e/equipe.spec.ts` › "toda página do pesquisador tem o (?) com a ajuda dela" |
| Préconditions | Chercheur connecté. |
| Exigences | [RF10](requisitos.md#rf10) |
| Résultat au 18/11/2026 | Réussi (mobile et ordinateur) |

Étapes :

1. Dans /estudos, /estudos/novo, /conta et /notificacoes, ouvrir Aide de cette page.
2. Lancer axe.
3. Appuyer sur Échap.

Résultat attendu : La fenêtre s'ouvre avec le titre de la page, sans violation, et Échap la ferme.

### CT-E66

**La visite guidée démarre à la première connexion, avance par l'action de la personne et ne revient pas une fois ignorée.**

| Champ | Valeur |
|---|---|
| Scénario | [CN22 · Apprendre à utiliser](#cn22) |
| Test | `tests/e2e/equipe.spec.ts` › "o tour abre só no primeiro acesso, avança pelo clique na ação e pode ser pulado" |
| Préconditions | Nouvel e-mail de test. |
| Exigences | [RF09](requisitos.md#rf09) |
| Résultat au 18/11/2026 | Réussi (mobile et ordinateur) |

Étapes :

1. Créer le compte et lancer axe sur l'écran de bienvenue.
2. Cliquer sur Commencer la visite.
3. Cliquer sur l'étude d'exemple mise en évidence.
4. Cliquer sur Ignorer le tutoriel et recharger la page.

Résultat attendu : « Bienvenue dans l'Outil UEQ » apparaît. La visite crée « Exemplo do tour: app de delivery » (exemple de la visite : application de livraison), affiche « Étape 1 sur 10 » et, après le clic, « Étape 2 sur 10 ». Une fois ignorée, la carte disparaît et l'écran de bienvenue ne revient pas au rechargement. Zéro violation.

### CT-E67

**La langue choisie à l'inscription s'applique à l'outil et peut être modifiée ensuite.**

| Champ | Valeur |
|---|---|
| Scénario | [CN24 · Langue de l'outil](#cn24) |
| Test | `tests/e2e/idioma-interface.spec.ts` › "o idioma escolhido ao criar a conta vale para a ferramenta e pode ser trocado em Minha conta" |
| Préconditions | Une traduction de « Mon compte » en allemand enregistrée directement dans la base, comme l'API l'enregistrerait. S'exécute uniquement sur ordinateur. |
| Exigences | [RF08](requisitos.md#rf08) |
| Résultat au 18/11/2026 | Réussi sur ordinateur ; ignoré sur mobile, où la barre est repliée |

Étapes :

1. Dans Créer un compte, remplir le formulaire et lancer axe.
2. Choisir « Deutsch » dans Langue de l'outil.
3. Créer le compte et ignorer la visite guidée.
4. Dans /conta/idioma, choisir Português et enregistrer.

Résultat attendu : Ce qui a été saisi reste en place après le changement. La barre affiche « Mein Konto », et le lang reste pt-BR, car presque rien n'est traduit. Enregistrer affiche « Idioma da ferramenta trocado. » (Langue de l'outil modifiée.) et la barre revient à « Minha conta » (Mon compte). Zéro violation.

### CT-E68

**Changer de langue dans le questionnaire ne fait pas perdre les réponses cochées.**

| Champ | Valeur |
|---|---|
| Scénario | [CN07 · Langues](#cn07) |
| Test | `tests/e2e/idiomas.spec.ts` › "o idioma também troca no meio do questionário, sem perder o que já foi marcado" |
| Préconditions | Étude ouverte. |
| Exigences | [RF30](requisitos.md#rf30), [RF34](requisitos.md#rf34) |
| Résultat au 18/11/2026 | Réussi (mobile et ordinateur) |

Étapes :

1. Accepter et cocher l'item 1.
2. Choisir l'anglais dans le sélecteur et cliquer sur Appliquer.
3. Lancer axe.

Résultat attendu : On reste sur /questionario, avec lang=en. L'item 1 est maintenant « annoying or enjoyable », il reste coché, et la progression indique « 1 of 26 answered ». Zéro violation.

### CT-E69

**La page d'accueil cite les études et donne les crédits.**

| Champ | Valeur |
|---|---|
| Scénario | [CN20 · Page d'accueil et fenêtres](#cn20) |
| Test | `tests/e2e/inicial.spec.ts` › "a página inicial explica o UEQ, lista os estudos do método e dá os créditos" |
| Préconditions | Navigateur sans cookie de session. |
| Exigences | [RF11](requisitos.md#rf11) |
| Résultat au 18/11/2026 | Réussi (mobile et ordinateur) |

Étapes :

1. Dans /, cliquer sur Études sur la méthode dans l'index.
2. Vérifier les liens des références.
3. Vérifier les crédits et lancer axe.

Résultat attendu : L'URL se termine par #inicio-estudos. Chaque étude mène au DOI, et le manuel, au PDF officiel. Les crédits citent les auteurs de l'UEQ, la discipline et les trois membres de l'équipe. Zéro violation.

### CT-E70

**Le logo mène à la page d'accueil, et une personne connectée voit le chemin vers les études.**

| Champ | Valeur |
|---|---|
| Scénario | [CN20 · Page d'accueil et fenêtres](#cn20) |
| Test | `tests/e2e/inicial.spec.ts` › "quem entrou volta à página inicial pelo logotipo" |
| Préconditions | Chercheur connecté, dans /conta. |
| Exigences | [RF11](requisitos.md#rf11) |
| Résultat au 18/11/2026 | Réussi (mobile et ordinateur) |

Étapes :

1. Cliquer sur le logo dans la barre.

Résultat attendu : L'URL est / et le lien « Voir vos études » apparaît.

### CT-E71

**Sans la collecte activée, l'étape des données facultatives n'existe pas.**

| Champ | Valeur |
|---|---|
| Scénario | [CN05 · Participation à l'étude](#cn05) |
| Test | `tests/e2e/questionario.spec.ts` › "sem coleta de dados demográficos, o envio leva direto ao agradecimento" |
| Préconditions | Étude ouverte avec la collecte démographique désactivée. |
| Exigences | [RF18](requisitos.md#rf18), [RF32](requisitos.md#rf32) |
| Résultat au 18/11/2026 | Réussi (mobile et ordinateur) |

Étapes :

1. Ouvrir le lien et accepter.
2. Tout répondre et envoyer.
3. Ouvrir /sobre-voce par l'adresse.

Résultat attendu : La liste des étapes compte 2 éléments et « Étape 2 sur 2 · Questionnaire » apparaît. L'envoi mène à « Réponses enregistrées », et l'étape ne s'ouvre pas, même par l'adresse.

### CT-E72

**Le profil des participants apparaît dans un sous-onglet de Résultats, avec le tableau de chiffres.**

| Champ | Valeur |
|---|---|
| Scénario | [CN10 · Tableau de bord des résultats](#cn10) |
| Test | `tests/e2e/privacidade.spec.ts` › "os dados demográficos aparecem em Resultados, numa sub-aba própria" |
| Préconditions | Étude ouverte avec la collecte activée et une réponse. |
| Exigences | [RF50](requisitos.md#rf50) |
| Résultat au 18/11/2026 | Réussi (mobile et ordinateur) |

Étapes :

1. Répondre en choisissant 25 à 34 ans.
2. En tant que chercheur, ouvrir Résultats et Données démographiques.
3. Ouvrir « Voir les chiffres » et lancer axe.

Résultat attendu : Le graphique de Tranche d'âge a l'aria-label « 25 à 34 ans, 1 (100 %) », et le tableau affiche 100 %. Zéro violation.

### CT-E73

**Chaque réponse porte les en-têtes de sécurité.**

| Champ | Valeur |
|---|---|
| Scénario | [CN23 · Protection des données](#cn23) |
| Test | `tests/e2e/privacidade.spec.ts` › "toda resposta sai com os cabeçalhos de segurança" |
| Préconditions | Aucune. |
| Exigences | [RNF18](requisitos.md#rnf18) |
| Résultat au 18/11/2026 | Réussi (mobile et ordinateur) |

Étapes :

1. Demander / et lire les en-têtes.

Résultat attendu : CSP avec frame-ancestors 'none', HSTS de 2 ans, nosniff, X-Frame-Options DENY, Referrer-Policy same-origin et sans X-Powered-By.

### CT-E74

**La politique s'ouvre sans compte et passe axe.**

| Champ | Valeur |
|---|---|
| Scénario | [CN23 · Protection des données](#cn23) |
| Test | `tests/e2e/privacidade.spec.ts` › "a política de privacidade é pública e acessível" |
| Préconditions | Navigateur sans cookie de session. |
| Exigences | [RNF01](requisitos.md#rnf01), [RNF19](requisitos.md#rnf19) |
| Résultat au 18/11/2026 | Réussi (mobile et ordinateur) |

Étapes :

1. Ouvrir /privacidade et lancer axe.

Résultat attendu : Le h1 est « Politique de confidentialité » et « Vos droits (LGPD, art. 18) » apparaît. Zéro violation.

### CT-E75

**L'index mène à chaque section, et la page tient en 320 px.**

| Champ | Valeur |
|---|---|
| Scénario | [CN23 · Protection des données](#cn23) |
| Test | `tests/e2e/privacidade.spec.ts` › "a política leva cada seção pelo índice e não rola na horizontal em 320 px" |
| Préconditions | Navigateur sans cookie de session. |
| Exigences | [RNF02](requisitos.md#rnf02), [RNF19](requisitos.md#rnf19) |
| Résultat au 18/11/2026 | Réussi (mobile et ordinateur) |

Étapes :

1. Dans /privacidade, cliquer sur Questions et demandes dans l'index.
2. Réduire la largeur à 320 px et lancer axe.

Résultat attendu : L'URL se termine par #contato, avec la section visible. À 320 px, il n'y a pas de défilement horizontal. Zéro violation.

### CT-E76

**Retour mène au pied de la page d'accueil, d'où la personne est partie.**

| Champ | Valeur |
|---|---|
| Scénario | [CN23 · Protection des données](#cn23) |
| Test | `tests/e2e/privacidade.spec.ts` › "da página inicial, a política volta ao rodapé de onde a pessoa saiu" |
| Préconditions | Navigateur sans cookie de session. |
| Exigences | [RNF19](requisitos.md#rnf19) |
| Résultat au 18/11/2026 | Réussi (mobile et ordinateur) |

Étapes :

1. Dans /, cliquer sur Politique de confidentialité dans le pied de page.
2. Cliquer sur Revenir à la page d'accueil.

Résultat attendu : L'URL se termine par /#rodape, avec le pied de page visible.

### CT-E77

**Depuis Mon compte et depuis l'aide, Retour mène à l'écran d'origine.**

| Champ | Valeur |
|---|---|
| Scénario | [CN23 · Protection des données](#cn23) |
| Test | `tests/e2e/privacidade.spec.ts` › "de Minha conta e da ajuda, a política volta para a mesma tela" |
| Préconditions | Chercheur connecté. |
| Exigences | [RNF19](requisitos.md#rnf19) |
| Résultat au 18/11/2026 | Réussi (mobile et ordinateur) |

Étapes :

1. Dans /conta, ouvrir la politique.
2. Cliquer sur Revenir à Mon compte.
3. Dans /estudos, ouvrir l'aide et, depuis celle-ci, la politique.
4. Cliquer sur Revenir à la page précédente.

Résultat attendu : Connecté, la fiche affiche « Télécharger mes données ». Les deux Retour mènent à /conta et à /estudos.

### CT-E78

**La politique s'ouvre dans un autre onglet depuis les fenêtres, sans perdre ce qui a été saisi.**

| Champ | Valeur |
|---|---|
| Scénario | [CN23 · Protection des données](#cn23) |
| Test | `tests/e2e/privacidade.spec.ts` › "das janelas de acesso, a política abre em outra aba, sem perder o que foi digitado, e voltar tenta fechar a aba" |
| Préconditions | Navigateur sans cookie de session. |
| Exigences | [RNF19](requisitos.md#rnf19) |
| Résultat au 18/11/2026 | Réussi (mobile et ordinateur) |

Étapes :

1. Ouvrir /entrar et vérifier le lien.
2. Dans /cadastrar, saisir le nom.
3. Cliquer sur Politique de confidentialité.
4. Dans le nouvel onglet, cliquer sur Fermer cet onglet et revenir.

Résultat attendu : La fenêtre Se connecter a aussi le lien. Le nouvel onglet affiche la politique, et le champ Nom reste rempli dans l'onglet d'origine. Revenir demande la fermeture de l'onglet ; si le navigateur refuse, la page d'accueil s'ouvre. Le test remplace window.close par un enregistrement, car la fermeture réelle bloque l'arrêt de Playwright dans Chromium headless. La fermeture réelle a été vérifiée à part, dans un script Playwright, le 06/11/2026, et le cas manuel CT-M23 répète la vérification.

### CT-E79

**La destination de Retour ne sort jamais de l'outil.**

| Champ | Valeur |
|---|---|
| Scénario | [CN23 · Protection des données](#cn23) |
| Test | `tests/e2e/privacidade.spec.ts` › "a política não aceita voltar para outro site" |
| Préconditions | Aucune. |
| Exigences | [RNF19](requisitos.md#rnf19) |
| Résultat au 18/11/2026 | Réussi (mobile et ordinateur) |

Étapes :

1. Ouvrir /privacidade?de= avec https://exemplo.com, //exemplo.com, /\exemplo.com et /[tab]/exemplo.com.

Résultat attendu : Dans les quatre cas, le lien est « Revenir à la page d'accueil » et pointe vers /.

### CT-E80

**Après 5 mots de passe erronés, la connexion bloque l'adresse e-mail.**

| Champ | Valeur |
|---|---|
| Scénario | [CN23 · Protection des données](#cn23) |
| Test | `tests/e2e/privacidade.spec.ts` › "depois de 5 senhas erradas o e-mail espera" |
| Préconditions | Une adresse e-mail de test. |
| Exigences | [RNF16](requisitos.md#rnf16) |
| Résultat au 18/11/2026 | Réussi (mobile et ordinateur) |

Étapes :

1. Se tromper de mot de passe 5 fois dans Se connecter.
2. Réessayer.

Résultat attendu : Chaque erreur affiche « mot de passe ne correspondent pas », et le focus va au résumé. La sixième tentative affiche « Trop de tentatives avec cette adresse e-mail ».

### CT-E81

**Télécharger mes données livre le compte en JSON, sans le mot de passe.**

| Champ | Valeur |
|---|---|
| Scénario | [CN23 · Protection des données](#cn23) |
| Test | `tests/e2e/privacidade.spec.ts` › "Baixar meus dados entrega um JSON com a conta e sem a senha" |
| Préconditions | Chercheur connecté. |
| Exigences | [RF07](requisitos.md#rf07) |
| Résultat au 18/11/2026 | Réussi (mobile et ordinateur) |

Étapes :

1. Dans /conta, cliquer sur Télécharger mes données.

Résultat attendu : Le fichier s'appelle meus-dados-ferramenta-ueq-AAAA-MM-DD.json, contient l'adresse e-mail du compte et n'a pas de senhaHash.

### CT-E82

**Le participant lit la politique depuis le formulaire de consentement, sans quitter le lien de l'étude.**

| Champ | Valeur |
|---|---|
| Scénario | [CN05 · Participation à l'étude](#cn05) |
| Test | `tests/e2e/questionario.spec.ts` › "a política de privacidade abre pelo termo, dentro do link do participante, e volta para ele" |
| Préconditions | Étude ouverte. |
| Exigences | [RF25](requisitos.md#rf25), [RNF19](requisitos.md#rnf19) |
| Résultat au 18/11/2026 | Réussi (mobile et ordinateur) |

Étapes :

1. Ouvrir le lien.
2. Cliquer sur Politique de confidentialité.
3. Vérifier les liens de la page et exécuter axe.
4. Cliquer sur Retour.

Résultat attendu : L'URL se termine par /privacidade, avec le h1 « Politique de confidentialité » et la section « Si vous avez répondu à un questionnaire ». Il n'y a pas de barre de l'outil et tout lien reste dans /r/ ou est une ancre. Retour mène au formulaire de consentement. Zéro violation.

### CT-E83

**Sans traduction, la politique avertit dans la langue de la personne et marque le texte comme portugais.**

| Champ | Valeur |
|---|---|
| Scénario | [CN05 · Participation à l'étude](#cn05) |
| Test | `tests/e2e/questionario.spec.ts` › "sem tradução automática, a política avisa no idioma da pessoa e sai marcada como português" |
| Préconditions | Étude ouverte, rédigée en anglais ; pas de traduction de la politique dans la base de données. |
| Exigences | [RF34](requisitos.md#rf34), [RNF19](requisitos.md#rnf19) |
| Résultat au 18/11/2026 | Réussi (mobile et ordinateur) |

Étapes :

1. Ouvrir le lien.
2. Cliquer sur Privacy policy.
3. Exécuter axe.

Résultat attendu : « This policy has not been translated into your language yet » apparaît. Le main a lang=pt-BR, et le lien est « Back ». Zéro violation.

### CT-E84

**Un document long s'ouvre comme un sommaire, et chaque section s'ouvre sur sa propre page, avec le diagramme visible.**

| Champ | Valeur |
|---|---|
| Scénario | [CN18 · Documentation dans l'outil](#cn18) |
| Test | `tests/e2e/documentacao.spec.ts` › "documento longo abre como índice, e cada seção em página própria com o diagrama à vista" |
| Préconditions | Navigateur sans cookie de session. |
| Exigences | [RF63](requisitos.md#rf63) |
| Résultat au 18/11/2026 | Réussi (mobile et ordinateur) |

Étapes :

1. Ouvrir /documentacao/diagramas-de-sequencia et exécuter axe.
2. Cliquer sur 7. Inviter quelqu'un à l'étude et exécuter axe.
3. Cliquer sur Suivante.
4. Cliquer sur Précédente.

Résultat attendu : Le sommaire « Dans ce document » a 8 éléments, sans aucun diagramme dans l'ouverture. La section a sa propre adresse, un titre de page avec le document, un h1, « 7 sur 8 » et le diagramme chargé et visible sans défiler. Dans la dernière section, il n'y a pas de Suivante. Zéro violation.

### CT-E85

**Retour mène à la page d'où vient la personne et, sans historique, à la page parente.**

| Champ | Valeur |
|---|---|
| Scénario | [CN18 · Documentation dans l'outil](#cn18) |
| Test | `tests/e2e/documentacao.spec.ts` › "Voltar leva à página de onde a pessoa veio e, sem histórico, à página de cima" |
| Préconditions | Navigateur sans cookie de session. |
| Exigences | [RF63](requisitos.md#rf63) |
| Résultat au 18/11/2026 | Réussi (mobile et ordinateur) |

Étapes :

1. Dans une section des Diagrammes de séquence, suivre le lien vers Architecture.
2. Cliquer sur Retour.
3. Dans un autre onglet, ouvrir directement le diagramme du modèle logique.
4. Cliquer sur Retour.

Résultat attendu : Le lien mène à /documentacao/arquitetura/implantacao. Le premier Retour revient à la section d'origine, dans un autre document. Sans historique, Retour mène à l'ouverture du document.

### CT-E86

**Une section avec beaucoup de sous-sections devient un sommaire, et les liens de tableau et les anciennes adresses trouvent la bonne page.**

| Champ | Valeur |
|---|---|
| Scénario | [CN18 · Documentation dans l'outil](#cn18) |
| Test | `tests/e2e/documentacao.spec.ts` › "seção com muitas subseções vira índice, e o link de uma tabela leva à página da linha" |
| Préconditions | Navigateur sans cookie de session. |
| Exigences | [RF65](requisitos.md#rf65) |
| Résultat au 18/11/2026 | Réussi (mobile et ordinateur) |

Étapes :

1. Ouvrir Cas de bout en bout et cliquer sur CT-E02.
2. Dans Scénarios, cliquer sur CT-E01.
3. Ouvrir /documentacao/casos-de-teste#ct-e03 et #ct-u01.
4. Ouvrir une section qui n'existe pas et une d'un document non publié.

Résultat attendu : Chaque cas a sa propre page, sans violation. L'ancien fragment redirige vers la nouvelle page, et #ct-u01 reste visible dans le tableau du scénario. Une section inexistante et un document non publié donnent 404.

### CT-E87

**Un document court reste entier, sans clics supplémentaires.**

| Champ | Valeur |
|---|---|
| Scénario | [CN18 · Documentation dans l'outil](#cn18) |
| Test | `tests/e2e/documentacao.spec.ts` › "documento curto continua inteiro, com o índice da página na ficha" |
| Préconditions | Navigateur sans cookie de session. |
| Exigences | [RF63](requisitos.md#rf63) |
| Résultat au 18/11/2026 | Réussi (mobile et ordinateur) |

Étapes :

1. Ouvrir /documentacao/checklist-manual.

Résultat attendu : Les sections apparaissent sur la même page, sans le sommaire « Dans ce document », et la fiche liste les ancres.

### CT-E88

**Pendant que l'action s'exécute, le bouton montre qu'il est en cours de traitement et rien n'est envoyé deux fois.**

| Champ | Valeur |
|---|---|
| Scénario | [CN03 · Gestion des études](#cn03) |
| Test | `tests/e2e/estudos.spec.ts` › "enquanto cria o estudo o botão mostra que está processando, ignora novos cliques e no fim confirma" |
| Préconditions | Chercheur connecté ; le test retarde les envois de 1,2 s. |
| Exigences | [RNF20](requisitos.md#rnf20) |
| Résultat au 18/11/2026 | Réussi (mobile et ordinateur) |

Étapes :

1. Remplir Créer une étude et cliquer sur Créer une étude.
2. Cliquer encore deux fois sur le bouton occupé et appuyer sur Entrée.
3. Attendre la page de l'étude et exécuter axe.
4. Ouvrir la liste des études.

Résultat attendu : Le bouton indique « Création de l'étude… », avec aria-busy et aria-disabled. La page de l'étude affiche « Étude créée avec succès. » et la liste n'a qu'une seule étude avec ce titre. Zéro violation.

### CT-E89

**La confirmation suit le défilement, peut être fermée et ne revient pas au rechargement.**

| Champ | Valeur |
|---|---|
| Scénario | [CN03 · Gestion des études](#cn03) |
| Test | `tests/e2e/estudos.spec.ts` › "a confirmação pode ser fechada e continua à vista depois de rolar a página" |
| Préconditions | Chercheur connecté ; fenêtre de 800 × 400 px. |
| Exigences | [RNF20](requisitos.md#rnf20) |
| Résultat au 18/11/2026 | Réussi (mobile et ordinateur) |

Étapes :

1. Créer une étude.
2. Défiler jusqu'au bas de la page.
3. Cliquer sur Fermer dans la confirmation.
4. Recharger.

Résultat attendu : La confirmation reste visible après le défilement et disparaît à la fermeture. L'avis sort de l'adresse, et recharger ne confirme pas à nouveau.

### CT-E90

**Créer le compte, se déconnecter et se connecter sont confirmés à l'écran.**

| Champ | Valeur |
|---|---|
| Scénario | [CN01 · Accès et authentification](#cn01) |
| Test | `tests/e2e/autenticacao.spec.ts` › "criar a conta e entrar confirmam na tela" |
| Préconditions | Nouvelle adresse e-mail de test. |
| Exigences | [RF01](requisitos.md#rf01), [RF02](requisitos.md#rf02), [RNF20](requisitos.md#rnf20) |
| Résultat au 18/11/2026 | Réussi (mobile et ordinateur) |

Étapes :

1. Créer le compte et passer la visite guidée.
2. Se déconnecter et confirmer.
3. Se reconnecter.

Résultat attendu : « Compte créé avec succès. », « Vous vous êtes déconnecté de votre compte. » et « Vous vous êtes connecté à votre compte. » apparaissent en role=status, et l'adresse reste propre.

### CT-E91

**Le formulaire de consentement donne tout ce que demandent la LGPD et la Résolution CNS 510/2016, et la personne peut en garder une copie.**

| Champ | Valeur |
|---|---|
| Scénario | [CN05 · Participation à l'étude](#cn05) |
| Test | `tests/e2e/questionario.spec.ts` › "o termo diz o tempo, como desistir, o que acontece depois de enviar, riscos, benefícios e quem responde, e tem uma via para guardar" |
| Préconditions | Étude ouverte avec données facultatives, créée par un chercheur de test. |
| Exigences | [RF25](requisitos.md#rf25) |
| Résultat au 18/11/2026 | Réussi (mobile et ordinateur) |

Étapes :

1. Ouvrir le lien du participant.
2. Lire le formulaire de consentement et exécuter axe.
3. Ouvrir « Garder une copie de ce formulaire » et exécuter axe.
4. Revenir, choisir l'âge et accepter.

Résultat attendu : Le sous-titre indique l'institution. Le formulaire dit « De 4 à 6 minutes, sans limite de temps », parle des données facultatives, de « Quitter sans envoyer », du fait qu'il est impossible de retirer les réponses après l'envoi, de la conservation pendant la durée de la recherche, des risques, des bénéfices et du contact du responsable. La copie a « Imprimer ou enregistrer en PDF » et aucun lien hors de l'étude. Le questionnaire indique la durée. Zéro violation.

### CT-E92

**Sans l'âge, ou avec moins de 18 ans sans l'autorisation du responsable légal, rien n'est enregistré.**

| Champ | Valeur |
|---|---|
| Scénario | [CN23 · Protection des données](#cn23) |
| Test | `tests/e2e/questionario.spec.ts` › "quem tem menos de 18 anos só participa com a autorização do responsável, e sem idade nada é gravado" |
| Préconditions | Étude ouverte avec données facultatives. |
| Exigences | [RF25](requisitos.md#rf25) |
| Résultat au 18/11/2026 | Réussi (mobile et ordinateur) |

Étapes :

1. Accepter sans choisir l'âge.
2. Choisir « Moins de 18 ans » et accepter sans l'autorisation.
3. Confirmer l'autorisation et accepter.
4. Répondre, envoyer et passer les données facultatives.

Résultat attendu : Chaque erreur apparaît en role=alert, avec le focus sur le bon champ, et l'autorisation n'apparaît que pour « Moins de 18 ans ». Avec elle, le questionnaire s'ouvre, les données facultatives ont « Moins de 18 ans » et la participation est enregistrée comme celle d'un mineur. Zéro violation.

### CT-E93

**Le formulaire exige le responsable de la recherche et suggère le reste.**

| Champ | Valeur |
|---|---|
| Scénario | [CN03 · Gestion des études](#cn03) |
| Test | `tests/e2e/estudos.spec.ts` › "o estudo nasce com o responsável da conta e exige nome, contato e instituição, que vão para o termo" |
| Préconditions | Chercheur connecté. |
| Exigences | [RF13](requisitos.md#rf13) |
| Résultat au 18/11/2026 | Réussi (mobile et ordinateur) |

Étapes :

1. Ouvrir Créer une étude.
2. Effacer le nom du responsable, saisir une adresse e-mail invalide et laisser l'institution vide.
3. Essayer de créer.
4. Remplir les trois champs et créer.

Résultat attendu : Le formulaire arrive déjà avec le nom et l'adresse e-mail du compte et avec des suggestions de risques et de bénéfices. Les trois erreurs apparaissent dans le résumé et dans les champs. L'aperçu affiche « Ana Souza · PPGIa · PUCPR », et la fiche de l'étude affiche le responsable et le contact.

### CT-E94

**Le sélecteur de la barre est un raccourci vers Mon compte › Langue, sans quitter la page.**

| Champ | Valeur |
|---|---|
| Scénario | [CN24 · Langue de l'outil](#cn24) |
| Test | `tests/e2e/idioma-interface.spec.ts` › "o seletor de idioma da barra troca a ferramenta e a conta sem sair da página" |
| Préconditions | Nouveau compte, créé uniquement au clavier. |
| Exigences | [RF08](requisitos.md#rf08) |
| Résultat au 18/11/2026 | Réussi (mobile et ordinateur) |

Étapes :

1. Ouvrir le sélecteur « Idioma: Português » dans la barre (sur mobile, dans le Menu).
2. Exécuter axe avec la liste ouverte.
3. Fermer avec Échap.
4. Rouvrir et choisir « Deutsch ».
5. Ouvrir Mon compte › Langue.

Résultat attendu : La liste « Idioma da ferramenta » (langue de l'outil) affiche les 37 langues, avec Português coché. Échap ferme et rend le focus au sélecteur. Après le choix de l'allemand, la page reste sur /estudos, la barre affiche « Mein Konto », le focus revient au sélecteur, désormais « Sprache: Deutsch », et Mon compte › Langue est sur Deutsch. Zéro violation.

### CT-E95

**Sans connexion, le sélecteur de la barre change aussi la langue, et le choix reste dans ce navigateur.**

| Champ | Valeur |
|---|---|
| Scénario | [CN24 · Langue de l'outil](#cn24) |
| Test | `tests/e2e/idioma-interface.spec.ts` › "sem login, o seletor de idioma da barra fica guardado neste navegador" |
| Préconditions | Sans connexion. |
| Exigences | [RF08](requisitos.md#rf08) |
| Résultat au 18/11/2026 | Réussi (mobile et ordinateur) |

Étapes :

1. Ouvrir la Documentation.
2. Choisir « English » dans le sélecteur de la barre.
3. Recharger la page.

Résultat attendu : Le focus revient au sélecteur, désormais « Language: English », et la page reste en anglais après le rechargement.

### CT-E96

**Dans chaque scénario de validation, le tableau de bord et le tableur exporté correspondent au tableur officiel.**

| Champ | Valeur |
|---|---|
| Scénario | [CN15 · Validation par rapport au tableur officiel](#cn15) |
| Test | `tests/e2e/planilha-oficial.spec.ts` › "cenário …: o painel e a planilha exportada batem com a planilha oficial", un par scénario : oficial-exemplo, grande, inconsistente, bordas, variancia-zero, negativo et extremos/n2 |
| Préconditions | Étude sans réponses. Le esperado.json de chaque scénario provient de l'UEQ Data Analysis Tool V15 recalculée dans Excel ([data/fixtures/LEIA-ME.md](../../data/fixtures/LEIA-ME.md)). |
| Exigences | [RF59](requisitos.md#rf59), [RF61](requisitos.md#rf61), [RNF11](requisitos.md#rnf11) |
| Résultat au 18/11/2026 | Réussi (mobile et ordinateur, 7 scénarios dans chaque cas) |

Étapes :

1. Dans Réponses › Importer des réponses depuis un CSV, importer le respostas.csv du scénario dans la version « Checkout da loja virtual ».
2. Dans Résultats, choisir cette version.
3. Comparer le tableau Résultats par échelle avec le esperado.json.
4. Télécharger Tableur officiel de l'UEQ (XLSX).

Résultat attendu : Pour chacune des 6 échelles, n, moyenne, ET, IC95, alpha et benchmark identiques à ceux du tableur officiel, arrondis comme le montre le tableau de bord (« — » là où le tableur donne une erreur). Le fichier s'appelle ueq_avaliacao-do-checkout-da-loja-virtual_planilha-oficial_checkout-da-loja-virtual_<aaaa-mm-dd>.xlsx, contient les réponses du fichier importé dans Data!A4, dans le même ordre, et demande à Excel de recalculer à l'ouverture.

### CT-E97

**Le formulaire explique la différence et le participant répond aux 8 paires de l'UEQ-S.**

| Champ | Valeur |
|---|---|
| Scénario | [CN16 · UEQ-S](#cn16) |
| Test | `tests/e2e/ueq-s.spec.ts` › "o formulário explica a diferença e o participante responde os 8 pares do UEQ-S" |
| Préconditions | Chercheur avec une étude UEQ-S ouverte, sans données facultatives. |
| Exigences | [RF62](requisitos.md#rf62), [RF25](requisitos.md#rf25) |
| Résultat au 18/11/2026 | Réussi (mobile et ordinateur) |

Étapes :

1. Ouvrir le lien : le formulaire de consentement indique 8 paires et De 1 à 2 minutes.
2. Accepter et vérifier les 8 groupes, avec « Item 4 de 8: Confuso ou Evidente » et « Item 7 de 8: Convencional ou Original » (les termes portugais du questionnaire).
3. Cocher la sixième position pour les 8 et envoyer.
4. Ouvrir Résultats en tant que chercheur.
5. Ouvrir Modifier l'étude.

Résultat attendu : La vue d'ensemble indique UEQ-S, version courte · 8 items · 37 langues. Résultats mène à /resultados/ueq-s, avec n = 1, pragmatique 2,00, la générale sans alpha et sans le tableur de l'UEQ complet ; axe sans violation. Dans la modification, le choix apparaît verrouillé avec le motif.

### CT-E98

**Dans chaque scénario de l'UEQ-S, l'onglet UEQ-S et le tableur exporté correspondent au tableur officiel de l'UEQ-S.**

| Champ | Valeur |
|---|---|
| Scénario | [CN16 · UEQ-S](#cn16) |
| Test | `tests/e2e/ueq-s.spec.ts` › "UEQ-S, cenário …: o painel e a planilha exportada batem com a planilha oficial do UEQ-S", un par scénario : oficial-exemplo, bordas, variancia-zero, negativo et n2 |
| Préconditions | Étude UEQ-S sans réponses. Le esperado.json de chaque scénario provient du tableur officiel de l'UEQ-S recalculé dans Excel ([data/fixtures-ueq-s/LEIA-ME.md](../../data/fixtures-ueq-s/LEIA-ME.md)). |
| Exigences | [RF61](requisitos.md#rf61), [RF62](requisitos.md#rf62), [RNF11](requisitos.md#rnf11) |
| Résultat au 18/11/2026 | Réussi (mobile et ordinateur, 5 scénarios dans chaque cas) |

Étapes :

1. Dans Réponses › Importer des réponses depuis un CSV, vérifier que le format demande 8 valeurs et importer le respostas.csv du scénario.
2. Dans Résultats (onglet UEQ-S), choisir la version.
3. Comparer le tableau Résultats par échelle avec le esperado.json.
4. Télécharger Tableur officiel de l'UEQ-S (XLSX).

Résultat attendu : Pour la pragmatique, l'hédonique et la générale, n, moyenne, ET, IC95, alpha et benchmark identiques à ceux du tableur de l'UEQ-S, arrondis comme le montre le tableau de bord. Le fichier se termine par _planilha-oficial-ueq-s_checkout-da-loja-virtual_<aaaa-mm-dd>.xlsx, contient les réponses importées dans Data!A4, dans le même ordre, et demande un recalcul à l'ouverture.

### CT-E99

**Dans une étude de l'UEQ complet, l'onglet UEQ-S utilise les 8 paires équivalentes et correspond au tableur de l'UEQ-S.**

| Champ | Valeur |
|---|---|
| Scénario | [CN16 · UEQ-S](#cn16) |
| Test | `tests/e2e/ueq-s.spec.ts` › "num estudo do UEQ completo, a aba UEQ-S usa os 8 pares equivalentes e bate com a planilha do UEQ-S" |
| Préconditions | Étude de l'UEQ complet avec les 20 réponses du scénario basico. |
| Exigences | [RF62](requisitos.md#rf62), [RNF11](requisitos.md#rnf11) |
| Résultat au 18/11/2026 | Réussi (mobile et ordinateur) |

Étapes :

1. Dans Résultats, ouvrir le sous-onglet UEQ-S.
2. Choisir la version.
3. Comparer le tableau avec data/fixtures-ueq-s/do-ueq-basico/esperado.json.
4. Télécharger Tableur officiel de l'UEQ-S (XLSX).

Résultat attendu : L'onglet explique d'où viennent les chiffres ; le tableau correspond au tableur de l'UEQ-S ; le tableur téléchargé contient les 8 items de chaque participant dans l'ordre et du côté de l'UEQ-S ; l'onglet ne répète pas les réponses brutes et propose les résultats de l'UEQ-S en CSV ; axe sans violation.

### CT-E100

**La page d'accueil compare l'UEQ et l'UEQ-S.**

| Champ | Valeur |
|---|---|
| Scénario | [CN16 · UEQ-S](#cn16) |
| Test | `tests/e2e/ueq-s.spec.ts` › "a página inicial compara o UEQ e o UEQ-S" |
| Préconditions | Sans connexion. |
| Exigences | [RF62](requisitos.md#rf62) |
| Résultat au 18/11/2026 | Réussi (mobile et ordinateur) |

Étapes :

1. Ouvrir /#ueq-e-ueq-s.

Résultat attendu : La section UEQ ou UEQ-S contient le tableau des différences (8 paires tirées des 26, de 1 à 2 minutes) et les 8 paires, chacune lue comme Item n : de … à … ; axe sans violation.

### CT-E101

**AA sur les écrans de l'UEQ-S : reflow à 320 px, clavier, contraste élevé et état verrouillé.**

| Champ | Valeur |
|---|---|
| Scénario | [CN16 · UEQ-S](#cn16) |
| Test | `tests/e2e/ueq-s.spec.ts` › "AA: em 320 px nada rola na horizontal, e a escolha do questionário funciona só com o teclado" |
| Préconditions | Chercheur avec une étude UEQ-S. |
| Exigences | [RF62](requisitos.md#rf62), [RNF01](requisitos.md#rnf01), [RNF02](requisitos.md#rnf02), [RNF03](requisitos.md#rnf03) |
| Résultat au 18/11/2026 | Réussi (mobile et ordinateur) |

Étapes :

1. Dans Créer une étude, mettre le focus sur UEQ complet et appuyer sur la flèche vers le bas.
2. Réduire l'écran à 320 px et activer le contraste élevé.
3. Enregistrer des réponses et ouvrir l'onglet UEQ-S, dans les modes Une version et Comparer les versions.
4. Ouvrir Modifier l'étude.
5. Ouvrir la page d'accueil sur #ueq-e-ueq-s.

Résultat attendu : La flèche coche UEQ-S, version courte avec le focus visible sur la carte. À 320 px, aucun de ces écrans ne défile horizontalement (WCAG 1.4.10), et axe ne trouve de violation WCAG 2.2 A et AA sur aucun, y compris en contraste élevé. Dans la modification, les deux boutons radio sont désactivés.

### CT-E102

**En croate, le questionnaire de l'UEQ-S utilise les paires de la liste officielle de l'UEQ-S, et non celles de l'UEQ complet.**

| Champ | Valeur |
|---|---|
| Scénario | [CN16 · UEQ-S](#cn16) |
| Test | `tests/e2e/ueq-s.spec.ts` › "em croata, o questionário do UEQ-S mostra os pares da lista oficial do UEQ-S" |
| Préconditions | Étude UEQ-S ouverte, en croate (hr). |
| Exigences | [RF62](requisitos.md#rf62), [RF34](requisitos.md#rf34), [RNF01](requisitos.md#rnf01) |
| Résultat au 18/11/2026 | Réussi (mobile et ordinateur) |

Étapes :

1. Ouvrir le lien du participant.
2. Indiquer avoir 18 ans ou plus et accepter le formulaire de consentement.
3. Lire les items 7 et 8 du questionnaire.

Résultat attendu : L'item 7 dit konvencionalna et inventivna et l'item 8 se termine par predvodnička, comme dans la liste officielle des items de l'UEQ-S (pour les mêmes paires, l'UEQ complet dit neoriginalan/originalan et uobičajen/nov) ; axe ne trouve aucune violation WCAG 2.2 A et AA.

## Cas unitaires

Chaque cas regroupe les tests unitaires d'une même règle. La colonne Exécutions compte les tests réels : un cas paramétré s'exécute une fois par langue ou par paire de couleurs.

### CN08 · Calcul UEQ

| ID | Fichier | Fonction ou groupe | Résultat attendu | Exécutions | Exigences | Résultat au 18/11/2026 |
|---|---|---|---|---|---|---|
| <a id="ct-u01"></a>CT-U01 | `recodificar.test.ts` | `recodificar` | Avec le positif à droite, 1 devient -3, 4 devient 0 et 7 devient 3 | 1 | [RF36](requisitos.md#rf36), [RNF25](requisitos.md#rnf25) | Réussi |
| <a id="ct-u02"></a>CT-U02 | `recodificar.test.ts` | `recodificar` | Avec le positif à gauche, 1 devient 3, 4 devient 0 et 7 devient -3 | 1 | [RF36](requisitos.md#rf36), [RNF25](requisitos.md#rnf25) | Réussi |
| <a id="ct-u03"></a>CT-U03 | `recodificar.test.ts` | `recodificar` | Refuse 0, 8, 3,5 et NaN, qui n'existent pas sur l'échelle de 1 à 7 | 6 | [RF36](requisitos.md#rf36) | Réussi (6 sur 6) |
| <a id="ct-u04"></a>CT-U04 | `recodificar.test.ts` | `recodificarParticipante` | Transforme le point du milieu en 0 sur les 26 items | 1 | [RF36](requisitos.md#rf36) | Réussi |
| <a id="ct-u05"></a>CT-U05 | `recodificar.test.ts` | `recodificarParticipante` | Applique la polarité de chaque item : 7 partout donne +3 sur les items '+' et -3 sur les items '-' | 1 | [RF36](requisitos.md#rf36) | Réussi |
| <a id="ct-u06"></a>CT-U06 | `recodificar.test.ts` | `recodificarParticipante` | Refuse un participant sans les 26 réponses | 1 | [RF36](requisitos.md#rf36) | Réussi |
| <a id="ct-u07"></a>CT-U07 | `estatistica.test.ts` | `media` | Renvoie null sans valeurs et calcule la moyenne simple | 2 | [RF37](requisitos.md#rf37), [RNF25](requisitos.md#rnf25) | Réussi (2 sur 2) |
| <a id="ct-u08"></a>CT-U08 | `estatistica.test.ts` | `desvioPadraoAmostral` | Null avec n = 0 et n = 1, diviseur n - 1 et zéro quand tous sont égaux | 3 | [RF37](requisitos.md#rf37) | Réussi (3 sur 3) |
| <a id="ct-u09"></a>CT-U09 | `estatistica.test.ts` | `intervaloConfianca95` | Moyenne ± z · ET / √n ; null sans ET (n = 1) et avec ET = 0, comme le #NUM! du tableur | 3 | [RF37](requisitos.md#rf37) | Réussi (3 sur 3) |
| <a id="ct-u10"></a>CT-U10 | `estatistica.test.ts` | `correlacao` | Corrélation de Pearson ; null sans variation ou avec moins de 2 paires ; refuse des séries de tailles différentes | 4 | [RF37](requisitos.md#rf37) | Réussi (4 sur 4) |
| <a id="ct-u11"></a>CT-U11 | `estatistica.test.ts` | `alfaCronbach` | Alpha standardisé k · r̄ / (1 + (k - 1) · r̄) ; 1 quand les items vont ensemble ; null avec moins de 2 items, un item sans variation (#DIV/0!), un dénominateur nul ou un seul participant | 6 | [RF37](requisitos.md#rf37) | Réussi (6 sur 6) |
| <a id="ct-u12"></a>CT-U12 | `escalas.test.ts` | `escoresPorParticipante` | +3 sur toutes les échelles pour qui coche toujours le pôle positif ; moyenne des seuls items de l'échelle | 2 | [RF37](requisitos.md#rf37), [RNF25](requisitos.md#rnf25) | Réussi (2 sur 2) |
| <a id="ct-u13"></a>CT-U13 | `escalas.test.ts` | `faixaInterpretacao` | -0,8 et 0,8 sont neutres ; au-dessus de 0,8 positive, en dessous de -0,8 négative | 2 | [RF38](requisitos.md#rf38) | Réussi (2 sur 2) |
| <a id="ct-u14"></a>CT-U14 | `escalas.test.ts` | `resultadoPorEscala` | Cas limites n = 0, n = 1 et tous égaux, et moyenne, ET, IC et alpha avec deux participants | 4 | [RF37](requisitos.md#rf37), [RNF25](requisitos.md#rnf25) | Réussi (4 sur 4) |
| <a id="ct-u15"></a>CT-U15 | `escalas.test.ts` | `resultadoPorItem` | Les 26 items dans l'ordre avec la moyenne recodée et la distribution de 1 à 7 | 1 | [RF41](requisitos.md#rf41) | Réussi |
| <a id="ct-u16"></a>CT-U16 | `benchmark.test.ts` | `classificarBenchmark` | Une moyenne dans chacune des 5 tranches : excellent, bon, au-dessus de la moyenne, en dessous de la moyenne et mauvais | 8 | [RF40](requisitos.md#rf40) | Réussi (8 sur 8) |
| <a id="ct-u17"></a>CT-U17 | `benchmark.test.ts` | `classificarBenchmark` | Une moyenne égale à la limite reste dans la tranche inférieure ; utilise les limites de l'échelle demandée ; null sans moyenne | 8 | [RF40](requisitos.md#rf40) | Réussi (8 sur 8) |
| <a id="ct-u18"></a>CT-U18 | `analisar-estudo.test.ts` | `analisarEstudo` | Statistiques uniquement avec les participations incluses dans l'analyse | 1 | [RF42](requisitos.md#rf42) | Réussi |
| <a id="ct-u20"></a>CT-U20 | `analisar-estudo.test.ts` | `analisarEstudo` | Classe dans le benchmark et calcule la pragmatique et l'hédonique par la moyenne des échelles | 1 | [RF39](requisitos.md#rf39), [RF40](requisitos.md#rf40) | Réussi |
| <a id="ct-u21"></a>CT-U21 | `analisar-estudo.test.ts` | `analisarEstudo` | Signale un alpha inférieur au minimum du protocole | 1 | [RF37](requisitos.md#rf37), [RF45](requisitos.md#rf45) | Réussi |
| <a id="ct-u22"></a>CT-U22 | `analisar-estudo.test.ts` | `analisarEstudo` | Sans personne dans l'analyse, renvoie des nombres null, sans planter | 1 | [RF42](requisitos.md#rf42), [RNF25](requisitos.md#rnf25) | Réussi |

### CN09 · Réponses suspectes

| ID | Fichier | Fonction ou groupe | Résultat attendu | Exécutions | Exigences | Résultat au 18/11/2026 |
|---|---|---|---|---|---|---|
| <a id="ct-u19"></a>CT-U19 | `analisar-estudo.test.ts` | `analisarEstudo` | Évalue la suspicion de toutes les participations, y compris les exclues | 1 | [RF42](requisitos.md#rf42), [RF51](requisitos.md#rf51) | Réussi |
| <a id="ct-u23"></a>CT-U23 | `inconsistencia.test.ts` | `amplitudePorEscala` | Zéro pour des réponses cohérentes ; reproduit l'exemple de clarté du handbook (distance 5) | 2 | [RF51](requisitos.md#rf51) | Réussi (2 sur 2) |
| <a id="ct-u24"></a>CT-U24 | `inconsistencia.test.ts` | `respostasIguais` | Compte la position la plus répétée | 1 | [RF51](requisitos.md#rf51) | Réussi |
| <a id="ct-u25"></a>CT-U25 | `inconsistencia.test.ts` | `marcarSuspeitos` | Suspect avec 3 échelles incohérentes, pas avec 2 ; une amplitude égale à 3 n'est pas une incohérence | 7 | [RF51](requisitos.md#rf51) | Réussi (7 sur 7) |
| <a id="ct-u26"></a>CT-U26 | `inconsistencia.test.ts` | `marcarSuspeitos` | Suspect avec plus de 15 réponses identiques, pas avec exactement 15 | 7 | [RF51](requisitos.md#rf51) | Réussi (7 sur 7) |
| <a id="ct-u27"></a>CT-U27 | `inconsistencia.test.ts` | `marcarSuspeitos` | Indique les deux motifs quand les deux règles s'appliquent ; lit les seuils dans la configuration | 7 | [RF51](requisitos.md#rf51) | Réussi (7 sur 7) |
| <a id="ct-u28"></a>CT-U28 | `fixtures.test.ts` | `fixtures conforme os LEIA-ME` | basico sans suspects ; inconsistente marque exactement les lignes 1, 6, 9 et 13 ; todos-1 et todos-7 tombent sous la règle des réponses identiques | 3 | [RF51](requisitos.md#rf51) | Réussi (3 sur 3) |

### CN15 · Validation par rapport au tableur officiel

| ID | Fichier | Fonction ou groupe | Résultat attendu | Exécutions | Exigences | Résultat au 18/11/2026 |
|---|---|---|---|---|---|---|
| <a id="ct-u29"></a>CT-U29 | `fixtures.test.ts` | `fixture … contra a planilha oficial` | Pour chacun des 11 scénarios de data/fixtures : moyenne, ET, n et IC95 des échelles et des items, alpha, benchmark, pragmatique, hédonique, distribution des réponses, échelles incohérentes et réponses identiques par participant égaux à ceux du tableur, avec une tolérance de 1e-6 ; une erreur du tableur donne null | 77 | [RNF11](requisitos.md#rnf11) | Réussi (77 sur 77) |
| <a id="ct-u70"></a>CT-U70 | `planilha-oficial.test.ts` | `preencherPlanilhaOficial` | Place les réponses dans Data!A4 et retire les 255 participants d'exemple ; conserve les lignes 1 à 3 ; place la langue dans Read_First!B5, avec un nom de l'onglet Items pour chacune des 37 langues ; efface les résultats enregistrés et demande un recalcul à l'ouverture ; ne touche ni aux graphiques, ni aux styles, ni aux autres parties ; sans participants, sort vide ; refuse plus de 1000 participants et des valeurs hors de 1 à 7 | 8 | [RF59](requisitos.md#rf59) | Réussi (8 sur 8) |

### CN05 · Participation à l'étude

| ID | Fichier | Fonction ou groupe | Résultat attendu | Exécutions | Exigences | Résultat au 18/11/2026 |
|---|---|---|---|---|---|---|
| <a id="ct-u30"></a>CT-U30 | `balanceamento.test.ts` | `versaoComMenosRespostas` | Choisit la version qui a le moins de réponses terminées ; en cas d'égalité, celle de plus petit ordre ; avec une seule version, celle-ci ; sans versions, null | 4 | [RF26](requisitos.md#rf26) | Réussi (4 sur 4) |

### CN11 · Exportation en CSV

| ID | Fichier | Fonction ou groupe | Résultat attendu | Exécutions | Exigences | Résultat au 18/11/2026 |
|---|---|---|---|---|---|---|
| <a id="ct-u31"></a>CT-U31 | `csv.test.ts` | `campoCsv` | Le texte simple reste tel quel ; point-virgule et saut de ligne vont entre guillemets ; les guillemets internes sont doublés ; une absence reste vide | 5 | [RF56](requisitos.md#rf56) | Réussi (5 sur 5) |
| <a id="ct-u32"></a>CT-U32 | `csv.test.ts` | `documentoCsv` | Commence par un BOM, utilise ; et termine chaque ligne par CRLF ; sort sans BOM sur demande | 2 | [RF56](requisitos.md#rf56), [RF57](requisitos.md#rf57), [RF58](requisitos.md#rf58) | Réussi (2 sur 2) |
| <a id="ct-u33"></a>CT-U33 | `csv.test.ts` | `decimalCsv e slugDoTitulo` | Virgule décimale et vide en cas d'absence ; nom de fichier sans accents, espaces ni symboles, et jamais vide | 3 | [RF58](requisitos.md#rf58), [RNF22](requisitos.md#rnf22) | Réussi (3 sur 3) |
| <a id="ct-u34"></a>CT-U34 | `exportacoes.test.ts` | `linhasDaPlanilhaOficial` | De la fixture basico sortent les mêmes lignes que dans le respostas.csv d'origine ; laisse de côté ceux qui sont hors de l'analyse | 2 | [RF59](requisitos.md#rf59) | Réussi (2 sur 2) |
| <a id="ct-u35"></a>CT-U35 | `exportacoes.test.ts` | `exportarBrutas` | BOM, en-tête et 26 colonnes d'items ; version et données démographiques protégées contre ;, guillemets et sauts de ligne | 2 | [RF56](requisitos.md#rf56) | Réussi (2 sur 2) |
| <a id="ct-u37"></a>CT-U37 | `exportacoes.test.ts` | `exportarRecodificadas` | Remplace 1 à 7 par -3 à +3 avec la polarité corrigée | 1 | [RF57](requisitos.md#rf57) | Réussi |
| <a id="ct-u38"></a>CT-U38 | `exportacoes.test.ts` | `exportarResultados` | Une ligne par échelle, avec virgule décimale | 1 | [RF58](requisitos.md#rf58) | Réussi |

### CN07 · Langues

| ID | Fichier | Fonction ou groupe | Résultat attendu | Exécutions | Exigences | Résultat au 18/11/2026 |
|---|---|---|---|---|---|---|
| <a id="ct-u36"></a>CT-U36 | `exportacoes.test.ts` | `idioma nas exportações` | Indique dans quelle langue la personne a répondu et si la traduction est approuvée ; une réponse importée sort avec l'origine et sans langue | 2 | [RF52](requisitos.md#rf52), [RF61](requisitos.md#rf61) | Réussi (2 sur 2) |
| <a id="ct-u45"></a>CT-U45 | `idiomas.test.ts` | `os 37 idiomas do pacote oficial` | Les 37 langues sont complètes et chacune a les 26 paires dans l'ordre, remplies et avec des termes différents | 41 | [RF34](requisitos.md#rf34), [RNF10](requisitos.md#rnf10) | Réussi (41 sur 41) |
| <a id="ct-u46"></a>CT-U46 | `idiomas.test.ts` | `os 37 idiomas do pacote oficial` | Le portugais est exactement celui de data/ueq-itens-ptbr.json, qui alimente la base de données | 1 | [RNF10](requisitos.md#rnf10) | Réussi |
| <a id="ct-u47"></a>CT-U47 | `idiomas.test.ts` | `os 37 idiomas do pacote oficial` | Marque les 9 langues sans traduction approuvée et les 3 qui s'écrivent de droite à gauche ; toute correction garde la paire d'origine et le motif | 41 | [RF34](requisitos.md#rf34), [RNF10](requisitos.md#rnf10) | Réussi (41 sur 41) |
| <a id="ct-u48"></a>CT-U48 | `idiomas.test.ts` | `textos das telas` | Dans chaque langue, aucun texte vide, les mêmes {marqueurs} que le portugais et le nom accessible de chaque cercle avec la position et le pôle | 38 | [RF34](requisitos.md#rf34), [RNF04](requisitos.md#rnf04) | Réussi (38 sur 38) |
| <a id="ct-u49"></a>CT-U49 | `idiomas.test.ts` | `plural e lista` | Pluriel dans la forme de la langue (avec repli sur other) et listes jointes comme la langue les joint | 2 | [RF34](requisitos.md#rf34) | Réussi (2 sur 2) |
| <a id="ct-u50"></a>CT-U50 | `idiomas.test.ts` | `negociarIdioma` | Choisit la première des 37 selon la préférence du navigateur, accepte d'anciens codes, se rabat sur le portugais et donne le lang de chaque langue | 3 | [RF34](requisitos.md#rf34) | Réussi (3 sur 3) |

### CN13 · Importation par CSV

| ID | Fichier | Fonction ou groupe | Résultat attendu | Exécutions | Exigences | Résultat au 18/11/2026 |
|---|---|---|---|---|---|---|
| <a id="ct-u39"></a>CT-U39 | `importacao.test.ts` | `lerCsvDeRespostas` | Lit la fixture basico comme le module UEQ | 5 | [RF61](requisitos.md#rf61) | Réussi (5 sur 5) |
| <a id="ct-u40"></a>CT-U40 | `importacao.test.ts` | `lerCsvDeRespostas` | Accepte virgule, tabulation, BOM, guillemets et séparateur en trop ; ignore les lignes vides en gardant le vrai numéro de chaque ligne | 6 | [RF61](requisitos.md#rf61) | Réussi (6 sur 6) |
| <a id="ct-u41"></a>CT-U41 | `importacao.test.ts` | `lerCsvDeRespostas` | Signale par ligne le mauvais nombre de valeurs et les valeurs hors de l'échelle ; refuse un fichier avec trop de lignes | 6 | [RF61](requisitos.md#rf61) | Réussi (6 sur 6) |

### CN10 · Tableau de bord des résultats

| ID | Fichier | Fonction ou groupe | Résultat attendu | Exécutions | Exigences | Résultat au 18/11/2026 |
|---|---|---|---|---|---|---|
| <a id="ct-u42"></a>CT-U42 | `leitura-rapida.test.ts` | `leituraDeUmaVersao` | Reproduit la phrase du prototype r6 ; regroupe les échelles de la même tranche et cite les négatives ; null sans moyenne | 3 | [RF44](requisitos.md#rf44) | Réussi (3 sur 3) |
| <a id="ct-u43"></a>CT-U43 | `leitura-rapida.test.ts` | `leituraDaComparacao` | Indique les deux plus grandes différences et qui elles favorisent ; dit quand les versions sont proches ; avec trois versions, compte les échelles où chacune mène | 3 | [RF47](requisitos.md#rf47) | Réussi (3 sur 3) |
| <a id="ct-u44"></a>CT-U44 | `leitura-rapida.test.ts` | `formatarDecimal` | Virgule, deux décimales et tiret en cas d'absence | 1 | [RNF22](requisitos.md#rnf22) | Réussi |

### CN14 · Couleurs et contraste

| ID | Fichier | Fonction ou groupe | Résultat attendu | Exécutions | Exigences | Résultat au 18/11/2026 |
|---|---|---|---|---|---|---|
| <a id="ct-u51"></a>CT-U51 | `contraste.test.ts` | `contraste dos tokens de cor` | Chaque paire de texte du thème atteint 4,5:1 | 57 | [RNF06](requisitos.md#rnf06) | Réussi (57 sur 57) |
| <a id="ct-u52"></a>CT-U52 | `contraste.test.ts` | `contraste dos tokens de cor` | Chaque bordure de champ, focus et marqueur de graphique atteint 3:1 contre les fonds et les tranches du benchmark | 57 | [RNF06](requisitos.md#rnf06), [RNF07](requisitos.md#rnf07) | Réussi (57 sur 57) |

### CN16 · UEQ-S

| ID | Fichier | Fonction ou groupe | Résultat attendu | Exécutions | Exigences | Résultat au 18/11/2026 |
|---|---|---|---|---|---|---|
| <a id="ct-u53"></a>CT-U53 | `ueq-s.test.ts` | `UEQ-S` | Les 8 items de l'UEQ-S pointent vers des paires de l'UEQ avec la bonne échelle et la bonne polarité, dans l'ordre ; les limites du benchmark sont dans l'ordre | 3 | [RF62](requisitos.md#rf62) | Réussi (3 sur 3) |
| <a id="ct-u71"></a>CT-U71 | `fixtures-ueq-s.test.ts` | `UEQ-S: fixture … contra a planilha oficial do UEQ-S` | Pour chacun des 9 scénarios de data/fixtures-ueq-s : moyenne, ET, n et IC95 de la pragmatique, de l'hédonique, de la générale et des 8 items, alpha, benchmark, les trois scores de chaque participant, échelles incohérentes, réponses identiques et catégorie du milieu égaux à ceux du tableur de l'UEQ-S, avec une tolérance de 1e-6 ; une erreur du tableur donne null | 54 | [RF62](requisitos.md#rf62), [RNF11](requisitos.md#rnf11) | Réussi (54 sur 54) |
| <a id="ct-u72"></a>CT-U72 | `fixtures-ueq-s.test.ts` | `UEQ-S: itens montados` e `fixture bordas` | Les 8 items sont les paires 11, 13, 20, 21, 6, 7, 10 et 15 de l'UEQ, avec les côtés inversés seulement pour les items 4 et 7 ; l'aller-retour entre l'UEQ-S et les items de l'UEQ ne change aucune réponse ; dans le scénario bordas, seules les lignes 3, 4 et 7 sont suspectes | 3 | [RF62](requisitos.md#rf62) | Réussi (3 sur 3) |
| <a id="ct-u73"></a>CT-U73 | `planilha-oficial-ueq-s.test.ts` | `preencherPlanilhaOficial com o modelo do UEQ-S` | Place les 8 réponses dans Data!A4 et retire les 13 d'exemple ; langue dans Read_First!B4, avec un nom de l'onglet Items pour chacune des 37 langues ; efface les résultats enregistrés et demande un recalcul à l'ouverture ; refuse un participant sans les 8 valeurs | 6 | [RF62](requisitos.md#rf62) | Réussi (6 sur 6) |
| <a id="ct-u74"></a>CT-U74 | `exportacoes.test.ts` | `exportações do UEQ-S` | Réponses brutes avec item01 à item08 ; recodées avec x − 4 ; résultats avec pragmatique, hédonique et générale (sans alpha pour la générale), égaux au tableur ; à partir d'une étude de l'UEQ complet, le tableur de l'UEQ-S reçoit les 8 items équivalents | 4 | [RF62](requisitos.md#rf62) | Réussi (4 sur 4) |
| <a id="ct-u75"></a>CT-U75 | `importacao.test.ts` | `lerCsvDeRespostas` | Dans une étude UEQ-S, lit 8 valeurs par ligne et refuse les lignes qui en ont 26 | 1 | [RF61](requisitos.md#rf61), [RF62](requisitos.md#rf62) | Réussi (1 sur 1) |
| <a id="ct-u76"></a>CT-U76 | `termo.test.ts` | `condicoesDoTermo` | Pour l'UEQ-S, le formulaire de consentement indique 1 à 2 minutes (2 à 3 avec les données facultatives) et, dans les 37 langues, 8 paires là où celui de l'UEQ dit 26 | 38 | [RF25](requisitos.md#rf25), [RF62](requisitos.md#rf62) | Réussi (38 sur 38) |
| <a id="ct-u77"></a>CT-U77 | `termos-ueq-s.test.ts` | `termos do UEQ-S em cada idioma` | Les 37 langues ont les 8 paires, toutes différentes ; le portugais est celui de data/ueq-s-itens-ptbr.json et l'anglais celui du handbook ; une langue non marquée comme différente répète la paire de l'UEQ complet, avec les côtés inversés aux items 4 et 7 ; les différentes sont exactement l'italien, le croate, le grec, le turc, le persan et le chinois, avec l'item 7 en croate konvencionalna/inventivna | 4 | [RF62](requisitos.md#rf62), [RF34](requisitos.md#rf34) | Réussi (4 sur 4) |

### CN18 · Documentation dans l'outil

| ID | Fichier | Fonction ou groupe | Résultat attendu | Exécutions | Exigences | Résultat au 18/11/2026 |
|---|---|---|---|---|---|---|
| <a id="ct-u54"></a>CT-U54 | `documentacao.test.ts` | `catálogo da documentação` | Chaque document et téléchargement du catalogue existe ; chaque document a une seule adresse ; tout .md de docs/documentacao est dans le catalogue ; une adresse hors du catalogue ne devient pas un document | 3 | [RF63](requisitos.md#rf63), [RF65](requisitos.md#rf65) | Réussi (3 sur 3) |
| <a id="ct-u55"></a>CT-U55 | `documentacao.test.ts` | `diagramas` | Chaque diagramme Mermaid des documents a son SVG généré et un fichier source identique à celui du document, et il ne reste aucun SVG inutilisé | 3 | [RF63](requisitos.md#rf63), [RF64](requisitos.md#rf64) | Réussi (3 sur 3) |
| <a id="ct-u56"></a>CT-U56 | `documentacao.test.ts` | `destinoDoLink` | Un lien vers un autre document s'ouvre dans l'onglet Documentation avec l'ancre ; un fichier à télécharger sort par la route de téléchargement ; le reste du dépôt s'ouvre sur GitHub ; aucun lien relatif des documents ne pointe vers un fichier inexistant | 4 | [RF65](requisitos.md#rf65) | Réussi (4 sur 4) |
| <a id="ct-u57"></a>CT-U57 | `documentacao.test.ts` | `renderizarMarkdown` | Titre séparé, ancres identiques à celles de GitHub (y compris répétées), tableau dans une région défilante avec un nom, liens réécrits et diagramme comme bouton d'agrandissement avec une image à texte alternatif et le code visible | 3 | [RF63](requisitos.md#rf63) | Réussi (3 sur 3) |
| <a id="ct-u64"></a>CT-U64 | `documentacao.test.ts` | `dividirDocumento` | Sépare l'ouverture des sections sans confondre code et titre ; utilise une adresse sans accent ; ne divise que la section qui a 3 sous-sections ou plus ; trouve la page de chaque ancre, y compris celle d'une ligne de tableau ; résume par le premier paragraphe ; un document court reste entier | 5 | [RF63](requisitos.md#rf63) | Réussi (5 sur 5) |
| <a id="ct-u65"></a>CT-U65 | `documentacao.test.ts` | `rota das âncoras em documentos divididos` | Mène à la page de l'ancre, avec un fragment seulement au milieu de la page ; réécrit les liens de la section ; chaque page de chaque document publié a un titre et ne répète pas le h1 | 3 | [RF65](requisitos.md#rf65) | Réussi (3 sur 3) |

### CN10 · Tableau de bord des résultats : profil des participants

| ID | Fichier | Fonction ou groupe | Résultat attendu | Exécutions | Exigences | Résultat au 18/11/2026 |
|---|---|---|---|---|---|---|
| <a id="ct-u60"></a>CT-U60 | `perfil-demografico.test.ts` | `perfilDemografico` | Compte chaque option, ceux qui ont préféré ne pas répondre et ceux qui ont passé ; une échelle ordonnée reste dans l'ordre de l'échelle ; le genre va du plus grand au plus petit ; sans participations, les parts restent à zéro | 4 | [RF50](requisitos.md#rf50) | Réussi (4 sur 4) |

### CN21 · Équipe et notifications

| ID | Fichier | Fonction ou groupe | Résultat attendu | Exécutions | Exigences | Résultat au 18/11/2026 |
|---|---|---|---|---|---|---|
| <a id="ct-u59"></a>CT-U59 | `modelo-email.test.ts` | `modelo dos e-mails` | Construit le HTML avec la langue, le bouton, le lien de secours et le pied de page ; échappe ce qui vient du chercheur ; passe de droite à gauche en arabe, en hébreu et en persan ; a le même message en texte brut | 4 | [RF23](requisitos.md#rf23) | Réussi (4 sur 4) |

### CN23 · Protection des données

| ID | Fichier | Fonction ou groupe | Résultat attendu | Exécutions | Exigences | Résultat au 18/11/2026 |
|---|---|---|---|---|---|---|
| <a id="ct-u58"></a>CT-U58 | `cripto.test.ts` | `criptografia de campo` | Chiffre et déchiffre avec un nouvel IV à chaque fois ; un texte modifié ou une autre clé ne déchiffrent pas ; un Json chiffré revient identique et l'ancien format reste lisible ; une clé de mauvaise taille est refusée ; sans clé, enregistre tel quel | 6 | [RNF14](requisitos.md#rnf14) | Réussi (6 sur 6) |
| <a id="ct-u69"></a>CT-U69 | `termo.test.ts` | `condicoesDoTermo` e `lerIdade` | Liste les lignes du formulaire de consentement dans l'ordre de l'écran ; avec des données facultatives, avertit et augmente la durée ; avec un comité d'éthique, affiche le comité ; dans toutes les langues, cite le bouton de sortie sous son nom réel ; l'âge n'est accepté que pour les majeurs ou pour les mineurs avec l'autorisation | 40 | [RF25](requisitos.md#rf25) | Réussi (40 sur 40) |

### CN24 · Langue de l'outil

| ID | Fichier | Fonction ou groupe | Résultat attendu | Exécutions | Exigences | Résultat au 18/11/2026 |
|---|---|---|---|---|---|---|
| <a id="ct-u62"></a>CT-U62 | `catalogo.test.ts` | `catálogo da interface` | Le catalogue est à jour avec les t() et m() du code, ne contient que du texte d'écran, chaque texte sait de quel fichier il vient, et aucun n'est vide | 4 | [RF08](requisitos.md#rf08) | Réussi (4 sur 4) |
| <a id="ct-u63"></a>CT-U63 | `catalogo.test.ts` | `tradutor` | Renvoie l'original sans traduction et interpole les marqueurs ; la clé change avec la langue d'origine, sauf pour le portugais ; les marqueurs inconnus restent tels quels | 3 | [RF08](requisitos.md#rf08), [RF35](requisitos.md#rf35) | Réussi (3 sur 3) |
| <a id="ct-u66"></a>CT-U66 | `catalogo.test.ts` | `mesmosMarcadores` | Accepte les marqueurs dans un autre ordre et refuse un marqueur traduit, manquant ou en trop | 1 | [RF08](requisitos.md#rf08) | Réussi (1 sur 1) |
| <a id="ct-u67"></a>CT-U67 | `claude.test.ts` | `traduzirLote` | Garde la correction de la relecture et envoie l'écran de chaque texte ; si la relecture échoue, garde la première traduction ; une traduction aux marqueurs différents est refusée ; les fragments de phrase gardent les espaces des extrémités ; sans réponse de l'API, le lot reste sans traduction ; le nom de l'outil voyage comme marqueur et ressort identique ; les termes de la langue et les libellés cités vont à la traduction et à la relecture ; un fragment de phrase ne reçoit pas de point final | 9 | [RF08](requisitos.md#rf08) | Réussi (9 sur 9) |
| <a id="ct-u68"></a>CT-U68 | `rodadas.test.ts` | `rodadas da tradução` | Un libellé est un texte court sans ponctuation de phrase ; trouve les boutons cités dans un texte, avec la traduction déjà choisie ; préfère le libellé le plus long et ne confond pas un morceau de mot, une minuscule ou un marqueur ; les boutons cités dans l'aide existent comme libellés | 4 | [RF08](requisitos.md#rf08) | Réussi (4 sur 4) |
| <a id="ct-u78"></a>CT-U78 | `nome-da-ferramenta.test.ts` | `nome da ferramenta em cada idioma` | A un nom pour chacune des 37 langues, tous avec le sigle UEQ ; remplace le nom dans les phrases traduites et dans le nom lui-même, et laisse le portugais tel quel ; une phrase sans traduction reste entièrement en portugais, sans mélanger le nom d'une autre langue | 3 | [RF08](requisitos.md#rf08) | Réussi (3 sur 3) |

### CN25 · Scénarios de démonstration

| ID | Fichier | Fonction ou groupe | Résultat attendu | Exécutions | Exigences | Résultat au 18/11/2026 |
|---|---|---|---|---|---|---|
| <a id="ct-u61"></a>CT-U61 | `respostas-sinteticas.test.ts` | `respostas sintéticas dos cenários de demonstração` | Donne 26 valeurs de 1 à 7 ; qui répond avec attention n'est jamais suspect, et aléatoire et identiques le sont toujours ; la moyenne de chaque échelle reste proche du profil ; la même graine génère les mêmes réponses | 4 | [RF67](requisitos.md#rf67) | Réussi (4 sur 4) |

## Cas manuels

Réalisés par des personnes, sans automatisation. Ceux de CN17 suivent la [checklist manuelle](../checklist-manual.md) et le [script de revue](../roteiro-revisao.md).

| ID | Scénario | Groupe | Vérification | Exigences | Situation |
|---|---|---|---|---|---|
| <a id="ct-m01"></a>CT-M01 | CN17 | Lecteur d'écran | Questionnaire complet du début à la fin uniquement à l'écoute (NVDA + Firefox ; VoiceOver + Safari ou TalkBack + Chrome) | [RNF04](requisitos.md#rnf04) | Non exécuté |
| <a id="ct-m02"></a>CT-M02 | CN17 | Lecteur d'écran | En entrant dans un item, le lecteur annonce le numéro, les deux termes et la position | [RF27](requisitos.md#rf27), [RNF04](requisitos.md#rnf04) | Non exécuté |
| <a id="ct-m03"></a>CT-M03 | CN17 | Lecteur d'écran | La progression est annoncée sans interrompre à chaque clic | [RF28](requisitos.md#rf28), [RNF04](requisitos.md#rnf04) | Non exécuté |
| <a id="ct-m04"></a>CT-M04 | CN17 | Lecteur d'écran | À l'envoi incomplet, le lecteur annonce le résumé et permet d'aller à l'item manquant | [RF29](requisitos.md#rf29), [RNF04](requisitos.md#rnf04) | Non exécuté |
| <a id="ct-m05"></a>CT-M05 | CN17 | Lecteur d'écran | Dans le tableau de bord, le graphique est annoncé avec sa description et le tableau est navigable cellule par cellule avec l'en-tête lu | [RNF04](requisitos.md#rnf04), [RNF08](requisitos.md#rnf08) | Non exécuté |
| <a id="ct-m06"></a>CT-M06 | CN17 | Lecteur d'écran | Les messages de succès (« Collecte ouverte ») sont annoncés | [RNF04](requisitos.md#rnf04), [RNF20](requisitos.md#rnf20) | Non exécuté |
| <a id="ct-m07"></a>CT-M07 | CN17 | Clavier | Créer une étude, ouvrir la collecte, répondre, voir les résultats et exporter sans souris ; focus toujours visible et dans un ordre logique | [RNF03](requisitos.md#rnf03) | Non exécuté |
| <a id="ct-m08"></a>CT-M08 | CN17 | Vision | Zoom à 200 % et 400 % : rien n'est coupé, rien ne se chevauche | [RNF02](requisitos.md#rnf02) | Non exécuté |
| <a id="ct-m09"></a>CT-M09 | CN17 | Vision | Daltonisme simulé dans les DevTools (protanopie, deutéranopie, tritanopie, achromatopsie) : le graphique reste lisible | [RNF07](requisitos.md#rnf07) | Non exécuté |
| <a id="ct-m10"></a>CT-M10 | CN17 | Vision | Contraste élevé de Windows : cercles du questionnaire et focus visibles | [RNF06](requisitos.md#rnf06), [RNF07](requisitos.md#rnf07) | Non exécuté |
| <a id="ct-m11"></a>CT-M11 | CN17 | Vision | Un espacement du texte augmenté (WCAG 1.4.12) ne casse pas la mise en page | [RNF01](requisitos.md#rnf01) | Non exécuté |
| <a id="ct-m12"></a>CT-M12 | CN17 | Mobile réel | Ouvrir le lien par WhatsApp et répondre avec le pouce, sans toucher par accident le cercle voisin ; le clavier virtuel ne couvre pas le champ dans les données facultatives | [RNF05](requisitos.md#rnf05), [RNF23](requisitos.md#rnf23) | Non exécuté |
| <a id="ct-m13"></a>CT-M13 | CN17 | Évaluation heuristique | Chaque membre évalue seul avec les 10 heuristiques de Nielsen (écran, heuristique, gravité de 0 à 4, suggestion), puis l'équipe consolide | [RNF01](requisitos.md#rnf01), [RNF20](requisitos.md#rnf20), [RNF21](requisitos.md#rnf21) | Non exécuté |
| <a id="ct-m14"></a>CT-M14 | CN17 | Test utilisateurs | 5 participants répondent à une vraie étude ; 2 à 3 chercheurs créent une étude avec 2 versions, ouvrent la collecte, interprètent le tableau de bord, retirent une réponse suspecte et exportent ; noter la réussite, le temps, les erreurs et l'UEQ de l'outil lui-même | [RF13](requisitos.md#rf13), [RF24](requisitos.md#rf24), [RF43](requisitos.md#rf43) | Non exécuté |
| <a id="ct-m15"></a>CT-M15 | CN15 | Tableur officiel | Coller chaque data/fixtures/**/respostas.csv dans l'UEQ Data Analysis Tool V15, recalculer et copier les résultats dans esperado.json ; ouvrir dans Excel le tableur exporté par l'outil et vérifier qu'il se recalcule avec les mêmes nombres (data/fixtures/LEIA-ME.md) | [RNF11](requisitos.md#rnf11) | Exécuté le 17/11/2026 avec scripts/planilha-oficial.ps1 dans Excel 16 : 11 scénarios, 6 543 valeurs identiques |
| <a id="ct-m16"></a>CT-M16 | CN09 | Script | Changer un seuil dans data/protocolo.json, exécuter pnpm suspeitas:recalcular et vérifier la colonne suspeita | [RF55](requisitos.md#rf55) | Non exécuté |
| <a id="ct-m17"></a>CT-M17 | CN08 | Seed | Exécuter pnpm db:seed avec un item invalide dans data/ueq-itens-ptbr.json et vérifier que le seed s'arrête en indiquant l'item | [RF27](requisitos.md#rf27), [RNF10](requisitos.md#rnf10) | Non exécuté |
| <a id="ct-m18"></a>CT-M18 | CN17 | Revue visuelle | Comparer chaque écran avec le PNG correspondant dans docs/prototipos/alta-fidelidade/, en suivant docs/roteiro-revisao.md | [RNF01](requisitos.md#rnf01) | Non exécuté |
| <a id="ct-m19"></a>CT-M19 | CN17 | Installation | Dans un clone propre, suivre la section Como rodar du README et arriver à l'écran Se connecter sur http://localhost:3000 | [RNF24](requisitos.md#rnf24) | Non exécuté |
| <a id="ct-m20"></a>CT-M20 | CN17 | Lecteur d'écran | Les fenêtres (Se connecter, Créer un compte, Se déconnecter, supprimer, Partager, aide) annoncent leur titre à l'ouverture, retiennent le focus et le rendent à l'élément qui les a ouvertes | [RNF04](requisitos.md#rnf04), [RNF21](requisitos.md#rnf21) | Non exécuté |
| <a id="ct-m21"></a>CT-M21 | CN17 | Lecteur d'écran | Le nombre d'avis de la cloche est annoncé, et il est possible d'accepter une invitation uniquement à l'écoute | [RF22](requisitos.md#rf22), [RNF04](requisitos.md#rnf04) | Non exécuté |
| <a id="ct-m22"></a>CT-M22 | CN17 | Lecteur d'écran | La visite guidée se comprend uniquement à l'écoute, et il est possible de la passer | [RF09](requisitos.md#rf09), [RNF04](requisitos.md#rnf04) | Non exécuté |
| <a id="ct-m23"></a>CT-M23 | CN17 | Lecteur d'écran | Dans la politique de confidentialité, « Retour » indique où il mène, et le lien des fenêtres d'accès avertit qu'il s'ouvre dans un nouvel onglet. Dans de vrais Chrome, Firefox et Safari, « Fermer cet onglet et revenir » ferme l'onglet et rend la fenêtre d'inscription avec ce qui a été saisi | [RNF04](requisitos.md#rnf04), [RNF19](requisitos.md#rnf19) | Non exécuté |
| <a id="ct-m24"></a>CT-M24 | CN17 | Mobile réel | Lien du participant ouvert dans une étude dans une autre langue, et dans une langue qui s'écrit de droite à gauche (arabe, hébreu ou persan) | [RF34](requisitos.md#rf34) | Non exécuté |
| <a id="ct-m25"></a>CT-M25 | CN17 | Mobile réel | Politique de confidentialité ouverte depuis le formulaire de consentement, sur mobile, et « Retour » ramène au formulaire | [RF25](requisitos.md#rf25), [RNF19](requisitos.md#rnf19) | Non exécuté |
| <a id="ct-m26"></a>CT-M26 | CN16 | Tableur officiel de l'UEQ-S | Coller chaque data/fixtures-ueq-s/*/respostas.csv dans l'UEQ-S Data Analysis Tool V15, recalculer et copier les résultats dans esperado.json ; ouvrir dans Excel le tableur de l'UEQ-S exporté par l'outil et vérifier qu'il se recalcule avec les mêmes nombres (data/fixtures-ueq-s/LEIA-ME.md) | [RF62](requisitos.md#rf62), [RNF11](requisitos.md#rnf11) | Exécuté le 17/11/2026 avec scripts/planilha-oficial-ueq-s.ps1 dans Excel 16 : 9 scénarios, 8 520 valeurs identiques ; les 9 fichiers exportés se sont recalculés seuls avec une différence nulle |

## Limites

- **Benchmark de l'UEQ-S.** Les limites sont celles du tableur officiel de l'UEQ-S, qui viennent encore de l'UEQ complet. Les tests prouvent que l'outil utilise les mêmes nombres que le tableur, pas que le benchmark représente bien la version courte ; le tableau de bord le signale.
- **Cas manuels.** Sur les 26 cas manuels, 24 n'ont pas été exécutés, y compris le test utilisateurs prévu dans [Fondements de l'IHM §6](../ihc.md#6-como-verificar-automação-não-basta).
- **Administration.** Les pages d'Administration (comptes, langues, protection des données et scénarios) n'ont pas encore de cas de bout en bout. Seule la génération des réponses des scénarios a un test ([CT-U61](#ct-u61)).
- **Services externes.** L'appel à l'API de Claude et l'envoi d'e-mails ne sont pas exercés dans les tests : [CT-E67](#ct-e67) enregistre la traduction directement dans la base de données, et [CT-U59](#ct-u59) ne vérifie que le contenu de l'e-mail.
- **Tableau de bord en PDF en production.** Les cas [CT-E39](#ct-e39) et [CT-E40](#ct-e40) s'exécutent dans l'environnement local, avec le Chromium de Playwright. Le paquet utilisé sur Vercel n'est exercé qu'en production.
- **Tableur officiel hors d'Excel.** Les tableurs exportés (UEQ et UEQ-S) ont été vérifiés dans Microsoft Excel 16 pour Windows. LibreOffice, Google Sheets et Numbers n'ont pas été testés : le tableur demande un recalcul à l'ouverture, mais chaque programme décide s'il obéit.
- **Exigences sans cas de test :** 5 des 94 exigences n'ont pas de cas de test et sont vérifiées par l'étape Comment vérifier de chacune. La liste, avec le motif, est dans la [matrice de traçabilité](matriz-rastreabilidade.md#cobertura).
