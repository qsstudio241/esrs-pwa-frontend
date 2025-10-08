# ANALISI COMPLIANCE ESRS E PIANO PRIORITARIO

**Documento:** Specifica di Progetto - Analisi Gap e Roadmap  
**Data:** 6 Ottobre 2025  
**Versione:** 1.0  
**Autore:** Analisi Tecnica QS Studio

---

## 🎯 EXECUTIVE SUMMARY

### Obiettivo del Progetto

L'ESRS PWA deve essere una **piattaforma di compliance ESRS completa** che guida le aziende attraverso l'intero processo normativo per la redazione di bilanci di sostenibilità conformi alla Direttiva CSRD.

### Stato Attuale

Il progetto ha una **base solida** ma presenta **gap critici** che impediscono la compliance normativa completa.

### Azione Richiesta

Trasformazione da "checklist digitale" a "piattaforma guidata di compliance ESRS" con focus su analisi di materialità, flusso strutturato e export conforme.

---

## 📋 FLUSSO DI LAVORO NORMATIVO ESRS

### FASE 1: CLASSIFICAZIONE AZIENDALE ✅ IMPLEMENTATA

- **Determinare dimensione aziendale** (fatturato, dipendenti, attivo)
- **Identificare requisiti applicabili** per dimensione
- **Stabilire tempistiche** di compliance
- **Status**: ✅ Funziona correttamente con sistema di filtraggio robusto

### FASE 2: ANALISI DI MATERIALITÀ ❌ CRITICA

- **Doppia materialità**: impatti materiali (inside-out) + rischi finanziari (outside-in)
- **Stakeholder engagement**: consultazione portatori di interesse
- **Valutazione impatti**: ambiente, società, governance
- **Matrice di materialità**: classificazione per importanza/probabilità
- **Status**: ❌ **ROTTA** - MaterialityManagement causa crash dell'app
- **Criticità**: 🔴 **ALTA** - Obbligatoria per legge (Art. 19bis CSRD)

### FASE 3: RACCOLTA DATI ESRS ✅ PARZIALMENTE IMPLEMENTATA

- **Standards E1-E5**: Ambiente (clima, inquinamento, acqua, biodiversità, risorse)
- **Standards S1-S4**: Sociale (lavoratori, catena valore, comunità, consumatori)
- **Standards G1-G5**: Governance (condotta, rischi, remunerazione, trasparenza)
- **Status**: ✅ Checklist completa (15 categorie, 100+ elementi), KPI integrati
- **Gap**: Manca guidance su contenuti specifici per ogni elemento

### FASE 4: RENDICONTAZIONE ❌ NON IMPLEMENTATA

- **Redazione narrativa**: strategie, processi, governance
- **Reporting quantitativo**: KPI, metriche, obiettivi
- **Collegamenti trasversali**: integrazione temi ESG
- **Status**: ❌ Export Word non conforme alla struttura ESRS richiesta

### FASE 5: PUBBLICAZIONE ❌ NON IMPLEMENTATA

- **Bilancio di sostenibilità**: documento finale strutturato
- **Integrazione con bilancio finanziario**
- **Monitoraggio continuo**: tracking progressi vs obiettivi

---

## 🔍 VALUTAZIONE IMPLEMENTAZIONE ATTUALE

### ✅ PUNTI DI FORZA

1. **Classificazione dimensione aziendale** - Sistema di filtraggio efficace
2. **Checklist ESRS completa** - 15 categorie con 100+ elementi normativi
3. **Sistema KPI integrato** - Raccolta dati quantitativi per ogni standard
4. **Persistenza dati robusta** - Storage locale per continuità del lavoro
5. **Export multi-formato** - Word, HTML, JSON per diversi usi
6. **Architettura modulare** - Hooks e componenti ben strutturati

### ❌ GAP CRITICI IDENTIFICATI

#### 1. MATERIALITÀ NON FUNZIONANTE 🔴 CRITICO

- **Problema**: MaterialityManagement.js causa crash dell'applicazione
- **Impatto**: Impossibilità di completare l'analisi di materialità obbligatoria
- **Normativa violata**: Art. 19bis Direttiva CSRD - "assessment of materiality"
- **Priorità**: MASSIMA - Blocca compliance legale

