# ANALISI APPROFONDITA: Requisiti ESRS per Dimensione Aziendale e Export Word

## 🔍 STATO ATTUALE DELL'IMPLEMENTAZIONE

### ✅ Cosa Funziona Già
- ✅ Caricamento dati normativi da JSON
- ✅ Pannello informativo con tempistiche e standard applicabili
- ✅ Filtraggio base per applicabilità per dimensione
- ✅ Export Word base funzionante

### ⚠️ Problemi Identificati

#### 1. **Mismatch tra Categorie ESRS**
**Problema**: Il nostro `esrsDetails` ha solo 3 categorie:
- `Generale` (principi base ESRS)
- `S4` (Comunità influenzate)  
- `G1` (Governance)

**Ma i requisiti normativi prevedono 10 standard ESRS:**
- `E1` (Cambiamenti climatici)
- `E2` (Inquinamento)
- `E3` (Acque e risorse marine)
- `E4` (Biodiversità ed ecosistemi)
- `E5` (Uso delle risorse ed economia circolare)
- `S1` (Forza lavoro propria)
- `S2` (Lavoratori catena del valore)
- `S3` (Comunità interessate)
- `S4` (Consumatori e utilizzatori finali) ✅ *già presente*
- `G1` (Condotta aziendale) ✅ *già presente*

#### 2. **Risultato Filtraggio Incompleto**
**Per Piccole Imprese** dovremmo vedere TUTTI gli standard (E1-E5, S1-S4, G1) ma vediamo solo "Generale" e "G1".

#### 3. **Export Word Non Considerava Dimensioni**
L'export Word attuale non tiene conto della dimensione aziendale nei requisiti.

## 📋 PIANO DI COMPLETAMENTO

### FASE 1: Espansione Checklist ESRS

#### A. Aggiungere Standard Ambientali (E1-E5)
```javascript
E1: [ // Cambiamenti climatici
  {
    item: "Politiche relative ai cambiamenti climatici",
    applicability: ["Piccola", "Media", "Grande"],
    mandatory: true
  },
  {
    item: "Piani di transizione per i cambiamenti climatici",
    applicability: ["Media", "Grande"],
    mandatory: true
  },
  {
    item: "Obiettivi relativi ai cambiamenti climatici",
    applicability: ["Media", "Grande"],
    mandatory: true
  },
  {
    item: "Emissioni di gas serra Scope 1",
    applicability: ["Piccola", "Media", "Grande"],
    mandatory: true
  },
  {
    item: "Emissioni di gas serra Scope 2",
    applicability: ["Piccola", "Media", "Grande"],
    mandatory: true
  },
  {
    item: "Emissioni di gas serra Scope 3",
    applicability: ["Media", "Grande"],
    mandatory: true
  }
],

E2: [ // Inquinamento
  {
    item: "Politiche relative all'inquinamento",
    applicability: ["Piccola", "Media", "Grande"],
    mandatory: true
  },
  {
    item: "Azioni per prevenire e controllare l'inquinamento",
    applicability: ["Media", "Grande"],
    mandatory: true
  },
  {
    item: "Obiettivi relativi alla prevenzione dell'inquinamento",
    applicability: ["Media", "Grande"],
    mandatory: true
  }
],

E3: [ // Acque e risorse marine
  {
    item: "Politiche relative alle acque e alle risorse marine",
    applicability: ["Piccola", "Media", "Grande"],
    mandatory: true
  },
  {
    item: "Azioni per la gestione sostenibile delle risorse idriche",
    applicability: ["Media", "Grande"],
    mandatory: true
  }
],

E4: [ // Biodiversità ed ecosistemi
  {
    item: "Politiche relative alla biodiversità e agli ecosistemi",
    applicability: ["Piccola", "Media", "Grande"],
    mandatory: true
  },
  {
    item: "Azioni per conservare e ripristinare la biodiversità",
    applicability: ["Media", "Grande"],
    mandatory: true
  }
],

E5: [ // Uso delle risorse ed economia circolare
  {
    item: "Politiche relative all'uso delle risorse ed economia circolare",
    applicability: ["Piccola", "Media", "Grande"],
    mandatory: true
  },
  {
    item: "Azioni per l'uso efficiente delle risorse",
    applicability: ["Media", "Grande"],
    mandatory: true
  }
]
```

