# HCI foundations applied to the tool

This file turns the HCI literature into verifiable requirements. Every interface decision must be traceable to a principle in it. Whoever implements a screen checks the "Requirements per screen" section and the "WCAG checklist" before considering the task done. The link between each decision and the code and tests is in [interface decisions](rastreabilidade-ihc.md).

Conformance target: **WCAG 2.2 level AA** (W3C, 2023), which is also the basis of **ABNT NBR 17225:2025** (accessibility in web content and applications). The Brazilian Inclusion Act (Lei Brasileira de Inclusão, Law 13.146/2015, Art. 63) makes website accessibility mandatory in Brazil.

## 1. Theoretical basis used

| Reference | What we take from it |
|---|---|
| ISO 9241-11:2018 | Definition of usability: effectiveness, efficiency and satisfaction for specified users, with specified goals, in a specified context of use. That is why section 2 defines users and contexts before any screen |
| ISO 9241-110:2020 | 7 interaction principles: suitability for the user's tasks, self-descriptiveness, conformity with user expectations, learnability, controllability, use error robustness, user engagement |
| Nielsen (1994), 10 heuristics | Checklist for the heuristic evaluation carried out by the team |
| Shneiderman et al., 8 golden rules | Strive for consistency, seek universal usability, offer informative feedback, design dialogs to yield closure, prevent errors, permit easy reversal of actions, keep users in control, reduce short-term memory load |
| Norman (2013) | Affordances and signifiers, natural mapping, feedback, constraints, conceptual model |
| Fitts's law | Important targets large and close to where the eye and the cursor already are |
| Hick-Hyman law | Few options per decision. One main action per screen |
| Gestalt (proximity, similarity, common region) | Visual grouping of the UEQ scales by construct, label close to the field |
| WCAG 2.2 / NBR 17225 / eMAG | Testable accessibility requirements (section 5) |
| Laugwitz, Held and Schrepp (2008) and UEQ Handbook | Semantic differential format, official instruction, fixed order of the items |

## 2. Users and context of use (ISO 9241-11)

**Participant**
- Any adult. May have low digital literacy, low vision or color blindness, use a screen reader (NVDA, VoiceOver, TalkBack), navigate by keyboard only, or use 200% zoom or more
- Often accesses the study on a phone (link received by WhatsApp or email)
- Has no account and no intrinsic motivation: any friction leads to abandonment
- Goal: respond quickly (3 to 5 minutes) and leave
- Measure of success: high completion rate, no forgotten items, time close to the one given in the handbook

**Researcher**
- Graduate student or researcher, knows UX but not necessarily statistics in depth. May work in a team and use the tool in any of the 37 languages
- Uses a desktop, in short and repeated sessions (opens the dashboard several times during data collection)
- Goal: set up the study without errors, follow the data collection, understand the results and export them for the report
- Measure of success: creates a complete study without help, interprets the dashboard correctly, checks the numbers against the official spreadsheet

## 3. The questionnaire as a measuring instrument

This is where HCI meets research methodology. Any interface bias contaminates the data.

1. **No preselected option.** A default value causes anchoring and unintended responses
2. **The 7 positions have identical visual weight.** Same size, same color, same spacing. No graded color (red → green), no numbers, no intermediate labels, no highlighted middle position. This preserves the validated semantic differential format
3. **Official order and polarity, always.** Alternating the poles is deliberate in the UEQ, to reduce acquiescence. The interface never "tidies up" the poles
4. **Official UEQ instruction** at the top, in the wording of the language pack
5. **Identical layout for the 26 items.** A change of layout between items changes the response
6. **The participant never sees results** or the mean of other participants
7. **Withdrawing is easy and explicit** (ethics in research with human participants). The "Leave without sending" link is always available, with confirmation in a dialog, and nothing is written to Resposta (Response) before submission
8. **Real anonymity.** Do not collect IP address, name or email. Demographics only in ranges, always with "Prefer not to say", and the whole step only exists if the researcher turns on its collection in the study

## 4. Requirements per screen, with the justifying principle

Format: requirement → principle (source).

### 4.1 Participant questionnaire

