/**
 * MEDIUM-2: chapter3Generator.js
 * 
 * Utility per auto-generare il Capitolo 3 (Analisi di Materialità) del Bilancio di Sostenibilità
 * 
 * Input:
 * - audit.impactScores (da questionario ISO 26000)
 * - audit.financialAssessment (analisi rischi/opportunità)
 * - audit.selectedThemes (temi selezionati)
 * - audit.materialityExclusions (giustificazioni esclusioni)
 * - audit.sdgMappings (mappature Goal ONU)
 * 
 * Output:
 * - Contenuto formattato per Capitolo 3 con sezioni:
 *   1. Executive Summary
 *   2. Metodologia (ISO 26000 + Double Materiality)
 *   3. Tabella Temi Materiali
 *   4. Analisi Quadranti
 *   5. Requisiti Disclosure ESRS
 *   6. Contributi Goal ONU SDG
 *   7. Giustificazioni Esclusioni
 */

import { getSDGsForESRS } from './sdgMapping';
import { getAllESRSMandatoryThemes } from './materialityFrameworkISO26000';

export function generateChapter3Content(audit) {
    const {
        impactScores = {},
        financialAssessment = {},
        selectedThemes = [],
        materialityExclusions = {},
        threshold = 3.0,
        azienda = 'Organizzazione',
        dimensione = 'Non specificata',
    } = audit;

    // Calcola score finanziari da assessments
    const financialScores = {};
    Object.entries(financialAssessment.assessments || {}).forEach(([themeId, assessment]) => {
        const riskScore = (
            (assessment.risks?.probability || 0) +
            (assessment.risks?.financial_impact || 0) +
            (5 - (assessment.risks?.mitigation_capacity || 5))
        ) / 3;

        const opportunityScore = (
            (assessment.opportunities?.probability || 0) +
            (assessment.opportunities?.financial_benefit || 0) +
            (assessment.opportunities?.exploitation_ease || 0)
        ) / 3;

        financialScores[themeId] = Math.max(riskScore, opportunityScore);
    });

    // Classifica temi per quadrante
    const allThemes = getAllESRSMandatoryThemes();
    const quadrants = {
        doubleMaterial: [],
        impactOnly: [],
        financialOnly: [],
        nonMaterial: [],
    };

    selectedThemes.forEach(themeId => {
        const theme = allThemes.find(t => t.id === themeId);
        if (!theme) return;

        const impactScore = parseFloat(impactScores[themeId]) || 0;
        const financialScore = parseFloat(financialScores[themeId]) || 0;

        const themeData = {
            id: themeId,
            name: theme.name || themeId,
            code: theme.code,
            impactScore,
            financialScore,
        };

        if (impactScore >= threshold && financialScore >= threshold) {
            quadrants.doubleMaterial.push(themeData);
        } else if (impactScore >= threshold) {
            quadrants.impactOnly.push(themeData);
        } else if (financialScore >= threshold) {
            quadrants.financialOnly.push(themeData);
        } else {
            quadrants.nonMaterial.push(themeData);
        }
    });

    // Genera contenuto strutturato
    let content = '';

    // 1. EXECUTIVE SUMMARY
    content += `CAPITOLO 3 - ANALISI DI MATERIALITÀ

=== EXECUTIVE SUMMARY ===

${azienda} ha condotto un'analisi di doppia materialità secondo i principi degli Standard ESRS (European Sustainability Reporting Standards) e la metodologia ISO 26000, valutando ${selectedThemes.length} temi di sostenibilità.

L'analisi ha identificato:
• ${quadrants.doubleMaterial.length} temi doppiamente materiali (impatto + finanziario)
• ${quadrants.impactOnly.length} temi materiali d'impatto
• ${quadrants.financialOnly.length} temi materiali finanziari
• ${quadrants.nonMaterial.length} temi non materiali

Soglia di materialità applicata: ${threshold}/5

I temi doppiamente materiali rappresentano le priorità strategiche su cui ${azienda} concentrerà le proprie azioni di sostenibilità, rendicontazione e disclosure ESRS.


`;

    // 2. METODOLOGIA
    content += `=== METODOLOGIA ===

2.1 Approccio di Doppia Materialità

L'analisi di materialità è stata condotta secondo l'approccio "double materiality" richiesto dalla Direttiva CSRD (Corporate Sustainability Reporting Directive):

a) Materialità d'Impatto (Impact Materiality)
   - Valutazione degli impatti dell'organizzazione su ambiente, persone e società
   - Basata su questionario strutturato ISO 26000 con 6 temi legacy + 10 standard ESRS
   - Coinvolgimento stakeholder interni ed esterni
   - Scala di valutazione: 1-5 (1=molto basso, 5=molto alto)

b) Materialità Finanziaria (Financial Materiality)
   - Valutazione di rischi e opportunità finanziarie per l'organizzazione
   - Analisi su 4 dimensioni rischio: probabilità, impatto finanziario, orizzonte temporale, capacità di mitigazione
   - Analisi su 4 dimensioni opportunità: probabilità, beneficio finanziario, tempo di realizzazione, facilità di sfruttamento
   - Scala di valutazione: 1-5 (1=molto basso, 5=molto alto)

2.2 Framework di Riferimento

L'analisi si basa sui seguenti framework:
• ISO 26000:2010 - Linee guida sulla responsabilità sociale (6 temi legacy)
• ESRS (European Sustainability Reporting Standards) - 10 standard tematici:
  - Ambientali (E): E1 Clima, E2 Inquinamento, E3 Acqua, E4 Biodiversità, E5 Economia Circolare
  - Sociali (S): S1 Lavoratori, S2 Supply Chain, S3 Comunità, S4 Consumatori
  - Governance (G): G1 Condotta Aziendale
• UN Sustainable Development Goals (17 obiettivi) per allineamento strategico

2.3 Processo di Analisi

1. Identificazione temi: screening preliminare su 16 temi potenziali
2. Stakeholder engagement: interviste, questionari, workshop
3. Valutazione materialità d'impatto: scoring su scala 1-5
4. Valutazione materialità finanziaria: assessment rischi/opportunità
5. Mappatura matrice doppia materialità: incrocio impatto × finanziario
6. Validazione: review con top management e comitato sostenibilità
7. Approvazione: CdA in data ${new Date().toLocaleDateString('it-IT')}


`;

    // 3. TABELLA TEMI MATERIALI
    content += `=== TEMI MATERIALI - TABELLA RIEPILOGATIVA ===

LEGENDA:
• DM = Doppiamente Materiale (impatto ≥${threshold} E finanziario ≥${threshold})
• IM = Materiale d'Impatto (impatto ≥${threshold}, finanziario <${threshold})
• FM = Materiale Finanziario (impatto <${threshold}, finanziario ≥${threshold})
• NM = Non Materiale (entrambi <${threshold})

`;

    // Genera tabella
    const allThemesSorted = [
        ...quadrants.doubleMaterial,
        ...quadrants.impactOnly,
        ...quadrants.financialOnly,
        ...quadrants.nonMaterial,
    ];

    content += 'CODICE | TEMA | IMPATTO | FINANZIARIO | CLASSIFICAZIONE\n';
    content += '-------|------|---------|-------------|----------------\n';

    allThemesSorted.forEach(theme => {
        const classification =
            theme.impactScore >= threshold && theme.financialScore >= threshold
                ? 'DM - Doppiamente Materiale'
                : theme.impactScore >= threshold
                    ? 'IM - Materiale d\'Impatto'
                    : theme.financialScore >= threshold
                        ? 'FM - Materiale Finanziario'
                        : 'NM - Non Materiale';

        content += `${theme.code || 'N/A'} | ${theme.name} | ${theme.impactScore.toFixed(2)} | ${theme.financialScore.toFixed(2)} | ${classification}\n`;
    });

    content += '\n\n';

    // 4. ANALISI QUADRANTI
    content += `=== ANALISI PER QUADRANTE ===

4.1 Temi Doppiamente Materiali (${quadrants.doubleMaterial.length} temi)

I seguenti temi sono risultati materiali sia per impatto che per rilevanza finanziaria, rappresentando le priorità strategiche di ${azienda}:

`;

    quadrants.doubleMaterial.forEach((theme, idx) => {
        const sdgs = getSDGsForESRS(theme.code);
        content += `${idx + 1}. ${theme.name} (${theme.code})
   • Score Impatto: ${theme.impactScore.toFixed(2)}/5
   • Score Finanziario: ${theme.financialScore.toFixed(2)}/5
   • Disclosure ESRS: Obbligatoria
   • Goal ONU correlati: ${sdgs.length > 0 ? sdgs.map(s => `SDG ${s.number}`).join(', ') : 'N/A'}

`;
    });

    if (quadrants.impactOnly.length > 0) {
        content += `
4.2 Temi Materiali d'Impatto (${quadrants.impactOnly.length} temi)

Temi con alto impatto esterno ma minore rilevanza finanziaria diretta:

`;
        quadrants.impactOnly.forEach((theme, idx) => {
            content += `${idx + 1}. ${theme.name} - Impatto: ${theme.impactScore.toFixed(2)}, Finanziario: ${theme.financialScore.toFixed(2)}\n`;
        });
        content += '\n';
    }

    if (quadrants.financialOnly.length > 0) {
        content += `
4.3 Temi Materiali Finanziari (${quadrants.financialOnly.length} temi)

Temi con rilevanza finanziaria ma impatto esterno limitato:

`;
        quadrants.financialOnly.forEach((theme, idx) => {
            content += `${idx + 1}. ${theme.name} - Impatto: ${theme.impactScore.toFixed(2)}, Finanziario: ${theme.financialScore.toFixed(2)}\n`;
        });
        content += '\n';
    }

    // 5. REQUISITI DISCLOSURE ESRS
    content += `
=== REQUISITI DISCLOSURE ESRS ===

In base all'analisi di doppia materialità, ${azienda} è tenuta a rendicontare i seguenti standard ESRS:

`;

    const esrsThemes = quadrants.doubleMaterial.filter(t => t.code && /^[ESG]\d/.test(t.code));

    if (esrsThemes.length > 0) {
        const esrsGroups = {
            E: esrsThemes.filter(t => t.code.startsWith('E')),
            S: esrsThemes.filter(t => t.code.startsWith('S')),
            G: esrsThemes.filter(t => t.code.startsWith('G')),
        };

        if (esrsGroups.E.length > 0) {
            content += `ESRS E - Standard Ambientali:\n`;
            esrsGroups.E.forEach(t => content += `  • ${t.code}: ${t.name}\n`);
            content += '\n';
        }

        if (esrsGroups.S.length > 0) {
            content += `ESRS S - Standard Sociali:\n`;
            esrsGroups.S.forEach(t => content += `  • ${t.code}: ${t.name}\n`);
            content += '\n';
        }

        if (esrsGroups.G.length > 0) {
            content += `ESRS G - Standard di Governance:\n`;
            esrsGroups.G.forEach(t => content += `  • ${t.code}: ${t.name}\n`);
            content += '\n';
        }

        content += `
Obblighi di Disclosure:
• ESRS 2 - General Disclosures (sempre obbligatorio)
• ${esrsThemes.length} standard tematici materiali (sopra indicati)
• Informazioni qualitative e quantitative su politiche, azioni, metriche, target

Esenzioni applicate:
• Standard ESRS non materiali: giustificazioni fornite nella sezione dedicata
• Prima applicazione CSRD: esenzioni transitorie per ${dimensione === 'Piccola' || dimensione === 'Micro' ? 'piccole imprese' : 'grandi imprese'} applicabili

`;
    } else {
        content += `Nessuno standard ESRS è risultato doppiamente materiale. Disclosure obbligatoria solo per ESRS 2 (General Disclosures).\n\n`;
    }

    // 6. CONTRIBUTI GOAL ONU SDG
    content += `
=== CONTRIBUTO AGLI OBIETTIVI DI SVILUPPO SOSTENIBILE (SDG) ===

${azienda} contribuisce ai seguenti Sustainable Development Goals delle Nazioni Unite attraverso i temi materiali identificati:

`;

    const sdgContributions = new Map();

    quadrants.doubleMaterial.forEach(theme => {
        const sdgs = getSDGsForESRS(theme.code);
        sdgs.forEach(sdg => {
            if (!sdgContributions.has(sdg.number)) {
                sdgContributions.set(sdg.number, {
                    number: sdg.number,
                    title: sdg.title,
                    themes: [],
                });
            }
            sdgContributions.get(sdg.number).themes.push(theme.name);
        });
    });

    const sortedSDGs = Array.from(sdgContributions.values()).sort((a, b) => a.number - b.number);

    if (sortedSDGs.length > 0) {
        sortedSDGs.forEach(sdg => {
            content += `SDG ${sdg.number} - ${sdg.title}\n`;
            content += `  Temi materiali correlati:\n`;
            sdg.themes.forEach(themeName => {
                content += `    • ${themeName}\n`;
            });
            content += '\n';
        });

        content += `
Riepilogo Contributo:
• ${sortedSDGs.length} Goal ONU direttamente correlati ai temi materiali
• Allineamento strategia sostenibilità con Agenda 2030
• Monitoraggio KPI per ciascun SDG correlato

`;
    } else {
        content += `Nessuna correlazione diretta identificata tra temi materiali e Goal ONU SDG.\n\n`;
    }

    // 7. GIUSTIFICAZIONI ESCLUSIONI
    if (quadrants.nonMaterial.length > 0) {
        content += `
=== GIUSTIFICAZIONI PER ESCLUSIONE TEMI NON MATERIALI ===

I seguenti temi non hanno superato la soglia di materialità (${threshold}/5) e sono quindi esclusi dalla rendicontazione dettagliata:

`;

        quadrants.nonMaterial.forEach((theme, idx) => {
            const justification = materialityExclusions[theme.id] || 'Nessuna giustificazione fornita.';
            content += `${idx + 1}. ${theme.name} (${theme.code})
   • Score Impatto: ${theme.impactScore.toFixed(2)}/5
   • Score Finanziario: ${theme.financialScore.toFixed(2)}/5
   • Giustificazione: ${justification}

`;
        });

        content += `
In conformità agli Standard ESRS, ${azienda} si riserva il diritto di rivedere annualmente l'analisi di materialità e reintegrare temi attualmente esclusi qualora le condizioni di contesto dovessero modificarsi significativamente.

`;
    }

    // 8. CONCLUSIONI
    content += `
=== CONCLUSIONI E PROSSIMI PASSI ===

L'analisi di doppia materialità rappresenta il fondamento della strategia di sostenibilità di ${azienda} e guida:
1. La rendicontazione ESRS nei capitoli successivi del presente bilancio
2. La definizione di obiettivi e target di sostenibilità (Capitolo 9)
3. Le decisioni strategiche del management su investimenti ESG
4. Il dialogo con stakeholder su priorità condivise

Processo di Aggiornamento:
• Revisione annuale dell'analisi di materialità
• Aggiornamento dei dati di contesto e stakeholder engagement
• Validazione con comitato sostenibilità e CdA
• Pubblicazione risultati nel bilancio di sostenibilità annuale

Data di approvazione: ${new Date().toLocaleDateString('it-IT')}
Prossima revisione prevista: ${new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toLocaleDateString('it-IT')}


--- FINE CAPITOLO 3 ---

`;

    return content;
}

