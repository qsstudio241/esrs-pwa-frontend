import { test, expect } from "@playwright/test";

test.describe("Materiality Matrix and Stakeholder Engagement", () => {
  test("materiality matrix basic functionality", async ({ page }) => {
    await page.goto("/");

    // Crea nuovo audit
    await page.getByText("Nuovo audit").click();
    await page.getByPlaceholder("Nome azienda").fill("Test Materiality Corp");
    await page.getByPlaceholder("Fatturato (EUR)").fill("15000000"); // Media impresa
    await page.getByPlaceholder("Dipendenti").fill("120");
    await page.getByPlaceholder("Totale attivo (EUR)").fill("10000000");
    await page.getByRole("button", { name: "Crea" }).click();

    // Naviga al tab materialità
    await page.getByRole("button", { name: "🎯 Analisi Materialità" }).click();

    // Verifica che la matrice di materialità sia visibile
    await expect(
      page.getByText("🎯 Doppia Matrice di Materialità (PDR 134:2022)")
    ).toBeVisible();

    // Verifica presenza temi default ESRS
    await expect(page.getByText("Cambiamenti Climatici")).toBeVisible();
    await expect(page.getByText("Forza Lavoro Propria")).toBeVisible();
    await expect(page.getByText("Condotta Aziendale")).toBeVisible();

    // Test modifica soglia materialità
    const thresholdSlider = page.locator('input[type="range"]');
    await thresholdSlider.fill("2.5");

    // Verifica che il valore sia aggiornato
    await expect(page.getByText("2.5")).toBeVisible();

    // Test modalità modifica posizioni
    await page.getByRole("button", { name: "✏️ Modifica Posizioni" }).click();
    await expect(
      page.getByText("🎯 Modalità Posizionamento Attiva")
    ).toBeVisible();

    // Verifica quadranti colorati
    const matrix = page
      .locator("div")
      .filter({ hasText: /Doppia Matrice di Materialità/ })
      .first();
    await expect(matrix).toBeVisible();

    console.log("✓ Materiality matrix basic functionality test completed");
  });

  test("materiality analysis and recommendations", async ({ page }) => {
    await page.goto("/");

    // Setup audit
    await page.getByText("Nuovo audit").click();
    await page.getByPlaceholder("Nome azienda").fill("Analysis Test Ltd");
    await page.getByPlaceholder("Fatturato (EUR)").fill("50000000"); // Grande impresa
    await page.getByPlaceholder("Dipendenti").fill("500");
    await page.getByPlaceholder("Totale attivo (EUR)").fill("40000000");
    await page.getByRole("button", { name: "Crea" }).click();

    // Vai a materialità
    await page.getByRole("button", { name: "🎯 Analisi Materialità" }).click();

    // Naviga al tab analisi
    await page.getByRole("button", { name: "📈 Analisi & Report" }).click();

    // Verifica presenza riepilogo esecutivo
    await expect(page.getByText("📋 Riepilogo Esecutivo")).toBeVisible();

    // Verifica contatori quadranti
    await expect(page.getByText("Temi Critici")).toBeVisible();
    await expect(page.getByText("Focus Impatto")).toBeVisible();
    await expect(page.getByText("Rilevanza Finanziaria")).toBeVisible();
    await expect(page.getByText("Monitoraggio")).toBeVisible();

    // Verifica raccomandazioni strategiche
    await expect(
      page.getByText("🎯 Raccomandazioni Strategiche")
    ).toBeVisible();

    // Test export report
    const [download] = await Promise.all([
      page.waitForEvent("download", { timeout: 10000 }),
      page.getByRole("button", { name: "📄 Export Report ESRS" }).click(),
    ]);

    expect(download).toBeDefined();
    expect(download.suggestedFilename()).toMatch(
      /MaterialityReport_\d{4}-\d{2}-\d{2}\.json/
    );

    console.log("✓ Materiality analysis and recommendations test completed");
  });

  test("survey builder functionality", async ({ page }) => {
    await page.goto("/");

    // Setup audit
    await page.getByText("Nuovo audit").click();
    await page.getByPlaceholder("Nome azienda").fill("Survey Test Corp");
    await page.getByPlaceholder("Fatturato (EUR)").fill("25000000");
    await page.getByPlaceholder("Dipendenti").fill("200");
    await page.getByPlaceholder("Totale attivo (EUR)").fill("15000000");
    await page.getByRole("button", { name: "Crea" }).click();

    // Vai a materialità
    await page.getByRole("button", { name: "🎯 Analisi Materialità" }).click();

    // Naviga al tab survey
    await page.getByRole("button", { name: "📊 Survey Stakeholder" }).click();

    // Verifica survey builder
    await expect(
      page.getByText("📊 Survey Builder - Stakeholder Engagement")
    ).toBeVisible();

    // Test creazione nuovo questionario
    await page.getByRole("button", { name: "+ Nuovo Questionario" }).click();

    // Verifica interfaccia creazione
    await expect(page.getByText("✏️ Creazione Questionario")).toBeVisible();
    await expect(page.getByText("ℹ️ Informazioni Generali")).toBeVisible();

    // Compila informazioni base
    await page
      .getByPlaceholder("es. Analisi Materialità 2025 - Stakeholder Survey")
      .fill("Test Survey Materialità 2025");
    await page
      .getByPlaceholder("Descrivi lo scopo del questionario...")
      .fill("Test survey per validare analisi materialità");

    // Seleziona gruppi stakeholder
    const stakeholderSelect = page.locator("select[multiple]");
    await stakeholderSelect.selectOption([
      "employees",
      "customers",
      "suppliers",
    ]);

    // Aggiungi domande
    await page.getByRole("button", { name: "+ Rating Materialità" }).click();

    // Verifica domanda aggiunta
    await expect(
      page.getByText("Domanda 1 - MATERIALITY RATING")
    ).toBeVisible();

    // Aggiungi feedback aperto
    await page.getByRole("button", { name: "+ Feedback Aperto" }).click();
    await expect(page.getByText("Domanda 2 - OPEN FEEDBACK")).toBeVisible();

    // Salva survey
    await page.getByRole("button", { name: "💾 Salva" }).click();

    // Verifica che il survey sia salvato
    await expect(page.getByText("Test Survey Materialità 2025")).toBeVisible();
    await expect(page.getByText("2 domande")).toBeVisible();

    console.log("✓ Survey builder functionality test completed");
  });

  test("materiality integration with audit data", async ({ page }) => {
    await page.goto("/");

    // Crea audit con dati specifici per test settore
    await page.getByText("Nuovo audit").click();
    await page
      .getByPlaceholder("Nome azienda")
      .fill("Manifattura Sostenibile SpA");
    await page.getByPlaceholder("Fatturato (EUR)").fill("30000000");
    await page.getByPlaceholder("Dipendenti").fill("300");
    await page.getByPlaceholder("Totale attivo (EUR)").fill("20000000");
    await page.getByRole("button", { name: "Crea" }).click();

    // Vai a materialità
    await page.getByRole("button", { name: "🎯 Analisi Materialità" }).click();

    // Verifica che i dati audit siano integrati
    await expect(page.getByText("Manifattura Sostenibile SpA")).toBeVisible();

    // Test persistenza dati materialità
    const customTopicButton = page.getByRole("button", {
      name: "+ Aggiungi Tema Custom",
    });
    await customTopicButton.click();

    // Simula input nome tema (tramite prompt dialog)
    page.on("dialog", async (dialog) => {
      expect(dialog.type()).toBe("prompt");
      await dialog.accept("Innovazione Digitale");
    });

    // Aggiungi tema personalizzato
    await customTopicButton.click();

    // Cambia tab per verificare persistenza
    await page.getByRole("button", { name: "📊 Survey Stakeholder" }).click();
    await page.getByRole("button", { name: "🎯 Matrice Materialità" }).click();

    // Verifica che i dati siano persistiti
    await expect(page.getByText("Innovazione Digitale")).toBeVisible();

    // Test completezza assessment
    const completenessIndicator = page
      .locator("div")
      .filter({ hasText: /\d+%/ })
      .filter({ hasText: /Completezza/ });
    await expect(completenessIndicator).toBeVisible();

    console.log("✓ Materiality integration with audit data test completed");
  });

  test("materiality validation and compliance", async ({ page }) => {
    await page.goto("/");

    // Setup audit
    await page.getByText("Nuovo audit").click();
    await page.getByPlaceholder("Nome azienda").fill("Compliance Test Inc");
    await page.getByPlaceholder("Fatturato (EUR)").fill("80000000"); // Grande impresa
    await page.getByPlaceholder("Dipendenti").fill("800");
    await page.getByPlaceholder("Totale attivo (EUR)").fill("60000000");
    await page.getByRole("button", { name: "Crea" }).click();

    // Vai a materialità
    await page.getByRole("button", { name: "🎯 Analisi Materialità" }).click();

    // Naviga all'analisi per verificare validazione
    await page.getByRole("button", { name: "📈 Analisi & Report" }).click();

    // Verifica che ci siano raccomandazioni per grandi imprese
    await expect(
      page.getByText("Grandi imprese soggette a tutti i requisiti ESRS")
    ).toBeVisible();

    // Test export report per compliance
    const [download] = await Promise.all([
      page.waitForEvent("download"),
      page.getByRole("button", { name: "📄 Export Report ESRS" }).click(),
    ]);

    // Verifica che il file sia scaricato
    expect(download.suggestedFilename()).toContain("MaterialityReport");

    // Salva e analizza contenuto
    const downloadPath = await download.path();
    expect(downloadPath).toBeTruthy();

    console.log("✓ Materiality validation and compliance test completed");
  });
});
