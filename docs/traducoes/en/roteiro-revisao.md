# Review script

For whoever will review the tool before delivery. It says what to open, what to do on each screen, what to evaluate and how to record findings.

## What the tool is

The tool administers the User Experience Questionnaire (UEQ) and analyzes the responses. There are two audiences:

- **Researcher:** creates a study with one or more versions of a product, shares a link and follows the results dashboard.
- **Participant:** opens the link, without an account, and answers the 26 word pairs in 3 to 5 minutes, in one of the 37 UEQ languages.

Researchers also work in teams, receive notifications in a bell and can use the tool in any of the 37 languages.

## How to open it

**In production:** https://ferramenta-ueq.vercel.app. Create your account in "Create account". Without the sample study, create a study of your own or use the demonstration scenarios in Administration, if your account is an administrator account.

**On your own machine:** on a computer with Docker, Node and pnpm, in the repository folder:

```
docker compose up -d
pnpm install
cp .env.example .env
pnpm db:migrate
pnpm db:seed
pnpm dev
```

Then open http://localhost:3000.

- **Ready-made researcher account:** `pesquisador@exemplo.com`, password `senha-de-teste`. It already has the "Estudo de exemplo" (sample study), with 35 responses in 2 versions, 4 of them suspicious.
- **Participant link for this study:** http://localhost:3000/r/exemplo. Each browser responds once. To respond again, use a private window.
- **To see another language in the questionnaire:** change it in the "Language" selector of the consent form.
- **To see the tool in another language:** the language selector in the bar ("PT"), or My account › Language. Without `ANTHROPIC_API_KEY`, the interface stays in Portuguese.

## The screens, in order of use

For each screen, do the task and compare it with the prototype in `docs/prototipos/alta-fidelidade/`.

| # | Screen | How to get there | Prototype | Task |
|---|---|---|---|---|
| 1 | Home page | http://localhost:3000 | r16, r16b logged in | Explain, just by reading, what the UEQ is and what the tool does |
| 2 | Log in | "Log in" button in the bar, opens a dialog | r17, r18 on mobile | Log in with the ready-made account, first getting the password wrong |
| 3 | Create account | "Create account" in the Log in dialog | r19, r2 with error | Create an account leaving a field empty, then correct it |
| 3a | Privacy policy | link in the access dialogs, in the home page footer, in My account and in the help | r33 | Open it through two different paths and use "Back". Say what happens to your responses |
| 3b | Guided tour | first access of a new account | r28, r29 | Follow part of the tour, then skip it |
| 3c | Study list | "Studies" menu | r3 | Find the "Estudo de exemplo" (sample study) |
| 4 | Create study | "Create study" | r4, r39 while submitting, r40 on confirmation | Create a study with 2 versions and click Create study twice |
| 5 | Study in draft | after creating | r4b | Open data collection and copy the link |
| 6 | Study page | study title in the list | r5 | Close and reopen data collection |
| 7 | Consent | the study link | p1 | Read the consent form and change the language |
| 7a | Policy, in the participant link | "Privacy policy", at the end of the consent form | p9 | Say what happens to your responses and go back to the consent form |
| 8 | Questionnaire | "I agree and want to take part" | p7 (desktop), p2 (mobile), p8 (leave without submitting) | Answer everything, leaving 2 items blank on the first attempt |
| 9 | Missing item | submit incomplete | p3 | Use the summary to reach the missing items |
| 10 | Optional data | after submitting, only if the study collects it | p4 | Answer one question and skip the others |
| 11 | End | "Continue" | p5 | — |
| 12 | Closed link | the link of a closed or draft study | p6 | — |
| 13 | Results, one version | "Results" tab | r6 | Say, just by looking, which scale did best and whether it was above the benchmark |
| 14 | Results, comparison | "Compare versions" | r7 | Say which version did best in Stimulation |
| 15 | Responses and suspicious responses | "Responses" tab | r8 | Show only the suspicious ones, remove one from the analysis and put it back |
| 15a | Demographic data | sub-tab in "Results", in a study with collection turned on | r31, r32 to turn on collection | Say which age group was the most common |
| 15b | Share | "Share" on the study page | r25 | Invite another account as Viewer and, in that account, accept |
| 15c | Bell and notifications | bell in the bar, then "See all notifications" | r26, r27 | Find the invitation and the notice of new responses |
| 15d | Page help | (?) button in the header of each page | r30 | Open it on two pages and say whether the explanation helps |
| 16 | My account | "My account" menu | r9, r35 for the language | Change the name and download your data |
| 16d | Language from the bar | "PT" selector in the bar, logged in and logged out | r41 | Switch to another language and back to Portuguese without leaving the page |
| 16a | Administration | "Administration" menu, only for an administrator account | r24, r24b, r24c, r34 | Create an account and look at the language coverage |
| 16b | Documentation | "Documentation" menu, logged in and logged out | r10 to r15, r23, r36 to r38 | Open a document, go into a section, enlarge a diagram, follow a link to another document and use Back |
| 16c | Log out and deletions | "Log out"; delete study; delete account | r20, r21, r22 | Cancel and confirm, also using Esc |
| 17 | Export | end of the "Results" tab | r6, section 04 | Download the official UEQ spreadsheet (XLSX), open it in Excel and compare it with the dashboard; download the dashboard as PDF |
| 18 | Import responses | "Responses" tab, "Import responses from a CSV" | no prototype | Import `data/fixtures/basico/respostas.csv` into a version |
| 19 | Dashboard as PDF | "Dashboard as PDF" | no prototype | Open the PDF and check whether it can be used in the report |
| 20 | Language selector | top of the consent form | no prototype | Choose Arabic or Japanese and answer the questionnaire |

