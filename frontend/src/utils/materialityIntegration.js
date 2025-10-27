/**
 * Utilità per integrare risultati questionario ISO 26000 con matrice di materialità
 * Mappa temi strutturati su topic ESRS esistenti
 */

// Mappatura temi ISO 26000 → Topic ESRS (nomi corretti dal questionario)
const ISO_TO_ESRS_MAPPING = {
  // Diritti Umani (DU) - formato: "DU - Diritti Umani"
  "DU - Diritti Umani": "s1_workforce",
  "Diritti Umani": "s1_workforce",

  // Pratiche del Lavoro (LA) - formato: "LA - Pratiche del Lavoro"
  "LA - Pratiche del Lavoro": "s1_workforce",
  "Pratiche del Lavoro": "s1_workforce",

  // Ambiente (AM) - formato: "AM - Ambiente"
  "AM - Ambiente": "e1_climate", // Default ambiente
  Ambiente: "e1_climate",

  // Corrette Prassi Gestionali (CP) - formato: "CP - Corrette Prassi Gestionali"
  "CP - Corrette Prassi Gestionali": "g1_governance",
  "Corrette Prassi Gestionali": "g1_governance",

  // Aspetti Relativi ai Consumatori (CO) - formato: "CO - Aspetti Relativi ai Consumatori"
  "CO - Aspetti Relativi ai Consumatori": "s4_consumers",
  "Aspetti Relativi ai Consumatori": "s4_consumers",

  // Coinvolgimento e Sviluppo della Comunità (SC) - formato: "SC - Coinvolgimento e Sviluppo della Comunità"
  "SC - Coinvolgimento e Sviluppo della Comunità": "s3_communities",
  "Coinvolgimento e Sviluppo della Comunità": "s3_communities",

  // Mappature legacy per compatibilità
  "Diritti Umani - Diritti civili e politici": "s1_workforce",
  "Diritti Umani - Diritti economici, sociali e culturali": "s1_workforce",
  "Diritti Umani - Diritti fondamentali sul lavoro": "s1_workforce",
  "Pratiche del Lavoro - Lavoro e rapporti di lavoro": "s1_workforce",
  "Pratiche del Lavoro - Condizioni di lavoro e protezione sociale":
    "s1_workforce",
  "Pratiche del Lavoro - Dialogo sociale": "s1_workforce",
  "Pratiche del Lavoro - Salute e sicurezza sul lavoro": "s1_workforce",
  "Pratiche del Lavoro - Sviluppo del capitale umano": "s1_workforce",
  "Ambiente - Prevenzione dell'inquinamento": "e2_pollution",
  "Ambiente - Uso sostenibile delle risorse": "e3_water",
  "Ambiente - Mitigazione e adattamento ai cambiamenti climatici": "e1_climate",
  "Ambiente - Protezione dell'ambiente, biodiversità e ripristino degli habitat naturali":
    "e4_biodiversity",
  "Corrette Prassi Gestionali - Lotta alla corruzione": "g1_governance",
  "Corrette Prassi Gestionali - Coinvolgimento politico responsabile":
    "g1_governance",
  "Corrette Prassi Gestionali - Concorrenza leale": "g1_governance",
  "Aspetti Relativi ai Consumatori - Pratiche leali di marketing":
    "s4_consumers",
  "Aspetti Relativi ai Consumatori - Tutela della salute e della sicurezza dei consumatori":
    "s4_consumers",
  "Aspetti Relativi ai Consumatori - Consumo sostenibile": "s4_consumers",
  "Aspetti Relativi ai Consumatori - Servizi di assistenza": "s4_consumers",
  "Aspetti Relativi ai Consumatori - Protezione dei dati e della privacy dei consumatori":
    "s4_consumers",
  "Aspetti Relativi ai Consumatori - Accesso ai servizi essenziali":
    "s4_consumers",
  "Coinvolgimento e Sviluppo della Comunità - Coinvolgimento della comunità":
    "s3_communities",
  "Coinvolgimento e Sviluppo della Comunità - Istruzione e cultura":
    "s3_communities",
  "Coinvolgimento e Sviluppo della Comunità - Creazione di occupazione e competenze":
    "s3_communities",
  "Coinvolgimento e Sviluppo della Comunità - Sviluppo e accesso alla tecnologia":
    "s3_communities",
};

