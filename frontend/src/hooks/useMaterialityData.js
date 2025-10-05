import { useState, useEffect } from "react";

/**
 * Hook per gestire i dati della matrice di materialità
 * Gestisce topics, scoring, persistenza e analisi
 */
export function useMaterialityData(auditId) {
  const [topics, setTopics] = useState([]);
  const [threshold, setThreshold] = useState(3);
  const [isLoading, setIsLoading] = useState(true);

  // Carica dati salvati per l'audit
  useEffect(() => {
    if (!auditId) return;

    try {
      const saved = localStorage.getItem(`materiality_${auditId}`);
      if (saved) {
        const data = JSON.parse(saved);
        setTopics(data.topics || []);
        setThreshold(data.threshold || 3);
      } else {
        // Inizializza con topics di default ESRS
        setTopics(getDefaultESRSTopics());
      }
    } catch (error) {
      console.error("Errore caricamento dati materialità:", error);
      setTopics(getDefaultESRSTopics());
    }
    setIsLoading(false);
  }, [auditId]);

  // Salva automaticamente i cambiamenti
  useEffect(() => {
    if (auditId && !isLoading) {
      const data = { topics, threshold, lastUpdated: new Date().toISOString() };
      localStorage.setItem(`materiality_${auditId}`, JSON.stringify(data));
    }
  }, [topics, threshold, auditId, isLoading]);

  // Aggiorna posizione/scoring di un topic
  const updateTopic = (topicId, updates) => {
    setTopics((prev) =>
      prev.map((topic) =>
        topic.id === topicId ? { ...topic, ...updates } : topic
      )
    );
  };

  // Aggiunge nuovo topic personalizzato
  const addCustomTopic = (name, category = "Custom", description = "") => {
    const newTopic = {
      id: `custom_${Date.now()}`,
      name,
      category,
      description,
      impactScore: 3,
      financialScore: 3,
      isCustom: true,
      stakeholderRelevance: "Medium",
      regulatoryRequirement: false,
    };
    setTopics((prev) => [...prev, newTopic]);
    return newTopic.id;
  };

  // Rimuove topic (solo custom)
  const removeTopic = (topicId) => {
    setTopics((prev) =>
      prev.filter((topic) => topic.id !== topicId && !topic.isCustom)
    );
  };

  // Analisi materialità per categoria
  const getMaterialityAnalysis = () => {
    const materialTopics = topics.filter(
      (t) => t.impactScore >= threshold || t.financialScore >= threshold
    );

    const byCategory = topics.reduce((acc, topic) => {
      if (!acc[topic.category]) {
        acc[topic.category] = { total: 0, material: 0, topics: [] };
      }
      acc[topic.category].total++;
      acc[topic.category].topics.push(topic);

      if (topic.impactScore >= threshold || topic.financialScore >= threshold) {
        acc[topic.category].material++;
      }
      return acc;
    }, {});

    return {
      totalTopics: topics.length,
      materialTopics: materialTopics.length,
      materialityRate:
        topics.length > 0 ? (materialTopics.length / topics.length) * 100 : 0,
      byCategory,
      criticalTopics: topics.filter(
        (t) => t.impactScore >= threshold && t.financialScore >= threshold
      ),
      topImpact: topics
        .sort((a, b) => b.impactScore - a.impactScore)
        .slice(0, 5),
      topFinancial: topics
        .sort((a, b) => b.financialScore - a.financialScore)
        .slice(0, 5),
    };
  };

  // Reset ai valori di default
  const resetToDefault = () => {
    setTopics(getDefaultESRSTopics());
    setThreshold(3);
  };

  // Export dati per report
  const exportMaterialityData = () => {
    const analysis = getMaterialityAnalysis();
    return {
      metadata: {
        auditId,
        timestamp: new Date().toISOString(),
        threshold,
        totalTopics: topics.length,
      },
      topics: topics.map((topic) => ({
        ...topic,
        isMaterial:
          topic.impactScore >= threshold || topic.financialScore >= threshold,
        quadrant: getQuadrant(topic, threshold),
      })),
      analysis,
    };
  };

  return {
    topics,
    threshold,
    isLoading,
    updateTopic,
    addCustomTopic,
    removeTopic,
    setThreshold,
    getMaterialityAnalysis,
    resetToDefault,
    exportMaterialityData,
  };
}

