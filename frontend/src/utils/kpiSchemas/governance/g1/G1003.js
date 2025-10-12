// G1003 - Sistema di whistleblowing
const G1003 = {
  kpiCode: "G1003",
  categoryDescription: "G1 - Condotta aziendale",
  title: "Sistema di whistleblowing",
  fields: [
    {
      key: "canale_whistleblowing_attivo",
      label: "Canale di whistleblowing attivo",
      type: "bool",
      required: true,
    },
    {
      key: "conformita_direttiva_whistleblowing",
      label: "Conformità Direttiva UE 2019/1937 (whistleblowing)",
      type: "bool",
      required: true,
    },
    {
      key: "anonimato_garantito",
      label: "Anonimato segnalante garantito",
      type: "bool",
      required: true,
    },
    {
      key: "protezione_ritorsioni",
      label: "Protezione da ritorsioni implementata",
      type: "bool",
      required: true,
    },
    {
      key: "segnalazioni_ricevute",
      label: "Numero segnalazioni ricevute (anno)",
      type: "number",
      required: false,
      min: 0,
    },
    {
      key: "segnalazioni_fondate",
      label: "Numero segnalazioni fondate (anno)",
      type: "number",
      required: false,
      min: 0,
    },
    {
      key: "tempo_medio_gestione",
      label: "Tempo medio gestione segnalazioni (giorni)",
      type: "number",
      required: false,
      min: 0,
      unit: "giorni",
    },
  ],
  checks: [
    {
      code: "WHISTLEBLOWING_CHANNEL_MANDATORY",
      severity: "error",
      message:
        "Canale whistleblowing obbligatorio (Direttiva UE 2019/1937, L. 179/2017)",
      test: (inputs) => !!inputs.canale_whistleblowing_attivo,
      actionPlan:
        "Implementare whistleblowing channel: piattaforma dedicata (web, telefono, email criptata), accessibile a dipendenti e terze parti. Obbligatorio per aziende ≥50 dipendenti o settori regolamentati. Gestione da funzione indipendente o esterna.",
    },
    {
      code: "WHISTLEBLOWING_COMPLIANCE",
      severity: "error",
      message: "Conformità Direttiva whistleblowing obbligatoria",
      test: (inputs) => !!inputs.conformita_direttiva_whistleblowing,
      actionPlan:
        "Garantire conformità Direttiva UE 2019/1937 (recepita L. 179/2017 modificata D.Lgs 24/2023): canali interni/esterni, procedure chiare, riservatezza, divieto ritorsioni, gestione entro 3 mesi, feedback segnalante. Sanzioni per inadempienza.",
    },
    {
      code: "ANONYMITY_PROTECTION",
      severity: "error",
      message: "Anonimato segnalante obbligatorio per legge",
      test: (inputs) => !!inputs.anonimato_garantito,
      actionPlan:
        "Garantire anonimato/riservatezza: piattaforma con crittografia, identificativi anonimi, accesso limitato (Compliance Officer), no divulgazione identità. Eccezione: indagini giudiziarie. Comunicare garanzie riservatezza in policy.",
    },
    {
      code: "RETALIATION_PROHIBITION",
      severity: "error",
      message: "Protezione da ritorsioni obbligatoria (L. 179/2017)",
      test: (inputs) => !!inputs.protezione_ritorsioni,
      actionPlan:
        "Proteggere whistleblower da ritorsioni: no licenziamento, demansionamento, mobbing, discriminazione. Burden of proof su azienda. Sanzioni penali per ritorsioni. Comunicazione chiara protezioni. Monitoraggio post-segnalazione.",
    },
    {
      code: "REPORT_MANAGEMENT_TIMELINESS",
      severity: "warning",
      message: "Gestione segnalazioni entro 3 mesi (Direttiva UE)",
      test: (inputs) => {
        if (!inputs.tempo_medio_gestione) return true;
        return inputs.tempo_medio_gestione <= 90;
      },
      actionPlan:
        "Gestire segnalazioni entro 3 mesi: 1) Acknowledge entro 7gg, 2) Indagine preliminare, 3) Indagine approfondita se necessario, 4) Decisione e azioni, 5) Feedback a segnalante. Procedure formalizzate. Escalation per casi complessi.",
    },
    {
      code: "FOUNDED_REPORTS_ACTION",
      severity: "warning",
      message: "Segnalazioni fondate richiedono azioni correttive",
      test: (inputs) => {
        if (!inputs.segnalazioni_fondate || inputs.segnalazioni_fondate === 0)
          return true;
        // Se ci sono segnalazioni fondate, devono essere documentate e gestite
        return inputs.segnalazioni_fondate < inputs.segnalazioni_ricevute;
      },
      actionPlan:
        "Per segnalazioni fondate: 1) Sanzioni disciplinari (ammonizione, sospensione, licenziamento), 2) Remediation (restituzione, riparazione danni), 3) Rafforzamento controlli, 4) Comunicazione esiti (rispettando privacy). Reportistica a OdV/CdA.",
    },
  ],
  requiredEvidences: [
    "Procedura whistleblowing",
    "Piattaforma/canale whistleblowing attivo",
    "Policy protezione whistleblower",
    "Registro segnalazioni e gestione (anonimizzato)",
    "Report attività whistleblowing a OdV",
  ],
};

export default G1003;
