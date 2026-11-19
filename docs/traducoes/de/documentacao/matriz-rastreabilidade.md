# Rückverfolgbarkeitsmatrix

Jede der 94 Anforderungen ist verknüpft mit dem, wer sie gestellt hat ([Personas](personas.md) und [User Stories](historias-de-usuario.md)), dem, was das Tool leistet ([Anwendungsfälle](casos-de-uso.md)), dem, was die Funktion belegt ([Testfälle](casos-de-teste.md)), dem Sprint, in dem sie geliefert wurde, und dem Code. Dieselbe Matrix steht in [matriz-rastreabilidade.csv](matriz-rastreabilidade.csv) und in der [Anforderungstabelle](planilha-requisitos.xlsx).

## So lesen Sie die Matrix

- Lesen Sie eine Zeile von links nach rechts, um vom Wunsch zum Nachweis zu gelangen: wer es möchte, was das Tool leistet, welcher Test es prüft und wo der Code liegt.
- Lesen Sie sie in umgekehrter Richtung, bevor Sie eine Datei ändern: Suchen Sie den Pfad in der Spalte Code und sehen Sie nach, welche Anforderungen und welche Tests von ihm abhängen.
- **Code** nennt die wichtigsten Dateien ab dem Stammverzeichnis des Repositorys. `(pesquisador)/` steht für `src/app/(ferramenta)/(pesquisador)/` und `(publico)/` steht für `src/app/(ferramenta)/(publico)/`. Ein Pfad, der auf `/` endet, bezeichnet den ganzen Ordner.
- Nicht-funktionale Anforderungen haben keinen Anwendungsfall: Sie gelten für alle Bildschirme.

## Funktionale Anforderungen

### Zugang und Konto

