/**
 * Utility per caricare e gestire checklist dinamiche
 * Integra con requisiti_dimensioni_esrs.json per mappatura dimensioni aziendali
 */

export class ChecklistLoader {
  static async loadChecklist(type = "esrs-base") {
    try {
      const checklist = await import(`../checklists/${type}.json`);
      const augmented = this.augmentChecklist(checklist.default);
      const validatedChecklist = this.validateChecklist(augmented);

      console.log(`✅ Checklist ${type} caricata con successo:`, {
        name: validatedChecklist.metadata.name,
        version: validatedChecklist.metadata.version,
        totalItems: validatedChecklist.metadata.totalItems,
        categories: Object.keys(validatedChecklist.categories),
      });

      return validatedChecklist;
    } catch (error) {
      console.error(`❌ Errore caricamento checklist ${type}:`, error);
      throw new Error(
        `Impossibile caricare la checklist ${type}: ${error.message}`
      );
    }
  }

  // ------------------------
  // Augment & Normalize utils
  // ------------------------
  static augmentChecklist(data) {
    if (!data || typeof data !== "object") return data;
    const out = JSON.parse(JSON.stringify(data));
    out.categories = out.categories || {};

    // 1) Normalizza Governance: mappa G2-G5 in ESRS-2
    this.normalizeGovernance(out);

    // 2) Aggiungi classification euristica su tutti gli items
    this.addClassification(out);

    // 3) Enrich KPI placeholders su E1, E3, E5, S1, S2, S4
    this.addKpiPlaceholders(out);

    return out;
  }

