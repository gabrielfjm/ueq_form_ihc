# Personas

Acht Personas stehen für diejenigen, die das UEQ-Tool nutzen: drei auf der Seite der Forschenden, vier auf der Seite der Teilnehmenden und eine für die Person, die die Installation betreut.

Sie sind fiktiv. Sie wurden aus dem Nutzerprofil und dem Nutzungskontext in [Grundlagen der IHC §2](../ihc.md#2-usuários-e-contexto-de-uso-iso-9241-11) abgeleitet, das der ISO 9241-11 folgt, und decken die Extreme ab, die den Entwurf einer Oberfläche am stärksten verändern: wer noch nie Statistik berechnet hat, wer nur der offiziellen Tabelle vertraut, wer kein Portugiesisch liest, wer mit vergrößerter Schrift auf dem Smartphone antwortet, wer einen Screenreader verwendet, wer von rechts nach links liest, wer unter 18 Jahre alt ist und wer am Code arbeiten muss.

Jede Persona verweist auf die [User Stories](historias-de-usuario.md), die von ihr ausgehend geschrieben wurden. Die [Rückverfolgbarkeitsmatrix](matriz-rastreabilidade.md) verknüpft jede Anforderung mit den Personas, die sie fordern.

| ID | Persona | Rolle | Hauptnutzung |
|---|---|---|---|
| [PE01](#pe01) | Marina | Forscherin, Masterstudentin in IHC | Richtet die Studie ein, verfolgt die Erhebung und interpretiert das Dashboard |
| [PE02](#pe02) | Ricardo | Professor und Betreuer | Verfolgt die Studien seiner Betreuten, vergleicht Versionen und prüft die Zahlen in der offiziellen Tabelle |
| [PE03](#pe03) | Kenji | Gastforscher, liest Japanisch | Nutzt das Tool und führt die Studie in der eigenen Sprache durch |
| [PE04](#pe04) | Célia | Teilnehmerin mit dem Smartphone | Antwortet über den Link, den sie per WhatsApp erhalten hat |
| [PE05](#pe05) | Tiago | Teilnehmer mit Screenreader | Antwortet nur mit der Tastatur und NVDA |
| [PE06](#pe06) | Amira | Teilnehmerin, die Arabisch liest | Antwortet in der eigenen Sprache, von rechts nach links |
| [PE07](#pe07) | Bruna | Minderjährige Teilnehmerin | Nimmt in der Schule an einer Studie teil, mit Erlaubnis der Eltern |
| [PE08](#pe08) | Lucas | Entwickler und Administrator der Installation | Installiert, passt das Protokoll an, verwaltet die Konten und weist nach, dass nichts kaputtgegangen ist |

## Forschende

### PE01

**Marina, 26 Jahre, Masterstudentin in IHC.** Hauptpersona.

- **Kontext.** Sie ist im ersten Jahr des Masterstudiums und wird mit dem UEQ zwei Versionen der Terminbuchungs-App der Lehrklinik ihrer Universität bewerten. Sie kennt sich mit UX aus und hat bereits Fragebögen beantwortet, aber noch nie Cronbachs Alpha berechnet. Sie arbeitet am Notebook, in kurzen Sitzungen zwischen den Vorlesungen, und öffnet das Dashboard während der Erhebung mehrmals täglich.
- **Ziele.** Die Studie fehlerfrei anlegen, den Link in die WhatsApp-Gruppe der Patientinnen und Patienten schicken, wissen, wie viele Personen bereits geantwortet haben, das Ergebnis verstehen und Tabellen und Diagramme in die Abschlussarbeit übernehmen.
- **Frustrationen.** Tabellen, in denen ein falsches Kopieren und Einfügen alles zerstört. Allgemeine Formulare, die Reihenfolge und Polarität des UEQ nicht beibehalten. Statistik ohne Erklärung. Die Einwilligungserklärung von Grund auf selbst schreiben zu müssen.
- **Was sie vom Tool braucht.** Eine schriftliche Interpretation neben jeder Zahl, eine kurze Erklärung der Fachbegriffe, Hinweise, die sagen, was zu tun ist, eine Einwilligungserklärung, die bereits verlangt, was die Ethik fordert, und Exporte, die sich direkt in Excel öffnen lassen.

> „Ich möchte wissen, ob die neue Version besser ist, und nicht zur Statistikexpertin werden.“

Stories: [HU01](historias-de-usuario.md#hu01), [HU02](historias-de-usuario.md#hu02), [HU03](historias-de-usuario.md#hu03), [HU04](historias-de-usuario.md#hu04), [HU05](historias-de-usuario.md#hu05), [HU06](historias-de-usuario.md#hu06), [HU07](historias-de-usuario.md#hu07), [HU08](historias-de-usuario.md#hu08), [HU09](historias-de-usuario.md#hu09), [HU10](historias-de-usuario.md#hu10), [HU11](historias-de-usuario.md#hu11), [HU12](historias-de-usuario.md#hu12), [HU13](historias-de-usuario.md#hu13), [HU14](historias-de-usuario.md#hu14), [HU15](historias-de-usuario.md#hu15), [HU16](historias-de-usuario.md#hu16), [HU17](historias-de-usuario.md#hu17).

### PE02

**Ricardo, 48 Jahre, Professor und Betreuer.**

- **Kontext.** Er betreut vier Studierende, die den UEQ verwenden, darunter Marina. Er kennt das Handbook und das UEQ Data Analysis Tool und vertraut ihnen. Er arbeitet an den gemeinsam genutzten Rechnern des Labors. Manchmal hat er auf Papier erhobene Antworten, bei Veranstaltungen mit wenig Zeit für jede Person.
- **Ziele.** Die Studie jeder oder jedes Betreuten verfolgen, ohne Screenshots anzufordern, Versionen eines Produkts vergleichen, vor der Unterschrift unter einen Artikel prüfen, dass die Zahlen mit der offiziellen Tabelle übereinstimmen, und Papierantworten mit denen aus dem Link zusammenführen.
- **Frustrationen.** Werkzeuge, die „auf ihre Art“ rechnen, ohne die Regel zu nennen. Filter neu einstellen zu müssen, um ein Ergebnis zu besprechen. Die Sitzung an einem gemeinsam genutzten Rechner offen zu lassen.
- **Was er vom Tool braucht.** Lesezugriff auf die Studie der Studierenden, Export im exakten Format der offiziellen Tabelle, sichtbare Regeln für Verdacht und Berechnung, eine Adresse, die die Ansicht des Dashboards speichert, Import mit Vorschau und einen Passwortwechsel, der die anderen Sitzungen beendet.

> „Wenn es nicht mit der offiziellen Tabelle übereinstimmt, kommt es nicht in den Artikel.“

Stories: [HU18](historias-de-usuario.md#hu18), [HU19](historias-de-usuario.md#hu19), [HU20](historias-de-usuario.md#hu20), [HU21](historias-de-usuario.md#hu21), [HU22](historias-de-usuario.md#hu22), [HU23](historias-de-usuario.md#hu23), [HU24](historias-de-usuario.md#hu24), [HU25](historias-de-usuario.md#hu25).

### PE03

**Kenji, 35 Jahre, Gastforscher einer japanischen Universität.**

- **Kontext.** Er verbringt ein Semester im Labor von Ricardo. Er liest Portugiesisch langsam und arbeitet besser auf Japanisch. Er wird den UEQ in einer Studie mit Teilnehmenden in Japan einsetzen, zu einer Verkehrs-App.
- **Ziele.** Das Tool in der eigenen Sprache nutzen und eine Studie einrichten, deren Link auf Japanisch öffnet, mit den offiziellen Begriffen des UEQ.
- **Frustrationen.** Eine Oberfläche, die es nur auf Englisch oder Portugiesisch gibt. Eine Übersetzung, die die Namen der Schaltflächen von einer Seite zur anderen ändert.
- **Was er vom Tool braucht.** Eine stets sichtbare Sprachauswahl, eine konsistente Übersetzung der Oberfläche, eine in seiner Sprache verfasste Studie und den übersetzten Titel für diejenigen, die in einer anderen Sprache antworten.

> „Ich verstehe die Statistik. Ich muss nur den Bildschirm lesen können.“

Stories: [HU26](historias-de-usuario.md#hu26), [HU27](historias-de-usuario.md#hu27).

## Teilnehmende

### PE04

**Célia, 63 Jahre, Rentnerin, Patientin der Lehrklinik.**

- **Kontext.** Sie erhält den Link per WhatsApp und öffnet ihn auf dem Smartphone, mit vergrößerter Systemschrift. Sie nutzt das Smartphone für Nachrichten und Online-Banking, ist aber misstrauisch gegenüber Formularen. Sie hat kein Konto im Tool und keinerlei Pflicht zu antworten.
- **Ziele.** Schnell verstehen, worum es geht und wer fragt, in wenigen Minuten antworten und zu dem zurückkehren, was sie gerade getan hat.
- **Frustrationen.** Kleine Schaltflächen, Fragen, die verschwinden, wenn die Seite neu geladen wird, ein Formular, das nicht sagt, was fehlt, die Aufforderung zu persönlichen Angaben.
- **Was sie vom Tool braucht.** Eine kurze, klare Einwilligungserklärung, mit Angabe, wer für die Studie verantwortlich ist, eine große Touch-Fläche, sichtbaren Fortschritt, einen Hinweis auf vergessene Items mit direktem Link, die Möglichkeit abzubrechen und die Angaben zur eigenen Person zu überspringen.

> „Wenn ich es nicht in einer Minute verstehe, schließe ich es.“

Stories: [HU28](historias-de-usuario.md#hu28), [HU29](historias-de-usuario.md#hu29), [HU30](historias-de-usuario.md#hu30), [HU31](historias-de-usuario.md#hu31), [HU32](historias-de-usuario.md#hu32), [HU33](historias-de-usuario.md#hu33), [HU34](historias-de-usuario.md#hu34).

### PE05

**Tiago, 29 Jahre, Systemanalyst, blind.**

- **Kontext.** Er nutzt Windows mit NVDA und navigiert nur über die Tastatur. Er beantwortet häufig UX-Umfragen und hat schon viele abgebrochen, weil die Schaltflächen `div` ohne Namen waren.
- **Ziele.** Mit derselben Genauigkeit antworten wie jemand, der sehen kann, und bei jedem Kreis die Position kennen und wissen, welchem Pol er näher ist.
- **Frustrationen.** Eine Skala ohne Beschriftung („Schaltfläche, Schaltfläche, Schaltfläche“), eine Fortschrittsansage bei jedem Klick, ein Fokus, der von selbst springt, ein Fehler, der nur in Rot erscheint.
- **Was er vom Tool braucht.** Das Item als Gruppe mit Legende, native Radiobuttons mit zugänglichem Namen („3 von 7, näher an einfach“), Fortschritt, der ohne Unterbrechung angesagt wird, eine Fehlerzusammenfassung, die den Fokus erhält.

> „Wenn der Screenreader nur ‚Optionsfeld, 3 von 7‘ sagt, weiß ich nicht, was ich beantworte.“

Stories: [HU35](historias-de-usuario.md#hu35).

### PE06

**Amira, 34 Jahre, Austauschstudentin, liest Arabisch.**

- **Kontext.** Sie verbringt ein Semester in Brasilien und spricht wenig Portugiesisch. Der Browser auf ihrem Smartphone ist auf Arabisch eingestellt. Sie nimmt an der Studie eines Laborkollegen teil.
- **Ziele.** In der eigenen Sprache antworten, mit den Begriffen, die der UEQ auf Arabisch validiert hat.
- **Frustrationen.** Eine automatische Übersetzung, die den Sinn des Begriffs verändert. Eine arabische Seite mit umgekehrter Skala.
- **Was sie vom Tool braucht.** Eine über den Browser gewählte Sprache, Text von rechts nach links mit der Skala in der offiziellen Reihenfolge, einen ehrlichen Hinweis, dass die arabische Übersetzung nicht von den Autoren des UEQ genehmigt wurde.

> „Ich antworte besser, wenn ich in meiner Sprache lese.“

Stories: [HU36](historias-de-usuario.md#hu36).

### PE07

**Bruna, 16 Jahre, Oberstufenschülerin.**

- **Kontext.** Ihre Schule nimmt an einer Studie über die Aufgabenplattform teil, die die Schülerinnen und Schüler verwenden. Sie antwortet in der Pause auf dem Smartphone, mit dem Link, den die Lehrerin geschickt hat.
- **Ziele.** Wie ihre Mitschülerinnen und Mitschüler teilnehmen, ohne Umstände.
- **Frustrationen.** Ein Formular, das hängt, ohne zu erklären, warum.
- **Was sie vom Tool braucht.** Eine Einwilligungserklärung, die vor dem Beginn nach dem Alter fragt und klar sagt, dass Personen unter 18 Jahren die Erlaubnis der oder des Erziehungsberechtigten brauchen, ohne vorher irgendetwas zu speichern.

> „Meine Eltern haben die Erlaubnis der Schule schon unterschrieben. Wo bestätige ich das?“

Stories: [HU37](historias-de-usuario.md#hu37).

## Wer das Tool betreut

### PE08

**Lucas, 31 Jahre, Entwickler und Forscher im Software Engineering.**

- **Kontext.** Er hat das Repository gefunden, weil seine Gruppe ebenfalls den UEQ verwendet. Er kennt TypeScript und Next.js. Er hat das Tool für das Labor installiert und ist der Administrator der Installation: Er legt die Konten der Studierenden an und stellt das Tool in den Lehrveranstaltungen vor.
- **Ziele.** Das Tool in Minuten lokal starten, die Architektur verstehen, einen Schwellenwert ändern, ohne im Code nach Zahlen zu suchen, nachweisen, dass die Berechnung nicht kaputtgegangen ist, und wissen, ob die Installation für eine echte Studie bereit ist.
- **Frustrationen.** Ein akademisches Projekt ohne Installationsanleitung, über die Oberfläche verstreute Geschäftsregeln, nicht vorhandene Tests, eine Dokumentation, die nicht sagt, welcher Code was umsetzt.
- **Was er vom Tool braucht.** Eine README mit der Schritt-für-Schritt-Anleitung, Protokollparameter in JSON mit Quellenangabe, eine Berechnung, die in reinen Funktionen mit Tests isoliert ist, eine Verwaltungsseite, die den Zustand der Installation zeigt, ohne Zugriff auf die Studien anderer zu geben, und eine Dokumentation, die Anforderung und Code verknüpft.

> „Bevor ich etwas anfasse, muss ich wissen, was diese Zeile garantiert.“

Stories: [HU38](historias-de-usuario.md#hu38), [HU39](historias-de-usuario.md#hu39), [HU40](historias-de-usuario.md#hu40), [HU41](historias-de-usuario.md#hu41), [HU42](historias-de-usuario.md#hu42), [HU43](historias-de-usuario.md#hu43), [HU44](historias-de-usuario.md#hu44).
