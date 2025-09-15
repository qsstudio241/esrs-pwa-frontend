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
