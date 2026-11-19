# Requirements

The UEQ Tool has **68 functional requirements** (RF), what it does, and **26 non-functional requirements** (RNF), how it has to be. All 94 are delivered. The same list is in [requisitos.csv](requisitos.csv) and in the [requirements spreadsheet](planilha-requisitos.xlsx).

Updated on 17 Nov 2026.

## How to read

Each requirement has a fixed ID. Once created, the ID does not change: if a requirement is dropped, it keeps the status Removed, because the use cases and the test cases cite the requirements by number.

**Priority**

- **Essential:** without it, the tool does not meet the five requirements of the course (create and manage studies, apply the instrument, calculate according to the protocol, analyze and visualize, export) or is not accessible.
- **Important:** improves the quality of use, security or confidence in the results, but the tool works without it.
- **Desirable:** an extension beyond the mandatory scope of the proposal.

**Status**

- **Delivered:** it is on `main` and can be checked in the tool.
- **Pending:** some part is still missing.
- **Removed:** it left the scope. The ID remains reserved.

**Sprint** is the sprint in which the requirement was delivered (table below). Each sprint is one or more pull requests merged into `main`.

**How to verify** cites the [test cases](casos-de-teste.md) that prove the requirement, when they exist, and says what to do in the tool to check it. To run the tool, use the test account `pesquisador@exemplo.com` (password `senha-de-teste`) and the Example study.

### Sprints

| Sprint | PR | Date | What it delivered |
|---|---|---|---|
| Sprint 00 · Setup | #1 | 22 Oct 2026 | Project skeleton with Next, Prisma and tests |
| Sprint 01 · Database and seed | #5 | 23 Oct 2026 | Database model and the 26 UEQ items in the seed |
| Sprint 02 · Calculation | #6 | 23 Oct 2026 | UEQ calculation module |
| Sprint 03 · Authentication | #7 | 23 Oct 2026 | Sign-up, login and My account |
| Sprint 04 · Studies | #8 | 23 Oct 2026 | Study list, study form and study page |
| Sprint 05 · Questionnaire | #9 | 23 Oct 2026 | Participant questionnaire |
| Sprint 06 · Results | #10 | 23 Oct 2026 | Results dashboard and comparison between versions |
| Sprint 07 · Suspicious responses | #11 | 29 Oct 2026 | Responses page and handling of suspicious responses |
| Sprint 08 · Export | #12 | 29 Oct 2026 | CSV exports |
| Languages sprint | #13 | 29 Oct 2026 | Questionnaire in the 37 UEQ languages |
| Sprint 10 · Extensions | #14 | 30 Oct 2026 | CSV import, dashboard as PDF, UEQ-S structure |
| Documentation sprint | #15, #16 | 30 Oct 2026 | Documentation tab, MIT license, fixed bar, full-screen diagrams |
| Home page and dialogs | #17 | 30 Oct 2026 | Home page, Log in in a dialog, confirmation for logging out and deleting, icon |
| Deployment | #18, #19, #20 | 30 and 31 Oct 2026 | Updated test cases and publication on Vercel, with migrations and seed in the build |
| Team and help | #21 | 1 Nov 2026 | Team studies, notifications, guided tour, help on each page, optional demographic data collection and Administration |
| LGPD | #22, #23 | 1 Nov 2026 | Encryption, privacy policy, Download my data, login attempt limit, security headers and participant profile |
| Tool languages | #24 to #27 | 2 Nov 2026 | Tool in the 37 languages, study language, translation of the study texts and new home page |
| Participant and emails | #28, #29 | 3 Nov 2026 | More welcoming participant screens and emails with the visual identity |
| Privacy and paged documentation | #30 to #34 | 6 Nov 2026 | Policy in the tool's standard, architecture and test documents, documentation in pages and confirmation of every action |
| Translation quality | #35 to #39 | 6 and 7 Nov 2026 | Interface translation with glossary, screen context and automatic review |
| Consent form | #40, #41 | 17 Nov 2026 | Complete consent form, participants under 18, language selector in the bar and Next.js 16.4.6 |
| Final documentation | #42, #43 | 17 Nov 2026 | Requirements, traceability matrix, personas, user stories, use cases, class diagram and calculation verification |
| Sprint 09 · Final review | #44 | 17 Nov 2026 | Check against the official spreadsheet in 11 scenarios and export into the UEQ Data Analysis Tool itself |
| UEQ-S | #45 | 18 Nov 2026 | The UEQ-S as the study questionnaire, the UEQ-S tab in the results, the UEQ or UEQ-S comparison on the home page and the check against the official UEQ-S spreadsheet in 9 scenarios |

## Functional requirements

### Access and account

