# Protocole UEQ · spécification du calcul

Source : Schrepp, M. *User Experience Questionnaire Handbook* et le tableur officiel *UEQ Data Analysis Tool* (ueq-online.org). Versions vérifiées le 23/10/2026 : Handbook version 11 (12/09/2023) et `UEQ_Data_Analysis_Tool_V15.xlsx` (22/10/2026). Lorsque le handbook et le tableur divergent, c'est le tableur qui fait foi, car c'est avec lui que les tests comparent leurs résultats. Chaque règle indique entre parenthèses la source où elle a été vérifiée : la page du handbook ou l'onglet du tableur.

## 1. Items, échelles et polarité

26 items de différentiel sémantique, 7 positions, enregistrées de 1 (pôle gauche) à 7 (pôle droit). Le participant ne voit jamais de nombres.

Polarité :
- `+` = terme positif à **droite** → `x' = x - 4`
- `-` = terme positif à **gauche** → `x' = 4 - x`

| N° | Pôle gauche (EN) | Pôle droit (EN) | Échelle | Polarité |
|---|---|---|---|---|
| 1 | annoying | enjoyable | Attractivité | + |
| 2 | not understandable | understandable | Clarté | + |
| 3 | creative | dull | Nouveauté | - |
| 4 | easy to learn | difficult to learn | Clarté | - |
| 5 | valuable | inferior | Stimulation | - |
| 6 | boring | exciting | Stimulation | + |
| 7 | not interesting | interesting | Stimulation | + |
| 8 | unpredictable | predictable | Fiabilité | + |
| 9 | fast | slow | Efficacité | - |
| 10 | inventive | conventional | Nouveauté | - |
| 11 | obstructive | supportive | Fiabilité | + |
| 12 | good | bad | Attractivité | - |
| 13 | complicated | easy | Clarté | + |
| 14 | unlikable | pleasing | Attractivité | + |
| 15 | usual | leading edge | Nouveauté | + |
| 16 | unpleasant | pleasant | Attractivité | + |
| 17 | secure | not secure | Fiabilité | - |
| 18 | motivating | demotivating | Stimulation | - |
| 19 | meets expectations | does not meet expectations | Fiabilité | - |
| 20 | inefficient | efficient | Efficacité | + |
| 21 | clear | confusing | Clarté | - |
| 22 | impractical | practical | Efficacité | + |
| 23 | organized | cluttered | Efficacité | - |
| 24 | attractive | unattractive | Attractivité | - |
| 25 | friendly | unfriendly | Attractivité | - |
| 26 | conservative | innovative | Nouveauté | + |

Vérification rapide : Attractivité 1, 12, 14, 16, 24, 25 · Clarté 2, 4, 13, 21 · Efficacité 9, 20, 22, 23 · Fiabilité 8, 11, 17, 19 · Stimulation 5, 6, 7, 18 · Nouveauté 3, 10, 15, 26. Cela fait 13 items de polarité `-`.

Les termes en portugais ne figurent **pas** ici, et c'est voulu. Ils proviennent du paquet officiel de langues et se trouvent dans `data/ueq-itens-ptbr.json` (voir `data/LEIA-ME.md`). (Source : tableur, onglet DT.) Les formules de recodage de la ligne 4 et les moyennes par échelle (colonnes AC à AH) correspondent au tableau ci-dessus.

Regroupement :
- Qualité pragmatique = moyenne de Clarté, Efficacité, Fiabilité
- Qualité hédonique = moyenne de Stimulation, Nouveauté
- Attractivité reste seule (impression générale)

## 2. Recodage

`recodificar(valor: 1..7, polaridade: '+' | '-'): -3..3`. Une valeur hors de 1..7 lève une erreur.

## 3. Score par participant et par échelle

Moyenne des valeurs recodées des items de cette échelle, pour ce participant.

(Source : tableur, onglet DT.) Une cellule vide est ignorée. Le score de l'échelle est la moyenne des seuls items renseignés (`AVERAGE`), et il reste vide si aucun item de l'échelle n'a reçu de réponse. Notre outil exige les 26 items (validation dans le formulaire) : il n'existe donc aucune valeur manquante issue de la collecte. L'importation par CSV suit la même règle : chaque ligne doit contenir les 26 valeurs de 1 à 7, et le fichier dont une seule ligne est invalide est refusé en entier (`src/lib/importacao.ts`).

