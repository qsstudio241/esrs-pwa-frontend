// S2002 - Condizioni di lavoro nella catena del valore
const S2002 = {
  kpiCode: "S2002",
  categoryDescription: "S2 - Lavoratori nella catena del valore",
  title: "Condizioni di lavoro nella catena del valore",
  fields: [
    {
      key: "mappatura_supply_chain",
      label: "Mappatura completa supply chain effettuata",
      type: "bool",
      required: true,
    },
    {
      key: "livelli_supply_chain_mappati",
      label: "Livelli supply chain mappati",
      type: "enum",
      required: false,
      enum: ["Solo Tier 1", "Tier 1-2", "Tier 1-3", "End-to-end"],
    },
    {
      key: "risk_assessment_paesi",
      label: "Risk assessment paesi di sourcing effettuato",
      type: "bool",
      required: true,
    },
    {
      key: "fornitori_paesi_alto_rischio",
      label: "Numero fornitori in paesi ad alto rischio (diritti umani)",
      type: "number",
      required: false,
      min: 0,
    },
    {
      key: "non_compliance_identificate",
      label: "Non-compliance su condizioni lavoro identificate",
      type: "bool",
      required: false,
    },
    {
      key: "numero_non_compliance",
      label: "Numero di non-compliance rilevate",
      type: "number",
      required: false,
      min: 0,
    },
    {
      key: "azioni_correttive_implementate",
      label: "Azioni correttive implementate per non-compliance",
      type: "bool",
      required: false,
    },
    {
      key: "fornitori_terminati_violazioni",
      label: "Fornitori terminati per violazioni gravi",
      type: "number",
      required: false,
      min: 0,
    },
    {
      key: "living_wage_supply_chain",
      label: "Verifica living wage nella supply chain",
      type: "bool",
      required: false,
    },
    {
      key: "trasparenza_supply_chain",
      label: "Livello di trasparenza supply chain pubblicata",
      type: "enum",
      required: false,
      enum: [
        "Nessuna pubblicazione",
        "Fornitori Tier 1",
        "Fornitori Tier 1-2",
        "Mappatura completa pubblica",
      ],
    },
  ],
  checks: [
    {
      code: "SUPPLY_CHAIN_MAPPING_REQUIRED",
      severity: "error",
      message: "Mappatura supply chain obbligatoria per ESRS S2",
      test: (inputs) => !!inputs.mappatura_supply_chain,
      actionPlan:
        "Mappare supply chain: identificare tutti i fornitori diretti (Tier 1) e, ove possibile, Tier 2 e oltre. Raccogliere: ragione sociale, paese, tipo prodotto/servizio, fatturato, n. lavoratori. Database: supply chain transparency tool.",
    },
    {
      code: "COUNTRY_RISK_ASSESSMENT",
      severity: "error",
      message: "Risk assessment paesi di sourcing obbligatorio",
      test: (inputs) => !!inputs.risk_assessment_paesi,
      actionPlan:
        "Effettuare country risk assessment con strumenti riconosciuti: Amfori Country Risk Classification, ITUC Global Rights Index, US Dept of Labor List of Goods. Identificare paesi alto rischio: lavoro forzato, minorile, violazioni libertà sindacale.",
    },
    {
      code: "HIGH_RISK_COUNTRIES_MANAGEMENT",
      severity: "warning",
      message:
        "Fornitori in paesi ad alto rischio richiedono controlli rafforzati",
      test: (inputs) => {
        if (!inputs.fornitori_paesi_alto_rischio) return true;
        if (inputs.fornitori_paesi_alto_rischio === 0) return true;
        // Se ci sono fornitori ad alto rischio, devono esserci audit
        return inputs.non_compliance_identificate !== undefined;
      },
      actionPlan:
        "Per fornitori in paesi alto rischio: audit sociali annuali obbligatori, enhanced due diligence, monitoring continuo. Considerare disengagement se rischi non mitigabili. Alternative: reshoring, near-shoring, sourcing diversification.",
    },
    {
      code: "NON_COMPLIANCE_REMEDIATION",
      severity: "warning",
      message: "Non-compliance rilevate richiedono azioni correttive",
      test: (inputs) => {
        if (!inputs.non_compliance_identificate) return true;
        return inputs.azioni_correttive_implementate === true;
      },
      actionPlan:
        "Per non-compliance rilevate: 1) Corrective Action Plan (CAP) con timeline, 2) Follow-up audit entro 3-6 mesi, 3) Supporto tecnico fornitore, 4) Se violazioni persistenti: sospensione ordini, 5) Violazioni gravi (forced labor, child labor): terminazione immediata.",
    },
    {
      code: "SEVERE_VIOLATIONS_TERMINATION",
      severity: "error",
      message: "Violazioni gravi richiedono terminazione contratto fornitore",
      test: (inputs) => {
        if (!inputs.numero_non_compliance || inputs.numero_non_compliance === 0)
          return true;
        // Se ci sono non-compliance, verifica gestione (CAP o terminazioni)
        return (
          inputs.azioni_correttive_implementate === true ||
          (inputs.fornitori_terminati_violazioni !== undefined &&
            inputs.fornitori_terminati_violazioni > 0)
        );
      },
      actionPlan:
        "Zero tolerance per violazioni gravi: lavoro forzato, minorile (<15 anni), violenza/abusi, discriminazione sistematica. Terminazione immediata contratto. No nuovi ordini fino a evidenze risoluzione. Reportistica trasparente su azioni intraprese.",
    },
    {
      code: "LIVING_WAGE_VERIFICATION",
      severity: "info",
      message: "Verifica living wage nella supply chain raccomandata",
      test: (inputs) => !!inputs.living_wage_supply_chain,
      actionPlan:
        "Verificare che fornitori paghino living wage (vs minimum wage). Benchmark: Global Living Wage Coalition, Fair Wage Network. Settori critici: tessile, agricoltura, elettronica. Supportare fornitori nell'adeguamento salariale.",
    },
    {
      code: "SUPPLY_CHAIN_TRANSPARENCY",
      severity: "info",
      message: "Trasparenza supply chain raccomandata (best practice)",
      test: (inputs) =>
        inputs.trasparenza_supply_chain === "Fornitori Tier 1-2" ||
        inputs.trasparenza_supply_chain === "Mappatura completa pubblica",
      actionPlan:
        "Pubblicare lista fornitori (almeno Tier 1) su sito web: nome, indirizzo, tipo prodotto. Best practice settore fashion/elettronica. Aumenta accountability. Esempio: Open Apparel Registry. Benefici: reputazione, stakeholder engagement.",
    },
  ],
  requiredEvidences: [
    "Mappatura supply chain (database fornitori)",
    "Country risk assessment (Amfori, ITUC, ecc.)",
    "Report audit sociali fornitori",
    "Corrective Action Plans per non-compliance",
    "Comunicazioni terminazione fornitori (se applicabile)",
  ],
};

export default S2002;
