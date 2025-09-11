/**
 * Utility per caricare e gestire checklist dinamiche
 * Integra con requisiti_dimensioni_esrs.json per mappatura dimensioni aziendali
 */

export class ChecklistLoader {
  static async loadChecklist(type = "esrs-base") {
    try {
      const checklist = await import(`../checklists/${type}.json`);
      const validatedChecklist = this.validateChecklist(checklist.default);

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
