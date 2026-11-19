# Grundlagen der MCI, angewandt auf das Tool

Diese Datei macht aus der Literatur der Mensch-Computer-Interaktion (MCI) prüfbare Anforderungen. Jede Entscheidung über die Oberfläche muss sich auf einen Grundsatz von hier zurückführen lassen. Wer einen Bildschirm umsetzt, prüft den Abschnitt „Anforderungen pro Bildschirm“ und die „WCAG-Checkliste“, bevor die Aufgabe als fertig gilt. Die Verbindung jeder Entscheidung mit dem Code und den Tests steht in den [Entscheidungen zur Oberfläche](rastreabilidade-ihc.md).

Konformitätsziel: **WCAG 2.2 Stufe AA** (W3C, 2023), die auch die Grundlage der **ABNT NBR 17225:2025** ist (Barrierefreiheit von Webinhalten und Webanwendungen). Das brasilianische Inklusionsgesetz (Gesetz 13.146/2015, Art. 63) macht die Barrierefreiheit von Websites in Brasilien verpflichtend.

## 1. Verwendete theoretische Grundlage

| Referenz | Was wir daraus übernommen haben |
|---|---|
| ISO 9241-11:2018 | Definition von Gebrauchstauglichkeit: Effektivität, Effizienz und Zufriedenheit für bestimmte Benutzer mit bestimmten Zielen in einem bestimmten Nutzungskontext. Deshalb definiert Abschnitt 2 Benutzer und Kontexte vor jedem Bildschirm |
| ISO 9241-110:2020 | 7 Interaktionsprinzipien: Aufgabenangemessenheit, Selbstbeschreibungsfähigkeit, Erwartungskonformität, Erlernbarkeit, Steuerbarkeit, Robustheit gegen Benutzungsfehler, Benutzerbindung |
| Nielsen (1994), 10 Heuristiken | Checkliste der vom Team durchgeführten heuristischen Evaluation |
| Shneiderman et al., 8 goldene Regeln | Konsistenz, universelle Gebrauchstauglichkeit, informative Rückmeldung, Dialoge mit Abschluss, Fehlervermeidung, einfache Umkehrbarkeit, Kontrolle durch den Benutzer, Verringerung der Gedächtnisbelastung |
| Norman (2013) | Affordances und Signifier, natürliches Mapping, Rückmeldung, Einschränkungen, konzeptuelles Modell |
| Fitts' Gesetz | Wichtige Ziele groß und nahe dort, wo Blick und Cursor bereits sind |
| Hick-Hyman-Gesetz | Wenige Optionen pro Entscheidung. Eine Hauptaktion pro Bildschirm |
| Gestalt (Nähe, Ähnlichkeit, gemeinsame Region) | Visuelle Gruppierung der UEQ-Skalen nach Konstrukt, Beschriftung nahe am Feld |
| WCAG 2.2 / NBR 17225 / eMAG | Prüfbare Anforderungen an die Barrierefreiheit (Abschnitt 5) |
| Laugwitz, Held und Schrepp (2008) und UEQ Handbook | Format des semantischen Differentials, offizielle Anweisung, feste Reihenfolge der Items |

## 2. Benutzer und Nutzungskontext (ISO 9241-11)

**Teilnehmende**
- Jede erwachsene Person. Kann wenig digitale Erfahrung haben, sehbehindert oder farbenblind sein, einen Screenreader verwenden (NVDA, VoiceOver, TalkBack), nur mit der Tastatur navigieren, mit 200 % Zoom oder mehr arbeiten
- Greift häufig über das Handy zu (Link per WhatsApp oder E-Mail erhalten)
- Hat kein Konto und keine intrinsische Motivation: Jede Reibung führt zum Abbruch
- Ziel: schnell antworten (3 bis 5 Minuten) und gehen
- Erfolgsmaß: hohe Abschlussquote, kein vergessenes Item, Dauer nahe der vom Handbuch vorgesehenen

**Forschende**
- Promovierende oder Forschende, kennen UX, aber nicht unbedingt die Statistik im Detail. Können im Team arbeiten und das Tool in jeder der 37 Sprachen lesen
- Verwenden den Desktop, in kurzen, wiederholten Sitzungen (öffnen das Dashboard während der Erhebung mehrmals)
- Ziel: die Studie fehlerfrei aufsetzen, die Erhebung verfolgen, das Ergebnis verstehen und für den Bericht exportieren
- Erfolgsmaß: legt ohne Hilfe eine vollständige Studie an, interpretiert das Dashboard richtig, prüft die Zahlen mit der offiziellen Tabelle