| Requirement | Principle |
|---|---|
| Each item is a `<fieldset>` with a `<legend>` containing both terms ("Item 4 of 26: easy to learn or difficult to learn"). The 7 options are styled native `<input type="radio">` elements, not a `div` with onClick | Name, Role, Value (WCAG 4.1.2), Info and Relationships (1.3.1), signifiers (Norman) |
| Each radio has an accessible name with the position and the nearest pole ("3 of 7, closer to easy to learn"). Position 4: "4 of 7, centre" | Labels or Instructions (3.3.2), self-descriptiveness (ISO 9241-110) |
| Clickable area of each circle ≥ 44×44 px, even if the drawn circle is smaller. Spacing between targets that prevents touching the neighbor | Target Size (WCAG 2.5.8 asks for 24 px; we use the 44 px of the Apple HIG / WCAG AAA 2.5.5), Fitts's law |
| Terms clickable too: clicking the left term does not mark anything (avoids accidental responses), but the terms sit close to the ends of the scale | Natural mapping (Norman), error prevention (Nielsen 5) |
| Marking an option does not move the focus or scroll the page by itself | On Input (WCAG 3.2.2), keep users in control (Shneiderman 7) |
| Keyboard: Tab enters the group, the arrow keys change the option (native radio behavior), Tab leaves to the next item. No single-key shortcuts that conflict with screen readers | Keyboard (2.1.1), No Keyboard Trap (2.1.2), conformity with user expectations (ISO 9241-110) |
| Progress "14 of 26 answered" updated on every mark and announced with `aria-live="polite"` only every 5 items and on completion (so as not to flood the screen reader) | Visibility of system status (Nielsen 1), Status Messages (4.1.3) |
| The fixed progress footer never covers the focused item: `scroll-padding-bottom` equal to the footer height | Focus Not Obscured (WCAG 2.4.11) |
| Validation only on submission, not on each item. Error: summary at the top with a link to each missing item ("2 items left: 7 and 19"), focus moves to the summary, each missing item gets a border and the text "This item has not been answered" (not just color) | Error Identification (3.3.1), Error Suggestion (3.3.3), Use of Color (1.4.1), Nielsen 9 |
| Responses saved in sessionStorage while the participant answers | Use error robustness (ISO 9241-110), Shneiderman 6 |
| No time limit | Timing Adjustable (2.2.1) |
| At 320 px width and at 400% zoom nothing is cut off or requires horizontal scrolling. On a phone the terms move above the circles | Reflow (1.4.10), Resize Text (1.4.4) |
| Page with the `lang` and `dir` of the chosen language, `<title>` per step ("Consent · Study X", "Questionnaire · Study X") | Language of Page (3.1.1), Page Titled (2.4.2) |
| A single main action per page (I agree / Send answers) | Hick's law, aesthetic and minimalist design (Nielsen 8) |
| The consent form links to the privacy policy, on a page inside the participant link, with no path to the rest of the tool. The questionnaire itself has no such link, so as not to add anything to the instrument | Transparency (LGPD, Art. 9), research ethics, §3 |
| Clear steps: Consent → Questionnaire → Optional data → End, with a textual indication of the current step | Design dialogs to yield closure (Shneiderman 4) |
| The form states the time and that there is no limit, how to withdraw, what happens after submitting, how long the data are kept, the risks, the benefits and who is responsible for the research. The questionnaire repeats the time above the instruction | Visibility of system status (Nielsen 1), LGPD Art. 9 |
| People under 18 only take part after confirming the authorization of their parent or guardian | LGPD Art. 14 |

### 4.2 Researcher screens