/**
 * Converte risultati questionario ISO 26000 in aggiornamenti per topic matrice
 * @param {Object} questionnaireResults - Risultati del questionario strutturato
 * @param {Array} existingTopics - Topic attuali della matrice
 * @returns {Array} Topic aggiornati con nuovi scoring
 */
export function integrateISO26000Results(questionnaireResults, existingTopics) {
  if (!questionnaireResults?.scoring?.themeScores) {
    console.warn("❌ Nessun themeScores nei risultati questionario");
    return existingTopics;
  }

  const { themeScores } = questionnaireResults.scoring;
  const updatedTopics = [...existingTopics];

  console.log("🔍 DEBUG - Theme scores ricevuti:", themeScores);
  console.log("🔍 DEBUG - Chiavi theme scores:", Object.keys(themeScores));
  console.log(
    "🔍 DEBUG - Mappature disponibili:",
    Object.keys(ISO_TO_ESRS_MAPPING)
  );
  console.log("🔍 DEBUG - Topic esistenti:", existingTopics.map(t => ({ id: t.id, name: t.name })));

  // Per ogni tema ISO 26000 con punteggio
  Object.entries(themeScores).forEach(([themeName, themeData]) => {
    console.log(
      `🔍 Processando tema: "${themeName}" (type: ${typeof themeName}) con score ${themeData.score}`
    );

    let esrsTopicId = ISO_TO_ESRS_MAPPING[themeName];

    // Se non trova mappatura esatta, prova varianti
    if (!esrsTopicId) {
      // Prova solo il codice (es. "DU" da "DU - Diritti Umani")
      const themeCode = themeName.split(" - ")[0];
      const themeSuffix = themeName.split(" - ").slice(1).join(" - ");

      console.log(`🔍 Tentativo mappatura - Code: "${themeCode}", Suffix: "${themeSuffix}"`);

      // Prova con codice + nome
      esrsTopicId = ISO_TO_ESRS_MAPPING[`${themeCode} - ${themeSuffix}`] ||
        ISO_TO_ESRS_MAPPING[themeSuffix] ||
        ISO_TO_ESRS_MAPPING[themeCode];
    }

    // Se non trova mappatura esatta, prova mapping flessibile per keywords
    if (!esrsTopicId) {
      console.log(`🔍 Tentativo mappatura flessibile per "${themeName}"`);

      // Cerca per parole chiave
      if (
        themeName.includes("Diritti Umani") ||
        themeName.includes("Pratiche del Lavoro") ||
        themeName.includes("LA -") ||
        themeName.includes("DU -")
      ) {
        esrsTopicId = "s1_workforce";
      } else if (
        themeName.includes("Ambiente") ||
        themeName.includes("Clima") ||
        themeName.includes("AM -")
      ) {
        if (themeName.includes("inquinamento")) esrsTopicId = "e2_pollution";
        else if (themeName.includes("acqua") || themeName.includes("risorse"))
          esrsTopicId = "e3_water";
        else if (themeName.includes("biodiversità"))
          esrsTopicId = "e4_biodiversity";
        else esrsTopicId = "e1_climate"; // Default ambiente
      } else if (
        themeName.includes("Corrette Prassi") ||
        themeName.includes("Governance") ||
        themeName.includes("CP -")
      ) {
        esrsTopicId = "g1_governance";
      } else if (themeName.includes("Consumatori") || themeName.includes("CO -")) {
        esrsTopicId = "s4_consumers";
      } else if (themeName.includes("Comunità") || themeName.includes("SC -")) {
        esrsTopicId = "s3_communities";
      }

      console.log(
        `🔍 Mappatura flessibile per "${themeName}" → ${esrsTopicId || 'NON TROVATO'}`
      );
    }

    if (esrsTopicId) {
      const topicIndex = updatedTopics.findIndex((t) => t.id === esrsTopicId);

      if (topicIndex !== -1) {
        console.log(
          `✅ Aggiornando topic ${esrsTopicId} con score ${themeData.score}`
        );
        // Aggiorna i punteggi del topic esistente
        updatedTopics[topicIndex] = {
          ...updatedTopics[topicIndex],
          insideOutScore: Math.round(themeData.score), // Punteggio medio ISO convertito
          outsideInScore: Math.round(themeData.score), // Per ora usiamo stesso valore
          isoThemeMapping: themeName, // Traccia mappatura
          lastISOUpdate: new Date().toISOString(),
        };
      } else {
        console.warn(
          `⚠️ Topic ESRS ${esrsTopicId} non trovato nei topic esistenti`
        );
      }
    } else {
      console.warn(`⚠️ Nessuna mappatura trovata per tema: "${themeName}"`);
    }
  });

  // Crea nuovi topic per temi ISO non mappati su ESRS esistenti
  Object.entries(themeScores).forEach(([themeName, themeData]) => {
    if (!ISO_TO_ESRS_MAPPING[themeName]) {
      // Crea nuovo topic custom basato su tema ISO
      const newTopic = {
        id: `iso_${themeName.toLowerCase().replace(/[^a-z0-9]/g, "_")}`,
        name: themeName,
        category: getCategoryFromTheme(themeName),
        description: `Tema ISO 26000: ${themeName}`,
        insideOutScore: Math.round(themeData.score),
        outsideInScore: Math.round(themeData.score),
        stakeholderRelevance: themeData.priority,
        regulatoryRequirement: false,
        esrsReference: "ISO 26000",
        isCustomISO: true,
        isoThemeMapping: themeName,
        lastISOUpdate: new Date().toISOString(),
      };

      // Aggiungi solo se non esiste già
      if (!updatedTopics.find((t) => t.isoThemeMapping === themeName)) {
        updatedTopics.push(newTopic);
      }
    }
  });

  return updatedTopics;
}

