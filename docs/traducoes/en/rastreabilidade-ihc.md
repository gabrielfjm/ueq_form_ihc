# Traceability of the interface decisions

Each row is an interface decision of the tool. The table gives:

- the principle that justifies the decision;
- where it is in the code;
- what proves that it works.

The table serves three purposes:

- the report and the presentation;
- the review of the tool, in which the reviewer checks each row on screen ([review script](roteiro-revisao.md));
- anyone changing the code, so as not to undo a decision without knowing why.

**Principles cited:**

- Nielsen (1994), heuristics 1 to 10;
- Shneiderman, golden rules 1 to 8;
- Norman (2013);
- ISO 9241-110;
- WCAG 2.2 AA, criteria by number;
- Fitts and Hick;
- the sections of `docs/ihc.md`, cited as §.

**Evidence:**

- **e2e:** the test title in `tests/e2e/<arquivo>.spec.ts`. All tests run on desktop and on mobile, and almost all of them go through axe-core.
- **unit:** a test in `src/**/__tests__`.
- **manual:** an item of `docs/checklist-manual.md`, which the team performs by hand.

## Participant: the questionnaire as a measuring instrument

| Decision | Principle | Where it is | Evidence |
|---|---|---|---|
| No circle comes marked. The 7 positions are identical: no numbers, no graded color and no highlighted middle | §3.1 and §3.2 (validity of the semantic differential, Laugwitz et al. 2008) | `src/componentes/ItemDiferencial.tsx` | e2e questionario: "fluxo completo do participante, com axe em todas as etapas" (full participant flow, with axe on every step) (zero radios marked) |
| The 26 items follow the official order and polarity. The interface never "tidies up" the poles | §3.3, UEQ Handbook | `src/app/r/[slug]/questionario/page.tsx` | unit `src/ueq/__tests__`, e2e questionario |
| In Arabic, Hebrew and Persian the text runs from right to left, but the scale still goes from 1 to 7 with the left term on the left, as in the official PDFs | §3.3, Norman (natural mapping), WCAG 1.3.2 | `ItemDiferencial.tsx` (`dir="ltr"` on the row), `ItemDiferencial.module.css` | e2e idiomas: "em árabe pelo seletor: página da direita para a esquerda, escala na ordem oficial" (in Arabic via the selector: page from right to left, scale in the official order) |
| Official UEQ instruction at the top, in the chosen language, without the example with a marked circle | §3.4, Nielsen 2 | `data/ueq-instrucoes.json`, `questionario/page.tsx` | e2e idiomas (Spanish) |
| Same layout for the 26 items | §3.5 | `ItemDiferencial.tsx`, one component for all | e2e questionario: "cada item é um grupo com legenda e 7 rádios com posição e polo" (each item is a group with a legend and 7 radios with position and pole) |
| The participant never sees results | §3.6 | the `/r/...` routes do not read the analysis | e2e autenticacao: "participante nunca precisa de sessão" (participant never needs a session) |

## Participant: the path to the end

