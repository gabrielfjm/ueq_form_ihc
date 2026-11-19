# Rückverfolgbarkeit der Entscheidungen zur Oberfläche

Jede Zeile ist eine Entscheidung zur Oberfläche des Tools. Die Tabelle nennt:

- den Grundsatz, der die Entscheidung begründet;
- wo sie im Code steht;
- was belegt, dass sie funktioniert.

Die Tabelle dient drei Zwecken:

- dem Bericht und der Präsentation;
- der Prüfung des Tools, bei der die prüfende Person jede Zeile auf dem Bildschirm kontrolliert ([Leitfaden für die Prüfung](roteiro-revisao.md));
- allen, die am Code arbeiten, damit sie keine Entscheidung rückgängig machen, ohne zu wissen, warum es sie gibt.

**Zitierte Grundsätze:**

- Nielsen (1994), Heuristiken 1 bis 10;
- Shneiderman, goldene Regeln 1 bis 8;
- Norman (2013);
- ISO 9241-110;
- WCAG 2.2 AA, Kriterien nach Nummer;
- Fitts und Hick;
- die Abschnitte von `docs/ihc.md`, zitiert als §.

**Belege:**

- **e2e:** der Titel des Tests in `tests/e2e/<arquivo>.spec.ts` (Testtitel auf Portugiesisch, wie im Code). Alle Tests laufen am Desktop und auf dem Handy, und fast alle durchlaufen axe-core.
- **unit:** ein Test in `src/**/__tests__`.
- **manual:** ein Punkt aus `docs/checklist-manual.md`, den das Team von Hand prüft.

## Teilnehmende: der Fragebogen als Messinstrument

| Entscheidung | Grundsatz | Wo sie steht | Beleg |
|---|---|---|---|
| Kein Kreis ist vorab markiert. Die 7 Positionen sind identisch: ohne Zahl, ohne abgestufte Farbe und ohne hervorgehobene Mitte | §3.1 und §3.2 (Validität des semantischen Differentials, Laugwitz et al. 2008) | `src/componentes/ItemDiferencial.tsx` | e2e questionario: "fluxo completo do participante, com axe em todas as etapas" (null markierte Optionsfelder) |
| Die 26 Items folgen der offiziellen Reihenfolge und Polarität. Die Oberfläche „ordnet“ die Pole nie um | §3.3, UEQ Handbook | `src/app/r/[slug]/questionario/page.tsx` | unit `src/ueq/__tests__`, e2e questionario |
| Auf Arabisch, Hebräisch und Persisch läuft der Text von rechts nach links, aber die Skala bleibt von 1 bis 7 mit dem linken Begriff links, wie in den offiziellen PDFs | §3.3, Norman (natürliches Mapping), WCAG 1.3.2 | `ItemDiferencial.tsx` (`dir="ltr"` in der Zeile), `ItemDiferencial.module.css` | e2e idiomas: "em árabe pelo seletor: página da direita para a esquerda, escala na ordem oficial" |
| Offizielle UEQ-Anweisung oben, in der gewählten Sprache, ohne das Beispiel mit markiertem Kreis | §3.4, Nielsen 2 | `data/ueq-instrucoes.json`, `questionario/page.tsx` | e2e idiomas (Spanisch) |
| Dasselbe Layout für die 26 Items | §3.5 | `ItemDiferencial.tsx`, eine Komponente für alle | e2e questionario: "cada item é um grupo com legenda e 7 rádios com posição e polo" |
| Die teilnehmende Person sieht nie Ergebnisse | §3.6 | die Routen `/r/...` lesen die Auswertung nicht | e2e autenticacao: "participante nunca precisa de sessão" |

## Teilnehmende: der Weg bis zum Ende

