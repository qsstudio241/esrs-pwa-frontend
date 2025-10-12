import { useCallback, useMemo } from "react";

/**
 * Gestione centralizzata stato KPI persistito in audit.kpiStates
 * - key: itemId
 * - value: { state: null | "✓", updatedAt }
 * - 2 stati semplici: null (Da fare) ⇄ "✓" (Completato)
 */
export default function useKpiState(audit, onUpdate) {
  const kpiStates = useMemo(() => audit?.kpiStates || {}, [audit]);

  const setStateFor = useCallback(
    (itemId, mandatory) => {
      if (!audit || !onUpdate || !itemId) return;
      const current = kpiStates[itemId]?.state;
      // Ciclo semplice: null (Da fare) ⇄ "✓" (Completato)
      const next = current === "✓" ? null : "✓";
      onUpdate({
        kpiStates: {
          ...kpiStates,
          [itemId]: { state: next, updatedAt: new Date().toISOString() },
        },
      });
    },
    [audit, onUpdate, kpiStates]
  );

  const getState = useCallback(
    (itemId) => kpiStates[itemId]?.state || null,
    [kpiStates]
  );

  const aggregateCategory = useCallback(
    (itemIds) => {
      const values = itemIds.map((id) => kpiStates[id]?.state);
      // Conta quanti sono completati (✓) vs totali
      const completed = values.filter((v) => v === "✓").length;
      const total = values.length;
      if (completed === 0) return null; // Nessuno completato
      if (completed === total) return "✓"; // Tutti completati
      return "partial"; // Parzialmente completato
    },
    [kpiStates]
  );

  return useMemo(
    () => ({ getState, setStateFor, aggregateCategory }),
    [getState, setStateFor, aggregateCategory]
  );
}
