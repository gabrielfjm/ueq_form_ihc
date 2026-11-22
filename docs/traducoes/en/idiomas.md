# Languages

The UEQ Tool works in the 37 languages of the official UEQ language package, along two separate paths:

- **The participant link** uses the official terms and instructions and reviewable screen texts, in files. Since it is a measurement instrument, nothing in the questionnaire goes through machine translation.
- **The researcher's tool** is written in Portuguese and translated on demand by the Claude API ([its own section](#a-ferramenta-do-pesquisador)). The texts the researcher writes in a study (title, product and objective) use the same API.

## How the language is chosen

- When creating the study, the researcher chooses its language (`Estudo.idioma`, with the account language as the default). The link opens in that language, even if the browser is set to another one.
- In the consent form and in the questionnaire there is a "Language" selector with the name of each language written in that language itself. Choosing in the selector does not change anything by itself: only the "Apply" button does (WCAG 3.2.2). Switching in the questionnaire returns to it, with the selections kept.
- The choice is stored in a cookie (`ueq_idioma`, only on `/r/<slug>`) and applies to all steps. On giving consent, the language code is stored in `Participacao.idioma`.
- The `<html lang>` and the `dir` follow the language (WCAG 3.1.1). That is why the participant link has its own root layout (`src/app/r/[slug]/layout.tsx`), separate from the tool's (`src/app/(ferramenta)/layout.tsx`).
- In Arabic, Hebrew and Persian the text runs from right to left. The row of circles still runs from left to right, from 1 to 7, with the left term on the left, as in the official PDFs of these languages.

## What comes from where

| Content | File | Source |
|---|---|---|
| 26 pairs of terms | `data/ueq-idiomas.json` | Official PDF of each language, checked against the page image |
| Instruction before the items | `data/ueq-instrucoes.json` | Official PDF of each language, without the example with a marked circle (as in Portuguese) |
| Screen texts (consent, buttons, accessible names, errors, optional data, end) | `src/idiomas/textos/*.ts` | Team translation; the texts of the full consent form (13 Nov 2026) were translated by Claude (Opus) and need native review |
| Privacy policy, seen through the participant link | `traducao` table in the database | Claude API, with the same texts as the tool. Without a translation, it appears in Portuguese, with a notice in the person's language |
| Study title, product and objective | `traducao` table in the database | Claude API, from the study language. The page waits up to 8 seconds; whatever does not arrive in time is shown in the original, marked with its `lang`, and is left for the next visit |

The PDF is the reference because it is the questionnaire the participant would see. The `Items` tab of the UEQ Data Analysis Tool V15 has a different version in several languages:

- in Spanish, the terms have no accents;
- in Italian, Danish, Turkish, Chinese, Bulgarian and Arabic, the wording is different.

Where the PDF's text layer uses a legacy font (Hindi, Marathi, Bengali, Tamil, Kannada), the text came from the spreadsheet and was checked item by item against the image. Hebrew, Persian and Thai also came from the spreadsheet. Each language records its origin in `origemDoTexto`.

## Corrections to the official terms

In 16 pairs the official PDF itself has a defect that prevents answering or that inverts the scoring. All affected languages have translations not yet approved, except Persian and Hindi. The correction is the smallest possible. Each one is kept in `correcoes`, in the JSON, with the original pair and the reason.

| Language | Item | In the official PDF | Used here |
|---|---|---|---|
| Bosnian, Hebrew, Marathi, Bengali, Tamil, Arabic, Kannada | 19 | the same negative term on both sides ("does not meet expectations") | the positive term on the left, as in the English original |
| Hungarian | 16 | `kellemetlen / kellemetlen` | `kellemetlen / kellemes` |
| Hungarian | 19 | `… / elvárásoknak` (cut off) | `… / nem felelnek meg az elvárásoknak` |
| Hebrew | 14 | `לא מושכת / ושך` (cut off) | `לא מושכת / מושכת` |
| Hebrew | 24 | `אטקרטיבי` (typo) | `אטרקטיבי` |
| Kannada | 8 | `ಊಹಿಸಲು ಸಾಧ್ಯವಾದಾಗ` ("when it is possible to predict") | `ಊಹಿಸಲು ಸಾಧ್ಯವಾಗದ` ("not possible to predict") |
| Norwegian | 26 | `ledende / innovativ` (two positive terms) | `konservativ / innovativ` |
| Hindi | 2 and 4 | positive term on the side opposite to the original | terms swapped sides |
| Persian | 16 | `مطلوب / نامطلوب`, positive on the left | `نامطلوب / مطلوب` |

In the items with terms swapped sides, the scoring remains that of the original: whoever marks close to the positive term scores positive. That is the reason for swapping the terms, and not the item's polarity in the database.

Two instruction sentences were left out:

