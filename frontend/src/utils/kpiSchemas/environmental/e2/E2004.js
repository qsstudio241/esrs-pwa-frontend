/**
 * E2004 - Azioni per la gestione delle sostanze chimiche e dei materiali pericolosi
 * ESRS E2-4 - Inquinamento
 */

const E2004 = {
  kpiCode: "E2004",
  categoryDescription: "E2 - Inquinamento",
  title:
    "Azioni per la gestione delle sostanze chimiche e dei materiali pericolosi",
  fields: [
    {
      key: "inventario_sostanze",
      label: "Inventario sostanze chimiche aggiornato",
      type: "bool",
      required: true,
    },
    {
      key: "schede_sicurezza_disponibili",
      label: "Schede Dati Sicurezza (SDS) disponibili e aggiornate",
      type: "bool",
      required: true,
    },
    {
      key: "reach_compliance",
      label: "Conformità Regolamento REACH",
      type: "bool",
      required: true,
    },
    {
      key: "sostanze_svhc_utilizzate",
      label: "Uso sostanze SVHC (Substances of Very High Concern)",
      type: "bool",
      required: false,
    },
    {
      key: "piano_sostituzione_svhc",
      label: "Piano sostituzione sostanze pericolose esistente",
      type: "bool",
      required: false,
    },
    {
      key: "formazione_operatori",
      label: "Formazione operatori su gestione sostanze pericolose",
      type: "bool",
      required: true,
    },
  ],
  checks: [
    {
      code: "CHEMICALS_INVENTORY",
      severity: "error",
      message: "Inventario sostanze chimiche e SDS obbligatori per ESRS E2-4",
      test: (i) => i.inventario_sostanze && i.schede_sicurezza_disponibili,
      actionPlan:
        "Mantenere inventario aggiornato di tutte le sostanze chimiche utilizzate. Ottenere SDS da fornitori in lingua italiana. Rendere SDS accessibili agli operatori.",
    },
    {
      code: "REACH_COMPLIANCE",
      severity: "error",
      message: "Conformità REACH obbligatoria per aziende EU",
      test: (i) => i.reach_compliance === true,
      actionPlan:
        "Verificare registrazione sostanze >1t/anno. Comunicare usi a fornitori. Rispettare restrizioni Allegato XVII. Sostituire sostanze Candidate List SVHC quando possibile.",
    },
    {
      code: "SVHC_SUBSTITUTION",
      severity: "warning",
      message:
        "Raccomandato piano sostituzione sostanze molto preoccupanti (SVHC)",
      test: (i) =>
        !i.sostanze_svhc_utilizzate || i.piano_sostituzione_svhc === true,
      actionPlan:
        "Se utilizzate sostanze SVHC (Candidate List): 1) Valutare alternative più sicure, 2) Piano sostituzione con timeline, 3) Prioritizzare sostanze Authorization List, 4) Ricerca innovazione chimica sostenibile.",
    },
    {
      code: "OPERATOR_TRAINING",
      severity: "warning",
      message:
        "Formazione operatori essenziale per gestione sicura sostanze pericolose",
      test: (i) => i.formazione_operatori === true,
      actionPlan:
        "Erogare formazione su: rischi chimici, DPI corretti, procedure operative sicure, gestione emergenze, primo soccorso, smaltimento rifiuti pericolosi. Aggiornamento periodico.",
    },
  ],
  requiredEvidences: [
    "Inventario sostanze chimiche",
    "Raccolta Schede Dati Sicurezza (SDS)",
    "Dichiarazione conformità REACH",
    "Registri formazione operatori",
  ],
};

export default E2004;
