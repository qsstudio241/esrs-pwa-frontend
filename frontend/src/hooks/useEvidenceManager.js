import { useCallback, useMemo, useState } from "react";
import { recordTelemetry } from "../utils/telemetry";
import { useStorage } from "../storage/StorageContext";
import {
  createProfiler,
  calcTotalEvidenceSize,
  appendPerformanceLog,
} from "../utils/performanceProfiler";

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const MAX_SINGLE = 2 * 1024 * 1024; // 2MB
const MAX_TOTAL_PER_ITEM = 8 * 1024 * 1024; // 8MB cumulativi

// Responsabilità: gestione evidenze (upload, compressione, fallback, rimozione) astratta dal componente UI
// NON salva direttamente: delega a onUpdate(auditPatch)
// Limiti correnti: max 5 file per item, compressione immagini aggressiva, size <= 2MB dopo compressione in fallback LS

export function useEvidenceManager(audit, onUpdate) {
  const storage = useStorage();
  const files = useMemo(() => audit?.files || {}, [audit]);
  const [error, setError] = useState(null);

  const ready = !!audit;

  const safeUpdate = useCallback(
    (patch) => {
      if (!onUpdate || !audit) return;
      onUpdate(patch);
    },
    [audit, onUpdate]
  );

  const keyFrom = useCallback(
    (category, itemLabel) => `${category}-${itemLabel}`,
    []
  );

  const compressImageAggressive = useCallback(
    (file, maxWidth = 800, quality = 0.6) => {
      return new Promise((resolve, reject) => {
        if (!file.type.startsWith("image/")) {
          resolve(file);
          return;
        }
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image();
        img.onload = () => {
          try {
            const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
            canvas.width = Math.floor(img.width * ratio);
            canvas.height = Math.floor(img.height * ratio);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            canvas.toBlob(
              (blob) => {
                if (blob) {
                  resolve(new File([blob], file.name, { type: "image/jpeg" }));
                } else reject(new Error("Errore durante la compressione"));
              },
              "image/jpeg",
              quality
            );
          } catch (e) {
            reject(e);
          }
        };
        img.onerror = () => reject(new Error("Errore caricamento immagine"));
        img.src = URL.createObjectURL(file);
      });
    },
    []
  );

  const fileToBase64 = useCallback(
    (file) =>
      new Promise((res, rej) => {
        const reader = new FileReader();
        reader.onload = () => res(reader.result);
        reader.onerror = rej;
        reader.readAsDataURL(file);
      }),
    []
  );

  const addFiles = useCallback(
    async ({ category, itemLabel, fileList }) => {
      if (!ready) return;
      const key = keyFrom(category, itemLabel);
      const current = files[key] || [];
      const next = [...current];
      const profiler = createProfiler({
        enabled: true,
        persist: (record) => {
          const patch = appendPerformanceLog(audit, record);
          onUpdate && onUpdate(patch);
        },
      });
      profiler.start("evidence_upload", {
        category,
        itemLabel,
        count: fileList.length,
      });

      for (const file of fileList) {
        if (next.length >= 5) {
          setError("Limite 5 file per item");
          break;
        }
        try {
          if (ALLOWED_TYPES.indexOf(file.type) === -1) {
            throw new Error(`Tipo non consentito: ${file.type}`);
          }
          if (window.showDirectoryPicker && storage.ready()) {
            const meta = await storage.saveEvidence(key, file, category);
            next.push({ name: meta.name, type: meta.type, path: meta.path });
          } else {
            const processed = await compressImageAggressive(file);
            if (processed.size > MAX_SINGLE)
              throw new Error("File troppo grande dopo compressione (>2MB)");
            const base64Data = await fileToBase64(processed);
            next.push({
              name: processed.name,
              type: processed.type,
              data: base64Data,
              size: processed.size,
              compressed: true,
              timestamp: new Date().toISOString(),
            });
          }
          const cumSize = next.reduce((a, f) => a + (f.size || 0), 0);
          if (cumSize > MAX_TOTAL_PER_ITEM) {
            next.pop();
            throw new Error("Limite cumulativo 8MB superato");
          }
          recordTelemetry("evidence_add", {
            category,
            itemLabel,
            fileType: file.type,
            newCount: next.length,
          });
        } catch (e) {
          setError(e.message);
        }
      }
      safeUpdate({ files: { ...files, [key]: next } });
      const totalSize = calcTotalEvidenceSize({
        files: { ...files, [key]: next },
      });
      profiler.end("evidence_upload", { newCount: next.length, totalSize });
    },
    [
      files,
      keyFrom,
      ready,
      safeUpdate,
      storage,
      compressImageAggressive,
      fileToBase64,
      audit,
      onUpdate,
    ]
  );

  const removeFile = useCallback(
    async ({ category, itemLabel, index, copyPath = true }) => {
      const key = keyFrom(category, itemLabel);
      const current = files[key] || [];
      const f = current[index];
      if (f?.path && copyPath) {
        try {
          await navigator.clipboard.writeText(f.path);
        } catch {}
      }
      const next = current.filter((_, i) => i !== index);
      safeUpdate({ files: { ...files, [key]: next } });
      recordTelemetry("evidence_remove", {
        category,
        itemLabel,
        remaining: next.length,
      });
    },
    [files, keyFrom, safeUpdate]
  );

  const list = useCallback(
    (category, itemLabel) => files[keyFrom(category, itemLabel)] || [],
    [files, keyFrom]
  );

  return useMemo(
    () => ({
      ready,
      error,
      addFiles,
      removeFile,
      list,
      keyFrom,
    }),
    [ready, error, addFiles, removeFile, list, keyFrom]
  );
}

export default useEvidenceManager;