/**
 * Genera statistiche riassuntive per preview
 */
export function generateChapter3Statistics(audit) {
    const {
        impactScores = {},
        financialAssessment = {},
        selectedThemes = [],
        threshold = 3.0,
    } = audit;

    const financialScores = {};
    Object.entries(financialAssessment.assessments || {}).forEach(([themeId, assessment]) => {
        const riskScore = (
            (assessment.risks?.probability || 0) +
            (assessment.risks?.financial_impact || 0) +
            (5 - (assessment.risks?.mitigation_capacity || 5))
        ) / 3;

        const opportunityScore = (
            (assessment.opportunities?.probability || 0) +
            (assessment.opportunities?.financial_benefit || 0) +
            (assessment.opportunities?.exploitation_ease || 0)
        ) / 3;

        financialScores[themeId] = Math.max(riskScore, opportunityScore);
    });

    let doubleMaterialCount = 0;
    let impactOnlyCount = 0;
    let financialOnlyCount = 0;
    let nonMaterialCount = 0;

    selectedThemes.forEach(themeId => {
        const impactScore = parseFloat(impactScores[themeId]) || 0;
        const financialScore = parseFloat(financialScores[themeId]) || 0;

        if (impactScore >= threshold && financialScore >= threshold) {
            doubleMaterialCount++;
        } else if (impactScore >= threshold) {
            impactOnlyCount++;
        } else if (financialScore >= threshold) {
            financialOnlyCount++;
        } else {
            nonMaterialCount++;
        }
    });

    return {
        totalThemes: selectedThemes.length,
        doubleMaterial: doubleMaterialCount,
        impactOnly: impactOnlyCount,
        financialOnly: financialOnlyCount,
        nonMaterial: nonMaterialCount,
        threshold,
    };
}
