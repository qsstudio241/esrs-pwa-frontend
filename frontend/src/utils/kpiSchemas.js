import esrsDetails from "../data/esrsDetails";
import { getSectoralKpiSchemas, detectIndustrySector } from "./sectoralKpis";

export function findItemId(category, labelStartsWith) {
  const items = esrsDetails[category] || [];
  const lower = labelStartsWith.toLowerCase();
  const found = items.find((it) =>
    (it.item || "").toLowerCase().startsWith(lower)
  );
  return found ? found.itemId : null;
}

// Schema fields: { key, label, type: 'bool'|'number'|'enum'|'text'|'date', required?, min?, max?, unit?, enum? }
// Custom checks per item implement normative consistency.
export function getKpiSchemasGenerale() {
  // Usa ID diretti dal JSON esrs-base.json invece di cercare per testo
  const idDoppia = "G003"; // Doppia rilevanza
  const idCatena = "G005"; // Catena del valore
  const idOrizzonti = "G006"; // Orizzonti temporali

  const schemas = {};
  if (idDoppia) {
    schemas[idDoppia] = {
      kpiCode: "G003", // Corrisponde all'ID nel JSON
      categoryDescription: "Generale - Requisiti trasversali ESRS",
      title: "Doppia rilevanza",
      fields: [
        {
          key: "valutazione_materialita_eseguita",
          label: "Valutazione materialità eseguita",
          type: "bool",
          required: true,
        },
        {
          key: "coinvolgimento_stakeholder",
          label: "Coinvolgimento stakeholder svolto",
          type: "bool",
          required: true,
        },
        {
          key: "metodologia",
          label: "Metodologia",
          type: "enum",
          enum: ["ESRS/CSRD", "Proprietaria", "Altro"],
          required: false,
        },
        { key: "data", label: "Data valutazione", type: "date" },
      ],
      checks: [
        {
          code: "DM_REQUIRED",
          severity: "error", // NUOVO: error | warning | info
          message:
            "La doppia materialità deve essere eseguita e coinvolgere gli stakeholder",
          test: (inputs) =>
            !!inputs.valutazione_materialita_eseguita &&
            !!inputs.coinvolgimento_stakeholder,
          actionPlan:
            "Pianificare workshop materialità con stakeholder interni/esterni entro 30gg. Coinvolgere: CFO, CSO, rappresentanti dipendenti, fornitori chiave, clienti.", // NUOVO
        },
        {
          code: "DM_METHODOLOGY_RECOMMENDED",
          severity: "warning",
          message:
            "Raccomandato specificare la metodologia utilizzata per la valutazione di materialità",
          test: (inputs) => !!inputs.metodologia,
          actionPlan:
            "Documentare la metodologia seguita (es. ESRS/CSRD, GRI, proprietaria). Allegare matrice di materialità e verbale stakeholder engagement.",
        },
      ],
      requiredEvidences: [
        "Matrice di Materialità",
        "Verbale Stakeholder Engagement",
      ], // NUOVO
    };
  }

  if (idCatena) {
    schemas[idCatena] = {
      kpiCode: "G005", // Corrisponde all'ID nel JSON
      categoryDescription: "Generale - Requisiti trasversali ESRS",
      title: "Catena del valore",
      fields: [
        {
          key: "confini_reporting_definiti",
          label: "Confini di reporting definiti",
          type: "bool",
          required: true,
        },
        {
          key: "copertura_upstream",
          label: "Copertura upstream",
          type: "number",
          min: 0,
          max: 100,
          unit: "%",
        },
        {
          key: "copertura_downstream",
          label: "Copertura downstream",
          type: "number",
          min: 0,
          max: 100,
          unit: "%",
        },
      ],
      checks: [
        {
          code: "BOUNDARIES_REQUIRED",
          severity: "error",
          message: "Definisci i confini di reporting",
          test: (i) => !!i.confini_reporting_definiti,
          actionPlan:
            "Mappare la catena del valore: fornitori critici (upstream), distributori e clienti (downstream). Definire % copertura per ogni segmento.",
        },
        {
          code: "COVERAGE_MIN",
          severity: "warning",
          message:
            "Copertura upstream e downstream raccomandata >= 80% per conformità ESRS",
          test: (i) =>
            (i.copertura_upstream ?? 0) >= 80 &&
            (i.copertura_downstream ?? 0) >= 80,
          actionPlan:
            "Estendere la copertura della catena del valore. Identificare fornitori/clienti mancanti con impatto significativo. Target: 80-100%.",
        },
        {
          code: "COVERAGE_INFO",
          severity: "info",
          message:
            "Best practice: copertura 100% per imprese grandi o settori ad alto impatto",
          test: (i) =>
            (i.copertura_upstream ?? 0) === 100 &&
            (i.copertura_downstream ?? 0) === 100,
        },
      ],
      requiredEvidences: [
        "Mappa Catena del Valore",
        "Elenco Fornitori Critici",
      ],
    };
  }

  if (idOrizzonti) {
    schemas[idOrizzonti] = {
      kpiCode: "G006", // Corrisponde all'ID nel JSON
      categoryDescription: "Generale - Requisiti trasversali ESRS",
      title: "Orizzonti temporali",
      fields: [
        {
          key: "orizzonte_breve_anni",
          label: "Breve (anni)",
          type: "number",
          min: 1,
          max: 3,
          required: true,
        },
        {
          key: "orizzonte_medio_anni",
          label: "Medio (anni)",
          type: "number",
          min: 3,
          max: 10,
          required: true,
        },
        {
          key: "orizzonte_lungo_anni",
          label: "Lungo (anni)",
          type: "number",
          min: 10,
          required: true,
        },
      ],
      checks: [
        {
          code: "RANGE_VALID",
          severity: "error",
          message:
            "Gli orizzonti devono essere crescenti: breve < medio < lungo",
          test: (i) =>
            i.orizzonte_breve_anni < i.orizzonte_medio_anni &&
            i.orizzonte_medio_anni < i.orizzonte_lungo_anni,
          actionPlan:
            "Correggere gli orizzonti temporali rispettando ordine crescente. Esempio: Breve=1-3 anni, Medio=3-10 anni, Lungo=10-30 anni.",
        },
        {
          code: "RECOMMENDED_RANGES",
          severity: "info",
          message:
            "Raccomandazione ESRS: Breve 1-3 anni, Medio 3-10 anni, Lungo >10 anni",
          test: (i) =>
            i.orizzonte_breve_anni <= 3 &&
            i.orizzonte_medio_anni >= 3 &&
            i.orizzonte_medio_anni <= 10 &&
            i.orizzonte_lungo_anni >= 10,
        },
      ],
      requiredEvidences: ["Documento Strategia Aziendale con Timeline"],
    };
  }

  return schemas;
}

