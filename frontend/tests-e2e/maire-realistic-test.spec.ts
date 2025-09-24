import { test, expect } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";
import * as mammoth from "mammoth";

// Test con azienda reale: Maire Tecnimont Group
// Basato sui dati del loro bilancio di sostenibilità 2024
// Permette di confrontare l'output della nostra app con un bilancio reale pubblicato

test("maire tecnimont - realistic sustainability report test", async ({
  page,
}) => {
  await page.goto("/");

  // Dati reali Maire Tecnimont Group (approssimativi da bilancio pubblico 2024)
  await page.getByText("Nuovo audit").click();
  await page
    .getByPlaceholder("Nome azienda")
    .fill("Maire Tecnimont Group S.p.A.");
  await page.getByPlaceholder("Fatturato (EUR)").fill("4200000000"); // ~4.2 miliardi EUR
  await page.getByPlaceholder("Dipendenti").fill("9500"); // ~9,500 dipendenti globali
  await page.getByPlaceholder("Totale attivo (EUR)").fill("3500000000"); // ~3.5 miliardi EUR
  await page.getByRole("button", { name: "Crea" }).click();

  // Enable beta UI
  const betaToggle = page.getByLabel("Usa nuova checklist (beta)");
  if (await betaToggle.isVisible()) {
    await betaToggle.check();
  }
  await expect(page.getByLabel("Checklist Refactored")).toBeVisible();

  // Compila checklist basandosi su contenuti tipici del bilancio Maire

  // 1. GENERALE - Governance e strategia (dovrebbero avere tutto)
  await page.getByText("Generale", { exact: true }).click();

  // Cerca e compila eventuali KPI nella sezione Generale
  const generaleKpiButtons = page.locator('button:has-text("Verifica KPI")');
  if ((await generaleKpiButtons.count()) > 0) {
    // Simula dati KPI realistici per grande gruppo industriale
    const numberInputs = page.locator('input[type="number"]');
    if ((await numberInputs.count()) > 0) {
      await numberInputs.first().fill("9500"); // Numero dipendenti
      if ((await numberInputs.count()) > 1) {
        await numberInputs.nth(1).fill("4200"); // Fatturato in milioni
      }
    }

    // Seleziona opzioni per grandi aziende quotate
    const selectInputs = page
      .locator("select")
      .filter({ hasNotText: "Maire Tecnimont" });
    for (let i = 0; i < Math.min(3, await selectInputs.count()); i++) {
      const options = await selectInputs.nth(i).locator("option").count();
      if (options > 2) {
        await selectInputs.nth(i).selectOption({ index: 1 }); // Seleziona prima opzione non vuota
      }
    }

    // Verifica KPI
    await generaleKpiButtons.first().click();
    await page.waitForTimeout(500);
  }

  // 2. AMBIENTE - E1 Climate Change (Maire ha impegni climatici significativi)
  await page.getByText("E1", { exact: true }).click();

  const e1Buttons = page
    .locator("button[aria-pressed]")
    .filter({ has: page.locator("text=—") });
  const e1Count = await e1Buttons.count();

  if (e1Count > 0) {
    // Compila ~80% degli elementi E1 come "conforme" (azienda matura)
    const toComplete = Math.floor(e1Count * 0.8);
    for (let i = 0; i < toComplete; i++) {
      await e1Buttons.nth(i).click(); // Primo click = "conforme"
      await page.waitForTimeout(200);
    }

    // Alcuni come "non conforme" (areas di miglioramento)
    for (let i = toComplete; i < Math.min(e1Count, toComplete + 2); i++) {
      await e1Buttons.nth(i).click(); // Primo click = "conforme"
      await page.waitForTimeout(100);
      await e1Buttons.nth(i).click(); // Secondo click = "non conforme"
      await page.waitForTimeout(200);
    }
  }

  // Aggiungi evidenza realistica per E1
  const e1EvidenceLabels = page.locator('label:has-text("Aggiungi evidenza")');
  if ((await e1EvidenceLabels.count()) > 0) {
    const testDir = path.join(__dirname, "temp-maire");
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true });
    }

    const evidenceFile = path.join(testDir, "maire_climate_strategy_2024.pdf");
    const evidenceContent = `MAIRE TECNIMONT GROUP - CLIMATE STRATEGY 2024

Commitment to Net Zero by 2050
- Science-based targets aligned with 1.5°C pathway
- 50% reduction in Scope 1&2 emissions by 2030 vs 2019 baseline
- Carbon neutrality roadmap for engineering operations

Key Initiatives:
• Renewable energy projects portfolio expansion
• Green hydrogen and circular economy technologies
• Sustainable chemistry and bio-refining solutions
• Carbon capture utilization and storage (CCUS)

Governance:
- Board-level ESG Committee oversight
- Executive sustainability targets linked to compensation
- Annual climate risk assessment and scenario analysis

This document supports ESRS E1 compliance for climate change adaptation and mitigation strategies.`;

    fs.writeFileSync(evidenceFile, evidenceContent);

    const fileInput = page.locator('input[type="file"]').first();
    await fileInput.setInputFiles(evidenceFile);
    await page.waitForTimeout(1000); // Wait for upload

    // Cleanup
    fs.unlinkSync(evidenceFile);
    if (fs.existsSync(testDir) && fs.readdirSync(testDir).length === 0) {
      fs.rmdirSync(testDir);
    }
  }

  // 3. SOCIALE - S1 Own Workforce (Maire ha forte focus su people development)
  await page.getByText("S1", { exact: true }).click();

  const s1Buttons = page
    .locator("button[aria-pressed]")
    .filter({ has: page.locator("text=—") });
  const s1Count = await s1Buttons.count();

  if (s1Count > 0) {
    // Compila ~90% come conforme (strong HR policies)
    const toComplete = Math.floor(s1Count * 0.9);
    for (let i = 0; i < toComplete; i++) {
      await s1Buttons.nth(i).click();
      await page.waitForTimeout(150);
    }
  }

  // 4. GOVERNANCE - G1 Business Conduct (Maire è quotata, dovrebbe avere governance solida)
  await page.getByText("G1", { exact: true }).click();

  const g1Buttons = page
    .locator("button[aria-pressed]")
    .filter({ has: page.locator("text=—") });
  const g1Count = await g1Buttons.count();

  if (g1Count > 0) {
    // Compila ~95% come conforme (listed company, strong governance)
    const toComplete = Math.floor(g1Count * 0.95);
    for (let i = 0; i < toComplete; i++) {
      await g1Buttons.nth(i).click();
      await page.waitForTimeout(150);
    }
  }

  // 5. Aggiungi commenti realistici su alcuni elementi
  await page.getByText("E1", { exact: true }).click();

  // Cerca campo commento per primo elemento E1
  const commentFields = page.locator('textarea, input[type="text"]').filter({
    has: page.locator(':text-matches("commento|note|osservazione", "i")'),
  });

  if ((await commentFields.count()) > 0) {
    await commentFields
      .first()
      .fill(
        "Maire Tecnimont ha definito una strategia climatica ambiziosa con target science-based e roadmap verso net-zero entro 2050. Particolare focus su tecnologie green hydrogen e CCUS."
      );
  }

  // Wait for all data to be saved
  await page.waitForTimeout(2000);

  // Export Word document
  const [wordDownload] = await Promise.all([
    page.waitForEvent("download", { timeout: 15000 }),
    page.getByRole("button", { name: "Esporta Word" }).click(),
  ]);

  expect(wordDownload).toBeDefined();
  expect(wordDownload.suggestedFilename()).toContain("Maire_Tecnimont");

  // Analizza il contenuto del documento generato
  const downloadPath = path.join(
    __dirname,
    "temp-analysis",
    wordDownload.suggestedFilename()
  );
  const downloadDir = path.dirname(downloadPath);
  if (!fs.existsSync(downloadDir)) {
    fs.mkdirSync(downloadDir, { recursive: true });
  }

  await wordDownload.saveAs(downloadPath);

  // Estrai contenuto e verifica elementi chiave del bilancio Maire
  const result = await mammoth.extractRawText({ path: downloadPath });
  const documentText = result.value;

  console.log("=== MAIRE TECNIMONT AUDIT REPORT ANALYSIS ===");
  console.log(`Document length: ${documentText.length} characters`);
  console.log(
    `File size: ${Math.round(fs.statSync(downloadPath).size / 1024)}KB`
  );

  // Verifica dati aziendali Maire
  expect(documentText).toContain("Maire Tecnimont Group S.p.A.");
  expect(documentText).toContain("Grande"); // Classificazione per fatturato >40M€ e dipendenti >250
  expect(documentText).toContain("4200000000"); // Fatturato
  expect(documentText).toContain("9500"); // Dipendenti

  // Verifica presenza sezioni ESRS chiave per grande azienda industriale
  const keyESRSSections = [
    "e1", // Climate change - critico per aziende industriali
    "s1", // Own workforce - importante per 9500+ dipendenti
    "g1", // Business conduct - essenziale per quotate
  ];

  for (const section of keyESRSSections) {
    const sectionFound =
      documentText.toLowerCase().includes(section) ||
      documentText.toLowerCase().includes(`esrs ${section}`);
    expect(sectionFound).toBeTruthy(
      `Sezione ${section.toUpperCase()} dovrebbe essere presente per azienda come Maire`
    );
  }

  // Verifica indicatori di completamento realistici per azienda matura
  expect(documentText).toMatch(/[3-9]\d%|100%/); // Completamento >30% per azienda quotata

  // Verifica presenza elementi tipici bilancio sostenibilità
  const sustainabilityKeywords = [
    "clima",
    "emissioni",
    "dipendenti",
    "governance",
    "sostenibilità",
    "ambiente",
    "sociale",
  ];

  let keywordMatches = 0;
  for (const keyword of sustainabilityKeywords) {
    if (documentText.toLowerCase().includes(keyword)) {
      keywordMatches++;
    }
  }

  expect(keywordMatches).toBeGreaterThan(3); // Almeno 4/7 parole chiave presenti

  // Cleanup
  fs.unlinkSync(downloadPath);
  if (fs.existsSync(downloadDir) && fs.readdirSync(downloadDir).length === 0) {
    fs.rmdirSync(downloadDir);
  }

  console.log("✅ Maire Tecnimont audit report generated successfully");
  console.log(`✅ Realistic data for large industrial group validated`);
  console.log(`✅ ESRS sections coverage appropriate for listed company`);
});

