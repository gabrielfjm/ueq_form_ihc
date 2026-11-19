# Visuelle Identität

## Die Idee

Das Tool wirkt wie ein **Laborinstrument**, nicht wie ein SaaS. Denken Sie an ein technisches Formular, einen gut gesetzten Bericht, ein Messlineal. Weißer Hintergrund, dunkle Tinte, feine Linien, Tabellen, ausgerichtete Zahlen. Die einzige „Dekoration“ ist das Instrument selbst: Die Reihe der 7 Markierungen des semantischen Differentials erscheint als visuelles Motiv (im Logo, in der Fortschrittsanzeige, in leeren Zuständen).

Test für jeden Bildschirm: **Könnte ein Screenshot davon aus jeder beliebigen Dashboard-Vorlage stammen, machen Sie ihn neu.**

## Verboten

Das verrät sofort „von einer KI gemacht“. Auf keinem Bildschirm verwenden:

- Die Schriften Inter, Geist, Poppins, Montserrat, Roboto oder die Standardschrift des Systems als Hauptschrift
- Verläufe jeder Art, vor allem Violett/Blau/Rosa
- Glassmorphism, `backdrop-filter: blur`, Glanz, Neon, farbige Schatten
- Schatten auf Karten (großes, diffuses `box-shadow`). Trennung erfolgt durch eine 1px-Linie oder einen Wechsel des Hintergrunds
- `border-radius` über 4px. Keine Pillen, kein `rounded-2xl`
- Ein Raster aus Karten mit Icon + Titel + Zahl („KPI-Karten“) als Einstieg ins Dashboard
- Dekorative Icons: neben einem Abschnittstitel, in Listenelementen, in einem leeren Zustand. Icons erscheinen nur bei Aktionen (siehe „Icons“)
- Cremefarbener Hintergrund, Überschriften in Serifenschrift und Terrakotta als Akzent: Das ist zum Gesicht KI-generierter Oberflächen geworden (Entscheidung des Teams vom 22.10.2026)
- Nichtproportionale Schrift für Zahlen und Daten und Beschriftungen in Kapitälchen oder gesperrten Großbuchstaben: derselbe Grund. Die einzige Ausnahme ist der Codeblock in einem Dokument im Reiter Dokumentation (Befehle, Ordnerbaum), der Inhalt ist und ausgerichtete Spalten braucht
- Emojis in der Oberfläche, in Meldungen, in Toasts, in Commits
- Zentrierter Hero mit riesigem Titel, grauem Untertitel und zwei Schaltflächen
- Text mit Verlauf, „leuchtender“ Text, Einblendanimation überall (Fade-up in einer Liste)
- Skeleton mit Shimmer. Laden ist einfacher Text („Antworten werden geladen…“) oder nichts, wenn es schnell geht
- Dunkelmodus als Standard
- Ampelpalette (Grün/Gelb/Rot) für die Benchmark-Bereiche
- Startup-Microcopy: „Oops!“, „Tudo pronto! 🎉“, „Vamos começar?“, „Desbloqueie insights“, „de forma simples e intuitiva“, „potencialize“ (auf Deutsch etwa „Ups!“, „Alles fertig! 🎉“, „Los geht’s?“, „Schalten Sie Insights frei“, „einfach und intuitiv“, „boosten Sie“)

## Farben

Definiert in `src/styles/tokens.css`. Keine einzelne Hexadezimalfarbe in einer Komponente.