// ==================== E1: CAMBIAMENTI CLIMATICI ====================
export function getKpiSchemasE1() {
  // Usa ID diretti dal JSON esrs-base.json
  const idPiano = "E1001"; // Piano di transizione
  const idInventario = "E1006"; // Inventario emissioni GHG

  const schemas = {};

  if (idPiano) {
    schemas[idPiano] = {
      kpiCode: "E1001",
      categoryDescription: "E1 - Cambiamenti Climatici",
      title: "Piano di transizione climatica",
      fields: [
        {
          key: "piano_esistente",
          label: "Piano transizione esistente",
          type: "bool",
          required: true,
        },
        {
          key: "target_net_zero",
          label: "Target Net Zero definito",
          type: "bool",
          required: true,
        },
        {
          key: "anno_target",
          label: "Anno target neutralità",
          type: "number",
          min: 2025,
          max: 2050,
          required: false,
        },
      ],
      checks: [
        {
          code: "TRANSITION_PLAN_REQUIRED",
          severity: "error",
          message: "Piano di transizione verso Net Zero obbligatorio per ESRS",
          test: (i) => !!i.piano_esistente && !!i.target_net_zero,
          actionPlan:
            "Sviluppare piano di transizione climatica con: baseline emissioni, target riduzione per scope, roadmap azioni, investimenti necessari. Allineamento SBTi raccomandato.",
        },
        {
          code: "TARGET_YEAR_2050",
          severity: "warning",
          message: "EU Green Deal richiede neutralità climatica entro 2050",
          test: (i) => !i.anno_target || i.anno_target <= 2050,
          actionPlan:
            "Allineare target a 2050 o prima. Definire obiettivi intermedi: -30% entro 2030, -55% entro 2040.",
        },
      ],
      requiredEvidences: [
        "Piano Transizione Climatica",
        "Target SBTi (se applicabile)",
      ],
    };
  }

  if (idInventario) {
    schemas[idInventario] = {
      kpiCode: "E1006",
      categoryDescription: "E1 - Cambiamenti Climatici",
      title: "Inventario emissioni GHG",
      fields: [
        {
          key: "scope1_calcolato",
          label: "Scope 1 calcolato",
          type: "bool",
          required: true,
        },
        {
          key: "scope2_calcolato",
          label: "Scope 2 calcolato",
          type: "bool",
          required: true,
        },
        {
          key: "scope3_calcolato",
          label: "Scope 3 calcolato",
          type: "bool",
          required: false,
        },
        {
          key: "scope1_tonnellate",
          label: "Scope 1",
          type: "number",
          min: 0,
          unit: "tCO2e",
        },
        {
          key: "scope2_tonnellate",
          label: "Scope 2",
          type: "number",
          min: 0,
          unit: "tCO2e",
        },
        {
          key: "scope3_tonnellate",
          label: "Scope 3",
          type: "number",
          min: 0,
          unit: "tCO2e",
        },
      ],
      checks: [
        {
          code: "SCOPE_1_2_MANDATORY",
          severity: "error",
          message: "Calcolo Scope 1 e 2 obbligatorio",
          test: (i) => !!i.scope1_calcolato && !!i.scope2_calcolato,
          actionPlan:
            "Calcolare emissioni Scope 1 (combustione diretta) e Scope 2 (energia acquistata) usando GHG Protocol. Tools: Carbon Trust, CDP.",
        },
        {
          code: "SCOPE_3_RECOMMENDED",
          severity: "warning",
          message:
            "Scope 3 fortemente raccomandato (spesso 70-90% delle emissioni totali)",
          test: (i) => !!i.scope3_calcolato,
          actionPlan:
            "Calcolare almeno categorie Scope 3 più rilevanti: acquisti, trasporti, uso prodotti. Standard GHG Protocol Scope 3.",
        },
        {
          code: "DATA_QUALITY",
          severity: "info",
          message:
            "Verificare qualità dati: usare fattori emissione aggiornati e dati primari quando possibile",
          test: () => true,
        },
      ],
      requiredEvidences: [
        "Inventario GHG certificato",
        "Report Carbon Footprint",
        "Fatture energia e carburanti",
      ],
    };
  }

  return schemas;
}

