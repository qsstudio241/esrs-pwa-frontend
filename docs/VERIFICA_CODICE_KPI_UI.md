# ✅ Checklist Verifica Codice KPI nell'UI

## 📋 Cosa Verificare nell'Interfaccia

### 🎯 1. Sezione "Parametri KPI"

Quando apri un KPI con schema (es: E1006), dovresti vedere:

```
▶ Parametri KPI — [E1006] Inventario emissioni GHG (E1 - Cambiamenti Climatici)
                   ^^^^^^^^                           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
                   Badge blu                          Descrizione categoria (grigio)
```

#### ✅ Elementi da verificare:

- [ ] **Freccia espandi** (▶) presente
- [ ] **Testo "Parametri KPI —"** visibile
- [ ] **Badge blu con codice** (es: [E1006]) presente e ben formattato
- [ ] **Titolo KPI** (es: "Inventario emissioni GHG") visibile dopo il badge
- [ ] **Descrizione categoria** tra parentesi (es: "(E1 - Cambiamenti Climatici)") in grigio chiaro

#### 🎨 Stile Badge:

- Background: **Blu (#1976d2)**
- Colore testo: **Bianco**
- Padding: **2px 6px**
- Border-radius: **4px**
- Font-size: **0.6rem**
- Margine destro: **6px**

#### 🎨 Stile Descrizione Categoria:

- Margine sinistro: **8px**
- Font-size: **0.6rem**
- Colore: **Grigio (#666)**
- Font-weight: **Normal**

---

### 👤 2. Sezione "Referente e Metadata Raccolta"

Questa sezione appare SOLO per KPI con schema definito.

```
▶ 👤 Referente e Metadata Raccolta
```

#### ✅ Elementi da verificare:

- [ ] **Icona persona** (👤) presente
- [ ] **Testo "Referente e Metadata Raccolta"** visibile
- [ ] **Sfondo giallo chiaro** (#f9fbe7)
- [ ] **Bordo verde oliva** (#dce775)
- [ ] **Sezione collassabile** (clicca freccia per espandere)

#### 📝 Campi all'interno (quando espanso):

- [ ] **Nome Referente** (campo testo)
- [ ] **Ruolo Referente** (campo testo)
- [ ] **Metodo Raccolta** (dropdown: Intervista, Questionario, Analisi documenti, Altro)
- [ ] **Data Raccolta** (campo data)
- [ ] **Note Auditor** (textarea)
- [ ] **Timestamp ultima modifica** (se presente, mostra data/ora in formato italiano)

---

### 📊 3. Badge Validazione (appare solo se ci sono problemi)

Se compili i parametri KPI e ci sono errori/warning, dovresti vedere:

```
[⚠ 2 Errori] [⚡ 1 Avviso] [ℹ 1 Suggerimento]
```

#### ✅ Colori badge:

- [ ] **Errori**: Sfondo rosso (#ffebee), testo rosso scuro (#c62828)
- [ ] **Avvisi**: Sfondo arancione (#fff3e0), testo arancione scuro (#e65100)
- [ ] **Suggerimenti**: Sfondo blu (#e3f2fd), testo blu scuro (#1976d2)

#### ✅ Sotto ogni badge:

- [ ] **Lista dettagliata** dei problemi
- [ ] **Icona appropriata** (⚠️ / ⚡ / ℹ️)
- [ ] **Action Plan** (box blu con 💡) per ogni problema

---

### 📎 4. Sezione "Evidenze"

```
▶ 📎 Evidenze (2)
      ^^^^^^^  ^^^
      Icona    Contatore
```

#### ✅ Elementi da verificare:

- [ ] **Icona graffetta** (📎) presente
- [ ] **Contatore evidenze** (badge blu) se ci sono file caricati
- [ ] **Link "Aggiungi evidenza"** in blu con sottolineatura
- [ ] **Lista evidenze caricate** (se presenti)

---

## 🧪 Test Rapido per Ogni Categoria

### **Generale**

| Codice   | KPI                 | Badge Codice | Descrizione                             |
| -------- | ------------------- | ------------ | --------------------------------------- |
| **G001** | Orizzonti temporali | ✅ Blu       | (Generale - Requisiti trasversali ESRS) |
| **G002** | Catena del valore   | ✅ Blu       | (Generale - Requisiti trasversali ESRS) |
| **G003** | Doppia rilevanza    | ✅ Blu       | (Generale - Requisiti trasversali ESRS) |

### **E1 - Cambiamenti Climatici**

| Codice    | KPI                         | Badge Codice | Descrizione                  |
| --------- | --------------------------- | ------------ | ---------------------------- |
| **E1005** | Piano transizione climatica | ✅ Blu       | (E1 - Cambiamenti Climatici) |
| **E1006** | Inventario emissioni GHG    | ✅ Blu       | (E1 - Cambiamenti Climatici) |

### **E2 - Inquinamento**

| Codice    | KPI                      | Badge Codice | Descrizione         |
| --------- | ------------------------ | ------------ | ------------------- |
| **E2001** | Inquinamento atmosferico | ✅ Blu       | (E2 - Inquinamento) |

### **S1 - Forza lavoro propria**

| Codice    | KPI                           | Badge Codice | Descrizione                 |
| --------- | ----------------------------- | ------------ | --------------------------- |
| **S1002** | Salute e sicurezza sul lavoro | ✅ Blu       | (S1 - Forza lavoro propria) |

### **G1 - Condotta aziendale**

| Codice    | KPI                      | Badge Codice | Descrizione               |
| --------- | ------------------------ | ------------ | ------------------------- |
| **G1001** | Governance sostenibilità | ✅ Blu       | (G1 - Condotta aziendale) |

---

## 🔍 Debug: Come Verificare lo Schema in Console

Se qualcosa non appare correttamente, apri la **Console del browser (F12)** e digita:

```javascript
// Verifica cache schema
const allKpiSchemas = {
  Generale: getAllKpiSchemasByCategory("Generale"),
  E1: getAllKpiSchemasByCategory("E1"),
  E2: getAllKpiSchemasByCategory("E2"),
  S1: getAllKpiSchemasByCategory("S1"),
  G1: getAllKpiSchemasByCategory("G1"),
};

console.table(allKpiSchemas);
```

### 🔎 Output atteso per E1006:

```javascript
{
  kpiCode: "E1006",
  categoryDescription: "E1 - Cambiamenti Climatici",
  title: "Inventario emissioni GHG",
  fields: [...],
  checks: [...],
  requiredEvidences: [...]
}
```

---

## 📸 Screenshot Checklist

Per documentare il test, cattura screenshot di:

1. **Sezione Parametri KPI espansa** per G003

   - ✅ Badge [G003] visibile in blu
   - ✅ "(Generale - Requisiti trasversali ESRS)" in grigio
   - ✅ Campi del form visibili

2. **Sezione Parametri KPI espansa** per E1006

   - ✅ Badge [E1006] visibile in blu
   - ✅ "(E1 - Cambiamenti Climatici)" in grigio
   - ✅ Campi Scope 1/2/3 visibili

3. **Sezione Referente e Metadata** espansa

   - ✅ Sfondo giallo chiaro
   - ✅ Tutti i 5 campi visibili
   - ✅ Dropdown metodi di raccolta funzionante

4. **Badge Validazione** (dopo aver lasciato campi vuoti)

   - ✅ Badge rosso "Errori" se campo required vuoto
   - ✅ Lista dettagliata con action plan

5. **Modal Metadata Evidenze** (quando carichi file)
   - ✅ Header con codice categoria e titolo KPI
   - ✅ Form metadata completo
   - ✅ File size warnings (se applicabile)

---

## ❌ Problemi Comuni e Soluzioni

### **1. Badge codice KPI non appare**

**Causa**: Schema non ha `kpiCode` definito  
**Soluzione**: Verifica che lo schema in `kpiSchemas.js` contenga:

```javascript
{
  kpiCode: "E1006",
  categoryDescription: "E1 - Cambiamenti Climatici",
  title: "...",
  // ...
}
```

### **2. Descrizione categoria non visibile**

**Causa**: `categoryDescription` mancante o undefined  
**Soluzione**: Controlla che lo schema abbia `categoryDescription` definito

### **3. Sezione Parametri KPI non appare**

**Causa**: `schema` è `null` o `undefined`  
**Debug**:

```javascript
// Aggiungi console.log temporaneo in ChecklistRefactored.js (linea ~397)
console.log("Schema trovato:", schema);
console.log("itemId:", it.itemId);
console.log("categorySchemas:", categorySchemas);
```

**Soluzione**: Verifica che `itemId` del KPI corrisponda alla chiave dello schema

### **4. Stili non applicati correttamente**

**Causa**: CSS inline sovrascritta da altri stili  
**Soluzione**: Ispeziona elemento con DevTools e verifica stili applicati

---

## 🚀 Test Completo Raccomandato

1. **Avvia dev server**:

   ```powershell
   cd frontend
   npm start
   ```

2. **Apri/Crea audit**

3. **Per ogni categoria (Generale, E1, E2, S1, G1)**:

   - [ ] Espandi categoria
   - [ ] Trova KPI con schema (vedi tabella sopra)
   - [ ] Clicca su "▶ Parametri KPI"
   - [ ] Verifica badge codice visibile
   - [ ] Verifica descrizione categoria visibile
   - [ ] Compila 1-2 campi
   - [ ] Verifica validazione real-time
   - [ ] Espandi "👤 Referente e Metadata"
   - [ ] Compila nome referente
   - [ ] Seleziona metodo raccolta
   - [ ] Clicca "Aggiungi evidenza"
   - [ ] Verifica modal si apre (con debug console)

4. **Documenta risultati**:
   - Screenshot per ogni categoria testata
   - Note su eventuali anomalie
   - Performance (velocità rendering)

---

## 📊 Report Test

### ✅ Test Completati

| Categoria | KPI Testato | Badge OK | Descrizione OK | Metadata OK | Modal OK |
| --------- | ----------- | -------- | -------------- | ----------- | -------- |
| Generale  | G003        | ☐        | ☐              | ☐           | ☐        |
| E1        | E1006       | ☐        | ☐              | ☐           | ☐        |
| E2        | E2001       | ☐        | ☐              | ☐           | ☐        |
| S1        | S1002       | ☐        | ☐              | ☐           | ☐        |
| G1        | G1001       | ☐        | ☐              | ☐           | ☐        |

### 🐛 Bug Rilevati

```
[Categoria] - [KPI Code] - [Descrizione problema]
Esempio: E1 - E1006 - Badge codice non visibile, schema undefined in console
```

### 💡 Suggerimenti Miglioramento

```
- Aggiungere tooltip su hover del badge codice con info ESRS completa
- Evidenziare in giallo i KPI con validation errors
- Mostrare contatore KPI completati per categoria
```

---

## 📞 Next Steps

Dopo aver completato questa verifica:

1. ✅ Conferma che tutto funziona → Procedi a **STEP 5** (Export findings)
2. ❌ Se ci sono problemi → Condividi screenshot e log console per debug
3. 💡 Se vuoi miglioramenti → Discuti priorità e impatto

---

**Ultima modifica**: 11/10/2025  
**Versione**: 1.0  
**Author**: Sistema Audit ESRS PWA
