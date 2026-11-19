# UEQ-Protokoll · Berechnungsspezifikation

Quelle: Schrepp, M. *User Experience Questionnaire Handbook* und die offizielle Tabelle *UEQ Data Analysis Tool* (ueq-online.org). Am 23.10.2026 geprüfte Versionen: Handbook Version 11 (12.09.2023) und `UEQ_Data_Analysis_Tool_V15.xlsx` (22.10.2026). Wenn Handbook und Tabelle voneinander abweichen, gilt die Tabelle, denn gegen sie vergleichen die Tests. Jede Regel nennt in Klammern die Quelle, an der sie geprüft wurde: die Seite des Handbooks oder das Tabellenblatt der Tabelle.

## 1. Items, Skalen und Polarität

26 Items als semantisches Differenzial, 7 Positionen, gespeichert von 1 (linker Pol) bis 7 (rechter Pol). Die Teilnehmenden sehen nie Zahlen.

Polarität:
- `+` = positiver Begriff **rechts** → `x' = x - 4`
- `-` = positiver Begriff **links** → `x' = 4 - x`

| Nr. | Linker Pol (EN) | Rechter Pol (EN) | Skala | Polarität |
|---|---|---|---|---|
| 1 | annoying | enjoyable | Attraktivität | + |
| 2 | not understandable | understandable | Durchschaubarkeit | + |
| 3 | creative | dull | Originalität | - |
| 4 | easy to learn | difficult to learn | Durchschaubarkeit | - |
| 5 | valuable | inferior | Stimulation | - |
| 6 | boring | exciting | Stimulation | + |
| 7 | not interesting | interesting | Stimulation | + |
| 8 | unpredictable | predictable | Vertrauenswürdigkeit | + |
| 9 | fast | slow | Effizienz | - |
| 10 | inventive | conventional | Originalität | - |
| 11 | obstructive | supportive | Vertrauenswürdigkeit | + |
| 12 | good | bad | Attraktivität | - |
| 13 | complicated | easy | Durchschaubarkeit | + |
| 14 | unlikable | pleasing | Attraktivität | + |
| 15 | usual | leading edge | Originalität | + |
| 16 | unpleasant | pleasant | Attraktivität | + |
| 17 | secure | not secure | Vertrauenswürdigkeit | - |
| 18 | motivating | demotivating | Stimulation | - |
| 19 | meets expectations | does not meet expectations | Vertrauenswürdigkeit | - |
| 20 | inefficient | efficient | Effizienz | + |
| 21 | clear | confusing | Durchschaubarkeit | - |
| 22 | impractical | practical | Effizienz | + |
| 23 | organized | cluttered | Effizienz | - |
| 24 | attractive | unattractive | Attraktivität | - |
| 25 | friendly | unfriendly | Attraktivität | - |
| 26 | conservative | innovative | Originalität | + |

Schnellkontrolle: Attraktivität 1, 12, 14, 16, 24, 25 · Durchschaubarkeit 2, 4, 13, 21 · Effizienz 9, 20, 22, 23 · Vertrauenswürdigkeit 8, 11, 17, 19 · Stimulation 5, 6, 7, 18 · Originalität 3, 10, 15, 26. Es sind 13 Items mit der Polarität `-`.

Die portugiesischen Begriffe stehen hier bewusst **nicht**. Sie stammen aus dem offiziellen Sprachpaket und liegen in `data/ueq-itens-ptbr.json` (siehe `data/LEIA-ME.md`). (Quelle: Tabelle, Blatt DT.) Die Umkodierungsformeln in Zeile 4 und die Mittelwerte je Skala (Spalten AC bis AH) stimmen mit der obigen Tabelle überein.

Gruppierung:
- Pragmatische Qualität = Mittelwert aus Durchschaubarkeit, Effizienz, Vertrauenswürdigkeit
- Hedonische Qualität = Mittelwert aus Stimulation, Originalität
- Attraktivität steht für sich allein (Gesamteindruck)

## 2. Umkodierung

`recodificar(valor: 1..7, polaridade: '+' | '-'): -3..3`. Ein Wert außerhalb von 1..7 löst einen Fehler aus.

