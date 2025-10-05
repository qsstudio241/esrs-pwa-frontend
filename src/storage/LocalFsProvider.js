// src/storage/LocalFsProvider.js

export class LocalFsProvider {
  constructor() {
    this.auditDir = null;
    this.subDirs = null;
    this.lastAuditId = null;
    this.rootPath = null;
    this.clientName = null; // Aggiungiamo il nome cliente
  }

  ready() {
    const isReady = !!this.auditDir && !!this.subDirs;
    console.log("🔎 LocalFsProvider.ready()", {
      isReady,
      auditDir: this.auditDir,
      subDirs: this.subDirs,
      auditDirType: this.auditDir?.constructor?.name,
      subDirsKeys: this.subDirs ? Object.keys(this.subDirs) : null,
    });
    return isReady;
  }

  // Metodo migliorato con gestione errori
  async ensurePermission(mode = "readwrite") {
    if (!this.auditDir) throw new Error("Cartella audit non selezionata");
    const q = await this.auditDir.queryPermission({ mode });
    if (q === "granted") return true;
    const r = await this.auditDir.requestPermission({ mode });
    return r === "granted";
  }

  // NUOVO METODO: Inizializza audit con nome cliente per NUOVO AUDIT
  async initNewAuditTree(clientName) {
    try {
      // Verifica supporto API
      if (!window.showDirectoryPicker) {
        throw new Error(
          "Il browser non supporta File System Access API. Usa Chrome/Edge versione recente."
        );
      }

      console.log(
        `🆕 Nuovo audit - selezione cartella PADRE per: ${clientName}`
      );

      // Mostra il picker con opzioni - l'utente seleziona dove creare la struttura
      const parentDir = await window.showDirectoryPicker({
        mode: "readwrite",
        startIn: "documents",
      });

      console.log("Directory padre selezionata:", parentDir.name);

      // Salva il percorso della root
      this.rootPath = parentDir.name;
      this.clientName = clientName;

      // Crea sempre la cartella cliente nella directory selezionata
      console.log(
        `📁 Creazione cartella cliente: ${clientName} in ${parentDir.name}`
      );
      const clientDir = await parentDir.getDirectoryHandle(clientName, {
        create: true,
      });

      return await this.createAuditStructure(clientDir, clientName, true);
    } catch (error) {
      console.error("Errore durante la creazione nuovo audit:", error);
      this.resetState();
      throw this.handleDirectoryError(error);
    }
  }

  // NUOVO METODO: Riprende audit esistente - l'utente seleziona la cartella AZIENDA
  async resumeExistingAudit(clientName) {
    try {
      // Verifica supporto API
      if (!window.showDirectoryPicker) {
        throw new Error(
          "Il browser non supporta File System Access API. Usa Chrome/Edge versione recente."
        );
      }

      console.log(
        `🔄 Ripresa audit - selezione cartella AZIENDA: ${clientName}`
      );

      // Mostra il picker - l'utente deve selezionare direttamente la cartella azienda
      const clientDir = await window.showDirectoryPicker({
        mode: "readwrite",
        startIn: "documents",
      });

      console.log("Directory azienda selezionata:", clientDir.name);

      // Verifica che sia la cartella giusta
      if (!clientDir.name.includes(clientName)) {
        const confirm = window.confirm(
          `⚠️ Hai selezionato la cartella "${clientDir.name}" ma l'audit è per "${clientName}".\n\nSei sicuro che sia la cartella corretta?`
        );
        if (!confirm) {
          throw new Error("Selezione cartella annullata dall'utente");
        }
      }

      // Salva il percorso (la cartella padre sarà dedotta)
      this.rootPath = "Cartella selezionata";
      this.clientName = clientName;

      return await this.createAuditStructure(clientDir, clientName, false);
    } catch (error) {
      console.error("Errore durante la ripresa audit:", error);
      this.resetState();
      throw this.handleDirectoryError(error);
    }
  }