## 4. Statistiques par échelle (parmi les participants inclus dans l'analyse)

- `n` = participants inclus
- `media` = moyenne des scores par participant
- `dp` = écart type d'échantillon (diviseur `n - 1`) (source : tableur, onglet Confidence_Intervals : STDEV)
- `ic95` = `media ± z · dp / √n`, avec `z = 1,959963984540054`, le quantile 0,975 exact de la loi normale. Le tableur utilise `CONFIDENCE(0.05; dp; n)`, qui n'arrondit pas à 1,96, et avec 1,96 les tests divergent dès la sixième décimale. (source : tableur, onglet Confidence_Intervals)
- aussi par item : moyenne, dp, n et distribution des réponses de 1 à 7 (pour le graphique par item)

Avec `n < 2`, il n'existe ni dp ni IC. Avec `dp = 0` (tous ont obtenu le même score), le tableur ne calcule pas non plus l'IC, car `CONFIDENCE` exige un dp supérieur à zéro (`#NUM!`), et nous suivons le tableur. La fonction renvoie `null` dans ces champs et l'interface affiche « échantillon insuffisant ».

## 5. Plages d'interprétation

| Moyenne de l'échelle | Lecture |
|---|---|
| > +0,8 | positive |
| entre -0,8 et +0,8 | neutre |
| < -0,8 | négative |

(Source : handbook p. 5.) « values between -0.8 and 0.8 represent a neutral evaluation, values > 0,8 positive, values < -0,8 negative ». Ainsi, -0,8 et 0,8 tombent dans la plage neutre. Le tableur ne fait que reprendre ce texte dans l'onglet Results et ne calcule pas la plage.

## 6. Alpha de Cronbach par échelle

Le tableur n'utilise pas la formule fondée sur les variances, mais l'alpha standardisé, calculé à partir de la moyenne des corrélations entre les items :

```
r̄    = média das correlações de Pearson entre todos os pares de itens da escala
alfa = k · r̄ / (1 + (k - 1) · r̄)
```
`k` = nombre d'items de l'échelle (6 pour Attractivité, 4 pour les autres), ce qui donne 15 paires pour Attractivité et 6 pour les autres. Le calcul utilise les valeurs recodées. (source : handbook p. 10 et tableur, onglet Scale_Consistency : CORREL et (4*r̄)/(1+(3*r̄)))

Si un item de l'échelle ne varie pas d'un participant à l'autre, la corrélation n'existe pas (le tableur affiche `#DIV/0!`), et il en va de même avec `n < 2`. Dans ces cas, l'alpha vaut `null`. Une valeur inférieure à **0,7** est signalée dans le tableau de bord par un texte expliquant que l'échelle est peut-être mal interprétée par ce groupe. Le handbook considère 0,6 ou 0,7 comme une règle empirique et recommande la prudence avec les petits échantillons (moins de 50).

Le tableur affiche aussi l'intervalle de confiance de l'alpha (Bonett, 2002) et le Lambda2 de Guttman. Les deux sont hors du périmètre.

## 7. Réponses incohérentes

Pour chaque participant et chaque échelle : `amplitude = max(items recodés) - min(items recodés)`.
- `amplitude > 3` → échelle incohérente pour ce participant (source : handbook p. 7-8 et tableur, onglet Inconsistencies)
- participant incohérent sur **3 échelles ou plus** → marqué comme suspect. Le handbook laisse au chercheur le choix entre 2 et 3 échelles. Le tableur suggère de retirer ceux qui en ont 3 ou plus dans la colonne « Critical? », et nous suivons le tableur. (source : handbook p. 8 et tableur, onglet Inconsistencies)

Seconde règle, issue du handbook et du tableur : un participant avec **plus de 15 réponses identiques** sur les 26 items (comptées sur l'échelle d'origine de 1 à 7, par exemple tout sur le 4) est lui aussi marqué comme suspect. (source : handbook p. 8 (Schrepp, 2023) et tableur, onglet Inconsistencies, colonne « Critical length »)

Le participant est suspect s'il relève de l'une ou l'autre des deux règles, et l'interface indique laquelle. Les trois seuils (`amplitudeMaxima`, `escalasParaSuspeita`, `respostasIguaisMaximas`) se trouvent dans `data/protocolo.json`, et non dans le code.

