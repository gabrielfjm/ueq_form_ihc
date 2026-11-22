# Visual identity

## The idea

The tool looks like a **laboratory instrument**, not a SaaS product. Think of a technical form, a well laid-out report, a measuring ruler. White background, dark ink, thin lines, tables, aligned numbers. The only "decoration" is the instrument itself: the row of 7 marks of the semantic differential appears as a visual motif (in the logo, in the progress indicator, in the empty states).

Test for any screen: **if a screenshot of it could come from any dashboard template, redo it.**

## Forbidden

This is what immediately gives away "made by AI". Do not use it on any screen:

- Inter, Geist, Poppins, Montserrat, Roboto or the system default font as the main font
- Gradients of any kind, especially purple/blue/pink
- Glassmorphism, `backdrop-filter: blur`, glow, neon, colored shadows
- Shadows on cards (large, diffuse `box-shadow`). Separation is done with a 1px line or a change of background
- `border-radius` above 4px. No pills, no `rounded-2xl`
- A grid of cards with icon + title + number ("KPI cards") as the opening of the dashboard
- Decorative icons: next to a section heading, in list items, in an empty state. Icons only appear on actions (see "Icons")
- Cream background, serif headings and terracotta accents: this has become the look of AI-generated interfaces (team decision on 22 Oct 2026)
- Monospaced font in numbers and dates, and labels in small caps or letter-spaced capitals: same reason. The only exception is the code block inside a document in the Documentation tab (commands, folder tree), which is content and needs its columns aligned
- Emoji in the interface, in messages, in toasts, in commits
- A centered hero with a huge title, a gray subtitle and two buttons
- Gradient text, "glowing" text, entrance animation on everything (fade-up on lists)
- Skeletons with shimmer. Loading is plain text ("Loading responses…") or nothing if it is fast
- Dark mode as the default
- Traffic-light palette (green/yellow/red) for benchmark bands
- Startup microcopy: "Oops!", "All set! 🎉", "Shall we get started?", "Unlock insights", "in a simple and intuitive way", "supercharge"

## Colors

Defined in `src/styles/tokens.css`. No loose hexadecimal color in a component.

```css
:root {
  --fundo:          #FFFFFF;  /* fundo geral, campos de formulário */
  --fundo-faixa:    #F3F5F7;  /* faixa de cabeçalho, áreas recuadas */
  --fundo-painel:   #F8FAFB;  /* ficha lateral, painel do gráfico */
  --tinta:          #0F1720;  /* texto principal, botões primários */
  --tinta-suave:    #46525E;  /* texto secundário */
  --tinta-fraca:    #5B6672;  /* legendas, rótulos de eixo. 5.4:1 na faixa */
  --linha:          #D5DBE1;  /* réguas e divisórias de tabela. NUNCA borda de campo */
  --borda-campo:    #7A8691;  /* borda de input, select, textarea. 3.4:1 na faixa (WCAG 1.4.11) */
  --linha-forte:    #0F1720;

  --destaque:       #0B6A78;  /* azul-petróleo. Foco, link, item ativo, numeração de seção. Usar pouco */
  --destaque-fundo: #E6F2F4;  /* hover de controles, mensagem de status */

  --alerta:         #B42318;  /* erro, ação destrutiva, alfa baixo, resposta suspeita. Sempre com texto */
  --alerta-fundo:   #FEF3F2;

  /* escalas UEQ, agrupadas pelo construto */
  --atratividade:   #0F1720;  /* impressão geral, na cor da tinta */
  --pragmatica:     #1D4E89;  /* perspicuidade, eficiência, confiabilidade */
  --hedonica:       #9A5B00;  /* estimulação, novidade. ≥ 3:1 inclusive sobre a faixa mais escura do benchmark */

  /* faixas de benchmark: cinza-azulado, do mais escuro (excelente) ao mais claro (ruim) */
  --bench-excelente: #C7D0D9;
  --bench-bom:       #D5DCE3;
  --bench-acima:     #E1E6EB;
  --bench-abaixo:    #EBEFF2;
  --bench-ruim:      #F4F6F8;
}
```

