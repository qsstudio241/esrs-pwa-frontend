// S2001 - Politiche relative ai lavoratori nella catena del valore
const S2001 = {
  kpiCode: "S2001",
  categoryDescription: "S2 - Lavoratori nella catena del valore",
  title: "Politiche relative ai lavoratori nella catena del valore",
  fields: [
    {
      key: "politiche_lavoro_supply_chain",
      label: "Politiche per i lavoratori nella supply chain adottate",
      type: "bool",
      required: true,
    },
    {
      key: "codice_condotta_fornitori",
      label: "Codice di condotta fornitori implementato",
      type: "bool",
      required: true,
    },
    {
      key: "due_diligence_diritti_umani",
      label: "Due diligence sui diritti umani nella supply chain effettuata",
      type: "bool",
      required: true,
    },
    {
      key: "audit_sociali_fornitori",
      label: "Audit sociali sui fornitori condotti",
      type: "bool",
      required: false,
    },
    {
      key: "percentuale_fornitori_auditati",
      label: "Percentuale fornitori critici auditati (%)",
      type: "number",
      required: false,
      min: 0,
      max: 100,
      unit: "%",
    },
    {
      key: "certificazioni_fornitori",
      label: "Certificazioni sociali richieste ai fornitori",
      type: "enum",
      required: false,
      enum: ["Nessuna", "SA8000", "BSCI", "Sedex", "Fair Trade", "Multipli"],
    },
    {
      key: "programmi_capacity_building",
      label: "Programmi di capacity building per fornitori",
      type: "bool",
      required: false,
    },
    {
      key: "meccanismi_reclamo_supply_chain",
      label: "Meccanismi di reclamo per lavoratori supply chain",
      type: "bool",
      required: false,
    },
  ],
  checks: [
    {
      code: "SUPPLY_CHAIN_POLICIES_MANDATORY",
      severity: "error",
      message: "Politiche per lavoratori supply chain obbligatorie per ESRS S2",
      test: (inputs) => !!inputs.politiche_lavoro_supply_chain,
      actionPlan:
        "Adottare politiche formali per tutela lavoratori nella catena del valore. Coprire: no lavoro forzato/minorile, libertà associazione, condizioni lavoro dignitose. Riferimento: ESRS S2-1.",
    },
    {
      code: "SUPPLIER_CODE_OF_CONDUCT",
      severity: "error",
      message: "Codice di condotta fornitori obbligatorio",
      test: (inputs) => !!inputs.codice_condotta_fornitori,
      actionPlan:
        "Implementare Supplier Code of Conduct basato su ILO Core Conventions, UN Guiding Principles. Clausole contrattuali vincolanti. Comunicazione a tutti i fornitori. Accettazione obbligatoria per contratti.",
    },
    {
      code: "HUMAN_RIGHTS_DUE_DILIGENCE",
      severity: "error",
      message: "Due diligence diritti umani obbligatoria (CSDD Directive)",
      test: (inputs) => !!inputs.due_diligence_diritti_umani,
      actionPlan:
        "Effettuare HRDD secondo OECD Guidelines e UN Guiding Principles: 1) Identificare rischi (salient issues), 2) Risk assessment fornitori, 3) Azioni mitigazione, 4) Monitoraggio, 5) Remediation. Obbligatorio per CSDD.",
    },
    {
      code: "SOCIAL_AUDITS_RECOMMENDED",
      severity: "warning",
      message: "Audit sociali raccomandati per fornitori ad alto rischio",
      test: (inputs) =>
        inputs.audit_sociali_fornitori === true &&
        inputs.percentuale_fornitori_auditati >= 50,
      actionPlan:
        "Condurre audit sociali (on-site o remote) su ≥50% fornitori critici. Focus: paesi alto rischio (Amfori Country Risk Classification). Verifiche: condizioni lavoro, ore, salari, H&S, libertà sindacale. Azioni correttive per non-compliance.",
    },
    {
      code: "SOCIAL_CERTIFICATIONS",
      severity: "warning",
      message:
        "Certificazioni sociali raccomandate per supply chain ad alto rischio",
      test: (inputs) => inputs.certificazioni_fornitori !== "Nessuna",
      actionPlan:
        "Richiedere certificazioni sociali a fornitori: SA8000 (social accountability), BSCI (Amfori), Sedex/SMETA (ethical audits), Fair Trade (equo-solidale). Priorità: fornitori Tier 1 e subappaltatori ad alto rischio.",
    },
    {
      code: "CAPACITY_BUILDING",
      severity: "info",
      message:
        "Capacity building raccomandato per migliorare standard fornitori",
      test: (inputs) => !!inputs.programmi_capacity_building,
      actionPlan:
        "Implementare programmi di supporto fornitori: training su diritti lavoratori, H&S, gestione risorse umane. Approach collaborativo vs punitivo. Supporto PMI nella transizione a standard sostenibili.",
    },
    {
      code: "GRIEVANCE_MECHANISM",
      severity: "info",
      message: "Meccanismo di reclamo per lavoratori supply chain raccomandato",
      test: (inputs) => !!inputs.meccanismi_reclamo_supply_chain,
      actionPlan:
        "Creare grievance mechanism accessibile ai lavoratori supply chain: hotline multilingue, canale digitale, protezione whistleblower. Gestione reclami secondo UN Guiding Principles effectiveness criteria. Remediation per violazioni accertate.",
    },
  ],
  requiredEvidences: [
    "Politica aziendale lavoratori supply chain",
    "Supplier Code of Conduct",
    "Report due diligence diritti umani",
    "Audit sociali fornitori (se applicabile)",
    "Certificazioni sociali fornitori (SA8000, BSCI, ecc.)",
  ],
};

export default S2001;
