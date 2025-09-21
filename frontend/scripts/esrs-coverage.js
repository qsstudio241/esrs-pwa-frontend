/*
  ESRS Coverage Report
  - Reads src/checklists/esrs-base.json
  - Compares item.references against an expected ESRS reference map
  - Modes:
    - coarse (default): category-level expected refs (prefix or enumerated when available)
    - strict: DR-level for more categories (e.g., S4-1..6, G1-1..11)
  - Options:
    --mode=coarse|strict
    --normalize-esrs2 (merge G2..G5 into ESRS-2 for analysis)
  - Emits console table, JSON summary, and an HTML report
*/

const fs = require("fs");
const path = require("path");

function loadChecklist(fp) {
  const raw = fs.readFileSync(fp, "utf-8");
  return JSON.parse(raw);
}

// Expected references per category (coarse-grained, based on current dataset scope)
const expectedCoarse = {
  Generale: { count: 10, refs: ["ESRS 1"] },
  E1: {
    count: 6,
    refs: [
      "ESRS E1-1",
      "ESRS E1-2",
      "ESRS E1-3",
      "ESRS E1-4",
      "ESRS E1-5",
      "ESRS E1-6",
    ],
  },
  E2: {
    count: 6,
    refs: [
      "ESRS E2-1",
      "ESRS E2-2",
      "ESRS E2-3",
      "ESRS E2-4",
      "ESRS E2-5",
      "ESRS E2-6",
    ],
  },
  E3: { count: 2, refs: ["ESRS E3-1", "ESRS E3-2"] },
  E4: { count: 2, refs: ["ESRS E4-1", "ESRS E4-2"] },
  E5: { count: 2, refs: ["ESRS E5-1", "ESRS E5-2"] },
  S1: {
    count: 6,
    refs: [
      "ESRS S1-1",
      "ESRS S1-2",
      "ESRS S1-3",
      "ESRS S1-4",
      "ESRS S1-5",
      "ESRS S1-6",
    ],
  },
  S2: { count: 2, refs: ["ESRS S2-1", "ESRS S2-2"] },
  S3: { count: 2, refs: ["ESRS S3-1", "ESRS S3-2"] },
  S4: { count: 6, refs: ["ESRS S4"] },
  G1: { count: 11, refs: ["ESRS G1"] },
  G2: { count: 2, refs: ["ESRS G2-1", "ESRS G2-2"] },
  G3: { count: 2, refs: ["ESRS G3-1", "ESRS G3-2"] },
  G4: { count: 2, refs: ["ESRS G4-1", "ESRS G4-2"] },
  G5: { count: 2, refs: ["ESRS G5-1", "ESRS G5-2"] },
};

// Expected references per category (strict DR-level)
// Note: This is a pragmatic mapping aligned to the current dataset nomenclature.
// - S4 enumerated DRs S4-1..S4-6
// - G1 enumerated DRs G1-1..G1-11
// - ESRS-2 normalization supported via --normalize-esrs2 (uses G2..G5 refs)
const expectedStrict = {
  Generale: { count: 10, refs: ["ESRS 1"] },
  E1: {
    count: 6,
    refs: [
      "ESRS E1-1",
      "ESRS E1-2",
      "ESRS E1-3",
      "ESRS E1-4",
      "ESRS E1-5",
      "ESRS E1-6",
    ],
  },
  E2: {
    count: 6,
    refs: [
      "ESRS E2-1",
      "ESRS E2-2",
      "ESRS E2-3",
      "ESRS E2-4",
      "ESRS E2-5",
      "ESRS E2-6",
    ],
  },
  E3: { count: 2, refs: ["ESRS E3-1", "ESRS E3-2"] },
  E4: { count: 2, refs: ["ESRS E4-1", "ESRS E4-2"] },
  E5: { count: 2, refs: ["ESRS E5-1", "ESRS E5-2"] },
  S1: {
    count: 6,
    refs: [
      "ESRS S1-1",
      "ESRS S1-2",
      "ESRS S1-3",
      "ESRS S1-4",
      "ESRS S1-5",
      "ESRS S1-6",
    ],
  },
  S2: { count: 2, refs: ["ESRS S2-1", "ESRS S2-2"] },
  S3: { count: 2, refs: ["ESRS S3-1", "ESRS S3-2"] },
  // DR-level for S4 and G1
  S4: {
    count: 6,
    refs: [
      "ESRS S4-1",
      "ESRS S4-2",
      "ESRS S4-3",
      "ESRS S4-4",
      "ESRS S4-5",
      "ESRS S4-6",
    ],
  },
  G1: {
    count: 11,
    refs: [
      "ESRS G1-1",
      "ESRS G1-2",
      "ESRS G1-3",
      "ESRS G1-4",
      "ESRS G1-5",
      "ESRS G1-6",
      "ESRS G1-7",
      "ESRS G1-8",
      "ESRS G1-9",
      "ESRS G1-10",
      "ESRS G1-11",
    ],
  },
  G2: { count: 2, refs: ["ESRS G2-1", "ESRS G2-2"] },
  G3: { count: 2, refs: ["ESRS G3-1", "ESRS G3-2"] },
  G4: { count: 2, refs: ["ESRS G4-1", "ESRS G4-2"] },
  G5: { count: 2, refs: ["ESRS G5-1", "ESRS G5-2"] },
};

