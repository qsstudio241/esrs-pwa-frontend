/**
 * Dati di materialità campione basati su bilanci reali (HERA, ENEL, etc.)
 * Per testare la generazione di grafici a dispersione nel report Word
 */

/**
 * Dati HERA Spa - Utilities Multi-servizio
 * Basato su "Bilancio di Sostenibilità 2023 HERA.pdf"
 */
export const heraMaterialityData = {
  companyInfo: {
    name: "HERA Spa",
    sector: "Energy & Utilities",
    employees: 9200,
    revenue: 12500000000, // 12.5 miliardi EUR
    description:
      "Multiutility italiana leader nei servizi ambientali, idrici ed energetici",
  },

  topics: [
    // Quadrante CRITICO (alta rilevanza finanziaria + alto impatto)
    {
      id: "climate-change",
      name: "Transizione Energetica e Cambiamenti Climatici",
      category: "Environmental",
      impactScore: 4.8, // Inside-out: forte impatto emissioni/energia
      financialScore: 4.6, // Outside-in: rischi normativi e opportunità business
      quadrant: "critical",
      description:
        "Decarbonizzazione, fonti rinnovabili, efficienza energetica",
      stakeholderFeedback: {
        priority: 4.7,
        responses: 156,
        sentiment: "Molto critico per futuro sostenibile",
      },
    },

    {
      id: "circular-economy",
      name: "Economia Circolare e Gestione Rifiuti",
      category: "Environmental",
      impactScore: 4.5,
      financialScore: 4.4,
      quadrant: "critical",
      description:
        "Raccolta differenziata, recupero materia ed energia, discariche zero",
      stakeholderFeedback: {
        priority: 4.3,
        responses: 142,
        sentiment: "Fondamentale per modello business HERA",
      },
    },

    {
      id: "water-management",
      name: "Gestione Risorse Idriche",
      category: "Environmental",
      impactScore: 4.6,
      financialScore: 4.2,
      quadrant: "critical",
      description: "Qualità acqua, efficienza reti, depurazione, siccità",
      stakeholderFeedback: {
        priority: 4.5,
        responses: 134,
        sentiment: "Servizio essenziale per comunità",
      },
    },

    // Quadrante FOCUS IMPATTO (alto impatto + media rilevanza finanziaria)
    {
      id: "biodiversity",
      name: "Tutela Biodiversità e Ecosistemi",
      category: "Environmental",
      impactScore: 4.2,
      financialScore: 3.1,
      quadrant: "impact-focus",
      description:
        "Protezione habitat naturali, corridoi ecologici, specie protette",
      stakeholderFeedback: {
        priority: 3.8,
        responses: 98,
        sentiment: "Importante per territorio",
      },
    },

    {
      id: "employee-safety",
      name: "Salute e Sicurezza Lavoratori",
      category: "Social",
      impactScore: 4.3,
      financialScore: 3.2,
      quadrant: "impact-focus",
      description: "Infortuni, malattie professionali, formazione sicurezza",
      stakeholderFeedback: {
        priority: 4.1,
        responses: 187,
        sentiment: "Priorità assoluta per dipendenti",
      },
    },

    // Quadrante RILEVANZA FINANZIARIA (media impatto + alta rilevanza finanziaria)
    {
      id: "digital-innovation",
      name: "Innovazione Digitale e Smart City",
      category: "Governance",
      impactScore: 3.1,
      financialScore: 4.3,
      quadrant: "financial-relevance",
      description:
        "IoT, smart grid, digitalizzazione servizi, efficienza operativa",
      stakeholderFeedback: {
        priority: 3.6,
        responses: 89,
        sentiment: "Opportunità sviluppo futuro",
      },
    },

    {
      id: "regulatory-compliance",
      name: "Compliance Normativa e Governance",
      category: "Governance",
      impactScore: 3.0,
      financialScore: 4.1,
      quadrant: "financial-relevance",
      description: "ESRS, tassonomia EU, trasparenza, anti-corruzione",
      stakeholderFeedback: {
        priority: 3.4,
        responses: 76,
        sentiment: "Necessario per continuità business",
      },
    },

    // Quadrante MONITORAGGIO (media/bassa rilevanza)
    {
      id: "community-engagement",
      name: "Coinvolgimento Comunità Locali",
      category: "Social",
      impactScore: 3.2,
      financialScore: 2.8,
      quadrant: "monitoring",
      description: "Dialogo territorio, sponsorizzazioni, progetti sociali",
      stakeholderFeedback: {
        priority: 3.1,
        responses: 67,
        sentiment: "Apprezzato dalle comunità",
      },
    },

    {
      id: "supply-chain",
      name: "Catena di Fornitura Sostenibile",
      category: "Governance",
      impactScore: 2.9,
      financialScore: 3.0,
      quadrant: "monitoring",
      description:
        "Qualificazione fornitori ESG, approvvigionamento responsabile",
      stakeholderFeedback: {
        priority: 2.8,
        responses: 54,
        sentiment: "Importante per trasparenza",
      },
    },

    {
      id: "customer-satisfaction",
      name: "Soddisfazione e Accessibilità Clienti",
      category: "Social",
      impactScore: 2.7,
      financialScore: 3.3,
      quadrant: "monitoring",
      description: "Quality service, bollette comprensibili, bonus sociali",
      stakeholderFeedback: {
        priority: 3.0,
        responses: 145,
        sentiment: "Servizio migliorabile",
      },
    },
  ],

  metadata: {
    assessmentDate: "2024-12-15",
    methodology: "PDR 134:2022",
    threshold: 3.5,
    stakeholderGroups: [
      "employees",
      "customers",
      "suppliers",
      "communities",
      "investors",
      "regulators",
    ],
    totalResponses: 1148,
    validationStatus: "completed",
  },
};

