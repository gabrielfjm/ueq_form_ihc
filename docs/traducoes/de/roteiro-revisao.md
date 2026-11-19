# Leitfaden für die Prüfung

Für alle, die das Tool vor der Abgabe prüfen. Er sagt, was zu öffnen ist, was auf jedem Bildschirm zu tun ist, was zu bewerten ist und wie notiert wird.

## Was das Tool ist

Das Tool setzt den User Experience Questionnaire (UEQ) ein und wertet die Antworten aus. Es gibt zwei Zielgruppen:

- **Forschende:** legen eine Studie mit einer oder mehreren Versionen eines Produkts an, teilen einen Link und verfolgen das Ergebnis-Dashboard.
- **Teilnehmende:** öffnen den Link ohne Konto und beantworten die 26 Wortpaare in 3 bis 5 Minuten, in einer der 37 Sprachen des UEQ.

Forschende arbeiten auch im Team, erhalten Hinweise in einer Glocke und können das Tool in jeder der 37 Sprachen verwenden.

## Wie man es öffnet

**In Produktion:** https://ferramenta-ueq.vercel.app. Legen Sie Ihr Konto unter „Konto erstellen“ an. Ohne die Beispielstudie legen Sie eine eigene Studie an oder verwenden die Demo-Szenarien unter Verwaltung, wenn Ihr Konto Administratorrechte hat.

**Auf dem eigenen Rechner:** auf einem Computer mit Docker, Node und pnpm, im Ordner des Repositorys:

```
docker compose up -d
pnpm install
cp .env.example .env
pnpm db:migrate
pnpm db:seed
pnpm dev
```

Öffnen Sie danach http://localhost:3000.

- **Fertiges Konto für Forschende:** `pesquisador@exemplo.com`, Passwort `senha-de-teste`. Es hat bereits das „Estudo de exemplo“ (Beispielstudie) mit 35 Antworten in 2 Versionen, 4 davon verdächtig.
- **Link der Teilnehmenden dieser Studie:** http://localhost:3000/r/exemplo. Jeder Browser antwortet einmal. Um erneut zu antworten, verwenden Sie ein privates Fenster.
- **Um eine andere Sprache im Fragebogen zu sehen:** wechseln Sie im Sprachwähler „Idioma“ der Einwilligung.
- **Um das Tool in einer anderen Sprache zu sehen:** der Sprachwähler in der Leiste („PT“) oder Mein Konto › Sprache. Ohne `ANTHROPIC_API_KEY` bleibt die Oberfläche auf Portugiesisch.

## Die Bildschirme in der Reihenfolge der Nutzung

Führen Sie auf jedem Bildschirm die Aufgabe aus und vergleichen Sie mit dem Prototyp in `docs/prototipos/alta-fidelidade/`.

