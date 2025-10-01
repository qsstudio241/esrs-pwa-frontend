# ESRS PWA Frontend

Applicazione React per la ## UI: legacy vs refactored

- Toggle: "Usa nuova checklist (beta)" abilita la UI refactor (`ChecklistRefactored`).
- **Refactor (Beta UI)**: KPI con pulsante di ciclo stato, ricerca tempo reale, progress bar avanzata, gestione evidenze migliorata, export integrato
- **Legacy UI**: Gestione completa evidenze con pulsanti "📁 Galleria" e "📷 Foto", export JSON/Word/HTML

### 🚀 Roadmap UI Enhancement (In Progress)

- **Ricerca tempo reale**: Migrazione da beta a legacy UI
- **Progress bar avanzata**: Visualizzazione percentuale e contatori
- **KPI management**: Sistema stati ciclico e validazione input
- **Export buttons**: Integrazione pulsanti export miglioratilist ESRS/CSRD con supporto offline, export versionati e gestione evidenze su File System (quando disponibile) o in fallback su memoria del browser.

## 🌐 Deployment Live

- **Produzione**: https://esrs.netlify.app
- **Auto-deploy**: Ogni push su `main` attiva deploy automatico Netlify
- **Test produzione**: `npm run test:e2e -- prod-export-smoke.spec.ts`

## Requisiti

- Node.js 18
- NPM 9+

## Avvio rapido

```powershell
cd "frontend"
npm ci
npm start
```

L’app è disponibile su `http://localhost:3000`.

## Script principali

- `npm test` — unit test (Jest) in CI mode
- `npm run build` — build di produzione (CRA + CRACO)
- `npm run report:coverage:esrs` — report copertura ESRS (modalità base)
- `npm run report:coverage:esrs:strict` — copertura DR-level (gate in CI)
- `npm run test:e2e` — E2E Playwright (headless)
- `npm run test:e2e:headed` — E2E in modalità interattiva

Report di copertura (strict) generato in `frontend/coverage-esrs/` con `coverage-report.json` e HTML.

## 📊 Test Framework & Word Export

### Test E2E Completi (Settembre 2024)

- ✅ **Comprehensive Word Export**: Test completo audit con dati realistici
- ✅ **Realistic Company Benchmarks**: Validazione con dati Maire Tecnimont
- ✅ **Word Content Analysis**: Verifica contenuti con mammoth.js
- ✅ **Production Validation**: Test su https://esrs.netlify.app

### Word Export Dinamico

- **Template Engine**: docxtemplater con placeholders dinamici
- **File Generator**: `generateTemplateWithPlaceholders.js` per template Word
- **Content Size**: ~43KB documenti professionali con audit completi
- **Real Data**: Test con classificazione società, sezioni ESRS, KPI tracking

## UI: legacy vs refactored

- Toggle: “Usa nuova checklist (beta)” abilita la UI refactor (`ChecklistRefactored`).
- Refactor: KPI con pulsante di ciclo stato, ricerca, progress bar, caricamento evidenze per item.
- Legacy: gestione completa evidenze con pulsanti “📁 Galleria” e “📷 Foto”, export JSON/Word/HTML.

## KPI (Fase 2)

- Stati KPI persistiti in `audit.kpiStates` tramite hook `useKpiState`.
- Lo snapshot export include `kpiState` per ogni item (`utils/exporters/index.js`).
- Test:
  - `src/__tests__/kpiValidation.test.js`
  - `src/__tests__/snapshot.kpi.test.js`
  - E2E: `tests-e2e/refactored-kpi.spec.js`

## Evidenze (upload)

- Browser con File System Access API (Chrome/Edge recenti): salvataggio in cartelle locali strutturate (`Evidenze`, `Export`, `Report`).
- Fallback senza FS API (o mobile): file in memoria del browser (base64), con limiti dimensionali.
- UI legacy mostra per i file su FS: bottone con nome file e riga “Percorso: …”.

## Export

- JSON: snapshot normalizzato v2 con `schemaVersion=2` (storico export incluso).
- Word: integrazione via `docxtemplater` e fallback TXT; include riepiloghi, evidenze, commenti e conteggi KPI.
- HTML: export semplice per consultazione rapida.

## Copertura ESRS (strict)

- Script `frontend/scripts/esrs-coverage.js` valida copertura DR/sub-DR.
- Modalità strict con `--mode=strict --normalize-esrs2` e gate in CI (fallisce se una categoria < 100%).

## CI (GitHub Actions)

- Workflow: `.github/workflows/ci.yml`
  - Install, unit test, build
  - Copertura ESRS strict (gate)
  - E2E Playwright + upload report

## 📋 Compliance Standard & Roadmap

### PDR 134:2022 Compliance Status

- **Stakeholder & Materialità**: 30% ⚠️ (Schema KPI base presente)
- **Doppia Matrice Materialità**: 0% ❌ (Da implementare)
- **Definizione KPI**: 75% ✅ (Sistema robusto, mancano KPI settoriali)
- **Raccolta Dati**: 40% ⚠️ (Upload evidenze presente, mancano connettori automatici)
- **Redazione Bilanci**: 90% ✅ (Export Word dinamico eccellente)

**Compliance Media**: 47% - Vedi `REPORT_COMPLIANCE_PDR1342022.md` per dettagli completi

### Roadmap UI Enhancement (In corso)

- Migrazione features beta UI → legacy UI per consistenza interfaccia
- Ricerca tempo reale, progress bar avanzata, gestione KPI migliorata

## Note di sviluppo

- Dataset modulare: `src/data/esrsDetails.js` con `itemId` deterministici e classificazioni.
- Refactor hooks: `useEvidenceManager`, `useKpiState`, `useAutosaveDebounce` (solo dove utile), `useEsrsData`.
- Esportatori: `src/utils/exporters/index.js` (JSON/Word/HTML).
- Checklist dinamica: `src/checklists/esrs-base.json` - Configurazione ESRS completa

## Netlify

- Config presente (`netlify.toml`), build dir: `frontend/build`.

## Troubleshooting

- “Browser non supporta File System Access API”: usare Chrome/Edge aggiornati, altrimenti fallback attivo.
- E2E: se un test dipende dal FS, verificare che i selettori siano aggiornati e che il mock del picker sia attivo.
