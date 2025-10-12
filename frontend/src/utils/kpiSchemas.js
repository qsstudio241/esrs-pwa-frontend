import esrsDetails from "../data/esrsDetails";
import { getSectoralKpiSchemas, detectIndustrySector } from "./sectoralKpis";
// Import schemi modulari - Generale
import G001 from "./kpiSchemas/generale/G001";
import G002 from "./kpiSchemas/generale/G002";
import G003 from "./kpiSchemas/generale/G003";
import G004 from "./kpiSchemas/generale/G004";
import G005 from "./kpiSchemas/generale/G005";
import G006 from "./kpiSchemas/generale/G006";
import G007 from "./kpiSchemas/generale/G007";
import G008 from "./kpiSchemas/generale/G008";
import G009 from "./kpiSchemas/generale/G009";
import G010 from "./kpiSchemas/generale/G010";
// Import schemi modulari - E1 Cambiamenti Climatici
import E1001 from "./kpiSchemas/environmental/e1/E1001";
import E1002 from "./kpiSchemas/environmental/e1/E1002";
import E1003 from "./kpiSchemas/environmental/e1/E1003";
import E1004 from "./kpiSchemas/environmental/e1/E1004";
import E1005 from "./kpiSchemas/environmental/e1/E1005";
import E1006 from "./kpiSchemas/environmental/e1/E1006";
// Import schemi modulari - E2 Inquinamento
import E2001 from "./kpiSchemas/environmental/e2/E2001";
import E2002 from "./kpiSchemas/environmental/e2/E2002";
import E2003 from "./kpiSchemas/environmental/e2/E2003";
import E2004 from "./kpiSchemas/environmental/e2/E2004";
import E2005 from "./kpiSchemas/environmental/e2/E2005";
import E2006 from "./kpiSchemas/environmental/e2/E2006";
// Import schemi modulari - S1 Forza Lavoro Propria
import S1001 from "./kpiSchemas/social/s1/S1001";
import S1002 from "./kpiSchemas/social/s1/S1002";
import S1003 from "./kpiSchemas/social/s1/S1003";
import S1004 from "./kpiSchemas/social/s1/S1004";
import S1005 from "./kpiSchemas/social/s1/S1005";
import S1006 from "./kpiSchemas/social/s1/S1006";
// Import schemi modulari - E3 Risorse Idriche
import E3001 from "./kpiSchemas/environmental/e3/E3001";
import E3002 from "./kpiSchemas/environmental/e3/E3002";
// Import schemi modulari - E4 Biodiversità
import E4001 from "./kpiSchemas/environmental/e4/E4001";
import E4002 from "./kpiSchemas/environmental/e4/E4002";
// Import schemi modulari - E5 Economia Circolare
import E5001 from "./kpiSchemas/environmental/e5/E5001";
import E5002 from "./kpiSchemas/environmental/e5/E5002";
// Import schemi modulari - S2 Lavoratori Catena Valore
import S2001 from "./kpiSchemas/social/s2/S2001";
import S2002 from "./kpiSchemas/social/s2/S2002";
// Import schemi modulari - S3 Comunità Interessate
import S3001 from "./kpiSchemas/social/s3/S3001";
import S3002 from "./kpiSchemas/social/s3/S3002";
// Import schemi modulari - S4 Consumatori
import S4001 from "./kpiSchemas/social/s4/S4001";
import S4002 from "./kpiSchemas/social/s4/S4002";
import S4003 from "./kpiSchemas/social/s4/S4003";
import S4004 from "./kpiSchemas/social/s4/S4004";
import S4005 from "./kpiSchemas/social/s4/S4005";
import S4006 from "./kpiSchemas/social/s4/S4006";
// Import aggregatori governance modulari - G1-G5
import { getKpiSchemasG1 } from "./kpiSchemas/governance/g1";
import { getKpiSchemasG2 } from "./kpiSchemas/governance/g2";
import { getKpiSchemasG3 } from "./kpiSchemas/governance/g3";
import { getKpiSchemasG4 } from "./kpiSchemas/governance/g4";
import { getKpiSchemasG5 } from "./kpiSchemas/governance/g5";

