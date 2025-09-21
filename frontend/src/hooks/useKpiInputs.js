import { useCallback, useMemo } from "react";

export default function useKpiInputs(audit, onUpdate) {
  const kpiInputs = useMemo(() => audit?.kpiInputs || {}, [audit]);

  const setField = useCallback(
    (itemId, key, value) => {
      if (!audit || !onUpdate || !itemId || !key) return;
      const prev = kpiInputs[itemId] || {};
      onUpdate({
        kpiInputs: { ...kpiInputs, [itemId]: { ...prev, [key]: value } },
      });
    },
    [audit, onUpdate, kpiInputs]
  );

  const getFor = useCallback((itemId) => kpiInputs[itemId] || {}, [kpiInputs]);

  return useMemo(() => ({ getFor, setField }), [getFor, setField]);
}
