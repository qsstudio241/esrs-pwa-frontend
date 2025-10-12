// G1006 - Concorrenza leale
const G1006 = {
  kpiCode: "G1006",
  categoryDescription: "G1 - Condotta aziendale",
  title: "Concorrenza leale",
  fields: [
    {
      key: "politica_antitrust_adottata",
      label: "Politica antitrust/concorrenza adottata",
      type: "bool",
      required: true,
    },
    {
      key: "formazione_antitrust",
      label: "Formazione antitrust erogata",
      type: "bool",
      required: false,
    },
    {
      key: "procedimenti_antitrust",
      label: "Procedimenti antitrust in corso o conclusi (anno)",
      type: "number",
      required: false,
      min: 0,
    },
    {
      key: "sanzioni_antitrust_ricevute",
      label: "Sanzioni antitrust ricevute (anno)",
      type: "number",
      required: false,
      min: 0,
    },
    {
      key: "importo_sanzioni_antitrust",
      label: "Importo sanzioni antitrust (€)",
      type: "number",
      required: false,
      min: 0,
      unit: "€",
    },
  ],
  checks: [
    {
      code: "ANTITRUST_POLICY_MANDATORY",
      severity: "error",
      message:
        "Politica antitrust obbligatoria (L. 287/1990, Art. 101-102 TFUE)",
      test: (inputs) => !!inputs.politica_antitrust_adottata,
      actionPlan:
        "Adottare politica antitrust: divieto cartelli (fissazione prezzi, ripartizione mercato), abuso posizione dominante, pratiche escludenti. Conformità L. 287/1990, Art. 101-102 TFUE. Linee guida comportamento (trade associations, competitor contacts). Approvazione CdA.",
    },
    {
      code: "ANTITRUST_TRAINING_RECOMMENDED",
      severity: "warning",
      message: "Formazione antitrust raccomandata per aree esposte",
      test: (inputs) => !!inputs.formazione_antitrust,
      actionPlan:
        "Erogare formazione antitrust: contenuti prohibizioni (hard-core cartels, vertical restraints, abuse dominance), do's and don'ts, red flags. Target: management, commerciale, procurement, marketing. Focus: contatti competitor (fiere, associazioni). Competition law compliance program.",
    },
    {
      code: "ZERO_ANTITRUST_VIOLATIONS",
      severity: "error",
      message:
        "Violazioni antitrust hanno impatti gravissimi: prevenzione essenziale",
      test: (inputs) =>
        (!inputs.procedimenti_antitrust ||
          inputs.procedimenti_antitrust === 0) &&
        (!inputs.sanzioni_antitrust_ricevute ||
          inputs.sanzioni_antitrust_ricevute === 0),
      actionPlan:
        "Prevenire violazioni antitrust: 1) Policy chiara e training, 2) Legal advice per operazioni sensibili (M&A, JV, licensing), 3) Compliance audits, 4) Whistleblowing. Sanzioni: fino 10% fatturato globale (UE/AGCM), sanzioni penali persone fisiche. Danno reputazionale enorme.",
    },
    {
      code: "ANTITRUST_PROCEEDINGS_MANAGEMENT",
      severity: "error",
      message:
        "Procedimenti antitrust richiedono gestione legale specializzata",
      test: (inputs) =>
        !inputs.procedimenti_antitrust || inputs.procedimenti_antitrust === 0,
      actionPlan:
        "Per procedimenti antitrust: 1) Legal counsel specializzato, 2) Leniency programs (riduzione sanzioni per collaborazione), 3) Difesa tecnica robusta, 4) Settlement se possibile, 5) Remediation e compliance rafforzata. Comunicazione stakeholder gestita con cautela. Impact finanziario e reputazionale.",
    },
    {
      code: "SANCTIONS_IMPACT",
      severity: "error",
      message: "Sanzioni antitrust indicano grave non-compliance",
      test: (inputs) =>
        !inputs.sanzioni_antitrust_ricevute ||
        inputs.sanzioni_antitrust_ricevute === 0,
      actionPlan:
        "Sanzioni antitrust: 1) Pagamento immediato, 2) Compliance program rafforzato (con monitoring Autorità), 3) Governance review, 4) Training intensivo, 5) Audit esterni. Follow-up: behavioral remedies, structural remedies se richiesto. Prevenire recidive: sanzioni aumentano drasticamente.",
    },
  ],
  requiredEvidences: [
    "Politica antitrust",
    "Linee guida competitor interactions",
    "Registri formazione antitrust",
    "Legal opinions operazioni sensibili",
    "Comunicazioni procedimenti/sanzioni (se applicabile)",
  ],
};

export default G1006;