| # | Bildschirm | Wie man hinkommt | Prototyp | Aufgabe |
|---|---|---|---|---|
| 1 | Startseite | http://localhost:3000 | r16, r16b angemeldet | Erklären Sie nur durch Lesen, was der UEQ ist und was das Tool tut |
| 2 | Anmelden | Schaltfläche „Anmelden“ in der Leiste, öffnet ein Fenster | r17, r18 auf dem Handy | Melden Sie sich mit dem fertigen Konto an, zuerst mit falschem Passwort |
| 3 | Konto erstellen | „Konto erstellen“ im Fenster Anmelden | r19, r2 mit Fehler | Legen Sie ein Konto an und lassen Sie ein Feld leer, dann korrigieren Sie |
| 3a | Datenschutzerklärung | Link in den Zugangsfenstern, in der Fußzeile der Startseite, unter Mein Konto und in der Hilfe | r33 | Öffnen Sie sie über zwei verschiedene Wege und verwenden Sie „Zurück“. Sagen Sie, was mit Ihren Antworten geschieht |
| 3b | Geführte Tour | erster Zugriff eines neuen Kontos | r28, r29 | Folgen Sie einem Teil der Tour, dann überspringen Sie sie |
| 3c | Liste der Studien | Menü „Studien“ | r3 | Finden Sie die Beispielstudie |
| 4 | Studie erstellen | „Studie erstellen“ | r4, r39 während des Sendens, r40 bei der Bestätigung | Legen Sie eine Studie mit 2 Versionen an und klicken Sie zweimal auf Studie erstellen |
| 5 | Studie im Entwurf | nach dem Erstellen | r4b | Öffnen Sie die Erhebung und kopieren Sie den Link |
| 6 | Seite der Studie | Titel der Studie in der Liste | r5 | Beenden Sie die Erhebung und öffnen Sie sie wieder |
| 7 | Einwilligung | der Link der Studie | p1 | Lesen Sie die Einwilligungserklärung und wechseln Sie die Sprache |
| 7a | Datenschutzerklärung im Link der Teilnehmenden | „Datenschutzerklärung“ am Ende der Einwilligungserklärung | p9 | Sagen Sie, was mit Ihren Antworten geschieht, und kehren Sie zur Einwilligungserklärung zurück |
| 8 | Fragebogen | „Ich stimme zu und möchte teilnehmen“ | p7 (Desktop), p2 (Handy), p8 (ohne Senden verlassen) | Beantworten Sie alles und lassen Sie beim ersten Versuch 2 Items leer |
| 9 | Fehlendes Item | unvollständig absenden | p3 | Verwenden Sie die Zusammenfassung, um zu den fehlenden Items zu gelangen |
| 10 | Optionale Angaben | nach dem Absenden, nur wenn die Studie sie erhebt | p4 | Beantworten Sie eine Frage und überspringen Sie die anderen |
| 11 | Ende | „Weiter“ | p5 | — |
| 12 | Geschlossener Link | der Link einer beendeten Studie oder einer Studie im Entwurf | p6 | — |
| 13 | Ergebnisse, eine Version | Reiter „Ergebnisse“ | r6 | Sagen Sie nur durch Hinsehen, welche Skala am besten war und ob sie über dem Benchmark lag |
| 14 | Ergebnisse, Vergleich | „Versionen vergleichen“ | r7 | Sagen Sie, welche Version bei Stimulation besser war |
| 15 | Antworten und Verdachtsfälle | Reiter „Antworten“ | r8 | Zeigen Sie nur die verdächtigen, nehmen Sie eine aus der Auswertung und wieder hinein |
| 15a | Demografische Daten | Unterreiter unter „Ergebnisse“, in einer Studie mit eingeschalteter Erhebung | r31, r32 zum Einschalten der Erhebung | Sagen Sie, welche Altersgruppe am häufigsten war |
| 15b | Teilen | „Teilen“ auf der Seite der Studie | r25 | Laden Sie ein anderes Konto als Leser ein und nehmen Sie in diesem Konto an |
| 15c | Glocke und Benachrichtigungen | Glocke in der Leiste, dann „Alle Benachrichtigungen ansehen“ | r26, r27 | Finden Sie die Einladung und den Hinweis auf neue Antworten |
| 15d | Hilfe zur Seite | Schaltfläche (?) in der Kopfzeile jeder Seite | r30 | Öffnen Sie sie auf zwei Seiten und sagen Sie, ob die Erklärung hilft |
| 16 | Mein Konto | Menü „Mein Konto“ | r9, r35 für die Sprache | Ändern Sie den Namen und laden Sie Ihre Daten herunter |
| 16d | Sprache über die Leiste | Sprachwähler „PT“ in der Leiste, mit und ohne Anmeldung | r41 | Wechseln Sie in eine andere Sprache und zurück zum Portugiesischen, ohne die Seite zu verlassen |
| 16a | Verwaltung | Menü „Verwaltung“, nur für Administratorkonten | r24, r24b, r24c, r34 | Legen Sie ein Konto an und sehen Sie sich die Abdeckung der Sprachen an |
| 16b | Dokumentation | Menü „Dokumentation“, mit und ohne Anmeldung | r10 bis r15, r23, r36 bis r38 | Öffnen Sie ein Dokument, gehen Sie in einen Abschnitt, vergrößern Sie ein Diagramm, folgen Sie einem Link zu einem anderen Dokument und verwenden Sie Zurück |
| 16c | Abmelden und Löschen | „Abmelden“; Studie löschen; Konto löschen | r20, r21, r22 | Brechen Sie ab und bestätigen Sie, auch mit Esc |
| 17 | Exportieren | Ende des Reiters „Ergebnisse“ | r6, Abschnitt 04 | Laden Sie die offizielle UEQ-Tabelle (XLSX) herunter, öffnen Sie sie in Excel und vergleichen Sie mit dem Dashboard; laden Sie das Dashboard als PDF herunter |
| 18 | Antworten importieren | Reiter „Antworten“, „Antworten aus einer CSV-Datei importieren“ | ohne Prototyp | Importieren Sie `data/fixtures/basico/respostas.csv` in eine Version |
| 19 | Dashboard als PDF | „Dashboard als PDF“ | ohne Prototyp | Öffnen Sie das PDF und prüfen Sie, ob es im Bericht verwendbar ist |
| 20 | Sprachwähler | oben in der Einwilligung | ohne Prototyp | Wählen Sie Arabisch oder Japanisch und beantworten Sie den Fragebogen |

