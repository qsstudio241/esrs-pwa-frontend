# 📎 Gestione Evidenze e File Grandi

**Data**: 11 ottobre 2025  
**Versione**: 1.0  
**Status**: ✅ Sistema implementato con limiti e warning

---

## 🎯 **Limiti Dimensione File**

### Soglie Implementate

| Dimensione   | Comportamento                               | Icona                |
| ------------ | ------------------------------------------- | -------------------- |
| **< 5 MB**   | ✅ Upload normale                           | Nessun warning       |
| **5-20 MB**  | ⚡ Warning suggerimento compressione        | Badge arancione      |
| **20-50 MB** | ⚠️ Warning forte + suggerimenti alternativi | Badge rosso          |
| **> 50 MB**  | ❌ Upload bloccato                          | Alert con istruzioni |

---

## 🚀 **Come Funziona**

### 1. **Upload File < 5MB** (Ideale)

```
✅ Caricamento istantaneo
✅ Nessun warning
✅ Performance ottimale
```

### 2. **Upload File 5-20MB** (Warning)

Modal mostra:

```
⚡ File grande (>5MB)

💡 Suggerimento: File grandi possono rallentare il caricamento.
Considera:
• Comprimere PDF con strumenti online
• Convertire immagini in formato più leggero
• Per file >20MB: utilizzare link cloud
```

### 3. **Upload File 20-50MB** (Warning Forte)

```
⚠️ File molto grande (>20MB)

💡 Raccomandazioni:
• Compressione obbligatoria
• Cloud storage preferibile
• Link nel campo 'Descrizione'
```

### 4. **Upload File > 50MB** (Bloccato)

```
❌ Uno o più file superano il limite di 50MB.

Per file molto grandi, considera:
• Comprimere il PDF
• Caricare su cloud storage (Google Drive, OneDrive)
• Inserire il link nel campo 'Descrizione' invece del file
```

---

## 🛠️ **Strumenti Consigliati**

### Compressione PDF

