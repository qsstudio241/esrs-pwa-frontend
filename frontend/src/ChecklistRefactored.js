import React, { useState, useMemo, useEffect } from "react";
import useEsrsData from "./hooks/useEsrsData";
import useEvidenceManager from "./hooks/useEvidenceManager";
import useKpiState from "./hooks/useKpiState";
import useKpiInputs from "./hooks/useKpiInputs";
import useKpiMetadata from "./hooks/useKpiMetadata";
import useEvidenceMetadata from "./hooks/useEvidenceMetadata";
import { getAllKpiSchemasByCategory } from "./utils/kpiSchemas";
import { validateKpiInputs } from "./utils/kpiValidation";
import { computeProgress } from "./utils/progressUtils";
import {
  exportJSON,
  exportHTML,
  exportWord,
  buildExportFileName,
} from "./utils/exporters";
import { useStorage } from "./storage/StorageContext";

// Helper functions per pulsanti stato semplificati (2 stati: Da Fare / Completato)
function getStateIcon(state) {
  return state === "✓" ? "✓" : "◯";
}

function getStateLabel(state) {
  return state === "✓" ? "Completato" : "Da fare";
}

function getStateBackground(state) {
  return state === "✓" ? "#e8f5e9" : "#fafafa";
}

function getStateColor(state) {
  return state === "✓" ? "#2e7d32" : "#666";
}

function getStateTooltip(state, mandatory) {
  const base = mandatory ? "KPI Obbligatorio" : "KPI Opzionale";
  if (state === "✓") {
    return `${base} - Completato. Clicca per riportare a 'Da fare'`;
  }
  return `${base} - Da fare. Clicca per segnare come 'Completato'`;
}

