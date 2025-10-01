# 🧪 Guida Completa al Test dell'App ESRS-PWA

## 🚀 Preparazione e Avvio

### Passo 1: Avvio Applicazione

```powershell
# Naviga nella directory frontend
cd "C:\Users\pasca\OneDrive - QS Studio\Bilanci Sostenibilità ESG - Documenti\esrs-pwa\frontend"

# Installa dipendenze se necessario
npm install

# Avvia l'applicazione
npm start
```

**✅ Risultato Atteso**: L'app si apre su `http://localhost:3000`

---

## 📋 FASE 1: Test Funzionalità Base ESRS

### Test 1.1: Creazione Nuovo Audit

1. **Clicca "Nuovo audit"**
2. **Compila i campi**:
   ```
   Nome azienda: "Test MaterialitàCorp SpA"
   Fatturato: "25000000" (25 milioni - Media impresa)
   Dipendenti: "150"
   Totale attivo: "15000000"
   ```
3. **Clicca "Crea"**

**✅ Verifica**:

- L'audit viene creato
- Si apre la checklist ESRS
- Dimensione calcolata: "Media"
- Progress bar mostra 0% completamento

### Test 1.2: Navigazione Checklist ESRS

1. **Espandi sezioni** (ESRS-E1, ESRS-E2, etc.)
2. **Testa completamento item**:
   - Clicca checkbox per marcare completato
   - Aggiungi commento: "Test completamento"
   - Carica file di evidenza (se disponibile)
3. **Verifica aggiornamento progress bar**

**✅ Verifica**:

- Progress bar si aggiorna in tempo reale
- Contatori sezioni cambiano
- Stato persistito in localStorage

---

## 🎯 FASE 2: Test Sistema Materialità (NUOVO)

### Test 2.1: Accesso Tab Materialità

1. **Clicca tab "🎯 Analisi Materialità"** (dovrebbe apparire in alto)
2. **Verifica caricamento componenti**

**✅ Verifica**:

- Tab materialità visibile
- Caricamento sottotab: Matrice, Survey, Analisi, Report Word Demo
- Nessun errore console

### Test 2.2: Matrice di Materialità Interattiva

1. **Nel tab "🎯 Matrice Materialità"**:
   - Verifica presenza 10 temi ESRS predefiniti
   - Temi visibili: "Cambiamenti Climatici", "Forza Lavoro Propria", etc.
2. **Test controlli soglia**:
   - Muovi slider soglia materialità (1-5)
   - Verifica aggiornamento valore in tempo reale
3. **Test modalità posizionamento**:
   - Clicca "✏️ Modifica Posizioni"
   - Verifica attivazione modalità (messaggio "🎯 Modalità Posizionamento Attiva")
   - Clicca sulla matrice per posizionare temi
4. **Test aggiunta tema custom**:
   - Clicca "+ Aggiungi Tema Custom"
   - Inserisci nome: "Innovazione Digitale Test"
   - Verifica che appaia nella lista

**✅ Verifica**:

- Matrice 5x5 visibile con quadranti colorati
- Soglia funziona correttamente
- Posizionamento temi interattivo
- Temi custom aggiungibili
- Persistenza dati (ricarica pagina per verificare)

### Test 2.3: Survey Stakeholder Builder

1. **Clicca tab "📊 Survey Stakeholder"**
2. **Crea nuovo questionario**:
   - Clicca "+ Nuovo Questionario"
   - Nome: "Test Survey Materialità 2025"
   - Descrizione: "Questionario test per validazione"
3. **Seleziona gruppi stakeholder**:
   - Seleziona: Dipendenti, Clienti, Fornitori
4. **Aggiungi domande**:
   - Clicca "+ Rating Materialità"
   - Clicca "+ Feedback Aperto"
   - Verifica che le domande appaiano numerate
5. **Salva questionario**:
   - Clicca "💾 Salva"

**✅ Verifica**:

- Survey builder funziona
- Domande aggiunte correttamente
- Questionario salvato e visibile nella lista
- Conteggio "2 domande" visibile

### Test 2.4: Analisi e Report Materialità

1. **Clicca tab "📈 Analisi & Report"**
2. **Verifica riepilogo esecutivo**:
   - Contatori quadranti (Temi Critici, Focus Impatto, etc.)
   - Distribuzione numerica corretta
