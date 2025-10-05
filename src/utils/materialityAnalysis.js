/**
 * Utility per analisi di materialità secondo PDR 134:2022
 * Implementa algoritmi per valutazione inside-out e outside-in
 */

// Pesi per calcolo score composito di impatto
const IMPACT_WEIGHTS = {
  severity: 0.4, // Gravità dell'impatto
  scope: 0.3, // Ampiezza/scala dell'impatto
  likelihood: 0.2, // Probabilità di occorrenza
  irreversibility: 0.1, // Irreversibilità dell'impatto
};

// Pesi per calcolo score finanziario
const FINANCIAL_WEIGHTS = {
  magnitude: 0.4, // Entità finanziaria
  probability: 0.3, // Probabilità realizzazione
  timeHorizon: 0.2, // Orizzonte temporale
  adaptability: 0.1, // Capacità di adattamento
};

/**
 * Calcola score di impatto (inside-out) composito
 */
export function calculateImpactScore(assessments) {
  const {
    severity = 3,
    scope = 3,
    likelihood = 3,
    irreversibility = 3,
  } = assessments;

  return Math.round(
    severity * IMPACT_WEIGHTS.severity +
      scope * IMPACT_WEIGHTS.scope +
      likelihood * IMPACT_WEIGHTS.likelihood +
      irreversibility * IMPACT_WEIGHTS.irreversibility
  );
}

/**
 * Calcola score finanziario (outside-in) composito
 */
export function calculateFinancialScore(assessments) {
  const {
    magnitude = 3,
    probability = 3,
    timeHorizon = 3,
    adaptability = 3,
  } = assessments;

  return Math.round(
    magnitude * FINANCIAL_WEIGHTS.magnitude +
      probability * FINANCIAL_WEIGHTS.probability +
      timeHorizon * FINANCIAL_WEIGHTS.timeHorizon +
      (5 - adaptability + 1) * FINANCIAL_WEIGHTS.adaptability // Inverti adaptability
  );
}

/**
 * Analizza priorità di rendicontazione basata su posizione matrice
 */
export function analyzeMaterialityPriority(topics, threshold = 3) {
  const analysis = {
    critical: [], // Quadrante 1: Alta materialità
    impactFocus: [], // Quadrante 2: Alto impatto, basso rischio finanziario
    financialFocus: [], // Quadrante 4: Basso impatto, alto rischio finanziario
    monitoring: [], // Quadrante 3: Bassa materialità, monitoraggio
    recommendations: [],
  };

  topics.forEach((topic) => {
    const { impactScore, financialScore } = topic;

    if (impactScore >= threshold && financialScore >= threshold) {
      analysis.critical.push({
        ...topic,
        priority: "CRITICAL",
        action: "Rendicontazione obbligatoria dettagliata",
        reportingLevel: "FULL_DISCLOSURE",
      });
    } else if (impactScore >= threshold && financialScore < threshold) {
      analysis.impactFocus.push({
        ...topic,
        priority: "HIGH",
        action: "Focus su gestione impatti socio-ambientali",
        reportingLevel: "IMPACT_FOCUSED",
      });
    } else if (impactScore < threshold && financialScore >= threshold) {
      analysis.financialFocus.push({
        ...topic,
        priority: "MEDIUM",
        action: "Analisi rischi/opportunità finanziarie",
        reportingLevel: "RISK_FOCUSED",
      });
    } else {
      analysis.monitoring.push({
        ...topic,
        priority: "LOW",
        action: "Monitoraggio periodico",
        reportingLevel: "BASIC_MONITORING",
      });
    }
  });

  // Genera raccomandazioni
  analysis.recommendations = generateRecommendations(analysis);

  return analysis;
}

/**
 * Genera raccomandazioni strategiche basate sull'analisi
 */
function generateRecommendations(analysis) {
  const recommendations = [];

  // Raccomandazioni per temi critici
  if (analysis.critical.length > 0) {
    recommendations.push({
      type: "CRITICAL_MANAGEMENT",
      title: "Gestione Temi ad Alta Materialità",
      description: `Sono stati identificati ${analysis.critical.length} temi critici che richiedono rendicontazione ESRS completa`,
      actions: [
        "Sviluppare politiche e strategie specifiche",
        "Definire obiettivi quantitativi e target temporali",
        "Implementare sistemi di monitoraggio KPI",
        "Coinvolgere stakeholder nella governance",
      ],
      priority: "IMMEDIATE",
    });
  }

  // Raccomandazioni per bilanciamento portfolio
  const totalMaterial =
    analysis.critical.length +
    analysis.impactFocus.length +
    analysis.financialFocus.length;
  const totalTopics = totalMaterial + analysis.monitoring.length;
  const materialityRate = (totalMaterial / totalTopics) * 100;

  if (materialityRate > 70) {
    recommendations.push({
      type: "PORTFOLIO_FOCUS",
      title: "Focalizzazione Strategica Necessaria",
      description: `${materialityRate.toFixed(
        0
      )}% dei temi risulta materiale. Considerare prioritizzazione.`,
      actions: [
        "Rivedere criteri di valutazione materialità",
        "Concentrare risorse sui temi più critici",
        "Sviluppare roadmap implementazione graduale",
      ],
      priority: "HIGH",
    });
  } else if (materialityRate < 30) {
    recommendations.push({
      type: "SCOPE_EXPANSION",
      title: "Possibile Sottovalutazione Impatti",
      description: `Solo ${materialityRate.toFixed(
        0
      )}% dei temi risulta materiale. Verificare completezza analisi.`,
      actions: [
        "Coinvolgere più stakeholder nella valutazione",
        "Rivedere metodologia di scoring",
        "Analizzare benchmark settoriali",
      ],
      priority: "MEDIUM",
    });
  }

  // Raccomandazioni per stakeholder engagement
  const highStakeholderTopics = Object.values(analysis)
    .flat()
    .filter((t) => t.stakeholderRelevance === "High").length;

  if (highStakeholderTopics > 0) {
    recommendations.push({
      type: "STAKEHOLDER_ENGAGEMENT",
      title: "Engagement Stakeholder Prioritario",
      description: `${highStakeholderTopics} temi richiedono alto coinvolgimento stakeholder`,
      actions: [
        "Organizzare workshop con stakeholder chiave",
        "Implementare survey di materialità",
        "Istituire tavoli di dialogo periodici",
        "Pubblicare risultati analisi materialità",
      ],
      priority: "HIGH",
    });
  }

  return recommendations;
}

