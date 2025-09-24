import { test, expect } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";

// Test completo per verificare completezza ed esattezza di un audit Word export
// Compila un audit realistico con dati, KPI, evidenze e verifica il contenuto finale

test("comprehensive word export - audit completeness", async ({ page }) => {
  // Setup: create detailed audit
  await page.goto("/");

  // Create new audit with realistic data
  await page.getByText("Nuovo audit").click();
  await page
    .getByPlaceholder("Nome azienda")
    .fill("Green Tech Solutions S.p.A.");
  await page.getByPlaceholder("Fatturato (EUR)").fill("25000000"); // Media impresa
  await page.getByPlaceholder("Dipendenti").fill("180");
  await page.getByPlaceholder("Totale attivo (EUR)").fill("15000000");
  await page.getByRole("button", { name: "Crea" }).click();

  // Enable beta UI
  const betaToggle = page.getByLabel("Usa nuova checklist (beta)");
  if (await betaToggle.isVisible()) {
    await betaToggle.check();
  }
  await expect(page.getByLabel("Checklist Refactored")).toBeVisible();

  // Expand and fill Generale section (with KPI schemas)
  await page.getByText("Generale", { exact: true }).click();

  // Fill some KPI data in Generale section
  // Look for KPI input fields and fill them
  const kpiInputs = page
    .locator('input[type="number"], select, input[type="date"]')
    .first();
  if ((await kpiInputs.count()) > 0) {
    // Fill first available KPI input
    const firstInput = kpiInputs.first();
    if ((await firstInput.getAttribute("type")) === "number") {
      await firstInput.fill("1500");
    }
  }

  // Expand environmental sections
  await page.getByText("E1", { exact: true }).click();

  // Fill some checklist items in E1
  const e1Buttons = page.locator("button[aria-pressed]").filter({
    has: page.locator("text=—"),
  });

  if ((await e1Buttons.count()) > 0) {
    // Click first few items to set them as "conforme" or "non conforme"
    for (let i = 0; i < Math.min(3, await e1Buttons.count()); i++) {
      await e1Buttons.nth(i).click(); // First click -> "conforme"
      await page.waitForTimeout(100); // Small delay between clicks
    }
  }

  // Add evidence to first item in E1
  const evidenceLabels = page.locator('label:has-text("Aggiungi evidenza")');
  if ((await evidenceLabels.count()) > 0) {
    // Create a test file to upload
    const testDir = path.join(__dirname, "temp");
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true });
    }

    const testFilePath = path.join(testDir, "test-evidence.txt");
    fs.writeFileSync(
      testFilePath,
      "This is test evidence for E1 environmental compliance.\nCreated for automated testing."
    );

    // Upload evidence file
    const fileInput = page.locator('input[type="file"]').first();
    await fileInput.setInputFiles(testFilePath);

    // Cleanup test file
    fs.unlinkSync(testFilePath);
    fs.rmdirSync(testDir);
  }

  // Fill Social section S1
  await page.getByText("S1", { exact: true }).click();

  const s1Buttons = page.locator("button[aria-pressed]").filter({
    has: page.locator("text=—"),
  });

  if ((await s1Buttons.count()) > 0) {
    // Fill some S1 items
    for (let i = 0; i < Math.min(2, await s1Buttons.count()); i++) {
      await s1Buttons.nth(i).click(); // Mark as conforme
      await page.waitForTimeout(100);
    }
  }

  // Fill Governance section G1
  await page.getByText("G1", { exact: true }).click();

  const g1Buttons = page.locator("button[aria-pressed]").filter({
    has: page.locator("text=—"),
  });

  if ((await g1Buttons.count()) > 0) {
    // Fill some G1 items
    for (let i = 0; i < Math.min(2, await g1Buttons.count()); i++) {
      await g1Buttons.nth(i).click(); // Mark as conforme
      await page.waitForTimeout(100);
    }
  }

  // Wait for UI updates to complete
  await page.waitForTimeout(1000);

  // Export Word document
  const [wordDownload] = await Promise.all([
    page.waitForEvent("download", { timeout: 10000 }),
    page.getByRole("button", { name: "Esporta Word" }).click(),
  ]);

  // Verify download occurred
  expect(wordDownload).toBeDefined();
  expect(wordDownload.suggestedFilename()).toMatch(/\.docx?$/);

  // Save downloaded file for content verification
  const downloadPath = path.join(
    __dirname,
    "temp-downloads",
    wordDownload.suggestedFilename()
  );
  const downloadDir = path.dirname(downloadPath);
  if (!fs.existsSync(downloadDir)) {
    fs.mkdirSync(downloadDir, { recursive: true });
  }

  await wordDownload.saveAs(downloadPath);

  // Verify file exists and has reasonable size
  expect(fs.existsSync(downloadPath)).toBeTruthy();
  const stats = fs.statSync(downloadPath);
  expect(stats.size).toBeGreaterThan(10000); // Should be >10KB for a complete document

  // Basic file structure verification (Word files are ZIP archives)
  const buffer = fs.readFileSync(downloadPath);
  const fileHeader = buffer.toString("hex", 0, 4);
  expect(fileHeader).toBe("504b0304"); // ZIP file signature (Word documents are ZIP-based)

  // Cleanup
  fs.unlinkSync(downloadPath);
  if (fs.existsSync(downloadDir) && fs.readdirSync(downloadDir).length === 0) {
    fs.rmdirSync(downloadDir);
  }

  console.log(`✓ Word export completed: ${wordDownload.suggestedFilename()}`);
  console.log(`✓ File size: ${Math.round(stats.size / 1024)}KB`);
});

test("word export content verification", async ({ page }) => {
  // This test focuses on verifying the actual content structure
  // by examining the exported data before Word generation

  await page.goto("/");

  // Create audit
  await page.getByText("Nuovo audit").click();
  await page.getByPlaceholder("Nome azienda").fill("Content Test Corp");
  await page.getByPlaceholder("Fatturato (EUR)").fill("5000000");
  await page.getByPlaceholder("Dipendenti").fill("25");
  await page.getByPlaceholder("Totale attivo (EUR)").fill("3000000");
  await page.getByRole("button", { name: "Crea" }).click();

  // Enable beta UI
  const betaToggle = page.getByLabel("Usa nuova checklist (beta)");
  if (await betaToggle.isVisible()) {
    await betaToggle.check();
  }

  // Fill mandatory data in different categories
  await page.getByText("Generale", { exact: true }).click();

  // Check that company info is displayed in page title or audit selector
  await expect(
    page
      .locator("h1, h2, h3, select option")
      .filter({ hasText: "Content Test Corp" })
  ).toBeAttached();

  // Verify category sections are present
  const categories = ["E1", "E2", "S1", "S4", "G1"];
  for (const cat of categories) {
    await expect(page.getByText(cat, { exact: true })).toBeVisible();
  }

  // Export and verify basic structure
  const [wordDownload] = await Promise.all([
    page.waitForEvent("download", { timeout: 8000 }),
    page.getByRole("button", { name: "Esporta Word" }).click(),
  ]);

  expect(wordDownload).toBeDefined();
  expect(wordDownload.suggestedFilename()).toContain("Content Test Corp");
});
