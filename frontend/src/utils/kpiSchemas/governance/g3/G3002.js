// G3002 - Gestione rischi climatici
const G3002 = {
  kpiCode: "G3002",
  categoryDescription: "G3 - Risk management",
  title: "Gestione rischi climatici",
  fields: [
    {
      key: "valutazione_rischi_climatici",
      label: "Valutazione rischi climatici (transizione e fisici) effettuata",
      type: "bool",
      required: true,
    },
    {
      key: "scenario_analysis_clima",
      label: "Scenario analysis climatica condotta (TCFD)",
      type: "bool",
      required: false,
    },
    {
      key: "rischi_transizione_identificati",
      label: "Rischi di transizione climatica identificati",
      type: "bool",
      required: false,
    },
    {
      key: "rischi_fisici_identificati",
      label: "Rischi fisici climatici identificati",
      type: "bool",
      required: false,
    },
    {
      key: "piani_adattamento_clima",
      label: "Piani di adattamento ai cambiamenti climatici implementati",
      type: "bool",
      required: false,
    },
    {
      key: "integrazione_rischi_clima_strategia",
      label: "Rischi climatici integrati in strategia aziendale",
      type: "bool",
      required: false,
    },
  ],
  checks: [
    {
      code: "CLIMATE_RISK_ASSESSMENT_MANDATORY",
      severity: "error",
      message: "Valutazione rischi climatici obbligatoria (ESRS E1, TCFD)",
      test: (inputs) => !!inputs.valutazione_rischi_climatici,
      actionPlan:
        "Effettuare climate risk assessment: 1) Transition risks (policy, technology, market, reputation), 2) Physical risks (acute: eventi estremi; chronic: cambiamenti graduali T, precipitazioni, sea level). Time horizons: 2030, 2050. Quantificazione impatti finanziari. ESRS E1-1 richiede disclosure.",
    },
    {
      code: "TRANSITION_RISKS_IDENTIFICATION",
      severity: "error",
      message: "Identificazione rischi di transizione obbligatoria",
      test: (inputs) => !!inputs.rischi_transizione_identificati,
      actionPlan:
        "Identificare transition risks: 1) Policy/legal (carbon pricing, regulations), 2) Technology (clean tech disruption, stranded assets), 3) Market (shifting demand, commodity prices), 4) Reputation (stakeholder concerns, litigation). Settori esposti: fossil fuels, heavy industry, transport, agriculture. Mitigation: decarbonizzazione, innovation.",
    },
    {
      code: "PHYSICAL_RISKS_IDENTIFICATION",
      severity: "error",
      message: "Identificazione rischi fisici climatici obbligatoria",
      test: (inputs) => !!inputs.rischi_fisici_identificati,
      actionPlan:
        "Identificare physical risks: 1) Acute (flooding, storms, wildfires, heatwaves), 2) Chronic (temperature rise, drought, sea level rise, water stress). Asset-level assessment (siti produttivi, supply chain). Exposure maps. Climate projections (IPCC scenarios). Insurance implications. Business continuity planning.",
    },
    {
      code: "CLIMATE_SCENARIO_ANALYSIS",
      severity: "warning",
      message: "Scenario analysis climatica raccomandata (TCFD)",
      test: (inputs) => !!inputs.scenario_analysis_clima,
      actionPlan:
        "Condurre climate scenario analysis: scenari IPCC/IEA (es. 1.5°C, 2°C, 3°C warming). Valutare resilienza strategia aziendale. Identificare tipping points. Quantificazione impatti finanziari (revenues, costs, asset values). TCFD recommended disclosure. Supporto consulenza specializzata. Scenario workshops management.",
    },
    {
      code: "CLIMATE_ADAPTATION_PLANS",
      severity: "warning",
      message: "Piani di adattamento climatico raccomandati",
      test: (inputs) => !!inputs.piani_adattamento_clima,
      actionPlan:
        "Implementare adaptation plans: 1) Infrastructure hardening (flood defenses, cooling systems), 2) Supply chain diversification (alternative sourcing), 3) Product/service adaptation (climate-resilient offerings), 4) Geographic diversification, 5) Insurance coverage review. Investment in adaptation = risk mitigation.",
    },
    {
      code: "CLIMATE_STRATEGY_INTEGRATION",
      severity: "info",
      message: "Integrazione rischi climatici in strategia raccomandata",
      test: (inputs) => !!inputs.integrazione_rischi_clima_strategia,
      actionPlan:
        "Integrare climate risks in strategia: 1) Capital allocation (low-carbon investments), 2) R&D (green innovation), 3) M&A (divest high-carbon, acquire clean tech), 4) Market positioning (sustainability leadership), 5) Stakeholder engagement. Climate risk = strategic opportunity. Net zero transition planning.",
    },
  ],
  requiredEvidences: [
    "Climate risk assessment report",
    "Scenario analysis results (TCFD)",
    "Mappatura rischi transizione e fisici",
    "Piani adattamento climatico",
    "Disclosure rischi climatici (ESRS E1, TCFD)",
  ],
};

export default G3002;
