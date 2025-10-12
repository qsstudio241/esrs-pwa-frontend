/**
 * S1006 - Caratteristiche della forza lavoro (diversità, formazione, turnover)
 * ESRS S1-6 - Forza Lavoro Propria
 */

const S1006 = {
  kpiCode: "S1006",
  categoryDescription: "S1 - Forza lavoro propria",
  title: "Caratteristiche della forza lavoro (diversità, formazione, turnover)",
  fields: [
    {
      key: "numero_dipendenti",
      label: "Numero totale dipendenti (FTE)",
      type: "number",
      min: 0,
      required: true,
    },
    {
      key: "percentuale_donne",
      label: "% donne sul totale forza lavoro",
      type: "number",
      min: 0,
      max: 100,
      unit: "%",
      required: true,
    },
    {
      key: "percentuale_donne_management",
      label: "% donne in posizioni manageriali",
      type: "number",
      min: 0,
      max: 100,
      unit: "%",
      required: false,
    },
    {
      key: "eta_media",
      label: "Età media dipendenti",
      type: "number",
      min: 18,
      max: 70,
      unit: "anni",
      required: false,
    },
    {
      key: "ore_formazione_medie",
      label: "Ore formazione medie per dipendente/anno",
      type: "number",
      min: 0,
      unit: "h",
      required: true,
    },
    {
      key: "turnover_rate",
      label: "Tasso turnover annuale %",
      type: "number",
      min: 0,
      max: 100,
      unit: "%",
      required: false,
    },
    {
      key: "contratti_tempo_indeterminato",
      label: "% contratti tempo indeterminato",
      type: "number",
      min: 0,
      max: 100,
      unit: "%",
      required: false,
    },
  ],
  checks: [
    {
      code: "WORKFORCE_DATA",
      severity: "error",
      message: "Dati quantitativi forza lavoro obbligatori per ESRS S1-6",
      test: (i) =>
        i.numero_dipendenti !== undefined &&
        i.percentuale_donne !== undefined &&
        i.ore_formazione_medie !== undefined,
      actionPlan:
        "Raccogliere e rendicontare: headcount (FTE), composizione genere, età, anzianità, tipologia contrattuale. Dati formazione (ore totali/medie). Turnover entrate/uscite. Disaggregare per categoria professionale.",
    },
    {
      code: "GENDER_BALANCE",
      severity: "info",
      message:
        "Diversità di genere: target EU 40% donne in leadership entro 2026",
      test: (i) =>
        !i.percentuale_donne_management || i.percentuale_donne_management >= 30,
      actionPlan:
        "Monitorare % donne per livello gerarchico. Se <30% in management: talent pipeline femminile, mentoring, flexible working, obiettivi CEO. Target ambizioso: 40% (Direttiva EU Women on Boards).",
    },
    {
      code: "TRAINING_INVESTMENT",
      severity: "warning",
      message:
        "Investimento formazione: best practice >40h/anno per dipendente",
      test: (i) => i.ore_formazione_medie >= 40,
      actionPlan:
        "Aumentare formazione: upskilling digitale, leadership, sostenibilità, soft skills. Target 40h/anno. Tracciare partecipazione, valutare efficacia, budget dedicato (% payroll).",
    },
    {
      code: "TURNOVER_RATE",
      severity: "info",
      message: "Turnover elevato (>15%) indica problemi retention",
      test: (i) => !i.turnover_rate || i.turnover_rate <= 15,
      actionPlan:
        "Se turnover >15%: exit interviews per capire cause, retention plan (career path, retribuzione competitiva, work-life balance, clima), focus primi 90gg onboarding. Benchmark settore.",
    },
  ],
  requiredEvidences: [
    "Report dati forza lavoro (headcount, gender, età)",
    "Report formazione (ore/dipendente, tematiche)",
    "Report turnover (entrate/uscite, tasso %)",
  ],
};

export default S1006;
