/**
 * G001 - Categorie di principi di rendicontazione
 * Requisiti trasversali ESRS 1
 */

const G001 = {
  kpiCode: "G001",
  categoryDescription: "Generale - Requisiti trasversali ESRS",
  title: "Categorie di principi di rendicontazione",
  fields: [
    {
      key: "ambito_consolidamento",
      label: "Ambito di consolidamento definito",
      type: "bool",
      required: true,
    },
    {
      key: "convenzioni_redazionali",
      label: "Convenzioni redazionali applicate",
      type: "enum",
      enum: ["ESRS", "GRI", "SASB", "Altro"],
      required: true,
    },
    {
      key: "periodo_riferimento",
      label: "Periodo di riferimento",
      type: "text",
      required: true,
    },
  ],
  checks: [
    {
      code: "CONSOLIDATION_SCOPE",
      severity: "error",
      message: "Ambito di consolidamento deve essere chiaramente definito",
      test: (i) => i.ambito_consolidamento === true,
      actionPlan:
        "Definire perimetro di rendicontazione: società controllate incluse, criteri di consolidamento (integrale/proporzionale), eventuali esclusioni giustificate.",
    },
    {
      code: "REPORTING_CONVENTIONS",
      severity: "warning",
      message: "Specificare le convenzioni redazionali applicate",
      test: (i) =>
        i.convenzioni_redazionali && i.convenzioni_redazionali !== "",
      actionPlan:
        "Indicare standard applicati (ESRS obbligatorio per EU). Eventuali altri framework volontari (GRI, SASB) devono essere esplicitati.",
    },
  ],
  requiredEvidences: [
    "Nota metodologica ambito consolidamento",
    "Dichiarazione conformità ESRS",
  ],
};

export default G001;
