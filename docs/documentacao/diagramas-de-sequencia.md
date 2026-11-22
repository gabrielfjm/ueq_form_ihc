# Diagramas de sequência

Oito diagramas mostram como as partes da ferramenta conversam nos fluxos mais importantes. Os participantes de cada diagrama são os blocos da [arquitetura](arquitetura.md):

- **Navegador:** a página React no navegador da pessoa (Client Components e formulários);
- **proxy:** [`src/proxy.ts`](../../src/proxy.ts), que roda antes de cada requisição;
- **Página:** um Server Component do App Router;
- **Ação:** uma Server Action (`"use server"`);
- **Rota de API:** um Route Handler em `src/app/api/`;
- **lib:** os serviços de `src/lib/` (sessão, estudos, participação, resultados…);
- **ueq:** o módulo de cálculo [`src/ueq/`](../../src/ueq/), funções puras;
- **PostgreSQL:** o banco, acessado pelo Prisma.

Seta cheia é chamada; seta tracejada é resposta. Logo abaixo de cada diagrama estão a ferramenta usada, o arquivo-fonte para baixar e a versão da ferramenta que ele representa.

A coluna de casos de uso e a de requisitos ficam preenchidas quando esses documentos forem publicados.

| Diagrama | Caso de uso | Requisitos principais |
|---|---|---|
| [1. Entrar e voltar à página pedida](#1-entrar-e-voltar-à-página-pedida) | a definir | a definir |
| [2. Responder o questionário](#2-responder-o-questionário) | a definir | a definir |
| [3. Ver resultados](#3-ver-resultados) | a definir | a definir |
| [4. Tirar uma participação da análise](#4-tirar-uma-participação-da-análise) | a definir | a definir |
| [5. Exportar o painel em PDF](#5-exportar-o-painel-em-pdf) | a definir | a definir |
| [6. Importar respostas por CSV](#6-importar-respostas-por-csv) | a definir | a definir |
| [7. Convidar alguém para o estudo](#7-convidar-alguém-para-o-estudo) | a definir | a definir |
| [8. Traduzir a interface sob demanda](#8-traduzir-a-interface-sob-demanda) | a definir | a definir |

## 1. Entrar e voltar à página pedida

O proxy só confere se existe o cookie. Quem garante que a sessão vale é a consulta ao banco, feita em toda página e ação do pesquisador. `/entrar` mostra a página inicial com a janela de Entrar aberta. Sem página pedida, o login termina na página inicial.

```mermaid
sequenceDiagram
    autonumber
    actor Pesq as Researcher
    participant Nav as Browser
    participant Proxy as proxy
    participant Acao as Action entrar
    participant Tent as lib/tentativas
    participant Session as lib/sessao
    participant BD as PostgreSQL

    Pesq->>Nav: opens /estudos/abc/resultados
    Nav->>Proxy: GET /estudos/abc/resultados (without cookie)
    Proxy-->>Nav: redirects to /entrar?voltar=/estudos/abc/resultados
    Pesq->>Nav: types email and password and clicks Log in
    Nav->>Acao: entrar(FormData)
    Acao->>Acao: validates the fields with Zod
    Acao->>Tent: bloqueado(email)
    Tent->>BD: counts failures of SHA-256(email) in the last 15 minutes
    alt 5 or more failures
        Acao-->>Nav: error "Too many attempts with this email…"
        Nav-->>Pesq: error summary with the focus
    else can try
        Acao->>BD: looks up the researcher by email
        BD-->>Acao: researcher with passwordHash
        Acao->>Acao: bcrypt.compare(senha, passwordHash)
        alt email or password do not match
            Acao->>Tent: recordFailure(email)
            Acao-->>Nav: error "Email or password do not match…"
            Nav-->>Pesq: error summary with the focus
        else they match
            Acao->>Tent: clearFailures(email)
            Acao->>Session: createSession(researcherId)
            Session->>Session: generates a random 32-byte token
            Session->>BD: deletes expired sessions and creates Session with id = SHA-256(token)
            Session-->>Nav: cookie "session" httpOnly, sameSite lax, 7 days
            Acao-->>Nav: redirects to internalDestination(voltar)
            Nav->>Proxy: GET /estudos/abc/resultados (with cookie)
            Proxy-->>Nav: continues
            Note over Nav,BD: the page calls requireResearcher, which looks up the session by the token hash and checks its validity
            Nav-->>Pesq: results dashboard
        end
    end
```

**Ferramenta do diagrama:** Mermaid 12.2.0 (`sequenceDiagram`), gerado por `pnpm docs:diagramas`. **Arquivo-fonte:** [diagramas-de-sequencia-1.mmd](fontes/diagramas-de-sequencia-1.mmd). **Versão representada:** Ferramenta UEQ de 06/11/2026.

## 2. Responder o questionário

Nada sobre a pessoa é gravado antes do consentimento, e nenhuma resposta é gravada antes do envio completo. A etapa de dados opcionais só existe quando o pesquisador ligou a coleta no estudo. O título, o produto e o objetivo saem traduzidos para o idioma de quem responde, como no [diagrama 8](#8-traduzir-a-interface-sob-demanda).

```mermaid
sequenceDiagram
    autonumber
    actor Part as Participant
    participant Nav as Browser
    participant Pag as Pages /r/[slug]
    participant Acao as Actions /r/[slug]
    participant Lib as lib/participacao and lib/balanceamento
    participant Ueq as ueq
    participant BD as PostgreSQL

    Part->>Nav: opens /r/<slug>
    Nav->>Pag: GET
    Pag->>Lib: publicStudy(slug) and participantLanguage() (the choice in the cookie or the study language)
    Lib->>BD: study by slug, with versions and completed responses per version
    alt study in draft, closed or link already answered
        Pag-->>Nav: notice about the situation, without consent
    else study open
        Pag-->>Nav: consent form in the negotiated language
    end

    Part->>Nav: chooses the age and clicks I agree and want to take part
    Nav->>Acao: consent(slug, age and authorization)
    alt no age, or under 18 without the guardian's authorization
        Acao-->>Nav: back to the form with the error, and nothing is stored
    end
    Acao->>Lib: versionWithFewestResponses(versions)
    Lib-->>Acao: version with the fewest completed responses
    Acao->>BD: deletes participations abandoned for more than 2 days
    Acao->>BD: creates Participation (version, consentedAt, language, isMinor)
    Acao-->>Nav: cookie ueq_participacao on the path /r/<slug> and redirects to the questionnaire

    Nav->>Pag: GET /r/<slug>/questionario
    Pag->>BD: 26 items (official order and polarity)
    Pag-->>Nav: official instruction and 26 items, none marked
    loop on each mark
        Part->>Nav: marks a position
        Nav->>Nav: updates the progress and keeps the draft in sessionStorage
    end

    Part->>Nav: Send answers
    Nav->>Nav: checks in the browser that all 26 are marked
    Nav->>Acao: submitAnswers(slug, values)
    Acao->>Acao: checks the 26 values from 1 to 7 again on the server
    alt an item is missing
        Acao-->>Nav: { missing: [7, 19] }
        Nav-->>Part: summary "2 items left" with the focus and links to the items
    else complete
        Acao->>Ueq: assessSuspicion(values, items, protocol)
        Ueq-->>Acao: { suspicious, reasons, ranges }
        Acao->>BD: transaction: creates 26 Responses and sets completedAt and suspicious
        Acao->>BD: notifies the owner and the team in the bell (notifyResponse)
        Acao-->>Nav: cookie ueq_respondido (30 days)
    end

    opt the study collects demographic data
        Acao-->>Nav: redirects to /sobre-voce
        Part->>Nav: answers the optional data or skips the step
        Nav->>Acao: saveDemographics(slug, FormData)
        opt clicked Continue and answered something
            Acao->>BD: stores encrypted demographics (only options from the list)
        end
    end
    Acao-->>Nav: deletes the cookie ueq_participacao and redirects to /fim
    Nav-->>Part: Responses recorded
```

**Ferramenta do diagrama:** Mermaid 12.2.0 (`sequenceDiagram`), gerado por `pnpm docs:diagramas`. **Arquivo-fonte:** [diagramas-de-sequencia-2.mmd](fontes/diagramas-de-sequencia-2.mmd). **Versão representada:** Ferramenta UEQ de 17/11/2026.

## 3. Ver resultados

Todo cálculo estatístico acontece em `src/ueq`. A página só busca, organiza por versão e desenha.

```mermaid
sequenceDiagram
    autonumber
    actor Pesq as Researcher
    participant Nav as Browser
    participant Pag as Results page
    participant Session as lib/sessao
    participant Studies as lib/estudos
    participant Res as lib/resultados
    participant Ueq as ueq
    participant BD as PostgreSQL

    Pesq->>Nav: opens /estudos/abc/resultados?version=v2
    Nav->>Pag: GET with searchParams
    Pag->>Session: requireResearcher()
    Session->>BD: session by the token hash, still valid
    BD-->>Session: researcher
    Pag->>Studies: researcherStudy(id, pessoa, "ver")
    Studies->>BD: study with this id, if the person is the owner or accepted the invitation
    alt study does not exist or the person has no access
        Studies-->>Nav: 404, the same in both cases
    else the person has access
        Pag->>Res: analyzeResults(studyId, versions)
        Res->>BD: items and completed participations, with responses
        Res->>Res: builds 26 values per participation and splits by version
        Res->>Ueq: analyzeStudy(all, items, protocol and benchmark)
        loop for each version
            Res->>Ueq: analyzeStudy(of the version, items, config)
        end
        Ueq-->>Res: StudyAnalysis (scales, groups, items, participants)
        Res-->>Pag: analysis of all and per version
        Pag->>Pag: quick reading, SVG chart with title and desc, tables
        Pag-->>Nav: dashboard HTML
        Nav-->>Pesq: dashboard of version v2
    end
    Pesq->>Nav: chooses "Compare versions"
    Nav->>Pag: GET ?modo=comparar (the URL keeps the view)
```

**Ferramenta do diagrama:** Mermaid 12.2.0 (`sequenceDiagram`), gerado por `pnpm docs:diagramas`. **Arquivo-fonte:** [diagramas-de-sequencia-3.mmd](fontes/diagramas-de-sequencia-3.mmd). **Versão representada:** Ferramenta UEQ de 06/11/2026.

## 4. Tirar uma participação da análise

Excluir da análise só muda um campo. Nada é apagado, e a mudança aparece no painel e nas exportações. Leitor não chega aqui: a ação exige a permissão de editar.

```mermaid
sequenceDiagram
    autonumber
    actor Pesq as Researcher
    participant Nav as Browser
    participant Acao as Action setInclusion
    participant Session as lib/sessao
    participant Studies as lib/estudos
    participant BD as PostgreSQL

    Pesq->>Nav: unchecks "In analysis" on a row of Responses
    Nav->>Acao: setInclusion(studyId, participationId, false)
    Acao->>Session: requireResearcher()
    Acao->>Studies: researcherStudy(studyId, pessoa, "editar")
    Acao->>BD: participation with this id, from this study and completed
    alt not found
        Acao-->>Nav: error "This participation is not in this study…"
    else found
        Acao->>BD: includedInAnalysis = false
        Acao->>BD: notifies the rest of the team in the bell (notifyChange)
        Acao->>Acao: revalidatePath of the study (dashboard, responses, exports)
        Acao-->>Nav: "Participation from … left the analysis. Nothing was deleted…"
        Nav-->>Pesq: notice in role="status"
    end
```

**Ferramenta do diagrama:** Mermaid 12.2.0 (`sequenceDiagram`), gerado por `pnpm docs:diagramas`. **Arquivo-fonte:** [diagramas-de-sequencia-4.mmd](fontes/diagramas-de-sequencia-4.mmd). **Versão representada:** Ferramenta UEQ de 06/11/2026.

## 5. Exportar o painel em PDF

O servidor abre a página de impressão num Chromium sem tela, com a sessão de quem pediu, e devolve o PDF. Na Vercel, esse Chromium é baixado na primeira chamada, como explica a [arquitetura](arquitetura.md#implantação).

```mermaid
sequenceDiagram
    autonumber
    actor Pesq as Researcher
    participant Nav as Browser
    participant Rota as API route painel-pdf
    participant Session as lib/sessao
    participant Chrome as Chromium (Playwright)
    participant Imp as Print page
    participant BD as PostgreSQL

    Pesq->>Nav: Export dashboard as PDF
    Nav->>Rota: GET /api/estudos/abc/painel-pdf?version=v2
    Rota->>Session: sessionResearcher()
    alt no session
        Rota-->>Nav: 401 "Log in to your account…"
    else with session
        Rota->>BD: study with this id and accessFilter(pessoa)
        alt study not found or no access
            Rota-->>Nav: 404 "Study not found."
        else the person has access
            Rota->>Chrome: launch() and session cookie for the internal origin
            Chrome->>Imp: GET /estudos/abc/resultados/impressao?version=v2
            Note over Imp,BD: same query and same calculation as in diagram 3
            Imp-->>Chrome: HTML with print CSS (A4, 18 mm)
            Chrome->>Chrome: waits for the fonts, emulates print mean
            Chrome-->>Rota: PDF with vector charts
            Rota->>Chrome: close()
            Rota-->>Nav: application/pdf, attachment, ueq_<title>_painel_<data>.pdf
        end
    end
```

**Ferramenta do diagrama:** Mermaid 12.2.0 (`sequenceDiagram`), gerado por `pnpm docs:diagramas`. **Arquivo-fonte:** [diagramas-de-sequencia-5.mmd](fontes/diagramas-de-sequencia-5.mmd). **Versão representada:** Ferramenta UEQ de 06/11/2026.

A rota usa sempre a origem interna do servidor, nunca o cabeçalho `Host` da requisição, para o cookie de sessão não ir para outro domínio.

## 6. Importar respostas por CSV

Dois passos: a prévia lê sem gravar; a confirmação grava tudo numa transação.

```mermaid
sequenceDiagram
    autonumber
    actor Pesq as Researcher
    participant Nav as Browser
    participant Acao as Actions importar
    participant Imp as lib/importacao
    participant Ueq as ueq
    participant BD as PostgreSQL

    Pesq->>Nav: chooses the version and the file and clicks "View preview"
    Nav->>Acao: previewImport(studyId, FormData)
    Acao->>Acao: checks session, edit permission, version, extension and size (up to 500 KB)
    Acao->>Imp: readResponsesCsv(text)
    Imp-->>Acao: valid rows and errors per row
    Acao-->>Nav: preview of the first 5 rows, total and errors
    alt some row with an error
        Nav-->>Pesq: problem of each row, without a confirm button
    else whole file valid
        Pesq->>Nav: confirms
        Nav->>Acao: confirmImport(studyId, versionId, text)
        Acao->>Imp: readResponsesCsv(text) again
        loop for each row
            Acao->>Ueq: assessSuspicion(values, items, protocol)
        end
        Acao->>BD: transaction: one IMPORTED Participation, completed and without language, with 26 Responses, per row
        Acao->>BD: notifies the rest of the team in the bell (notifyChange)
        Acao-->>Nav: redirects to Responses with "N imported"
        Nav-->>Pesq: the rows appear marked "imported from CSV"
    end
```

**Ferramenta do diagrama:** Mermaid 12.2.0 (`sequenceDiagram`), gerado por `pnpm docs:diagramas`. **Arquivo-fonte:** [diagramas-de-sequencia-6.mmd](fontes/diagramas-de-sequencia-6.mmd). **Versão representada:** Ferramenta UEQ de 06/11/2026.

O servidor lê o arquivo de novo na confirmação: a prévia não é confiável só porque veio do navegador.

## 7. Convidar alguém para o estudo

Só o dono convida. A pessoa precisa já ter conta, e o estudo só aparece para ela depois de aceitar. O e-mail sai depois da resposta, e o aviso no sino existe mesmo sem servidor de e-mail.

```mermaid
sequenceDiagram
    autonumber
    actor Dono as Owner
    participant Nav as Browser
    participant Acao as Study and bell actions
    participant Studies as lib/estudos
    participant Avisos as lib/notificacoes
    participant BD as PostgreSQL
    participant Smtp as Email server
    actor Conv as Invitee

    Dono->>Nav: Share, enters the email and the role
    Nav->>Acao: invite(studyId, FormData)
    Acao->>Studies: researcherStudy(studyId, pessoa, "gerenciar")
    Acao->>BD: looks up the account by email
    alt there is no account, it is the owner or already has access
        Acao-->>Nav: error on the field, saying what to do
    else can invite
        Acao->>BD: creates or renews Collaboration as PENDING
        Acao->>BD: deletes the old invitation from the bell, if any
        Acao->>Avisos: notify(invitee, type INVITATION)
        Avisos->>BD: creates Notification in the invitee's language
        alt email sending configured
            Acao-->>Nav: "Invitation sent to …, in the tool and by email."
            Avisos->>Smtp: after the response, sends the invitation email
            Smtp-->>Conv: email with the link
        else no sending configured
            Acao-->>Nav: notice and ready-made email link for the inviter
        end
    end

    Conv->>Nav: opens the bell and accepts or declines
    Nav->>Acao: responds to the invitation
    Acao->>BD: Collaboration ACCEPTED or DECLINED, with respondedAt
    Note over Conv,BD: only with ACCEPTED does the study enter the person's accessFilter
```

**Ferramenta do diagrama:** Mermaid 12.2.0 (`sequenceDiagram`), gerado por `pnpm docs:diagramas`. **Arquivo-fonte:** [diagramas-de-sequencia-7.mmd](fontes/diagramas-de-sequencia-7.mmd). **Versão representada:** Ferramenta UEQ de 06/11/2026.

## 8. Traduzir a interface sob demanda

A tela nunca espera a tradução da interface. O que ainda não foi traduzido sai em português, e os lotes rodam depois da resposta. Cada lote é guardado assim que volta, então uma execução interrompida continua de onde parou. Os textos escritos pelo pesquisador têm um caminho parecido, mas a página espera até 8 segundos pela API antes de mostrar o original.

```mermaid
sequenceDiagram
    autonumber
    actor Pesq as Researcher
    participant Nav as Browser
    participant Pag as Page
    participant Trad as traducao/servidor
    participant BD as PostgreSQL
    participant Claude as Claude API

    Pesq->>Nav: opens a screen with the account in Spanish
    Nav->>Pag: GET
    Pag->>Trad: tradutor()
    Trad->>BD: catalog translations in Spanish
    BD-->>Trad: the ones that already exist
    alt translations are missing and there is ANTHROPIC_API_KEY
        Trad-->>Pag: t() with what exists, and the rest in Portuguese
        Pag-->>Nav: HTML
        Trad->>Claude: translates the language glossary, if it does not exist yet
        Trad->>BD: stores the terms
        loop after the response, the labels and then the long texts, in batches of 60 grouped by screen, up to 6 at the same time
            Trad->>Claude: translateBatch(textos, telas, terms and quoted labels, pt, es)
            Claude-->>Trad: first translation
            Trad->>Claude: review, with original and translation side by side
            Claude-->>Trad: corrections of what changed meaning
            Note over Trad: a translation with placeholders different from the original is discarded
            Trad->>BD: stores in Translation, by language and text hash
        end
    else complete catalog or no API key
        Trad-->>Pag: t() with the available dictionary
        Pag-->>Nav: HTML
    end
    Note over Pag,Nav: if most of it is still in Portuguese, html lang stays pt-BR, so the screen reader pronounces it correctly
```

**Ferramenta do diagrama:** Mermaid 12.2.0 (`sequenceDiagram`), gerado por `pnpm docs:diagramas`. **Arquivo-fonte:** [diagramas-de-sequencia-8.mmd](fontes/diagramas-de-sequencia-8.mmd). **Versão representada:** Ferramenta UEQ de 06/11/2026.
