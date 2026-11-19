# Manuelle Checkliste für Gebrauchstauglichkeit und Barrierefreiheit

Was die Automatisierung nicht erreicht, zum eigenhändigen Prüfen vor jeder Abgabe. Jeder Block entspricht den [manuellen Testfällen](documentacao/casos-de-teste.md#casos-manuais). Markieren Sie in jeder Runde den Punkt in einer Kopie dieser Liste, notieren Sie das Problem und wer es behebt.

## Screenreader
NVDA + Firefox unter Windows, VoiceOver + Safari auf dem iPhone (oder TalkBack + Chrome unter Android).

- [ ] Den ganzen Fragebogen von Anfang bis Ende nur hörend ausfüllen, ohne auf den Bildschirm zu schauen
- [ ] Beim Betreten eines Items sagt der Screenreader die Nummer des Items, die beiden Begriffe und die Position an
- [ ] Der Fortschritt wird angesagt, ohne bei jedem Klick zu unterbrechen
- [ ] Beim unvollständigen Absenden sagt der Screenreader die Fehlerzusammenfassung an, und man kann zum fehlenden Item springen
- [ ] Im Dashboard wird das Diagramm mit der Beschreibung angesagt, und die Tabelle ist zellenweise mit vorgelesenem Kopf navigierbar
- [ ] Erfolgsmeldungen („Erhebung geöffnet“) werden angesagt, ebenso der Text „Studie wird erstellt…“ der Schaltfläche
- [ ] Die Fenster (Anmelden, Konto erstellen, Abmelden, Löschen, Teilen, Hilfe) sagen beim Öffnen den Titel an, halten den Fokus fest und geben ihn an das auslösende Element zurück
- [ ] Die Anzahl der Hinweise der Glocke wird angesagt, und eine Einladung lässt sich nur hörend annehmen
- [ ] Die geführte Tour ist nur hörend verständlich und lässt sich überspringen
- [ ] In der Datenschutzerklärung sagt das „Zurück“, wohin es führt, und der Link der Zugangsfenster weist darauf hin, dass er in einem neuen Tab öffnet. In echtem Chrome, Firefox und Safari schließt „Diesen Tab schließen und zurückkehren“ den Tab und gibt das Registrierungsfenster mit dem Eingegebenen zurück

## Tastatur
- [ ] Studie erstellen, Erhebung öffnen, den Fragebogen beantworten, Ergebnisse ansehen und exportieren, ohne die Maus zu berühren
- [ ] Fokus immer sichtbar und nie hinter der fixen Fußzeile versteckt
- [ ] Die Fokusreihenfolge ergibt auf allen Bildschirmen Sinn
- [ ] Tour, Glocke, Hilfe (?) und Teilen funktionieren ohne Maus; Esc schließt die Fenster
- [ ] In der Dokumentation funktionieren Inhaltsverzeichnis, Abschnitt, Zurück, Vorherige und Nächste ohne Maus, und das Diagramm erscheint ohne Scrollen

## Sehen
- [ ] Zoom von 200 % und 400 % im Browser: nichts wird abgeschnitten, nichts überlappt
- [ ] Breite von 320 px: kein horizontales Scrollen
- [ ] Simulation von Farbenblindheit (Chrome DevTools > Rendering > Emulate vision deficiencies): Protanopie, Deuteranopie, Tritanopie, Achromatopsie. Das Diagramm bleibt lesbar
- [ ] Windows-Kontrastmodus: Kreise des Fragebogens und Fokus sichtbar
- [ ] Das Bookmarklet für Textabstände (WCAG 1.4.12) bricht das Layout nicht

## Echtes Handy
- [ ] Den Link über WhatsApp öffnen und alles im Stehen mit dem Daumen beantworten
- [ ] Keine versehentliche Berührung des benachbarten Kreises
- [ ] Die Bildschirmtastatur verdeckt das fokussierte Feld bei den demografischen Angaben nicht
- [ ] Link der Teilnehmenden in einer Studie in einer anderen Sprache geöffnet, und in einer Sprache, die von rechts nach links geschrieben wird (Arabisch, Hebräisch oder Persisch)
- [ ] Datenschutzerklärung über die Einwilligungserklärung auf dem Handy geöffnet, und das „Zurück“ führt zurück zur Einwilligungserklärung

## Heuristische Evaluation (jede Person allein, danach zusammenführen)
Für jedes Problem: Bildschirm, verletzte Heuristik (Nielsen 1 bis 10), Schweregrad (0 bis 4), Vorschlag.

## Test mit Nutzenden
- [ ] 5 Teilnehmende beantworten eine echte Studie und denken dabei laut
- [ ] 2 bis 3 Forschende: Studie mit 2 Versionen erstellen, Erhebung öffnen, das Dashboard interpretieren, eine verdächtige Antwort ausschließen, in die offizielle Tabelle exportieren
- [ ] Erfolg, Zeit, Fehler und Kommentare festhalten
- [ ] Die Forschenden beantworten den UEQ über das Tool, mit dem Tool selbst
