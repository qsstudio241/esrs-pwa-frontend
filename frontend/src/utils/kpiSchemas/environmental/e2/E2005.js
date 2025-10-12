/**
 * E2005 - Obiettivi per la riduzione dell'inquinamento
 * ESRS E2-5 - Inquinamento
 */

const E2005 = {
  kpiCode: "E2005",
  categoryDescription: "E2 - Inquinamento",
  title: "Obiettivi per la riduzione dell'inquinamento",
  fields: [
    {
      key: "obiettivi_riduzione_definiti",
      label: "Obiettivi quantitativi riduzione inquinamento definiti",
      type: "bool",
      required: true,
    },
    {
      key: "target_emissioni_aria",
      label: "Target riduzione emissioni atmosferiche",
      type: "bool",
      required: false,
    },
    {
      key: "target_scarichi_acqua",
      label: "Target riduzione inquinanti idrici",
      type: "bool",
      required: false,
    },
    {
      key: "target_contaminanti_suolo",
      label: "Target prevenzione contaminazione suolo",
      type: "bool",
      required: false,
    },
    {
      key: "target_sostanze_pericolose",
      label: "Target riduzione uso sostanze pericolose",
      type: "bool",
      required: false,
    },
    {
      key: "anno_target",
      label: "Anno target raggiungimento obiettivi",
      type: "number",
      min: 2025,
      max: 2040,
      required: false,
    },
  ],
  checks: [
    {
      code: "POLLUTION_TARGETS",
      severity: "error",
      message: "Obiettivi riduzione inquinamento obbligatori per ESRS E2-5",
      test: (i) => i.obiettivi_riduzione_definiti === true,
      actionPlan:
        "Definire target quantitativi per tutti gli impatti inquinanti materiali: emissioni atmosferiche (NOx, SOx, PM), scarichi idrici (COD, nutrienti), sostanze pericolose. Specificare % riduzione e anno target.",
    },
    {
      code: "COMPREHENSIVE_TARGETS",
      severity: "warning",
      message:
        "Raccomandato target per tutti i vettori ambientali (aria, acqua, suolo)",
      test: (i) => {
        const count = [
          i.target_emissioni_aria,
          i.target_scarichi_acqua,
          i.target_contaminanti_suolo,
          i.target_sostanze_pericolose,
        ].filter(Boolean).length;
        return count >= 2;
      },
      actionPlan:
        "Coprire tutti i vettori rilevanti per l'attività: 1) Emissioni aria (NOx -30% entro 2030), 2) Scarichi acqua (COD -25% entro 2028), 3) Sostanze pericolose (-50% SVHC entro 2030).",
    },
    {
      code: "TARGET_TIMELINE",
      severity: "info",
      message: "Definire timeline chiare per raggiungimento obiettivi",
      test: (i) => i.anno_target !== undefined && i.anno_target <= 2035,
      actionPlan:
        "Stabilire anno target realistico ma ambizioso (raccomandato entro 2030-2035). Definire milestone intermedi. Allocare risorse e responsabilità.",
    },
  ],
  requiredEvidences: [
    "Documento obiettivi riduzione inquinamento",
    "Piano d'azione per raggiungimento target",
    "Report progressi annuali (opzionale)",
  ],
};

export default E2005;
