// S4006 - Gestione reclami consumatori
const S4006 = {
  kpiCode: "S4006",
  categoryDescription: "S4 - Consumatori e utenti finali",
  title: "Gestione reclami consumatori",
  fields: [
    {
      key: "procedura_reclami_formalizzata",
      label: "Procedura gestione reclami formalizzata",
      type: "bool",
      required: true,
    },
    {
      key: "reclami_ricevuti",
      label: "Numero reclami ricevuti (anno)",
      type: "number",
      required: false,
      min: 0,
    },
    {
      key: "reclami_risolti",
      label: "Numero reclami risolti (anno)",
      type: "number",
      required: false,
      min: 0,
    },
    {
      key: "tasso_risoluzione_reclami",
      label: "Tasso di risoluzione reclami (%)",
      type: "number",
      required: false,
      min: 0,
      max: 100,
      unit: "%",
    },
    {
      key: "tempo_medio_risoluzione",
      label: "Tempo medio risoluzione reclami (giorni)",
      type: "number",
      required: false,
      min: 0,
      unit: "giorni",
    },
    {
      key: "adr_disponibile",
      label: "Alternative Dispute Resolution (ADR) disponibile",
      type: "bool",
      required: false,
    },
    {
      key: "contenziosi_legali_consumatori",
      label: "Contenziosi legali con consumatori (anno)",
      type: "number",
      required: false,
      min: 0,
    },
    {
      key: "analisi_cause_reclami",
      label: "Analisi cause radice reclami e azioni correttive",
      type: "bool",
      required: false,
    },
  ],
  checks: [
    {
      code: "COMPLAINTS_PROCEDURE_MANDATORY",
      severity: "error",
      message: "Procedura reclami formalizzata obbligatoria (Codice Consumo)",
      test: (inputs) => !!inputs.procedura_reclami_formalizzata,
      actionPlan:
        "Formalizzare procedura reclami: 1) Canali submission (email, form, posta), 2) SLA risposta/risoluzione, 3) Responsabilità, 4) Escalation, 5) Tracking. Comunicare procedura: sito web, documentazione prodotto. D.Lgs 206/2005 tutela consumatori. Accesso gratuito.",
    },
    {
      code: "COMPLAINTS_RESOLUTION_RATE",
      severity: "warning",
      message: "Tasso risoluzione reclami ≥90% raccomandato",
      test: (inputs) => {
        if (!inputs.reclami_ricevuti || inputs.reclami_ricevuti === 0)
          return true;
        if (!inputs.tasso_risoluzione_reclami) {
          // Calcola da reclami risolti/ricevuti
          if (!inputs.reclami_risolti) return false;
          const tasso =
            (inputs.reclami_risolti / inputs.reclami_ricevuti) * 100;
          return tasso >= 90;
        }
        return inputs.tasso_risoluzione_reclami >= 90;
      },
      actionPlan:
        "Target risoluzione ≥90% reclami: 1) Training customer service su gestione reclami, 2) Empowerment decisioni (refund, sostituzione), 3) Escalation manager per casi complessi, 4) Root cause analysis per sistemici. Service recovery paradox: reclami ben gestiti aumentano loyalty.",
    },
    {
      code: "RESOLUTION_TIME",
      severity: "warning",
      message: "Risoluzione reclami entro 30 giorni (best practice)",
      test: (inputs) => {
        if (!inputs.tempo_medio_risoluzione) return true;
        return inputs.tempo_medio_risoluzione <= 30;
      },
      actionPlan:
        "Target risoluzione ≤30 giorni (molti settori: ≤15gg). Reclami semplici: risoluzione immediata. Complessi: comunicazioni intermedie su avanzamento. SLA trasparenti. Monitoring KPI: tempo risposta, tempo risoluzione, backlog. Prioritizzazione per gravità.",
    },
    {
      code: "ADR_AVAILABILITY",
      severity: "warning",
      message:
        "ADR raccomandato per risoluzione stragiudiziale (Direttiva UE 2013/11)",
      test: (inputs) => !!inputs.adr_disponibile,
      actionPlan:
        "Implementare Alternative Dispute Resolution: 1) Adesione a organismo ADR settoriale, 2) Informare consumatori su ADR disponibile (sito web, reclami), 3) Partecipazione mediazioni in buona fede. ODR per e-commerce (piattaforma UE). Evita contenziosi costosi. Obbligatorio per servizi finanziari.",
    },
    {
      code: "LEGAL_DISPUTES_MINIMIZATION",
      severity: "warning",
      message: "Contenziosi legali indicano criticità gestione reclami",
      test: (inputs) =>
        !inputs.contenziosi_legali_consumatori ||
        inputs.contenziosi_legali_consumatori === 0,
      actionPlan:
        "Minimizzare contenziosi: 1) Gestione proattiva pre-contenzioso, 2) ADR come prima opzione, 3) Settlement ragionevoli, 4) Legal exposure assessment. Contenziosi: costi legali + reputazionali. Class action: rischio elevato. Trasparenza comunicazione riduce escalation.",
    },
    {
      code: "ROOT_CAUSE_ANALYSIS",
      severity: "info",
      message: "Analisi cause reclami essenziale per miglioramento continuo",
      test: (inputs) => !!inputs.analisi_cause_reclami,
      actionPlan:
        "Analizzare cause reclami: 1) Categorizzazione (prodotto, servizio, comunicazione), 2) Pareto analysis (80/20), 3) Root cause analysis (5 whys, fishbone), 4) Azioni correttive (design, QC, training), 5) Azioni preventive (FMEA). Integrazione con gestione qualità.",
    },
    {
      code: "COMPLAINTS_TRANSPARENCY",
      severity: "info",
      message: "Trasparenza su reclami aumenta fiducia consumatori",
      test: (inputs) =>
        inputs.reclami_ricevuti !== undefined &&
        inputs.tasso_risoluzione_reclami !== undefined,
      actionPlan:
        "Comunicare KPI reclami: n. ricevuti, tasso risoluzione, tempo medio, principali categorie. Pubblicazione bilancio sostenibilità o report annuale. Best practice: evidenziare miglioramenti implementati da reclami. Accountability aumenta trust. Alcuni settori: reportistica obbligatoria (es. telecom).",
    },
  ],
  requiredEvidences: [
    "Procedura gestione reclami",
    "Registro reclami (categorie, esiti, tempi)",
    "Report analisi reclami e azioni correttive",
    "Comunicazioni ADR (se applicabile)",
    "Documentazione contenziosi legali (se applicabile)",
  ],
};

export default S4006;