| Decision | Principle | Where it is | Evidence |
|---|---|---|---|
| The form states the time (no limit), how to withdraw until submitting, that after submitting the responses cannot be withdrawn, how long they are kept, the risks, the benefits, who is responsible for the research with institution and contact and, when there is one, the ethics committee. It has a copy to print or save | LGPD Art. 9, CNS Resolution 510/2016, Nielsen 1 and 10 | `src/lib/termo.ts`, `src/app/r/[slug]/Termo.tsx`, `src/app/r/[slug]/termo/page.tsx` | e2e questionario: "o termo diz o tempo, como desistir, o que acontece depois de enviar, riscos, benefícios e quem responde, e tem uma via para guardar" (the form states the time, how to withdraw, what happens after submitting, risks, benefits and who is responsible, and has a copy to keep); unit: `termo.test.ts` |
| The form asks for the age. People under 18 only continue after confirming the authorization of their parent or guardian, and the error appears in the form itself, with the focus on the field | LGPD Art. 14, Nielsen 9, WCAG 3.3.1 | `src/lib/termo.ts`, `src/app/r/[slug]/acoes.ts` | e2e questionario: "quem tem menos de 18 anos só participa com a autorização do responsável, e sem idade nada é gravado" (people under 18 only take part with their guardian's authorization, and without an age nothing is saved) |
| The study form requires the responsible researcher, contact, institution, risks and benefits, with filled-in suggestions | LGPD Art. 9, WCAG 3.3.7 | `estudos/formulario/FormularioEstudo.tsx`, `src/lib/validacao-estudo.ts` | e2e estudos: "o estudo nasce com o responsável da conta e exige nome, contato e instituição, que vão para o termo" (the study starts with the account's responsible researcher and requires name, contact and institution, which go into the consent form) |
| Consent with one main action. Declining is an equally visible link | Hick, Nielsen 8, §3.7 | `src/app/r/[slug]/page.tsx` | e2e questionario: "não quero participar sai sem gravar…" (I do not want to take part leaves without saving…) |
| The form links to the policy, on a page with no bar and no path into the tool, which returns to the form | LGPD Art. 9, Nielsen 3 | `src/app/r/[slug]/page.tsx`, `src/app/r/[slug]/privacidade/page.tsx` | e2e questionario: "a política de privacidade abre pelo termo, dentro do link do participante, e volta para ele" (the privacy policy opens from the consent form, inside the participant link, and returns to it) |
| Machine translation receives the screen of each text, uses a single term per concept in each language, cites buttons by the name they have on screen and goes through a second reading. If its `{marcadores}` differ from the original, it is discarded and the text stays in Portuguese | Nielsen 2 and 4, WCAG 3.1.2 | `src/traducao/claude.ts`, `src/traducao/rodadas.ts`, `src/traducao/extrair.ts` | unit: `claude.test.ts`, `rodadas.test.ts`, `catalogo.test.ts` |
| Without a translation, the policy warns in the person's language that it appears in Portuguese, and the text is marked with the Portuguese `lang` | Nielsen 1, WCAG 3.1.2 | `src/app/r/[slug]/privacidade/page.tsx` | e2e questionario: "sem tradução automática, a política avisa no idioma da pessoa e sai marcada como português" (without machine translation, the policy warns in the person's language and is marked as Portuguese) |
| Nothing about the person is saved before "I agree" | §3.7 (research ethics) | `src/app/r/[slug]/acoes.ts` (`consentir`) | e2e questionario |
| Numbered steps (1 Consent · 2 Questionnaire · 3 Optional data) | Shneiderman 4, Nielsen 1 | `src/app/r/[slug]/Etapas.tsx` | e2e questionario (aria-current on the step) |
| Each item is a fieldset with a legend. Each circle states the position and the pole ("2 of 7, closer to enjoyable") | WCAG 1.3.1, 4.1.2, 2.5.3 | `ItemDiferencial.tsx` | e2e questionario: "cada item é um grupo…" (each item is a group…); manual: screen reader |
| 44×44 px touch target, which shrinks proportionally to fit in 320 px | WCAG 2.5.8 and 1.4.10, Fitts | `ItemDiferencial.module.css` | e2e questionario: "em 320 px (zoom de 400%) nenhuma etapa rola na horizontal" (at 320 px (400% zoom) no step scrolls horizontally) |
| Validation only on submission, never on each item. The summary receives the focus, says "N items left" and has a link to each item | WCAG 3.3.1 and 2.4.3, Nielsen 9, §4.1 | `src/app/r/[slug]/questionario/FormularioQuestionario.tsx` | e2e questionario: "envio incompleto leva o foco ao resumo e os links levam aos itens" (incomplete submission moves the focus to the summary and the links lead to the items) |
| Fixed footer with the progress and "Leave without sending". The focused item never ends up under the footer | Nielsen 1, Shneiderman 7, WCAG 2.4.11 | `questionario/RodapeProgresso.tsx` | e2e questionario: "fluxo completo só com teclado, com o foco sempre visível" (full flow with the keyboard only, with the focus always visible) |
| Progress is announced only every 5 items and on completion | WCAG 4.1.3, §4.1 (do not flood the screen reader) | `FormularioQuestionario.tsx` | manual: screen reader |
| Reloading or going back does not erase what was marked (draft only in the tab) | ISO 9241-110 (use error robustness), Nielsen 3 | `questionario/useRascunho.ts` | e2e questionario: "recarregar a página recupera as respostas marcadas" (reloading the page recovers the marked answers) |
| Leave without sending confirms in a dialog (focus on Keep answering, Esc continues) and deletes the incomplete participation | Shneiderman 6, Nielsen 5, §3.7, WCAG 2.4.3 | `RodapeProgresso.tsx`, `src/componentes/janela/Janela.tsx`, `acoes.ts` (`desistir`) | e2e questionario: "sair sem enviar confirma numa janela e não grava nada" (leave without sending confirms in a dialog and saves nothing) |
| Optional data with "Prefer not to say" on every question, and "Skip this step" with the same weight as "Continue" | §3.8, Nielsen 3 | `src/app/r/[slug]/sobre-voce/page.tsx`, `src/lib/demografia.ts` | e2e questionario |
| A link already answered in the same browser does not accept another submission | Nielsen 5 | `src/app/r/[slug]/page.tsx`, `src/lib/participacao.ts` | e2e questionario |
| A link in draft or closed explains the situation instead of showing an error | Nielsen 9 | `src/app/r/[slug]/page.tsx` (prototype p6) | e2e estudos: "abre, encerra e reabre a coleta, e o link público acompanha" (opens, closes and reopens data collection, and the public link follows) |

## Participant: languages

| Decision | Principle | Where it is | Evidence |
|---|---|---|---|
| The link opens in the study's language, among the 37 of the official pack, even with the browser in another language, and `<html lang>` and `dir` follow it | WCAG 3.1.1 | `src/app/r/[slug]/layout.tsx`, `src/lib/participacao.ts` (`idiomaDoParticipante`) | e2e idiomas: "estudo em espanhol: o link abre no idioma do estudo, mesmo com o navegador em português" (study in Spanish: the link opens in the study's language, even with the browser in Portuguese) |
| In the language selector, choosing changes nothing: only the "Apply" button does | WCAG 3.2.2 | `src/app/r/[slug]/SeletorIdioma.tsx` | e2e idiomas (Arabic) |
| Each language appears in the selector with its own name and with `lang` | WCAG 3.1.2 | `SeletorIdioma.tsx` | manual: screen reader |
| In the 9 languages with a non-approved translation, a notice on the consent page and a mark for the researcher | Nielsen 1, methodological transparency | `SeletorIdioma.tsx`, `respostas/TabelaParticipacoes.tsx`, exports | e2e idiomas (Arabic) |
| All screen texts have a translation, with the same placeholders as the Portuguese version | Shneiderman 2 (universal usability) | `src/idiomas/textos/*.ts`, with the `TextosParticipante` type | unit `src/idiomas/__tests__/idiomas.test.ts` |
| The questionnaire uses only the official translations; the title, the product and the goal of the study are translated, and without a translation they stay in the original, marked with its `lang` | Validity of the instrument (§3), WCAG 3.1.2 | `src/lib/participacao.ts` (`textosDoEstudo`), `src/traducao/servidor.ts` | manual: review by a native speaker (`docs/idiomas.md`) |

