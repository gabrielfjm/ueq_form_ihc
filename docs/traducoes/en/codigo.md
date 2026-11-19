# How to write the code

The goal is code that looks like it was written by a team that knows the domain, not generic code. In practice:

## Names
- Domain in Portuguese and consistent with the database: `Estudo`, `Versao`, `Participacao`, `Resposta`, `Item`, `Escala`, `Polaridade` (study, version, participation, response, item, scale, polarity)
- No `data`, `info`, `item2`, `handleStuff`, `processData`, `utils.ts`, `helpers.ts`
- Functions say what they calculate: `mediaPorEscala`, `intervaloConfianca95`, `alfaCronbach`, `marcarSuspeitos` (mean per scale, 95% confidence interval, Cronbach's alpha, flag suspicious responses)

## Comments
- They only explain **why**, never **what**. Forbidden: `// Importa o React`, `// Função para calcular a média`, `// Handle error` (imports React, function to calculate the mean, handle error)
- Every UEQ protocol rule in the code cites its source: `// Handbook UEQ, seção 5: amplitude > 3 indica inconsistência` (UEQ Handbook, section 5: a range > 3 indicates inconsistency)
- No comments in English mixed with Portuguese
- No JSDoc on obvious functions

## Structure
- A file with more than ~200 lines is a sign that it needs to be split
- A component does one thing. Data logic lives in a Server Component or a route, not in a `useEffect` with `fetch`
- Prefer Next's Server Components and Server Actions. Client Component only where there is interaction (questionnaire, dialogs, tour, dashboard filters)
- Every access to a study goes through `estudoDoPesquisador` or `filtroDeAcesso`. Never fetch a study by its id alone
- A button that calls the server is `BotaoEnvio`, with `textoEnviando`. Every completed action confirms on screen: `MensagemStatus`, `useAnunciar` or `?aviso=` on the destination page
- No abstraction layers "for the future" (generic repository, factory, single-function service)
- No `try/catch` wrapping everything. Handle an error where something useful can be done with it
- No `any`. No `as unknown as`. Prisma and Zod types are reused, not redeclared

## Interface texts
- Researcher screen text is written in Portuguese inside `t("…")` or, outside a component, `m("…")`. Values go in as placeholders: `t("{nome} convidou você", { nome })` ("{nome} invited you")
- After changing a text, `pnpm i18n:catalogo` generates `src/traducao/catalogo.json`. A test fails if the catalog is out of date
- Participant text does not go through machine translation: it goes into `src/idiomas/textos/`, in the 37 files, with the `TextosParticipante` type checking the placeholders
- To find text without `t()`, run with `TRADUCAO_PSEUDO=1`: whatever appears without ⟦ ⟧ was left out

## Documents
- The `.md` is the single source, read by GitHub and by the Documentation tab. A new document goes into `src/lib/documentacao/catalogo.ts`, and only appears on the site after it goes into the `PRONTOS` list
- Every diagram states, right below it, the tool used and its version, the source file to download in `docs/documentacao/fontes/` and the version of the UEQ Tool it represents (commit or date)
- After changing a Mermaid diagram, `pnpm docs:diagramas` regenerates the SVG and the source file. A test fails if either of them is out of date

## What must not appear
- A forgotten `console.log`
- Commented-out code
- `TODO` without a name and date (`// TODO(luiza, 12/11): ...` is acceptable)
- Fake data (lorem ipsum, "John Doe", "Acme") outside `data/fixtures` and the development seed
- Generic error messages ("Something went wrong", "Ocorreu um erro" (an error occurred)). Say what happened and what to do
- README with emoji, badges and a "✨ Features" section

## Commits
- Small and frequent, in Portuguese, imperative, without emoji: `calcula alfa de Cronbach por escala`, `valida itens faltando no questionário` (calculate Cronbach's alpha per scale, validate missing items in the questionnaire)
- One commit per logical change. No "update", "fix", "wip" on their own
- Each member commits what they led, with their own account

## Tests
- The `src/ueq/` module has full coverage and tests against `data/fixtures` (numbers from the official spreadsheet)
- Test names in Portuguese describing the behavior: `it('marca como suspeito quem é inconsistente em 3 escalas')` (flags as suspicious whoever is inconsistent in 3 scales)
- A new screen has an e2e test with `verificarAcessibilidade` (axe-core), including in error states. Each test runs on desktop and on mobile
- Every test case is recorded in `docs/documentacao/casos-de-teste.md` and in its `.csv`
