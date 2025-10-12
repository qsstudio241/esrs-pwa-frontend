# Verifica Schema KPI Implementati

**Data creazione**: 11 ottobre 2025  
**Versione**: 1.0  
**Status**: ✅ Estensione completata per 5 categorie critiche

---

## 📊 Riepilogo Implementazione

### Categorie Completate ✅

| Categoria    | Codice ESRS | Schema KPI | Validazioni | Evidence Required | Status      |
| ------------ | ----------- | ---------- | ----------- | ----------------- | ----------- |
| **Generale** | ESRS-1      | 3          | 7 checks    | 5 documenti       | ✅ Completo |
| **E1**       | ESRS-E1     | 2          | 5 checks    | 5 documenti       | ✅ Completo |
| **E2**       | ESRS-E2     | 1          | 2 checks    | 3 documenti       | ✅ Completo |
| **S1**       | ESRS-S1     | 1          | 3 checks    | 3 documenti       | ✅ Completo |
| **G1**       | Governance  | 1          | 2 checks    | 2 documenti       | ✅ Completo |

**Totale**: 8 schema KPI, 19 validazioni, 18 evidenze richieste

---

## 🎯 CATEGORIA: GENERALE (ESRS-1)

### G003 - Doppia Rilevanza ✅

**Fields**:

- `valutazione_materialita_eseguita` (bool, required)
- `coinvolgimento_stakeholder` (bool, required)
- `metodologia` (enum: ESRS/CSRD | Proprietaria | Altro)
- `data` (date)

**Validations**:

1. **DM_REQUIRED** (error): Valutazione materialità + stakeholder obbligatori
   - ActionPlan: Workshop materialità entro 30gg con CFO/CSO/stakeholder
2. **DM_METHODOLOGY_RECOMMENDED** (warning): Raccomandato specificare metodologia
   - ActionPlan: Documentare metodologia, allegare matrice e verbale

**Evidence**: Matrice di Materialità, Verbale Stakeholder Engagement

---

### G005 - Catena del Valore ✅

**Fields**:

- `confini_reporting_definiti` (bool, required)
- `copertura_upstream` (number 0-100%, optional)
- `copertura_downstream` (number 0-100%, optional)

**Validations**:

1. **BOUNDARIES_REQUIRED** (error): Confini reporting obbligatori
   - ActionPlan: Mappare fornitori critici + distributori/clienti
2. **COVERAGE_MIN** (warning): Copertura >=80% raccomandata ESRS
   - ActionPlan: Estendere copertura, target 80-100%
3. **COVERAGE_INFO** (info): Best practice 100% per grandi imprese

**Evidence**: Mappa Catena del Valore, Elenco Fornitori Critici

---

### G006 - Orizzonti Temporali ✅

**Fields**:

- `orizzonte_breve_anni` (number 1-3, required)
- `orizzonte_medio_anni` (number 3-10, required)
- `orizzonte_lungo_anni` (number 10+, required)

**Validations**:

1. **RANGE_VALID** (error): Orizzonti devono essere crescenti
   - ActionPlan: Correggere ordine (breve < medio < lungo)
2. **RECOMMENDED_RANGES** (info): ESRS raccomanda 1-3 / 3-10 / 10+

**Evidence**: Documento Strategia Aziendale con Timeline

---

## 🌍 CATEGORIA: E1 - CAMBIAMENTI CLIMATICI

### E1001 - Piano di Transizione Climatica ✅

**Fields**:

- `piano_esistente` (bool, required)
- `target_net_zero` (bool, required)
- `anno_target` (number 2025-2050, optional)

**Validations**:

1. **TRANSITION_PLAN_REQUIRED** (error): Piano Net Zero obbligatorio
   - ActionPlan: Sviluppare piano con baseline, target per scope, roadmap, investimenti. Allineamento SBTi.
2. **TARGET_YEAR_2050** (warning): EU Green Deal richiede 2050
   - ActionPlan: Target 2050 o prima. Obiettivi intermedi: -30% 2030, -55% 2040

**Evidence**: Piano Transizione Climatica, Target SBTi

---

### E1006 - Inventario Emissioni GHG ✅

**Fields**:

- `scope1_calcolato` (bool, required)
- `scope2_calcolato` (bool, required)
- `scope3_calcolato` (bool, optional)
- `scope1_tonnellate` (number, tCO2e)
- `scope2_tonnellate` (number, tCO2e)
- `scope3_tonnellate` (number, tCO2e)

**Validations**:

1. **SCOPE_1_2_MANDATORY** (error): Scope 1+2 obbligatori
   - ActionPlan: Calcolare con GHG Protocol. Tools: Carbon Trust, CDP
2. **SCOPE_3_RECOMMENDED** (warning): Scope 3 spesso 70-90% emissioni
   - ActionPlan: Calcolare categorie principali (acquisti, trasporti, uso prodotti)
3. **DATA_QUALITY** (info): Usare fattori emissione aggiornati

**Evidence**: Inventario GHG certificato, Report Carbon Footprint, Fatture energia

---

## 🏭 CATEGORIA: E2 - INQUINAMENTO

### E2001 - Inquinamento Atmosferico ✅

