## Titolo PR

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
