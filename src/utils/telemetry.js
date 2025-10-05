// Lightweight telemetry collector (local only unless endpoint configured)
// Opt-in flag stored in localStorage key: telemetry_opt_in === "1"

const STORAGE_KEY = "telemetry_events";

function isOptIn() {
  try {
    return localStorage.getItem("telemetry_opt_in") === "1";
  } catch {
    return false;
  }
}

export function setTelemetryOptIn(enabled) {
  try {
    localStorage.setItem("telemetry_opt_in", enabled ? "1" : "0");
  } catch {}
}

export function recordTelemetry(eventName, payload = {}) {
  if (!isOptIn()) return;
  try {
    const now = new Date().toISOString();
    const raw = localStorage.getItem(STORAGE_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    arr.push({ ts: now, ev: eventName, p: sanitizePayload(payload) });
    // cap size to last 500 events
    while (arr.length > 500) arr.shift();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
  } catch (e) {
    // swallow
  }
}

export function dumpTelemetry() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function sanitizePayload(p) {
  // Remove large fields / potential PII
  const clone = { ...p };
  if (clone.comment) delete clone.comment;
  if (clone.fileNames && Array.isArray(clone.fileNames)) {
    clone.fileNames = clone.fileNames.map((n) => n.slice(0, 40));
  }
  return clone;
}

export function aggregateTelemetry() {
  const events = dumpTelemetry();
  const counters = {};
  events.forEach((e) => {
    counters[e.ev] = (counters[e.ev] || 0) + 1;
  });
  return counters;
}

// Convenience wrappers
export const Telemetry = {
  optIn: setTelemetryOptIn,
  record: recordTelemetry,
  dump: dumpTelemetry,
  aggregate: aggregateTelemetry,
};

export default Telemetry;
