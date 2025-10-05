// Semplice profiler opzionale per registrare tempi operazioni chiave (upload, export)
// Conserva i metadati in audit.performanceLog (array) tramite callback persist

export function createProfiler({ enabled = true, persist } = {}) {
  const marks = new Map();

  function start(label, meta = {}) {
    if (!enabled) return;
    marks.set(label, { t0: performance.now(), meta });
  }

  function end(label, extra = {}) {
    if (!enabled) return;
    const entry = marks.get(label);
    if (!entry) return;
    const duration = performance.now() - entry.t0;
    const record = {
      label,
      durationMs: Math.round(duration),
      timestamp: new Date().toISOString(),
      ...entry.meta,
      ...extra,
    };
    marks.delete(label);
    if (persist) persist(record);
    return record;
  }

  return { start, end };
}

// Helper per calcolare dimensione complessiva evidenze di un audit
export function calcTotalEvidenceSize(audit) {
  if (!audit?.files) return 0;
  return Object.values(audit.files)
    .flat()
    .reduce((acc, f) => acc + (f.size || 0), 0);
}

// Normalizza record in audit.performanceLog
export function appendPerformanceLog(audit, record) {
  const log = Array.isArray(audit.performanceLog) ? audit.performanceLog : [];
  return { performanceLog: [...log, record] };
}