```css
:root {
  --fundo:          #FFFFFF;  /* fundo geral, campos de formulário */
  --fundo-faixa:    #F3F5F7;  /* faixa de cabeçalho, áreas recuadas */
  --fundo-painel:   #F8FAFB;  /* ficha lateral, painel do gráfico */
  --tinta:          #0F1720;  /* texto principal, botões primários */
  --tinta-suave:    #46525E;  /* texto secundário */
  --tinta-fraca:    #5B6672;  /* legendas, rótulos de eixo. 5.4:1 na faixa */
  --linha:          #D5DBE1;  /* réguas e divisórias de tabela. NUNCA borda de campo */
  --borda-campo:    #7A8691;  /* borda de input, select, textarea. 3.4:1 na faixa (WCAG 1.4.11) */
  --linha-forte:    #0F1720;

  --destaque:       #0B6A78;  /* azul-petróleo. Foco, link, item ativo, numeração de seção. Usar pouco */
  --destaque-fundo: #E6F2F4;  /* hover de controles, mensagem de status */

  --alerta:         #B42318;  /* erro, ação destrutiva, alfa baixo, resposta suspeita. Sempre com texto */
  --alerta-fundo:   #FEF3F2;

  /* escalas UEQ, agrupadas pelo construto */
  --atratividade:   #0F1720;  /* impressão geral, na cor da tinta */
  --pragmatica:     #1D4E89;  /* perspicuidade, eficiência, confiabilidade */
  --hedonica:       #9A5B00;  /* estimulação, novidade. ≥ 3:1 inclusive sobre a faixa mais escura do benchmark */

  /* faixas de benchmark: cinza-azulado, do mais escuro (excelente) ao mais claro (ruim) */
  --bench-excelente: #C7D0D9;
  --bench-bom:       #D5DCE3;
  --bench-acima:     #E1E6EB;
  --bench-abaixo:    #EBEFF2;
  --bench-ruim:      #F4F6F8;
}
```

Geprüfte Kontraste (WCAG 2.2): Tinte 18:1, sanfte Tinte 8:1, schwache Tinte 5,9:1, Akzent 6,3:1 und Warnung 6,6:1 auf weißem Hintergrund. Auf den Benchmark-Bereichen verwendet Text nur `--tinta` oder `--tinta-suave` (≥ 5,1:1). Ein automatisierter Test (`src/styles/__tests__/contraste.test.ts`) berechnet diese Paare aus tokens.css neu und schlägt fehl, wenn eines unter das Minimum fällt.

Akzent und Warnung haben getrennte Rollen: Das Petrolblau zeigt, wo die Nutzerin oder der Nutzer ist und was anklickbar ist; das Rot zeigt ein Problem oder eine Aktion, die Daten löscht. Nie das eine durch das andere ersetzen.

Auch `@media (forced-colors: active)` wird unterstützt: Kreise, Fokus und Markierungen des Diagramms verwenden `CanvasText`/`Highlight`, damit sie im Windows-Kontrastmodus nicht verschwinden.

Alles in dieser Datei ist `docs/ihc.md` untergeordnet. Steht eine ästhetische Entscheidung im Konflikt mit Barrierefreiheit oder Gebrauchstauglichkeit, gewinnt die der MCI.

Der Status einer Studie ist fett gedruckter Text mit einem 10px-Punkt davor, kein farbiges Badge: gefüllter Punkt in `--destaque` für geöffnet, hohler Punkt in `--tinta-fraca` für Entwurf, gefüllt in `--tinta` für beendet. Der Text nennt immer den Status; der Punkt verstärkt ihn nur.

## Typografie

Google Fonts über `next/font`:

- **Atkinson Hyperlegible Next** überall: Überschriften (Gewicht 700), Text der Oberfläche und Fragebogen (Gewicht 400). Sie wurde vom Braille Institute für Lesbarkeit entworfen, was an sich schon ein MCI-Argument ist (in der Präsentation erwähnenswert). Eine einzige Familie stärkt auch die Konsistenz (Nielsen 4)
- **Source Sans 3** für Zahlen (Tabellen, Mittelwerte, KI, Alpha, n, Daten, Zählungen), über `var(--fonte-numero)`, mit `font-variant-numeric: tabular-nums` und in Tabellen rechtsbündig. Die Atkinson hat eine durchgestrichene Null und breite Tabellenziffern, die nach Code aussehen; die Source Sans hat gewöhnliche, kompakte Ziffern. Damit auch einzelne Zahlen mitten im Text („60 anos ou mais“) in Source Sans erscheinen, ein `@font-face` mit `unicode-range: U+0030-0039` deklarieren, das vor der Atkinson im Schriftstapel auf sie zeigt. Keine nichtproportionale Schrift in der Oberfläche

