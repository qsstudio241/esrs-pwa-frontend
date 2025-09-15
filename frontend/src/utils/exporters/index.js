// Export Layer Unificato
// Responsabilità: snapshot normalizzato + funzioni export formati (JSON, Word, HTML)

import { generaExportJSON } from "../auditBusinessLogic";
import { generateWordReport } from "../wordExport";
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
    exportHistory = [],
  } = audit;
  // Mappa category-> slug item -> itemId dal dataset attuale per migrazione
  const itemIdIndex = {};
  Object.keys(esrsDetails).forEach(cat => {
    esrsDetails[cat].forEach(it => {
      const slug = (it.item || '').toLowerCase();
      itemIdIndex[`${cat}::${slug}`] = it.itemId;
    });
  });

  const items = Object.keys({ ...comments, ...files, ...completed }).reduce((acc, key) => {
    const [category, ...rest] = key.split("-");
    const item = rest.join("-");
    const slug = item.toLowerCase();
    const itemId = itemIdIndex[`${category}::${slug}`] || null; // se null, item obsoleto/non più nel dataset
    if (!acc[key]) {
      acc[key] = { key, category, item, itemId, comment: "", files: [], completed: false, deprecated: itemId === null };
    }
    if (comments[key]) acc[key].comment = comments[key];
    if (files[key]) acc[key].files = files[key];
    if (completed[key] !== undefined) acc[key].completed = !!completed[key];
    return acc;
  }, {});

  return {
    meta: {
      schemaVersion: 2,
      generatedAt: new Date().toISOString(),
      migratedFrom: audit?.meta?.schemaVersion || 1,
    },
    audit: { azienda, dimensione, dataAvvio, stato },
    exportHistory,
    items: Object.values(items),
  };
}

export function exportJSON(audit) {
  const snapshot = buildSnapshot(audit);
  return JSON.stringify(snapshot, null, 2);
}

export async function exportWord(audit, options = {}) {
  // Reuse existing generator; expects audit structure + comments/files/completed
  // For backward compatibility we still call generaExportJSON to create data model if needed
  const data = generaExportJSON(
    audit,
    audit.comments || {},
    audit.files || {},
    audit.completed || {}
  );
  return generateWordReport(data, options);
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
  return `<pre>${escapeHtml(JSON.stringify(snapshot, null, 2))}</pre>`;
}

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