export function findItemId(category, labelStartsWith) {
  const items = esrsDetails[category] || [];
  const lower = labelStartsWith.toLowerCase();
  const found = items.find((it) =>
    (it.item || "").toLowerCase().startsWith(lower)
  );
  return found ? found.itemId : null;
}

// Schema fields: { key, label, type: 'bool'|'number'|'enum'|'text'|'date', required?, min?, max?, unit?, enum? }
// Custom checks per item implement normative consistency.

export function getKpiSchemasGenerale() {
  // Tutti gli schemi Generale sono ora modulari
  return {
    G001,
    G002,
    G003,
    G004,
    G005,
    G006,
    G007,
    G008,
    G009,
    G010,
  };
}

// ==================== E1: CAMBIAMENTI CLIMATICI ====================
export function getKpiSchemasE1() {
  // Tutti gli schemi E1 sono ora modulari
  return {
    E1001,
    E1002,
    E1003,
    E1004,
    E1005,
    E1006,
  };
}

// ==================== E2: INQUINAMENTO ====================
export function getKpiSchemasE2() {
  // Tutti gli schemi E2 sono ora modulari
  return {
    E2001,
    E2002,
    E2003,
    E2004,
    E2005,
    E2006,
  };
}

// ==================== S1: FORZA LAVORO PROPRIA ====================
export function getKpiSchemasS1() {
  // Tutti gli schemi S1 sono ora modulari
  return {
    S1001,
    S1002,
    S1003,
    S1004,
    S1005,
    S1006,
  };
}

// ==================== E3: RISORSE IDRICHE E MARINE ====================
export function getKpiSchemasE3() {
  // Tutti gli schemi E3 sono ora modulari
  return {
    E3001,
    E3002,
  };
}

// ==================== E4: BIODIVERSITÀ ED ECOSISTEMI ====================
export function getKpiSchemasE4() {
  // Tutti gli schemi E4 sono ora modulari
  return {
    E4001,
    E4002,
  };
}

// ==================== E5: ECONOMIA CIRCOLARE ====================
export function getKpiSchemasE5() {
  // Tutti gli schemi E5 sono ora modulari
  return {
    E5001,
    E5002,
  };
}

// ==================== S2: LAVORATORI CATENA DEL VALORE ====================
export function getKpiSchemasS2() {
  // Tutti gli schemi S2 sono ora modulari
  return {
    S2001,
    S2002,
  };
}

// ==================== S3: COMUNITÀ INTERESSATE ====================
export function getKpiSchemasS3() {
  // Tutti gli schemi S3 sono ora modulari
  return {
    S3001,
    S3002,
  };
}

// ==================== S4: CONSUMATORI E UTENTI FINALI ====================
export function getKpiSchemasS4() {
  // Tutti gli schemi S4 sono ora modulari
  return {
    S4001,
    S4002,
    S4003,
    S4004,
    S4005,
    S4006,
  };
}

// ==================== G1: GOVERNANCE - CONDOTTA AZIENDALE ====================
// Tutti gli schemi G1 sono ora modulari (importati dall'index)

// ==================== G2: GOVERNANCE - PRATICHE DI GOVERNANCE ====================
export function getKpiSchemasG2All() {
  return getKpiSchemasG2();
}

// ==================== G3: GOVERNANCE - RISK MANAGEMENT ====================
export function getKpiSchemasG3All() {
  return getKpiSchemasG3();
}

// ==================== G4: GOVERNANCE - REMUNERATION ====================
export function getKpiSchemasG4All() {
  return getKpiSchemasG4();
}

// ==================== G5: GOVERNANCE - STAKEHOLDER ENGAGEMENT ====================
export function getKpiSchemasG5All() {
  return getKpiSchemasG5();
}

/**
 * Funzione principale per ottenere tutti i KPI per categoria
 */
