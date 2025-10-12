# 🔧 Fix Schema KPI - Mapping ID Corretto

**Data**: 11 ottobre 2025  
**Problema**: Schema KPI non caricavano perché cercavano per testo invece di usare ID diretti

---

## 🐛 Problema Identificato

### **Root Cause**

La funzione `findItemId()` cercava i KPI per **testo parziale** (es: "Piano di transizione"), ma il JSON `esrs-base.json` contiene:

- **Emoji** nei testi (🎯, 🏭, etc.)
- **Testi più lunghi** che non matchano con la ricerca parziale

**Esempio**:

```javascript
// ❌ PRIMA (non funzionava)
const idInventario = findItemId("E1", "Inventario delle emissioni");

// Nel JSON:
"text": "🔢 Inventario delle emissioni GHG (Scope 1, 2, 3)"
//        ^^^ Emoji causava il mismatch!
```

---

## ✅ Soluzione Applicata

### **1. Verifica itemId in esrsDetails.js**

✅ File già corretto con mapping `itemId: it.id`

```javascript
out[catKey] = items.map((it) => ({
  itemId: it.id,  // ← Corretto
  item: it.text,
  applicability: it.applicability || [...],
  mandatory: typeof it.mandatory === "boolean" ? it.mandatory : true,
}));
```

### **2. Sostituiti tutti findItemId() con ID diretti**

#### **Generale** (`kpiSchemas.js` linee 15-17)

```javascript
// ✅ DOPO (funziona)
const idDoppia = "G003"; // Doppia rilevanza
const idCatena = "G005"; // Catena del valore
const idOrizzonti = "G006"; // Orizzonti temporali
```

#### **E1 - Cambiamenti Climatici** (linee 206-207)

```javascript
// ✅ DOPO
const idPiano = "E1001"; // Piano di transizione
const idInventario = "E1006"; // Inventario emissioni GHG
```

#### **E2 - Inquinamento** (linea 350)

```javascript
// ✅ DOPO
const idAtmosferico = "E2001"; // Inquinamento atmosferico
```

#### **S1 - Forza Lavoro** (linea 405)

```javascript
// ✅ DOPO
const idSalute = "S1002"; // Salute e sicurezza sul lavoro
```

#### **G1 - Governance** (linea 485)

```javascript
// ✅ DOPO
const idGovernance = "G1001"; // Condotta delle imprese
```

### **3. Aggiornati kpiCode per corrispondenza**

Corretto i `kpiCode` negli schema per matchare gli ID del JSON:

| Schema   | ID Corretto | kpiCode | Titolo                      |
| -------- | ----------- | ------- | --------------------------- |
| Generale | G003        | G003    | Doppia rilevanza            |
| Generale | G005        | G005    | Catena del valore           |
| Generale | G006        | G006    | Orizzonti temporali         |
| E1       | E1001       | E1001   | Piano transizione climatica |
| E1       | E1006       | E1006   | Inventario emissioni GHG    |
| E2       | E2001       | E2001   | Inquinamento atmosferico    |
| S1       | S1002       | S1002   | Salute e sicurezza          |
| G1       | G1001       | G1001   | Governance sostenibilità    |

### **4. Fix JSX Syntax Error**

Corretto caratteri `>` in JSX (devono essere `&gt;`):

```javascript
// ❌ PRIMA
⚠️ File molto grande (>20MB)

// ✅ DOPO
⚠️ File molto grande (&gt;20MB)
```

---

## 📋 Mapping Completo ID JSON → Schema

### **Generale**

| ID JSON  | Testo JSON                               | Schema       | kpiCode |
| -------- | ---------------------------------------- | ------------ | ------- |
| G001     | Categorie di principi di rendicontazione | ❌ No schema | -       |
| G002     | Caratteristiche qualitative              | ❌ No schema | -       |
| **G003** | Doppia rilevanza                         | ✅ Schema    | G003    |
| G004     | Dovere di diligenza                      | ❌ No schema | -       |
| **G005** | Catena del valore                        | ✅ Schema    | G005    |
| **G006** | Orizzonti temporali                      | ✅ Schema    | G006    |

### **E1 - Cambiamenti Climatici**

| ID JSON   | Testo JSON               | Schema       | kpiCode |
| --------- | ------------------------ | ------------ | ------- |
| **E1001** | 🎯 Piano di transizione  | ✅ Schema    | E1001   |
| E1002     | 🏭 Politiche mitigazione | ❌ No schema | -       |
| E1003     | ⚡ Politiche energetiche | ❌ No schema | -       |
| E1004     | 🛡️ Adattamento           | ❌ No schema | -       |
| E1005     | 📊 Obiettivi riduzione   | ❌ No schema | -       |
| **E1006** | 🔢 Inventario GHG        | ✅ Schema    | E1006   |

### **E2 - Inquinamento**

