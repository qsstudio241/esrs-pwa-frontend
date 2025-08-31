export class LocalFsProvider {
  constructor() {
    this.auditDir = null;
    this.subDirs = null;
  }

  ready() {
    return !!this.auditDir && !!this.subDirs;
  }

  async initAuditTree(audit) {
    if (!window.showDirectoryPicker) {
      throw new Error('Il browser non supporta File System Access API.');
    }
    const root = await window.showDirectoryPicker();
    const bsDir = await root.getDirectoryHandle('Bilancio di Sostenibilità', { create: true });
    const yearDir = await bsDir.getDirectoryHandle(String(new Date().getFullYear()), { create: true });
    const auditDir = await yearDir.getDirectoryHandle(`Audit-${audit.id}`, { create: true });

    const evidenze = await auditDir.getDirectoryHandle('Evidenze', { create: true });
    const exp = await auditDir.getDirectoryHandle('Export', { create: true });
    const report = await auditDir.getDirectoryHandle('Report', { create: true });
    const modelli = await report.getDirectoryHandle('Modelli', { create: true });
    const finali = await report.getDirectoryHandle('Finali', { create: true });

    this.auditDir = auditDir;
    this.subDirs = { evidenze, export: exp, report, modelli, finali };
    return this.subDirs;
  }

  async writeBlob(dir, fileName, blob) {
    const fh = await dir.getFileHandle(fileName, { create: true });
    const ws = await fh.createWritable();
    await ws.write(blob);
    await ws.close();
    return `./${fileName}`;
  }

  async saveEvidence(key, file) {
    if (!this.subDirs?.evidenze) throw new Error('Cartella audit non inizializzata');
    const safeKey = key.replace(/[^\w-]+/g, '_').slice(0, 60);
    const stamp = new Date().toISOString().replace(/[:.]/g, '');
    const fname = `${safeKey}__${stamp}__${file.name}`;
    await this.writeBlob(this.subDirs.evidenze, fname, file);
    return { path: `Evidenze/${fname}`, name: file.name, type: file.type };
  }

  async saveExport(payload) {
    if (!this.subDirs?.export) throw new Error('Cartella export non inizializzata');
    const stamp = new Date().toISOString().replace(/[:.]/g, '').slice(0, 15);
    const fn = `audit_${payload.meta.azienda}_${payload.meta.id}_${stamp}.json`;
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    await this.writeBlob(this.subDirs.export, fn, blob);
    return { path: `Export/${fn}`, fileName: fn };
  }
}
