/**
 * Sistema di integrazione dati tra Checklist, Materialità ed Export
 * Crea un flusso automatico: KPI → Scoring Materialità → Report ESRS
 */

/**
 * Mappatura tra KPI della Checklist e Temi di Materialità
 */
export const KPI_TO_MATERIALITY_MAPPING = {
  // Ambiente - Cambiamenti Climatici (E1)
  emissioni_co2: {
    theme: "Ambiente",
    aspect: "AM3",
    weight: 0.8,
    calculateScore: (value, benchmark) => {
      // Più emissioni = più impatto negativo = score alto
      const ratio = value / benchmark;
      return Math.min(5, Math.max(1, Math.round(ratio * 3)));
    },
  },
  energia_rinnovabile: {
    theme: "Ambiente",
    aspect: "AM2",
    weight: 0.6,
    calculateScore: (value) => {
      // % energia rinnovabile: più alta = impatto positivo
      if (value >= 80) return 2;
      if (value >= 50) return 3;
      if (value >= 20) return 4;
      return 5;
    },
  },
  consumo_acqua: {
    theme: "Ambiente",
    aspect: "AM2",
    weight: 0.5,
    calculateScore: (value, benchmark) => {
      const ratio = value / benchmark;
      return Math.min(5, Math.max(1, Math.round(ratio * 2)));
    },
  },

  // Sociale - Lavoratori (S1)
  ore_formazione: {
    theme: "Pratiche del Lavoro",
    aspect: "LA5",
    weight: 0.7,
    calculateScore: (value) => {
      // Più formazione = impatto positivo
      if (value >= 40) return 2; // Alto impatto positivo
      if (value >= 20) return 3;
      if (value >= 10) return 4;
      return 5; // Basso impatto
    },
  },
  infortuni_lavoro: {
    theme: "Pratiche del Lavoro",
    aspect: "LA4",
    weight: 0.9,
    calculateScore: (value) => {
      // Più infortuni = impatto negativo alto
      if (value === 0) return 1;
      if (value <= 2) return 2;
      if (value <= 5) return 3;
      return 5;
    },
  },
  parita_genere: {
    theme: "Diritti Umani",
    aspect: "DU2",
    weight: 0.8,
    calculateScore: (ratio) => {
      // Ratio donne/uomini: vicino a 50/50 = bene
      const deviation = Math.abs(ratio - 50);
      if (deviation <= 10) return 2;
      if (deviation <= 20) return 3;
      if (deviation <= 30) return 4;
      return 5;
    },
  },

  // Governance (G1)
  politiche_anticorruzione: {
    theme: "Corrette Prassi Gestionali",
    aspect: "CP1",
    weight: 0.9,
    calculateScore: (hasPolicy) => (hasPolicy ? 2 : 5),
  },
  trasparenza_supply_chain: {
    theme: "Corrette Prassi Gestionali",
    aspect: "CP3",
    weight: 0.7,
    calculateScore: (percentage) => {
      if (percentage >= 90) return 2;
      if (percentage >= 70) return 3;
      if (percentage >= 50) return 4;
      return 5;
    },
  },

  // Consumatori (S4)
  reclami_clienti: {
    theme: "Aspetti relativi ai Consumatori",
    aspect: "CO4",
    weight: 0.6,
    calculateScore: (value, totalClients) => {
      const ratio = (value / totalClients) * 100;
      if (ratio < 1) return 2;
      if (ratio < 3) return 3;
      if (ratio < 5) return 4;
      return 5;
    },
  },

  // Comunità (S3)
  investimenti_comunita: {
    theme: "Coinvolgimento e Sviluppo della Comunità",
    aspect: "SC4",
    weight: 0.7,
    calculateScore: (amount, revenue) => {
      const percentage = (amount / revenue) * 100;
      if (percentage >= 2) return 2;
      if (percentage >= 1) return 3;
      if (percentage >= 0.5) return 4;
      return 5;
    },
  },
};

/**
 * Calcola scoring materialità automatico dai KPI della checklist
 * @param {Object} audit - Audit con dati KPI
 * @returns {Object} - Score per ogni tema di materialità
 */
