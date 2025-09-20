# ESRS PWA – Developer Documentation

## 1. Overview

Applicazione React (CRA + CRACO) per audit ESRS/CSRD con gestione checklist, evidenze, KPI stato e export multi-formato (JSON / Word / HTML). Architettura modulare orientata a: stabilità (snapshot versionato), estendibilità (hook separati), resilienza (ErrorBoundary), sicurezza caricamenti (limiti MIME / size), accessibilità (ARIA) e performance logging.

## 2. Core Data Model

- `audit` (persistito in `localStorage` array `audits`):
  - `id`, `azienda`, `dimensione`, `stato`, `dataAvvio`
  - `comments`: { "CAT-item-name": string }
  - `files`: { "CAT-item-name": FileDescriptor[] } (FileDescriptor può includere `name`, `type`, `size`, `path`, `base64` fallback)
  - `completed`: { "CAT-item-name": boolean }
  - `kpiStates`: { itemId: { state: KPI_STATES.\*, updatedAt } }
  - `exportHistory`: array (estendibile per traccia audit trail export)
  - `performanceLog`: array di record (upload / export) creati da `performanceProfiler`

## 3. Stable Identifiers

`data/esrsDetails.js` costruisce dataset arricchito con `itemId` deterministico: hash corto + slug item. Serve a:

- Migrazione sicura snapshot tra versioni dataset
- Mapping KPI states e future analytics

## 4. Snapshot Schema (v2)

Prodotto da `buildSnapshot(audit)` in `utils/exporters/index.js`:

```jsonc
{
  "meta": { "schemaVersion": 2, "generatedAt": ISODate, "migratedFrom": number },
  "audit": { "azienda", "dimensione", "dataAvvio", "stato" },
  "exportHistory": [],
  "items": [
    {
      "key": "CAT-item-name",
      "category": "CAT",
      "item": "item-name",
      "itemId": "<stableId>|null se deprecato",
      "comment": "",
      "files": [ FileDescriptor ],
      "completed": bool,
      "deprecated": bool,
      "kpiState": "OK|NOK|OPT_*|NA|null"
    }
  ]
}
```

Versionamento consente: backward compatibility, migrazioni, arricchimenti Word/HTML/PDF.

## 5. Hooks & Responsibilities

- `useEsrsData` – filtro dataset + ricerca testuale.
- `useEvidenceManager` – gestione upload (File System Access API + fallback base64), sicurezza (MIME whitelist, limiti file (2MB), cumulativo item (8MB), count max 5), compressione immagini.
- `useKpiState` – ciclo stati KPI & aggregazione per categoria.
- `useAutosaveDebounce` – patch incrementali di stato audit (kpiStates, etc.) con flush debounced + intervallo periodico.

## 6. Export Layer

`utils/exporters/index.js`:

- `buildSnapshot(audit)` – normalizza.
- `exportJSON(audit)` – produce JSON pretty.
- `exportWord(audit)` – ora invoca `generateWordReport(snapshot)` (compatibility adapter). Word engine in `utils/wordExport.js` rileva se input è snapshot per generare:
  - da template DOCX (se presente) via docxtemplater.
  - fallback plain text avanzato (gap analysis, action plan, KPI counts, evidenze, commenti).
- `exportHTML(audit)` – tabella semantica con meta + evidenze.
- `buildExportFileName(audit, type)` – naming consistente.

## 7. Word Export Parity

Aggiornato per includere:

- KPI state per item (`kpiState`)
- Conteggio evidenze e commenti
- KPI summary (`kpiCounts`)
- Fallback testo arricchito se manca template.

## 8. Performance Profiling

`utils/performanceProfiler.js` (non mostrato qui) fornisce:

- `createProfiler(label)` → `{ end(extra) }` registra durata
- `appendPerformanceLog(audit, entry)` (pattern) salva in `audit.performanceLog` (persistito via `onUpdate`).
  Strumentazione su: upload evidenze, export JSON/Word.

## 9. Accessibility & UX

`ChecklistRefactored`:

- ARIA: ruoli espansi (accordion semantics per categorie), `aria-expanded`, label chiari.
- Progress bar (percentuale completamento) derivata da `computeProgress` in `progressUtils`.
- Tastiera: toggle categorie con Enter/Space.

## 10. Security Hardening (Evidence Upload)

- MIME whitelist (immagini + PDF + testo base)
- Limiti per file (2MB) e cumulativo per item (8MB)
- Numero massimo evidenze per item (5)
- Compressione immagini lato client (quality/aggressive placeholder).

## 11. Error Isolation

`components/ErrorBoundary` avvolge checklist (legacy + refactored):

- Fallback UI con: messaggio, Riprova (soft remount), Esporta dati grezzi (audit JSON), Ricarica pagina.

## 12. Autosave Strategy

- Azioni KPI/evidenze generano patch => `useAutosaveDebounce.queue(patch)`
- Debounce + flush periodico (riduce write amplifications su localStorage).

## 13. Roadmap (Current Status)

Completed: stable IDs, snapshot v2, KPI states, unified exporters (JSON/HTML/Word), evidence manager, performance logging, autosave, accessibility, security limits, error boundary, Word export parity, CI workflow, Playwright smoke E2E, telemetry opt‑in, enhanced service worker caching.
Pending / Nice-to-have: PDF export, KPI advanced derivation rules, snapshot sync to SW via IndexedDB, multi-user sync, ESLint integration script.

## 14. Service Worker (Implemented v2)

