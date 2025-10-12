/**
 * E1003 - Politiche energetiche e mix energetico
 * ESRS E1-3 - Cambiamenti Climatici
 */

const E1003 = {
  kpiCode: "E1003",
  categoryDescription: "E1 - Cambiamenti Climatici",
  title: "Politiche energetiche e mix energetico",
  fields: [
    {
      key: "politiche_energetiche_adottate",
      label: "Politiche energetiche formali adottate",
      type: "bool",
      required: true,
    },
    {
      key: "consumo_totale_energia",
      label: "Consumo totale energia",
      type: "number",
      min: 0,
      unit: "MWh",
      required: true,
    },
    {
      key: "percentuale_energia_rinnovabile",
      label: "% energia da fonti rinnovabili",
      type: "number",
      min: 0,
      max: 100,
      unit: "%",
      required: true,
    },
    {
      key: "autoproduzione_rinnovabile",
      label: "Autoproduzione energia rinnovabile (es. fotovoltaico)",
      type: "bool",
      required: false,
    },
    {
      key: "certificati_origine_rinnovabile",
      label: "Acquisto certificati origine (GO) per energia rinnovabile",
      type: "bool",
      required: false,
    },
    {
      key: "obiettivo_100_rinnovabile",
      label: "Obiettivo 100% energia rinnovabile definito",
      type: "bool",
      required: false,
    },
  ],
  checks: [
    {
      code: "ENERGY_POLICIES",
      severity: "error",
      message: "Politiche energetiche obbligatorie per ESRS E1-3",
      test: (i) => i.politiche_energetiche_adottate === true,
      actionPlan:
        "Adottare politiche energetiche formali che coprano: efficienza energetica, riduzione consumi, transizione a rinnovabili, monitoraggio prestazioni. Approvazione board raccomandato.",
    },
    {
      code: "ENERGY_DATA",
      severity: "error",
      message: "Consumo totale e mix energetico devono essere rendicontati",
      test: (i) =>
        i.consumo_totale_energia !== undefined &&
        i.percentuale_energia_rinnovabile !== undefined,
      actionPlan:
        "Raccogliere dati consumi da bollette/contatori. Calcolare split tra rinnovabile (autoprodotta + acquistata con GO) e non rinnovabile. Convertire tutto in MWh.",
    },
    {
      code: "RENEWABLE_TARGET",
      severity: "warning",
      message: "Raccomandato incrementare % rinnovabili e definire target 100%",
      test: (i) =>
        i.percentuale_energia_rinnovabile >= 50 ||
        i.obiettivo_100_rinnovabile === true,
      actionPlan:
        "Aumentare % rinnovabili: installare fotovoltaico on-site, firmare PPA (Power Purchase Agreement), acquistare energia verde con GO. Target EU: clima-neutrale 2050.",
    },
  ],
  requiredEvidences: [
    "Politica energetica aziendale",
    "Report consumi energetici (MWh totali)",
    "Certificati Garanzia Origine (GO) se applicabile",
  ],
};

export default E1003;
