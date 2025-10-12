/**
 * Index aggregator per schemi KPI categoria S1 - Forza Lavoro Propria
 */

import S1001 from "./S1001";
import S1002 from "./S1002";
import S1003 from "./S1003";
import S1004 from "./S1004";
import S1005 from "./S1005";
import S1006 from "./S1006";

export function getKpiSchemasS1() {
  return {
    S1001,
    S1002,
    S1003,
    S1004,
    S1005,
    S1006,
  };
}

export { S1001, S1002, S1003, S1004, S1005, S1006 };