## 3. Score je Teilnehmer und Skala

Mittelwert der umkodierten Werte der Items dieser Skala für diesen Teilnehmer.

(Quelle: Tabelle, Blatt DT.) Eine leere Zelle wird ignoriert. Der Score der Skala ist der Mittelwert nur der beantworteten Items (`AVERAGE`) und bleibt leer, wenn kein Item der Skala beantwortet wurde. Unser Tool verlangt alle 26 Items (Validierung im Formular), daher gibt es aus der Erhebung keinen fehlenden Wert. Der CSV-Import folgt derselben Regel: Jede Zeile braucht die 26 Werte von 1 bis 7, und eine Datei mit auch nur einer ungültigen Zeile wird vollständig abgelehnt (`src/lib/importacao.ts`).

## 4. Statistiken je Skala (unter den in die Auswertung einbezogenen Teilnehmenden)

- `n` = einbezogene Teilnehmende
- `media` = Mittelwert der Scores je Teilnehmer
- `dp` = Stichproben-Standardabweichung (Divisor `n - 1`) (Quelle: Tabelle, Blatt Confidence_Intervals: STDEV)
- `ic95` = `media ± z · dp / √n`, mit `z = 1,959963984540054`, dem exakten 0,975-Quantil der Normalverteilung. Die Tabelle verwendet `CONFIDENCE(0.05; dp; n)`, das nicht auf 1,96 rundet, und mit 1,96 weichen die Tests schon in der sechsten Nachkommastelle ab. (Quelle: Tabelle, Blatt Confidence_Intervals)
- außerdem je Item: Mittelwert, dp, n und Verteilung der Antworten 1 bis 7 (für das Diagramm je Item)

Bei `n < 2` gibt es weder dp noch Konfidenzintervall. Bei `dp = 0` (alle haben denselben Score) berechnet die Tabelle das Konfidenzintervall ebenfalls nicht, weil `CONFIDENCE` ein dp größer als null verlangt (`#NUM!`), und wir folgen der Tabelle. Die Funktion liefert in diesen Feldern `null`, und die Oberfläche zeigt „Stichprobe zu klein“.

## 5. Interpretationsbereiche

| Mittelwert der Skala | Interpretation |
|---|---|
| > +0,8 | positiv |
| zwischen -0,8 und +0,8 | neutral |
| < -0,8 | negativ |

(Quelle: Handbook S. 5.) "values between -0.8 and 0.8 represent a neutral evaluation, values > 0,8 positive, values < -0,8 negative". Somit fallen -0,8 und 0,8 in den neutralen Bereich. Die Tabelle wiederholt diesen Text nur im Blatt Results und berechnet den Bereich nicht.

## 6. Cronbachs Alpha je Skala

Die Tabelle verwendet nicht die Varianzformel, sondern das standardisierte Alpha, berechnet über den Mittelwert der Korrelationen zwischen den Items:

```
r̄    = média das correlações de Pearson entre todos os pares de itens da escala
alfa = k · r̄ / (1 + (k - 1) · r̄)
```
`k` = Anzahl der Items der Skala (6 bei Attraktivität, 4 bei den anderen), was 15 Paare bei Attraktivität und 6 bei den anderen ergibt. Die Berechnung verwendet die umkodierten Werte. (Quelle: Handbook S. 10 und Tabelle, Blatt Scale_Consistency: CORREL und (4*r̄)/(1+(3*r̄)))

Variiert ein Item der Skala zwischen den Teilnehmenden nicht, existiert die Korrelation nicht (die Tabelle zeigt `#DIV/0!`), und bei `n < 2` ebenfalls nicht. In diesen Fällen ist das Alpha `null`. Ein Wert unter **0,7** wird im Dashboard mit einem Text markiert, der erklärt, dass die Skala von dieser Gruppe möglicherweise falsch verstanden wird. Das Handbook betrachtet 0,6 oder 0,7 als Faustregel und rät bei kleinen Stichproben (weniger als 50) zur Vorsicht.

Die Tabelle zeigt außerdem das Konfidenzintervall des Alpha (Bonett, 2002) und Guttmans Lambda2. Beide liegen außerhalb des Umfangs.

