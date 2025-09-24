import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { saveAs } from "file-saver";

// Funzione per caricare il template Word
async function loadTemplate() {
  try {
    // Per ora useremo un template minimale hardcoded
    // Più avanti lo caricheremo da un file vero
    const response = await fetch("/templates/template-bilancio.docx");
    if (!response.ok) {
      throw new Error("Template non trovato");
    }
    return await response.arrayBuffer();
  } catch (error) {
    console.log("Template non trovato, uso template base");
    return null;
  }
}

// Funzione per generare il documento Word con integrazione File System
export async function generateWordReport(auditOrSnapshot, storageProvider) {
  try {
    const isSnapshot = !!(
      auditOrSnapshot &&
      auditOrSnapshot.meta &&
      auditOrSnapshot.meta.schemaVersion
    );
    const snapshot = isSnapshot ? auditOrSnapshot : null;
    const auditData = isSnapshot
      ? snapshotToLegacyAuditShape(snapshot)
      : auditOrSnapshot;
    console.log(
      "🎯 Generazione report Word per:",
      auditData.azienda,
      isSnapshot
        ? "(snapshot v" + snapshot.meta.schemaVersion + ")"
        : "(legacy audit)"
    );

    const templateBuffer = await loadTemplate();

    if (!templateBuffer) {
      // Se non c'è template, creiamo un documento avanzato senza template
      if (isSnapshot) {
        await generateAdvancedWordReportFromSnapshot(snapshot, storageProvider);
      } else {
        await generateAdvancedWordReport(auditData, storageProvider);
      }
      return;
    }

    // Usa il template per generare il documento
    const zip = new PizZip(templateBuffer);
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    });

    // Prepara i dati completi per il template
    const templateData = isSnapshot
      ? prepareTemplateDataFromSnapshot(snapshot)
      : prepareAdvancedTemplateData(auditData);

    // Inserisce i dati nel template
    doc.setData(templateData);

    try {
      doc.render();
    } catch (error) {
      console.error("Errore nella generazione del documento:", error);
      throw error;
    }

    // Genera il file finale
    const output = doc.getZip().generate({
      type: "blob",
      mimeType:
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });

    // Salva nella cartella Report/ se File System API disponibile
    await saveReportToFileSystem(output, auditData, storageProvider);
  } catch (error) {
    console.error("Errore nella generazione del report Word:", error);
    alert("Errore nella generazione del documento Word: " + error.message);
  }
}

// Funzione legacy rimossa - ora usiamo prepareAdvancedTemplateData

// Funzione legacy rimossa - ora usiamo le funzioni avanzate per i dati

// Funzione per preparare dati avanzati per il template
function prepareAdvancedTemplateData(auditData) {
  const now = new Date();
  const completedItems = getCompletedItemsCount(auditData);
  const totalItems = getTotalItemsCount(auditData);
  const completionPercentage =
    totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  return {
    // Dati audit
    azienda: auditData.azienda || "Nome Azienda",
    dimensione: auditData.dimensione || "Non specificata",
    anno: new Date().getFullYear(),
    dataAvvio: new Date(auditData.dataAvvio).toLocaleDateString("it-IT"),
    dataGenerazione: now.toLocaleDateString("it-IT"),
    stato: auditData.stato || "in corso",

    // Statistiche
    completedItems,
    totalItems,
    completionPercentage,

    // Sezioni ESRS con dettagli
    sezioniESRS: prepareESRSSections(auditData),

    // Evidenze e file
    evidenze: prepareEvidenceData(auditData),

    // Commenti strutturati
    commenti: prepareCommentsData(auditData),
  };
}

// Genera report avanzato senza template
async function generateAdvancedWordReport(auditData, storageProvider) {
  console.log("🎯 Generazione report avanzato senza template");

  const data = prepareAdvancedTemplateData(auditData);

  const content = generateAdvancedReportContent(data);

  const blob = new Blob([content], {
    type: "text/plain;charset=utf-8",
  });

  await saveReportToFileSystem(blob, auditData, storageProvider, "txt");
}