## Researcher: account and studies

| Decision | Principle | Where it is | Evidence |
|---|---|---|---|
| Log in accepts pasting the password and password managers. "Show password" button, announced | WCAG 3.3.8 and 1.3.5 | `src/componentes/formulario/Campo.tsx` | e2e autenticacao: "Mostrar senha alterna a visibilidade e anuncia o estado" (Show password toggles the visibility and announces the state) |
| Error summary at the top, with focus and a link to each field | WCAG 3.3.1 and 3.3.3, Nielsen 9 | `src/componentes/formulario/ResumoErros.tsx` | e2e autenticacao: "o link do resumo de erros leva ao campo" (the error summary link leads to the field) |
| A protected route returns to where the person was after login | Nielsen 3 | `src/proxy.ts` | e2e autenticacao: "rota protegida sem sessão vai para Entrar e volta para ela depois do login" (protected route without a session goes to Log in and returns to it after login) |
| The evaluated product becomes the suggested name of the first version | WCAG 3.3.7 | `estudos/formulario/FormularioEstudo.tsx` | e2e estudos: "o produto sugere o nome da primeira versão…" (the product suggests the name of the first version…) |
| Deleting a study or an account opens a dialog that asks for the title or the email to be typed and says what goes with it | Nielsen 5, WCAG 3.3.4 | `estudos/[id]/AcoesEstudo.tsx`, `conta/ExcluirConta.tsx`, `src/componentes/janela/Confirmacao.tsx` | e2e estudos: "excluir pede o título e apaga o estudo" (deleting asks for the title and erases the study); e2e conta: "excluir a conta exige digitar o e-mail e apaga o acesso" (deleting the account requires typing the email and removes access) |
| Log out and Remove version also confirm in a dialog, with the focus already on the action button | Nielsen 3 and 5, Shneiderman 6 | `(pesquisador)/BarraSuperior.tsx`, `estudos/formulario/ListaVersoes.tsx` | e2e autenticacao: "cadastra, sai e entra de novo usando só o teclado" (signs up, logs out and logs in again using only the keyboard); e2e estudos: "o produto sugere o nome da primeira versão…" (the product suggests the name of the first version…) |
| The home page explains the UEQ and the tool: what the method is, how to read the results, how it works, the studies and the credits. It is also the screen after login | Nielsen 2 and 10 | `(publico)/PaginaInicial.tsx` | e2e inicial: "a raiz apresenta a ferramenta para quem não tem sessão e passa no axe" (the root presents the tool to those without a session and passes axe) |
| Log in and Create account open in a dialog over the current page, switch from one to the other without closing and fit on the screen without scrolling | Nielsen 3, Shneiderman 8, WCAG 1.4.10 | `(publico)/_acesso/Acesso.tsx`, `acesso.module.css` | e2e inicial: "Entrar abre a janela por cima da página, sem rolar, e Esc fecha devolvendo o foco" (Log in opens the dialog over the page, without scrolling, and Esc closes it returning the focus) |
| Closing data collection is reversible ("Reopen"), so it does not ask for confirmation | Shneiderman 6 | `estudos/[id]/BotaoColeta.tsx` | e2e estudos: "abre, encerra e reabre a coleta…" (opens, closes and reopens data collection…) |
| Status written out with its consequence ("Open · accepting responses"), always in the same place | Nielsen 1 | `src/lib/status-estudo.ts`, `estudos/[id]/FaixaEstudo.tsx` | e2e estudos |
| Every action confirms its result in a `role="status"` region, which follows the scrolling and stays until the person closes it. Errors have another color and another icon | Norman (feedback), Shneiderman 3, WCAG 4.1.3 and 2.2.1 | `src/componentes/Avisos.tsx`, `formulario/MensagemStatus.tsx` | e2e estudos: "a confirmação pode ser fechada e continua à vista depois de rolar a página" (the confirmation can be closed and stays in view after scrolling the page); e2e autenticacao: "criar a conta e entrar confirmam na tela" (creating the account and logging in confirm on screen) |
| While the action runs, the button says what is happening and ignores further clicks, and the form stops responding: nothing is sent twice | Nielsen 1 and 5, WCAG 4.1.3 and 2.4.3 | `formulario/BotaoEnvio.tsx`, `src/app/globals.css` | e2e estudos: "enquanto cria o estudo o botão mostra que está processando, ignora novos cliques e no fim confirma" (while creating the study the button shows that it is processing, ignores further clicks and confirms at the end) |
| Another researcher cannot see the study through its address: the response is the same as for a nonexistent study | privacy of the research data | `src/lib/estudos.ts` (`estudoDoPesquisador`) | e2e estudos: "outro pesquisador não vê o estudo pelo endereço" (another researcher does not see the study through the address); e2e exportacao |

