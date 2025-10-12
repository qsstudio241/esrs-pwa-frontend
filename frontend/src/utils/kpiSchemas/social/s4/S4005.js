// S4005 - Soddisfazione e feedback consumatori
const S4005 = {
  kpiCode: "S4005",
  categoryDescription: "S4 - Consumatori e utenti finali",
  title: "Soddisfazione e feedback consumatori",
  fields: [
    {
      key: "survey_soddisfazione_condotte",
      label: "Survey soddisfazione consumatori condotte",
      type: "bool",
      required: false,
    },
    {
      key: "customer_satisfaction_score",
      label: "Customer Satisfaction Score (CSAT) (%)",
      type: "number",
      required: false,
      min: 0,
      max: 100,
      unit: "%",
    },
    {
      key: "net_promoter_score",
      label: "Net Promoter Score (NPS)",
      type: "number",
      required: false,
      min: -100,
      max: 100,
    },
    {
      key: "canali_feedback_disponibili",
      label: "Canali feedback disponibili",
      type: "enum",
      required: false,
      enum: [
        "Nessuno strutturato",
        "Email/telefono",
        "Form online",
        "Social media",
        "Multi-canale integrato",
      ],
    },
    {
      key: "tempo_risposta_feedback",
      label: "Tempo medio risposta feedback (ore)",
      type: "number",
      required: false,
      min: 0,
      unit: "ore",
    },
    {
      key: "azioni_miglioramento_da_feedback",
      label: "Azioni di miglioramento implementate da feedback consumatori",
      type: "bool",
      required: false,
    },
    {
      key: "reviews_online_monitorate",
      label: "Monitoraggio e risposta a review online",
      type: "bool",
      required: false,
    },
  ],
  checks: [
    {
      code: "CUSTOMER_SATISFACTION_TRACKING",
      severity: "warning",
      message: "Monitoraggio soddisfazione consumatori raccomandato",
      test: (inputs) => !!inputs.survey_soddisfazione_condotte,
      actionPlan:
        "Condurre survey soddisfazione: CSAT (post-acquisto), NPS (brand advocacy), CES (Customer Effort Score). Frequenza: almeno annuale, ideale trimestrale. Sample rappresentativo. Benchmark con competitor. Analisi driver soddisfazione/insoddisfazione.",
    },
    {
      code: "CSAT_TARGET",
      severity: "warning",
      message:
        "Target CSAT ≥80% raccomandato per eccellenza customer experience",
      test: (inputs) => {
        if (!inputs.customer_satisfaction_score) return true;
        return inputs.customer_satisfaction_score >= 80;
      },
      actionPlan:
        "Target CSAT ≥80% (soddisfatti+molto soddisfatti). Se <80%: 1) Root cause analysis insoddisfazione, 2) Priority actions (qualità, servizio, prezzo, comunicazione), 3) Quick wins, 4) Monitoring miglioramenti. Journey mapping per identificare pain points.",
    },
    {
      code: "NPS_TARGET",
      severity: "info",
      message: "NPS positivo (>0) indica brand advocacy",
      test: (inputs) => {
        if (inputs.net_promoter_score === undefined) return true;
        return inputs.net_promoter_score > 0;
      },
      actionPlan:
        "Target NPS >0 (più promotori che detrattori). NPS excellence: >50. Azioni: 1) Convertire passivi in promotori (exceed expectations), 2) Recuperare detrattori (service recovery), 3) Amplificare voce promotori (referral programs, testimonials). Correlazione NPS-growth.",
    },
    {
      code: "MULTI_CHANNEL_FEEDBACK",
      severity: "info",
      message: "Canali feedback multi-canale raccomandati per accessibilità",
      test: (inputs) =>
        inputs.canali_feedback_disponibili === "Multi-canale integrato",
      actionPlan:
        "Implementare feedback multi-canale: email, telefono, chatbot, form web, social media, in-app. Integrazione CRM per unified view. Ogni canale accessibile e responsivo. Comunicare canali disponibili. Omnichannel customer service.",
    },
    {
      code: "FEEDBACK_RESPONSE_TIME",
      severity: "info",
      message: "Risposta rapida a feedback migliora soddisfazione",
      test: (inputs) => {
        if (!inputs.tempo_risposta_feedback) return true;
        return inputs.tempo_risposta_feedback <= 24;
      },
      actionPlan:
        "Target risposta feedback: ≤24h (ideale: entro ore lavorative stesse giorno). Per urgenze: tempo reale (chat). SLA differenziati per canale. Automazioni per acknowledge immediato. Escalation per feedback critici. Tracking KPI risposta.",
    },
    {
      code: "CONTINUOUS_IMPROVEMENT_FROM_FEEDBACK",
      severity: "info",
      message: "Feedback consumatori devono guidare miglioramento continuo",
      test: (inputs) => !!inputs.azioni_miglioramento_da_feedback,
      actionPlan:
        "Chiudere loop feedback: 1) Analisi temi ricorrenti, 2) Prioritizzazione azioni (impact/effort), 3) Implementazione miglioramenti (prodotto, servizio, processo), 4) Comunicazione a consumatori azioni intraprese. Voice of Customer integrata in innovazione.",
    },
    {
      code: "ONLINE_REPUTATION_MANAGEMENT",
      severity: "info",
      message: "Gestione reputation online raccomandata",
      test: (inputs) => !!inputs.reviews_online_monitorate,
      actionPlan:
        "Monitorare e rispondere review online: Google, Trustpilot, Amazon, social. Tool: reputation management software. Rispondere a tutte (positive e negative). Review negative: empatia, scuse se dovuto, soluzione. Aumentare review positive: sollecitazioni post-acquisto. No review fake.",
    },
  ],
  requiredEvidences: [
    "Report survey soddisfazione consumatori",
    "Dati CSAT, NPS, CES",
    "Registro feedback ricevuti e risposte",
    "Report azioni miglioramento da VoC (Voice of Customer)",
    "Monitoraggio review online",
  ],
};

export default S4005;