// Determina quadrante di un topic
function getQuadrant(topic, threshold) {
  if (topic.impactScore >= threshold && topic.financialScore >= threshold) {
    return "Q1_HIGH_MATERIALITY";
  } else if (
    topic.impactScore >= threshold &&
    topic.financialScore < threshold
  ) {
    return "Q2_IMPACT_FOCUS";
  } else if (
    topic.impactScore < threshold &&
    topic.financialScore < threshold
  ) {
    return "Q3_LOW_MATERIALITY";
  } else {
    return "Q4_FINANCIAL_FOCUS";
  }
}

// Topics di default basati su standard ESRS
function getDefaultESRSTopics() {
  return [
    // Ambientali (E)
    {
      id: "e1_climate",
      name: "Cambiamenti Climatici",
      category: "Ambientale",
      description:
        "Emissioni GHG, transizione energetica, adattamento climatico",
      impactScore: 4,
      financialScore: 4,
      insideOutScore: 4, // Impatto dell'azienda sull'ambiente
      outsideInScore: 4, // Rischi climatici per l'azienda
      stakeholderRelevance: "High",
      regulatoryRequirement: true,
      esrsReference: "ESRS E1",
    },
    {
      id: "e2_pollution",
      name: "Inquinamento",
      category: "Ambientale",
      description: "Inquinamento aria, acqua, suolo e sostanze chimiche",
      impactScore: 3,
      financialScore: 3,
      stakeholderRelevance: "Medium",
      regulatoryRequirement: true,
      esrsReference: "ESRS E2",
    },
    {
      id: "e3_water",
      name: "Risorse Idriche",
      category: "Ambientale",
      description: "Gestione sostenibile acqua e risorse marine",
      impactScore: 3,
      financialScore: 2,
      stakeholderRelevance: "Medium",
      regulatoryRequirement: true,
      esrsReference: "ESRS E3",
    },
    {
      id: "e4_biodiversity",
      name: "Biodiversità ed Ecosistemi",
      category: "Ambientale",
      description: "Impatti su biodiversità, deforestazione, ecosistemi",
      impactScore: 2,
      financialScore: 2,
      stakeholderRelevance: "Medium",
      regulatoryRequirement: false,
      esrsReference: "ESRS E4",
    },
    {
      id: "e5_circular",
      name: "Economia Circolare",
      category: "Ambientale",
      description: "Uso risorse, rifiuti, economia circolare",
      impactScore: 3,
      financialScore: 3,
      stakeholderRelevance: "Medium",
      regulatoryRequirement: true,
      esrsReference: "ESRS E5",
    },

    // Sociali (S)
    {
      id: "s1_workforce",
      name: "Forza Lavoro Propria",
      category: "Sociale",
      description: "Condizioni lavoro, diversità, formazione dipendenti",
      impactScore: 4,
      financialScore: 3,
      stakeholderRelevance: "High",
      regulatoryRequirement: true,
      esrsReference: "ESRS S1",
    },
    {
      id: "s2_valuechain",
      name: "Lavoratori Catena del Valore",
      category: "Sociale",
      description: "Diritti lavoratori nella supply chain",
      impactScore: 3,
      financialScore: 3,
      stakeholderRelevance: "Medium",
      regulatoryRequirement: true,
      esrsReference: "ESRS S2",
    },
    {
      id: "s3_communities",
      name: "Comunità Interessate",
      category: "Sociale",
      description: "Impatti su comunità locali e stakeholder",
      impactScore: 3,
      financialScore: 2,
      stakeholderRelevance: "Medium",
      regulatoryRequirement: true,
      esrsReference: "ESRS S3",
    },
    {
      id: "s4_consumers",
      name: "Consumatori e Utilizzatori",
      category: "Sociale",
      description: "Sicurezza prodotti, privacy, accessibilità",
      impactScore: 3,
      financialScore: 4,
      stakeholderRelevance: "High",
      regulatoryRequirement: true,
      esrsReference: "ESRS S4",
    },

    // Governance (G)
    {
      id: "g1_conduct",
      name: "Condotta Aziendale",
      category: "Governance",
      description: "Etica, anticorruzione, compliance normativa",
      impactScore: 4,
      financialScore: 4,
      stakeholderRelevance: "High",
      regulatoryRequirement: true,
      esrsReference: "ESRS G1",
    },
  ];
}

export default useMaterialityData;
