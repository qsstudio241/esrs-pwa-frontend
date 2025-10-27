# 🧪 Guida Test - Configurazione Soglie Materialità

## Obiettivo

Verificare il corretto funzionamento del sistema di configurazione soglie per le raccomandazioni di materialità, conforme a PDR 134:2022.

---

## ✅ Test 1: Apertura Pannello Configurazione

### Passi

1. Aprire applicazione ESRS PWA
2. Creare o aprire un audit esistente
3. Navigare a **"Analisi Materialità" → "Questionario ISO 26000"**
4. Selezionare almeno 2 temi (es. "Diritti Umani", "Lavoro")
5. Scorrere la pagina - cercare pannello **"⚙️ Configurazione Soglie Materialità"**

### Risultato Atteso

- ✅ Pannello visibile con header collapsabile
- ✅ Badge "PDR 134:2022 Compliant" presente
- ✅ Clic su header espande/chiude il pannello
- ✅ Icona freccia cambia (▶ → ▼)

### Screenshot

📸 Cattura schermata pannello espanso

---

## ✅ Test 2: Presets Predefiniti

### Passi

1. Espandere pannello "Configurazione Soglie"
2. Leggere box blu "📖 Riferimenti Normativi"
3. Cliccare su pulsante **"🛡️ Conservativo"**
4. Verificare slider aggiornati a **2.5 (temi) / 3.0 (aspetti)**
5. Cliccare su **"✅ Standard"**
6. Verificare slider aggiornati a **3.0 (temi) / 3.5 (aspetti)**
7. Cliccare su **"🎯 Focalizzato"**
8. Verificare slider aggiornati a **4.0 (temi) / 4.5 (aspetti)**

### Risultato Atteso

- ✅ Slider si muovono al clic sui preset
- ✅ Input numerico sincronizzato con slider
- ✅ Textarea giustificazione si aggiorna automaticamente
- ✅ Testo giustificazione spiega criterio preset

### Esempio Giustificazione Standard

> "Soglia bilanciata che identifica temi materiali senza sovraccarico informativo. Allineata alle best practice ESRS per aziende di medie dimensioni."

---

## ✅ Test 3: Slider Personalizzati

### Passi

1. Selezionare preset "Standard" (3.0 / 3.5)
2. Trascinare slider **"Soglia Temi"** a **3.5**
3. Verificare input numerico mostra "3.5"
4. Cliccare su input numerico, digitare **"2.0"**
5. Premere Enter
6. Verificare slider si sposta a posizione 2.0
7. Ripetere per **"Soglia Aspetti"**

### Risultato Atteso

- ✅ Slider e input sempre sincronizzati
- ✅ Valori consentiti: 1.0 - 5.0 (step 0.5)
- ✅ Label "molto permissivo → molto restrittivo" visibile
- ✅ Nessun errore console browser

### Valori Test Estremi

| Azione          | Valore Input | Risultato Atteso     |
| --------------- | ------------ | -------------------- |
| Min             | 1.0          | ✅ Accettato         |
| Max             | 5.0          | ✅ Accettato         |
| Fuori range     | 0.5          | ⚠️ Bloccato a 1.0    |
| Fuori range     | 5.5          | ⚠️ Bloccato a 5.0    |
| Step intermedio | 3.3          | ⚠️ Arrotondato a 3.5 |

---

## ✅ Test 4: Giustificazione Soglie

### Passi

1. Selezionare preset "Conservativo"
2. Cancellare testo giustificazione esistente
3. Digitare giustificazione personalizzata:
   ```
   L'azienda è una PMI del settore tessile con poca maturità ESG.
   Soglia conservativa necessaria per identificare tutti i rischi
   rilevanti e non perdere impatti significativi.
   ```
4. Verificare contatore caratteri (se presente)
5. Verificare suggerimenti sotto textarea

### Risultato Atteso

- ✅ Textarea multiriga (minimo 4 righe visibili)
- ✅ Testo placeholder visibile se vuoto
- ✅ Resize verticale possibile (drag angolo)
- ✅ Suggerimento "💡 Includi: dimensione aziendale, settore..." visibile

### Best Practice Giustificazione

Includere almeno 3 dei seguenti elementi:

- ✅ Dimensione aziendale (PMI/Grande impresa)
- ✅ Settore operativo (manifatturiero, servizi, etc.)
- ✅ Livello maturità ESG (iniziale, intermedio, avanzato)
- ✅ Strategia sostenibilità (certificazioni, obiettivi)
- ✅ Stakeholder critici (comunità locali, investitori ESG)

---

## ✅ Test 5: Salvataggio Configurazione

### Passi

1. Configurare soglie personalizzate: **Temi 2.5 / Aspetti 3.0**
2. Inserire giustificazione completa
3. Cliccare pulsante **"💾 Salva Configurazione"**
4. Verificare alert "✅ Configurazione soglie salvata con successo!"
5. Chiudere alert
6. Ricaricare pagina (F5)
7. Riaprire pannello configurazione
8. Verificare soglie e giustificazione ripristinate

