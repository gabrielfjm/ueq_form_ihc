# User Stories

**44 User Stories** beschreiben, was jede [Persona](personas.md) mit dem UEQ-Tool tun möchte und woran man erkennt, dass es geklappt hat. Alle 44 sind geliefert. Dieselbe Liste steht in [historias-de-usuario.csv](historias-de-usuario.csv) und in der [Anforderungstabelle](planilha-requisitos.xlsx).

## Wie zu lesen

Jede User Story folgt dem Format **Als** (wer), **möchte ich** (was), **damit** (warum), aus der Sicht der Persona geschrieben. Die **Akzeptanzkriterien** sagen, was im Tool geschehen muss, damit die User Story als fertig gilt: Jedes Kriterium lässt sich auf dem Bildschirm oder in einem Testfall prüfen.

Die User Story ist **geliefert**, wenn alle Anforderungen, die sie nennt, geliefert sind. Die Verbindung jeder Anforderung mit den User Stories, den Anwendungsfällen und den Tests steht in der [Rückverfolgbarkeitsmatrix](matriz-rastreabilidade.md).

| ID | Persona | User Story | Anforderungen | Status |
|---|---|---|---|---|
| [HU01](#hu01) | [PE01](personas.md#pe01) Marina | Konto erstellen und anmelden | [RF01](requisitos.md#rf01), [RF02](requisitos.md#rf02), [RF11](requisitos.md#rf11) | Geliefert |
| [HU02](#hu02) | [PE01](personas.md#pe01) Marina | Die Nutzung beim ersten Zugriff lernen | [RF09](requisitos.md#rf09), [RF10](requisitos.md#rf10) | Geliefert |
| [HU03](#hu03) | [PE01](personas.md#pe01) Marina | Eine Studie mit zwei Versionen erstellen | [RF13](requisitos.md#rf13), [RF19](requisitos.md#rf19) | Geliefert |
| [HU04](#hu04) | [PE01](personas.md#pe01) Marina | Angeben, wer für die Forschung verantwortlich ist | [RF13](requisitos.md#rf13), [RF25](requisitos.md#rf25) | Geliefert |
| [HU05](#hu05) | [PE01](personas.md#pe01) Marina | Entscheiden, ob ich demografische Daten erhebe | [RF18](requisitos.md#rf18), [RNF13](requisitos.md#rnf13), [RNF14](requisitos.md#rnf14) | Geliefert |
| [HU06](#hu06) | [PE01](personas.md#pe01) Marina | Die Erhebung öffnen und den Link verschicken | [RF15](requisitos.md#rf15), [RF16](requisitos.md#rf16), [RNF20](requisitos.md#rnf20) | Geliefert |
| [HU07](#hu07) | [PE01](personas.md#pe01) Marina | Die Erhebung verfolgen | [RF12](requisitos.md#rf12), [RF22](requisitos.md#rf22) | Geliefert |
| [HU08](#hu08) | [PE01](personas.md#pe01) Marina | Das Ergebnis verstehen, ohne Statistikerin zu sein | [RF38](requisitos.md#rf38), [RF43](requisitos.md#rf43), [RF44](requisitos.md#rf44), [RF45](requisitos.md#rf45), [RF49](requisitos.md#rf49), [RNF07](requisitos.md#rnf07), [RNF08](requisitos.md#rnf08) | Geliefert |
| [HU09](#hu09) | [PE01](personas.md#pe01) Marina | Sehen, welche Items die Skala beeinflusst haben | [RF41](requisitos.md#rf41), [RF46](requisitos.md#rf46) | Geliefert |
| [HU10](#hu10) | [PE01](personas.md#pe01) Marina | Die beiden Versionen vergleichen | [RF26](requisitos.md#rf26), [RF47](requisitos.md#rf47), [RF48](requisitos.md#rf48) | Geliefert |
| [HU11](#hu11) | [PE01](personas.md#pe01) Marina | Die Ergebnisse in die Masterarbeit übernehmen | [RF58](requisitos.md#rf58), [RF60](requisitos.md#rf60), [RNF22](requisitos.md#rnf22) | Geliefert |
| [HU12](#hu12) | [PE01](personas.md#pe01) Marina | Nachlässige Antworten aus der Auswertung nehmen | [RF42](requisitos.md#rf42), [RF51](requisitos.md#rf51), [RF52](requisitos.md#rf52), [RF53](requisitos.md#rf53), [RF54](requisitos.md#rf54) | Geliefert |
| [HU13](#hu13) | [PE01](personas.md#pe01) Marina | Das Profil der Antwortenden sehen | [RF50](requisitos.md#rf50) | Geliefert |
| [HU14](#hu14) | [PE01](personas.md#pe01) Marina | Die Erhebung beenden und wieder öffnen | [RF15](requisitos.md#rf15) | Geliefert |
| [HU15](#hu15) | [PE01](personas.md#pe01) Marina | Die Studie nach dem Erstellen korrigieren | [RF14](requisitos.md#rf14) | Geliefert |
| [HU16](#hu16) | [PE01](personas.md#pe01) Marina | Eine Teststudie löschen | [RF17](requisitos.md#rf17), [RNF21](requisitos.md#rnf21) | Geliefert |
| [HU17](#hu17) | [PE01](personas.md#pe01) Marina | Mich um meine Kontodaten kümmern | [RF04](requisitos.md#rf04), [RF06](requisitos.md#rf06), [RF07](requisitos.md#rf07), [RNF19](requisitos.md#rnf19) | Geliefert |
| [HU18](#hu18) | [PE02](personas.md#pe02) Ricardo | Die Zahlen in der offiziellen Tabelle prüfen | [RF36](requisitos.md#rf36), [RF37](requisitos.md#rf37), [RF59](requisitos.md#rf59), [RNF09](requisitos.md#rnf09), [RNF11](requisitos.md#rnf11) | Geliefert |
| [HU19](#hu19) | [PE02](personas.md#pe02) Ricardo | Auf Papier erhobene Antworten zusammenführen | [RF61](requisitos.md#rf61) | Geliefert |
| [HU20](#hu20) | [PE02](personas.md#pe02) Ricardo | Die Studie der Betreuten verfolgen | [RF20](requisitos.md#rf20), [RF21](requisitos.md#rf21), [RNF17](requisitos.md#rnf17) | Geliefert |
| [HU21](#hu21) | [PE02](personas.md#pe02) Ricardo | Erfahren, was sich in den Studien geändert hat | [RF22](requisitos.md#rf22), [RF23](requisitos.md#rf23) | Geliefert |
| [HU22](#hu22) | [PE02](personas.md#pe02) Ricardo | Das Konto an einem gemeinsam genutzten Computer schützen | [RF03](requisitos.md#rf03), [RF05](requisitos.md#rf05), [RNF15](requisitos.md#rnf15), [RNF16](requisitos.md#rnf16), [RNF18](requisitos.md#rnf18) | Geliefert |
| [HU23](#hu23) | [PE02](personas.md#pe02) Ricardo | Die Antworten für eine andere Auswertung exportieren | [RF56](requisitos.md#rf56), [RF57](requisitos.md#rf57), [RNF22](requisitos.md#rnf22) | Geliefert |
| [HU24](#hu24) | [PE02](personas.md#pe02) Ricardo | Die Regel hinter jeder Zahl kennen | [RF37](requisitos.md#rf37), [RF38](requisitos.md#rf38), [RF39](requisitos.md#rf39), [RF40](requisitos.md#rf40) | Geliefert |
| [HU25](#hu25) | [PE02](personas.md#pe02) Ricardo | Die Kurzfassung auf Veranstaltungen einsetzen | [RF62](requisitos.md#rf62) | Geliefert |
| [HU26](#hu26) | [PE03](personas.md#pe03) Kenji | Das Tool auf Japanisch verwenden | [RF08](requisitos.md#rf08) | Geliefert |
| [HU27](#hu27) | [PE03](personas.md#pe03) Kenji | Die Studie auf Japanisch durchführen | [RF19](requisitos.md#rf19), [RF34](requisitos.md#rf34), [RF35](requisitos.md#rf35) | Geliefert |
| [HU28](#hu28) | [PE04](personas.md#pe04) Célia | Die Einladung verstehen, bevor ich zustimme | [RF25](requisitos.md#rf25), [RNF19](requisitos.md#rnf19) | Geliefert |
| [HU29](#hu29) | [PE04](personas.md#pe04) Célia | Schnell auf dem Handy antworten | [RF24](requisitos.md#rf24), [RF27](requisitos.md#rf27), [RF28](requisitos.md#rf28), [RNF02](requisitos.md#rnf02), [RNF05](requisitos.md#rnf05), [RNF06](requisitos.md#rnf06), [RNF23](requisitos.md#rnf23) | Geliefert |
| [HU30](#hu30) | [PE04](personas.md#pe04) Célia | Wissen, was ich vergessen habe | [RF29](requisitos.md#rf29) | Geliefert |
| [HU31](#hu31) | [PE04](personas.md#pe04) Célia | Nicht verlieren, was ich markiert habe | [RF30](requisitos.md#rf30) | Geliefert |
| [HU32](#hu32) | [PE04](personas.md#pe04) Célia | Abbrechen, ohne Spuren zu hinterlassen | [RF31](requisitos.md#rf31), [RNF21](requisitos.md#rnf21) | Geliefert |
| [HU33](#hu33) | [PE04](personas.md#pe04) Célia | Die Fragen über mich überspringen | [RF32](requisitos.md#rf32), [RNF12](requisitos.md#rnf12) | Geliefert |
| [HU34](#hu34) | [PE04](personas.md#pe04) Célia | Wissen, dass es vorbei ist | [RF33](requisitos.md#rf33) | Geliefert |
| [HU35](#hu35) | [PE05](personas.md#pe05) Tiago | Mit dem Screenreader antworten | [RF27](requisitos.md#rf27), [RNF01](requisitos.md#rnf01), [RNF03](requisitos.md#rnf03), [RNF04](requisitos.md#rnf04) | Geliefert |
| [HU36](#hu36) | [PE06](personas.md#pe06) Amira | Auf Arabisch antworten | [RF34](requisitos.md#rf34), [RNF10](requisitos.md#rnf10) | Geliefert |
| [HU37](#hu37) | [PE07](personas.md#pe07) Bruna | Mit Einwilligung der Erziehungsberechtigten teilnehmen | [RF25](requisitos.md#rf25) | Geliefert |
| [HU38](#hu38) | [PE08](personas.md#pe08) Lucas | Das Tool lokal ausführen | [RNF24](requisitos.md#rnf24) | Geliefert |
| [HU39](#hu39) | [PE08](personas.md#pe08) Lucas | Einen Schwellenwert ändern und neu berechnen | [RF55](requisitos.md#rf55) | Geliefert |
| [HU40](#hu40) | [PE08](personas.md#pe08) Lucas | Beweisen, dass die Berechnung nicht kaputt ist | [RNF25](requisitos.md#rnf25), [RNF26](requisitos.md#rnf26) | Geliefert |
| [HU41](#hu41) | [PE08](personas.md#pe08) Lucas | Die Konten des Labors verwalten | [RF66](requisitos.md#rf66), [RNF17](requisitos.md#rnf17) | Geliefert |
| [HU42](#hu42) | [PE08](personas.md#pe08) Lucas | Das Tool ohne echte Daten vorführen | [RF67](requisitos.md#rf67) | Geliefert |
| [HU43](#hu43) | [PE08](personas.md#pe08) Lucas | Den Schutz und die Übersetzungen prüfen | [RF68](requisitos.md#rf68), [RNF14](requisitos.md#rnf14) | Geliefert |
| [HU44](#hu44) | [PE08](personas.md#pe08) Lucas | Die Dokumentation ohne Konto lesen | [RF63](requisitos.md#rf63), [RF64](requisitos.md#rf64), [RF65](requisitos.md#rf65) | Geliefert |

## Forschende

### HU01

**Konto erstellen und anmelden**

Als **Marina**, Forscherin ([PE01](personas.md#pe01)), **möchte ich** ein Konto erstellen und mich anmelden, ohne ein Handbuch zu lesen, **damit** ich noch am selben Tag mit dem Aufbau meiner Studie beginnen kann.

Akzeptanzkriterien:

1. Die Passwortregeln erscheinen, bevor ich tippe.
2. Ist ein Feld falsch, sagt eine Zusammenfassung oben, welches, und führt dorthin.
3. Anmelden und Konto erstellen öffnen sich in einem Fenster über der Startseite, und Esc schließt es und gibt den Fokus zurück.
4. Nach der Anmeldung kehre ich zu der Seite zurück, die ich angefordert hatte.

Anforderungen: [RF01](requisitos.md#rf01), [RF02](requisitos.md#rf02), [RF11](requisitos.md#rf11). Status: Geliefert.

### HU02

**Die Nutzung beim ersten Zugriff lernen**

Als **Marina**, Forscherin ([PE01](personas.md#pe01)), **möchte ich** beim ersten Mal durch die Bildschirme geführt werden und auf jeder Seite Hilfe haben, **damit** ich nicht an einem Bildschirm hängen bleibe, den ich nicht verstehe.

Akzeptanzkriterien:

1. Beim ersten Zugriff zeigt eine Tour die Aktionen auf den echten Bildschirmen, und ich komme weiter, indem ich die Aktion ausführe.
2. Ich kann die Tour überspringen oder schließen und später über die Hilfe erneut ansehen.
3. Jede Seite der Forschenden hat ein (?), das die Seite selbst erklärt.

Anforderungen: [RF09](requisitos.md#rf09), [RF10](requisitos.md#rf10). Status: Geliefert.

### HU03

**Eine Studie mit zwei Versionen erstellen**

Als **Marina**, Forscherin ([PE01](personas.md#pe01)), **möchte ich** die Studie mit den zwei Versionen der App anlegen, **damit** ich die aktuelle mit der neuen Version in derselben Studie vergleichen kann.

Akzeptanzkriterien:

1. Ich gebe Titel, Produkt, Ziel, Zeitraum und die Versionen an.
2. Der Name des Produkts schlägt den Namen der ersten Version vor.
3. Fehler erscheinen in einer Zusammenfassung mit einem Link zu jedem Feld, und nichts geht verloren.
4. Die Studie entsteht als Entwurf und nimmt keine Antworten an.

Anforderungen: [RF13](requisitos.md#rf13), [RF19](requisitos.md#rf19). Status: Geliefert.

### HU04

**Angeben, wer für die Forschung verantwortlich ist**

Als **Marina**, Forscherin ([PE01](personas.md#pe01)), **möchte ich** in der Einwilligungserklärung sagen, wer ich bin, wie man mich erreicht, und die Risiken und den Nutzen nennen, **damit** ich die Forschungsethik einhalte und den Antwortenden Vertrauen gebe.

Akzeptanzkriterien:

1. Name, Kontakt-E-Mail und Institution sind aus meinem Konto vorausgefüllt und Pflichtfelder.
2. Risiken und Nutzen kommen mit einem vorgeschlagenen Text, den ich ändern kann.
3. Die Ethikkommission ist optional und erscheint in der Einwilligungserklärung, wenn sie angegeben ist.
4. Ich sehe die Vorschau der Einwilligungserklärung der Teilnehmenden neben dem Formular.

Anforderungen: [RF13](requisitos.md#rf13), [RF25](requisitos.md#rf25). Status: Geliefert.

### HU05

**Entscheiden, ob ich demografische Daten erhebe**

Als **Marina**, Forscherin ([PE01](personas.md#pe01)), **möchte ich** für jede Studie wählen, ob der Link nach Altersgruppe, Geschlecht, Bildungsabschluss und Vertrautheit fragt, **damit** ich nur erhebe, was meine Forschung braucht.

Akzeptanzkriterien:

1. Die demografische Erhebung ist standardmäßig ausgeschaltet.
2. Wenn ich sie einschalte, weist die Einwilligungserklärung darauf hin und die geschätzte Dauer steigt.
3. Die demografischen Daten werden in der Datenbank verschlüsselt.

Anforderungen: [RF18](requisitos.md#rf18), [RNF13](requisitos.md#rnf13), [RNF14](requisitos.md#rnf14). Status: Geliefert.

### HU06

**Die Erhebung öffnen und den Link verschicken**

Als **Marina**, Forscherin ([PE01](personas.md#pe01)), **möchte ich** die Erhebung öffnen und den Link mit einem Klick kopieren, **damit** ich ihn in die WhatsApp-Gruppe der Patientinnen und Patienten schicken kann.

Akzeptanzkriterien:

1. Erhebung öffnen bestätigt in einer Meldung, was sich geändert hat: „Erhebung geöffnet. Der Link nimmt bereits Antworten an.“
2. Link kopieren kopiert und sagt an, dass kopiert wurde, auch über die Tastatur.
3. Der Link ist kurz, und der einer anderen Studie lässt sich nicht erraten.

Anforderungen: [RF15](requisitos.md#rf15), [RF16](requisitos.md#rf16), [RNF20](requisitos.md#rnf20). Status: Geliefert.

### HU07

**Die Erhebung verfolgen**

Als **Marina**, Forscherin ([PE01](personas.md#pe01)), **möchte ich** sehen, wie viele Personen schon geantwortet haben und wann die letzte Antwort kam, **damit** ich weiß, ob ich den Link stärker verbreiten muss.

Akzeptanzkriterien:

1. Die Liste der Studien zeigt Antworten und letzte Antwort jeder Studie.
2. Die Glocke informiert über neue Antworten, zusammengefasst, solange ich sie nicht gelesen habe.

Anforderungen: [RF12](requisitos.md#rf12), [RF22](requisitos.md#rf22). Status: Geliefert.

### HU08

**Das Ergebnis verstehen, ohne Statistikerin zu sein**

Als **Marina**, Forscherin ([PE01](personas.md#pe01)), **möchte ich** das Ergebnis mit der schriftlichen Interpretation neben jeder Zahl lesen, **damit** ich weiß, ob die neue Version besser ist, ohne Expertin zu werden.

Akzeptanzkriterien:

1. Ein Satz oben fasst das Ergebnis zusammen.
2. Jede Skala zeigt Mittelwert, KI95, Alpha, Interpretation und Benchmark-Bereich, im Diagramm und in einer Tabelle.
3. Die Fachbegriffe haben eine kurze Erklärung, die sich direkt dort öffnet.
4. Bei niedrigem Alpha oder kleiner Stichprobe sagt ein Hinweis, was das bedeutet und was zu tun ist.
5. Das Diagramm bleibt lesbar, ohne von Farbe abzuhängen.

Anforderungen: [RF38](requisitos.md#rf38), [RF43](requisitos.md#rf43), [RF44](requisitos.md#rf44), [RF45](requisitos.md#rf45), [RF49](requisitos.md#rf49), [RNF07](requisitos.md#rnf07), [RNF08](requisitos.md#rnf08). Status: Geliefert.

### HU09

**Sehen, welche Items die Skala beeinflusst haben**

Als **Marina**, Forscherin ([PE01](personas.md#pe01)), **möchte ich** den Mittelwert jedes der 26 Items sehen, **damit** ich in der Masterarbeit erklären kann, warum eine Skala niedrig ausgefallen ist.

Akzeptanzkriterien:

1. Das Diagramm zeigt jedes Item zwischen seinen beiden Begriffen.
2. Ich kann es in offizieller Reihenfolge oder nach Skala gruppiert ansehen.

Anforderungen: [RF41](requisitos.md#rf41), [RF46](requisitos.md#rf46). Status: Geliefert.

### HU10

**Die beiden Versionen vergleichen**

Als **Marina**, Forscherin ([PE01](personas.md#pe01)), **möchte ich** die Versionen nebeneinander im selben Diagramm sehen, **damit** ich sagen kann, auf welchen Skalen die neue Version gewonnen hat.

Akzeptanzkriterien:

1. Jede teilnehmende Person landet in der Version mit den wenigsten Antworten, sodass die Gruppen ähnlich bleiben.
2. Jede Version hat eine Markierung mit anderer Form, und ein Satz nennt die größten Unterschiede.
3. Version und Modus stehen in der Adresse: Neu laden oder den Link verschicken behält dieselbe Ansicht.

Anforderungen: [RF26](requisitos.md#rf26), [RF47](requisitos.md#rf47), [RF48](requisitos.md#rf48). Status: Geliefert.

### HU11

**Die Ergebnisse in die Masterarbeit übernehmen**

Als **Marina**, Forscherin ([PE01](personas.md#pe01)), **möchte ich** die Tabelle pro Skala und das Dashboard als PDF herunterladen, **damit** ich sie in den Text übernehmen kann, ohne Diagramme neu zu erstellen.

Akzeptanzkriterien:

1. Die CSV-Datei pro Skala öffnet sich im portugiesischen Excel mit Dezimalkomma.
2. Das PDF enthält Titel der Studie, n und Datum in der Kopfzeile.

Anforderungen: [RF58](requisitos.md#rf58), [RF60](requisitos.md#rf60), [RNF22](requisitos.md#rnf22). Status: Geliefert.

### HU12

**Nachlässige Antworten aus der Auswertung nehmen**

Als **Marina**, Forscherin ([PE01](personas.md#pe01)), **möchte ich** sehen, welche Antworten nachlässig wirken, und sie aus der Berechnung nehmen, **damit** Personen, die zufällig geantwortet haben, das Ergebnis nicht verzerren.

Akzeptanzkriterien:

1. Das Tool markiert als verdächtig, wer 3 oder mehr inkonsistente Skalen oder mehr als 15 gleiche Antworten hat.
2. Ich sehe den Grund und die Spannweite jeder Skala der teilnehmenden Person.
3. Ich nehme sie einzeln heraus und hole sie zurück, oder alle verdächtigen auf einmal, ohne etwas zu löschen.
4. Die Zahlen des Dashboards verwenden dann nur die, die in der Auswertung sind.

Anforderungen: [RF42](requisitos.md#rf42), [RF51](requisitos.md#rf51), [RF52](requisitos.md#rf52), [RF53](requisitos.md#rf53), [RF54](requisitos.md#rf54). Status: Geliefert.

### HU13

**Das Profil der Antwortenden sehen**

Als **Marina**, Forscherin ([PE01](personas.md#pe01)), **möchte ich** die Verteilung der demografischen Antworten sehen, **damit** ich die Stichprobe in der Masterarbeit beschreiben kann.

Akzeptanzkriterien:

1. Jede Frage erscheint in einem Diagramm mit der Tabelle der Zahlen.
2. Ich kann nach Version filtern.
3. Keine Angabe und übersprungene Antworten erscheinen getrennt.

Anforderungen: [RF50](requisitos.md#rf50). Status: Geliefert.

### HU14

**Die Erhebung beenden und wieder öffnen**

Als **Marina**, Forscherin ([PE01](personas.md#pe01)), **möchte ich** die Erhebung am Ende des Zeitraums beenden und bei Bedarf wieder öffnen, **damit** keine Antworten mehr eingehen, ohne die vorhandenen zu verlieren.

Akzeptanzkriterien:

1. Nach dem Beenden erklärt der Link, dass die Erhebung zu Ende ist.
2. Wieder öffnen nimmt wieder Antworten an.

Anforderungen: [RF15](requisitos.md#rf15). Status: Geliefert.

### HU15

**Die Studie nach dem Erstellen korrigieren**

Als **Marina**, Forscherin ([PE01](personas.md#pe01)), **möchte ich** die Daten und die Versionen bearbeiten, **damit** ich einen Tippfehler beheben oder eine Version hinzufügen kann.

Akzeptanzkriterien:

1. Die Änderungen werden gespeichert, und eine Meldung bestätigt sie.
2. Bei geöffneter Erhebung kann ich keine Version entfernen, die schon Antworten hat.

Anforderungen: [RF14](requisitos.md#rf14). Status: Geliefert.

### HU16

**Eine Teststudie löschen**

Als **Marina**, Forscherin ([PE01](personas.md#pe01)), **möchte ich** die Studie löschen, die ich zum Testen angelegt habe, **damit** meine Liste aufgeräumt bleibt.

Akzeptanzkriterien:

1. Das Fenster sagt, wie viele Antworten mitgelöscht werden.
2. Gelöscht wird erst, nachdem ich den Titel der Studie eingegeben habe.

Anforderungen: [RF17](requisitos.md#rf17), [RNF21](requisitos.md#rnf21). Status: Geliefert.

### HU17

**Mich um meine Kontodaten kümmern**

Als **Marina**, Forscherin ([PE01](personas.md#pe01)), **möchte ich** meine Daten ändern, herunterladen, was das Tool über mich speichert, und das Konto löschen, **damit** ich meine Rechte nach der LGPD ausüben kann, ohne jemanden fragen zu müssen.

Akzeptanzkriterien:

1. Ich ändere Name und E-Mail-Adresse unter Mein Konto; die E-Mail-Adresse eines anderen Kontos wird abgelehnt.
2. Meine Daten herunterladen liefert ein JSON mit dem Konto, ohne das Passwort.
3. Konto löschen verlangt meine E-Mail-Adresse und löscht meine Studien mit.
4. Die Datenschutzerklärung erklärt, was gespeichert wird und warum.

Anforderungen: [RF04](requisitos.md#rf04), [RF06](requisitos.md#rf06), [RF07](requisitos.md#rf07), [RNF19](requisitos.md#rnf19). Status: Geliefert.

### HU18

**Die Zahlen in der offiziellen Tabelle prüfen**

Als **Ricardo**, Betreuer ([PE02](personas.md#pe02)), **möchte ich** die Antworten in die UEQ Data Analysis Tool selbst exportieren, **damit** ich prüfen kann, dass das Tool wie die Tabelle rechnet, bevor ich einen Artikel unterschreibe.

Akzeptanzkriterien:

1. Die offizielle Tabelle wird mit den 26 Werten jeder teilnehmenden Person in der Auswertung ab Data!A4 gefüllt und rechnet beim Öffnen in Excel neu.
2. Umkodierung und Statistiken folgen den Formeln des Handbuchs und der Tabelle.
3. Der Fragebogen beeinflusst die Antwort nicht: Die 7 Positionen haben dasselbe visuelle Gewicht.
4. Die Zahlen stimmen mit der Tabelle bei einer Toleranz von 1e-6 überein.

Anforderungen: [RF36](requisitos.md#rf36), [RF37](requisitos.md#rf37), [RF59](requisitos.md#rf59), [RNF09](requisitos.md#rnf09), [RNF11](requisitos.md#rnf11). Status: Geliefert.

### HU19

**Auf Papier erhobene Antworten zusammenführen**

Als **Ricardo**, Betreuer ([PE02](personas.md#pe02)), **möchte ich** die Antworten einer Veranstaltung aus einer CSV-Datei importieren, **damit** ich alles im selben Dashboard auswerten kann.

Akzeptanzkriterien:

1. Ich sehe eine Vorschau vor dem Import.
2. Zeilen mit Fehlern werden mit ihrer Nummer angezeigt, und nichts wird importiert, solange es Fehler gibt.
3. Die importierten Antworten erscheinen als importiert markiert.

Anforderungen: [RF61](requisitos.md#rf61). Status: Geliefert.

### HU20

**Die Studie der Betreuten verfolgen**

Als **Ricardo**, Betreuer ([PE02](personas.md#pe02)), **möchte ich** als Leser zu Marinas Studie eingeladen werden, **damit** ich dasselbe Dashboard sehe wie sie, ohne etwas ändern zu können.

Akzeptanzkriterien:

1. Die Einladung kommt in der Glocke an, und ich nehme sie an oder lehne sie ab.
2. Als Leser sehe und exportiere ich, bearbeite oder lösche aber nichts.
3. Ich sehe nur die Studien, die mir gehören oder mit mir geteilt wurden.

Anforderungen: [RF20](requisitos.md#rf20), [RF21](requisitos.md#rf21), [RNF17](requisitos.md#rnf17). Status: Geliefert.

### HU21

**Erfahren, was sich in den Studien geändert hat**

Als **Ricardo**, Betreuer ([PE02](personas.md#pe02)), **möchte ich** benachrichtigt werden, wenn das Team eine Studie ändert oder Antworten eingehen, **damit** ich nicht jede Studie öffnen muss, um es zu erfahren.

Akzeptanzkriterien:

1. Die Glocke zeigt Einladungen, neue Antworten und Änderungen der Partner.
2. Die Hinweise gehen auch per E-Mail hinaus, in meiner Sprache, und ich kann sie unter Mein Konto ausschalten.

Anforderungen: [RF22](requisitos.md#rf22), [RF23](requisitos.md#rf23). Status: Geliefert.

### HU22

**Das Konto an einem gemeinsam genutzten Computer schützen**

Als **Ricardo**, Betreuer ([PE02](personas.md#pe02)), **möchte ich** das Passwort ändern und wissen, dass die anderen Sitzungen beendet werden, **damit** das Konto im Labor nicht offen bleibt.

Akzeptanzkriterien:

1. Eine Passwortänderung beendet die Sitzungen in anderen Browsern.
2. Wer eine Seite der Forschenden ohne Sitzung öffnet, kommt zu Anmelden.
3. Nach 5 falschen Passwörtern muss die E-Mail-Adresse warten, bevor sie es erneut versucht.
4. Das Tool funktioniert nur über HTTPS, mit den Sicherheitsheadern.

Anforderungen: [RF03](requisitos.md#rf03), [RF05](requisitos.md#rf05), [RNF15](requisitos.md#rnf15), [RNF16](requisitos.md#rnf16), [RNF18](requisitos.md#rnf18). Status: Geliefert.

### HU23

**Die Antworten für eine andere Auswertung exportieren**

Als **Ricardo**, Betreuer ([PE02](personas.md#pe02)), **möchte ich** die Roh- und die umkodierten Antworten herunterladen, **damit** ich Auswertungen durchführen kann, die das Tool nicht macht.

Akzeptanzkriterien:

1. Die Roh-CSV enthält die Werte von 1 bis 7, die Version und die demografischen Daten.
2. Die umkodierte CSV enthält die Werte von -3 bis +3 mit korrigierter Polarität.
3. Die Dateien öffnen sich direkt im portugiesischen Excel.

Anforderungen: [RF56](requisitos.md#rf56), [RF57](requisitos.md#rf57), [RNF22](requisitos.md#rnf22). Status: Geliefert.

### HU24

**Die Regel hinter jeder Zahl kennen**

Als **Ricardo**, Betreuer ([PE02](personas.md#pe02)), **möchte ich** sehen, wie jede Statistik berechnet und eingeordnet wird, **damit** ich die Methode vor einer Prüfungskommission erklären kann.

Akzeptanzkriterien:

1. Pragmatisch ist der Mittelwert aus Durchschaubarkeit, Effizienz und Vertrauenswürdigkeit; hedonisch der aus Stimulation und Originalität.
2. Jeder Mittelwert wird in die 5 Benchmark-Bereiche eingeordnet, und ein Mittelwert gleich der Grenze fällt in den unteren Bereich.
3. Die Interpretation verwendet den neutralen Bereich von -0,8 bis +0,8.

Anforderungen: [RF37](requisitos.md#rf37), [RF38](requisitos.md#rf38), [RF39](requisitos.md#rf39), [RF40](requisitos.md#rf40). Status: Geliefert.

### HU25

**Die Kurzfassung auf Veranstaltungen einsetzen**

Als **Ricardo**, Betreuer ([PE02](personas.md#pe02)), **möchte ich** den UEQ-S mit 8 Items einsetzen, **damit** ich auf Veranstaltungen erheben kann, auf denen die Leute wenig Zeit haben.

Akzeptanzkriterien:

1. Ich wähle beim Erstellen der Studie zwischen UEQ und UEQ-S.
2. Das Formular erklärt vor meiner Wahl, was sich zwischen beiden ändert, und die Wahl wird bei der ersten Antwort gesperrt.
3. Die teilnehmende Person beantwortet die 8 Paare des UEQ-S, mit der Dauer der Kurzfassung in der Einwilligungserklärung.
4. Die Ergebnisse zeigen in einem eigenen Reiter die pragmatische, die hedonische und die Gesamtqualität mit dem Benchmark des UEQ-S und exportieren die gefüllte offizielle UEQ-S-Tabelle.

Anforderungen: [RF62](requisitos.md#rf62). Status: Geliefert.

### HU26

**Das Tool auf Japanisch verwenden**

Als **Kenji**, Gastforscher ([PE03](personas.md#pe03)), **möchte ich** die Sprache des Tools auf Japanisch umstellen, **damit** ich in der Sprache arbeiten kann, die ich am besten lese.

Akzeptanzkriterien:

1. Ich wähle die Sprache beim Erstellen des Kontos, unter Mein Konto oder im Sprachwähler der Leiste.
2. Der Wechsel gilt sofort, ohne die Seite zu verlassen.
3. Ohne Konto wechselt der Sprachwähler der Leiste ebenfalls, und die Wahl bleibt im Browser gespeichert.

Anforderungen: [RF08](requisitos.md#rf08). Status: Geliefert.

### HU27

**Die Studie auf Japanisch durchführen**

Als **Kenji**, Gastforscher ([PE03](personas.md#pe03)), **möchte ich** die Studie auf Japanisch schreiben, und der Link soll auf Japanisch öffnen, **damit** ich den Fragebogen bei Teilnehmenden in Japan einsetzen kann.

Akzeptanzkriterien:

1. Ich wähle die Sprache der Studie im Formular; Standard ist die Sprache des Kontos.
2. Der Link öffnet in der Sprache der Studie, und die teilnehmende Person kann wechseln.
3. Titel, Produkt und Ziel erscheinen übersetzt für alle, die die Sprache wechseln.

Anforderungen: [RF19](requisitos.md#rf19), [RF34](requisitos.md#rf34), [RF35](requisitos.md#rf35). Status: Geliefert.

## Teilnehmende

### HU28

**Die Einladung verstehen, bevor ich zustimme**

Als **Célia**, Teilnehmerin am Handy ([PE04](personas.md#pe04)), **möchte ich** in einer Minute lesen, worum es geht und was passieren wird, **damit** ich entscheiden kann, ob ich teilnehmen will.

Akzeptanzkriterien:

1. Die Einwilligungserklärung nennt Ziel, geschätzte Dauer, Risiken, Nutzen, Aufbewahrung der Daten und wer für die Forschung verantwortlich ist.
2. Ich nehme erst teil, nachdem ich mein Alter angegeben und auf Ich stimme zu geklickt habe.
3. Ich möchte nicht teilnehmen verlässt die Seite, ohne etwas zu speichern.
4. Ich kann eine Kopie der Einwilligungserklärung drucken oder speichern und die Datenschutzerklärung öffnen, ohne die Einwilligungserklärung zu verlieren.

Anforderungen: [RF25](requisitos.md#rf25), [RNF19](requisitos.md#rnf19). Status: Geliefert.

### HU29

**Schnell auf dem Handy antworten**

Als **Célia**, Teilnehmerin am Handy ([PE04](personas.md#pe04)), **möchte ich** auf dem Handy antworten, mit vergrößerter Schrift, ohne Konto, **damit** ich in wenigen Minuten fertig bin.

Akzeptanzkriterien:

1. Ich öffne den Link ohne Anmeldung und sehe keinen Weg in den Bereich der Forschenden.
2. Jeder Kreis hat eine Tippfläche von mindestens 44 × 44 px.
3. Nichts scrollt bei 320 px oder bei 400 % Zoom horizontal.
4. Eine fixe Fußzeile zeigt, wie viele der 26 Items ich schon beantwortet habe.

Anforderungen: [RF24](requisitos.md#rf24), [RF27](requisitos.md#rf27), [RF28](requisitos.md#rf28), [RNF02](requisitos.md#rnf02), [RNF05](requisitos.md#rnf05), [RNF06](requisitos.md#rnf06), [RNF23](requisitos.md#rnf23). Status: Geliefert.

### HU30

**Wissen, was ich vergessen habe**

Als **Célia**, Teilnehmerin am Handy ([PE04](personas.md#pe04)), **möchte ich** beim Absenden auf leere Items hingewiesen werden, **damit** ich sie korrigieren kann, ohne Item für Item zu suchen.

Akzeptanzkriterien:

1. Eine Zusammenfassung oben sagt, wie viele fehlen, mit einem Link zu jedem.
2. Nichts wird gespeichert, solange ein Item fehlt.

Anforderungen: [RF29](requisitos.md#rf29). Status: Geliefert.

### HU31

**Nicht verlieren, was ich markiert habe**

Als **Célia**, Teilnehmerin am Handy ([PE04](personas.md#pe04)), **möchte ich** die Antworten zurückbekommen, wenn die Seite neu lädt, **damit** ich nicht von vorne anfangen muss.

Akzeptanzkriterien:

1. Neu laden bringt zurück, was ich markiert hatte, mit einem Hinweis.
2. Auch ein Sprachwechsel mittendrin löscht nicht, was ich markiert habe.

Anforderungen: [RF30](requisitos.md#rf30). Status: Geliefert.

### HU32

**Abbrechen, ohne Spuren zu hinterlassen**

Als **Célia**, Teilnehmerin am Handy ([PE04](personas.md#pe04)), **möchte ich** mitten im Fragebogen aufhören können, **damit** ich nicht an etwas festhänge, das ich nicht mehr tun will.

Akzeptanzkriterien:

1. Ohne Senden verlassen verlangt eine Bestätigung in einem Fenster.
2. Beim Verlassen wird nichts von dem, was ich markiert habe, gespeichert.

Anforderungen: [RF31](requisitos.md#rf31), [RNF21](requisitos.md#rnf21). Status: Geliefert.

### HU33

**Die Fragen über mich überspringen**

Als **Célia**, Teilnehmerin am Handy ([PE04](personas.md#pe04)), **möchte ich** die demografischen Fragen nicht beantworten, **damit** ich nichts angebe, was ich nicht will.

Akzeptanzkriterien:

1. Jede Frage hat Keine Angabe.
2. Ich kann den ganzen Schritt überspringen.
3. Das Tool fragt weder nach Name noch E-Mail-Adresse noch nach etwas, das mich identifiziert.

Anforderungen: [RF32](requisitos.md#rf32), [RNF12](requisitos.md#rnf12). Status: Geliefert.

### HU34

**Wissen, dass es vorbei ist**

Als **Célia**, Teilnehmerin am Handy ([PE04](personas.md#pe04)), **möchte ich** sehen, dass meine Antworten gespeichert wurden, **damit** ich die Seite beruhigt schließen kann.

Akzeptanzkriterien:

1. Nach dem Absenden sehe ich den Dank.
2. Öffne ich den Link im selben Browser erneut, sehe ich, dass ich schon geantwortet habe.

Anforderungen: [RF33](requisitos.md#rf33). Status: Geliefert.

### HU35

**Mit dem Screenreader antworten**

Als **Tiago**, Teilnehmer mit Screenreader ([PE05](personas.md#pe05)), **möchte ich** nur mit Tastatur und NVDA antworten, **damit** ich mit derselben Genauigkeit antworten kann wie sehende Personen.

Akzeptanzkriterien:

1. Jedes Item wird mit Nummer, den beiden Begriffen und der Position jedes Kreises angesagt.
2. Tab springt von Item zu Item und die Pfeiltasten ändern die Position, mit immer sichtbarem Fokus.
3. Die Zusammenfassung der fehlenden Items erhält den Fokus und wird angesagt.
4. Kein Bildschirm hat einen von axe-core gemeldeten Verstoß gegen WCAG 2.2 AA.

Anforderungen: [RF27](requisitos.md#rf27), [RNF01](requisitos.md#rnf01), [RNF03](requisitos.md#rnf03), [RNF04](requisitos.md#rnf04). Status: Geliefert.

### HU36

**Auf Arabisch antworten**

Als **Amira**, Teilnehmerin, die Arabisch liest ([PE06](personas.md#pe06)), **möchte ich** in meiner Sprache antworten, mit den auf Arabisch validierten Begriffen, **damit** ich besser antworten kann als auf Portugiesisch.

Akzeptanzkriterien:

1. Der Link öffnet in der Sprache des Browsers, wenn sie zu den 37 des UEQ gehört.
2. Die Seite dreht sich von rechts nach links, mit der Skala in offizieller Reihenfolge.
3. Die Begriffe sind die des offiziellen Pakets, nie eine automatische Übersetzung.
4. Ist die Übersetzung nicht von den Autoren des UEQ freigegeben, sagt ein Hinweis das.

Anforderungen: [RF34](requisitos.md#rf34), [RNF10](requisitos.md#rnf10). Status: Geliefert.

### HU37

**Mit Einwilligung der Erziehungsberechtigten teilnehmen**

Als **Bruna**, minderjährige Teilnehmerin ([PE07](personas.md#pe07)), **möchte ich** mit Einwilligung meiner Eltern an einer Studie der Schule teilnehmen, **damit** ich wie die volljährigen Mitschülerinnen und Mitschüler teilnehmen kann.

Akzeptanzkriterien:

1. Die Einwilligungserklärung fragt vor dem Ich stimme zu nach dem Alter.
2. Mit weniger als 18 Jahren nehme ich erst teil, nachdem ich die Einwilligung der erziehungsberechtigten Person bestätigt habe.
3. Ohne Alter wird nichts gespeichert.

Anforderungen: [RF25](requisitos.md#rf25). Status: Geliefert.

## Wer das Tool betreut

### HU38

**Das Tool lokal ausführen**

Als **Lucas**, Maintainer der Installation ([PE08](personas.md#pe08)), **möchte ich** das Tool in wenigen Minuten auf meinem Rechner starten, **damit** ich es an mein Labor anpassen kann.

Akzeptanzkriterien:

1. Das README hat die Schritt-für-Schritt-Anleitung, vom Klon bis zum Startbildschirm.
2. Der Code ist offen, unter der MIT-Lizenz.

Anforderungen: [RNF24](requisitos.md#rnf24). Status: Geliefert.

### HU39

**Einen Schwellenwert ändern und neu berechnen**

Als **Lucas**, Maintainer der Installation ([PE08](personas.md#pe08)), **möchte ich** einen Verdachtsschwellenwert ändern, ohne Zahlen im Code zu suchen, **damit** ich dem Protokoll meiner Gruppe folgen kann.

Akzeptanzkriterien:

1. Die Schwellenwerte stehen in data/protocolo.json, mit der Quelle.
2. Ein Befehl berechnet den Verdacht der bereits gespeicherten Teilnahmen neu.

Anforderungen: [RF55](requisitos.md#rf55). Status: Geliefert.

### HU40

**Beweisen, dass die Berechnung nicht kaputt ist**

Als **Lucas**, Maintainer der Installation ([PE08](personas.md#pe08)), **möchte ich** die Tests der Berechnung nach einer Codeänderung ausführen, **damit** ich sicher bin, dass die Zahlen weiterhin stimmen.

Akzeptanzkriterien:

1. Die Berechnung liegt in einem Modul mit reinen Funktionen, ohne Datenbank oder Oberfläche.
2. Linting, Typen und Unit-Tests laufen jeweils mit einem Befehl.
3. Die Tests decken die Grenzfälle ab: n = 0, n = 1, alle gleich.

Anforderungen: [RNF25](requisitos.md#rnf25), [RNF26](requisitos.md#rnf26). Status: Geliefert.

### HU41

**Die Konten des Labors verwalten**

Als **Lucas**, Maintainer der Installation ([PE08](personas.md#pe08)), **möchte ich** die Konten sehen und ein Konto für einen neuen Studierenden anlegen, **damit** ich mich um die Installation des Labors kümmern kann.

Akzeptanzkriterien:

1. Nur Administratoren öffnen die Seite Verwaltung.
2. Der Administrator sieht die Studien von niemandem, nur die Anzahl pro Konto.

Anforderungen: [RF66](requisitos.md#rf66), [RNF17](requisitos.md#rnf17). Status: Geliefert.

### HU42

**Das Tool ohne echte Daten vorführen**

Als **Lucas**, Maintainer der Installation ([PE08](personas.md#pe08)), **möchte ich** Demo-Studien mit erfundenen Antworten anlegen, **damit** ich das Tool in einer Lehrveranstaltung vorstellen kann.

Akzeptanzkriterien:

1. Jedes Szenario erzeugt Antworten, die zu seinem Profil passen.
2. Die Demo-Studien liegen in meinem Konto.

Anforderungen: [RF67](requisitos.md#rf67). Status: Geliefert.

### HU43

**Den Schutz und die Übersetzungen prüfen**

Als **Lucas**, Maintainer der Installation ([PE08](personas.md#pe08)), **möchte ich** sehen, ob die Verschlüsselung eingeschaltet ist und wie viel jeder Sprache übersetzt ist, **damit** ich weiß, ob die Installation für eine echte Studie bereit ist.

Akzeptanzkriterien:

1. Verwaltung zeigt, ob der Verschlüsselungsschlüssel und der E-Mail-Versand konfiguriert sind.
2. Verwaltung › Sprachen zeigt, wie viel jeder Sprache bereits übersetzt ist.

Anforderungen: [RF68](requisitos.md#rf68), [RNF14](requisitos.md#rnf14). Status: Geliefert.

### HU44

**Die Dokumentation ohne Konto lesen**

Als **Lucas**, Maintainer der Installation ([PE08](personas.md#pe08)), **möchte ich** die Dokumentation im Tool lesen, ohne ein Konto anzulegen, **damit** ich die Architektur verstehe, bevor ich etwas ändere.

Akzeptanzkriterien:

1. Der Reiter Dokumentation öffnet sich für jede Person.
2. Die Links zwischen Dokumenten führen an die richtige Stelle, und die Dateien des Steckbriefs lassen sich ohne Konto herunterladen.
3. Jedes Diagramm öffnet sich im Vollbild, mit Zoom.

Anforderungen: [RF63](requisitos.md#rf63), [RF64](requisitos.md#rf64), [RF65](requisitos.md#rf65). Status: Geliefert.
