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

    // Wait for refactored UI to mount and open a non-Generale category (E1)
    await expect(
      page.locator('[aria-label="Checklist Refactored"]')
    ).toBeVisible();
    const e1Header = page.getByRole("button", { name: "E1" });
    await expect(e1Header).toBeVisible();
    const e1List = page.locator('[aria-label="Lista items E1"]');
    // Open E1 if not expanded
    const expanded = await e1Header.getAttribute("aria-expanded");
    if (expanded !== "true") {
      await e1Header.click();
    }
    await expect(e1List).toBeVisible();

    // Find first item KPI button and click it
    const kpiBtn = page.locator('button[title="Cambia stato KPI"]').first();
    await expect(kpiBtn).toBeVisible();
    const initialText = await kpiBtn.textContent();
    await kpiBtn.click();

    // State should change
    await expect(kpiBtn).not.toHaveText(initialText || "—");

    // Reload and verify it persisted
    await page.reload();
    // Select the audit again by label to avoid index flakiness
    await page.locator("select").waitFor();
    const opt = page
      .locator("select option")
      .filter({ hasText: "KPI Test SpA" })
      .first();
    const optValue = await opt.getAttribute("value");
    await page.locator("select").selectOption({ value: optValue });
    // Ensure refactored UI is enabled first, then wait for it to appear
    await page.check('label:has-text("Usa nuova checklist (beta)") >> input');
    await expect(
      page.locator('[aria-label="Checklist Refactored"]')
    ).toBeVisible();
    const e1HeaderAfter = page.getByRole("button", { name: "E1" });
    await expect(e1HeaderAfter).toBeVisible();
    const e1ListAfter = page.locator('[aria-label="Lista items E1"]');
    const expandedAfter = await e1HeaderAfter.getAttribute("aria-expanded");
    if (expandedAfter !== "true") {
      await e1HeaderAfter.click();
    }
    await expect(e1ListAfter).toBeVisible();
    // Wait for KPI toggle buttons to render under E1
    const kpiBtnAfter = page
      .locator('button[title="Cambia stato KPI"]')
      .first();
    await kpiBtnAfter.waitFor({ state: "attached" });
    await expect(kpiBtnAfter).toBeVisible();
    await expect(kpiBtnAfter).not.toHaveText(initialText || "—");
  });
});
