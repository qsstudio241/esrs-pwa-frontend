import { useMemo } from "react";
import esrsDetails from "../data/esrsDetails";

/**
 * Hook per ottenere e filtrare il dataset ESRS.
 * Fornisce:
 * - categories: elenco categorie presenti (filtrate se serve)
 * - all: dataset completo originale
 * - filtered: dataset filtrato per dimensione aziendale (se fornita)
 * - search(text): restituisce array risultati { category, index, item }
 */
export function useEsrsData(dimensioneAzienda, options = {}) {
  const { includeEmpty = true } = options;

  const filtered = useMemo(() => {
    if (!dimensioneAzienda) return esrsDetails;
    const out = {};
    Object.keys(esrsDetails).forEach((cat) => {
      const items = esrsDetails[cat].filter(
        (i) => !i.applicability || i.applicability.includes(dimensioneAzienda)
      );
      if (items.length || includeEmpty) out[cat] = items;
    });
    return out;
  }, [dimensioneAzienda, includeEmpty]);

  const categories = useMemo(() => Object.keys(filtered), [filtered]);

  function search(text) {
    if (!text) return [];
    const q = text.toLowerCase();
    const results = [];
    Object.keys(filtered).forEach((cat) => {
      filtered[cat].forEach((item, index) => {
        if (item.item.toLowerCase().includes(q)) {
          results.push({ category: cat, index, item });
        }
      });
    });
    return results;
  }

  return { categories, all: esrsDetails, filtered, search };
}

export default useEsrsData;