## Researcher: team, notifications and help

| Decision | Principle | Where it is | Evidence |
|---|---|---|---|
| The owner invites by email as Editor or Viewer; the study only appears after the invitation is accepted, and the viewer can only view and export | Nielsen 5, user control, privacy of the research data | `estudos/[id]/Compartilhar.tsx`, `acoes-compartilhar.ts`, `src/lib/estudos.ts` (`PERMISSOES`) | e2e equipe: "convite por e-mail chega no sino, o leitor só vê e o dono é avisado" (email invitation arrives in the bell, the viewer can only view and the owner is notified) |
| Bell with the number of unread notifications, which also works by keyboard, and invitations with Accept and Decline right there | Nielsen 1, Shneiderman 7, WCAG 2.1.1 | `(pesquisador)/sino.module.css`, `notificacoes/page.tsx`, `src/lib/notificacoes.ts` | e2e equipe: "o sino também funciona pelo teclado" (the bell also works by keyboard) |
| New responses become a single notification while it is unread: 30 responses in one morning are not 30 notifications | Nielsen 8, memory load (Shneiderman 8) | `src/lib/notificacoes.ts` (`notificarResposta`) | manual |
| Whoever performed the action is not notified of their own action, and email can be turned off in My account | Nielsen 8, Shneiderman 7 | `src/lib/notificacoes.ts` (`notificar`) | e2e equipe: "convite por e-mail chega no sino…" (email invitation arrives in the bell…) |
| Tour only on first access, on the real screens, advancing through the person's action, and which can be skipped and replayed | ISO 9241-110 (learnability), Nielsen 3 and 10 | `src/componentes/tutorial/` | e2e equipe: "o tour abre só no primeiro acesso, avança pelo clique na ação e pode ser pulado" (the tour opens only on first access, advances by clicking the action and can be skipped) |
| The (?) on every researcher page says what the page is for and what can be done on it | Nielsen 10 | `src/componentes/ajuda/BotaoAjuda.tsx`, `src/lib/ajuda.ts` | e2e equipe: "toda página do pesquisador tem o (?) com a ajuda dela" (every researcher page has the (?) with its help) |
| Administration and My account are panels: each option shows its current state and opens its own page | Nielsen 6, Hick, progressive disclosure | `src/componentes/painel/PainelOpcoes.tsx` | e2e conta; manual |
| The interface appears in the account's language, and the language is changed in My account. While most of it has not been translated, the page `lang` stays Portuguese, so that the screen reader pronounces it correctly | Shneiderman 2, WCAG 3.1.1 | `src/traducao/servidor.ts` (`idiomaExibido`), `conta/idioma/` | e2e idioma-interface: "o idioma escolhido ao criar a conta vale para a ferramenta e pode ser trocado em Minha conta" (the language chosen when creating the account applies to the tool and can be changed in My account) |

