// G2002 - Composizione e competenze CdA
const G2002 = {
  kpiCode: "G2002",
  categoryDescription: "G2 - Pratiche di governance",
  title: "Composizione e competenze CdA",
  fields: [
    {
      key: "numero_membri_cda",
      label: "Numero membri CdA",
      type: "number",
      required: false,
      min: 1,
    },
    {
      key: "percentuale_amministratori_indipendenti",
      label: "Percentuale amministratori indipendenti (%)",
      type: "number",
      required: false,
      min: 0,
      max: 100,
      unit: "%",
    },
    {
      key: "diversita_genere_cda",
      label: "Percentuale donne in CdA (%)",
      type: "number",
      required: false,
      min: 0,
      max: 100,
      unit: "%",
    },
    {
      key: "competenze_esg_cda",
      label: "Competenze ESG presenti in CdA",
      type: "bool",
      required: false,
    },
    {
      key: "formazione_esg_cda",
      label: "Formazione ESG erogata a CdA",
      type: "bool",
      required: false,
    },
    {
      key: "frequenza_riunioni_cda",
      label: "Frequenza riunioni CdA (per anno)",
      type: "number",
      required: false,
      min: 1,
    },
  ],
  checks: [
    {
      code: "BOARD_INDEPENDENCE_RECOMMENDED",
      severity: "warning",
      message: "Amministratori indipendenti ≥50% raccomandato (Corporate Governance Code)",
      test: (inputs) => {
        if (!inputs.percentuale_amministratori_indipendenti) return true;
        return inputs.percentuale_amministratori_indipendenti >= 50;
      },
      actionPlan:
        "Garantire indipendenza CdA: ≥50% amministratori indipendenti (quotate: raccomandazione Codice Corporate Governance). Criteri indipendenza: no rapporti economici significativi, no family ties, no executive ruoli recenti. Benefici: oversight obiettivo, tutela minority shareholders, mitigazione conflitti interesse.",
    },
    {
      code: "BOARD_GENDER_DIVERSITY",
      severity: "warning",
      message: "Diversità genere CdA: target ≥40% genere sottorappresentato (L. 160/2019)",
      test: (inputs) => {
        if (!inputs.diversita_genere_cda) return true;
        return inputs.diversita_genere_cda >= 40;
      },
      actionPlan:
        "Rispettare quote genere CdA: L. 160/2019 (ex Golfo-Mosca) ≥40% genere sottorappresentato per quotate e partecipate pubbliche. Anche non quotate: best practice diversity. Succession planning inclusivo. Ampliare pool candidati. Benefici: performance, innovation, stakeholder trust.",
    },
    {
      code: "ESG_COMPETENCIES_BOARD",
      severity: "warning",
      message: "Competenze ESG in CdA raccomandate per oversight efficace",
      test: (inputs) => !!inputs.competenze_esg_cda,
      actionPlan:
        "Includere competenze ESG in Board: almeno 1 membro con expertise sustainability/ESG (background: CSR, ambiente, sociale, governance). Skills matrix CdA. Succession planning considera ESG skills. Director search firms briefati. Board effectiveness evaluation include ESG oversight capability.",
    },
    {
      code: "BOARD_ESG_TRAINING",
      severity: "info",
      message: "Formazione ESG per CdA raccomandata",
      test: (inputs) => !!inputs.formazione_esg_cda,
      actionPlan:
        "Formare CdA su ESG: temi material (climate, supply chain, diversity), framework (ESRS, TCFD), trends regolamentari (CSRD, CSDD), investor expectations. Sessioni dedicate (2-4h), esperti esterni. Board induction include ESG. Aggiornamenti periodici. Informed Board = better oversight.",
    },
    {
      code: "BOARD_MEETING_FREQUENCY",
      severity: "info",
      message: "Frequenza riunioni CdA adeguata per oversight",
      test: (inputs) => {
        if (!inputs.frequenza_riunioni_cda) return true;
        return inputs.frequenza_riunioni_cda >= 4;
      },
      actionPlan:
        "Garantire riunioni CdA frequenti: minimo trimestrale (4/anno), ideale 6-8/anno per effective oversight. Agenda strutturate: strategy, performance, risk, ESG, M&A, succession. Materiali pre-read. Tempo adeguato per discussion. Minutes dettagliati. Executive sessions (no management). Virtual ok se necessario.",
    },
  ],
  requiredEvidences: [
    "Composizione CdA con curricula",
    "Dichiarazioni indipendenza amministratori",
    "Skills matrix CdA con competenze ESG",
    "Report formazione CdA",
    "Verbali riunioni CdA (summary)",
  ],
};

export default G2002;
