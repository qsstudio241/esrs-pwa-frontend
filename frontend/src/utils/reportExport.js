/**
 * LOW-1: reportExport.js
 * 
 * Utility per export del Bilancio di Sostenibilità in formato Word (.docx) e PDF
 * Integra i 10 capitoli editabili dal SustainabilityReportBuilder
 */

import { saveAs } from 'file-saver';
import { Document, Packer, Paragraph, HeadingLevel, AlignmentType, ImageRun, ExternalHyperlink, TextRun } from 'docx';

/**
 * Genera documento Word dal Bilancio di Sostenibilità
 */
export async function exportReportToWord(audit, chapters, attachments) {
    console.log('📝 Generazione Word Report - Bilancio di Sostenibilità');

    try {
        const doc = new Document({
            sections: [
                {
                    properties: {},
                    children: [
                        // Copertina
                        ...generateCoverPage(audit),

                        // Indice
                        ...generateTableOfContents(),

                        // Capitoli
                        ...await generateChapters(chapters, attachments),

                        // Footer
                        ...generateFooter(audit),
                    ],
                },
            ],
        });

        const blob = await Packer.toBlob(doc);
        const fileName = `Bilancio-Sostenibilita_${audit.azienda}_${new Date().toISOString().split('T')[0]}.docx`;

        saveAs(blob, fileName);
        console.log('✅ Word Report esportato:', fileName);

        return { success: true, fileName };
    } catch (error) {
        console.error('❌ Errore export Word:', error);
        throw new Error(`Errore durante l'export Word: ${error.message}`);
    }
}

/**
 * Genera copertina del documento
 */
function generateCoverPage(audit) {
    const year = new Date().getFullYear();

    return [
        new Paragraph({
            text: '',
            spacing: { after: 3000 },
        }),
        new Paragraph({
            text: 'BILANCIO DI SOSTENIBILITÀ',
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,
            spacing: { after: 800 },
        }),
        new Paragraph({
            text: audit.azienda || 'Organizzazione',
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
        }),
        new Paragraph({
            text: `Anno ${year}`,
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
        }),
        new Paragraph({
            text: `Dimensione aziendale: ${audit.dimensione || 'Non specificata'}`,
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
        }),
        new Paragraph({
            text: 'Redatto secondo gli Standard ESRS (European Sustainability Reporting Standards)',
            alignment: AlignmentType.CENTER,
            italics: true,
            spacing: { after: 200 },
        }),
        new Paragraph({
            text: `Conforme alla Direttiva CSRD 2022/2464/UE`,
            alignment: AlignmentType.CENTER,
            italics: true,
            spacing: { after: 3000 },
        }),
        new Paragraph({
            text: `Documento generato il ${new Date().toLocaleDateString('it-IT')}`,
            alignment: AlignmentType.CENTER,
            size: 20,
            spacing: { after: 400 },
        }),
        new Paragraph({
            text: '',
            pageBreakBefore: true,
        }),
    ];
}

/**
 * Genera indice dei contenuti
 */
function generateTableOfContents() {
    return [
        new Paragraph({
            text: 'INDICE',
            heading: HeadingLevel.HEADING_1,
            spacing: { after: 400 },
        }),
        new Paragraph({
            text: 'Capitolo 1 - Profilo dell\'Organizzazione',
            spacing: { after: 200, left: 400 },
        }),
        new Paragraph({
            text: 'Capitolo 2 - Strategia e Modello di Business',
            spacing: { after: 200, left: 400 },
        }),
        new Paragraph({
            text: 'Capitolo 3 - Analisi di Materialità',
            spacing: { after: 200, left: 400 },
        }),
        new Paragraph({
            text: 'Capitolo 4 - Governance e Gestione dei Rischi',
            spacing: { after: 200, left: 400 },
        }),
        new Paragraph({
            text: 'Capitolo 5 - Stakeholder Engagement',
            spacing: { after: 200, left: 400 },
        }),
        new Paragraph({
            text: 'Capitolo 6 - Performance Ambientale (E)',
            spacing: { after: 200, left: 400 },
        }),
        new Paragraph({
            text: 'Capitolo 7 - Performance Sociale (S)',
            spacing: { after: 200, left: 400 },
        }),
        new Paragraph({
            text: 'Capitolo 8 - Performance Governance (G)',
            spacing: { after: 200, left: 400 },
        }),
        new Paragraph({
            text: 'Capitolo 9 - Obiettivi e Target',
            spacing: { after: 200, left: 400 },
        }),
        new Paragraph({
            text: 'Capitolo 10 - Allegati e Note Metodologiche',
            spacing: { after: 400, left: 400 },
        }),
        new Paragraph({
            text: '',
            pageBreakBefore: true,
        }),
    ];
}

