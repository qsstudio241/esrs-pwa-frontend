import React, { useState, useMemo } from "react";

/**
 * Componente per la Doppia Matrice di Materialità secondo PDR 134:2022
 * Visualizza la relazione tra impatti materiali e finanziari (inside-out/outside-in)
 */
function MaterialityMatrix({
  topics = [],
  onTopicUpdate,
  onThresholdChange,
  threshold = 3,
}) {
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // Calcola quadranti della matrice
  const quadrants = useMemo(() => {
    const q1 = topics.filter(
      (t) => t.impactScore >= threshold && t.financialScore >= threshold
    );
    const q2 = topics.filter(
      (t) => t.impactScore >= threshold && t.financialScore < threshold
    );
    const q3 = topics.filter(
      (t) => t.impactScore < threshold && t.financialScore < threshold
    );
    const q4 = topics.filter(
      (t) => t.impactScore < threshold && t.financialScore >= threshold
    );

    return {
      q1: {
        topics: q1,
        label: "Alta Materialità",
        color: "#d32f2f",
        priority: "Critica",
      },
      q2: {
        topics: q2,
        label: "Impatto Sociale/Ambientale",
        color: "#f57c00",
        priority: "Alta",
      },
      q3: {
        topics: q3,
        label: "Bassa Materialità",
        color: "#689f38",
        priority: "Bassa",
      },
      q4: {
        topics: q4,
        label: "Rilevanza Finanziaria",
        color: "#1976d2",
        priority: "Media",
      },
    };
  }, [topics, threshold]);

  // Gestisce il posizionamento di un topic sulla matrice
  const handleMatrixClick = (event) => {
    if (!isEditMode || !selectedTopic) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Converti coordinate pixel in score 1-5
    const financialScore = Math.max(
      1,
      Math.min(5, Math.round((x / rect.width) * 5))
    );
    const impactScore = Math.max(
      1,
      Math.min(5, Math.round(((rect.height - y) / rect.height) * 5))
    );

    onTopicUpdate(selectedTopic.id, { impactScore, financialScore });
    setSelectedTopic(null);
    setIsEditMode(false);
  };

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
          🎯 Doppia Matrice di Materialità (PDR 134:2022)
        </h3>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <label style={{ fontSize: "0.9rem" }}>
            Soglia materialità:
            <input
              type="range"
              min="2"
              max="4"
              step="0.5"
              value={threshold}
              onChange={(e) => onThresholdChange(parseFloat(e.target.value))}
              style={{ marginLeft: "0.5rem" }}
            />
            <span style={{ marginLeft: "0.5rem", fontWeight: "bold" }}>
              {threshold}
            </span>
          </label>
          <button
            onClick={() => setIsEditMode(!isEditMode)}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: isEditMode ? "#d32f2f" : "#1976d2",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            {isEditMode ? "✕ Annulla" : "✏️ Modifica Posizioni"}
          </button>
        </div>
      </div>

      {/* Matrice principale */}
      <div style={{ display: "flex", gap: "2rem" }}>
        {/* Matrice visuale */}
        <div style={{ flex: 2 }}>
          <div
            onClick={handleMatrixClick}
            style={{
              position: "relative",
              width: "500px",
              height: "400px",
              border: "2px solid #333",
              cursor: isEditMode ? "crosshair" : "default",
              backgroundColor: "white",
            }}
          >
            {/* Linee soglia materialità */}
            <div
              style={{
                position: "absolute",
                left: `${(threshold / 5) * 100}%`,
                top: 0,
                bottom: 0,
                width: "2px",
                backgroundColor: "#d32f2f",
                zIndex: 1,
              }}
            />
            <div
              style={{
                position: "absolute",
                top: `${100 - (threshold / 5) * 100}%`,
                left: 0,
                right: 0,
                height: "2px",
                backgroundColor: "#d32f2f",
                zIndex: 1,
              }}
            />

            {/* Quadranti con colori */}
            <div
              style={{
                position: "absolute",
                right: 0,
                top: 0,
                width: `${100 - (threshold / 5) * 100}%`,
                height: `${100 - (threshold / 5) * 100}%`,
                backgroundColor: "rgba(211, 47, 47, 0.1)", // Q1 - Alta materialità
              }}
            />
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                width: `${(threshold / 5) * 100}%`,
                height: `${100 - (threshold / 5) * 100}%`,
                backgroundColor: "rgba(245, 124, 0, 0.1)", // Q2 - Impatto sociale/ambientale
              }}
            />
            <div
              style={{
                position: "absolute",
                left: 0,
                bottom: 0,
                width: `${(threshold / 5) * 100}%`,
                height: `${(threshold / 5) * 100}%`,
                backgroundColor: "rgba(104, 159, 56, 0.1)", // Q3 - Bassa materialità
              }}
            />
            <div
              style={{
                position: "absolute",
                right: 0,
                bottom: 0,
                width: `${100 - (threshold / 5) * 100}%`,
                height: `${(threshold / 5) * 100}%`,
                backgroundColor: "rgba(25, 118, 210, 0.1)", // Q4 - Rilevanza finanziaria
              }}
            />

            {/* Topics posizionati sulla matrice */}
            {topics.map((topic) => (
              <div
                key={topic.id}
                onClick={() => isEditMode && setSelectedTopic(topic)}
                style={{
                  position: "absolute",
                  left: `${(topic.financialScore / 5) * 100 - 1}%`,
                  top: `${100 - (topic.impactScore / 5) * 100 - 1}%`,
                  width: "8px",
                  height: "8px",
                  backgroundColor:
                    selectedTopic?.id === topic.id ? "#ff5722" : "#333",
                  borderRadius: "50%",
                  cursor: isEditMode ? "pointer" : "default",
                  border: "2px solid white",
                  transform: "translate(-50%, -50%)",
                  zIndex: 2,
                  boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
                }}
                title={`${topic.name} (I:${topic.impactScore}, F:${topic.financialScore})`}
              />
            ))}

            {/* Etichette assi */}
            <div
              style={{
                position: "absolute",
                bottom: "-30px",
                left: "50%",
                transform: "translateX(-50%)",
                fontSize: "14px",
                fontWeight: "bold",
              }}
            >
              Rilevanza Finanziaria (Outside-in) →
            </div>
            <div
              style={{
                position: "absolute",
                left: "-120px",
                top: "50%",
                transform: "translateY(-50%) rotate(-90deg)",
                fontSize: "14px",
                fontWeight: "bold",
              }}
            >
              Impatto Sostenibilità (Inside-out) →
            </div>
          </div>

          {/* Scala degli assi */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "0.5rem",
              fontSize: "12px",
              color: "#666",
            }}
          >
            <span>1 - Basso</span>
            <span>2</span>
            <span>3 - Medio</span>
            <span>4</span>
            <span>5 - Alto</span>
          </div>
        </div>

        {/* Riepilogo quadranti */}
        <div style={{ flex: 1 }}>
          <h4 style={{ marginBottom: "1rem" }}>📊 Analisi per Quadrante</h4>
          {Object.entries(quadrants).map(([key, quad]) => (
            <div
              key={key}
              style={{
                marginBottom: "1rem",
                padding: "0.75rem",
                backgroundColor: "white",
                borderLeft: `4px solid ${quad.color}`,
                borderRadius: "4px",
              }}
            >
              <div style={{ fontWeight: "bold", color: quad.color }}>
                {quad.label} ({quad.topics.length} temi)
              </div>
              <div
                style={{
                  fontSize: "0.8rem",
                  color: "#666",
                  marginBottom: "0.5rem",
                }}
              >
                Priorità: {quad.priority}
              </div>
              {quad.topics.slice(0, 3).map((topic) => (
                <div
                  key={topic.id}
                  style={{ fontSize: "0.8rem", marginBottom: "2px" }}
                >
                  • {topic.name}
                </div>
              ))}
              {quad.topics.length > 3 && (
                <div style={{ fontSize: "0.8rem", color: "#999" }}>
                  + altri {quad.topics.length - 3} temi
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Istruzioni */}
      <div
        style={{
          marginTop: "1rem",
          padding: "0.75rem",
          backgroundColor: "rgba(25, 118, 210, 0.1)",
          borderRadius: "4px",
          fontSize: "0.9rem",
        }}
      >
        <strong>💡 Come utilizzare:</strong>
        <ul style={{ margin: "0.5rem 0", paddingLeft: "1.5rem" }}>
          <li>
            <strong>Inside-out (Asse Y):</strong> Impatto dell'organizzazione su
            economia, ambiente e società
          </li>
          <li>
            <strong>Outside-in (Asse X):</strong> Rischi e opportunità
            finanziarie per l'organizzazione
          </li>
          <li>
            <strong>Soglia materialità:</strong> Temi sopra soglia richiedono
            rendicontazione obbligatoria
          </li>
          <li>
            <strong>Modalità modifica:</strong> Clicca "Modifica Posizioni" per
            riposizionare i temi
          </li>
        </ul>
      </div>

      {isEditMode && selectedTopic && (
        <div
          style={{
            marginTop: "1rem",
            padding: "1rem",
            backgroundColor: "rgba(255, 87, 34, 0.1)",
            borderRadius: "4px",
            border: "1px solid #ff5722",
          }}
        >
          <strong>🎯 Modalità Posizionamento Attiva</strong>
          <p style={{ margin: "0.5rem 0" }}>
            Tema selezionato: <strong>{selectedTopic.name}</strong>
          </p>
          <p style={{ margin: 0, fontSize: "0.9rem" }}>
            Clicca sulla matrice per posizionare il tema. Posizione attuale:
            Impatto {selectedTopic.impactScore}/5, Finanziario{" "}
            {selectedTopic.financialScore}/5
          </p>
        </div>
      )}
    </div>
  );
}

export default MaterialityMatrix;