function parseArgs(argv) {
  const out = { mode: "coarse", normalizeEsrs2: false };
  for (const a of argv.slice(2)) {
    if (a.startsWith("--mode=")) out.mode = a.split("=")[1] || out.mode;
    else if (a === "--normalize-esrs2") out.normalizeEsrs2 = true;
  }
  return out;
}

function normalizeForESRS2(rawCategories) {
  const categories = JSON.parse(JSON.stringify(rawCategories || {}));
  const carriers = ["G2", "G3", "G4", "G5"];
  const merged = [];
  carriers.forEach((k) => {
    if (categories[k]?.items?.length) merged.push(...categories[k].items);
    delete categories[k];
  });
  if (merged.length) {
    categories["ESRS-2"] = categories["ESRS-2"] || {
      title: "Informative Generali",
      description:
        "Disclosure generali trasversali (Governance, Strategia, IRO, Metriche/Target)",
      code: "ESRS-2",
      items: [],
    };
    categories["ESRS-2"].items = [
      ...(categories["ESRS-2"].items || []),
      ...merged,
    ];
  }
  return categories;
}

function analyze(checklist, { expectedMap, normalizeEsrs2 }) {
  let categories = checklist.categories || {};
  if (normalizeEsrs2) categories = normalizeForESRS2(categories);
  const summary = [];
  let totalExpected = 0;
  // totalPresent intentionally omitted; we focus on per-category and meta

  for (const [catKey, catVal] of Object.entries(categories)) {
    const items = Array.isArray(catVal.items) ? catVal.items : [];
    const presentRefs = new Set(
      items.map((it) => (it.reference || "").trim()).filter(Boolean)
    );
    const exp = expectedMap[catKey];
    const row = {
      category: catKey,
      expectedCount: exp ? exp.count : null,
      presentCount: items.length,
    };
    if (exp) {
      totalExpected += exp.count;
      // For categories with enumerated refs, compute missing/extra
      const missing = [];
      // If refs list contains a single wildcard (e.g., 'ESRS S4'), consider presence by count
      if (exp.refs.length === 1 && !exp.refs[0].includes("-")) {
        // Non-enumerated: check count only and uniform prefix
        const prefix = exp.refs[0];
        const wrongPrefix = Array.from(presentRefs).filter(
          (r) => r && !r.startsWith(prefix)
        );
        row.prefixOk = wrongPrefix.length === 0;
        row.missingRefs = [];
        row.extraRefs = wrongPrefix;
        row.coverage = Math.min(1, items.length / exp.count);
      } else {
        for (const r of exp.refs) if (!presentRefs.has(r)) missing.push(r);
        const extra = Array.from(presentRefs).filter(
          (r) => !exp.refs.includes(r)
        );
        row.missingRefs = missing;
        row.extraRefs = extra;
        const covered = exp.refs.length - missing.length;
        row.coverage = covered / exp.refs.length;
      }
    } else {
      row.missingRefs = [];
      row.extraRefs = [];
      row.coverage = null;
    }
    summary.push(row);
  }

  const meta = checklist.metadata || {};
  const metaTotal = meta.totalItems;
  const actualTotal = Object.values(categories).reduce(
    (a, c) => a + (c.items?.length || 0),
    0
  );
  return { meta: { ...meta, metaTotal, actualTotal, totalExpected }, summary };
}

