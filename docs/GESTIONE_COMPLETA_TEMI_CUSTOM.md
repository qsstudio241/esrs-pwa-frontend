# 🎨 **GESTIONE COMPLETA TEMI CUSTOM**

## ✅ **RISPOSTA ALLE TUE DOMANDE**

### ❓ **Un tema custom deve essere trattato come gli altri temi obbligatori?**

**✅ SÌ, ASSOLUTAMENTE!** I temi custom hanno **parità completa** con i topic ESRS per:

#### 📊 **SCORING E POSIZIONAMENTO**

- **Inside-out Score** (1-5): Impatto dell'azienda su ambiente/società
- **Outside-in Score** (1-5): Impatto finanziario sull'azienda
- **Posizionamento matrice**: Stessi quadranti dei topic ESRS
- **Soglia materialità**: Stessa logica di classificazione

#### 💬 **COMMENTI E DESCRIZIONI**

- **Campo descrizione** completo per contestualizzare il tema
- **Note aziendali** specifiche per stakeholder e business impact
- **Tracciamento modifiche** con timestamp automatico

#### 📎 **ALLEGATI ED EVIDENZE**

- **File upload**: Documenti, policy, procedure
- **Foto evidenze**: Impianti, certificazioni, attività
- **Storage persistente**: File System API + localStorage backup
- **Gestione errori** con limiti di dimensione e formati

#### 📄 **EXPORT E REPORTING**

- **Report Word**: Inclusi nel documento con stessa formattazione ESRS
- **Export JSON**: Metadati completi per audit trail
- **Analisi materialità**: Considerati nel calcolo priorità e quadranti
- **Compliance**: Tracciabilità per audit esterni

---

### ❓ **Devo poterli eliminare? Come?**

**✅ SÌ, SOLO I TEMI CUSTOM POSSONO ESSERE ELIMINATI**

#### 🗑️ **LOGICA DI ELIMINAZIONE**

```javascript
// REGOLA: Solo topic con isCustom: true possono essere eliminati
const canDelete = topic.isCustom === true;

// Topic ESRS (obbligatori) → NON eliminabili
// Topic Custom → Eliminabili con conferma
```

#### 🛡️ **SICUREZZA ELIMINAZIONE**

- **Doppia conferma**: Dialog con nome tema per evitare errori
- **Solo custom**: Topic ESRS rimangono protetti
- **Irreversibile**: Avviso chiaro che l'azione non può essere annullata
- **Persistenza**: Rimozione immediata da localStorage

#### 🎛️ **INTERFACCIA UTENTE**

**Sezione dedicata**: "🎨 Gestione Temi Custom"

- **Visualizzazione**: Lista completa temi custom con dettagli
- **Pulsante elimina**: "🗑️ Elimina" per ogni tema custom
- **Controlli scoring**: Slider per Inside-out/Outside-in
- **Area descrizione**: Textarea per commenti e contesto

---

## 🎯 **FUNZIONALITÀ IMPLEMENTATE**

### **1. Gestione Completa Scoring**

```javascript
// Controlli interattivi per ogni tema custom
<input
  type="range"
  min="1"
  max="5"
  value={topic.insideOutScore}
  onChange={(e) =>
    updateTopic(topic.id, {
      insideOutScore: parseInt(e.target.value),
      impactScore: parseInt(e.target.value), // Compatibilità
    })
  }
/>
```

### **2. Eliminazione Sicura**

```javascript
// Conferma prima dell'eliminazione
if (
  window.confirm(
    `Eliminare il tema custom "${topic.name}"?\n\nQuesta azione non può essere annullata.`
  )
) {
  removeTopic(topic.id); // Solo se isCustom: true
}
```

### **3. Descrizioni e Note**

```javascript
// Area dedicata per commenti
<textarea
  value={topic.description || ""}
  onChange={(e) => updateTopic(topic.id, { description: e.target.value })}
  placeholder="Aggiungi descrizione, contesto aziendale, stakeholder coinvolti..."
/>
```

### **4. Integrazione Evidenze**

I temi custom supportano **automaticamente** il sistema evidenze:

- **File upload**: Via useEvidenceManager hook
- **Gestione gallery**: Foto e documenti associati al tema
- **Persistenza**: Storage robusto con backup

---

