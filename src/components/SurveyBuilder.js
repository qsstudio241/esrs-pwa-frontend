import React, { useState } from "react";

/**
 * Componente Survey Builder per questionari stakeholder personalizzati
 * Supporta creazione, distribuzione e analisi survey materialità
 */
function SurveyBuilder({
  onSurveyCreate,
  existingSurveys = [],
  onSurveyUpdate,
}) {
  const [currentSurvey, setCurrentSurvey] = useState(null);
  const [isBuilding, setIsBuilding] = useState(false);

  const initNewSurvey = () => {
    setCurrentSurvey({
      id: `survey_${Date.now()}`,
      title: "",
      description: "",
      targetStakeholders: [],
      questions: [],
      settings: {
        anonymous: true,
        deadlineDate: "",
        reminderEnabled: true,
        showProgress: true,
      },
      status: "DRAFT",
      createdAt: new Date().toISOString(),
      responses: [],
    });
    setIsBuilding(true);
  };

  const addQuestion = (type) => {
    const questionTypes = {
      MATERIALITY_RATING: {
        type: "MATERIALITY_RATING",
        title: "Valutazione Materialità",
        description: "Valuta l'importanza di questo tema per la sostenibilità",
        config: {
          topic: "",
          scaleType: "IMPACT_FINANCIAL", // IMPACT_FINANCIAL, IMPACT_ONLY, FINANCIAL_ONLY
          scaleMin: 1,
          scaleMax: 5,
          labels: ["Molto basso", "Basso", "Medio", "Alto", "Molto alto"],
        },
      },
      STAKEHOLDER_PRIORITY: {
        type: "STAKEHOLDER_PRIORITY",
        title: "Priorità Stakeholder",
        description:
          "Quanto è importante questo tema per il vostro gruppo di interesse?",
        config: {
          topics: [],
          rankingType: "RANKING", // RANKING, RATING
          maxSelections: 5,
        },
      },
      IMPACT_ASSESSMENT: {
        type: "IMPACT_ASSESSMENT",
        title: "Valutazione Impatti",
        description: "Valuta gli impatti dell'organizzazione su questo tema",
        config: {
          topic: "",
          dimensions: ["severity", "scope", "likelihood"],
          includePositiveImpacts: true,
        },
      },
      OPEN_FEEDBACK: {
        type: "OPEN_FEEDBACK",
        title: "Feedback Aperto",
        description: "Commenti e suggerimenti su temi di sostenibilità",
        config: {
          maxLength: 500,
          placeholder: "Condividi i tuoi pensieri sui temi di sostenibilità...",
        },
      },
    };

    const newQuestion = {
      id: `q_${Date.now()}`,
      ...questionTypes[type],
      required: false,
      order: currentSurvey.questions.length + 1,
    };

    setCurrentSurvey((prev) => ({
      ...prev,
      questions: [...prev.questions, newQuestion],
    }));
  };

  const updateQuestion = (questionId, updates) => {
    setCurrentSurvey((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.id === questionId ? { ...q, ...updates } : q
      ),
    }));
  };

  const removeQuestion = (questionId) => {
    setCurrentSurvey((prev) => ({
      ...prev,
      questions: prev.questions.filter((q) => q.id !== questionId),
    }));
  };

  const saveSurvey = () => {
    if (!currentSurvey.title.trim()) {
      alert("Inserisci un titolo per il questionario");
      return;
    }

    if (currentSurvey.questions.length === 0) {
      alert("Aggiungi almeno una domanda");
      return;
    }

    const surveyToSave = {
      ...currentSurvey,
      updatedAt: new Date().toISOString(),
    };

    onSurveyCreate(surveyToSave);
    setCurrentSurvey(null);
    setIsBuilding(false);
  };

  const previewSurvey = () => {
    // Implementa preview del questionario
    console.log("Preview survey:", currentSurvey);
  };

  if (!isBuilding) {
    return (
      <div
        style={{
          padding: "1rem",
          backgroundColor: "#f8f9fa",
          borderRadius: "8px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1rem",
          }}
        >
          <h3 style={{ margin: 0, color: "#1976d2" }}>
            📊 Survey Builder - Stakeholder Engagement
          </h3>
          <button
            onClick={initNewSurvey}
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
            + Nuovo Questionario
          </button>
        </div>

        {existingSurveys.length > 0 ? (
          <div>
            <h4>📋 Questionari Esistenti</h4>
            <div style={{ display: "grid", gap: "1rem" }}>
              {existingSurveys.map((survey) => (
                <SurveyCard
                  key={survey.id}
                  survey={survey}
                  onEdit={() => {
                    setCurrentSurvey(survey);
                    setIsBuilding(true);
                  }}
                  onSurveyUpdate={onSurveyUpdate}
                />
              ))}
            </div>
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "2rem", color: "#666" }}>
            <p>Nessun questionario creato ancora.</p>
            <p>
              Crea il primo questionario per raccogliere feedback stakeholder
              sulla materialità.
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "1rem",
        backgroundColor: "#f8f9fa",
        borderRadius: "8px",
        maxHeight: "80vh",
        overflowY: "auto",
      }}
    >
      {/* Header builder */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
        }}
      >
        <h3 style={{ margin: 0, color: "#1976d2" }}>
          ✏️ Creazione Questionario
        </h3>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button
            onClick={previewSurvey}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#ffc107",
              color: "black",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            👁️ Anteprima
          </button>
          <button
            onClick={saveSurvey}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            💾 Salva
          </button>
          <button
            onClick={() => {
              setIsBuilding(false);
              setCurrentSurvey(null);
            }}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#6c757d",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            ✕ Annulla
          </button>
        </div>
      </div>

      {/* Configurazione survey */}
      <div
        style={{
          marginBottom: "2rem",
          padding: "1rem",
          backgroundColor: "white",
          borderRadius: "6px",
        }}
      >
        <h4>ℹ️ Informazioni Generali</h4>

        <div style={{ marginBottom: "1rem" }}>
          <label
            style={{
              display: "block",
              marginBottom: "0.5rem",
              fontWeight: "bold",
            }}
          >
            Titolo Questionario *
          </label>
          <input
            type="text"
            value={currentSurvey.title}
            onChange={(e) =>
              setCurrentSurvey((prev) => ({ ...prev, title: e.target.value }))
            }
            placeholder="es. Analisi Materialità 2025 - Stakeholder Survey"
            style={{
              width: "100%",
              padding: "0.5rem",
              border: "1px solid #ddd",
              borderRadius: "4px",
            }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label
            style={{
              display: "block",
              marginBottom: "0.5rem",
              fontWeight: "bold",
            }}
          >
            Descrizione e Obiettivi
          </label>
          <textarea
            value={currentSurvey.description}
            onChange={(e) =>
              setCurrentSurvey((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
            placeholder="Descrivi lo scopo del questionario e come verranno utilizzati i risultati..."
            style={{
              width: "100%",
              height: "80px",
              padding: "0.5rem",
              border: "1px solid #ddd",
              borderRadius: "4px",
            }}
          />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1rem",
          }}
        >
          <div>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: "bold",
              }}
            >
              Gruppi Stakeholder Target
            </label>
            <select
              multiple
              value={currentSurvey.targetStakeholders}
              onChange={(e) =>
                setCurrentSurvey((prev) => ({
                  ...prev,
                  targetStakeholders: Array.from(
                    e.target.selectedOptions,
                    (option) => option.value
                  ),
                }))
              }
              style={{
                width: "100%",
                height: "100px",
                padding: "0.5rem",
                border: "1px solid #ddd",
                borderRadius: "4px",
              }}
            >
              <option value="employees">Dipendenti</option>
              <option value="customers">Clienti</option>
              <option value="suppliers">Fornitori</option>
              <option value="investors">Investitori</option>
              <option value="communities">Comunità Locali</option>
              <option value="regulators">Regolatori</option>
              <option value="ngos">ONG e Associazioni</option>
            </select>
          </div>

          <div>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: "bold",
              }}
            >
              Scadenza Raccolta
            </label>
            <input
              type="date"
              value={currentSurvey.settings.deadlineDate}
              onChange={(e) =>
                setCurrentSurvey((prev) => ({
                  ...prev,
                  settings: { ...prev.settings, deadlineDate: e.target.value },
                }))
              }
              style={{
                width: "100%",
                padding: "0.5rem",
                border: "1px solid #ddd",
                borderRadius: "4px",
              }}
            />
          </div>
        </div>
      </div>

      {/* Costruttore domande */}
      <div
        style={{
          marginBottom: "2rem",
          padding: "1rem",
          backgroundColor: "white",
          borderRadius: "6px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1rem",
          }}
        >
          <h4 style={{ margin: 0 }}>
            ❓ Domande ({currentSurvey.questions.length})
          </h4>

          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              onClick={() => addQuestion("MATERIALITY_RATING")}
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: "#17a2b8",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "0.8rem",
              }}
            >
              + Rating Materialità
            </button>
            <button
              onClick={() => addQuestion("STAKEHOLDER_PRIORITY")}
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: "#28a745",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "0.8rem",
              }}
            >
              + Priorità Topics
            </button>
            <button
              onClick={() => addQuestion("OPEN_FEEDBACK")}
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: "#6f42c1",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "0.8rem",
              }}
            >
              + Feedback Aperto
            </button>
          </div>
        </div>

        {currentSurvey.questions.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "2rem",
              color: "#666",
              border: "2px dashed #ddd",
              borderRadius: "6px",
            }}
          >
            <p>Nessuna domanda ancora aggiunta.</p>
            <p>Usa i pulsanti sopra per aggiungere domande al questionario.</p>
          </div>
        ) : (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            {currentSurvey.questions.map((question, index) => (
              <QuestionEditor
                key={question.id}
                question={question}
                index={index}
                onUpdate={(updates) => updateQuestion(question.id, updates)}
                onRemove={() => removeQuestion(question.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Componente per modificare singola domanda
function QuestionEditor({ question, index, onUpdate, onRemove }) {
  return (
    <div
      style={{
        padding: "1rem",
        border: "1px solid #ddd",
        borderRadius: "6px",
        backgroundColor: "#fafafa",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem",
        }}
      >
        <h5 style={{ margin: 0, color: "#495057" }}>
          Domanda {index + 1} - {question.type.replace(/_/g, " ")}
        </h5>
        <button
          onClick={onRemove}
          style={{
            padding: "0.25rem 0.5rem",
            backgroundColor: "#dc3545",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          🗑️
        </button>
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <label
          style={{
            display: "block",
            marginBottom: "0.5rem",
            fontWeight: "bold",
          }}
        >
          Titolo Domanda
        </label>
        <input
          type="text"
          value={question.title}
          onChange={(e) => onUpdate({ title: e.target.value })}
          style={{
            width: "100%",
            padding: "0.5rem",
            border: "1px solid #ddd",
            borderRadius: "4px",
          }}
        />
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <label
          style={{
            display: "block",
            marginBottom: "0.5rem",
            fontWeight: "bold",
          }}
        >
          Descrizione/Istruzioni
        </label>
        <textarea
          value={question.description}
          onChange={(e) => onUpdate({ description: e.target.value })}
          style={{
            width: "100%",
            height: "60px",
            padding: "0.5rem",
            border: "1px solid #ddd",
            borderRadius: "4px",
          }}
        />
      </div>

      {/* Configurazioni specifiche per tipo domanda */}
      {question.type === "MATERIALITY_RATING" && (
        <MaterialityRatingConfig
          config={question.config}
          onUpdate={(config) => onUpdate({ config })}
        />
      )}

      <div>
        <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <input
            type="checkbox"
            checked={question.required}
            onChange={(e) => onUpdate({ required: e.target.checked })}
          />
          <span style={{ fontWeight: "bold" }}>Domanda obbligatoria</span>
        </label>
      </div>
    </div>
  );
}

// Configurazione specifica per rating materialità
function MaterialityRatingConfig({ config, onUpdate }) {
  return (
    <div
      style={{
        marginBottom: "1rem",
        padding: "0.75rem",
        backgroundColor: "white",
        borderRadius: "4px",
      }}
    >
      <h6 style={{ margin: "0 0 0.75rem 0" }}>Configurazione Rating</h6>

      <div style={{ marginBottom: "1rem" }}>
        <label style={{ display: "block", marginBottom: "0.5rem" }}>
          Tema da valutare
        </label>
        <input
          type="text"
          value={config.topic}
          onChange={(e) => onUpdate({ ...config, topic: e.target.value })}
          placeholder="es. Cambiamenti climatici, Gestione rifiuti, Diversity & Inclusion..."
          style={{
            width: "100%",
            padding: "0.5rem",
            border: "1px solid #ddd",
            borderRadius: "4px",
          }}
        />
      </div>

      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}
      >
        <div>
          <label style={{ display: "block", marginBottom: "0.5rem" }}>
            Tipo scala valutazione
          </label>
          <select
            value={config.scaleType}
            onChange={(e) => onUpdate({ ...config, scaleType: e.target.value })}
            style={{
              width: "100%",
              padding: "0.5rem",
              border: "1px solid #ddd",
              borderRadius: "4px",
            }}
          >
            <option value="IMPACT_FINANCIAL">
              Doppia: Impatto + Finanziario
            </option>
            <option value="IMPACT_ONLY">Solo Impatto Sostenibilità</option>
            <option value="FINANCIAL_ONLY">Solo Rilevanza Finanziaria</option>
          </select>
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "0.5rem" }}>
            Scala valutazione
          </label>
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <input
              type="number"
              value={config.scaleMin}
              onChange={(e) =>
                onUpdate({ ...config, scaleMin: parseInt(e.target.value) })
              }
              min="1"
              max="3"
              style={{
                width: "60px",
                padding: "0.25rem",
                border: "1px solid #ddd",
                borderRadius: "4px",
              }}
            />
            <span>→</span>
            <input
              type="number"
              value={config.scaleMax}
              onChange={(e) =>
                onUpdate({ ...config, scaleMax: parseInt(e.target.value) })
              }
              min="3"
              max="10"
              style={{
                width: "60px",
                padding: "0.25rem",
                border: "1px solid #ddd",
                borderRadius: "4px",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Card per visualizzare survey esistente
function SurveyCard({ survey, onEdit, onSurveyUpdate }) {
  const getStatusColor = (status) => {
    const colors = {
      DRAFT: "#6c757d",
      ACTIVE: "#28a745",
      CLOSED: "#dc3545",
      ANALYZING: "#ffc107",
    };
    return colors[status] || "#6c757d";
  };

  const getStatusLabel = (status) => {
    const labels = {
      DRAFT: "Bozza",
      ACTIVE: "Attivo",
      CLOSED: "Chiuso",
      ANALYZING: "In Analisi",
    };
    return labels[status] || status;
  };

  return (
    <div
      style={{
        padding: "1rem",
        border: "1px solid #ddd",
        borderRadius: "6px",
        backgroundColor: "white",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "0.5rem",
        }}
      >
        <h5 style={{ margin: 0, color: "#495057" }}>{survey.title}</h5>
        <span
          style={{
            padding: "0.25rem 0.5rem",
            backgroundColor: getStatusColor(survey.status),
            color: "white",
            borderRadius: "4px",
            fontSize: "0.8rem",
          }}
        >
          {getStatusLabel(survey.status)}
        </span>
      </div>

      <p style={{ margin: "0.5rem 0", color: "#666", fontSize: "0.9rem" }}>
        {survey.description || "Nessuna descrizione disponibile"}
      </p>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: "0.8rem",
          color: "#666",
        }}
      >
        <div>
          📊 {survey.questions.length} domande • 🎯{" "}
          {survey.targetStakeholders.length} gruppi target • 📬{" "}
          {survey.responses.length} risposte
        </div>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button
            onClick={onEdit}
            style={{
              padding: "0.25rem 0.5rem",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            ✏️ Modifica
          </button>
        </div>
      </div>
    </div>
  );
}

export default SurveyBuilder;
