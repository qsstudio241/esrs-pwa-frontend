/**
 * KPI Schemas settoriali per industrie specifiche
 * Supporta standard GRI, SASB e settori industriali comuni
 */

import { findItemId } from "./kpiSchemas";

// Mapping settori industriali
export const INDUSTRY_SECTORS = {
  MANUFACTURING: "Manifatturiero",
  FINANCIAL: "Servizi Finanziari",
  ENERGY: "Energia e Utilities",
  RETAIL: "Retail e Consumer Goods",
  TECHNOLOGY: "Tecnologia e Software",
  HEALTHCARE: "Sanità e Farmaceutico",
  CONSTRUCTION: "Edilizia e Costruzioni",
  TRANSPORT: "Trasporti e Logistica",
  AGRICULTURE: "Agricoltura e Alimentari",
  OTHER: "Altri Settori",
};

/**
 * KPI specifici per settore manifatturiero
 */
export function getKpiSchemasManufacturing() {
  const schemas = {};

  // E1 - Cambiamenti Climatici (Manifatturiero)
  const idEmissions = findItemId("E1", "emissioni") || "e1_emissions";
  if (idEmissions) {
    schemas[idEmissions] = {
      title: "Emissioni GHG Manifatturiero",
      fields: [
        {
          key: "scope1_emissions",
          label: "Emissioni Scope 1 (tCO2eq)",
          type: "number",
          required: true,
          min: 0,
          unit: "tCO2eq",
        },
        {
          key: "scope2_emissions",
          label: "Emissioni Scope 2 (tCO2eq)",
          type: "number",
          required: true,
          min: 0,
          unit: "tCO2eq",
        },
        {
          key: "production_volume",
          label: "Volume produzione (unità)",
          type: "number",
          required: true,
          min: 0,
        },
        {
          key: "emission_intensity",
          label: "Intensità emissioni (tCO2eq/unità)",
          type: "number",
          required: false,
          min: 0,
          unit: "tCO2eq/unità",
        },
        {
          key: "renewable_energy_share",
          label: "% Energia rinnovabile",
          type: "number",
          required: false,
          min: 0,
          max: 100,
          unit: "%",
        },
      ],
      checks: [
        {
          code: "MANUFACTURING_EMISSIONS_INTENSITY",
          message:
            "Calcola intensità emissioni per unità prodotta per benchmark settoriali",
          test: (inputs) => {
            if (
              inputs.production_volume > 0 &&
              inputs.scope1_emissions + inputs.scope2_emissions > 0
            ) {
              const intensity =
                (inputs.scope1_emissions + inputs.scope2_emissions) /
                inputs.production_volume;
              return intensity < 1.0; // Soglia indicativa per manifatturiero
            }
            return true;
          },
        },
      ],
    };
  }

  // E2 - Inquinamento (Manifatturiero)
  const idPollution = findItemId("E2", "inquinamento") || "e2_pollution";
  if (idPollution) {
    schemas[idPollution] = {
      title: "Gestione Inquinamento Industriale",
      fields: [
        {
          key: "air_pollutants",
          label: "Inquinanti atmosferici (kg/anno)",
          type: "number",
          required: true,
          min: 0,
          unit: "kg/anno",
        },
        {
          key: "water_discharge",
          label: "Scarichi idrici (m³/anno)",
          type: "number",
          required: true,
          min: 0,
          unit: "m³",
        },
        {
          key: "hazardous_waste",
          label: "Rifiuti pericolosi (tonnellate/anno)",
          type: "number",
          required: true,
          min: 0,
          unit: "t",
        },
        {
          key: "environmental_permits",
          label: "Permessi ambientali conformi",
          type: "bool",
          required: true,
        },
      ],
    };
  }

  // S1 - Forza Lavoro (Manifatturiero)
  const idWorkforce = findItemId("S1", "forza lavoro") || "s1_workforce";
  if (idWorkforce) {
    schemas[idWorkforce] = {
      title: "Sicurezza e Benessere Lavoratori Industria",
      fields: [
        {
          key: "injury_rate",
          label: "Tasso infortuni (per 100.000 ore)",
          type: "number",
          required: true,
          min: 0,
          unit: "per 100k ore",
        },
        {
          key: "near_miss_incidents",
          label: "Incidenti mancati (numero)",
          type: "number",
          required: false,
          min: 0,
        },
        {
          key: "safety_training_hours",
          label: "Ore formazione sicurezza/dipendente",
          type: "number",
          required: true,
          min: 0,
          unit: "ore",
        },
        {
          key: "ppe_compliance",
          label: "Conformità DPI (%)",
          type: "number",
          required: true,
          min: 0,
          max: 100,
          unit: "%",
        },
      ],
      checks: [
        {
          code: "MANUFACTURING_SAFETY_STANDARDS",
          message:
            "Tasso infortuni deve essere inferiore a media settoriale (2.5 per 100k ore)",
          test: (inputs) => inputs.injury_rate <= 2.5,
        },
      ],
    };
  }

  return schemas;
}