// ==================== E2: INQUINAMENTO ====================
export function getKpiSchemasE2() {
  // Usa ID diretti dal JSON esrs-base.json
  const idAtmosferico = "E2001"; // Inquinamento atmosferico

  const schemas = {};

  if (idAtmosferico) {
    schemas[idAtmosferico] = {
      kpiCode: "E2001",
      categoryDescription: "E2 - Inquinamento",
      title: "Inquinamento atmosferico",
      fields: [
        {
          key: "monitoraggio_attivo",
          label: "Monitoraggio emissioni attivo",
          type: "bool",
          required: true,
        },
        {
          key: "autorizzazioni_ambientali",
          label: "Autorizzazioni ambientali in regola",
          type: "bool",
          required: true,
        },
      ],
      checks: [
        {
          code: "MONITORING_REQUIRED",
          severity: "error",
          message: "Monitoraggio emissioni obbligatorio per legge",
          test: (i) => !!i.monitoraggio_attivo,
          actionPlan:
            "Installare sistema monitoraggio continuo (SME) o periodico secondo AIA. Verificare conformità limiti emissivi.",
        },
        {
          code: "PERMITS_VALID",
          severity: "error",
          message:
            "Autorizzazioni ambientali devono essere valide e aggiornate",
          test: (i) => !!i.autorizzazioni_ambientali,
          actionPlan:
            "Verificare scadenze AIA/AUA. Rinnovare autorizzazioni prima della scadenza. Controllo conformità limiti.",
        },
      ],
      requiredEvidences: [
        "AIA/AUA vigenti",
        "Report emissioni annuali",
        "Certificati analisi",
      ],
    };
  }

  return schemas;
}

// ==================== S1: FORZA LAVORO PROPRIA ====================
export function getKpiSchemasS1() {
  // Usa ID diretti dal JSON esrs-base.json
  const idSalute = "S1002"; // Salute e sicurezza sul lavoro

  const schemas = {};

  if (idSalute) {
    schemas[idSalute] = {
      kpiCode: "S1002",
      categoryDescription: "S1 - Forza lavoro propria",
      title: "Salute e sicurezza sul lavoro",
      fields: [
        {
          key: "dvr_aggiornato",
          label: "DVR aggiornato",
          type: "bool",
          required: true,
        },
        {
          key: "formazione_sicurezza_erogata",
          label: "Formazione sicurezza erogata",
          type: "bool",
          required: true,
        },
        {
          key: "infortuni_anno",
          label: "N. infortuni anno corrente",
          type: "number",
          min: 0,
        },
        {
          key: "ore_lavorate",
          label: "Ore lavorate totali",
          type: "number",
          min: 0,
        },
      ],
      checks: [
        {
          code: "DVR_MANDATORY",
          severity: "error",
          message: "DVR obbligatorio per D.Lgs 81/2008",
          test: (i) => !!i.dvr_aggiornato,
          actionPlan:
            "Aggiornare DVR entro 30gg. Coinvolgere RSPP, MC, RLS. Revisione obbligatoria ogni anno o a modifiche significative.",
        },
        {
          code: "TRAINING_REQUIRED",
          severity: "error",
          message: "Formazione sicurezza obbligatoria per tutti i lavoratori",
          test: (i) => !!i.formazione_sicurezza_erogata,
          actionPlan:
            "Erogare formazione generale (4h) + specifica per rischio basso/medio/alto. Aggiornamento ogni 5 anni. Tracciare attestati.",
        },
        {
          code: "INJURY_RATE",
          severity: "warning",
          message: "Indice infortuni superiore a media settore (threshold 10)",
          test: (i) => {
            if (!i.ore_lavorate || i.ore_lavorate === 0) return true;
            const rate = (i.infortuni_anno / i.ore_lavorate) * 1000000;
            return rate <= 10;
          },
          actionPlan:
            "Analizzare cause infortuni con near-miss analysis. Implementare azioni correttive. Target: indice < 10 (infortuni/milione ore).",
        },
      ],
      requiredEvidences: [
        "DVR aggiornato",
        "Registro infortuni",
        "Attestati formazione",
      ],
    };
  }

  return schemas;
}

