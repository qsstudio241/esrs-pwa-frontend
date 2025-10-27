import React, { useState, useEffect } from "react";

/**
 * Componente per configurare le soglie di materialità per raccomandazioni
 * Conforme a PDR 134:2022 e ESRS 1 - soglie definite dal contesto aziendale
 */
export default function MaterialityThresholdConfig({
    audit,
    onConfigUpdate,
}) {
    const [config, setConfig] = useState({
        themes: 3.0,
        aspects: 3.5,
        justification: "Soglia standard per analisi bilanciata, in linea con best practice ESRS per aziende di medie dimensioni.",
    });

    const [isExpanded, setIsExpanded] = useState(false);

    // Carica configurazione esistente dall'audit
    useEffect(() => {
        if (audit?.materialityConfig?.thresholdRecommendations) {
            setConfig(audit.materialityConfig.thresholdRecommendations);
        }
    }, [audit]);

    const handleThresholdChange = (type, value) => {
        const newConfig = { ...config, [type]: parseFloat(value) };
        setConfig(newConfig);
    };

    const handleJustificationChange = (e) => {
        setConfig({ ...config, justification: e.target.value });
    };

    const handleSave = () => {
        if (onConfigUpdate) {
            onConfigUpdate({
                thresholdRecommendations: config,
                updatedAt: new Date().toISOString(),
            });
        }
        alert("✅ Configurazione soglie salvata con successo!");
    };

    const handleReset = () => {
        const defaultConfig = {
            themes: 3.0,
            aspects: 3.5,
            justification: "Soglia standard per analisi bilanciata, in linea con best practice ESRS per aziende di medie dimensioni.",
        };
        setConfig(defaultConfig);
    };

    const applyPreset = (preset) => {
        const presets = {
            conservative: {
                themes: 2.5,
                aspects: 3.0,
                justification: "Soglia conservativa per garantire copertura completa di tutti i temi potenzialmente rilevanti. Raccomandata per prime analisi o contesti ad alto rischio ESG.",
            },
            standard: {
                themes: 3.0,
                aspects: 3.5,
                justification: "Soglia bilanciata che identifica temi materiali senza sovraccarico informativo. Allineata alle best practice ESRS per aziende di medie dimensioni.",
            },
            focused: {
                themes: 4.0,
                aspects: 4.5,
                justification: "Soglia stringente per analisi focalizzata su temi ad altissima priorità. Raccomandata per aziende mature con sistema ESG consolidato.",
            },
        };
        setConfig(presets[preset]);
    };

    return (
        <div
            style={{
                margin: "1rem 0",
                border: "1px solid #e0e0e0",
                borderRadius: "8px",
                backgroundColor: "#fafafa",
            }}
        >
            {/* Header collapsabile */}
            <div
                onClick={() => setIsExpanded(!isExpanded)}
                style={{
                    padding: "1rem",
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    backgroundColor: "#f5f5f5",
                    borderRadius: isExpanded ? "8px 8px 0 0" : "8px",
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span style={{ fontSize: "1.2rem" }}>⚙️</span>
                    <strong>Configurazione Soglie Materialità</strong>
                    <span
                        style={{
                            fontSize: "0.8rem",
                            color: "#666",
                            backgroundColor: "#e3f2fd",
                            padding: "2px 8px",
                            borderRadius: "12px",
                        }}
                    >
                        PDR 134:2022 Compliant
                    </span>
                </div>
                <span style={{ fontSize: "1.2rem" }}>{isExpanded ? "▼" : "▶"}</span>
            </div>

            {/* Pannello espanso */}
            {isExpanded && (
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

                    {/* Presets rapidi */}
                    <div style={{ marginBottom: "1.5rem" }}>
                        <h4 style={{ margin: "0 0 0.75rem 0" }}>🎯 Presets Consigliati</h4>
                        <div style={{ display: "flex", gap: "1rem" }}>
                            <button
                                onClick={() => applyPreset("conservative")}
                                style={{
                                    flex: 1,
                                    padding: "0.75rem",
                                    backgroundColor: "#fff3e0",
                                    border: "2px solid #f57c00",
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                    fontSize: "0.9rem",
                                }}
                            >
                                <div><strong>🛡️ Conservativo</strong></div>
                                <div style={{ fontSize: "0.8rem", color: "#666" }}>2.5 / 3.0</div>
                            </button>
                            <button
                                onClick={() => applyPreset("standard")}
                                style={{
                                    flex: 1,
                                    padding: "0.75rem",
                                    backgroundColor: "#e8f5e9",
                                    border: "2px solid #4caf50",
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                    fontSize: "0.9rem",
                                }}
                            >
                                <div><strong>✅ Standard</strong></div>
                                <div style={{ fontSize: "0.8rem", color: "#666" }}>3.0 / 3.5</div>
                            </button>
                            <button
                                onClick={() => applyPreset("focused")}
                                style={{
                                    flex: 1,
                                    padding: "0.75rem",
                                    backgroundColor: "#e1f5fe",
                                    border: "2px solid #03a9f4",
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                    fontSize: "0.9rem",
                                }}
                            >
                                <div><strong>🎯 Focalizzato</strong></div>
                                <div style={{ fontSize: "0.8rem", color: "#666" }}>4.0 / 4.5</div>
                            </button>
                        </div>
                    </div>

                    {/* Slider soglie */}
                    <div style={{ marginBottom: "1.5rem" }}>
                        <h4 style={{ margin: "0 0 1rem 0" }}>🎚️ Soglie Personalizzate</h4>

                        {/* Soglia Temi */}
                        <div style={{ marginBottom: "1.5rem" }}>
                            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
                                Soglia Temi (genera raccomandazioni immediate)
                            </label>
                            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                                <input
                                    type="range"
                                    min="1.0"
                                    max="5.0"
                                    step="0.5"
                                    value={config.themes}
                                    onChange={(e) => handleThresholdChange("themes", e.target.value)}
                                    style={{ flex: 1 }}
                                />
                                <input
                                    type="number"
                                    min="1.0"
                                    max="5.0"
                                    step="0.5"
                                    value={config.themes}
                                    onChange={(e) => handleThresholdChange("themes", e.target.value)}
                                    style={{
                                        width: "60px",
                                        padding: "0.25rem",
                                        textAlign: "center",
                                        border: "1px solid #ccc",
                                        borderRadius: "4px",
                                    }}
                                />
                            </div>
                            <div style={{ fontSize: "0.8rem", color: "#666", marginTop: "0.25rem" }}>
                                Scala: 1.0 (molto permissivo) → 5.0 (molto restrittivo)
                            </div>
                        </div>

                        {/* Soglia Aspetti */}
                        <div>
                            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
                                Soglia Aspetti (genera raccomandazioni dettagliate)
                            </label>
                            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                                <input
                                    type="range"
                                    min="1.0"
                                    max="5.0"
                                    step="0.5"
                                    value={config.aspects}
                                    onChange={(e) => handleThresholdChange("aspects", e.target.value)}
                                    style={{ flex: 1 }}
                                />
                                <input
                                    type="number"
                                    min="1.0"
                                    max="5.0"
                                    step="0.5"
                                    value={config.aspects}
                                    onChange={(e) => handleThresholdChange("aspects", e.target.value)}
                                    style={{
                                        width: "60px",
                                        padding: "0.25rem",
                                        textAlign: "center",
                                        border: "1px solid #ccc",
                                        borderRadius: "4px",
                                    }}
                                />
                            </div>
                            <div style={{ fontSize: "0.8rem", color: "#666", marginTop: "0.25rem" }}>
                                Scala: 1.0 (molto permissivo) → 5.0 (molto restrittivo)
                            </div>
                        </div>
                    </div>

                    {/* Giustificazione */}
                    <div style={{ marginBottom: "1.5rem" }}>
                        <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
                            📝 Giustificazione Soglie (richiesta da PDR 134:2022)
                        </label>
                        <textarea
                            value={config.justification}
                            onChange={handleJustificationChange}
                            rows="4"
                            style={{
                                width: "100%",
                                padding: "0.75rem",
                                border: "1px solid #ccc",
                                borderRadius: "4px",
                                fontFamily: "inherit",
                                fontSize: "0.9rem",
                                resize: "vertical",
                            }}
                            placeholder="Spiega perché queste soglie sono appropriate per il contesto aziendale..."
                        />
                        <div style={{ fontSize: "0.8rem", color: "#666", marginTop: "0.25rem" }}>
                            💡 Includi: dimensione aziendale, settore, livello maturità ESG, strategia sostenibilità
                        </div>
                    </div>

                    {/* Info suggerimenti */}
                    <div
                        style={{
                            padding: "1rem",
                            backgroundColor: "#fff8e1",
                            borderLeft: "4px solid #ffc107",
                            borderRadius: "4px",
                            marginBottom: "1.5rem",
                        }}
                    >
                        <h4 style={{ margin: "0 0 0.5rem 0", color: "#f57c00" }}>
                            💡 Suggerimenti per la Scelta
                        </h4>
                        <ul style={{ margin: "0.5rem 0 0 1.5rem", fontSize: "0.85rem" }}>
                            <li><strong>2.0-2.5:</strong> Analisi molto completa, identifica tutti i temi potenzialmente rilevanti</li>
                            <li><strong>3.0-3.5:</strong> Bilanciata e raccomandata, allineata alle best practice</li>
                            <li><strong>4.0-4.5:</strong> Focalizzata su alta priorità, per aziende con ESG maturo</li>
                        </ul>
                    </div>

                    {/* Pulsanti azione */}
                    <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
                        <button
                            onClick={handleReset}
                            style={{
                                padding: "0.75rem 1.5rem",
                                backgroundColor: "#f5f5f5",
                                border: "1px solid #ccc",
                                borderRadius: "4px",
                                cursor: "pointer",
                                fontSize: "0.9rem",
                            }}
                        >
                            🔄 Ripristina Default
                        </button>
                        <button
                            onClick={handleSave}
                            style={{
                                padding: "0.75rem 1.5rem",
                                backgroundColor: "#4caf50",
                                color: "white",
                                border: "none",
                                borderRadius: "4px",
                                cursor: "pointer",
                                fontSize: "0.9rem",
                                fontWeight: "bold",
                            }}
                        >
                            💾 Salva Configurazione
                        </button>
                    </div>

                    {/* Timestamp ultima modifica */}
                    {audit?.materialityConfig?.updatedAt && (
                        <div style={{ marginTop: "1rem", fontSize: "0.8rem", color: "#666", textAlign: "right" }}>
                            Ultima modifica: {new Date(audit.materialityConfig.updatedAt).toLocaleString("it-IT")}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