/**
 * Valida completezza assessment materialità
 */
export function validateMaterialityAssessment(topics, threshold) {
  const issues = [];

  // Verifica topics minimi ESRS
  const requiredESRSCategories = ["E1", "S1", "G1"]; // Minimi obbligatori
  const presentCategories = new Set(
    topics
      .filter((t) => t.esrsReference)
      .map((t) => t.esrsReference.replace("ESRS ", ""))
  );

  requiredESRSCategories.forEach((cat) => {
    if (!presentCategories.has(cat)) {
      issues.push({
        type: "MISSING_ESRS_CATEGORY",
        severity: "ERROR",
        message: `Categoria ESRS ${cat} mancante - obbligatoria per compliance`,
        category: cat,
      });
    }
  });

  // Verifica temi sopra soglia abbiano assessment completo
  const materialTopics = topics.filter(
    (t) => t.impactScore >= threshold || t.financialScore >= threshold
  );

  materialTopics.forEach((topic) => {
    if (!topic.stakeholderRelevance) {
      issues.push({
        type: "MISSING_STAKEHOLDER_ASSESSMENT",
        severity: "WARNING",
        message: `Tema '${topic.name}' materiale ma senza valutazione stakeholder`,
        topicId: topic.id,
      });
    }
  });

  // Verifica distribuzione score (evitare clustering eccessivo)
  const scoreDistribution = topics.reduce((acc, topic) => {
    const key = `${topic.impactScore}-${topic.financialScore}`;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const maxCluster = Math.max(...Object.values(scoreDistribution));
  if (maxCluster > topics.length * 0.4) {
    issues.push({
      type: "SCORE_CLUSTERING",
      severity: "WARNING",
      message: `Troppi temi concentrati nello stesso score - verificare differenziazione`,
      clusterSize: maxCluster,
    });
  }

  return {
    isValid: issues.filter((i) => i.severity === "ERROR").length === 0,
    issues,
    completeness: Math.max(0, 100 - issues.length * 10),
  };
}

/**
 * Export dati per integrazione con report ESRS
 */
export function exportForESRSReporting(materialityData, auditInfo) {
  const { topics, threshold } = materialityData;
  const analysis = analyzeMaterialityPriority(topics, threshold);

  return {
    executiveSummary: {
      totalTopicsAssessed: topics.length,
      materialTopicsCount:
        analysis.critical.length +
        analysis.impactFocus.length +
        analysis.financialFocus.length,
      criticalTopicsCount: analysis.critical.length,
      assessmentDate: new Date().toISOString().split("T")[0],
      methodology: "PDR 134:2022 - Doppia Materialità",
      thresholdUsed: threshold,
    },
    materialTopicsByESRS: groupByESRSStandard(
      analysis.critical.concat(analysis.impactFocus, analysis.financialFocus)
    ),
    priorityMatrix: {
      critical: analysis.critical.map(formatTopicForReport),
      impactFocus: analysis.impactFocus.map(formatTopicForReport),
      financialFocus: analysis.financialFocus.map(formatTopicForReport),
    },
    stakeholderEngagement: {
      methodsUsed: ["Management assessment", "Industry benchmarking"],
      keyStakeholderGroups: extractStakeholderGroups(topics),
      consultationResults:
        "Assessment condotto dal management con riferimento a benchmark settoriali",
    },
    nextSteps: analysis.recommendations.map((r) => ({
      area: r.title,
      actions: r.actions,
      priority: r.priority,
      timeline:
        r.priority === "IMMEDIATE"
          ? "3 mesi"
          : r.priority === "HIGH"
          ? "6 mesi"
          : "12 mesi",
    })),
  };
}

// Helper functions
function groupByESRSStandard(topics) {
  return topics.reduce((acc, topic) => {
    const esrsCode = topic.esrsReference || "Other";
    if (!acc[esrsCode]) acc[esrsCode] = [];
    acc[esrsCode].push(topic);
    return acc;
  }, {});
}

function formatTopicForReport(topic) {
  return {
    name: topic.name,
    category: topic.category,
    impactScore: topic.impactScore,
    financialScore: topic.financialScore,
    reportingRequirement: topic.reportingLevel,
    esrsReference: topic.esrsReference,
    keyActions: topic.action,
  };
}

function extractStakeholderGroups(topics) {
  const groups = new Set();
  topics.forEach((topic) => {
    if (topic.stakeholderRelevance === "High") {
      // Inferisci gruppi stakeholder da categoria topic
      if (topic.category === "Sociale") groups.add("Dipendenti e sindacati");
      if (topic.category === "Ambientale") groups.add("Comunità locali");
      if (topic.category === "Governance")
        groups.add("Investitori e regolatori");
    }
  });

  return Array.from(groups);
}
