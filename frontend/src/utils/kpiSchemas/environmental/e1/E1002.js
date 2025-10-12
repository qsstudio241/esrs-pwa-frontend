/**
 * E1002 - Politiche e azioni di mitigazione dei cambiamenti climatici
 * ESRS E1-2 - Cambiamenti Climatici
 */

const E1002 = {
  kpiCode: "E1002",
  categoryDescription: "E1 - Cambiamenti Climatici",
  title: "Politiche e azioni di mitigazione dei cambiamenti climatici",
  fields: [
    {
      key: "politiche_mitigazione_adottate",
      label: "Politiche di mitigazione adottate",
      type: "bool",
      required: true,
    },
    {
      key: "azioni_riduzione_scope1",
      label: "Azioni riduzione Scope 1 implementate",
      type: "bool",
      required: true,
    },
    {
      key: "azioni_riduzione_scope2",
      label: "Azioni riduzione Scope 2 implementate",
      type: "bool",
      required: true,
    },
    {
      key: "azioni_riduzione_scope3",
      label: "Azioni riduzione Scope 3 implementate",
      type: "bool",
      required: false,
    },
    {
      key: "investimenti_riduzione_co2",
      label: "Investimenti riduzione CO2",
      type: "number",
      min: 0,
      unit: "€",
      required: false,
    },
    {
      key: "uso_carbon_pricing",
      label: "Uso carbon pricing interno",
      type: "bool",
      required: false,
    },
  ],
  checks: [
    {
      code: "MITIGATION_POLICIES",
      severity: "error",
      message: "Politiche di mitigazione obbligatorie per ESRS E1-2",
      test: (i) =>
        i.politiche_mitigazione_adottate &&
        i.azioni_riduzione_scope1 &&
        i.azioni_riduzione_scope2,
      actionPlan:
        "Adottare politiche formali di mitigazione. Implementare azioni concrete per ridurre Scope 1 (efficienza energetica, combustibili alternativi) e Scope 2 (energia rinnovabile, PPA).",
    },
    {
      code: "SCOPE3_MITIGATION",
      severity: "warning",
      message: "Raccomandato agire anche su Scope 3 (maggiore impatto)",
      test: (i) => i.azioni_riduzione_scope3 === true,
      actionPlan:
        "Implementare azioni Scope 3: coinvolgere fornitori (sourcing sostenibile), ottimizzare logistica, progettare prodotti low-carbon, educare clienti all'uso efficiente.",
    },
    {
      code: "CARBON_PRICING",
      severity: "info",
      message:
        "Carbon pricing interno aiuta decisioni investimento sostenibili",
      test: (i) => i.uso_carbon_pricing === true,
      actionPlan:
        "Implementare carbon pricing interno (es. €50/tCO2e) per valutare progetti. Aiuta identificare opportunità riduzione emissioni economicamente vantaggiose.",
    },
  ],
  requiredEvidences: [
    "Documento politiche mitigazione climatica",
    "Piano azioni riduzione emissioni per scope",
    "Report investimenti clima (opzionale)",
  ],
};

export default E1002;