- Precache core shell, template DOCX (se presente), manifest e loghi.
- Runtime cache (stale-while-revalidate) per asset statici.
- Network-first per navigazioni con fallback offline.
- Placeholder virtual endpoint `/offline/last-snapshot.json` (integrazione futura via postMessage → IndexedDB).

## 15. Telemetry (Implemented Opt-In)

- Flag: `localStorage.telemetry_opt_in` = `"1"` abilita raccolta.
- Eventi registrati: `export_json`, `export_word`, `export_html`, `evidence_add`, `evidence_remove`, `feature_toggle`, `telemetry_opt`.
- Sanitizzazione: rimozione testo commenti completi, truncation filenames.
- Dump: pulsante in UI esporta `telemetry_dump.json`.

## 16. Extension & Migration Guidance

Nuovo campo? Aggiungere in `items[]` e aggiornare test snapshot. Incrementare `schemaVersion` solo se la semantica cambia (non per aggiunta opzionaria backwards-compatible).

Migrazione dataset: se item rimosso -> `itemId` non trovato => `deprecated: true` (manteniamo storico). In caso di rename preferire alias mapping futuro (da implementare se necessario) invece di generare nuovo ID.

## 17. Testing Strategy

- Unit: `snapshot.test.js` (schema invariants), `kpiValidation.test.js`, `useEsrsData.test.js`, `App.test.js` smoke.
- Planned E2E: Playwright scenario minimo creazione audit -> aggiunta commento/evidenza mock -> export JSON -> validazione meta.

### 17.1 Deployment (Netlify)

Configurazione consigliata:

- Base directory: `frontend`
- Build command: `npm run build`
- Publish directory: `build`
- Node: 18 (gestito da `netlify.toml`)

Routing SPA: redirect `/* -> /index.html` e fallback `/offline`.

Post-deploy checklist:

1. SW attivo e offline reload funziona.
2. Export JSON + Word con KPI & evidenze.
3. Limiti evidenze (5 file, <=2MB ciascuno, <=8MB cumulativo) rispettati.
4. Telemetria opt-in/out senza errori.
5. KPI aggiornato riflesso nell'export.

Promozione:

1. Feature branch -> PR -> merge `main`.
2. Tag release (`vX.Y.Z`).
3. Netlify production punta a `main`, previews per PR.

### 17.2 Checklist Normalization & KPI

- Governance normalization: le categorie custom `G2`, `G3`, `G4`, `G5` vengono mappate in `ESRS-2` (General Disclosures) in fase di load tramite `ChecklistLoader.normalizeGovernance()`. Gli item mantengono tracciabilità con campo `sourceCategory`.
- Classification: ad ogni item viene assegnata una `classification` euristica tra `policy | action | target | metric | general` (utile per UI/filtri).
- KPI placeholders aggiunti (solo se mancanti):
  - `E1` (clima): intensità GHG, energia totale, quota rinnovabile, Scope1/2 (location/market), principali cat. Scope3, flag scenario analysis.
  - `E3` (acqua): prelievo totale, % riciclo, operazioni in aree ad alto stress.
  - `E5` (circolarità): rifiuti totali, % recupero/riciclo, % materiali riciclati.
  - `S1` (forza lavoro): LTIFR, tasso infortuni, ore formazione, turnover, pay gap (placeholder), % permanenti, % copertura contrattazione.
  - `S2` (catena valore): fornitori auditati %, non conformità, remediation.
  - `S4` (consumatori): reclami, incidenti sicurezza prodotto, incidenti privacy/dati.

Implementazione: `src/utils/checklistLoader.js` (funzioni `augmentChecklist`, `normalizeGovernance`, `addClassification`, `addKpiPlaceholders`). La validazione (`validateChecklist`) opera dopo l’augment.

## 18. Coding Conventions

- Niente commenti superflui inline (preferire documentazione modulare qui).
- Funzioni pure nelle utilities, side-effect confinati a hook / componenti.
- Evitare accoppiamento ciclico (dataset non importa componenti, solo utilities).

## 19. Release / CI (Planned)

GitHub Actions:

1. Setup Node (cache pnpm/npm).
2. `npm ci`
3. `npm test -- --ci`
4. `npm run build`
5. (Opzionale) Upload artifact build + eventual scan (ESLint).

## 20. Known Gaps / Future Improvements

- KPI derivation avanzata (regole numeriche) non implementata.
- Validazione struttura file evidenze (hash integrità) futura.
- PDF export mancante (potrebbe riusare HTML + pdfmake / puppeteer server-side).
- Nessuna strategia multi-utente/sync (solo localStorage local-first + FS API).

## 21. Quick Dev Commands

```bash
# Install
npm install

# Test
npm test

# Build
npm run build

# Lint (se aggiunto in futuro)
npm run lint
```

## 22. Troubleshooting

| Sintomo                    | Possibile causa              | Azione                                                     |
| -------------------------- | ---------------------------- | ---------------------------------------------------------- |
| Evidenza rifiutata         | MIME non in whitelist        | Verifica tipo file / estensione                            |
| Export Word fallback a txt | Template non trovato         | Aggiungi file in `public/templates/template-bilancio.docx` |
| KPI non persistono         | Mancata flush autosave       | Forza interazione o verifica localStorage spazio           |
| ErrorBoundary visibile     | Eccezione runtime componente | Usa console.log stack, Riprova o Esporta dati              |

---

Aggiornare questo documento ad ogni modifica strutturale (snapshot, hook core, export pipeline).