Skala (rem): 0.8125 · 0.9375 · 1.0625 · 1.25 · 1.625 · 2.25. Fließtext in 1.0625rem, Zeilenabstand 1.5. Überschriften mit `letter-spacing: -0.015em`. Abschnitts- und Gruppenbeschriftungen fett, kleiner und in `--tinta-suave`, in normaler Schreibweise (weder Kapitälchen noch gesperrte Großbuchstaben).

## Layout

- Inhalt linksbündig, maximale Lesebreite ~72ch, Datenbereiche bis 1120px
- 8px-Raster. Großzügiger vertikaler Abstand zwischen Abschnitten (48 bis 64px), eng innerhalb von Tabellen
- Navigation der Forschenden: schmale obere Leiste mit dem Namen des Tools links und Links mit Icon und Text: Studien, Studie erstellen, Dokumentation, Verwaltung (nur für Administratoren), Mein Konto, die Benachrichtigungsglocke, der Sprachwähler und Abmelden. Keine Seitenleiste. Wer nicht angemeldet ist (Startseite und Dokumentation), sieht dieselbe Leiste nur mit Dokumentation, dem Sprachwähler und Anmelden (`log-in`); Konto erstellen (`user-plus`) steht auf der Startseite und im Fenster Anmelden. Der Link der Teilnehmenden hat gar keine Leiste
- Die Leiste bleibt während des ganzen Scrollens oben fixiert, am Computer und am Handy. Bis 56rem Breite liegen die Links hinter einer Schaltfläche Menü (`menu`, und `x` wenn geöffnet, immer mit dem Text „Menü“), damit die fixe Leiste nur eine Zeile belegt; das Menü öffnet die Links als Spalte direkt darunter und schließt mit Esc oder beim Seitenwechsel. Bei 320 px verlässt die Markierungsreihe des Logos die Leiste, damit Name und Menü hineinpassen
- Tabellen sind Bürger erster Klasse: Kopfzeile fett, Zeilen durch ein 1px-Lineal getrennt, Zahlen rechtsbündig
- Primäre Schaltfläche: Hintergrund `--tinta`, Text `--fundo`, Radius 2px, Höhe 40px. Sekundär: Rand 1px `--tinta`, transparenter Hintergrund. Destruktive Aktion: unterstrichener Text in `--alerta`, der ein Bestätigungsfenster öffnet (siehe „Fenster“)
- Fokus immer sichtbar: `outline: 2px solid var(--destaque); outline-offset: 2px`
- Kopfband in `--fundo-faixa` oben auf den Seiten der Studie, mit Titel, Status, Zusammenfassung und Reitern
- Breite Bildschirme der Forschenden verwenden zwei Spalten (Inhalt + seitlicher Steckbrief) statt einer schmalen Spalte mit leerer rechter Seite
- Startseite (`/`): stellt das Tool vor und ist der Bildschirm nach der Anmeldung. Linksbündiger Text mit dem Item des Fragebogens und einer Vorschau des Ergebnisses als Abbildung, Inhaltsverzeichnis „Auf dieser Seite“ und nummerierte Abschnitte: Was ist der UEQ, Wie man die Ergebnisse liest, Wie es funktioniert, Studien zur Methode und Danksagungen. Kein zentrierter Hero
- Optionsbereiche (Verwaltung und Mein Konto, Prototypen r24 und r9): ein Raster, in dem jede Option zu einer eigenen Seite führt oder ein Fenster öffnet, mit Titel, Beschreibung und Status in einer Zeile, statt alles auf einem Bildschirm zu stapeln. Die ganze Karte reagiert auf den Klick, bleibt aber für den Screenreader eine Liste mit Überschriften
- Dokumentation in Seiten (Prototypen r36 bis r38): Ein langes Dokument öffnet sich als Inhaltsverzeichnis, „In diesem Dokument“, mit dem Titel und dem ersten Satz jedes Abschnitts, und die lange Einleitung bleibt eingeklappt. Jeder Abschnitt öffnet sich auf einer eigenen Seite: kurzes Band mit Zurück, dem Breadcrumb, dem Titel und „7 von 8“, eine einzige Spalte, das Diagramm hervorgehoben und in den Bildschirm passend, und Zurück und Weiter am Ende. Ein Abschnitt mit 3 oder mehr Unterabschnitten wird zum Inhaltsverzeichnis, in zwei Spalten, wenn er mehr als 12 Einträge hat. Ein Dokument mit bis zu 4.000 Zeichen bleibt ganz
- Datenschutzerklärung (`/privacidade`, Prototyp r33): Band mit „Zurück“ oben und dem Kasten „Kurz gesagt“ daneben; darunter nummerierte Abschnitte in Zeilen aus Beschriftung und Erklärung mit einem Lineal dazwischen, wie die Bedingungen der Einwilligung, und der fixierte seitliche Steckbrief „Auf dieser Seite“. Das „Zurück“ sagt, wohin es führt, und erscheint auch am Ende der Seite. Wenn die Erklärung in einem anderen Tab geöffnet wurde, aus den Fenstern Anmelden und Konto erstellen, wird es zu „Diesen Tab schließen und zurückkehren“, damit nicht verloren geht, was die Person eingegeben hat
- Datenschutzerklärung im Link der Teilnehmenden (`/r/<slug>/privacidade`, Prototyp p9): derselbe Inhalt, geöffnet über einen Link am Ende der Einwilligungserklärung, ohne Leiste, ohne Icons und ohne Link zum Rest des Tools. Das „Zurück“ führt zur Einwilligungserklärung. Solange der Text nicht in die Sprache der Person übersetzt ist, weist ein Kasten in ihrer Sprache darauf hin, dass die Erklärung auf Portugiesisch erscheint

