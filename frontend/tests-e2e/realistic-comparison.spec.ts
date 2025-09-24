import { test, expect } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";
import * as mammoth from "mammoth";

// Test semplificato per confrontare output app con bilancio reale Maire Tecnimont
// Verifica che i dati e la struttura siano coerenti con standard di mercato

test("maire tecnimont - baseline data validation", async ({ page }) => {
  await page.goto("/");

  // Crea audit con dati Maire Tecnimont (dati pubblici approssimativi)
  await page.getByText("Nuovo audit").click();
  await page
    .getByPlaceholder("Nome azienda")
    .fill("Maire Tecnimont Group S.p.A.");
  await page.getByPlaceholder("Fatturato (EUR)").fill("4200000000"); // ~4.2B EUR (2023)
  await page.getByPlaceholder("Dipendenti").fill("9500"); // ~9,500 dipendenti
  await page.getByPlaceholder("Totale attivo (EUR)").fill("3500000000"); // ~3.5B EUR
  await page.getByRole("button", { name: "Crea" }).click();

  // Attiva beta UI
  const betaToggle = page.getByLabel("Usa nuova checklist (beta)");
  if (await betaToggle.isVisible()) {
    await betaToggle.check();
  }

  await expect(page.getByLabel("Checklist Refactored")).toBeVisible();

  // Verifica che sia classificata come "Grande" impresa
  // (fatturato >40M€ E dipendenti >250 E attivo >20M€)
  await expect(page.locator("text=/Grande/i")).toBeAttached();

  // Verifica presenza sezioni ESRS essenziali per azienda quotata industriale
  const criticalSections = ["Generale", "E1", "S1", "G1"];
  for (const section of criticalSections) {
    await expect(page.getByText(section, { exact: true })).toBeVisible();
  }

  // Compila rapidamente alcuni elementi per testare export
  await page.getByText("E1", { exact: true }).click();

  // Trova primi 3 elementi E1 e marcali come conformi
  const e1Buttons = page.locator('button[aria-pressed="false"]').filter({
    has: page.locator("text=—"),
  });

  const maxItems = Math.min(3, await e1Buttons.count());
  for (let i = 0; i < maxItems; i++) {
    try {
      await e1Buttons.nth(i).click({ timeout: 2000 });
      await page.waitForTimeout(300);
    } catch (e) {
      console.log(`Skipped item ${i} due to timeout`);
    }
  }

  // Wait per salvare stato
  await page.waitForTimeout(1500);

  // Export Word
  const [wordDownload] = await Promise.all([
    page.waitForEvent("download", { timeout: 12000 }),
    page.getByRole("button", { name: "Esporta Word" }).click(),
  ]);

  expect(wordDownload).toBeDefined();
  const filename = wordDownload.suggestedFilename();
  expect(filename).toContain("Maire_Tecnimont");

  // Analisi contenuto Word
  const downloadPath = path.join(__dirname, "temp-maire-analysis", filename);
  const downloadDir = path.dirname(downloadPath);
  if (!fs.existsSync(downloadDir)) {
    fs.mkdirSync(downloadDir, { recursive: true });
  }

  await wordDownload.saveAs(downloadPath);

  // Estrai testo dal documento Word
  const result = await mammoth.extractRawText({ path: downloadPath });
  const documentText = result.value;
  const fileSize = fs.statSync(downloadPath).size;

  console.log("=== MAIRE TECNIMONT SUSTAINABILITY REPORT ANALYSIS ===");
  console.log(`Generated file: ${filename}`);
  console.log(`Document size: ${Math.round(fileSize / 1024)}KB`);
  console.log(`Text length: ${documentText.length} characters`);

  // === VALIDAZIONI CRITICHE PER CONFRONTO CON BILANCIO REALE ===

  // 1. Dati aziendali corretti
  expect(documentText).toContain("Maire Tecnimont Group S.p.A.");
  expect(documentText).toContain("Grande"); // Classificazione dimensionale
  expect(documentText).toContain("4200000000"); // Fatturato
  expect(documentText).toContain("9500"); // Dipendenti

  // 2. Anno di riferimento corretto
  expect(documentText).toContain("2025"); // Anno audit

  // 3. Struttura documento professionale
  const requiredSections = [
    "executive summary",
    "dati aziendali",
    "sezioni esrs",
    "kpi",
    "evidenze",
    "raccomandazioni",
  ];

  let sectionsFound = 0;
  for (const section of requiredSections) {
    if (documentText.toLowerCase().includes(section)) {
      sectionsFound++;
    }
  }
  expect(sectionsFound).toBeGreaterThanOrEqual(4); // Almeno 4/6 sezioni presenti

  // 4. Dimensioni appropriate per azienda quotata
  expect(fileSize).toBeGreaterThan(5000); // >5KB documento serio
  expect(documentText.length).toBeGreaterThan(800); // >800 caratteri contenuto

  // 5. Elementi ESRS environment presenti (critico per industria)
  const hasEnvironmentalContent =
    documentText.toLowerCase().includes("e1") ||
    documentText.toLowerCase().includes("climat") ||
    documentText.toLowerCase().includes("ambiente");
  expect(hasEnvironmentalContent).toBeTruthy();

  // 6. Presenza metadati audit
  expect(documentText).toMatch(/\d+%/); // Percentuale completamento
  expect(documentText).toContain("24/09/2025"); // Data generazione

  console.log("✅ VALIDATION RESULTS:");
  console.log(
    `  ✓ Company data: Maire Tecnimont Group S.p.A. (Grande impresa)`
  );
  console.log(`  ✓ Financial data: €4.2B revenue, 9,500 employees`);
  console.log(`  ✓ Document structure: ${sectionsFound}/6 sections present`);
  console.log(
    `  ✓ Content depth: ${Math.round(fileSize / 1024)}KB, ${
      documentText.length
    } chars`
  );
  console.log(`  ✓ ESRS compliance: Environmental sections included`);

  // === CONFRONTO CON STANDARD BILANCI REALI ===

  // Elementi che dovrebbero essere presenti in un bilancio Maire reale:
  const realWorldElements = {
    "Corporate data": documentText.includes("Maire Tecnimont"),
    "Size classification": documentText.toLowerCase().includes("grande"),
    "Governance section":
      documentText.toLowerCase().includes("governance") ||
      documentText.toLowerCase().includes("g1"),
    "Environmental section":
      documentText.toLowerCase().includes("ambient") ||
      documentText.toLowerCase().includes("e1"),
    "Social section":
      documentText.toLowerCase().includes("social") ||
      documentText.toLowerCase().includes("s1"),
    "Completion tracking": /\d+%/.test(documentText),
    "Date stamp": documentText.includes("2025"),
  };

  let validElements = 0;
  console.log("\n=== REAL-WORLD SUSTAINABILITY REPORT ELEMENTS ===");
  for (const [element, present] of Object.entries(realWorldElements)) {
    console.log(
      `  ${present ? "✓" : "✗"} ${element}: ${present ? "Present" : "Missing"}`
    );
    if (present) validElements++;
  }

  // Deve avere almeno 5/7 elementi per essere comparabile a bilancio reale
  expect(validElements).toBeGreaterThanOrEqual(5);

  console.log(
    `\n🎯 REALITY CHECK: ${validElements}/7 elements match real sustainability reports`
  );
  console.log(
    `📊 This output would be ${
      validElements >= 6 ? "SUITABLE" : "NEEDS IMPROVEMENT"
    } for comparison with Maire's published sustainability report`
  );

  // Cleanup
  fs.unlinkSync(downloadPath);
  if (fs.existsSync(downloadDir) && fs.readdirSync(downloadDir).length === 0) {
    fs.rmdirSync(downloadDir);
  }
});

