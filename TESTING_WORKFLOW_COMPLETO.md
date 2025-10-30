# 🧪 Guida Completa al Testing del Workflow Import/Export Bilancio di Sostenibilità

## 📋 Panoramica

Questa guida descrive il processo di testing end-to-end per validare la funzionalità di **Import/Export del Bilancio di Sostenibilità** utilizzando dati realistici estratti dal Bilancio di Sostenibilità 2023 del Gruppo HERA.

---

## 📁 File di Test Disponibili

### 1. `test-data-sustainability-report-COMPLETE.json`

**Posizione**: `frontend/public/test-data-sustainability-report-COMPLETE.json`

**Contenuto**:

- **Metadata azienda completi**: Gruppo HERA S.p.A., anno 2023, 9.700 dipendenti, €10.500M ricavi
- **10 capitoli completi** (9 con contenuto + 1 auto-generato):
  1. ✅ Lettera agli Stakeholder (245 parole)
  2. ✅ Il Gruppo HERA: Profilo e Governance (198 parole)
  3. 🤖 Analisi di Materialità (auto-generato da `chapter3Generator.js`)
  4. ✅ Perseguire la Neutralità di Carbonio (287 parole)
  5. ✅ Economia Circolare e Gestione Rifiuti (298 parole)
  6. ✅ Gestione Sostenibile della Risorsa Idrica (315 parole)
  7. ✅ Persone e Lavoro: Welfare e Sicurezza (348 parole)
  8. ✅ Clienti e Qualità del Servizio (405 parole)
  9. ✅ Innovazione e Trasformazione Digitale (420 parole)
  10. ✅ Obiettivi Futuri e SDGs (582 parole)
- **5 allegati simulati**: Piano Industriale, Certificazioni ISO, KPI Dashboard, Mappa Territori, Relazione Assurance
- **KPI Summary**: metriche ambientali, sociali, economiche
- **Completamento**: 90%

### 2. `test-data-materiality-COMPLETE.json`

**Posizione**: `frontend/public/test-data-materiality-COMPLETE.json`

**Contenuto**: Analisi di doppia materialità completa utilizzata per auto-generare il Capitolo 3

---

## 🔄 Workflow di Testing: Passo per Passo

### **STEP 1: Avvio Applicazione**

#### Ambiente Sviluppo

```powershell
cd frontend
npm start
```

L'applicazione si aprirà su `http://localhost:3000`

#### Ambiente Produzione (Netlify)

Verifica che il deploy sia corretto su: **https://esrs.netlify.app**

---

### **STEP 2: Navigazione alla Sezione Bilancio**

1. Apri l'applicazione
2. Clicca sulla tab **📑 Bilancio** nella barra di navigazione principale
3. Verifica che il componente `SustainabilityReportBuilder` sia caricato

---

### **STEP 3: Import del File di Test**

#### 3.1 Localizzare il Pulsante Import

- Nella sidebar sinistra del `SustainabilityReportBuilder`, scorri verso il basso fino alla sezione pulsanti
- Cerca il pulsante viola **"📥 Carica Bilancio da JSON"** (si trova sopra i pulsanti di export blu/rosso/verde)

#### 3.2 Selezionare il File di Test

1. Clicca sul pulsante **"📥 Carica Bilancio da JSON"**
2. Nella finestra di dialogo del browser, naviga a: `frontend/public/test-data-sustainability-report-COMPLETE.json`
3. Seleziona il file e clicca **Apri**

#### 3.3 Verificare l'Import

Dopo l'import, verifica che appaia un messaggio di successo simile a:

```
✅ Bilancio importato con successo!

📊 10/10 capitoli con contenuto
📎 1 allegati caricati
🏢 Azienda: Gruppo HERA S.p.A.
```

Poi verifica nell'interfaccia che:

✅ **Metadata visualizzati correttamente**:

- Nome azienda: "Gruppo HERA S.p.A."
- Anno: 2023
- Settore: "Multiutility - Energia, Ambiente, Acqua"