## Fenster

- Anmelden und Konto erstellen öffnen sich in einem Fenster über der Seite, auf der die Person gerade ist, mit dem Formular links und dem Bereich des Instruments rechts (die Bildschirme r1 und r2 im Fenster). Konto erstellen und Anmelden tauschen das Formular im selben Fenster. `/entrar` und `/cadastrar` zeigen die Startseite mit geöffnetem Fenster
- Das Zugangsfenster passt ganz auf den Bildschirm, ohne Scrollen: Die Maße schrumpfen mit der Höhe (Notebook mit 768 px), und bis 40rem Breite belegt es den ganzen Bildschirm, ohne den Bereich des Instruments (der nur mit dem Titel zurückkehrt, wenn der Bildschirm hoch ist)
- Abmelden und jede Löschung (Studie, Konto, Version der Studie) verlangen eine Bestätigung in einem schmalen Fenster: Titel als Frage („Diese Studie löschen?“), was passieren wird, Abbrechen und die Schaltfläche der Aktion. Bei Löschungen steht der Hinweis in `--alerta-fundo` mit Rand `--alerta`, das Bestätigungsfeld (eingegebener Titel oder E-Mail-Adresse) bleibt, und die Schaltfläche ist `--alerta`. Abmelden verwendet die primäre Schaltfläche, weil nichts gelöscht wird. Auf dem Handy stehen die Schaltflächen in einer Spalte, mit der Aktion oben
- Natives `<dialog>` mit `showModal()`: Fokus bleibt im Fenster, die Seite dahinter ist inaktiv und scrollt nicht, Esc und das `x` (Schließen) schließen, und der Fokus kehrt zum auslösenden Element zurück. Hintergrund der Seite mit `--tinta` zu 62 % abgedunkelt, Rand 1px `--linha-forte`, Radius 2px. Ohne Schatten oder Unschärfe
- Anfangsfokus: im ersten Feld (Anmelden, Konto erstellen, Löschungen) oder auf der Schaltfläche der Aktion, wenn es kein Feld gibt (Abmelden, Version entfernen)
- „Ohne Senden verlassen“ im Fragebogen der Teilnehmenden bestätigt ebenfalls in einem Fenster (Prototyp p8): Die Frage ist der Titel, „Weiter beantworten“ ist die primäre Schaltfläche und erhält zuerst den Fokus, und Esc setzt ebenfalls fort. Ohne Icon und ohne das `x`, wie alle Bildschirme der Teilnehmenden; die Texte kommen aus der gewählten Sprache
- Dokument in Vorbereitung (Prototyp r23): Solange die Datei nicht in der Liste `PRONTOS` in `src/lib/documentacao/catalogo.ts` steht, zeigt der Reiter Dokumentation dieselben Reiter und Unterreiter, die leere Markierungsreihe, „In Vorbereitung“ mit dem hohlen Punkt des Entwurfs und den Steckbrief mit dem, was das Dokument bringen wird, ohne Datei, Downloads oder Inhaltsverzeichnis. Der Überblick listet den Stand jedes Dokuments auf
- Website-Icon (`src/app/icon.svg` und `apple-icon.tsx`): drei Markierungen des semantischen Differentials, die letzte gefüllt, in Weiß auf `--destaque`
- Hilfe zur Seite (Prototyp r30): runde Schaltfläche (?) in der Kopfzeile jeder Seite der Forschenden, mit `aria-label`, die das mittlere Fenster öffnet. Es sagt, wozu die Seite dient und was man darauf tun kann, führt zur Datenschutzerklärung und bietet an, die Tour erneut anzusehen
- Teilen (Prototyp r25): mittleres Fenster mit den Personen, die Zugang haben, und der Einladung per E-Mail, mit der Wahl zwischen Bearbeiter und Leser