## Data protection

| Decision | Principle | Where it is | Evidence |
|---|---|---|---|
| The policy is public and written without legalese, in rows of label and explanation, with a summary and a table of contents | LGPD Art. 9, Nielsen 2, WCAG 2.4.5 | `(publico)/privacidade/page.tsx` | e2e privacidade: "a política de privacidade é pública e acessível" (the privacy policy is public and accessible); "a política leva cada seção pelo índice e não rola na horizontal em 320 px" (the policy leads to each section through the table of contents and does not scroll horizontally at 320 px) |
| The policy's "Back" says where it goes, works without history and returns the person to the point they left from | Nielsen 3, Shneiderman 7 | `privacidade/Voltar.tsx`, `privacidade/origem.ts` | e2e privacidade: "da página inicial, a política volta ao rodapé de onde a pessoa saiu" (from the home page, the policy returns to the footer the person left from); "de Minha conta e da ajuda, a política volta para a mesma tela" (from My account and from the help, the policy returns to the same screen) |
| From the Log in and Create account dialogs, the policy opens in another tab, says so in the link name, and going back closes the tab, without losing what was typed | Nielsen 3, WCAG 3.2.5 | `_acesso/LinkPrivacidade.tsx`, `privacidade/Voltar.tsx` | e2e privacidade: "das janelas de acesso, a política abre em outra aba, sem perder o que foi digitado, e voltar tenta fechar a aba" (from the access dialogs, the policy opens in another tab, without losing what was typed, and going back tries to close the tab); manual: checklist, screen reader |
| The "Back" destination only accepts an internal path | Security (open redirect) | `src/lib/validacao-conta.ts` (`destinoInterno`) | e2e privacidade: "a política não aceita voltar para outro site" (the policy does not accept going back to another site) |
| Demographic data collection comes turned off in each study, and the checkbox explains why | LGPD Art. 6 (necessity), §3.8 | `estudos/formulario/`, `Estudo.coletarDemografia` | manual: `docs/roteiro-revisao.md` |
| "Download my data" delivers a file with everything, without asking anyone | LGPD Art. 18, Shneiderman 7 | `src/app/api/conta/dados/route.ts`, `conta/FichaConta.tsx` | e2e privacidade: "Baixar meus dados entrega um JSON com a conta e sem a senha" (Download my data delivers a JSON with the account and without the password) |
| After 5 wrong passwords, the message says how long to wait | Nielsen 9, LGPD Art. 46 | `src/lib/tentativas.ts` | e2e privacidade: "depois de 5 senhas erradas o e-mail espera" (after 5 wrong passwords the email has to wait) |