| Anforderung | Stories | Anwendungsfälle | Personas | Testfälle | Sprint | Code |
|---|---|---|---|---|---|---|
| [RF01](requisitos.md#rf01) Konto erstellen | [HU01](historias-de-usuario.md#hu01) | [UC01](casos-de-uso.md#uc01) | [PE01](personas.md#pe01) | [CT-E03](casos-de-teste.md#ct-e03), [CT-E06](casos-de-teste.md#ct-e06), [CT-E07](casos-de-teste.md#ct-e07), [CT-E08](casos-de-teste.md#ct-e08), [CT-E90](casos-de-teste.md#ct-e90) | Sprint 03 · Authentifizierung | `(publico)/_acesso/FormularioCadastro.tsx`, `(publico)/_acesso/acoes.ts`, `src/lib/validacao-conta.ts` |
| [RF02](requisitos.md#rf02) An- und abmelden | [HU01](historias-de-usuario.md#hu01) | [UC02](casos-de-uso.md#uc02) | [PE01](personas.md#pe01) | [CT-E03](casos-de-teste.md#ct-e03), [CT-E06](casos-de-teste.md#ct-e06), [CT-E08](casos-de-teste.md#ct-e08), [CT-E58](casos-de-teste.md#ct-e58), [CT-E90](casos-de-teste.md#ct-e90) | Sprint 03 · Authentifizierung | `(publico)/_acesso/FormularioEntrar.tsx`, `(publico)/_acesso/acoes.ts`, `src/lib/sessao.ts` |
| [RF03](requisitos.md#rf03) Den Bereich der Forschenden schützen | [HU22](historias-de-usuario.md#hu22) | [UC02](casos-de-uso.md#uc02) | [PE02](personas.md#pe02) | [CT-E04](casos-de-teste.md#ct-e04) | Sprint 03 · Authentifizierung | `src/proxy.ts`, `src/lib/sessao.ts` |
| [RF04](requisitos.md#rf04) Kontodaten bearbeiten | [HU17](historias-de-usuario.md#hu17) | [UC03](casos-de-uso.md#uc03) | [PE01](personas.md#pe01) | [CT-E09](casos-de-teste.md#ct-e09) | Sprint 03 · Authentifizierung | `(pesquisador)/conta/FormularioDados.tsx`, `(pesquisador)/conta/acoes.ts` |
| [RF05](requisitos.md#rf05) Das Passwort ändern | [HU22](historias-de-usuario.md#hu22) | [UC03](casos-de-uso.md#uc03) | [PE02](personas.md#pe02) | [CT-E10](casos-de-teste.md#ct-e10) | Sprint 03 · Authentifizierung | `(pesquisador)/conta/FormularioSenha.tsx`, `(pesquisador)/conta/acoes.ts` |
| [RF06](requisitos.md#rf06) Das Konto löschen | [HU17](historias-de-usuario.md#hu17) | [UC03](casos-de-uso.md#uc03) | [PE01](personas.md#pe01) | [CT-E11](casos-de-teste.md#ct-e11) | Sprint 03 · Authentifizierung | `(pesquisador)/conta/ExcluirConta.tsx`, `(pesquisador)/conta/acoes.ts` |
| [RF07](requisitos.md#rf07) Meine Daten herunterladen | [HU17](historias-de-usuario.md#hu17) | [UC03](casos-de-uso.md#uc03) | [PE01](personas.md#pe01) | [CT-E81](casos-de-teste.md#ct-e81) | LGPD | `src/app/api/conta/dados/route.ts` |
| [RF08](requisitos.md#rf08) Die Sprache des Tools wählen | [HU26](historias-de-usuario.md#hu26) | [UC01](casos-de-uso.md#uc01), [UC03](casos-de-uso.md#uc03) | [PE03](personas.md#pe03) | [CT-E67](casos-de-teste.md#ct-e67), [CT-E94](casos-de-teste.md#ct-e94), [CT-E95](casos-de-teste.md#ct-e95), [CT-U62](casos-de-teste.md#ct-u62), [CT-U63](casos-de-teste.md#ct-u63), [CT-U66](casos-de-teste.md#ct-u66), [CT-U67](casos-de-teste.md#ct-u67), [CT-U68](casos-de-teste.md#ct-u68), [CT-U78](casos-de-teste.md#ct-u78) | Sprachen des Tools | `(pesquisador)/SeletorIdioma.tsx`, `(pesquisador)/conta/idioma/`, `src/traducao/` |
| [RF09](requisitos.md#rf09) Geführte Tour beim ersten Zugriff | [HU02](historias-de-usuario.md#hu02) | [UC04](casos-de-uso.md#uc04) | [PE01](personas.md#pe01) | [CT-E66](casos-de-teste.md#ct-e66), [CT-M22](casos-de-teste.md#ct-m22) | Team und Hilfe | `src/componentes/tutorial/` |
| [RF10](requisitos.md#rf10) Hilfe auf jeder Seite | [HU02](historias-de-usuario.md#hu02) | [UC04](casos-de-uso.md#uc04) | [PE01](personas.md#pe01) | [CT-E65](casos-de-teste.md#ct-e65) | Team und Hilfe | `src/componentes/ajuda/BotaoAjuda.tsx`, `src/lib/ajuda.ts` |
| [RF11](requisitos.md#rf11) Startseite | [HU01](historias-de-usuario.md#hu01) | [UC02](casos-de-uso.md#uc02) | [PE01](personas.md#pe01) | [CT-E01](casos-de-teste.md#ct-e01), [CT-E58](casos-de-teste.md#ct-e58), [CT-E59](casos-de-teste.md#ct-e59), [CT-E60](casos-de-teste.md#ct-e60), [CT-E61](casos-de-teste.md#ct-e61), [CT-E69](casos-de-teste.md#ct-e69), [CT-E70](casos-de-teste.md#ct-e70) | Startseite und Dialoge | `(publico)/PaginaInicial.tsx`, `(publico)/conteudo.ts`, `(publico)/_acesso/Acesso.tsx` |

### Studien

| Anforderung | Stories | Anwendungsfälle | Personas | Testfälle | Sprint | Code |
|---|---|---|---|---|---|---|
| [RF12](requisitos.md#rf12) Die Studien auflisten | [HU07](historias-de-usuario.md#hu07) | [UC05](casos-de-uso.md#uc05) | [PE01](personas.md#pe01) | [CT-E12](casos-de-teste.md#ct-e12), [CT-E17](casos-de-teste.md#ct-e17) | Sprint 04 · Studien | `(pesquisador)/estudos/page.tsx`, `src/lib/estudos.ts` |
| [RF13](requisitos.md#rf13) Studie erstellen | [HU03](historias-de-usuario.md#hu03), [HU04](historias-de-usuario.md#hu04) | [UC06](casos-de-uso.md#uc06) | [PE01](personas.md#pe01) | [CT-E13](casos-de-teste.md#ct-e13), [CT-E14](casos-de-teste.md#ct-e14), [CT-E93](casos-de-teste.md#ct-e93), [CT-M14](casos-de-teste.md#ct-m14) | Sprint 04 · Studien | `(pesquisador)/estudos/formulario/`, `(pesquisador)/estudos/acoes.ts`, `src/lib/validacao-estudo.ts` |
| [RF14](requisitos.md#rf14) Studie bearbeiten | [HU15](historias-de-usuario.md#hu15) | [UC07](casos-de-uso.md#uc07) | [PE01](personas.md#pe01) | [CT-E18](casos-de-teste.md#ct-e18) | Sprint 04 · Studien | `(pesquisador)/estudos/[id]/editar/`, `(pesquisador)/estudos/acoes.ts` |
| [RF15](requisitos.md#rf15) Die Erhebung öffnen, beenden und wieder öffnen | [HU06](historias-de-usuario.md#hu06), [HU14](historias-de-usuario.md#hu14) | [UC08](casos-de-uso.md#uc08) | [PE01](personas.md#pe01) | [CT-E15](casos-de-teste.md#ct-e15) | Sprint 04 · Studien | `(pesquisador)/estudos/[id]/BotaoColeta.tsx`, `src/lib/status-estudo.ts`, `src/app/r/[slug]/page.tsx` |
| [RF16](requisitos.md#rf16) Den öffentlichen Link kopieren | [HU06](historias-de-usuario.md#hu06) | [UC09](casos-de-uso.md#uc09) | [PE01](personas.md#pe01) | [CT-E16](casos-de-teste.md#ct-e16) | Sprint 04 · Studien | `(pesquisador)/estudos/[id]/LinkPublico.tsx`, `src/lib/estudos.ts` |
| [RF17](requisitos.md#rf17) Studie löschen | [HU16](historias-de-usuario.md#hu16) | [UC10](casos-de-uso.md#uc10) | [PE01](personas.md#pe01) | [CT-E19](casos-de-teste.md#ct-e19) | Sprint 04 · Studien | `(pesquisador)/estudos/[id]/AcoesEstudo.tsx`, `(pesquisador)/estudos/acoes.ts` |
| [RF18](requisitos.md#rf18) Die Erhebung demografischer Daten einschalten | [HU05](historias-de-usuario.md#hu05) | [UC06](casos-de-uso.md#uc06) | [PE01](personas.md#pe01) | [CT-E71](casos-de-teste.md#ct-e71) | Team und Hilfe | `(pesquisador)/estudos/formulario/FormularioEstudo.tsx`, `src/app/r/[slug]/sobre-voce/` |
| [RF19](requisitos.md#rf19) Die Sprache der Studie wählen | [HU03](historias-de-usuario.md#hu03), [HU27](historias-de-usuario.md#hu27) | [UC06](casos-de-uso.md#uc06) | [PE01](personas.md#pe01), [PE03](personas.md#pe03) | [CT-E45](casos-de-teste.md#ct-e45) | Sprachen des Tools | `(pesquisador)/estudos/formulario/FormularioEstudo.tsx`, `src/idiomas/index.ts` |

### Team und Benachrichtigungen

| Anforderung | Stories | Anwendungsfälle | Personas | Testfälle | Sprint | Code |
|---|---|---|---|---|---|---|
| [RF20](requisitos.md#rf20) Studie teilen | [HU20](historias-de-usuario.md#hu20) | [UC11](casos-de-uso.md#uc11) | [PE02](personas.md#pe02) | [CT-E63](casos-de-teste.md#ct-e63) | Team und Hilfe | `(pesquisador)/estudos/[id]/Compartilhar.tsx`, `(pesquisador)/estudos/[id]/acoes-compartilhar.ts` |
| [RF21](requisitos.md#rf21) Einladung annehmen oder ablehnen | [HU20](historias-de-usuario.md#hu20) | [UC12](casos-de-uso.md#uc12) | [PE02](personas.md#pe02) | [CT-E63](casos-de-teste.md#ct-e63) | Team und Hilfe | `(pesquisador)/SinoNotificacoes.tsx`, `(pesquisador)/notificacoes/acoes.ts` |
| [RF22](requisitos.md#rf22) Benachrichtigungsglocke | [HU07](historias-de-usuario.md#hu07), [HU21](historias-de-usuario.md#hu21) | [UC13](casos-de-uso.md#uc13) | [PE01](personas.md#pe01), [PE02](personas.md#pe02) | [CT-E63](casos-de-teste.md#ct-e63), [CT-E64](casos-de-teste.md#ct-e64), [CT-M21](casos-de-teste.md#ct-m21) | Team und Hilfe | `(pesquisador)/SinoNotificacoes.tsx`, `src/lib/notificacoes.ts` |
| [RF23](requisitos.md#rf23) Benachrichtigungen per E-Mail | [HU21](historias-de-usuario.md#hu21) | [UC03](casos-de-uso.md#uc03), [UC13](casos-de-uso.md#uc13) | [PE02](personas.md#pe02) | [CT-U59](casos-de-teste.md#ct-u59) | Team und Hilfe | `src/lib/email.ts`, `src/lib/modelo-email.ts`, `(pesquisador)/conta/PreferenciaEmail.tsx` |

### Fragebogen der Teilnehmenden

| Anforderung | Stories | Anwendungsfälle | Personas | Testfälle | Sprint | Code |
|---|---|---|---|---|---|---|
| [RF24](requisitos.md#rf24) Ohne Konto antworten | [HU29](historias-de-usuario.md#hu29) | [UC14](casos-de-uso.md#uc14) | [PE04](personas.md#pe04) | [CT-E05](casos-de-teste.md#ct-e05), [CT-E21](casos-de-teste.md#ct-e21), [CT-E52](casos-de-teste.md#ct-e52), [CT-M14](casos-de-teste.md#ct-m14) | Sprint 05 · Fragebogen | `src/app/r/[slug]/`, `src/proxy.ts` |
| [RF25](requisitos.md#rf25) Einwilligung | [HU04](historias-de-usuario.md#hu04), [HU28](historias-de-usuario.md#hu28), [HU37](historias-de-usuario.md#hu37) | [UC14](casos-de-uso.md#uc14) | [PE01](personas.md#pe01), [PE04](personas.md#pe04), [PE07](personas.md#pe07) | [CT-E21](casos-de-teste.md#ct-e21), [CT-E28](casos-de-teste.md#ct-e28), [CT-E82](casos-de-teste.md#ct-e82), [CT-E91](casos-de-teste.md#ct-e91), [CT-E92](casos-de-teste.md#ct-e92), [CT-U69](casos-de-teste.md#ct-u69), [CT-M25](casos-de-teste.md#ct-m25) | Sprint 05 · Fragebogen | `src/app/r/[slug]/Termo.tsx`, `src/app/r/[slug]/termo/`, `src/lib/termo.ts` |
| [RF26](requisitos.md#rf26) Teilnehmende auf die Versionen verteilen | [HU10](historias-de-usuario.md#hu10) | [UC14](casos-de-uso.md#uc14) | [PE01](personas.md#pe01) | [CT-U30](casos-de-teste.md#ct-u30) | Sprint 05 · Fragebogen | `src/lib/balanceamento.ts` |
| [RF27](requisitos.md#rf27) Die 26 Items beantworten | [HU29](historias-de-usuario.md#hu29), [HU35](historias-de-usuario.md#hu35) | [UC14](casos-de-uso.md#uc14) | [PE04](personas.md#pe04), [PE05](personas.md#pe05) | [CT-E21](casos-de-teste.md#ct-e21), [CT-E24](casos-de-teste.md#ct-e24), [CT-M02](casos-de-teste.md#ct-m02), [CT-M17](casos-de-teste.md#ct-m17) | Sprint 05 · Fragebogen | `src/componentes/ItemDiferencial.tsx`, `src/app/r/[slug]/questionario/FormularioQuestionario.tsx` |
| [RF28](requisitos.md#rf28) Den Fortschritt verfolgen | [HU29](historias-de-usuario.md#hu29) | [UC14](casos-de-uso.md#uc14) | [PE04](personas.md#pe04) | [CT-E22](casos-de-teste.md#ct-e22), [CT-M03](casos-de-teste.md#ct-m03) | Sprint 05 · Fragebogen | `src/app/r/[slug]/questionario/RodapeProgresso.tsx` |
| [RF29](requisitos.md#rf29) Auf fehlende Items hinweisen | [HU30](historias-de-usuario.md#hu30) | [UC14](casos-de-uso.md#uc14) | [PE04](personas.md#pe04) | [CT-E23](casos-de-teste.md#ct-e23), [CT-M04](casos-de-teste.md#ct-m04) | Sprint 05 · Fragebogen | `src/app/r/[slug]/questionario/FormularioQuestionario.tsx`, `src/componentes/formulario/ResumoErros.tsx` |
| [RF30](requisitos.md#rf30) Die markierten Antworten wiederherstellen | [HU31](historias-de-usuario.md#hu31) | [UC14](casos-de-uso.md#uc14) | [PE04](personas.md#pe04) | [CT-E26](casos-de-teste.md#ct-e26), [CT-E68](casos-de-teste.md#ct-e68) | Sprint 05 · Fragebogen | `src/app/r/[slug]/questionario/useRascunho.ts` |
| [RF31](requisitos.md#rf31) Ohne Absenden verlassen | [HU32](historias-de-usuario.md#hu32) | [UC17](casos-de-uso.md#uc17) | [PE04](personas.md#pe04) | [CT-E27](casos-de-teste.md#ct-e27) | Sprint 05 · Fragebogen | `src/app/r/[slug]/questionario/FormularioQuestionario.tsx`, `src/app/r/[slug]/saiu/` |
| [RF32](requisitos.md#rf32) Optionale demografische Daten | [HU33](historias-de-usuario.md#hu33) | [UC16](casos-de-uso.md#uc16) | [PE04](personas.md#pe04) | [CT-E21](casos-de-teste.md#ct-e21), [CT-E71](casos-de-teste.md#ct-e71) | Sprint 05 · Fragebogen | `src/app/r/[slug]/sobre-voce/`, `src/lib/demografia.ts` |
| [RF33](requisitos.md#rf33) Abschließen und nicht erneut antworten | [HU34](historias-de-usuario.md#hu34) | [UC14](casos-de-uso.md#uc14) | [PE04](personas.md#pe04) | [CT-E21](casos-de-teste.md#ct-e21), [CT-E28](casos-de-teste.md#ct-e28) | Sprint 05 · Fragebogen | `src/app/r/[slug]/acoes.ts`, `src/app/r/[slug]/fim/`, `src/lib/participacao.ts` |
| [RF34](requisitos.md#rf34) In 37 Sprachen antworten | [HU27](historias-de-usuario.md#hu27), [HU36](historias-de-usuario.md#hu36) | [UC15](casos-de-uso.md#uc15) | [PE03](personas.md#pe03), [PE06](personas.md#pe06) | [CT-E45](casos-de-teste.md#ct-e45), [CT-E46](casos-de-teste.md#ct-e46), [CT-E68](casos-de-teste.md#ct-e68), [CT-E83](casos-de-teste.md#ct-e83), [CT-U45](casos-de-teste.md#ct-u45), [CT-U47](casos-de-teste.md#ct-u47), [CT-U48](casos-de-teste.md#ct-u48), [CT-U49](casos-de-teste.md#ct-u49), [CT-U50](casos-de-teste.md#ct-u50), [CT-M24](casos-de-teste.md#ct-m24) | Sprachen-Sprint | `src/idiomas/`, `src/app/r/[slug]/SeletorIdioma.tsx` |
| [RF35](requisitos.md#rf35) Die Texte der Studie übersetzen | [HU27](historias-de-usuario.md#hu27) | [UC15](casos-de-uso.md#uc15) | [PE03](personas.md#pe03) | [CT-U63](casos-de-teste.md#ct-u63) | Sprachen des Tools | `src/traducao/servidor.ts`, `src/traducao/claude.ts` |

### Berechnung des UEQ

| Anforderung | Stories | Anwendungsfälle | Personas | Testfälle | Sprint | Code |
|---|---|---|---|---|---|---|
| [RF36](requisitos.md#rf36) Die Antworten umcodieren | [HU18](historias-de-usuario.md#hu18) | [UC19](casos-de-uso.md#uc19) | [PE02](personas.md#pe02) | [CT-U01](casos-de-teste.md#ct-u01), [CT-U02](casos-de-teste.md#ct-u02), [CT-U03](casos-de-teste.md#ct-u03), [CT-U04](casos-de-teste.md#ct-u04), [CT-U05](casos-de-teste.md#ct-u05), [CT-U06](casos-de-teste.md#ct-u06) | Sprint 02 · Berechnung | `src/ueq/recodificar.ts` |
| [RF37](requisitos.md#rf37) Statistiken je Skala | [HU18](historias-de-usuario.md#hu18), [HU24](historias-de-usuario.md#hu24) | [UC19](casos-de-uso.md#uc19) | [PE02](personas.md#pe02) | [CT-U07](casos-de-teste.md#ct-u07), [CT-U08](casos-de-teste.md#ct-u08), [CT-U09](casos-de-teste.md#ct-u09), [CT-U10](casos-de-teste.md#ct-u10), [CT-U11](casos-de-teste.md#ct-u11), [CT-U12](casos-de-teste.md#ct-u12), [CT-U14](casos-de-teste.md#ct-u14), [CT-U21](casos-de-teste.md#ct-u21) | Sprint 02 · Berechnung | `src/ueq/estatistica.ts`, `src/ueq/escalas.ts` |
| [RF38](requisitos.md#rf38) Die Mittelwerte interpretieren | [HU08](historias-de-usuario.md#hu08), [HU24](historias-de-usuario.md#hu24) | [UC19](casos-de-uso.md#uc19) | [PE01](personas.md#pe01), [PE02](personas.md#pe02) | [CT-U13](casos-de-teste.md#ct-u13) | Sprint 02 · Berechnung | `src/ueq/escalas.ts` |
| [RF39](requisitos.md#rf39) Pragmatische und hedonische Qualität | [HU24](historias-de-usuario.md#hu24) | [UC19](casos-de-uso.md#uc19) | [PE02](personas.md#pe02) | [CT-U20](casos-de-teste.md#ct-u20) | Sprint 02 · Berechnung | `src/ueq/index.ts`, `src/ueq/itens.ts` |
| [RF40](requisitos.md#rf40) Im Benchmark einordnen | [HU24](historias-de-usuario.md#hu24) | [UC19](casos-de-uso.md#uc19) | [PE02](personas.md#pe02) | [CT-U16](casos-de-teste.md#ct-u16), [CT-U17](casos-de-teste.md#ct-u17), [CT-U20](casos-de-teste.md#ct-u20) | Sprint 02 · Berechnung | `src/ueq/benchmark.ts`, `data/benchmark.json` |
| [RF41](requisitos.md#rf41) Mittelwert je Item | [HU09](historias-de-usuario.md#hu09) | [UC19](casos-de-uso.md#uc19) | [PE01](personas.md#pe01) | [CT-U15](casos-de-teste.md#ct-u15) | Sprint 02 · Berechnung | `src/ueq/escalas.ts` |
| [RF42](requisitos.md#rf42) Nur mit den Teilnehmenden rechnen, die in der Analyse sind | [HU12](historias-de-usuario.md#hu12) | [UC19](casos-de-uso.md#uc19) | [PE01](personas.md#pe01) | [CT-U18](casos-de-teste.md#ct-u18), [CT-U19](casos-de-teste.md#ct-u19), [CT-U22](casos-de-teste.md#ct-u22) | Sprint 02 · Berechnung | `src/ueq/index.ts`, `src/lib/resultados.ts` |

### Ergebnisse

| Anforderung | Stories | Anwendungsfälle | Personas | Testfälle | Sprint | Code |
|---|---|---|---|---|---|---|
| [RF43](requisitos.md#rf43) Ergebnis-Dashboard | [HU08](historias-de-usuario.md#hu08) | [UC18](casos-de-uso.md#uc18) | [PE01](personas.md#pe01) | [CT-E29](casos-de-teste.md#ct-e29), [CT-M14](casos-de-teste.md#ct-m14) | Sprint 06 · Ergebnisse | `(pesquisador)/estudos/[id]/resultados/`, `src/graficos/EscalasComBenchmark.tsx` |
| [RF44](requisitos.md#rf44) Schnellübersicht | [HU08](historias-de-usuario.md#hu08) | [UC18](casos-de-uso.md#uc18) | [PE01](personas.md#pe01) | [CT-U42](casos-de-teste.md#ct-u42) | Sprint 06 · Ergebnisse | `src/lib/leitura-rapida.ts` |
| [RF45](requisitos.md#rf45) Hinweise bei niedrigem Alpha und kleiner Stichprobe | [HU08](historias-de-usuario.md#hu08) | [UC18](casos-de-uso.md#uc18) | [PE01](personas.md#pe01) | [CT-E30](casos-de-teste.md#ct-e30), [CT-U21](casos-de-teste.md#ct-u21) | Sprint 06 · Ergebnisse | `(pesquisador)/estudos/[id]/resultados/VisaoUmaVersao.tsx`, `src/componentes/Avisos.tsx` |
| [RF46](requisitos.md#rf46) Diagramm je Item | [HU09](historias-de-usuario.md#hu09) | [UC18](casos-de-uso.md#uc18) | [PE01](personas.md#pe01) | [CT-E29](casos-de-teste.md#ct-e29) | Sprint 06 · Ergebnisse | `src/graficos/MediasPorItem.tsx` |
| [RF47](requisitos.md#rf47) Versionen vergleichen | [HU10](historias-de-usuario.md#hu10) | [UC20](casos-de-uso.md#uc20) | [PE01](personas.md#pe01) | [CT-E29](casos-de-teste.md#ct-e29), [CT-U43](casos-de-teste.md#ct-u43) | Sprint 06 · Ergebnisse | `(pesquisador)/estudos/[id]/resultados/VisaoComparacao.tsx`, `src/lib/leitura-rapida.ts` |
| [RF48](requisitos.md#rf48) Die Ansicht in der Adresse speichern | [HU10](historias-de-usuario.md#hu10) | [UC18](casos-de-uso.md#uc18) | [PE01](personas.md#pe01) | [CT-E29](casos-de-teste.md#ct-e29) | Sprint 06 · Ergebnisse | `(pesquisador)/estudos/[id]/resultados/ControlesResultados.tsx` |
| [RF49](requisitos.md#rf49) Die Begriffe erklären | [HU08](historias-de-usuario.md#hu08) | [UC18](casos-de-uso.md#uc18) | [PE01](personas.md#pe01) | — | Sprint 06 · Ergebnisse | `(pesquisador)/estudos/[id]/resultados/Explicacoes.tsx` |
| [RF50](requisitos.md#rf50) Die demografischen Daten ansehen | [HU13](historias-de-usuario.md#hu13) | [UC21](casos-de-uso.md#uc21) | [PE01](personas.md#pe01) | [CT-E72](casos-de-teste.md#ct-e72), [CT-U60](casos-de-teste.md#ct-u60) | LGPD | `(pesquisador)/estudos/[id]/resultados/demograficos/`, `src/graficos/Demografia.tsx`, `src/lib/perfil-demografico.ts` |

### Antworten und Verdachtsfälle

| Anforderung | Stories | Anwendungsfälle | Personas | Testfälle | Sprint | Code |
|---|---|---|---|---|---|---|
| [RF51](requisitos.md#rf51) Verdächtige Antworten markieren | [HU12](historias-de-usuario.md#hu12) | [UC24](casos-de-uso.md#uc24) | [PE01](personas.md#pe01) | [CT-E33](casos-de-teste.md#ct-e33), [CT-U19](casos-de-teste.md#ct-u19), [CT-U23](casos-de-teste.md#ct-u23), [CT-U24](casos-de-teste.md#ct-u24), [CT-U25](casos-de-teste.md#ct-u25), [CT-U26](casos-de-teste.md#ct-u26), [CT-U27](casos-de-teste.md#ct-u27), [CT-U28](casos-de-teste.md#ct-u28) | Sprint 07 · Verdächtige Antworten | `src/ueq/inconsistencia.ts`, `data/protocolo.json` |
| [RF52](requisitos.md#rf52) Tabelle der Teilnahmen | [HU12](historias-de-usuario.md#hu12) | [UC23](casos-de-uso.md#uc23) | [PE01](personas.md#pe01) | [CT-E33](casos-de-teste.md#ct-e33), [CT-E36](casos-de-teste.md#ct-e36), [CT-U36](casos-de-teste.md#ct-u36) | Sprint 07 · Verdächtige Antworten | `(pesquisador)/estudos/[id]/respostas/TabelaParticipacoes.tsx`, `src/lib/participacoes.ts` |
| [RF53](requisitos.md#rf53) Die Skalen einer teilnehmenden Person ansehen | [HU12](historias-de-usuario.md#hu12) | [UC23](casos-de-uso.md#uc23) | [PE01](personas.md#pe01) | [CT-E35](casos-de-teste.md#ct-e35) | Sprint 07 · Verdächtige Antworten | `(pesquisador)/estudos/[id]/respostas/TabelaParticipacoes.tsx` |
| [RF54](requisitos.md#rf54) Antworten aus der Analyse herausnehmen und wieder aufnehmen | [HU12](historias-de-usuario.md#hu12) | [UC23](casos-de-uso.md#uc23) | [PE01](personas.md#pe01) | [CT-E33](casos-de-teste.md#ct-e33), [CT-E34](casos-de-teste.md#ct-e34) | Sprint 07 · Verdächtige Antworten | `(pesquisador)/estudos/[id]/respostas/acoes.ts` |
| [RF55](requisitos.md#rf55) Die Verdachtsfälle neu berechnen | [HU39](historias-de-usuario.md#hu39) | [UC32](casos-de-uso.md#uc32) | [PE08](personas.md#pe08) | [CT-M16](casos-de-teste.md#ct-m16) | Sprint 07 · Verdächtige Antworten | `prisma/recalcular-suspeitas.ts` |

### Export und Import

| Anforderung | Stories | Anwendungsfälle | Personas | Testfälle | Sprint | Code |
|---|---|---|---|---|---|---|
| [RF56](requisitos.md#rf56) Rohantworten exportieren | [HU23](historias-de-usuario.md#hu23) | [UC25](casos-de-uso.md#uc25) | [PE02](personas.md#pe02) | [CT-E37](casos-de-teste.md#ct-e37), [CT-U31](casos-de-teste.md#ct-u31), [CT-U32](casos-de-teste.md#ct-u32), [CT-U35](casos-de-teste.md#ct-u35) | Sprint 08 · Export | `src/lib/exportacoes.ts`, `src/app/api/estudos/[id]/exportar/[tipo]/route.ts` |
| [RF57](requisitos.md#rf57) Umcodierte Antworten exportieren | [HU23](historias-de-usuario.md#hu23) | [UC25](casos-de-uso.md#uc25) | [PE02](personas.md#pe02) | [CT-E37](casos-de-teste.md#ct-e37), [CT-U32](casos-de-teste.md#ct-u32), [CT-U37](casos-de-teste.md#ct-u37) | Sprint 08 · Export | `src/lib/exportacoes.ts`, `src/app/api/estudos/[id]/exportar/[tipo]/route.ts` |
| [RF58](requisitos.md#rf58) Ergebnisse je Skala exportieren | [HU11](historias-de-usuario.md#hu11) | [UC25](casos-de-uso.md#uc25) | [PE01](personas.md#pe01) | [CT-E37](casos-de-teste.md#ct-e37), [CT-U32](casos-de-teste.md#ct-u32), [CT-U33](casos-de-teste.md#ct-u33), [CT-U38](casos-de-teste.md#ct-u38) | Sprint 08 · Export | `src/lib/exportacoes.ts`, `src/app/api/estudos/[id]/exportar/[tipo]/route.ts` |
| [RF59](requisitos.md#rf59) In die offizielle UEQ-Tabelle exportieren | [HU18](historias-de-usuario.md#hu18) | [UC25](casos-de-uso.md#uc25) | [PE02](personas.md#pe02) | [CT-E37](casos-de-teste.md#ct-e37), [CT-E96](casos-de-teste.md#ct-e96), [CT-U34](casos-de-teste.md#ct-u34), [CT-U70](casos-de-teste.md#ct-u70) | Sprint 09 · Abschlussprüfung | `src/lib/planilha-oficial.ts`, `src/lib/exportacoes.ts`, `src/app/api/estudos/[id]/exportar/[tipo]/route.ts`, `data/planilha-oficial/` |
| [RF60](requisitos.md#rf60) Das Dashboard als PDF exportieren | [HU11](historias-de-usuario.md#hu11) | [UC22](casos-de-uso.md#uc22) | [PE01](personas.md#pe01) | [CT-E39](casos-de-teste.md#ct-e39), [CT-E40](casos-de-teste.md#ct-e40), [CT-E41](casos-de-teste.md#ct-e41) | Sprint 10 · Erweiterungen | `src/app/api/estudos/[id]/painel-pdf/route.ts`, `(pesquisador)/estudos/[id]/resultados/impressao/` |
| [RF61](requisitos.md#rf61) Antworten per CSV importieren | [HU19](historias-de-usuario.md#hu19) | [UC26](casos-de-uso.md#uc26) | [PE02](personas.md#pe02) | [CT-E42](casos-de-teste.md#ct-e42), [CT-E43](casos-de-teste.md#ct-e43), [CT-E44](casos-de-teste.md#ct-e44), [CT-U36](casos-de-teste.md#ct-u36), [CT-U39](casos-de-teste.md#ct-u39), [CT-U40](casos-de-teste.md#ct-u40), [CT-U41](casos-de-teste.md#ct-u41) | Sprint 10 · Erweiterungen | `(pesquisador)/estudos/[id]/respostas/importar/`, `src/lib/importacao.ts` |
| [RF62](requisitos.md#rf62) Den UEQ-S anwenden | [HU25](historias-de-usuario.md#hu25) | [UC27](casos-de-uso.md#uc27) | [PE02](personas.md#pe02) | [CT-U53](casos-de-teste.md#ct-u53), [CT-U71](casos-de-teste.md#ct-u71), [CT-U72](casos-de-teste.md#ct-u72), [CT-U73](casos-de-teste.md#ct-u73), [CT-U74](casos-de-teste.md#ct-u74), [CT-U75](casos-de-teste.md#ct-u75), [CT-U76](casos-de-teste.md#ct-u76), [CT-U77](casos-de-teste.md#ct-u77), [CT-E97](casos-de-teste.md#ct-e97), [CT-E98](casos-de-teste.md#ct-e98), [CT-E99](casos-de-teste.md#ct-e99), [CT-E100](casos-de-teste.md#ct-e100), [CT-E101](casos-de-teste.md#ct-e101), [CT-E102](casos-de-teste.md#ct-e102), [CT-M26](casos-de-teste.md#ct-m26) | UEQ-S | `src/ueq/ueq-s.ts`, `data/ueq-s-itens-ptbr.json`, `data/ueq-s-idiomas.json`, `data/benchmark-ueq-s.json`, `data/protocolo-ueq-s.json`, `data/fixtures-ueq-s/` |

### Dokumentation

| Anforderung | Stories | Anwendungsfälle | Personas | Testfälle | Sprint | Code |
|---|---|---|---|---|---|---|
| [RF63](requisitos.md#rf63) Registerkarte Dokumentation | [HU44](historias-de-usuario.md#hu44) | [UC28](casos-de-uso.md#uc28) | [PE08](personas.md#pe08) | [CT-E47](casos-de-teste.md#ct-e47), [CT-E48](casos-de-teste.md#ct-e48), [CT-E50](casos-de-teste.md#ct-e50), [CT-E62](casos-de-teste.md#ct-e62), [CT-E84](casos-de-teste.md#ct-e84), [CT-E85](casos-de-teste.md#ct-e85), [CT-E87](casos-de-teste.md#ct-e87), [CT-U54](casos-de-teste.md#ct-u54), [CT-U55](casos-de-teste.md#ct-u55), [CT-U57](casos-de-teste.md#ct-u57), [CT-U64](casos-de-teste.md#ct-u64) | Dokumentations-Sprint | `(publico)/documentacao/`, `src/lib/documentacao/` |
| [RF64](requisitos.md#rf64) Diagramme im Vollbild | [HU44](historias-de-usuario.md#hu44) | [UC28](casos-de-uso.md#uc28) | [PE08](personas.md#pe08) | [CT-E57](casos-de-teste.md#ct-e57), [CT-U55](casos-de-teste.md#ct-u55) | Dokumentations-Sprint | `(publico)/documentacao/ArtigoDocumento.tsx` |
| [RF65](requisitos.md#rf65) Links und Downloads der Dokumentation | [HU44](historias-de-usuario.md#hu44) | [UC28](casos-de-uso.md#uc28) | [PE08](personas.md#pe08) | [CT-E49](casos-de-teste.md#ct-e49), [CT-E51](casos-de-teste.md#ct-e51), [CT-E86](casos-de-teste.md#ct-e86), [CT-U54](casos-de-teste.md#ct-u54), [CT-U56](casos-de-teste.md#ct-u56), [CT-U65](casos-de-teste.md#ct-u65) | Dokumentations-Sprint | `src/lib/documentacao/markdown.ts`, `src/app/api/documentacao/[...caminho]/route.ts` |

### Verwaltung

| Anforderung | Stories | Anwendungsfälle | Personas | Testfälle | Sprint | Code |
|---|---|---|---|---|---|---|
| [RF66](requisitos.md#rf66) Konten verwalten | [HU41](historias-de-usuario.md#hu41) | [UC29](casos-de-uso.md#uc29) | [PE08](personas.md#pe08) | — | Team und Hilfe | `(pesquisador)/administracao/contas/`, `src/lib/administracao.ts` |
| [RF67](requisitos.md#rf67) Demonstrationsszenarien | [HU42](historias-de-usuario.md#hu42) | [UC30](casos-de-uso.md#uc30) | [PE08](personas.md#pe08) | [CT-U61](casos-de-teste.md#ct-u61) | Team und Hilfe | `(pesquisador)/administracao/cenarios/`, `src/lib/cenarios/` |
| [RF68](requisitos.md#rf68) Stand des Datenschutzes und der Übersetzungen | [HU43](historias-de-usuario.md#hu43) | [UC31](casos-de-uso.md#uc31) | [PE08](personas.md#pe08) | — | Sprachen des Tools | `(pesquisador)/administracao/protecao/`, `(pesquisador)/administracao/idiomas/` |

## Nicht-funktionale Anforderungen

### Barrierefreiheit

| Anforderung | Stories | Personas | Testfälle | Sprint | Code |
|---|---|---|---|---|---|
| [RNF01](requisitos.md#rnf01) WCAG 2.2 AA | [HU35](historias-de-usuario.md#hu35) | [PE05](personas.md#pe05) | [CT-E01](casos-de-teste.md#ct-e01), [CT-E06](casos-de-teste.md#ct-e06), [CT-E12](casos-de-teste.md#ct-e12), [CT-E14](casos-de-teste.md#ct-e14), [CT-E21](casos-de-teste.md#ct-e21), [CT-E47](casos-de-teste.md#ct-e47), [CT-E74](casos-de-teste.md#ct-e74), [CT-M11](casos-de-teste.md#ct-m11), [CT-M13](casos-de-teste.md#ct-m13), [CT-M18](casos-de-teste.md#ct-m18) | Sprint 00 · Setup | `tests/e2e/acessibilidade.ts` |
| [RNF02](requisitos.md#rnf02) 320 px und 400 % Zoom | [HU29](historias-de-usuario.md#hu29) | [PE04](personas.md#pe04) | [CT-E25](casos-de-teste.md#ct-e25), [CT-E31](casos-de-teste.md#ct-e31), [CT-E36](casos-de-teste.md#ct-e36), [CT-E44](casos-de-teste.md#ct-e44), [CT-E50](casos-de-teste.md#ct-e50), [CT-E75](casos-de-teste.md#ct-e75), [CT-M08](casos-de-teste.md#ct-m08) | Sprint 05 · Fragebogen | `src/styles/tokens.css`, `src/app/globals.css` |
| [RNF03](requisitos.md#rnf03) Bedienung nur per Tastatur | [HU35](historias-de-usuario.md#hu35) | [PE05](personas.md#pe05) | [CT-E02](casos-de-teste.md#ct-e02), [CT-E03](casos-de-teste.md#ct-e03), [CT-E22](casos-de-teste.md#ct-e22), [CT-E53](casos-de-teste.md#ct-e53), [CT-E54](casos-de-teste.md#ct-e54), [CT-E55](casos-de-teste.md#ct-e55), [CT-E64](casos-de-teste.md#ct-e64), [CT-M07](casos-de-teste.md#ct-m07) | Sprint 05 · Fragebogen | `(pesquisador)/BarraFixa.tsx`, `src/app/globals.css` |
| [RNF04](requisitos.md#rnf04) Screenreader | [HU35](historias-de-usuario.md#hu35) | [PE05](personas.md#pe05) | [CT-E24](casos-de-teste.md#ct-e24), [CT-U48](casos-de-teste.md#ct-u48), [CT-M01](casos-de-teste.md#ct-m01), [CT-M02](casos-de-teste.md#ct-m02), [CT-M03](casos-de-teste.md#ct-m03), [CT-M04](casos-de-teste.md#ct-m04), [CT-M05](casos-de-teste.md#ct-m05), [CT-M06](casos-de-teste.md#ct-m06), [CT-M20](casos-de-teste.md#ct-m20), [CT-M21](casos-de-teste.md#ct-m21), [CT-M22](casos-de-teste.md#ct-m22), [CT-M23](casos-de-teste.md#ct-m23) | Sprint 05 · Fragebogen | `src/componentes/ItemDiferencial.tsx`, `src/componentes/formulario/MensagemStatus.tsx` |
| [RNF05](requisitos.md#rnf05) Touch-Zielgröße | [HU29](historias-de-usuario.md#hu29) | [PE04](personas.md#pe04) | [CT-M12](casos-de-teste.md#ct-m12) | Sprint 05 · Fragebogen | `src/componentes/ItemDiferencial.tsx` |
| [RNF06](requisitos.md#rnf06) Kontrast | [HU29](historias-de-usuario.md#hu29) | [PE04](personas.md#pe04) | [CT-U51](casos-de-teste.md#ct-u51), [CT-U52](casos-de-teste.md#ct-u52), [CT-M10](casos-de-teste.md#ct-m10) | Sprint 00 · Setup | `src/styles/tokens.css` |
| [RNF07](requisitos.md#rnf07) Information nicht nur über die Farbe | [HU08](historias-de-usuario.md#hu08) | [PE01](personas.md#pe01) | [CT-E32](casos-de-teste.md#ct-e32), [CT-U52](casos-de-teste.md#ct-u52), [CT-M09](casos-de-teste.md#ct-m09), [CT-M10](casos-de-teste.md#ct-m10) | Sprint 06 · Ergebnisse | `src/graficos/` |
| [RNF08](requisitos.md#rnf08) Diagramme mit Textäquivalent | [HU08](historias-de-usuario.md#hu08) | [PE01](personas.md#pe01) | [CT-E29](casos-de-teste.md#ct-e29), [CT-M05](casos-de-teste.md#ct-m05) | Sprint 06 · Ergebnisse | `src/graficos/` |

### Treue zum Instrument

| Anforderung | Stories | Personas | Testfälle | Sprint | Code |
|---|---|---|---|---|---|
| [RNF09](requisitos.md#rnf09) Fragebogen ohne Oberflächenverzerrung | [HU18](historias-de-usuario.md#hu18) | [PE02](personas.md#pe02) | [CT-E24](casos-de-teste.md#ct-e24) | Sprint 05 · Fragebogen | `src/componentes/ItemDiferencial.tsx` |
| [RNF10](requisitos.md#rnf10) Offizielle Begriffe | [HU36](historias-de-usuario.md#hu36) | [PE06](personas.md#pe06) | [CT-U45](casos-de-teste.md#ct-u45), [CT-U46](casos-de-teste.md#ct-u46), [CT-U47](casos-de-teste.md#ct-u47), [CT-M17](casos-de-teste.md#ct-m17) | Sprachen-Sprint | `data/ueq-itens-ptbr.json`, `data/ueq-idiomas.json`, `prisma/seed.ts` |
| [RNF11](requisitos.md#rnf11) Berechnung identisch mit der offiziellen Tabelle | [HU18](historias-de-usuario.md#hu18) | [PE02](personas.md#pe02) | [CT-E96](casos-de-teste.md#ct-e96), [CT-M15](casos-de-teste.md#ct-m15), [CT-U29](casos-de-teste.md#ct-u29) | Sprint 09 · Abschlussprüfung | `src/ueq/__tests__/fixtures.test.ts`, `data/fixtures/`, `scripts/planilha-oficial.ps1` |

### Sicherheit und Datenschutz

| Anforderung | Stories | Personas | Testfälle | Sprint | Code |
|---|---|---|---|---|---|
| [RNF12](requisitos.md#rnf12) Anonymität der Teilnehmenden | [HU33](historias-de-usuario.md#hu33) | [PE04](personas.md#pe04) | [CT-E21](casos-de-teste.md#ct-e21) | Sprint 05 · Fragebogen | `prisma/schema.prisma`, `src/lib/participacao.ts` |
| [RNF13](requisitos.md#rnf13) Minimale Datenerhebung | [HU05](historias-de-usuario.md#hu05) | [PE01](personas.md#pe01) | — | LGPD | `prisma/schema.prisma`, `src/app/r/[slug]/acoes.ts` |
| [RNF14](requisitos.md#rnf14) Verschlüsselung der demografischen Daten | [HU05](historias-de-usuario.md#hu05), [HU43](historias-de-usuario.md#hu43) | [PE01](personas.md#pe01), [PE08](personas.md#pe08) | [CT-U58](casos-de-teste.md#ct-u58) | LGPD | `src/lib/cripto.ts`, `prisma/cifrar-dados.ts` |
| [RNF15](requisitos.md#rnf15) Geschütztes Passwort und geschützte Sitzung | [HU22](historias-de-usuario.md#hu22) | [PE02](personas.md#pe02) | [CT-E10](casos-de-teste.md#ct-e10) | Sprint 03 · Authentifizierung | `src/lib/senhas.ts`, `src/lib/sessao.ts`, `src/lib/cookie-sessao.ts` |
| [RNF16](requisitos.md#rnf16) Begrenzung der Anmeldeversuche | [HU22](historias-de-usuario.md#hu22) | [PE02](personas.md#pe02) | [CT-E80](casos-de-teste.md#ct-e80) | LGPD | `src/lib/tentativas.ts` |
| [RNF17](requisitos.md#rnf17) Zugriff nur auf die eigenen Studien | [HU20](historias-de-usuario.md#hu20), [HU41](historias-de-usuario.md#hu41) | [PE02](personas.md#pe02), [PE08](personas.md#pe08) | [CT-E20](casos-de-teste.md#ct-e20), [CT-E38](casos-de-teste.md#ct-e38), [CT-E41](casos-de-teste.md#ct-e41) | Sprint 04 · Studien | `src/lib/estudos.ts` |
| [RNF18](requisitos.md#rnf18) Schutzmechanismen des Browsers | [HU22](historias-de-usuario.md#hu22) | [PE02](personas.md#pe02) | [CT-E73](casos-de-teste.md#ct-e73) | LGPD | `next.config.ts` |
| [RNF19](requisitos.md#rnf19) Datenschutzerklärung | [HU17](historias-de-usuario.md#hu17), [HU28](historias-de-usuario.md#hu28) | [PE01](personas.md#pe01), [PE04](personas.md#pe04) | [CT-E74](casos-de-teste.md#ct-e74), [CT-E75](casos-de-teste.md#ct-e75), [CT-E76](casos-de-teste.md#ct-e76), [CT-E77](casos-de-teste.md#ct-e77), [CT-E78](casos-de-teste.md#ct-e78), [CT-E79](casos-de-teste.md#ct-e79), [CT-E82](casos-de-teste.md#ct-e82), [CT-E83](casos-de-teste.md#ct-e83), [CT-M23](casos-de-teste.md#ct-m23), [CT-M25](casos-de-teste.md#ct-m25) | LGPD | `(publico)/privacidade/`, `src/app/r/[slug]/privacidade/` |

### Benutzbarkeit

| Anforderung | Stories | Personas | Testfälle | Sprint | Code |
|---|---|---|---|---|---|
| [RNF20](requisitos.md#rnf20) Rückmeldung zu jeder Aktion | [HU06](historias-de-usuario.md#hu06) | [PE01](personas.md#pe01) | [CT-E09](casos-de-teste.md#ct-e09), [CT-E15](casos-de-teste.md#ct-e15), [CT-E16](casos-de-teste.md#ct-e16), [CT-E88](casos-de-teste.md#ct-e88), [CT-E89](casos-de-teste.md#ct-e89), [CT-E90](casos-de-teste.md#ct-e90), [CT-M06](casos-de-teste.md#ct-m06), [CT-M13](casos-de-teste.md#ct-m13) | Sprint 04 · Studien | `src/componentes/formulario/MensagemStatus.tsx`, `src/componentes/formulario/BotaoEnvio.tsx` |
| [RNF21](requisitos.md#rnf21) Bestätigung vor Datenverlust | [HU16](historias-de-usuario.md#hu16), [HU32](historias-de-usuario.md#hu32) | [PE01](personas.md#pe01), [PE04](personas.md#pe04) | [CT-E11](casos-de-teste.md#ct-e11), [CT-E19](casos-de-teste.md#ct-e19), [CT-E27](casos-de-teste.md#ct-e27), [CT-M13](casos-de-teste.md#ct-m13), [CT-M20](casos-de-teste.md#ct-m20) | Sprint 04 · Studien | `src/componentes/janela/Confirmacao.tsx` |
| [RNF22](requisitos.md#rnf22) Brasilianisches Format für Zahlen und Datumsangaben | [HU11](historias-de-usuario.md#hu11), [HU23](historias-de-usuario.md#hu23) | [PE01](personas.md#pe01), [PE02](personas.md#pe02) | [CT-U33](casos-de-teste.md#ct-u33), [CT-U44](casos-de-teste.md#ct-u44) | Sprint 06 · Ergebnisse | `src/idiomas/formatar.ts`, `src/lib/csv.ts` |

### Plattform und Wartung

| Anforderung | Stories | Personas | Testfälle | Sprint | Code |
|---|---|---|---|---|---|
| [RNF23](requisitos.md#rnf23) Computer und Mobiltelefon | [HU29](historias-de-usuario.md#hu29) | [PE04](personas.md#pe04) | [CT-E53](casos-de-teste.md#ct-e53), [CT-E55](casos-de-teste.md#ct-e55), [CT-E56](casos-de-teste.md#ct-e56), [CT-M12](casos-de-teste.md#ct-m12) | Sprint 00 · Setup | `playwright.config.ts` |
| [RNF24](requisitos.md#rnf24) Webanwendung mit offenem Quellcode | [HU38](historias-de-usuario.md#hu38) | [PE08](personas.md#pe08) | [CT-M19](casos-de-teste.md#ct-m19) | Sprint 00 · Setup | `LICENSE`, `README.md` |
| [RNF25](requisitos.md#rnf25) Isolierte und getestete Berechnung | [HU40](historias-de-usuario.md#hu40) | [PE08](personas.md#pe08) | [CT-U01](casos-de-teste.md#ct-u01), [CT-U02](casos-de-teste.md#ct-u02), [CT-U07](casos-de-teste.md#ct-u07), [CT-U12](casos-de-teste.md#ct-u12), [CT-U14](casos-de-teste.md#ct-u14), [CT-U22](casos-de-teste.md#ct-u22) | Sprint 02 · Berechnung | `src/ueq/` |
| [RNF26](requisitos.md#rnf26) Prüfungen vor der Integration | [HU40](historias-de-usuario.md#hu40) | [PE08](personas.md#pe08) | — | Sprint 00 · Setup | `package.json` |

## Abdeckung

- **Stories und Anwendungsfälle:** Jede Anforderung hat mindestens eine Story; jede funktionale Anforderung hat mindestens einen Anwendungsfall.
- **Testfälle:** 89 der 94 Anforderungen haben mindestens einen automatischen oder manuellen Testfall. Die übrigen 5 werden über den Schritt „So prüfen Sie es“ der jeweiligen Anforderung geprüft:

| Anforderung | Warum es keinen Testfall gibt | So prüfen Sie es |
|---|---|---|
| [RF49](requisitos.md#rf49) Die Begriffe erklären | Die Erklärungen sind statischer Text neben jedem Begriff; kein Test öffnet sie alle | Registerkarte Ergebnisse: Öffnen Sie Was ist Durchschaubarkeit? |
| [RF66](requisitos.md#rf66) Konten verwalten | Die Verwaltung erfordert ein Superuser-Konto, das die End-to-End-Tests nicht anlegen | Mit einem Administratorkonto, Menü Verwaltung › Konten. |
| [RF68](requisitos.md#rf68) Stand des Datenschutzes und der Übersetzungen | Derselbe Grund wie bei RF66 | Verwaltung › Datenschutz und Verwaltung › Sprachen. |
| [RNF13](requisitos.md#rnf13) Minimale Datenerhebung | Die ausgeschaltete demografische Erhebung wird von [CT-E71](casos-de-teste.md#ct-e71) abgedeckt, aber die Bereinigung abgebrochener Teilnahmen erfordert 2 Tage Wartezeit | Erstellen Sie eine Studie und prüfen Sie, dass die demografischen Daten zunächst ausgeschaltet sind. |
| [RNF26](requisitos.md#rnf26) Prüfungen vor der Integration | Es ist eine Regel des Integrationsprozesses, kein Verhalten des Tools | Terminal: pnpm lint && pnpm typecheck && pnpm test. |

- **Offen:** keine. Die letzte, [RF62](requisitos.md#rf62) (UEQ-S), wurde am 18.11.2026 geliefert.

## Anwendungsfälle

Die Anforderungen, die jeder Anwendungsfall ausübt. Die Diagramme und die Spezifikationen stehen in [Anwendungsfälle](casos-de-uso.md).

| Anwendungsfall | Akteur | Anforderungen |
|---|---|---|
| [UC01](casos-de-uso.md#uc01) Konto erstellen | Besucher | [RF01](requisitos.md#rf01), [RF08](requisitos.md#rf08) |
| [UC02](casos-de-uso.md#uc02) An- und abmelden | Forschende(r) | [RF02](requisitos.md#rf02), [RF03](requisitos.md#rf03), [RF11](requisitos.md#rf11) |
| [UC03](casos-de-uso.md#uc03) Das Konto verwalten | Forschende(r) | [RF04](requisitos.md#rf04), [RF05](requisitos.md#rf05), [RF06](requisitos.md#rf06), [RF07](requisitos.md#rf07), [RF08](requisitos.md#rf08), [RF23](requisitos.md#rf23) |
| [UC04](casos-de-uso.md#uc04) Die Nutzung lernen | Forschende(r) | [RF09](requisitos.md#rf09), [RF10](requisitos.md#rf10) |
| [UC05](casos-de-uso.md#uc05) Studien auflisten | Forschende(r) | [RF12](requisitos.md#rf12) |
| [UC06](casos-de-uso.md#uc06) Studie erstellen | Forschende(r) | [RF13](requisitos.md#rf13), [RF18](requisitos.md#rf18), [RF19](requisitos.md#rf19) |
| [UC07](casos-de-uso.md#uc07) Studie bearbeiten | Forschende(r) | [RF14](requisitos.md#rf14) |
| [UC08](casos-de-uso.md#uc08) Die Erhebung steuern | Forschende(r) | [RF15](requisitos.md#rf15) |
| [UC09](casos-de-uso.md#uc09) Den Link kopieren | Forschende(r) | [RF16](requisitos.md#rf16) |
| [UC10](casos-de-uso.md#uc10) Studie löschen | Forschende(r) | [RF17](requisitos.md#rf17) |
| [UC11](casos-de-uso.md#uc11) Studie teilen | Forschende(r) | [RF20](requisitos.md#rf20) |
| [UC12](casos-de-uso.md#uc12) Auf eine Einladung antworten | Forschende(r) | [RF21](requisitos.md#rf21) |
| [UC13](casos-de-uso.md#uc13) Benachrichtigungen verfolgen | Forschende(r) | [RF22](requisitos.md#rf22), [RF23](requisitos.md#rf23) |
| [UC14](casos-de-uso.md#uc14) Den Fragebogen beantworten | Teilnehmende(r) | [RF24](requisitos.md#rf24), [RF25](requisitos.md#rf25), [RF26](requisitos.md#rf26), [RF27](requisitos.md#rf27), [RF28](requisitos.md#rf28), [RF29](requisitos.md#rf29), [RF30](requisitos.md#rf30), [RF33](requisitos.md#rf33) |
| [UC15](casos-de-uso.md#uc15) Die Sprache wählen | Teilnehmende(r) | [RF34](requisitos.md#rf34), [RF35](requisitos.md#rf35) |
| [UC16](casos-de-uso.md#uc16) Optionale Daten angeben | Teilnehmende(r) | [RF32](requisitos.md#rf32) |
| [UC17](casos-de-uso.md#uc17) Ohne Absenden verlassen | Teilnehmende(r) | [RF31](requisitos.md#rf31) |
| [UC18](casos-de-uso.md#uc18) Ergebnisse ansehen | Forschende(r) | [RF43](requisitos.md#rf43), [RF44](requisitos.md#rf44), [RF45](requisitos.md#rf45), [RF46](requisitos.md#rf46), [RF48](requisitos.md#rf48), [RF49](requisitos.md#rf49) |
| [UC19](casos-de-uso.md#uc19) Die UEQ-Analyse berechnen | (eingeschlossen) | [RF36](requisitos.md#rf36), [RF37](requisitos.md#rf37), [RF38](requisitos.md#rf38), [RF39](requisitos.md#rf39), [RF40](requisitos.md#rf40), [RF41](requisitos.md#rf41), [RF42](requisitos.md#rf42) |
| [UC20](casos-de-uso.md#uc20) Versionen vergleichen | Forschende(r) | [RF47](requisitos.md#rf47) |
| [UC21](casos-de-uso.md#uc21) Die demografischen Daten ansehen | Forschende(r) | [RF50](requisitos.md#rf50) |
| [UC22](casos-de-uso.md#uc22) Das Dashboard als PDF exportieren | Forschende(r) | [RF60](requisitos.md#rf60) |
| [UC23](casos-de-uso.md#uc23) Verdächtige Antworten prüfen | Forschende(r) | [RF52](requisitos.md#rf52), [RF53](requisitos.md#rf53), [RF54](requisitos.md#rf54) |
| [UC24](casos-de-uso.md#uc24) Den Verdacht gegen eine Teilnahme bewerten | (eingeschlossen) | [RF51](requisitos.md#rf51) |
| [UC25](casos-de-uso.md#uc25) Daten exportieren | Forschende(r) | [RF56](requisitos.md#rf56), [RF57](requisitos.md#rf57), [RF58](requisitos.md#rf58), [RF59](requisitos.md#rf59) |
| [UC26](casos-de-uso.md#uc26) Antworten importieren | Forschende(r) | [RF61](requisitos.md#rf61) |
| [UC27](casos-de-uso.md#uc27) Den UEQ-S anwenden | Forschende(r) | [RF62](requisitos.md#rf62) |
| [UC28](casos-de-uso.md#uc28) Die Dokumentation einsehen | Besucher, Forschende(r) | [RF63](requisitos.md#rf63), [RF64](requisitos.md#rf64), [RF65](requisitos.md#rf65) |
| [UC29](casos-de-uso.md#uc29) Konten verwalten | Administrator | [RF66](requisitos.md#rf66) |
| [UC30](casos-de-uso.md#uc30) Demonstrationsszenarien erstellen | Administrator | [RF67](requisitos.md#rf67) |
| [UC31](casos-de-uso.md#uc31) Datenschutz und Übersetzungen ansehen | Administrator | [RF68](requisitos.md#rf68) |
| [UC32](casos-de-uso.md#uc32) Verdachtsfälle neu berechnen | Maintainer | [RF55](requisitos.md#rf55) |
| [UC33](casos-de-uso.md#uc33) Die offiziellen Items laden | Maintainer | [RNF10](requisitos.md#rnf10) |
