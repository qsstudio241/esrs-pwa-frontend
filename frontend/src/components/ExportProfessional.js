import React, { useState } from "react";
import { generateESRSCompliantReport } from "../utils/esrsCompliantExport";
import { useStorage } from "../storage/StorageContext";

export default function ExportProfessional({ audit }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [exportOptions, setExportOptions] = useState({
    includeExecutiveSummary: true,
    includeMaterialityAnalysis: true,
    includeKPIData: true,
    includeComplianceGaps: true,
    formatType: "word",
  });
  const storage = useStorage();

  const handleESRSExport = async () => {
    if (!audit) return;

    setIsGenerating(true);
    try {
      await generateESRSCompliantReport(audit, exportOptions, storage);
    } catch (error) {
      console.error("Export failed:", error);
      alert("Errore durante la generazione del report");
    } finally {
      setIsGenerating(false);
    }
  };

  const getComplianceScore = () => {
    if (!audit) return 0;
    const totalItems = Object.keys(audit.completed || {}).length;
    const completedItems = Object.values(audit.completed || {}).filter(
      Boolean
    ).length;
    return totalItems ? Math.round((completedItems / totalItems) * 100) : 0;
  };

  return (
    <div className="export-professional">
      <h2>🎯 Export Professionale ESRS</h2>

      <div className="compliance-overview">
        <h3>Stato Compliance</h3>
        <div className="compliance-score">
          <span className="score-value">{getComplianceScore()}%</span>
          <span className="score-label">Completamento</span>
        </div>
        <p>Azienda: {audit?.azienda || "Non specificata"}</p>
        <p>Dimensione: {audit?.dimensione || "Non specificata"}</p>
      </div>

      <div className="export-options">
        <h3>Opzioni Export</h3>
        <label>
          <input
            type="checkbox"
            checked={exportOptions.includeExecutiveSummary}
            onChange={(e) =>
              setExportOptions((prev) => ({
                ...prev,
                includeExecutiveSummary: e.target.checked,
              }))
            }
          />
          Executive Summary
        </label>
        <label>
          <input
            type="checkbox"
            checked={exportOptions.includeMaterialityAnalysis}
            onChange={(e) =>
              setExportOptions((prev) => ({
                ...prev,
                includeMaterialityAnalysis: e.target.checked,
              }))
            }
          />
          Analisi Materialità
        </label>
        <label>
          <input
            type="checkbox"
            checked={exportOptions.includeKPIData}
            onChange={(e) =>
              setExportOptions((prev) => ({
                ...prev,
                includeKPIData: e.target.checked,
              }))
            }
          />
          Dati KPI e Metriche
        </label>
        <label>
          <input
            type="checkbox"
            checked={exportOptions.includeComplianceGaps}
            onChange={(e) =>
              setExportOptions((prev) => ({
                ...prev,
                includeComplianceGaps: e.target.checked,
              }))
            }
          />
          Gap Analysis
        </label>
      </div>

      <div className="export-actions">
        <button
          onClick={handleESRSExport}
          disabled={isGenerating || !audit}
          className="btn-primary"
        >
          {isGenerating ? "⏳ Generazione..." : "📄 Genera Report ESRS"}
        </button>
      </div>

      <style>{`
        .export-professional {
          padding: 20px;
          max-width: 800px;
        }
        .compliance-overview {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 20px;
        }
        .compliance-score {
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 10px 0;
        }
        .score-value {
          font-size: 2em;
          font-weight: bold;
          color: #28a745;
        }
        .export-options {
          margin-bottom: 20px;
        }
        .export-options label {
          display: block;
          margin: 10px 0;
          cursor: pointer;
        }
        .btn-primary {
          background: #007bff;
          color: white;
          padding: 12px 24px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 16px;
        }
        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}
