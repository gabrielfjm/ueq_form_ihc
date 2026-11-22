# UEQ Tool Documentation

The UEQ Tool is an open-source web application for running user experience studies with the *User Experience Questionnaire* (UEQ), from registering the study to exporting the data. This documentation describes what the tool does, for whom, how it was built and how we know it works.

Everything is in open formats and displays directly on GitHub: Markdown, CSV and Mermaid diagrams, with the source file of each diagram in [`fontes/`](fontes/). The requirements spreadsheet is also available as `.xlsx`, to open in Excel or LibreOffice. The same files appear inside the tool, in the **Documentation** tab, open to anyone, without logging in.

The code and this documentation are under the [MIT license](../../LICENSE). The official UEQ material in `data/` belongs to the authors of the questionnaire (see the License section of the [README](../../README.md#licença)).

Project for the course Fundamentals of Human-Computer Interaction, PPGIa · PUCPR · 2026. Team: Gabriel Felipe Jess Meira, Jean Pscheidt Weiss and Luiza Fonseca Pedralli.

## Contents

| Section | Document | What it contains |
|---|---|---|
| Requirements | [Requirements](requisitos.md) | The 68 functional and 26 non-functional requirements, with priority, delivery sprint, status and how to verify them. Also in [requisitos.csv](requisitos.csv) |
| Requirements | [Traceability matrix](matriz-rastreabilidade.md) | Each requirement linked to user stories, use cases, personas, test cases, sprint and code. Also in [matriz-rastreabilidade.csv](matriz-rastreabilidade.csv) |
| Requirements | [Requirements spreadsheet](planilha-requisitos.xlsx) | Requirements, sprints, user stories, use cases, matrix, scenarios and test cases, one sheet for each, with filters |
| Users | [Personas](personas.md) | Eight personas: three researchers, four participants and one person who maintains the installation |
| Users | [User stories](historias-de-usuario.md) | 44 user stories with acceptance criteria. Also in [historias-de-usuario.csv](historias-de-usuario.csv) |
| Modeling | [Use cases](casos-de-uso.md) | Four UML diagrams, the list of the 33 use cases and the specification of the main ones |
| Modeling | [Class diagram](diagrama-de-classes.md) | The domain model and the UEQ calculation module |
| Modeling | [Logical data model](modelo-logico.md) | The 11 PostgreSQL tables, with columns, keys and what each deletion takes with it |
| Modeling | [Sequence diagrams](diagramas-de-sequencia.md) | Eight flows from the click to the database: logging in, answering, viewing results, removing from the analysis, PDF, importing, inviting and translating |
| Architecture | [Architecture](arquitetura.md) | C4 model (context, containers and components), security, decisions and deployment |
| Tests | [Test cases and scenarios](casos-de-teste.md) | Strategy, 25 scenarios and 206 cases (end-to-end, unit and manual), with the requirements each one verifies and the result of the latest run. Also in [casos-de-teste.csv](casos-de-teste.csv) |
| Tests | [Calculation verification](verificacao-do-calculo.md) | The tool's calculation redone by hand with the example study and compared with the official UEQ spreadsheet in 11 scenarios and with the UEQ-S one in 9: means, standard deviation, CI95, alpha, benchmark, suspicious responses and exports |
| Tests | [Manual checklist](../checklist-manual.md) | What the team checks by hand: screen reader, zoom, real mobile phone, color blindness |
| Tests | [Review script](../roteiro-revisao.md) | What to open, what to do on each screen and how to record the problems |
| Specification | [UEQ protocol](../ueq-protocolo.md) | Items, scales, polarity and all the calculation formulas, checked against the handbook and the official spreadsheet |
| Specification | [HCI foundations](../ihc.md) | Usability and accessibility requirements, each one linked to the principle from the literature that justifies it |
| Specification | [Interface decisions](../rastreabilidade-ihc.md) | Each interface decision, its principle, the code and the test that proves it |
| Specification | [Languages](../idiomas.md) | The 37 languages of the questionnaire, where each text comes from and the corrections to the official terms |
| Specification | [Visual identity](../design.md) | Colors, typography, layout, icons and tone of voice |
| Specification | [Code conventions](../codigo.md) | Names, comments, structure, tests and commits |

## Where to start

- **Going to use the tool in a study?** Read the researcher [personas](personas.md), the use case [Answer the questionnaire](casos-de-uso.md#uc14) to see what the participant will go through, and the [UEQ protocol](../ueq-protocolo.md) to learn how each number is calculated.
- **Going to evaluate the project?** Start with the [requirements](requisitos.md), the [traceability matrix](matriz-rastreabilidade.md) and the [test cases](casos-de-teste.md). The [calculation verification](verificacao-do-calculo.md) shows the calculation redone by hand, and the [interface decisions](../rastreabilidade-ihc.md) link each screen to an HCI principle.
- **Going to contribute code?** Read the [architecture](arquitetura.md), the [class diagram](diagrama-de-classes.md), the [logical data model](modelo-logico.md), the [test strategy](casos-de-teste.md#estratégia) and the [code conventions](../codigo.md). Before changing a behavior, look up the file in the [matrix](matriz-rastreabilidade.md) to see which requirement and which test depend on it.

## Identifiers

| Prefix | What it identifies | Example |
|---|---|---|
| RF | Functional requirement | [RF27](requisitos.md#rf27) Answer the 26 items |
| RNF | Non-functional requirement | [RNF01](requisitos.md#rnf01) WCAG 2.2 AA |
| PE | Persona | [PE04](personas.md#pe04) Célia |
| HU | User story | [HU35](historias-de-usuario.md#hu35) Answer with a screen reader |
| UC | Use case | [UC14](casos-de-uso.md#uc14) Answer the questionnaire |
| CN | Test scenario | [CN06](casos-de-teste.md#cn06) Accessibility of the questionnaire |
| CT-E, CT-U, CT-M | End-to-end, unit or manual test case | [CT-E22](casos-de-teste.md#ct-e22) Complete flow using only the keyboard |

The identifiers are fixed: an item that is removed keeps its number reserved, because the other documents cite items by number.

## Status on 17 Nov 2026

- **Requirements:** all 94 are delivered. The last one was [RF62](requisitos.md#rf62), Apply the UEQ-S, on 18 Nov 2026.
- **Automated tests:** the results of the latest run are in [test cases](casos-de-teste.md#execução-de-17112026).
- **Calculation:** the [calculation verification](verificacao-do-calculo.md) redid by hand all the statistics of the example study, and the 336 numbers matched the tool. In the comparison with the official spreadsheet itself, the 11 test scenarios match in all 6,543 values, and the 9 UEQ-S scenarios match in the 8,520 values of its own official spreadsheet. The spreadsheets the tool exports recalculate in Excel with the same numbers.
- **In production:** https://ferramenta-ueq.vercel.app.

## How to maintain

When a pull request changes the behavior of the tool:

1. Update the requirement in [requisitos.md](requisitos.md), in [requisitos.csv](requisitos.csv) and in the [spreadsheet](planilha-requisitos.xlsx). A new requirement gets the next free number; a withdrawn requirement keeps the status Removed.
2. Link the requirement to at least one user story and one use case, and update the [matrix](matriz-rastreabilidade.md) with the file and the test.
3. A new test becomes a case in [casos-de-teste.md](casos-de-teste.md) and in the CSV: the title of the `test(...)` or `it(...)` is the expected result, and the case cites the requirements it verifies.
4. If you change a Mermaid diagram, run `pnpm docs:diagramas` to generate the SVG that the Documentation tab shows and the source file in `fontes/`. A unit test fails if you forget. Below each diagram, update the version of the tool that it represents.
5. A new document goes into the catalog in `src/lib/documentacao/catalogo.ts`, in its section and in the `PRONTOS` list.

The formats of the same content (Markdown, CSV and XLSX) change together.
