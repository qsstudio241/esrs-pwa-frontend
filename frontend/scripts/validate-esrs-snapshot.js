#!/usr/bin/env node
/**
 * Uso:
 *   node scripts/validate-esrs-snapshot.js path\to\snapshot.json
 *
 * Valida uno snapshot export JSON (non il dataset sorgente).
 */
const fs = require("fs");
const path = require("path");

function fail(msg, code = 1) {
  console.error("[ERROR]", msg);
  process.exit(code);
}

function main() {
  const file = process.argv[2];
  if (!file) fail("Specifica il percorso dello snapshot JSON da validare.");

  const abs = path.resolve(process.cwd(), file);
  if (!fs.existsSync(abs)) fail(`File non trovato: ${abs}`);

  let data;
  try {
    data = JSON.parse(fs.readFileSync(abs, "utf8"));
  } catch (e) {
    fail(`JSON non valido: ${e.message}`);
  }

  const items = Array.isArray(data.items) ? data.items : [];
  if (items.length === 0) fail("Snapshot senza items.");

  // Unicità itemId
  const seen = new Set();
  const dupes = [];
  for (const it of items) {
    const id = it.itemId || it.id || null;
    if (!id) continue;
    if (seen.has(id)) dupes.push(id);
    else seen.add(id);
  }
  if (dupes.length)
    fail(`itemId duplicati: ${Array.from(new Set(dupes)).join(", ")}`);

  // Classification presente (consigliato)
  const missingClass = items.filter(
    (it) => !it.classification || typeof it.classification !== "string"
  );
  if (missingClass.length) {
    console.warn(
      `[WARN] ${missingClass.length} items senza classification (consigliato valorizzarla).`
    );
  }

  // Report categorie
  const byCat = new Map();
  for (const it of items) {
    const cat = it.category || "Sconosciuta";
    byCat.set(cat, (byCat.get(cat) || 0) + 1);
  }

  console.log("Validazione completata.");
  console.log(`- Items: ${items.length}`);
  console.log(`- Categorie: ${byCat.size}`);
  console.log("- Distribuzione per categoria:");
  for (const [k, v] of byCat.entries()) console.log(`  • ${k}: ${v}`);

  process.exit(0);
}

main();