| Requirement | Principle |
|---|---|
| A "Skip to content" link as the first focusable element | Bypass Blocks (2.4.1) |
| A real heading hierarchy (one `h1` per page, `h2` per section) | Headings and Labels (2.4.6), 1.3.1 |
| Forms: visible label above the field, linked by `for`/`id`, correct `autocomplete` (`email`, `current-password`, `new-password`, `name`) | 1.3.5, 3.3.2 |
| Login accepts pasting the password and password managers. "Show password" button | Accessible Authentication (3.3.8) |
| When creating a study, do not ask again for what has already been given (the product name becomes the suggested name of the first version) | Redundant Entry (3.3.7) |
| Deleting a study: confirmation by typing the title, showing how many responses will be lost. Closing data collection is reversible (Reopen) | Error prevention (Nielsen 5, WCAG 3.3.4), permit easy reversal of actions (Shneiderman 6) |
| Logging out and every deletion confirm in a dialog (native `<dialog>`) that says what will happen, with Cancel beside it. Focus trapped inside, Esc closes without doing anything and the focus returns to whatever opened it | Error prevention (Nielsen 5), user control and freedom (Nielsen 3), 2.1.2, 2.4.3, 3.3.4 |
| Log in and Create account open in a dialog over the current page, without losing one's place, and fit on the screen without scrolling | User control and freedom (Nielsen 3), reduce short-term memory load (Shneiderman 8), 1.4.10 |
| Every action gives visible and announced feedback: "Data collection open. The link already accepts responses." in a `role="status"` region, which follows the scrolling and stays until the person closes it | Feedback (Norman, Shneiderman 3), 4.1.3, 2.2.1 |
| While the action runs, the button says what is happening and blocks further clicks, so nothing is sent twice | Visibility of system status (Nielsen 1), error prevention (Nielsen 5), 4.1.3 |
| Study status written out, always in the same place, with its consequence ("Open · accepting responses") | Visibility of system status (Nielsen 1) |
| UEQ terms with their official names and a short explanation available through `<details>` ("What is Perspicuity?") | Match between system and the real world (Nielsen 2), help and documentation (Nielsen 10), progressive disclosure |
| The same button, table and message pattern on every screen | Consistency and standards (Nielsen 4), strive for consistency (Shneiderman 1) |
| No information depends on hover. If there is a tooltip, it also opens on focus, can be dismissed with Esc and does not disappear when the mouse moves over it | Content on Hover or Focus (1.4.13), recognition rather than recall (Nielsen 6) |

| Help (?) on every researcher page: what the page is for and what can be done on it | Help and documentation (Nielsen 10), self-descriptiveness (ISO 9241-110) |
| Tour on first access, run on the real screens, which can be skipped, closed and replayed | Learnability (ISO 9241-110), user control and freedom (Nielsen 3), Nielsen 10 |
| Bell showing the unread notifications as a number and as text, grouping responses while the notification is unread. The notification can also go by email, and this can be turned off in My account | Visibility of system status (Nielsen 1), reduce short-term memory load (Shneiderman 8), keep users in control (Shneiderman 7) |
| Share says what each role can do (Editor, Viewer) before the invitation. Whoever cannot perform an action does not see its button | Error prevention (Nielsen 5), aesthetic and minimalist design (Nielsen 8) |
| Administration and My account as panels: each option shows its current state and leads to its own page | Recognition rather than recall (Nielsen 6), Hick's law, progressive disclosure |
| Privacy policy one click away: in the access dialogs, on the home page, in My account and in the help. "Back" says where it goes, and the policy opens in another tab when there is a filled-in form | User control and freedom (Nielsen 3), Shneiderman 7, transparency (LGPD, Art. 9) |
| Interface in the account's language, chosen when creating the account and changed in My account. `lang` and `dir` follow the language in which the screen is actually rendered | Seek universal usability (Shneiderman 2), 3.1.1 |

The documentation follows the same principle of load: a long document opens as a table of contents, each section on its own page with Back and Previous/Next, and the diagram fits on the screen (progressive disclosure, Nielsen 3 and 8, WCAG 2.4.5 and 2.4.8).

### 4.3 Results dashboard and charts