| Entscheidung | Grundsatz | Wo sie steht | Beleg |
|---|---|---|---|
| Die Einwilligungserklärung nennt die Dauer (ohne Limit), wie man bis zum Absenden abbricht, dass die Antworten nach dem Absenden nicht zurückgezogen werden können, wie lange sie aufbewahrt werden, die Risiken, den Nutzen, wer für die Forschung verantwortlich ist, mit Institution und Kontakt, und, falls vorhanden, die Ethikkommission. Sie hat eine Kopie zum Drucken oder Speichern | LGPD Art. 9, Resolution CNS 510/2016, Nielsen 1 und 10 | `src/lib/termo.ts`, `src/app/r/[slug]/Termo.tsx`, `src/app/r/[slug]/termo/page.tsx` | e2e questionario: "o termo diz o tempo, como desistir, o que acontece depois de enviar, riscos, benefícios e quem responde, e tem uma via para guardar"; unit: `termo.test.ts` |
| Die Einwilligungserklärung fragt nach dem Alter. Wer jünger als 18 ist, kommt nur weiter, wenn die Einwilligung der erziehungsberechtigten Person bestätigt ist, und der Fehler erscheint in der Einwilligungserklärung selbst, mit dem Fokus auf dem Feld | LGPD Art. 14, Nielsen 9, WCAG 3.3.1 | `src/lib/termo.ts`, `src/app/r/[slug]/acoes.ts` | e2e questionario: "quem tem menos de 18 anos só participa com a autorização do responsável, e sem idade nada é gravado" |
| Das Formular der Studie verlangt verantwortliche Person, Kontakt, Institution, Risiken und Nutzen, mit ausgefüllten Vorschlägen | LGPD Art. 9, WCAG 3.3.7 | `estudos/formulario/FormularioEstudo.tsx`, `src/lib/validacao-estudo.ts` | e2e estudos: "o estudo nasce com o responsável da conta e exige nome, contato e instituição, que vão para o termo" |
| Einwilligung mit einer Hauptaktion. Ablehnen ist ein ebenso sichtbarer Link | Hick, Nielsen 8, §3.7 | `src/app/r/[slug]/page.tsx` | e2e questionario: "não quero participar sai sem gravar…" |
| Die Einwilligungserklärung hat einen Link zur Datenschutzerklärung, auf einer Seite ohne Leiste und ohne Weg zum Tool, die zur Einwilligungserklärung zurückführt | LGPD Art. 9, Nielsen 3 | `src/app/r/[slug]/page.tsx`, `src/app/r/[slug]/privacidade/page.tsx` | e2e questionario: "a política de privacidade abre pelo termo, dentro do link do participante, e volta para ele" |
| Die automatische Übersetzung erhält den Bildschirm jedes Textes, verwendet in jeder Sprache einen einzigen Begriff pro Konzept, nennt die Schaltflächen mit dem Namen, den sie auf dem Bildschirm haben, und durchläuft eine zweite Prüfung. Hat sie andere `{Platzhalter}` als das Original, wird sie verworfen und der Text bleibt auf Portugiesisch | Nielsen 2 und 4, WCAG 3.1.2 | `src/traducao/claude.ts`, `src/traducao/rodadas.ts`, `src/traducao/extrair.ts` | unit: `claude.test.ts`, `rodadas.test.ts`, `catalogo.test.ts` |
| Ohne Übersetzung weist die Datenschutzerklärung in der Sprache der Person darauf hin, dass sie auf Portugiesisch erscheint, und der Text wird mit dem `lang` des Portugiesischen markiert | Nielsen 1, WCAG 3.1.2 | `src/app/r/[slug]/privacidade/page.tsx` | e2e questionario: "sem tradução automática, a política avisa no idioma da pessoa e sai marcada como português" |
| Über die Person wird vor „Ich stimme zu“ nichts gespeichert | §3.7 (Forschungsethik) | `src/app/r/[slug]/acoes.ts` (`consentir`) | e2e questionario |
| Nummerierte Schritte (1 Einwilligung · 2 Fragebogen · 3 Optionale Angaben) | Shneiderman 4, Nielsen 1 | `src/app/r/[slug]/Etapas.tsx` | e2e questionario (aria-current beim Schritt) |
| Jedes Item ist ein fieldset mit Legende. Jeder Kreis nennt Position und Pol („2 von 7, näher an Angenehm“) | WCAG 1.3.1, 4.1.2, 2.5.3 | `ItemDiferencial.tsx` | e2e questionario: "cada item é um grupo…"; manual: Screenreader |
| Tippfläche von 44×44 px, die mitschrumpft, bis sie in 320 px passt | WCAG 2.5.8 und 1.4.10, Fitts | `ItemDiferencial.module.css` | e2e questionario: "em 320 px (zoom de 400%) nenhuma etapa rola na horizontal" |
| Validierung nur beim Absenden, nie bei jedem Item. Die Zusammenfassung erhält den Fokus, sagt „Noch N Begriffspaare offen“ und hat einen Link zu jedem Item | WCAG 3.3.1 und 2.4.3, Nielsen 9, §4.1 | `src/app/r/[slug]/questionario/FormularioQuestionario.tsx` | e2e questionario: "envio incompleto leva o foco ao resumo e os links levam aos itens" |
| Fixe Fußzeile mit dem Fortschritt und „Ohne Senden verlassen“. Das fokussierte Item liegt nie unter der Fußzeile | Nielsen 1, Shneiderman 7, WCAG 2.4.11 | `questionario/RodapeProgresso.tsx` | e2e questionario: "fluxo completo só com teclado, com o foco sempre visível" |
| Der Fortschritt wird nur alle 5 Items und beim Abschluss angesagt | WCAG 4.1.3, §4.1 (den Screenreader nicht überladen) | `FormularioQuestionario.tsx` | manual: Screenreader |
| Neu laden oder zurückgehen löscht nicht, was markiert wurde (Entwurf nur im Tab) | ISO 9241-110 (Robustheit gegen Fehler), Nielsen 3 | `questionario/useRascunho.ts` | e2e questionario: "recarregar a página recupera as respostas marcadas" |
| Ohne Senden verlassen bestätigt in einem Fenster (Fokus auf Weiter beantworten, Esc setzt fort) und löscht die unvollständige Teilnahme | Shneiderman 6, Nielsen 5, §3.7, WCAG 2.4.3 | `RodapeProgresso.tsx`, `src/componentes/janela/Janela.tsx`, `acoes.ts` (`desistir`) | e2e questionario: "sair sem enviar confirma numa janela e não grava nada" |
| Optionale Angaben mit „Keine Angabe“ bei jeder Frage und „Diesen Schritt überspringen“ mit demselben Gewicht wie „Weiter“ | §3.8, Nielsen 3 | `src/app/r/[slug]/sobre-voce/page.tsx`, `src/lib/demografia.ts` | e2e questionario |
| Ein im selben Browser bereits beantworteter Link nimmt keine weitere Sendung an | Nielsen 5 | `src/app/r/[slug]/page.tsx`, `src/lib/participacao.ts` | e2e questionario |
| Ein Link im Entwurf oder beendet erklärt die Situation, statt einen Fehler zu zeigen | Nielsen 9 | `src/app/r/[slug]/page.tsx` (Prototyp p6) | e2e estudos: "abre, encerra e reabre a coleta, e o link público acompanha" |

