/**
 * Mappatura ESRS → Goal ONU SDGs (Sustainable Development Goals)
 * Basato su allineamento ufficiale EFRAG e GRI Standards
 * 
 * Riferimenti:
 * - UN SDGs: https://sdgs.un.org/goals
 * - ESRS-SDG Alignment: EFRAG Implementation Guidance
 */

// 17 Goal ONU per Sviluppo Sostenibile
export const SDG_GOALS = {
    SDG1: {
        number: 1,
        name: "Sconfiggere la povertà",
        nameEn: "No Poverty",
        description: "Porre fine ad ogni forma di povertà nel mondo",
        color: "#E5243B",
        icon: "🌍"
    },
    SDG2: {
        number: 2,
        name: "Sconfiggere la fame",
        nameEn: "Zero Hunger",
        description: "Porre fine alla fame, raggiungere la sicurezza alimentare",
        color: "#DDA63A",
        icon: "🌾"
    },
    SDG3: {
        number: 3,
        name: "Salute e benessere",
        nameEn: "Good Health and Well-being",
        description: "Assicurare la salute e il benessere per tutti e per tutte le età",
        color: "#4C9F38",
        icon: "❤️"
    },
    SDG4: {
        number: 4,
        name: "Istruzione di qualità",
        nameEn: "Quality Education",
        description: "Fornire un'educazione di qualità, equa ed inclusiva",
        color: "#C5192D",
        icon: "📚"
    },
    SDG5: {
        number: 5,
        name: "Parità di genere",
        nameEn: "Gender Equality",
        description: "Raggiungere l'uguaglianza di genere ed emancipare tutte le donne",
        color: "#FF3A21",
        icon: "⚖️"
    },
    SDG6: {
        number: 6,
        name: "Acqua pulita e servizi igienico-sanitari",
        nameEn: "Clean Water and Sanitation",
        description: "Garantire la disponibilità e la gestione sostenibile dell'acqua",
        color: "#26BDE2",
        icon: "💧"
    },
    SDG7: {
        number: 7,
        name: "Energia pulita e accessibile",
        nameEn: "Affordable and Clean Energy",
        description: "Assicurare l'accesso a sistemi di energia economici, affidabili e sostenibili",
        color: "#FCC30B",
        icon: "⚡"
    },
    SDG8: {
        number: 8,
        name: "Lavoro dignitoso e crescita economica",
        nameEn: "Decent Work and Economic Growth",
        description: "Promuovere una crescita economica duratura, inclusiva e sostenibile",
        color: "#A21942",
        icon: "💼"
    },
    SDG9: {
        number: 9,
        name: "Imprese, innovazione e infrastrutture",
        nameEn: "Industry, Innovation and Infrastructure",
        description: "Costruire infrastrutture resilienti, promuovere l'innovazione",
        color: "#FD6925",
        icon: "🏭"
    },
    SDG10: {
        number: 10,
        name: "Ridurre le disuguaglianze",
        nameEn: "Reduced Inequalities",
        description: "Ridurre le disuguaglianze all'interno e fra le nazioni",
        color: "#DD1367",
        icon: "🤝"
    },
    SDG11: {
        number: 11,
        name: "Città e comunità sostenibili",
        nameEn: "Sustainable Cities and Communities",
        description: "Rendere le città e gli insediamenti umani inclusivi, sicuri e sostenibili",
        color: "#FD9D24",
        icon: "🏙️"
    },
    SDG12: {
        number: 12,
        name: "Consumo e produzione responsabili",
        nameEn: "Responsible Consumption and Production",
        description: "Garantire modelli sostenibili di produzione e di consumo",
        color: "#BF8B2E",
        icon: "♻️"
    },
    SDG13: {
        number: 13,
        name: "Lotta contro il cambiamento climatico",
        nameEn: "Climate Action",
        description: "Promuovere azioni per combattere il cambiamento climatico",
        color: "#3F7E44",
        icon: "🌡️"
    },
    SDG14: {
        number: 14,
        name: "Vita sott'acqua",
        nameEn: "Life Below Water",
        description: "Conservare e utilizzare in modo sostenibile gli oceani e le risorse marine",
        color: "#0A97D9",
        icon: "🐟"
    },
    SDG15: {
        number: 15,
        name: "Vita sulla terra",
        nameEn: "Life on Land",
        description: "Proteggere, ripristinare e favorire un uso sostenibile dell'ecosistema terrestre",
        color: "#56C02B",
        icon: "🌳"
    },
    SDG16: {
        number: 16,
        name: "Pace, giustizia e istituzioni solide",
        nameEn: "Peace, Justice and Strong Institutions",
        description: "Promuovere società pacifiche e inclusive per lo sviluppo sostenibile",
        color: "#00689D",
        icon: "⚖️"
    },
    SDG17: {
        number: 17,
        name: "Partnership per gli obiettivi",
        nameEn: "Partnerships for the Goals",
        description: "Rafforzare i mezzi di attuazione e rinnovare il partenariato mondiale",
        color: "#19486A",
        icon: "🤝"
    }
};

