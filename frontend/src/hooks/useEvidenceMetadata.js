import { useCallback, useMemo } from "react";

/**
 * Hook per gestire metadata evidenze (descrizione, qualità, note auditor)
 * Struttura: audit.evidenceMetadata[fileKey] = { description, quality, notes, auditor, timestamp }
 */
export default function useEvidenceMetadata(audit, onUpdate) {
  const metadata = useMemo(
    () => audit?.evidenceMetadata || {},
    [audit?.evidenceMetadata]
  );

  const getMetadata = useCallback(
    (fileKey) => {
      return metadata[fileKey] || null;
    },
    [metadata]
  );

  const setMetadata = useCallback(
    (fileKey, data) => {
      if (!audit) return;

      const updated = {
        ...metadata,
        [fileKey]: {
          ...metadata[fileKey],
          ...data,
          timestamp: new Date().toISOString(),
        },
      };

      onUpdate({ evidenceMetadata: updated });
    },
    [audit, metadata, onUpdate]
  );

  const removeMetadata = useCallback(
    (fileKey) => {
      if (!audit) return;

      const updated = { ...metadata };
      delete updated[fileKey];

      onUpdate({ evidenceMetadata: updated });
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
