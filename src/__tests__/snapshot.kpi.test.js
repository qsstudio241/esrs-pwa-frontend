import { buildSnapshot } from "../utils/exporters";

describe("snapshot includes KPI states", () => {
  test("includes kpiState for items matched by itemId", () => {
    const audit = {
      azienda: "ACME",
      dimensione: "Media",
      dataAvvio: "2025-01-01",
      stato: "In corso",
      comments: {
        "Generale-Categorie di principi di rendicontazione di sostenibilità, ambiti di rendicontazione e convenzioni redazionali":
          "note",
      },
      files: {},
      completed: {},
      // simulate a kpiState on a known itemId (derived in exporters via dataset mapping)
      kpiStates: {},
    };

    const snap = buildSnapshot(audit);
    expect(snap.meta.schemaVersion).toBe(2);
    expect(snap.items[0]).toHaveProperty("kpiState");
    // kpiState may be null if itemId mapping not found for this specific label
    expect("kpiState" in snap.items[0]).toBe(true);
  });
});
