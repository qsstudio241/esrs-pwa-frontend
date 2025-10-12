// G1005 - Relazioni con pubblica amministrazione e lobbying
const G1005 = {
  kpiCode: "G1005",
  categoryDescription: "G1 - Condotta aziendale",
  title: "Relazioni con pubblica amministrazione e lobbying",
  fields: [
    {
      key: "politica_lobbying_adottata",
      label: "Politica per relazioni con PA e attività di lobbying",
      type: "bool",
      required: false,
    },
    {
      key: "attivita_lobbying_svolta",
      label: "Attività di lobbying/rappresentanza interessi svolta",
      type: "bool",
      required: false,
    },
    {
      key: "spese_lobbying_anno",
      label: "Spese attività lobbying (€/anno)",
      type: "number",
      required: false,
      min: 0,
      unit: "€",
    },
    {
      key: "registro_lobbying_iscrizione",
      label: "Iscrizione registri trasparenza lobbying (UE, nazionali)",
      type: "bool",
      required: false,
    },
    {
      key: "contributi_politici",
      label: "Contributi a partiti/campagne politiche",
      type: "bool",
      required: false,
    },
    {
      key: "importo_contributi_politici",
      label: "Importo contributi politici (€/anno)",
      type: "number",
      required: false,
      min: 0,
      unit: "€",
    },
  ],
  checks: [
    {
      code: "LOBBYING_POLICY_RECOMMENDED",
      severity: "warning",
      message: "Politica lobbying raccomandata per trasparenza",
      test: (inputs) => {
        if (!inputs.attivita_lobbying_svolta) return true;
        return inputs.politica_lobbying_adottata === true;
      },
      actionPlan:
        "Se attività lobbying: adottare politica formale: principi (trasparenza, legalità, no corruzione), processi approvazione, disclosure, registro contatti PA. Codice di condotta lobbisti. Approvazione CdA. Comunicazione pubblica su posizioni policy advocacy.",
    },
    {
      code: "LOBBYING_TRANSPARENCY_REGISTRY",
      severity: "warning",
      message: "Iscrizione registri trasparenza lobbying raccomandata",
      test: (inputs) => {
        if (!inputs.attivita_lobbying_svolta) return true;
        if (!inputs.spese_lobbying_anno || inputs.spese_lobbying_anno < 10000)
          return true;
        return inputs.registro_lobbying_iscrizione === true;
      },
      actionPlan:
        "Per attività lobbying significativa (>€10k/anno): iscriversi a registri trasparenza. UE: Transparency Register (obbligatorio per accesso istituzioni). Italia: registro lobbisti (alcune Regioni). Disclosure: spese lobbying, temi, legislazione targeted. Compliance best practice.",
    },
    {
      code: "LOBBYING_DISCLOSURE",
      severity: "info",
      message: "Disclosure spese lobbying raccomandata per accountability",
      test: (inputs) => {
        if (!inputs.attivita_lobbying_svolta) return true;
        return inputs.spese_lobbying_anno !== undefined;
      },
      actionPlan:
        "Comunicare spese lobbying in bilancio sostenibilità o report annuale: importo totale, breakdown (membership associazioni, consulenti, eventi), principali temi advocacy. Aumenta accountability. Alcuni paesi: disclosure obbligatoria (es. US Lobbying Disclosure Act).",
    },
    {
      code: "POLITICAL_CONTRIBUTIONS_POLICY",
      severity: "warning",
      message: "Contributi politici richiedono policy chiara e disclosure",
      test: (inputs) => {
        if (!inputs.contributi_politici) return true;
        return inputs.importo_contributi_politici !== undefined;
      },
      actionPlan:
        "Per contributi politici: 1) Policy approvazione (CdA/Comitato Etico), 2) Criteri donazioni (coerenza valori aziendali, no quid pro quo), 3) Disclosure pubblica (beneficiari, importi), 4) Compliance limiti legali. Molte aziende: no political contributions policy. Rischio reputazionale.",
    },
    {
      code: "NO_CORRUPTION_IN_LOBBYING",
      severity: "error",
      message: "Attività lobbying devono escludere pratiche corruttive",
      test: (inputs) => {
        if (!inputs.attivita_lobbying_svolta) return true;
        // Se lobbying attivo, deve esserci policy
        return inputs.politica_lobbying_adottata === true;
      },
      actionPlan:
        "Garantire lobbying etico: no tangenti a funzionari pubblici, no pagamenti impropri, no conflitti interesse. Conformità leggi anticorruzione (US FCPA, UK Bribery Act, Convention OCSE). Due diligence lobbisti/consulenti. Training team governo affairs. Audit periodici.",
    },
  ],
  requiredEvidences: [
    "Politica lobbying/relazioni PA",
    "Registro contatti con PA (se applicabile)",
    "Report spese lobbying",
    "Certificati iscrizione registri trasparenza",
    "Report contributi politici (se applicabile)",
  ],
};

export default G1005;
