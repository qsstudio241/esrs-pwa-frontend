import { test, expect } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";
import * as mammoth from "mammoth";

// Advanced test to verify Word document content completeness and accuracy
test("word document content verification", async ({ page }) => {
  await page.goto("/");

  // Create audit with specific test data
  await page.getByText("Nuovo audit").click();
  await page.getByPlaceholder("Nome azienda").fill("Test Completeness Ltd");
  await page.getByPlaceholder("Fatturato (EUR)").fill("12000000");
  await page.getByPlaceholder("Dipendenti").fill("85");
  await page.getByPlaceholder("Totale attivo (EUR)").fill("8000000");
  await page.getByRole("button", { name: "Crea" }).click();

  // Enable beta UI
  const betaToggle = page.getByLabel("Usa nuova checklist (beta)");
  if (await betaToggle.isVisible()) {
    await betaToggle.check();
  }

  // Fill specific items we'll verify in the Word document

  // 1. Fill Generale section with KPI
  await page.getByText("Generale", { exact: true }).click();

  // Try to fill KPI inputs if available
  const kpiButtons = page.locator('button:has-text("Verifica KPI")');
  if ((await kpiButtons.count()) > 0) {
    // Fill first KPI schema
    const numberInputs = page.locator('input[type="number"]');
    if ((await numberInputs.count()) > 0) {
      await numberInputs.first().fill("2500");
    }

    const selectInputs = page
      .locator("select")
      .filter({ hasNotText: "Nome azienda" });
    if ((await selectInputs.count()) > 0) {
      await selectInputs.first().selectOption({ index: 1 }); // Select first non-empty option
    }

    // Verify KPI
    await kpiButtons.first().click();
  }

  // 2. Fill Environmental section E1
  await page.getByText("E1", { exact: true }).click();

  // Mark first 2 items as "conforme"
  const e1StateButtons = page.locator("button[aria-pressed]").filter({
    has: page.locator("text=—"),
  });

  if ((await e1StateButtons.count()) >= 2) {
    await e1StateButtons.nth(0).click(); // First click -> "conforme"
    await page.waitForTimeout(200);
    await e1StateButtons.nth(1).click(); // First click -> "conforme"
    await page.waitForTimeout(200);
  }

  // 3. Fill Social section S1
  await page.getByText("S1", { exact: true }).click();

  const s1StateButtons = page.locator("button[aria-pressed]").filter({
    has: page.locator("text=—"),
  });

  if ((await s1StateButtons.count()) >= 1) {
    await s1StateButtons.nth(0).click(); // Mark as conforme
    await page.waitForTimeout(200);
    await s1StateButtons.nth(0).click(); // Click again -> "non conforme"
    await page.waitForTimeout(200);
  }

  // 4. Fill Governance section G1
  await page.getByText("G1", { exact: true }).click();

  const g1StateButtons = page.locator("button[aria-pressed]").filter({
    has: page.locator("text=—"),
  });

  if ((await g1StateButtons.count()) >= 1) {
    await g1StateButtons.nth(0).click(); // Mark as conforme
    await page.waitForTimeout(200);
  }

  // Export Word document
  const [wordDownload] = await Promise.all([
    page.waitForEvent("download", { timeout: 10000 }),
    page.getByRole("button", { name: "Esporta Word" }).click(),
  ]);

  expect(wordDownload).toBeDefined();

  // Save and analyze the Word document
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

  // Extract text content using mammoth
  const result = await mammoth.extractRawText({ path: downloadPath });
  const documentText = result.value;

  console.log("Document text length:", documentText.length);
  console.log("First 500 chars:", documentText.substring(0, 500));

  // Verify essential content is present

  // 1. Company information
  expect(documentText).toContain("Test Completeness Ltd");
  expect(documentText).toContain("12000000"); // Fatturato
  expect(documentText).toContain("85"); // Dipendenti
  expect(documentText).toContain("8000000"); // Attivo

  // 2. Section headers should be present
  const expectedSections = ["Generale", "ESRS E1", "ESRS S1", "ESRS G1"];

  for (const section of expectedSections) {
    expect(documentText.toLowerCase()).toContain(section.toLowerCase());
  }

  // 3. Status indicators should be present
  expect(documentText.toLowerCase()).toMatch(/(conforme|non conforme|n\/a)/);

  // 4. Document should have reasonable structure
  expect(documentText.length).toBeGreaterThan(1000); // Minimum content length

  // 5. Date should be present (current date)
  const today = new Date().toISOString().split("T")[0];
  const year = today.split("-")[0];
  expect(documentText).toContain(year);

  // Cleanup
  fs.unlinkSync(downloadPath);
  if (fs.existsSync(downloadDir) && fs.readdirSync(downloadDir).length === 0) {
    fs.rmdirSync(downloadDir);
  }

  console.log("✓ Word document content verification completed successfully");
});

test("word export sections completeness", async ({ page }) => {
  // Test to ensure all ESRS categories are covered in Word export
  await page.goto("/");

  await page.getByText("Nuovo audit").click();
  await page.getByPlaceholder("Nome azienda").fill("Full Coverage Corp");
  await page.getByPlaceholder("Fatturato (EUR)").fill("50000000"); // Grande impresa
  await page.getByPlaceholder("Dipendenti").fill("500");
  await page.getByPlaceholder("Totale attivo (EUR)").fill("40000000");
  await page.getByRole("button", { name: "Crea" }).click();

  // Enable beta UI
  const betaToggle = page.getByLabel("Usa nuova checklist (beta)");
  if (await betaToggle.isVisible()) {
    await betaToggle.check();
  }

  // Verify all major categories are visible before export
  const majorCategories = ["Generale", "E1", "E2", "S1", "S4", "G1"];

  for (const category of majorCategories) {
    await expect(page.getByText(category, { exact: true })).toBeVisible();
  }

  // Fill at least one item in each major category
  for (const category of majorCategories.slice(1)) {
    // Skip Generale (has different structure)
    await page.getByText(category, { exact: true }).click();

    const stateButtons = page.locator("button[aria-pressed]").filter({
      has: page.locator("text=—"),
    });

    if ((await stateButtons.count()) > 0) {
      await stateButtons.first().click(); // Mark first item as conforme
      await page.waitForTimeout(200);
    }
  }

  // Export and verify
  const [wordDownload] = await Promise.all([
    page.waitForEvent("download", { timeout: 10000 }),
    page.getByRole("button", { name: "Esporta Word" }).click(),
  ]);

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

  // Analyze content for all sections
  const result = await mammoth.extractRawText({ path: downloadPath });
  const documentText = result.value.toLowerCase();

  // Verify all categories are covered in the document
  const esrsSections = ["e1", "e2", "s1", "s4", "g1"];

  for (const section of esrsSections) {
    expect(documentText).toContain(`esrs ${section}`);
  }

  // Verify company classification is correct (Grande impresa)
  expect(documentText).toMatch(/(grande|large)/i);

  // Cleanup
  fs.unlinkSync(downloadPath);
  if (fs.existsSync(downloadDir) && fs.readdirSync(downloadDir).length === 0) {
    fs.rmdirSync(downloadDir);
  }

  console.log("✓ All ESRS sections verified in Word export");
});
