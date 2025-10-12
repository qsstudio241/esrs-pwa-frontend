/**
 * E1004 - Adattamento ai cambiamenti climatici
 * ESRS E1-4 - Cambiamenti Climatici
 */

const E1004 = {
  kpiCode: "E1004",
  categoryDescription: "E1 - Cambiamenti Climatici",
  title: "Adattamento ai cambiamenti climatici",
  fields: [
    {
      key: "valutazione_rischi_fisici",
      label: "Valutazione rischi fisici climatici effettuata",
      type: "bool",
      required: true,
    },
    {
      key: "rischi_acuti_identificati",
      label: "Rischi acuti identificati (alluvioni, ondate calore, tempeste)",
      type: "bool",
      required: true,
    },
    {
      key: "rischi_cronici_identificati",
      label: "Rischi cronici identificati (innalzamento temperature, siccità)",
      type: "bool",
      required: true,
    },
    {
      key: "piano_adattamento_esistente",
      label: "Piano di adattamento esistente",
      type: "bool",
      required: true,
    },
    {
      key: "misure_adattamento_implementate",
      label: "Misure di adattamento implementate",
      type: "bool",
      required: false,
    },
    {
      key: "investimenti_resilienza",
      label: "Investimenti in resilienza climatica",
      type: "number",
      min: 0,
      unit: "€",
      required: false,
    },
  ],
  checks: [
    {
      code: "PHYSICAL_RISK_ASSESSMENT",
      severity: "error",
      message: "Valutazione rischi fisici climatici obbligatoria per ESRS E1-4",
      test: (i) =>
        i.valutazione_rischi_fisici &&
        i.rischi_acuti_identificati &&
        i.rischi_cronici_identificati,
      actionPlan:
        "Condurre climate risk assessment: mappare siti/asset esposti, analizzare scenari climatici (IPCC), valutare vulnerabilità a eventi acuti (alluvioni, incendi) e cronici (siccità, caldo estremo). Tools: TCFD, ClimateCheck.",
    },
    {
      code: "ADAPTATION_PLAN",
      severity: "error",
      message:
        "Piano di adattamento necessario per gestire rischi identificati",
      test: (i) => i.piano_adattamento_esistente === true,
      actionPlan:
        "Sviluppare piano adattamento: prioritizzare rischi, definire misure (es. difese idrauliche, sistemi raffreddamento, diversificazione fornitori), allocare budget, timeline implementazione.",
    },
    {
      code: "ADAPTATION_MEASURES",
      severity: "warning",
      message: "Raccomandato implementare concretamente misure di adattamento",
      test: (i) => i.misure_adattamento_implementate === true,
      actionPlan:
        "Esempi misure: infrastrutture resilienti, piani continuità operativa, assicurazioni clima, modifiche processi produttivi, spostamento attività geograficamente vulnerabili.",
    },
  ],
  requiredEvidences: [
    "Report climate risk assessment",
    "Piano di adattamento climatico",
    "Documentazione misure implementate (opzionale)",
  ],
};

export default E1004;