| ID | Requirement | Description | Priority | Sprint | Status | How to verify |
|---|---|---|---|---|---|---|
| <a id="rf01"></a>RF01 | **Create an account** | The researcher creates an account with name, email and password, and sees the password rules before typing. | Essential | Sprint 03 · Authentication | Delivered | [CT-E03](casos-de-teste.md#ct-e03), [CT-E06](casos-de-teste.md#ct-e06), [CT-E07](casos-de-teste.md#ct-e07). On the home page, click Create account and sign up, leaving a field empty on the first attempt. |
| <a id="rf02"></a>RF02 | **Log in and log out** | The researcher logs in with email and password and logs out of the session, which asks for confirmation in a dialog. | Essential | Sprint 03 · Authentication | Delivered | [CT-E03](casos-de-teste.md#ct-e03), [CT-E08](casos-de-teste.md#ct-e08), [CT-E58](casos-de-teste.md#ct-e58). Log in with the test account, first with a wrong password; then click Log out. |
| <a id="rf03"></a>RF03 | **Protect the researcher area** | Anyone who opens a researcher page without a session goes to Log in and, after logging in, returns to the page they requested. | Essential | Sprint 03 · Authentication | Delivered | [CT-E04](casos-de-teste.md#ct-e04). Without being logged in, open http://localhost:3000/estudos. |
| <a id="rf04"></a>RF04 | **Edit account data** | The researcher changes name and email in My account; an email that already belongs to another account is rejected. | Important | Sprint 03 · Authentication | Delivered | [CT-E09](casos-de-teste.md#ct-e09). My account › Personal data: change the name and save. |
| <a id="rf05"></a>RF05 | **Change the password** | The researcher changes the password by entering the current one, and the change ends the sessions open in other browsers. | Important | Sprint 03 · Authentication | Delivered | [CT-E10](casos-de-teste.md#ct-e10). My account › Password. |
| <a id="rf06"></a>RF06 | **Delete the account** | The researcher deletes the account by typing the email, and the deletion also erases their studies and responses. | Important | Sprint 03 · Authentication | Delivered | [CT-E11](casos-de-teste.md#ct-e11). My account › Delete account, with an account created only for the test. |
| <a id="rf07"></a>RF07 | **Download my data** | In My account, the researcher downloads a JSON file with everything the tool stores about their account. | Important | LGPD | Delivered | [CT-E81](casos-de-teste.md#ct-e81). My account › Download my data: the .json file downloads and contains the account data. |
| <a id="rf08"></a>RF08 | **Choose the tool language** | The researcher chooses the interface language when creating the account and changes it in My account › Language or with the language selector in the bar, among the 37 UEQ languages; without an account, the selector in the bar also changes the language. | Desirable | Tool languages | Delivered | [CT-E94](casos-de-teste.md#ct-e94), [CT-E95](casos-de-teste.md#ct-e95). Click PT in the bar, choose another language and check the translated menu; the same applies in My account › Language. |
| <a id="rf09"></a>RF09 | **Guided tour on first access** | Anyone logging in for the first time takes a tour through the actions themselves, and can skip it, close it or review the tour later from the help. | Desirable | Team and help | Delivered | [CT-E66](casos-de-teste.md#ct-e66), [CT-M22](casos-de-teste.md#ct-m22). Create a new account and log in: the tour starts on its own. |
| <a id="rf10"></a>RF10 | **Help on every page** | Every researcher page has a help button (?) in the header, which explains that page. | Desirable | Team and help | Delivered | [CT-E65](casos-de-teste.md#ct-e65). On any researcher page, click (?). |
| <a id="rf11"></a>RF11 | **Home page** | The home page explains the UEQ (scales, how to read the results and benchmark) and gives the credits; Log in and Create account open in a dialog over it. | Important | Home page and dialogs | Delivered | [CT-E01](casos-de-teste.md#ct-e01), [CT-E58](casos-de-teste.md#ct-e58), [CT-E59](casos-de-teste.md#ct-e59), [CT-E60](casos-de-teste.md#ct-e60). Open http://localhost:3000 without being logged in and click Log in. |

### Studies

| ID | Requirement | Description | Priority | Sprint | Status | How to verify |
|---|---|---|---|---|---|---|
| <a id="rf12"></a>RF12 | **List the studies** | The researcher sees their studies in a table with title, product, status, versions, responses and last response, sorted by last update. | Essential | Sprint 04 · Studies | Delivered | [CT-E12](casos-de-teste.md#ct-e12), [CT-E17](casos-de-teste.md#ct-e17). Studies menu. |
| <a id="rf13"></a>RF13 | **Create a study** | The researcher creates a study with title, evaluated product, objective, data collection period and one or more versions of the product, and states who is responsible for the research (name, contact email and institution), the risks and benefits for the participant and, if there is one, the ethics committee; the product name suggests the name of the first version. | Essential | Sprint 04 · Studies | Delivered | [CT-E13](casos-de-teste.md#ct-e13), [CT-E14](casos-de-teste.md#ct-e14), [CT-E93](casos-de-teste.md#ct-e93). Create study: create a study with 2 versions. |
| <a id="rf14"></a>RF14 | **Edit a study** | The researcher edits the data and the versions of the study; while data collection is open, a version that already has responses cannot be removed. | Essential | Sprint 04 · Studies | Delivered | [CT-E18](casos-de-teste.md#ct-e18). Study page › Edit. |
| <a id="rf15"></a>RF15 | **Open, close and reopen data collection** | The researcher opens, closes and reopens data collection; the link only accepts responses while data collection is open and, in the other cases, shows a notice. | Essential | Sprint 04 · Studies | Delivered | [CT-E15](casos-de-teste.md#ct-e15). Study page: Open data collection, Close data collection and Reopen data collection, opening the link at each step. |
| <a id="rf16"></a>RF16 | **Copy the public link** | Each study has a short, non-sequential public link, which the researcher copies with a button. | Essential | Sprint 04 · Studies | Delivered | [CT-E16](casos-de-teste.md#ct-e16). Study page › Copy link. |
| <a id="rf17"></a>RF17 | **Delete a study** | The researcher deletes a study by typing the title; the warning says how many responses go with it, and versions, participations and responses are erased. | Essential | Sprint 04 · Studies | Delivered | [CT-E19](casos-de-teste.md#ct-e19). Study page › Delete study. |
| <a id="rf18"></a>RF18 | **Turn on demographic data collection** | The researcher decides, for each study, whether the link shows the demographic data step; it is off by default. | Important | Team and help | Delivered | [CT-E71](casos-de-teste.md#ct-e71). Create study: turn on demographic data and open the link: the Optional data step appears. |
| <a id="rf19"></a>RF19 | **Choose the study language** | The researcher chooses the language in which the study is written and in which the link opens; new studies start in the account language. | Desirable | Tool languages | Delivered | [CT-E45](casos-de-teste.md#ct-e45). Create study: change the language and open the link. |

### Team and notifications

| ID | Requirement | Description | Priority | Sprint | Status | How to verify |
|---|---|---|---|---|---|---|
| <a id="rf20"></a>RF20 | **Share a study** | The owner invites a registered account, by email, as Editor (works on the study) or Viewer (views and exports); only the owner invites people and deletes the study. | Desirable | Team and help | Delivered | [CT-E63](casos-de-teste.md#ct-e63). Study page › Share: invite another team member's account as Viewer. |
| <a id="rf21"></a>RF21 | **Accept or decline an invitation** | The invited person accepts or declines the invitation, and the study only appears in their list after it is accepted. | Desirable | Team and help | Delivered | [CT-E63](casos-de-teste.md#ct-e63). With the invited account, open the bell and accept the invitation. |
| <a id="rf22"></a>RF22 | **Notifications bell** | The bell gives notice of invitations, new responses (grouped while unread) and changes made by the partners. | Desirable | Team and help | Delivered | [CT-E63](casos-de-teste.md#ct-e63), [CT-E64](casos-de-teste.md#ct-e64), [CT-M21](casos-de-teste.md#ct-m21). Answer the link of one of your studies and open the bell. |
| <a id="rf23"></a>RF23 | **Email notifications** | Each notification is also sent by email, in the recipient's language, when sending is configured; the researcher turns it off in My account. | Desirable | Team and help | Delivered | [CT-U59](casos-de-teste.md#ct-u59). My account › Email notifications (sending depends on the SMTP variables in .env). |

### Participant questionnaire

| ID | Requirement | Description | Priority | Sprint | Status | How to verify |
|---|---|---|---|---|---|---|
| <a id="rf24"></a>RF24 | **Answer without an account** | The participant answers through the public link, without an account or login, and finds no path to the researcher area. | Essential | Sprint 05 · Questionnaire | Delivered | [CT-E05](casos-de-teste.md#ct-e05), [CT-E52](casos-de-teste.md#ct-e52). Open http://localhost:3000/r/exemplo in a private window. |
| <a id="rf25"></a>RF25 | **Consent** | The participant reads the consent form (objective, estimated time, what happens after submitting, risks, benefits, data storage and who is responsible for the research), enters their age and only takes part after clicking I agree; anyone under 18 confirms the authorization of their parent or guardian, I do not want to take part leaves without saving anything, and a copy of the consent form can be printed or saved as PDF. | Essential | Sprint 05 · Questionnaire | Delivered | [CT-E21](casos-de-teste.md#ct-e21), [CT-E28](casos-de-teste.md#ct-e28), [CT-E91](casos-de-teste.md#ct-e91), [CT-E92](casos-de-teste.md#ct-e92). Open the link of the example study. |
| <a id="rf26"></a>RF26 | **Distribute participants among the versions** | With more than one version, each participant goes to the version with the fewest completed responses; in a tie, to the one with the lowest order. | Essential | Sprint 05 · Questionnaire | Delivered | [CT-U30](casos-de-teste.md#ct-u30). Answer the link twice (in private windows) in a study with 2 versions and check the Responses tab. |
| <a id="rf27"></a>RF27 | **Answer the 26 items** | The participant answers the 26 items in the official order and polarity, with the official instruction and 7 positions per item, none selected at the start. | Essential | Sprint 05 · Questionnaire | Delivered | [CT-E21](casos-de-teste.md#ct-e21), [CT-E24](casos-de-teste.md#ct-e24). I agree and want to take part: check the 26 items. |
| <a id="rf28"></a>RF28 | **Follow the progress** | A fixed footer shows how many of the 26 items have already been answered. | Important | Sprint 05 · Questionnaire | Delivered | [CT-E22](casos-de-teste.md#ct-e22), [CT-M03](casos-de-teste.md#ct-m03). Mark a few items and look at the footer. |
| <a id="rf29"></a>RF29 | **Point out the missing items** | When submitting with blank items, a summary at the top says which ones are missing, with a link to each, and nothing is saved. | Essential | Sprint 05 · Questionnaire | Delivered | [CT-E23](casos-de-teste.md#ct-e23). Submit leaving 2 items blank and use the links in the summary. |
| <a id="rf30"></a>RF30 | **Recover the marked responses** | If the page reloads, the responses already marked come back and a notice says so. | Important | Sprint 05 · Questionnaire | Delivered | [CT-E26](casos-de-teste.md#ct-e26). Mark a few items and reload the page. |
| <a id="rf31"></a>RF31 | **Leave without sending** | The participant leaves at any time through Leave without sending, which asks for confirmation in a dialog and saves nothing. | Essential | Sprint 05 · Questionnaire | Delivered | [CT-E27](casos-de-teste.md#ct-e27). In the questionnaire, click Leave without sending. |
| <a id="rf32"></a>RF32 | **Optional demographic data** | When the study collects it, the participant answers age group, gender, education level and familiarity in closed ranges, all with Prefer not to say, and can skip the whole step. | Important | Sprint 05 · Questionnaire | Delivered | [CT-E21](casos-de-teste.md#ct-e21). In a study with demographic data turned on, answer one question and skip the others. |
| <a id="rf33"></a>RF33 | **Finish and not answer again** | After submitting, the participant sees the thank-you message, and the same browser does not send another response to the study. | Essential | Sprint 05 · Questionnaire | Delivered | [CT-E21](casos-de-teste.md#ct-e21), [CT-E28](casos-de-teste.md#ct-e28). Finish the questionnaire and open the link again in the same browser. |
| <a id="rf34"></a>RF34 | **Answer in 37 languages** | The link opens in the language of the study or of the browser, the participant switches among the 37 official UEQ languages in the selector, and right-to-left languages mirror the page. | Important | Languages sprint | Delivered | [CT-E45](casos-de-teste.md#ct-e45), [CT-E46](casos-de-teste.md#ct-e46), [CT-U45](casos-de-teste.md#ct-u45), [CT-U50](casos-de-teste.md#ct-u50). On the consent step, switch the language to Arabic or Japanese and answer. |
| <a id="rf35"></a>RF35 | **Translate the study texts** | Title, product and objective written by the researcher appear translated into the participant's language. | Desirable | Tool languages | Delivered | [CT-U63](casos-de-teste.md#ct-u63). Open the link in another language and check the title and the objective (depends on ANTHROPIC_API_KEY in .env). |

### UEQ calculation

| ID | Requirement | Description | Priority | Sprint | Status | How to verify |
|---|---|---|---|---|---|---|
| <a id="rf36"></a>RF36 | **Recode the responses** | The tool converts each response from 1 to 7 into -3 to +3, according to the polarity of the item. | Essential | Sprint 02 · Calculation | Delivered | [CT-U01](casos-de-teste.md#ct-u01), [CT-U02](casos-de-teste.md#ct-u02), [CT-U03](casos-de-teste.md#ct-u03), [CT-U04](casos-de-teste.md#ct-u04), [CT-U05](casos-de-teste.md#ct-u05). Results › Export › Coded responses. |
| <a id="rf37"></a>RF37 | **Statistics per scale** | For each scale and version, the tool calculates n, mean, sample standard deviation, 95% confidence interval and standardized Cronbach's alpha. | Essential | Sprint 02 · Calculation | Delivered | [CT-U07](casos-de-teste.md#ct-u07), [CT-U08](casos-de-teste.md#ct-u08), [CT-U09](casos-de-teste.md#ct-u09), [CT-U10](casos-de-teste.md#ct-u10), [CT-U11](casos-de-teste.md#ct-u11), [CT-U14](casos-de-teste.md#ct-u14). Results tab, scales table. |
| <a id="rf38"></a>RF38 | **Interpret the means** | Each mean is read as positive (above +0.8), neutral (from -0.8 to +0.8) or negative (below -0.8). | Essential | Sprint 02 · Calculation | Delivered | [CT-U13](casos-de-teste.md#ct-u13). Results tab, Interpretation column. |
| <a id="rf39"></a>RF39 | **Pragmatic and hedonic quality** | The tool calculates the pragmatic quality (mean of Perspicuity, Efficiency and Dependability) and the hedonic quality (mean of Stimulation and Novelty). | Essential | Sprint 02 · Calculation | Delivered | [CT-U20](casos-de-teste.md#ct-u20). Results tab, row below the scales table. |
| <a id="rf40"></a>RF40 | **Classify in the benchmark** | Each mean is classified into the 5 ranges of the official benchmark (excellent, good, above the mean, below the mean, bad); a mean equal to a limit falls into the lower range. | Essential | Sprint 02 · Calculation | Delivered | [CT-U16](casos-de-teste.md#ct-u16), [CT-U17](casos-de-teste.md#ct-u17). Results tab, Benchmark column. |
| <a id="rf41"></a>RF41 | **Mean per item** | The tool calculates the recoded mean and the distribution from 1 to 7 of each of the 26 items. | Important | Sprint 02 · Calculation | Delivered | [CT-U15](casos-de-teste.md#ct-u15). Results tab, Means per item chart. |
| <a id="rf42"></a>RF42 | **Calculate only with those in the analysis** | The statistics use only the participations included in the analysis. | Essential | Sprint 02 · Calculation | Delivered | [CT-U18](casos-de-teste.md#ct-u18), [CT-U22](casos-de-teste.md#ct-u22). Remove a response from the analysis in the Responses tab and watch n change in Results. |

### Results

| ID | Requirement | Description | Priority | Sprint | Status | How to verify |
|---|---|---|---|---|---|---|
| <a id="rf43"></a>RF43 | **Results dashboard** | The researcher sees a summary of the data collection, the chart of the 6 scales with CI95 and benchmark ranges, and the table with the same numbers. | Essential | Sprint 06 · Results | Delivered | [CT-E29](casos-de-teste.md#ct-e29). Example study › Results tab. |
| <a id="rf44"></a>RF44 | **Quick reading** | A sentence at the top of the dashboard summarizes the result: the scales by benchmark range and the negative ones. | Important | Sprint 06 · Results | Delivered | [CT-U42](casos-de-teste.md#ct-u42). Results tab, sentence at the top. |
| <a id="rf45"></a>RF45 | **Warnings for low alpha and small sample** | The dashboard warns when alpha falls below 0.7 and when the sample does not allow a confidence interval, saying what this means and what to do. | Important | Sprint 06 · Results | Delivered | [CT-U21](casos-de-teste.md#ct-u21), [CT-E30](casos-de-teste.md#ct-e30). Create a study with a single response and open Results. |
| <a id="rf46"></a>RF46 | **Chart per item** | The researcher sees the mean of each item between its two terms, in the official order or grouped by scale. | Important | Sprint 06 · Results | Delivered | [CT-E29](casos-de-teste.md#ct-e29). Results tab › Means per item: switch the order. |
| <a id="rf47"></a>RF47 | **Compare versions** | With more than one version, the researcher compares the versions side by side in the same chart, with markers of different shapes and a reading of the largest differences. | Essential | Sprint 06 · Results | Delivered | [CT-E29](casos-de-teste.md#ct-e29), [CT-U43](casos-de-teste.md#ct-u43). Results tab › Compare versions. |
| <a id="rf48"></a>RF48 | **Keep the view in the address** | The chosen version and the mode (one version or comparison) stay in the page address, so that you can go back, reload and share. | Important | Sprint 06 · Results | Delivered | [CT-E29](casos-de-teste.md#ct-e29). Choose Compare versions and reload the page. |
| <a id="rf49"></a>RF49 | **Explain the terms** | Each technical term (scales, CI95, Cronbach's alpha, benchmark) has a short explanation that opens near where it appears. | Important | Sprint 06 · Results | Delivered | Results tab: open What is Perspicuity? |
| <a id="rf50"></a>RF50 | **View the demographic data** | When the study collects it, a tab shows each demographic question in a chart with the table of the numbers, with a filter by version. | Desirable | LGPD | Delivered | [CT-E72](casos-de-teste.md#ct-e72), [CT-U60](casos-de-teste.md#ct-u60). In a study with demographic data, Results tab › Demographic data. |

### Responses and suspicious responses

| ID | Requirement | Description | Priority | Sprint | Status | How to verify |
|---|---|---|---|---|---|---|
| <a id="rf51"></a>RF51 | **Flag suspicious responses** | Each participation is flagged as suspicious when it is completed if it has 3 or more scales with a range greater than 3 or more than 15 identical responses. | Essential | Sprint 07 · Suspicious responses | Delivered | [CT-U23](casos-de-teste.md#ct-u23), [CT-U25](casos-de-teste.md#ct-u25), [CT-U26](casos-de-teste.md#ct-u26), [CT-U27](casos-de-teste.md#ct-u27), [CT-U28](casos-de-teste.md#ct-u28), [CT-E33](casos-de-teste.md#ct-e33). Example study › Responses tab › Show only suspicious. |
| <a id="rf52"></a>RF52 | **Participations table** | The researcher sees all participations with date, version, language, origin, inconsistent scales, largest number of identical responses, reason for the suspicion and whether it is in the analysis, and can filter to show only the suspicious ones. | Essential | Sprint 07 · Suspicious responses | Delivered | [CT-E33](casos-de-teste.md#ct-e33), [CT-E36](casos-de-teste.md#ct-e36). Responses tab. |
| <a id="rf53"></a>RF53 | **View a participant's scales** | When opening a participation, the researcher sees the range of each scale, with those that exceeded the threshold highlighted. | Important | Sprint 07 · Suspicious responses | Delivered | [CT-E35](casos-de-teste.md#ct-e35). Responses tab: open View scales of a suspicious response. |
| <a id="rf54"></a>RF54 | **Remove responses from and return them to the analysis** | The researcher removes each participation from the analysis or returns it, or all suspicious ones at once, without erasing any data, and the dashboard shows how many are out. | Essential | Sprint 07 · Suspicious responses | Delivered | [CT-E33](casos-de-teste.md#ct-e33), [CT-E34](casos-de-teste.md#ct-e34). Responses tab: remove a suspicious response from the analysis and put it back. |
| <a id="rf55"></a>RF55 | **Recalculate the suspicious flags** | A command recalculates the suspicion flag of all participations after the team adjusts the protocol thresholds. | Desirable | Sprint 07 · Suspicious responses | Delivered | [CT-M16](casos-de-teste.md#ct-m16). Terminal: pnpm suspeitas:recalcular. |

### Export and import

| ID | Requirement | Description | Priority | Sprint | Status | How to verify |
|---|---|---|---|---|---|---|
| <a id="rf56"></a>RF56 | **Export raw responses** | The researcher downloads a CSV with the responses from 1 to 7 of each participation, with version and demographic data. | Essential | Sprint 08 · Export | Delivered | [CT-U35](casos-de-teste.md#ct-u35), [CT-E37](casos-de-teste.md#ct-e37). Results tab › Export › Raw responses. |
| <a id="rf57"></a>RF57 | **Export recoded responses** | The researcher downloads a CSV with the responses already converted to -3 to +3. | Essential | Sprint 08 · Export | Delivered | [CT-U37](casos-de-teste.md#ct-u37), [CT-E37](casos-de-teste.md#ct-e37). Results tab › Export › Coded responses. |
| <a id="rf58"></a>RF58 | **Export results per scale** | The researcher downloads a CSV with one row per scale and version, with the statistics of the dashboard. | Essential | Sprint 08 · Export | Delivered | [CT-U38](casos-de-teste.md#ct-u38), [CT-E37](casos-de-teste.md#ct-e37). Results tab › Export › Results by scale. |
| <a id="rf59"></a>RF59 | **Export in the official UEQ spreadsheet** | The researcher downloads the UEQ Data Analysis Tool V15 itself filled in with the participations in the analysis (of the version chosen in the dashboard or of the whole study), which recalculates when opened in Excel. | Essential | Sprint 09 · Final review | Delivered | [CT-U34](casos-de-teste.md#ct-u34), [CT-U70](casos-de-teste.md#ct-u70), [CT-E37](casos-de-teste.md#ct-e37), [CT-E96](casos-de-teste.md#ct-e96). Results tab › Export › Official UEQ spreadsheet (XLSX); open it in Excel and click Enable Editing. |
| <a id="rf60"></a>RF60 | **Export the dashboard as PDF** | The researcher downloads the dashboard of the chosen version as PDF, with the study title, n and date in the header. | Desirable | Sprint 10 · Extensions | Delivered | [CT-E39](casos-de-teste.md#ct-e39), [CT-E40](casos-de-teste.md#ct-e40). Results tab › Dashboard as PDF. |
| <a id="rf61"></a>RF61 | **Import responses from CSV** | The researcher imports responses in the format of the official spreadsheet into a version, with a preview and errors pointed out per row, and the imported responses are flagged as such. | Desirable | Sprint 10 · Extensions | Delivered | [CT-U39](casos-de-teste.md#ct-u39), [CT-U40](casos-de-teste.md#ct-u40), [CT-U41](casos-de-teste.md#ct-u41), [CT-E42](casos-de-teste.md#ct-e42), [CT-E43](casos-de-teste.md#ct-e43). Responses tab › Import responses from a CSV, with data/fixtures/basico/respostas.csv. |
| <a id="rf62"></a>RF62 | **Apply the UEQ-S** | When creating the study, the researcher chooses between the full UEQ and the UEQ-S (short version, 8 items, pragmatic, hedonic and overall quality). The choice locks at the first response, and the UEQ-S evaluation is in its own tab of the results, with its benchmark and its official spreadsheet. | Desirable | UEQ-S | Delivered | [CT-U53](casos-de-teste.md#ct-u53), [CT-U71](casos-de-teste.md#ct-u71), [CT-U72](casos-de-teste.md#ct-u72), [CT-U73](casos-de-teste.md#ct-u73), [CT-U74](casos-de-teste.md#ct-u74), [CT-U75](casos-de-teste.md#ct-u75), [CT-U76](casos-de-teste.md#ct-u76), [CT-E97](casos-de-teste.md#ct-e97), [CT-E98](casos-de-teste.md#ct-e98), [CT-E99](casos-de-teste.md#ct-e99), [CT-E100](casos-de-teste.md#ct-e100), [CT-E101](casos-de-teste.md#ct-e101), [CT-M26](casos-de-teste.md#ct-m26). Create a study and choose UEQ-S, short version under Questionnaire; answer through the link and open Results › UEQ-S. The UEQ-S Example study (/r/exemplo-curto) already has responses. The 9 scenarios in data/fixtures-ueq-s match the official UEQ-S spreadsheet recalculated in Excel. |

### Documentation

| ID | Requirement | Description | Priority | Sprint | Status | How to verify |
|---|---|---|---|---|---|---|
| <a id="rf63"></a>RF63 | **Documentation tab** | Anyone, with or without an account, reads the project documentation in a public tab, in 7 sections; a document not yet published appears as In preparation. | Important | Documentation sprint | Delivered | [CT-E47](casos-de-teste.md#ct-e47), [CT-E48](casos-de-teste.md#ct-e48), [CT-E62](casos-de-teste.md#ct-e62), [CT-U54](casos-de-teste.md#ct-u54). Open http://localhost:3000/documentacao without being logged in. |
| <a id="rf64"></a>RF64 | **Full-screen diagrams** | Each diagram opens in full screen, with zoom from 50% to 400% and dragging, and closes with Back or Esc. | Important | Documentation sprint | Delivered | [CT-E57](casos-de-teste.md#ct-e57), [CT-U55](casos-de-teste.md#ct-u55). Open a document with a diagram and click on it. |
| <a id="rf65"></a>RF65 | **Documentation links and downloads** | The links between documents lead to the right anchor inside the tool, and the files on the document card (CSV, spreadsheet, sources) download without an account. | Important | Documentation sprint | Delivered | [CT-E49](casos-de-teste.md#ct-e49), [CT-E51](casos-de-teste.md#ct-e51), [CT-U56](casos-de-teste.md#ct-u56). In the Documentation tab, click a link to another document and a download. |

### Administration

| ID | Requirement | Description | Priority | Sprint | Status | How to verify |
|---|---|---|---|---|---|---|
| <a id="rf66"></a>RF66 | **Manage accounts** | The superuser opens the Administration page, sees the accounts and creates an account for another person; anyone who is not a superuser has no access. | Desirable | Team and help | Delivered | With an administrator account, Administration menu › Accounts. |
| <a id="rf67"></a>RF67 | **Demonstration scenarios** | The superuser creates demonstration studies with made-up responses, to present the tool. | Desirable | Team and help | Delivered | [CT-U61](casos-de-teste.md#ct-u61). Administration › Scenarios. |
| <a id="rf68"></a>RF68 | **Status of data protection and translations** | The superuser sees whether field encryption is on and how much of each language is already translated. | Desirable | Tool languages | Delivered | Administration › Data protection and Administration › Languages. |

## Non-functional requirements

### Accessibility

| ID | Requirement | Description | Priority | Sprint | Status | How to verify |
|---|---|---|---|---|---|---|
| <a id="rnf01"></a>RNF01 | **WCAG 2.2 AA** | Every screen, including in error states, meets WCAG 2.2 level AA, the basis of ABNT NBR 17225:2025, with no violation reported by axe-core. | Essential | Sprint 00 · Setup | Delivered | [CT-E06](casos-de-teste.md#ct-e06), [CT-E14](casos-de-teste.md#ct-e14), [CT-E21](casos-de-teste.md#ct-e21), [CT-E47](casos-de-teste.md#ct-e47). The end-to-end tests run axe-core on each screen; the manual checklist covers what automation cannot see. |
| <a id="rnf02"></a>RNF02 | **320 px and 400% zoom** | No screen scrolls horizontally at 320 px width or at 400% zoom, and nothing is cut off. | Essential | Sprint 05 · Questionnaire | Delivered | [CT-E25](casos-de-teste.md#ct-e25), [CT-E31](casos-de-teste.md#ct-e31), [CT-E36](casos-de-teste.md#ct-e36), [CT-E44](casos-de-teste.md#ct-e44), [CT-E50](casos-de-teste.md#ct-e50), [CT-M08](casos-de-teste.md#ct-m08). In the browser, 400% zoom on each screen. |
| <a id="rnf03"></a>RNF03 | **Keyboard-only use** | Every flow works with the keyboard alone, with the focus always visible, in a logical order and never covered by the fixed bar or footer. | Essential | Sprint 05 · Questionnaire | Delivered | [CT-E03](casos-de-teste.md#ct-e03), [CT-E22](casos-de-teste.md#ct-e22), [CT-E54](casos-de-teste.md#ct-e54), [CT-M07](casos-de-teste.md#ct-m07). Go through creating a study, answering and exporting using only Tab, the arrow keys, Space and Enter. |
| <a id="rnf04"></a>RNF04 | **Screen reader** | Each questionnaire item is announced with number, terms and position, and every result message ("Data collection open") is announced by the screen reader. | Essential | Sprint 05 · Questionnaire | Delivered | [CT-E24](casos-de-teste.md#ct-e24), [CT-M01](casos-de-teste.md#ct-m01), [CT-M02](casos-de-teste.md#ct-m02), [CT-M04](casos-de-teste.md#ct-m04), [CT-M06](casos-de-teste.md#ct-m06). Answer the questionnaire with NVDA, VoiceOver or TalkBack. |
| <a id="rnf05"></a>RNF05 | **Touch target** | Each circle of the questionnaire has a touch target of at least 44 × 44 px. | Important | Sprint 05 · Questionnaire | Delivered | [CT-M12](casos-de-teste.md#ct-m12). Answer on a mobile phone, with your thumb. |
| <a id="rnf06"></a>RNF06 | **Contrast** | All text has a contrast of at least 4.5:1, and field borders, focus and chart markers of at least 3:1. | Essential | Sprint 00 · Setup | Delivered | [CT-U51](casos-de-teste.md#ct-u51), [CT-U52](casos-de-teste.md#ct-u52). Automated contrast test of the color tokens. |
| <a id="rnf07"></a>RNF07 | **Information beyond color** | No information depends on color alone: the charts remain readable with simulated color blindness and in high contrast. | Essential | Sprint 06 · Results | Delivered | [CT-E32](casos-de-teste.md#ct-e32), [CT-M09](casos-de-teste.md#ct-m09), [CT-M10](casos-de-teste.md#ct-m10). DevTools › Rendering › Emulate vision deficiencies, in the Results tab. |
| <a id="rnf08"></a>RNF08 | **Charts with text equivalent** | Every chart has a text description and a visible table with the same numbers. | Essential | Sprint 06 · Results | Delivered | [CT-E29](casos-de-teste.md#ct-e29), [CT-M05](casos-de-teste.md#ct-m05). Results tab: check the table below each chart. |

### Fidelity to the instrument

| ID | Requirement | Description | Priority | Sprint | Status | How to verify |
|---|---|---|---|---|---|---|
| <a id="rnf09"></a>RNF09 | **Questionnaire without interface bias** | The 7 positions have the same visual weight, with no number or graded color, none comes preselected, and all items have the same layout. | Essential | Sprint 05 · Questionnaire | Delivered | [CT-E24](casos-de-teste.md#ct-e24). Check the items on a computer and on a mobile phone. |
| <a id="rnf10"></a>RNF10 | **Official terms** | The 26 term pairs always use the official translation from the UEQ language pack, never a machine translation. | Essential | Languages sprint | Delivered | [CT-U45](casos-de-teste.md#ct-u45), [CT-U46](casos-de-teste.md#ct-u46), [CT-U47](casos-de-teste.md#ct-u47). Compare the questionnaire terms with the official UEQ language pack. |
| <a id="rnf11"></a>RNF11 | **Calculation identical to the official spreadsheet** | All the numbers of the tool match the UEQ Data Analysis Tool, with a tolerance of 1e-6. | Essential | Sprint 09 · Final review | Delivered | [CT-U29](casos-de-teste.md#ct-u29), [CT-E96](casos-de-teste.md#ct-e96), [CT-M15](casos-de-teste.md#ct-m15). The 11 scenarios in data/fixtures match the official spreadsheet recalculated in Excel ([calculation verification](verificacao-do-calculo.md#comparação-com-a-planilha-oficial)). |

### Security and privacy

| ID | Requirement | Description | Priority | Sprint | Status | How to verify |
|---|---|---|---|---|---|---|
| <a id="rnf12"></a>RNF12 | **Participant anonymity** | The tool collects nothing that identifies the participant: name, email, IP, detailed browser information or tracking cookie. | Essential | Sprint 05 · Questionnaire | Delivered | [CT-E21](casos-de-teste.md#ct-e21). Check in the database model that the participation does not have these fields. |
| <a id="rnf13"></a>RNF13 | **Minimal data collection** | Demographic data is off by default in each study, and participations started and not submitted are erased within 2 days. | Important | LGPD | Delivered | Create a study and check that demographic data starts turned off. |
| <a id="rnf14"></a>RNF14 | **Encryption of demographic data** | Demographic data is stored encrypted with AES-256-GCM, with the key outside the database. | Important | LGPD | Delivered | [CT-U58](casos-de-teste.md#ct-u58). Administration › Data protection shows whether encryption is on. |
| <a id="rnf15"></a>RNF15 | **Protected password and session** | Passwords are stored with bcrypt, the session uses an httpOnly, Secure and SameSite=Lax cookie, and the database stores only the session hash. | Essential | Sprint 03 · Authentication | Delivered | [CT-E10](casos-de-teste.md#ct-e10). In DevTools › Application › Cookies, check the flags of the session cookie. |
| <a id="rnf16"></a>RNF16 | **Login attempt limit** | After 5 wrong passwords for the same email within 15 minutes, the tool blocks new attempts for a while. | Important | LGPD | Delivered | [CT-E80](casos-de-teste.md#ct-e80). Enter a wrong password 6 times in a row with the same account. |
| <a id="rnf17"></a>RNF17 | **Access only to one's own studies** | Each researcher only sees, changes and exports their own studies and those shared with them; not even the administrator sees other people's studies. | Essential | Sprint 04 · Studies | Delivered | [CT-E20](casos-de-teste.md#ct-e20), [CT-E38](casos-de-teste.md#ct-e38), [CT-E41](casos-de-teste.md#ct-e41). With another account, open the address of a study that does not belong to it. |
| <a id="rnf18"></a>RNF18 | **Browser protections** | The tool uses HTTPS with HSTS and sends a Content Security Policy and the other security headers. | Important | LGPD | Delivered | [CT-E73](casos-de-teste.md#ct-e73). In the published version, DevTools › Network › response headers. |
| <a id="rnf19"></a>RNF19 | **Privacy policy** | A public privacy policy explains what is stored, for what purpose and how it is protected, in accordance with the LGPD. | Important | LGPD | Delivered | [CT-E74](casos-de-teste.md#ct-e74), [CT-E75](casos-de-teste.md#ct-e75), [CT-E76](casos-de-teste.md#ct-e76), [CT-E77](casos-de-teste.md#ct-e77), [CT-E78](casos-de-teste.md#ct-e78), [CT-E79](casos-de-teste.md#ct-e79), [CT-E82](casos-de-teste.md#ct-e82), [CT-E83](casos-de-teste.md#ct-e83), [CT-M23](casos-de-teste.md#ct-m23), [CT-M25](casos-de-teste.md#ct-m25). Open http://localhost:3000/privacidade. |

### Usability

| ID | Requirement | Description | Priority | Sprint | Status | How to verify |
|---|---|---|---|---|---|---|
| <a id="rnf20"></a>RNF20 | **Feedback for every action** | Every researcher action confirms the result and the consequence in an announced message ("Data collection open. The link already accepts responses."). | Important | Sprint 04 · Studies | Delivered | [CT-E09](casos-de-teste.md#ct-e09), [CT-E15](casos-de-teste.md#ct-e15), [CT-E16](casos-de-teste.md#ct-e16), [CT-M06](casos-de-teste.md#ct-m06). Open data collection for a study and read the message. |
| <a id="rnf21"></a>RNF21 | **Confirmation before losing data** | Logging out and every deletion ask for confirmation saying what will happen, and deleting an account or a study requires typing the email or the title. | Important | Sprint 04 · Studies | Delivered | [CT-E11](casos-de-teste.md#ct-e11), [CT-E19](casos-de-teste.md#ct-e19), [CT-E27](casos-de-teste.md#ct-e27). Try to delete a study. |
| <a id="rnf22"></a>RNF22 | **Brazilian format for numbers and dates** | In Portuguese, numbers use a decimal comma and dates use dd/mm/yyyy, on screen and in the exports. | Important | Sprint 06 · Results | Delivered | [CT-U33](casos-de-teste.md#ct-u33), [CT-U44](casos-de-teste.md#ct-u44). Results tab and the results CSV. |

### Platform and maintenance

| ID | Requirement | Description | Priority | Sprint | Status | How to verify |
|---|---|---|---|---|---|---|
| <a id="rnf23"></a>RNF23 | **Computer and mobile phone** | The tool works in the browser on a computer and on a mobile phone; every end-to-end test runs on both. | Essential | Sprint 00 · Setup | Delivered | [CT-M12](casos-de-teste.md#ct-m12). Open the participant link on a mobile phone. |
| <a id="rnf24"></a>RNF24 | **Open-source web application** | The tool is a web application (Next.js and PostgreSQL), with the code on GitHub under the MIT license. | Essential | Sprint 00 · Setup | Delivered | [CT-M19](casos-de-teste.md#ct-m19). In a clean clone, follow the Como rodar (How to run) section of the README. |
| <a id="rnf25"></a>RNF25 | **Isolated and tested calculation** | The UEQ calculation lives in a module of pure functions (src/ueq), with no database or interface, covered by unit tests. | Important | Sprint 02 · Calculation | Delivered | [CT-U01](casos-de-teste.md#ct-u01), [CT-U12](casos-de-teste.md#ct-u12), [CT-U14](casos-de-teste.md#ct-u14), [CT-U22](casos-de-teste.md#ct-u22). Terminal: pnpm test. |
| <a id="rnf26"></a>RNF26 | **Checks before merging** | No pull request goes into main without lint, type checking and unit tests passing. | Important | Sprint 00 · Setup | Delivered | Terminal: pnpm lint && pnpm typecheck && pnpm test. |

## Summary

| Type | Essential | Important | Desirable | Delivered | Pending | Removed | Total |
|---|---|---|---|---|---|---|---|
| Functional | 31 | 20 | 17 | 68 | 0 | 0 | 68 |
| Non-functional | 15 | 11 | 0 | 26 | 0 | 0 | 26 |
| Total | 46 | 31 | 17 | 94 | 0 | 0 | 94 |
