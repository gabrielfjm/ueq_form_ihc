# Langues

L'Outil UEQ fonctionne dans les 37 langues du paquet officiel de l'UEQ, selon deux voies distinctes :

- **Le lien du participant** utilise les termes et les consignes officiels ainsi que des textes d'écran révisables, conservés dans des fichiers. Comme il s'agit d'un instrument de mesure, aucun élément du questionnaire ne passe par la traduction automatique.
- **L'outil du chercheur** est écrit en portugais et traduit à la demande par l'API de Claude ([section dédiée](#a-ferramenta-do-pesquisador)). Les textes rédigés par le chercheur dans une étude (titre, produit et objectif) utilisent la même API.

## Comment la langue est choisie

- À la création de l'étude, le chercheur choisit sa langue (`Estudo.idioma`, avec la langue du compte par défaut). Le lien s'ouvre dans cette langue, même si le navigateur est réglé sur une autre.
- Dans le consentement et dans le questionnaire, un sélecteur « Langue » affiche le nom de chaque langue écrit dans cette langue. Choisir dans le sélecteur ne change rien à lui seul : seul le bouton « Appliquer » effectue le changement (WCAG 3.2.2). Changer de langue dans le questionnaire y ramène, avec les réponses cochées conservées.
- Le choix est conservé dans un cookie (`ueq_idioma`, uniquement sur `/r/<slug>`) et vaut pour toutes les étapes. Au moment du consentement, le code de la langue est enregistré dans `Participacao.idioma`.
- Le `<html lang>` et le `dir` suivent la langue (WCAG 3.1.1). C'est pourquoi le lien du participant possède sa propre mise en page racine (`src/app/r/[slug]/layout.tsx`), distincte de celle de l'outil (`src/app/(ferramenta)/layout.tsx`).
- En arabe, en hébreu et en persan, le texte va de droite à gauche. La ligne de cercles reste de gauche à droite, de 1 à 7, avec le terme de gauche à gauche, comme dans les PDF officiels de ces langues.

## D'où vient chaque contenu

| Contenu | Fichier | Source |
|---|---|---|
| 26 paires de termes | `data/ueq-idiomas.json` | PDF officiel de chaque langue, vérifié par rapport à l'image de la page |
| Consigne avant les items | `data/ueq-instrucoes.json` | PDF officiel de chaque langue, sans l'exemple au cercle coché (comme en portugais) |
| Textes des écrans (consentement, boutons, noms accessibles, erreurs, données facultatives, fin) | `src/idiomas/textos/*.ts` | Traduction de l'équipe ; les textes du formulaire complet (13/11/2026) ont été traduits par Claude (Opus) et doivent être révisés par un locuteur natif |
| Politique de confidentialité, vue par le lien du participant | Table `traducao` de la base | API de Claude, avec les mêmes textes que l'outil. Sans traduction, elle apparaît en portugais, avec un avertissement dans la langue de la personne |
| Titre, produit et objectif de l'étude | Table `traducao` de la base | API de Claude, à partir de la langue de l'étude. La page attend jusqu'à 8 secondes ; ce qui n'arrive pas à temps sort dans l'original, marqué avec son `lang`, et reste pour la visite suivante |

Le PDF est la référence parce que c'est le questionnaire que le participant verrait. L'onglet `Items` de l'UEQ Data Analysis Tool V15 propose une autre version dans plusieurs langues :

- en espagnol, les termes sont sans accents ;
- en italien, en danois, en turc, en chinois, en bulgare et en arabe, la formulation est différente.

Là où la couche de texte du PDF utilise une police héritée (hindi, marathi, bengali, tamoul, kannada), le texte provient du tableur et a été vérifié item par item par rapport à l'image. L'hébreu, le persan et le thaï proviennent aussi du tableur. Chaque langue consigne son origine dans `origemDoTexto`.

## Corrections des termes officiels

Dans 16 paires, le PDF officiel lui-même présente un défaut qui empêche de répondre ou qui inverse la notation. Toutes les langues concernées sont des langues dont la traduction n'est pas encore approuvée, sauf le persan et l'hindi. La correction est la plus petite possible. Chacune figure dans `correcoes`, dans le JSON, avec la paire d'origine et le motif.

| Langue | Item | Dans le PDF officiel | Utilisé ici |
|---|---|---|---|
| Bosniaque, hébreu, marathi, bengali, tamoul, arabe, kannada | 19 | le même terme négatif des deux côtés (« ne répond pas aux attentes ») | le terme positif à gauche, comme dans l'original anglais |
| Hongrois | 16 | `kellemetlen / kellemetlen` | `kellemetlen / kellemes` |
| Hongrois | 19 | `… / elvárásoknak` (tronqué) | `… / nem felelnek meg az elvárásoknak` |
| Hébreu | 14 | `לא מושכת / ושך` (tronqué) | `לא מושכת / מושכת` |
| Hébreu | 24 | `אטקרטיבי` (faute de frappe) | `אטרקטיבי` |
| Kannada | 8 | `ಊಹಿಸಲು ಸಾಧ್ಯವಾದಾಗ` (« quand il est possible de prévoir ») | `ಊಹಿಸಲು ಸಾಧ್ಯವಾಗದ` (« il n'est pas possible de prévoir ») |
| Norvégien | 26 | `ledende / innovativ` (deux termes positifs) | `konservativ / innovativ` |
| Hindi | 2 et 4 | terme positif du côté opposé à celui de l'original | termes inversés de côté |
| Persan | 16 | `مطلوب / نامطلوب`, positif à gauche | `نامطلوب / مطلوب` |

Pour les items dont les termes ont été inversés de côté, la notation reste celle de l'original : qui coche près du terme positif obtient un score positif. C'est la raison pour laquelle on inverse les termes, et non la polarité de l'item dans la base.

Deux phrases de consigne ont été omises :

- en hébreu, les phrases sur les « paires regroupées par aspect » et sur l'« importance de chaque aspect », qui décrivent un autre formulaire ;
- en persan, la phrase qui demande de barrer l'item qu'on ne peut pas évaluer, parce qu'ici tous les items sont obligatoires.

## Traduction non approuvée

Neuf PDF indiquent « This translation is not yet finally approved » : arabe, bengali, bosniaque, hébreu, hongrois, kannada, marathi, norvégien et tamoul.

- Lorsqu'on en choisit un, le consentement affiche l'avertissement dans la langue elle-même.
- Dans Réponses, la colonne Langue indique « traduction non approuvée ».
- Les exports de réponses comportent les colonnes `idioma` et `traducao_aprovada`.

## Révision par un locuteur natif

Avant d'utiliser une langue dans une étude réelle, une personne maîtrisant la langue doit vérifier :

1. les textes d'écran dans `src/idiomas/textos/<código>.ts`, qui sont tous une traduction de l'équipe (l'API de Claude ne traduit que l'outil du chercheur et les textes de l'étude) ;
2. les corrections du tableau ci-dessus, lorsque la langue en comporte ;
3. les consignes marquées « Transcrito da imagem… Conferir com falante nativo » dans `data/ueq-instrucoes.json` : arabe, hindi, marathi, bengali, tamoul et kannada. En bengali, les espaces entre les mots ont été ajoutés par l'équipe, car le PDF n'en comporte pas.

Les réponses aux données facultatives sont toujours enregistrées avec la catégorie en portugais (par exemple, « 25 a 34 anos »), quelle que soit la langue. L'analyse et les exports ne changent pas.

## L'outil du chercheur

La langue est choisie à la création du compte et modifiée dans Mon compte › Langue ou, plus rapidement, par le sélecteur de langue de la barre (prototype r41), qui fait la même chose sans quitter la page. Avant de se connecter, c'est la dernière langue choisie dans le navigateur qui prévaut (cookie `idioma_interface`), et le sélecteur de la barre apparaît aussi pour qui n'est pas connecté. Les avis de la cloche et les e-mails sortent dans la langue de leur destinataire.

Fonctionnement :

1. Tout texte d'écran est écrit en portugais dans `t("…")` ou `m("…")`. La commande `pnpm i18n:catalogo` extrait ces textes vers `src/traducao/catalogo.json`.
2. À l'ouverture d'un écran dans une autre langue, le serveur lit les traductions de la table `traducao`. Ce qui manque sort en portugais, et les lots de 60 textes, regroupés par écran, s'exécutent après la réponse, jusqu'à 6 en même temps, avec le modèle défini dans `src/traducao/claude.ts` (Claude Haiku 5.5, le moins cher).
   - La traduction se fait en trois étapes, pour que les lots ne choisissent pas des mots différents pour la même chose : d'abord le glossaire de la langue (`src/traducao/rodadas.ts`), conservé dans la table ; ensuite les libellés courts ; enfin les textes longs, qui reçoivent la traduction des boutons qu'ils citent.
   - Chaque texte part avec le fichier qui l'utilise et avec les consignes sur le sens des termes, pour que « baixar » ne devienne pas « dar baixa ».
   - Le glossaire comporte une phrase modèle qui fixe le registre formel de la langue, et la révision traite tout autre registre comme une erreur.
   - Le nom « Ferramenta UEQ » voyage sous forme de marqueur et la traduction conserve le nom en portugais. Au moment de l'affichage, le traducteur remplace le nom par celui de la langue de l'interface (UEQ Tool, Herramienta UEQ, UEQ-Tool, Outil UEQ, UEQ ツール...), qui se trouve dans `NOME_DA_FERRAMENTA`, dans `src/traducao/nucleo.ts`. Une phrase encore sans traduction reste entière en portugais, avec le nom en portugais.
   - Une seconde lecture compare l'original et la traduction et corrige ce dont le sens a changé.
   - Une traduction dont les `{marqueurs}` diffèrent de ceux de l'original est écartée : le texte reste en portugais.
   - Cela réduit les erreurs, mais ne remplace pas la révision par un locuteur natif.
3. Chaque traduction est conservée par langue et par hash du texte, et n'est donc jamais demandée deux fois. Modifier un texte en portugais génère une nouvelle traduction.
4. Administration › Langues affiche la couverture de chaque langue et comporte le bouton « Traduire maintenant ».

Lorsque vous écrivez un nouveau texte, pensez à la personne qui le traduira sans voir l'écran :

- Écrivez la phrase complète, avec un sujet. « Fica num cookie » ne dit pas ce qui est conservé.
- Évitez les mots à double sens. « Baixa os dados » peut devenir « dá baixa » ; préférez « faz o download ».
- Ne construisez pas de phrase à partir de morceaux de texte et de lien : l'ordre des mots change d'une langue à l'autre.
- Ne faites passer par `t()` ou `m()` que ce qui apparaît à l'écran. Un sélecteur ou un nom d'événement traduit casse l'écran.

De nouveaux textes peuvent aussi entrer déjà traduits, par une migration qui écrit dans la table `traducao` (comme `20261113120100_traducoes_do_termo`, écrite par Claude sans l'API). L'API n'est ainsi pas appelée pour eux.

Sans `ANTHROPIC_API_KEY` dans l'environnement, rien n'est traduit et l'outil apparaît en portugais. Tant que plus de la moitié du catalogue d'une langue n'est pas traduite, le `<html lang>` et la direction restent en portugais, pour que le lecteur d'écran prononce correctement.

Seuls les textes de l'interface et ceux de l'étude partent vers l'API. Aucune réponse, aucun nom, aucune adresse e-mail ni donnée démographique ne part avec, comme l'indique la politique de confidentialité.

## Hors périmètre

- Le tableau de bord des résultats ne sépare pas par langue. Pour comparer des langues, utilisez la colonne `idioma` des exports.
- Les documents de l'onglet Documentation ne sont traduits qu'en anglais, espagnol, français, allemand, italien, chinois et japonais (traduction de Claude, sans l'API et pas encore relue par des locuteurs natifs, dans `docs/traducoes/`). Dans les autres langues de l'interface, ils apparaissent en anglais, avec un avertissement. Les diagrammes sont en anglais dans toutes les langues.