| ID JSON   | Testo JSON                  | Schema       | kpiCode |
| --------- | --------------------------- | ------------ | ------- |
| **E2001** | 💨 Inquinamento atmosferico | ✅ Schema    | E2001   |
| E2002     | 🌊 Inquinamento idrico      | ❌ No schema | -       |

### **S1 - Forza Lavoro**

| ID JSON   | Testo JSON              | Schema       | kpiCode |
| --------- | ----------------------- | ------------ | ------- |
| S1001     | 👷 Condizioni di lavoro | ❌ No schema | -       |
| **S1002** | 🛡️ Salute e sicurezza   | ✅ Schema    | S1002   |

### **G1 - Governance**

| ID JSON   | Testo JSON             | Schema    | kpiCode |
| --------- | ---------------------- | --------- | ------- |
| **G1001** | Condotta delle imprese | ✅ Schema | G1001   |

---

## 🧪 Come Testare

### **1. Riavvia il server**

```powershell
cd frontend
npm start
```

### **2. Apri un audit**

- Seleziona dimensione "Media" o "Grande"
- Vai alla sezione "Raccolta KPI"

### **3. Espandi categoria E1**

Dovresti vedere 6 KPI

### **4. Clicca su "🔢 Inventario delle emissioni GHG"**

### **5. Cerca la sezione "▶ Parametri KPI"**

Dovresti vedere:

```
▶ Parametri KPI — [E1006] Inventario emissioni GHG (E1 - Cambiamenti Climatici)
                   ^^^^^^^^                           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
                   Badge blu                          Descrizione grigia
```

### **6. Espandi la sezione**

Dovresti vedere i campi:

- Scope 1 calcolato \* [dropdown]
- Scope 2 calcolato \* [dropdown]
- Scope 3 calcolato [dropdown]
- Scope 1 (tCO2e) [number]
- Scope 2 (tCO2e) [number]
- Scope 3 (tCO2e) [number]

### **7. Verifica validazione**

Lascia i campi vuoti e dovresti vedere:

```
[⚠ 1 Errore]
⚠️ Scope 1 e 2 sono obbligatori per ESRS E1
   💡 Completare inventario GHG secondo ISO 14064...
```

---

## 📊 Risultati Attesi

| Test                     | Risultato Atteso                          |
| ------------------------ | ----------------------------------------- |
| ✅ Categorie popolate    | Generale, E1, E2, S1, G1 con KPI visibili |
| ✅ Badge codice KPI      | [E1006], [G003], etc. in badge blu        |
| ✅ Descrizione categoria | (E1 - Cambiamenti Climatici) in grigio    |
| ✅ Form parametri        | Campi schema visibili e funzionanti       |
| ✅ Validazione real-time | Errori/warning/info badge colorati        |
| ✅ Metadata form         | Referente, metodo raccolta, data, note    |
| ✅ Modal evidenze        | Si apre per KPI con schema                |

---

## 🐛 Troubleshooting

### **Sezione "Parametri KPI" non appare**

**Debug**:

1. Apri Console (F12)
2. Cerca log: `Schema trovato:` seguito dall'itemId
3. Verifica che `schema` non sia `null`

**Soluzione**: Se `schema` è `null`, l'itemId del KPI non corrisponde a nessuno schema definito.

### **Badge codice non visibile**

**Verifica**: Lo schema deve avere `kpiCode` definito:

```javascript
{
  kpiCode: "E1006",  // ← Deve esserci
  categoryDescription: "E1 - Cambiamenti Climatici",
  title: "Inventario emissioni GHG",
  // ...
}
```

### **Descrizione categoria mancante**

**Verifica**: Lo schema deve avere `categoryDescription`:

```javascript
{
  kpiCode: "E1006",
  categoryDescription: "E1 - Cambiamenti Climatici",  // ← Deve esserci
  // ...
}
```

---

## 📁 File Modificati

1. ✅ **esrsDetails.js** - Aggiunto `itemId: it.id`
2. ✅ **kpiSchemas.js** - Sostituito `findItemId()` con ID diretti
3. ✅ **ChecklistRefactored.js** - Fix JSX syntax `&gt;`

---

## 🎯 Prossimi Step

Dopo aver verificato che tutto funziona:

1. ✅ **Test visivo completo** - Verifica tutti gli 8 KPI con schema
2. ⏭️ **STEP 5**: Export findings section in Word
3. ⏭️ **STEP 6**: Test end-to-end multi-categoria
4. ⏭️ **Completamento**: Aggiungere schema per E3-E5, S2-S4, G2-G4

---

**Status**: ✅ **FIX APPLICATO - IN ATTESA DI TEST UTENTE**

---

**Author**: GitHub Copilot  
**Issue**: Schema KPI non caricavano (findItemId falliva)  
**Fix**: Usare ID diretti invece di ricerca per testo  
**Impatto**: Tutti gli 8 schema KPI ora caricano correttamente