## 7. Inkonsistente Antworten

Für jeden Teilnehmer und jede Skala: `amplitude = max(itens recodificados) - min(itens recodificados)`.
- `amplitude > 3` → Skala ist für diesen Teilnehmer inkonsistent (Quelle: Handbook S. 7-8 und Tabelle, Blatt Inconsistencies)
- Teilnehmer mit Inkonsistenz in **3 oder mehr Skalen** → als verdächtig markiert. Das Handbook überlässt die Wahl zwischen 2 und 3 Skalen den Forschenden. Die Tabelle schlägt in der Spalte „Critical?“ vor, Personen mit 3 oder mehr zu entfernen, und wir folgen der Tabelle. (Quelle: Handbook S. 8 und Tabelle, Blatt Inconsistencies)

Zweite Regel, aus dem Handbook und der Tabelle: Ein Teilnehmer mit **mehr als 15 gleichen Antworten** unter den 26 Items (gezählt auf der Originalskala von 1 bis 7, zum Beispiel alles auf der 4) wird ebenfalls als verdächtig markiert. (Quelle: Handbook S. 8 (Schrepp, 2023) und Tabelle, Blatt Inconsistencies, Spalte „Critical length“)

Ein Teilnehmer ist verdächtig, wenn er unter eine der beiden Regeln fällt, und die Oberfläche zeigt, welche es war. Die drei Schwellenwerte (`amplitudeMaxima`, `escalasParaSuspeita`, `respostasIguaisMaximas`) stehen in `data/protocolo.json`, nicht im Code.

Die Forschenden sehen die Liste der Verdächtigen und entscheiden, wer aus der Auswertung ausscheidet. Ausschließen löscht die Antwort nicht: Es ändert nur `incluidaNaAnalise = false`. Jede Zahl im Dashboard und im Export der Ergebnisse berücksichtigt nur einbezogene Teilnahmen. Der Export der Rohantworten enthält alle, mit einer Spalte, die die Einbeziehung angibt.

## 8. Benchmark

Jeder Skalenmittelwert wird in einen von fünf Bereichen eingeordnet: Ausgezeichnet, Gut, Über dem Mittelwert, Unter dem Mittelwert, Schlecht. Die Grenzen je Skala stehen in `data/benchmark.json` mit ausgefülltem Feld `fonte` (Version des Benchmarks, Jahr, Seite oder Blatt). (Quelle: Tabelle V15, Blatt Benchmark, Tabelle „Benchmark borders“.) Die Grenzen sind die Quantile 0,25 (`abaixoDaMedia`), 0,5 (`acimaDaMedia`), 0,75 (`bom`) und 0,9 (`excelente`), basierend auf 21175 Personen aus 468 Studien. Der Benchmark wird einmal im Jahr aktualisiert (Handbook S. 5), prüfen Sie daher die Version der Tabelle vor der Präsentation. Verwenden Sie keine Werte aus Blogs, Artikeln Dritter oder aus dem Gedächtnis eines Modells.

Erwartetes Format:
```json
{
  "fonte": "UEQ Data Analysis Tool vX, aba Benchmark, acessado em DD/MM/2026",
  "escalas": {
    "atratividade": { "excelente": 0, "bom": 0, "acimaDaMedia": 0, "abaixoDaMedia": 0 }
  }
}
```
Interpretation, mit strikt größer wie in der Formel der Tabelle: `media > excelente` → Ausgezeichnet, `> bom` → Gut, `> acimaDaMedia` → Über dem Mittelwert, `> abaixoDaMedia` → Unter dem Mittelwert, sonst Schlecht. Ein Mittelwert, der genau der Grenze entspricht, fällt in den unteren Bereich.

## 9. Exporte

