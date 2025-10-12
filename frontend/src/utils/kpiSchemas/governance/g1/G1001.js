// G1001 - Governance della sostenibilità
const G1001 = {
  kpiCode: "G1001",
  categoryDescription: "G1 - Condotta aziendale",
  title: "Governance della sostenibilità",
  fields: [
    {
      key: "comitato_sostenibilita",
      label: "Comitato sostenibilità costituito",
      type: "bool",
      required: false,
    },
    {
      key: "responsabile_sostenibilita",
      label: "Responsabile sostenibilità nominato",
      type: "bool",
      required: true,
    },
    {
      key: "supervisione_cda",
      label: "Supervisione CdA su temi sostenibilità",
      type: "bool",
      required: false,
    },
    {
      key: "frequenza_reporting_cda",
      label: "Frequenza reporting sostenibilità al CdA",
      type: "enum",
      required: false,
      enum: ["Mai", "Annuale", "Semestrale", "Trimestrale", "Mensile"],
    },
  ],
  checks: [
    {
      code: "RESPONSIBLE_REQUIRED",
      severity: "error",
      message: "Nomina responsabile sostenibilità aziendale obbligatoria",
      test: (inputs) => !!inputs.responsabile_sostenibilita,
      actionPlan:
        "Nominare CSO (Chief Sustainability Officer) o Sustainability Manager con mandato formale da CdA. Definire ruolo, responsabilità, KPI, budget, team dedicato. Reporting diretto a CEO o CdA per garantire integrazione strategica.",
    },
    {
      code: "COMMITTEE_RECOMMENDED",
      severity: "warning",
      message:
        "Costituzione comitato sostenibilità raccomandata per governance strutturata",
      test: (inputs) => !!inputs.comitato_sostenibilita,
      actionPlan:
        "Costituire Comitato Sostenibilità (o ESG Committee) con membri senior management cross-funzionali: CFO, COO, CHRO, Chief Risk Officer. Mandato: supervisione strategia ESG, approvazione target, monitoraggio performance, gestione rischi ESG. Meeting trimestrali.",
    },
    {
      code: "BOARD_OVERSIGHT",
      severity: "warning",
      message: "Supervisione CdA su sostenibilità raccomandata (best practice)",
      test: (inputs) => !!inputs.supervisione_cda,
      actionPlan:
        "Integrare sostenibilità in governance CdA: 1) Comitato CdA dedicato o ESG in Audit Committee, 2) Amministratore con competenze ESG, 3) Agenda CdA include temi sostenibilità, 4) KPI ESG nel MBO amministratori, 5) Training CdA su ESRS/CSRD. Tone from the top.",
    },
    {
      code: "REGULAR_REPORTING",
      severity: "info",
      message: "Reporting trimestrale/semestrale a CdA aumenta accountability",
      test: (inputs) =>
        inputs.frequenza_reporting_cda === "Trimestrale" ||
        inputs.frequenza_reporting_cda === "Semestrale" ||
        inputs.frequenza_reporting_cda === "Mensile",
      actionPlan:
        "Implementare reporting ESG periodico a CdA: dashboard KPI sostenibilità, avanzamento target, rischi/opportunità emergenti, benchmark competitor, aggiornamenti normativi. Frequenza ideale: trimestrale per grandi imprese, semestrale per PMI.",
    },
  ],
  requiredEvidences: [
    "Organigramma con ruolo sostenibilità",
    "Verbali CdA con temi sostenibilità",
    "Mandato Comitato Sostenibilità (se applicabile)",
    "Job description responsabile sostenibilità",
    "Dashboard ESG per governance",
  ],
};

export default G1001;
