// Aggregatore schemi S4 - Consumatori e utenti finali
import S4001 from "./S4001.js";
import S4002 from "./S4002.js";
import S4003 from "./S4003.js";
import S4004 from "./S4004.js";
import S4005 from "./S4005.js";
import S4006 from "./S4006.js";

export function getKpiSchemasS4() {
  return {
    S4001,
    S4002,
    S4003,
    S4004,
    S4005,
    S4006,
  };
}

export { S4001, S4002, S4003, S4004, S4005, S4006 };
