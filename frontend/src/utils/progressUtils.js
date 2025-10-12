import { KPI_STATES } from "./kpiValidation";

// Calcolo progress per categorie e totale usando kpiStates
export function computeProgress(audit) {
  const kpiStates = audit?.kpiStates || {};
  const byCategory = {};

  // Raggruppa per categoria (derivata da itemId: "E1-001" -> "E1")
  Object.entries(kpiStates).forEach(([itemId, stateObj]) => {
    const cat = itemId.split("-")[0]; // Es: "E1", "S1", "G003" -> "G"
    const category = cat.length <= 2 ? cat : cat.charAt(0); // Gestisce sia "E1" che "G003"

    byCategory[category] = byCategory[category] || { done: 0, total: 0 };
    byCategory[category].total += 1;

    // Considera "done" se stato è OK, OPT_OK o NA
    const state = stateObj?.state;
    if (
      state === KPI_STATES.OK ||
      state === KPI_STATES.OPT_OK ||
      state === KPI_STATES.NA
    ) {
      byCategory[category].done += 1;
    }
  });

  const categories = Object.entries(byCategory).map(([category, v]) => ({
    category,
    ...v,
    pct: v.total ? v.done / v.total : 0,
  }));

  const aggDone = categories.reduce((a, c) => a + c.done, 0);
  const aggTotal = categories.reduce((a, c) => a + c.total, 0);

  return {
    categories,
    total: {
      done: aggDone,
      total: aggTotal,
      pct: aggTotal ? aggDone / aggTotal : 0,
    },
  };
}
