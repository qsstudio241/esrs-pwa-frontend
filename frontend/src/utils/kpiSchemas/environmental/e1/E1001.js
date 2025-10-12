/**
 * E1001 - Piano di transizione verso la neutralità climatica
 * ESRS E1-1 - Cambiamenti Climatici
 */

const E1001 = {
  kpiCode: "E1001",
  categoryDescription: "E1 - Cambiamenti Climatici",
  title: "Piano di transizione verso la neutralità climatica",
  fields: [
    {
      key: "piano_esistente",
      label: "Piano transizione esistente",
      type: "bool",
      required: true,
    },
    {
      key: "target_net_zero",
      label: "Target Net Zero definito",
      type: "bool",
      required: true,
    },
    {
      key: "anno_target",
      label: "Anno target neutralità",
      type: "number",
      min: 2025,
      max: 2050,
      required: false,
    },
  ],
  checks: [
    {
      code: "TRANSITION_PLAN_REQUIRED",
      severity: "error",
      message: "Piano di transizione verso Net Zero obbligatorio per ESRS",
      test: (i) => !!i.piano_esistente && !!i.target_net_zero,
      actionPlan:
        "Sviluppare piano di transizione climatica con: baseline emissioni, target riduzione per scope, roadmap azioni, investimenti necessari. Allineamento SBTi raccomandato.",
    },
    {
      code: "TARGET_YEAR_2050",
      severity: "warning",
      message: "EU Green Deal richiede neutralità climatica entro 2050",
      test: (i) => !i.anno_target || i.anno_target <= 2050,
      actionPlan:
        "Allineare target a 2050 o prima. Definire obiettivi intermedi: -30% entro 2030, -55% entro 2040.",
    },
  ],
  requiredEvidences: [
    "Piano Transizione Climatica",
    "Target SBTi (se applicabile)",
  ],
};

export default E1001;