Contrasts checked (WCAG 2.2): ink (`tinta`) 18:1, soft ink (`tinta-suave`) 8:1, faint ink (`tinta-fraca`) 5.9:1, accent (`destaque`) 6.3:1 and alert (`alerta`) 6.6:1 on the white background. On the benchmark bands, text uses only `--tinta` or `--tinta-suave` (≥ 5.1:1). An automated test (`src/styles/__tests__/contraste.test.ts`) recalculates these pairs from tokens.css and fails if any of them drops below the minimum.

Accent and alert have separate roles: the petrol blue indicates where the user is and what is clickable; the red indicates a problem or an action that deletes data. Never swap one for the other.

Also support `@media (forced-colors: active)`: circles, focus and chart markers use `CanvasText`/`Highlight` so they do not disappear in Windows high contrast mode.

Everything in this file is subordinate to `docs/ihc.md`. If an aesthetic choice conflicts with accessibility or usability, the HCI choice wins.

Study status is bold text preceded by a 10px dot, not a colored badge: a filled dot in `--destaque` for open, a hollow one in `--tinta-fraca` for draft, a filled one in `--tinta` for closed. The text always states the status; the dot only reinforces it.

## Typography

Google Fonts via `next/font`:

- **Atkinson Hyperlegible Next** for everything: headings (weight 700), interface text and questionnaire (weight 400). It was designed by the Braille Institute for legibility, which is an HCI argument in itself (worth citing in the presentation). A single family also reinforces consistency (Nielsen 4)
- **Source Sans 3** for numbers (tables, means, CI, alpha, n, dates, counts), via `var(--fonte-numero)`, with `font-variant-numeric: tabular-nums` and right-aligned in tables. Atkinson has a slashed zero and wide tabular figures, which look like code; Source Sans has ordinary, compact figures. So that loose numbers in running text ("60 years or older") also come out in Source Sans, declare an `@font-face` with `unicode-range: U+0030-0039` pointing to it before Atkinson in the font stack. No monospaced font in the interface

Scale (rem): 0.8125 · 0.9375 · 1.0625 · 1.25 · 1.625 · 2.25. Body at 1.0625rem, line height 1.5. Headings with `letter-spacing: -0.015em`. Section and group labels in bold, in a smaller size and `--tinta-suave`, in normal case (no small caps or letter-spaced capitals).

## Layout

- Content aligned to the left, maximum reading width ~72ch, data panels up to 1120px
- 8px grid. Generous vertical space between sections (48 to 64px), tight inside tables
- Researcher navigation: a thin top bar with the tool name on the left and links with icon and text: Studies, Create study, Documentation, Administration (only for administrators), My account, the notification bell, the language selector and Log out. No sidebar. Those who are not logged in (home page and documentation) see the same bar with only Documentation, the language selector and Log in (`log-in`); Create account (`user-plus`) is on the home page and inside the Log in dialog. The participant link has no bar at all
- The bar stays fixed at the top throughout scrolling, on desktop and on mobile. Up to 56rem wide the links sit behind a Menu button (`menu`, and `x` when open, always with the text "Menu"), so that the fixed bar takes up a single line; the menu opens the links in a column right below and closes with Esc or on changing page. At 320 px the row of marks of the logo leaves the bar so that the name and the Menu fit
- Tables are first-class citizens: bold header, rows separated by a 1px rule, numbers aligned to the right
- Primary button: `--tinta` background, `--fundo` text, 2px radius, 40px height. Secondary: 1px `--tinta` border, transparent background. Destructive action: underlined `--alerta` text, which opens a confirmation dialog (see "Dialogs")
- Focus always visible: `outline: 2px solid var(--destaque); outline-offset: 2px`
- Header band in `--fundo-faixa` at the top of the study pages, with title, status, summary and tabs
- Wide researcher screens use two columns (content + side panel) instead of one narrow column with the right side empty
- Home page (`/`): presents the tool and is the screen after login. Text aligned to the left with the questionnaire item and a preview of the results as a figure, an "On this page" table of contents and numbered sections: What is the UEQ, How to read the results, How it works, Studies on the method and Credits. No centered hero
- Option panels (Administration and My account, prototypes r24 and r9): a grid in which each option leads to its own page or opens a dialog, with title, description and status on one line, instead of stacking everything on a single screen. The whole card responds to the click, but it is still a list with headings for the screen reader
- Paged documentation (prototypes r36 to r38): a long document opens as a table of contents, "In this document", with the title and the first sentence of each section, and the long introduction is collapsed. Each section opens on its own page: a short band with Back, the breadcrumb, the title and "7 of 8", a single column, the diagram featured and fitting on the screen, and Previous and Next at the end. A section with 3 or more subsections becomes a table of contents, in two columns when it exceeds 12 items. A document of up to 4,000 characters stays whole
- Privacy policy (`/privacidade`, prototype r33): a band with "Back" at the top and the "In summary" box beside it; below, numbered sections in rows of label and explanation with a rule between them, like the conditions of the consent form, and the fixed "On this page" side panel. "Back" says where it goes and also appears at the end of the page. When the policy was opened in another tab, from the Log in and Create account dialogs, it becomes "Close this tab and return", so as not to lose what the person typed
- Policy in the participant link (`/r/<slug>/privacidade`, prototype p9): the same content, opened by a link at the end of the consent form, with no bar, no icons and no link to the rest of the tool. "Back" leads to the consent form. While the text has no translation into the person's language, a box warns, in their language, that the policy appears in Portuguese