✅ **Indicatore di completamento**:

- Progress bar mostra 90%

✅ **Lista capitoli popolata**:

- 10 capitoli visibili nella sidebar di navigazione
- Capitoli 1-2, 4-10 mostrano badge "✓ Completo"
- Capitolo 3 mostra badge "🤖 Auto-generato"

---

### **STEP 4: Navigazione e Verifica Contenuti**

#### 4.1 Verifica Capitolo 1: Lettera agli Stakeholder

1. Clicca su "Capitolo 1" nella sidebar
2. **Controlli**:
   - ✅ Titolo: "Lettera agli Stakeholder"
   - ✅ Contenuto: inizia con "Cari Stakeholder,"
   - ✅ Word count: ~245 parole
   - ✅ Badge: "✓ Completo"
   - ✅ Allegato: "Lettera_Stakeholder_Firmata.pdf" visibile

#### 4.2 Verifica Capitolo 2: Profilo e Governance

1. Clicca su "Capitolo 2"
2. **Controlli**:
   - ✅ Sezioni: "CHI SIAMO", "IL NOSTRO MODELLO DI BUSINESS", "VALORE CONDIVISO", "GOVERNANCE"
   - ✅ Dati: 190 comuni, 5 milioni di cittadini, Consiglio 36% donne
   - ✅ Word count: ~198 parole

#### 4.3 Verifica Capitolo 3: Analisi di Materialità (Auto-generato)

1. Clicca su "Capitolo 3"
2. **Controlli**:
   - ✅ Badge speciale: "🤖 Auto-generato da chapter3Generator.js"
   - ✅ Contenuto: placeholder con istruzioni per auto-generazione
   - ⚠️ **NOTA**: In ambiente reale, questo capitolo sarà popolato automaticamente dal generatore

#### 4.4 Verifica Capitoli 4-10

Per ciascun capitolo, verifica:

- ✅ Contenuto formattato correttamente (titoli, liste, metriche)
- ✅ KPI numerici presenti (percentuali, €, tonnellate, km, etc.)
- ✅ Word count corretto (visualizzato in basso)

**Capitoli da controllare**:

- Cap. 4: Neutralità Carbonio → 744 GWh rinnovabili, -14% emissioni
- Cap. 5: Economia Circolare → 61% riciclo, 2,7% discarica
- Cap. 6: Gestione Idrica → 78% manutenzione predittiva, 16.000 km distrettualizzati
- Cap. 7: Persone e Lavoro → 9.700 dipendenti, 31,5h formazione
- Cap. 8: Clienti → 2,1M gas, 1,7M energia, 99,6% standard ARERA
- Cap. 9: Innovazione → 148,2M€ investimenti, 9.700 impianti telecontrollati
- Cap. 10: Obiettivi → 4,4Mld€ investimenti 2023-2027, 11 SDGs

---

### **STEP 5: Test Editing Contenuti**

#### 5.1 Seleziona un Capitolo Modificabile

Esempio: Capitolo 4 - Neutralità di Carbonio

#### 5.2 Modifica il Contenuto

1. Clicca nel campo di testo del capitolo
2. Aggiungi una frase di test:
   ```
   [TEST] Questa è una modifica di test per verificare il sistema di auto-save.
   ```
3. Aspetta 2-3 secondi

#### 5.3 Verifica Auto-Save

- ✅ Indicatore "💾 Salvato" appare brevemente
- ✅ Word count si aggiorna automaticamente
- ✅ Timestamp "lastModified" aggiornato

#### 5.4 Test Navigazione con Modifiche Non Salvate

1. Modifica un capitolo
2. Senza aspettare l'auto-save, clicca su un altro capitolo
3. **Verifica**:
   - ⚠️ Alert/dialog di conferma: "Hai modifiche non salvate. Vuoi salvare prima di procedere?"
   - ✅ Opzioni: "Salva e Procedi" / "Scarta Modifiche" / "Annulla"

---

