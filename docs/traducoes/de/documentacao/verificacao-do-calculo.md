# Überprüfung der Berechnung

Dieses Dokument prüft Zahl für Zahl, ob das UEQ-Tool berechnet, was das [UEQ-Protokoll](../ueq-protocolo.md) vorschreibt. Die Prüfung verwendet das **Estudo de exemplo** (Beispielstudie), das der Seed in jeder lokalen Installation im Testkonto und mit dem Link `/r/exemplo` anlegt, und rechnet jede Rechnung ohne den Code des Tools nach.

**Ergebnis:** Alle 336 numerischen Vergleiche stimmen mit dem Tool überein. Die größte Abweichung betrug 3,3 × 10⁻¹⁶, das ist der Rundungsfehler des Computers selbst. Die Interpretation, der Benchmark-Bereich, die inkonsistenten Skalen, die gleichen Antworten und die Verdachtsmarkierung jeder teilnehmenden Person sind ebenfalls identisch, und die Exporte liefern dieselben Zahlen.

Danach wurde das Tool in 11 Szenarien, von einer einzigen bis zu 1000 teilnehmenden Personen, mit der offiziellen UEQ-Tabelle selbst verglichen: Die 6.543 Werte stimmen überein, und die offizielle Tabelle, die das Tool exportiert, wird in Excel mit denselben Ergebnissen neu berechnet ([Vergleich mit der offiziellen Tabelle](#comparação-com-a-planilha-oficial)). Die Kurzfassung, der UEQ-S, wurde auf dieselbe Weise in 9 Szenarien mit ihrer offiziellen Tabelle verglichen: Die 8.520 Werte stimmen überein ([UEQ-S](#ueq-s)).

Geprüfte Version: UEQ-Tool vom 17.11.2026, mit dem Berechnungsmodul aus [`src/ueq/`](../../src/ueq/) und den Parametern aus [`data/protocolo.json`](../../data/protocolo.json) und [`data/benchmark.json`](../../data/benchmark.json).

## Wie die Prüfung durchgeführt wurde

1. **Die Daten.** Die Beispielstudie hat zwei Versionen. „Checkout atual“ (aktueller Checkout) erhält die 20 Antworten aus [`data/fixtures/basico/respostas.csv`](../../data/fixtures/basico/respostas.csv) und „Checkout em uma página“ (Checkout auf einer Seite) die 15 aus [`data/fixtures/inconsistente/respostas.csv`](../../data/fixtures/inconsistente/respostas.csv) (siehe [`prisma/estudo-exemplo.ts`](../../prisma/estudo-exemplo.ts)). Jede Zeile enthält die 26 Werte von 1 bis 7 in der offiziellen Reihenfolge.
2. **Die unabhängige Rechnung.** Jede Formel wurde anhand des UEQ-Protokolls neu geschrieben (Umkodierung, Skalenwert, Mittelwert, Stichproben-Standardabweichung, KI95, Pearson-Korrelation, standardisiertes Alpha, Bereiche, Benchmark, Gruppen und Verdachtsregeln), ohne eine Funktion des Tools wiederzuverwenden. Die Durchschaubarkeit der Version „Checkout atual“ wurde vollständig von Hand gerechnet und steht unten Schritt für Schritt; die anderen Skalen folgen denselben Rechnungen.
3. **Was das Tool zurückgibt.** Dieselben Antworten wurden an `analisarEstudo` übergeben, die Funktion, die das Dashboard, das PDF und die Exporte speist, sowie an die vier Exportfunktionen aus [`src/lib/exportacoes.ts`](../../src/lib/exportacoes.ts).
4. **Der Vergleich.** Jede Zahl der unabhängigen Rechnung wurde in vier Ausschnitten mit der des Tools verglichen: jede Version, Version 2 ohne die verdächtigen Antworten und beide Versionen zusammen.

Die Abschnitte bis Exporte prüfen, dass das Tool dem Protokoll folgt. Der [Vergleich mit der offiziellen Tabelle](#comparação-com-a-planilha-oficial), also die [RNF11](requisitos.md#rnf11), prüft, dass Protokoll und Tool dieselben Zahlen liefern wie die UEQ Data Analysis Tool selbst.

## Schritt für Schritt: Durchschaubarkeit des Checkout atual

Die Durchschaubarkeit hat 4 Items. Die Polarität gibt an, auf welcher Seite der positive Begriff steht: `+` rechts, `-` links.

| Item | Linker Begriff | Rechter Begriff | Polarität |
|---|---|---|---|
| 2 | Incompreensível (unverständlich) | Compreensível (verständlich) | + |
| 4 | De fácil aprendizagem (leicht zu lernen) | De difícil aprendizagem (schwer zu lernen) | - |
| 13 | Complicado (kompliziert) | Fácil (einfach) | + |
| 21 | Evidente (übersichtlich) | Confuso (verwirrend) | - |

### 1. Umkodierung

Die Antwort von 1 bis 7 wird zu -3 bis +3: bei `+`-Items Wert - 4; bei `-`-Items 4 - Wert ([Protokoll §2](../ueq-protocolo.md#2-recodificação)). Teilnehmende Person 1 hat 5, 4, 4 und 3 geantwortet:

| Item | Antwort | Rechnung | Umkodiert |
|---|---|---|---|
| 2 (+) | 5 | 5 - 4 | +1 |
| 4 (-) | 4 | 4 - 4 | 0 |
| 13 (+) | 4 | 4 - 4 | 0 |
| 21 (-) | 3 | 4 - 3 | +1 |

### 2. Wert der teilnehmenden Person auf der Skala

Er ist der Mittelwert der umkodierten Items der Skala ([Protokoll §3](../ueq-protocolo.md#3-escore-por-participante-e-escala)): (1 + 0 + 0 + 1) / 4 = **0,50**.

Die 20 teilnehmenden Personen in der Reihenfolge der Datei:

| 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
|---|---|---|---|---|---|---|---|---|---|
| 0,50 | 1,50 | 0,25 | 0,50 | 0,25 | 1,25 | 2,00 | 1,00 | 2,00 | 0,50 |

| 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 |
|---|---|---|---|---|---|---|---|---|---|
| 0,75 | 0,00 | -0,25 | 0,25 | 2,25 | 1,00 | 1,00 | -0,75 | 0,50 | 2,50 |

### 3. Mittelwert und Standardabweichung

- **Mittelwert:** Die Summe der 20 Werte ist 17,00, und 17,00 / 20 = **0,8500**.
- **Stichproben-Standardabweichung** (Divisor n - 1, wie das `STDEV` der Tabelle): Die Summe der quadrierten Abweichungen vom Mittelwert ist 14,05. Also 14,05 / 19 = 0,7395 und √0,7395 = **0,8599**.

### 4. 95-%-Konfidenzintervall

Marge = z × SD / √n, mit z = 1,959964 ([Protokoll §4](../ueq-protocolo.md#4-estatísticas-por-escala-entre-participantes-incluídos-na-análise)): 1,959964 × 0,8599 / √20 = 1,6854 / 4,4721 = 0,3769.

KI95 = 0,8500 ± 0,3769 = **[0,4731; 1,2269]**.

### 5. Cronbachs Alpha

Das standardisierte Alpha verwendet den Mittelwert der Korrelationen zwischen den umkodierten Items der Skala ([Protokoll §6](../ueq-protocolo.md#6-alfa-de-cronbach-por-escala)). Bei 4 Items sind es 6 Paare:

| Paar | 2 und 4 | 2 und 13 | 2 und 21 | 4 und 13 | 4 und 21 | 13 und 21 |
|---|---|---|---|---|---|---|
| Pearson-r | 0,6473 | 0,5326 | 0,3361 | 0,5261 | 0,6668 | 0,4304 |

- r̄ = (0,6473 + 0,5326 + 0,3361 + 0,5261 + 0,6668 + 0,4304) / 6 = 3,1393 / 6 = 0,5232.
- α = k × r̄ / (1 + (k - 1) × r̄) = 4 × 0,5232 / (1 + 3 × 0,5232) = 2,0929 / 2,5697 = **0,8144**.

Da 0,8144 größer als 0,7 ist, zeigt das Dashboard für diese Skala keinen Konsistenzhinweis.

### 6. Interpretation und Benchmark

- **Interpretation:** 0,85 ist größer als 0,8, also ist der Mittelwert **positiv** ([Protokoll §5](../ueq-protocolo.md#5-faixas-de-interpretação)).
- **Benchmark:** Die Grenzen der Durchschaubarkeit sind 2,00 (ausgezeichnet), 1,73 (gut), 1,20 (über dem Mittelwert) und 0,72 (unter dem Mittelwert). Da 0,72 < 0,85 ≤ 1,20, ist der Bereich **unter dem Mittelwert** ([Protokoll §8](../ueq-protocolo.md#8-benchmark)).

### 7. Pragmatische und hedonische Qualität

Sie sind einfache Mittelwerte der Skalenmittelwerte ([RF39](requisitos.md#rf39)):

- **Pragmatisch** = (Durchschaubarkeit + Effizienz + Vertrauenswürdigkeit) / 3 = (0,8500 + 1,0250 + 0,9125) / 3 = **0,9292**.
- **Hedonisch** = (Stimulation + Originalität) / 2 = (0,6375 + 1,0125) / 2 = **0,8250**.

Das Tool liefert dieselben sieben Zahlen: 0,50 für teilnehmende Person 1, Mittelwert 0,8500, SD 0,8599, KI95 von 0,4731 bis 1,2269, Alpha 0,8144, positiv, unter dem Mittelwert, und pragmatisch und hedonisch 0,9292 und 0,8250.

## Geprüfte Ergebnisse

Die Zahlen haben 4 Nachkommastellen, wie im Export der Ergebnisse pro Skala. Das Dashboard zeigt 2.

### Checkout atual

20 teilnehmende Personen, keine verdächtig. Pragmatisch 0,9292; hedonisch 0,8250.

| Skala | Mittelwert | SD | KI95 | Alpha | Interpretation | Benchmark |
|---|---|---|---|---|---|---|
| Attraktivität | 0,7333 | 0,9167 | 0,3316 bis 1,1351 | 0,9173 | neutral | unter dem Mittelwert |
| Durchschaubarkeit | 0,8500 | 0,8599 | 0,4731 bis 1,2269 | 0,8144 | positiv | unter dem Mittelwert |
| Effizienz | 1,0250 | 0,7818 | 0,6824 bis 1,3676 | 0,7452 | positiv | unter dem Mittelwert |
| Vertrauenswürdigkeit | 0,9125 | 0,9572 | 0,4930 bis 1,3320 | 0,8188 | positiv | unter dem Mittelwert |
| Stimulation | 0,6375 | 0,7321 | 0,3166 bis 0,9584 | 0,7401 | neutral | unter dem Mittelwert |
| Originalität | 1,0125 | 0,7139 | 0,6996 bis 1,3254 | 0,7494 | positiv | über dem Mittelwert |

### Checkout em uma página

15 teilnehmende Personen, 4 davon verdächtig und noch in der Auswertung, so wie der Seed sie speichert. Pragmatisch 0,7944; hedonisch 0,8500.

| Skala | Mittelwert | SD | KI95 | Alpha | Interpretation | Benchmark |
|---|---|---|---|---|---|---|
| Attraktivität | 0,6000 | 0,9916 | 0,0982 bis 1,1018 | 0,7366 | neutral | schlecht |
| Durchschaubarkeit | 0,8167 | 0,8263 | 0,3985 bis 1,2348 | 0,5943 | positiv | unter dem Mittelwert |
| Effizienz | 0,8000 | 0,7270 | 0,4321 bis 1,1679 | 0,3343 | neutral | unter dem Mittelwert |
| Vertrauenswürdigkeit | 0,7667 | 0,9135 | 0,3044 bis 1,2290 | 0,5095 | neutral | schlecht |
| Stimulation | 0,8667 | 0,6605 | 0,5324 bis 1,2009 | 0,0932 | positiv | unter dem Mittelwert |
| Originalität | 0,8333 | 0,7657 | 0,4458 bis 1,2208 | 0,4067 | positiv | über dem Mittelwert |

Die Effizienz hat einen Mittelwert von genau 0,8000 und bleibt **neutral**: Die Grenze des neutralen Bereichs gehört zu ihm (von -0,8 bis +0,8). Fünf Skalen haben ein Alpha unter 0,7, und das Dashboard weist bei jeder darauf hin ([RF45](requisitos.md#rf45)). Das ist die Wirkung der verdächtigen Antworten, wie die nächste Tabelle zeigt.

### Checkout em uma página, ohne die Verdächtigen

Nach „Verdächtige aus der Auswertung nehmen“ im Reiter Antworten bleiben 11 teilnehmende Personen. Pragmatisch 0,8636; hedonisch 0,9545.

| Skala | Mittelwert | SD | KI95 | Alpha | Interpretation | Benchmark |
|---|---|---|---|---|---|---|
| Attraktivität | 0,6364 | 1,1348 | -0,0343 bis 1,3070 | 0,9265 | neutral | schlecht |
| Durchschaubarkeit | 0,7500 | 0,9354 | 0,1972 bis 1,3028 | 0,8775 | neutral | unter dem Mittelwert |
| Effizienz | 0,8636 | 0,5519 | 0,5375 bis 1,1898 | 0,2564 | positiv | unter dem Mittelwert |
| Vertrauenswürdigkeit | 0,9773 | 0,9517 | 0,4149 bis 1,5397 | 0,8541 | positiv | unter dem Mittelwert |
| Stimulation | 0,9545 | 0,6876 | 0,5482 bis 1,3609 | 0,7060 | positiv | unter dem Mittelwert |
| Originalität | 0,9545 | 0,8353 | 0,4609 bis 1,4482 | 0,7011 | positiv | über dem Mittelwert |

Das Alpha steigt bei vier der fünf Skalen, die niedrig waren, über 0,7. Die Effizienz behält ein niedriges Alpha: Ihr Problem kommt nicht von den Verdächtigen.

### Beide Versionen zusammen

35 teilnehmende Personen. Pragmatisch 0,8714; hedonisch 0,8357.

| Skala | Mittelwert | SD | KI95 | Alpha | Interpretation | Benchmark |
|---|---|---|---|---|---|---|
| Attraktivität | 0,6762 | 0,9375 | 0,3656 bis 0,9868 | 0,8331 | neutral | schlecht |
| Durchschaubarkeit | 0,8357 | 0,8335 | 0,5596 bis 1,1118 | 0,7230 | positiv | unter dem Mittelwert |
| Effizienz | 0,9286 | 0,7563 | 0,6780 bis 1,1791 | 0,5698 | positiv | unter dem Mittelwert |
| Vertrauenswürdigkeit | 0,8500 | 0,9279 | 0,5426 bis 1,1574 | 0,6880 | positiv | unter dem Mittelwert |
| Stimulation | 0,7357 | 0,7017 | 0,5032 bis 0,9682 | 0,4962 | neutral | unter dem Mittelwert |
| Originalität | 0,9357 | 0,7310 | 0,6935 bis 1,1779 | 0,5705 | positiv | über dem Mittelwert |

### Mittelwerte pro Item

Die 26 Mittelwerte und die 26 Standardabweichungen jedes Items wurden in den vier Ausschnitten ebenfalls geprüft: 208 Zahlen, alle gleich denen des Tools.

## Verdächtige Antworten

Eine Teilnahme ist verdächtig, wenn sie 3 oder mehr Skalen mit einer Spannweite größer als 3 hat oder mehr als 15 gleiche Antworten ([Protokoll §7](../ueq-protocolo.md#7-respostas-inconsistentes)). Die Spannweite ist die Differenz zwischen dem größten und dem kleinsten umkodierten Wert der Items der Skala.

Im Checkout atual überschreitet keine teilnehmende Person bei irgendeiner Regel die Grenze: Die größte Anzahl gleicher Antworten ist 14. Im Checkout em uma página:

| Zeile | Attraktivität | Durchschaubarkeit | Effizienz | Vertrauenswürdigkeit | Stimulation | Originalität | Skalen über 3 | Gleiche Antworten | Verdächtig |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 6 | 4 | 4 | 6 | 4 | 5 | 6 | 5 | ja |
| 2 | 1 | 1 | 1 | 2 | 2 | 5 | 1 | 8 | nein |
| 3 | 1 | 1 | 2 | 2 | 1 | 1 | 0 | 7 | nein |
| 4 | 2 | 0 | 3 | 1 | 2 | 2 | 0 | 7 | nein |
| 5 | 4 | 0 | 6 | 2 | 0 | 2 | 2 | 8 | nein |
| 6 | 4 | 4 | 6 | 5 | 6 | 6 | 6 | 7 | ja |
| 7 | 2 | 2 | 2 | 0 | 2 | 2 | 0 | 12 | nein |
| 8 | 1 | 0 | 1 | 1 | 2 | 0 | 0 | 9 | nein |
| 9 | 4 | 4 | 1 | 6 | 4 | 0 | 4 | 7 | ja |
| 10 | 2 | 1 | 2 | 1 | 1 | 2 | 0 | 12 | nein |
| 11 | 3 | 2 | 2 | 2 | 1 | 2 | 0 | 11 | nein |
| 12 | 1 | 2 | 2 | 1 | 1 | 2 | 0 | 7 | nein |
| 13 | 4 | 1 | 1 | 2 | 6 | 4 | 3 | 6 | ja |
| 14 | 1 | 2 | 1 | 3 | 2 | 1 | 0 | 11 | nein |
| 15 | 2 | 1 | 1 | 1 | 1 | 1 | 0 | 8 | nein |

- Die Zeilen 1, 6, 9 und 13 sind verdächtig, dieselben, die der Reiter Antworten markiert und die das [LEIA-ME der Fixture](../../data/fixtures/inconsistente/LEIA-ME.md) vorhersagt.
- Die Zeilen 2 und 5 bleiben unter der Grenze: eine und zwei inkonsistente Skalen.
- Eine Spannweite von genau 3 zählt nicht (Zeilen 4, 11 und 14): Die Regel lautet größer als 3.

## Exporte

Die Exporte wurden vom Tool mit den 35 Teilnahmen erzeugt und mit der unabhängigen Rechnung verglichen:

| Export | Was geprüft wurde | Ergebnis |
|---|---|---|
| Rohantworten | BOM, 39 Spalten (13 mit Daten der Teilnahme und 26 Items) und die Werte von 1 bis 7 jeder teilnehmenden Person | Gleich den 35 Zeilen der Fixtures |
| Umkodierte Antworten | Die 26 Werte von -3 bis +3 jeder teilnehmenden Person | Gleich der von Hand gemachten Umkodierung |
| Ergebnisse pro Skala | 18 Zeilen (6 Skalen × beide Versionen und die ganze Studie), mit n, Mittelwert, SD, KI95, Alpha und Interpretation mit 4 Nachkommastellen und Dezimalkomma | Gleich den Tabellen oben |
| Offizielle UEQ-Tabelle (XLSX) | Die 35 Zeilen mit 26 Werten in Data!A4 der UEQ Data Analysis Tool V15, ohne die Beispieldaten, und der Rest der Datei gleich der offiziellen | Gleich den Fixtures, in der Reihenfolge; in Excel neu berechnet, siehe nächster Abschnitt |

## Vergleich mit der offiziellen Tabelle

Durchgeführt am 17.11.2026 mit der *UEQ Data Analysis Tool V15* aus `Data_Analysis_Tools.zip` (ueq-online.org) in Microsoft Excel 16. Für jedes Szenario aus [data/fixtures/](../../data/fixtures/LEIA-ME.md) hat das Skript `scripts/planilha-oficial.ps1` die `respostas.csv` in `Data!A4` einer Kopie der Tabelle eingefügt, die Neuberechnung ausgelöst und die Ergebniszellen mit allen Nachkommastellen gelesen. Vorher lief dasselbe Skript mit den Beispieldaten, die der Tabelle beiliegen, und reproduzierte exakt die in der offiziellen Datei gespeicherten Ergebnisse.

Verglichen wurden Mittelwert, SD, n und KI95 der 6 Skalen und der 26 Items, Cronbachs Alpha, Benchmark-Bereich, pragmatische und hedonische Qualität, die Verteilung der Antworten jedes Items und für jede teilnehmende Person die Anzahl inkonsistenter Skalen und gleicher Antworten.

| Szenario | Teilnehmende | Verdächtige | Verglichene Werte | Fehler der Tabelle (null im Tool) | Größte Abweichung |
|---|---|---|---|---|---|
| basico | 20 | 0 | 391 | 0 | 3,3 × 10⁻¹⁶ |
| inconsistente | 15 | 4 | 381 | 0 | 4,4 × 10⁻¹⁶ |
| extremos/n1 | 1 | 0 | 353 | 102 | 0 |
| extremos/n2 | 2 | 0 | 355 | 0 | 8,9 × 10⁻¹⁶ |
| extremos/todos-1 | 3 | 3 | 357 | 70 | 0 |
| extremos/todos-7 | 3 | 3 | 357 | 70 | 0 |
| oficial-exemplo | 255 | 18 | 861 | 0 | 2,9 × 10⁻¹⁵ |
| grande | 1000 | 63 | 2.351 | 0 | 9,3 × 10⁻¹⁵ |
| bordas | 12 | 3 | 375 | 0 | 5,6 × 10⁻¹⁶ |
| variancia-zero | 12 | 0 | 375 | 3 | 4,4 × 10⁻¹⁶ |
| negativo | 18 | 1 | 387 | 0 | 2,2 × 10⁻¹⁶ |
| **Gesamt** | | | **6.543** | **245** | **9,3 × 10⁻¹⁵** |

Die Texte (Benchmark-Bereich) und die Zählungen (n, Verteilung, inkonsistente Skalen, gleiche Antworten) sind identisch. Die Dezimalzahlen weichen höchstens in der 15. Nachkommastelle ab, wegen der Reihenfolge der Summen in Gleitkommaarithmetik; der Test akzeptiert bis zu 1e-6. Die Fälle, die Aufmerksamkeit verlangen, stimmen ebenfalls überein:

- **Nur eine Person oder alle gleich.** Die Tabelle liefert `#DIV/0!` bei Standardabweichung, KI und Alpha; das Tool gibt `null` zurück, und das Dashboard zeigt „—“.
- **Ein Item ohne Varianz** (`variancia-zero`). Die Tabelle berechnet die Korrelation dieses Items nicht, und das Alpha der Durchschaubarkeit und das KI des Items werden zu Fehlern. Das Tool macht dasselbe und berechnet das Alpha der anderen fünf Skalen normal.
- **Sich widersprechende Items** (`negativo`). Die mittlere Korrelation der Originalität liegt nahe bei -1/3, und die Formel des standardisierten Alphas, k × r̄ / (1 + (k - 1) × r̄), ergibt in beiden -42,78.
- **Die Grenzen der Verdachtsregeln** (`bordas`). Eine Spannweite von genau 3 zählt nicht, 4 zählt; 15 gleiche Antworten markieren nicht, 16 markieren. Tool und Tabelle liefern für jede teilnehmende Person dasselbe.

### Die Tabelle, die das Tool exportiert

Der Export „Offizielle UEQ-Tabelle (XLSX)“ wurde auf drei Arten geprüft:

1. **Datei für Datei.** Ein Unit-Test öffnet die erzeugte `.xlsx` und prüft, dass der Reiter Data die Antworten ab Zeile 4 enthält, dass die 255 Beispielteilnehmenden entfernt wurden, dass die Sprache in `Read_First!B5` steht und dass Diagramme, Stile, Bilder und die anderen Teile der Datei Byte für Byte mit denen der offiziellen Datei übereinstimmen.
2. **In Excel.** Die vom Tool erzeugte Tabelle der 11 Szenarien wurde in Excel geöffnet, ohne etwas einzufügen und ohne eine Neuberechnung auszulösen. Excel berechnete beim Öffnen von selbst neu, und die 6.543 Werte waren identisch mit denen des manuellen Einfügens, mit den portugiesischen Beschriftungen („Atractividade“, „Desagradável“).
3. **Über die Oberfläche.** Ein End-to-End-Test importiert 7 Szenarien (`oficial-exemplo`, `grande`, `inconsistente`, `bordas`, `variancia-zero`, `negativo` und `extremos/n2`) über die Oberfläche Antworten importieren, prüft n, Mittelwert, SD, KI95, Alpha und Benchmark jeder Skala in der Tabelle des Dashboards gegen die Zahlen der offiziellen Tabelle und lädt die Tabelle der Version herunter. Fünf dieser Dateien, aus dem laufenden Tool heruntergeladen, wurden in Excel geöffnet: keine Abweichungen.

### UEQ-S

Die Kurzfassung wurde auf dieselbe Weise mit der *UEQ-S Data Analysis Tool V15* (`Short_UEQ_Data_Analysis_Tool_V15.xlsx`, aus demselben `Data_Analysis_Tools.zip`) verglichen, mit dem Skript `scripts/planilha-oficial-ueq-s.ps1`, in 9 Szenarien aus [data/fixtures-ueq-s/](../../data/fixtures-ueq-s/LEIA-ME.md). Vorher lief das Skript mit den 13 Beispielteilnehmenden der Tabelle und reproduzierte die in der offiziellen Datei gespeicherten Ergebnisse.

Verglichen wurden Mittelwert, SD, n und KI95 der pragmatischen, der hedonischen und der Gesamtqualität und der 8 Items, das Alpha der beiden Skalen, der Benchmark-Bereich und für jede teilnehmende Person die drei Werte (Reiter DT), die Anzahl inkonsistenter Skalen, die Anzahl gleicher Antworten und ob sie bei allen 8 Items die Mitte markiert hat.

| Szenario | Teilnehmende | Verdächtige | Verglichene Werte | Fehler der Tabelle (null im Tool) | Größte Abweichung |
|---|---|---|---|---|---|
| oficial-exemplo | 13 | 2 | 136 | 0 | 4,4 × 10⁻¹⁶ |
| do-ueq-basico | 20 | 0 | 178 | 0 | 2,2 × 10⁻¹⁶ |
| do-ueq-oficial-exemplo | 255 | 5 | 1.588 | 0 | 8,9 × 10⁻¹⁶ |
| grande | 1000 | 30 | 6.058 | 0 | 6,0 × 10⁻¹⁵ |
| bordas | 12 | 3 | 130 | 0 | 4,4 × 10⁻¹⁶ |
| variancia-zero | 12 | 0 | 130 | 3 | 2,2 × 10⁻¹⁶ |
| negativo | 18 | 0 | 166 | 0 | 4,4 × 10⁻¹⁶ |
| n1 | 1 | 0 | 64 | 35 | 0 |
| n2 | 2 | 0 | 70 | 0 | 4,4 × 10⁻¹⁶ |
| **Gesamt** | | | **8.520** | **38** | **6,0 × 10⁻¹⁵** |

Die Szenarien `do-ueq-basico` und `do-ueq-oficial-exemplo` stammen aus Szenarien des vollständigen UEQ: die 8 UEQ-S-Paare jeder teilnehmenden Person, mit vertauschten Seiten bei den Items 4 und 7. Sie belegen den Reiter UEQ-S einer Studie mit dem vollständigen UEQ, der dieselbe Umwandlung vornimmt. Die Grenzfälle stimmen ebenfalls überein:

- **Die Verdachtsregeln des UEQ-S** (`bordas`). Eine Spannweite von 4 auf nur einer Skala markiert nicht; auf beiden markiert sie. Achtmal die 4 markiert („Remove“ in der Tabelle); achtmal die 7 nicht, weil die Tabelle nur empfiehlt, Personen zu entfernen, die die Mitte markiert haben.
- **Sich widersprechende Items** (`negativo`). Das Alpha der hedonischen Qualität ergibt in beiden -1,40.
- **Ein Item ohne Varianz** (`variancia-zero`). Ohne KI des Items und ohne Alpha der pragmatischen Qualität, in beiden.

Die „Offizielle UEQ-S-Tabelle (XLSX)“, die das Tool exportiert, wurde wie die des vollständigen UEQ geprüft: Ein Unit-Test öffnet die Datei und prüft den Reiter Data und die Sprache in `Read_First!B4`; die 9 vom Tool erzeugten Dateien wurden in Excel geöffnet, ohne etwas einzufügen oder eine Neuberechnung auszulösen, und die Werte waren identisch mit denen in `esperado.json`, mit den portugiesischen Beschriftungen („Qualidade Pragmática“, „Obstrutivo“); und ein End-to-End-Test importiert 5 Szenarien in eine UEQ-S-Studie, prüft die Tabelle des Reiters UEQ-S und lädt die Tabelle herunter.

## Wie man die Prüfung wiederholt

Jede Person kann diese Prüfung ohne Programmierkenntnisse wiederholen:

1. Führen Sie in einer lokalen Installation `pnpm db:seed` aus und melden Sie sich mit dem Testkonto an (`pesquisador@exemplo.com`, Passwort `senha-de-teste`): Die Beispielstudie ist bereits in der Liste.
2. Laden Sie unter Ergebnisse › Exportieren die umkodierten Antworten und die Ergebnisse pro Skala herunter.
3. Berechnen Sie in einer Tabellenkalkulation den Mittelwert der Items jeder Skala pro teilnehmender Person, danach Mittelwert, `DESVPAD` und die Marge `1,959964 × DESVPAD / RAIZ(n)` jeder Skala. Für das Alpha berechnen Sie `CORREL` für jedes Itempaar der Skala, bilden den Mittelwert und wenden k × r̄ / (1 + (k - 1) × r̄) an. In der deutschen Excel-Version heißen die Funktionen `STABW.S`, `WURZEL` und `KORREL`.
4. Vergleichen Sie mit der Datei der Ergebnisse pro Skala und mit dem Dashboard.
5. Für den Vergleich mit der offiziellen Tabelle laden Sie „Offizielle UEQ-Tabelle (XLSX)“ herunter, öffnen sie in Excel und klicken auf Bearbeitung aktivieren. Die Reiter Results, Confidence_Intervals, Scale_Consistency, Benchmark und Inconsistencies zeigen die Zahlen der Tabelle selbst, berechnet mit den Antworten der Studie.
