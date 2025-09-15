// Calcolo progress per categorie e totale
export function computeProgress(audit) {
  const completed = audit?.completed || {};
  const byCategory = {};
  Object.keys(completed).forEach((k) => {
    const cat = k.split("-")[0];
    byCategory[cat] = byCategory[cat] || { done: 0, total: 0 };
    byCategory[cat].total += 1;
    if (completed[k]) byCategory[cat].done += 1;
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
