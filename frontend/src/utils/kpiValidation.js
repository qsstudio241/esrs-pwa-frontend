// Utility di validazione KPI / item checklist
// Stati previsti: OK, NOK, OPT_OK, OPT_EMPTY, OPT_NOK, NA
// Implementazione minimale: logica potrà essere estesa con soglie numeriche e regole per tipologia

export const KPI_STATES = {
  OK: "OK",
  NOK: "NOK",
  OPT_OK: "OPT_OK",
  OPT_EMPTY: "OPT_EMPTY",
  OPT_NOK: "OPT_NOK",
  NA: "NA",
};

// Deriva stato sintetico da un record item + valore utente
export function deriveStatus({ mandatory, value, optionalValue }) {
  if (value === "NA") return KPI_STATES.NA;
  if (mandatory) {
    if (!value) return KPI_STATES.NOK;
    return KPI_STATES.OK;
  }
  // opzionale
  if (!optionalValue && !value) return KPI_STATES.OPT_EMPTY;
  if (value) return KPI_STATES.OPT_OK;
  return KPI_STATES.OPT_NOK;
}

// Validazione estesa (placeholder) - potrà accettare schema
export function validateKpiState(itemMeta, userInput) {
  return {
    status: deriveStatus({
      mandatory: !!itemMeta.mandatory,
      value: userInput?.value,
      optionalValue: userInput?.value,
    }),
    errors: [],
  };
}

export function aggregateCategoryStatus(itemStatuses) {
  if (!itemStatuses.length) return null;
  if (itemStatuses.some((s) => s.status === KPI_STATES.NOK))
    return KPI_STATES.NOK;
  if (
    itemStatuses.every(
      (s) =>
        s.status === KPI_STATES.OK ||
        s.status === KPI_STATES.NA ||
        s.status.startsWith("OPT")
    )
  )
    return KPI_STATES.OK;
  return KPI_STATES.OK;
}

export function validateKpiInputs(schema, inputs, ctx = {}) {
  if (!schema) return { status: null, errors: [], warnings: [], infos: [] };

  const errors = [];
  const warnings = [];
  const infos = [];
  const vals = inputs || {};

  // Validazione campi
  for (const f of schema.fields || []) {
    const v = vals[f.key];
    if (f.required && (v === undefined || v === null || v === "")) {
      errors.push(`${f.label}: obbligatorio`);
      continue;
    }
    if (v === undefined || v === null || v === "") continue;
    if (f.type === "number") {
      const n = Number(v);
      if (!Number.isFinite(n)) errors.push(`${f.label}: valore non numerico`);
      if (f.min !== undefined && n < f.min)
        errors.push(`${f.label}: deve essere >= ${f.min}`);
      if (f.max !== undefined && n > f.max)
        errors.push(`${f.label}: deve essere <= ${f.max}`);
    }
    if (f.type === "enum" && Array.isArray(f.enum) && !f.enum.includes(v)) {
      errors.push(`${f.label}: valore non ammesso`);
    }
  }

  // Validazione checks con severity
  for (const c of schema.checks || []) {
    try {
      const ok = c.test(vals, ctx);
      if (!ok) {
        const issue = {
          code: c.code,
          message: c.message || c.code,
          severity: c.severity || "error",
          actionPlan: c.actionPlan || null,
        };

        if (c.severity === "error") {
          errors.push(issue);
        } else if (c.severity === "warning") {
          warnings.push(issue);
        } else if (c.severity === "info") {
          infos.push(issue);
        } else {
          errors.push(issue); // fallback
        }
      }
    } catch (e) {
      errors.push({
        code: "VALIDATION_ERROR",
        message: c.message || c.code || "Errore validazione",
        severity: "error",
      });
    }
  }

  // Status globale basato su severity più grave
  let status = KPI_STATES.OK;
  if (errors.length > 0) status = KPI_STATES.NOK;
  else if (warnings.length > 0) status = "WARNING"; // nuovo stato

  return { status, errors, warnings, infos };
}

/**
 * Ottieni gravità massima da validation result
 */
export function getValidationSeverity(validation) {
  if (!validation) return null;
  if (validation.errors?.length > 0) return "error";
  if (validation.warnings?.length > 0) return "warning";
  if (validation.infos?.length > 0) return "info";
  return "ok";
}

/**
 * Colore badge per severity
 */
export function getSeverityColor(severity) {
  const colors = {
    error: "#c62828",
    warning: "#f57c00",
    info: "#1976d2",
    ok: "#2e7d32",
  };
  return colors[severity] || "#666";
}

/**
 * Background badge per severity
 */
export function getSeverityBackground(severity) {
  const backgrounds = {
    error: "#ffebee",
    warning: "#fff3e0",
    info: "#e3f2fd",
    ok: "#e8f5e9",
  };
  return backgrounds[severity] || "#f5f5f5";
}

/**
 * Label per severity
 */
export function getSeverityLabel(severity) {
  const labels = {
    error: "❌ Errore",
    warning: "⚠️ Attenzione",
    info: "ℹ️ Info",
    ok: "✓ Validato",
  };
  return labels[severity] || "—";
}