  static slugify(str) {
    return String(str || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  static hashShort(input) {
    let h = 0x811c9dc5;
    for (let i = 0; i < input.length; i++) {
      h ^= input.charCodeAt(i);
      h = (h + ((h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24))) >>> 0;
    }
    return ("0000000" + h.toString(16)).slice(-8);
  }

  static classify(label) {
    const l = String(label || "").toLowerCase();
    if (l.includes("politich")) return "policy";
    if (l.includes("azione") || l.includes("intervento")) return "action";
    if (l.includes("obiettivo") || l.includes("target")) return "target";
    if (
      l.includes("monitoragg") ||
      l.includes("inventar") ||
      l.includes("indic") ||
      l.includes("kpi") ||
      l.includes("misur") ||
      l.includes("report")
    )
      return "metric";
    return "general";
  }

  static normalizeGovernance(out) {
    const cats = out.categories;
    const mapCats = ["G2", "G3", "G4", "G5"];
    // Assicura esistenza ESRS-2
    if (!cats["ESRS-2"]) {
      cats["ESRS-2"] = {
        title: "Informative Generali",
        description:
          "Disclosure generali trasversali (Governance, Strategia, IRO, Metriche/Target)",
        code: "ESRS-2",
        items: [],
      };
    }
    const target = cats["ESRS-2"].items;

    mapCats.forEach((k) => {
      if (!cats[k]) return;
      const src = cats[k];
      (src.items || []).forEach((it, idx) => {
        const base = `${k}-${it.id || this.slugify(it.text || "")}-${idx}`;
        const newId = `ESRS2_${this.hashShort(base)}`;
        target.push({
          ...it,
          id: newId,
          sourceCategory: k,
        });
      });
      delete cats[k];
    });
  }

  static addClassification(out) {
    const cats = out.categories || {};
    Object.keys(cats).forEach((k) => {
      const cat = cats[k];
      if (!Array.isArray(cat.items)) return;
      cat.items = cat.items.map((it) => ({
        ...it,
        classification:
          it.classification || this.classify(it.text || it.title || ""),
      }));
    });
  }

  static ensureItem(categories, catKey, newItem) {
    const cat = categories[catKey];
    if (!cat || !Array.isArray(cat.items)) return;
    const exists = cat.items.some(
      (i) => (i.text || "").toLowerCase() === (newItem.text || "").toLowerCase()
    );
    if (exists) return;
    const slug = this.slugify(newItem.text || newItem.id || "auto-item");
    const id =
      newItem.id ||
      `${cat.code || catKey}-KPI-${this.hashShort(`${catKey}-${slug}`)}`;
    cat.items.push({
      id,
      text: newItem.text,
      applicability: newItem.applicability || ["Media", "Grande"],
      mandatory:
        typeof newItem.mandatory === "boolean" ? newItem.mandatory : true,
      reference: newItem.reference || cat.code || catKey,
      description: newItem.description || undefined,
      classification: newItem.classification || this.classify(newItem.text),
    });
  }

  static addKpiPlaceholders(out) {
    const c = out.categories || {};
    // E1 – clima KPI base
    if (c.E1) {
      this.ensureItem(c, "E1", {
        text: "Intensità emissioni GHG (kgCO2e/unità)",
        classification: "metric",
      });
      this.ensureItem(c, "E1", {
        text: "Energia totale consumata (MWh)",
        classification: "metric",
      });
      this.ensureItem(c, "E1", {
        text: "Quota energia rinnovabile (%)",
        classification: "metric",
      });
      this.ensureItem(c, "E1", {
        text: "Emissioni Scope 1",
        classification: "metric",
      });
      this.ensureItem(c, "E1", {
        text: "Emissioni Scope 2 (location-based)",
        classification: "metric",
      });
      this.ensureItem(c, "E1", {
        text: "Emissioni Scope 2 (market-based)",
        classification: "metric",
      });
      this.ensureItem(c, "E1", {
        text: "Principali categorie Scope 3 coperte",
        classification: "general",
      });
      this.ensureItem(c, "E1", {
        text: "Analisi di scenario climatico eseguita (flag)",
        classification: "action",
      });
    }
    // E3 – acqua
    if (c.E3) {
      this.ensureItem(c, "E3", {
        text: "Prelievo idrico totale (m³)",
        classification: "metric",
      });
      this.ensureItem(c, "E3", {
        text: "Percentuale acqua riciclata (%)",
        classification: "metric",
      });
      this.ensureItem(c, "E3", {
        text: "Operazioni in aree ad alto stress idrico (n)",
        classification: "metric",
      });
    }
    // E5 – risorse e circolarità
    if (c.E5) {
      this.ensureItem(c, "E5", {
        text: "Rifiuti totali generati (t)",
        classification: "metric",
      });
      this.ensureItem(c, "E5", {
        text: "Quota rifiuti recuperati/riciclati (%)",
        classification: "metric",
      });
      this.ensureItem(c, "E5", {
        text: "Materiali riciclati su input totali (%)",
        classification: "metric",
      });
    }
    // S1 – forza lavoro
    if (c.S1) {
      this.ensureItem(c, "S1", {
        text: "LTIFR (infortuni con assenza pro capite)",
        classification: "metric",
      });
      this.ensureItem(c, "S1", {
        text: "Tasso infortuni totale",
        classification: "metric",
      });
      this.ensureItem(c, "S1", {
        text: "Ore di formazione medie pro-capite",
        classification: "metric",
      });
      this.ensureItem(c, "S1", {
        text: "Turnover personale (%)",
        classification: "metric",
      });
      this.ensureItem(c, "S1", {
        text: "Pay gap (placeholder)",
        classification: "metric",
      });
      this.ensureItem(c, "S1", {
        text: "Contratti permanenti su totale (%)",
        classification: "metric",
      });
      this.ensureItem(c, "S1", {
        text: "Copertura contrattazione collettiva (%)",
        classification: "metric",
      });
    }
    // S2 – catena del valore
    if (c.S2) {
      this.ensureItem(c, "S2", {
        text: "Fornitori auditati (%)",
        classification: "metric",
      });
      this.ensureItem(c, "S2", {
        text: "Non conformità diritti/condizioni rilevate (n)",
        classification: "metric",
      });
      this.ensureItem(c, "S2", {
        text: "Casi remediation completata (n)",
        classification: "metric",
      });
    }
    // S4 – consumatori
    if (c.S4) {
      this.ensureItem(c, "S4", {
        text: "Reclami consumatori ricevuti (n)",
        classification: "metric",
      });
      this.ensureItem(c, "S4", {
        text: "Incidenti sicurezza prodotto (n)",
        classification: "metric",
      });
      this.ensureItem(c, "S4", {
        text: "Incidenti privacy/dati (n)",
        classification: "metric",
      });
    }
  }

  static validateChecklist(data) {
    // Validazione struttura base
    if (!data.metadata) {
      throw new Error("Manca sezione 'metadata' nella checklist");
    }

    if (!data.categories) {
      throw new Error("Manca sezione 'categories' nella checklist");
    }

    if (!data.metadata.name || !data.metadata.version) {
      throw new Error("Metadata incompleti: richiesti 'name' e 'version'");
    }

    // Validazione categorie
    const categories = Object.keys(data.categories);
    if (categories.length === 0) {
      throw new Error("Nessuna categoria trovata nella checklist");
    }

    // Validazione items per categoria
    let totalItems = 0;
    categories.forEach((categoryKey) => {
      const category = data.categories[categoryKey];

      if (!category.title || !category.items) {
        throw new Error(
          `Categoria '${categoryKey}' manca di 'title' o 'items'`
        );
      }

      if (!Array.isArray(category.items)) {
        throw new Error(
          `Items della categoria '${categoryKey}' deve essere un array`
        );
      }

      // Validazione singoli items
      category.items.forEach((item, index) => {
        if (!item.id || !item.text) {
          throw new Error(
            `Item ${index} della categoria '${categoryKey}' manca di 'id' o 'text'`
          );
        }

        if (!item.applicability || !Array.isArray(item.applicability)) {
          throw new Error(`Item ${item.id} manca di 'applicability' valida`);
        }

        totalItems++;
      });
    });

    // Aggiorna conteggio totale se non corrisponde
    if (data.metadata.totalItems !== totalItems) {
      console.warn(
        `⚠️ Conteggio items aggiornato: ${data.metadata.totalItems} → ${totalItems}`
      );
      data.metadata.totalItems = totalItems;
    }

    return data;
  }

  static async filterItemsByCompanySize(checklist, companySize) {
    if (!checklist || !companySize) {
      return checklist;
    }

    const filteredCategories = {};

    Object.keys(checklist.categories).forEach((categoryKey) => {
      const category = checklist.categories[categoryKey];

      // Filtra items in base alla dimensione aziendale
      const filteredItems = category.items.filter((item) => {
        const size = this.normalizeSizeName(companySize);
        return item.applicability.includes(size);
      });

      // Include la categoria solo se ha almeno un item applicabile
      if (filteredItems.length > 0) {
        filteredCategories[categoryKey] = {
          ...category,
          items: filteredItems,
        };
      }
    });

    return {
      ...checklist,
      categories: filteredCategories,
      metadata: {
        ...checklist.metadata,
        filteredFor: companySize,
        totalItemsFiltered: Object.values(filteredCategories).reduce(
          (total, cat) => total + cat.items.length,
          0
        ),
      },
    };
  }

  static normalizeSizeName(size) {
    // Normalizza i nomi delle dimensioni aziendali
    const sizeMap = {
      micro: "Micro",
      piccola: "Piccola",
      media: "Media",
      grande: "Grande",
      Micro: "Micro",
      Piccola: "Piccola",
      Media: "Media",
      Grande: "Grande",
    };
    return sizeMap[size] || size;
  }

  static convertToLegacyFormat(checklist) {
    // Converte la nuova struttura JSON alla vecchia struttura per compatibilità
    const legacyFormat = {};

    Object.keys(checklist.categories).forEach((categoryKey) => {
      const category = checklist.categories[categoryKey];
      legacyFormat[categoryKey] = category.items.map((item) => ({
        item: item.text,
        applicability: item.applicability,
        mandatory: item.mandatory,
      }));
    });

    return legacyFormat;
  }
}

export default ChecklistLoader;