## Dialogs

- Log in and Create account open in a dialog over the page the person is on, with the form on the left and the instrument panel on the right (screens r1 and r2 inside the dialog). Create account and Log in swap the form inside the same dialog. `/entrar` and `/cadastrar` show the home page with the dialog open
- The access dialog fits entirely on the screen, without scrolling: the dimensions shrink with the height (768 px laptop) and, up to 40rem wide, it takes up the whole screen, without the panel (which returns, with the title only, when the screen is tall)
- Log out and every deletion (study, account, study version) ask for confirmation in a narrow dialog: the title as a question ("Delete this study?"), what will happen, Cancel and the action button. In deletions, the warning is in `--alerta-fundo` with a `--alerta` border, the confirmation field (typed title or email) stays and the button is `--alerta`. Log out uses the primary button, because it deletes nothing. On mobile, the buttons are stacked in a column, with the action on top
- Native `<dialog>` with `showModal()`: focus trapped inside, the page behind inert and not scrolling, Esc and the `x` (Close) close it, and the focus returns to whatever opened it. Page background darkened with `--tinta` at 62%, 1px `--linha-forte` border, 2px radius. No shadow or blur
- Initial focus: on the first field (Log in, Create account, deletions) or on the action button when there is no field (Log out, Remove version)
- "Leave without sending", in the participant questionnaire, also confirms in a dialog (prototype p8): the question is the title, "Keep answering" is the primary button and starts with the focus, and Esc also continues. No icon and no `x`, like all the participant screens; the texts come from the chosen language
- Document in production (prototype r23): until the file is added to the `PRONTOS` list of `src/lib/documentacao/catalogo.ts`, the Documentation tab shows the same tabs and sub-tabs, the empty row of marks, "In preparation" with the hollow draft dot and the panel with what the document will contain, with no file, downloads or table of contents. The overview lists the status of each document
- Site icon (`src/app/icon.svg` and `apple-icon.tsx`): three marks of the semantic differential, the last one filled, in white on `--destaque`
- Page help (prototype r30): a round (?) button in the header of each researcher page, with `aria-label`, which opens the medium dialog. It says what the page is for and what can be done on it, links to the Privacy policy and offers to replay the tour
- Share (prototype r25): a medium dialog with who has access and the email invitation, choosing Editor or Viewer

## Actions in progress and confirmations

- Every action that goes to the server uses `BotaoEnvio` (prototype r39). While it runs, the button says what is happening ("Creating the study…"), with the spinning indicator, has `aria-busy` and `aria-disabled` and ignores further clicks, and the rest of the form stops responding to clicks. Nothing is sent twice
- The indicator is the only continuous animation in the tool and stops with `prefers-reduced-motion`. On the participant screens there is no indicator or icon: only the text "Please wait…", in the person's language
- Every completed action confirms on screen (prototype r40): a box in `--destaque-fundo` with a `--destaque` border, in `role="status"`, preferably stating the result ("Study created successfully."). It follows the scrolling, just below the bar, and stays until the person closes it. An action error uses `--alerta-fundo`, a `--alerta` border and another icon, so that it does not look like a confirmation
- A notice that came through the address (`?aviso=`) is removed from it after being shown: reloading does not confirm again

