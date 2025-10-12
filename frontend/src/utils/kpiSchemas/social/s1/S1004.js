/**
 * S1004 - Azioni per l'uguaglianza di trattamento e opportunità
 * ESRS S1-4 - Forza Lavoro Propria
 */

const S1004 = {
  kpiCode: "S1004",
  categoryDescription: "S1 - Forza lavoro propria",
  title: "Azioni per l'uguaglianza di trattamento e opportunità",
  fields: [
    {
      key: "politiche_dei_adottate",
      label: "Politiche Diversity, Equity & Inclusion (DEI) adottate",
      type: "bool",
      required: true,
    },
    {
      key: "parita_retributiva",
      label: "Parità retributiva di genere verificata",
      type: "bool",
      required: true,
    },
    {
      key: "certificazione_parita_genere",
      label: "Certificazione Parità di Genere UNI/PdR 125",
      type: "bool",
      required: false,
    },
    {
      key: "recruiting_inclusivo",
      label: "Processi recruiting inclusivi implementati",
      type: "bool",
      required: true,
    },
    {
      key: "formazione_dei",
      label: "Formazione su unconscious bias e DEI erogata",
      type: "bool",
      required: false,
    },
    {
      key: "gender_pay_gap",
      label: "Gender pay gap %",
      type: "number",
      min: 0,
      max: 100,
      unit: "%",
      required: false,
    },
  ],
  checks: [
    {
      code: "DEI_POLICIES",
      severity: "error",
      message: "Politiche DEI obbligatorie per ESRS S1-4",
      test: (i) => i.politiche_dei_adottate === true,
      actionPlan:
        "Adottare politiche DEI che coprano: non discriminazione (genere, età, etnia, disabilità, orientamento), pari opportunità accesso/crescita, inclusione, accommodations ragionevoli. Zero tolerance molestie.",
    },
    {
      code: "PAY_EQUITY",
      severity: "error",
      message: "Parità retributiva obbligatoria per legge (L. 162/2021)",
      test: (i) => i.parita_retributiva === true,
      actionPlan:
        "Condurre analisi retributiva gender pay gap. Aziende >50 dipendenti: report biennale parità genere obbligatorio. Correggere disparità ingiustificate. Trasparenza algoritmi HR.",
    },
    {
      code: "GENDER_CERTIFICATION",
      severity: "info",
      message:
        "Certificazione Parità Genere porta vantaggi fiscali e reputazionali",
      test: (i) => i.certificazione_parita_genere === true,
      actionPlan:
        "Ottenere Certificazione UNI/PdR 125:2022. Vantaggi: sgravi contributivi 1%, premialità bandi pubblici, miglior employer branding. Richiede: governance DEI, processi HR inclusivi, work-life balance, tutela maternità.",
    },
    {
      code: "PAY_GAP_TARGET",
      severity: "warning",
      message: "Gender pay gap dovrebbe essere <5% (best practice)",
      test: (i) => !i.gender_pay_gap || i.gender_pay_gap < 5,
      actionPlan:
        "Analizzare cause pay gap: segregazione orizzontale/verticale, part-time involontario, bias promozioni. Azioni: trasparenza retributiva, mentoring donne, flexible working, target leadership femminile.",
    },
  ],
  requiredEvidences: [
    "Politiche DEI",
    "Report parità retributiva (L. 162/2021)",
    "Certificazione Parità Genere UNI/PdR 125 (opzionale)",
    "Analisi gender pay gap",
  ],
};

export default S1004;