## Laufende Aktionen und Bestätigungen

- Jede Aktion, die an den Server geht, verwendet `BotaoEnvio` (Prototyp r39). Während sie läuft, sagt die Schaltfläche, was passiert („Studie wird erstellt…“), mit drehender Anzeige, erhält `aria-busy` und `aria-disabled` und ignoriert weitere Klicks, und der Rest des Formulars reagiert nicht mehr auf Klicks. Nichts wird doppelt gesendet
- Die Anzeige ist die einzige fortlaufende Animation des Tools und stoppt bei `prefers-reduced-motion`. Auf den Bildschirmen der Teilnehmenden gibt es weder Anzeige noch Icon: nur den Text „Bitte warten…“ in der Sprache der Person
- Jede abgeschlossene Aktion wird auf dem Bildschirm bestätigt (Prototyp r40): Kasten in `--destaque-fundo` mit Rand `--destaque`, in `role="status"`, möglichst mit dem Ergebnis („Studie erfolgreich erstellt.“). Er folgt dem Scrollen direkt unter der Leiste und bleibt, bis die Person ihn schließt. Ein Fehler einer Aktion verwendet `--alerta-fundo`, Rand `--alerta` und ein anderes Icon, damit er nicht wie eine Bestätigung aussieht
- Der über die Adresse übermittelte Hinweis (`?aviso=`) wird nach der Anzeige aus ihr entfernt: Neu laden bestätigt nicht noch einmal

## Glocke, Sprache und Tour