export function calculateMaterialityFromKPI(audit) {
  if (!audit || !audit.kpiInputs) {
    console.warn("⚠️ Nessun dato KPI disponibile per calcolo materialità");
    return {};
  }

  const materialityScores = {};
  const kpiData = audit.kpiInputs || {};

  console.log(
    "🔄 Calcolo materialità da KPI:",
    Object.keys(kpiData).length,
    "KPI trovati"
  );

  // Per ogni KPI nella checklist, calcola il suo impatto sulla materialità
  Object.entries(KPI_TO_MATERIALITY_MAPPING).forEach(([kpiKey, mapping]) => {
    const kpiValue = kpiData[kpiKey];

    if (kpiValue === undefined || kpiValue === null || kpiValue === "") {
      return; // Salta KPI non compilati
    }

    const { theme, aspect, weight, calculateScore } = mapping;

    // Calcola score per questo KPI
    let score;
    try {
      score = calculateScore(kpiValue);
    } catch (error) {
      console.error(`❌ Errore calcolo score per ${kpiKey}:`, error);
      return;
    }

    // Inizializza struttura tema se non esiste
    if (!materialityScores[theme]) {
      materialityScores[theme] = {
        insideOutScores: [],
        outsideInScores: [],
        aspects: {},
        kpiCount: 0,
      };
    }

    // Aggiungi score ponderato
    materialityScores[theme].insideOutScores.push(score * weight);
    materialityScores[theme].outsideInScores.push(score * weight * 0.8); // Finanziario leggermente inferiore
    materialityScores[theme].kpiCount++;

    // Track aspetto specifico
    if (!materialityScores[theme].aspects[aspect]) {
      materialityScores[theme].aspects[aspect] = [];
    }
    materialityScores[theme].aspects[aspect].push({
      kpi: kpiKey,
      value: kpiValue,
      score,
      weight,
    });

    console.log(
      `✅ KPI "${kpiKey}" → Tema "${theme}" (${aspect}): score ${score}, peso ${weight}`
    );
  });

  // Calcola medie per ogni tema
  const finalScores = {};
  Object.entries(materialityScores).forEach(([theme, data]) => {
    const avgInsideOut =
      data.insideOutScores.reduce((a, b) => a + b, 0) /
      data.insideOutScores.length;
    const avgOutsideIn =
      data.outsideInScores.reduce((a, b) => a + b, 0) /
      data.outsideInScores.length;

    finalScores[theme] = {
      insideOutScore: Math.round(avgInsideOut * 10) / 10,
      outsideInScore: Math.round(avgOutsideIn * 10) / 10,
      kpiCount: data.kpiCount,
      aspects: data.aspects,
      calculatedAt: new Date().toISOString(),
      source: "kpi_automatic",
    };
  });

  console.log(
    "📊 Materialità calcolata per",
    Object.keys(finalScores).length,
    "temi"
  );
  return finalScores;
}

/**
 * Sincronizza automaticamente i dati tra Checklist e Materialità
 * @param {Object} audit - Audit corrente
 * @param {Array} materialityTopics - Topic della matrice di materialità
 * @param {Function} updateTopicCallback - Callback per aggiornare un topic
 * @returns {Object} - Risultato sincronizzazione
 */