## 3. Der Fragebogen als Messinstrument

Hier trifft MCI auf Forschungsmethodik. Jede Verzerrung durch die Oberfläche verfälscht die Daten.

1. **Keine vorausgewählte Option.** Ein Standardwert erzeugt Ankereffekte und unbeabsichtigte Antworten
2. **Die 7 Positionen haben identisches visuelles Gewicht.** Gleiche Größe, gleiche Farbe, gleicher Abstand. Keine abgestufte Farbe (Rot → Grün), keine Zahl, keine Zwischenbeschriftung, keine hervorgehobene Mittelposition. Das bewahrt das validierte Format des semantischen Differentials
3. **Offizielle Reihenfolge und Polarität, immer.** Der Wechsel der Pole ist im UEQ beabsichtigt, um Zustimmungstendenz zu verringern. Die Oberfläche „ordnet“ die Pole nie um
4. **Offizielle UEQ-Anweisung** oben, im Wortlaut des Sprachpakets
5. **Identisches Layout für die 26 Items.** Ein Layoutwechsel zwischen Items verändert die Antwort
6. **Die teilnehmende Person sieht nie Ergebnisse** und nie den Mittelwert anderer Teilnehmender
7. **Abbrechen ist einfach und ausdrücklich möglich** (Ethik in der Forschung mit Menschen). Der Link „Ohne Senden verlassen“ ist immer verfügbar, mit Bestätigung in einem Fenster, und vor dem Absenden wird nichts in Antwort gespeichert
8. **Echte Anonymität.** Keine IP, kein Name, keine E-Mail-Adresse erheben. Demografie nur in Kategorien, immer mit „Keine Angabe“, und der ganze Schritt existiert nur, wenn die forschende Person die Erhebung in der Studie einschaltet

## 4. Anforderungen pro Bildschirm, mit dem begründenden Grundsatz

Format: Anforderung → Grundsatz (Quelle).

### 4.1 Fragebogen der Teilnehmenden