- Glocke (Prototyp r26): steht zwischen Mein Konto und dem Sprachwähler. Die ungelesenen Hinweise erscheinen in einem Zähler `--alerta` mit der Zahl als Text. Sie öffnet die neuesten Hinweise und führt zur Seite Benachrichtigungen (r27), auf der Einladungen direkt Annehmen und Ablehnen haben
- Sprachwähler (Prototyp r41): Abkürzung zu Mein Konto › Sprache, zwischen der Glocke und Abmelden (ohne Anmeldung zwischen Dokumentation und Anmelden). Am Computer zeigt er das Icon `languages` und das Kürzel der aktuellen Sprache („PT“), der vollständige Name bleibt für den Screenreader; im Handymenü erscheint „Idioma: Português“. Er öffnet sich wie die Glocke nach unten, ohne modal zu sein, mit den 37 Sprachen in ihrem eigenen Namen in drei Spalten und der aktuellen mit `check` markiert. Nur der Klick wechselt (WCAG 3.2.2), und die Seite bleibt dieselbe, schon in der neuen Sprache
- Geführte Tour (Prototypen r28 und r29): beginnt mit einem Begrüßungsfenster beim ersten Zugriff. Jeder Schritt hebt ein echtes Element des Bildschirms hervor, und eine Karte daneben erklärt es. In einem Teil der Schritte führt die Person die Aktion selbst aus, um weiterzukommen. Sie kann jederzeit übersprungen oder geschlossen und über die Hilfe erneut angesehen werden

## E-Mails

Einladung und Hinweise gehen mit derselben Identität hinaus: weißer Hintergrund, Band `--fundo-faixa`, dunkle Tinte, die Reihe der 7 Markierungen und Petrolblau nur bei Anklickbarem. Sie sind in Tabellen mit Inline-Stil gebaut, ohne Bilder, und enthalten die Version als reinen Text. Sie gehen in der Sprache der empfangenden Person hinaus (`src/lib/modelo-email.ts`).

## Icons

Lucide (`lucide-react`), Kontur 1,5 px, 18 px, in der Farbe des Textes daneben.

- Icons begleiten Text nur bei **Aktionen**: Schaltflächen, Aktionslinks, Hauptnavigation und Reiter. Der Text bleibt immer sichtbar; das Icon hat `aria-hidden="true"`
- Icon allein nur bei Schließen und Menü, mit `aria-label`. Ausnahme: Auf dem Handy zeigen die Zoom-Schaltflächen des Diagramms im Vollbild (`zoom-out`, `zoom-in`, `maximize`) nur das Icon, damit Zurück und der Zoom in eine Zeile passen; der Text (Verkleinern, Vergrößern, An Bildschirm anpassen) bleibt als zugänglicher Name und erscheint am Computer
- Eine destruktive Aktion verwendet das Icon in der Farbe `--alerta`, zusammen mit dem Text
- **Kein Icon auf den Bildschirmen der Teilnehmenden innerhalb des Fragebogens** (ihc.md, Abschnitt 3: jedes zusätzliche Element kann die Antwort beeinflussen)
- Zuordnung auf den Bildschirmen: Studien `folder`, Studie erstellen `plus`, Mein Konto `user`, Änderungen speichern `save`, Passwort ändern `lock`, Abmelden `log-out`, Anmelden `log-in`, Konto erstellen `user-plus`, Überblick `layout-dashboard`, Ergebnisse `bar-chart-3`, Antworten `list`, Link kopieren `copy`, Erhebung öffnen `play`, Erhebung beenden `square`, Wieder öffnen `rotate-ccw`, Bearbeiten `pencil`, Löschen `trash-2`, Exportieren `download`, Passwort anzeigen `eye`, Version hinzufügen `plus`, Entfernen `x`, Aus der Auswertung nehmen `minus-circle`, Statusmeldung `check-circle`, Dokumentation `book-open`, Auf GitHub ansehen und In Originalgröße öffnen `external-link`, Herunterladen `download`, Zurück `arrow-left`, Verwaltung und Datenschutzerklärung `shield-check`, Benachrichtigungen `bell`, Hilfe `circle-help`, Tour erneut ansehen `compass`, Sprache `languages`. Reiter der Dokumentation: Überblick `layout-dashboard`, Anforderungen `list-checks`, Nutzer `users`, Modellierung `shapes`, Architektur `layers`, Tests `flask-conical`, Spezifikation `file-text`
- Bewegung: nur ein 120ms-Übergang bei Farbe/Rand und die Anzeige einer laufenden Aktion. `prefers-reduced-motion` respektieren

