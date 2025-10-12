// S4001 - Politiche relative a consumatori e utenti finali
const S4001 = {
  kpiCode: "S4001",
  categoryDescription: "S4 - Consumatori e utenti finali",
  title: "Politiche relative a consumatori e utenti finali",
  fields: [
    {
      key: "politiche_consumatori_adottate",
      label: "Politiche per tutela consumatori adottate",
      type: "bool",
      required: true,
    },
    {
      key: "codice_etico_marketing",
      label: "Codice etico per marketing e comunicazione",
      type: "bool",
      required: false,
    },
    {
      key: "conformita_regolamenti_consumatori",
      label: "Conformità a regolamenti tutela consumatori (Codice Consumo)",
      type: "bool",
      required: true,
    },
    {
      key: "politiche_accessibilita",
      label: "Politiche per accessibilità prodotti/servizi",
      type: "bool",
      required: false,
    },
    {
      key: "valutazione_rischi_consumatori",
      label: "Valutazione rischi per salute e sicurezza consumatori",
      type: "bool",
      required: true,
    },
    {
      key: "engagement_consumatori",
      label: "Processi di engagement con consumatori/associazioni",
      type: "enum",
      required: false,
      enum: ["Assente", "Reattivo", "Proattivo", "Collaborativo"],
    },
  ],
  checks: [
    {
      code: "CONSUMER_POLICIES_MANDATORY",
      severity: "error",
      message: "Politiche tutela consumatori obbligatorie per ESRS S4",
      test: (inputs) => !!inputs.politiche_consumatori_adottate,
      actionPlan:
        "Adottare politiche formali per tutela consumatori. Coprire: sicurezza prodotti, informazioni trasparenti, marketing responsabile, gestione reclami, privacy dati. Riferimento: ESRS S4-1.",
    },
    {
      code: "CONSUMER_LAW_COMPLIANCE",
      severity: "error",
      message: "Conformità Codice del Consumo obbligatoria (D.Lgs 206/2005)",
      test: (inputs) => !!inputs.conformita_regolamenti_consumatori,
      actionPlan:
        "Garantire conformità D.Lgs 206/2005 (Codice Consumo): diritto recesso, garanzie legali, clausole vessatorie, pratiche commerciali scorrette. GDPR per dati personali. Aggiornamento continuo su normative (es. Direttiva Omnibus UE 2019/2161).",
    },
    {
      code: "CONSUMER_RISK_ASSESSMENT",
      severity: "error",
      message: "Valutazione rischi salute/sicurezza consumatori obbligatoria",
      test: (inputs) => !!inputs.valutazione_rischi_consumatori,
      actionPlan:
        "Effettuare risk assessment prodotti: identificare pericoli (chimici, fisici, biologici), valutare probabilità danno, implementare misure controllo. Conformità: Direttiva Sicurezza Generale Prodotti UE 2001/95/CE. Test pre-commercializzazione. Sistema vigilanza post-market.",
    },
    {
      code: "ETHICAL_MARKETING",
      severity: "warning",
      message: "Codice etico marketing raccomandato per comunicazione responsabile",
      test: (inputs) => !!inputs.codice_etico_marketing,
      actionPlan:
        "Adottare codice etico marketing: no greenwashing, social washing, claim ingannevoli. Conformità Codice Autodisciplina Pubblicitaria IAP. Verificabilità claim ambientali/sociali. Comunicazione inclusiva e non stereotipata. Tutela minori.",
    },
    {
      code: "ACCESSIBILITY_POLICIES",
      severity: "info",
      message: "Politiche accessibilità raccomandate per inclusione",
      test: (inputs) => !!inputs.politiche_accessibilita,
      actionPlan:
        "Implementare accessibilità: prodotti/servizi fruibili da persone con disabilità. Web accessibility (WCAG 2.1 AA). Design universale. Packaging leggibile (font size, contrasti). Customer care accessibile (multi-canale, lingua segni).",
    },
    {
      code: "CONSUMER_ENGAGEMENT",
      severity: "info",
      message: "Engagement proattivo con consumatori raccomandato",
      test: (inputs) =>
        inputs.engagement_consumatori === "Proattivo" ||
        inputs.engagement_consumatori === "Collaborativo",
      actionPlan:
        "Instaurare dialogo con consumatori: survey soddisfazione, focus group, co-creation prodotti, partnership con associazioni consumatori. Trasparenza su impatti ESG. Educazione consumo responsabile. Social media engagement autentico.",
    },
  ],
  requiredEvidences: [
    "Politica aziendale tutela consumatori",
    "Codice etico marketing (se applicabile)",
    "Risk assessment sicurezza prodotti",
    "Certificazioni conformità regolamentare",
    "Report engagement consumatori",
  ],
};

export default S4001;
