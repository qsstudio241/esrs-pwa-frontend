import { useCallback, useMemo } from "react";

/**
 * Hook per gestire metadata raccolta KPI (referente, metodo, data)
 * Struttura: audit.kpiMetadata[itemId] = { referente: {nome, ruolo}, metodoRaccolta, dataRaccolta }
 */
export default function useKpiMetadata(audit, onUpdate) {
  const metadata = useMemo(
    () => audit?.kpiMetadata || {},
    [audit?.kpiMetadata]
  );

  const getMetadata = useCallback(
    (itemId) => {
      return metadata[itemId] || null;
    },
    [metadata]
  );

  const setMetadata = useCallback(
    (itemId, data) => {
      if (!audit) return;

      const updated = {
        ...metadata,
        [itemId]: {
          ...metadata[itemId],
          ...data,
          lastModified: new Date().toISOString(),
        },
      };

      onUpdate({ kpiMetadata: updated });
    },
    [audit, metadata, onUpdate]
  );

  const removeMetadata = useCallback(
    (itemId) => {
      if (!audit) return;

      const updated = { ...metadata };
      delete updated[itemId];

      onUpdate({ kpiMetadata: updated });
    },
    [audit, metadata, onUpdate]
  );

  return {
    getMetadata,
    setMetadata,
    removeMetadata,
    allMetadata: metadata,
  };
}
