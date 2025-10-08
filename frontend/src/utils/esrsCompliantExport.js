import { saveAs } from "file-saver";

export async function generateESRSCompliantReport(
  audit,
  options = {},
  storageProvider
) {
  const {
    includeExecutiveSummary = true,
    includeMaterialityAnalysis = true,
    includeKPIData = true,
    includeComplianceGaps = true,
    formatType = "word",
  } = options;

  const reportData = {
    meta: {
      generatedAt: new Date().toLocaleDateString("it-IT"),
      azienda: audit?.azienda || "Azienda",
      dimensione: audit?.dimensione || "Non specificata",
      anno: new Date().getFullYear(),
      standard: "ESRS - European Sustainability Reporting Standards",
    },
    sections: {},
  };

  if (includeExecutiveSummary) {
    reportData.sections.executiveSummary = generateExecutiveSummary(audit);
  }

  if (includeMaterialityAnalysis) {
    reportData.sections.materiality = generateMaterialitySection(audit);
  }

  if (includeKPIData) {
    reportData.sections.kpiData = generateKPISection(audit);
  }

  if (includeComplianceGaps) {
    reportData.sections.complianceGaps = generateComplianceGaps(audit);
  }

  const htmlContent = generateESRSHTMLReport(reportData);

  if (formatType === "html") {
    const blob = new Blob([htmlContent], { type: "text/html" });
    saveAs(
      blob,
      `BilancioESRS_${reportData.meta.azienda}_${reportData.meta.anno}.html`
    );
  } else {
    const blob = new Blob([htmlContent], { type: "application/msword" });
    saveAs(
      blob,
      `BilancioESRS_${reportData.meta.azienda}_${reportData.meta.anno}.doc`
    );
  }
}

function generateExecutiveSummary(audit) {
  const totalItems = Object.keys(audit?.completed || {}).length;
  const completedItems = Object.values(audit?.completed || {}).filter(
    Boolean
  ).length;
  const completionRate = totalItems
    ? Math.round((completedItems / totalItems) * 100)
    : 0;

  return {
    title: "Executive Summary",
    completionRate,
    totalItems,
    completedItems,
    keyHighlights: [
      `Completamento checklist ESRS: ${completionRate}%`,
      `Standard analizzati: ${totalItems} elementi`,
      `Conformità dimensione aziendale: ${audit?.dimensione}`,
      "Analisi di materialità in corso",
    ],
  };
}

function generateMaterialitySection(audit) {
  return {
    title: "Analisi di Materialità",
    approach: "Doppia materialità secondo ESRS 1",
    status: "Implementata",
    keyTopics: [
      "Cambiamenti climatici (E1)",
      "Gestione rifiuti e economia circolare (E5)",
      "Condizioni di lavoro (S1)",
      "Governance e condotta aziendale (G1)",
    ],
  };
}

function generateKPISection(audit) {
  const kpiInputs = audit?.kpiInputs || {};
  const kpiCount = Object.keys(kpiInputs).length;
  const filledKPIs = Object.values(kpiInputs).filter(
    (v) => v && v.toString().trim()
  ).length;

  return {
    title: "Indicatori di Performance (KPI)",
    totalKPIs: kpiCount,
    completedKPIs: filledKPIs,
    completionRate: kpiCount ? Math.round((filledKPIs / kpiCount) * 100) : 0,
    categories: [
      { name: "Ambientali", status: "In raccolta" },
      { name: "Sociali", status: "In raccolta" },
      { name: "Governance", status: "In raccolta" },
    ],
  };
}

function generateComplianceGaps(audit) {
  const missingItems = Object.entries(audit?.completed || {})
    .filter(([key, completed]) => !completed)
    .map(([key]) => key);

  return {
    title: "Gap Analysis",
    totalGaps: missingItems.length,
    criticalGaps: missingItems.filter(
      (item) =>
        item.includes("E1") || item.includes("S1") || item.includes("G1")
    ).length,
    recommendations: [
      "Completare elementi obbligatori per dimensione aziendale",
      "Finalizzare analisi di materialità",
      "Raccogliere dati KPI mancanti",
      "Documentare politiche e processi",
    ],
  };
}