## 📊 **CONFRONTO FUNZIONALITÀ**

| Funzionalità               | Topic ESRS | Temi Custom | Note                            |
| -------------------------- | ---------- | ----------- | ------------------------------- |
| **Inside-out Score**       | ✅         | ✅          | Stessa scala 1-5                |
| **Outside-in Score**       | ✅         | ✅          | Stessa scala 1-5                |
| **Posizionamento Matrice** | ✅         | ✅          | Stessi quadranti                |
| **Descrizione/Note**       | ✅         | ✅          | Campo testo completo            |
| **File Allegati**          | ✅         | ✅          | Sistema evidenze integrato      |
| **Export Word**            | ✅         | ✅          | Stessa formattazione            |
| **Analisi Materialità**    | ✅         | ✅          | Inclusi in calcoli              |
| **Modifica Nome**          | ❌         | ✅          | ESRS hanno nomi standard        |
| **Eliminazione**           | ❌         | ✅          | Solo custom eliminabili         |
| **Compliance CSRD**        | 🔒         | 🟡          | ESRS obbligatori, custom = plus |

---

## 🎛️ **COME UTILIZZARE**

### **Passo 1: Aggiungere Tema Custom**

1. Clicca **"+ Aggiungi Tema Custom"** nel tab Matrice
2. Inserisci **nome significativo** (es: "Cybersecurity", "Supply Chain Digitale")
3. Il tema appare **immediatamente** nella matrice con score default (3,3)

### **Passo 2: Configurare Scoring**

1. Vai nella sezione **"🎨 Gestione Temi Custom"** (appare se hai temi custom)
2. Usa gli **slider Inside-out/Outside-in** per definire materialità
3. Il tema si **riposiziona automaticamente** nella matrice

### **Passo 3: Aggiungere Contesto**

1. Compila il campo **"Descrizione/Note"** con:
   - Perché il tema è rilevante per la tua azienda
   - Quali stakeholder sono coinvolti
   - Collegamenti con strategy aziendale
   - Rischi e opportunità specifici

### **Passo 4: Allegare Evidenze**

1. Nel **tab Questionario**, cerca il tema custom
2. Usa i pulsanti **"📁 Aggiungi File"** / **"📷 Scatta Foto"**
3. Upload documenti di supporto (policy, certificazioni, foto)

### **Passo 5: Export e Reporting**

1. I temi custom vengono **automaticamente inclusi** in:
   - Report Word con analisi materialità
   - Export JSON per audit trail
   - Statistiche e priorità dashboard

### **Passo 6: Eliminare (se necessario)**

1. Nella sezione **"🎨 Gestione Temi Custom"**
2. Clicca **"🗑️ Elimina"** sul tema da rimuovere
3. **Conferma** l'eliminazione (irreversibile)

---

## 🏆 **BENEFICI APPROCCIO INTEGRATO**

### ✅ **COMPLIANCE + FLESSIBILITÀ**

- **Base ESRS**: Garantisci conformità normativa obbligatoria
- **Custom**: Aggiungi specificità settoriali e leadership tematiche
- **Parità trattamento**: Stessa robustezza per tutti i temi

### 📊 **QUALITÀ REPORTING**

- **Completezza**: Coverage totale materialità aziendale
- **Credibilità**: Standard + specificità = reporting premium
- **Audit-ready**: Tracciabilità completa per verifiche esterne

### 🎯 **EFFICIENZA OPERATIVA**

- **Single source of truth**: Un solo sistema per tutti i temi
- **Workflow unificato**: Stesse procedure per ESRS e custom
- **Automatismi**: Calcoli, export e analisi senza duplicazione

---

## 🚀 **CONCLUSIONE**

**I temi custom hanno PARITÀ COMPLETA con i topic ESRS:**

- ✅ Stesso scoring e posizionamento matrice
- ✅ Stesse funzionalità (descrizioni, allegati, export)
- ✅ Eliminazione sicura (solo custom, con conferma)
- ✅ Integrazione completa nel reporting aziendale

**Il sistema ora offre flessibilità totale mantenendo compliance e robustezza per una materialità aziendale completa e professionale.**

_L'interfaccia è stata aggiornata con la sezione dedicata "🎨 Gestione Temi Custom" per controllo completo di scoring, descrizioni e eliminazione._
