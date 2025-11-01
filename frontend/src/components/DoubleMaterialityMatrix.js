import React, { useState, useEffect } from "react";
import { useStorage } from "../storage/StorageContext";
import {
    createExportPayload,
    exportWithFallback,
} from "../utils/exportHelper";

/**
 * Componente Matrice Doppia Materialità
 * Incrocia Materialità d'Impatto (ISO 26000 - asse Y) con Materialità Finanziaria (Rischi/Opportunità - asse X)
 * 
 * Output: Temi nel quadrante alto-dx sono doppiamente materiali → vanno nel bilancio sostenibilità
 */
export default function DoubleMaterialityMatrix({
    impactScores = {}, // Scores da ISO 26000 { themeId: 3.5, ... }
    financialScores = {}, // Scores da analisi rischi/opportunità { themeId: 4.2, ... }
    themes = [], // Array temi con {id, code, name, description}
    threshold = 3.0, // Soglia per considerare tema materiale
    onThemeClick,
    onJustificationUpdate, // Callback per salvare giustificazioni esclusioni
    exclusionJustifications = {}, // Giustificazioni esistenti { themeId: "testo..." }
    audit, // ✅ Aggiunto per export standardizzato
}) {
    // Hook per accesso File System Provider
    const fsProvider = useStorage();
    const [selectedTheme, setSelectedTheme] = useState(null);
    const [quadrantCounts, setQuadrantCounts] = useState({
        highHigh: 0,
        highLow: 0,
        lowHigh: 0,
        lowLow: 0,
    });
    const [showJustifications, setShowJustifications] = useState(false);
    const [justifications, setJustifications] = useState(exclusionJustifications);

    // Calcola distribuzione temi nei quadranti
    useEffect(() => {
        const counts = { highHigh: 0, highLow: 0, lowHigh: 0, lowLow: 0 };

        themes.forEach((theme) => {
            const impact = parseFloat(impactScores[theme.id]) || 0;
            const financial = parseFloat(financialScores[theme.id]) || 0;

            if (impact >= threshold && financial >= threshold) {
                counts.highHigh++;
            } else if (impact >= threshold && financial < threshold) {
                counts.highLow++;
            } else if (impact < threshold && financial >= threshold) {
                counts.lowHigh++;
            } else {
                counts.lowLow++;
            }
        });

        setQuadrantCounts(counts);
    }, [themes, impactScores, financialScores, threshold]);

    // Determina quadrante tema
    const getQuadrant = (themeId) => {
        const impact = parseFloat(impactScores[themeId]) || 0;
        const financial = parseFloat(financialScores[themeId]) || 0;

        if (impact >= threshold && financial >= threshold) return "highHigh";
        if (impact >= threshold && financial < threshold) return "highLow";
        if (impact < threshold && financial >= threshold) return "lowHigh";
        return "lowLow";
    };

    // Colore tema basato su quadrante
    const getThemeColor = (quadrant) => {
        const colors = {
            highHigh: "#4caf50", // Verde - Doppiamente materiale
            highLow: "#ff9800", // Arancione - Solo impatto
            lowHigh: "#2196f3", // Blu - Solo finanziario
            lowLow: "#9e9e9e", // Grigio - Non materiale
        };
        return colors[quadrant];
    };

    // Converti score (1-5) in coordinata canvas (0-400px)
    const scoreToPixel = (score, axis) => {
        const maxScore = 5.0;
        const canvasSize = 400;
        const margin = 50;
        const effectiveSize = canvasSize - margin * 2;

        const normalized = Math.max(0, Math.min(maxScore, score)) / maxScore;

        if (axis === "x") {
            // Asse X (finanziario): 0 a sinistra, 5 a destra
            return margin + normalized * effectiveSize;
        } else {
            // Asse Y (impatto): 0 in basso, 5 in alto (inverti)
            return canvasSize - (margin + normalized * effectiveSize);
        }
    };

    const handleThemeClick = (theme) => {
        setSelectedTheme(theme);
        if (onThemeClick) {
            onThemeClick(theme);
        }
    };

    // Funzione export completo risultati materialità
    const exportMaterialityResults = (format = 'json') => {
        // Prepara dati completi per export
        const exportData = {
            metadata: {
                exportDate: new Date().toISOString(),
                format: 'ESRS Compliant Double Materiality Analysis',
                threshold,
                totalThemes: themes.length,
            },
            quadrants: {
                doubleMaterial: {
                    count: quadrantCounts.highHigh,
                    themes: themes.filter(t => getQuadrant(t.id) === 'highHigh').map(t => ({
                        id: t.id,
                        name: t.name || t.id,
                        code: t.code,
                        impactScore: parseFloat(impactScores[t.id]) || 0,
                        financialScore: parseFloat(financialScores[t.id]) || 0,
                        classification: 'Doppiamente Materiale',
                        esrsApplicable: true,
                    }))
                },
                impactOnly: {
                    count: quadrantCounts.highLow,
                    themes: themes.filter(t => getQuadrant(t.id) === 'highLow').map(t => ({
                        id: t.id,
                        name: t.name || t.id,
                        code: t.code,
                        impactScore: parseFloat(impactScores[t.id]) || 0,
                        financialScore: parseFloat(financialScores[t.id]) || 0,
                        classification: 'Materiale d\'Impatto',
                        esrsApplicable: false,
                    }))
                },
                financialOnly: {
                    count: quadrantCounts.lowHigh,
                    themes: themes.filter(t => getQuadrant(t.id) === 'lowHigh').map(t => ({
                        id: t.id,
                        name: t.name || t.id,
                        code: t.code,
                        impactScore: parseFloat(impactScores[t.id]) || 0,
                        financialScore: parseFloat(financialScores[t.id]) || 0,
                        classification: 'Materiale Finanziario',
                        esrsApplicable: false,
                    }))
                },
                nonMaterial: {
                    count: quadrantCounts.lowLow,
                    themes: themes.filter(t => getQuadrant(t.id) === 'lowLow').map(t => ({
                        id: t.id,
                        name: t.name || t.id,
                        code: t.code,
                        impactScore: parseFloat(impactScores[t.id]) || 0,
                        financialScore: parseFloat(financialScores[t.id]) || 0,
                        classification: 'Non Materiale',
                        exclusionJustification: justifications[t.id] || '',
                        esrsApplicable: false,
                    }))
                }
            },
            allThemes: themes.map(t => {
                const quadrant = getQuadrant(t.id);
                const impact = parseFloat(impactScores[t.id]) || 0;
                const financial = parseFloat(financialScores[t.id]) || 0;
                const isBorderline = (impact >= 2.5 && impact < threshold) || (financial >= 2.5 && financial < threshold);

                return {
                    id: t.id,
                    name: t.name || t.id,
                    code: t.code,
                    impactScore: impact,
                    financialScore: financial,
                    quadrant: quadrant === 'highHigh' ? 'Doppiamente Materiale' :
                        quadrant === 'highLow' ? 'Materiale d\'Impatto' :
                            quadrant === 'lowHigh' ? 'Materiale Finanziario' : 'Non Materiale',
                    esrsApplicable: quadrant === 'highHigh',
                    isBorderline,
                    exclusionJustification: quadrant === 'lowLow' || quadrant === 'highLow' || quadrant === 'lowHigh' ? (justifications[t.id] || '') : null,
                };
            }),
            summary: {
                totalThemes: themes.length,
                materialThemes: quadrantCounts.highHigh + quadrantCounts.highLow + quadrantCounts.lowHigh,
                doubleMaterialThemes: quadrantCounts.highHigh,
                nonMaterialThemes: quadrantCounts.lowLow,
                justifiedExclusions: Object.values(justifications).filter(j => j && j.trim()).length,
                borderlineThemes: themes.filter(t => {
                    const impact = parseFloat(impactScores[t.id]) || 0;
                    const financial = parseFloat(financialScores[t.id]) || 0;
                    return (impact >= 2.5 && impact < threshold) || (financial >= 2.5 && financial < threshold);
                }).length,
            }
        };

        if (format === 'json') {
            // Export JSON standardizzato
            (async () => {
                try {
                    const payload = createExportPayload(
                        "materiality_matrix",
                        exportData,
                        audit
                    );

                    await exportWithFallback(fsProvider, "matrix", payload, {
                        azienda: audit?.azienda,
                        anno: audit?.anno,
                    });
                } catch (error) {
                    console.error("❌ Errore export matrice:", error);
                    alert(
                        `❌ Errore durante l'export:\n\n${error.message}\n\nVerifica la console per dettagli.`
                    );
                }
            })();
        } else if (format === 'csv') {
            // CSV semplificato per Excel
            const csvRows = [
                ['ID Tema', 'Nome Tema', 'Codice', 'Score Impatto', 'Score Finanziario', 'Quadrante', 'ESRS Applicabile', 'Borderline', 'Giustificazione Esclusione'],
                ...exportData.allThemes.map(t => [
                    t.id,
                    t.name,
                    t.code || '',
                    t.impactScore.toFixed(2),
                    t.financialScore.toFixed(2),
                    t.quadrant,
                    t.esrsApplicable ? 'Sì' : 'No',
                    t.isBorderline ? 'Sì' : 'No',
                    t.exclusionJustification || ''
                ])
            ];

            const csvContent = csvRows.map(row =>
                row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
            ).join('\n');

            const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `materiality-analysis-results_${new Date().toISOString().split("T")[0]}.csv`;
            a.click();
            URL.revokeObjectURL(url);
            console.log("📤 Risultati materialità esportati (CSV)");
        }
    };

    return (
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
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
                    📊 Matrice Doppia Materialità
                </h2>
                <p style={{ margin: "0", color: "#666" }}>
                    Incrocio tra <strong>Materialità d'Impatto</strong> (ISO 26000 - asse
                    Y) e <strong>Materialità Finanziaria</strong> (Rischi/Opportunità -
                    asse X)
                </p>
            </div>

            {/* Pulsanti Export */}
            <div
                style={{
                    backgroundColor: "#e8f5e9",
                    padding: "15px",
                    borderRadius: "8px",
                    marginBottom: "20px",
                    border: "1px solid #4caf50",
                }}
            >
                <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
                    <span style={{ fontWeight: "bold", color: "#2e7d32" }}>
                        📤 Esporta Risultati Completi:
                    </span>
                    <button
                        onClick={() => exportMaterialityResults('json')}
                        style={{
                            padding: "8px 16px",
                            backgroundColor: "#4caf50",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontWeight: "bold",
                        }}
                    >
                        📊 JSON Completo
                    </button>
                    <button
                        onClick={() => exportMaterialityResults('csv')}
                        style={{
                            padding: "8px 16px",
                            backgroundColor: "#2e7d32",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontWeight: "bold",
                        }}
                    >
                        📈 Excel/CSV
                    </button>
                    <span style={{ marginLeft: "10px", fontSize: "14px", color: "#555" }}>
                        Include: quadranti, scores, giustificazioni, statistiche
                    </span>
                </div>
            </div>

            <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
                {/* Matrice Canvas */}
                <div style={{
                    flex: "1 1 500px",
                    paddingLeft: "60px" // Spazio per label asse Y
                }}>
                    <div
                        style={{
                            position: "relative",
                            width: "400px",
                            height: "400px",
                            border: "2px solid #333",
                            backgroundColor: "white",
                            margin: "0 auto",
                        }}
                    >
                        {/* Sfondo quadranti */}
                        <div
                            style={{
                                position: "absolute",
                                top: 0,
                                right: 0,
                                width: "50%",
                                height: "50%",
                                backgroundColor: "rgba(76, 175, 80, 0.1)",
                            }}
                            title="Alto Impatto + Alto Finanziario = DOPPIAMENTE MATERIALE"
                        />
                        <div
                            style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "50%",
                                height: "50%",
                                backgroundColor: "rgba(255, 152, 0, 0.1)",
                            }}
                            title="Alto Impatto + Basso Finanziario = MATERIALE D'IMPATTO"
                        />
                        <div
                            style={{
                                position: "absolute",
                                bottom: 0,
                                right: 0,
                                width: "50%",
                                height: "50%",
                                backgroundColor: "rgba(33, 150, 243, 0.1)",
                            }}
                            title="Basso Impatto + Alto Finanziario = MATERIALE FINANZIARIO"
                        />
                        <div
                            style={{
                                position: "absolute",
                                bottom: 0,
                                left: 0,
                                width: "50%",
                                height: "50%",
                                backgroundColor: "rgba(158, 158, 158, 0.05)",
                            }}
                            title="Basso Impatto + Basso Finanziario = NON MATERIALE"
                        />

                        {/* Linee soglia */}
                        <div
                            style={{
                                position: "absolute",
                                top: `${scoreToPixel(threshold, "y")}px`,
                                left: "50px",
                                right: "50px",
                                height: "2px",
                                backgroundColor: "#f44336",
                                zIndex: 1,
                            }}
                        />
                        <div
                            style={{
                                position: "absolute",
                                left: `${scoreToPixel(threshold, "x")}px`,
                                top: "50px",
                                bottom: "50px",
                                width: "2px",
                                backgroundColor: "#f44336",
                                zIndex: 1,
                            }}
                        />

                        {/* Assi */}
                        <div
                            style={{
                                position: "absolute",
                                bottom: "50px",
                                left: "50px",
                                right: "50px",
                                height: "2px",
                                backgroundColor: "#333",
                                zIndex: 2,
                            }}
                        />
                        <div
                            style={{
                                position: "absolute",
                                left: "50px",
                                top: "50px",
                                bottom: "50px",
                                width: "2px",
                                backgroundColor: "#333",
                                zIndex: 2,
                            }}
                        />

                        {/* Label assi */}
                        <div
                            style={{
                                position: "absolute",
                                bottom: "10px",
                                left: "50%",
                                transform: "translateX(-50%)",
                                fontSize: "12px",
                                fontWeight: "bold",
                                color: "#333",
                            }}
                        >
                            Materialità Finanziaria →
                        </div>
                        <div
                            style={{
                                position: "absolute",
                                left: "-140px",
                                top: "50%",
                                transform: "translateY(-50%) rotate(-90deg)",
                                fontSize: "12px",
                                fontWeight: "bold",
                                color: "#333",
                                width: "300px",
                                textAlign: "center",
                            }}
                        >
                            Materialità d'Impatto →
                        </div>

                        {/* Scala assi */}
                        {[1, 2, 3, 4, 5].map((tick) => (
                            <React.Fragment key={tick}>
                                {/* Tick asse X */}
                                <div
                                    style={{
                                        position: "absolute",
                                        left: `${scoreToPixel(tick, "x")}px`,
                                        bottom: "28px",
                                        fontSize: "10px",
                                        color: "#666",
                                        transform: "translateX(-50%)",
                                    }}
                                >
                                    {tick}
                                </div>
                                {/* Tick asse Y */}
                                <div
                                    style={{
                                        position: "absolute",
                                        left: "35px",
                                        top: `${scoreToPixel(tick, "y")}px`,
                                        fontSize: "10px",
                                        color: "#666",
                                        transform: "translateY(-50%)",
                                    }}
                                >
                                    {tick}
                                </div>
                            </React.Fragment>
                        ))}

                        {/* Temi plottati */}
                        {themes.map((theme) => {
                            const impact = parseFloat(impactScores[theme.id]) || 0;
                            const financial = parseFloat(financialScores[theme.id]) || 0;
                            const quadrant = getQuadrant(theme.id);
                            const color = getThemeColor(quadrant);

                            const x = scoreToPixel(financial, "x");
                            const y = scoreToPixel(impact, "y");

                            return (
                                <div
                                    key={theme.id}
                                    onClick={() => handleThemeClick(theme)}
                                    style={{
                                        position: "absolute",
                                        left: `${x}px`,
                                        top: `${y}px`,
                                        width: "30px",
                                        height: "30px",
                                        borderRadius: "50%",
                                        backgroundColor: color,
                                        border: "2px solid white",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: "10px",
                                        fontWeight: "bold",
                                        color: "white",
                                        cursor: "pointer",
                                        transform: "translate(-50%, -50%)",
                                        zIndex: selectedTheme?.id === theme.id ? 100 : 10,
                                        boxShadow:
                                            selectedTheme?.id === theme.id
                                                ? "0 0 0 3px rgba(25, 118, 210, 0.5)"
                                                : "0 2px 4px rgba(0,0,0,0.2)",
                                        transition: "all 0.2s ease",
                                    }}
                                    title={`${theme.code}: ${theme.name}\nImpatto: ${impact.toFixed(
                                        2
                                    )} | Finanziario: ${financial.toFixed(2)}`}
                                >
                                    {theme.code}
                                </div>
                            );
                        })}
                    </div>

                    {/* Legenda Quadranti */}
                    <div
                        style={{
                            marginTop: "20px",
                            display: "grid",
                            gridTemplateColumns: "repeat(2, 1fr)",
                            gap: "10px",
                        }}
                    >
                        <div
                            style={{
                                padding: "10px",
                                backgroundColor: "rgba(76, 175, 80, 0.1)",
                                border: "2px solid #4caf50",
                                borderRadius: "4px",
                                fontSize: "12px",
                            }}
                        >
                            <strong style={{ color: "#4caf50" }}>
                                ✅ Doppiamente Materiale
                            </strong>
                            <div style={{ marginTop: "5px", color: "#666" }}>
                                {quadrantCounts.highHigh} temi
                            </div>
                            <div style={{ fontSize: "11px", color: "#666" }}>
                                Alto impatto + Alto finanziario
                            </div>
                        </div>

                        <div
                            style={{
                                padding: "10px",
                                backgroundColor: "rgba(255, 152, 0, 0.1)",
                                border: "2px solid #ff9800",
                                borderRadius: "4px",
                                fontSize: "12px",
                            }}
                        >
                            <strong style={{ color: "#ff9800" }}>⚠️ Solo Impatto</strong>
                            <div style={{ marginTop: "5px", color: "#666" }}>
                                {quadrantCounts.highLow} temi
                            </div>
                            <div style={{ fontSize: "11px", color: "#666" }}>
                                Alto impatto + Basso finanziario
                            </div>
                        </div>

                        <div
                            style={{
                                padding: "10px",
                                backgroundColor: "rgba(33, 150, 243, 0.1)",
                                border: "2px solid #2196f3",
                                borderRadius: "4px",
                                fontSize: "12px",
                            }}
                        >
                            <strong style={{ color: "#2196f3" }}>💰 Solo Finanziario</strong>
                            <div style={{ marginTop: "5px", color: "#666" }}>
                                {quadrantCounts.lowHigh} temi
                            </div>
                            <div style={{ fontSize: "11px", color: "#666" }}>
                                Basso impatto + Alto finanziario
                            </div>
                        </div>

                        <div
                            style={{
                                padding: "10px",
                                backgroundColor: "rgba(158, 158, 158, 0.05)",
                                border: "2px solid #9e9e9e",
                                borderRadius: "4px",
                                fontSize: "12px",
                            }}
                        >
                            <strong style={{ color: "#9e9e9e" }}>❌ Non Materiale</strong>
                            <div style={{ marginTop: "5px", color: "#666" }}>
                                {quadrantCounts.lowLow} temi
                            </div>
                            <div style={{ fontSize: "11px", color: "#666" }}>
                                Basso impatto + Basso finanziario
                            </div>
                        </div>
                    </div>
                </div>

                {/* Dettaglio tema selezionato */}
                <div style={{ flex: "1 1 300px" }}>
                    {selectedTheme ? (
                        <div
                            style={{
                                border: "2px solid #1976d2",
                                borderRadius: "8px",
                                padding: "20px",
                                backgroundColor: "white",
                            }}
                        >
                            <h3 style={{ margin: "0 0 10px 0", color: "#1976d2" }}>
                                {selectedTheme.code} - {selectedTheme.name}
                            </h3>
                            <p style={{ margin: "0 0 15px 0", fontSize: "13px", color: "#666" }}>
                                {selectedTheme.description}
                            </p>

                            <div style={{ marginBottom: "15px" }}>
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        marginBottom: "5px",
                                    }}
                                >
                                    <strong>Materialità d'Impatto:</strong>
                                    <span
                                        style={{
                                            fontWeight: "bold",
                                            color:
                                                parseFloat(impactScores[selectedTheme.id]) >= threshold
                                                    ? "#4caf50"
                                                    : "#f44336",
                                        }}
                                    >
                                        {(parseFloat(impactScores[selectedTheme.id]) || 0).toFixed(2)} / 5.0
                                    </span>
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
                                            width: `${((parseFloat(impactScores[selectedTheme.id]) || 0) / 5.0) * 100
                                                }%`,
                                            height: "100%",
                                            backgroundColor:
                                                parseFloat(impactScores[selectedTheme.id]) >= threshold
                                                    ? "#4caf50"
                                                    : "#f44336",
                                            borderRadius: "4px",
                                        }}
                                    />
                                </div>
                            </div>

                            <div style={{ marginBottom: "15px" }}>
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        marginBottom: "5px",
                                    }}
                                >
                                    <strong>Materialità Finanziaria:</strong>
                                    <span
                                        style={{
                                            fontWeight: "bold",
                                            color:
                                                parseFloat(financialScores[selectedTheme.id]) >= threshold
                                                    ? "#4caf50"
                                                    : "#f44336",
                                        }}
                                    >
                                        {(parseFloat(financialScores[selectedTheme.id]) || 0).toFixed(2)} / 5.0
                                    </span>
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
                                            width: `${((parseFloat(financialScores[selectedTheme.id]) || 0) / 5.0) * 100
                                                }%`,
                                            height: "100%",
                                            backgroundColor:
                                                parseFloat(financialScores[selectedTheme.id]) >= threshold
                                                    ? "#4caf50"
                                                    : "#f44336",
                                            borderRadius: "4px",
                                        }}
                                    />
                                </div>
                            </div>

                            <div
                                style={{
                                    padding: "15px",
                                    backgroundColor: `rgba(${getThemeColor(getQuadrant(selectedTheme.id)) === "#4caf50"
                                        ? "76, 175, 80"
                                        : getThemeColor(getQuadrant(selectedTheme.id)) === "#ff9800"
                                            ? "255, 152, 0"
                                            : getThemeColor(getQuadrant(selectedTheme.id)) === "#2196f3"
                                                ? "33, 150, 243"
                                                : "158, 158, 158"
                                        }, 0.1)`,
                                    borderRadius: "4px",
                                    textAlign: "center",
                                }}
                            >
                                <strong>Classificazione:</strong>
                                <div
                                    style={{
                                        marginTop: "5px",
                                        fontSize: "16px",
                                        fontWeight: "bold",
                                        color: getThemeColor(getQuadrant(selectedTheme.id)),
                                    }}
                                >
                                    {getQuadrant(selectedTheme.id) === "highHigh"
                                        ? "✅ DOPPIAMENTE MATERIALE"
                                        : getQuadrant(selectedTheme.id) === "highLow"
                                            ? "⚠️ SOLO IMPATTO"
                                            : getQuadrant(selectedTheme.id) === "lowHigh"
                                                ? "💰 SOLO FINANZIARIO"
                                                : "❌ NON MATERIALE"}
                                </div>
                            </div>

                            {getQuadrant(selectedTheme.id) === "highHigh" && (
                                <div
                                    style={{
                                        marginTop: "15px",
                                        padding: "10px",
                                        backgroundColor: "#e8f5e9",
                                        borderLeft: "4px solid #4caf50",
                                        borderRadius: "4px",
                                        fontSize: "13px",
                                    }}
                                >
                                    <strong>✅ Questo tema deve essere incluso nel bilancio di
                                        sostenibilità</strong>
                                    <div style={{ marginTop: "5px", color: "#666" }}>
                                        È rilevante sia per impatto su stakeholder/ambiente che per
                                        rischi/opportunità finanziarie dell'azienda.
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div
                            style={{
                                border: "1px dashed #ccc",
                                borderRadius: "8px",
                                padding: "40px",
                                textAlign: "center",
                                color: "#999",
                            }}
                        >
                            <p style={{ margin: 0, fontSize: "14px" }}>
                                👆 Clicca su un tema nella matrice per visualizzare i dettagli
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Info metodologica */}
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
                <strong>ℹ️ Interpretazione:</strong> La matrice doppia materialità
                segue i principi CSRD/ESRS. I temi nel quadrante <strong style={{ color: "#4caf50" }}>alto-dx
                    (doppiamente materiali)</strong> sono prioritari per il bilancio di sostenibilità.
                Temi con <strong>solo impatto</strong> o <strong>solo rilevanza finanziaria</strong> possono
                essere inclusi facoltativamente. Soglia materialità: {threshold.toFixed(1)}/5.0
            </div>

            {/* Sezione Giustificazioni Esclusioni - Collassabile */}
            {themes.length > 0 && (
                <div
                    style={{
                        marginTop: "20px",
                        border: "2px solid #ff9800",
                        borderRadius: "8px",
                        backgroundColor: "#fafafa",
                    }}
                >
                    {/* Header collassabile */}
                    <div
                        onClick={() => setShowJustifications(!showJustifications)}
                        style={{
                            padding: "1rem 1.5rem",
                            cursor: "pointer",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            backgroundColor: "#fff8e1",
                            borderRadius: showJustifications ? "6px 6px 0 0" : "6px",
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                            <span style={{ fontSize: "1.2rem" }}>📝</span>
                            <div>
                                <strong style={{ fontSize: "16px" }}>
                                    Giustificazioni Esclusioni Temi Non Materiali
                                </strong>
                                <span
                                    style={{
                                        marginLeft: "0.75rem",
                                        fontSize: "0.8rem",
                                        color: "#666",
                                        backgroundColor: "#fff3e0",
                                        padding: "2px 8px",
                                        borderRadius: "12px",
                                    }}
                                >
                                    CSRD Required
                                </span>
                                <div style={{ fontSize: "14px", color: "#666", marginTop: "0.25rem" }}>
                                    Giustificazioni salvate: {Object.keys(justifications).length} temi
                                </div>
                            </div>
                        </div>
                        <span style={{ fontSize: "1.2rem", color: "#ff9800" }}>
                            {showJustifications ? "▼" : "▶"}
                        </span>
                    </div>

                    {/* Pannello espanso */}
                    {showJustifications && (
                        <div style={{ padding: "1.5rem" }}>
                            {/* Info normativa */}
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
                                    📖 Requisito CSRD/ESRS 1
                                </h4>
                                <p style={{ margin: "0.5rem 0", fontSize: "0.9rem", lineHeight: "1.5" }}>
                                    La <strong>CSRD (Corporate Sustainability Reporting Directive)</strong> richiede
                                    che l'organizzazione <strong>documenti e giustifichi</strong> l'esclusione di temi
                                    dalla rendicontazione quando questi non superano la soglia di materialità.
                                </p>
                                <p style={{ margin: "0.5rem 0 0 0", fontSize: "0.85rem", fontStyle: "italic", color: "#555" }}>
                                    ⚠️ <strong>Particolare attenzione</strong> va prestata ai temi con punteggi borderline
                                    (2.5-2.9) che necessitano di giustificazioni più dettagliate.
                                </p>
                            </div>

                            {/* Lista temi non materiali da giustificare */}
                            {(() => {
                                const nonMaterialThemes = themes.filter((theme) => {
                                    const quadrant = getQuadrant(theme.id);
                                    return quadrant !== "highHigh"; // Escludi solo doppiamente materiali
                                });

                                if (nonMaterialThemes.length === 0) {
                                    return (
                                        <div
                                            style={{
                                                padding: "2rem",
                                                textAlign: "center",
                                                backgroundColor: "#e8f5e9",
                                                borderRadius: "8px",
                                                color: "#2e7d32",
                                            }}
                                        >
                                            <p style={{ margin: 0, fontSize: "1rem" }}>
                                                ✅ Tutti i temi analizzati sono doppiamente materiali!
                                            </p>
                                            <p style={{ margin: "0.5rem 0 0 0", fontSize: "0.9rem" }}>
                                                Non sono necessarie giustificazioni di esclusione.
                                            </p>
                                        </div>
                                    );
                                }

                                return (
                                    <div>
                                        <h4 style={{ margin: "0 0 1rem 0", color: "#333" }}>
                                            📋 Temi da Giustificare ({nonMaterialThemes.length})
                                        </h4>

                                        {/* Griglia temi */}
                                        <div style={{ display: "grid", gap: "1rem" }}>
                                            {nonMaterialThemes.map((theme) => {
                                                const impact = parseFloat(impactScores[theme.id]) || 0;
                                                const financial = parseFloat(financialScores[theme.id]) || 0;
                                                const quadrant = getQuadrant(theme.id);
                                                const isBorderline =
                                                    (impact >= 2.5 && impact < threshold) ||
                                                    (financial >= 2.5 && financial < threshold);

                                                return (
                                                    <div
                                                        key={theme.id}
                                                        style={{
                                                            padding: "1rem",
                                                            backgroundColor: "white",
                                                            border: isBorderline
                                                                ? "2px solid #ff9800"
                                                                : "1px solid #e0e0e0",
                                                            borderRadius: "8px",
                                                        }}
                                                    >
                                                        {/* Header tema */}
                                                        <div
                                                            style={{
                                                                display: "flex",
                                                                alignItems: "flex-start",
                                                                gap: "0.75rem",
                                                                marginBottom: "0.75rem",
                                                            }}
                                                        >
                                                            <div
                                                                style={{
                                                                    width: "12px",
                                                                    height: "12px",
                                                                    borderRadius: "50%",
                                                                    backgroundColor: getThemeColor(quadrant),
                                                                    marginTop: "4px",
                                                                    flexShrink: 0,
                                                                }}
                                                            />
                                                            <div style={{ flex: 1 }}>
                                                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                                                    <strong style={{ fontSize: "15px", color: "#333" }}>
                                                                        {theme.name || theme.id}
                                                                    </strong>
                                                                    {isBorderline && (
                                                                        <span
                                                                            style={{
                                                                                fontSize: "0.75rem",
                                                                                backgroundColor: "#fff3e0",
                                                                                color: "#f57c00",
                                                                                padding: "2px 8px",
                                                                                borderRadius: "12px",
                                                                                fontWeight: "bold",
                                                                            }}
                                                                        >
                                                                            ⚠️ BORDERLINE
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <div
                                                                    style={{
                                                                        fontSize: "13px",
                                                                        color: "#666",
                                                                        marginTop: "0.25rem",
                                                                    }}
                                                                >
                                                                    Impatto: <strong>{impact.toFixed(1)}</strong> | Finanziario: <strong>{financial.toFixed(1)}</strong>
                                                                    {" • "}
                                                                    <span style={{ color: getThemeColor(quadrant) }}>
                                                                        {quadrant === "highLow"
                                                                            ? "Solo Impatto"
                                                                            : quadrant === "lowHigh"
                                                                                ? "Solo Finanziario"
                                                                                : "Non Materiale"}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Textarea giustificazione */}
                                                        <textarea
                                                            value={justifications[theme.id] || ""}
                                                            onChange={(e) => {
                                                                const newJustifications = {
                                                                    ...justifications,
                                                                    [theme.id]: e.target.value,
                                                                };
                                                                setJustifications(newJustifications);
                                                            }}
                                                            placeholder={
                                                                isBorderline
                                                                    ? "⚠️ RICHIESTO: Spiegare in dettaglio perché questo tema borderline non è considerato materiale per l'organizzazione..."
                                                                    : "Giustificare perché questo tema non è considerato materiale (contesto aziendale, stakeholder, impatti specifici)..."
                                                            }
                                                            style={{
                                                                width: "100%",
                                                                minHeight: isBorderline ? "120px" : "80px",
                                                                padding: "0.75rem",
                                                                border: isBorderline
                                                                    ? !justifications[theme.id]
                                                                        ? "2px solid #f44336"
                                                                        : "2px solid #ff9800"
                                                                    : "1px solid #ddd",
                                                                borderRadius: "4px",
                                                                fontSize: "14px",
                                                                fontFamily: "inherit",
                                                                resize: "vertical",
                                                            }}
                                                        />

                                                        {/* Warning se borderline senza giustificazione */}
                                                        {isBorderline && !justifications[theme.id] && (
                                                            <div
                                                                style={{
                                                                    marginTop: "0.5rem",
                                                                    padding: "0.5rem",
                                                                    backgroundColor: "#ffebee",
                                                                    borderLeft: "3px solid #f44336",
                                                                    fontSize: "0.85rem",
                                                                    color: "#c62828",
                                                                }}
                                                            >
                                                                ⚠️ Giustificazione obbligatoria per temi borderline
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {/* Pulsante salva */}
                                        <div
                                            style={{
                                                marginTop: "1.5rem",
                                                display: "flex",
                                                justifyContent: "flex-end",
                                                gap: "1rem",
                                            }}
                                        >
                                            <button
                                                onClick={() => {
                                                    if (onJustificationUpdate) {
                                                        onJustificationUpdate(justifications);
                                                    }
                                                }}
                                                style={{
                                                    padding: "0.75rem 1.5rem",
                                                    backgroundColor: "#4caf50",
                                                    color: "white",
                                                    border: "none",
                                                    borderRadius: "4px",
                                                    fontSize: "14px",
                                                    fontWeight: "bold",
                                                    cursor: "pointer",
                                                }}
                                            >
                                                💾 Salva Giustificazioni
                                            </button>
                                        </div>

                                        {/* Statistiche */}
                                        <div
                                            style={{
                                                marginTop: "1rem",
                                                padding: "1rem",
                                                backgroundColor: "#f5f5f5",
                                                borderRadius: "4px",
                                                fontSize: "0.85rem",
                                                color: "#666",
                                            }}
                                        >
                                            📊 Temi giustificati: {Object.values(justifications).filter(j => j.trim()).length}/{nonMaterialThemes.length}
                                            {" • "}
                                            Temi borderline: {nonMaterialThemes.filter(t => {
                                                const impact = parseFloat(impactScores[t.id]) || 0;
                                                const financial = parseFloat(financialScores[t.id]) || 0;
                                                return (impact >= 2.5 && impact < threshold) || (financial >= 2.5 && financial < threshold);
                                            }).length}
                                        </div>
                                    </div>
                                );
                            })()}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
