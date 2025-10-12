/**
 * E2003 - Politiche per la prevenzione e il controllo dell'inquinamento del suolo
 * ESRS E2-3 - Inquinamento
 */

const E2003 = {
  kpiCode: "E2003",
  categoryDescription: "E2 - Inquinamento",
  title:
    "Politiche per la prevenzione e il controllo dell'inquinamento del suolo",
  fields: [
    {
      key: "politiche_suolo_adottate",
      label: "Politiche prevenzione inquinamento suolo adottate",
      type: "bool",
      required: true,
    },
    {
      key: "analisi_suolo_condotte",
      label: "Analisi caratterizzazione suolo condotte",
      type: "bool",
      required: false,
    },
    {
      key: "siti_contaminati",
      label: "Presenza siti contaminati o potenzialmente contaminati",
      type: "bool",
      required: false,
    },
    {
      key: "piano_bonifiche",
      label: "Piano di bonifica/messa in sicurezza esistente",
      type: "bool",
      required: false,
    },
    {
      key: "prevenzione_spill",
      label: "Misure prevenzione sversamenti implementate",
      type: "bool",
      required: true,
    },
    {
      key: "gestione_stoccaggi",
      label: "Gestione sicura stoccaggi sostanze pericolose",
      type: "bool",
      required: true,
    },
  ],
  checks: [
    {
      code: "SOIL_POLICIES",
      severity: "error",
      message:
        "Politiche prevenzione inquinamento suolo obbligatorie per ESRS E2-3",
      test: (i) => i.politiche_suolo_adottate === true,
      actionPlan:
        "Adottare politiche per: prevenire contaminazione suolo, gestire sostanze pericolose, pavimentazioni impermeabili, bacini contenimento, procedure emergenza spill.",
    },
    {
      code: "CONTAMINATED_SITES",
      severity: "error",
      message:
        "Siti contaminati devono avere piano bonifica/messa in sicurezza",
      test: (i) => !i.siti_contaminati || i.piano_bonifiche === true,
      actionPlan:
        "Se presente contaminazione: 1) Notificare a Provincia/ARPA, 2) Condurre analisi rischio, 3) Redigere Piano Bonifica o MISE, 4) Implementare interventi, 5) Certificazione conformità.",
    },
    {
      code: "SPILL_PREVENTION",
      severity: "warning",
      message:
        "Misure prevenzione sversamenti e gestione sicura stoccaggi essenziali",
      test: (i) => i.prevenzione_spill && i.gestione_stoccaggi,
      actionPlan:
        "Implementare: bacini di contenimento serbatoi, pavimentazioni impermeabili, kit emergenza spill, procedure operative, formazione operatori, ispezioni periodiche.",
    },
  ],
  requiredEvidences: [
    "Politica gestione suolo",
    "Certificati analisi suolo (se applicabile)",
    "Piano bonifica/MISE (se siti contaminati)",
    "Procedure gestione emergenze ambientali",
  ],
};

export default E2003;