Die Bildschirme 18 bis 20 haben keinen Prototyp. Bewerten Sie, ob sie demselben Muster folgen wie die anderen: Schaltflächen, Felder, Tabellen, Meldungen und Tonfall.

## Was zu bewerten ist

Bearbeiten Sie alle drei Bereiche. Die ersten beiden macht jede Person allein; die Zusammenführung erfolgt in der Gruppe.

1. **Heuristische Evaluation.** Suchen Sie auf jedem Bildschirm Probleme anhand der 10 Heuristiken von Nielsen. Vergeben Sie den Schweregrad von 0 bis 4 (Tabelle unten).
2. **Manuelle Checkliste zur Barrierefreiheit.** Verwenden Sie `docs/checklist-manual.md`: Screenreader, nur Tastatur, Zoom, Farbenblindheit und echtes Handy. Die automatischen Tests ersetzen keinen dieser Punkte.
3. **Prüfung der Entscheidungen.** In `docs/rastreabilidade-ihc.md` nennt jede Zeile eine Entscheidung und wo sie erscheint. Prüfen Sie auf dem Bildschirm, ob das stimmt. Der Abschnitt „O que nenhum teste automático cobre“ (was kein automatischer Test abdeckt) listet auf, was am meisten menschliche Aufmerksamkeit braucht.

**Schweregradskala (Nielsen):**

| Note | Bedeutung |
|---|---|
| 0 | Kein Problem der Gebrauchstauglichkeit |
| 1 | Kosmetisch: beheben, wenn Zeit übrig ist |
| 2 | Gering: niedrige Priorität |
| 3 | Schwer: wichtig zu beheben |
| 4 | Katastrophe: vor der Abgabe beheben |

## Wie notiert wird

Eine Zeile pro Problem, in einer gemeinsamen Tabelle des Teams:

| Bildschirm (#) | Heuristik oder WCAG-Kriterium | Was passiert ist | Schweregrad | Vorschlag | Wer es gefunden hat |
|---|---|---|---|---|---|
| 8 | Nielsen 9 | Beispiel: beim unvollständigen Absenden war nicht klar, wie viele Items fehlten | 3 | Die Zahl oben anzeigen | Name |

Notieren Sie, was passiert ist, nicht die Lösung. Wenn Sie nicht sicher sind, ob es ein Problem ist, notieren Sie es trotzdem, mit Schweregrad 1.

## Was bereits automatisch getestet wurde

Sie müssen keine Zeit damit verbringen:

- zu prüfen, ob jeder Bildschirm axe-core besteht;
- zu prüfen, ob kein Bildschirm bei 320 px horizontal scrollt;
- zu prüfen, ob der ganze Ablauf nur mit der Tastatur funktioniert.

Die End-to-End-Tests tun das bereits auf allen Bildschirmen, am Desktop und auf dem Handy. Die Berechnungen des UEQ werden ebenfalls getestet. Auch der Abgleich mit der offiziellen Tabelle ist automatisch: 11 Szenarien in `data/fixtures/` mit den Zahlen der UEQ Data Analysis Tool (`data/fixtures/LEIA-ME.md`).

Was für Sie bleibt, ist das, was nur ein Mensch bewerten kann:

- ob der Bildschirm verständlich ist;
- ob der Text klar ist;
- ob der Screenreader gut klingt;
- ob der Daumen den Kreis trifft;
- ob das Dashboard zum richtigen Schluss führt.

## Bitte besonders beachten

- **Dashboard (Bildschirme 13 und 14):** Kommt jemand, der den UEQ nicht kennt, zum richtigen Schluss?
- **Fragebogen auf dem Handy (Bildschirme 8 und 9):** Antworten Sie im Stehen, mit einer Hand.
- **Sprachen (Bildschirm 20):** Wenn jemand im Team eine andere Sprache als Portugiesisch spricht, prüfen Sie deren Texte. Die Übersetzungen der Bildschirme der Teilnehmenden stammen vom Team, die des Tools von der Claude-API (`docs/idiomas.md`).
- **Geführte Tour (Bildschirm 3b):** Kann jemand, der das Tool nie gesehen hat, ihr folgen?
- **Datenschutzerklärung (Bildschirm 3a):** Versteht eine teilnehmende Person, was mit ihren Antworten geschieht?
- **Bildschirme ohne Prototyp (18 bis 20):** Sie wurden bisher am wenigsten angesehen.
