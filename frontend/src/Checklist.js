import React, { useState } from "react";
import { useStorage } from "./storage/StorageContext";
import { generateWordReport } from "./utils/wordExport";
import requisitiDimensioni from "./requisiti_dimensioni_esrs.json";
import ChecklistLoader from "./utils/checklistLoader";
// import { generaExportJSON } from "./utils/auditBusinessLogic"; // legacy
import { buildSnapshot, buildExportFileName } from "./utils/exporters";
import {
  createProfiler,
  appendPerformanceLog,
} from "./utils/performanceProfiler";
import { useEvidenceManager } from "./hooks/useEvidenceManager";

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
  // clientName rimosso - ora usiamo audit.azienda direttamente

  const handleDirectorySelect = async (isNewAudit = null) => {
    if (!audit) return;

    try {
      setChecklistLoading(true);
      console.log(`🎯 Configurazione directory per: ${audit.azienda}`);

      console.log(`� Creazione struttura directory per: ${audit.azienda}`);
      console.log(`🔍 DEBUG INITIAL STATE:`, {
        auditDirReady,
        storageReady: storage.ready(),
        storageAuditDir: !!storage.auditDir,
        storageSubDirs: !!storage.subDirs,
      });

      // Determina il tipo di audit se non specificato
      if (isNewAudit === null) {
        // Auto-detect basato su stato precedente
        const auditKey = `auditDir_${audit.id}`;
        const savedState = localStorage.getItem(auditKey);
        isNewAudit = !savedState || !JSON.parse(savedState || "{}").configured;
      }

      let result;
      if (isNewAudit) {
        console.log("🆕 Inizializzazione nuovo audit per:", audit.azienda);
        result = await storage.initNewAuditTree(audit.azienda);
      } else {
        console.log("📂 Ripresa audit esistente per:", audit.azienda);
        result = await storage.resumeExistingAudit(audit.azienda);
      }

      console.log(`🔍 DEBUG AFTER STORAGE CALL:`, {
        result,
        storageReady: storage.ready(),
        storageAuditDir: !!storage.auditDir,
        storageSubDirs: !!storage.subDirs,
        auditDirType: storage.auditDir?.constructor?.name,
      });

      const auditWithDir = { ...audit, directoryHandle: storage.auditDir };
      onUpdate(auditWithDir);

      // Aggiorna lo stato della directory con il percorso corretto
      const isReady = storage.ready();
      setAuditDirReady(isReady);
      setAuditPath(
        result?.structure ||
          `${audit.azienda}/${new Date().getFullYear()}_ESRS_Bilancio`
      );

      console.log(`🔍 DEBUG FINAL STATE:`, {
        isReady,
        auditDirReadyAfterSet: isReady,
        auditPath: result?.structure,
        storageAuditDir: !!storage.auditDir,
        storageSubDirs: !!storage.subDirs,
      });

      setChecklistError(null);
      console.log(
        `✅ Directory configurata con successo per: ${audit.azienda}`,
        result
      );
    } catch (error) {
      console.error("❌ Errore configurazione directory:", error);
      setChecklistError(`Errore nella configurazione: ${error.message}`);
    } finally {
      setChecklistLoading(false);
    }
  };

  // Funzione per distinguere manualmente nuovo audit vs ripresa
  const handleNewAuditDirectory = () => handleDirectorySelect(true);
  const handleResumeAuditDirectory = () => handleDirectorySelect(false);

  // Funzione per filtrare gli elementi ESRS in base alla dimensione aziendale
  const getFilteredEsrsDetails = () => {
    console.log("🔍 getFilteredEsrsDetails chiamata:", {
      hasCurrentChecklist: !!currentChecklist,
      hasCategories: currentChecklist?.categories
        ? Object.keys(currentChecklist.categories)
        : "N/A",
      auditDimensione: audit.dimensione,
      checklistLoading,
      checklistError,
    });

    // Se abbiamo una checklist dinamica, usala
    if (currentChecklist && currentChecklist.categories) {
      console.log("✅ Uso checklist dinamica");
      const result = ChecklistLoader.convertToLegacyFormat(currentChecklist);
      console.log("📋 Categorie checklist dinamica:", Object.keys(result));
      return result;
    }

    console.log("⚠️ Fallback a checklist hardcodata");
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
    // NON resettare storage.auditDir e storage.subDirs qui!

    // Carica lo stato import specifico per questo audit
    const importKey = `jsonImported_${audit.id}`;
    const wasImported = localStorage.getItem(importKey) === "true";
    setJsonImported(wasImported);

    // Carica lo stato della cartella audit se precedentemente configurata
    const auditKey = `auditDir_${audit.id}`;
    const savedAuditDir = localStorage.getItem(auditKey);
    if (savedAuditDir) {
      try {
        const auditConfig = JSON.parse(savedAuditDir);
        if (auditConfig.configured) {
          console.log("📁 Stato cartella audit trovato:", auditConfig);
          // Non possiamo ripristinare automaticamente l'handle, ma mostriamo che era configurata
          setAuditPath(auditConfig.structure);
          // Nota: auditDirReady rimane false fino a quando non si riseleziona la cartella
        }
      } catch (error) {
        console.error("Errore lettura stato cartella audit:", error);
      }
    }
  }, [audit.id, storage]);

  React.useEffect(() => {
    const readyState = storage.ready();
    console.log(`🔍 DEBUG useEffect READY CHECK:`, {
      readyState,
      storageAuditDir: !!storage.auditDir,
      storageSubDirs: !!storage.subDirs,
    });
    setAuditDirReady(readyState);
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
        <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
          <div
            style={{
              border: "2px solid #007bff",
              borderRadius: "8px",
              padding: "20px",
              backgroundColor: "#f8f9fa",
            }}
          >
            <h3 style={{ color: "#007bff", marginBottom: "15px" }}>
              🏢 Audit ESRS per: {audit.azienda}
            </h3>

            <div style={{ marginBottom: "20px", textAlign: "center" }}>
              <div
                style={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  color: "#007bff",
                  marginBottom: "10px",
                }}
              >
                📋 {audit.azienda} - {audit.dimensione}
              </div>
              <div style={{ fontSize: "14px", color: "#666" }}>
                Clicca per configurare la struttura directory
              </div>
            </div>

            {/* Determina se mostrare opzioni per nuovo o ripresa */}
            {(() => {
              const hasData =
                Object.keys(comments).length > 0 ||
                Object.keys(files).length > 0 ||
                Object.keys(completed).length > 0 ||
                jsonImported;

              if (hasData) {
                // Ripresa audit esistente
                return (
                  <div>
                    <button
                      onClick={handleResumeAuditDirectory}
                      style={{
                        backgroundColor: "#28a745",
                        color: "white",
                        border: "none",
                        padding: "12px 24px",
                        borderRadius: "4px",
                        fontSize: "16px",
                        cursor: "pointer",
                        width: "100%",
                        marginBottom: "8px",
                      }}
                    >
                      🔄 Riprendi Audit - Seleziona Cartella Azienda
                    </button>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#666",
                        textAlign: "center",
                      }}
                    >
                      Seleziona la cartella che contiene già la struttura "
                      {audit.azienda}"
                    </div>
                    <button
                      onClick={handleNewAuditDirectory}
                      style={{
                        backgroundColor: "#6c757d",
                        color: "white",
                        border: "none",
                        padding: "8px 16px",
                        borderRadius: "4px",
                        fontSize: "14px",
                        cursor: "pointer",
                        width: "100%",
                        marginTop: "8px",
                      }}
                    >
                      🆕 O crea nuova struttura
                    </button>
                  </div>
                );
              } else {
                // Nuovo audit
                return (
                  <div>
                    <button
                      onClick={handleNewAuditDirectory}
                      style={{
                        backgroundColor: "#007bff",
                        color: "white",
                        border: "none",
                        padding: "12px 24px",
                        borderRadius: "4px",
                        fontSize: "16px",
                        cursor: "pointer",
                        width: "100%",
                        marginBottom: "8px",
                      }}
                    >
                      🆕 Nuovo Audit - Seleziona Cartella Padre
                    </button>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#666",
                        textAlign: "center",
                      }}
                    >
                      Seleziona dove creare la nuova struttura "{audit.azienda}
                      /2025_ESRS_Bilancio"
                    </div>
                    <button
                      onClick={handleResumeAuditDirectory}
                      style={{
                        backgroundColor: "#6c757d",
                        color: "white",
                        border: "none",
                        padding: "8px 16px",
                        borderRadius: "4px",
                        fontSize: "14px",
                        cursor: "pointer",
                        width: "100%",
                        marginTop: "8px",
                      }}
                    >
                      🔄 O riprendi audit esistente
                    </button>
                  </div>
                );
              }
            })()}

            <div
              style={{
                marginTop: "15px",
                fontSize: "14px",
                color: "#666",
                backgroundColor: "#e9f7ff",
                padding: "10px",
                borderRadius: "4px",
              }}
            >
              💡 <strong>Struttura che verrà creata:</strong>
              <br />
              📁 {audit.azienda}/2025_ESRS_Bilancio/
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;├── 📁 Evidenze (E1,E2,S1,S4,G1,Generale)
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;├── 📁 Export
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;└── 📁 Report
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const renderImportGuide = () => {
    // Mostra sempre il pulsante import per supportare il workflow multi-dispositivo
    // L'utente può importare un JSON da un altro dispositivo per riprendere il lavoro
    const showImport = true;

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

  // handleFileUploadFS & removeFile legacy rimossi (ora gestiti da useEvidenceManager)

  const evidence = useEvidenceManager(audit, (patch) => safeUpdate(patch));

  const handleCompletedChange = (category, item) => {
    const key = `${category}-${item}`;
    safeUpdate({
      completed: { ...completed, [key]: !completed[key] },
    });
  };

  // Funzione per gestire selezione file con fallback automatico
  const handleFileSelect = (category, itemLabel, source) => {
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = true;
    input.style.position = "fixed";
    input.style.left = "-9999px";

    if (source === "camera") {
      input.accept = "image/*";
      input.capture = "environment";
      input.multiple = false;
    } else {
      input.accept = "*/*";
    }

    const onChange = async () => {
      try {
        const fileList = Array.from(input.files || []);
        if (fileList.length) {
          await handleFileUploadOptimized(category, itemLabel, { target: { files: fileList } });
        }
      } finally {
        // rimuovi l'input per evitare leak e garantire nuovo change anche con stessi file
        if (input.parentNode) input.parentNode.removeChild(input);
      }
    };
    input.addEventListener("change", onChange, { once: true });
    document.body.appendChild(input);
    input.click();
  };

  // compressImageAggressive ora fornita dal hook evidence (se necessaria internamente)

  // Funzione di upload ottimizzata per dispositivi con limitazioni
  const handleFileUploadOptimized = async (category, itemLabel, event) => {
    const fileList = Array.from(event.target.files);
    if (!fileList.length) return;
    await evidence.addFiles({ category, itemLabel, fileList });
  };

  // Funzione fallback per dispositivi che non supportano File System Access API
  // handleFileUploadFallback sostituito dal hook evidence

  // Utility per convertire file in base64
  // fileToBase64 gestito dal hook evidence

  const exportSelections = () => {
    try {
      const profiler = createProfiler({
        enabled: true,
        persist: (rec) => safeUpdate(appendPerformanceLog(audit, rec)),
      });
      profiler.start("export_json", {
        items: Object.keys(audit.comments || {}).length,
      });
      const snapshot = buildSnapshot(audit);
      const fileName = buildExportFileName(audit, "json");
      const dataStr = JSON.stringify(snapshot, null, 2);
      if (window.showSaveFilePicker) {
        handleSaveFileModern(fileName, dataStr);
      } else {
        handleSaveFileFallback(fileName, dataStr);
      }
      safeUpdate({
        exportHistory: [
          ...(audit.exportHistory || []),
          {
            fileName,
            dataExport: new Date().toISOString(),
            schemaVersion: snapshot?.meta?.schemaVersion,
          },
        ],
      });
      profiler.end("export_json", { bytes: dataStr.length });
    } catch (e) {
      alert("Errore export: " + e.message);
      console.error("Errore export layer", e);
    }
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

  const generateReport = () => {
    // Estrai i dati principali
    const selections = Object.keys(comments)
      .filter((key) => {
        const comment = comments[key] || "";
        return (
          comment.trim().length > 0 || (files[key] && files[key].length > 0)
        );
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

    // Genera HTML
    let html = `<!DOCTYPE html><html lang='it'><head><meta charset='UTF-8'><title>Report ESG - ${audit.azienda}</title><style>
      body { font-family: Arial, sans-serif; margin: 32px; }
      h1 { color: #1976d2; }
      h2 { color: #1565c0; }
      .completed { color: green; font-weight: bold; }
      .open { color: orange; font-weight: bold; }
      .comment { margin: 8px 0; }
      .file-list { margin: 8px 0; }
      .category { margin-top: 24px; }
    </style></head><body>`;
    html += `<h1>Report ESG - ${audit.azienda}</h1>`;
    html += `<div><b>Dimensione:</b> ${
      audit.dimensione || "N/A"
    } <br/><b>Data avvio:</b> ${audit.dataAvvio || "N/A"} <br/><b>Stato:</b> ${
      audit.stato || "N/A"
    }</div>`;
    html += `<hr/>`;

    selections.forEach((sel, idx) => {
      html += `<div class='category'><h2>${sel.category}</h2>`;
      html += `<div><b>Domanda:</b> ${sel.item}</div>`;
      html += `<div class='comment'><b>Commento:</b> ${
        sel.comment || "<i>Nessuna evidenza</i>"
      }</div>`;
      html += `<div class='file-list'><b>File allegati:</b> <ul>`;
      sel.files.forEach((file) => {
        if (file.path) {
          html += `<li>${file.name} <span style='font-size:12px;color:#555;'>(Percorso: ${file.path})</span></li>`;
        } else {
          html += `<li>${file.name}</li>`;
        }
      });
      html += `</ul></div>`;
      html += `<div class='${sel.terminato ? "completed" : "open"}'>${
        sel.terminato ? "✔ Terminato" : "⏳ Aperto"
      }</div>`;
      html += `</div><hr/>`;
    });

    html += `<footer style='margin-top:32px;font-size:12px;color:#888;'>Report generato il ${new Date().toLocaleString()}</footer>`;
    html += `</body></html>`;

    // Download
    const blob = new Blob([html], { type: "text/html" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    const aziendaClean = (audit.azienda || "Azienda")
      .replace(/[^a-zA-Z0-9]/g, "_")
      .substring(0, 20);
    const now = new Date();
    const timestamp = now.toISOString().replace(/[:.]/g, "").slice(0, 15);
    link.href = url;
    link.download = `${aziendaClean}_report_${timestamp}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    alert("Report HTML generato e scaricato!");
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
          <span style={{ color: "green" }}>✅ Configurata: {auditPath}</span>
        ) : auditPath ? (
          <span style={{ color: "orange" }}>
            ⚠️ Precedentemente configurata: {auditPath} (riseleziona per
            riattivare)
          </span>
        ) : (
          <span style={{ color: "red" }}>❌ Non selezionata</span>
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
                  {currentChecklist
                    ? currentChecklist.metadata.totalItemsFiltered ||
                      Object.values(currentChecklist.categories || {}).reduce(
                        (sum, cat) => sum + (cat.items?.length || 0),
                        0
                      )
                    : Object.values(filteredEsrsDetails).reduce(
                        (total, items) => total + items.length,
                        0
                      )}{" "}
                  /{" "}
                  {currentChecklist
                    ? currentChecklist.metadata.totalItems ||
                      Object.values(currentChecklist.categories || {}).reduce(
                        (sum, cat) => sum + (cat.items?.length || 0),
                        0
                      )
                    : Object.values(esrsDetails).reduce(
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
        SALVA
      </button>
      <button onClick={exportSelections} style={{ margin: "10px" }}>
        Esporta come JSON
      </button>
      <button
        onClick={() => {
          console.log("🔍 Debug storage prima di generare report:", {
            isReady: storage.ready(),
            hasSubDirs: !!storage.subDirs,
            hasReport: !!storage.subDirs?.report,
            clientName: storage.clientName,
            rootPath: storage.rootPath,
          });

          if (!storage.ready()) {
            alert(
              "⚠️ Prima di generare il report Word, devi selezionare la cartella audit.\n\nClicca su '📁 Seleziona Cartella e Inizia Audit' per configurare la struttura delle cartelle."
            );
            return;
          }

          generateWordReport(audit, storage);
        }}
        style={{ margin: "10px" }}
      >
        📄 Genera Report Word
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
                          handleFileSelect(category, item, "gallery")
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
                          handleFileSelect(category, item, "camera")
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
                    {evidence.error && (
                      <div
                        style={{
                          color: "#c62828",
                          fontSize: "12px",
                          margin: "4px 0",
                        }}
                      >
                        ⚠️ {evidence.error}
                      </div>
                    )}
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
                          onClick={() => {
                            const [categoryLocal, ...rest] = key.split("-");
                            const itemLabel = rest.join("-");
                            evidence.removeFile({
                              category: categoryLocal,
                              itemLabel,
                              index,
                            });
                          }}
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