/**
 * Genera tutti i capitoli dal builder
 */
async function generateChapters(chapters, attachments) {
    const paragraphs = [];

    const chapterStructure = [
        { id: 1, title: 'Capitolo 1 - Profilo dell\'Organizzazione' },
        { id: 2, title: 'Capitolo 2 - Strategia e Modello di Business' },
        { id: 3, title: 'Capitolo 3 - Analisi di Materialità' },
        { id: 4, title: 'Capitolo 4 - Governance e Gestione dei Rischi' },
        { id: 5, title: 'Capitolo 5 - Stakeholder Engagement' },
        { id: 6, title: 'Capitolo 6 - Performance Ambientale (E)' },
        { id: 7, title: 'Capitolo 7 - Performance Sociale (S)' },
        { id: 8, title: 'Capitolo 8 - Performance Governance (G)' },
        { id: 9, title: 'Capitolo 9 - Obiettivi e Target' },
        { id: 10, title: 'Capitolo 10 - Allegati e Note Metodologiche' },
    ];

    for (const chapter of chapterStructure) {
        const chapterData = chapters[chapter.id];
        const chapterAttachments = attachments[chapter.id] || [];

        // Titolo capitolo
        paragraphs.push(
            new Paragraph({
                text: chapter.title,
                heading: HeadingLevel.HEADING_1,
                spacing: { before: 400, after: 400 },
            })
        );

        // Contenuto capitolo
        const content = chapterData?.content || 'Contenuto non disponibile';
        const contentParagraphs = content.split('\n').filter(line => line.trim());

        contentParagraphs.forEach(line => {
            // Rileva se è un titolo (inizia con ===, ---, o tutto maiuscolo)
            const isHeading = line.match(/^[=]{3,}/) || line.match(/^[A-Z\s]{5,}$/) || line.startsWith('###');
            const isSubHeading = line.startsWith('##') || line.match(/^\d+\./);

            if (isHeading && !line.match(/^[=]{3,}/)) {
                paragraphs.push(
                    new Paragraph({
                        text: line.replace(/^#{1,3}\s*/, ''),
                        heading: HeadingLevel.HEADING_2,
                        spacing: { before: 300, after: 200 },
                    })
                );
            } else if (isSubHeading) {
                paragraphs.push(
                    new Paragraph({
                        text: line.replace(/^#{1,2}\s*/, ''),
                        heading: HeadingLevel.HEADING_3,
                        spacing: { before: 200, after: 100 },
                    })
                );
            } else if (!line.match(/^[=-]{3,}$/)) {
                // Paragrafo normale (skip linee separator)
                paragraphs.push(
                    new Paragraph({
                        text: line,
                        spacing: { after: 100 },
                    })
                );
            }
        });

        // Allegati del capitolo
        if (chapterAttachments.length > 0) {
            paragraphs.push(
                new Paragraph({
                    text: 'Allegati:',
                    heading: HeadingLevel.HEADING_3,
                    spacing: { before: 400, after: 200 },
                })
            );

            for (const attachment of chapterAttachments) {
                if (attachment.type.startsWith('image/')) {
                    // Aggiungi immagine embedded
                    try {
                        const imageData = attachment.data.split(',')[1]; // Remove data:image/...;base64,
                        const imageBuffer = Buffer.from(imageData, 'base64');

                        paragraphs.push(
                            new Paragraph({
                                children: [
                                    new ImageRun({
                                        data: imageBuffer,
                                        transformation: {
                                            width: 400,
                                            height: 300,
                                        },
                                    }),
                                ],
                                spacing: { before: 200, after: 200 },
                            })
                        );

                        paragraphs.push(
                            new Paragraph({
                                text: `Figura: ${attachment.name}`,
                                italics: true,
                                alignment: AlignmentType.CENTER,
                                spacing: { after: 300 },
                            })
                        );
                    } catch (error) {
                        console.warn('Errore inserimento immagine:', attachment.name, error);
                        paragraphs.push(
                            new Paragraph({
                                text: `[Immagine: ${attachment.name} - ${(attachment.size / 1024).toFixed(1)} KB]`,
                                italics: true,
                                spacing: { after: 100 },
                            })
                        );
                    }
                } else {
                    // File NON-IMMAGINE: Link ipertestuale
                    const fileUrl = attachment.absolutePath || attachment.path || `file:///${attachment.name}`;
                    const fileSizeKB = (attachment.size / 1024).toFixed(1);
                    
                    paragraphs.push(
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: '📎 ',
                                }),
                                new ExternalHyperlink({
                                    children: [
                                        new TextRun({
                                            text: attachment.name,
                                            style: 'Hyperlink',
                                            color: '0563C1', // Blu Word standard
                                            underline: {}
                                        })
                                    ],
                                    link: fileUrl
                                }),
                                new TextRun({
                                    text: ` (${fileSizeKB} KB)`,
                                    italics: true
                                })
                            ],
                            spacing: { after: 100, left: 400 }
                        })
                    );
                    
                    console.log(`🔗 Link ipertestuale creato: ${attachment.name} → ${fileUrl}`);
                }
            }
        }

        // Page break dopo ogni capitolo
        paragraphs.push(
            new Paragraph({
                text: '',
                pageBreakBefore: true,
            })
        );
    }

    return paragraphs;
}