/**
 * Determina categoria ESRS da tema ISO 26000
 */
function getCategoryFromTheme(themeName) {
  if (themeName.startsWith("Ambiente")) return "Ambientale";
  if (
    themeName.includes("Diritti Umani") ||
    themeName.includes("Pratiche del Lavoro")
  )
    return "Sociale";
  if (themeName.includes("Corrette Prassi")) return "Governance";
  if (themeName.includes("Consumatori")) return "Sociale";
  if (themeName.includes("Comunità")) return "Sociale";
  return "Custom";
}

/**
 * Genera mapping inverso ESRS → ISO per visualizzazione
 */
export function getESRSToISOMapping() {
  const reverseMapping = {};
  Object.entries(ISO_TO_ESRS_MAPPING).forEach(([isoTheme, esrsId]) => {
    if (!reverseMapping[esrsId]) {
      reverseMapping[esrsId] = [];
    }
    reverseMapping[esrsId].push(isoTheme);
  });
  return reverseMapping;
}

/**
 * Calcola statistiche integrazione ISO-ESRS
 */
export function getIntegrationStats(topics) {
  const isoMappedTopics = topics.filter((t) => t.isoThemeMapping);
  const customISOTopics = topics.filter((t) => t.isCustomISO);
  const unmappedESRS = topics.filter(
    (t) => !t.isoThemeMapping && !t.isCustomISO
  );

  return {
    totalTopics: topics.length,
    isoMappedCount: isoMappedTopics.length,
    customISOCount: customISOTopics.length,
    unmappedESRSCount: unmappedESRS.length,
    integrationPercentage: Math.round(
      (isoMappedTopics.length / topics.length) * 100
    ),
  };
}

const materialityIntegration = {
  integrateISO26000Results,
  getESRSToISOMapping,
  getIntegrationStats,
};

export default materialityIntegration;