## Schlüsselbildschirme

### Fragebogen der Teilnehmenden (`/r/[slug]`)
Der wichtigste Bildschirm. Hier zeigt das Team, dass es MCI versteht.

- Minimale Kopfzeile: Name des bewerteten Produkts und ein Anweisungssatz im Stil des offiziellen UEQ
- Einwilligungserklärung vorher, auf einer eigenen Seite, mit vollständigem Text, Link zur Datenschutzerklärung und der Schaltfläche „Ich stimme zu und möchte teilnehmen“. Keine versteckte Checkbox
- Die Einwilligungserklärung (Prototyp p1) listet nummeriert auf: Dauer, optionale Angaben (falls vorhanden), Teilnahme, nach dem Absenden, Anonymität, Nutzung der Daten, Risiken, Nutzen, verantwortliche Person und Ethikkommission (falls vorhanden). Der Untertitel nennt die Institution der Studie. Darunter „Datenschutzerklärung“ und „Eine Kopie dieser Einwilligungserklärung aufbewahren“ (Prototyp p10), die Frage „Wie alt sind Sie?“ und, bei „Jünger als 18“, die Bestätigung der Einwilligung der erziehungsberechtigten Person
- Items in Zeilen, eine pro Item, mit einem feinen Lineal dazwischen. Linker Begriff rechtsbündig, 7 Kreise in der Mitte, rechter Begriff linksbündig. Keine sichtbaren Zahlen
- Kreise mit einer Tippfläche von 44×44px, Kontur 1.5px `--tinta`, gefüllt mit `--tinta`, wenn markiert
- Tastatur: natives Verhalten von Optionsfeldern (Tab zwischen den Items, Pfeiltasten im Item). Keine Ein-Tasten-Kürzel, die mit dem Screenreader kollidieren (WCAG 2.1.4). Jedes Item ist ein `<fieldset>` mit `<legend>`, Details in `docs/ihc.md` Abschnitt 4.1
- Dezenter Link „Ohne Senden verlassen“ in der Fußzeile, der eine Bestätigung in einem Fenster verlangt (siehe „Fenster“)
- Handy (< 640px): Die beiden Begriffe stehen in einer Zeile über den 7 Kreisen, je einer an einem Ende
- Fortschritt: Text „14 von 26“ fest in der Fußzeile + die Reihe der 7 Markierungen als Icon. Kein farbiger Fortschrittsbalken
- Beim Absenden mit fehlendem Item: Fehlerzusammenfassung oben mit Link zu jedem Item („Noch 2 Begriffspaare offen: 7 und 19“), der Fokus geht zur Zusammenfassung, und jedes fehlende Item erhält einen linken Rand `--alerta` + den Text „Dieses Item wurde nicht beantwortet“
- `scroll-padding-bottom` gleich der Höhe der fixen Fußzeile, damit der Fokus nie verdeckt ist
- Ende: einfache Dankesseite in einem Kasten mit Hintergrund `--fundo-painel` und einem 3px-Balken `--destaque` links. Kein Konfetti. Die Hinweise auf einem einzigen Bildschirm (Link geschlossen, bereits beantwortet, verlassen) verwenden denselben Kasten
- Alle Schritte beginnen mit demselben Band `--fundo-faixa` wie die Einwilligung: Schritt („Schritt 2 von 3 · Fragebogen“) und Titel. In der Einwilligung und im Fragebogen hat das Band den Sprachwähler; ein Wechsel im Fragebogen führt zu ihm zurück, mit den im Entwurf gespeicherten Markierungen
- Offizielle UEQ-Anweisung in einem Kasten (`--fundo-painel`, Rand 1px `--linha`) über den Items, mit dem vollständigen Text und in der Reihenfolge des Sprachpakets
- Jedes Item zeigt links die Nummer in `--tinta-fraca`, um das Item zu finden, auf das die Fehlerzusammenfassung verweist; die Nummer steht auch in der Legende. Ein beantwortetes Item erhält links einen 3px-Balken `--destaque`, gleich bei jeder markierten Position; ein fehlendes Item denselben Balken in `--alerta` mit Hintergrund `--alerta-fundo`. Am Computer hellt sich die Zeile beim Überfahren mit der Maus auf (`--fundo-painel`), damit sich das Auge zwischen Begriff und Kreisen nicht verliert
- Kreise von 30px; der markierte ist ein Ring mit Mitte in `--tinta`, wie die Optionsfelder der optionalen Angaben
- Optionale Angaben: Jede Option ist eine ganze anklickbare Zeile mit Rand `--borda-campo`; die gewählte hat Rand `--tinta` und Hintergrund `--destaque-fundo`. Weiter und Diesen Schritt überspringen behalten dasselbe Gewicht

