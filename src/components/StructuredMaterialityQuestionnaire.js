import React, { useState, useEffect } from "react";
import {
    generateStructuredQuestionnaire,
    calculateMaterialityScoring,
} from "../utils/materialityFrameworkISO26000";
import useEvidenceManager from "../hooks/useEvidenceManager";

/**
 * Componente per questionario strutturato ISO 26000 basato su Materiality_.txt
 * Implementa raccolta dati robusta: Temi fondamentali → Aspetti specifici → Scoring
 */
function StructuredMaterialityQuestionnaire({
    onComplete,
    selectedThemes = [],
    audit,
    onUpdate,
}) {
    const [questionnaire, setQuestionnaire] = useState(null);
    const [responses, setResponses] = useState({});
    const [currentSection, setCurrentSection] = useState(0);
    const [completedSections, setCompletedSections] = useState(new Set());
    const [scoring, setScoring] = useState(null);

    // Hook per gestione evidenze (file e foto)
    const evidence = useEvidenceManager(audit, onUpdate);

    // Chiave per localStorage basata sui temi selezionati
    const storageKey = `iso26000_responses_${JSON.stringify(
        selectedThemes.map((t) => t.id).sort()
    ).replace(/[^a-zA-Z0-9]/g, "_")}`;

    useEffect(() => {
        // Genera questionario strutturato
        const generated = generateStructuredQuestionnaire(selectedThemes);
        setQuestionnaire(generated);

        // Carica risposte salvate se esistenti
        try {
            const savedData = localStorage.getItem(storageKey);
            if (savedData) {
                const {
                    responses: savedResponses,
                    currentSection: savedSection,
                    completedSections: savedCompleted,
                } = JSON.parse(savedData);
                setResponses(savedResponses || {});
                setCurrentSection(savedSection || 0);
                setCompletedSections(new Set(savedCompleted || []));
                console.log(
                    "📥 Risposte questionario ISO ripristinate:",
                    savedResponses
                );
            }
        } catch (error) {
            console.warn("⚠️ Errore nel ripristino dati questionario:", error);
        }
    }, [selectedThemes, storageKey]);

    // Salva automaticamente lo stato quando cambiano le risposte
    useEffect(() => {
        if (Object.keys(responses).length > 0) {
            try {
                const dataToSave = {
                    responses,
                    currentSection,
                    completedSections: Array.from(completedSections),
                    timestamp: new Date().toISOString(),
                };
                localStorage.setItem(storageKey, JSON.stringify(dataToSave));
                console.log("💾 Stato questionario salvato automaticamente");
            } catch (error) {
                console.warn("⚠️ Errore nel salvataggio automatico:", error);
            }
        }
    }, [responses, currentSection, completedSections, storageKey]);

    const handleResponseChange = (questionId, value, type = "rating") => {
        setResponses((prev) => ({
            ...prev,
            [questionId]: {
                value,
                type,
                timestamp: new Date().toISOString(),
            },
        }));
    };

    // Gestione caricamento evidenze per questionario ISO 26000
    const handleFileSelect = (questionId, source = "gallery") => {
        const input = document.createElement("input");
        input.type = "file";
        input.multiple = true;
        input.accept = source === "camera" ? "image/*" : "*/*";
        if (source === "camera") {
            input.capture = "environment"; // Camera posteriore
        }

        input.onchange = async (e) => {
            const fileList = Array.from(e.target.files || []);
            if (fileList.length && evidence.ready) {
                try {
                    await evidence.addFiles({
                        category: "ISO26000",
                        itemLabel: questionId,
                        fileList,
                    });
                    console.log(
                        `📎 Aggiunti ${fileList.length} file alla domanda ${questionId}`
                    );
                } catch (error) {
                    console.error("❌ Errore caricamento file:", error);
                }
            }
            // Pulisci l'input per permettere re-selezione dello stesso file
            document.body.removeChild(input);
        };

        document.body.appendChild(input);
        input.click();
    };

    const handleSectionComplete = () => {
        const section = questionnaire.sections[currentSection];
        const sectionResponses = section.questions.filter(
            (q) => q.required && !responses[q.id]
        );

        if (sectionResponses.length === 0) {
            setCompletedSections((prev) => new Set([...prev, currentSection]));

            if (currentSection < questionnaire.sections.length - 1) {
                setCurrentSection((prev) => prev + 1);
            } else {
                // Questionario completato - calcola scoring
                calculateAndDisplayResults();
            }
        } else {
            alert(
                `Completare le ${sectionResponses.length} domande obbligatorie prima di procedere.`
            );
        }
    };

    const calculateAndDisplayResults = () => {
        // Converti risposte in formato per calcolo
        const formattedResponses = Object.keys(responses).map((qId) => {
            const question = questionnaire.sections
                .flatMap((s) => s.questions)
                .find((q) => q.id === qId);

            return {
                questionId: qId,
                aspectCode: question?.aspectCode,
                type: question?.type,
                value: responses[qId].value,
                timestamp: responses[qId].timestamp,
            };
        });

        const results = calculateMaterialityScoring(formattedResponses);
        setScoring(results);

        if (onComplete) {
            onComplete({
                responses: formattedResponses,
                scoring: results,
                questionnaire,
            });
        }
    };

    if (!questionnaire) {
        return (
            <div style={{ padding: "20px", textAlign: "center" }}>
                <div>🔄 Generazione questionario strutturato ISO 26000...</div>
            </div>
        );
    }

    if (scoring) {
        return (
            <MaterialityResults
                scoring={scoring}
                questionnaire={questionnaire}
                onComplete={onComplete}
            />
        );
    }

    const section = questionnaire.sections[currentSection];
    const progress = ((currentSection + 1) / questionnaire.sections.length) * 100;

    return (
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
            {/* Header questionario */}
            <div
                style={{
                    backgroundColor: "#f8f9fa",
                    padding: "20px",
                    borderRadius: "8px",
                    marginBottom: "20px",
                }}
            >
                <h2 style={{ margin: "0 0 10px 0", color: "#1976d2" }}>
                    📋 {questionnaire.title}
                </h2>
                <p style={{ margin: "0", color: "#666" }}>
                    {questionnaire.description}
                </p>

                {/* Progress bar */}
                <div style={{ marginTop: "15px" }}>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            fontSize: "14px",
                            marginBottom: "10px",
                        }}
                    >
                        <span>
                            Sezione {currentSection + 1} di {questionnaire.sections.length}
                        </span>
                        <span>{Math.round(progress)}% completato</span>
                    </div>
                    <div
                        style={{
                            width: "100%",
                            height: "8px",
                            backgroundColor: "#e0e0e0",
                            borderRadius: "4px",
                            marginBottom: "15px",
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

                {/* Navigazione Sezioni e Controlli */}
                <div
                    style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "10px",
                        alignItems: "center",
                        justifyContent: "space-between",
                        backgroundColor: "#f0f4f8",
                        padding: "10px",
                        borderRadius: "8px",
                        marginTop: "10px",
                    }}
                >
                    {/* Pulsanti navigazione sezioni */}
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                        {questionnaire.sections.map((section, idx) => {
                            // Estrae il codice dalla sezione (DU, LA, AM, etc.)
                            const sectionCode = section.title.split(" - ")[0];
                            const isCompleted = completedSections.has(idx);
                            const isCurrent = idx === currentSection;

                            return (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentSection(idx)}
                                    style={{
                                        padding: "6px 12px",
                                        borderRadius: "6px",
                                        border: "2px solid",
                                        fontSize: "12px",
                                        fontWeight: "bold",
                                        cursor: "pointer",
                                        minWidth: "50px",
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
                                        transition: "all 0.2s ease",
                                    }}
                                    title={section.title}
                                >
                                    {sectionCode}
                                    {isCompleted && " ✓"}
                                    {isCurrent && " →"}
                                </button>
                            );
                        })}
                    </div>

                    {/* Controlli Import/Reset */}
                    <div style={{ display: "flex", gap: "8px" }}>
                        <input
                            type="file"
                            accept=".json"
                            onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                    const reader = new FileReader();
                                    reader.onload = (event) => {
                                        try {
                                            const importedData = JSON.parse(event.target.result);
                                            if (importedData.responses) {
                                                setResponses(importedData.responses);
                                                setCurrentSection(importedData.currentSection || 0);
                                                setCompletedSections(
                                                    new Set(importedData.completedSections || [])
                                                );
                                                console.log(
                                                    "📥 Dati questionario importati con successo"
                                                );
                                                alert("✅ Questionario importato con successo!");
                                            }
                                        } catch (error) {
                                            alert("❌ Errore nell'importazione: file non valido");
                                        }
                                    };
                                    reader.readAsText(file);
                                }
                            }}
                            style={{ display: "none" }}
                            id="import-questionnaire"
                        />
                        <label
                            htmlFor="import-questionnaire"
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
                                if (
                                    window.confirm(
                                        "⚠️ Vuoi resettare tutto il questionario? Tutti i dati andranno persi."
                                    )
                                ) {
                                    setResponses({});
                                    setCurrentSection(0);
                                    setCompletedSections(new Set());
                                    setScoring(null);
                                    localStorage.removeItem(storageKey);
                                    console.log("🔄 Questionario resettato");
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
                </div>
            </div>

            {/* Sezione corrente */}
            <div
                style={{
                    border: "2px solid #1976d2",
                    borderRadius: "8px",
                    padding: "20px",
                    backgroundColor: "white",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "20px",
                    }}
                >
                    <h3 style={{ margin: "0", color: "#1976d2" }}>{section.title}</h3>
                    <span
                        style={{
                            marginLeft: "10px",
                            padding: "4px 8px",
                            borderRadius: "12px",
                            fontSize: "12px",
                            fontWeight: "bold",
                            backgroundColor:
                                section.priority === "CRITICAL"
                                    ? "#ff5722"
                                    : section.priority === "HIGH"
                                        ? "#ff9800"
                                        : "#4caf50",
                            color: "white",
                        }}
                    >
                        {section.priority}
                    </span>
                </div>

                {/* Domande sezione */}
                <div style={{ display: "grid", gap: "20px" }}>
                    {section.questions.map((question, idx) => (
                        <div
                            key={question.id}
                            style={{
                                padding: "15px",
                                border: "1px solid #e0e0e0",
                                borderRadius: "6px",
                                backgroundColor: "#fafafa",
                            }}
                        >
                            <div style={{ marginBottom: "10px" }}>
                                <span style={{ fontWeight: "bold", color: "#333" }}>
                                    {idx + 1}. {question.text}
                                </span>
                                {question.required && (
                                    <span style={{ color: "#f44336", marginLeft: "4px" }}>*</span>
                                )}
                            </div>

                            {question.type === "rating_scale" && (
                                <div
                                    style={{ display: "flex", gap: "10px", alignItems: "center" }}
                                >
                                    <span style={{ fontSize: "14px", color: "#666" }}>
                                        {question.scale.labels[0]}
                                    </span>
                                    {[1, 2, 3, 4, 5].map((value) => (
                                        <label
                                            key={value}
                                            style={{
                                                display: "flex",
                                                flexDirection: "column",
                                                alignItems: "center",
                                                cursor: "pointer",
                                            }}
                                        >
                                            <input
                                                type="radio"
                                                name={question.id}
                                                value={value}
                                                checked={responses[question.id]?.value === value}
                                                onChange={(e) =>
                                                    handleResponseChange(
                                                        question.id,
                                                        parseInt(e.target.value)
                                                    )
                                                }
                                                style={{ marginBottom: "4px" }}
                                            />
                                            <span style={{ fontSize: "12px" }}>{value}</span>
                                        </label>
                                    ))}
                                    <span style={{ fontSize: "14px", color: "#666" }}>
                                        {question.scale.labels[4]}
                                    </span>
                                </div>
                            )}

                            {question.type === "open_text" && (
                                <div>
                                    <textarea
                                        placeholder="Inserisci il tuo commento..."
                                        value={responses[question.id]?.value || ""}
                                        onChange={(e) =>
                                            handleResponseChange(question.id, e.target.value, "text")
                                        }
                                        style={{
                                            width: "100%",
                                            minHeight: "80px",
                                            padding: "8px",
                                            border: "1px solid #ddd",
                                            borderRadius: "4px",
                                            fontSize: "14px",
                                        }}
                                    />

                                    {/* Controlli evidenze per domande con dettagli */}
                                    {evidence.ready && (
                                        <div
                                            style={{
                                                marginTop: "12px",
                                                padding: "10px",
                                                backgroundColor: "#f8f9fa",
                                                borderRadius: "6px",
                                                border: "1px solid #e9ecef",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    display: "flex",
                                                    gap: "8px",
                                                    alignItems: "center",
                                                    marginBottom: "8px",
                                                }}
                                            >
                                                <button
                                                    onClick={() =>
                                                        handleFileSelect(question.id, "gallery")
                                                    }
                                                    style={{
                                                        padding: "6px 12px",
                                                        backgroundColor: "#007bff",
                                                        color: "white",
                                                        border: "none",
                                                        borderRadius: "4px",
                                                        cursor: "pointer",
                                                        fontSize: "13px",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: "4px",
                                                    }}
                                                >
                                                    📁 Aggiungi File
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        handleFileSelect(question.id, "camera")
                                                    }
                                                    style={{
                                                        padding: "6px 12px",
                                                        backgroundColor: "#28a745",
                                                        color: "white",
                                                        border: "none",
                                                        borderRadius: "4px",
                                                        cursor: "pointer",
                                                        fontSize: "13px",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: "4px",
                                                    }}
                                                >
                                                    📷 Scatta Foto
                                                </button>

                                                <span
                                                    style={{
                                                        fontSize: "12px",
                                                        color: "#666",
                                                        marginLeft: "8px",
                                                    }}
                                                >
                                                    Evidenze:{" "}
                                                    {evidence.list("ISO26000", question.id).length}
                                                </span>
                                            </div>

                                            {/* Lista evidenze esistenti */}
                                            {evidence.list("ISO26000", question.id).length > 0 && (
                                                <div style={{ marginTop: "8px" }}>
                                                    <div
                                                        style={{
                                                            fontSize: "12px",
                                                            fontWeight: "bold",
                                                            marginBottom: "4px",
                                                        }}
                                                    >
                                                        📎 Evidenze allegate:
                                                    </div>
                                                    {evidence
                                                        .list("ISO26000", question.id)
                                                        .map((file, index) => (
                                                            <div
                                                                key={index}
                                                                style={{
                                                                    display: "flex",
                                                                    justifyContent: "space-between",
                                                                    alignItems: "center",
                                                                    padding: "4px 8px",
                                                                    backgroundColor: "white",
                                                                    borderRadius: "4px",
                                                                    marginBottom: "2px",
                                                                    fontSize: "12px",
                                                                }}
                                                            >
                                                                <span style={{ color: "#495057" }}>
                                                                    📄 {file.name}
                                                                    {file.size && (
                                                                        <span
                                                                            style={{
                                                                                color: "#6c757d",
                                                                                marginLeft: "8px",
                                                                            }}
                                                                        >
                                                                            ({Math.round(file.size / 1024)}KB)
                                                                        </span>
                                                                    )}
                                                                </span>
                                                                <button
                                                                    onClick={() =>
                                                                        evidence.removeFile({
                                                                            category: "ISO26000",
                                                                            itemLabel: question.id,
                                                                            index,
                                                                        })
                                                                    }
                                                                    style={{
                                                                        background: "none",
                                                                        border: "none",
                                                                        color: "#dc3545",
                                                                        cursor: "pointer",
                                                                        fontSize: "14px",
                                                                        padding: "2px",
                                                                    }}
                                                                    title="Rimuovi evidenza"
                                                                >
                                                                    🗑️
                                                                </button>
                                                            </div>
                                                        ))}
                                                </div>
                                            )}

                                            {/* Messaggio di errore se presente */}
                                            {evidence.error && (
                                                <div
                                                    style={{
                                                        color: "#dc3545",
                                                        fontSize: "11px",
                                                        marginTop: "4px",
                                                        padding: "4px 8px",
                                                        backgroundColor: "#f8d7da",
                                                        borderRadius: "4px",
                                                    }}
                                                >
                                                    ⚠️ {evidence.error}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Navigation */}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginTop: "30px",
                        paddingTop: "20px",
                        borderTop: "1px solid #e0e0e0",
                    }}
                >
                    <button
                        onClick={() => setCurrentSection((prev) => Math.max(0, prev - 1))}
                        disabled={currentSection === 0}
                        style={{
                            padding: "10px 20px",
                            backgroundColor: currentSection === 0 ? "#e0e0e0" : "#6c757d",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: currentSection === 0 ? "not-allowed" : "pointer",
                        }}
                    >
                        ← Sezione Precedente
                    </button>

                    <button
                        onClick={handleSectionComplete}
                        style={{
                            padding: "10px 20px",
                            backgroundColor: "#1976d2",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontWeight: "bold",
                        }}
                    >
                        {currentSection === questionnaire.sections.length - 1
                            ? "🎯 Completa Valutazione"
                            : "Sezione Successiva →"}
                    </button>
                </div>
            </div>

            {/* Mini-mappa sezioni */}
            <div
                style={{
                    marginTop: "20px",
                    padding: "15px",
                    backgroundColor: "#f5f5f5",
                    borderRadius: "6px",
                }}
            >
                <div
                    style={{ fontSize: "14px", fontWeight: "bold", marginBottom: "10px" }}
                >
                    Progresso Sezioni:
                </div>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {questionnaire.sections.map((sec, idx) => (
                        <div
                            key={idx}
                            style={{
                                padding: "6px 10px",
                                borderRadius: "4px",
                                fontSize: "12px",
                                fontWeight: "bold",
                                backgroundColor: completedSections.has(idx)
                                    ? "#4caf50"
                                    : idx === currentSection
                                        ? "#1976d2"
                                        : "#e0e0e0",
                                color:
                                    completedSections.has(idx) || idx === currentSection
                                        ? "white"
                                        : "#666",
                            }}
                        >
                            {sec.title.split(" - ")[0]}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

/**
 * Componente per visualizzazione risultati materialità
 */
function MaterialityResults({ scoring, questionnaire, onComplete }) {
    return (
        <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "20px" }}>
            <h2 style={{ color: "#1976d2", marginBottom: "20px" }}>
                📊 Risultati Analisi Materialità ISO 26000
            </h2>

            {/* Temi prioritari */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "20px",
                    marginBottom: "30px",
                }}
            >
                <div
                    style={{
                        padding: "20px",
                        border: "2px solid #4caf50",
                        borderRadius: "8px",
                    }}
                >
                    <h4 style={{ margin: "0 0 15px 0", color: "#4caf50" }}>
                        🎯 Top 5 Temi Prioritari
                    </h4>
                    {scoring.overallPriority.slice(0, 5).map((theme, idx) => (
                        <div
                            key={theme}
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                padding: "8px 0",
                                borderBottom: idx < 4 ? "1px solid #e0e0e0" : "none",
                            }}
                        >
                            <span>{theme}</span>
                            <span style={{ fontWeight: "bold" }}>
                                {scoring.themeScores[theme].score.toFixed(1)}/5.0
                            </span>
                        </div>
                    ))}
                </div>

                <div
                    style={{
                        padding: "20px",
                        border: "2px solid #ff5722",
                        borderRadius: "8px",
                    }}
                >
                    <h4 style={{ margin: "0 0 15px 0", color: "#ff5722" }}>
                        🚨 Raccomandazioni Immediate
                    </h4>
                    {scoring.recommendations.map((rec, idx) => (
                        <div
                            key={idx}
                            style={{
                                padding: "10px",
                                backgroundColor: "#fff3e0",
                                borderRadius: "4px",
                                marginBottom: "8px",
                            }}
                        >
                            <div style={{ fontWeight: "bold", color: "#ff5722" }}>
                                {rec.type.replace("_", " ")}
                            </div>
                            <div style={{ fontSize: "14px", marginTop: "4px" }}>
                                {rec.message}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Dettaglio scoring per tema */}
            <div style={{ marginBottom: "30px" }}>
                <h4 style={{ color: "#1976d2", marginBottom: "15px" }}>
                    📈 Scoring Dettagliato per Tema
                </h4>
                <div style={{ display: "grid", gap: "15px" }}>
                    {Object.keys(scoring.themeScores).map((themeName) => {
                        const theme = scoring.themeScores[themeName];
                        const percentage = ((theme?.score || 0) / 5) * 100;

                        // Verifica sicurezza dei dati
                        if (!theme || typeof theme.score === "undefined") {
                            console.warn(`⚠️ Dati tema incompleti per: ${themeName}`, theme);
                            return null;
                        }

                        return (
                            <div
                                key={themeName}
                                style={{
                                    padding: "15px",
                                    border: "1px solid #e0e0e0",
                                    borderRadius: "6px",
                                    backgroundColor: "#fafafa",
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        marginBottom: "10px",
                                    }}
                                >
                                    <span style={{ fontWeight: "bold" }}>
                                        {theme.code || "N/A"} - {themeName}
                                    </span>
                                    <span
                                        style={{
                                            padding: "4px 8px",
                                            borderRadius: "12px",
                                            fontSize: "12px",
                                            fontWeight: "bold",
                                            backgroundColor:
                                                theme.priority === "CRITICAL"
                                                    ? "#ff5722"
                                                    : theme.priority === "HIGH"
                                                        ? "#ff9800"
                                                        : "#4caf50",
                                            color: "white",
                                        }}
                                    >
                                        {theme.priority || "MEDIUM"}
                                    </span>
                                </div>

                                <div
                                    style={{ display: "flex", alignItems: "center", gap: "10px" }}
                                >
                                    <div
                                        style={{
                                            flex: 1,
                                            height: "8px",
                                            backgroundColor: "#e0e0e0",
                                            borderRadius: "4px",
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: `${percentage}%`,
                                                height: "100%",
                                                backgroundColor:
                                                    percentage >= 80
                                                        ? "#4caf50"
                                                        : percentage >= 60
                                                            ? "#ff9800"
                                                            : "#ff5722",
                                                borderRadius: "4px",
                                            }}
                                        />
                                    </div>
                                    <span style={{ fontWeight: "bold", minWidth: "60px" }}>
                                        {(theme.score || 0).toFixed(1)}/5.0
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Export risultati */}
            <div
                style={{
                    textAlign: "center",
                    display: "flex",
                    gap: "15px",
                    justifyContent: "center",
                }}
            >
                <button
                    onClick={() => {
                        const results = {
                            timestamp: new Date().toISOString(),
                            questionnaire: questionnaire.title,
                            scoring,
                            summary: {
                                totalThemes: Object.keys(scoring.themeScores).length,
                                topThemes: scoring.overallPriority.slice(0, 5),
                                recommendations: scoring.recommendations,
                            },
                        };

                        const blob = new Blob([JSON.stringify(results, null, 2)], {
                            type: "application/json",
                        });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = `Materiality_Results_${new Date().toISOString().split("T")[0]
                            }.json`;
                        a.click();
                        URL.revokeObjectURL(url);
                    }}
                    style={{
                        padding: "12px 24px",
                        backgroundColor: "#1976d2",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontWeight: "bold",
                        fontSize: "16px",
                    }}
                >
                    📄 Esporta Risultati Completi
                </button>

                <button
                    onClick={() => {
                        console.log("🧪 TEST - Trigger manuale aggiornamento matrice");
                        console.log("🧪 TEST - Scoring corrente:", scoring);

                        // Chiama direttamente onComplete per testare
                        if (onComplete) {
                            const testResults = {
                                responses: [],
                                scoring,
                                questionnaire,
                            };
                            console.log("🧪 TEST - Chiamando onComplete con:", testResults);
                            onComplete(testResults);
                        }
                    }}
                    style={{
                        padding: "12px 24px",
                        backgroundColor: "#ff9800",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontWeight: "bold",
                        fontSize: "16px",
                    }}
                >
                    🧪 Test Aggiorna Matrice
                </button>
            </div>
        </div>
    );
}

export default StructuredMaterialityQuestionnaire;