/**
 * Mapping ESRS → Goal ONU SDGs
 * Un ESRS può mappare su più SDGs (relazione many-to-many)
 */
export const ESRS_TO_SDG_MAPPING = {
    // ===== AMBIENTALI (E) =====

    e1_climate: {
        esrsCode: "ESRS E1",
        esrsName: "Cambiamenti Climatici",
        sdgs: ["SDG7", "SDG13", "SDG12"],
        primary: "SDG13", // SDG principale
        justification: "Direttamente allineato alla lotta contro il cambiamento climatico (SDG13). Energia pulita (SDG7) e produzione responsabile (SDG12) sono impatti secondari."
    },

    e2_pollution: {
        esrsCode: "ESRS E2",
        esrsName: "Inquinamento",
        sdgs: ["SDG3", "SDG6", "SDG11", "SDG12", "SDG14", "SDG15"],
        primary: "SDG12",
        justification: "Produzione responsabile (SDG12) come focus principale. Impatti su salute (SDG3), acqua (SDG6), città sostenibili (SDG11), vita marina (SDG14) e terrestre (SDG15)."
    },

    e3_water: {
        esrsCode: "ESRS E3",
        esrsName: "Risorse Idriche e Marine",
        sdgs: ["SDG6", "SDG14", "SDG15"],
        primary: "SDG6",
        justification: "Acqua pulita e servizi igienico-sanitari (SDG6) come obiettivo primario. Protezione vita marina (SDG14) e ecosistemi terrestri (SDG15)."
    },

    e4_biodiversity: {
        esrsCode: "ESRS E4",
        esrsName: "Biodiversità ed Ecosistemi",
        sdgs: ["SDG14", "SDG15", "SDG2"],
        primary: "SDG15",
        justification: "Vita sulla terra (SDG15) come focus principale. Protezione vita marina (SDG14) e sicurezza alimentare (SDG2) come impatti collegati."
    },

    e5_circular: {
        esrsCode: "ESRS E5",
        esrsName: "Economia Circolare",
        sdgs: ["SDG12", "SDG11", "SDG9"],
        primary: "SDG12",
        justification: "Consumo e produzione responsabili (SDG12) come obiettivo centrale. Città sostenibili (SDG11) e innovazione (SDG9) come contributori."
    },

    // ===== SOCIALI (S) =====

    s1_workforce: {
        esrsCode: "ESRS S1",
        esrsName: "Forza Lavoro Propria",
        sdgs: ["SDG8", "SDG3", "SDG5", "SDG10"],
        primary: "SDG8",
        justification: "Lavoro dignitoso e crescita economica (SDG8) come focus principale. Salute (SDG3), parità di genere (SDG5) e riduzione disuguaglianze (SDG10)."
    },

    s2_valuechain: {
        esrsCode: "ESRS S2",
        esrsName: "Lavoratori nella Catena del Valore",
        sdgs: ["SDG8", "SDG1", "SDG10", "SDG16"],
        primary: "SDG8",
        justification: "Lavoro dignitoso (SDG8) esteso alla supply chain. Contrasto povertà (SDG1), riduzione disuguaglianze (SDG10) e giustizia (SDG16)."
    },

    s3_communities: {
        esrsCode: "ESRS S3",
        esrsName: "Comunità Interessate",
        sdgs: ["SDG1", "SDG11", "SDG10", "SDG16"],
        primary: "SDG11",
        justification: "Città e comunità sostenibili (SDG11) come obiettivo primario. Contrasto povertà (SDG1), riduzione disuguaglianze (SDG10) e istituzioni solide (SDG16)."
    },

    s4_consumers: {
        esrsCode: "ESRS S4",
        esrsName: "Consumatori e Utilizzatori Finali",
        sdgs: ["SDG3", "SDG12", "SDG16"],
        primary: "SDG12",
        justification: "Produzione e consumo responsabili (SDG12) come focus. Salute e sicurezza consumatori (SDG3) e accesso alla giustizia (SDG16)."
    },

    // ===== GOVERNANCE (G) =====

    g1_governance: {
        esrsCode: "ESRS G1",
        esrsName: "Condotta Aziendale",
        sdgs: ["SDG16", "SDG17", "SDG8"],
        primary: "SDG16",
        justification: "Pace, giustizia e istituzioni solide (SDG16) come obiettivo centrale. Partnership (SDG17) e lavoro dignitoso (SDG8) attraverso etica e compliance."
    },

    // ===== GENERALI (SEMPRE OBBLIGATORI) =====

    esrs1_general: {
        esrsCode: "ESRS 1",
        esrsName: "Requisiti Generali",
        sdgs: ["SDG17"],
        primary: "SDG17",
        justification: "Partnership e collaborazione multistakeholder (SDG17) attraverso trasparenza e disclosure strutturata."
    },

    esrs2_general: {
        esrsCode: "ESRS 2",
        esrsName: "Informazioni Generali",
        sdgs: ["SDG17"],
        primary: "SDG17",
        justification: "Rafforzamento della rendicontazione e accountability (SDG17) attraverso informazioni di contesto aziendale."
    }
};