/**
 * KPI specifici per servizi finanziari
 */
export function getKpiSchemasFinancial() {
  const schemas = {};

  // E1 - Climate Risk (Financial)
  const idClimateRisk =
    findItemId("E1", "rischi climatici") || "e1_climate_risk";
  if (idClimateRisk) {
    schemas[idClimateRisk] = {
      title: "Rischi Climatici Portfolio",
      fields: [
        {
          key: "climate_risk_exposure",
          label: "Esposizione rischi climatici (% portfolio)",
          type: "number",
          required: true,
          min: 0,
          max: 100,
          unit: "%",
        },
        {
          key: "green_financing",
          label: "Finanziamenti verdi (€ milioni)",
          type: "number",
          required: false,
          min: 0,
          unit: "€M",
        },
        {
          key: "carbon_intensive_exposure",
          label: "Esposizione settori carbon-intensive (%)",
          type: "number",
          required: true,
          min: 0,
          max: 100,
          unit: "%",
        },
        {
          key: "tcfd_implementation",
          label: "Implementazione TCFD",
          type: "enum",
          enum: ["Non implementata", "Parziale", "Completa"],
          required: true,
        },
      ],
    };
  }

  // G1 - Governance (Financial)
  const idGovernance = findItemId("G1", "governance") || "g1_governance";
  if (idGovernance) {
    schemas[idGovernance] = {
      title: "Governance Finanziaria",
      fields: [
        {
          key: "board_independence",
          label: "% Amministratori indipendenti",
          type: "number",
          required: true,
          min: 0,
          max: 100,
          unit: "%",
        },
        {
          key: "risk_committee_meetings",
          label: "Riunioni comitato rischi/anno",
          type: "number",
          required: true,
          min: 0,
        },
        {
          key: "esg_integration_investment",
          label: "Integrazione ESG in investimenti",
          type: "bool",
          required: true,
        },
        {
          key: "regulatory_fines",
          label: "Sanzioni normative (€)",
          type: "number",
          required: true,
          min: 0,
          unit: "€",
        },
      ],
      checks: [
        {
          code: "FINANCIAL_GOVERNANCE_STANDARDS",
          message:
            "Governance finanziaria deve rispettare standard minimi (>33% indipendenti)",
          test: (inputs) => inputs.board_independence >= 33,
        },
      ],
    };
  }

  return schemas;
}

/**
 * KPI per settore energia e utilities
 */
export function getKpiSchemasEnergy() {
  const schemas = {};

  // E1 - Energy Mix
  const idEnergyMix = findItemId("E1", "mix energetico") || "e1_energy_mix";
  if (idEnergyMix) {
    schemas[idEnergyMix] = {
      title: "Mix Energetico e Transizione",
      fields: [
        {
          key: "renewable_capacity",
          label: "Capacità rinnovabile (MW)",
          type: "number",
          required: true,
          min: 0,
          unit: "MW",
        },
        {
          key: "fossil_capacity",
          label: "Capacità fossile (MW)",
          type: "number",
          required: true,
          min: 0,
          unit: "MW",
        },
        {
          key: "renewable_percentage",
          label: "% Energia rinnovabile",
          type: "number",
          required: true,
          min: 0,
          max: 100,
          unit: "%",
        },
        {
          key: "grid_losses",
          label: "Perdite di rete (%)",
          type: "number",
          required: false,
          min: 0,
          max: 50,
          unit: "%",
        },
        {
          key: "energy_storage",
          label: "Capacità stoccaggio (MWh)",
          type: "number",
          required: false,
          min: 0,
          unit: "MWh",
        },
      ],
      checks: [
        {
          code: "ENERGY_TRANSITION_TARGET",
          message:
            "Quota rinnovabili dovrebbe essere > 50% per allineamento obiettivi UE",
          test: (inputs) => inputs.renewable_percentage >= 50,
        },
      ],
    };
  }

  return schemas;
}

