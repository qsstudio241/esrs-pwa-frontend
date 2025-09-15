import { useCallback, useMemo } from 'react';
import { KPI_STATES } from '../utils/kpiValidation';

/**
 * Gestione centralizzata stato KPI persistito in audit.kpiStates
 * - key: itemId
 * - value: { state: KPI_STATES.*, updatedAt }
 */
export default function useKpiState(audit, onUpdate) {
  const kpiStates = useMemo(() => audit?.kpiStates || {}, [audit]);

  const setStateFor = useCallback((itemId, mandatory) => {
    if (!audit || !onUpdate || !itemId) return;
    const current = kpiStates[itemId]?.state;
    const order = mandatory ? [KPI_STATES.OK, KPI_STATES.NOK] : [KPI_STATES.OK, KPI_STATES.NOK, KPI_STATES.OPT_EMPTY];
    const next = !current ? order[0] : order[(order.indexOf(current) + 1) % order.length];
    onUpdate({ kpiStates: { ...kpiStates, [itemId]: { state: next, updatedAt: new Date().toISOString() } } });
  }, [audit, onUpdate, kpiStates]);

  const getState = useCallback((itemId) => kpiStates[itemId]?.state || null, [kpiStates]);

  const aggregateCategory = useCallback((itemIds) => {
    const values = itemIds.map(id => kpiStates[id]?.state).filter(Boolean);
    if (!values.length) return null;
    if (values.some(v => v === KPI_STATES.NOK)) return KPI_STATES.NOK;
    if (values.every(v => v === KPI_STATES.OK || v === KPI_STATES.NA || v.startsWith('OPT'))) return KPI_STATES.OK;
    return KPI_STATES.OK;
  }, [kpiStates]);

  return useMemo(() => ({ getState, setStateFor, aggregateCategory }), [getState, setStateFor, aggregateCategory]);
}
