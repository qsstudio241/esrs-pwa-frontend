import React, { useState } from "react";

/**
 * Versione semplificata del componente MaterialityManagement
 * Per evitare crash dovuti a dipendenze mancanti
 */
function MaterialityManagement({ audit, onUpdate }) {
  const [activeTab, setActiveTab] = useState("placeholder");

  return (
    <div style={{ padding: "1rem" }}>
      {/* Header con messaggio temporaneo */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
          borderBottom: "2px solid #e9ecef",
          paddingBottom: "1rem",
        }}
      >
        <div>
          <h2 style={{ margin: 0, color: "#1976d2" }}>
            🎯 Analisi Materialità - {audit?.azienda || "Audit"}
          </h2>
          <p
            style={{
              margin: "0.5rem 0 0 0",
              color: "#666",
              fontSize: "0.9rem",
            }}
          >
            Modulo in fase di riparazione • Funzionalità temporaneamente limitata
          </p>
        </div>
      </div>

      {/* Messaggio di stato */}
      <div
        style={{
          padding: "2rem",
          backgroundColor: "#fff3cd",
          border: "1px solid #ffeaa7",
          borderRadius: "6px",
          marginBottom: "2rem",
          textAlign: "center",
        }}
      >
        <h3 style={{ margin: "0 0 1rem 0", color: "#856404" }}>
          🚧 Modulo in Manutenzione
        </h3>
        <p style={{ margin: "0 0 1rem 0", color: "#856404" }}>
          Il tab "Analisi Materialità" è temporaneamente non disponibile a causa di aggiornamenti in corso.
        </p>
        <p style={{ margin: 0, fontSize: "0.9rem", color: "#6c757d" }}>
          Per ora puoi continuare a utilizzare il tab "📋 Checklist ESRS" che è completamente funzionale
          con tutte le funzionalità KPI integrate.
        </p>
      </div>

      {/* Informazioni su cosa sarà disponibile */}
      <div
        style={{
          backgroundColor: "#e3f2fd",
          padding: "1.5rem",
          borderRadius: "6px",
          border: "1px solid #90caf9",
        }}
      >
        <h4 style={{ margin: "0 0 1rem 0", color: "#1976d2" }}>
          📋 Funzionalità Pianificate
        </h4>
        <ul style={{ margin: 0, paddingLeft: "1.5rem", color: "#1976d2" }}>
          <li style={{ marginBottom: "0.5rem" }}>
            🎯 <strong>Matrice di Materialità Doppia</strong> - Valutazione inside-out/outside-in secondo PDR 134:2022
          </li>
          <li style={{ marginBottom: "0.5rem" }}>
            📊 <strong>Questionario ISO 26000</strong> - Raccolta strutturata dati con evidenze
          </li>
          <li style={{ marginBottom: "0.5rem" }}>
            🗳️ <strong>Survey Stakeholder</strong> - Creazione e gestione questionari per stakeholder
          </li>
          <li style={{ marginBottom: "0.5rem" }}>
            📈 <strong>Analisi e Report</strong> - Raccomandazioni e export per compliance ESRS
          </li>
          <li style={{ marginBottom: "0" }}>
            🔄 <strong>Integrazione automatica</strong> - Sincronizzazione con checklist KPI
          </li>
        </ul>
      </div>

      {/* Note tecniche per debugging */}
      {process.env.NODE_ENV === "development" && (
        <div
          style={{
            marginTop: "2rem",
            padding: "1rem",
            backgroundColor: "#f8f9fa",
            border: "1px solid #dee2e6",
            borderRadius: "4px",
            fontSize: "0.8rem",
            color: "#6c757d",
          }}
        >
          <strong>Debug Info:</strong>
          <br />
          • Audit ID: {audit?.id || "N/A"}
          <br />
          • Azienda: {audit?.azienda || "N/A"}
          <br />
          • Dimensione: {audit?.dimensione || "N/A"}
          <br />
          • Stato: In riparazione - crash risolto temporaneamente
          <br />
          • Prossimo step: Implementazione graduale delle funzionalità
        </div>
      )}
    </div>
  );
}

export default MaterialityManagement;