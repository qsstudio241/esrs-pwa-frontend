// E5001 - Politiche relative all'economia circolare
const E5001 = {
  kpiCode: "E5001",
  categoryDescription: "E5 - Economia circolare",
  title: "Politiche relative all'economia circolare",
  fields: [
    {
      key: "politiche_economia_circolare",
      label: "Politiche di economia circolare adottate",
      type: "bool",
      required: true,
    },
    {
      key: "strategia_circolarita",
      label: "Strategia di circolarità definita",
      type: "bool",
      required: false,
    },
    {
      key: "principi_circolarita_applicati",
      label: "Principi di circolarità applicati",
      type: "enum",
      required: false,
      enum: [
        "Nessuno",
        "Design for durability",
        "Design for recyclability",
        "Use of recycled materials",
        "Product-as-a-service",
        "Multipli",
      ],
    },
    {
      key: "valutazione_ciclo_vita",
      label: "Valutazione ciclo di vita (LCA) dei prodotti effettuata",
      type: "bool",
      required: false,
    },
    {
      key: "ecodesign_implementato",
      label: "Principi di eco-design implementati",
      type: "bool",
      required: false,
    },
    {
      key: "obiettivi_riduzione_rifiuti",
      label: "Obiettivi di riduzione rifiuti definiti",
      type: "bool",
      required: false,
    },
    {
      key: "target_riciclo",
      label: "Target di riciclo/riutilizzo (%)",
      type: "number",
      required: false,
      min: 0,
      max: 100,
      unit: "%",
    },
    {
      key: "collaborazione_supply_chain_circolarita",
      label: "Collaborazione con supply chain per circolarità",
      type: "enum",
      required: false,
      enum: ["Assente", "Iniziale", "Strutturata", "Integrata"],
    },
  ],
  checks: [
    {
      code: "CIRCULAR_ECONOMY_POLICIES_MANDATORY",
      severity: "error",
      message: "Politiche di economia circolare obbligatorie per ESRS E5",
      test: (inputs) => !!inputs.politiche_economia_circolare,
      actionPlan:
        "Adottare politiche formali per transizione a economia circolare. Documentare approccio a gestione risorse, design prodotti, gestione fine vita. Riferimento: ESRS E5-1.",
    },
    {
      code: "CIRCULARITY_STRATEGY_RECOMMENDED",
      severity: "warning",
      message: "Strategia di circolarità strutturata raccomandata",
      test: (inputs) => !!inputs.strategia_circolarita,
      actionPlan:
        "Definire strategia circolarità: mappare flussi materiali, identificare opportunità (reduce/reuse/recycle), fissare KPI circolarità (es. Material Circularity Indicator). Integrare in business model.",
    },
    {
      code: "CIRCULAR_PRINCIPLES_APPLICATION",
      severity: "warning",
      message: "Applicazione principi circolarità raccomandata",
      test: (inputs) =>
        inputs.principi_circolarita_applicati !== "Nessuno" &&
        inputs.principi_circolarita_applicati !== undefined,
      actionPlan:
        "Implementare principi Ellen MacArthur Foundation: 1) Design out waste, 2) Keep products in use, 3) Regenerate natural systems. Priorità: durabilità, riparabilità, riciclabilità prodotti.",
    },
    {
      code: "LCA_ASSESSMENT",
      severity: "warning",
      message:
        "Valutazione ciclo di vita (LCA) raccomandata per prodotti principali",
      test: (inputs) => !!inputs.valutazione_ciclo_vita,
      actionPlan:
        "Effettuare LCA per prodotti principali (ISO 14040/14044). Identificare hotspots ambientali. Usare risultati per eco-design. Database: Ecoinvent, GaBi. Tool: SimaPro, OpenLCA.",
    },
    {
      code: "ECODESIGN_IMPLEMENTATION",
      severity: "info",
      message: "Eco-design raccomandato per nuovi prodotti",
      test: (inputs) => !!inputs.ecodesign_implementato,
      actionPlan:
        "Implementare eco-design: design for disassembly, use of mono-materials, avoid hazardous substances, optimize lifecycle. Conformità: Direttiva Ecodesign EU 2009/125/CE.",
    },
    {
      code: "WASTE_REDUCTION_TARGETS",
      severity: "info",
      message: "Obiettivi riduzione rifiuti raccomandati",
      test: (inputs) =>
        inputs.obiettivi_riduzione_rifiuti === true &&
        inputs.target_riciclo >= 70,
      actionPlan:
        "Definire target riduzione rifiuti: zero waste to landfill, riciclo ≥70%, riutilizzo materiali. Implementare waste hierarchy: prevenzione > riutilizzo > riciclo > recupero energetico > smaltimento.",
    },
    {
      code: "SUPPLY_CHAIN_COLLABORATION",
      severity: "info",
      message: "Collaborazione supply chain per circolarità raccomandata",
      test: (inputs) =>
        inputs.collaborazione_supply_chain_circolarita === "Strutturata" ||
        inputs.collaborazione_supply_chain_circolarita === "Integrata",
      actionPlan:
        "Collaborare con fornitori per circolarità: take-back schemes, reverse logistics, material passports. Condividere best practices. Supportare PMI nella transizione circolare.",
    },
  ],
  requiredEvidences: [
    "Politica economia circolare aziendale",
    "Strategia circolarità e roadmap",
    "Report LCA prodotti (se applicabile)",
    "Linee guida eco-design",
    "Obiettivi riduzione rifiuti e target riciclo",
  ],
};

export default E5001;