function generateESRSHTMLReport(data) {
  const { meta, sections } = data;

  return `<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bilancio di Sostenibilità ESRS - ${meta.azienda}</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 40px; line-height: 1.6; color: #333; }
        .header { text-align: center; margin-bottom: 40px; border-bottom: 3px solid #007bff; padding-bottom: 20px; }
        .company-name { font-size: 28px; font-weight: bold; color: #007bff; }
        .report-title { font-size: 24px; margin: 10px 0; }
        .meta-info { font-size: 14px; color: #666; }
        .section { margin: 30px 0; page-break-inside: avoid; }
        .section-title { font-size: 20px; font-weight: bold; color: #007bff; margin-bottom: 15px; border-left: 4px solid #007bff; padding-left: 15px; }
        .completion-bar { background: #f8f9fa; border-radius: 10px; height: 20px; margin: 10px 0; }
        .completion-fill { background: linear-gradient(90deg, #28a745, #20c997); height: 100%; border-radius: 10px; transition: width 0.3s; }
        .metrics { display: flex; gap: 20px; margin: 20px 0; }
        .metric-card { background: #f8f9fa; padding: 15px; border-radius: 8px; text-align: center; flex: 1; }
        .metric-value { font-size: 24px; font-weight: bold; color: #007bff; }
        .metric-label { font-size: 12px; color: #666; text-transform: uppercase; }
        .highlight-list { list-style: none; padding: 0; }
        .highlight-list li { background: #e7f3ff; margin: 5px 0; padding: 10px; border-left: 4px solid #007bff; }
        .gap-indicator { display: inline-block; background: #dc3545; color: white; padding: 2px 8px; border-radius: 4px; font-size: 12px; }
        .status-complete { color: #28a745; font-weight: bold; }
        .status-progress { color: #ffc107; font-weight: bold; }
        @media print { body { margin: 20px; } .section { page-break-inside: avoid; } }
    </style>
</head>
<body>
    <div class="header">
        <div class="company-name">${meta.azienda}</div>
        <div class="report-title">Bilancio di Sostenibilità ${meta.anno}</div>
        <div class="meta-info">
            Standard: ${meta.standard}<br>
            Dimensione Aziendale: ${meta.dimensione}<br>
            Generato il: ${meta.generatedAt}
        </div>
    </div>

    ${
      sections.executiveSummary
        ? `
    <div class="section">
        <div class="section-title">${sections.executiveSummary.title}</div>
        <div class="completion-bar">
            <div class="completion-fill" style="width: ${
              sections.executiveSummary.completionRate
            }%"></div>
        </div>
        <div class="metrics">
            <div class="metric-card">
                <div class="metric-value">${
                  sections.executiveSummary.completionRate
                }%</div>
                <div class="metric-label">Completamento</div>
            </div>
            <div class="metric-card">
                <div class="metric-value">${
                  sections.executiveSummary.completedItems
                }</div>
                <div class="metric-label">Elementi Completati</div>
            </div>
            <div class="metric-card">
                <div class="metric-value">${
                  sections.executiveSummary.totalItems
                }</div>
                <div class="metric-label">Totale Elementi</div>
            </div>
        </div>
        <ul class="highlight-list">
            ${sections.executiveSummary.keyHighlights
              .map((highlight) => `<li>${highlight}</li>`)
              .join("")}
        </ul>
    </div>
    `
        : ""
    }

    ${
      sections.materiality
        ? `
    <div class="section">
        <div class="section-title">${sections.materiality.title}</div>
        <p><strong>Approccio:</strong> ${sections.materiality.approach}</p>
        <p><strong>Status:</strong> <span class="status-complete">${
          sections.materiality.status
        }</span></p>
        <h4>Temi Materiali Identificati:</h4>
        <ul class="highlight-list">
            ${sections.materiality.keyTopics
              .map((topic) => `<li>${topic}</li>`)
              .join("")}
        </ul>
    </div>
    `
        : ""
    }

    ${
      sections.kpiData
        ? `
    <div class="section">
        <div class="section-title">${sections.kpiData.title}</div>
        <div class="completion-bar">
            <div class="completion-fill" style="width: ${
              sections.kpiData.completionRate
            }%"></div>
        </div>
        <div class="metrics">
            <div class="metric-card">
                <div class="metric-value">${
                  sections.kpiData.completionRate
                }%</div>
                <div class="metric-label">KPI Completati</div>
            </div>
            <div class="metric-card">
                <div class="metric-value">${
                  sections.kpiData.completedKPIs
                }</div>
                <div class="metric-label">KPI Raccolti</div>
            </div>
            <div class="metric-card">
                <div class="metric-value">${sections.kpiData.totalKPIs}</div>
                <div class="metric-label">Totale KPI</div>
            </div>
        </div>
        <h4>Categorie KPI:</h4>
        <ul class="highlight-list">
            ${sections.kpiData.categories
              .map(
                (cat) =>
                  `<li>${cat.name}: <span class="status-progress">${cat.status}</span></li>`
              )
              .join("")}
        </ul>
    </div>
    `
        : ""
    }

    ${
      sections.complianceGaps
        ? `
    <div class="section">
        <div class="section-title">${sections.complianceGaps.title}</div>
        <div class="metrics">
            <div class="metric-card">
                <div class="metric-value">${
                  sections.complianceGaps.totalGaps
                }</div>
                <div class="metric-label">Gap Totali</div>
            </div>
            <div class="metric-card">
                <div class="metric-value">${
                  sections.complianceGaps.criticalGaps
                }</div>
                <div class="metric-label">Gap Critici</div>
            </div>
        </div>
        <h4>Raccomandazioni:</h4>
        <ul class="highlight-list">
            ${sections.complianceGaps.recommendations
              .map((rec) => `<li>${rec}</li>`)
              .join("")}
        </ul>
    </div>
    `
        : ""
    }

    <div class="section">
        <div class="section-title">Note di Conformità</div>
        <p>Questo documento è stato generato in conformità agli Standard Europei di Rendicontazione di Sostenibilità (ESRS) e alla Direttiva CSRD (EU) 2022/2464.</p>
        <p>La struttura e il contenuto seguono le linee guida ESRS 1 per la rendicontazione di sostenibilità.</p>
    </div>
</body>
</html>`;
}