- in Hebrew, the sentences about "pairs grouped by aspect" and "importance of each aspect", which describe a different form;
- in Persian, the sentence asking to cross out the item that cannot be evaluated, because here all items are mandatory.

## Translation not approved

Nine PDFs warn "This translation is not yet finally approved": Arabic, Bengali, Bosnian, Hebrew, Hungarian, Kannada, Marathi, Norwegian and Tamil.

- When one of them is chosen, the consent form shows the notice in that language.
- In Responses, the Language column says "translation not approved".
- The response exports include the `idioma` and `traducao_aprovada` columns.

## Review by a native speaker

Before using a language in a real study, someone fluent should check:

1. the screen texts in `src/idiomas/textos/<código>.ts`, which are all team translations (the Claude API translates only the researcher's tool and the study texts);
2. the corrections in the table above, when the language has any;
3. the instructions marked "Transcrito da imagem… Conferir com falante nativo" (Transcribed from the image… Check with a native speaker) in `data/ueq-instrucoes.json`: Arabic, Hindi, Marathi, Bengali, Tamil and Kannada. In Bengali, the spaces between words were added by the team, because the PDF does not have them.

Responses to the optional data are always stored with the category in Portuguese (for example, "25 a 34 anos" (25 to 34 years)), in any language. The analysis and the exports do not change.

## The researcher's tool

The language is chosen when creating the account and changed in My account › Language or, more quickly, with the language selector in the bar (prototype r41), which does the same without leaving the page. Before logging in, the last language chosen in the browser applies (cookie `idioma_interface`), and the bar's selector also appears for those who have not logged in. Bell notifications and emails are sent in the recipient's language.

How it works:

1. Every screen text is written in Portuguese inside `t("…")` or `m("…")`. The `pnpm i18n:catalogo` command extracts these texts into `src/traducao/catalogo.json`.
2. When a screen is opened in another language, the server reads the translations from the `traducao` table. What is missing is shown in Portuguese, and batches of 60 texts, grouped by screen, run after the response, with up to 6 at the same time, using the model defined in `src/traducao/claude.ts` (Claude Haiku 5.5, the cheapest).
   - Translation runs in three stages, so that the batches do not choose different words for the same thing: first the language glossary (`src/traducao/rodadas.ts`), stored in the table; then the short labels; finally the long texts, which receive the translation of the buttons they quote.
   - Each text is sent with the file that uses it and with instructions on the meaning of the terms, so that "baixar" (download) does not become "dar baixa" (write off).
   - The glossary includes a model sentence that fixes the formal register of the language, and the review treats any other register as an error.
   - The name "Ferramenta UEQ" travels as a placeholder and the translation keeps the name in Portuguese. At display time, the translator replaces the name with the one for the interface language (UEQ Tool, Herramienta UEQ, UEQ-Tool, Outil UEQ, UEQ ツール...), which is kept in `NOME_DA_FERRAMENTA`, in `src/traducao/nucleo.ts`. A sentence not yet translated remains entirely in Portuguese, with the name in Portuguese.
   - A second pass compares original and translation and corrects whatever changed meaning.
   - A translation with `{marcadores}` different from the original is discarded: the text stays in Portuguese.
   - This reduces errors, but does not replace review by a native speaker.
3. Each translation is stored by language and by the hash of the text, so it is never requested twice. Changing a text in Portuguese generates a new translation.
4. Administration › Languages shows the coverage of each language and has the "Translate now" button.

When writing a new text, think of whoever will translate it without seeing the screen:

- Write the complete sentence, with a subject. "Fica num cookie" (Is stored in a cookie) does not say what is stored.
- Avoid words with two meanings. "Baixa os dados" (downloads the data) can become "dá baixa" (writes off); prefer "faz o download".
- Do not build a sentence out of pieces of text and a link: word order changes from language to language.
- Only pass through `t()` or `m()` what appears on the screen. A translated selector or event name breaks the screen.

New texts can also come in already translated, through a migration that writes to the `traducao` table (such as `20261113120100_traducoes_do_termo`, written by Claude without the API). That way the API is not called for them.

Without `ANTHROPIC_API_KEY` in the environment, nothing is translated and the tool appears in Portuguese. While more than half of a language's catalog is not translated, the `<html lang>` and the direction stay in Portuguese, so that the screen reader pronounces correctly.

Only the interface texts and the study texts go to the API. No response, name, email or demographic data goes with them, as the privacy policy states.

## Out of scope

- The results dashboard does not break down by language. To compare languages, use the `idioma` column of the exports.
- The documents in the Documentation tab exist in Portuguese (the original) and in English (translated by Claude, without the API and not yet reviewed by a native speaker, in `docs/traducoes/en/`). In the other 35 interface languages, they appear in English, with a notice that invites people to translate the documentation through a fork and a pull request on GitHub (the steps are in `docs/traducoes/LEIA-ME.md`). The diagrams are in English in every language.
