/**
 * G004 - Dovere di diligenza
 * Requisiti trasversali ESRS 1
 */

const G004 = {
  kpiCode: "G004",
  categoryDescription: "Generale - Requisiti trasversali ESRS",
  title: "Dovere di diligenza",
  fields: [
    {
      key: "processo_due_diligence_implementato",
      label: "Processo di due diligence implementato",
      type: "bool",
      required: true,
    },
    {
      key: "identificazione_impatti",
      label: "Identificazione impatti effettivi e potenziali",
      type: "bool",
      required: true,
    },
    {
      key: "prevenzione_mitigazione",
      label: "Misure di prevenzione e mitigazione attive",
      type: "bool",
      required: true,
    },
    {
      key: "rimedio_impatti_negativi",
      label: "Meccanismi di rimedio per impatti negativi",
      type: "bool",
      required: false,
    },
    {
      key: "monitoraggio_efficacia",
      label: "Monitoraggio efficacia misure",
      type: "bool",
      required: true,
    },
  ],
  checks: [
    {
      code: "DUE_DILIGENCE_REQUIRED",
      severity: "error",
      message: "Processo di due diligence obbligatorio per conformità ESRS",
      test: (i) =>
        i.processo_due_diligence_implementato &&
        i.identificazione_impatti &&
        i.prevenzione_mitigazione &&
        i.monitoraggio_efficacia,
      actionPlan:
        "Implementare processo due diligence: 1) Identificare impatti negativi effettivi/potenziali, 2) Adottare misure prevenzione/mitigazione, 3) Monitorare efficacia azioni, 4) Comunicare risultati.",
    },
    {
      code: "REMEDY_MECHANISM",
      severity: "warning",
      message: "Raccomandato avere meccanismi di rimedio per impatti negativi",
      test: (i) => i.rimedio_impatti_negativi === true,
      actionPlan:
        "Istituire canale di segnalazione/reclamo per stakeholder impattati. Definire processo di gestione reclami e compensazione danni.",
    },
  ],
  requiredEvidences: [
    "Politica aziendale dovere di diligenza",
    "Report valutazione impatti",
    "Piano d'azione prevenzione e mitigazione",
  ],
};

export default G004;
