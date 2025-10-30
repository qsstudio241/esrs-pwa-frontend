# 🔗 Sistema Allegati con Link Ipertestuali

## 📋 Panoramica

Il sistema allegati è stato aggiornato per supportare **link ipertestuali** nei documenti Word esportati, collegando direttamente ai file salvati nella struttura directory dell'audit.

---

## 📁 Struttura Directory Aggiornata

```
📁 [Percorso Utente]/
  └── 📁 NomeAzienda/
      └── 📁 2023_ESRS_Bilancio/
          ├── 📁 Evidenze/
          │   ├── 📁 Generale/
          │   ├── 📁 E1/
          │   └── ...
          ├── 📁 Export/
          └── 📁 Report/
              ├── 📁 Allegati/  ← 🆕 NUOVA cartella
              │   ├── Cap1_Piano_Industriale.pdf
              │   ├── Cap2_Certificazioni_ISO.pdf
              │   └── Cap6_Grafico_Emissioni.png
              └── Bilancio_Sostenibilita_2023.docx
```

---

## 🔧 Componenti Modificati

### **1. LocalFsProvider.js** (Storage Layer)

#### Nuovi Metodi:

**`saveReportAttachment(file, chapterId)`**
- Salva allegato nella cartella `Report/Allegati/`
- Naming: `Cap{id}_{filename}` (es: `Cap2_Piano_Industriale.pdf`)
- Ritorna metadata con `absolutePath` (file:// URL)

**`getAbsolutePath(relativePath)`**
- Converte path relativo → file:// URL assoluto
- Compatibile Windows/Mac/Linux
- Esempio: `./Allegati/file.pdf` → `file:///C:/Users/.../2023_ESRS_Bilancio/Report/Allegati/file.pdf`

**`deleteReportAttachment(storedName)`**
- Elimina file dalla directory

#### Struttura subDirs aggiornata:
```javascript
this.subDirs = { 
    evidenze,      // Evidenze ESRS per categoria
    export,        // Export JSON
    report,        // Report generati
    allegati       // 🆕 Allegati bilancio
};
```

---

### **2. reportExport.js** (Export Word)

#### Import aggiornati:
```javascript
import { 
    ExternalHyperlink,  // 🆕 Per link ipertestuali
    TextRun             // 🆕 Per testo formattato
} from 'docx';
```

#### Logica Allegati (generateChapters):

**IMMAGINI** (come prima):
- Embedded nel documento Word
- Conversione Base64 → Buffer → ImageRun
- Didascalia sotto immagine

**FILE NON-IMMAGINE** (PDF, Excel, Word):
```javascript
// PRIMA (solo testo):
"📎 Piano_Industriale.pdf (2.4 MB)"

// ORA (link ipertestuale):
new ExternalHyperlink({
    children: [
        new TextRun({
            text: attachment.name,
            color: '0563C1',  // Blu Word standard
            underline: {}
        })
    ],
    link: attachment.absolutePath  // file:///path/to/file.pdf
})
```

---

### **3. SustainabilityReportBuilder.js** (UI Component)

#### Import storage:
```javascript
import { useStorage } from '../storage/StorageContext';
const storage = useStorage();
```

#### handleFileUpload - Strategia Ibrida:

**SE Directory disponibile** (File System API):
1. Salva file in `Report/Allegati/`
2. Ottieni `absolutePath` per link Word
3. Per immagini: aggiungi anche `data` (Base64) per preview UI

**SE Directory NON disponibile** (fallback):
1. Salva Base64 in localStorage
2. Compatibilità con testing senza directory

```javascript
if (storage.ready()) {
    // Salva in directory con link
    attachmentMetadata = await storage.saveReportAttachment(file, chapterId);
} else {
    // Fallback Base64
    attachmentMetadata = { name, type, size, data: base64 };
}
```

#### removeAttachment:
- Elimina file da directory SE presente
- Rimuove da lista allegati

---

## 🎯 Workflow Utente

### **Upload Allegato**:
```
1. Utente: Clicca "Carica Allegato" in un capitolo
2. Browser: Mostra file picker
3. App: Carica file → Storage directory (Report/Allegati/)
4. Storage: Salva con nome Cap{id}_{filename}
5. Storage: Ritorna absolutePath (file:// URL)
6. App: Mostra allegato in lista con nome originale
```

### **Export Word**:
```
1. Utente: Clicca "Export Word"
2. App: Raccoglie chapters + attachments
3. reportExport.js: Per ogni allegato:
   - Immagine → Embedded (ImageRun)
   - Altro → Link ipertestuale (ExternalHyperlink)
4. docx lib: Genera file .docx con link
5. Browser: Download Bilancio_Sostenibilita_2023.docx
```

### **Uso Word Esportato**:
```
1. Utente: Apre .docx con Microsoft Word
2. Utente: Legge capitoli del bilancio
3. Utente: Vede link blu "📎 Piano_Industriale.pdf"
4. Utente: Clicca link → File si apre direttamente
5. Sistema: Apre file dalla cartella Report/Allegati/
```

---

## 📊 Vantaggi del Sistema

| Caratteristica | Prima | Ora |
|----------------|-------|-----|
| **Immagini** | ✅ Embedded | ✅ Embedded (invariato) |
| **PDF/Excel** | ❌ Solo testo riferimento | ✅ Link ipertestuale cliccabile |
| **Dimensione Word** | ~50 KB | ~50 KB (leggero) |
| **Allegati accessibili** | ❌ No | ✅ Sì (click link) |
| **Organizzazione** | - | ✅ Cartella dedicata |
| **Portabilità** | - | ✅ Tutta cartella audit |
| **Professionalità** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

---

## 🧪 Testing

### **Test 1: Upload Allegato**
```
1. Tab Bilancio → Capitolo 2
2. Carica file "Piano_Industriale.pdf"
3. ✅ Verifica: File salvato in Report/Allegati/Cap2_Piano_Industriale.pdf
4. ✅ Verifica: Allegato visibile in lista con nome originale
```

### **Test 2: Export Word con Link**
```
1. Dopo upload, clicca "Export Word"
2. Apri file .docx
3. ✅ Verifica: Link "📎 Piano_Industriale.pdf" presente (blu, sottolineato)
4. Clicca link
5. ✅ Verifica: File PDF si apre
```

### **Test 3: Rimozione Allegato**
```
1. Clicca "🗑️" su allegato
2. Conferma rimozione
3. ✅ Verifica: File eliminato da Report/Allegati/
4. ✅ Verifica: Allegato rimosso da lista UI
```

### **Test 4: Fallback Base64**
```
1. Non collegare directory (skip File System API)
2. Carica allegato
3. ✅ Verifica: Salvataggio Base64 in localStorage
4. ✅ Verifica: Export Word funziona (con link base64 o riferimento)
```

---

## 🔍 Struttura Metadata Allegato

```javascript
{
  name: "Piano_Industriale.pdf",              // Nome originale
  storedName: "Cap2_Piano_Industriale.pdf",   // Nome salvato
  path: "./Allegati/Cap2_Piano_Industriale.pdf",           // Path relativo
  absolutePath: "file:///C:/Users/.../Report/Allegati/...", // file:// URL
  type: "application/pdf",
  size: 2457600,                              // byte
  uploadDate: "2025-10-30T10:30:00.000Z"
}
```

**Per immagini**: include anche `data: "data:image/png;base64,..."` per preview

---

## ⚠️ Note Tecniche

### **Compatibilità Browser**
- File System Access API: Chrome 86+, Edge 86+
- Fallback Base64: Tutti i browser moderni

### **Limiti File**
- Max 10 MB per allegato
- Nessun limite numero allegati

### **Path Windows vs Mac/Linux**
```javascript
// Windows
"file:///C:/Users/Name/Documents/Azienda/2023_ESRS_Bilancio/Report/Allegati/file.pdf"

// Mac/Linux
"file:///Users/Name/Documents/Azienda/2023_ESRS_Bilancio/Report/Allegati/file.pdf"
```

Helper `getAbsolutePath()` gestisce automaticamente la conversione.

---

## 🚀 Deploy Netlify

### Build:
```bash
cd frontend
npm run build
```

### Deploy:
- Build folder: `frontend/build`
- File System API funziona solo in ambiente **locale** (browser security)
- In produzione Netlify: fallback Base64 automatico

---

## 📝 Changelog

### v1.1.0 - Sistema Link Ipertestuali
- ✅ Cartella `Report/Allegati/` nella struttura audit
- ✅ Metodo `saveReportAttachment()` in LocalFsProvider
- ✅ Helper `getAbsolutePath()` per file:// URL
- ✅ `ExternalHyperlink` in reportExport.js
- ✅ Upload ibrido (directory + Base64 fallback)
- ✅ Rimozione allegati da directory

---

**Versione**: 1.1.0  
**Data**: 30 Ottobre 2025  
**Autore**: AI Assistant
