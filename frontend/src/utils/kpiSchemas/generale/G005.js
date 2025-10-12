// G005 - Catena del valore
const G005 = {
  kpiCode: "G005",
  categoryDescription: "Generale - Requisiti trasversali ESRS",
  title: "Catena del valore",
  fields: [
    {
      key: "confini_reporting_definiti",
      label: "Confini di reporting definiti",
      type: "bool",
      required: true,
    },
    {
      key: "copertura_upstream",
      label: "Copertura upstream (%)",
      type: "number",
      min: 0,
      max: 100,
      unit: "%",
    },
    {
      key: "copertura_downstream",
      label: "Copertura downstream (%)",
      type: "number",
      min: 0,
      max: 100,
      unit: "%",
    },
  ],
  checks: [
    {
      code: "BOUNDARIES_REQUIRED",
      severity: "error",
      message: "Definizione confini di reporting obbligatoria per ESRS",
      test: (inputs) => !!inputs.confini_reporting_definiti,
      actionPlan:
        "Mappare la catena del valore completa: upstream (fornitori, sub-fornitori, materie prime) e downstream (distributori, clienti, fine vita prodotti). Definire percentuale copertura per ogni segmento rispetto a impatti totali.",
    },
    {
      code: "COVERAGE_MIN",
      severity: "warning",
      message:
        "Copertura upstream e downstream raccomandata ≥80% per conformità ESRS",
      test: (inputs) =>
        (inputs.copertura_upstream ?? 0) >= 80 &&
        (inputs.copertura_downstream ?? 0) >= 80,
      actionPlan:
        "Estendere la copertura della catena del valore. Identificare fornitori/clienti mancanti con impatto significativo ESG. Target: 80-100% copertura. Priorità: Tier 1 fornitori e distributori principali. Per PMI: fase progressiva.",
    },
    {
      code: "COVERAGE_INFO",
      severity: "info",
      message:
        "Best practice: copertura 100% per imprese grandi o settori ad alto impatto",
      test: (inputs) =>
        (inputs.copertura_upstream ?? 0) === 100 &&
        (inputs.copertura_downstream ?? 0) === 100,
      actionPlan:
        "Raggiungere copertura 100% catena valore: mappatura end-to-end da raw materials a end-of-life. Critico per: industria estrattiva, fashion, food, automotive. Utilizzare database supply chain, blockchain per tracciabilità. Reporting trasparente su gap copertura.",
    },
  ],
  requiredEvidences: [
    "Mappa catena del valore (value chain mapping)",
    "Elenco fornitori critici con impatti ESG",
    "Elenco distributori/clienti principali",
    "Analisi materialità per ogni segmento catena",
    "Percentuali copertura upstream/downstream documentate",
  ],
};

export default G005;
