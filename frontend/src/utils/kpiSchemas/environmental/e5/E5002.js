// E5002 - Flussi di risorse ed economia circolare
const E5002 = {
  kpiCode: "E5002",
  categoryDescription: "E5 - Economia circolare",
  title: "Flussi di risorse ed economia circolare",
  fields: [
    {
      key: "input_materiali_totali",
      label: "Input materiali totali (tonnellate/anno)",
      type: "number",
      required: true,
      min: 0,
      unit: "t",
    },
    {
      key: "materiali_rinnovabili",
      label: "Materiali rinnovabili utilizzati (tonnellate/anno)",
      type: "number",
      required: false,
      min: 0,
      unit: "t",
    },
    {
      key: "materiali_riciclati",
      label: "Materiali riciclati utilizzati (tonnellate/anno)",
      type: "number",
      required: false,
      min: 0,
      unit: "t",
    },
    {
      key: "percentuale_materiali_circolari",
      label: "Percentuale materiali circolari (rinnovabili + riciclati) (%)",
      type: "number",
      required: false,
      min: 0,
      max: 100,
      unit: "%",
    },
    {
      key: "rifiuti_totali",
      label: "Rifiuti totali prodotti (tonnellate/anno)",
      type: "number",
      required: true,
      min: 0,
      unit: "t",
    },
    {
      key: "rifiuti_pericolosi",
      label: "Rifiuti pericolosi (tonnellate/anno)",
      type: "number",
      required: false,
      min: 0,
      unit: "t",
    },
    {
      key: "rifiuti_riciclati",
      label: "Rifiuti avviati a riciclo (tonnellate/anno)",
      type: "number",
      required: false,
      min: 0,
      unit: "t",
    },
    {
      key: "rifiuti_smaltiti_discarica",
      label: "Rifiuti smaltiti in discarica (tonnellate/anno)",
      type: "number",
      required: false,
      min: 0,
      unit: "t",
    },
    {
      key: "tasso_riciclo",
      label: "Tasso di riciclo (%)",
      type: "number",
      required: false,
      min: 0,
      max: 100,
      unit: "%",
    },
    {
      key: "prodotti_fine_vita_raccolti",
      label: "Prodotti a fine vita raccolti e trattati (tonnellate/anno)",
      type: "number",
      required: false,
      min: 0,
      unit: "t",
    },
    {
      key: "imballaggi_riutilizzabili",
      label: "Utilizzo imballaggi riutilizzabili (%)",
      type: "number",
      required: false,
      min: 0,
      max: 100,
      unit: "%",
    },
  ],
  checks: [
    {
      code: "MATERIAL_INPUT_REQUIRED",
      severity: "error",
      message: "Misurazione input materiali totali obbligatoria per ESRS E5",
      test: (inputs) =>
        inputs.input_materiali_totali !== undefined &&
        inputs.input_materiali_totali >= 0,
      actionPlan:
        "Tracciare input materiali: materie prime, semilavorati, imballaggi. Distinguere per tipologia (metalli, plastiche, carta, ecc.). Sistema: material flow accounting. Report annuale flussi materiali.",
    },
    {
      code: "WASTE_TRACKING_REQUIRED",
      severity: "error",
      message: "Misurazione rifiuti totali obbligatoria",
      test: (inputs) =>
        inputs.rifiuti_totali !== undefined && inputs.rifiuti_totali >= 0,
      actionPlan:
        "Tracciare rifiuti prodotti per codice CER. Distinguere pericolosi/non pericolosi. Pesatura scarti produzione + rifiuti generici. Registri carico/scarico D.Lgs 152/2006. FIR per trasporti.",
    },
    {
      code: "HAZARDOUS_WASTE_MANAGEMENT",
      severity: "error",
      message: "Gestione rifiuti pericolosi richiede conformità normativa",
      test: (inputs) => {
        if (!inputs.rifiuti_pericolosi || inputs.rifiuti_pericolosi === 0)
          return true;
        // Verifica che rifiuti pericolosi non vadano in discarica
        if (!inputs.rifiuti_smaltiti_discarica) return true;
        return inputs.rifiuti_smaltiti_discarica === 0;
      },
      actionPlan:
        "Rifiuti pericolosi: deposito temporaneo conforme (max 30mc o 10t, max 1 anno). Trasporto con FIR. Smaltimento in impianti autorizzati. No discarica per pericolosi. Priorità: recupero vs smaltimento.",
    },
    {
      code: "CIRCULAR_MATERIALS_TARGET",
      severity: "warning",
      message: "Target materiali circolari raccomandato (≥30%)",
      test: (inputs) => {
        if (!inputs.percentuale_materiali_circolari) return false;
        return inputs.percentuale_materiali_circolari >= 30;
      },
      actionPlan:
        "Aumentare uso materiali circolari (rinnovabili + riciclati) al ≥30% input totali. Identificare fornitori materiali riciclati. Certificazioni: Recycled Claim Standard, FSC per rinnovabili. Calcolo: (rinnovabili + riciclati) / totali * 100.",
    },
    {
      code: "RECYCLING_RATE_TARGET",
      severity: "warning",
      message: "Tasso di riciclo raccomandato ≥70%",
      test: (inputs) => {
        if (!inputs.tasso_riciclo) return false;
        return inputs.tasso_riciclo >= 70;
      },
      actionPlan:
        "Target riciclo ≥70%: separazione rifiuti alla fonte, contratti con impianti recupero. Priorità waste hierarchy. Zero waste to landfill aspirazionale. Calcolo tasso: (riciclati / totali) * 100.",
    },
    {
      code: "ZERO_LANDFILL",
      severity: "warning",
      message: "Minimizzare smaltimento in discarica",
      test: (inputs) => {
        if (!inputs.rifiuti_totali || inputs.rifiuti_totali === 0) return true;
        if (!inputs.rifiuti_smaltiti_discarica) return true;
        const percentuale =
          (inputs.rifiuti_smaltiti_discarica / inputs.rifiuti_totali) * 100;
        return percentuale <= 5;
      },
      actionPlan:
        "Target: ≤5% rifiuti in discarica. Implementare zero waste to landfill program. Alternative: riciclo, compostaggio, recupero energetico. Solo residui non recuperabili in discarica.",
    },
    {
      code: "END_OF_LIFE_MANAGEMENT",
      severity: "info",
      message: "Gestione prodotti a fine vita raccomandata",
      test: (inputs) =>
        inputs.prodotti_fine_vita_raccolti !== undefined &&
        inputs.prodotti_fine_vita_raccolti > 0,
      actionPlan:
        "Implementare take-back schemes per prodotti fine vita. Conformità: RAEE per elettronici, imballaggi D.Lgs 152/2006. Priorità: ricondizionamento > riciclo > recupero. Extended Producer Responsibility.",
    },
    {
      code: "REUSABLE_PACKAGING",
      severity: "info",
      message: "Imballaggi riutilizzabili raccomandati",
      test: (inputs) =>
        inputs.imballaggi_riutilizzabili !== undefined &&
        inputs.imballaggi_riutilizzabili >= 20,
      actionPlan:
        "Aumentare imballaggi riutilizzabili: pallet, cassette, big bags. Target ≥20%. Sistemi pooling (es. EPAL, CHEP). Riduce rifiuti e costi. Reverse logistics per recupero.",
    },
  ],
  requiredEvidences: [
    "Report flussi materiali (Material Flow Analysis)",
    "Registri carico/scarico rifiuti",
    "FIR (Formulari Identificazione Rifiuti)",
    "Certificati recupero/smaltimento rifiuti",
    "Report take-back prodotti fine vita (se applicabile)",
    "Fatture acquisto materiali riciclati/rinnovabili",
  ],
};

export default E5002;