## Teilnehmende: Sprachen

| Entscheidung | Grundsatz | Wo sie steht | Beleg |
|---|---|---|---|
| Der Link öffnet in der Sprache der Studie, unter den 37 des offiziellen Pakets, auch wenn der Browser auf eine andere Sprache eingestellt ist, und `<html lang>` und `dir` folgen | WCAG 3.1.1 | `src/app/r/[slug]/layout.tsx`, `src/lib/participacao.ts` (`idiomaDoParticipante`) | e2e idiomas: "estudo em espanhol: o link abre no idioma do estudo, mesmo com o navegador em português" |
| Im Sprachwähler ändert die Auswahl nichts: nur die Schaltfläche „Übernehmen“ | WCAG 3.2.2 | `src/app/r/[slug]/SeletorIdioma.tsx` | e2e idiomas (Arabisch) |
| Jede Sprache erscheint im Wähler mit ihrem eigenen Namen und mit `lang` | WCAG 3.1.2 | `SeletorIdioma.tsx` | manual: Screenreader |
| Bei den 9 Sprachen mit nicht freigegebener Übersetzung ein Hinweis in der Einwilligung und eine Markierung für die forschende Person | Nielsen 1, methodische Transparenz | `SeletorIdioma.tsx`, `respostas/TabelaParticipacoes.tsx`, Exporte | e2e idiomas (Arabisch) |
| Alle Bildschirmtexte haben eine Übersetzung, mit denselben Platzhaltern wie die portugiesische Fassung | Shneiderman 2 (universelle Gebrauchstauglichkeit) | `src/idiomas/textos/*.ts`, mit dem Typ `TextosParticipante` | unit `src/idiomas/__tests__/idiomas.test.ts` |
| Der Fragebogen verwendet nur die offiziellen Übersetzungen; Titel, Produkt und Ziel der Studie erscheinen übersetzt und bleiben ohne Übersetzung im Original, mit dessen `lang` markiert | Validität des Instruments (§3), WCAG 3.1.2 | `src/lib/participacao.ts` (`textosDoEstudo`), `src/traducao/servidor.ts` | manual: Prüfung durch Muttersprachler (`docs/idiomas.md`) |

## Forschende: Konto und Studien

