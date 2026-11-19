# Personas

Otto personas rappresentano chi usa lo Strumento UEQ: tre dal lato del ricercatore, quattro dal lato del partecipante e una di chi gestisce l'installazione.

Sono fittizie. Sono state costruite a partire dal profilo degli utenti e dal contesto d'uso di [Fondamenti di IHC §2](../ihc.md#2-usuários-e-contexto-de-uso-iso-9241-11), che segue la ISO 9241-11, e coprono i casi estremi che più cambiano la progettazione di una schermata: chi non ha mai calcolato una statistica, chi si fida solo del foglio ufficiale, chi non legge il portoghese, chi risponde dal cellulare con il carattere ingrandito, chi usa un lettore di schermo, chi legge da destra a sinistra, chi ha meno di 18 anni e chi deve mettere mano al codice.

Ogni persona rimanda alle [user story](historias-de-usuario.md) scritte a partire da essa. La [matrice di tracciabilità](matriz-rastreabilidade.md) collega ogni requisito alle personas che lo richiedono.

| ID | Persona | Ruolo | Uso principale |
|---|---|---|---|
| [PE01](#pe01) | Marina | Ricercatrice, studentessa di laurea magistrale in IHC | Imposta lo studio, segue la raccolta e interpreta il pannello |
| [PE02](#pe02) | Ricardo | Professore e relatore | Segue lo studio dei propri tesisti, confronta le versioni e verifica i numeri sul foglio ufficiale |
| [PE03](#pe03) | Kenji | Ricercatore ospite, legge in giapponese | Usa lo strumento e somministra lo studio nella propria lingua |
| [PE04](#pe04) | Célia | Partecipante da cellulare | Risponde tramite il link ricevuto su WhatsApp |
| [PE05](#pe05) | Tiago | Partecipante con lettore di schermo | Risponde solo con la tastiera e NVDA |
| [PE06](#pe06) | Amira | Partecipante che legge in arabo | Risponde nella propria lingua, da destra a sinistra |
| [PE07](#pe07) | Bruna | Partecipante minorenne | Partecipa a uno studio a scuola, con l'autorizzazione dei genitori |
| [PE08](#pe08) | Lucas | Sviluppatore e amministratore dell'installazione | Installa, regola il protocollo, amministra gli account e dimostra che nulla si è rotto |

## Ricercatori

### PE01

**Marina, 26 anni, studentessa di laurea magistrale in IHC.** Persona principale.

- **Contesto.** È al primo anno di magistrale e valuterà con l'UEQ due versioni dell'applicazione di prenotazione della clinica-scuola dell'università. Conosce l'UX e ha già risposto a questionari, ma non ha mai calcolato l'alfa di Cronbach. Usa il notebook, in sessioni brevi tra una lezione e l'altra, e apre il pannello più volte al giorno durante la raccolta.
- **Obiettivi.** Creare lo studio senza errori, inviare il link nel gruppo WhatsApp dei pazienti, sapere quante persone hanno già risposto, capire il risultato e portare tabelle e grafici nella tesi.
- **Frustrazioni.** Fogli di calcolo in cui un copia e incolla sbagliato rovina tutto. Moduli generici che non preservano l'ordine e la polarità dell'UEQ. Statistica presentata senza spiegazioni. Dover scrivere da zero il modulo di consenso.
- **Di che cosa ha bisogno dallo strumento.** Interpretazione scritta accanto a ogni numero, breve spiegazione dei termini tecnici, avvisi che dicono che cosa fare, un modulo che chiede già ciò che l'etica richiede ed esportazioni che si aprono direttamente in Excel.

> "Voglio sapere se la nuova versione è migliore, non diventare un'esperta di statistica."

Storie: [HU01](historias-de-usuario.md#hu01), [HU02](historias-de-usuario.md#hu02), [HU03](historias-de-usuario.md#hu03), [HU04](historias-de-usuario.md#hu04), [HU05](historias-de-usuario.md#hu05), [HU06](historias-de-usuario.md#hu06), [HU07](historias-de-usuario.md#hu07), [HU08](historias-de-usuario.md#hu08), [HU09](historias-de-usuario.md#hu09), [HU10](historias-de-usuario.md#hu10), [HU11](historias-de-usuario.md#hu11), [HU12](historias-de-usuario.md#hu12), [HU13](historias-de-usuario.md#hu13), [HU14](historias-de-usuario.md#hu14), [HU15](historias-de-usuario.md#hu15), [HU16](historias-de-usuario.md#hu16), [HU17](historias-de-usuario.md#hu17).

### PE02

**Ricardo, 48 anni, professore e relatore.**

- **Contesto.** Segue quattro studenti che usano l'UEQ, tra cui Marina. Conosce l'handbook e lo UEQ Data Analysis Tool e si fida di entrambi. Lavora sui computer del laboratorio, condivisi. A volte ha risposte raccolte su carta, in eventi con poco tempo per ogni persona.
- **Obiettivi.** Seguire lo studio di ciascun tesista senza chiedere screenshot, confrontare le versioni di un prodotto, verificare che i numeri coincidano con il foglio ufficiale prima di firmare un articolo e unire le risposte cartacee a quelle del link.
- **Frustrazioni.** Strumenti che calcolano "a modo loro" senza dichiarare la regola. Dover rifare i filtri per discutere un risultato. Lasciare la sessione aperta su un computer condiviso.
- **Di che cosa ha bisogno dallo strumento.** Accesso in sola lettura allo studio dello studente, esportazione nel formato esatto del foglio ufficiale, regole di sospetto e di calcolo visibili, un indirizzo che conserva la vista del pannello, importazione con anteprima e cambio della password che chiude le altre sessioni.

> "Se non coincide con il foglio ufficiale, non va nell'articolo."

Storie: [HU18](historias-de-usuario.md#hu18), [HU19](historias-de-usuario.md#hu19), [HU20](historias-de-usuario.md#hu20), [HU21](historias-de-usuario.md#hu21), [HU22](historias-de-usuario.md#hu22), [HU23](historias-de-usuario.md#hu23), [HU24](historias-de-usuario.md#hu24), [HU25](historias-de-usuario.md#hu25).

### PE03

**Kenji, 35 anni, ricercatore ospite di un'università giapponese.**

- **Contesto.** Trascorre un semestre nel laboratorio di Ricardo. Legge il portoghese lentamente e lavora meglio in giapponese. Applicherà l'UEQ in uno studio con partecipanti in Giappone, su un'applicazione di trasporto.
- **Obiettivi.** Usare lo strumento nella propria lingua e impostare uno studio il cui link si apra in giapponese, con i termini ufficiali dell'UEQ.
- **Frustrazioni.** Un'interfaccia che esiste solo in inglese o in portoghese. Una traduzione che cambia il nome dei pulsanti da una schermata all'altra.
- **Di che cosa ha bisogno dallo strumento.** Selettore della lingua sempre in vista, traduzione coerente dell'interfaccia, studio scritto nella sua lingua e titolo tradotto per chi risponde in un'altra lingua.

> "Capisco la statistica. Ho solo bisogno di leggere la schermata."

Storie: [HU26](historias-de-usuario.md#hu26), [HU27](historias-de-usuario.md#hu27).

## Partecipanti

### PE04

**Célia, 63 anni, pensionata, paziente della clinica-scuola.**

- **Contesto.** Riceve il link su WhatsApp e lo apre sul cellulare, con il carattere di sistema ingrandito. Usa il cellulare per i messaggi e la banca, ma diffida dei moduli. Non ha un account nello strumento e nessun obbligo di rispondere.
- **Obiettivi.** Capire in fretta di che cosa si tratta e chi lo sta chiedendo, rispondere in pochi minuti e tornare a ciò che stava facendo.
- **Frustrazioni.** Pulsanti piccoli, domande che spariscono quando la pagina si ricarica, un modulo che non dice che cosa è mancato, la richiesta di dati personali.
- **Di che cosa ha bisogno dallo strumento.** Un modulo breve e chiaro, con il responsabile della ricerca; area di tocco ampia; avanzamento visibile; avviso di un elemento dimenticato con link diretto; poter rinunciare e saltare i dati su di sé.

> "Se non capisco in un minuto, chiudo."

Storie: [HU28](historias-de-usuario.md#hu28), [HU29](historias-de-usuario.md#hu29), [HU30](historias-de-usuario.md#hu30), [HU31](historias-de-usuario.md#hu31), [HU32](historias-de-usuario.md#hu32), [HU33](historias-de-usuario.md#hu33), [HU34](historias-de-usuario.md#hu34).

### PE05

**Tiago, 29 anni, analista di sistemi, non vedente.**

- **Contesto.** Usa Windows con NVDA e naviga solo con la tastiera. Risponde spesso a ricerche di UX e ha rinunciato a molte perché i pulsanti erano `div` senza nome.
- **Obiettivi.** Rispondere con la stessa precisione di chi vede, sapendo per ogni cerchio la posizione e da quale polo è più vicino.
- **Frustrazioni.** Scala senza etichetta ("pulsante, pulsante, pulsante"), annuncio dell'avanzamento a ogni clic, focus che salta da solo, errore che compare solo in rosso.
- **Di che cosa ha bisogno dallo strumento.** Elemento come gruppo con legenda, radio nativi con nome accessibile ("3 di 7, più vicino a facile"), avanzamento annunciato senza interrompere, riepilogo degli errori che riceve il focus.

> "Se il lettore di schermo dice solo 'pulsante di opzione, 3 di 7', non so a che cosa sto rispondendo."

Storie: [HU35](historias-de-usuario.md#hu35).

### PE06

**Amira, 34 anni, studentessa in scambio, legge in arabo.**

- **Contesto.** Trascorre un semestre in Brasile e parla poco portoghese. Il browser del cellulare è in arabo. Partecipa allo studio di un collega di laboratorio.
- **Obiettivi.** Rispondere nella propria lingua, con i termini che l'UEQ ha validato in arabo.
- **Frustrazioni.** Traduzione automatica che cambia il senso del termine. Pagina in arabo con la scala invertita.
- **Di che cosa ha bisogno dallo strumento.** Lingua scelta in base al browser, testo da destra a sinistra con la scala nell'ordine ufficiale, avviso onesto che la traduzione araba non è stata approvata dagli autori dell'UEQ.

> "Rispondo meglio quando leggo nella mia lingua."

Storie: [HU36](historias-de-usuario.md#hu36).

### PE07

**Bruna, 16 anni, studentessa di scuola superiore.**

- **Contesto.** La sua scuola partecipa a uno studio sulla piattaforma di compiti che gli studenti usano. Risponde dal cellulare, durante l'intervallo, con il link che l'insegnante ha inviato.
- **Obiettivi.** Partecipare come i compagni, senza complicazioni.
- **Frustrazioni.** Un modulo che si blocca senza spiegare perché.
- **Di che cosa ha bisogno dallo strumento.** Un modulo che chieda l'età prima di iniziare e dica con chiarezza che chi ha meno di 18 anni ha bisogno dell'autorizzazione del genitore o tutore, senza registrare nulla prima di allora.

> "I miei genitori hanno già firmato l'autorizzazione della scuola. Dove lo confermo?"

Storie: [HU37](historias-de-usuario.md#hu37).

## Chi gestisce lo strumento

### PE08

**Lucas, 31 anni, sviluppatore e ricercatore di ingegneria del software.**

- **Contesto.** Ha trovato il repository perché anche il suo gruppo usa l'UEQ. Conosce TypeScript e Next.js. Ha installato lo strumento per il laboratorio ed è l'amministratore dell'installazione: crea gli account degli studenti e presenta lo strumento a lezione.
- **Obiettivi.** Avviare lo strumento in locale in pochi minuti, capire l'architettura, cambiare una soglia senza cercare numeri nel codice, dimostrare che il calcolo non si è rotto e sapere se l'installazione è pronta per uno studio reale.
- **Frustrazioni.** Progetto accademico senza istruzioni di installazione, regole di business sparse nell'interfaccia, test inesistenti, documentazione che non dice quale codice implementa che cosa.
- **Di che cosa ha bisogno dallo strumento.** Un README con la procedura passo passo, parametri del protocollo in JSON con la fonte, calcolo isolato in funzioni pure con test, una pagina di amministrazione che mostri lo stato dell'installazione senza dare accesso agli studi degli altri e una documentazione che colleghi il requisito al codice.

> "Prima di toccare, devo sapere che cosa garantisce questa riga."

Storie: [HU38](historias-de-usuario.md#hu38), [HU39](historias-de-usuario.md#hu39), [HU40](historias-de-usuario.md#hu40), [HU41](historias-de-usuario.md#hu41), [HU42](historias-de-usuario.md#hu42), [HU43](historias-de-usuario.md#hu43), [HU44](historias-de-usuario.md#hu44).
