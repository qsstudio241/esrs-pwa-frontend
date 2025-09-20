## Summary
- Refactor + coverage + E2E stabilization for ESRS PWA Frontend.

## Changes
- Strict DR-level ESRS coverage script and CI gate.
- KPI: persist state, snapshot v2 includes `kpiState`, E2E for refactored UI.
- Evidence (legacy UI): gallery flow robust; FS-mode selector fix.
- Docs: README updated (setup, scripts, coverage, E2E, KPI, evidence, CI).

## Tests
- Unit tests (Jest) passing.
- E2E (Playwright) passing locally; CI uploads HTML report.
- Coverage strict: 100% per categoria.

## CI
- GitHub Actions: build, unit tests, strict coverage gate, E2E.

## Checklist
- [ ] Changes align to project style
- [ ] CI green
- [ ] Strict ESRS coverage remains at 100%
- [ ] E2E stable on CI## Titolo PR

Breve descrizione: cosa cambia e perché.

### Tipo di cambiamento

- [ ] Feature
- [ ] Fix
- [ ] Refactor / Tech Debt
- [ ] Documentazione
- [ ] Build / CI

### Sommario

Contesto, problema, soluzione (snapshot schema v2, hooks modulari, export unificato, ecc.).

### Checklist

- [ ] Test unitari passano (`npm test`)
- [ ] Smoke E2E (`npm run test:e2e`) passata (se modifiche UI core)
- [ ] Build produzione ok (`npm run build`)
- [ ] Nessun `console.error` in dev tools
- [ ] Export Word con snapshot v2 include KPI & evidenze
- [ ] Limiti evidenze rispettati (dimensione + count)
- [ ] Telemetria opt-in/out funziona
- [ ] Service Worker attivo/offline OK

### Deployment Notes

Netlify: Base dir = `frontend`, Build = `npm run build`, Publish = `build`, Node 18.

### Issue correlate

Closes #

### Screenshots (opzionale)