## Bell, language and tour

- Bell (prototype r26): sits between My account and the language selector. Unread notifications appear in a `--alerta` counter with the number in text. It opens the most recent notifications and leads to the Notifications page (r27), where invitations have Accept and Decline right there
- Language selector (prototype r41): a shortcut to My account › Language, between the bell and Log out (without login, between Documentation and Log in). On desktop it shows the `languages` icon and the code of the current language ("PT"), and the full name is left for the screen reader; in the mobile menu it appears as "Language: Português". It opens below like the bell, without being modal, with the 37 languages by their own names in three columns and the current one marked with `check`. Only the click switches (WCAG 3.2.2), and the page stays the same, already in the new language
- Guided tour (prototypes r28 and r29): starts with a welcome dialog on first access. Each step highlights a real element of the screen and a card beside it explains. In some of the steps, the person performs the action themselves to move on. It can be skipped or closed at any time, and replayed from the help

## Emails

The invitation and the notifications go out with the same identity: white background, `--fundo-faixa` band, dark ink, the row of 7 marks and petrol blue only on what is clickable. They are built with tables with inline styles, without images, and include the plain-text version. They go out in the recipient's language (`src/lib/modelo-email.ts`).

## Icons

Lucide (`lucide-react`), 1.5 px stroke, 18 px, in the color of the text beside it.

- An icon only accompanies text on **actions**: buttons, action links, main navigation and tabs. The text is always visible; the icon has `aria-hidden="true"`
- An icon on its own only for close and menu, with `aria-label`. Exception: on mobile, the zoom buttons of the full-screen diagram (`zoom-out`, `zoom-in`, `maximize`) show only the icon so that Back and the zoom fit on one line; the text (Zoom out, Zoom in, Fit to screen) remains as the accessible name and appears on desktop
- A destructive action uses the icon in the `--alerta` color, together with the text
- **No icon on the participant screens inside the questionnaire** (ihc.md, section 3: any additional element can influence the response)
- Map used on the screens: Studies `folder`, Create study `plus`, My account `user`, Save changes `save`, Change password `lock`, Log out `log-out`, Log in `log-in`, Create account `user-plus`, Overview `layout-dashboard`, Results `bar-chart-3`, Responses `list`, Copy link `copy`, Open data collection `play`, Close data collection `square`, Reopen `rotate-ccw`, Edit `pencil`, Delete `trash-2`, Export `download`, Show password `eye`, Add version `plus`, Remove `x`, Remove from analysis `minus-circle`, status message `check-circle`, Documentation `book-open`, View on GitHub and Open at full size `external-link`, Download `download`, Back `arrow-left`, Administration and Privacy policy `shield-check`, Notifications `bell`, Help `circle-help`, Replay the tour `compass`, Language `languages`. Documentation tabs: Overview `layout-dashboard`, Requirements `list-checks`, Users `users`, Modeling `shapes`, Architecture `layers`, Tests `flask-conical`, Specification `file-text`
- Motion: only a 120ms transition on color/border and the action-in-progress indicator. Respect `prefers-reduced-motion`

## Key screens

### Participant questionnaire (`/r/[slug]`)
The most important screen. It is where the team shows that it understands HCI.