### **STEP 6: Test Upload Allegati**

#### 6.1 Accesso alla Sezione Allegati

1. Clicca sulla tab/sezione **"Allegati"** o **"Attachments"** nella barra superiore del builder
2. Verifica che i 5 allegati simulati siano visibili:
   - Piano_Industriale_2023-2027.pdf (2.4 MB)
   - Certificazioni_ISO_2023.pdf (1.8 MB)
   - Tabella_KPI_Sostenibilita_2023.xlsx (987 KB)
   - Mappa_Territori_Serviti.png (623 KB)
   - Relazione_Assurance_Deloitte.pdf (1.2 MB)

#### 6.2 Upload Nuovo Allegato (Simulato)

1. Clicca su **"Aggiungi Allegato"** o pulsante simile
2. Nella finestra di dialogo:
   - Seleziona un file locale (qualsiasi PDF, immagine o documento)
   - Aggiungi una descrizione: "Test upload allegato"
3. Clicca **"Carica"**

#### 6.3 Verificare Upload

- ✅ Nuovo allegato appare nella lista
- ✅ Nome file corretto
- ✅ Dimensione visualizzata
- ✅ Data upload = oggi
- ✅ Icona tipo file corretta (PDF, Excel, PNG, etc.)

#### 6.4 Test Rimozione Allegato

1. Hover su un allegato di test (non quelli simulati)
2. Clicca sull'icona **"🗑️ Elimina"** o simile
3. **Verifica**:
   - ⚠️ Conferma: "Sei sicuro di voler eliminare questo allegato?"
   - ✅ Allegato rimosso dalla lista dopo conferma

---

### **STEP 7: Test Auto-Generazione Capitolo 3**

⚠️ **NOTA**: Questa funzionalità richiede che `chapter3Generator.js` sia integrato nel componente

#### 7.1 Navigare al Capitolo 3

1. Clicca su "Capitolo 3: Analisi di Materialità"
2. Verifica che sia presente un pulsante **"🤖 Auto-Genera Contenuto"** o simile

#### 7.2 Avviare Auto-Generazione

1. Clicca sul pulsante di auto-generazione
2. **Verifica durante il processo**:
   - ⏳ Spinner/loader: "Generazione in corso..."
   - ⏳ Progress indicator se disponibile

#### 7.3 Verifica Contenuto Generato

Dopo la generazione (5-10 secondi), controlla che il capitolo contenga:

✅ **Executive Summary**:

- Numero totale temi materiali (es: "15 temi doppiamente materiali")
- Percentuale copertura ESRS (es: "93% requisiti disclosure")

✅ **Sezione Metodologia**:

- Descrizione ISO 26000
- Spiegazione Double Materiality

✅ **Tabella Temi Materiali**:

- Colonne: Tema, Impatto, Finanziario, ESRS, SDG
- Almeno 10-15 righe

✅ **Analisi per Quadranti**:

- Doppiamente materiali
- Solo impatto
- Solo finanziario
- Non materiali

✅ **Conclusioni**:

- Prossimi passi
- Frequenza revisione

#### 7.4 Verifica Persistenza

1. Naviga ad un altro capitolo
2. Torna al Capitolo 3
3. ✅ Contenuto generato ancora presente (salvato in localStorage/state)

---

### **STEP 8: Test Export Word**

#### 8.1 Preparazione Export

1. Assicurati che almeno 5-6 capitoli abbiano contenuto
2. Verifica che il `completionPercentage` sia ≥ 70%

#### 8.2 Avvio Export Word

1. Clicca sul pulsante **"📥 Esporta Word"** o **"Download DOCX"** nella barra superiore
2. **Verifica durante il processo**:
   - ⏳ Messaggio: "Generazione documento in corso..."
   - ⏳ Progress bar se disponibile

#### 8.3 Download File

1. Aspetta il completamento (10-20 secondi)
2. **Verifica**:
   - ✅ Browser inizia download automatico
   - ✅ Nome file: `Bilancio_Sostenibilita_Gruppo_HERA_2023.docx`
   - ✅ Dimensione: ~50-150 KB (a seconda dei contenuti)