| Anforderung | Grundsatz |
|---|---|
| Jedes Item ist ein `<fieldset>` mit `<legend>`, das die beiden Begriffe enthält („Item 4 de 26: de fácil aprendizagem ou de difícil aprendizagem“, auf Deutsch etwa „Item 4 von 26: leicht zu lernen oder schwer zu lernen“). Die 7 Optionen sind gestaltete native `<input type="radio">`, keine `div` mit onClick | Name, Rolle, Wert (WCAG 4.1.2), Info und Beziehungen (1.3.1), Signifier (Norman) |
| Jedes Optionsfeld hat einen zugänglichen Namen mit der Position und dem nächstgelegenen Pol („3 von 7, näher an leicht zu lernen“). Position 4: „4 von 7, Mitte“ | Beschriftungen oder Anweisungen (3.3.2), Selbstbeschreibungsfähigkeit (ISO 9241-110) |
| Klickfläche jedes Kreises ≥ 44×44 px, auch wenn der gezeichnete Kreis kleiner ist. Abstand zwischen den Zielen, der das Berühren des Nachbarn verhindert | Zielgröße (WCAG 2.5.8 verlangt 24 px, wir verwenden die 44 px der Apple HIG/WCAG AAA 2.5.5), Fitts' Gesetz |
| Auch die Begriffe sind anklickbar: Ein Klick auf den linken Begriff markiert nichts (vermeidet versehentliche Antworten), aber die Begriffe stehen nahe an den Enden | Natürliches Mapping (Norman), Fehlervermeidung (Nielsen 5) |
| Das Markieren einer Option verschiebt weder den Fokus noch scrollt es die Seite von selbst | Bei Eingabe (WCAG 3.2.2), Kontrolle durch den Benutzer (Shneiderman 7) |
| Tastatur: Tab betritt die Gruppe, Pfeiltasten ändern die Option (natives Verhalten des Optionsfelds), Tab geht zum nächsten Item. Keine Ein-Tasten-Kürzel, die mit dem Screenreader kollidieren | Tastatur (2.1.1), keine Tastaturfalle (2.1.2), Erwartungskonformität (ISO 9241-110) |
| Fortschritt „14 von 26 beantwortet“ wird bei jeder Markierung aktualisiert und mit `aria-live="polite"` nur alle 5 Items und beim Abschluss angesagt (um den Screenreader nicht zu überladen) | Sichtbarkeit des Systemstatus (Nielsen 1), Statusmeldungen (4.1.3) |
| Die fixe Fortschrittsfußzeile verdeckt nie das fokussierte Item: `scroll-padding-bottom` gleich der Höhe der Fußzeile | Fokus nicht verdeckt (WCAG 2.4.11) |
| Validierung nur beim Absenden, nicht bei jedem Item. Fehler: Zusammenfassung oben mit Link zu jedem fehlenden Item („Noch 2 Begriffspaare offen: 7 und 19“), der Fokus geht zur Zusammenfassung, jedes fehlende Item erhält einen Rand und den Text „Dieses Item wurde nicht beantwortet“ (nicht nur Farbe) | Fehlererkennung (3.3.1), Fehlerempfehlung (3.3.3), Benutzung von Farbe (1.4.1), Nielsen 9 |
| Antworten werden während des Ausfüllens im sessionStorage gespeichert | Robustheit gegen Benutzungsfehler (ISO 9241-110), Shneiderman 6 |
| Kein Zeitlimit | Zeiteinteilung anpassbar (2.2.1) |
| Bei 320 px Breite und 400 % Zoom wird nichts abgeschnitten und nichts verlangt horizontales Scrollen. Auf dem Handy stehen die Begriffe über den Kreisen | Umbruch (1.4.10), Textgröße ändern (1.4.4) |
| Seite mit `lang` und `dir` der gewählten Sprache, `<title>` pro Schritt („Consentimento · Estudo X“, „Questionário · Estudo X“) | Sprache der Seite (3.1.1), Seite mit Titel (2.4.2) |
| Eine einzige Hauptaktion pro Seite (Ich stimme zu / Antworten senden) | Hick-Gesetz, minimalistisches Design (Nielsen 8) |
| Die Einwilligungserklärung hat einen Link zur Datenschutzerklärung, auf einer Seite innerhalb des Links der Teilnehmenden, ohne Weg zum Rest des Tools. Der Fragebogen selbst hat diesen Link nicht, um dem Instrument nichts hinzuzufügen | Transparenz (LGPD, Art. 9), Forschungsethik, §3 |
| Klare Schritte: Einwilligung → Fragebogen → Optionale Angaben → Ende, mit textlicher Angabe des aktuellen Schritts | Dialoge mit Abschluss (Shneiderman 4) |
| Die Einwilligungserklärung nennt die Dauer und dass es kein Limit gibt, wie man abbricht, was nach dem Absenden geschieht, wie lange die Daten aufbewahrt werden, Risiken, Nutzen und wer für die Forschung verantwortlich ist. Der Fragebogen wiederholt die Dauer über der Anweisung | Sichtbarkeit des Systemstatus (Nielsen 1), LGPD Art. 9 |
| Personen unter 18 Jahren nehmen nur teil, wenn sie die Einwilligung der erziehungsberechtigten Person bestätigen | LGPD Art. 14 |

### 4.2 Bildschirme der Forschenden

