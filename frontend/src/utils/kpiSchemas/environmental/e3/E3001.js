// E3001 - Politiche relative alle risorse idriche e marine
const E3001 = {
  kpiCode: "E3001",
  categoryDescription: "E3 - Risorse idriche e marine",
  title: "Politiche relative alle risorse idriche e marine",
  fields: [
    {
      key: "politiche_idriche_adottate",
      label: "Politiche per la gestione delle risorse idriche adottate",
      type: "bool",
      required: true,
    },
    {
      key: "water_stewardship",
      label: "Approccio water stewardship implementato",
      type: "bool",
      required: false,
    },
    {
      key: "gestione_stress_idrico",
      label: "Politiche per la gestione dello stress idrico",
      type: "bool",
      required: false,
    },
    {
      key: "scarichi_idrici_trattati",
      label: "Politiche per il trattamento degli scarichi idrici",
      type: "bool",
      required: true,
    },
    {
      key: "tutela_ecosistemi_marini",
      label: "Politiche per la tutela degli ecosistemi marini",
      type: "bool",
      required: false,
    },
    {
      key: "valutazione_impatti_idrici",
      label: "Valutazione degli impatti sulle risorse idriche effettuata",
      type: "bool",
      required: true,
    },
    {
      key: "coinvolgimento_stakeholder_acqua",
      label: "Coinvolgimento degli stakeholder nella gestione idrica",
      type: "enum",
      required: false,
      enum: ["Non effettuato", "Occasionale", "Regolare", "Sistematico"],
    },
  ],
  checks: [
    {
      code: "WATER_POLICIES_MANDATORY",
      severity: "error",
      message: "Politiche per la gestione delle risorse idriche obbligatorie per ESRS E3",
      test: (inputs) => !!inputs.politiche_idriche_adottate,
      actionPlan:
        "Adottare politiche formali per la gestione sostenibile delle risorse idriche. Documentare procedure di prelievo, utilizzo, trattamento e scarico. Riferimento: ESRS E3-1.",
    },
    {
      code: "WATER_IMPACT_ASSESSMENT",
      severity: "error",
      message: "Valutazione degli impatti sulle risorse idriche obbligatoria",
      test: (inputs) => !!inputs.valutazione_impatti_idrici,
      actionPlan:
        "Effettuare valutazione degli impatti: identificare prelievi in aree a stress idrico, analizzare qualità scarichi, valutare impatti su ecosistemi acquatici.",
    },
    {
      code: "WASTEWATER_TREATMENT",
      severity: "error",
      message: "Politiche per il trattamento degli scarichi idrici obbligatorie (D.Lgs 152/2006)",
      test: (inputs) => !!inputs.scarichi_idrici_trattati,
      actionPlan:
        "Implementare sistemi di trattamento degli scarichi conformi a D.Lgs 152/2006. Monitorare qualità acque reflue. Ottenere autorizzazioni allo scarico.",
    },
    {
      code: "WATER_STEWARDSHIP_RECOMMENDED",
      severity: "warning",
      message: "Approccio water stewardship raccomandato per gestione sostenibile",
      test: (inputs) => !!inputs.water_stewardship,
      actionPlan:
        "Adottare framework water stewardship (es. Alliance for Water Stewardship). Implementare monitoraggio continuo, riduzione consumi, gestione bacini idrici condivisi.",
    },
    {
      code: "WATER_STRESS_MANAGEMENT",
      severity: "warning",
      message: "Gestione dello stress idrico critica per aree con scarsità d'acqua",
      test: (inputs) => !!inputs.gestione_stress_idrico,
      actionPlan:
        "Mappare siti in aree a stress idrico (WRI Aqueduct). Implementare piani di riduzione consumi. Priorità: siti in aree HIGH o EXTREMELY HIGH water stress.",
    },
    {
      code: "STAKEHOLDER_ENGAGEMENT_WATER",
      severity: "info",
      message: "Coinvolgimento stakeholder nella gestione idrica raccomandato",
      test: (inputs) =>
        inputs.coinvolgimento_stakeholder_acqua === "Regolare" ||
        inputs.coinvolgimento_stakeholder_acqua === "Sistematico",
      actionPlan:
        "Instaurare dialogo con autorità di bacino, comunità locali, ONG ambientali. Partecipare a tavoli di gestione integrata risorse idriche.",
    },
  ],
  requiredEvidences: [
    "Politica aziendale gestione risorse idriche",
    "Valutazione impatti idrici (water footprint)",
    "Autorizzazioni prelievo e scarico",
    "Report monitoraggio qualità acque reflue",
    "Certificazioni water stewardship (se applicabile)",
  ],
};

export default E3001;
