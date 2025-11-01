// src/utils/exportHelper.js

/**
 * 📦 Export Helper - Sistema centralizzato per naming e salvataggio export
 * 
 * Standardizza il naming di tutti i file esportati dall'applicazione e gestisce
 * il salvataggio nella cartella Export dell'audit con fallback a download browser.
 * 
 * @version 1.0
 * @date 2025-11-01
 */

/**
 * Genera nome file standardizzato per export
 * 
 * Formato: [NumeroProgressivo]_[TipoContenuto]_[YYYY-MM-DD].json
 * 
 * @param {string} type - Tipo export: 'iso26000' | 'financial' | 'matrix' | 'mapping' | 'report' | 'audit' | 'report-word'
 * @param {Object} options - Opzioni aggiuntive
 * @param {Date} options.date - Data export (default: new Date())
 * @param {string} options.azienda - Nome azienda (per report Word)
 * @param {number} options.anno - Anno audit (per report Word)
 * @param {string} options.extension - Estensione file (default: 'json')
 * @returns {string} - Nome file completo
 * 
 * @example
 * generateExportFilename('iso26000') 
 * // → "01_Materialita_ISO26000_2025-11-01.json"
 * 
 * generateExportFilename('report-word', { azienda: 'Gruppo HERA', anno: 2025, extension: 'docx' })
 * // → "Bilancio_Sostenibilita_Gruppo_HERA_2025.docx"
 */
export function generateExportFilename(type, options = {}) {
    const { date = new Date(), azienda, anno, extension = 'json' } = options;

    // Formato ISO date: YYYY-MM-DD
    const dateStr = date.toISOString().split('T')[0];

    // Mappa tipi export con prefisso numerico (ordine workflow) e nome descrittivo
    const typeMap = {
        'iso26000': { prefix: '01', name: 'Materialita_ISO26000' },
        'financial': { prefix: '02', name: 'Analisi_Finanziaria' },
        'matrix': { prefix: '03', name: 'Matrice_Doppia_Materialita' },
        'mapping': { prefix: '04', name: 'Mapping_ESRS_SDG' },
        'report': { prefix: '05', name: 'Bilancio_Sostenibilita' },
        'audit': { prefix: '06', name: 'Audit_Raw_Backup' },
        'report-word': { prefix: '', name: `Bilancio_Sostenibilita_${azienda || 'Export'}_${anno || new Date().getFullYear()}` }
    };

    const config = typeMap[type];
    if (!config) {
        throw new Error(`❌ Tipo export non riconosciuto: ${type}. Valori validi: ${Object.keys(typeMap).join(', ')}`);
    }

    const { prefix, name } = config;

    // Export con numero progressivo (workflow intermedi)
    if (prefix) {
        return `${prefix}_${name}_${dateStr}.${extension}`;
    }
    // Export finali senza prefisso (report Word)
    else {
        return `${name}.${extension}`;
    }
}

/**
 * Crea payload JSON standardizzato per export
 * 
 * Tutti i file JSON esportati hanno la stessa struttura base con metadata comuni
 * 
 * @param {string} exportType - Tipo export (chiave descrittiva, es: 'iso26000_results')
 * @param {Object} data - Dati specifici del tipo di export
 * @param {Object} audit - Oggetto audit (per metadata)
 * @returns {Object} - Payload strutturato con metadata
 * 
 * @example
 * createExportPayload('iso26000_results', { scoring: {...} }, audit)
 * // → { exportType, exportDate, exportVersion, audit: {...}, data: {...} }
 */
export function createExportPayload(exportType, data, audit) {
    return {
        exportType,
        exportDate: new Date().toISOString(),
        exportVersion: '1.0',
        appVersion: process.env.REACT_APP_VERSION || '1.0.0',
        audit: {
            id: audit?.id,
            azienda: audit?.azienda,
            anno: audit?.anno,
            dataCreazione: audit?.dataCreazione
        },
        data
    };
}