| Entscheidung | Grundsatz | Wo sie steht | Beleg |
|---|---|---|---|
| Anmelden erlaubt das Einfügen des Passworts und den Passwortmanager. Schaltfläche „Passwort anzeigen“ mit Ansage | WCAG 3.3.8 und 1.3.5 | `src/componentes/formulario/Campo.tsx` | e2e autenticacao: "Mostrar senha alterna a visibilidade e anuncia o estado" |
| Fehlerzusammenfassung oben, mit Fokus und einem Link zu jedem Feld | WCAG 3.3.1 und 3.3.3, Nielsen 9 | `src/componentes/formulario/ResumoErros.tsx` | e2e autenticacao: "o link do resumo de erros leva ao campo" |
| Eine geschützte Route kehrt nach der Anmeldung dorthin zurück, wo die Person war | Nielsen 3 | `src/proxy.ts` | e2e autenticacao: "rota protegida sem sessão vai para Entrar e volta para ela depois do login" |
| Das bewertete Produkt wird zum Vorschlag für den Namen der ersten Version | WCAG 3.3.7 | `estudos/formulario/FormularioEstudo.tsx` | e2e estudos: "o produto sugere o nome da primeira versão…" |
| Studie oder Konto löschen öffnet ein Fenster, das die Eingabe des Titels oder der E-Mail-Adresse verlangt und sagt, was mitgelöscht wird | Nielsen 5, WCAG 3.3.4 | `estudos/[id]/AcoesEstudo.tsx`, `conta/ExcluirConta.tsx`, `src/componentes/janela/Confirmacao.tsx` | e2e estudos: "excluir pede o título e apaga o estudo"; e2e conta: "excluir a conta exige digitar o e-mail e apaga o acesso" |
| Abmelden und Version entfernen bestätigen ebenfalls in einem Fenster, mit dem Fokus schon auf der Schaltfläche der Aktion | Nielsen 3 und 5, Shneiderman 6 | `(pesquisador)/BarraSuperior.tsx`, `estudos/formulario/ListaVersoes.tsx` | e2e autenticacao: "cadastra, sai e entra de novo usando só o teclado"; e2e estudos: "o produto sugere o nome da primeira versão…" |
| Die Startseite erklärt den UEQ und das Tool: was die Methode ist, wie man die Ergebnisse liest, wie es funktioniert, die Studien und die Danksagungen. Sie ist auch der Bildschirm nach der Anmeldung | Nielsen 2 und 10 | `(publico)/PaginaInicial.tsx` | e2e inicial: "a raiz apresenta a ferramenta para quem não tem sessão e passa no axe" |
| Anmelden und Konto erstellen öffnen sich in einem Fenster über der aktuellen Seite, wechseln zueinander, ohne zu schließen, und passen ohne Scrollen auf den Bildschirm | Nielsen 3, Shneiderman 8, WCAG 1.4.10 | `(publico)/_acesso/Acesso.tsx`, `acesso.module.css` | e2e inicial: "Entrar abre a janela por cima da página, sem rolar, e Esc fecha devolvendo o foco" |
| Das Beenden der Erhebung ist umkehrbar („Wieder öffnen“) und verlangt daher keine Bestätigung | Shneiderman 6 | `estudos/[id]/BotaoColeta.tsx` | e2e estudos: "abre, encerra e reabre a coleta…" |
| Ausgeschriebener Status mit der Folge („Geöffnet · nimmt Antworten an“), immer an derselben Stelle | Nielsen 1 | `src/lib/status-estudo.ts`, `estudos/[id]/FaixaEstudo.tsx` | e2e estudos |
| Jede Aktion bestätigt das Ergebnis in einer Region `role="status"`, die dem Scrollen folgt und bleibt, bis die Person sie schließt. Ein Fehler hat eine andere Farbe und ein anderes Icon | Norman (Rückmeldung), Shneiderman 3, WCAG 4.1.3 und 2.2.1 | `src/componentes/Avisos.tsx`, `formulario/MensagemStatus.tsx` | e2e estudos: "a confirmação pode ser fechada e continua à vista depois de rolar a página"; e2e autenticacao: "criar a conta e entrar confirmam na tela" |
| Während die Aktion läuft, sagt die Schaltfläche, was passiert, und ignoriert weitere Klicks, und das Formular reagiert nicht mehr: Nichts wird doppelt gesendet | Nielsen 1 und 5, WCAG 4.1.3 und 2.4.3 | `formulario/BotaoEnvio.tsx`, `src/app/globals.css` | e2e estudos: "enquanto cria o estudo o botão mostra que está processando, ignora novos cliques e no fim confirma" |
| Eine andere forschende Person sieht die Studie nicht über die Adresse: Die Antwort ist dieselbe wie bei einer nicht existierenden Studie | Schutz der Forschungsdaten | `src/lib/estudos.ts` (`estudoDoPesquisador`) | e2e estudos: "outro pesquisador não vê o estudo pelo endereço"; e2e exportacao |

