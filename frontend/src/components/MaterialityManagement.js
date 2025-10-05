import React, { useState } from "react";
import MaterialityMatrix from "./MaterialityMatrix";
import SurveyBuilder from "./SurveyBuilder";
import MaterialityReportDemo from "./MaterialityReportDemo";
import StructuredMaterialityQuestionnaire from "./StructuredMaterialityQuestionnaire";
import { useMaterialityData } from "../hooks/useMaterialityData";
import {
  analyzeMaterialityPriority,
  validateMaterialityAssessment,
  exportForESRSReporting,
} from "../utils/materialityAnalysis";

/**
 * Componente principale per gestione completa della materialità
 * Integra matrice, survey, analisi e export secondo PDR 134:2022
 */
function MaterialityManagement({ audit, onUpdate }) {
  const [activeTab, setActiveTab] = useState("matrix");
  const [surveys, setSurveys] = useState([]);
  const [structuredResults, setStructuredResults] = useState(null);

  const {
    topics,
    threshold,
    isLoading,
    updateTopic,
    addCustomTopic,
    setThreshold,
    getMaterialityAnalysis,
  } = useMaterialityData(audit?.id);

  const analysis = getMaterialityAnalysis();
  const priorityAnalysis = analyzeMaterialityPriority(topics, threshold);
  const validation = validateMaterialityAssessment(topics, threshold);

  // Gestisce aggiornamenti alla matrice
  const handleTopicUpdate = (topicId, updates) => {
    updateTopic(topicId, updates);

    // Notifica cambiamenti all'audit parent se necessario
    if (onUpdate) {
      onUpdate({
        ...audit,
        materialityData: {
          topics: topics.map((t) =>
            t.id === topicId ? { ...t, ...updates } : t
          ),
          threshold,
          lastUpdated: new Date().toISOString(),
        },
      });
    }
  };

  // Gestisce creazione nuovo survey
  const handleSurveyCreate = (survey) => {
    setSurveys((prev) => [...prev, survey]);

    // Salva survey in localStorage
    try {
      localStorage.setItem(
        `surveys_${audit?.id}`,
        JSON.stringify([...surveys, survey])
      );
    } catch (error) {
      console.error("Errore salvataggio survey:", error);
    }
  };

  // Gestisce aggiornamento survey esistente
  const handleSurveyUpdate = (surveyId, updates) => {
    setSurveys((prev) =>
      prev.map((s) => (s.id === surveyId ? { ...s, ...updates } : s))
    );
  };

  // Export report materialità per ESRS
  const handleExportReport = () => {
    try {
      const reportData = exportForESRSReporting(
        { topics, threshold },
        {
          azienda: audit?.azienda,
          dimensione: audit?.dimensione,
          dataAvvio: audit?.dataAvvio,
        }
      );

      const blob = new Blob([JSON.stringify(reportData, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${audit?.azienda || "Azienda"}_MaterialityReport_${
        new Date().toISOString().split("T")[0]
      }.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      alert("Errore durante l'export: " + error.message);
    }
  };

  if (isLoading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <div>🔄 Caricamento analisi materialità...</div>
      </div>
    );
  }

  return (
    <div style={{ padding: "1rem" }}>
      {/* Header con navigazione */}
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
            🎯 Gestione Materialità - {audit?.azienda || "Audit"}
          </h2>
          <p
            style={{
              margin: "0.5rem 0 0 0",
              color: "#666",
              fontSize: "0.9rem",
            }}
          >
            Analisi doppia materialità secondo PDR 134:2022 • {topics.length}{" "}
            temi valutati
          </p>
        </div>

        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          {/* Indicatore completezza */}
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: "1.2rem",
                fontWeight: "bold",
                color: validation.isValid ? "#28a745" : "#ffc107",
              }}
            >
              {validation.completeness}%
            </div>
            <div style={{ fontSize: "0.8rem", color: "#666" }}>Completezza</div>
          </div>

          <button
            onClick={handleExportReport}
            style={{
              padding: "0.75rem 1.5rem",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            📄 Export Report ESRS
          </button>
        </div>
      </div>

      {/* Alert validazione se necessario */}
      {!validation.isValid && (
        <div
          style={{
            padding: "1rem",
            backgroundColor: "#fff3cd",
            border: "1px solid #ffeaa7",
            borderRadius: "6px",
            marginBottom: "1rem",
          }}
        >
          <strong>⚠️ Attenzione:</strong> Analisi materialità incompleta
          <ul style={{ margin: "0.5rem 0", paddingLeft: "1.5rem" }}>
            {validation.issues
              .filter((i) => i.severity === "ERROR")
              .map((issue, idx) => (
                <li key={idx} style={{ color: "#d32f2f" }}>
                  {issue.message}
                </li>
              ))}
          </ul>
        </div>
      )}

      {/* Navigation tabs */}
      <div style={{ display: "flex", marginBottom: "1.5rem" }}>
        {[
          {
            key: "matrix",
            label: "🎯 Matrice Materialità",
            count: `${analysis.materialTopics} materiali`,
          },
          {
            key: "survey",
            label: "📊 Survey Stakeholder",
            count: `${surveys.length} questionari`,
          },
          {
            key: "analysis",
            label: "📈 Analisi & Report",
            count: `${priorityAnalysis.critical.length} critici`,
          },
          {
            key: "word-demo",
            label: "📄 Report Word Demo",
            count: "Test con dati reali",
          },
          {
            key: "structured",
            label: "🏗️ Questionario ISO 26000",
            count: structuredResults ? "Completato" : "Da avviare",
          },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: "1rem 1.5rem",
              backgroundColor: activeTab === tab.key ? "#1976d2" : "white",
              color: activeTab === tab.key ? "white" : "#1976d2",
              border: "2px solid #1976d2",
              borderRadius: activeTab === tab.key ? "6px 6px 0 0" : "6px",
              cursor: "pointer",
              marginRight: "0.5rem",
              fontWeight: "bold",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.25rem",
            }}
          >
            <span>{tab.label}</span>
            <span style={{ fontSize: "0.8rem", opacity: 0.8 }}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Contenuto tab */}
      <div
        style={{
          backgroundColor: "white",
          borderRadius: activeTab === "matrix" ? "0 6px 6px 6px" : "6px",
          padding: "1.5rem",
          border: "2px solid #1976d2",
        }}
      >
        {activeTab === "matrix" && (
          <div>
            <MaterialityMatrix
              topics={topics}
              onTopicUpdate={handleTopicUpdate}
              onThresholdChange={setThreshold}
              threshold={threshold}
            />

            {/* Controlli aggiuntivi matrice */}
            <div
              style={{
                marginTop: "1.5rem",
                padding: "1rem",
                backgroundColor: "#f8f9fa",
                borderRadius: "6px",
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
              }}
            >
              <div>
                <h5 style={{ margin: "0 0 0.5rem 0" }}>🎛️ Gestione Temi</h5>
                <button
                  onClick={() => {
                    const name = prompt("Nome del nuovo tema:");
                    if (name) addCustomTopic(name);
                  }}
                  style={{
                    width: "100%",
                    padding: "0.5rem",
                    backgroundColor: "#17a2b8",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  + Aggiungi Tema Custom
                </button>
              </div>

              <div>
                <h5 style={{ margin: "0 0 0.5rem 0" }}>
                  📊 Statistiche Rapide
                </h5>
                <div style={{ fontSize: "0.9rem" }}>
                  <div>🔴 Critici: {priorityAnalysis.critical.length}</div>
                  <div>
                    🟡 Alto impatto: {priorityAnalysis.impactFocus.length}
                  </div>
                  <div>
                    🔵 Rilevanza finanziaria:{" "}
                    {priorityAnalysis.financialFocus.length}
                  </div>
                  <div>
                    🟢 Monitoraggio: {priorityAnalysis.monitoring.length}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "survey" && (
          <SurveyBuilder
            existingSurveys={surveys}
            onSurveyCreate={handleSurveyCreate}
            onSurveyUpdate={handleSurveyUpdate}
          />
        )}

        {activeTab === "analysis" && (
          <MaterialityAnalysisView
            analysis={priorityAnalysis}
            validation={validation}
            topics={topics}
            threshold={threshold}
          />
        )}

        {activeTab === "word-demo" && <MaterialityReportDemo />}

        {activeTab === "structured" && (
          <StructuredMaterialityQuestionnaire
            onComplete={(results) => {
              setStructuredResults(results);
              // Integra i risultati nel sistema materialità principale
              if (results.scoring && results.scoring.materialityMatrix) {
                results.scoring.materialityMatrix.forEach((item) => {
                  updateTopic(item.id, {
                    insideOutScore: item.insideOut,
                    outsideInScore: item.outsideIn,
                  });
                });
              }
            }}
            selectedThemes={topics.filter(
              (t) => t.insideOutScore > 3 || t.outsideInScore > 3
            )}
          />
        )}
      </div>
    </div>
  );
}

// Componente per visualizzazione analisi e raccomandazioni
function MaterialityAnalysisView({ analysis, validation, topics, threshold }) {
  return (
    <div>
      <h3 style={{ margin: "0 0 1.5rem 0", color: "#1976d2" }}>
        📈 Analisi Materialità e Raccomandazioni
      </h3>

      {/* Riepilogo esecutivo */}
      <div
        style={{
          padding: "1rem",
          backgroundColor: "#e3f2fd",
          borderRadius: "6px",
          marginBottom: "1.5rem",
        }}
      >
        <h4 style={{ margin: "0 0 1rem 0" }}>📋 Riepilogo Esecutivo</h4>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "1rem",
            textAlign: "center",
          }}
        >
          <div>
            <div
              style={{ fontSize: "2rem", fontWeight: "bold", color: "#d32f2f" }}
            >
              {analysis.critical.length}
            </div>
            <div style={{ fontSize: "0.9rem" }}>Temi Critici</div>
          </div>
          <div>
            <div
              style={{ fontSize: "2rem", fontWeight: "bold", color: "#f57c00" }}
            >
              {analysis.impactFocus.length}
            </div>
            <div style={{ fontSize: "0.9rem" }}>Focus Impatto</div>
          </div>
          <div>
            <div
              style={{ fontSize: "2rem", fontWeight: "bold", color: "#1976d2" }}
            >
              {analysis.financialFocus.length}
            </div>
            <div style={{ fontSize: "0.9rem" }}>Rilevanza Finanziaria</div>
          </div>
          <div>
            <div
              style={{ fontSize: "2rem", fontWeight: "bold", color: "#689f38" }}
            >
              {analysis.monitoring.length}
            </div>
            <div style={{ fontSize: "0.9rem" }}>Monitoraggio</div>
          </div>
        </div>
      </div>

      {/* Raccomandazioni */}
      <div style={{ marginBottom: "1.5rem" }}>
        <h4 style={{ margin: "0 0 1rem 0" }}>🎯 Raccomandazioni Strategiche</h4>
        {analysis.recommendations.map((rec, idx) => (
          <div
            key={idx}
            style={{
              marginBottom: "1rem",
              padding: "1rem",
              border: "1px solid #ddd",
              borderRadius: "6px",
              backgroundColor:
                rec.priority === "IMMEDIATE"
                  ? "#ffebee"
                  : rec.priority === "HIGH"
                  ? "#fff3e0"
                  : "#f3e5f5",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "0.5rem",
              }}
            >
              <h5 style={{ margin: 0 }}>{rec.title}</h5>
              <span
                style={{
                  padding: "0.25rem 0.5rem",
                  backgroundColor:
                    rec.priority === "IMMEDIATE"
                      ? "#d32f2f"
                      : rec.priority === "HIGH"
                      ? "#f57c00"
                      : "#9c27b0",
                  color: "white",
                  borderRadius: "4px",
                  fontSize: "0.8rem",
                }}
              >
                {rec.priority}
              </span>
            </div>
            <p style={{ margin: "0 0 0.75rem 0", color: "#666" }}>
              {rec.description}
            </p>
            <ul style={{ margin: 0, paddingLeft: "1.5rem" }}>
              {rec.actions.map((action, actionIdx) => (
                <li key={actionIdx} style={{ marginBottom: "0.25rem" }}>
                  {action}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Dettaglio per quadrante */}
      <div>
        <h4 style={{ margin: "0 0 1rem 0" }}>📊 Dettaglio per Quadrante</h4>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1rem",
          }}
        >
          {[
            {
              key: "critical",
              data: analysis.critical,
              title: "Temi Critici",
              color: "#d32f2f",
            },
            {
              key: "impactFocus",
              data: analysis.impactFocus,
              title: "Focus Impatto",
              color: "#f57c00",
            },
            {
              key: "financialFocus",
              data: analysis.financialFocus,
              title: "Rilevanza Finanziaria",
              color: "#1976d2",
            },
            {
              key: "monitoring",
              data: analysis.monitoring,
              title: "Monitoraggio",
              color: "#689f38",
            },
          ].map((quadrant) => (
            <div
              key={quadrant.key}
              style={{
                padding: "1rem",
                border: `2px solid ${quadrant.color}`,
                borderRadius: "6px",
                backgroundColor: "white",
              }}
            >
              <h5 style={{ margin: "0 0 1rem 0", color: quadrant.color }}>
                {quadrant.title} ({quadrant.data.length})
              </h5>
              {quadrant.data.length > 0 ? (
                <div style={{ fontSize: "0.9rem" }}>
                  {quadrant.data.map((topic, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: "0.5rem",
                        marginBottom: "0.5rem",
                        backgroundColor: "#f8f9fa",
                        borderRadius: "4px",
                        borderLeft: `3px solid ${quadrant.color}`,
                      }}
                    >
                      <div style={{ fontWeight: "bold" }}>{topic.name}</div>
                      <div style={{ fontSize: "0.8rem", color: "#666" }}>
                        Impatto: {topic.impactScore}/5 • Finanziario:{" "}
                        {topic.financialScore}/5
                      </div>
                      <div style={{ fontSize: "0.8rem", marginTop: "0.25rem" }}>
                        {topic.action}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  style={{
                    color: "#666",
                    fontStyle: "italic",
                    textAlign: "center",
                  }}
                >
                  Nessun tema in questo quadrante
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MaterialityManagement;
