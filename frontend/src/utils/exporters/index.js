// Export Layer Unificato
// Responsabilità: snapshot normalizzato + funzioni export formati (JSON, Word, HTML)

import { generateWordReport } from "../wordExport";
import { recordTelemetry } from "../telemetry";
import esrsDetails from "../../data/esrsDetails";

export function buildSnapshot(audit) {
  if (!audit) return null;
  const {
    azienda,
    dimensione,
    dataAvvio,
    stato,
    comments = {},
    files = {},
    completed = {},
    kpiInputs = {},
    exportHistory = [],
  } = audit;
  // Mappa category-> slug item -> itemId dal dataset attuale per migrazione
  const itemIdIndex = {};
  Object.keys(esrsDetails).forEach((cat) => {
    esrsDetails[cat].forEach((it) => {
      const slug = (it.item || "").toLowerCase();
      itemIdIndex[`${cat}::${slug}`] = it.itemId;
    });
  });

  const items = Object.keys({ ...comments, ...files, ...completed }).reduce(
    (acc, key) => {
      const [category, ...rest] = key.split("-");
      const item = rest.join("-");
      const slug = item.toLowerCase();
      const itemId = itemIdIndex[`${category}::${slug}`] || null; // se null, item obsoleto/non più nel dataset
      if (!acc[key]) {
        acc[key] = {
          key,
          category,
          item,
          itemId,
          comment: "",
          files: [],
          completed: false,
          deprecated: itemId === null,
          kpiState: audit?.kpiStates?.[itemId]?.state || null,
        };
      }
      if (comments[key]) acc[key].comment = comments[key];
      if (files[key]) acc[key].files = files[key];
      if (completed[key] !== undefined) acc[key].completed = !!completed[key];
      return acc;
    },
    {}
  );

  return {
    meta: {
      schemaVersion: 2,
      generatedAt: new Date().toISOString(),
      migratedFrom: audit?.meta?.schemaVersion || 1,
    },
    audit: { azienda, dimensione, dataAvvio, stato, kpiInputs },
    exportHistory,
    items: Object.values(items),
  };
}

export function exportJSON(audit) {
  const snapshot = buildSnapshot(audit);
  recordTelemetry("export_json", { items: snapshot?.items?.length || 0 });
  return JSON.stringify(snapshot, null, 2);
}

export async function exportWord(audit, options = {}) {
  // Usa direttamente lo snapshot normalizzato; adapter provvisorio per wordExport
  const snapshot = buildSnapshot(audit);
  recordTelemetry("export_word", { items: snapshot?.items?.length || 0 });
  return generateWordReport(snapshot, options);
}

export function buildExportFileName(audit, type = "json") {
  const aziendaClean = (audit?.azienda || "Azienda")
    .replace(/[^a-zA-Z0-9]/g, "_")
    .substring(0, 30);
  const ts = new Date().toISOString().replace(/[:.]/g, "").slice(0, 15);
  return `${aziendaClean}_export_${ts}.${type}`;
}

// Placeholder for HTML export (future)
export function exportHTML(audit) {
  const snapshot = buildSnapshot(audit);
  if (!snapshot) return "<p>Nessun dato</p>";
  recordTelemetry("export_html", { items: snapshot.items.length });
  const rows = snapshot.items
    .map(
      (it) => `
    <tr data-itemid="${it.itemId || ""}">
      <td>${escapeHtml(it.category)}</td>
      <td>${escapeHtml(it.item)}</td>
      <td>${it.completed ? "✅" : "❌"}</td>
      <td>${escapeHtml(it.comment || "")}</td>
      <td>${(it.files || []).map((f) => escapeHtml(f.name)).join("<br/>")}</td>
    </tr>`
    )
    .join("");
  const html = `<!DOCTYPE html><html lang="it"><head><meta charset="utf-8"/><title>Export Audit ${escapeHtml(
    snapshot.audit.azienda || ""
  )}</title>
  <style>body{font-family:Arial, sans-serif;margin:20px;}table{width:100%;border-collapse:collapse;}th,td{border:1px solid #ccc;padding:4px;font-size:12px;}th{background:#f5f5f5;}caption{font-weight:bold;margin-bottom:8px;} .meta{font-size:11px;color:#555;margin-bottom:12px;} .completed{color:#2e7d32;} .incompleted{color:#c62828;} </style></head><body>
  <h1>Audit ${escapeHtml(snapshot.audit.azienda || "")}</h1>
  <div class="meta">Schema v${snapshot.meta.schemaVersion} • Generato ${
    snapshot.meta.generatedAt
  }</div>
  <table aria-label="Riepilogo Audit"><caption>Checklist</caption>
  <thead><tr><th>Categoria</th><th>Item</th><th>Stato</th><th>Commento</th><th>Evidenze</th></tr></thead><tbody>${rows}</tbody></table>
  </body></html>`;
  return html;
}

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
