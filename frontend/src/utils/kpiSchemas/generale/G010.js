/**
 * G010 - Disposizioni transitorie
 * Requisiti trasversali ESRS 1
 */

const G010 = {
  kpiCode: "G010",
  categoryDescription: "Generale - Requisiti trasversali ESRS",
  title: "Disposizioni transitorie",
  fields: [
    {
      key: "primo_anno_applicazione",
      label: "Primo anno di applicazione ESRS",
      type: "bool",
      required: true,
    },
    {
      key: "esenzioni_applicate",
      label: "Esenzioni transitorie applicate",
      type: "bool",
      required: false,
    },
    {
      key: "esenzione_scope3",
      label: "Esenzione Scope 3 (primo anno)",
      type: "bool",
      required: false,
    },
    {
      key: "esenzione_catena_valore",
      label: "Esenzione informazioni catena del valore (primo anno)",
      type: "bool",
      required: false,
    },
    {
      key: "piano_conformita_completa",
      label: "Piano per conformità completa definito",
      type: "bool",
      required: false,
    },
    {
      key: "anno_target_conformita",
      label: "Anno target conformità completa",
      type: "text",
      required: false,
    },
  ],
  checks: [
    {
      code: "FIRST_YEAR_DECLARATION",
      severity: "info",
      message:
        "Dichiarare esplicitamente se è il primo anno di applicazione ESRS",
      test: (i) => i.primo_anno_applicazione !== undefined,
      actionPlan:
        "Indicare chiaramente nella Basis for Preparation se questo è il primo anno di rendicontazione ESRS. Le imprese hanno diritto a esenzioni transitorie.",
    },
    {
      code: "EXEMPTIONS_DISCLOSURE",
      severity: "warning",
      message:
        "Se applicate esenzioni transitorie, documentarle esplicitamente",
      test: (i) => {
        if (!i.esenzioni_applicate) return true;
        return (
          i.esenzione_scope3 !== undefined ||
          i.esenzione_catena_valore !== undefined
        );
      },
      actionPlan:
        "Dichiarare quali esenzioni sono utilizzate: 1) Omissione Scope 3 (primo anno), 2) Omissione informazioni catena valore upstream/downstream (primo anno), 3) Altre esenzioni specifiche.",
    },
    {
      code: "COMPLIANCE_PLAN",
      severity: "info",
      message: "Raccomandato piano per raggiungere conformità completa",
      test: (i) =>
        !i.esenzioni_applicate ||
        (i.piano_conformita_completa && i.anno_target_conformita),
      actionPlan:
        "Se utilizzate esenzioni transitorie, comunicare: 1) Timeline per completare raccolta dati mancanti, 2) Anno target per conformità completa (max entro 3 anni), 3) Azioni specifiche pianificate.",
    },
  ],
  requiredEvidences: [
    "Dichiarazione applicazione disposizioni transitorie (se applicabile)",
    "Piano di conformità progressiva (se esenzioni applicate)",
  ],
};

export default G010;
