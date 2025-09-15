import {
  deriveStatus,
  validateKpiState,
  KPI_STATES,
} from "../utils/kpiValidation";

describe("kpiValidation", () => {
  test("mandatory senza valore => NOK", () => {
    expect(deriveStatus({ mandatory: true, value: "" })).toBe(KPI_STATES.NOK);
  });
  test("mandatory con valore => OK", () => {
    expect(deriveStatus({ mandatory: true, value: "x" })).toBe(KPI_STATES.OK);
  });
  test("optional senza valore => OPT_EMPTY", () => {
    expect(deriveStatus({ mandatory: false, value: "" })).toBe(
      KPI_STATES.OPT_EMPTY
    );
  });
  test("optional con valore => OPT_OK", () => {
    expect(deriveStatus({ mandatory: false, value: "y" })).toBe(
      KPI_STATES.OPT_OK
    );
  });
  test("value = NA => NA", () => {
    expect(deriveStatus({ mandatory: true, value: "NA" })).toBe(KPI_STATES.NA);
  });
  test("validateKpiState delega a deriveStatus", () => {
    const res = validateKpiState({ mandatory: true }, { value: "abc" });
    expect(res.status).toBe(KPI_STATES.OK);
    expect(res.errors).toEqual([]);
  });
});
