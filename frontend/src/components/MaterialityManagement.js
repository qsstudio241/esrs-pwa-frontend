/* eslint-disable unicode-bom */
import React, { useState, useEffect } from "react";
import StructuredMaterialityQuestionnaire from "./StructuredMaterialityQuestionnaire";
import FinancialMaterialityAssessment from "./FinancialMaterialityAssessment";
import DoubleMaterialityMatrix from "./DoubleMaterialityMatrix";
import ESRSSDGMapping from "./ESRSSDGMapping";
import { integrateISO26000Results } from "../utils/materialityIntegration";
import { useMaterialityData } from "../hooks/useMaterialityData";
import { getAllESRSMandatoryThemes } from "../utils/materialityFrameworkISO26000";
import { useStorage } from "../storage/StorageContext";
import {
  createExportPayload,
  exportWithFallback,
} from "../utils/exportHelper";

function MaterialityManagement({ audit, onUpdate }) {
  const [activeTab, setActiveTab] = useState("structured");
  const [structuredResults, setStructuredResults] = useState(null);
  const [financialResults, setFinancialResults] = useState(null);
  const [showThresholdConfig, setShowThresholdConfig] = useState(false);
  const materialityData = useMaterialityData(audit?.id || "default");

  // Hook per accesso File System Provider
  const fsProvider = useStorage();

  // ✅ STEP 1: Ri-idrata stato locale da audit quando componente monta
  useEffect(() => {
    if (audit?.structuredResults) {
      console.log("🔄 Ripristino risultati ISO 26000 da audit:", audit.structuredResults);
      setStructuredResults(audit.structuredResults);
    }

    if (audit?.financialAssessment) {
      console.log("🔄 Ripristino analisi finanziaria da audit:", audit.financialAssessment);
      setFinancialResults(audit.financialAssessment);
    }

    // Debug completo stato
    console.log("🔍 DEBUG MaterialityManagement - Stato corrente:", {
      hasAudit: !!audit,
      hasStructuredResults: !!audit?.structuredResults,
      hasImpactScores: !!audit?.impactScores,
      hasFinancialAssessment: !!audit?.financialAssessment,
      localStructuredResults: !!structuredResults,
      localFinancialResults: !!financialResults,
    });
  }, [audit?.structuredResults, audit?.financialAssessment]);

  const renderContent = () => {
    switch (activeTab) {
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

              // ✅ STEP 2: SALVA NELL'OGGETTO AUDIT
              const updatedAudit = {
                ...audit,
                structuredResults: results, // Risultati completi questionario
                impactScores: results.scoring.themeScores, // Scores per tema (per compatibilità)
                isoQuestionnaireCompleted: true,
                isoCompletedAt: new Date().toISOString(),
              };

              // ✅ PROPAGA AGGIORNAMENTO A COMPONENTE PADRE
              if (onUpdate) {
                onUpdate(updatedAudit);
                console.log("✅ Audit aggiornato con risultati ISO 26000");
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

                  console.log(`🔍 Verificando topic ${updatedTopic.id}:`, {
                    exists: !!existingTopic,
                    hasISOMapping: !!updatedTopic.isoThemeMapping,
                    newScores: {
                      inside: updatedTopic.insideOutScore,
                      outside: updatedTopic.outsideInScore,
                    },
                    oldScores: existingTopic ? {
                      inside: existingTopic.insideOutScore,
                      outside: existingTopic.outsideInScore,
                    } : null
                  });

                  // Aggiorna se ha mappatura ISO (indipendentemente dai valori precedenti)
                  if (existingTopic && updatedTopic.isoThemeMapping) {
                    console.log(`📝 Aggiornando topic ${updatedTopic.id}:`, {
                      old: {
                        inside: existingTopic.insideOutScore,
                        outside: existingTopic.outsideInScore,
                      },
                      new: {
                        inside: updatedTopic.insideOutScore,
                        outside: updatedTopic.outsideInScore,
                      },
                      isoMapping: updatedTopic.isoThemeMapping,
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

      case "financial":
        // ✅ STEP 3: LEGGI DA AUDIT.IMPACTSCORES (non più da state locale volatile)
        const themesForFinancial = audit?.impactScores
          ? Object.keys(audit.impactScores).map(
            (themeName) => ({
              id: themeName,
              name: themeName,
              impactScore: audit.impactScores[themeName].score,
            })
          )
          : [];

        console.log("💰 Temi estratti per analisi finanziaria (da audit):", themesForFinancial);

        // Se non ci sono temi, mostra messaggio informativo
        if (themesForFinancial.length === 0) {
          return (
            <div style={{ padding: "40px", textAlign: "center" }}>
              <h3>⚠️ Nessun tema da analizzare</h3>
              <p style={{ color: "#666", marginBottom: "20px", maxWidth: "500px", margin: "0 auto" }}>
                Per procedere con l'analisi finanziaria devi prima completare il
                questionario ISO 26000 nel tab "📋 Temi ISO 26000".
              </p>
              <div style={{ marginTop: "30px" }}>
                <button
                  onClick={() => setActiveTab("structured")}
                  style={{
                    padding: "12px 24px",
                    backgroundColor: "#1976d2",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontWeight: "bold",
                    fontSize: "14px",
                  }}
                >
                  ▶️ Vai al Questionario ISO 26000
                </button>
              </div>
            </div>
          );
        }

        return (
          <FinancialMaterialityAssessment
            selectedThemes={themesForFinancial}
            existingAssessment={audit?.financialAssessment}
            audit={audit}
            onComplete={(results) => {
              console.log("💰 Analisi finanziaria completata:", results);
              setFinancialResults(results);

              // ✅ STEP 3: SALVA NELL'AUDIT con flag completamento
              if (onUpdate) {
                onUpdate({
                  ...audit,
                  financialAssessment: results,
                  financialAnalysisCompleted: true,
                  financialCompletedAt: new Date().toISOString(),
                });
                console.log("✅ Audit aggiornato con analisi finanziaria");
              }

              // Passa automaticamente alla matrice doppia
              setActiveTab("double");
            }}
            onUpdate={(partialResults) => {
              // Salvataggio automatico progressivo
              if (onUpdate && audit) {
                onUpdate({
                  ...audit,
                  financialAssessment: partialResults,
                });
              }
            }}
          />
        );

      case "double":
        // Estrai scores da risultati precedenti
        const impactScores = {};
        const financialScores = {};
        const themesForMatrix = [];

        if (structuredResults?.scoring?.themeScores) {
          Object.entries(structuredResults.scoring.themeScores).forEach(
            ([themeId, data]) => {
              impactScores[themeId] = data.score;
              // Aggiungi tema all'array per la matrice
              themesForMatrix.push({
                id: themeId,
                name: themeId,
                impactScore: data.score,
              });
            }
          );
        }

        if (financialResults?.financialScores || audit?.financialAssessment?.financialScores) {
          Object.assign(
            financialScores,
            financialResults?.financialScores || audit?.financialAssessment?.financialScores
          );
        }

        console.log("📊 Matrice doppia - Impact scores:", impactScores);
        console.log("📊 Matrice doppia - Financial scores:", financialScores);
        console.log("📊 Matrice doppia - Temi:", themesForMatrix);

        return (
          <div>
            {themesForMatrix.length === 0 ? (
              <div style={{ padding: "40px", textAlign: "center" }}>
                <h3>⚠️ Completa prima le analisi precedenti</h3>
                <p style={{ color: "#666", marginBottom: "20px" }}>
                  Per visualizzare la matrice doppia materialità devi prima:
                </p>
                <ol
                  style={{
                    textAlign: "left",
                    maxWidth: "400px",
                    margin: "0 auto",
                  }}
                >
                  <li>Completare il questionario ISO 26000 (tab "Temi ISO 26000")</li>
                  <li>Completare l'analisi rischi/opportunità finanziaria (tab "💰 Analisi Finanziaria")</li>
                </ol>
                <div style={{ marginTop: "20px" }}>
                  <button
                    onClick={() => setActiveTab("structured")}
                    style={{
                      padding: "12px 24px",
                      backgroundColor: "#1976d2",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      marginRight: "10px",
                    }}
                  >
                    Vai a ISO 26000
                  </button>
                  {structuredResults && (
                    <button
                      onClick={() => setActiveTab("financial")}
                      style={{
                        padding: "12px 24px",
                        backgroundColor: "#4caf50",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      Vai ad Analisi Finanziaria
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <DoubleMaterialityMatrix
                impactScores={impactScores}
                financialScores={financialScores}
                themes={themesForMatrix}
                threshold={materialityData.threshold || 3.0}
                audit={audit}
                onThemeClick={(theme) => {
                  console.log("Tema selezionato:", theme);
                }}
                exclusionJustifications={audit?.materialityExclusions || {}}
                onJustificationUpdate={(justifications) => {
                  console.log("💾 Salvando giustificazioni:", justifications);
                  if (onUpdate && audit) {
                    const updatedAudit = {
                      ...audit,
                      materialityExclusions: justifications,
                    };
                    onUpdate(updatedAudit);
                    alert(
                      `✅ Giustificazioni salvate con successo!\n\nTemi giustificati: ${Object.keys(justifications).filter(k => justifications[k]?.trim()).length}`
                    );
                  }
                }}
              />
            )}
          </div>
        );

      case "esrs":
        // Estrai temi materiali dal quadrante verde (doppiamente materiali)
        const materialThemesForESRS = [];
        const themeToESRSMapping = {};

        if (structuredResults?.scoring?.themeScores && (financialResults?.financialScores || audit?.financialAssessment?.financialScores)) {
          const threshold = materialityData.threshold || 3.0;
          const finScores = financialResults?.financialScores || audit?.financialAssessment?.financialScores || {};

          Object.entries(structuredResults.scoring.themeScores).forEach(
            ([themeId, data]) => {
              const impactScore = data.score;
              const financialScore = finScores[themeId] || 0;

              // Solo temi doppiamente materiali (quadrante verde)
              if (impactScore >= threshold && financialScore >= threshold) {
                materialThemesForESRS.push({
                  id: themeId,
                  name: themeId,
                  impactScore,
                  financialScore,
                });

                // Mapping tema → ESRS (usa integrazione esistente)
                // In questa versione semplificata, usa il mapping ISO → ESRS
                themeToESRSMapping[themeId] = themeId; // Sarà mappato in ESRSSDGMapping
              }
            }
          );
        }

        const handleESRSExport = async (exportData) => {
          try {
            console.log("📄 Export ESRS + Goal ONU:", exportData);

            // Crea payload standardizzato
            const payload = createExportPayload(
              "esrs_sdg_mapping",
              exportData,
              audit
            );

            // Export con fallback automatico
            await exportWithFallback(fsProvider, "mapping", payload, {
              azienda: audit?.azienda,
              anno: audit?.anno,
            });
          } catch (error) {
            console.error("❌ Errore export ESRS/SDG:", error);
            alert(
              `❌ Errore durante l'export:\n\n${error.message}\n\nVerifica la console per dettagli.`
            );
          }
        };

        return (
          <ESRSSDGMapping
            materialThemes={materialThemesForESRS}
            themeToESRSMapping={themeToESRSMapping}
            onExport={handleESRSExport}
          />
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

      {/* Pannello Configurazione Soglie - Collassabile */}
      <div
        style={{
          margin: "0 0 1.5rem 0",
          border: "2px solid #1976d2",
          borderRadius: "8px",
          backgroundColor: "#fafafa",
        }}
      >
        {/* Header collapsabile */}
        <div
          onClick={() => setShowThresholdConfig(!showThresholdConfig)}
          style={{
            padding: "1rem 1.5rem",
            cursor: "pointer",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "#f5f5f5",
            borderRadius: showThresholdConfig ? "6px 6px 0 0" : "6px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <span style={{ fontSize: "1.2rem" }}>⚙️</span>
            <div>
              <strong style={{ fontSize: "16px" }}>Configurazione Soglia di Materialità</strong>
              <span
                style={{
                  marginLeft: "0.75rem",
                  fontSize: "0.8rem",
                  color: "#666",
                  backgroundColor: "#e3f2fd",
                  padding: "2px 8px",
                  borderRadius: "12px",
                }}
              >
                PDR 134:2022 Compliant
              </span>
              <div style={{ fontSize: "14px", color: "#666", marginTop: "0.25rem" }}>
                Soglia attuale: <strong style={{ color: "#1976d2", fontSize: "16px" }}>{materialityData.threshold}</strong> (Default: 3.0)
              </div>
            </div>
          </div>
          <span style={{ fontSize: "1.2rem", color: "#1976d2" }}>
            {showThresholdConfig ? "▼" : "▶"}
          </span>
        </div>

        {/* Pannello espanso */}
        {showThresholdConfig && (
          <div style={{ padding: "1.5rem" }}>
            {/* Riferimenti normativi */}
            <div
              style={{
                marginBottom: "1.5rem",
                padding: "1rem",
                backgroundColor: "#e3f2fd",
                borderLeft: "4px solid #1976d2",
                borderRadius: "4px",
              }}
            >
              <h4 style={{ margin: "0 0 0.5rem 0", color: "#1976d2" }}>
                📖 Riferimenti Normativi
              </h4>
              <p style={{ margin: "0.5rem 0", fontSize: "0.9rem", lineHeight: "1.5" }}>
                <strong>PDR 134:2022</strong> e <strong>ESRS 1</strong> richiedono
                che la soglia di materialità sia:
              </p>
              <ul style={{ margin: "0.5rem 0 0.5rem 1.5rem", fontSize: "0.9rem" }}>
                <li>Definita dal contesto aziendale specifico</li>
                <li>Giustificata e documentata in modo trasparente</li>
                <li>Applicata consistentemente nell'analisi</li>
              </ul>
              <p style={{ margin: "0.5rem 0 0 0", fontSize: "0.85rem", fontStyle: "italic", color: "#555" }}>
                ℹ️ Le soglie numeriche <strong>non sono prescritte</strong> dalla
                normativa e devono essere determinate dall'organizzazione in base
                al proprio contesto operativo e strategia ESG.
              </p>
            </div>

            {/* Spiegazione impatto soglia */}
            <div
              style={{
                marginBottom: "1.5rem",
                padding: "1rem",
                backgroundColor: "#f1f8e9",
                borderLeft: "4px solid #689f38",
                borderRadius: "4px",
              }}
            >
              <h4 style={{ margin: "0 0 0.5rem 0", color: "#689f38" }}>
                🎯 Come Funziona la Soglia
              </h4>
              <p style={{ margin: "0.5rem 0", fontSize: "0.9rem", lineHeight: "1.5" }}>
                I temi con punteggio <strong>≥ {materialityData.threshold}</strong> su <strong>ENTRAMBI</strong> gli assi
                (Impatto ESG + Rischi/Opportunità Finanziarie) sono considerati <strong>doppiamente materiali</strong> e
                <strong> devono essere rendicontati</strong> nel bilancio di sostenibilità.
              </p>
            </div>

            {/* Presets rapidi */}
            <div style={{ marginBottom: "1.5rem" }}>
              <h4 style={{ margin: "0 0 0.75rem 0" }}>🎯 Presets Consigliati</h4>
              <div style={{ display: "flex", gap: "1rem" }}>
                <button
                  onClick={() => materialityData.setThreshold(2.5)}
                  style={{
                    flex: 1,
                    padding: "0.75rem",
                    backgroundColor: materialityData.threshold === 2.5 ? "#fff3e0" : "white",
                    border: materialityData.threshold === 2.5 ? "3px solid #f57c00" : "2px solid #e0e0e0",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "0.9rem",
                  }}
                >
                  <div><strong>🛡️ Conservativo</strong></div>
                  <div style={{ fontSize: "0.8rem", color: "#666" }}>Soglia: 2.5</div>
                  <div style={{ fontSize: "0.75rem", color: "#888", marginTop: "0.25rem" }}>Copertura completa</div>
                </button>
                <button
                  onClick={() => materialityData.setThreshold(3.0)}
                  style={{
                    flex: 1,
                    padding: "0.75rem",
                    backgroundColor: materialityData.threshold === 3.0 ? "#e8f5e9" : "white",
                    border: materialityData.threshold === 3.0 ? "3px solid #4caf50" : "2px solid #e0e0e0",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "0.9rem",
                  }}
                >
                  <div><strong>✅ Standard (Default)</strong></div>
                  <div style={{ fontSize: "0.8rem", color: "#666" }}>Soglia: 3.0</div>
                  <div style={{ fontSize: "0.75rem", color: "#888", marginTop: "0.25rem" }}>Bilanciata e raccomandata</div>
                </button>
                <button
                  onClick={() => materialityData.setThreshold(3.5)}
                  style={{
                    flex: 1,
                    padding: "0.75rem",
                    backgroundColor: materialityData.threshold === 3.5 ? "#e1f5fe" : "white",
                    border: materialityData.threshold === 3.5 ? "3px solid #03a9f4" : "2px solid #e0e0e0",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "0.9rem",
                  }}
                >
                  <div><strong>🎯 Focalizzato</strong></div>
                  <div style={{ fontSize: "0.8rem", color: "#666" }}>Soglia: 3.5</div>
                  <div style={{ fontSize: "0.75rem", color: "#888", marginTop: "0.25rem" }}>Alta priorità</div>
                </button>
              </div>
            </div>

            {/* Slider soglia personalizzata */}
            <div style={{ marginBottom: "1.5rem" }}>
              <h4 style={{ margin: "0 0 1rem 0" }}>🎚️ Soglia Personalizzata</h4>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <input
                  type="range"
                  min="2"
                  max="4"
                  step="0.5"
                  value={materialityData.threshold}
                  onChange={(e) =>
                    materialityData.setThreshold(parseFloat(e.target.value))
                  }
                  style={{ flex: 1, height: "8px" }}
                />
                <input
                  type="number"
                  min="2"
                  max="4"
                  step="0.5"
                  value={materialityData.threshold}
                  onChange={(e) =>
                    materialityData.setThreshold(parseFloat(e.target.value))
                  }
                  style={{
                    width: "70px",
                    padding: "0.5rem",
                    textAlign: "center",
                    border: "2px solid #1976d2",
                    borderRadius: "4px",
                    fontSize: "16px",
                    fontWeight: "bold",
                  }}
                />
              </div>
              <div style={{ fontSize: "0.85rem", color: "#666", marginTop: "0.5rem" }}>
                Scala: 2.0 (molto permissivo) → 4.0 (molto restrittivo)
              </div>
            </div>

            {/* Info suggerimenti */}
            <div
              style={{
                padding: "1rem",
                backgroundColor: "#fff8e1",
                borderLeft: "4px solid #ffc107",
                borderRadius: "4px",
              }}
            >
              <h4 style={{ margin: "0 0 0.5rem 0", color: "#f57c00" }}>
                💡 Suggerimenti per la Scelta
              </h4>
              <ul style={{ margin: "0.5rem 0 0 1.5rem", fontSize: "0.85rem", lineHeight: "1.6" }}>
                <li><strong>2.0-2.5:</strong> Analisi molto completa, identifica tutti i temi potenzialmente rilevanti (raccomandata per prime analisi)</li>
                <li><strong>3.0:</strong> ✅ Bilanciata e raccomandata, allineata alle best practice ESRS per la maggior parte delle aziende</li>
                <li><strong>3.5-4.0:</strong> Focalizzata su alta priorità, per aziende con sistema ESG maturo e consolidato</li>
              </ul>
            </div>
          </div>
        )}
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
            key: "structured",
            label: "📋 Temi ISO 26000",
            count: structuredResults ? "✅ Completato" : "📝 Inizia qui",
          },
          {
            key: "financial",
            label: "💰 Analisi Finanziaria",
            count:
              financialResults || audit?.financialAssessment
                ? "✅ Completato"
                : structuredResults?.scoring?.themeScores
                  ? `⚡ ${Object.keys(structuredResults.scoring.themeScores).length} temi`
                  : "⏳ Pending",
          },
          {
            key: "double",
            label: "📊 Doppia Materialità",
            count: financialResults || audit?.financialAssessment ? "✅ Pronto" : "🔒 Bloccato",
          },
          {
            key: "esrs",
            label: "🌍 ESRS + Goal ONU",
            count: financialResults || audit?.financialAssessment ? "✅ Disponibile" : "🔒 Bloccato",
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
