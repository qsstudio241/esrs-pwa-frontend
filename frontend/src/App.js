import React, { useState, useEffect } from "react";
import requisitiDimensioni from "./requisiti_dimensioni_esrs.json";
import Checklist from "./Checklist";
import ChecklistRefactored from "./ChecklistRefactored";
import ErrorBoundary from "./components/ErrorBoundary";
import MaterialityManagement from "./components/MaterialityManagement";
import { StorageProvider } from "./storage/StorageContext";
import { calcolaDimensioneAzienda } from "./utils/auditBusinessLogic";
import {
  setTelemetryOptIn,
  recordTelemetry,
  dumpTelemetry,
} from "./utils/telemetry";

// Utility per generare un ID univoco
const generateId = () => "audit_" + Date.now();

function AuditSelector({
  audits,
  onSelectAudit,
  onCreateAudit,
  showClosed,
  setShowClosed,
}) {
  const [azienda, setAzienda] = useState("");
  const [fatturato, setFatturato] = useState("");
  const [dipendenti, setDipendenti] = useState("");
  const [totaleAttivo, setTotaleAttivo] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [dimensionePreview, setDimensionePreview] = useState("");

  const auditsToShow = Array.isArray(audits)
    ? audits.filter((a) => showClosed || a.stato === "in corso")
    : [];

  return (
    <div style={{ marginBottom: 24 }}>
      <h2>Seleziona audit</h2>
      <select onChange={(e) => onSelectAudit(e.target.value)} value="">
        <option value="">-- Seleziona --</option>
        {auditsToShow.map((a) => (
          <option key={a.id} value={a.id}>
            {a.azienda} ({a.dimensione}) - {a.stato}
          </option>
        ))}
      </select>
      <label style={{ marginLeft: 12 }}>
        <input
          type="checkbox"
          checked={showClosed}
          onChange={(e) => setShowClosed(e.target.checked)}
        />
        Mostra anche audit chiusi
      </label>
      <button style={{ marginLeft: 12 }} onClick={() => setShowNew(!showNew)}>
        Nuovo audit
      </button>
      {showNew && (
        <div style={{ marginTop: 12 }}>
          <input
            placeholder="Nome azienda"
            value={azienda}
            onChange={(e) => setAzienda(e.target.value)}
          />
          <div style={{ margin: "16px 0" }}>
            <b>Tabella soglie normative (CSRD/ESRS):</b>
            <table
              style={{
                borderCollapse: "collapse",
                width: "100%",
                marginTop: 8,
                fontSize: "14px",
              }}
            >
              <thead>
                <tr style={{ background: "#e3f2fd" }}>
                  <th style={{ border: "1px solid #90caf9", padding: "4px" }}>
                    Dimensione
                  </th>
                  <th style={{ border: "1px solid #90caf9", padding: "4px" }}>
                    Fatturato max (EUR)
                  </th>
                  <th style={{ border: "1px solid #90caf9", padding: "4px" }}>
                    Dipendenti max
                  </th>
                  <th style={{ border: "1px solid #90caf9", padding: "4px" }}>
                    Totale attivo max (EUR)
                  </th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(requisitiDimensioni.dimensioni_aziendali).map(
                  ([dimKey, dimObj]) => (
                    <tr key={dimKey}>
                      <td
                        style={{ border: "1px solid #90caf9", padding: "4px" }}
                      >
                        {dimKey.charAt(0).toUpperCase() + dimKey.slice(1)}
                      </td>
                      <td
                        style={{ border: "1px solid #90caf9", padding: "4px" }}
                      >
                        {dimObj.criteri.fatturato_max !== null
                          ? dimObj.criteri.fatturato_max.toLocaleString("it-IT")
                          : "—"}
                      </td>
                      <td
                        style={{ border: "1px solid #90caf9", padding: "4px" }}
                      >
                        {dimObj.criteri.dipendenti_max !== null
                          ? dimObj.criteri.dipendenti_max
                          : "—"}
                      </td>
                      <td
                        style={{ border: "1px solid #90caf9", padding: "4px" }}
                      >
                        {dimObj.criteri.totale_attivo_max !== null
                          ? dimObj.criteri.totale_attivo_max.toLocaleString(
                              "it-IT"
                            )
                          : "—"}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
            <div style={{ fontSize: "12px", color: "#555", marginTop: 4 }}>
              <em>
                La dimensione aziendale viene calcolata automaticamente secondo
                la regola "almeno 2 su 3 criteri".
              </em>
            </div>
          </div>
          <div
            style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}
          >
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="Fatturato (EUR)"
              value={fatturato}
              onChange={(e) => {
                // Rimuove caratteri non numerici
                const val = e.target.value.replace(/[^0-9]/g, "");
                setFatturato(val);
              }}
              title="Fatturato annuo"
              style={{ minWidth: "140px" }}
            />
            <input
              type="number"
              placeholder="Dipendenti"
              value={dipendenti}
              onChange={(e) => setDipendenti(e.target.value)}
              title="Numero medio dipendenti"
              style={{ minWidth: "100px" }}
            />
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="Totale attivo (EUR)"
              value={totaleAttivo}
              onChange={(e) => {
                const val = e.target.value.replace(/[^0-9]/g, "");
                setTotaleAttivo(val);
              }}
              title="Totale attivo di bilancio"
              style={{ minWidth: "140px" }}
            />
            <input
              type="text"
              value={dimensionePreview ? dimensionePreview : "—"}
              readOnly
              style={{
                background: "#e3f2fd",
                color: "#1976d2",
                fontWeight: "bold",
                border: "1px solid #90caf9",
                padding: "6px",
                minWidth: "120px",
              }}
              title="Dimensione aziendale calcolata"
            />
          </div>
          <div
            style={{ fontSize: "12px", color: "#888", margin: "4px 0 8px 0" }}
          >
            <span>
              Formato: <b>solo numeri</b> (es:{" "}
              <span style={{ color: "#1976d2" }}>2.000.000</span> per due
              milioni). I valori inseriti saranno formattati come valuta.
            </span>
          </div>
          <button
            style={{
              marginBottom: 8,
              background: "#1976d2",
              color: "white",
              border: "none",
              padding: "8px 16px",
              borderRadius: "4px",
              fontWeight: "bold",
            }}
            onClick={() => {
              // Formatto i valori come valuta italiana
              const formatVal = (v) =>
                v ? Number(v).toLocaleString("it-IT") : "";
              setFatturato(formatVal(fatturato.replace(/[^0-9]/g, "")));
              setTotaleAttivo(formatVal(totaleAttivo.replace(/[^0-9]/g, "")));
              // Calcolo la dimensione
              const dimPreview = calcolaDimensioneAzienda({
                fatturato: Number(fatturato.replace(/[^0-9]/g, "")),
                dipendenti: Number(dipendenti),
                attivo: Number(totaleAttivo.replace(/[^0-9]/g, "")),
              });
              setDimensionePreview(dimPreview ? dimPreview : "—");
            }}
          >
            Calcola dimensione
          </button>
          <button
            onClick={async () => {
              if (azienda) {
                try {
                  // Copia il nome azienda negli appunti
                  await navigator.clipboard.writeText(azienda);
                  console.log(
                    `📋 Nome azienda copiato negli appunti: ${azienda}`
                  );
                } catch (err) {
                  console.log("Impossibile copiare negli appunti");
                }

                // Calcolo automatico dimensione
                const dimCalcolata = calcolaDimensioneAzienda({
                  fatturato: Number(fatturato.replace(/[^0-9]/g, "")),
                  dipendenti: Number(dipendenti),
                  attivo: Number(totaleAttivo.replace(/[^0-9]/g, "")),
                });
                if (!dimCalcolata) {
                  alert(
                    "Inserisci almeno due valori tra fatturato, dipendenti e totale attivo per calcolare la dimensione aziendale."
                  );
                  return;
                }
                onCreateAudit({
                  id: generateId(),
                  azienda,
                  dimensione: dimCalcolata,
                  stato: "in corso",
                  dataAvvio: new Date().toISOString(),
                  checklist: {},
                  comments: {},
                  photos: {},
                  exportHistory: [],
                  directoryHandle: null, // nuovo campo per la persistenza
                  metricheAziendali: {
                    fatturato: fatturato
                      ? Number(String(fatturato).replace(/[^0-9]/g, ""))
                      : null,
                    dipendenti: dipendenti
                      ? Number(String(dipendenti).replace(/[^0-9]/g, ""))
                      : null,
                    totaleAttivo: totaleAttivo
                      ? Number(String(totaleAttivo).replace(/[^0-9]/g, ""))
                      : null,
                    dimensioneCalcolata: dimCalcolata,
                  },
                });
                setAzienda("");
                setFatturato("");
                setDipendenti("");
                setTotaleAttivo("");
                setShowNew(false);
              } else {
                alert("⚠️ Inserisci il nome dell'azienda prima di procedere");
              }
            }}
          >
            Crea
          </button>
        </div>
      )}
    </div>
  );
}

function App() {
  const [audits, setAudits] = useState(() => {
    try {
      const saved = localStorage.getItem("audits");
      if (process.env.NODE_ENV !== "production") {
        console.log("Raw localStorage audits:", saved);
      }
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      if (process.env.NODE_ENV !== "production") {
        console.log("Parsed audits:", parsed);
      }
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.error("Failed to parse audits from localStorage:", e);
      return [];
    }
  });
  const [currentAuditId, setCurrentAuditId] = useState("");
  const [showClosed, setShowClosed] = useState(false);
  const [activeTab, setActiveTab] = useState("checklist"); // nuovo state per tab
  const [useRefactored, setUseRefactored] = useState(() => {
    try {
      return localStorage.getItem("feature_refactored_checklist") === "1";
    } catch {
      return false;
    }
  });
  const [telemetryOptIn, setTelemetryOptInState] = useState(() => {
    try {
      return localStorage.getItem("telemetry_opt_in") === "1";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("audits", JSON.stringify(audits));
    } catch (e) {
      console.error("Failed to save audits to localStorage:", e);
    }
  }, [audits]);

  // Safeguard: Ensure audits is an array before calling find
  const currentAudit = Array.isArray(audits)
    ? audits.find((a) => a.id === currentAuditId)
    : null;

  const handleSelectAudit = (id) => setCurrentAuditId(id);

  const handleCreateAudit = (newAudit) => {
    setAudits((prev) => {
      if (!Array.isArray(prev)) {
        console.error("audits is not an array:", prev);
        return [newAudit];
      }
      return [...prev, newAudit];
    });
    setCurrentAuditId(newAudit.id);
  };

  const updateCurrentAudit = (data) => {
    setAudits((prev) => {
      if (!Array.isArray(prev)) {
        console.error("audits is not an array:", prev);
        return [];
      }
      return prev.map((a) => (a.id === currentAuditId ? { ...a, ...data } : a));
    });
  };

  const toggleRefactored = () => {
    setUseRefactored((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("feature_refactored_checklist", next ? "1" : "0");
        recordTelemetry("feature_toggle", {
          feature: "refactored_checklist",
          enabled: next,
        });
      } catch {}
      return next;
    });
  };

  const toggleTelemetry = () => {
    setTelemetryOptInState((prev) => {
      const next = !prev;
      setTelemetryOptIn(next);
      recordTelemetry("telemetry_opt", { enabled: next });
      return next;
    });
  };

  function resetAudits() {
    // eslint-disable-next-line no-alert
    if (
      window.confirm(
        "⚠️ Questo eliminerà tutti gli audit salvati localmente. Procedere?"
      )
    ) {
      try {
        localStorage.removeItem("audits");
        Object.keys(localStorage).forEach((k) => {
          if (k.startsWith("auditDir_")) localStorage.removeItem(k);
        });
      } catch {}
      setAudits([]);
      setCurrentAuditId("");
    }
  }

  return (
    <StorageProvider>
      <div className="App">
        <AuditSelector
          audits={audits}
          onSelectAudit={handleSelectAudit}
          onCreateAudit={handleCreateAudit}
          showClosed={showClosed}
          setShowClosed={setShowClosed}
        />
        <div
          style={{
            marginBottom: 8,
            display: "flex",
            gap: 16,
            alignItems: "center",
          }}
        >
          <label style={{ fontSize: "12px" }}>
            <input
              type="checkbox"
              checked={useRefactored}
              onChange={toggleRefactored}
            />{" "}
            Usa nuova checklist (beta)
          </label>
          <label style={{ fontSize: "12px" }}>
            <input
              type="checkbox"
              checked={telemetryOptIn}
              onChange={toggleTelemetry}
            />{" "}
            Telemetria anonima (opt-in)
          </label>
          {telemetryOptIn && (
            <button
              style={{ fontSize: "11px" }}
              onClick={() => {
                const data = dumpTelemetry();
                const blob = new Blob([JSON.stringify(data, null, 2)], {
                  type: "application/json",
                });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "telemetry_dump.json";
                a.click();
                URL.revokeObjectURL(url);
              }}
            >
              Esporta Telemetria
            </button>
          )}
          {process.env.NODE_ENV !== "production" && (
            <button
              onClick={resetAudits}
              style={{
                fontSize: "11px",
                background: "#ffe0e0",
                border: "1px solid #ffb0b0",
                cursor: "pointer",
                padding: "4px 8px",
                borderRadius: 4,
              }}
            >
              Reset audit locali
            </button>
          )}
        </div>
        {currentAudit ? (
          <div>
            {/* Tab Navigation */}
            <div
              style={{
                display: "flex",
                marginBottom: "1rem",
                borderBottom: "2px solid #e9ecef",
              }}
            >
              <button
                onClick={() => setActiveTab("checklist")}
                style={{
                  padding: "0.75rem 1.5rem",
                  backgroundColor:
                    activeTab === "checklist" ? "#1976d2" : "white",
                  color: activeTab === "checklist" ? "white" : "#1976d2",
                  border: "2px solid #1976d2",
                  borderBottom: "none",
                  borderRadius: "6px 6px 0 0",
                  cursor: "pointer",
                  fontWeight: "bold",
                  marginRight: "0.25rem",
                }}
              >
                📋 Checklist ESRS
              </button>
              <button
                onClick={() => setActiveTab("materiality")}
                style={{
                  padding: "0.75rem 1.5rem",
                  backgroundColor:
                    activeTab === "materiality" ? "#1976d2" : "white",
                  color: activeTab === "materiality" ? "white" : "#1976d2",
                  border: "2px solid #1976d2",
                  borderBottom: "none",
                  borderRadius: "6px 6px 0 0",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                🎯 Analisi Materialità
              </button>
            </div>

            {/* Tab Content */}
            <ErrorBoundary
              onReset={() => {
                // Soft reset: ricarica audit corrente dall'array (già persistito) e forza re-render
                setCurrentAuditId((id) => (id ? "" : currentAudit.id));
                setTimeout(() => setCurrentAuditId(currentAudit.id), 0);
              }}
              renderExtra={({ error }) => (
                <>
                  <button
                    onClick={() => {
                      try {
                        const blob = new Blob(
                          [JSON.stringify(currentAudit, null, 2)],
                          { type: "application/json" }
                        );
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = `audit_raw_${currentAudit.id}.json`;
                        a.click();
                        URL.revokeObjectURL(url);
                      } catch (e) {
                        console.error("Export raw audit failed", e);
                      }
                    }}
                  >
                    Esporta dati grezzi
                  </button>
                  {error && (
                    <button
                      onClick={() => {
                        console.error("Forzatura reload pagina dopo errore");
                        window.location.reload();
                      }}
                    >
                      Ricarica pagina
                    </button>
                  )}
                </>
              )}
            >
              {activeTab === "checklist" ? (
                useRefactored ? (
                  <ChecklistRefactored
                    audit={currentAudit}
                    onUpdate={updateCurrentAudit}
                  />
                ) : (
                  <Checklist
                    audit={currentAudit}
                    onUpdate={updateCurrentAudit}
                  />
                )
              ) : (
                <MaterialityManagement
                  audit={currentAudit}
                  onUpdate={updateCurrentAudit}
                />
              )}
            </ErrorBoundary>
          </div>
        ) : (
          <p>Seleziona un audit per iniziare.</p>
        )}
      </div>
    </StorageProvider>
  );
}

export default App;

// ...existing code...
