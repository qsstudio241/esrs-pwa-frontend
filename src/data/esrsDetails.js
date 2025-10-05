// Dataset ESRS modulare
// Fonte primaria: checklists/esrs-base.json (dinamica)
// Fallback: struttura minimale hardcoded
import esrsBase from "../checklists/esrs-base.json";

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

function fromEsrsBaseJson(json) {
  try {
    const categories = json.categories || {};
    const out = {};
    Object.keys(categories).forEach((catKey) => {
      const cat = categories[catKey];
      const items = Array.isArray(cat.items) ? cat.items : [];
      out[catKey] = items.map((it) => ({
        item: it.text,
        applicability: it.applicability || [
          "Micro",
          "Piccola",
          "Media",
          "Grande",
        ],
        mandatory: typeof it.mandatory === "boolean" ? it.mandatory : true,
      }));
    });
    return out;
  } catch (e) {
    console.warn(
      "Impossibile convertire esrs-base.json, uso fallback hardcoded",
      e
    );
    return null;
  }
}

const rawEsrsDetails = fromEsrsBaseJson(esrsBase) || {
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
