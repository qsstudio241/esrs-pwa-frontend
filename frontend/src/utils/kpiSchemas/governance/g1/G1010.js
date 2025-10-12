// G1010 - Protezione dati e cybersecurity
const G1010 = {
  kpiCode: "G1010",
  categoryDescription: "G1 - Condotta aziendale",
  title: "Protezione dati e cybersecurity",
  fields: [
    {
      key: "politica_cybersecurity_adottata",
      label: "Politica cybersecurity adottata",
      type: "bool",
      required: true,
    },
    {
      key: "certificazione_iso27001",
      label: "Certificazione ISO 27001 (Information Security)",
      type: "bool",
      required: false,
    },
    {
      key: "risk_assessment_cyber",
      label: "Risk assessment cybersecurity effettuato",
      type: "bool",
      required: true,
    },
    {
      key: "incidenti_cyber",
      label: "Incidenti cybersecurity significativi (anno)",
      type: "number",
      required: false,
      min: 0,
    },
    {
      key: "data_breach",
      label: "Data breach occorsi (anno)",
      type: "number",
      required: false,
      min: 0,
    },
    {
      key: "formazione_cybersecurity",
      label: "Formazione cybersecurity dipendenti erogata",
      type: "bool",
      required: false,
    },
    {
      key: "percentuale_dipendenti_formati_cyber",
      label: "Percentuale dipendenti formati cybersecurity (%)",
      type: "number",
      required: false,
      min: 0,
      max: 100,
      unit: "%",
    },
    {
      key: "piano_risposta_incidenti",
      label: "Piano risposta incidenti cyber (Incident Response Plan)",
      type: "bool",
      required: false,
    },
  ],
  checks: [
    {
      code: "CYBERSECURITY_POLICY_MANDATORY",
      severity: "error",
      message: "Politica cybersecurity obbligatoria (NIS2, GDPR)",
      test: (inputs) => !!inputs.politica_cybersecurity_adottata,
      actionPlan:
        "Adottare politica cybersecurity: governance (CISO/Security Officer), risk management, protezione asset informazioni, risposta incidenti. Conformità: Direttiva NIS2 (infrastrutture critiche), GDPR sicurezza dati, framework (NIST, ISO 27001). Approvazione CdA. Budget adeguato.",
    },
    {
      code: "CYBER_RISK_ASSESSMENT_MANDATORY",
      severity: "error",
      message: "Risk assessment cybersecurity obbligatorio",
      test: (inputs) => !!inputs.risk_assessment_cyber,
      actionPlan:
        "Effettuare cyber risk assessment: identificare asset critici, threat actors, vulnerabilities, probabilità/impatto. Framework: ISO 27005, NIST Cybersecurity Framework. Valutazione supply chain risks. Penetration testing, vulnerability scanning. Aggiornamento continuo (threat landscape evolve).",
    },
    {
      code: "CYBER_INCIDENTS_MINIMIZATION",
      severity: "warning",
      message: "Incidenti cyber devono essere minimizzati",
      test: (inputs) => !inputs.incidenti_cyber || inputs.incidenti_cyber === 0,
      actionPlan:
        "Prevenire incidenti cyber: 1) Perimeter security (firewall, IDS/IPS), 2) Access control (MFA, least privilege), 3) Patch management, 4) Backup/recovery, 5) Security monitoring (SIEM), 6) User awareness training. Incidenti comuni: phishing, ransomware, DDoS, insider threats. Cyber insurance considerare.",
    },
    {
      code: "DATA_BREACH_RESPONSE",
      severity: "error",
      message: "Data breach richiedono notifica e remediation immediata",
      test: (inputs) => !inputs.data_breach || inputs.data_breach === 0,
      actionPlan:
        "Per data breach: 1) Incident Response Team attivato, 2) Containment (isolare sistemi), 3) Notifica Garante entro 72h (GDPR), 4) Comunicazione interessati se alto rischio, 5) Forensics investigation, 6) Remediation vulnerabilità, 7) Lessons learned. Sanzioni: GDPR fino 4% fatturato, class actions, reputazione.",
    },
    {
      code: "CYBERSECURITY_TRAINING_RECOMMENDED",
      severity: "warning",
      message: "Formazione cybersecurity dipendenti raccomandata",
      test: (inputs) =>
        inputs.formazione_cybersecurity === true &&
        inputs.percentuale_dipendenti_formati_cyber >= 80,
      actionPlan:
        "Formare dipendenti cybersecurity: phishing recognition, password hygiene, social engineering, secure remote work, BYOD risks. Target: 100% dipendenti. Phishing simulations. Refresh annuale. Security awareness = first line of defense. Human error causa principale breach.",
    },
    {
      code: "INCIDENT_RESPONSE_PLAN",
      severity: "warning",
      message: "Piano risposta incidenti essenziale per business continuity",
      test: (inputs) => !!inputs.piano_risposta_incidenti,
      actionPlan:
        "Implementare Incident Response Plan: 1) Preparation (team, tools), 2) Detection/Analysis, 3) Containment, 4) Eradication, 5) Recovery, 6) Post-incident review. Playbooks per scenari (ransomware, data breach, DDoS). Testing regolare (tabletop exercises). Comunicazione crisi. Legal/PR involvement.",
    },
    {
      code: "ISO27001_CERTIFICATION",
      severity: "info",
      message: "Certificazione ISO 27001 raccomandata per Information Security",
      test: (inputs) => !!inputs.certificazione_iso27001,
      actionPlan:
        "Implementare ISO 27001 Information Security Management System: governance, risk assessment, controls (114 Annex A), monitoring, improvement. Certificazione terza parte. Benefici: systematic approach, compliance facilitato (GDPR, NIS2), fiducia clienti, competitive advantage. Audit annuali mantenimento.",
    },
  ],
  requiredEvidences: [
    "Politica cybersecurity",
    "Report risk assessment cyber",
    "Certificato ISO 27001 (se applicabile)",
    "Incident Response Plan",
    "Report incidenti/breach e gestione",
    "Registri formazione cybersecurity",
  ],
};

export default G1010;
