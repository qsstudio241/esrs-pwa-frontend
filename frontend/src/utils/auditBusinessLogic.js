// Funzioni di business logic per audit ESRS
import requisitiDimensioni from "../requisiti_dimensioni_esrs.json";

// Calcolo automatico della dimensione aziendale
// Regola: appartiene alla classe più piccola per cui soddisfa almeno 2 su 3 criteri (<= soglie)
// Ritorna: "Micro" | "Piccola" | "Media" | "Grande" oppure null se meno di 2 valori sono forniti
export function calcolaDimensioneAzienda({ fatturato, dipendenti, attivo }) {
  const norm = (v) => {
    if (v === null || v === undefined) return null;
    if (typeof v === "string" && v.trim() === "") return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  };
  const values = {
    fatturato: norm(fatturato),
    dipendenti: norm(dipendenti),
    attivo: norm(attivo),
  };

  const provided = [values.fatturato, values.dipendenti, values.attivo].filter(
    (v) => v !== null
  );
  if (provided.length < 2) return null;

  const keyMap = {
    fatturato: "fatturato_max",
    dipendenti: "dipendenti_max",
    attivo: "totale_attivo_max",
  };

  const qualifiesFor = (dimKey) => {
    const crit = requisitiDimensioni.dimensioni_aziendali[dimKey]?.criteri;
    if (!crit) return false;
    let matches = 0;
    let considered = 0;
    for (const k of ["fatturato", "dipendenti", "attivo"]) {
      const val = values[k];
      if (val === null) continue;
      considered += 1;
      const max = crit[keyMap[k]];
      if (max === null) continue; // per micro/piccola/media non accade; manteniamo per robustezza
      if (val <= max) matches += 1;
    }
    return considered >= 2 && matches >= 2;
  };

  if (qualifiesFor("micro")) return "Micro";
  if (qualifiesFor("piccola")) return "Piccola";
  if (qualifiesFor("media")) return "Media";
  return "Grande";
}

// Funzione per esportare selezioni in formato JSON
// Altre funzioni di business logic possono essere aggiunte qui