// Descrizioni delle categorie ESRS
const categoryDescriptions = {
  Generale: "Informazioni generali e requisiti trasversali di governance",
  "ESRS-2": "Informazioni generali di carattere trasversale",
  E1: "Cambiamenti Climatici - Emissioni GHG, obiettivi climatici, transizione energetica",
  E2: "Inquinamento - Aria, acqua, suolo e sostanze pericolose",
  E3: "Risorse Idriche e Marine - Prelievi, scarichi, impatti sugli ecosistemi acquatici",
  E4: "Biodiversità ed Ecosistemi - Impatti su habitat, specie e servizi ecosistemici",
  E5: "Uso delle Risorse ed Economia Circolare - Materiali, rifiuti, circolarità",
  S1: "Forza Lavoro - Condizioni di lavoro, salute, sicurezza, diversità e inclusione",
  S2: "Lavoratori nella Catena del Valore - Condizioni di lavoro nella supply chain",
  S3: "Comunità Interessate - Impatti su comunità locali e indigene",
  S4: "Consumatori e Utilizzatori Finali - Sicurezza prodotti, privacy, accessibilità",
  G1: "Condotta Aziendale - Etica, corruzione, protezione degli informatori, lobbying",
  G2: "Pratiche di Gestione - Struttura, composizione e diversità degli organi di governo",
  G3: "Gestione dei Rischi - Sistema di controllo interno e gestione dei rischi",
  G4: "Remunerazione - Politiche retributive e allineamento con strategia di sostenibilità",
  G5: "Relazioni con Parti Interessate - Engagement degli stakeholder e materialità",
};

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
  const [query, setQuery] = useState("");
  const kpi = useKpiState(audit, onUpdate);
  const kpiInputs = useKpiInputs(audit, onUpdate);
  const kpiMetadata = useKpiMetadata(audit, onUpdate);
  const evidenceMetadata = useEvidenceMetadata(audit, onUpdate);
  const allKpiSchemas = useMemo(() => {
    // Unisce tutti gli schema da tutte le categorie ESRS
    const generale = getAllKpiSchemasByCategory("Generale");
    const e1 = getAllKpiSchemasByCategory("E1");
    const e2 = getAllKpiSchemasByCategory("E2");
    const s1 = getAllKpiSchemasByCategory("S1");
    const g1 = getAllKpiSchemasByCategory("G1");
    return { ...generale, ...e1, ...e2, ...s1, ...g1 };
  }, []);
  const storage = useStorage();

  // Aggiungo stile per animazione details
  React.useEffect(() => {
    const styleId = "details-animation-style";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = `
        details summary {
          list-style: none;
        }
        details summary::-webkit-details-marker {
          display: none;
        }
        details summary > span:first-child {
          display: inline-block;
          transition: transform 0.2s;
        }
        details[open] summary > span:first-child {
          transform: rotate(90deg);
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

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

  function cycleState(itemId, mandatory) {
    // Persist immediately via hook; autosave queue not needed here
    kpi.setStateFor(itemId, mandatory);
  }

  const progress = computeProgress(audit, categories);

  return (
    <div style={{ padding: "1rem" }} aria-label="Raccolta KPI">
      <h2 tabIndex={0}>📊 Raccolta KPI e Indicatori ESRS</h2>
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
                  padding: "0.75rem",
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
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: ".9rem",
                      marginBottom: 4,
                    }}
                  >
                    {cat}
                  </div>
                  {categoryDescriptions[cat] && (
                    <div
                      style={{
                        fontSize: ".75rem",
                        color: "#666",
                        fontWeight: 400,
                      }}
                    >
                      {categoryDescriptions[cat]}
                    </div>
                  )}
                </div>
                <span
                  style={{ fontSize: "1.2rem", color: "#666", marginLeft: 16 }}
                >
                  {openSections.has(cat) ? "−" : "+"}
                </span>
              </header>
              {openSections.has(cat) && (
                <>
                  {/* Sezione Referente Categoria */}
                  <div
                    style={{
                      padding: "12px",
                      margin: "12px",
                      background: "#e3f2fd",
                      border: "1px solid #90caf9",
                      borderRadius: 6,
                    }}
                  >
                    <div
                      style={{
                        fontSize: ".75rem",
                        fontWeight: 600,
                        color: "#1976d2",
                        marginBottom: 8,
                      }}
                    >
                      👤 Referente di Categoria
                    </div>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fit, minmax(200px, 1fr))",
                        gap: 10,
                      }}
                    >
                      <label
                        style={{
                          fontSize: ".7rem",
                          display: "flex",
                          flexDirection: "column",
                          gap: 4,
                        }}
                      >
                        <span style={{ fontWeight: 500 }}>Nome Referente</span>
                        <input
                          type="text"
                          placeholder="es. Mario Rossi"
                          value={
                            kpiMetadata.getMetadata(`_category_${cat}`)
                              ?.nomeReferente || ""
                          }
                          onChange={(e) => {
                            const current =
                              kpiMetadata.getMetadata(`_category_${cat}`) || {};
                            kpiMetadata.setMetadata(`_category_${cat}`, {
                              ...current,
                              nomeReferente: e.target.value,
                            });
                          }}
                          style={{
                            padding: "6px 8px",
                            fontSize: ".7rem",
                            border: "1px solid #ccc",
                            borderRadius: 4,
                          }}
                        />
                      </label>

                      <label
                        style={{
                          fontSize: ".7rem",
                          display: "flex",
                          flexDirection: "column",
                          gap: 4,
                        }}
                      >
                        <span style={{ fontWeight: 500 }}>Ruolo</span>
                        <input
                          type="text"
                          placeholder="es. Responsabile Sostenibilità"
                          value={
                            kpiMetadata.getMetadata(`_category_${cat}`)
                              ?.ruolo || ""
                          }
                          onChange={(e) => {
                            const current =
                              kpiMetadata.getMetadata(`_category_${cat}`) || {};
                            kpiMetadata.setMetadata(`_category_${cat}`, {
                              ...current,
                              ruolo: e.target.value,
                            });
                          }}
                          style={{
                            padding: "6px 8px",
                            fontSize: ".7rem",
                            border: "1px solid #ccc",
                            borderRadius: 4,
                          }}
                        />
                      </label>

                      <label
                        style={{
                          fontSize: ".7rem",
                          display: "flex",
                          flexDirection: "column",
                          gap: 4,
                        }}
                      >
                        <span style={{ fontWeight: 500 }}>
                          Metodo di Raccolta
                        </span>
                        <select
                          value={
                            kpiMetadata.getMetadata(`_category_${cat}`)
                              ?.metodoDiRaccolta || ""
                          }
                          onChange={(e) => {
                            const current =
                              kpiMetadata.getMetadata(`_category_${cat}`) || {};
                            kpiMetadata.setMetadata(`_category_${cat}`, {
                              ...current,
                              metodoDiRaccolta: e.target.value,
                            });
                          }}
                          style={{
                            padding: "6px 8px",
                            fontSize: ".7rem",
                            border: "1px solid #ccc",
                            borderRadius: 4,
                          }}
                        >
                          <option value="">Seleziona...</option>
                          <option value="Intervista">Intervista</option>
                          <option value="Questionario">Questionario</option>
                          <option value="Analisi documentale">
                            Analisi documentale
                          </option>
                          <option value="Sistema gestionale">
                            Sistema gestionale
                          </option>
                          <option value="Calcolo/Stima">Calcolo/Stima</option>
                          <option value="Altro">Altro</option>
                        </select>
                      </label>

                      <label
                        style={{
                          fontSize: ".7rem",
                          display: "flex",
                          flexDirection: "column",
                          gap: 4,
                        }}
                      >
                        <span style={{ fontWeight: 500 }}>
                          Data di Raccolta
                        </span>
                        <input
                          type="date"
                          value={
                            kpiMetadata.getMetadata(`_category_${cat}`)
                              ?.dataDiRaccolta || ""
                          }
                          onChange={(e) => {
                            const current =
                              kpiMetadata.getMetadata(`_category_${cat}`) || {};
                            kpiMetadata.setMetadata(`_category_${cat}`, {
                              ...current,
                              dataDiRaccolta: e.target.value,
                            });
                          }}
                          style={{
                            padding: "6px 8px",
                            fontSize: ".7rem",
                            border: "1px solid #ccc",
                            borderRadius: 4,
                          }}
                        />
                      </label>
                    </div>
                    <div
                      style={{
                        marginTop: 8,
                        fontSize: ".65rem",
                        color: "#555",
                        fontStyle: "italic",
                      }}
                    >
                      ℹ️ Questi dati verranno applicati a tutti i KPI di questa
                      categoria
                    </div>
                  </div>

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
                      // Cerca schema per questo KPI in tutte le categorie
                      const schema = allKpiSchemas[it.itemId] || null;
                      const inputs = schema ? kpiInputs.getFor(it.itemId) : {};
                      const validation = schema
                        ? validateKpiInputs(schema, inputs, { dimensione })
                        : { status: null, errors: [] };
                      return (
                        <li
                          key={key}
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: ".5rem",
                            padding: ".5rem 0",
                            borderBottom: "1px solid #eee",
                          }}
                          aria-label={`Item ${itemLabel}`}
                        >
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: ".85rem" }}>
                              {schema && schema.kpiCode && (
                                <span
                                  style={{
                                    fontWeight: "600",
                                    color: "#1976d2",
                                    fontFamily: "monospace",
                                  }}
                                >
                                  {schema.kpiCode} -{" "}
                                </span>
                              )}
                              {it.item}
                              {schema && validation.status && (
                                <span
                                  style={{
                                    marginLeft: "8px",
                                    fontSize: ".7rem",
                                    color:
                                      validation.status === "OK"
                                        ? "#2e7d32"
                                        : validation.status.includes("Errori")
                                          ? "#c62828"
                                          : "#f57f17",
                                    fontWeight: "600",
                                  }}
                                  title="Stato validazione KPI parametrici"
                                >
                                  - {validation.status}
                                </span>
                              )}
                            </div>
                            <div style={{ fontSize: ".65rem", color: "#777" }}>
                              {it.mandatory ? "Obbligatorio" : "Opzionale"} ·{" "}
                              {it.applicability?.join(", ")}
                            </div>
                            <div style={{ marginTop: 4 }}>
                              {schema && (
                                <details
                                  style={{
                                    marginBottom: 8,
                                    padding: 8,
                                    background: "#fafafa",
                                    border: "1px solid #eee",
                                    borderRadius: 4,
                                  }}
                                >
                                  <summary
                                    style={{
                                      fontSize: ".7rem",
                                      fontWeight: 600,
                                      marginBottom: 6,
                                      cursor: "pointer",
                                      listStyle: "none",
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 4,
                                    }}
                                  >
                                    <span>▶</span> Parametri KPI —{" "}
                                    {schema.title}
                                  </summary>
                                  <div
                                    style={{
                                      display: "grid",
                                      gridTemplateColumns:
                                        "repeat(auto-fit, minmax(160px,1fr))",
                                      gap: 8,
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
                                        <span>
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
                                        fontSize: ".65rem",
                                      }}
                                    >
                                      {validation.errors.map((err, i) => {
                                        // Gestisce sia stringhe che oggetti {code, message, severity, actionPlan}
                                        const isObject =
                                          typeof err === "object" &&
                                          err !== null;
                                        const message = isObject
                                          ? err.message
                                          : err;
                                        const severity = isObject
                                          ? err.severity
                                          : "error";
                                        const actionPlan = isObject
                                          ? err.actionPlan
                                          : null;

                                        // Colore e icona per severity
                                        const severityConfig = {
                                          error: {
                                            color: "#c62828",
                                            icon: "⚠️",
                                            label: "Errore",
                                          },
                                          warning: {
                                            color: "#f57f17",
                                            icon: "⚡",
                                            label: "Avviso",
                                          },
                                          info: {
                                            color: "#0288d1",
                                            icon: "ℹ️",
                                            label: "Suggerimento",
                                          },
                                        };
                                        const config =
                                          severityConfig[severity] ||
                                          severityConfig.error;

                                        return (
                                          <li
                                            key={i}
                                            style={{
                                              color: config.color,
                                              marginBottom: 8,
                                            }}
                                          >
                                            <div>
                                              <strong>
                                                {config.icon} {config.label}:
                                              </strong>{" "}
                                              {message}
                                            </div>
                                            {actionPlan && (
                                              <div
                                                style={{
                                                  marginTop: 4,
                                                  paddingLeft: 16,
                                                  fontStyle: "italic",
                                                  color: "#666",
                                                }}
                                              >
                                                💡 {actionPlan}
                                              </div>
                                            )}
                                          </li>
                                        );
                                      })}
                                    </ul>
                                  )}
                                </details>
                              )}
                              <details style={{ marginTop: 6 }}>
                                <summary
                                  style={{
                                    fontSize: ".65rem",
                                    fontWeight: 600,
                                    cursor: "pointer",
                                    listStyle: "none",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 4,
                                    color:
                                      evidList.length > 0 ? "#1976d2" : "#666",
                                  }}
                                >
                                  <span>▶</span> 📎 Evidenze{" "}
                                  {evidList.length > 0 && (
                                    <span
                                      style={{
                                        background: "#1976d2",
                                        color: "white",
                                        padding: "1px 6px",
                                        borderRadius: 10,
                                        fontSize: ".55rem",
                                      }}
                                    >
                                      {evidList.length}
                                    </span>
                                  )}
                                </summary>
                                <div style={{ marginTop: 6 }}>
                                  <input
                                    type="file"
                                    style={{ display: "none" }}
                                    id={`file-${cat}-${idx}`}
                                    multiple
                                    accept="*/*"
                                    onChange={(e) => {
                                      const fl = Array.from(
                                        e.target.files || []
                                      );
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
                                    Aggiungi evidenza
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
                                              {f.name}
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
                                                {f.name}
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
                                                Copia
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
                                              {f.name}
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
                              </details>
                            </div>

                            {/* Note Auditor - Sempre visibili */}
                            <div style={{ marginTop: 8 }}>
                              <label
                                style={{
                                  fontSize: ".7rem",
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: 4,
                                }}
                              >
                                <span
                                  style={{
                                    fontWeight: 600,
                                    color: "#f57f17",
                                  }}
                                >
                                  📝 Note Auditor
                                </span>
                                <textarea
                                  placeholder="Note interne sull'affidabilità del dato, eventuali riserve o osservazioni..."
                                  value={
                                    kpiMetadata.getMetadata(it.itemId)
                                      ?.auditorNotes || ""
                                  }
                                  onChange={(e) => {
                                    const current =
                                      kpiMetadata.getMetadata(it.itemId) || {};
                                    kpiMetadata.setMetadata(it.itemId, {
                                      ...current,
                                      auditorNotes: e.target.value,
                                    });
                                  }}
                                  rows={2}
                                  style={{
                                    fontSize: ".65rem",
                                    padding: "6px 8px",
                                    border: "1px solid #ddd",
                                    borderRadius: 4,
                                    resize: "vertical",
                                    fontFamily: "inherit",
                                  }}
                                />
                              </label>
                            </div>

                            {/* Pulsante Stato - Spostato sotto Note Auditor */}
                            <div style={{ marginTop: 12 }}>
                              <button
                                onClick={() =>
                                  cycleState(it.itemId, it.mandatory)
                                }
                                style={{
                                  width: "100%",
                                  fontSize: ".75rem",
                                  padding: ".5rem",
                                  cursor: "pointer",
                                  borderRadius: 6,
                                  border: "2px solid #ccc",
                                  background: getStateBackground(state),
                                  color: getStateColor(state),
                                  fontWeight: state ? "600" : "normal",
                                  transition: "all 0.2s",
                                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                                }}
                                aria-pressed={!!state}
                                title={getStateTooltip(state, it.mandatory)}
                              >
                                {getStateIcon(state)} {getStateLabel(state)}
                              </button>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