| Requirement | Principle |
|---|---|
| Every chart has `role="img"`, `<title>` and `<desc>` with the reading in text ("Attractiveness: mean 1.42, CI from 1.10 to 1.74, Good band") and an equivalent table visible right below it | Non-text Content (1.1.1), 1.3.1 |
| Scales distinguished by shape and position, not only by color. Versions in the comparison: filled circle, hollow circle, square, in addition to color | Use of Color (1.4.1), tested with color blindness simulation |
| Chart markers and lines with contrast ≥ 3:1 against the background and against the benchmark bands | Non-text Contrast (1.4.11) |
| Benchmark bands with a text label, not just a background shade | 1.4.1 |
| Scales grouped into Attractiveness / Pragmatic / Hedonic, with spacing and a group label | Gestalt (proximity, common region), the UEQ conceptual model |
| The interpretation is written next to the number ("positive", "Good in the benchmark"). The researcher does not need to remember the thresholds | Recognition rather than recall (Nielsen 6), Shneiderman 8 |
| The low alpha and small sample alerts explain what they mean and what to do | Nielsen 9 and 10 |
| Filters and comparison mode reflected in the URL (you can go back, reload and share) | User control and freedom (Nielsen 3) |
| Excluding responses from the analysis can be undone, and the dashboard shows how many are out | Shneiderman 6, Nielsen 1 |
| Demographic data in its own sub-tab of Results, each question with the chart that suits it, and the table of numbers under "View the numbers" | Gestalt, 1.1.1, progressive disclosure |

### 4.4 Export
- Each export link states the format, the content and what it is for. A download does not open in a new tab without warning
- Readable, dated file name

## 5. WCAG 2.2 AA checklist (the most relevant criteria here)

The table says how the tool meets each criterion and what proves it. axe-core runs on every screen and in each error state of the end-to-end tests; what it cannot reach is in the manual cases ([manual checklist](checklist-manual.md)).

### Perceivable

