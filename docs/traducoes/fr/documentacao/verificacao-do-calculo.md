# Vérification du calcul

Ce document vérifie, nombre par nombre, si l'Outil UEQ calcule ce que le [Protocole UEQ](../ueq-protocolo.md) demande de calculer. La vérification utilise l'**Estudo de exemplo** (étude d'exemple), que le seed crée dans toute installation locale, sur le compte de test et avec le lien `/r/exemplo`, et refait chaque calcul sans utiliser le code de l'outil.

**Résultat :** les 336 comparaisons numériques concordent avec l'outil. La plus grande différence a été de 3,3 × 10⁻¹⁶, qui est l'erreur d'arrondi de l'ordinateur lui-même. L'interprétation, la tranche du benchmark, les échelles incohérentes, les réponses identiques et la marque de suspicion de chaque participant sont aussi identiques, et les exportations donnent les mêmes nombres.

Ensuite, l'outil a été comparé au tableur officiel de l'UEQ lui-même dans 11 scénarios, d'un seul participant à 1000 participants : les 6 543 valeurs concordent, et le tableur officiel exporté par l'outil se recalcule dans Excel avec les mêmes résultats ([Comparaison avec le tableur officiel](#comparação-com-a-planilha-oficial)). La version courte, l'UEQ-S, a été comparée de la même façon avec son tableur officiel, dans 9 scénarios : les 8 520 valeurs concordent ([UEQ-S](#ueq-s)).

Version vérifiée : Outil UEQ du 17/11/2026, avec le module de calcul de [`src/ueq/`](../../src/ueq/) et les paramètres de [`data/protocolo.json`](../../data/protocolo.json) et [`data/benchmark.json`](../../data/benchmark.json).

## Comment la vérification a été faite

1. **Les données.** L'étude d'exemple a deux versions. « Checkout atual » (checkout actuel) reçoit les 20 réponses de [`data/fixtures/basico/respostas.csv`](../../data/fixtures/basico/respostas.csv) et « Checkout em uma página » (checkout sur une page) reçoit les 15 de [`data/fixtures/inconsistente/respostas.csv`](../../data/fixtures/inconsistente/respostas.csv) (voir [`prisma/estudo-exemplo.ts`](../../prisma/estudo-exemplo.ts)). Chaque ligne a les 26 valeurs de 1 à 7 dans l'ordre officiel.
2. **Le calcul indépendant.** Chaque formule a été réécrite à partir du Protocole UEQ (recodage, score par échelle, moyenne, écart type d'échantillon, IC95, corrélation de Pearson, alpha standardisé, tranches, benchmark, groupes et règles de suspicion), sans réutiliser aucune fonction de l'outil. La Clarté de la version « Checkout atual » a été faite entièrement à la main et figure étape par étape ci-dessous ; les autres échelles suivent les mêmes calculs.
3. **Ce que renvoie l'outil.** Les mêmes réponses ont été passées à `analisarEstudo`, la fonction qui alimente le tableau de bord, le PDF et les exportations, et aux quatre fonctions d'exportation de [`src/lib/exportacoes.ts`](../../src/lib/exportacoes.ts).
4. **La comparaison.** Chaque nombre du calcul indépendant a été comparé à celui de l'outil, sur quatre découpages : chaque version, la version 2 sans les réponses suspectes et les deux versions ensemble.

Les sections jusqu'à Exportations vérifient que l'outil suit le protocole. La [comparaison avec le tableur officiel](#comparação-com-a-planilha-oficial), qui est la [RNF11](requisitos.md#rnf11), vérifie que le protocole et l'outil donnent les mêmes nombres que l'UEQ Data Analysis Tool elle-même.

## Étape par étape : Clarté du Checkout atual

La Clarté a 4 items. La polarité indique de quel côté se trouve le terme positif : `+` à droite, `-` à gauche.

| Item | Terme gauche | Terme droit | Polarité |
|---|---|---|---|
| 2 | Incompreensível (incompréhensible) | Compreensível (compréhensible) | + |
| 4 | De fácil aprendizagem (facile à apprendre) | De difícil aprendizagem (difficile à apprendre) | - |
| 13 | Complicado (compliqué) | Fácil (facile) | + |
| 21 | Evidente (évident) | Confuso (confus) | - |

### 1. Recodage

La réponse de 1 à 7 devient -3…+3 : pour les items `+`, valeur - 4 ; pour les items `-`, 4 - valeur ([Protocole §2](../ueq-protocolo.md#2-recodificação)). Le participant 1 a répondu 5, 4, 4 et 3 :

| Item | Réponse | Calcul | Recodé |
|---|---|---|---|
| 2 (+) | 5 | 5 - 4 | +1 |
| 4 (-) | 4 | 4 - 4 | 0 |
| 13 (+) | 4 | 4 - 4 | 0 |
| 21 (-) | 3 | 4 - 3 | +1 |

### 2. Score du participant sur l'échelle

C'est la moyenne des items recodés de l'échelle ([Protocole §3](../ueq-protocolo.md#3-escore-por-participante-e-escala)) : (1 + 0 + 0 + 1) / 4 = **0,50**.

Les 20 participants, dans l'ordre du fichier :

| 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
|---|---|---|---|---|---|---|---|---|---|
| 0,50 | 1,50 | 0,25 | 0,50 | 0,25 | 1,25 | 2,00 | 1,00 | 2,00 | 0,50 |

| 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 |
|---|---|---|---|---|---|---|---|---|---|
| 0,75 | 0,00 | -0,25 | 0,25 | 2,25 | 1,00 | 1,00 | -0,75 | 0,50 | 2,50 |

### 3. Moyenne et écart type

- **Moyenne :** la somme des 20 scores est 17,00, et 17,00 / 20 = **0,8500**.
- **Écart type d'échantillon** (diviseur n - 1, comme le `STDEV` du tableur) : la somme des carrés des écarts à la moyenne est 14,05. Donc 14,05 / 19 = 0,7395 et √0,7395 = **0,8599**.

### 4. Intervalle de confiance à 95 %

Marge = z × ET / √n, avec z = 1,959964 ([Protocole §4](../ueq-protocolo.md#4-estatísticas-por-escala-entre-participantes-incluídos-na-análise)) : 1,959964 × 0,8599 / √20 = 1,6854 / 4,4721 = 0,3769.

IC95 = 0,8500 ± 0,3769 = **[0,4731 ; 1,2269]**.

### 5. Alpha de Cronbach

L'alpha standardisé utilise la moyenne des corrélations entre les items recodés de l'échelle ([Protocole §6](../ueq-protocolo.md#6-alfa-de-cronbach-por-escala)). Avec 4 items, il y a 6 paires :

| Paire | 2 et 4 | 2 et 13 | 2 et 21 | 4 et 13 | 4 et 21 | 13 et 21 |
|---|---|---|---|---|---|---|
| r de Pearson | 0,6473 | 0,5326 | 0,3361 | 0,5261 | 0,6668 | 0,4304 |

- r̄ = (0,6473 + 0,5326 + 0,3361 + 0,5261 + 0,6668 + 0,4304) / 6 = 3,1393 / 6 = 0,5232.
- α = k × r̄ / (1 + (k - 1) × r̄) = 4 × 0,5232 / (1 + 3 × 0,5232) = 2,0929 / 2,5697 = **0,8144**.

Comme 0,8144 est supérieur à 0,7, le tableau de bord n'affiche pas d'avertissement de cohérence pour cette échelle.

### 6. Interprétation et benchmark

- **Interprétation :** 0,85 est supérieur à 0,8, donc la moyenne est **positive** ([Protocole §5](../ueq-protocolo.md#5-faixas-de-interpretação)).
- **Benchmark :** les limites de la Clarté sont 2,00 (excellent), 1,73 (bon), 1,20 (au-dessus de la moyenne) et 0,72 (sous la moyenne). Comme 0,72 < 0,85 ≤ 1,20, la tranche est **sous la moyenne** ([Protocole §8](../ueq-protocolo.md#8-benchmark)).

### 7. Qualité pragmatique et hédonique

Ce sont des moyennes simples des moyennes des échelles ([RF39](requisitos.md#rf39)) :

- **Pragmatique** = (Clarté + Efficacité + Fiabilité) / 3 = (0,8500 + 1,0250 + 0,9125) / 3 = **0,9292**.
- **Hédonique** = (Stimulation + Nouveauté) / 2 = (0,6375 + 1,0125) / 2 = **0,8250**.

L'outil renvoie les mêmes sept nombres : 0,50 pour le participant 1, moyenne 0,8500, ET 0,8599, IC95 de 0,4731 à 1,2269, alpha 0,8144, positive, sous la moyenne, et pragmatique et hédonique de 0,9292 et 0,8250.

## Résultats vérifiés

Les nombres ont 4 décimales, comme dans l'exportation des résultats par échelle. Le tableau de bord en affiche 2.

### Checkout atual

20 participants, aucun suspect. Pragmatique 0,9292 ; hédonique 0,8250.

| Échelle | Moyenne | ET | IC95 | Alpha | Interprétation | Benchmark |
|---|---|---|---|---|---|---|
| Attractivité | 0,7333 | 0,9167 | 0,3316 à 1,1351 | 0,9173 | neutre | sous la moyenne |
| Clarté | 0,8500 | 0,8599 | 0,4731 à 1,2269 | 0,8144 | positive | sous la moyenne |
| Efficacité | 1,0250 | 0,7818 | 0,6824 à 1,3676 | 0,7452 | positive | sous la moyenne |
| Fiabilité | 0,9125 | 0,9572 | 0,4930 à 1,3320 | 0,8188 | positive | sous la moyenne |
| Stimulation | 0,6375 | 0,7321 | 0,3166 à 0,9584 | 0,7401 | neutre | sous la moyenne |
| Nouveauté | 1,0125 | 0,7139 | 0,6996 à 1,3254 | 0,7494 | positive | au-dessus de la moyenne |

### Checkout em uma página

15 participants, dont 4 suspects et encore dans l'analyse, comme le seed les enregistre. Pragmatique 0,7944 ; hédonique 0,8500.

| Échelle | Moyenne | ET | IC95 | Alpha | Interprétation | Benchmark |
|---|---|---|---|---|---|---|
| Attractivité | 0,6000 | 0,9916 | 0,0982 à 1,1018 | 0,7366 | neutre | mauvais |
| Clarté | 0,8167 | 0,8263 | 0,3985 à 1,2348 | 0,5943 | positive | sous la moyenne |
| Efficacité | 0,8000 | 0,7270 | 0,4321 à 1,1679 | 0,3343 | neutre | sous la moyenne |
| Fiabilité | 0,7667 | 0,9135 | 0,3044 à 1,2290 | 0,5095 | neutre | mauvais |
| Stimulation | 0,8667 | 0,6605 | 0,5324 à 1,2009 | 0,0932 | positive | sous la moyenne |
| Nouveauté | 0,8333 | 0,7657 | 0,4458 à 1,2208 | 0,4067 | positive | au-dessus de la moyenne |

L'Efficacité a une moyenne d'exactement 0,8000 et reste **neutre** : la limite de la tranche neutre en fait partie (de -0,8 à +0,8). Cinq échelles ont un alpha inférieur à 0,7, et le tableau de bord le signale pour chacune ([RF45](requisitos.md#rf45)). C'est l'effet des réponses suspectes, comme le montre le tableau suivant.

### Checkout em uma página, sans les suspectes

Après « Retirer les suspectes de l'analyse » dans l'onglet Réponses, il reste 11 participants. Pragmatique 0,8636 ; hédonique 0,9545.

| Échelle | Moyenne | ET | IC95 | Alpha | Interprétation | Benchmark |
|---|---|---|---|---|---|---|
| Attractivité | 0,6364 | 1,1348 | -0,0343 à 1,3070 | 0,9265 | neutre | mauvais |
| Clarté | 0,7500 | 0,9354 | 0,1972 à 1,3028 | 0,8775 | neutre | sous la moyenne |
| Efficacité | 0,8636 | 0,5519 | 0,5375 à 1,1898 | 0,2564 | positive | sous la moyenne |
| Fiabilité | 0,9773 | 0,9517 | 0,4149 à 1,5397 | 0,8541 | positive | sous la moyenne |
| Stimulation | 0,9545 | 0,6876 | 0,5482 à 1,3609 | 0,7060 | positive | sous la moyenne |
| Nouveauté | 0,9545 | 0,8353 | 0,4609 à 1,4482 | 0,7011 | positive | au-dessus de la moyenne |

L'alpha remonte au-dessus de 0,7 sur quatre des cinq échelles qui étaient basses. L'Efficacité garde un alpha bas : son problème ne vient pas des suspectes.

### Les deux versions ensemble

35 participants. Pragmatique 0,8714 ; hédonique 0,8357.

| Échelle | Moyenne | ET | IC95 | Alpha | Interprétation | Benchmark |
|---|---|---|---|---|---|---|
| Attractivité | 0,6762 | 0,9375 | 0,3656 à 0,9868 | 0,8331 | neutre | mauvais |
| Clarté | 0,8357 | 0,8335 | 0,5596 à 1,1118 | 0,7230 | positive | sous la moyenne |
| Efficacité | 0,9286 | 0,7563 | 0,6780 à 1,1791 | 0,5698 | positive | sous la moyenne |
| Fiabilité | 0,8500 | 0,9279 | 0,5426 à 1,1574 | 0,6880 | positive | sous la moyenne |
| Stimulation | 0,7357 | 0,7017 | 0,5032 à 0,9682 | 0,4962 | neutre | sous la moyenne |
| Nouveauté | 0,9357 | 0,7310 | 0,6935 à 1,1779 | 0,5705 | positive | au-dessus de la moyenne |

### Moyennes par item

Les 26 moyennes et les 26 écarts types de chaque item, sur les quatre découpages, ont aussi été vérifiés : 208 nombres, tous identiques à ceux de l'outil.

## Réponses suspectes

Une participation est suspecte quand elle a 3 échelles ou plus avec une amplitude supérieure à 3, ou plus de 15 réponses identiques ([Protocole §7](../ueq-protocolo.md#7-respostas-inconsistentes)). L'amplitude est la différence entre la plus grande et la plus petite valeur recodée des items de l'échelle.

Dans le Checkout atual, aucun participant ne dépasse 3 pour aucune règle : le plus grand nombre de réponses identiques est 14. Dans le Checkout em uma página :

| Ligne | Attractivité | Clarté | Efficacité | Fiabilité | Stimulation | Nouveauté | Échelles au-dessus de 3 | Réponses identiques | Suspecte |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 6 | 4 | 4 | 6 | 4 | 5 | 6 | 5 | oui |
| 2 | 1 | 1 | 1 | 2 | 2 | 5 | 1 | 8 | non |
| 3 | 1 | 1 | 2 | 2 | 1 | 1 | 0 | 7 | non |
| 4 | 2 | 0 | 3 | 1 | 2 | 2 | 0 | 7 | non |
| 5 | 4 | 0 | 6 | 2 | 0 | 2 | 2 | 8 | non |
| 6 | 4 | 4 | 6 | 5 | 6 | 6 | 6 | 7 | oui |
| 7 | 2 | 2 | 2 | 0 | 2 | 2 | 0 | 12 | non |
| 8 | 1 | 0 | 1 | 1 | 2 | 0 | 0 | 9 | non |
| 9 | 4 | 4 | 1 | 6 | 4 | 0 | 4 | 7 | oui |
| 10 | 2 | 1 | 2 | 1 | 1 | 2 | 0 | 12 | non |
| 11 | 3 | 2 | 2 | 2 | 1 | 2 | 0 | 11 | non |
| 12 | 1 | 2 | 2 | 1 | 1 | 2 | 0 | 7 | non |
| 13 | 4 | 1 | 1 | 2 | 6 | 4 | 3 | 6 | oui |
| 14 | 1 | 2 | 1 | 3 | 2 | 1 | 0 | 11 | non |
| 15 | 2 | 1 | 1 | 1 | 1 | 1 | 0 | 8 | non |

- Les lignes 1, 6, 9 et 13 sont suspectes, les mêmes que marque l'onglet Réponses et que prévoit le [LEIA-ME de la fixture](../../data/fixtures/inconsistente/LEIA-ME.md).
- Les lignes 2 et 5 restent sous la limite : une et deux échelles incohérentes.
- Une amplitude d'exactement 3 ne compte pas (lignes 4, 11 et 14) : la règle est supérieure à 3.

## Exportations

Les exportations ont été générées par l'outil avec les 35 participations et vérifiées par rapport au calcul indépendant :

| Exportation | Ce qui a été vérifié | Résultat |
|---|---|---|
| Réponses brutes | BOM, 39 colonnes (13 de données de la participation et 26 items) et les valeurs de 1 à 7 de chaque participant | Identiques aux 35 lignes des fixtures |
| Réponses recodées | Les 26 valeurs de -3 à +3 de chaque participant | Identiques au recodage fait à la main |
| Résultats par échelle | 18 lignes (6 échelles × les deux versions et l'étude entière), avec n, moyenne, ET, IC95, alpha et interprétation à 4 décimales avec virgule décimale | Identiques aux tableaux ci-dessus |
| Tableur officiel de l'UEQ (XLSX) | Les 35 lignes de 26 valeurs dans Data!A4 de l'UEQ Data Analysis Tool V15, sans les données d'exemple, et le reste du fichier identique à l'officiel | Identiques aux fixtures, dans l'ordre ; recalculé dans Excel, voir la section suivante |

## Comparaison avec le tableur officiel

Faite le 17/11/2026 avec l'*UEQ Data Analysis Tool V15* de `Data_Analysis_Tools.zip` (ueq-online.org), dans Microsoft Excel 16. Pour chaque scénario de [data/fixtures/](../../data/fixtures/LEIA-ME.md), le script `scripts/planilha-oficial.ps1` a collé le `respostas.csv` dans `Data!A4` d'une copie du tableur, a demandé le recalcul et a lu les cellules de résultat avec toutes les décimales. Auparavant, le même script a été exécuté sur les données d'exemple fournies avec le tableur et a reproduit exactement les résultats enregistrés dans le fichier officiel.

Ont été comparés : moyenne, ET, n et IC95 des 6 échelles et des 26 items, alpha de Cronbach, tranche du benchmark, qualité pragmatique et hédonique, distribution des réponses de chaque item et, pour chaque participant, le nombre d'échelles incohérentes et de réponses identiques.

| Scénario | Participants | Suspectes | Valeurs comparées | Erreurs du tableur (null dans l'outil) | Plus grande différence |
|---|---|---|---|---|---|
| basico | 20 | 0 | 391 | 0 | 3,3 × 10⁻¹⁶ |
| inconsistente | 15 | 4 | 381 | 0 | 4,4 × 10⁻¹⁶ |
| extremos/n1 | 1 | 0 | 353 | 102 | 0 |
| extremos/n2 | 2 | 0 | 355 | 0 | 8,9 × 10⁻¹⁶ |
| extremos/todos-1 | 3 | 3 | 357 | 70 | 0 |
| extremos/todos-7 | 3 | 3 | 357 | 70 | 0 |
| oficial-exemplo | 255 | 18 | 861 | 0 | 2,9 × 10⁻¹⁵ |
| grande | 1000 | 63 | 2 351 | 0 | 9,3 × 10⁻¹⁵ |
| bordas | 12 | 3 | 375 | 0 | 5,6 × 10⁻¹⁶ |
| variancia-zero | 12 | 0 | 375 | 3 | 4,4 × 10⁻¹⁶ |
| negativo | 18 | 1 | 387 | 0 | 2,2 × 10⁻¹⁶ |
| **Total** | | | **6 543** | **245** | **9,3 × 10⁻¹⁵** |

Les textes (tranche du benchmark) et les comptages (n, distribution, échelles incohérentes, réponses identiques) sont identiques. Les nombres décimaux diffèrent au plus à la 15e décimale, à cause de l'ordre des sommes en virgule flottante ; le test accepte jusqu'à 1e-6. Les cas qui demandent de l'attention concordent aussi :

- **Une seule personne ou toutes identiques.** Le tableur donne `#DIV/0!` pour l'écart type, l'IC et l'alpha ; l'outil renvoie `null` et le tableau de bord affiche « — ».
- **Un item sans variation** (`variancia-zero`). Le tableur ne calcule pas la corrélation de cet item, et l'alpha de la Clarté et l'IC de l'item deviennent des erreurs. L'outil fait de même et calcule normalement l'alpha des cinq autres échelles.
- **Des items qui se contredisent** (`negativo`). La corrélation moyenne de la Nouveauté est proche de -1/3, et la formule de l'alpha standardisé, k × r̄ / (1 + (k - 1) × r̄), donne -42,78 dans les deux.
- **Les limites des règles de suspicion** (`bordas`). Une amplitude d'exactement 3 ne compte pas et 4 compte ; 15 réponses identiques ne marquent pas et 16 marquent. L'outil et le tableur donnent le même résultat pour chaque participant.

### Le tableur exporté par l'outil

L'exportation « Tableur officiel de l'UEQ (XLSX) » a été vérifiée de trois façons :

1. **Fichier par fichier.** Un test unitaire ouvre le `.xlsx` généré et vérifie que l'onglet Data a les réponses à partir de la ligne 4, que les 255 participants d'exemple ont été retirés, que la langue est dans `Read_First!B5` et que les graphiques, styles, images et les autres parties du fichier sont identiques octet par octet à ceux du fichier officiel.
2. **Dans Excel.** Le tableur des 11 scénarios, généré par l'outil, a été ouvert dans Excel sans rien coller et sans demander de recalcul. Excel a recalculé tout seul à l'ouverture, et les 6 543 valeurs étaient identiques à celles du collage à la main, avec les libellés en portugais (« Atractividade », « Desagradável »).
3. **Par l'écran.** Un test de bout en bout importe 7 scénarios (`oficial-exemplo`, `grande`, `inconsistente`, `bordas`, `variancia-zero`, `negativo` et `extremos/n2`) par l'écran Importer les réponses, vérifie n, moyenne, ET, IC95, alpha et benchmark de chaque échelle dans le tableau du tableau de bord avec les nombres du tableur officiel et télécharge le tableur de la version. Cinq de ces fichiers, téléchargés depuis l'outil en fonctionnement, ont été ouverts dans Excel : aucune différence.

### UEQ-S

La version courte a été comparée de la même façon avec l'*UEQ-S Data Analysis Tool V15* (`Short_UEQ_Data_Analysis_Tool_V15.xlsx`, du même `Data_Analysis_Tools.zip`), par le script `scripts/planilha-oficial-ueq-s.ps1`, dans 9 scénarios de [data/fixtures-ueq-s/](../../data/fixtures-ueq-s/LEIA-ME.md). Auparavant, le script a été exécuté sur les 13 participants d'exemple du tableur et a reproduit les résultats enregistrés dans le fichier officiel.

Ont été comparés : moyenne, ET, n et IC95 de la qualité pragmatique, hédonique et générale et des 8 items, l'alpha des deux échelles, la tranche du benchmark et, pour chaque participant, les trois scores (onglet DT), le nombre d'échelles incohérentes, le nombre de réponses identiques et s'il a coché le milieu sur les 8 items.

| Scénario | Participants | Suspectes | Valeurs comparées | Erreurs du tableur (null dans l'outil) | Plus grande différence |
|---|---|---|---|---|---|
| oficial-exemplo | 13 | 2 | 136 | 0 | 4,4 × 10⁻¹⁶ |
| do-ueq-basico | 20 | 0 | 178 | 0 | 2,2 × 10⁻¹⁶ |
| do-ueq-oficial-exemplo | 255 | 5 | 1 588 | 0 | 8,9 × 10⁻¹⁶ |
| grande | 1000 | 30 | 6 058 | 0 | 6,0 × 10⁻¹⁵ |
| bordas | 12 | 3 | 130 | 0 | 4,4 × 10⁻¹⁶ |
| variancia-zero | 12 | 0 | 130 | 3 | 2,2 × 10⁻¹⁶ |
| negativo | 18 | 0 | 166 | 0 | 4,4 × 10⁻¹⁶ |
| n1 | 1 | 0 | 64 | 35 | 0 |
| n2 | 2 | 0 | 70 | 0 | 4,4 × 10⁻¹⁶ |
| **Total** | | | **8 520** | **38** | **6,0 × 10⁻¹⁵** |

Les scénarios `do-ueq-basico` et `do-ueq-oficial-exemplo` sont tirés de scénarios de l'UEQ complet : les 8 paires de l'UEQ-S de chaque participant, avec les côtés des items 4 et 7 inversés. Ils prouvent l'onglet UEQ-S d'une étude de l'UEQ complet, qui fait la même conversion. Les cas limites concordent aussi :

- **Les règles de suspicion de l'UEQ-S** (`bordas`). Une amplitude de 4 sur une seule échelle ne marque pas ; sur les deux, elle marque. Huit fois le 4 marque (« Remove » dans le tableur) ; huit fois le 7, non, car le tableur ne recommande de retirer que ceux qui ont coché le milieu.
- **Des items qui se contredisent** (`negativo`). L'alpha de la qualité hédonique donne -1,40 dans les deux.
- **Un item sans variation** (`variancia-zero`). Sans IC de l'item et sans alpha de la pragmatique, dans les deux.

Le « Tableur officiel de l'UEQ-S (XLSX) » exporté par l'outil a été vérifié comme celui de l'UEQ complet : un test unitaire ouvre le fichier et vérifie l'onglet Data et la langue dans `Read_First!B4` ; les 9 fichiers générés par l'outil ont été ouverts dans Excel sans rien coller ni demander de recalcul, et les valeurs étaient identiques à celles de `esperado.json`, avec les libellés en portugais (« Qualidade Pragmática », « Obstrutivo ») ; et un test de bout en bout importe 5 scénarios dans une étude UEQ-S, vérifie le tableau de l'onglet UEQ-S et télécharge le tableur.

## Comment refaire la vérification

Tout le monde peut refaire cette vérification sans programmer :

1. Dans une installation locale, exécutez `pnpm db:seed` et connectez-vous avec le compte de test (`pesquisador@exemplo.com`, mot de passe `senha-de-teste`) : l'étude d'exemple est déjà dans la liste.
2. Dans Résultats › Exporter, téléchargez les réponses recodées et les résultats par échelle.
3. Dans un tableur, calculez la moyenne des items de chaque échelle par participant, puis la moyenne, le `DESVPAD` et la marge `1,959964 × DESVPAD / RAIZ(n)` de chaque échelle. Pour l'alpha, calculez `CORREL` de chaque paire d'items de l'échelle, faites la moyenne et appliquez k × r̄ / (1 + (k - 1) × r̄). Dans Excel en français, les fonctions s'appellent `ECARTYPE` et `RACINE`.
4. Comparez avec le fichier des résultats par échelle et avec le tableau de bord.
5. Pour comparer avec le tableur officiel, téléchargez « Tableur officiel de l'UEQ (XLSX) », ouvrez-le dans Excel et cliquez sur Activer la modification. Les onglets Results, Confidence_Intervals, Scale_Consistency, Benchmark et Inconsistencies affichent les nombres du tableur lui-même, calculés avec les réponses de l'étude.