## Researcher: results dashboard

| Decision | Principle | Where it is | Evidence |
|---|---|---|---|
| Quick reading written at the top, and the interpretation next to each number ("neutral · Below the mean") | Nielsen 6, Shneiderman 8 | `src/lib/leitura-rapida.ts`, `resultados/VisaoUmaVersao.tsx` | e2e resultados: "mostra os números do módulo UEQ…" (shows the numbers of the UEQ module…) |
| Chart with a text description and an equivalent table right below it | WCAG 1.1.1 and 1.3.1 | `src/graficos/EscalasComBenchmark.tsx`, `VisaoUmaVersao.tsx` | e2e resultados (axe); manual: screen reader |
| Versions distinguished by shape (filled circle, hollow…), not only by color | WCAG 1.4.1 | `EscalasComBenchmark.tsx` | e2e resultados: "gráficos com daltonismo simulado e alto contraste" (charts with simulated color blindness and high contrast) |
| Scales grouped into Attractiveness, Pragmatic and Hedonic | Gestalt (proximity, common region), the UEQ conceptual model | `EscalasComBenchmark.tsx` | e2e resultados |
| Each technical term (benchmark, CI95, alpha) explained close by, in `<details>` | Nielsen 10, progressive disclosure | `resultados/Explicacoes.tsx` | manual |
| The low alpha and small sample alerts say what they mean and what to do | Nielsen 9 | `VisaoUmaVersao.tsx` | e2e resultados: "com uma resposta só avisa que não há intervalo de confiança" (with a single response it warns that there is no confidence interval) |
| Version, mode and order of the items are kept in the URL: going back, reloading and sharing work | Nielsen 3 | `resultados/ControlesResultados.tsx` | e2e resultados: "…guarda versão e modo na URL" (…keeps version and mode in the URL) |
| Changing the version does not take the focus off the selector | WCAG 3.2.2 | `ControlesResultados.tsx` | manual: keyboard |
| On a narrow screen the table scrolls inside a focusable region, and the page does not scroll | WCAG 1.4.10 and 2.1.1 | `VisaoUmaVersao.tsx`, `VisaoComparacao.tsx` | e2e resultados: "em 320 px o painel não rola na horizontal, nos dois modos" (at 320 px the dashboard does not scroll horizontally, in both modes) |
| Demographic data in its own sub-tab, each question in the chart that suits it, with "View the numbers" | Gestalt, WCAG 1.1.1, progressive disclosure | `src/graficos/Demografia.tsx`, `resultados/demograficos/` | e2e privacidade: "os dados demográficos aparecem em Resultados, numa sub-aba própria" (the demographic data appear in Results, in their own sub-tab) |
| Dashboard as a PDF with the same selection as the screen, a header with title, n and generation date, vector charts, A4 with 18 mm margins | Nielsen 4, §4.4 | `resultados/impressao/`, `src/app/api/estudos/[id]/painel-pdf/route.ts` | e2e painel-pdf |