test("sustainability report completeness benchmark", async ({ page }) => {
  // Test rapido per confrontare completezza con standard di mercato

  await page.goto("/");

  await page.getByText("Nuovo audit").click();
  await page.getByPlaceholder("Nome azienda").fill("Benchmark Company S.p.A.");
  await page.getByPlaceholder("Fatturato (EUR)").fill("1000000000"); // 1B EUR
  await page.getByPlaceholder("Dipendenti").fill("5000");
  await page.getByPlaceholder("Totale attivo (EUR)").fill("800000000");
  await page.getByRole("button", { name: "Crea" }).click();

  const betaToggle = page.getByLabel("Usa nuova checklist (beta)");
  if (await betaToggle.isVisible()) {
    await betaToggle.check();
  }

  // Verifica che abbiamo copertura completa ESRS per grandi aziende
  const allESRSStandards = [
    "E1",
    "E2",
    "E3",
    "E4",
    "E5", // Environmental
    "S1",
    "S2",
    "S3",
    "S4", // Social
    "G1",
    "G2", // Governance
  ];

  let availableStandards = 0;
  for (const standard of allESRSStandards) {
    if (await page.getByText(standard, { exact: true }).isVisible()) {
      availableStandards++;
    }
  }

  console.log(
    `📋 ESRS Coverage: ${availableStandards}/${allESRSStandards.length} standards available`
  );

  // Per aziende grandi dovremmo avere almeno 8/10 standard
  expect(availableStandards).toBeGreaterThanOrEqual(8);

  console.log(
    "✅ App provides comprehensive ESRS coverage suitable for large company benchmarking"
  );
});
