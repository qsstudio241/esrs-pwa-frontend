# PROMPT PER ANALISI REQUISITI ESRS PER DIMENSIONE AZIENDALE

## OBIETTIVO
Analizzare i documenti normativi ESRS/CSRD per estrarre i requisiti specifici per dimensione aziendale e creare una mappatura strutturata.

## DOCUMENTI DA ANALIZZARE
1. **CELEX_32022L2464_IT_TXT.pdf** - Direttiva CSRD dell'UE
2. **PDR1342022.pdf** - Standard di riferimento italiano
3. **unieniso26000.pdf** - ISO 26000 per la responsabilità sociale

## TASK SPECIFICO
Estrai dalle normative una mappatura dettagliata che specifichi:

### 1. DEFINIZIONI DIMENSIONI AZIENDALI
Per ogni dimensione (Micro, Piccola, Media, Grande), identifica:
- Criteri di classificazione (fatturato, dipendenti, totale attivo)
- Soglie numeriche precise
- Eventuali deroghe o eccezioni

### 2. REQUISITI OBBLIGATORI PER DIMENSIONE
Per ogni standard ESRS (E1, E2, E3, E4, E5, S1, S2, S3, S4, G1), determina:
- Quali punti sono obbligatori per ogni dimensione aziendale
- Quali sono opzionali o non applicabili
- Eventuali requisiti semplificati per PMI

### 3. TEMPISTICHE DI APPLICAZIONE
- Date di entrata in vigore per dimensione
- Periodi di transizione
- Scadenze specifiche

## FORMATO OUTPUT RICHIESTO

```json
{
  "dimensioni_aziendali": {
    "micro": {
      "criteri": {
        "fatturato_max": "numero",
        "dipendenti_max": "numero", 
        "totale_attivo_max": "numero"
      },
      "requisiti_esrs": {
        "E1": ["lista", "punti", "obbligatori"],
        "E2": ["lista", "punti", "obbligatori"],
        "E3": ["lista", "punti", "obbligatori"],
        "E4": ["lista", "punti", "obbligatori"],
        "E5": ["lista", "punti", "obbligatori"],
        "S1": ["lista", "punti", "obbligatori"],
        "S2": ["lista", "punti", "obbligatori"],
        "S3": ["lista", "punti", "obbligatori"],
        "S4": ["lista", "punti", "obbligatori"],
        "G1": ["lista", "punti", "obbligatori"]
      },
      "requisiti_opzionali": {
        "E1": ["lista", "punti", "opzionali"],
        "E2": ["lista", "punti", "opzionali"]
      },
      "tempistiche": {
        "entrata_vigore": "data",
        "prima_rendicontazione": "data"
      }
    },
    "piccola": {
      // stessa struttura
    },
    "media": {
      // stessa struttura  
    },
    "grande": {
      // stessa struttura
    }
  },
  "note_implementazione": [
    "Note specifiche per l'implementazione",
    "Eccezioni particolari",
    "Considerazioni tecniche"
  ]
}
```

## FOCUS SPECIALE
Prestare particolare attenzione a:
- Semplificazioni previste per PMI
- Requisiti ridotti per micro imprese
- Principio di doppia materialità e sua applicazione per dimensione
- Eventuali esenzioni settoriali

## RISULTATO ATTESO
Un file JSON strutturato che permetta al codice React di filtrare automaticamente i requisiti ESRS in base alla dimensione aziendale selezionata nell'audit.

---

**ISTRUZIONI PER L'ESECUZIONE:**
1. Analizza tutti e tre i documenti PDF
2. Estrai le informazioni richieste
3. Organizzale nel formato JSON specificato
4. Salva il risultato come `requisiti_dimensioni_esrs.json`
5. Carica il file nella cartella `docs/specifiche/`
