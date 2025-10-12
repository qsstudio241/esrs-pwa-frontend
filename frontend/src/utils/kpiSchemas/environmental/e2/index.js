/**
 * Index aggregator per schemi KPI categoria E2 - Inquinamento
 */

import E2001 from "./E2001";
import E2002 from "./E2002";
import E2003 from "./E2003";
import E2004 from "./E2004";
import E2005 from "./E2005";
import E2006 from "./E2006";

export function getKpiSchemasE2() {
  return {
    E2001,
    E2002,
    E2003,
    E2004,
    E2005,
    E2006,
  };
}

export { E2001, E2002, E2003, E2004, E2005, E2006 };
