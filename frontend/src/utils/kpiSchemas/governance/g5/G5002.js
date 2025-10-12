// G5002 - Materiality assessment e stakeholder input
const G5002 = {
  kpiCode: "G5002",
  categoryDescription: "G5 - Stakeholder engagement",
  title: "Materiality assessment e stakeholder input",
  fields: [
    {
      key: "double_materiality_assessment",
      label: "Double materiality assessment condotto (ESRS)",
      type: "bool",
      required: true,
    },
    {
      key: "stakeholder_consultati_materiality",
      label: "Stakeholder consultati nel processo di materiality",
      type: "bool",
      required: true,
    },
    {
      key: "matrice_materialita_pubblica",
      label: "Matrice materialità pubblicata (trasparenza)",
      type: "bool",
      required: false,
    },
    {
      key: "revisione_materialita_frequenza",
      label: "Frequenza revisione materialità",
      type: "enum",
      required: false,
      enum: ["Mai", "Pluriennale (>3 anni)", "Triennale", "Biennale", "Annuale"],
    },
    {
      key: "temi_materiali_numero",
      label: "Numero temi materiali identificati",
      type: "number",
      required: false,
      min: 0,
      max: 50,
    },
    {
      key: "stakeholder_panel_advisory",
      label: "Stakeholder advisory panel costituito (ongoing input)",
      type: "bool",
      required: false,
    },
  ],
  checks: [
    {
      code: "DOUBLE_MATERIALITY_MANDATORY",
      severity: "error",
      message: "Double materiality assessment obbligatorio (ESRS 1 §44-58)",
      test: (inputs) => !!inputs.double_materiality_assessment,
      actionPlan:
        "Condurre double materiality assessment: 1) Impact materiality (azienda → ambiente/società: actual/potential impacts), 2) Financial materiality (sostenibilità → azienda: risks/opportunities). Dimensioni: E, S, G. Time horizons: short/medium/long. Thresholds: significatività impacts/financial effects. Processo iterativo: assessment → disclosure → assurance. ESRS 1 mandatory.",
    },
    {
      code: "STAKEHOLDER_INPUT_MANDATORY",
      severity: "error",
      message: "Consultazione stakeholder obbligatoria per materiality (ESRS 1 §53)",
      test: (inputs) => !!inputs.stakeholder_consultati_materiality,
      actionPlan:
        "Consultare stakeholder per materiality: ESRS 1 §53 richiede stakeholder engagement. Methods: surveys (quantitative ranking), interviews (qualitative depth), workshops (dialogue), advisory panels (expert input). Rappresentatività: diverse stakeholder groups. Weighting: balance stakeholder views con management assessment. Documentation: who consulted, when, methods, results.",
    },
    {
      code: "MATERIALITY_TRANSPARENCY",
      severity: "warning",
      message: "Pubblicazione matrice materialità raccomandata",
      test: (inputs) => !!inputs.matrice_materialita_pubblica,
      actionPlan:
        "Pubblicare matrice materialità: assi impact materiality (y) vs financial materiality (x). Plot temi materiali. Threshold line (above = material = disclosure ESRS). Transparency: stakeholder understand sustainability priorities. Comparability: peer benchmarking matrici. Annual report inclusion. Interactive online version (clickable topics → detailed disclosure). Assurance esterna raccomandato.",
    },
    {
      code: "MATERIALITY_REVIEW_FREQUENCY",
      severity: "warning",
      message: "Revisione materialità regolare raccomandata",
      test: (inputs) =>
        inputs.revisione_materialita_frequenza === "Annuale" ||
        inputs.revisione_materialita_frequenza === "Biennale",
      actionPlan:
        "Rivedere materialità regolarmente: annuale (best practice) o biennale (minimum). Trigger review: major business changes (M&A, new markets), ESG landscape changes (new regulations, stakeholder expectations), incidents (environmental, social). Dynamic materiality: climate era → emergenti temi (biodiversity, circular economy, AI ethics). Update ESRS disclosure accordingly.",
    },
    {
      code: "MATERIAL_TOPICS_SCOPE",
      severity: "info",
      message: "Numero temi materiali bilanciato (focus vs. completezza)",
      test: (inputs) => inputs.temi_materiali_numero >= 5 && inputs.temi_materiali_numero <= 15,
      actionPlan:
        "Bilanciare temi materiali: troppo pochi (<5) = under-scoping, troppi (>20) = lack focus. Best practice: 8-12 temi. Aggregazione logica: es. 'Climate change' (include emissioni, energy, transition risks). Value chain consolidation: supply chain topics. Stakeholder prioritization: top concerns. Management feasibility: reporting capacity. ESRS topical standards guidance.",
    },
    {
      code: "STAKEHOLDER_ADVISORY_PANEL",
      severity: "info",
      message: "Stakeholder advisory panel raccomandato (ongoing input)",
      test: (inputs) => !!inputs.stakeholder_panel_advisory,
      actionPlan:
        "Costituire stakeholder advisory panel: membri external (investors, NGOs, academics, community reps, employee reps). Mandato: advise su sustainability strategy, review materiality, challenge management. Meetings: 2-3/anno. Independence + expertise. Diversity (views, backgrounds). Remuneration external members. Minutes published. Examples: Unilever Sustainability Advisory Council. Builds accountability and credibility.",
    },
  ],
  requiredEvidences: [
    "Double materiality assessment report (ESRS 1)",
    "Matrice materialità",
    "Documentation stakeholder consultation",
    "Lista temi materiali con rationale",
    "Disclosure materialità (Sustainability Report)",
  ],
};

export default G5002;
