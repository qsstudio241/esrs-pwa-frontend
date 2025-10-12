/**
 * E1005 - Obiettivi di riduzione delle emissioni GHG
 * ESRS E1-5 - Cambiamenti Climatici
 */

const E1005 = {
  kpiCode: "E1005",
  categoryDescription: "E1 - Cambiamenti Climatici",
  title: "Obiettivi di riduzione delle emissioni GHG",
  fields: [
    {
      key: "obiettivi_riduzione_definiti",
      label: "Obiettivi quantitativi riduzione emissioni definiti",
      type: "bool",
      required: true,
    },
    {
      key: "obiettivo_scope1",
      label: "Obiettivo riduzione Scope 1",
      type: "bool",
      required: true,
    },
    {
      key: "obiettivo_scope2",
      label: "Obiettivo riduzione Scope 2",
      type: "bool",
      required: true,
    },
    {
      key: "obiettivo_scope3",
      label: "Obiettivo riduzione Scope 3",
      type: "bool",
      required: false,
    },
    {
      key: "percentuale_riduzione_target",
      label: "% riduzione target (vs baseline)",
      type: "number",
      min: 0,
      max: 100,
      unit: "%",
      required: false,
    },
    {
      key: "anno_target",
      label: "Anno target riduzione",
      type: "number",
      min: 2025,
      max: 2050,
      required: false,
    },
    {
      key: "allineamento_sbti",
      label: "Obiettivi validati Science Based Targets initiative (SBTi)",
      type: "bool",
      required: false,
    },
  ],
  checks: [
    {
      code: "EMISSION_TARGETS_REQUIRED",
      severity: "error",
      message: "Obiettivi riduzione emissioni obbligatori per ESRS E1-5",
      test: (i) =>
        i.obiettivi_riduzione_definiti &&
        i.obiettivo_scope1 &&
        i.obiettivo_scope2,
      actionPlan:
        "Definire target quantitativi per Scope 1 e 2: specificare % riduzione, anno baseline, anno target. Esempio: -42% entro 2030 vs baseline 2019 (allineato Paris Agreement 1.5°C).",
    },
    {
      code: "SCOPE3_TARGET",
      severity: "warning",
      message: "Fortemente raccomandato target anche per Scope 3",
      test: (i) => i.obiettivo_scope3 === true,
      actionPlan:
        "Definire target Scope 3 almeno per categorie rilevanti. Esempio: -25% emissioni acquisti entro 2030. Coinvolgere fornitori strategici.",
    },
    {
      code: "SBTI_VALIDATION",
      severity: "info",
      message: "Validazione SBTi garantisce allineamento scienza climatica",
      test: (i) => i.allineamento_sbti === true,
      actionPlan:
        "Sottoporre target a Science Based Targets initiative per validazione. Richiede ambizione 1.5°C: -42% Scope 1+2 entro 2030, Net Zero entro 2050. Aumenta credibilità stakeholder.",
    },
    {
      code: "TARGET_AMBITION",
      severity: "warning",
      message:
        "Target deve essere sufficientemente ambizioso (min -40% entro 2030)",
      test: (i) =>
        !i.percentuale_riduzione_target ||
        !i.anno_target ||
        (i.anno_target <= 2030 && i.percentuale_riduzione_target >= 40),
      actionPlan:
        "EU raccomanda -55% emissioni entro 2030 (vs 1990). Per allineamento Paris Agreement 1.5°C: min -42% entro 2030. Verificare ambizione target.",
    },
  ],
  requiredEvidences: [
    "Documento obiettivi riduzione emissioni",
    "Certificato SBTi (se validato)",
    "Piano d'azione per raggiungimento target",
  ],
};

export default E1005;
