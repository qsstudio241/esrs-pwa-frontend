/* eslint-disable testing-library/prefer-screen-queries, testing-library/no-node-access, testing-library/no-await-sync-query */
const { test, expect } = require("@playwright/test");
const path = require("path");
const fs = require("fs");

function makeFakeXlsx() {
  const content = "Fake,Excel,Content\n1,2,3";
  return Buffer.from(content, "utf8");
}

const tmpDir = path.join(__dirname, ".tmp");
const xlsxPath = path.join(tmpDir, "sample.xlsx");

test.beforeAll(() => {
  if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });
  fs.writeFileSync(xlsxPath, makeFakeXlsx());
  // no second file needed for this stable test
});

test("legacy: Galleria shows link and allows removal", async ({ page }) => {
  await page.goto("/");

  await page.getByText("Nuovo audit").click();
  await page.getByPlaceholder("Nome azienda").fill("Acme Spa");
  await page.getByPlaceholder("Fatturato (EUR)").fill("2000000");
  await page.getByPlaceholder("Dipendenti").fill("20");
  await page.getByPlaceholder("Totale attivo (EUR)").fill("500000");
  await page.getByRole("button", { name: "Crea" }).click();

  const toggle = page.getByLabel("Usa nuova checklist (beta)");
  if (await toggle.isChecked()) {
    await toggle.click();
  }

  await expect(page.getByText("Checklist ESG")).toBeVisible();

  const galleryButton = page
    .getByRole("button", { name: "📁 Galleria" })
    .first();
  const [fileChooser] = await Promise.all([
    page.waitForEvent("filechooser"),
    galleryButton.click(),
  ]);
  await fileChooser.setFiles(xlsxPath);

  const link = page.getByRole("link", { name: "sample.xlsx" });
  await expect(link).toBeVisible();
  const item = page.locator("li", { has: link });

  const linksInItem = item.getByRole("link");
  await expect(linksInItem).toHaveCount(1);
  // remove the uploaded file and expect zero links
  await item.getByRole("button", { name: "Rimuovi" }).first().click();
  await expect(linksInItem).toHaveCount(0);
});
