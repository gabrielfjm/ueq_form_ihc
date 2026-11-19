# Anforderungen

Das UEQ-Tool hat **68 funktionale Anforderungen** (RF), was es tut, und **26 nicht-funktionale Anforderungen** (RNF), wie es sein muss. Alle 94 sind geliefert. Dieselbe Liste steht in [requisitos.csv](requisitos.csv) und in der [Anforderungstabelle](planilha-requisitos.xlsx).

Aktualisiert am 17.11.2026.

## Wie zu lesen

Jede Anforderung hat eine feste ID. Nach dem Anlegen ändert sich die ID nicht: Fällt eine Anforderung weg, erhält sie den Status Entfernt, weil die Anwendungsfälle und die Testfälle die Anforderungen über die Nummer zitieren.

**Priorität**

- **Wesentlich:** Ohne sie erfüllt das Tool die fünf Anforderungen des Kurses nicht (Studien anlegen und verwalten, das Instrument einsetzen, nach dem Protokoll berechnen, auswerten und darstellen, exportieren) oder ist nicht barrierefrei.
- **Wichtig:** verbessert die Gebrauchsqualität, die Sicherheit oder das Vertrauen in die Ergebnisse, aber das Tool funktioniert ohne sie.
- **Wünschenswert:** Erweiterung über den verpflichtenden Umfang des Vorschlags hinaus.

**Status**

- **Geliefert:** ist in `main` und kann im Tool geprüft werden.
- **Ausstehend:** ein Teil fehlt noch.
- **Entfernt:** ist aus dem Umfang gefallen. Die ID bleibt reserviert.

**Sprint** ist der Sprint, in dem die Anforderung geliefert wurde (Tabelle unten). Jeder Sprint besteht aus einem oder mehreren Pull Requests, die in `main` integriert wurden.

**Wie prüfen** nennt die [Testfälle](casos-de-teste.md), die die Anforderung belegen, sofern es sie gibt, und sagt, was im Tool zu tun ist, um sie zu prüfen. Um das Tool auszuführen, verwenden Sie das Testkonto `pesquisador@exemplo.com` (Passwort `senha-de-teste`) und die Beispielstudie.

### Sprints

| Sprint | PR | Datum | Was er geliefert hat |
|---|---|---|---|
| Sprint 00 · Setup | #1 | 22.10.2026 | Projektgerüst mit Next, Prisma und Tests |
| Sprint 01 · Datenbank und Seed | #5 | 23.10.2026 | Datenbankmodell und die 26 UEQ-Items im Seed |
| Sprint 02 · Berechnung | #6 | 23.10.2026 | Berechnungsmodul des UEQ |
| Sprint 03 · Authentifizierung | #7 | 23.10.2026 | Registrierung, Anmeldung und Mein Konto |
| Sprint 04 · Studien | #8 | 23.10.2026 | Liste, Anlage und Seite der Studie |
| Sprint 05 · Fragebogen | #9 | 23.10.2026 | Fragebogen der Teilnehmenden |
| Sprint 06 · Ergebnisse | #10 | 23.10.2026 | Ergebnis-Dashboard und Vergleich zwischen Versionen |
| Sprint 07 · Verdächtige Antworten | #11 | 29.10.2026 | Seite der Antworten und Umgang mit Verdachtsfällen |
| Sprint 08 · Export | #12 | 29.10.2026 | Exporte als CSV |
| Sprachen-Sprint | #13 | 29.10.2026 | Fragebogen in den 37 Sprachen des UEQ |
| Sprint 10 · Erweiterungen | #14 | 30.10.2026 | Import per CSV, Dashboard als PDF, Struktur des UEQ-S |
| Dokumentations-Sprint | #15, #16 | 30.10.2026 | Reiter Dokumentation, MIT-Lizenz, fixe Leiste, Diagramme im Vollbild |
| Startseite und Dialoge | #17 | 30.10.2026 | Startseite, Anmelden im Fenster, Bestätigung beim Abmelden und Löschen, Icon |
| Bereitstellung | #18, #19, #20 | 30.10. und 31.10.2026 | Aktualisierte Testfälle und Veröffentlichung auf Vercel, mit Migrations und Seed im Build |
| Team und Hilfe | #21 | 01.11.2026 | Studien im Team, Benachrichtigungen, geführte Tour, Hilfe auf jeder Seite, optionale demografische Erhebung und Verwaltung |
| LGPD | #22, #23 | 01.11.2026 | Verschlüsselung, Datenschutzerklärung, Meine Daten herunterladen, Begrenzung der Anmeldeversuche, Sicherheitsheader und Profil der Teilnehmenden |
| Sprachen des Tools | #24 bis #27 | 02.11.2026 | Tool in den 37 Sprachen, Sprache der Studie, Übersetzung der Studientexte und neue Startseite |
| Teilnehmende und E-Mails | #28, #29 | 03.11.2026 | Freundlichere Bildschirme für Teilnehmende und E-Mails mit der visuellen Identität |
| Datenschutz und Dokumentation in Seiten | #30 bis #34 | 06.11.2026 | Datenschutzerklärung im Stil des Tools, Dokumente zu Architektur und Tests, Dokumentation in Seiten und Bestätigung jeder Aktion |
| Qualität der Übersetzung | #35 bis #39 | 06.11. und 07.11.2026 | Übersetzung der Oberfläche mit Glossar, Bildschirmkontext und automatischer Prüfung |
| Einwilligungserklärung | #40, #41 | 17.11.2026 | Vollständige Einwilligungserklärung, Minderjährige, Sprachwähler in der Leiste und Next.js 16.4.6 |
| Abschließende Dokumentation | #42, #43 | 17.11.2026 | Anforderungen, Rückverfolgbarkeitsmatrix, Personas, User Stories, Anwendungsfälle, Klassendiagramm und Überprüfung der Berechnung |
| Sprint 09 · Abschlussprüfung | #44 | 17.11.2026 | Abgleich mit der offiziellen Tabelle in 11 Szenarien und Export in die UEQ Data Analysis Tool selbst |
| UEQ-S | #45 | 18.11.2026 | Der UEQ-S als Fragebogen der Studie, der Reiter UEQ-S in den Ergebnissen, der Vergleich UEQ oder UEQ-S auf der Startseite und der Abgleich mit der offiziellen UEQ-S-Tabelle in 9 Szenarien |

## Funktionale Anforderungen

### Zugang und Konto