1. **Rohantworten** (CSV): eine Zeile je Teilnahme. Spalten: ID der Teilnahme, Version, Datum, einbezogen (ja/nein), verdächtig (ja/nein), Herkunft, Sprache, Übersetzung genehmigt, minderjährig (hat mit Genehmigung der erziehungsberechtigten Person angegeben, unter 18 Jahre alt zu sein), demografische Angaben, `item01` bis `item26` mit Werten von 1 bis 7.
2. **Umkodierte Antworten** (CSV): gleiches Format, Werte von -3 bis 3.
3. **Ergebnisse nach Skala** (CSV): Version, Skala, n, Mittelwert, dp, ic95 unten, ic95 oben, Alpha, Interpretationsbereich, Benchmark-Bereich.
4. **Ausgefüllte offizielle Tabelle** (XLSX): die *UEQ Data Analysis Tool V15* selbst (`data/planilha-oficial/UEQ_Data_Analysis_Tool_V15.xlsx`, unverändert aus `Data_Analysis_Tools.zip` kopiert), mit den 26 Werten von 1 bis 7 jeder in die Auswertung einbezogenen Teilnahme ab `Data!A4`, eine Spalte je Item von A bis Z, in der Reihenfolge, in der die Teilnahmen abgeschlossen wurden. (Quelle: Tabelle V15, Blatt Data.) Der Export schreibt nur die Eingabe, so als würde man die Antworten von Hand einfügen:
   - löscht die 255 Beispielteilnehmenden, die im Blatt Data enthalten sind, und schreibt die Antworten an deren Stelle;
   - trägt in `Read_First!B5` die Sprache der Oberfläche ein, unter den 37, die die Tabelle übersetzt, damit Beschriftungen und Items in dieser Sprache erscheinen;
   - entfernt aus den anderen Blättern die gespeicherten Ergebnisse der Beispieldaten und markiert die Datei zum Neuberechnen beim Öffnen (`fullCalcOnLoad`). In Excel berechnet die Tabelle beim Klick auf **Bearbeitung aktivieren** neu.

   Formeln, Diagramme, Formatvorlagen und die anderen Blätter sind identisch mit denen der offiziellen Datei, und ein Test prüft das Byte für Byte. Auf dem Bildschirm einer Version wird nur diese Version exportiert; unter „Alle Versionen“ wird die gesamte Studie exportiert. Die Tabelle berechnet bis zu 1000 Teilnehmende (der Hinweis im Blatt Data); darüber hinaus erklärt das Dashboard dies und bietet die Rohantworten an.

CSV in UTF-8 mit BOM und Trennzeichen `;` (öffnet sich direkt in Excel auf Portugiesisch). Zahlen mit Dezimalkomma in der CSV der Ergebnisse.

## 10. Validierung gegen die offizielle Tabelle

In `data/fixtures/` liegen 11 Szenarien, jedes mit `respostas.csv` (Format der Tabelle) und `esperado.json` mit den Zahlen der offiziellen Tabelle, die in Excel neu berechnet wurde, nachdem die Antworten in `Data!A4` eingefügt worden waren. Die Liste der Szenarien, die gelesenen Zellen und das Skript, das Excel automatisiert, stehen in [data/fixtures/LEIA-ME.md](../data/fixtures/LEIA-ME.md):

- `basico`: 20 Teilnehmende mit unterschiedlichen Antworten;
- `inconsistente`: 15, mit 4 Verdächtigen wegen der Amplitude und 2 Grenzfällen;
- `extremos`: alle 1, alle 7, n = 1, n = 2;
- `oficial-exemplo`: die 255 Beispielteilnehmenden der Tabelle selbst;
- `grande`: 1000 Teilnehmende, das Maximum der Tabelle;
- `bordas`: Amplitude genau 3, 15 und 16 gleiche Antworten, 26-mal die 4;
- `variancia-zero`: ein Item mit derselben Antwort für alle (Fehler der Tabelle bei Alpha und Konfidenzintervall);
- `negativo`: negative Mittelwerte, Benchmark Schlecht und negatives Alpha.

Die Tests des Moduls `src/ueq/` vergleichen Mittelwert, dp, n und IC95 von Skalen und Items, Alpha, Benchmark, pragmatische und hedonische Qualität, inkonsistente Skalen und gleiche Antworten je Teilnehmer sowie die Verteilung der Antworten, mit einer Toleranz von `1e-6`. Ein Fehler der Tabelle muss im Tool `null` sein.