/**
 * Regole di obbligatorietà ESRS secondo CSRD
 */
export const ESRS_MANDATORY_RULES = {
    alwaysMandatory: ["esrs1_general", "esrs2_general"], // Sempre obbligatori
    environmentalMinimum: 1, // Almeno 1 tra E1-E5
    socialMinimum: 1, // Almeno 1 tra S1-S4
    governanceMandatory: ["g1_governance"], // G1 sempre obbligatorio

    categories: {
        environmental: ["e1_climate", "e2_pollution", "e3_water", "e4_biodiversity", "e5_circular"],
        social: ["s1_workforce", "s2_valuechain", "s3_communities", "s4_consumers"],
        governance: ["g1_governance"]
    }
};

/**
 * Valida se la selezione ESRS rispetta le regole di obbligatorietà
 * @param {Array<string>} selectedESRS - Array di ID ESRS selezionati
 * @returns {Object} { isValid: boolean, errors: string[], warnings: string[] }
 */
export function validateESRSSelection(selectedESRS) {
    const errors = [];
    const warnings = [];

    // 1. Verifica ESRS 1 e 2 sempre presenti
    ESRS_MANDATORY_RULES.alwaysMandatory.forEach(esrsId => {
        if (!selectedESRS.includes(esrsId)) {
            errors.push(`${ESRS_TO_SDG_MAPPING[esrsId]?.esrsCode} è sempre obbligatorio`);
        }
    });

    // 2. Verifica G1 sempre presente
    ESRS_MANDATORY_RULES.governanceMandatory.forEach(esrsId => {
        if (!selectedESRS.includes(esrsId)) {
            errors.push(`${ESRS_TO_SDG_MAPPING[esrsId]?.esrsCode} (Governance) è sempre obbligatorio`);
        }
    });

    // 3. Verifica almeno 1 ambientale (E1-E5)
    const hasEnvironmental = ESRS_MANDATORY_RULES.categories.environmental.some(
        esrsId => selectedESRS.includes(esrsId)
    );
    if (!hasEnvironmental) {
        errors.push("Almeno un ESRS Ambientale (E1-E5) deve essere presente");
    }

    // 4. Verifica almeno 1 sociale (S1-S4)
    const hasSocial = ESRS_MANDATORY_RULES.categories.social.some(
        esrsId => selectedESRS.includes(esrsId)
    );
    if (!hasSocial) {
        errors.push("Almeno un ESRS Sociale (S1-S4) deve essere presente");
    }

    // 5. Warning se troppi ESRS (potrebbe indicare scarsa materialità)
    if (selectedESRS.length > 10) {
        warnings.push("Attenzione: hai selezionato molti ESRS. Verifica che siano tutti realmente materiali.");
    }

    return {
        isValid: errors.length === 0,
        errors,
        warnings
    };
}

