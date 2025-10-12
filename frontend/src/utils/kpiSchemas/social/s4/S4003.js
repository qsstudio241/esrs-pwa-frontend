// S4003 - Privacy e protezione dati consumatori
const S4003 = {
  kpiCode: "S4003",
  categoryDescription: "S4 - Consumatori e utenti finali",
  title: "Privacy e protezione dati consumatori",
  fields: [
    {
      key: "conformita_gdpr",
      label: "Conformità GDPR (Reg. UE 2016/679)",
      type: "bool",
      required: true,
    },
    {
      key: "dpo_nominato",
      label: "Data Protection Officer (DPO) nominato",
      type: "bool",
      required: false,
    },
    {
      key: "privacy_policy_pubblicata",
      label: "Privacy policy accessibile e aggiornata",
      type: "bool",
      required: true,
    },
    {
      key: "consenso_esplicito_dati",
      label: "Raccolta consenso esplicito per trattamento dati",
      type: "bool",
      required: true,
    },
    {
      key: "misure_sicurezza_dati",
      label: "Misure tecniche/organizzative sicurezza dati implementate",
      type: "bool",
      required: true,
    },
    {
      key: "data_breach_occorsi",
      label: "Data breach occorsi (anno)",
      type: "number",
      required: false,
      min: 0,
    },
    {
      key: "richieste_esercizio_diritti",
      label:
        "Richieste esercizio diritti privacy (accesso, cancellazione, ecc.)",
      type: "number",
      required: false,
      min: 0,
    },
    {
      key: "tempo_medio_risposta_diritti",
      label: "Tempo medio risposta richieste (giorni)",
      type: "number",
      required: false,
      min: 0,
      unit: "giorni",
    },
  ],
  checks: [
    {
      code: "GDPR_COMPLIANCE_MANDATORY",
      severity: "error",
      message: "Conformità GDPR obbligatoria (Reg. UE 2016/679)",
      test: (inputs) => !!inputs.conformita_gdpr,
      actionPlan:
        "Garantire conformità GDPR: 1) Lawfulness processing (consenso, legittimo interesse), 2) Principi (minimizzazione, accuratezza, limitazione conservazione), 3) Diritti interessati (accesso, cancellazione, portabilità), 4) Sicurezza, 5) Privacy by design. Sanzioni fino 4% fatturato.",
    },
    {
      code: "PRIVACY_POLICY_REQUIRED",
      severity: "error",
      message: "Privacy policy accessibile obbligatoria",
      test: (inputs) => !!inputs.privacy_policy_pubblicata,
      actionPlan:
        "Pubblicare privacy policy chiara e accessibile: identità titolare, finalità trattamento, base giuridica, categorie dati, destinatari, conservazione, diritti, reclamo Garante. Linguaggio semplice. Aggiornamento ad ogni modifica trattamento. Disponibile su sito web.",
    },
    {
      code: "EXPLICIT_CONSENT",
      severity: "error",
      message: "Consenso esplicito obbligatorio per trattamento dati",
      test: (inputs) => !!inputs.consenso_esplicito_dati,
      actionPlan:
        "Raccogliere consenso esplicito: opt-in (no pre-checked boxes), informato (dopo privacy policy), specifico (per finalità), revocabile. Documentare consensi. Cookie banner conforme: solo tecnici default, consenso per marketing/profilazione. No cookie wall.",
    },
    {
      code: "DATA_SECURITY_MEASURES",
      severity: "error",
      message: "Misure sicurezza dati obbligatorie (Art. 32 GDPR)",
      test: (inputs) => !!inputs.misure_sicurezza_dati,
      actionPlan:
        "Implementare misure sicurezza: pseudonimizzazione, cifratura, backup, access control, audit log. ISO 27001 raccomandato. Valutazione rischi regolare. Data Protection Impact Assessment (DPIA) per trattamenti alto rischio. Incident response plan.",
    },
    {
      code: "DATA_BREACH_NOTIFICATION",
      severity: "error",
      message: "Data breach richiedono notifica a Garante entro 72h",
      test: (inputs) => {
        if (!inputs.data_breach_occorsi || inputs.data_breach_occorsi === 0)
          return true;
        // Se ci sono breach, devono esserci misure sicurezza robuste
        return inputs.misure_sicurezza_dati === true;
      },
      actionPlan:
        "Per data breach: 1) Notifica Garante Privacy entro 72h (Art. 33 GDPR), 2) Comunicazione interessati se alto rischio (Art. 34), 3) Documentazione breach register, 4) Root cause analysis, 5) Azioni correttive. DPO coordina gestione. Sanzioni per mancata notifica.",
    },
    {
      code: "DPO_APPOINTMENT",
      severity: "warning",
      message: "Nomina DPO obbligatoria per trattamenti su larga scala",
      test: (inputs) => {
        // DPO obbligatorio per: PA, trattamenti larga scala, dati sensibili
        return inputs.dpo_nominato === true;
      },
      actionPlan:
        "Nominare DPO se: 1) Pubblica amministrazione, 2) Trattamenti larga scala dati personali, 3) Monitoraggio sistematico, 4) Dati sensibili (salute, biometrici, penali). Requisiti DPO: competenze giuridiche/tecniche, indipendenza. Contatti pubblici.",
    },
    {
      code: "DATA_SUBJECT_RIGHTS_RESPONSE",
      severity: "warning",
      message:
        "Risposta richieste esercizio diritti entro 1 mese (Art. 12 GDPR)",
      test: (inputs) => {
        if (
          !inputs.richieste_esercizio_diritti ||
          inputs.richieste_esercizio_diritti === 0
        )
          return true;
        return inputs.tempo_medio_risposta_diritti <= 30;
      },
      actionPlan:
        "Rispondere richieste diritti entro 1 mese (estendibile a 3 se complesso): accesso dati, rettifica, cancellazione (right to be forgotten), limitazione, portabilità, opposizione. Processo strutturato. Verifica identità richiedente. Documentazione risposte.",
    },
  ],
  requiredEvidences: [
    "Privacy policy pubblicata",
    "Registro trattamenti (Art. 30 GDPR)",
    "Evidenze consensi raccolti",
    "Documentazione misure sicurezza",
    "Registro data breach (se applicabile)",
    "Nomina DPO (se applicabile)",
  ],
};

export default S4003;
