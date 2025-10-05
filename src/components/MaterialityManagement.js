import React, { useState } from "react";
import MaterialityMatrix from "./MaterialityMatrix";
import SurveyBuilder from "./SurveyBuilder";
import StructuredMaterialityQuestionnaire from "./StructuredMaterialityQuestionnaire";
import { integrateISO26000Results } from "../utils/materialityIntegration";
import { useMaterialityData } from "../hooks/useMaterialityData";
import {
  analyzeMaterialityPriority,
  validateMaterialityAssessment,
  exportForESRSReporting,
} from "../utils/materialityAnalysis";

// Helper functions per export Word
function getTopicQuadrant(topic, threshold) {
  const insideOut = topic.insideOutScore ?? topic.impactScore ?? 0;
  const outsideIn = topic.outsideInScore ?? topic.financialScore ?? 0;

  if (insideOut >= threshold && outsideIn >= threshold)
    return "Q1_HIGH_MATERIALITY";
  if (insideOut >= threshold && outsideIn < threshold) return "Q2_IMPACT_FOCUS";
  if (insideOut < threshold && outsideIn < threshold)
    return "Q3_LOW_MATERIALITY";
  return "Q4_FINANCIAL_FOCUS";
}

function generateMaterialityRecommendations(topics, threshold) {
  const criticalTopics = topics.filter(
    (t) =>
      (t.insideOutScore ?? t.impactScore ?? 0) >= threshold &&
      (t.outsideInScore ?? t.financialScore ?? 0) >= threshold
  );

  return {
    immediate: criticalTopics
      .slice(0, 3)
      .map(
        (t) =>
          `Priorità massima per ${t.name}: sviluppare piano di gestione integrato`
      ),
    strategic: criticalTopics
      .slice(3, 6)
      .map(
        (t) =>
          `Pianificare interventi strategici per ${t.name} nel medio termine`
      ),
    monitoring: topics
      .filter(
        (t) =>
          (t.insideOutScore ?? t.impactScore ?? 0) < threshold &&
          (t.outsideInScore ?? t.financialScore ?? 0) < threshold
      )
      .slice(0, 3)
      .map((t) => `Monitoraggio continuo per ${t.name} con review annuale`),
  };
}

