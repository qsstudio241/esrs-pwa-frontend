// E2E test: KPI toggling in refactored checklist UI
const { test, expect } = require("@playwright/test");

test.describe("Refactored KPI interactions", () => {
  test("toggle KPI state and persist", async ({ page }) => {
    await page.goto("http://localhost:3000");

    // Create a new audit quickly
    await page.click("text=Nuovo audit");
    await page.fill('input[placeholder="Nome azienda"]', "KPI Test SpA");
    await page.fill('input[placeholder="Fatturato (EUR)"]', "20000000");
    await page.fill('input[placeholder="Dipendenti"]', "300");
    await page.fill('input[placeholder="Totale attivo (EUR)"]', "20000000");
    await page.click("text=Crea");

    // Enable refactored UI
    await page.check('label:has-text("Usa nuova checklist (beta)") >> input');

    // Open first category
    // Wait for refactored UI to mount and open first category
    await expect(
      page.locator('[aria-label="Checklist Refactored"]')
    ).toBeVisible();
    const firstHeader = page.locator('[role="button"][id^="hdr-"]').first();
    await firstHeader.click();

    // Find first item KPI button and click it
    const kpiBtn = page.locator('button[title="Cambia stato KPI"]').first();
    await expect(kpiBtn).toBeVisible();
    const initialText = await kpiBtn.textContent();
    await kpiBtn.click();

    // State should change
    await expect(kpiBtn).not.toHaveText(initialText || "—");

    // Reload and verify it persisted
    await page.reload();
    // Select the audit again (current selection isn't persisted across reload)
    await page.locator("select").selectOption({ index: 1 });
    await expect(
      page.locator('[aria-label="Checklist Refactored"]')
    ).toBeVisible();
    // Ensure refactored UI is enabled
    await page.check('label:has-text("Usa nuova checklist (beta)") >> input');
    const firstHeaderAfter = page
      .locator('[role="button"][id^="hdr-"]')
      .first();
    await firstHeaderAfter.click();
    const kpiBtnAfter = page
      .locator('button[title="Cambia stato KPI"]')
      .first();
    await expect(kpiBtnAfter).not.toHaveText(initialText || "—");
  });
});
