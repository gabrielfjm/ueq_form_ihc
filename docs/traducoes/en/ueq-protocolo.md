# UEQ protocol · calculation specification

Source: Schrepp, M. *User Experience Questionnaire Handbook* and the official spreadsheet *UEQ Data Analysis Tool* (ueq-online.org). Versions checked on 23 Oct 2026: Handbook version 11 (12 Sep 2023) and `UEQ_Data_Analysis_Tool_V15.xlsx` (22 Oct 2026). When the handbook and the spreadsheet disagree, the spreadsheet prevails, because it is what the tests compare against. Each rule gives in parentheses the source it was checked against: the handbook page or the spreadsheet tab.

## 1. Items, scales and polarity

26 semantic differential items, 7 positions, stored from 1 (left pole) to 7 (right pole). The participant never sees numbers.

Polarity:
- `+` = positive term on the **right** → `x' = x - 4`
- `-` = positive term on the **left** → `x' = 4 - x`

| No. | Left pole (EN) | Right pole (EN) | Scale | Polarity |
|---|---|---|---|---|
| 1 | annoying | enjoyable | Attractiveness | + |
| 2 | not understandable | understandable | Perspicuity | + |
| 3 | creative | dull | Novelty | - |
| 4 | easy to learn | difficult to learn | Perspicuity | - |
| 5 | valuable | inferior | Stimulation | - |
| 6 | boring | exciting | Stimulation | + |
| 7 | not interesting | interesting | Stimulation | + |
| 8 | unpredictable | predictable | Dependability | + |
| 9 | fast | slow | Efficiency | - |
| 10 | inventive | conventional | Novelty | - |
| 11 | obstructive | supportive | Dependability | + |
| 12 | good | bad | Attractiveness | - |
| 13 | complicated | easy | Perspicuity | + |
| 14 | unlikable | pleasing | Attractiveness | + |
| 15 | usual | leading edge | Novelty | + |
| 16 | unpleasant | pleasant | Attractiveness | + |
| 17 | secure | not secure | Dependability | - |
| 18 | motivating | demotivating | Stimulation | - |
| 19 | meets expectations | does not meet expectations | Dependability | - |
| 20 | inefficient | efficient | Efficiency | + |
| 21 | clear | confusing | Perspicuity | - |
| 22 | impractical | practical | Efficiency | + |
| 23 | organized | cluttered | Efficiency | - |
| 24 | attractive | unattractive | Attractiveness | - |
| 25 | friendly | unfriendly | Attractiveness | - |
| 26 | conservative | innovative | Novelty | + |

Quick check: Attractiveness 1, 12, 14, 16, 24, 25 · Perspicuity 2, 4, 13, 21 · Efficiency 9, 20, 22, 23 · Dependability 8, 11, 17, 19 · Stimulation 5, 6, 7, 18 · Novelty 3, 10, 15, 26. There are 13 items with `-` polarity.

The Portuguese terms are **not** here, on purpose. They come from the official language package and are kept in `data/ueq-itens-ptbr.json` (see `data/LEIA-ME.md`). (Source: spreadsheet, DT tab.) The recoding formulas in row 4 and the means per scale (columns AC to AH) match the table above.

Grouping:
- Pragmatic Quality = mean of Perspicuity, Efficiency, Dependability
- Hedonic Quality = mean of Stimulation, Novelty
- Attractiveness stands on its own (overall impression)

## 2. Recoding

`recodificar(valor: 1..7, polaridade: '+' | '-'): -3..3`. A value outside 1..7 throws an error.

## 3. Score per participant and scale

The mean of the recoded values of that scale's items, for that participant.

(Source: spreadsheet, DT tab.) An empty cell is ignored. The scale score is the mean of the answered items only (`AVERAGE`), and it is empty if no item of the scale was answered. Our tool requires all 26 items (validation in the form), so there are no missing values coming from data collection. CSV import follows the same rule: each row needs all 26 values from 1 to 7, and a file with any invalid row is rejected as a whole (`src/lib/importacao.ts`).

## 4. Statistics per scale (across participants included in the analysis)

- `n` = participants included
- `media` = mean of the per-participant scores
- `dp` = sample standard deviation (divisor `n - 1`) (source: spreadsheet, Confidence_Intervals tab: STDEV)
- `ic95` = `media ± z · dp / √n`, with `z = 1,959963984540054`, the exact 0.975 quantile of the normal distribution. The spreadsheet uses `CONFIDENCE(0.05; dp; n)`, which does not round to 1.96, and with 1.96 the tests already fail at the sixth decimal place. (source: spreadsheet, Confidence_Intervals tab)
- also per item: mean, standard deviation, n and the distribution of responses 1 to 7 (for the per-item chart)

