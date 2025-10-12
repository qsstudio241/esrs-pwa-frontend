// G1004 - Rispetto diritti umani
const G1004 = {
  kpiCode: "G1004",
  categoryDescription: "G1 - Condotta aziendale",
  title: "Rispetto diritti umani",
  fields: [
    {
      key: "politica_diritti_umani_adottata",
      label: "Politica diritti umani formale adottata",
      type: "bool",
      required: true,
    },
    {
      key: "hrdd_effettuata",
      label: "Human Rights Due Diligence (HRDD) effettuata",
      type: "bool",
      required: true,
    },
    {
      key: "salient_issues_identificate",
      label: "Salient human rights issues identificate",
      type: "bool",
      required: false,
    },
    {
      key: "conformita_ungp",
      label: "Conformità UN Guiding Principles on Business & Human Rights",
      type: "bool",
      required: false,
    },
    {
      key: "violazioni_diritti_umani_identificate",
      label: "Violazioni diritti umani identificate (anno)",
      type: "number",
      required: false,
      min: 0,
    },
    {
      key: "rimedi_forniti",
      label: "Rimedi/compensazioni forniti per violazioni",
      type: "bool",
      required: false,
    },
    {
      key: "formazione_diritti_umani",
      label: "Formazione diritti umani erogata",
      type: "bool",
      required: false,
    },
  ],
  checks: [
    {
      code: "HUMAN_RIGHTS_POLICY_MANDATORY",
      severity: "error",
      message: "Politica diritti umani obbligatoria (CSDD, ESRS)",
      test: (inputs) => !!inputs.politica_diritti_umani_adottata,
      actionPlan:
        "Adottare politica diritti umani: commitment rispetto UDHR, ILO Conventions, no lavoro forzato/minorile, no discriminazione, libertà associazione, condizioni dignitose. Approvazione CdA. Comunicazione stakeholder. Riferimento: UN Guiding Principles.",
    },
    {
      code: "HRDD_MANDATORY",
      severity: "error",
      message: "Human Rights Due Diligence obbligatoria (CSDD Directive)",
      test: (inputs) => !!inputs.hrdd_effettuata,
      actionPlan:
        "Effettuare HRDD secondo UN Guiding Principles e OECD Guidelines: 1) Identificare rischi (salient issues), 2) Risk assessment operazioni proprie e catena valore, 3) Prevenzione/mitigazione impatti, 4) Tracking efficacia, 5) Comunicazione, 6) Remediation. Obbligatorio per Corporate Sustainability Due Diligence Directive.",
    },
    {
      code: "SALIENT_ISSUES_IDENTIFICATION",
      severity: "warning",
      message: "Identificazione salient human rights issues raccomandata",
      test: (inputs) => !!inputs.salient_issues_identificate,
      actionPlan:
        "Identificare salient issues: diritti umani con maggiori rischi di impatto negativo severo per l'azienda. Prioritizzazione per: severità (scale, scope, irremediability), likelihood. Esempi: forced labor in supply chain, worker safety, land rights, privacy. Focus actions su salient issues.",
    },
    {
      code: "UNGP_ALIGNMENT",
      severity: "warning",
      message: "Allineamento UN Guiding Principles raccomandato",
      test: (inputs) => !!inputs.conformita_ungp,
      actionPlan:
        "Allineare a UN Guiding Principles: Pillar 1 (Stato dovere proteggere), Pillar 2 (Imprese responsabilità rispettare), Pillar 3 (Accesso rimedi). Framework: policy commitment, HRDD, remediation, grievance mechanism. Reporting Principles. Adoption crescente globale.",
    },
    {
      code: "HUMAN_RIGHTS_VIOLATIONS_ACTION",
      severity: "error",
      message: "Violazioni diritti umani richiedono remediation immediata",
      test: (inputs) => {
        if (
          !inputs.violazioni_diritti_umani_identificate ||
          inputs.violazioni_diritti_umani_identificate === 0
        )
          return true;
        return inputs.rimedi_forniti === true;
      },
      actionPlan:
        "Per violazioni diritti umani: 1) Cessazione immediata violazione, 2) Remediation vittime (compensazione monetaria, reintegrazione lavoro, supporto medico/psicologico), 3) Non-recurrence garantita, 4) Trasparenza comunicazione, 5) Collaborazione sindacati/NGO. Operational grievance mechanism accessibile.",
    },
    {
      code: "HUMAN_RIGHTS_TRAINING",
      severity: "info",
      message: "Formazione diritti umani raccomandata",
      test: (inputs) => !!inputs.formazione_diritti_umani,
      actionPlan:
        "Erogare formazione diritti umani: contenuti UDHR, ILO Conventions, HRDD, salient issues aziendali, dilemmi etici. Target: management, procurement, HR, operations. Training su rights holder engagement. Refresh periodico. Cultura aziendale human rights-based.",
    },
  ],
  requiredEvidences: [
    "Politica diritti umani",
    "Report HRDD (Human Rights Due Diligence)",
    "Salient human rights issues assessment",
    "Report violazioni e remediation (se applicabile)",
    "Registri formazione diritti umani",
  ],
};

export default G1004;
