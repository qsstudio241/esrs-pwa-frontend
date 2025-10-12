/**
 * KPI Schemas - Index Aggregator
 *
 * Architettura modulare per schemi KPI ESRS
 * Ogni schema è un file separato per:
 * - Manutenibilità
 * - Git-friendly (no merge conflicts)
 * - Testing isolato
 * - Code splitting ottimizzato
 */

// Import schemi modulari
import { getKpiSchemasGenerale } from "./generale";

// Import schemi legacy (da refactorare progressivamente)
import {
  getKpiSchemasE1,
  getKpiSchemasE2,
  getKpiSchemasS1,
  getKpiSchemasG1,
} from "../kpiSchemas"; // File originale

/**
 * Restituisce tutti gli schemi KPI organizzati per categoria
 * @returns {Object} Oggetto con chiave = categoryId, valore = oggetto schemi
 */
export function getAllKpiSchemasByCategory() {
  return {
    Generale: getKpiSchemasGenerale(),
    E1: getKpiSchemasE1(),
    E2: getKpiSchemasE2(),
    S1: getKpiSchemasS1(),
    G1: getKpiSchemasG1(),
  };
}

/**
 * Restituisce uno schema specifico per ID
 * @param {string} kpiId - ID del KPI (es. "G001", "E1006")
 * @returns {Object|null} Schema del KPI o null se non trovato
 */
export function getKpiSchemaById(kpiId) {
  const allSchemas = getAllKpiSchemasByCategory();

  for (const categorySchemas of Object.values(allSchemas)) {
    if (categorySchemas[kpiId]) {
      return categorySchemas[kpiId];
    }
  }

  return null;
}

// Export per compatibilità con codice esistente
export { getKpiSchemasGenerale };
