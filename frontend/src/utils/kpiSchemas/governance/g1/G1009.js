// G1009 - Conflitti di interesse
const G1009 = {
  kpiCode: "G1009",
  categoryDescription: "G1 - Condotta aziendale",
  title: "Gestione conflitti di interesse",
  fields: [
    {
      key: "politica_conflitti_interesse",
      label: "Politica gestione conflitti di interesse adottata",
      type: "bool",
      required: true,
    },
    {
      key: "dichiarazioni_conflitti_richieste",
      label: "Dichiarazioni conflitti interesse richieste sistematicamente",
      type: "bool",
      required: true,
    },
    {
      key: "conflitti_dichiarati",
      label: "Numero conflitti di interesse dichiarati (anno)",
      type: "number",
      required: false,
      min: 0,
    },
    {
      key: "conflitti_gestiti",
      label: "Conflitti di interesse gestiti/risolti",
      type: "number",
      required: false,
      min: 0,
    },
    {
      key: "operazioni_parti_correlate",
      label: "Procedura operazioni con parti correlate implementata",
      type: "bool",
      required: false,
    },
    {
      key: "registro_regali_ospitalita",
      label: "Registro regali/ospitalità da terzi mantenuto",
      type: "bool",
      required: false,
    },
  ],
  checks: [
    {
      code: "CONFLICT_OF_INTEREST_POLICY_MANDATORY",
      severity: "error",
      message: "Politica conflitti di interesse obbligatoria",
      test: (inputs) => !!inputs.politica_conflitti_interesse,
      actionPlan:
        "Adottare politica conflitti interesse: definizione (personali/familiari, finanziari, outside activities), obbligo disclosure, gestione (recusal, divestment, monitoring). Applicazione: CdA, management, dipendenti. Codice etico. Sanzioni per non-disclosure.",
    },
    {
      code: "COI_DECLARATIONS_MANDATORY",
      severity: "error",
      message: "Dichiarazioni conflitti interesse obbligatorie",
      test: (inputs) => !!inputs.dichiarazioni_conflitti_richieste,
      actionPlan:
        "Richiedere dichiarazioni annuali conflitti interesse: CdA (obbligatorio per società quotate), management, funzioni sensibili (procurement, HR). Template strutturato: relazioni con fornitori/clienti/competitor, outside employment, investimenti, family relationships. Database centralizzato. Updates ad eventi.",
    },
    {
      code: "CONFLICTS_MANAGEMENT",
      severity: "warning",
      message: "Conflitti dichiarati richiedono gestione adeguata",
      test: (inputs) => {
        if (!inputs.conflitti_dichiarati || inputs.conflitti_dichiarati === 0)
          return true;
        if (!inputs.conflitti_gestiti) return false;
        return inputs.conflitti_gestiti >= inputs.conflitti_dichiarati;
      },
      actionPlan:
        "Gestire conflitti dichiarati: 1) Review (Compliance/Comitato Etico), 2) Azioni: recusal da decisioni, divestment asset, termination outside activity, monitoring, 3) Documentazione decisione, 4) Follow-up. Escalation management/CdA per conflict material. Transparency governance.",
    },
    {
      code: "RELATED_PARTY_TRANSACTIONS",
      severity: "warning",
      message: "Operazioni parti correlate richiedono procedura robusta",
      test: (inputs) => !!inputs.operazioni_parti_correlate,
      actionPlan:
        "Implementare procedura Related Party Transactions (IAS 24, Consob per quotate): 1) Identificazione parti correlate, 2) Valutazione condizioni market, 3) Pareri indipendenti per operazioni rilevanti, 4) Approvazione CdA/assemblea, 5) Disclosure. Evitare self-dealing. Audit scrutiny.",
    },
    {
      code: "GIFTS_AND_HOSPITALITY_REGISTRY",
      severity: "info",
      message: "Registro regali/ospitalità raccomandato per trasparenza",
      test: (inputs) => !!inputs.registro_regali_ospitalita,
      actionPlan:
        "Mantenere registro regali/ospitalità: threshold disclosure (es. €150), dettagli (donatore, occasione, valore stimato), approvazione manager. Limiti: no contanti, reasonableness, business purpose, no quid pro quo. Policy: rifiuto se conflitto/improprio. Rischio corruzione se excessive. Monitoring pattern.",
    },
  ],
  requiredEvidences: [
    "Politica conflitti di interesse",
    "Template dichiarazioni annuali",
    "Registro conflitti dichiarati e gestione",
    "Procedura operazioni parti correlate",
    "Registro regali/ospitalità (se applicabile)",
  ],
};

export default G1009;
