// src/storage/LocalFsProvider.js

export class LocalFsProvider {
  constructor() {
    this.auditDir = null;
    this.subDirs = null;
    this.lastAuditId = null;
    this.rootPath = null; // Aggiungiamo il percorso della root
  }

  ready() {
    return !!this.auditDir && !!this.subDirs;
  }

  // Metodo migliorato con gestione errori
  async ensurePermission(mode = "readwrite") {
    if (!this.auditDir) throw new Error("Cartella audit non selezionata");
    const q = await this.auditDir.queryPermission({ mode });
    if (q === "granted") return true;
    const r = await this.auditDir.requestPermission({ mode });
    return r === "granted";
  }

  async initAuditTree(audit) {
    try {
      // Verifica supporto API
      if (!window.showDirectoryPicker) {
        throw new Error(
          "Il browser non supporta File System Access API. Usa Chrome/Edge versione recente."
        );
      }

      console.log("Iniziando selezione directory...");

      // Mostra il picker con opzioni
      const root = await window.showDirectoryPicker({
        mode: "readwrite",
        startIn: "documents",
      });

      console.log("Directory root selezionata:", root.name);

      // Salva il percorso della root per costruire percorsi assoluti
      this.rootPath = root.name;

      // Crea la struttura di cartelle con nomi più corti
      const bsDir = await root.getDirectoryHandle("ESG-Bilanci", {
        create: true,
      });
      const yearDir = await bsDir.getDirectoryHandle(
        String(new Date().getFullYear()),
        { create: true }
      );
      const auditDir = await yearDir.getDirectoryHandle(`A-${audit.id}`, {
        create: true,
      });

      const evidenze = await auditDir.getDirectoryHandle("Evidenze", {
        create: true,
      });
      const exp = await auditDir.getDirectoryHandle("Export", { create: true });
      const report = await auditDir.getDirectoryHandle("Report", {
        create: true,
      });
      const modelli = await report.getDirectoryHandle("Modelli", {
        create: true,
      });
      const finali = await report.getDirectoryHandle("Finali", {
        create: true,
      });

      this.auditDir = auditDir;
      this.subDirs = { evidenze, export: exp, report, modelli, finali };
      this.lastAuditId = audit.id;

      console.log("Struttura cartelle creata con successo");
      return this.subDirs;
    } catch (error) {
      console.error("Errore durante la selezione directory:", error);

      // Reset dello stato in caso di errore
      this.auditDir = null;
      this.subDirs = null;

      // Rilancia errore con messaggio user-friendly
      if (error.name === "AbortError") {
        throw new Error("Selezione directory annullata dall'utente.");
      } else if (error.name === "NotAllowedError") {
        throw new Error(
          "Permessi negati. Concedi i permessi per accedere al file system."
        );
      } else if (error.message.includes("not supported")) {
        throw new Error(
          "Browser non compatibile. Usa Chrome o Edge versione recente."
        );
      } else {
        throw new Error(`Errore nella selezione directory: ${error.message}`);
      }
    }
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
        stack: error.stack
      });
      throw new Error(
        `Impossibile salvare il file ${fileName}: ${error.message}`
      );
    }
  }

  async saveEvidence(key, file, category = null) {
    let triedReinit = false;
    while (!this.subDirs?.evidenze) {
      if (!triedReinit && this.lastAuditId) {
        if (
          window.confirm(
            "La cartella audit non è inizializzata o l'accesso è scaduto. Vuoi riselezionare la cartella audit ora?"
          )
        ) {
          try {
            await this.initAuditTree({ id: this.lastAuditId });
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
      console.log(`Tentativo di creare cartella categoria: ${categoryName}`);
      
      // Crea la sottocartella per categoria con gestione errori migliorata
      let categoryDir;
      try {
        categoryDir = await this.subDirs.evidenze.getDirectoryHandle(categoryName, {
          create: true,
        });
        console.log(`Cartella categoria ${categoryName} creata/trovata con successo`);
      } catch (dirError) {
        console.error(`Errore creazione cartella ${categoryName}:`, dirError);
        throw new Error(`Impossibile creare la cartella categoria ${categoryName}: ${dirError.message}`);
      }

      // Sanitizza il nome del file in modo più aggressivo
      const safeFileName = file.name
        .replace(/[<>:"/\\|?*]/g, "_")
        .replace(/[^\w\s.-]/g, "_")
        .replace(/\s+/g, "_")
        .slice(0, 50); // Limita la lunghezza del nome file originale
      
      const safeKey = key
        .replace(/[^\w-]+/g, "_")
        .slice(0, 30); // Riduce la lunghezza della chiave
      
      const stamp = new Date().toISOString().replace(/[:.]/g, "").slice(0, 15);
      
      // Costruisci il nome finale limitando la lunghezza totale
      const fname = `${safeKey}__${stamp}__${safeFileName}`;
      const finalName = fname.length > 100 ? fname.slice(0, 100) + ".file" : fname;
      
      console.log(`Tentativo di salvare file: ${finalName} nella cartella ${categoryName}`);
      
      await this.writeBlob(categoryDir, finalName, file);
      
      console.log(`File salvato con successo: Evidenze/${categoryName}/${finalName}`);
      
      // Costruisci il percorso completo
      const fullPath = this.rootPath ? 
        `${this.rootPath}/ESG-Bilanci/${new Date().getFullYear()}/A-${this.lastAuditId}/Evidenze/${categoryName}/${finalName}` :
        `Evidenze/${categoryName}/${finalName}`;
      
      return { 
        path: fullPath, 
        name: file.name, 
        type: file.type 
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
      const fn = `export_${stamp}.json`; // Nome più semplice
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
