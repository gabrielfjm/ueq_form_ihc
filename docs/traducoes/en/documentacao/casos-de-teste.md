# Test cases and scenarios

The tests that already exist in the UEQ Tool, organized into **25 scenarios** and **213 test cases**: 106 end-to-end, 81 unit and 26 manual. Each case points to the test file, the requirements it verifies and the result of the latest run.

The same list is in [casos-de-teste.csv](casos-de-teste.csv). Each scenario and each case cite the [requirements](requisitos.md) they verify; the reverse path, from each requirement to the cases that prove it, is in the [traceability matrix](matriz-rastreabilidade.md).

## Run of 23 Nov 2026

| Level | Tool | Cases | Runs | Passed | Skipped | Failed |
|---|---|---|---|---|---|---|
| End-to-end | Playwright 1.64 + axe-core 4.14 | 106 | 232 | 229 | 3 | 0 |
| Unit | Vitest 5 | 81 | 582 | 582 | 0 | 0 |
| Manual | People and Excel | 26 | 2 | 2 | — | — |

- **End-to-end:** each case runs twice, in desktop Chrome and in mobile Chrome (Pixel 7); [CT-E96](#ct-e96) and [CT-E98](#ct-e98) run once per scenario in each. The whole suite passed on the first attempt (217 runs, no failures); [CT-E101](#ct-e101), written later for the AA criteria on the UEQ-S screens, passed in both projects together with the other UEQ-S cases. After the official UEQ-S terms per language, the whole suite ran again with [CT-E102](#ct-e102): 221 runs passed, none failed. On 23 Nov 2026, with the wait notice, the whole suite ran again with cases [CT-E103](#ct-e103) to [CT-E106](#ct-e106): 229 runs passed, none failed. In that run [CT-E66](#ct-e66) was fixed, because it still counted 10 steps in the tour, which has had 12 since the documentation help. The skipped runs are intentional: [CT-E62](casos-de-teste.md#ct-e62) only runs when there is a document in production, and today all of them are published; [CT-E67](casos-de-teste.md#ct-e67) runs only on desktop.
- **Unit:** some cases are parameterized (one per language, one per color pair, one per scenario of the official spreadsheet), which is why there are more runs than cases. No case is skipped: the UEQ-S ones ([CT-U53](#ct-u53)) now run with the official items and benchmark in `data/`. On 22 Nov 2026, when the exported spreadsheet started to come out with the results stored, the unit suite ran again with [CT-U79](#ct-u79) and [CT-U80](#ct-u80): 574 runs, all passed. On 23 Nov 2026, with the email sending reviewed, it ran with [CT-U81](#ct-u81): 582 runs, all passed.
- **Manual:** of the manual cases, only [CT-M15](#ct-m15) and [CT-M26](#ct-m26) were run, with Excel automated by `scripts/planilha-oficial.ps1`, `scripts/planilha-oficial-ueq-s.ps1` and `scripts/planilha-oficial-celulas.ps1`; the other 24 were not run in this round ([Limitations](#limitações)).
- **Environment:** development server and local PostgreSQL. The run does not exercise production on Vercel, the Claude API or email sending.

## Strategy

### Levels

| Level | What it verifies | Where it lives | How it runs |
|---|---|---|---|
| Unit | Pure functions: UEQ calculation, suspicion rules, CSV, import, quick reading, languages, color contrast, encryption, email template, text catalog, review of the machine translation (with the API mocked) and documentation | `src/**/__tests__/*.test.ts` | `pnpm test` (Vitest, Node environment, no database) |
| End-to-end | The whole tool in the browser, the way a person uses it: screens, database, cookies, downloads and accessibility | `tests/e2e/*.spec.ts` | `pnpm test:e2e` (Playwright, with database and server) |
| Automated accessibility | WCAG 2.2 A and AA violations on each screen and in each error state | `tests/e2e/acessibilidade.ts` (`verificarAcessibilidade`) | Inside the end-to-end tests |
| Manual | What automation does not see: a real screen reader, a real phone, zoom, text spacing, user comprehension and opinion | [docs/checklist-manual.md](../checklist-manual.md), [docs/roteiro-revisao.md](../roteiro-revisao.md) | By the team, before delivery |

### Environment and data

- **Playwright projects:** `desktop` (Desktop Chrome) and `celular` (Pixel 7). Every end-to-end case runs in both.
- **Server:** Playwright starts `pnpm dev` at http://localhost:3000 or reuses the one already running. The database is the PostgreSQL from `docker compose`.
- **Isolation:** each case creates its own researcher, with an email at `@e2e.exemplo.com`, and its own study. That is why the cases run in parallel (4 workers) without depending on one another. At the end, `tests/e2e/limpeza.ts` deletes only the accounts of that domain, never the development account.
- **Test data:** the 11 scenarios in [data/fixtures/](../../data/fixtures/LEIA-ME.md), in the official spreadsheet format and with the official spreadsheet results in `esperado.json`: `basico` (20 participants, none suspicious), `inconsistente` (15, with rows 1, 6, 9 and 13 suspicious), `extremos` (all 1, all 7, n = 1 and n = 2), `oficial-exemplo` (the 255 from the spreadsheet itself), `grande` (1000), `bordas` (the limits of the suspicion rules), `variancia-zero` and `negativo`. The dashboard tests write the fixtures directly to the database (`inserirRespostas` in `tests/e2e/preparacao.ts`), because the participant flow already has its own cases. For the UEQ-S, the 9 scenarios in [data/fixtures-ueq-s/](../../data/fixtures-ueq-s/LEIA-ME.md), with the results of the official UEQ-S spreadsheet, two of them taken from scenarios of the full UEQ.
- **Time:** 15 s of waiting per assertion and 60 s per test (120 s for those that create a study and responses), because the development server compiles each route on its first visit.

### Criteria

- No pull request is merged without `pnpm lint && pnpm typecheck && pnpm test` passing.
- A screen is only ready when axe-core finds no WCAG 2.2 A or AA violation, including in the error states.
- The calculation numbers must match the official spreadsheet with a tolerance of 1e-6.
- A test name is the sentence describing the expected behavior, in Portuguese ([docs/codigo.md](../codigo.md)). That is why the title in the code is also the expected result of each unit case.

### How to run

```
docker compose up -d        # banco
pnpm test                   # unidade
pnpm test:e2e               # ponta a ponta, desktop e celular
pnpm exec playwright test tests/e2e/questionario.spec.ts --project=celular   # um arquivo, um projeto
pnpm exec playwright show-report   # relatório com as capturas de daltonismo do CT-E32
```

## Scenarios

| ID | Scenario | Objective | Requirements | Test cases | Status |
|---|---|---|---|---|---|
| <a id="cn01"></a>CN01 | **Access and authentication** | Sign up, log in, log out and protect the researcher area, using only the keyboard and without accessibility violations | [RF01](requisitos.md#rf01), [RF02](requisitos.md#rf02), [RF03](requisitos.md#rf03), [RF11](requisitos.md#rf11), [RNF01](requisitos.md#rnf01), [RNF03](requisitos.md#rnf03), [RNF20](requisitos.md#rnf20) | [CT-E01](casos-de-teste.md#ct-e01), [CT-E02](casos-de-teste.md#ct-e02), [CT-E03](casos-de-teste.md#ct-e03), [CT-E04](casos-de-teste.md#ct-e04), [CT-E06](casos-de-teste.md#ct-e06), [CT-E07](casos-de-teste.md#ct-e07), [CT-E08](casos-de-teste.md#ct-e08), [CT-E90](casos-de-teste.md#ct-e90) | Passed |
| <a id="cn02"></a>CN02 | **My account** | Edit personal data, change the password while ending other sessions, and delete the account with confirmation | [RF04](requisitos.md#rf04), [RF05](requisitos.md#rf05), [RF06](requisitos.md#rf06), [RNF15](requisitos.md#rnf15), [RNF20](requisitos.md#rnf20), [RNF21](requisitos.md#rnf21) | [CT-E09](casos-de-teste.md#ct-e09), [CT-E10](casos-de-teste.md#ct-e10), [CT-E11](casos-de-teste.md#ct-e11) | Passed |
| <a id="cn03"></a>CN03 | **Study management** | Create, list, edit, open, close, reopen, copy the link of and delete studies | [RF12](requisitos.md#rf12), [RF13](requisitos.md#rf13), [RF14](requisitos.md#rf14), [RF15](requisitos.md#rf15), [RF16](requisitos.md#rf16), [RF17](requisitos.md#rf17), [RNF01](requisitos.md#rnf01), [RNF20](requisitos.md#rnf20), [RNF21](requisitos.md#rnf21) | [CT-E12](casos-de-teste.md#ct-e12), [CT-E13](casos-de-teste.md#ct-e13), [CT-E14](casos-de-teste.md#ct-e14), [CT-E15](casos-de-teste.md#ct-e15), [CT-E16](casos-de-teste.md#ct-e16), [CT-E17](casos-de-teste.md#ct-e17), [CT-E18](casos-de-teste.md#ct-e18), [CT-E19](casos-de-teste.md#ct-e19), [CT-E88](casos-de-teste.md#ct-e88), [CT-E89](casos-de-teste.md#ct-e89), [CT-E93](casos-de-teste.md#ct-e93), [CT-E103](casos-de-teste.md#ct-e103), [CT-E104](casos-de-teste.md#ct-e104), [CT-E105](casos-de-teste.md#ct-e105), [CT-E106](casos-de-teste.md#ct-e106) | Passed |
| <a id="cn04"></a>CN04 | **Isolation and data protection** | Ensure that a researcher can neither see nor export another researcher's study and that the participant never needs a session | [RF24](requisitos.md#rf24), [RF60](requisitos.md#rf60), [RNF17](requisitos.md#rnf17) | [CT-E05](casos-de-teste.md#ct-e05), [CT-E20](casos-de-teste.md#ct-e20), [CT-E38](casos-de-teste.md#ct-e38), [CT-E41](casos-de-teste.md#ct-e41) | Passed |
| <a id="cn05"></a>CN05 | **Study participation** | Go through the participant link from consent to the end, including declining, giving up, reloading and trying to answer again | [RF18](requisitos.md#rf18), [RF24](requisitos.md#rf24), [RF25](requisitos.md#rf25), [RF26](requisitos.md#rf26), [RF27](requisitos.md#rf27), [RF29](requisitos.md#rf29), [RF30](requisitos.md#rf30), [RF31](requisitos.md#rf31), [RF32](requisitos.md#rf32), [RF33](requisitos.md#rf33), [RF34](requisitos.md#rf34), [RNF01](requisitos.md#rnf01), [RNF12](requisitos.md#rnf12), [RNF19](requisitos.md#rnf19), [RNF21](requisitos.md#rnf21) | [CT-U30](casos-de-teste.md#ct-u30), [CT-E21](casos-de-teste.md#ct-e21), [CT-E23](casos-de-teste.md#ct-e23), [CT-E26](casos-de-teste.md#ct-e26), [CT-E27](casos-de-teste.md#ct-e27), [CT-E28](casos-de-teste.md#ct-e28), [CT-E52](casos-de-teste.md#ct-e52), [CT-E71](casos-de-teste.md#ct-e71), [CT-E82](casos-de-teste.md#ct-e82), [CT-E83](casos-de-teste.md#ct-e83), [CT-E91](casos-de-teste.md#ct-e91) | Passed |
| <a id="cn06"></a>CN06 | **Questionnaire accessibility** | Answer using only the keyboard and a screen reader, at 320 px, with focus always visible and the instrument intact | [RF27](requisitos.md#rf27), [RF28](requisitos.md#rf28), [RNF02](requisitos.md#rnf02), [RNF03](requisitos.md#rnf03), [RNF04](requisitos.md#rnf04), [RNF09](requisitos.md#rnf09) | [CT-E22](casos-de-teste.md#ct-e22), [CT-E24](casos-de-teste.md#ct-e24), [CT-E25](casos-de-teste.md#ct-e25) | Passed |
| <a id="cn07"></a>CN07 | **Languages** | Answer in another language, through the browser or the selector, including right-to-left, and let the researcher see the language | [RF19](requisitos.md#rf19), [RF30](requisitos.md#rf30), [RF34](requisitos.md#rf34), [RF52](requisitos.md#rf52), [RF61](requisitos.md#rf61), [RNF04](requisitos.md#rnf04), [RNF10](requisitos.md#rnf10) | [CT-U36](casos-de-teste.md#ct-u36), [CT-U45](casos-de-teste.md#ct-u45), [CT-U46](casos-de-teste.md#ct-u46), [CT-U47](casos-de-teste.md#ct-u47), [CT-U48](casos-de-teste.md#ct-u48), [CT-U49](casos-de-teste.md#ct-u49), [CT-U50](casos-de-teste.md#ct-u50), [CT-E45](casos-de-teste.md#ct-e45), [CT-E46](casos-de-teste.md#ct-e46), [CT-E68](casos-de-teste.md#ct-e68) | Passed |
| <a id="cn08"></a>CN08 | **UEQ calculation** | Check recoding, statistics, scales, alpha, benchmark and groups in pure functions, including the edge cases | [RF27](requisitos.md#rf27), [RF36](requisitos.md#rf36), [RF37](requisitos.md#rf37), [RF38](requisitos.md#rf38), [RF39](requisitos.md#rf39), [RF40](requisitos.md#rf40), [RF41](requisitos.md#rf41), [RF42](requisitos.md#rf42), [RF45](requisitos.md#rf45), [RNF10](requisitos.md#rnf10), [RNF25](requisitos.md#rnf25) | [CT-U01](casos-de-teste.md#ct-u01), [CT-U02](casos-de-teste.md#ct-u02), [CT-U03](casos-de-teste.md#ct-u03), [CT-U04](casos-de-teste.md#ct-u04), [CT-U05](casos-de-teste.md#ct-u05), [CT-U06](casos-de-teste.md#ct-u06), [CT-U07](casos-de-teste.md#ct-u07), [CT-U08](casos-de-teste.md#ct-u08), [CT-U09](casos-de-teste.md#ct-u09), [CT-U10](casos-de-teste.md#ct-u10), [CT-U11](casos-de-teste.md#ct-u11), [CT-U12](casos-de-teste.md#ct-u12), [CT-U13](casos-de-teste.md#ct-u13), [CT-U14](casos-de-teste.md#ct-u14), [CT-U15](casos-de-teste.md#ct-u15), [CT-U16](casos-de-teste.md#ct-u16), [CT-U17](casos-de-teste.md#ct-u17), [CT-U18](casos-de-teste.md#ct-u18), [CT-U20](casos-de-teste.md#ct-u20), [CT-U21](casos-de-teste.md#ct-u21), [CT-U22](casos-de-teste.md#ct-u22), [CT-M17](casos-de-teste.md#ct-m17) | Passed, with pending items |
| <a id="cn09"></a>CN09 | **Suspicious responses** | Detect suspicious responses by both rules, review them and remove them from the analysis without deleting them | [RF42](requisitos.md#rf42), [RF51](requisitos.md#rf51), [RF52](requisitos.md#rf52), [RF53](requisitos.md#rf53), [RF54](requisitos.md#rf54), [RF55](requisitos.md#rf55), [RNF02](requisitos.md#rnf02) | [CT-U19](casos-de-teste.md#ct-u19), [CT-U23](casos-de-teste.md#ct-u23), [CT-U24](casos-de-teste.md#ct-u24), [CT-U25](casos-de-teste.md#ct-u25), [CT-U26](casos-de-teste.md#ct-u26), [CT-U27](casos-de-teste.md#ct-u27), [CT-U28](casos-de-teste.md#ct-u28), [CT-E33](casos-de-teste.md#ct-e33), [CT-E34](casos-de-teste.md#ct-e34), [CT-E35](casos-de-teste.md#ct-e35), [CT-E36](casos-de-teste.md#ct-e36), [CT-M16](casos-de-teste.md#ct-m16) | Passed, with pending items |
| <a id="cn10"></a>CN10 | **Results dashboard** | Show the numbers from the UEQ module, compare versions, keep the view in the URL and work with color blindness, high contrast and 320 px | [RF43](requisitos.md#rf43), [RF44](requisitos.md#rf44), [RF45](requisitos.md#rf45), [RF46](requisitos.md#rf46), [RF47](requisitos.md#rf47), [RF48](requisitos.md#rf48), [RF50](requisitos.md#rf50), [RNF02](requisitos.md#rnf02), [RNF07](requisitos.md#rnf07), [RNF08](requisitos.md#rnf08), [RNF22](requisitos.md#rnf22) | [CT-U42](casos-de-teste.md#ct-u42), [CT-U43](casos-de-teste.md#ct-u43), [CT-U44](casos-de-teste.md#ct-u44), [CT-E29](casos-de-teste.md#ct-e29), [CT-E30](casos-de-teste.md#ct-e30), [CT-E31](casos-de-teste.md#ct-e31), [CT-E32](casos-de-teste.md#ct-e32), [CT-E72](casos-de-teste.md#ct-e72), [CT-U60](casos-de-teste.md#ct-u60) | Passed |
| <a id="cn11"></a>CN11 | **CSV export** | Download the three CSV files with a dated name, BOM and the format of each one, and the official spreadsheet in XLSX | [RF56](requisitos.md#rf56), [RF57](requisitos.md#rf57), [RF58](requisitos.md#rf58), [RF59](requisitos.md#rf59), [RNF22](requisitos.md#rnf22) | [CT-U31](casos-de-teste.md#ct-u31), [CT-U32](casos-de-teste.md#ct-u32), [CT-U33](casos-de-teste.md#ct-u33), [CT-U34](casos-de-teste.md#ct-u34), [CT-U35](casos-de-teste.md#ct-u35), [CT-U37](casos-de-teste.md#ct-u37), [CT-U38](casos-de-teste.md#ct-u38), [CT-E37](casos-de-teste.md#ct-e37) | Passed |
| <a id="cn12"></a>CN12 | **Dashboard as PDF** | Download the dashboard as PDF and check the print page | [RF60](requisitos.md#rf60) | [CT-E39](casos-de-teste.md#ct-e39), [CT-E40](casos-de-teste.md#ct-e40) | Passed |
| <a id="cn13"></a>CN13 | **CSV import** | Import responses with a preview, reject a file with errors and mark the imported ones | [RF61](requisitos.md#rf61), [RNF02](requisitos.md#rnf02) | [CT-U39](casos-de-teste.md#ct-u39), [CT-U40](casos-de-teste.md#ct-u40), [CT-U41](casos-de-teste.md#ct-u41), [CT-E42](casos-de-teste.md#ct-e42), [CT-E43](casos-de-teste.md#ct-e43), [CT-E44](casos-de-teste.md#ct-e44) | Passed |
| <a id="cn14"></a>CN14 | **Colors and contrast** | Ensure the contrast of every color pair in the theme | [RNF06](requisitos.md#rnf06), [RNF07](requisitos.md#rnf07) | [CT-U51](casos-de-teste.md#ct-u51), [CT-U52](casos-de-teste.md#ct-u52) | Passed |
| <a id="cn15"></a>CN15 | **Validation against the official spreadsheet** | Compare each number of the tool with the UEQ Data Analysis Tool, with a tolerance of 1e-6, and check that the spreadsheet exported by the tool is the filled-in official one | [RF59](requisitos.md#rf59), [RNF11](requisitos.md#rnf11) | [CT-U29](casos-de-teste.md#ct-u29), [CT-U70](casos-de-teste.md#ct-u70), [CT-U79](casos-de-teste.md#ct-u79), [CT-U80](casos-de-teste.md#ct-u80), [CT-E96](casos-de-teste.md#ct-e96), [CT-M15](casos-de-teste.md#ct-m15) | Passed |
| <a id="cn16"></a>CN16 | **UEQ-S** | Choose the UEQ-S when creating the study knowing what changes, answer the 8 pairs, see the evaluation in the UEQ-S tab, export the official UEQ-S spreadsheet and compare each number with it, also starting from a full UEQ study | [RF62](requisitos.md#rf62), [RNF01](requisitos.md#rnf01), [RNF02](requisitos.md#rnf02), [RNF03](requisitos.md#rnf03), [RNF11](requisitos.md#rnf11) | [CT-U53](casos-de-teste.md#ct-u53), [CT-U71](casos-de-teste.md#ct-u71), [CT-U72](casos-de-teste.md#ct-u72), [CT-U73](casos-de-teste.md#ct-u73), [CT-U74](casos-de-teste.md#ct-u74), [CT-U75](casos-de-teste.md#ct-u75), [CT-U76](casos-de-teste.md#ct-u76), [CT-U77](casos-de-teste.md#ct-u77), [CT-E97](casos-de-teste.md#ct-e97), [CT-E98](casos-de-teste.md#ct-e98), [CT-E99](casos-de-teste.md#ct-e99), [CT-E100](casos-de-teste.md#ct-e100), [CT-E101](casos-de-teste.md#ct-e101), [CT-E102](casos-de-teste.md#ct-e102), [CT-M26](casos-de-teste.md#ct-m26) | Passed |
| <a id="cn18"></a>CN18 | **Documentation in the tool** | Browse the sections and documents with and without an account, follow links and anchors, see the diagrams and download the files, without accessibility violations | [RF63](requisitos.md#rf63), [RF64](requisitos.md#rf64), [RF65](requisitos.md#rf65), [RNF01](requisitos.md#rnf01), [RNF02](requisitos.md#rnf02) | [CT-U54](casos-de-teste.md#ct-u54), [CT-U55](casos-de-teste.md#ct-u55), [CT-U56](casos-de-teste.md#ct-u56), [CT-U57](casos-de-teste.md#ct-u57), [CT-E47](casos-de-teste.md#ct-e47), [CT-E48](casos-de-teste.md#ct-e48), [CT-E49](casos-de-teste.md#ct-e49), [CT-E50](casos-de-teste.md#ct-e50), [CT-E51](casos-de-teste.md#ct-e51), [CT-E57](casos-de-teste.md#ct-e57), [CT-E62](casos-de-teste.md#ct-e62), [CT-E84](casos-de-teste.md#ct-e84), [CT-E85](casos-de-teste.md#ct-e85), [CT-E86](casos-de-teste.md#ct-e86), [CT-E87](casos-de-teste.md#ct-e87), [CT-U64](casos-de-teste.md#ct-u64), [CT-U65](casos-de-teste.md#ct-u65) | Passed |
| <a id="cn19"></a>CN19 | **Navigation and fixed bar** | Keep the top bar in view while scrolling, without hiding the focus or the anchors, with a menu on mobile | [RNF03](requisitos.md#rnf03), [RNF23](requisitos.md#rnf23) | [CT-E53](casos-de-teste.md#ct-e53), [CT-E54](casos-de-teste.md#ct-e54), [CT-E55](casos-de-teste.md#ct-e55), [CT-E56](casos-de-teste.md#ct-e56) | Passed |
| <a id="cn20"></a>CN20 | **Home page and dialogs** | Present the tool to people without an account, open Log in and Create account in a dialog without scrolling, close it returning the focus, and serve the site icon | [RF02](requisitos.md#rf02), [RF11](requisitos.md#rf11) | [CT-E58](casos-de-teste.md#ct-e58), [CT-E59](casos-de-teste.md#ct-e59), [CT-E60](casos-de-teste.md#ct-e60), [CT-E61](casos-de-teste.md#ct-e61), [CT-E69](casos-de-teste.md#ct-e69), [CT-E70](casos-de-teste.md#ct-e70) | Passed |
| <a id="cn21"></a>CN21 | **Team and notifications** | Invite by email, accept in the bell, limit what the viewer can do and notify the team | [RF20](requisitos.md#rf20), [RF21](requisitos.md#rf21), [RF22](requisitos.md#rf22), [RF23](requisitos.md#rf23), [RNF03](requisitos.md#rnf03) | [CT-U59](casos-de-teste.md#ct-u59), [CT-U81](casos-de-teste.md#ct-u81), [CT-E63](casos-de-teste.md#ct-e63), [CT-E64](casos-de-teste.md#ct-e64) | Passed |
| <a id="cn22"></a>CN22 | **Learning to use the tool** | Explain each page in the help (?) and guide the first access with a tour that can be skipped | [RF09](requisitos.md#rf09), [RF10](requisitos.md#rf10) | [CT-E65](casos-de-teste.md#ct-e65), [CT-E66](casos-de-teste.md#ct-e66) | Passed |
| <a id="cn23"></a>CN23 | **Data protection** | Comply with the LGPD in the interface and on the server: public policy, headers, encryption, attempt limits and download of the data | [RF07](requisitos.md#rf07), [RF25](requisitos.md#rf25), [RNF01](requisitos.md#rnf01), [RNF02](requisitos.md#rnf02), [RNF14](requisitos.md#rnf14), [RNF16](requisitos.md#rnf16), [RNF18](requisitos.md#rnf18), [RNF19](requisitos.md#rnf19) | [CT-U58](casos-de-teste.md#ct-u58), [CT-E73](casos-de-teste.md#ct-e73), [CT-E74](casos-de-teste.md#ct-e74), [CT-E75](casos-de-teste.md#ct-e75), [CT-E76](casos-de-teste.md#ct-e76), [CT-E77](casos-de-teste.md#ct-e77), [CT-E78](casos-de-teste.md#ct-e78), [CT-E79](casos-de-teste.md#ct-e79), [CT-E80](casos-de-teste.md#ct-e80), [CT-E81](casos-de-teste.md#ct-e81), [CT-E92](casos-de-teste.md#ct-e92), [CT-U69](casos-de-teste.md#ct-u69) | Passed |
| <a id="cn24"></a>CN24 | **Tool language** | Choose the language when creating the account, change it in My account and keep the text catalog up to date | [RF08](requisitos.md#rf08), [RF35](requisitos.md#rf35) | [CT-U62](casos-de-teste.md#ct-u62), [CT-U63](casos-de-teste.md#ct-u63), [CT-U66](casos-de-teste.md#ct-u66), [CT-U67](casos-de-teste.md#ct-u67), [CT-U68](casos-de-teste.md#ct-u68), [CT-U78](casos-de-teste.md#ct-u78), [CT-E67](casos-de-teste.md#ct-e67), [CT-E94](casos-de-teste.md#ct-e94), [CT-E95](casos-de-teste.md#ct-e95) | Passed |
| <a id="cn25"></a>CN25 | **Demonstration scenarios** | Generate synthetic responses consistent with the profile of each scenario | [RF67](requisitos.md#rf67) | [CT-U61](casos-de-teste.md#ct-u61) | Passed |
| <a id="cn17"></a>CN17 | **Manual verification with people** | What automation does not see: a real screen reader, a real phone, zoom, text spacing, heuristic evaluation and user testing | [RF09](requisitos.md#rf09), [RF13](requisitos.md#rf13), [RF22](requisitos.md#rf22), [RF24](requisitos.md#rf24), [RF25](requisitos.md#rf25), [RF27](requisitos.md#rf27), [RF28](requisitos.md#rf28), [RF29](requisitos.md#rf29), [RF34](requisitos.md#rf34), [RF43](requisitos.md#rf43), [RNF01](requisitos.md#rnf01), [RNF02](requisitos.md#rnf02), [RNF03](requisitos.md#rnf03), [RNF04](requisitos.md#rnf04), [RNF05](requisitos.md#rnf05), [RNF06](requisitos.md#rnf06), [RNF07](requisitos.md#rnf07), [RNF08](requisitos.md#rnf08), [RNF19](requisitos.md#rnf19), [RNF20](requisitos.md#rnf20), [RNF21](requisitos.md#rnf21), [RNF23](requisitos.md#rnf23), [RNF24](requisitos.md#rnf24) | [CT-M01](casos-de-teste.md#ct-m01), [CT-M02](casos-de-teste.md#ct-m02), [CT-M03](casos-de-teste.md#ct-m03), [CT-M04](casos-de-teste.md#ct-m04), [CT-M05](casos-de-teste.md#ct-m05), [CT-M06](casos-de-teste.md#ct-m06), [CT-M07](casos-de-teste.md#ct-m07), [CT-M08](casos-de-teste.md#ct-m08), [CT-M09](casos-de-teste.md#ct-m09), [CT-M10](casos-de-teste.md#ct-m10), [CT-M11](casos-de-teste.md#ct-m11), [CT-M12](casos-de-teste.md#ct-m12), [CT-M13](casos-de-teste.md#ct-m13), [CT-M14](casos-de-teste.md#ct-m14), [CT-M18](casos-de-teste.md#ct-m18), [CT-M19](casos-de-teste.md#ct-m19), [CT-M20](casos-de-teste.md#ct-m20), [CT-M21](casos-de-teste.md#ct-m21), [CT-M22](casos-de-teste.md#ct-m22), [CT-M23](casos-de-teste.md#ct-m23), [CT-M24](casos-de-teste.md#ct-m24), [CT-M25](casos-de-teste.md#ct-m25) | Manual, not run |

## End-to-end cases

Each case is a Playwright `test(...)`. The title in the code is what appears in the report.

### CT-E01

**Someone who opens the tool without an account sees the home page, which explains what it does.**

| Field | Value |
|---|---|
| Scenario | [CN01 · Access and authentication](#cn01) |
| Test | `tests/e2e/inicial.spec.ts` › "a raiz apresenta a ferramenta para quem não tem sessão e passa no axe" (the root presents the tool to people without a session and passes axe) |
| Preconditions | Browser without a session cookie. |
| Requirements | [RF11](requisitos.md#rf11), [RNF01](requisitos.md#rnf01) |
| Result on 18 Nov 2026 | Passed (mobile and desktop) |

Steps:

1. Open /.
2. Open the menu, if the screen is narrow.
3. Run axe.

Expected result: The URL stays at /. The h1 is "User experience studies with the UEQ" and the sections What is the UEQ, How to read the results, How it works, Studies on the method and Credits appear, with the groups Attractiveness, Pragmatic Quality and Hedonic Quality. The bar has Documentation (without aria-current) and the Log in button, and no Studies. Zero violations.

### CT-E02

**The skip link is the first focusable element.**

| Field | Value |
|---|---|
| Scenario | [CN01 · Access and authentication](#cn01) |
| Test | `tests/e2e/inicial.spec.ts` › "o primeiro Tab leva ao link de pular para o conteúdo" (the first Tab leads to the skip-to-content link) |
| Preconditions | Home page (/) open. |
| Requirements | [RNF03](requisitos.md#rnf03) |
| Result on 18 Nov 2026 | Passed (mobile and desktop) |

Steps:

1. Press Tab.
2. Press Enter.

Expected result: The first Tab focuses "Skip to content"; Enter moves the focus to main#conteudo.

### CT-E03

**Signing up, logging out and logging in again works with the keyboard alone.**

| Field | Value |
|---|---|
| Scenario | [CN01 · Access and authentication](#cn01) |
| Test | `tests/e2e/autenticacao.spec.ts` › "cadastra, sai e entra de novo usando só o teclado" (signs up, logs out and logs in again using only the keyboard) |
| Preconditions | New test email. |
| Requirements | [RF01](requisitos.md#rf01), [RF02](requisitos.md#rf02), [RNF03](requisitos.md#rnf03) |
| Result on 18 Nov 2026 | Passed (mobile and desktop) |

Steps:

1. At /cadastrar, reach each field of the dialog with Tab and type name, email and password.
2. Press Enter.
3. Tab to the Log out button and press Enter.
4. In the confirmation dialog, press Enter.
5. On the home page, Tab to the Log in button in the bar, press Enter and log in with the keyboard alone.

Expected result: After signing up, "Your studies" appears. Log out opens the "Log out of your account?" dialog with the focus on the Log out button; confirming leads to /?aviso=saiu with "You have logged out of your account." in role=status. Log in opens the dialog with the focus on Email, and the new login ends on the home page.

### CT-E04

**The page requested without a session is resumed after login.**

| Field | Value |
|---|---|
| Scenario | [CN01 · Access and authentication](#cn01) |
| Test | `tests/e2e/autenticacao.spec.ts` › "rota protegida sem sessão vai para Entrar e volta para ela depois do login" (a protected route without a session goes to Log in and returns to it after login) |
| Preconditions | Account created; cookies deleted. |
| Requirements | [RF03](requisitos.md#rf03) |
| Result on 18 Nov 2026 | Passed (mobile and desktop) |

Steps:

1. Open /conta.
2. Log in with the account.

Expected result: First the URL becomes /entrar?voltar=%2Fconta; after login the person is at /conta, with the title "My account".

### CT-E05

**The participant routes do not go through the session protection.**

| Field | Value |
|---|---|
| Scenario | [CN04 · Isolation and data protection](#cn04) |
| Test | `tests/e2e/autenticacao.spec.ts` › "participante nunca precisa de sessão" (a participant never needs a session) |
| Preconditions | Browser without cookies. |
| Requirements | [RF24](requisitos.md#rf24) |
| Result on 18 Nov 2026 | Passed (mobile and desktop) |

Steps:

1. Open /r/qualquer-estudo.

Expected result: The URL stays at /r/qualquer-estudo and the response is not the 307 redirect to Log in.

### CT-E06

**The access dialogs have no WCAG 2.2 A/AA violation, not even in the error state.**

| Field | Value |
|---|---|
| Scenario | [CN01 · Access and authentication](#cn01) |
| Test | `tests/e2e/autenticacao.spec.ts` › "Entrar e Criar conta passam no axe, inclusive com erro" (Log in and Create account pass axe, including with an error) |
| Preconditions | None. |
| Requirements | [RF01](requisitos.md#rf01), [RF02](requisitos.md#rf02), [RNF01](requisitos.md#rnf01) |
| Result on 18 Nov 2026 | Passed (mobile and desktop) |

Steps:

1. Open /entrar and run axe with the dialog open.
2. Log in with nonexistent credentials and run axe.
3. Open /cadastrar and run axe.
4. Submit the empty sign-up form and run axe.

Expected result: Zero violations in the four states. The login error shows "Unable to log in". The empty sign-up form shows the summary "Correct 3 fields to continue" with the focus, Name with aria-invalid and "Enter your name."

### CT-E07

**Each link in the error summary leads to the field with the problem.**

| Field | Value |
|---|---|
| Scenario | [CN01 · Access and authentication](#cn01) |
| Test | `tests/e2e/autenticacao.spec.ts` › "o link do resumo de erros leva ao campo" (the error summary link leads to the field) |
| Preconditions | None. |
| Requirements | [RF01](requisitos.md#rf01) |
| Result on 18 Nov 2026 | Passed (mobile and desktop) |

Steps:

1. Sign up with the password "curta".
2. Click the link "Password: the password must have at least 8 characters".

Expected result: The focus goes to the Password field, which keeps what the person typed.

### CT-E08

**The Show password button works and reports its state.**

| Field | Value |
|---|---|
| Scenario | [CN01 · Access and authentication](#cn01) |
| Test | `tests/e2e/autenticacao.spec.ts` › "Mostrar senha alterna a visibilidade e anuncia o estado" (Show password toggles visibility and announces the state) |
| Preconditions | Page /entrar open. |
| Requirements | [RF01](requisitos.md#rf01), [RF02](requisitos.md#rf02) |
| Result on 18 Nov 2026 | Passed (mobile and desktop) |

Steps:

1. Click "Show password".

Expected result: The field changes to type=text and the button goes from aria-pressed=false to true.

### CT-E09

**Editing personal data confirms the result and validates.**

| Field | Value |
|---|---|
| Scenario | [CN02 · My account](#cn02) |
| Test | `tests/e2e/conta.spec.ts` › "Minha conta salva os dados, anuncia o resultado e passa no axe" (My account saves the data, announces the result and passes axe) |
| Preconditions | Researcher logged in. |
| Requirements | [RF04](requisitos.md#rf04), [RNF20](requisitos.md#rnf20) |
| Result on 18 Nov 2026 | Passed (mobile and desktop) |

Steps:

1. Open My account, run axe and go on to Personal data.
2. Change the name and save.
3. Clear the name and save.
4. Run axe.

Expected result: The My account link gets aria-current=page, and the panel leads to /conta/dados. Saving shows "Data saved.". An empty name moves the focus to the summary "Correct 1 field". Zero violations.

### CT-E10

**Changing the password requires the current password and ends the other sessions.**

| Field | Value |
|---|---|
| Scenario | [CN02 · My account](#cn02) |
| Test | `tests/e2e/conta.spec.ts` › "trocar a senha encerra a sessão aberta em outro navegador" (changing the password ends the session open in another browser) |
| Preconditions | The same account logged in on two browsers. |
| Requirements | [RF05](requisitos.md#rf05), [RNF15](requisitos.md#rnf15) |
| Result on 18 Nov 2026 | Passed (mobile and desktop) |

Steps:

1. At /conta/senha, change the password entering the wrong current password.
2. Repeat with the correct current password.
3. In the other browser, open /conta.
4. Log in with the new password.

Expected result: A wrong current password shows "The current password does not match…". With the correct one: "Password changed. The other open sessions have been closed." and the field is cleared. The other browser goes to Log in and only gets in with the new password.

### CT-E11

**Deleting the account asks for confirmation in a dialog, with the email typed in, and removes access.**

| Field | Value |
|---|---|
| Scenario | [CN02 · My account](#cn02) |
| Test | `tests/e2e/conta.spec.ts` › "excluir a conta exige digitar o e-mail e apaga o acesso" (deleting the account requires typing the email and removes access) |
| Preconditions | Researcher logged in. |
| Requirements | [RF06](requisitos.md#rf06), [RNF21](requisitos.md#rnf21) |
| Result on 18 Nov 2026 | Passed (mobile and desktop) |

Steps:

1. Click "Delete my account".
2. Cancel; open it again and press Esc.
3. Open it again and type a different email.
4. Type the correct email and confirm.
5. Try to log in.

Expected result: The "Delete your account?" dialog opens with the warning about what goes with it and the focus on the field; zero violations. Cancel and Esc close it and return the focus to the button. Wrong email: "That is not your account's email. Nothing was deleted.". Correct email: /?aviso=excluida with "Account deleted…". The following login fails.

### CT-E12

**A new researcher sees the accessible empty state.**

| Field | Value |
|---|---|
| Scenario | [CN03 · Study management](#cn03) |
| Test | `tests/e2e/estudos.spec.ts` › "lista vazia mostra o estado vazio e passa no axe" (an empty list shows the empty state and passes axe) |
| Preconditions | Newly registered researcher. |
| Requirements | [RF12](requisitos.md#rf12), [RNF01](requisitos.md#rnf01) |
| Result on 18 Nov 2026 | Passed (mobile and desktop) |

Steps:

1. Open /estudos.

Expected result: "You don't have any studies yet." appears and axe finds no violation.

### CT-E13

**The product becomes the suggested name of the first version, and the focus follows adding and removing.**

| Field | Value |
|---|---|
| Scenario | [CN03 · Study management](#cn03) |
| Test | `tests/e2e/estudos.spec.ts` › "o produto sugere o nome da primeira versão e o foco acompanha adicionar e remover" (the product suggests the name of the first version and the focus follows adding and removing) |
| Preconditions | Researcher logged in. |
| Requirements | [RF13](requisitos.md#rf13) |
| Result on 18 Nov 2026 | Passed (mobile and desktop) |

Steps:

1. At /estudos/novo, type the product "Portal do aluno".
2. Click Add version.
3. Click Remove version 2 and cancel in the dialog.
4. Click Remove version 2 again and confirm with Enter.

Expected result: Version 1 receives "Portal do aluno" with the note "Suggested from the evaluated product. You can change it.". Adding focuses Version 2. Removing opens the "Remove version 2?" dialog: Cancel keeps the version; confirming (the focus is already on the button) removes it and returns the focus to Add version.

### CT-E14

**The empty form is rejected with an accessible summary.**

| Field | Value |
|---|---|
| Scenario | [CN03 · Study management](#cn03) |
| Test | `tests/e2e/estudos.spec.ts` › "criar estudo com campos faltando mostra o resumo e passa no axe" (creating a study with missing fields shows the summary and passes axe) |
| Preconditions | Researcher logged in. |
| Requirements | [RF13](requisitos.md#rf13), [RNF01](requisitos.md#rnf01) |
| Result on 18 Nov 2026 | Passed (mobile and desktop) |

Steps:

1. Run axe at /estudos/novo.
2. Click Create study without filling in anything.
3. Run axe.

Expected result: The summary "Correct 4 fields to continue" receives the focus, "Give the study a title." appears and Version 1 gets aria-invalid. Zero violations.

### CT-E15

**The status transitions change how the link behaves.**

| Field | Value |
|---|---|
| Scenario | [CN03 · Study management](#cn03) |
| Test | `tests/e2e/estudos.spec.ts` › "abre, encerra e reabre a coleta, e o link público acompanha" (opens, closes and reopens data collection, and the public link follows) |
| Preconditions | Study created as a draft; a participant tab. |
| Requirements | [RF15](requisitos.md#rf15), [RNF20](requisitos.md#rnf20) |
| Result on 18 Nov 2026 | Passed (mobile and desktop) |

Steps:

1. Open the link as a participant.
2. Open data collection.
3. Close data collection and reload the link.
4. Reopen data collection.

Expected result: Draft: "This study is not open yet". Open: "Data collection open. The link already accepts responses." and "Open · accepting responses". Closed: "Data collection for this study has been closed". Reopened: "Data collection reopened…". Axe without violations.

### CT-E16

**Copying the link works from the keyboard and is announced.**

| Field | Value |
|---|---|
| Scenario | [CN03 · Study management](#cn03) |
| Test | `tests/e2e/estudos.spec.ts` › "Copiar link anuncia o resultado e funciona pelo teclado" (Copy link announces the result and works from the keyboard) |
| Preconditions | Open study. Chromium only (clipboard permission). |
| Requirements | [RF16](requisitos.md#rf16), [RNF20](requisitos.md#rnf20) |
| Result on 18 Nov 2026 | Passed (mobile and desktop) |

Steps:

1. Focus "Copy link" and press Enter.
2. Read the clipboard.

Expected result: "Link copied." appears and the clipboard holds an /r/ address with a 6-character slug.

### CT-E17

**The list is an accessible table.**

| Field | Value |
|---|---|
| Scenario | [CN03 · Study management](#cn03) |
| Test | `tests/e2e/estudos.spec.ts` › "a lista mostra o estudo numa tabela com o título como link" (the list shows the study in a table with the title as a link) |
| Preconditions | One study created. |
| Requirements | [RF12](requisitos.md#rf12) |
| Result on 18 Nov 2026 | Passed (mobile and desktop) |

Steps:

1. Open /estudos.

Expected result: The table has a caption, a Responses header, the title as a link inside the row header and the status Draft. Zero violations.

### CT-E18

**Editing the study saves and confirms.**

| Field | Value |
|---|---|
| Scenario | [CN03 · Study management](#cn03) |
| Test | `tests/e2e/estudos.spec.ts` › "editar salva as mudanças e avisa" (editing saves the changes and notifies) |
| Preconditions | One study created. |
| Requirements | [RF14](requisitos.md#rf14) |
| Result on 18 Nov 2026 | Passed (mobile and desktop) |

Steps:

1. Click Edit study.
2. Change the title and save.

Expected result: "Changes saved." appears and the new title is the h1 of the study page.

### CT-E19

**Deleting the study requires typing the title.**

| Field | Value |
|---|---|
| Scenario | [CN03 · Study management](#cn03) |
| Test | `tests/e2e/estudos.spec.ts` › "excluir pede o título e apaga o estudo" (deleting asks for the title and erases the study) |
| Preconditions | A study with 2 versions. |
| Requirements | [RF17](requisitos.md#rf17), [RNF21](requisitos.md#rnf21) |
| Result on 18 Nov 2026 | Passed (mobile and desktop) |

Steps:

1. Click Delete study.
2. Type a different title and confirm.
3. Type the correct title and confirm.

Expected result: The field receives the focus and the screen says "Deleting erases the study and its 2 versions.". Wrong text: "…Nothing was deleted.". Correct title: /estudos?aviso=excluido, "Study deleted." and the empty list.

### CT-E20

**The study address does not work for another account.**

| Field | Value |
|---|---|
| Scenario | [CN04 · Isolation and data protection](#cn04) |
| Test | `tests/e2e/estudos.spec.ts` › "outro pesquisador não vê o estudo pelo endereço" (another researcher cannot see the study through its address) |
| Preconditions | Study created by account A; account B logged in on another browser. |
| Requirements | [RNF17](requisitos.md#rnf17) |
| Result on 18 Nov 2026 | Passed (mobile and desktop) |

Steps:

1. With account B, open the address of account A's study.

Expected result: The response is 404, the same as for a nonexistent study.

### CT-E21

**The participant goes from consent to the end and the researcher sees the response.**

| Field | Value |
|---|---|
| Scenario | [CN05 · Study participation](#cn05) |
| Test | `tests/e2e/questionario.spec.ts` › "fluxo completo do participante, com axe em todas as etapas" (complete participant flow, with axe at every step) |
| Preconditions | Open study. In the mobile project, a 390 px viewport. |
| Requirements | [RF24](requisitos.md#rf24), [RF25](requisitos.md#rf25), [RF27](requisitos.md#rf27), [RF32](requisitos.md#rf32), [RF33](requisitos.md#rf33), [RNF01](requisitos.md#rnf01), [RNF12](requisitos.md#rnf12) |
| Result on 18 Nov 2026 | Passed (mobile and desktop) |

Steps:

1. Open the link.
2. Agree.
3. Mark the 26 items and submit.
4. Mark "25 to 34 years" and continue.
5. Reload the researcher's page.

Expected result: Each step has its own title (Consent, Questionnaire, Optional data, Responses recorded) and the current step has aria-current=step. No radio button comes preselected. The counter reaches "26 of 26 answered". Zero violations in all steps. The researcher sees "1 response · 1 suspicious · 1 in analysis".

### CT-E22

**The whole questionnaire works with the keyboard alone and the focus is never hidden.**

| Field | Value |
|---|---|
| Scenario | [CN06 · Questionnaire accessibility](#cn06) |
| Test | `tests/e2e/questionario.spec.ts` › "fluxo completo só com teclado, com o foco sempre visível" (complete flow with the keyboard alone, with the focus always visible) |
| Preconditions | Open study. |
| Requirements | [RF28](requisitos.md#rf28), [RNF03](requisitos.md#rnf03) |
| Result on 18 Nov 2026 | Passed (mobile and desktop) |

Steps:

1. Tab to I agree and press Enter.
2. In each of the 26 items: Tab to the group, Space, right arrow.
3. Tab to Submit and Enter.
4. Tab to Skip this step and Enter.

Expected result: In each item the focused element is on screen and above the fixed footer, and the second position is marked. The person reaches /fim.

### CT-E23

**Submitting with missing items shows which ones are missing and leads to them.**

| Field | Value |
|---|---|
| Scenario | [CN05 · Study participation](#cn05) |
| Test | `tests/e2e/questionario.spec.ts` › "envio incompleto leva o foco ao resumo e os links levam aos itens" (an incomplete submission moves the focus to the summary and the links lead to the items) |
| Preconditions | Participation started. |
| Requirements | [RF29](requisitos.md#rf29) |
| Result on 18 Nov 2026 | Passed (mobile and desktop) |

Steps:

1. Mark all except items 7 and 19 and submit.
2. Click "Go to item 19".

Expected result: The summary "2 items missing: 7 and 19" receives the focus, the tab title starts with "2 items missing" and item 7 has the description "This item was not answered". The link focuses the first radio button of item 19, visible above the footer. Zero violations.

### CT-E24

**The accessibility tree of the item is the specified one.**

| Field | Value |
|---|---|
| Scenario | [CN06 · Questionnaire accessibility](#cn06) |
| Test | `tests/e2e/questionario.spec.ts` › "cada item é um grupo com legenda e 7 rádios com posição e polo" (each item is a group with a legend and 7 radio buttons with position and pole) |
| Preconditions | Participation started. |
| Requirements | [RF27](requisitos.md#rf27), [RNF04](requisitos.md#rnf04), [RNF09](requisitos.md#rnf09) |
| Result on 18 Nov 2026 | Passed (mobile and desktop) |

Steps:

1. Read the accessibility tree of item 4.

Expected result: Group "Item 4 de 26: De Fácil aprendizagem ou De difícil aprendizagem" (Item 4 of 26: easy to learn or difficult to learn) with 7 radio buttons: "1 de 7, mais perto de De Fácil aprendizagem" (1 of 7, closer to easy to learn) … "4 de 7, centro" (4 of 7, center) … "7 de 7, mais perto de De difícil aprendizagem" (7 of 7, closer to difficult to learn).

### CT-E25

**The participant link does not scroll horizontally at 320 px.**

| Field | Value |
|---|---|
| Scenario | [CN06 · Questionnaire accessibility](#cn06) |
| Test | `tests/e2e/questionario.spec.ts` › "em 320 px (zoom de 400%) nenhuma etapa rola na horizontal" (at 320 px (400% zoom) no step scrolls horizontally) |
| Preconditions | Open study; 320 × 640 viewport. |
| Requirements | [RNF02](requisitos.md#rnf02) |
| Result on 18 Nov 2026 | Passed (mobile and desktop) |

Steps:

1. Check the consent step.
2. Agree and check the questionnaire.
3. Open Leave without submitting and check.
4. Continue, answer, submit and check the optional data.

Expected result: In all steps the document width does not exceed the viewport.

### CT-E26

**Reloading does not lose what was marked.**

| Field | Value |
|---|---|
| Scenario | [CN05 · Study participation](#cn05) |
| Test | `tests/e2e/questionario.spec.ts` › "recarregar a página recupera as respostas marcadas" (reloading the page recovers the marked answers) |
| Preconditions | Participation started. |
| Requirements | [RF30](requisitos.md#rf30) |
| Result on 18 Nov 2026 | Passed (mobile and desktop) |

Steps:

1. Mark items 1 and 2.
2. Reload.

Expected result: "We recovered the answers you had already marked." appears, item 1 is still marked and the counter shows "2 of 26 answered".

### CT-E27

**Giving up asks for confirmation in a dialog and saves nothing.**

| Field | Value |
|---|---|
| Scenario | [CN05 · Study participation](#cn05) |
| Test | `tests/e2e/questionario.spec.ts` › "sair sem enviar confirma numa janela e não grava nada" (leaving without submitting confirms in a dialog and saves nothing) |
| Preconditions | Participation started with one item marked. |
| Requirements | [RF31](requisitos.md#rf31), [RNF21](requisitos.md#rnf21) |
| Result on 18 Nov 2026 | Passed (mobile and desktop) |

Steps:

1. Click Leave without submitting in the footer and run axe.
2. Press Esc.
3. Click Leave without submitting again and confirm in the dialog.
4. Open the link again.
5. Reload the researcher's page.

Expected result: The dialog "Leave without submitting? Nothing you have marked will be saved." opens with the focus on Continue answering; zero violations. Esc closes it, the answer is still marked and the focus returns to Leave without submitting. Confirming leads to /saiu ("You have left the study", without violations). The link goes back to the consent form, and the researcher sees "0 responses · 0 in analysis".

### CT-E28

**Declining saves nothing, and the same browser does not answer twice.**

| Field | Value |
|---|---|
| Scenario | [CN05 · Study participation](#cn05) |
| Test | `tests/e2e/questionario.spec.ts` › "não quero participar sai sem gravar e o link respondido não aceita outro envio" (I do not want to take part leaves without saving, and an answered link does not accept another submission) |
| Preconditions | Open study. |
| Requirements | [RF25](requisitos.md#rf25), [RF33](requisitos.md#rf33) |
| Result on 18 Nov 2026 | Passed (mobile and desktop) |

Steps:

1. Click I do not want to take part.
2. Open the link, agree, answer, submit and skip the optional data.
3. Open the link again.

Expected result: Declining shows "You have left the study". After answering, the link shows "You have already answered this study".

### CT-E29

**The dashboard shows the numbers from analisarEstudo and the view is kept in the URL.**

| Field | Value |
|---|---|
| Scenario | [CN10 · Results dashboard](#cn10) |
| Test | `tests/e2e/resultados.spec.ts` › "mostra os números do módulo UEQ e guarda versão e modo na URL" (shows the numbers from the UEQ module and keeps version and mode in the URL) |
| Preconditions | Study with the basico fixture in version 1 (20) and inconsistente in version 2 (15). |
| Requirements | [RF43](requisitos.md#rf43), [RF46](requisitos.md#rf46), [RF47](requisitos.md#rf47), [RF48](requisitos.md#rf48), [RNF08](requisitos.md#rnf08) |
| Result on 18 Nov 2026 | Passed (mobile and desktop) |

Steps:

1. Open Results and run axe.
2. Choose version 1 in the selector.
3. Reload.
4. Click Grouped by scale.
5. Click Compare versions and run axe.
6. Go back in the browser.

Expected result: Attractiveness of version 1: 0.73, CI from 0.33 to 1.14, alpha 0.92, and the chart announces "Attractiveness: mean 0.73, CI from 0.33 to 1.14, neutral". The selector keeps the focus and the URL gains versao=, itens=escala and modo=comparar. Reloading keeps the version. The legend says "hollow circle · n = 15". Going back leaves compare mode. Zero violations.

### CT-E30

**A sample of 1 produces the warning and the chart without CI.**

| Field | Value |
|---|---|
| Scenario | [CN10 · Results dashboard](#cn10) |
| Test | `tests/e2e/resultados.spec.ts` › "com uma resposta só avisa que não há intervalo de confiança" (with a single response, warns that there is no confidence interval) |
| Preconditions | Study with 1 response. |
| Requirements | [RF45](requisitos.md#rf45) |
| Result on 18 Nov 2026 | Passed (mobile and desktop) |

Steps:

1. Open Results.

Expected result: "Sample too small for a confidence interval." appears and the chart announces "…no confidence interval".

### CT-E31

**The dashboard does not scroll horizontally at 320 px.**

| Field | Value |
|---|---|
| Scenario | [CN10 · Results dashboard](#cn10) |
| Test | `tests/e2e/resultados.spec.ts` › "em 320 px o painel não rola na horizontal, nos dois modos" (at 320 px the dashboard does not scroll horizontally, in both modes) |
| Preconditions | Study with 5 responses in each version; 320 × 640 viewport. |
| Requirements | [RNF02](requisitos.md#rnf02) |
| Result on 18 Nov 2026 | Passed (mobile and desktop) |

Steps:

1. Open Results.
2. Open Compare versions.

Expected result: In both modes the document width does not exceed the viewport.

### CT-E32

**The comparison chart remains legible with color vision deficiencies and high contrast.**

| Field | Value |
|---|---|
| Scenario | [CN10 · Results dashboard](#cn10) |
| Test | `tests/e2e/resultados.spec.ts` › "gráficos com daltonismo simulado e alto contraste" (charts with simulated color blindness and high contrast) |
| Preconditions | Study with 8 responses in each version. |
| Requirements | [RNF07](requisitos.md#rnf07) |
| Result on 18 Nov 2026 | Passed (mobile and desktop) |

Steps:

1. Open Compare versions.
2. Emulate protanopia, deuteranopia and achromatopsia and capture the chart.
3. Emulate forced-colors and capture.
4. Run axe.

Expected result: The four captures are attached to the report for visual checking; the legend states the shape of each version ("filled circle"); zero violations.

### CT-E33

**The suspicious responses in the fixture are detected and removed from the analysis in bulk.**

| Field | Value |
|---|---|
| Scenario | [CN09 · Suspicious responses](#cn09) |
| Test | `tests/e2e/respostas.spec.ts` › "a fixture inconsistente sai com as 4 suspeitas da equipe e dá para tirá-las da análise" (the inconsistente fixture comes out with the team's 4 suspicious responses and they can be removed from the analysis) |
| Preconditions | Study with the inconsistente fixture (15). |
| Requirements | [RF51](requisitos.md#rf51), [RF52](requisitos.md#rf52), [RF54](requisitos.md#rf54) |
| Result on 18 Nov 2026 | Passed (mobile and desktop) |

Steps:

1. Open Responses and run axe.
2. Check Show only suspicious.
3. Click Remove suspicious responses from analysis.
4. Open Results and click View responses.

Expected result: The URL gains suspeitas=1 and "Showing 4 of 15." appears, with 4 suspicious by range. The bulk action announces "4 suspicious participations were removed from the analysis. Nothing was deleted…". The overview says "11 in analysis and 4 out". The dashboard shows "4 participations out of the analysis." and the link goes back to Responses.

### CT-E34

**Removing and returning a participation is announced and reversible.**

| Field | Value |
|---|---|
| Scenario | [CN09 · Suspicious responses](#cn09) |
| Test | `tests/e2e/respostas.spec.ts` › "incluir e excluir uma participação avisa e nunca apaga" (including and excluding a participation notifies and never deletes) |
| Preconditions | Study with 3 responses. |
| Requirements | [RF54](requisitos.md#rf54) |
| Result on 18 Nov 2026 | Passed (mobile and desktop) |

Steps:

1. Uncheck "in analysis" for the first participation.
2. Check it again.

Expected result: On unchecking: "…was removed from the analysis. Nothing was deleted" and "3 responses · 2 in analysis". On checking: "…returned to the analysis." and "3 responses · 3 in analysis".

### CT-E35

**The participation detail shows the range of the 6 scales.**

| Field | Value |
|---|---|
| Scenario | [CN09 · Suspicious responses](#cn09) |
| Test | `tests/e2e/respostas.spec.ts` › "ver escalas mostra a amplitude de cada escala e destaca as inconsistentes" (view scales shows the range of each scale and highlights the inconsistent ones) |
| Preconditions | Study with row 1 of the inconsistente fixture. |
| Requirements | [RF53](requisitos.md#rf53) |
| Result on 18 Nov 2026 | Passed (mobile and desktop) |

Steps:

1. Click View scales of the participation.

Expected result: The button goes from aria-expanded=false to true and becomes Hide; the list has 6 scales, all 6 marked as inconsistent. Zero violations.

### CT-E36

**Responses does not scroll horizontally at 320 px.**

| Field | Value |
|---|---|
| Scenario | [CN09 · Suspicious responses](#cn09) |
| Test | `tests/e2e/respostas.spec.ts` › "em 320 px a página de respostas não rola na horizontal" (at 320 px the responses page does not scroll horizontally) |
| Preconditions | Study with 3 responses; 320 × 640 viewport. |
| Requirements | [RF52](requisitos.md#rf52), [RNF02](requisitos.md#rnf02) |
| Result on 18 Nov 2026 | Passed (mobile and desktop) |

Steps:

1. Open Responses.

Expected result: The document width does not exceed the viewport.

### CT-E37

**The three CSV files and the official spreadsheet come out with the right name, encoding and content.**

| Field | Value |
|---|---|
| Scenario | [CN11 · CSV export](#cn11) |
| Test | `tests/e2e/exportacao.spec.ts` › "baixa as 4 exportações com nome datado, BOM e o formato de cada uma, e a planilha oficial em .xlsx" (downloads the 4 exports with a dated name, BOM and the format of each one, and the official spreadsheet in .xlsx) |
| Preconditions | Study with basico (20) and inconsistente (15). |
| Requirements | [RF56](requisitos.md#rf56), [RF57](requisitos.md#rf57), [RF58](requisitos.md#rf58), [RF59](requisitos.md#rf59) |
| Result on 18 Nov 2026 | Passed (mobile and desktop) |

Steps:

1. In Results, download Raw responses, Coded responses, Results by scale and Official UEQ spreadsheet (XLSX), with "All versions" selected.

Expected result: Names ueq_avaliacao-do-checkout-da-loja-virtual_<type>_<yyyy-mm-dd>.csv. Raw: BOM, header id_participacao;versao;… and 35 rows. Coded with BOM. Results: 18 rows (all + 2 versions × 6 scales) with "Checkout da loja virtual;Atratividade;20;0,7333;". Official spreadsheet: ueq_avaliacao-do-checkout-da-loja-virtual_planilha-oficial_<yyyy-mm-dd>.xlsx, with the 35 participations in Data!A4 and the first 20 equal to the respostas.csv of the basico fixture, in order.

### CT-E38

**The export respects the session and the owner.**

| Field | Value |
|---|---|
| Scenario | [CN04 · Isolation and data protection](#cn04) |
| Test | `tests/e2e/exportacao.spec.ts` › "sem sessão ou de outro pesquisador, a exportação não sai" (without a session or from another researcher, the export is not served) |
| Preconditions | Study with 2 responses; a second account. |
| Requirements | [RNF17](requisitos.md#rnf17) |
| Result on 18 Nov 2026 | Passed (mobile and desktop) |

Steps:

1. Request /api/estudos/<id>/exportar/brutas without a cookie.
2. Request it with the other account.
3. Request the nonexistent type xlsx with the owner.

Expected result: Without a cookie: 307 to /entrar. Other account: 404. Nonexistent type: 404.

### CT-E39

**The dashboard PDF is generated and downloaded.**

| Field | Value |
|---|---|
| Scenario | [CN12 · Dashboard as PDF](#cn12) |
| Test | `tests/e2e/painel-pdf.spec.ts` › "baixa o painel em PDF com nome datado, da versão escolhida" (downloads the dashboard as PDF with a dated name, for the chosen version) |
| Preconditions | Study with basico and inconsistente. |
| Requirements | [RF60](requisitos.md#rf60) |
| Result on 18 Nov 2026 | Passed (mobile and desktop) |

Steps:

1. In Results, click Dashboard as PDF.

Expected result: The file is named ueq_avaliacao-do-checkout-da-loja-virtual_painel_<yyyy-mm-dd>.pdf, starts with %PDF- and is larger than 20 KB.

### CT-E40

**The page that becomes the PDF has the header and hides the navigation when printed.**

| Field | Value |
|---|---|
| Scenario | [CN12 · Dashboard as PDF](#cn12) |
| Test | `tests/e2e/painel-pdf.spec.ts` › "a página de impressão tem cabeçalho com título, n e data, e no papel some a navegação" (the print page has a header with title, n and date, and on paper the navigation disappears) |
| Preconditions | Study with the basico fixture. |
| Requirements | [RF60](requisitos.md#rf60) |
| Result on 18 Nov 2026 | Passed (mobile and desktop) |

Steps:

1. Open /estudos/<id>/resultados/impressao and run axe.
2. Emulate print media.

Expected result: The h1 is the study title, "n in analysis" is "20 participations" and "Generated on" follows dd/mm/yyyy at hh:mm. When printed, the main navigation, the back link and the item order disappear. Zero violations.

### CT-E41

**The PDF requires a session.**

| Field | Value |
|---|---|
| Scenario | [CN04 · Isolation and data protection](#cn04) |
| Test | `tests/e2e/painel-pdf.spec.ts` › "sem sessão o PDF não sai" (without a session the PDF is not served) |
| Preconditions | Study created. |
| Requirements | [RF60](requisitos.md#rf60), [RNF17](requisitos.md#rnf17) |
| Result on 18 Nov 2026 | Passed (mobile and desktop) |

Steps:

1. Request /api/estudos/<id>/painel-pdf without a cookie.

Expected result: 307 to /entrar.

### CT-E42

**Importing a valid CSV goes through the preview and saves the rows.**

| Field | Value |
|---|---|
| Scenario | [CN13 · CSV import](#cn13) |
| Test | `tests/e2e/importacao.spec.ts` › "importa a fixture basico numa versão, com prévia, e as respostas aparecem como importadas" (imports the basico fixture into a version, with a preview, and the responses appear as imported) |
| Preconditions | Open study with 2 versions. |
| Requirements | [RF61](requisitos.md#rf61) |
| Result on 18 Nov 2026 | Passed (mobile and desktop) |

Steps:

1. Open Responses › Import and run axe.
2. Choose version 2 and the file of the basico fixture.
3. Click View preview and run axe.
4. Click Import 20 responses.

Expected result: The Responses tab keeps aria-current. The title "20 responses ready to import" receives the focus and the table has the header and 5 rows. Afterwards: /respostas?importadas=20, "20 responses imported." and 20 rows "imported from CSV" in the chosen version. Zero violations.

### CT-E43

**A file with errors is explained row by row and nothing is saved.**

| Field | Value |
|---|---|
| Scenario | [CN13 · CSV import](#cn13) |
| Test | `tests/e2e/importacao.spec.ts` › "arquivo com erro mostra o problema de cada linha e não importa nada" (a file with errors shows the problem of each row and imports nothing) |
| Preconditions | Open study. |
| Requirements | [RF61](requisitos.md#rf61) |
| Result on 18 Nov 2026 | Passed (mobile and desktop) |

Steps:

1. Click View preview with neither a version nor a file.
2. Upload a CSV with one correct row, one with 25 values and one with the value 9.
3. Click Choose another file.
4. Go back to Responses.

Expected result: First the summary "Correct 1 field" receives the focus, with a link to Version. Then the title "2 rows with a problem in com-erros.csv" receives the focus, row 2 says "Has 25 values" and row 3 "Values outside 1 to 7: item 26 ("9")", with no Import button. Responses stays empty. Zero violations.

### CT-E44

**The import preview does not scroll horizontally at 320 px.**

| Field | Value |
|---|---|
| Scenario | [CN13 · CSV import](#cn13) |
| Test | `tests/e2e/importacao.spec.ts` › "em 320 px a prévia da importação não rola na horizontal" (at 320 px the import preview does not scroll horizontally) |
| Preconditions | Open study; 320 × 800 viewport. |
| Requirements | [RF61](requisitos.md#rf61), [RNF02](requisitos.md#rnf02) |
| Result on 18 Nov 2026 | Passed (mobile and desktop) |

Steps:

1. View the preview of the basico fixture.

Expected result: The document width does not exceed the viewport.

### CT-E45

**The study language defines the whole link, even with the browser in another language, and reaches the researcher and the export.**

| Field | Value |
|---|---|
| Scenario | [CN07 · Languages](#cn07) |
| Test | `tests/e2e/idiomas.spec.ts` › "estudo em espanhol: o link abre no idioma do estudo, mesmo com o navegador em português" (study in Spanish: the link opens in the study language, even with the browser in Portuguese) |
| Preconditions | Open study, written in Spanish; participant's browser in pt-BR. |
| Requirements | [RF19](requisitos.md#rf19), [RF34](requisitos.md#rf34) |
| Result on 18 Nov 2026 | Passed (mobile and desktop) |

Steps:

1. Open the link.
2. Accept.
3. Submit empty.
4. Answer everything, submit and choose "De 25 a 34 años".
5. As the researcher, open Responses and download the raw responses.

Expected result: lang=es, titles and buttons in Spanish, instruction and official terms in Spanish, radio buttons "1 de 7, más cerca de desagradable", summary "Faltan 26 ítems…". The researcher sees a Spanish row without "translation not approved". The CSV has the columns origem;idioma;traducao_aprovada and the row ;link;es;sim;25 a 34 anos;. Zero violations.

### CT-E46

**Arabic through the selector makes the page RTL without reversing the scale.**

| Field | Value |
|---|---|
| Scenario | [CN07 · Languages](#cn07) |
| Test | `tests/e2e/idiomas.spec.ts` › "em árabe pelo seletor: página da direita para a esquerda, escala na ordem oficial" (in Arabic through the selector: right-to-left page, scale in the official order) |
| Preconditions | Open study; browser in pt-BR. |
| Requirements | [RF34](requisitos.md#rf34) |
| Result on 18 Nov 2026 | Passed (mobile and desktop) |

Steps:

1. Choose Arabic in the selector without applying.
2. Click Apply.
3. Agree.
4. Measure the position of the terms and of radio buttons 1 and 7 in item 1.
5. Answer, submit and skip.
6. As the researcher, open Responses.

Expected result: Choosing does not change the page (lang stays pt-BR); Apply changes it to lang=ar and dir=rtl and shows the translation-not-approved notice. In item 1, the left term and radio button 1 are to the left of 7 and of the right term, with the left term flush left. The researcher sees the Arabic row with "translation not approved". Zero violations.

### CT-E47

**Someone without an account browses the documentation by sections and sub-tabs and sees the diagrams.**

| Field | Value |
|---|---|
| Scenario | [CN18 · Documentation in the tool](#cn18) |
| Test | `tests/e2e/documentacao.spec.ts` › "sem conta, a documentação abre com a barra pública, as seções e as sub-abas, e passa no axe" (without an account, the documentation opens with the public bar, the sections and the sub-tabs, and passes axe) |
| Preconditions | Browser without a session cookie. |
| Requirements | [RF63](requisitos.md#rf63), [RNF01](requisitos.md#rnf01) |
| Result on 18 Nov 2026 | Passed (mobile and desktop) |

Steps:

1. Open /documentacao and run axe.
2. Click the Modeling tab.
3. In the Use cases index, open Diagram 1 and run axe.
4. Go back to the Use cases opening page and click the Class diagram sub-tab.

Expected result: The bar shows Documentation (with aria-current) and Log in, and no Studies or Log out. The h1 is "Documentation", the Overview tab is selected and the summary card says "The documentation index". Modeling opens /documentacao/casos-de-uso with the title "Use cases · Documentation", with the tab and the sub-tab selected. The Diagram 1 page loads the diagram as an image with alternative text. The sub-tab leads to the h1 "Class diagram". Zero violations.

### CT-E48

**Someone logged in reaches the documentation through their own bar and does not lose the way back.**

| Field | Value |
|---|---|
| Scenario | [CN18 · Documentation in the tool](#cn18) |
| Test | `tests/e2e/documentacao.spec.ts` › "quem entrou chega à documentação pela barra do pesquisador e continua com ela" (someone logged in reaches the documentation through the researcher bar and keeps it) |
| Preconditions | Researcher logged in. |
| Requirements | [RF63](requisitos.md#rf63) |
| Result on 18 Nov 2026 | Passed (mobile and desktop) |

Steps:

1. Click Documentation in the top bar and run axe.

Expected result: The URL becomes /documentacao, the Documentation link gets aria-current, Studies and Log out stay in the bar and Log in does not appear. Zero violations.

### CT-E49

**Links between documents and downloads work inside the tool, without an account.**

| Field | Value |
|---|---|
| Scenario | [CN18 · Documentation in the tool](#cn18) |
| Test | `tests/e2e/documentacao.spec.ts` › "os links entre documentos levam à âncora dentro da ferramenta e a planilha baixa sem conta" (links between documents lead to the anchor inside the tool and the spreadsheet downloads without an account) |
| Preconditions | Browser without a session cookie. |
| Requirements | [RF65](requisitos.md#rf65) |
| Result on 18 Nov 2026 | Passed (mobile and desktop) |

Steps:

1. In the traceability matrix, open Functional requirements › Access and account and click RF01.
2. On the Requirements opening page, check the View on GitHub link in the summary card.
3. Download the requirements spreadsheet from the summary card.

Expected result: The URL leads to the Requirements page where RF01 is (/documentacao/requisitos/requisitos-funcionais/acesso-e-conta#rf01), and the RF01 row is on screen. The GitHub link points to docs/documentacao/requisitos.md. The download comes out as planilha-requisitos.xlsx.

### CT-E50

**The documentation does not scroll horizontally at 320 px.**

| Field | Value |
|---|---|
| Scenario | [CN18 · Documentation in the tool](#cn18) |
| Test | `tests/e2e/documentacao.spec.ts` › "em 320 px a documentação não rola na horizontal" (at 320 px the documentation does not scroll horizontally) |
| Preconditions | 320 × 640 viewport. |
| Requirements | [RF63](requisitos.md#rf63), [RNF02](requisitos.md#rnf02) |
| Result on 18 Nov 2026 | Passed (mobile and desktop) |

Steps:

1. Open the overview, Requirements and Architecture.

Expected result: On all three pages the document width does not exceed the viewport: tables and diagrams scroll inside their own region.

### CT-E51

**Neither the page nor the file route serves what is not in the catalog, and the researcher area stays closed.**

| Field | Value |
|---|---|
| Scenario | [CN18 · Documentation in the tool](#cn18) |
| Test | `tests/e2e/documentacao.spec.ts` › "endereço fora do catálogo dá 404 e os arquivos só saem da lista" (an address outside the catalog returns 404 and files are only served from the list) |
| Preconditions | Browser without a session cookie. |
| Requirements | [RF65](requisitos.md#rf65) |
| Result on 18 Nov 2026 | Passed (mobile and desktop) |

Steps:

1. Open /documentacao/nao-existe.
2. Request /api/documentacao/package.json, ..%2F..%2F.env and a diagram with an invalid name.
3. Request requisitos.csv and /estudos without a cookie.

Expected result: The page returns 404; the three file requests return 404; requisitos.csv comes out (200) only if Requirements is published, otherwise it returns 404; /estudos keeps redirecting to /entrar (307).

### CT-E52

**Someone answering sees only the form and the language selector.**

| Field | Value |
|---|---|
| Scenario | [CN05 · Study participation](#cn05) |
| Test | `tests/e2e/questionario.spec.ts` › "o link do participante só mostra o formulário e o seletor de idioma, sem caminho para a ferramenta" (the participant link only shows the form and the language selector, with no path to the tool) |
| Preconditions | Open study. |
| Requirements | [RF24](requisitos.md#rf24) |
| Result on 18 Nov 2026 | Passed (mobile and desktop) |

Steps:

1. Open the link and check the language selector.
2. Agree.
3. Answer and submit.
4. Skip the optional data.

Expected result: In each step (consent, questionnaire, optional data and end) there is no Main bar and every link points to the form itself (/r/…) or to an anchor on the page. No path leads to the documentation, the studies or Log in.

### CT-E53

**The top bar stays at the top while scrolling, with and without an account.**

| Field | Value |
|---|---|
| Scenario | [CN19 · Navigation and fixed bar](#cn19) |
| Test | `tests/e2e/barra.spec.ts` › "a barra fica fixa no topo ao rolar, com e sem conta" (the bar stays fixed at the top when scrolling, with and without an account) |
| Preconditions | A long page (the home page). |
| Requirements | [RNF03](requisitos.md#rnf03), [RNF23](requisitos.md#rnf23) |
| Result on 18 Nov 2026 | Passed (mobile and desktop) |

Steps:

1. Without an account, open the home page and scroll to the end.
2. Create an account, open the home page and scroll to the middle.

Expected result: In both cases the page scrolled more than 1000 px and the bar is on screen with its top at 0.

### CT-E54

**Neither the target of an anchor nor the focused element is hidden by the bar.**

| Field | Value |
|---|---|
| Scenario | [CN19 · Navigation and fixed bar](#cn19) |
| Test | `tests/e2e/barra.spec.ts` › "o foco e as âncoras nunca ficam embaixo da barra fixa" (the focus and the anchors are never under the fixed bar) |
| Preconditions | None. |
| Requirements | [RNF03](requisitos.md#rnf03) |
| Result on 18 Nov 2026 | Passed (mobile and desktop) |

Steps:

1. Open the home page at #inicio-leitura.
2. Focus the Privacy policy link and move up 40 times with Shift+Tab.

Expected result: The anchor starts below the bar, and so does each element that receives the focus outside the bar (WCAG 2.4.11).

### CT-E55

**On mobile the fixed bar stays on a single line and the menu behaves as an open/close control.**

| Field | Value |
|---|---|
| Scenario | [CN19 · Navigation and fixed bar](#cn19) |
| Test | `tests/e2e/barra.spec.ts` › "no celular os links ficam no menu, que fecha com Esc e devolve o foco" (on mobile the links are in the menu, which closes with Esc and returns the focus) |
| Preconditions | 390 × 844 viewport. |
| Requirements | [RNF03](requisitos.md#rnf03), [RNF23](requisitos.md#rnf23) |
| Result on 18 Nov 2026 | Passed (mobile and desktop) |

Steps:

1. Check the closed Menu button.
2. Open the menu and run axe.
3. Press Esc with the focus on the Log in button.
4. Open the menu, click the logo (goes to /) and go back.

Expected result: Closed: aria-expanded=false, Log in button hidden and bar shorter than 80 px. Open: aria-expanded=true, Log in visible and zero violations. Esc closes it and returns the focus to the button. When changing pages the menu closes, and on going back it stays closed.

### CT-E56

**On a computer the links are always in view in the bar.**

| Field | Value |
|---|---|
| Scenario | [CN19 · Navigation and fixed bar](#cn19) |
| Test | `tests/e2e/barra.spec.ts` › "no computador o botão Menu não aparece e os links ficam na barra" (on a computer the Menu button does not appear and the links stay in the bar) |
| Preconditions | 1280 × 800 viewport. |
| Requirements | [RNF23](requisitos.md#rnf23) |
| Result on 18 Nov 2026 | Passed (mobile and desktop) |

Steps:

1. Open the documentation.

Expected result: The Menu button does not appear and the Log in button is visible in the bar.

### CT-E57

**The diagram opens full screen, with zoom and dragging, and closes returning the focus.**

| Field | Value |
|---|---|
| Scenario | [CN18 · Documentation in the tool](#cn18) |
| Test | `tests/e2e/documentacao.spec.ts` › "clicar no diagrama abre em tela cheia, com zoom, arrasto, Voltar e Esc" (clicking the diagram opens it full screen, with zoom, dragging, Back and Esc) |
| Preconditions | Browser without a session cookie. |
| Requirements | [RF64](requisitos.md#rf64) |
| Result on 18 Nov 2026 | Passed (mobile and desktop) |

Steps:

1. In a published document, click the first diagram and run axe.
2. Click Zoom in twice.
3. Drag the diagram with the mouse.
4. Press - and then 0.
5. Click Back.
6. With the focus on the diagram, press Enter and then Esc.

Expected result: The dialog with the diagram title takes up the whole width, Back receives the focus and the image loads; zero violations. The zoom goes to 150% and the area becomes scrollable; dragging changes the position and Back stays at the top. - brings it to 125% and 0 returns it to 100%. Back and Esc close it, and the focus returns to the diagram.

### CT-E58

**Log in and Create account open in a dialog over the page, fit without scrolling and close returning the focus.**

| Field | Value |
|---|---|
| Scenario | [CN20 · Home page and dialogs](#cn20) |
| Test | `tests/e2e/inicial.spec.ts` › "Entrar abre a janela por cima da página, sem rolar, e Esc fecha devolvendo o foco" (Log in opens the dialog over the page, without scrolling, and Esc closes it returning the focus) |
| Preconditions | Home page (/) without a session. |
| Requirements | [RF02](requisitos.md#rf02), [RF11](requisitos.md#rf11) |
| Result on 18 Nov 2026 | Passed (mobile and desktop) |

Steps:

1. Click Log in in the bar.
2. Measure the dialog box and run axe.
3. Click Create account inside the dialog.
4. Press Esc.

Expected result: The "Log in" dialog opens with the focus on Email, and the URL stays at /. The content fits without a scroll bar; zero violations. Create account swaps the form in the same dialog, with the focus on Name. Esc closes it and returns the focus to the Log in button.

### CT-E59

**Closing the dialog opened at the /entrar address leads to the home page.**

| Field | Value |
|---|---|
| Scenario | [CN20 · Home page and dialogs](#cn20) |
| Test | `tests/e2e/inicial.spec.ts` › "fechar a janela em /entrar volta para a página inicial" (closing the dialog at /entrar returns to the home page) |
| Preconditions | Browser without a session cookie. |
| Requirements | [RF11](requisitos.md#rf11) |
| Result on 18 Nov 2026 | Passed (mobile and desktop) |

Steps:

1. Open /entrar.
2. Click Close (x).

Expected result: The dialog disappears and the URL becomes /.

### CT-E60

**A logged-in user sees the home page with the researcher bar.**

| Field | Value |
|---|---|
| Scenario | [CN20 · Home page and dialogs](#cn20) |
| Test | `tests/e2e/inicial.spec.ts` › "quem entrou vê a página inicial com a barra do pesquisador e o caminho para os estudos" (a logged-in user sees the home page with the researcher bar and the way to the studies) |
| Preconditions | Researcher logged in. |
| Requirements | [RF11](requisitos.md#rf11) |
| Result on 18 Nov 2026 | Passed (mobile and desktop) |

Steps:

1. Open /.
2. Click "See your studies".

Expected result: The bar has the Log out button. "See your studies" leads to /estudos.

### CT-E61

**The browser receives the site icon, also without a session.**

| Field | Value |
|---|---|
| Scenario | [CN20 · Home page and dialogs](#cn20) |
| Test | `tests/e2e/inicial.spec.ts` › "o navegador recebe o ícone do site" (the browser receives the site icon) |
| Preconditions | Browser without a session cookie. |
| Requirements | [RF11](requisitos.md#rf11) |
| Result on 18 Nov 2026 | Passed (mobile and desktop) |

Steps:

1. Open / and read the rel=icon link.
2. Request the SVG icon and the apple-touch-icon.

Expected result: The link points to /icon.svg; the SVG is served with 200 and image/svg+xml, and the apple-touch-icon is served as image/png.

### CT-E62

**A document in progress shows only the notice and the information panel, and the route does not serve its files.**

| Field | Value |
|---|---|
| Scenario | [CN18 · Documentation in the tool](#cn18) |
| Test | `tests/e2e/documentacao.spec.ts` › "documento em produção mostra o aviso e a ficha, sem texto, arquivo nem downloads" (a document in progress shows the notice and the information panel, with no text, file or downloads) |
| Preconditions | Browser without a session cookie; Requirements still in progress. |
| Requirements | [RF63](requisitos.md#rf63) |
| Result on 18 Nov 2026 | Skipped (mobile and desktop): all documents in the catalog are published, so there is no document in progress to open |

Steps:

1. Open /documentacao and run axe.
2. In the Document status table, click Requirements and run axe.
3. Request requisitos.csv and planilha-requisitos.xlsx.

Expected result: The overview shows "The documentation is being written by the team." and the table with Requirements "In preparation". Requirements shows the h1, the notice "Requirements: in preparation." and the information panel with "In preparation", without View on GitHub, without downloads and without an article. Both files return 404. Zero violations.

### CT-E63

**The owner invites by email, the invitee accepts in the bell and, as a viewer, can only view.**

| Field | Value |
|---|---|
| Scenario | [CN21 · Team and notifications](#cn21) |
| Test | `tests/e2e/equipe.spec.ts` › "convite por e-mail chega no sino, o leitor só vê e o dono é avisado" (an email invitation arrives in the bell, the viewer can only view and the owner is notified) |
| Preconditions | Two accounts, each in its own browser; the owner has a study. |
| Requirements | [RF20](requisitos.md#rf20), [RF21](requisitos.md#rf21), [RF22](requisitos.md#rf22) |
| Result on 18 Nov 2026 | Passed (mobile and desktop) |

Steps:

1. In Share, invite an email that has no account.
2. Invite the second account as Viewer and run axe.
3. In the second account, open Studies and the bell, and accept.
4. In the owner's account, open Notifications and run axe.

Expected result: An email without an account shows "There is no account with this email". The invitation appears as "Pending invitation" and the status says "Invitation sent". The second account sees "You have 1 pending invitation" and "invited you… as a viewer". After accepting, it sees "you are a viewer", without Edit study or Open data collection. The owner receives "accepted the invitation to the study". Zero violations.

### CT-E64

**The bell opens and closes with the keyboard alone, returning the focus.**

| Field | Value |
|---|---|
| Scenario | [CN21 · Team and notifications](#cn21) |
| Test | `tests/e2e/equipe.spec.ts` › "o sino também funciona pelo teclado" (the bell also works with the keyboard) |
| Preconditions | Researcher logged in, with no notices. |
| Requirements | [RF22](requisitos.md#rf22), [RNF03](requisitos.md#rnf03) |
| Result on 18 Nov 2026 | Passed (mobile and desktop) |

Steps:

1. Reach the bell with Tab and press Enter.
2. Press Esc.

Expected result: Enter sets aria-expanded=true and shows "Nothing new". Esc sets aria-expanded=false and the focus returns to the bell.

### CT-E65

**Each researcher page explains itself in a dialog.**

| Field | Value |
|---|---|
| Scenario | [CN22 · Learning to use the tool](#cn22) |
| Test | `tests/e2e/equipe.spec.ts` › "toda página do pesquisador tem o (?) com a ajuda dela" (every researcher page has the (?) with its help) |
| Preconditions | Researcher logged in. |
| Requirements | [RF10](requisitos.md#rf10) |
| Result on 18 Nov 2026 | Passed (mobile and desktop) |

Steps:

1. On /estudos, /estudos/novo, /conta and /notificacoes, open Help for this page.
2. Run axe.
3. Press Esc.

Expected result: The dialog opens with the page title, without violations, and Esc closes it.

### CT-E66

**The tour starts on the first access, advances through the person's action and does not come back once skipped.**

| Field | Value |
|---|---|
| Scenario | [CN22 · Learning to use the tool](#cn22) |
| Test | `tests/e2e/equipe.spec.ts` › "o tour abre só no primeiro acesso, avança pelo clique na ação e pode ser pulado" (the tour opens only on the first access, advances by clicking the action and can be skipped) |
| Preconditions | New test email. |
| Requirements | [RF09](requisitos.md#rf09) |
| Result on 18 Nov 2026 | Passed (mobile and desktop) |

Steps:

1. Create the account and run axe on the welcome screen.
2. Click Start the tour.
3. Click the highlighted example study.
4. Click Skip tutorial and reload.

Expected result: "Welcome to UEQ Tool" appears. The tour creates "Tour example: delivery app", shows "Step 1 of 12" and, after the click, "Step 2 of 12". Once skipped, the card disappears, and the welcome screen does not come back on reload. Zero violations.

### CT-E67

**The language chosen at sign-up applies to the tool and can be changed later.**

| Field | Value |
|---|---|
| Scenario | [CN24 · Tool language](#cn24) |
| Test | `tests/e2e/idioma-interface.spec.ts` › "o idioma escolhido ao criar a conta vale para a ferramenta e pode ser trocado em Minha conta" (the language chosen when creating the account applies to the tool and can be changed in My account) |
| Preconditions | A German translation of "Minha conta" (My account) saved directly in the database, as the API would save it. Runs on desktop only. |
| Requirements | [RF08](requisitos.md#rf08) |
| Result on 18 Nov 2026 | Passed on desktop; skipped on mobile, where the bar is collapsed |

Steps:

1. In Create account, fill in the form and run axe.
2. Choose "Deutsch" in Tool language.
3. Create the account and skip the tour.
4. On /conta/idioma, choose Português and save.

Expected result: What was typed remains after the change. The bar shows "Mein Konto", and lang stays pt-BR, because almost nothing is translated. Saving shows "Tool language changed." and the bar goes back to "Minha conta". Zero violations.

### CT-E68

**Changing the language in the questionnaire does not lose the answers already marked.**

| Field | Value |
|---|---|
| Scenario | [CN07 · Languages](#cn07) |
| Test | `tests/e2e/idiomas.spec.ts` › "o idioma também troca no meio do questionário, sem perder o que já foi marcado" (the language also changes in the middle of the questionnaire, without losing what was already marked) |
| Preconditions | Open study. |
| Requirements | [RF30](requisitos.md#rf30), [RF34](requisitos.md#rf34) |
| Result on 18 Nov 2026 | Passed (mobile and desktop) |

Steps:

1. Agree and mark item 1.
2. Choose English in the selector and click Apply.
3. Run axe.

Expected result: It stays on /questionario, with lang=en. Item 1 is now "annoying or enjoyable", it is still marked, and the progress says "1 of 26 answered". Zero violations.

### CT-E69

**The home page cites the studies and gives the credits.**

| Field | Value |
|---|---|
| Scenario | [CN20 · Home page and dialogs](#cn20) |
| Test | `tests/e2e/inicial.spec.ts` › "a página inicial explica o UEQ, lista os estudos do método e dá os créditos" (the home page explains the UEQ, lists the studies on the method and gives the credits) |
| Preconditions | Browser without a session cookie. |
| Requirements | [RF11](requisitos.md#rf11) |
| Result on 18 Nov 2026 | Passed (mobile and desktop) |

Steps:

1. On /, click Studies on the method in the table of contents.
2. Check the links of the references.
3. Check the credits and run axe.

Expected result: The URL ends in #inicio-estudos. Each study leads to its DOI, and the handbook to the official PDF. The credits cite the authors of the UEQ, the course and the three team members. Zero violations.

### CT-E70

**The logo leads to the home page, and a logged-in user sees the way to the studies.**

| Field | Value |
|---|---|
| Scenario | [CN20 · Home page and dialogs](#cn20) |
| Test | `tests/e2e/inicial.spec.ts` › "quem entrou volta à página inicial pelo logotipo" (a logged-in user returns to the home page through the logo) |
| Preconditions | Researcher logged in, on /conta. |
| Requirements | [RF11](requisitos.md#rf11) |
| Result on 18 Nov 2026 | Passed (mobile and desktop) |

Steps:

1. Click the logo in the bar.

Expected result: The URL is / and the "See your studies" link appears.

### CT-E71

**Without data collection turned on, the optional data step does not exist.**

| Field | Value |
|---|---|
| Scenario | [CN05 · Study participation](#cn05) |
| Test | `tests/e2e/questionario.spec.ts` › "sem coleta de dados demográficos, o envio leva direto ao agradecimento" (without demographic data collection, submitting leads straight to the thank-you page) |
| Preconditions | Open study with demographic data collection turned off. |
| Requirements | [RF18](requisitos.md#rf18), [RF32](requisitos.md#rf32) |
| Result on 18 Nov 2026 | Passed (mobile and desktop) |

Steps:

1. Open the link and agree.
2. Answer everything and submit.
3. Open /sobre-voce through the address.

Expected result: The list of steps has 2 items and "Step 2 of 2 · Questionnaire" appears. Submitting leads to "Responses recorded", and the step does not open even through the address.

### CT-E72

**The participants' profile appears in a sub-tab of Results, with the table of numbers.**

| Field | Value |
|---|---|
| Scenario | [CN10 · Results dashboard](#cn10) |
| Test | `tests/e2e/privacidade.spec.ts` › "os dados demográficos aparecem em Resultados, numa sub-aba própria" (the demographic data appear in Results, in a sub-tab of their own) |
| Preconditions | Open study with data collection turned on and one response. |
| Requirements | [RF50](requisitos.md#rf50) |
| Result on 18 Nov 2026 | Passed (mobile and desktop) |

Steps:

1. Answer, choosing 25 to 34 years.
2. As the researcher, open Results and Demographic data.
3. Open "See the numbers" and run axe.

Expected result: The Age group chart has the aria-label "25 to 34 years, 1 (100%)", and the table shows 100%. Zero violations.

### CT-E73

**Every response carries the security headers.**

| Field | Value |
|---|---|
| Scenario | [CN23 · Data protection](#cn23) |
| Test | `tests/e2e/privacidade.spec.ts` › "toda resposta sai com os cabeçalhos de segurança" (every response is sent with the security headers) |
| Preconditions | None. |
| Requirements | [RNF18](requisitos.md#rnf18) |
| Result on 18 Nov 2026 | Passed (mobile and desktop) |

Steps:

1. Request / and read the headers.

Expected result: CSP with frame-ancestors 'none', HSTS of 2 years, nosniff, X-Frame-Options DENY, Referrer-Policy same-origin and no X-Powered-By.

### CT-E74

**The policy opens without an account and passes axe.**

| Field | Value |
|---|---|
| Scenario | [CN23 · Data protection](#cn23) |
| Test | `tests/e2e/privacidade.spec.ts` › "a política de privacidade é pública e acessível" (the privacy policy is public and accessible) |
| Preconditions | Browser without a session cookie. |
| Requirements | [RNF01](requisitos.md#rnf01), [RNF19](requisitos.md#rnf19) |
| Result on 18 Nov 2026 | Passed (mobile and desktop) |

Steps:

1. Open /privacidade and run axe.

Expected result: The h1 is "Privacy policy" and "Your rights (LGPD, art. 18)" appears. Zero violations.

### CT-E75

**The table of contents leads to each section, and the page fits in 320 px.**

| Field | Value |
|---|---|
| Scenario | [CN23 · Data protection](#cn23) |
| Test | `tests/e2e/privacidade.spec.ts` › "a política leva cada seção pelo índice e não rola na horizontal em 320 px" (the policy leads to each section through the table of contents and does not scroll horizontally at 320 px) |
| Preconditions | Browser without a session cookie. |
| Requirements | [RNF02](requisitos.md#rnf02), [RNF19](requisitos.md#rnf19) |
| Result on 18 Nov 2026 | Passed (mobile and desktop) |

Steps:

1. On /privacidade, click Questions and requests in the table of contents.
2. Reduce the width to 320 px and run axe.

Expected result: The URL ends in #contato, with the section in view. At 320 px there is no horizontal scrolling. Zero violations.

### CT-E76

**Back leads to the footer of the home page, where the person left from.**

| Field | Value |
|---|---|
| Scenario | [CN23 · Data protection](#cn23) |
| Test | `tests/e2e/privacidade.spec.ts` › "da página inicial, a política volta ao rodapé de onde a pessoa saiu" (from the home page, the policy returns to the footer the person left from) |
| Preconditions | Browser without a session cookie. |
| Requirements | [RNF19](requisitos.md#rnf19) |
| Result on 18 Nov 2026 | Passed (mobile and desktop) |

Steps:

1. On /, click Privacy policy in the footer.
2. Click Return to the home page.

Expected result: The URL ends in /#rodape, with the footer in view.

### CT-E77

**From My account and from the help, Back leads to the screen of origin.**

| Field | Value |
|---|---|
| Scenario | [CN23 · Data protection](#cn23) |
| Test | `tests/e2e/privacidade.spec.ts` › "de Minha conta e da ajuda, a política volta para a mesma tela" (from My account and from the help, the policy returns to the same screen) |
| Preconditions | Researcher logged in. |
| Requirements | [RNF19](requisitos.md#rnf19) |
| Result on 18 Nov 2026 | Passed (mobile and desktop) |

Steps:

1. On /conta, open the policy.
2. Click Return to My account.
3. On /estudos, open the help and, from it, the policy.
4. Click Return to the previous page.

Expected result: When logged in, the information panel shows "Download my data". The two Back links lead to /conta and to /estudos.

### CT-E78

**From the dialogs, the policy opens in another tab, without losing what was typed.**

| Field | Value |
|---|---|
| Scenario | [CN23 · Data protection](#cn23) |
| Test | `tests/e2e/privacidade.spec.ts` › "das janelas de acesso, a política abre em outra aba, sem perder o que foi digitado, e voltar tenta fechar a aba" (from the access dialogs, the policy opens in another tab, without losing what was typed, and going back tries to close the tab) |
| Preconditions | Browser without a session cookie. |
| Requirements | [RNF19](requisitos.md#rnf19) |
| Result on 18 Nov 2026 | Passed (mobile and desktop) |

Steps:

1. Open /entrar and check the link.
2. On /cadastrar, type the name.
3. Click Privacy policy.
4. In the new tab, click Close this tab and return.

Expected result: The Log in dialog also has the link. The new tab shows the policy, and the Name field is still filled in on the tab of origin. Back asks to close the tab; if the browser refuses, it goes on to the home page. The test replaces window.close with a log entry, because actually closing the tab hangs Playwright's shutdown in headless Chromium. The real closing was checked separately, in a Playwright script, on 6 Nov 2026, and the manual case CT-M23 repeats the check.

### CT-E79

**The Back destination never leaves the tool.**

| Field | Value |
|---|---|
| Scenario | [CN23 · Data protection](#cn23) |
| Test | `tests/e2e/privacidade.spec.ts` › "a política não aceita voltar para outro site" (the policy does not accept going back to another site) |
| Preconditions | None. |
| Requirements | [RNF19](requisitos.md#rnf19) |
| Result on 18 Nov 2026 | Passed (mobile and desktop) |

Steps:

1. Open /privacidade?de= with https://exemplo.com, //exemplo.com, /\exemplo.com and /[tab]/exemplo.com.

Expected result: In all four cases, the link is "Return to the home page" and points to /.

### CT-E80

**After 5 wrong passwords, login blocks the email.**

| Field | Value |
|---|---|
| Scenario | [CN23 · Data protection](#cn23) |
| Test | `tests/e2e/privacidade.spec.ts` › "depois de 5 senhas erradas o e-mail espera" (after 5 wrong passwords the email has to wait) |
| Preconditions | A test email. |
| Requirements | [RNF16](requisitos.md#rnf16) |
| Result on 18 Nov 2026 | Passed (mobile and desktop) |

Steps:

1. Enter the wrong password 5 times in Log in.
2. Try again.

Expected result: Each error shows the "email or password do not match" message, and the focus goes to the summary. The sixth attempt shows "Too many attempts with this email".

### CT-E81

**Download my data delivers the account in JSON, without the password.**

| Field | Value |
|---|---|
| Scenario | [CN23 · Data protection](#cn23) |
| Test | `tests/e2e/privacidade.spec.ts` › "Baixar meus dados entrega um JSON com a conta e sem a senha" (Download my data delivers a JSON with the account and without the password) |
| Preconditions | Researcher logged in. |
| Requirements | [RF07](requisitos.md#rf07) |
| Result on 18 Nov 2026 | Passed (mobile and desktop) |

Steps:

1. On /conta, click Download my data.

Expected result: The file is named meus-dados-ferramenta-ueq-AAAA-MM-DD.json, contains the account's email and has no senhaHash.

### CT-E82

**The participant reads the policy from the consent form, without leaving the study link.**

| Field | Value |
|---|---|
| Scenario | [CN05 · Study participation](#cn05) |
| Test | `tests/e2e/questionario.spec.ts` › "a política de privacidade abre pelo termo, dentro do link do participante, e volta para ele" (the privacy policy opens from the consent form, inside the participant link, and returns to it) |
| Preconditions | Open study. |
| Requirements | [RF25](requisitos.md#rf25), [RNF19](requisitos.md#rnf19) |
| Result on 18 Nov 2026 | Passed (mobile and desktop) |

Steps:

1. Open the link.
2. Click Privacy policy.
3. Check the links on the page and run axe.
4. Click Back.

Expected result: The URL ends in /privacidade, with the h1 "Privacy policy" and the section "If you answered a questionnaire". There is no tool bar and every link stays under /r/ or is an anchor. Back leads to the consent form. Zero violations.

### CT-E83

**Without a translation, the policy warns in the person's language and marks the text as Portuguese.**

| Field | Value |
|---|---|
| Scenario | [CN05 · Study participation](#cn05) |
| Test | `tests/e2e/questionario.spec.ts` › "sem tradução automática, a política avisa no idioma da pessoa e sai marcada como português" (without automatic translation, the policy warns in the person's language and is marked as Portuguese) |
| Preconditions | Open study, written in English; no translation of the policy in the database. |
| Requirements | [RF34](requisitos.md#rf34), [RNF19](requisitos.md#rnf19) |
| Result on 18 Nov 2026 | Passed (mobile and desktop) |

Steps:

1. Open the link.
2. Click Privacy policy.
3. Run axe.

Expected result: "This policy has not been translated into your language yet" appears. The main element has lang=pt-BR, and the link is "Back". Zero violations.

### CT-E84

**A long document opens as a table of contents, and each section opens on its own page, with the diagram in view.**

| Field | Value |
|---|---|
| Scenario | [CN18 · Documentation in the tool](#cn18) |
| Test | `tests/e2e/documentacao.spec.ts` › "documento longo abre como índice, e cada seção em página própria com o diagrama à vista" (a long document opens as a table of contents, and each section on its own page with the diagram in view) |
| Preconditions | Browser without a session cookie. |
| Requirements | [RF63](requisitos.md#rf63) |
| Result on 18 Nov 2026 | Passed (mobile and desktop) |

Steps:

1. Open /documentacao/diagramas-de-sequencia and run axe.
2. Click 7. Invite someone to the study and run axe.
3. Click Next.
4. Click Previous.

Expected result: The "In this document" table of contents has 8 items, with no diagram on the opening page. The section has its own address, a page title with the document, an h1, "7 of 8" and the diagram loaded and in view without scrolling. The last section has no Next. Zero violations.

### CT-E85

**Back leads to the page the person came from and, without history, to the page above.**

| Field | Value |
|---|---|
| Scenario | [CN18 · Documentation in the tool](#cn18) |
| Test | `tests/e2e/documentacao.spec.ts` › "Voltar leva à página de onde a pessoa veio e, sem histórico, à página de cima" (Back leads to the page the person came from and, without history, to the page above) |
| Preconditions | Browser without a session cookie. |
| Requirements | [RF63](requisitos.md#rf63) |
| Result on 18 Nov 2026 | Passed (mobile and desktop) |

Steps:

1. In a section of Sequence diagrams, follow the link to Architecture.
2. Click Back.
3. In another tab, open the logical data model diagram directly.
4. Click Back.

Expected result: The link leads to /documentacao/arquitetura/implantacao. The first Back returns to the section of origin, in another document. Without history, Back leads to the opening page of the document.

### CT-E86

**A section with many subsections becomes a table of contents, and table links and old addresses find the right page.**

| Field | Value |
|---|---|
| Scenario | [CN18 · Documentation in the tool](#cn18) |
| Test | `tests/e2e/documentacao.spec.ts` › "seção com muitas subseções vira índice, e o link de uma tabela leva à página da linha" (a section with many subsections becomes a table of contents, and a link in a table leads to the row's page) |
| Preconditions | Browser without a session cookie. |
| Requirements | [RF65](requisitos.md#rf65) |
| Result on 18 Nov 2026 | Passed (mobile and desktop) |

Steps:

1. Open End-to-end cases and click CT-E02.
2. In Scenarios, click CT-E01.
3. Open /documentacao/casos-de-teste#ct-e03 and #ct-u01.
4. Open a section that does not exist and one of an unpublished document.

Expected result: Each case has its own page, without violations. The old fragment redirects to the new page, and #ct-u01 is in view in the scenario's table. A nonexistent section and an unpublished document return 404.

### CT-E87

**A short document stays whole, without extra clicks.**

| Field | Value |
|---|---|
| Scenario | [CN18 · Documentation in the tool](#cn18) |
| Test | `tests/e2e/documentacao.spec.ts` › "documento curto continua inteiro, com o índice da página na ficha" (a short document stays whole, with the page's table of contents in the information panel) |
| Preconditions | Browser without a session cookie. |
| Requirements | [RF63](requisitos.md#rf63) |
| Result on 18 Nov 2026 | Passed (mobile and desktop) |

Steps:

1. Open /documentacao/checklist-manual.

Expected result: The sections appear on the same page, without the "In this document" table of contents, and the information panel lists the anchors.

### CT-E88

**While the action runs, the button shows that it is processing and nothing is submitted twice.**

| Field | Value |
|---|---|
| Scenario | [CN03 · Study management](#cn03) |
| Test | `tests/e2e/estudos.spec.ts` › "enquanto cria o estudo o botão mostra que está processando, ignora novos cliques e no fim confirma" (while the study is being created the button shows that it is processing, ignores new clicks and confirms at the end) |
| Preconditions | Researcher logged in; the test delays submissions by 1.2 s. |
| Requirements | [RNF20](requisitos.md#rnf20) |
| Result on 18 Nov 2026 | Passed (mobile and desktop) |

Steps:

1. Fill in Create study and click Create study.
2. Click the busy button again, twice, and press Enter.
3. Wait for the study page and run axe.
4. Open the list of studies.

Expected result: The button says "Creating the study…", with aria-busy and aria-disabled. The study page shows "Study created successfully." and the list has only one study with that title. Zero violations.

### CT-E89

**The confirmation follows the scrolling, can be closed and does not come back on reload.**

| Field | Value |
|---|---|
| Scenario | [CN03 · Study management](#cn03) |
| Test | `tests/e2e/estudos.spec.ts` › "a confirmação pode ser fechada e continua à vista depois de rolar a página" (the confirmation can be closed and stays in view after scrolling the page) |
| Preconditions | Researcher logged in; 800 × 400 px window. |
| Requirements | [RNF20](requisitos.md#rnf20) |
| Result on 18 Nov 2026 | Passed (mobile and desktop) |

Steps:

1. Create a study.
2. Scroll to the end of the page.
3. Click Close on the confirmation.
4. Reload.

Expected result: The confirmation stays in view after scrolling and disappears when closed. The notice leaves the address, and reloading does not confirm again.

### CT-E90

**Creating the account, logging out and logging in are confirmed on screen.**

| Field | Value |
|---|---|
| Scenario | [CN01 · Access and authentication](#cn01) |
| Test | `tests/e2e/autenticacao.spec.ts` › "criar a conta e entrar confirmam na tela" (creating the account and logging in are confirmed on screen) |
| Preconditions | New test email. |
| Requirements | [RF01](requisitos.md#rf01), [RF02](requisitos.md#rf02), [RNF20](requisitos.md#rnf20) |
| Result on 18 Nov 2026 | Passed (mobile and desktop) |

Steps:

1. Create the account and skip the tour.
2. Log out and confirm.
3. Log in again.

Expected result: "Account created successfully.", "You have logged out of your account." and "You have logged in to your account." appear in role=status, and the address stays clean.

### CT-E91

**The consent form gives all the information that the LGPD and CNS Resolution 510/2016 require, and the person can keep a copy.**

| Field | Value |
|---|---|
| Scenario | [CN05 · Study participation](#cn05) |
| Test | `tests/e2e/questionario.spec.ts` › "o termo diz o tempo, como desistir, o que acontece depois de enviar, riscos, benefícios e quem responde, e tem uma via para guardar" (the consent form states the time, how to withdraw, what happens after submitting, risks, benefits and who is responsible, and has a copy to keep) |
| Preconditions | Open study with optional data, created by a test researcher. |
| Requirements | [RF25](requisitos.md#rf25) |
| Result on 18 Nov 2026 | Passed (mobile and desktop) |

Steps:

1. Open the participant link.
2. Read the consent form and run axe.
3. Open “Keep a copy of this consent form” and run axe.
4. Go back, choose the age and agree.

Expected result: The subtitle shows the institution. The consent form says "4 to 6 minutes, no time limit", mentions the optional data, “Leave without submitting”, that the responses cannot be withdrawn after submitting, the storage for as long as the research lasts, the risks, the benefits and the contact of the responsible researcher. The copy has "Print or save as PDF" and no link outside the study. The questionnaire shows the time. Zero violations.

### CT-E92

**Without the age, or under 18 without the guardian's authorization, nothing is saved.**

| Field | Value |
|---|---|
| Scenario | [CN23 · Data protection](#cn23) |
| Test | `tests/e2e/questionario.spec.ts` › "quem tem menos de 18 anos só participa com a autorização do responsável, e sem idade nada é gravado" (someone under 18 only takes part with the guardian's authorization, and without the age nothing is saved) |
| Preconditions | Open study with optional data. |
| Requirements | [RF25](requisitos.md#rf25) |
| Result on 18 Nov 2026 | Passed (mobile and desktop) |

Steps:

1. Agree without choosing the age.
2. Choose "Under 18" and agree without the authorization.
3. Confirm the authorization and agree.
4. Answer, submit and skip the optional data.

Expected result: Each error appears in role=alert, with the focus on the right field, and the authorization only appears for "Under 18". With it, the questionnaire opens, the optional data have "Under 18" and the participation is saved as that of a minor. Zero violations.

### CT-E93

**The form requires who is responsible for the research and suggests the rest.**

| Field | Value |
|---|---|
| Scenario | [CN03 · Study management](#cn03) |
| Test | `tests/e2e/estudos.spec.ts` › "o estudo nasce com o responsável da conta e exige nome, contato e instituição, que vão para o termo" (the study starts with the account's responsible researcher and requires name, contact and institution, which go into the consent form) |
| Preconditions | Researcher logged in. |
| Requirements | [RF13](requisitos.md#rf13) |
| Result on 18 Nov 2026 | Passed (mobile and desktop) |

Steps:

1. Open Create study.
2. Erase the name of the responsible researcher, write an invalid email and leave the institution empty.
3. Try to create.
4. Fill in the three fields and create.

Expected result: The form already comes with the account's name and email and with suggestions for risks and benefits. The three errors appear in the summary and in the fields. The preview shows "Ana Souza · PPGIa · PUCPR", and the study's information panel shows the responsible researcher and the contact.

### CT-E94

**The selector in the bar is a shortcut to My account › Language, without leaving the page.**

| Field | Value |
|---|---|
| Scenario | [CN24 · Tool language](#cn24) |
| Test | `tests/e2e/idioma-interface.spec.ts` › "o seletor de idioma da barra troca a ferramenta e a conta sem sair da página" (the language selector in the bar changes the tool and the account without leaving the page) |
| Preconditions | New account, created with the keyboard alone. |
| Requirements | [RF08](requisitos.md#rf08) |
| Result on 18 Nov 2026 | Passed (mobile and desktop) |

Steps:

1. Open the "Idioma: Português" (Language: Português) selector in the bar (on mobile, inside the Menu).
2. Run axe with the list open.
3. Close it with Esc.
4. Open it again and choose "Deutsch".
5. Open My account › Language.

Expected result: The "Tool language" list shows the 37 languages, with Português selected. Esc closes it and returns the focus to the selector. After choosing German, the page stays on /estudos, the bar shows "Mein Konto", the focus returns to the selector, now "Sprache: Deutsch", and My account › Language is set to Deutsch. Zero violations.

### CT-E95

**Without login, the selector in the bar also changes the language, and the choice is kept in this browser.**

| Field | Value |
|---|---|
| Scenario | [CN24 · Tool language](#cn24) |
| Test | `tests/e2e/idioma-interface.spec.ts` › "sem login, o seletor de idioma da barra fica guardado neste navegador" (without login, the language selector in the bar is kept in this browser) |
| Preconditions | Not logged in. |
| Requirements | [RF08](requisitos.md#rf08) |
| Result on 18 Nov 2026 | Passed (mobile and desktop) |

Steps:

1. Open the Documentation.
2. Choose "English" in the selector in the bar.
3. Reload the page.

Expected result: The focus returns to the selector, now "Language: English", and the page stays in English after reloading.

### CT-E96

**In each validation scenario, the dashboard and the exported spreadsheet match the official spreadsheet.**

| Field | Value |
|---|---|
| Scenario | [CN15 · Validation against the official spreadsheet](#cn15) |
| Test | `tests/e2e/planilha-oficial.spec.ts` › "cenário …: o painel e a planilha exportada batem com a planilha oficial" (scenario …: the dashboard and the exported spreadsheet match the official spreadsheet), one per scenario: oficial-exemplo, grande, inconsistente, bordas, variancia-zero, negativo and extremos/n2 |
| Preconditions | Study without responses. The esperado.json of each scenario came from the UEQ Data Analysis Tool V15 recalculated in Excel ([data/fixtures/LEIA-ME.md](../../data/fixtures/LEIA-ME.md)). |
| Requirements | [RF59](requisitos.md#rf59), [RF61](requisitos.md#rf61), [RNF11](requisitos.md#rnf11) |
| Result on 18 Nov 2026 | Passed (mobile and desktop, 7 scenarios in each) |

Steps:

1. In Responses › Import responses from a CSV, import the scenario's respostas.csv into the version "Checkout da loja virtual" (online store checkout).
2. In Results, choose that version.
3. Compare the Results by scale table with esperado.json.
4. Download Official UEQ spreadsheet (XLSX).

Expected result: In each of the 6 scales, n, mean, SD, CI95, alpha and benchmark equal to those of the official spreadsheet, rounded as the dashboard shows them ("—" where the spreadsheet gives an error). The file is named ueq_avaliacao-do-checkout-da-loja-virtual_planilha-oficial_checkout-da-loja-virtual_<aaaa-mm-dd>.xlsx, has the responses of the imported file in Data!A4, in the same order, and asks Excel to recalculate on opening.

### CT-E97

**The form explains the difference and the participant answers the 8 pairs of the UEQ-S.**

| Field | Value |
|---|---|
| Scenario | [CN16 · UEQ-S](#cn16) |
| Test | `tests/e2e/ueq-s.spec.ts` › "o formulário explica a diferença e o participante responde os 8 pares do UEQ-S" (the form explains the difference and the participant answers the 8 pairs of the UEQ-S) |
| Preconditions | Researcher with an open UEQ-S study, without optional data. |
| Requirements | [RF62](requisitos.md#rf62), [RF25](requisitos.md#rf25) |
| Result on 18 Nov 2026 | Passed (mobile and desktop) |

Steps:

1. Open the link: the consent form says 8 pairs and 1 to 2 minutes.
2. Agree and check the 8 groups, with Item 4 of 8: Confuso or Evidente (confusing or clear) and Item 7 of 8: Convencional or Original (conventional or inventive).
3. Mark the sixth position in all 8 and submit.
4. Open Results as the researcher.
5. Open Edit study.

Expected result: The overview says UEQ-S, short version · 8 items · 37 languages. Results leads to /resultados/ueq-s, with n = 1, pragmatic 2.00, the overall scale without alpha and without the full UEQ spreadsheet; axe without violations. When editing, the choice appears locked, with the reason.

### CT-E98

**In each UEQ-S scenario, the UEQ-S tab and the exported spreadsheet match the official UEQ-S spreadsheet.**

| Field | Value |
|---|---|
| Scenario | [CN16 · UEQ-S](#cn16) |
| Test | `tests/e2e/ueq-s.spec.ts` › "UEQ-S, cenário …: o painel e a planilha exportada batem com a planilha oficial do UEQ-S" (UEQ-S, scenario …: the dashboard and the exported spreadsheet match the official UEQ-S spreadsheet), one per scenario: oficial-exemplo, bordas, variancia-zero, negativo and n2 |
| Preconditions | UEQ-S study without responses. The esperado.json of each scenario came from the official UEQ-S spreadsheet recalculated in Excel ([data/fixtures-ueq-s/LEIA-ME.md](../../data/fixtures-ueq-s/LEIA-ME.md)). |
| Requirements | [RF61](requisitos.md#rf61), [RF62](requisitos.md#rf62), [RNF11](requisitos.md#rnf11) |
| Result on 18 Nov 2026 | Passed (mobile and desktop, 5 scenarios in each) |

Steps:

1. In Responses › Import responses from a CSV, check that the format asks for 8 values and import the scenario's respostas.csv.
2. In Results (UEQ-S tab), choose the version.
3. Compare the Results by scale table with esperado.json.
4. Download Official UEQ-S spreadsheet (XLSX).

Expected result: In the pragmatic, the hedonic and the overall scale, n, mean, SD, CI95, alpha and benchmark equal to those of the UEQ-S spreadsheet, rounded as the dashboard shows them. The file name ends in _planilha-oficial-ueq-s_checkout-da-loja-virtual_<aaaa-mm-dd>.xlsx, it has the imported responses in Data!A4, in the same order, and asks for recalculation on opening.

### CT-E99

**In a full UEQ study, the UEQ-S tab uses the 8 equivalent pairs and matches the UEQ-S spreadsheet.**

| Field | Value |
|---|---|
| Scenario | [CN16 · UEQ-S](#cn16) |
| Test | `tests/e2e/ueq-s.spec.ts` › "num estudo do UEQ completo, a aba UEQ-S usa os 8 pares equivalentes e bate com a planilha do UEQ-S" (in a full UEQ study, the UEQ-S tab uses the 8 equivalent pairs and matches the UEQ-S spreadsheet) |
| Preconditions | Full UEQ study with the 20 responses of the basico scenario. |
| Requirements | [RF62](requisitos.md#rf62), [RNF11](requisitos.md#rnf11) |
| Result on 18 Nov 2026 | Passed (mobile and desktop) |

Steps:

1. In Results, open the UEQ-S sub-tab.
2. Choose the version.
3. Compare the table with data/fixtures-ueq-s/do-ueq-basico/esperado.json.
4. Download Official UEQ-S spreadsheet (XLSX).

Expected result: The tab explains where the numbers come from; the table matches the UEQ-S spreadsheet; the downloaded spreadsheet has each participant's 8 items in the order and with the sides of the UEQ-S; the tab does not repeat the raw responses and offers the UEQ-S results in CSV; axe without violations.

### CT-E100

**The home page compares the UEQ and the UEQ-S.**

| Field | Value |
|---|---|
| Scenario | [CN16 · UEQ-S](#cn16) |
| Test | `tests/e2e/ueq-s.spec.ts` › "a página inicial compara o UEQ e o UEQ-S" (the home page compares the UEQ and the UEQ-S) |
| Preconditions | Not logged in. |
| Requirements | [RF62](requisitos.md#rf62) |
| Result on 18 Nov 2026 | Passed (mobile and desktop) |

Steps:

1. Open /#ueq-e-ueq-s.

Expected result: The UEQ or UEQ-S section has the table of differences (8 pairs taken from the 26, 1 to 2 minutes) and the 8 pairs, each read as Item n: from … to …; axe without violations.

### CT-E101

**AA on the UEQ-S screens: reflow at 320 px, keyboard, high contrast and the locked state.**

| Field | Value |
|---|---|
| Scenario | [CN16 · UEQ-S](#cn16) |
| Test | `tests/e2e/ueq-s.spec.ts` › "AA: em 320 px nada rola na horizontal, e a escolha do questionário funciona só com o teclado" (AA: at 320 px nothing scrolls horizontally, and the choice of questionnaire works with the keyboard alone) |
| Preconditions | Researcher with a UEQ-S study. |
| Requirements | [RF62](requisitos.md#rf62), [RNF01](requisitos.md#rnf01), [RNF02](requisitos.md#rnf02), [RNF03](requisitos.md#rnf03) |
| Result on 18 Nov 2026 | Passed (mobile and desktop) |

Steps:

1. In Create study, focus Full UEQ and press the down arrow.
2. Reduce the screen to 320 px and turn on high contrast.
3. Save responses and open the UEQ-S tab, in the One version and Compare versions modes.
4. Open Edit study.
5. Open the home page at #ueq-e-ueq-s.

Expected result: The arrow selects UEQ-S, short version, with visible focus on the card. At 320 px none of these screens scrolls horizontally (WCAG 1.4.10), and axe finds no WCAG 2.2 A and AA violation on any of them, including with high contrast. When editing, the two radio buttons are disabled.

### CT-E102

**In Croatian, the UEQ-S questionnaire uses the pairs from the official UEQ-S list, not those of the full UEQ.**

| Field | Value |
|---|---|
| Scenario | [CN16 · UEQ-S](#cn16) |
| Test | `tests/e2e/ueq-s.spec.ts` › "em croata, o questionário do UEQ-S mostra os pares da lista oficial do UEQ-S" (in Croatian, the UEQ-S questionnaire shows the pairs from the official UEQ-S list) |
| Preconditions | Open UEQ-S study, in Croatian (hr). |
| Requirements | [RF62](requisitos.md#rf62), [RF34](requisitos.md#rf34), [RNF01](requisitos.md#rnf01) |
| Result on 18 Nov 2026 | Passed (mobile and desktop) |

Steps:

1. Open the participant link.
2. State being 18 or older and agree to the consent form.
3. Read items 7 and 8 of the questionnaire.

Expected result: Item 7 says konvencionalna and inventivna and item 8 ends in predvodnička, as in the official list of UEQ-S items (for the same pairs, the full UEQ says neoriginalan/originalan and uobičajen/nov); axe finds no WCAG 2.2 A and AA violation.

### CT-E103

**A slow download shows the notice until the file arrives, with the same name.**

| Field | Value |
|---|---|
| Scenario | [CN03 · Study management](#cn03) |
| Test | `tests/e2e/aviso-espera.spec.ts` › "download demorado mostra o aviso até o arquivo chegar, com o mesmo nome" (a slow download shows the notice until the file arrives, with the same name) |
| Preconditions | Study open with the 20 responses from the basico fixture; the export held back for 2 s. |
| Requirements | [RNF20](requisitos.md#rnf20) |
| Result on 23 Nov 2026 | Passed (mobile and desktop) |

Steps:

1. Open Results.
2. Click Official UEQ spreadsheet (XLSX).

Expected result: "Preparing the file…" and "The download will start on its own as soon as the file is ready." appear while the spreadsheet is generated. The download arrives with the usual dated name, and the notice disappears.

### CT-E104

**A failed download is reported in a window that closes.**

| Field | Value |
|---|---|
| Scenario | [CN03 · Study management](#cn03) |
| Test | `tests/e2e/aviso-espera.spec.ts` › "download que falha avisa numa janela que fecha" (a failed download is reported in a window that closes) |
| Preconditions | Study open with responses; the raw responses export answers with error 500. |
| Requirements | [RNF20](requisitos.md#rnf20) |
| Result on 23 Nov 2026 | Passed (mobile and desktop) |

Steps:

1. Open Results.
2. Click Raw responses (CSV).
3. Click Close.

Expected result: A window in role=alertdialog says "The file could not be downloaded." and "Check your connection and try again.", and Close removes it from the screen.

### CT-E105

**A page that is slow to load shows the notice until it opens.**

| Field | Value |
|---|---|
| Scenario | [CN03 · Study management](#cn03) |
| Test | `tests/e2e/aviso-espera.spec.ts` › "página que demora a carregar mostra o aviso até abrir" (a page that is slow to load shows the notice until it opens) |
| Preconditions | Study open; the Next RSC requests held back for 2 s. |
| Requirements | [RNF20](requisitos.md#rnf20) |
| Result on 23 Nov 2026 | Passed (mobile and desktop) |

Steps:

1. On the study overview, click Responses.

Expected result: "Loading the page…" appears until the Responses page opens, and disappears when the address changes.

### CT-E106

**A slow form repeats in the notice what the button says.**

| Field | Value |
|---|---|
| Scenario | [CN03 · Study management](#cn03) |
| Test | `tests/e2e/aviso-espera.spec.ts` › "formulário que demora repete no aviso o que o botão diz" (a slow form repeats in the notice what the button says) |
| Preconditions | Researcher logged in at My account › Personal data; the server action held back for 2 s. |
| Requirements | [RNF20](requisitos.md#rnf20) |
| Result on 23 Nov 2026 | Passed (mobile and desktop) |

Steps:

1. Click Save changes.

Expected result: The notice says "Saving…" and "Please wait a moment. Do not close or refresh the page." while the action runs, and disappears when it ends.

## Unit cases

Each case groups the unit tests of a single rule. The Runs column counts the actual tests: a parameterized case runs once per language or per color pair.

### CN08 · UEQ calculation

| ID | File | Function or group | Expected result | Runs | Requirements | Result on 18 Nov 2026 |
|---|---|---|---|---|---|---|
| <a id="ct-u01"></a>CT-U01 | `recodificar.test.ts` | `recodificar` | With the positive pole on the right, 1 becomes -3, 4 becomes 0 and 7 becomes 3 | 1 | [RF36](requisitos.md#rf36), [RNF25](requisitos.md#rnf25) | Passed |
| <a id="ct-u02"></a>CT-U02 | `recodificar.test.ts` | `recodificar` | With the positive pole on the left, 1 becomes 3, 4 becomes 0 and 7 becomes -3 | 1 | [RF36](requisitos.md#rf36), [RNF25](requisitos.md#rnf25) | Passed |
| <a id="ct-u03"></a>CT-U03 | `recodificar.test.ts` | `recodificar` | Rejects 0, 8, 3.5 and NaN, which do not exist on the 1 to 7 scale | 6 | [RF36](requisitos.md#rf36) | Passed (6 of 6) |
| <a id="ct-u04"></a>CT-U04 | `recodificar.test.ts` | `recodificarParticipante` | Turns the middle point into 0 in the 26 items | 1 | [RF36](requisitos.md#rf36) | Passed |
| <a id="ct-u05"></a>CT-U05 | `recodificar.test.ts` | `recodificarParticipante` | Applies the polarity of each item: 7 everywhere gives +3 on the '+' items and -3 on the '-' items | 1 | [RF36](requisitos.md#rf36) | Passed |
| <a id="ct-u06"></a>CT-U06 | `recodificar.test.ts` | `recodificarParticipante` | Rejects a participant without the 26 responses | 1 | [RF36](requisitos.md#rf36) | Passed |
| <a id="ct-u07"></a>CT-U07 | `estatistica.test.ts` | `media` | Returns null without values and calculates the simple mean | 2 | [RF37](requisitos.md#rf37), [RNF25](requisitos.md#rnf25) | Passed (2 of 2) |
| <a id="ct-u08"></a>CT-U08 | `estatistica.test.ts` | `desvioPadraoAmostral` | Null with n = 0 and n = 1, divisor n - 1 and zero when all values are equal | 3 | [RF37](requisitos.md#rf37) | Passed (3 of 3) |
| <a id="ct-u09"></a>CT-U09 | `estatistica.test.ts` | `intervaloConfianca95` | Mean ± z · sd / √n; null without sd (n = 1) and with sd = 0, like the spreadsheet's #NUM! | 3 | [RF37](requisitos.md#rf37) | Passed (3 of 3) |
| <a id="ct-u10"></a>CT-U10 | `estatistica.test.ts` | `correlacao` | Pearson correlation; null without variation or with fewer than 2 pairs; rejects series of different lengths | 4 | [RF37](requisitos.md#rf37) | Passed (4 of 4) |
| <a id="ct-u11"></a>CT-U11 | `estatistica.test.ts` | `alfaCronbach` | Standardized alpha k · r̄ / (1 + (k - 1) · r̄); 1 when the items move together; null with fewer than 2 items, an item without variation (#DIV/0!), a zero denominator or a single participant | 6 | [RF37](requisitos.md#rf37) | Passed (6 of 6) |
| <a id="ct-u12"></a>CT-U12 | `escalas.test.ts` | `escoresPorParticipante` | +3 on all scales for someone who always marks the positive pole; mean of the scale's items only | 2 | [RF37](requisitos.md#rf37), [RNF25](requisitos.md#rnf25) | Passed (2 of 2) |
| <a id="ct-u13"></a>CT-U13 | `escalas.test.ts` | `faixaInterpretacao` | -0.8 and 0.8 are neutral; above 0.8 positive, below -0.8 negative | 2 | [RF38](requisitos.md#rf38) | Passed (2 of 2) |
| <a id="ct-u14"></a>CT-U14 | `escalas.test.ts` | `resultadoPorEscala` | Edge cases n = 0, n = 1 and all equal, and mean, sd, CI and alpha with two participants | 4 | [RF37](requisitos.md#rf37), [RNF25](requisitos.md#rnf25) | Passed (4 of 4) |
| <a id="ct-u15"></a>CT-U15 | `escalas.test.ts` | `resultadoPorItem` | The 26 items in order with the recoded mean and the distribution from 1 to 7 | 1 | [RF41](requisitos.md#rf41) | Passed |
| <a id="ct-u16"></a>CT-U16 | `benchmark.test.ts` | `classificarBenchmark` | One mean in each of the 5 ranges: excellent, good, above average, below average and bad | 8 | [RF40](requisitos.md#rf40) | Passed (8 of 8) |
| <a id="ct-u17"></a>CT-U17 | `benchmark.test.ts` | `classificarBenchmark` | A mean equal to the limit falls in the lower range; uses the limits of the requested scale; null without a mean | 8 | [RF40](requisitos.md#rf40) | Passed (8 of 8) |
| <a id="ct-u18"></a>CT-U18 | `analisar-estudo.test.ts` | `analisarEstudo` | Statistics only with the participations included in the analysis | 1 | [RF42](requisitos.md#rf42) | Passed |
| <a id="ct-u20"></a>CT-U20 | `analisar-estudo.test.ts` | `analisarEstudo` | Classifies in the benchmark and calculates pragmatic and hedonic quality from the mean of the scales | 1 | [RF39](requisitos.md#rf39), [RF40](requisitos.md#rf40) | Passed |
| <a id="ct-u21"></a>CT-U21 | `analisar-estudo.test.ts` | `analisarEstudo` | Flags an alpha below the protocol's minimum | 1 | [RF37](requisitos.md#rf37), [RF45](requisitos.md#rf45) | Passed |
| <a id="ct-u22"></a>CT-U22 | `analisar-estudo.test.ts` | `analisarEstudo` | With no one in the analysis, returns null numbers, without breaking | 1 | [RF42](requisitos.md#rf42), [RNF25](requisitos.md#rnf25) | Passed |

### CN09 · Suspicious responses

| ID | File | Function or group | Expected result | Runs | Requirements | Result on 18 Nov 2026 |
|---|---|---|---|---|---|---|
| <a id="ct-u19"></a>CT-U19 | `analisar-estudo.test.ts` | `analisarEstudo` | Evaluates the suspicion of all participations, including the excluded ones | 1 | [RF42](requisitos.md#rf42), [RF51](requisitos.md#rf51) | Passed |
| <a id="ct-u23"></a>CT-U23 | `inconsistencia.test.ts` | `amplitudePorEscala` | Zero for consistent responses; reproduces the handbook's perspicuity example (distance 5) | 2 | [RF51](requisitos.md#rf51) | Passed (2 of 2) |
| <a id="ct-u24"></a>CT-U24 | `inconsistencia.test.ts` | `respostasIguais` | Counts the most repeated position | 1 | [RF51](requisitos.md#rf51) | Passed |
| <a id="ct-u25"></a>CT-U25 | `inconsistencia.test.ts` | `marcarSuspeitos` | Suspicious with 3 inconsistent scales, not with 2; a range equal to 3 is not an inconsistency | 7 | [RF51](requisitos.md#rf51) | Passed (7 of 7) |
| <a id="ct-u26"></a>CT-U26 | `inconsistencia.test.ts` | `marcarSuspeitos` | Suspicious with more than 15 identical responses, not with exactly 15 | 7 | [RF51](requisitos.md#rf51) | Passed (7 of 7) |
| <a id="ct-u27"></a>CT-U27 | `inconsistencia.test.ts` | `marcarSuspeitos` | Points out both reasons when both rules apply; reads the thresholds from the configuration | 7 | [RF51](requisitos.md#rf51) | Passed (7 of 7) |
| <a id="ct-u28"></a>CT-U28 | `fixtures.test.ts` | `fixtures conforme os LEIA-ME` | basico without suspicious responses; inconsistente flags exactly rows 1, 6, 9 and 13; todos-1 and todos-7 fall under the identical-responses rule | 3 | [RF51](requisitos.md#rf51) | Passed (3 of 3) |

### CN15 · Validation against the official spreadsheet

| ID | File | Function or group | Expected result | Runs | Requirements | Result on 18 Nov 2026 |
|---|---|---|---|---|---|---|
| <a id="ct-u29"></a>CT-U29 | `fixtures.test.ts` | `fixture … contra a planilha oficial` | For each of the 11 scenarios in data/fixtures: mean, sd, n and CI95 of scales and items, alpha, benchmark, pragmatic, hedonic, distribution of responses, inconsistent scales and identical responses per participant equal to those of the spreadsheet, with a tolerance of 1e-6; a spreadsheet error is null | 77 | [RNF11](requisitos.md#rnf11) | Passed (77 of 77) |
| <a id="ct-u70"></a>CT-U70 | `planilha-oficial.test.ts` | `preencherPlanilhaOficial` | Puts the responses in Data!A4 and removes the 255 example participants; keeps rows 1 to 3; puts the language in Read_First!B5, with a name from the Items sheet for each of the 37 languages; stores the result of every formula and still asks for recalculation on opening; updates the numbers kept in the charts and does not touch styles or the other parts; removes the sample importance ratings from the KPI_Calculation sheet; without participants it comes out empty; rejects more than 1000 participants and values outside 1 to 7 | 9 | [RF59](requisitos.md#rf59) | Passed (9 of 9) |
| <a id="ct-u79"></a>CT-U79 | `planilha-oficial-resultados.test.ts` | `planilha oficial … exportada com os resultados gravados` | For each of the 11 scenarios in data/fixtures and the 9 in data/fixtures-ueq-s, the results stored in the exported spreadsheet (mean, SD, n and 95% CI of scales and items, alpha, benchmark, pragmatic, hedonic, distribution of the answers, inconsistent scales and identical answers per participant) equal to those of the esperado.json generated by Excel, with a relative tolerance of 1e-12; a spreadsheet error is null | 20 | [RF59](requisitos.md#rf59), [RF62](requisitos.md#rf62), [RNF11](requisitos.md#rnf11) | Passed (20 of 20) |
| <a id="ct-u80"></a>CT-U80 | `planilha-calculo.test.ts` | `cálculo das fórmulas da planilha oficial` | Operator precedence and associativity; an empty cell compared as 0 or empty text, and text above numbers; #DIV/0!, #VALUE! and #NUM! propagated; range functions ignore text and empty cells, and COUNTA counts the empty text of a formula; VAR, CORREL, COVARIANCE.S and CONFIDENCE; case-insensitive VLOOKUP; inverse of the normal distribution with the precision of NORM.S.INV | 7 | [RF59](requisitos.md#rf59), [RNF11](requisitos.md#rnf11) | Passed (7 of 7) |
| <a id="ct-u81"></a>CT-U81 | `email.test.ts` | `envio de e-mail` and `e-mails da ferramenta` | Without the variables it does not send and says what is missing; adds the tool name to the sender only when it comes without a name; reads the port with spaces and the values pasted with the .env quotes; sends several over the same connection and returns the server's answer for the one that failed, without the password in the log; the invitation leads to Notifications and mentions Accept and Decline; the new version notice goes out in the account's language, with that language's labels and right to left in Arabic; the 17 new texts are translated into the 36 languages | 8 | [RF23](requisitos.md#rf23) | Passed (8 of 8) |

### CN05 · Study participation

| ID | File | Function or group | Expected result | Runs | Requirements | Result on 18 Nov 2026 |
|---|---|---|---|---|---|---|
| <a id="ct-u30"></a>CT-U30 | `balanceamento.test.ts` | `versaoComMenosRespostas` | Chooses the version with the fewest completed responses; on a tie, the one with the lowest order; with one version, that one; without versions, null | 4 | [RF26](requisitos.md#rf26) | Passed (4 of 4) |

### CN11 · CSV export

| ID | File | Function or group | Expected result | Runs | Requirements | Result on 18 Nov 2026 |
|---|---|---|---|---|---|---|
| <a id="ct-u31"></a>CT-U31 | `csv.test.ts` | `campoCsv` | Plain text stays as it is; semicolons and line breaks go between quotes; inner quotes are doubled; a missing value stays empty | 5 | [RF56](requisitos.md#rf56) | Passed (5 of 5) |
| <a id="ct-u32"></a>CT-U32 | `csv.test.ts` | `documentoCsv` | Starts with a BOM, uses ; and ends each line with CRLF; comes out without a BOM when requested | 2 | [RF56](requisitos.md#rf56), [RF57](requisitos.md#rf57), [RF58](requisitos.md#rf58) | Passed (2 of 2) |
| <a id="ct-u33"></a>CT-U33 | `csv.test.ts` | `decimalCsv e slugDoTitulo` | Decimal comma and empty for missing values; file name without accents, spaces or symbols, and never empty | 3 | [RF58](requisitos.md#rf58), [RNF22](requisitos.md#rnf22) | Passed (3 of 3) |
| <a id="ct-u34"></a>CT-U34 | `exportacoes.test.ts` | `linhasDaPlanilhaOficial` | The basico fixture produces the same rows as the original respostas.csv; leaves out whoever is out of the analysis | 2 | [RF59](requisitos.md#rf59) | Passed (2 of 2) |
| <a id="ct-u35"></a>CT-U35 | `exportacoes.test.ts` | `exportarBrutas` | BOM, header and 26 item columns; version and demographics protected against ;, quotes and line breaks | 2 | [RF56](requisitos.md#rf56) | Passed (2 of 2) |
| <a id="ct-u37"></a>CT-U37 | `exportacoes.test.ts` | `exportarRecodificadas` | Replaces 1 to 7 with -3 to +3 with the polarity corrected | 1 | [RF57](requisitos.md#rf57) | Passed |
| <a id="ct-u38"></a>CT-U38 | `exportacoes.test.ts` | `exportarResultados` | One row per scale, with a decimal comma | 1 | [RF58](requisitos.md#rf58) | Passed |

### CN07 · Languages

| ID | File | Function or group | Expected result | Runs | Requirements | Result on 18 Nov 2026 |
|---|---|---|---|---|---|---|
| <a id="ct-u36"></a>CT-U36 | `exportacoes.test.ts` | `idioma nas exportações` | States the language in which the person answered and whether the translation is approved; an imported response comes out with its origin and without a language | 2 | [RF52](requisitos.md#rf52), [RF61](requisitos.md#rf61) | Passed (2 of 2) |
| <a id="ct-u45"></a>CT-U45 | `idiomas.test.ts` | `os 37 idiomas do pacote oficial` | The 37 languages are complete and each one has the 26 pairs in order, filled in and with different terms | 41 | [RF34](requisitos.md#rf34), [RNF10](requisitos.md#rnf10) | Passed (41 of 41) |
| <a id="ct-u46"></a>CT-U46 | `idiomas.test.ts` | `os 37 idiomas do pacote oficial` | The Portuguese is exactly that of data/ueq-itens-ptbr.json, which feeds the database | 1 | [RNF10](requisitos.md#rnf10) | Passed |
| <a id="ct-u47"></a>CT-U47 | `idiomas.test.ts` | `os 37 idiomas do pacote oficial` | Flags the 9 languages without an approved translation and the 3 right-to-left ones; every correction keeps the original pair and the reason | 41 | [RF34](requisitos.md#rf34), [RNF10](requisitos.md#rnf10) | Passed (41 of 41) |
| <a id="ct-u48"></a>CT-U48 | `idiomas.test.ts` | `textos das telas` | In each language, no empty text, the same {placeholders} as the Portuguese and the accessible name of each circle with position and pole | 38 | [RF34](requisitos.md#rf34), [RNF04](requisitos.md#rnf04) | Passed (38 of 38) |
| <a id="ct-u49"></a>CT-U49 | `idiomas.test.ts` | `plural e lista` | Plural in the form of the language (falling back to other) and lists joined the way the language joins them | 2 | [RF34](requisitos.md#rf34) | Passed (2 of 2) |
| <a id="ct-u50"></a>CT-U50 | `idiomas.test.ts` | `negociarIdioma` | Chooses the first of the 37 according to the browser's preference, accepts old codes, falls back to Portuguese and gives the lang of each language | 3 | [RF34](requisitos.md#rf34) | Passed (3 of 3) |

### CN13 · CSV import

| ID | File | Function or group | Expected result | Runs | Requirements | Result on 18 Nov 2026 |
|---|---|---|---|---|---|---|
| <a id="ct-u39"></a>CT-U39 | `importacao.test.ts` | `lerCsvDeRespostas` | Reads the basico fixture as the UEQ module does | 5 | [RF61](requisitos.md#rf61) | Passed (5 of 5) |
| <a id="ct-u40"></a>CT-U40 | `importacao.test.ts` | `lerCsvDeRespostas` | Accepts commas, tabs, BOM, quotes and a trailing separator; ignores blank lines while keeping the real number of each line | 6 | [RF61](requisitos.md#rf61) | Passed (6 of 6) |
| <a id="ct-u41"></a>CT-U41 | `importacao.test.ts` | `lerCsvDeRespostas` | Points out, per line, the wrong number of values and the values outside the scale; rejects a file with too many lines | 6 | [RF61](requisitos.md#rf61) | Passed (6 of 6) |

### CN10 · Results dashboard

| ID | File | Function or group | Expected result | Runs | Requirements | Result on 18 Nov 2026 |
|---|---|---|---|---|---|---|
| <a id="ct-u42"></a>CT-U42 | `leitura-rapida.test.ts` | `leituraDeUmaVersao` | Reproduces the sentence of prototype r6; groups scales in the same range and cites the negative ones; null without a mean | 3 | [RF44](requisitos.md#rf44) | Passed (3 of 3) |
| <a id="ct-u43"></a>CT-U43 | `leitura-rapida.test.ts` | `leituraDaComparacao` | Points out the two largest differences and whom they favor; says when the versions are close; with three versions, counts the scales in which each one leads | 3 | [RF47](requisitos.md#rf47) | Passed (3 of 3) |
| <a id="ct-u44"></a>CT-U44 | `leitura-rapida.test.ts` | `formatarDecimal` | Comma, two decimal places and a dash for missing values | 1 | [RNF22](requisitos.md#rnf22) | Passed |

### CN14 · Colors and contrast

| ID | File | Function or group | Expected result | Runs | Requirements | Result on 18 Nov 2026 |
|---|---|---|---|---|---|---|
| <a id="ct-u51"></a>CT-U51 | `contraste.test.ts` | `contraste dos tokens de cor` | Each text pair of the theme reaches 4.5:1 | 57 | [RNF06](requisitos.md#rnf06) | Passed (57 of 57) |
| <a id="ct-u52"></a>CT-U52 | `contraste.test.ts` | `contraste dos tokens de cor` | Each field border, focus indicator and chart marker reaches 3:1 against the backgrounds and the benchmark ranges | 57 | [RNF06](requisitos.md#rnf06), [RNF07](requisitos.md#rnf07) | Passed (57 of 57) |

### CN16 · UEQ-S

| ID | File | Function or group | Expected result | Runs | Requirements | Result on 18 Nov 2026 |
|---|---|---|---|---|---|---|
| <a id="ct-u53"></a>CT-U53 | `ueq-s.test.ts` | `UEQ-S` | The 8 UEQ-S items point to UEQ pairs with the right scale and polarity, in order; the benchmark limits are in order | 3 | [RF62](requisitos.md#rf62) | Passed (3 of 3) |
| <a id="ct-u71"></a>CT-U71 | `fixtures-ueq-s.test.ts` | `UEQ-S: fixture … contra a planilha oficial do UEQ-S` | For each of the 9 scenarios in data/fixtures-ueq-s: mean, sd, n and CI95 of the pragmatic, the hedonic, the overall scale and the 8 items, alpha, benchmark, the three scores of each participant, inconsistent scales, identical responses and the middle category equal to those of the UEQ-S spreadsheet, with a tolerance of 1e-6; a spreadsheet error is null | 54 | [RF62](requisitos.md#rf62), [RNF11](requisitos.md#rnf11) | Passed (54 of 54) |
| <a id="ct-u72"></a>CT-U72 | `fixtures-ueq-s.test.ts` | `UEQ-S: itens montados` e `fixture bordas` | The 8 items are pairs 11, 13, 20, 21, 6, 7, 10 and 15 of the UEQ, with the sides swapped only in items 4 and 7; a round trip between the UEQ-S and the UEQ items changes no response; in the bordas scenario only rows 3, 4 and 7 are suspicious | 3 | [RF62](requisitos.md#rf62) | Passed (3 of 3) |
| <a id="ct-u73"></a>CT-U73 | `planilha-oficial-ueq-s.test.ts` | `preencherPlanilhaOficial com o modelo do UEQ-S` | Puts the 8 responses in Data!A4 and removes the 13 example participants; language in Read_First!B4, with a name from the Items sheet for each of the 37 languages; stores the result of every formula and still asks for recalculation on opening; rejects a participant without the 8 values | 6 | [RF62](requisitos.md#rf62) | Passed (6 of 6) |
| <a id="ct-u74"></a>CT-U74 | `exportacoes.test.ts` | `exportações do UEQ-S` | Raw responses with item01 to item08; recoded ones with x − 4; results with pragmatic, hedonic and overall (no alpha for the overall scale), equal to the spreadsheet; from a full UEQ study, the UEQ-S spreadsheet receives the 8 equivalent items | 4 | [RF62](requisitos.md#rf62) | Passed (4 of 4) |
| <a id="ct-u75"></a>CT-U75 | `importacao.test.ts` | `lerCsvDeRespostas` | In a UEQ-S study, reads 8 values per line and rejects the lines with 26 | 1 | [RF61](requisitos.md#rf61), [RF62](requisitos.md#rf62) | Passed (1 of 1) |
| <a id="ct-u76"></a>CT-U76 | `termo.test.ts` | `condicoesDoTermo` | In the UEQ-S, the consent form says 1 to 2 minutes (2 to 3 with optional data) and, in the 37 languages, 8 pairs where the UEQ one says 26 | 38 | [RF25](requisitos.md#rf25), [RF62](requisitos.md#rf62) | Passed (38 of 38) |
| <a id="ct-u77"></a>CT-U77 | `termos-ueq-s.test.ts` | `termos do UEQ-S em cada idioma` | The 37 languages have the 8 pairs, all different; the Portuguese is that of data/ueq-s-itens-ptbr.json and the English is that of the handbook; those not marked as different repeat the pair of the full UEQ, with the sides swapped in items 4 and 7; the different ones are exactly Italian, Croatian, Greek, Turkish, Persian and Chinese, with item 7 in Croatian konvencionalna/inventivna | 4 | [RF62](requisitos.md#rf62), [RF34](requisitos.md#rf34) | Passed (4 of 4) |

### CN18 · Documentation in the tool

| ID | File | Function or group | Expected result | Runs | Requirements | Result on 18 Nov 2026 |
|---|---|---|---|---|---|---|
| <a id="ct-u54"></a>CT-U54 | `documentacao.test.ts` | `catálogo da documentação` | Every document and download in the catalog exists; each document has a single address; every .md in docs/documentacao is in the catalog; an address outside the catalog does not become a document | 3 | [RF63](requisitos.md#rf63), [RF65](requisitos.md#rf65) | Passed (3 of 3) |
| <a id="ct-u55"></a>CT-U55 | `documentacao.test.ts` | `diagramas` | Each Mermaid diagram in the documents has its generated SVG and a source file equal to the one in the document, and no unused SVG is left over | 3 | [RF63](requisitos.md#rf63), [RF64](requisitos.md#rf64) | Passed (3 of 3) |
| <a id="ct-u56"></a>CT-U56 | `documentacao.test.ts` | `destinoDoLink` | A link to another document opens in the Documentation tab with the anchor; a downloadable file goes through the download route; the rest of the repository opens on GitHub; no relative link in the documents points to a file that does not exist | 4 | [RF65](requisitos.md#rf65) | Passed (4 of 4) |
| <a id="ct-u57"></a>CT-U57 | `documentacao.test.ts` | `renderizarMarkdown` | Separate title, anchors equal to GitHub's (including repeated ones), table in a named scrollable region, rewritten links and the diagram as a zoom button with an image with alternative text and the code in view | 3 | [RF63](requisitos.md#rf63) | Passed (3 of 3) |
| <a id="ct-u64"></a>CT-U64 | `documentacao.test.ts` | `dividirDocumento` | Separates the opening from the sections without mistaking code for a heading; uses addresses without accents; splits only a section with 3 or more subsections; finds the page of each anchor, including that of a table row; summarizes by the first paragraph; a short document stays whole | 5 | [RF63](requisitos.md#rf63) | Passed (5 of 5) |
| <a id="ct-u65"></a>CT-U65 | `documentacao.test.ts` | `rota das âncoras em documentos divididos` | Leads to the anchor's page, with a fragment only in the middle of the page; rewrites the section's links; every page of every published document has a title and does not repeat the h1 | 3 | [RF65](requisitos.md#rf65) | Passed (3 of 3) |

### CN10 · Results dashboard: participants' profile

| ID | File | Function or group | Expected result | Runs | Requirements | Result on 18 Nov 2026 |
|---|---|---|---|---|---|---|
| <a id="ct-u60"></a>CT-U60 | `perfil-demografico.test.ts` | `perfilDemografico` | Counts each option, those who preferred not to answer and those who skipped; an ordered scale stays in the scale's order; gender goes from largest to smallest; without participations, the shares stay at zero | 4 | [RF50](requisitos.md#rf50) | Passed (4 of 4) |

### CN21 · Team and notifications

| ID | File | Function or group | Expected result | Runs | Requirements | Result on 18 Nov 2026 |
|---|---|---|---|---|---|---|
| <a id="ct-u59"></a>CT-U59 | `modelo-email.test.ts` | `modelo dos e-mails` | Builds the HTML with the language, the button, the fallback link and the footer; escapes what comes from the researcher; turns right-to-left in Arabic, Hebrew and Persian; has the same message in plain text | 4 | [RF23](requisitos.md#rf23) | Passed (4 of 4) |

### CN23 · Data protection

| ID | File | Function or group | Expected result | Runs | Requirements | Result on 18 Nov 2026 |
|---|---|---|---|---|---|---|
| <a id="ct-u58"></a>CT-U58 | `cripto.test.ts` | `criptografia de campo` | Encrypts and decrypts with a new IV each time; altered text or another key do not decrypt; encrypted Json comes back the same and the old format remains readable; a key of the wrong size is rejected; without a key, it stores the value as it came | 6 | [RNF14](requisitos.md#rnf14) | Passed (6 of 6) |
| <a id="ct-u69"></a>CT-U69 | `termo.test.ts` | `condicoesDoTermo` e `lerIdade` | Lists the lines of the consent form in screen order; with optional data, warns and increases the time; with an ethics committee, shows the committee; in all languages, cites the leave button by the name it has; the age only goes through for adults or for minors with the authorization | 40 | [RF25](requisitos.md#rf25) | Passed (40 of 40) |

### CN24 · Tool language

| ID | File | Function or group | Expected result | Runs | Requirements | Result on 18 Nov 2026 |
|---|---|---|---|---|---|---|
| <a id="ct-u62"></a>CT-U62 | `catalogo.test.ts` | `catálogo da interface` | The catalog is up to date with the t() and m() calls in the code, has only screen text, each text knows which file it comes from, and none is empty | 4 | [RF08](requisitos.md#rf08) | Passed (4 of 4) |
| <a id="ct-u63"></a>CT-U63 | `catalogo.test.ts` | `tradutor` | Returns the original when there is no translation and interpolates the placeholders; the key changes with the source language, except for Portuguese; unknown placeholders stay as they are | 3 | [RF08](requisitos.md#rf08), [RF35](requisitos.md#rf35) | Passed (3 of 3) |
| <a id="ct-u66"></a>CT-U66 | `catalogo.test.ts` | `mesmosMarcadores` | Accepts the placeholders in another order and rejects a translated, missing or extra placeholder | 1 | [RF08](requisitos.md#rf08) | Passed (1 of 1) |
| <a id="ct-u67"></a>CT-U67 | `claude.test.ts` | `traduzirLote` | Keeps the review's correction and sends the screen of each text; if the review fails, the first translation stays; a translation with different placeholders is rejected; sentence fragments keep the spaces at their ends; without a response from the API, the batch stays untranslated; the tool name travels as a placeholder and comes out unchanged; the language's terms and the quoted labels go to the translation and to the review; a sentence fragment does not gain a full stop | 9 | [RF08](requisitos.md#rf08) | Passed (9 of 9) |
| <a id="ct-u68"></a>CT-U68 | `rodadas.test.ts` | `rodadas da tradução` | A label is short text without sentence punctuation; finds the buttons quoted in a text, with the translation already chosen; prefers the longest label and does not confuse part of a word, lower case or a placeholder; the buttons quoted in the help exist as labels | 4 | [RF08](requisitos.md#rf08) | Passed (4 of 4) |
| <a id="ct-u78"></a>CT-U78 | `nome-da-ferramenta.test.ts` | `nome da ferramenta em cada idioma` | Has a name for each of the 37 languages, all with the acronym UEQ; replaces the name in the translated sentences and in the name itself, and leaves the Portuguese as it is; a sentence without a translation stays entirely in Portuguese, without mixing in the name from another language | 3 | [RF08](requisitos.md#rf08) | Passed (3 of 3) |

### CN25 · Demonstration scenarios

| ID | File | Function or group | Expected result | Runs | Requirements | Result on 18 Nov 2026 |
|---|---|---|---|---|---|---|
| <a id="ct-u61"></a>CT-U61 | `respostas-sinteticas.test.ts` | `respostas sintéticas dos cenários de demonstração` | Gives 26 values from 1 to 7; someone who answered attentively is never flagged as suspicious, while random and identical responses always are; the mean of each scale stays close to the profile; the same seed generates the same responses | 4 | [RF67](requisitos.md#rf67) | Passed (4 of 4) |

## Manual cases

Carried out by people, without automation. Those of CN17 follow the [manual checklist](../checklist-manual.md) and the [review script](../roteiro-revisao.md).

| ID | Scenario | Group | Check | Requirements | Status |
|---|---|---|---|---|---|
| <a id="ct-m01"></a>CT-M01 | CN17 | Screen reader | Full questionnaire from start to finish by listening only (NVDA + Firefox; VoiceOver + Safari or TalkBack + Chrome) | [RNF04](requisitos.md#rnf04) | Not executed |
| <a id="ct-m02"></a>CT-M02 | CN17 | Screen reader | On entering an item, the reader announces the number, the two terms and the position | [RF27](requisitos.md#rf27), [RNF04](requisitos.md#rnf04) | Not executed |
| <a id="ct-m03"></a>CT-M03 | CN17 | Screen reader | The progress is announced without interrupting at every click | [RF28](requisitos.md#rf28), [RNF04](requisitos.md#rnf04) | Not executed |
| <a id="ct-m04"></a>CT-M04 | CN17 | Screen reader | When submitting incomplete, the reader announces the summary and it is possible to go to the missing item | [RF29](requisitos.md#rf29), [RNF04](requisitos.md#rnf04) | Not executed |
| <a id="ct-m05"></a>CT-M05 | CN17 | Screen reader | On the dashboard, the chart is announced with its description and the table can be navigated cell by cell with the header read out | [RNF04](requisitos.md#rnf04), [RNF08](requisitos.md#rnf08) | Not executed |
| <a id="ct-m06"></a>CT-M06 | CN17 | Screen reader | Success messages ("Data collection open") are announced | [RNF04](requisitos.md#rnf04), [RNF20](requisitos.md#rnf20) | Not executed |
| <a id="ct-m07"></a>CT-M07 | CN17 | Keyboard | Create a study, open data collection, answer, view results and export without a mouse; focus always visible and in a logical order | [RNF03](requisitos.md#rnf03) | Not executed |
| <a id="ct-m08"></a>CT-M08 | CN17 | Vision | 200% and 400% zoom: nothing is cut off, nothing overlaps | [RNF02](requisitos.md#rnf02) | Not executed |
| <a id="ct-m09"></a>CT-M09 | CN17 | Vision | Color blindness simulated in DevTools (protanopia, deuteranopia, tritanopia, achromatopsia): the chart remains legible | [RNF07](requisitos.md#rnf07) | Not executed |
| <a id="ct-m10"></a>CT-M10 | CN17 | Vision | Windows high contrast: questionnaire circles and focus visible | [RNF06](requisitos.md#rnf06), [RNF07](requisitos.md#rnf07) | Not executed |
| <a id="ct-m11"></a>CT-M11 | CN17 | Vision | Increased text spacing (WCAG 1.4.12) does not break the layout | [RNF01](requisitos.md#rnf01) | Not executed |
| <a id="ct-m12"></a>CT-M12 | CN17 | Real mobile phone | Open the link via WhatsApp and answer with the thumb, without accidentally touching the neighboring circle; the virtual keyboard does not cover the field in the optional data | [RNF05](requisitos.md#rnf05), [RNF23](requisitos.md#rnf23) | Not executed |
| <a id="ct-m13"></a>CT-M13 | CN17 | Heuristic evaluation | Each member evaluates alone with Nielsen's 10 heuristics (screen, heuristic, severity 0 to 4, suggestion) and then the team consolidates | [RNF01](requisitos.md#rnf01), [RNF20](requisitos.md#rnf20), [RNF21](requisitos.md#rnf21) | Not executed |
| <a id="ct-m14"></a>CT-M14 | CN17 | User testing | 5 participants answer a real study; 2 to 3 researchers create a study with 2 versions, open data collection, interpret the dashboard, remove a suspicious response and export; record success, time, errors and the UEQ of the tool itself | [RF13](requisitos.md#rf13), [RF24](requisitos.md#rf24), [RF43](requisitos.md#rf43) | Not executed |
| <a id="ct-m15"></a>CT-M15 | CN15 | Official spreadsheet | Paste each data/fixtures/**/respostas.csv into the UEQ Data Analysis Tool V15, recalculate and copy the results to esperado.json; open in Excel the spreadsheet exported by the tool and check that it recalculates with the same numbers (data/fixtures/LEIA-ME.md); open the exported one in Protected View, without recalculating, and compare every cell of every sheet with Excel's (scripts/planilha-oficial-celulas.ps1) | [RNF11](requisitos.md#rnf11) | Executed on 17 Nov 2026 with scripts/planilha-oficial.ps1 in Excel 16: 11 scenarios, 6,543 equal values. On 22 Nov 2026, with scripts/planilha-oficial-celulas.ps1: 7 scenarios with responses, the empty study and one in Japanese, 166,051 cells each, no difference; in the UEQ-S, 9 scenarios and the empty one in Chinese, 52,840 cells each, no difference |
| <a id="ct-m16"></a>CT-M16 | CN09 | Script | Change a threshold in data/protocolo.json, run pnpm suspeitas:recalcular and check the suspeita column | [RF55](requisitos.md#rf55) | Not executed |
| <a id="ct-m17"></a>CT-M17 | CN08 | Seed | Run pnpm db:seed with an invalid item in data/ueq-itens-ptbr.json and check that the seed stops saying which item | [RF27](requisitos.md#rf27), [RNF10](requisitos.md#rnf10) | Not executed |
| <a id="ct-m18"></a>CT-M18 | CN17 | Visual review | Compare each screen with the corresponding PNG in docs/prototipos/alta-fidelidade/, following docs/roteiro-revisao.md | [RNF01](requisitos.md#rnf01) | Not executed |
| <a id="ct-m19"></a>CT-M19 | CN17 | Installation | In a clean clone, follow the README's How to run and reach the Log in screen at http://localhost:3000 | [RNF24](requisitos.md#rnf24) | Not executed |
| <a id="ct-m20"></a>CT-M20 | CN17 | Screen reader | The dialogs (Log in, Create account, Log out, delete, Share, help) announce their title on opening, trap the focus and return the focus to whoever opened them | [RNF04](requisitos.md#rnf04), [RNF21](requisitos.md#rnf21) | Not executed |
| <a id="ct-m21"></a>CT-M21 | CN17 | Screen reader | The number of notices in the bell is announced, and it is possible to accept an invitation by listening only | [RF22](requisitos.md#rf22), [RNF04](requisitos.md#rnf04) | Not executed |
| <a id="ct-m22"></a>CT-M22 | CN17 | Screen reader | The guided tour can be understood by listening only, and it can be skipped | [RF09](requisitos.md#rf09), [RNF04](requisitos.md#rnf04) | Not executed |
| <a id="ct-m23"></a>CT-M23 | CN17 | Screen reader | In the privacy policy, "Back" says where it goes, and the link in the access dialogs warns that it opens in a new tab. In real Chrome, Firefox and Safari, "Close this tab and return" closes the tab and returns to the sign-up dialog with what was typed | [RNF04](requisitos.md#rnf04), [RNF19](requisitos.md#rnf19) | Not executed |
| <a id="ct-m24"></a>CT-M24 | CN17 | Real mobile phone | Participant link opened in a study in another language, and in a right-to-left language (Arabic, Hebrew or Persian) | [RF34](requisitos.md#rf34) | Not executed |
| <a id="ct-m25"></a>CT-M25 | CN17 | Real mobile phone | Privacy policy opened from the consent form, on a mobile phone, and "Back" leads back to the consent form | [RF25](requisitos.md#rf25), [RNF19](requisitos.md#rnf19) | Not executed |
| <a id="ct-m26"></a>CT-M26 | CN16 | Official UEQ-S spreadsheet | Paste each data/fixtures-ueq-s/*/respostas.csv into the UEQ-S Data Analysis Tool V15, recalculate and copy the results to esperado.json; open in Excel the UEQ-S spreadsheet exported by the tool and check that it recalculates with the same numbers (data/fixtures-ueq-s/LEIA-ME.md) | [RF62](requisitos.md#rf62), [RNF11](requisitos.md#rnf11) | Executed on 17 Nov 2026 with scripts/planilha-oficial-ueq-s.ps1 in Excel 16: 9 scenarios, 8,520 equal values; the 9 exported files recalculated on their own with zero difference |

## Limitations

- **UEQ-S benchmark.** The limits are those of the official UEQ-S spreadsheet, which still come from the full UEQ. The tests prove that the tool uses the same numbers as the spreadsheet, not that the benchmark represents the short version well; the dashboard warns about this.
- **Manual cases.** Of the 26 manual cases, 24 were not executed, including the user test planned in [HCI Foundations §6](../ihc.md#6-como-verificar-automação-não-basta).
- **Administration.** The Administration pages (accounts, languages, data protection and scenarios) do not yet have an end-to-end case. Only the generation of responses for the scenarios has a test ([CT-U61](#ct-u61)).
- **External services.** The call to the Claude API and the sending of emails are not exercised in the tests: [CT-E67](#ct-e67) saves the translation directly in the database, and [CT-U59](#ct-u59) and [CT-U81](#ct-u81) check the content of the email and the sending with a simulated SMTP server. Real sending is checked in production, with the test email in Administration › Data protection.
- **Dashboard PDF in production.** Cases [CT-E39](#ct-e39) and [CT-E40](#ct-e40) run in the local environment, with Playwright's Chromium. The package used on Vercel is only exercised in production.
- **Official spreadsheet outside Excel.** The exported spreadsheets (UEQ and UEQ-S) were checked in Microsoft Excel 16 for Windows. LibreOffice, Google Sheets and Numbers were not tested: the spreadsheet asks for recalculation on opening, but each program decides whether to comply.
- **Requirements without a test case:** 5 of the 94 requirements have no test case and are checked through the How to verify step of each one. The list, with the reason, is in the [traceability matrix](matriz-rastreabilidade.md#cobertura).