// Salva il report nel File System
async function saveReportToFileSystem(
  blob,
  auditData,
  storageProvider,
  extension = "docx"
) {
  try {
    if (!storageProvider || !storageProvider.subDirs?.report) {
      // Fallback: download tradizionale con messaggio più chiaro
      const fileName = generateReportFileName(auditData, extension);
      saveAs(blob, fileName);
      alert(
        `⚠️ Cartella Report non configurata.\n📁 Report scaricato nei Downloads: ${fileName}\n\n💡 Per salvare direttamente nella cartella Report:\n1. Configura prima la cartella audit cliccando sul pulsante '� Seleziona Cartella e Inizia Audit'\n2. Rigenera il report`
      );
      return;
    }

    // Salva nella cartella Report/
    const fileName = generateReportFileName(auditData, extension);
    console.log(`💾 Salvando report in: Report/${fileName}`);

    // Usa il metodo writeBlob del provider
    await storageProvider.writeBlob(
      storageProvider.subDirs.report,
      fileName,
      blob
    );

    const year = new Date().getFullYear();
    const fullPath =
      storageProvider.rootPath && storageProvider.clientName
        ? `${storageProvider.rootPath}/${storageProvider.clientName}/${year}_ESRS_Bilancio/Report/${fileName}`
        : `Report/${fileName}`;

    alert(`✅ Report salvato con successo!\n📁 Percorso: ${fullPath}`);
    console.log(`✅ Report Word salvato: ${fullPath}`);
  } catch (error) {
    console.error("Errore salvataggio report:", error);
    // Fallback: download tradizionale
    const fileName = generateReportFileName(auditData, extension);
    saveAs(blob, fileName);
    alert(
      `⚠️ Impossibile salvare nella cartella Report.\n📁 Report scaricato: ${fileName}`
    );
  }
}

// Genera nome file per il report
function generateReportFileName(auditData, extension = "docx") {
  const now = new Date();
  const timestamp = now.toISOString().replace(/[:.]/g, "").slice(0, 15);
  const aziendaClean = (auditData.azienda || "Azienda")
    .replace(/[^a-zA-Z0-9]/g, "_")
    .substring(0, 20);

  return `${aziendaClean}_BilancioESRS_${timestamp}.${extension}`;
}

// Utility functions per dati
function getCompletedItemsCount(auditData) {
  if (!auditData.completed) return 0;
  return Object.values(auditData.completed).filter(Boolean).length;
}

function getTotalItemsCount(auditData) {
  if (!auditData.comments) return 0;
  return Object.keys(auditData.comments).length;
}

function prepareESRSSections(auditData) {
  const sections = {};

  // Rileva dinamicamente tutte le categorie presenti nei dati dell'audit
  const keySets = [
    Object.keys(auditData.comments || {}),
    Object.keys(auditData.files || {}),
    Object.keys(auditData.completed || {}),
  ];

  const categoriesSet = new Set();
  keySets.flat().forEach((key) => {
    const cat = key.split("-")[0];
    if (cat) categoriesSet.add(cat);
  });

  const categories = Array.from(categoriesSet).sort();

  categories.forEach((category) => {
    sections[category] = {
      name: category,
      items: [],
      completed: 0,
      total: 0,
    };

    // Costruisce l'elenco unico degli item per categoria (unione di commenti e file)
    const itemKeysSet = new Set();
    Object.keys(auditData.comments || {}).forEach((key) => {
      if (key.startsWith(`${category}-`)) itemKeysSet.add(key);
    });
    Object.keys(auditData.files || {}).forEach((key) => {
      if (key.startsWith(`${category}-`)) itemKeysSet.add(key);
    });

    const itemKeys = Array.from(itemKeysSet);

    itemKeys.forEach((key) => {
      const itemName = key.replace(`${category}-`, "");
      const comment = (auditData.comments || {})[key] || "";
      const isCompleted = !!(auditData.completed || {})[key];
      const files = (auditData.files || {})[key] || [];

      sections[category].items.push({
        name: itemName,
        comment,
        completed: isCompleted,
        filesCount: files.length,
      });

      sections[category].total++;
      if (isCompleted) sections[category].completed++;
    });
  });

  return sections;
}

function prepareEvidenceData(auditData) {
  const evidences = [];

  Object.entries(auditData.files || {}).forEach(([key, files]) => {
    files.forEach((file) => {
      evidences.push({
        category: key.split("-")[0],
        item: key.split("-").slice(1).join("-"),
        fileName: file.name,
        filePath: file.path || "Memoria browser",
        fileType: file.type || "N/A",
      });
    });
  });

  return evidences;
}