#### 8.4 Apertura e Verifica Documento Word

Apri il file scaricato con Microsoft Word o LibreOffice:

✅ **Frontespizio**:

- Titolo: "BILANCIO DI SOSTENIBILITÀ 2023"
- Azienda: "Gruppo HERA S.p.A."
- Anno: 2023

✅ **Indice** (se implementato):

- Lista tutti i 10 capitoli
- Numerazione pagine corretta

✅ **Metadata** (prime pagine):

- Settore: Multiutility
- Dipendenti: 9.700
- Territori: 190 comuni
- Certificazioni: ISO 9001, 14001, 45001, 50001

✅ **Capitoli**:

- Titoli formattati (Heading 1)
- Sezioni formattate (Heading 2)
- Testo corpo leggibile
- Liste puntate/numerate preservate
- Grassetti e formattazioni mantenute

✅ **KPI e Dati**:

- Numeri e percentuali visibili
- Tabelle (se presenti) formattate correttamente
- Grafici/immagini (se implementati) inseriti

✅ **Footer/Header** (se implementati):

- Numero pagina
- Nome azienda / titolo documento

---

### **STEP 9: Test Export PDF**

⚠️ **NOTA**: Se l'export PDF non è implementato direttamente, puoi convertire il DOCX generato in PDF

#### 9.1 Export Diretto (se disponibile)

1. Clicca sul pulsante **"📥 Esporta PDF"**
2. Aspetta la generazione (potrebbe richiedere più tempo del DOCX)
3. Verifica download: `Bilancio_Sostenibilita_Gruppo_HERA_2023.pdf`

#### 9.2 Conversione DOCX → PDF (alternativa)

1. Apri il file `Bilancio_Sostenibilita_Gruppo_HERA_2023.docx` in Word
2. Vai su **File → Salva con nome → PDF**
3. Salva come PDF

#### 9.3 Verifica PDF

Apri il PDF generato:

✅ **Qualità**:

- Testo selezionabile (non immagine)
- Font leggibili
- Layout preservato

✅ **Navigazione**:

- Bookmarks/segnalibri per i capitoli (se implementati)
- Collegamenti interni funzionanti

✅ **Stampa**:

- Prova a stampare 2-3 pagine
- Verifica che margini e layout siano corretti

---

### **STEP 10: Test Validazione**

⚠️ **NOTA**: Questa funzionalità è da implementare in TEST-5

#### 10.1 Test Capitolo Incompleto

1. Crea un nuovo bilancio o svuota un capitolo esistente
2. Riduci il contenuto a meno di 50 parole
3. **Verifica**:
   - ⚠️ Warning badge: "⚠️ Contenuto insufficiente"
   - ⚠️ Tooltip: "Minimo 100 parole richieste"

#### 10.2 Test Completamento < 80%

1. Riduci il `completionPercentage` a 65%
2. **Verifica**:
   - ⚠️ Banner in alto: "Attenzione: bilancio completato solo al 65%. Si consiglia di completare almeno l'80% prima dell'export."

#### 10.3 Test Campi Obbligatori Mancanti

1. Rimuovi il nome azienda dai metadata
2. Prova ad esportare
3. **Verifica**:
   - ❌ Blocco export
   - ⚠️ Messaggio: "Campi obbligatori mancanti: Nome Azienda"

---

## 📊 Checklist Completa Risultati Attesi

### Import

- [x] File JSON caricato senza errori
- [x] Metadata visualizzati correttamente
- [x] 10 capitoli popolati nella sidebar
- [x] Progress bar mostra 90%
- [x] 5 allegati visibili nella lista

### Navigazione

- [x] Click su ogni capitolo mostra contenuto corretto
- [x] Word count aggiornato per ogni capitolo
- [x] Badge status corretti (✓ Completo, 🤖 Auto-generato)
- [x] Scroll fluido tra capitoli lunghi