/**
 * KPI per retail e consumer goods
 */
export function getKpiSchemasRetail() {
  const schemas = {};

  // E5 - Economia Circolare (Retail)
  const idCircular = findItemId("E5", "economia circolare") || "e5_circular";
  if (idCircular) {
    schemas[idCircular] = {
      title: "Economia Circolare Retail",
      fields: [
        {
          key: "packaging_recyclable",
          label: "% Packaging riciclabile",
          type: "number",
          required: true,
          min: 0,
          max: 100,
          unit: "%",
        },
        {
          key: "product_returns_rate",
          label: "Tasso resi prodotti (%)",
          type: "number",
          required: true,
          min: 0,
          max: 100,
          unit: "%",
        },
        {
          key: "waste_to_landfill",
          label: "Rifiuti in discarica (%)",
          type: "number",
          required: true,
          min: 0,
          max: 100,
          unit: "%",
        },
        {
          key: "sustainable_products",
          label: "% Prodotti sostenibili nel portfolio",
          type: "number",
          required: false,
          min: 0,
          max: 100,
          unit: "%",
        },
      ],
    };
  }

  // S4 - Consumatori (Retail)
  const idConsumers = findItemId("S4", "consumatori") || "s4_consumers";
  if (idConsumers) {
    schemas[idConsumers] = {
      title: "Sicurezza e Soddisfazione Consumatori",
      fields: [
        {
          key: "product_recalls",
          label: "Richiami prodotti (numero/anno)",
          type: "number",
          required: true,
          min: 0,
        },
        {
          key: "customer_satisfaction",
          label: "Soddisfazione clienti (1-10)",
          type: "number",
          required: true,
          min: 1,
          max: 10,
        },
        {
          key: "data_privacy_incidents",
          label: "Incidenti privacy dati",
          type: "number",
          required: true,
          min: 0,
        },
        {
          key: "accessibility_compliance",
          label: "Conformità accessibilità",
          type: "bool",
          required: true,
        },
      ],
    };
  }

  return schemas;
}

/**
 * Aggregatore che combina tutti i KPI settoriali
 */
export function getSectoralKpiSchemas(sector = "OTHER") {
  const sectorFunctions = {
    [INDUSTRY_SECTORS.MANUFACTURING]: getKpiSchemasManufacturing,
    [INDUSTRY_SECTORS.FINANCIAL]: getKpiSchemasFinancial,
    [INDUSTRY_SECTORS.ENERGY]: getKpiSchemasEnergy,
    [INDUSTRY_SECTORS.RETAIL]: getKpiSchemasRetail,
  };

  const fn = sectorFunctions[sector];
  return fn ? fn() : {};
}

/**
 * Rileva settore da informazioni aziendali
 */