| Anforderung | Grundsatz |
|---|---|
| Link „Zum Inhalt springen“ als erstes fokussierbares Element | Blöcke umgehen (2.4.1) |
| Eine echte Überschriftenhierarchie (ein `h1` pro Seite, `h2` pro Abschnitt) | Überschriften und Beschriftungen (2.4.6), 1.3.1 |
| Formulare: sichtbare Beschriftung über dem Feld, verbunden über `for`/`id`, korrektes `autocomplete` (`email`, `current-password`, `new-password`, `name`) | 1.3.5, 3.3.2 |
| Die Anmeldung erlaubt das Einfügen des Passworts und Passwortmanager. Schaltfläche „Passwort anzeigen“ | Barrierefreie Authentifizierung (3.3.8) |
| Beim Erstellen einer Studie nicht erneut fragen, was schon gesagt wurde (der Name des Produkts wird zum Vorschlag für den Namen der ersten Version) | Redundante Eingabe (3.3.7) |
| Studie löschen: Bestätigung durch Eingabe des Titels, mit Anzeige, wie viele Antworten verloren gehen. Erhebung beenden ist umkehrbar (Wieder öffnen) | Fehlervermeidung (Nielsen 5, WCAG 3.3.4), einfache Umkehrbarkeit (Shneiderman 6) |
| Abmelden und jede Löschung bestätigen in einem Fenster (natives `<dialog>`), das sagt, was passieren wird, mit Abbrechen daneben. Fokus bleibt im Fenster, Esc schließt ohne Aktion, und der Fokus kehrt zum auslösenden Element zurück | Fehlervermeidung (Nielsen 5), Kontrolle durch den Benutzer (Nielsen 3), 2.1.2, 2.4.3, 3.3.4 |
| Anmelden und Konto erstellen öffnen sich in einem Fenster über der aktuellen Seite, ohne den Ort zu verlieren, und passen ohne Scrollen auf den Bildschirm | Kontrolle durch den Benutzer (Nielsen 3), Gedächtnisbelastung (Shneiderman 8), 1.4.10 |
| Jede Aktion gibt eine sichtbare und angesagte Rückmeldung: „Erhebung geöffnet. Der Link nimmt bereits Antworten an.“ in einer Region `role="status"`, die dem Scrollen folgt und bleibt, bis die Person sie schließt | Rückmeldung (Norman, Shneiderman 3), 4.1.3, 2.2.1 |
| Während die Aktion läuft, sagt die Schaltfläche, was passiert, und sperrt weitere Klicks, damit nichts doppelt gesendet wird | Sichtbarkeit des Systemstatus (Nielsen 1), Fehlervermeidung (Nielsen 5), 4.1.3 |
| Status der Studie ausgeschrieben, immer an derselben Stelle, mit der Folge („Geöffnet · nimmt Antworten an“) | Sichtbarkeit des Systemstatus (Nielsen 1) |
| Begriffe des UEQ mit offiziellem Namen und einer kurzen Erklärung, zugänglich über `<details>` („Was ist Durchschaubarkeit?“) | Übereinstimmung mit der realen Welt (Nielsen 2), Hilfe und Dokumentation (Nielsen 10), schrittweise Offenlegung |
| Dasselbe Muster für Schaltflächen, Tabellen und Meldungen auf allen Bildschirmen | Konsistenz (Nielsen 4, Shneiderman 1) |
| Keine Information hängt von Hover ab. Gibt es einen Tooltip, öffnet er sich auch beim Fokus, lässt sich mit Esc schließen und verschwindet nicht, wenn die Maus darüber bewegt wird | Inhalt bei Hover oder Fokus (1.4.13), Erkennen statt Erinnern (Nielsen 6) |

| Hilfe (?) auf jeder Seite der Forschenden: wozu die Seite dient und was man darauf tun kann | Hilfe und Dokumentation (Nielsen 10), Selbstbeschreibungsfähigkeit (ISO 9241-110) |
| Tour beim ersten Zugriff, auf den echten Bildschirmen, die übersprungen, geschlossen und erneut angesehen werden kann | Erlernbarkeit (ISO 9241-110), Kontrolle durch den Benutzer (Nielsen 3), Nielsen 10 |
| Glocke mit den ungelesenen Hinweisen als Zahl und Text, die Antworten zusammenfasst, solange der Hinweis ungelesen ist. Der Hinweis kann auch per E-Mail gehen, was sich unter Mein Konto ausschalten lässt | Sichtbarkeit des Systemstatus (Nielsen 1), Gedächtnisbelastung (Shneiderman 8), Kontrolle durch den Benutzer (Shneiderman 7) |
| Teilen sagt vor der Einladung, was jede Rolle tun darf (Bearbeiter, Leser). Wer eine Aktion nicht ausführen darf, sieht ihre Schaltfläche nicht | Fehlervermeidung (Nielsen 5), minimalistisches Design (Nielsen 8) |
| Verwaltung und Mein Konto als Bereiche: Jede Option nennt den aktuellen Stand und führt zu einer eigenen Seite | Erkennen statt Erinnern (Nielsen 6), Hick-Gesetz, schrittweise Offenlegung |
| Datenschutzerklärung einen Klick entfernt: in den Zugangsfenstern, auf der Startseite, unter Mein Konto und in der Hilfe. Das „Zurück“ sagt, wohin es führt, und die Erklärung öffnet sich in einem anderen Tab, wenn ein ausgefülltes Formular vorhanden ist | Kontrolle durch den Benutzer (Nielsen 3), Shneiderman 7, Transparenz (LGPD, Art. 9) |
| Oberfläche in der Sprache des Kontos, beim Anlegen des Kontos gewählt und unter Mein Konto geändert. `lang` und `dir` folgen der Sprache, in der der Bildschirm tatsächlich erscheint | Universelle Gebrauchstauglichkeit (Shneiderman 2), 3.1.1 |

