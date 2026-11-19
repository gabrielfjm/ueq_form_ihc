# Calculation verification

This document checks, number by number, whether the UEQ Tool calculates what the [UEQ Protocol](../ueq-protocolo.md) says to calculate. The check uses the **sample study** ("Estudo de exemplo"), which the seed creates in every local installation, in the test account and with the link `/r/exemplo`, and redoes every calculation without using the tool's code.

**Result:** all 336 numerical comparisons match the tool. The largest difference was 3.3 × 10⁻¹⁶, which is the rounding error of the computer itself. The interpretation, the benchmark range, the inconsistent scales, the identical responses and the suspicion flag of each participant are also identical, and the exports contain the same numbers.

Afterwards, the tool was compared with the official UEQ spreadsheet itself in 11 scenarios, from a single participant to 1000 participants: all 6,543 values match, and the official spreadsheet that the tool exports recalculates in Excel with the same results ([Comparison with the official spreadsheet](#comparação-com-a-planilha-oficial)). The short version, the UEQ-S, was compared in the same way with its own official spreadsheet, in 9 scenarios: all 8,520 values match ([UEQ-S](#ueq-s)).

Version verified: UEQ Tool of 17 Nov 2026, with the calculation module in [`src/ueq/`](../../src/ueq/) and the parameters in [`data/protocolo.json`](../../data/protocolo.json) and [`data/benchmark.json`](../../data/benchmark.json).

## How the verification was done

1. **The data.** The sample study has two versions. "Checkout atual" (current checkout) receives the 20 responses in [`data/fixtures/basico/respostas.csv`](../../data/fixtures/basico/respostas.csv) and "Checkout em uma página" (one-page checkout) receives the 15 in [`data/fixtures/inconsistente/respostas.csv`](../../data/fixtures/inconsistente/respostas.csv) (see [`prisma/estudo-exemplo.ts`](../../prisma/estudo-exemplo.ts)). Each row has the 26 values from 1 to 7 in the official order.
2. **The independent calculation.** Each formula was written again from the UEQ Protocol (recoding, score per scale, mean, sample standard deviation, CI95, Pearson correlation, standardized alpha, ranges, benchmark, groups and suspicion rules), without reusing any function of the tool. The Perspicuity of the "Checkout atual" version was done entirely by hand and is shown step by step below; the other scales follow the same calculations.
3. **What the tool returns.** The same responses were passed to `analisarEstudo`, the function that feeds the dashboard, the PDF and the exports, and to the four export functions in [`src/lib/exportacoes.ts`](../../src/lib/exportacoes.ts).
4. **The comparison.** Each number of the independent calculation was compared with the tool's, in four subsets: each version, version 2 without the suspicious responses, and both versions together.

The sections up to Exports check that the tool follows the protocol. The [comparison with the official spreadsheet](#comparação-com-a-planilha-oficial), which is [RNF11](requisitos.md#rnf11), checks that the protocol and the tool give the same numbers as the UEQ Data Analysis Tool itself.

## Step by step: Perspicuity of Checkout atual

Perspicuity has 4 items. The polarity says which side the positive term is on: `+` on the right, `-` on the left.

| Item | Left term | Right term | Polarity |
|---|---|---|---|
| 2 | Incompreensível (not understandable) | Compreensível (understandable) | + |
| 4 | De fácil aprendizagem (easy to learn) | De difícil aprendizagem (difficult to learn) | - |
| 13 | Complicado (complicated) | Fácil (easy) | + |
| 21 | Evidente (clear) | Confuso (confusing) | - |

### 1. Recoding

The response from 1 to 7 becomes -3 to +3: for `+` items, value - 4; for `-` items, 4 - value ([Protocol §2](../ueq-protocolo.md#2-recodificação)). Participant 1 answered 5, 4, 4 and 3:

| Item | Response | Calculation | Recoded |
|---|---|---|---|
| 2 (+) | 5 | 5 - 4 | +1 |
| 4 (-) | 4 | 4 - 4 | 0 |
| 13 (+) | 4 | 4 - 4 | 0 |
| 21 (-) | 3 | 4 - 3 | +1 |

### 2. Participant's score on the scale

It is the mean of the scale's recoded items ([Protocol §3](../ueq-protocolo.md#3-escore-por-participante-e-escala)): (1 + 0 + 0 + 1) / 4 = **0.50**.

The 20 participants, in the order of the file:

| 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
|---|---|---|---|---|---|---|---|---|---|
| 0.50 | 1.50 | 0.25 | 0.50 | 0.25 | 1.25 | 2.00 | 1.00 | 2.00 | 0.50 |

| 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 |
|---|---|---|---|---|---|---|---|---|---|
| 0.75 | 0.00 | -0.25 | 0.25 | 2.25 | 1.00 | 1.00 | -0.75 | 0.50 | 2.50 |

### 3. Mean and standard deviation

- **Mean:** the sum of the 20 scores is 17.00, and 17.00 / 20 = **0.8500**.
- **Sample standard deviation** (divisor n - 1, like the spreadsheet's `STDEV`): the sum of the squared deviations from the mean is 14.05. So 14.05 / 19 = 0.7395 and √0.7395 = **0.8599**.

### 4. 95% confidence interval

Margin = z × sd / √n, with z = 1.959964 ([Protocol §4](../ueq-protocolo.md#4-estatísticas-por-escala-entre-participantes-incluídos-na-análise)): 1.959964 × 0.8599 / √20 = 1.6854 / 4.4721 = 0.3769.

CI95 = 0.8500 ± 0.3769 = **[0.4731, 1.2269]**.

### 5. Cronbach's alpha

The standardized alpha uses the mean of the correlations between the scale's recoded items ([Protocol §6](../ueq-protocolo.md#6-alfa-de-cronbach-por-escala)). With 4 items, there are 6 pairs:

| Pair | 2 and 4 | 2 and 13 | 2 and 21 | 4 and 13 | 4 and 21 | 13 and 21 |
|---|---|---|---|---|---|---|
| Pearson's r | 0.6473 | 0.5326 | 0.3361 | 0.5261 | 0.6668 | 0.4304 |

- r̄ = (0.6473 + 0.5326 + 0.3361 + 0.5261 + 0.6668 + 0.4304) / 6 = 3.1393 / 6 = 0.5232.
- α = k × r̄ / (1 + (k - 1) × r̄) = 4 × 0.5232 / (1 + 3 × 0.5232) = 2.0929 / 2.5697 = **0.8144**.

Since 0.8144 is greater than 0.7, the dashboard shows no consistency warning for this scale.

### 6. Interpretation and benchmark

- **Interpretation:** 0.85 is greater than 0.8, so the mean is **positive** ([Protocol §5](../ueq-protocolo.md#5-faixas-de-interpretação)).
- **Benchmark:** the Perspicuity limits are 2.00 (excellent), 1.73 (good), 1.20 (above the mean) and 0.72 (below the mean). Since 0.72 < 0.85 ≤ 1.20, the range is **below the mean** ([Protocol §8](../ueq-protocolo.md#8-benchmark)).

### 7. Pragmatic and Hedonic Quality

They are simple means of the scale means ([RF39](requisitos.md#rf39)):

- **Pragmatic** = (Perspicuity + Efficiency + Dependability) / 3 = (0.8500 + 1.0250 + 0.9125) / 3 = **0.9292**.
- **Hedonic** = (Stimulation + Novelty) / 2 = (0.6375 + 1.0125) / 2 = **0.8250**.

The tool returns the same seven numbers: 0.50 for participant 1, mean 0.8500, sd 0.8599, CI95 from 0.4731 to 1.2269, alpha 0.8144, positive, below the mean, and pragmatic and hedonic of 0.9292 and 0.8250.

## Verified results

The numbers have 4 decimal places, as in the results-by-scale export. The dashboard shows 2.

### Checkout atual

20 participants, none suspicious. Pragmatic 0.9292; hedonic 0.8250.

| Scale | Mean | SD | CI95 | Alpha | Interpretation | Benchmark |
|---|---|---|---|---|---|---|
| Attractiveness | 0.7333 | 0.9167 | 0.3316 to 1.1351 | 0.9173 | neutral | below the mean |
| Perspicuity | 0.8500 | 0.8599 | 0.4731 to 1.2269 | 0.8144 | positive | below the mean |
| Efficiency | 1.0250 | 0.7818 | 0.6824 to 1.3676 | 0.7452 | positive | below the mean |
| Dependability | 0.9125 | 0.9572 | 0.4930 to 1.3320 | 0.8188 | positive | below the mean |
| Stimulation | 0.6375 | 0.7321 | 0.3166 to 0.9584 | 0.7401 | neutral | below the mean |
| Novelty | 1.0125 | 0.7139 | 0.6996 to 1.3254 | 0.7494 | positive | above the mean |

### Checkout em uma página

15 participants, 4 of them suspicious and still in the analysis, as the seed stores them. Pragmatic 0.7944; hedonic 0.8500.

| Scale | Mean | SD | CI95 | Alpha | Interpretation | Benchmark |
|---|---|---|---|---|---|---|
| Attractiveness | 0.6000 | 0.9916 | 0.0982 to 1.1018 | 0.7366 | neutral | bad |
| Perspicuity | 0.8167 | 0.8263 | 0.3985 to 1.2348 | 0.5943 | positive | below the mean |
| Efficiency | 0.8000 | 0.7270 | 0.4321 to 1.1679 | 0.3343 | neutral | below the mean |
| Dependability | 0.7667 | 0.9135 | 0.3044 to 1.2290 | 0.5095 | neutral | bad |
| Stimulation | 0.8667 | 0.6605 | 0.5324 to 1.2009 | 0.0932 | positive | below the mean |
| Novelty | 0.8333 | 0.7657 | 0.4458 to 1.2208 | 0.4067 | positive | above the mean |

Efficiency has a mean of exactly 0.8000 and is **neutral**: the limit of the neutral range belongs to it (from -0.8 to +0.8). Five scales have alpha below 0.7, and the dashboard warns on each of them ([RF45](requisitos.md#rf45)). This is the effect of the suspicious responses, as the next table shows.

### Checkout em uma página, without the suspicious responses

After "Remove suspicious responses from analysis" in the Responses tab, 11 participants remain. Pragmatic 0.8636; hedonic 0.9545.

| Scale | Mean | SD | CI95 | Alpha | Interpretation | Benchmark |
|---|---|---|---|---|---|---|
| Attractiveness | 0.6364 | 1.1348 | -0.0343 to 1.3070 | 0.9265 | neutral | bad |
| Perspicuity | 0.7500 | 0.9354 | 0.1972 to 1.3028 | 0.8775 | neutral | below the mean |
| Efficiency | 0.8636 | 0.5519 | 0.5375 to 1.1898 | 0.2564 | positive | below the mean |
| Dependability | 0.9773 | 0.9517 | 0.4149 to 1.5397 | 0.8541 | positive | below the mean |
| Stimulation | 0.9545 | 0.6876 | 0.5482 to 1.3609 | 0.7060 | positive | below the mean |
| Novelty | 0.9545 | 0.8353 | 0.4609 to 1.4482 | 0.7011 | positive | above the mean |

The alpha rises above 0.7 in four of the five scales that were low. Efficiency still has a low alpha: its problem does not come from the suspicious responses.

### Both versions together

35 participants. Pragmatic 0.8714; hedonic 0.8357.

| Scale | Mean | SD | CI95 | Alpha | Interpretation | Benchmark |
|---|---|---|---|---|---|---|
| Attractiveness | 0.6762 | 0.9375 | 0.3656 to 0.9868 | 0.8331 | neutral | bad |
| Perspicuity | 0.8357 | 0.8335 | 0.5596 to 1.1118 | 0.7230 | positive | below the mean |
| Efficiency | 0.9286 | 0.7563 | 0.6780 to 1.1791 | 0.5698 | positive | below the mean |
| Dependability | 0.8500 | 0.9279 | 0.5426 to 1.1574 | 0.6880 | positive | below the mean |
| Stimulation | 0.7357 | 0.7017 | 0.5032 to 0.9682 | 0.4962 | neutral | below the mean |
| Novelty | 0.9357 | 0.7310 | 0.6935 to 1.1779 | 0.5705 | positive | above the mean |

### Means per item

The 26 means and the 26 standard deviations of each item, in the four subsets, were also checked: 208 numbers, all equal to the tool's.

## Suspicious responses

A participation is suspicious when it has 3 or more scales with a range greater than 3, or more than 15 identical responses ([Protocol §7](../ueq-protocolo.md#7-respostas-inconsistentes)). The range is the difference between the highest and the lowest recoded value of the scale's items.

In Checkout atual, no participant goes beyond 3 in any rule: the highest number of identical responses is 14. In Checkout em uma página:

| Row | Attractiveness | Perspicuity | Efficiency | Dependability | Stimulation | Novelty | Scales above 3 | Identical responses | Suspicious |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 6 | 4 | 4 | 6 | 4 | 5 | 6 | 5 | yes |
| 2 | 1 | 1 | 1 | 2 | 2 | 5 | 1 | 8 | no |
| 3 | 1 | 1 | 2 | 2 | 1 | 1 | 0 | 7 | no |
| 4 | 2 | 0 | 3 | 1 | 2 | 2 | 0 | 7 | no |
| 5 | 4 | 0 | 6 | 2 | 0 | 2 | 2 | 8 | no |
| 6 | 4 | 4 | 6 | 5 | 6 | 6 | 6 | 7 | yes |
| 7 | 2 | 2 | 2 | 0 | 2 | 2 | 0 | 12 | no |
| 8 | 1 | 0 | 1 | 1 | 2 | 0 | 0 | 9 | no |
| 9 | 4 | 4 | 1 | 6 | 4 | 0 | 4 | 7 | yes |
| 10 | 2 | 1 | 2 | 1 | 1 | 2 | 0 | 12 | no |
| 11 | 3 | 2 | 2 | 2 | 1 | 2 | 0 | 11 | no |
| 12 | 1 | 2 | 2 | 1 | 1 | 2 | 0 | 7 | no |
| 13 | 4 | 1 | 1 | 2 | 6 | 4 | 3 | 6 | yes |
| 14 | 1 | 2 | 1 | 3 | 2 | 1 | 0 | 11 | no |
| 15 | 2 | 1 | 1 | 1 | 1 | 1 | 0 | 8 | no |

- Rows 1, 6, 9 and 13 are suspicious, the same ones the Responses tab flags and that the [fixture's LEIA-ME](../../data/fixtures/inconsistente/LEIA-ME.md) predicts.
- Rows 2 and 5 stay below the threshold: one and two inconsistent scales.
- A range of exactly 3 does not count (rows 4, 11 and 14): the rule is greater than 3.

## Exports

The exports were generated by the tool with the 35 participations and checked against the independent calculation:

| Export | What was checked | Result |
|---|---|---|
| Raw responses | BOM, 39 columns (13 of participation data and 26 items) and the values from 1 to 7 of each participant | Equal to the 35 rows of the fixtures |
| Coded responses | The 26 values from -3 to +3 of each participant | Equal to the recoding done by hand |
| Results by scale | 18 rows (6 scales × the two versions and the whole study), with n, mean, sd, CI95, alpha and interpretation to 4 places with a decimal comma | Equal to the tables above |
| Official UEQ spreadsheet (XLSX) | The 35 rows of 26 values in Data!A4 of the UEQ Data Analysis Tool V15, without the sample data, and the rest of the file equal to the official one | Equal to the fixtures, in order; recalculated in Excel, see the next section |

## Comparison with the official spreadsheet

Done on 17 Nov 2026 with the *UEQ Data Analysis Tool V15* from `Data_Analysis_Tools.zip` (ueq-online.org), in Microsoft Excel 16. For each scenario in [data/fixtures/](../../data/fixtures/LEIA-ME.md), the `scripts/planilha-oficial.ps1` script pasted the `respostas.csv` into `Data!A4` of a copy of the spreadsheet, triggered a recalculation and read the result cells with all decimal places. Beforehand, the same script ran on the sample data that comes with the spreadsheet and exactly reproduced the results stored in the official file.

The comparison covered mean, sd, n and CI95 of the 6 scales and the 26 items, Cronbach's alpha, benchmark range, Pragmatic and Hedonic Quality, the distribution of the responses of each item and, for each participant, how many scales are inconsistent and how many identical responses they gave.

| Scenario | Participants | Suspicious | Values compared | Spreadsheet errors (null in the tool) | Largest difference |
|---|---|---|---|---|---|
| basico | 20 | 0 | 391 | 0 | 3.3 × 10⁻¹⁶ |
| inconsistente | 15 | 4 | 381 | 0 | 4.4 × 10⁻¹⁶ |
| extremos/n1 | 1 | 0 | 353 | 102 | 0 |
| extremos/n2 | 2 | 0 | 355 | 0 | 8.9 × 10⁻¹⁶ |
| extremos/todos-1 | 3 | 3 | 357 | 70 | 0 |
| extremos/todos-7 | 3 | 3 | 357 | 70 | 0 |
| oficial-exemplo | 255 | 18 | 861 | 0 | 2.9 × 10⁻¹⁵ |
| grande | 1000 | 63 | 2,351 | 0 | 9.3 × 10⁻¹⁵ |
| bordas | 12 | 3 | 375 | 0 | 5.6 × 10⁻¹⁶ |
| variancia-zero | 12 | 0 | 375 | 3 | 4.4 × 10⁻¹⁶ |
| negativo | 18 | 1 | 387 | 0 | 2.2 × 10⁻¹⁶ |
| **Total** | | | **6,543** | **245** | **9.3 × 10⁻¹⁵** |

The texts (benchmark range) and the counts (n, distribution, inconsistent scales, identical responses) are identical. The decimal numbers differ at most in the 15th decimal place, because of the order of the floating-point sums; the test accepts up to 1e-6. The cases that need attention also match:

- **A single person or everyone identical.** The spreadsheet gives `#DIV/0!` in the standard deviation, the CI and the alpha; the tool returns `null` and the dashboard shows "—".
- **An item without variation** (`variancia-zero`). The spreadsheet does not calculate that item's correlation, and the Perspicuity alpha and the item's CI become errors. The tool does the same and calculates the alpha of the other five scales normally.
- **Items that contradict each other** (`negativo`). The mean correlation of Novelty is close to -1/3, and the standardized alpha formula, k × r̄ / (1 + (k - 1) × r̄), gives -42.78 in both.
- **The limits of the suspicion rules** (`bordas`). A range of exactly 3 does not count and 4 does; 15 identical responses do not flag and 16 do. The tool and the spreadsheet give the same result for each participant.

### The spreadsheet the tool exports

The "Official UEQ spreadsheet (XLSX)" export was checked in three ways:

1. **File by file.** A unit test opens the generated `.xlsx` and checks that the Data sheet has the responses starting at row 4, that the 255 sample participants were removed, that the language is in `Read_First!B5` and that charts, styles, images and the other parts of the file are byte-for-byte equal to those of the official file.
2. **In Excel.** The spreadsheet of the 11 scenarios, generated by the tool, was opened in Excel without pasting anything and without triggering a recalculation. Excel recalculated on its own when opening, and the 6,543 values were identical to those of the manual pasting, with the labels in Portuguese ("Atractividade" (Attractiveness), "Desagradável" (Annoying)).
3. **Through the screen.** An end-to-end test imports 7 scenarios (`oficial-exemplo`, `grande`, `inconsistente`, `bordas`, `variancia-zero`, `negativo` and `extremos/n2`) through the Import responses screen, checks n, mean, SD, CI95, alpha and benchmark of each scale in the dashboard table against the numbers of the official spreadsheet, and downloads the version's spreadsheet. Five of these files, downloaded from the running tool, were opened in Excel: zero differences.

### UEQ-S

The short version was compared in the same way with the *UEQ-S Data Analysis Tool V15* (`Short_UEQ_Data_Analysis_Tool_V15.xlsx`, from the same `Data_Analysis_Tools.zip`), by the `scripts/planilha-oficial-ueq-s.ps1` script, in 9 scenarios from [data/fixtures-ueq-s/](../../data/fixtures-ueq-s/LEIA-ME.md). Beforehand, the script ran on the spreadsheet's 13 sample participants and reproduced the results stored in the official file.

The comparison covered mean, sd, n and CI95 of the Pragmatic, Hedonic and overall quality and of the 8 items, the alpha of the two scales, the benchmark range and, for each participant, the three scores (DT sheet), how many scales are inconsistent, how many identical responses they gave and whether they marked the middle on all 8 items.

| Scenario | Participants | Suspicious | Values compared | Spreadsheet errors (null in the tool) | Largest difference |
|---|---|---|---|---|---|
| oficial-exemplo | 13 | 2 | 136 | 0 | 4.4 × 10⁻¹⁶ |
| do-ueq-basico | 20 | 0 | 178 | 0 | 2.2 × 10⁻¹⁶ |
| do-ueq-oficial-exemplo | 255 | 5 | 1,588 | 0 | 8.9 × 10⁻¹⁶ |
| grande | 1000 | 30 | 6,058 | 0 | 6.0 × 10⁻¹⁵ |
| bordas | 12 | 3 | 130 | 0 | 4.4 × 10⁻¹⁶ |
| variancia-zero | 12 | 0 | 130 | 3 | 2.2 × 10⁻¹⁶ |
| negativo | 18 | 0 | 166 | 0 | 4.4 × 10⁻¹⁶ |
| n1 | 1 | 0 | 64 | 35 | 0 |
| n2 | 2 | 0 | 70 | 0 | 4.4 × 10⁻¹⁶ |
| **Total** | | | **8,520** | **38** | **6.0 × 10⁻¹⁵** |

The `do-ueq-basico` and `do-ueq-oficial-exemplo` scenarios come from full UEQ scenarios: the 8 UEQ-S pairs of each participant, with the sides of items 4 and 7 swapped. They prove the UEQ-S tab of a full UEQ study, which does the same conversion. The edge cases also match:

- **The UEQ-S suspicion rules** (`bordas`). A range of 4 in only one scale does not flag; in both, it does. Eight times 4 flags ("Remove" in the spreadsheet); eight times 7 does not, because the spreadsheet only recommends removing those who marked the middle.
- **Items that contradict each other** (`negativo`). The Hedonic Quality alpha gives -1.40 in both.
- **An item without variation** (`variancia-zero`). No CI for the item and no alpha for the pragmatic quality, in both.

The "Official UEQ-S spreadsheet (XLSX)" that the tool exports was checked like the full UEQ one: a unit test opens the file and checks the Data sheet and the language in `Read_First!B4`; the 9 files generated by the tool were opened in Excel without pasting anything or triggering a recalculation, and the values were identical to those in `esperado.json`, with the labels in Portuguese ("Qualidade Pragmática" (Pragmatic Quality), "Obstrutivo" (Obstructive)); and an end-to-end test imports 5 scenarios into a UEQ-S study, checks the table in the UEQ-S tab and downloads the spreadsheet.

## How to redo it

Anyone can redo this check without programming:

1. In a local installation, run `pnpm db:seed` and sign in with the test account (`pesquisador@exemplo.com`, password `senha-de-teste`): the sample study is already in the list.
2. In Results › Export, download the coded responses and the results by scale.
3. In a spreadsheet, calculate the mean of each scale's items per participant, and then the mean, the `DESVPAD` and the margin `1,959964 × DESVPAD / RAIZ(n)` of each scale (in an English-language Excel, `STDEV`, `SQRT` and a decimal point). For the alpha, calculate the `CORREL` of each pair of items of the scale, take the mean and apply k × r̄ / (1 + (k - 1) × r̄).
4. Compare with the results-by-scale file and with the dashboard.
5. To compare with the official spreadsheet, download "Official UEQ spreadsheet (XLSX)", open it in Excel and click Enable Editing. The Results, Confidence_Intervals, Scale_Consistency, Benchmark and Inconsistencies sheets show the numbers of the spreadsheet itself, calculated with the study's responses.
