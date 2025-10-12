import React, { createContext, useContext, useState } from "react";
import { LocalFsProvider } from "./LocalFsProvider";

const StorageCtx = createContext(null);

export function StorageProvider({ children }) {
  const [provider] = useState(() => new LocalFsProvider());
  const [, forceUpdate] = useState({});

  // Metodo per forzare re-render quando lo stato interno cambia
  const triggerUpdate = () => forceUpdate({});
  provider._triggerUpdate = triggerUpdate;

  return <StorageCtx.Provider value={provider}>{children}</StorageCtx.Provider>;
}

export function useStorage() {
  const ctx = useContext(StorageCtx);
  if (!ctx) throw new Error("useStorage must be used within StorageProvider");
  return {
    ready: () => ctx.ready(),
    connect: (h) => ctx.connect(h),
    initAuditTree: (arg, categories) => ctx.initAuditTree(arg, categories),
    initAuditTreeWithClient: (clientName) =>
      ctx.initAuditTreeWithClient(clientName),
    initNewAuditTree: (clientName, options) =>
      ctx.initNewAuditTree(clientName, options),
    resumeExistingAudit: (clientName, options) =>
      ctx.resumeExistingAudit(clientName, options),
    saveEvidence: (a1, f, c, opts) => ctx.saveEvidence(a1, f, c, opts),
    deleteEvidence: (cOrP, f) => ctx.deleteEvidence(cOrP, f),
    listEvidence: (cat) => ctx.listEvidence(cat),
    saveExport: (payload) => ctx.saveExport(payload),
    ensurePermission: (mode) => ctx.ensurePermission(mode),
    writeBlob: (dir, fileName, blob) => ctx.writeBlob(dir, fileName, blob),
    reset: () => ctx.resetState(),
    get provider() {
      return ctx;
    },
    // Espone le proprietà necessarie per wordExport
    get subDirs() {
      return ctx.subDirs;
    },
    get clientName() {
      return ctx.clientName;
    },
    get rootPath() {
      return ctx.rootPath;
    },
    get auditDir() {
      return ctx.auditDir;
    },
    set auditDir(value) {
      ctx.auditDir = value;
    },
    set subDirs(value) {
      ctx.subDirs = value;
    },
    get auditYear() {
      return ctx.auditYear;
    },
  };
}
