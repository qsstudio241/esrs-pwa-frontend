import { buildSnapshot } from "../utils/exporters";

describe("buildSnapshot", () => {
  const baseAudit = {
    azienda: "Acme SpA",
    dimensione: "Media",
    dataAvvio: "2025-01-10",
    stato: "In corso",
    comments: {
      "Generale-Categorie di principi di rendicontazione di sostenibilità, ambiti di rendicontazione e convenzioni redazionali":
        "Ok",
    },
    files: {
      "Generale-Categorie di principi di rendicontazione di sostenibilità, ambiti di rendicontazione e convenzioni redazionali":
        [{ name: "evidenza.pdf", size: 123 }],
    },
    completed: {
      "Generale-Categorie di principi di rendicontazione di sostenibilità, ambiti di rendicontazione e convenzioni redazionali": true,
    },
    exportHistory: [],
  };

  test("include meta schemaVersion=2 e migrazione", () => {
    const snap = buildSnapshot(baseAudit);
    expect(snap.meta.schemaVersion).toBe(2);
    expect(snap.meta.migratedFrom).toBe(1); // audit non aveva meta precedente
  });

  test("normalizza items con campi attesi", () => {
    const snap = buildSnapshot(baseAudit);
    expect(snap.items.length).toBe(1);
    const it = snap.items[0];
    expect(it.key).toContain("Generale");
    expect(it.comment).toBe("Ok");
    expect(it.files[0].name).toBe("evidenza.pdf");
    expect(typeof it.itemId === "string" || it.itemId === null).toBe(true);
  });

  test("gestisce audit vuoto", () => {
    expect(buildSnapshot(null)).toBeNull();
  });
});