export function getAllKpiSchemasByCategory(category) {
  const mapping = {
    Generale: getKpiSchemasGenerale,
    E1: getKpiSchemasE1,
    E2: getKpiSchemasE2,
    E3: getKpiSchemasE3,
    E4: getKpiSchemasE4,
    E5: getKpiSchemasE5,
    S1: getKpiSchemasS1,
    S2: getKpiSchemasS2,
    S3: getKpiSchemasS3,
    S4: getKpiSchemasS4,
    G1: getKpiSchemasG1,
    G2: getKpiSchemasG2All,
    G3: getKpiSchemasG3All,
    G4: getKpiSchemasG4All,
    G5: getKpiSchemasG5All,
  };

  const getter = mapping[category];
  return getter ? getter() : {};
}

/**
 * Funzione principale per ottenere tutti i KPI (generali + settoriali + tutti ESRS)
 */
export function getAllKpiSchemas(auditData) {
  const generaleSchemas = getKpiSchemasGenerale();
  const e1Schemas = getKpiSchemasE1();
  const e2Schemas = getKpiSchemasE2();
  const e3Schemas = getKpiSchemasE3();
  const e4Schemas = getKpiSchemasE4();
  const e5Schemas = getKpiSchemasE5();
  const s1Schemas = getKpiSchemasS1();
  const s2Schemas = getKpiSchemasS2();
  const s3Schemas = getKpiSchemasS3();
  const s4Schemas = getKpiSchemasS4();
  const g1Schemas = getKpiSchemasG1();
  const g2Schemas = getKpiSchemasG2All();
  const g3Schemas = getKpiSchemasG3All();
  const g4Schemas = getKpiSchemasG4All();
  const g5Schemas = getKpiSchemasG5All();

  // Rileva settore industriale e aggiungi KPI specifici
  const detectedSector = detectIndustrySector(auditData || {});
  const sectoralSchemas = getSectoralKpiSchemas(detectedSector);

  return {
    ...generaleSchemas,
    ...e1Schemas,
    ...e2Schemas,
    ...e3Schemas,
    ...e4Schemas,
    ...e5Schemas,
    ...s1Schemas,
    ...s2Schemas,
    ...s3Schemas,
    ...s4Schemas,
    ...g1Schemas,
    ...g2Schemas,
    ...g3Schemas,
    ...g4Schemas,
    ...g5Schemas,
    ...sectoralSchemas,
    _metadata: {
      detectedSector,
      totalSchemas:
        Object.keys(generaleSchemas).length +
        Object.keys(e1Schemas).length +
        Object.keys(e2Schemas).length +
        Object.keys(e3Schemas).length +
        Object.keys(e4Schemas).length +
        Object.keys(e5Schemas).length +
        Object.keys(s1Schemas).length +
        Object.keys(s2Schemas).length +
        Object.keys(s3Schemas).length +
        Object.keys(s4Schemas).length +
        Object.keys(g1Schemas).length +
        Object.keys(g2Schemas).length +
        Object.keys(g3Schemas).length +
        Object.keys(g4Schemas).length +
        Object.keys(g5Schemas).length +
        Object.keys(sectoralSchemas).length,
      categories: {
        Generale: Object.keys(generaleSchemas).length,
        E1: Object.keys(e1Schemas).length,
        E2: Object.keys(e2Schemas).length,
        E3: Object.keys(e3Schemas).length,
        E4: Object.keys(e4Schemas).length,
        E5: Object.keys(e5Schemas).length,
        S1: Object.keys(s1Schemas).length,
        S2: Object.keys(s2Schemas).length,
        S3: Object.keys(s3Schemas).length,
        S4: Object.keys(s4Schemas).length,
        G1: Object.keys(g1Schemas).length,
        G2: Object.keys(g2Schemas).length,
        G3: Object.keys(g3Schemas).length,
        G4: Object.keys(g4Schemas).length,
        G5: Object.keys(g5Schemas).length,
        Sectoral: Object.keys(sectoralSchemas).length,
      },
    },
  };
}