Le chercheur voit la liste des suspects et décide qui sort de l'analyse. Exclure n'efface pas la réponse : cela change seulement `incluidaNaAnalise = false`. Tous les chiffres du tableau de bord et de l'export des résultats ne tiennent compte que des participations incluses. L'export des réponses brutes contient toutes les participations, avec une colonne indiquant l'inclusion.

## 8. Référence (benchmark)

Chaque moyenne d'échelle est classée dans l'une de cinq plages : Excellent, Bon, Au-dessus de la moyenne, Sous la moyenne, Mauvais. Les limites par échelle se trouvent dans `data/benchmark.json`, avec le champ `fonte` renseigné (version du benchmark, année, page ou onglet). (Source : tableur V15, onglet Benchmark, tableau « Benchmark borders ».) Les limites sont les quantiles 0,25 (`abaixoDaMedia`), 0,5 (`acimaDaMedia`), 0,75 (`bom`) et 0,9 (`excelente`), fondés sur 21175 personnes issues de 468 études. Le benchmark est mis à jour une fois par an (handbook p. 5) : vérifiez donc la version du tableur avant la présentation. Ne pas utiliser de valeurs tirées d'un blog, d'un article tiers ou de la mémoire d'un modèle.

Format attendu :
```json
{
  "fonte": "UEQ Data Analysis Tool vX, aba Benchmark, acessado em DD/MM/2026",
  "escalas": {
    "atratividade": { "excelente": 0, "bom": 0, "acimaDaMedia": 0, "abaixoDaMedia": 0 }
  }
}
```
Lecture, avec l'inégalité stricte comme dans la formule du tableur : `media > excelente` → Excellent, `> bom` → Bon, `> acimaDaMedia` → Au-dessus de la moyenne, `> abaixoDaMedia` → Sous la moyenne, sinon Mauvais. Une moyenne exactement égale à la limite reste dans la plage inférieure.

## 9. Exports

