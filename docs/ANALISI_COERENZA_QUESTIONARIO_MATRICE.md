# 🔍 Analisi di Coerenza: Questionario ISO 26000 ↔ Matrice Materialità

## 📊 Analisi dei Dati Esportati (2025-10-05)

### 🎯 **RISULTATI QUESTIONARIO ISO 26000**

#### Scoring per Tema (Media Aspetti)

```json
{
  "Diritti Umani": {
    "score": 3.33,
    "priority": "CRITICAL",
    "aspectCount": 3
  },
  "Pratiche del Lavoro": {
    "score": 3.4,
    "priority": "HIGH",
    "aspectCount": 5
  },
  "Ambiente": {
    "score": 2.75,
    "priority": "CRITICAL",
    "aspectCount": 4
  },
  "Corrette Prassi Gestionali": {
    "score": 2.5,
    "priority": "HIGH",
    "aspectCount": 3
  },
  "Aspetti relativi ai Consumatori": {
    "score": 1.25,
    "priority": "MEDIUM",
    "aspectCount": 6
  },
  "Coinvolgimento e Sviluppo della Comunità": {
    "score": 1.875,
    "priority": "MEDIUM",
    "aspectCount": 4
  }
}
```

#### 🏆 **RANKING PRIORITÀ**

1. **Pratiche del Lavoro** (3.4/5) - HIGH
2. **Diritti Umani** (3.33/5) - CRITICAL
3. **Ambiente** (2.75/5) - CRITICAL
4. **Corrette Prassi Gestionali** (2.5/5) - HIGH
5. **Coinvolgimento Comunità** (1.875/5) - MEDIUM
6. **Consumatori** (1.25/5) - MEDIUM

---

## 🔄 **MAPPATURA ISO → ESRS ATTUALE**

### Logica di Conversione in `materialityIntegration.js`:

```javascript
const ISO_TO_ESRS_MAPPING = {
  "Diritti Umani": "s1_workforce", // Social - Forza Lavoro
  "Pratiche del Lavoro": "s1_workforce", // Social - Forza Lavoro
  Ambiente: "e1_climate", // Environmental - Clima
  "Corrette Prassi Gestionali": "g1_governance", // Governance
  "Aspetti relativi ai Consumatori": "s4_consumers", // Social - Consumatori
  "Coinvolgimento e Sviluppo della Comunità": "s3_communities", // Social - Comunità
};
```

### 🎯 **CONVERSIONE SCORING**

- **insideOutScore**: `Math.round(themeData.score)`
- **outsideInScore**: `Math.round(themeData.score)` _(stesso valore)_

#### Risultati Attesi nella Matrice:

```javascript
{
  "s1_workforce": { insideOutScore: 3, outsideInScore: 3 },    // LA + DU combinati
  "e1_climate": { insideOutScore: 3, outsideInScore: 3 },      // Ambiente
  "g1_governance": { insideOutScore: 3, outsideInScore: 3 },   // Prassi Gestionali
  "s4_consumers": { insideOutScore: 1, outsideInScore: 1 },    // Consumatori
  "s3_communities": { insideOutScore: 2, outsideInScore: 2 }   // Comunità
}
```

---

## ⚠️ **PROBLEMI DI COERENZA IDENTIFICATI**

### 1. **DOPPIA MAPPATURA PROBLEMATICA**

- **"Diritti Umani"** (3.33) e **"Pratiche del Lavoro"** (3.4) → entrambi mappano su `s1_workforce`
- **Risultato**: Il topic `s1_workforce` verrà sovrascritto 2 volte
- **Ultimo valore**: score 3.4 (Pratiche del Lavoro)
- **Perdita**: score 3.33 (Diritti Umani) viene ignorato

### 2. **SCORING IDENTICO INSIDE-OUT/OUTSIDE-IN**

```javascript
insideOutScore: Math.round(themeData.score),  // Es: 3
outsideInScore: Math.round(themeData.score)   // Es: 3 (stesso!)
```

**Problema**: Tutti i topic finiscono **SULLA DIAGONALE** della matrice

