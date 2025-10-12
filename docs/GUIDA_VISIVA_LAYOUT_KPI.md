# 🎨 Guida Visiva: Layout Sezioni KPI con Schema

## 📐 Layout Completo di un KPI con Schema

```
┌──────────────────────────────────────────────────────────────────┐
│ [✓ Completato]  E1: Inventario delle emissioni GHG              │ ← Pulsante stato + Titolo
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ▶ Parametri KPI — [E1006] Inventario emissioni GHG (E1 - Cam...│ ← QUESTA È LA RIGA MODIFICATA
│     ▲              ^^^^^^^^                          ^^^^^^^^^   │
│     │              Badge blu                         Grigio     │
│     └─ Freccia espandi                                          │
│                                                                   │
│  [Quando espanso]                                                │
│  ┌────────────────┬────────────────┬────────────────┐           │
│  │ Scope 1 calc.* │ Scope 2 calc.* │ Scope 3 calc.  │           │
│  │ [Sì ▼]         │ [Sì ▼]         │ [No ▼]         │           │
│  ├────────────────┼────────────────┼────────────────┤           │
│  │ Scope 1 (tCO2e)│ Scope 2 (tCO2e)│ Scope 3 (tCO2e)│           │
│  │ [____]         │ [____]         │ [____]         │           │
│  └────────────────┴────────────────┴────────────────┘           │
│                                                                   │
│  [⚠ 2 Errori] [⚡ 1 Avviso]                                      │ ← Badge validazione
│  ⚠️ Scope 1 e 2 sono obbligatori per ESRS E1                    │
│     💡 Completare inventario GHG secondo ISO 14064...           │
│                                                                   │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ▶ 👤 Referente e Metadata Raccolta                              │ ← Sezione metadata
│     [Sfondo giallo chiaro #f9fbe7]                              │
│                                                                   │
│  [Quando espanso]                                                │
│  ┌────────────────┬────────────────┬────────────────┐           │
│  │ Nome Referente │ Ruolo Referente│ Metodo Raccolta│           │
│  │ [Mario Rossi  ]│ [CFO          ]│ [Intervista ▼] │           │
│  ├────────────────┴────────────────┴────────────────┤           │
│  │ Data Raccolta                                     │           │
│  │ [2025-10-11]                                      │           │
│  ├───────────────────────────────────────────────────┤           │
│  │ Note Auditor                                      │           │
│  │ [Dati raccolti da sistema contabilità...        ]│           │
│  └───────────────────────────────────────────────────┘           │
│     Ultima modifica: 11/10/2025, 15:30                          │
│                                                                   │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ▶ 📎 Evidenze (2)                                               │ ← Sezione evidenze
│                                                                   │
│  [Aggiungi evidenza]                                             │
│                                                                   │
│  • inventario_ghg_2024.pdf                                       │
│    [SUFFICIENTE] 📝 Inventario GHG certificato ISO 14064        │
│    💬 Scope 3 parziale - solo logistica                          │
│    👤 Mario Rossi | 🕒 11/10/2025, 14:30                         │
│    [🗑️ Elimina]                                                  │
│                                                                   │
│  • piano_riduzione_emissioni.xlsx                                │
│    [PARZIALE] 📝 Piano riduzione in bozza                        │
│    👤 Laura Bianchi | 🕒 10/10/2025, 09:15                       │
│    [🗑️ Elimina]                                                  │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

---

## 🎯 Dettaglio Riga Modificata: Header "Parametri KPI"

### **Layout Orizzontale**

```
▶ Parametri KPI — [E1006] Inventario emissioni GHG (E1 - Cambiamenti Climatici)
│ │                └─────┘ └────────────────────────┘ └───────────────────────────┘
│ │                Badge   Titolo KPI                Descrizione categoria
│ └─ "Parametri KPI —"
└─ Freccia espandi/collassa
```

### **Codice HTML/CSS Generato**

```jsx
<summary
  style={{
    fontSize: ".7rem",
    fontWeight: 600,
    marginBottom: 6,
    cursor: "pointer",
    listStyle: "none",
    display: "flex",
    alignItems: "center",
    gap: 4,
  }}
>
  <span>▶</span>
  Parametri KPI — {/* Badge codice KPI */}
  <span
    style={{
      background: "#1976d2", // Blu Material Design
      color: "white",
      padding: "2px 6px",
      borderRadius: 4,
      fontSize: ".6rem",
      marginRight: 6,
    }}
  >
    E1006
  </span>
  {/* Titolo KPI */}
  Inventario emissioni GHG
  {/* Descrizione categoria */}
  <span
    style={{
      marginLeft: 8,
      fontSize: ".6rem",
      color: "#666", // Grigio
      fontWeight: "normal",
    }}
  >
    (E1 - Cambiamenti Climatici)
  </span>
</summary>
```

---

## 🎨 Palette Colori Utilizzata

### **Badge Codice KPI**

- **Background**: `#1976d2` - Blu Material Design 700
- **Testo**: `#ffffff` - Bianco
- **Border-radius**: `4px` - Angoli arrotondati
- **Padding**: `2px 6px` - Compatto

### **Descrizione Categoria**

- **Colore testo**: `#666666` - Grigio medio
- **Font-weight**: `normal` - Non grassetto
- **Font-size**: `0.6rem` - Più piccolo del titolo

### **Sezione Metadata (Referente)**

- **Background**: `#f9fbe7` - Giallo lime chiaro
- **Border**: `1px solid #dce775` - Bordo verde oliva

### **Badge Validazione**