/**
 * Dati ENEL - Energia Elettrica Multinazionale
 * Basato su "ENEL_relazione-finanziaria-annuale-consolidata_2024.pdf"
 */
export const enelMaterialityData = {
  companyInfo: {
    name: "ENEL SpA",
    sector: "Energy & Utilities",
    employees: 64000,
    revenue: 85700000000, // 85.7 miliardi EUR
    description: "Multinazionale italiana dell'energia elettrica e gas",
  },

  topics: [
    // Quadrante CRITICO
    {
      id: "renewable-transition",
      name: "Transizione alle Rinnovabili",
      category: "Environmental",
      impactScore: 4.9,
      financialScore: 4.8,
      quadrant: "critical",
      description: "Dismissione carbone, eolico, solare, storage",
    },

    {
      id: "grid-resilience",
      name: "Resilienza e Modernizzazione Reti",
      category: "Environmental",
      impactScore: 4.4,
      financialScore: 4.6,
      quadrant: "critical",
      description: "Smart grid, cybersecurity, disaster recovery",
    },

    {
      id: "electrification",
      name: "Elettrificazione Trasporti e Industria",
      category: "Environmental",
      impactScore: 4.3,
      financialScore: 4.5,
      quadrant: "critical",
      description: "Mobilità elettrica, heat pump, industrial electrification",
    },

    // Quadrante FOCUS IMPATTO
    {
      id: "just-transition",
      name: "Transizione Giusta e Occupazione",
      category: "Social",
      impactScore: 4.2,
      financialScore: 3.1,
      quadrant: "impact-focus",
      description: "Riqualificazione lavoratori, nuove competenze green",
    },

    // Quadrante RILEVANZA FINANZIARIA
    {
      id: "market-liberalization",
      name: "Liberalizzazione Mercati Energetici",
      category: "Governance",
      impactScore: 2.8,
      financialScore: 4.4,
      quadrant: "financial-relevance",
      description: "Concorrenza, pricing, regolamentazione",
    },

    // Quadrante MONITORAGGIO
    {
      id: "human-rights",
      name: "Diritti Umani Supply Chain",
      category: "Social",
      impactScore: 3.0,
      financialScore: 2.9,
      quadrant: "monitoring",
      description: "Due diligence, audit fornitori, child labor",
    },
  ],

  metadata: {
    assessmentDate: "2024-11-20",
    methodology: "PDR 134:2022",
    threshold: 3.5,
    stakeholderGroups: [
      "employees",
      "customers",
      "investors",
      "communities",
      "governments",
    ],
    totalResponses: 2340,
    validationStatus: "completed",
  },
};