function asTableRows(result) {
  const rows = result.summary.map((r) => ({
    category: r.category,
    present: r.presentCount,
    expected: r.expectedCount ?? "-",
    coverage: r.coverage == null ? "-" : `${Math.round(r.coverage * 100)}%`,
    missing: (r.missingRefs || []).join(", "),
    extra: (r.extraRefs || []).join(", "),
  }));
  return rows;
}

function writeReports(result, outDir, options) {
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const jsonPath = path.join(outDir, "coverage-report.json");
  fs.writeFileSync(jsonPath, JSON.stringify({ ...result, options }, null, 2));

  const rows = asTableRows(result);
  const html = `<!doctype html><html><head><meta charset="utf-8"/><title>ESRS Coverage Report</title>
  <style>body{font-family:Arial, sans-serif;margin:24px} table{border-collapse:collapse} th,td{border:1px solid #ccc;padding:6px 8px} th{background:#f4f6f8}</style>
  </head><body>
  <h1>ESRS Coverage Report</h1>
  <p><b>Mode:</b> ${options.mode}$${
    options.normalizeEsrs2 ? " (normalized ESRS-2)" : ""
  }</p>
  <p><b>Checklist:</b> ${result.meta.name || ""} v${
    result.meta.version || ""
  }</p>
  <ul>
    <li>Metadata totalItems: ${result.meta.metaTotal}</li>
    <li>Actual items: ${result.meta.actualTotal}</li>
    <li>Total expected (coarse): ${result.meta.totalExpected}</li>
  </ul>
  <table>
   <thead><tr><th>Category</th><th>Present</th><th>Expected</th><th>Coverage</th><th>Missing refs</th><th>Extra refs</th></tr></thead>
   <tbody>
    ${rows
      .map(
        (r) =>
          `<tr><td>${r.category}</td><td>${r.present}</td><td>${r.expected}</td><td>${r.coverage}</td><td>${r.missing}</td><td>${r.extra}</td></tr>`
      )
      .join("")}
   </tbody>
  </table>
  <p style="margin-top:16px;color:#666">Note: Mappa attesa semplificata; per S4, G1 e Generale la verifica è per prefisso/numero.</p>
  </body></html>`;
  const htmlPath = path.join(outDir, "coverage-report.html");
  fs.writeFileSync(htmlPath, html);
  return { jsonPath, htmlPath };
}

function main() {
  const args = parseArgs(process.argv);
  const checklistPath = path.join(
    __dirname,
    "..",
    "src",
    "checklists",
    "esrs-base.json"
  );
  const checklist = loadChecklist(checklistPath);
  const expectedMap = args.mode === "strict" ? expectedStrict : expectedCoarse;
  const result = analyze(checklist, {
    expectedMap,
    normalizeEsrs2: !!args.normalizeEsrs2,
  });
  const outDir = path.join(__dirname, "..", "coverage-esrs");
  const { jsonPath, htmlPath } = writeReports(result, outDir, args);
  console.log(
    `\n=== ESRS Coverage (${args.mode}${
      args.normalizeEsrs2 ? ", normalized ESRS-2" : ""
    }) ===`
  );
  console.table(asTableRows(result));
  console.log("\nMeta:", result.meta);
  console.log(`\nReport JSON: ${jsonPath}`);
  console.log(`Report HTML: ${htmlPath}`);
}

if (require.main === module) {
  try {
    main();
  } catch (e) {
    console.error("Coverage script failed:", e);
    process.exit(1);
  }
}