## Forschende: Team, Hinweise und Hilfe

| Entscheidung | Grundsatz | Wo sie steht | Beleg |
|---|---|---|---|
| Der Besitzer lädt per E-Mail als Bearbeiter oder Leser ein; die Studie erscheint erst nach der Annahme, und der Leser sieht und exportiert nur | Nielsen 5, Kontrolle durch den Benutzer, Schutz der Forschungsdaten | `estudos/[id]/Compartilhar.tsx`, `acoes-compartilhar.ts`, `src/lib/estudos.ts` (`PERMISSOES`) | e2e equipe: "convite por e-mail chega no sino, o leitor só vê e o dono é avisado" |
| Glocke mit der Anzahl der ungelesenen Hinweise, die auch über die Tastatur funktioniert, und Einladungen mit Annehmen und Ablehnen direkt dort | Nielsen 1, Shneiderman 7, WCAG 2.1.1 | `(pesquisador)/sino.module.css`, `notificacoes/page.tsx`, `src/lib/notificacoes.ts` | e2e equipe: "o sino também funciona pelo teclado" |
| Neue Antworten werden zu einem einzigen Hinweis, solange er ungelesen ist: 30 Antworten an einem Vormittag sind nicht 30 Hinweise | Nielsen 8, Gedächtnisbelastung (Shneiderman 8) | `src/lib/notificacoes.ts` (`notificarResposta`) | manual |
| Wer die Aktion ausgeführt hat, wird über die eigene Aktion nicht benachrichtigt, und die E-Mail lässt sich unter Mein Konto ausschalten | Nielsen 8, Shneiderman 7 | `src/lib/notificacoes.ts` (`notificar`) | e2e equipe: "convite por e-mail chega no sino…" |
| Tour nur beim ersten Zugriff, auf den echten Bildschirmen, die durch die Aktion der Person weitergeht und übersprungen und erneut angesehen werden kann | ISO 9241-110 (Erlernbarkeit), Nielsen 3 und 10 | `src/componentes/tutorial/` | e2e equipe: "o tour abre só no primeiro acesso, avança pelo clique na ação e pode ser pulado" |
| Das (?) auf jeder Seite der Forschenden sagt, wozu sie dient und was man darauf tun kann | Nielsen 10 | `src/componentes/ajuda/BotaoAjuda.tsx`, `src/lib/ajuda.ts` | e2e equipe: "toda página do pesquisador tem o (?) com a ajuda dela" |
| Verwaltung und Mein Konto sind Bereiche: Jede Option nennt den aktuellen Stand und öffnet eine eigene Seite | Nielsen 6, Hick, schrittweise Offenlegung | `src/componentes/painel/PainelOpcoes.tsx` | e2e conta; manual |
| Die Oberfläche erscheint in der Sprache des Kontos, und die Sprache wird unter Mein Konto geändert. Solange der größte Teil nicht übersetzt ist, bleibt das `lang` der Seite auf Portugiesisch, damit der Screenreader richtig ausspricht | Shneiderman 2, WCAG 3.1.1 | `src/traducao/servidor.ts` (`idiomaExibido`), `conta/idioma/` | e2e idioma-interface: "o idioma escolhido ao criar a conta vale para a ferramenta e pode ser trocado em Minha conta" |

## Datenschutz

