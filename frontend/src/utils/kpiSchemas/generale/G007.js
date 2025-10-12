/**
 * G007 - Redazione e presentazione delle informazioni sulla sostenibilità
 * Requisiti trasversali ESRS 1
 */

const G007 = {
  kpiCode: "G007",
  categoryDescription: "Generale - Requisiti trasversali ESRS",
  title: "Redazione e presentazione delle informazioni sulla sostenibilità",
  fields: [
    {
      key: "struttura_conforme",
      label: "Struttura della dichiarazione conforme a ESRS",
      type: "bool",
      required: true,
    },
    {
      key: "informazioni_connesse",
      label: "Informazioni tra loro connesse",
      type: "bool",
      required: true,
    },
    {
      key: "linguaggio_chiaro",
      label: "Linguaggio chiaro e accessibile",
      type: "bool",
      required: true,
    },
    {
      key: "formato_digitale",
      label: "Formato digitale machine-readable (iXBRL/ESEF)",
      type: "bool",
      required: false,
    },
    {
      key: "riferimenti_incrociati",
      label: "Riferimenti incrociati utilizzati appropriatamente",
      type: "bool",
      required: false,
    },
  ],
  checks: [
    {
      code: "ESRS_STRUCTURE",
      severity: "error",
      message:
        "La dichiarazione di sostenibilità deve seguire la struttura ESRS",
      test: (i) => i.struttura_conforme === true,
      actionPlan:
        "Organizzare la dichiarazione secondo struttura ESRS: 1) Informazioni generali (GOV-1 a IRO-2), 2) Informazioni ambientali (E1-E5), 3) Informazioni sociali (S1-S4), 4) Informazioni di governance (G1).",
    },
    {
      code: "CONNECTIVITY",
      severity: "warning",
      message:
        "Le informazioni devono essere connesse tra loro per fornire un quadro d'insieme",
      test: (i) => i.informazioni_connesse === true,
      actionPlan:
        "Creare collegamenti tra: strategia e metriche, rischi e opportunità, obiettivi e azioni. Usare riferimenti incrociati tra sezioni correlate.",
    },
    {
      code: "CLARITY",
      severity: "warning",
      message:
        "Il linguaggio deve essere chiaro e comprensibile per gli stakeholder",
      test: (i) => i.linguaggio_chiaro === true,
      actionPlan:
        "Evitare jargon tecnico eccessivo. Definire acronimi e termini specialistici. Usare esempi concreti e visualizzazioni.",
    },
    {
      code: "DIGITAL_FORMAT",
      severity: "info",
      message:
        "Raccomandato formato digitale machine-readable per facilità analisi",
      test: (i) => i.formato_digitale === true,
      actionPlan:
        "Preparare dichiarazione in formato iXBRL o ESEF secondo requisiti EU. Taggare informazioni con taxonomy ESRS.",
    },
  ],
  requiredEvidences: [
    "Relazione di sostenibilità formattata secondo ESRS",
    "Matrice di connettività temi/metriche (opzionale)",
  ],
};

export default G007;
