/**
 * G003 - Doppia rilevanza
 * Requisiti trasversali ESRS 1
 */

const G003 = {
  kpiCode: "G003",
  categoryDescription: "Generale - Requisiti trasversali ESRS",
  title: "Doppia rilevanza",
  fields: [
    {
      key: "valutazione_materialita_eseguita",
      label: "Valutazione materialità eseguita",
      type: "bool",
      required: true,
    },
    {
      key: "coinvolgimento_stakeholder",
      label: "Coinvolgimento stakeholder svolto",
      type: "bool",
      required: true,
    },
    {
      key: "metodologia",
      label: "Metodologia",
      type: "enum",
      enum: ["ESRS/CSRD", "Proprietaria", "Altro"],
      required: false,
    },
    { key: "data", label: "Data valutazione", type: "date" },
  ],
  checks: [
    {
      code: "DM_REQUIRED",
      severity: "error",
      message:
        "La doppia materialità deve essere eseguita e coinvolgere gli stakeholder",
      test: (inputs) =>
        !!inputs.valutazione_materialita_eseguita &&
        !!inputs.coinvolgimento_stakeholder,
      actionPlan:
        "Pianificare workshop materialità con stakeholder interni/esterni entro 30gg. Coinvolgere: CFO, CSO, rappresentanti dipendenti, fornitori chiave, clienti.",
    },
    {
      code: "DM_METHODOLOGY_RECOMMENDED",
      severity: "warning",
      message:
        "Raccomandato specificare la metodologia utilizzata per la valutazione di materialità",
      test: (inputs) => !!inputs.metodologia,
      actionPlan:
        "Documentare la metodologia seguita (es. ESRS/CSRD, GRI, proprietaria). Allegare matrice di materialità e verbale stakeholder engagement.",
    },
  ],
  requiredEvidences: [
    "Matrice di Materialità",
    "Verbale Stakeholder Engagement",
  ],
};

export default G003;
