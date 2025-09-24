const fs = require("fs");
const path = require("path");
const {
  Document,
  Packer,
  Paragraph,
  HeadingLevel,
  TextRun,
  Table,
  TableRow,
  TableCell,
  BorderStyle,
} = require("docx");

// Template con placeholders per docxtemplater
const doc = new Document({
  sections: [
    {
      children: [
        new Paragraph({
          text: "Bilancio di Sostenibilità ESRS",
          heading: HeadingLevel.TITLE,
        }),
        new Paragraph({
          children: [
            new TextRun("Azienda: "),
            new TextRun({
              text: "{azienda}",
              bold: true,
            }),
          ],
        }),
        new Paragraph({
          children: [
            new TextRun("Dimensione: "),
            new TextRun({
              text: "{dimensione}",
              bold: true,
            }),
          ],
        }),
        new Paragraph({
          children: [
            new TextRun("Anno di riferimento: "),
            new TextRun({
              text: "{anno}",
              bold: true,
            }),
          ],
        }),
        new Paragraph({
          children: [
            new TextRun("Data avvio audit: "),
            new TextRun({
              text: "{dataAvvio}",
            }),
          ],
        }),
        new Paragraph({
          children: [
            new TextRun("Data generazione report: "),
            new TextRun({
              text: "{dataGenerazione}",
            }),
          ],
        }),
        new Paragraph({
          children: [
            new TextRun("Stato completamento: "),
            new TextRun({
              text: "{completionPercentage}%",
              bold: true,
            }),
          ],
        }),
        new Paragraph({
          text: " ",
        }),

        // Executive Summary
        new Paragraph({
          text: "Executive Summary",
          heading: HeadingLevel.HEADING_1,
        }),
        new Paragraph({
          text: "Progresso Audit: {completedItems}/{totalItems} elementi completati",
        }),
        new Paragraph({
          text: "Stato: {stato}",
        }),
        new Paragraph({
          text: " ",
        }),

        // Indice
        new Paragraph({
          text: "Indice",
          heading: HeadingLevel.HEADING_1,
        }),
        new Paragraph("1. Dati Aziendali"),
        new Paragraph("2. Sezioni ESRS"),
        new Paragraph("3. KPI e Metriche"),
        new Paragraph("4. Evidenze Documentali"),
        new Paragraph("5. Commenti e Osservazioni"),
        new Paragraph("6. Raccomandazioni"),
        new Paragraph({
          text: " ",
        }),

        // Dati Aziendali
        new Paragraph({
          text: "1. Dati Aziendali",
          heading: HeadingLevel.HEADING_1,
        }),
        new Paragraph({
          text: "Nome: {azienda}",
        }),
        new Paragraph({
          text: "Classificazione dimensionale: {dimensione}",
        }),
        new Paragraph({
          text: "Periodo di rendicontazione: {anno}",
        }),
        new Paragraph({
          text: " ",
        }),

        // Sezioni ESRS - placeholder per loop
        new Paragraph({
          text: "2. Sezioni ESRS",
          heading: HeadingLevel.HEADING_1,
        }),
        new Paragraph({
          text: "{#sezioniESRS}",
        }),
        new Paragraph({
          text: "Sezione: {name}",
          heading: HeadingLevel.HEADING_2,
        }),
        new Paragraph({
          text: "Completamento: {completed}/{total} elementi",
        }),
        new Paragraph({
          text: "Elementi:",
        }),
        new Paragraph({
          text: "{#items}",
        }),
        new Paragraph({
          text: "• {name} - {completed:Status completamento}{comment:Commento: }{filesCount:Evidenze: }",
        }),
        new Paragraph({
          text: "{/items}",
        }),
        new Paragraph({
          text: "{/sezioniESRS}",
        }),
        new Paragraph({
          text: " ",
        }),

        // KPI Section
        new Paragraph({
          text: "3. KPI e Metriche",
          heading: HeadingLevel.HEADING_1,
        }),
        new Paragraph({
          text: "Riepilogo stati KPI:",
        }),
        new Paragraph({
          text: "{#kpiCounts}",
        }),
        new Paragraph({
          text: "• Stato: {stato}, Numero: {count}",
        }),
        new Paragraph({
          text: "{/kpiCounts}",
        }),
        new Paragraph({
          text: " ",
        }),

        // Evidenze Section
        new Paragraph({
          text: "4. Evidenze Documentali",
          heading: HeadingLevel.HEADING_1,
        }),
        new Paragraph({
          text: "Totale evidenze caricate: {evidenze.length}",
        }),
        new Paragraph({
          text: "{#evidenze}",
        }),
        new Paragraph({
          text: "• [{category}] {item}: {fileName} ({fileType})",
        }),
        new Paragraph({
          text: "{/evidenze}",
        }),
        new Paragraph({
          text: " ",
        }),

        // Commenti Section
        new Paragraph({
          text: "5. Commenti e Osservazioni",
          heading: HeadingLevel.HEADING_1,
        }),
        new Paragraph({
          text: "{#commenti}",
        }),
        new Paragraph({
          text: "[{category}] {item}:",
          heading: HeadingLevel.HEADING_3,
        }),
        new Paragraph({
          text: "{text}",
        }),
        new Paragraph({
          text: "Stato: {completed:Completato:Non completato}",
        }),
        new Paragraph({
          text: "{/commenti}",
        }),
        new Paragraph({
          text: " ",
        }),

        // Raccomandazioni
        new Paragraph({
          text: "6. Raccomandazioni",
          heading: HeadingLevel.HEADING_1,
        }),
        new Paragraph({
          text: "Basato sul {completionPercentage}% di completamento:",
        }),
        new Paragraph({
          text: "• Priorità agli elementi obbligatori mancanti",
        }),
        new Paragraph({
          text: "• Completare la documentazione delle evidenze",
        }),
        new Paragraph({
          text: "• Verificare la coerenza dei KPI inseriti",
        }),
        new Paragraph({
          text: " ",
        }),

        // Footer
        new Paragraph({
          text: "Report generato automaticamente dal sistema ESRS PWA",
          heading: HeadingLevel.HEADING_3,
        }),
        new Paragraph({
          text: "Schema version: {schemaVersion}",
        }),
      ],
    },
  ],
});

// Genera il template nella cartella public
const outputPath = path.resolve(
  __dirname,
  "public",
  "templates",
  "template-bilancio.docx"
);

// Crea la cartella se non esiste
const templateDir = path.dirname(outputPath);
if (!fs.existsSync(templateDir)) {
  fs.mkdirSync(templateDir, { recursive: true });
}

Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync(outputPath, buffer);
  console.log(`✅ Template Word con placeholders generato: ${outputPath}`);

  // Copia anche nella build se esiste
  const buildTemplatePath = path.resolve(
    __dirname,
    "build",
    "templates",
    "template-bilancio.docx"
  );
  const buildTemplateDir = path.dirname(buildTemplatePath);
  if (fs.existsSync(path.resolve(__dirname, "build"))) {
    if (!fs.existsSync(buildTemplateDir)) {
      fs.mkdirSync(buildTemplateDir, { recursive: true });
    }
    fs.writeFileSync(buildTemplatePath, buffer);
    console.log(`✅ Template copiato anche in build: ${buildTemplatePath}`);
  }
});