| Entscheidung | Grundsatz | Wo sie steht | Beleg |
|---|---|---|---|
| Die Datenschutzerklärung ist öffentlich und ohne Juristensprache geschrieben, in Zeilen aus Beschriftung und Erklärung, mit einer Zusammenfassung und einem Inhaltsverzeichnis | LGPD Art. 9, Nielsen 2, WCAG 2.4.5 | `(publico)/privacidade/page.tsx` | e2e privacidade: "a política de privacidade é pública e acessível"; "a política leva cada seção pelo índice e não rola na horizontal em 320 px" |
| Das „Zurück“ der Datenschutzerklärung sagt, wohin es führt, funktioniert ohne Verlauf und bringt die Person an den Punkt zurück, von dem sie gekommen ist | Nielsen 3, Shneiderman 7 | `privacidade/Voltar.tsx`, `privacidade/origem.ts` | e2e privacidade: "da página inicial, a política volta ao rodapé de onde a pessoa saiu"; "de Minha conta e da ajuda, a política volta para a mesma tela" |
| Aus den Fenstern Anmelden und Konto erstellen öffnet sich die Datenschutzerklärung in einem anderen Tab, der Name des Links weist darauf hin, und Zurück schließt den Tab, ohne das Eingegebene zu verlieren | Nielsen 3, WCAG 3.2.5 | `_acesso/LinkPrivacidade.tsx`, `privacidade/Voltar.tsx` | e2e privacidade: "das janelas de acesso, a política abre em outra aba, sem perder o que foi digitado, e voltar tenta fechar a aba"; manual: Checkliste, Screenreader |
| Das Ziel des „Zurück“ akzeptiert nur interne Pfade | Sicherheit (offene Weiterleitung) | `src/lib/validacao-conta.ts` (`destinoInterno`) | e2e privacidade: "a política não aceita voltar para outro site" |
| Die demografische Erhebung ist in jeder Studie ausgeschaltet, und das Kästchen erklärt, warum | LGPD Art. 6 (Erforderlichkeit), §3.8 | `estudos/formulario/`, `Estudo.coletarDemografia` | manual: `docs/roteiro-revisao.md` |
| „Meine Daten herunterladen“ liefert eine Datei mit allem, ohne jemanden fragen zu müssen | LGPD Art. 18, Shneiderman 7 | `src/app/api/conta/dados/route.ts`, `conta/FichaConta.tsx` | e2e privacidade: "Baixar meus dados entrega um JSON com a conta e sem a senha" |
| Nach 5 falschen Passwörtern sagt die Meldung, wie lange zu warten ist | Nielsen 9, LGPD Art. 46 | `src/lib/tentativas.ts` | e2e privacidade: "depois de 5 senhas erradas o e-mail espera" |

## Forschende: Ergebnis-Dashboard

| Entscheidung | Grundsatz | Wo sie steht | Beleg |
|---|---|---|---|
| Kurzinterpretation oben ausgeschrieben, und die Interpretation neben jeder Zahl („neutral · Unter dem Mittelwert“) | Nielsen 6, Shneiderman 8 | `src/lib/leitura-rapida.ts`, `resultados/VisaoUmaVersao.tsx` | e2e resultados: "mostra os números do módulo UEQ…" |
| Diagramm mit Textbeschreibung und gleichwertiger Tabelle direkt darunter | WCAG 1.1.1 und 1.3.1 | `src/graficos/EscalasComBenchmark.tsx`, `VisaoUmaVersao.tsx` | e2e resultados (axe); manual: Screenreader |
| Versionen durch Form unterschieden (gefüllter Kreis, hohler…), nicht nur durch Farbe | WCAG 1.4.1 | `EscalasComBenchmark.tsx` | e2e resultados: "gráficos com daltonismo simulado e alto contraste" |
| Skalen gruppiert in Attraktivität, Pragmatisch und Hedonisch | Gestalt (Nähe, gemeinsame Region), konzeptuelles Modell des UEQ | `EscalasComBenchmark.tsx` | e2e resultados |
| Jeder Fachbegriff (Benchmark, KI95, Alpha) nahebei erklärt, in `<details>` | Nielsen 10, schrittweise Offenlegung | `resultados/Explicacoes.tsx` | manual |
| Die Hinweise auf niedriges Alpha und kleine Stichprobe sagen, was sie bedeuten und was zu tun ist | Nielsen 9 | `VisaoUmaVersao.tsx` | e2e resultados: "com uma resposta só avisa que não há intervalo de confiança" |
| Version, Modus und Reihenfolge der Items stehen in der URL: Zurück, Neu laden und Teilen funktionieren | Nielsen 3 | `resultados/ControlesResultados.tsx` | e2e resultados: "…guarda versão e modo na URL" |
| Der Wechsel der Version nimmt dem Wähler nicht den Fokus | WCAG 3.2.2 | `ControlesResultados.tsx` | manual: Tastatur |
| Auf schmalen Bildschirmen scrollt die Tabelle innerhalb einer fokussierbaren Region, und die Seite scrollt nicht | WCAG 1.4.10 und 2.1.1 | `VisaoUmaVersao.tsx`, `VisaoComparacao.tsx` | e2e resultados: "em 320 px o painel não rola na horizontal, nos dois modos" |
| Demografische Daten in einem eigenen Unterreiter, jede Frage im passenden Diagramm, mit „Zahlen ansehen“ | Gestalt, WCAG 1.1.1, schrittweise Offenlegung | `src/graficos/Demografia.tsx`, `resultados/demograficos/` | e2e privacidade: "os dados demográficos aparecem em Resultados, numa sub-aba própria" |
| Dashboard als PDF mit derselben Auswahl wie auf dem Bildschirm, Kopfzeile mit Titel, n und Erstellungsdatum, Vektordiagrammen, A4 mit 18 mm Rändern | Nielsen 4, §4.4 | `resultados/impressao/`, `src/app/api/estudos/[id]/painel-pdf/route.ts` | e2e painel-pdf |