/**
 * Salva export nella cartella Export dell'audit usando File System Access API
 * 
 * Requisiti:
 * - fsProvider deve essere inizializzato (LocalFsProvider.ready() === true)
 * - Browser deve supportare File System Access API (Chrome/Edge)
 * - Utente deve aver concesso permessi di scrittura
 * 
 * @param {LocalFsProvider} fsProvider - Istanza LocalFsProvider attiva
 * @param {string} type - Tipo export (vedi generateExportFilename)
 * @param {Object} payload - Dati da esportare (già in formato JSON)
 * @param {Object} options - Opzioni per naming (azienda, anno, extension)
 * @returns {Promise<Object>} - Risultato salvataggio con path e timestamp
 * 
 * @throws {Error} Se fsProvider non è pronto o scrittura fallisce
 * 
 * @example
 * const result = await saveToAuditExport(fsProvider, 'iso26000', payload, { azienda, anno });
 * console.log(result.path); // "Export/01_Materialita_ISO26000_2025-11-01.json"
 */
export async function saveToAuditExport(fsProvider, type, payload, options = {}) {
    if (!fsProvider || !fsProvider.ready()) {
        throw new Error('❌ File System Provider non inizializzato. Collega prima la cartella audit nella sezione Evidenze.');
    }

    if (!fsProvider.subDirs?.export) {
        throw new Error('❌ Cartella Export non trovata. Verifica l\'inizializzazione della struttura audit.');
    }

    try {
        const filename = generateExportFilename(type, options);

        const blob = new Blob([JSON.stringify(payload, null, 2)], {
            type: 'application/json',
        });

        // Usa writeBlob direttamente sulla cartella Export
        await fsProvider.writeBlob(fsProvider.subDirs.export, filename, blob);

        const fullPath = `Export/${filename}`;
        const timestamp = new Date().toISOString();

        console.log(`✅ Export salvato con successo: ${fullPath}`);
        console.log(`📦 Dimensione: ${(blob.size / 1024).toFixed(2)} KB`);
        console.log(`🕐 Timestamp: ${timestamp}`);

        return {
            success: true,
            filename,
            path: fullPath,
            size: blob.size,
            timestamp
        };
    } catch (error) {
        console.error('❌ Errore durante il salvataggio export:', error);
        throw new Error(`Impossibile salvare export nella cartella audit: ${error.message}`);
    }
}

/**
 * FALLBACK: Download diretto nel browser se File System non disponibile
 * 
 * Usato quando:
 * - Browser non supporta File System Access API (Firefox, Safari)
 * - Utente non ha collegato cartella audit
 * - Permessi di scrittura negati
 * 
 * Il file viene scaricato nella cartella Downloads del browser.
 * 
 * @param {string} type - Tipo export
 * @param {Object} payload - Dati da esportare
 * @param {Object} options - Opzioni per naming
 * 
 * @example
 * downloadExportFallback('iso26000', payload, { azienda, anno });
 * // File scaricato in Downloads/01_Materialita_ISO26000_2025-11-01.json
 */
export function downloadExportFallback(type, payload, options = {}) {
    try {
        const filename = generateExportFilename(type, options);

        const blob = new Blob([JSON.stringify(payload, null, 2)], {
            type: 'application/json',
        });

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a); // Necessario per Firefox
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        console.log(`⚠️ Export scaricato via browser (File System non disponibile): ${filename}`);
        console.log(`📥 Percorso: cartella Downloads del browser`);

        return {
            success: true,
            filename,
            method: 'browser-download',
            timestamp: new Date().toISOString()
        };
    } catch (error) {
        console.error('❌ Errore durante il download fallback:', error);
        throw new Error(`Impossibile scaricare file: ${error.message}`);
    }
}

