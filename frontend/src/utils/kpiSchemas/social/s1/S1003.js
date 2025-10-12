/**
 * S1003 - Processi per l'impegno con la forza lavoro e i rappresentanti dei lavoratori
 * ESRS S1-3 - Forza Lavoro Propria
 */

const S1003 = {
  kpiCode: "S1003",
  categoryDescription: "S1 - Forza lavoro propria",
  title:
    "Processi per l'impegno con la forza lavoro e i rappresentanti dei lavoratori",
  fields: [
    {
      key: "dialogo_sociale_attivo",
      label: "Processi di dialogo sociale attivi",
      type: "bool",
      required: true,
    },
    {
      key: "rsu_rls_presenti",
      label: "RSU/RLS eletti e attivi",
      type: "bool",
      required: false,
    },
    {
      key: "consultazione_periodica",
      label: "Consultazione periodica dipendenti su decisioni rilevanti",
      type: "bool",
      required: true,
    },
    {
      key: "canali_comunicazione",
      label: "Canali comunicazione bidirezionale implementati",
      type: "bool",
      required: true,
    },
    {
      key: "survey_engagement",
      label: "Survey engagement/clima aziendale condotte",
      type: "bool",
      required: false,
    },
    {
      key: "percentuale_sindacalizzazione",
      label: "% dipendenti coperti da contrattazione collettiva",
      type: "number",
      min: 0,
      max: 100,
      unit: "%",
      required: false,
    },
  ],
  checks: [
    {
      code: "SOCIAL_DIALOGUE",
      severity: "error",
      message: "Processi di dialogo sociale obbligatori per ESRS S1-3",
      test: (i) =>
        i.dialogo_sociale_attivo &&
        i.consultazione_periodica &&
        i.canali_comunicazione,
      actionPlan:
        "Implementare: incontri periodici con rappresentanti lavoratori, consultazione su cambiamenti organizzativi, canali feedback (intranet, town hall, survey), procedure reclami. Rispettare diritto informazione e consultazione.",
    },
    {
      code: "WORKER_REPRESENTATIVES",
      severity: "warning",
      message: "Rappresentanti lavoratori facilitano dialogo sociale",
      test: (i) => i.rsu_rls_presenti === true,
      actionPlan:
        "Promuovere elezione RSU (Rappresentanze Sindacali Unitarie) o RLS (Rappresentanti Lavoratori Sicurezza). Garantire ore permessi, formazione, locali per attività. Coinvolgere in decisioni rilevanti.",
    },
    {
      code: "ENGAGEMENT_SURVEYS",
      severity: "info",
      message:
        "Survey engagement utili per misurare clima e identificare aree miglioramento",
      test: (i) => i.survey_engagement === true,
      actionPlan:
        "Condurre survey engagement annuali: misurare soddisfazione, senso appartenenza, leadership, crescita professionale. Analizzare risultati, piano azioni, follow-up. Tools: Great Place to Work, Glint.",
    },
  ],
  requiredEvidences: [
    "Verbali incontri con rappresentanti lavoratori",
    "Report survey engagement (opzionale)",
    "Procedure consultazione e reclami",
  ],
};

export default S1003;
