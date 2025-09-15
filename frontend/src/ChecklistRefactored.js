import React, { useState, useMemo } from "react";
import useEsrsData from "./hooks/useEsrsData";
import useEvidenceManager from "./hooks/useEvidenceManager";
import useKpiState from "./hooks/useKpiState";

// Component base refactor: solo visualizzazione + stati locali (no evidenze, no export)
export default function ChecklistRefactored({ audit, onUpdate }) {
  const { dimensione } = audit || {};
  const { categories, filtered, search } = useEsrsData(dimensione);
  const evidence = useEvidenceManager(audit, onUpdate);
  const [openSections, setOpenSections] = useState(() => new Set());
  const [query, setQuery] = useState("");
  const kpi = useKpiState(audit, onUpdate);

  const searchResults = useMemo(() => search(query), [query, search]);

  function toggle(cat) {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  }

  function cycleState(itemId, mandatory) {
    kpi.setStateFor(itemId, mandatory);
  }

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Checklist (Refactored Preview)</h2>
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
                >
                  {items.map((it, idx) => {
                    const key = `${cat}-${idx}`; // UI key stabile
                    const state = kpi.getState(it.itemId);
                    const itemLabel = it.item;
                    const evidList = evidence.list(cat, itemLabel);
                    return (
                      <li
                        key={key}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: ".5rem",
                          padding: ".25rem 0",
                          borderBottom: "1px solid #eee",
                        }}
                      >
                        <button
                          onClick={() => cycleState(it.itemId, it.mandatory)}
                          style={{
                            minWidth: 70,
                            fontSize: ".7rem",
                            padding: ".25rem .4rem",
                            cursor: "pointer",
                            borderRadius: 3,
                            border: "1px solid #ccc",
                            background: state ? "#e8f4ff" : "#fafafa",
                          }}
                        >
                          {state || "—"}
                        </button>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: ".85rem" }}>{it.item}</div>
                          <div style={{ fontSize: ".65rem", color: "#777" }}>
                            {it.mandatory ? "Obbligatorio" : "Opzionale"} ·{" "}
                            {it.applicability?.join(", ")}
                          </div>
                          <div style={{ marginTop: 4 }}>
                            <input
                              type="file"
                              style={{ display: "none" }}
                              id={`file-${cat}-${idx}`}
                              multiple
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
                              Aggiungi evidenza
                            </label>
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