test("maire vs real sustainability report - key elements comparison", async ({
  page,
}) => {
  // Test rapido per verificare che gli elementi chiave di un bilancio reale
  // siano rappresentati nella nostra struttura

  await page.goto("/");

  await page.getByText("Nuovo audit").click();
  await page.getByPlaceholder("Nome azienda").fill("Maire Tecnimont Group");
  await page.getByPlaceholder("Fatturato (EUR)").fill("4200000000");
  await page.getByPlaceholder("Dipendenti").fill("9500");
  await page.getByPlaceholder("Totale attivo (EUR)").fill("3500000000");
  await page.getByRole("button", { name: "Crea" }).click();

  const betaToggle = page.getByLabel("Usa nuova checklist (beta)");
  if (await betaToggle.isVisible()) {
    await betaToggle.check();
  }

  // Verifica che tutte le sezioni ESRS rilevanti per Maire siano disponibili
  const expectedSections = [
    "Generale",
    "E1",
    "E2",
    "E3",
    "E4",
    "E5", // Environment - critico per industria
    "S1",
    "S2",
    "S3",
    "S4", // Social - importante per workforce
    "G1",
    "G2", // Governance - essenziale per quotata
  ];

  for (const section of expectedSections) {
    await expect(page.getByText(section, { exact: true })).toBeVisible();
  }

  // Verifica classificazione corretta (Grande impresa)
  await expect(page.locator("text=/Grande/i")).toBeVisible();

  console.log("✅ All key ESRS sections available for Maire Tecnimont profile");
  console.log("✅ Correct company size classification applied");
});