// ==================== G1: GOVERNANCE ====================
export function getKpiSchemasG1() {
  // Usa ID diretti dal JSON esrs-base.json
  const idGovernance = "G1001"; // Condotta delle imprese

  const schemas = {};

  if (idGovernance) {
    schemas[idGovernance] = {
      kpiCode: "G1001",
      categoryDescription: "G1 - Condotta aziendale",
      title: "Governance sostenibilità",
      fields: [
        {
          key: "comitato_sostenibilita",
          label: "Comitato sostenibilità costituito",
          type: "bool",
          required: false,
        },
        {
          key: "responsabile_sostenibilita",
          label: "Responsabile sostenibilità nominato",
          type: "bool",
          required: true,
        },
      ],
      checks: [
        {
          code: "RESPONSIBLE_REQUIRED",
          severity: "error",
          message: "Nominare responsabile sostenibilità aziendale",
          test: (i) => !!i.responsabile_sostenibilita,
          actionPlan:
            "Nominare CSO/Sustainability Manager con mandato formale CdA. Definire KPI, budget, team dedicato.",
        },
        {
          code: "COMMITTEE_RECOMMENDED",
          severity: "info",
          message:
            "Best practice: costituire comitato sostenibilità con membri senior",
          test: (i) => !!i.comitato_sostenibilita,
        },
      ],
      requiredEvidences: [
        "Organigramma con ruolo sostenibilità",
        "Verbali CdA",
      ],
    };
  }

  return schemas;
}

/**
 * Funzione principale per ottenere tutti i KPI per categoria
 */
export function getAllKpiSchemasByCategory(category) {
  const mapping = {
    Generale: getKpiSchemasGenerale,
    E1: getKpiSchemasE1,
    E2: getKpiSchemasE2,
    S1: getKpiSchemasS1,
    G1: getKpiSchemasG1,
  };

  const getter = mapping[category];
  return getter ? getter() : {};
}

/**
 * Funzione principale per ottenere tutti i KPI (generali + settoriali + tutti ESRS)
 */
export function getAllKpiSchemas(auditData) {
  const generaleSchemas = getKpiSchemasGenerale();
  const e1Schemas = getKpiSchemasE1();
  const e2Schemas = getKpiSchemasE2();
  const s1Schemas = getKpiSchemasS1();
  const g1Schemas = getKpiSchemasG1();

  // Rileva settore industriale e aggiungi KPI specifici
  const detectedSector = detectIndustrySector(auditData || {});
  const sectoralSchemas = getSectoralKpiSchemas(detectedSector);

  return {
    ...generaleSchemas,
    ...e1Schemas,
    ...e2Schemas,
    ...s1Schemas,
    ...g1Schemas,
    ...sectoralSchemas,
    _metadata: {
      detectedSector,
      totalSchemas:
        Object.keys(generaleSchemas).length +
        Object.keys(e1Schemas).length +
        Object.keys(e2Schemas).length +
        Object.keys(s1Schemas).length +
        Object.keys(g1Schemas).length +
        Object.keys(sectoralSchemas).length,
      categories: {
        Generale: Object.keys(generaleSchemas).length,
        E1: Object.keys(e1Schemas).length,
        E2: Object.keys(e2Schemas).length,
        S1: Object.keys(s1Schemas).length,
        G1: Object.keys(g1Schemas).length,
        Sectoral: Object.keys(sectoralSchemas).length,
      },
    },
  };
}
