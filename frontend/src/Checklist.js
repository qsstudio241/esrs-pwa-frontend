import React, { useState } from "react";
import { useStorage } from "./storage/StorageContext";
import { generateWordReport } from "./utils/wordExport";
import requisitiDimensioni from "./requisiti_dimensioni_esrs.json";
import ChecklistLoader from "./utils/checklistLoader";

const esrsDetails = {
  Generale: [
    {
      item: "Categorie di principi di rendicontazione di sostenibilità, ambiti di rendicontazione e convenzioni redazionali",
      applicability: ["Micro", "Piccola", "Media", "Grande"],
      mandatory: true,
    },
    {
      item: "Caratteristiche qualitative delle informazioni",
      applicability: ["Micro", "Piccola", "Media", "Grande"],
      mandatory: true,
    },
    {
      item: "Doppia rilevanza come base per l'informativa sulla sostenibilità",
      applicability: ["Piccola", "Media", "Grande"],
      mandatory: true,
    },
    {
      item: "Dovere di diligenza",
      applicability: ["Media", "Grande"],
      mandatory: true,
    },
    {
      item: "Catena del valore",
      applicability: ["Media", "Grande"],
      mandatory: true,
    },
    {
      item: "Orizzonti temporali",
      applicability: ["Micro", "Piccola", "Media", "Grande"],
      mandatory: true,
    },
    {
      item: "Redazione e presentazione delle informazioni sulla sostenibilità",
      applicability: ["Micro", "Piccola", "Media", "Grande"],
      mandatory: true,
    },
    {
      item: "Struttura della dichiarazione di sostenibilità",
      applicability: ["Micro", "Piccola", "Media", "Grande"],
      mandatory: true,
    },
    {
      item: "Collegamenti con altre parti della rendicontazione societaria e informazioni collegate",
      applicability: ["Piccola", "Media", "Grande"],
      mandatory: true,
    },
    {
      item: "Disposizioni transitorie",
      applicability: ["Micro", "Piccola", "Media", "Grande"],
      mandatory: true,
    },
  ],
  S4: [
    {
      item: "Consumatori e utilizzatori finali",
      applicability: ["Media", "Grande"],
      mandatory: true,
    },
    {
      item: "Politiche per la gestione degli impatti materiali, rischi e opportunità legati ai consumatori e agli utilizzatori finali",
      applicability: ["Media", "Grande"],
      mandatory: true,
    },
    {
      item: "Processi per l'impegno con i consumatori e gli utilizzatori finali riguardo agli impatti materiali",
      applicability: ["Media", "Grande"],
      mandatory: true,
    },
    {
      item: "Processi per rimediare agli impatti negativi materiali e canali per i consumatori e gli utilizzatori finali per esprimere preoccupazioni",
      applicability: ["Media", "Grande"],
      mandatory: true,
    },
    {
      item: "Azioni per la gestione degli impatti materiali e approcci alla mitigazione degli impatti negativi materiali per i consumatori e agli utilizzatori finali",
      applicability: ["Media", "Grande"],
      mandatory: true,
    },
    {
      item: "Obiettivi per la gestione degli impatti materiali, rischi e opportunità legati ai consumatori e agli utilizzatori finali",
      applicability: ["Media", "Grande"],
      mandatory: true,
    },
  ],
  G1: [
    {
      item: "Condotta delle imprese",
      applicability: ["Piccola", "Media", "Grande"],
      mandatory: true,
    },
    {
      item: "Politiche per la gestione degli impatti materiali, rischi e opportunità legati alla condotta delle imprese",
      applicability: ["Piccola", "Media", "Grande"],
      mandatory: true,
    },
    {
      item: "Processi per la gestione degli impatti materiali, rischi e opportunità legati alla condotta delle imprese",
      applicability: ["Piccola", "Media", "Grande"],
      mandatory: true,
    },
    {
      item: "Azioni per la gestione degli impatti materiali e approcci alla mitigazione degli impatti negativi materiali per la condotta delle imprese",
      applicability: ["Piccola", "Media", "Grande"],
      mandatory: true,
    },
    {
      item: "Obiettivi per la gestione degli impatti materiali, rischi e opportunità legati alla condotta delle imprese",
      applicability: ["Piccola", "Media", "Grande"],
      mandatory: true,
    },
    {
      item: "Cultura aziendale",
      applicability: ["Media", "Grande"],
      mandatory: true,
    },
    {
      item: "Gestione dei rapporti con i fornitori",
      applicability: ["Grande"],
      mandatory: true,
    },
    {
      item: "Formazione e sensibilizzazione su anti-corruzione e anti-bribery",
      applicability: ["Media", "Grande"],
      mandatory: true,
    },
    {
      item: "Incidenti di corruzione o bribery",
      applicability: ["Media", "Grande"],
      mandatory: true,
    },
    {
      item: "Attività di lobbying",
      applicability: ["Grande"],
      mandatory: true,
    },
    {
      item: "Pratiche di pagamento",
      applicability: ["Media", "Grande"],
      mandatory: true,
    },
  ],
};

