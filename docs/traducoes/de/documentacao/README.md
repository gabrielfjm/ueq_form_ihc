# Dokumentation des UEQ-Tools

Das UEQ-Tool ist eine quelloffene Webanwendung zur Durchführung von Studien zur User Experience mit dem *User Experience Questionnaire* (UEQ), von der Anlage der Studie bis zum Export der Daten. Diese Dokumentation beschreibt, was das Tool tut, für wen es gedacht ist, wie es gebaut wurde und woran man erkennt, dass es funktioniert.

Alles liegt in offenen Formaten vor und wird direkt auf GitHub angezeigt: Markdown, CSV und Mermaid-Diagramme, mit der Quelldatei jedes Diagramms in [`fontes/`](fontes/). Die Anforderungstabelle gibt es auch als `.xlsx`, zum Öffnen in Excel oder LibreOffice. Dieselben Dateien erscheinen im Tool auf dem Reiter **Dokumentation**, der ohne Anmeldung für alle zugänglich ist.

Der Code und diese Dokumentation stehen unter der [MIT-Lizenz](../../LICENSE). Das offizielle UEQ-Material in `data/` gehört den Autoren des Fragebogens (siehe den Abschnitt Lizenz der [README](../../README.md#licença)).

Projekt der Lehrveranstaltung Grundlagen der Mensch-Computer-Interaktion, PPGIa · PUCPR · 2026. Team: Gabriel Meira, Jean Weiss und Luiza Pedralli.

## Inhalt

| Abschnitt | Dokument | Inhalt |
|---|---|---|
| Anforderungen | [Anforderungen](requisitos.md) | Die 68 funktionalen und die 26 nicht-funktionalen Anforderungen, mit Priorität, Auslieferungs-Sprint, Status und Prüfweise. Auch als [requisitos.csv](requisitos.csv) |
| Anforderungen | [Rückverfolgbarkeitsmatrix](matriz-rastreabilidade.md) | Jede Anforderung verknüpft mit User Stories, Anwendungsfällen, Personas, Testfällen, Sprint und Code. Auch als [matriz-rastreabilidade.csv](matriz-rastreabilidade.csv) |
| Anforderungen | [Anforderungstabelle](planilha-requisitos.xlsx) | Anforderungen, Sprints, User Stories, Anwendungsfälle, Matrix, Szenarien und Testfälle, je ein Blatt, mit Filtern |
| Nutzende | [Personas](personas.md) | Acht Personas: drei Forschende, vier Teilnehmende und eine Person, die die Installation betreut |
| Nutzende | [User Stories](historias-de-usuario.md) | 44 User Stories mit Akzeptanzkriterien. Auch als [historias-de-usuario.csv](historias-de-usuario.csv) |
| Modellierung | [Anwendungsfälle](casos-de-uso.md) | Vier UML-Diagramme, die Liste der 33 Anwendungsfälle und die Spezifikation der wichtigsten |
| Modellierung | [Klassendiagramm](diagrama-de-classes.md) | Das Domänenmodell und das Berechnungsmodul des UEQ |
| Modellierung | [Logisches Datenbankmodell](modelo-logico.md) | Die 11 PostgreSQL-Tabellen, mit Spalten, Schlüsseln und dem, was jede Löschung mit entfernt |
| Modellierung | [Sequenzdiagramme](diagramas-de-sequencia.md) | Acht Abläufe vom Klick bis zur Datenbank: anmelden, antworten, Ergebnisse ansehen, aus der Auswertung nehmen, PDF, importieren, einladen und übersetzen |
| Architektur | [Architektur](arquitetura.md) | C4-Modell (Kontext, Container und Komponenten), Sicherheit, Entscheidungen und Bereitstellung |
| Tests | [Testfälle und Szenarien](casos-de-teste.md) | Strategie, 25 Szenarien und 206 Testfälle (Ende-zu-Ende, Unit und manuell), mit den Anforderungen, die jeder prüft, und dem Ergebnis des letzten Durchlaufs. Auch als [casos-de-teste.csv](casos-de-teste.csv) |
| Tests | [Prüfung der Berechnung](verificacao-do-calculo.md) | Die Berechnung des Tools von Hand mit der Beispielstudie nachgerechnet und in 11 Szenarien mit der offiziellen UEQ-Tabelle und in 9 mit der des UEQ-S verglichen: Mittelwerte, Standardabweichung, IC95, Alpha, Benchmark, Verdachtsfälle und Exporte |
| Tests | [Manuelle Checkliste](../checklist-manual.md) | Was das Team mit den eigenen Händen prüft: Screenreader, Zoom, echtes Smartphone, Farbfehlsichtigkeit |
| Tests | [Ablauf der Überprüfung](../roteiro-revisao.md) | Was zu öffnen ist, was auf jeder Seite zu tun ist und wie Probleme zu notieren sind |
| Spezifikation | [UEQ-Protokoll](../ueq-protocolo.md) | Items, Skalen, Polarität und alle Formeln der Berechnung, geprüft anhand des Handbuchs und der offiziellen Tabelle |
| Spezifikation | [Grundlagen der MCI](../ihc.md) | Anforderungen an Usability und Barrierefreiheit, jeweils mit dem Prinzip aus der Literatur verknüpft, das sie begründet |
| Spezifikation | [Oberflächenentscheidungen](../rastreabilidade-ihc.md) | Jede Oberflächenentscheidung, das Prinzip, der Code und der Test, der sie belegt |
| Spezifikation | [Sprachen](../idiomas.md) | Die 37 Sprachen des Fragebogens, woher jeder Text stammt und die Korrekturen an den offiziellen Begriffen |
| Spezifikation | [Visuelle Identität](../design.md) | Farben, Typografie, Layout, Symbole und Tonalität |
| Spezifikation | [Code-Konventionen](../codigo.md) | Namen, Kommentare, Struktur, Tests und Commits |

## Wo man anfängt

- **Sie wollen das Tool in einer Studie einsetzen?** Lesen Sie die [Personas](personas.md) der Forschenden, den Anwendungsfall [Fragebogen beantworten](casos-de-uso.md#uc14), um zu sehen, was die Teilnehmenden durchlaufen, und das [UEQ-Protokoll](../ueq-protocolo.md), um zu erfahren, wie jede Zahl berechnet wird.
- **Sie wollen das Projekt bewerten?** Beginnen Sie mit den [Anforderungen](requisitos.md), der [Rückverfolgbarkeitsmatrix](matriz-rastreabilidade.md) und den [Testfällen](casos-de-teste.md). Die [Prüfung der Berechnung](verificacao-do-calculo.md) zeigt die von Hand nachgerechnete Berechnung, und die [Oberflächenentscheidungen](../rastreabilidade-ihc.md) verknüpfen jede Seite mit einem MCI-Prinzip.
- **Sie wollen zum Code beitragen?** Lesen Sie die [Architektur](arquitetura.md), das [Klassendiagramm](diagrama-de-classes.md), das [logische Modell](modelo-logico.md), die [Teststrategie](casos-de-teste.md#estratégia) und die [Code-Konventionen](../codigo.md). Bevor Sie ein Verhalten ändern, suchen Sie die Datei in der [Matrix](matriz-rastreabilidade.md), um zu sehen, welche Anforderung und welcher Test davon abhängen.

## Kennungen

| Präfix | Was es kennzeichnet | Beispiel |
|---|---|---|
| RF | Funktionale Anforderung | [RF27](requisitos.md#rf27) Die 26 Items beantworten |
| RNF | Nicht-funktionale Anforderung | [RNF01](requisitos.md#rnf01) WCAG 2.2 AA |
| PE | Persona | [PE04](personas.md#pe04) Célia |
| HU | User Story | [HU35](historias-de-usuario.md#hu35) Mit Screenreader antworten |
| UC | Anwendungsfall | [UC14](casos-de-uso.md#uc14) Den Fragebogen beantworten |
| CN | Testszenario | [CN06](casos-de-teste.md#cn06) Barrierefreiheit des Fragebogens |
| CT-E, CT-U, CT-M | Testfall Ende-zu-Ende, Unit oder manuell | [CT-E22](casos-de-teste.md#ct-e22) Vollständiger Ablauf nur mit der Tastatur |

Die Kennungen sind fest: Ein Eintrag, der entfällt, behält seine reservierte Nummer, weil die anderen Dokumente über die Nummer verweisen.

## Stand vom 17.11.2026

- **Anforderungen:** Alle 94 sind geliefert. Die letzte war [RF62](requisitos.md#rf62), Den UEQ-S anwenden, am 18.11.2026.
- **Automatische Tests:** Die Ergebnisse des letzten Durchlaufs stehen in den [Testfällen](casos-de-teste.md#execução-de-17112026).
- **Berechnung:** Die [Prüfung der Berechnung](verificacao-do-calculo.md) hat alle Statistiken der Beispielstudie von Hand nachgerechnet, und die 336 Zahlen stimmten mit dem Tool überein. Im Vergleich mit der offiziellen Tabelle selbst stimmen die 11 Testszenarien in allen 6.543 Werten überein, und die 9 des UEQ-S in allen 8.520 Werten der offiziellen Tabelle des UEQ-S. Die Tabellen, die das Tool exportiert, rechnen in Excel mit denselben Zahlen neu.
- **Im Produktivbetrieb:** https://ferramenta-ueq.vercel.app.

## So pflegen Sie die Dokumentation

Wenn ein Pull Request das Verhalten des Tools ändert:

1. Aktualisieren Sie die Anforderung in [requisitos.md](requisitos.md), in [requisitos.csv](requisitos.csv) und in der [Tabelle](planilha-requisitos.xlsx). Eine neue Anforderung erhält die nächste freie Nummer; eine zurückgezogene Anforderung behält den Status Entfernt.
2. Verknüpfen Sie die Anforderung mit mindestens einer User Story und einem Anwendungsfall und aktualisieren Sie die [Matrix](matriz-rastreabilidade.md) mit der Datei und dem Test.
3. Ein neuer Test wird zu einem Fall in [casos-de-teste.md](casos-de-teste.md) und in der CSV: Der Titel des `test(...)` oder des `it(...)` ist das erwartete Ergebnis, und der Fall nennt die Anforderungen, die er prüft.
4. Wenn Sie ein Mermaid-Diagramm ändern, führen Sie `pnpm docs:diagramas` aus, um das SVG zu erzeugen, das der Reiter Dokumentation anzeigt, und die Quelldatei in `fontes/`. Ein Unit-Test schlägt fehl, wenn Sie es vergessen. Aktualisieren Sie unter jedem Diagramm die Version des Tools, die es darstellt.
5. Ein neues Dokument wird in den Katalog in `src/lib/documentacao/catalogo.ts` eingetragen, in seinen Abschnitt und in die Liste `PRONTOS`.

Die Formate desselben Inhalts (Markdown, CSV und XLSX) werden gemeinsam geändert.
