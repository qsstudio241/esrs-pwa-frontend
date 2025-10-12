// G1002 - Politiche anticorruzione
const G1002 = {
  kpiCode: "G1002",
  categoryDescription: "G1 - Condotta aziendale",
  title: "Politiche anticorruzione",
  fields: [
    {
      key: "politica_anticorruzione_adottata",
      label: "Politica anticorruzione formale adottata",
      type: "bool",
      required: true,
    },
    {
      key: "risk_assessment_corruzione",
      label: "Risk assessment corruzione effettuato",
      type: "bool",
      required: true,
    },
    {
      key: "formazione_anticorruzione",
      label: "Formazione anticorruzione erogata",
      type: "bool",
      required: false,
    },
    {
      key: "percentuale_dipendenti_formati",
      label: "Percentuale dipendenti formati anticorruzione (%)",
      type: "number",
      required: false,
      min: 0,
      max: 100,
      unit: "%",
    },
    {
      key: "due_diligence_partner_commerciali",
      label: "Due diligence anticorruzione su partner commerciali",
      type: "bool",
      required: false,
    },
    {
      key: "casi_corruzione_identificati",
      label: "Casi di corruzione identificati (anno)",
      type: "number",
      required: false,
      min: 0,
    },
    {
      key: "sanzioni_corruzione_ricevute",
      label: "Sanzioni per corruzione ricevute (anno)",
      type: "number",
      required: false,
      min: 0,
    },
  ],
  checks: [
    {
      code: "ANTI_CORRUPTION_POLICY_MANDATORY",
      severity: "error",
      message: "Politica anticorruzione obbligatoria (D.Lgs 231/2001)",
      test: (inputs) => !!inputs.politica_anticorruzione_adottata,
      actionPlan:
        "Adottare politica anticorruzione: zero tolerance, definizione corruzione/tangenti, sanzioni disciplinari. D.Lgs 231/2001 responsabilità enti. Codice etico. Comunicazione a tutti dipendenti e terze parti. Approvazione CdA.",
    },
    {
      code: "CORRUPTION_RISK_ASSESSMENT",
      severity: "error",
      message: "Risk assessment corruzione obbligatorio",
      test: (inputs) => !!inputs.risk_assessment_corruzione,
      actionPlan:
        "Effettuare corruption risk assessment: identificare aree alto rischio (appalti, gare, autorizzazioni, dogane), valutare probabilità e impatto. ISO 37001 metodologia. Aggiornamento annuale. Integrazione con ERM.",
    },
    {
      code: "ANTI_CORRUPTION_TRAINING",
      severity: "warning",
      message: "Formazione anticorruzione raccomandata per tutti i dipendenti",
      test: (inputs) =>
        inputs.formazione_anticorruzione === true &&
        inputs.percentuale_dipendenti_formati >= 80,
      actionPlan:
        "Erogare formazione anticorruzione: contenuti Legge 231, Codice etico, dilemmi etici, whistleblowing. Target: ≥80% dipendenti formati. Focus: aree alto rischio (procurement, commerciale, relazioni PA). Refresh ogni 2 anni. E-learning + aula.",
    },
    {
      code: "THIRD_PARTY_DUE_DILIGENCE",
      severity: "warning",
      message: "Due diligence partner commerciali raccomandata",
      test: (inputs) => !!inputs.due_diligence_partner_commerciali,
      actionPlan:
        "Implementare due diligence anticorruzione su terze parti: agenti, distributori, consulenti, JV partners. Screening: ownership, integrity checks, litigation history, PEP exposure. Red flags: pagamenti offshore, intermediari non giustificati. Clausole anticorruzione contrattuali.",
    },
    {
      code: "ZERO_CORRUPTION_TARGET",
      severity: "error",
      message: "Target zero corruzione: casi identificati richiedono azioni",
      test: (inputs) =>
        !inputs.casi_corruzione_identificati || inputs.casi_corruzione_identificati === 0,
      actionPlan:
        "Per casi corruzione: 1) Indagine interna o esterna, 2) Sanzioni disciplinari/licenziamento, 3) Denuncia autorità se reato, 4) Remediation (restituzione, risarcimento), 5) Root cause analysis, 6) Rafforzamento controlli. Trasparenza reportistica.",
    },
    {
      code: "SANCTIONS_PROHIBITION",
      severity: "error",
      message: "Sanzioni per corruzione hanno impatto gravissimo: prevenzione essenziale",
      test: (inputs) =>
        !inputs.sanzioni_corruzione_ricevute || inputs.sanzioni_corruzione_ricevute === 0,
      actionPlan:
        "Sanzioni corruzione: multe pesanti, interdizione contratti PA, danno reputazionale. Prevenzione: ISO 37001 Anti-Bribery Management System, Organismo Vigilanza 231, audit interni, whistleblowing system, tone from the top. Compliance program robusto.",
    },
  ],
  requiredEvidences: [
    "Politica anticorruzione e Codice etico",
    "Report risk assessment corruzione",
    "Registri formazione anticorruzione",
    "Report due diligence terze parti",
    "Report casi/sanzioni (se applicabile)",
    "Certificazione ISO 37001 (se applicabile)",
  ],
};

export default G1002;