async function generateWordReportWithMateriality(snapshot) {
  // Per ora generiamo un report HTML avanzato che simula il Word
  // TODO: Integrare con template Word reale
  const reportHTML = generateMaterialityReportHTML(snapshot);

  const blob = new Blob([reportHTML], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${snapshot.meta.azienda || "Azienda"}_Report_Materialita_${
    new Date().toISOString().split("T")[0]
  }.html`;
  a.click();
  URL.revokeObjectURL(url);
}

function generateMaterialityReportHTML(snapshot) {
  const { meta, materiality, recommendations } = snapshot;

  return `<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <title>Report Materialità - ${meta.azienda}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 2cm; line-height: 1.6; }
    h1, h2, h3 { color: #1976d2; }
    .matrix { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0; }
    .quadrant { padding: 15px; border-radius: 8px; }
    .q1 { background: #ffebee; border: 2px solid #d32f2f; }
    .q2 { background: #fff3e0; border: 2px solid #f57c00; }
    .q3 { background: #e8f5e8; border: 2px solid #689f38; }
    .q4 { background: #e3f2fd; border: 2px solid #1976d2; }
    .topic { margin: 5px 0; padding: 5px; background: white; border-radius: 4px; }
    .recommendations { background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0; }
  </style>
</head>
<body>
  <h1>📊 Report di Materialità ESG</h1>
  <h2>${meta.azienda} - ${meta.dimensione}</h2>
  <p><strong>Data generazione:</strong> ${new Date(
    meta.timestamp
  ).toLocaleDateString("it-IT")}</p>
  
  <h2>📈 Executive Summary</h2>
  <p>L'analisi di materialità ha identificato <strong>${
    materiality.analysis.materialTopics
  }</strong> temi materiali su ${materiality.analysis.totalTopics} analizzati, 
  per un tasso di materialità del <strong>${Math.round(
    materiality.analysis.materialityRate
  )}%</strong>.</p>
  
  <h2>🎯 Matrice di Materialità</h2>
  <p>Soglia di materialità: <strong>${materiality.threshold}/5.0</strong></p>
  
  <div class="matrix">
    <div class="quadrant q1">
      <h3>🔴 ALTA MATERIALITÀ</h3>
      <p><strong>Impatto Alto + Rilevanza Finanziaria Alta</strong></p>
      ${materiality.topics
        .filter((t) => t.quadrant === "Q1_HIGH_MATERIALITY")
        .map(
          (t) =>
            `<div class="topic">${t.name} (${
              t.insideOutScore ?? t.impactScore
            }/${t.outsideInScore ?? t.financialScore})</div>`
        )
        .join("")}
    </div>
    
    <div class="quadrant q2">
      <h3>🟠 FOCUS IMPATTO</h3>
      <p><strong>Impatto Alto + Rilevanza Finanziaria Bassa</strong></p>
      ${materiality.topics
        .filter((t) => t.quadrant === "Q2_IMPACT_FOCUS")
        .map(
          (t) =>
            `<div class="topic">${t.name} (${
              t.insideOutScore ?? t.impactScore
            }/${t.outsideInScore ?? t.financialScore})</div>`
        )
        .join("")}
    </div>
    
    <div class="quadrant q4">
      <h3>🔵 RILEVANZA FINANZIARIA</h3>
      <p><strong>Impatto Basso + Rilevanza Finanziaria Alta</strong></p>
      ${materiality.topics
        .filter((t) => t.quadrant === "Q4_FINANCIAL_FOCUS")
        .map(
          (t) =>
            `<div class="topic">${t.name} (${
              t.insideOutScore ?? t.impactScore
            }/${t.outsideInScore ?? t.financialScore})</div>`
        )
        .join("")}
    </div>
    
    <div class="quadrant q3">
      <h3>🟢 MONITORAGGIO</h3>
      <p><strong>Impatto Basso + Rilevanza Finanziaria Bassa</strong></p>
      ${materiality.topics
        .filter((t) => t.quadrant === "Q3_LOW_MATERIALITY")
        .map(
          (t) =>
            `<div class="topic">${t.name} (${
              t.insideOutScore ?? t.impactScore
            }/${t.outsideInScore ?? t.financialScore})</div>`
        )
        .join("")}
    </div>
  </div>
  
  <div class="recommendations">
    <h2>🎯 Raccomandazioni Strategiche</h2>
    
    <h3>⚡ Azioni Immediate</h3>
    <ul>${recommendations.immediate.map((r) => `<li>${r}</li>`).join("")}</ul>
    
    <h3>📊 Azioni Strategiche</h3>
    <ul>${recommendations.strategic.map((r) => `<li>${r}</li>`).join("")}</ul>
    
    <h3>👁️ Monitoraggio</h3>
    <ul>${recommendations.monitoring.map((r) => `<li>${r}</li>`).join("")}</ul>
  </div>
  
  <hr>
  <p style="font-size: 0.9em; color: #666;">
    Report generato automaticamente dal sistema ESRS PWA - ${new Date().toLocaleString(
      "it-IT"
    )}
  </p>
</body>
</html>`;
}

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

  // Export Word completo con analisi materialità e evidenze
  const handleExportWordWithMateriality = async () => {
    try {
      console.log("🚀 Avvio export Word con materialità...");

      // Prepara snapshot completo con dati materialità
      const materialitySnapshot = {
        meta: {
          version: "2.0",
          schemaVersion: "1.0",
          timestamp: new Date().toISOString(),
          auditId: audit?.id,
          azienda: audit?.azienda,
          dimensione: audit?.dimensione,
        },
        materiality: {
          topics: topics.map((topic) => ({
            ...topic,
            isMaterial:
              topic.insideOutScore >= threshold ||
              topic.outsideInScore >= threshold,
            quadrant: getTopicQuadrant(topic, threshold),
          })),
          threshold,
          analysis: getMaterialityAnalysis(),
          priorityAnalysis,
          validation,
          structuredResults,
        },
        audit: audit || {},
        surveys,
        recommendations: generateMaterialityRecommendations(topics, threshold),
      };

      // Crea report Word avanzato
      await generateWordReportWithMateriality(materialitySnapshot);

      console.log("✅ Export Word completato con successo!");
    } catch (error) {
      console.error("❌ Errore nell'export Word:", error);
      throw error;
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

          <div style={{ display: "flex", gap: "0.5rem" }}>
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
              � Export JSON
            </button>
            <button
              onClick={async () => {
                try {
                  // Genera report Word completo con materialità ed evidenze
                  await handleExportWordWithMateriality();
                } catch (error) {
                  console.error("❌ Errore export Word:", error);
                  alert("Errore durante l'export Word: " + error.message);
                }
              }}
              style={{
                padding: "0.75rem 1.5rem",
                backgroundColor: "#1976d2",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              📄 Export Word + Materialità
            </button>
          </div>
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
            label: "� Stakeholder Engagement",
            count: `${surveys.length} survey + validation`,
          },
          {
            key: "analysis",
            label: "📈 Analisi & Report",
            count: `${priorityAnalysis.critical.length} critici`,
          },

          {
            key: "structured",
            label: "� Questionario Materialità",
            count: structuredResults ? "✅ Completato" : "📝 Configura ora",
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

            {/* Gestione Temi Custom */}
            <div
              style={{
                padding: "1rem",
                backgroundColor: "#ffeb3b",
                margin: "1rem 0",
                borderRadius: "4px",
              }}
            >
              <strong>DEBUG:</strong> Total topics: {topics.length}, Custom
              topics: {topics.filter((t) => t.isCustom).length}
              <br />
              Custom found: {topics.some((t) => t.isCustom) ? "YES" : "NO"}
            </div>
            {topics.some((t) => t.isCustom) && (
              <div
                style={{
                  backgroundColor: "#f8f9fa",
                  padding: "1rem",
                  borderRadius: "6px",
                  marginTop: "1rem",
                  border: "1px solid #dee2e6",
                }}
              >
                <h5 style={{ margin: "0 0 1rem 0", color: "#495057" }}>
                  🎨 Gestione Temi Custom
                </h5>
                <div style={{ display: "grid", gap: "0.5rem" }}>
                  {topics
                    .filter((t) => t.isCustom)
                    .map((topic) => (
                      <div
                        key={topic.id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "0.75rem",
                          backgroundColor: "white",
                          borderRadius: "4px",
                          border: "1px solid #e9ecef",
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          <div
                            style={{ fontWeight: "bold", fontSize: "0.9rem" }}
                          >
                            {topic.name}
                          </div>
                          {topic.description && (
                            <div
                              style={{
                                fontSize: "0.8rem",
                                color: "#666",
                                marginTop: "0.25rem",
                              }}
                            >
                              {topic.description}
                            </div>
                          )}
                          <div
                            style={{
                              fontSize: "0.8rem",
                              color: "#28a745",
                              marginTop: "0.25rem",
                            }}
                          >
                            Impact: {topic.impactScore || 0}/5 • Financial:{" "}
                            {topic.financialScore || 0}/5
                          </div>
                        </div>

                        <div
                          style={{
                            display: "flex",
                            gap: "0.5rem",
                            alignItems: "center",
                          }}
                        >
                          <button
                            onClick={() => {
                              const desc = prompt(
                                "Descrizione tema:",
                                topic.description || ""
                              );
                              if (desc !== null) {
                                handleTopicUpdate(topic.id, {
                                  description: desc,
                                });
                              }
                            }}
                            style={{
                              padding: "0.25rem 0.5rem",
                              fontSize: "0.8rem",
                              backgroundColor: "#007bff",
                              color: "white",
                              border: "none",
                              borderRadius: "3px",
                              cursor: "pointer",
                            }}
                          >
                            📝 Desc
                          </button>

                          <button
                            onClick={() => {
                              if (
                                window.confirm(
                                  `Eliminare il tema custom "${topic.name}"?`
                                )
                              ) {
                                // Per ora commento l'eliminazione dato che removeTopic non è ancora implementato nell'UI
                                console.log(
                                  "🗑️ Eliminazione tema custom:",
                                  topic.name
                                );
                                alert("Funzione eliminazione in sviluppo");
                              }
                            }}
                            style={{
                              padding: "0.25rem 0.5rem",
                              fontSize: "0.8rem",
                              backgroundColor: "#dc3545",
                              color: "white",
                              border: "none",
                              borderRadius: "3px",
                              cursor: "pointer",
                            }}
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
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

        {activeTab === "structured" && (
          <StructuredMaterialityQuestionnaire
            onComplete={(results) => {
              console.log("🎯 Questionario completato, risultati:", results);
              setStructuredResults(results);

              // Verifica presenza dati scoring
              if (!results?.scoring?.themeScores) {
                console.error(
                  "❌ Nessun dato di scoring trovato nei risultati"
                );
                alert("Errore: Risultati questionario incompleti. Riprova.");
                return;
              }

              console.log(
                "📊 Theme scores trovati:",
                results.scoring.themeScores
              );
              console.log(
                "📊 Topic attuali matrice PRIMA dell'integrazione:",
                topics.map((t) => ({
                  id: t.id,
                  name: t.name,
                  inside: t.insideOutScore ?? t.impactScore,
                  outside: t.outsideInScore ?? t.financialScore,
                }))
              );

              // Integra i risultati ISO 26000 con i topic della matrice esistente
              try {
                const updatedTopics = integrateISO26000Results(results, topics);
                console.log(
                  "🔄 Topic aggiornati dall'integrazione:",
                  updatedTopics
                );

                let updatedCount = 0;
                const topicsToUpdate = [];

                // Identifica tutti i topic da aggiornare
                updatedTopics.forEach((updatedTopic) => {
                  const existingTopic = topics.find(
                    (t) => t.id === updatedTopic.id
                  );
                  if (
                    existingTopic &&
                    (updatedTopic.insideOutScore !==
                      existingTopic.insideOutScore ||
                      updatedTopic.outsideInScore !==
                        existingTopic.outsideInScore)
                  ) {
                    console.log(
                      `📝 Preparando aggiornamento topic ${updatedTopic.id}:`,
                      {
                        old: {
                          inside: existingTopic.insideOutScore,
                          outside: existingTopic.outsideInScore,
                        },
                        new: {
                          inside: updatedTopic.insideOutScore,
                          outside: updatedTopic.outsideInScore,
                        },
                      }
                    );

                    topicsToUpdate.push({
                      id: updatedTopic.id,
                      updates: {
                        insideOutScore: updatedTopic.insideOutScore,
                        outsideInScore: updatedTopic.outsideInScore,
                        isoThemeMapping: updatedTopic.isoThemeMapping,
                        lastISOUpdate: updatedTopic.lastISOUpdate,
                      },
                    });
                    updatedCount++;
                  }
                });

                // Aggiornamento batch di tutti i topic
                if (topicsToUpdate.length > 0) {
                  console.log(
                    `🔄 Eseguendo aggiornamento batch di ${topicsToUpdate.length} topic...`
                  );
                  topicsToUpdate.forEach(({ id, updates }) => {
                    updateTopic(id, updates);
                  });

                  // Forza re-render forzando aggiornamento dello stato
                  setTimeout(() => {
                    console.log("🔄 Forzando refresh della matrice...");
                    // Trigger re-render forzato
                    setActiveTab("matrix"); // Assicura che siamo sul tab corretto
                  }, 100);
                }

                console.log(
                  `✅ Integrazione ISO 26000 completata: ${updatedCount} topic effettivamente aggiornati`
                );

                // Controllo finale: stato topic DOPO aggiornamento
                setTimeout(() => {
                  console.log(
                    "📊 Topic matrice DOPO integrazione:",
                    topics.map((t) => ({
                      id: t.id,
                      name: t.name,
                      inside: t.insideOutScore ?? t.impactScore,
                      outside: t.outsideInScore ?? t.financialScore,
                      updated: t.lastISOUpdate ? "✅" : "❌",
                    }))
                  );
                }, 500);

                if (updatedCount > 0) {
                  alert(
                    `✅ Matrice aggiornata con successo!\n${updatedCount} topic sono stati aggiornati con i dati del questionario ISO 26000.`
                  );
                } else {
                  alert(
                    "⚠️ Nessun topic aggiornato. Verifica la mappatura dei temi."
                  );
                }
              } catch (error) {
                console.error("❌ Errore nell'integrazione:", error);
                alert(
                  "Errore nell'aggiornamento della matrice: " + error.message
                );
              }
            }}
            selectedThemes={topics.filter(
              (t) => t.insideOutScore > 3 || t.outsideInScore > 3
            )}
            audit={audit}
            onUpdate={onUpdate}
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
