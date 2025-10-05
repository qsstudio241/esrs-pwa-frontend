import { useRef, useEffect, useCallback } from "react";

// Generic debounce + periodic autosave (flushInterval ms) for state patches.
export default function useAutosaveDebounce(
  applyPatch,
  { delay = 400, flushInterval = 5000 } = {}
) {
  const timerRef = useRef(null);
  const lastPatchRef = useRef(null);
  const mountedRef = useRef(true);

  const schedule = useCallback(
    (patch) => {
      lastPatchRef.current = { ...(lastPatchRef.current || {}), ...patch };
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        if (lastPatchRef.current) {
          applyPatch(lastPatchRef.current);
          lastPatchRef.current = null;
        }
      }, delay);
    },
    [delay, applyPatch]
  );

  // periodic flush
  useEffect(() => {
    const h = setInterval(() => {
      if (lastPatchRef.current) {
        applyPatch(lastPatchRef.current);
        lastPatchRef.current = null;
      }
    }, flushInterval);
    return () => clearInterval(h);
  }, [flushInterval, applyPatch]);

  useEffect(
    () => () => {
      mountedRef.current = false;
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    []
  );

  return {
    queue: schedule,
    flushNow: () => {
      if (lastPatchRef.current) {
        applyPatch(lastPatchRef.current);
        lastPatchRef.current = null;
      }
    },
  };
}
