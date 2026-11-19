# Sprachen

Das UEQ-Tool funktioniert in den 37 Sprachen des offiziellen UEQ-Pakets, auf zwei getrennten Wegen:

- **Der Link der Teilnehmenden** verwendet die offiziellen Begriffe und Anweisungen und überprüfbare Bildschirmtexte in Dateien. Weil er ein Messinstrument ist, durchläuft nichts aus dem Fragebogen eine automatische Übersetzung.
- **Das Tool der Forschenden** ist auf Portugiesisch geschrieben und wird bei Bedarf von der Claude-API übersetzt ([eigener Abschnitt](#a-ferramenta-do-pesquisador)). Die Texte, die die forschende Person in einer Studie schreibt (Titel, Produkt und Ziel), verwenden dieselbe API.

## Wie die Sprache gewählt wird

- Beim Erstellen der Studie wählt die forschende Person deren Sprache (`Estudo.idioma`, standardmäßig die Sprache des Kontos). Der Link öffnet in dieser Sprache, auch wenn der Browser auf eine andere eingestellt ist.
- In der Einwilligung und im Fragebogen gibt es einen Sprachwähler „Idioma“ mit dem Namen jeder Sprache in ihr selbst geschrieben. Die Auswahl im Wähler ändert allein nichts: Nur die Schaltfläche „Übernehmen“ ändert die Sprache (WCAG 3.2.2). Ein Wechsel im Fragebogen führt zu ihm zurück, mit den gespeicherten Markierungen.
- Die Wahl bleibt in einem Cookie (`ueq_idioma`, nur unter `/r/<slug>`) und gilt für alle Schritte. Bei der Einwilligung wird der Sprachcode in `Participacao.idioma` gespeichert.
- `<html lang>` und `dir` folgen der Sprache (WCAG 3.1.1). Deshalb hat der Link der Teilnehmenden ein eigenes Root-Layout (`src/app/r/[slug]/layout.tsx`), getrennt von dem des Tools (`src/app/(ferramenta)/layout.tsx`).
- Auf Arabisch, Hebräisch und Persisch läuft der Text von rechts nach links. Die Reihe der Kreise bleibt von links nach rechts, von 1 bis 7, mit dem linken Begriff links, wie in den offiziellen PDFs dieser Sprachen.

## Was woher kommt

| Inhalt | Datei | Quelle |
|---|---|---|
| 26 Begriffspaare | `data/ueq-idiomas.json` | Offizielles PDF jeder Sprache, mit dem Bild der Seite abgeglichen |
| Anweisung vor den Items | `data/ueq-instrucoes.json` | Offizielles PDF jeder Sprache, ohne das Beispiel mit markiertem Kreis (wie auf Portugiesisch) |
| Bildschirmtexte (Einwilligung, Schaltflächen, zugängliche Namen, Fehler, optionale Angaben, Ende) | `src/idiomas/textos/*.ts` | Übersetzung des Teams; die Texte der vollständigen Einwilligungserklärung (13.11.2026) wurden von Claude (Opus) übersetzt und brauchen eine muttersprachliche Prüfung |
| Datenschutzerklärung, über den Link der Teilnehmenden gesehen | Tabelle `traducao` der Datenbank | Claude-API, mit denselben Texten wie das Tool. Ohne Übersetzung erscheint sie auf Portugiesisch, mit einem Hinweis in der Sprache der Person |
| Titel, Produkt und Ziel der Studie | Tabelle `traducao` der Datenbank | Claude-API, ausgehend von der Sprache der Studie. Die Seite wartet bis zu 8 Sekunden; was nicht rechtzeitig ankommt, erscheint im Original, mit dessen `lang` markiert, und bleibt für den nächsten Besuch |

Das PDF ist die Referenz, weil es der Fragebogen ist, den die Teilnehmenden sehen würden. Der Reiter `Items` der UEQ Data Analysis Tool V15 enthält in mehreren Sprachen eine andere Fassung:

- auf Spanisch fehlen bei den Begriffen die Akzente;
- auf Italienisch, Dänisch, Türkisch, Chinesisch, Bulgarisch und Arabisch ist der Wortlaut ein anderer.

Wo die Textebene des PDFs eine alte Schrift verwendet (Hindi, Marathi, Bengalisch, Tamil, Kannada), stammt der Text aus der Tabelle und wurde Item für Item mit dem Bild abgeglichen. Ebenfalls aus der Tabelle stammen Hebräisch, Persisch und Thai. Jede Sprache hält ihre Herkunft in `origemDoTexto` fest.

## Korrekturen an den offiziellen Begriffen

Bei 16 Paaren hat das offizielle PDF selbst einen Fehler, der das Antworten verhindert oder die Wertung umkehrt. Alle betroffenen Sprachen haben eine noch nicht freigegebene Übersetzung, außer Persisch und Hindi. Die Korrektur ist so klein wie möglich. Jede steht in `correcoes` im JSON, mit dem ursprünglichen Paar und dem Grund.

| Sprache | Item | Im offiziellen PDF | Hier verwendet |
|---|---|---|---|
| Bosnisch, Hebräisch, Marathi, Bengalisch, Tamil, Arabisch, Kannada | 19 | derselbe negative Begriff auf beiden Seiten („não atende às expectativas“, erfüllt die Erwartungen nicht) | der positive Begriff links, wie im englischen Original |
| Ungarisch | 16 | `kellemetlen / kellemetlen` | `kellemetlen / kellemes` |
| Ungarisch | 19 | `… / elvárásoknak` (abgeschnitten) | `… / nem felelnek meg az elvárásoknak` |
| Hebräisch | 14 | `לא מושכת / ושך` (abgeschnitten) | `לא מושכת / מושכת` |
| Hebräisch | 24 | `אטקרטיבי` (Tippfehler) | `אטרקטיבי` |
| Kannada | 8 | `ಊಹಿಸಲು ಸಾಧ್ಯವಾದಾಗ` („wenn es vorhersehbar ist“) | `ಊಹಿಸಲು ಸಾಧ್ಯವಾಗದ` („nicht vorhersehbar“) |
| Norwegisch | 26 | `ledende / innovativ` (zwei positive Begriffe) | `konservativ / innovativ` |
| Hindi | 2 und 4 | positiver Begriff auf der Gegenseite zum Original | Begriffe getauscht |
| Persisch | 16 | `مطلوب / نامطلوب`, positiv links | `نامطلوب / مطلوب` |

Bei den Items mit getauschten Begriffen bleibt die Wertung die des Originals: Wer nahe am positiven Begriff markiert, erhält einen positiven Wert. Das ist der Grund, die Begriffe zu tauschen und nicht die Polarität des Items in der Datenbank.

Zwei Sätze der Anweisung wurden weggelassen:

- auf Hebräisch die Sätze über „nach Aspekten gruppierte Paare“ und „Bedeutung jedes Aspekts“, die ein anderes Formular beschreiben;
- auf Persisch der Satz, der bittet, ein nicht bewertbares Item durchzustreichen, weil hier alle Items Pflicht sind.

## Nicht freigegebene Übersetzung

Neun PDFs warnen „This translation is not yet finally approved“: Arabisch, Bengalisch, Bosnisch, Hebräisch, Ungarisch, Kannada, Marathi, Norwegisch und Tamil.

- Wird eine davon gewählt, zeigt die Einwilligung den Hinweis in der Sprache selbst.
- Unter Antworten sagt die Spalte Sprache „Übersetzung nicht freigegeben“.
- Die Exporte der Antworten enthalten die Spalten `idioma` und `traducao_aprovada`.

## Prüfung durch Muttersprachler

Bevor eine Sprache in einer echten Studie verwendet wird, sollte jemand, der sie fließend spricht, Folgendes prüfen:

1. die Bildschirmtexte in `src/idiomas/textos/<código>.ts`, die alle Übersetzungen des Teams sind (die Claude-API übersetzt nur das Tool der Forschenden und die Texte der Studie);
2. die Korrekturen der Tabelle oben, wenn die Sprache welche hat;
3. die Anweisungen mit dem Vermerk „Transcrito da imagem… Conferir com falante nativo“ (aus dem Bild abgeschrieben… mit Muttersprachler prüfen) in `data/ueq-instrucoes.json`: Arabisch, Hindi, Marathi, Bengalisch, Tamil und Kannada. Auf Bengalisch hat das Team die Leerzeichen zwischen den Wörtern gesetzt, weil das PDF keine enthält.

Die Antworten auf die optionalen Angaben werden in jeder Sprache immer mit der portugiesischen Kategorie gespeichert (zum Beispiel „25 a 34 anos“, 25 bis 34 Jahre). Auswertung und Exporte ändern sich nicht.

## Das Tool der Forschenden

Die Sprache wird beim Erstellen des Kontos gewählt und unter Mein Konto › Sprache geändert oder, schneller, über den Sprachwähler in der Leiste (Prototyp r41), der dasselbe tut, ohne die Seite zu verlassen. Vor der Anmeldung gilt die zuletzt im Browser gewählte Sprache (Cookie `idioma_interface`), und der Sprachwähler in der Leiste erscheint auch für nicht angemeldete Personen. Hinweise der Glocke und E-Mails gehen in der Sprache der empfangenden Person hinaus.

So funktioniert es:

1. Jeder Bildschirmtext wird auf Portugiesisch in `t("…")` oder `m("…")` geschrieben. Der Befehl `pnpm i18n:catalogo` extrahiert diese Texte nach `src/traducao/catalogo.json`.
2. Beim Öffnen eines Bildschirms in einer anderen Sprache liest der Server die Übersetzungen aus der Tabelle `traducao`. Was fehlt, erscheint auf Portugiesisch, und die Stapel mit 60 Texten, nach Bildschirm gruppiert, laufen nach der Antwort, bis zu 6 gleichzeitig, mit dem in `src/traducao/claude.ts` festgelegten Modell (Claude Haiku 5.5, das günstigste).
   - Die Übersetzung läuft in drei Schritten, damit die Stapel nicht verschiedene Wörter für dieselbe Sache wählen: zuerst das Glossar der Sprache (`src/traducao/rodadas.ts`), in der Tabelle gespeichert; dann die kurzen Beschriftungen; zuletzt die langen Texte, die die Übersetzung der Schaltflächen erhalten, die sie nennen.
   - Jeder Text geht mit der Datei, die ihn verwendet, und mit den Hinweisen zur Bedeutung der Begriffe, damit „baixar“ (herunterladen) nicht zu „dar baixa“ (abbuchen) wird.
   - Das Glossar enthält einen Mustersatz, der die förmliche Anrede der Sprache festlegt, und die Prüfung behandelt jede andere Anrede als Fehler.
   - Der Name „Ferramenta UEQ“ reist als Platzhalter, und die Übersetzung speichert den portugiesischen Namen. Beim Anzeigen ersetzt der Übersetzer den Namen durch den der Sprache der Oberfläche (UEQ Tool, Herramienta UEQ, UEQ-Tool, Outil UEQ, UEQ ツール...), der in `NOME_DA_FERRAMENTA` in `src/traducao/nucleo.ts` steht. Ein noch nicht übersetzter Satz bleibt ganz auf Portugiesisch, mit dem portugiesischen Namen.
   - Ein zweiter Durchgang vergleicht Original und Übersetzung und korrigiert, was den Sinn verändert hat.
   - Eine Übersetzung mit anderen `{Platzhaltern}` als das Original wird verworfen: Der Text bleibt auf Portugiesisch.
   - Das verringert die Fehler, ersetzt aber nicht die Prüfung durch Muttersprachler.
3. Jede Übersetzung wird nach Sprache und nach dem Hash des Textes gespeichert und daher nie zweimal angefragt. Eine Änderung eines portugiesischen Textes erzeugt eine neue Übersetzung.
4. Verwaltung › Sprachen zeigt die Abdeckung jeder Sprache und hat die Schaltfläche „Jetzt übersetzen“.

Wer einen neuen Text schreibt, sollte an die Person denken, die ihn übersetzt, ohne den Bildschirm zu sehen:

- Schreiben Sie den ganzen Satz, mit Subjekt. „Fica num cookie“ (bleibt in einem Cookie) sagt nicht, was bleibt.
- Vermeiden Sie Wörter mit zwei Bedeutungen. „Baixa os dados“ kann zu „dá baixa“ werden; besser „faz o download“.
- Bauen Sie keine Sätze aus Textstücken und Links zusammen: Die Wortstellung ändert sich von Sprache zu Sprache.
- Lassen Sie nur durch `t()` oder `m()` laufen, was auf dem Bildschirm erscheint. Übersetzte Selektoren und Eventnamen machen den Bildschirm kaputt.

Neue Texte können auch bereits übersetzt hinzukommen, über eine Migration, die in die Tabelle `traducao` schreibt (wie `20261113120100_traducoes_do_termo`, von Claude ohne die API geschrieben). Dann wird die API für sie nicht aufgerufen.

Ohne `ANTHROPIC_API_KEY` in der Umgebung wird nichts übersetzt, und das Tool erscheint auf Portugiesisch. Solange mehr als die Hälfte des Katalogs einer Sprache nicht übersetzt ist, bleiben `<html lang>` und Schreibrichtung auf Portugiesisch, damit der Screenreader richtig ausspricht.

An die API gehen nur die Texte der Oberfläche und die Texte der Studie. Keine Antwort, kein Name, keine E-Mail-Adresse und keine demografische Angabe geht mit, wie die Datenschutzerklärung sagt.

## Außerhalb des Umfangs

- Das Ergebnis-Dashboard trennt nicht nach Sprache. Um Sprachen zu vergleichen, verwenden Sie die Spalte `idioma` der Exporte.
- Die Dokumente im Reiter Dokumentation sind nur ins Englische, Spanische, Französische, Deutsche, Italienische, Chinesische und Japanische übersetzt (Übersetzung von Claude, ohne die API und noch ohne muttersprachliche Prüfung, in `docs/traducoes/`). In den anderen Sprachen der Oberfläche erscheinen sie auf Englisch, mit einem Hinweis. Die Diagramme sind in allen Sprachen auf Englisch.
