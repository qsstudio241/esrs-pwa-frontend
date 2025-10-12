# 🧪 Test Modal Metadata Evidence - Guida Rapida

## ✅ Modifiche Implementate

### 1. **Schema KPI: Aggiunti codice e categoria**

Ogni schema ora include:

- `kpiCode`: Codice identificativo KPI (es: "E1006", "S1002", "G003")
- `categoryDescription`: Descrizione categoria (es: "E1 - Cambiamenti Climatici")

### 2. **UI Aggiornata**

Nella sezione "Parametri KPI" ora vedi:

```
▶ Parametri KPI — [E1006] Inventario emissioni GHG (E1 - Cambiamenti Climatici)
```

---

## 🎯 KPI con Schema Attivi (Modal Disponibile)

### **Generale - Requisiti trasversali ESRS**

| Codice   | Titolo              | Evidenze Richieste                       |
| -------- | ------------------- | ---------------------------------------- |
| **G003** | Doppia rilevanza    | Matrice Materialità, Verbale Stakeholder |
| **G002** | Catena del valore   | Mappatura value chain, Analisi fornitori |
| **G001** | Orizzonti temporali | Documento definizione orizzonti          |

### **E1 - Cambiamenti Climatici**

| Codice    | Titolo                      | Evidenze Richieste                   |
| --------- | --------------------------- | ------------------------------------ |
| **E1005** | Piano transizione climatica | Piano transizione, Target SBTi       |
| **E1006** | Inventario emissioni GHG    | Inventario GHG Scope 1-3, Report CDP |

### **E2 - Inquinamento**

| Codice    | Titolo                   | Evidenze Richieste                             |
| --------- | ------------------------ | ---------------------------------------------- |
| **E2001** | Inquinamento atmosferico | AIA/AUA, Report emissioni, Certificati analisi |

### **S1 - Forza lavoro propria**

| Codice    | Titolo             | Evidenze Richieste                            |
| --------- | ------------------ | --------------------------------------------- |
| **S1002** | Salute e sicurezza | DVR, Registro infortuni, Attestati formazione |

### **G1 - Condotta aziendale**

| Codice    | Titolo                   | Evidenze Richieste        |
| --------- | ------------------------ | ------------------------- |
| **G1001** | Governance sostenibilità | Organigramma, Verbali CdA |

---

## 📋 Come Testare la Modal

### **STEP 1: Apri un KPI con schema**

1. Naviga alla categoria **E1**
2. Trova il KPI **"Inventario delle emissioni GHG"**
3. Verifica che vedi: `▶ Parametri KPI — [E1006] Inventario emissioni GHG (E1 - Cambiamenti Climatici)`

### **STEP 2: Compila i parametri** (opzionale per test modal)

- Scope 1 calcolato: Sì
- Scope 2 calcolato: Sì
- Scope 3 calcolato: No
- Inserisci valori tonnellate CO2e

### **STEP 3: Carica un file**

1. Scorri fino alla sezione "📎 Evidenze"
2. Clicca su **"Aggiungi evidenza"**
3. Seleziona un file (es: `inventario_ghg_2024.pdf`)

### **STEP 4: Verifica Console Debug**

Apri DevTools (F12) → scheda **Console**.

Dovresti vedere:

```
📎 Upload file: {
  hasSchema: true,
  category: "E1",
  itemId: "E1006",
  files: ["inventario_ghg_2024.pdf"]
}
✅ Apertura modal metadata
```

### **STEP 5: Verifica Modal Appare**

Dovrebbe aprirsi una **modal** con:

#### 📋 **Header Modal**

```
Metadata Evidenza
E1: Inventario delle emissioni GHG
```

#### 📁 **Sezione File Selezionati**

```
File selezionati:
• inventario_ghg_2024.pdf (2.34 MB) [badge verde]
```

Se file > 5MB, badge arancione + warning box:

```
⚡ File grande (>5MB)
💡 Considerare compressione con SmallPDF, iLovePDF
```

Se file > 20MB, badge rosso + warning forte:

```
⚠️ File molto grande (>20MB)
⚠️ File superiori a 20MB possono causare problemi.
Utilizzare strumenti cloud (Google Drive, OneDrive) e inserire link nella descrizione.
```

#### 📝 **Form Metadata**

```
[Campo] Descrizione (max 200 caratteri)
Es: "Inventario GHG 2024 certificato secondo ISO 14064"

[Radio] Qualità evidenza:
○ Sufficiente    ○ Parziale    ○ Insufficiente

[Campo] Note auditor
Es: "Verificare calcolo Scope 3 - mancano emissioni trasporto"
```

#### 🔘 **Pulsanti**

```
[Annulla]  [Salva metadata e carica]
```

### **STEP 6: Compila e Salva**

1. Inserisci descrizione: `"Inventario GHG 2024 - Scope 1 e 2 certificati"`
2. Seleziona qualità: **Sufficiente**
3. Note: `"Scope 3 parziale - solo logistica"` (opzionale)
4. Clicca **"Salva metadata e carica"**

### **STEP 7: Verifica Metadata Salvati**

Nella lista evidenze dovresti vedere:

```
📎 Evidenze (1)

• inventario_ghg_2024.pdf

  [BADGE VERDE] Sufficiente

  📝 Inventario GHG 2024 - Scope 1 e 2 certificati

  💬 Scope 3 parziale - solo logistica

  👤 Auditor XYZ | 🕒 11/10/2025, 14:32

  [🗑️ Elimina]
```

---

## ❌ Troubleshooting

### **Modal non appare**

#### ✅ CHECK 1: Verifica Console

Vedi `hasSchema: false`?
→ **Problema**: KPI non ha schema definito in `kpiSchemas.js`

#### ✅ CHECK 2: Verifica itemId corretto

Console mostra `itemId: "E1006"`?
→ Se diverso, potrebbe non matchare con chiave schema

#### ✅ CHECK 3: Schema caricato in cache

Aggiungi debug temporaneo:

```javascript
console.log("allKpiSchemas:", allKpiSchemas);
console.log("categorySchemas:", categorySchemas);
console.log("schema trovato:", schema);
```

### **File size warning non appare**

- File < 5MB: Nessun warning (corretto)
- File 5-20MB: Badge arancione + box giallo
- File 20-50MB: Badge rosso + box rosso
- File > 50MB: **BLOCCO** con alert

### **Metadata non salvati**

Verifica in Console:

```javascript
audit.evidenceMetadata;
```

Dovrebbe contenere oggetti con chiave `fileKey`:

```json
{
  "E1-Inventario GHG-inventario_ghg_2024.pdf": {
    "description": "...",
    "quality": "Sufficiente",
    "notes": "...",
    "auditor": "...",
    "timestamp": "...",
    "fileSize": 2451968,
    "fileSizeMB": "2.34 MB"
  }
}
```

---

## 🎯 Test Raccomandati

### **Test 1: KPI con schema (E1006)**

- ✅ Modal appare
- ✅ Form metadata completo
- ✅ Salvataggio corretto
- ✅ Display metadata in lista

### **Test 2: KPI senza schema**

- ✅ Upload diretto senza modal
- ✅ File salvati normalmente

### **Test 3: File size management**

| Dimensione | Comportamento Atteso              |
| ---------- | --------------------------------- |
| 2 MB       | Badge verde, nessun warning       |
| 8 MB       | Badge arancione, box compressione |
| 25 MB      | Badge rosso, warning forte        |
| 60 MB      | **BLOCCO**, alert con alternative |

### **Test 4: Qualità evidenza**

- ✅ **Sufficiente**: Badge verde
- ✅ **Parziale**: Badge arancione
- ✅ **Insufficiente**: Badge rosso

### **Test 5: Multi-categoria**

Testare un KPI per ogni categoria:

- **Generale**: G003 (Doppia rilevanza)
- **E1**: E1006 (Inventario GHG)
- **E2**: E2001 (Inquinamento atmosferico)
- **S1**: S1002 (Salute sicurezza)
- **G1**: G1001 (Governance)

---

## 📊 Dati Schema per Debugging

### **Struttura completa schema E1006**

```javascript
{
  kpiCode: "E1006",
  categoryDescription: "E1 - Cambiamenti Climatici",
  title: "Inventario emissioni GHG",
  fields: [
    { key: "scope1_calcolato", label: "Scope 1 calcolato", type: "bool", required: true },
    { key: "scope2_calcolato", label: "Scope 2 calcolato", type: "bool", required: true },
    { key: "scope3_calcolato", label: "Scope 3 calcolato", type: "bool", required: false },
    { key: "scope1_tonnellate", label: "Scope 1", type: "number", min: 0, unit: "tCO2e" },
    { key: "scope2_tonnellate", label: "Scope 2", type: "number", min: 0, unit: "tCO2e" },
    { key: "scope3_tonnellate", label: "Scope 3", type: "number", min: 0, unit: "tCO2e" }
  ],
  checks: [
    { code: "SCOPE12_MANDATORY", severity: "error", ... },
    { code: "SCOPE3_RECOMMENDED", severity: "warning", ... }
  ],
  requiredEvidences: [
    "Inventario GHG Scope 1-3",
    "Report Carbon Footprint",
    "Certificazioni ISO 14064 (se applicabile)"
  ]
}
```

---

## 🚀 Prossimi Step

Dopo conferma che la modal funziona:

1. **STEP 5**: Export findings section in Word

   - Estrarre KPI con errors/warnings
   - Identificare evidenze mancanti/parziali
   - Generare tabella raccomandazioni

2. **STEP 6**: Test end-to-end completo

   - Workflow audit completo su 3 KPI pilota
   - Screenshot e documentazione risultati

3. **Completamento**: Schema per tutte categorie ESRS rimanenti
   - E3 (Acqua), E4 (Biodiversità), E5 (Economia Circolare)
   - S2-S4 (Altri stakeholder)
   - G2-G4 (Altri aspetti governance)

---

## 📞 Supporto

Se la modal non appare dopo questi test, fornire:

1. Screenshot console (log completo)
2. Categoria e itemId del KPI testato
3. Valore di `schema` in console debug
4. Screenshot sezione "Parametri KPI" (per verificare codice visualizzato)