- Minimal header: name of the evaluated product and an instruction sentence in the style of the official UEQ
- Consent form first, on its own page, with the full text, a link to the privacy policy and an "I agree and want to take part" button. No hidden checkbox
- The form (prototype p1) lists, numbered: time, optional data (when applicable), participation, after submitting, anonymity, use of data, risks, benefits, responsible researcher and ethics committee (when applicable). The subtitle carries the study's institution. Below, "Privacy policy" and "Keep a copy of this form" (prototype p10), the question "How old are you?" and, for "Under 18", the confirmation of the parent or guardian's authorization
- Items in rows, one per item, with a thin rule between them. Left term aligned to the right, 7 circles in the center, right term aligned to the left. No visible numbers
- Circles with a 44×44px touch area, 1.5px `--tinta` outline, filled with `--tinta` when marked
- Keyboard: native radio behavior (Tab between items, arrow keys within the item). No single-key shortcut, which conflicts with screen readers (WCAG 2.1.4). Each item is a `<fieldset>` with a `<legend>`, details in `docs/ihc.md` section 4.1
- A discreet "Leave without sending" link in the footer, which asks for confirmation in a dialog (see "Dialogs")
- Mobile (< 640px): the two terms sit on one line above the 7 circles, one at each end
- Progress: the text "14 of 26" fixed in the footer + the row of 7 marks as an icon. No colored progress bar
- When submitting with a missing item: error summary at the top with a link to each item ("2 items left: 7 and 19"), focus moves to the summary, and each missing item gets a `--alerta` left border + the text "This item has not been answered"
- `scroll-padding-bottom` equal to the height of the fixed footer, so the focus is never hidden
- End: a simple thank-you page, in a box with a `--fundo-painel` background and a 3px `--destaque` bar on the left. No confetti. Single-screen notices (link closed, already responded, left) use the same box
- All steps open with the same `--fundo-faixa` band as the consent page: step ("Step 2 of 3 · Questionnaire") and title. On the consent page and in the questionnaire the band has the language selector; switching in the questionnaire returns to it, with the marks kept in the draft
- Official UEQ instruction in a box (`--fundo-painel`, 1px `--linha` border) above the items, with the full text and in the order of the language pack
- Each item shows its number in `--tinta-fraca` on the left, to find the item the error summary points to; the number is also in the legend. An answered item gets a 3px `--destaque` bar on the left, the same for any marked position; a missing item, the same bar in `--alerta` with a `--alerta-fundo` background. On desktop the row lightens (`--fundo-painel`) with the mouse over it, so the eye does not get lost between term and circles
- 30px circles; a marked one is a ring with the center in `--tinta`, like the option buttons of the optional data
- Optional data: each option is a whole clickable row, with a `--borda-campo` border; the chosen one has a `--tinta` border and a `--destaque-fundo` background. Continue and Skip this step keep the same weight

### Study dashboard
Opens with a **summary line in text**, not with cards: "34 responses · 3 suspicious · 31 in the analysis · data collection open since 4 Nov".

Main chart (custom SVG, `src/graficos/EscalasComBenchmark.tsx`):
- One horizontal line per scale, axis from -3 to +3
- Behind each line, the 5 benchmark bands of that scale in shades of blue-gray, with the band label
- Neutral range (-0.8 to +0.8) marked with two dashed vertical lines and the label "neutral" at the top
- The mean is a dot (8px circle in the color of the construct), the CI95 is a horizontal line with end caps
- To the right of the chart, the mean in tabular figures and the benchmark band in text
- Scales grouped with a bold label: Attractiveness / Pragmatic Quality / Hedonic Quality

Below, a complete table (n, mean, sd, CI95, alpha, band). Alpha < 0.7 appears with the value in `--alerta` and a footnote.

Chart per item: list of the 26 items with both terms and a dot at the position of the mean (-3 to +3), in the official order or grouped by scale (switchable).

Comparison between versions: the same scales chart, with one marker per version (filled circle and hollow circle, or square), with a text legend above.

### Empty states
No illustration. One direct sentence and the action. E.g.: "No responses yet. Share the study link to start data collection." + a copyable link in a field with a `--fundo-painel` background and a "Copy link" button.

## Exceptions

The home page departs from two rules of the "Forbidden" section: the top band has a soft radial gradient, and figures and cards have a radius of 6 to 8 px (`inicio.module.css`). The exception is deliberate and restricted to it: the home page introduces the UEQ to those who do not yet know the tool, and the working screens follow the rule. The bell counter has a 10 px radius, which is the shape of the number.

## Tone of voice

Brazilian Portuguese, short sentences, verb first on buttons ("Criar estudo" (Create study), "Encerrar coleta" (Close data collection), "Exportar respostas" (Export responses)). It speaks as a researcher talking to a researcher. UEQ terms with their official names (Perspicuidade (Perspicuity), not "Clareza" (Clarity)). Dates in dd/mm/yyyy, numbers with a decimal comma.
