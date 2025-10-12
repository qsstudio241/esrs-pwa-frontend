/**
 * E1006 - Inventario delle emissioni GHG (Scope 1, 2, 3)
 * ESRS E1-6 - Cambiamenti Climatici
 */

const E1006 = {
  kpiCode: "E1006",
  categoryDescription: "E1 - Cambiamenti Climatici",
  title: "Inventario delle emissioni GHG (Scope 1, 2, 3)",
  fields: [
    {
      key: "scope1_calcolato",
      label: "Scope 1 calcolato",
      type: "bool",
      required: true,
    },
    {
      key: "scope2_calcolato",
      label: "Scope 2 calcolato",
      type: "bool",
      required: true,
    },
    {
      key: "scope3_calcolato",
      label: "Scope 3 calcolato",
      type: "bool",
      required: false,
    },
    {
      key: "scope1_tonnellate",
      label: "Scope 1",
      type: "number",
      min: 0,
      unit: "tCO2e",
    },
    {
      key: "scope2_tonnellate",
      label: "Scope 2",
      type: "number",
      min: 0,
      unit: "tCO2e",
    },
    {
      key: "scope3_tonnellate",
      label: "Scope 3",
      type: "number",
      min: 0,
      unit: "tCO2e",
    },
  ],
  checks: [
    {
      code: "SCOPE_1_2_MANDATORY",
      severity: "error",
      message: "Calcolo Scope 1 e 2 obbligatorio",
      test: (i) => !!i.scope1_calcolato && !!i.scope2_calcolato,
      actionPlan:
        "Calcolare emissioni Scope 1 (combustione diretta) e Scope 2 (energia acquistata) usando GHG Protocol. Tools: Carbon Trust, CDP.",
    },
    {
      code: "SCOPE_3_RECOMMENDED",
      severity: "warning",
      message:
        "Scope 3 fortemente raccomandato (spesso 70-90% delle emissioni totali)",
      test: (i) => !!i.scope3_calcolato,
      actionPlan:
        "Calcolare almeno categorie Scope 3 più rilevanti: acquisti, trasporti, uso prodotti. Standard GHG Protocol Scope 3.",
    },
    {
      code: "DATA_QUALITY",
      severity: "info",
      message:
        "Verificare qualità dati: usare fattori emissione aggiornati e dati primari quando possibile",
      test: () => true,
    },
  ],
  requiredEvidences: [
    "Inventario GHG certificato",
    "Report Carbon Footprint",
    "Fatture energia e carburanti",
  ],
};

export default E1006;