export function syncChecklistToMateriality(
  audit,
  materialityTopics,
  updateTopicCallback
) {
  const kpiScores = calculateMaterialityFromKPI(audit);
  let updated = 0;
  let skipped = 0;
  const changes = [];

  Object.entries(kpiScores).forEach(([themeName, scores]) => {
    // Trova il topic corrispondente nella matrice
    const topic = materialityTopics.find(
      (t) => t.name === themeName || t.title === themeName || t.id === themeName
    );

    if (!topic) {
      console.warn(
        `⚠️ Tema "${themeName}" non trovato nella matrice di materialità`
      );
      skipped++;
      return;
    }

    // Aggiorna solo se ci sono cambiamenti significativi (> 0.3 punti)
    const insideOutDiff = Math.abs(
      (topic.insideOutScore || 0) - scores.insideOutScore
    );
    const outsideInDiff = Math.abs(
      (topic.outsideInScore || 0) - scores.outsideInScore
    );

    if (insideOutDiff > 0.3 || outsideInDiff > 0.3) {
      updateTopicCallback(topic.id, {
        insideOutScore: scores.insideOutScore,
        outsideInScore: scores.outsideInScore,
        kpiSource: true,
        kpiCount: scores.kpiCount,
        lastKpiSync: scores.calculatedAt,
        kpiDetails: scores.aspects,
      });

      changes.push({
        topic: topic.name,
        oldScores: {
          insideOut: topic.insideOutScore || 0,
          outsideIn: topic.outsideInScore || 0,
        },
        newScores: {
          insideOut: scores.insideOutScore,
          outsideIn: scores.outsideInScore,
        },
        kpiCount: scores.kpiCount,
      });

      updated++;
      console.log(
        `🔄 Aggiornato "${topic.name}": Inside-Out ${scores.insideOutScore}, Outside-In ${scores.outsideInScore}`
      );
    } else {
      skipped++;
    }
  });

  return {
    success: true,
    updated,
    skipped,
    total: Object.keys(kpiScores).length,
    changes,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Estrae dati integrati per export ESRS professionale
 * @param {Object} audit - Audit corrente
 * @param {Array} materialityTopics - Topic materialità
 * @returns {Object} - Dati integrati per report
 */
export function prepareIntegratedESRSData(audit, materialityTopics) {
  const kpiScores = calculateMaterialityFromKPI(audit);

  return {
    // Dati aziendali base
    company: {
      name: audit.azienda || "N/A",
      size: audit.dimensione || "N/A",
      revenue: audit.fatturato || 0,
      employees: audit.dipendenti || 0,
      totalAssets: audit.totaleAttivo || 0,
    },

    // KPI operativi dalla Checklist
    operationalKPI: audit.kpiInputs || {},

    // Analisi materialità
    materiality: {
      topics: materialityTopics || [],
      kpiBasedScores: kpiScores,
      materialTopics: (materialityTopics || []).filter(
        (t) => t.insideOutScore >= 3 || t.outsideInScore >= 3
      ),
      totalTopics: (materialityTopics || []).length,
    },

    // Compliance overview
    compliance: {
      checklistCompletion: calculateChecklistCompletion(audit),
      materialityCompletion: calculateMaterialityCompletion(materialityTopics),
      overallScore: calculateOverallComplianceScore(audit, materialityTopics),
    },

    // Metadata
    generated: new Date().toISOString(),
    reportVersion: "1.0",
    esrsVersion: "ESRS 2023",
  };
}

/**
 * Calcola percentuale completamento Checklist
 */
function calculateChecklistCompletion(audit) {
  if (!audit || !audit.kpiInputs) return 0;
  const total = Object.keys(KPI_TO_MATERIALITY_MAPPING).length;
  const completed = Object.entries(audit.kpiInputs).filter(
    ([key, value]) => value !== null && value !== undefined && value !== ""
  ).length;
  return Math.round((completed / total) * 100);
}

/**
 * Calcola percentuale completamento Materialità
 */
function calculateMaterialityCompletion(topics) {
  if (!topics || topics.length === 0) return 0;
  const completed = topics.filter(
    (t) => t.insideOutScore > 0 && t.outsideInScore > 0
  ).length;
  return Math.round((completed / topics.length) * 100);
}

/**
 * Calcola score complessivo di compliance ESRS
 */
function calculateOverallComplianceScore(audit, topics) {
  const checklistScore = calculateChecklistCompletion(audit);
  const materialityScore = calculateMaterialityCompletion(topics);

  // Peso: 40% checklist + 60% materialità
  return Math.round(checklistScore * 0.4 + materialityScore * 0.6);
}

const dataIntegration = {
  calculateMaterialityFromKPI,
  syncChecklistToMateriality,
  prepareIntegratedESRSData,
  KPI_TO_MATERIALITY_MAPPING,
};

export default dataIntegration;