export function detectIndustrySector(auditData) {
  const { azienda = "", descrizione = "", settore = "" } = auditData;
  const text = `${azienda} ${descrizione} ${settore}`.toLowerCase();

  // Pattern matching per rilevamento settore
  if (text.match(/manifatur|produzione|fabbric|industri|meccan|automotive/)) {
    return INDUSTRY_SECTORS.MANUFACTURING;
  }
  if (text.match(/banca|finanz|assicur|credit|investment|fund/)) {
    return INDUSTRY_SECTORS.FINANCIAL;
  }
  if (text.match(/energia|electric|utility|gas|petrolio|rinnovabil/)) {
    return INDUSTRY_SECTORS.ENERGY;
  }
  if (text.match(/retail|commercio|vendita|negozi|consumer|fashion/)) {
    return INDUSTRY_SECTORS.RETAIL;
  }
  if (text.match(/software|tecnolog|IT|digital|internet|tech/)) {
    return INDUSTRY_SECTORS.TECHNOLOGY;
  }
  if (text.match(/sanit|farmac|medical|hospital|clinic/)) {
    return INDUSTRY_SECTORS.HEALTHCARE;
  }
  if (text.match(/ediliz|costruz|immobiliar|cement|infrastructure/)) {
    return INDUSTRY_SECTORS.CONSTRUCTION;
  }
  if (text.match(/trasport|logistic|shipping|aviation|automotive/)) {
    return INDUSTRY_SECTORS.TRANSPORT;
  }
  if (text.match(/agricol|alimentar|food|beverage|agro/)) {
    return INDUSTRY_SECTORS.AGRICULTURE;
  }

  return INDUSTRY_SECTORS.OTHER;
}

/**
 * Suggerimenti KPI basati su settore e dimensione azienda
 */
export function getKpiRecommendations(sector, companySize) {
  const recommendations = [];

  // Raccomandazioni base per tutti i settori
  const baseKpis = [
    {
      category: "E1",
      kpi: "Emissioni GHG",
      priority: "HIGH",
      reason: "Obbligatorio ESRS E1 per tutte le dimensioni",
    },
    {
      category: "S1",
      kpi: "Sicurezza sul lavoro",
      priority: "HIGH",
      reason: "Requisito base per compliance sociale",
    },
    {
      category: "G1",
      kpi: "Governance ESG",
      priority: "MEDIUM",
      reason: "Fondamentale per credibilità reporting",
    },
  ];

  recommendations.push(...baseKpis);

  // Raccomandazioni settoriali
  const sectorSpecific = {
    [INDUSTRY_SECTORS.MANUFACTURING]: [
      {
        category: "E2",
        kpi: "Gestione inquinamento",
        priority: "HIGH",
        reason: "Settore ad alta intensità ambientale",
      },
      {
        category: "S1",
        kpi: "Tasso infortuni",
        priority: "HIGH",
        reason: "Rischio sicurezza elevato in produzione",
      },
    ],
    [INDUSTRY_SECTORS.FINANCIAL]: [
      {
        category: "E1",
        kpi: "Rischi climatici portfolio",
        priority: "HIGH",
        reason: "Requisiti TCFD per settore finanziario",
      },
      {
        category: "G1",
        kpi: "Governance rischi",
        priority: "HIGH",
        reason: "Regolamentazione finanziaria severa",
      },
    ],
    [INDUSTRY_SECTORS.ENERGY]: [
      {
        category: "E1",
        kpi: "Mix energetico",
        priority: "HIGH",
        reason: "Transizione energetica centrale nel settore",
      },
      {
        category: "E1",
        kpi: "Capacità rinnovabile",
        priority: "HIGH",
        reason: "Obiettivi UE 2030 per energie pulite",
      },
    ],
    [INDUSTRY_SECTORS.RETAIL]: [
      {
        category: "E5",
        kpi: "Economia circolare",
        priority: "MEDIUM",
        reason: "Pressione consumatori su sostenibilità",
      },
      {
        category: "S4",
        kpi: "Soddisfazione clienti",
        priority: "HIGH",
        reason: "Business model consumer-centric",
      },
    ],
  };

  if (sectorSpecific[sector]) {
    recommendations.push(...sectorSpecific[sector]);
  }

  // Aggiustamenti per dimensione azienda
  if (companySize === "Grande") {
    recommendations.forEach((rec) => {
      if (rec.priority === "MEDIUM") rec.priority = "HIGH";
    });

    recommendations.push({
      category: "Generale",
      kpi: "Rendicontazione completa",
      priority: "HIGH",
      reason: "Grandi imprese soggette a tutti i requisiti ESRS",
    });
  } else if (companySize === "Micro") {
    recommendations.forEach((rec) => {
      if (rec.priority === "HIGH" && rec.category !== "E1")
        rec.priority = "MEDIUM";
    });
  }

  return recommendations;
}

export default getSectoralKpiSchemas;
