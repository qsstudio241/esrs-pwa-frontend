// E3002 - Consumo e prelievo di risorse idriche
const E3002 = {
  kpiCode: "E3002",
  categoryDescription: "E3 - Risorse idriche e marine",
  title: "Consumo e prelievo di risorse idriche",
  fields: [
    {
      key: "prelievo_idrico_totale",
      label: "Prelievo idrico totale (m³/anno)",
      type: "number",
      required: true,
      min: 0,
      unit: "m³",
    },
    {
      key: "prelievo_aree_stress_idrico",
      label: "Prelievo in aree a stress idrico (m³/anno)",
      type: "number",
      required: false,
      min: 0,
      unit: "m³",
    },
    {
      key: "consumo_idrico_totale",
      label: "Consumo idrico totale (m³/anno)",
      type: "number",
      required: true,
      min: 0,
      unit: "m³",
    },
    {
      key: "intensita_idrica",
      label: "Intensità idrica (m³/€ fatturato)",
      type: "number",
      required: false,
      min: 0,
      unit: "m³/€",
    },
    {
      key: "scarichi_idrici_totali",
      label: "Scarichi idrici totali (m³/anno)",
      type: "number",
      required: true,
      min: 0,
      unit: "m³",
    },
    {
      key: "acqua_riciclata_riutilizzata",
      label: "Acqua riciclata/riutilizzata (m³/anno)",
      type: "number",
      required: false,
      min: 0,
      unit: "m³",
    },
    {
      key: "percentuale_riutilizzo",
      label: "Percentuale di riutilizzo (%)",
      type: "number",
      required: false,
      min: 0,
      max: 100,
      unit: "%",
    },
    {
      key: "fonte_prelievo_principale",
      label: "Fonte di prelievo principale",
      type: "enum",
      required: true,
      enum: [
        "Acquedotto pubblico",
        "Acque superficiali",
        "Acque sotterranee",
        "Acque marine",
        "Acque reflue terzi",
      ],
    },
    {
      key: "qualita_scarichi_conforme",
      label: "Qualità degli scarichi conforme ai limiti di legge",
      type: "bool",
      required: true,
    },
  ],
  checks: [
    {
      code: "WATER_WITHDRAWAL_REQUIRED",
      severity: "error",
      message: "Misurazione del prelievo idrico totale obbligatoria per ESRS E3",
      test: (inputs) =>
        inputs.prelievo_idrico_totale !== undefined &&
        inputs.prelievo_idrico_totale >= 0,
      actionPlan:
        "Installare sistemi di misurazione dei prelievi idrici. Tracciare consumi per fonte (acquedotto, pozzi, superficiali). Report annuale consumi idrici.",
    },
    {
      code: "WATER_CONSUMPTION_REQUIRED",
      severity: "error",
      message: "Misurazione del consumo idrico totale obbligatoria",
      test: (inputs) =>
        inputs.consumo_idrico_totale !== undefined &&
        inputs.consumo_idrico_totale >= 0,
      actionPlan:
        "Calcolare consumo idrico: prelievo - scarichi. Identificare perdite nel ciclo idrico. Implementare contatori per misurazioni accurate.",
    },
    {
      code: "DISCHARGE_QUALITY_COMPLIANCE",
      severity: "error",
      message: "Conformità qualità scarichi obbligatoria (D.Lgs 152/2006)",
      test: (inputs) => inputs.qualita_scarichi_conforme === true,
      actionPlan:
        "Effettuare analisi periodiche qualità scarichi (BOD, COD, metalli pesanti, sostanze pericolose). Verificare conformità limiti tabellari D.Lgs 152/2006. Ottenere autorizzazioni.",
    },
    {
      code: "DISCHARGE_MEASUREMENT_REQUIRED",
      severity: "error",
      message: "Misurazione degli scarichi idrici obbligatoria",
      test: (inputs) =>
        inputs.scarichi_idrici_totali !== undefined &&
        inputs.scarichi_idrici_totali >= 0,
      actionPlan:
        "Misurare volumi di scarico. Distinguere per destinazione (acque superficiali, fognatura, mare). Tracciare trattamenti pre-scarico.",
    },
    {
      code: "WATER_STRESS_MONITORING",
      severity: "warning",
      message: "Monitoraggio prelievi in aree a stress idrico raccomandato",
      test: (inputs) => {
        if (!inputs.prelievo_aree_stress_idrico) return false;
        if (!inputs.prelievo_idrico_totale || inputs.prelievo_idrico_totale === 0)
          return true;
        const percentuale =
          (inputs.prelievo_aree_stress_idrico / inputs.prelievo_idrico_totale) * 100;
        return percentuale <= 20;
      },
      actionPlan:
        "Mappare siti in aree a stress idrico con WRI Aqueduct. Se >20% prelievi in aree critiche, implementare piani riduzione. Target: minimizzare prelievi in zone HIGH water stress.",
    },
    {
      code: "WATER_RECYCLING_RECOMMENDED",
      severity: "warning",
      message: "Riutilizzo acqua raccomandato per ridurre prelievi",
      test: (inputs) => {
        if (!inputs.percentuale_riutilizzo) return false;
        return inputs.percentuale_riutilizzo >= 10;
      },
      actionPlan:
        "Implementare sistemi di riciclo/riutilizzo acqua (es. circuiti chiusi, recupero acque piovane, acque grigie per usi non potabili). Target: riutilizzo ≥10% del prelievo totale.",
    },
    {
      code: "WATER_INTENSITY_TRACKING",
      severity: "info",
      message: "Tracciamento intensità idrica raccomandato per efficienza",
      test: (inputs) =>
        inputs.intensita_idrica !== undefined && inputs.intensita_idrica > 0,
      actionPlan:
        "Calcolare intensità idrica: consumo acqua / fatturato o produzione. Monitorare trend annuale. Benchmark con media settore. Definire target riduzione intensità.",
    },
  ],
  requiredEvidences: [
    "Report consumi idrici annuali",
    "Fatture acquedotto / registri prelievo pozzi",
    "Analisi qualità scarichi idrici",
    "Mappatura aree stress idrico (WRI Aqueduct)",
    "Progetti di riutilizzo/riciclo acqua (se applicabile)",
  ],
};

export default E3002;