  // METODO UNIFICATO per creare/verificare struttura audit
  async createAuditStructure(clientDir, clientName, isNewAudit) {
    const year = new Date().getFullYear();
    const auditDirName = `${year}_ESRS_Bilancio`;

    // Verifica se la struttura audit esiste già
    let auditDir;
    try {
      auditDir = await clientDir.getDirectoryHandle(auditDirName);
      console.log(`📁 Struttura audit esistente trovata: ${auditDirName}`);
    } catch {
      if (isNewAudit) {
        console.log(`🆕 Creazione nuova struttura audit: ${auditDirName}`);
        auditDir = await clientDir.getDirectoryHandle(auditDirName, {
          create: true,
        });
      } else {
        throw new Error(
          `❌ Struttura audit "${auditDirName}" non trovata nella cartella selezionata.\n\nPer riprendere un audit esistente, seleziona la cartella che contiene già la struttura "${auditDirName}".`
        );
      }
    }

    // Solo cartelle essenziali
    const evidenze = await auditDir.getDirectoryHandle("Evidenze", {
      create: true,
    });
    const exportDir = await auditDir.getDirectoryHandle("Export", {
      create: true,
    });
    const report = await auditDir.getDirectoryHandle("Report", {
      create: true,
    });

    // Crea sottocartelle evidenze per categorie ESRS
    // Tenta di leggere le categorie dalla checklist dinamica, con fallback a lista base
    let categories = [
      "Generale",
      "E1",
      "E2",
      "E3",
      "E4",
      "E5",
      "S1",
      "S2",
      "S3",
      "S4",
      "G1",
      "G2",
      "G3",
      "G4",
      "G5",
    ];
    try {
      const mod = await import("../checklists/esrs-base.json");
      const data = mod.default || mod;
      const dynamicCategories = Object.keys(data.categories || {});
      if (dynamicCategories.length) {
        categories = dynamicCategories;
      }
    } catch (e) {
      console.warn(
        "Impossibile caricare checklist dinamica per creare cartelle, uso fallback categorie base."
      );
    }

    for (const category of categories) {
      try {
        await evidenze.getDirectoryHandle(category, { create: true });
      } catch (e) {
        console.warn(
          `Impossibile creare cartella Evidenze/${category}: ${e.message}`
        );
      }
    }

    this.auditDir = auditDir;
    this.subDirs = { evidenze, export: exportDir, report };
    this.lastAuditId = `${clientName}_${year}`;

    // Notifica il context del cambiamento stato
    if (this._triggerUpdate) {
      this._triggerUpdate();
    }

    console.log(
      `✅ Struttura audit ${
        isNewAudit ? "creata" : "collegata"
      } per ${clientName}:`,
      {
        client: clientName,
        audit: `${year}_ESRS_Bilancio`,
        structure: "Evidenze (Generale,E1..E5,S1..S4,G1..G5) | Export | Report",
        mode: isNewAudit ? "NUOVO" : "RIPRESA",
      }
    );

    return {
      success: true,
      structure: `${clientName}/${year}_ESRS_Bilancio/[Evidenze|Export|Report]`,
      categories: categories,
      isNewAudit: isNewAudit,
    };
  }

  // Metodi helper
  resetState() {
    this.auditDir = null;
    this.subDirs = null;
    this.rootPath = null;
    this.clientName = null;

    // Notifica il context del cambiamento stato
    if (this._triggerUpdate) {
      this._triggerUpdate();
    }
  }

  handleDirectoryError(error) {
    if (error.name === "AbortError") {
      return new Error("Selezione directory annullata dall'utente.");
    } else if (error.name === "NotAllowedError") {
      return new Error(
        "Permessi negati. Concedi i permessi per accedere al file system."
      );
    } else if (error.message.includes("not supported")) {
      return new Error(
        "Browser non compatibile. Usa Chrome o Edge versione recente."
      );
    } else {
      return new Error(`Errore nella selezione directory: ${error.message}`);
    }
  }

  // METODO LEGACY: Mantiene compatibilità ma usa la nuova logica
  async initAuditTreeWithClient(clientName) {
    // Per retrocompatibilità, assumiamo che sia un nuovo audit
    console.warn(
      "initAuditTreeWithClient è deprecato, usa initNewAuditTree o resumeExistingAudit"
    );
    return await this.initNewAuditTree(clientName);
  }

  // DEPRECATO: Manteniamo per retrocompatibilità ma usiamo il nuovo metodo
  async initAuditTree(audit) {
    console.warn("initAuditTree è deprecato, usa initAuditTreeWithClient");
    return await this.initAuditTreeWithClient(`Cliente_${audit.id}`);
  }

  async writeBlob(dir, fileName, blob) {
    try {
      console.log(`Tentativo di scrittura file: ${fileName}`);
      console.log(`Directory handle:`, dir);

      const fh = await dir.getFileHandle(fileName, { create: true });
      console.log(`File handle ottenuto per: ${fileName}`);

      const ws = await fh.createWritable();
      console.log(`Writable stream creato per: ${fileName}`);

      await ws.write(blob);
      console.log(`Dati scritti per: ${fileName}`);

      await ws.close();
      console.log(`File salvato con successo: ${fileName}`);

      return `./${fileName}`;
    } catch (error) {
      console.error("Errore scrittura file:", error);
      console.error("Dettagli errore:", {
        name: error.name,
        message: error.message,
        stack: error.stack,
      });
      throw new Error(
        `Impossibile salvare il file ${fileName}: ${error.message}`
      );
    }
  }

