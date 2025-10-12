/**
 * S1002 - Processi per la gestione della salute e sicurezza sul lavoro
 * ESRS S1-2 - Forza Lavoro Propria
 */

const S1002 = {
  kpiCode: "S1002",
  categoryDescription: "S1 - Forza lavoro propria",
  title: "Processi per la gestione della salute e sicurezza sul lavoro",
  fields: [
    {
      key: "dvr_aggiornato",
      label: "DVR (Documento Valutazione Rischi) aggiornato",
      type: "bool",
      required: true,
    },
    {
      key: "formazione_sicurezza_erogata",
      label: "Formazione sicurezza erogata a tutti i dipendenti",
      type: "bool",
      required: true,
    },
    {
      key: "infortuni_anno",
      label: "N. infortuni anno corrente",
      type: "number",
      min: 0,
    },
    {
      key: "ore_lavorate",
      label: "Ore lavorate totali",
      type: "number",
      min: 0,
    },
  ],
  checks: [
    {
      code: "DVR_MANDATORY",
      severity: "error",
      message: "DVR obbligatorio per D.Lgs 81/2008",
      test: (i) => !!i.dvr_aggiornato,
      actionPlan:
        "Aggiornare DVR entro 30gg. Coinvolgere RSPP, MC, RLS. Revisione obbligatoria ogni anno o a modifiche significative.",
    },
    {
      code: "TRAINING_REQUIRED",
      severity: "error",
      message: "Formazione sicurezza obbligatoria per tutti i lavoratori",
      test: (i) => !!i.formazione_sicurezza_erogata,
      actionPlan:
        "Erogare formazione generale (4h) + specifica per rischio basso/medio/alto. Aggiornamento ogni 5 anni. Tracciare attestati.",
    },
    {
      code: "INJURY_RATE",
      severity: "warning",
      message: "Indice infortuni superiore a media settore (threshold 10)",
      test: (i) => {
        if (!i.ore_lavorate || i.ore_lavorate === 0) return true;
        const rate = (i.infortuni_anno / i.ore_lavorate) * 1000000;
        return rate <= 10;
      },
      actionPlan:
        "Analizzare cause infortuni con near-miss analysis. Implementare azioni correttive. Target: indice < 10 (infortuni/milione ore).",
    },
  ],
  requiredEvidences: [
    "DVR aggiornato",
    "Registro infortuni",
    "Attestati formazione sicurezza",
    "Nomina RSPP e Medico Competente",
  ],
};

export default S1002;
