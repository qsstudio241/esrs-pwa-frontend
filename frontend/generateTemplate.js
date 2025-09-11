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
} = require("docx");

const doc = new Document({
  sections: [
    {
      children: [
        new Paragraph({
          text: "Bilancio di Sostenibilità",
          heading: HeadingLevel.TITLE,
        }),
        new Paragraph({
          text: "Azienda: [Nome Azienda]",
        }),
        new Paragraph({
          text: "Periodo: [Anno]",
        }),
        new Paragraph({
          text: "Auditor: [Nome Auditor]",
        }),
        new Paragraph({
          text: " ",
        }),
        new Paragraph({
          text: "Indice",
          heading: HeadingLevel.HEADING_1,
        }),
        new Paragraph("1. Introduzione"),
        new Paragraph("2. Governance"),
        new Paragraph("3. Sociale"),
        new Paragraph("4. Ambientale"),
        new Paragraph("5. Sintesi e Raccomandazioni"),
        new Paragraph("6. Appendici"),
        new Paragraph({
          text: " ",
        }),
        new Paragraph({
          text: "1. Introduzione",
          heading: HeadingLevel.HEADING_1,
        }),
        new Paragraph(
          "Obiettivi dell’audit, metodologia, contesto normativo ESRS."
        ),
        new Paragraph({
          text: "2. Governance",
          heading: HeadingLevel.HEADING_1,
        }),
        new Paragraph("Risposte e evidenze relative alla condotta d’impresa."),
        new Paragraph({
          text: "3. Sociale",
          heading: HeadingLevel.HEADING_1,
        }),
        new Paragraph(
          "Risposte e evidenze relative ai lavoratori, comunità e consumatori."
        ),
        new Paragraph({
          text: "4. Ambientale",
          heading: HeadingLevel.HEADING_1,
        }),
        new Paragraph(
          "Risposte e evidenze relative a clima, risorse, biodiversità."
        ),
        new Paragraph({
          text: "5. Sintesi e Raccomandazioni",
          heading: HeadingLevel.HEADING_1,
        }),
        new Paragraph(
          "Punti di forza, aree di miglioramento, proposte operative."
        ),
        new Paragraph({
          text: "6. Appendici",
          heading: HeadingLevel.HEADING_1,
        }),
        new Paragraph("Allegati fotografici, documenti PDF, file JSON."),
      ],
    },
  ],
});

Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync(
    path.resolve(__dirname, "Template_Bilancio_Sostenibilita_ESRS.docx"),
    buffer
  );
  console.log(
    "✅ File Word generato: Template_Bilancio_Sostenibilita_ESRS.docx"
  );
});
