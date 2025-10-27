import React, { useState, useMemo } from "react";
import {
    SDG_GOALS,
    ESRS_TO_SDG_MAPPING,
    validateESRSSelection,
    generateMaterialitySDGTable,
    getSDGStatistics
} from "../utils/sdgMapping";

/**
 * Componente per visualizzare mappatura Temi Materiali → ESRS → Goal ONU SDGs
 * Include validazione obbligatorietà ESRS secondo CSRD
 */
export default function ESRSSDGMapping({
    materialThemes = [],
    themeToESRSMapping = {},
    onExport
}) {
    const [selectedView, setSelectedView] = useState("table"); // table | sdgs | validation

    // Genera tabella completa
    const sdgTable = useMemo(() => {
        if (!materialThemes.length) return [];
        return generateMaterialitySDGTable(materialThemes, themeToESRSMapping);
    }, [materialThemes, themeToESRSMapping]);

    // Statistiche SDG
    const statistics = useMemo(() => {
        if (!sdgTable.length) return null;
        return getSDGStatistics(sdgTable);
    }, [sdgTable]);

    // Validazione ESRS
    const validation = useMemo(() => {
        const selectedESRS = sdgTable
            .map(row => Object.keys(ESRS_TO_SDG_MAPPING).find(
                key => ESRS_TO_SDG_MAPPING[key].esrsCode === row.esrsCode
            ))
            .filter(Boolean);

        // Aggiungi sempre ESRS 1, 2 per validazione
        const allESRS = [...new Set([...selectedESRS, "esrs1_general", "esrs2_general"])];

        return validateESRSSelection(allESRS);
    }, [sdgTable]);

    if (!materialThemes.length) {
        return (
            <div style={{ padding: "2rem", textAlign: "center" }}>
                <h3>📊 Individuazione ESRS e Goal ONU</h3>
                <div
                    style={{
                        backgroundColor: "#fff8e1",
                        padding: "1.5rem",
                        borderRadius: "8px",
                        borderLeft: "4px solid #ffc107",
                        marginTop: "1rem"
                    }}
                >
                    <p style={{ margin: 0, fontSize: "1rem" }}>
                        ⚠️ Nessun tema materiale disponibile. Completa prima l'analisi di doppia materialità.
                    </p>
                    <p style={{ margin: "1rem 0 0 0", fontSize: "0.9rem", color: "#666" }}>
                        I temi materiali (quadrante verde della matrice doppia) verranno automaticamente mappati agli ESRS applicabili e ai Goal ONU SDGs.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div style={{ padding: "1rem" }}>
            {/* Header con tabs */}
            <div style={{ marginBottom: "1.5rem" }}>
                <h3 style={{ margin: "0 0 1rem 0", color: "#1976d2" }}>
                    📊 Individuazione ESRS e Goal ONU per Sviluppo Sostenibile
                </h3>

                {/* View selector */}
                <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
                    <button
                        onClick={() => setSelectedView("table")}
                        style={{
                            padding: "0.5rem 1rem",
                            backgroundColor: selectedView === "table" ? "#1976d2" : "#f5f5f5",
                            color: selectedView === "table" ? "white" : "#666",
                            border: "1px solid #ddd",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontSize: "0.9rem"
                        }}
                    >
                        📋 Tabella Completa
                    </button>
                    <button
                        onClick={() => setSelectedView("sdgs")}
                        style={{
                            padding: "0.5rem 1rem",
                            backgroundColor: selectedView === "sdgs" ? "#1976d2" : "#f5f5f5",
                            color: selectedView === "sdgs" ? "white" : "#666",
                            border: "1px solid #ddd",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontSize: "0.9rem"
                        }}
                    >
                        🌍 Goal ONU (17 SDGs)
                    </button>
                    <button
                        onClick={() => setSelectedView("validation")}
                        style={{
                            padding: "0.5rem 1rem",
                            backgroundColor: selectedView === "validation" ? "#1976d2" : "#f5f5f5",
                            color: selectedView === "validation" ? "white" : "#666",
                            border: "1px solid #ddd",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontSize: "0.9rem"
                        }}
                    >
                        ✅ Validazione ESRS
                    </button>
                </div>

                {/* Statistiche quick view */}
                {statistics && (
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                            gap: "1rem",
                            marginBottom: "1rem"
                        }}
                    >
                        <div style={{ backgroundColor: "#e3f2fd", padding: "1rem", borderRadius: "4px" }}>
                            <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#1976d2" }}>
                                {materialThemes.length}
                            </div>
                            <div style={{ fontSize: "0.85rem", color: "#666" }}>Temi Materiali</div>
                        </div>
                        <div style={{ backgroundColor: "#f3e5f5", padding: "1rem", borderRadius: "4px" }}>
                            <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#7b1fa2" }}>
                                {statistics.totalSDGsCovered}/17
                            </div>
                            <div style={{ fontSize: "0.85rem", color: "#666" }}>Goal ONU Coperti ({statistics.coveragePercentage}%)</div>
                        </div>
                        <div style={{ backgroundColor: validation.isValid ? "#e8f5e9" : "#ffebee", padding: "1rem", borderRadius: "4px" }}>
                            <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: validation.isValid ? "#4caf50" : "#f44336" }}>
                                {validation.isValid ? "✓" : "✗"}
                            </div>
                            <div style={{ fontSize: "0.85rem", color: "#666" }}>
                                {validation.isValid ? "CSRD Compliant" : `${validation.errors.length} errori`}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Content basato su view selezionata */}
            {selectedView === "table" && (
                <div>
                    <h4 style={{ marginBottom: "1rem" }}>Tabella Temi Materiali → ESRS → Goal ONU</h4>
                    <div style={{ overflowX: "auto" }}>
                        <table
                            style={{
                                width: "100%",
                                borderCollapse: "collapse",
                                backgroundColor: "white",
                                boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                            }}
                        >
                            <thead>
                                <tr style={{ backgroundColor: "#f5f5f5" }}>
                                    <th style={{ padding: "0.75rem", textAlign: "left", borderBottom: "2px solid #ddd" }}>
                                        Tema Materiale
                                    </th>
                                    <th style={{ padding: "0.75rem", textAlign: "center", borderBottom: "2px solid #ddd" }}>
                                        Score Impatto
                                    </th>
                                    <th style={{ padding: "0.75rem", textAlign: "center", borderBottom: "2px solid #ddd" }}>
                                        Score Finanziario
                                    </th>
                                    <th style={{ padding: "0.75rem", textAlign: "left", borderBottom: "2px solid #ddd" }}>
                                        ESRS Applicabile
                                    </th>
                                    <th style={{ padding: "0.75rem", textAlign: "left", borderBottom: "2px solid #ddd" }}>
                                        Goal ONU SDGs
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {sdgTable.map((row, idx) => (
                                    <tr
                                        key={row.themeId}
                                        style={{
                                            backgroundColor: idx % 2 === 0 ? "white" : "#fafafa",
                                            borderBottom: "1px solid #e0e0e0"
                                        }}
                                    >
                                        <td style={{ padding: "0.75rem" }}>
                                            <strong>{row.themeName}</strong>
                                        </td>
                                        <td style={{ padding: "0.75rem", textAlign: "center" }}>
                                            <span
                                                style={{
                                                    backgroundColor: row.impactScore >= 3 ? "#4caf50" : "#ff9800",
                                                    color: "white",
                                                    padding: "0.25rem 0.5rem",
                                                    borderRadius: "4px",
                                                    fontWeight: "bold"
                                                }}
                                            >
                                                {row.impactScore?.toFixed(1) || "N/A"}
                                            </span>
                                        </td>
                                        <td style={{ padding: "0.75rem", textAlign: "center" }}>
                                            <span
                                                style={{
                                                    backgroundColor: row.financialScore >= 3 ? "#4caf50" : "#ff9800",
                                                    color: "white",
                                                    padding: "0.25rem 0.5rem",
                                                    borderRadius: "4px",
                                                    fontWeight: "bold"
                                                }}
                                            >
                                                {row.financialScore?.toFixed(1) || "N/A"}
                                            </span>
                                        </td>
                                        <td style={{ padding: "0.75rem" }}>
                                            <div style={{ fontWeight: "bold", color: "#1976d2" }}>
                                                {row.esrsCode}
                                            </div>
                                            <div style={{ fontSize: "0.85rem", color: "#666" }}>
                                                {row.esrsName}
                                            </div>
                                        </td>
                                        <td style={{ padding: "0.75rem" }}>
                                            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.25rem" }}>
                                                {row.sdgs.map(sdg => (
                                                    <span
                                                        key={sdg.number}
                                                        title={`${sdg.name}${sdg.isPrimary ? " (Primario)" : ""}`}
                                                        style={{
                                                            display: "inline-flex",
                                                            alignItems: "center",
                                                            gap: "0.25rem",
                                                            padding: "0.25rem 0.5rem",
                                                            backgroundColor: sdg.isPrimary ? sdg.color : "#f5f5f5",
                                                            color: sdg.isPrimary ? "white" : "#333",
                                                            borderRadius: "12px",
                                                            fontSize: "0.75rem",
                                                            fontWeight: sdg.isPrimary ? "bold" : "normal",
                                                            border: sdg.isPrimary ? "none" : "1px solid #ddd"
                                                        }}
                                                    >
                                                        {sdg.icon} SDG{sdg.number}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {selectedView === "sdgs" && (
                <div>
                    <h4 style={{ marginBottom: "1rem" }}>17 Goal ONU per lo Sviluppo Sostenibile - Copertura</h4>
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                            gap: "1rem"
                        }}
                    >
                        {Object.entries(SDG_GOALS).map(([key, sdg]) => {
                            const isCovered = statistics?.sdgCounts[key] > 0;
                            const count = statistics?.sdgCounts[key] || 0;

                            return (
                                <div
                                    key={key}
                                    style={{
                                        padding: "1rem",
                                        backgroundColor: isCovered ? sdg.color : "#f5f5f5",
                                        color: isCovered ? "white" : "#999",
                                        borderRadius: "8px",
                                        border: isCovered ? "none" : "2px dashed #ddd",
                                        opacity: isCovered ? 1 : 0.5
                                    }}
                                >
                                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                                        <span style={{ fontSize: "1.5rem" }}>{sdg.icon}</span>
                                        <strong style={{ fontSize: "1.1rem" }}>SDG {sdg.number}</strong>
                                        {isCovered && (
                                            <span
                                                style={{
                                                    marginLeft: "auto",
                                                    backgroundColor: "rgba(255,255,255,0.3)",
                                                    padding: "0.25rem 0.5rem",
                                                    borderRadius: "12px",
                                                    fontSize: "0.8rem"
                                                }}
                                            >
                                                {count} {count === 1 ? "tema" : "temi"}
                                            </span>
                                        )}
                                    </div>
                                    <div style={{ fontWeight: "bold", marginBottom: "0.25rem" }}>
                                        {sdg.name}
                                    </div>
                                    <div style={{ fontSize: "0.85rem", opacity: 0.9 }}>
                                        {sdg.description}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {selectedView === "validation" && (
                <div>
                    <h4 style={{ marginBottom: "1rem" }}>Validazione Conformità ESRS secondo CSRD</h4>

                    {/* Status generale */}
                    <div
                        style={{
                            padding: "1.5rem",
                            backgroundColor: validation.isValid ? "#e8f5e9" : "#ffebee",
                            borderLeft: `4px solid ${validation.isValid ? "#4caf50" : "#f44336"}`,
                            borderRadius: "4px",
                            marginBottom: "1.5rem"
                        }}
                    >
                        <h4 style={{ margin: "0 0 0.5rem 0", color: validation.isValid ? "#2e7d32" : "#c62828" }}>
                            {validation.isValid ? "✓ Selezione ESRS Valida" : "✗ Selezione ESRS Non Valida"}
                        </h4>
                        <p style={{ margin: 0, fontSize: "0.9rem" }}>
                            {validation.isValid
                                ? "La tua selezione rispetta tutti i requisiti di obbligatorietà CSRD."
                                : "Alcuni ESRS obbligatori sono mancanti. Correggi gli errori per proseguire."}
                        </p>
                    </div>

                    {/* Errori */}
                    {validation.errors.length > 0 && (
                        <div style={{ marginBottom: "1.5rem" }}>
                            <h5 style={{ color: "#c62828", marginBottom: "0.5rem" }}>❌ Errori (Blocco Export)</h5>
                            <ul style={{ margin: 0, paddingLeft: "1.5rem" }}>
                                {validation.errors.map((error, idx) => (
                                    <li key={idx} style={{ color: "#c62828", marginBottom: "0.5rem" }}>
                                        {error}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Warnings */}
                    {validation.warnings.length > 0 && (
                        <div style={{ marginBottom: "1.5rem" }}>
                            <h5 style={{ color: "#f57c00", marginBottom: "0.5rem" }}>⚠️ Avvisi</h5>
                            <ul style={{ margin: 0, paddingLeft: "1.5rem" }}>
                                {validation.warnings.map((warning, idx) => (
                                    <li key={idx} style={{ color: "#f57c00", marginBottom: "0.5rem" }}>
                                        {warning}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Regole CSRD */}
                    <div
                        style={{
                            backgroundColor: "#e3f2fd",
                            padding: "1.5rem",
                            borderRadius: "4px",
                            borderLeft: "4px solid #1976d2"
                        }}
                    >
                        <h5 style={{ margin: "0 0 1rem 0", color: "#1976d2" }}>
                            📖 Regole di Obbligatorietà CSRD
                        </h5>
                        <ul style={{ margin: 0, paddingLeft: "1.5rem", fontSize: "0.9rem", lineHeight: "1.8" }}>
                            <li>
                                <strong>ESRS 1</strong> (Requisiti Generali) e <strong>ESRS 2</strong> (Informazioni Generali) sono{" "}
                                <strong style={{ color: "#c62828" }}>SEMPRE OBBLIGATORI</strong>
                            </li>
                            <li>
                                <strong>ESRS G1</strong> (Condotta Aziendale) è{" "}
                                <strong style={{ color: "#c62828" }}>SEMPRE OBBLIGATORIO</strong>
                            </li>
                            <li>
                                Almeno <strong>1 ESRS Ambientale</strong> (E1-E5) deve essere presente
                            </li>
                            <li>
                                Almeno <strong>1 ESRS Sociale</strong> (S1-S4) deve essere presente
                            </li>
                            <li>
                                Gli altri ESRS sono inclusi solo se risultano <strong>materiali</strong> dall'analisi di doppia materialità
                            </li>
                        </ul>
                    </div>
                </div>
            )}

            {/* Pulsante Export */}
            <div style={{ marginTop: "2rem", textAlign: "right" }}>
                <button
                    onClick={() => onExport && onExport({ sdgTable, statistics, validation })}
                    disabled={!validation.isValid}
                    style={{
                        padding: "0.75rem 1.5rem",
                        backgroundColor: validation.isValid ? "#4caf50" : "#ccc",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: validation.isValid ? "pointer" : "not-allowed",
                        fontSize: "1rem",
                        fontWeight: "bold"
                    }}
                >
                    📄 Esporta Tabella ESRS + Goal ONU
                </button>
            </div>
        </div>
    );
}
