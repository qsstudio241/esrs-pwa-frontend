import { useState, useEffect } from "react";
import { useStorage } from "../storage/StorageContext";

// Custom hook per gestire lo stato e la logica di storage audit
export function useAuditStorage(audit) {
  const storage = useStorage();
  const [auditDirReady, setAuditDirReady] = useState(false);
  const [auditPath, setAuditPath] = useState("");

  useEffect(() => {
    setAuditDirReady(storage.ready());
    setAuditPath(storage.auditDir?.structure || "");
  }, [storage, audit.id]);

  return {
    storage,
    auditDirReady,
    auditPath,
    setAuditDirReady,
    setAuditPath,
  };
}
