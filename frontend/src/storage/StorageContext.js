import React, { createContext, useContext, useState } from "react";
import { LocalFsProvider } from "./LocalFsProvider";

const StorageCtx = createContext(null);

export function StorageProvider({ children }) {
  const [provider] = useState(() => new LocalFsProvider());
  return <StorageCtx.Provider value={provider}>{children}</StorageCtx.Provider>;
}

export function useStorage() {
  const ctx = useContext(StorageCtx);
  if (!ctx) throw new Error("useStorage must be used within StorageProvider");
  return {
    ready: () => ctx.ready(),
    connect: (h) => ctx.connect(h),
    initAuditTree: (arg, categories) => ctx.initAuditTree(arg, categories),
    saveEvidence: (a1, f, c, opts) => ctx.saveEvidence(a1, f, c, opts),
    deleteEvidence: (cOrP, f) => ctx.deleteEvidence(cOrP, f),
    listEvidence: (cat) => ctx.listEvidence(cat),
    saveExport: (payload) => ctx.saveExport(payload),
    ensurePermission: (mode) => ctx.ensurePermission(mode),
  };
}
