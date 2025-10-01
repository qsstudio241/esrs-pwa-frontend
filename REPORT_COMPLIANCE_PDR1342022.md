# 📋 REPORT COMPLIANCE PDR1342022: Flusso di Lavoro Sostenibilità

**Data analisi**: 1 ottobre 2025  
**App Version**: https://esrs.netlify.app  
**Standard di riferimento**: PDR 134:2022 - Bilanci di sostenibilità

## 🎯 OVERVIEW FLUSSO PDR1342022

Il flusso di lavoro PDR1342022 prevede 5 fasi principali per la redazione di bilanci di sostenibilità:

1. **Identificazione Stakeholder e Materialità**
2. **Analisi Impatti, Rischi e Opportunità (Doppia Matrice)**
3. **Definizione Indicatori KPI**
4. **Raccolta e Analisi Dati**
5. **Redazione Bilancio**

---

## ✅ STATO IMPLEMENTAZIONE PER FASE

### 1️⃣ IDENTIFICAZIONE STAKEHOLDER E MATERIALITÀ

**🎯 Requisito PDR**: Coinvolgimento attivo stakeholder, identificazione aspetti sostenibilità rilevanti, survey personalizzati, analisi dati avanzati

**📊 Stato implementazione**: ⚠️ **PARZIALE (30%)**

**✅ Presente**:

- KPI Schema "Doppia materialità" in `src/utils/kpiSchemas.js`:
  ```javascript
  {
    key: "valutazione_materialita_eseguita",
    label: "Valutazione materialità eseguita",
    type: "bool",
    required: true
  },
  {
    key: "coinvolgimento_stakeholder",
    label: "Coinvolgimento stakeholder svolto",
    type: "bool",
    required: true
  }
  ```
- Metodologie supportate: ESRS/CSRD, Proprietaria, Altro
- Validazione obbligatorietà coinvolgimento stakeholder

**❌ Mancante**:

- **Survey Builder**: Strumento per creare questionari stakeholder personalizzati
- **Stakeholder Mapping**: Identificazione e categorizzazione stakeholder per tipologia
- **Data Collection Interface**: Form per raccogliere feedback stakeholder
- **Analytics Dashboard**: Analisi aggregata risposte stakeholder

**📁 File coinvolti**:

- `src/utils/kpiSchemas.js` (parziale)
- `src/checklists/esrs-base.json` (sezione Generale)

---

### 2️⃣ DOPPIA MATRICE DI MATERIALITÀ

**🎯 Requisito PDR**: Visualizzazione relazione impatti materiali/finanziari, prospettiva inside-out/outside-in

**📊 Stato implementazione**: ❌ **NON IMPLEMENTATO (0%)**

**✅ Presente**:

- Concetto teorico di "doppia materialità" nel KPI schema
- Campo `metodologia` per selezione framework

**❌ Mancante**:

- **Matrix Visualization**: Interfaccia grafica matrice 2x2 impatti/finanziari
- **Impact Assessment**: Strumenti per valutare intensità impatti inside-out
- **Financial Impact Analysis**: Valutazione rischi/opportunità outside-in
- **Interactive Plotting**: Posizionamento temi materialità su matrice
- **Materiality Threshold**: Definizione soglie rilevanza

**📁 File da implementare**:

- `src/components/MaterialityMatrix.js` (nuovo)
- `src/utils/materialityAnalysis.js` (nuovo)
- `src/hooks/useMaterialityData.js` (nuovo)

---

### 3️⃣ DEFINIZIONE INDICATORI KPI

**🎯 Requisito PDR**: Selezione KPI settoriali, KPI preconfigurati standard internazionali

**📊 Stato implementazione**: ✅ **BUONA (75%)**

**✅ Presente**:

- Sistema KPI robusto in `src/utils/kpiSchemas.js`
- KPI Stati: conforme, non conforme, N/A, opzionale
- Validazione inputs KPI con `validateKpiInputs()`
- Schemi KPI per sezione "Generale" completi
- Hooks `useKpiState` e `useKpiInputs` funzionanti
- Export KPI in Word/JSON/HTML

**⚠️ Parzialmente presente**:

- KPI preconfigurati solo per categoria "Generale"
- Standard ESRS supportati ma incompleti per tutti i settori

**❌ Mancante**:

- **Sector-Specific KPIs**: Libreria KPI per settori industriali specifici
- **International Standards**: Integrazione completa GRI, SASB, TCFD
- **KPI Recommendation Engine**: Suggerimenti KPI basati su settore/dimensione
- **Custom KPI Builder**: Creazione KPI personalizzati

**📁 File coinvolti**:

- `src/utils/kpiSchemas.js` ✅ (funzionante)
- `src/hooks/useKpiState.js` ✅ (funzionante)
- `src/hooks/useKpiInputs.js` ✅ (funzionante)
- `src/utils/kpiValidation.js` ✅ (funzionante)

---

### 4️⃣ RACCOLTA E ANALISI DATI

**🎯 Requisito PDR**: Raccolta automatizzata da fonti diverse, tracking progressi temporale, identificazione trend

**📊 Stato implementazione**: ⚠️ **PARZIALE (40%)**

**✅ Presente**:

- **Evidence Management**: Upload file evidenze per ogni checklist item
- **File Storage**: Integrazione File System Access API + fallback browser
- **Progress Tracking**: Calcolo avanzamento audit in tempo reale
- **Data Persistence**: Salvataggio stati in localStorage + export JSON
- **Audit History**: Export con timestamp e versioning

**⚠️ Parzialmente presente**:

- Raccolta manuale tramite form, non automatizzata
- Tracking temporale basic (timestamp), non trend analysis

**❌ Mancante**:

- **Data Connectors**: Integrazione ERP, CRM, database aziendali
- **Automated Data Ingestion**: Import automatico da fogli Excel, CSV
- **Time Series Analysis**: Dashboard trend storici performance
- **Data Validation Rules**: Controlli qualità dati automatici
- **Multi-Source Reconciliation**: Confronto dati da fonti diverse

**📁 File coinvolti**:

- `src/hooks/useEvidenceManager.js` ✅ (funzionante)
- `src/storage/StorageContext.js` ✅ (funzionante)
- `src/utils/progressUtils.js` ✅ (funzionante)

---

### 5️⃣ REDAZIONE BILANCIO

**🎯 Requisito PDR**: Report completi, personalizzabili, conformi GRI/ESRS

**📊 Stato implementazione**: ✅ **ECCELLENTE (90%)**

**✅ Presente**:

- **Word Export Dinamico**: Sistema docxtemplater con template professionali
- **ESRS Compliance**: Report conformi standard ESRS con tutte le sezioni
- **Multi-Format Export**: Word, HTML, JSON con dati strutturati
- **Company Classification**: Classificazione automatica Micro/Piccola/Media/Grande
- **Content Validation**: Test E2E che verificano contenuti Word (43KB documenti)
- **Professional Templates**: Template `template-bilancio.docx` professionale
- **Real-World Validation**: Test con dati Maire Tecnimont per benchmarking

**⚠️ Parzialmente presente**:

- Standard GRI supportato teoricamente ma non implementazione dedicata
- Personalizzazione limitata a template base

**❌ Mancante**:

- **GRI Standards Integration**: Report specifici per framework GRI
- **Custom Report Builder**: Editor WYSIWYG per personalizzazione layout
- **Multi-Language Support**: Report multilingue
- **PDF Export**: Export diretto PDF senza passare per Word

**📁 File coinvolti**:

- `src/utils/wordExport.js` ✅ (eccellente - 90%)
- `generateTemplateWithPlaceholders.js` ✅ (funzionante)
- `public/templates/template-bilancio.docx` ✅ (professionale)
- `tests-e2e/comprehensive-word-export.spec.ts` ✅ (validazione completa)

---

## 📈 RIEPILOGO COMPLIANCE COMPLESSIVA

| Fase                         | Implementazione | Priorità Sviluppo |
| ---------------------------- | --------------- | ----------------- |
| 1️⃣ Stakeholder & Materialità | 30%             | 🔴 ALTA           |
| 2️⃣ Doppia Matrice            | 0%              | 🔴 ALTA           |
| 3️⃣ KPI Definition            | 75%             | 🟡 MEDIA          |
| 4️⃣ Data Collection           | 40%             | 🟡 MEDIA          |
| 5️⃣ Report Generation         | 90%             | 🟢 BASSA          |