## Researcher: responses, export and import

| Decision | Principle | Where it is | Evidence |
|---|---|---|---|
| Overview of how many participations are in and out of the analysis | Nielsen 1 | `estudos/[id]/respostas/page.tsx` | e2e respostas |
| Excluding from the analysis only removes from the calculation, never deletes, and can be undone | Shneiderman 6, docs/ueq-protocolo.md §7 | `respostas/acoes.ts` | e2e respostas: "incluir e excluir uma participação avisa e nunca apaga" (including and excluding a participation notifies and never deletes) |
| The suspicion rule and the thresholds are visible next to the list | Nielsen 6 and 10 | `respostas/page.tsx` | e2e respostas: "a fixture inconsistente sai com as 4 suspeitas da equipe…" (the inconsistent fixture comes out with the team's 4 suspicious responses…) |
| The "Show only suspicious" filter is kept in the URL | Nielsen 3 | `respostas/TabelaParticipacoes.tsx` | e2e respostas |
| Each export states the format, the content and the use, with a readable, dated name, and downloads without opening a new tab | §4.4, Nielsen 2 | `resultados/SecaoExportar.tsx`, `src/app/api/estudos/[id]/exportar/[tipo]/route.ts` | e2e exportacao: "baixa as 4 exportações com nome datado, BOM e o formato de cada uma" (downloads the 4 exports with a dated name, BOM and the format of each) |
| Importing a CSV in two steps: a preview of the first 5 rows or the problem with each row, then the confirmation. It only saves when the whole file is valid | Nielsen 5 and 9, Shneiderman 4 and 5 | `respostas/importar/`, `src/lib/importacao.ts` | e2e importacao; unit `src/lib/__tests__/importacao.test.ts` |
| Imported responses are marked and have no language, because the CSV does not state the language (nothing is invented) | Nielsen 1, data integrity | `TabelaParticipacoes.tsx`, `src/lib/exportacoes.ts` | e2e importacao; unit `exportacoes.test.ts` |
| The subpage (Responses › Import) keeps the tab it came from marked | Nielsen 1, WCAG 2.4.8 (Location) | `estudos/[id]/AbasEstudo.tsx` | e2e importacao |

## Throughout the tool

| Decision | Principle | Where it is | Evidence |
|---|---|---|---|
| Top bar fixed at the top while scrolling, on desktop and on mobile: navigation is always at hand | Nielsen 3 and 6, Shneiderman 7 | `src/app/(ferramenta)/(pesquisador)/BarraFixa.tsx`, `pesquisador.module.css` | e2e barra: "a barra fica fixa no topo ao rolar, com e sem conta" (the bar stays fixed at the top when scrolling, with and without an account) |
| With the fixed bar, the focus and the anchor targets stop below it: `scroll-padding-top` with the measured height of the bar | WCAG 2.4.11 | `src/app/globals.css`, `BarraFixa.tsx` (`--altura-barra`) | e2e barra: "o foco e as âncoras nunca ficam embaixo da barra fixa" (the focus and the anchors never end up under the fixed bar) |
| Language selector in the bar, with and without login: each language is a button with its own name, only the click switches, and the page stays the same with the focus back on the selector | WCAG 3.1.1, 3.2.2 and 2.5.3, Nielsen 7 (shortcut to My account › Language) | `(pesquisador)/SeletorIdioma.tsx`, `seletor-idioma.module.css`, `(pesquisador)/acoes.ts` (`trocarIdioma`) | e2e idioma-interface: "o seletor de idioma da barra troca a ferramenta e a conta sem sair da página" (the bar's language selector switches the tool and the account without leaving the page) |
| On mobile the links sit behind the Menu button (`aria-expanded`), which closes with Esc, returning the focus, and on changing page | WCAG 2.1.2 and 4.1.2, Nielsen 8 (single-line fixed bar) | `BarraFixa.tsx` | e2e barra: "no celular os links ficam no menu, que fecha com Esc e devolve o foco" (on mobile the links are in the menu, which closes with Esc and returns the focus) |
| A long document opens as a table of contents, and each section on its own page, with the diagram in view, Back and Previous/Next | Nielsen 3 and 8, progressive disclosure, WCAG 2.4.5 and 2.4.8 | `documentacao/PaginaSecao.tsx`, `src/lib/documentacao/estrutura.ts`, `paginas.ts` | e2e documentacao: "documento longo abre como índice, e cada seção em página própria com o diagrama à vista" (a long document opens as a table of contents, and each section on its own page with the diagram in view) |
| Back leads to the page the person came from, even in another document, and without history to the page above | Nielsen 3, Shneiderman 7 | `documentacao/NavegacaoDocumento.tsx` | e2e documentacao: "Voltar leva à página de onde a pessoa veio e, sem histórico, à página de cima" (Back leads to the page the person came from and, without history, to the page above) |
| A link in a table leads to the page of the row and highlights the target | Nielsen 6, WCAG 2.4.4 | `paginas.ts` (`rotaDaAncora`), `texto.module.css` (`:target`) | e2e documentacao: "seção com muitas subseções vira índice, e o link de uma tabela leva à página da linha" (a section with many subsections becomes a table of contents, and a link in a table leads to the page of the row) |
| Clicking a diagram in the documentation opens it full screen in a native `<dialog>`: Back fixed at the top, Esc closes and the focus returns to the diagram | WCAG 2.1.2 and 2.4.3, Nielsen 3, Shneiderman 6 | `documentacao/ArtigoDocumento.tsx` | e2e documentacao: "clicar no diagrama abre em tela cheia, com zoom, arrasto, Voltar e Esc" (clicking the diagram opens it full screen, with zoom, dragging, Back and Esc) |
| Zoom from 50% to 400% (buttons, Ctrl + wheel, + and - only with the full screen open), centered on the point the person was looking at, and dragging to move | WCAG 1.4.4 and 2.1.4, Shneiderman 7 | `ArtigoDocumento.tsx`, `ampliado.module.css` | e2e documentacao: "clicar no diagrama abre em tela cheia…" (clicking the diagram opens it full screen…) |
| "Skip to content" link as the first Tab stop | WCAG 2.4.1 | `src/app/(ferramenta)/layout.tsx`, `src/app/r/[slug]/layout.tsx` | e2e inicial: "o primeiro Tab leva ao link de pular para o conteúdo" (the first Tab leads to the skip to content link) |
| Unique and descriptive page title ("Questionnaire · <estudo>") | WCAG 2.4.2 | `generateMetadata` of each page | e2e (toHaveTitle in several tests) |
| Colors in tokens, with contrast checked by a test | WCAG 1.4.3 and 1.4.11 | `src/styles/tokens.css` | unit `src/styles/__tests__/contraste.test.ts` |
| The same pattern of button, field, table and message on every screen | Nielsen 4, Shneiderman 1 | `src/componentes/formulario/`, `src/styles/` | manual: `docs/roteiro-revisao.md` |
| Screens identical to the high-fidelity prototype | consistency with the evaluated design | `docs/prototipos/alta-fidelidade/` | manual: `docs/roteiro-revisao.md` |

## What no automated test covers

These points are checked by hand, in the manual test cases ([manual checklist](checklist-manual.md) and [review script](roteiro-revisao.md)):

- real use with a screen reader (NVDA, VoiceOver, TalkBack) from start to finish;
- 200% and 400% zoom on a real phone, and the thumb on the circles;
- increased text spacing (WCAG 1.4.12) and `prefers-reduced-motion`;
- the quality of the translations of the participant screens and of the interface translated through the API (`docs/idiomas.md`);
- the guided tour and the bell with a screen reader;
- the understanding of the dashboard by people who do not know the UEQ.

The screens without a high-fidelity prototype (the language selector, Import responses and the dashboard PDF) use the same components as the others and are checked with the same script.