function prepareCommentsData(auditData) {
  const comments = [];

  Object.entries(auditData.comments || {}).forEach(([key, comment]) => {
    if (comment && comment.trim()) {
      comments.push({
        category: key.split("-")[0],
        item: key.split("-").slice(1).join("-"),
        text: comment,
        completed: auditData.completed?.[key] || false,
      });
    }
  });

  return comments;
}

function generateAdvancedReportContent(data) {
  const gapAnalysis = generateGapAnalysis(data);
  const recommendations = generateRecommendations(data);
  const actionPlan = generateActionPlan(data);

  return `REPORT DI AUDIT ESRS
====================

EXECUTIVE SUMMARY
================
Cliente: ${data.azienda}
Dimensione aziendale: ${data.dimensione}
Periodo di audit: ${data.dataAvvio} - ${data.dataGenerazione}
Auditor: QS Studio ESG
Stato completamento: ${data.completionPercentage}%

RISULTATO AUDIT: ${
    data.completionPercentage >= 80
      ? "✅ CONFORME"
      : data.completionPercentage >= 50
      ? "⚠️ PARZIALMENTE CONFORME"
      : "❌ NON CONFORME"
  }

INFORMAZIONI GENERALI
=====================
Nome Azienda: ${data.azienda}
Dimensione: ${data.dimensione}
Anno di riferimento: ${data.anno}
Data avvio audit: ${data.dataAvvio}
Data generazione report: ${data.dataGenerazione}
Stato audit: ${data.stato}

STATISTICHE COMPLETAMENTO
=========================
📊 Elementi completati: ${data.completedItems}/${data.totalItems} (${
    data.completionPercentage
  }%)
📁 Evidenze raccolte: ${data.evidenze.length}
💬 Commenti registrati: ${data.commenti.length}

${gapAnalysis}

SEZIONI ESRS ANALIZZATE
======================

${Object.values(data.sezioniESRS)
  .map(
    (section) => `
📋 ${section.name.toUpperCase()}
${"=".repeat(section.name.length + 5)}
Completamento: ${section.completed}/${section.total} elementi (${
      section.total > 0
        ? Math.round((section.completed / section.total) * 100)
        : 0
    }%)

${section.items
  .map(
    (item) => `
• ${item.name}
  Status: ${
    item.completed
      ? "✅ COMPLETATO"
      : item.comment && item.comment.trim()
      ? "📝 IN LAVORAZIONE"
      : "⚪ NON INIZIATO"
  }
  ${item.comment ? `Note: ${item.comment}` : "Nessuna nota registrata"}
  Evidenze: ${item.filesCount} file allegati
`
  )
  .join("")}
`
  )
  .join("")}

EVIDENZE DOCUMENTALI RACCOLTE
=============================
${
  data.evidenze.length > 0
    ? `
Totale evidenze: ${data.evidenze.length}

${data.evidenze
  .map(
    (ev) => `
📁 [${ev.category}] ${ev.item}
   File: ${ev.fileName}
   Percorso: ${ev.filePath}
   Formato: ${ev.fileType}
   Link: file:///${ev.filePath.replace(/\\/g, "/")}
`
  )
  .join("")}
`
    : "Nessuna evidenza documentale raccolta durante l'audit"
}

COMMENTI E NOTE DETTAGLIATE
===========================
${
  data.commenti.length > 0
    ? `
Totale commenti: ${data.commenti.length}

${data.commenti
  .map(
    (com) => `
💬 [${com.category}] ${com.item}
   Status: ${com.completed ? "✅ COMPLETATO" : "📝 IN LAVORAZIONE"}
   Nota: ${com.text}
   
`
  )
  .join("")}
`
    : "Nessun commento aggiuntivo registrato durante l'audit"
}

${recommendations}

${actionPlan}

CONCLUSIONI
===========
L'audit ESRS condotto su ${
    data.azienda
  } ha evidenziato un livello di completamento del ${
    data.completionPercentage
  }%.

${
  data.completionPercentage >= 80
    ? `✅ L'azienda risulta CONFORME ai requisiti ESRS per la dimensione "${data.dimensione}".
   Si raccomanda di procedere con la redazione del Bilancio di Sostenibilità.`
    : data.completionPercentage >= 50
    ? `⚠️ L'azienda risulta PARZIALMENTE CONFORME. Necessario completare le aree identificate
   nel Gap Analysis prima di procedere con la pubblicazione del bilancio.`
    : `❌ L'azienda NON risulta conforme ai requisiti minimi ESRS.
   È necessario un piano di azione strutturato prima di procedere.`
}

CERTIFICAZIONE AUDITOR
======================
Il presente report di audit è stato condotto secondo le metodologie ESRS e le disposizioni
della Direttiva CSRD 2022/2464/UE.

Auditor: QS Studio ESG
Data: ${data.dataGenerazione}
Firma digitale: [PLACEHOLDER per firma digitale]

---
Report generato automaticamente dal sistema ESRS PWA v1.0
© 2025 QS Studio - Tutti i diritti riservati
`;
}

