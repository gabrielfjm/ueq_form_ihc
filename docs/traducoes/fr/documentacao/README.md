# Documentation de l'Outil UEQ

L'Outil UEQ est une application web open source pour mener des études d'expérience utilisateur avec le *User Experience Questionnaire* (UEQ), de la création de l'étude à l'exportation des données. Cette documentation décrit ce que fait l'outil, pour qui, comment il a été construit et comment on sait qu'il fonctionne.

Tout est dans des formats ouverts et s'affiche directement sur GitHub : Markdown, CSV et diagrammes Mermaid, avec le fichier source de chaque diagramme dans [`fontes/`](fontes/). Le tableur des exigences est aussi disponible en `.xlsx`, pour l'ouvrir dans Excel ou LibreOffice. Les mêmes fichiers apparaissent dans l'outil, dans l'onglet **Documentation**, ouvert à tous, sans connexion.

Le code et cette documentation sont sous [licence MIT](../../LICENSE). Le matériel officiel de l'UEQ dans `data/` appartient aux auteurs du questionnaire (voir la section Licence du [README](../../README.md#licença)).

Projet du cours Fondements de l'interaction humain-machine, PPGIa · PUCPR · 2026. Équipe : Gabriel Meira, Jean Weiss et Luiza Pedralli.

## Contenu