## Forschende: Antworten, Export und Import

| Entscheidung | Grundsatz | Wo sie steht | Beleg |
|---|---|---|---|
| Überblick, wie viele Teilnahmen in und außerhalb der Auswertung sind | Nielsen 1 | `estudos/[id]/respostas/page.tsx` | e2e respostas |
| Aus der Auswertung nehmen entfernt nur aus der Berechnung, löscht nie und lässt sich rückgängig machen | Shneiderman 6, docs/ueq-protocolo.md §7 | `respostas/acoes.ts` | e2e respostas: "incluir e excluir uma participação avisa e nunca apaga" |
| Die Verdachtsregel und die Schwellenwerte stehen sichtbar neben der Liste | Nielsen 6 und 10 | `respostas/page.tsx` | e2e respostas: "a fixture inconsistente sai com as 4 suspeitas da equipe…" |
| Der Filter „Nur verdächtige anzeigen“ steht in der URL | Nielsen 3 | `respostas/TabelaParticipacoes.tsx` | e2e respostas |
| Jeder Export nennt Format, Inhalt und Zweck, mit lesbarem Namen und Datum, und lädt herunter, ohne einen neuen Tab zu öffnen | §4.4, Nielsen 2 | `resultados/SecaoExportar.tsx`, `src/app/api/estudos/[id]/exportar/[tipo]/route.ts` | e2e exportacao: "baixa as 4 exportações com nome datado, BOM e o formato de cada uma" |
| CSV-Import in zwei Schritten: Vorschau der ersten 5 Zeilen oder das Problem jeder Zeile, danach die Bestätigung. Gespeichert wird nur, wenn die ganze Datei gültig ist | Nielsen 5 und 9, Shneiderman 4 und 5 | `respostas/importar/`, `src/lib/importacao.ts` | e2e importacao; unit `src/lib/__tests__/importacao.test.ts` |
| Die importierten Antworten bleiben markiert und ohne Sprache, weil die CSV-Datei die Sprache nicht angibt (nichts wird erfunden) | Nielsen 1, Integrität der Daten | `TabelaParticipacoes.tsx`, `src/lib/exportacoes.ts` | e2e importacao; unit `exportacoes.test.ts` |
| Die Unterseite (Antworten › Importieren) behält den Ursprungsreiter markiert | Nielsen 1, WCAG 2.4.8 (Standort) | `estudos/[id]/AbasEstudo.tsx` | e2e importacao |

## Im ganzen Tool