/**
 * Genera footer del documento
 */
function generateFooter(audit) {
    return [
        new Paragraph({
            text: '',
            spacing: { before: 1000 },
        }),
        new Paragraph({
            text: '_______________________________________________',
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
        }),
        new Paragraph({
            text: 'CERTIFICAZIONE',
            heading: HeadingLevel.HEADING_2,
            alignment: AlignmentType.CENTER,
            spacing: { after: 300 },
        }),
        new Paragraph({
            text: `Il presente Bilancio di Sostenibilità è stato redatto secondo gli Standard ESRS (European Sustainability Reporting Standards) in conformità alla Direttiva CSRD 2022/2464/UE.`,
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 200 },
        }),
        new Paragraph({
            text: `Le informazioni contenute nel presente documento sono state verificate e approvate dal Consiglio di Amministrazione di ${audit.azienda} in data ${new Date().toLocaleDateString('it-IT')}.`,
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 400 },
        }),
        new Paragraph({
            text: `${audit.azienda}`,
            alignment: AlignmentType.RIGHT,
            bold: true,
            spacing: { after: 100 },
        }),
        new Paragraph({
            text: `Il Presidente / Amministratore Delegato`,
            alignment: AlignmentType.RIGHT,
            spacing: { after: 200 },
        }),
        new Paragraph({
            text: `_______________________________`,
            alignment: AlignmentType.RIGHT,
            spacing: { after: 100 },
        }),
        new Paragraph({
            text: `(Firma)`,
            alignment: AlignmentType.RIGHT,
            italics: true,
        }),
    ];
}

/**
 * Genera PDF dal documento Word (simulato con HTML)
 */
export async function exportReportToPDF(audit, chapters, attachments) {
    console.log('📄 Generazione PDF Report - Bilancio di Sostenibilità');

    // Per ora generiamo HTML professionale che può essere stampato in PDF
    const htmlContent = generateProfessionalHTML(audit, chapters, attachments);

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const fileName = `Bilancio-Sostenibilita_${audit.azienda}_${new Date().toISOString().split('T')[0]}.html`;

    saveAs(blob, fileName);

    alert('📄 Report HTML generato!\n\nPer convertire in PDF:\n1. Apri il file HTML nel browser\n2. Stampa (Ctrl+P)\n3. Seleziona "Salva come PDF"\n4. Salva il documento');

    console.log('✅ HTML Report esportato:', fileName);

    return { success: true, fileName };
}

/**
 * Genera HTML professionale per stampa PDF
 */