Screens 18 to 20 have no prototype. Evaluate whether they follow the same pattern as the others: buttons, fields, tables, messages and tone of voice.

## What to evaluate

Do all three fronts. Each person does the first two alone; the consolidation is done as a group.

1. **Heuristic evaluation.** On each screen, look for problems using Nielsen's 10 heuristics. Give the severity from 0 to 4 (table below).
2. **Manual accessibility checklist.** Use `docs/checklist-manual.md`: screen reader, keyboard only, zoom, color blindness and a real phone. The automated tests do not replace any of these items.
3. **Check of the decisions.** In `docs/rastreabilidade-ihc.md`, each row states a decision and where it appears. Check on screen whether it is true. The section "O que nenhum teste automático cobre" (What no automated test covers) lists what most needs a human eye.

**Severity scale (Nielsen):**

| Rating | Meaning |
|---|---|
| 0 | Not a usability problem |
| 1 | Cosmetic: fix if there is time left |
| 2 | Minor: low priority |
| 3 | Major: important to fix |
| 4 | Catastrophe: fix before delivery |

## How to record findings

One row per problem, in a shared team spreadsheet:

| Screen (#) | Heuristic or WCAG criterion | What happened | Severity | Suggestion | Found by |
|---|---|---|---|---|---|
| 8 | Nielsen 9 | Example: when submitting incomplete, it was not clear how many items were missing | 3 | Show the number at the top | Name |

Record what happened, not the solution. If you are not sure whether it is a problem, record it anyway, with severity 1.

## What has already been tested automatically

No need to spend time on:

- checking whether each screen passes axe-core;
- checking that no screen scrolls horizontally at 320 px;
- checking that the whole flow works with the keyboard only.

The end-to-end tests already do this on every screen, on desktop and on mobile. The UEQ calculations are also tested. The check against the official spreadsheet is automatic too: 11 scenarios in `data/fixtures/` with the numbers of the UEQ Data Analysis Tool (`data/fixtures/LEIA-ME.md`).

What is left for you is what only a person can evaluate:

- whether the screen is understandable;
- whether the text is clear;
- whether the screen reader sounds right;
- whether the thumb hits the circle;
- whether the dashboard leads to the right conclusion.

## Requests for attention

- **Dashboard (screens 13 and 14):** can someone who does not know the UEQ draw the right conclusion?
- **Questionnaire on mobile (screens 8 and 9):** answer standing up, with one hand.
- **Languages (screen 20):** if someone on the team speaks a language other than Portuguese, review its texts. The translations of the participant screens were made by the team, and those of the tool, by the Claude API (`docs/idiomas.md`).
- **Guided tour (screen 3b):** can someone who has never seen the tool follow it?
- **Privacy policy (screen 3a):** does a participant understand what happens to their responses?
- **Screens without a prototype (18 to 20):** they are the least reviewed so far.