/**
 * Helper unificato: prova salvataggio in audit, fallback a download browser
 * 
 * Gestisce automaticamente la logica di fallback e mostra alert informativi all'utente
 * 
 * @param {LocalFsProvider} fsProvider - Istanza LocalFsProvider (può essere null)
 * @param {string} type - Tipo export
 * @param {Object} payload - Dati da esportare
 * @param {Object} options - Opzioni per naming
 * @returns {Promise<Object>} - Risultato operazione con metodo usato
 * 
 * @example
 * const result = await exportWithFallback(fsProvider, 'iso26000', payload, { azienda, anno });
 * if (result.method === 'filesystem') {
 *   alert(`Salvato in: ${result.path}`);
 * } else {
 *   alert('File scaricato nella cartella Downloads');
 * }
 */
export async function exportWithFallback(fsProvider, type, payload, options = {}) {
    // Tentativo 1: Salvataggio in cartella audit
    if (fsProvider && fsProvider.ready()) {
        try {
            const result = await saveToAuditExport(fsProvider, type, payload, options);

            // Alert successo con dettagli
            alert(
                `✅ Export completato con successo!\n\n` +
                `📁 Percorso: ${result.path}\n` +
                `📦 File: ${result.filename}\n` +
                `🕐 Data: ${new Date(result.timestamp).toLocaleString('it-IT')}\n` +
                `💾 Dimensione: ${(result.size / 1024).toFixed(2)} KB`
            );

            return { ...result, method: 'filesystem' };
        } catch (fsError) {
            console.warn('⚠️ Salvataggio in audit fallito, uso fallback browser:', fsError);
            // Continua con fallback
        }
    }

    // Tentativo 2: Download browser
    try {
        const result = downloadExportFallback(type, payload, options);

        // Alert fallback con istruzioni
        alert(
            `⚠️ File scaricato nella cartella Downloads del browser\n\n` +
            `📥 File: ${result.filename}\n\n` +
            `💡 Per salvare direttamente nella cartella audit:\n` +
            `1. Vai nella sezione Evidenze\n` +
            `2. Clicca "Collega Cartella Audit"\n` +
            `3. Seleziona la cartella del tuo audit\n` +
            `4. Riprova l'export`
        );

        return { ...result, method: 'browser-download' };
    } catch (downloadError) {
        console.error('❌ Anche il fallback browser è fallito:', downloadError);
        throw new Error(`Impossibile esportare il file: ${downloadError.message}`);
    }
}

/**
 * Salva file Word nella cartella Export (per bilancio finale)
 * 
 * @param {LocalFsProvider} fsProvider - Istanza LocalFsProvider attiva
 * @param {Blob} wordBlob - Blob del documento Word generato
 * @param {Object} options - Opzioni (azienda, anno)
 * @returns {Promise<Object>} - Risultato salvataggio
 */
export async function saveWordExport(fsProvider, wordBlob, options = {}) {
    if (!fsProvider || !fsProvider.ready()) {
        throw new Error('❌ File System Provider non inizializzato.');
    }

    try {
        const filename = generateExportFilename('report-word', { ...options, extension: 'docx' });

        await fsProvider.writeBlob(fsProvider.subDirs.export, filename, wordBlob);

        const fullPath = `Export/${filename}`;

        console.log(`✅ Documento Word salvato: ${fullPath}`);

        return {
            success: true,
            filename,
            path: fullPath,
            size: wordBlob.size,
            timestamp: new Date().toISOString()
        };
    } catch (error) {
        console.error('❌ Errore salvataggio Word:', error);
        throw new Error(`Impossibile salvare documento Word: ${error.message}`);
    }
}

/**
 * Download Word come fallback browser
 * 
 * @param {Blob} wordBlob - Blob del documento Word
 * @param {Object} options - Opzioni per naming
 */
export function downloadWordFallback(wordBlob, options = {}) {
    const filename = generateExportFilename('report-word', { ...options, extension: 'docx' });

    const url = URL.createObjectURL(wordBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    console.log(`⚠️ Documento Word scaricato via browser: ${filename}`);

    return { success: true, filename, method: 'browser-download' };
}
