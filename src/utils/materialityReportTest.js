/**
 * Test per la generazione del report Word con grafico materialità
 * Usa dati campione HERA per validare l'output
 */

import { generateWordReport } from "./wordExport.js";
import { heraMaterialityData } from "./materialitySampleData.js";

/**
 * Dati audit di test basati su HERA Spa
 */
const heraAuditSample = {
  // Dati aziendali
  azienda: "HERA Spa",
  dimensione: "Grande",
  fatturato: 12500000000, // 12.5 miliardi
  dipendenti: 9200,
  totalAttivo: 9800000000,

  // Date audit
  dataAvvio: "2024-10-01",
  dataGenerazione: "2024-12-15",

  // Completamento ESRS (simulato)
  completionPercentage: 73,

  // Sezioni ESRS con completion status realistico
  sezioniESRS: {
    "ESRS-E1": {
      name: "Cambiamenti climatici",
      completed: 12,
      total: 15,
      items: [
        {
          name: "Piano di transizione climatica",
          completed: true,
          comment: "Piano approvato CdA 2024",
          filesCount: 3,
        },
        {
          name: "Target emissioni Scope 1",
          completed: true,
          comment: "Target Net Zero 2030",
          filesCount: 2,
        },
        {
          name: "Target emissioni Scope 2",
          completed: true,
          comment: "100% energia rinnovabile",
          filesCount: 2,
        },
        {
          name: "Target emissioni Scope 3",
          completed: false,
          comment: "In definizione con fornitori",
          filesCount: 0,
        },
        {
          name: "Analisi rischi fisici climatici",
          completed: true,
          comment: "Assessment completato",
          filesCount: 4,
        },
        {
          name: "Analisi rischi transizione",
          completed: true,
          comment: "TCFD compliance",
          filesCount: 3,
        },
        {
          name: "Investimenti adattamento",
          completed: false,
          comment: "Budget 2025 da definire",
          filesCount: 0,
        },
        {
          name: "Disclosure Carbon Footprint",
          completed: true,
          comment: "Report annuale disponibile",
          filesCount: 2,
        },
        {
          name: "Certificazioni ambientali",
          completed: true,
          comment: "ISO 14001, ISO 50001",
          filesCount: 5,
        },
        {
          name: "Progetti economia circolare",
          completed: true,
          comment: "15 progetti attivi",
          filesCount: 8,
        },
        {
          name: "Efficienza energetica",
          completed: true,
          comment: "Riduzione 15% consumi",
          filesCount: 3,
        },
        {
          name: "Fonti rinnovabili",
          completed: true,
          comment: "65% mix energetico",
          filesCount: 4,
        },
        {
          name: "Green bonds emessi",
          completed: true,
          comment: "500M€ emessi 2023-2024",
          filesCount: 2,
        },
        {
          name: "Due diligence fornitori clima",
          completed: false,
          comment: "Processo in implementazione",
          filesCount: 0,
        },
        {
          name: "Engagement stakeholder clima",
          completed: false,
          comment: "Survey in corso",
          filesCount: 1,
        },
      ],
    },

    "ESRS-E2": {
      name: "Inquinamento",
      completed: 8,
      total: 10,
      items: [
        {
          name: "Emissioni atmosferiche",
          completed: true,
          comment: "Monitoraggio continuo 24/7",
          filesCount: 6,
        },
        {
          name: "Qualità aria urbana",
          completed: true,
          comment: "Stazioni rilevamento attive",
          filesCount: 4,
        },
        {
          name: "Gestione scarichi idrici",
          completed: true,
          comment: "Depuratori conformi AIA",
          filesCount: 5,
        },
        {
          name: "Controllo rumore acustico",
          completed: true,
          comment: "Piani risanamento acustico",
          filesCount: 3,
        },
        {
          name: "Prevenzione contaminazione suolo",
          completed: true,
          comment: "Protocolli bonifica",
          filesCount: 4,
        },
        {
          name: "Sostanze chimiche pericolose",
          completed: true,
          comment: "Inventario REACH aggiornato",
          filesCount: 2,
        },
        {
          name: "Microplastiche",
          completed: false,
          comment: "Studio impatto in corso",
          filesCount: 1,
        },
        {
          name: "Piani riduzione inquinanti",
          completed: true,
          comment: "Target 2030 definiti",
          filesCount: 3,
        },
        {
          name: "Tecnologie green",
          completed: true,
          comment: "Investimenti R&D attivi",
          filesCount: 4,
        },
        {
          name: "Reporting inquinamento",
          completed: false,
          comment: "Dashboard da implementare",
          filesCount: 0,
        },
      ],
    },

    "ESRS-E3": {
      name: "Risorse idriche e marine",
      completed: 9,
      total: 12,
      items: [
        {
          name: "Consumo idrico",
          completed: true,
          comment: "Riduzione 20% ultimi 5 anni",
          filesCount: 4,
        },
        {
          name: "Qualità acqua distribuita",
          completed: true,
          comment: "Controlli 365 giorni/anno",
          filesCount: 8,
        },
        {
          name: "Efficienza reti idriche",
          completed: true,
          comment: "Perdite sotto 15%",
          filesCount: 3,
        },
        {
          name: "Depurazione acque reflue",
          completed: true,
          comment: "95% popolazione servita",
          filesCount: 6,
        },
        {
          name: "Riuso acque depurate",
          completed: true,
          comment: "Progetti pilota attivi",
          filesCount: 2,
        },
        {
          name: "Tutela falde acquifere",
          completed: true,
          comment: "Monitoraggio continuo",
          filesCount: 5,
        },
        {
          name: "Gestione siccità",
          completed: false,
          comment: "Piano emergenza da aggiornare",
          filesCount: 1,
        },
        {
          name: "Ecosistemi marini",
          completed: true,
          comment: "Progetti Life+ attivi",
          filesCount: 3,
        },
        {
          name: "Tecnologie smart water",
          completed: true,
          comment: "IoT su 40% rete",
          filesCount: 4,
        },
        {
          name: "Tariffe sociali",
          completed: true,
          comment: "Bonus idrico attivo",
          filesCount: 2,
        },
        {
          name: "Investimenti idrici",
          completed: false,
          comment: "Piano industriale 2025-2029",
          filesCount: 0,
        },
        {
          name: "Partnership acqua",
          completed: false,
          comment: "Accordi internazionali da definire",
          filesCount: 0,
        },
      ],
    },

    "ESRS-S1": {
      name: "Forza lavoro propria",
      completed: 10,
      total: 13,
      items: [
        {
          name: "Sicurezza sul lavoro",
          completed: true,
          comment: "Zero infortuni gravi 2024",
          filesCount: 7,
        },
        {
          name: "Formazione competenze",
          completed: true,
          comment: "40 ore/anno per dipendente",
          filesCount: 5,
        },
        {
          name: "Diversity & Inclusion",
          completed: true,
          comment: "38% donne in organico",
          filesCount: 4,
        },
        {
          name: "Benessere lavoratori",
          completed: true,
          comment: "Welfare aziendale premium",
          filesCount: 6,
        },
        {
          name: "Dialogo sindacale",
          completed: true,
          comment: "Contratti integrativi attivi",
          filesCount: 3,
        },
        {
          name: "Smart working",
          completed: true,
          comment: "Hybrid model implementato",
          filesCount: 2,
        },
        {
          name: "Mobilità sostenibile",
          completed: true,
          comment: "Fleet elettrificazione 60%",
          filesCount: 3,
        },
        {
          name: "Gestione performance",
          completed: true,
          comment: "Sistema MBO integrato ESG",
          filesCount: 4,
        },
        {
          name: "Pari opportunità",
          completed: true,
          comment: "Certification Equal Salary",
          filesCount: 2,
        },
        {
          name: "Upskilling digitale",
          completed: true,
          comment: "Academy interna attiva",
          filesCount: 5,
        },
        {
          name: "Salute mentale",
          completed: false,
          comment: "Programma supporto psicologico da lanciare",
          filesCount: 0,
        },
        {
          name: "Giusto salario",
          completed: false,
          comment: "Analisi gap salariali in corso",
          filesCount: 1,
        },
        {
          name: "Engagement survey",
          completed: false,
          comment: "Survey annuale da implementare",
          filesCount: 0,
        },
      ],
    },

    "ESRS-G1": {
      name: "Condotta aziendale",
      completed: 7,
      total: 9,
      items: [
        {
          name: "Codice etico",
          completed: true,
          comment: "Aggiornato 2024",
          filesCount: 2,
        },
        {
          name: "Anti-corruzione",
          completed: true,
          comment: "Training obbligatorio annuale",
          filesCount: 4,
        },
        {
          name: "Whistleblowing",
          completed: true,
          comment: "Piattaforma digitale attiva",
          filesCount: 2,
        },
        {
          name: "Lobbying responsabile",
          completed: true,
          comment: "Registro trasparenza UE",
          filesCount: 1,
        },
        {
          name: "Due diligence diritti umani",
          completed: true,
          comment: "Assessment fornitori critici",
          filesCount: 3,
        },
        {
          name: "Gestione conflitti interesse",
          completed: true,
          comment: "Policy CdA aggiornata",
          filesCount: 2,
        },
        {
          name: "Privacy e cybersecurity",
          completed: true,
          comment: "GDPR compliance + ISO 27001",
          filesCount: 5,
        },
        {
          name: "Tax transparency",
          completed: false,
          comment: "Country-by-country reporting da pubblicare",
          filesCount: 0,
        },
        {
          name: "Sustainable finance",
          completed: false,
          comment: "Tassonomia EU da mappare completamente",
          filesCount: 1,
        },
      ],
    },
  },

  // Integrazione dati materialità HERA
  materialityData: heraMaterialityData,

  // Commenti e evidenze
  commenti: [
    {
      category: "ESRS-E1",
      item: "Piano di transizione climatica",
      text: "Piano molto ambizioso con target science-based. Monitoraggio trimestrale in CdA.",
      completed: true,
    },
    {
      category: "ESRS-E2",
      item: "Microplastiche",
      text: "Studio università Bologna in corso. Risultati attesi Q2 2025.",
      completed: false,
    },
    {
      category: "ESRS-E3",
      item: "Gestione siccità",
      text: "Piano emergenza idrica da aggiornare con nuovi scenari IPCC.",
      completed: false,
    },
    {
      category: "ESRS-S1",
      item: "Salute mentale",
      text: "Partnership con centro medico specializzato da formalizzare.",
      completed: false,
    },
  ],

  evidenze: [
    {
      category: "ESRS-E1",
      item: "Target emissioni Scope 1",
      files: [
        "Piano_Decarbonizzazione_2024.pdf",
        "Baseline_Emissioni_2019.xlsx",
      ],
    },
    {
      category: "ESRS-E3",
      item: "Qualità acqua distribuita",
      files: [
        "Report_Qualità_Acqua_2024.pdf",
        "Lab_Analisi_Database.xlsx",
        "Certificazioni_ISO.pdf",
      ],
    },
    {
      category: "ESRS-S1",
      item: "Sicurezza sul lavoro",
      files: [
        "Report_Sicurezza_2024.pdf",
        "Certificazione_OHSAS.pdf",
        "Training_Records.xlsx",
      ],
    },
  ],

  // KPI counts per sezione
  kpiCounts: {
    "ESRS-E1": { OK: 8, NOK: 2, OPT_OK: 3, OPT_EMPTY: 1, NA: 1 },
    "ESRS-E2": { OK: 6, NOK: 1, OPT_OK: 2, OPT_EMPTY: 1, NA: 0 },
    "ESRS-E3": { OK: 7, NOK: 2, OPT_OK: 2, OPT_EMPTY: 1, NA: 0 },
    "ESRS-S1": { OK: 8, NOK: 3, OPT_OK: 1, OPT_EMPTY: 1, NA: 0 },
    "ESRS-G1": { OK: 5, NOK: 2, OPT_OK: 1, OPT_EMPTY: 1, NA: 0 },
  },
};

