import React, { useState, useMemo, useEffect } from "react";
import useEsrsData from "./hooks/useEsrsData";
import useEvidenceManager from "./hooks/useEvidenceManager";
import useKpiState from "./hooks/useKpiState";
import useKpiInputs from "./hooks/useKpiInputs";
import { getKpiSchemasGenerale, getAllKpiSchemas } from "./utils/kpiSchemas";
import { validateKpiInputs, KPI_STATES } from "./utils/kpiValidation";
import { computeProgress } from "./utils/progressUtils";
import {
    exportJSON,
    exportHTML,
    exportWord,
    buildExportFileName,
} from "./utils/exporters";
import { useStorage } from "./storage/StorageContext";

// Helper function per tooltip informativi sui campi KPI
function getKpiFieldTooltip(field, schema) {
    const baseTooltip = `${field.label}${field.unit ? ` (Unità: ${field.unit})` : ""
        }`;
    const requiredText = field.required
        ? " • Campo obbligatorio per conformità ESRS"
        : " • Campo opzionale";
    const rangeText =
        field.min !== undefined || field.max !== undefined
            ? ` • Range: ${field.min ?? "min"} - ${field.max ?? "max"}`
            : "";
    const enumText = field.enum
        ? ` • Valori ammessi: ${field.enum.join(", ")}`
        : "";

    // Descrizioni specifiche per campi comuni
    const descriptions = {
        valutazione_materialita_eseguita:
            "Indica se è stata condotta l'analisi di doppia materialità secondo PDR 134:2022",
        coinvolgimento_stakeholder:
            "Conferma il coinvolgimento degli stakeholder nell'analisi di materialità",
        metodologia: "Metodologia utilizzata per l'analisi di materialità",
        data: "Data di completamento della valutazione",
        confini_reporting_definiti:
            "Definizione dei confini di rendicontazione della catena del valore",
        copertura_upstream:
            "Percentuale di copertura della catena del valore a monte",
        copertura_downstream:
            "Percentuale di copertura della catena del valore a valle",
        orizzonte_breve_anni:
            "Orizzonte temporale di breve periodo (tipicamente 1-3 anni)",
        orizzonte_medio_anni:
            "Orizzonte temporale di medio periodo (tipicamente 3-10 anni)",
        orizzonte_lungo_anni:
            "Orizzonte temporale di lungo periodo (oltre 10 anni)",
    };

    const description = descriptions[field.key]
        ? ` • ${descriptions[field.key]}`
        : "";

    return `${baseTooltip}${requiredText}${rangeText}${enumText}${description}`;
}