- **Q1 (Alta Materialità)**: score ≥ 3
- **Q3 (Bassa Materialità)**: score < 3
- **Q2 e Q4**: VUOTI (nessun topic)

### 3. **PERDITA GRANULARITÀ ASPETTI**

- Il questionario ha **25 aspetti** specifici con scoring individuale
- La matrice riceve solo **6 temi** aggregati
- **Perdita**: dettaglio su singoli aspetti critici come:
  - `DU2: "Discriminazione"` (score: 4)
  - `LA1: "Occupazione"` (score: 4)
  - `AM2: "Uso sostenibile risorse"` (score: 3)

### 4. **CLASSIFICAZIONE PRIORITÀ INCOERENTE**

- **Questionario**: `"priority": "CRITICAL"` per Ambiente (score: 2.75)
- **Matrice**: score 3 = Q3 "Bassa Materialità" (< soglia 3.0)
- **Incoerenza**: Un tema "CRITICAL" finisce in "Bassa Materialità"

---

## 📈 **POSIZIONAMENTO ATTUALE SULLA MATRICE**

Con soglia materialità = 3.0:

### **Q1 - ALTA MATERIALITÀ** (Inside-out ≥3, Outside-in ≥3)

- `s1_workforce` (3,3) - Pratiche del Lavoro
- `e1_climate` (3,3) - Ambiente
- `g1_governance` (3,3) - Corrette Prassi

### **Q3 - BASSA MATERIALITÀ** (Inside-out <3, Outside-in <3)

- `s4_consumers` (1,1) - Consumatori
- `s3_communities` (2,2) - Comunità

### **Q2 & Q4 - VUOTI**

- Nessun topic (tutti sulla diagonale)

---

## 🎯 **RACCOMANDAZIONI PER MIGLIORAMENTO**

### 1. **RISOLVI DOPPIA MAPPATURA**

```javascript
// Invece di sovrascrivere, crea topic dedicati:
"Diritti Umani": "s1_human_rights",      // Nuovo topic specifico
"Pratiche del Lavoro": "s1_workforce",   // Topic esistente
```

### 2. **SCORING DIFFERENZIATO**

```javascript
// Usa caratteristiche tema per differenziare assi:
insideOutScore: calculateImpactScore(themeData),
outsideInScore: calculateFinancialScore(themeData)
```

### 3. **CONSERVA GRANULARITÀ ASPETTI**

```javascript
// Opzione A: Crea topic per ogni aspetto critico (score ≥ 4)
// Opzione B: Aggiungi dettagli aspetti nei topic esistenti
```

### 4. **ALLINEA CLASSIFICAZIONI PRIORITÀ**

```javascript
// Usa mapping coerente:
const priorityToScore = {
  CRITICAL: { min: 4, max: 5 },
  HIGH: { min: 3, max: 3.9 },
  MEDIUM: { min: 2, max: 2.9 },
  LOW: { min: 1, max: 1.9 },
};
```

---

## ✅ **VALIDAZIONI DA ESEGUIRE**

### Test Case 1: **Mappatura Univoca**

- [ ] Verifica che ogni tema ISO mappi su topic ESRS diverso
- [ ] Test con dati esempio: 6 temi → 6 topic distinti

### Test Case 2: **Distribuzione Quadranti**

- [ ] Verifica che topic si distribuiscano su tutti e 4 i quadranti
- [ ] Test scoring differenziato inside-out vs outside-in

### Test Case 3: **Coerenza Priorità**

- [ ] Verifica che priority "CRITICAL" → Q1 o Q2 (alta materialità)
- [ ] Test soglia dinamica basata su priority

### Test Case 4: **Granularità Aspetti**

- [ ] Verifica che aspetti critici (score ≥ 4) siano evidenziati
- [ ] Test export con dettagli aspetti inclusi

---

## 🚀 **STATO IMPLEMENTAZIONE**

**CURRENT**: ✅ Sistema funzionante ma con limitazioni di coerenza  
**TARGET**: 🎯 Sistema completamente coerente e granulare

**PROSSIMI PASSI**: Implementare correzioni algoritmo mappatura e scoring

---

_Analisi generata il 2025-10-05 per validazione coerenza sistema materialità ESRS-PWA_