### Editing

- [x] Modifiche al testo salvate automaticamente
- [x] Word count si aggiorna in tempo reale
- [x] Alert conferma se navigazione con modifiche non salvate
- [x] Timestamp lastModified aggiornato

### Allegati

- [x] Lista allegati esistenti visibile
- [x] Upload nuovo allegato funziona
- [x] Dimensione e tipo file corretti
- [x] Eliminazione allegato con conferma

### Auto-Generazione Cap. 3

- [x] Pulsante "Auto-Genera" presente
- [x] Generazione completata in <10 secondi
- [x] Contenuto strutturato con sezioni definite
- [x] Dati da test-data-materiality-COMPLETE.json integrati
- [x] Contenuto persistente dopo navigazione

### Export Word

- [x] Download file DOCX avviato
- [x] Nome file corretto
- [x] Dimensione ~50-150 KB
- [x] Frontespizio presente
- [x] Capitoli formattati correttamente
- [x] KPI e dati leggibili
- [x] Liste e formattazione preservate

### Export PDF

- [x] Download file PDF avviato
- [x] Testo selezionabile
- [x] Layout preservato
- [x] Stampabile correttamente

### Validazione (opzionale)

- [ ] Warning per contenuto insufficiente
- [ ] Alert per completamento < 80%
- [ ] Blocco export se campi obbligatori mancanti

---

## 🐛 Troubleshooting

### Problema: File JSON non si carica

**Soluzione**:

1. Verifica che il file sia in `frontend/public/`
2. Controlla la console browser per errori di parsing JSON
3. Valida il JSON con un tool online (es: jsonlint.com)

### Problema: Capitolo 3 non si auto-genera

**Soluzione**:

1. Verifica che `test-data-materiality-COMPLETE.json` esista in `frontend/public/`
2. Controlla che `chapter3Generator.js` sia importato correttamente nel componente
3. Controlla la console per errori JavaScript

### Problema: Export Word fallisce

**Soluzione**:

1. Verifica che la libreria `docx` sia installata: `npm list docx`
2. Controlla la console per errori durante la generazione
3. Prova a esportare con meno capitoli per identificare quale causa problemi
4. Verifica che `reportExport.js` sia aggiornato alla versione corrente

### Problema: Allegati non visibili

**Soluzione**:

1. Verifica che l'array `attachments[]` nel JSON contenga elementi
2. Controlla che il componente rendering allegati sia implementato
3. Verifica che le icone/immagini per i tipi file siano disponibili

---

## 📈 Metriche di Successo

Un test è considerato **SUPERATO** se:

✅ **Import**: 100% file caricati senza errori  
✅ **Navigazione**: 10/10 capitoli accessibili  
✅ **Editing**: Auto-save funziona in <3 secondi  
✅ **Allegati**: Upload e rimozione senza errori  
✅ **Auto-Gen Cap. 3**: Contenuto generato in <10 secondi  
✅ **Export Word**: Download completato, file apribile e leggibile  
✅ **Export PDF**: Download completato, file stampabile

---

## 🚀 Prossimi Passi

Dopo aver completato tutti i test:

1. **Documentare risultati**: Crea un report con screenshot e note
2. **Segnalare bug**: Apri issue su GitHub per ogni problema riscontrato
3. **Feedback UX**: Annota eventuali miglioramenti UI/UX
4. **Performance**: Misura tempi di caricamento, generazione, export
5. **Accessibilità**: Verifica navigazione da tastiera, screen reader support

---

## 📞 Supporto

Per domande o problemi durante il testing, contattare il team di sviluppo o aprire una issue su GitHub con:

- Descrizione del problema
- Screenshot/console logs
- Browser e versione (es: Chrome 120, Firefox 121)
- Sistema operativo

---

**Versione Guida**: 1.0  
**Data Creazione**: 28 Ottobre 2025  
**Autore**: AI Assistant  
**Ultima Revisione**: 28 Ottobre 2025
