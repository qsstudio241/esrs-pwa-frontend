import React, { useState, useEffect } from "react";
import requisitiDimensioni from "./requisiti_dimensioni_esrs.json";
import Checklist from "./Checklist";
import { StorageProvider } from "./storage/StorageContext";

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
              const dimPreview = calcolaDimensione(
                fatturato.replace(/[^0-9]/g, ""),
                dipendenti,
                totaleAttivo.replace(/[^0-9]/g, "")
              );
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
                const dimCalcolata = calcolaDimensione(
                  fatturato,
                  dipendenti,
                  totaleAttivo
                );
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
                    fatturato: fatturato ? Number(fatturato) : null,
                    dipendenti: dipendenti ? Number(dipendenti) : null,
                    totaleAttivo: totaleAttivo ? Number(totaleAttivo) : null,
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
      console.log("Raw localStorage audits:", saved); // Debug: Log raw data
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      console.log("Parsed audits:", parsed); // Debug: Log parsed data
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.error("Failed to parse audits from localStorage:", e);
      return [];
    }
  });
  const [currentAuditId, setCurrentAuditId] = useState("");
  const [showClosed, setShowClosed] = useState(false);

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
        {currentAudit ? (
          <Checklist audit={currentAudit} onUpdate={updateCurrentAudit} />
        ) : (
          <p>Seleziona un audit per iniziare.</p>
        )}
      </div>
    </StorageProvider>
  );
}

export default App;

// Determina la dimensione aziendale in base a soglie presenti in requisiti_dimensioni_esrs.json
function calcolaDimensione(fatturato, dipendenti, totaleAttivo) {
  const clean = (v) =>
    v === "" || v === null || v === undefined ? null : Number(v);
  const f = clean(fatturato);
  const d = clean(dipendenti);
  const t = clean(totaleAttivo);

  const provided = [f, d, t].filter((x) => x != null).length;
  if (provided < 2) return null; // servono almeno 2 dati per classificare

  const dim = requisitiDimensioni.dimensioni_aziendali;

  const meets = (sizeKey) => {
    const c = dim[sizeKey].criteri;
    let count = 0;
    if (f != null && (c.fatturato_max == null || f <= c.fatturato_max)) count++;
    if (d != null && (c.dipendenti_max == null || d <= c.dipendenti_max))
      count++;
    if (t != null && (c.totale_attivo_max == null || t <= c.totale_attivo_max))
      count++;
    return count >= 2; // regola 2 su 3
  };

  if (meets("micro")) return "Micro";
  if (meets("piccola")) return "Piccola";
  if (meets("media")) return "Media";
  return "Grande";
}