// Funzioni specializzate per report audit professionale

function generateGapAnalysis(data) {
  const gaps = Object.values(data.sezioniESRS).filter(
    (section) => section.total > 0 && section.completed / section.total < 1
  );

  if (gaps.length === 0) {
    return `GAP ANALYSIS
============
✅ Nessun gap identificato. Tutti gli elementi applicabili sono stati completati.`;
  }

  return `GAP ANALYSIS
============
Le seguenti aree richiedono attenzione:

${gaps
  .map(
    (section) => `
🔴 ${section.name.toUpperCase()}
   Completamento: ${section.completed}/${section.total} (${Math.round(
      (section.completed / section.total) * 100
    )}%)
   Gap: ${section.total - section.completed} elementi mancanti
   
   Elementi da completare:
${section.items
  .filter((item) => !item.completed)
  .map((item) => `   • ${item.name}`)
  .join("\n")}
`
  )
  .join("")}

PRIORITÀ: ${
    gaps.length <= 2 ? "MEDIA" : gaps.length <= 4 ? "ALTA" : "CRITICA"
  }`;
}

function generateRecommendations(data) {
  const incompleteSections = Object.values(data.sezioniESRS).filter(
    (section) => section.total > 0 && section.completed < section.total
  );

  let recommendations = `RACCOMANDAZIONI
===============`;

  if (incompleteSections.length === 0) {
    recommendations += `
✅ L'audit ha evidenziato un ottimo livello di preparazione.
   Si raccomanda di:
   • Procedere con la redazione del Bilancio di Sostenibilità
   • Mantenere aggiornate le evidenze documentali
   • Pianificare il prossimo ciclo di audit`;
  } else {
    recommendations += `
Per raggiungere la piena conformità ESRS, si raccomanda di:

${incompleteSections
  .map(
    (section, index) => `
${index + 1}. ${section.name.toUpperCase()}
   • Completare ${section.total - section.completed} elementi mancanti
   • Raccogliere evidenze documentali specifiche
   • Assegnare responsabilità a team dedicato
   Timeframe suggerito: ${
     section.total - section.completed <= 2
       ? "2-4 settimane"
       : section.total - section.completed <= 5
       ? "1-2 mesi"
       : "2-3 mesi"
   }
`
  )
  .join("")}

RACCOMANDAZIONI GENERALI:
• Implementare sistema di monitoraggio continuo
• Formare il team interno sui requisiti ESRS
• Stabilire procedure di raccolta dati standardizzate
• Pianificare audit interni periodici`;
  }

  return recommendations;
}

function generateActionPlan(data) {
  const incompleteSections = Object.values(data.sezioniESRS).filter(
    (section) => section.total > 0 && section.completed < section.total
  );

  let actionPlan = `ACTION PLAN
===========`;

  if (incompleteSections.length === 0) {
    actionPlan += `
FASE 1 - FINALIZZAZIONE (1-2 settimane)
• Revisione finale delle evidenze raccolte
• Preparazione documentazione per bilancio
• Validazione dati con stakeholder interni

FASE 2 - PUBBLICAZIONE (2-4 settimane)  
• Redazione Bilancio di Sostenibilità
• Review legale e compliance
• Approvazione CdA e pubblicazione`;
  } else {
    const totalGaps = incompleteSections.reduce(
      (sum, section) => sum + (section.total - section.completed),
      0
    );

    actionPlan += `
PIANO DI AZIONE STRUTTURATO

FASE 1 - REMEDIATION (${
      totalGaps <= 5
        ? "4-6 settimane"
        : totalGaps <= 10
        ? "8-12 settimane"
        : "3-4 mesi"
    })
${incompleteSections
  .map(
    (section, index) => `
Settimana ${index * 2 + 1}-${index * 2 + 2}: ${section.name}
• Assegnare team di lavoro dedicato
• Raccogliere evidenze mancanti (${section.total - section.completed} elementi)
• Documentare processi e procedure
• Validare con auditor esterno
`
  )
  .join("")}

FASE 2 - VERIFICA (2-3 settimane)
• Audit di follow-up su elementi completati
• Validazione documentazione raccolta
• Test procedure implementate
• Preparazione per certificazione

FASE 3 - CERTIFICAZIONE (1-2 settimane)
• Audit finale di conformità
• Emissione certificato di conformità ESRS
• Preparazione per redazione bilancio`;
  }

  actionPlan += `

RESPONSABILITÀ:
• Management: Approvazione risorse e supervisione
• Team ESG: Implementazione operativa
• Auditor: Monitoraggio e validazione progressi
• Consulenti: Supporto specialistico quando necessario`;

  return actionPlan;
}

