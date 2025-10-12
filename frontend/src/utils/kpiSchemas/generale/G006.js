// G006 - Orizzonti temporali
const G006 = {
  kpiCode: "G006",
  categoryDescription: "Generale - Requisiti trasversali ESRS",
  title: "Orizzonti temporali",
  fields: [
    {
      key: "orizzonte_breve_anni",
      label: "Orizzonte breve (anni)",
      type: "number",
      min: 1,
      max: 3,
      required: true,
    },
    {
      key: "orizzonte_medio_anni",
      label: "Orizzonte medio (anni)",
      type: "number",
      min: 3,
      max: 10,
      required: true,
    },
    {
      key: "orizzonte_lungo_anni",
      label: "Orizzonte lungo (anni)",
      type: "number",
      min: 10,
      required: true,
    },
  ],
  checks: [
    {
      code: "RANGE_VALID",
      severity: "error",
      message: "Gli orizzonti devono essere crescenti: breve < medio < lungo",
      test: (inputs) =>
        inputs.orizzonte_breve_anni < inputs.orizzonte_medio_anni &&
        inputs.orizzonte_medio_anni < inputs.orizzonte_lungo_anni,
      actionPlan:
        "Correggere gli orizzonti temporali rispettando ordine crescente. Esempio standard: Breve=1-3 anni, Medio=3-10 anni, Lungo=10-30 anni. Allineare con strategia aziendale e pianificazione finanziaria.",
    },
    {
      code: "RECOMMENDED_RANGES",
      severity: "warning",
      message:
        "Raccomandazione ESRS: Breve 1-3 anni, Medio 3-10 anni, Lungo ≥10 anni",
      test: (inputs) =>
        inputs.orizzonte_breve_anni <= 3 &&
        inputs.orizzonte_medio_anni >= 3 &&
        inputs.orizzonte_medio_anni <= 10 &&
        inputs.orizzonte_lungo_anni >= 10,
      actionPlan:
        "Adottare orizzonti temporali raccomandati ESRS: Breve 1-3 anni (piano operativo), Medio 3-10 anni (piano strategico), Lungo ≥10 anni (visione long-term, Net Zero 2050). Assicurare coerenza con altri disclosure (TCFD, Science Based Targets).",
    },
    {
      code: "LONG_TERM_ALIGNMENT",
      severity: "info",
      message:
        "Orizzonte lungo dovrebbe allinearsi con target climatici 2030-2050",
      test: (inputs) => inputs.orizzonte_lungo_anni >= 20,
      actionPlan:
        "Per impatti climatici e obiettivi Net Zero, estendere orizzonte lungo a 20-30 anni (allineamento Paris Agreement, target 2050). Considerare scenari climatici RCP 2.6, 4.5, 8.5. Integrare analisi rischi fisici e di transizione lungo termine.",
    },
  ],
  requiredEvidences: [
    "Documento strategia aziendale con timeline",
    "Piano industriale con orizzonti temporali definiti",
    "Roadmap sostenibilità con milestone temporali",
    "Analisi scenari climatici (se applicabile)",
    "Allineamento orizzonti con reporting finanziario",
  ],
};

export default G006;