function Checklist({ audit, onUpdate }) {
  const [filter, setFilter] = useState("");
  const [showOnlyOpen, setShowOnlyOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [auditPath, setAuditPath] = useState("");
  const { comments = {}, files = {}, completed = {}, stato } = audit;
  const storage = useStorage();
  const [auditDirReady, setAuditDirReady] = useState(false);
  const [jsonImported, setJsonImported] = useState(false);
  const [currentChecklist, setCurrentChecklist] = useState(null);
  const [checklistLoading, setChecklistLoading] = useState(true);
  const [checklistError, setChecklistError] = useState(null);

  // Funzione per filtrare gli elementi ESRS in base alla dimensione aziendale
  const getFilteredEsrsDetails = () => {
    // Se abbiamo una checklist dinamica, usala
    if (currentChecklist && currentChecklist.categories) {
      return ChecklistLoader.convertToLegacyFormat(currentChecklist);
    }

    // Fallback: usa la vecchia logica hardcodata
    if (!audit.dimensione) return esrsDetails;

    const filtered = {};

    Object.keys(esrsDetails).forEach((category) => {
      const filteredItems = esrsDetails[category].filter((itemData) => {
        // Se è una stringa (formato vecchio), include tutto
        if (typeof itemData === "string") return true;

        // Se è un oggetto con applicability, filtra per dimensione
        return itemData.applicability
          ? itemData.applicability.includes(audit.dimensione)
          : true;
      });

      if (filteredItems.length > 0) {
        filtered[category] = filteredItems;
      }
    });

    return filtered;
  };

  // Reset dello stato quando cambia l'audit
  React.useEffect(() => {
    setAuditDirReady(false);
    setAuditPath("");
    setErrorMessage("");
    storage.auditDir = null; // Reset dello storage
    storage.subDirs = null;

    // Carica lo stato import specifico per questo audit
    const importKey = `jsonImported_${audit.id}`;
    const wasImported = localStorage.getItem(importKey) === "true";
    setJsonImported(wasImported);
  }, [audit.id, storage]);

  React.useEffect(() => {
    setAuditDirReady(storage.ready());
  }, [storage]);

  React.useEffect(() => {
    const loadChecklist = async () => {
      try {
        setChecklistLoading(true);
        console.log("🔄 Caricamento checklist dinamica...");

        const checklist = await ChecklistLoader.loadChecklist("esrs-base");

        // Filtra in base alla dimensione aziendale se specificata
        const filteredChecklist = audit?.dimensione
          ? await ChecklistLoader.filterItemsByCompanySize(
              checklist,
              audit.dimensione
            )
          : checklist;

        setCurrentChecklist(filteredChecklist);
        console.log("✅ Checklist caricata:", filteredChecklist.metadata);
      } catch (error) {
        console.error("❌ Errore caricamento checklist:", error);
        setChecklistError(error.message);

        // Fallback: usa la vecchia checklist hardcodata
        console.log("🔄 Fallback a checklist hardcodata");
        setCurrentChecklist(null);
      } finally {
        setChecklistLoading(false);
      }
    };

    loadChecklist();
  }, [audit?.dimensione]); // Ricarica se cambia la dimensione aziendale

  const renderSetupGuide = () => {
    if (!auditDirReady) {
      return (
        <div
          style={{
            background: "#fff3cd",
            border: "2px solid #ffc107",
            padding: "20px",
            margin: "16px 0",
            borderRadius: "8px",
            textAlign: "center",
          }}
        >
          <h3 style={{ color: "#856404", margin: "0 0 12px 0" }}>
            🚀 Per iniziare a lavorare su questo audit
          </h3>
          <p style={{ color: "#856404", margin: "8px 0", fontSize: "16px" }}>
            <strong>Passo 1:</strong> Seleziona la cartella di lavoro
          </p>
          <button
            onClick={pickAuditDirectory}
            style={{
              background: "#0078d4",
              color: "#fff",
              border: "none",
              padding: "12px 24px",
              fontSize: "16px",
              borderRadius: "6px",
              cursor: "pointer",
              margin: "8px",
            }}
          >
            📁 Seleziona cartella audit
          </button>
          <p style={{ color: "#856404", margin: "8px 0", fontSize: "14px" }}>
            <strong>Suggerimento:</strong> Scegli una cartella con percorso
            breve (es: Desktop, Documenti)
          </p>
        </div>
      );
    }
    return null;
  };

  const renderImportGuide = () => {
    // Mostra il pulsante import se:
    // 1. File System API è supportata E cartella audit è selezionata, OPPURE
    // 2. File System API NON è supportata (modalità mobile/fallback)
    const showImport = auditDirReady || !window.showDirectoryPicker;

    if (showImport) {
      return (
        <div
          style={{
            background: "#e3f2fd",
            border: "1px solid #90caf9",
            padding: "16px",
            margin: "16px 0",
            borderRadius: "6px",
            color: "#1565c0",
            fontSize: "16px",
          }}
        >
          <p style={{ margin: "0 0 8px 0" }}>
            <b>💡 Importa dati da un file JSON precedente</b>
            {jsonImported && (
              <span style={{ color: "#28a745", marginLeft: "8px" }}>
                ✅ (Ultimo import completato)
              </span>
            )}
          </p>

          {/* Aggiungi una nota per dispositivi mobile */}
          {!window.showDirectoryPicker && (
            <div
              style={{
                fontSize: "14px",
                color: "#666",
                marginBottom: "8px",
                fontStyle: "italic",
              }}
            >
              📱 Modalità mobile: I file importati vengono salvati nella memoria
              del browser
            </div>
          )}

          <div style={{ margin: "10px 0" }}>
            <input
              type="file"
              accept=".json"
              onChange={handleImportJSON}
              style={{
                margin: "10px",
                border: "2px solid #1976d2",
                background: "#e3f2fd",
                padding: "6px",
                borderRadius: "4px",
              }}
            />
            <label
              style={{ marginLeft: 8, fontWeight: "bold", color: "#1976d2" }}
            >
              {jsonImported
                ? "Importa altro file JSON (sovrascriverà i dati attuali)"
                : "Importa file JSON per riprendere il lavoro"}
            </label>
          </div>

          {jsonImported && (
            <div
              style={{
                fontSize: "14px",
                color: "#666",
                marginTop: "8px",
                fontStyle: "italic",
              }}
            >
              ⚠️ Nota: L'importazione sovrascriverà tutti i dati attuali.
              Esporta prima se vuoi mantenere una copia del lavoro corrente.
            </div>
          )}
        </div>
      );
    }
    return null;
  };
  const renderChecklistStatus = () => {
    if (checklistLoading) {
      return (
        <div
          style={{
            background: "#e3f2fd",
            border: "1px solid #90caf9",
            padding: "16px",
            margin: "16px 0",
            borderRadius: "6px",
            color: "#1565c0",
          }}
        >
          🔄 Caricamento checklist dinamica...
        </div>
      );
    }

    if (checklistError) {
      return (
        <div
          style={{
            background: "#ffebee",
            border: "1px solid #f48fb1",
            padding: "16px",
            margin: "16px 0",
            borderRadius: "6px",
            color: "#c62828",
          }}
        >
          ❌ Errore caricamento checklist: {checklistError}
          <br />
          📋 Utilizzo checklist di fallback integrata.
        </div>
      );
    }

    if (currentChecklist) {
      return (
        <div
          style={{
            background: "#e8f5e8",
            border: "1px solid #81c784",
            padding: "16px",
            margin: "16px 0",
            borderRadius: "6px",
            color: "#2e7d32",
          }}
        >
          ✅ <strong>{currentChecklist.metadata.name}</strong> v
          {currentChecklist.metadata.version}
          <br />
          📊{" "}
          {currentChecklist.metadata.totalItemsFiltered ||
            currentChecklist.metadata.totalItems}{" "}
          elementi
          {audit?.dimensione && (
            <span>
              {" "}
              • Filtrato per: <strong>{audit.dimensione}</strong>
            </span>
          )}
          <br />
          📋 Categorie: {Object.keys(currentChecklist.categories).join(", ")}
        </div>
      );
    }

    return (
      <div
        style={{
          background: "#fff3e0",
          border: "1px solid #ffb74d",
          padding: "16px",
          margin: "16px 0",
          borderRadius: "6px",
          color: "#ef6c00",
        }}
      >
        📋 Utilizzo checklist integrata (modalità compatibilità)
      </div>
    );
  };
  const safeUpdate = (updates) => {
    try {
      const updatedAudit = { ...audit, ...updates };
      const auditString = JSON.stringify(updatedAudit);
      localStorage.setItem("audits", auditString);
      onUpdate(updatedAudit);
      setErrorMessage("");
    } catch (e) {
      if (e.name === "QuotaExceededError") {
        setErrorMessage(
          "Limite di memoria del browser superato. Esporta i dati e svuota la cache o usa un backend."
        );
      } else {
        setErrorMessage("Errore durante il salvataggio: " + e.message);
      }
    }
  };

  const handleCommentChange = (category, item, value) => {
    const key = `${category}-${item}`;
    safeUpdate({
      comments: { ...comments, [key]: value },
    });
  };

  const handleFileUploadFS = async (key, event) => {
    if (!storage.ready()) {
      alert("Seleziona prima la cartella audit");
      return;
    }
    const list = [...(files[key] ?? [])];
    const category = key.split("-")[0];
    for (const file of event.target.files) {
      if (list.length >= 5) {
        alert("Limite 5 file per item");
        break;
      }
      try {
        const meta = await storage.saveEvidence(key, file, category);
        list.push({ name: meta.name, type: meta.type, path: meta.path });
      } catch (err) {
        setErrorMessage("Errore salvataggio evidenza: " + err.message);
        alert("Errore salvataggio evidenza: " + err.message);
      }
    }
    safeUpdate({ files: { ...files, [key]: list } });
  };

  const removeFile = async (key, index) => {
    const currentFiles = files[key] || [];
    const file = currentFiles[index];
    if (file && file.path) {
      try {
        await navigator.clipboard.writeText(file.path);
        alert(
          `✅ Percorso copiato negli appunti:\n${file.path}\n\n💡 Ora puoi navigare manualmente alla cartella per eliminare fisicamente il file se necessario.`
        );
      } catch (err) {
        alert(
          `⚠️ Impossibile copiare il percorso negli appunti.\n\nPercorso file: ${file.path}`
        );
      }
    }
    // Rimuovi il riferimento dal report
    const newFileArray = currentFiles.filter((_, i) => i !== index);
    safeUpdate({
      files: { ...files, [key]: newFileArray },
    });
  };

  const handleCompletedChange = (category, item) => {
    const key = `${category}-${item}`;
    safeUpdate({
      completed: { ...completed, [key]: !completed[key] },
    });
  };

  // Funzione per gestire selezione file con fallback automatico
  const handleFileSelect = (category, itemIndex, source) => {
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = true;

    if (source === "camera") {
      // Configurazione ottimizzata per fotocamera mobile
      input.accept = "image/*";
      input.capture = "environment"; // Fotocamera posteriore
      // Forza una sola immagine per volta per evitare problemi di memoria
      input.multiple = false;
    } else {
      // Configurazione per galleria/file
      input.accept = "image/*,application/pdf,.doc,.docx,.xls,.xlsx";
    }

    input.onchange = (e) => handleFileUploadOptimized(category, itemIndex, e);
    input.click();
  };

  // Funzione di compressione aggressiva per dispositivi con poca memoria
  const compressImageAggressive = (file, maxWidth = 800, quality = 0.6) => {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith("image/")) {
        resolve(file);
        return;
      }

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();

      img.onload = () => {
        try {
          // Ridimensionamento più aggressivo per tablet con poca memoria
          const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
          canvas.width = Math.floor(img.width * ratio);
          canvas.height = Math.floor(img.height * ratio);

          // Disegna l'immagine ridimensionata
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          // Converti con qualità ridotta
          canvas.toBlob(
            (blob) => {
              if (blob) {
                console.log(
                  `Immagine compressa: ${(file.size / 1024 / 1024).toFixed(
                    1
                  )}MB → ${(blob.size / 1024 / 1024).toFixed(1)}MB`
                );
                resolve(new File([blob], file.name, { type: "image/jpeg" }));
              } else {
                reject(new Error("Errore durante la compressione"));
              }
            },
            "image/jpeg",
            quality
          );
        } catch (error) {
          console.error("Errore compressione:", error);
          reject(error);
        }
      };

      img.onerror = () => reject(new Error("Errore caricamento immagine"));
      img.src = URL.createObjectURL(file);
    });
  };

  // Funzione di upload ottimizzata per dispositivi con limitazioni
  const handleFileUploadOptimized = async (category, itemIndex, event) => {
    const fileList = Array.from(event.target.files);
    if (fileList.length === 0) return;

    // Crea la chiave per questo item
    const itemData = filteredEsrsDetails[category][itemIndex];
    const item = typeof itemData === "string" ? itemData : itemData.item;
    const key = `${category}-${item}`;

    try {
      // LOGICA INTELLIGENTE: Prova prima File System API, poi fallback automatico
      if (window.showDirectoryPicker && storage.ready()) {
        console.log("Usando File System API (modalità desktop)");
        await handleFileUploadFS(key, event);
      } else {
        console.log("Usando localStorage fallback (modalità mobile)");
        await handleFileUploadFallback(key, fileList);
      }
    } catch (error) {
      console.error("Errore upload File System API:", error);
      // Fallback automatico a localStorage in caso di errore
      console.log("Fallback automatico a localStorage");
      await handleFileUploadFallback(key, fileList);
    }
  };

  // Funzione fallback per dispositivi che non supportano File System Access API
  const handleFileUploadFallback = async (key, fileList) => {
    const currentFiles = files[key] || [];
    const newFileArray = [...currentFiles];

    for (const file of fileList) {
      if (newFileArray.length >= 5) {
        alert("Limite 5 file per item");
        break;
      }

      try {
        // Comprimi aggressivamente per evitare problemi di memoria
        const processedFile = await compressImageAggressive(file);

        // Verifica dimensione dopo compressione
        if (processedFile.size > 2 * 1024 * 1024) {
          // 2MB max
          throw new Error("File troppo grande anche dopo compressione");
        }

        // Converti in base64 per localStorage
        const base64Data = await fileToBase64(processedFile);

        newFileArray.push({
          name: processedFile.name,
          type: processedFile.type,
          data: base64Data,
          size: processedFile.size,
          compressed: true,
          timestamp: new Date().toISOString(),
        });

        console.log(
          `File caricato in localStorage: ${processedFile.name} (${(
            processedFile.size / 1024
          ).toFixed(1)}KB)`
        );
      } catch (error) {
        console.error(`Errore elaborazione file ${file.name}:`, error);
        alert(`Errore elaborazione ${file.name}: ${error.message}`);
      }
    }

    // Salva in localStorage
    safeUpdate({
      files: { ...files, [key]: newFileArray },
    });
  };

  // Utility per convertire file in base64
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const exportSelections = () => {
    const selections = Object.keys(comments)
      .filter((key) => {
        const comment = comments[key] || "";
        return comment.trim().length > 0;
      })
      .map((key) => {
        const [category, item] = key.split("-");
        return {
          category,
          item,
          comment: comments[key] || "",
          files: files[key] || [],
          terminato: !!completed[key],
        };
      });

    // Nome file più descrittivo con azienda
    const now = new Date();
    const timestamp = now.toISOString().replace(/[:.]/g, "").slice(0, 15);
    const aziendaClean = (audit.azienda || "Azienda")
      .replace(/[^a-zA-Z0-9]/g, "_") // Rimuove caratteri speciali
      .substring(0, 20); // Limita lunghezza

    const fileName = `${aziendaClean}_export_${timestamp}.json`;

    const dataStr = JSON.stringify(
      {
        azienda: audit.azienda,
        dimensione: audit.dimensione,
        dataAvvio: audit.dataAvvio,
        stato: audit.stato,
        selections,
      },
      null,
      2
    );

    // Prova a usare File System Access API per permettere scelta cartella anche su mobile
    if (window.showSaveFilePicker) {
      // Modalità moderna: permette all'utente di scegliere dove salvare
      handleSaveFileModern(fileName, dataStr);
    } else {
      // Fallback: download automatico per browser non supportati
      handleSaveFileFallback(fileName, dataStr);
    }

    safeUpdate({
      exportHistory: [
        ...(audit.exportHistory || []),
        { fileName, dataExport: new Date().toISOString() },
      ],
    });
  };

  // Funzione per salvare file con File System Access API (scelta cartella)
  const handleSaveFileModern = async (fileName, dataStr) => {
    try {
      const fileHandle = await window.showSaveFilePicker({
        suggestedName: fileName,
        types: [
          {
            description: "File JSON",
            accept: {
              "application/json": [".json"],
            },
          },
        ],
      });

      const writable = await fileHandle.createWritable();
      await writable.write(dataStr);
      await writable.close();

      alert(
        `✅ File salvato con successo: ${fileName}\n\n💡 Il file è stato salvato nella cartella che hai scelto.`
      );
    } catch (error) {
      if (error.name === "AbortError") {
        console.log("Salvataggio annullato dall'utente");
        return;
      }
      console.error("Errore salvamento moderno:", error);
      // Fallback automatico
      handleSaveFileFallback(fileName, dataStr);
    }
  };

  // Funzione fallback per browser che non supportano File System Access API
  const handleSaveFileFallback = (fileName, dataStr) => {
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
    window.URL.revokeObjectURL(url);

    alert(
      `📁 File scaricato: ${fileName}\n\n💡 Controlla la cartella Download del browser.`
    );
  };

  const checkBrowserSupport = () => {
    if (!window.showDirectoryPicker) {
      return (
        <div
          style={{
            background: "#FFF3CD",
            border: "1px solid #FFEAA7",
            padding: "15px",
            margin: "10px 0",
            borderRadius: "5px",
            color: "#856404",
          }}
        >
          <strong>⚠️ Funzionalità limitata:</strong> Il tuo browser non supporta
          la selezione cartelle.
          <br />
          Usa <strong>Chrome</strong> o <strong>Microsoft Edge</strong>{" "}
          (versione recente) per salvare file in cartelle specifiche.
          <br />
          Puoi comunque usare "Esporta come JSON" per scaricare i dati.
        </div>
      );
    }
    return null;
  };

  const exportSelectionsFS = async () => {
    if (!storage.ready()) {
      alert("Seleziona la cartella audit");
      return;
    }
    // Controllo permessi e stato audit
    try {
      await storage.ensurePermission("readwrite");
    } catch (e) {
      alert(
        "Permessi non concessi o cartella audit non valida. Premi il pulsante 'Seleziona cartella audit...' per collegare la cartella prima di esportare."
      );
      return;
    }
    // La creazione della cartella "Evidenze" è già gestita da LocalFsProvider
    const selections = Object.keys(comments)
      .filter((key) => {
        const comment = comments[key] || "";
        return comment.trim().length > 0;
      })
      .map((key) => {
        const [category, item] = key.split("-");
        return {
          category,
          item,
          comment: comments[key] || "Nessun commento",
          files: files[key] || [],
          terminato: !!completed[key],
        };
      });
    const payload = {
      meta: {
        azienda: audit.azienda,
        id: audit.id,
        dimensione: audit.dimensione,
        dataAvvio: audit.dataAvvio,
        stato: audit.stato,
        esrsVersion: "ESRS 2024-12",
        exportedAt: new Date().toISOString(),
      },
      selections,
    };
    const { fileName } = await storage.saveExport(payload);
    safeUpdate({
      exportHistory: [
        ...(audit.exportHistory ?? []),
        { fileName, dataExport: new Date().toISOString() },
      ],
    });
    alert(`Export salvato: ${fileName}`);
  };

  const handleImportJSON = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const importedData = JSON.parse(e.target.result);
        const importedSelections = importedData.selections ?? [];
        const newComments = {};
        const newFiles = {};
        const newCompleted = {};

        for (const s of importedSelections) {
          const key = `${s.category}-${s.item}`;
          newComments[key] = s.comment;
          newCompleted[key] = s.terminato;
          // Importa i file così come sono, senza controlli di accessibilità
          newFiles[key] = s.files ?? [];
        }

        safeUpdate({
          comments: newComments,
          files: newFiles,
          completed: newCompleted,
        });

        setJsonImported(true);
        // Salva lo stato import per questo audit specifico
        const importKey = `jsonImported_${audit.id}`;
        localStorage.setItem(importKey, "true");

        alert("Dati importati con successo!");
      } catch (error) {
        alert("Errore durante l'importazione del file JSON: " + error.message);
      }
    };

    reader.readAsText(file);
  };
  // rimuovo la chiamata diretta a setJsonImported dal corpo del componente
  const handleCloseAudit = () => {
    if (window.confirm("Vuoi chiudere definitivamente questo audit?")) {
      safeUpdate({ stato: "chiuso" });
    }
  };

  const pickAuditDirectory = async () => {
    try {
      console.log("Inizio selezione cartella audit...");

      await storage.initAuditTree({ id: audit.id });
      setAuditDirReady(storage.ready());
      setAuditPath(`A-${audit.id}`); // Aggiorna il path
      alert(
        "✅ Cartella audit collegata con successo!\n\nStruttura creata:\n- ESG-Bilanci/\n  - " +
          new Date().getFullYear() +
          "/\n    - A-" +
          audit.id +
          "/\n      - Evidenze/\n      - Export/\n      - Report/"
      );
    } catch (err) {
      console.error("Errore completo:", err);

      let errorMessage = "Errore sconosciuto nella selezione cartella.";

      if (
        err.message.includes("not supported") ||
        err.message.includes("showDirectoryPicker")
      ) {
        errorMessage =
          '❌ Browser non compatibile\n\nUsa Chrome o Microsoft Edge (versione recente) per questa funzionalità.\n\nPuoi comunque usare "Esporta come JSON" per scaricare i dati.';
      } else if (
        err.message.includes("annullata") ||
        err.name === "AbortError"
      ) {
        errorMessage =
          "⚠️ Selezione annullata\n\nRiprova quando sei pronto a selezionare la cartella.";
      } else if (
        err.message.includes("permessi") ||
        err.name === "NotAllowedError"
      ) {
        errorMessage =
          "🔒 Permessi negati\n\nConcedi i permessi per accedere al file system quando richiesto dal browser.";
      } else {
        errorMessage = `❌ Errore: ${err.message}\n\nSuggerimenti:\n1. Usa Chrome/Edge aggiornato\n2. Concedi i permessi quando richiesto\n3. Seleziona una cartella accessibile (es. Desktop, Documenti)`;
      }

      alert(errorMessage);
    }
  };

  const generateReport = () => {
    // ...existing code...
    // TODO: Implement report generation logic here if needed
  };

  const filteredEsrsDetails = getFilteredEsrsDetails();

  const filteredCategories = Object.keys(filteredEsrsDetails).filter(
    (category) =>
      category.toLowerCase().includes(filter.toLowerCase()) ||
      filteredEsrsDetails[category].some((item) => {
        const itemText = typeof item === "string" ? item : item.item;
        return itemText.toLowerCase().includes(filter.toLowerCase());
      })
  );

  return (
    <div>
      {renderSetupGuide()}
      {renderImportGuide()}
      {renderChecklistStatus()}
      <div style={{ marginBottom: "12px" }}>
        <b>Stato cartella audit:</b>{" "}
        {auditDirReady && auditPath ? (
          <span style={{ color: "green" }}>{auditPath}</span>
        ) : (
          <span style={{ color: "red" }}>Non selezionata</span>
        )}
        <br />
        <b>Stato import JSON:</b>{" "}
        {jsonImported ? (
          <span style={{ color: "green" }}>Importato</span>
        ) : (
          <span style={{ color: "orange" }}>Non importato</span>
        )}
        {errorMessage && (
          <div style={{ color: "red", marginTop: "8px" }}>{errorMessage}</div>
        )}
      </div>
      <h2>
        Checklist ESG – {audit.azienda} ({audit.dimensione})
      </h2>
      {audit.dimensione && (
        <div
          style={{
            background: "#e3f2fd",
            border: "1px solid #1976d2",
            borderRadius: "6px",
            padding: "12px",
            margin: "10px 0",
            fontSize: "14px",
          }}
        >
          <h4 style={{ margin: "0 0 8px 0", color: "#1976d2" }}>
            📋 Requisiti ESRS per azienda di dimensione: {audit.dimensione}
          </h4>

          {(() => {
            const dimensioneMap = {
              Micro: "micro",
              Piccola: "piccola",
              Media: "media",
              Grande: "grande",
            };

            const dimensioneKey = dimensioneMap[audit.dimensione];
            const info =
              requisitiDimensioni.dimensioni_aziendali[dimensioneKey];

            if (!info) return null;

            return (
              <div>
                <div>
                  <strong>Elementi mostrati:</strong>{" "}
                  {Object.values(filteredEsrsDetails).reduce(
                    (total, items) => total + items.length,
                    0
                  )}{" "}
                  /{" "}
                  {Object.values(esrsDetails).reduce(
                    (total, items) => total + items.length,
                    0
                  )}{" "}
                  totali
                </div>

                <div style={{ marginTop: "8px" }}>
                  <strong>Tempistiche:</strong>
                  <ul style={{ margin: "4px 0 0 20px", padding: 0 }}>
                    <li>
                      Entrata in vigore: {info.tempistiche.entrata_vigore}
                    </li>
                    <li>
                      Prima rendicontazione:{" "}
                      {info.tempistiche.prima_rendicontazione}
                    </li>
                  </ul>
                </div>

                <div style={{ marginTop: "8px" }}>
                  <strong>Standard ESRS applicabili:</strong>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "4px",
                      marginTop: "4px",
                    }}
                  >
                    {Object.entries(info.requisiti_esrs)
                      .filter(([_, requirements]) => requirements.length > 0)
                      .map(([standard, requirements]) => (
                        <span
                          key={standard}
                          style={{
                            background: "#1976d2",
                            color: "white",
                            padding: "2px 6px",
                            borderRadius: "3px",
                            fontSize: "12px",
                          }}
                        >
                          {standard}
                        </span>
                      ))}
                  </div>
                </div>

                <div
                  style={{ marginTop: "8px", fontSize: "12px", color: "#555" }}
                >
                  <em>
                    La checklist è stata filtrata automaticamente secondo la
                    direttiva CSRD 2022/2464/UE.
                  </em>
                </div>
              </div>
            );
          })()}
        </div>
      )}
      {checkBrowserSupport()} {/* <-- AGGIUNGI QUESTA RIGA */}
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      <input
        type="text"
        placeholder="Filtra categorie o domande..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        style={{ margin: "10px", padding: "5px" }}
      />
      <label style={{ marginLeft: 12 }}>
        <input
          type="checkbox"
          checked={showOnlyOpen}
          onChange={(e) => setShowOnlyOpen(e.target.checked)}
        />
        Mostra solo punti aperti
      </label>
      <button onClick={exportSelectionsFS} style={{ margin: "10px" }}>
        Salva Export in cartella
      </button>
      <button onClick={exportSelections} style={{ margin: "10px" }}>
        Esporta come JSON
      </button>
      <button
        onClick={() =>
          generateWordReport({
            checklist: audit.checklist || {},
            azienda: audit.azienda || "Nome azienda",
            anno: new Date().getFullYear(),
          })
        }
        style={{ margin: "10px" }}
      >
        Genera Report Word
      </button>
      <button onClick={generateReport} style={{ margin: "10px" }}>
        Genera Report HTML
      </button>
      {audit.stato === "in corso" && (
        <button
          onClick={handleCloseAudit}
          style={{ margin: "10px", background: "orange" }}
        >
          Chiudi audit
        </button>
      )}
      <button
        onClick={() => {
          // Pulisce tutto il localStorage inclusi gli stati import
          localStorage.clear();
          setJsonImported(false);
          alert("localStorage svuotato!");
        }}
        style={{ margin: "10px", background: "#ff4444" }}
      >
        Svuota localStorage
      </button>
      {filteredCategories.map((category, categoryIndex) => (
        <div key={category}>
          <h3>
            {category}
            {audit.dimensione && (
              <span
                style={{ fontSize: "14px", color: "#666", marginLeft: "10px" }}
              >
                (Filtrato per: {audit.dimensione})
              </span>
            )}
          </h3>
          <ol start={categoryIndex * 10 + 1}>
            {filteredEsrsDetails[category]
              .filter((itemData) => {
                const itemText =
                  typeof itemData === "string" ? itemData : itemData.item;
                return !showOnlyOpen || !completed[`${category}-${itemText}`];
              })
              .map((itemData, itemIndex) => {
                const item =
                  typeof itemData === "string" ? itemData : itemData.item;
                const isOptional =
                  typeof itemData === "object" && !itemData.mandatory;
                const key = `${category}-${item}`;
                return (
                  <li key={item} value={itemIndex + 1}>
                    <span
                      style={
                        isOptional ? { fontStyle: "italic", color: "#666" } : {}
                      }
                    >
                      {item}
                      {isOptional && " (Opzionale)"}
                    </span>
                    <textarea
                      placeholder="Aggiungi evidenze..."
                      value={comments[key] || ""}
                      onChange={(e) =>
                        handleCommentChange(category, item, e.target.value)
                      }
                      style={{
                        display: "block",
                        margin: "5px 0",
                        width: "300px",
                      }}
                      disabled={stato === "chiuso"}
                    />
                    <div
                      style={{
                        display: "flex",
                        gap: "8px",
                        flexWrap: "wrap",
                        margin: "8px 0",
                      }}
                    >
                      <button
                        onClick={() =>
                          handleFileSelect(category, itemIndex, "gallery")
                        }
                        style={{
                          padding: "8px 12px",
                          backgroundColor: "#007bff",
                          color: "white",
                          border: "none",
                          borderRadius: "6px",
                          cursor: "pointer",
                          fontSize: "14px",
                          minHeight: "40px",
                        }}
                        disabled={stato === "chiuso"}
                      >
                        📁 Galleria
                      </button>

                      <button
                        onClick={() =>
                          handleFileSelect(category, itemIndex, "camera")
                        }
                        style={{
                          padding: "8px 12px",
                          backgroundColor: "#28a745",
                          color: "white",
                          border: "none",
                          borderRadius: "6px",
                          cursor: "pointer",
                          fontSize: "14px",
                          minHeight: "40px",
                        }}
                        disabled={stato === "chiuso"}
                      >
                        📷 Foto
                      </button>
                    </div>{" "}
                    {(files[key] || []).map((file, index) => (
                      <div key={index}>
                        {file.path ? (
                          <>
                            <button
                              type="button"
                              onClick={() =>
                                alert(
                                  `File salvato in ${file.path}. Apri la cartella audit per visualizzarlo.`
                                )
                              }
                              style={{
                                background: "none",
                                border: "none",
                                color: "#007bff",
                                textDecoration: "underline",
                                cursor: "pointer",
                                padding: 0,
                              }}
                            >
                              {file.name}
                            </button>
                            <div style={{ fontSize: "12px", color: "#555" }}>
                              Percorso:{" "}
                              <span style={{ userSelect: "all" }}>
                                {file.path}
                              </span>
                            </div>
                          </>
                        ) : file.type && file.type.startsWith("image/") ? (
                          <img
                            src={file.data}
                            alt={file.name}
                            style={{ maxWidth: "200px", margin: "5px" }}
                          />
                        ) : (
                          <a href={file.data} download={file.name}>
                            {file.name}
                          </a>
                        )}
                        <button
                          onClick={() => removeFile(key, index)}
                          disabled={stato === "chiuso"}
                        >
                          Rimuovi
                        </button>
                      </div>
                    ))}
                    <label style={{ marginLeft: 8 }}>
                      <input
                        type="checkbox"
                        checked={!!completed[key]}
                        onChange={() => handleCompletedChange(category, item)}
                        disabled={stato === "chiuso"}
                      />{" "}
                      Terminato
                    </label>
                  </li>
                );
              })}
          </ol>
        </div>
      ))}
      <div style={{ marginTop: 24 }}>
        <b>Export precedenti:</b>
        <ul>
          {(audit.exportHistory || []).map((e) => (
            <li key={e.fileName}>
              {e.fileName} ({e.dataExport})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Checklist;
