import { getEsrsDataset } from "../data/esrsDetails";

describe("ESRS dataset augment", () => {
  test("metadata.totalItems equals computed count", () => {
    const ds = getEsrsDataset();
    const computed = Object.values(ds.categories).reduce(
      (acc, arr) => acc + (Array.isArray(arr) ? arr.length : 0),
      0
    );
    expect(ds.metadata.totalItems).toBe(computed);
  });

  test("each item has itemId and classification", () => {
    const ds = getEsrsDataset();
    const all = Object.values(ds.categories).flat();
    expect(all.length).toBeGreaterThan(0);
    expect(all.every((it) => typeof it.itemId === "string" && it.itemId)).toBe(
      true
    );
    expect(
      all.every((it) =>
        ["policy", "action", "target", "metric", "general"].includes(
          it.classification
        )
      )
    ).toBe(true);
  });

  test("ESRS-2 section exists with items", () => {
    const ds = getEsrsDataset();
    const key = Object.keys(ds.categories).find((k) =>
      k.toLowerCase().includes("esrs-2")
    );
    expect(!!key).toBe(true);
    expect((ds.categories[key] || []).length).toBeGreaterThan(0);
  });
});
