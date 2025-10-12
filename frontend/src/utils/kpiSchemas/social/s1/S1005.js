/**
 * S1005 - Obiettivi per la gestione degli impatti sulla forza lavoro
 * ESRS S1-5 - Forza Lavoro Propria
 */

const S1005 = {
  kpiCode: "S1005",
  categoryDescription: "S1 - Forza lavoro propria",
  title: "Obiettivi per la gestione degli impatti sulla forza lavoro",
  fields: [
    {
      key: "obiettivi_workforce_definiti",
      label: "Obiettivi gestione forza lavoro definiti",
      type: "bool",
      required: true,
    },
    {
      key: "target_salute_sicurezza",
      label: "Target riduzione infortuni/malattie professionali",
      type: "bool",
      required: false,
    },
    {
      key: "target_formazione",
      label: "Target ore formazione per dipendente/anno",
      type: "bool",
      required: false,
    },
    {
      key: "target_diversita",
      label: "Target diversità e inclusione (es. % donne in leadership)",
      type: "bool",
      required: false,
    },
    {
      key: "target_retention",
      label: "Target retention/riduzione turnover",
      type: "bool",
      required: false,
    },
    {
      key: "target_engagement",
      label: "Target employee engagement score",
      type: "bool",
      required: false,
    },
    {
      key: "anno_target",
      label: "Anno target raggiungimento obiettivi",
      type: "number",
      min: 2025,
      max: 2035,
      required: false,
    },
  ],
  checks: [
    {
      code: "WORKFORCE_TARGETS",
      severity: "error",
      message: "Obiettivi gestione forza lavoro obbligatori per ESRS S1-5",
      test: (i) => i.obiettivi_workforce_definiti === true,
      actionPlan:
        "Definire target quantitativi/qualitativi per impatti materiali su forza lavoro: salute sicurezza (zero infortuni gravi), formazione (40h/anno), diversità (30% donne manager entro 2030), engagement (>75% favorable).",
    },
    {
      code: "COMPREHENSIVE_TARGETS",
      severity: "warning",
      message: "Raccomandato target per almeno 3 aree chiave",
      test: (i) => {
        const count = [
          i.target_salute_sicurezza,
          i.target_formazione,
          i.target_diversita,
          i.target_retention,
          i.target_engagement,
        ].filter(Boolean).length;
        return count >= 3;
      },
      actionPlan:
        "Coprire aree prioritarie: 1) Salute sicurezza (indice infortuni <5), 2) Formazione (40h/anno medi), 3) Diversità (30% donne leadership), 4) Retention (turnover <10%), 5) Engagement (score >75%).",
    },
    {
      code: "TARGET_TIMELINE",
      severity: "info",
      message: "Stabilire timeline realistiche con milestone intermedi",
      test: (i) => i.anno_target !== undefined && i.anno_target <= 2030,
      actionPlan:
        "Definire roadmap: target anno per anno, milestone semestrali, KPI tracking, review periodiche, correzioni corso. Collegare a incentivi management.",
    },
  ],
  requiredEvidences: [
    "Documento obiettivi gestione forza lavoro",
    "Piano d'azione con timeline",
    "Dashboard KPI workforce (opzionale)",
  ],
};

export default S1005;
