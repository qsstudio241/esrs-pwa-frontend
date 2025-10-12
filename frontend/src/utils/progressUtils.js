// Calcolo progress per categorie e totale usando kpiStates e checklist completa
// Sistema semplificato: 2 stati (null/"Da fare", "✓"/"Completato")
export function computeProgress(audit, allCategories = []) {
  const kpiStates = audit?.kpiStates || {};
  const byCategory = {};

  // Prima conta TUTTI i KPI disponibili dalla checklist
  allCategories.forEach((cat) => {
    const categoryKey = cat.category;
    byCategory[categoryKey] = { done: 0, total: 0 };

    // Conta tutti gli item della categoria
    cat.items?.forEach((item) => {
      byCategory[categoryKey].total += 1;

      // Verifica se questo item è completato
      const itemState = kpiStates[item.itemId]?.state;
      if (itemState === "✓") {
        byCategory[categoryKey].done += 1;
      }
    });
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