3. **Test export report**:
   - Clicca "📄 Export Report ESRS"
   - Verifica download file JSON
   - Controlla nome file: `MaterialityReport_YYYY-MM-DD.json`

**✅ Verifica**:

- Dashboard analisi visibile
- Contatori quadranti aggiornati
- Export funziona (file scaricato)
- Raccomandazioni strategiche presenti

---

## 📄 FASE 3: Test Report Word con Materialità (FUNZIONALITÀ PRINCIPALE)

### Test 3.1: Demo Report Word

1. **Clicca tab "📄 Report Word Demo"**
2. **Verifica interfaccia demo**:
   - Radio buttons HERA/ENEL visibili
   - Anteprima dati aziendali
   - Distribuzione quadranti materialità
3. **Seleziona dataset**:
   - Prova entrambi: HERA Spa e ENEL SpA
   - Verifica cambio dati in tempo reale

**✅ Verifica**:

- Demo interface completa
- Switch dataset funziona
- Dati HERA: 10 temi, 3 critici, €12.5B fatturato
- Dati ENEL: 6 temi, 3 critici, €85.7B fatturato

### Test 3.2: Generazione Report Completo

1. **Con dataset HERA selezionato**:
   - Clicca "📄 Genera Report Word con Materialità"
   - Attendi elaborazione (pochi secondi)
2. **Verifica download automatico**:
   - File `.txt` scaricato automaticamente
   - Nome tipo: `Report_ESRS_HERA_Spa_Materialità.txt`

**✅ Verifica**:

- File scaricato correttamente
- Nessun errore durante generazione
- Messaggio successo visibile

### Test 3.3: Contenuto Report Word

**Apri il file scaricato e verifica sezioni**:

1. **Executive Summary**:

   ```
   Cliente: HERA Spa
   Dimensione aziendale: Grande
   Stato completamento: 73%
   ```

2. **SEZIONE MATERIALITÀ (NUOVA)**:

   ```
   ANALISI DI MATERIALITÀ (PDR 134:2022)
   ========================================

   METODOLOGIA DOPPIA MATERIALITÀ
   ==============================
   Inside-out vs Outside-in spiegata

   TEMI MATERIALI IDENTIFICATI
   ===========================
   Totale temi analizzati: 10
   Temi critici: 3
   ```

3. **GRAFICO ASCII**:

   ```
             5 │ ╭─────┬─────╮ ← Alto Impatto
               │ │ FOC │ CRI │
               │ │ IMP │ TIC │
      I      4 │ │     │     │
      m        │ ├─────┼─────┤   Soglia: 3.5
      p      3 │ │     │     │
      a        │ ├─────┼─────┤
      t      2 │ │ MON │ FIN │
      t        │ │     │ REL │
      o      1 │ ╰─────┴─────╯
               └─┴─┴─┴─┴─┴─┴─┴─
                1 2 3 4 5
           Rilevanza Finanziaria →
   ```

4. **DETTAGLIO QUADRANTI**:

   ```
   QUADRANTE CRITICO - Massima priorità strategica:
   1. Transizione Energetica e Cambiamenti Climatici
      Impatto: 4.8/5 | Rilevanza Finanziaria: 4.6/5
      Descrizione: Decarbonizzazione, fonti rinnovabili...

   2. Economia Circolare e Gestione Rifiuti
      Impatto: 4.5/5 | Rilevanza Finanziaria: 4.4/5

   3. Gestione Risorse Idriche
      Impatto: 4.6/5 | Rilevanza Finanziaria: 4.2/5
   ```

5. **RACCOMANDAZIONI**:
   ```
   RACCOMANDAZIONI MATERIALITÀ
   ===========================
   1. AZIONE IMMEDIATA sui 3 temi critici identificati
   2. PIANO STRATEGICO per temi a focus impatto
   3. MONITORAGGIO FINANZIARIO per temi business
   ```

**✅ Verifica**:

- Report completo con tutte le sezioni
- Grafico ASCII ben formattato
- Dati realistici HERA presenti
- Metodologia PDR 134:2022 spiegata
- Raccomandazioni strategiche specifiche

---

## 🔄 FASE 4: Test Integrazione e Persistenza

### Test 4.1: Persistenza Dati