1. **Réponses brutes** (CSV) : une ligne par participation. Colonnes : identifiant de la participation, version, date, incluse (oui/non), suspecte (oui/non), origine, langue, traduction approuvée, mineur (a déclaré avoir moins de 18 ans avec l'autorisation du responsable), données démographiques, `item01` à `item26` avec les valeurs 1 à 7.
2. **Réponses recodées** (CSV) : même format, valeurs -3 à 3.
3. **Résultats par échelle** (CSV) : version, échelle, n, moyenne, dp, ic95 inférieur, ic95 supérieur, alpha, plage d'interprétation, plage du benchmark.
4. **Tableur officiel rempli** (XLSX) : le *UEQ Data Analysis Tool V15* lui-même (`data/planilha-oficial/UEQ_Data_Analysis_Tool_V15.xlsx`, copié sans modification depuis `Data_Analysis_Tools.zip`), avec les 26 valeurs de 1 à 7 de chaque participation incluse dans l'analyse à partir de `Data!A4`, une colonne par item de A à Z, dans l'ordre où les participations ont été terminées. (Source : tableur V15, onglet Data.) L'export n'écrit que la saisie, comme quelqu'un qui collerait les réponses à la main :
   - il efface les 255 participants d'exemple fournis dans l'onglet Data et écrit les réponses à leur place ;
   - il place dans `Read_First!B5` la langue de l'interface, parmi les 37 que le tableur traduit, pour que les libellés et les items sortent dans cette langue ;
   - il retire des autres onglets les résultats enregistrés pour les données d'exemple et marque le fichier pour qu'il soit recalculé à l'ouverture (`fullCalcOnLoad`). Dans Excel, le tableur se recalcule lorsque l'on clique sur **Activer la modification**.

   Les formules, les graphiques, les styles et les autres onglets restent identiques à ceux du fichier officiel, et un test le vérifie octet par octet. Sur l'écran d'une version, seule cette version est exportée ; avec « Toutes les versions », c'est l'étude entière. Le tableur calcule jusqu'à 1000 participants (l'avertissement de l'onglet Data) ; au-delà, le tableau de bord l'explique et propose les réponses brutes.

CSV en UTF-8 avec BOM et séparateur `;` (s'ouvre directement dans Excel en pt-BR). Nombres avec virgule décimale dans le CSV des résultats.

## 10. Validation par rapport au tableur officiel

Dans `data/fixtures/` se trouvent 11 scénarios, chacun avec un `respostas.csv` (format du tableur) et un `esperado.json` contenant les chiffres du tableur officiel recalculé dans Excel après avoir collé les réponses dans `Data!A4`. La liste des scénarios, les cellules lues et le script qui automatise Excel se trouvent dans [data/fixtures/LEIA-ME.md](../data/fixtures/LEIA-ME.md) :

- `basico` : 20 participants avec des réponses variées ;
- `inconsistente` : 15, dont 4 suspects par amplitude et 2 cas limites ;
- `extremos` : tous à 1, tous à 7, n = 1, n = 2 ;
- `oficial-exemplo` : les 255 participants d'exemple du tableur lui-même ;
- `grande` : 1000 participants, le maximum du tableur ;
- `bordas` : amplitude exactement égale à 3, 15 et 16 réponses identiques, 26 fois le 4 ;
- `variancia-zero` : un item avec la même réponse pour tous (erreur du tableur sur l'alpha et l'IC) ;
- `negativo` : moyennes négatives, benchmark Mauvais et alpha négatif.

Les tests du module `src/ueq/` comparent la moyenne, le dp, le n et l'IC95 des échelles et des items, l'alpha, le benchmark, la qualité pragmatique et hédonique, les échelles incohérentes et les réponses identiques par participant, ainsi que la distribution des réponses, avec une tolérance de `1e-6`. Une erreur du tableur doit valoir `null` dans l'outil.

**Situation au 17/11/2026 :** les 11 scénarios correspondent au tableur officiel. 6.543 valeurs sont comparées, et le plus grand écart est de 9,3 × 10⁻¹⁵, soit un arrondi en virgule flottante. Les 245 cellules où le tableur renvoie une erreur valent `null` dans l'outil ([RNF11](documentacao/requisitos.md#rnf11), [vérification du calcul](documentacao/verificacao-do-calculo.md#comparação-com-a-planilha-oficial)).

## 11. UEQ-S, la version courte

(Source : Handbook UEQ version 11, « Short version for special application scenarios », p. 11-13, et le *UEQ-S Data Analysis Tool V15*, `data/planilha-oficial/Short_UEQ_Data_Analysis_Tool_V15.xlsx`.)

L'étude choisit le questionnaire à sa création : l'UEQ complet ou l'UEQ-S. Le choix se verrouille à la première réponse, pour que l'étude ne mélange pas les deux. Le handbook ne recommande l'UEQ-S que lorsque la version complète ne convient pas (peu de temps, l'UEQ intégré dans un questionnaire plus large, une même personne évaluant plusieurs produits à la suite), car il ne mesure pas les 6 échelles.

**Items.** Ce sont 8 items de l'UEQ lui-même, dans cet ordre ([`data/ueq-s-itens-ptbr.json`](../data/ueq-s-itens-ptbr.json)) :

| UEQ-S | Item de l'UEQ | Gauche | Droite | Échelle |
|---|---|---|---|---|
| 1 | 11 | Obstrutivo | Condutor | Qualité pragmatique |
| 2 | 13 | Complicado | Fácil | Qualité pragmatique |
| 3 | 20 | Ineficiente | Eficiente | Qualité pragmatique |
| 4 | 21 | Confuso | Evidente | Qualité pragmatique |
| 5 | 6 | Aborrecido | Excitante | Qualité hédonique |
| 6 | 7 | Desinteressante | Interessante | Qualité hédonique |
| 7 | 10 | Convencional | Original | Qualité hédonique |
| 8 | 15 | Comum | Vanguardista | Qualité hédonique |

Dans l'UEQ-S, le terme négatif est toujours à gauche : tous les items ont donc la polarité `+` et le recodage est x − 4. Les items 4 et 7 apparaissent avec les côtés inversés par rapport à l'UEQ : une réponse x dans l'UEQ-S vaut 8 − x dans l'item équivalent de l'UEQ. L'UEQ-S existe dans les mêmes 37 langues. Les termes de chaque langue proviennent de la liste officielle des items de l'UEQ-S (`docs/UEQ-ORG/ueq-s/UEQS_Items.pdf`), conservée dans [`data/ueq-s-idiomas.json`](../data/ueq-s-idiomas.json). Dans 31 langues, elle reprend les paires de l'UEQ complet, avec l'inversion des côtés. Dans 6 (italien, croate, grec, turc, persan et chinois), elle utilise un autre mot dans certaines paires, par exemple *konvencionalna/inventivna* pour l'item 7 en croate, et l'outil suit la liste de l'UEQ-S. Dans 4 langues (espagnol, danois, tamoul et kannada), le PDF contient des fautes de frappe ou une paire répétée ; dans ces cas, on conserve la paire de l'UEQ complet, et le fichier consigne chaque correction.

**Où se trouvent les réponses.** Dans une étude UEQ-S, les 8 réponses sont enregistrées dans les items équivalents de l'UEQ, déjà converties vers l'orientation de chacun. L'analyse de l'UEQ-S lit ces 8 items et annule la conversion. C'est pourquoi la même analyse sert aux deux types d'étude : dans une étude UEQ complet, l'onglet UEQ-S des résultats utilise les 8 paires auxquelles le participant a aussi répondu, de la même façon que les auteurs ont construit l'UEQ-S et son benchmark.

**Échelles.** Pour chaque participant (onglet DT) : qualité pragmatique = moyenne des items 1 à 4 ; qualité hédonique = moyenne des items 5 à 8 ; globale = moyenne des 8. La moyenne, le dp, l'IC95, la plage d'interprétation et le benchmark suivent les sections 4, 5 et 8, avec la même plage neutre et le même z. Le handbook recommande de la prudence avec l'échelle globale : ce n'est pas un indicateur unique de l'expérience, car le poids de la composante pragmatique et celui de la composante hédonique changent d'un produit à l'autre.

**Alpha.** Uniquement pour la pragmatique et l'hédonique, avec la formule de la section 6 pour k = 4 (onglet Scale_Consistency, `4·r̄ / (1 + 3·r̄)`). Le tableur ne calcule pas d'alpha pour la globale.

**Benchmark.** Les limites de l'onglet Benchmark du tableur de l'UEQ-S ([`data/benchmark-ueq-s.json`](../data/benchmark-ueq-s.json)) :

| Échelle | Sous la moyenne | Au-dessus de la moyenne | Bon | Excellent |
|---|---|---|---|---|
| Qualité pragmatique | 0,72 | 1,17 | 1,55 | 1,74 |
| Qualité hédonique | 0,35 | 0,85 | 1,20 | 1,59 |
| Globale | 0,59 | 0,98 | 1,31 | 1,58 |

Le tableur lui-même précise que, faute de données sur l'UEQ-S, ces limites proviennent des mêmes 8 items au sein du benchmark de l'UEQ complet et constituent une approximation. Le tableau de bord répète l'avertissement.

**Réponses suspectes.** Les règles de l'onglet Inconsistencies du tableur de l'UEQ-S ([`data/protocolo-ueq-s.json`](../data/protocolo-ueq-s.json)), différentes de celles de l'UEQ complet :

- une échelle est incohérente lorsque l'écart entre son meilleur et son pire item dépasse 3 ;
- la réponse est suspecte lorsque les 2 échelles sont incohérentes ;
- la seconde règle ne vaut que pour qui a coché la position du milieu (4) sur les 8 items. Avec si peu d'items, répéter la même position est courant, et le tableur se contente de recommander de retirer ce cas.

**Exports.** Dans une étude UEQ-S, les réponses brutes et recodées comptent 8 colonnes (`item01` à `item08`, dans l'ordre de l'UEQ-S), les résultats par échelle comprennent la pragmatique, l'hédonique et la globale, et le tableur officiel exporté est celui de l'UEQ-S, rempli comme à la section 9.4 : les 8 réponses dans `Data!A4:H` et la langue dans `Read_First!B4`. Dans une étude UEQ complet, l'onglet UEQ-S exporte les résultats de l'UEQ-S et le tableur de l'UEQ-S avec les 8 items équivalents.

**Validation.** Dans `data/fixtures-ueq-s/` se trouvent 9 scénarios avec le `esperado.json` du tableur de l'UEQ-S recalculé dans Excel ([data/fixtures-ueq-s/LEIA-ME.md](../data/fixtures-ueq-s/LEIA-ME.md)), dont deux tirés de scénarios de l'UEQ complet. **Situation au 17/11/2026 :** les 9 correspondent au tableur. 8.520 valeurs sont comparées, et le plus grand écart est de 6,0 × 10⁻¹⁵. Les 38 cellules où le tableur renvoie une erreur valent `null` dans l'outil ([RF62](documentacao/requisitos.md#rf62)).
