# Personas

Eight personas represent the people who use the UEQ Tool: three on the researcher side, four on the participant side and one who maintains the installation.

They are fictional. They were built from the user profile and the context of use in [HCI Fundamentals §2](../ihc.md#2-usuários-e-contexto-de-uso-iso-9241-11), which follows ISO 9241-11, and they cover the extremes that most change the design of a screen: someone who has never calculated statistics, someone who only trusts the official spreadsheet, someone who does not read Portuguese, someone who answers on a mobile phone with an enlarged font, someone who uses a screen reader, someone who reads from right to left, someone under 18 and someone who needs to work on the code.

Each persona points to the [user stories](historias-de-usuario.md) written from it. The [traceability matrix](matriz-rastreabilidade.md) links each requirement to the personas that call for it.

| ID | Persona | Role | Main use |
|---|---|---|---|
| [PE01](#pe01) | Marina | Researcher, master's student in HCI | Sets up the study, follows the data collection and interprets the dashboard |
| [PE02](#pe02) | Ricardo | Professor and advisor | Follows his advisees' studies, compares versions and checks the numbers in the official spreadsheet |
| [PE03](#pe03) | Kenji | Visiting researcher, reads Japanese | Uses the tool and runs the study in his own language |
| [PE04](#pe04) | Célia | Participant on a mobile phone | Answers through the link received on WhatsApp |
| [PE05](#pe05) | Tiago | Participant with a screen reader | Answers using only the keyboard and NVDA |
| [PE06](#pe06) | Amira | Participant who reads Arabic | Answers in her own language, from right to left |
| [PE07](#pe07) | Bruna | Underage participant | Takes part in a study at school, with her parents' permission |
| [PE08](#pe08) | Lucas | Developer and administrator of the installation | Installs the tool, adjusts the protocol, manages the accounts and proves that nothing broke |

## Researchers

### PE01

**Marina, 26, master's student in HCI.** Main persona.

- **Context.** She is in the first year of her master's degree and will use the UEQ to evaluate two versions of the appointment app of the university's teaching clinic. She knows UX and has answered questionnaires before, but has never calculated Cronbach's alpha. She uses her laptop, in short sessions between classes, and opens the dashboard several times a day during the data collection.
- **Goals.** Create the study without mistakes, send the link to the patients' WhatsApp group, know how many people have already answered, understand the result and take tables and charts into her dissertation.
- **Frustrations.** Spreadsheets in which one wrong copy and paste ruins everything. Generic forms that do not preserve the order and polarity of the UEQ. Statistics presented without explanation. Having to write the consent form from scratch.
- **What she needs from the tool.** A written interpretation next to each number, a short explanation of the technical terms, warnings that say what to do, a consent form that already asks for what ethics requires and exports that open directly in Excel.

> "I want to know whether the new version is better, not become a statistics expert."

Stories: [HU01](historias-de-usuario.md#hu01), [HU02](historias-de-usuario.md#hu02), [HU03](historias-de-usuario.md#hu03), [HU04](historias-de-usuario.md#hu04), [HU05](historias-de-usuario.md#hu05), [HU06](historias-de-usuario.md#hu06), [HU07](historias-de-usuario.md#hu07), [HU08](historias-de-usuario.md#hu08), [HU09](historias-de-usuario.md#hu09), [HU10](historias-de-usuario.md#hu10), [HU11](historias-de-usuario.md#hu11), [HU12](historias-de-usuario.md#hu12), [HU13](historias-de-usuario.md#hu13), [HU14](historias-de-usuario.md#hu14), [HU15](historias-de-usuario.md#hu15), [HU16](historias-de-usuario.md#hu16), [HU17](historias-de-usuario.md#hu17).

### PE02

**Ricardo, 48, professor and advisor.**

- **Context.** He advises four students who use the UEQ, Marina among them. He knows the handbook and the UEQ Data Analysis Tool and trusts them. He works on the lab's shared computers. Sometimes he has responses collected on paper, at events with little time for each person.
- **Goals.** Follow each advisee's study without asking for screenshots, compare versions of a product, check that the numbers match the official spreadsheet before signing a paper and combine paper responses with those from the link.
- **Frustrations.** Tools that calculate "their own way" without stating the rule. Having to redo filters to discuss a result. Leaving the session open on a shared computer.
- **What he needs from the tool.** Read access to the student's study, export in the exact format of the official spreadsheet, visible rules for suspicion and calculation, an address that keeps the dashboard view, import with a preview and a password change that ends the other sessions.

> "If it does not match the official spreadsheet, it does not go into the paper."

Stories: [HU18](historias-de-usuario.md#hu18), [HU19](historias-de-usuario.md#hu19), [HU20](historias-de-usuario.md#hu20), [HU21](historias-de-usuario.md#hu21), [HU22](historias-de-usuario.md#hu22), [HU23](historias-de-usuario.md#hu23), [HU24](historias-de-usuario.md#hu24), [HU25](historias-de-usuario.md#hu25).

### PE03

**Kenji, 35, visiting researcher from a Japanese university.**

- **Context.** He is spending a semester in Ricardo's lab. He reads Portuguese slowly and works better in Japanese. He will run the UEQ in a study with participants in Japan, about a transport app.
- **Goals.** Use the tool in his own language and set up a study whose link opens in Japanese, with the official UEQ terms.
- **Frustrations.** An interface that only exists in English or Portuguese. A translation that changes the names of the buttons from one screen to the next.
- **What he needs from the tool.** A language selector always in sight, a consistent translation of the interface, a study written in his language and the title translated for those who answer in another language.

> "I understand the statistics. I just need to read the screen."

Stories: [HU26](historias-de-usuario.md#hu26), [HU27](historias-de-usuario.md#hu27).

## Participants

### PE04

**Célia, 63, retired, a patient of the teaching clinic.**

- **Context.** She receives the link on WhatsApp and opens it on her mobile phone, with the system font enlarged. She uses her phone for messages and banking, but is wary of forms. She has no account in the tool and no obligation to answer.
- **Goals.** Quickly understand what it is about and who is asking, answer in a few minutes and get back to what she was doing.
- **Frustrations.** Small buttons, questions that disappear when the page reloads, a form that does not say what is missing, requests for personal data.
- **What she needs from the tool.** A short, clear consent form that says who is responsible for the study; large touch targets; visible progress; a warning about a forgotten item with a direct link; the option to give up and to skip the questions about herself.

> "If I do not understand it in a minute, I close it."

Stories: [HU28](historias-de-usuario.md#hu28), [HU29](historias-de-usuario.md#hu29), [HU30](historias-de-usuario.md#hu30), [HU31](historias-de-usuario.md#hu31), [HU32](historias-de-usuario.md#hu32), [HU33](historias-de-usuario.md#hu33), [HU34](historias-de-usuario.md#hu34).

### PE05

**Tiago, 29, systems analyst, blind.**

- **Context.** He uses Windows with NVDA and navigates with the keyboard only. He often answers UX surveys and has abandoned many of them because the buttons were `div` elements without a name.
- **Goals.** Answer with the same precision as a sighted person, knowing for each circle its position and which pole it is close to.
- **Frustrations.** A scale without labels ("button, button, button"), a progress announcement on every click, focus that jumps on its own, an error shown only in red.
- **What he needs from the tool.** Each item as a group with a legend, native radio buttons with an accessible name ("3 of 7, closer to easy"), progress announced without interrupting, an error summary that receives the focus.

> "If the screen reader only says 'radio button, 3 of 7', I do not know what I am answering."

Stories: [HU35](historias-de-usuario.md#hu35).

### PE06

**Amira, 34, exchange student, reads Arabic.**

- **Context.** She is spending a semester in Brazil and speaks little Portuguese. Her phone's browser is set to Arabic. She takes part in a study by a lab colleague.
- **Goals.** Answer in her own language, with the terms the UEQ validated in Arabic.
- **Frustrations.** Machine translation that changes the meaning of a term. A page in Arabic with the scale reversed.
- **What she needs from the tool.** The language chosen from the browser, text from right to left with the scale in the official order, an honest notice that the Arabic translation has not been approved by the UEQ authors.

> "I answer better when I read in my own language."

Stories: [HU36](historias-de-usuario.md#hu36).

### PE07

**Bruna, 16, high school student.**

- **Context.** Her school takes part in a study about the homework platform the students use. She answers on her phone, during the break, with the link her teacher sent.
- **Goals.** Take part like her classmates, without complications.
- **Frustrations.** A form that gets stuck without explaining why.
- **What she needs from the tool.** A consent form that asks for her age before starting and states clearly that anyone under 18 needs the permission of a parent or guardian, without saving anything before that.

> "My parents have already signed the school's permission form. Where do I confirm that?"

Stories: [HU37](historias-de-usuario.md#hu37).

## Who maintains the tool

### PE08

**Lucas, 31, developer and software engineering researcher.**

- **Context.** He found the repository because his group also uses the UEQ. He knows TypeScript and Next.js. He installed the tool for the lab and is the administrator of the installation: he creates the students' accounts and presents the tool in classes.
- **Goals.** Get the tool running locally in minutes, understand the architecture, change a threshold without hunting for a number in the code, prove that he did not break the calculation and know whether the installation is ready for a real study.
- **Frustrations.** An academic project without installation instructions, business rules scattered across the interface, tests that do not exist, documentation that does not say which code implements what.
- **What he needs from the tool.** A README with step-by-step instructions, protocol parameters in JSON with their source, calculation isolated in pure functions with tests, an administration page that shows the state of the installation without giving access to other people's studies, and documentation that links requirements to code.

> "Before I change anything, I need to know what this line guarantees."

Stories: [HU38](historias-de-usuario.md#hu38), [HU39](historias-de-usuario.md#hu39), [HU40](historias-de-usuario.md#hu40), [HU41](historias-de-usuario.md#hu41), [HU42](historias-de-usuario.md#hu42), [HU43](historias-de-usuario.md#hu43), [HU44](historias-de-usuario.md#hu44).
