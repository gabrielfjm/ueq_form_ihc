# Documentazione dello Strumento UEQ

Lo Strumento UEQ è un'applicazione web open source per condurre studi di esperienza utente con lo *User Experience Questionnaire* (UEQ), dalla creazione dello studio all'esportazione dei dati. Questa documentazione spiega che cosa fa lo strumento, per chi, come è stato costruito e come si sa che funziona.

Tutto è in formati aperti e compare direttamente su GitHub: Markdown, CSV e diagrammi in Mermaid, con il file sorgente di ciascun diagramma in [`fontes/`](fontes/). Il foglio di calcolo dei requisiti è disponibile anche in `.xlsx`, da aprire con Excel o LibreOffice. Gli stessi file compaiono all'interno dello strumento, nella scheda **Documentazione**, aperta a chiunque, senza login.

Il codice e questa documentazione sono sotto [licenza MIT](../../LICENSE). Il materiale ufficiale dell'UEQ in `data/` appartiene agli autori del questionario (vedere la sezione Licenza del [README](../../README.md#licença)).

Progetto della disciplina Fondamenti di Interazione Uomo-Computer, PPGIa · PUCPR · 2026. Team: Gabriel Meira, Jean Weiss e Luiza Pedralli.

## Contenuto

| Sezione | Documento | Che cosa contiene |
|---|---|---|
| Requisiti | [Requisiti](requisitos.md) | I 68 requisiti funzionali e i 26 non funzionali, con priorità, sprint di consegna, stato e modalità di verifica. Anche in [requisitos.csv](requisitos.csv) |
| Requisiti | [Matrice di tracciabilità](matriz-rastreabilidade.md) | Ogni requisito collegato a storie, casi d'uso, personas, casi di test, sprint e codice. Anche in [matriz-rastreabilidade.csv](matriz-rastreabilidade.csv) |
| Requisiti | [Foglio di calcolo dei requisiti](planilha-requisitos.xlsx) | Requisiti, sprint, storie, casi d'uso, matrice, scenari e casi di test, una scheda per ciascuno, con filtri |
| Utenti | [Personas](personas.md) | Otto personas: tre di ricercatore, quattro di partecipante e una di chi gestisce l'installazione |
| Utenti | [Storie utente](historias-de-usuario.md) | 44 storie con criteri di accettazione. Anche in [historias-de-usuario.csv](historias-de-usuario.csv) |
| Modellazione | [Casi d'uso](casos-de-uso.md) | Quattro diagrammi UML, l'elenco dei 33 casi d'uso e la specifica dei principali |
| Modellazione | [Diagramma delle classi](diagrama-de-classes.md) | Il modello di dominio e il modulo di calcolo dell'UEQ |
| Modellazione | [Modello logico del database](modelo-logico.md) | Le 11 tabelle di PostgreSQL, con colonne, chiavi e ciò che ogni eliminazione si porta dietro |
| Modellazione | [Diagrammi di sequenza](diagramas-de-sequencia.md) | Otto flussi dal clic al database: accedere, rispondere, vedere i risultati, escludere dall'analisi, PDF, importare, invitare e tradurre |
| Architettura | [Architettura](arquitetura.md) | Modello C4 (contesto, container e componenti), sicurezza, decisioni e distribuzione |
| Test | [Casi e scenari di test](casos-de-teste.md) | Strategia, 25 scenari e 206 casi (end-to-end, di unità e manuali), con i requisiti che ciascuno verifica e il risultato dell'ultima esecuzione. Anche in [casos-de-teste.csv](casos-de-teste.csv) |
| Test | [Verifica del calcolo](verificacao-do-calculo.md) | Il calcolo dello strumento rifatto a mano con lo studio di esempio e confrontato con il foglio ufficiale dell'UEQ in 11 scenari e con quello dell'UEQ-S in 9: medie, deviazione standard, IC95, alfa, benchmark, sospetti ed esportazioni |
| Test | [Checklist manuale](../checklist-manual.md) | Ciò che il team verifica con le proprie mani: lettore di schermo, zoom, cellulare reale, daltonismo |
| Test | [Percorso di revisione](../roteiro-revisao.md) | Che cosa aprire, che cosa fare in ogni schermata e come annotare i problemi |
| Specifica | [Protocollo UEQ](../ueq-protocolo.md) | Item, scale, polarità e tutte le formule del calcolo, verificate sul manuale e sul foglio ufficiale |
| Specifica | [Fondamenti di IHC](../ihc.md) | Requisiti di usabilità e accessibilità, ciascuno collegato al principio della letteratura che lo giustifica |
| Specifica | [Decisioni di interfaccia](../rastreabilidade-ihc.md) | Ogni decisione di interfaccia, il principio, il codice e il test che la dimostra |
| Specifica | [Lingue](../idiomas.md) | Le 37 lingue del questionario, l'origine di ciascun testo e le correzioni ai termini ufficiali |
| Specifica | [Identità visiva](../design.md) | Colori, tipografia, layout, icone e tono di voce |
| Specifica | [Convenzioni di codice](../codigo.md) | Nomi, commenti, struttura, test e commit |

## Da dove iniziare

- **Utilizzerà lo strumento in uno studio?** Legga le [personas](personas.md) di ricercatore, il caso d'uso [Rispondere al questionario](casos-de-uso.md#uc14) per vedere che cosa dovrà affrontare il partecipante e il [Protocollo UEQ](../ueq-protocolo.md) per sapere come viene calcolato ogni numero.
- **Valuterà il progetto?** Inizi dai [requisiti](requisitos.md), dalla [matrice di tracciabilità](matriz-rastreabilidade.md) e dai [casi di test](casos-de-teste.md). La [verifica del calcolo](verificacao-do-calculo.md) mostra il calcolo rifatto a mano, e le [decisioni di interfaccia](../rastreabilidade-ihc.md) collegano ogni schermata a un principio di IHC.
- **Contribuirà con il codice?** Legga l'[architettura](arquitetura.md), il [diagramma delle classi](diagrama-de-classes.md), il [modello logico](modelo-logico.md), la [strategia di test](casos-de-teste.md#estratégia) e le [convenzioni di codice](../codigo.md). Prima di modificare un comportamento, cerchi il file nella [matrice](matriz-rastreabilidade.md) per vedere quale requisito e quale test ne dipendono.

## Identificativi

| Prefisso | Che cosa identifica | Esempio |
|---|---|---|
| RF | Requisito funzionale | [RF27](requisitos.md#rf27) Rispondere ai 26 item |
| RNF | Requisito non funzionale | [RNF01](requisitos.md#rnf01) WCAG 2.2 AA |
| PE | Persona | [PE04](personas.md#pe04) Célia |
| HU | Storia utente | [HU35](historias-de-usuario.md#hu35) Rispondere con il lettore di schermo |
| UC | Caso d'uso | [UC14](casos-de-uso.md#uc14) Rispondere al questionario |
| CN | Scenario di test | [CN06](casos-de-teste.md#cn06) Accessibilità del questionario |
| CT-E, CT-U, CT-M | Caso di test end-to-end, di unità o manuale | [CT-E22](casos-de-teste.md#ct-e22) Flusso completo solo con la tastiera |

Gli identificativi sono fissi: una voce che esce mantiene il numero riservato, perché gli altri documenti citano per numero.

## Situazione al 17/11/2026

- **Requisiti:** tutti i 94 sono consegnati. L'ultimo è stato l'[RF62](requisitos.md#rf62), Applicare l'UEQ-S, il 18/11/2026.
- **Test automatici:** i risultati dell'ultima esecuzione sono nei [casi di test](casos-de-teste.md#execução-de-17112026).
- **Calcolo:** la [verifica del calcolo](verificacao-do-calculo.md) ha rifatto a mano tutte le statistiche dello studio di esempio, e i 336 numeri coincidono con lo strumento. Nel confronto con il foglio ufficiale stesso, gli 11 scenari di test coincidono nei 6.543 valori, e i 9 dell'UEQ-S negli 8.520 valori del foglio ufficiale di quest'ultimo. I fogli di calcolo che lo strumento esporta si ricalcolano in Excel con gli stessi numeri.
- **In produzione:** https://ferramenta-ueq.vercel.app.

## Come mantenere

Quando una pull request modifica il comportamento dello strumento:

1. Aggiorni il requisito in [requisitos.md](requisitos.md), in [requisitos.csv](requisitos.csv) e nel [foglio di calcolo](planilha-requisitos.xlsx). Un nuovo requisito riceve il primo numero libero; un requisito ritirato resta con lo stato Rimosso.
2. Colleghi il requisito ad almeno una storia e un caso d'uso, e aggiorni la [matrice](matriz-rastreabilidade.md) con il file e il test.
3. Un nuovo test diventa un caso in [casos-de-teste.md](casos-de-teste.md) e nel CSV: il titolo di `test(...)` o di `it(...)` è il risultato atteso, e il caso cita i requisiti che verifica.
4. Se modifica un diagramma Mermaid, esegua `pnpm docs:diagramas` per generare l'SVG che la scheda Documentazione mostra e il file sorgente in `fontes/`. Un test di unità fallisce se se ne dimentica. Sotto ogni diagramma, aggiorni la versione dello strumento che esso rappresenta.
5. Un nuovo documento entra nel catalogo di `src/lib/documentacao/catalogo.ts`, nella propria sezione e nell'elenco `PRONTOS`.

I formati di uno stesso contenuto (Markdown, CSV e XLSX) cambiano insieme.
