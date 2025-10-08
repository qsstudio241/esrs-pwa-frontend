/* eslint-disable unicode-bom */
import React, { useState, useMemo } from "react";
import MaterialityMatrix from "./MaterialityMatrix";
import StructuredMaterialityQuestionnaire from "./StructuredMaterialityQuestionnaire";
import { integrateISO26000Results } from "../utils/materialityIntegration";
import { useMaterialityData } from "../hooks/useMaterialityData";
import { analyzeMaterialityPriority } from "../utils/materialityAnalysis";
import { getAllESRSMandatoryThemes } from "../utils/materialityFrameworkISO26000";

function MaterialityManagement({ audit, onUpdate }) {
  const [activeTab, setActiveTab] = useState("matrix");
  const [structuredResults, setStructuredResults] = useState(null);
  const materialityData = useMaterialityData(audit?.id || "default");

  const analysis = useMemo(() => {
    const topics = materialityData.topics || [];
    const threshold = materialityData.threshold || 3;

    return analyzeMaterialityPriority(topics, threshold);
  }, [materialityData.topics, materialityData.threshold]);

  const renderContent = () => {
    switch (activeTab) {
      case "matrix":
        return (
          <div>
            <MaterialityMatrix
              audit={audit}
              onUpdate={onUpdate}
              topics={materialityData.topics}
              onTopicUpdate={materialityData.updateTopic}
              threshold={materialityData.threshold}
              onThresholdChange={materialityData.setThreshold}
            />
          </div>
        );

      case "survey":
        return (
          <div style={{ padding: "20px", textAlign: "center" }}>
            <h3>🔧 Stakeholder Engagement</h3>
            <div
              style={{
                background: "#f8f9fa",
                padding: "20px",
                borderRadius: "8px",
                margin: "20px 0",
              }}
            >
              <p>Modulo stakeholder temporaneamente semplificato</p>
              <p>La matrice di materialità è completamente funzionale</p>
            </div>
          </div>
        );

      case "structured":
        return (
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
                materialityData.topics.map((t) => ({
                  id: t.id,
                  name: t.name,
                  inside: t.insideOutScore ?? t.impactScore,
                  outside: t.outsideInScore ?? t.financialScore,
                }))
              );

              // Integra i risultati ISO 26000 con i topic della matrice esistente
              try {
                const updatedTopics = integrateISO26000Results(
                  results,
                  materialityData.topics
                );
                console.log(
                  "🔄 Topic aggiornati dall'integrazione:",
                  updatedTopics
                );

                let updatedCount = 0;

                // Aggiornamento dei topic uno per uno
                updatedTopics.forEach((updatedTopic) => {
                  const existingTopic = materialityData.topics.find(
                    (t) => t.id === updatedTopic.id
                  );
                  if (
                    existingTopic &&
                    (updatedTopic.insideOutScore !==
                      existingTopic.insideOutScore ||
                      updatedTopic.outsideInScore !==
                        existingTopic.outsideInScore)
                  ) {
                    console.log(`📝 Aggiornando topic ${updatedTopic.id}:`, {
                      old: {
                        inside: existingTopic.insideOutScore,
                        outside: existingTopic.outsideInScore,
                      },
                      new: {
                        inside: updatedTopic.insideOutScore,
                        outside: updatedTopic.outsideInScore,
                      },
                    });

                    materialityData.updateTopic(updatedTopic.id, {
                      insideOutScore: updatedTopic.insideOutScore,
                      outsideInScore: updatedTopic.outsideInScore,
                      isoThemeMapping: updatedTopic.isoThemeMapping,
                      lastISOUpdate: updatedTopic.lastISOUpdate,
                    });
                    updatedCount++;
                  }
                });

                console.log(
                  `✅ Integrazione ISO 26000 completata: ${updatedCount} topic aggiornati`
                );

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
            selectedThemes={getAllESRSMandatoryThemes()}
            audit={audit}
            onUpdate={onUpdate}
          />
        );

      case "analysis":
        return (
          <div style={{ padding: "20px" }}>
            <h3>📊 Analisi Materialità</h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "15px",
                margin: "20px 0",
              }}
            >
              <div
                style={{
                  background: "#e3f2fd",
                  padding: "15px",
                  borderRadius: "8px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: "24px",
                    fontWeight: "bold",
                    color: "#1976d2",
                  }}
                >
                  {analysis.materialTopics || 0}
                </div>
                <div>Temi Materiali</div>
              </div>

              <div
                style={{
                  background: "#f3e5f5",
                  padding: "15px",
                  borderRadius: "8px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: "24px",
                    fontWeight: "bold",
                    color: "#7b1fa2",
                  }}
                >
                  {analysis.totalTopics || 0}
                </div>
                <div>Totale Temi</div>
              </div>

              <div
                style={{
                  background: "#e8f5e8",
                  padding: "15px",
                  borderRadius: "8px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: "24px",
                    fontWeight: "bold",
                    color: "#388e3c",
                  }}
                >
                  {analysis.completionRate || 0}%
                </div>
                <div>Completion Rate</div>
              </div>
            </div>

            <div style={{ marginTop: "30px" }}>
              <h4>Raccomandazioni</h4>
              <ul
                style={{
                  textAlign: "left",
                  maxWidth: "600px",
                  margin: "0 auto",
                }}
              >
                <li>Completa la matrice di materialità nel tab principale</li>
                <li>
                  Identifica i temi con impact score e financial score ≥ 3
                </li>
                <li>Documenta la metodologia di valutazione utilizzata</li>
                <li>Coinvolgi stakeholder chiave nella validazione</li>
              </ul>
            </div>
          </div>
        );

      default:
        return <div>Tab non trovato</div>;
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <div style={{ marginBottom: "2rem", textAlign: "center" }}>
        <h2 style={{ color: "#1976d2" }}>🎯 Analisi di Materialità</h2>
        <p style={{ color: "#666", margin: "0.5rem 0" }}>
          Identificazione e valutazione degli impatti ESG materiali secondo ESRS
          1
        </p>
      </div>

      <div
        style={{
          display: "flex",
          marginBottom: "1rem",
          borderBottom: "2px solid #e9ecef",
          justifyContent: "center",
          gap: "4px",
        }}
      >
        {[
          {
            key: "matrix",
            label: "🎯 Matrice Materialità",
            count: `${analysis.materialTopics || 0} materiali`,
          },
          {
            key: "structured",
            label: "📋 Temi ESRS Obbligatori",
            count: structuredResults ? "✅ Completato" : "📝 Configura ora",
          },
          {
            key: "survey",
            label: "� Stakeholder",
            count: "Semplificato",
          },
          {
            key: "analysis",
            label: "📈 Analisi",
            count: `${analysis.completionRate || 0}% completo`,
          },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: "0.75rem 1.5rem",
              backgroundColor: activeTab === tab.key ? "#1976d2" : "white",
              color: activeTab === tab.key ? "white" : "#1976d2",
              border: "2px solid #1976d2",
              borderBottom: "none",
              borderRadius: "6px 6px 0 0",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "14px",
            }}
          >
            <div>{tab.label}</div>
            <div style={{ fontSize: "12px", opacity: 0.8 }}>{tab.count}</div>
          </button>
        ))}
      </div>

      <div
        style={{
          minHeight: "400px",
          backgroundColor: "#fff",
          border: "1px solid #ddd",
          borderRadius: "0 0 8px 8px",
          padding: "1rem",
        }}
      >
        {renderContent()}
      </div>
    </div>
  );
}

export default MaterialityManagement;