With `n < 2` there is no standard deviation and no confidence interval. With `dp = 0` (everyone gave the same score) the spreadsheet does not calculate the confidence interval either, because `CONFIDENCE` requires a standard deviation greater than zero (`#NUM!`), and we follow the spreadsheet. The function returns `null` in these fields and the UI shows "insufficient sample".

## 5. Interpretation ranges

| Scale mean | Reading |
|---|---|
| > +0.8 | positive |
| between -0.8 and +0.8 | neutral |
| < -0.8 | negative |

(Source: handbook p. 5.) "values between -0.8 and 0.8 represent a neutral evaluation, values > 0.8 positive, values < -0.8 negative". So -0.8 and 0.8 fall into neutral. The spreadsheet only repeats this text in the Results tab and does not calculate the range.

## 6. Cronbach's alpha per scale

The spreadsheet does not use the variance formula, but the standardized alpha, calculated from the mean of the inter-item correlations:

```
r̄    = média das correlações de Pearson entre todos os pares de itens da escala
alfa = k · r̄ / (1 + (k - 1) · r̄)
```
`k` = number of items in the scale (6 in Attractiveness, 4 in the others), which gives 15 pairs in Attractiveness and 6 in the others. The calculation uses the recoded values. (source: handbook p. 10 and spreadsheet, Scale_Consistency tab: CORREL and (4*r̄)/(1+(3*r̄)))

If any item of the scale does not vary across participants, the correlation does not exist (the spreadsheet shows `#DIV/0!`), and with `n < 2` it does not exist either. In these cases alpha is `null`. A value below **0.7** is flagged on the dashboard with text explaining that the scale may be misinterpreted by this group. The handbook treats 0.6 or 0.7 as a rule of thumb and asks for caution with small samples (fewer than 50).

The spreadsheet also shows the confidence interval of alpha (Bonett, 2002) and Guttman's Lambda2. Both are out of scope.

## 7. Inconsistent responses

For each participant and each scale: `amplitude = max(itens recodificados) - min(itens recodificados)`.
- `amplitude > 3` → scale inconsistent for that participant (source: handbook p. 7-8 and spreadsheet, Inconsistencies tab)
- participant with inconsistency in **3 or more scales** → flagged as suspicious. The handbook leaves the choice between 2 and 3 scales to the researcher. The spreadsheet suggests removing those with 3 or more in the "Critical?" column, and we follow the spreadsheet. (source: handbook p. 8 and spreadsheet, Inconsistencies tab)

Second rule, from the handbook and the spreadsheet: a participant with **more than 15 identical responses** across the 26 items (counted on the original 1 to 7 scale, for example everything at 4) is also flagged as suspicious. (source: handbook p. 8 (Schrepp, 2023) and spreadsheet, Inconsistencies tab, "Critical length" column)

The participant is suspicious if they meet either of the two rules, and the interface shows which one it was. The three thresholds (`amplitudeMaxima`, `escalasParaSuspeita`, `respostasIguaisMaximas`) are kept in `data/protocolo.json`, not in the code.

The researcher sees the list of suspicious responses and decides who leaves the analysis. Excluding does not delete the response: it only sets `incluidaNaAnalise = false`. Every number on the dashboard and in the results export considers only included participations. The raw responses export contains all of them, with a column indicating inclusion.

## 8. Benchmark

Each scale mean is classified into one of five ranges: Excellent, Good, Above the mean, Below the mean, Bad. The limits per scale are kept in `data/benchmark.json` with the `fonte` field filled in (benchmark version, year, page or tab). (Source: spreadsheet V15, Benchmark tab, "Benchmark borders" table.) The limits are the quantiles 0.25 (`abaixoDaMedia`), 0.5 (`acimaDaMedia`), 0.75 (`bom`) and 0.9 (`excelente`), based on 21175 people from 468 studies. The benchmark is updated once a year (handbook p. 5), so check the spreadsheet version before the presentation. Do not use values taken from a blog, a third-party article or a model's memory.

Expected format:
```json
{
  "fonte": "UEQ Data Analysis Tool vX, aba Benchmark, acessado em DD/MM/2026",
  "escalas": {
    "atratividade": { "excelente": 0, "bom": 0, "acimaDaMedia": 0, "abaixoDaMedia": 0 }
  }
}
```
Reading, with strict greater-than as in the spreadsheet formula: `media > excelente` → Excellent, `> bom` → Good, `> acimaDaMedia` → Above the mean, `> abaixoDaMedia` → Below the mean, otherwise Bad. A mean exactly equal to a limit falls into the range below.

## 9. Exports

