import React, { useState, useEffect, useCallback, useRef } from "react";

/**
 * Componente per Analisi Rischi/Opportunità Finanziaria
 * Parte del processo Doppia Materialità per determinare rilevanza economico-finanziaria dei temi ESG
 * 
 * Flusso: ISO 26000 → Matrice Singola → [QUI: Analisi Finanziaria] → Matrice Doppia
 */
export default function FinancialMaterialityAssessment({
    selectedThemes = [],
    existingAssessment = null,
    onComplete,
    onUpdate,
}) {
    const [currentTheme, setCurrentTheme] = useState(0);
    const [assessments, setAssessments] = useState({});
    const [completedThemes, setCompletedThemes] = useState(new Set());

    // Ref per evitare loop infiniti con onUpdate
    const saveTimeoutRef = useRef(null);
    const lastSavedRef = useRef(null);

    // Criteri di valutazione rischi (scala 1-5)
    const riskCriteria = [
        {
            id: "probability",
            label: "Probabilità di Occorrenza",
            description: "Quanto è probabile che questo rischio si verifichi?",
            scale: {
                1: "Molto Bassa (<10%)",
                2: "Bassa (10-30%)",
                3: "Media (30-50%)",
                4: "Alta (50-70%)",
                5: "Molto Alta (>70%)",
            },
        },
        {
            id: "financial_impact",
            label: "Impatto Finanziario Potenziale",
            description: "Quale impatto economico avrebbe sul business?",
            scale: {
                1: "Trascurabile (<1% fatturato)",
                2: "Basso (1-3% fatturato)",
                3: "Medio (3-5% fatturato)",
                4: "Alto (5-10% fatturato)",
                5: "Molto Alto (>10% fatturato)",
            },
        },
        {
            id: "time_horizon",
            label: "Orizzonte Temporale",
            description: "Quando potrebbe manifestarsi questo rischio?",
            scale: {
                1: "Lungo Termine (>5 anni)",
                2: "Medio-Lungo (3-5 anni)",
                3: "Medio Termine (2-3 anni)",
                4: "Breve Termine (1-2 anni)",
                5: "Immediato (<1 anno)",
            },
        },
        {
            id: "mitigation_capacity",
            label: "Capacità di Mitigazione (inversa)",
            description: "Quanto è difficile gestire/prevenire questo rischio?",
            scale: {
                1: "Molto Facile (controllo completo)",
                2: "Facile (strumenti efficaci)",
                3: "Moderata (azioni parziali)",
                4: "Difficile (controllo limitato)",
                5: "Molto Difficile (nessun controllo)",
            },
        },
    ];

    // Criteri di valutazione opportunità (scala 1-5)
    const opportunityCriteria = [
        {
            id: "probability",
            label: "Probabilità di Realizzazione",
            description: "Quanto è probabile sfruttare questa opportunità?",
            scale: {
                1: "Molto Bassa (<10%)",
                2: "Bassa (10-30%)",
                3: "Media (30-50%)",
                4: "Alta (50-70%)",
                5: "Molto Alta (>70%)",
            },
        },
        {
            id: "financial_benefit",
            label: "Beneficio Economico Potenziale",
            description: "Quale vantaggio economico potrebbe generare?",
            scale: {
                1: "Trascurabile (<1% fatturato)",
                2: "Basso (1-3% fatturato)",
                3: "Medio (3-5% fatturato)",
                4: "Alto (5-10% fatturato)",
                5: "Molto Alto (>10% fatturato)",
            },
        },
        {
            id: "time_to_value",
            label: "Tempo per Benefici",
            description: "Quando si possono ottenere i benefici?",
            scale: {
                1: "Lungo Termine (>5 anni)",
                2: "Medio-Lungo (3-5 anni)",
                3: "Medio Termine (2-3 anni)",
                4: "Breve Termine (1-2 anni)",
                5: "Immediato (<1 anno)",
            },
        },
        {
            id: "exploitation_ease",
            label: "Facilità di Sfruttamento",
            description: "Quanto è facile cogliere questa opportunità?",
            scale: {
                1: "Molto Difficile (investimenti enormi)",
                2: "Difficile (risorse significative)",
                3: "Moderata (sforzo medio)",
                4: "Facile (risorse limitate)",
                5: "Molto Facile (risorse minime)",
            },
        },
    ];

    // Carica assessment esistente (solo al mount o quando cambia l'ID)
    useEffect(() => {
        if (existingAssessment?.assessments) {
            // Solo se diverso dall'ultimo salvato
            const existingStr = JSON.stringify(existingAssessment.assessments);
            const currentStr = JSON.stringify(assessments);

            if (existingStr !== currentStr && existingStr !== lastSavedRef.current) {
                setAssessments(existingAssessment.assessments);
                setCompletedThemes(new Set(existingAssessment.completedThemes || []));
                lastSavedRef.current = existingStr;
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Salva con debouncing per evitare loop infiniti
    const debouncedSave = useCallback(() => {
        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
        }

        saveTimeoutRef.current = setTimeout(() => {
            if (Object.keys(assessments).length > 0 && onUpdate) {
                const dataToSave = {
                    assessments,
                    completedThemes: Array.from(completedThemes),
                    timestamp: new Date().toISOString(),
                };

                const currentStr = JSON.stringify(dataToSave.assessments);
                if (currentStr !== lastSavedRef.current) {
                    lastSavedRef.current = currentStr;
                    onUpdate(dataToSave);
                }
            }
        }, 500); // Aspetta 500ms dopo l'ultimo cambiamento
    }, [assessments, completedThemes, onUpdate]);

    // Trigger debounced save quando cambiano i dati
    useEffect(() => {
        debouncedSave();
        return () => {
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current);
            }
        };
    }, [debouncedSave]);

    const handleRatingChange = (themeId, type, criterionId, value) => {
        setAssessments((prev) => ({
            ...prev,
            [themeId]: {
                ...prev[themeId],
                [type]: {
                    ...(prev[themeId]?.[type] || {}),
                    [criterionId]: parseFloat(value),
                },
            },
        }));
    };

    const handleNotesChange = (themeId, type, notes) => {
        setAssessments((prev) => ({
            ...prev,
            [themeId]: {
                ...prev[themeId],
                [`${type}_notes`]: notes,
            },
        }));
    };

    const calculateScore = (themeId, type) => {
        const ratings = assessments[themeId]?.[type];
        if (!ratings) return 0;

        const values = Object.values(ratings).filter((v) => typeof v === "number");
        if (values.length === 0) return 0;

        // Media ponderata (tutti i criteri hanno stesso peso)
        const sum = values.reduce((acc, val) => acc + val, 0);
        return parseFloat((sum / values.length).toFixed(2));
    };

    const calculateFinancialScore = (themeId) => {
        const riskScore = parseFloat(calculateScore(themeId, "risks"));
        const opportunityScore = parseFloat(calculateScore(themeId, "opportunities"));

        if (riskScore === 0 && opportunityScore === 0) return 0;

        // Formula doppia materialità: max tra rischio e opportunità
        // (se uno dei due è alto, il tema è finanziariamente materiale)
        return parseFloat(Math.max(riskScore, opportunityScore).toFixed(2));
    };

    const isThemeComplete = (themeId) => {
        const assessment = assessments[themeId];
        if (!assessment) return false;

        // Verifica che tutti i criteri rischi siano compilati
        const risksComplete = riskCriteria.every(
            (c) => assessment.risks?.[c.id] !== undefined
        );

        // Verifica che tutti i criteri opportunità siano compilati
        const opportunitiesComplete = opportunityCriteria.every(
            (c) => assessment.opportunities?.[c.id] !== undefined
        );

        return risksComplete && opportunitiesComplete;
    };

    const handleCompleteTheme = () => {
        const theme = selectedThemes[currentTheme];
        if (!isThemeComplete(theme.id)) {
            alert("⚠️ Compila tutti i criteri prima di procedere!");
            return;
        }

        setCompletedThemes((prev) => new Set([...prev, theme.id]));

        if (currentTheme < selectedThemes.length - 1) {
            setCurrentTheme(currentTheme + 1);
        } else {
            // Completato tutto
            if (onComplete) {
                onComplete({
                    assessments,
                    completedThemes: Array.from(completedThemes).concat(theme.id),
                    financialScores: selectedThemes.reduce((acc, t) => {
                        acc[t.id] = calculateFinancialScore(t.id);
                        return acc;
                    }, {}),
                });
            }
        }
    };

    const handlePreviousTheme = () => {
        if (currentTheme > 0) {
            setCurrentTheme(currentTheme - 1);
        }
    };

    if (!selectedThemes || selectedThemes.length === 0) {
        return (
            <div style={{ padding: "20px", textAlign: "center" }}>
                <p>⚠️ Nessun tema selezionato. Completa prima l'analisi ISO 26000.</p>
            </div>
        );
    }

    const theme = selectedThemes[currentTheme];
    const assessment = assessments[theme.id] || {};
    const progress = ((currentTheme + 1) / selectedThemes.length) * 100;

    return (
        <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "20px" }}>
            {/* Header */}
            <div
                style={{
                    backgroundColor: "#f8f9fa",
                    padding: "20px",
                    borderRadius: "8px",
                    marginBottom: "20px",
                }}
            >
                <h2 style={{ margin: "0 0 10px 0", color: "#1976d2" }}>
                    💰 Analisi Materialità Finanziaria
                </h2>
                <p style={{ margin: "0 0 15px 0", color: "#666" }}>
                    Valuta rischi e opportunità economico-finanziari per ciascun tema ESG
                    emerso dall'analisi ISO 26000
                </p>

                {/* Progress */}
                <div style={{ marginBottom: "10px" }}>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            fontSize: "14px",
                            marginBottom: "8px",
                        }}
                    >
                        <span>
                            Tema {currentTheme + 1} di {selectedThemes.length}
                        </span>
                        <span>{Math.round(progress)}% completato</span>
                    </div>
                    <div
                        style={{
                            width: "100%",
                            height: "8px",
                            backgroundColor: "#e0e0e0",
                            borderRadius: "4px",
                        }}
                    >
                        <div
                            style={{
                                width: `${progress}%`,
                                height: "100%",
                                backgroundColor: "#1976d2",
                                borderRadius: "4px",
                                transition: "width 0.3s ease",
                            }}
                        />
                    </div>
                </div>

                {/* Navigazione temi - Spiegazione */}
                <div style={{
                    fontSize: "12px",
                    color: "#666",
                    marginTop: "12px",
                    marginBottom: "8px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px"
                }}>
                    <span style={{ fontWeight: "bold" }}>💡 Navigazione rapida:</span>
                    <span>Clicca su un tema per saltare direttamente</span>
                    <span style={{
                        padding: "2px 6px",
                        background: "#1976d2",
                        color: "white",
                        borderRadius: "3px",
                        fontSize: "11px"
                    }}>→ Corrente</span>
                    <span style={{
                        padding: "2px 6px",
                        background: "#4caf50",
                        color: "white",
                        borderRadius: "3px",
                        fontSize: "11px"
                    }}>✓ Completato</span>
                </div>

                {/* Pulsanti Import/Export/Reset */}
                <div
                    style={{
                        display: "flex",
                        gap: "10px",
                        marginBottom: "10px",
                        flexWrap: "wrap",
                    }}
                >
                    <input
                        type="file"
                        accept=".json"
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                                const reader = new FileReader();
                                reader.onload = (event) => {
                                    try {
                                        const importedData = JSON.parse(event.target.result);
                                        if (importedData.assessments) {
                                            setAssessments(importedData.assessments);
                                            setCompletedThemes(new Set(importedData.completedThemes || []));
                                            console.log("📥 Analisi finanziaria importata:", importedData);
                                            alert("✅ Analisi finanziaria importata con successo!");
                                        } else {
                                            throw new Error("Formato file non valido");
                                        }
                                    } catch (error) {
                                        console.error("Errore importazione:", error);
                                        alert("❌ Errore nell'importazione: " + error.message);
                                    }
                                };
                                reader.readAsText(file);
                            }
                        }}
                        style={{ display: "none" }}
                        id="import-financial"
                    />
                    <label
                        htmlFor="import-financial"
                        style={{
                            padding: "6px 12px",
                            backgroundColor: "#4caf50",
                            color: "white",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontSize: "12px",
                            border: "none",
                        }}
                    >
                        📥 Importa JSON
                    </label>

                    <button
                        onClick={() => {
                            const exportData = {
                                assessments,
                                completedThemes: Array.from(completedThemes),
                                timestamp: new Date().toISOString(),
                                themes: selectedThemes.map(t => ({ id: t.id, name: t.name })),
                            };

                            const blob = new Blob([JSON.stringify(exportData, null, 2)], {
                                type: "application/json",
                            });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement("a");
                            a.href = url;
                            a.download = `analisi-finanziaria_${new Date().toISOString().split("T")[0]}.json`;
                            a.click();
                            URL.revokeObjectURL(url);
                            console.log("📤 Analisi finanziaria esportata:", exportData);
                        }}
                        style={{
                            padding: "6px 12px",
                            backgroundColor: "#2196f3",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontSize: "12px",
                        }}
                    >
                        📤 Esporta JSON
                    </button>

                    <button
                        onClick={() => {
                            if (
                                window.confirm(
                                    "⚠️ Vuoi resettare tutta l'analisi finanziaria? Tutti i dati andranno persi."
                                )
                            ) {
                                setAssessments({});
                                setCompletedThemes(new Set());
                                setCurrentTheme(0);
                                console.log("🔄 Analisi finanziaria resettata");
                            }
                        }}
                        style={{
                            padding: "6px 12px",
                            backgroundColor: "#f44336",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontSize: "12px",
                        }}
                    >
                        🔄 Reset
                    </button>
                </div>

                {/* Navigazione temi */}
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {selectedThemes.map((t, idx) => {
                        const isCompleted = completedThemes.has(t.id);
                        const isCurrent = idx === currentTheme;

                        return (
                            <button
                                key={t.id}
                                onClick={() => setCurrentTheme(idx)}
                                style={{
                                    padding: "6px 12px",
                                    borderRadius: "6px",
                                    border: "2px solid",
                                    fontSize: "12px",
                                    fontWeight: "bold",
                                    cursor: "pointer",
                                    backgroundColor: isCurrent
                                        ? "#1976d2"
                                        : isCompleted
                                            ? "#4caf50"
                                            : "#fff",
                                    color: isCurrent || isCompleted ? "white" : "#333",
                                    borderColor: isCurrent
                                        ? "#1976d2"
                                        : isCompleted
                                            ? "#4caf50"
                                            : "#ddd",
                                }}
                                title={t.name}
                            >
                                {t.code}
                                {isCompleted && " ✓"}
                                {isCurrent && " →"}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Tema corrente */}
            <div
                style={{
                    border: "2px solid #1976d2",
                    borderRadius: "8px",
                    padding: "20px",
                    backgroundColor: "white",
                    marginBottom: "20px",
                }}
            >
                <h3 style={{ margin: "0 0 10px 0", color: "#1976d2" }}>
                    {theme.name}
                </h3>

                {/* Indicatore completamento criteri */}
                <div style={{
                    marginBottom: "15px",
                    padding: "10px",
                    background: "#f5f5f5",
                    borderRadius: "6px",
                    fontSize: "13px"
                }}>
                    <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
                        <span>
                            <strong>Score Impatto:</strong> {theme.impactScore?.toFixed(2) || "N/A"}
                        </span>
                        <span>
                            <strong>Rischi:</strong> {
                                riskCriteria.filter(c => assessment.risks?.[c.id] !== undefined).length
                            } / {riskCriteria.length} ✓
                        </span>
                        <span>
                            <strong>Opportunità:</strong> {
                                opportunityCriteria.filter(c => assessment.opportunities?.[c.id] !== undefined).length
                            } / {opportunityCriteria.length} ✓
                        </span>
                        {isThemeComplete(theme.id) && (
                            <span style={{
                                color: "#4caf50",
                                fontWeight: "bold",
                                marginLeft: "auto"
                            }}>
                                ✅ Tema Completo
                            </span>
                        )}
                    </div>
                </div>

                {/* Sezione Rischi */}
                <div
                    style={{
                        marginBottom: "30px",
                        border: "1px solid #ff9800",
                        borderRadius: "8px",
                        padding: "20px",
                        backgroundColor: "#fff3e0",
                    }}
                >
                    <h4 style={{ margin: "0 0 15px 0", color: "#f57c00" }}>
                        ⚠️ Analisi Rischi
                    </h4>
                    <p style={{ margin: "0 0 20px 0", fontSize: "13px", color: "#666" }}>
                        Valuta i rischi finanziari associati a questo tema ESG
                    </p>

                    {riskCriteria.map((criterion) => (
                        <div
                            key={criterion.id}
                            style={{
                                marginBottom: "20px",
                                padding: "15px",
                                backgroundColor: "white",
                                borderRadius: "6px",
                            }}
                        >
                            <label
                                style={{
                                    display: "block",
                                    fontWeight: "bold",
                                    marginBottom: "5px",
                                    color: "#333",
                                }}
                            >
                                {criterion.label}
                            </label>
                            <p style={{ margin: "0 0 10px 0", fontSize: "13px", color: "#666" }}>
                                {criterion.description}
                            </p>

                            <div
                                style={{
                                    display: "flex",
                                    gap: "10px",
                                    alignItems: "center",
                                    flexWrap: "wrap",
                                }}
                            >
                                {[1, 2, 3, 4, 5].map((value) => (
                                    <label
                                        key={value}
                                        style={{
                                            flex: "1",
                                            minWidth: "150px",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "8px",
                                            cursor: "pointer",
                                            padding: "8px",
                                            border: "1px solid #ddd",
                                            borderRadius: "4px",
                                            backgroundColor:
                                                assessment.risks?.[criterion.id] === value
                                                    ? "#ffe0b2"
                                                    : "white",
                                        }}
                                    >
                                        <input
                                            type="radio"
                                            name={`risk_${theme.id}_${criterion.id}`}
                                            value={value}
                                            checked={assessment.risks?.[criterion.id] === value}
                                            onChange={(e) =>
                                                handleRatingChange(
                                                    theme.id,
                                                    "risks",
                                                    criterion.id,
                                                    e.target.value
                                                )
                                            }
                                            style={{ cursor: "pointer" }}
                                        />
                                        <span style={{ fontSize: "12px" }}>
                                            <strong>{value}</strong> - {criterion.scale[value]}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))}

                    {/* Note rischi */}
                    <div style={{ marginTop: "15px" }}>
                        <label
                            style={{
                                display: "block",
                                fontWeight: "bold",
                                marginBottom: "5px",
                            }}
                        >
                            📝 Note e Dettagli Rischi
                        </label>
                        <textarea
                            value={assessment.risks_notes || ""}
                            onChange={(e) =>
                                handleNotesChange(theme.id, "risks", e.target.value)
                            }
                            rows="3"
                            style={{
                                width: "100%",
                                padding: "10px",
                                border: "1px solid #ddd",
                                borderRadius: "4px",
                                fontFamily: "inherit",
                                fontSize: "13px",
                            }}
                            placeholder="Descrivi i principali rischi identificati, esempi concreti, casi storici..."
                        />
                    </div>

                    {/* Score rischi */}
                    <div
                        style={{
                            marginTop: "15px",
                            padding: "10px",
                            backgroundColor: "#fff",
                            borderRadius: "4px",
                            textAlign: "center",
                        }}
                    >
                        <strong>Score Rischi:</strong>{" "}
                        <span
                            style={{
                                fontSize: "20px",
                                color: "#f57c00",
                                fontWeight: "bold",
                            }}
                        >
                            {calculateScore(theme.id, "risks").toFixed(2)} / 5.0
                        </span>
                    </div>
                </div>

                {/* Sezione Opportunità */}
                <div
                    style={{
                        marginBottom: "20px",
                        border: "1px solid #4caf50",
                        borderRadius: "8px",
                        padding: "20px",
                        backgroundColor: "#e8f5e9",
                    }}
                >
                    <h4 style={{ margin: "0 0 15px 0", color: "#2e7d32" }}>
                        ✨ Analisi Opportunità
                    </h4>
                    <p style={{ margin: "0 0 20px 0", fontSize: "13px", color: "#666" }}>
                        Valuta le opportunità economiche associate a questo tema ESG
                    </p>

                    {opportunityCriteria.map((criterion) => (
                        <div
                            key={criterion.id}
                            style={{
                                marginBottom: "20px",
                                padding: "15px",
                                backgroundColor: "white",
                                borderRadius: "6px",
                            }}
                        >
                            <label
                                style={{
                                    display: "block",
                                    fontWeight: "bold",
                                    marginBottom: "5px",
                                    color: "#333",
                                }}
                            >
                                {criterion.label}
                            </label>
                            <p style={{ margin: "0 0 10px 0", fontSize: "13px", color: "#666" }}>
                                {criterion.description}
                            </p>

                            <div
                                style={{
                                    display: "flex",
                                    gap: "10px",
                                    alignItems: "center",
                                    flexWrap: "wrap",
                                }}
                            >
                                {[1, 2, 3, 4, 5].map((value) => (
                                    <label
                                        key={value}
                                        style={{
                                            flex: "1",
                                            minWidth: "150px",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "8px",
                                            cursor: "pointer",
                                            padding: "8px",
                                            border: "1px solid #ddd",
                                            borderRadius: "4px",
                                            backgroundColor:
                                                assessment.opportunities?.[criterion.id] === value
                                                    ? "#c8e6c9"
                                                    : "white",
                                        }}
                                    >
                                        <input
                                            type="radio"
                                            name={`opportunity_${theme.id}_${criterion.id}`}
                                            value={value}
                                            checked={
                                                assessment.opportunities?.[criterion.id] === value
                                            }
                                            onChange={(e) =>
                                                handleRatingChange(
                                                    theme.id,
                                                    "opportunities",
                                                    criterion.id,
                                                    e.target.value
                                                )
                                            }
                                            style={{ cursor: "pointer" }}
                                        />
                                        <span style={{ fontSize: "12px" }}>
                                            <strong>{value}</strong> - {criterion.scale[value]}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))}

                    {/* Note opportunità */}
                    <div style={{ marginTop: "15px" }}>
                        <label
                            style={{
                                display: "block",
                                fontWeight: "bold",
                                marginBottom: "5px",
                            }}
                        >
                            📝 Note e Dettagli Opportunità
                        </label>
                        <textarea
                            value={assessment.opportunities_notes || ""}
                            onChange={(e) =>
                                handleNotesChange(theme.id, "opportunities", e.target.value)
                            }
                            rows="3"
                            style={{
                                width: "100%",
                                padding: "10px",
                                border: "1px solid #ddd",
                                borderRadius: "4px",
                                fontFamily: "inherit",
                                fontSize: "13px",
                            }}
                            placeholder="Descrivi le principali opportunità identificate, potenziali vantaggi, esempi di successo..."
                        />
                    </div>

                    {/* Score opportunità */}
                    <div
                        style={{
                            marginTop: "15px",
                            padding: "10px",
                            backgroundColor: "#fff",
                            borderRadius: "4px",
                            textAlign: "center",
                        }}
                    >
                        <strong>Score Opportunità:</strong>{" "}
                        <span
                            style={{
                                fontSize: "20px",
                                color: "#2e7d32",
                                fontWeight: "bold",
                            }}
                        >
                            {calculateScore(theme.id, "opportunities").toFixed(2)} / 5.0
                        </span>
                    </div>
                </div>

                {/* Score finanziario finale */}
                <div
                    style={{
                        padding: "15px",
                        backgroundColor: "#e3f2fd",
                        borderRadius: "8px",
                        textAlign: "center",
                        border: "2px solid #1976d2",
                    }}
                >
                    <div style={{ fontSize: "14px", marginBottom: "5px" }}>
                        <strong>📊 Score Materialità Finanziaria</strong>
                    </div>
                    <div
                        style={{
                            fontSize: "32px",
                            fontWeight: "bold",
                            color: "#1976d2",
                        }}
                    >
                        {calculateFinancialScore(theme.id).toFixed(2)} / 5.0
                    </div>
                    <div style={{ fontSize: "12px", color: "#666" }}>
                        Formula: max(Score Rischi, Score Opportunità)
                    </div>
                </div>
            </div>

            {/* Pulsanti navigazione */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "10px",
                }}
            >
                <button
                    onClick={handlePreviousTheme}
                    disabled={currentTheme === 0}
                    title={currentTheme === 0 ? "Sei già al primo tema" : "Torna al tema precedente (puoi modificare le risposte)"}
                    style={{
                        padding: "12px 24px",
                        backgroundColor: currentTheme === 0 ? "#ccc" : "#757575",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: currentTheme === 0 ? "not-allowed" : "pointer",
                        fontSize: "14px",
                    }}
                >
                    ← Tema Precedente
                </button>

                <button
                    onClick={handleCompleteTheme}
                    disabled={!isThemeComplete(theme.id)}
                    title={
                        isThemeComplete(theme.id)
                            ? (currentTheme < selectedThemes.length - 1 ? "Passa al tema successivo" : "Completa l'analisi finanziaria")
                            : "⚠️ Compila tutti i criteri (rischi e opportunità) prima di procedere"
                    }
                    style={{
                        padding: "12px 24px",
                        backgroundColor: isThemeComplete(theme.id) ? "#4caf50" : "#ccc",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: isThemeComplete(theme.id) ? "pointer" : "not-allowed",
                        fontSize: "14px",
                        fontWeight: "bold",
                    }}
                >
                    {currentTheme < selectedThemes.length - 1
                        ? "Tema Successivo →"
                        : "Completa Analisi ✓"}
                </button>
            </div>

            {/* Info metodologia */}
            <div
                style={{
                    marginTop: "20px",
                    padding: "15px",
                    backgroundColor: "#fff8e1",
                    borderLeft: "4px solid #ffc107",
                    borderRadius: "4px",
                    fontSize: "13px",
                }}
            >
                <strong>ℹ️ Metodologia:</strong> L'analisi rischi/opportunità segue i
                principi della doppia materialità (CSRD/ESRS). Ogni tema riceve uno
                score finanziario (1-5) basato sul maggiore tra rischio e opportunità.
                Temi con score alto (&gt;3.0) sono considerati finanziariamente
                materiali e procederanno alla matrice doppia materialità finale.
            </div>
        </div>
    );
}