Die Dokumentation folgt demselben Grundsatz der Belastung: Ein langes Dokument öffnet sich als Inhaltsverzeichnis, jeder Abschnitt auf einer eigenen Seite mit Zurück und Vorherige/Nächste, und das Diagramm passt auf den Bildschirm (schrittweise Offenlegung, Nielsen 3 und 8, WCAG 2.4.5 und 2.4.8).

### 4.3 Ergebnis-Dashboard und Diagramme

| Anforderung | Grundsatz |
|---|---|
| Jedes Diagramm hat `role="img"`, `<title>` und `<desc>` mit der Lesart als Text („Attraktivität: Mittelwert 1,42, KI von 1,10 bis 1,74, Bereich Gut“) und eine sichtbare gleichwertige Tabelle direkt darunter | Nicht-Text-Inhalt (1.1.1), 1.3.1 |
| Skalen werden durch Form und Position unterschieden, nicht nur durch Farbe. Versionen im Vergleich: gefüllter Kreis, hohler Kreis, Quadrat, zusätzlich zur Farbe | Benutzung von Farbe (1.4.1), mit simulierter Farbenblindheit getestet |
| Markierungen und Linien des Diagramms mit Kontrast ≥ 3:1 gegen den Hintergrund und gegen die Benchmark-Bereiche | Nicht-Text-Kontrast (1.4.11) |
| Benchmark-Bereiche mit Beschriftung als Text, nicht nur als Hintergrundton | 1.4.1 |
| Skalen gruppiert in Attraktivität / Pragmatisch / Hedonisch, mit Abstand und Gruppenbeschriftung | Gestalt (Nähe, gemeinsame Region), konzeptuelles Modell des UEQ |
| Die Interpretation steht schriftlich neben der Zahl („positiv“, „Gut im Benchmark“). Die forschende Person muss sich die Schwellenwerte nicht merken | Erkennen statt Erinnern (Nielsen 6), Shneiderman 8 |
| Hinweise auf niedriges Alpha und kleine Stichprobe erklären, was das bedeutet und was zu tun ist | Nielsen 9 und 10 |
| Filter und Vergleichsmodus spiegeln sich in der URL (man kann zurückgehen, neu laden und teilen) | Kontrolle und Freiheit (Nielsen 3) |
| Das Ausschließen von Antworten aus der Auswertung ist rückgängig zu machen, und das Dashboard zeigt, wie viele draußen sind | Shneiderman 6, Nielsen 1 |
| Demografische Daten in einem eigenen Unterreiter der Ergebnisse, jede Frage mit dem passenden Diagramm und der Zahlentabelle unter „Zahlen ansehen“ | Gestalt, 1.1.1, schrittweise Offenlegung |

### 4.4 Export
- Jeder Exportlink sagt Format, Inhalt und Zweck. Ein Download öffnet sich nicht ohne Hinweis in einem neuen Tab
- Lesbarer Dateiname mit Datum

## 5. WCAG-2.2-AA-Checkliste (die hier relevantesten Kriterien)

Die Tabelle sagt, wie das Tool jedes Kriterium erfüllt und was es belegt. axe-core läuft auf jedem Bildschirm und in jedem Fehlerzustand der End-to-End-Tests; was es nicht erreicht, steht in den manuellen Fällen ([manuelle Checkliste](checklist-manual.md)).

### Wahrnehmbar