| Entscheidung | Grundsatz | Wo sie steht | Beleg |
|---|---|---|---|
| Obere Leiste beim Scrollen oben fixiert, am Computer und auf dem Handy: Die Navigation ist immer zur Hand | Nielsen 3 und 6, Shneiderman 7 | `src/app/(ferramenta)/(pesquisador)/BarraFixa.tsx`, `pesquisador.module.css` | e2e barra: "a barra fica fixa no topo ao rolar, com e sem conta" |
| Mit der fixen Leiste halten Fokus und Ankerziele unterhalb von ihr: `scroll-padding-top` mit der gemessenen Höhe der Leiste | WCAG 2.4.11 | `src/app/globals.css`, `BarraFixa.tsx` (`--altura-barra`) | e2e barra: "o foco e as âncoras nunca ficam embaixo da barra fixa" |
| Sprachwähler in der Leiste, mit und ohne Anmeldung: Jede Sprache ist eine Schaltfläche mit ihrem eigenen Namen, nur der Klick wechselt, und die Seite bleibt dieselbe, mit dem Fokus zurück im Wähler | WCAG 3.1.1, 3.2.2 und 2.5.3, Nielsen 7 (Abkürzung zu Mein Konto › Sprache) | `(pesquisador)/SeletorIdioma.tsx`, `seletor-idioma.module.css`, `(pesquisador)/acoes.ts` (`trocarIdioma`) | e2e idioma-interface: "o seletor de idioma da barra troca a ferramenta e a conta sem sair da página" |
| Auf dem Handy liegen die Links hinter der Schaltfläche Menü (`aria-expanded`), die mit Esc schließt und den Fokus zurückgibt, und beim Seitenwechsel | WCAG 2.1.2 und 4.1.2, Nielsen 8 (fixe Leiste mit nur einer Zeile) | `BarraFixa.tsx` | e2e barra: "no celular os links ficam no menu, que fecha com Esc e devolve o foco" |
| Ein langes Dokument öffnet sich als Inhaltsverzeichnis, und jeder Abschnitt auf einer eigenen Seite, mit sichtbarem Diagramm, Zurück und Vorherige/Nächste | Nielsen 3 und 8, schrittweise Offenlegung, WCAG 2.4.5 und 2.4.8 | `documentacao/PaginaSecao.tsx`, `src/lib/documentacao/estrutura.ts`, `paginas.ts` | e2e documentacao: "documento longo abre como índice, e cada seção em página própria com o diagrama à vista" |
| Zurück führt zur Seite, von der die Person kam, auch in einem anderen Dokument, und ohne Verlauf zur übergeordneten Seite | Nielsen 3, Shneiderman 7 | `documentacao/NavegacaoDocumento.tsx` | e2e documentacao: "Voltar leva à página de onde a pessoa veio e, sem histórico, à página de cima" |
| Der Link einer Tabelle führt zur Seite der Zeile und markiert das Ziel | Nielsen 6, WCAG 2.4.4 | `paginas.ts` (`rotaDaAncora`), `texto.module.css` (`:target`) | e2e documentacao: "seção com muitas subseções vira índice, e o link de uma tabela leva à página da linha" |
| Ein Klick auf ein Diagramm der Dokumentation öffnet es im Vollbild in einem nativen `<dialog>`: Zurück fest oben, Esc schließt, und der Fokus kehrt zum Diagramm zurück | WCAG 2.1.2 und 2.4.3, Nielsen 3, Shneiderman 6 | `documentacao/ArtigoDocumento.tsx` | e2e documentacao: "clicar no diagrama abre em tela cheia, com zoom, arrasto, Voltar e Esc" |
| Zoom von 50 % bis 400 % (Schaltflächen, Strg + Mausrad, + und - nur bei geöffnetem Vollbild), zentriert auf den Punkt, den die Person betrachtet hat, und Verschieben durch Ziehen | WCAG 1.4.4 und 2.1.4, Shneiderman 7 | `ArtigoDocumento.tsx`, `ampliado.module.css` | e2e documentacao: "clicar no diagrama abre em tela cheia…" |
| Link „Zum Inhalt springen“ als erstes Tab | WCAG 2.4.1 | `src/app/(ferramenta)/layout.tsx`, `src/app/r/[slug]/layout.tsx` | e2e inicial: "o primeiro Tab leva ao link de pular para o conteúdo" |
| Eindeutiger und aussagekräftiger Seitentitel („Questionário · <estudo>“) | WCAG 2.4.2 | `generateMetadata` jeder Seite | e2e (toHaveTitle in mehreren Tests) |
| Farben als Tokens, mit per Test geprüftem Kontrast | WCAG 1.4.3 und 1.4.11 | `src/styles/tokens.css` | unit `src/styles/__tests__/contraste.test.ts` |
| Dasselbe Muster für Schaltflächen, Felder, Tabellen und Meldungen auf allen Bildschirmen | Nielsen 4, Shneiderman 1 | `src/componentes/formulario/`, `src/styles/` | manual: `docs/roteiro-revisao.md` |
| Bildschirme gleich dem High-Fidelity-Prototyp | Konsistenz mit dem bewerteten Entwurf | `docs/prototipos/alta-fidelidade/` | manual: `docs/roteiro-revisao.md` |

## Was kein automatischer Test abdeckt

Diese Punkte werden von Hand geprüft, in den manuellen Testfällen ([manuelle Checkliste](checklist-manual.md) und [Leitfaden für die Prüfung](roteiro-revisao.md)):

- echte Nutzung mit Screenreader (NVDA, VoiceOver, TalkBack) von Anfang bis Ende;
- 200 % und 400 % Zoom auf einem echten Handy, und der Daumen auf den Kreisen;
- vergrößerte Textabstände (WCAG 1.4.12) und `prefers-reduced-motion`;
- die Qualität der Übersetzungen der Bildschirme der Teilnehmenden und der von der API übersetzten Oberfläche (`docs/idiomas.md`);
- die geführte Tour und die Glocke mit Screenreader;
- das Verständnis des Dashboards durch Personen, die den UEQ nicht kennen.

Die Bildschirme ohne High-Fidelity-Prototyp (der Sprachwähler, Antworten importieren und das Dashboard als PDF) verwenden dieselben Komponenten wie die anderen und werden nach demselben Leitfaden geprüft.