#### B. Aggiungere Standard Sociali Mancanti (S1-S3)
```javascript
S1: [ // Forza lavoro propria
  {
    item: "Politiche relative alla forza lavoro propria",
    applicability: ["Piccola", "Media", "Grande"],
    mandatory: true
  },
  {
    item: "Condizioni di lavoro",
    applicability: ["Piccola", "Media", "Grande"],
    mandatory: true
  },
  {
    item: "Pari opportunità",
    applicability: ["Piccola", "Media", "Grande"],
    mandatory: true
  },
  {
    item: "Altre questioni relative al lavoro",
    applicability: ["Media", "Grande"],
    mandatory: true
  }
],

S2: [ // Lavoratori catena del valore
  {
    item: "Politiche relative ai lavoratori della catena del valore",
    applicability: ["Media", "Grande"],
    mandatory: true
  },
  {
    item: "Processi per coinvolgere i lavoratori della catena del valore",
    applicability: ["Media", "Grande"],
    mandatory: true
  }
],

S3: [ // Comunità interessate
  {
    item: "Politiche relative alle comunità interessate",
    applicability: ["Media", "Grande"],
    mandatory: true
  },
  {
    item: "Processi per coinvolgere le comunità interessate",
    applicability: ["Media", "Grande"],
    mandatory: true
  }
]
```

### FASE 2: Miglioramento Export Word

#### A. Aggiungere Sezione Requisiti per Dimensione
```javascript
// Aggiungere al template Word
function addCompanySizeRequirements(doc, audit, requisitiDimensioni) {
  const dimensioneMap = {
    'Micro': 'micro',
    'Piccola': 'piccola', 
    'Media': 'media',
    'Grande': 'grande'
  };
  
  const info = requisitiDimensioni.dimensioni_aziendali[dimensioneMap[audit.dimensione]];
  
  // Sezione Requisiti Normativi
  doc.addParagraph("REQUISITI NORMATIVI PER DIMENSIONE AZIENDALE", {
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 400, after: 200 }
  });
  
  doc.addParagraph(`Dimensione: ${audit.dimensione}`, { bold: true });
  doc.addParagraph(`Entrata in vigore: ${info.tempistiche.entrata_vigore}`);
  doc.addParagraph(`Prima rendicontazione: ${info.tempistiche.prima_rendicontazione}`);
  
  // Standard ESRS applicabili
  doc.addParagraph("Standard ESRS Applicabili:", { bold: true });
  Object.entries(info.requisiti_esrs)
    .filter(([_, requirements]) => requirements.length > 0)
    .forEach(([standard, requirements]) => {
      doc.addParagraph(`• ${standard}: ${requirements.join(', ')}`);
    });
}
```

#### B. Filtro Export per Dimensione
```javascript
// Modificare export per includere solo elementi applicabili
function getApplicableItems(esrsDetails, dimensione) {
  const filtered = {};
  
  Object.keys(esrsDetails).forEach(category => {
    const applicableItems = esrsDetails[category].filter(item => 
      item.applicability?.includes(dimensione) || typeof item === 'string'
    );
    
    if (applicableItems.length > 0) {
      filtered[category] = applicableItems;
    }
  });
  
  return filtered;
}
```

### FASE 3: Validazione e Testing

#### A. Test Cases per Dimensioni
- **Micro**: Solo elementi `Generale` applicabili
- **Piccola**: `Generale` + elementi base di tutti gli standard
- **Media**: Tutti gli standard con requisiti completi
- **Grande**: Tutti gli standard con massimo dettaglio

#### B. Test Export Word
- Verificare che il Word contenga solo elementi applicabili
- Controllare sezione requisiti normativi
- Validare formattazione per ogni dimensione

## 🎯 PRIORITÀ PER DOMANI

### Alta Priorità
1. **Completare gli standard ESRS mancanti (E1-E5, S1-S3)**
2. **Testare filtraggio con tutti gli standard**
3. **Aggiornare export Word per dimensioni**

### Media Priorità
4. Migliorare pannello informativo con dettagli per standard
5. Aggiungere indicatori di progresso per categoria

### Bassa Priorità
6. Ottimizzare interfaccia per grandi dataset
7. Aggiungere esportazione in altri formati

## 📊 METRICHE DI SUCCESSO

**Per Piccole Imprese** dovremmo vedere:
- 10 categorie ESRS (E1-E5, S1-S4, G1, Generale)
- ~30-40 elementi totali (rendicontazione semplificata)

**Per Medie Imprese** dovremmo vedere:
- 10 categorie ESRS complete
- ~60-80 elementi totali

**Per Grandi Imprese** dovremmo vedere:
- 10 categorie ESRS complete
- ~80-100 elementi totali (massimo dettaglio)

## 🔧 STRUMENTI NECESSARI

1. **Esempi di bilanci di sostenibilità** dalla cartella `docs/esempi/` per estrarre elementi di checklist reali
2. **Documenti normativi** per validare applicabilità per dimensione
3. **Template Word migliorato** con sezioni per requisiti normativi

---

**Next Steps per Domani:**
1. Analizzare esempi di bilanci per estrarre elementi E1-E5, S1-S3
2. Implementare standard ESRS mancanti
3. Testare filtraggio completo
4. Migliorare export Word con requisiti per dimensione