1. **Ricarica la pagina** (F5)
2. **Verifica che rimangano**:
   - Audit creato
   - Completamenti checklist ESRS
   - Temi materialità aggiunti
   - Survey creati

**✅ Verifica**:

- Tutti i dati persistono in localStorage
- Nessuna perdita informazioni

### Test 4.2: Switch tra Tab

1. **Naviga tra tutti i tab**:
   - Checklist ESRS ↔ Analisi Materialità
   - Matrice ↔ Survey ↔ Analisi ↔ Report Demo
2. **Verifica che i dati rimangano consistenti**

**✅ Verifica**:

- Navigation fluida
- Nessun errore console
- Dati coerenti tra tab

### Test 4.3: Test con Diversi Audit

1. **Crea secondo audit**:
   - Nome: "Test ENEL Simulation"
   - Fatturato: 85000000000 (85 miliardi)
   - Dipendenti: 60000
2. **Verifica detection settore**:
   - Should detect "energy" sector
   - Materialità dovrebbe usare dati appropriati

**✅ Verifica**:

- Multi-audit support
- Sector detection funziona
- Dati isolati per audit

---

## 🚨 FASE 5: Test Casi Edge e Errori

### Test 5.1: Validazione Input

1. **Test campi obbligatori**:
   - Prova creare audit senza nome azienda
   - Inserisci valori negativi
2. **Test limiti soglia materialità**:
   - Prova valori sotto 1 e sopra 5

### Test 5.2: Test Performance

1. **Apri DevTools** (F12)
2. **Monitora**:
   - Console per errori
   - Network per richieste
   - Performance per lentezza

### Test 5.3: Test Browser Compatibility

- **Chrome**: Funzionalità complete
- **Firefox**: Verifica compatibilità
- **Edge**: Test download file

---

## 📊 CHECKSHEET FINALE

### ✅ Funzionalità Base ESRS

- [ ] Creazione audit
- [ ] Checklist navigation
- [ ] Progress tracking
- [ ] File upload evidenze
- [ ] Export report base

### ✅ Sistema Materialità

- [ ] Matrice interattiva 5x5
- [ ] Soglia materialità configurabile
- [ ] Posizionamento temi drag-drop
- [ ] Temi ESRS predefiniti (10)
- [ ] Aggiunta temi custom
- [ ] Quadranti colorati

### ✅ Survey Stakeholder

- [ ] Creazione questionari
- [ ] Tipologie domande multiple
- [ ] Targeting stakeholder groups
- [ ] Salvataggio survey
- [ ] Lista survey gestiti

### ✅ Analisi Materialità

- [ ] Dashboard quadranti
- [ ] Contatori automatici
- [ ] Export JSON report
- [ ] Raccomandazioni strategiche

### ✅ Report Word Enhanced

- [ ] Demo interface funzionante
- [ ] Switch dataset HERA/ENEL
- [ ] Generazione report completo
- [ ] Download automatico
- [ ] Sezione materialità nel report
- [ ] Grafico ASCII ben formattato
- [ ] Dati realistici integrati

### ✅ Integrazione e UX

- [ ] Tab navigation fluida
- [ ] Persistenza localStorage
- [ ] Multi-audit support
- [ ] Performance accettabile
- [ ] Zero errori console
- [ ] Responsive design

---

## 🎯 Risultati Attesi

Al completamento di tutti i test dovresti avere:

1. **📱 App funzionante** con tutte le feature
2. **📊 Sistema materialità** completo e interattivo
3. **📄 Report Word** con grafico materialità scaricabile
4. **🔄 Integrazione seamless** tra funzionalità esistenti e nuove
5. **💾 Dati persistiti** e recuperabili

## 🆘 Troubleshooting

**Problema: App non si avvia**

```powershell
# Reinstalla dipendenze
npm install --force

# Pulisci cache
npm start --reset-cache
```

**Problema: Report non scarica**

- Verifica popup blocker browser
- Controlla permessi download
- Prova browser diverso

**Problema: Dati non persistono**

- Verifica localStorage abilitato
- Controlla spazio disco disponibile
- Testa in modalità incognito

---

_🧪 Guida completa per testing dell'app ESRS-PWA Enhanced_  
_📋 Segui passo-passo per validazione completa del sistema_
