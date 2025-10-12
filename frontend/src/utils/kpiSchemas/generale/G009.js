/**
 * G009 - Collegamenti con altre parti della rendicontazione societaria
 * Requisiti trasversali ESRS 1
 */

const G009 = {
  kpiCode: "G009",
  categoryDescription: "Generale - Requisiti trasversali ESRS",
  title:
    "Collegamenti con altre parti della rendicontazione societaria e informazioni collegate",
  fields: [
    {
      key: "collegamenti_bilancio_presenti",
      label: "Collegamenti con bilancio finanziario presenti",
      type: "bool",
      required: true,
    },
    {
      key: "riferimenti_relazione_gestione",
      label: "Riferimenti a relazione sulla gestione",
      type: "bool",
      required: true,
    },
    {
      key: "riferimenti_governance",
      label: "Collegamenti con relazione governo societario",
      type: "bool",
      required: false,
    },
    {
      key: "coerenza_informazioni",
      label: "Coerenza tra dichiarazione sostenibilità e altri documenti",
      type: "bool",
      required: true,
    },
    {
      key: "riferimenti_incrociati_chiari",
      label: "Riferimenti incrociati chiari e precisi",
      type: "bool",
      required: true,
    },
  ],
  checks: [
    {
      code: "FINANCIAL_LINKS",
      severity: "error",
      message:
        "Obbligatorio collegare dichiarazione sostenibilità con bilancio finanziario",
      test: (i) => i.collegamenti_bilancio_presenti === true,
      actionPlan:
        "Creare collegamenti espliciti tra: impatti finanziari sostenibilità, investimenti green, accantonamenti rischi ESG, e relative voci di bilancio. Usare riferimenti precisi (es. 'vedi Nota X').",
    },
    {
      code: "MANAGEMENT_REPORT_LINKS",
      severity: "error",
      message: "Necessari riferimenti alla relazione sulla gestione",
      test: (i) => i.riferimenti_relazione_gestione === true,
      actionPlan:
        "Collegare strategia sostenibilità con strategia aziendale descritta in relazione gestione. Indicare sezioni rilevanti.",
    },
    {
      code: "CONSISTENCY",
      severity: "warning",
      message:
        "Le informazioni devono essere coerenti tra tutti i documenti societari",
      test: (i) => i.coerenza_informazioni === true,
      actionPlan:
        "Verificare che dati, obiettivi e narrazioni siano allineati tra dichiarazione sostenibilità, bilancio, relazione gestione. Risolvere eventuali discrepanze.",
    },
    {
      code: "CLEAR_REFERENCES",
      severity: "warning",
      message: "I riferimenti incrociati devono essere precisi e verificabili",
      test: (i) => i.riferimenti_incrociati_chiari === true,
      actionPlan:
        "Usare riferimenti precisi: numero pagina, sezione, nota. Evitare riferimenti generici tipo 'vedi relazione annuale'.",
    },
  ],
  requiredEvidences: [
    "Bilancio consolidato con note",
    "Relazione sulla gestione",
    "Matrice collegamenti documenti societari",
  ],
};

export default G009;