| Tipo             | Background | Testo     | Icona |
| ---------------- | ---------- | --------- | ----- |
| **Errori**       | `#ffebee`  | `#c62828` | ⚠️    |
| **Avvisi**       | `#fff3e0`  | `#e65100` | ⚡    |
| **Suggerimenti** | `#e3f2fd`  | `#1976d2` | ℹ️    |

### **Badge Qualità Evidenze**

| Qualità           | Background | Testo     | Bordo     |
| ----------------- | ---------- | --------- | --------- |
| **Sufficiente**   | `#e8f5e9`  | `#2e7d32` | `#4caf50` |
| **Parziale**      | `#fff3e0`  | `#e65100` | `#ff9800` |
| **Insufficiente** | `#ffebee`  | `#c62828` | `#f44336` |

---

## 📏 Dimensioni e Spaziatura

### **Font Sizes**

```css
Header categoria:       0.85rem  (grande)
Titolo KPI:            0.7rem   (medio)
Badge codice:          0.6rem   (piccolo)
Descrizione categoria: 0.6rem   (piccolo)
Campi form:            0.65rem  (medio-piccolo)
```

### **Spacing**

```css
Gap elementi flex:     4px
Margine badge dx:      6px
Margine descrizione sx: 8px
Padding badge:         2px 6px
Padding sezione:       8px
```

---

## 🔍 Come Appare nel Browser

### **Collassato (Chiuso)**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
▶ Parametri KPI — [E1006] Inventario emissioni GHG (E1 - Cambiamenti Climatici)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Stato**: Compatto, una sola riga
**Cursore**: Pointer (manina) su hover
**Azione**: Click per espandere

### **Espanso (Aperto)**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
▼ Parametri KPI — [E1006] Inventario emissioni GHG (E1 - Cambiamenti Climatici)

   ┌─────────────────────────────────────┐
   │ Scope 1 calcolato *    [Sì ▼]      │
   │ Scope 2 calcolato *    [Sì ▼]      │
   │ Scope 3 calcolato      [No ▼]      │
   │ Scope 1 (tCO2e)        [1250]      │
   │ Scope 2 (tCO2e)        [380]       │
   │ Scope 3 (tCO2e)        [  ]        │
   └─────────────────────────────────────┘

   [⚡ 1 Avviso]
   ⚡ Raccomandato calcolare Scope 3...
      💡 Coinvolgere fornitori per dati...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Stato**: Espanso, mostra form e validazione
**Freccia**: Cambia da ▶ a ▼
**Contenuto**: Grid layout responsive

---

## 📱 Responsive Design

### **Desktop (>1024px)**

```
Grid: repeat(auto-fit, minmax(160px, 1fr))
→ 3-4 colonne affiancate
```

### **Tablet (768-1024px)**

```
Grid: repeat(auto-fit, minmax(160px, 1fr))
→ 2-3 colonne affiancate
```

### **Mobile (<768px)**

```
Grid: repeat(auto-fit, minmax(160px, 1fr))
→ 1-2 colonne (o stack verticale)
```

---

## 🧪 Test Visivo Rapido

### **1. Test Badge Codice**

Apri E1006 e verifica:

- ✅ Badge appare **prima** del titolo
- ✅ Colore background **blu** (#1976d2)
- ✅ Testo **bianco** e leggibile
- ✅ Angoli **arrotondati**
- ✅ Spaziatura **6px** a destra del badge

### **2. Test Descrizione Categoria**

- ✅ Appare **dopo** il titolo
- ✅ Tra **parentesi** ( )
- ✅ Colore **grigio** più chiaro del titolo
- ✅ Font **non grassetto** (normal)
- ✅ Spaziatura **8px** a sinistra

### **3. Test Allineamento**

- ✅ Freccia, testo, badge, titolo tutti **allineati verticalmente**
- ✅ Layout **flexbox** con `alignItems: center`
- ✅ Gap **4px** tra elementi

### **4. Test Interazione**

- ✅ **Hover**: Cursore cambia in pointer
- ✅ **Click**: Sezione si espande/collassa
- ✅ **Freccia**: Ruota da ▶ a ▼
- ✅ **Animazione**: Smooth (se CSS transitions attive)

---

## 📸 Screenshot Riferimento

### **Esempio E1006 Completo**

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ E1: Inventario delle emissioni GHG                             ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃                                                                 ┃
┃ ▶ Parametri KPI — [E1006] Inventario emissioni GHG            ┃
┃                   ▲▲▲▲▲▲▲                                     ┃
┃                   Badge blu                                     ┃
┃                   (E1 - Cambiamenti Climatici) ◄────────────   ┃
┃                   ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲                ┃
┃                   Descrizione grigia                            ┃
┃                                                                 ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

---

## ✅ Riepilogo Modifiche Implementate

| Elemento                      | Stato | File                   | Linea              |
| ----------------------------- | ----- | ---------------------- | ------------------ |
| kpiCode in schema             | ✅    | kpiSchemas.js          | Tutti gli 8 schema |
| categoryDescription in schema | ✅    | kpiSchemas.js          | Tutti gli 8 schema |
| Badge codice UI               | ✅    | ChecklistRefactored.js | ~496-507           |
| Descrizione categoria UI      | ✅    | ChecklistRefactored.js | ~509-520           |
| Layout flex allineato         | ✅    | ChecklistRefactored.js | ~485-495           |
| Stili badge responsive        | ✅    | ChecklistRefactored.js | Inline styles      |

---

**🎯 Tutto è pronto per il test!**

Apri l'app e verifica che ogni KPI con schema mostri:

1. Badge blu con codice (es: [E1006])
2. Descrizione categoria grigia tra parentesi
3. Layout pulito e allineato

Se qualcosa non appare come in questa guida, fammi sapere quale elemento specifico! 🚀
