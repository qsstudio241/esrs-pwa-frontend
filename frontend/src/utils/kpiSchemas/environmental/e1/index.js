/**
 * Index aggregator per schemi KPI categoria E1 - Cambiamenti Climatici
 */

import E1001 from "./E1001";
import E1002 from "./E1002";
import E1003 from "./E1003";
import E1004 from "./E1004";
import E1005 from "./E1005";
import E1006 from "./E1006";

export function getKpiSchemasE1() {
  return {
    E1001,
    E1002,
    E1003,
    E1004,
    E1005,
    E1006,
  };
}

export { E1001, E1002, E1003, E1004, E1005, E1006 };
