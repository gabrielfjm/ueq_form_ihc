# Diagramas de secuencia

Ocho diagramas muestran cómo se comunican las partes de la herramienta en los flujos más importantes. Los participantes de cada diagrama son los bloques de la [arquitectura](arquitetura.md):

- **Navegador:** la página React en el navegador de la persona (Client Components y formularios);
- **proxy:** [`src/proxy.ts`](../../src/proxy.ts), que se ejecuta antes de cada solicitud;
- **Página:** un Server Component del App Router;
- **Acción:** una Server Action (`"use server"`);
- **Ruta de API:** un Route Handler en `src/app/api/`;
- **lib:** los servicios de `src/lib/` (sesión, estudios, participación, resultados…);
- **ueq:** el módulo de cálculo [`src/ueq/`](../../src/ueq/), funciones puras;
- **PostgreSQL:** la base de datos, a la que se accede mediante Prisma.

La flecha continua es una llamada; la flecha discontinua es una respuesta. Justo debajo de cada diagrama están la herramienta utilizada, el archivo fuente para descargar y la versión de la herramienta que representa.

La columna de casos de uso y la de requisitos se rellenarán cuando esos documentos se publiquen.

| Diagrama | Caso de uso | Requisitos principales |
|---|---|---|
| [1. Iniciar sesión y volver a la página solicitada](#1-entrar-e-voltar-à-página-pedida) | por definir | por definir |
| [2. Responder el cuestionario](#2-responder-o-questionário) | por definir | por definir |
| [3. Ver resultados](#3-ver-resultados) | por definir | por definir |
| [4. Sacar una participación del análisis](#4-tirar-uma-participação-da-análise) | por definir | por definir |
| [5. Exportar el panel en PDF](#5-exportar-o-painel-em-pdf) | por definir | por definir |
| [6. Importar respuestas por CSV](#6-importar-respostas-por-csv) | por definir | por definir |
| [7. Invitar a alguien al estudio](#7-convidar-alguém-para-o-estudo) | por definir | por definir |
| [8. Traducir la interfaz bajo demanda](#8-traduzir-a-interface-sob-demanda) | por definir | por definir |

## 1. Iniciar sesión y volver a la página solicitada

El proxy solo comprueba si existe la cookie. Quien garantiza que la sesión es válida es la consulta a la base de datos, que se hace en toda página y acción del investigador. `/entrar` muestra la página de inicio con la ventana de Entrar abierta. Sin página solicitada, el inicio de sesión termina en la página de inicio.

```mermaid
sequenceDiagram
    autonumber
    actor Pesq as Researcher
    participant Nav as Browser
    participant Proxy as proxy
    participant Acao as Action entrar
    participant Tent as lib/tentativas
    participant Sessao as lib/sessao
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
        BD-->>Acao: researcher with senhaHash
        Acao->>Acao: bcrypt.compare(senha, senhaHash)
        alt email or password do not match
            Acao->>Tent: registrarFalha(email)
            Acao-->>Nav: error "Email or password do not match…"
            Nav-->>Pesq: error summary with the focus
        else they match
            Acao->>Tent: limparFalhas(email)
            Acao->>Sessao: criarSessao(pesquisadorId)
            Sessao->>Sessao: generates a random 32-byte token
            Sessao->>BD: deletes expired sessions and creates Sessao with id = SHA-256(token)
            Sessao-->>Nav: cookie "sessao" httpOnly, sameSite lax, 7 days
            Acao-->>Nav: redirects to destinoInterno(voltar)
            Nav->>Proxy: GET /estudos/abc/resultados (with cookie)
            Proxy-->>Nav: continues
            Note over Nav,BD: the page calls exigirPesquisador, which looks up the session by the token hash and checks its validity
            Nav-->>Pesq: results dashboard
        end
    end
```

**Herramienta del diagrama:** Mermaid 12.2.0 (`sequenceDiagram`), generado por `pnpm docs:diagramas`. **Archivo fuente:** [diagramas-de-sequencia-1.mmd](fontes/diagramas-de-sequencia-1.mmd). **Versión representada:** Herramienta UEQ del 06/11/2026.

## 2. Responder el cuestionario

No se guarda nada sobre la persona antes del consentimiento, y ninguna respuesta se guarda antes del envío completo. La etapa de datos opcionales solo existe cuando el investigador activó la recogida en el estudio. El título, el producto y el objetivo se muestran traducidos al idioma de quien responde, como en el [diagrama 8](#8-traduzir-a-interface-sob-demanda).

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
    Pag->>Lib: estudoPublico(slug) and idiomaDoParticipante() (the choice in the cookie or the study language)
    Lib->>BD: study by slug, with versions and completed responses per version
    alt study in draft, closed or link already answered
        Pag-->>Nav: notice about the situation, without consent
    else study open
        Pag-->>Nav: consent form in the negotiated language
    end

    Part->>Nav: chooses the age and clicks I agree and want to take part
    Nav->>Acao: consentir(slug, age and authorization)
    alt no age, or under 18 without the guardian's authorization
        Acao-->>Nav: back to the form with the error, and nothing is stored
    end
    Acao->>Lib: versaoComMenosRespostas(versions)
    Lib-->>Acao: version with the fewest completed responses
    Acao->>BD: deletes participations abandoned for more than 2 days
    Acao->>BD: creates Participacao (version, consentiuEm, language, menorDeIdade)
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
    Nav->>Acao: enviarRespostas(slug, valores)
    Acao->>Acao: checks the 26 values from 1 to 7 again on the server
    alt an item is missing
        Acao-->>Nav: { faltando: [7, 19] }
        Nav-->>Part: summary "2 items left" with the focus and links to the items
    else complete
        Acao->>Ueq: avaliarSuspeita(valores, itens, protocolo)
        Ueq-->>Acao: { suspeita, motivos, amplitudes }
        Acao->>BD: transaction: creates 26 Respostas and sets concluidaEm and suspeita
        Acao->>BD: notifies the owner and the team in the bell (notificarResposta)
        Acao-->>Nav: cookie ueq_respondido (30 days)
    end

    opt the study collects demographic data
        Acao-->>Nav: redirects to /sobre-voce
        Part->>Nav: answers the optional data or skips the step
        Nav->>Acao: salvarDemografia(slug, FormData)
        opt clicked Continue and answered something
            Acao->>BD: stores encrypted demographics (only options from the list)
        end
    end
    Acao-->>Nav: deletes the cookie ueq_participacao and redirects to /fim
    Nav-->>Part: Responses recorded
```

**Herramienta del diagrama:** Mermaid 12.2.0 (`sequenceDiagram`), generado por `pnpm docs:diagramas`. **Archivo fuente:** [diagramas-de-sequencia-2.mmd](fontes/diagramas-de-sequencia-2.mmd). **Versión representada:** Herramienta UEQ del 17/11/2026.

## 3. Ver resultados

Todo el cálculo estadístico ocurre en `src/ueq`. La página solo obtiene los datos, los organiza por versión y los dibuja.

```mermaid
sequenceDiagram
    autonumber
    actor Pesq as Researcher
    participant Nav as Browser
    participant Pag as Results page
    participant Sessao as lib/sessao
    participant Estudos as lib/estudos
    participant Res as lib/resultados
    participant Ueq as ueq
    participant BD as PostgreSQL

    Pesq->>Nav: opens /estudos/abc/resultados?versao=v2
    Nav->>Pag: GET with searchParams
    Pag->>Sessao: exigirPesquisador()
    Sessao->>BD: session by the token hash, still valid
    BD-->>Sessao: researcher
    Pag->>Estudos: estudoDoPesquisador(id, pessoa, "ver")
    Estudos->>BD: study with this id, if the person is the owner or accepted the invitation
    alt study does not exist or the person has no access
        Estudos-->>Nav: 404, the same in both cases
    else the person has access
        Pag->>Res: analisarResultados(estudoId, versions)
        Res->>BD: items and completed participations, with responses
        Res->>Res: builds 26 values per participation and splits by version
        Res->>Ueq: analisarEstudo(all, items, protocol and benchmark)
        loop for each version
            Res->>Ueq: analisarEstudo(of the version, items, config)
        end
        Ueq-->>Res: AnaliseEstudo (scales, groups, items, participants)
        Res-->>Pag: analysis of all and per version
        Pag->>Pag: quick reading, SVG chart with title and desc, tables
        Pag-->>Nav: dashboard HTML
        Nav-->>Pesq: dashboard of version v2
    end
    Pesq->>Nav: chooses "Compare versions"
    Nav->>Pag: GET ?modo=comparar (the URL keeps the view)
```

**Herramienta del diagrama:** Mermaid 12.2.0 (`sequenceDiagram`), generado por `pnpm docs:diagramas`. **Archivo fuente:** [diagramas-de-sequencia-3.mmd](fontes/diagramas-de-sequencia-3.mmd). **Versión representada:** Herramienta UEQ del 06/11/2026.

## 4. Sacar una participación del análisis

Excluir del análisis solo cambia un campo. No se borra nada, y el cambio aparece en el panel y en las exportaciones. El lector no llega hasta aquí: la acción exige el permiso de editar.

```mermaid
sequenceDiagram
    autonumber
    actor Pesq as Researcher
    participant Nav as Browser
    participant Acao as Action alterarInclusao
    participant Sessao as lib/sessao
    participant Estudos as lib/estudos
    participant BD as PostgreSQL

    Pesq->>Nav: unchecks "In analysis" on a row of Responses
    Nav->>Acao: alterarInclusao(estudoId, participacaoId, false)
    Acao->>Sessao: exigirPesquisador()
    Acao->>Estudos: estudoDoPesquisador(estudoId, pessoa, "editar")
    Acao->>BD: participation with this id, from this study and completed
    alt not found
        Acao-->>Nav: error "This participation is not in this study…"
    else found
        Acao->>BD: incluidaNaAnalise = false
        Acao->>BD: notifies the rest of the team in the bell (notificarAlteracao)
        Acao->>Acao: revalidatePath of the study (dashboard, responses, exports)
        Acao-->>Nav: "Participation from … left the analysis. Nothing was deleted…"
        Nav-->>Pesq: notice in role="status"
    end
```

**Herramienta del diagrama:** Mermaid 12.2.0 (`sequenceDiagram`), generado por `pnpm docs:diagramas`. **Archivo fuente:** [diagramas-de-sequencia-4.mmd](fontes/diagramas-de-sequencia-4.mmd). **Versión representada:** Herramienta UEQ del 06/11/2026.

## 5. Exportar el panel en PDF

El servidor abre la página de impresión en un Chromium sin pantalla, con la sesión de quien lo solicitó, y devuelve el PDF. En Vercel, ese Chromium se descarga en la primera llamada, como explica la [arquitectura](arquitetura.md#implantação).

```mermaid
sequenceDiagram
    autonumber
    actor Pesq as Researcher
    participant Nav as Browser
    participant Rota as API route painel-pdf
    participant Sessao as lib/sessao
    participant Chrome as Chromium (Playwright)
    participant Imp as Page impressao
    participant BD as PostgreSQL

    Pesq->>Nav: Export dashboard as PDF
    Nav->>Rota: GET /api/estudos/abc/painel-pdf?versao=v2
    Rota->>Sessao: pesquisadorDaSessao()
    alt no session
        Rota-->>Nav: 401 "Log in to your account…"
    else with session
        Rota->>BD: study with this id and filtroDeAcesso(pessoa)
        alt study not found or no access
            Rota-->>Nav: 404 "Study not found."
        else the person has access
            Rota->>Chrome: launch() and session cookie for the internal origin
            Chrome->>Imp: GET /estudos/abc/resultados/impressao?versao=v2
            Note over Imp,BD: same query and same calculation as in diagram 3
            Imp-->>Chrome: HTML with print CSS (A4, 18 mm)
            Chrome->>Chrome: waits for the fonts, emulates print media
            Chrome-->>Rota: PDF with vector charts
            Rota->>Chrome: close()
            Rota-->>Nav: application/pdf, attachment, ueq_<titulo>_painel_<data>.pdf
        end
    end
```

**Herramienta del diagrama:** Mermaid 12.2.0 (`sequenceDiagram`), generado por `pnpm docs:diagramas`. **Archivo fuente:** [diagramas-de-sequencia-5.mmd](fontes/diagramas-de-sequencia-5.mmd). **Versión representada:** Herramienta UEQ del 06/11/2026.

La ruta usa siempre el origen interno del servidor, nunca la cabecera `Host` de la solicitud, para que la cookie de sesión no vaya a otro dominio.

## 6. Importar respuestas por CSV

Dos pasos: la vista previa lee sin guardar; la confirmación guarda todo en una transacción.

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
    Nav->>Acao: previsualizarImportacao(estudoId, FormData)
    Acao->>Acao: checks session, edit permission, version, extension and size (up to 500 KB)
    Acao->>Imp: lerCsvDeRespostas(texto)
    Imp-->>Acao: valid rows and errors per row
    Acao-->>Nav: preview of the first 5 rows, total and errors
    alt some row with an error
        Nav-->>Pesq: problem of each row, without a confirm button
    else whole file valid
        Pesq->>Nav: confirms
        Nav->>Acao: confirmarImportacao(estudoId, versaoId, texto)
        Acao->>Imp: lerCsvDeRespostas(texto) again
        loop for each row
            Acao->>Ueq: avaliarSuspeita(valores, itens, protocolo)
        end
        Acao->>BD: transaction: one IMPORTADA Participacao, completed and without language, with 26 Respostas, per row
        Acao->>BD: notifies the rest of the team in the bell (notificarAlteracao)
        Acao-->>Nav: redirects to Responses with "N imported"
        Nav-->>Pesq: the rows appear marked "imported from CSV"
    end
```

**Herramienta del diagrama:** Mermaid 12.2.0 (`sequenceDiagram`), generado por `pnpm docs:diagramas`. **Archivo fuente:** [diagramas-de-sequencia-6.mmd](fontes/diagramas-de-sequencia-6.mmd). **Versión representada:** Herramienta UEQ del 06/11/2026.

El servidor vuelve a leer el archivo en la confirmación: la vista previa no es de fiar solo porque venga del navegador.

## 7. Invitar a alguien al estudio

Solo el propietario invita. La persona debe tener ya una cuenta, y el estudio solo le aparece después de aceptar. El correo sale después de la respuesta, y el aviso en la campana existe incluso sin servidor de correo.

```mermaid
sequenceDiagram
    autonumber
    actor Dono as Owner
    participant Nav as Browser
    participant Acao as Study and bell actions
    participant Estudos as lib/estudos
    participant Avisos as lib/notificacoes
    participant BD as PostgreSQL
    participant Smtp as Email server
    actor Conv as Invitee

    Dono->>Nav: Share, enters the email and the role
    Nav->>Acao: convidar(estudoId, FormData)
    Acao->>Estudos: estudoDoPesquisador(estudoId, pessoa, "gerenciar")
    Acao->>BD: looks up the account by email
    alt there is no account, it is the owner or already has access
        Acao-->>Nav: error on the field, saying what to do
    else can invite
        Acao->>BD: creates or renews Colaboracao as PENDENTE
        Acao->>BD: deletes the old invitation from the bell, if any
        Acao->>Avisos: notificar(convidado, tipo CONVITE)
        Avisos->>BD: creates Notificacao in the invitee's language
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
    Acao->>BD: Colaboracao ACEITO or RECUSADO, with respondidoEm
    Note over Conv,BD: only with ACEITO does the study enter the person's filtroDeAcesso
```

**Herramienta del diagrama:** Mermaid 12.2.0 (`sequenceDiagram`), generado por `pnpm docs:diagramas`. **Archivo fuente:** [diagramas-de-sequencia-7.mmd](fontes/diagramas-de-sequencia-7.mmd). **Versión representada:** Herramienta UEQ del 06/11/2026.

## 8. Traducir la interfaz bajo demanda

La pantalla nunca espera a la traducción de la interfaz. Lo que todavía no se ha traducido sale en portugués, y los lotes se ejecutan después de la respuesta. Cada lote se guarda en cuanto vuelve, así que una ejecución interrumpida continúa desde donde se detuvo. Los textos escritos por el investigador siguen un camino parecido, pero la página espera hasta 8 segundos a la API antes de mostrar el original.

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
            Trad->>Claude: traduzirLote(textos, telas, terms and quoted labels, pt, es)
            Claude-->>Trad: first translation
            Trad->>Claude: review, with original and translation side by side
            Claude-->>Trad: corrections of what changed meaning
            Note over Trad: a translation with placeholders different from the original is discarded
            Trad->>BD: stores in Traducao, by language and text hash
        end
    else complete catalog or no API key
        Trad-->>Pag: t() with the available dictionary
        Pag-->>Nav: HTML
    end
    Note over Pag,Nav: if most of it is still in Portuguese, html lang stays pt-BR, so the screen reader pronounces it correctly
```

**Herramienta del diagrama:** Mermaid 12.2.0 (`sequenceDiagram`), generado por `pnpm docs:diagramas`. **Archivo fuente:** [diagramas-de-sequencia-8.mmd](fontes/diagramas-de-sequencia-8.mmd). **Versión representada:** Herramienta UEQ del 06/11/2026.
