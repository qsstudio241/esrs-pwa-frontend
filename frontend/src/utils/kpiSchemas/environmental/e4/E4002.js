// E4002 - Impatti e dipendenze dalla biodiversità
const E4002 = {
  kpiCode: "E4002",
  categoryDescription: "E4 - Biodiversità ed ecosistemi",
  title: "Impatti e dipendenze dalla biodiversità",
  fields: [
    {
      key: "superficie_totale_siti",
      label: "Superficie totale dei siti (ettari)",
      type: "number",
      required: true,
      min: 0,
      unit: "ha",
    },
    {
      key: "superficie_aree_protette",
      label: "Superficie in aree protette o ad alta biodiversità (ettari)",
      type: "number",
      required: false,
      min: 0,
      unit: "ha",
    },
    {
      key: "percentuale_aree_sensibili",
      label: "Percentuale superficie in aree sensibili (%)",
      type: "number",
      required: false,
      min: 0,
      max: 100,
      unit: "%",
    },
    {
      key: "superficie_impermeabilizzata",
      label: "Superficie impermeabilizzata (ettari)",
      type: "number",
      required: false,
      min: 0,
      unit: "ha",
    },
    {
      key: "land_use_change",
      label: "Cambiamento uso del suolo negli ultimi 5 anni (ettari)",
      type: "number",
      required: false,
      min: 0,
      unit: "ha",
    },
    {
      key: "specie_protette_minacciate",
      label: "Presenza di specie protette o minacciate (IUCN Red List)",
      type: "bool",
      required: false,
    },
    {
      key: "numero_specie_minacciate",
      label: "Numero di specie minacciate identificate",
      type: "number",
      required: false,
      min: 0,
    },
    {
      key: "dipendenza_servizi_ecosistemici",
      label: "Dipendenza da servizi ecosistemici valutata",
      type: "bool",
      required: false,
    },
    {
      key: "tipo_servizi_ecosistemici",
      label: "Tipo di servizi ecosistemici da cui dipende l'attività",
      type: "enum",
      required: false,
      enum: [
        "Nessuna dipendenza significativa",
        "Risorse idriche",
        "Impollinazione",
        "Regolazione clima",
        "Protezione suolo",
        "Multipli",
      ],
    },
    {
      key: "azioni_ripristino_completate",
      label: "Azioni di ripristino completate (ettari ripristinati)",
      type: "number",
      required: false,
      min: 0,
      unit: "ha",
    },
  ],
  checks: [
    {
      code: "SITE_AREA_REQUIRED",
      severity: "error",
      message: "Misurazione della superficie totale dei siti obbligatoria per ESRS E4",
      test: (inputs) =>
        inputs.superficie_totale_siti !== undefined &&
        inputs.superficie_totale_siti > 0,
      actionPlan:
        "Misurare superficie totale di tutti i siti operativi (stabilimenti, uffici, magazzini, terreni). Usare GIS per mappatura accurata. Report superficie per tipologia.",
    },
    {
      code: "PROTECTED_AREA_THRESHOLD",
      severity: "warning",
      message: "Superficie significativa in aree protette richiede azioni specifiche",
      test: (inputs) => {
        if (!inputs.percentuale_aree_sensibili) return true;
        return inputs.percentuale_aree_sensibili < 10;
      },
      actionPlan:
        "Se >10% superficie in aree protette: implementare piani gestione biodiversità sito-specifici. Ottenere autorizzazioni ambientali. Monitoraggio ecologico periodico. Coinvolgere enti gestori aree protette.",
    },
    {
      code: "THREATENED_SPECIES_MANAGEMENT",
      severity: "warning",
      message: "Presenza di specie minacciate richiede misure di conservazione",
      test: (inputs) => {
        if (!inputs.specie_protette_minacciate) return true;
        return (
          inputs.numero_specie_minacciate !== undefined &&
          inputs.azioni_ripristino_completate > 0
        );
      },
      actionPlan:
        "Per siti con specie IUCN Red List (Critically Endangered, Endangered, Vulnerable): implementare species action plans. Monitorare popolazioni. Creare habitat corridors. Evitare disturbo in periodi critici (riproduzione).",
    },
    {
      code: "LAND_USE_CHANGE_TRACKING",
      severity: "warning",
      message: "Cambiamenti uso del suolo devono essere minimizzati",
      test: (inputs) => {
        if (!inputs.land_use_change) return true;
        if (!inputs.superficie_totale_siti || inputs.superficie_totale_siti === 0)
          return true;
        const percentuale =
          (inputs.land_use_change / inputs.superficie_totale_siti) * 100;
        return percentuale <= 5;
      },
      actionPlan:
        "Minimizzare land use change (<5% superficie totale). Priorità: riutilizzo brownfield vs greenfield. Se inevitabile, compensare con ripristino equivalente. No deforestazione.",
    },
    {
      code: "ECOSYSTEM_SERVICES_ASSESSMENT",
      severity: "info",
      message: "Valutazione dipendenza da servizi ecosistemici raccomandata",
      test: (inputs) => !!inputs.dipendenza_servizi_ecosistemici,
      actionPlan:
        "Valutare dipendenza da servizi ecosistemici con framework ENCORE (UN Environment). Identificare rischi business da degrado ecosistemi. Integrare nella valutazione rischi aziendali.",
    },
    {
      code: "SOIL_IMPERMEABILIZATION",
      severity: "info",
      message: "Riduzione superficie impermeabilizzata raccomandata",
      test: (inputs) => {
        if (!inputs.superficie_impermeabilizzata) return true;
        if (!inputs.superficie_totale_siti || inputs.superficie_totale_siti === 0)
          return true;
        const percentuale =
          (inputs.superficie_impermeabilizzata / inputs.superficie_totale_siti) *
          100;
        return percentuale <= 50;
      },
      actionPlan:
        "Ridurre impermeabilizzazione suolo: pavimentazioni drenanti, tetti verdi, rain gardens. Target: <50% superficie impermeabilizzata. Benefici: gestione acque piovane, isola calore urbano, biodiversità.",
    },
    {
      code: "RESTORATION_ACTIONS",
      severity: "info",
      message: "Azioni di ripristino ecosistemi raccomandate",
      test: (inputs) =>
        inputs.azioni_ripristino_completate !== undefined &&
        inputs.azioni_ripristino_completate > 0,
      actionPlan:
        "Implementare azioni ripristino: rinaturalizzazione aree dismesse, piantumazione alberi nativi, creazione zone umide, rimozione specie invasive. Monitorare con indicatori ecologici (es. indice biodiversità).",
    },
  ],
  requiredEvidences: [
    "Mappatura GIS siti aziendali",
    "Sovrapposizione con aree protette (Protected Planet, Natura 2000)",
    "Survey specie IUCN Red List nei siti",
    "Valutazione dipendenza servizi ecosistemici (ENCORE)",
    "Report progetti ripristino (ettari, specie ripristinate)",
  ],
};

export default E4002;