1. **SmallPDF** (https://smallpdf.com/it/comprimere-pdf)

   - ✅ Gratuito (2 file/ora)
   - ✅ Riduzione fino a 80%
   - ✅ Qualità preservata

2. **iLovePDF** (https://www.ilovepdf.com/it/comprimere_pdf)

   - ✅ Batch processing
   - ✅ Nessuna registrazione
   - ✅ 3 livelli compressione

3. **Adobe Acrobat Online**
   - ✅ Alta qualità
   - ⚠️ Richiede account

### Compressione Immagini

1. **TinyPNG** (https://tinypng.com/)

   - ✅ PNG/JPEG
   - ✅ Fino a -70% dimensione
   - ✅ Qualità visiva intatta

2. **Squoosh** (https://squoosh.app/)
   - ✅ Offline-ready (PWA)
   - ✅ Confronto prima/dopo
   - ✅ WebP, AVIF support

### Cloud Storage

1. **Google Drive**

   - 15 GB gratuiti
   - Link condivisibili
   - Integrazione Google Workspace

2. **OneDrive**

   - 5 GB gratuiti
   - Sincronizzazione automatica
   - Integrazione Microsoft 365

3. **Dropbox**
   - 2 GB gratuiti
   - Link temporanei
   - Facile condivisione

---

## 📊 **Workflow Raccomandato**

### Scenario 1: PDF Report (15MB)

```
1. Scarica PDF originale
2. Comprimi con SmallPDF → 4MB ✅
3. Carica nel sistema ESRS
4. Nota: "Documento compresso per upload, originale disponibile su richiesta"
```

### Scenario 2: Presentazione PowerPoint (35MB)

```
1. Esporta come PDF
2. Comprimi PDF → 12MB ✅
3. Alternative: converti in Google Slides
4. Link nel campo descrizione
```

### Scenario 3: Video/File Multimediali (80MB)

```
❌ Non caricare direttamente

✅ Soluzione:
1. Carica su YouTube (unlisted) o Google Drive
2. Nel sistema ESRS:
   - Descrizione: "Video intervista stakeholder - CDA 15/03/2024"
   - Link: https://drive.google.com/file/d/xyz...
   - Qualità: Sufficiente
```

### Scenario 4: Dataset Excel Complessi (25MB)

```
1. Valuta se necessario allegare tutto
2. Alternative:
   - Estrai dashboard/summary → PDF leggero
   - Carica su OneDrive/SharePoint
   - Link nel campo descrizione
   - Allega solo sheet rilevanti
```

---

## 🔐 **Sicurezza e Privacy**

### File Sensibili

⚠️ **Attenzione**: File caricati nel sistema sono salvati localmente.

**Best Practice**:

1. **Dati personali**: Rimuovere o anonimizzare
2. **Dati finanziari sensibili**: Usare versioni aggregate
3. **Informazioni confidenziali**: Preferire cloud storage aziendale con permessi
4. **Compliance GDPR**: Verificare consenso trattamento dati

### Metadata File

Il sistema salva:

- Nome file
- Dimensione (MB)
- Timestamp caricamento
- Auditor
- Descrizione
- Qualità evidenza
- Note

---

## 🎨 **UI/UX Implementate**

### Badge Dimensione

```javascript
< 5 MB   → Nessun badge
5-20 MB  → ⚡ File grande (arancione)
20-50 MB → ⚠️ File molto grande (rosso)
> 50 MB  → ❌ Bloccato
```

### Warning Box

Appare nel modal quando file > 5MB:

```
┌─────────────────────────────────────────┐
│ 💡 Suggerimento:                        │
│ File grandi (>5MB) possono rallentare   │
│ il caricamento. Considera:              │
│ • Comprimere PDF                        │
│ • Convertire immagini                   │
│ • Link cloud per file >20MB             │
└─────────────────────────────────────────┘
```

---

## 📈 **Statistiche e Monitoring**

### Metadata Salvati per Ogni File

```javascript
{
  description: "...",
  quality: "Sufficiente|Parziale|Insufficiente",
  notes: "...",
  auditor: "Current User",
  timestamp: "2025-10-11T14:30:00Z",
  fileName: "documento.pdf",
  fileSize: 15728640,        // bytes
  fileSizeMB: "15.00",        // MB
  category: "E1",
  itemId: "E1006"
}
```

### Report Future (TODO)

- Dimensione totale evidenze per audit
- Distribuzione dimensioni file
- Top 10 file più grandi
- Suggerimenti compressione automatica

---

## 🔧 **Configurazione Tecnica**

### Costanti Sistema

```javascript
const FILE_SIZE_WARNING = 5 * 1024 * 1024; // 5MB
const FILE_SIZE_DANGER = 20 * 1024 * 1024; // 20MB
const FILE_SIZE_MAX = 50 * 1024 * 1024; // 50MB (hard limit)
```

### Personalizzazione

Per modificare i limiti, editare `ChecklistRefactored.js`:

```javascript
// Linea ~1020 - Warning soglia
const isLarge = f.size > 5 * 1024 * 1024; // Modifica qui

// Linea ~1650 - Limite massimo
const MAX_FILE_SIZE = 50 * 1024 * 1024; // Modifica qui
```

---

## 🎯 **Checklist Pre-Upload**

Prima di caricare un file:

- [ ] File < 5MB? → Upload diretto ✅
- [ ] File 5-20MB? → Comprimi se possibile
- [ ] File 20-50MB? → Valuta alternative (cloud/compressione)
- [ ] File > 50MB? → Cloud storage obbligatorio
- [ ] Dati sensibili? → Anonimizza o usa cloud sicuro
- [ ] Nome file descrittivo? → Es: "DVR_2024_Azienda.pdf" non "doc1.pdf"
- [ ] Formato appropriato? → PDF per documenti, JPEG/PNG per immagini

---

## 📞 **FAQ**

### Q: Perché limite 50MB?

**A**: Performance browser, storage locale, esperienza utente. File >50MB rallentano significativamente l'app.

### Q: Posso aumentare il limite?

**A**: Tecnicamente sì (modifica codice), ma sconsigliato. Meglio usare cloud storage.

### Q: File già caricati >50MB?

**A**: Caricati prima del limite restano accessibili. Nuovi upload seguono regole.

### Q: Alternative per file enormi (>100MB)?

**A**:

1. Cloud storage aziendale
2. Link nel campo descrizione
3. Riferimento a documento esterno nel campo note
4. Allegare summary/estratto invece del file completo

### Q: Compressione degrada qualità?

**A**: Compressione "smart" preserva leggibilità. Per PDF: testo sempre nitido, immagini ottimizzate.

---

## 🚀 **Roadmap Future**

### v2.0 - Compressione Automatica

- [ ] Compressione automatica lato client (browser)
- [ ] Opzione "Comprimi prima di caricare"
- [ ] Preview qualità pre-upload

### v2.1 - Cloud Integration

- [ ] Integrazione Google Drive API
- [ ] Integrazione OneDrive API
- [ ] Upload diretto da cloud picker

### v2.2 - Advanced Features

- [ ] OCR per PDF scansionati
- [ ] Estrazione automatica metadata da PDF
- [ ] Versioning documenti
- [ ] Anteprima inline (viewer integrato)

---

**Ultimo aggiornamento**: 11 ottobre 2025  
**Prossima revisione**: Dopo test utente con file reali
