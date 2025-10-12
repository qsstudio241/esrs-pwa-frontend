// G2001 - Struttura governance sostenibilità
const G2001 = {
  kpiCode: "G2001",
  categoryDescription: "G2 - Pratiche di governance",
  title: "Struttura governance sostenibilità",
  fields: [
    {
      key: "comitato_sostenibilita_cda",
      label: "Comitato sostenibilità o ESG a livello CdA",
      type: "bool",
      required: false,
    },
    {
      key: "responsabile_sostenibilita_c_level",
      label: "Responsabile sostenibilità a livello C-suite (CSO/Chief Sustainability Officer)",
      type: "bool",
      required: false,
    },
    {
      key: "integrazione_esg_strategia",
      label: "ESG integrato nella strategia aziendale",
      type: "bool",
      required: true,
    },
    {
      key: "kpi_esg_management",
      label: "KPI ESG definiti per management",
      type: "bool",
      required: false,
    },
    {
      key: "remunerazione_legata_esg",
      label: "Remunerazione variabile management legata a obiettivi ESG",
      type: "bool",
      required: false,
    },
    {
      key: "reporting_esg_cda",
      label: "Reporting ESG periodico a CdA",
      type: "enum",
      required: false,
      enum: ["Mai", "Annuale", "Semestrale", "Trimestrale"],
    },
  ],
  checks: [
    {
      code: "ESG_STRATEGY_INTEGRATION_MANDATORY",
      severity: "error",
      message: "Integrazione ESG nella strategia obbligatoria per ESRS",
      test: (inputs) => !!inputs.integrazione_esg_strategia,
      actionPlan:
        "Integrare ESG in strategia aziendale: materiality assessment, definizione ambizioni ESG, roadmap azioni, integrazione business planning. ESG = value driver, non solo compliance. Board oversight. Comunicazione stakeholder. Riferimento: ESRS 2 General Disclosures.",
    },
    {
      code: "SUSTAINABILITY_GOVERNANCE_RECOMMENDED",
      severity: "warning",
      message: "Governance sostenibilità dedicata raccomandata",
      test: (inputs) =>
        inputs.comitato_sostenibilita_cda === true ||
        inputs.responsabile_sostenibilita_c_level === true,
      actionPlan:
        "Implementare governance ESG: Comitato sostenibilità CdA (oversight strategico) e/o CSO C-level (esecuzione operativa). Mandato: strategia ESG, risk management, obiettivi, reporting, engagement stakeholder. Budget e team dedicati. Escalation Board per temi material.",
    },
    {
      code: "ESG_KPI_MANAGEMENT",
      severity: "warning",
      message: "KPI ESG per management raccomandati per accountability",
      test: (inputs) => !!inputs.kpi_esg_management,
      actionPlan:
        "Definire KPI ESG management: emissioni GHG, consumi idrici/energetici, tasso infortuni, diversity %, engagement score, compliance. Assegnazione ownership. Monitoring regolare. Escalation se off-track. Transparency reportistica. Link to compensation per incentivazione.",
    },
    {
      code: "ESG_LINKED_COMPENSATION",
      severity: "info",
      message: "Remunerazione legata a ESG allinea incentivi",
      test: (inputs) => !!inputs.remunerazione_legata_esg,
      actionPlan:
        "Legare remunerazione variabile a KPI ESG: typical 10-30% bonus su obiettivi ESG. ESG metrics: climate (GHG reduction), social (safety, diversity), governance (ethics compliance). Payout solo se obiettivi raggiunti. Trasparenza disclosure. Allinea interessi management-stakeholder. Best practice governance.",
    },
    {
      code: "BOARD_ESG_REPORTING",
      severity: "info",
      message: "Reporting ESG regolare a CdA raccomandato",
      test: (inputs) =>
        inputs.reporting_esg_cda === "Trimestrale" ||
        inputs.reporting_esg_cda === "Semestrale",
      actionPlan:
        "Reporting ESG periodico a CdA: progress KPI, rischi emergenti, progetti in corso, budget vs actual, stakeholder feedback. Frequenza: almeno semestrale, ideale trimestrale. Dashboard ESG. Board time dedicate a ESG. Informed oversight = better decisions. Fiduciary duty su ESG risks.",
    },
  ],
  requiredEvidences: [
    "Mandato Comitato sostenibilità CdA (se applicabile)",
    "Job description CSO (se applicabile)",
    "Piano strategico con ESG integrato",
    "KPI ESG management con ownership",
    "Policy remunerazione con link ESG (se applicabile)",
  ],
};

export default G2001;
