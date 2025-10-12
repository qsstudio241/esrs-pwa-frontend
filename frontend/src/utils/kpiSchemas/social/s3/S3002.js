// S3002 - Impatti su comunità interessate
const S3002 = {
  kpiCode: "S3002",
  categoryDescription: "S3 - Comunità interessate",
  title: "Impatti su comunità interessate",
  fields: [
    {
      key: "numero_comunita_impattate",
      label: "Numero di comunità identificate come impattate",
      type: "number",
      required: false,
      min: 0,
    },
    {
      key: "popolazione_comunita_impattate",
      label: "Popolazione totale comunità impattate (stima)",
      type: "number",
      required: false,
      min: 0,
    },
    {
      key: "impatti_negativi_identificati",
      label: "Impatti negativi su comunità identificati",
      type: "bool",
      required: false,
    },
    {
      key: "tipo_impatti_negativi",
      label: "Tipo di impatti negativi principali",
      type: "enum",
      required: false,
      enum: [
        "Nessun impatto significativo",
        "Inquinamento ambientale (aria, acqua, suolo)",
        "Rumore e vibrazioni",
        "Traffico veicolare",
        "Impatti su salute pubblica",
        "Espropri/ricollocamento",
        "Impatti su mezzi di sussistenza",
        "Multipli",
      ],
    },
    {
      key: "reclami_comunita_ricevuti",
      label: "Numero reclami ricevuti da comunità (anno)",
      type: "number",
      required: false,
      min: 0,
    },
    {
      key: "reclami_risolti",
      label: "Numero reclami risolti positivamente",
      type: "number",
      required: false,
      min: 0,
    },
    {
      key: "investimenti_comunita",
      label: "Investimenti in progetti per comunità (€/anno)",
      type: "number",
      required: false,
      min: 0,
      unit: "€",
    },
    {
      key: "occupazione_locale",
      label: "Percentuale dipendenti assunti da comunità locali (%)",
      type: "number",
      required: false,
      min: 0,
      max: 100,
      unit: "%",
    },
    {
      key: "acquisti_locali",
      label: "Percentuale acquisti da fornitori locali (%)",
      type: "number",
      required: false,
      min: 0,
      max: 100,
      unit: "%",
    },
    {
      key: "incidenti_comunita",
      label: "Incidenti rilevanti impattanti comunità (anno)",
      type: "number",
      required: false,
      min: 0,
    },
  ],
  checks: [
    {
      code: "NEGATIVE_IMPACTS_MANAGEMENT",
      severity: "error",
      message: "Impatti negativi su comunità richiedono azioni di mitigazione",
      test: (inputs) => {
        if (!inputs.impatti_negativi_identificati) return true;
        // Se ci sono impatti, devono esserci azioni (investimenti o % alta locale employment)
        return (
          inputs.investimenti_comunita > 0 || inputs.occupazione_locale >= 30
        );
      },
      actionPlan:
        "Per impatti negativi identificati: 1) Implementare misure mitigazione (es. barriere antirumore, filtri emissioni), 2) Compensazioni: investimenti comunità, occupazione locale, 3) Monitoraggio impatti con indicatori, 4) Reporting trasparente su azioni intraprese.",
    },
    {
      code: "GRIEVANCE_RESOLUTION",
      severity: "warning",
      message: "Reclami comunità richiedono risoluzione tempestiva",
      test: (inputs) => {
        if (
          !inputs.reclami_comunita_ricevuti ||
          inputs.reclami_comunita_ricevuti === 0
        )
          return true;
        if (!inputs.reclami_risolti) return false;
        // Almeno 80% reclami risolti
        const tasso =
          (inputs.reclami_risolti / inputs.reclami_comunita_ricevuti) * 100;
        return tasso >= 80;
      },
      actionPlan:
        "Gestire reclami comunità con efficacia: 1) Risposta entro 15gg, 2) Indagine e dialogo, 3) Azioni correttive concordate, 4) Follow-up. Target: ≥80% reclami risolti positivamente. Documentare processo e outcomes. Escalation per reclami complessi.",
    },
    {
      code: "ENVIRONMENTAL_INCIDENTS",
      severity: "error",
      message: "Incidenti impattanti comunità richiedono immediate azioni",
      test: (inputs) =>
        !inputs.incidenti_comunita || inputs.incidenti_comunita === 0,
      actionPlan:
        "Per incidenti rilevanti (fuoriuscite, emissioni anomale, incendi): 1) Comunicazione immediata comunità e autorità, 2) Attivazione emergenza, 3) Mitigazione impatti, 4) Indagine cause, 5) Azioni correttive, 6) Compensazioni se danni. Piano Emergenza Esterno D.Lgs 105/2015 (Seveso).",
    },
    {
      code: "AIR_WATER_POLLUTION_IMPACTS",
      severity: "warning",
      message: "Inquinamento ambientale su comunità richiede monitoraggio",
      test: (inputs) => {
        if (
          inputs.tipo_impatti_negativi ===
            "Inquinamento ambientale (aria, acqua, suolo)" ||
          inputs.tipo_impatti_negativi === "Impatti su salute pubblica" ||
          inputs.tipo_impatti_negativi === "Multipli"
        ) {
          // Serve monitoraggio attivo
          return inputs.investimenti_comunita > 0;
        }
        return true;
      },
      actionPlan:
        "Per impatti inquinamento su comunità: 1) Monitoraggio qualità aria/acqua in area, 2) Confronto con limiti protezione salute, 3) Tecnologie BAT per riduzione emissioni/scarichi, 4) Comunicazione dati monitoraggio a comunità. Health Risk Assessment per progetti critici.",
    },
    {
      code: "LOCAL_EMPLOYMENT",
      severity: "info",
      message: "Occupazione locale raccomandata per benefici comunità",
      test: (inputs) =>
        inputs.occupazione_locale !== undefined &&
        inputs.occupazione_locale >= 50,
      actionPlan:
        "Massimizzare occupazione locale: priorità assunzioni da comunità vicine (≥50% target). Benefici: riduzione impatti traffico pendolarismo, sviluppo economico locale, social license to operate. Programmi formazione per match skills locali-fabbisogni aziendali.",
    },
    {
      code: "LOCAL_PROCUREMENT",
      severity: "info",
      message: "Acquisti locali raccomandati per sviluppo economico area",
      test: (inputs) =>
        inputs.acquisti_locali !== undefined && inputs.acquisti_locali >= 30,
      actionPlan:
        "Favorire local sourcing: ≥30% acquisti da fornitori locali/regionali (dove qualità/prezzo competitivo). Benefici: sviluppo PMI locali, riduzione impatti logistica, relazioni comunità. Supporto qualificazione fornitori locali.",
    },
    {
      code: "COMMUNITY_INVESTMENT",
      severity: "info",
      message: "Investimenti in comunità raccomandati (shared value)",
      test: (inputs) =>
        inputs.investimenti_comunita !== undefined &&
        inputs.investimenti_comunita > 0,
      actionPlan:
        "Investire in progetti community: infrastrutture (strade, illuminazione), educazione (borse studio, laboratori scuole), sanità (ambulatori, screening), ambiente (riqualificazione aree verdi). Condivisione valore: benefici comunità e reputazione aziendale. Benchmark: 1% utile netto in community investment.",
    },
  ],
  requiredEvidences: [
    "Lista comunità impattate con popolazione",
    "Report monitoraggio impatti ambientali su area",
    "Registro reclami comunità e risoluzioni",
    "Report investimenti in progetti community",
    "Dati occupazione e acquisti locali",
    "Comunicazioni su incidenti (se applicabile)",
  ],
};

export default S3002;
