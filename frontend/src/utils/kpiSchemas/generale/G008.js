/**
 * G008 - Struttura della dichiarazione di sostenibilità
 * Requisiti trasversali ESRS 1
 */

const G008 = {
  kpiCode: "G008",
  categoryDescription: "Generale - Requisiti trasversali ESRS",
  title: "Struttura della dichiarazione di sostenibilità",
  fields: [
    {
      key: "sezioni_obbligatorie_presenti",
      label: "Tutte le sezioni obbligatorie presenti",
      type: "bool",
      required: true,
    },
    {
      key: "sequenza_corretta",
      label: "Sequenza delle sezioni conforme a ESRS",
      type: "bool",
      required: true,
    },
    {
      key: "informazioni_generali",
      label: "Sezione Informazioni Generali completa",
      type: "bool",
      required: true,
    },
    {
      key: "informazioni_tematiche",
      label: "Sezioni tematiche (E, S, G) complete",
      type: "bool",
      required: true,
    },
    {
      key: "indice_contenuti",
      label: "Indice contenuti ESRS incluso",
      type: "bool",
      required: false,
    },
  ],
  checks: [
    {
      code: "MANDATORY_SECTIONS",
      severity: "error",
      message: "Tutte le sezioni obbligatorie ESRS devono essere presenti",
      test: (i) =>
        i.sezioni_obbligatorie_presenti &&
        i.informazioni_generali &&
        i.informazioni_tematiche,
      actionPlan:
        "Includere: 1) Basis for preparation, 2) General disclosures (GOV, SBM, IRO, Metrics), 3) Environmental (E1-E5 se materiali), 4) Social (S1-S4 se materiali), 5) Governance (G1 se materiale).",
    },
    {
      code: "STRUCTURE_SEQUENCE",
      severity: "warning",
      message:
        "La sequenza delle sezioni dovrebbe seguire l'ordine ESRS standard",
      test: (i) => i.sequenza_corretta === true,
      actionPlan:
        "Ordine raccomandato: Generale → Ambientale → Sociale → Governance. Questo facilita comparabilità tra imprese.",
    },
    {
      code: "CONTENT_INDEX",
      severity: "info",
      message: "Raccomandato includere indice contenuti ESRS per navigazione",
      test: (i) => i.indice_contenuti === true,
      actionPlan:
        "Creare tabella di riferimento con tutti i datapoint ESRS rendicontati e relative pagine/sezioni del documento.",
    },
  ],
  requiredEvidences: [
    "Dichiarazione di sostenibilità completa",
    "Indice contenuti ESRS (opzionale)",
  ],
};

export default G008;