/**
 * Seleziona dataset di materialità per settore
 */
export function getSampleMaterialityData(sector = "energy") {
  switch (sector.toLowerCase()) {
    case "energy":
    case "utilities":
    case "energy & utilities":
      return heraMaterialityData;

    case "electric":
    case "electricity":
    case "power":
      return enelMaterialityData;

    default:
      return heraMaterialityData; // Default fallback
  }
}

/**
 * Genera configurazione grafico a dispersione per Word
 */
export function generateScatterChartConfig(materialityData) {
  const { topics, metadata } = materialityData;

  // Raggruppa per quadrante con colori
  const quadrantColors = {
    critical: "#DC2626", // Rosso intenso
    "impact-focus": "#EA580C", // Arancione
    "financial-relevance": "#0891B2", // Blu ciano
    monitoring: "#059669", // Verde
  };

  const chartData = {
    title: `Doppia Matrice di Materialità - ${materialityData.companyInfo.name}`,
    subtitle: `Metodologia: ${metadata.methodology} | Soglia: ${metadata.threshold} | Risposte: ${metadata.totalResponses}`,

    // Dati serie per ogni quadrante
    series: Object.keys(quadrantColors).map((quadrant) => ({
      name:
        quadrant === "critical"
          ? "Temi Critici"
          : quadrant === "impact-focus"
          ? "Focus Impatto"
          : quadrant === "financial-relevance"
          ? "Rilevanza Finanziaria"
          : "Monitoraggio",
      color: quadrantColors[quadrant],
      data: topics
        .filter((topic) => topic.quadrant === quadrant)
        .map((topic) => ({
          x: topic.financialScore, // Asse X: Outside-in (rilevanza finanziaria)
          y: topic.impactScore, // Asse Y: Inside-out (impatto)
          name: topic.name,
          category: topic.category,
          description: topic.description,
        })),
    })),

    // Configurazione assi
    xAxis: {
      title: "Rilevanza Finanziaria (Outside-in)",
      min: 0,
      max: 5,
      gridLines: [metadata.threshold], // Linea soglia
      labels: ["Bassa", "", "", "", "Alta"],
    },

    yAxis: {
      title: "Impatto su Sostenibilità (Inside-out)",
      min: 0,
      max: 5,
      gridLines: [metadata.threshold],
      labels: ["Basso", "", "", "", "Alto"],
    },

    // Linee soglia materialità
    thresholdLines: {
      horizontal: metadata.threshold,
      vertical: metadata.threshold,
      color: "#6B7280",
      style: "dashed",
    },

    // Etichette quadranti
    quadrantLabels: [
      { x: 4.2, y: 4.2, text: "CRITICO", color: "#DC2626", bold: true },
      { x: 1.8, y: 4.2, text: "FOCUS IMPATTO", color: "#EA580C", bold: true },
      {
        x: 4.2,
        y: 1.8,
        text: "RILEVANZA FINANZIARIA",
        color: "#0891B2",
        bold: true,
      },
      { x: 1.8, y: 1.8, text: "MONITORAGGIO", color: "#059669", bold: true },
    ],

    // Statistiche per legenda
    stats: {
      totalTopics: topics.length,
      criticalTopics: topics.filter((t) => t.quadrant === "critical").length,
      aboveThreshold: topics.filter(
        (t) =>
          t.impactScore >= metadata.threshold &&
          t.financialScore >= metadata.threshold
      ).length,
      avgImpactScore: (
        topics.reduce((sum, t) => sum + t.impactScore, 0) / topics.length
      ).toFixed(1),
      avgFinancialScore: (
        topics.reduce((sum, t) => sum + t.financialScore, 0) / topics.length
      ).toFixed(1),
    },
  };

  return chartData;
}