### Dashboard der Studie
Es beginnt mit einer **Zusammenfassungszeile in Text**, nicht mit Karten: „34 Antworten · 3 verdächtig · 31 in der Auswertung · Erhebung geöffnet seit 04.11.“.

Hauptdiagramm (eigenes SVG, `src/graficos/EscalasComBenchmark.tsx`):
- Eine horizontale Linie pro Skala, Achse von -3 bis +3
- Hinter jeder Linie die 5 Benchmark-Bereiche dieser Skala in graublauen Tönen, mit der Beschriftung des Bereichs
- Neutraler Bereich (-0,8 bis +0,8), markiert durch zwei gestrichelte senkrechte Linien und die Beschriftung „neutral“ oben
- Der Mittelwert ist ein Punkt (8px-Kreis in der Farbe des Konstrukts), das KI95 ist ein waagerechter Strich mit Enden
- Rechts vom Diagramm der Mittelwert in Tabellenziffern und der Benchmark-Bereich als Text
- Skalen gruppiert mit fetter Beschriftung: Attraktivität / Pragmatische Qualität / Hedonische Qualität

Darunter die vollständige Tabelle (n, Mittelwert, SD, KI95, Alpha, Bereich). Ein Alpha < 0,7 erscheint mit dem Wert in `--alerta` und einer Fußnote.

Diagramm pro Item: Liste der 26 Items mit den beiden Begriffen und einem Punkt an der Position des Mittelwerts (-3 bis +3), in offizieller Reihenfolge oder nach Skala gruppiert (umschaltbar).

Vergleich zwischen Versionen: dasselbe Skalendiagramm, mit einer Markierung pro Version (gefüllter und hohler Kreis oder Quadrat), Legende als Text darüber.

### Leere Zustände
Ohne Illustration. Ein direkter Satz und die Aktion. Beispiel: „Noch keine Antworten. Teilen Sie den Link der Studie, um die Erhebung zu beginnen.“ + kopierbarer Link in einem Feld mit Hintergrund `--fundo-painel` und der Schaltfläche „Link kopieren“.

## Ausnahmen

Die Startseite weicht von zwei Regeln des Abschnitts „Verboten“ ab: Das obere Band hat einen sanften radialen Verlauf, und Abbildungen und Karten haben einen Radius von 6 bis 8 px (`inicio.module.css`). Die Ausnahme ist gewollt und auf sie beschränkt: Die Startseite stellt den UEQ Personen vor, die das Tool noch nicht kennen, und die Arbeitsbildschirme folgen der Regel. Der Zähler der Glocke hat einen Radius von 10 px, das ist die Form der Zahl.

## Tonfall

Im Original brasilianisches Portugiesisch, kurze Sätze, Verb am Anfang der Schaltflächen („Criar estudo“, „Encerrar coleta“, „Exportar respostas“; auf Deutsch „Studie erstellen“, „Erhebung beenden“, „Antworten exportieren“). Es spricht eine forschende Person zu einer forschenden Person. Begriffe des UEQ mit dem offiziellen Namen (Perspicuidade, nicht „Clareza“). Datumsangaben als TT/MM/JJJJ, Zahlen mit Dezimalkomma.