| Section | Document | Ce qu'il contient |
|---|---|---|
| Exigences | [Exigences](requisitos.md) | Les 68 exigences fonctionnelles et les 26 exigences non fonctionnelles, avec priorité, sprint de livraison, statut et méthode de vérification. Aussi dans [requisitos.csv](requisitos.csv) |
| Exigences | [Matrice de traçabilité](matriz-rastreabilidade.md) | Chaque exigence reliée aux récits utilisateur, aux cas d'utilisation, aux personas, aux cas de test, au sprint et au code. Aussi dans [matriz-rastreabilidade.csv](matriz-rastreabilidade.csv) |
| Exigences | [Tableur des exigences](planilha-requisitos.xlsx) | Exigences, sprints, récits, cas d'utilisation, matrice, scénarios et cas de test, un onglet pour chacun, avec des filtres |
| Utilisateurs | [Personas](personas.md) | Huit personas : trois de chercheur, quatre de participant et une de la personne qui maintient l'installation |
| Utilisateurs | [Récits utilisateur](historias-de-usuario.md) | 44 récits avec critères d'acceptation. Aussi dans [historias-de-usuario.csv](historias-de-usuario.csv) |
| Modélisation | [Cas d'utilisation](casos-de-uso.md) | Quatre diagrammes UML, la liste des 33 cas d'utilisation et la spécification des principaux |
| Modélisation | [Diagramme de classes](diagrama-de-classes.md) | Le modèle du domaine et le module de calcul de l'UEQ |
| Modélisation | [Modèle logique de la base](modelo-logico.md) | Les 11 tables PostgreSQL, avec colonnes, clés et ce que chaque suppression entraîne |
| Modélisation | [Diagrammes de séquence](diagramas-de-sequencia.md) | Huit flux du clic jusqu'à la base : se connecter, répondre, voir les résultats, retirer de l'analyse, PDF, importer, inviter et traduire |
| Architecture | [Architecture](arquitetura.md) | Modèle C4 (contexte, conteneurs et composants), sécurité, décisions et déploiement |
| Tests | [Cas et scénarios de test](casos-de-teste.md) | Stratégie, 25 scénarios et 206 cas (de bout en bout, unitaires et manuels), avec les exigences que chacun vérifie et le résultat de la dernière exécution. Aussi dans [casos-de-teste.csv](casos-de-teste.csv) |
| Tests | [Vérification du calcul](verificacao-do-calculo.md) | Le calcul de l'outil refait à la main avec l'étude d'exemple et comparé avec le tableur officiel de l'UEQ dans 11 scénarios et avec celui de l'UEQ-S dans 9 : moyennes, écart type, IC95, alpha, benchmark, réponses suspectes et exportations |
| Tests | [Checklist manuelle](../checklist-manual.md) | Ce que l'équipe vérifie de ses propres mains : lecteur d'écran, zoom, téléphone réel, daltonisme |
| Tests | [Guide de revue](../roteiro-revisao.md) | Ce qu'il faut ouvrir, ce qu'il faut faire sur chaque écran et comment noter les problèmes |
| Spécification | [Protocole UEQ](../ueq-protocolo.md) | Items, échelles, polarité et toutes les formules du calcul, vérifiées dans le handbook et dans le tableur officiel |
| Spécification | [Fondements de l'IHM](../ihc.md) | Exigences d'utilisabilité et d'accessibilité, chacune reliée au principe de la littérature qui la justifie |
| Spécification | [Décisions d'interface](../rastreabilidade-ihc.md) | Chaque décision d'interface, le principe, le code et le test qui la prouve |
| Spécification | [Langues](../idiomas.md) | Les 37 langues du questionnaire, l'origine de chaque texte et les corrections apportées aux termes officiels |
| Spécification | [Identité visuelle](../design.md) | Couleurs, typographie, mise en page, icônes et ton |
| Spécification | [Conventions de code](../codigo.md) | Noms, commentaires, structure, tests et commits |

## Par où commencer

- **Vous allez utiliser l'outil dans une étude ?** Lisez les [personas](personas.md) de chercheur, le cas d'utilisation [Répondre au questionnaire](casos-de-uso.md#uc14) pour voir ce que vivra le participant et le [Protocole UEQ](../ueq-protocolo.md) pour savoir comment chaque nombre est calculé.
- **Vous allez évaluer le projet ?** Commencez par les [exigences](requisitos.md), la [matrice de traçabilité](matriz-rastreabilidade.md) et les [cas de test](casos-de-teste.md). La [vérification du calcul](verificacao-do-calculo.md) montre le calcul refait à la main, et les [décisions d'interface](../rastreabilidade-ihc.md) relient chaque écran à un principe d'IHM.
- **Vous allez contribuer au code ?** Lisez l'[architecture](arquitetura.md), le [diagramme de classes](diagrama-de-classes.md), le [modèle logique](modelo-logico.md), la [stratégie de test](casos-de-teste.md#estratégia) et les [conventions de code](../codigo.md). Avant de modifier un comportement, cherchez le fichier dans la [matrice](matriz-rastreabilidade.md) pour voir quelle exigence et quel test en dépendent.

## Identifiants

| Préfixe | Ce qu'il identifie | Exemple |
|---|---|---|
| RF | Exigence fonctionnelle | [RF27](requisitos.md#rf27) Répondre aux 26 items |
| RNF | Exigence non fonctionnelle | [RNF01](requisitos.md#rnf01) WCAG 2.2 AA |
| PE | Persona | [PE04](personas.md#pe04) Célia |
| HU | Récit utilisateur | [HU35](historias-de-usuario.md#hu35) Répondre avec un lecteur d'écran |
| UC | Cas d'utilisation | [UC14](casos-de-uso.md#uc14) Répondre au questionnaire |
| CN | Scénario de test | [CN06](casos-de-teste.md#cn06) Accessibilité du questionnaire |
| CT-E, CT-U, CT-M | Cas de test de bout en bout, unitaire ou manuel | [CT-E22](casos-de-teste.md#ct-e22) Parcours complet au clavier seul |

Les identifiants sont fixes : un élément retiré garde son numéro réservé, car les autres documents le citent par son numéro.

## Situation au 17/11/2026

- **Exigences :** les 94 sont livrées. La dernière a été la [RF62](requisitos.md#rf62), Appliquer l'UEQ-S, le 18/11/2026.
- **Tests automatisés :** les résultats de la dernière exécution se trouvent dans les [cas de test](casos-de-teste.md#execução-de-17112026).
- **Calcul :** la [vérification du calcul](verificacao-do-calculo.md) a refait à la main toutes les statistiques de l'étude d'exemple, et les 336 nombres correspondent à ceux de l'outil. Dans la comparaison avec le tableur officiel lui-même, les 11 scénarios de test correspondent sur les 6 543 valeurs, et les 9 de l'UEQ-S sur les 8 520 valeurs de son propre tableur officiel. Les tableurs que l'outil exporte se recalculent dans Excel avec les mêmes nombres.
- **En production :** https://ferramenta-ueq.vercel.app.

## Comment maintenir

Lorsqu'une pull request modifie le comportement de l'outil :

1. Mettez à jour l'exigence dans [requisitos.md](requisitos.md), dans [requisitos.csv](requisitos.csv) et dans le [tableur](planilha-requisitos.xlsx). Une nouvelle exigence reçoit le prochain numéro libre ; une exigence retirée garde le statut Supprimée.
2. Reliez l'exigence à au moins un récit et un cas d'utilisation, et mettez à jour la [matrice](matriz-rastreabilidade.md) avec le fichier et le test.
3. Un nouveau test devient un cas dans [casos-de-teste.md](casos-de-teste.md) et dans le CSV : le titre du `test(...)` ou du `it(...)` est le résultat attendu, et le cas cite les exigences qu'il vérifie.
4. Si vous modifiez un diagramme Mermaid, exécutez `pnpm docs:diagramas` pour générer le SVG qu'affiche l'onglet Documentation et le fichier source dans `fontes/`. Un test unitaire échoue en cas d'oubli. Sous chaque diagramme, mettez à jour la version de l'outil qu'il représente.
5. Un nouveau document entre dans le catalogue de `src/lib/documentacao/catalogo.ts`, dans sa section et dans la liste `PRONTOS`.

Les formats d'un même contenu (Markdown, CSV et XLSX) changent ensemble.
