import React, { useState, useEffect } from "react";
import { useStorage } from "../storage/StorageContext";

/**
 * Componente per gestire la connessione alla cartella di salvataggio audit
 * Mostra stato, permette selezione/modifica cartella, info struttura
 */
export default function StorageManager({ audit, compact = false }) {
  const storage = useStorage();
  const [storageInfo, setStorageInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const info = storage.ready();
    setStorageInfo(info);
  }, [storage]);

  const updateStorageInfo = () => {
    const info = storage.ready();
    setStorageInfo(info);
  };

  const handleInitNewAudit = async () => {
    if (!audit) {
      alert("Seleziona prima un audit");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await storage.provider.initNewAuditTree(audit.azienda);
      updateStorageInfo();
      alert(
        `✅ Struttura audit creata!\n\n` +
          `Cartella: ${result.structure}\n` +
          `Categorie: ${result.categories.length} cartelle create`
      );
    } catch (err) {
      setError(err.message);
      console.error("Errore inizializzazione nuovo audit:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResumeExistingAudit = async () => {
    if (!audit) {
      alert("Seleziona prima un audit");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await storage.provider.resumeExistingAudit(audit.azienda);
      updateStorageInfo();
      alert(
        `✅ Audit ripreso!\n\n` +
          `Cartella collegata: ${result.structure}\n` +
          `Modalità: ${result.isNewAudit ? "NUOVO" : "RIPRESA"}`
      );
    } catch (err) {
      setError(err.message);
      console.error("Errore ripresa audit esistente:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = () => {
    if (
      window.confirm(
        "⚠️ Disconnettere la cartella di salvataggio?\n\nI file non verranno eliminati, ma dovrai ricollegarla per salvare nuove evidenze."
      )
    ) {
      storage.provider.resetState();
      updateStorageInfo();
    }
  };

  // Versione compatta per header
  if (compact) {
    return (
      <div
        style={{
          padding: "8px 12px",
          background: storageInfo ? "#e8f5e9" : "#fff3e0",
          border: `1px solid ${storageInfo ? "#81c784" : "#ffb74d"}`,
          borderRadius: 4,
          fontSize: "12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
        }}
      >
        <span>
          {storageInfo ? (
            <>
              ✅ <strong>Cartella collegata</strong>
            </>
          ) : (
            <>
              ⚠️ <strong>Nessuna cartella selezionata</strong>
            </>
          )}
        </span>
        {!storageInfo && audit && (
          <button
            onClick={handleResumeExistingAudit}
            disabled={isLoading}
            style={{
              fontSize: "11px",
              padding: "4px 8px",
              cursor: "pointer",
              borderRadius: 3,
              background: "#2196f3",
              color: "white",
              border: "none",
            }}
          >
            {isLoading ? "..." : "� Riprendi Audit"}
          </button>
        )}
      </div>
    );
  }

  // Versione completa per settings panel
  return (
    <div
      style={{
        padding: "12px",
        background: "#fafafa",
        border: "1px solid #e0e0e0",
        borderRadius: 4,
      }}
    >
      <h4 style={{ margin: "0 0 12px 0", fontSize: "14px", color: "#333" }}>
        📁 Gestione Cartella Salvataggio
      </h4>

      {/* Status - Solo quando connessa */}
      {storageInfo && (
        <div
          style={{
            padding: "8px",
            background: "#e8f5e9",
            borderLeft: "4px solid #4caf50",
            marginBottom: 12,
            fontSize: "12px",
          }}
        >
          <div>
            <div style={{ fontWeight: "bold", marginBottom: 4 }}>
              ✅ Cartella collegata
            </div>
            {storage.provider.rootPath && (
              <div>Percorso: {storage.provider.rootPath}</div>
            )}
            {storage.provider.clientName && (
              <div>Azienda: {storage.provider.clientName}</div>
            )}
            <div style={{ marginTop: 4, fontSize: "11px", color: "#666" }}>
              Le evidenze verranno salvate automaticamente nella struttura
              creata
            </div>
          </div>
        </div>
      )}

      {/* Errori */}
      {error && (
        <div
          style={{
            padding: "8px",
            background: "#ffebee",
            border: "1px solid #ef5350",
            borderRadius: 4,
            marginBottom: 12,
            fontSize: "11px",
            color: "#c62828",
          }}
        >
          ❌ {error}
        </div>
      )}

      {/* Info Browser Support */}
      {!window.showDirectoryPicker && (
        <div
          style={{
            padding: "8px",
            background: "#e3f2fd",
            border: "1px solid #64b5f6",
            borderRadius: 4,
            marginBottom: 12,
            fontSize: "11px",
          }}
        >
          ℹ️ Il tuo browser non supporta il salvataggio su filesystem locale.
          Usa Chrome o Edge versione recente.
        </div>
      )}

      {/* Azioni - Solo se audit selezionato e browser supporta */}
      {audit && window.showDirectoryPicker && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {!storageInfo ? (
            <>
              <button
                onClick={handleInitNewAudit}
                disabled={isLoading}
                style={{
                  padding: "8px 12px",
                  fontSize: "12px",
                  background: "#4caf50",
                  color: "white",
                  border: "none",
                  borderRadius: 4,
                  cursor: isLoading ? "not-allowed" : "pointer",
                  fontWeight: "bold",
                }}
              >
                {isLoading
                  ? "⏳ Attendere..."
                  : "🆕 Crea Nuova Struttura Audit"}
              </button>
              <button
                onClick={handleResumeExistingAudit}
                disabled={isLoading}
                style={{
                  padding: "8px 12px",
                  fontSize: "12px",
                  background: "#2196f3",
                  color: "white",
                  border: "none",
                  borderRadius: 4,
                  cursor: isLoading ? "not-allowed" : "pointer",
                }}
              >
                {isLoading ? "⏳ Attendere..." : "🔄 Riprendi Audit Esistente"}
              </button>
              <div
                style={{
                  fontSize: "10px",
                  color: "#666",
                  padding: "4px",
                  background: "#f5f5f5",
                  borderRadius: 3,
                }}
              >
                <strong>Nuovo:</strong> Crea cartella "{audit.azienda}" nel
                percorso che scegli
                <br />
                <strong>Riprendi:</strong> Seleziona la cartella esistente "
                {audit.azienda}"
              </div>
            </>
          ) : (
            <>
              <button
                onClick={handleDisconnect}
                style={{
                  padding: "6px 12px",
                  fontSize: "11px",
                  background: "#ff5722",
                  color: "white",
                  border: "none",
                  borderRadius: 4,
                  cursor: "pointer",
                }}
              >
                🔌 Disconnetti Cartella
              </button>
              <button
                onClick={handleResumeExistingAudit}
                disabled={isLoading}
                style={{
                  padding: "6px 12px",
                  fontSize: "11px",
                  background: "#9e9e9e",
                  color: "white",
                  border: "none",
                  borderRadius: 4,
                  cursor: "pointer",
                }}
              >
                🔄 Ricollega/Cambia Cartella
              </button>
            </>
          )}
        </div>
      )}

      {/* Info struttura */}
      {storageInfo && (
        <details
          style={{
            marginTop: 12,
            fontSize: "11px",
            background: "#f5f5f5",
            padding: "8px",
            borderRadius: 4,
          }}
        >
          <summary style={{ cursor: "pointer", fontWeight: "bold" }}>
            ℹ️ Struttura Cartelle
          </summary>
          <pre
            style={{
              marginTop: 8,
              fontSize: "10px",
              background: "white",
              padding: "8px",
              borderRadius: 3,
              overflow: "auto",
            }}
          >
            {`${audit?.azienda || "Cliente"}/
├── ${new Date().getFullYear()}_ESRS_Bilancio/
    ├── Evidenze/
    │   ├── Generale/
    │   ├── E1/ ... E5/
    │   ├── S1/ ... S4/
    │   └── G1/ ... G5/
    ├── Export/
    └── Report/`}
          </pre>
        </details>
      )}
    </div>
  );
}