  async saveEvidence(key, file, category = null) {
    let triedReinit = false;
    while (!this.subDirs?.evidenze) {
      if (!triedReinit && this.lastAuditId && this.clientName) {
        if (
          window.confirm(
            "La cartella audit non è inizializzata o l'accesso è scaduto. Vuoi riselezionare la cartella audit ora?"
          )
        ) {
          try {
            await this.initAuditTreeWithClient(this.clientName);
            triedReinit = true;
          } catch (err) {
            alert(
              "Errore durante la riselezione della cartella audit: " +
                err.message
            );
            throw new Error(
              "Impossibile riselezionare la cartella audit. Ricarica la pagina e seleziona manualmente la cartella."
            );
          }
        } else {
          throw new Error(
            "Cartella audit non inizializzata. Seleziona prima una cartella."
          );
        }
      } else {
        throw new Error(
          "Cartella audit non inizializzata. Seleziona prima una cartella."
        );
      }
    }

    try {
      // Verifica che abbiamo ancora accesso alla cartella evidenze
      await this.ensurePermission("readwrite");

      // Determina la categoria dalla chiave se non fornita
      const categoryName = category || key.split("-")[0];
      console.log(`Tentativo di accedere cartella categoria: ${categoryName}`);

      // Ottieni la sottocartella per categoria (già creata durante init)
      let categoryDir;
      try {
        categoryDir = await this.subDirs.evidenze.getDirectoryHandle(
          categoryName
        );
        console.log(`Cartella categoria ${categoryName} trovata con successo`);
      } catch (dirError) {
        console.error(`Errore accesso cartella ${categoryName}:`, dirError);
        // Prova a crearla se non esiste
        categoryDir = await this.subDirs.evidenze.getDirectoryHandle(
          categoryName,
          { create: true }
        );
        console.log(`Cartella categoria ${categoryName} creata`);
      }

      // Sanitizza il nome del file
      const safeFileName = file.name
        .replace(/[<>:"/\\|?*]/g, "_")
        .replace(/[^\w\s.-]/g, "_")
        .replace(/\s+/g, "_")
        .slice(0, 50);

      const safeKey = key.replace(/[^\w-]+/g, "_").slice(0, 30);

      const stamp = new Date().toISOString().replace(/[:.]/g, "").slice(0, 15);

      const fname = `${safeKey}__${stamp}__${safeFileName}`;
      const finalName =
        fname.length > 100 ? fname.slice(0, 100) + ".file" : fname;

      console.log(
        `Tentativo di salvare file: ${finalName} nella cartella ${categoryName}`
      );

      await this.writeBlob(categoryDir, finalName, file);

      console.log(
        `File salvato con successo: Evidenze/${categoryName}/${finalName}`
      );

      // Costruisci il percorso completo con struttura semplificata
      const year = new Date().getFullYear();
      const fullPath =
        this.rootPath && this.clientName
          ? `${this.rootPath}/${this.clientName}/${year}_ESRS_Bilancio/Evidenze/${categoryName}/${finalName}` // ← CAMBIATO DA ESRS A ESG
          : `Evidenze/${categoryName}/${finalName}`;

      return {
        path: fullPath,
        name: file.name,
        type: file.type,
      };
    } catch (error) {
      console.error("Errore salvataggio evidenza:", error);
      throw new Error(
        "Impossibile salvare il file " + file.name + ": " + error.message
      );
    }
  }

  async saveExport(payload) {
    if (!this.subDirs?.export) {
      throw new Error(
        "Cartella export non inizializzata. Seleziona prima una cartella."
      );
    }

    try {
      const stamp = new Date().toISOString().replace(/[:.]/g, "").slice(0, 15);
      const clientPrefix = this.clientName ? `${this.clientName}_` : "";
      const fn = `${clientPrefix}export_${stamp}.json`;
      const blob = new Blob([JSON.stringify(payload, null, 2)], {
        type: "application/json",
      });
      await this.writeBlob(this.subDirs.export, fn, blob);
      return { path: `Export/${fn}`, fileName: fn };
    } catch (error) {
      console.error("Errore salvataggio export:", error);
      throw error;
    }
  }
}