**Fields**:

- `monitoraggio_attivo` (bool, required)
- `autorizzazioni_ambientali` (bool, required)

**Validations**:

1. **MONITORING_REQUIRED** (error): Monitoraggio obbligatorio
   - ActionPlan: SME continuo/periodico secondo AIA. Conformità limiti emissivi
2. **PERMITS_VALID** (error): Autorizzazioni valide
   - ActionPlan: Verificare scadenze AIA/AUA. Rinnovo preventivo

**Evidence**: AIA/AUA vigenti, Report emissioni annuali, Certificati analisi

---

## 👥 CATEGORIA: S1 - FORZA LAVORO

### S1002 - Salute e Sicurezza sul Lavoro ✅

**Fields**:

- `dvr_aggiornato` (bool, required)
- `formazione_sicurezza_erogata` (bool, required)
- `infortuni_anno` (number, min 0)
- `ore_lavorate` (number, min 0)

**Validations**:

1. **DVR_MANDATORY** (error): DVR obbligatorio D.Lgs 81/2008
   - ActionPlan: Aggiornare DVR entro 30gg con RSPP/MC/RLS
2. **TRAINING_REQUIRED** (error): Formazione obbligatoria
   - ActionPlan: 4h generale + specifica rischio. Aggiornamento 5 anni
3. **INJURY_RATE** (warning): Indice infortuni > 10 (threshold)
   - ActionPlan: Near-miss analysis, azioni correttive. Target < 10/milione ore

**Evidence**: DVR aggiornato, Registro infortuni, Attestati formazione

---

## 🏛️ CATEGORIA: G1 - GOVERNANCE

### G001 - Governance Sostenibilità ✅

**Fields**:

- `comitato_sostenibilita` (bool, optional)
- `responsabile_sostenibilita` (bool, required)

**Validations**:

1. **RESPONSIBLE_REQUIRED** (error): Nominare responsabile
   - ActionPlan: Nominare CSO/Sustainability Manager con mandato CdA
2. **COMMITTEE_RECOMMENDED** (info): Best practice costituire comitato

**Evidence**: Organigramma con ruolo sostenibilità, Verbali CdA

---

## 📋 Categorie da Completare

### Priorità Alta 🔴

- **E3** (Risorse Idriche): 2 KPI da mappare
- **E5** (Economia Circolare): 2 KPI da mappare
- **S2** (Lavoratori Catena Valore): 3 KPI da mappare

### Priorità Media 🟡

- **E4** (Biodiversità): 2 KPI da mappare
- **S3** (Comunità): 2 KPI da mappare
- **S4** (Consumatori): 2 KPI da mappare

### Priorità Bassa 🟢

- **G2-G4** (Altri aspetti governance): da valutare

---

## 🔍 Verifica Conformità Normativa

### Riferimenti ESRS

- ✅ **ESRS 1**: Principi generali implementati
- ✅ **ESRS E1**: Standard climatico conforme
- ✅ **ESRS E2**: Inquinamento base conforme
- ✅ **ESRS S1**: Standard sociale conforme
- ⚠️ **Altri ESRS**: Da completare

### Requisiti Legali Italiani

- ✅ **D.Lgs 81/2008**: Salute sicurezza coperto
- ✅ **AIA/AUA**: Autorizzazioni ambientali verificate
- ✅ **GHG Protocol**: Inventario emissioni allineato
- ⚠️ **Bilancio Consolidato**: Da mappare ulteriori requisiti

---

## 📊 Metriche Qualità Schema

| Metrica                     | Valore                           | Target     | Status |
| --------------------------- | -------------------------------- | ---------- | ------ |
| Coverage categorie critiche | 5/5                              | 100%       | ✅     |
| Validazioni per schema      | 2.4 avg                          | 2-4        | ✅     |
| ActionPlan completeness     | 100%                             | 100%       | ✅     |
| Evidence richieste          | 18 totali                        | 15+        | ✅     |
| Severity distribution       | Error 53%, Warning 31%, Info 16% | Bilanciato | ✅     |

---

## 🎯 Prossimi Step

1. **Completare E3, E5, S2-S4** (Priorità Alta)
2. **Test end-to-end** su G003, E1006, S1002
3. **Evidence metadata** per upload file
4. **Findings export** in Word/Excel
5. **Dashboard** visualizzazione progresso

---

## 📝 Note Implementazione

### Pattern Schema Consolidato

```javascript
{
  title: "Nome KPI",
  fields: [
    { key, label, type, required, min, max, unit, enum }
  ],
  checks: [
    { code, severity, message, test, actionPlan }
  ],
  requiredEvidences: ["Doc1", "Doc2"]
}
```

### Severity Guidelines

- **Error**: Requisito obbligatorio normativo/ESRS
- **Warning**: Best practice, raccomandazione forte
- **Info**: Suggerimento, excellence

### Evidence Naming

- Documenti ufficiali: maiuscolo ("DVR", "AIA")
- Descrittivi: maiuscolo iniziale ("Matrice di Materialità")
- Generici: minuscolo ("fatture energia")

---

**Documento vivo**: Aggiornare ad ogni estensione schema
