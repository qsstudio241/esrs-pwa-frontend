// S3001 - Politiche relative alle comunità interessate
const S3001 = {
  kpiCode: "S3001",
  categoryDescription: "S3 - Comunità interessate",
  title: "Politiche relative alle comunità interessate",
  fields: [
    {
      key: "politiche_comunita_adottate",
      label: "Politiche per le comunità locali adottate",
      type: "bool",
      required: true,
    },
    {
      key: "mappatura_comunita_impattate",
      label: "Mappatura comunità potenzialmente impattate effettuata",
      type: "bool",
      required: true,
    },
    {
      key: "engagement_comunita_strutturato",
      label: "Processo di engagement con comunità strutturato",
      type: "bool",
      required: false,
    },
    {
      key: "frequenza_engagement",
      label: "Frequenza engagement con comunità",
      type: "enum",
      required: false,
      enum: ["Mai", "Occasionale", "Annuale", "Trimestrale", "Continuo"],
    },
    {
      key: "valutazione_impatti_comunita",
      label: "Valutazione impatti su comunità (ESIA, SIA) effettuata",
      type: "bool",
      required: false,
    },
    {
      key: "meccanismo_reclami_comunita",
      label: "Meccanismo di reclamo per comunità implementato",
      type: "bool",
      required: false,
    },
    {
      key: "fpic_implemented",
      label: "Free Prior Informed Consent (FPIC) per comunità indigene",
      type: "bool",
      required: false,
    },
    {
      key: "progetti_sviluppo_locale",
      label: "Progetti di sviluppo locale/community investment",
      type: "bool",
      required: false,
    },
  ],
  checks: [
    {
      code: "COMMUNITY_POLICIES_MANDATORY",
      severity: "error",
      message: "Politiche per comunità locali obbligatorie per ESRS S3",
      test: (inputs) => !!inputs.politiche_comunita_adottate,
      actionPlan:
        "Adottare politiche formali per gestione impatti su comunità locali. Coprire: rispetto diritti umani, minimizzazione impatti negativi (rumore, traffico, emissioni), consultazione stakeholder. Riferimento: ESRS S3-1.",
    },
    {
      code: "COMMUNITY_MAPPING_REQUIRED",
      severity: "error",
      message: "Mappatura comunità impattate obbligatoria",
      test: (inputs) => !!inputs.mappatura_comunita_impattate,
      actionPlan:
        "Mappare tutte le comunità potenzialmente impattate da operazioni: residenti vicini a siti produttivi, lungo rotte logistiche, in aree approvvigionamento risorse. Identificare gruppi vulnerabili: indigeni, minoranze, basso reddito.",
    },
    {
      code: "IMPACT_ASSESSMENT_RECOMMENDED",
      severity: "warning",
      message:
        "Valutazione impatti su comunità raccomandata per nuovi progetti",
      test: (inputs) => !!inputs.valutazione_impatti_comunita,
      actionPlan:
        "Effettuare Social Impact Assessment (SIA) o Environmental & Social Impact Assessment (ESIA) per nuovi progetti/espansioni. Standard: IFC Performance Standards. Coprire: impatti economici, sociali, culturali, salute. Consultazione comunità obbligatoria.",
    },
    {
      code: "COMMUNITY_ENGAGEMENT",
      severity: "warning",
      message: "Engagement strutturato con comunità raccomandato",
      test: (inputs) =>
        inputs.engagement_comunita_strutturato === true &&
        (inputs.frequenza_engagement === "Trimestrale" ||
          inputs.frequenza_engagement === "Continuo"),
      actionPlan:
        "Implementare community engagement: incontri periodici, consultazioni su progetti impattanti, condivisione informazioni ambientali (emissioni, scarichi). Approccio: meaningful consultation (IFC PS1). Documentare feedback e azioni intraprese.",
    },
    {
      code: "GRIEVANCE_MECHANISM_COMMUNITIES",
      severity: "warning",
      message: "Meccanismo di reclamo per comunità raccomandato",
      test: (inputs) => !!inputs.meccanismo_reclami_comunita,
      actionPlan:
        "Creare grievance mechanism accessibile alle comunità: sportello fisico presso sito, hotline telefonica, email dedicata. Gestione secondo UN Guiding Principles: legitimate, accessible, predictable, equitable, transparent. Risposta entro tempi definiti (es. 30gg).",
    },
    {
      code: "FPIC_INDIGENOUS_PEOPLES",
      severity: "warning",
      message: "FPIC obbligatorio per progetti impattanti comunità indigene",
      test: (inputs) => {
        // Se non ci sono comunità indigene mappate, check passa
        // Se ci sono, FPIC è obbligatorio
        return inputs.fpic_implemented === true;
      },
      actionPlan:
        "Per progetti che impattano comunità indigene: ottenere Free, Prior and Informed Consent (FPIC) secondo ILO Convention 169 e UN Declaration on Indigenous Peoples Rights. Consultazione culturally appropriate. Rispetto diritti territoriali e autodeterminazione.",
    },
    {
      code: "LOCAL_DEVELOPMENT_PROJECTS",
      severity: "info",
      message: "Progetti di sviluppo locale raccomandati (shared value)",
      test: (inputs) => !!inputs.progetti_sviluppo_locale,
      actionPlan:
        "Implementare progetti community investment: formazione/occupazione locale, supporto infrastrutture (scuole, sanità), sviluppo economico locale (supporto PMI). Approccio shared value: benefici reciproci azienda-comunità. Monitorare indicatori sviluppo locale.",
    },
  ],
  requiredEvidences: [
    "Politica aziendale comunità locali",
    "Mappatura comunità impattate",
    "Report consultazioni/engagement con comunità",
    "Social Impact Assessment (se applicabile)",
    "Registri reclami comunità e risoluzioni",
  ],
};

export default S3001;
