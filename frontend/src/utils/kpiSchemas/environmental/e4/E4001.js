// E4001 - Politiche relative alla biodiversità e agli ecosistemi
const E4001 = {
  kpiCode: "E4001",
  categoryDescription: "E4 - Biodiversità ed ecosistemi",
  title: "Politiche relative alla biodiversità e agli ecosistemi",
  fields: [
    {
      key: "politiche_biodiversita_adottate",
      label: "Politiche per la tutela della biodiversità adottate",
      type: "bool",
      required: true,
    },
    {
      key: "valutazione_impatti_biodiversita",
      label: "Valutazione degli impatti sulla biodiversità effettuata",
      type: "bool",
      required: true,
    },
    {
      key: "siti_in_aree_protette",
      label: "Presenza di siti in aree protette o ad alta biodiversità",
      type: "bool",
      required: false,
    },
    {
      key: "numero_siti_aree_sensibili",
      label: "Numero di siti in aree sensibili",
      type: "number",
      required: false,
      min: 0,
    },
    {
      key: "strategie_mitigazione_impatti",
      label: "Strategie di mitigazione degli impatti implementate",
      type: "bool",
      required: false,
    },
    {
      key: "progetti_ripristino_ecosistemi",
      label: "Progetti di ripristino ecosistemi in corso",
      type: "bool",
      required: false,
    },
    {
      key: "conformita_convenzione_biodiversita",
      label: "Conformità alla Convenzione sulla Diversità Biologica (CBD)",
      type: "bool",
      required: false,
    },
    {
      key: "approccio_gerarchia_mitigazione",
      label: "Approccio mitigation hierarchy applicato (evitare-minimizzare-ripristinare-compensare)",
      type: "enum",
      required: false,
      enum: ["Non applicato", "Parziale", "Completo"],
    },
  ],
  checks: [
    {
      code: "BIODIVERSITY_POLICIES_MANDATORY",
      severity: "error",
      message: "Politiche per la tutela della biodiversità obbligatorie per ESRS E4",
      test: (inputs) => !!inputs.politiche_biodiversita_adottate,
      actionPlan:
        "Adottare politiche formali per la tutela della biodiversità. Documentare approccio alla gestione impatti su ecosistemi e specie. Riferimento: ESRS E4-1.",
    },
    {
      code: "BIODIVERSITY_IMPACT_ASSESSMENT",
      severity: "error",
      message: "Valutazione degli impatti sulla biodiversità obbligatoria",
      test: (inputs) => !!inputs.valutazione_impatti_biodiversita,
      actionPlan:
        "Effettuare biodiversity impact assessment per tutti i siti operativi. Identificare impatti su habitat, specie protette, servizi ecosistemici. Usare strumenti: IBAT, STAR, Biodiversity Footprint.",
    },
    {
      code: "PROTECTED_AREAS_MANAGEMENT",
      severity: "warning",
      message: "Siti in aree protette richiedono gestione speciale",
      test: (inputs) => {
        if (!inputs.siti_in_aree_protette) return true;
        return (
          inputs.strategie_mitigazione_impatti === true &&
          inputs.approccio_gerarchia_mitigazione !== "Non applicato"
        );
      },
      actionPlan:
        "Per siti in aree protette (Natura 2000, IUCN, Ramsar): implementare mitigation hierarchy. Priorità: evitare impatti. Compensazioni solo come ultima risorsa. Coinvolgere autorità ambientali.",
    },
    {
      code: "MITIGATION_HIERARCHY_RECOMMENDED",
      severity: "warning",
      message: "Applicazione della mitigation hierarchy raccomandata",
      test: (inputs) => inputs.approccio_gerarchia_mitigazione === "Completo",
      actionPlan:
        "Implementare gerarchia mitigazione: 1) Evitare impatti (site selection), 2) Minimizzare (design ottimizzato), 3) Ripristinare on-site, 4) Compensare off-site. No net loss obiettivo minimo.",
    },
    {
      code: "ECOSYSTEM_RESTORATION",
      severity: "info",
      message: "Progetti di ripristino ecosistemi raccomandati",
      test: (inputs) => !!inputs.progetti_ripristino_ecosistemi,
      actionPlan:
        "Avviare progetti di ripristino: riforestazione, recupero zone umide, rinaturalizzazione corsi d'acqua. Collaborare con NGO ambientali. Monitorare efficacia con indicatori ecologici.",
    },
    {
      code: "CBD_ALIGNMENT",
      severity: "info",
      message: "Allineamento alla Convenzione sulla Diversità Biologica raccomandato",
      test: (inputs) => !!inputs.conformita_convenzione_biodiversita,
      actionPlan:
        "Allineare politiche agli obiettivi CBD e Kunming-Montreal Global Biodiversity Framework. Target: 30% aree protette entro 2030, riduzione perdita biodiversità, ripristino ecosistemi degradati.",
    },
  ],
  requiredEvidences: [
    "Politica aziendale biodiversità",
    "Biodiversity impact assessment",
    "Mappatura siti in aree protette (IBAT, Protected Planet)",
    "Piani di mitigazione e compensazione",
    "Report progetti ripristino ecosistemi (se applicabile)",
  ],
};

export default E4001;
