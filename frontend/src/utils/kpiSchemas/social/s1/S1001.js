/**
 * S1001 - Politiche per le condizioni di lavoro
 * ESRS S1-1 - Forza Lavoro Propria
 */

const S1001 = {
  kpiCode: "S1001",
  categoryDescription: "S1 - Forza lavoro propria",
  title: "Politiche per le condizioni di lavoro",
  fields: [
    {
      key: "politiche_lavoro_adottate",
      label: "Politiche condizioni di lavoro formalmente adottate",
      type: "bool",
      required: true,
    },
    {
      key: "rispetto_ccnl",
      label: "Applicazione CCNL di settore",
      type: "bool",
      required: true,
    },
    {
      key: "orari_lavoro_conformi",
      label: "Orari di lavoro conformi a normativa",
      type: "bool",
      required: true,
    },
    {
      key: "contratti_regolari",
      label: "Tutti i contratti regolari e documentati",
      type: "bool",
      required: true,
    },
    {
      key: "welfare_aziendale",
      label: "Programmi welfare aziendale attivi",
      type: "bool",
      required: false,
    },
    {
      key: "work_life_balance",
      label: "Politiche work-life balance implementate",
      type: "bool",
      required: false,
    },
  ],
  checks: [
    {
      code: "LABOR_POLICIES",
      severity: "error",
      message: "Politiche condizioni di lavoro obbligatorie per ESRS S1-1",
      test: (i) => i.politiche_lavoro_adottate === true,
      actionPlan:
        "Adottare politiche formali che coprano: orari lavoro, retribuzione equa, contratti regolari, salute sicurezza, non discriminazione, libertà associazione. Approvazione board e comunicazione dipendenti.",
    },
    {
      code: "CCNL_COMPLIANCE",
      severity: "error",
      message: "Applicazione CCNL obbligatoria per legge italiana",
      test: (i) =>
        i.rispetto_ccnl && i.orari_lavoro_conformi && i.contratti_regolari,
      actionPlan:
        "Applicare CCNL settore per retribuzione, classificazione, orari. Rispettare limiti orari (max 48h/settimana media, riposi). Contratti scritti depositati. Audit payroll periodici.",
    },
    {
      code: "WELFARE_RECOMMENDED",
      severity: "info",
      message: "Programmi welfare aumentano engagement e retention",
      test: (i) => i.welfare_aziendale === true,
      actionPlan:
        "Implementare welfare: flexible benefits, assicurazioni sanitarie integrative, contributi asili nido, buoni pasto, mobilità sostenibile. Vantaggi fiscali ex Art 51 TUIR.",
    },
    {
      code: "WORK_LIFE_BALANCE",
      severity: "info",
      message:
        "Politiche work-life balance migliorano benessere e produttività",
      test: (i) => i.work_life_balance === true,
      actionPlan:
        "Adottare: smart working/lavoro agile, orari flessibili, part-time volontario, congedi parentali estesi, permessi studio. Certificazione Family Audit opzionale.",
    },
  ],
  requiredEvidences: [
    "Documento politiche condizioni di lavoro",
    "CCNL applicato",
    "Registro contratti dipendenti",
    "Regolamento welfare (se applicabile)",
  ],
};

export default S1001;
