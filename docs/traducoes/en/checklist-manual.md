# Manual usability and accessibility checklist

What automation cannot reach, to be checked by hand before each delivery. Each block corresponds to the [manual test cases](documentacao/casos-de-teste.md#casos-manuais). In each round, tick the item on a copy of this list, and record the problem and who fixes it.

## Screen reader
NVDA + Firefox on Windows, VoiceOver + Safari on iPhone (or TalkBack + Chrome on Android).

- [ ] Complete questionnaire from start to finish by listening only, without looking at the screen
- [ ] On entering an item, the reader announces the item number, the two terms and the position
- [ ] Progress is announced without interrupting at every click
- [ ] When submitting incomplete, the reader announces the error summary and it is possible to go to the missing item
- [ ] On the dashboard, the chart is announced with its description and the table can be navigated cell by cell with the header read out
- [ ] Success messages ("Data collection open") are announced, and so is the button text "Creating the study…"
- [ ] The dialogs (Log in, Create account, Log out, delete, Share, help) announce their title on opening, trap focus and return focus to whatever opened them
- [ ] The number of notifications in the bell is announced, and an invitation can be accepted by listening only
- [ ] The guided tour can be understood by listening only, and it can be skipped
- [ ] In the privacy policy, "Back" says where it goes, and the link in the access dialogs warns that it opens in a new tab. In real Chrome, Firefox and Safari, "Close this tab and return" closes the tab and brings back the sign-up dialog with what was typed

## Keyboard
- [ ] Create a study, open data collection, answer the questionnaire, view results and export without touching the mouse
- [ ] Focus always visible and never hidden behind the fixed footer
- [ ] Focus order makes sense on every screen
- [ ] Tour, bell, help (?) and Share work without a mouse; Esc closes the dialogs
- [ ] In the documentation, table of contents, section, Back, Previous and Next work without a mouse, and the diagram appears without scrolling

## Vision
- [ ] Browser zoom at 200% and 400%: nothing is cut off, nothing overlaps
- [ ] Width of 320 px: no horizontal scrolling
- [ ] Color blindness simulation (Chrome DevTools > Rendering > Emulate vision deficiencies): protanopia, deuteranopia, tritanopia, achromatopsia. Chart remains legible
- [ ] Windows high contrast: questionnaire circles and focus visible
- [ ] Text spacing bookmarklet (WCAG 1.4.12) does not break the layout

## Real phone
- [ ] Open the link through WhatsApp and answer everything with the thumb, standing up
- [ ] No accidental tap on the neighboring circle
- [ ] Virtual keyboard does not cover the focused field in the demographic data
- [ ] Participant link opened in a study in another language, and in a right-to-left language (Arabic, Hebrew or Persian)
- [ ] Privacy policy opened from the consent form, on the phone, and "Back" leads back to the consent form

## Heuristic evaluation (each person alone, then consolidate)
For each problem: screen, heuristic violated (Nielsen 1 to 10), severity (0 to 4), suggestion.

## User testing
- [ ] 5 participants answering a real study, thinking aloud
- [ ] 2 to 3 researchers doing: create a study with 2 versions, open data collection, interpret the dashboard, exclude a suspicious response, export to the official spreadsheet
- [ ] Record success, time, errors and comments
- [ ] Researchers answer the UEQ about the tool, through the tool itself