/**
 * Funzione per testare la generazione del report con materialità
 */
export async function testMaterialityReportGeneration(storageProvider = null) {
  console.log("🧪 Test generazione report con analisi materialità...");

  try {
    // Simula storage provider minimale se non fornito
    const mockStorageProvider = storageProvider || {
      saveFile: async (filename, blob) => {
        console.log(`📁 File salvato: ${filename} (${blob.size} bytes)`);
        return Promise.resolve();
      },
    };

    // Genera il report
    await generateWordReport(heraAuditSample, mockStorageProvider);

    console.log("✅ Test completato con successo!");
    console.log(`📊 Report generato per: ${heraAuditSample.azienda}`);
    console.log(
      `📈 Include ${heraAuditSample.materialityData.topics.length} temi di materialità`
    );
    console.log(
      `🎯 ${
        heraAuditSample.materialityData.topics.filter(
          (t) => t.quadrant === "critical"
        ).length
      } temi critici identificati`
    );

    return {
      success: true,
      company: heraAuditSample.azienda,
      totalTopics: heraAuditSample.materialityData.topics.length,
      criticalTopics: heraAuditSample.materialityData.topics.filter(
        (t) => t.quadrant === "critical"
      ).length,
      completionRate: heraAuditSample.completionPercentage,
    };
  } catch (error) {
    console.error("❌ Errore durante test generazione report:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Export per test rapido da console
 */
export { heraAuditSample };
