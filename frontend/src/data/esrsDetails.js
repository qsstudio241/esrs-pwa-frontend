// Dataset ESRS estratto da Checklist.js per modularizzazione
// TODO: Successivamente estendere/normalizzare struttura con ID univoci e metadati KPI

function slugify(str) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .substring(0, 60);
}

// Hash semplice (FNV-1a-like) per produrre un id breve ripetibile senza dipendenze terze
function hashShort(input) {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = (h + ((h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24))) >>> 0; // moltiplica per FNV prime
  }
  return ("0000000" + h.toString(16)).slice(-8);
}

const rawEsrsDetails = {
  Generale: [
    {
      item: "Categorie di principi di rendicontazione di sostenibilità, ambiti di rendicontazione e convenzioni redazionali",
      applicability: ["Micro", "Piccola", "Media", "Grande"],
      mandatory: true,
    },
    {
      item: "Caratteristiche qualitative delle informazioni",
      applicability: ["Micro", "Piccola", "Media", "Grande"],
      mandatory: true,
    },
    {
      item: "Doppia rilevanza come base per l'informativa sulla sostenibilità",
      applicability: ["Piccola", "Media", "Grande"],
      mandatory: true,
    },
    {
      item: "Dovere di diligenza",
      applicability: ["Media", "Grande"],
      mandatory: true,
    },
    {
      item: "Catena del valore",
      applicability: ["Media", "Grande"],
      mandatory: true,
    },
    {
      item: "Orizzonti temporali",
      applicability: ["Micro", "Piccola", "Media", "Grande"],
      mandatory: true,
    },
    {
      item: "Redazione e presentazione delle informazioni sulla sostenibilità",
      applicability: ["Micro", "Piccola", "Media", "Grande"],
      mandatory: true,
    },
    {
      item: "Struttura della dichiarazione di sostenibilità",
      applicability: ["Micro", "Piccola", "Media", "Grande"],
      mandatory: true,
    },
    {
      item: "Collegamenti con altre parti della rendicontazione societaria e informazioni collegate",
      applicability: ["Piccola", "Media", "Grande"],
      mandatory: true,
    },
    {
      item: "Disposizioni transitorie",
      applicability: ["Micro", "Piccola", "Media", "Grande"],
      mandatory: true,
    },
  ],
  S4: [
    {
      item: "Consumatori e utilizzatori finali",
      applicability: ["Media", "Grande"],
      mandatory: true,
    },
    {
      item: "Politiche per la gestione degli impatti materiali, rischi e opportunità legati ai consumatori e agli utilizzatori finali",
      applicability: ["Media", "Grande"],
      mandatory: true,
    },
    {
      item: "Processi per l'impegno con i consumatori e gli utilizzatori finali riguardo agli impatti materiali",
      applicability: ["Media", "Grande"],
      mandatory: true,
    },
    {
      item: "Processi per rimediare agli impatti negativi materiali e canali per i consumatori e gli utilizzatori finali per esprimere preoccupazioni",
      applicability: ["Media", "Grande"],
      mandatory: true,
    },
    {
      item: "Azioni per la gestione degli impatti materiali e approcci alla mitigazione degli impatti negativi materiali per i consumatori e agli utilizzatori finali",
      applicability: ["Media", "Grande"],
      mandatory: true,
    },
    {
      item: "Obiettivi per la gestione degli impatti materiali, rischi e opportunità legati ai consumatori e agli utilizzatori finali",
      applicability: ["Media", "Grande"],
      mandatory: true,
    },
  ],
  G1: [
    {
      item: "Condotta delle imprese",
      applicability: ["Piccola", "Media", "Grande"],
      mandatory: true,
    },
    {
      item: "Politiche per la gestione degli impatti materiali, rischi e opportunità legati alla condotta delle imprese",
      applicability: ["Piccola", "Media", "Grande"],
      mandatory: true,
    },
    {
      item: "Processi per la gestione degli impatti materiali, rischi e opportunità legati alla condotta delle imprese",
      applicability: ["Piccola", "Media", "Grande"],
      mandatory: true,
    },
    {
      item: "Azioni per la gestione degli impatti materiali e approcci alla mitigazione degli impatti negativi materiali per la condotta delle imprese",
      applicability: ["Piccola", "Media", "Grande"],
      mandatory: true,
    },
    {
      item: "Obiettivi per la gestione degli impatti materiali, rischi e opportunità legati alla condotta delle imprese",
      applicability: ["Piccola", "Media", "Grande"],
      mandatory: true,
    },
    {
      item: "Cultura aziendale",
      applicability: ["Media", "Grande"],
      mandatory: true,
    },
    {
      item: "Gestione dei rapporti con i fornitori",
      applicability: ["Grande"],
      mandatory: true,
    },
    {
      item: "Formazione e sensibilizzazione su anti-corruzione e anti-bribery",
      applicability: ["Media", "Grande"],
      mandatory: true,
    },
    {
      item: "Incidenti di corruzione o bribery",
      applicability: ["Media", "Grande"],
      mandatory: true,
    },
    {
      item: "Attività di lobbying",
      applicability: ["Grande"],
      mandatory: true,
    },
    {
      item: "Pratiche di pagamento",
      applicability: ["Media", "Grande"],
      mandatory: true,
    },
  ],
};