| ID | Anforderung | Beschreibung | Priorität | Sprint | Status | Wie prüfen |
|---|---|---|---|---|---|---|
| <a id="rf01"></a>RF01 | **Konto erstellen** | Die forschende Person legt ein Konto mit Name, E-Mail-Adresse und Passwort an und sieht die Passwortregeln vor der Eingabe. | Wesentlich | Sprint 03 · Authentifizierung | Geliefert | [CT-E03](casos-de-teste.md#ct-e03), [CT-E06](casos-de-teste.md#ct-e06), [CT-E07](casos-de-teste.md#ct-e07). Klicken Sie auf der Startseite auf Konto erstellen und registrieren Sie sich, wobei Sie beim ersten Versuch ein Feld leer lassen. |
| <a id="rf02"></a>RF02 | **Anmelden und abmelden** | Die forschende Person meldet sich mit E-Mail-Adresse und Passwort an und von der Sitzung ab, was eine Bestätigung in einem Fenster verlangt. | Wesentlich | Sprint 03 · Authentifizierung | Geliefert | [CT-E03](casos-de-teste.md#ct-e03), [CT-E08](casos-de-teste.md#ct-e08), [CT-E58](casos-de-teste.md#ct-e58). Melden Sie sich mit dem Testkonto an, zuerst mit falschem Passwort; klicken Sie dann auf Abmelden. |
| <a id="rf03"></a>RF03 | **Den Bereich der Forschenden schützen** | Wer eine Seite der Forschenden ohne Sitzung öffnet, kommt zu Anmelden und kehrt nach der Anmeldung zur angeforderten Seite zurück. | Wesentlich | Sprint 03 · Authentifizierung | Geliefert | [CT-E04](casos-de-teste.md#ct-e04). Öffnen Sie ohne Anmeldung http://localhost:3000/estudos. |
| <a id="rf04"></a>RF04 | **Kontodaten bearbeiten** | Die forschende Person ändert Name und E-Mail-Adresse unter Mein Konto; eine E-Mail-Adresse, die schon zu einem anderen Konto gehört, wird abgelehnt. | Wichtig | Sprint 03 · Authentifizierung | Geliefert | [CT-E09](casos-de-teste.md#ct-e09). Mein Konto › Persönliche Daten: Namen ändern und speichern. |
| <a id="rf05"></a>RF05 | **Passwort ändern** | Die forschende Person ändert das Passwort unter Angabe des aktuellen, und die Änderung beendet die in anderen Browsern offenen Sitzungen. | Wichtig | Sprint 03 · Authentifizierung | Geliefert | [CT-E10](casos-de-teste.md#ct-e10). Mein Konto › Passwort. |
| <a id="rf06"></a>RF06 | **Konto löschen** | Die forschende Person löscht das Konto durch Eingabe der E-Mail-Adresse, und die Löschung entfernt auch ihre Studien und Antworten. | Wichtig | Sprint 03 · Authentifizierung | Geliefert | [CT-E11](casos-de-teste.md#ct-e11). Mein Konto › Konto löschen, mit einem nur für den Test angelegten Konto. |
| <a id="rf07"></a>RF07 | **Meine Daten herunterladen** | Die forschende Person lädt unter Mein Konto eine JSON-Datei mit allem herunter, was das Tool über ihr Konto speichert. | Wichtig | LGPD | Geliefert | [CT-E81](casos-de-teste.md#ct-e81). Mein Konto › Meine Daten herunterladen: Die .json-Datei wird heruntergeladen und enthält die Kontodaten. |
| <a id="rf08"></a>RF08 | **Die Sprache des Tools wählen** | Die forschende Person wählt die Sprache der Oberfläche beim Anlegen des Kontos und ändert sie unter Mein Konto › Sprache oder über den Sprachwähler in der Leiste, unter den 37 Sprachen des UEQ; ohne Konto ändert der Sprachwähler in der Leiste die Sprache ebenfalls. | Wünschenswert | Sprachen des Tools | Geliefert | [CT-E94](casos-de-teste.md#ct-e94), [CT-E95](casos-de-teste.md#ct-e95). Klicken Sie in der Leiste auf PT, wählen Sie eine andere Sprache und prüfen Sie das übersetzte Menü; dasselbe gilt unter Mein Konto › Sprache. |
| <a id="rf09"></a>RF09 | **Geführte Tour beim ersten Zugriff** | Wer zum ersten Mal kommt, macht eine Tour durch die eigenen Aktionen und kann die Tour überspringen, schließen oder später über die Hilfe erneut ansehen. | Wünschenswert | Team und Hilfe | Geliefert | [CT-E66](casos-de-teste.md#ct-e66), [CT-M22](casos-de-teste.md#ct-m22). Legen Sie ein neues Konto an und melden Sie sich an: Die Tour startet von selbst. |
| <a id="rf10"></a>RF10 | **Hilfe auf jeder Seite** | Jede Seite der Forschenden hat in der Kopfzeile eine Hilfeschaltfläche (?), die die Seite selbst erklärt. | Wünschenswert | Team und Hilfe | Geliefert | [CT-E65](casos-de-teste.md#ct-e65). Klicken Sie auf einer beliebigen Seite der Forschenden auf (?). |
| <a id="rf11"></a>RF11 | **Startseite** | Die Startseite erklärt den UEQ (Skalen, Lesen der Ergebnisse und Benchmark) und nennt die Danksagungen; Anmelden und Konto erstellen öffnen sich in einem Fenster darüber. | Wichtig | Startseite und Dialoge | Geliefert | [CT-E01](casos-de-teste.md#ct-e01), [CT-E58](casos-de-teste.md#ct-e58), [CT-E59](casos-de-teste.md#ct-e59), [CT-E60](casos-de-teste.md#ct-e60). Öffnen Sie http://localhost:3000 ohne Anmeldung und klicken Sie auf Anmelden. |

### Studien

| ID | Anforderung | Beschreibung | Priorität | Sprint | Status | Wie prüfen |
|---|---|---|---|---|---|---|
| <a id="rf12"></a>RF12 | **Studien auflisten** | Die forschende Person sieht ihre Studien in einer Tabelle mit Titel, Produkt, Status, Versionen, Antworten und letzter Antwort, nach der letzten Aktualisierung sortiert. | Wesentlich | Sprint 04 · Studien | Geliefert | [CT-E12](casos-de-teste.md#ct-e12), [CT-E17](casos-de-teste.md#ct-e17). Menü Studien. |
| <a id="rf13"></a>RF13 | **Studie erstellen** | Die forschende Person legt eine Studie mit Titel, bewertetem Produkt, Ziel, Erhebungszeitraum und einer oder mehreren Versionen des Produkts an und gibt an, wer für die Forschung verantwortlich ist (Name, Kontakt-E-Mail und Institution), die Risiken und den Nutzen für die Teilnehmenden und, falls vorhanden, die Ethikkommission; der Name des Produkts schlägt den Namen der ersten Version vor. | Wesentlich | Sprint 04 · Studien | Geliefert | [CT-E13](casos-de-teste.md#ct-e13), [CT-E14](casos-de-teste.md#ct-e14), [CT-E93](casos-de-teste.md#ct-e93). Studie erstellen: Legen Sie eine Studie mit 2 Versionen an. |
| <a id="rf14"></a>RF14 | **Studie bearbeiten** | Die forschende Person bearbeitet die Daten und die Versionen der Studie; bei geöffneter Erhebung kann eine Version, die schon Antworten hat, nicht entfernt werden. | Wesentlich | Sprint 04 · Studien | Geliefert | [CT-E18](casos-de-teste.md#ct-e18). Seite der Studie › Bearbeiten. |
| <a id="rf15"></a>RF15 | **Erhebung öffnen, beenden und wieder öffnen** | Die forschende Person öffnet, beendet und öffnet die Erhebung wieder; der Link nimmt nur bei geöffneter Erhebung Antworten an und zeigt in den anderen Fällen einen Hinweis. | Wesentlich | Sprint 04 · Studien | Geliefert | [CT-E15](casos-de-teste.md#ct-e15). Seite der Studie: Erhebung öffnen, Erhebung beenden und Erhebung wieder öffnen, wobei Sie den Link bei jedem Schritt öffnen. |
| <a id="rf16"></a>RF16 | **Den öffentlichen Link kopieren** | Jede Studie hat einen kurzen, nicht fortlaufenden öffentlichen Link, den die forschende Person mit einer Schaltfläche kopiert. | Wesentlich | Sprint 04 · Studien | Geliefert | [CT-E16](casos-de-teste.md#ct-e16). Seite der Studie › Link kopieren. |
| <a id="rf17"></a>RF17 | **Studie löschen** | Die forschende Person löscht eine Studie durch Eingabe des Titels; der Hinweis sagt, wie viele Antworten mitgelöscht werden, und Versionen, Teilnahmen und Antworten werden gelöscht. | Wesentlich | Sprint 04 · Studien | Geliefert | [CT-E19](casos-de-teste.md#ct-e19). Seite der Studie › Studie löschen. |
| <a id="rf18"></a>RF18 | **Die Erhebung demografischer Daten einschalten** | Die forschende Person entscheidet für jede Studie, ob der Link den Schritt mit demografischen Daten zeigt; er ist standardmäßig ausgeschaltet. | Wichtig | Team und Hilfe | Geliefert | [CT-E71](casos-de-teste.md#ct-e71). Studie erstellen: Schalten Sie die demografischen Daten ein und öffnen Sie den Link: Der Schritt Optionale Angaben erscheint. |
| <a id="rf19"></a>RF19 | **Die Sprache der Studie wählen** | Die forschende Person wählt die Sprache, in der die Studie geschrieben ist und in der der Link öffnet; neue Studien entstehen in der Sprache des Kontos. | Wünschenswert | Sprachen des Tools | Geliefert | [CT-E45](casos-de-teste.md#ct-e45). Studie erstellen: Ändern Sie die Sprache und öffnen Sie den Link. |

### Team und Benachrichtigungen

| ID | Anforderung | Beschreibung | Priorität | Sprint | Status | Wie prüfen |
|---|---|---|---|---|---|---|
| <a id="rf20"></a>RF20 | **Studie teilen** | Der Besitzer lädt ein registriertes Konto per E-Mail als Bearbeiter (ändert die Studie) oder Leser (sieht und exportiert) ein; nur der Besitzer lädt ein und löscht die Studie. | Wünschenswert | Team und Hilfe | Geliefert | [CT-E63](casos-de-teste.md#ct-e63). Seite der Studie › Teilen: Laden Sie das Konto einer anderen Person des Teams als Leser ein. |
| <a id="rf21"></a>RF21 | **Einladung annehmen oder ablehnen** | Wer eingeladen ist, nimmt die Einladung an oder lehnt sie ab, und die Studie erscheint erst nach der Annahme in der eigenen Liste. | Wünschenswert | Team und Hilfe | Geliefert | [CT-E63](casos-de-teste.md#ct-e63). Öffnen Sie mit dem eingeladenen Konto die Glocke und nehmen Sie die Einladung an. |
| <a id="rf22"></a>RF22 | **Benachrichtigungsglocke** | Die Glocke informiert über Einladungen, neue Antworten (zusammengefasst, solange sie ungelesen sind) und Änderungen der Partner. | Wünschenswert | Team und Hilfe | Geliefert | [CT-E63](casos-de-teste.md#ct-e63), [CT-E64](casos-de-teste.md#ct-e64), [CT-M21](casos-de-teste.md#ct-m21). Beantworten Sie den Link einer eigenen Studie und öffnen Sie die Glocke. |
| <a id="rf23"></a>RF23 | **Benachrichtigungen per E-Mail** | Jede Benachrichtigung geht auch per E-Mail hinaus, in der Sprache der empfangenden Person, wenn der Versand konfiguriert ist; die forschende Person schaltet sie unter Mein Konto aus. | Wünschenswert | Team und Hilfe | Geliefert | [CT-U59](casos-de-teste.md#ct-u59). Mein Konto › Benachrichtigungen per E-Mail (der Versand hängt von den SMTP-Variablen in der .env ab). |

### Fragebogen der Teilnehmenden

| ID | Anforderung | Beschreibung | Priorität | Sprint | Status | Wie prüfen |
|---|---|---|---|---|---|---|
| <a id="rf24"></a>RF24 | **Ohne Konto antworten** | Die teilnehmende Person antwortet über den öffentlichen Link, ohne Konto oder Anmeldung, und findet keinen Weg in den Bereich der Forschenden. | Wesentlich | Sprint 05 · Fragebogen | Geliefert | [CT-E05](casos-de-teste.md#ct-e05), [CT-E52](casos-de-teste.md#ct-e52). Öffnen Sie http://localhost:3000/r/exemplo in einem privaten Fenster. |
| <a id="rf25"></a>RF25 | **Einwilligung** | Die teilnehmende Person liest die Einwilligungserklärung (Ziel, geschätzte Dauer, was nach dem Absenden geschieht, Risiken, Nutzen, Aufbewahrung der Daten und wer für die Forschung verantwortlich ist), gibt das Alter an und nimmt erst nach dem Klick auf Ich stimme zu teil; wer jünger als 18 ist, bestätigt die Einwilligung der erziehungsberechtigten Person, Ich möchte nicht teilnehmen verlässt die Seite, ohne etwas zu speichern, und eine Kopie der Einwilligungserklärung kann gedruckt oder als PDF gespeichert werden. | Wesentlich | Sprint 05 · Fragebogen | Geliefert | [CT-E21](casos-de-teste.md#ct-e21), [CT-E28](casos-de-teste.md#ct-e28), [CT-E91](casos-de-teste.md#ct-e91), [CT-E92](casos-de-teste.md#ct-e92). Öffnen Sie den Link der Beispielstudie. |
| <a id="rf26"></a>RF26 | **Teilnehmende auf die Versionen verteilen** | Bei mehr als einer Version geht jede teilnehmende Person zur Version mit den wenigsten abgeschlossenen Antworten; bei Gleichstand zu der mit der kleinsten Reihenfolge. | Wesentlich | Sprint 05 · Fragebogen | Geliefert | [CT-U30](casos-de-teste.md#ct-u30). Beantworten Sie den Link zweimal (in privaten Fenstern) in einer Studie mit 2 Versionen und prüfen Sie den Reiter Antworten. |
| <a id="rf27"></a>RF27 | **Die 26 Items beantworten** | Die teilnehmende Person beantwortet die 26 Items in offizieller Reihenfolge und Polarität, mit der offiziellen Anweisung und 7 Positionen pro Item, keine vorab markiert. | Wesentlich | Sprint 05 · Fragebogen | Geliefert | [CT-E21](casos-de-teste.md#ct-e21), [CT-E24](casos-de-teste.md#ct-e24). Ich stimme zu und möchte teilnehmen: Prüfen Sie die 26 Items. |
| <a id="rf28"></a>RF28 | **Den Fortschritt verfolgen** | Eine fixe Fußzeile zeigt, wie viele der 26 Items bereits beantwortet sind. | Wichtig | Sprint 05 · Fragebogen | Geliefert | [CT-E22](casos-de-teste.md#ct-e22), [CT-M03](casos-de-teste.md#ct-m03). Markieren Sie einige Items und sehen Sie auf die Fußzeile. |
| <a id="rf29"></a>RF29 | **Auf fehlende Items hinweisen** | Beim Absenden mit leeren Items sagt eine Zusammenfassung oben, welche fehlen, mit einem Link zu jedem, und nichts wird gespeichert. | Wesentlich | Sprint 05 · Fragebogen | Geliefert | [CT-E23](casos-de-teste.md#ct-e23). Senden Sie ab, wobei 2 Items leer bleiben, und verwenden Sie die Links der Zusammenfassung. |
| <a id="rf30"></a>RF30 | **Markierte Antworten wiederherstellen** | Wird die Seite neu geladen, kehren die bereits markierten Antworten zurück, und ein Hinweis sagt das. | Wichtig | Sprint 05 · Fragebogen | Geliefert | [CT-E26](casos-de-teste.md#ct-e26). Markieren Sie einige Items und laden Sie die Seite neu. |
| <a id="rf31"></a>RF31 | **Ohne Senden verlassen** | Die teilnehmende Person verlässt den Fragebogen jederzeit über Ohne Senden verlassen, was in einem Fenster bestätigt wird und nichts speichert. | Wesentlich | Sprint 05 · Fragebogen | Geliefert | [CT-E27](casos-de-teste.md#ct-e27). Klicken Sie im Fragebogen auf Ohne Senden verlassen. |
| <a id="rf32"></a>RF32 | **Optionale demografische Daten** | Wenn die Studie sie erhebt, beantwortet die teilnehmende Person Altersgruppe, Geschlecht, Bildungsabschluss und Vertrautheit in festen Kategorien, alle mit Keine Angabe, und kann den ganzen Schritt überspringen. | Wichtig | Sprint 05 · Fragebogen | Geliefert | [CT-E21](casos-de-teste.md#ct-e21). Beantworten Sie in einer Studie mit eingeschalteten demografischen Daten eine Frage und überspringen Sie die anderen. |
| <a id="rf33"></a>RF33 | **Abschließen und nicht erneut antworten** | Nach dem Absenden sieht die teilnehmende Person den Dank, und derselbe Browser sendet keine weitere Antwort für die Studie. | Wesentlich | Sprint 05 · Fragebogen | Geliefert | [CT-E21](casos-de-teste.md#ct-e21), [CT-E28](casos-de-teste.md#ct-e28). Schließen Sie den Fragebogen ab und öffnen Sie den Link im selben Browser erneut. |
| <a id="rf34"></a>RF34 | **In 37 Sprachen antworten** | Der Link öffnet in der Sprache der Studie oder des Browsers, die teilnehmende Person wechselt im Sprachwähler zwischen den 37 offiziellen Sprachen des UEQ, und Sprachen, die von rechts nach links geschrieben werden, drehen die Seite. | Wichtig | Sprachen-Sprint | Geliefert | [CT-E45](casos-de-teste.md#ct-e45), [CT-E46](casos-de-teste.md#ct-e46), [CT-U45](casos-de-teste.md#ct-u45), [CT-U50](casos-de-teste.md#ct-u50). Wechseln Sie in der Einwilligung zu Arabisch oder Japanisch und antworten Sie. |
| <a id="rf35"></a>RF35 | **Die Texte der Studie übersetzen** | Titel, Produkt und Ziel, die die forschende Person geschrieben hat, erscheinen in die Sprache der teilnehmenden Person übersetzt. | Wünschenswert | Sprachen des Tools | Geliefert | [CT-U63](casos-de-teste.md#ct-u63). Öffnen Sie den Link in einer anderen Sprache und prüfen Sie Titel und Ziel (hängt von der ANTHROPIC_API_KEY in der .env ab). |

### Berechnung des UEQ

| ID | Anforderung | Beschreibung | Priorität | Sprint | Status | Wie prüfen |
|---|---|---|---|---|---|---|
| <a id="rf36"></a>RF36 | **Die Antworten umkodieren** | Das Tool wandelt jede Antwort von 1 bis 7 je nach Polarität des Items in -3 bis +3 um. | Wesentlich | Sprint 02 · Berechnung | Geliefert | [CT-U01](casos-de-teste.md#ct-u01), [CT-U02](casos-de-teste.md#ct-u02), [CT-U03](casos-de-teste.md#ct-u03), [CT-U04](casos-de-teste.md#ct-u04), [CT-U05](casos-de-teste.md#ct-u05). Ergebnisse › Exportieren › umkodierte Antworten. |
| <a id="rf37"></a>RF37 | **Statistiken pro Skala** | Für jede Skala und Version berechnet das Tool n, Mittelwert, Stichproben-Standardabweichung, 95-%-Konfidenzintervall und standardisiertes Cronbachs Alpha. | Wesentlich | Sprint 02 · Berechnung | Geliefert | [CT-U07](casos-de-teste.md#ct-u07), [CT-U08](casos-de-teste.md#ct-u08), [CT-U09](casos-de-teste.md#ct-u09), [CT-U10](casos-de-teste.md#ct-u10), [CT-U11](casos-de-teste.md#ct-u11), [CT-U14](casos-de-teste.md#ct-u14). Reiter Ergebnisse, Tabelle der Skalen. |
| <a id="rf38"></a>RF38 | **Die Mittelwerte interpretieren** | Jeder Mittelwert wird als positiv (über +0,8), neutral (von -0,8 bis +0,8) oder negativ (unter -0,8) gelesen. | Wesentlich | Sprint 02 · Berechnung | Geliefert | [CT-U13](casos-de-teste.md#ct-u13). Reiter Ergebnisse, Spalte Interpretation. |
| <a id="rf39"></a>RF39 | **Pragmatische und hedonische Qualität** | Das Tool berechnet die pragmatische Qualität (Mittelwert aus Durchschaubarkeit, Effizienz und Vertrauenswürdigkeit) und die hedonische (Mittelwert aus Stimulation und Originalität). | Wesentlich | Sprint 02 · Berechnung | Geliefert | [CT-U20](casos-de-teste.md#ct-u20). Reiter Ergebnisse, Zeile unter der Tabelle der Skalen. |
| <a id="rf40"></a>RF40 | **Im Benchmark einordnen** | Jeder Mittelwert wird in die 5 Bereiche des offiziellen Benchmarks eingeordnet (ausgezeichnet, gut, über dem Mittelwert, unter dem Mittelwert, schlecht); ein Mittelwert gleich der Grenze fällt in den unteren Bereich. | Wesentlich | Sprint 02 · Berechnung | Geliefert | [CT-U16](casos-de-teste.md#ct-u16), [CT-U17](casos-de-teste.md#ct-u17). Reiter Ergebnisse, Spalte Benchmark. |
| <a id="rf41"></a>RF41 | **Mittelwert pro Item** | Das Tool berechnet den umkodierten Mittelwert und die Verteilung von 1 bis 7 für jedes der 26 Items. | Wichtig | Sprint 02 · Berechnung | Geliefert | [CT-U15](casos-de-teste.md#ct-u15). Reiter Ergebnisse, Diagramm Mittelwerte pro Item. |
| <a id="rf42"></a>RF42 | **Nur mit denen rechnen, die in der Auswertung sind** | Die Statistiken verwenden nur die in die Auswertung aufgenommenen Teilnahmen. | Wesentlich | Sprint 02 · Berechnung | Geliefert | [CT-U18](casos-de-teste.md#ct-u18), [CT-U22](casos-de-teste.md#ct-u22). Nehmen Sie im Reiter Antworten eine Antwort aus der Auswertung und sehen Sie, wie sich n unter Ergebnisse ändert. |

### Ergebnisse

| ID | Anforderung | Beschreibung | Priorität | Sprint | Status | Wie prüfen |
|---|---|---|---|---|---|---|
| <a id="rf43"></a>RF43 | **Ergebnis-Dashboard** | Die forschende Person sieht eine Zusammenfassung der Erhebung, das Diagramm der 6 Skalen mit KI95 und Benchmark-Bereichen und die Tabelle mit denselben Zahlen. | Wesentlich | Sprint 06 · Ergebnisse | Geliefert | [CT-E29](casos-de-teste.md#ct-e29). Beispielstudie › Reiter Ergebnisse. |
| <a id="rf44"></a>RF44 | **Kurzinterpretation** | Ein Satz oben im Dashboard fasst das Ergebnis zusammen: die Skalen nach Benchmark-Bereich und die negativen. | Wichtig | Sprint 06 · Ergebnisse | Geliefert | [CT-U42](casos-de-teste.md#ct-u42). Reiter Ergebnisse, Satz oben. |
| <a id="rf45"></a>RF45 | **Hinweise auf niedriges Alpha und kleine Stichprobe** | Das Dashboard weist darauf hin, wenn das Alpha unter 0,7 liegt und wenn die Stichprobe kein Konfidenzintervall erlaubt, und sagt, was das bedeutet und was zu tun ist. | Wichtig | Sprint 06 · Ergebnisse | Geliefert | [CT-U21](casos-de-teste.md#ct-u21), [CT-E30](casos-de-teste.md#ct-e30). Legen Sie eine Studie mit nur einer Antwort an und öffnen Sie Ergebnisse. |
| <a id="rf46"></a>RF46 | **Diagramm pro Item** | Die forschende Person sieht den Mittelwert jedes Items zwischen den beiden Begriffen, in offizieller Reihenfolge oder nach Skala gruppiert. | Wichtig | Sprint 06 · Ergebnisse | Geliefert | [CT-E29](casos-de-teste.md#ct-e29). Reiter Ergebnisse › Mittelwerte pro Item: die Reihenfolge umschalten. |
| <a id="rf47"></a>RF47 | **Versionen vergleichen** | Bei mehr als einer Version vergleicht die forschende Person die Versionen nebeneinander im selben Diagramm, mit unterschiedlich geformten Markierungen und einer Interpretation der größten Unterschiede. | Wesentlich | Sprint 06 · Ergebnisse | Geliefert | [CT-E29](casos-de-teste.md#ct-e29), [CT-U43](casos-de-teste.md#ct-u43). Reiter Ergebnisse › Versionen vergleichen. |
| <a id="rf48"></a>RF48 | **Die Ansicht in der Adresse speichern** | Die gewählte Version und der Modus (eine Version oder Vergleich) stehen in der Adresse der Seite, um zurückzukehren, neu zu laden und zu teilen. | Wichtig | Sprint 06 · Ergebnisse | Geliefert | [CT-E29](casos-de-teste.md#ct-e29). Wählen Sie Versionen vergleichen und laden Sie die Seite neu. |
| <a id="rf49"></a>RF49 | **Die Begriffe erklären** | Jeder Fachbegriff (Skalen, KI95, Cronbachs Alpha, Benchmark) hat eine kurze Erklärung, die sich nahe der Stelle öffnet, an der er erscheint. | Wichtig | Sprint 06 · Ergebnisse | Geliefert | Reiter Ergebnisse: Öffnen Sie Was ist Durchschaubarkeit? |
| <a id="rf50"></a>RF50 | **Die demografischen Daten ansehen** | Wenn die Studie sie erhebt, zeigt ein Reiter jede demografische Frage in einem Diagramm mit der Tabelle der Zahlen, mit Filter nach Version. | Wünschenswert | LGPD | Geliefert | [CT-E72](casos-de-teste.md#ct-e72), [CT-U60](casos-de-teste.md#ct-u60). In einer Studie mit demografischen Daten Reiter Ergebnisse › Demografische Daten. |

### Antworten und Verdachtsfälle

| ID | Anforderung | Beschreibung | Priorität | Sprint | Status | Wie prüfen |
|---|---|---|---|---|---|---|
| <a id="rf51"></a>RF51 | **Verdächtige Antworten markieren** | Jede Teilnahme wird beim Abschluss als verdächtig markiert, wenn sie 3 oder mehr Skalen mit einer Spannweite größer als 3 oder mehr als 15 gleiche Antworten hat. | Wesentlich | Sprint 07 · Verdächtige Antworten | Geliefert | [CT-U23](casos-de-teste.md#ct-u23), [CT-U25](casos-de-teste.md#ct-u25), [CT-U26](casos-de-teste.md#ct-u26), [CT-U27](casos-de-teste.md#ct-u27), [CT-U28](casos-de-teste.md#ct-u28), [CT-E33](casos-de-teste.md#ct-e33). Beispielstudie › Reiter Antworten › Nur verdächtige. |
| <a id="rf52"></a>RF52 | **Tabelle der Teilnahmen** | Die forschende Person sieht alle Teilnahmen mit Datum, Version, Sprache, Herkunft, inkonsistenten Skalen, größter Anzahl gleicher Antworten, Grund des Verdachts und ob sie in der Auswertung sind, und filtert nur die verdächtigen. | Wesentlich | Sprint 07 · Verdächtige Antworten | Geliefert | [CT-E33](casos-de-teste.md#ct-e33), [CT-E36](casos-de-teste.md#ct-e36). Reiter Antworten. |
| <a id="rf53"></a>RF53 | **Die Skalen einer teilnehmenden Person ansehen** | Beim Öffnen einer Teilnahme sieht die forschende Person die Spannweite jeder Skala, wobei die, die den Schwellenwert überschritten haben, hervorgehoben sind. | Wichtig | Sprint 07 · Verdächtige Antworten | Geliefert | [CT-E35](casos-de-teste.md#ct-e35). Reiter Antworten: Öffnen Sie Skalen ansehen bei einer verdächtigen. |
| <a id="rf54"></a>RF54 | **Antworten aus der Auswertung nehmen und zurückholen** | Die forschende Person nimmt jede Teilnahme aus der Auswertung oder holt sie zurück, oder alle verdächtigen auf einmal, ohne Daten zu löschen, und das Dashboard zeigt, wie viele draußen sind. | Wesentlich | Sprint 07 · Verdächtige Antworten | Geliefert | [CT-E33](casos-de-teste.md#ct-e33), [CT-E34](casos-de-teste.md#ct-e34). Reiter Antworten: Nehmen Sie eine verdächtige aus der Auswertung und wieder hinein. |
| <a id="rf55"></a>RF55 | **Die Verdachtsfälle neu berechnen** | Ein Befehl berechnet die Verdachtsmarkierung aller Teilnahmen neu, nachdem das Team die Schwellenwerte des Protokolls angepasst hat. | Wünschenswert | Sprint 07 · Verdächtige Antworten | Geliefert | [CT-M16](casos-de-teste.md#ct-m16). Terminal: pnpm suspeitas:recalcular. |

### Export und Import

| ID | Anforderung | Beschreibung | Priorität | Sprint | Status | Wie prüfen |
|---|---|---|---|---|---|---|
| <a id="rf56"></a>RF56 | **Rohantworten exportieren** | Die forschende Person lädt eine CSV-Datei mit den Antworten von 1 bis 7 jeder Teilnahme herunter, mit Version und demografischen Daten. | Wesentlich | Sprint 08 · Export | Geliefert | [CT-U35](casos-de-teste.md#ct-u35), [CT-E37](casos-de-teste.md#ct-e37). Reiter Ergebnisse › Exportieren › Rohantworten. |
| <a id="rf57"></a>RF57 | **Umkodierte Antworten exportieren** | Die forschende Person lädt eine CSV-Datei mit den bereits in -3 bis +3 umgewandelten Antworten herunter. | Wesentlich | Sprint 08 · Export | Geliefert | [CT-U37](casos-de-teste.md#ct-u37), [CT-E37](casos-de-teste.md#ct-e37). Reiter Ergebnisse › Exportieren › umkodierte Antworten. |
| <a id="rf58"></a>RF58 | **Ergebnisse pro Skala exportieren** | Die forschende Person lädt eine CSV-Datei mit einer Zeile pro Skala und Version herunter, mit den Statistiken des Dashboards. | Wesentlich | Sprint 08 · Export | Geliefert | [CT-U38](casos-de-teste.md#ct-u38), [CT-E37](casos-de-teste.md#ct-e37). Reiter Ergebnisse › Exportieren › Ergebnisse pro Skala. |
| <a id="rf59"></a>RF59 | **In die offizielle UEQ-Tabelle exportieren** | Die forschende Person lädt die UEQ Data Analysis Tool V15 selbst herunter, gefüllt mit den Teilnahmen in der Auswertung (der im Dashboard gewählten Version oder der ganzen Studie), die beim Öffnen in Excel neu rechnet. | Wesentlich | Sprint 09 · Abschlussprüfung | Geliefert | [CT-U34](casos-de-teste.md#ct-u34), [CT-U70](casos-de-teste.md#ct-u70), [CT-E37](casos-de-teste.md#ct-e37), [CT-E96](casos-de-teste.md#ct-e96). Reiter Ergebnisse › Exportieren › Offizielle UEQ-Tabelle (XLSX); in Excel öffnen und auf Bearbeitung aktivieren klicken. |
| <a id="rf60"></a>RF60 | **Das Dashboard als PDF exportieren** | Die forschende Person lädt das Dashboard der gewählten Version als PDF herunter, mit Titel der Studie, n und Datum in der Kopfzeile. | Wünschenswert | Sprint 10 · Erweiterungen | Geliefert | [CT-E39](casos-de-teste.md#ct-e39), [CT-E40](casos-de-teste.md#ct-e40). Reiter Ergebnisse › Dashboard als PDF. |
| <a id="rf61"></a>RF61 | **Antworten per CSV importieren** | Die forschende Person importiert Antworten im Format der offiziellen Tabelle in eine Version, mit Vorschau und zeilenweise angezeigten Fehlern, und die importierten Antworten bleiben als solche markiert. | Wünschenswert | Sprint 10 · Erweiterungen | Geliefert | [CT-U39](casos-de-teste.md#ct-u39), [CT-U40](casos-de-teste.md#ct-u40), [CT-U41](casos-de-teste.md#ct-u41), [CT-E42](casos-de-teste.md#ct-e42), [CT-E43](casos-de-teste.md#ct-e43). Reiter Antworten › Antworten aus einer CSV-Datei importieren, mit data/fixtures/basico/respostas.csv. |
| <a id="rf62"></a>RF62 | **Den UEQ-S einsetzen** | Die forschende Person wählt beim Erstellen der Studie zwischen dem vollständigen UEQ und dem UEQ-S (Kurzfassung, 8 Items, pragmatische, hedonische und Gesamtqualität). Die Wahl wird bei der ersten Antwort gesperrt, und die Auswertung des UEQ-S steht in einem eigenen Reiter der Ergebnisse, mit seinem Benchmark und seiner offiziellen Tabelle. | Wünschenswert | UEQ-S | Geliefert | [CT-U53](casos-de-teste.md#ct-u53), [CT-U71](casos-de-teste.md#ct-u71), [CT-U72](casos-de-teste.md#ct-u72), [CT-U73](casos-de-teste.md#ct-u73), [CT-U74](casos-de-teste.md#ct-u74), [CT-U75](casos-de-teste.md#ct-u75), [CT-U76](casos-de-teste.md#ct-u76), [CT-E97](casos-de-teste.md#ct-e97), [CT-E98](casos-de-teste.md#ct-e98), [CT-E99](casos-de-teste.md#ct-e99), [CT-E100](casos-de-teste.md#ct-e100), [CT-E101](casos-de-teste.md#ct-e101), [CT-M26](casos-de-teste.md#ct-m26). Legen Sie eine Studie an und wählen Sie unter Fragebogen UEQ-S, Kurzfassung; antworten Sie über den Link und öffnen Sie Ergebnisse › UEQ-S. Die Beispielstudie des UEQ-S (/r/exemplo-curto) hat bereits Antworten. Die 9 Szenarien aus data/fixtures-ueq-s stimmen mit der in Excel neu berechneten offiziellen UEQ-S-Tabelle überein. |

### Dokumentation

| ID | Anforderung | Beschreibung | Priorität | Sprint | Status | Wie prüfen |
|---|---|---|---|---|---|---|
| <a id="rf63"></a>RF63 | **Reiter Dokumentation** | Jede Person, mit oder ohne Konto, liest die Dokumentation des Projekts in einem öffentlichen Reiter, in 7 Abschnitten; ein noch nicht veröffentlichtes Dokument erscheint als In Vorbereitung. | Wichtig | Dokumentations-Sprint | Geliefert | [CT-E47](casos-de-teste.md#ct-e47), [CT-E48](casos-de-teste.md#ct-e48), [CT-E62](casos-de-teste.md#ct-e62), [CT-U54](casos-de-teste.md#ct-u54). Öffnen Sie http://localhost:3000/documentacao ohne Anmeldung. |
| <a id="rf64"></a>RF64 | **Diagramme im Vollbild** | Jedes Diagramm öffnet sich im Vollbild, mit Zoom von 50 % bis 400 % und Verschieben, und schließt mit Zurück oder Esc. | Wichtig | Dokumentations-Sprint | Geliefert | [CT-E57](casos-de-teste.md#ct-e57), [CT-U55](casos-de-teste.md#ct-u55). Öffnen Sie ein Dokument mit Diagramm und klicken Sie darauf. |
| <a id="rf65"></a>RF65 | **Links und Downloads der Dokumentation** | Die Links zwischen Dokumenten führen zum richtigen Anker innerhalb des Tools, und die Dateien des Steckbriefs (CSV, Tabelle, Quellen) lassen sich ohne Konto herunterladen. | Wichtig | Dokumentations-Sprint | Geliefert | [CT-E49](casos-de-teste.md#ct-e49), [CT-E51](casos-de-teste.md#ct-e51), [CT-U56](casos-de-teste.md#ct-u56). Klicken Sie im Reiter Dokumentation auf einen Link zu einem anderen Dokument und auf einen Download. |

### Verwaltung

| ID | Anforderung | Beschreibung | Priorität | Sprint | Status | Wie prüfen |
|---|---|---|---|---|---|---|
| <a id="rf66"></a>RF66 | **Konten verwalten** | Der Superuser öffnet die Seite Verwaltung, sieht die Konten und legt ein Konto für eine andere Person an; wer kein Superuser ist, hat keinen Zugang. | Wünschenswert | Team und Hilfe | Geliefert | Mit einem Administratorkonto Menü Verwaltung › Konten. |
| <a id="rf67"></a>RF67 | **Demo-Szenarien** | Der Superuser legt Demo-Studien mit erfundenen Antworten an, um das Tool vorzustellen. | Wünschenswert | Team und Hilfe | Geliefert | [CT-U61](casos-de-teste.md#ct-u61). Verwaltung › Szenarien. |
| <a id="rf68"></a>RF68 | **Stand des Datenschutzes und der Übersetzungen** | Der Superuser sieht, ob die Feldverschlüsselung eingeschaltet ist und wie viel jeder Sprache bereits übersetzt ist. | Wünschenswert | Sprachen des Tools | Geliefert | Verwaltung › Datenschutz und Verwaltung › Sprachen. |

## Nicht-funktionale Anforderungen

### Barrierefreiheit

| ID | Anforderung | Beschreibung | Priorität | Sprint | Status | Wie prüfen |
|---|---|---|---|---|---|---|
| <a id="rnf01"></a>RNF01 | **WCAG 2.2 AA** | Jeder Bildschirm, auch in den Fehlerzuständen, erfüllt WCAG 2.2 Stufe AA, die Grundlage der ABNT NBR 17225:2025, ohne von axe-core gemeldete Verstöße. | Wesentlich | Sprint 00 · Setup | Geliefert | [CT-E06](casos-de-teste.md#ct-e06), [CT-E14](casos-de-teste.md#ct-e14), [CT-E21](casos-de-teste.md#ct-e21), [CT-E47](casos-de-teste.md#ct-e47). Die End-to-End-Tests führen axe-core auf jedem Bildschirm aus; die manuelle Checkliste ergänzt, was die Automatisierung nicht sieht. |
| <a id="rnf02"></a>RNF02 | **320 px und 400 % Zoom** | Kein Bildschirm scrollt bei 320 px Breite oder bei 400 % Zoom horizontal, und nichts wird abgeschnitten. | Wesentlich | Sprint 05 · Fragebogen | Geliefert | [CT-E25](casos-de-teste.md#ct-e25), [CT-E31](casos-de-teste.md#ct-e31), [CT-E36](casos-de-teste.md#ct-e36), [CT-E44](casos-de-teste.md#ct-e44), [CT-E50](casos-de-teste.md#ct-e50), [CT-M08](casos-de-teste.md#ct-m08). Im Browser 400 % Zoom auf jedem Bildschirm. |
| <a id="rnf03"></a>RNF03 | **Bedienung nur mit der Tastatur** | Jeder Ablauf funktioniert nur mit der Tastatur, mit immer sichtbarem Fokus, in logischer Reihenfolge und nie von der fixen Leiste oder Fußzeile verdeckt. | Wesentlich | Sprint 05 · Fragebogen | Geliefert | [CT-E03](casos-de-teste.md#ct-e03), [CT-E22](casos-de-teste.md#ct-e22), [CT-E54](casos-de-teste.md#ct-e54), [CT-M07](casos-de-teste.md#ct-m07). Durchlaufen Sie Studie erstellen, antworten und exportieren nur mit Tab, Pfeiltasten, Leertaste und Enter. |
| <a id="rnf04"></a>RNF04 | **Screenreader** | Jedes Item des Fragebogens wird mit Nummer, Begriffen und Position angesagt, und jede Ergebnismeldung („Erhebung geöffnet“) wird vom Screenreader angesagt. | Wesentlich | Sprint 05 · Fragebogen | Geliefert | [CT-E24](casos-de-teste.md#ct-e24), [CT-M01](casos-de-teste.md#ct-m01), [CT-M02](casos-de-teste.md#ct-m02), [CT-M04](casos-de-teste.md#ct-m04), [CT-M06](casos-de-teste.md#ct-m06). Beantworten Sie den Fragebogen mit NVDA, VoiceOver oder TalkBack. |
| <a id="rnf05"></a>RNF05 | **Tippfläche** | Jeder Kreis des Fragebogens hat eine Tippfläche von mindestens 44 × 44 px. | Wichtig | Sprint 05 · Fragebogen | Geliefert | [CT-M12](casos-de-teste.md#ct-m12). Antworten Sie auf dem Handy mit dem Daumen. |
| <a id="rnf06"></a>RNF06 | **Kontrast** | Jeder Text hat einen Kontrast von mindestens 4,5:1, und Feldränder, Fokus und Markierungen in Diagrammen von mindestens 3:1. | Wesentlich | Sprint 00 · Setup | Geliefert | [CT-U51](casos-de-teste.md#ct-u51), [CT-U52](casos-de-teste.md#ct-u52). Automatischer Kontrasttest der Farb-Tokens. |
| <a id="rnf07"></a>RNF07 | **Information nicht nur über Farbe** | Keine Information hängt nur von der Farbe ab: Die Diagramme bleiben bei simulierter Farbenblindheit und im Kontrastmodus lesbar. | Wesentlich | Sprint 06 · Ergebnisse | Geliefert | [CT-E32](casos-de-teste.md#ct-e32), [CT-M09](casos-de-teste.md#ct-m09), [CT-M10](casos-de-teste.md#ct-m10). DevTools › Rendering › Emulate vision deficiencies, im Reiter Ergebnisse. |
| <a id="rnf08"></a>RNF08 | **Diagramme mit Textäquivalent** | Jedes Diagramm hat eine Textbeschreibung und eine sichtbare Tabelle mit denselben Zahlen. | Wesentlich | Sprint 06 · Ergebnisse | Geliefert | [CT-E29](casos-de-teste.md#ct-e29), [CT-M05](casos-de-teste.md#ct-m05). Reiter Ergebnisse: Prüfen Sie die Tabelle unter jedem Diagramm. |

### Treue zum Instrument

| ID | Anforderung | Beschreibung | Priorität | Sprint | Status | Wie prüfen |
|---|---|---|---|---|---|---|
| <a id="rnf09"></a>RNF09 | **Fragebogen ohne Verzerrung durch die Oberfläche** | Die 7 Positionen haben dasselbe visuelle Gewicht, ohne Zahl oder abgestufte Farbe, keine ist vorab markiert, und alle Items haben dasselbe Layout. | Wesentlich | Sprint 05 · Fragebogen | Geliefert | [CT-E24](casos-de-teste.md#ct-e24). Prüfen Sie die Items am Computer und auf dem Handy. |
| <a id="rnf10"></a>RNF10 | **Offizielle Begriffe** | Die 26 Begriffspaare verwenden immer die offizielle Übersetzung des Sprachpakets des UEQ, nie eine automatische Übersetzung. | Wesentlich | Sprachen-Sprint | Geliefert | [CT-U45](casos-de-teste.md#ct-u45), [CT-U46](casos-de-teste.md#ct-u46), [CT-U47](casos-de-teste.md#ct-u47). Vergleichen Sie die Begriffe des Fragebogens mit dem offiziellen Sprachpaket des UEQ. |
| <a id="rnf11"></a>RNF11 | **Berechnung gleich der offiziellen Tabelle** | Alle Zahlen des Tools stimmen mit der UEQ Data Analysis Tool überein, mit einer Toleranz von 1e-6. | Wesentlich | Sprint 09 · Abschlussprüfung | Geliefert | [CT-U29](casos-de-teste.md#ct-u29), [CT-E96](casos-de-teste.md#ct-e96), [CT-M15](casos-de-teste.md#ct-m15). Die 11 Szenarien aus data/fixtures stimmen mit der in Excel neu berechneten offiziellen Tabelle überein ([Überprüfung der Berechnung](verificacao-do-calculo.md#comparação-com-a-planilha-oficial)). |

### Sicherheit und Datenschutz

| ID | Anforderung | Beschreibung | Priorität | Sprint | Status | Wie prüfen |
|---|---|---|---|---|---|---|
| <a id="rnf12"></a>RNF12 | **Anonymität der Teilnehmenden** | Das Tool erhebt nichts, was die teilnehmende Person identifiziert: Name, E-Mail-Adresse, IP, detaillierter Browser oder Tracking-Cookie. | Wesentlich | Sprint 05 · Fragebogen | Geliefert | [CT-E21](casos-de-teste.md#ct-e21). Prüfen Sie im Datenbankmodell, dass die Teilnahme diese Felder nicht hat. |
| <a id="rnf13"></a>RNF13 | **Minimale Erhebung** | Die demografischen Daten sind in jeder Studie ausgeschaltet, und begonnene und nicht abgesendete Teilnahmen werden innerhalb von 2 Tagen gelöscht. | Wichtig | LGPD | Geliefert | Legen Sie eine Studie an und prüfen Sie, dass die demografischen Daten ausgeschaltet beginnen. |
| <a id="rnf14"></a>RNF14 | **Verschlüsselung der demografischen Daten** | Die demografischen Daten werden mit AES-256-GCM verschlüsselt gespeichert, mit dem Schlüssel außerhalb der Datenbank. | Wichtig | LGPD | Geliefert | [CT-U58](casos-de-teste.md#ct-u58). Verwaltung › Datenschutz zeigt, ob die Verschlüsselung eingeschaltet ist. |
| <a id="rnf15"></a>RNF15 | **Geschütztes Passwort und geschützte Sitzung** | Die Passwörter werden mit bcrypt gespeichert, die Sitzung verwendet ein Cookie mit httpOnly, Secure und SameSite=Lax, und die Datenbank speichert nur den Hash der Sitzung. | Wesentlich | Sprint 03 · Authentifizierung | Geliefert | [CT-E10](casos-de-teste.md#ct-e10). Prüfen Sie unter DevTools › Application › Cookies die Merkmale des Sitzungscookies. |
| <a id="rnf16"></a>RNF16 | **Begrenzung der Anmeldeversuche** | Nach 5 falschen Passwörtern für dieselbe E-Mail-Adresse in 15 Minuten sperrt das Tool weitere Versuche für eine gewisse Zeit. | Wichtig | LGPD | Geliefert | [CT-E80](casos-de-teste.md#ct-e80). Geben Sie mit demselben Konto 6-mal hintereinander ein falsches Passwort ein. |
| <a id="rnf17"></a>RNF17 | **Zugang nur zu den eigenen Studien** | Jede forschende Person sieht, ändert und exportiert nur die eigenen Studien und die mit ihr geteilten; nicht einmal der Administrator sieht die Studien anderer. | Wesentlich | Sprint 04 · Studien | Geliefert | [CT-E20](casos-de-teste.md#ct-e20), [CT-E38](casos-de-teste.md#ct-e38), [CT-E41](casos-de-teste.md#ct-e41). Öffnen Sie mit einem anderen Konto die Adresse einer Studie, die ihm nicht gehört. |
| <a id="rnf18"></a>RNF18 | **Schutzmechanismen des Browsers** | Das Tool verwendet HTTPS mit HSTS und sendet Content Security Policy und die übrigen Sicherheitsheader. | Wichtig | LGPD | Geliefert | [CT-E73](casos-de-teste.md#ct-e73). In der veröffentlichten Version DevTools › Network › Header der Antwort. |
| <a id="rnf19"></a>RNF19 | **Datenschutzerklärung** | Eine öffentliche Datenschutzerklärung erklärt, was gespeichert wird, wofür und wie es geschützt ist, gemäß LGPD. | Wichtig | LGPD | Geliefert | [CT-E74](casos-de-teste.md#ct-e74), [CT-E75](casos-de-teste.md#ct-e75), [CT-E76](casos-de-teste.md#ct-e76), [CT-E77](casos-de-teste.md#ct-e77), [CT-E78](casos-de-teste.md#ct-e78), [CT-E79](casos-de-teste.md#ct-e79), [CT-E82](casos-de-teste.md#ct-e82), [CT-E83](casos-de-teste.md#ct-e83), [CT-M23](casos-de-teste.md#ct-m23), [CT-M25](casos-de-teste.md#ct-m25). Öffnen Sie http://localhost:3000/privacidade. |

### Gebrauchstauglichkeit

| ID | Anforderung | Beschreibung | Priorität | Sprint | Status | Wie prüfen |
|---|---|---|---|---|---|---|
| <a id="rnf20"></a>RNF20 | **Rückmeldung zu jeder Aktion** | Jede Aktion der Forschenden bestätigt das Ergebnis und die Folge in einer angesagten Meldung („Erhebung geöffnet. Der Link nimmt bereits Antworten an.“). | Wichtig | Sprint 04 · Studien | Geliefert | [CT-E09](casos-de-teste.md#ct-e09), [CT-E15](casos-de-teste.md#ct-e15), [CT-E16](casos-de-teste.md#ct-e16), [CT-M06](casos-de-teste.md#ct-m06). Öffnen Sie die Erhebung einer Studie und lesen Sie die Meldung. |
| <a id="rnf21"></a>RNF21 | **Bestätigung vor Datenverlust** | Abmelden und jede Löschung verlangen eine Bestätigung, die sagt, was passieren wird, und das Löschen von Konto oder Studie verlangt die Eingabe der E-Mail-Adresse oder des Titels. | Wichtig | Sprint 04 · Studien | Geliefert | [CT-E11](casos-de-teste.md#ct-e11), [CT-E19](casos-de-teste.md#ct-e19), [CT-E27](casos-de-teste.md#ct-e27). Versuchen Sie, eine Studie zu löschen. |
| <a id="rnf22"></a>RNF22 | **Brasilianisches Format für Zahlen und Daten** | Auf Portugiesisch verwenden Zahlen das Dezimalkomma und Daten das Format TT/MM/JJJJ, auf dem Bildschirm und in den Exporten. | Wichtig | Sprint 06 · Ergebnisse | Geliefert | [CT-U33](casos-de-teste.md#ct-u33), [CT-U44](casos-de-teste.md#ct-u44). Reiter Ergebnisse und die CSV-Datei der Ergebnisse. |

### Plattform und Wartung

| ID | Anforderung | Beschreibung | Priorität | Sprint | Status | Wie prüfen |
|---|---|---|---|---|---|---|
| <a id="rnf23"></a>RNF23 | **Computer und Handy** | Das Tool funktioniert im Browser am Computer und auf dem Handy; jeder End-to-End-Test läuft auf beiden. | Wesentlich | Sprint 00 · Setup | Geliefert | [CT-M12](casos-de-teste.md#ct-m12). Öffnen Sie den Link der Teilnehmenden auf dem Handy. |
| <a id="rnf24"></a>RNF24 | **Webanwendung mit offenem Quellcode** | Das Tool ist eine Webanwendung (Next.js und PostgreSQL) mit dem Code auf GitHub unter der MIT-Lizenz. | Wesentlich | Sprint 00 · Setup | Geliefert | [CT-M19](casos-de-teste.md#ct-m19). Folgen Sie in einem sauberen Klon dem Abschnitt Como rodar des README. |
| <a id="rnf25"></a>RNF25 | **Isolierte und getestete Berechnung** | Die UEQ-Berechnung liegt in einem Modul mit reinen Funktionen (src/ueq), ohne Datenbank oder Oberfläche, abgedeckt durch Unit-Tests. | Wichtig | Sprint 02 · Berechnung | Geliefert | [CT-U01](casos-de-teste.md#ct-u01), [CT-U12](casos-de-teste.md#ct-u12), [CT-U14](casos-de-teste.md#ct-u14), [CT-U22](casos-de-teste.md#ct-u22). Terminal: pnpm test. |
| <a id="rnf26"></a>RNF26 | **Prüfungen vor dem Integrieren** | Kein Pull Request kommt in main ohne bestandenes Linting, bestandene Typprüfung und bestandene Unit-Tests. | Wichtig | Sprint 00 · Setup | Geliefert | Terminal: pnpm lint && pnpm typecheck && pnpm test. |

## Zusammenfassung

| Typ | Wesentlich | Wichtig | Wünschenswert | Geliefert | Ausstehend | Entfernt | Gesamt |
|---|---|---|---|---|---|---|---|
| Funktional | 31 | 20 | 17 | 68 | 0 | 0 | 68 |
| Nicht funktional | 15 | 11 | 0 | 26 | 0 | 0 | 26 |
| Gesamt | 46 | 31 | 17 | 94 | 0 | 0 | 94 |
