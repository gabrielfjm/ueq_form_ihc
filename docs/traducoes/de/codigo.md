# Wie der Code geschrieben wird

Das Ziel ist Code, der aussieht, als hätte ihn ein Team geschrieben, das die Domäne kennt, nicht generischer Code. In der Praxis:

## Namen
- Domäne auf Portugiesisch und konsistent mit der Datenbank: `Estudo`, `Versao`, `Participacao`, `Resposta`, `Item`, `Escala`, `Polaridade` (Studie, Version, Teilnahme, Antwort, Item, Skala, Polarität)
- Kein `data`, `info`, `item2`, `handleStuff`, `processData`, `utils.ts`, `helpers.ts`
- Funktionen sagen, was sie berechnen: `mediaPorEscala`, `intervaloConfianca95`, `alfaCronbach`, `marcarSuspeitos`

## Kommentare
- Sie kommentieren nur das **Warum**, nie das **Was**. Verboten: `// Importa o React`, `// Função para calcular a média`, `// Handle error`
- Jede Regel des UEQ-Protokolls im Code nennt die Quelle: `// Handbook UEQ, seção 5: amplitude > 3 indica inconsistência`
- Keine englischen Kommentare gemischt mit portugiesischen
- Kein JSDoc bei offensichtlichen Funktionen

## Struktur
- Eine Datei mit mehr als ~200 Zeilen ist ein Zeichen, dass sie aufgeteilt werden muss
- Eine Komponente tut eine Sache. Datenlogik gehört in eine Server Component oder eine Route, nicht in einen `useEffect` mit `fetch`
- Server Components und Server Actions von Next bevorzugen. Client Component nur dort, wo es Interaktion gibt (Fragebogen, Fenster, Tour, Filter des Dashboards)
- Jeder Zugriff auf eine Studie läuft über `estudoDoPesquisador` oder `filtroDeAcesso`. Eine Studie nie nur über die ID holen
- Eine Schaltfläche, die den Server aufruft, ist `BotaoEnvio`, mit `textoEnviando`. Jede abgeschlossene Aktion wird auf dem Bildschirm bestätigt: `MensagemStatus`, `useAnunciar` oder `?aviso=` auf der Zielseite
- Keine Abstraktionsschichten „für die Zukunft“ (generisches Repository, Factory, Service mit nur einer Funktion)
- Kein `try/catch`, das alles umschließt. Fehler dort behandeln, wo man etwas Sinnvolles damit tun kann
- Kein `any`. Kein `as unknown as`. Typen von Prisma und Zod wiederverwenden, nicht neu deklarieren

## Texte der Oberfläche
- Bildschirmtext der Forschenden wird auf Portugiesisch in `t("…")` geschrieben oder, außerhalb einer Komponente, in `m("…")`. Werte kommen als Platzhalter hinein: `t("{nome} convidou você", { nome })`
- Nach einer Textänderung erzeugt `pnpm i18n:catalogo` die Datei `src/traducao/catalogo.json`. Ein Test schlägt fehl, wenn der Katalog veraltet ist
- Text der Teilnehmenden durchläuft keine automatische Übersetzung: Er kommt in `src/idiomas/textos/`, in die 37 Dateien, und der Typ `TextosParticipante` prüft die Platzhalter
- Um Text ohne `t()` zu finden, mit `TRADUCAO_PSEUDO=1` ausführen: Was ohne ⟦ ⟧ erscheint, ist außen vor geblieben

## Dokumente
- Die `.md`-Datei ist die einzige Quelle, gelesen von GitHub und vom Reiter Dokumentation. Ein neues Dokument kommt in `src/lib/documentacao/catalogo.ts` und erscheint erst auf der Website, nachdem es in die Liste `PRONTOS` aufgenommen wurde
- Jedes Diagramm nennt direkt darunter das verwendete Werkzeug und dessen Version, die Quelldatei zum Herunterladen in `docs/documentacao/fontes/` und die Version des UEQ-Tools, die es darstellt (Commit oder Datum)
- Nach einer Änderung an einem Mermaid-Diagramm erzeugt `pnpm docs:diagramas` das SVG und die Quelldatei neu. Ein Test schlägt fehl, wenn eines von beiden veraltet ist

## Was nicht vorkommen darf
- Vergessene `console.log`
- Auskommentierter Code
- `TODO` ohne Namen und Datum (`// TODO(luiza, 12/11): ...` ist akzeptabel)
- Falsche Daten (Lorem ipsum, „John Doe“, „Acme“) außerhalb von `data/fixtures` und dem Entwicklungs-Seed
- Generische Fehlermeldungen („Something went wrong“, „Ocorreu um erro“). Sagen Sie, was passiert ist und was zu tun ist
- README mit Emojis, Badges und einem Abschnitt „✨ Features“

## Commits
- Klein und häufig, auf Portugiesisch, im Imperativ, ohne Emojis: `calcula alfa de Cronbach por escala`, `valida itens faltando no questionário` (berechnet Cronbachs Alpha pro Skala; prüft fehlende Items im Fragebogen)
- Ein Commit pro logischer Änderung. Kein „update“, „fix“ oder „wip“ allein
- Jedes Mitglied committet, was es geleitet hat, mit dem eigenen Konto

## Tests
- Das Modul `src/ueq/` hat vollständige Abdeckung und Tests gegen `data/fixtures` (Zahlen der offiziellen Tabelle)
- Testnamen auf Portugiesisch, die das Verhalten beschreiben: `it('marca como suspeito quem é inconsistente em 3 escalas')` (markiert als verdächtig, wer in 3 Skalen inkonsistent ist)
- Ein neuer Bildschirm hat einen E2E-Test mit `verificarAcessibilidade` (axe-core), auch in den Fehlerzuständen. Jeder Test läuft am Desktop und auf dem Handy
- Jeder Testfall wird in `docs/documentacao/casos-de-teste.md` und in dessen `.csv` festgehalten