1. **Raw responses** (CSV): one row per participation. Columns: participation id, version, date, included (yes/no), suspicious (yes/no), source, language, translation approved, minor (declared being under 18 with the guardian's authorization), demographics, `item01` to `item26` with values 1 to 7.
2. **Coded responses** (CSV): same format, values -3 to 3.
3. **Results by scale** (CSV): version, scale, n, mean, standard deviation, lower ic95, upper ic95, alpha, interpretation range, benchmark range.
4. **Filled-in official spreadsheet** (XLSX): the *UEQ Data Analysis Tool V15* itself (`data/planilha-oficial/UEQ_Data_Analysis_Tool_V15.xlsx`, copied unchanged from `Data_Analysis_Tools.zip`), with the 26 values from 1 to 7 of each participation in the analysis starting at `Data!A4`, one column per item from A to Z, in the order in which the participations were completed. (Source: spreadsheet V15, Data tab.) The export writes only the input, as someone pasting the responses by hand would:
   - it deletes the 255 sample participants that come in the Data tab and writes the responses in their place;
   - it puts in `Read_First!B5` the interface language, among the 37 that the spreadsheet translates, so that the labels and the items come out in that language;
   - it removes from the other tabs the stored results of the sample data and marks the file to recalculate on opening (`fullCalcOnLoad`). In Excel, the spreadsheet recalculates when you click **Enable Editing**.

   Formulas, charts, styles and the other tabs stay identical to those of the official file, and a test checks this byte by byte. On the screen of a version, only that version is exported; in "All versions", the whole study is exported. The spreadsheet calculates up to 1000 participants (the notice in the Data tab); above that the dashboard explains this and offers the raw responses.

CSV in UTF-8 with BOM and `;` separator (opens directly in Excel in pt-BR). Numbers with a decimal comma in the results CSV.

## 10. Validation against the official spreadsheet

`data/fixtures/` holds 11 scenarios, each with `respostas.csv` (spreadsheet format) and `esperado.json` with the numbers of the official spreadsheet recalculated in Excel after pasting the responses into `Data!A4`. The list of scenarios, the cells read and the script that automates Excel are in [data/fixtures/LEIA-ME.md](../data/fixtures/LEIA-ME.md):

- `basico`: 20 participants with varied responses;
- `inconsistente`: 15, with 4 suspicious by range and 2 edge cases;
- `extremos`: all 1, all 7, n = 1, n = 2;
- `oficial-exemplo`: the 255 sample participants of the spreadsheet itself;
- `grande`: 1000 participants, the spreadsheet's maximum;
- `bordas`: range exactly 3, 15 and 16 identical responses, 4 given 26 times;
- `variancia-zero`: an item with the same response for everyone (spreadsheet error in alpha and in the confidence interval);
- `negativo`: negative means, Bad benchmark and negative alpha.

The tests of the `src/ueq/` module compare mean, standard deviation, n and ic95 of scales and items, alpha, benchmark, Pragmatic and Hedonic Quality, inconsistent scales and identical responses per participant, and the distribution of responses, with a tolerance of `1e-6`. A spreadsheet error must be `null` in the tool.

**Status on 17 Nov 2026:** all 11 scenarios match the official spreadsheet. 6,543 values are compared, and the largest difference is 9.3 × 10⁻¹⁵, which is floating-point rounding. The 245 cells where the spreadsheet gives an error are `null` in the tool ([RNF11](documentacao/requisitos.md#rnf11), [calculation check](documentacao/verificacao-do-calculo.md#comparação-com-a-planilha-oficial)).

## 11. UEQ-S, the short version

(Source: UEQ Handbook version 11, "Short version for special application scenarios", p. 11-13, and the *UEQ-S Data Analysis Tool V15*, `data/planilha-oficial/Short_UEQ_Data_Analysis_Tool_V15.xlsx`.)

The study chooses the questionnaire when it is created: the full UEQ or the UEQ-S. The choice is locked at the first response, so that the study does not mix the two. The handbook recommends the UEQ-S only when the full version does not fit (little time, the UEQ inside a larger questionnaire, the same person evaluating several products in a row), because it does not measure the 6 scales.

**Items.** These are 8 items of the UEQ itself, in this order ([`data/ueq-s-itens-ptbr.json`](../data/ueq-s-itens-ptbr.json)):

| UEQ-S | UEQ item | Left | Right | Scale |
|---|---|---|---|---|
| 1 | 11 | Obstrutivo (obstructive) | Condutor (supportive) | Pragmatic Quality |
| 2 | 13 | Complicado (complicated) | Fácil (easy) | Pragmatic Quality |
| 3 | 20 | Ineficiente (inefficient) | Eficiente (efficient) | Pragmatic Quality |
| 4 | 21 | Confuso (confusing) | Evidente (clear) | Pragmatic Quality |
| 5 | 6 | Aborrecido (boring) | Excitante (exciting) | Hedonic Quality |
| 6 | 7 | Desinteressante (not interesting) | Interessante (interesting) | Hedonic Quality |
| 7 | 10 | Convencional (conventional) | Original (inventive) | Hedonic Quality |
| 8 | 15 | Comum (usual) | Vanguardista (leading edge) | Hedonic Quality |

In the UEQ-S the negative term is always on the left, so all items have `+` polarity and the recoding is x − 4. Items 4 and 7 appear with their sides swapped relative to the UEQ: a response x in the UEQ-S is 8 − x in the equivalent UEQ item. The UEQ-S exists in the same 37 languages. The terms of each language come from the official list of UEQ-S items (`docs/UEQ-ORG/ueq-s/UEQS_Items.pdf`), stored in [`data/ueq-s-idiomas.json`](../data/ueq-s-idiomas.json). In 31 languages it repeats the pairs of the full UEQ, with the side swap. In 6 (Italian, Croatian, Greek, Turkish, Persian and Chinese) it uses a different word in some pairs, for example *konvencionalna/inventivna* in item 7 in Croatian, and the tool follows the UEQ-S list. In 4 languages (Spanish, Danish, Tamil and Kannada) the PDF has typos or a repeated pair; in these cases the pair of the full UEQ is used, and the file records each correction.

**Where the responses are stored.** In a UEQ-S study, the 8 responses are stored in the equivalent UEQ items, already converted to the orientation of each one. The UEQ-S analysis reads these 8 items and undoes the conversion. That is why the same analysis serves both types of study: in a full UEQ study, the UEQ-S tab of the results uses the 8 pairs that the participant also answered, in the same way the authors built the UEQ-S and its benchmark.

**Scales.** For each participant (DT tab): Pragmatic Quality = mean of items 1 to 4; Hedonic Quality = mean of items 5 to 8; overall = mean of all 8. Mean, standard deviation, ic95, interpretation range and benchmark follow sections 4, 5 and 8, with the same neutral range and the same z. The handbook asks for caution with the overall scale: it is not a single indicator of experience, because the weight of the pragmatic and hedonic qualities changes from product to product.

**Alpha.** Only for the pragmatic and hedonic qualities, with the formula of section 6 for k = 4 (Scale_Consistency tab, `4·r̄ / (1 + 3·r̄)`). The spreadsheet does not calculate alpha for the overall scale.

**Benchmark.** The limits of the Benchmark tab of the UEQ-S spreadsheet ([`data/benchmark-ueq-s.json`](../data/benchmark-ueq-s.json)):

| Scale | Below the mean | Above the mean | Good | Excellent |
|---|---|---|---|---|
| Pragmatic Quality | 0.72 | 1.17 | 1.55 | 1.74 |
| Hedonic Quality | 0.35 | 0.85 | 1.20 | 1.59 |
| Overall | 0.59 | 0.98 | 1.31 | 1.58 |

The spreadsheet itself warns that, for lack of UEQ-S data, these limits come from the same 8 items within the benchmark of the full UEQ and are an approximation. The dashboard repeats the warning.

**Suspicious responses.** The rules of the Inconsistencies tab of the UEQ-S spreadsheet ([`data/protocolo-ueq-s.json`](../data/protocolo-ueq-s.json)), different from those of the full UEQ:

- a scale is inconsistent when the distance between its best and worst item exceeds 3;
- the response is suspicious when both scales are inconsistent;
- the second rule applies only to those who marked the middle position (4) on all 8 items. With so few items, repeating the same position is common, and the spreadsheet only recommends removing this case.

**Exports.** In a UEQ-S study, the raw and coded responses have 8 columns (`item01` to `item08`, in UEQ-S order), the results by scale have pragmatic, hedonic and overall, and the exported official spreadsheet is the UEQ-S one, filled in as in section 9.4: the 8 responses in `Data!A4:H` and the language in `Read_First!B4`. In a full UEQ study, the UEQ-S tab exports the UEQ-S results and the UEQ-S spreadsheet with the 8 equivalent items.

**Validation.** `data/fixtures-ueq-s/` holds 9 scenarios with the `esperado.json` of the UEQ-S spreadsheet recalculated in Excel ([data/fixtures-ueq-s/LEIA-ME.md](../data/fixtures-ueq-s/LEIA-ME.md)), two of them taken from full UEQ scenarios. **Status on 17 Nov 2026:** all 9 match the spreadsheet. 8,520 values are compared, and the largest difference is 6.0 × 10⁻¹⁵. The 38 cells where the spreadsheet gives an error are `null` in the tool ([RF62](documentacao/requisitos.md#rf62)).