### Risultato Atteso

- ✅ Alert conferma visibile
- ✅ Dopo F5, configurazione persistente
- ✅ Timestamp "Ultima modifica" aggiornato
- ✅ Console log: "✅ Configurazione soglie aggiornata: {...}"

### Verifica Console Browser

```javascript
// Aprire DevTools (F12) → Console
// Dopo salvataggio, dovrebbe apparire:
"✅ Configurazione soglie aggiornata: {
  thresholdRecommendations: { themes: 2.5, aspects: 3.0, justification: "..." },
  updatedAt: "2025-01-23T..."
}"
```

---

## ✅ Test 6: Reset Default

### Passi

1. Configurare soglie personalizzate: **Temi 4.5 / Aspetti 4.0**
2. Modificare giustificazione
3. Cliccare **"🔄 Ripristina Default"**
4. Verificare ripristino a **3.0 / 3.5**
5. Verificare giustificazione torna a testo Standard

### Risultato Atteso

- ✅ Soglie resettate a 3.0 / 3.5
- ✅ Giustificazione default ripristinata
- ✅ Slider e input sincronizzati
- ✅ Nessuna richiesta conferma (reset immediato)

---

## ✅ Test 7: Generazione Raccomandazioni (Soglie Basse)

### Passi

1. Configurare preset **"🛡️ Conservativo"** (2.5 / 3.0)
2. Salvare configurazione
3. Completare questionario ISO 26000:
   - S1 (Diritti Umani) → punteggi medi 3.0-3.5
   - S2 (Lavoro) → punteggi medi 2.5-3.0
4. Cliccare **"Genera Scoring Materialità"**
5. Scorrere a **"Raccomandazioni Immediate"**

### Risultato Atteso

- ✅ Sezione "Raccomandazioni Immediate" **NON VUOTA**
- ✅ Almeno 1-2 temi raccomandati (es. S1, S2)
- ✅ Lista aspetti dettagliati presente
- ✅ Score mostrato vicino a ogni raccomandazione

### Esempio Output Atteso

```
📌 Raccomandazioni Immediate (Soglia Temi: 2.5)

1. S1 - Diritti Umani (Score: 3.0)
   - Raccomandazioni Dettagliate (Soglia Aspetti: 3.0):
     • S1_2 - Due Diligence (Score: 3.2)
     • S1_5 - Accesso a Rimedi (Score: 3.0)

2. S2 - Lavoro (Score: 2.8)
   - Raccomandazioni Dettagliate (Soglia Aspetti: 3.0):
     • S2_1 - Condizioni di Lavoro (Score: 3.1)
```

---

## ✅ Test 8: Generazione Raccomandazioni (Soglie Alte)

### Passi

1. Configurare preset **"🎯 Focalizzato"** (4.0 / 4.5)
2. Salvare configurazione
3. Rigenerare scoring con stessi dati Test 7
4. Verificare sezione "Raccomandazioni Immediate"

### Risultato Atteso

- ✅ Sezione "Raccomandazioni Immediate" **VUOTA o RIDOTTA**
- ✅ Messaggio tipo: "Nessuna raccomandazione immediata. Tutti i temi sotto soglia 4.0."
- ✅ "Top 5 Temi Prioritari" **SEMPRE POPOLATO** (indipendente da soglie)

### Confronto Test 7 vs Test 8

| Test | Soglie  | Score S1 | Raccomandato?     |
| ---- | ------- | -------- | ----------------- |
| 7    | 2.5/3.0 | 3.0      | ✅ SÌ (3.0 ≥ 2.5) |
| 8    | 4.0/4.5 | 3.0      | ❌ NO (3.0 < 4.0) |

---

## ✅ Test 9: Fallback Soglie Default

### Passi

1. Creare **nuovo audit** (non configurato)
2. Navigare a Questionario ISO 26000
3. Completare questionario **SENZA** aprire pannello configurazione
4. Cliccare "Genera Scoring"
5. Verificare raccomandazioni generate

### Risultato Atteso

- ✅ Nessun errore console
- ✅ Raccomandazioni generate con soglie **default 3.0 / 3.5**
- ✅ Fallback trasparente per utente
- ✅ Log console: "Usando soglie default 3.0/3.5"

### Verifica Console

```javascript
// DevTools → Console
// Dovrebbe apparire durante scoring:
"Soglie materialità: { themes: 3.0, aspects: 3.5 } (default)";
```

---

## ✅ Test 10: Export/Import Configurazione

### Passi

1. Configurare soglie personalizzate: **2.0 / 2.5**
2. Inserire giustificazione dettagliata
3. Salvare configurazione
4. Generare scoring
5. Cliccare **"Esporta Risultati JSON"**
6. Aprire file JSON esportato
7. Cercare campo `materialityConfig`
8. Creare nuovo audit
9. Importare file JSON
10. Verificare configurazione ripristinata

### Risultato Atteso Export

