/**
 * E2001 - Politiche per la prevenzione e il controllo dell'inquinamento atmosferico
 * ESRS E2-1 - Inquinamento
 */

const E2001 = {
  kpiCode: "E2001",
  categoryDescription: "E2 - Inquinamento",
  title:
    "Politiche per la prevenzione e il controllo dell'inquinamento atmosferico",
  fields: [
    {
      key: "monitoraggio_attivo",
      label: "Monitoraggio emissioni attivo",
      type: "bool",
      required: true,
    },
    {
      key: "autorizzazioni_ambientali",
      label: "Autorizzazioni ambientali in regola (AIA/AUA)",
      type: "bool",
      required: true,
    },
  ],
  checks: [
    {
      code: "MONITORING_REQUIRED",
      severity: "error",
      message: "Monitoraggio emissioni obbligatorio per legge",
      test: (i) => !!i.monitoraggio_attivo,
      actionPlan:
        "Installare sistema monitoraggio continuo (SME) o periodico secondo AIA. Verificare conformità limiti emissivi.",
    },
    {
      code: "PERMITS_VALID",
      severity: "error",
      message: "Autorizzazioni ambientali devono essere valide e aggiornate",
      test: (i) => !!i.autorizzazioni_ambientali,
      actionPlan:
        "Verificare scadenze AIA/AUA. Rinnovare autorizzazioni prima della scadenza. Controllo conformità limiti.",
    },
  ],
  requiredEvidences: [
    "AIA/AUA vigenti",
    "Report emissioni annuali",
    "Certificati analisi",
  ],
};

export default E2001;
