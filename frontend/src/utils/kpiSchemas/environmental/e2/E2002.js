/**
 * E2002 - Politiche per la prevenzione e il controllo dell'inquinamento idrico
 * ESRS E2-2 - Inquinamento
 */

const E2002 = {
  kpiCode: "E2002",
  categoryDescription: "E2 - Inquinamento",
  title: "Politiche per la prevenzione e il controllo dell'inquinamento idrico",
  fields: [
    {
      key: "politiche_acque_adottate",
      label: "Politiche prevenzione inquinamento idrico adottate",
      type: "bool",
      required: true,
    },
    {
      key: "autorizzazione_scarichi",
      label: "Autorizzazione scarichi idrici in regola",
      type: "bool",
      required: true,
    },
    {
      key: "trattamento_reflui",
      label: "Sistema trattamento reflui implementato",
      type: "bool",
      required: true,
    },
    {
      key: "monitoraggio_scarichi",
      label: "Monitoraggio qualità scarichi attivo",
      type: "bool",
      required: true,
    },
    {
      key: "conformita_limiti_tabella3",
      label: "Conformità limiti Tabella 3 Allegato 5 D.Lgs 152/06",
      type: "bool",
      required: false,
    },
  ],
  checks: [
    {
      code: "WATER_POLICIES",
      severity: "error",
      message:
        "Politiche prevenzione inquinamento idrico obbligatorie per ESRS E2-2",
      test: (i) => i.politiche_acque_adottate === true,
      actionPlan:
        "Adottare politiche formali per: prevenire contaminazione acque, gestire scarichi, minimizzare inquinanti, proteggere ecosistemi acquatici. Approvazione management.",
    },
    {
      code: "DISCHARGE_AUTHORIZATION",
      severity: "error",
      message: "Autorizzazione scarichi idrici obbligatoria per legge",
      test: (i) =>
        i.autorizzazione_scarichi &&
        i.trattamento_reflui &&
        i.monitoraggio_scarichi,
      actionPlan:
        "Ottenere autorizzazione scarichi (Provincia/Regione). Installare impianto depurazione adeguato. Monitorare parametri chimico-fisici e microbiologici secondo frequenze autorizzative.",
    },
    {
      code: "COMPLIANCE_LIMITS",
      severity: "warning",
      message:
        "Verificare conformità ai limiti tabellari per tutti gli inquinanti",
      test: (i) => i.conformita_limiti_tabella3 === true,
      actionPlan:
        "Analizzare scarichi per parametri rilevanti (BOD, COD, SST, metalli, nutrienti). Confrontare con limiti Tabella 3 D.Lgs 152/06 o più restrittivi regionali. Azioni correttive se non conformi.",
    },
  ],
  requiredEvidences: [
    "Politica gestione risorse idriche",
    "Autorizzazione scarichi idrici",
    "Certificati analisi scarichi",
    "Scheda impianto depurazione",
  ],
};

export default E2002;
