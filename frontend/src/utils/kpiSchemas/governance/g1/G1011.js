// G1011 - Etica aziendale e cultura della compliance
const G1011 = {
  kpiCode: "G1011",
  categoryDescription: "G1 - Condotta aziendale",
  title: "Etica aziendale e cultura della compliance",
  fields: [
    {
      key: "codice_etico_adottato",
      label: "Codice etico/condotta adottato",
      type: "bool",
      required: true,
    },
    {
      key: "comitato_etico_costituito",
      label: "Comitato etico o funzione compliance costituita",
      type: "bool",
      required: false,
    },
    {
      key: "formazione_etica_compliance",
      label: "Formazione etica e compliance erogata",
      type: "bool",
      required: false,
    },
    {
      key: "percentuale_dipendenti_formati_etica",
      label: "Percentuale dipendenti formati su etica/compliance (%)",
      type: "number",
      required: false,
      min: 0,
      max: 100,
      unit: "%",
    },
    {
      key: "violazioni_codice_etico",
      label: "Violazioni codice etico segnalate (anno)",
      type: "number",
      required: false,
      min: 0,
    },
    {
      key: "sanzioni_disciplinari",
      label: "Sanzioni disciplinari per violazioni etiche (anno)",
      type: "number",
      required: false,
      min: 0,
    },
    {
      key: "cultura_speak_up",
      label: "Cultura 'speak-up' promossa attivamente",
      type: "bool",
      required: false,
    },
    {
      key: "tone_at_the_top",
      label: "Tone at the top su etica comunicato dal management",
      type: "bool",
      required: false,
    },
  ],
  checks: [
    {
      code: "CODE_OF_ETHICS_MANDATORY",
      severity: "error",
      message: "Codice etico obbligatorio per governance responsabile",
      test: (inputs) => !!inputs.codice_etico_adottato,
      actionPlan:
        "Adottare Codice etico/condotta: valori aziendali, principi comportamento (integrità, rispetto, responsabilità), regole specifiche (conflitti interesse, regali, confidenzialità). Applicazione: tutti dipendenti e terze parti. Approvazione CdA. Comunicazione: onboarding, intranet, training. Review periodica.",
    },
    {
      code: "ETHICS_GOVERNANCE",
      severity: "warning",
      message: "Governance etica e compliance raccomandata",
      test: (inputs) => !!inputs.comitato_etico_costituito,
      actionPlan:
        "Costituire funzione/comitato etico-compliance: Compliance Officer/Chief Ethics Officer, Comitato Etico (CdA members, management). Mandato: policy development, training, monitoring, investigations, reporting. Indipendenza essenziale. Risorse adeguate. Report to Board. Organismo Vigilanza 231 se applicabile.",
    },
    {
      code: "ETHICS_TRAINING_RECOMMENDED",
      severity: "warning",
      message: "Formazione etica e compliance raccomandata per tutti",
      test: (inputs) =>
        inputs.formazione_etica_compliance === true &&
        inputs.percentuale_dipendenti_formati_etica >= 90,
      actionPlan:
        "Erogare formazione etica/compliance: Codice etico, dilemmi etici, whistleblowing, anticorruzione, conflitti interesse, rispetto diritti. Target: ≥90% dipendenti. Onboarding + refresh biennale. Focus: management (tone at the top), funzioni sensibili. Case studies, interactive. Testing comprensione.",
    },
    {
      code: "CODE_VIOLATIONS_MANAGEMENT",
      severity: "warning",
      message: "Violazioni codice etico richiedono gestione coerente",
      test: (inputs) => {
        if (
          !inputs.violazioni_codice_etico ||
          inputs.violazioni_codice_etico === 0
        )
          return true;
        // Se violazioni, devono esserci sanzioni proporzionate
        return inputs.sanzioni_disciplinari > 0;
      },
      actionPlan:
        "Gestire violazioni Codice etico: 1) Indagine imparziale (Compliance/HR/esterno), 2) Sanzioni proporzionate (verbal warning, written warning, sospensione, licenziamento), 3) Consistency enforcement, 4) Root cause analysis, 5) Comunicazione (rispetto privacy). Zero tolerance per violazioni gravi. Transparency governance.",
    },
    {
      code: "SPEAK_UP_CULTURE",
      severity: "info",
      message: "Cultura 'speak-up' essenziale per ethics program efficace",
      test: (inputs) => !!inputs.cultura_speak_up,
      actionPlan:
        "Promuovere cultura speak-up: 1) Leadership modeling (tone at the top), 2) No retaliation garantito, 3) Whistleblowing accessible, 4) Recognition reporting (non punitivo), 5) Open door policy, 6) Survey clima etico. Psychological safety. Barriers: paura ritorsioni, futilità percepita. Measurement: # segnalazioni, trust survey.",
    },
    {
      code: "TONE_AT_THE_TOP",
      severity: "warning",
      message: "Tone at the top su etica fondamentale per cultura aziendale",
      test: (inputs) => !!inputs.tone_at_the_top,
      actionPlan:
        "Comunicare tone at the top: CEO/Board messaging su etica, zero tolerance violazioni, walk the talk. Comunicazioni: town halls, video, lettere. Visibility leadership su temi etici. Accountability anche per senior. Culture flows from top. Ethics scorecards management. Compensation tied to ethics performance.",
    },
  ],
  requiredEvidences: [
    "Codice etico aziendale",
    "Mandato Comitato Etico/Compliance Officer",
    "Registri formazione etica",
    "Report violazioni e sanzioni (anonimizzato)",
    "Survey clima etico (se applicabile)",
  ],
};

export default G1011;