| Kriterium | Wie das Tool es erfüllt | Beleg |
|---|---|---|
| 1.1.1 Diagramme und Icons mit Textalternative | Jedes Diagramm hat eine Beschreibung und eine sichtbare Tabelle mit denselben Zahlen; dekorative Icons liegen außerhalb des Barrierefreiheitsbaums | [CT-E29](documentacao/casos-de-teste.md#ct-e29), [CT-M05](documentacao/casos-de-teste.md#ct-m05) |
| 1.3.1 Semantische Struktur | Jedes Item des Fragebogens ist ein `fieldset` mit `legend`; Tabellen mit `th` und `scope`; Überschriften in Reihenfolge | [CT-E24](documentacao/casos-de-teste.md#ct-e24), [CT-E21](documentacao/casos-de-teste.md#ct-e21) und axe-core auf jedem Bildschirm |
| 1.3.2 Lesereihenfolge gleich der visuellen Reihenfolge | Das DOM folgt der Reihenfolge auf dem Bildschirm, auch von rechts nach links | [CT-E22](documentacao/casos-de-teste.md#ct-e22), [CT-E46](documentacao/casos-de-teste.md#ct-e46), [CT-M07](documentacao/casos-de-teste.md#ct-m07) |
| 1.3.5 `autocomplete` bei personenbezogenen Daten | Name, E-Mail-Adresse und Passwort haben `autocomplete` in Konto erstellen, Anmelden, Mein Konto und im Formular der Studie | axe-core in [CT-E06](documentacao/casos-de-teste.md#ct-e06), [CT-E09](documentacao/casos-de-teste.md#ct-e09) |
| 1.4.1 Nichts wird nur über Farbe vermittelt | Status, Bereiche und Versionen haben Text, Form oder Muster zusätzlich zur Farbe | [CT-E32](documentacao/casos-de-teste.md#ct-e32), [CT-M09](documentacao/casos-de-teste.md#ct-m09) |
| 1.4.3 Textkontrast ≥ 4,5:1 | Jedes Farbpaar für Text im Theme wird gemessen | [CT-U51](documentacao/casos-de-teste.md#ct-u51) |
| 1.4.4 200 % Zoom ohne Verlust | Die Bildschirme verwenden relative Einheiten und brechen um | [CT-M08](documentacao/casos-de-teste.md#ct-m08) |
| 1.4.10 Umbruch bei 320 px | Kein Bildschirm scrollt bei 320 px horizontal | [CT-E25](documentacao/casos-de-teste.md#ct-e25), [CT-E31](documentacao/casos-de-teste.md#ct-e31), [CT-E36](documentacao/casos-de-teste.md#ct-e36), [CT-E44](documentacao/casos-de-teste.md#ct-e44), [CT-E50](documentacao/casos-de-teste.md#ct-e50), [CT-E75](documentacao/casos-de-teste.md#ct-e75) |
| 1.4.11 Kontrast von Elementen ≥ 3:1 | Feldränder, Kreise, Fokus und Markierungen in Diagrammen werden gegen die Hintergründe gemessen | [CT-U52](documentacao/casos-de-teste.md#ct-u52) |
| 1.4.12 Textabstände | Das Layout verträgt line-height 1,5 und letter-spacing 0,12em | [CT-M11](documentacao/casos-de-teste.md#ct-m11) |
| 1.4.13 Inhalt bei Hover oder Fokus | Die Erklärungen der Begriffe öffnen sich per Klick (`details`), nicht per Hover | [CT-M07](documentacao/casos-de-teste.md#ct-m07) |

### Bedienbar

| Kriterium | Wie das Tool es erfüllt | Beleg |
|---|---|---|
| 2.1.1 und 2.1.2 Tastatur, ohne Tastaturfalle | Jeder Ablauf funktioniert nur mit der Tastatur; Fenster halten den Fokus fest und geben ihn beim Schließen zurück | [CT-E03](documentacao/casos-de-teste.md#ct-e03), [CT-E22](documentacao/casos-de-teste.md#ct-e22), [CT-E55](documentacao/casos-de-teste.md#ct-e55), [CT-E58](documentacao/casos-de-teste.md#ct-e58), [CT-E64](documentacao/casos-de-teste.md#ct-e64), [CT-M07](documentacao/casos-de-teste.md#ct-m07) |
| 2.2.1 Kein Zeitlimit | Kein Bildschirm hat ein Zeitlimit; der Fragebogen bewahrt das Markierte, wenn die Seite neu lädt | [CT-E26](documentacao/casos-de-teste.md#ct-e26) |
| 2.4.1 Inhalt überspringen | „Zum Inhalt springen“ ist das erste fokussierbare Element | [CT-E02](documentacao/casos-de-teste.md#ct-e02) |
| 2.4.2 Seitentitel | Jede Seite hat einen eigenen Titel, vom Speziellen zum Allgemeinen | [CT-E47](documentacao/casos-de-teste.md#ct-e47), [CT-E84](documentacao/casos-de-teste.md#ct-e84) |
| 2.4.3 Fokusreihenfolge | Nach einem Fehler geht der Fokus zur Zusammenfassung, und jeder Link der Zusammenfassung führt zum Feld | [CT-E07](documentacao/casos-de-teste.md#ct-e07), [CT-E23](documentacao/casos-de-teste.md#ct-e23) |
| 2.4.6 Aussagekräftige Überschriften und Beschriftungen | Beschriftungen sagen, was sie verlangen; Überschriften sagen, was der Abschnitt enthält | axe-core auf jedem Bildschirm und [CT-M13](documentacao/casos-de-teste.md#ct-m13) |
| 2.4.7 Sichtbarer Fokus | Fokusring mit einem Kontrast von 3:1 bei jedem Element | [CT-E22](documentacao/casos-de-teste.md#ct-e22), [CT-U52](documentacao/casos-de-teste.md#ct-u52) |
| 2.4.11 Fokus nicht verdeckt | Fixe obere Leiste und Fußzeile verdecken nie den Fokus oder die Anker | [CT-E54](documentacao/casos-de-teste.md#ct-e54) |
| 2.5.3 Name enthält den sichtbaren Text | Der zugängliche Name jeder Schaltfläche beginnt mit dem Text, der darauf steht | axe-core auf jedem Bildschirm |
| 2.5.8 Ziele ≥ 24 × 24 px | Jeder Kreis des Fragebogens hat 44 × 44 px | [CT-M12](documentacao/casos-de-teste.md#ct-m12) |

### Verständlich

| Kriterium | Wie das Tool es erfüllt | Beleg |
|---|---|---|
| 3.1.1 Sprache der Seite | `lang` und `dir` folgen der gewählten Sprache, auch bei nicht übersetzten Texten der Studie | [CT-E45](documentacao/casos-de-teste.md#ct-e45), [CT-E46](documentacao/casos-de-teste.md#ct-e46), [CT-U48](documentacao/casos-de-teste.md#ct-u48) |
| 3.2.1 und 3.2.2 Keine Kontextänderung von selbst | Ein Sprachwechsel gilt erst nach „Übernehmen“; kein Feld sendet beim Ändern | [CT-E46](documentacao/casos-de-teste.md#ct-e46), [CT-E68](documentacao/casos-de-teste.md#ct-e68) |
| 3.2.3 und 3.2.4 Konsistente Navigation | Dieselbe Leiste und dieselben Komponenten auf allen Bildschirmen | [CT-E53](documentacao/casos-de-teste.md#ct-e53), [CT-M18](documentacao/casos-de-teste.md#ct-m18) |
| 3.3.1 und 3.3.3 Fehler als Text, mit Empfehlung | Jeder Fehler sagt, was passiert ist und was zu tun ist, in der Zusammenfassung und am Feld | [CT-E06](documentacao/casos-de-teste.md#ct-e06), [CT-E14](documentacao/casos-de-teste.md#ct-e14), [CT-E23](documentacao/casos-de-teste.md#ct-e23), [CT-E43](documentacao/casos-de-teste.md#ct-e43) |
| 3.3.2 Sichtbare Beschriftungen | Jedes Feld hat eine sichtbare Beschriftung darüber | axe-core auf jedem Bildschirm |
| 3.3.4 Destruktive Aktionen bestätigt oder umkehrbar | Abmelden und Löschen verlangen eine Bestätigung; aus der Auswertung nehmen ist umkehrbar | [CT-E11](documentacao/casos-de-teste.md#ct-e11), [CT-E19](documentacao/casos-de-teste.md#ct-e19), [CT-E27](documentacao/casos-de-teste.md#ct-e27), [CT-E34](documentacao/casos-de-teste.md#ct-e34) |
| 3.3.7 Dieselbe Information nicht zweimal verlangen | Die neue Studie kommt mit der verantwortlichen Person aus dem Konto und der letzten Studie | [CT-E93](documentacao/casos-de-teste.md#ct-e93) |
| 3.3.8 Anmeldung ohne kognitiven Test | Kein Captcha; Einfügen des Passworts funktioniert und Passwort anzeigen schaltet die Sichtbarkeit um | [CT-E08](documentacao/casos-de-teste.md#ct-e08) |

### Robust

| Kriterium | Wie das Tool es erfüllt | Beleg |
|---|---|---|
| 4.1.2 Native Komponenten | Native Optionsfelder, Schaltflächen, `details` und `dialog`; ARIA nur dort, wo HTML es nicht löst | [CT-E24](documentacao/casos-de-teste.md#ct-e24), [CT-E57](documentacao/casos-de-teste.md#ct-e57) |
| 4.1.3 Statusmeldungen | Bestätigungen in `role="status"`, angesagt, ohne den Fokus zu verschieben | [CT-E09](documentacao/casos-de-teste.md#ct-e09), [CT-E16](documentacao/casos-de-teste.md#ct-e16), [CT-M06](documentacao/casos-de-teste.md#ct-m06) |

### Über AA hinaus

| Kriterium | Wie das Tool es erfüllt | Beleg |
|---|---|---|
| `prefers-reduced-motion` | Die Übergänge verschwinden, wenn das System weniger Bewegung verlangt | `src/app/globals.css` |
| `forced-colors` (Windows-Kontrastmodus) | Kreise, Fokus und Diagramme bleiben sichtbar | [CT-E32](documentacao/casos-de-teste.md#ct-e32), [CT-M10](documentacao/casos-de-teste.md#ct-m10) |
| Dunkles Theme | Gibt es nicht: Die visuelle Identität ist die eines Laborinstruments, auf hellem Hintergrund ([Visuelle Identität](design.md)) | — |
| Einfache Sprache im Fragebogen | Kurze Sätze, Aktiv, kein Fachjargon | [CT-M13](documentacao/casos-de-teste.md#ct-m13), [CT-M14](documentacao/casos-de-teste.md#ct-m14) |

## 6. Wie geprüft wird (Automatisierung reicht nicht)

Automatische Werkzeuge finden nur einen Teil der Barrierefreiheitsprobleme. Deshalb:

1. **Automatisch:** axe-core in Playwright auf allen Bildschirmen und in allen Fehlerzuständen, Kontrasttest der Tokens, E2E-Tests nur mit Tastatur, bei 320 px, mit simulierter Farbenblindheit und im Kontrastmodus
2. **Manuell (Team):** `docs/checklist-manual.md`, mit Screenreader, Zoom, echtem Handy und simulierter Farbenblindheit
3. **Heuristische Evaluation (Team):** Die drei bewerten getrennt mit den 10 Heuristiken von Nielsen und führen danach mit Schweregrad von 0 bis 4 zusammen
4. **Test mit Nutzenden:** 5 Teilnehmende außerhalb des Trios beantworten eine echte Studie im Tool (Aufgabe der Teilnehmenden), und 2 bis 3 Kolleginnen und Kollegen übernehmen die Rolle der Forschenden (Studie erstellen, Dashboard interpretieren, exportieren). Lautes Denken, Erfolgsquote, Zeit und Fehler. Am Ende bewerten die Forschenden das Tool selbst **mit dem UEQ, eingesetzt über das Tool**. Das schließt den Kreis und wird zur besten Folie der Präsentation

## 7. Referenzen

- ABNT. NBR 17225:2025. Acessibilidade em conteúdo e aplicações web: requisitos. 2025.
- BRASIL. Lei nº 13.146, de 6 de julho de 2015 (Lei Brasileira de Inclusão). Art. 63.
- BRASIL. eMAG: Modelo de Acessibilidade em Governo Eletrônico, versão 3.1.
- BRASIL. Lei nº 13.709, de 14 de agosto de 2018 (Lei Geral de Proteção de Dados Pessoais).
- ISO 9241-11:2018. Ergonomics of human-system interaction: Usability: Definitions and concepts.
- ISO 9241-110:2020. Ergonomics of human-system interaction: Interaction principles.
- NIELSEN, J. Enhancing the explanatory power of usability heuristics. CHI 1994.
- NORMAN, D. The Design of Everyday Things. Revised and expanded edition. Basic Books, 2013.
- SHNEIDERMAN, B. et al. Designing the User Interface. 6th ed. Pearson, 2016.
- W3C. Web Content Accessibility Guidelines (WCAG) 2.2. 2023.
- LAUGWITZ, B.; HELD, T.; SCHREPP, M. Construction and evaluation of a user experience questionnaire. USAB 2008.
- SCHREPP, M. User Experience Questionnaire Handbook. ueq-online.org.
