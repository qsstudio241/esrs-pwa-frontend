/**
 * E2006 - Monitoraggio e reporting delle emissioni inquinanti
 * ESRS E2-6 - Inquinamento
 */

const E2006 = {
  kpiCode: "E2006",
  categoryDescription: "E2 - Inquinamento",
  title: "Monitoraggio e reporting delle emissioni inquinanti",
  fields: [
    {
      key: "sistema_monitoraggio_aria",
      label: "Sistema monitoraggio emissioni atmosferiche attivo",
      type: "bool",
      required: true,
    },
    {
      key: "sistema_monitoraggio_acqua",
      label: "Sistema monitoraggio scarichi idrici attivo",
      type: "bool",
      required: true,
    },
    {
      key: "frequenza_analisi_conforme",
      label: "Frequenza analisi conforme ad autorizzazioni",
      type: "bool",
      required: true,
    },
    {
      key: "reporting_autorita",
      label: "Reporting periodico ad autorità competenti (ARPA/Provincia)",
      type: "bool",
      required: true,
    },
    {
      key: "database_emissioni",
      label: "Database storico emissioni mantenuto",
      type: "bool",
      required: false,
    },
    {
      key: "superamenti_limiti",
      label: "Superamenti limiti nell'anno corrente",
      type: "bool",
      required: false,
    },
    {
      key: "azioni_correttive",
      label: "Azioni correttive implementate per non conformità",
      type: "bool",
      required: false,
    },
  ],
  checks: [
    {
      code: "MONITORING_SYSTEMS",
      severity: "error",
      message: "Sistemi monitoraggio emissioni obbligatori per ESRS E2-6",
      test: (i) =>
        i.sistema_monitoraggio_aria &&
        i.sistema_monitoraggio_acqua &&
        i.frequenza_analisi_conforme,
      actionPlan:
        "Installare sistemi monitoraggio: SME (Sistema Monitoraggio Emissioni) per camini, campionamenti scarichi idrici. Rispettare frequenze autorizzative. Laboratori accreditati ACCREDIA.",
    },
    {
      code: "REPORTING_COMPLIANCE",
      severity: "error",
      message: "Reporting ad autorità obbligatorio per legge",
      test: (i) => i.reporting_autorita === true,
      actionPlan:
        "Inviare report periodici a ARPA/Provincia: dichiarazioni emissioni annuali, E-PRTR (se applicabile), MUD, comunicazioni superamenti. Rispettare scadenze normative.",
    },
    {
      code: "LIMIT_EXCEEDANCES",
      severity: "error",
      message: "Superamenti limiti richiedono azioni correttive immediate",
      test: (i) => !i.superamenti_limiti || i.azioni_correttive === true,
      actionPlan:
        "In caso superamento limiti: 1) Comunicazione immediata ad ARPA, 2) Analisi cause root cause, 3) Piano azioni correttive, 4) Implementazione urgente, 5) Verifica efficacia con nuove analisi.",
    },
    {
      code: "DATA_MANAGEMENT",
      severity: "info",
      message:
        "Database storico emissioni utile per trend analysis e conformità",
      test: (i) => i.database_emissioni === true,
      actionPlan:
        "Mantenere database con: dati analisi, certificati laboratorio, report, grafici trend, azioni correttive. Facilita reporting ESRS e risposta ispezioni.",
    },
  ],
  requiredEvidences: [
    "Report monitoraggio emissioni atmosferiche",
    "Certificati analisi scarichi idrici",
    "Comunicazioni ad ARPA/Provincia",
    "Database emissioni (opzionale)",
  ],
};

export default E2006;