#### 2. FLUSSO NON STRUTTURATO 🔴 CRITICO

- **Problema**: Manca processo guidato step-by-step
- **Impatto**: Utenti persi, non sanno ordine delle attività
- **Normativa violata**: ESRS 1 - "systematic approach"
- **Priorità**: ALTA - Compromette usabilità

#### 3. EXPORT NON CONFORME 🔴 CRITICO

- **Problema**: Documento Word non segue struttura ESRS
- **Impatto**: Output non utilizzabile per compliance
- **Normativa violata**: ESRS 1 - "structure of sustainability statement"
- **Priorità**: ALTA - Output finale non valido

#### 4. GUIDANCE INSUFFICIENTE 🟡 MEDIA

- **Problema**: Nessuna guida su contenuti richiesti per ogni elemento
- **Impatto**: Qualità delle informazioni inserite insufficiente
- **Priorità**: MEDIA - Migliorerebbe significativamente la completezza

---

## 🚀 PIANO DI AZIONE PRIORITARIO

### 🔴 FASE 1: RIPRISTINO FUNZIONALITÀ CRITICHE (Settimana 1-2)

#### 1.1 MaterialityManagement - PRIORITÀ MASSIMA

```
OBIETTIVO: Ripristinare analisi di materialità funzionante
AZIONI:
- Analizzare MaterialityManagement_Original.js (1556 righe)
- Identificare cause del crash (dipendenze, import, performance)
- Creare versione semplificata ma funzionante
- Implementare matrice materialità di base
- Test completo prima del rilascio

RISULTATO ATTESO:
✅ Analisi materialità completabile senza crash
✅ Matrice impatti vs probabilità funzionante
✅ Integrazione con il resto dell'app

CRITERI DI SUCCESSO:
- App non crasha quando si accede al tab "Analisi & Report"
- Matrice di materialità salvabile e caricabile
- Dati materialità integrati nell'export
```

#### 1.2 Export ESRS-Compliant - PRIORITÀ ALTA

```
OBIETTIVO: Documento Word conforme alla struttura ESRS
AZIONI:
- Studiare struttura richiesta da ESRS 1
- Creare template Word professionale con sezioni:
  * Executive Summary
  * Analisi di Materialità
  * Standards Applicabili per Dimensione
  * Dati KPI e Metriche
  * Politiche e Azioni per Standard
  * Obiettivi e Timeline
- Integrare dati materialità nell'export
- Validazione con esempi reali

RISULTATO ATTESO:
✅ Documento Word strutturato secondo ESRS 1
✅ Integrazione automatica dati checklist + KPI + materialità
✅ Layout professionale per presentazione stakeholder

CRITERI DI SUCCESSO:
- Export contiene tutte le sezioni richieste da ESRS
- Dati popolati automaticamente da app
- Formato professionale utilizzabile per compliance
```

### 🟡 FASE 2: MIGLIORAMENTO FLUSSO UTENTE (Settimana 3-4)

#### 2.1 Wizard Guidato

```
OBIETTIVO: Processo step-by-step per compliance ESRS
COMPONENTI:
1. Setup iniziale (dimensione, settore, tempistiche)
2. Analisi materialità guidata
3. Raccolta dati per standards applicabili
4. Validazione completezza
5. Generazione bilancio finale

RISULTATO ATTESO:
✅ Flusso lineare e comprensibile
✅ Indicatori di progresso chiari
✅ Validazione step-by-step
```

#### 2.2 Guidance Contestuale

```
OBIETTIVO: Aiutare utenti a completare ogni elemento correttamente
COMPONENTI:
- Tooltip informativi per ogni elemento ESRS
- Esempi di contenuto per politiche/azioni/obiettivi
- Validazione campi obbligatori
- Suggerimenti basati su dimensione aziendale

RISULTATO ATTESO:
✅ Qualità informazioni inserite migliorata
✅ Riduzione errori di completamento
✅ UX più professionale
```

### 🟢 FASE 3: OTTIMIZZAZIONE E FEATURES AVANZATE (Settimana 5+)

#### 3.1 Dashboard Compliance

```
- Overview stato di avanzamento per standard
- Indicatori di conformità per dimensione
- Timeline verso scadenze normative
- Alert per elementi mancanti critici
```