**Stand 17.11.2026:** Die 11 Szenarien stimmen mit der offiziellen Tabelle überein. Es wurden 6.543 Werte verglichen, und die größte Abweichung beträgt 9,3 × 10⁻¹⁵, also Rundung bei Gleitkommazahlen. Die 245 Zellen, in denen die Tabelle einen Fehler liefert, sind im Tool `null` ([RNF11](documentacao/requisitos.md#rnf11), [Überprüfung der Berechnung](documentacao/verificacao-do-calculo.md#comparação-com-a-planilha-oficial)).

## 11. UEQ-S, die Kurzversion

(Quelle: UEQ Handbook Version 11, "Short version for special application scenarios", S. 11-13, und das *UEQ-S Data Analysis Tool V15*, `data/planilha-oficial/Short_UEQ_Data_Analysis_Tool_V15.xlsx`.)

Die Studie wählt den Fragebogen bei der Erstellung: den vollständigen UEQ oder den UEQ-S. Die Wahl wird bei der ersten Antwort gesperrt, damit die Studie beide nicht vermischt. Das Handbook empfiehlt den UEQ-S nur, wenn der vollständige nicht passt (wenig Zeit, der UEQ innerhalb eines größeren Fragebogens, dieselbe Person bewertet mehrere Produkte nacheinander), weil er nicht alle 6 Skalen misst.

**Items.** Es sind 8 Items des UEQ selbst, in dieser Reihenfolge ([`data/ueq-s-itens-ptbr.json`](../data/ueq-s-itens-ptbr.json)):

| UEQ-S | UEQ-Item | Links | Rechts | Skala |
|---|---|---|---|---|
| 1 | 11 | Obstrutivo | Condutor | Pragmatische Qualität |
| 2 | 13 | Complicado | Fácil | Pragmatische Qualität |
| 3 | 20 | Ineficiente | Eficiente | Pragmatische Qualität |
| 4 | 21 | Confuso | Evidente | Pragmatische Qualität |
| 5 | 6 | Aborrecido | Excitante | Hedonische Qualität |
| 6 | 7 | Desinteressante | Interessante | Hedonische Qualität |
| 7 | 10 | Convencional | Original | Hedonische Qualität |
| 8 | 15 | Comum | Vanguardista | Hedonische Qualität |

Im UEQ-S steht der negative Begriff immer links, daher haben alle Items die Polarität `+`, und die Umkodierung ist x − 4. Die Items 4 und 7 erscheinen gegenüber dem UEQ mit vertauschten Seiten: Eine Antwort x im UEQ-S entspricht 8 − x im äquivalenten Item des UEQ. Den UEQ-S gibt es in denselben 37 Sprachen. Die Begriffe jeder Sprache stammen aus der offiziellen Liste der UEQ-S-Items (`docs/UEQ-ORG/ueq-s/UEQS_Items.pdf`), die in [`data/ueq-s-idiomas.json`](../data/ueq-s-idiomas.json) abgelegt ist. In 31 Sprachen wiederholt sie die Paare des vollständigen UEQ mit vertauschten Seiten. In 6 (Italienisch, Kroatisch, Griechisch, Türkisch, Persisch und Chinesisch) verwendet sie bei einigen Paaren ein anderes Wort, zum Beispiel *konvencionalna/inventivna* im Item 7 auf Kroatisch, und das Tool folgt der Liste des UEQ-S. In 4 Sprachen (Spanisch, Dänisch, Tamil und Kannada) hat das PDF Tippfehler oder ein wiederholtes Paar; in diesen Fällen bleibt das Paar des vollständigen UEQ, und die Datei vermerkt jede Korrektur.

**Wo die Antworten liegen.** In einer UEQ-S-Studie werden die 8 Antworten in den äquivalenten Items des UEQ gespeichert, bereits in die Ausrichtung des jeweiligen Items umgerechnet. Die Auswertung des UEQ-S liest diese 8 Items und macht die Umrechnung rückgängig. Deshalb dient dieselbe Auswertung beiden Studientypen: In einer Studie mit dem vollständigen UEQ verwendet der Reiter UEQ-S der Ergebnisse die 8 Paare, die der Teilnehmer ebenfalls beantwortet hat, genau so, wie die Autoren den UEQ-S und seinen Benchmark aufgebaut haben.

**Skalen.** Für jeden Teilnehmer (Blatt DT): pragmatische Qualität = Mittelwert der Items 1 bis 4; hedonische Qualität = Mittelwert der Items 5 bis 8; gesamt = Mittelwert der 8. Mittelwert, dp, IC95, Interpretationsbereich und Benchmark folgen den Abschnitten 4, 5 und 8, mit demselben neutralen Bereich und demselben z. Das Handbook mahnt zur Vorsicht bei der Gesamtskala: Sie ist kein einzelner Indikator der Erfahrung, weil das Gewicht von Pragmatik und Hedonik von Produkt zu Produkt wechselt.

**Alpha.** Nur für die pragmatische und die hedonische Qualität, mit der Formel aus Abschnitt 6 für k = 4 (Blatt Scale_Consistency, `4·r̄ / (1 + 3·r̄)`). Die Tabelle berechnet kein Alpha für die Gesamtskala.

**Benchmark.** Die Grenzen aus dem Blatt Benchmark der Tabelle des UEQ-S ([`data/benchmark-ueq-s.json`](../data/benchmark-ueq-s.json)):

| Skala | Unter dem Mittelwert | Über dem Mittelwert | Gut | Ausgezeichnet |
|---|---|---|---|---|
| Pragmatische Qualität | 0,72 | 1,17 | 1,55 | 1,74 |
| Hedonische Qualität | 0,35 | 0,85 | 1,20 | 1,59 |
| Gesamt | 0,59 | 0,98 | 1,31 | 1,58 |

Die Tabelle selbst weist darauf hin, dass diese Grenzen wegen fehlender UEQ-S-Daten aus denselben 8 Items innerhalb des Benchmarks des vollständigen UEQ stammen und eine Näherung sind. Das Dashboard wiederholt den Hinweis.

**Verdächtige Antworten.** Die Regeln des Blatts Inconsistencies der Tabelle des UEQ-S ([`data/protocolo-ueq-s.json`](../data/protocolo-ueq-s.json)), die sich von denen des vollständigen UEQ unterscheiden:

- eine Skala ist inkonsistent, wenn der Abstand zwischen ihrem besten und ihrem schlechtesten Item größer als 3 ist;
- die Antwort ist verdächtig, wenn die 2 Skalen inkonsistent sind;
- die zweite Regel gilt nur für Personen, die bei allen 8 Items die mittlere Position (4) markiert haben. Bei so wenigen Items ist es üblich, dieselbe Position zu wiederholen, und die Tabelle empfiehlt nur, diesen Fall zu entfernen.

**Exporte.** In einer UEQ-S-Studie haben die Roh- und die umkodierten Antworten 8 Spalten (`item01` bis `item08`, in der Reihenfolge des UEQ-S), die Ergebnisse nach Skala enthalten pragmatische, hedonische und gesamte Qualität, und die exportierte offizielle Tabelle ist die des UEQ-S, ausgefüllt wie in Abschnitt 9.4: die 8 Antworten in `Data!A4:H` und die Sprache in `Read_First!B4`. In einer Studie mit dem vollständigen UEQ exportiert der Reiter UEQ-S die Ergebnisse des UEQ-S und die Tabelle des UEQ-S mit den 8 äquivalenten Items.

**Validierung.** In `data/fixtures-ueq-s/` liegen 9 Szenarien mit der `esperado.json` der in Excel neu berechneten Tabelle des UEQ-S ([data/fixtures-ueq-s/LEIA-ME.md](../data/fixtures-ueq-s/LEIA-ME.md)), zwei davon aus Szenarien des vollständigen UEQ übernommen. **Stand 17.11.2026:** Alle 9 stimmen mit der Tabelle überein. Es wurden 8.520 Werte verglichen, und die größte Abweichung beträgt 6,0 × 10⁻¹⁵. Die 38 Zellen, in denen die Tabelle einen Fehler liefert, sind im Tool `null` ([RF62](documentacao/requisitos.md#rf62)).