// Arricchisce ogni item con itemId deterministico basato su category + slug label
function buildDataset() {
  const out = {};
  Object.keys(rawEsrsDetails).forEach((category) => {
    out[category] = rawEsrsDetails[category].map((entry, idx) => {
      const slug = slugify(entry.item);
      const base = `${category}-${slug}-${idx}`; // idx garantisce unicità anche se label duplicate
      const itemId = `${hashShort(base)}_${slug}`; // es: a1b2c3d4-cultura-aziendale
      return { ...entry, itemId };
    });
  });
  return out;
}

const esrsDetails = buildDataset();

// Helpers per arricchimento runtime
function classify(label) {
  const l = String(label || "").toLowerCase();
  if (l.includes("politich")) return "policy";
  if (l.includes("azione") || l.includes("intervento")) return "action";
  if (l.includes("obiettivo") || l.includes("target")) return "target";
  if (
    l.includes("monitoragg") ||
    l.includes("inventar") ||
    l.includes("indic") ||
    l.includes("kpi") ||
    l.includes("misur") ||
    l.includes("report")
  )
    return "metric";
  return "general";
}

function withEsrs2(categories) {
  if (categories["ESRS-2"]) return categories;
  categories["ESRS-2"] = [
    { item: "Ruoli e responsabilità di governance", classification: "general" },
    {
      item: "Strategia e modello di business (sintesi)",
      classification: "general",
    },
    {
      item: "Gestione impatti, rischi e opportunità (processo)",
      classification: "action",
    },
    { item: "Metriche e target (panoramica)", classification: "metric" },
    {
      item: "Politiche e azioni su impatti/rischi materiali",
      classification: "policy",
    },
    {
      item: "Catena del valore e confini di reporting",
      classification: "general",
    },
  ];
  return categories;
}

export function getEsrsDataset() {
  // Clona e arricchisce: classification + ESRS-2 + metadata
  const categories = withEsrs2(JSON.parse(JSON.stringify(esrsDetails)));
  let total = 0;
  Object.keys(categories).forEach((cat) => {
    categories[cat] = (categories[cat] || []).map((it, idx) => {
      const label = it.item || it.title || "";
      const slug = slugify(label);
      const ensuredId =
        it.itemId || `${hashShort(`${cat}-${slug}-${idx}`)}_${slug}`;
      return {
        ...it,
        itemId: ensuredId,
        classification: it.classification || classify(label),
      };
    });
    total += categories[cat].length;
  });
  const metadata = {
    name: "ESRS Dataset",
    datasetSchemaVersion: 2,
    totalItems: total,
    lastAugmentedAt: new Date().toISOString(),
  };
  return { metadata, categories };
}

export function getEsrsDetails() {
  return esrsDetails;
}
export default esrsDetails;