// ================== Snapshot (schemaVersion=2) Support Extensions ==================

function prepareTemplateDataFromSnapshot(snapshot) {
  if (!snapshot) return {};
  const { audit, items, meta } = snapshot;
  const completedItems = items.filter((i) => i.completed).length;
  const totalItems = items.length;
  const completionPercentage = totalItems
    ? Math.round((completedItems / totalItems) * 100)
    : 0;

  const sezioniESRSMap = {};
  items.forEach((it) => {
    if (!sezioniESRSMap[it.category]) {
      sezioniESRSMap[it.category] = {
        name: it.category,
        items: [],
        completed: 0,
        total: 0,
      };
    }
    sezioniESRSMap[it.category].items.push({
      name: it.item,
      comment: it.comment || "",
      completed: it.completed ? "✅ Completato" : "⏳ Da completare",
      filesCount: (it.files || []).length,
      kpiState: it.kpiState || null,
    });
    sezioniESRSMap[it.category].total++;
    if (it.completed) sezioniESRSMap[it.category].completed++;
  });

  // Converti in array per docxtemplater
  const sezioniESRS = Object.values(sezioniESRSMap);

  const evidenze = [];
  items.forEach((it) => {
    (it.files || []).forEach((f) => {
      evidenze.push({
        category: it.category,
        item: it.item,
        fileName: f.name,
        filePath: f.path || "Memoria browser",
        fileType: f.type || "N/A",
      });
    });
  });

  const commenti = items
    .filter((it) => it.comment && it.comment.trim())
    .map((it) => ({
      category: it.category,
      item: it.item,
      text: it.comment,
      completed: !!it.completed,
      kpiState: it.kpiState || null,
    }));

  const kpiCountsMap = items.reduce((acc, it) => {
    if (it.kpiState) acc[it.kpiState] = (acc[it.kpiState] || 0) + 1;
    return acc;
  }, {});

  // Converti KPI counts in array per docxtemplater
  const kpiCounts = Object.entries(kpiCountsMap).map(([stato, count]) => ({
    stato,
    count,
  }));

  return {
    azienda: audit.azienda || "Nome Azienda",
    dimensione: audit.dimensione || "Non specificata",
    anno: new Date().getFullYear(),
    dataAvvio: audit.dataAvvio
      ? new Date(audit.dataAvvio).toLocaleDateString("it-IT")
      : "Non specificata",
    dataGenerazione: meta.generatedAt
      ? new Date(meta.generatedAt).toLocaleDateString("it-IT")
      : new Date().toLocaleDateString("it-IT"),
    stato: audit.stato || "In corso",
    completedItems,
    totalItems,
    completionPercentage,
    sezioniESRS,
    evidenze,
    commenti,
    kpiCounts,
    schemaVersion: meta.schemaVersion || "2.0",
  };
}

function snapshotToLegacyAuditShape(snapshot) {
  if (!snapshot) return {};
  return {
    ...snapshot.audit,
    comments: snapshot.items.reduce((acc, it) => {
      acc[`${it.category}-${it.item}`] = it.comment || "";
      return acc;
    }, {}),
    files: snapshot.items.reduce((acc, it) => {
      acc[`${it.category}-${it.item}`] = it.files || [];
      return acc;
    }, {}),
    completed: snapshot.items.reduce((acc, it) => {
      acc[`${it.category}-${it.item}`] = !!it.completed;
      return acc;
    }, {}),
  };
}

async function generateAdvancedWordReportFromSnapshot(
  snapshot,
  storageProvider
) {
  const data = prepareTemplateDataFromSnapshot(snapshot);
  const content = generateAdvancedReportContent(data);
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  await saveReportToFileSystem(blob, data, storageProvider, "txt");
}