```json
{
  "metadata": { ... },
  "scoring": { ... },
  "materialityConfig": {
    "thresholdRecommendations": {
      "themes": 2.0,
      "aspects": 2.5,
      "justification": "..."
    },
    "updatedAt": "2025-01-23T..."
  }
}
```

### Risultato Atteso Import

- ✅ Pannello configurazione mostra soglie 2.0/2.5
- ✅ Giustificazione ripristinata
- ✅ Timestamp corretto

---

## 🐛 Test Errori e Edge Cases

### Test 11: Configurazione Senza Giustificazione

**Azione:** Salvare soglie senza compilare textarea  
**Atteso:** ⚠️ Alert o validazione: "Giustificazione obbligatoria (PDR 134:2022)"  
**Status:** 🔴 DA IMPLEMENTARE (attualmente permette salvataggio)

### Test 12: Valori Soglia Invertiti

**Azione:** Impostare Temi 4.0, Aspetti 2.0 (soglia aspetti < temi)  
**Atteso:** ⚠️ Warning: "Attenzione: soglia aspetti solitamente > soglia temi"  
**Status:** 🔴 DA IMPLEMENTARE (attualmente permesso)

### Test 13: Configurazione Multi-Utente

**Azione:** Utente A configura 2.5/3.0, Utente B apre stesso audit  
**Atteso:** ✅ Utente B vede configurazione di A  
**Status:** ✅ Funzionante (configurazione legata ad audit)

### Test 14: Logout Durante Configurazione

**Azione:** Modificare soglie, NON salvare, logout  
**Atteso:** ⚠️ Modifiche perse, audit mantiene config precedente  
**Status:** ✅ Comportamento corretto

---

## 📊 Checklist Finale

### Funzionalità UI

- [ ] Pannello collapsabile funzionante
- [ ] Box normativo leggibile e completo
- [ ] Presets applicano correttamente soglie e giustificazione
- [ ] Slider sincronizzati con input numerico
- [ ] Range 1.0-5.0 rispettato
- [ ] Textarea giustificazione responsive
- [ ] Pulsante "Salva" mostra alert conferma
- [ ] Pulsante "Reset" ripristina default
- [ ] Timestamp ultima modifica aggiornato

### Funzionalità Backend

- [ ] Configurazione salvata in audit.materialityConfig
- [ ] Persistenza dopo F5
- [ ] Fallback 3.0/3.5 se config assente
- [ ] Raccomandazioni usano soglie configurate
- [ ] Export JSON include materialityConfig
- [ ] Import JSON ripristina configurazione
- [ ] Nessun errore console

### Compliance Normativa

- [ ] Riferimenti PDR 134:2022, ISO 26000, ESRS 1 visibili
- [ ] Giustificazione tracciabile
- [ ] Soglie documentate per audit trail
- [ ] Separazione threshold matrix vs threshold recommendations

### Performance

- [ ] Bundle size accettabile (+2.03 kB)
- [ ] Nessun lag durante drag slider
- [ ] Salvataggio istantaneo (<100ms)
- [ ] Nessun memory leak (verificare DevTools)

---

## 📸 Documentazione Visiva

### Screenshot Richiesti

1. **Pannello chiuso** (header con badge PDR 134:2022)
2. **Pannello espanso completo** (box normativo + presets + sliders + textarea)
3. **Preset Conservativo applicato** (sliders a 2.5/3.0)
4. **Preset Focalizzato applicato** (sliders a 4.0/4.5)
5. **Giustificazione personalizzata** (esempio testo lungo)
6. **Timestamp ultima modifica** (dopo salvataggio)
7. **Raccomandazioni con soglia bassa** (lista popolata)
8. **Raccomandazioni con soglia alta** (sezione vuota)
9. **Console log salvataggio** (DevTools con log config)
10. **Export JSON** (file aperto con materialityConfig visibile)

---

## 🎯 Criteri Successo

### ✅ Test Superato Se:

- Tutti i test 1-10 passati senza errori
- Nessun console error in DevTools
- Configurazione persiste dopo reload
- Raccomandazioni cambiano con soglie diverse
- Export/Import funzionante
- UI responsive e intuitiva

### ❌ Test Fallito Se:

- Pannello non visibile
- Soglie non salvate/persistenti
- Raccomandazioni sempre vuote
- Errori console presenti
- Export manca materialityConfig
- UI rotta su mobile

---

## 📞 Segnalazione Bug

Se un test fallisce:

1. Annotare numero test (es. "Test 5: Salvataggio")
2. Screenshot errore/comportamento inatteso
3. Console DevTools (F12 → Console → screenshot)
4. Browser e versione (es. Chrome 120, Edge 120)
5. Sistema operativo (Windows 11, macOS 14)
6. Passi per riprodurre bug

**Contatto:** Aprire issue su repository GitHub

---

**Ultima Modifica:** 23 Gennaio 2025  
**Versione Guida:** 1.0.0  
**Test Coverage:** 10 test principali + 4 edge cases