// Component base refactor: solo visualizzazione + stati locali (no evidenze, no export)
export default function ChecklistRefactored({ audit, onUpdate }) {
    const { dimensione } = audit || {};
    const { categories, filtered, search } = useEsrsData(dimensione);
    const evidence = useEvidenceManager(audit, onUpdate);
    const [openSections, setOpenSections] = useState(() => {
        try {
            const raw = localStorage.getItem("refactored_openSections");
            if (raw) return new Set(JSON.parse(raw));
        } catch { }
        return new Set();
    });
    const [openKpiSections, setOpenKpiSections] = useState(() => {
        try {
            const raw = localStorage.getItem("refactored_openKpiSections");
            if (raw) return new Set(JSON.parse(raw));
        } catch { }
        return new Set();
    });
    const [query, setQuery] = useState("");
    const kpi = useKpiState(audit, onUpdate);
    const kpiInputs = useKpiInputs(audit, onUpdate);
    const kpiSchemasGenerale = useMemo(() => getKpiSchemasGenerale(), []);
    const allKpiSchemas = useMemo(() => getAllKpiSchemas(audit), [audit]);
    const storage = useStorage();

    const searchResults = useMemo(() => search(query), [query, search]);

    function toggle(cat) {
        setOpenSections((prev) => {
            const next = new Set(prev);
            if (next.has(cat)) next.delete(cat);
            else next.add(cat);
            return next;
        });
    }

    useEffect(() => {
        try {
            localStorage.setItem(
                "refactored_openSections",
                JSON.stringify(Array.from(openSections))
            );
        } catch { }
    }, [openSections]);

    useEffect(() => {
        try {
            localStorage.setItem(
                "refactored_openKpiSections",
                JSON.stringify(Array.from(openKpiSections))
            );
        } catch { }
    }, [openKpiSections]);

    function toggleKpiSection(itemId) {
        setOpenKpiSections((prev) => {
            const next = new Set(prev);
            if (next.has(itemId)) next.delete(itemId);
            else next.add(itemId);
            return next;
        });
    }

    function cycleState(itemId, mandatory) {
        // Persist immediately via hook; autosave queue not needed here
        kpi.setStateFor(itemId, mandatory);
    }

    const progress = computeProgress(audit);

    return (
        <div style={{ padding: "1rem" }} aria-label="Checklist Refactored">
            <h2 tabIndex={0}>📋 Checklist ESRS (Enhanced con KPI)</h2>
            <div style={{ display: "flex", gap: 8, margin: "0.5rem 0 1rem" }}>
                <button
                    type="button"
                    onClick={() => {
                        try {
                            const json = exportJSON(audit);
                            const blob = new Blob([json], { type: "application/json" });
                            const a = document.createElement("a");
                            a.href = URL.createObjectURL(blob);
                            a.download = buildExportFileName(audit, "json");
                            a.click();
                            setTimeout(() => URL.revokeObjectURL(a.href), 2000);
                        } catch (e) {
                            alert("Errore export JSON: " + e.message);
                        }
                    }}
                    style={{ fontSize: ".75rem" }}
                >
                    Esporta JSON
                </button>
                <button
                    type="button"
                    onClick={() => {
                        try {
                            const html = exportHTML(audit);
                            const blob = new Blob([html], { type: "text/html" });
                            const a = document.createElement("a");
                            a.href = URL.createObjectURL(blob);
                            a.download = buildExportFileName(audit, "html");
                            a.click();
                            setTimeout(() => URL.revokeObjectURL(a.href), 2000);
                        } catch (e) {
                            alert("Errore export HTML: " + e.message);
                        }
                    }}
                    style={{ fontSize: ".75rem" }}
                >
                    Esporta HTML
                </button>
                <button
                    type="button"
                    onClick={async () => {
                        try {
                            await exportWord(audit, storage.ready() ? storage : null);
                        } catch (e) {
                            alert("Errore export Word: " + e.message);
                        }
                    }}
                    style={{ fontSize: ".75rem" }}
                >
                    Esporta Word
                </button>
            </div>
            <div style={{ marginBottom: ".75rem" }} aria-label="Stato avanzamento">
                <div style={{ fontSize: ".7rem", color: "#555" }}>
                    Avanzamento totale: {(progress.total.pct * 100).toFixed(0)}% (
                    {progress.total.done}/{progress.total.total})
                </div>
                <div
                    style={{
                        background: "#eee",
                        height: 6,
                        borderRadius: 3,
                        overflow: "hidden",
                    }}
                >
                    <div
                        style={{
                            width: `${(progress.total.pct * 100).toFixed(0)}%`,
                            background: "#1976d2",
                            height: "100%",
                            transition: "width .3s",
                        }}
                    />
                </div>
            </div>
            <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
                <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Cerca..."
                    style={{ flex: 1 }}
                />
                <span style={{ fontSize: ".85rem", color: "#555" }}>
                    {searchResults.length ? `${searchResults.length} risultati` : ""}
                </span>
            </div>
            {query && (
                <div style={{ marginBottom: "1rem" }}>
                    {searchResults.map((r) => (
                        <div key={`${r.category}-${r.index}`} style={{ fontSize: ".8rem" }}>
                            <strong>{r.category}</strong>: {r.item.item}
                        </div>
                    ))}
                </div>
            )}
            <div>
                {categories.map((cat) => {
                    const items = filtered[cat];
                    return (
                        <section
                            key={cat}
                            style={{
                                border: "1px solid #ddd",
                                borderRadius: 4,
                                marginBottom: "0.75rem",
                            }}
                            role="group"
                            aria-labelledby={`hdr-${cat}`}
                        >
                            <header
                                onClick={() => toggle(cat)}
                                style={{
                                    cursor: "pointer",
                                    padding: "0.5rem 0.75rem",
                                    background: "#f7f7f7",
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                }}
                                id={`hdr-${cat}`}
                                aria-expanded={openSections.has(cat)}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                        e.preventDefault();
                                        toggle(cat);
                                    }
                                }}
                            >
                                <span>{cat}</span>
                                <span style={{ fontSize: "0.75rem", color: "#666" }}>
                                    {openSections.has(cat) ? "−" : "+"}
                                </span>
                            </header>
                            {openSections.has(cat) && (
                                <ul
                                    style={{
                                        listStyle: "none",
                                        margin: 0,
                                        padding: "0.5rem 0.75rem",
                                    }}
                                    aria-label={`Lista items ${cat}`}
                                >
                                    {items.map((it, idx) => {
                                        const key = `${cat}-${idx}`; // UI key stabile
                                        const state = kpi.getState(it.itemId);
                                        const itemLabel = it.item;
                                        const evidList = evidence.list(cat, itemLabel);
                                        // Ottieni schema KPI: prima da allKpiSchemas (include settoriali), poi da generali
                                        const schema =
                                            allKpiSchemas[it.itemId] ||
                                            (cat === "Generale"
                                                ? kpiSchemasGenerale[it.itemId]
                                                : null);
                                        const inputs = schema ? kpiInputs.getFor(it.itemId) : {};
                                        const validation = schema
                                            ? validateKpiInputs(schema, inputs, { dimensione })
                                            : { status: null, errors: [] };

                                        const hasRequiredFields =
                                            schema &&
                                            schema.fields.some(
                                                (f) =>
                                                    f.required &&
                                                    (inputs[f.key] === undefined ||
                                                        inputs[f.key] === null ||
                                                        inputs[f.key] === "")
                                            );

                                        return (
                                            <li
                                                key={key}
                                                style={{
                                                    display: "flex",
                                                    alignItems: "flex-start",
                                                    gap: ".5rem",
                                                    padding: ".25rem 0",
                                                    borderBottom: "1px solid #eee",
                                                }}
                                                aria-label={`Item ${itemLabel}`}
                                            >
                                                {schema ? (
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            alignItems: "center",
                                                            gap: ".25rem",
                                                        }}
                                                    >
                                                        <button
                                                            onClick={() => {
                                                                const res = validateKpiInputs(schema, inputs, {
                                                                    dimensione,
                                                                });
                                                                onUpdate &&
                                                                    onUpdate({
                                                                        kpiStates: {
                                                                            ...(audit.kpiStates || {}),
                                                                            [it.itemId]: {
                                                                                state: res.status,
                                                                                updatedAt: new Date().toISOString(),
                                                                            },
                                                                        },
                                                                    });
                                                            }}
                                                            disabled={hasRequiredFields}
                                                            style={{
                                                                minWidth: 90,
                                                                fontSize: ".7rem",
                                                                padding: ".25rem .4rem",
                                                                cursor: hasRequiredFields
                                                                    ? "not-allowed"
                                                                    : "pointer",
                                                                borderRadius: 3,
                                                                border: "1px solid #ccc",
                                                                background: validation.status
                                                                    ? validation.status === KPI_STATES.OK
                                                                        ? "#d4edda"
                                                                        : validation.status === KPI_STATES.NOK
                                                                            ? "#f8d7da"
                                                                            : "#fff3cd"
                                                                    : "#fafafa",
                                                                opacity: hasRequiredFields ? 0.6 : 1,
                                                            }}
                                                            aria-pressed={!!validation.status}
                                                            title={
                                                                hasRequiredFields
                                                                    ? "Completa i campi obbligatori prima di verificare"
                                                                    : "Verifica KPI"
                                                            }
                                                        >
                                                            {validation.status || "Verifica KPI"}
                                                        </button>
                                                        {validation.status && (
                                                            <span
                                                                style={{
                                                                    fontSize: ".6rem",
                                                                    padding: ".1rem .3rem",
                                                                    borderRadius: 8,
                                                                    background:
                                                                        validation.status === KPI_STATES.OK
                                                                            ? "#28a745"
                                                                            : validation.status === KPI_STATES.NOK
                                                                                ? "#dc3545"
                                                                                : "#ffc107",
                                                                    color: "white",
                                                                    fontWeight: "bold",
                                                                }}
                                                                title={
                                                                    validation.status === KPI_STATES.OK
                                                                        ? "Tutti i KPI sono conformi"
                                                                        : validation.status === KPI_STATES.NOK
                                                                            ? "Alcuni KPI non sono conformi"
                                                                            : "Stato KPI intermedio"
                                                                }
                                                            >
                                                                {validation.status}
                                                            </span>
                                                        )}
                                                    </div>
                                                ) : (
                                                    cat !== "Generale" && (
                                                        <button
                                                            onClick={() =>
                                                                cycleState(it.itemId, it.mandatory)
                                                            }
                                                            style={{
                                                                minWidth: 70,
                                                                fontSize: ".7rem",
                                                                padding: ".25rem .4rem",
                                                                cursor: "pointer",
                                                                borderRadius: 3,
                                                                border: "1px solid #ccc",
                                                                background: state ? "#e8f4ff" : "#fafafa",
                                                            }}
                                                            aria-pressed={!!state}
                                                            title="Cambia stato KPI"
                                                        >
                                                            {state || "—"}
                                                        </button>
                                                    )
                                                )}
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ fontSize: ".85rem" }}>{it.item}</div>
                                                    <div style={{ fontSize: ".65rem", color: "#777" }}>
                                                        {it.mandatory ? "Obbligatorio" : "Opzionale"} ·{" "}
                                                        {it.applicability?.join(", ")}
                                                    </div>
                                                    <div style={{ marginTop: 4 }}>
                                                        {schema && (
                                                            <div
                                                                style={{
                                                                    marginBottom: 8,
                                                                    border: "1px solid #ddd",
                                                                    borderRadius: 4,
                                                                    overflow: "hidden",
                                                                }}
                                                            >
                                                                <div
                                                                    onClick={() => toggleKpiSection(it.itemId)}
                                                                    style={{
                                                                        fontSize: ".7rem",
                                                                        fontWeight: 600,
                                                                        padding: "8px 12px",
                                                                        background: validation.status
                                                                            ? validation.status === KPI_STATES.OK
                                                                                ? "#d4edda"
                                                                                : validation.status === KPI_STATES.NOK
                                                                                    ? "#f8d7da"
                                                                                    : "#fff3cd"
                                                                            : "#f8f9fa",
                                                                        cursor: "pointer",
                                                                        display: "flex",
                                                                        alignItems: "center",
                                                                        justifyContent: "space-between",
                                                                        borderBottom: openKpiSections.has(it.itemId)
                                                                            ? "1px solid #ddd"
                                                                            : "none",
                                                                    }}
                                                                    title={`Schema KPI per ${schema.title
                                                                        }. Clicca per ${openKpiSections.has(it.itemId)
                                                                            ? "nascondere"
                                                                            : "mostrare"
                                                                        } i parametri`}
                                                                    role="button"
                                                                    tabIndex={0}
                                                                    onKeyDown={(e) => {
                                                                        if (e.key === "Enter" || e.key === " ") {
                                                                            e.preventDefault();
                                                                            toggleKpiSection(it.itemId);
                                                                        }
                                                                    }}
                                                                >
                                                                    <span
                                                                        style={{
                                                                            display: "flex",
                                                                            alignItems: "center",
                                                                            gap: ".25rem",
                                                                        }}
                                                                    >
                                                                        📊 Parametri KPI — {schema.title}
                                                                        <span
                                                                            style={{
                                                                                fontSize: ".6rem",
                                                                                color: "#666",
                                                                                cursor: "help",
                                                                            }}
                                                                            title="Questi parametri sono richiesti dalla normativa ESRS per garantire la conformità della rendicontazione di sostenibilità"
                                                                            onClick={(e) => e.stopPropagation()}
                                                                        >
                                                                            ℹ️
                                                                        </span>
                                                                    </span>
                                                                    <span
                                                                        style={{ fontSize: ".8rem", color: "#666" }}
                                                                    >
                                                                        {openKpiSections.has(it.itemId) ? "▼" : "▶"}
                                                                    </span>
                                                                </div>
                                                                {openKpiSections.has(it.itemId) && (
                                                                    <div
                                                                        style={{
                                                                            padding: "12px",
                                                                            background: "#fafafa",
                                                                        }}
                                                                    >
                                                                        <div
                                                                            style={{
                                                                                display: "grid",
                                                                                gridTemplateColumns:
                                                                                    "repeat(auto-fit, minmax(160px,1fr))",
                                                                                gap: 8,
                                                                                marginBottom: 8,
                                                                            }}
                                                                        >
                                                                            {schema.fields.map((f) => (
                                                                                <label
                                                                                    key={f.key}
                                                                                    style={{
                                                                                        fontSize: ".65rem",
                                                                                        display: "flex",
                                                                                        flexDirection: "column",
                                                                                        gap: 4,
                                                                                    }}
                                                                                >
                                                                                    <span
                                                                                        title={getKpiFieldTooltip(
                                                                                            f,
                                                                                            schema
                                                                                        )}
                                                                                        style={{
                                                                                            cursor: "help",
                                                                                            textDecoration:
                                                                                                "underline dotted",
                                                                                            textUnderlineOffset: "2px",
                                                                                        }}
                                                                                    >
                                                                                        {f.label}
                                                                                        {f.unit ? ` (${f.unit})` : ""}
                                                                                        {f.required ? " *" : ""}
                                                                                    </span>
                                                                                    {f.type === "bool" && (
                                                                                        <select
                                                                                            value={
                                                                                                inputs[f.key] === true
                                                                                                    ? "true"
                                                                                                    : inputs[f.key] === false
                                                                                                        ? "false"
                                                                                                        : ""
                                                                                            }
                                                                                            onChange={(e) => {
                                                                                                const v = e.target.value;
                                                                                                kpiInputs.setField(
                                                                                                    it.itemId,
                                                                                                    f.key,
                                                                                                    v === "true"
                                                                                                        ? true
                                                                                                        : v === "false"
                                                                                                            ? false
                                                                                                            : ""
                                                                                                );
                                                                                            }}
                                                                                        >
                                                                                            <option value="">—</option>
                                                                                            <option value="true">Sì</option>
                                                                                            <option value="false">No</option>
                                                                                        </select>
                                                                                    )}
                                                                                    {f.type === "number" && (
                                                                                        <input
                                                                                            type="number"
                                                                                            value={inputs[f.key] ?? ""}
                                                                                            onChange={(e) =>
                                                                                                kpiInputs.setField(
                                                                                                    it.itemId,
                                                                                                    f.key,
                                                                                                    e.target.value === ""
                                                                                                        ? ""
                                                                                                        : Number(e.target.value)
                                                                                                )
                                                                                            }
                                                                                            min={f.min}
                                                                                            max={f.max}
                                                                                        />
                                                                                    )}
                                                                                    {f.type === "enum" && (
                                                                                        <select
                                                                                            value={inputs[f.key] ?? ""}
                                                                                            onChange={(e) =>
                                                                                                kpiInputs.setField(
                                                                                                    it.itemId,
                                                                                                    f.key,
                                                                                                    e.target.value
                                                                                                )
                                                                                            }
                                                                                        >
                                                                                            <option value="">—</option>
                                                                                            {f.enum.map((opt) => (
                                                                                                <option key={opt} value={opt}>
                                                                                                    {opt}
                                                                                                </option>
                                                                                            ))}
                                                                                        </select>
                                                                                    )}
                                                                                    {f.type === "date" && (
                                                                                        <input
                                                                                            type="date"
                                                                                            value={inputs[f.key] ?? ""}
                                                                                            onChange={(e) =>
                                                                                                kpiInputs.setField(
                                                                                                    it.itemId,
                                                                                                    f.key,
                                                                                                    e.target.value
                                                                                                )
                                                                                            }
                                                                                        />
                                                                                    )}
                                                                                    {f.type === "text" && (
                                                                                        <input
                                                                                            type="text"
                                                                                            value={inputs[f.key] ?? ""}
                                                                                            onChange={(e) =>
                                                                                                kpiInputs.setField(
                                                                                                    it.itemId,
                                                                                                    f.key,
                                                                                                    e.target.value
                                                                                                )
                                                                                            }
                                                                                        />
                                                                                    )}
                                                                                </label>
                                                                            ))}
                                                                        </div>
                                                                        {validation.errors.length > 0 && (
                                                                            <ul
                                                                                style={{
                                                                                    marginTop: 8,
                                                                                    color: "#c62828",
                                                                                    fontSize: ".65rem",
                                                                                    paddingLeft: "1rem",
                                                                                }}
                                                                            >
                                                                                {validation.errors.map((err, i) => (
                                                                                    <li key={i}>⚠️ {err}</li>
                                                                                ))}
                                                                            </ul>
                                                                        )}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}
                                                        <input
                                                            type="file"
                                                            style={{ display: "none" }}
                                                            id={`file-${cat}-${idx}`}
                                                            multiple
                                                            accept="*/*"
                                                            onChange={(e) => {
                                                                const fl = Array.from(e.target.files || []);
                                                                evidence.addFiles({
                                                                    category: cat,
                                                                    itemLabel,
                                                                    fileList: fl,
                                                                });
                                                                e.target.value = "";
                                                            }}
                                                        />
                                                        <label
                                                            htmlFor={`file-${cat}-${idx}`}
                                                            style={{
                                                                cursor: "pointer",
                                                                fontSize: ".6rem",
                                                                color: "#1976d2",
                                                                textDecoration: "underline",
                                                            }}
                                                        >
                                                            📎 Aggiungi evidenza
                                                        </label>
                                                        {evidence.error && (
                                                            <div
                                                                style={{
                                                                    color: "#c62828",
                                                                    fontSize: ".6rem",
                                                                    marginTop: 4,
                                                                }}
                                                            >
                                                                ⚠️ {evidence.error}
                                                            </div>
                                                        )}
                                                        {evidList.length > 0 && (
                                                            <ul
                                                                style={{
                                                                    margin: "4px 0 0 0",
                                                                    padding: 0,
                                                                    listStyle: "none",
                                                                }}
                                                            >
                                                                {evidList.map((f, fi) => (
                                                                    <li
                                                                        key={fi}
                                                                        style={{
                                                                            display: "flex",
                                                                            alignItems: "center",
                                                                            gap: 6,
                                                                        }}
                                                                    >
                                                                        {f.data ? (
                                                                            <a
                                                                                href={f.data}
                                                                                download={f.name}
                                                                                style={{ fontSize: ".55rem" }}
                                                                            >
                                                                                📄 {f.name}
                                                                            </a>
                                                                        ) : f.path ? (
                                                                            <span
                                                                                style={{
                                                                                    display: "inline-flex",
                                                                                    alignItems: "center",
                                                                                    gap: 4,
                                                                                }}
                                                                            >
                                                                                <button
                                                                                    type="button"
                                                                                    title={f.path}
                                                                                    onClick={() =>
                                                                                        alert(
                                                                                            `File salvato in ${f.path}. Apri la cartella audit per visualizzarlo.`
                                                                                        )
                                                                                    }
                                                                                    style={{
                                                                                        background: "none",
                                                                                        border: "none",
                                                                                        color: "#1976d2",
                                                                                        textDecoration: "underline",
                                                                                        cursor: "pointer",
                                                                                        padding: 0,
                                                                                        fontSize: ".55rem",
                                                                                    }}
                                                                                >
                                                                                    📄 {f.name}
                                                                                </button>
                                                                                <button
                                                                                    type="button"
                                                                                    title="Copia percorso"
                                                                                    onClick={async () => {
                                                                                        try {
                                                                                            await navigator.clipboard.writeText(
                                                                                                f.path
                                                                                            );
                                                                                        } catch { }
                                                                                    }}
                                                                                    style={{
                                                                                        fontSize: ".5rem",
                                                                                        border: "1px solid #ccc",
                                                                                        background: "#fafafa",
                                                                                        cursor: "pointer",
                                                                                        borderRadius: 3,
                                                                                        padding: "0 4px",
                                                                                    }}
                                                                                >
                                                                                    📋
                                                                                </button>
                                                                            </span>
                                                                        ) : (
                                                                            <span
                                                                                style={{
                                                                                    fontSize: ".55rem",
                                                                                    maxWidth: 140,
                                                                                    overflow: "hidden",
                                                                                    textOverflow: "ellipsis",
                                                                                    whiteSpace: "nowrap",
                                                                                }}
                                                                            >
                                                                                📄 {f.name}
                                                                            </span>
                                                                        )}
                                                                        <button
                                                                            onClick={() =>
                                                                                evidence.removeFile({
                                                                                    category: cat,
                                                                                    itemLabel,
                                                                                    index: fi,
                                                                                })
                                                                            }
                                                                            style={{
                                                                                fontSize: ".55rem",
                                                                                border: "1px solid #ccc",
                                                                                background: "#fafafa",
                                                                                cursor: "pointer",
                                                                                borderRadius: 3,
                                                                            }}
                                                                        >
                                                                            ✕
                                                                        </button>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        )}
                                                    </div>
                                                </div>
                                            </li>
                                        );
                                    })}
                                </ul>
                            )}
                        </section>
                    );
                })}
            </div>
        </div>
    );
}
