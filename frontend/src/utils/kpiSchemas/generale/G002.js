/**
 * G002 - Caratteristiche qualitative delle informazioni
 * Requisiti trasversali ESRS 1
 */

const G002 = {
  kpiCode: "G002",
  categoryDescription: "Generale - Requisiti trasversali ESRS",
  title: "Caratteristiche qualitative delle informazioni",
  fields: [
    {
      key: "rilevanza",
      label: "Informazioni rilevanti per stakeholder",
      type: "bool",
      required: true,
    },
    {
      key: "rappresentazione_fedele",
      label: "Rappresentazione fedele applicata",
      type: "bool",
      required: true,
    },
    {
      key: "verificabilita",
      label: "Informazioni verificabili",
      type: "bool",
      required: true,
    },
    {
      key: "comparabilita",
      label: "Comparabilità garantita",
      type: "bool",
      required: true,
    },
    {
      key: "comprensibilita",
      label: "Comprensibilità delle informazioni",
      type: "bool",
      required: true,
    },
  ],
  checks: [
    {
      code: "QUALITATIVE_CHARACTERISTICS",
      severity: "error",
      message:
        "Tutte le caratteristiche qualitative ESRS devono essere rispettate",
      test: (i) =>
        i.rilevanza &&
        i.rappresentazione_fedele &&
        i.verificabilita &&
        i.comparabilita &&
        i.comprensibilita,
      actionPlan:
        "Assicurare: 1) Rilevanza per decisioni stakeholder, 2) Rappresentazione fedele/completa, 3) Verificabilità da terzi, 4) Comparabilità anno su anno, 5) Comprensibilità per destinatari.",
    },
    {
      code: "MATERIALITY_PRINCIPLE",
      severity: "warning",
      message: "Principio di rilevanza deve guidare la rendicontazione",
      test: (i) => i.rilevanza === true,
      actionPlan:
        "Applicare valutazione di materialità per identificare informazioni rilevanti. Includere tutti i temi materiali secondo doppia rilevanza.",
    },
  ],
  requiredEvidences: [
    "Dichiarazione applicazione principi qualitativi",
    "Report verifica esterna (se applicabile)",
  ],
};

export default G002;
