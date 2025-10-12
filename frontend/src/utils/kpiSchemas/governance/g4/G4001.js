// G4001 - Politiche remunerazione e link ESG
const G4001 = {
  kpiCode: "G4001",
  categoryDescription: "G4 - Remuneration",
  title: "Politiche remunerazione e link ESG",
  fields: [
    {
      key: "politica_remunerazione_pubblica",
      label: "Politica remunerazione pubblicata (trasparenza)",
      type: "bool",
      required: true,
    },
    {
      key: "obiettivi_esg_in_incentivi",
      label: "Obiettivi ESG inclusi in sistemi di incentivazione management",
      type: "bool",
      required: true,
    },
    {
      key: "peso_esg_su_remunerazione_variabile_pct",
      label: "Peso KPI ESG su remunerazione variabile (%)",
      type: "number",
      unit: "%",
      required: false,
      min: 0,
      max: 100,
    },
    {
      key: "malus_clawback_previsti",
      label: "Clausole malus/clawback per performance ESG negativa",
      type: "bool",
      required: false,
    },
    {
      key: "long_term_incentives_esg",
      label: "Long-term incentive plan (LTI) includono obiettivi ESG",
      type: "bool",
      required: false,
    },
    {
      key: "remunerazione_approvata_assemblea",
      label: "Politica remunerazione approvata da assemblea soci",
      type: "bool",
      required: false,
    },
  ],
  checks: [
    {
      code: "REMUNERATION_POLICY_TRANSPARENCY",
      severity: "error",
      message: "Trasparenza politica remunerazione obbligatoria (ESRS S1)",
      test: (inputs) => !!inputs.politica_remunerazione_pubblica,
      actionPlan:
        "Pubblicare politica remunerazione: Relazione Remunerazione (art. 123-ter TUF per quotate). Contenuti: governance, fixed vs variable, short-term vs long-term, KPIs, peer benchmarking, pay mix. ESG links disclosure. Pubblicazione sito web. Shareholder say-on-pay. Transparency Trust con stakeholder.",
    },
    {
      code: "ESG_INCENTIVES_MANDATORY",
      severity: "error",
      message: "Link ESG-remunerazione obbligatorio per management",
      test: (inputs) => !!inputs.obiettivi_esg_in_incentivi,
      actionPlan:
        "Includere KPI ESG in incentivi: STI (short-term: bonus annuale) e LTI (long-term: equity). KPIs: climate (emissioni, renewable %), social (safety, diversity), governance (compliance, ethics). Weighted scorecard. Target challenging ma achievable. Disclosure KPIs chosen and rationale. Aligns management behavior con sustainability strategy.",
    },
    {
      code: "ESG_WEIGHT_THRESHOLD",
      severity: "warning",
      message: "Peso ESG su remunerazione variabile significativo raccomandato",
      test: (inputs) => inputs.peso_esg_su_remunerazione_variabile_pct >= 20,
      actionPlan:
        "Aumentare peso ESG su remunerazione: best practice 20-30% di STI+LTI. Progressivo increase: start 10-15%, target 25-30% entro 3 anni. Balance financial, operational, ESG. Prevent gaming: use multiple KPIs, external verification. Market trend: ESG weight increasing (investor pressure, regulation ESRS).",
    },
    {
      code: "MALUS_CLAWBACK_ESG",
      severity: "warning",
      message: "Clausole malus/clawback per ESG raccomandate",
      test: (inputs) => !!inputs.malus_clawback_previsti,
      actionPlan:
        "Introdurre malus/clawback ESG: malus = mancata maturazione incentivo se ESG failure; clawback = restituzione incentivo già pagato se misconduct emerges. Trigger: major ESG incidents (H&S fatality, environmental disaster, corruption scandal). Retroactive 2-3 years. Strong accountability signal. Shareholder expectation.",
    },
    {
      code: "LONG_TERM_ESG_INCENTIVES",
      severity: "info",
      message: "Obiettivi ESG in LTI raccomandati (long-term alignment)",
      test: (inputs) => !!inputs.long_term_incentives_esg,
      actionPlan:
        "ESG in LTI plans: performance shares/options con vesting 3-5 anni, condizionato a ESG targets (es. Net Zero milestones, diversity, safety record). Long-term orientation prevents short-termism. Total Shareholder Return (TSR) + ESG scorecard. Alignment con UN SDGs. Attract ESG-minded talent.",
    },
    {
      code: "SHAREHOLDER_APPROVAL",
      severity: "info",
      message: "Approvazione assemblea su remunerazione raccomandata",
      test: (inputs) => !!inputs.remunerazione_approvata_assemblea,
      actionPlan:
        "Say-on-pay shareholder: voto assembleare su politica remunerazione (obbligatorio quotate). Engagement preventivo con investitori. Transparent rationale su ESG links. Vote vincolante (binding) o consultivo (advisory). High approval (>90%) signals good governance. Failed vote = rework policy, investor dialogue.",
    },
  ],
  requiredEvidences: [
    "Relazione Remunerazione (TUF 123-ter)",
    "Balanced scorecard con KPI ESG",
    "Long-term incentive plan documents",
    "Delibere assemblea su remunerazione",
    "Disclosure pay-mix e ESG weight",
  ],
};

export default G4001;