| Criterion | How the tool meets it | Evidence |
|---|---|---|
| 1.1.1 Text alternatives for charts and icons | Every chart has a description and a visible table with the same numbers; decorative icons are kept out of the accessibility tree | [CT-E29](documentacao/casos-de-teste.md#ct-e29), [CT-M05](documentacao/casos-de-teste.md#ct-m05) |
| 1.3.1 Semantic structure | Each questionnaire item is a `fieldset` with a `legend`; tables with `th` and `scope`; headings in order | [CT-E24](documentacao/casos-de-teste.md#ct-e24), [CT-E21](documentacao/casos-de-teste.md#ct-e21) and axe-core on every screen |
| 1.3.2 Reading order equal to the visual order | The DOM follows the order of the screen, also from right to left | [CT-E22](documentacao/casos-de-teste.md#ct-e22), [CT-E46](documentacao/casos-de-teste.md#ct-e46), [CT-M07](documentacao/casos-de-teste.md#ct-m07) |
| 1.3.5 `autocomplete` on personal data | Name, email and password have `autocomplete` in Create account, Log in, My account and the study form | axe-core in [CT-E06](documentacao/casos-de-teste.md#ct-e06), [CT-E09](documentacao/casos-de-teste.md#ct-e09) |
| 1.4.1 Nothing conveyed by color alone | Status, bands and versions have text, shape or pattern in addition to color | [CT-E32](documentacao/casos-de-teste.md#ct-e32), [CT-M09](documentacao/casos-de-teste.md#ct-m09) |
| 1.4.3 Text contrast ≥ 4.5:1 | Each text color pair of the theme is measured | [CT-U51](documentacao/casos-de-teste.md#ct-u51) |
| 1.4.4 200% zoom without loss | The screens use relative units and reflow | [CT-M08](documentacao/casos-de-teste.md#ct-m08) |
| 1.4.10 Reflow at 320 px | No screen scrolls horizontally at 320 px | [CT-E25](documentacao/casos-de-teste.md#ct-e25), [CT-E31](documentacao/casos-de-teste.md#ct-e31), [CT-E36](documentacao/casos-de-teste.md#ct-e36), [CT-E44](documentacao/casos-de-teste.md#ct-e44), [CT-E50](documentacao/casos-de-teste.md#ct-e50), [CT-E75](documentacao/casos-de-teste.md#ct-e75) |
| 1.4.11 Element contrast ≥ 3:1 | Field borders, circles, focus and chart markers are measured against the backgrounds | [CT-U52](documentacao/casos-de-teste.md#ct-u52) |
| 1.4.12 Text spacing | The layout withstands line-height 1.5 and letter-spacing 0.12em | [CT-M11](documentacao/casos-de-teste.md#ct-m11) |
| 1.4.13 Content on hover or focus | The explanations of the terms open on click (`details`), not on hover | [CT-M07](documentacao/casos-de-teste.md#ct-m07) |

### Operable

| Criterion | How the tool meets it | Evidence |
|---|---|---|
| 2.1.1 and 2.1.2 Keyboard, no keyboard trap | Every flow works with the keyboard alone; dialogs trap the focus and return it on closing | [CT-E03](documentacao/casos-de-teste.md#ct-e03), [CT-E22](documentacao/casos-de-teste.md#ct-e22), [CT-E55](documentacao/casos-de-teste.md#ct-e55), [CT-E58](documentacao/casos-de-teste.md#ct-e58), [CT-E64](documentacao/casos-de-teste.md#ct-e64), [CT-M07](documentacao/casos-de-teste.md#ct-m07) |
| 2.2.1 No time limit | No screen is timed; the questionnaire keeps what was marked if the page reloads | [CT-E26](documentacao/casos-de-teste.md#ct-e26) |
| 2.4.1 Bypass blocks | "Skip to content" is the first focusable element | [CT-E02](documentacao/casos-de-teste.md#ct-e02) |
| 2.4.2 Page titled | Each page has its own title, from the specific to the general | [CT-E47](documentacao/casos-de-teste.md#ct-e47), [CT-E84](documentacao/casos-de-teste.md#ct-e84) |
| 2.4.3 Focus order | After an error, the focus goes to the summary, and each link in the summary leads to the field | [CT-E07](documentacao/casos-de-teste.md#ct-e07), [CT-E23](documentacao/casos-de-teste.md#ct-e23) |
| 2.4.6 Descriptive headings and labels | Labels say what they ask for; headings say what the section contains | axe-core on every screen and [CT-M13](documentacao/casos-de-teste.md#ct-m13) |
| 2.4.7 Focus visible | Focus ring with 3:1 contrast on every element | [CT-E22](documentacao/casos-de-teste.md#ct-e22), [CT-U52](documentacao/casos-de-teste.md#ct-u52) |
| 2.4.11 Focus not obscured | The fixed top bar and footer never hide the focus or the anchor targets | [CT-E54](documentacao/casos-de-teste.md#ct-e54) |
| 2.5.3 Label in name | The accessible name of each button begins with the text shown on it | axe-core on every screen |
| 2.5.8 Targets ≥ 24 × 24 px | Each questionnaire circle is 44 × 44 px | [CT-M12](documentacao/casos-de-teste.md#ct-m12) |

### Understandable

| Criterion | How the tool meets it | Evidence |
|---|---|---|
| 3.1.1 Language of page | `lang` and `dir` follow the chosen language, also in untranslated study texts | [CT-E45](documentacao/casos-de-teste.md#ct-e45), [CT-E46](documentacao/casos-de-teste.md#ct-e46), [CT-U48](documentacao/casos-de-teste.md#ct-u48) |
| 3.2.1 and 3.2.2 No change of context on its own | Changing the language only takes effect after "Apply"; no field submits on change | [CT-E46](documentacao/casos-de-teste.md#ct-e46), [CT-E68](documentacao/casos-de-teste.md#ct-e68) |
| 3.2.3 and 3.2.4 Consistent navigation | The same bar and the same components on every screen | [CT-E53](documentacao/casos-de-teste.md#ct-e53), [CT-M18](documentacao/casos-de-teste.md#ct-m18) |
| 3.3.1 and 3.3.3 Errors in text, with a suggestion | Each error says what happened and what to do, in the summary and at the field | [CT-E06](documentacao/casos-de-teste.md#ct-e06), [CT-E14](documentacao/casos-de-teste.md#ct-e14), [CT-E23](documentacao/casos-de-teste.md#ct-e23), [CT-E43](documentacao/casos-de-teste.md#ct-e43) |
| 3.3.2 Visible labels | Every field has a visible label above it | axe-core on every screen |
| 3.3.4 Destructive actions confirmed or reversible | Logging out and deleting ask for confirmation; removing from the analysis is reversible | [CT-E11](documentacao/casos-de-teste.md#ct-e11), [CT-E19](documentacao/casos-de-teste.md#ct-e19), [CT-E27](documentacao/casos-de-teste.md#ct-e27), [CT-E34](documentacao/casos-de-teste.md#ct-e34) |
| 3.3.7 Do not ask for the same information twice | A new study comes with the responsible researcher from the account and from the last study | [CT-E93](documentacao/casos-de-teste.md#ct-e93) |
| 3.3.8 Login without a cognitive test | No captcha; pasting the password works and Show password toggles the visibility | [CT-E08](documentacao/casos-de-teste.md#ct-e08) |

### Robust

| Criterion | How the tool meets it | Evidence |
|---|---|---|
| 4.1.2 Native components | Native radios, buttons, `details` and `dialog`; ARIA only where HTML cannot do it | [CT-E24](documentacao/casos-de-teste.md#ct-e24), [CT-E57](documentacao/casos-de-teste.md#ct-e57) |
| 4.1.3 Status messages | Confirmations in `role="status"`, announced without moving the focus | [CT-E09](documentacao/casos-de-teste.md#ct-e09), [CT-E16](documentacao/casos-de-teste.md#ct-e16), [CT-M06](documentacao/casos-de-teste.md#ct-m06) |

### Beyond AA

| Criterion | How the tool meets it | Evidence |
|---|---|---|
| `prefers-reduced-motion` | Transitions disappear when the system asks for reduced motion | `src/app/globals.css` |
| `forced-colors` (Windows high contrast) | Circles, focus and charts remain visible | [CT-E32](documentacao/casos-de-teste.md#ct-e32), [CT-M10](documentacao/casos-de-teste.md#ct-m10) |
| Dark theme | Not available: the visual identity is that of a laboratory instrument, on a light background ([Visual identity](design.md)) | — |
| Plain language in the questionnaire | Short sentences, active voice, no jargon | [CT-M13](documentacao/casos-de-teste.md#ct-m13), [CT-M14](documentacao/casos-de-teste.md#ct-m14) |

## 6. How to verify (automation is not enough)

Automated tools catch only some of the accessibility problems. Therefore:

1. **Automated:** axe-core in Playwright on all screens and error states, a contrast test of the tokens, keyboard-only e2e tests, at 320 px, with simulated color blindness and with high contrast
2. **Manual (team):** `docs/checklist-manual.md`, with a screen reader, zoom, a real phone and color blindness simulation
3. **Heuristic evaluation (team):** the three evaluate separately with Nielsen's 10 heuristics, then consolidate with severity ratings from 0 to 4
4. **User testing:** 5 participants from outside the trio respond to a real study in the tool (the participant task) and 2 to 3 colleagues play the researcher role (create a study, interpret the dashboard, export). Think-aloud, success rate, time and errors. At the end, the researchers evaluate the tool itself **with the UEQ, administered by the tool**. This closes the loop and makes the best slide of the presentation

## 7. References

- ABNT. NBR 17225:2025. Acessibilidade em conteúdo e aplicações web: requisitos (Accessibility in web content and applications: requirements). 2025.
- BRASIL. Lei nº 13.146, de 6 de julho de 2015 (Lei Brasileira de Inclusão, Brazilian Inclusion Act). Art. 63.
- BRASIL. eMAG: Modelo de Acessibilidade em Governo Eletrônico (Accessibility Model for Electronic Government), version 3.1.
- BRASIL. Lei nº 13.709, de 14 de agosto de 2018 (Lei Geral de Proteção de Dados Pessoais, General Personal Data Protection Law).
- ISO 9241-11:2018. Ergonomics of human-system interaction: Usability: Definitions and concepts.
- ISO 9241-110:2020. Ergonomics of human-system interaction: Interaction principles.
- NIELSEN, J. Enhancing the explanatory power of usability heuristics. CHI 1994.
- NORMAN, D. The Design of Everyday Things. Revised and expanded edition. Basic Books, 2013.
- SHNEIDERMAN, B. et al. Designing the User Interface. 6th ed. Pearson, 2016.
- W3C. Web Content Accessibility Guidelines (WCAG) 2.2. 2023.
- LAUGWITZ, B.; HELD, T.; SCHREPP, M. Construction and evaluation of a user experience questionnaire. USAB 2008.
- SCHREPP, M. User Experience Questionnaire Handbook. ueq-online.org.