function generateProfessionalHTML(audit, chapters, attachments) {
    const year = new Date().getFullYear();

    const chaptersHTML = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(id => {
        const chapterTitles = {
            1: 'Capitolo 1 - Profilo dell\'Organizzazione',
            2: 'Capitolo 2 - Strategia e Modello di Business',
            3: 'Capitolo 3 - Analisi di Materialità',
            4: 'Capitolo 4 - Governance e Gestione dei Rischi',
            5: 'Capitolo 5 - Stakeholder Engagement',
            6: 'Capitolo 6 - Performance Ambientale (E)',
            7: 'Capitolo 7 - Performance Sociale (S)',
            8: 'Capitolo 8 - Performance Governance (G)',
            9: 'Capitolo 9 - Obiettivi e Target',
            10: 'Capitolo 10 - Allegati e Note Metodologiche',
        };

        const chapterData = chapters[id];
        const chapterAttachments = attachments[id] || [];
        const content = chapterData?.content || 'Contenuto non disponibile';

        // Converti contenuto in HTML con formattazione
        const contentHTML = content.split('\n')
            .map(line => {
                if (line.match(/^[=]{3,}/)) return '';
                if (line.match(/^[A-Z\s]{5,}$/)) return `<h2>${line}</h2>`;
                if (line.startsWith('###')) return `<h3>${line.replace(/^###\s*/, '')}</h3>`;
                if (line.startsWith('##')) return `<h3>${line.replace(/^##\s*/, '')}</h3>`;
                if (line.match(/^\d+\./)) return `<h4>${line}</h4>`;
                if (line.startsWith('•')) return `<li>${line.substring(1).trim()}</li>`;
                if (line.trim()) return `<p>${line}</p>`;
                return '<br>';
            })
            .join('\n');

        const attachmentsHTML = chapterAttachments.length > 0 ? `
            <h3>Allegati</h3>
            <div class="attachments">
                ${chapterAttachments.map(att => {
            if (att.type.startsWith('image/')) {
                return `
                            <div class="image-container">
                                <img src="${att.data}" alt="${att.name}" />
                                <p class="image-caption">Figura: ${att.name}</p>
                            </div>
                        `;
            } else {
                return `<p>📎 ${att.name} (${(att.size / 1024).toFixed(1)} KB)</p>`;
            }
        }).join('\n')}
            </div>
        ` : '';

        return `
            <div class="chapter">
                <h1>${chapterTitles[id]}</h1>
                ${contentHTML}
                ${attachmentsHTML}
            </div>
        `;
    }).join('\n');

    return `<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bilancio di Sostenibilità ESRS - ${audit.azienda}</title>
    <style>
        @page {
            margin: 2cm;
            size: A4;
        }
        
        body {
            font-family: 'Times New Roman', Times, serif;
            line-height: 1.6;
            color: #000;
            max-width: 21cm;
            margin: 0 auto;
            padding: 20px;
            background: white;
        }
        
        .cover-page {
            text-align: center;
            padding: 100px 0;
            page-break-after: always;
        }
        
        .cover-page h1 {
            font-size: 32pt;
            margin-bottom: 40px;
            color: #1976d2;
        }
        
        .cover-page h2 {
            font-size: 24pt;
            margin-bottom: 20px;
        }
        
        .cover-page p {
            font-size: 14pt;
            margin: 10px 0;
        }
        
        .toc {
            page-break-after: always;
        }
        
        .toc h1 {
            font-size: 24pt;
            margin-bottom: 30px;
        }
        
        .toc-item {
            margin: 10px 0;
            padding-left: 20px;
            font-size: 14pt;
        }
        
        .chapter {
            page-break-before: always;
        }
        
        .chapter h1 {
            font-size: 20pt;
            color: #1976d2;
            margin-bottom: 20px;
            border-bottom: 2px solid #1976d2;
            padding-bottom: 10px;
        }
        
        .chapter h2 {
            font-size: 16pt;
            margin-top: 30px;
            margin-bottom: 15px;
            color: #333;
        }
        
        .chapter h3 {
            font-size: 14pt;
            margin-top: 20px;
            margin-bottom: 10px;
            color: #555;
        }
        
        .chapter h4 {
            font-size: 12pt;
            margin-top: 15px;
            margin-bottom: 8px;
            font-weight: bold;
        }
        
        .chapter p {
            text-align: justify;
            margin-bottom: 12px;
        }
        
        .chapter li {
            margin-left: 20px;
            margin-bottom: 5px;
        }
        
        .attachments {
            margin-top: 30px;
        }
        
        .image-container {
            margin: 20px 0;
            text-align: center;
        }
        
        .image-container img {
            max-width: 100%;
            max-height: 500px;
            border: 1px solid #ddd;
            padding: 10px;
        }
        
        .image-caption {
            font-style: italic;
            font-size: 11pt;
            color: #666;
            margin-top: 10px;
        }
        
        .footer {
            page-break-before: always;
            text-align: center;
            padding-top: 100px;
        }
        
        @media print {
            body {
                background: white;
            }
            
            .chapter {
                page-break-before: always;
            }
            
            img {
                max-width: 80%;
                page-break-inside: avoid;
            }
        }
    </style>
</head>
<body>
    <!-- Copertina -->
    <div class="cover-page">
        <h1>BILANCIO DI SOSTENIBILITÀ</h1>
        <h2>${audit.azienda || 'Organizzazione'}</h2>
        <p>Anno ${year}</p>
        <p>Dimensione aziendale: ${audit.dimensione || 'Non specificata'}</p>
        <p style="margin-top: 40px; font-style: italic;">
            Redatto secondo gli Standard ESRS<br>
            (European Sustainability Reporting Standards)
        </p>
        <p style="font-style: italic;">
            Conforme alla Direttiva CSRD 2022/2464/UE
        </p>
        <p style="margin-top: 60px; font-size: 12pt;">
            Documento generato il ${new Date().toLocaleDateString('it-IT')}
        </p>
    </div>
    
    <!-- Indice -->
    <div class="toc">
        <h1>INDICE</h1>
        <div class="toc-item">Capitolo 1 - Profilo dell'Organizzazione</div>
        <div class="toc-item">Capitolo 2 - Strategia e Modello di Business</div>
        <div class="toc-item">Capitolo 3 - Analisi di Materialità</div>
        <div class="toc-item">Capitolo 4 - Governance e Gestione dei Rischi</div>
        <div class="toc-item">Capitolo 5 - Stakeholder Engagement</div>
        <div class="toc-item">Capitolo 6 - Performance Ambientale (E)</div>
        <div class="toc-item">Capitolo 7 - Performance Sociale (S)</div>
        <div class="toc-item">Capitolo 8 - Performance Governance (G)</div>
        <div class="toc-item">Capitolo 9 - Obiettivi e Target</div>
        <div class="toc-item">Capitolo 10 - Allegati e Note Metodologiche</div>
    </div>
    
    <!-- Capitoli -->
    ${chaptersHTML}
    
    <!-- Footer / Certificazione -->
    <div class="footer">
        <hr style="width: 60%; margin: 40px auto;">
        <h2>CERTIFICAZIONE</h2>
        <p style="text-align: justify; max-width: 600px; margin: 20px auto;">
            Il presente Bilancio di Sostenibilità è stato redatto secondo gli Standard ESRS 
            (European Sustainability Reporting Standards) in conformità alla Direttiva CSRD 2022/2464/UE.
        </p>
        <p style="text-align: justify; max-width: 600px; margin: 20px auto;">
            Le informazioni contenute nel presente documento sono state verificate e approvate 
            dal Consiglio di Amministrazione di ${audit.azienda} in data ${new Date().toLocaleDateString('it-IT')}.
        </p>
        <p style="margin-top: 60px; text-align: right; max-width: 600px; margin-left: auto;">
            <strong>${audit.azienda}</strong><br>
            Il Presidente / Amministratore Delegato<br><br>
            _______________________________<br>
            <em>(Firma)</em>
        </p>
    </div>
</body>
</html>`;
}

/**
 * Statistiche di completamento report
 */
export function getReportStatistics(chapters) {
    const totalChapters = 10;
    const completedChapters = Object.values(chapters).filter(ch =>
        ch?.content && ch.content.trim().length > 100
    ).length;

    const totalWords = Object.values(chapters).reduce((sum, ch) =>
        sum + (ch?.content ? ch.content.split(/\s+/).length : 0), 0
    );

    const totalCharacters = Object.values(chapters).reduce((sum, ch) =>
        sum + (ch?.content ? ch.content.length : 0), 0
    );

    return {
        totalChapters,
        completedChapters,
        completionPercentage: Math.round((completedChapters / totalChapters) * 100),
        totalWords,
        totalCharacters,
        estimatedPages: Math.ceil(totalWords / 250), // ~250 parole per pagina
    };
}