#### 3.2 Integrazione Esterna

```
- Import dati da ERP/sistemi gestionali
- Export verso standard internazionali (GRI, SASB)
- Sincronizzazione con piattaforme ESG
```

---

## 📊 METRICHE DI SUCCESSO

### Indicatori Tecnici

- ✅ App non crasha (uptime 99%+)
- ✅ MaterialityManagement completabile in <10 min
- ✅ Export Word generato in <30 sec
- ✅ Dati persistiti correttamente (0% perdite)

### Indicatori di Compliance

- ✅ Tutti gli elementi ESRS obbligatori presenti
- ✅ Struttura documento conforme ESRS 1
- ✅ Analisi materialità completata
- ✅ KPI raccolti per standards applicabili

### Indicatori UX

- ✅ Flusso completabile da utente non-esperto
- ✅ Tempo completamento <4 ore per PMI
- ✅ Documentazione auto-esplicativa
- ✅ Feedback positivo da test utenti

---

## 🎯 ROADMAP TIMELINE

```
SETTIMANA 1-2: 🔴 EMERGENZA
├── MaterialityManagement funzionante
├── Export Word base conforme ESRS
└── Stabilità applicazione garantita

SETTIMANA 3-4: 🟡 MIGLIORAMENTO
├── Wizard guidato implementato
├── Guidance contestuale aggiunta
└── UX ottimizzata per compliance

SETTIMANA 5+: 🟢 EVOLUZIONE
├── Dashboard compliance avanzata
├── Integrazioni esterne
└── Features innovative
```

---

## 🔧 CONSIDERAZIONI TECNICHE

### Architettura Attuale (Mantenerla)

- ✅ React Hooks per state management
- ✅ Storage locale per persistenza
- ✅ Componenti modulari ben strutturati
- ✅ Sistema export multi-formato

### Modifiche Richieste

- 🔧 Refactor MaterialityManagement per stabilità
- 🔧 Nuovo template Word conforme ESRS
- 🔧 Wizard component per flusso guidato
- 🔧 Validation layer per completezza

### Rischi Tecnici da Mitigare

- 🚨 Performance con dataset grandi (chunking)
- 🚨 Compatibilità browser (testing multi-browser)
- 🚨 Perdita dati durante crash (auto-save frequente)

---

## 📚 RIFERIMENTI NORMATIVI

### Direttiva CSRD (EU) 2022/2464

- Art. 19bis: Corporate sustainability reporting
- Art. 29bis: Doppia materialità obbligatoria

### Standard ESRS

- **ESRS 1**: Principi generali di rendicontazione
- **ESRS 2**: Informazioni generali di governance
- **ESRS E1-E5**: Standard ambientali
- **ESRS S1-S4**: Standard sociali
- **ESRS G1**: Standard di governance

### Timeline Normative

- **2024**: Grandi imprese (>500 dipendenti)
- **2025**: Medie imprese (>250 dipendenti)
- **2026**: Piccole imprese quotate (>50 dipendenti)

---

## ✅ CONCLUSIONI E NEXT STEPS

### Situazione Attuale

Il progetto ESRS PWA ha **fondamenta solide** ma presenta **gap critici** che impediscono la compliance normativa completa. La priorità assoluta è ripristinare la stabilità dell'applicazione e l'analisi di materialità.

### Raccomandazioni Immediate

1. **🔴 EMERGENZA**: Ripristinare MaterialityManagement entro 1 settimana
2. **🔴 CRITICO**: Implementare export Word conforme ESRS entro 2 settimane
3. **🟡 IMPORTANTE**: Aggiungere wizard guidato entro 1 mese

### Potenziale del Progetto

Con gli interventi prioritari, l'ESRS PWA può diventare la **piattaforma di riferimento** per la compliance ESRS in Italia, offrendo un flusso completo e guidato per bilanci di sostenibilità conformi.

### Prossimo Step

**Iniziare IMMEDIATAMENTE con il ripristino di MaterialityManagement** - è il blocco più critico che impedisce l'utilizzo pratico dell'applicazione.

---

**FINE DOCUMENTO**  
**Versione**: 1.0 - 6 Ottobre 2025
