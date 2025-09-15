import React, { useState, useMemo } from "react";
import useEsrsData from "./hooks/useEsrsData";
import { KPI_STATES } from "./utils/kpiValidation";

// Component base refactor: solo visualizzazione + stati locali (no evidenze, no export)
export default function ChecklistRefactored({ audit, onUpdate }) {
  const { dimensione } = audit || {};
  const { categories, filtered, search } = useEsrsData(dimensione);
  const [openSections, setOpenSections] = useState(() => new Set());
  const [query, setQuery] = useState("");
  const [localStates, setLocalStates] = useState({}); // key: `${cat}-${idx}` -> stato

  const searchResults = useMemo(() => search(query), [query, search]);

  function toggle(cat) {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  }

  function cycleState(cat, idx, mandatory) {
    const key = `${cat}-${idx}`;
    setLocalStates((prev) => {
      const current = prev[key];
      const order = mandatory
        ? [KPI_STATES.OK, KPI_STATES.NOK]
        : [KPI_STATES.OK, KPI_STATES.NOK, KPI_STATES.OPT_EMPTY];
      const next = !current
        ? order[0]
        : order[(order.indexOf(current) + 1) % order.length];
      return { ...prev, [key]: next };
    });
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
                    const key = `${cat}-${idx}`;
                    const state = localStates[key];
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
                          onClick={() => cycleState(cat, idx, it.mandatory)}
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
