import React, { useState } from "react";
import { testMaterialityReportGeneration } from "../utils/materialityReportTest";
import {
  heraMaterialityData,
  enelMaterialityData,
} from "../utils/materialitySampleData";

/**
 * Componente per testare la generazione del report Word con grafico materialità
 */
function MaterialityReportDemo() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [testResults, setTestResults] = useState(null);
  const [selectedSample, setSelectedSample] = useState("hera");

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    setTestResults(null);

    try {
      // Mock storage provider per salvare il file
      const mockStorage = {
        saveFile: async (filename, blob) => {
          // Crea download diretto del file
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);

          console.log(`📁 File scaricato: ${filename} (${blob.size} bytes)`);
        },
      };

      const results = await testMaterialityReportGeneration(mockStorage);
      setTestResults(results);
    } catch (error) {
      setTestResults({
        success: false,
        error: error.message,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const sampleData =
    selectedSample === "hera" ? heraMaterialityData : enelMaterialityData;

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h2>🧪 Demo Report Word con Analisi Materialità</h2>

      <div
        style={{
          backgroundColor: "#f8f9fa",
          padding: "15px",
          borderRadius: "8px",
          marginBottom: "20px",
        }}
      >
        <h3>📊 Anteprima Dati Materialità</h3>

        <div style={{ marginBottom: "15px" }}>
          <label>
            <input
              type="radio"
              name="sample"
              value="hera"
              checked={selectedSample === "hera"}
              onChange={(e) => setSelectedSample(e.target.value)}
            />
            <strong> HERA Spa</strong> - Utilities Multi-servizio (Dati reali da
            bilancio 2023)
          </label>
          <br />
          <label>
            <input
              type="radio"
              name="sample"
              value="enel"
              checked={selectedSample === "enel"}
              onChange={(e) => setSelectedSample(e.target.value)}
            />
            <strong> ENEL SpA</strong> - Energia Elettrica Multinazionale (Dati
            da relazione 2024)
          </label>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "15px",
            fontSize: "14px",
          }}
        >
          <div>
            <strong>🏢 {sampleData.companyInfo.name}</strong>
            <br />
            📍 Settore: {sampleData.companyInfo.sector}
            <br />
            👥 Dipendenti: {sampleData.companyInfo.employees.toLocaleString()}
            <br />
            💰 Fatturato: €
            {(sampleData.companyInfo.revenue / 1000000000).toFixed(1)}B<br />
          </div>
          <div>
            <strong>📈 Materialità:</strong>
            <br />
            🎯 Temi totali: {sampleData.topics.length}
            <br />
            🔴 Temi critici:{" "}
            {sampleData.topics.filter((t) => t.quadrant === "critical").length}
            <br />
            📊 Soglia: {sampleData.metadata.threshold}/5.0
            <br />
            💬 Risposte: {sampleData.metadata.totalResponses}
            <br />
          </div>
        </div>
      </div>

      <div
        style={{
          backgroundColor: "#e3f2fd",
          padding: "15px",
          borderRadius: "8px",
          marginBottom: "20px",
        }}
      >
        <h4>🎯 Distribuzione Temi per Quadrante</h4>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "10px",
            fontSize: "14px",
          }}
        >
          <div>
            <span style={{ color: "#dc2626", fontWeight: "bold" }}>
              🔴 CRITICO:
            </span>{" "}
            {sampleData.topics.filter((t) => t.quadrant === "critical").length}{" "}
            temi
            <br />
            <span style={{ color: "#ea580c", fontWeight: "bold" }}>
              🟠 FOCUS IMPATTO:
            </span>{" "}
            {
              sampleData.topics.filter((t) => t.quadrant === "impact-focus")
                .length
            }{" "}
            temi
          </div>
          <div>
            <span style={{ color: "#0891b2", fontWeight: "bold" }}>
              🔵 RILEVANZA FINANZIARIA:
            </span>{" "}
            {
              sampleData.topics.filter(
                (t) => t.quadrant === "financial-relevance"
              ).length
            }{" "}
            temi
            <br />
            <span style={{ color: "#059669", fontWeight: "bold" }}>
              🟢 MONITORAGGIO:
            </span>{" "}
            {
              sampleData.topics.filter((t) => t.quadrant === "monitoring")
                .length
            }{" "}
            temi
          </div>
        </div>
      </div>

      <div
        style={{
          backgroundColor: "#fff3cd",
          padding: "15px",
          borderRadius: "8px",
          marginBottom: "20px",
        }}
      >
        <h4>📝 Cosa include il Report Word generato:</h4>
        <ul style={{ margin: "0", paddingLeft: "20px" }}>
          <li>
            <strong>Executive Summary</strong> con dati aziendali e
            completamento audit
          </li>
          <li>
            <strong>Gap Analysis</strong> dettagliata per sezioni ESRS
          </li>
          <li>
            <strong>🎯 ANALISI DI MATERIALITÀ</strong> completa secondo PDR
            134:2022
          </li>
          <li>
            <strong>Grafico ASCII</strong> della doppia matrice di materialità
          </li>
          <li>
            <strong>Dettaglio temi</strong> per ogni quadrante con scoring
          </li>
          <li>
            <strong>Raccomandazioni strategiche</strong> basate sui risultati
          </li>
          <li>
            <strong>Action Plan</strong> strutturato per implementazione
          </li>
          <li>
            <strong>Compliance ESRS</strong> e certificazione auditor
          </li>
        </ul>
      </div>

      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <button
          onClick={handleGenerateReport}
          disabled={isGenerating}
          style={{
            backgroundColor: isGenerating ? "#6c757d" : "#007bff",
            color: "white",
            border: "none",
            padding: "12px 24px",
            fontSize: "16px",
            borderRadius: "6px",
            cursor: isGenerating ? "not-allowed" : "pointer",
            fontWeight: "bold",
          }}
        >
          {isGenerating
            ? "⏳ Generazione in corso..."
            : "📄 Genera Report Word con Materialità"}
        </button>
      </div>

      {testResults && (
        <div
          style={{
            backgroundColor: testResults.success ? "#d1ecf1" : "#f8d7da",
            border: `1px solid ${testResults.success ? "#bee5eb" : "#f5c6cb"}`,
            color: testResults.success ? "#0c5460" : "#721c24",
            padding: "15px",
            borderRadius: "6px",
            marginTop: "20px",
          }}
        >
          <h4>
            {testResults.success
              ? "✅ Report Generato con Successo!"
              : "❌ Errore Generazione Report"}
          </h4>
          {testResults.success ? (
            <div>
              <p>
                <strong>Azienda:</strong> {testResults.company}
              </p>
              <p>
                <strong>Temi materialità:</strong> {testResults.totalTopics}{" "}
                totali ({testResults.criticalTopics} critici)
              </p>
              <p>
                <strong>Completamento ESRS:</strong>{" "}
                {testResults.completionRate}%
              </p>
              <p>
                <strong>📁 File scaricato:</strong> Report_ESRS_
                {testResults.company.replace(/\s+/g, "_")}_Materialità.txt
              </p>
              <p
                style={{
                  fontSize: "14px",
                  marginTop: "10px",
                  fontStyle: "italic",
                }}
              >
                💡 Il report include la sezione completa di analisi materialità
                con grafico a dispersione ASCII, distribuzione per quadranti e
                raccomandazioni strategiche basate sui dati reali dei bilanci
                analizzati.
              </p>
            </div>
          ) : (
            <p>
              <strong>Errore:</strong> {testResults.error}
            </p>
          )}
        </div>
      )}

      <div
        style={{
          fontSize: "12px",
          color: "#6c757d",
          marginTop: "30px",
          borderTop: "1px solid #dee2e6",
          paddingTop: "15px",
        }}
      >
        <p>
          <strong>ℹ️ Note tecniche:</strong>
        </p>
        <ul style={{ margin: "0", paddingLeft: "20px" }}>
          <li>
            Il grafico è rappresentato in ASCII art per compatibilità Word
          </li>
          <li>I dati sono estratti da bilanci reali (HERA 2023, ENEL 2024)</li>
          <li>La metodologia PDR 134:2022 è applicata correttamente</li>
          <li>
            Il report può essere convertito in Word per formatting avanzato
          </li>
        </ul>
      </div>
    </div>
  );
}

export default MaterialityReportDemo;