/**
 * Ottiene i Goal ONU SDGs per un tema ISO 26000 mappato su ESRS
 * @param {string} esrsId - ID del topic ESRS (es. "e1_climate")
 * @returns {Array<Object>} Array di SDG con dettagli completi
 */
export function getSDGsForESRS(esrsId) {
    const mapping = ESRS_TO_SDG_MAPPING[esrsId];
    if (!mapping) return [];

    return mapping.sdgs.map(sdgKey => ({
        ...SDG_GOALS[sdgKey],
        isPrimary: sdgKey === mapping.primary,
        esrsJustification: mapping.justification
    }));
}

/**
 * Genera tabella completa Tema Materiale → ESRS → Goal ONU
 * @param {Array<Object>} materialThemes - Temi materiali dalla doppia materialità
 * @param {Object} themeToESRSMapping - Mapping temi → ESRS ID
 * @returns {Array<Object>} Tabella con tema, ESRS, SDGs
 */
export function generateMaterialitySDGTable(materialThemes, themeToESRSMapping) {
    return materialThemes.map(theme => {
        const esrsId = themeToESRSMapping[theme.id] || theme.esrsId;
        const esrsMapping = ESRS_TO_SDG_MAPPING[esrsId];
        const sdgs = getSDGsForESRS(esrsId);

        return {
            themeId: theme.id,
            themeName: theme.name,
            impactScore: theme.impactScore,
            financialScore: theme.financialScore,
            esrsCode: esrsMapping?.esrsCode || "N/A",
            esrsName: esrsMapping?.esrsName || "Non mappato",
            sdgs: sdgs,
            primarySDG: sdgs.find(sdg => sdg.isPrimary),
            allSDGNumbers: sdgs.map(sdg => sdg.number).join(", ")
        };
    });
}

/**
 * Ottiene statistiche SDGs da temi materiali
 * @param {Array<Object>} sdgTable - Tabella generata da generateMaterialitySDGTable
 * @returns {Object} Statistiche SDG coverage
 */
export function getSDGStatistics(sdgTable) {
    const sdgCounts = {};
    const esrsCounts = {};

    sdgTable.forEach(row => {
        // Conta SDGs
        row.sdgs.forEach(sdg => {
            const key = `SDG${sdg.number}`;
            sdgCounts[key] = (sdgCounts[key] || 0) + 1;
        });

        // Conta ESRS
        if (row.esrsCode !== "N/A") {
            esrsCounts[row.esrsCode] = (esrsCounts[row.esrsCode] || 0) + 1;
        }
    });

    const totalSDGsCovered = Object.keys(sdgCounts).length;
    const coveragePercentage = Math.round((totalSDGsCovered / 17) * 100);

    return {
        totalThemes: sdgTable.length,
        totalSDGsCovered,
        coveragePercentage,
        sdgCounts,
        esrsCounts,
        mostFrequentSDG: Object.entries(sdgCounts).sort((a, b) => b[1] - a[1])[0]
    };
}

const sdgMappingUtils = {
    SDG_GOALS,
    ESRS_TO_SDG_MAPPING,
    ESRS_MANDATORY_RULES,
    validateESRSSelection,
    getSDGsForESRS,
    generateMaterialitySDGTable,
    getSDGStatistics
};

export default sdgMappingUtils;
