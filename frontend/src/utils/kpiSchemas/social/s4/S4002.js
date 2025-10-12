// S4002 - Qualità e sicurezza prodotti/servizi
const S4002 = {
  kpiCode: "S4002",
  categoryDescription: "S4 - Consumatori e utenti finali",
  title: "Qualità e sicurezza prodotti/servizi",
  fields: [
    {
      key: "sistema_gestione_qualita",
      label: "Sistema di gestione qualità certificato (ISO 9001)",
      type: "bool",
      required: false,
    },
    {
      key: "certificazioni_sicurezza_prodotto",
      label: "Certificazioni sicurezza prodotto",
      type: "enum",
      required: false,
      enum: ["Nessuna", "CE", "ISO 22000 (food)", "ISO 13485 (medical)", "Multipli"],
    },
    {
      key: "test_prodotti_precommercializzazione",
      label: "Test prodotti prima della commercializzazione",
      type: "bool",
      required: true,
    },
    {
      key: "incidenti_sicurezza_prodotto",
      label: "Incidenti sicurezza prodotto segnalati (anno)",
      type: "number",
      required: false,
      min: 0,
    },
    {
      key: "richiami_prodotto",
      label: "Richiami prodotto effettuati (anno)",
      type: "number",
      required: false,
      min: 0,
    },
    {
      key: "sistema_tracciabilita",
      label: "Sistema di tracciabilità prodotti implementato",
      type: "bool",
      required: false,
    },
    {
      key: "etichettatura_conforme",
      label: "Etichettatura prodotti conforme a normative",
      type: "bool",
      required: true,
    },
    {
      key: "valutazioni_lca_prodotti",
      label: "Valutazioni ciclo vita (LCA) prodotti principali",
      type: "bool",
      required: false,
    },
  ],
  checks: [
    {
      code: "PRODUCT_TESTING_MANDATORY",
      severity: "error",
      message: "Test prodotti prima commercializzazione obbligatori",
      test: (inputs) => !!inputs.test_prodotti_precommercializzazione,
      actionPlan:
        "Implementare test pre-commercializzazione: test funzionali, sicurezza, durabilità, conformità normativa. Laboratori accreditati ISO 17025. Documentazione tecnica. Per prodotti regolamentati: test specifici (es. REACH per chimici, EN per giocattoli).",
    },
    {
      code: "LABELING_COMPLIANCE",
      severity: "error",
      message: "Etichettatura conforme obbligatoria per legge",
      test: (inputs) => !!inputs.etichettatura_conforme,
      actionPlan:
        "Garantire etichettatura conforme: ingredienti/composizione, origine, istruzioni uso, avvertenze sicurezza, smaltimento. Reg. UE 1169/2011 per food. Claim ambientali: ISO 14021. Etichette multilingua per mercati export. Aggiornamenti normativi.",
    },
    {
      code: "PRODUCT_RECALLS_MANAGEMENT",
      severity: "error",
      message: "Richiami prodotto richiedono gestione tempestiva",
      test: (inputs) => {
        if (!inputs.richiami_prodotto || inputs.richiami_prodotto === 0) return true;
        // Se ci sono richiami, deve esserci sistema tracciabilità
        return inputs.sistema_tracciabilita === true;
      },
      actionPlan:
        "Per richiami prodotto: 1) Notifica immediata autorità (RAPEX UE), 2) Comunicazione pubblica (media, sito web), 3) Ritiro/sostituzione gratuita, 4) Root cause analysis, 5) Azioni correttive. Sistema tracciabilità essenziale per rapidità richiamo. Piano emergenza recall.",
    },
    {
      code: "SAFETY_INCIDENTS_ZERO_TARGET",
      severity: "warning",
      message: "Incidenti sicurezza prodotto devono essere minimizzati",
      test: (inputs) => !inputs.incidenti_sicurezza_prodotto || inputs.incidenti_sicurezza_prodotto === 0,
      actionPlan:
        "Target zero incidenti sicurezza. Per incidenti occorsi: 1) Segnalazione immediata autorità, 2) Indagine cause (FMEA), 3) Azioni correttive design/produzione, 4) Comunicazione trasparente consumatori. Sistema vigilanza post-market per early warning.",
    },
    {
      code: "QUALITY_MANAGEMENT_SYSTEM",
      severity: "warning",
      message: "Certificazione ISO 9001 raccomandata per gestione qualità",
      test: (inputs) => !!inputs.sistema_gestione_qualita,
      actionPlan:
        "Implementare e certificare ISO 9001: approccio per processi, miglioramento continuo, customer focus. Benefici: riduzione difetti, efficienza, soddisfazione clienti. Integrare con ISO 14001 (ambiente) per gestione integrata.",
    },
    {
      code: "TRACEABILITY_SYSTEM",
      severity: "warning",
      message: "Sistema tracciabilità raccomandato per gestione richiami",
      test: (inputs) => !!inputs.sistema_tracciabilita,
      actionPlan:
        "Implementare tracciabilità prodotto: batch/serial number, registri produzione, movimentazioni. Tracciabilità upstream (materie prime) e downstream (distributori). Tecnologie: barcode, RFID, blockchain. Critico per food, pharma, automotive.",
    },
    {
      code: "PRODUCT_LCA",
      severity: "info",
      message: "Valutazioni LCA raccomandate per eco-design",
      test: (inputs) => !!inputs.valutazioni_lca_prodotti,
      actionPlan:
        "Effettuare LCA (ISO 14040/44) per prodotti principali: quantificare impatti ambientali cradle-to-grave. Usare risultati per eco-design. Comunicazione impatti: Environmental Product Declarations (EPD). Database: Ecoinvent. Tool: SimaPro, GaBi.",
    },
  ],
  requiredEvidences: [
    "Certificato ISO 9001 (se applicabile)",
    "Report test prodotti",
    "Etichette prodotti",
    "Comunicazioni richiami prodotto (se applicabile)",
    "Registro incidenti sicurezza",
    "Report LCA (se applicabile)",
  ],
};

export default S4002;
