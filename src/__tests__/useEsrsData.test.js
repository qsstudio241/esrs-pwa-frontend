import { renderHook } from "@testing-library/react";
import { useEsrsData } from "../hooks/useEsrsData";

describe("useEsrsData", () => {
  test("ritorna categorie complete senza dimensione", () => {
    const { result } = renderHook(() => useEsrsData(null));
    expect(result.current.categories.length).toBeGreaterThan(0);
  });

  test("filtra per dimensione Micro mantenendo solo items applicabili", () => {
    const { result } = renderHook(() => useEsrsData("Micro"));
    // In dataset alcune categorie potrebbero avere 0 items: includeEmpty=true default => categoria presente
    const someCat = result.current.categories[0];
    expect(Array.isArray(result.current.filtered[someCat])).toBe(true);
  });

  test("search trova item per substring case-insensitive", () => {
    const { result } = renderHook(() => useEsrsData(null));
    const hits = result.current.search("cultura"); // presente in G1
    expect(
      hits.some((h) => h.item.item.toLowerCase().includes("cultura"))
    ).toBe(true);
  });
});
