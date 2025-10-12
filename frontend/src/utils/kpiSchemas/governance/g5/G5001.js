// G5001 - Politiche di stakeholder engagement
const G5001 = {
  kpiCode: "G5001",
  categoryDescription: "G5 - Stakeholder engagement",
  title: "Politiche di stakeholder engagement",
  fields: [
    {
      key: "politica_stakeholder_engagement",
      label: "Politica di stakeholder engagement formalizzata",
      type: "bool",
      required: true,
    },
    {
      key: "mappatura_stakeholder_effettuata",
      label: "Mappatura stakeholder effettuata (identificazione e prioritizzazione)",
      type: "bool",
      required: true,
    },
    {
      key: "canali_engagement_attivi",
      label: "Canali di engagement attivi e accessibili",
      type: "bool",
      required: false,
    },
    {
      key: "frequenza_engagement_stakeholder",
      label: "Frequenza engagement stakeholder",
      type: "enum",
      required: false,
      enum: ["Mai", "Annuale", "Semestrale", "Trimestrale", "Continuo"],
    },
    {
      key: "feedback_stakeholder_integrato",
      label: "Feedback stakeholder integrato in decision-making",
      type: "bool",
      required: false,
    },
    {
      key: "report_engagement_pubblico",
      label: "Report engagement pubblicato (trasparenza)",
      type: "bool",
      required: false,
    },
  ],
  checks: [
    {
      code: "STAKEHOLDER_POLICY_MANDATORY",
      severity: "error",
      message: "Politica stakeholder engagement obbligatoria (ESRS 2 SBM-2)",
      test: (inputs) => !!inputs.politica_stakeholder_engagement,
      actionPlan:
        "Formalizzare stakeholder engagement policy: ESRS 2 SBM-2 richiede disclosure engagement approaches. Definire: stakeholder categories (employees, customers, suppliers, investors, communities, NGOs, regulators), engagement objectives (inform, consult, involve, collaborate), methods, frequency, governance. Board approval. AA1000 Stakeholder Engagement Standard raccomandato.",
    },
    {
      code: "STAKEHOLDER_MAPPING_MANDATORY",
      severity: "error",
      message: "Mappatura stakeholder obbligatoria (identificazione e prioritizzazione)",
      test: (inputs) => !!inputs.mappatura_stakeholder_effettuata,
      actionPlan:
        "Mappare stakeholder: 1) Identification (chi è impattato/influenza l'azienda), 2) Analysis (power, legitimacy, urgency - Mitchell model), 3) Prioritization (material stakeholders per double materiality). Matrice influence/interest. Update periodica. Inclusione gruppi vulnerabili. Documentation stakeholder register. Base per materiality assessment ESRS.",
    },
    {
      code: "ENGAGEMENT_CHANNELS_ACTIVE",
      severity: "warning",
      message: "Canali engagement accessibili raccomandati",
      test: (inputs) => !!inputs.canali_engagement_attivi,
      actionPlan:
        "Attivare canali engagement: multi-channel approach (surveys, focus groups, workshops, advisory panels, hotline, social media, AGM Q&A, investor days, community meetings). Accessibility (languages, disabilities). Digital + physical. Two-way dialogue. Responsiveness: acknowledge input, explain outcome. Grievance mechanisms (ESRS G1).",
    },
    {
      code: "ENGAGEMENT_FREQUENCY_REGULAR",
      severity: "warning",
      message: "Engagement regolare raccomandato (non sporadico)",
      test: (inputs) =>
        inputs.frequenza_engagement_stakeholder === "Continuo" ||
        inputs.frequenza_engagement_stakeholder === "Trimestrale" ||
        inputs.frequenza_engagement_stakeholder === "Semestrale",
      actionPlan:
        "Engagement regolare: ongoing vs one-off. Investors: quarterly calls, annual AGM. Employees: continuous (pulse surveys, town halls). Customers: continuous (feedback, NPS). Communities: annual consultations + issue-based. Suppliers: annual reviews. Regulators: ongoing dialogue. Calendar engagement activities. Resource allocation.",
    },
    {
      code: "FEEDBACK_INTEGRATION",
      severity: "info",
      message: "Integrazione feedback stakeholder in decisioni raccomandata",
      test: (inputs) => !!inputs.feedback_stakeholder_integrato,
      actionPlan:
        "Integrare feedback in decision-making: close-the-loop = communicate come input ha influenzato decisioni. Esempi: materiality issues prioritized by stakeholders → reporting focus, employee safety concerns → H&S investments, customer privacy fears → data protection upgrades, community opposition → project redesign. Accountability: show listening leads to action. Trust building.",
    },
    {
      code: "ENGAGEMENT_TRANSPARENCY",
      severity: "info",
      message: "Trasparenza su engagement raccomandata (disclosure public)",
      test: (inputs) => !!inputs.report_engagement_pubblico,
      actionPlan:
        "Pubblicare engagement report: disclosure stakeholder categories engaged, methods, frequency, main topics raised, actions taken. Annual Sustainability Report section. ESRS 2 SBM-2 disclosure requirement. Transparency builds trust. Benchmark: best practice aziende pubblicano stakeholder engagement matrix (who, when, what, outcome). Verification esterna possibile (AA1000).",
    },
  ],
  requiredEvidences: [
    "Stakeholder engagement policy",
    "Stakeholder register/mapping",
    "Engagement activity calendar",
    "Survey/feedback reports",
    "Disclosure engagement (Sustainability Report)",
  ],
};

export default G5001;
