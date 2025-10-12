// G3001 - Sistema di gestione rischi
const G3001 = {
  kpiCode: "G3001",
  categoryDescription: "G3 - Risk management",
  title: "Sistema di gestione rischi",
  fields: [
    {
      key: "framework_erm_implementato",
      label: "Framework Enterprise Risk Management (ERM) implementato",
      type: "bool",
      required: true,
    },
    {
      key: "risk_assessment_periodico",
      label: "Risk assessment periodico effettuato",
      type: "bool",
      required: true,
    },
    {
      key: "rischi_esg_integrati",
      label: "Rischi ESG integrati nel risk management aziendale",
      type: "bool",
      required: true,
    },
    {
      key: "comitato_rischi_costituito",
      label: "Comitato rischi (o funzione risk management) costituito",
      type: "bool",
      required: false,
    },
    {
      key: "reporting_rischi_cda",
      label: "Reporting rischi periodico a CdA",
      type: "enum",
      required: false,
      enum: ["Mai", "Annuale", "Semestrale", "Trimestrale"],
    },
    {
      key: "principali_rischi_identificati",
      label: "Principali rischi aziendali identificati e documentati",
      type: "bool",
      required: false,
    },
  ],
  checks: [
    {
      code: "ERM_FRAMEWORK_MANDATORY",
      severity: "error",
      message: "Framework ERM obbligatorio per governance solida",
      test: (inputs) => !!inputs.framework_erm_implementato,
      actionPlan:
        "Implementare ERM framework: ISO 31000, COSO ERM, o equivalente. Processi: risk identification, assessment (likelihood/impact), response (avoid/mitigate/transfer/accept), monitoring. Risk appetite definition. Integrazione strategia e operations. Chief Risk Officer ownership. Board oversight.",
    },
    {
      code: "PERIODIC_RISK_ASSESSMENT",
      severity: "error",
      message: "Risk assessment periodico obbligatorio",
      test: (inputs) => !!inputs.risk_assessment_periodico,
      actionPlan:
        "Effettuare risk assessment almeno annuale: identificare rischi strategici, operativi, finanziari, compliance, ESG. Workshops management, questionari, data analysis. Heat map (likelihood/impact). Prioritizzazione rischi material. Aggiornamento ad eventi significativi (M&A, nuovi mercati). Documentation risk register.",
    },
    {
      code: "ESG_RISKS_INTEGRATION_MANDATORY",
      severity: "error",
      message: "Integrazione rischi ESG obbligatoria (ESRS, TCFD)",
      test: (inputs) => !!inputs.rischi_esg_integrati,
      actionPlan:
        "Integrare rischi ESG in ERM: climate risks (transition, physical), social risks (H&S, supply chain labor), governance risks (cyber, compliance). Materiality assessment. Time horizons (short/medium/long). Scenario analysis per climate. ESRS 2 richiede disclosure rischi ESG. TCFD framework raccomandato.",
    },
    {
      code: "RISK_GOVERNANCE",
      severity: "warning",
      message: "Governance rischi dedicata raccomandata",
      test: (inputs) => !!inputs.comitato_rischi_costituito,
      actionPlan:
        "Costituire Comitato Rischi: Board-level committee o funzione CRO. Mandato: oversight ERM, review risk appetite, challenge management su rischi material, approve mitigation plans. Riunioni trimestrali. Integrazione con Audit Committee. Expertise rischi specifici (cyber, ESG, financial).",
    },
    {
      code: "RISK_REPORTING_BOARD",
      severity: "warning",
      message: "Reporting rischi regolare a CdA raccomandato",
      test: (inputs) =>
        inputs.reporting_rischi_cda === "Trimestrale" ||
        inputs.reporting_rischi_cda === "Semestrale",
      actionPlan:
        "Reporting rischi periodico a CdA: top risks, changes vs previous, emerging risks, mitigation status, risk appetite compliance. Frequenza: almeno semestrale. Dashboard risk heatmap. Board time dedicato. Risk culture: no shooting messenger. Candid discussion critical risks.",
    },
    {
      code: "PRINCIPAL_RISKS_DOCUMENTATION",
      severity: "info",
      message: "Documentazione rischi principali raccomandata",
      test: (inputs) => !!inputs.principali_rischi_identificati,
      actionPlan:
        "Documentare rischi principali: risk register con top 10-20 rischi, description, root causes, potential impact, likelihood, current controls, mitigation actions, owner. Update continuo. Disclosure public (Annual Report): principal risks and uncertainties. Transparency stakeholder su risk management approach.",
    },
  ],
  requiredEvidences: [
    "Documento framework ERM (policy, processi)",
    "Risk register aggiornato",
    "Report risk assessment annuale",
    "Mandato Comitato Rischi (se applicabile)",
    "Report rischi a CdA",
  ],
};

export default G3001;