**COMPLIANCE MEDIA: 47%** ⚠️

---

## 🎯 RACCOMANDAZIONI SVILUPPO

### Priorità 1 - CRITICHE (per compliance PDR)

1. **Implementare Doppia Matrice di Materialità**
   - Component visualizzazione matrice interattiva
   - Algoritmi calcolo impatti inside-out/outside-in
2. **Stakeholder Engagement Tools**
   - Survey builder per questionari personalizzati
   - Dashboard analisi risposte stakeholder

### Priorità 2 - MIGLIORAMENTI

3. **Espandere KPI Settoriali**

   - Libreria KPI per industrie specifiche
   - Integrazione completa standard GRI/SASB

4. **Automatizzazione Raccolta Dati**
   - Connettori ERP/database aziendali
   - Import automatico da Excel/CSV

### Priorità 3 - ENHANCEMENT

5. **Report Customization**
   - Editor personalizzazione layout report
   - Export PDF diretto

---

## 📁 GUIDA MODIFICA CHECKLIST E KPI

### Modificare Contenuti Checklist ESRS

**File principale**: `frontend/src/checklists/esrs-base.json`

Struttura JSON:

```json
{
  "metadata": {
    "name": "ESRS Base Checklist",
    "version": "1.3",
    "totalItems": 45
  },
  "categories": {
    "Generale": {
      "title": "Informazioni Generali",
      "items": [
        {
          "id": "G001", // ID univoco
          "text": "Descrizione requirement",
          "applicability": ["Micro", "Piccola", "Media", "Grande"],
          "mandatory": true,
          "reference": "ESRS 1"
        }
      ]
    }
  }
}
```

**Per aggiungere nuova categoria**:

1. Aggiungere sezione in `categories`
2. Specificare `title`, `description`, `code` ESRS
3. Definire array `items` con requirements

**Per modificare applicabilità dimensioni**:

- Modificare array `applicability` per ogni item
- Valori supportati: "Micro", "Piccola", "Media", "Grande"

### Configurare Nuovi KPI

**File principale**: `frontend/src/utils/kpiSchemas.js`

```javascript
export function getKpiSchemasGenerale() {
  const schemas = {};

  // Trova itemId tramite ricerca testo
  const itemId = findItemId("Categoria", "Testo item");

  if (itemId) {
    schemas[itemId] = {
      title: "Nome KPI",
      fields: [
        {
          key: "campo_unique",
          label: "Label visualizzato",
          type: "bool|number|enum|text|date",
          required: true,
          enum: ["Val1", "Val2"], // solo per type enum
          min: 0, max: 100, // solo per number
          unit: "€" // per number
        }
      ],
      checks: [
        {
          code: "VALIDATION_CODE",
          message: "Messaggio errore",
          test: (inputs) => /* logica validazione */
        }
      ]
    };
  }

  return schemas;
}
```

**File supporto**:

- `frontend/src/hooks/useKpiInputs.js` - Gestione input KPI
- `frontend/src/hooks/useKpiState.js` - Stati KPI (conforme/non conforme/N/A)
- `frontend/src/utils/kpiValidation.js` - Logiche validazione

### Configurare Classificazione Aziende

**File**: `frontend/src/requisiti_dimensioni_esrs.json`

```json
{
  "classificazioni": {
    "micro": {
      "criteri": {
        "fatturato_max": 700000,
        "dipendenti_max": 10,
        "totale_attivo_max": 350000
      },
      "requisiti_esrs": {
        "E1": ["lista", "requirements"],
        "S1": ["altri", "requirements"]
      }
    }
  }
}
```

---

**🏁 CONCLUSIONE**: L'app ha una solida base (47% compliance) con eccellenti capacità di export e KPI management. Le priorità sono implementare la doppia matrice di materialità e gli strumenti di stakeholder engagement per raggiungere piena compliance PDR1342022.
