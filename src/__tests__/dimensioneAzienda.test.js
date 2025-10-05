import { calcolaDimensioneAzienda } from "../utils/auditBusinessLogic";

describe("calcolaDimensioneAzienda (2 su 3 criteri)", () => {
  test("Micro when meets >=2 criteria at or under thresholds", () => {
    expect(
      calcolaDimensioneAzienda({
        fatturato: 2_000_000,
        dipendenti: 10,
        attivo: 2_000_000,
      })
    ).toBe("Micro");
    expect(
      calcolaDimensioneAzienda({
        fatturato: 1_900_000,
        dipendenti: 9,
        attivo: 3_000_000,
      })
    ).toBe("Micro"); // 2 of 3 satisfied
  });

  test("Piccola when not Micro but meets small thresholds", () => {
    expect(
      calcolaDimensioneAzienda({
        fatturato: 5_000_000,
        dipendenti: 40,
        attivo: 5_000_000,
      })
    ).toBe("Piccola");
  });

  test("Media when not Micro/Piccola but meets medium thresholds", () => {
    expect(
      calcolaDimensioneAzienda({
        fatturato: 30_000_000,
        dipendenti: 200,
        attivo: 15_000_000,
      })
    ).toBe("Media");
  });

  test("Grande when 2 values provided but exceed previous classes", () => {
    expect(
      calcolaDimensioneAzienda({
        fatturato: 50_000_000,
        dipendenti: 10,
        attivo: 50_000_000,
      })
    ).toBe("Grande");
  });

  test("Returns null if fewer than 2 values provided", () => {
    expect(
      calcolaDimensioneAzienda({
        fatturato: 1_000_000,
        dipendenti: null,
        attivo: null,
      })
    ).toBe(null);
    expect(
      calcolaDimensioneAzienda({ fatturato: null, dipendenti: 5, attivo: null })
    ).toBe(null);
    expect(
      calcolaDimensioneAzienda({
        fatturato: null,
        dipendenti: null,
        attivo: 1_000_000,
      })
    ).toBe(null);
  });
});
