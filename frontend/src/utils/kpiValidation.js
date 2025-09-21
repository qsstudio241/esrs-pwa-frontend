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
  if (!schema) return { status: null, errors: [] };
  const errors = [];
  const vals = inputs || {};
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
  for (const c of schema.checks || []) {
    try {
      const ok = c.test(vals, ctx);
      if (!ok) errors.push(c.message || c.code);
    } catch (e) {
      errors.push(c.message || c.code || "Errore validazione");
    }
  }
  const status = errors.length ? KPI_STATES.NOK : KPI_STATES.OK;
  return { status, errors };
}
